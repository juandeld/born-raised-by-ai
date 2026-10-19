import type { PreludeTexts } from "@lumen/legal";
import type { Action, CallEvent, CallResult } from "./types";

/**
 * Prelude state machine (docs/legal/textos/03 section A). Pure: no I/O. The controller executes the effects.
 * The text is fixed (not generated). Only DTMF counts: a spoken "yes" never advances the call.
 *
 *  start -> (machine) hangup voicemail
 *        -> say(main) + gather -> await_key1
 *  await_key1: 1 -> start recording, say(handoff), gather -> await_key2
 *              2 -> say(optout), suppress, hangup opted_out
 *              no input -> repeat once, then say(noResponse), hangup no_key
 *  await_key2: 1 -> connect agent (the character speaks only now; the conversation clock starts here)
 *              no input after 30 s -> say the hand-off reminder once; after 30 s more (60 s total, step 7 of file 03)
 *              say(noResponse), delete recording, hangup handoff_timeout
 */
export type PreludeStep = "start" | "await_key1" | "await_key2" | "agent" | "done";

export interface PreludeState {
  step: PreludeStep;
  repeated: boolean;
  invalidKeys: number;
  result?: CallResult;
}

export type Effect = "start_recording" | "suppress" | "connect_agent" | "delete_recording";

export interface PreludeConfig {
  dtmfTimeoutSeconds: number;
  handoffTimeoutSeconds: number;
}

export const initialPreludeState = (): PreludeState => ({ step: "start", repeated: false, invalidKeys: 0 });

export interface StepOutput {
  state: PreludeState;
  actions: Action[];
  effects: Effect[];
}

const MAX_INVALID_KEYS = 2;

export function stepPrelude(state: PreludeState, event: CallEvent, t: PreludeTexts, cfg: PreludeConfig): StepOutput {
  const out = (next: Partial<PreludeState>, actions: Action[] = [], effects: Effect[] = []): StepOutput => ({
    state: { ...state, ...next },
    actions,
    effects,
  });
  const done = (result: CallResult, actions: Action[], effects: Effect[] = []) => out({ step: "done", result }, actions, effects);

  // Terminal telephony outcomes, whatever the step.
  if (event.type === "no_answer") return done("no_answer", []);
  if (event.type === "busy") return done("busy", []);
  if (event.type === "failed") return done("failed", []);
  if (event.type === "ended") {
    if (state.step === "done") return out({});
    if (state.step === "agent") return done("completed", []);
    if (state.step === "await_key2") return done("handoff_timeout", [], ["delete_recording"]);
    if (state.step === "await_key1") return done("no_key", []);
    return done("no_answer", []);
  }

  switch (state.step) {
    case "start": {
      if (event.type !== "answered") return out({});
      // Voicemail: hang up without speaking or leaving a message. Counts as an attempt.
      if (event.answeredBy === "machine") return done("voicemail", [{ type: "hangup", result: "voicemail" }]);
      return out(
        { step: "await_key1" },
        [
          { type: "say", text: t.main },
          { type: "gather", timeoutSeconds: cfg.dtmfTimeoutSeconds },
        ],
      );
    }
    case "await_key1": {
      if (event.type === "digit") {
        if (event.digit === "1") {
          return out(
            { step: "await_key2", repeated: false, invalidKeys: 0 },
            [
              { type: "say", text: t.handoff },
              { type: "gather", timeoutSeconds: cfg.handoffTimeoutSeconds },
            ],
            // Recording starts here and not before (guardrail A-02).
            ["start_recording"],
          );
        }
        if (event.digit === "2") {
          return done("opted_out", [{ type: "say", text: t.optout }, { type: "hangup", result: "opted_out" }], ["suppress"]);
        }
        return invalidKey(state, t, cfg, out, done, "no_key", []);
      }
      if (event.type === "no_input") return noInput(state, t, cfg, out, done, "no_key", []);
      return out({});
    }
    case "await_key2": {
      if (event.type === "digit") {
        if (event.digit === "1") return out({ step: "agent" }, [], ["connect_agent"]);
        // Any other key at the hand-off is treated as a withdrawal: safest reading.
        if (event.digit === "2") {
          return done("opted_out", [{ type: "say", text: t.optout }, { type: "hangup", result: "opted_out" }], ["suppress", "delete_recording"]);
        }
        return invalidKey(state, t, cfg, out, done, "handoff_timeout", ["delete_recording"]);
      }
      if (event.type === "no_input") return noInput(state, t, cfg, out, done, "handoff_timeout", ["delete_recording"]);
      return out({});
    }
    default:
      return out({});
  }
}

type OutFn = (next: Partial<PreludeState>, actions?: Action[], effects?: Effect[]) => StepOutput;
type DoneFn = (result: CallResult, actions: Action[], effects?: Effect[]) => StepOutput;

function noInput(state: PreludeState, t: PreludeTexts, cfg: PreludeConfig, out: OutFn, done: DoneFn, failResult: CallResult, failEffects: Effect[]): StepOutput {
  const timeout = state.step === "await_key2" ? cfg.handoffTimeoutSeconds : cfg.dtmfTimeoutSeconds;
  if (!state.repeated) {
    // Key 1 wait repeats "Pulse 1 para continuar o 2 para cancelar."; the key 2 wait repeats "Cuando X tenga el teléfono, pulse 1 otra vez."
    const line = state.step === "await_key2" ? t.handoffRepeat : t.repeat;
    return out({ repeated: true }, [{ type: "say", text: line }, { type: "gather", timeoutSeconds: timeout }]);
  }
  return done(failResult, [{ type: "say", text: t.noResponse }, { type: "hangup", result: failResult }], failEffects);
}

function invalidKey(state: PreludeState, t: PreludeTexts, cfg: PreludeConfig, out: OutFn, done: DoneFn, failResult: CallResult, failEffects: Effect[]): StepOutput {
  const invalidKeys = state.invalidKeys + 1;
  if (invalidKeys > MAX_INVALID_KEYS) {
    return done(failResult, [{ type: "say", text: t.noResponse }, { type: "hangup", result: failResult }], failEffects);
  }
  const timeout = state.step === "await_key2" ? cfg.handoffTimeoutSeconds : cfg.dtmfTimeoutSeconds;
  return out({ invalidKeys }, [{ type: "say", text: t.pressOne }, { type: "gather", timeoutSeconds: timeout }]);
}
