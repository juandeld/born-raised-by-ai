"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Test mode only: runs the scheduled call now, so the whole flow can be clicked through without waiting for the window. */
export function DevRunCall({ token }: { token: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  async function run() {
    setState("busy");
    await fetch("/api/dev/run-call", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
    setState("done");
    router.push(`./../entrega/${token}`);
  }
  return (
    <div className="mt-6 rounded-2xl border-2 border-dashed border-night-700/40 p-4 text-sm">
      <p className="font-semibold">Test mode</p>
      <button type="button" onClick={run} disabled={state === "busy"} className="btn btn-ghost mt-2">{state === "busy" ? "..." : "Simulate the call now (mock)"}</button>
    </div>
  );
}
