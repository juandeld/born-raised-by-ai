import { notFound } from "next/navigation";
import { CFooter, CHeader } from "@/components/colorear/Chrome";
import { StatusView, type StatusDto } from "@/components/colorear/StatusView";
import { getColorear } from "@/lib/colorear";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false }, title: "Pintoria" };

/** Order page: payment confirmation, live progress, and the download when the book is ready. The token in the URL is the key (128 bits). */
export default async function Confirmacion({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{32}$/.test(token)) notFound();
  const st = await getColorear().getStatus(token);
  if (!st) notFound();
  const { hasPdf: _h, country: _c, ...dto } = st;
  void _h; void _c;
  return (
    <>
      <CHeader lang={st.lang} />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <StatusView token={token} initial={dto as StatusDto} />
      </main>
      <CFooter lang={st.lang} />
    </>
  );
}
