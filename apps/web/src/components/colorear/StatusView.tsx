"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ColorearLang } from "@lumen/config";
import { COLOREAR_THEMES } from "@lumen/config";
import { COLOREAR_COPY } from "@/lib/colorear-copy";
import { ThemeIcon } from "./ThemeIcon";

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
  variant: string;
  kind: "main" | "add" | "credit";
  parentToken: string | null;
  credits: { left: number; total: number; until: string } | null;
  creditsExpired: boolean;
  books: Array<{ token: string; label: string; phase: "working" | "ready"; kind: "credit" | "add" }>;
  offer: { price: string; until: string; sig: string; hoursLeft: number; payNotice: string } | null;
  legal: { characters: string | null; offerTerms: string | null; deleteButton: string | null };
}

const box = "rounded-2xl border border-lapiz-line bg-white p-6";
const btn = "inline-flex min-h-[56px] items-center justify-center rounded-xl px-8 text-lg font-semibold transition-colors hover:opacity-90";

/** Theme tiles (same look as the form) plus a free-text field. Reports the choice upward; the parent button does the work. */
function AdventurePicker({ lang, name, value, onChange }: { lang: ColorearLang; name: string; value: { themeId: string; theme: string }; onChange: (v: { themeId: string; theme: string }) => void }) {
  const c = COLOREAR_COPY[lang].status.more;
  const [all, setAll] = useState(false);
  const list = all ? COLOREAR_THEMES : COLOREAR_THEMES.slice(0, 9);
  return (
    <div>
      <div role="radiogroup" aria-label={c.pick} className="grid grid-cols-3 gap-2">
        {list.map((t) => {
          const on = value.themeId === t.id;
          return (
            <label key={t.id} className={`relative flex min-h-[88px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border bg-white px-1.5 py-2.5 text-center transition-colors focus-within:ring-4 focus-within:ring-lapiz-gold/60 hover:bg-lapiz-mist ${on ? "border-[2.5px] border-lapiz-teal bg-lapiz-tint" : "border-lapiz-line"}`}>
              <input type="radio" name={name} value={t.id} checked={on} className="sr-only" onChange={() => onChange({ themeId: t.id, theme: t[lang] })} onClick={() => { if (on) onChange({ themeId: "", theme: "" }); }} />
              <ThemeIcon id={t.id} className={`h-9 w-9 ${on ? "text-lapiz-teal-dark" : "text-lapiz-ink"}`} />
              <span className="text-[13px] font-semibold leading-tight">{t[lang]}</span>
            </label>
          );
        })}
      </div>
      {!all && <button type="button" onClick={() => setAll(true)} className="mt-2 inline-flex min-h-[44px] items-center text-sm font-bold underline underline-offset-4">{c.showAll}</button>}
      <label className="mt-3 block text-sm font-semibold">
        {c.own}
        <input className="c-field" value={value.themeId ? "" : value.theme} maxLength={50} placeholder={c.ph} onChange={(e) => onChange({ themeId: "", theme: e.target.value })} />
      </label>
    </div>
  );
}

