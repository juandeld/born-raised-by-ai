import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Children, cloneElement, createElement, isValidElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { COLOREAR_LANGS, brandConfig, colorearBrandConfig, colorearPrivacyEmail, colorearSupportEmail } from "@lumen/config";
import { composeColorearMessage, createColorearEngine, type ColorearCheckoutInput } from "@lumen/generate";

/**
 * Pintoria has its own mailboxes: lumen-labs.co has no MX records, so a message sent to an address there bounces, and the sender of a
 * rights request or a reply would never get an answer. COLOREAR_SUPPORT_EMAIL and COLOREAR_PRIVACY_EMAIL (defaults soporte@ and privacidad@
 * pintoria.app) replace SUPPORT_EMAIL / PRIVACY_EMAIL, which belong to Santa, in every colorear page and email.
 *
 * The environment below is the one production has: Santa's variables point at lumen-labs.co. Nothing a colorear buyer can read may print it.
 * The only legitimate mention is the `From` header of the emails (Pintoria <hola@lumen-labs.co>, the domain already verified in Resend) until
 * COLOREAR_RESEND_FROM is set; it is not in the body, subject or reply-to.
 */
const SANTA_MAILBOXES = { SUPPORT_EMAIL: "soporte@lumen-labs.co", PRIVACY_EMAIL: "privacidad@lumen-labs.co", PUBLIC_BASE_URL: "https://lumen-labs.co" };
const NOT_LUMEN = /lumen-labs\.co/i;

describe("colorearPrivacyEmail", () => {
  it("defaults to privacidad@pintoria.app, follows COLOREAR_PRIVACY_EMAIL and never PRIVACY_EMAIL (Santa's)", () => {
    expect(colorearPrivacyEmail({})).toBe("privacidad@pintoria.app");
    expect(colorearPrivacyEmail({ PRIVACY_EMAIL: "privacidad@lumen-labs.co" })).toBe("privacidad@pintoria.app");
    expect(colorearPrivacyEmail({ COLOREAR_PRIVACY_EMAIL: " datos@pintoria.app " })).toBe("datos@pintoria.app");
    expect(colorearPrivacyEmail({ COLOREAR_PRIVACY_EMAIL: "" })).toBe("privacidad@pintoria.app");
    expect(colorearPrivacyEmail({ COLOREAR_PRIVACY_EMAIL: "Privacidad <a@b.co>" })).toBe("privacidad@pintoria.app");
  });
  it("the colorear brand block carries both Pintoria mailboxes; Santa's brand block is unchanged", () => {
    expect(colorearBrandConfig(SANTA_MAILBOXES)).toMatchObject({ brand: "Pintoria", supportEmail: "soporte@pintoria.app", privacyEmail: "privacidad@pintoria.app" });
    expect(brandConfig(SANTA_MAILBOXES)).toMatchObject({ supportEmail: "soporte@lumen-labs.co", privacyEmail: "privacidad@lumen-labs.co" });
    expect(brandConfig({})).toMatchObject({ supportEmail: "soporte@lumen-labs.co", privacyEmail: "privacidad@lumen-labs.co" });
    expect(colorearSupportEmail(SANTA_MAILBOXES)).toBe("soporte@pintoria.app");
  });
});

