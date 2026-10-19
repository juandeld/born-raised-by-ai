import { fill, sha256 } from "./fill";
import type { Language } from "./checkboxes";

/**
 * Legal texts of "Tu familia para colorear" (photos of people, including minors). Version colorear-legal-v2 (D22, 2026-10-19):
 * ONE consent checkbox (K1) plus the terms/privacy acceptance recorded when the adult pays (K2, shown next to the pay button,
 * not a checkbox). The visible notice is vendor-neutral (technical description); sub-processor names live only in the privacy
 * policy (renderColorearAviso with { named: true }). The server recomputes ids, texts and hashes itself; it never trusts the browser.
 * Pending written approval before real charges.
 */
export type ColorearCheckboxId = "K1" | "K2";
export const COLOREAR_CHECKBOX_ORDER: ColorearCheckboxId[] = ["K1", "K2"];
/** Recorded when the adult presses pay; rendered as a sentence beside the button, not as a checkbox. */
export const COLOREAR_IMPLICIT_IDS: ColorearCheckboxId[] = ["K2"];

interface Txt { id: string; text: string }
type ByLang = Record<Language, Txt>;

const K: Record<ColorearCheckboxId, ByLang> = {
  K1: {
    "es-419": { id: "08-K1-es-419-colorear-v2", text: "Soy el adulto responsable de quienes salen en las fotos. Se usan solo para este libro y se borran en 24 h. Lo crea IA, con imperfecciones." },
    "es-ES": { id: "08-K1-es-ES-colorear-v2", text: "Soy el adulto responsable de quienes salen en las fotos. Se usan solo para este libro y se suprimen en 24 h. Lo crea IA, con imperfecciones." },
    en: { id: "08-K1-en-colorear-v2", text: "I am the responsible adult for those in the photos. Used only for this book, deleted in 24 h. AI creates it, with imperfections." },
  },
  K2: {
    "es-419": { id: "08-K2-es-419-colorear-v2", text: "Al pagar, acepto los términos de servicio y la política de privacidad." },
    "es-ES": { id: "08-K2-es-ES-colorear-v2", text: "Al pagar, acepto los términos de servicio y la política de privacidad." },
    en: { id: "08-K2-en-colorear-v2", text: "By paying, I accept the terms of service and the privacy policy." },
  },
};

export interface ResolvedColorearCheckbox {
  checkboxId: ColorearCheckboxId;
  textVersionId: string;
  text: string;
  sha256: string;
}

export function resolveColorearCheckbox(id: ColorearCheckboxId, lang: Language, vars: Record<string, string>): ResolvedColorearCheckbox {
  const src = K[id][lang];
  const text = fill(src.text, vars);
  return { checkboxId: id, textVersionId: src.id, text, sha256: sha256(text) };
}

export function resolveAllColorearCheckboxes(lang: Language, vars: Record<string, string>): ResolvedColorearCheckbox[] {
  return COLOREAR_CHECKBOX_ORDER.map((id) => resolveColorearCheckbox(id, lang, vars));
}

export const RAW_COLOREAR_CHECKBOXES = K;

export const COLOREAR_REFUND_LINE: Record<Language, string> = {
  "es-419": "Pago único, sin suscripción. Reembolso completo y automático hasta 7 días después de la entrega, sin preguntas.",
  "es-ES": "Pago único, sin suscripción. Reembolso íntegro y automático hasta 7 días después de la entrega, sin preguntas.",
  en: "One-time payment, no subscription. Full automatic refund up to 7 days after delivery, no questions asked.",
};

type Section = { heading: string; body: string };

/**
 * Sections of the notice. Visible form (named = false): vendors described by function only. Privacy policy (named = true):
 * the sub-processors are listed by name, which is where the law requires it (GDPR art. 13(1)(e), LFPDPPP).
 */
