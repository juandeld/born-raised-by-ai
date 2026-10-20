"use client";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { parseExperiment, tagCreative } from "@lumen/analytics";

/**
 * Meta Pixel + Conversions API, behind META_PIXEL_ID (the server layout passes it; without it this renders nothing and
 * no script is ever requested). Consent: Spain/UK/US pages (slug es-es, en) need an explicit "Accept"; Mexico (slug es) works
 * on the notice with an easy "No, thanks" (tacit consent, LFPDPPP). The choice lives in localStorage `jl_consent` = "1" | "0".
 * Same event_id goes to the Pixel and to /api/meta (CAPI relay) so Meta counts each event once.
 */
type Consent = "1" | "0" | null;
const KEY = "jl_consent";
let pixelId: string | null = null;
let optIn = true;
let consent: Consent = null;
let loaded = false;
const queue: Array<() => void> = [];

function readConsent(): Consent {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "1" || v === "0" ? v : null;
  } catch {
    return null;
  }
}
const allowed = () => (consent === "1" ? true : consent === "0" ? false : !optIn);

declare global {
  interface Window {
    fbq?: ((...a: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
  }
}

function loadPixel() {
  if (loaded || !pixelId) return;
  loaded = true;
  const w = window;
  if (!w.fbq) {
    const n = function (...a: unknown[]) { (n.callMethod ? (n.callMethod as (...x: unknown[]) => void)(...a) : n.queue!.push(a)); } as NonNullable<Window["fbq"]>;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    w.fbq = n; w._fbq = n;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  }
  w.fbq!("init", pixelId);
  while (queue.length) queue.shift()!();
}

function creativeNow(): string {
  try {
    const q = new URLSearchParams(window.location.search);
    return tagCreative(parseExperiment(q.get("exp")), q.get("cr") ?? q.get("utm_content"));
  } catch {
    return "none";
  }
}
const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `e${Date.now()}${Math.random().toString(16).slice(2)}`);

export type MetaName = "PageView" | "ViewContent" | "InitiateCheckout" | "Purchase";

/** Fires one event to the Pixel and to the CAPI relay. No-op when Meta is off or the visitor did not allow it. */
export function metaTrack(name: MetaName, opts: { value?: number; currency?: string; country?: string; eventId?: string; token?: string } = {}): string | null {
  if (!pixelId || typeof window === "undefined") return null;
  const eventId = opts.eventId ?? newId();
  const run = () => {
    if (!allowed()) return;
    const cr = creativeNow();
    const params: Record<string, unknown> = { content_name: "jinglo-santa", content_type: "product", cr };
    const exp = cr.split(".")[0];
    if (parseExperiment(exp)) params.exp = exp;
    if (opts.value !== undefined && opts.currency) { params.value = opts.value; params.currency = opts.currency; }
    window.fbq?.("track", name, params, { eventID: eventId });
    try {
      const body = JSON.stringify({ name, eventId, url: window.location.href, creative: cr, country: opts.country, token: opts.token });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/meta", new Blob([body], { type: "application/json" }));
      else void fetch("/api/meta", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
    } catch { /* never break the page */ }
  };
  if (loaded) run();
  else queue.push(run);
  return eventId;
}

const COPY = {
  es: { text: "Medimos el resultado de nuestros anuncios con el píxel de Meta (Facebook e Instagram). No recibe datos de tu peque. Más detalle en la política de privacidad.", yes: "Entendido", no: "No, gracias", link: "Preferencias de publicidad" },
  "es-es": { text: "¿Nos dejas medir el resultado de nuestros anuncios con el píxel de Meta (Facebook e Instagram)? No recibe datos de tu peque. Más detalle en la política de privacidad.", yes: "Aceptar", no: "Rechazar", link: "Preferencias de publicidad" },
  en: { text: "May we measure our ads with the Meta Pixel (Facebook and Instagram)? It receives no information about your child. More in the privacy policy.", yes: "Accept", no: "Decline", link: "Advertising preferences" },
} as const;

/** Mount once in the layout. `id` comes from the server (META_PIXEL_ID); undefined renders nothing. */
export function MetaPixel({ id, slug }: { id?: string; slug: "es" | "es-es" | "en" }) {
  const [ask, setAsk] = useState(false);
  const path = usePathname();
  useEffect(() => {
    if (!id) return;
    pixelId = id;
    optIn = slug !== "es";
    consent = readConsent();
    if (allowed()) loadPixel();
    // MX tacit: show the notice once until the visitor answers; EU/UK/US: ask until answered
    setAsk(consent === null);
    const open = () => setAsk(true);
    window.addEventListener("jl:consent-open", open);
    return () => window.removeEventListener("jl:consent-open", open);
  }, [id, slug]);
  // One PageView per route (client-side navigation included); queued until the visitor allows it
  useEffect(() => { if (id) metaTrack("PageView"); }, [id, path]);
  const choose = useCallback((v: "1" | "0") => {
    consent = v;
    try { window.localStorage.setItem(KEY, v); } catch { /* ignore */ }
    setAsk(false);
    if (v === "1") { loadPixel(); } else { try { window.fbq?.("consent", "revoke"); } catch { /* ignore */ } }
  }, []);
  if (!id || !ask) return null;
  const c = COPY[slug];
  return (
    <div role="dialog" aria-label={c.link} className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-night-900/20 bg-cream-50 p-4 text-sm text-night-900 shadow-lg">
      <p>{c.text}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn btn-gold" onClick={() => choose("1")}>{c.yes}</button>
        <button type="button" className="rounded-full border border-night-900/30 px-4 py-2" onClick={() => choose("0")}>{c.no}</button>
      </div>
    </div>
  );
}

/** Footer link that reopens the choice. Renders nothing when Meta is off. */
export function ConsentLink({ id, slug }: { id?: string; slug: "es" | "es-es" | "en" }) {
  if (!id) return null;
  return <button type="button" className="underline underline-offset-4" onClick={() => window.dispatchEvent(new Event("jl:consent-open"))}>{COPY[slug].link}</button>;
}

/** Fires one event when the page mounts (ViewContent on the landing). */
export function MetaEvent({ name, value, currency, country }: { name: MetaName; value?: number; currency?: string; country?: string }) {
  useEffect(() => { metaTrack(name, { value, currency, country }); }, [name, value, currency, country]);
  return null;
}

/** Confirmation page: Purchase with the order id as event_id; the server reads value and email from the order. */
export function MetaPurchase({ orderId, token, value, currency, country }: { orderId: string; token: string; value: number; currency: string; country: string }) {
  useEffect(() => {
    let done = false;
    try { done = window.sessionStorage.getItem(`jl_p_${orderId}`) === "1"; } catch { /* ignore */ }
    if (done) return;
    if (metaTrack("Purchase", { value, currency, country, eventId: orderId, token })) {
      try { window.sessionStorage.setItem(`jl_p_${orderId}`, "1"); } catch { /* ignore */ }
    }
  }, [orderId, token, value, currency, country]);
  return null;
}
