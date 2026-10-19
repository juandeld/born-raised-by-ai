/**
 * Which ElevenLabs agent answers an order. Keys are text locales (es-419, es-ES, en-US, en-GB) plus the legacy "en".
 * Fallback chain: exact locale, then the closest agent, then es-419 so a call is never dropped for a missing agent.
 */
const CHAIN: Record<string, string[]> = {
  "es-419": ["es-419"],
  "es-ES": ["es-ES", "es-419"],
  "en-US": ["en-US", "en"],
  "en-GB": ["en-GB", "en-US", "en"],
};

export function pickAgentId(ids: Record<string, string>, locale: string | undefined, language: string): string {
  const chain = [...(locale && CHAIN[locale] ? CHAIN[locale]! : []), language, ...(language === "en" ? ["en-US"] : []), "es-419"];
  for (const key of chain) if (ids[key]) return ids[key]!;
  return "";
}
