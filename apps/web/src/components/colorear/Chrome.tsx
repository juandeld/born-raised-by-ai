import Link from "next/link";
import type { ColorearLang } from "@lumen/config";
import { brandConfig } from "@lumen/config";
import { COLOREAR_COPY } from "@/lib/colorear-copy";

export function CHeader({ lang }: { lang: ColorearLang }) {
  const c = COLOREAR_COPY[lang];
  const other: ColorearLang = lang === "es" ? "en" : "es";
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
      <Link href={`/colorear/${lang}`} className="c-h flex min-h-[48px] items-center gap-2 text-xl">
        <svg aria-hidden viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="#1b6b67" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 21l1.200-4.800L18 3.400a2 2 0 012.800 0l3.800 3.800a2 2 0 010 2.800L11.800 22.800z" />
          <path d="M16 6l6 6M4 21l4.800-1.200" />
          <path d="M3 25.500c3-1.500 5-1.500 8 0s5 1.500 8 0" stroke="#f0b43c" />
        </svg>
        {process.env.COLOREAR_BRAND_NAME ?? "Colorfam"}
      </Link>
      <Link href={`/colorear/${other}`} className="c-btn-quiet min-h-[48px] px-4 text-sm" hrefLang={other}>
        {c.nav.other}
      </Link>
    </header>
  );
}

export function CFooter({ lang }: { lang: ColorearLang }) {
  const c = COLOREAR_COPY[lang];
  const b = brandConfig();
  return (
    <footer className="mt-16 border-t border-lapiz-line bg-lapiz-mist py-8 text-sm">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4">
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-semibold">
          <Link href={`/colorear/${lang}/privacidad`} className="inline-flex min-h-[44px] items-center underline underline-offset-4">{c.nav.privacy}</Link>
          <Link href={`/colorear/${lang}/terminos`} className="inline-flex min-h-[44px] items-center underline underline-offset-4">{c.nav.terms}</Link>
          <a href={`mailto:${b.supportEmail}`} className="inline-flex min-h-[44px] items-center underline underline-offset-4">{c.nav.support}</a>
        </div>
        <p className="text-lapiz-muted">{process.env.COLOREAR_BRAND_NAME ?? "Colorfam"} · {b.holder}</p>
      </div>
    </footer>
  );
}
