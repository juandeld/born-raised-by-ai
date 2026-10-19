import { describe, expect, it } from "vitest";
import { isCallable, lastCallableInstant, nextCallableInstant, planRetry } from "./window";
import { localToUtc } from "./util";

const hours = { from: 8, to: 21 };
const tz = "Europe/Madrid";
// 2026-12-24, 19:00-21:00 Madrid (UTC+1) = 18:00-20:00Z. Local hours cap at 21:00.
const w = { start: localToUtc("2026-12-24", 19, tz), end: localToUtc("2026-12-24", 21, tz), timezone: tz };

describe("calling window", () => {
  it("converts local time to UTC", () => {
    expect(w.start.toISOString()).toBe("2026-12-24T18:00:00.000Z");
    expect(localToUtc("2026-07-01", 10, "America/Mexico_City").toISOString()).toBe("2026-07-01T16:00:00.000Z");
  });

  it("allows only inside the window and inside 08:00-21:00 local", () => {
    expect(isCallable(new Date("2026-12-24T17:59:00Z"), w, hours)).toBe(false);
    expect(isCallable(new Date("2026-12-24T18:00:00Z"), w, hours)).toBe(true);
    expect(isCallable(new Date("2026-12-24T19:59:00Z"), w, hours)).toBe(true);
    expect(isCallable(new Date("2026-12-24T20:01:00Z"), w, hours)).toBe(false); // after 21:00 local (window ended)
  });

  it("a window that runs past 21:00 local is cut at 21:00", () => {
    const wide = { start: localToUtc("2026-12-24", 19, tz), end: localToUtc("2026-12-24", 23, tz), timezone: tz };
    expect(isCallable(new Date("2026-12-24T19:30:00Z"), wide, hours)).toBe(true); // 20:30 local
    expect(isCallable(new Date("2026-12-24T20:30:00Z"), wide, hours)).toBe(false); // 21:30 local
    expect(lastCallableInstant(wide, hours)!.toISOString()).toBe("2026-12-24T19:59:00.000Z");
  });

  it("next callable instant waits for the window start", () => {
    expect(nextCallableInstant(new Date("2026-12-24T10:00:00Z"), w, hours)!.toISOString()).toBe("2026-12-24T18:00:00.000Z");
    expect(nextCallableInstant(new Date("2026-12-24T21:00:00Z"), w, hours)).toBeNull();
  });

  it("retry waits at least 15 minutes and never leaves the window", () => {
    expect(planRetry(new Date("2026-12-24T18:10:00Z"), w, hours, 15)!.toISOString()).toBe("2026-12-24T18:25:00.000Z");
    expect(planRetry(new Date("2026-12-24T19:50:00Z"), w, hours, 15)).toBeNull();
  });
});
