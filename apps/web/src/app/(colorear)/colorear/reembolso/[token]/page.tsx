import { notFound } from "next/navigation";
import { CFooter, CHeader } from "@/components/colorear/Chrome";
import { RefundButton } from "@/components/colorear/RefundButton";
import { getColorear } from "@/lib/colorear";
import { COLOREAR_COPY } from "@/lib/colorear-copy";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false }, title: "Pintoria" };

export default async function Reembolso({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{32}$/.test(token)) notFound();
  const st = await getColorear().getStatus(token);
  if (!st) notFound();
  // An order that was never charged (test code, test payment) is cancelled, not refunded: no promise about a payment that does not exist.
  const c = st.testMode ? COLOREAR_COPY[st.lang].noCharge.refundPage : COLOREAR_COPY[st.lang].refundPage;
  return (
    <>
      <CHeader lang={st.lang} />
      <main className="mx-auto max-w-xl px-4 py-6">
        <div className="rounded-2xl border border-lapiz-line bg-white p-6">
          <h1 className="text-2xl font-bold">{c.title}</h1>
          <p className="mt-2">{c.text}</p>
          {st.phase === "refunded" ? <p className="mt-4 font-bold">{c.done}</p> : <RefundButton token={token} lang={st.lang} testMode={st.testMode} />}
        </div>
      </main>
      <CFooter lang={st.lang} />
    </>
  );
}
