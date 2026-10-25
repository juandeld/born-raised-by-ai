import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createElement } from "react";
import { renderToReadableStream, renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import {
  AGE_LEVELS, COLOREAR_DEFAULT_COUNTRY, COLOREAR_PRICES, COUNTRIES, brandConfig, colorearCountries, colorearCountriesFor, colorearLegalLocale, colorearPrice, enabledCountries,
  formatPrice, paperFor, priceFor, toUsdCents,
} from "@lumen/config";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider, polarCatalog } from "@lumen/payments";
import { ColorearEngine, MockImageProvider, TemplateStoryProvider, type ColorearCheckoutInput } from "@lumen/generate";

/**
 * Pintoria launch (25-oct): the book is offered in the United States and Guatemala, both in USD ($12.99 one adventure, $24.99 Trio,
 * $9.49 "otra aventura"), with Mexico, Spain and the UK hidden (not deleted). The "Adults" level is hidden unless COLOREAR_ADULT_LEVEL is on.
 */
// The landing is rendered outside a request: the header helper (Pintoria host detection) gets an empty header set.
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));

const photo = () => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 200, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));

describe("countries and prices", () => {
  it("offers US and GT by default and brings MX, ES and GB back only when listed (their configuration stays)", () => {
    expect(colorearCountries({})).toEqual(["US", "GT"]);
    expect(colorearCountries({ COLOREAR_COUNTRIES: "MX,ES,GB,US" })).toEqual(["MX", "ES", "GB", "US"]);
    expect(colorearCountries({ COLOREAR_COUNTRIES: "XX" })).toEqual(["US"]);
    expect(colorearCountriesFor("es", {})).toEqual(["GT", "US"]);
    expect(colorearCountriesFor("en", {})).toEqual(["US", "GT"]);
    expect(colorearCountriesFor("es", { COLOREAR_COUNTRIES: "MX,ES,GB,US,GT" })).toEqual(["GT", "US", "MX", "ES"]);
    expect(colorearCountriesFor("en", { COLOREAR_COUNTRIES: "MX,ES,GB,US,GT" })).toEqual(["US", "GT", "GB"]);
    expect(COLOREAR_DEFAULT_COUNTRY).toEqual({ es: "GT", en: "US" });
    // nothing was deleted: the other prices are still there
    expect(colorearPrice("MX", "single")).toEqual({ amountMinor: 22900, currency: "MXN" });
    expect(colorearPrice("ES", "bundle3")).toEqual({ amountMinor: 2299, currency: "EUR" });
    expect(colorearPrice("GB", "add1")).toEqual({ amountMinor: 749, currency: "GBP" });
  });

  it("US and Guatemala pay the same in USD: $12.99, Trio $24.99, another adventure $9.49", () => {
    const usd = { single: { amountMinor: 1299, currency: "USD" }, bundle3: { amountMinor: 2499, currency: "USD" }, add1: { amountMinor: 949, currency: "USD" } };
    expect(COLOREAR_PRICES.US).toEqual(usd);
    expect(COLOREAR_PRICES.GT).toEqual(usd);
    for (const c of ["US", "GT"] as const) {
      const f = (v: "single" | "bundle3" | "add1") => formatPrice(colorearPrice(c, v).amountMinor, "USD", COUNTRIES[c].priceFormatLocale);
      expect([f("single"), f("bundle3"), f("add1")], c).toEqual(["$12.99", "$24.99", "$9.49"]);
      expect(formatPrice(colorearPrice(c, "single").amountMinor * 3, "USD", COUNTRIES[c].priceFormatLocale)).toBe("$38.97"); // the struck-through "3 singles"
      expect(toUsdCents(colorearPrice(c, "single").amountMinor, "USD", {})).toBe(1299);
      expect(colorearPrice(c, "bundle3").amountMinor).toBeLessThan(2 * colorearPrice(c, "single").amountMinor);
      expect(paperFor(c)).toBe("letter");
    }
  });

  it("the legal text follows the language of the page for US and GT, and the other countries keep theirs", () => {
    expect(colorearLegalLocale("GT", "es")).toBe("es-419");
    expect(colorearLegalLocale("GT", "en")).toBe("en");
    expect(colorearLegalLocale("US", "es")).toBe("es-419");
    expect(colorearLegalLocale("US", "en")).toBe("en");
    expect(colorearLegalLocale("US")).toBe("en"); // old callers
    expect(colorearLegalLocale("ES", "es")).toBe("es-ES");
    expect(colorearLegalLocale("GB", "en")).toBe("en");
    expect(colorearLegalLocale("MX", "es")).toBe("es-419");
  });

  it("Jinglo (Santa calls) does not start selling in Guatemala because the country type has it", () => {
    expect(enabledCountries({})).not.toContain("GT");
    expect(polarCatalog({}).filter((i) => i.product === "santa").map((i) => i.country)).not.toContain("GT");
    expect(priceFor("US", "single").currency).toBe("USD");
  });

  it("the payment catalog asks for the USD products of GT next to the US ones", () => {
    const keys = polarCatalog({}).filter((i) => i.product === "colorear").map((i) => `${i.key}:${i.currency}:${i.amountMinor}`);
    expect(keys).toEqual([
      "colorear:US:single:USD:1299", "colorear:US:bundle3:USD:2499", "colorear:US:add1:USD:949",
      "colorear:GT:single:USD:1299", "colorear:GT:bundle3:USD:2499", "colorear:GT:add1:USD:949",
    ]);
  });
});

