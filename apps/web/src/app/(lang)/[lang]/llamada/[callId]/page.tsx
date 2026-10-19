import { Footer, Header } from "@/components/SiteChrome";
import { WebCall } from "@/components/WebCall";
import { getEngine } from "@/lib/engine";
import { resolveSlug } from "@/lib/slugs";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Llamada({ params }: { params: Promise<{ lang: string; callId: string }> }) {
  const { lang, callId } = await params;
  const { slug, copy } = resolveSlug(lang);
  const db = getEngine().deps.db;
  const call = await db.calls.get(callId);
  const order = call ? await db.orders.get(call.order_id) : null;
  const c = copy.call;
  return (
    <>
      <div className="bg-night-950"><Header slug={slug} copy={copy} dark /></div>
      <main className="container-narrow py-10">
        {!call || !order || order.pii_purged_at ? (
          <h1 className="font-display text-3xl font-bold">{c.notFound}</h1>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold">{c.title}</h1>
            <p className="mt-2 text-night-900/80">{c.intro}</p>
            <p className="mb-6 mt-4 rounded-2xl border-2 border-night-900 bg-white p-4 text-sm">{c.notice}</p>
            <WebCall labels={c} />
          </>
        )}
      </main>
      <Footer slug={slug} copy={copy} />
    </>
  );
}
