import { notFound } from "next/navigation";
import { colorearMockPayAllowed } from "@lumen/config";
import { CFooter, CHeader } from "@/components/colorear/Chrome";
import { MockPay } from "@/components/colorear/MockPay";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false }, title: "Pintoria" };

/**
 * Test-mode payment page of a colorear order (Pintoria brand; the Santa page `/pago-prueba` is never used for colorear). It stands in for the
 * payment provider and never charges anything. Closed (404) on the live deployment unless COLOREAR_ALLOW_MOCK_PAY=1.
 */
export default async function PagoPruebaColorear({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!colorearMockPayAllowed()) notFound();
  const sp = await searchParams;
  return (
    <>
      <CHeader lang="es" />
      <main className="mx-auto max-w-xl px-4 py-8">
        <div className="rounded-2xl border border-lapiz-line bg-white p-6">
          <p className="c-stamp inline-block">Test mode / Modo de prueba</p>
          <h1 className="c-h mt-3 text-2xl">Test payment / Pago de prueba</h1>
          <p className="mb-6 mt-2">Nothing is charged. This page stands in for the payment provider. / No se cobra nada: esta página reemplaza al proveedor de pagos.</p>
          <MockPay order={sp.order ?? ""} checkout={sp.checkout ?? ""} />
        </div>
      </main>
      <CFooter lang="es" />
    </>
  );
}
