import type { Device } from "@lumen/analytics";

/** Client IP as seen by the platform (Vercel sets x-forwarded-for / x-real-ip). Stored only with the consent record. */
export function clientIp(headers: Headers): string | null {
  const fwd = headers.get("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0] : headers.get("x-real-ip"))?.trim();
  return ip || null;
}

export function deviceOf(userAgent: string | null): Device {
  const ua = (userAgent ?? "").toLowerCase();
  if (!ua) return "unknown";
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|iphone|android|instagram|fban|fbav/.test(ua)) return "mobile";
  return "desktop";
}

/** Tiny in-memory sliding window per key. Good enough as a brake; the real shield is the payment step. */
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max: number, windowMs = 60_000, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  return recent.length > max;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
