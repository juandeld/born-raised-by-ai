import type { Action, CallEvent, CallTarget } from "../types";

export interface PlacedCall {
  providerCallId: string;
  /** Set by the web transport: link the buyer opens instead of receiving a phone call. */
  joinUrl?: string;
}

export interface RecordingFile {
  /** null while the vendor still processes it. */
  mp3: Uint8Array | null;
  durationSeconds: number;
}

/** Handler the mock uses to feed events into the same controller the Twilio webhooks use. */
export type EventHandler = (callId: string, event: CallEvent, opts?: { providerCallId?: string }) => Promise<Action[]>;

/** Telephony provider (Twilio real, mock, web/WebRTC stub). Swap with TELEPHONY_PROVIDER. */
export interface TelephonyProvider {
  readonly name: string;
  placeCall(target: CallTarget): Promise<PlacedCall>;
  /** Starts recording the live call. Called only after the first key 1 (A-02). */
  startRecording(providerCallId: string): Promise<{ recordingId: string }>;
  /** Fetches the recording as MP3. mp3 is null while it is not ready. */
  fetchRecording(recordingId: string): Promise<RecordingFile>;
  /** Deletes the recording at the vendor (A-10). */
  deleteRecording(recordingId: string): Promise<void>;
  hangup(providerCallId: string): Promise<void>;
}

export class NotImplementedError extends Error {
  constructor(what: string) {
    super(`${what} is not implemented yet (see docs/arquitectura/pendientes-cuentas.md)`);
  }
}
