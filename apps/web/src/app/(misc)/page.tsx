import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** The root sends each visitor to a language by Accept-Language. Visible selector on every page lets them change it. */
export default async function Root() {
  const accept = ((await headers()).get("accept-language") ?? "").toLowerCase();
  const first = accept.split(",")[0]?.trim() ?? "";
  if (first.startsWith("es-es")) redirect("/es-es");
  if (first.startsWith("es")) redirect("/es");
  if (first.startsWith("en")) redirect("/en");
  redirect("/es");
}
