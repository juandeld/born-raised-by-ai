"use client";
import { useEffect, useRef, useState } from "react";
import type { ColorearLang } from "@lumen/config";
import { COLOREAR_COPY } from "@/lib/colorear-copy";

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

export function ColorearForm({ lang, countries, defaultCountry, themes, creative }: { lang: ColorearLang; countries: Record<string, CountryLegal>; defaultCountry: string; themes: Array<{ id: string; emoji: string; label: string }>; creative: string }) {
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

  const card = "rounded-3xl border-[3px] border-crayon-ink bg-white p-5";
  const input = "mt-1 block min-h-[48px] w-full rounded-2xl border-[3px] border-crayon-ink bg-white px-4 text-base focus:outline-none focus:ring-4 focus:ring-crayon-yellow";
  const err = (k: string) => (errors[k] ? <p role="alert" className="mt-2 font-bold text-crayon-red">{errors[k]}</p> : null);

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div>
        <h2 className="text-3xl font-black">{c.title}</h2>
        <p className="mt-1">{c.intro}</p>
      </div>

      <div className={card}>
        <p className="text-lg font-extrabold">{c.photos.label}</p>
        <p className="text-sm opacity-80">{c.photos.hint}</p>
        <label className={`mt-3 flex min-h-[56px] cursor-pointer items-center justify-center rounded-full border-[3px] border-dashed border-crayon-ink bg-crayon-sky px-4 font-extrabold ${items.length >= MAX ? "pointer-events-none opacity-50" : ""}`}>
          {c.photos.add} · {c.photos.count(items.length)}
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => { void addFiles(e.target.files); e.target.value = ""; }} />
        </label>
        {photoMsg && <p role="alert" className="mt-2 font-bold text-crayon-red">{photoMsg}</p>}
        {err("photos")}
      </div>

      {items.length > 0 && (
        <div className={card}>
          <p className="text-lg font-extrabold">{c.people.label}</p>
          <p className="text-sm opacity-80">{c.people.hint}</p>
          <ul className="mt-3 space-y-4">
            {items.map((it, idx) => (
              <li key={it.id} className="flex gap-3 rounded-2xl border-2 border-crayon-ink/30 bg-crayon-paper p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.preview} alt="" className="h-24 w-24 shrink-0 rounded-xl border-2 border-crayon-ink object-cover" />
                <div className="min-w-0 flex-1 space-y-2">
                  <label className="block text-sm font-bold">
                    {c.people.name} {idx + 1}
                    <input className={input} value={it.name} maxLength={30} autoComplete="off" onChange={(e) => patch(it.id, { name: e.target.value })} />
                  </label>
                  <label className="block text-sm font-bold">
                    {c.people.role}
                    <input className={input} value={it.role} maxLength={40} list="roles" placeholder={c.people.rolePh} onChange={(e) => patch(it.id, { role: e.target.value })} />
                  </label>
                  <button type="button" className="text-sm font-bold underline" onClick={() => remove(it.id)}>{c.people.remove}</button>
                </div>
              </li>
            ))}
          </ul>
          <datalist id="roles">{c.people.roleSuggestions.map((r) => <option key={r} value={r} />)}</datalist>
          {err("persons")}
        </div>
      )}

      <div className={card}>
        <label className="block">
          <span className="text-lg font-extrabold">{c.age.label}</span>
          <span className="block text-sm opacity-80">{c.age.hint}</span>
          <select className={input} value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">-</option>
            {[3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        {err("age")}
      </div>

      <div className={card}>
        <p className="text-lg font-extrabold">{c.theme.label}</p>
        <p className="text-sm opacity-80">{c.theme.hint}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {themes.map((t) => (
            <button key={t.id} type="button" aria-pressed={themeId === t.id} onClick={() => { const on = themeId === t.id; setThemeId(on ? "" : t.id); setTheme(on ? "" : t.label); }} className={`rounded-full border-2 border-crayon-ink px-3 py-1 text-sm font-bold ${themeId === t.id ? "bg-crayon-yellow" : "bg-white"}`}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        <input className={input} value={theme} maxLength={50} placeholder={c.theme.ph} onChange={(e) => { setTheme(e.target.value); setThemeId(""); }} />
        {err("theme")}
      </div>

      <div className={card}>
        <label className="block">
          <span className="text-lg font-extrabold">{c.email.label}</span>
          <span className="block text-sm opacity-80">{c.email.hint}</span>
          <input type="email" inputMode="email" autoComplete="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {err("email")}
        {Object.keys(countries).length > 1 && (
          <label className="mt-4 block text-sm font-bold">
            {c.country.label}
            <select className={input} value={country} onChange={(e) => setCountry(e.target.value)}>
              {Object.values(countries).map((k) => <option key={k.country} value={k.country}>{k.label} ({k.price})</option>)}
            </select>
          </label>
        )}
      </div>

      <div className={`${card} bg-crayon-sun`}>
        <details>
          <summary className="cursor-pointer text-lg font-extrabold">{c.aviso}</summary>
          <div className="mt-3 space-y-2 text-sm">
            <p>{legal.aviso.intro}</p>
            {legal.aviso.sections.map((s) => <p key={s.heading}><strong>{s.heading}</strong> {s.body}</p>)}
            <p>{legal.aviso.privacyLink.split(/:\s/)[0]}: <a className="font-bold underline" href={`/colorear/${lang}/privacidad`} target="_blank" rel="noreferrer">/colorear/{lang}/privacidad</a></p>
          </div>
        </details>
        <p className="mt-4 font-extrabold">{c.consent}</p>
        <ul className="mt-2 space-y-3">
          {legal.checkboxes.map((k) => (
            <li key={k.id}>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1 h-6 w-6 shrink-0 accent-crayon-red" checked={!!checked[k.id]} onChange={(e) => setChecked((p) => ({ ...p, [k.id]: e.target.checked }))} />
                <span>{k.text}</span>
              </label>
            </li>
          ))}
        </ul>
        {err("consent")}
      </div>

      <p className="text-sm font-semibold">{legal.refundLine}</p>
      {Object.entries(errors).filter(([k]) => !["photos", "persons", "age", "email", "theme", "consent"].includes(k)).map(([k, v]) => <p key={k} role="alert" className="font-bold text-crayon-red">{v}</p>)}
      <button type="submit" disabled={busy} className="inline-flex min-h-[60px] w-full items-center justify-center rounded-full border-[3px] border-crayon-ink bg-crayon-red px-6 text-lg font-extrabold text-white shadow-[0_6px_0_0_#1f2340] transition active:translate-y-[2px] active:shadow-[0_4px_0_0_#1f2340] disabled:opacity-60">
        {busy ? c.paying : c.pay(legal.price)}
      </button>
    </form>
  );
}
