import Link from "next/link";
import { brandConfig } from "@lumen/config";
import { ConsentLink } from "./MetaPixel";
import type { Copy } from "@/lib/copy";
import type { Slug } from "@/lib/slugs";

export function Header({ slug, copy, dark = false }: { slug: Slug; copy: Copy; dark?: boolean }) {
  const names = copy.lang.names;
  return (
    <header className={`container-wide flex items-center justify-between py-3 ${dark ? "text-cream-50" : "text-night-900"}`}>
      <Link href={`/${slug}`} aria-label={brandConfig().brand} className="flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/jinglo/logo.svg" alt={brandConfig().brand} width={357} height={143} className="h-8 w-auto" />
      </Link>
      <nav aria-label={copy.lang.label} className="flex gap-1 text-sm">
        {(Object.keys(names) as Slug[]).map((s) => (
          <Link key={s} href={`/${s}`} aria-current={s === slug ? "true" : undefined} className={`rounded-full px-2.5 py-1 ${s === slug ? "bg-gold-400 font-bold text-night-950" : "opacity-80 hover:opacity-100"}`}>
            {s === "es" ? "ES" : s === "es-es" ? "ES-ES" : "EN"}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Footer({ slug, copy }: { slug: Slug; copy: Copy }) {
  const b = brandConfig();
  return (
    <footer className="mt-16 bg-night-950 py-10 text-sm text-cream-50/80">
      <div className="container-wide flex flex-col gap-3">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href={`/${slug}/privacidad`} className="underline underline-offset-4">{copy.nav.privacy}</Link>
          <Link href={`/${slug}/terminos`} className="underline underline-offset-4">{copy.nav.terms}</Link>
          <a href={`mailto:${b.supportEmail}`} className="underline underline-offset-4">{copy.nav.support}</a>
          <ConsentLink id={process.env.META_PIXEL_ID} slug={slug} />
        </div>
        <p>
          {b.brand}, {copy.footer.operator}. {copy.footer.rights}
        </p>
      </div>
    </footer>
  );
}
