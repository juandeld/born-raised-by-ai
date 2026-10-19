import { describe, expect, it } from "vitest";
import { experimentOf, parseExperiment, tagCreative } from "./experiments";

describe("experiments", () => {
  it("parses only known ids", () => {
    expect(parseExperiment("E1")).toBe("e1");
    expect(parseExperiment("f0")).toBe("f0");
    expect(parseExperiment("e9")).toBeNull();
    expect(parseExperiment(undefined)).toBeNull();
  });
  it("tags the creative without double prefix and within 40 chars", () => {
    expect(tagCreative("e1", "cara-a")).toBe("e1.cara-a");
    expect(tagCreative("e1", undefined)).toBe("e1");
    expect(tagCreative("e1", "none")).toBe("e1");
    expect(tagCreative("e1", "e1.cara-a")).toBe("e1.cara-a");
    expect(tagCreative(null, "ig-reaccion-1")).toBe("ig-reaccion-1");
    expect(tagCreative(null, undefined)).toBe("none");
    expect(tagCreative("e2", "x".repeat(80)).length).toBeLessThanOrEqual(40);
    expect(tagCreative("e2", "a b<script>")).toBe("e2.abscript");
  });
  it("reads the experiment back", () => {
    expect(experimentOf("e3.recuerdo-a")).toBe("e3");
    expect(experimentOf("e3")).toBe("e3");
    expect(experimentOf("ig-reaccion-1")).toBeNull();
    expect(experimentOf("none")).toBeNull();
  });
});
