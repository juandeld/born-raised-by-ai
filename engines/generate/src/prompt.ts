import type { AgeBand } from "@lumen/config";

/**
 * Prompts of the image model. The people's NAMES never appear here: characters are identified by the reference image
 * ("character 1"). Free text of the buyer never reaches the model unfiltered: roles and theme pass the sanitizer, and the
 * scene descriptions are validated (story.ts) before use.
 */
const AGE_RULES: Record<AgeBand, string> = {
  "3-4": "Very thick, bold outlines. Very simple big shapes. Few elements, no small details, no tiny areas, almost no background.",
  "5-6": "Thick bold outlines. Simple shapes. A few simple background elements. Very few small details.",
  "7-8": "Medium-thick clean outlines. A richer scene with some details, but every area still large enough to color with a crayon. No dense or intricate detail.",
};

const STYLE =
  "Children's coloring book page. Black and white line art only: smooth bold black outlines on a pure white background. " +
  "Friendly cheerful cartoon style with rounded shapes and closed outlines, with large open white areas easy to color with crayons. " +
  "Strict rules: absolutely no text, letters, numbers or words; no watermark or signature; no shading, no gray, no gradients, no filled black areas, no color, no cross-hatching; " +
  "no border or frame; not photorealistic; original characters only, never any licensed, trademarked or famous cartoon character, logo or brand. " +
  "Nothing scary, violent or inappropriate for young children.";

export function buildCharacterPrompt(role: string, band: AgeBand, photos = 1): string {
  const several =
    photos > 1
      ? `The ${photos} reference photos all show the SAME person or pet, from different angles and moments: use them together to understand their recognizable features (face shape, hair, glasses, markings). Draw ONE cartoon character, never several, and never a photorealistic or identical copy. `
      : "";
  return (
    `Turn the main person or pet in the reference photo${photos > 1 ? "s" : ""} into a friendly cartoon character for a children's coloring book. ${several}` +
    `${STYLE} Draw ONE character only, full body, in a relaxed happy pose, facing the viewer, centered. Completely plain white background: no ground line, no clouds, no flowers, no props, nothing except the character. If it is a person, standing and dressed like in the photo. If it is an animal, draw it as that animal (sitting or standing on four legs, no clothes, no human body). ` +
    `Keep the features that make them recognizable: hairstyle and hair length, glasses, beard or mustache, freckles, typical clothing shapes, and for animals the breed, ear shape and marking patterns drawn as outlines. ` +
    `A kind, flattering caricature; never ugly or mocking. Do not copy the photo background. Description of who it is: ${role}. ${AGE_RULES[band]}`
  );
}

/** Used when the provider refuses the photo: the character is drawn from the description alone. */
export function buildCharacterFromTextPrompt(role: string, band: AgeBand): string {
  return `${STYLE} A friendly cartoon character for a children's coloring book: ${role}. ONE character only, full body, in a relaxed happy pose, facing the viewer, centered, on a completely plain white background with nothing else. If it is an animal, draw it as that animal, not as a human. ${AGE_RULES[band]}`;
}

export function buildScenePrompt(visual: string, band: AgeBand, count: number): string {
  const consistency =
    count > 0
      ? `The reference images are the cartoon characters of this book (character 1${count > 1 ? ` to ${count}, in order` : ""}). Draw them in the scene keeping each face, hairstyle and clothing exactly the same as in its reference, in the same line style. `
      : "";
  return `${STYLE} ${consistency}${AGE_RULES[band]} Pets and animals stay animals: on four legs, with no clothes, never standing or dressed like a person. Composition: the characters and the action are the clear focus, filling most of the page, with white margins. Leave the bottom 15% of the page empty white (a caption is added there later). Scene: ${visual}`;
}

export function buildCoverPrompt(visual: string, band: AgeBand, count: number): string {
  return (
    `${STYLE} The reference images are the cartoon characters of this book (character 1${count > 1 ? ` to ${count}, in order` : ""}). Draw all of them together happily, keeping each face, hairstyle and clothing exactly as in its reference. ` +
    `Pets and animals stay animals: on four legs, with no clothes or backpacks, never standing or dressed like a person. ` +
    `${AGE_RULES[band]} This is the book cover: leave the top 25% of the page completely empty white (the title is added there later) and draw the scene in the lower 70%, with the characters large and filling the width. Scene: ${visual}`
  );
}

/** Words that must never appear in a prompt (brands and characters); checked over story output and every subject bank. */
export const BRAND_BLOCKLIST = [
  "disney", "pixar", "marvel", "dc comics", "pokemon", "pokémon", "pikachu", "mickey", "minnie", "frozen", "elsa", "bluey", "peppa", "paw patrol",
  "spider-man", "spiderman", "batman", "superman", "minecraft", "mario", "sonic", "hello kitty", "barbie", "lego", "roblox", "fortnite", "naruto",
  "dora", "cocomelon", "baby shark", "transformers", "hot wheels", "thomas the", "coca-cola", "nike", "adidas", "ferrari", "lamborghini", "harry potter",
  "star wars", "stitch", "winnie", "simpson", "sponge", "patrulla canina", "gabby", "hulk", "iron man", "pepa pig",
];

export function mentionsBrand(text: string): boolean {
  const t = text.toLowerCase();
  return BRAND_BLOCKLIST.some((b) => t.includes(b));
}
