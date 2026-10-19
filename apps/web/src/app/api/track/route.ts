import { getEngine } from "@/lib/engine";
import { deviceOf, json, rateLimited, clientIp } from "@/lib/request";
import { isSlug } from "@/lib/slugs";
import { COUNTRIES, SLUG_LOCALE, isCountry } from "@lumen/config";

export const runtime = "nodejs";

/** Browser events the funnel needs before an order exists. Everything else is tracked on the server by the engine. */
const ALLOWED = new Set(["landing_view", "form_started"]);

export async function POST(req: Request) {
  if (rateLimited(`track:${clientIp(req.headers) ?? "?"}`, 60)) return json({ ok: false }, 429);
  let body: { event?: string; slug?: string; country?: string; creative?: string };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false }, 400);
  }
  if (!body.event || !ALLOWED.has(body.event) || !body.slug || !isSlug(body.slug)) return json({ ok: false }, 400);
  const country = isCountry(body.country) ? body.country : COUNTRIES.MX.code;
  const engine = getEngine();
  await engine.deps.tracker.track(body.event as "landing_view" | "form_started", {
    product: engine.deps.product.slug,
    country,
    language: SLUG_LOCALE[body.slug],
    creative: String(body.creative ?? "none").slice(0, 40).replace(/[^\w.-]/g, "") || "none",
    device: deviceOf(req.headers.get("user-agent")),
    test_mode: engine.deps.payments.name === "mock",
  });
  return json({ ok: true });
}
