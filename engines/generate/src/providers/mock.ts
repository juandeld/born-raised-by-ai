import { Art } from "../mock-art/kit";
import { drawCharacter, drawScene, lookOf } from "../mock-art/scenes";
import type { GeneratedImage, ImageProvider, ImageRequest } from "../types";

/** Free local drawings (SVG line art). Default until IMAGE_PROVIDER=openai; also what the landing samples and tests use. */
export class MockImageProvider implements ImageProvider {
  readonly name = "mock" as const;
  readonly model = "mock-line-art";
  async render(req: ImageRequest): Promise<GeneratedImage> {
    const art = new Art(req.width, req.height, { "3-4": 14, "5-6": 11, "7-8": 9, "9-12": 7, adult: 5 }[req.ageBand]);
    const { roles, seed, setting } = req.hints;
    const looks = roles.map((r, i) => lookOf(r, i));
    if (req.kind === "character") {
      art.translate(req.width / 2, req.height * 0.9);
      art.scale(1.25);
      drawCharacter(art, looks[0] ?? lookOf("child", 0));
    } else {
      drawScene(art, looks.length ? looks : [lookOf("child", 0)], seed, setting);
      if (req.kind === "cover") {
        // keep the top quarter free for the title: shift nothing, only add a banner outline the PDF fills with the title
        art.rect(112, 90, 800, 250, 40, "none", 8);
      }
    }
    return { format: "svg", bytes: new TextEncoder().encode(art.toSvg()), costUsdCents: 0, costSource: "free" };
  }
}
