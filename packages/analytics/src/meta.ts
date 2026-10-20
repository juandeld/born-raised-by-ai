import { createHash } from "node:crypto";
import { experimentOf } from "./experiments";

/**
 * Meta Pixel + Conversions API (CAPI), off unless META_PIXEL_ID is set (CAPI also needs META_CAPI_TOKEN).
 * The browser fires the Pixel and posts the same event (same event_id) to our own /api/meta, which relays it to CAPI;
 * Meta deduplicates by event_id. The experiment travels as custom parameters `cr` (full creative id) and `exp`.
 * Never sent to Meta: child name, age, free text, phone, voice. The email only as a SHA-256 hash and only on Purchase.
 */
export const META_EVENTS = ["PageView", "ViewContent", "InitiateCheckout", "Purchase"] as const;
export type MetaEventName = (typeof META_EVENTS)[number];

export interface MetaConfig {
  pixelId: string;
  /** Absent: the Pixel works but nothing is relayed server-side. */
  capiToken: string | null;
  testEventCode: string | null;
  apiVersion: string;
}

export function metaConfig(env: Record<string, string | undefined> = process.env): MetaConfig | null {
  const pixelId = (env.META_PIXEL_ID ?? "").trim();
  if (!/^\d{6,20}$/.test(pixelId)) return null;
  const tok = (env.META_CAPI_TOKEN ?? "").trim();
  const test = (env.META_TEST_EVENT_CODE ?? "").trim();
  // [no verificado] default Graph API version; override with META_API_VERSION if Meta retires it.
  return { pixelId, capiToken: tok || null, testEventCode: test || null, apiVersion: (env.META_API_VERSION ?? "v23.0").trim() };
}

export function isMetaEvent(v: unknown): v is MetaEventName {
  return typeof v === "string" && (META_EVENTS as readonly string[]).includes(v);
}

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export const hashEmail = (email: string) => sha256(email.trim().toLowerCase());

const clean = (s: unknown, n: number) => String(s ?? "").replace(/[^\w.:/@=&?%+-]/g, "").slice(0, n);

export interface MetaEventInput {
  name: MetaEventName;
  eventId: string;
  /** Full URL of the page where it happened. */
  url: string;
  creative: string;
  country?: string;
  /** Purchase / InitiateCheckout: major units (199 for MX$199). */
  value?: number;
  currency?: string;
  email?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  timeSec?: number;
}

/** Body for POST /{pixel}/events. Only whitelisted fields; user_data is hashed or technical. */
export function buildCapiEvent(i: MetaEventInput) {
  const exp = experimentOf(i.creative);
  const user: Record<string, unknown> = {};
  if (i.ip) user.client_ip_address = i.ip;
  if (i.userAgent) user.client_user_agent = i.userAgent.slice(0, 400);
  if (i.fbp) user.fbp = clean(i.fbp, 100);
  if (i.fbc) user.fbc = clean(i.fbc, 200);
  if (i.name === "Purchase" && i.email) user.em = [hashEmail(i.email)];
  if (i.country) user.country = [sha256(i.country.toLowerCase())];
  const custom: Record<string, unknown> = { content_name: "jinglo-santa", content_type: "product", cr: clean(i.creative, 40) || "none" };
  if (exp) custom.exp = exp;
  if (i.value !== undefined && Number.isFinite(i.value)) custom.value = Math.round(i.value * 100) / 100;
  if (i.currency) custom.currency = i.currency.toUpperCase().slice(0, 3);
  return {
    event_name: i.name,
    event_time: i.timeSec ?? Math.floor(Date.now() / 1000),
    event_id: clean(i.eventId, 80),
    action_source: "website",
    event_source_url: i.url,
    user_data: user,
    custom_data: custom,
  };
}

/** Sends one event to CAPI. Returns false (never throws) when CAPI is off or Meta answers an error. */
export async function sendCapi(cfg: MetaConfig, input: MetaEventInput, fetchFn: typeof fetch = fetch): Promise<boolean> {
  if (!cfg.capiToken) return false;
  try {
    const res = await fetchFn(`https://graph.facebook.com/${cfg.apiVersion}/${cfg.pixelId}/events?access_token=${encodeURIComponent(cfg.capiToken)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: [buildCapiEvent(input)], ...(cfg.testEventCode ? { test_event_code: cfg.testEventCode } : {}) }),
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
