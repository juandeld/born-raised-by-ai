import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { AGE_LEVELS, brandConfig } from "@lumen/config";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider } from "@lumen/payments";
import {
  ColorearEngine, ImageProviderError, reasonCounts, MockImageProvider, TemplateStoryProvider, inspectLineArt, maxInkFor, normalizeLineArt,
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

  it("accepts very dense zentangle art for adults: 1 px lines, ink above 50 %, small black blobs between patterns", async () => {
    const dense = async (sw: number, step: number, blobs: boolean) => {
      let g = "";
      for (let y = 0; y < 1536; y += step) g += `<path d="M0 ${y} Q 128 ${y + step} 256 ${y} T 512 ${y} T 768 ${y} T 1024 ${y}"/>`;
      for (let x = 0; x < 1024; x += step) g += `<line x1="${x}" y1="0" x2="${x}" y2="1536"/>`;
      if (blobs) for (let y = 40; y < 1536; y += 90) for (let x = 40; x < 1024; x += 90) g += `<circle cx="${x}" cy="${y}" r="7" fill="black"/>`;
      return new Uint8Array(await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536"><rect width="1024" height="1536" fill="white"/><g fill="none" stroke="black" stroke-width="${sw}">${g}</g></svg>`)).png().toBuffer());
    };
    for (const [sw, step, blobs] of [[1, 5, false], [1, 4, true], [2, 7, true], [3, 9, true]] as const) {
      const img = await dense(sw, step, blobs);
      const r = await inspectLineArt(await normalizeLineArt(img), { maxInk: maxInkFor("adult") });
      expect(r.reasons, `stroke ${sw}, step ${step}, ink ${r.ink.toFixed(2)}, gray ${r.gray.toFixed(3)}`).toEqual([]);
    }
    const heavy = await inspectLineArt(await normalizeLineArt(await dense(3, 6, true)), { maxInk: maxInkFor("adult") });
    expect(heavy.ink).toBeGreaterThan(0.45); // the case above 0.42 that the previous limit would have rejected
  });

  it("allows more ink for the finer levels and keeps the limit of the young ones", async () => {
    expect(maxInkFor("3-4")).toBe(0.3); expect(maxInkFor("7-8")).toBe(0.3);
    expect(maxInkFor("9-12")).toBeGreaterThan(0.3); expect(maxInkFor("adult")).toBeGreaterThanOrEqual(0.55);
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

async function run(band: (typeof AGE_LEVELS)[number], provider: ImageProvider, withStatus = false) {
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
  const status = withStatus ? await engine.getStatus(paid!.access_token) : null;
  return { res, done, status };
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

describe("failure log and last-resort step-down", () => {
  it("counts the reasons without personal data", () => {
    const out = reasonCounts(["page1#1:qa:too_much_ink", "page1#2:qa:too_much_ink+has_gray_or_shading", "page2#1:rate_limit", "page3#1:moderation", "char1#1:server"]);
    expect(out).toBe("moderation=1, rate_limit=1, qa:too_much_ink=2, qa:has_gray=1, server=1");
    expect(reasonCounts([])).toBe("moderation=0, rate_limit=0");
  });

  /** Refuses the pages of the adult prompt (flat gray, as a heavy shading would) and draws the lighter levels well. */
  class DenseOnlyRejected implements ImageProvider {
    readonly name = "openai" as const;
    readonly model = "dense-rejected";
    bands: string[] = [];
    constructor(private rejectAll = false) {}
    async render(req: ImageRequest): Promise<GeneratedImage> {
      if (req.kind === "character") return { format: "png", bytes: await lines(6, 10), costUsdCents: 0, costSource: "free" };
      this.bands.push(req.prompt.includes("Relaxing mandala") ? "adult" : req.prompt.includes("Medium-fine") ? "9-12" : "other");
      const bad = this.rejectAll || req.prompt.includes("Relaxing mandala");
      const bytes = bad
        ? new Uint8Array(await sharp({ create: { width: 1024, height: 1536, channels: 3, background: "#999" } }).png().toBuffer())
        : await lines(6, 10, `<rect width="1024" height="130" fill="white"/>`);
      return { format: "png", bytes, costUsdCents: 0, costSource: "free" };
    }
  }

  it("adult pages that keep failing are redrawn with the 9-12 prompt instead of cancelling the book, and it is noted", async () => {
    const p = new DenseOnlyRejected();
    const { res, status } = await run(AGE_LEVELS[4]!, p, true);
    expect(res.status).toBe("done");
    expect(status!.notes.some((n) => n.startsWith("band_stepdown:adult>9-12"))).toBe(true);
    expect(p.bands).toContain("9-12");
  }, 90_000);

  it("when even the lighter prompt fails the book is cancelled and the log line carries the reason counts", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { res } = await run(AGE_LEVELS[4]!, new DenseOnlyRejected(true));
    expect(res).toMatchObject({ status: "failed", reason: "too_many_fallback_pages" });
    const line = err.mock.calls.map((c) => String(c[0])).find((l) => l.includes("failed too_many_fallback_pages"))!;
    err.mockRestore();
    expect(line).toMatch(/level=adult fallback_pages=\d+ reasons: moderation=0, rate_limit=0, .*qa:has_gray=\d+/);
    expect(line).not.toMatch(/Manuela|@|http/);
  }, 120_000);
});
