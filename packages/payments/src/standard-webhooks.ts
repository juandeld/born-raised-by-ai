import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies a "Standard Webhooks" signature (used by Polar and by Svix, which Recurrente uses).
 * signed content = `${id}.${timestamp}.${body}`; header = "v1,<base64 hmac-sha256>" (space separated list).
 */
export function verifyStandardWebhook(opts: {
  key: Buffer;
  id: string | undefined;
  timestamp: string | undefined;
  signatureHeader: string | undefined;
  body: string;
  toleranceSeconds?: number;
  now?: () => number;
}): boolean {
  const { key, id, timestamp, signatureHeader, body } = opts;
  if (!id || !timestamp || !signatureHeader) return false;
  const tol = opts.toleranceSeconds ?? 300;
  const nowSec = Math.floor((opts.now?.() ?? Date.now()) / 1000);
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(nowSec - ts) > tol) return false;
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
  for (const part of signatureHeader.split(" ")) {
    const [version, sig] = part.split(",");
    if (version !== "v1" || !sig) continue;
    const given = Buffer.from(sig, "base64");
    if (given.length === expected.length && timingSafeEqual(given, expected)) return true;
  }
  return false;
}

export function signStandardWebhook(key: Buffer, id: string, timestamp: string, body: string): string {
  return `v1,${createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64")}`;
}
