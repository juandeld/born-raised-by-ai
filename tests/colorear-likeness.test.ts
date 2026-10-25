import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { brandConfig, colorearCharacterStage, isUsableOpenaiImageModel, parseImageQuality, type AgeBand } from "@lumen/config";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider } from "@lumen/payments";
import {
  AnthropicStoryProvider, ColorearEngine, MockImageProvider, NO_EXTRA_PEOPLE, NO_GLASSES_RULE, TemplateStoryProvider, THEME_PACKS,
  buildCharacterFromTextPrompt, buildCharacterPrompt, buildCoverPrompt, buildScenePrompt,
  type ImageProvider, type ImageRequest,
} from "@lumen/generate";

/**
 * The character must look like the person (25-oct-2026, first real tests with a 4-year-old: wrong face, glasses he does not wear, a logo
 * "H" on the sweatshirt, extra kids on the cover). These tests pin the prompt rules, the no-extra-people rule and the model per step.
 */
const BANDS: AgeBand[] = ["3-4", "5-6", "7-8", "9-12", "adult"];
const withoutRule = (p: string) => p.replace(NO_GLASSES_RULE, "");

describe("character prompt: a likeness, not a generic cartoon", () => {
  it("never names glasses except in the sentence that forbids them", () => {
    for (const band of BANDS) {
      for (const photos of [1, 2, 3]) {
        for (const age of [undefined, 4, 6, 11]) {
          const p = buildCharacterPrompt("a boy, about 4 years old", band, photos, age);
          expect(p, `${band} ${photos} photos age ${age}`).toContain(NO_GLASSES_RULE);
          expect(p.split(NO_GLASSES_RULE)).toHaveLength(2); // once
          expect(withoutRule(p)).not.toMatch(/glass|spectacle|eyewear|lens/i);
        }
      }
      expect(buildCharacterFromTextPrompt("a boy, about 4 years old", band)).not.toMatch(/glass|spectacle|eyewear/i);
      for (const count of [0, 1, 2, 3]) {
        expect(buildScenePrompt("character 1 (a boy) in a garden", band, count)).not.toMatch(/glass|spectacle|eyewear/i);
        expect(buildCoverPrompt("character 1 (a boy) waving", band, count)).not.toMatch(/glass|spectacle|eyewear/i);
      }
    }
  });

  it("no source file of the generate engine lists glasses as something to keep (only the forbidding sentence, comments and the mock art)", () => {
    const dir = resolve(__dirname, "../engines/generate/src");
    const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
    const hits: string[] = [];
    for (const f of files) {
      readFileSync(resolve(dir, f), "utf8").split("\n").forEach((line, i) => {
        if (!/glasses/i.test(line.replaceAll("NO_GLASSES_RULE", ""))) return; // the constant's name is not a mention
        const t = line.trim();
        if (t.startsWith("*") || t.startsWith("//") || t.startsWith("/*")) return; // documentation
        if (t.startsWith("export const NO_GLASSES_RULE")) return; // the forbidding sentence
        hits.push(`${f}:${i + 1}: ${t.slice(0, 80)}`);
      });
    }
    expect(hits).toEqual([]);
  });

  it("asks for the features that make a face recognizable, with the hairstyle first", () => {
    const p = buildCharacterPrompt("a boy, about 4 years old", "3-4", 3, 4);
    expect(p).toMatch(/clearly recognizable as them by their distinctive features/);
    for (const trait of [/hairline/, /fringe or bangs fall/, /length and volume/, /face shape/, /eyes \(shape, size and spacing\)/, /eyebrows/, /nose/, /mouth and the way they smile/, /ears/]) expect(p).toMatch(trait);
    expect(p.indexOf("hairstyle")).toBeLessThan(p.indexOf("face shape"));
    expect(p).toMatch(/Not chibi, not a generic big-head cartoon face, not photorealistic/);
    expect(p).toMatch(/SAME person or pet/);
    expect(p).toMatch(/use them together/);
  });

  it("no longer asks for a caricature or a generic friendly cartoon face", () => {
    for (const band of BANDS) {
      const p = buildCharacterPrompt("a girl, about 6 years old", band, 3, 6);
      expect(p).not.toMatch(/caricature/i);
      expect(p).not.toMatch(/Friendly cheerful cartoon style with rounded shapes/);
      expect(p).not.toMatch(/friendly cartoon character/i);
    }
  });

  it("puts the approximate age in the prompt, with the proportions of a child of that age", () => {
    const four = buildCharacterPrompt("a boy, about 4 years old", "3-4", 3, 4);
    expect(four).toMatch(/The person is about 4 years old/);
    expect(four).toMatch(/natural proportions of a real 4-year-old child \(a soft round face with full cheeks/);
    const six = buildCharacterPrompt("a girl, about 6 years old", "5-6", 3, 6);
    expect(six).toMatch(/about 6 years old: give the face and the body the natural proportions of a real 6-year-old/);
    const eleven = buildCharacterPrompt("a girl, about 11 years old", "9-12", 3, 11);
    expect(eleven).toMatch(/a longer, narrower face/);
    expect(new Set([four, six, eleven].map((p) => p.match(/\(([^)]*)\), not exaggerated/)![1])).size).toBe(3);
    // no age known (adult relatives, pets, old orders with free text): no age sentence, nothing invented
    expect(buildCharacterPrompt("the family dog", "5-6", 1)).not.toMatch(/The person is about/);
    // the adults level has no child protagonist
    expect(buildCharacterPrompt("a person", "adult", 1, 12)).not.toMatch(/The person is about/);
  });

  it("states the accessory rule and the clothing rule", () => {
    for (const photos of [1, 3]) {
      const p = buildCharacterPrompt("a boy, about 4 years old", "3-4", photos, 4);
      expect(p).toMatch(/Accessories: draw only the ones clearly visible in the photos/);
      expect(p).toContain("If the person does not wear glasses in the photos, never draw glasses.");
      expect(p).toMatch(/Never add a hat, jewelry or any other accessory that the photos do not show/);
      expect(p).toMatch(/NO logos, emblems, letters, numbers, words or brand marks, even if the clothes in the photos have them/);
    }
    expect(buildCharacterPrompt("x", "3-4", 3)).toMatch(/clearly visible in the photos \(in most of them\)/);
    expect(buildCharacterFromTextPrompt("a boy", "3-4")).toMatch(/no logos, letters, numbers or brand marks, and no accessories/);
  });

  it("keeps legal condition 2: a cartoon, line art, never a photorealistic or identical copy, and none of the words legal rules out", () => {
    for (const band of BANDS) {
      for (const photos of [1, 2, 3]) {
        const p = buildCharacterPrompt("a boy, about 4 years old", band, photos, 4);
        expect(p).toContain("Draw ONE cartoon character, never several, and never a photorealistic or identical copy.");
        expect(p).toMatch(/not photorealistic/);
        expect(p).toMatch(/Black and white line art only/);
        expect(p.replace("never a photorealistic or identical copy", "")).not.toMatch(/\b(identical|exact(ly)?|faithful(ly)?|portrait|lifelike|true to life|realistic likeness)\b/i);
      }
    }
  });

  it("keeps the line thickness of the chosen level", () => {
    expect(buildCharacterPrompt("x", "3-4", 1)).toMatch(/Very thick, bold outlines/);
    expect(buildCharacterPrompt("x", "5-6", 1)).toMatch(/Thick bold outlines/);
    expect(buildCharacterPrompt("x", "9-12", 1)).toMatch(/Medium-fine clean outlines/);
  });
});

