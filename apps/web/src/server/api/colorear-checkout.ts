import { COLOREAR, colorearCountries, isColorearLang, type CountryCode } from "@lumen/config";
import { ColorearValidationError } from "@lumen/generate";
import { getColorear } from "@/lib/colorear";
import { baseUrl } from "@/lib/engine";
import { legalReady } from "@/lib/legal-vars";
import { clientIp, deviceOf, json, rateLimited } from "@/lib/request";


/**
 * multipart/form-data: photo1..photoN (JPEG already compressed by the browser, <= 900 KB each; Vercel limits the body to 4.5 MB),
 * name1..nameN, role1..roleN, and lang, country, email, age, theme, themeId, creative, checkboxIds (JSON). The server re-validates everything.
 */
export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!legalReady()) return json({ ok: false, errors: { generic: "legal_not_ready" } }, 503);
  if (rateLimited(`colorear-checkout:${ip ?? "?"}`, 8)) return json({ ok: false, errors: { rate: "rate" } }, 429);
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, errors: { generic: "bad_form" } }, 400);
  }
  const langRaw = String(form.get("lang") ?? "");
  if (!isColorearLang(langRaw)) return json({ ok: false, errors: { generic: "bad_lang" } }, 400);
  const open = colorearCountries();
  const countryRaw = String(form.get("country") ?? "").toUpperCase() as CountryCode;
  const country = open.includes(countryRaw) ? countryRaw : open[0]!;
  const photos: Uint8Array[] = [];
  const persons: Array<{ name: string; role: string }> = [];
  for (let i = 1; i <= COLOREAR.maxPhotos; i++) {
    const f = form.get(`photo${i}`);
    if (!(f instanceof File) || f.size === 0) continue;
    photos.push(new Uint8Array(await f.arrayBuffer()));
    persons.push({ name: String(form.get(`name${i}`) ?? ""), role: String(form.get(`role${i}`) ?? "") });
  }
  let checkboxIds: string[] = [];
  try {
    const parsed = JSON.parse(String(form.get("checkboxIds") ?? "[]"));
    if (Array.isArray(parsed)) checkboxIds = parsed.map(String);
  } catch {
    /* empty */
  }
  const engine = getColorear();
  const base = baseUrl();
  try {
    const { order, checkoutUrl } = await engine.createCheckout(
      {
        lang: langRaw,
        country,
        email: String(form.get("email") ?? ""),
        persons,
        photos,
        theme: String(form.get("theme") ?? ""),
        themeId: String(form.get("themeId") ?? "") || undefined,
        age: String(form.get("age") ?? ""),
        checkboxIds,
        ip,
        creative: String(form.get("creative") ?? "none").slice(0, 40).replace(/[^\w.-]/g, "") || "none",
        device: deviceOf(req.headers.get("user-agent")),
      },
      { successUrl: (o) => `${base}/colorear/confirmacion/${o.access_token}`, cancelUrl: `${base}/colorear/${langRaw}` },
    );
    void order;
    return json({ ok: true, url: checkoutUrl });
  } catch (err) {
    if (err instanceof ColorearValidationError) return json({ ok: false, errors: err.errors }, 422);
    console.error("[colorear] checkout failed", err instanceof Error ? err.message : err);
    return json({ ok: false, errors: { generic: "server" } }, 500);
  }
}
