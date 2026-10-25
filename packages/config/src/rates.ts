import type { CountryCode } from "./pricing";

/**
 * Unit rates used by `npm run costs`. Source: docs/investigacion/santa.md section 4.1.
 * Values marked [EST] are estimates, not verified in production.
 */
export interface CostRates {
  /** ElevenLabs Agents, USD per agent minute (all plans). */
  elevenlabsPerMin: number;
  /** ElevenLabs burst (above plan concurrency), USD per minute. */
  elevenlabsBurstPerMin: number;
  /** Outbound mobile telephony per minute by destination country (Twilio). */
  twilioPerMin: Record<CountryCode, number>;
  /** Twilio recording, per minute of recording. */
  twilioRecordingPerMin: number;
  /** LLM inside the agent, USD per conversation minute [EST]. Claude Haiku 4.5 reference. */
  llmPerMin: number;
  /** Polar Starter: percentage + fixed USD, plus surcharge for non-US cards. */
  polar: { pct: number; fixedUsd: number; intlPct: number };
  /** Recurrente commercial: percentage + fixed USD. */
  recurrente: { pct: number; fixedUsd: number };
  /** PDF + email + storage per delivered order [EST]. */
  infraPerOrderUsd: number;
}

export const COST_RATES: CostRates = {
  elevenlabsPerMin: 0.08,
  elevenlabsBurstPerMin: 0.16,
  // GT: placeholder equal to MX [no verificado]; Santa is not sold in Guatemala (only the type needs the key).
  twilioPerMin: { US: 0.014, MX: 0.0473, GB: 0.0305, ES: 0.18, GT: 0.0473 },
  twilioRecordingPerMin: 0.0025,
  llmPerMin: 0.0086,
  polar: { pct: 0.05, fixedUsd: 0.5, intlPct: 0.015 },
  recurrente: { pct: 0.045, fixedUsd: 0.25 },
  infraPerOrderUsd: 0.01,
};

/** Expected variable cost per order, used to compare against real cost (`npm run costs`). */
export const EXPECTED_VARIABLE_COST_USD: Record<CountryCode, { min: number; max: number }> = {
  US: { min: 0.51, max: 0.63 },
  MX: { min: 0.69, max: 0.81 },
  GB: { min: 0.6, max: 0.72 },
  ES: { min: 1.42, max: 1.54 },
  GT: { min: 0.69, max: 0.81 }, // placeholder equal to MX; Santa is not sold in Guatemala
};