describe("scenes and cover: the same people, nobody else", () => {
  it("every scene and cover prompt forbids extra people, with or without references, at every level", () => {
    for (const band of BANDS) {
      for (const count of [0, 1, 2, 3]) {
        expect(buildScenePrompt("character 1 (a girl) in a garden", band, count)).toContain(NO_EXTRA_PEOPLE);
        expect(buildCoverPrompt("character 1 (a girl) waving", band, count)).toContain(NO_EXTRA_PEOPLE);
      }
    }
    expect(NO_EXTRA_PEOPLE).toMatch(/Never add any other person, child, adult or human figure/);
    expect(NO_EXTRA_PEOPLE).toMatch(/not even small or in the background/);
    expect(NO_EXTRA_PEOPLE).toMatch(/Animals, pets and non-human story characters .* are allowed/);
  });

  it("with references, scenes and cover keep face, hairstyle, clothing and proportions and add no accessory", () => {
    for (const p of [buildScenePrompt("x", "5-6", 2), buildCoverPrompt("x", "5-6", 2)]) {
      expect(p).toMatch(/character 1 to 2, in order/);
      expect(p).toMatch(/Keep each face, hairstyle, clothing and proportions exactly the same as in its reference, without redesigning anyone/);
      expect(p).toMatch(/Do not add any accessory, logo, letter or number that the reference does not show/);
    }
    expect(buildScenePrompt("x", "5-6", 0)).not.toMatch(/Keep each face/);
  });

  it("the story writer is told that helpers and friends are never other people, and the template themes have no human friend", async () => {
    let body = "";
    const fetchFn = (async (_url: string, init: RequestInit) => { body = String(init.body); return new Response("{}", { status: 500 }); }) as unknown as typeof fetch;
    await new AnthropicStoryProvider("k", "m", "https://api.example", fetchFn).write({ roles: ["a girl, about 6 years old"], lang: "en", band: "5-6", theme: "", themeId: "none" }).catch(() => undefined);
    expect(body).toMatch(/The only people in the story are the main characters/);
    expect(body).toMatch(/never another person/);
    for (const [id, pack] of Object.entries(THEME_PACKS)) expect(pack.v.friend, id).not.toMatch(/princess|\bprince\b|\bking\b|queen|knight|\bboy\b|\bgirl\b|child|\bman\b|woman|captain|farmer|\bkid/i);
  });
});

