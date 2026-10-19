import { getColorear } from "@/lib/colorear";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** The book. Needs the order token AND a signed link that expires in minutes (made by /api/colorear/estado or the delivery page). */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const t = u.searchParams.get("t") ?? "";
  const s = u.searchParams.get("s");
  const engine = getColorear();
  if (!/^[a-f0-9]{32}$/.test(t) || !engine.verifyDownload(t, s)) return new Response("Link expired", { status: 403 });
  const file = await engine.readPdf(t);
  if (!file) return new Response("Not found", { status: 404 });
  await engine.trackDownload(t).catch(() => undefined);
  const download = u.searchParams.get("download") === "1";
  return new Response(Buffer.from(file.bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-length": String(file.bytes.byteLength),
      "content-disposition": `${download ? "attachment" : "inline"}; filename="${file.filename}"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  });
}
