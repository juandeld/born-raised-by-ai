import type { AgeBand } from "@lumen/config";

/**
 * Prompts of the image model. The people's NAMES never appear here: characters are identified by the reference image
 * ("character 1"). Free text of the buyer never reaches the model unfiltered: roles and theme pass the sanitizer, and the
 * scene descriptions are validated (story.ts) before use.
 */
const AGE_RULES: Record<AgeBand, string> = {
  "3-4": "Very thick, bold outlines. Very simple big shapes. Few elements, no small details, no tiny areas, almost no background.",
  "5-6": "Thick bold outlines. Simple shapes. A few simple background elements. Very few small details.",
  "7-8": "Medium-thick clean outlines. A richer scene with more background elements (clouds, plants, bricks, patterns on clothes), simple repeating patterns and medium-sized areas that suit colored pencils. No dense or intricate detail.",
  "9-12": "Medium-fine clean outlines. A rich, detailed scene full of background elements, textures and decorative patterns (clothes, plants, bricks, clouds, waves), with many medium and small areas for colored pencils. Characters stay clear and easy to recognize.",
  adult: "Relaxing mandala-style coloring page for adults. Very detailed, with fine, clean, even black lines. The characters stay clearly recognizable, while the background and the clothes are filled with mandala and zentangle patterns: flowers, leaves, ornaments, geometric and repeating motifs. Many small and medium areas for colored pencils or fine markers.",
};

/**
 * Said in every scene and cover prompt: the model must not invent people (seen in production: two extra kids on a cover with one person).
 * Only the people the buyer uploaded are drawn. Animals, pets and non-human story characters are fine. The story writer is told the same
 * (story.ts): helpers and friends are never other people.
 */
export const NO_EXTRA_PEOPLE =
  "Draw ONLY the characters of this book (those of the reference images, or the ones described in the scene). Never add any other person, child, adult or human figure: no extra kids, crowds, passers-by or bystanders, not even small or in the background. Animals, pets and non-human story characters (creatures, fairies, mermaids, robots, aliens) are allowed.";

/**
 * The only place where the word "glasses" may appear in any prompt, and only to forbid them. Naming them as something to keep made the
 * model add them to faces that had none (seen in production, 25-oct-2026), so no prompt lists them as an example of a feature to keep.
 */
export const NO_GLASSES_RULE = "If the person does not wear glasses in the photos, never draw glasses.";

/** Opening of every prompt: the line-art rules are the same for everybody, the audience and the friendliness are not. */
function styleFor(band: AgeBand, character = false): string {
  const adult = band === "adult";
  return (
    (adult ? "Adult relaxation coloring book page. " : "Children's coloring book page. ") +
    "Black and white line art only: " + (adult ? "fine, clean, even black lines" : "smooth bold black outlines") + " on a pure white background. " +
    (adult
      ? "Elegant, calm illustration style with closed outlines. "
      : character
        // A character that must look like a real person: no "friendly rounded cartoon" wording, which produced one generic face for everybody.
        ? "Cartoon line-art style with clean closed outlines and large open white areas easy to color with crayons; the face keeps its real shapes and proportions instead of generic rounded cartoon features. "
        : "Friendly cheerful cartoon style with rounded shapes and closed outlines, with large open white areas easy to color with crayons. ") +
    "Strict rules: absolutely no text, letters, numbers or words; no watermark or signature; no shading, no gray, no gradients, no filled black areas, no color, no cross-hatching; " +
    "no border or frame; not photorealistic; original characters only, never any licensed, trademarked or famous cartoon character, logo or brand. " +
    (adult ? "Nothing scary, violent or inappropriate." : "Nothing scary, violent or inappropriate for young children.")
  );
}

/** Body and face proportions of a child of this age, so a 4-year-old is not drawn with a 10-year-old's face. */
function childLook(years: number): string {
  if (years <= 4) return "a soft round face with full cheeks, a small nose, short arms and legs, small hands and feet";
  if (years <= 7) return "a round face a little longer than a toddler's, slim arms and legs";
  return "a longer, narrower face with more defined features, and long limbs";
}

