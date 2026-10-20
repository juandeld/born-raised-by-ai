import { colorearPublicUrl } from "@lumen/config";
import { getColorear } from "@/lib/colorear";
import { clientIp, json, rateLimited } from "@/lib/request";

/**
 * "Otra aventura": starts the payment (never charges by itself; the buyer lands on the provider's checkout and pays there, with
 * the terms notice visible on our page). Body: { t, s (signed offer link, 48 h), theme?, themeId? }.
 */
export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (rateLimited(`colorear-oferta:${ip ?? "?"}`, 6)) return json({ ok: false, reason: "rate" }, 429);
  const b = (await req.json().catch(() => ({}))) as { t?: string; s?: string; theme?: string; themeId?: string };
  if (!b.t || !/^[a-f0-9]{32}$/.test(b.t)) return json({ ok: false, reason: "bad_request" }, 400);
  const base = colorearPublicUrl();
  const res = await getColorear().createUpsellCheckout(
    b.t,
    b.s ?? null,
    { theme: String(b.theme ?? "").slice(0, 100), themeId: String(b.themeId ?? "").slice(0, 40), ip },
    { successUrl: (o) => `${base}/colorear/confirmacion/${o.access_token}`, cancelUrl: `${base}/colorear/entrega/${b.t}` },
  ).catch((e) => {
    console.error("[colorear] upsell checkout failed", e instanceof Error ? e.message : e);
    return null;
  });
  if (!res) return json({ ok: false, reason: "server" }, 500);
  if (!res.ok) return json({ ok: false, reason: res.reason }, res.reason === "not_found" ? 404 : 422);
  return json({ ok: true, url: res.checkoutUrl });
}
