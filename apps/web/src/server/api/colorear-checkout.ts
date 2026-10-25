import { COLOREAR, colorearCountries, colorearPublicUrl, isColorearLang, isSelectableVariant, type CountryCode } from "@lumen/config";
import { ColorearValidationError, TEST_CODE_PROVIDER, type PersonSubmission } from "@lumen/generate";
import { getColorear, handleColorearPayment } from "@/lib/colorear";
import { legalReady } from "@/lib/legal-vars";
import { clientIp, deviceOf, json, rateLimited } from "@/lib/request";


/**
 * multipart/form-data: photo1..photoN (JPEG already compressed by the browser, <= 900 KB each; Vercel limits the body to 4.5 MB),
 * name1..nameN, roleId1..roleIdN (+ roleText<i> for "other"; legacy role1..roleN accepted), and lang, country, email, age, theme, themeId, creative, checkboxIds (JSON),
 * and an optional `code` (test code, COLOREAR_TEST_CODES). The server re-validates everything.
 *
 * With a valid test code there is no payment: the order is created as `test_code` (amount 0, test mode) and marked paid right here with an
 * internal `payment_succeeded` event, through the same function the payment webhooks use (consents, receipt, `paid` event, start of the run).
 * The answer is the confirmation page, so the browser goes straight to the progress screen.
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
  const persons: PersonSubmission[] = [];
  for (let i = 1; i <= COLOREAR.maxPhotos; i++) {
    const f = form.get(`photo${i}`);
    if (!(f instanceof File) || f.size === 0) continue;
    photos.push(new Uint8Array(await f.arrayBuffer()));
    const roleId = String(form.get(`roleId${i}`) ?? "").slice(0, 40);
    // Closed roles (current form) or, for an old cached page, free text in role<i>.
    persons.push(roleId
      ? { name: String(form.get(`name${i}`) ?? ""), roleId, roleText: String(form.get(`roleText${i}`) ?? "").slice(0, 100) }
      : { name: String(form.get(`name${i}`) ?? ""), role: String(form.get(`role${i}`) ?? "") });
  }
  // Test codes: a brake on guessing (per IP, only when a code is sent). The code itself is never logged or tracked.
  const testCode = String(form.get("code") ?? "").slice(0, 80);
  if (testCode.trim() && rateLimited(`colorear-code:${ip ?? "?"}`, 10, 10 * 60_000)) return json({ ok: false, errors: { code: "rate" } }, 429);
  let checkboxIds: string[] = [];
  try {
    const parsed = JSON.parse(String(form.get("checkboxIds") ?? "[]"));
    if (Array.isArray(parsed)) checkboxIds = parsed.map(String);
  } catch {
    /* empty */
  }
  const engine = getColorear();
  const base = colorearPublicUrl();
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
        variant: isSelectableVariant(String(form.get("variant") ?? "")) ? (String(form.get("variant")) as "single" | "bundle3") : "single",
        testCode,
        creative: String(form.get("creative") ?? "none").slice(0, 40).replace(/[^\w.-]/g, "") || "none",
        device: deviceOf(req.headers.get("user-agent")),
      },
      { successUrl: (o) => `${base}/colorear/confirmacion/${o.access_token}`, cancelUrl: `${base}${langRaw === "en" ? "/en" : "/"}` },
    );
    if (order.payment_provider === TEST_CODE_PROVIDER) {
      await handleColorearPayment({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: order.checkout_id ?? `testcode:${order.id}` });
      return json({ ok: true, url: checkoutUrl, testCode: true });
    }
    return json({ ok: true, url: checkoutUrl });
  } catch (err) {
    if (err instanceof ColorearValidationError) return json({ ok: false, errors: err.errors }, 422);
    console.error("[colorear] checkout failed", err instanceof Error ? err.message : err);
    return json({ ok: false, errors: { generic: "server" } }, 500);
  }
}
