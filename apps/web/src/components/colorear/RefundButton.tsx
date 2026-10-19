"use client";
import { useState } from "react";
import type { ColorearLang } from "@lumen/config";
import { COLOREAR_COPY } from "@/lib/colorear-copy";

export function RefundButton({ token, lang }: { token: string; lang: ColorearLang }) {
  const c = COLOREAR_COPY[lang].refundPage;
  const [s, setS] = useState<"" | "busy" | "done" | "fail">("");
  async function go() {
    setS("busy");
    const r = await fetch("/api/colorear/refund", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ t: token }) }).catch(() => null);
    setS(r?.ok ? "done" : "fail");
  }
  if (s === "done") return <p className="mt-4 font-bold">{c.done}</p>;
  return (
    <>
      <button type="button" disabled={s === "busy"} onClick={() => void go()} className="mt-4 inline-flex min-h-[52px] items-center rounded-xl bg-lapiz-teal px-6 font-semibold text-white disabled:opacity-60">{c.button}</button>
      {s === "fail" && <p role="alert" className="mt-3 font-bold text-lapiz-error">{c.fail}</p>}
    </>
  );
}
