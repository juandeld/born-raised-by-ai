import { getEngine } from "@/lib/engine";
import { clientIp, json, rateLimited } from "@/lib/request";

export const runtime = "nodejs";

/** Refund link of the receipt: automatic, no human (terms, section 5). */
export async function POST(req: Request) {
  if (rateLimited(`refund:${clientIp(req.headers) ?? "?"}`, 10)) return json({ ok: false, reason: "rate" }, 429);
  const b = (await req.json().catch(() => ({}))) as { token?: string };
  if (!b.token) return json({ ok: false }, 400);
  const out = await getEngine().refundByLink(b.token);
  return json({ ok: out.refunded, reason: out.reason ?? null });
}
