import { notFound, redirect } from "next/navigation";
import { LOCALE_SLUG, type Locale } from "@lumen/config";
import { getEngine } from "@/lib/engine";

export const dynamic = "force-dynamic";

/** The web transport hands out /llamada/<callId> without a language; this sends the buyer to the page in their language. */
export default async function CallRedirect({ params }: { params: Promise<{ callId: string }> }) {
  const { callId } = await params;
  const db = getEngine().deps.db;
  const call = await db.calls.get(callId);
  const order = call ? await db.orders.get(call.order_id) : null;
  if (!order) notFound();
  redirect(`/${LOCALE_SLUG[order.language as Locale] ?? "es"}/llamada/${callId}`);
}