// ------------------------------------------------------------------ the engine: what really reaches the image model

class Spy implements ImageProvider {
  readonly model = "page-model";
  seen: ImageRequest[] = [];
  private inner = new MockImageProvider();
  constructor(readonly name: "openai" | "mock" = "openai") {}
  async render(req: ImageRequest) {
    this.seen.push(req);
    const img = await this.inner.render(req);
    // character 3 cents, any other 1 cent, so the split by step is visible
    return { ...img, costUsdCents: req.kind === "character" ? 3 : 1, costSource: "estimate" as const };
  }
}

async function harness(env: Record<string, string> = {}, image: Spy = new Spy()) {
  const db = createMemoryDb();
  const storage = new MemoryStorage();
  const sink = new MemorySink();
  const e: Record<string, string> = { COLOREAR_COUNTRIES: "MX,US", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala", PHONE_HASH_SALT: "s", COLOREAR_TEST_CODES: "PROMO2026", COLOREAR_MOCK_REAL_DAILY_CAP: "0", ...env };
  const now = new Date("2026-11-20T15:00:00Z");
  const engine = new ColorearEngine({
    db, storage, uploads: new MemoryStorage(), delivery: new MockDeliveryProvider(), image, mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
    tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => now), payments: new MockPaymentProvider("http://localhost:3000"), env: e, now: () => now,
    brand: { ...brandConfig(e), brand: "Pintoria" },
  });
  return { engine, image, sink, storage, env: e };
}
type H = Awaited<ReturnType<typeof harness>>;

async function order(h: H, age = 4) {
  const photo = await sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 200, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));
  const { order: o } = await h.engine.createCheckout(
    {
      lang: "en", country: "MX", email: "a@example.com",
      persons: [{ name: "Leo", roleId: "protagonist_boy" }, { name: "Toby", roleId: "dog" }], photos: [photo, photo], extraPhotos: [[photo, photo], [photo]],
      theme: "space", age, checkboxIds: ["K1", "K2"], ip: "203.0.113.7", testCode: "PROMO2026",
    },
    { successUrl: (x) => `https://www.pintoria.app/c/${x.access_token}`, cancelUrl: "http://x/" },
  );
  const paid = await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: o.id, checkoutId: o.checkout_id, paymentId: o.checkout_id! });
  return paid!.id;
}
const stateOf = async (h: H, id: string) => JSON.parse(new TextDecoder().decode((await h.storage.get(`colorear/${id}/state.json`))!.bytes)) as Record<string, unknown>;
const chars = (h: H) => h.image.seen.filter((r) => r.kind === "character");
const pages = (h: H) => h.image.seen.filter((r) => r.kind !== "character");

describe("the engine sends the age, the rules and the extra-people ban to the image model", () => {
  it("the protagonist gets the approximate age of the chosen level; the pet and the relatives do not", async () => {
    const h = await harness();
    expect((await h.engine.runGeneration(await order(h, 4))).status).toBe("done");
    const [leo, toby] = chars(h);
    expect(leo!.prompt).toMatch(/The person is about 4 years old/);
    expect(leo!.prompt).toContain(NO_GLASSES_RULE);
    expect(leo!.refs).toHaveLength(3);
    expect(toby!.prompt).not.toMatch(/The person is about/);
    expect(toby!.refs).toHaveLength(2);
    expect(withoutRule(leo!.prompt)).not.toMatch(/glass/i);
  }, 60_000);

  it("every cover and scene request of a real book carries the no-extra-people rule, retries included", async () => {
    const h = await harness();
    expect((await h.engine.runGeneration(await order(h))).status).toBe("done");
    expect(pages(h).length).toBeGreaterThanOrEqual(23);
    for (const r of pages(h)) {
      expect(r.prompt, r.kind).toContain(NO_EXTRA_PEOPLE);
      expect(r.prompt).not.toMatch(/glass/i);
    }
  }, 60_000);
});

