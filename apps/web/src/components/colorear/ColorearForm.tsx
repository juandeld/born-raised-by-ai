"use client";
import { useEffect, useRef, useState } from "react";
import { AGE_LEVELS, COLOREAR, COMPANION_ROLE_IDS, PROTAGONIST_ROLE_IDS, ROLE_OTHER_MAX, colorearPhotoBudget, roleChipLabel, type ColorearLang, type ColorearRoleId } from "@lumen/config";
import { COLOREAR_COPY, type ColorearCopy } from "@/lib/colorear-copy";
import { PhotoPrepError, preparePhoto, shrinkPhoto } from "@/lib/photo-prep";
import { PencilIcon, ThemeIcon } from "./ThemeIcon";
import { LevelThumb } from "./LevelThumb";

export interface CountryLegal {
  country: string;
  label: string;
  /** Formatted prices of the options in this country, and the struck-through reference "3 single adventures" total. */
  prices: { single: string; bundle3: string; threeSingles: string };
  /** Legal lines shown next to the Trio option (credits, expiry, refund) and under the email field. */
  trioLine: string;
  trioRefundLine: string;
  emailLine: string;
  checkboxes: Array<{ id: string; text: string }>;
  aviso: { title: string; intro: string; sections: Array<{ heading: string; body: string }>; privacyLink: string };
  refundLine: string;
  /**
   * Variant for an order made with a test code (no charge): the acceptance sentence says "Al usar el código" and the notice says the adult is known
   * personally instead of verified with the card. Present only when test codes are enabled; the form shows it as soon as a code is typed, and the
   * server records the same variant for a valid code.
   */
  code?: { payNotice: string; aviso: CountryLegal["aviso"] };
}

/** One compressed photo of a person, with the object URL of its thumbnail. */
interface Shot {
  key: number;
  blob: Blob;
  preview: string;
}

interface Item {
  id: number;
  /** The photos of this person, in order: the first one is required, the rest are optional and add angles. Empty until the buyer uploads. */
  shots: Shot[];
  name: string;
  /** Closed role chosen with the chips; "" until the buyer picks one. */
  roleId: ColorearRoleId | "";
  /** Optional short description, only for "other". */
  roleText: string;
}

const MAX = 5;
const blankItem = (id: number): Item => ({ id, shots: [], name: "", roleId: "", roleText: "" });
/** An added card the buyer never touched: it is ignored on submit instead of blocking the payment. */
const isBlank = (i: Item) => !i.shots.length && !i.name.trim() && !i.roleId;
/**
 * Makes all the photos about to be sent fit one request. Normally they already do (each is about 640 KB at most). With many photos
 * (up to 15) the largest ones are re-encoded to `colorearPhotoBudget(count)`, which keeps the whole body under Vercel's 4.5 MB.
 * This limit applies to what is sent; the original photo the buyer picked can be of any size (see `@/lib/photo-prep`).
 */
async function fit(groups: Blob[][]): Promise<Blob[][]> {
  const all = groups.flat();
  if (all.reduce((n, b) => n + b.size, 0) <= COLOREAR.uploadBudgetBytes) return groups;
  const per = colorearPhotoBudget(all.length);
  const out: Blob[][] = [];
  for (const g of groups) {
    const row: Blob[] = [];
    for (const b of g) row.push(b.size > per ? await shrinkPhoto(b, per) : b);
    out.push(row);
  }
  return out;
}

