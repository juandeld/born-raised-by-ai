import Link from "next/link";
import type { ColorearLang } from "@lumen/config";
import { brandConfig } from "@lumen/config";
import { COLOREAR_COPY } from "@/lib/colorear-copy";

export function CHeader({ lang }: { lang: ColorearLang }) {
  const c = COLOREAR_COPY[lang];
  const other: ColorearLang = lang === "es" ? "en" : "es";
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
      <Link href={`/colorear/${lang}`} className="flex items-center gap-2 text-xl font-extrabold">
        <span aria-hidden className="grid h-8 w-8 grid-cols-2 overflow-hidden rounded-lg border-[3px] border-crayon-ink">
          <i className="bg-crayon-red" /><i className="bg-crayon-yellow" /><i className="bg-crayon-blue" /><i className="bg-crayon-green" />
        </span>
        {process.env.COLOREAR_BRAND_NAME ?? "Colorfam"}
      </Link>
      <Link href={`/colorear/${other}`} className="rounded-full border-[3px] border-crayon-ink bg-white px-3 py-1 text-sm font-bold" hrefLang={other}>
        {c.nav.other}
      </Link>
    </header>
  );
}

export function CFooter({ lang }: { lang: ColorearLang }) {
  const c = COLOREAR_COPY[lang];
  const b = brandConfig();
  return (
    <footer className="mt-16 border-t-[3px] border-crayon-ink bg-crayon-sun py-8 text-sm">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-semibold">
          <Link href={`/colorear/${lang}/privacidad`} className="underline underline-offset-4">{c.nav.privacy}</Link>
          <Link href={`/colorear/${lang}/terminos`} className="underline underline-offset-4">{c.nav.terms}</Link>
          <a href={`mailto:${b.supportEmail}`} className="underline underline-offset-4">{c.nav.support}</a>
        </div>
        <p className="opacity-80">{process.env.COLOREAR_BRAND_NAME ?? "Colorfam"} · {b.holder}</p>
      </div>
    </footer>
  );
}
