import sharp from "sharp";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { COLOREAR, COLOREAR_THEMES, brandConfig, themeLabel, type AgeBand, type ColorearLang } from "@lumen/config";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider } from "@lumen/payments";
import {
  BRAND_BLOCKLIST, ColorearEngine, FallbackStoryProvider, MockImageProvider, STORY_MAX_ATTEMPTS, TemplateStoryProvider, THEME_PACKS, mentionsBrand, repairStory, statePath,
  validateStory, type GenState, type ImageProvider, type ImageRequest, type StoryProvider, type StoryRequest,
} from "@lumen/generate";

/**
 * Production incident (25-oct-2026): the order of a buyer stayed in "Escribiendo la historia" for good. Production has no key for the text
 * model, so the story is the template, and `mentionsBrand` matched substrings: "voladora" and "excavadora" contain "dora" (a cartoon). The template is
 * deterministic, so every retry failed the same way. These tests cover the filter, every template story, and the engine never looping.
 */

const BANDS: AgeBand[] = ["3-4", "5-6", "7-8", "9-12", "adult"];
const LANGS: ColorearLang[] = ["es", "en"];
const THEME_IDS = [...COLOREAR_THEMES.map((t) => t.id), "none", "custom"];

afterEach(() => vi.restoreAllMocks());

describe("mentionsBrand compares whole words, not pieces of words", () => {
  it("does not fire on ordinary words that contain a name", () => {
    for (const ok of [
      "armario", "el armario de la abuela", "exploradora", "una exploradora valiente", "doradas", "estrellas doradas", "una moto voladora", "una excavadora gigante",
      "llegó", "Llegó tarde", "colegio", "marioneta", "una marioneta", "mariposas", "Marion", "Teodora", "Pandora", "marvelous", "allegory", "Thomas then said hello",
      "pescadora", "trabajadora", "nikel", "the sponsor",
    ]) expect(mentionsBrand(ok), ok).toBe(false);
  });

  it("still fires on the names themselves, in any case, with accents, punctuation or a plural", () => {
    for (const bad of [
      "Mario", "MARIO", "mario", "Dora", "dora", "Dóra", "dora la exploradora", "Dora y sus amigos", "¡Lego!", "lego", "Mario's", "Super Mario", "supermario", "los legos",
      "Spider-Man", "Spider Man", "spiderman", "Pokémon", "pokemon", "los pokemones", "Hello  Kitty", "hello-kitty", "Coca-Cola", "Winnie the Pooh", "Thomas the Tank Engine",
      "los Simpsons", "Frozen", "frozen y elsa", "DC Comics", "Disneyland", "Legoland", "Iron Man", "Paw Patrol", "La Patrulla Canina", "Peppa Pig", "SpongeBob", "Baby Shark",
    ]) expect(mentionsBrand(bad), bad).toBe(true);
  });

  it("every entry of the list is caught alone and inside a sentence, and never when glued to other letters", () => {
    for (const b of BRAND_BLOCKLIST) {
      expect(mentionsBrand(b), b).toBe(true);
      expect(mentionsBrand(`Una tarde, ${b}. Y nada más.`), `${b} in a sentence`).toBe(true);
      expect(mentionsBrand(`zq${b}zq`), `${b} glued`).toBe(false);
    }
    expect(mentionsBrand("")).toBe(false);
    expect(mentionsBrand("  ¡¿...?!  ")).toBe(false);
  });
});

