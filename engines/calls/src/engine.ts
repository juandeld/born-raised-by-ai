import type { CallRow } from "@lumen/db";
import { getPreludeTexts, type TextLocale } from "@lumen/legal";
import type { PaymentEvent } from "@lumen/payments";
import { CallController } from "./controller";
import type { Dispatcher, EngineDeps } from "./deps";
import { buildAgentConfig } from "./guardrails/config";
import { OrderService } from "./orders";
import { PostCall } from "./post-call";
import { RefundService } from "./refunds";
import { RetentionJob } from "./retention";
import { CallScheduler, type AfterCallOutcome, type AttemptOutcome } from "./scheduler";
import { SupportAgent } from "./support";
import { AgentTools } from "./tools";
import { MockTelephonyProvider } from "./providers/telephony-mock";
import type { Language } from "./types";
import { baseProps, iso } from "./util";

export interface DeliveryView {
  status: "pending" | "ready" | "expired" | "refunded";
  language: string;
  childFirstName: string | null;
  expiresAt: string | null;
  hasMp3: boolean;
  hasPdf: boolean;
  surveyAnswered: boolean;
  windowStart: string;
  windowEnd: string;
  timezone: string;
}

/**
 * Facade of the calls engine. Everything a product needs: checkout, payment confirmation, scheduling, call control,
 * delivery, refunds, support, retention. Products configure it (product config + texts); they do not fork it.
 */
export interface TickReport {
  swept: number;
  recovered: number;
  attempts: Array<{ orderId: string; kind: string; reason?: string }>;
  errors: string[];
}

export class CallsEngine {
  readonly orders: OrderService;
  readonly refunds: RefundService;
  readonly controller: CallController;
  readonly scheduler: CallScheduler;
  readonly postCall: PostCall;
  readonly tools: AgentTools;
  readonly support: SupportAgent;
  readonly retention: RetentionJob;

  constructor(readonly deps: EngineDeps) {
    this.refunds = new RefundService(deps);
    this.orders = new OrderService(deps);
    this.controller = new CallController(deps);
    this.scheduler = new CallScheduler(deps, this.refunds);
    this.postCall = new PostCall(deps);
    this.tools = new AgentTools(deps);
    this.support = new SupportAgent(deps, this.refunds);
    this.retention = new RetentionJob(deps);

    this.controller.onFinalized = async (callId) => {
      const call = await deps.db.calls.get(callId);
      await deps.dispatcher.send("call/ended", { callId, orderId: call?.order_id });
    };
    this.tools.onOptOut = async (order) => {
      await this.refunds.refund(order.id, { reason: "opt_out", automatic: true });
    };
    if (deps.telephony instanceof MockTelephonyProvider) {
      deps.telephony.attach((callId, event, opts) => this.controller.handleEvent(callId, event, opts));
    }
  }

  /** Creates or updates the voice agents so the vendor always matches the guardrails in this repository. */
  async syncAgents(languages: Language[] = ["es-419", "es-ES", "en"]): Promise<Record<string, string>> {
    for (const language of languages) {
      const prelude = getPreludeTexts(this.deps.product.slug, language === "en" ? "en-US" : (language as TextLocale));
      // The first message is the character's first line, spoken only after the second key 1. {{child_name}} is a dynamic variable (name used by the live agent).
      const firstMessage = prelude.firstLine.replace("{{NOMBRE_NIÑO}}", "{{child_name}}");
      const config = buildAgentConfig({ product: this.deps.product, character: this.deps.product.slug, language, firstMessage, brand: this.deps.brand.brand });
      const { agentId } = await this.deps.voice.syncAgent(config, this.deps.agentIds[language] || undefined);
      this.deps.agentIds[language] = agentId;
    }
    return this.deps.agentIds;
  }

  async handlePaymentEvent(event: PaymentEvent): Promise<void> {
    if (event.type === "payment_succeeded") {
      await this.orders.confirmPayment(event);
    } else if (event.type === "refunded") {
      let order = event.orderId ? await this.deps.db.orders.get(event.orderId) : null;
      if (!order && event.paymentId) order = (await this.deps.db.orders.find({ payment_id: event.paymentId }, { limit: 1 }))[0] ?? null;
      if (order && order.status !== "refunded") {
        await this.deps.db.orders.update(order.id, { status: "refunded", refunded_at: iso(this.deps.now()), refund_reason: "provider", purge_at: iso(this.deps.now()) });
      }
    }
  }

