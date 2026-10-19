import { describe, expect, it } from "vitest";
import { getPreludeTexts, renderPrelude } from "@lumen/legal";
import { initialPreludeState, stepPrelude, type PreludeState } from "./prelude";
import type { CallEvent } from "./types";

const t = renderPrelude(getPreludeTexts("santa", "es-ES"), { brand: "Lumen Labs", childName: "Leo" });
const cfg = { dtmfTimeoutSeconds: 8, handoffTimeoutSeconds: 20 };

function run(events: CallEvent[]) {
  let state: PreludeState = initialPreludeState();
  const effects: string[] = [];
  const said: string[] = [];
  for (const e of events) {
    const out = stepPrelude(state, e, t, cfg);
    state = out.state;
    effects.push(...out.effects);
    for (const a of out.actions) if (a.type === "say") said.push(a.text);
  }
  return { state, effects, said };
}
const human: CallEvent = { type: "answered", answeredBy: "human" };
const key = (digit: string): CallEvent => ({ type: "digit", digit });

describe("prelude state machine (docs/legal/textos/03)", () => {
  it("T-04: voicemail -> hang up, nothing said, nothing recorded", () => {
    const r = run([{ type: "answered", answeredBy: "machine" }]);
    expect(r.state.result).toBe("voicemail");
    expect(r.said).toEqual([]);
    expect(r.effects).toEqual([]);
  });

  it("A-01/A-02: the character speaks and recording starts only after the keys", () => {
    const r = run([human, key("1")]);
    expect(r.effects).toEqual(["start_recording"]);
    expect(r.effects).not.toContain("connect_agent");
    const r2 = run([human, key("1"), key("1")]);
    expect(r2.effects).toEqual(["start_recording", "connect_agent"]);
    expect(r2.state.step).toBe("agent");
  });

  it("recording never starts before the first key 1", () => {
    for (const events of [[human], [human, { type: "no_input" } as CallEvent], [human, key("2")], [human, key("5")]]) {
      expect(run(events).effects).not.toContain("start_recording");
    }
  });

  it("T-01: no key twice -> says the notice, repeats, closes; no recording", () => {
    const r = run([human, { type: "no_input" }, { type: "no_input" }]);
    expect(r.said).toEqual([t.main, t.repeat, t.noResponse]);
    expect(r.state.result).toBe("no_key");
    expect(r.effects).toEqual([]);
  });

  it("T-03: key 2 -> opt-out phrase, suppression, no recording", () => {
    const r = run([human, key("2")]);
    expect(r.said).toEqual([t.main, t.optout]);
    expect(r.effects).toEqual(["suppress"]);
    expect(r.state.result).toBe("opted_out");
  });

  it("only DTMF counts: other keys re-ask, and too many invalid keys close the call", () => {
    const r = run([human, key("7"), key("7")]);
    expect(r.said).toEqual([t.main, t.pressOne, t.pressOne]);
    expect(r.state.step).toBe("await_key1");
    const r2 = run([human, key("7"), key("7"), key("7")]);
    expect(r2.state.result).toBe("no_key");
  });

  it("hand-off timeout deletes the recording", () => {
    const r = run([human, key("1"), { type: "no_input" }, { type: "no_input" }]);
    expect(r.state.result).toBe("handoff_timeout");
    expect(r.effects).toEqual(["start_recording", "delete_recording"]);
  });

  it("hanging up mid-way is classified by where the call was", () => {
    expect(run([human, { type: "ended", telephonySeconds: 20 }]).state.result).toBe("no_key");
    expect(run([human, key("1"), { type: "ended", telephonySeconds: 40 }]).state.result).toBe("handoff_timeout");
    expect(run([human, key("1"), key("1"), { type: "ended", telephonySeconds: 300 }]).state.result).toBe("completed");
    expect(run([{ type: "no_answer" }]).state.result).toBe("no_answer");
  });
});