describe("the template story passes the filter in every adventure, level and language", () => {
  it("24 adventures (plus no theme and a free-text theme) x 5 levels x es/en x 1 and 3 people: no scene needs a repair", async () => {
    expect(COLOREAR_THEMES.length).toBe(24);
    expect(Object.keys(THEME_PACKS).sort()).toEqual(COLOREAR_THEMES.map((t) => t.id).sort());
    const template = new TemplateStoryProvider();
    const production = new FallbackStoryProvider(null);
    const failures: string[] = [];
    let checked = 0;
    for (const themeId of THEME_IDS) for (const band of BANDS) for (const lang of LANGS) for (const n of [1, 3]) {
      const req: StoryRequest = { roles: Array.from({ length: n }, () => "a child"), lang, band, theme: themeId === "custom" ? "Antigua Guatemala" : "", themeId };
      const story = await template.write(req);
      story.scenes.forEach((s) => {
        checked++;
        if (mentionsBrand(`${s.text} ${s.visual}`)) failures.push(`${themeId}/${band}/${lang}/${n}: scene ${s.n}`);
      });
      try { validateStory(story, n); } catch (e) { failures.push(`${themeId}/${band}/${lang}/${n}: ${(e as Error).message}`); }
      // the production path (no key): the same story, with nothing replaced
      const prod = await production.write(req);
      if (prod.repaired) failures.push(`${themeId}/${band}/${lang}/${n}: repaired ${JSON.stringify(prod.repaired)}`);
      expect(prod.scenes.map((s) => s.text)).toEqual(story.scenes.map((s) => s.text));
    }
    expect(failures).toEqual([]);
    expect(checked).toBe(THEME_IDS.length * BANDS.length * LANGS.length * 2 * COLOREAR.scenes);
  });

  it("scene 7 of the two adventures that failed in production now passes", async () => {
    for (const themeId of ["heroes", "trucks"]) for (const band of BANDS) {
      const s = await new FallbackStoryProvider(null).write({ roles: ["boy", "dog"], lang: "es", band, theme: "", themeId });
      expect(s.scenes[6]!.text, `${themeId} ${band}`).toMatch(/voladora|excavadora/);
      expect(s.repaired).toBeUndefined();
    }
  });
});

describe("a scene that fails the filter is replaced by a safe scene of the same theme", () => {
  const brandy = async (themeId: string, lang: ColorearLang, band: AgeBand, bad: number[]) => {
    const req: StoryRequest = { roles: ["boy", "dog"], lang, band, theme: "", themeId };
    const story = await new TemplateStoryProvider().write(req);
    bad.forEach((i) => { story.scenes[i] = { ...story.scenes[i]!, text: "Mario abre el armario con Dora." }; });
    return { req, story };
  };

  it("replaces only the bad scene, keeps the rest, leaves the reason and passes the strict validator afterwards", async () => {
    const { req, story } = await brandy("trucks", "es", "5-6", [6]);
    expect(() => validateStory(story, 2)).toThrow("story: scene 7 mentions a brand");
    const fixed = repairStory(story, req);
    expect(fixed.repaired).toEqual([{ n: 7, reason: "mentions a brand" }]);
    expect(fixed.scenes.length).toBe(COLOREAR.scenes);
    expect(fixed.scenes[6]!.text).not.toMatch(/Mario/);
    expect(fixed.scenes[6]!.text).toContain(THEME_PACKS.trucks!.es.at); // same theme
    expect(fixed.scenes[6]!.present).toEqual([1, 2]);
    expect(fixed.scenes.filter((_, i) => i !== 6)).toEqual(story.scenes.filter((_, i) => i !== 6));
    expect(() => validateStory(fixed, 2)).not.toThrow();
  });

  it("a replacement scene is safe in every adventure, level and language, even when every scene is bad", async () => {
    for (const themeId of THEME_IDS) for (const band of BANDS) for (const lang of LANGS) {
      const { req, story } = await brandy(themeId, lang, band, Array.from({ length: COLOREAR.scenes }, (_, i) => i));
      const fixed = repairStory(story, req);
      expect(fixed.repaired?.length, `${themeId}/${band}/${lang}`).toBe(COLOREAR.scenes);
      expect(() => validateStory(fixed, 2), `${themeId}/${band}/${lang}`).not.toThrow();
      const pack = THEME_PACKS[themeId];
      if (pack) for (const s of fixed.scenes) expect(s.text, `${themeId}/${lang}`).toContain(lang === "es" ? pack.es.at : pack.en.at);
      expect(new Set(fixed.scenes.map((s) => s.text)).size).toBeGreaterThan(1); // not one sentence repeated 22 times
    }
  });

  it("the production provider replaces instead of throwing when the template itself carries a blocked word", async () => {
    const tainted: StoryProvider = {
      name: "tainted",
      write: async (req) => ({ ...(await new TemplateStoryProvider().write(req)), scenes: (await new TemplateStoryProvider().write(req)).scenes.map((s, i) => (i === 6 ? { ...s, visual: "{all} playing with Pikachu in a park" } : s)) }),
    };
    const story = await new FallbackStoryProvider(null, tainted).write({ roles: ["girl"], lang: "en", band: "7-8", theme: "", themeId: "space" });
    expect(story.repaired).toEqual([{ n: 7, reason: "mentions a brand" }]);
    expect(story.writer).toBe("template"); // the writer survives the repair
    expect(story.scenes[6]!.visual).not.toMatch(/Pikachu/);
  });

  it("a story that is not a story (wrong number of scenes) still throws: that is not one sentence to replace", () => {
    expect(() => repairStory({ title: "x", scenes: [] }, { roles: ["girl"], lang: "es", band: "5-6", theme: "", themeId: "space" })).toThrow(/expected 22 scenes/);
  });
});

