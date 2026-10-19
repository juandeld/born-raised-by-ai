import type { Language } from "./types";
import type { MessageKind, OutboundMessage } from "./providers/delivery";

/**
 * Message templates. Legal wording comes verbatim from docs/legal/textos: receipt (01 D), refund (05 C),
 * opt-out reply (02 B), incident (07 section E). Reminder, delivery and delay messages are written here (operational text,
 * not legal text). es-ES falls back to es-419 where the legal file gives no distinct variant. [EN incident text is a proposed
 * translation pending legal-compliance approval.]
 */
export interface MailVars {
  childName: string;
  price?: string;
  deleteDate?: string;
  dataLink?: string;
  refundLink?: string;
  deliveryLink?: string;
  linkExpires?: string;
  callTimeLocal?: string;
  optOutLink?: string;
  holder: string;
  privacyEmail: string;
  supportEmail: string;
  brand: string;
  emergencyNumber?: string;
}

type Tpl = { subject: string; text: string };
type Dict = Record<Language, Tpl> & { "es-ES"?: Tpl };

const T: Record<MessageKind, Partial<Record<Language, (v: MailVars) => Tpl>>> = {
  receipt: {
    "es-419": (v) => ({
      subject: `Recibo de su compra y datos de su hijo o hija en ${v.brand}`,
      text: `Gracias por su compra. Este correo confirma el cobro de ${v.price} y repite lo que usted autorizó.\n\nRecogimos el primer nombre de ${v.childName}, los datos que usted escribió y, durante la llamada, su voz (con grabación). Los usamos solo para esta experiencia. No los vendemos ni entrenamos inteligencia artificial con ellos. Se borran el ${v.deleteDate} (30 días después de la entrega).\n\nEs una llamada automatizada: la voz de Santa es una inteligencia artificial de Lumen Labs y la llamada se graba para entregársela. Se lo avisamos a usted al principio de la llamada, antes de grabar. Con su hijo, Santa hablará como Santa, sin decirle que es una inteligencia artificial: ustedes, la familia, deciden si se lo cuentan.\n\nPara ver, descargar o borrar estos datos ahora: ${v.dataLink}\nPara pedir reembolso (hasta 7 días después de la fecha de la llamada): ${v.refundLink}\nSi usted no hizo esta compra, responda a este correo y la cancelamos y reembolsamos de inmediato.\n\n${v.holder} · ${v.privacyEmail}`,
    }),
    en: (v) => ({
      subject: `Your receipt and your child's information at ${v.brand}`,
      text: `Thank you for your purchase. This email confirms the charge of ${v.price} and repeats what you authorized.\n\nWe collected ${v.childName}'s first name, the details you entered and, during the call, their voice (recorded). We use them only for this experience. We do not sell them or train artificial intelligence with them. They will be deleted on ${v.deleteDate} (30 days after delivery).\n\nIt is an automated call: Santa's voice is artificial intelligence from Lumen Labs, and the call is recorded to deliver it to you. We tell you at the start of the call, before recording begins. With your child, Santa will speak as Santa, without saying that he is artificial intelligence: you, the family, decide whether to tell them.\n\nTo view, download or delete this information now: ${v.dataLink}\nTo request a refund (until 7 days after the call date): ${v.refundLink}\nIf you did not make this purchase, reply to this email and we will cancel and refund it immediately.\n\n${v.holder} · ${v.privacyEmail}`,
    }),
  },
  reminder: {
    "es-419": (v) => ({
      subject: `Recordatorio: la llamada para ${v.childName} es ${v.callTimeLocal}`,
      text: `La llamada para ${v.childName} está programada para ${v.callTimeLocal}. Quien conteste escuchará un aviso de que la voz es de IA y de que se graba, y podrá cancelar con la tecla 2. Es una llamada automatizada: la voz de Santa es una inteligencia artificial de Lumen Labs y la llamada se graba para entregársela. Se lo avisamos a usted al principio de la llamada, antes de grabar. Con su hijo, Santa hablará como Santa, sin decirle que es una inteligencia artificial: ustedes, la familia, deciden si se lo cuentan.\n\nSi no quiere que llamemos a este número: ${v.optOutLink}\n\n${v.brand} · ${v.supportEmail}`,
    }),
    en: (v) => ({
      subject: `Reminder: the call for ${v.childName} is ${v.callTimeLocal}`,
      text: `The call for ${v.childName} is scheduled for ${v.callTimeLocal}. Whoever answers will hear a notice that the voice is AI and that the call is recorded, and can cancel by pressing 2. It is an automated call: Santa's voice is artificial intelligence from Lumen Labs, and the call is recorded to deliver it to you. We tell you at the start of the call, before recording begins. With your child, Santa will speak as Santa, without saying that he is artificial intelligence: you, the family, decide whether to tell them.\n\nIf you do not want us to call this number: ${v.optOutLink}\n\n${v.brand} · ${v.supportEmail}`,
    }),
  },
  delivery: {
    "es-419": (v) => ({
      subject: `La llamada de ${v.childName} ya está lista`,
      text: `Aquí está la grabación de la llamada de ${v.childName} y su certificado: ${v.deliveryLink}\n\nEl enlace funciona hasta el ${v.linkExpires}. Descargue el archivo antes: después se borra automáticamente, como le indicamos.\n\n${v.brand} · ${v.supportEmail}`,
    }),
    en: (v) => ({
      subject: `${v.childName}'s call is ready`,
      text: `Here is the recording of ${v.childName}'s call and the certificate: ${v.deliveryLink}\n\nThe link works until ${v.linkExpires}. Please download the file before then: afterwards it is deleted automatically, as we told you.\n\n${v.brand} · ${v.supportEmail}`,
    }),
  },
  delayed: {
    "es-419": (v) => ({
      subject: `Un pequeño retraso en la llamada de ${v.childName}`,
      text: `Hay muchas llamadas en este momento. La llamada de ${v.childName} saldrá alrededor de ${v.callTimeLocal}, dentro de la ventana que usted eligió. Si no podemos llamar dentro de esa ventana, le reembolsamos el cobro completo automáticamente.\n\n${v.brand} · ${v.supportEmail}`,
    }),
    en: (v) => ({
      subject: `A short delay on ${v.childName}'s call`,
      text: `There are many calls right now. ${v.childName}'s call will go out around ${v.callTimeLocal}, within the window you chose. If we cannot call within that window, we refund the full charge automatically.\n\n${v.brand} · ${v.supportEmail}`,
    }),
  },
  refund: {
    "es-419": (v) => ({
      subject: `Su reembolso de ${v.price}`,
      text: `Su reembolso de ${v.price} fue iniciado. Puede tardar unos días en aparecer según su banco. Cancelamos todo lo pendiente y borraremos los datos como indica nuestra política. Si necesita algo más, responda a este correo.`,
    }),
    en: (v) => ({
      subject: `Your refund of ${v.price}`,
      text: `Your refund of ${v.price} has been started. It may take a few days to appear depending on your bank. We cancelled everything pending and will delete the data as our policy describes. If you need anything else, reply to this email.`,
    }),
  },
  optout: {
    "es-419": () => ({ subject: "Listo, no volveremos a llamar", text: "Listo. No volveremos a llamar a ese número. Si había una llamada programada, la cancelamos y le reembolsamos el cobro completo. Esta baja no afecta ningún otro derecho suyo." }),
    "es-ES": () => ({ subject: "Hecho, no volveremos a llamar", text: "Hecho. No volveremos a llamar a ese número. Si había una llamada programada, la cancelamos y le reembolsamos el importe íntegro. Esta baja no afecta ningún otro derecho suyo." }),
    en: () => ({ subject: "Done, we will not call again", text: "Done. We will not call that number again. If a call was scheduled, we cancelled it and are refunding the full charge. This opt-out does not affect any other right you have." }),
  },
  incident: {
    "es-419": (v) => ({
      subject: `Sobre la llamada de ${v.childName}`,
      text: `Durante la llamada, ${v.childName} dijo algo que nos hizo pensar que quizá quiera hablar con un adulto de su confianza. Le recomendamos escuchar la grabación y hablar con su hijo o hija. Si hay una emergencia, llame a su número local de emergencias${v.emergencyNumber ? ` (${v.emergencyNumber})` : ""}.`,
    }),
    en: (v) => ({
      subject: `About ${v.childName}'s call`,
      text: `During the call, ${v.childName} said something that made us think they may want to talk with a trusted adult. We recommend listening to the recording and talking with your child. If there is an emergency, call your local emergency number${v.emergencyNumber ? ` (${v.emergencyNumber})` : ""}.`,
    }),
  },
  ops: {
    "es-419": () => ({ subject: "", text: "" }),
  },
};

export function composeMessage(kind: MessageKind, language: Language, to: string, vars: MailVars): OutboundMessage {
  const byLang = T[kind];
  const fn = byLang[language] ?? (language === "es-ES" ? byLang["es-419"] : byLang.en) ?? byLang["es-419"]!;
  const tpl = fn(vars);
  return { kind, to, subject: tpl.subject, text: tpl.text };
}

export type { Dict };
