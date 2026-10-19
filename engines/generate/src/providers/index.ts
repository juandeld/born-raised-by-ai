import { imageProviderName } from "@lumen/config";
import type { ImageProvider } from "../types";
import { MockImageProvider } from "./mock";
import { NanoBananaImageProvider } from "./nanobanana";
import { OpenAIImageProvider } from "./openai";

export { MockImageProvider, NanoBananaImageProvider, OpenAIImageProvider };

/**
 * IMAGE_PROVIDER = openai | nanobanana | mock (default mock). With openai the key comes from OPENAI_API_KEY and the model from
 * OPENAI_IMAGE_MODEL (default gpt-image-1-mini). If openai is requested but the key is missing, the mock is used and a warning is logged,
 * so the site keeps working while the secret is not yet in the environment.
 */
export function createImageProvider(env: Record<string, string | undefined> = process.env): ImageProvider {
  switch (imageProviderName(env)) {
    case "openai":
      if (!env.OPENAI_API_KEY) {
        console.warn("[generate] IMAGE_PROVIDER=openai but OPENAI_API_KEY is missing; using the mock provider");
        return new MockImageProvider();
      }
      return OpenAIImageProvider.fromEnv(env);
    case "nanobanana":
      return new NanoBananaImageProvider();
    default:
      return new MockImageProvider();
  }
}
