import { RETENTION_DAYS, addDays, COUNTRIES } from "@lumen/config";
import type { CallRow, OrderRow } from "@lumen/db";
import { getPreludeTexts, type TextLocale } from "@lumen/legal";
import type { EngineDeps } from "./deps";
import { composeMessage } from "./emails";
import { fromNumberFor, addMinutes, baseProps, formatLocal, iso } from "./util";
import { nextCallableInstant, planRetry, type CallWindow } from "./window";
import type { Language } from "./types";
import type { RefundService } from "./refunds";

export type AttemptOutcome =
  | { kind: "placed"; callId: string }
  /** Wait: before the window, or the 15-minute gap between attempts. */
  | { kind: "sleep"; until: Date }
  /** All slots busy (concurrency cap). Retry shortly; the buyer is told the real expected hour. */
  | { kind: "queued"; retryAt: Date; estimatedStart: Date }
  /** Nothing to do: not paid, refunded, suppressed, purged... */
  | { kind: "blocked"; reason: string }
  /** No attempt left or window closed: refunded automatically. */
  | { kind: "exhausted"; reason: string };

export type AfterCallOutcome =
  | { kind: "delivered" }
  | { kind: "recording_pending"; retryAt: Date }
  | { kind: "retry"; at: Date }
  | { kind: "refunded"; reason: string }
  | { kind: "opted_out" }
  | { kind: "nothing" };

/** Average call length used only to estimate the queue wait that is shown to the buyer. */
const QUEUE_RETRY_SECONDS = 30;
const QUEUE_AVG_CALL_SECONDS = 270;
const REQUIRED_CONSENTS = ["C1", "C2", "C3", "C4", "C5", "C6"];

export class CallScheduler {
  constructor(private readonly d: EngineDeps, private readonly refunds: RefundService) {}

  private window(order: OrderRow): CallWindow {
    return { start: new Date(order.window_start), end: new Date(order.window_end), timezone: order.timezone };
  }

  /** One scheduling decision for an order. The Inngest function loops on this; tests call it with a fake clock. */
  async attempt(orderId: string): Promise<AttemptOutcome> {
    const d = this.d;
    const now = d.now();
    const order = await d.db.orders.get(orderId);
    if (!order) return { kind: "blocked", reason: "not_found" };
    if (order.pii_purged_at) return { kind: "blocked", reason: "purged" };
    if (order.status !== "scheduled") return { kind: "blocked", reason: `status_${order.status}` };

    // Consent gate: every box must be on record with this payment.
    const consents = await d.db.consents.find({ order_id: order.id });
    const have = new Set(consents.filter((c) => c.payment_id === order.payment_id).map((c) => c.checkbox_id));
    if (!REQUIRED_CONSENTS.every((c) => have.has(c))) {
      await this.refunds.refund(order.id, { reason: "missing_consent", automatic: true });
      return { kind: "blocked", reason: "missing_consent" };
    }
    // Suppression list: never call a number that opted out.
    if (order.phone_e164_hash && (await d.db.suppression.get(order.phone_e164_hash))) {
      await this.refunds.refund(order.id, { reason: "opt_out", automatic: true });
      return { kind: "blocked", reason: "suppressed" };
    }

    const calls = await d.db.calls.find({ order_id: order.id }, { orderBy: "attempt" });
    if (calls.some((c) => c.status !== "ended")) return { kind: "blocked", reason: "call_in_progress" };
    if (calls.some((c) => c.result === "completed")) return { kind: "blocked", reason: "already_completed" };
    if (calls.some((c) => c.result === "opted_out")) return { kind: "blocked", reason: "opted_out" };
    if (calls.length >= d.product.maxAttempts) {
      await this.refunds.refund(order.id, { reason: "no_delivery", automatic: true });
      return { kind: "exhausted", reason: "attempts_used" };
    }

    const w = this.window(order);
    const hours = d.product.allowedLocalHours;
    // Earliest allowed instant: inside the window, inside local hours, 15 min after the previous attempt.
    const last = calls.at(-1);
    const notBefore = last?.ended_at ? addMinutes(new Date(last.ended_at), d.product.minutesBetweenAttempts) : now;
    const earliest = nextCallableInstant(new Date(Math.max(now.getTime(), notBefore.getTime())), w, hours);
    if (!earliest) {
      await this.refunds.refund(order.id, { reason: "window_closed", automatic: true });
      return { kind: "exhausted", reason: "window_closed" };
    }
    if (earliest.getTime() > now.getTime() + 1000) return { kind: "sleep", until: earliest };

    // Create the attempt row, then try to take a concurrency slot (atomic in the database).
    const preludeId = getPreludeTexts(order.product, order.locale as TextLocale).id;
    const call = await d.db.calls.insert({
      order_id: order.id,
      attempt: calls.length + 1,
      status: "dialing",
      telephony_provider: d.telephony.name,
      voice_provider: d.voice.name,
      prelude_version: preludeId,
      scheduled_for: iso(now),
      started_at: iso(now),
    });
    const gotSlot = await d.db.reserveCallSlot(call.id, d.maxConcurrency);
    if (!gotSlot) {
      await d.db.calls.delete(call.id); // a queued call is not an attempt
      return this.queue(order, w, now);
    }

    try {
      const placed = await d.telephony.placeCall({
        callId: call.id,
        orderId: order.id,
        to: order.phone_e164!,
        from: fromNumberFor(d.env, order.country),
        locale: order.locale as TextLocale,
        childFirstName: order.child_first_name!,
        maxCallSeconds: d.product.maxCallSeconds,
      });
      // In the mock the whole call may already have run inside placeCall: do not overwrite an ended call.
      const after = (await d.db.calls.get(call.id))!;
      await d.db.calls.update(call.id, { provider_call_id: after.provider_call_id ?? placed.providerCallId });
      if (after.status !== "ended") await d.db.orders.update(order.id, { status: "calling" });
      await d.tracker.track("call_started", { ...baseProps(order), attempt: call.attempt });
      return { kind: "placed", callId: call.id };
    } catch (err) {
      await d.db.calls.update(call.id, { status: "ended", result: "failed", ended_at: iso(d.now()) });
      await d.tracker.track("call_attempt_ended", { ...baseProps(order), attempt: call.attempt, result: "failed", telephony_seconds: 0, agent_seconds: 0, recorded: false });
      await d.dispatcher.send("call/ended", { callId: call.id, orderId: order.id });
      console.error("placeCall failed", err);
      return { kind: "placed", callId: call.id };
    }
  }

