"use client";
import { useState } from "react";

type Survey = "loved" | "ok" | "bad";

/** One-tap survey: three big buttons, one answer per order. */
export function SurveyButtons({ token, labels, thanks, title }: { token: string; labels: Record<Survey, string>; thanks: string; title: string }) {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  async function answer(a: Survey) {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/survey", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, answer: a }) });
    } finally {
      setDone(true);
    }
  }
  if (done) return <p className="rounded-2xl bg-holly-500/10 p-4 text-center font-semibold text-holly-600" role="status">{thanks}</p>;
  const emoji: Record<Survey, string> = { loved: "\u{1F60D}", ok: "\u{1F642}", bad: "\u{1F61E}" };
  return (
    <div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {(Object.keys(labels) as Survey[]).map((k) => (
          <button key={k} type="button" disabled={busy} onClick={() => answer(k)} className="flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-night-700/20 bg-white p-2 text-sm font-semibold active:scale-95">
            <span aria-hidden className="text-3xl">{emoji[k]}</span>
            {labels[k]}
          </button>
        ))}
      </div>
    </div>
  );
}

/** POST a token to an API route and show the localized result. Used by refund and opt-out pages. */
export function TokenAction({ endpoint, token, button, messages }: { endpoint: string; token: string; button: string; messages: { ok: string; outside?: string; failed: string } }) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "outside" | "failed">("idle");
  async function run() {
    setState("busy");
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
      const j = (await res.json()) as { ok: boolean; reason?: string | null };
      setState(j.ok ? "ok" : j.reason === "outside_window" ? "outside" : "failed");
    } catch {
      setState("failed");
    }
  }
  if (state === "ok") return <p className="rounded-2xl bg-holly-500/10 p-4 font-semibold text-holly-600" role="status">{messages.ok}</p>;
  return (
    <div className="space-y-3">
      {state === "outside" && <p className="rounded-2xl bg-gold-300/40 p-4 font-semibold" role="status">{messages.outside}</p>}
      {state === "failed" && <p className="rounded-2xl bg-berry-500/10 p-4 font-semibold text-berry-600" role="status">{messages.failed}</p>}
      <button type="button" onClick={run} disabled={state === "busy"} className="btn btn-gold">{button}</button>
    </div>
  );
}
