import { createHmac } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { brandConfig } from "@lumen/config";
import { BASE_SECRET_VARS, DEV_SECRETS, PUBLIC_SECRET_VALUES, colorearLinkKey, piiHashKey, resetSecretWarnings, serverSecret } from "@lumen/config/secrets";
import { MemoryStorage, MockDeliveryProvider, hashPhone } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider } from "@lumen/payments";
import { ColorearEngine, MockImageProvider, TemplateStoryProvider, matchTestCode, signLink, testCodeHash, verifyLink } from "@lumen/generate";

/**
 * QA round of 25-oct, B1: PHONE_HASH_SALT and COLOREAR_LINK_SECRET had public fallbacks in the repository. On the live deployment (VERCEL_ENV=production)
 * a public constant must never be a key: a missing secret is derived from a secret the server already has, and with none the code refuses to run.
 */
const hmac = (key: string, data: string) => createHmac("sha256", key).update(data).digest("hex");
const BASE = "service-role-key-for-tests-0123456789abcdef";
const PROD = { VERCEL_ENV: "production", SUPABASE_SERVICE_ROLE_KEY: BASE } as Record<string, string | undefined>;
const PHONE = "+525512345678";

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetSecretWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
});
afterEach(() => warn.mockRestore());

describe("outside production nothing changes", () => {
  it("an empty environment still hashes and signs with the development constants, so tests and `npm run dev` work", () => {
    expect(hashPhone(PHONE, {})).toBe(hmac(DEV_SECRETS.piiHash, PHONE));
    const signed = signLink({}, "baja", "tok", 60);
    const [exp, sig] = signed.split(".");
    expect(sig).toBe(hmac(DEV_SECRETS.colorearLink, `baja.tok.${exp}`).slice(0, 40));
    expect(verifyLink({}, "baja", "tok", signed)).toBe(true);
    expect(warn).not.toHaveBeenCalled();
  });
  it("a preview deployment is not production", () => {
    expect(hashPhone(PHONE, { VERCEL_ENV: "preview" })).toBe(hmac(DEV_SECRETS.piiHash, PHONE));
  });
});

