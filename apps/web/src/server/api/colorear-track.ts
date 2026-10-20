import { COLOREAR, colorearCountries, isColorearLang, isSelectableVariant } from "@lumen/config";
import { getColorear } from "@/lib/colorear";
import { clientIp, deviceOf, json, rateLimited } from "@/lib/request";


/** Funnel events the browser can send before an order exists. No personal data. */
export async function POST(req: Request) {
  if (rateLimited(`colorear-track:${clientIp(req.headers) ?? "?"}`, 60)) return json({ ok: false }, 429);
  const b = (await req.json().catch(() => ({}))) as { event?: string; lang?: string; country?: string; creative?: string; variant?: string; previous?: string; t?: string };
  const c = getColorear();
  // The delivery page showed the 48 h offer: identified by the order token, deduplicated by the engine.
  if (b.event === "upsell_viewed") {
    if (!b.t || !/^[a-f0-9]{32}$/.test(b.t)) return json({ ok: false }, 400);
    await c.trackUpsellViewed(b.t).catch(() => undefined);
    return json({ ok: true });
  }
  if (!["landing_view", "form_started", "bundle_selected"].includes(b.event ?? "") || !isColorearLang(b.lang)) return json({ ok: false }, 400);
  const open = colorearCountries();
  const base = {
    product: COLOREAR.slug,
    country: (open.find((x) => x === b.country) ?? open[0]!) as never,
    language: (b.lang === "en" ? "en" : "es-419") as "en" | "es-419",
    creative: String(b.creative ?? "none").slice(0, 40).replace(/[^\w.-]/g, "") || "none",
    device: deviceOf(req.headers.get("user-agent")),
    test_mode: c.d.payments.name === "mock",
  };
  if (b.event === "bundle_selected") {
    if (!isSelectableVariant(b.variant)) return json({ ok: false }, 400);
    await c.d.tracker.track("bundle_selected", { ...base, variant: b.variant, previous: isSelectableVariant(b.previous) ? b.previous : "none" });
    return json({ ok: true });
  }
  await c.d.tracker.track(b.event as "landing_view" | "form_started", base);
  return json({ ok: true });
}
