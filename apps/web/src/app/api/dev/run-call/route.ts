import { getEngine, mockPaymentsAllowed } from "@/lib/engine";
import { localHourMinute } from "@lumen/calls";
import { json } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ZONES = ["America/Mexico_City", "Europe/Madrid", "Europe/London", "America/Los_Angeles", "Asia/Tokyo", "Pacific/Auckland", "America/Sao_Paulo", "Asia/Kolkata", "Australia/Sydney"];

/**
 * Development only (mock payments + mock telephony): runs the scheduled call of an order right now, end to end
 * (prelude, agent, recording, delivery). To stay inside the legal calling hours it moves the order's window to a time zone
 * where it is currently daytime. Never available with a real telephony provider.
 */
export async function POST(req: Request) {
  const engine = getEngine();
  const d = engine.deps;
  if (!mockPaymentsAllowed() || d.payments.name !== "mock" || d.telephony.name !== "mock") return json({ ok: false }, 404);
  const b = (await req.json().catch(() => ({}))) as { token?: string };
  const order = b.token ? (await d.db.orders.find({ access_token: b.token }, { limit: 1 }))[0] : null;
  if (!order) return json({ ok: false, error: "order_not_found" }, 404);
  if (order.status !== "scheduled") return json({ ok: false, error: `status_${order.status}` }, 409);
  const now = d.now();
  const tz = ZONES.find((z) => {
    const h = localHourMinute(now, z).hour;
    return h >= 10 && h <= 17;
  }) ?? order.timezone;
  await d.db.orders.update(order.id, {
    timezone: tz,
    window_start: new Date(now.getTime() - 60_000).toISOString(),
    window_end: new Date(now.getTime() + 119 * 60_000).toISOString(),
  });
  const outcome = await engine.attemptCall(order.id);
  return json({ ok: true, outcome: outcome.kind });
}