function harness(extra: Record<string, string> = {}) {
  const db = createMemoryDb();
  const storage = new MemoryStorage();
  const uploads = new MemoryStorage();
  const delivery = new MockDeliveryProvider();
  const sink = new MemorySink();
  const clock = { now: new Date("2026-11-20T15:00:00Z") };
  // no COLOREAR_COUNTRIES: the defaults decide
  const env: Record<string, string> = { COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala", PHONE_HASH_SALT: "s", COLOREAR_TEST_CODES: "PROMO2026", ...extra };
  const engine = new ColorearEngine({
    db, storage, uploads, delivery, image: new MockImageProvider(), mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
    tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => clock.now),
    payments: new MockPaymentProvider("http://localhost:3000"), env, now: () => clock.now, brand: { ...brandConfig(env), brand: "Pintoria" },
  });
  return { engine, db, delivery, sink, env };
}
type H = ReturnType<typeof harness>;

async function input(over: Partial<ColorearCheckoutInput> = {}): Promise<ColorearCheckoutInput> {
  return {
    lang: "es", country: "GT", email: "mama@example.com",
    persons: [{ name: "Manuela", role: "niña, 6 años" }, { name: "Toby", role: "perro" }],
    photos: [await photo(), await photo()], theme: "el espacio", age: 6, checkboxIds: ["K1", "K2"], ip: "203.0.113.7", creative: "x", device: "mobile", ...over,
  };
}
const urls = { successUrl: (o: { access_token: string }) => `http://x/colorear/confirmacion/${o.access_token}`, cancelUrl: "http://x/" };
async function buy(h: H, over: Partial<ColorearCheckoutInput> = {}) {
  const { order } = await h.engine.createCheckout(await input(over), urls);
  return (await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: `pay_${order.id.slice(0, 6)}` }))!;
}

