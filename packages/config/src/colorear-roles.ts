/**
 * Colorear closed roles. The buyer picks one per photo with buttons (no free text, except the short optional
 * description of "other"). Photo 1 is always the protagonist (girl or boy); photos 2 to 5 are relatives, friends or pets.
 * Pure data and pure functions: safe to import from the browser form and from the generate engine.
 */
export const PROTAGONIST_ROLE_IDS = ["protagonist_girl", "protagonist_boy"] as const;
/** Roles offered for photos 2 to 5, in the order the chips are shown. */
export const COMPANION_ROLE_IDS = [
  "mom", "dad", "brother", "sister", "grandpa", "grandma", "uncle", "aunt",
  "cousin_m", "cousin_f", "friend_m", "friend_f", "dog", "cat", "other_pet", "other",
] as const;
export const COLOREAR_ROLE_IDS = [...PROTAGONIST_ROLE_IDS, ...COMPANION_ROLE_IDS] as const;
export type ColorearRoleId = (typeof COLOREAR_ROLE_IDS)[number];
export type RoleLang = "es" | "en";

/** Max length of the optional description of "other". */
export const ROLE_OTHER_MAX = 30;

export const isRoleId = (v: unknown): v is ColorearRoleId => typeof v === "string" && (COLOREAR_ROLE_IDS as readonly string[]).includes(v);
export const isProtagonistRole = (v: unknown): boolean => typeof v === "string" && (PROTAGONIST_ROLE_IDS as readonly string[]).includes(v);

interface RoleDef {
  /** Button label (es, en). Cousin and friend share one English word for both genders. */
  chip: [string, string];
  /** Label used inside the story ("la abuela", "grandma"). */
  story: [string, string];
  /** English descriptor for image and story prompts. `{age}` is replaced by the child's age. */
  prompt: string;
}

const ROLES: Record<ColorearRoleId, RoleDef> = {
  protagonist_girl: { chip: ["Niña", "Girl"], story: ["la niña", "the girl"], prompt: "a girl, about {age} years old" },
  protagonist_boy: { chip: ["Niño", "Boy"], story: ["el niño", "the boy"], prompt: "a boy, about {age} years old" },
  mom: { chip: ["Mamá", "Mom"], story: ["mamá", "mom"], prompt: "the child's mother, an adult woman" },
  dad: { chip: ["Papá", "Dad"], story: ["papá", "dad"], prompt: "the child's father, an adult man" },
  brother: { chip: ["Hermano", "Brother"], story: ["el hermano", "the brother"], prompt: "the child's brother, a boy" },
  sister: { chip: ["Hermana", "Sister"], story: ["la hermana", "the sister"], prompt: "the child's sister, a girl" },
  grandpa: { chip: ["Abuelo", "Grandpa"], story: ["el abuelo", "grandpa"], prompt: "the child's grandfather, an older man" },
  grandma: { chip: ["Abuela", "Grandma"], story: ["la abuela", "grandma"], prompt: "the child's grandmother, an older woman" },
  uncle: { chip: ["Tío", "Uncle"], story: ["el tío", "the uncle"], prompt: "the child's uncle, an adult man" },
  aunt: { chip: ["Tía", "Aunt"], story: ["la tía", "the aunt"], prompt: "the child's aunt, an adult woman" },
  cousin_m: { chip: ["Primo", "Cousin"], story: ["el primo", "the cousin"], prompt: "the child's male cousin, a boy" },
  cousin_f: { chip: ["Prima", "Cousin"], story: ["la prima", "the cousin"], prompt: "the child's female cousin, a girl" },
  friend_m: { chip: ["Amigo", "Friend"], story: ["el amigo", "the friend"], prompt: "the child's friend, a boy" },
  friend_f: { chip: ["Amiga", "Friend"], story: ["la amiga", "the friend"], prompt: "the child's friend, a girl" },
  dog: { chip: ["Perro", "Dog"], story: ["el perro", "the dog"], prompt: "the family dog" },
  cat: { chip: ["Gato", "Cat"], story: ["el gato", "the cat"], prompt: "the family cat" },
  other_pet: { chip: ["Otra mascota", "Other pet"], story: ["la mascota", "the pet"], prompt: "the family's pet" },
  other: { chip: ["Otro", "Other"], story: ["la persona", "the person"], prompt: "a person" },
};

export const roleChipLabel = (id: ColorearRoleId, lang: RoleLang): string => ROLES[id].chip[lang === "es" ? 0 : 1];

/**
 * English descriptor for prompts, e.g. protagonist_girl at 6 -> "a girl, about 6 years old", grandpa -> "the child's grandfather, an older man".
 * `other` uses the already sanitized free text when present, otherwise the generic "a person".
 */
export function roleDescriptor(id: ColorearRoleId, age: number, otherText = ""): string {
  if (id === "other" && otherText.trim()) return `a person described by the buyer as: ${otherText.trim()}`;
  return ROLES[id].prompt.replace("{age}", String(age));
}

/** Localized label used for the people in the story ("la abuela", "grandma"). For `other` with text the text itself; without it "la persona"/"the person". */
export function roleStoryLabel(id: ColorearRoleId, lang: RoleLang, otherText = ""): string {
  if (id === "other" && otherText.trim()) return otherText.trim();
  return ROLES[id].story[lang === "es" ? 0 : 1];
}
