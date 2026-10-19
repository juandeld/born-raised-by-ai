import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** /colorear picks the language from Accept-Language (Spanish first, English otherwise). */
export default async function Index() {
  const al = (await headers()).get("accept-language")?.toLowerCase() ?? "";
  const first = al.split(",")[0] ?? "";
  redirect(first.startsWith("en") ? "/colorear/en" : first.startsWith("es") ? "/colorear/es" : al.includes("es") && !al.includes("en") ? "/colorear/es" : "/colorear/en");
}
