import { COLOREAR, colorearCountries, colorearPublicUrl, isColorearLang, isSelectableVariant, type CountryCode } from "@lumen/config";
import { ColorearValidationError, TEST_CODE_PROVIDER, type PersonSubmission } from "@lumen/generate";
import { getColorear, handleColorearPayment } from "@/lib/colorear";
import { legalReady } from "@/lib/legal-vars";
import { clientIp, deviceOf, json, rateLimited } from "@/lib/request";


function isValidationShape(err: unknown): boolean {
  if (!err || typeof err !== "object" || !("errors" in err)) return false;
  const e = (err as { errors: unknown }).errors;
  return !!e && typeof e === "object" && Object.values(e).every((v) => typeof v === "string");
}

/**
 * multipart/form-data: photo1..photoN (the required photo of each person; JPEG already compressed by the browser, <= 900 KB each, and the
 * browser shrinks them so that every allowed photo fits Vercel's 4.5 MB body) and photo<i>_2, photo<i>_3.. (optional extra photos of person i;
 * the limit per person is COLOREAR_MAX_PHOTOS_MAIN for person 1 and COLOREAR_MAX_PHOTOS_OTHER for the rest, enforced by the engine),
 * name1..nameN, roleId1..roleIdN (+ roleText<i> for "other"; legacy role1..roleN accepted), and lang, country, email, age, theme, themeId, creative, checkboxIds (JSON),
 * and an optional `code` (test code, COLOREAR_TEST_CODES). The server re-validates everything.
 *
 * Invitation-only (live deployment, mock provider, COLOREAR_ALLOW_MOCK_PAY unset): a request without a code is refused right after the text fields
 * are read, before any photo is read, re-encoded or stored (403, `errors.code = "required"`).
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
  const engine = getColorear();
  // Test codes: a brake on guessing (per IP, only when a code is sent). The code itself is never logged or tracked.
  const testCode = String(form.get("code") ?? "").slice(0, 80);
  // Closed to the public: no code, no work. Nothing of the photos has been touched yet.
  if (engine.inviteOnly() && !testCode.trim()) return json({ ok: false, errors: { code: "required" } }, 403);
  if (testCode.trim() && rateLimited(`colorear-code:${ip ?? "?"}`, 10, 10 * 60_000)) return json({ ok: false, errors: { code: "rate" } }, 429);
  const photos: Uint8Array[] = [];
  const extraPhotos: Uint8Array[][] = [];
  const persons: PersonSubmission[] = [];
  for (let i = 1; i <= COLOREAR.maxPhotos; i++) {
    const f = form.get(`photo${i}`);
    if (!(f instanceof File) || f.size === 0) continue;
    photos.push(new Uint8Array(await f.arrayBuffer()));
    // Extra photos of the same person: read up to the hard ceiling only; the engine rejects any count above the configured limit.
    const more: Uint8Array[] = [];
    for (let j = 2; j <= COLOREAR.photosPerPersonCeiling; j++) {
      const x = form.get(`photo${i}_${j}`);
      if (x instanceof File && x.size > 0) more.push(new Uint8Array(await x.arrayBuffer()));
    }
    extraPhotos.push(more);
    const roleId = String(form.get(`roleId${i}`) ?? "").slice(0, 40);
    // Closed roles (current form) or, for an old cached page, free text in role<i>.
    persons.push(roleId
      ? { name: String(form.get(`name${i}`) ?? ""), roleId, roleText: String(form.get(`roleText${i}`) ?? "").slice(0, 100) }
      : { name: String(form.get(`name${i}`) ?? ""), role: String(form.get(`role${i}`) ?? "") });
  }
  let checkboxIds: string[] = [];
  try {
    const parsed = JSON.parse(String(form.get("checkboxIds") ?? "[]"));
    if (Array.isArray(parsed)) checkboxIds = parsed.map(String);
  } catch {
    /* empty */
  }
  const base = colorearPublicUrl();
  try {
    const { order, checkoutUrl } = await engine.createCheckout(
      {
        lang: langRaw,
        country,
        email: String(form.get("email") ?? ""),
        persons,
        photos,
        extraPhotos,
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
    // Also recognized by shape: in `next dev` a module can be loaded twice and `instanceof` fails (a wrong code would answer 500).
    if (err instanceof ColorearValidationError || isValidationShape(err)) return json({ ok: false, errors: (err as ColorearValidationError).errors }, 422);
    console.error("[colorear] checkout failed", err instanceof Error ? err.message : err);
    return json({ ok: false, errors: { generic: "server" } }, 500);
  }
}
