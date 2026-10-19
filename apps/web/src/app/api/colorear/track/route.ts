import { COLOREAR, colorearCountries, isColorearLang } from "@lumen/config";
import { getColorear } from "@/lib/colorear";
import { clientIp, deviceOf, json, rateLimited } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Funnel events the browser can send before an order exists. No personal data. */
export async function POST(req: Request) {
  if (rateLimited(`colorear-track:${clientIp(req.headers) ?? "?"}`, 60)) return json({ ok: false }, 429);
  const b = (await req.json().catch(() => ({}))) as { event?: string; lang?: string; country?: string; creative?: string };
  if (!["landing_view", "form_started"].includes(b.event ?? "") || !isColorearLang(b.lang)) return json({ ok: false }, 400);
  const open = colorearCountries();
  const c = getColorear();
  await c.d.tracker.track(b.event as "landing_view" | "form_started", {
    product: COLOREAR.slug,
    country: (open.find((x) => x === b.country) ?? open[0]!) as never,
    language: b.lang === "en" ? "en" : "es-419",
    creative: String(b.creative ?? "none").slice(0, 40).replace(/[^\w.-]/g, "") || "none",
    device: deviceOf(req.headers.get("user-agent")),
    test_mode: c.d.payments.name === "mock",
  });
  return json({ ok: true });
}