  async optOutByLink(accessToken: string): Promise<boolean> {
    const order = await this.orders.optOutByLink(accessToken);
    if (!order) return false;
    await this.refunds.refund(order.id, { reason: "opt_out", automatic: true });
    return true;
  }

  /** Refund link in the receipt: automatic, no human (terms section 5). */
  async refundByLink(accessToken: string): Promise<{ refunded: boolean; reason?: string }> {
    const order = (await this.deps.db.orders.find({ access_token: accessToken }, { limit: 1 }))[0];
    if (!order) return { refunded: false, reason: "not_found" };
    const base = new Date(order.delivered_at ?? order.window_end).getTime();
    if (this.deps.now().getTime() > base + this.deps.product.refundWindowDays * 86_400_000) return { refunded: false, reason: "outside_window" };
    const out = await this.refunds.refund(order.id, { reason: "customer_request", automatic: false });
    return out;
  }

  /** One-tap survey on the delivery page. Stores the answer on the delivery row and emits the event. */
  async answerSurvey(accessToken: string, answer: "loved" | "ok" | "bad"): Promise<boolean> {
    if (!["loved", "ok", "bad"].includes(answer)) return false;
    const order = (await this.deps.db.orders.find({ access_token: accessToken }, { limit: 1 }))[0];
    if (!order) return false;
    const delivery = (await this.deps.db.deliveries.find({ order_id: order.id, kind: "delivery" }, { limit: 1 }))[0];
    if (!delivery || delivery.survey_answer) return false; // one answer per order
    await this.deps.db.deliveries.update(delivery.id, { survey_answer: answer, survey_at: iso(this.deps.now()) });
    await this.deps.tracker.track("survey_answered", { ...baseProps(order), answer });
    return true;
  }

  /** What the delivery page needs, by access token. Never exposes storage paths. */
  async getDeliveryView(accessToken: string): Promise<DeliveryView | null> {
    const order = (await this.deps.db.orders.find({ access_token: accessToken }, { limit: 1 }))[0];
    if (!order) return null;
    const delivery = (await this.deps.db.deliveries.find({ order_id: order.id, kind: "delivery" }, { limit: 1 }))[0];
    const now = this.deps.now();
    const expired = !!order.pii_purged_at || (delivery?.link_expires_at ? new Date(delivery.link_expires_at) < now : false);
    const status: DeliveryView["status"] = order.status === "refunded" ? "refunded" : expired ? "expired" : delivery?.mp3_path ? "ready" : "pending";
    return {
      status,
      language: order.language,
      childFirstName: order.pii_purged_at ? null : order.child_first_name,
      expiresAt: delivery?.link_expires_at ?? null,
      hasMp3: status === "ready" && !!delivery?.mp3_path,
      hasPdf: status === "ready" && !!delivery?.pdf_path,
      surveyAnswered: !!delivery?.survey_answer,
      windowStart: order.window_start,
      windowEnd: order.window_end,
      timezone: order.timezone,
    };
  }

  /** Streams a delivery file after checking token, expiry and purge. */
  async readDeliveryFile(accessToken: string, kind: "mp3" | "pdf"): Promise<{ bytes: Uint8Array; contentType: string; filename: string } | null> {
    const view = await this.getDeliveryView(accessToken);
    if (!view || view.status !== "ready") return null;
    const order = (await this.deps.db.orders.find({ access_token: accessToken }, { limit: 1 }))[0]!;
    const delivery = (await this.deps.db.deliveries.find({ order_id: order.id, kind: "delivery" }, { limit: 1 }))[0]!;
    const path = kind === "mp3" ? delivery.mp3_path : delivery.pdf_path;
    if (!path) return null;
    const file = await this.deps.storage.get(path);
    return file ? { ...file, filename: kind === "mp3" ? "llamada.mp3" : "certificado.pdf" } : null;
  }

  /** One scheduling step; the Inngest function loops on it. */
  attemptCall(orderId: string): Promise<AttemptOutcome> {
    return this.scheduler.attempt(orderId);
  }

