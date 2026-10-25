import { IMAGE_COST_USD_CENTS, OPENAI_IMAGE_TOKEN_USD_PER_M, openaiImageFamily } from "@lumen/config";
import { ImageProviderError, type GeneratedImage, type ImageProvider, type ImageRequest } from "../types";

/**
 * OpenAI Images API. Text-to-image: POST /v1/images/generations (JSON). With reference images: POST /v1/images/edits
 * (multipart, field `image[]`, up to 16 images for gpt-image models; a character is drawn from up to 3 photos of the same person).
 * gpt-image models always answer base64 (`data[].b64_json`); they reject `response_format`, which is never sent. `input_fidelity` is never
 * sent either: gpt-image-1-mini only accepts `low`, gpt-image-2 and the 2.5 models (flare, sunburst) say to omit it (OpenAI API reference,
 * images.edit, read 25-oct-2026). Sizes: 1024x1024, 1536x1024, 1024x1536. Quality: low | medium | high (the 2.5 models also take xhigh
 * and max; we never ask for them). Model: OPENAI_IMAGE_MODEL, default gpt-image-1-mini (shut down 1-dec-2026: replacements
 * gpt-image-2.5-flare and gpt-image-2.5-sunburst; gpt-image-1 was shut down 23-oct-2026 and must never be configured).
 * Cost comes from the `usage` tokens of the response when present (prices per model family in @lumen/config, [no verificado]), else from the price table.
 */
export class OpenAIImageProvider implements ImageProvider {
  readonly name = "openai" as const;
  constructor(
    readonly model: string,
    private readonly apiKey: string,
    private readonly baseUrl = "https://api.openai.com",
    private readonly fetchFn: typeof fetch = fetch,
    private readonly timeoutMs = 100_000,
  ) {}

  static fromEnv(env: Record<string, string | undefined>): OpenAIImageProvider {
    if (!env.OPENAI_API_KEY) throw new ImageProviderError("OPENAI_API_KEY is required for IMAGE_PROVIDER=openai", "config");
    return new OpenAIImageProvider(env.OPENAI_IMAGE_MODEL || "gpt-image-1-mini", env.OPENAI_API_KEY, env.OPENAI_BASE_URL || "https://api.openai.com");
  }

  async render(req: ImageRequest): Promise<GeneratedImage> {
    const size = `${req.width}x${req.height}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    let res: Response;
    try {
      if (req.refs.length) {
        const form = new FormData();
        form.set("model", this.model);
        form.set("prompt", req.prompt);
        form.set("size", size);
        form.set("quality", req.quality);
        form.set("n", "1");
        req.refs.forEach((r, i) => {
          const ext = r.mime === "image/png" ? "png" : r.mime === "image/webp" ? "webp" : "jpg";
          form.append("image[]", new Blob([r.bytes as unknown as BlobPart], { type: r.mime }), `ref-${i + 1}.${ext}`);
        });
        res = await this.fetchFn(`${this.baseUrl}/v1/images/edits`, { method: "POST", headers: { authorization: `Bearer ${this.apiKey}` }, body: form, signal: ctrl.signal });
      } else {
        res = await this.fetchFn(`${this.baseUrl}/v1/images/generations`, {
          method: "POST",
          headers: { authorization: `Bearer ${this.apiKey}`, "content-type": "application/json" },
          body: JSON.stringify({ model: this.model, prompt: req.prompt, n: 1, size, quality: req.quality, output_format: "png" }),
          signal: ctrl.signal,
        });
      }
    } catch (err) {
      throw new ImageProviderError(`OpenAI request failed: ${err instanceof Error ? err.message : String(err)}`, "server");
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) throw await this.errorOf(res);
    const j = (await res.json()) as { data?: Array<{ b64_json?: string }>; usage?: Usage };
    const b64 = j.data?.[0]?.b64_json;
    if (!b64) throw new ImageProviderError("OpenAI returned no image", "bad_output");
    return { format: "png", bytes: new Uint8Array(Buffer.from(b64, "base64")), ...this.cost(req, j.usage) };
  }

  private async errorOf(res: Response): Promise<ImageProviderError> {
    const text = await res.text().catch(() => "");
    let code = "";
    try {
      code = (JSON.parse(text) as { error?: { code?: string } }).error?.code ?? "";
    } catch {
      /* not json */
    }
    if (res.status === 429) {
      const ra = Number(res.headers.get("retry-after"));
      const fatal = code === "insufficient_quota" || code === "billing_hard_limit_reached";
      return new ImageProviderError(`OpenAI rate limit (${code})`, fatal ? "auth" : "rate_limit", Number.isFinite(ra) && ra > 0 ? ra * 1000 : 8000);
    }
    if (res.status === 401 || res.status === 403) return new ImageProviderError(`OpenAI auth ${res.status}: ${code}`, "auth");
    if (res.status === 400 && /moderation|safety|content_policy|policy/i.test(`${code} ${text}`)) return new ImageProviderError(`OpenAI moderation block (${code})`, "moderation");
    if (res.status >= 500) return new ImageProviderError(`OpenAI server ${res.status}`, "server");
    return new ImageProviderError(`OpenAI error ${res.status}: ${code || text.slice(0, 160)}`, "bad_output");
  }

  /** Token prices per 1M by model family (OPENAI_IMAGE_TOKEN_USD_PER_M, [no verificado]): mini, gpt-image-1 and the 2.5 / 2 generation. */
  private cost(req: ImageRequest, usage?: Usage): { costUsdCents: number; costSource: "usage" | "estimate" } {
    const family = openaiImageFamily(this.model);
    if (usage && typeof usage.output_tokens === "number") {
      const rate = OPENAI_IMAGE_TOKEN_USD_PER_M[family];
      const imgIn = usage.input_tokens_details?.image_tokens ?? 0;
      const txtIn = usage.input_tokens_details?.text_tokens ?? Math.max(0, (usage.input_tokens ?? 0) - imgIn);
      const dollars = (usage.output_tokens * rate.out + txtIn * rate.text + imgIn * rate.image) / 1_000_000;
      return { costUsdCents: Math.round(dollars * 100 * 1000) / 1000, costSource: "usage" };
    }
    return { costUsdCents: IMAGE_COST_USD_CENTS[family === "mini" ? "openai-mini" : family === "v1" ? "openai" : "openai-v2"][req.quality], costSource: "estimate" };
  }
}

interface Usage {
  input_tokens?: number;
  output_tokens?: number;
  input_tokens_details?: { text_tokens?: number; image_tokens?: number };
}
