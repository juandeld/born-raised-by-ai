import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { testCodeHash } from "@lumen/generate";

/**
 * The real route handler of the colorear form (`POST /api/colorear/checkout`) with a test code: validation on the server, no payment,
 * the order is marked paid through `handleColorearPayment`, the run is started, and the answer is the status page.
 */
const env = process.env as Record<string, string | undefined>;
let checkout: typeof import("../apps/web/src/server/api/colorear-checkout");
let lib: typeof import("../apps/web/src/lib/colorear");
const kicked: string[] = [];

const jpeg = () => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 120, g: 160, b: 200 } } }).jpeg().toBuffer();

async function form(over: Record<string, string> = {}, ids = ["K1", "K2"]) {
  const fd = new FormData();
  const base: Record<string, string> = { lang: "es", country: "MX", variant: "bundle3", email: "esposa@example.com", age: "5", theme: "el espacio", themeId: "space", creative: "wa", checkboxIds: JSON.stringify(ids), name1: "Manuela", roleId1: "protagonist_girl", name2: "Toby", roleId2: "dog", ...over };
  for (const [k, v] of Object.entries(base)) fd.set(k, v);
  fd.set("photo1", new File([new Uint8Array(await jpeg())], "p1.jpg", { type: "image/jpeg" }));
  fd.set("photo2", new File([new Uint8Array(await jpeg())], "p2.jpg", { type: "image/jpeg" }));
  return fd;
}
let n = 0;
const send = (fd: FormData) => checkout.POST(new Request("http://localhost:3000/api/colorear/checkout", { method: "POST", body: fd, headers: { "x-forwarded-for": `198.51.100.${++n}` } }));

beforeAll(async () => {
  Object.assign(env, {
    DB_PROVIDER: "mock", MOCK_DB_FILE: join(mkdtempSync(join(tmpdir(), "lumen-code-")), "db.json"), STORAGE_PROVIDER: "memory",
    PAYMENT_PROVIDER: "mock", EMAIL_PROVIDER: "mock", IMAGE_PROVIDER: "mock", COLOREAR_COUNTRIES: "MX,ES,GB,US", PHONE_HASH_SALT: "test-salt",
    PUBLIC_BASE_URL: "http://localhost:3000", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", COLOREAR_TEST_CODES: "PROMO2026",
    COLOREAR_TEST_CODE_MAX_USES: "3", COLOREAR_TEST_CODE_DAILY_CAP: "3",
  });
  delete env.VERCEL_ENV;
  // the engine asks for a new invocation of /api/colorear/run through fetch: record it instead of calling out
  vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
    if (String(url).endsWith("/api/colorear/run")) kicked.push(JSON.parse(String(init?.body)).orderId);
    return new Response("{}", { status: 202 });
  }));
  checkout = await import("../apps/web/src/server/api/colorear-checkout");
  lib = await import("../apps/web/src/lib/colorear");
});
afterAll(() => vi.unstubAllGlobals());

describe("the code field on the form", () => {
  const legal = { country: "MX", label: "México", prices: { single: "MX$229", bundle3: "MX$429", threeSingles: "MX$687" }, trioLine: "t", trioRefundLine: "r", emailLine: "e", checkboxes: [{ id: "K1", text: "k1" }, { id: "K2", text: "k2" }], aviso: { title: "a", intro: "i", sections: [], privacyLink: "p: x" }, refundLine: "rf" };
  const render = async (lang: "es" | "en", codeEnabled: boolean) => {
    const { ColorearForm } = await import("../apps/web/src/components/colorear/ColorearForm");
    return renderToStaticMarkup(createElement(ColorearForm, { lang, countries: { MX: legal }, defaultCountry: "MX", themes: [], creative: "x", codeEnabled }));
  };
  it("is a discreet 'Have a code?' disclosure in both languages, and absent when no codes are configured", async () => {
    const es = await render("es", true);
    expect(es).toContain("¿Tienes un código?");
    expect(es).toContain("Con un código válido no se cobra nada.");
    expect(es).toContain('autoCapitalize="characters"');
    expect(es).toContain("Pagar MX$429 y crear el libro"); // the price button stays until a code is typed
    expect(await render("en", true)).toContain("Have a code?");
    expect(await render("es", false)).not.toContain("¿Tienes un código?");
    expect(await render("en", false)).not.toContain("Have a code?");
  });
  it("shows the ordinary acceptance sentence and the refund line until a code is typed; the code variant is only in the page data", async () => {
    const withVariant = { ...legal, checkboxes: [{ id: "K1", text: "k1" }, { id: "K2", text: "Al pagar, acepto" }], code: { payNotice: "Al usar el código, acepto", aviso: { title: "a", intro: "intro de prueba", sections: [{ heading: "H:", body: "a quien conocemos personalmente" }], privacyLink: "p: x" } } };
    const { ColorearForm } = await import("../apps/web/src/components/colorear/ColorearForm");
    const html = renderToStaticMarkup(createElement(ColorearForm, { lang: "es", countries: { MX: withVariant }, defaultCountry: "MX", themes: [], creative: "x", codeEnabled: true }));
    expect(html).toContain("Al pagar, acepto");
    expect(html).toContain("rf"); // the refund line
    expect(html).not.toContain("Al usar el código, acepto");
    expect(html).not.toContain("a quien conocemos personalmente");
  });
  it("the form never receives the codes themselves, only the on/off flag", async () => {
    const { colorearTestCodesEnabled } = await import("@lumen/config");
    expect(colorearTestCodesEnabled(env)).toBe(true);
    expect(await render("es", true)).not.toContain("PROMO2026");
  });
});