// ---------------------------------------------------------------------------------------------- the engine: a stuck story stage never loops

class Counter implements ImageProvider {
  readonly name = "mock" as const;
  readonly model = "counter";
  seen: ImageRequest[] = [];
  private inner = new MockImageProvider();
  async render(req: ImageRequest) { this.seen.push(req); return this.inner.render(req); }
  count(kind: ImageRequest["kind"]) { return this.seen.filter((r) => r.kind === kind).length; }
}

async function build(story: StoryProvider) {
  const db = createMemoryDb();
  const storage = new MemoryStorage();
  const sink = new MemorySink();
  const image = new Counter();
  const env = { COLOREAR_COUNTRIES: "MX", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala", PHONE_HASH_SALT: "s" };
  const now = new Date("2026-11-20T15:00:00Z");
  const engine = new ColorearEngine({
    db, storage, uploads: new MemoryStorage(), delivery: new MockDeliveryProvider(), image, mockImage: new MockImageProvider(), story,
    tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => now), payments: new MockPaymentProvider("http://localhost:3000"), env, now: () => now,
    brand: { ...brandConfig(env), brand: "Pintoria" },
  });
  const photo = () => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 200, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));
  const buy = async (themeId: string, age = 6) => {
    const { order } = await engine.createCheckout(
      { lang: "es", country: "MX", email: "a@example.com", persons: [{ name: "Juan", role: "niño" }, { name: "Toby", role: "perro" }], photos: [await photo(), await photo()], theme: themeLabel(themeId, "es"), themeId, age, checkboxIds: ["K1", "K2"], ip: "203.0.113.7" },
      { successUrl: (o) => `https://www.pintoria.app/c/${o.access_token}`, cancelUrl: "http://x/" },
    );
    return (await engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: "pay_1" }))!;
  };
  const stateOf = async (id: string) => JSON.parse(new TextDecoder().decode((await storage.get(statePath(id)))!.bytes)) as GenState;
  return { engine, db, storage, sink, image, buy, stateOf };
}

