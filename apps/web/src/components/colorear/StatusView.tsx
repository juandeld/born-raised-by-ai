"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ColorearLang } from "@lumen/config";
import { COLOREAR_COPY } from "@/lib/colorear-copy";

export interface StatusDto {
  phase: "awaiting_payment" | "working" | "ready" | "failed" | "refunded" | "gone";
  progress: number;
  stage: string;
  lang: ColorearLang;
  names: string;
  testMode: boolean;
  characters: number[];
  pages: number[];
  notes: string[];
  expiresAt: string | null;
}

const box = "rounded-2xl border border-lapiz-line bg-white p-6";
const btn = "inline-flex min-h-[56px] items-center justify-center rounded-xl px-8 text-lg font-semibold transition-colors hover:opacity-90";

export function StatusView({ token, initial }: { token: string; initial: StatusDto }) {
  const [st, setSt] = useState<StatusDto>(initial);
  const [pdf, setPdf] = useState<string | null>(null);
  const [survey, setSurvey] = useState<"" | "sent">("");
  const [refund, setRefund] = useState<"" | "busy" | "done" | "fail">("");
  const c = COLOREAR_COPY[st.lang].status;
  const lang = st.lang;
  const stopped = useRef(false);

  const poll = useCallback(async () => {
    try {
      const r = await fetch(`/api/colorear/estado?t=${token}`, { cache: "no-store" });
      if (!r.ok) return;
      const j = (await r.json()) as { ok: boolean; status: StatusDto; pdf: string | null };
      if (j.ok) {
        setSt(j.status);
        setPdf(j.pdf);
        if (["ready", "failed", "refunded", "gone"].includes(j.status.phase)) stopped.current = true;
      }
    } catch {
      /* the next poll retries */
    }
  }, [token]);

  useEffect(() => {
    void poll();
    const id = setInterval(() => {
      if (!stopped.current && !document.hidden) void poll();
    }, 3000);
    return () => clearInterval(id);
  }, [poll]);

  async function answer(a: "loved" | "ok" | "bad") {
    setSurvey("sent");
    await fetch("/api/colorear/survey", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ t: token, answer: a }) }).catch(() => undefined);
  }
  async function doRefund() {
    setRefund("busy");
    const r = await fetch("/api/colorear/refund", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ t: token }) }).catch(() => null);
    setRefund(r?.ok ? "done" : "fail");
    if (r?.ok) void poll();
  }

  const stageKey = st.stage === "scenes" ? "pages" : st.stage;
  const pct = Math.round(st.progress * 100);
  const date = st.expiresAt ? new Date(st.expiresAt).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div className="space-y-5">
      {st.testMode && <p className="rounded-full border border-lapiz-line bg-lapiz-gold-tint px-4 py-1 text-center text-sm font-semibold">{c.test}</p>}

      {st.phase === "awaiting_payment" && (
        <div className={box}>
          <h1 className="text-2xl font-bold">{c.pendingPay.title}</h1>
          <p className="mt-2">{c.pendingPay.text}</p>
        </div>
      )}

      {st.phase === "working" && (
        <div className={box} aria-live="polite">
          <h1 className="text-2xl font-bold">{c.working.title(st.names)}</h1>
          <p className="mt-2">{c.working.text}</p>
          <div className="mt-5" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-6 overflow-hidden rounded-xl bg-lapiz-paper">
              <div className="h-full bg-lapiz-teal transition-all duration-700" style={{ width: `${Math.max(4, pct)}%` }} />
            </div>
            <p className="mt-2 font-bold">{c.working.stages[stageKey] ?? c.working.stages.queued} · {pct}%</p>
          </div>
          {(st.characters.length > 0 || st.pages.length > 0) && (
            <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {st.characters.map((k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={`c${k}`} src={`/api/colorear/imagen?t=${token}&k=c${k}`} alt="" className="aspect-square w-full rounded-xl border border-lapiz-line bg-white object-contain" />
              ))}
              {st.pages.filter((n) => n > 0).slice(-8).map((n) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={`p${n}`} src={`/api/colorear/imagen?t=${token}&k=p${n}`} alt="" className="aspect-[2/3] w-full rounded-xl border border-lapiz-line bg-white object-contain" />
              ))}
            </div>
          )}
          <p className="mt-4 text-sm opacity-80">{c.working.keep}</p>
        </div>
      )}

      {st.phase === "ready" && (
        <div className={box}>
          <h1 className="text-3xl font-bold">{c.ready.title(st.names)}</h1>
          <p className="mt-2">{c.ready.text}</p>
          {pdf ? (
            <a href={`${pdf}&download=1`} className={`${btn} mt-5 w-full bg-lapiz-teal text-white`}>{c.ready.download}</a>
          ) : (
            <p className="mt-4 font-bold">...</p>
          )}
          {date && <p className="mt-3 text-sm">{c.ready.expires(date)}</p>}
          <p className="mt-1 text-sm">{c.ready.email}</p>
          <p className="mt-1 text-sm">{c.ready.print}</p>
          {st.notes.some((n) => n.startsWith("photo_")) && <p className="mt-3 rounded-2xl bg-lapiz-gold-tint p-3 text-sm font-semibold">{lang === "es" ? "No pudimos usar alguna foto y dibujamos a esa persona a partir de su descripción." : "We could not use one of the photos, so that person was drawn from the description."}</p>}
          <div className="mt-6 border-t-2 border-lapiz-line pt-4">
            {survey ? <p className="font-bold">{c.ready.thanks}</p> : (
              <>
                <p className="font-semibold">{c.ready.survey}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([["loved", c.ready.loved], ["ok", c.ready.ok], ["bad", c.ready.bad]] as const).map(([k, label]) => (
                    <button key={k} type="button" onClick={() => void answer(k)} className="min-h-[44px] rounded-xl border border-lapiz-ink/30 bg-white px-4 font-bold">{label}</button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
            <Link href={`/colorear/${lang}`} className="font-bold underline">{c.ready.again}</Link>
            {refund === "" && <button type="button" onClick={() => void doRefund()} className="font-bold underline">{c.ready.refund}</button>}
            {refund === "busy" && <span>...</span>}
            {refund === "done" && <span className="font-bold">{c.ready.refundDone}</span>}
            {refund === "fail" && <span className="font-bold text-lapiz-error">{c.ready.refundFail}</span>}
          </div>
        </div>
      )}

      {st.phase === "failed" && <div className={box}><h1 className="text-2xl font-bold">{c.failed.title}</h1><p className="mt-2">{c.failed.text}</p></div>}
      {st.phase === "refunded" && <div className={box}><h1 className="text-2xl font-bold">{c.refunded.title}</h1><p className="mt-2">{c.refunded.text}</p></div>}
      {st.phase === "gone" && <div className={box}><h1 className="text-2xl font-bold">{c.gone.title}</h1><p className="mt-2">{c.gone.text}</p></div>}
    </div>
  );
}