  private async queue(order: OrderRow, w: CallWindow, now: Date): Promise<AttemptOutcome> {
    const d = this.d;
    const active = await d.db.countActiveCalls();
    // Rough estimate: the time until enough running calls finish to free a slot.
    const waves = Math.max(1, Math.ceil((active - d.maxConcurrency + 1) / Math.max(1, d.maxConcurrency)));
    const estimatedStart = new Date(now.getTime() + waves * QUEUE_AVG_CALL_SECONDS * 1000 / 2);
    const retryAt = new Date(now.getTime() + QUEUE_RETRY_SECONDS * 1000);
    // Tell the buyer once, with the real expected hour.
    const sentDelay = (await d.db.deliveries.find({ order_id: order.id, kind: "delayed" })).length > 0;
    if (!sentDelay && order.email) {
      const country = COUNTRIES[order.country];
      const msg = composeMessage("delayed", order.language as Language, order.email, {
        childName: order.child_first_name ?? "",
        callTimeLocal: formatLocal(estimatedStart, order.timezone, country.priceFormatLocale),
        holder: d.brand.holder,
        privacyEmail: d.brand.privacyEmail,
        supportEmail: d.brand.supportEmail,
        brand: d.brand.brand,
      });
      const res = await d.delivery.send(msg);
      await d.db.deliveries.insert({
        order_id: order.id, kind: "delayed", channel: res.channel, status: res.status, provider: res.provider, provider_id: res.providerId,
        mp3_path: null, pdf_path: null, link_expires_at: null, survey_answer: null, survey_at: null, purge_at: iso(addDays(now, RETENTION_DAYS.deliveryLog)),
      });
    }
    void w;
    return { kind: "queued", retryAt, estimatedStart };
  }

  /** Decides what follows a finished attempt: deliver, retry inside the window, or refund. */
  async planAfter(call: CallRow): Promise<{ kind: "deliver" } | { kind: "retry"; at: Date } | { kind: "refund"; reason: "no_delivery" | "window_closed" } | { kind: "opted_out" }> {
    const order = (await this.d.db.orders.get(call.order_id))!;
    if (call.result === "completed") return { kind: "deliver" };
    if (call.result === "opted_out") return { kind: "opted_out" };
    const attempts = (await this.d.db.calls.find({ order_id: order.id })).length;
    if (attempts >= this.d.product.maxAttempts) return { kind: "refund", reason: "no_delivery" };
    const at = planRetry(new Date(call.ended_at ?? this.d.now()), this.window(order), this.d.product.allowedLocalHours, this.d.product.minutesBetweenAttempts);
    return at ? { kind: "retry", at } : { kind: "refund", reason: "window_closed" };
  }
}
