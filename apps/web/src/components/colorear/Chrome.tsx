import Link from "next/link";
import type { ColorearLang } from "@lumen/config";
import { brandConfig } from "@lumen/config";
import { COLOREAR_COPY } from "@/lib/colorear-copy";
import { cpath, onPintoria } from "@/lib/colorear-paths";

export async function CHeader({ lang }: { lang: ColorearLang }) {
  const pin = await onPintoria();
  const c = COLOREAR_COPY[lang];
  const brand = process.env.COLOREAR_BRAND_NAME ?? "Pintoria";
  const other: ColorearLang = lang === "es" ? "en" : "es";
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
      <Link href={cpath(pin, lang)} className="flex min-h-[48px] items-center" aria-label={brand}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pintoria/logo-a.svg" alt={brand} height={32} width={150} className="h-8 w-auto" />
      </Link>
      <Link href={cpath(pin, other)} className="c-lang" hrefLang={other}>
        {c.nav.other}
      </Link>
    </header>
  );
}

export async function CFooter({ lang }: { lang: ColorearLang }) {
  const pin = await onPintoria();
  const c = COLOREAR_COPY[lang];
  const b = brandConfig();
  return (
    <footer className="mt-16 border-t border-lapiz-line bg-lapiz-mist py-8 text-sm">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4">
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-semibold">
          <Link href={cpath(pin, lang, "privacidad")} className="inline-flex min-h-[44px] items-center underline underline-offset-4">{c.nav.privacy}</Link>
          <Link href={cpath(pin, lang, "terminos")} className="inline-flex min-h-[44px] items-center underline underline-offset-4">{c.nav.terms}</Link>
          <a href={`mailto:${b.supportEmail}`} className="inline-flex min-h-[44px] items-center underline underline-offset-4">{c.nav.support}</a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pintoria/logo-a.svg" alt={process.env.COLOREAR_BRAND_NAME ?? "Pintoria"} height={28} width={131} className="mt-2 h-7 w-auto" />
        <p className="text-lapiz-muted">{process.env.COLOREAR_BRAND_NAME ?? "Pintoria"} · {b.holder}</p>
      </div>
    </footer>
  );
}
