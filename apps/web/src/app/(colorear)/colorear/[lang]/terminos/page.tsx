import { notFound } from "next/navigation";
import { isColorearLang } from "@lumen/config";
import { CFooter, CHeader } from "@/components/colorear/Chrome";
import { COLOREAR_COPY } from "@/lib/colorear-copy";
import { COLOREAR_TERMS } from "@/lib/colorear-legal-pages";
import { colorearDocumentVars } from "@/lib/legal-vars";

export const dynamic = "force-dynamic";

export default async function Terminos({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isColorearLang(lang)) notFound();
  const t = COLOREAR_TERMS[lang];
  const vars = colorearDocumentVars("");
  const sub = (s: string) => s.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);
  return (
    <>
      <CHeader lang={lang} />
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <h1 className="text-3xl font-black">{t.title}</h1>
        {t.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-extrabold">{s.h}</h2>
            <p>{sub(s.p)}</p>
          </section>
        ))}
        <p className="text-sm opacity-70">{COLOREAR_COPY[lang].legalNote}</p>
      </main>
      <CFooter lang={lang} />
    </>
  );
}
