import { createHmac } from "node:crypto";

type Env = Record<string, string | undefined>;

/**
 * Server only (uses node:crypto): import it as `@lumen/config/secrets`, never from the package index, which client components also load.
 *
 * Secrets that keep hashes and signed links safe (PHONE_HASH_SALT, COLOREAR_LINK_SECRET).
 *
 * Rule: on the live deployment (VERCEL_ENV=production) no value that is public in this repository is ever used as a key. Outside
 * production the old development constants stay, so tests and `npm run dev` work with an empty environment.
 *
 * When a secret is missing in production, the key is derived per purpose with HMAC-SHA256 from a secret the server already has
 * (`BASE_SECRET_VARS`, first one found). The derived key is different for every purpose and is never logged. If the server has none
 * of those, it fails closed (throws) instead of falling back to a constant.
 *
 * Setting the explicit variable later CHANGES the key (hashes of emails and test codes, and the links already sent). Set
 * PHONE_HASH_SALT and COLOREAR_LINK_SECRET once, before the first real order, and never rotate them without a plan.
 */

/** Server secrets that exist in production for other reasons, in the order they are tried. Changing this list changes the derived keys. */
export const BASE_SECRET_VARS = ["SUPABASE_SERVICE_ROLE_KEY", "CRON_SECRET", "INNGEST_SIGNING_KEY", "POLAR_WEBHOOK_SECRET"] as const;

/** Values that are public (in the repo or in `.env.example`): never accepted as a secret in production, even when set explicitly. */
export const PUBLIC_SECRET_VALUES: readonly string[] = ["change-me", "changeme", "dev-only-salt-change-me", "dev-only-colorear-secret", "dev-only-secret"];

/** Development-only constants (what the code used before). Used outside production only. */
export const DEV_SECRETS = { piiHash: "dev-only-salt-change-me", colorearLink: "dev-only-colorear-secret" } as const;

/** Purposes: each one gets its own derived key. `piiHash` is shared by phone, email and test-code hashes, as PHONE_HASH_SALT was. */
export type SecretPurpose = keyof typeof DEV_SECRETS;

/** The live deployment. The same test as `mockPaymentsAllowed()`: `VERCEL_ENV` is set by Vercel on every runtime. */
export function isProduction(env: Env = process.env): boolean {
  return env.VERCEL_ENV === "production";
}

/** Minimum length below which an explicit secret only earns a warning (never rejected: that would change existing hashes silently). */
const SHORT_SECRET = 16;

const warned = new Set<string>();
function warnOnce(key: string, message: string): void {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[secrets] ${message}`);
}

/** For tests: forget which warnings were already printed. */
export function resetSecretWarnings(): void {
  warned.clear();
}

function usable(v: string | undefined): string | null {
  const t = (v ?? "").trim();
  return t ? t : null;
}

/**
 * The key for `purpose`. `explicit` is the value of the variable(s) that normally hold it (already chained by the caller, e.g.
 * `COLOREAR_LINK_SECRET || PHONE_HASH_SALT`; empty counts as missing).
 *  - explicit value, not public: used as is (so existing hashes and links keep working).
 *  - production without a usable explicit value: derived from a base server secret (warning once, no values printed); throws if none exists.
 *  - elsewhere without a value: the development constant.
 */
export function serverSecret(env: Env, purpose: SecretPurpose, explicit: string | undefined, label: string): string {
  const given = usable(explicit);
  if (!isProduction(env)) return given ?? DEV_SECRETS[purpose];
  if (given && !PUBLIC_SECRET_VALUES.includes(given)) {
    if (given.length < SHORT_SECRET) warnOnce(`short:${label}`, `${label} is shorter than ${SHORT_SECRET} characters; use a long random value.`);
    return given;
  }
  for (const name of BASE_SECRET_VARS) {
    const base = usable(env[name]);
    if (!base) continue;
    warnOnce(`derived:${label}`, `${label} is ${given ? "a public placeholder" : "not set"} in production; using a key derived from a server secret. Set ${label} to a long random value (once, before the first real order).`);
    return createHmac("sha256", base).update(`lumen:secret:v1:${purpose}`).digest("hex");
  }
  throw new Error(`${label} is not set and the server has no secret to derive it from; refusing to use a public default.`);
}

/** Key of the salted hashes of phone numbers, emails and test codes (PHONE_HASH_SALT). */
export function piiHashKey(env: Env = process.env): string {
  return serverSecret(env, "piiHash", env.PHONE_HASH_SALT, "PHONE_HASH_SALT");
}

/** Key of the signed links (download, unsubscribe, internal run calls): COLOREAR_LINK_SECRET, then PHONE_HASH_SALT, then derived. */
export function colorearLinkKey(env: Env = process.env): string {
  // In production a public placeholder in the first variable must not hide a real value in the second.
  const first = [env.COLOREAR_LINK_SECRET, env.PHONE_HASH_SALT].map(usable).find((v) => v && !(isProduction(env) && PUBLIC_SECRET_VALUES.includes(v)));
  return serverSecret(env, "colorearLink", first ?? undefined, "COLOREAR_LINK_SECRET");
}
