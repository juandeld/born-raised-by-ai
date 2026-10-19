import { getEngine } from "@/lib/engine";
import { json } from "@/lib/request";


export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { token?: string; answer?: "loved" | "ok" | "bad" };
  if (!b.token || !b.answer) return json({ ok: false }, 400);
  const ok = await getEngine().answerSurvey(b.token, b.answer);
  return json({ ok });
}