describe("POST /api/colorear/checkout with a test code", () => {
  it("answers a clear error for a wrong code and creates nothing", async () => {
    const res = await send(await form({ code: "NOPE" }));
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, errors: { code: "invalid" } });
    expect(await lib.getColorear().d.db.orders.find()).toHaveLength(0);
  });

  it("with the code in any case: no payment, order paid, run started, answer is the status page (Trio)", async () => {
    const res = await send(await form({ code: " promo2026 " }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; url: string; testCode: boolean };
    expect(body).toMatchObject({ ok: true, testCode: true });
    const [order] = await lib.getColorear().d.db.orders.find({ payment_provider: "test_code" });
    expect(body.url).toBe(`https://www.pintoria.app/colorear/confirmacion/${order!.access_token}`);
    expect(order).toMatchObject({ status: "paid", variant: "bundle3", test_mode: true, amount_minor: 0, currency: "MXN" });
    expect(order!.paid_at).toBeTruthy();
    expect(kicked).toContain(order!.id);
    const consents = await lib.getColorear().d.db.consents.find({ order_id: order!.id });
    expect(consents.map((c) => c.checkbox_id).sort()).toEqual(["K1", "K2"]);
    const events = await lib.getColorear().d.db.events.find({ name: "test_code_redeemed" });
    expect(events).toHaveLength(1);
    expect(JSON.stringify(events)).not.toMatch(/promo2026/i);
    expect(JSON.stringify(events)).toContain(testCodeHash(env, "PROMO2026"));
  });

  it("keeps K1 and K2 mandatory", async () => {
    const res = await send(await form({ code: "PROMO2026" }, ["K2"]));
    expect(res.status).toBe(422);
    expect(((await res.json()) as { errors: Record<string, string> }).errors.consent).toBeTruthy();
  });

  it("answers 'exhausted' once the caps are used", async () => {
    for (let i = 0; i < 2; i++) expect((await send(await form({ code: "PROMO2026", variant: "single" }))).status).toBe(200);
    const res = await send(await form({ code: "PROMO2026" }));
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, errors: { code: "exhausted" } });
  });

  it("slows down an address that keeps guessing codes (10 attempts in 10 minutes), with its own message", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    try {
      const start = Date.now() + 3_600_000;
      let last: Response | null = null;
      for (let i = 0; i < 12; i++) {
        vi.setSystemTime(start + i * 10_000); // spaced out, so only the code limiter (not the general 8 per minute) can trip
        last = await checkout.POST(new Request("http://localhost:3000/api/colorear/checkout", { method: "POST", body: await form({ code: `GUESS${i}` }), headers: { "x-forwarded-for": "203.0.113.99" } }));
        if (i < 10) expect(last.status).toBe(422);
      }
      expect(last!.status).toBe(429);
      expect(await last!.json()).toEqual({ ok: false, errors: { code: "rate" } });
    } finally {
      vi.useRealTimers();
    }
  });

  it("an ordinary submit without a code still goes to the payment provider", async () => {
    const res = await send(await form({ variant: "single" }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { url: string; testCode?: boolean };
    expect(body.testCode).toBeUndefined();
    expect(body.url).toContain("/api/mock-pay");
  });
});