describe("in production a public constant is never used as a key", () => {
  it("hashPhone without PHONE_HASH_SALT uses a key derived from the server secret: not the constant, not 'change-me', stable, different per base secret", () => {
    const h = hashPhone(PHONE, PROD);
    expect(h).not.toBe(hmac(DEV_SECRETS.piiHash, PHONE));
    for (const bad of PUBLIC_SECRET_VALUES) expect(h).not.toBe(hmac(bad, PHONE));
    expect(hashPhone(PHONE, PROD)).toBe(h);
    expect(hashPhone(PHONE, { ...PROD, SUPABASE_SERVICE_ROLE_KEY: BASE + "x" })).not.toBe(h);
    expect(h).toBe(hmac(piiHashKey(PROD), PHONE));
  });

  it("every purpose has its own key, so the link key can never be used to undo the hashes", () => {
    expect(colorearLinkKey(PROD)).not.toBe(piiHashKey(PROD));
    expect(colorearLinkKey(PROD)).not.toBe(BASE);
    expect(piiHashKey(PROD)).not.toBe(BASE);
  });

  it("signed links cannot be forged with the constant that used to be in the repository, and still round-trip", () => {
    const exp = Math.floor(Date.now() / 1000) + 600;
    const forged = hmac(DEV_SECRETS.colorearLink, `colorear-run.order-1.${exp}`).slice(0, 40);
    expect(verifyLink(PROD, "colorear-run", "order-1", `${exp}.${forged}`)).toBe(false);
    const real = signLink(PROD, "colorear-run", "order-1", 600);
    expect(verifyLink(PROD, "colorear-run", "order-1", real)).toBe(true);
    expect(verifyLink({ ...PROD, SUPABASE_SERVICE_ROLE_KEY: BASE + "x" }, "colorear-run", "order-1", real)).toBe(false);
  });

  it("the hash of a test code (kept in checkout_id) cannot be reversed with the constant, and the code still matches", () => {
    const env = { ...PROD, COLOREAR_TEST_CODES: "ABC123" };
    const devHash = testCodeHash({ COLOREAR_TEST_CODES: "ABC123" }, "ABC123"); // what a dictionary attack with the public constant computes
    expect(testCodeHash(env, "ABC123")).not.toBe(devHash);
    expect(testCodeHash(env, "abc 123")).toBe(testCodeHash(env, "ABC123"));
    expect(matchTestCode(env, " abc123 ")).toBe("ABC123");
    expect(matchTestCode(env, "ABC124")).toBeNull();
  });

  it("with no server secret to derive from it refuses to run, for every use, instead of falling back to a constant", () => {
    const bare = { VERCEL_ENV: "production", COLOREAR_TEST_CODES: "ABC123" };
    expect(() => hashPhone(PHONE, bare)).toThrow(/refusing to use a public default/);
    expect(() => signLink(bare, "baja", "tok", 60)).toThrow(/refusing to use a public default/);
    expect(() => testCodeHash(bare, "ABC123")).toThrow(/refusing to use a public default/);
    expect(() => matchTestCode(bare, "ABC123")).toThrow(/refusing to use a public default/);
    expect(() => serverSecret(bare, "piiHash", undefined, "PHONE_HASH_SALT")).toThrow();
  });

  it.each([...BASE_SECRET_VARS])("%s alone is enough to derive the keys", (name) => {
    const env = { VERCEL_ENV: "production", [name]: "some-server-secret-value-0123456789" };
    expect(() => hashPhone(PHONE, env)).not.toThrow();
    expect(hashPhone(PHONE, env)).not.toBe(hmac(DEV_SECRETS.piiHash, PHONE));
  });

  it("a placeholder set explicitly ('change-me' from .env.example, or the old constants) or an empty value counts as missing", () => {
    const derived = hashPhone(PHONE, PROD);
    for (const bad of [...PUBLIC_SECRET_VALUES, "", "   "]) {
      expect(hashPhone(PHONE, { ...PROD, PHONE_HASH_SALT: bad })).toBe(derived);
    }
    // a placeholder in the first variable must not hide a real value in the second
    const real = "a-long-random-value-1234567890";
    expect(colorearLinkKey({ ...PROD, COLOREAR_LINK_SECRET: "change-me", PHONE_HASH_SALT: real })).toBe(real);
  });

  it("warns once per secret, naming the variable and never printing a value", () => {
    for (let i = 0; i < 3; i++) {
      hashPhone(PHONE, PROD);
      signLink(PROD, "baja", "tok", 60);
    }
    const lines = warn.mock.calls.map((c) => String(c[0]));
    expect(lines.filter((l) => l.includes("PHONE_HASH_SALT"))).toHaveLength(1);
    expect(lines.filter((l) => l.includes("COLOREAR_LINK_SECRET"))).toHaveLength(1);
    for (const l of lines) {
      expect(l).not.toContain(BASE);
      expect(l).not.toContain(piiHashKey(PROD));
      expect(l).not.toContain(colorearLinkKey(PROD));
    }
  });
});

describe("in production an explicit secret keeps working exactly as before (existing hashes and links stay valid)", () => {
  const SALT = "a-long-random-value-1234567890";
  const LINK = "another-long-random-value-0987654321";
  it("PHONE_HASH_SALT is the HMAC key as is; COLOREAR_LINK_SECRET wins over PHONE_HASH_SALT for links, which fall back to the salt", () => {
    const env = { ...PROD, PHONE_HASH_SALT: SALT };
    expect(hashPhone(PHONE, env)).toBe(hmac(SALT, PHONE));
    expect(testCodeHash({ ...env, COLOREAR_TEST_CODES: "ABC123" }, "ABC123")).toBe(hmac(SALT, "colorear-test-code:ABC123").slice(0, 10));
    const exp = 1_900_000_000;
    const at = exp * 1000 - 100_000;
    expect(signLink(env, "baja", "tok", 100, at)).toBe(`${exp}.${hmac(SALT, `baja.tok.${exp}`).slice(0, 40)}`);
    expect(signLink({ ...env, COLOREAR_LINK_SECRET: LINK }, "baja", "tok", 100, at)).toBe(`${exp}.${hmac(LINK, `baja.tok.${exp}`).slice(0, 40)}`);
    expect(warn).not.toHaveBeenCalled();
  });
  it("a short secret still works but earns a warning", () => {
    expect(hashPhone(PHONE, { ...PROD, PHONE_HASH_SALT: "short" })).toBe(hmac("short", PHONE));
    expect(warn.mock.calls.some((c) => String(c[0]).includes("shorter than"))).toBe(true);
  });
});

