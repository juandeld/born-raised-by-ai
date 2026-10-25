import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { COLOREAR, brandConfig, colorearMaxPhotosTotal, colorearPhotoBudget, colorearPhotoLimits, openaiImageFamily } from "@lumen/config";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider } from "@lumen/payments";
import {
  ColorearEngine, ColorearValidationError, ImageProviderError, MockImageProvider, TemplateStoryProvider, buildCharacterPrompt,
  type ColorearCheckoutInput, type ImageProvider, type ImageRequest,
} from "@lumen/generate";

/**
 * Up to 3 photos per person (Juan's decision of 25-oct): photo 1 is required, the others are optional extra angles of the SAME person.
 * All of them go to the character step as references; all of them are erased with the same rules as before (24 h at most).
 */
const shot = (n = 0) => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 200 - n, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));
const many = (n: number) => Promise.all(Array.from({ length: n }, (_, i) => shot(i)));

class Spy implements ImageProvider {
  readonly name = "mock" as const;
  readonly model = "spy";
  calls: Array<{ kind: string; refs: number; prompt: string }> = [];
  inner = new MockImageProvider();
  blockCharacters = false;
  async render(req: ImageRequest) {
    this.calls.push({ kind: req.kind, refs: req.refs.length, prompt: req.prompt });
    if (this.blockCharacters && req.kind === "character" && req.refs.length) throw new ImageProviderError("blocked", "moderation");
    return this.inner.render(req);
  }
}

function harness(env: Record<string, string> = {}) {
  const db = createMemoryDb();
  const storage = new MemoryStorage();
  const uploads = new MemoryStorage();
  const sink = new MemorySink();
  const image = new Spy();
  const clock = { now: new Date("2026-11-20T15:00:00Z") };
  const e = { COLOREAR_COUNTRIES: "MX,ES,GB,US", ...env };
  const engine = new ColorearEngine({
    db, storage, uploads, delivery: new MockDeliveryProvider(), image, mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
    tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => clock.now),
    payments: new MockPaymentProvider("http://localhost:3000"), env: e, now: () => clock.now, brand: { ...brandConfig(e), brand: "Pintoria" },
  });
  return { engine, db, storage, uploads, sink, image, clock };
}
type H = ReturnType<typeof harness>;

async function input(over: Partial<ColorearCheckoutInput> = {}): Promise<ColorearCheckoutInput> {
  return {
    lang: "es", country: "MX", email: "mama@example.com",
    persons: [{ name: "Manuela", role: "niña, 6 años" }, { name: "Toby", role: "perro" }],
    photos: await many(2), extraPhotos: [await many(2), await many(2)], theme: "el espacio", age: 6, checkboxIds: ["K1", "K2"], ip: "203.0.113.7", creative: "x", device: "mobile", ...over,
  };
}
const urls = { successUrl: (o: { access_token: string }) => `http://x/colorear/confirmacion/${o.access_token}`, cancelUrl: "http://x/" };
const pay = (h: H, id: string) => h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: id, checkoutId: null, paymentId: "pay_1" });
const prop = (e: { props: unknown }, k: string) => (e.props as Record<string, unknown>)[k];
const upKeys = (h: H) => [...h.uploads.files.keys()].sort();
const errorsOf = async (h: H, over: Partial<ColorearCheckoutInput>) => {
  const err = await h.engine.createCheckout(await input(over), urls).catch((e) => e);
  expect(err).toBeInstanceOf(ColorearValidationError);
  return (err as ColorearValidationError).errors;
};

describe("configuration", () => {
  it("defaults to 3 photos for everyone, accepts overrides and clamps them to 1..5", () => {
    expect(colorearPhotoLimits({})).toEqual({ main: 3, other: 3 });
    expect(colorearPhotoLimits({ COLOREAR_MAX_PHOTOS_MAIN: "3", COLOREAR_MAX_PHOTOS_OTHER: "2" })).toEqual({ main: 3, other: 2 });
    expect(colorearPhotoLimits({ COLOREAR_MAX_PHOTOS_MAIN: "99", COLOREAR_MAX_PHOTOS_OTHER: "0" })).toEqual({ main: 5, other: 1 });
    expect(colorearPhotoLimits({ COLOREAR_MAX_PHOTOS_MAIN: "x", COLOREAR_MAX_PHOTOS_OTHER: " " })).toEqual({ main: 3, other: 3 });
    expect(colorearMaxPhotosTotal({ main: 3, other: 3 })).toBe(15);
    expect(colorearMaxPhotosTotal({ main: 3, other: 2 })).toBe(11);
  });

  it("budgets every photo so that the most any order can hold fits the 4.5 MB request body", () => {
    expect(colorearPhotoBudget(3)).toBe(640_000); // the normal case: 3 photos of one person
    expect(colorearPhotoBudget(15)).toBe(266_666);
    expect(colorearPhotoBudget(15) * 15 + 150_000).toBeLessThan(4_500_000);
    expect(colorearPhotoBudget(25)).toBe(160_000);
    expect(colorearPhotoBudget(1000)).toBe(120_000);
    expect(colorearPhotoBudget(0)).toBe(640_000);
  });

  it("prices the image model by family and never defaults to the shut-down gpt-image-1", () => {
    expect(openaiImageFamily("gpt-image-1-mini")).toBe("mini");
    expect(openaiImageFamily("gpt-image-1")).toBe("v1");
    expect(openaiImageFamily("gpt-image-2.5-flare")).toBe("v2");
    expect(openaiImageFamily("gpt-image-2.5-sunburst")).toBe("v2");
  });
});

