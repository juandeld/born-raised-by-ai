import { COLOREAR, type AgeBand, type ColorearLang } from "@lumen/config";
import { mentionsBrand } from "./prompt";
import type { PersonInput, Story, StoryScene } from "./types";

export interface StoryRequest {
  /** Roles only: names are substituted locally, so the story writer never sees them. */
  roles: string[];
  /** Same order as `roles`: how each person is called in the story language ("la abuela", "grandma"). */
  labels?: string[];
  lang: ColorearLang;
  band: AgeBand;
  /** Sanitized optional theme or city of the adventure ("" when none). */
  theme: string;
}

export interface StoryProvider {
  readonly name: string;
  write(req: StoryRequest): Promise<Story>;
}

const rolesOf = (persons: PersonInput[]) => persons.map((p) => p.role);
export { rolesOf };

export function joinNames(names: string[], lang: ColorearLang): string {
  if (names.length <= 1) return names[0] ?? "";
  const and = lang === "es" ? "y" : "and";
  const last = names[names.length - 1]!;
  return `${names.slice(0, -1).join(", ")} ${and} ${last}`;
}

/** Replaces {1}..{5} and {all} with the people's names. Used for the text under each drawing. */
export function fillNames(text: string, names: string[], lang: ColorearLang): string {
  return text.replace(/\{all\}/g, joinNames(names, lang)).replace(/\{(\d)\}/g, (_, d: string) => names[Number(d) - 1] ?? "");
}

/** Replaces {k} in a visual description by the position of that person among the reference images of the scene. */
export function fillVisual(visual: string, present: number[], roles: string[]): string {
  const everyone = present.map((k, i) => `character ${i + 1} (${roles[k - 1] ?? "person"})`).join(", ");
  return visual.replace(/\{all\}/g, everyone).replace(/\{(\d)\}/g, (_, d: string) => {
    const k = Number(d);
    const pos = present.indexOf(k);
    return pos >= 0 ? `character ${pos + 1} (${roles[k - 1] ?? "person"})` : "a friendly character";
  });
}

export function validateStory(raw: unknown, nPersons: number): Story {
  const j = raw as { title?: unknown; scenes?: unknown };
  if (!j || typeof j.title !== "string" || !Array.isArray(j.scenes)) throw new Error("story: bad shape");
  if (j.scenes.length !== COLOREAR.scenes) throw new Error(`story: expected ${COLOREAR.scenes} scenes, got ${j.scenes.length}`);
  const scenes: StoryScene[] = j.scenes.map((s: { text?: unknown; present?: unknown; visual?: unknown }, i: number) => {
    if (typeof s.text !== "string" || typeof s.visual !== "string" || !Array.isArray(s.present)) throw new Error(`story: scene ${i + 1} bad shape`);
    const present = [...new Set(s.present.map(Number))].filter((k) => Number.isInteger(k) && k >= 1 && k <= nPersons);
    const text = s.text.replace(/\s+/g, " ").trim();
    const visual = s.visual.replace(/\s+/g, " ").trim();
    if (text.length < 8 || text.length > 220) throw new Error(`story: scene ${i + 1} text length`);
    if (visual.length < 10 || visual.length > 400) throw new Error(`story: scene ${i + 1} visual length`);
    if (mentionsBrand(`${text} ${visual}`)) throw new Error(`story: scene ${i + 1} mentions a brand`);
    if (/https?:|www\.|@/.test(`${text} ${visual}`)) throw new Error(`story: scene ${i + 1} has a link`);
    return { n: i + 1, text, present: present.length ? present : Array.from({ length: nPersons }, (_, k) => k + 1), visual };
  });
  return { title: j.title.trim().slice(0, 80), scenes, writer: "unknown" };
}

// ------------------------------------------------------------------ template story (no API key, or fallback)

interface Beat {
  es: (pl: boolean, theme: string) => string;
  en: (pl: boolean, theme: string) => string;
  /** 0 = everyone; otherwise the person (1-based) who stars, with the others optional. */
  star: number;
  visual: string;
}