describe("orders in USD", () => {
  it("a Guatemala order is USD at $12.99 (Trio $24.99), in the language of the page, and the receipt says so", async () => {
    const h = harness();
    const single = await buy(h);
    expect(single).toMatchObject({ country: "GT", currency: "USD", amount_minor: 1299, amount_usd_cents: 1299, variant: "single", locale: "es-419", language: "es-419" });
    const receipt = h.delivery.sent.filter((m) => m.kind === "receipt").at(-1)!;
    expect(receipt.text).toContain("$12.99");
    expect(receipt.text).not.toMatch(/MX\$|MXN|€|£/);
    const trio = await buy(h, { variant: "bundle3", lang: "en" });
    expect(trio).toMatchObject({ country: "GT", currency: "USD", amount_minor: 2499, variant: "bundle3", locale: "en", language: "en" });
    expect(h.delivery.sent.filter((m) => m.kind === "receipt").at(-1)!.text).toContain("$24.99");
  });

  it("a US order on the Spanish page keeps Spanish legal text (locale and language agree)", async () => {
    const h = harness();
    const o = await buy(h, { country: "US", lang: "es" });
    expect(o).toMatchObject({ country: "US", currency: "USD", amount_minor: 1299, locale: "es-419", language: "es-419" });
    const en = await buy(h, { country: "US", lang: "en" });
    expect(en).toMatchObject({ locale: "en", language: "en" });
  });

  it("Mexico, Spain and the UK are not for sale by default, and sell again when COLOREAR_COUNTRIES lists them", async () => {
    const h = harness();
    for (const country of ["MX", "ES", "GB"] as const) {
      const err = await h.engine.createCheckout(await input({ country }), urls).catch((e) => e);
      expect((err as { errors?: Record<string, string> }).errors?.country, country).toBe("Country not open for sale");
    }
    const back = harness({ COLOREAR_COUNTRIES: "MX,ES,GB,US,GT" });
    expect(await buy(back, { country: "MX" })).toMatchObject({ currency: "MXN", amount_minor: 22900 });
    expect(await buy(back, { country: "ES", lang: "es" })).toMatchObject({ currency: "EUR", amount_minor: 1199 });
    expect(await buy(back, { country: "GB", lang: "en" })).toMatchObject({ currency: "GBP", amount_minor: 999 });
  });

  it("an order with a test code stays at $0 in USD, with no offer", async () => {
    const h = harness();
    const { order } = await h.engine.createCheckout(await input({ testCode: "PROMO2026" }), urls);
    expect(order).toMatchObject({ country: "GT", currency: "USD", amount_minor: 0, amount_usd_cents: 0, payment_provider: "test_code" });
    const paid = (await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: "p" }))!;
    expect((await h.engine.runGeneration(paid.id)).status).toBe("done");
    const st = (await h.engine.getStatus(paid.access_token))!;
    expect(st.offer).toBeNull();
    for (const m of h.delivery.sent) expect(m.text).not.toMatch(/\$12\.99|\$24\.99|\$9\.49/);
  }, 60_000);

  it("the 'otra aventura' offer, its email and its receipt are in USD ($9.49) for GT and US", async () => {
    for (const country of ["GT", "US"] as const) {
      const h = harness();
      const paid = await buy(h, { country });
      expect((await h.engine.runGeneration(paid.id)).status).toBe("done");
      const parent = (await h.db.orders.get(paid.id))!;
      const st = (await h.engine.getStatus(parent.access_token))!;
      expect(st.offer, country).toMatchObject({ price: "$9.49" });
      const mail = h.delivery.sent.find((m) => m.kind === "delivery")!;
      expect(mail.text, country).toContain("$9.49");
      expect(mail.text).not.toMatch(/MX\$|MXN|€|£/);
      const res = await h.engine.createUpsellCheckout(parent.access_token, st.offer!.sig, { theme: "piratas", themeId: "pirates", ip: "203.0.113.7" }, urls);
      if (!res.ok) throw new Error(res.reason);
      expect(res.order).toMatchObject({ variant: "add1", amount_minor: 949, amount_usd_cents: 949, currency: "USD", country, parent_order_id: paid.id });
      await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: res.order.id, checkoutId: res.order.checkout_id, paymentId: "pay_add" });
      expect(h.delivery.sent.filter((m) => m.kind === "receipt").at(-1)!.text, country).toContain("$9.49");
    }
  }, 120_000);
});

describe("the Adults level is hidden unless COLOREAR_ADULT_LEVEL is on", () => {
  it("the server refuses the adult level (age 18) in a forged order and takes the four children's levels", async () => {
    const h = harness();
    const err = await h.engine.createCheckout(await input({ age: 18 }), urls).catch((e) => e);
    expect((err as { errors?: Record<string, string> }).errors?.age).toBeTruthy();
    expect(await h.db.orders.find()).toHaveLength(0);
    for (const lv of AGE_LEVELS.filter((l) => l.band !== "adult")) expect((await h.engine.createCheckout(await input({ age: lv.age }), urls)).order.child_age).toBe(lv.age);
    const on = harness({ COLOREAR_ADULT_LEVEL: "1" });
    expect((await on.engine.createCheckout(await input({ age: 18 }), urls)).order.child_age).toBe(18);
  });
});

