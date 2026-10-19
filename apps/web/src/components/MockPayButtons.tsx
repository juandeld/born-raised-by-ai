"use client";
import { useState } from "react";

export function MockPayButtons({ order, checkout }: { order: string; checkout: string }) {
  const [busy, setBusy] = useState(false);
  async function pay(outcome: "success" | "fail") {
    setBusy(true);
    const res = await fetch("/api/mock-pay", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ order, checkout, outcome }) });
    const j = (await res.json()) as { ok: boolean; redirect?: string };
    if (j.ok && j.redirect) window.location.assign(j.redirect);
    else setBusy(false);
  }
  return (
    <div className="space-y-3">
      <button type="button" className="btn btn-gold" disabled={busy} onClick={() => pay("success")}>Pay (test) / Pagar (prueba)</button>
      <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => pay("fail")}>Fail payment / Pago fallido</button>
    </div>
  );
}
