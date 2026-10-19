import { getEngine } from "@/lib/engine";

export const runtime = "nodejs";

/** Streams the MP3 or the certificate after checking token, expiry and purge. The storage path never leaves the server. */
export async function GET(req: Request, ctx: { params: Promise<{ token: string; kind: string }> }) {
  const { token, kind } = await ctx.params;
  if (kind !== "mp3" && kind !== "pdf") return new Response("Not found", { status: 404 });
  const file = await getEngine().readDeliveryFile(token, kind);
  if (!file) return new Response("Not found", { status: 404 });
  const download = new URL(req.url).searchParams.get("download") === "1";
  return new Response(Buffer.from(file.bytes), {
    headers: {
      "content-type": file.contentType,
      "content-length": String(file.bytes.byteLength),
      "content-disposition": `${download ? "attachment" : "inline"}; filename="${file.filename}"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  });
}