describe("model and quality per step", () => {
  it("parses the variables: only usable OpenAI image ids and low | medium | high", () => {
    expect(colorearCharacterStage({})).toEqual({ model: undefined, quality: undefined, ignored: false });
    expect(colorearCharacterStage({ COLOREAR_CHARACTER_MODEL: " gpt-image-2.5-sunburst ", COLOREAR_CHARACTER_QUALITY: "HIGH" })).toEqual({ model: "gpt-image-2.5-sunburst", quality: "high", ignored: false });
    expect(colorearCharacterStage({ COLOREAR_CHARACTER_MODEL: "gpt-image-2.5-sunburst-2026-09-08" }).model).toBe("gpt-image-2.5-sunburst-2026-09-08");
    expect(colorearCharacterStage({ COLOREAR_CHARACTER_MODEL: "gpt-image-1" })).toMatchObject({ model: undefined, ignored: true }); // shut down 23-oct-2026
    expect(colorearCharacterStage({ COLOREAR_CHARACTER_MODEL: "sunburst" })).toMatchObject({ model: undefined, ignored: true });
    expect(colorearCharacterStage({ COLOREAR_CHARACTER_MODEL: "gpt-image-2.5 sunburst; drop" }).ignored).toBe(true);
    expect(colorearCharacterStage({ COLOREAR_CHARACTER_MODEL: "", COLOREAR_CHARACTER_QUALITY: "xhigh" })).toEqual({ model: undefined, quality: undefined, ignored: false });
    expect(parseImageQuality("Medium")).toBe("medium");
    expect(parseImageQuality("max")).toBeUndefined();
    expect(isUsableOpenaiImageModel("gpt-image-1-mini")).toBe(true);
    expect(isUsableOpenaiImageModel("gpt-image-2.5-flare")).toBe(true);
    expect(isUsableOpenaiImageModel("dall-e-3")).toBe(false);
  });

  it("without the variables nothing changes: no model override and the same quality for both steps", async () => {
    const h = await harness({ IMAGE_QUALITY: "low" });
    const id = await order(h);
    expect((await h.engine.runGeneration(id)).status).toBe("done");
    for (const r of h.image.seen) {
      expect(r.model).toBeUndefined();
      expect(r.quality).toBe("low");
    }
    const st = await stateOf(h, id);
    expect(st).toMatchObject({ model: "page-model", quality: "low", characterModel: "page-model", characterQuality: "low" });
    expect(h.engine.imageStages()).toEqual({ provider: "openai", pages: { model: "page-model", quality: "low" }, characters: { model: "page-model", quality: "low" } });
  }, 60_000);

  it("the character step uses COLOREAR_CHARACTER_MODEL / _QUALITY and the pages keep OPENAI_IMAGE_MODEL / IMAGE_QUALITY", async () => {
    const h = await harness({ COLOREAR_CHARACTER_MODEL: "gpt-image-2.5-sunburst", COLOREAR_CHARACTER_QUALITY: "high", IMAGE_QUALITY: "low" });
    const id = await order(h);
    expect((await h.engine.runGeneration(id)).status).toBe("done");
    expect(chars(h)).toHaveLength(2);
    for (const r of chars(h)) {
      expect(r.model).toBe("gpt-image-2.5-sunburst");
      expect(r.quality).toBe("high");
    }
    for (const r of pages(h)) {
      expect(r.model).toBeUndefined(); // the pages are drawn with the provider's own model
      expect(r.quality).toBe("low");
    }
    // recorded in the order state ...
    expect(await stateOf(h, id)).toMatchObject({
      model: "page-model", quality: "low", characterModel: "gpt-image-2.5-sunburst", characterQuality: "high", costCharactersCents: 6,
    });
    // ... and in the internal events, with the cost of each step
    expect(h.sink.events.find((e) => e.name === "generation_started")!.props).toMatchObject({ model: "page-model", quality: "low", character_model: "gpt-image-2.5-sunburst", character_quality: "high" });
    const done = h.sink.events.find((e) => e.name === "generation_completed")!.props as unknown as Record<string, number | string>;
    expect(done).toMatchObject({ model: "page-model", quality: "low", character_model: "gpt-image-2.5-sunburst", character_quality: "high", character_cost_usd_cents: 6 });
    expect(done.pages_cost_usd_cents).toBe(pages(h).length);
    expect(done.image_cost_usd_cents).toBe(6 + pages(h).length);
    expect(h.engine.imageStages()).toMatchObject({ pages: { model: "page-model", quality: "low" }, characters: { model: "gpt-image-2.5-sunburst", quality: "high" } });
  }, 60_000);

  it("a quality alone changes only the quality; a model alone changes only the model", async () => {
    const q = await harness({ COLOREAR_CHARACTER_QUALITY: "high" });
    await q.engine.runGeneration(await order(q));
    expect(chars(q).map((r) => [r.model, r.quality])).toEqual([[undefined, "high"], [undefined, "high"]]);
    expect(pages(q).every((r) => r.quality === "medium" && r.model === undefined)).toBe(true);
    const m = await harness({ COLOREAR_CHARACTER_MODEL: "gpt-image-2.5-sunburst" });
    await m.engine.runGeneration(await order(m));
    expect(chars(m).map((r) => [r.model, r.quality])).toEqual([["gpt-image-2.5-sunburst", "medium"], ["gpt-image-2.5-sunburst", "medium"]]);
  }, 60_000);

  it("an unusable model (a typo, or the shut-down gpt-image-1) is ignored with a warning instead of breaking every character", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      for (const bad of ["gpt-image-1", "sunburst"]) {
        const h = await harness({ COLOREAR_CHARACTER_MODEL: bad });
        expect((await h.engine.runGeneration(await order(h))).status).toBe("done");
        expect(h.image.seen.every((r) => r.model === undefined)).toBe(true);
        expect(h.engine.imageStages().characters.model).toBe("page-model");
      }
      expect(warn.mock.calls.filter((c) => String(c[0]).includes("COLOREAR_CHARACTER_MODEL"))).toHaveLength(2);
    } finally {
      warn.mockRestore();
    }
  }, 60_000);

  it("a book drawn by the local mock never gets an OpenAI model id", async () => {
    const h = await harness({ COLOREAR_CHARACTER_MODEL: "gpt-image-2.5-sunburst", COLOREAR_CHARACTER_QUALITY: "high" }, new Spy("mock"));
    const id = await order(h);
    expect((await h.engine.runGeneration(id)).status).toBe("done");
    expect(h.image.seen.every((r) => r.model === undefined)).toBe(true);
    expect(await stateOf(h, id)).toMatchObject({ provider: "mock", characterModel: "page-model", characterQuality: "high" });
  }, 60_000);

  it("a book that has started keeps the models it started with when the environment changes", async () => {
    const h = await harness({ COLOREAR_CHARACTER_MODEL: "gpt-image-2.5-sunburst", COLOREAR_CHARACTER_QUALITY: "high" });
    const id = await order(h);
    // a run with no time left stops right after the state is created
    expect((await h.engine.runGeneration(id, { budgetMs: 1000 })).status).toBe("partial");
    expect(h.image.seen).toHaveLength(0);
    delete h.env.COLOREAR_CHARACTER_MODEL;
    h.env.COLOREAR_CHARACTER_QUALITY = "low";
    expect((await h.engine.runGeneration(id)).status).toBe("done");
    expect(chars(h).every((r) => r.model === "gpt-image-2.5-sunburst" && r.quality === "high")).toBe(true);
  }, 60_000);

  it("a book started before the setting existed (no character fields in its state) draws the characters like the pages", async () => {
    const h = await harness({ IMAGE_QUALITY: "low" });
    const id = await order(h);
    expect((await h.engine.runGeneration(id, { budgetMs: 1000 })).status).toBe("partial");
    const st = await stateOf(h, id);
    delete st.characterModel;
    delete st.characterQuality;
    delete st.costCharactersCents;
    await h.storage.put(`colorear/${id}/state.json`, new TextEncoder().encode(JSON.stringify(st)), "application/json");
    h.env.COLOREAR_CHARACTER_MODEL = "gpt-image-2.5-sunburst"; // set later: must not apply to this book
    expect((await h.engine.runGeneration(id)).status).toBe("done");
    expect(chars(h).every((r) => r.model === undefined && r.quality === "low")).toBe(true);
    const done = h.sink.events.find((e) => e.name === "generation_completed")!.props as unknown as Record<string, number | string>;
    expect(done).toMatchObject({ character_model: "page-model", character_quality: "low" });
  }, 60_000);
});
