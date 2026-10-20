import { fill, sha256 } from "./fill";
import type { Language } from "./checkboxes";

/**
 * Legal texts of "Tu familia para colorear" (photos of people, including minors). Version colorear-legal-v4 (D22 + D23 + D26, 2026-10-19):
 * ONE consent checkbox (K1) plus the terms/privacy acceptance recorded when the adult pays (K2, shown next to the pay button,
 * not a checkbox). D23: no provider or model is ever named anywhere the customer can see (notice, privacy policy, emails, PDF);
 * recipients are described by category (GDPR art. 13(1)(e)) and the sub-processor list is available on request. The server
 * recomputes ids, texts and hashes itself; it never trusts the browser.
 * v4 (D26): the character drawings (not the photos) are kept 48 h after delivery, or up to 30 days with the Trio, so the buyer can
 * order another adventure without uploading photos again; K1 now says so (<= 140 characters, still one checkbox), the notice adds
 * the retention of characters, the legal bases and the emails, and the Trio refund rule lives in colorearTrioRefund().
 * Pending written approval before real charges.
 */
export const COLOREAR_LEGAL_VERSION = "colorear-legal-v4";

/** Numbers every legal text below depends on; the product code must read them from here (a test keeps texts and numbers in sync). */
export const COLOREAR_LEGAL_RULES = {
  /** Photos are deleted as soon as the characters exist, never later than this. */
  photosMaxHours: 24,
  /** Character drawings kept after delivery for the "another adventure" offer (buyer of one adventure). */
  charactersOfferHours: 48,
  /** Character drawings kept for a Trio buyer: until the last credit is used or this many days after the first delivery. */
  charactersTrioDays: 30,
  trioAdventures: 3,
  /** Trio credits expire this many days after the first delivery; they are not refundable one by one. */
  creditsValidDays: 30,
  /** Book PDFs and order data (D8). */
  bookAndOrderDays: 30,
  /** Reminder email before the book is deleted. */
  reminderDay: 25,
  /** Full refund window, counted from the delivery of the first book of the order. */
  refundDays: 7,
  /** Emails with commercial content per order, without extra consent (opt-out link in each one). */
  maxCommercialEmails: 3,
} as const;

export type ColorearCheckboxId = "K1" | "K2";
export const COLOREAR_CHECKBOX_ORDER: ColorearCheckboxId[] = ["K1", "K2"];
/** Recorded when the adult presses pay; rendered as a sentence beside the button, not as a checkbox. */
export const COLOREAR_IMPLICIT_IDS: ColorearCheckboxId[] = ["K2"];

interface Txt { id: string; text: string }
type ByLang = Record<Language, Txt>;

