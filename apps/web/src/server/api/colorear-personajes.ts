import { getColorear } from "@/lib/colorear";
import { clientIp, json, rateLimited } from "@/lib/request";

/** "Delete my characters": erases the kept character drawings at once (the book stays until its date). Body: { t }. */
export async function POST(req: Request) {
  if (rateLimited(`colorear-personajes:${clientIp(req.headers) ?? "?"}`, 6)) return json({ ok: false }, 429);
  const b = (await req.json().catch(() => ({}))) as { t?: string };
  if (!b.t || !/^[a-f0-9]{32}$/.test(b.t)) return json({ ok: false }, 400);
  const res = await getColorear().deleteMyCharacters(b.t);
  return json(res, res.ok ? 200 : 422);
}
