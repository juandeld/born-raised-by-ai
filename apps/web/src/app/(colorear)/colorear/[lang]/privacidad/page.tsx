import { notFound } from "next/navigation";
import { colorearLegalLocale, colorearCountriesFor, isColorearLang } from "@lumen/config";
import { fill, renderColorearAviso } from "@lumen/legal";
import { CFooter, CHeader } from "@/components/colorear/Chrome";
import { COLOREAR_COPY } from "@/lib/colorear-copy";
import { documentVars } from "@/lib/legal-vars";

export const dynamic = "force-dynamic";

export default async function Privacidad({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isColorearLang(lang)) notFound();
  const c = COLOREAR_COPY[lang];
  const vars = documentVars("");
  const country = colorearCountriesFor(lang)[0]!;
  const a = renderColorearAviso(colorearLegalLocale(country), vars, { gb: country === "GB" });
  return (
    <>
      <CHeader lang={lang} />
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <h1 className="text-3xl font-black">{c.nav.privacy}</h1>
        <p>{a.intro}</p>
        {a.sections.map((s) => <p key={s.heading}><strong>{s.heading}</strong> {s.body}</p>)}
        <p>{fill(lang === "es" ? "Contacto de privacidad: {{EMAIL_PRIVACIDAD}}. Operado por {{TITULAR}}, {{DOMICILIO}}. Vigente desde {{FECHA_VIGENCIA}}." : "Privacy contact: {{EMAIL_PRIVACIDAD}}. Operated by {{TITULAR}}, {{DOMICILIO}}. Effective {{FECHA_VIGENCIA}}.", vars)}</p>
        <p className="text-sm opacity-70">{c.legalNote}</p>
      </main>
      <CFooter lang={lang} />
    </>
  );
}
