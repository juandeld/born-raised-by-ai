import { getColorear } from "@/lib/colorear";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Progress thumbnails (characters c1..c5, pages p0..p22) while the book is being made. Only with the order token. */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const t = u.searchParams.get("t") ?? "";
  const k = u.searchParams.get("k") ?? "";
  if (!/^[a-f0-9]{32}$/.test(t)) return new Response("Not found", { status: 404 });
  const img = await getColorear().readStageImage(t, k);
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(img.bytes), { headers: { "content-type": img.contentType, "cache-control": "private, max-age=300", "x-robots-tag": "noindex" } });
}
