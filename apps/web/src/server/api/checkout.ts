import { COUNTRIES, SLUG_LOCALE, LOCALE_SLUG } from "@lumen/config";
import { ValidationError, type CheckoutInput } from "@lumen/calls";
import { baseUrl, getEngine } from "@/lib/engine";
import { clientIp, deviceOf, json, rateLimited } from "@/lib/request";
import { legalReady } from "@/lib/legal-vars";
import { toE164 } from "@/lib/phone";
import { bundleEnabled, isSlug, pickCountry, pickVariant } from "@/lib/slugs";


export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!legalReady()) return json({ ok: false, errors: { generic: "legal_not_ready" } }, 503);
  if (rateLimited(`checkout:${ip ?? "?"}`, 12)) return json({ ok: false, errors: { rate: "rate" } }, 429);
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json({ ok: false, errors: { generic: "bad_json" } }, 400);
  }
  const slugRaw = String(b.slug ?? "");
  if (!isSlug(slugRaw)) return json({ ok: false, errors: { generic: "bad_slug" } }, 400);
  const locale = SLUG_LOCALE[slugRaw];
  const country = pickCountry(locale, String(b.country ?? ""));
  const variant = pickVariant(String(b.variant ?? ""));
  if (variant === "bundle" && !bundleEnabled()) return json({ ok: false, errors: { variant: "bundle_off" } }, 422);

  const engine = getEngine();
  const input: CheckoutInput = {
    language: locale,
    country,
    variant,
    email: String(b.email ?? ""),
    phone: toE164(String(b.phone ?? ""), COUNTRIES[country].callingCode),
    childName: String(b.childName ?? ""),
    childAge: b.childAge === "" || b.childAge == null ? null : String(b.childAge),
    details: b.details ? String(b.details) : null,
    date: String(b.date ?? ""),
    windowStartHour: Number(b.windowStartHour),
    timezone: String(b.timezone ?? COUNTRIES[country].defaultTimezone),
    checkboxIds: Array.isArray(b.checkboxIds) ? b.checkboxIds.map(String) : [],
    ip,
    creative: String(b.creative ?? "none").slice(0, 40).replace(/[^\w.-]/g, "") || "none",
    device: deviceOf(req.headers.get("user-agent")),
  };
  const base = baseUrl();
  try {
    const { checkoutUrl } = await engine.orders.createCheckout(input, {
      successUrl: (o) => `${base}/${LOCALE_SLUG[locale]}/confirmacion/${o.access_token}`,
      cancelUrl: `${base}/${LOCALE_SLUG[locale]}/comprar?c=${country}&v=${variant}`,
    });
    return json({ ok: true, url: checkoutUrl });
  } catch (err) {
    if (err instanceof ValidationError) return json({ ok: false, errors: err.errors }, 422);
    console.error("[checkout] failed", err instanceof Error ? err.message : err);
    return json({ ok: false, errors: { generic: "server" } }, 500);
  }
}
