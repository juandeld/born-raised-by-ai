import { colorearMockPayAllowed } from "@lumen/config";
import { PaymentConfigError, paymentProviderByName } from "@lumen/payments";
import { handleColorearPayment, isColorearOrder } from "@/lib/colorear";
import { getEngine, mockPaymentsAllowed } from "@/lib/engine";
import { json } from "@/lib/request";


/**
 * Payment webhooks: /api/webhooks/polar, /api/webhooks/recurrente. The raw body is needed to verify the signature.
 * The signature check lives in the provider; an invalid one is a 400 and nothing is processed.
 */
export async function POST(req: Request, ctx: { params: Promise<{ provider: string }> }) {
  const { provider: name } = await ctx.params;
  // The mock webhook accepts any body, so it is closed unless some product still allows mock payments (Santa: ALLOW_MOCK_PAYMENTS; colorear: COLOREAR_ALLOW_MOCK_PAY).
  if (name === "mock" && !mockPaymentsAllowed() && !colorearMockPayAllowed()) return json({ ok: false }, 404);
  const raw = await req.text();
  const headers: Record<string, string | undefined> = {};
  req.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));
  let provider;
  try {
    provider = paymentProviderByName(name, process.env);
  } catch (err) {
    if (err instanceof PaymentConfigError) return json({ ok: false, error: "provider_not_configured" }, 503);
    return json({ ok: false, error: "unknown_provider" }, 404);
  }
  let event;
  try {
    event = await provider.parseWebhook(raw, headers);
  } catch {
    return json({ ok: false, error: "invalid_signature" }, 400);
  }
  if (event) {
    // colorear orders live in the same table; their payments go to the generate engine
    const ids = event as { orderId?: string | null; checkoutId?: string | null };
    const colorear = await isColorearOrder(ids.orderId, ids.checkoutId);
    // Per product: a forged mock event must not mark a colorear order paid while colorear's own switch is closed, even if Santa's is open.
    if (name === "mock" && (colorear ? !colorearMockPayAllowed() : !mockPaymentsAllowed())) return json({ ok: false }, 404);
    if (colorear) await handleColorearPayment(event);
    else await getEngine().handlePaymentEvent(event);
  }
  return json({ ok: true });
}
