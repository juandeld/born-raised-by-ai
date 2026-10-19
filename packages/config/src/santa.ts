/** Product-level configuration for Santa. Engine-level code reads this, never hardcodes values. */
export interface CallProductConfig {
  slug: string;
  /**
   * Hard cap on the conversation (guardrail A-07, legal-v1.1): seconds counted from the SECOND key 1, when the character starts
   * to speak. The prelude, the key waits and the hand-off do not count. Can be lowered, not raised without legal approval.
   */
  maxCallSeconds: number;
  /** The agent starts the kind goodbye at this second of the conversation clock (F-11). */
  goodbyeAtSeconds: number;
  /** The system plays the fixed closing phrase D-02 and hangs up at this second (F-11). */
  closingPhraseAtSeconds: number;
  /** Absolute cap of the whole call, from answer to cut (A-07b). A safety net, not the normal clock. */
  safetyNetSeconds: number;
  /** Local-time calling hours (A-08). */
  allowedLocalHours: { from: number; to: number };
  maxAttempts: number;
  minutesBetweenAttempts: number;
  /** DTMF wait seconds for the prelude (file 03, step 4). */
  dtmfTimeoutSeconds: number;
  /**
   * DTMF wait for the second key (the adult hands the phone to the child), per gather. The prelude repeats the hand-off line once
   * after this wait, so the total wait is twice this value: 2 x 30 = the 60 s maximum of file 03, step 7.
   */
  handoffTimeoutSeconds: number;
  refundWindowDays: number;
}

export const SANTA: CallProductConfig = {
  slug: "santa",
  maxCallSeconds: 300,
  goodbyeAtSeconds: 240,
  closingPhraseAtSeconds: 290,
  safetyNetSeconds: 450,
  allowedLocalHours: { from: 8, to: 21 },
  maxAttempts: 2,
  minutesBetweenAttempts: 15,
  dtmfTimeoutSeconds: 8,
  handoffTimeoutSeconds: 30,
  refundWindowDays: 7,
};

export const CALL_PRODUCTS: Record<string, CallProductConfig> = { santa: SANTA };
