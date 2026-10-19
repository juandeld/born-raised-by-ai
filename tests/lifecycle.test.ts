import { describe, expect, it } from "vitest";
import { computeOrderCosts, summarizeByCountry, type EventRow } from "@lumen/analytics";
import { buyAndSchedule, enterWindow, makeHarness, mxCheckout, urls } from "./helpers";

const DAY = 86_400_000;

describe("retention cron (D8)", () => {
  it("deletes order data and recordings at 30 days, consents at 4 years, delivery log at 13 months", async () => {
    const h = makeHarness();
    const { order } = await buyAndSchedule(h);
    enterWindow(h, order.window_start);
    await h.engine.attemptCall(order.id);
    const delivered = (await h.deps.db.orders.get(order.id))!;
    expect(delivered.status).toBe("delivered");
    const delivery = (await h.deps.db.deliveries.find({ order_id: order.id, kind: "delivery" }))[0]!;
    expect(await h.storage.get(delivery.mp3_path!)).not.toBeNull();

    // Day 29: nothing deleted.
    h.clock.now = new Date(new Date(delivered.delivered_at!).getTime() + 29 * DAY);
    let report = await h.engine.retention.run();
    expect(report.ordersScrubbed).toBe(0);
    expect(await h.storage.get(delivery.mp3_path!)).not.toBeNull();

    // Day 31: recording, certificate and personal data are gone; the consent record is still there.
    h.clock.now = new Date(new Date(delivered.delivered_at!).getTime() + 31 * DAY);
    report = await h.engine.retention.run();
    expect(report.ordersScrubbed).toBe(1);
    expect(report.recordingsDeleted).toBe(1);
    expect(await h.storage.get(delivery.mp3_path!)).toBeNull();
    expect(await h.storage.get(delivery.pdf_path!)).toBeNull();
    const scrubbed = (await h.deps.db.orders.get(order.id))!;
    expect(scrubbed).toMatchObject({ email: null, phone_e164: null, phone_e164_hash: null, child_first_name: null, details: null });
    expect(scrubbed.pii_purged_at).not.toBeNull();
    expect((await h.engine.getDeliveryView(order.access_token))!.status).toBe("expired");
    expect(await h.deps.db.consents.find({ order_id: order.id })).toHaveLength(6);
    expect(await h.deps.db.deliveries.find({ order_id: order.id })).not.toHaveLength(0);

    // Month 14: delivery and call logs are gone; consents remain until year 4.
    h.clock.now = new Date(new Date(delivered.delivered_at!).getTime() + 14 * 30 * DAY);
    report = await h.engine.retention.run();
    expect(report.deliveriesDeleted).toBeGreaterThan(0);
    expect(report.callLogsDeleted).toBe(1);
    expect(await h.deps.db.consents.find({ order_id: order.id })).toHaveLength(6);

    h.clock.now = new Date(new Date(delivered.delivered_at!).getTime() + 4 * 365 * DAY + 2 * DAY);
    report = await h.engine.retention.run();
    expect(report.consentsDeleted).toBe(6);
  });

  it("a refunded order has its personal data removed on the next run", async () => {
    const h = makeHarness();
    h.telephony.scenarios = ["opt_out"];
    const { order } = await buyAndSchedule(h);
    enterWindow(h, order.window_start);
    await h.engine.attemptCall(order.id);
    h.clock.now = new Date(h.clock.now.getTime() + 60_000);
    await h.engine.retention.run();
    expect((await h.deps.db.orders.get(order.id))!.email).toBeNull();
  });

  it("sweeps calls that never reported an end", async () => {
    const h = makeHarness();
    h.telephony.autoplay = false;
    const { order } = await buyAndSchedule(h);
    enterWindow(h, order.window_start);
    await h.engine.attemptCall(order.id);
    h.clock.now = new Date(h.clock.now.getTime() + 20 * 60_000);
    expect(await h.engine.sweepStuckCalls()).toBe(1);
    const call = (await h.deps.db.calls.find({ order_id: order.id }))[0]!;
    expect(call.status).toBe("ended");
    expect(call.result).toBe("technical");
  });
});

describe("support agent stub", () => {
  it("resends the delivery, refunds up to $50, reschedules before any attempt, escalates the rest", async () => {
    const h = makeHarness();
    const { order } = await buyAndSchedule(h);

    // Wrong e-mail: not identified, escalated
    const bad = await h.engine.support.handle({ orderId: order.id, email: "other@example.com", message: "reembolso" });
    expect(bad.outcome).toMatchObject({ ok: false, detail: "identity_not_verified" });

    // Reschedule before any attempt
    const re = await h.engine.support.handle({ orderId: order.id, email: "mama@example.com", message: "Quiero cambiar la hora", reschedule: { date: "2026-12-24", windowStartHour: 19 } });
    expect(re.call.tool).toBe("reschedule_call");
    expect(re.outcome.ok).toBe(true);
    const moved = (await h.deps.db.orders.get(order.id))!;
    expect(moved.window_start).not.toBe(order.window_start);

    // Refund (MXN 199 is about $11): allowed
    const refunded = await h.engine.support.handle({ orderId: order.id, email: "mama@example.com", message: "Quiero mi reembolso" });
    expect(refunded.outcome).toEqual({ ok: true, detail: "refunded" });
    expect((await h.deps.db.orders.get(order.id))!.status).toBe("refunded");

    // Escalate when nothing matches
    const esc = await h.engine.support.handle({ orderId: order.id, email: "mama@example.com", message: "hola buenas tardes" });
    expect(esc.call.tool).toBe("escalate");
  });

  it("refund above $50 is escalated, never executed", async () => {
    const h = makeHarness();
    const { order } = await buyAndSchedule(h);
    await h.deps.db.orders.update(order.id, { amount_usd_cents: 5001 });
    const out = await h.engine.support.run({ tool: "refund" }, (await h.deps.db.orders.get(order.id))!);
    expect(out.ok).toBe(false);
    expect(h.payments.refunds).toHaveLength(0);
  });

  it("resend_delivery works only after delivery", async () => {
    const h = makeHarness();
    const { order } = await buyAndSchedule(h);
    expect((await h.engine.support.run({ tool: "resend_delivery" }, order)).ok).toBe(false);
    enterWindow(h, order.window_start);
    await h.engine.attemptCall(order.id);
    const delivered = (await h.deps.db.orders.get(order.id))!;
    const before = h.delivery.sent.length;
    expect((await h.engine.support.run({ tool: "resend_delivery" }, delivered)).ok).toBe(true);
    expect(h.delivery.sent.length).toBe(before + 1);
  });
});

