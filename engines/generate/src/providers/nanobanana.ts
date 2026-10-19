import { ImageProviderError, type GeneratedImage, type ImageProvider, type ImageRequest } from "../types";

/**
 * Alternate provider (Nano Banana, Google). Stub: D15 made OpenAI the initial provider. When Juan wants it, implement
 * render() against the Gemini image API (it accepts reference images) [no verificado: model id and request shape].
 */
export class NanoBananaImageProvider implements ImageProvider {
  readonly name = "nanobanana" as const;
  readonly model = "nano-banana (not implemented)";
  async render(_req: ImageRequest): Promise<GeneratedImage> {
    throw new ImageProviderError("IMAGE_PROVIDER=nanobanana is not implemented yet (D15: openai is the current provider)", "config");
  }
}
