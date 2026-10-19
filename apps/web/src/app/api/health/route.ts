import { getEngine } from "@/lib/engine";
import { json } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Which providers are active. No secrets, no data. Used by the deploy checklist. */
export async function GET() {
  const d = getEngine().deps;
  return json({ ok: true, providers: { payments: d.payments.name, voice: d.voice.name, telephony: d.telephony.name, db: d.db.kind, concurrency: d.maxConcurrency } });
}
