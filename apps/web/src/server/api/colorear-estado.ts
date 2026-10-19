import { getColorear } from "@/lib/colorear";
import { clientIp, json, rateLimited } from "@/lib/request";


/** Progress of a book for the status page (polled every ~3 s). Also restarts a stalled run, and hands out a short-lived signed PDF link when ready. */
export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t") ?? "";
  if (!/^[a-f0-9]{32}$/.test(t)) return json({ ok: false }, 404);
  if (rateLimited(`colorear-estado:${clientIp(req.headers) ?? "?"}`, 120)) return json({ ok: false }, 429);
  const engine = getColorear();
  const status = await engine.getStatus(t);
  if (!status) return json({ ok: false }, 404);
  if (status.phase === "working") await engine.resumeIfStalled(t).catch(() => undefined);
  const pdf = status.hasPdf ? `/api/colorear/pdf?t=${t}&s=${engine.signDownload(t, 600)}` : null;
  return json({ ok: true, status, pdf }, 200);
}
