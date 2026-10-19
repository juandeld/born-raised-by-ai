"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { send } from "../Track";
import type { LandingCopy } from "@/lib/landing-copy";
import { Edge, EdgeV } from "./Edge";
import "./landing.css";

export interface LandingProps {
  slug: "es" | "es-es" | "en";
  country: string;
  creative: string;
  copy: LandingCopy;
  price: string;
  price2: string;
  /** Checkout URL (country, variant and creative already applied); the name is appended as &n=. */
  buyHref: string;
  bundleHref: string | null;
  deadlineIso: string;
  deadlineLabel: string;
  langs: Array<{ slug: string; label: string; href: string }>;
  countries: Array<{ code: string; href: string; current: boolean }>;
  initialName: string;
}

/** Peaks of docs/audio jinglo-santa-es.mp3 (56 buckets, 21 s), computed once at build time so the page never decodes audio. */
const PEAKS = [100, 54, 61, 77, 18, 71, 33, 57, 10, 60, 61, 11, 14, 22, 48, 52, 65, 79, 38, 84, 68, 24, 10, 10, 57, 51, 30, 58, 29, 41, 56, 20, 48, 56, 61, 44, 10, 10, 92, 84, 42, 83, 41, 10, 10, 43, 23, 10, 29, 35, 68, 42, 53, 72, 59, 25];
const MAX_NAME = 22;
const cleanName = (v: string) => v.replace(/[<>&"\\\u0000-\u001f]/g, "").replace(/\s+/g, " ").slice(0, MAX_NAME);
const fill = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");

const PHONE = "M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11 11 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.2.2 2.4.56 3.5a1 1 0 01-.25 1z";
const HANGUP = "M12 9c-1.6 0-3.15.25-4.6.72v3.1a1 1 0 01-.56.9c-.98.49-1.87 1.12-2.66 1.85a1 1 0 01-1.4 0L.3 13.7a1 1 0 01-.29-.71c0-.28.11-.53.29-.71C3.34 9.78 7.46 8 12 8s8.66 1.78 11.71 4.28c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48a1 1 0 01-1.4 0 11 11 0 00-2.67-1.85 1 1 0 01-.56-.9v-3.1A15 15 0 0012 9z";

export function Landing(p: LandingProps) {
  const t = p.copy;
  const [name, setName] = useState(() => cleanName(p.initialName));
  const [now, setNow] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ring, setRing] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const heroCta = useRef<HTMLAnchorElement>(null);
  const priceRef = useRef<HTMLElement>(null);
  const playedOnce = useRef(false);
  const personalized = useRef(false);
  const n = name.trim();

  const track = useCallback((e: "cta_click" | "name_personalized" | "audio_play", extra?: { placement?: string; personalized?: boolean }) => send(e, p.slug, p.country, p.creative, extra), [p.slug, p.country, p.creative]);

  // Real countdown to the booking deadline (client clock; the server only gives the instant).
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // The phone rings now and then (hero only), unless the visitor asks for less motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let off: ReturnType<typeof setTimeout> | undefined;
    const rg = () => {
      setRing(true);
      off = setTimeout(() => setRing(false), 1100);
    };
    const first = setTimeout(rg, 1800);
    const every = setInterval(rg, 7000);
    return () => {
      clearTimeout(first);
      clearInterval(every);
      if (off) clearTimeout(off);
    };
  }, []);

  // Fixed buy bar on phones once the hero button is out of view and the price section is not on screen.
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !heroCta.current || !priceRef.current) return;
    let heroGone = false;
    let priceOn = false;
    const upd = () => setShowSticky(heroGone && !priceOn);
    const a = new IntersectionObserver((es) => {
      const e = es[0]!;
      heroGone = !e.isIntersecting && e.boundingClientRect.bottom < 0;
      upd();
    });
    const b = new IntersectionObserver((es) => {
      priceOn = es[0]!.isIntersecting;
      upd();
    }, { threshold: 0.1 });
    a.observe(heroCta.current);
    b.observe(priceRef.current);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, []);

  // name_personalized: once per visit, after the visitor stops typing. The name itself is never sent.
  useEffect(() => {
    if (!n || personalized.current) return;
    const id = setTimeout(() => {
      personalized.current = true;
      track("name_personalized");
    }, 700);
    return () => clearTimeout(id);
  }, [n, track]);

  const buy = (placement: string) => {
    const href = n ? `${p.buyHref}${p.buyHref.includes("?") ? "&" : "?"}n=${encodeURIComponent(n)}` : p.buyHref;
    return { href, onClick: () => track("cta_click", { placement, personalized: !!n }) };
  };

  const vars = { n, price: p.price, price2: p.price2, date: p.deadlineLabel };
  const ctaHero = fill(n ? t.cta_n : t.cta_0, vars);
  const ctaShort = fill(t.ctaS, vars);

  const left = now === null ? null : Math.max(0, new Date(p.deadlineIso).getTime() - now);
  const done = left !== null && left <= 0;
  const cd = useMemo(() => {
    if (left === null) return null;
    const s = Math.floor(left / 1000);
    return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
  }, [left]);
  const z = (v: number) => (v < 10 ? `0${v}` : String(v));

  function toggleAudio() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      void a.play().catch(() => undefined);
    } else {
      a.pause();
    }
  }
  function answer() {
    document.getElementById("escucha")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setTimeout(() => void audioRef.current?.play().catch(() => undefined), 500);
  }
  const doneBars = Math.floor(progress * PEAKS.length);

  const langHref = (href: string) => (n ? `${href}${href.includes("?") ? "&" : "?"}n=${encodeURIComponent(n)}` : href);

  return (
    <div className="jl">
      <a className="skip" href="#escucha">{t.skip}</a>
      <header className="bar">
        <Link className="brand" href={langHref(`/${p.slug}`)} aria-label="Jinglo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo" src="/jinglo/logo.svg" alt="Jinglo" width={357} height={143} />
        </Link>
        <nav className="jl-lang" aria-label={t.lang}>
          {p.langs.map((l) => (
            <a key={l.slug} href={langHref(l.href)} aria-current={l.slug === p.slug ? "true" : undefined} hrefLang={l.slug}>{l.label}</a>
          ))}
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="plate">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/jinglo/hero.webp" alt={t.heroAlt} width={900} height={1350} fetchPriority="high" decoding="async" />
            <EdgeV seed={2} fill="#13233f" />
            <Edge seed={1} fill="#13233f" cls="h" />
          </div>
          <div className="hero-copy">
            <div className={`call${ring ? " ring" : ""}`} id="call" role="group" aria-live="polite">
              <svg className="wave" viewBox="0 0 14 34" aria-hidden="true"><path d="M12 3C5 9 5 25 12 31M7 11C4 15 4 19 7 23" fill="none" stroke="#e3ab52" strokeWidth="2.4" strokeLinecap="round" /></svg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="santa" src="/jinglo/santa.webp" alt={t.santaAlt} width={520} height={600} decoding="async" />
              <div className="who"><b>{t.callFrom}</b><span>{n ? fill(t.callSubN, vars) : t.callSub0}</span></div>
              <button className="pick" type="button" aria-label={t.answer} onClick={answer}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={PHONE} /></svg></button>
            </div>
            <h1 id="h1">{n ? fill(t.h1_n, vars) : t.h1_0}</h1>
            <p className="lead">{n ? fill(t.lead_n, vars) : t.lead_0}</p>
            <div className="jl-field">
              <label htmlFor="nm">{t.fieldL}</label>
              <input id="nm" type="text" maxLength={MAX_NAME} autoComplete="off" autoCapitalize="words" enterKeyHint="done" placeholder={t.fieldPh} value={name} onChange={(e) => setName(cleanName(e.target.value))} />
              <small>{t.fieldH}</small>
            </div>
            <a className="cta" id="cta1" ref={heroCta} {...buy("hero")}>{ctaHero}</a>
            <p className="fine">{t.fine}</p>
          </div>
        </section>

        <section className={`paper listen${playing ? " playing" : ""}`} id="escucha">
          <Edge seed={11} fill="#e9dcbd" cls="top" />
          <div className="wrap grid" id="listenGrid">
            <div className="phone-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/jinglo/telefono.webp" alt={t.phoneAlt} width={900} height={900} loading="lazy" decoding="async" />
              <svg className="rings" viewBox="0 0 70 70" aria-hidden="true"><path d="M8 20C2 30 2 42 8 52M18 14C8 28 8 46 18 58M28 8C14 26 14 48 28 64" fill="none" stroke="#a8262c" strokeWidth="3" strokeLinecap="round" /></svg>
            </div>
            <div>
              <h2>{t.listenT}</h2>
              <p style={{ marginTop: 16 }}>{t.listenP}</p>
              <div className="player">
                <button className="hang" id="hang" type="button" aria-pressed={playing} onClick={toggleAudio}>
                  <svg className="on" viewBox="0 0 24 24" aria-hidden="true"><path d={PHONE} /></svg>
                  <svg className="off" viewBox="0 0 24 24" aria-hidden="true"><path d={HANGUP} /></svg>
                  <span>{playing ? t.hangOff : t.hang}</span>
                </button>
                <div className="peaks" aria-hidden="true">
                  {PEAKS.map((h, i) => (<i key={i} className={i < doneBars ? "done" : undefined} style={{ height: `${h}%` }} />))}
                </div>
              </div>
              <audio
                ref={audioRef}
                preload="none"
                src="/audio/jinglo-santa-es.mp3"
                onPlay={() => {
                  setPlaying(true);
                  if (!playedOnce.current) {
                    playedOnce.current = true;
                    track("audio_play");
                  }
                }}
                onPause={() => setPlaying(false)}
                onEnded={() => {
                  setPlaying(false);
                  setProgress(0);
                }}
                onTimeUpdate={(e) => setProgress(e.currentTarget.duration ? e.currentTarget.currentTime / e.currentTarget.duration : 0)}
              />
              <p className="jl-note">{t.listenN}</p>
            </div>
          </div>
        </section>

        <section className="night how" id="como">
          <Edge seed={21} fill="#13233f" cls="top" />
          <div className="wrap">
            <h2>{t.howT}</h2>
            <ol className="steps">
              {t.steps.map((s, i) => (
                <li key={s[0]}><span className="n" aria-hidden="true">{i + 1}</span><h3>{s[0]}</h3><p>{s[1]}</p></li>
              ))}
            </ol>
            <figure className="diorama">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/jinglo/taller.webp" alt={t.tallerAlt} width={1100} height={733} loading="lazy" decoding="async" />
              <figcaption>{t.tallerCap}</figcaption>
            </figure>
          </div>
        </section>

        <section className="paper gift" id="recibes">
          <Edge seed={31} fill="#e9dcbd" cls="top" />
          <div className="wrap grid">
            <div className="cert">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/jinglo/certificado.webp" alt="" width={720} height={1004} loading="lazy" decoding="async" />
              <div className="txt" aria-hidden="true">
                <small>{t.cBy}</small>
                <small>{t.cThat}</small>
                <div className={`nm${n ? "" : " empty"}`}>{n || t.cName0}</div>
                <small>{t.cList}</small>
                <small>{t.cYear}</small>
                <div className="sig">{t.cSig}</div>
              </div>
            </div>
            <div>
              <h2>{t.giftT}</h2>
              <p className="quote">{t.giftQ}</p>
              <ul>
                {t.gift.map((g) => (<li key={g[0]}><b>{g[0]}</b> <span>{g[1]}</span></li>))}
              </ul>
            </div>
          </div>
        </section>

        <section className="night who" id="paraquien">
          <Edge seed={41} fill="#13233f" cls="top" />
          <div className="wrap">
            <h2>{t.whoT}</h2>
            <figure className="scene">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/jinglo/familia.webp" alt={t.famAlt} width={1100} height={733} loading="lazy" decoding="async" />
            </figure>
            <div className="cols">
              {t.who.map((w) => (<div key={w[0]}><h3>{w[0]}</h3><p>{w[1]}</p></div>))}
            </div>
          </div>
        </section>

        <section className="paper guar" id="garantia">
          <Edge seed={51} fill="#e9dcbd" cls="top" />
          <svg className="stamp" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#a8262c" strokeWidth="3" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#a8262c" strokeWidth="1.2" strokeDasharray="2 4" />
            <text x="50" y="58" textAnchor="middle" fontFamily="Fraunces,serif" fontStyle="italic" fontWeight="600" fontSize="30" fill="#a8262c">7</text>
            <text x="50" y="74" textAnchor="middle" fontFamily="Fraunces,serif" fontStyle="italic" fontSize="12" fill="#a8262c">{t.stamp}</text>
          </svg>
          <div className="wrap">
            <h2>{t.guarT}</h2>
            <dl>
              {t.guar.map((g) => (<div key={g[0]}><dt>{g[0]}</dt><dd>{g[1]}</dd></div>))}
            </dl>
          </div>
        </section>

        <section className="urg" id="urgencia">
          <div className="bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/jinglo/trineo.webp" alt="" width={1100} height={733} loading="lazy" decoding="async" />
            <Edge seed={61} fill="#0d182c" cls="b" />
          </div>
          <div className="wrap in">
            <h2>{t.urgT}</h2>
            {done ? (
              <p className="last" role="status" style={{ marginTop: 24 }}>{t.urgDone}</p>
            ) : (
              <>
                <div className="count" role="timer" aria-label={t.urgTimer}>
                  <div><b>{cd ? cd.d : "--"}</b><span>{t.d}</span></div><span className="sep">:</span>
                  <div><b>{cd ? z(cd.h) : "--"}</b><span>{t.h}</span></div><span className="sep">:</span>
                  <div><b>{cd ? z(cd.m) : "--"}</b><span>{t.m}</span></div><span className="sep">:</span>
                  <div><b>{cd ? z(cd.s) : "--"}</b><span>{t.s}</span></div>
                </div>
                <p className="last">{fill(t.urgLast, vars)}</p>
              </>
            )}
            <p className="why">{t.urgWhy}</p>
          </div>
        </section>

        <section className="paper price" id="precio" ref={priceRef}>
          <Edge seed={71} fill="#e9dcbd" cls="top" />
          <div className="wrap">
            <h2>{t.priceT}</h2>
            {p.countries.length > 1 && (
              <div className="countries" role="group" aria-label={t.countryLabel}>
                <span>{t.countryLabel}:</span>
                {p.countries.map((c) => (<a key={c.code} href={langHref(c.href)} aria-current={c.current ? "true" : undefined}>{c.code}</a>))}
              </div>
            )}
            <div className="tickets">
              <article className="ticket main">
                <h3>{t.p1n}</h3>
                <div className="amt">{p.price}</div>
                <p>{t.p1d}</p>
                <a className="cta wide" id="cta2" {...buy("price")}>{ctaShort}</a>
              </article>
              <article className="ticket soon">
                <h3>{t.p2n}</h3>
                <div className="amt">{p.price2}</div>
                <p>{t.p2d}</p>
                {p.bundleHref ? (
                  <a className="cta wide" href={p.bundleHref}>{t.ctaS.replace("{price}", p.price2)}</a>
                ) : (
                  <span className="soon-tag">{t.soon}</span>
                )}
              </article>
            </div>
            <p className="jl-note" style={{ marginTop: 22 }}>{t.priceN}</p>
          </div>
        </section>

        {/* Bloque de reseñas: OCULTO hasta tener reseñas reales y autorizadas. No inventar. */}
        <section className="paper fam" id="familias" hidden />

        <section className="paper faqs" id="faq" style={{ paddingTop: 20 }}>
          <div className="wrap">
            <h2>{t.faqT}</h2>
            <div className="faq">
              {t.faq.map((f) => (<details key={f[0]}><summary>{f[0]}</summary><p>{f[1]}</p></details>))}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <Link className="brand" href={`/${p.slug}`} aria-label="Jinglo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo" src="/jinglo/logo.svg" alt="Jinglo" width={357} height={143} loading="lazy" />
          </Link>
          <p>{t.by}</p>
          <p>{t.legal}</p>
          <p>
            <Link href={`/${p.slug}/privacidad`}>{p.slug === "en" ? "Privacy" : "Privacidad"}</Link>
            {" · "}
            <Link href={`/${p.slug}/terminos`}>{p.slug === "en" ? "Terms and refunds" : "Términos y reembolso"}</Link>
          </p>
        </div>
      </footer>

      <div className={`jl-sticky${showSticky ? " show" : ""}`} aria-hidden={!showSticky}>
        <a className="cta" id="cta3" tabIndex={showSticky ? 0 : -1} {...buy("sticky")}>{ctaShort}</a>
      </div>
    </div>
  );
}