/** One closed-choice group per photo (radiogroup). Photo 1 offers the protagonist; photos 2 to 5 offer the relation to the protagonist. */
function RolePicker({ idx, item, lang, c, onChange }: { idx: number; item: Item; lang: ColorearLang; c: ColorearCopy["form"]["people"]; onChange: (p: Partial<Item>) => void }) {
  const ids: readonly ColorearRoleId[] = idx === 0 ? PROTAGONIST_ROLE_IDS : COMPANION_ROLE_IDS;
  const labelId = `role-label-${item.id}`;
  return (
    <div className="mt-3 border-t border-lapiz-line pt-3">
      <p id={labelId} className="text-sm font-semibold">{idx === 0 ? c.protagonist : c.companion}</p>
      {idx === 0 && <p className="text-sm text-lapiz-muted">{c.protagonistHint}</p>}
      <div role="radiogroup" aria-labelledby={labelId} className="mt-2 flex flex-wrap gap-2">
        {ids.map((rid) => {
          const on = item.roleId === rid;
          return (
            <label key={rid} className="c-role relative flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-lapiz-line bg-white px-4 text-center text-[15px] font-semibold transition-colors hover:border-lapiz-teal/70 hover:bg-lapiz-mist">
              <input type="radio" name={`role-${item.id}`} value={rid} checked={on} className="sr-only" onChange={() => onChange({ roleId: rid, roleText: rid === "other" ? item.roleText : "" })} />
              {roleChipLabel(rid, lang)}
            </label>
          );
        })}
      </div>
      {item.roleId === "other" && (
        <label className="mt-3 block text-sm font-semibold">
          {c.otherLabel}
          <input className="c-field" value={item.roleText} maxLength={ROLE_OTHER_MAX} placeholder={c.otherPh} autoComplete="off" onChange={(e) => onChange({ roleText: e.target.value })} />
        </label>
      )}
    </div>
  );
}

