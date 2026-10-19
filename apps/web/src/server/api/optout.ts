import { getEngine } from "@/lib/engine";
import { clientIp, json, rateLimited } from "@/lib/request";


/** "I do not want this call": suppress the number, cancel the call and refund. */
export async function POST(req: Request) {
  if (rateLimited(`optout:${clientIp(req.headers) ?? "?"}`, 10)) return json({ ok: false }, 429);
  const b = (await req.json().catch(() => ({}))) as { token?: string };
  if (!b.token) return json({ ok: false }, 400);
  return json({ ok: await getEngine().optOutByLink(b.token) });
}