const K: Record<ColorearCheckboxId, ByLang> = {
  K1: {
    "es-419": { id: "08-K1-es-419-colorear-v4", text: "Soy el adulto responsable de quienes salen. Borramos fotos en 24 h y dibujos en 48 h (30 días en el Trío). Lo crea IA, con imperfecciones." },
    "es-ES": { id: "08-K1-es-ES-colorear-v4", text: "Soy el adulto responsable de quienes salen. Suprimimos fotos en 24 h y dibujos en 48 h (30 días en el Trío). Lo crea IA, con imperfecciones." },
    en: { id: "08-K1-en-colorear-v4", text: "I am the responsible adult for those pictured. We delete photos in 24 h, drawings in 48 h (30 days with Trio). AI creates it, imperfectly." },
  },
  K2: {
    "es-419": { id: "08-K2-es-419-colorear-v4", text: "Al pagar, acepto los términos de servicio y la política de privacidad." },
    "es-ES": { id: "08-K2-es-ES-colorear-v4", text: "Al pagar, acepto los términos de servicio y la política de privacidad." },
    en: { id: "08-K2-en-colorear-v4", text: "By paying, I accept the terms of service and the privacy policy." },
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

/**
 * Shown next to the Trio option, before payment (credits and expiry must be known before the charge; EU consumer rules, FTC).
 * The refund line below goes right under it.
 */
const TRIO_ES = "Trío: 3 aventuras con un solo pago. Pida la primera ahora; las otras 2, desde la página de entrega con un clic y sin subir fotos, hasta 30 días después de recibir la primera. Las aventuras sin usar caducan y no se reembolsan por separado.";
const TRIO_REFUND_ES = "Reembolso a 7 días desde la primera entrega: completo si solo usó la primera aventura; si ya pidió más, se reembolsan las que no haya usado.";
export const COLOREAR_TRIO_LINE: Record<Language, string> = {
  "es-419": TRIO_ES,
  "es-ES": TRIO_ES,
  en: "Trio: 3 adventures for one payment. Order the first one now; order the other 2 later from your delivery page with one click and no new photos, up to 30 days after you receive the first. Unused adventures expire and are not refundable one by one.",
};
export const COLOREAR_TRIO_REFUND_LINE: Record<Language, string> = {
  "es-419": TRIO_REFUND_ES,
  "es-ES": TRIO_REFUND_ES,
  en: "Refund within 7 days of the first delivery: full if you only used the first adventure; if you already ordered more, the ones you did not use are refunded.",
};

/** Line under the email field at checkout (soft opt-in / existing-customer notice; not a checkbox). */
const EMAIL_ES = "Usaremos su correo para su pedido y, en un máximo de tres correos, para ofrecerle aventuras similares. Puede darse de baja en cualquiera.";
export const COLOREAR_EMAIL_LINE: Record<Language, string> = {
  "es-419": EMAIL_ES,
  "es-ES": EMAIL_ES,
  en: "We will use your email for your order and, in at most three emails, to offer you similar adventures. You can unsubscribe from any of them.",
};

/**
 * Strings for the delivery / order page (legal part only). Placeholders: {{FECHA_PERSONAJES}}, {{FECHA_OFERTA}}, {{FECHA_CREDITOS}}, {{FECHA_BORRADO}}.
 * The deadlines shown must be the real ones (no fake urgency): when the date passes, the characters are deleted and the offer ends.
 */
const DELIVERY_ES = {
  charactersOffer: "Guardamos los dibujos de sus personajes (no las fotos) hasta el {{FECHA_PERSONAJES}}, solo para que pueda pedir otra aventura sin subir fotos. Después se borran.",
  charactersTrio: "Guardamos los dibujos de sus personajes (no las fotos) hasta que use su última aventura o, como máximo, hasta el {{FECHA_CREDITOS}}, solo para que pueda pedirlas sin subir fotos. Después se borran.",
  offerTerms: "Oferta válida hasta el {{FECHA_OFERTA}}. Es una compra aparte, con su propio reembolso de 7 días. Pasada esa fecha se borran los personajes y otra aventura requiere fotos nuevas.",
  deleteButton: "Borrar mis personajes",
  deleteDoneOffer: "Listo, borramos los dibujos de sus personajes. Su libro sigue disponible hasta el {{FECHA_BORRADO}}.",
  deleteDoneTrio: "Listo, borramos los dibujos de sus personajes. Conserva sus aventuras sin usar y puede pedirlas subiendo las fotos otra vez hasta el {{FECHA_CREDITOS}}.",
};
export const COLOREAR_DELIVERY_LEGAL: Record<Language, typeof DELIVERY_ES> = {
  "es-419": DELIVERY_ES,
  "es-ES": DELIVERY_ES,
  en: {
    charactersOffer: "We keep the drawings of your characters (not the photos) until {{FECHA_PERSONAJES}}, only so you can order another adventure without uploading photos. After that they are deleted.",
    charactersTrio: "We keep the drawings of your characters (not the photos) until you use your last adventure or, at most, until {{FECHA_CREDITOS}}, only so you can order them without uploading photos. After that they are deleted.",
    offerTerms: "Offer valid until {{FECHA_OFERTA}}. It is a separate purchase, with its own 7-day refund. After that date the characters are deleted and another adventure needs new photos.",
    deleteButton: "Delete my characters",
    deleteDoneOffer: "Done, we deleted the drawings of your characters. Your book stays available until {{FECHA_BORRADO}}.",
    deleteDoneTrio: "Done, we deleted the drawings of your characters. You keep your unused adventures and can order them by uploading the photos again until {{FECHA_CREDITOS}}.",
  },
};

/**
 * Trio refund rule (D26). The 7-day window is counted from the delivery of the FIRST book and is not restarted by ordering more.
 * - Only the first adventure used (or none delivered): full refund (same promise as one adventure).
 * - Two or more used: the unused adventures are refunded, one third of the price paid each (rounded up in the buyer's favor).
 * - After the window: no refund of the Trio or of unused adventures (they stay usable until the credits expire).
 * Defects and our own failures are not governed by the window: see colorearDefectRefund().
 * "Used" = requested and started, delivered or in progress; an adventure we could not deliver does not count.
 */
export interface TrioRefundInput {
  paidMinor: number;
  credits: number;
  used: number;
  daysSinceFirstDelivery: number;
  alreadyRefundedMinor?: number;
}
export interface TrioRefund { refundMinor: number; rule: "full" | "unused" | "none" }

export function colorearTrioRefund(i: TrioRefundInput): TrioRefund {
  const left = Math.max(0, i.paidMinor - (i.alreadyRefundedMinor ?? 0));
  if (left === 0 || i.daysSinceFirstDelivery > COLOREAR_LEGAL_RULES.refundDays) return { refundMinor: 0, rule: "none" };
  if (i.used <= 1) return { refundMinor: left, rule: "full" };
  const unused = Math.max(0, i.credits - i.used);
  if (unused === 0) return { refundMinor: 0, rule: "none" };
  return { refundMinor: Math.min(left, Math.ceil((i.paidMinor * unused) / i.credits)), rule: "unused" };
}

/** A book with a serious defect, or one we could not finish, is remade or refunded at any time while the order is active: one share of the price. */
export function colorearDefectRefund(paidMinor: number, credits: number, alreadyRefundedMinor = 0): number {
  return Math.min(Math.max(0, paidMinor - alreadyRefundedMinor), Math.ceil(paidMinor / Math.max(1, credits)));
}

/**
 * Reminder email before the book is deleted (day 25 after delivery, deletion on day 30). It is a transactional / service message:
 * subject and first block are about the order (deletion date, link, unused Trio adventures); no child's name in the subject.
 * The commercial block is secondary, only for buyers with no unused adventures and who have not unsubscribed, counts toward the
 * limit of three commercial emails per order (COLOREAR_LEGAL_RULES.maxCommercialEmails), never claims "same photos" (they were
 * deleted) and never states a price or a deadline that is not real. The stop line, postal address and sender identity are always
 * included when the block is (CAN-SPAM, PECR reg. 22, LSSI art. 21). Placeholders: FECHA_BORRADO, ENLACE, ENLACE_OFERTA, ENLACE_BAJA,
 * CREDITOS, MARCA, TITULAR, DOMICILIO, EMAIL_SOPORTE.
 */
const REMINDER_ES = {
  subject: "Su libro se borra el {{FECHA_BORRADO}}: descárguelo antes",
  intro: "Su libro para colorear sigue disponible hasta el {{FECHA_BORRADO}}. Ese día se borra automáticamente, junto con los datos de su pedido, para cuidar su privacidad.",
  link: "Descárguelo aquí: {{ENLACE}}",
  creditsOne: "Le queda 1 aventura del Trío. Pídala antes de esa fecha, sin subir fotos, desde el mismo enlace; después caduca y no se reembolsa por separado.",
  creditsMany: "Le quedan {{CREDITOS}} aventuras del Trío. Pídalas antes de esa fecha, sin subir fotos, desde el mismo enlace; después caducan y no se reembolsan por separado.",
  offer: "Si quiere otra aventura, puede crearla con fotos nuevas aquí: {{ENLACE_OFERTA}}. Las fotos y los personajes de este pedido ya se borraron.",
  stop: "Este correo puede incluir ofertas (como máximo tres por pedido). Para no recibir más ofertas: {{ENLACE_BAJA}}.",
  footer: "{{MARCA}} · {{TITULAR}}, {{DOMICILIO}} · {{EMAIL_SOPORTE}}",
};
export const COLOREAR_REMINDER: Record<Language, typeof REMINDER_ES> = {
  "es-419": REMINDER_ES,
  "es-ES": REMINDER_ES,
  en: {
    subject: "Your book is deleted on {{FECHA_BORRADO}}: download it first",
    intro: "Your coloring book stays available until {{FECHA_BORRADO}}. On that day it is deleted automatically, together with your order data, to protect your privacy.",
    link: "Download it here: {{ENLACE}}",
    creditsOne: "You have 1 Trio adventure left. Order it before that date, with no new photos, from the same link; after that it expires and is not refundable by itself.",
    creditsMany: "You have {{CREDITOS}} Trio adventures left. Order them before that date, with no new photos, from the same link; after that they expire and are not refundable one by one.",
    offer: "If you would like another adventure, you can create it with new photos here: {{ENLACE_OFERTA}}. The photos and characters from this order have already been deleted.",
    stop: "This email may include offers (at most three per order). To stop receiving offers: {{ENLACE_BAJA}}.",
    footer: "{{MARCA}} · {{TITULAR}}, {{DOMICILIO}} · {{EMAIL_SOPORTE}}",
  },
};

export function renderColorearReminder(lang: Language, vars: Record<string, string>, opts: { credits: number; commercial: boolean }): { subject: string; text: string } {
  const r = COLOREAR_REMINDER[lang];
  const parts = [r.intro, r.link];
  if (opts.credits === 1) parts.push(r.creditsOne);
  else if (opts.credits > 1) parts.push(r.creditsMany);
  // Offer only when there is nothing left to use: the credits reminder is transactional and carries no sale.
  const commercial = opts.commercial && opts.credits === 0;
  if (commercial) parts.push(r.offer, r.stop);
  parts.push(r.footer);
  const v = { ...vars, CREDITOS: String(opts.credits) };
  return { subject: fill(r.subject, v), text: fill(parts.join("\n\n"), v) };
}

type Section = { heading: string; body: string };

/**
 * Sections of the notice (one neutral text for checkout, receipt and privacy page, D23). Recipients are described by category;
 * the list of sub-processors is given on request at the privacy mailbox.
 */
function sections(lang: Language): Section[] {
  if (lang === "en") {
    return [
      { heading: "Who confirms:", body: "an adult who is the parent or legal guardian of the minors in the photos, or who has permission from their parents or guardians and from the adults shown, to use their photos and names in this book." },
      { heading: "What we collect:", body: "your email, the names and a short description of each person (for example, \"girl, 6\" or \"dog\"), the photos you upload (1 to 5), which may show minors and other people, and the drawings of the characters that we create from them." },
      { heading: "How we use it:", body: "only to create your coloring book and, if you order them, further adventures with the same characters, without uploading photos again. We do not sell this information, use it for advertising, identify or recognize people, build face databases, or train artificial intelligence models with it." },
      { heading: "Who receives it to provide the service:", body: "service providers that act on our behalf as processors and receive only what is needed: image- and text-processing services that turn the photos and the descriptions into the drawings and the story (they do not identify people or train models with them, and may keep data temporarily to prevent abuse under their own terms); email-delivery, hosting and database services; and a payment processor, which does not receive the photos. If you order another adventure, the character drawings (not the photos or the names) are sent again to those image- and text-processing services. Names stay on our servers and are not shared with these providers. Some recipients are located outside your country, including the United States, under appropriate contractual safeguards. The current list of sub-processors is available on request at {{EMAIL_PRIVACIDAD}}." },
      { heading: "Artificial intelligence:", body: "the drawings and the story are created with our own illustration process assisted by artificial intelligence; they may have imperfections and are not an exact portrait of the people." },
      { heading: "How long we keep it:", body: "photos are deleted as soon as the characters are ready and always within 24 hours. The character drawings are kept in private storage, only so that you can order another adventure without uploading photos: 48 hours after your first book is delivered or, if you buy the Trio (3 adventures), until your last adventure is used and at most 30 days after delivery. They are deleted earlier when they are no longer needed, if you ask for a refund, or if you press \"Delete my characters\" on your order page. Intermediate pages are deleted when each book is finished; the books and the order data are deleted 30 days after delivery. You can also ask for earlier deletion at {{EMAIL_PRIVACIDAD}}." },
      { heading: "Why we may process it:", body: "to perform the contract (creating your book and the adventures you bought); with your authorization as the responsible adult, which we verify through the charge to your card; and, for the 48-hour keeping of the characters, our legitimate interest in offering you another adventure with the same characters, which you can object to at any time (the characters are then deleted)." },
      { heading: "Emails:", body: "we email you the receipt, the delivery link and reminders about your order (for example, the deletion date and any unused Trio adventures). Up to three of those emails may also include an offer for similar adventures; each one has a link to stop receiving offers, and we stop at once. We send nothing to minors." },
      { heading: "Your rights:", body: "you can ask to review the information, have it deleted, or tell us to stop using it, at any time and at no cost, including objecting to us keeping the characters." },
      { heading: "How we verify you are a responsible adult:", body: "through the charge to your card. We will email you a receipt repeating this notice." },
    ];
  }
  const es = lang === "es-ES";
  const fotos = es ? "fotografías" : "fotos";
  const borran = es ? "suprimen" : "borran";
  return [
    { heading: "Quién confirma:", body: `una persona adulta que es el padre, la madre o el tutor legal de los menores que aparecen en las ${fotos}, o que tiene el permiso de sus padres o tutores y de las personas adultas que aparecen, para usar sus ${fotos} y sus nombres en este libro.` },
    { heading: "Qué recogemos:", body: `su correo, los nombres y una descripción corta de cada persona (por ejemplo, "niña, 6 años" o "perro"), las ${fotos} que suba (de 1 a 5), que pueden mostrar a menores y a otras personas, y los dibujos de los personajes que creamos a partir de ellas.` },
    { heading: "Para qué lo usamos:", body: "solo para crear su libro para colorear y, si las pide, otras aventuras con los mismos personajes, sin volver a subir fotos. No vendemos estos datos, no los usamos para publicidad, no reconocemos ni identificamos personas, no creamos bases de rostros y no entrenamos modelos de inteligencia artificial con ellos." },
    { heading: "Quién los recibe para prestar el servicio:", body: `proveedores de servicios que actúan por nuestra cuenta como encargados del tratamiento y reciben solo lo necesario: servicios de procesamiento de imágenes y de texto que convierten las ${fotos} y las descripciones en los dibujos y la historia (no identifican personas ni entrenan modelos con ellas, y pueden conservar los datos de forma temporal para prevenir abusos, según sus propias condiciones); servicios de envío de correo, alojamiento y base de datos; y un procesador de pagos, que no recibe las ${fotos}. Si pide otra aventura, los dibujos de los personajes (no las ${fotos} ni los nombres) se envían de nuevo a esos servicios de procesamiento de imágenes y de texto. Los nombres se quedan en nuestros servidores y no se comparten con esos proveedores. Algunos destinatarios están fuera de su país, incluido Estados Unidos, con garantías contractuales adecuadas. La lista actualizada de subencargados está disponible a solicitud en {{EMAIL_PRIVACIDAD}}.` },
    { heading: "Inteligencia artificial:", body: "los dibujos y la historia se crean con nuestro proceso propio de ilustración asistido por inteligencia artificial; pueden tener imperfecciones y no son un retrato exacto de las personas." },
    { heading: "Cuánto tiempo los guardamos:", body: `las ${fotos} se ${borran} en cuanto los personajes están listos y siempre antes de 24 horas. Los dibujos de los personajes se guardan en almacenamiento privado, solo para que pueda pedir otra aventura sin subir ${fotos}: 48 horas después de entregarle su primer libro o, si compra el Trío (3 aventuras), hasta que use la última aventura y como máximo 30 días después de la entrega. Se ${borran} antes cuando ya no hacen falta, si pide un reembolso o si pulsa «Borrar mis personajes» en la página de su pedido. Las páginas intermedias se ${borran} al terminar cada libro; los libros y los datos del pedido se ${borran} a los 30 días de la entrega. También puede pedir ${es ? "la supresión" : "el borrado"} antes, en {{EMAIL_PRIVACIDAD}}.` },
    { heading: "Por qué podemos tratarlos:", body: `para ejecutar el contrato (crear su libro y las aventuras que compró); con su autorización como persona adulta responsable, que verificamos con el cobro de su tarjeta; y, para conservar los personajes durante 48 horas, nuestro interés legítimo en ofrecerle otra aventura con los mismos personajes, al que puede oponerse en cualquier momento (entonces se ${borran} los personajes).` },
    { heading: "Correos:", body: "le enviamos el recibo, el enlace de entrega y recordatorios de su pedido (por ejemplo, la fecha de borrado y las aventuras del Trío que no haya usado). En un máximo de tres de esos correos puede ir también una oferta de aventuras similares; cada uno lleva un enlace para no recibir más ofertas y dejamos de enviarlas de inmediato. No enviamos nada a menores." },
    es
      ? { heading: "Sus derechos:", body: "puede pedirnos acceso, rectificación, supresión, limitación u oposición respecto de los datos, en cualquier momento y sin coste, incluida la oposición a que conservemos los personajes. También puede reclamar ante la Agencia Española de Protección de Datos." }
      : { heading: "Sus derechos:", body: "puede pedirnos acceder a los datos, corregirlos, borrarlos u oponerse a su uso (derechos ARCO), en cualquier momento y sin costo, incluido oponerse a que conservemos los personajes." },
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
    id: "08-AVISO-es-419-colorear-v4",
    title: "Aviso para madres, padres y tutores",
    intro: "{{MARCA}} la opera {{TITULAR}} ({{EMAIL_PRIVACIDAD}}). Este libro se crea a partir de fotos de personas, que pueden ser menores, y usted es quien lo compra y lo autoriza.",
    privacyLink: "Política de privacidad completa: {{DOMINIO}}/colorear/es/privacidad",
  },
  "es-ES": {
    id: "08-AVISO-es-ES-colorear-v4",
    title: "Aviso para madres, padres y tutores",
    intro: "{{MARCA}} la opera {{TITULAR}} ({{EMAIL_PRIVACIDAD}}), responsable del tratamiento. Este libro se crea a partir de fotografías de personas, que pueden ser menores, y usted es quien lo compra y lo autoriza.",
    privacyLink: "Política de privacidad completa: {{DOMINIO}}/colorear/es/privacidad",
  },
  en: {
    id: "08-AVISO-en-colorear-v4",
    title: "Notice to parents and guardians",
    intro: "{{MARCA}} is operated by {{TITULAR}} ({{EMAIL_PRIVACIDAD}}). This book is created from photos of people, who may be minors, and you are the person buying and authorizing it.",
    privacyLink: "Full privacy policy: {{DOMINIO}}/colorear/en/privacidad",
  },
};

/** One neutral text for the checkout notice, the receipt and the privacy page (D23). */
export function renderColorearAviso(lang: Language, vars: Record<string, string>, opts: { gb?: boolean } = {}): ColorearAviso {
  const a = COLOREAR_AVISO[lang];
  const secs = sections(lang).map((s) => ({ heading: s.heading, body: fill(s.body, vars) }));
  if (opts.gb && lang === "en") {
    const i = secs.findIndex((s) => s.heading === "Your rights:");
    if (i >= 0) secs[i] = { ...secs[i]!, body: `${secs[i]!.body} You may also complain to the Information Commissioner's Office.` };
  }
  return { id: a.id, title: a.title, intro: fill(a.intro, vars), sections: secs, privacyLink: fill(a.privacyLink, vars) };
}
