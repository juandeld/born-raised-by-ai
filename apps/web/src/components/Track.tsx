"use client";
import { useEffect } from "react";

/** Fires one funnel event from the browser (landing_view, form_started). Never blocks the page, never sends personal data. */
export function send(event: "landing_view" | "form_started", slug: string, country: string, creative: string) {
  try {
    const body = JSON.stringify({ event, slug, country, creative });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    else void fetch("/api/track", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
  } catch {
    /* analytics must never break the page */
  }
}

export function Track({ event, slug, country, creative }: { event: "landing_view" | "form_started"; slug: string; country: string; creative: string }) {
  useEffect(() => {
    send(event, slug, country, creative);
  }, [event, slug, country, creative]);
  return null;
}
