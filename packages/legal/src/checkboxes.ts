import { fill, sha256 } from "./fill";

/**
 * Consent checkboxes. Exact texts from docs/legal/textos (01 and 02), version legal-v1 (C3 in legal-v1.2, D13).
 * The server recomputes text, id and hash itself; it never trusts the browser.
 * A test (legal.test.ts) fails if any text drifts from the markdown files.
 */
export type CheckboxId = "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
export type TextLocale = "es-419" | "es-ES" | "en-US" | "en-GB";

export interface CheckboxText {
  /** e.g. 02-C4-es-419-legal-v1 */
  id: string;
  text: string;
}

type ByLang = { "es-419": CheckboxText; "es-ES": CheckboxText; en: CheckboxText };

const C: Record<Exclude<CheckboxId, "C6">, ByLang> = {
  C1: {
    "es-419": { id: "01-C1-es-419-legal-v1", text: "Soy el padre, la madre o el tutor legal del niño o la niña que recibirá este producto, soy mayor de edad y autorizo que se use su primer nombre y los datos que escriba aquí." },
    "es-ES": { id: "01-C1-es-ES-legal-v1", text: "Soy el padre, la madre o el tutor legal del niño o la niña que recibirá este producto, soy mayor de edad y autorizo el tratamiento de su nombre de pila y de los datos que escriba aquí." },
    en: { id: "01-C1-en-US-legal-v1", text: "I am the parent or legal guardian of the child who will receive this product, I am an adult, and I authorize the use of their first name and the details I enter here." },
  },
  C2: {
    "es-419": { id: "01-C2-es-419-legal-v1", text: "Entiendo que esos datos y la voz de mi hijo o hija se usarán solo para esta experiencia, que no se venden ni se usan para entrenar inteligencia artificial, y que se borran en 30 días o antes si lo pido." },
    "es-ES": { id: "01-C2-es-ES-legal-v1", text: "Entiendo que esos datos y la voz de mi hijo o hija se usarán solo para esta experiencia, que no se venden ni se usan para entrenar inteligencia artificial, y que se suprimen a los 30 días o antes si lo solicito." },
    en: { id: "01-C2-en-US-legal-v1", text: "I understand that this information and my child's voice will be used only for this experience, are not sold or used to train artificial intelligence, and are deleted after 30 days, or sooner if I ask." },
  },
  C3: {
    "es-419": { id: "02-C3-es-419-legal-v1.2", text: "Entiendo que la voz que hablará en la llamada es una inteligencia artificial de Lumen Labs, no una persona, y que la llamada se grabará para entregármela y para atender reclamos. Entiendo también que el personaje hablará con mi hijo o hija como el personaje que pedí (por ejemplo, Santa), sin decirle que es una inteligencia artificial, y que yo decido si se lo cuento." },
    "es-ES": { id: "02-C3-es-ES-legal-v1.2", text: "Entiendo que la voz que hablará en la llamada es una inteligencia artificial de Lumen Labs, no una persona, y que la llamada se grabará para entregármela y para atender reclamaciones. Entiendo también que el personaje hablará con mi hijo o hija como el personaje que he pedido (por ejemplo, Papá Noel), sin decirle que es una inteligencia artificial, y que yo decido si se lo cuento." },
    en: { id: "02-C3-en-US-legal-v1.2", text: "I understand that the voice on the call is artificial intelligence from Lumen Labs, not a person, and that the call will be recorded to deliver it to me and to handle complaints. I also understand that the character will speak with my child as the character I ordered (for example, Santa) without telling my child that it is artificial intelligence, and that it is my decision whether to tell them." },
  },
  C4: {
    "es-419": { id: "02-C4-es-419-legal-v1", text: "Autorizo expresamente que {{MARCA}} llame al número que indiqué, en la fecha y hora que elegí, con una voz generada por inteligencia artificial. Entiendo que esta autorización no es condición para comprar nada más, que no recibiré llamadas de venta, y que puedo cancelarla en cualquier momento escribiendo a {{EMAIL_SOPORTE}}." },
    "es-ES": { id: "02-C4-es-ES-legal-v1", text: "Autorizo expresamente que {{MARCA}} llame al número de teléfono que he indicado, en la fecha y hora que he elegido, con una voz generada por inteligencia artificial. Entiendo que esta autorización no es condición para comprar ninguna otra cosa, que no recibiré llamadas comerciales, y que puedo revocarla en cualquier momento escribiendo a {{EMAIL_SOPORTE}}." },
    en: { id: "02-C4-en-US-legal-v1", text: "I expressly authorize {{MARCA}} to call the phone number I provided, on the date and at the time I chose, using an artificially generated voice. I understand this authorization is not a condition of buying anything else, that I will not receive sales calls, and that I can cancel it at any time by writing to {{EMAIL_SOPORTE}}." },
  },
  C5: {
    "es-419": { id: "02-C5-es-419-legal-v1", text: "El número que indiqué es mío, o es de una persona que sabe de esta llamada y está de acuerdo en recibirla. Me comprometo a avisarle que la voz es de inteligencia artificial y que la llamada se grabará." },
    "es-ES": { id: "02-C5-es-ES-legal-v1", text: "El número que he indicado es mío, o es de una persona que conoce esta llamada y está de acuerdo en recibirla. Me comprometo a avisarle de que la voz es de inteligencia artificial y de que la llamada se grabará." },
    en: { id: "02-C5-en-US-legal-v1", text: "The number I provided is mine, or belongs to a person who knows about this call and agrees to receive it. I commit to telling them that the voice is artificial intelligence and that the call will be recorded." },
  },
};

