import { describe, expect, it } from "vitest";
import { agentIdsFromEnv } from "./factory";

describe("agentIdsFromEnv", () => {
  it("accepts both spellings of the es-419 variable", () => {
    expect(agentIdsFromEnv({ ELEVENLABS_AGENT_ID_ES419: "a" })["es-419"]).toBe("a");
    expect(agentIdsFromEnv({ ELEVENLABS_AGENT_ID_ES_419: "b", ELEVENLABS_AGENT_ID_ES419: "a" })["es-419"]).toBe("b");
    expect(agentIdsFromEnv({})).toEqual({});
  });
});

import { pickAgentId } from "./agent-ids";
describe("pickAgentId", () => {
  const all = { "es-419": "a", "es-ES": "b", en: "c", "en-US": "d", "en-GB": "e" };
  it("uses the exact locale first", () => {
    expect(pickAgentId(all, "en-GB", "en")).toBe("e");
    expect(pickAgentId(all, "es-ES", "es-ES")).toBe("b");
  });
  it("falls back to the closest agent and finally to es-419", () => {
    expect(pickAgentId({ "es-419": "a", en: "c" }, "en-GB", "en")).toBe("c");
    expect(pickAgentId({ "es-419": "a" }, "es-ES", "es-ES")).toBe("a");
    expect(pickAgentId({ "es-419": "a" }, "en-US", "en")).toBe("a");
    expect(pickAgentId({}, "en-US", "en")).toBe("");
  });
});
