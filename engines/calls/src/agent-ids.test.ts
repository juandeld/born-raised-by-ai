import { describe, expect, it } from "vitest";
import { agentIdsFromEnv } from "./factory";

describe("agentIdsFromEnv", () => {
  it("accepts both spellings of the es-419 variable", () => {
    expect(agentIdsFromEnv({ ELEVENLABS_AGENT_ID_ES419: "a" })["es-419"]).toBe("a");
    expect(agentIdsFromEnv({ ELEVENLABS_AGENT_ID_ES_419: "b", ELEVENLABS_AGENT_ID_ES419: "a" })["es-419"]).toBe("b");
    expect(agentIdsFromEnv({})).toEqual({});
  });
});
