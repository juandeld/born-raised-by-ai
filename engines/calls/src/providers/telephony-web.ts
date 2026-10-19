import type { CallTarget } from "../types";
import { NotImplementedError, type PlacedCall, type RecordingFile, type TelephonyProvider } from "./telephony";

/**
 * Web / WebRTC transport (stub). Idea for Spain: instead of a mobile call (13x more expensive via Twilio), the buyer gets a
 * link that opens a browser "video call" with the agent (ElevenLabs signed URL, telephony cost $0). Not implemented:
 * the prelude must become an on-page screen with an explicit button (no DTMF) and legal-compliance must approve it first.
 */
export class WebTelephonyProvider implements TelephonyProvider {
  readonly name = "web";

  constructor(private readonly baseUrl: string) {}

  async placeCall(t: CallTarget): Promise<PlacedCall> {
    // Only the join link is produced; the page that hosts the session does not exist yet.
    return { providerCallId: `web_${t.callId}`, joinUrl: `${this.baseUrl}/llamada/${t.callId}` };
  }
  async startRecording(): Promise<{ recordingId: string }> {
    throw new NotImplementedError("WebTelephonyProvider.startRecording");
  }
  async fetchRecording(): Promise<RecordingFile> {
    throw new NotImplementedError("WebTelephonyProvider.fetchRecording");
  }
  async deleteRecording(): Promise<void> {
    throw new NotImplementedError("WebTelephonyProvider.deleteRecording");
  }
  async hangup(): Promise<void> {
    throw new NotImplementedError("WebTelephonyProvider.hangup");
  }
}
