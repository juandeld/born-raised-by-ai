"use client";
import { useState } from "react";

/** Test-mode payment buttons for a colorear order (Pintoria look). Posts to the same endpoint as the Santa page; the server decides whether it is open. */
export function MockPay({ order, checkout }: { order: string; checkout: string }) {
  const [busy, setBusy] = useState(false);
  async function pay(outcome: "success" | "fail") {
    setBusy(true);
    const res = await fetch("/api/mock-pay", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ order, checkout, outcome }) });
    const j = (await res.json().catch(() => ({}))) as { ok?: boolean; redirect?: string };
    if (j.ok && j.redirect) window.location.assign(j.redirect);
    else setBusy(false);
  }
  return (
    <div className="space-y-3">
      <button type="button" className="c-btn c-btn-block min-h-[52px]" disabled={busy} onClick={() => void pay("success")}>Pay (test) / Pagar (prueba)</button>
      <button type="button" className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-lapiz-ink/30 bg-white px-4 font-bold" disabled={busy} onClick={() => void pay("fail")}>Fail payment / Pago fallido</button>
    </div>
  );
}
