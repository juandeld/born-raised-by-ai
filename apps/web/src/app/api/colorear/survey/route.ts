import { getColorear } from "@/lib/colorear";
import { clientIp, json, rateLimited } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (rateLimited(`colorear-survey:${clientIp(req.headers) ?? "?"}`, 10)) return json({ ok: false }, 429);
  const b = (await req.json().catch(() => ({}))) as { t?: string; answer?: string };
  if (!b.t || !/^[a-f0-9]{32}$/.test(b.t) || !["loved", "ok", "bad"].includes(b.answer ?? "")) return json({ ok: false }, 400);
  const ok = await getColorear().answerSurvey(b.t, b.answer as "loved" | "ok" | "bad");
  return json({ ok });
}
