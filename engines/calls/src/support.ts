import { COUNTRIES, DAY_MS, addDays } from "@lumen/config";
import type { OrderRow } from "@lumen/db";
import type { EngineDeps } from "./deps";
import { composeMessage } from "./emails";
import type { RefundService } from "./refunds";
import { WINDOW_HOURS, MIN_START_HOUR, MAX_START_HOUR } from "./orders";
import { baseProps, iso, localToUtc } from "./util";
import { isValidTimezone } from "./window";
import type { Language } from "./types";

/** Support agent stub. Four tools and hard limits; the planner (rules today, an LLM later) only chooses which tool to call. */
export const SUPPORT_TOOLS = ["resend_delivery", "reschedule_call", "refund", "escalate"] as const;
export type SupportToolName = (typeof SUPPORT_TOOLS)[number];

/** Support may refund up to this amount by itself (docs/reglas-de-decision.md: reembolsos <= $50 por caso). */
export const SUPPORT_REFUND_CAP_USD_CENTS = 5000;

export interface SupportTicket {
  orderId: string;
  /** Must match the order e-mail: this is how the stub identifies the customer. */
  email: string;
  message: string;
  /** Optional structured request, e.g. from the reschedule form. */
  reschedule?: { date: string; windowStartHour: number; timezone?: string };
}

export interface ToolCall {
  tool: SupportToolName;
  args?: Record<string, unknown>;
}
export type ToolOutcome = { ok: true; detail: string } | { ok: false; detail: string };

/** Planner interface: swap the rule-based stub for an LLM planner without touching the tools. */
export interface SupportPlanner {
  plan(ticket: SupportTicket, order: OrderRow): Promise<ToolCall>;
}

export class RuleBasedPlanner implements SupportPlanner {
  async plan(ticket: SupportTicket): Promise<ToolCall> {
    const m = ticket.message.toLowerCase();
    if (/reembols|devoluci|refund|money back|cancel/.test(m)) return { tool: "refund", args: { reason: "support" } };
    if (/reprogram|otra hora|otro d[ií]a|cambiar (la )?(hora|fecha)|reschedule|another time/.test(m) && ticket.reschedule) return { tool: "reschedule_call", args: { ...ticket.reschedule } };
    if (/no (me )?lleg|no recib|enlace|link|grabaci|recording|didn.t (get|receive)|descargar|download/.test(m)) return { tool: "resend_delivery" };
    return { tool: "escalate", args: { note: "Unclassified request" } };
  }
}

export class SupportAgent {
  constructor(
    private readonly d: EngineDeps,
    private readonly refunds: RefundService,
    private readonly planner: SupportPlanner = new RuleBasedPlanner(),
  ) {}

  async handle(ticket: SupportTicket): Promise<{ call: ToolCall; outcome: ToolOutcome }> {
    const order = await this.d.db.orders.get(ticket.orderId);
    if (!order || !order.email || order.email.toLowerCase() !== ticket.email.trim().toLowerCase()) {
      return { call: { tool: "escalate" }, outcome: { ok: false, detail: "identity_not_verified" } };
    }
    const call = await this.planner.plan(ticket, order);
    return { call, outcome: await this.run(call, order) };
  }

  /** Executes one tool with its limits. Anything outside the limits becomes an escalation. */
  async run(call: ToolCall, order: OrderRow): Promise<ToolOutcome> {
    switch (call.tool) {
      case "resend_delivery":
        return this.resendDelivery(order);
      case "reschedule_call":
        return this.rescheduleCall(order, call.args as { date: string; windowStartHour: number; timezone?: string });
      case "refund":
        return this.refund(order);
      case "escalate":
        return this.escalate(order, String(call.args?.note ?? "Escalated by support agent"));
      default:
        return this.escalate(order, `Unknown tool ${(call as ToolCall).tool}`);
    }
  }

