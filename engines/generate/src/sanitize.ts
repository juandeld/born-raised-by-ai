import { sanitizeOptionalField, type SanitizeResult } from "@lumen/calls";
import { ROLE_OTHER_MAX, isProtagonistRole, isRoleId, roleDescriptor, roleStoryLabel, type ColorearRoleId, type RoleLang } from "@lumen/config";
import { mentionsBrand } from "./prompt";
import type { PersonInput, PersonSubmission } from "./types";

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

export type RoleResult = { ok: true; value: Pick<PersonInput, "role" | "roleId" | "roleText"> } | { ok: false; reason: string };

/**
 * Turns what the form sent for one person into the stored role. `index` is the photo position (0 = photo 1).
 * Closed roles: `roleId` must belong to the list; photo 1 must be the protagonist and photos 2+ must not be; the free text only exists for
 * "other" (<= 30 characters, same sanitizer and brand filter as every free text); empty "other" becomes a generic "person".
 * Old clients (no `roleId`): the free-text `role` is accepted as before (<= 40 characters, sanitized).
 */
export function resolvePersonRole(p: PersonSubmission, index: number, age: number): RoleResult {
  if (p.roleId === undefined || p.roleId === "") {
    const r = sanitizeShortText(p.role, 40);
    return r.ok ? { ok: true, value: { role: r.value } } : { ok: false, reason: r.reason };
  }
  if (!isRoleId(p.roleId)) return { ok: false, reason: "unknown_role" };
  if (isProtagonistRole(p.roleId) !== (index === 0)) return { ok: false, reason: index === 0 ? "protagonist_required" : "protagonist_only_first" };
  let roleText = "";
  if (p.roleId === "other" && p.roleText && p.roleText.trim()) {
    const t = sanitizeShortText(p.roleText, ROLE_OTHER_MAX);
    if (!t.ok) return { ok: false, reason: t.reason };
    roleText = t.value;
  }
  return { ok: true, value: { role: roleDescriptor(p.roleId, age, roleText), roleId: p.roleId, ...(roleText ? { roleText } : {}) } };
}

/** Localized label of each person for the story ("la abuela", "grandma"). Orders saved with free text keep that text. */
export function storyLabelsOf(persons: PersonInput[], lang: RoleLang): string[] {
  return persons.map((p) => (p.roleId && isRoleId(p.roleId) ? roleStoryLabel(p.roleId as ColorearRoleId, lang, p.roleText ?? "") : p.role));
}
