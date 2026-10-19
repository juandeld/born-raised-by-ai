/**
 * Brand and legal placeholders. Real values arrive with the accounts (docs/arquitectura/pendientes-cuentas.md).
 * Nothing secret here: secrets come from environment variables only.
 */
export interface BrandConfig {
  brand: string;
  holder: string;
  privacyEmail: string;
  supportEmail: string;
  domain: string;
  spokenDomain: string;
}

export function brandConfig(env: Record<string, string | undefined> = process.env): BrandConfig {
  return {
    brand: env.BRAND_NAME ?? "Lumen Labs",
    holder: env.LEGAL_HOLDER ?? "[TITULAR PENDIENTE]",
    privacyEmail: env.PRIVACY_EMAIL ?? "privacidad@lumen-labs.co",
    supportEmail: env.SUPPORT_EMAIL ?? "soporte@lumen-labs.co",
    domain: env.PUBLIC_BASE_URL ?? "https://lumen-labs.co",
    spokenDomain: env.SPOKEN_DOMAIN ?? "lumen guion labs punto co",
  };
}

export function maxConcurrency(env: Record<string, string | undefined> = process.env): number {
  const n = Number(env.CALLS_MAX_CONCURRENCY ?? 20);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 20;
}
