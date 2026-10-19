import { LOCALE_SLUG, type Locale } from "@lumen/config";
import { handleColorearPayment } from "@/lib/colorear";
import { baseUrl, getEngine, mockPaymentsAllowed } from "@/lib/engine";
import { json } from "@/lib/request";


/** The URL the mock provider hands out. Sends the buyer to the test payment page. */
export async function GET(req: Request) {
  if (!mockPaymentsAllowed()) return new Response("Not found", { status: 404 });
  const u = new URL(req.url);
  const target = new URL(`${baseUrl()}/pago-prueba`);
  target.searchParams.set("order", u.searchParams.get("order") ?? "");
  target.searchParams.set("checkout", u.searchParams.get("checkout") ?? "");
  return Response.redirect(target.toString(), 303);
}

/**
 * "Pay" in test mode: same path as a real provider webhook (parseWebhook -> handlePaymentEvent), then tells the page where to go.
 * Disabled on the live deployment unless ALLOW_MOCK_PAYMENTS=1.
 */
export async function POST(req: Request) {
  if (!mockPaymentsAllowed()) return json({ ok: false }, 404);
  const engine = getEngine();
  if (engine.deps.payments.name !== "mock") return json({ ok: false, error: "provider_is_not_mock" }, 409);
  const b = (await req.json().catch(() => ({}))) as { order?: string; checkout?: string; outcome?: "success" | "fail" };
  if (!b.order) return json({ ok: false }, 400);
  const order = await engine.deps.db.orders.get(b.order);
  if (!order || order.checkout_id !== b.checkout) return json({ ok: false }, 404);
  const type = b.outcome === "fail" ? "payment_failed" : "payment_succeeded";
  const event = await engine.deps.payments.parseWebhook(JSON.stringify({ type, orderId: order.id, checkoutId: order.checkout_id }), {});
  const isColorear = order.product === "colorear";
  if (event) await (isColorear ? handleColorearPayment(event) : engine.handlePaymentEvent(event));
  if (isColorear) return json({ ok: true, redirect: type === "payment_succeeded" ? `/colorear/confirmacion/${order.access_token}` : `/colorear/${order.language === "en" ? "en" : "es"}` });
  const slug = LOCALE_SLUG[order.language as Locale] ?? "es";
  return json({ ok: true, redirect: type === "payment_succeeded" ? `/${slug}/confirmacion/${order.access_token}` : `/${slug}/comprar` });
}