export function ColorearForm({ lang, countries, defaultCountry, themes, creative, codeEnabled = false, inviteOnly = false, photoLimits = { main: COLOREAR.photosPerPersonDefault, other: COLOREAR.photosPerPersonDefault } }: { lang: ColorearLang; countries: Record<string, CountryLegal>; defaultCountry: string; themes: Array<{ id: string; label: string }>; creative: string; codeEnabled?: boolean; inviteOnly?: boolean; photoLimits?: { main: number; other: number } }) {
  const c = COLOREAR_COPY[lang].form;
  const [items, setItems] = useState<Item[]>(() => [blankItem(0)]);
  const [tried, setTried] = useState(false);
  const [focusId, setFocusId] = useState<number | null>(null);
  const [live, setLive] = useState("");
  const cardRefs = useRef<Record<number, HTMLLIElement | null>>({});
  const addBtn = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;
  const [country, setCountry] = useState(defaultCountry);
  /** Trio is the highlighted default (docs/pricing/colorear.md 1.3). */
  const [variant, setVariant] = useState<"single" | "bundle3">("bundle3");
  const variantSent = useRef<"single" | "bundle3" | "none">("none");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [theme, setTheme] = useState("");
  const [themeId, setThemeId] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  /** Optional test code: the field exists only when the server has codes configured. It is validated on the server, never here. */
  const [code, setCode] = useState("");
  /**
   * Invitation-only (payments closed, see colorearInviteOnly): the field is always there and open, and the form is always the "code" version
   * (nothing is charged, so no price, no refund line, the acceptance sentence says "Al usar el código"). The server refuses an order without a code.
   */
  const showCode = codeEnabled || inviteOnly;
  const [codeOpen, setCodeOpen] = useState(inviteOnly);
  const usingCode = showCode && (inviteOnly || code.trim().length > 0);
  const [busy, setBusy] = useState(false);
  const [photoMsg, setPhotoMsg] = useState("");
  /** Batches of photos being opened and reduced right now (the pay button waits for them). */
  const [photosPending, setPhotosPending] = useState(0);
  const photoBusy = photosPending > 0;
  const [photoProgress, setPhotoProgress] = useState<{ at: number; of: number } | null>(null);
  const nextShot = useRef(1);
  /** How many photos card `idx` may hold: the protagonist (card 1) and the others can have different limits. */
  const limitOf = (idx: number) => Math.max(1, idx === 0 ? photoLimits.main : photoLimits.other);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nextId = useRef(1);
  const started = useRef(false);
  const legal = countries[country]!;
  const consentBox = legal.checkboxes.find((k) => k.id === "K1")!;
  const payNotice = legal.checkboxes.find((k) => k.id === "K2")!;
  // With a test code typed, the buyer sees (and the server records) the variant without "Al pagar" and without the card-charge verification.
  const codeLegal = usingCode ? legal.code : undefined;
  const shownAviso = codeLegal?.aviso ?? legal.aviso;
  const shownPayNotice = codeLegal?.payNotice ?? payNotice.text;
  const allChecked = !!checked[consentBox.id];
  const detailLabel = lang === "es" ? "Ver detalle" : "See details";

  const beacon = (event: "landing_view" | "form_started" | "bundle_selected", extra: Record<string, string> = {}) => {
    try {
      const body = JSON.stringify({ event, lang, country, creative, ...extra });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/colorear/track", new Blob([body], { type: "application/json" }));
    } catch {
      /* analytics must never break the page */
    }
  };
  useEffect(() => beacon("landing_view"), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => itemsRef.current.forEach((i) => i.shots.forEach((x) => URL.revokeObjectURL(x.preview))), []);
  useEffect(() => {
    if (focusId === null) return;
    const el = cardRefs.current[focusId];
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    setFocusId(null);
  }, [focusId]);

  const chooseVariant = (v: "single" | "bundle3") => {
    if (v === variant) return;
    beacon("bundle_selected", { variant: v, previous: variantSent.current === "none" ? variant : variantSent.current });
    variantSent.current = v;
    setVariant(v);
    markStarted();
  };
  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    beacon("form_started");
  };
  /** Opens and reduces the files chosen for one card (one or several at once) and adds them after the photos it already has, up to its limit. */
  async function addPhotos(id: number, list: FileList | null) {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    markStarted();
    const idx = itemsRef.current.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const limit = limitOf(idx);
    const room = limit - itemsRef.current[idx]!.shots.length;
    if (room <= 0) { setPhotoMsg(c.photos.maxPer(limit)); return; }
    let msg = files.length > room ? c.photos.maxPer(limit) : "";
    setPhotoMsg("");
    setPhotosPending((n) => n + 1);
    const take = files.slice(0, room);
    const added: Shot[] = [];
    try {
      for (const [n, f] of take.entries()) {
        setPhotoProgress(take.length > 1 ? { at: n + 1, of: take.length } : null);
        try {
          // Any phone photo or screenshot, of any size: it is opened, rotated and reduced here, and only the reduced JPEG is kept.
          const blob = await preparePhoto(f);
          added.push({ key: nextShot.current++, blob, preview: URL.createObjectURL(blob) });
        } catch (err) {
          const code = err instanceof PhotoPrepError ? err.code : "unreadable";
          msg = code === "too_big" ? c.photos.tooLarge : code === "not_image" ? c.photos.notImage : code === "heic_failed" ? c.photos.heic : c.photos.unreadable;
        }
      }
    } finally {
      setPhotosPending((n) => n - 1);
      setPhotoProgress(null);
    }
    if (!itemsRef.current.some((i) => i.id === id)) { added.forEach((x) => URL.revokeObjectURL(x.preview)); return; } // the card was removed meanwhile
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      const keep = added.slice(0, Math.max(0, limit - i.shots.length));
      added.slice(keep.length).forEach((x) => URL.revokeObjectURL(x.preview));
      return { ...i, shots: [...i.shots, ...keep] };
    }));
    setPhotoMsg(msg);
  }
  const removeShot = (id: number, key: number) => {
    const it = itemsRef.current.find((i) => i.id === id);
    const at = it ? it.shots.findIndex((x) => x.key === key) : -1;
    if (!it || at < 0) return;
    URL.revokeObjectURL(it.shots[at]!.preview);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, shots: i.shots.filter((x) => x.key !== key) } : i)));
    setPhotoMsg("");
    setLive(c.people.photoRemoved(at + 1));
    cardRefs.current[id]?.focus({ preventScroll: true });
  };
  const patch = (id: number, p: Partial<Item>) => {
    markStarted();
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)));
  };
  const addCard = () => {
    if (items.length >= MAX) return;
    markStarted();
    const id = nextId.current++;
    setItems((prev) => (prev.length >= MAX ? prev : [...prev, blankItem(id)]));
    setFocusId(id);
  };
  const remove = (id: number) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 1) return; // the protagonist card cannot be removed
    const gone = items[idx]!;
    gone.shots.forEach((x) => URL.revokeObjectURL(x.preview));
    setItems((prev) => prev.filter((i) => i.id !== id));
    setLive(c.people.removed(idx + 1));
    setTimeout(() => addBtn.current?.focus(), 0);
  };
  /** What is still missing on a card; the protagonist always counts, an added card only counts once the buyer touched it. */
  const missingOf = (it: Item, idx: number): string[] => {
    if (idx > 0 && isBlank(it)) return [];
    const m: string[] = [];
    if (!it.shots.length) m.push(c.people.missing.photo);
    if (!it.name.trim()) m.push(c.people.missing.name);
    if (!it.roleId) m.push(idx === 0 ? c.people.missing.protagonistRole : c.people.missing.role);
    return m;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || photoBusy) return;
    const local: Record<string, string> = {};
    const send = items.filter((it, i) => i === 0 || !isBlank(it));
    if (!items[0]!.shots.length) local.photos = c.errors.photos!;
    if (items.some((it, i) => (i === 0 ? !it.name.trim() || !it.roleId : missingOf(it, i).length > 0))) local.persons = c.errors.persons!;
    setTried(true);
    if (!age) local.age = c.errors.age!;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) local.email = c.errors.email!;
    if (!allChecked) local.consent = c.errors.consent!;
    // Closed to the public: say so before spending time on the photos (the server answers the same if this page is stale).
    if (inviteOnly && !code.trim()) {
      local.code = c.errors.code_required!;
      setCodeOpen(true);
    }
    setErrors(local);
    if (Object.keys(local).length) return;
    setBusy(true);
    // Every photo of every person must fit one request: when the total is too big, re-encode the larger ones smaller.
    let groups: Blob[][];
    try {
      groups = await fit(send.map((it) => it.shots.map((x) => x.blob)));
    } catch {
      setErrors({ photos: c.errors.unreadable! });
      setBusy(false);
      return;
    }
    const fd = new FormData();
    fd.set("lang", lang);
    fd.set("country", country);
    fd.set("variant", variant);
    fd.set("email", email.trim());
    fd.set("age", age);
    fd.set("theme", theme.trim());
    fd.set("themeId", themeId);
    fd.set("creative", creative);
    if (showCode && code.trim()) fd.set("code", code.trim());
    fd.set("checkboxIds", JSON.stringify(legal.checkboxes.filter((k) => k.id === payNotice.id || checked[k.id]).map((k) => k.id)));
    send.forEach((it, i) => {
      // photo<i> is the required photo of person i; photo<i>_2, photo<i>_3... are the optional extras of the same person
      groups[i]!.forEach((blob, j) => fd.set(j === 0 ? `photo${i + 1}` : `photo${i + 1}_${j + 1}`, new File([blob], `photo-${i + 1}${j ? `-${j + 1}` : ""}.jpg`, { type: "image/jpeg" })));
      fd.set(`name${i + 1}`, it.name.trim());
      fd.set(`roleId${i + 1}`, it.roleId);
      if (it.roleId === "other" && it.roleText.trim()) fd.set(`roleText${i + 1}`, it.roleText.trim());
    });
    try {
      const res = await fetch("/api/colorear/checkout", { method: "POST", body: fd });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; errors?: Record<string, string> };
      if (j.ok && j.url) {
        window.location.assign(j.url);
        return;
      }
      const e2: Record<string, string> = {};
      for (const k of Object.keys(j.errors ?? { generic: "x" })) {
        e2[k] = k === "code" ? c.errors[`code_${j.errors?.[k]}`] ?? c.errors.code_invalid!
          // a page loaded before the limit was lowered can still offer more slots than the server now accepts
          : k === "photos" && /Too many photos/.test(j.errors?.[k] ?? "") ? c.photos.maxPer(Math.min(limitOf(0), limitOf(1)))
          : k === "photos" && /Unreadable|Invalid or too large/.test(j.errors?.[k] ?? "") ? c.errors.unreadable!
          : c.errors[k] ?? c.errors[j.errors?.[k] ?? ""] ?? c.errors.generic!;
      }
      if (e2.code) setCodeOpen(true);
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
        {stepHead(1, c.photos.label, c.photos.hint(lang === "es" && country === "ES" ? "móvil" : lang === "es" ? "celular" : "phone"))}
        <ul className="mt-4 space-y-4">
          {items.map((it, idx) => {
            const miss = tried ? missingOf(it, idx) : [];
            const who = it.name.trim() || (idx === 0 ? c.people.protagonistCard : c.people.card(idx + 1));
            const limit = limitOf(idx);
            return (
              <li
                key={it.id}
                ref={(el) => { cardRefs.current[it.id] = el; }}
                tabIndex={-1}
                aria-label={idx === 0 ? c.people.protagonistCard : c.people.card(idx + 1)}
                className={`rounded-xl border bg-lapiz-paper p-3 outline-none focus-visible:ring-4 focus-visible:ring-lapiz-gold/60 ${miss.length ? "border-lapiz-error" : "border-lapiz-line"}`}
              >
                <p className="c-h mb-2 text-base">{idx === 0 ? c.people.protagonistCard : c.people.card(idx + 1)}</p>
                <div role="group" aria-label={c.people.photosOf(who)} className="flex flex-wrap gap-2">
                  {Array.from({ length: limit }, (_, slot) => {
                    const shot = it.shots[slot];
                    if (shot) {
                      return (
                        <div key={shot.key} className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-lg border border-lapiz-line bg-lapiz-tint">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={shot.preview} alt={c.people.photoAlt(who, slot + 1)} className="absolute inset-0 h-full w-full object-cover" />
                          <button type="button" aria-label={c.people.photoRemove(slot + 1, who)} onClick={() => removeShot(it.id, shot.key)} className="absolute right-0 top-0 grid h-11 w-11 place-items-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lapiz-gold/60">
                            <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-white/95 text-lapiz-ink shadow">
                              <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.800" strokeLinecap="round"><path d="M2.500 2.500l7 7M9.500 2.500l-7 7" /></svg>
                            </span>
                          </button>
                        </div>
                      );
                    }
                    const required = slot === 0;
                    const next = slot === it.shots.length;
                    const caption = required ? c.people.photoRequired : c.people.photoOptional;
                    // Only the next free slot is a button (it takes several files at once); the later ones just show how many fit.
                    if (!next) {
                      return (
                        <div key={`free-${slot}`} aria-hidden className="flex h-[84px] w-[84px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-lapiz-line bg-white text-center text-[12px] font-semibold leading-tight text-lapiz-muted">
                          <svg aria-hidden viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.600" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
                          <span>{caption}</span>
                        </div>
                      );
                    }
                    return (
                      <label key={`free-${slot}`} className="relative flex h-[84px] w-[84px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border-2 border-dashed border-lapiz-teal/70 bg-lapiz-tint text-center text-[13px] font-semibold leading-tight text-lapiz-teal-dark focus-within:ring-4 focus-within:ring-lapiz-gold/60">
                        <svg aria-hidden viewBox="0 0 20 20" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.800" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
                        <span>{required ? c.people.photoAdd : c.people.photoAddMore}</span>
                        <span className="text-[11px] font-medium text-lapiz-muted">{caption}</span>
                        <input type="file" accept="image/*" multiple={limit - it.shots.length > 1} className="sr-only" aria-label={`${required ? c.people.photoAdd : c.people.photoAddMore} (${caption}): ${who}`} onChange={(e) => { void addPhotos(it.id, e.target.files); e.target.value = ""; }} />
                      </label>
                    );
                  })}
                </div>
                {idx === 0 && limit > 1 && <p className="mt-2 text-sm text-lapiz-muted">{c.photos.more(limit)}</p>}
                <label className="mt-3 block text-sm font-semibold">
                  {c.people.name}
                  <input className={input} value={it.name} maxLength={30} autoComplete="off" onChange={(e) => patch(it.id, { name: e.target.value })} />
                </label>
                {idx > 0 && (
                  <button type="button" className="mt-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-sm font-semibold underline underline-offset-4" aria-label={`${c.people.remove}: ${who}`} onClick={() => remove(it.id)}>{c.people.remove}</button>
                )}
                <RolePicker idx={idx} item={it} lang={lang} c={c.people} onChange={(p) => patch(it.id, p)} />
                {miss.length > 0 && <p role="alert" className="mt-3 text-sm font-semibold text-lapiz-error">{c.people.missing.join(miss)}</p>}
              </li>
            );
          })}
        </ul>
        {photoBusy && <p role="status" className="mt-2 text-sm font-semibold text-lapiz-muted">{photoProgress ? c.photos.preparingN(photoProgress.at, photoProgress.of) : c.photos.preparing}</p>}
        {photoMsg && <p role="alert" className="mt-2 font-semibold text-lapiz-error">{photoMsg}</p>}
        {err("photos")}
        {err("persons")}
        {items.length < MAX ? (
          <button ref={addBtn} type="button" onClick={addCard} className="mt-4 flex min-h-[56px] w-full items-center justify-center text-balance rounded-xl border-2 border-dashed border-lapiz-teal/70 bg-lapiz-tint px-4 text-center font-semibold text-lapiz-teal-dark transition-colors hover:bg-lapiz-tint/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lapiz-gold/60">
            {c.people.addCard(items.length + 1)}
          </button>
        ) : (
          <p className="mt-4 text-center text-sm font-semibold text-lapiz-muted">{c.people.max}</p>
        )}
        <p className="sr-only" role="status" aria-live="polite">{live}</p>
      </div>

      <fieldset className={card} aria-describedby="age-hint">
        <legend className="sr-only">{c.age.label}</legend>
        <p aria-hidden className="c-h text-lg">{c.age.label}</p>
        <p id="age-hint" className="text-sm text-lapiz-muted">{c.age.hint}</p>
        <div className="mt-3 grid gap-3">
          {AGE_LEVELS.map((lv, i) => {
            const on = age === String(lv.age);
            const text = c.age.levels[i]!;
            return (
              <label key={lv.band} className={`relative flex min-h-[44px] cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3 transition-colors focus-within:ring-4 focus-within:ring-lapiz-gold/60 ${on ? "border-[2.5px] border-lapiz-teal bg-lapiz-tint" : "border-lapiz-line hover:border-lapiz-teal/60"}`}>
                <input type="radio" name="age" value={lv.age} checked={on} className="sr-only" onChange={() => setAge(String(lv.age))} />
                <LevelThumb index={i} sample={c.age.sample} patternSample={c.age.patternSample} />
                <span className="min-w-0 flex-1">
                  <span className="c-h block text-lg leading-tight">{text.title}</span>
                  <span className="block text-sm text-lapiz-muted">{text.text}</span>
                </span>
                <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${on ? "border-lapiz-teal bg-lapiz-teal" : "border-lapiz-line bg-white"}`}>
                  {on && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.500l3.200 3L13 4.500" /></svg>}
                </span>
              </label>
            );
          })}
        </div>
        {err("age")}
      </fieldset>

      <fieldset className="rounded-2xl border border-lapiz-teal/50 bg-white p-5 sm:p-6" aria-describedby="theme-hint">
        <legend className="sr-only">{c.theme.label}</legend>
        {stepHead(2, variant === "bundle3" ? c.bundle.firstTheme : c.theme.label, undefined)}
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

      <fieldset className={card}>
        <legend className="sr-only">{c.bundle.title}</legend>
        {stepHead(3, c.bundle.title, c.bundle.hint)}
        <div role="radiogroup" aria-label={c.bundle.title} className="mt-4 grid gap-3 sm:grid-cols-2">
          {([
            { id: "single" as const, name: c.bundle.one.name, text: c.bundle.one.text, price: legal.prices.single },
            { id: "bundle3" as const, name: c.bundle.trio.name, text: c.bundle.trio.text, price: legal.prices.bundle3 },
          ]).map((o) => {
            const on = variant === o.id;
            const trio = o.id === "bundle3";
            return (
              <label
                key={o.id}
                className={`c-option relative flex min-h-[44px] cursor-pointer flex-col rounded-2xl border bg-white p-4 transition-colors focus-within:ring-4 focus-within:ring-lapiz-gold/60 ${trio ? "order-first sm:order-none" : ""} ${on ? "border-[2.5px] border-lapiz-teal bg-lapiz-tint" : "border-lapiz-line hover:border-lapiz-teal/60"}`}
              >
                <input type="radio" name="variant" value={o.id} checked={on} className="sr-only" onChange={() => chooseVariant(o.id)} />
                {trio && <span className="c-stamp absolute -top-3 right-3 rotate-2">{c.bundle.trio.badge}</span>}
                <span className="flex items-start justify-between gap-3">
                  <span className="c-h text-xl">{o.name}</span>
                  <span aria-hidden className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${on ? "border-lapiz-teal bg-lapiz-teal" : "border-lapiz-line bg-white"}`}>
                    {on && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.500l3.200 3L13 4.500" /></svg>}
                  </span>
                </span>
                <span className="c-h mt-1 text-3xl">{o.price}</span>
                {trio && <span className="mt-1 text-sm font-bold text-lapiz-teal-dark">{c.bundle.trio.tagline}</span>}
                {trio && <span className="mt-0.5 text-sm text-lapiz-muted line-through decoration-1">{c.bundle.anchor(legal.prices.threeSingles)}</span>}
                <span className="mt-2 text-sm leading-snug">{o.text}</span>
              </label>
            );
          })}
        </div>
        {variant === "bundle3" && <p className="mt-3 text-sm leading-snug">{legal.trioLine}</p>}
      </fieldset>

      <div className={card}>
        <label className="block">
          <span className="flex items-start gap-3">
            <span aria-hidden className="c-h grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lapiz-teal text-base text-white">4</span>
            <span>
              <span className="c-h block text-xl">{c.email.label}</span>
              <span className="block text-sm text-lapiz-muted">{c.email.hint}</span>
            </span>
          </span>
          <input type="email" inputMode="email" autoComplete="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <p className="mt-2 text-sm text-lapiz-muted">{legal.emailLine}</p>
        {err("email")}
        {Object.keys(countries).length > 1 && (
          <label className="mt-4 block text-sm font-semibold">
            {c.country.label}
            <select className={input} value={country} onChange={(e) => setCountry(e.target.value)}>
              {Object.values(countries).map((k) => <option key={k.country} value={k.country}>{k.label} ({k.prices[variant]})</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="rounded-2xl border border-lapiz-line bg-lapiz-gold-tint p-5 sm:p-6">
        <p className="c-h text-lg">{c.consent}</p>
        <label className="mt-2 flex min-h-[48px] cursor-pointer items-start gap-3 text-[13.5px] leading-snug">
          <input type="checkbox" className="mt-0.5 h-6 w-6 shrink-0 accent-[#1b6b67]" checked={!!checked[consentBox.id]} onChange={(e) => setChecked((p) => ({ ...p, [consentBox.id]: e.target.checked }))} />
          <span>{consentBox.text}</span>
        </label>
        <details className="mt-1">
          <summary className="flex min-h-[44px] cursor-pointer items-center text-sm font-semibold underline">{detailLabel}</summary>
          <div className="mt-2 space-y-2 text-sm">
            <p>{shownAviso.intro}</p>
            {shownAviso.sections.map((s) => <p key={s.heading}><strong>{s.heading}</strong> {s.body}</p>)}
            <p>{legal.aviso.privacyLink.split(/:\s/)[0]}: <a className="font-semibold underline" href={`/colorear/${lang}/privacidad`} target="_blank" rel="noreferrer">/colorear/{lang}/privacidad</a></p>
          </div>
        </details>
        {err("consent")}
      </div>

      {showCode && (
        <details open={codeOpen} onToggle={(e) => setCodeOpen(e.currentTarget.open)} className="px-1">
          <summary className="flex min-h-[44px] cursor-pointer items-center text-sm font-semibold text-lapiz-muted underline underline-offset-4">{c.code.summary}</summary>
          {inviteOnly && !errors.code && <p className="mt-1 text-sm font-semibold">{c.code.closed}</p>}
          <label className="mt-1 block text-sm font-semibold">
            {c.code.label}
            <input
              className={input}
              value={code}
              maxLength={40}
              autoComplete="off"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby="code-hint"
              onChange={(e) => { setCode(e.target.value); if (errors.code) setErrors((p) => { const { code: _drop, ...rest } = p; void _drop; return rest; }); }}
            />
          </label>
          <p id="code-hint" className="mt-1 text-sm text-lapiz-muted">{c.code.hint}</p>
          {err("code")}
        </details>
      )}
      {/* No charge with a test code, so no refund promise (the variant of the notice says so too). */}
      {!usingCode && <p className="text-sm font-semibold">{variant === "bundle3" ? legal.trioRefundLine : legal.refundLine}</p>}
      <p className="text-sm">
        {shownPayNotice}{" "}
        <a className="font-semibold underline" href={`/colorear/${lang}/terminos`} target="_blank" rel="noreferrer">{lang === "es" ? "Términos" : "Terms"}</a>
        {" · "}
        <a className="font-semibold underline" href={`/colorear/${lang}/privacidad`} target="_blank" rel="noreferrer">{lang === "es" ? "Privacidad" : "Privacy"}</a>
      </p>
      {Object.entries(errors).filter(([k]) => !["photos", "persons", "age", "email", "theme", "consent", "code"].includes(k)).map(([k, v]) => <p key={k} role="alert" className="font-semibold text-lapiz-error">{v}</p>)}
      <button type="submit" disabled={busy || photoBusy} className="c-btn c-btn-block min-h-[60px]">
        {usingCode ? (busy ? c.code.busy : c.code.button) : busy ? c.paying : c.pay(legal.prices[variant])}
      </button>
    </form>
  );
}
