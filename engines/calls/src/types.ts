import type { CallResult } from "@lumen/db";
import type { TextLocale } from "@lumen/legal";

export type { CallResult };

/** Events coming from the telephony side (Twilio webhooks, or the mock). */
export type CallEvent =
  | { type: "answered"; answeredBy: "human" | "machine" | "unknown" }
  | { type: "digit"; digit: string }
  | { type: "no_input" }
  | { type: "no_answer" }
  | { type: "busy" }
  | { type: "failed"; reason?: string }
  | { type: "ended"; telephonySeconds: number };

/** What the telephony adapter must do next. The adapter renders these (TwiML for Twilio, direct for the mock). */
export type Action =
  /** `lockedChars` (D14): the first N characters are played without barge-in; the rest accepts a key press. */
  | { type: "say"; text: string; lockedChars?: number; audio?: SayAudio }
  | { type: "gather"; timeoutSeconds: number }
  | { type: "hangup"; result: CallResult }
  | { type: "connect_agent"; twiml: string | null; conversationId: string | null };

/** D20: pre-recorded clips (public paths starting with "/") that replace the synthetic <Say>; any other part is spoken text (the child's name). `locked` plays without barge-in, `open` inside the <Gather>. */
export interface SayAudio {
  locked?: string[];
  open: string[];
}

export interface CallTarget {
  callId: string;
  orderId: string;
  to: string;
  from: string;
  locale: TextLocale;
  childFirstName: string;
  /** Conversation cap, counted from the second key 1. */
  maxCallSeconds: number;
  /** Absolute cap of the whole call from answer to cut (A-07b). */
  hardLimitSeconds?: number;
}

export type Language = "es-419" | "es-ES" | "en";
