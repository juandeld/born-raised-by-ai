import { createHmac, timingSafeEqual } from "node:crypto";
import { colorearLinkKey } from "@lumen/config/secrets";

/**
 * Short-lived signed download links. The page /colorear/entrega/<token> is reachable with the order token (128 random bits);
 * the file itself is served only with `exp.sig`, where sig = HMAC-SHA256(secret, `${kind}.${token}.${exp}`). Links expire in minutes,
 * so a copied URL stops working even though the order page stays open for 30 days.
 */
const secret = (env: Record<string, string | undefined>): string => colorearLinkKey(env);

export function signLink(env: Record<string, string | undefined>, kind: string, token: string, ttlSeconds: number, now = Date.now()): string {
  const exp = Math.floor(now / 1000) + ttlSeconds;
  const sig = createHmac("sha256", secret(env)).update(`${kind}.${token}.${exp}`).digest("hex").slice(0, 40);
  return `${exp}.${sig}`;
}

export function verifyLink(env: Record<string, string | undefined>, kind: string, token: string, signed: string | null | undefined, now = Date.now()): boolean {
  if (!signed) return false;
  const [expStr, sig] = signed.split(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || !sig || exp < Math.floor(now / 1000)) return false;
  const want = createHmac("sha256", secret(env)).update(`${kind}.${token}.${exp}`).digest("hex").slice(0, 40);
  const a = Buffer.from(sig);
  const b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}
