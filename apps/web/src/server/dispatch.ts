/**
 * API dispatcher. Vercel Hobby allows at most 12 serverless functions per deployment, and every
 * `app/api/**\/route.ts` becomes its own function. So ALL HTTP API endpoints live behind the single
 * catch-all `app/api/[...path]/route.ts`, which calls this table. URLs are unchanged.
 *
 * To add an endpoint: create `server/api/<name>.ts` exporting GET/POST/... handlers, then add one row here.
 * Never add another `route.ts` under `app/api` (see docs/arquitectura/limite-funciones-vercel.md).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (req: Request, ctx: any) => Response | Promise<Response>;
type Mod = Partial<Record<"GET" | "POST" | "PUT" | "DELETE" | "PATCH", Handler>>;

/** Pattern segments starting with ":" capture a path parameter. */
export const API_ROUTES: ReadonlyArray<readonly [pattern: string, load: () => Promise<unknown>]> = [
  ["calls/tools/:tool", () => import("./api/calls-tools-tool")],
  ["calls/twilio/status", () => import("./api/calls-twilio-status")],
  ["calls/twilio/voice", () => import("./api/calls-twilio-voice")],
  ["checkout", () => import("./api/checkout")],
  ["colorear/baja", () => import("./api/colorear-baja")],
  ["colorear/checkout", () => import("./api/colorear-checkout")],
  ["colorear/credito", () => import("./api/colorear-credito")],
  ["colorear/estado", () => import("./api/colorear-estado")],
  ["colorear/imagen", () => import("./api/colorear-imagen")],
  ["colorear/oferta", () => import("./api/colorear-oferta")],
  ["colorear/pdf", () => import("./api/colorear-pdf")],
  ["colorear/personajes", () => import("./api/colorear-personajes")],
  ["colorear/refund", () => import("./api/colorear-refund")],
  ["colorear/run", () => import("./api/colorear-run")],
  ["colorear/survey", () => import("./api/colorear-survey")],
  ["colorear/track", () => import("./api/colorear-track")],
  ["cron/tick", () => import("./api/cron-tick")],
  ["dev/run-call", () => import("./api/dev-run-call")],
  ["entrega/:token/:kind", () => import("./api/entrega-token-kind")],
  ["health", () => import("./api/health")],
  ["inngest", () => import("./api/inngest")],
  ["meta", () => import("./api/meta")],
  ["mock-pay", () => import("./api/mock-pay")],
  ["optout", () => import("./api/optout")],
  ["refund", () => import("./api/refund")],
  ["survey", () => import("./api/survey")],
  ["track", () => import("./api/track")],
  ["webhooks/:provider", () => import("./api/webhooks-provider")],
];

export function matchRoute(segments: string[]): { load: () => Promise<unknown>; params: Record<string, string> } | null {
  for (const [pattern, load] of API_ROUTES) {
    const parts = pattern.split("/");
    if (parts.length !== segments.length) continue;
    const params: Record<string, string> = {};
    let ok = true;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]!.startsWith(":")) params[parts[i]!.slice(1)] = segments[i]!;
      else if (parts[i] !== segments[i]) { ok = false; break; }
    }
    if (ok) return { load, params };
  }
  return null;
}

export async function dispatch(method: string, req: Request, ctx: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const { path } = await ctx.params;
  const hit = matchRoute(path.map((s) => decodeURIComponent(s)));
  if (!hit) return Response.json({ error: "not_found" }, { status: 404 });
  const mod = (await hit.load()) as Mod;
  const handler = mod[method as keyof Mod] ?? (method === "HEAD" ? mod.GET : undefined);
  if (!handler) return new Response("Method Not Allowed", { status: 405 });
  return handler(req, { params: Promise.resolve(hit.params) });
}
