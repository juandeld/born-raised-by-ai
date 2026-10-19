import { getColorear } from "@/lib/colorear";
import { clientIp, json, rateLimited } from "@/lib/request";


/** Automatic refund with the order token, inside the 7-day window. No questions asked. */
export async function POST(req: Request) {
  if (rateLimited(`colorear-refund:${clientIp(req.headers) ?? "?"}`, 6)) return json({ ok: false }, 429);
  const b = (await req.json().catch(() => ({}))) as { t?: string };
  if (!b.t || !/^[a-f0-9]{32}$/.test(b.t)) return json({ ok: false }, 400);
  const res = await getColorear().refundByLink(b.t);
  return json({ ok: res.refunded, reason: res.reason }, res.refunded ? 200 : 422);
}
