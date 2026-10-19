import { createHmac, timingSafeEqual } from "node:crypto";
import type { TextLocale } from "@lumen/legal";
import type { Action, CallEvent, CallTarget } from "../types";
import type { PlacedCall, RecordingFile, TelephonyProvider } from "./telephony";

/**
 * Twilio adapter (real). Twilio owns the call and runs the fixed prelude through TwiML webhooks; ElevenLabs only
 * receives the call after the second key 1 (register-call returns the <Connect><Stream> TwiML).
 * Needs TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER (or TWILIO_FROM_<CC>) and PUBLIC_BASE_URL.
 * [no verificado] Polly voice names and the exact AMD behavior: confirm on the first test call.
 */
export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  publicBaseUrl: string;
  /** Used only when the target carries no hard limit. Normally Twilio's TimeLimit is the product safety net (A-07b, 450 s). */
  defaultHardLimitSeconds?: number;
}

const SAY_VOICES: Record<TextLocale, { language: string; voice: string }> = {
  "es-419": { language: "es-MX", voice: "Polly.Mia-Neural" },
  "es-ES": { language: "es-ES", voice: "Polly.Lucia-Neural" },
  "en-US": { language: "en-US", voice: "Polly.Joanna-Neural" },
  "en-GB": { language: "en-GB", voice: "Polly.Amy-Neural" },
};