describe("the engine never loops on the story stage", () => {
  it("production path (no key for the text model): the Superheroes and Trucks books are written and delivered on the first run", async () => {
    for (const [themeId, age] of [["heroes", 6], ["heroes", 4], ["trucks", 4], ["trucks", 11]] as const) {
      const h = await build(new FallbackStoryProvider(null));
      const paid = await h.buy(themeId, age);
      const run = await h.engine.runGeneration(paid.id);
      expect(run, `${themeId} ${age}`).toMatchObject({ status: "done" });
      expect((await h.stateOf(paid.id)).issues ?? []).toEqual([]);
    }
  }, 60_000);

  it("a failing story stage resumes from the story: the characters are not drawn again, and the book is made after the attempts run out", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    let calls = 0;
    const alwaysFails: StoryProvider = { name: "broken", write: async () => { calls++; throw new Error("story: scene 7 mentions a brand"); } };
    const h = await build(alwaysFails);
    const paid = await h.buy("heroes");
    for (let attempt = 1; attempt < STORY_MAX_ATTEMPTS; attempt++) {
      const run = await h.engine.runGeneration(paid.id);
      expect(run).toMatchObject({ status: "partial", stage: "story", reason: "story: scene 7 mentions a brand" });
      const st = await h.stateOf(paid.id);
      expect(st.stage).toBe("story");
      expect(st.storyAttempts).toBe(attempt);
      expect(st.lease).toBeNull(); // the next poll or sweep can start it again
      expect(st.characters.map((c) => c.status)).toEqual(["done", "done"]);
      expect(await h.engine.needsRun((await h.db.orders.get(paid.id))!)).toBe(true);
    }
    expect(h.image.count("character")).toBe(2); // drawn once, on the first run
    const last = await h.engine.runGeneration(paid.id);
    expect(last.status).toBe("done");
    expect(calls).toBe(STORY_MAX_ATTEMPTS);
    expect(h.image.count("character")).toBe(2); // still 2: no run redid the characters
    expect(h.image.count("cover")).toBe(1);
    expect(h.image.count("scene")).toBe(COLOREAR.scenes);
    const st = await h.stateOf(paid.id);
    expect(st.storyAttempts).toBe(STORY_MAX_ATTEMPTS);
    expect(st.story?.writer).toBe("template");
    expect(st.issues).toEqual(expect.arrayContaining([`story#1:story: scene 7 mentions a brand`]));
    expect((await h.db.orders.get(paid.id))!.status).toBe("delivered");
    // a run after the book is done does nothing
    expect((await h.engine.runGeneration(paid.id)).status).toBe("skipped");
    expect(h.image.seen.length).toBe(2 + 1 + COLOREAR.scenes);
  }, 60_000);

  it("a scene the filter rejects is replaced in the same run: the book continues, with a note and an event, and nothing is retried", async () => {
    const taintedScene7: StoryProvider = {
      name: "tainted",
      write: async (req) => {
        const s = await new TemplateStoryProvider().write(req);
        s.scenes[6] = { ...s.scenes[6]!, text: "Mario abre el armario." };
        return s;
      },
    };
    const h = await build(taintedScene7);
    const paid = await h.buy("space");
    expect((await h.engine.runGeneration(paid.id)).status).toBe("done");
    const st = await h.stateOf(paid.id);
    expect(st.storyAttempts).toBe(1);
    expect(st.story!.scenes[6]!.text).not.toMatch(/Mario/);
    expect(st.story!.scenes[6]!.text).toContain("en el espacio");
    expect(st.story!.repaired).toEqual([{ n: 7, reason: "mentions a brand" }]);
    expect(st.issues).toContain("story-scene-7-replaced:mentions a brand");
    expect(st.notes).toEqual([]); // internal only: nothing about it is shown to the buyer
    expect(h.sink.events.find((e) => e.name === "content_blocked")!.props).toMatchObject({ stage: "output", reason: "story_scene_7:mentions a brand" });
    expect(h.image.seen.length).toBe(2 + 1 + COLOREAR.scenes);
    expect(h.image.seen.some((r) => /Mario/.test(r.prompt))).toBe(false);
  }, 60_000);

  it("a book saved before the attempt counter existed (no storyAttempts) resumes from the story stage", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    let fail = true;
    const flaky: StoryProvider = { name: "flaky", write: async (req) => { if (fail) throw new Error("story: scene 7 mentions a brand"); return new FallbackStoryProvider(null).write(req); } };
    const h = await build(flaky);
    const paid = await h.buy("heroes");
    expect((await h.engine.runGeneration(paid.id)).status).toBe("partial");
    // the state of a book stuck by the old code: stage "story", characters done, no story, no counter
    const st = await h.stateOf(paid.id);
    delete st.storyAttempts;
    delete st.issues;
    await h.storage.put(statePath(paid.id), new TextEncoder().encode(JSON.stringify(st)), "application/json");
    fail = false; // "the deploy"
    const drawn = h.image.count("character");
    expect((await h.engine.runGeneration(paid.id)).status).toBe("done");
    expect(h.image.count("character")).toBe(drawn);
    expect(drawn).toBe(2);
  }, 60_000);
});
