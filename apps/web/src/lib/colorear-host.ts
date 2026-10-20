/**
 * Host routing for Pintoria (colorear). On the Pintoria hosts the site root is the colorear landing: `/` -> /colorear/es,
 * `/en` -> /colorear/en, and the colorear pages work without the /colorear prefix. Every other host (the vercel.app host,
 * lumen-labs.co) is untouched. Santa/Jinglo routes and APIs are not reachable from the Pintoria hosts (404).
 * Pure string logic so it runs in the edge middleware and in tests.
 */
export function colorearHosts(env: Record<string, string | undefined> = process.env): string[] {
  const raw = env.COLOREAR_HOSTS || "pintoria.app,www.pintoria.app";
  return raw.split(",").map((h) => h.trim().toLowerCase()).filter(Boolean);
}

export function isColorearHost(hostHeader: string | null | undefined, env: Record<string, string | undefined> = process.env): boolean {
  const host = (hostHeader ?? "").toLowerCase().replace(/:\d+$/, "");
  return colorearHosts(env).includes(host);
}

/** Path served for `pathname` on a Pintoria host, or "/colorear/not-found" when the path does not belong to colorear. */
export function colorearRewrite(pathname: string): string {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (p === "/" || p === "/es") return "/colorear/es";
  if (p === "/en") return "/colorear/en";
  let m = /^\/(es|en)\/(privacidad|terminos)$/.exec(p);
  if (m) return `/colorear/${m[1]}/${m[2]}`;
  m = /^\/(privacidad|terminos)$/.exec(p);
  if (m) return `/colorear/es/${m[1]}`;
  if (/^\/(entrega|confirmacion|reembolso)\/[a-f0-9]{32}$/.test(p)) return `/colorear${p}`;
  if (p === "/colorear" || p.startsWith("/colorear/")) return p;
  if (p.startsWith("/_next/") || p.startsWith("/pintoria/")) return p;
  if (p === "/pago-prueba" || p === "/favicon.ico" || p === "/robots.txt") return p;
  if (/^\/api\/(colorear\/|webhooks\/|mock-pay$|health$)/.test(p)) return p;
  return "/colorear/not-found";
}
