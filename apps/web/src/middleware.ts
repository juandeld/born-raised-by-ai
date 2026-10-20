import { NextResponse, type NextRequest } from "next/server";
import { colorearRewrite, isColorearHost } from "@/lib/colorear-host";

/** Pintoria hosts serve colorear at the root (see lib/colorear-host.ts). Any other host passes through unchanged. */
export function middleware(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!isColorearHost(host)) return NextResponse.next();
  // Pages read this header to build clean links (/en instead of /colorear/en) on the Pintoria hosts.
  const headers = new Headers(req.headers);
  headers.set("x-pintoria", "1");
  const target = colorearRewrite(req.nextUrl.pathname);
  if (target === req.nextUrl.pathname) return NextResponse.next({ request: { headers } });
  const url = req.nextUrl.clone();
  url.pathname = target;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