export const xmlEscape = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export class TwilioTelephonyProvider implements TelephonyProvider {
  readonly name = "twilio";
  private readonly api: string;

  constructor(private readonly cfg: TwilioConfig, private readonly fetchFn: typeof fetch = fetch) {
    this.api = `https://api.twilio.com/2010-04-01/Accounts/${cfg.accountSid}`;
  }

  static fromEnv(env: Record<string, string | undefined>): TwilioTelephonyProvider {
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are required for TELEPHONY_PROVIDER=twilio");
    return new TwilioTelephonyProvider({ accountSid: env.TWILIO_ACCOUNT_SID, authToken: env.TWILIO_AUTH_TOKEN, publicBaseUrl: env.PUBLIC_BASE_URL ?? "http://localhost:3000" });
  }

  private auth(): Record<string, string> {
    return { authorization: `Basic ${Buffer.from(`${this.cfg.accountSid}:${this.cfg.authToken}`).toString("base64")}` };
  }

  private async form(path: string, params: Record<string, string>, method = "POST"): Promise<any> {
    const res = await this.fetchFn(`${this.api}${path}`, {
      method,
      headers: { ...this.auth(), "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params).toString(),
    });
    if (!res.ok) throw new Error(`Twilio ${res.status} on ${path}: ${await res.text()}`);
    return res.json();
  }

  async placeCall(t: CallTarget): Promise<PlacedCall> {
    const base = this.cfg.publicBaseUrl;
    const j = await this.form("/Calls.json", {
      To: t.to,
      From: t.from,
      Url: `${base}/api/calls/twilio/voice?call=${t.callId}`,
      Method: "POST",
      StatusCallback: `${base}/api/calls/twilio/status?call=${t.callId}`,
      StatusCallbackEvent: "completed",
      StatusCallbackMethod: "POST",
      // Synchronous answering-machine detection: the first webhook carries AnsweredBy.
      MachineDetection: "Enable",
      MachineDetectionTimeout: "8",
      Timeout: "25",
      TimeLimit: String(t.hardLimitSeconds ?? this.cfg.defaultHardLimitSeconds ?? t.maxCallSeconds + 150),
    });
    return { providerCallId: j.sid as string };
  }

  async startRecording(providerCallId: string): Promise<{ recordingId: string }> {
    const j = await this.form(`/Calls/${providerCallId}/Recordings.json`, { RecordingChannels: "mono" });
    return { recordingId: j.sid as string };
  }

  async fetchRecording(recordingId: string): Promise<RecordingFile> {
    const meta = await this.fetchFn(`${this.api}/Recordings/${recordingId}.json`, { headers: this.auth() });
    if (!meta.ok) return { mp3: null, durationSeconds: 0 };
    const m = (await meta.json()) as { status?: string; duration?: string };
    if (m.status !== "completed") return { mp3: null, durationSeconds: 0 };
    const res = await this.fetchFn(`${this.api}/Recordings/${recordingId}.mp3`, { headers: this.auth() });
    if (!res.ok) return { mp3: null, durationSeconds: 0 };
    return { mp3: new Uint8Array(await res.arrayBuffer()), durationSeconds: Number(m.duration ?? 0) };
  }

  async deleteRecording(recordingId: string): Promise<void> {
    const res = await this.fetchFn(`${this.api}/Recordings/${recordingId}.json`, { method: "DELETE", headers: this.auth() });
    if (!res.ok && res.status !== 404) throw new Error(`Twilio deleteRecording ${res.status}`);
  }

  async hangup(providerCallId: string): Promise<void> {
    await this.form(`/Calls/${providerCallId}.json`, { Status: "completed" });
  }

  // ------------------------------------------------------------ webhook helpers

  /** X-Twilio-Signature: base64(HMAC-SHA1(authToken, url + sorted key/value pairs)). */
  validateSignature(url: string, params: Record<string, string>, signature: string | null | undefined): boolean {
    if (!signature) return false;
    const data = url + Object.keys(params).sort().map((k) => k + params[k]).join("");
    const expected = createHmac("sha1", this.cfg.authToken).update(data).digest();
    const given = Buffer.from(signature, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  }

  /** Voice webhook (call answered or a Gather result) to a normalized event. */
  parseVoiceWebhook(params: Record<string, string>, query: URLSearchParams): CallEvent {
    const kind = query.get("event");
    if (kind === "digit") return { type: "digit", digit: params.Digits ?? "" };
    if (kind === "no_input") return { type: "no_input" };
    const by = (params.AnsweredBy ?? "").toLowerCase();
    const answeredBy = by.startsWith("machine") || by === "fax" ? "machine" : by === "human" ? "human" : "unknown";
    return { type: "answered", answeredBy };
  }

  /** Status callback to a normalized event. */
  parseStatusWebhook(params: Record<string, string>): CallEvent | null {
    switch (params.CallStatus) {
      case "completed":
        return { type: "ended", telephonySeconds: Number(params.CallDuration ?? 0) };
      case "busy":
        return { type: "busy" };
      case "no-answer":
        return { type: "no_answer" };
      case "failed":
      case "canceled":
        return { type: "failed", reason: params.CallStatus };
      default:
        return null;
    }
  }

  /** Renders controller actions as TwiML. Sequence: <Say>... then <Gather> with a <Redirect> fallback for no input. */
  renderTwiml(actions: Action[], ctx: { callId: string; locale: TextLocale }): string {
    const v = SAY_VOICES[ctx.locale];
    const url = (event: string) => `${this.cfg.publicBaseUrl}/api/calls/twilio/voice?call=${ctx.callId}&amp;event=${event}`;
    const parts: string[] = [];
    for (const a of actions) {
      if (a.type === "say") parts.push(`<Say language="${v.language}" voice="${v.voice}">${xmlEscape(a.text)}</Say>`);
      else if (a.type === "gather") {
        parts.push(`<Gather input="dtmf" numDigits="1" timeout="${a.timeoutSeconds}" action="${url("digit")}" method="POST"/>`);
        parts.push(`<Redirect method="POST">${url("no_input")}</Redirect>`);
      } else if (a.type === "hangup") parts.push("<Hangup/>");
      else if (a.type === "connect_agent") {
        // ElevenLabs returns a full <Response> document; reuse it verbatim.
        if (a.twiml) return a.twiml;
        parts.push("<Hangup/>");
      }
    }
    return `<?xml version="1.0" encoding="UTF-8"?><Response>${parts.join("")}</Response>`;
  }
}
