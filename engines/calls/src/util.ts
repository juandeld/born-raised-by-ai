import { createHmac, randomBytes } from "node:crypto";
import type { BaseProps, Device } from "@lumen/analytics";
import { piiHashKey } from "@lumen/config/secrets";
import type { OrderRow } from "@lumen/db";

/**
 * Salted hash of the E.164 number (consents, suppression list). The salt is a secret (PHONE_HASH_SALT): without it the
 * hash cannot be reversed by brute force over phone numbers. In production a missing salt is derived from a server secret
 * (see packages/config/src/secrets.ts); a public constant is never used there.
 */
export function hashPhone(e164: string, env: Record<string, string | undefined> = process.env): string {
  return createHmac("sha256", piiHashKey(env)).update(e164).digest("hex");
}

export const randomToken = (bytes = 16): string => randomBytes(bytes).toString("hex");

export function baseProps(order: OrderRow): BaseProps {
  return {
    product: order.product,
    country: order.country,
    language: order.language,
    creative: order.creative,
    device: (order.device as Device) ?? "unknown",
    order_id: order.id,
    test_mode: order.test_mode,
  };
}

export const iso = (d: Date): string => d.toISOString();
export const addMinutes = (d: Date, m: number): Date => new Date(d.getTime() + m * 60_000);
export const addSeconds = (d: Date, s: number): Date => new Date(d.getTime() + s * 1000);

/** Local civil date/time in an IANA zone to a UTC instant. */
export function localToUtc(dateStr: string, hour: number, tz: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number) as [number, number, number];
  const guess = Date.UTC(y, m - 1, d, hour, 0, 0);
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h23" });
  const at = (ms: number) => {
    const p = Object.fromEntries(fmt.formatToParts(new Date(ms)).map((x) => [x.type, Number(x.value)]));
    return Date.UTC(p.year!, p.month! - 1, p.day!, p.hour! % 24, p.minute!, 0) - ms;
  };
  // offset = local-as-UTC minus real; iterate twice to settle around DST changes.
  let ms = guess - at(guess);
  ms = guess - at(ms);
  return new Date(ms);
}

export function formatLocal(d: Date, tz: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { timeZone: tz, dateStyle: "full", timeStyle: "short" }).format(d);
}

/** Caller id (A-13): identifiable number per destination country, falling back to the default number. */
export function fromNumberFor(env: Record<string, string | undefined>, country: string): string {
  return env[`TWILIO_FROM_${country}`] ?? env.TWILIO_FROM_NUMBER ?? "+10000000000";
}
