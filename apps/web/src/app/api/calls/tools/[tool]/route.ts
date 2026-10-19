import { timingSafeEqual } from "node:crypto";
import { getEngine } from "@/lib/engine";
import { json } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secretOk(given: string | null): boolean {
  const secret = process.env.AGENT_TOOL_SECRET;
  if (!secret || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Server tools of the voice agent (A-04): flag_incident, mark_optout. Anything else is rejected by the engine.
 * The call is identified by the Twilio call sid that the vendor sends, never by the order id.
 */
export async function POST(req: Request, ctx: { params: Promise<{ tool: string }> }) {
  if (!secretOk(req.headers.get("x-agent-secret"))) return json({ ok: false, error: "unauthorized" }, 401);
  const { tool } = await ctx.params;
  const b = (await req.json().catch(() => ({}))) as { call_sid?: string; incident_type?: string };
  if (!b.call_sid) return json({ ok: false, error: "missing call_sid" }, 400);
  const out = await getEngine().tools.handle({ tool, callSid: b.call_sid, args: { incident_type: b.incident_type } });
  return json(out, out.ok ? 200 : 422);
}
