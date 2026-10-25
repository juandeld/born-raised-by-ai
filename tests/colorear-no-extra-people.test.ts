import { describe, expect, it } from "vitest";
import { COLOREAR, COLOREAR_THEMES, type AgeBand, type ColorearLang } from "@lumen/config";
import {
  AnthropicStoryProvider, NO_EXTRA_PEOPLE, TemplateStoryProvider, THEME_PACKS, buildCoverPrompt, buildScenePrompt, safeScene, type StoryRequest,
} from "@lumen/generate";

/**
 * Production incident (25-oct-2026): a real Pintoria book with ONE person (a boy), theme Superheroes, level 7-8, had other superheroes flying
 * in the background (pages 6 and 7) and an adult superhero holding the boy's hand (page 10, "...ayudandose"). Rule of the owner: if the buyer
 * did not upload somebody, NO person appears, not even in the background. Animals, pets and non-human characters are fine.
 * The drawings come from the `visual` of each scene, so no visual of the template may name groups of people.
 */

const BANDS: AgeBand[] = ["3-4", "5-6", "7-8", "9-12", "adult"];
const LANGS: ColorearLang[] = ["es", "en"];
const THEME_IDS = [...COLOREAR_THEMES.map((t) => t.id), "none", "custom"];

/** Groups of people (en + es), compared as whole words, ignoring case and accents. Robots, dragons, fairies in the singular, etc. are not people. */
const PEOPLE_PLURALS = [
  "superheroes", "heroes", "pirates", "princesses", "princes", "knights", "kings", "queens", "fairies", "mermaids", "friends", "teammates", "team", "teams", "players",
  "crowd", "crowds", "audience", "audiences", "spectators", "fans", "people", "kids", "children", "villagers", "townspeople", "musicians", "astronauts", "soldiers",
  "guards", "workers", "farmers", "passengers", "drivers", "elves", "bystanders", "silhouettes",
  "piratas", "princesas", "principes", "caballeros", "reyes", "reinas", "hadas", "sirenas", "amigos", "amigas", "companeros", "equipo", "equipos", "jugadores", "publico",
  "gente", "personas", "ninos", "ninas", "musicos", "astronautas", "soldados", "guardias", "obreros", "granjeros", "pasajeros", "conductores", "duendes", "espectadores",
  "aficionados", "multitud",
];
/** Words that only make sense when there is somebody else; banned when the book has ONE person ("todos sus colores" is "all its colors", so the Spanish ones are phrases). */
const SOMEBODY_ELSE = ["others", "everyone", "everybody", "each other", "all together", "family", "a todos", "todos se", "todos juntos", "otros", "otras", "ayudandose", "entre ellos"];

const fold = (t: string) => t.normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const found = (text: string, words: string[]) => {
  const t = ` ${fold(text)} `;
  return words.filter((w) => t.includes(` ${fold(w)} `));
};

