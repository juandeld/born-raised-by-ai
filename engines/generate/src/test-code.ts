import { createHmac, timingSafeEqual } from "node:crypto";
import { colorearTestCodes, normalizeTestCode } from "@lumen/config";

type Env = Record<string, string | undefined>;

/** `orders.payment_provider` of an order made with a test code (no payment, real generation). */
export const TEST_CODE_PROVIDER = "test_code";

/** Longest code the server looks at. Anything longer cannot be a configured code. */
export const TEST_CODE_MAX_INPUT = 64;

const keyed = (env: Env, value: string): Buffer => createHmac("sha256", env.PHONE_HASH_SALT ?? "dev-only-salt-change-me").update(`colorear-test-code:${value}`).digest();

/**
 * The configured code that `raw` spells (case and spaces ignored), or null. Compares keyed digests in constant time, so response
 * time does not reveal how much of a guess was right.
 */
export function matchTestCode(env: Env, raw: string): string | null {
  const configured = colorearTestCodes(env);
  if (!configured.length || !raw || raw.length > TEST_CODE_MAX_INPUT) return null;
  const wanted = keyed(env, normalizeTestCode(raw));
  let found: string | null = null;
  for (const code of configured) if (timingSafeEqual(keyed(env, code), wanted)) found = code;
  return found;
}

/** Short keyed hash that identifies a code in orders and analytics without exposing it (10 hex chars, 40 bits). */
export function testCodeHash(env: Env, code: string): string {
  return keyed(env, normalizeTestCode(code)).toString("hex").slice(0, 10);
}

/** `checkout_id` / `payment_id` of a test-code order: carries the code hash so uses can be counted in the database. */
export const testCodeRef = (hash: string, orderId: string): string => `testcode:${hash}:${orderId}`;
export const isTestCodeRef = (ref: string | null | undefined, hash: string): boolean => !!ref && ref.startsWith(`testcode:${hash}:`);
