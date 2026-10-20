import { getColorear, kickRun } from "@/lib/colorear";
import { clientIp, json, rateLimited } from "@/lib/request";

/**
 * One of the Trio's 2 extra adventures, with 1 click. Body: { t: order token, theme?, themeId? }. It charges nothing (the Trio is
 * already paid); the characters are reused, no photos. Answers with the token of the new book so the page can follow its progress.
 */
export async function POST(req: Request) {
  if (rateLimited(`colorear-credito:${clientIp(req.headers) ?? "?"}`, 10)) return json({ ok: false, reason: "rate" }, 429);
  const b = (await req.json().catch(() => ({}))) as { t?: string; theme?: string; themeId?: string };
  if (!b.t || !/^[a-f0-9]{32}$/.test(b.t)) return json({ ok: false, reason: "bad_request" }, 400);
  const res = await getColorear().useCredit(b.t, { theme: String(b.theme ?? "").slice(0, 100), themeId: String(b.themeId ?? "").slice(0, 40) });
  if (!res.ok) return json({ ok: false, reason: res.reason }, res.reason === "not_found" ? 404 : 422);
  await kickRun(res.orderId).catch((e) => console.error("[colorear] kick failed", e instanceof Error ? e.message : e));
  return json({ ok: true, token: res.token, creditsLeft: res.creditsLeft });
}
