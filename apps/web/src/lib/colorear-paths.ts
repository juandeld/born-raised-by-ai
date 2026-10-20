import { headers } from "next/headers";
import type { ColorearLang } from "@lumen/config";

/** True when the request came through a Pintoria host (the middleware sets the header): links drop the /colorear prefix there. */
export async function onPintoria(): Promise<boolean> {
  return (await headers()).get("x-pintoria") === "1";
}

/** Public path of a colorear page: `landing` is `/` or `/en` on Pintoria hosts, `/colorear/<lang>` elsewhere. `rest` is e.g. "privacidad". */
export function cpath(pintoria: boolean, lang: ColorearLang, rest = ""): string {
  if (!pintoria) return `/colorear/${lang}${rest ? `/${rest}` : ""}`;
  if (lang === "en") return `/en${rest ? `/${rest}` : ""}`;
  return rest ? `/${rest}` : "/";
}
