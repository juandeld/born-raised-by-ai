import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { AGE_LEVELS, COLOREAR, ageBandOf, colorearAdultLevelEnabled, brandConfig, isValidAge, type AgeBand } from "@lumen/config";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider } from "@lumen/payments";
import {
  ColorearEngine, MockImageProvider, TemplateStoryProvider, adaptTone, audienceOf, NO_EXTRA_PEOPLE, buildCharacterPrompt, buildCoverPrompt, buildScenePrompt,
  type ImageProvider, type ImageRequest,
} from "@lumen/generate";

/** Five detail levels (25-oct, Juan): 3-4, 5-6, 7-8, 9-12 and adults (mandala). Each level must reach the image prompt, the story and the form value. */
const BANDS: AgeBand[] = ["3-4", "5-6", "7-8", "9-12", "adult"];

describe("levels", () => {
  it("maps every valid age to one of the five levels and the form values round-trip", () => {
    expect(AGE_LEVELS.map((l) => l.band)).toEqual(BANDS);
    for (const l of AGE_LEVELS) { expect(isValidAge(l.age)).toBe(true); expect(ageBandOf(l.age)).toBe(l.band); }
    expect([3, 4, 5, 6, 7, 8, 9, 12, 13, 18].map(ageBandOf)).toEqual(["3-4", "3-4", "5-6", "5-6", "7-8", "7-8", "9-12", "9-12", "adult", "adult"]);
    expect([2, 19, 5.5, NaN].map(isValidAge)).toEqual([false, false, false, false]);
    expect(COLOREAR.ageMax).toBe(18);
  });

  it("every level has its own scene, cover and character prompt, with the right detail rules", () => {
    const prompts = BANDS.map((b) => buildScenePrompt("a girl in a garden", b, 1));
    expect(new Set(prompts).size).toBe(5);
    expect(new Set(BANDS.map((b) => buildCoverPrompt("x", b, 1))).size).toBe(5);
    expect(new Set(BANDS.map((b) => buildCharacterPrompt("girl", b, 1))).size).toBe(5);
    expect(prompts[0]).toMatch(/Very thick, bold outlines/);
    expect(prompts[2]).toMatch(/colored pencils/);
    expect(prompts[3]).toMatch(/Medium-fine/);
    expect(prompts[4]).toMatch(/mandala/);
    expect(prompts[4]).toMatch(/zentangle/);
    expect(prompts[4]).toMatch(/fine, clean, even black lines/);
    expect(prompts[4]).not.toMatch(/Children's|crayons|cheerful cartoon/);
    expect(prompts[0]).toMatch(/Children's coloring book/);
    for (const p of prompts) {
      // line-art rules in every level: no gray, no filled black, no text, no brands
      expect(p).toMatch(/no gray/); expect(p).toMatch(/no filled black areas/); expect(p).toMatch(/absolutely no text/); expect(p).toMatch(/not photorealistic/);
    }
  });

  it("the story text follows the level: short for 3-4, calm without exclamations for adults, and the writer prompt names the audience", async () => {
    const a = new TemplateStoryProvider();
    const mk = async (band: AgeBand) => a.write({ roles: ["niña"], lang: "es", band, theme: "Espacio", themeId: "space" });
    const [s34, s56, , s912, adult] = await Promise.all(BANDS.map(mk));
    expect(s56!.scenes.map((s) => s.text)).toEqual(s912!.scenes.map((s) => s.text));
    expect(adult!.scenes.some((s) => /[¡!]/.test(s.text))).toBe(false);
    expect(s56!.scenes.some((s) => /[¡!]/.test(s.text))).toBe(true);
    const sentences = (t: string) => t.split(/(?<=[.!?])\s+/).length;
    expect(Math.max(...s34!.scenes.map((s) => sentences(s.text)))).toBe(1);
    expect(s56!.scenes.some((s) => sentences(s.text) > 1)).toBe(true);
    for (const s of [...s34!.scenes, ...adult!.scenes]) expect(s.text.length).toBeGreaterThanOrEqual(8);
    expect(adaptTone("¡Hola mundo! ¡Qué bien!", "adult")).toBe("Hola mundo. Qué bien.");
    expect(audienceOf("adult").who).toMatch(/adults/);
    expect(audienceOf("adult").style).toMatch(/never childish/);
    expect(audienceOf("3-4").style).toMatch(/ONE very short/);
    expect(new Set(BANDS.map((b) => audienceOf(b).who)).size).toBe(5);
  });
});

class Recorder implements ImageProvider {
  readonly name = "openai" as const;
  readonly model = "recorder";
  seen: ImageRequest[] = [];
  private inner = new MockImageProvider();
  async render(req: ImageRequest) { this.seen.push(req); return this.inner.render(req); }
}

describe("end to end with the mock engine: each level sends its own prompt", () => {
  it.each(AGE_LEVELS)("level $band (form value $age)", async ({ band, age }) => {
    const db = createMemoryDb();
    const sink = new MemorySink();
    const rec = new Recorder();
    const env = { COLOREAR_COUNTRIES: "MX", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala", PHONE_HASH_SALT: "s", COLOREAR_TEST_CODES: "PROMO2026", COLOREAR_MOCK_REAL_DAILY_CAP: "0", COLOREAR_ADULT_LEVEL: "1" };
    const now = new Date("2026-11-20T15:00:00Z");
    const engine = new ColorearEngine({
      db, storage: new MemoryStorage(), uploads: new MemoryStorage(), delivery: new MockDeliveryProvider(), image: rec, mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
      tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => now), payments: new MockPaymentProvider("http://localhost:3000"), env, now: () => now,
      brand: { ...brandConfig(env), brand: "Pintoria" },
    });
    const photo = await sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 200, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));
    const { order } = await engine.createCheckout(
      { lang: "es", country: "MX", email: "a@example.com", persons: [{ name: "Manuela", role: "niña" }], photos: [photo], theme: "el espacio", age, checkboxIds: ["K1", "K2"], ip: "203.0.113.7", testCode: "PROMO2026" },
      { successUrl: (o) => `https://www.pintoria.app/c/${o.access_token}`, cancelUrl: "http://x/" },
    );
    const paid = await engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: order.checkout_id! });
    expect((await engine.runGeneration(paid!.id)).status).toBe("done");
    expect(rec.seen.length).toBeGreaterThan(20);
    expect(new Set(rec.seen.map((r) => r.ageBand))).toEqual(new Set([band]));
    const rule = buildScenePrompt("x", band, 1).match(/(?:Very thick|Thick bold|Medium-thick|Medium-fine|Relaxing)[^]*?(?= Pets and animals)/)![0];
    for (const r of rec.seen.filter((r) => r.kind !== "character")) expect(r.prompt, `${band} ${r.kind}`).toContain(rule);
    expect(sink.events.find((e) => e.name === "generation_started")!.props).toMatchObject({ age_band: band });
  }, 60_000);

  it("the adult level is closed unless COLOREAR_ADULT_LEVEL is on, and the other levels stay open", async () => {
    const mk = (extra: Record<string, string>) => {
      const db = createMemoryDb();
      const env = { COLOREAR_COUNTRIES: "MX", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala", PHONE_HASH_SALT: "s", ...extra };
      return new ColorearEngine({ db, storage: new MemoryStorage(), uploads: new MemoryStorage(), delivery: new MockDeliveryProvider(), image: new MockImageProvider(), mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
        tracker: new Tracker(new MultiSink([new TableSink(db.events as never)]), () => new Date()), payments: new MockPaymentProvider("http://localhost:3000"), env, now: () => new Date(), brand: { ...brandConfig(env), brand: "Pintoria" } });
    };
    const errs = (e: ColorearEngine, age: number) => e.validate({ lang: "es", country: "MX", email: "a@example.com", persons: [{ name: "A", role: "niña" }], photos: [], theme: "", age, checkboxIds: [], ip: null } as never).errors.age;
    const off = mk({});
    expect(errs(off, 18)).toBeTruthy();
    expect(errs(off, 13)).toBeTruthy();
    for (const a of [4, 6, 8, 11]) expect(errs(off, a), `age ${a}`).toBeUndefined();
    expect(errs(mk({ COLOREAR_ADULT_LEVEL: "1" }), 18)).toBeUndefined();
    expect(colorearAdultLevelEnabled({})).toBe(false);
    expect(colorearAdultLevelEnabled({ COLOREAR_ADULT_LEVEL: "true" })).toBe(true);
  });

  it("scene and cover prompts of every level forbid people who are not in the references (extra children on a cover, seen in production)", () => {
    for (const b of BANDS) for (const n of [0, 1, 3]) {
      for (const p of [buildScenePrompt("x", b, n), buildCoverPrompt("x", b, n)]) {
        expect(p, `${b} ${n}`).toContain(NO_EXTRA_PEOPLE);
        expect(p).toMatch(/Do not add any other person, child or human figure/);
        expect(p).toMatch(/no extra children, crowds, passers-by or bystanders/);
        expect(p).toMatch(/Generic animals and pets are allowed/);
      }
    }
  });

  it("the form value of an unknown level is rejected", async () => {
    const db = createMemoryDb();
    const env = { COLOREAR_COUNTRIES: "MX", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala", PHONE_HASH_SALT: "s" };
    const engine = new ColorearEngine({ db, storage: new MemoryStorage(), uploads: new MemoryStorage(), delivery: new MockDeliveryProvider(), image: new MockImageProvider(), mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
      tracker: new Tracker(new MultiSink([new TableSink(db.events as never)]), () => new Date()), payments: new MockPaymentProvider("http://localhost:3000"), env, now: () => new Date(), brand: { ...brandConfig(env), brand: "Pintoria" } });
    const v = engine.validate({ lang: "es", country: "MX", email: "a@example.com", persons: [{ name: "A", role: "niña" }], photos: [], theme: "", age: 40, checkboxIds: [], ip: null } as never);
    expect(v.errors.age).toBeTruthy();
  });
});
