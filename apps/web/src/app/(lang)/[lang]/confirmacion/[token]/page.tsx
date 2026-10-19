import Link from "next/link";
import { COUNTRIES, type CountryCode } from "@lumen/config";
import { AutoRefresh } from "@/components/AutoRefresh";
import { DevRunCall } from "@/components/DevRunCall";
import { Footer, Header } from "@/components/SiteChrome";
import { getEngine, mockPaymentsAllowed } from "@/lib/engine";
import { resolveSlug } from "@/lib/slugs";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Success URL of the checkout. May be opened before the payment webhook lands: it shows "confirming" and refreshes itself. */
export default async function Confirmacion({ params }: { params: Promise<{ lang: string; token: string }> }) {
  const { lang, token } = await params;
  const { slug, copy } = resolveSlug(lang);
  const engine = getEngine();
  const order = (await engine.deps.db.orders.find({ access_token: token }, { limit: 1 }))[0];

  const shell = (children: React.ReactNode) => (
    <>
      <div className="bg-night-950"><Header slug={slug} copy={copy} dark /></div>
      <main className="container-narrow py-10">{children}</main>
      <Footer slug={slug} copy={copy} />
    </>
  );

  if (!order || order.pii_purged_at) return shell(<h1 className="font-display text-3xl font-bold">{copy.confirm.notFound}</h1>);
  if (order.status === "refunded") return shell(<h1 className="font-display text-3xl font-bold">{copy.confirm.refunded}</h1>);
  if (order.status === "created") {
    return shell(
      <div role="status" aria-live="polite">
        <AutoRefresh />
        <h1 className="font-display text-3xl font-bold">{copy.confirm.pendingTitle}</h1>
        <p className="mt-2 text-night-900/80">{copy.confirm.pendingText}</p>
      </div>,
    );
  }

  const country = COUNTRIES[order.country as CountryCode];
  const fmt = new Intl.DateTimeFormat(country.priceFormatLocale, { timeZone: order.timezone, dateStyle: "full", timeStyle: "short" });
  const fmtEnd = new Intl.DateTimeFormat(country.priceFormatLocale, { timeZone: order.timezone, timeStyle: "short" });
  const when = `${fmt.format(new Date(order.window_start))} - ${fmtEnd.format(new Date(order.window_end))}`;
  const showDev = order.test_mode && order.status === "scheduled" && mockPaymentsAllowed() && engine.deps.payments.name === "mock";
  const realCalls = engine.deps.telephony.name !== "mock";

  return shell(
    <>
      <p className="text-5xl" aria-hidden>&#127876;</p>
      <h1 className="mt-2 font-display text-3xl font-bold">{copy.confirm.title(order.child_first_name ?? "")}</h1>
      <div className="mt-5 rounded-3xl border-2 border-gold-500 bg-paper p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-night-900/60">{copy.confirm.callWindow}</p>
        <p className="mt-1 font-display text-2xl font-bold">{when}</p>
        <p className="mt-1 text-sm text-night-900/70">{order.timezone.replace(/_/g, " ")}</p>
      </div>
      <p className="mt-4 text-night-900/80">{copy.confirm.receiptSent}</p>
      <ol className="mt-5 space-y-3">
        {copy.confirm.steps.map((s, i) => (
          <li key={s} className="flex gap-3"><span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-night-900 font-bold text-gold-400">{i + 1}</span><span className="pt-0.5">{s}</span></li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-night-900/70">{copy.confirm.queued}</p>
      {order.test_mode && <p className="mt-4 rounded-xl bg-gold-300/40 p-3 text-sm font-semibold">{copy.confirm.testNote}</p>}
      {showDev && <DevRunCall token={token} real={realCalls} />}
      <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href={`/${slug}/reembolso/${token}`} className="underline underline-offset-2">{copy.confirm.refund}</Link>
        <Link href={`/${slug}/baja/${token}`} className="underline underline-offset-2">{copy.confirm.optOut}</Link>
      </p>
    </>,
  );
}
