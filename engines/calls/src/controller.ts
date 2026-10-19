import { RETENTION_DAYS, addDays } from "@lumen/config";
import type { CallRow, OrderRow } from "@lumen/db";
import { getPreludeTexts, renderPrelude, type TextLocale } from "@lumen/legal";
import type { EngineDeps } from "./deps";
import { buildAgentVariables } from "./guardrails/sanitize";
import { initialPreludeState, stepPrelude, type PreludeState } from "./prelude";
import type { Action, CallEvent, CallResult, Language } from "./types";
import { baseProps, fromNumberFor, iso } from "./util";

const TERMINAL_WITHOUT_ENDED = new Set(["no_answer", "busy", "failed"]);

/**
 * Per-call controller. Telephony events in, actions out. State lives in the `calls` row, so webhooks are stateless and
 * safe to serve from any serverless instance. The same code runs for Twilio webhooks and for the mock.
 */
export class CallController {
  /** Set by the engine: called once when a call row reaches status "ended". */
  onFinalized: (callId: string) => Promise<void> = async () => {};

  constructor(private readonly d: EngineDeps) {}

  async handleEvent(callId: string, event: CallEvent, opts: { providerCallId?: string } = {}): Promise<Action[]> {
    const call = await this.d.db.calls.get(callId);
    if (!call) throw new Error(`Unknown call ${callId}`);
    if (call.status === "ended") return [];
    const order = await this.d.db.orders.get(call.order_id);
    if (!order || order.pii_purged_at || !order.child_first_name) {
      return [{ type: "hangup", result: "blocked" }];
    }
    if (opts.providerCallId && !call.provider_call_id) await this.d.db.calls.update(call.id, { provider_call_id: opts.providerCallId });

    const texts = renderPrelude(getPreludeTexts(order.product, order.locale as TextLocale), { brand: this.d.brand.brand, childName: order.child_first_name });
    const cfg = { dtmfTimeoutSeconds: this.d.product.dtmfTimeoutSeconds, handoffTimeoutSeconds: this.d.product.handoffTimeoutSeconds };
    const state = (Object.keys(call.state).length ? (call.state as unknown as PreludeState) : initialPreludeState());
    const step = stepPrelude(state, event, texts, cfg);
    let actions = step.actions;
    let live = (await this.d.db.calls.get(callId))!;
    const patch: Partial<CallRow> = { state: step.state as unknown as Record<string, unknown> };
    const now = this.d.now();

    for (const effect of step.effects) {
      if (effect === "start_recording") {
        const providerId = live.provider_call_id ?? opts.providerCallId;
        if (!providerId) throw new Error("Cannot record: no provider call id");
        const { recordingId } = await this.d.telephony.startRecording(providerId);
        patch.recording_id = recordingId;
        patch.key1_at = iso(now);
        patch.recording_purge_at = iso(addDays(now, RETENTION_DAYS.recording));
        live = { ...live, recording_id: recordingId };
      }
      if (effect === "suppress" && order.phone_e164_hash) {
        if (!(await this.d.db.suppression.get(order.phone_e164_hash))) {
          await this.d.db.suppression.insert({ phone_e164_hash: order.phone_e164_hash, source: "key2" });
        }
        await this.d.tracker.track("opted_out", { ...baseProps(order), source: "key2" });
      }
      if (effect === "delete_recording" && (live.recording_id ?? patch.recording_id)) {
        await this.d.telephony.deleteRecording((patch.recording_id ?? live.recording_id)!);
        patch.recording_id = null;
        patch.recording_purge_at = null;
      }
      if (effect === "connect_agent") {
        const connect = await this.connectAgent(order, live);
        patch.key2_at = iso(now);
        patch.status = "in_progress";
        patch.conversation_id = connect.conversationId;
        actions = [{ type: "connect_agent", twiml: connect.twiml, conversationId: connect.conversationId }];
      }
    }

    // First contact moves the order to "calling".
    if (event.type === "answered" && order.status !== "calling") await this.d.db.orders.update(order.id, { status: "calling" });
    await this.d.db.calls.update(call.id, patch);

    if (event.type === "ended" || TERMINAL_WITHOUT_ENDED.has(event.type)) {
      const seconds = event.type === "ended" ? event.telephonySeconds : 0;
      await this.finalize(call.id, step.state.result ?? "failed", seconds);
    }
    return actions;
  }

  private async connectAgent(order: OrderRow, call: CallRow) {
    const language = order.language as Language;
    const agentId = this.d.agentIds[language] ?? this.d.agentIds["es-419"] ?? "";
    const variables = buildAgentVariables({
      childFirstName: order.child_first_name!,
      childAge: order.child_age,
      details: order.details,
      character: order.product,
      language,
    });
    const from = fromNumberFor(this.d.env, order.country);
    return this.d.voice.registerCall({ agentId, from, to: order.phone_e164!, variables });
  }

  /** Closes the attempt: durations, result, analytics. Idempotent. */
  async finalize(callId: string, result: CallResult, telephonySeconds: number): Promise<CallRow> {
    const call = (await this.d.db.calls.get(callId))!;
    if (call.status === "ended") return call;
    const order = (await this.d.db.orders.get(call.order_id))!;
    const now = this.d.now();

    let agentSeconds = 0;
    if (call.key2_at) {
      let conversationId = call.conversation_id;
      if (!conversationId && call.provider_call_id && this.d.voice.findConversationByCallSid) {
        conversationId = await this.d.voice.findConversationByCallSid(call.provider_call_id);
      }
      const conv = conversationId ? await this.d.voice.getConversation(conversationId) : null;
      const wall = Math.max(0, Math.round((now.getTime() - new Date(call.key2_at).getTime()) / 1000));
      agentSeconds = conv?.durationSeconds ?? Math.min(wall, telephonySeconds || wall);
      if (conversationId && !call.conversation_id) await this.d.db.calls.update(call.id, { conversation_id: conversationId });
    }
    // Hard cap (A-07): the agent may never be billed or recorded beyond max_call_seconds.
    agentSeconds = Math.min(agentSeconds, this.d.product.maxCallSeconds);

    const ended = await this.d.db.calls.update(call.id, {
      status: "ended",
      result,
      ended_at: iso(now),
      telephony_seconds: telephonySeconds,
      agent_seconds: agentSeconds,
    });
    const props = baseProps(order);
    await this.d.tracker.track("call_attempt_ended", {
      ...props,
      attempt: ended.attempt,
      result,
      telephony_seconds: telephonySeconds,
      agent_seconds: agentSeconds,
      recorded: !!ended.key1_at,
    });
    if (result === "completed") {
      await this.d.tracker.track("call_completed", { ...props, attempt: ended.attempt, agent_seconds: agentSeconds, telephony_seconds: telephonySeconds, ended_by: "agent_or_user" });
      await this.d.db.orders.update(order.id, { status: "completed" });
    } else if (order.status === "calling") {
      await this.d.db.orders.update(order.id, { status: "scheduled" });
    }
    await this.onFinalized(ended.id);
    return ended;
  }
}
