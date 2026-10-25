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
  /** Catalog id of the theme ("space"...) when the buyer picked one; "custom" or absent for free text. */
  themeId?: string;
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

/** Per-theme words for the template story. es: place "el espacio", at "en el espacio", friend/ride with an indefinite article. v: English descriptions for the drawings. */
export interface ThemePack { es: { place: string; at: string; sights: string; friend: string; ride: string }; en: { place: string; at: string; sights: string; friend: string; ride: string }; v: { place: string; sights: string; friend: string; ride: string } }
export const THEME_PACKS: Record<string, ThemePack> = {
  dinosaurs: { es: { place: "el mundo de los dinosaurios", at: "en el mundo de los dinosaurios", sights: "helechos gigantes, huevos y huellas enormes", friend: "un dinosaurio bebé muy simpático", ride: "un dinosaurio gigante y amable" }, en: { place: "the land of the dinosaurs", at: "in the land of the dinosaurs", sights: "giant ferns, eggs and huge footprints", friend: "a friendly baby dinosaur", ride: "a big gentle dinosaur" }, v: { place: "a land of friendly dinosaurs with ferns and a small volcano", sights: "giant ferns, dinosaur eggs and big footprints", friend: "a friendly baby dinosaur", ride: "riding on the back of a big gentle dinosaur" } },
  space: { es: { place: "el espacio", at: "en el espacio", sights: "estrellas, planetas y cometas", friend: "un alienígena muy simpático", ride: "un cohete" }, en: { place: "outer space", at: "in outer space", sights: "stars, planets and comets", friend: "a very friendly little alien", ride: "a rocket" }, v: { place: "outer space with planets, stars and a moon", sights: "stars, ringed planets and a comet", friend: "a friendly little alien", ride: "a rocket ship" } },
  jungle: { es: { place: "la selva", at: "en la selva", sights: "monos, loros y árboles altísimos", friend: "un monito muy simpático", ride: "un elefante amable" }, en: { place: "the jungle", at: "in the jungle", sights: "monkeys, parrots and very tall trees", friend: "a friendly little monkey", ride: "a gentle elephant" }, v: { place: "a jungle with tall trees, vines and animals", sights: "monkeys, parrots and tall jungle trees", friend: "a friendly little monkey", ride: "riding on a gentle elephant" } },
  farm: { es: { place: "la granja", at: "en la granja", sights: "vaquitas, gallinas y un granero rojo", friend: "un pollito muy simpático", ride: "un tractor" }, en: { place: "the farm", at: "at the farm", sights: "cows, hens and a big red barn", friend: "a friendly little chick", ride: "a tractor" }, v: { place: "a farm with a barn, cows and hens", sights: "cows, hens and a big barn", friend: "a friendly little chick", ride: "a small tractor" } },
  pets: { es: { place: "el mundo de los perros y los gatos", at: "en un pueblo de perros y gatos", sights: "perritos, gatitos y huesos de juguete", friend: "un perrito muy simpático", ride: "un carrito de juguete" }, en: { place: "the world of dogs and cats", at: "in a town full of dogs and cats", sights: "puppies, kittens and toy bones", friend: "a friendly little puppy", ride: "a toy wagon" }, v: { place: "a cozy town full of puppies and kittens", sights: "puppies, kittens and toy bones", friend: "a friendly little puppy", ride: "a toy wagon pulled by a puppy" } },
  ocean: { es: { place: "el fondo del mar", at: "en el fondo del mar", sights: "peces de colores, corales y estrellas de mar", friend: "un delfín muy simpático", ride: "un submarino" }, en: { place: "the bottom of the sea", at: "at the bottom of the sea", sights: "colorful fish, corals and starfish", friend: "a friendly dolphin", ride: "a little submarine" }, v: { place: "an underwater world with corals and fish", sights: "colorful fish, corals and starfish", friend: "a friendly dolphin", ride: "a little submarine" } },
  mermaids: { es: { place: "el reino de las sirenas", at: "en el reino de las sirenas", sights: "conchas, perlas y peces brillantes", friend: "una sirenita muy simpática", ride: "una concha gigante" }, en: { place: "the mermaid kingdom", at: "in the mermaid kingdom", sights: "shells, pearls and shiny fish", friend: "a friendly little mermaid", ride: "a giant shell" }, v: { place: "an underwater mermaid kingdom with shells and pearls", sights: "shells, pearls and shiny fish", friend: "a friendly little mermaid", ride: "a giant shell" } },
  unicorns: { es: { place: "el valle de los unicornios", at: "en el valle de los unicornios", sights: "arcoíris, nubes y flores brillantes", friend: "un unicornio bebé muy simpático", ride: "un unicornio con alas" }, en: { place: "the unicorn valley", at: "in the unicorn valley", sights: "rainbows, clouds and sparkling flowers", friend: "a friendly baby unicorn", ride: "a unicorn with wings" }, v: { place: "a magical valley with rainbows and flowers", sights: "rainbows, clouds and sparkling flowers", friend: "a friendly baby unicorn", ride: "a winged unicorn" } },
  dragons: { es: { place: "la tierra de los dragones", at: "en la tierra de los dragones", sights: "montañas, cuevas y huevos de dragón", friend: "un dragoncito muy simpático", ride: "un dragón amable" }, en: { place: "the land of dragons", at: "in the land of dragons", sights: "mountains, caves and dragon eggs", friend: "a friendly little dragon", ride: "a gentle dragon" }, v: { place: "a land of friendly dragons with mountains and caves", sights: "mountains, caves and dragon eggs", friend: "a friendly little dragon", ride: "riding on a gentle dragon" } },
  castles: { es: { place: "el reino del castillo", at: "en el reino del castillo", sights: "torres, banderas y jardines reales", friend: "una princesita muy simpática", ride: "una carroza real" }, en: { place: "the castle kingdom", at: "in the castle kingdom", sights: "towers, flags and royal gardens", friend: "a friendly little princess", ride: "a royal carriage" }, v: { place: "a kingdom with a big castle, towers and flags", sights: "castle towers, flags and royal gardens", friend: "a friendly little princess", ride: "a royal carriage" } },
  fairies: { es: { place: "el bosque de las hadas", at: "en el bosque de las hadas", sights: "luciérnagas, hongos y flores diminutas", friend: "un hada muy simpática", ride: "una libélula gigante" }, en: { place: "the fairy forest", at: "in the fairy forest", sights: "fireflies, mushrooms and tiny flowers", friend: "a friendly little fairy", ride: "a giant dragonfly" }, v: { place: "a magic forest with mushrooms and tiny fairy houses", sights: "fireflies, mushrooms and tiny flowers", friend: "a friendly little fairy", ride: "a giant dragonfly" } },
  pirates: { es: { place: "la isla de los piratas", at: "en la isla de los piratas", sights: "palmeras, cañones de juguete y mapas viejos", friend: "un loro pirata muy simpático", ride: "un barco pirata" }, en: { place: "the pirate island", at: "on the pirate island", sights: "palm trees, toy cannons and old maps", friend: "a friendly pirate parrot", ride: "a pirate ship" }, v: { place: "a pirate island with palm trees and a ship", sights: "palm trees, a treasure map and a pirate ship", friend: "a friendly pirate parrot", ride: "a pirate ship" } },
  robots: { es: { place: "la ciudad de los robots", at: "en la ciudad de los robots", sights: "engranajes, luces y botones gigantes", friend: "un robotito muy simpático", ride: "un robot gigante" }, en: { place: "the robot city", at: "in the robot city", sights: "gears, lights and giant buttons", friend: "a friendly little robot", ride: "a giant robot" }, v: { place: "a city of friendly robots with gears and lights", sights: "gears, lights and giant buttons", friend: "a friendly little robot", ride: "a giant friendly robot" } },
  cars: { es: { place: "la pista de carreras", at: "en la pista de carreras", sights: "banderas, curvas y carritos veloces", friend: "un carrito de carreras muy simpático", ride: "un carro de carreras" }, en: { place: "the racetrack", at: "at the racetrack", sights: "flags, curves and speedy little cars", friend: "a friendly little race car", ride: "a race car" }, v: { place: "a racetrack with flags, curves and race cars", sights: "checkered flags, curves and little race cars", friend: "a friendly little race car", ride: "a race car" } },
  trucks: { es: { place: "la obra de construcción", at: "en la obra de construcción", sights: "excavadoras, grúas y montañas de arena", friend: "un camioncito muy simpático", ride: "una excavadora" }, en: { place: "the construction site", at: "at the construction site", sights: "diggers, cranes and hills of sand", friend: "a friendly little truck", ride: "a digger" }, v: { place: "a construction site with diggers, cranes and sand", sights: "diggers, cranes and hills of sand", friend: "a friendly little truck", ride: "a big digger" } },
  trains: { es: { place: "la estación del tren", at: "en la estación del tren", sights: "vías, túneles y señales de colores", friend: "una locomotora muy simpática", ride: "un tren" }, en: { place: "the train station", at: "at the train station", sights: "tracks, tunnels and colorful signals", friend: "a friendly little locomotive", ride: "a train" }, v: { place: "a train station with tracks, tunnels and signals", sights: "train tracks, tunnels and colorful signals", friend: "a friendly little locomotive", ride: "a little train" } },
  planes: { es: { place: "el cielo", at: "en el cielo", sights: "nubes, aviones y globos de colores", friend: "un pajarito muy simpático", ride: "un avión" }, en: { place: "the sky", at: "up in the sky", sights: "clouds, little planes and colorful balloons", friend: "a friendly little bird", ride: "an airplane" }, v: { place: "a bright sky with clouds, planes and hot air balloons", sights: "clouds, little planes and colorful balloons", friend: "a friendly little bird", ride: "a little airplane" } },
  heroes: { es: { place: "la ciudad de los superhéroes", at: "en la ciudad de los superhéroes", sights: "edificios altos, capas y rayos de colores", friend: "un superperrito muy simpático", ride: "una moto voladora" }, en: { place: "the superhero city", at: "in the superhero city", sights: "tall buildings, capes and colorful lightning", friend: "a friendly little super puppy", ride: "a flying motorbike" }, v: { place: "a big city with tall buildings and caped heroes", sights: "tall buildings, capes and colorful lightning bolts", friend: "a friendly little super puppy", ride: "a flying motorbike" } },
  bugs: { es: { place: "el jardín de las mariposas", at: "en el jardín de las mariposas", sights: "mariposas, mariquitas y flores enormes", friend: "una mariquita muy simpática", ride: "una mariposa gigante" }, en: { place: "the butterfly garden", at: "in the butterfly garden", sights: "butterflies, ladybugs and giant flowers", friend: "a friendly little ladybug", ride: "a giant butterfly" }, v: { place: "a garden with butterflies, ladybugs and huge flowers", sights: "butterflies, ladybugs and giant flowers", friend: "a friendly little ladybug", ride: "a giant butterfly" } },
  garden: { es: { place: "el jardín de flores", at: "en el jardín de flores", sights: "girasoles, tulipanes y abejitas", friend: "una abejita muy simpática", ride: "una regadera gigante" }, en: { place: "the flower garden", at: "in the flower garden", sights: "sunflowers, tulips and little bees", friend: "a friendly little bee", ride: "a giant watering can" }, v: { place: "a garden full of sunflowers, tulips and bees", sights: "sunflowers, tulips and little bees", friend: "a friendly little bee", ride: "a giant watering can" } },
  sweets: { es: { place: "el reino de los helados", at: "en el reino de los helados", sights: "helados, galletas y pasteles gigantes", friend: "un cupcake muy simpático", ride: "un helado gigante" }, en: { place: "the ice cream kingdom", at: "in the ice cream kingdom", sights: "ice creams, cookies and giant cakes", friend: "a friendly little cupcake", ride: "a giant ice cream cone" }, v: { place: "a candy kingdom with ice creams, cookies and cakes", sights: "ice creams, cookies and giant cakes", friend: "a friendly little cupcake", ride: "a giant ice cream cone" } },
  soccer: { es: { place: "el estadio", at: "en el estadio", sights: "balones, porterías y banderines", friend: "un balón muy simpático", ride: "un autobús del equipo" }, en: { place: "the stadium", at: "at the stadium", sights: "balls, goals and little flags", friend: "a friendly little soccer ball", ride: "the team bus" }, v: { place: "a sports stadium with balls, goals and flags", sights: "balls, goals and little flags", friend: "a friendly little soccer ball", ride: "the team bus" } },
  music: { es: { place: "el país de la música", at: "en el país de la música", sights: "guitarras, tambores y notas musicales", friend: "una notita musical muy simpática", ride: "un piano con ruedas" }, en: { place: "the land of music", at: "in the land of music", sights: "guitars, drums and musical notes", friend: "a friendly little musical note", ride: "a piano on wheels" }, v: { place: "a musical land with guitars, drums and notes", sights: "guitars, drums and floating musical notes", friend: "a friendly little musical note", ride: "a piano on wheels" } },
  christmas: { es: { place: "el Polo Norte navideño", at: "en el Polo Norte navideño", sights: "árboles de Navidad, regalos y copos de nieve", friend: "un muñeco de nieve muy simpático", ride: "un trineo" }, en: { place: "the Christmas North Pole", at: "at the Christmas North Pole", sights: "Christmas trees, presents and snowflakes", friend: "a friendly little snowman", ride: "a sleigh" }, v: { place: "a snowy village with Christmas trees and presents", sights: "Christmas trees, presents and snowflakes", friend: "a friendly little snowman", ride: "a sleigh" } },
};