export function StatusView({ token, initial }: { token: string; initial: StatusDto }) {
  const [st, setSt] = useState<StatusDto>(initial);
  const [pdf, setPdf] = useState<string | null>(null);
  const [survey, setSurvey] = useState<"" | "sent">("");
  const [refund, setRefund] = useState<"" | "busy" | "done" | "fail">("");
  const c = COLOREAR_COPY[st.lang].status;
  /** An order that was never charged is cancelled, not refunded (st.testMode). */
  const nc = COLOREAR_COPY[st.lang].noCharge;
  const lang = st.lang;
  const stopped = useRef(false);
  const [pick, setPick] = useState({ themeId: "", theme: "" });
  const [busy, setBusy] = useState<"" | "credit" | "offer" | "del">("");
  const [moreErr, setMoreErr] = useState("");
  const [delMsg, setDelMsg] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const viewed = useRef(false);

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
  const offerUntil = st.offer?.until;
  useEffect(() => {
    if (!offerUntil) return;
    const id = setInterval(() => setNow(Date.now()), 60_000);
    if (!viewed.current) {
      viewed.current = true;
      void fetch("/api/colorear/track", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ event: "upsell_viewed", t: token }) }).catch(() => undefined);
    }
    return () => clearInterval(id);
  }, [offerUntil, token]);

  async function post(path: string, body: unknown) {
    const r = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    return { ok: !!r?.ok, json: (await r?.json().catch(() => ({}))) as { token?: string; url?: string; message?: string } };
  }
  async function useCredit() {
    setBusy("credit"); setMoreErr("");
    const r = await post("/api/colorear/credito", { t: token, theme: pick.theme, themeId: pick.themeId });
    if (r.ok && r.json.token) { window.location.assign(`/colorear/confirmacion/${r.json.token}`); return; }
    setMoreErr(c.more.error); setBusy("");
  }
  async function buyOffer() {
    if (!st.offer) return;
    setBusy("offer"); setMoreErr("");
    const r = await post("/api/colorear/oferta", { t: token, s: st.offer.sig, theme: pick.theme, themeId: pick.themeId });
    if (r.ok && r.json.url) { window.location.assign(r.json.url); return; }
    setMoreErr(c.offer.error); setBusy("");
  }
  async function deleteCharacters() {
    setBusy("del");
    const r = await post("/api/colorear/personajes", { t: token });
    setBusy("");
    if (r.ok) { setDelMsg(r.json.message ?? c.offer.deleteDone); void poll(); }
  }
  async function doRefund() {
    setRefund("busy");
    const r = await fetch("/api/colorear/refund", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ t: token }) }).catch(() => null);
    setRefund(r?.ok ? "done" : "fail");
    if (r?.ok) void poll();
  }

  const stageKey = st.stage === "scenes" ? "pages" : st.stage;
  const pct = Math.round(st.progress * 100);
  const date = st.expiresAt ? new Date(st.expiresAt).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";

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
            <a href={`${pdf}&download=1`} className={`${btn} mt-5 w-full bg-lapiz-coral text-white`}>{c.ready.download}</a>
          ) : (
            <p className="mt-4 font-bold">...</p>
          )}
          {date && <p className="mt-3 text-sm">{c.ready.expires(date)}</p>}
          <p className="mt-1 text-sm">{c.ready.email}</p>
          <p className="mt-1 text-sm">{c.ready.print}</p>
          {st.notes.some((n) => n.startsWith("photo_")) && <p className="mt-3 rounded-2xl bg-lapiz-gold-tint p-3 text-sm font-semibold">{lang === "es" ? "No pudimos usar alguna foto y dibujamos a esa persona a partir de su descripción." : "We could not use one of the photos, so that person was drawn from the description."}</p>}
          {st.legal.characters && <p className="mt-3 text-sm">{st.legal.characters}</p>}
          {st.legal.deleteButton && (
            <div className="mt-2">
              {delMsg ? <p className="text-sm font-bold">{delMsg}</p> : <button type="button" disabled={busy === "del"} onClick={() => void deleteCharacters()} className="inline-flex min-h-[44px] items-center text-sm font-bold underline underline-offset-4">{st.legal.deleteButton}</button>}
            </div>
          )}
          {st.kind === "credit" && st.parentToken && <a href={`/colorear/entrega/${st.parentToken}`} className="mt-4 inline-flex min-h-[44px] items-center font-bold underline underline-offset-4">{c.more.all}</a>}
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
            {refund === "" && st.kind !== "credit" && <button type="button" onClick={() => void doRefund()} className="min-h-[44px] font-bold underline">{st.testMode ? nc.ready.cancel : c.ready.refund}</button>}
            {refund === "busy" && <span>...</span>}
            {refund === "done" && <span className="font-bold">{st.testMode ? nc.ready.cancelDone : c.ready.refundDone}</span>}
            {refund === "fail" && <span className="font-bold text-lapiz-error">{st.testMode ? nc.ready.cancelFail : c.ready.refundFail}</span>}
          </div>
        </div>
      )}

      {st.phase === "ready" && st.credits && (
        <section className={`${box} border-[2.5px] border-lapiz-teal`} aria-labelledby="more-title">
          <h2 id="more-title" className="c-h text-2xl">{c.more.left(st.credits.left)}</h2>
          <p className="mt-1">{c.more.text(new Date(st.credits.until).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }))}</p>
          <p className="c-h mt-4 text-lg">{c.more.pick}</p>
          <div className="mt-2"><AdventurePicker lang={lang} name="credit-theme" value={pick} onChange={setPick} /></div>
          {moreErr && <p role="alert" className="mt-3 font-semibold text-lapiz-error">{moreErr}</p>}
          <button type="button" disabled={busy !== ""} onClick={() => void useCredit()} className={`${btn} mt-4 w-full bg-lapiz-coral text-white`}>{busy === "credit" ? c.more.creating : c.more.create}</button>
        </section>
      )}
      {st.phase === "ready" && st.creditsExpired && !st.credits && <p className={box}>{c.more.expired}</p>}
      {st.phase === "ready" && st.offer && (
        <section className={`${box} border-[2.5px] border-lapiz-teal`} aria-labelledby="offer-title">
          <h2 id="offer-title" className="c-h text-2xl">{c.offer.title}</h2>
          <p className="mt-1">{c.offer.text(st.offer.price)}</p>
          <p className="mt-2 text-sm font-bold">{c.offer.until(new Date(st.offer.until).toLocaleString(lang === "en" ? "en-US" : "es-MX", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }))} · {c.offer.left(Math.max(0, Math.ceil((new Date(st.offer.until).getTime() - now) / 3_600_000)))}</p>
          <p className="c-h mt-4 text-lg">{c.more.pick}</p>
          <div className="mt-2"><AdventurePicker lang={lang} name="offer-theme" value={pick} onChange={setPick} /></div>
          {st.legal.offerTerms && <p className="mt-3 text-sm">{st.legal.offerTerms}</p>}
          {moreErr && <p role="alert" className="mt-3 font-semibold text-lapiz-error">{moreErr}</p>}
          <p className="mt-3 text-sm">{st.offer.payNotice}</p>
          <button type="button" disabled={busy !== ""} onClick={() => void buyOffer()} className={`${btn} mt-3 w-full bg-lapiz-coral text-white`}>{busy === "offer" ? c.offer.paying : c.offer.pay(st.offer.price)}</button>
        </section>
      )}
      {st.phase === "ready" && st.books.length > 0 && (
        <section className={box} aria-labelledby="books-title">
          <h2 id="books-title" className="c-h text-xl">{c.more.books}</h2>
          <ul className="mt-3 divide-y divide-lapiz-line">
            {st.books.map((b, i) => (
              <li key={b.token} className="flex min-h-[56px] items-center justify-between gap-3 py-2">
                <span className="min-w-0"><span className="block font-semibold">{c.more.adventure(i + 2)}</span><span className="block truncate text-sm text-lapiz-muted">{b.label}</span></span>
                <a href={`/colorear/${b.phase === "ready" ? "entrega" : "confirmacion"}/${b.token}`} className="inline-flex min-h-[44px] shrink-0 items-center rounded-xl border border-lapiz-ink/30 bg-white px-4 font-bold">{b.phase === "ready" ? c.more.ready : c.more.working} · {c.more.open}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {st.phase === "failed" && st.kind === "credit" && (
        <div className={box}>
          <h1 className="text-2xl font-bold">{c.more.failedCredit.title}</h1>
          <p className="mt-2">{c.more.failedCredit.text}</p>
          {st.parentToken && <a href={`/colorear/entrega/${st.parentToken}`} className={`${btn} mt-4 bg-lapiz-coral text-white`}>{c.more.all}</a>}
        </div>
      )}
      {st.phase === "failed" && st.kind !== "credit" && <div className={box}><h1 className="text-2xl font-bold">{c.failed.title}</h1><p className="mt-2">{st.testMode ? nc.failed.text : c.failed.text}</p></div>}
      {st.phase === "refunded" && <div className={box}><h1 className="text-2xl font-bold">{st.testMode ? nc.refunded.title : c.refunded.title}</h1><p className="mt-2">{st.testMode ? nc.refunded.text : c.refunded.text}</p></div>}
      {st.phase === "gone" && <div className={box}><h1 className="text-2xl font-bold">{c.gone.title}</h1><p className="mt-2">{c.gone.text}</p></div>}
    </div>
  );
}
