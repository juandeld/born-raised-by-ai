"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Test mode only: runs the scheduled call now, so the whole flow can be clicked through without waiting for the window. */
export function DevRunCall({ token, real = false }: { token: string; real?: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  async function run() {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (real) {
      let secret = "";
      try { secret = sessionStorage.getItem("dev_run_secret") ?? ""; } catch {}
      if (!secret) secret = window.prompt("DEV_RUN_SECRET") ?? "";
      if (!secret) return;
      try { sessionStorage.setItem("dev_run_secret", secret); } catch {}
      headers["x-dev-secret"] = secret;
    }
    setState("busy");
    const res = await fetch("/api/dev/run-call", { method: "POST", headers, body: JSON.stringify({ token }) });
    const out = (await res.json().catch(() => ({}))) as { outcome?: string; until?: string; reason?: string };
    if (real && out.outcome !== "placed") {
      window.alert(`No se llamó: ${out.outcome ?? res.status} ${out.until ?? out.reason ?? ""}`);
      try { sessionStorage.removeItem("dev_run_secret"); } catch {}
      setState("idle");
      return;
    }
    setState("done");
    router.push(`./../entrega/${token}`);
  }
  return (
    <div className="mt-6 rounded-2xl border-2 border-dashed border-night-700/40 p-4 text-sm">
      <p className="font-semibold">Test mode</p>
      <button type="button" onClick={run} disabled={state === "busy"} className="btn btn-ghost mt-2">{state === "busy" ? "..." : real ? "Call my phone now (REAL call)" : "Simulate the call now (mock)"}</button>
    </div>
  );
}