describe("costs per order (npm run costs)", () => {
  const ev = (name: string, order: string, country: string, properties: Record<string, unknown>): EventRow => ({ name, ts: "2026-12-24T00:00:00Z", order_id: order, product: "santa", country, properties });

  it("computes cost per order from events with the configured rates", () => {
    const rows: EventRow[] = [
      ev("paid", "o1", "MX", { amount_usd_cents: 1095, payment_provider: "polar" }),
      ev("call_attempt_ended", "o1", "MX", { telephony_seconds: 330, agent_seconds: 240, recorded: true }),
      ev("delivered", "o1", "MX", {}),
      // Spain, first attempt voicemail (3 s), second completed
      ev("paid", "o2", "ES", { amount_usd_cents: 1494, payment_provider: "polar" }),
      ev("call_attempt_ended", "o2", "ES", { telephony_seconds: 3, agent_seconds: 0, recorded: false }),
      ev("call_attempt_ended", "o2", "ES", { telephony_seconds: 300, agent_seconds: 240, recorded: true }),
      ev("delivered", "o2", "ES", {}),
    ];
    const [mx, es] = computeOrderCosts(rows);
    // MX: ElevenLabs 4 min x 0.08 = 0.32 | Twilio 6 min x 0.0473 = 0.2838 | recording 6 x 0.0025 = 0.015 | LLM 4 x 0.0086 = 0.0344 | infra 0.01
    expect(mx!.elevenlabs).toBeCloseTo(0.32, 4);
    expect(mx!.telephony).toBeCloseTo(0.2838, 4);
    expect(mx!.recording).toBeCloseTo(0.015, 4);
    expect(mx!.llm).toBeCloseTo(0.0344, 4);
    // Polar: 10.95 x (5 % + 1.5 %) + 0.50
    expect(mx!.payment).toBeCloseTo(10.95 * 0.065 + 0.5, 4);
    expect(mx!.total).toBeCloseTo(0.32 + 0.2838 + 0.015 + 0.0344 + 0.01 + mx!.payment, 4);
    // ES: two attempts bill 1 + 5 started minutes at $0.18
    expect(es!.telephony).toBeCloseTo(6 * 0.18, 4);
    const summary = summarizeByCountry([mx!, es!]);
    expect(summary.find((s) => s.country === "ES")!.avgVariable).toBeGreaterThan(summary.find((s) => s.country === "MX")!.avgVariable);
  });

  it("the real flow produces events that the cost calculator can read", async () => {
    const h = makeHarness();
    const { order } = await buyAndSchedule(h);
    enterWindow(h, order.window_start);
    await h.engine.attemptCall(order.id);
    const rows = (await h.deps.db.events.find()) as unknown as EventRow[];
    const [cost] = computeOrderCosts(rows);
    expect(cost!.orderId).toBe(order.id);
    expect(cost!.agentMinutes).toBe(4);
    expect(cost!.telephonyMinutes).toBeGreaterThan(4);
    expect(cost!.total).toBeGreaterThan(0);
    // Variable cost (without payment fee) stays under 10 % of the price in Mexico.
    expect((cost!.total - cost!.payment) / cost!.paidUsd).toBeLessThan(0.1);
  });
});

describe("web checkout helpers", () => {
  it("prices come from the config file", async () => {
    const { priceFor, formatPrice, COUNTRIES } = await import("@lumen/config");
    expect(priceFor("US", "single")).toEqual({ amountMinor: 1499, currency: "USD" });
    expect(priceFor("US", "bundle")).toEqual({ amountMinor: 2499, currency: "USD" });
    expect(priceFor("ES", "single").amountMinor).toBe(1299);
    expect(priceFor("ES", "bundle").amountMinor).toBe(1999);
    expect(priceFor("GB", "single").amountMinor).toBe(1199);
    expect(priceFor("GB", "bundle").amountMinor).toBe(1999);
    expect(priceFor("MX", "single").amountMinor).toBe(19900);
    expect(priceFor("MX", "bundle").amountMinor).toBe(34900);
    expect(formatPrice(1299, "EUR", COUNTRIES.ES.priceFormatLocale)).toMatch(/12,99/);
    void urls;
  });
});