describe("no scene of the template story names other people", () => {
  it("every adventure x level x language x 1 to 4 people: no visual has a group of people, and a one-person book has nobody else in text or drawing", async () => {
    expect(THEME_IDS.length).toBe(COLOREAR_THEMES.length + 2);
    const problems: string[] = [];
    let checked = 0;
    for (const themeId of THEME_IDS) for (const band of BANDS) for (const lang of LANGS) for (const n of [1, 2, 3, 4]) {
      const req: StoryRequest = { roles: Array.from({ length: n }, () => "a child"), lang, band, theme: themeId === "custom" ? "Antigua Guatemala" : "", themeId };
      const story = await new TemplateStoryProvider().write(req);
      const scenes = [...story.scenes, ...story.scenes.map((_, i) => safeScene(i, req))];
      for (const s of scenes) {
        checked++;
        const where = `${themeId}/${band}/${lang}/${n} scene ${s.n}`;
        for (const w of found(s.visual, PEOPLE_PLURALS)) problems.push(`${where}: visual names "${w}": ${s.visual}`);
        for (const w of found(s.text, PEOPLE_PLURALS)) problems.push(`${where}: text names "${w}": ${s.text}`);
        if (n === 1) {
          for (const w of found(s.visual, SOMEBODY_ELSE)) problems.push(`${where}: visual of a one-person book says "${w}": ${s.visual}`);
          for (const w of found(s.text, SOMEBODY_ELSE)) problems.push(`${where}: text of a one-person book says "${w}": ${s.text}`);
        }
      }
    }
    expect(problems).toEqual([]);
    expect(checked).toBe(THEME_IDS.length * BANDS.length * LANGS.length * 4 * COLOREAR.scenes * 2);
  });

  it("no word of any theme pack (place, sights, friend, ride, in es, en and the drawing) names a group of people", () => {
    const problems: string[] = [];
    for (const [id, pack] of Object.entries(THEME_PACKS)) {
      for (const [lang, words] of Object.entries(pack) as Array<[string, Record<string, string>]>) for (const [field, value] of Object.entries(words)) {
        for (const w of found(value, PEOPLE_PLURALS)) problems.push(`${id}.${lang}.${field} names "${w}": ${value}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("the list catches the production words (so the test above is not asleep)", () => {
    expect(found("a big city with tall buildings and caped heroes", PEOPLE_PLURALS)).toEqual(["heroes"]);
    expect(found("¡Ya están en la ciudad de los superhéroes!", PEOPLE_PLURALS)).toEqual(["superheroes"]);
    expect(found("sigue adelante sin rendirse, ayudándose", SOMEBODY_ELSE)).toEqual(["ayudandose"]);
    expect(found("a pirate ship with a friendly little puppy and robots", PEOPLE_PLURALS)).toEqual([]);
  });

  it("the page that failed in production (Superheroes, level 7-8, one boy): the trip is told without anybody helping him", async () => {
    for (const lang of LANGS) {
      const story = await new TemplateStoryProvider().write({ roles: ["a boy, about 7 years old"], lang, band: "7-8", theme: "", themeId: "heroes" });
      const trip = story.scenes[8]!;
      expect(trip.text).not.toMatch(/ayud|helping/i);
      expect(trip.visual).not.toMatch(/each other|together/);
      for (const i of [5, 6]) expect(story.scenes[i]!.visual, `scene ${i + 1}`).not.toMatch(/hero|cape/i);
    }
    // with several people the sentence stays as it was: they do help each other
    const group = await new TemplateStoryProvider().write({ roles: ["a boy", "a girl"], lang: "es", band: "7-8", theme: "", themeId: "heroes" });
    expect(group.scenes[8]!.text).toContain("ayudándose");
    expect(group.scenes[8]!.visual).toContain("helping each other");
  });
});

describe("the image prompts end with the ban on extra people", () => {
  it("scene and cover prompts end with the rule, which names the groups that a theme invites", () => {
    for (const band of BANDS) for (const count of [0, 1, 3]) {
      expect(buildScenePrompt("character 1 (a boy) in a big city", band, count).endsWith(NO_EXTRA_PEOPLE)).toBe(true);
      expect(buildCoverPrompt("character 1 (a boy) waving", band, count).endsWith(NO_EXTRA_PEOPLE)).toBe(true);
    }
    expect(NO_EXTRA_PEOPLE).toMatch(/No other superheroes, pirates, princesses/);
    expect(NO_EXTRA_PEOPLE).toMatch(/no people in costumes/);
    expect(NO_EXTRA_PEOPLE).toMatch(/no silhouettes/);
    expect(NO_EXTRA_PEOPLE).toMatch(/no faces in windows/);
    expect(NO_EXTRA_PEOPLE).toMatch(/Animals, pets and non-human story characters .* are allowed/);
  });

  it("the story writer is told that a theme about people only gives places and objects, and that a one-person book has nobody else", async () => {
    const bodies: string[] = [];
    const fetchFn = (async (_url: string, init: RequestInit) => { bodies.push(String(init.body)); return new Response("{}", { status: 500 }); }) as unknown as typeof fetch;
    const writer = new AnthropicStoryProvider("k", "m", "https://api.example", fetchFn);
    await writer.write({ roles: ["a boy, about 7 years old"], lang: "es", band: "7-8", theme: "Superhéroes", themeId: "heroes" }).catch(() => undefined);
    await writer.write({ roles: ["a boy", "a girl"], lang: "es", band: "7-8", theme: "Superhéroes", themeId: "heroes" }).catch(() => undefined);
    for (const b of bodies) expect(b).toMatch(/only gives the places and the objects: never write or draw other superheroes, pirates, princesses/);
    expect(bodies[0]).toMatch(/There is only ONE main character/);
    expect(bodies[1]).not.toMatch(/There is only ONE main character/);
  });
});
