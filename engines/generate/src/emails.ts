import type { ColorearLang } from "@lumen/config";
import type { OutboundMessage } from "@lumen/calls";
import { COLOREAR_REMINDER, renderColorearReminder } from "@lumen/legal";

export interface MailVars {
  names: string;
  price: string;
  statusLink: string;
  deliveryLink?: string;
  refundLink: string;
  deleteDate: string;
  holder: string;
  privacyEmail: string;
  supportEmail: string;
  brand: string;
  notes?: string[];
  /** main = the purchase itself (1 adventure or Trio); add = "otra aventura" purchase; credit = free Trio adventure. */
  kind?: "main" | "add" | "credit";
  /** Trio: adventures still to create, and the day they expire. */
  creditsLeft?: number;
  creditsUntil?: string;
  /** "Otra aventura con las mismas fotos": price, deadline (UTC, human readable) and the link that opens the offer. */
  offerPrice?: string;
  offerUntil?: string;
  offerLink?: string;
  /** Free Trio adventure: the page that lists all the adventures. */
  parentLink?: string;
  /** Day-25 reminder: days left until the deletion. */
  daysLeft?: number;
  /** Legal variant of the text (es-ES differs from es-419 in the reminder). */
  legalLang?: "es-419" | "es-ES" | "en";
  /** Postal address of the sender and the one-click link to stop offers (required in every email with commercial content). */
  address?: string;
  stopLink?: string;
  /** Link to start a new book with new photos (reminder offer). */
  landingLink?: string;
  /** The reminder may carry the secondary commercial block (not unsubscribed, fewer than 3 commercial emails). */
  commercialOk?: boolean;
  /** Order made with a test code: no charge happened, so the emails say "Test order, no charge" instead of showing a price or a refund. */
  testOrder?: boolean;
}

type Kind = "receipt" | "receipt_add" | "delivery" | "refund" | "reminder";
type Tpl = (v: MailVars) => { subject: string; text: string };

/** Block appended to the delivery and reminder emails: unused Trio adventures, or the 48-hour offer. Plain text, no provider names (D23). */
function extras(v: MailVars, lang: ColorearLang, withOffer: boolean): string {
  const out: string[] = [];
  if (v.creditsLeft && v.creditsLeft > 0) {
    out.push(lang === "es"
      ? `Le quedan ${v.creditsLeft} ${v.creditsLeft === 1 ? "aventura" : "aventuras"} del Trío. Elija la siguiente con un clic, sin subir fotos otra vez: ${v.deliveryLink}\nLas aventuras sin crear caducan el ${v.creditsUntil}.`
      : `You have ${v.creditsLeft} ${v.creditsLeft === 1 ? "adventure" : "adventures"} left from your Trio. Pick the next one with one click, no need to upload photos again: ${v.deliveryLink}\nAdventures not created by ${v.creditsUntil} expire.`);
  } else if (withOffer && v.offerPrice && v.offerLink) {
    out.push(lang === "es"
      ? `Otra aventura con los mismos personajes por ${v.offerPrice}, sin subir fotos otra vez. La oferta dura 48 horas (hasta el ${v.offerUntil}): ${v.offerLink}`
      : `Another adventure with the same characters for ${v.offerPrice}, no need to upload photos again. The offer lasts 48 hours (until ${v.offerUntil}): ${v.offerLink}`);
  }
  // The offer is commercial content: stop line, sender identity and postal address are always included with it (D26 (7)).
  if (withOffer && v.offerPrice && v.offerLink && v.stopLink) {
    const stop = COLOREAR_REMINDER[lang === "en" ? "en" : "es-419"].stop.replace("{{ENLACE_BAJA}}", v.stopLink);
    out.push(`${stop}\n${v.brand} · ${v.holder}, ${v.address ?? ""}`);
  }
  return out.length ? `\n${out.join("\n")}\n` : "";
}

