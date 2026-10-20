import { getColorear } from "@/lib/colorear";
import { clientIp, rateLimited } from "@/lib/request";

const page = (ok: boolean) =>
  new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Pintoria</title></head><body style="font-family:system-ui;max-width:32rem;margin:3rem auto;padding:0 1rem"><h1>${ok ? "Listo / Done" : "Enlace no válido / Invalid link"}</h1><p>${ok ? "No volverá a recibir ofertas de aventuras. / You will not receive more offers." : "Escríbanos a soporte y lo resolvemos. / Write to support and we will fix it."}</p></body></html>`,
    { status: ok ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } },
  );

/** One-click stop of offers (link in every email with commercial content; also accepts POST for List-Unsubscribe-Post). */
async function handle(req: Request) {
  if (rateLimited(`colorear-baja:${clientIp(req.headers) ?? "?"}`, 20)) return new Response("Too many requests", { status: 429 });
  const u = new URL(req.url);
  const t = u.searchParams.get("t") ?? "";
  if (!/^[a-f0-9]{32}$/.test(t)) return page(false);
  return page(await getColorear().unsubscribeOffers(t, u.searchParams.get("s")));
}
export const GET = handle;
export const POST = handle;
