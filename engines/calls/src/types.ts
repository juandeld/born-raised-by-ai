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
  | { type: "say"; text: string }
  | { type: "gather"; timeoutSeconds: number }
  | { type: "hangup"; result: CallResult }
  | { type: "connect_agent"; twiml: string | null; conversationId: string | null };

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
