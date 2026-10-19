import type { CallRow, OrderRow } from "@lumen/db";
import type { EngineDeps } from "./deps";
import { ALLOWED_TOOLS, INCIDENT_TYPES, type AgentToolName, type IncidentType } from "./guardrails/config";
import { baseProps, iso } from "./util";

export interface ToolRequest {
  tool: string;
  /** Twilio call sid supplied by the vendor as a system variable. Never the order id (A-05). */
  callSid: string;
  args?: { incident_type?: string };
}

export type ToolResult = { ok: true } | { ok: false; error: string };

const NOTIFY_BUYER = new Set<IncidentType>(["seguridad", "maltrato", "autolesion"]);
const SAME_DAY_TO_OWNER = new Set<IncidentType>(["maltrato", "autolesion"]);

/**
 * Server side of the agent tools (A-04). Anything else is rejected. Incidents store type and time only, never content (A-12).
 */
export class AgentTools {
  /** Set by the engine: refund hook for mark_optout. */
  onOptOut: (order: OrderRow) => Promise<void> = async () => {};

  constructor(private readonly d: EngineDeps) {}

  async handle(req: ToolRequest): Promise<ToolResult> {
    if (!(ALLOWED_TOOLS as readonly string[]).includes(req.tool)) return { ok: false, error: `Tool "${req.tool}" is not allowed` };
    const call = (await this.d.db.calls.find({ provider_call_id: req.callSid }, { limit: 1 }))[0];
    if (!call) return { ok: false, error: "Unknown call" };
    const order = await this.d.db.orders.get(call.order_id);
    if (!order) return { ok: false, error: "Unknown order" };
    switch (req.tool as AgentToolName) {
      case "end_call":
        return { ok: true }; // the vendor ends the call; the final state arrives with the telephony status callback
      case "mark_optout":
        return this.markOptOut(call, order);
      case "flag_incident":
        return this.flagIncident(call, order, req.args?.incident_type);
    }
  }

  private async markOptOut(call: CallRow, order: OrderRow): Promise<ToolResult> {
    if (order.phone_e164_hash && !(await this.d.db.suppression.get(order.phone_e164_hash))) {
      await this.d.db.suppression.insert({ phone_e164_hash: order.phone_e164_hash, source: "voice" });
    }
    await this.d.tracker.track("opted_out", { ...baseProps(order), source: "voice" });
    await this.onOptOut(order);
    return { ok: true };
  }

  private async flagIncident(call: CallRow, order: OrderRow, type: string | undefined): Promise<ToolResult> {
    if (!type || !(INCIDENT_TYPES as readonly string[]).includes(type)) return { ok: false, error: "Invalid incident type" };
    const incident = type as IncidentType;
    const fresh = (await this.d.db.calls.get(call.id))!;
    await this.d.db.calls.update(call.id, { incidents: [...fresh.incidents, { type: incident, at: iso(this.d.now()) }] });
    await this.d.tracker.track("incident_flagged", { ...baseProps(order), incident_type: incident });
    // Notify legal-compliance; maltrato and autolesion go to the owner the same day (docs/legal/textos/07, incident procedure).
    const to = SAME_DAY_TO_OWNER.has(incident) ? this.d.env.OWNER_ALERT_EMAIL : this.d.env.LEGAL_ALERT_EMAIL;
    if (to) {
      await this.d.delivery.send({
        kind: "ops",
        to,
        subject: `[Incident] ${incident} on order ${order.id}`,
        text: `Type: ${incident}\nOrder: ${order.id}\nCall: ${call.id} (attempt ${call.attempt})\nTime: ${iso(this.d.now())}\nNo content is included. Recording retention stays at 30 days unless the owner orders otherwise.`,
      });
    }
    return { ok: true };
  }

  /** Called after the call: neutral email to the buyer for safety incidents (07 section E, step 2). */
  static shouldNotifyBuyer(type: string): boolean {
    return NOTIFY_BUYER.has(type as IncidentType);
  }
}