const T: Record<Exclude<Kind, "reminder">, Record<ColorearLang, Tpl>> = {
  // Receipt of an "otra aventura" purchase: no new photos were received. TODO(legal-compliance): confirm the wording of the line about the kept drawings.
  receipt_add: {
    es: (v) => ({
      subject: `Recibo de su compra en ${v.brand}`,
      text: `Gracias por su compra. Este correo confirma el cobro de ${v.price} por otra aventura.\n\nNo pedimos fotos nuevas: usamos los dibujos de los personajes de su primer libro (${v.names}). Esos dibujos se conservan solo hasta terminar esta aventura. El libro y los datos del pedido se borran el ${v.deleteDate}. Los dibujos y la historia se crean con nuestro proceso propio de ilustración asistido por inteligencia artificial; pueden tener imperfecciones.\n\nSiga el avance de su libro aquí: ${v.statusLink}\nPara pedir reembolso (hasta 7 días después de la entrega): ${v.refundLink}\nSi usted no hizo esta compra, responda a este correo y la cancelamos y reembolsamos de inmediato.\n\n${v.holder} · ${v.privacyEmail}`,
    }),
    en: (v) => ({
      subject: `Your receipt at ${v.brand}`,
      text: `Thank you for your purchase. This email confirms the charge of ${v.price} for another adventure.\n\nWe did not ask for new photos: we use the character drawings from your first book (${v.names}). Those drawings are kept only until this adventure is finished. The book and the order data are deleted on ${v.deleteDate}. The drawings and the story are created with our own illustration process assisted by artificial intelligence; they may have imperfections.\n\nFollow your book's progress here: ${v.statusLink}\nTo request a refund (up to 7 days after delivery): ${v.refundLink}\nIf you did not make this purchase, reply to this email and we will cancel and refund it immediately.\n\n${v.holder} · ${v.privacyEmail}`,
    }),
  },
  receipt: {
    es: (v) => ({
      subject: v.testOrder ? `Pedido de prueba sin costo: datos de las fotos en ${v.brand}` : `Recibo de su compra y datos de las fotos en ${v.brand}`,
      text: `${v.testOrder ? "Pedido de prueba sin costo. Este correo confirma su pedido, sin ningún cobro, y repite lo que usted autorizó." : `Gracias por su compra. Este correo confirma el cobro de ${v.price} y repite lo que usted autorizó.`}\n\nRecibimos las fotos que subió y los nombres (${v.names}). Los usamos solo para crear su libro para colorear. Para crear los dibujos, las fotos se procesan con servicios de terceros que actúan por nuestra cuenta (los destinatarios y la lista de subencargados, a solicitud, están descritos en nuestra política de privacidad). Las fotos se borran en cuanto los personajes están listos, siempre antes de 24 horas. No las vendemos, no reconocemos personas y no entrenamos modelos con ellas. Los dibujos de los personajes (no las fotos) se guardan solo para que pueda pedir otra aventura sin subir fotos: 48 horas después de la entrega (hasta que use la última aventura, y como máximo 30 días, si compró el Trío); se borran antes si pulsa «Borrar mis personajes» en la página de su pedido o si pide el reembolso. El libro y los datos del pedido se borran el ${v.deleteDate}. Los dibujos y la historia se crean con nuestro proceso propio de ilustración asistido por inteligencia artificial; pueden tener imperfecciones.\n\nSiga el avance de su libro aquí: ${v.statusLink}\n${v.testOrder ? `Para cancelar el pedido y borrar el libro antes de tiempo: ${v.refundLink}\nSi usted no hizo este pedido, responda a este correo y lo cancelamos de inmediato.` : `Para pedir reembolso (hasta 7 días después de la entrega): ${v.refundLink}\nSi usted no hizo esta compra, responda a este correo y la cancelamos y reembolsamos de inmediato.`}\n\n${v.holder} · ${v.privacyEmail}`,
    }),
    en: (v) => ({
      subject: v.testOrder ? `Test order, no charge: your photos at ${v.brand}` : `Your receipt and your photos at ${v.brand}`,
      text: `${v.testOrder ? "Test order, no charge. This email confirms your order, with no charge at all, and repeats what you authorized." : `Thank you for your purchase. This email confirms the charge of ${v.price} and repeats what you authorized.`}\n\nWe received the photos you uploaded and the names (${v.names}). We use them only to create your coloring book. To create the drawings, photos are processed by third-party services acting on our behalf (recipients, and the sub-processor list on request, are described in our privacy policy), and are deleted as soon as the characters are ready, always within 24 hours. We do not sell them, identify people or train models with them. The drawings of the characters (not the photos) are kept only so you can order another adventure without uploading photos: 48 hours after delivery (until you use your last adventure, and at most 30 days, with the Trio); they are deleted earlier if you press "Delete my characters" on your order page or ask for a refund. The book and the order data are deleted on ${v.deleteDate}. The drawings and the story are created with our own illustration process assisted by artificial intelligence; they may have imperfections.\n\nFollow your book's progress here: ${v.statusLink}\n${v.testOrder ? `To cancel the order and delete the book early: ${v.refundLink}\nIf you did not place this order, reply to this email and we will cancel it immediately.` : `To request a refund (up to 7 days after delivery): ${v.refundLink}\nIf you did not make this purchase, reply to this email and we will cancel and refund it immediately.`}\n\n${v.holder} · ${v.privacyEmail}`,
    }),
  },
  delivery: {
    es: (v) => ({
      subject: `Su libro para colorear de ${v.names} ya está listo`,
      text: `¡Listo! Descargue e imprima su libro aquí: ${v.deliveryLink}\n\nEs un PDF de 24 páginas, listo para imprimir en casa (Carta o A4, escala 100 %). ${v.notes?.length ? `\nNota: ${v.notes.join(" ")}\n` : ""}\nEl enlace funciona hasta el ${v.deleteDate}; después el libro se borra automáticamente. Descárguelo antes.\n${v.kind === "credit" ? `Todas sus aventuras: ${v.parentLink}` : v.testOrder ? "Pedido de prueba sin costo. Desde ese enlace puede cancelarlo y borrar el libro." : "Si algo no le gustó, puede pedir el reembolso completo desde ese enlace."}\n${extras(v, "es", v.kind !== "credit")}\n${v.brand} · ${v.supportEmail}`,
    }),
    en: (v) => ({
      subject: `Your coloring book for ${v.names} is ready`,
      text: `All done! Download and print your book here: ${v.deliveryLink}\n\nIt is a 24-page PDF, ready to print at home (Letter or A4, 100% scale). ${v.notes?.length ? `\nNote: ${v.notes.join(" ")}\n` : ""}\nThe link works until ${v.deleteDate}; after that the book is deleted automatically. Please download it before then.\n${v.kind === "credit" ? `All your adventures: ${v.parentLink}` : v.testOrder ? "Test order, no charge. From that link you can cancel it and delete the book." : "If anything was not right, you can ask for a full refund from that link."}\n${extras(v, "en", v.kind !== "credit")}\n${v.brand} · ${v.supportEmail}`,
    }),
  },
  refund: {
    es: (v) => ({
      subject: v.testOrder ? "Su pedido de prueba fue cancelado" : `Su reembolso de ${v.price}`,
      text: v.testOrder
        ? `Pedido de prueba sin costo: no hubo ningún cobro, así que no hay nada que reembolsar. Cancelamos el pedido y borramos las fotos, los dibujos de los personajes y el libro. Si necesita algo más, responda a este correo.\n\n${v.brand} · ${v.supportEmail}`
        : `Su reembolso de ${v.price} fue iniciado. Puede tardar unos días en aparecer según su banco. Borramos las fotos, los dibujos de los personajes y el libro. Si necesita algo más, responda a este correo.\n\n${v.brand} · ${v.supportEmail}`,
    }),
    en: (v) => ({
      subject: v.testOrder ? "Your test order was cancelled" : `Your refund of ${v.price}`,
      text: v.testOrder
        ? `Test order, no charge: you were not charged, so there is nothing to refund. We cancelled the order and deleted the photos, the drawings of the characters and the book. If you need anything else, reply to this email.\n\n${v.brand} · ${v.supportEmail}`
        : `Your refund of ${v.price} has been started. It may take a few days to appear depending on your bank. We deleted the photos, the drawings of the characters and the book. If you need anything else, reply to this email.\n\n${v.brand} · ${v.supportEmail}`,
    }),
  },
};

export function composeColorearMessage(kind: Kind, lang: ColorearLang, to: string, vars: MailVars): OutboundMessage {
  if (kind === "reminder") {
    // Text owned by legal-compliance (packages/legal): transactional first, commercial block only when nothing is left to use.
    const r = renderColorearReminder(vars.legalLang ?? (lang === "en" ? "en" : "es-419"), {
      FECHA_BORRADO: vars.deleteDate, ENLACE: vars.deliveryLink ?? "", ENLACE_OFERTA: vars.landingLink ?? "", ENLACE_BAJA: vars.stopLink ?? "",
      MARCA: vars.brand, TITULAR: vars.holder, DOMICILIO: vars.address ?? "", EMAIL_SOPORTE: vars.supportEmail,
    }, { credits: vars.creditsLeft ?? 0, commercial: !!vars.commercialOk && !!vars.stopLink && !!vars.landingLink });
    return { kind: "reminder", to, subject: r.subject, text: r.text };
  }
  const { subject, text } = T[kind as Exclude<Kind, "reminder">][lang](vars);
  return { kind: kind === "receipt" || kind === "receipt_add" ? "receipt" : kind === "delivery" ? "delivery" : "refund", to, subject, text };
}
