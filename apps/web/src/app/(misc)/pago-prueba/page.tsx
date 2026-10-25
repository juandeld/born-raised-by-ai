import { notFound } from "next/navigation";
import { MockPayButtons } from "@/components/MockPayButtons";
import { isColorearOrder } from "@/lib/colorear";
import { mockPaymentsAllowed } from "@/lib/engine";

export const dynamic = "force-dynamic";

/** Test-mode payment page (Santa): stands in for Polar / Recurrente. Never charges anything. Closed on the live deployment. A colorear order has its own page, /colorear/pago-prueba. */
export default async function PagoPrueba({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!mockPaymentsAllowed()) notFound();
  const sp = await searchParams;
  if (sp.order && (await isColorearOrder(sp.order, sp.checkout))) notFound();
  return (
    <main className="container-narrow py-12">
      <p className="inline-block rounded-full bg-gold-300 px-3 py-1 text-xs font-bold uppercase tracking-wide">Test mode / Modo de prueba</p>
      <h1 className="mt-3 font-display text-3xl font-bold">Test payment / Pago de prueba</h1>
      <p className="mb-6 mt-2 text-night-900/80">Nothing is charged. This page stands in for the payment provider. / No se cobra nada: esta página reemplaza al proveedor de pagos.</p>
      <MockPayButtons order={sp.order ?? ""} checkout={sp.checkout ?? ""} />
    </main>
  );
}
