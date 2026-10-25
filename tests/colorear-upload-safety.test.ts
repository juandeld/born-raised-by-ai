import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { brandConfig } from "@lumen/config";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider } from "@lumen/payments";
import { pixelBomb } from "./png-bomb";
import { ColorearEngine, ColorearValidationError, MAX_INPUT_PIXELS, MockImageProvider, PREPARE_CONCURRENCY, TemplateStoryProvider, prepareUpload, type ColorearCheckoutInput } from "@lumen/generate";

/**
 * QA round of 25-oct, F4 and F5: the photo upload of the public checkout.
 *  - F4: when one photo fails to upload while others are still in flight, none of them may be left behind without an order.
 *  - F5: a "pixel bomb" (a tiny PNG that declares 16000 x 16000 pixels) is refused from its header, and photos are re-encoded a few at a time.
 */

// Counts how many photos are being re-encoded at once. Only reads: every call is forwarded to the real sharp.
const gauge = vi.hoisted(() => ({ now: 0, max: 0 }));
vi.mock("sharp", async () => {
  const real = (await vi.importActual<typeof import("sharp")>("sharp")).default;
  const wrapped = (...args: Parameters<typeof real>) => {
    const inst = real(...args);
    const toBuffer = inst.toBuffer.bind(inst) as (...a: unknown[]) => Promise<unknown>;
    (inst as unknown as { toBuffer: unknown }).toBuffer = async (...a: unknown[]) => {
      gauge.now++;
      gauge.max = Math.max(gauge.max, gauge.now);
      try {
        return await toBuffer(...a);
      } finally {
        gauge.now--;
      }
    };
    return inst;
  };
  return { default: Object.assign(wrapped, real) };
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const photo = (w = 200, h = 300) => sharp({ create: { width: w, height: h, channels: 3, background: { r: 200, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));

/** Photo 2 of person 1 fails after 5 ms; photo 3 of person 1 takes 80 ms. A plain Promise.all would delete before photo 3 lands. */
class FlakyUploads extends MemoryStorage {
  puts = 0;
  async put(path: string, bytes: Uint8Array, type: string) {
    this.puts++;
    if (path.endsWith("/photo-1-2.jpg")) {
      await sleep(5);
      throw new Error("storage 503");
    }
    if (path.endsWith("/photo-1-3.jpg")) await sleep(80);
    return super.put(path, bytes, type);
  }
}

function harness(uploads = new MemoryStorage()) {
  const db = createMemoryDb();
  const sink = new MemorySink();
  const env = { COLOREAR_COUNTRIES: "MX,ES,GB,US", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala", PHONE_HASH_SALT: "test-salt" };
  const now = new Date("2026-11-20T15:00:00Z");
  const engine = new ColorearEngine({
    db, storage: new MemoryStorage(), uploads, delivery: new MockDeliveryProvider(), image: new MockImageProvider(), mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
    tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => now), payments: new MockPaymentProvider("http://localhost:3000"), env, now: () => now, brand: { ...brandConfig(env), brand: "Pintoria" },
  });
  return { engine, db, uploads };
}
const urls = { successUrl: (o: { access_token: string }) => `https://www.pintoria.app/colorear/confirmacion/${o.access_token}`, cancelUrl: "http://x/" };
async function input(over: Partial<ColorearCheckoutInput> = {}): Promise<ColorearCheckoutInput> {
  return {
    lang: "es", country: "MX", email: "amigo@example.com", persons: [{ name: "Manuela", role: "niña, 6 años" }], photos: [await photo()], theme: "el espacio", age: 6, checkboxIds: ["K1", "K2"], ip: "203.0.113.7", creative: "x", device: "mobile", ...over,
  };
}

describe("F4: a failed upload leaves no photo behind", () => {
  it("photo 2 fails fast while photo 3 is slow: the checkout fails, no order exists and no photo is stored, not even after the slow one finishes", async () => {
    const uploads = new FlakyUploads();
    const h = harness(uploads);
    const err = await h.engine.createCheckout(await input({ extraPhotos: [[await photo(), await photo()]] }), urls).catch((e) => e);
    expect((err as Error).message).toBe("storage 503");
    // the failing put has finished, and so must every other one: all 3 were attempted
    expect(uploads.puts).toBe(3);
    expect([...uploads.files.keys()]).toEqual([]);
    await sleep(150); // anything still in flight would have landed by now
    expect([...uploads.files.keys()]).toEqual([]);
    expect(await h.db.orders.find()).toHaveLength(0);
  });
});

describe("F5: pixel bombs and concurrency", () => {
  it("a 16000 x 16000 PNG is a valid image under 900 KB, but it is refused from its header, fast", async () => {
    const bomb = pixelBomb();
    expect(bomb.byteLength).toBeLessThan(900_000);
    expect(bomb.byteLength).toBeLessThan(100_000);
    expect(16000 * 16000).toBeGreaterThan(MAX_INPUT_PIXELS);
    const t0 = Date.now();
    expect(await prepareUpload(bomb)).toBeNull();
    expect(Date.now() - t0).toBeLessThan(1500);
  });

  it("an ordinary 12 MP photo still goes through and comes out as a small JPEG", async () => {
    const big = await sharp({ create: { width: 4000, height: 3000, channels: 3, background: { r: 90, g: 120, b: 200 } } }).jpeg({ quality: 60 }).toBuffer();
    const out = await prepareUpload(new Uint8Array(big));
    expect(out).not.toBeNull();
    const meta = await sharp(Buffer.from(out!)).metadata();
    expect(Math.max(meta.width!, meta.height!)).toBe(1536);
  });

  it("the checkout answers 'Unreadable photo' for a bomb among normal photos, stores nothing and creates no order", async () => {
    const h = harness();
    const t0 = Date.now();
    const err = await h.engine.createCheckout(await input({ extraPhotos: [[await photo(), pixelBomb()]] }), urls).catch((e) => e);
    expect(err).toBeInstanceOf(ColorearValidationError);
    expect((err as ColorearValidationError).errors).toEqual({ photos: "Unreadable photo" });
    expect(Date.now() - t0).toBeLessThan(3000);
    expect(h.uploads.files.size).toBe(0);
    expect(await h.db.orders.find()).toHaveLength(0);
  });

  it("re-encodes at most PREPARE_CONCURRENCY (3) of the 15 photos of a full order at the same time", async () => {
    expect(PREPARE_CONCURRENCY).toBe(3);
    const h = harness();
    const persons = [
      { name: "Manuela", role: "niña, 6 años" }, { name: "Toby", role: "perro" }, { name: "Ana", role: "mamá" }, { name: "Luis", role: "papá" }, { name: "Rosa", role: "abuela" },
    ];
    const mk = async () => Promise.all([photo(), photo()]);
    const photos = await Promise.all(persons.map(() => photo()));
    const extras = await Promise.all(persons.map(mk));
    gauge.now = 0;
    gauge.max = 0;
    const { order } = await h.engine.createCheckout({ ...(await input()), persons, photos, extraPhotos: extras }, urls);
    expect(h.uploads.files.size).toBe(15);
    expect(order.status).toBe("created");
    expect(gauge.max).toBeGreaterThanOrEqual(2); // it does work in parallel...
    expect(gauge.max).toBeLessThanOrEqual(PREPARE_CONCURRENCY); // ...but never 15 at once
  });
});