describe("every colorear page", () => {
  const saved: Record<string, string | undefined> = {};
  const set = { ...SANTA_MAILBOXES, LEGAL_HOLDER: "Titular de Prueba", LEGAL_ADDRESS: "Calle 1, Guatemala", LEGAL_EFFECTIVE_DATE: "2026-10-25", COLOREAR_COUNTRIES: "MX,ES,GB,US", COLOREAR_TEST_CODES: "CODIGO-DE-PRUEBA-1", COLOREAR_PUBLIC_URL: "https://www.pintoria.app" };
  beforeAll(() => {
    for (const [k, v] of Object.entries(set)) { saved[k] = process.env[k]; process.env[k] = v; }
    for (const k of ["COLOREAR_SUPPORT_EMAIL", "COLOREAR_PRIVACY_EMAIL"]) { saved[k] = process.env[k]; delete process.env[k]; }
    vi.doMock("next/headers", () => ({ headers: async () => new Headers({ "x-pintoria": "1" }) }));
  });
  afterAll(() => {
    for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
    vi.doUnmock("next/headers");
  });

  /** Server components CHeader and CFooter are async; React's static renderer cannot wait for them, so they are resolved first. */
  async function resolve(node: ReactNode): Promise<ReactNode> {
    if (Array.isArray(node)) return Promise.all(node.map(resolve));
    if (!isValidElement(node)) return node;
    const el = node as { type: unknown; props: Record<string, unknown> };
    if (typeof el.type === "function" && /^C(Header|Footer)$/.test((el.type as { name: string }).name)) return resolve(await (el.type as (p: unknown) => Promise<ReactNode>)(el.props));
    if (el.props.children === undefined) return node;
    const kids = await Promise.all(Children.toArray(el.props.children as ReactNode).map(resolve));
    return cloneElement(node, undefined, ...kids);
  }
  const html = async (page: (p: never) => Promise<ReactNode>, lang: string) => renderToStaticMarkup((await resolve(await page({ params: Promise.resolve({ lang }), searchParams: Promise.resolve({}) } as never))) as never);

  it("prints soporte@pintoria.app and privacidad@pintoria.app and nothing from lumen-labs.co: landing (form, notice, FAQ, footer), privacy and terms, both languages", async () => {
    const landing = (await import("../apps/web/src/app/(colorear)/colorear/[lang]/page")).default;
    const privacy = (await import("../apps/web/src/app/(colorear)/colorear/[lang]/privacidad/page")).default;
    const terms = (await import("../apps/web/src/app/(colorear)/colorear/[lang]/terminos/page")).default;
    const seen: Record<string, string> = {};
    for (const lang of COLOREAR_LANGS) {
      seen[`landing ${lang}`] = await html(landing as never, lang);
      seen[`privacy ${lang}`] = await html(privacy as never, lang);
      seen[`terms ${lang}`] = await html(terms as never, lang);
    }
    for (const [name, page] of Object.entries(seen)) {
      expect(page.length, name).toBeGreaterThan(2000);
      expect(page, name).not.toMatch(NOT_LUMEN);
      expect(page, name).toContain("pintoria.app");
    }
    // the privacy contact is in the notice (landing form details and privacy page); the support address in the footer and the terms
    for (const lang of COLOREAR_LANGS) {
      expect(seen[`privacy ${lang}`]).toContain("privacidad@pintoria.app");
      expect(seen[`landing ${lang}`]).toContain("privacidad@pintoria.app");
      expect(seen[`terms ${lang}`]).toContain("soporte@pintoria.app");
      expect(seen[`landing ${lang}`]).toContain("mailto:soporte@pintoria.app");
      expect(seen[`privacy ${lang}`]).toContain("mailto:soporte@pintoria.app");
    }
  }, 60_000);
});