describe("checkout validation", () => {
  it("accepts 3 photos per person and stores each one under its own name", async () => {
    const h = harness();
    const { order } = await h.engine.createCheckout(await input(), urls);
    const base = `orders/${order.id}`;
    expect(upKeys(h).map((k) => k.replace(/^.*orders\//, "orders/"))).toEqual([
      `${base}/photo-1-2.jpg`, `${base}/photo-1-3.jpg`, `${base}/photo-1.jpg`, `${base}/photo-2-2.jpg`, `${base}/photo-2-3.jpg`, `${base}/photo-2.jpg`,
    ]);
    expect(JSON.parse(order.details!).photoCounts).toEqual([3, 3]);
    const started = h.sink.events.filter((e) => e.name === "checkout_started");
    expect(started).toHaveLength(1);
    expect(prop(started[0]!, "photos_per_person")).toEqual([3, 3]);
  });

  it("still takes one photo per person (the old form, a cached page) and a mix", async () => {
    const h = harness();
    await h.engine.createCheckout(await input({ extraPhotos: undefined }), urls);
    expect(h.uploads.files.size).toBe(2);
    const h2 = harness();
    const { order } = await h2.engine.createCheckout(await input({ extraPhotos: [await many(1), []] }), urls);
    expect(JSON.parse(order.details!).photoCounts).toEqual([2, 1]);
    expect(h2.uploads.files.size).toBe(3);
  });

  it("refuses a 4th photo for one person, and honors a lower limit for the secondary people", async () => {
    const h = harness();
    expect((await errorsOf(h, { extraPhotos: [await many(3), []] })).photos).toMatch(/Too many photos/);
    expect((await errorsOf(h, { extraPhotos: [[], await many(3)] })).photos).toMatch(/Too many photos/);
    const lim = harness({ COLOREAR_MAX_PHOTOS_MAIN: "3", COLOREAR_MAX_PHOTOS_OTHER: "2" });
    expect((await errorsOf(lim, { extraPhotos: [await many(2), await many(2)] })).photos).toMatch(/Too many photos/); // the second person has 3
    await lim.engine.createCheckout(await input({ extraPhotos: [await many(2), await many(1)] }), urls); // 3 + 2 is the maximum
    expect(lim.uploads.files.size).toBe(5);
    expect((await h.db.orders.find()).length).toBe(0);
    expect(h.uploads.files.size).toBe(0); // nothing is stored for a refused order
  });

  it("refuses extras that are not images or are too large, and extras without a person", async () => {
    const h = harness();
    expect((await errorsOf(h, { extraPhotos: [[new Uint8Array([1, 2, 3, 4])], []] })).photos).toMatch(/Invalid or too large/);
    expect((await errorsOf(h, { extraPhotos: [[new Uint8Array(COLOREAR.maxPhotoBytes + 1).fill(255)], []] })).photos).toMatch(/Invalid or too large/);
    expect((await errorsOf(h, { extraPhotos: [[], [], await many(1)] })).photos).toMatch(/Too many photos/);
    expect(h.uploads.files.size).toBe(0);
  });

  it("leaves no photo behind when the order cannot be stored", async () => {
    const h = harness();
    (h.db.orders as { insert: unknown }).insert = async () => { throw new Error("database down"); };
    await expect(h.engine.createCheckout(await input(), urls)).rejects.toThrow("database down");
    expect(h.uploads.files.size).toBe(0);
  });
});

describe("generation with several photos", () => {
  it("sends all the photos of a person as references to that person's character, then erases every one of them", async () => {
    const h = harness();
    const { order } = await h.engine.createCheckout(await input(), urls);
    await pay(h, order.id);
    expect(h.uploads.files.size).toBe(6);
    const run = await h.engine.runGeneration(order.id);
    expect(run.status).toBe("done");
    const chars = h.image.calls.filter((c) => c.kind === "character");
    expect(chars.map((c) => c.refs)).toEqual([3, 3]);
    for (const c of chars) {
      expect(c.prompt).toMatch(/3 reference photos all show the SAME person or pet/);
      expect(c.prompt).not.toMatch(/Manuela|Toby/); // names still never reach the image model
    }
    // scenes and the cover use the cartoon characters (one per person), never the photos
    const scenes = h.image.calls.filter((c) => c.kind !== "character");
    expect(Math.max(...scenes.map((c) => c.refs))).toBeLessThanOrEqual(2);
    expect(h.uploads.files.size).toBe(0);
    const gone = h.sink.events.filter((e) => e.name === "photos_deleted");
    expect(gone.map((e) => prop(e, "count"))).toContain(6);
  });

  it("keeps the single-photo prompt unchanged for one photo", () => {
    expect(buildCharacterPrompt("girl, 6", "5-6")).toBe(buildCharacterPrompt("girl, 6", "5-6", 1));
    expect(buildCharacterPrompt("girl, 6", "5-6")).not.toMatch(/SAME person/);
    expect(buildCharacterPrompt("girl, 6", "5-6", 2)).toMatch(/2 reference photos/);
  });

  it("the largest order (5 people, 3 photos each = 15) is stored, drawn and erased", async () => {
    const h = harness();
    const persons = [
      { name: "Manuela", role: "niña, 6 años" }, { name: "Toby", role: "perro" }, { name: "Ana", role: "mamá" }, { name: "Luis", role: "papá" }, { name: "Rosa", role: "abuela" },
    ];
    const { order } = await h.engine.createCheckout(await input({ persons, photos: await many(5), extraPhotos: await Promise.all(persons.map(() => many(2))) }), urls);
    expect(h.uploads.files.size).toBe(15);
    await pay(h, order.id);
    expect((await h.engine.runGeneration(order.id)).status).toBe("done");
    expect(h.image.calls.filter((c) => c.kind === "character").map((c) => c.refs)).toEqual([3, 3, 3, 3, 3]);
    expect(h.uploads.files.size).toBe(0);
  });

  it("when the provider refuses the photos, draws the person from the description and still erases all of them", async () => {
    const h = harness();
    h.image.blockCharacters = true;
    const { order } = await h.engine.createCheckout(await input(), urls);
    await pay(h, order.id);
    expect((await h.engine.runGeneration(order.id)).status).toBe("done");
    // each refused person is drawn once from the text; the same photos are never sent again
    expect(h.image.calls.filter((c) => c.kind === "character" && c.refs > 0)).toHaveLength(2);
    expect(h.image.calls.filter((c) => c.kind === "character" && c.refs === 0)).toHaveLength(2);
    expect(h.uploads.files.size).toBe(0);
  });
});

describe("retention is unchanged: every photo is erased", () => {
  const HOUR = 3_600_000;
  it("unpaid orders lose all their photos after 2 h", async () => {
    const h = harness();
    const { order } = await h.engine.createCheckout(await input(), urls);
    h.clock.now = new Date(h.clock.now.getTime() + 3 * HOUR);
    const out = await h.engine.sweep();
    expect(out.photosErased).toBe(1);
    expect(h.uploads.files.size).toBe(0);
    expect((await h.db.orders.get(order.id))!.status).toBe("cancelled");
    expect(prop(h.sink.events.filter((e) => e.name === "photos_deleted").at(-1)!, "count")).toBe(6);
  });

  it("paid orders whose run never started lose all their photos after 24 h", async () => {
    const h = harness({ COLOREAR_MOCK_REAL_DAILY_CAP: "0" });
    const { order } = await h.engine.createCheckout(await input(), urls);
    await pay(h, order.id);
    expect(h.uploads.files.size).toBe(6);
    h.clock.now = new Date(h.clock.now.getTime() + (COLOREAR.photoMaxHours + 1) * HOUR);
    // the sweep may resume the run first; either way nothing of the photos survives the day
    await h.engine.sweep();
    await h.engine.sweep();
    expect(h.uploads.files.size).toBe(0);
  });

  it("a refund erases the extras too", async () => {
    const h = harness();
    const { order } = await h.engine.createCheckout(await input(), urls);
    const paid = (await pay(h, order.id))!;
    expect(h.uploads.files.size).toBe(6);
    expect((await h.engine.markRefunded(paid, "test", true)).refunded).toBe(true);
    expect(h.uploads.files.size).toBe(0);
  });

  it("an order stored before this change (no photo counts, one photo per person) is still erased", async () => {
    const h = harness();
    const { order } = await h.engine.createCheckout(await input({ extraPhotos: undefined }), urls);
    const det = JSON.parse(order.details!);
    delete det.photoCounts;
    await h.db.orders.update(order.id, { details: JSON.stringify(det) });
    expect(h.uploads.files.size).toBe(2);
    h.clock.now = new Date(h.clock.now.getTime() + 3 * HOUR);
    await h.engine.sweep();
    expect(h.uploads.files.size).toBe(0);
  });
});