const BEATS: Beat[] = [
  { es: (p) => `Una mañana soleada, {all} ${p ? "se despiertan" : "se despierta"} con muchas ganas de jugar.`, en: (p) => `One sunny morning, {all} ${p ? "wake" : "wakes"} up ready to play.`, star: 0, visual: "{all} waking up happily in a cozy room with a big smiling sun in the window" },
  { es: () => `En el jardín, {1} encuentra un mapa mágico escondido entre las flores.`, en: () => `In the garden, {1} finds a magic map hidden among the flowers.`, star: 1, visual: "{1} in a garden holding up a rolled treasure map, flowers all around, surprised smile" },
  { es: (p) => `{all} ${p ? "miran" : "mira"} el mapa con los ojos muy abiertos. ¡Una aventura los espera!`, en: (p) => `{all} ${p ? "look" : "looks"} at the map with wide eyes. An adventure is waiting!`, star: 0, visual: "{all} gathered around a big unrolled map, eyes wide open, excited" },
  { es: (p) => `Preparan sus mochilas y ${p ? "salen" : "sale"} de casa dando saltitos de alegría.`, en: (p) => `${p ? "They pack" : "They pack"} their backpacks and head out, hopping with joy.`, star: 0, visual: "{all} wearing small backpacks walking out of a house door, hopping happily" },
  { es: () => `Por el camino hay mariposas, flores y un arroyo cantarín.`, en: () => `Along the path there are butterflies, flowers and a singing stream.`, star: 0, visual: "{all} walking on a winding path with butterflies, flowers and a little stream" },
  { es: (p) => `De pronto aparece un amigo muy simpático que quiere acompañar${p ? "los" : "lo"}.`, en: () => `Suddenly a very friendly new friend appears and wants to come along.`, star: 0, visual: "{all} meeting a friendly smiling little animal friend on the path, waving" },
  { es: (p) => `Para seguir, ${p ? "cruzan" : "cruza"} un puentecito de madera sobre el río.`, en: (p) => `To go on, {all} ${p ? "cross" : "crosses"} a little wooden bridge over the river.`, star: 0, visual: "{all} crossing a small wooden bridge over a river with fish jumping" },
  { es: () => `Empieza a llover y {1} usa una hoja gigante como paraguas.`, en: () => `It starts to rain and {1} uses a giant leaf as an umbrella.`, star: 1, visual: "{1} holding a giant leaf like an umbrella in light rain, the others smiling" },
  { es: (p) => `¡Qué cuesta tan alta! Pero ${p ? "suben" : "sube"} sin rendirse, paso a paso.`, en: (p) => `What a tall hill! But {all} ${p ? "climb" : "climbs"} without giving up, step by step.`, star: 0, visual: "{all} climbing a big grassy hill step by step, helping each other" },
  { es: (p, t) => `Desde la cima ven por fin ${t || "un lugar mágico"}: ¡es todavía mejor de lo que imaginaban!`, en: (p, t) => `From the top they finally see ${t || "a magical place"}: it is even better than they imagined!`, star: 0, visual: "{all} at the top of a hill looking at a wonderful magical landscape with arms raised" },
  { es: (p) => `Encuentran una barquita y ${p ? "navegan" : "navega"} por un lago tranquilo.`, en: (p) => `They find a little boat and {all} ${p ? "sail" : "sails"} across a calm lake.`, star: 0, visual: "{all} sitting in a small rowboat on a calm lake with ducks and water lilies" },
  { es: () => `¡Plop! {1} resbala y cae sobre una montaña de hojas suaves. ¡Todos se ríen!`, en: () => `Plop! {1} slips and lands on a soft pile of leaves. Everyone laughs!`, star: 1, visual: "{1} falling onto a big pile of soft leaves, the others laughing" },
  { es: (p) => `Hacen un picnic con frutas y bocadillos bajo un árbol enorme.`, en: () => `They have a picnic with fruit and sandwiches under a huge tree.`, star: 0, visual: "{all} having a picnic on a blanket under a huge tree with fruit and sandwiches" },
  { es: () => `Dentro de una cueva descubren cristales que brillan como estrellas.`, en: () => `Inside a cave they discover crystals that sparkle like stars.`, star: 0, visual: "{all} inside a cave with big sparkling crystals, amazed" },
  { es: (p) => `Para abrir una puerta secreta ${p ? "resuelven" : "resuelve"} un acertijo, todos juntos.`, en: (p) => `To open a secret door, {all} ${p ? "solve" : "solves"} a riddle, all together.`, star: 0, visual: "{all} together in front of a round secret door with simple shapes to push, thinking" },
  { es: () => `¡Detrás de la puerta hay un cofre del tesoro enorme!`, en: () => `Behind the door there is a huge treasure chest!`, star: 0, visual: "{all} opening a big treasure chest full of coins and jewels, delighted" },
  { es: () => `El mejor tesoro es compartir: reparten las monedas con su nuevo amigo.`, en: () => `The best treasure is sharing: they give some coins to their new friend.`, star: 0, visual: "{all} sharing coins with the friendly animal friend, everybody smiling" },
  { es: () => `¡Hora de la fiesta! Bailan, cantan y tocan tambores de mentira.`, en: () => `Party time! They dance, sing and play pretend drums.`, star: 0, visual: "{all} dancing and playing little drums and shakers at a party with streamers" },
  { es: () => `Cae la tarde y las luciérnagas encienden sus lucecitas.`, en: () => `Evening falls and the fireflies light up their little lamps.`, star: 0, visual: "{all} sitting together at dusk watching fireflies and a crescent moon" },
  { es: (p) => `Para volver a casa ${p ? "suben" : "sube"} a un globo gigante que flota entre las nubes.`, en: (p) => `To go home, {all} ${p ? "climb" : "climbs"} into a giant hot air balloon floating among the clouds.`, star: 0, visual: "{all} in the basket of a big hot air balloon among fluffy clouds" },
  { es: () => `En casa los esperan con un abrazo enorme. ¡Qué día tan increíble!`, en: () => `At home a big hug is waiting. What an incredible day!`, star: 0, visual: "{all} hugging in front of their house, a warm family hug" },
  { es: (p) => `Esa noche ${p ? "sueñan" : "sueña"} con la próxima aventura. ¡Buenas noches!`, en: (p) => `That night {all} ${p ? "dream" : "dreams"} of the next adventure. Good night!`, star: 0, visual: "{all} sleeping in cozy beds under the moon and stars, smiling" },
];

