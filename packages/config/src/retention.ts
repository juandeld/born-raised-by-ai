/** Retention periods approved in docs/decisiones.md (D8) and docs/legal/textos. */
export const RETENTION_DAYS = {
  /** Order personal data (email, phone, child name, details): 30 days after delivery. */
  order: 30,
  /** Call recordings and transcripts, including provider copies (A-10). */
  recording: 30,
  /** Photos (generate engine, colorear). */
  photos: 7,
  /** Consent records: 4 years. */
  consent: 4 * 365,
  /** Delivery log (no content): 13 months. */
  deliveryLog: 13 * 30,
} as const;

export const DAY_MS = 24 * 60 * 60 * 1000;
export const addDays = (d: Date, days: number): Date => new Date(d.getTime() + days * DAY_MS);
