import { isMetaEvent, metaConfig, sendCapi } from "@lumen/analytics/meta";
import { COUNTRIES, type CountryCode } from "@lumen/config";
import { getEngine } from "@/lib/engine";
import { clientIp, json, rateLimited } from "@/lib/request";

/**
 * Relay to the Meta Conversions API. The browser calls it only after the visitor allowed advertising measurement, with the same
 * event_id it gave the Pixel (deduplication). Purchase never trusts the client: value, currency and email come from the order
 * found by its access token, and only for a real (non-test) paid order. Without META_PIXEL_ID/META_CAPI_TOKEN it answers 204.
 */
export async function POST(req: Request) {
  const cfg = metaConfig(process.env);
  if (!cfg || !cfg.capiToken) return new Response(null, { status: 204 });
  if (rateLimited(`meta:${clientIp(req.headers) ?? "?"}`, 40)) return json({ ok: false }, 429);
  let b: { name?: string; eventId?: string; url?: string; creative?: string; token?: string; country?: string };
  try {
    b = await req.json();
  } catch {
    return json({ ok: false }, 400);
  }
  if (!isMetaEvent(b.name) || !b.eventId || !/^[\w-]{8,80}$/.test(b.eventId)) return json({ ok: false }, 400);
  const own = new URL(process.env.PUBLIC_BASE_URL ?? "http://localhost:3000");
  let url = own.origin;
  try {
    const u = new URL(String(b.url));
    if (u.host === own.host || u.hostname.endsWith(".vercel.app") || u.hostname === "localhost") url = `${u.origin}${u.pathname}`;
  } catch { /* keep origin */ }
  const cookie = req.headers.get("cookie") ?? "";
  const pick = (n: string) => cookie.match(new RegExp(`(?:^|;\\s*)${n}=([^;]+)`))?.[1] ?? null;
  const input: Parameters<typeof sendCapi>[1] = {
    name: b.name,
    eventId: b.eventId,
    url,
    creative: String(b.creative ?? "none"),
    country: typeof b.country === "string" && b.country in COUNTRIES ? b.country : undefined,
    ip: clientIp(req.headers),
    userAgent: req.headers.get("user-agent"),
    fbp: pick("_fbp"),
    fbc: pick("_fbc"),
  };
  if (b.name === "Purchase") {
    const order = b.token ? (await getEngine().deps.db.orders.find({ access_token: b.token }, { limit: 1 }))[0] : undefined;
    const paid = order && !order.test_mode && !["created", "refunded"].includes(order.status);
    if (!order || !paid) return json({ ok: false }, 422);
    input.eventId = order.id;
    input.value = order.amount_minor / 100;
    input.currency = order.currency;
    input.email = order.email;
    input.country = COUNTRIES[order.country as CountryCode] ? order.country : undefined;
    input.creative = order.creative;
  }
  return json({ ok: await sendCapi(cfg, input) });
}