  /** Logs a post-call failure as an ops event (no PII) so the minute tick / ops can see and retry it. Never throws. */
  async recordPostCallFailure(callId: string, err: unknown): Promise<void> {
    try {
      const call = await this.deps.db.calls.get(callId);
      const order = call ? await this.deps.db.orders.get(call.order_id) : null;
      const error = (err instanceof Error ? err.message : String(err)).replace(/[^\s@"]+@[^\s@"]+/g, "<email>").replace(/\+\d{6,}/g, "<phone>").slice(0, 300);
      await this.deps.tracker.track("post_call_failed", { ...(order ? baseProps(order) : { product: this.deps.product.slug, country: "", language: "", creative: "", device: "unknown" as const }), call_id: callId, error });
    } catch {
      /* logging must not break the webhook */
    }
  }

  /** After an attempt ends: deliver, retry later inside the window, or refund. */
  async afterCall(callId: string): Promise<AfterCallOutcome> {
    const call = await this.deps.db.calls.get(callId);
    if (!call || call.status !== "ended") return { kind: "nothing" };
    const plan = await this.scheduler.planAfter(call);
    switch (plan.kind) {
      case "deliver": {
        const out = await this.postCall.run(call);
        return out.kind === "delivered" ? { kind: "delivered" } : { kind: "recording_pending", retryAt: out.retryAt };
      }
      case "retry":
        await this.deps.dispatcher.send("call/retry", { orderId: call.order_id, at: iso(plan.at) });
        return { kind: "retry", at: plan.at };
      case "refund":
        await this.refunds.refund(call.order_id, { reason: plan.reason, automatic: true });
        return { kind: "refunded", reason: plan.reason };
      case "opted_out":
        await this.refunds.refund(call.order_id, { reason: "opt_out", automatic: true });
        return { kind: "opted_out" };
    }
  }

  /**
   * One pass of the job that Inngest would otherwise run (used where Inngest is not configured, called by /api/cron/tick
   * every minute from an external ping): closes stuck calls, finishes post-call work that was waiting for the recording,
   * and dials every scheduled order whose window is open. Idempotent: attemptCall already refuses an order with a call in
   * progress, and the database allows only one active call per order (migration 0003).
   */
  async tick(opts: { maxAttempts?: number } = {}): Promise<TickReport> {
    const d = this.deps;
    const report: TickReport = { swept: 0, recovered: 0, attempts: [], errors: [] };
    const guard = async (label: string, fn: () => Promise<void>) => {
      try {
        await fn();
      } catch (err) {
        report.errors.push(`${label}: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    await guard("sweep", async () => {
      report.swept = await this.sweepStuckCalls();
    });
    // Completed calls whose recording was not ready when the call ended: the vendor copy is still there (recording_id set).
    await guard("recover", async () => {
      const pending = await d.db.calls.find({ status: "ended", result: "completed", recording_id: { notNull: true } }, { limit: 20 });
      for (const call of pending) {
        try {
          const out = await this.afterCall(call.id);
          if (out.kind === "delivered") report.recovered += 1;
        } catch (err) {
          await this.recordPostCallFailure(call.id, err);
          report.errors.push(`recover ${call.id}: ${err instanceof Error ? err.message.slice(0, 200) : "failed"}`);
        }
      }
    });
    // Scheduled orders whose window has opened (closed windows too: attempt() refunds them automatically).
    const due = await d.db.orders.find({ status: "scheduled", window_start: { lte: iso(d.now()) } }, { orderBy: "window_start", limit: 50 });
    let dials = 0;
    const max = opts.maxAttempts ?? 10;
    for (const order of due) {
      if (dials >= max) break;
      await guard(`order ${order.id}`, async () => {
        const out = await this.attemptCall(order.id);
        report.attempts.push({ orderId: order.id, kind: out.kind, ...("reason" in out ? { reason: out.reason } : {}) });
        if (out.kind === "placed") dials += 1;
      });
    }
    return report;
  }

  /**
   * Safety net: calls that never reported an end (lost webhook, crash). Past max duration + margin they are hung up and
   * closed as technical failures. Run every few minutes.
   */
  async sweepStuckCalls(): Promise<number> {
    const d = this.deps;
    const cutoff = iso(new Date(d.now().getTime() - (d.product.maxCallSeconds + 300) * 1000));
    const stuck = await d.db.calls.find({ started_at: { lte: cutoff } });
    let closed = 0;
    for (const call of stuck.filter((c: CallRow) => c.status !== "ended")) {
      if (call.provider_call_id) await d.telephony.hangup(call.provider_call_id).catch(() => undefined);
      await this.controller.finalize(call.id, call.key2_at ? "completed" : "technical", d.product.maxCallSeconds);
      closed += 1;
    }
    return closed;
  }
}
