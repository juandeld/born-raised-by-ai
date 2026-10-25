import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { AGE_LEVELS, brandConfig } from "@lumen/config";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider } from "@lumen/payments";
import {
  ColorearEngine, ImageProviderError, MockImageProvider, TemplateStoryProvider, inspectLineArt, maxInkFor, normalizeLineArt,
  type GeneratedImage, type ImageProvider, type ImageRequest,
} from "@lumen/generate";

/**
 * Incident of 25-oct: real orders of levels 7-8, 9-12 and adults all failed with too_many_fallback_pages. Cause: the line-art review counted the
 * anti-aliased edges of fine lines as "gray / shading" (at 256 x 384 a 2-3 px line becomes gray), so the detailed drawings of the new levels were
 * rejected 3 times per page and replaced by the local fallback. The review now ignores gray next to ink and keeps catching real fills.
 */
async function lines(sw: number, density: number, extra = ""): Promise<Uint8Array> {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536"><rect width="1024" height="1536" fill="white"/><g fill="none" stroke="black" stroke-width="${sw}">`;
  for (let i = 0; i < density; i++) s += `<circle cx="512" cy="760" r="${20 + i * (700 / density)}"/>`;
  for (let a = 0; a < 360; a += 360 / density) s += `<line x1="512" y1="760" x2="${512 + 720 * Math.cos((a * Math.PI) / 180)}" y2="${760 + 720 * Math.sin((a * Math.PI) / 180)}"/>`;
  return new Uint8Array(await sharp(Buffer.from(`${s}</g>${extra}</svg>`)).png().toBuffer());
}
const check = async (bytes: Uint8Array, band = "adult") => inspectLineArt(await normalizeLineArt(bytes), { maxInk: maxInkFor(band) });

describe("line-art review", () => {
  it("accepts fine, dense line art (mandala style) at every thickness the finer levels produce", async () => {
    for (const [sw, d] of [[10, 10], [6, 20], [4, 30], [3, 40], [2.5, 60], [2, 80]] as const) {
      const r = await check(await lines(sw, d));
      expect(r.reasons, `stroke ${sw}, density ${d}`).toEqual([]);
    }
  });

  it("still rejects real shading, gray fills, gradients and color", async () => {
    const gray = await check(await lines(6, 10, `<rect x="100" y="200" width="500" height="500" fill="#888"/>`));
    expect(gray.reasons).toContain("has_gray_or_shading");
    const grad = await check(await lines(6, 10, `<defs><linearGradient id="g"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect x="100" y="900" width="800" height="500" fill="url(#g)"/>`));
    expect(grad.reasons).toContain("has_gray_or_shading");
    const color = await inspectLineArt(await lines(6, 10, `<rect x="100" y="200" width="500" height="500" fill="#e33"/>`), {}); // as the provider sends it, before it is flattened to gray
    expect(color.reasons).toContain("has_color");
  });

  it("allows more ink for the finer levels and keeps the limit of the young ones", async () => {
    expect(maxInkFor("3-4")).toBe(0.3); expect(maxInkFor("7-8")).toBe(0.3);
    expect(maxInkFor("9-12")).toBeGreaterThan(0.3); expect(maxInkFor("adult")).toBeGreaterThan(maxInkFor("9-12"));
    const black = new Uint8Array(await sharp({ create: { width: 1024, height: 1536, channels: 3, background: "#000" } }).png().toBuffer());
    expect((await check(black, "adult")).reasons).toContain("too_much_ink");
  });
});

/** Real-looking provider: PNG mandala art for every call; the first calls of each distinct prompt are refused with a rate limit. */
class Limited implements ImageProvider {
  readonly name = "openai" as const;
  readonly model = "limited";
  private seen = new Map<string, number>();
  png: Uint8Array | null = null;
  constructor(private limitedCalls: number) {}
  async render(req: ImageRequest): Promise<GeneratedImage> {
    const k = `${req.kind}|${req.prompt}`;
    const n = (this.seen.get(k) ?? 0) + 1;
    this.seen.set(k, n);
    if (n <= this.limitedCalls) throw new ImageProviderError("429", "rate_limit", 1);
    this.png ??= await lines(2.5, 60, `<rect width="1024" height="130" fill="white"/>`); // top left empty, as a cover needs
    return { format: "png", bytes: this.png, costUsdCents: 0, costSource: "free" };
  }
}

async function run(band: (typeof AGE_LEVELS)[number], provider: ImageProvider) {
  const db = createMemoryDb();
  const sink = new MemorySink();
  const env = { COLOREAR_COUNTRIES: "MX", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala", PHONE_HASH_SALT: "s", COLOREAR_TEST_CODES: "PROMO2026", COLOREAR_MOCK_REAL_DAILY_CAP: "0", COLOREAR_ADULT_LEVEL: "1" };
  const now = new Date("2026-11-20T15:00:00Z");
  const engine = new ColorearEngine({
    db, storage: new MemoryStorage(), uploads: new MemoryStorage(), delivery: new MockDeliveryProvider(), image: provider, mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
    tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => now), payments: new MockPaymentProvider("http://localhost:3000"), env, now: () => now,
    brand: { ...brandConfig(env), brand: "Pintoria" },
  });
  const photo = await sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 200, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));
  const { order } = await engine.createCheckout(
    { lang: "es", country: "MX", email: "a@example.com", persons: [{ name: "Manuela", role: "niña" }], photos: [photo], theme: "Flores y jardín", age: band.age, checkboxIds: ["K1", "K2"], ip: "203.0.113.7", testCode: "PROMO2026" },
    { successUrl: (o) => `https://www.pintoria.app/c/${o.access_token}`, cancelUrl: "http://x/" },
  );
  const paid = await engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: order.checkout_id! });
  const res = await engine.runGeneration(paid!.id);
  const done = sink.events.find((e) => e.name === "generation_completed");
  if (process.env.DBG) console.log(JSON.stringify(sink.events.filter((e) => e.name === "generation_page_retried").slice(0, 4).map((e) => e.props)));
  return { res, done };
}

describe("a real-provider book of every level completes", () => {
  it.each(AGE_LEVELS.slice(2))("level $band with dense line art: no page falls back", async (lv) => {
    const { res, done } = await run(lv, new Limited(0));
    expect(res.status).toBe("done");
    expect(done?.props).toMatchObject({ retries: 0 }); // not one page needed a second try, so none fell back
  }, 60_000);

  it("three refusals by rate limit per image do not use up the attempts of a page", async () => {
    const { res, done } = await run(AGE_LEVELS[4]!, new Limited(3));
    expect(res.status).toBe("done");
    expect((done?.props as { retries: number }).retries).toBeGreaterThan(0); // the refusals happened and were waited out
  }, 60_000);
});
