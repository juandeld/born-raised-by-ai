import { NextResponse, type NextRequest } from "next/server";
import { colorearRewrite, isColorearHost } from "@/lib/colorear-host";

/** Pintoria hosts serve colorear at the root (see lib/colorear-host.ts). Any other host passes through unchanged. */
export function middleware(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!isColorearHost(host)) return NextResponse.next();
  const target = colorearRewrite(req.nextUrl.pathname);
  if (target === req.nextUrl.pathname) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = target;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
