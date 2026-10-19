import { createHash } from "node:crypto";

/** Replaces {{VAR}} placeholders. Missing variables are left in place so tests and CI can catch them. */
export function fill(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{([A-Z_ÑÁÉÍÓÚ]+)\}\}/gu, (m, k: string) => (k in vars ? vars[k]! : m));
}

export function hasUnfilledPlaceholders(text: string): boolean {
  return /\{\{[^}]+\}\}/.test(text);
}

export function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}
