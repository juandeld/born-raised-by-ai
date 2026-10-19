"use client";
import { useEffect } from "react";

export type BrowserEvent = "landing_view" | "form_started" | "cta_click" | "name_personalized" | "audio_play";

/** Fires one funnel event from the browser. Never blocks the page, never sends personal data (no name, no free text). */
export function send(event: BrowserEvent, slug: string, country: string, creative: string, extra?: { placement?: string; personalized?: boolean }) {
  try {
    const body = JSON.stringify({ event, slug, country, creative, ...extra });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    else void fetch("/api/track", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
  } catch {
    /* analytics must never break the page */
  }
}

export function Track({ event, slug, country, creative }: { event: BrowserEvent; slug: string; country: string; creative: string }) {
  useEffect(() => {
    send(event, slug, country, creative);
  }, [event, slug, country, creative]);
  return null;
}
