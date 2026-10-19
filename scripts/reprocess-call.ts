/**
 * Re-runs the post-call delivery for one call (recording -> MP3 -> certificate -> email).
 * Usage: npx tsx scripts/reprocess-call.ts <callId>   (env: same as production; never commit the env file)
 */
import { createEngine } from "../engines/calls/src";

async function main() {
  const callId = process.argv[2];
  if (!callId) throw new Error("Usage: reprocess-call.ts <callId>");
  const engine = createEngine({ env: process.env });
  const out = await engine.afterCall(callId);
  console.log(JSON.stringify(out));
}
main().catch((e) => { console.error(e); process.exit(1); });
