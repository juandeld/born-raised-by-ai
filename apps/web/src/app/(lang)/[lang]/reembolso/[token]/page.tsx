import { TokenAction } from "@/components/ActionButtons";
import { Footer, Header } from "@/components/SiteChrome";
import { resolveSlug } from "@/lib/slugs";

export const metadata = { robots: { index: false, follow: false } };

export default async function Reembolso({ params }: { params: Promise<{ lang: string; token: string }> }) {
  const { lang, token } = await params;
  const { slug, copy } = resolveSlug(lang);
  const r = copy.refundPage;
  return (
    <>
      <div className="bg-night-950"><Header slug={slug} copy={copy} dark /></div>
      <main className="container-narrow py-10">
        <h1 className="font-display text-3xl font-bold">{r.title}</h1>
        <p className="mb-6 mt-2 text-night-900/80">{r.text}</p>
        <TokenAction endpoint="/api/refund" token={token} button={r.button} messages={{ ok: r.done, outside: r.outside, failed: r.failed }} />
      </main>
      <Footer slug={slug} copy={copy} />
    </>
  );
}
