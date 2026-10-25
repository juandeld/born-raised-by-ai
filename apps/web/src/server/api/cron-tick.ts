import { getColorear } from "@/lib/colorear";
import { getEngine } from "@/lib/engine";
import { hasCronSecret, json } from "@/lib/request";


// Vercel Cron sends "Authorization: Bearer <CRON_SECRET>"; the Supabase pg_net / external ping may use x-cron-secret.
const secretOk = (req: Request): boolean => hasCronSecret(req);

/**
 * Scheduler for deployments without Inngest (docs/arquitectura/cron-sin-inngest.md). Vercel Hobby only allows a daily cron,
 * so the minute-by-minute tick comes from a Supabase pg_cron job (pg_net) or any external ping; the daily Vercel cron adds
 * `?retention=1` and also runs the retention job. Safe to call often and concurrently: the engine refuses an order that
 * already has a call in progress.
 */
async function handle(req: Request) {
  if (!secretOk(req)) return json({ ok: false, error: "unauthorized" }, 401);
  if (process.env.INNGEST_EVENT_KEY || process.env.INNGEST_DEV) return json({ ok: false, error: "inngest_active" }, 409);
  const engine = getEngine();
  const url = new URL(req.url);
  const report = await engine.tick();
  // colorear: resume stalled books (the status page also does it), refund the ones that could not be made, erase photos and expired books
  const colorear = await getColorear().sweep({ maxRuns: 1 }).catch((e) => ({ error: e instanceof Error ? e.message : "sweep_failed" }));
  const retention = url.searchParams.get("retention") === "1" ? await engine.retention.run() : undefined;
  return json({ ok: report.errors.length === 0, ...report, colorear, retention });
}

export const GET = handle;
export const POST = handle;