  private async resendDelivery(order: OrderRow): Promise<ToolOutcome> {
    if (order.status !== "delivered" || order.pii_purged_at || !order.email) return this.escalate(order, "resend_delivery: nothing delivered or data already deleted");
    const lang = order.language as Language;
    const msg = composeMessage("delivery", lang, order.email, {
      childName: order.child_first_name ?? "",
      deliveryLink: `${this.d.brand.domain}/${lang}/entrega/${order.access_token}`,
      linkExpires: order.purge_at ? order.purge_at.slice(0, 10) : "",
      holder: this.d.brand.holder,
      privacyEmail: this.d.brand.privacyEmail,
      supportEmail: this.d.brand.supportEmail,
      brand: this.d.brand.brand,
    });
    const res = await this.d.delivery.send(msg);
    return res.status === "failed" ? this.escalate(order, "resend_delivery: email provider failed") : { ok: true, detail: "delivery_resent" };
  }

  private async rescheduleCall(order: OrderRow, args: { date: string; windowStartHour: number; timezone?: string }): Promise<ToolOutcome> {
    if (order.status !== "scheduled") return this.escalate(order, `reschedule_call: order is ${order.status}`);
    if (!args?.date || !Number.isInteger(args.windowStartHour) || args.windowStartHour < MIN_START_HOUR || args.windowStartHour > MAX_START_HOUR) {
      return this.escalate(order, "reschedule_call: invalid window");
    }
    const tz = args.timezone ?? order.timezone;
    if (!isValidTimezone(tz)) return this.escalate(order, "reschedule_call: invalid timezone");
    const start = localToUtc(args.date, args.windowStartHour, tz);
    const end = new Date(start.getTime() + WINDOW_HOURS * 3600_000);
    if (end.getTime() < this.d.now().getTime() + 20 * 60_000) return this.escalate(order, "reschedule_call: window in the past");
    if (start.getTime() > this.d.now().getTime() + 90 * DAY_MS) return this.escalate(order, "reschedule_call: too far ahead");
    // Only before any attempt has been made: a moved window must never create an extra call.
    const attempts = await this.d.db.calls.find({ order_id: order.id });
    if (attempts.length > 0) return this.escalate(order, "reschedule_call: an attempt already happened");
    await this.d.db.orders.update(order.id, { window_start: iso(start), window_end: iso(end), timezone: tz, purge_at: iso(addDays(end, 30)) });
    await this.d.dispatcher.send("order/scheduled", { orderId: order.id, windowStart: iso(start) });
    return { ok: true, detail: "rescheduled" };
  }

  private async refund(order: OrderRow): Promise<ToolOutcome> {
    if (order.amount_usd_cents > SUPPORT_REFUND_CAP_USD_CENTS) return this.escalate(order, "refund: above the $50 support cap");
    // Terms: up to 7 days after delivery (or after the call date if never delivered).
    const base = new Date(order.delivered_at ?? order.window_end).getTime();
    if (this.d.now().getTime() > base + 7 * DAY_MS) return this.escalate(order, "refund: outside the 7-day window");
    const out = await this.refunds.refund(order.id, { reason: "support", automatic: false });
    return out.refunded ? { ok: true, detail: "refunded" } : this.escalate(order, `refund: ${out.reason}`);
  }

  private async escalate(order: OrderRow, note: string): Promise<ToolOutcome> {
    const to = this.d.env.ESCALATION_EMAIL ?? this.d.env.OWNER_ALERT_EMAIL;
    if (to) {
      await this.d.delivery.send({
        kind: "ops",
        to,
        subject: `[Support escalation] order ${order.id}`,
        text: `Order: ${order.id}\nProduct: ${order.product} Country: ${COUNTRIES[order.country].code}\nStatus: ${order.status}\nNote: ${note}\nNo customer text is stored in this alert.`,
      });
    }
    await this.d.tracker.track("incident_flagged", { ...baseProps(order), incident_type: "support_escalation" });
    return { ok: false, detail: `escalated: ${note}` };
  }
}
