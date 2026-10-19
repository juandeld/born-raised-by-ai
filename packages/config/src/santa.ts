/** Product-level configuration for Santa. Engine-level code reads this, never hardcodes values. */
export interface CallProductConfig {
  slug: string;
  /** Hard cap on call duration (guardrail A-07). Can be lowered, not raised without legal approval. */
  maxCallSeconds: number;
  /** The agent starts the goodbye at this second (F-11). */
  goodbyeAtSeconds: number;
  /** Local-time calling hours (A-08). */
  allowedLocalHours: { from: number; to: number };
  maxAttempts: number;
  minutesBetweenAttempts: number;
  /** DTMF wait seconds for the prelude (file 03, step 4). */
  dtmfTimeoutSeconds: number;
  /** DTMF wait for the second key (child gets the phone). Design decision, see docs. */
  handoffTimeoutSeconds: number;
  refundWindowDays: number;
}

export const SANTA: CallProductConfig = {
  slug: "santa",
  maxCallSeconds: 300,
  goodbyeAtSeconds: 180,
  allowedLocalHours: { from: 8, to: 21 },
  maxAttempts: 2,
  minutesBetweenAttempts: 15,
  dtmfTimeoutSeconds: 8,
  handoffTimeoutSeconds: 20,
  refundWindowDays: 7,
};

export const CALL_PRODUCTS: Record<string, CallProductConfig> = { santa: SANTA };