/**
 * C6 (terms + privacy) has no verbatim text in docs/legal/textos: the files only say it exists
 * (00-leeme.md section 4, 05). This is a DRAFT by arquitecto, pending written approval of legal-compliance.
 * The id carries "-draft" so the consent record shows it is not an approved text.
 */
const C6: ByLang = {
  "es-419": { id: "05-C6-es-419-draft", text: "Acepto los términos de servicio y la política de privacidad." },
  "es-ES": { id: "05-C6-es-ES-draft", text: "Acepto los términos de servicio y la política de privacidad." },
  en: { id: "05-C6-en-US-draft", text: "I accept the terms of service and the privacy policy." },
};

/** Fixed order, all unchecked by default (00-leeme.md section 4). */
export const CHECKBOX_ORDER: CheckboxId[] = ["C1", "C2", "C3", "C4", "C5", "C6"];

/** Info line under the checkboxes (02, "Línea fija bajo las casillas"). */
export const REMINDER_LINE: Record<keyof ByLang, string> = {
  "es-419": "Antes de la llamada le enviaremos un recordatorio con la hora. Quien conteste escuchará un aviso de que la voz es de IA y de que se graba, y podrá cancelar con la tecla 2. Con su hijo, el personaje no mencionará que es IA: ustedes deciden si se lo cuentan.",
  "es-ES": "Antes de la llamada le enviaremos un recordatorio con la hora. Quien conteste oirá un aviso de que la voz es de IA y de que se graba, y podrá cancelar con la tecla 2. Con su hijo, el personaje no mencionará que es IA: ustedes deciden si se lo cuentan.",
  en: "Before the call we will email you a reminder with the time. Whoever answers will hear a notice that the voice is AI and that the call is recorded, and can cancel by pressing 2. With your child, the character will not mention that it is AI: you decide whether to tell them.",
};

/** Short refund text under the price (05, section C). */
export const REFUND_LINE: Record<keyof ByLang, string> = {
  "es-419": "Pago único, sin suscripción. Reembolso completo y automático hasta 7 días después de la entrega, sin preguntas.",
  "es-ES": "Pago único, sin suscripción. Reembolso íntegro y automático hasta 7 días después de la entrega, sin preguntas.",
  en: "One-time payment, no subscription. Full automatic refund up to 7 days after delivery, no questions asked.",
};

export type Language = keyof ByLang;

export function languageOf(locale: TextLocale | Language): Language {
  return locale === "es-419" || locale === "es-ES" ? locale : "en";
}

export interface ResolvedCheckbox {
  checkboxId: CheckboxId;
  textVersionId: string;
  text: string;
  sha256: string;
}

export function resolveCheckbox(id: CheckboxId, locale: TextLocale | Language, vars: Record<string, string>): ResolvedCheckbox {
  const lang = languageOf(locale);
  const src = id === "C6" ? C6[lang] : C[id][lang];
  const text = fill(src.text, vars);
  return { checkboxId: id, textVersionId: src.id, text, sha256: sha256(text) };
}

export function resolveAllCheckboxes(locale: TextLocale | Language, vars: Record<string, string>): ResolvedCheckbox[] {
  return CHECKBOX_ORDER.map((id) => resolveCheckbox(id, locale, vars));
}

/** Raw (unfilled) texts, for drift tests against docs/legal/textos. */
export const RAW_CHECKBOXES = { ...C, C6 } as Record<CheckboxId, ByLang>;