function sections(lang: Language, named: boolean): Section[] {
  if (lang === "en") {
    return [
      { heading: "Who confirms:", body: "an adult who is the parent or legal guardian of the minors in the photos, or who has permission from their parents or guardians and from the adults shown, to use their photos and names in this book." },
      { heading: "What we collect:", body: "your email, the names and a short description of each person (for example, \"girl, 6\" or \"dog\"), and the photos you upload (1 to 5), which may show minors and other people." },
      { heading: "How we use it:", body: "only to create your coloring book. We do not sell this information, use it for advertising, identify or recognize people, build face databases, or train artificial intelligence models with it." },
      named
        ? { heading: "Who receives it to provide the service:", body: "image-generation provider: OpenAI, which receives the photos and the descriptions without names only to turn them into drawings and acts as our processor (it does not identify people or train models with them; it may keep the data temporarily to prevent abuse under its own terms); text-generation provider: Anthropic, which receives the descriptions without names to write the story; email: Resend; hosting and database: Supabase and Vercel. Your payment is processed by Polar or Recurrente, which do not receive the photos. Names are not sent to the AI providers: they are added here, on our servers." }
        : { heading: "Who receives it to provide the service:", body: "an external image-generation provider that processes the photos and the descriptions without names only to create the drawings, without identifying people or training models; an external text-generation provider that receives the descriptions without names to write the story; email-delivery and hosting providers; and the payment processor, which does not receive the photos. Names are not sent to the AI providers: they are added on our servers. The privacy policy lists every provider by name." },
      { heading: "Artificial intelligence:", body: "the drawings and the story are generated by artificial intelligence, may have imperfections, and are not an exact portrait of the people." },
      { heading: "How long we keep it:", body: "photos are deleted as soon as the characters are ready and always within 24 hours; the characters and intermediate pages are deleted when the book is finished; the book and the order data are deleted after 30 days. You can also ask for earlier deletion at {{EMAIL_PRIVACIDAD}}." },
      { heading: "Your rights:", body: "you can ask to review the information, have it deleted, or tell us to stop using it, at any time and at no cost." },
      { heading: "How we verify you are a responsible adult:", body: "through the charge to your card. We will email you a receipt repeating this notice." },
    ];
  }
  const es = lang === "es-ES";
  const fotos = es ? "fotografías" : "fotos";
  const borran = es ? "suprimen" : "borran";
  return [
    { heading: "Quién confirma:", body: `una persona adulta que es el padre, la madre o el tutor legal de los menores que aparecen en las ${fotos}, o que tiene el permiso de sus padres o tutores y de las personas adultas que aparecen, para usar sus ${fotos} y sus nombres en este libro.` },
    { heading: "Qué recogemos:", body: `su correo, los nombres y una descripción corta de cada persona (por ejemplo, "niña, 6 años" o "perro"), y las ${fotos} que suba (de 1 a 5), que pueden mostrar a menores y a otras personas.` },
    { heading: "Para qué lo usamos:", body: "solo para crear su libro para colorear. No vendemos estos datos, no los usamos para publicidad, no reconocemos ni identificamos personas, no creamos bases de rostros y no entrenamos modelos de inteligencia artificial con ellos." },
    named
      ? { heading: "Quién los recibe para prestar el servicio:", body: `proveedor de generación de imágenes: OpenAI, que recibe las ${fotos} y las descripciones sin nombres solo para convertirlas en dibujos y actúa como nuestro encargado del tratamiento (no identifica personas ni entrena modelos con ellas; puede conservar los datos de forma temporal para prevenir abusos, según sus propias condiciones); proveedor de generación de texto: Anthropic, que recibe las descripciones sin nombres para escribir la historia; correo: Resend; alojamiento y base de datos: Supabase y Vercel. Su pago lo procesa Polar o Recurrente, que no reciben las ${fotos}. Los nombres no se envían a los proveedores de IA: se ponen aquí, en nuestros servidores.` }
      : { heading: "Quién los recibe para prestar el servicio:", body: `un proveedor externo de generación de imágenes que procesa las ${fotos} y las descripciones sin nombres solo para crear los dibujos, sin identificar personas ni entrenar modelos; un proveedor externo de generación de texto que recibe las descripciones sin nombres para escribir la historia; proveedores de envío de correo y de alojamiento; y el procesador de pagos, que no recibe las ${fotos}. Los nombres no se envían a los proveedores de IA: se ponen en nuestros servidores. La política de privacidad nombra a cada proveedor.` },
    { heading: "Inteligencia artificial:", body: "los dibujos y la historia los genera inteligencia artificial, pueden tener imperfecciones y no son un retrato exacto de las personas." },
    { heading: "Cuánto tiempo los guardamos:", body: `las ${fotos} se ${borran} en cuanto los personajes están listos y siempre antes de 24 horas; los personajes y las páginas intermedias se ${borran} al terminar el libro; el libro y los datos del pedido se ${borran} a los 30 días. También puede pedir ${es ? "la supresión" : "el borrado"} antes, en {{EMAIL_PRIVACIDAD}}.` },
    es
      ? { heading: "Sus derechos:", body: "puede pedirnos acceso, rectificación, supresión, limitación u oposición respecto de los datos, en cualquier momento y sin coste. También puede reclamar ante la Agencia Española de Protección de Datos." }
      : { heading: "Sus derechos:", body: "puede pedirnos acceder a los datos, corregirlos, borrarlos u oponerse a su uso (derechos ARCO), en cualquier momento y sin costo." },
    { heading: "Cómo verificamos que usted es una persona adulta responsable:", body: "con el cobro de su tarjeta. Le enviaremos un recibo con estos mismos datos." },
  ];
}