export class TemplateStoryProvider implements StoryProvider {
  readonly name = "template";
  async write(req: StoryRequest): Promise<Story> {
    const n = req.roles.length;
    const pl = n > 1;
    const everyone = Array.from({ length: n }, (_, i) => i + 1);
    const pack = req.themeId ? THEME_PACKS[req.themeId] : undefined;
    const beats = pack ? themedBeats(pack) : BEATS;
    const scenes: StoryScene[] = beats.map((b, i) => {
      const star = b.star && b.star <= n ? b.star : 1;
      const present = b.star ? [...new Set([star, ...everyone.slice(0, 2)])].sort() : everyone;
      let visual = b.visual;
      if (b.star === 0) visual = visual.replace("{all}", present.map((k) => `{${k}}`).join(" and "));
      // A free-text theme is never pasted into the sentence (it is not a place); it only guides the drawing.
      const hint = !pack && req.theme && i % 3 === 0 ? `, inspired by the theme: ${req.theme}` : "";
      return { n: i + 1, text: adaptTone((req.lang === "es" ? b.es : b.en)(pl, ""), req.band), present, visual: `${visual}${hint}` };
    });
    return { title: req.lang === "es" ? "Una gran aventura" : "A Big Adventure", scenes, writer: "template" };
  }
}