describe("the consent hash of an order (engine) follows the same rule", () => {
  it("a test-code order paid in production without PHONE_HASH_SALT records a consent hash that the public constant does not give", async () => {
    const db = createMemoryDb();
    const sink = new MemorySink();
    const env: Record<string, string | undefined> = { ...PROD, COLOREAR_COUNTRIES: "MX", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala", COLOREAR_TEST_CODES: "ABC123" };
    const now = new Date("2026-11-20T15:00:00Z");
    const engine = new ColorearEngine({
      db, storage: new MemoryStorage(), uploads: new MemoryStorage(), delivery: new MockDeliveryProvider(), image: new MockImageProvider(), mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
      tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => now), payments: new MockPaymentProvider("http://localhost:3000"), env, now: () => now, brand: { ...brandConfig(env), brand: "Pintoria" },
    });
    const photo = new Uint8Array(await sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 1, g: 2, b: 3 } } }).jpeg().toBuffer());
    const { order } = await engine.createCheckout(
      { lang: "es", country: "MX", email: "Amigo@Example.com", persons: [{ name: "Manuela", role: "niña, 6 años" }], photos: [photo], theme: "", age: 6, checkboxIds: ["K1", "K2"], ip: null, testCode: "abc123" },
      { successUrl: () => "https://www.pintoria.app/x", cancelUrl: "http://x/" },
    );
    await engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: order.checkout_id! });
    const consents = await db.consents.find({ order_id: order.id });
    expect(consents.length).toBeGreaterThan(0);
    for (const c of consents) {
      expect(c.phone_e164_hash).toBe(hmac(piiHashKey(env), "amigo@example.com"));
      expect(c.phone_e164_hash).not.toBe(hmac(DEV_SECRETS.piiHash, "amigo@example.com"));
    }
  });
});

describe("the repository holds no usable secret", () => {
  const root = join(__dirname, "..");
  const walk = (dir: string, out: string[] = []): string[] => {
    for (const name of readdirSync(dir)) {
      if (name === "node_modules" || name === ".next" || name === "dist") continue;
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.(ts|tsx)$/.test(name) && !/\.test\.ts$/.test(name)) out.push(p);
    }
    return out;
  };
  const sources = ["engines", "packages", "apps/web/src", "scripts"].flatMap((d) => walk(join(root, d)));

  it("the development constants live only in packages/config/src/secrets.ts", () => {
    const holders = sources.filter((f) => /dev-only-/.test(readFileSync(f, "utf8"))).map((f) => relative(root, f));
    expect(holders).toEqual(["packages/config/src/secrets.ts"]);
  });

  it("no code reads PHONE_HASH_SALT or COLOREAR_LINK_SECRET directly: everything goes through the helper", () => {
    const direct = sources
      .filter((f) => !f.endsWith("packages/config/src/secrets.ts"))
      .filter((f) => /(?:env|process\.env)\??\.(?:PHONE_HASH_SALT|COLOREAR_LINK_SECRET)|\[["'](?:PHONE_HASH_SALT|COLOREAR_LINK_SECRET)["']\]/.test(readFileSync(f, "utf8")))
      .map((f) => relative(root, f));
    expect(direct).toEqual([]);
  });
});