export interface ColorearAviso {
  id: string;
  title: string;
  intro: string;
  sections: Section[];
  privacyLink: string;
}

export const COLOREAR_AVISO: Record<Language, Omit<ColorearAviso, "sections">> = {
  "es-419": {
    id: "08-AVISO-es-419-colorear-v2",
    title: "Aviso para madres, padres y tutores",
    intro: "{{MARCA}} la opera {{TITULAR}} ({{EMAIL_PRIVACIDAD}}). Este libro se crea a partir de fotos de personas, que pueden ser menores, y usted es quien lo compra y lo autoriza.",
    privacyLink: "Política de privacidad completa: {{DOMINIO}}/colorear/es/privacidad",
  },
  "es-ES": {
    id: "08-AVISO-es-ES-colorear-v2",
    title: "Aviso para madres, padres y tutores",
    intro: "{{MARCA}} la opera {{TITULAR}} ({{EMAIL_PRIVACIDAD}}), responsable del tratamiento. Este libro se crea a partir de fotografías de personas, que pueden ser menores, y usted es quien lo compra y lo autoriza.",
    privacyLink: "Política de privacidad completa: {{DOMINIO}}/colorear/es/privacidad",
  },
  en: {
    id: "08-AVISO-en-colorear-v2",
    title: "Notice to parents and guardians",
    intro: "{{MARCA}} is operated by {{TITULAR}} ({{EMAIL_PRIVACIDAD}}). This book is created from photos of people, who may be minors, and you are the person buying and authorizing it.",
    privacyLink: "Full privacy policy: {{DOMINIO}}/colorear/en/privacidad",
  },
};

/** `named: true` is for the privacy policy page only (lists sub-processors by name); the checkout notice and emails stay neutral. */
export function renderColorearAviso(lang: Language, vars: Record<string, string>, opts: { gb?: boolean; named?: boolean } = {}): ColorearAviso {
  const a = COLOREAR_AVISO[lang];
  const secs = sections(lang, !!opts.named).map((s) => ({ heading: s.heading, body: fill(s.body, vars) }));
  if (opts.gb && lang === "en") {
    const i = secs.findIndex((s) => s.heading === "Your rights:");
    if (i >= 0) secs[i] = { ...secs[i]!, body: `${secs[i]!.body} You may also complain to the Information Commissioner's Office.` };
  }
  return { id: a.id, title: a.title, intro: fill(a.intro, vars), sections: secs, privacyLink: fill(a.privacyLink, vars) };
}
