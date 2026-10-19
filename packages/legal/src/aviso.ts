import { fill } from "./fill";
import type { Language } from "./checkboxes";

/**
 * Direct COPPA notice (docs/legal/textos/01, section A). Shown in full, above the checkboxes,
 * visible without clicking anything. Exact text, version legal-v1.
 */
export interface AvisoSection {
  heading: string;
  body: string;
}
export interface Aviso {
  id: string;
  title: string;
  intro: string;
  sections: AvisoSection[];
  privacyLink: string;
}

const PROVIDERS_419 = "ElevenLabs (voz de inteligencia artificial), Twilio (llamada telefónica), Anthropic (conversación y guion), Resend (envío de correos de confirmación) y nuestros proveedores de alojamiento y procesamiento (Supabase, Vercel, Inngest). Si su producto incluye imágenes o música personalizadas, también Google. Su pago lo procesa Polar o Recurrente, que no reciben los datos del niño.";

export const AVISO: Record<Language, Aviso> = {
  "es-419": {
    id: "01-AVISO-es-419-legal-v1",
    title: "Aviso para madres, padres y tutores",
    intro: "{{MARCA}} la opera {{TITULAR}} ({{EMAIL_PRIVACIDAD}}). Esta llamada es para un niño o una niña, y usted es quien la compra y la autoriza.",
    sections: [
      { heading: "Qué recogemos del niño o la niña:", body: "su primer nombre, los datos opcionales que usted escriba aquí (por ejemplo, edad, una afición o un logro) y su voz durante la llamada, que se graba." },
      { heading: "Para qué lo usamos:", body: "solo para crear y realizar esta llamada y entregarle la grabación a usted. No vendemos estos datos, no los usamos para publicidad, no entrenamos modelos de inteligencia artificial con ellos y no creamos huellas de voz." },
      { heading: "Quién los recibe para prestar el servicio:", body: PROVIDERS_419 },
      { heading: "Cuánto tiempo los guardamos:", body: "la grabación y los datos del niño se borran automáticamente a los 30 días. Descargue la grabación antes si quiere conservarla. También puede pedir el borrado antes, en {{EMAIL_PRIVACIDAD}} o desde el enlace de su recibo." },
      { heading: "Sus derechos como madre, padre o tutor:", body: "puede pedirnos ver los datos de su hijo o hija, borrarlos o pedirnos que no los usemos más, en cualquier momento y sin costo." },
      { heading: "Cómo verificamos que usted es un adulto responsable:", body: "con el cobro de su tarjeta. Le enviaremos un recibo con estos mismos datos." },
    ],
    privacyLink: "Política de privacidad completa: {{DOMINIO}}/privacidad",
  },
  "es-ES": {
    id: "01-AVISO-es-ES-legal-v1",
    title: "Aviso para madres, padres y tutores",
    intro: "{{MARCA}} la opera {{TITULAR}} ({{EMAIL_PRIVACIDAD}}), responsable del tratamiento. Esta llamada es para un niño o una niña, y usted es quien la compra y la autoriza.",
    sections: [
      { heading: "Qué datos recogemos del menor:", body: "su nombre de pila, los datos opcionales que usted escriba (por ejemplo, edad, una afición o un logro) y su voz durante la llamada, que se graba." },
      { heading: "Para qué los usamos:", body: "solo para crear y realizar esta llamada y entregarle la grabación a usted. No vendemos estos datos, no los usamos para publicidad, no entrenamos modelos de inteligencia artificial con ellos y no creamos huellas de voz." },
      { heading: "Quién los recibe para prestar el servicio:", body: `${PROVIDERS_419.replace("los datos del niño", "los datos del menor")} Algunos de estos proveedores están fuera del Espacio Económico Europeo; ver la política de privacidad.` },
      { heading: "Cuánto tiempo los conservamos:", body: "la grabación y los datos del menor se borran automáticamente a los 30 días. Descargue la grabación antes si quiere conservarla. También puede pedir el borrado antes, en {{EMAIL_PRIVACIDAD}} o desde el enlace de su recibo." },
      { heading: "Sus derechos:", body: "puede pedirnos acceso, rectificación, supresión, limitación u oposición respecto de los datos de su hijo o hija, en cualquier momento y sin coste. También puede reclamar ante la Agencia Española de Protección de Datos." },
      { heading: "Cómo verificamos que usted es una persona adulta responsable:", body: "con el cobro de su tarjeta. Le enviaremos un recibo con estos mismos datos." },
    ],
    privacyLink: "Política de privacidad completa: {{DOMINIO}}/privacidad",
  },
  en: {
    id: "01-AVISO-en-US-legal-v1",
    title: "Notice to parents and guardians",
    intro: "{{MARCA}} is operated by {{TITULAR}} ({{EMAIL_PRIVACIDAD}}). This call is for a child, and you are the person buying and authorizing it.",
    sections: [
      { heading: "What we collect from the child:", body: "their first name, any optional details you type here (for example, age, a hobby or an achievement), and their voice during the call, which is recorded." },
      { heading: "How we use it:", body: "only to create and place this call and to give you the recording. We do not sell this information, use it for advertising, train artificial intelligence models with it, or create voiceprints." },
      { heading: "Who receives it to provide the service:", body: "ElevenLabs (AI voice), Twilio (phone call), Anthropic (conversation and script), Resend (confirmation emails), and our hosting and processing providers (Supabase, Vercel, Inngest). If your product includes custom images or music, Google as well. Your payment is processed by Polar or Recurrente, which do not receive the child's information." },
      { heading: "How long we keep it:", body: "the recording and the child's information are automatically deleted after 30 days. Download the recording first if you want to keep it. You can also ask for earlier deletion at {{EMAIL_PRIVACIDAD}} or from the link in your receipt." },
      { heading: "Your rights as a parent or guardian:", body: "you can ask to review your child's information, have it deleted, or tell us to stop using it, at any time and at no cost." },
      { heading: "How we verify you are a responsible adult:", body: "through the charge to your card. We will email you a receipt repeating this notice." },
    ],
    privacyLink: "Full privacy policy: {{DOMINIO}}/privacidad",
  },
};

/** en-GB adds one sentence to "Your rights" (01, variante en-GB). */
/** The complaint route is `[no verificado]` in the legal file: tracked in docs/arquitectura/pendientes-cuentas.md, not shown to customers. */
export const EN_GB_RIGHTS_SUFFIX = " You may also complain to the Information Commissioner's Office.";

export function renderAviso(language: Language, vars: Record<string, string>, opts: { gb?: boolean } = {}): Aviso {
  const src = AVISO[language];
  const sections = src.sections.map((s) => ({
    heading: s.heading,
    body: fill(opts.gb && language === "en" && s.heading.startsWith("Your rights") ? s.body + EN_GB_RIGHTS_SUFFIX : s.body, vars),
  }));
  return { ...src, intro: fill(src.intro, vars), sections, privacyLink: fill(src.privacyLink, vars) };
}