describe("every colorear email", () => {
  interface Sent { body: Record<string, unknown> }
  const sent: Sent[] = [];
  afterEach(() => vi.unstubAllGlobals());
  const photo = () => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 200, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));
  const input = async (over: Partial<ColorearCheckoutInput> = {}): Promise<ColorearCheckoutInput> => ({
    lang: "es", country: "MX", email: "mama@example.com", persons: [{ name: "Manuela", role: "niña, 6 años" }, { name: "Toby", role: "perro" }],
    photos: [await photo(), await photo()], theme: "el espacio", age: 6, checkboxIds: ["K1", "K2"], ip: "203.0.113.7", creative: "x", device: "mobile", ...over,
  });
  const env = () => ({
    DB_PROVIDER: "mock", MOCK_DB_FILE: join(mkdtempSync(join(tmpdir(), "lumen-mailbox-")), "db.json"), STORAGE_PROVIDER: "memory", PAYMENT_PROVIDER: "mock",
    IMAGE_PROVIDER: "mock", EMAIL_PROVIDER: "resend", RESEND_API_KEY: "re_test", RESEND_FROM: "Jinglo <hola@lumen-labs.co>", COLOREAR_COUNTRIES: "MX,ES,GB,US",
    COLOREAR_PUBLIC_URL: "https://www.pintoria.app", PHONE_HASH_SALT: "test-salt", LEGAL_HOLDER: "Titular de Prueba", LEGAL_ADDRESS: "Calle 1, Guatemala",
    COLOREAR_TEST_CODES: "CODIGO-DE-PRUEBA-1", ...SANTA_MAILBOXES,
  }) as Record<string, string | undefined>;

  async function lifecycle(over: Partial<ColorearCheckoutInput>) {
    const engine = createColorearEngine({ env: env() });
    const { order } = await engine.createCheckout(await input(over), { successUrl: (o) => `https://www.pintoria.app/colorear/confirmacion/${o.access_token}`, cancelUrl: "https://www.pintoria.app/" });
    await engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: "pay_1" });
    expect((await engine.runGeneration(order.id)).status).toBe("done");
    const done = (await engine.d.db.orders.get(order.id))!;
    expect((await engine.refundByLink(done.access_token)).refunded).toBe(true);
    return engine;
  }

  it("receipt, delivery and refund of a paid order and of a test-code order, in Spanish and English, print only Pintoria's mailboxes (the From header is the one mention)", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
      if (String(url).includes("api.resend.com")) { sent.push({ body: JSON.parse(String(init?.body)) as Record<string, unknown> }); return new Response(JSON.stringify({ id: `re_${sent.length}` }), { status: 200 }); }
      return new Response("{}", { status: 202 });
    }));
    sent.length = 0;
    for (const over of [{}, { testCode: "codigo-de-prueba-1" }, { lang: "en" as const, country: "US" as const }, { lang: "en" as const, country: "US" as const, testCode: "CODIGO-DE-PRUEBA-1" }]) await lifecycle(over);
    expect(sent.length).toBeGreaterThanOrEqual(12); // 4 orders x (receipt, delivery, refund)
    for (const s of sent) {
      const { from, ...rest } = s.body;
      expect(from).toBe("Pintoria <hola@lumen-labs.co>"); // the only mention of the domain, a header and not text
      expect(JSON.stringify(rest), String(s.body.subject)).not.toMatch(NOT_LUMEN);
      expect(s.body.reply_to).toBe("soporte@pintoria.app");
    }
    const text = sent.map((s) => String(s.body.text ?? "")).join("\n");
    expect(text).toContain("privacidad@pintoria.app"); // the privacy contact at the foot of the receipts
    expect(text).toContain("soporte@pintoria.app"); // the support address at the foot of delivery and refund
  }, 120_000);

  it("no message of any kind, language or variant built with the colorear brand prints a lumen-labs.co address", () => {
    const b = colorearBrandConfig(SANTA_MAILBOXES);
    const vars = { names: "Ana", price: "$1", statusLink: "https://www.pintoria.app/s", deliveryLink: "https://www.pintoria.app/d", refundLink: "https://www.pintoria.app/r", deleteDate: "2026-11-30", holder: "Titular de Prueba", privacyEmail: b.privacyEmail, supportEmail: b.supportEmail, brand: b.brand, address: "Calle 1", stopLink: "https://www.pintoria.app/b", landingLink: "https://www.pintoria.app/l", commercialOk: true, offerPrice: "$9", offerUntil: "u", offerLink: "https://www.pintoria.app/o", creditsLeft: 2, creditsUntil: "u", parentLink: "https://www.pintoria.app/p", daysLeft: 5 };
    let n = 0;
    for (const lang of COLOREAR_LANGS) for (const kind of ["receipt", "receipt_add", "delivery", "refund", "reminder"] as const) for (const extra of [{}, { testOrder: true }, { kind: "credit" as const }, { kind: "add" as const }, { legalLang: "es-ES" as const }, { creditsLeft: 0 }]) {
      const m = composeColorearMessage(kind, lang, "a@b.co", { ...vars, ...extra });
      expect(JSON.stringify(m), `${lang} ${kind} ${JSON.stringify(extra)}`).not.toMatch(NOT_LUMEN);
      n++;
    }
    expect(n).toBe(COLOREAR_LANGS.length * 5 * 6);
  });
});
