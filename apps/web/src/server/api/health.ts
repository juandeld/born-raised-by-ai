import { getColorear } from "@/lib/colorear";
import { getEngine } from "@/lib/engine";
import { hasCronSecret, json } from "@/lib/request";


/**
 * Public: `{ ok: true }` and nothing else (no provider or model names, no hint of which payment mode is active).
 * With the CRON_SECRET (the deploy checklist sends it as `Authorization: Bearer ...`): which providers are active. No secrets, no data.
 */
export async function GET(req: Request) {
  if (!hasCronSecret(req)) return json({ ok: true });
  const d = getEngine().deps;
  const c = getColorear().d;
  return json({ ok: true, providers: { payments: d.payments.name, voice: d.voice.name, telephony: d.telephony.name, db: d.db.kind, concurrency: d.maxConcurrency }, colorear: { image: c.image.name, model: c.image.model, story: c.story.name } });
}
