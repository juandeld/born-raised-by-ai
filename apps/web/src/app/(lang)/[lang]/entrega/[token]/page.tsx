import Link from "next/link";
import { AutoRefresh } from "@/components/AutoRefresh";
import { SurveyButtons } from "@/components/ActionButtons";
import { Footer, Header } from "@/components/SiteChrome";
import { baseUrl, getEngine } from "@/lib/engine";
import { resolveSlug } from "@/lib/slugs";

export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

/** Delivery page: MP3, certificate, WhatsApp share, one-tap survey. The token in the URL is the only credential. */
export default async function Entrega({ params }: { params: Promise<{ lang: string; token: string }> }) {
  const { lang, token } = await params;
  const { slug, copy } = resolveSlug(lang);
  const d = copy.delivery;
  const view = await getEngine().getDeliveryView(token);

  const shell = (children: React.ReactNode) => (
    <>
      <div className="bg-night-950"><Header slug={slug} copy={copy} dark /></div>
      <main className="container-narrow py-10">{children}</main>
      <Footer slug={slug} copy={copy} />
    </>
  );

  if (!view) return shell(<h1 className="font-display text-3xl font-bold">{d.notFound}</h1>);
  if (view.status === "refunded") return shell(<><h1 className="font-display text-3xl font-bold">{d.refundedTitle}</h1><p className="mt-2 text-night-900/80">{d.refundedText}</p></>);
  if (view.status === "expired") return shell(<><h1 className="font-display text-3xl font-bold">{d.expiredTitle}</h1><p className="mt-2 text-night-900/80">{d.expiredText}</p></>);
  if (view.status === "pending") {
    return shell(
      <div role="status" aria-live="polite">
        <AutoRefresh everyMs={5000} />
        <h1 className="font-display text-3xl font-bold">{d.pendingTitle}</h1>
        <p className="mt-2 text-night-900/80">{d.pendingText}</p>
      </div>,
    );
  }

  const expires = view.expiresAt ? view.expiresAt.slice(0, 10) : "";
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${d.shareText} ${baseUrl()}/${slug}`)}`;
  return shell(
    <>
      <p className="text-5xl" aria-hidden>&#127877;</p>
      <h1 className="mt-2 font-display text-3xl font-bold">{d.title(view.childFirstName ?? "")}</h1>

      {view.hasMp3 && (
        <section className="mt-6 rounded-3xl border-2 border-gold-500 bg-white p-5" aria-label={d.listen}>
          <h2 className="font-bold">{d.listen}</h2>
          <audio controls preload="none" src={`/api/entrega/${token}/mp3`} className="mt-3 w-full" />
          <a href={`/api/entrega/${token}/mp3?download=1`} className="btn btn-gold mt-4">{d.downloadMp3}</a>
        </section>
      )}
      {view.hasPdf && (
        <a href={`/api/entrega/${token}/pdf?download=1`} className="btn btn-ghost mt-4">{d.downloadPdf}</a>
      )}
      {expires && <p className="mt-3 text-sm text-night-900/70">{d.expires(expires)}</p>}

      <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="btn mt-6 bg-[#1faa59] text-white">{d.share}</a>

      <section className="mt-10">
        {view.surveyAnswered ? (
          <p className="rounded-2xl bg-holly-500/10 p-4 text-center font-semibold text-holly-600" role="status">{d.surveyThanks}</p>
        ) : (
          <SurveyButtons token={token} labels={d.survey} thanks={d.surveyThanks} title={d.surveyTitle} />
        )}
      </section>

      <p className="mt-10 text-sm"><Link href={`/${slug}/reembolso/${token}`} className="underline underline-offset-2">{d.refundLink}</Link></p>
    </>,
  );
}