/**
 * Character drawn from the buyer's photos (the step that decides whether the book works: if the character does not look like the child,
 * nothing else matters). `ageYears` is the approximate age of the protagonist (the age behind the level the buyer chose), when known.
 *
 * Legal condition 2 (docs/proveedores/openai.md): a cartoon that is clearly recognizable by its distinctive features, always simple line
 * art, "never a photorealistic or identical copy". The words identical, exact, faithful, portrait and lifelike stay out of this prompt
 * except inside that sentence (tests/colorear-photos.test.ts).
 */
export function buildCharacterPrompt(role: string, band: AgeBand, photos = 1, ageYears?: number): string {
  const several = photos > 1;
  const sources = several
    ? `The ${photos} reference photos all show the SAME person or pet, from different angles and moments: use them together to understand the face and the hair from every side, and keep what repeats in most of them. `
    : "";
  const age =
    ageYears !== undefined && Number.isFinite(ageYears) && band !== "adult"
      ? `The person is about ${Math.round(ageYears)} years old: give the face and the body the natural proportions of a real ${Math.round(ageYears)}-year-old child (${childLook(ageYears)}), not exaggerated. `
      : "";
  return (
    `Turn the main person or pet in the reference photo${several ? "s" : ""} into a cartoon character for a children's coloring book, clearly recognizable as them by their distinctive features, always as simple line art. ${sources}` +
    `Draw ONE cartoon character, never several, and never a photorealistic or identical copy. ` +
    `${styleFor(band, true)} ` +
    `Likeness is the priority: the family must recognize them at first sight. Match what the photos show, in this order of importance. ` +
    `1) The hairstyle: the same hairline, the same way the fringe or bangs fall (straight across, side-swept, parted, curtain), the same length and volume, the same texture (straight, wavy, curly). ` +
    `2) The face: the face shape, the eyes (shape, size and spacing), the eyebrows, the nose, the mouth and the way they smile, the ears. ${age}` +
    `Keep the stylization light: clean, slightly simplified line art that keeps the real proportions and features of the face. Not chibi, not a generic big-head cartoon face, not photorealistic. ` +
    `Accessories: draw only the ones clearly visible in the photos${several ? " (in most of them)" : ""}. ${NO_GLASSES_RULE} Never add a hat, jewelry or any other accessory that the photos do not show. ` +
    `Clothing: draw it as simple clean shapes (collar, sleeves, pockets, hood, shoes) with NO logos, emblems, letters, numbers, words or brand marks, even if the clothes in the photos have them: leave that area plain. ` +
    `If it is an animal, draw it as that animal (sitting or standing on four legs, no clothes, no human body), keeping the breed, the shape of the head and muzzle, the ears, the tail and the marking patterns drawn as outlines; a collar only if it is clearly visible. ` +
    `Show the whole character from head to toe, filling the square frame so the face stays large and clear, standing in a relaxed pose facing the viewer, centered, with the natural friendly expression of the photos. Completely plain white background: no ground line, no clouds, no flowers, no props, nothing except the character. Do not copy the photo background. ` +
    `Kind and flattering, never ugly or mocking. Description of who it is: ${role}. ${AGE_RULES[band]}`
  );
}

/** Used when the provider refuses the photo: the character is drawn from the description alone. */
export function buildCharacterFromTextPrompt(role: string, band: AgeBand): string {
  return `${styleFor(band)} A friendly cartoon character for a coloring book: ${role}. ONE character only, full body, in a relaxed happy pose, facing the viewer, centered, on a completely plain white background with nothing else. Simple clothes with no logos, letters, numbers or brand marks, and no accessories. If it is an animal, draw it as that animal, not as a human. ${AGE_RULES[band]}`;
}

/** What every scene and cover prompt says about the look of the characters, so each one stays the same person from page to page. */
function lookRules(count: number): string {
  return count > 0
    ? `Keep each face, hairstyle, clothing and proportions exactly the same as in its reference, without redesigning anyone, in the same line style. Do not add any accessory, logo, letter or number that the reference does not show (only the props the scene asks for, such as a backpack or a map). `
    : "";
}

