import type { Storage } from "./providers/storage";
import type { TelephonyProvider } from "./providers/telephony";

export type RecorderOutcome = { ready: true; path: string; bytes: number; durationSeconds: number } | { ready: false };

/**
 * Recording -> MP3 -> private storage. Recording itself starts in the controller after the first key 1 (A-02).
 * Twilio processes recordings asynchronously, so `collect` can answer "not ready"; the scheduler retries later.
 */
export class Recorder {
  constructor(private readonly telephony: TelephonyProvider, private readonly storage: Storage) {}

  static path(orderId: string, callId: string): string {
    return `recordings/${orderId}/${callId}.mp3`;
  }

  async collect(args: { orderId: string; callId: string; recordingId: string }): Promise<RecorderOutcome> {
    const file = await this.telephony.fetchRecording(args.recordingId);
    if (!file.mp3) return { ready: false };
    const path = Recorder.path(args.orderId, args.callId);
    await this.storage.put(path, file.mp3, "audio/mpeg");
    return { ready: true, path, bytes: file.mp3.byteLength, durationSeconds: file.durationSeconds };
  }
}