export class TemplateStoryProvider implements StoryProvider {
  readonly name = "template";
  async write(req: StoryRequest): Promise<Story> {
    const n = req.roles.length;
    const pl = n > 1;
    const everyone = Array.from({ length: n }, (_, i) => i + 1);
    const scenes: StoryScene[] = BEATS.map((b, i) => {
      const star = b.star && b.star <= n ? b.star : 1;
      const present = b.star ? [...new Set([star, ...everyone.slice(0, 2)])].sort() : everyone;
      let visual = b.visual;
      if (b.star === 0) visual = visual.replace("{all}", present.map((k) => `{${k}}`).join(" and "));
      return { n: i + 1, text: (req.lang === "es" ? b.es : b.en)(pl, req.theme), present, visual: `${visual}${req.theme && i === 9 ? `, the place looks like: ${req.theme}` : ""}` };
    });
    return { title: req.lang === "es" ? "Una gran aventura" : "A Big Adventure", scenes, writer: "template" };
  }
}

// ------------------------------------------------------------------ Claude Haiku

export class AnthropicStoryProvider implements StoryProvider {
  readonly name = "anthropic";
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly baseUrl = "https://api.anthropic.com",
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  static fromEnv(env: Record<string, string | undefined>): AnthropicStoryProvider | null {
    if (!env.ANTHROPIC_API_KEY) return null;
    // Model id [no verificado]: the stack says Claude Haiku 5.5; set ANTHROPIC_STORY_MODEL to the exact id of your account.
    return new AnthropicStoryProvider(env.ANTHROPIC_API_KEY, env.ANTHROPIC_STORY_MODEL || "claude-haiku-4-5", env.ANTHROPIC_API_BASE || "https://api.anthropic.com");
  }

  async write(req: StoryRequest): Promise<Story> {
    const n = req.roles.length;
    const lang = req.lang === "es" ? "Spanish (neutral Latin American)" : "English";
    const system =
      "You write short, warm adventure stories for children's coloring books. Reply with JSON only, no markdown. " +
      "Never mention brands, licensed characters, real celebrities, or scary, violent or inappropriate things. Keep it gentle, funny and kind.";
    const user =
      `Write a story of exactly ${COLOREAR.scenes} scenes for a coloring book for children aged ${req.band}. ` +
      `The main characters are (refer to them ONLY with the tokens {1}..{${n}}, never invent names): ${req.roles.map((r, i) => `{${i + 1}} = ${r}${req.labels?.[i] ? ` (in the story call this character "${req.labels[i]}" when a role word is needed, never a name)` : ""}`).join("; ")}. ` +
      `${req.theme ? `Adventure theme or place: ${req.theme}. ` : "Choose a magical, friendly adventure. "}` +
      `Language of "text": ${lang}. Each scene "text" is 1 or 2 short, simple sentences (max 25 words) read aloud to a young child. ` +
      `Use {all} for "all the characters". Each scene "visual" is an English description of ONE drawing (what is seen: characters using tokens {k}, setting, action), simple enough to color. ` +
      `"present" lists the character numbers that appear in the drawing. Arc: setup, quest, small obstacle, friendly helper, funny moment, treasure or goal, celebration, return home, bedtime. ` +
      `JSON shape: {"title": string (in ${lang}, max 6 words, no tokens), "scenes": [{"text": string, "present": number[], "visual": string}, ... ${COLOREAR.scenes} items]}`;
    const res = await this.fetchFn(`${this.baseUrl}/v1/messages`, {
      method: "POST",
      headers: { "x-api-key": this.apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: this.model, max_tokens: 6000, system, messages: [{ role: "user", content: user }] }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const j = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = j.content?.find((c) => c.type === "text")?.text ?? "";
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const story = validateStory(JSON.parse(json), n);
    return { ...story, writer: "anthropic" };
  }
}

/** Claude when a key exists (one retry, then the template so the order never blocks), else the template. */
export class FallbackStoryProvider implements StoryProvider {
  readonly name: string;
  constructor(private readonly primary: StoryProvider | null, private readonly fallback: StoryProvider = new TemplateStoryProvider()) {
    this.name = primary ? `${primary.name}+template` : fallback.name;
  }
  async write(req: StoryRequest): Promise<Story> {
    if (this.primary) {
      for (let i = 0; i < 2; i++) {
        try {
          return await this.primary.write(req);
        } catch {
          /* retry once, then fall back */
        }
      }
    }
    return validateStoryKeepWriter(await this.fallback.write(req), req.roles.length);
  }
}

function validateStoryKeepWriter(s: Story, n: number): Story {
  return { ...validateStory(s, n), writer: s.writer };
}