export function buildScenePrompt(visual: string, band: AgeBand, count: number): string {
  const consistency =
    count > 0
      ? `The reference images are the cartoon characters of this book (character 1${count > 1 ? ` to ${count}, in order` : ""}). Draw them in the scene. ${lookRules(count)}`
      : "";
  return `${styleFor(band)} ${consistency}${AGE_RULES[band]} Pets and animals stay animals: on four legs, with no clothes, never standing or dressed like a person. ${NO_EXTRA_PEOPLE} Composition: the characters and the action are the clear focus, filling most of the page, with white margins. Leave the bottom 15% of the page empty white (a caption is added there later). Scene: ${visual}`;
}

export function buildCoverPrompt(visual: string, band: AgeBand, count: number): string {
  return (
    `${styleFor(band)} The reference images are the cartoon characters of this book (character 1${count > 1 ? ` to ${count}, in order` : ""}). Draw all of them together happily. ${lookRules(count)}` +
    `Pets and animals stay animals: on four legs, with no clothes or backpacks, never standing or dressed like a person. ${NO_EXTRA_PEOPLE} ` +
    `${AGE_RULES[band]} This is the book cover: leave the top 25% of the page completely empty white (the title is added there later) and draw the scene in the lower 70%, with the characters large and filling the width. Scene: ${visual}`
  );
}

/**
 * Words that must never appear in a prompt (brands and characters); checked over story output and every subject bank.
 * Each entry is matched as a whole word or phrase (see `mentionsBrand`), so it must be written the way people write it.
 * The last group are brand names that are usually typed as ONE word: a whole-word match would not see them inside "disney" or
 * "mario" any more, which the old substring match did, so they are listed by themselves.
 */
export const BRAND_BLOCKLIST = [
  "disney", "pixar", "marvel", "dc comics", "pokemon", "pokémon", "pikachu", "mickey", "minnie", "frozen", "elsa", "bluey", "peppa", "paw patrol",
  "spider-man", "spiderman", "batman", "superman", "minecraft", "mario", "sonic", "hello kitty", "barbie", "lego", "roblox", "fortnite", "naruto",
  "dora", "cocomelon", "baby shark", "transformers", "hot wheels", "thomas the", "coca-cola", "nike", "adidas", "ferrari", "lamborghini", "harry potter",
  "star wars", "stitch", "winnie", "simpson", "sponge", "patrulla canina", "gabby", "hulk", "iron man", "pepa pig",
  "disneyland", "disneyworld", "legoland", "spongebob", "peppapig", "mickeymouse", "minniemouse", "supermario", "mariokart", "mariobros", "doraemon",
  "pokemongo", "winniethepooh",
];

/**
 * Lowercase, without accents, and every run of spaces and punctuation as ONE space, so "Pokémon", "POKEMON", "Spider-Man" and
 * "spider man" compare equal and a word is always surrounded by spaces (or the ends of the text).
 */
function foldForMatch(text: string): string {
  return text.normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One pattern per entry: the whole word or phrase, optionally in the plural ("legos", "pokemones", "simpsons"). Never inside another word. */
const BRAND_PATTERNS: RegExp[] = [...new Set(BRAND_BLOCKLIST.map(foldForMatch))].map((w) => new RegExp(`(?:^| )${escapeRegExp(w)}(?:e?s)?(?: |$)`, "u"));

/**
 * Does the text name a brand or a licensed character? Compares WHOLE words and phrases, ignoring case and accents: "Mario", "dora" and "lego"
 * alone are caught, "armario", "exploradora", "voladora" or "llegó" are not (a substring match blocked every Spanish word ending in -dora).
 */
export function mentionsBrand(text: string): boolean {
  const t = foldForMatch(text);
  return t.length > 0 && BRAND_PATTERNS.some((re) => re.test(t));
}
