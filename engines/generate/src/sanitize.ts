import { sanitizeOptionalField, type SanitizeResult } from "@lumen/calls";
import { mentionsBrand } from "./prompt";

/** Name of a person or pet printed in the book: 1 to 3 words, Latin letters only (the PDF font is WinAnsi), <= 24 characters. */
export function sanitizePersonName(raw: string | null | undefined): SanitizeResult {
  const value = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!value) return { ok: false, reason: "empty" };
  if (value.length > 24) return { ok: false, reason: "too_long" };
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’-]*( [A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’-]*){0,2}$/.test(value)) return { ok: false, reason: "invalid_chars" };
  const generic = sanitizeOptionalField(value);
  if (!generic.ok) return generic;
  if (mentionsBrand(value)) return { ok: false, reason: "invalid_chars" };
  return { ok: true, value };
}

/** Short role/description of a person ("niña, 6 años", "perro") and the optional adventure theme: <= 40 characters, no brands. */
export function sanitizeShortText(raw: string | null | undefined, max = 40): SanitizeResult {
  const r = sanitizeOptionalField(raw);
  if (!r.ok) return r;
  if (r.value.length > max) return { ok: false, reason: "too_long" };
  if (mentionsBrand(r.value)) return { ok: false, reason: "invalid_chars" };
  return r;
}
