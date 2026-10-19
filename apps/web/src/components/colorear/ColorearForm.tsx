"use client";
import { useEffect, useRef, useState } from "react";
import type { ColorearLang } from "@lumen/config";
import { COLOREAR_COPY } from "@/lib/colorear-copy";
import { PencilIcon, ThemeIcon } from "./ThemeIcon";

export interface CountryLegal {
  country: string;
  label: string;
  price: string;
  checkboxes: Array<{ id: string; text: string }>;
  aviso: { title: string; intro: string; sections: Array<{ heading: string; body: string }>; privacyLink: string };
  refundLine: string;
}

interface Item {
  id: number;
  blob: Blob;
  preview: string;
  name: string;
  role: string;
}

const MAX = 5;
const MAX_INPUT_BYTES = 10 * 1024 * 1024;
/** Each photo must stay under the server limit (900 KB); 5 of them plus the form must fit Vercel's 4.5 MB body. */
const TARGET_BYTES = 640_000;

/** Reads a photo, applies its EXIF rotation, scales it to at most 1280 px and re-encodes it as JPEG (this also strips GPS and metadata). */
async function compress(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  let maxSide = 1280;
  let quality = 0.82;
  for (let i = 0; i < 8; i++) {
    const k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bmp.width * k));
    canvas.height = Math.max(1, Math.round(bmp.height * k));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (blob && blob.size <= TARGET_BYTES) {
      bmp.close();
      return blob;
    }
    quality = Math.max(0.5, quality - 0.08);
    maxSide = Math.round(maxSide * 0.85);
  }
  bmp.close();
  throw new Error("too big");
}

