import { brandConfig, colorearBrandName as configBrandName, colorearSupportEmail } from "@lumen/config";

/** Variables for the legal texts. Same mapping as the engine uses when it stores the consent. */
export function legalVars(): Record<string, string> {
  const b = brandConfig();
  return { MARCA: b.brand, TITULAR: b.holder, EMAIL_PRIVACIDAD: b.privacyEmail, EMAIL_SOPORTE: b.supportEmail, DOMINIO: b.domain };
}

/**
 * Legal texts may not go live with a placeholder (docs/legal/textos/00-leeme.md section 2). On the live deployment the
 * checkout stays closed until LEGAL_HOLDER is set.
 */
export function legalReady(env: Record<string, string | undefined> = process.env): boolean {
  if (env.VERCEL_ENV !== "production") return true;
  const b = brandConfig(env);
  return !b.holder.includes("[") && !!env.LEGAL_HOLDER && !!env.LEGAL_ADDRESS && !!env.LEGAL_EFFECTIVE_DATE;
}

/** Extra variables for the long documents (privacy policy, terms). */
export function documentVars(price: string): Record<string, string> {
  return { ...legalVars(), DOMICILIO: process.env.LEGAL_ADDRESS ?? "[DOMICILIO PENDIENTE]", FECHA_VIGENCIA: process.env.LEGAL_EFFECTIVE_DATE ?? "[FECHA PENDIENTE]", PRECIO: price };
}

/**
 * Colorear is sold as Pintoria, never under the Santa/Jinglo brand: {{MARCA}} in every colorear text (notice, privacy, terms, emails, PDF)
 * is COLOREAR_BRAND_NAME (default "Pintoria") and {{EMAIL_SOPORTE}} is COLOREAR_SUPPORT_EMAIL (default soporte@pintoria.app). The generate
 * engine builds its legal variables the same way (colorearBrandConfig), so the consent text the buyer sees is byte-identical to the one stored
 * as evidence.
 */
export function colorearBrandName(env: Record<string, string | undefined> = process.env): string {
  return configBrandName(env);
}

export function colorearLegalVars(env: Record<string, string | undefined> = process.env): Record<string, string> {
  return { ...legalVars(), MARCA: colorearBrandName(env), EMAIL_SOPORTE: colorearSupportEmail(env) };
}

export function colorearDocumentVars(price: string): Record<string, string> {
  return { ...documentVars(price), MARCA: colorearBrandName(), EMAIL_SOPORTE: colorearSupportEmail() };
}