/**
 * The story text follows the detail level. 3-4: one short sentence, easy to read aloud. 9-12: as is. Adults: warm and brief, without the
 * exclamation marks and the baby voice of a children's book. Never returns less than 8 characters (the story validator's minimum).
 */
export function adaptTone(text: string, band: AgeBand): string {
  if (band === "adult") {
    const t = text.replace(/[¡]/g, "").replace(/!/g, ".").replace(/\.\.+/g, ".").replace(/\? ?\./g, "?").replace(/\s+/g, " ").trim();
    return t.length >= 8 ? t : text;
  }
  if (band === "3-4") {
    // the first sentence that says something (an interjection like "¡Plop!" is not one)
    const first = text.split(/(?<=[.!?])\s+/).find((x) => x.length >= 14);
    return first ?? text;
  }
  return text;
}

/** Who the story is written for, per detail level (the story text of the adults is not read to a small child). */
export function audienceOf(band: AgeBand): { who: string; style: string } {
  switch (band) {
    case "3-4": return { who: "children aged 3 to 4", style: "Each scene \"text\" is ONE very short, very simple sentence (max 12 words) read aloud to a toddler." };
    case "5-6": return { who: "children aged 5 to 6", style: "Each scene \"text\" is 1 or 2 short, simple sentences (max 25 words) read aloud to a young child." };
    case "7-8": return { who: "children aged 7 to 8", style: "Each scene \"text\" is 1 or 2 short sentences (max 30 words) a child can read alone, with a little humor." };
    case "9-12": return { who: "children aged 9 to 12", style: "Each scene \"text\" is 1 or 2 sentences (max 35 words), lively and a little witty, never babyish." };
    default: return { who: "adults who color to relax", style: "Each scene \"text\" is 1 or 2 sentences (max 30 words) in a warm, calm, brief tone, never childish: no baby talk, no diminutives, few exclamation marks." };
  }
}