export function ColorearForm({ lang, countries, defaultCountry, themes, creative }: { lang: ColorearLang; countries: Record<string, CountryLegal>; defaultCountry: string; themes: Array<{ id: string; label: string }>; creative: string }) {
  const c = COLOREAR_COPY[lang].form;
  const [items, setItems] = useState<Item[]>([]);
  const [country, setCountry] = useState(defaultCountry);
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [theme, setTheme] = useState("");
  const [themeId, setThemeId] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [photoMsg, setPhotoMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nextId = useRef(1);
  const started = useRef(false);
  const legal = countries[country]!;
  const allChecked = legal.checkboxes.every((k) => checked[k.id]);

  const beacon = (event: "landing_view" | "form_started") => {
    try {
      const body = JSON.stringify({ event, lang, country, creative });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/colorear/track", new Blob([body], { type: "application/json" }));
    } catch {
      /* analytics must never break the page */
    }
  };
  useEffect(() => beacon("landing_view"), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => items.forEach((i) => URL.revokeObjectURL(i.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function addFiles(list: FileList | null) {
    if (!list) return;
    setPhotoMsg("");
    if (!started.current) {
      started.current = true;
      beacon("form_started");
    }
    const room = MAX - items.length;
    const files = Array.from(list);
    if (files.length > room) setPhotoMsg(c.photos.tooMany);
    const added: Item[] = [];
    for (const f of files.slice(0, Math.max(0, room))) {
      if (/heic|heif/i.test(f.type) || /\.(heic|heif)$/i.test(f.name)) { setPhotoMsg(c.photos.heic); continue; }
      if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setPhotoMsg(c.photos.badType); continue; }
      if (f.size > MAX_INPUT_BYTES) { setPhotoMsg(c.photos.tooLarge); continue; }
      try {
        const blob = await compress(f);
        added.push({ id: nextId.current++, blob, preview: URL.createObjectURL(blob), name: "", role: "" });
      } catch {
        setPhotoMsg(c.errors.unreadable!);
      }
    }
    if (added.length) setItems((prev) => [...prev, ...added].slice(0, MAX));
  }
  const patch = (id: number, p: Partial<Item>) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)));
  const remove = (id: number) =>
    setItems((prev) => {
      const gone = prev.find((i) => i.id === id);
      if (gone) URL.revokeObjectURL(gone.preview);
      return prev.filter((i) => i.id !== id);
    });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const local: Record<string, string> = {};
    if (!items.length) local.photos = c.errors.photos!;
    if (items.some((i) => !i.name.trim() || !i.role.trim())) local.persons = c.errors.persons!;
    if (!age) local.age = c.errors.age!;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) local.email = c.errors.email!;
    if (!allChecked) local.consent = c.errors.consent!;
    setErrors(local);
    if (Object.keys(local).length) return;
    setBusy(true);
    const fd = new FormData();
    fd.set("lang", lang);
    fd.set("country", country);
    fd.set("email", email.trim());
    fd.set("age", age);
    fd.set("theme", theme.trim());
    fd.set("themeId", themeId);
    fd.set("creative", creative);
    fd.set("checkboxIds", JSON.stringify(legal.checkboxes.filter((k) => checked[k.id]).map((k) => k.id)));
    items.forEach((it, i) => {
      fd.set(`photo${i + 1}`, new File([it.blob], `photo-${i + 1}.jpg`, { type: "image/jpeg" }));
      fd.set(`name${i + 1}`, it.name.trim());
      fd.set(`role${i + 1}`, it.role.trim());
    });
    try {
      const res = await fetch("/api/colorear/checkout", { method: "POST", body: fd });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; errors?: Record<string, string> };
      if (j.ok && j.url) {
        window.location.assign(j.url);
        return;
      }
      const e2: Record<string, string> = {};
      for (const k of Object.keys(j.errors ?? { generic: "x" })) e2[k] = c.errors[k] ?? c.errors[j.errors?.[k] ?? ""] ?? c.errors.generic!;
      if (res.status === 413) e2.photos = c.errors.unreadable!;
      setErrors(e2);
    } catch {
      setErrors({ generic: c.errors.server! });
    }
    setBusy(false);
  }

  const card = "c-card";
  const input = "c-field";
  const err = (k: string) => (errors[k] ? <p role="alert" className="mt-2 font-semibold text-lapiz-error">{errors[k]}</p> : null);
  const stepHead = (n: number, title: string, hint?: string, id?: string) => (
    <div className="flex items-start gap-3">
      <span aria-hidden className="c-h grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lapiz-teal text-base text-white">{n}</span>
      <div>
        <h3 id={id} className="c-h text-xl">{title}</h3>
        {hint && <p className="mt-0.5 text-sm text-lapiz-muted">{hint}</p>}
      </div>
    </div>
  );
  const pickTheme = (id: string, label: string) => { setThemeId(id); setTheme(label); };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div>
        <h2 className="c-h c-rule text-3xl md:text-4xl">{c.title}</h2>
        <p className="mt-3">{c.intro}</p>
      </div>

      <div className={card}>
        {stepHead(1, c.photos.label, c.photos.hint)}
        <label className={`mt-4 flex min-h-[64px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-lapiz-teal/70 bg-lapiz-tint px-4 text-center font-semibold text-lapiz-teal-dark transition-colors hover:bg-lapiz-tint/60 focus-within:ring-4 focus-within:ring-lapiz-gold/60 ${items.length >= MAX ? "pointer-events-none opacity-50" : ""}`}>
          <svg aria-hidden viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
          {c.photos.add} · {c.photos.count(items.length)}
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => { void addFiles(e.target.files); e.target.value = ""; }} />
        </label>
        {photoMsg && <p role="alert" className="mt-2 font-semibold text-lapiz-error">{photoMsg}</p>}
        {err("photos")}

        {items.length > 0 && (
          <div className="mt-6 border-t border-lapiz-line pt-5">
            <p className="c-h text-lg">{c.people.label}</p>
            <p className="text-sm text-lapiz-muted">{c.people.hint}</p>
            <ul className="mt-3 space-y-4">
              {items.map((it, idx) => (
                <li key={it.id} className="flex gap-3 rounded-xl border border-lapiz-line bg-lapiz-paper p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.preview} alt="" className="h-24 w-24 shrink-0 rounded-lg border border-lapiz-line object-cover" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="block text-sm font-semibold">
                      {c.people.name} {idx + 1}
                      <input className={input} value={it.name} maxLength={30} autoComplete="off" onChange={(e) => patch(it.id, { name: e.target.value })} />
                    </label>
                    <label className="block text-sm font-semibold">
                      {c.people.role}
                      <input className={input} value={it.role} maxLength={40} list="roles" placeholder={c.people.rolePh} onChange={(e) => patch(it.id, { role: e.target.value })} />
                    </label>
                    <button type="button" className="inline-flex min-h-[44px] items-center text-sm font-semibold underline underline-offset-4" onClick={() => remove(it.id)}>{c.people.remove}</button>
                  </div>
                </li>
              ))}
            </ul>
            <datalist id="roles">{c.people.roleSuggestions.map((r) => <option key={r} value={r} />)}</datalist>
            {err("persons")}
          </div>
        )}
      </div>

      <div className={card}>
        <label className="block">
          <span className="c-h text-lg">{c.age.label}</span>
          <span className="block text-sm text-lapiz-muted">{c.age.hint}</span>
          <select className={input} value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">-</option>
            {[3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        {err("age")}
      </div>

      <fieldset className="rounded-2xl border border-lapiz-teal/50 bg-white p-5 sm:p-6" aria-describedby="theme-hint">
        <legend className="sr-only">{c.theme.label}</legend>
        {stepHead(2, c.theme.label, undefined)}
        <p id="theme-hint" className="mt-1 pl-12 text-sm text-lapiz-muted">{c.theme.hint}</p>
        <div role="radiogroup" aria-label={c.theme.label} className="mt-5 grid grid-cols-3 gap-2 sm:gap-2.5 md:grid-cols-4">
          {themes.map((t) => {
            const on = themeId === t.id;
            return (
              <label key={t.id} className={`c-theme relative flex min-h-[96px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border bg-white px-1.5 py-3 text-center transition-colors hover:border-lapiz-teal/70 hover:bg-lapiz-mist ${on ? "border-lapiz-teal" : "border-lapiz-line"}`}>
                <input
                  type="radio"
                  name="adventure"
                  value={t.id}
                  checked={on}
                  className="sr-only"
                  onChange={() => pickTheme(t.id, t.label)}
                  onClick={() => { if (on) pickTheme("", ""); }}
                />
                <ThemeIcon id={t.id} className={`h-10 w-10 ${on ? "text-lapiz-teal-dark" : "text-lapiz-ink"}`} />
                <span className="text-[13px] font-semibold leading-tight sm:text-sm">{t.label}</span>
                <span aria-hidden className="c-check absolute right-1.5 top-1.5 grid h-5 w-5 scale-75 place-items-center rounded-full bg-lapiz-teal opacity-0 transition">
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.500l3.200 3L13 4.500" /></svg>
                </span>
                {on && <span className="sr-only">{c.theme.picked}</span>}
              </label>
            );
          })}
        </div>
        <label className="mt-5 block">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-lapiz-muted"><PencilIcon className="h-[18px] w-[18px]" />{c.theme.own}</span>
          <input className={input} value={theme} maxLength={50} placeholder={c.theme.ph} onChange={(e) => { setTheme(e.target.value); setThemeId(""); }} />
        </label>
        {err("theme")}
      </fieldset>

      <div className={card}>
        <label className="block">
          <span className="flex items-start gap-3">
            <span aria-hidden className="c-h grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lapiz-teal text-base text-white">3</span>
            <span>
              <span className="c-h block text-xl">{c.email.label}</span>
              <span className="block text-sm text-lapiz-muted">{c.email.hint}</span>
            </span>
          </span>
          <input type="email" inputMode="email" autoComplete="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {err("email")}
        {Object.keys(countries).length > 1 && (
          <label className="mt-4 block text-sm font-semibold">
            {c.country.label}
            <select className={input} value={country} onChange={(e) => setCountry(e.target.value)}>
              {Object.values(countries).map((k) => <option key={k.country} value={k.country}>{k.label} ({k.price})</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="rounded-2xl border border-lapiz-line bg-lapiz-gold-tint p-5 sm:p-6">
        <details>
          <summary className="flex min-h-[48px] cursor-pointer items-center font-semibold">{c.aviso}</summary>
          <div className="mt-3 space-y-2 text-sm">
            <p>{legal.aviso.intro}</p>
            {legal.aviso.sections.map((s) => <p key={s.heading}><strong>{s.heading}</strong> {s.body}</p>)}
            <p>{legal.aviso.privacyLink.split(/:\s/)[0]}: <a className="font-semibold underline" href={`/colorear/${lang}/privacidad`} target="_blank" rel="noreferrer">/colorear/{lang}/privacidad</a></p>
          </div>
        </details>
        <p className="c-h mt-4 text-lg">{c.consent}</p>
        <ul className="mt-2 space-y-3">
          {legal.checkboxes.map((k) => (
            <li key={k.id}>
              <label className="flex min-h-[48px] cursor-pointer items-start gap-3 text-sm">
                <input type="checkbox" className="mt-0.5 h-6 w-6 shrink-0 accent-[#1b6b67]" checked={!!checked[k.id]} onChange={(e) => setChecked((p) => ({ ...p, [k.id]: e.target.checked }))} />
                <span>{k.text}</span>
              </label>
            </li>
          ))}
        </ul>
        {err("consent")}
      </div>

      <p className="text-sm font-semibold">{legal.refundLine}</p>
      {Object.entries(errors).filter(([k]) => !["photos", "persons", "age", "email", "theme", "consent"].includes(k)).map(([k, v]) => <p key={k} role="alert" className="font-semibold text-lapiz-error">{v}</p>)}
      <button type="submit" disabled={busy} className="c-btn c-btn-block min-h-[60px]">
        {busy ? c.paying : c.pay(legal.price)}
      </button>
    </form>
  );
}
