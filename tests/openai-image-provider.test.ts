import { describe, expect, it } from "vitest";
import { OpenAIImageProvider, type ImageRequest } from "@lumen/generate";

/**
 * The OpenAI image provider behind OPENAI_IMAGE_MODEL: what it sends (all reference photos of a person as `image[]`, never the fields the
 * newer models reject) and how it prices an image by model family. No network: the fetch function is injected.
 */
const PNG_B64 = Buffer.from("png-bytes").toString("base64");

function fake(usage?: unknown) {
  const calls: Array<{ url: string; body: FormData | Record<string, unknown> }> = [];
  const fetchFn = (async (url: string, init: RequestInit) => {
    calls.push({ url, body: init.body instanceof FormData ? init.body : (JSON.parse(String(init.body)) as Record<string, unknown>) });
    return new Response(JSON.stringify({ data: [{ b64_json: PNG_B64 }], ...(usage ? { usage } : {}) }), { status: 200 });
  }) as unknown as typeof fetch;
  return { calls, fetchFn };
}
const ref = (n: number) => ({ bytes: new Uint8Array([n, n, n]), mime: "image/jpeg" as const });
const req = (refs: ImageRequest["refs"], quality: ImageRequest["quality"] = "medium"): ImageRequest => ({
  prompt: "a cartoon", width: 1024, height: 1024, quality, refs, kind: "character", ageBand: "5-6", hints: { roles: ["girl"], setting: "", seed: 1 },
});

describe("OpenAI image provider", () => {
  it("sends every reference photo as image[] to the edits endpoint, without input_fidelity or response_format", async () => {
    const { calls, fetchFn } = fake();
    const p = new OpenAIImageProvider("gpt-image-2.5-flare", "k", "https://api.example", fetchFn);
    const out = await p.render(req([ref(1), ref(2), ref(3)], "low"));
    expect(out.format).toBe("png");
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe("https://api.example/v1/images/edits");
    const form = calls[0]!.body as FormData;
    expect(form.getAll("image[]")).toHaveLength(3);
    expect(form.get("model")).toBe("gpt-image-2.5-flare");
    expect(form.get("quality")).toBe("low");
    expect(form.has("input_fidelity")).toBe(false);
    expect(form.has("response_format")).toBe(false);
  });

  it("uses the generations endpoint without references, and never sends the fields the newer models reject", async () => {
    const { calls, fetchFn } = fake();
    await new OpenAIImageProvider("gpt-image-1-mini", "k", "https://api.example", fetchFn).render(req([]));
    expect(calls[0]!.url).toBe("https://api.example/v1/images/generations");
    expect(Object.keys(calls[0]!.body as Record<string, unknown>).sort()).toEqual(["model", "n", "output_format", "prompt", "quality", "size"]);
  });

  it("prices an image from the API usage tokens by model family", async () => {
    const usage = { input_tokens: 3200, output_tokens: 1000, input_tokens_details: { text_tokens: 200, image_tokens: 3000 } };
    const price = async (model: string) => (await new OpenAIImageProvider(model, "k", "https://api.example", fake(usage).fetchFn).render(req([ref(1)]))).costUsdCents;
    expect(await price("gpt-image-1-mini")).toBeCloseTo(1.59, 3); // 1000 x 8 + 200 x 2 + 3000 x 2.5, per 1M
    expect(await price("gpt-image-2.5-flare")).toBeCloseTo(5.5, 3); // 1000 x 30 + 200 x 5 + 3000 x 8
    expect(await price("gpt-image-2.5-sunburst")).toBeCloseTo(5.5, 3);
  });

  it("falls back to the price table when the answer has no usage", async () => {
    const cost = async (model: string) => {
      const out = await new OpenAIImageProvider(model, "k", "https://api.example", fake().fetchFn).render(req([]));
      return [out.costUsdCents, out.costSource];
    };
    expect(await cost("gpt-image-1-mini")).toEqual([1.5, "estimate"]);
    expect(await cost("gpt-image-2.5-flare")).toEqual([1.2, "estimate"]);
  });

  it("takes the model from OPENAI_IMAGE_MODEL and defaults to gpt-image-1-mini, never to the shut-down gpt-image-1", () => {
    expect(OpenAIImageProvider.fromEnv({ OPENAI_API_KEY: "k" }).model).toBe("gpt-image-1-mini");
    expect(OpenAIImageProvider.fromEnv({ OPENAI_API_KEY: "k", OPENAI_IMAGE_MODEL: "gpt-image-2.5-flare" }).model).toBe("gpt-image-2.5-flare");
    expect(() => OpenAIImageProvider.fromEnv({})).toThrow(/OPENAI_API_KEY/);
  });
});
