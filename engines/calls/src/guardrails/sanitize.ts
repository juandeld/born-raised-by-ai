/**
 * Sanitizer for the optional free-text fields and the child's name (guardrails A-05, A-06; test T-14).
 * Runs before checkout, so a rejected field never reaches the order or the prompt.
 * Heuristic, not perfect: it reduces risk, it does not eliminate it. The prompt also treats the text as data.
 */
export type SanitizeResult = { ok: true; value: string } | { ok: false; reason: SanitizeReason };
export type SanitizeReason = "too_long" | "phone" | "email" | "url" | "address" | "surname" | "profanity" | "injection" | "empty" | "invalid_chars" | "digits";

export const MAX_FIELD_LENGTH = 140;

const PROFANITY = [
  "mierda", "puta", "puto", "pendejo", "pendeja", "cabron", "cabrón", "verga", "coño", "joder", "culo", "chingar", "chingada", "marica", "carajo",
  "fuck", "shit", "bitch", "asshole", "dick", "cunt", "bastard", "pussy", "nigger", "fag",
];

const INJECTION = [
  /ignor[ae]\w*\s+(todas?\s+)?(las\s+|tus\s+|mis\s+)?(instrucciones|reglas|indicaciones)/i,
  /olvid[ae]\w*\s+(todo|las\s+instrucciones|tus\s+reglas)/i,
  /ignore\s+(all\s+|any\s+|the\s+|your\s+|previous\s+)*(instructions|rules|prompt)/i,
  /forget\s+(everything|your\s+instructions|the\s+rules)/i,
  /(system|developer)\s*prompt/i,
  /\bprompt\b/i,
  /ahora\s+(eres|serás|seras)/i,
  /you\s+are\s+now/i,
  /act\s+as\b/i,
  /(repite|repeat)\s+(lo\s+que|what|after|todo|everything)/i,
  /\bdi\s+(la\s+palabra|que|una\s+grosería)/i,
  /\bsay\s+(the\s+word|a\s+swear|something\s+rude)/i,
  /(nuevas?|new)\s+(instrucciones|instructions)/i,
  /\bjailbreak\b/i,
  /[<>{}`]|«|»|\[\/?inst\]|###/i,
];

const ADDRESS_WORDS = /\b(calle|avenida|av\.|colonia|col\.|fraccionamiento|barrio|zona\s+\d|urbanizaci[oó]n|carrera|blvd|boulevard|street|st\.|avenue|ave\.|road|rd\.|apt\.?|apartment|suite|piso\s+\d|c\/|c\.p\.|cp\s*\d|zip\s*code|postcode)\b/i;
const SURNAME_PHRASES = /\b(apellido|se\s+apellida|me\s+apellido|surname|last\s+name|family\s+name|apellidos)\b/i;
const URL_LIKE = /(https?:\/\/|www\.|\b[\w-]+\.(com|net|org|co|es|mx|io|app|me|ly|gt|uk|us|tv|info|xyz)\b|@\w)/i;
const EMAIL_LIKE = /[\w.+-]+@[\w-]+(\.[\w-]+)+/;

function hasPhoneNumber(text: string): boolean {
  // 7 or more digits, allowing separators between them.
  const compact = text.replace(/(?<=\d)[\s().\-+](?=\d)/g, "");
  return /\d{7,}/.test(compact);
}

function containsProfanity(text: string): boolean {
  const norm = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return PROFANITY.some((w) => {
    const nw = w.normalize("NFD").replace(/[̀-ͯ]/g, "");
    return new RegExp(`(^|[^a-z])${nw}[a-z]{0,3}($|[^a-z])`).test(norm);
  });
}

export function sanitizeOptionalField(raw: string | null | undefined): SanitizeResult {
  if (raw === null || raw === undefined) return { ok: false, reason: "empty" };
  // Normalize: strip control chars, collapse whitespace.
  const value = raw.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (!value) return { ok: false, reason: "empty" };
  if (value.length > MAX_FIELD_LENGTH) return { ok: false, reason: "too_long" };
  if (EMAIL_LIKE.test(value)) return { ok: false, reason: "email" };
  if (hasPhoneNumber(value)) return { ok: false, reason: "phone" };
  if (URL_LIKE.test(value)) return { ok: false, reason: "url" };
  if (ADDRESS_WORDS.test(value)) return { ok: false, reason: "address" };
  if (SURNAME_PHRASES.test(value)) return { ok: false, reason: "surname" };
  if (containsProfanity(value)) return { ok: false, reason: "profanity" };
  if (INJECTION.some((re) => re.test(value))) return { ok: false, reason: "injection" };
  return { ok: true, value };
}

/** Child's first name: 1 or 2 words, letters only, <= 30 chars. Never a surname field. */
export function sanitizeChildName(raw: string | null | undefined): SanitizeResult {
  const value = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!value) return { ok: false, reason: "empty" };
  if (value.length > 30) return { ok: false, reason: "too_long" };
  if (/\d/.test(value)) return { ok: false, reason: "digits" };
  if (!/^[\p{L}][\p{L}'’-]*( [\p{L}][\p{L}'’-]*)?$/u.test(value)) return { ok: false, reason: "invalid_chars" };
  if (containsProfanity(value)) return { ok: false, reason: "profanity" };
  if (INJECTION.some((re) => re.test(value))) return { ok: false, reason: "injection" };
  return { ok: true, value };
}

export function sanitizeChildAge(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined || raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 17) return null;
  return n;
}

/**
 * The only data that may reach the model (A-05): first name, age if given, sanitized optional data and the
 * character. Never email, phone, country, amount or order id.
 */
export interface AgentVariables {
  child_first_name: string;
  child_age: string;
  details: string;
  character: string;
  language: string;
}

export const AGENT_VARIABLE_NAMES: ReadonlyArray<keyof AgentVariables> = ["child_first_name", "child_age", "details", "character", "language"];

export function buildAgentVariables(input: { childFirstName: string; childAge: number | null; details: string | null; character: string; language: string }): AgentVariables {
  return {
    child_first_name: input.childFirstName,
    child_age: input.childAge ? String(input.childAge) : "",
    details: input.details ?? "",
    character: input.character,
    language: input.language,
  };
}

/** Defensive check used by every VoiceProvider right before sending variables out. */
export function assertAgentVariables(vars: Record<string, string>): void {
  for (const key of Object.keys(vars)) {
    if (!(AGENT_VARIABLE_NAMES as readonly string[]).includes(key)) {
      throw new Error(`Variable "${key}" is not allowed in the agent payload (guardrail A-05)`);
    }
  }
  const joined = Object.values(vars).join(" ");
  if (EMAIL_LIKE.test(joined) || hasPhoneNumber(joined)) {
    throw new Error("Agent payload contains an email or phone number (guardrail A-05)");
  }
}
