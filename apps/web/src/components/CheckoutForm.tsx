"use client";
import { useMemo, useRef, useState } from "react";
import { send } from "./Track";
import type { FieldKey, FormCopy } from "@/lib/copy";

export interface FormProps {
  slug: "es" | "es-es" | "en";
  country: string;
  variant: "single" | "bundle";
  creative: string;
  callingCode: string;
  timezones: string[];
  defaultTimezone: string;
  twelveHour: boolean;
  summary: string;
  payLabel: string;
  /** Serializable copy: the server page replaces the function fields with templates ("{tz}", "{a}", "{b}"). */
  copy: FormCopy;
  aviso: { title: string; intro: string; sections: Array<{ heading: string; body: string }>; privacyLink: string; privacyHref: string };
  checkboxes: Array<{ id: string; text: string }>;
  reminder: string;
  refund: string;
  wallets: boolean;
  termsHref: string;
}

const FIRST_HOUR = 8;
const LAST_START_HOUR = 19;

function todayIn(tz: string): string {
  try {
    return new Date().toLocaleDateString("en-CA", { timeZone: tz });
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}
function hourIn(tz: string): number {
  try {
    return Number(new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hourCycle: "h23" }).format(new Date())) % 24;
  } catch {
    return new Date().getHours();
  }
}
function fmtHour(h: number, twelve: boolean): string {
  if (!twelve) return `${h}:00`;
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:00 ${suffix}`;
}

export function CheckoutForm(p: FormProps) {
  const [tz, setTz] = useState(() => {
    try {
      const guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return p.timezones.includes(guess) ? guess : p.defaultTimezone;
    } catch {
      return p.defaultTimezone;
    }
  });
  const [showTz, setShowTz] = useState(false);
  const [date, setDate] = useState("");
  const [windowHour, setWindowHour] = useState<number | "">("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldKey | "generic" | "rate", string>>>({});
  const started = useRef(false);

  const today = useMemo(() => todayIn(tz), [tz]);
  const nowHour = useMemo(() => hourIn(tz), [tz]);
  const allChecked = p.checkboxes.every((c) => checked[c.id]);
  const hours = Array.from({ length: LAST_START_HOUR - FIRST_HOUR + 1 }, (_, i) => FIRST_HOUR + i);
  const pastToday = (h: number) => date === today && h + 2 <= nowHour + 1;

  function onStart() {
    if (started.current) return;
    started.current = true;
    send("form_started", p.slug, p.country, p.creative);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setErrors({});
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: p.slug,
          country: p.country,
          variant: p.variant,
          creative: p.creative,
          email: f.get("email"),
          phone: f.get("phone"),
          childName: f.get("childName"),
          childAge: f.get("childAge"),
          details: f.get("details"),
          date,
          windowStartHour: windowHour === "" ? NaN : windowHour,
          timezone: tz,
          checkboxIds: p.checkboxes.filter((c) => checked[c.id]).map((c) => c.id),
        }),
      });
      const j = (await res.json()) as { ok: boolean; url?: string; errors?: Record<string, string> };
      if (j.ok && j.url) {
        window.location.assign(j.url);
        return;
      }
      const next: Partial<Record<FieldKey | "generic" | "rate", string>> = {};
      for (const k of Object.keys(j.errors ?? {})) next[(k in p.copy.errors ? k : "generic") as FieldKey] = p.copy.errors[(k in p.copy.errors ? k : "generic") as FieldKey];
      if (!Object.keys(next).length) next.generic = p.copy.errors.generic;
      setErrors(next);
      setBusy(false);
      document.getElementById("form-errors")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch {
      setErrors({ generic: p.copy.errors.generic });
      setBusy(false);
    }
  }

  const err = (k: FieldKey) => errors[k];
  const L = p.copy.labels;
  const opt = ` (${p.copy.optional})`;

  return (
    <form onSubmit={onSubmit} onFocusCapture={onStart} noValidate className="space-y-5" aria-describedby="form-errors">
      <div id="form-errors" aria-live="polite" role="status">
        {Object.keys(errors).length > 0 && (
          <ul className="rounded-2xl border-2 border-berry-500 bg-berry-500/10 p-4 text-sm font-semibold text-berry-600">
            {Object.entries(errors).map(([k, v]) => (<li key={k}>{v}</li>))}
          </ul>
        )}
      </div>

      <div>
        <label htmlFor="email" className="label">{L.email}</label>
        <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required className="field" aria-invalid={!!err("email")} />
        <p className="mt-1 text-xs text-night-900/65">{p.copy.hints.email}</p>
      </div>

      <div>
        <label htmlFor="phone" className="label">{L.phone}</label>
        <div className="flex gap-2">
          <span className="flex min-h-[52px] items-center rounded-2xl border-2 border-night-700/20 bg-cream-100 px-3 font-semibold" aria-hidden>+{p.callingCode}</span>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" required className="field" aria-invalid={!!err("phone")} />
        </div>
        <p className="mt-1 text-xs text-night-900/65">{p.copy.hints.phone}</p>
      </div>

      <div className="grid grid-cols-[1fr_96px] gap-3">
        <div>
          <label htmlFor="childName" className="label">{L.childName}</label>
          <input id="childName" name="childName" type="text" autoComplete="off" autoCapitalize="words" maxLength={30} required className="field" aria-invalid={!!err("childName")} />
        </div>
        <div>
          <label htmlFor="childAge" className="label">{L.childAge}<span className="sr-only">{opt}</span></label>
          <input id="childAge" name="childAge" type="number" inputMode="numeric" min={1} max={17} autoComplete="off" className="field" aria-invalid={!!err("childAge")} />
        </div>
      </div>
      <p className="-mt-3 text-xs text-night-900/65">{p.copy.hints.childName}</p>

      <div>
        <label htmlFor="details" className="label">{L.details}{opt}</label>
        <textarea id="details" name="details" rows={2} maxLength={140} autoComplete="off" className="field min-h-[84px] py-3" aria-invalid={!!err("details")} />
        <p className="mt-1 text-xs text-night-900/65">{p.copy.hints.details}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="label">{L.date}</label>
          <input id="date" type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)} className="field" aria-invalid={!!err("date")} />
        </div>
        <div>
          <label htmlFor="window" className="label">{L.window}</label>
          <select id="window" required value={windowHour} onChange={(e) => setWindowHour(e.target.value === "" ? "" : Number(e.target.value))} className="field" aria-invalid={!!err("window")}>
            <option value="" disabled>--</option>
            {hours.map((h) => (
              <option key={h} value={h} disabled={pastToday(h)}>{p.copy.windowOptionTpl.replace("{a}", fmtHour(h, p.twelveHour)).replace("{b}", fmtHour(h + 2, p.twelveHour))}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="-mt-3 text-xs text-night-900/65">
        {p.copy.hints.window} {p.copy.timezoneTpl.replace("{tz}", tz.replace(/_/g, " "))}.{" "}
        {p.timezones.length > 1 && (
          <button type="button" className="underline underline-offset-2" onClick={() => setShowTz((v) => !v)}>{p.copy.changeTimezone}</button>
        )}
      </p>
      {showTz && (
        <select aria-label={p.copy.changeTimezone} value={tz} onChange={(e) => setTz(e.target.value)} className="field">
          {p.timezones.map((z) => (<option key={z} value={z}>{z.replace(/_/g, " ")}</option>))}
        </select>
      )}

      <section aria-labelledby="notice" className="rounded-3xl border-2 border-night-900 bg-white p-5">
        <h2 id="notice" className="font-display text-xl font-bold">{p.copy.noticeTitle}</h2>
        <h3 className="mt-2 font-bold">{p.aviso.title}</h3>
        <p className="mt-1 text-sm">{p.aviso.intro}</p>
        <dl className="mt-3 space-y-2 text-sm">
          {p.aviso.sections.map((s) => (
            <div key={s.heading}>
              <dt className="font-bold">{s.heading}</dt>
              <dd className="text-night-900/85">{s.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm"><a href={p.aviso.privacyHref} target="_blank" rel="noopener" className="underline underline-offset-2">{p.aviso.privacyLink}</a></p>
      </section>

      <fieldset className="space-y-3">
        <legend className="mb-1 font-display text-xl font-bold">{p.copy.consentTitle}</legend>
        {p.checkboxes.map((c) => (
          <label key={c.id} className="flex cursor-pointer gap-3 rounded-2xl border border-night-700/20 bg-white p-3 text-sm leading-snug">
            <input type="checkbox" name={c.id} checked={!!checked[c.id]} onChange={(e) => setChecked((s) => ({ ...s, [c.id]: e.target.checked }))} className="mt-0.5 h-6 w-6 shrink-0 accent-holly-500" />
            <span>
              {c.text}
              {c.id === "C6" && (<> <a href={p.termsHref} target="_blank" rel="noopener" className="underline underline-offset-2">&#8599;</a></>)}
            </span>
          </label>
        ))}
        <p className="text-sm text-night-900/75">{p.reminder}</p>
      </fieldset>

      <div className="sticky bottom-0 -mx-4 border-t border-night-700/10 bg-cream-50/95 px-4 pb-4 pt-3 backdrop-blur">
        <p className="mb-2 text-center text-sm font-semibold">{p.summary}</p>
        <button type="submit" disabled={!allChecked || busy} className="btn btn-gold">{busy ? p.copy.paying : p.payLabel}</button>
        {p.wallets && <p className="mt-2 text-center text-xs text-night-900/70">{p.copy.wallets}</p>}
        <p className="mt-1 text-center text-xs text-night-900/70">{p.refund}</p>
        <p className="mt-1 text-center text-xs text-night-900/55">{p.copy.secure}</p>
      </div>
    </form>
  );
}
