"use client";
import { useRef, useState } from "react";

type Labels = { allow: string; denied: string; granted: string; stubNote: string; unsupported: string };

/**
 * Web call page (stub). Asks for the microphone with an explicit button (the web equivalent of the "press 1" step) and
 * checks that it works; it then stops the stream. The ElevenLabs WebRTC session (signed URL, telephony cost 0) is not
 * connected yet: see docs/arquitectura/pendientes-cuentas.md. Legal must approve the on-page prelude before this goes live.
 */
export function WebCall({ labels }: { labels: Labels }) {
  const [state, setState] = useState<"idle" | "asking" | "granted" | "denied" | "unsupported">("idle");
  const stream = useRef<MediaStream | null>(null);

  async function allow() {
    if (!navigator.mediaDevices?.getUserMedia) return setState("unsupported");
    setState("asking");
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current.getTracks().forEach((t) => t.stop());
      setState("granted");
    } catch {
      setState("denied");
    }
  }

  return (
    <div className="space-y-3">
      {state !== "granted" && (<button type="button" onClick={allow} disabled={state === "asking"} className="btn btn-gold">{labels.allow}</button>)}
      <div role="status" aria-live="polite">
        {state === "denied" && <p className="rounded-2xl bg-berry-500/10 p-4 font-semibold text-berry-600">{labels.denied}</p>}
        {state === "unsupported" && <p className="rounded-2xl bg-berry-500/10 p-4 font-semibold text-berry-600">{labels.unsupported}</p>}
        {state === "granted" && (
          <p className="rounded-2xl bg-holly-500/10 p-4 font-semibold text-holly-600">{labels.granted} {labels.stubNote}</p>
        )}
      </div>
    </div>
  );
}
