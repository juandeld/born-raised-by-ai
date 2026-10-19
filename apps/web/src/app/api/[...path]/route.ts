import { dispatch } from "@/server/dispatch";

// The ONLY route handler under app/api (Vercel Hobby: max 12 functions). Single config for every endpoint;
// 300 s covers colorear/run. Do not add other route.ts files here: register in src/server/dispatch.ts.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type Ctx = { params: Promise<{ path: string[] }> };
export const GET = (req: Request, ctx: Ctx) => dispatch("GET", req, ctx);
export const HEAD = (req: Request, ctx: Ctx) => dispatch("HEAD", req, ctx);
export const POST = (req: Request, ctx: Ctx) => dispatch("POST", req, ctx);
export const PUT = (req: Request, ctx: Ctx) => dispatch("PUT", req, ctx);
export const PATCH = (req: Request, ctx: Ctx) => dispatch("PATCH", req, ctx);
export const DELETE = (req: Request, ctx: Ctx) => dispatch("DELETE", req, ctx);