/** The 22 beats of the story, with the scenery, the friend and the ride of the chosen theme (the rest of the arc stays). */
function themedBeats(t: ThemePack): Beat[] {
  const out = BEATS.slice();
  const set = (i: number, b: Beat) => { out[i] = b; };
  set(4, { es: () => `¡Ya están ${t.es.at}! Ven ${t.es.sights}.`, en: () => `Soon they arrive ${t.en.at}, full of ${t.en.sights}.`, star: 0, visual: `{all} arriving at ${t.v.place}, full of ${t.v.sights}` });
  set(5, { es: (p) => `De pronto aparece ${t.es.friend} que quiere acompañar${p ? "los" : "lo"}.`, en: () => `Suddenly ${t.en.friend} appears and wants to come along.`, star: 0, visual: `{all} meeting ${t.v.friend}, waving hello, with ${t.v.place} behind` });
  set(6, { es: (p) => `Para seguir, ${p ? "suben" : "sube"} a ${t.es.ride}.`, en: () => `To go on, they hop on ${t.en.ride}.`, star: 0, visual: `{all} climbing onto ${t.v.ride}` });
  set(7, { es: () => `{1} descubre ${t.es.sights} y se lo muestra a todos. ¡Qué emoción!`, en: () => `{1} spots ${t.en.sights} and shows everyone. How exciting!`, star: 1, visual: `{1} pointing excitedly at ${t.v.sights}, the others looking` });
  set(8, { es: (p) => `¡Qué viaje tan largo! Pero ${p ? "siguen" : "sigue"} adelante sin rendirse, ayudándose.`, en: () => `What a long trip! But they keep going without giving up, helping each other.`, star: 0, visual: `{all} traveling together through ${t.v.place}, helping each other` });
  set(9, { es: () => `Desde lo más alto ven ${t.es.place} con todos sus colores: ¡es todavía mejor de lo que imaginaban!`, en: () => `From the highest point they see ${t.en.place} in all its colors: it is even better than they imagined!`, star: 0, visual: `{all} looking at a wonderful view of ${t.v.place} with arms raised` });
  set(10, { es: () => `El nuevo amigo les enseña su rincón favorito ${t.es.at}.`, en: () => `The new friend shows them its favorite corner ${t.en.at}.`, star: 0, visual: `{all} with ${t.v.friend} at its favorite corner of ${t.v.place}` });
  set(11, { es: () => `¡Plop! {1} se tropieza y todos se ríen a carcajadas.`, en: () => `Plop! {1} trips and everyone bursts out laughing.`, star: 1, visual: `{1} tripping comically near ${t.v.sights}, the others laughing` });
  set(12, { es: () => `Hacen un picnic ${t.es.at}, con frutas y bocadillos.`, en: () => `They have a picnic ${t.en.at}, with fruit and sandwiches.`, star: 0, visual: `{all} having a picnic on a blanket in ${t.v.place}` });
  set(13, { es: () => `Descubren un lugar secreto ${t.es.at}, ¡lleno de cosas brillantes!`, en: () => `They discover a secret place ${t.en.at}, full of shiny things!`, star: 0, visual: `{all} discovering a secret shiny spot in ${t.v.place}, amazed` });
  set(17, { es: () => `¡Hora de la fiesta ${t.es.at}! Bailan, cantan y tocan tambores de mentira.`, en: () => `Party time ${t.en.at}! They dance, sing and play pretend drums.`, star: 0, visual: `{all} dancing and playing little drums at a party in ${t.v.place}` });
  set(18, { es: (p) => `Para volver a casa ${p ? "suben" : "sube"} otra vez a ${t.es.ride}.`, en: () => `To go home, they hop on ${t.en.ride} again.`, star: 0, visual: `{all} riding ${t.v.ride} back home at sunset` });
  return out;
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
      "You write short, warm adventure stories for coloring books. Reply with JSON only, no markdown. " +
      "Never mention brands, licensed characters, real celebrities, or scary, violent or inappropriate things. Keep it gentle, funny and kind.";
    const user =
      `Write a story of exactly ${COLOREAR.scenes} scenes for a coloring book for ${audienceOf(req.band).who}. ` +
      `The main characters are (refer to them ONLY with the tokens {1}..{${n}}, never invent names): ${req.roles.map((r, i) => `{${i + 1}} = ${r}${req.labels?.[i] ? ` (in the story call this character "${req.labels[i]}" when a role word is needed, never a name)` : ""}`).join("; ")}. ` +
      `${req.theme ? `Adventure theme: "${req.theme}". EVERY scene must clearly take place in, or involve, this theme (its places, creatures, objects), and the "visual" of every scene must show it. Use it naturally ("in space", "on the farm", "a rocket"): never paste the theme name as if it were a place. ` : "Choose a magical, friendly adventure. "}` +
      `Language of "text": ${lang}. ${audienceOf(req.band).style} ` +
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
