import type { Action, CallEvent, CallTarget } from "../types";
import type { EventHandler, PlacedCall, RecordingFile, TelephonyProvider } from "./telephony";

export type MockScenario =
  | "human_ok"
  | "voicemail"
  | "no_answer"
  | "busy"
  | "no_key"
  | "opt_out"
  | "handoff_timeout"
  | "adult_hangs_up_after_key1";

const SPEECH_WORDS_PER_SECOND = 2.5;
const say = (a: Action[]) => a.filter((x): x is Extract<Action, { type: "say" }> => x.type === "say");
const speechSeconds = (actions: Action[]) => say(actions).reduce((s, a) => s + Math.ceil(a.text.split(/\s+/).length / SPEECH_WORDS_PER_SECOND), 0);

/**
 * Simulated phone network. Plays a scenario against the real controller (via `handler`), executing the actions the
 * controller returns, exactly like the Twilio webhooks would. Deterministic, no clock, no network.
 */
export class MockTelephonyProvider implements TelephonyProvider {
  readonly name = "mock";
  /** Scenario per attempt, consumed in order; the last one repeats. */
  scenarios: MockScenario[] = ["human_ok"];
  agentSeconds = 240;
  handler: EventHandler | null = null;
  /** What the "adult" heard, for assertions. */
  readonly spoken: Array<{ callId: string; text: string }> = [];
  readonly placed: CallTarget[] = [];
  readonly recordingsStarted: string[] = [];
  readonly recordingsDeleted: string[] = [];
  readonly recordings = new Map<string, RecordingFile>();
  private seq = 0;
  private byProviderId = new Map<string, string>();
  /** When true, placeCall plays the scenario immediately (dev/test). Real flows are driven by webhooks. */
  autoplay = true;
  private attempt = 0;
  private lastTelephonySeconds = new Map<string, number>();

  attach(handler: EventHandler): void {
    this.handler = handler;
  }

  async placeCall(target: CallTarget): Promise<PlacedCall> {
    this.placed.push(target);
    const providerCallId = `mock_call_${++this.seq}`;
    this.byProviderId.set(providerCallId, target.callId);
    if (this.autoplay && this.handler) {
      const scenario = this.scenarios[Math.min(this.attempt, this.scenarios.length - 1)]!;
      this.attempt += 1;
      // Run after returning the id, like a real network would call back later.
      await this.play(target, providerCallId, scenario);
    }
    return { providerCallId };
  }

  private async emit(callId: string, event: CallEvent): Promise<Action[]> {
    if (!this.handler) throw new Error("MockTelephonyProvider has no handler attached");
    const providerCallId = [...this.byProviderId.entries()].find(([, id]) => id === callId)?.[0];
    return this.handler(callId, event, { providerCallId });
  }

  /** Executes the actions like a phone would; returns elapsed seconds and the final hangup, if any. */
  private async run(callId: string, actions: Action[], clock: { t: number }): Promise<Action | null> {
    for (const a of actions) {
      if (a.type === "say") {
        this.spoken.push({ callId, text: a.text });
        clock.t += speechSeconds([a]);
      }
      if (a.type === "hangup" || a.type === "connect_agent") return a;
    }
    return null;
  }

  private async play(target: CallTarget, providerCallId: string, scenario: MockScenario): Promise<void> {
    const callId = target.callId;
    const clock = { t: 0 };
    const end = async (extra = 0) => {
      const secs = Math.max(1, Math.round(clock.t + extra));
      this.lastTelephonySeconds.set(callId, secs);
      await this.emit(callId, { type: "ended", telephonySeconds: secs });
    };
    if (scenario === "no_answer") {
      await this.emit(callId, { type: "no_answer" });
      await end(0);
      return;
    }
    if (scenario === "busy") {
      await this.emit(callId, { type: "busy" });
      await end(0);
      return;
    }
    clock.t += 3; // ringing
    const answered = await this.emit(callId, { type: "answered", answeredBy: scenario === "voicemail" ? "machine" : "human" });
    const stop = await this.run(callId, answered, clock);
    if (stop?.type === "hangup") return end();

    // Drive the keypad according to the scenario.
    const press = async (digit: string) => this.run(callId, await this.emit(callId, { type: "digit", digit }), clock);
    const silence = async () => this.run(callId, await this.emit(callId, { type: "no_input" }), clock);

    if (scenario === "no_key") {
      clock.t += 8;
      let r = await silence();
      clock.t += 8;
      r = r ?? (await silence());
      return end();
    }
    if (scenario === "opt_out") {
      await press("2");
      return end();
    }
    // Key 1 (recording starts here).
    let r = await press("1");
    if (scenario === "handoff_timeout") {
      clock.t += 20;
      await silence();
      clock.t += 20;
      await silence();
      return end();
    }
    if (scenario === "adult_hangs_up_after_key1") {
      return end();
    }
    r = await press("1");
    if (r?.type === "connect_agent") {
      // The agent talks; the child is on the line.
      clock.t += this.agentSeconds;
      const rec = this.recordingsStarted.at(-1);
      if (rec) this.recordings.set(rec, { mp3: new TextEncoder().encode(`MOCK-MP3 for ${rec}`), durationSeconds: this.agentSeconds });
    }
    return end();
  }

  async startRecording(providerCallId: string): Promise<{ recordingId: string }> {
    const recordingId = `mock_rec_${providerCallId}`;
    this.recordingsStarted.push(recordingId);
    return { recordingId };
  }

  async fetchRecording(recordingId: string): Promise<RecordingFile> {
    return this.recordings.get(recordingId) ?? { mp3: null, durationSeconds: 0 };
  }

  async deleteRecording(recordingId: string): Promise<void> {
    this.recordingsDeleted.push(recordingId);
    this.recordings.delete(recordingId);
  }

  async hangup(_providerCallId: string): Promise<void> {
    // Nothing to do: the scripted call ends by itself.
  }
}