// ------------------------------------------------------------------ the pages

const env = process.env as Record<string, string | undefined>;
let checkout: typeof import("../apps/web/src/server/api/colorear-checkout");
let lib: typeof import("../apps/web/src/lib/colorear");
const jpeg = () => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 120, g: 160, b: 200 } } }).jpeg().toBuffer();
let ip = 0;

async function post(over: Record<string, string> = {}) {
  const fd = new FormData();
  const base: Record<string, string> = { lang: "es", country: "GT", variant: "single", email: "mama@example.com", age: "4", theme: "el espacio", themeId: "space", creative: "wa", checkboxIds: JSON.stringify(["K1", "K2"]), name1: "Leo", roleId1: "protagonist_boy", code: "PROMO2026", ...over };
  for (const [k, v] of Object.entries(base)) fd.set(k, v);
  fd.set("photo1", new File([new Uint8Array(await jpeg())], "p1.jpg", { type: "image/jpeg" }));
  return checkout.POST(new Request("http://localhost:3000/api/colorear/checkout", { method: "POST", body: fd, headers: { "x-forwarded-for": `198.51.100.${++ip}` } }));
}

describe("the pages and the checkout route", () => {
  beforeAll(async () => {
    Object.assign(env, {
      DB_PROVIDER: "mock", MOCK_DB_FILE: join(mkdtempSync(join(tmpdir(), "lumen-usd-")), "db.json"), STORAGE_PROVIDER: "memory",
      PAYMENT_PROVIDER: "mock", EMAIL_PROVIDER: "mock", IMAGE_PROVIDER: "mock", PHONE_HASH_SALT: "test-salt", PUBLIC_BASE_URL: "http://localhost:3000",
      COLOREAR_PUBLIC_URL: "https://www.pintoria.app", COLOREAR_TEST_CODES: "PROMO2026", COLOREAR_TEST_CODE_MAX_USES: "50", COLOREAR_TEST_CODE_DAILY_CAP: "50",
    });
    delete env.VERCEL_ENV;
    delete env.COLOREAR_COUNTRIES; // the defaults
    delete env.COLOREAR_ADULT_LEVEL;
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 202 })));
    checkout = await import("../apps/web/src/server/api/colorear-checkout");
    lib = await import("../apps/web/src/lib/colorear");
  });
  afterAll(() => vi.unstubAllGlobals());

  /** The landing is an async server component: render it as a stream and wait until everything has arrived. */
  const renderPage = async (el: unknown) => {
    const stream = await renderToReadableStream(el as never);
    await stream.allReady;
    return new Response(stream).text();
  };
  const landing = async (lang: "es" | "en") => {
    const { default: Landing } = await import("../apps/web/src/app/(colorear)/colorear/[lang]/page");
    return renderPage(await Landing({ params: Promise.resolve({ lang }), searchParams: Promise.resolve({}) }));
  };

  const legal = (country: string, label: string) => ({
    country, label, prices: { single: "$12.99", bundle3: "$24.99", threeSingles: "$38.97" }, trioLine: "t", trioRefundLine: "r", emailLine: "e",
    checkboxes: [{ id: "K1", text: "k1" }, { id: "K2", text: "k2" }], aviso: { title: "a", intro: "i", sections: [], privacyLink: "Privacidad: x" }, refundLine: "rf",
  });
  const renderForm = async (lang: "es" | "en", adultLevel?: boolean) => {
    const { ColorearForm } = await import("../apps/web/src/components/colorear/ColorearForm");
    return renderToStaticMarkup(createElement(ColorearForm, {
      lang, countries: { GT: legal("GT", "Guatemala"), US: legal("US", lang === "es" ? "Estados Unidos" : "United States") }, defaultCountry: lang === "es" ? "GT" : "US",
      themes: [], creative: "x", ...(adultLevel === undefined ? {} : { adultLevel }),
    }));
  };

  it("the form shows the four children's levels and hides Adults by default, in both languages", async () => {
    const es = await renderForm("es");
    for (const t of ["3 a 4 años", "5 a 6 años", "7 a 8 años", "9 a 12 años"]) expect(es).toContain(t);
    expect(es).not.toContain("Adultos");
    expect(es).not.toMatch(/mandala/i);
    const en = await renderForm("en", false);
    for (const t of ["Ages 3 to 4", "Ages 5 to 6", "Ages 7 to 8", "Ages 9 to 12"]) expect(en).toContain(t);
    expect(en).not.toContain("Adults");
    // turned on: the fifth card is back
    expect(await renderForm("es", true)).toContain("Adultos: relajante, estilo mandala");
    expect(await renderForm("en", true)).toContain("Adults: relaxing, mandala style");
  });

  it("the form's country list prices Guatemala and the United States in dollars", async () => {
    const es = await renderForm("es");
    // the list shows the price of the selected option, and the form opens on the Trio
    expect(es).toContain("Guatemala ($24.99)");
    expect(es).toContain("Estados Unidos ($24.99)");
    expect(es).not.toMatch(/MX\$|México|España|Reino Unido/);
    expect(await renderForm("en")).toContain("United States ($24.99)");
  });

  it("the landing page sells in USD, says 3 to 12 years in the badge, the FAQ and the meta tags, and never mentions adults", async () => {
    const { generateMetadata } = await import("../apps/web/src/app/(colorear)/colorear/[lang]/page");
    for (const [lang, badge, faqQ, firstPrice] of [["es", "De 3 a 12 años", "¿Para qué edades es?", "$12.99 una sola vez"], ["en", "Ages 3 to 12", "Which ages is it for?", "$12.99 one time"]] as const) {
      const html = await landing(lang);
      expect(html, lang).toContain(badge);
      expect(html).toContain(faqQ);
      expect(html).toContain(firstPrice);
      expect(html).toContain("$24.99");
      expect(html).toContain("$38.97");
      expect(html).not.toMatch(/MX\$|€|£|\bMXN\b/);
      // no Adults level card (the consent text may still say "the adults shown in the photos")
      expect(html).not.toMatch(/adultos?: relaj|adults: relax|adultos?<|adults<|mandala|zentangle/i);
      const meta = (await generateMetadata({ params: Promise.resolve({ lang }) })) as { description: string };
      expect(meta.description).toContain(lang === "es" ? "De 3 a 12 años" : "Ages 3 to 12");
      expect(meta.description).not.toMatch(/adultos|adults/i);
    }
  });

  it("with COLOREAR_ADULT_LEVEL on, the landing form offers the Adults level again", async () => {
    env.COLOREAR_ADULT_LEVEL = "1";
    try {
      expect(await landing("es")).toContain("Adultos: relajante");
    } finally {
      delete env.COLOREAR_ADULT_LEVEL;
    }
  });

  it("POST /api/colorear/checkout: a forged adult level is refused with 422, a children's level and Guatemala go through at $0 with a code", async () => {
    const refused = await post({ age: "18" });
    expect(refused.status).toBe(422);
    expect(((await refused.json()) as { errors: Record<string, string> }).errors.age).toBeTruthy();
    expect(await lib.getColorear().d.db.orders.find()).toHaveLength(0);
    const ok = await post({ age: "4" });
    expect(ok.status).toBe(200);
    const [order] = await lib.getColorear().d.db.orders.find({ payment_provider: "test_code" });
    expect(order).toMatchObject({ country: "GT", currency: "USD", amount_minor: 0, child_age: 4, locale: "es-419" });
    // Mexico is not open: a stale or forged form is priced as the first open country (USD), never in pesos
    expect((await post({ country: "MX" })).status).toBe(200);
    const all = await lib.getColorear().d.db.orders.find({ payment_provider: "test_code" });
    expect(all.map((o) => o.country)).toEqual(["GT", "US"]);
    expect(all.every((o) => o.currency === "USD")).toBe(true);
    // on: the adult level is accepted
    env.COLOREAR_ADULT_LEVEL = "1";
    try {
      expect((await post({ age: "18" })).status).toBe(200);
    } finally {
      delete env.COLOREAR_ADULT_LEVEL;
    }
  });
});
