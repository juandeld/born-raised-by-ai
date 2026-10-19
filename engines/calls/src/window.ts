/**
 * Calling-window math. Rules (docs/legal/textos/02 section C, 07 A-08):
 *  - only inside the window the buyer chose;
 *  - only between 08:00 and 21:00 local time of the called number;
 *  - at most 2 attempts, at least 15 minutes apart, never outside the window.
 * The timezone is the IANA zone chosen in the form (default per country).
 */
export interface CallWindow {
  start: Date;
  end: Date;
  timezone: string;
}
export interface LocalHours {
  from: number;
  to: number;
}

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(tz: string): Intl.DateTimeFormat {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "numeric", hourCycle: "h23" });
    formatters.set(tz, f);
  }
  return f;
}

export function localHourMinute(d: Date, tz: string): { hour: number; minute: number } {
  const parts = formatter(tz).formatToParts(d);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return { hour, minute };
}

export function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** True when `t` is inside the window and inside the allowed local hours. */
export function isCallable(t: Date, w: CallWindow, hours: LocalHours): boolean {
  if (t < w.start || t > w.end) return false;
  const { hour } = localHourMinute(t, w.timezone);
  return hour >= hours.from && hour < hours.to;
}

const MINUTE = 60_000;
const MAX_SCAN_MINUTES = 7 * 24 * 60;

/** Earliest callable instant >= t (minute resolution), or null if the window is over. */
export function nextCallableInstant(t: Date, w: CallWindow, hours: LocalHours): Date | null {
  let cur = new Date(Math.ceil(Math.max(t.getTime(), w.start.getTime()) / MINUTE) * MINUTE);
  for (let i = 0; i < MAX_SCAN_MINUTES && cur <= w.end; i++) {
    if (isCallable(cur, w, hours)) return cur;
    cur = new Date(cur.getTime() + MINUTE);
  }
  return null;
}

/** Time of the next attempt after one that ended at `lastEnd`; null when it would fall outside the window. */
export function planRetry(lastEnd: Date, w: CallWindow, hours: LocalHours, minGapMinutes: number): Date | null {
  return nextCallableInstant(new Date(lastEnd.getTime() + minGapMinutes * MINUTE), w, hours);
}

/** Last instant at which an attempt may start. */
export function lastCallableInstant(w: CallWindow, hours: LocalHours): Date | null {
  let cur = new Date(Math.floor(w.end.getTime() / MINUTE) * MINUTE);
  for (let i = 0; i < MAX_SCAN_MINUTES && cur >= w.start; i++) {
    if (isCallable(cur, w, hours)) return cur;
    cur = new Date(cur.getTime() - MINUTE);
  }
  return null;
}
