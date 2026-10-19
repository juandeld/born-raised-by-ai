import { after } from "next/server";
import { getColorear, verifyRunSignature } from "@/lib/colorear";
import { json } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Vercel Hobby with Fluid Compute allows up to 300 s per invocation. The run stops itself at COLOREAR_RUN_BUDGET_MS (default 230 s), saves, and asks for the next invocation. */
export const maxDuration = 300;

/**
 * Starts or continues the generation of one book. Internal: needs the signed header made by `continueRun` (HMAC over the order id).
 * Answers 202 at once and does the work after the response (`after`), inside this invocation's duration.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { orderId?: string };
  if (!body.orderId || !verifyRunSignature(body.orderId, req.headers.get("x-colorear-sig"))) return json({ ok: false }, 401);
  const engine = getColorear();
  const orderId = body.orderId;
  after(async () => {
    try {
      const res = await engine.runGeneration(orderId, { budgetMs: Number(process.env.COLOREAR_RUN_BUDGET_MS ?? 235_000) });
      console.log("[colorear] run", orderId.slice(0, 8), res.status, res.stage ?? "", res.reason ?? "");
    } catch (err) {
      console.error("[colorear] run crashed", err instanceof Error ? err.message : err);
    }
  });
  return json({ ok: true }, 202);
}
