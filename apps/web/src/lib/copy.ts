import type { CountryCode } from "@lumen/config";

/**
 * All visible text of the Santa pages, by route language. Legal texts (notice, checkboxes, refund line) do NOT live here:
 * they come from @lumen/legal, word for word.
 */
export type FieldKey = "email" | "phone" | "childName" | "childAge" | "details" | "date" | "window" | "timezone" | "consent" | "country" | "variant";

export interface Copy {
  htmlLang: string;
  siteTitle: string;
  siteDescription: string;
  character: (country: CountryCode) => string;
  nav: { privacy: string; terms: string; support: string };
  lang: { label: string; names: Record<"es" | "es-es" | "en", string> };
  hero: { badge: string; title: (character: string) => string; sub: string; cta: (price: string) => string; trust: string[] };
  sample: { title: string; note: string; play: string };
  steps: { title: string; items: Array<{ t: string; d: string }> };
  pricing: { title: string; oneTime: string; single: { name: string; bullets: string[] }; bundle: { name: string; bullets: string[]; soon: string; badge: string }; choose: string; country: string };
  faq: { title: string; items: Array<{ q: string; a: string }> };
  form: {
    title: string;
    sub: string;
    stepNote: string;
    labels: Record<"email" | "phone" | "childName" | "childAge" | "details" | "date" | "window", string>;
    hints: Partial<Record<"email" | "phone" | "childName" | "childAge" | "details" | "date" | "window", string>>;
    optional: string;
    timezone: (tz: string) => string;
    changeTimezone: string;
    windowOption: (from: string, to: string) => string;
    summary: (variantName: string, price: string) => string;
    noticeTitle: string;
    consentTitle: string;
    pay: (price: string) => string;
    paying: string;
    wallets: string;
    secure: string;
    errors: Record<FieldKey | "generic" | "rate", string>;
  };
  confirm: {
    title: (child: string) => string;
    pendingTitle: string;
    pendingText: string;
    callWindow: string;
    receiptSent: string;
    steps: string[];
    queued: string;
    refund: string;
    optOut: string;
    refunded: string;
    notFound: string;
    testNote: string;
  };
  delivery: {
    title: (child: string) => string;
    pendingTitle: string;
    pendingText: string;
    refundedTitle: string;
    refundedText: string;
    expiredTitle: string;
    expiredText: string;
    listen: string;
    downloadMp3: string;
    downloadPdf: string;
    expires: (date: string) => string;
    share: string;
    shareText: string;
    surveyTitle: string;
    survey: { loved: string; ok: string; bad: string };
    surveyThanks: string;
    refundLink: string;
    notFound: string;
  };
  refundPage: { title: string; text: string; button: string; done: string; outside: string; failed: string; back: string };
  optoutPage: { title: string; text: string; button: string; done: string };
  call: { title: string; intro: string; notice: string; allow: string; denied: string; granted: string; stubNote: string; unsupported: string; notFound: string };
  footer: { operator: string; rights: string };
}

const es419: Copy = {
  htmlLang: "es",
  siteTitle: "Santa te llama",
  siteDescription: "Santa llama por teléfono a tu hijo, por su nombre. Tú eliges el día y la hora y te quedas con la grabación y el certificado. Pago único, sin app y sin suscripción.",
  character: () => "Santa",
  nav: { privacy: "Privacidad", terms: "Términos y reembolso", support: "Soporte" },
  lang: { label: "Idioma", names: { es: "Español", "es-es": "Español (España)", en: "English" } },
  hero: {
    badge: "Llamada de Santa con voz de IA",
    title: (c) => `${c} llama a tu hijo, por su nombre`,
    sub: "Tú eliges el día y la hora. Suena en tu teléfono, tú le pasas el aparato y te quedas con la grabación y un certificado de la Lista de los Buenos.",
    cta: (p) => `Reservar la llamada · ${p}`,
    trust: ["Pago único", "Sin app", "Sin suscripción", "Reembolso en 7 días"],
  },
  sample: { title: "Escucha cómo suena", note: "Muestra de audio disponible muy pronto.", play: "Reproducir muestra" },
  steps: {
    title: "Así de fácil, en 3 pasos",
    items: [
      { t: "Cuéntanos de tu peque", d: "Su nombre, algo que Santa pueda mencionar y el día y la hora que más te convienen. Menos de 2 minutos." },
      { t: "Santa llama a tu teléfono", d: "Contestas, escuchas un aviso corto, pulsas 1 y le pasas el teléfono. La voz es de inteligencia artificial y la llamada dura unos 5 minutos." },
      { t: "Recibes tu recuerdo", d: "Te llega un enlace con el MP3 de la llamada y un certificado en PDF, listos para guardar y compartir." },
    ],
  },
  pricing: {
    title: "Precio",
    oneTime: "Pago único. Sin suscripción.",
    single: { name: "Una llamada", bullets: ["1 llamada de Santa (hasta 5 minutos)", "Grabación en MP3", "Certificado en PDF"] },
    bundle: { name: "Paquete de Nochebuena", bullets: ["2 llamadas de Santa", "Grabación en MP3 de cada una", "Certificado en PDF"], soon: "Muy pronto", badge: "Mejor valor" },
    choose: "Elegir",
    country: "País",
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      { q: "¿Es una suscripción? ¿Necesito una app?", a: "No. Es un pago único, sin app y sin suscripción. No se renueva nada." },
      { q: "¿Quién habla en la llamada?", a: "Una voz de inteligencia artificial que interpreta a Santa. Se lo decimos a usted antes de pagar, en el correo y en el aviso hablado que escucha el adulto al contestar, antes de grabar. Con su hijo, Santa habla como Santa, sin decirle que es una inteligencia artificial: la familia decide si se lo cuenta." },
      { q: "¿Cómo funciona con mi teléfono?", a: "Santa llama al número que indiques, en la ventana de dos horas que elijas. Un aviso breve te pide pulsar 1 para continuar; después pulsas 1 otra vez cuando tu peque tenga el teléfono. Puedes escuchar la llamada." },
      { q: "¿Qué pasa si no contestamos?", a: "Hacemos hasta dos intentos dentro de tu ventana. Si no logramos hablar contigo, te reembolsamos todo de forma automática." },
      { q: "¿Qué datos guardan de mi hijo o hija?", a: "Su primer nombre, lo que escribas y su voz durante la llamada. Los usamos solo para esta experiencia, no se venden ni entrenan IA, y se borran a los 30 días." },
      { q: "¿Y si me arrepiento?", a: "Reembolso completo y automático hasta 7 días después, sin preguntas. Un enlace en tu recibo lo hace al instante." },
    ],
  },
  form: {
    title: "Reserva la llamada",
    sub: "Siete datos y listo. Pagas al final, en una página segura.",
    stepNote: "Paso 1 de 2 · Después del pago recibirás tu confirmación.",
    labels: {
      email: "Tu correo",
      phone: "Teléfono donde llamará Santa",
      childName: "Nombre del niño o la niña",
      childAge: "Edad",
      details: "Algo que Santa pueda mencionar",
      date: "Día de la llamada",
      window: "Franja horaria",
    },
    hints: {
      email: "Aquí te llegan el recibo y la grabación.",
      phone: "Solo el número, sin el código del país.",
      childName: "Solo el primer nombre.",
      details: "Un logro, una buena acción, su mascota. Sin direcciones, apellidos ni teléfonos.",
      window: "Santa llama dentro de estas dos horas.",
    },
    optional: "opcional",
    timezone: (tz) => `Hora de ${tz}`,
    changeTimezone: "Cambiar zona horaria",
    windowOption: (a, b) => `${a} a ${b}`,
    summary: (v, p) => `${v} · ${p}`,
    noticeTitle: "Antes de pagar, lee esto",
    consentTitle: "Tu autorización",
    pay: (p) => `Ir al pago · ${p}`,
    paying: "Un momento...",
    wallets: "En el pago verás tarjeta, Apple Pay o Google Pay según tu dispositivo.",
    secure: "Pago único procesado por un proveedor de pagos seguro. No guardamos tu tarjeta.",
    errors: {
      email: "Revisa tu correo.",
      phone: "Revisa el teléfono: solo números, sin el código del país.",
      childName: "Escribe solo el primer nombre del niño o la niña (sin apellido).",
      childAge: "La edad debe estar entre 1 y 17.",
      details: "Quita datos personales (teléfonos, direcciones, apellidos, enlaces) y deja un texto corto.",
      date: "Elige un día válido.",
      window: "Esa franja ya pasó o es muy pronto. Elige otra.",
      timezone: "Zona horaria no válida.",
      consent: "Marca todas las casillas para continuar.",
      country: "Este país aún no está disponible.",
      variant: "Elige una opción.",
      generic: "No pudimos crear tu pedido. Inténtalo de nuevo en un momento.",
      rate: "Demasiados intentos. Espera un minuto.",
    },
  },
  confirm: {
    title: (c) => `Todo listo para ${c}`,
    pendingTitle: "Confirmando tu pago...",
    pendingText: "Esto tarda unos segundos. Esta página se actualiza sola.",
    callWindow: "Santa llamará entre",
    receiptSent: "Te enviamos el recibo y un recordatorio por correo.",
    steps: ["Ten el teléfono a mano a la hora elegida.", "Contesta y escucha el aviso; pulsa 1 para continuar.", "Cuando tu peque tenga el teléfono, pulsa 1 otra vez."],
    queued: "Si hay muchas llamadas al mismo tiempo, te avisaremos de la hora real por correo.",
    refund: "Pedir reembolso",
    optOut: "No quiero esta llamada",
    refunded: "Este pedido fue reembolsado.",
    notFound: "No encontramos este pedido.",
    testNote: "Pedido de prueba: no se cobró nada.",
  },
  delivery: {
    title: (c) => `La llamada de Santa a ${c}`,
    pendingTitle: "Tu recuerdo aún no está listo",
    pendingText: "Cuando termine la llamada, aquí aparecerán la grabación y el certificado. También te los enviaremos por correo.",
    refundedTitle: "Pedido reembolsado",
    refundedText: "Este pedido fue reembolsado y sus datos se borrarán.",
    expiredTitle: "Este enlace ya venció",
    expiredText: "Por privacidad, la grabación y los datos se borran a los 30 días.",
    listen: "Escuchar la llamada",
    downloadMp3: "Descargar MP3",
    downloadPdf: "Descargar certificado (PDF)",
    expires: (d) => `Descárgala antes del ${d}: después se borra automáticamente.`,
    share: "Compartir por WhatsApp",
    shareText: "Santa llamó a mi peque con su nombre. Mira cómo se hace:",
    surveyTitle: "¿Cómo les fue?",
    survey: { loved: "Les encantó", ok: "Estuvo bien", bad: "No salió bien" },
    surveyThanks: "¡Gracias por contarnos!",
    refundLink: "Pedir reembolso",
    notFound: "No encontramos este enlace.",
  },
  refundPage: { title: "Reembolso", text: "Te devolvemos el pago completo, de forma automática. Se cancela la llamada si aún no ocurrió.", button: "Pedir mi reembolso", done: "Listo. Iniciamos tu reembolso; puede tardar unos días en aparecer.", outside: "Pasaron más de 7 días, así que ya no es automático. Escríbenos y lo revisamos.", failed: "No pudimos procesarlo. Escríbenos y lo resolvemos.", back: "Volver" },
  optoutPage: { title: "No quiero esta llamada", text: "No volveremos a llamar a este número, cancelamos la llamada y te reembolsamos todo.", button: "Cancelar y reembolsar", done: "Hecho. No volveremos a llamar a ese número." },
  call: {
    title: "Llamada por la web",
    intro: "Esta opción llama desde tu navegador, sin gastar minutos del teléfono.",
    notice: "Habla una voz de inteligencia artificial, no una persona. La llamada se graba para entregársela a la familia. Si eres la persona adulta responsable, permite el micrófono para continuar.",
    allow: "Permitir micrófono y continuar",
    denied: "No pudimos usar el micrófono. Revisa los permisos del navegador.",
    granted: "Micrófono listo.",
    stubNote: "La conexión de voz todavía no está activa en esta versión.",
    unsupported: "Tu navegador no permite usar el micrófono aquí. Ábrelo en Safari o Chrome.",
    notFound: "No encontramos esta llamada.",
  },
  footer: { operator: "Un producto de", rights: "Todos los derechos reservados." },
};

const esES: Copy = {
  ...es419,
  htmlLang: "es-ES",
  siteTitle: "Papá Noel te llama",
  siteDescription: "Papá Noel llama por teléfono a tu hijo, por su nombre. Tú eliges el día y la hora y te quedas con la grabación y el certificado. Pago único, sin app y sin suscripción.",
  character: () => "Papá Noel",
  lang: es419.lang,
  hero: {
    badge: "Llamada de Papá Noel con voz de IA",
    title: (c) => `${c} llama a tu hijo, por su nombre`,
    sub: "Tú eliges el día y la hora. Suena en tu móvil, tú le pasas el aparato y te quedas con la grabación y un certificado de la Lista de los Buenos.",
    cta: (p) => `Reservar la llamada · ${p}`,
    trust: ["Pago único", "Sin app", "Sin suscripción", "Reembolso en 7 días"],
  },
  steps: {
    title: "Así de fácil, en 3 pasos",
    items: [
      { t: "Cuéntanos de tu peque", d: "Su nombre, algo que Papá Noel pueda mencionar y el día y la hora que más te convienen. Menos de 2 minutos." },
      { t: "Papá Noel llama a tu móvil", d: "Contestas, escuchas un aviso corto, pulsas 1 y le pasas el móvil. La voz es de inteligencia artificial y la llamada dura unos 5 minutos." },
      { t: "Recibes tu recuerdo", d: "Te llega un enlace con el MP3 de la llamada y un certificado en PDF, listos para guardar y compartir." },
    ],
  },
  pricing: { ...es419.pricing, single: { name: "Una llamada", bullets: ["1 llamada de Papá Noel (hasta 5 minutos)", "Grabación en MP3", "Certificado en PDF"] }, bundle: { name: "Pack de Nochebuena", bullets: ["2 llamadas de Papá Noel", "Grabación en MP3 de cada una", "Certificado en PDF"], soon: "Muy pronto", badge: "Mejor valor" } },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      { q: "¿Es una suscripción? ¿Necesito una app?", a: "No. Es un pago único, sin app y sin suscripción. No se renueva nada." },
      { q: "¿Quién habla en la llamada?", a: "Una voz de inteligencia artificial que interpreta a Papá Noel. Se lo decimos antes de pagar, en el correo y en el aviso hablado que oye la persona adulta al contestar, antes de grabar. Con tu hijo, Papá Noel habla como Papá Noel, sin decirle que es una inteligencia artificial: la familia decide si se lo cuenta." },
      { q: "¿Cómo funciona con mi móvil?", a: "Papá Noel llama al número que indiques, en la franja de dos horas que elijas. Un aviso breve te pide pulsar 1 para continuar; después pulsas 1 otra vez cuando tu peque tenga el móvil. Puedes escuchar la llamada." },
      { q: "¿Qué pasa si no contestamos?", a: "Hacemos hasta dos intentos dentro de tu franja. Si no logramos hablar contigo, te reembolsamos el importe íntegro de forma automática." },
      { q: "¿Qué datos guardáis de mi hijo o hija?", a: "Su nombre de pila, lo que escribas y su voz durante la llamada. Los usamos solo para esta experiencia, no se venden ni entrenan IA, y se suprimen a los 30 días." },
      { q: "¿Y si me arrepiento?", a: "Reembolso íntegro y automático hasta 7 días después, sin preguntas. Un enlace en tu recibo lo hace al instante." },
    ],
  },
  form: {
    ...es419.form,
    sub: "Siete datos y listo. Pagas al final, en una página segura.",
    labels: { ...es419.form.labels, phone: "Móvil donde llamará Papá Noel", details: "Algo que Papá Noel pueda mencionar" },
    hints: { ...es419.form.hints, phone: "Solo el número, sin el prefijo del país.", childName: "Solo el nombre de pila." },
    errors: { ...es419.form.errors, phone: "Revisa el móvil: solo números, sin el prefijo del país.", childName: "Escribe solo el nombre de pila del niño o la niña (sin apellidos)." },
  },
  confirm: { ...es419.confirm, title: (c) => `Todo listo para ${c}`, callWindow: "Papá Noel llamará entre", steps: ["Ten el móvil a mano a la hora elegida.", "Contesta y escucha el aviso; pulsa 1 para continuar.", "Cuando tu peque tenga el móvil, pulsa 1 otra vez."] },
  delivery: { ...es419.delivery, title: (c) => `La llamada de Papá Noel a ${c}`, shareText: "Papá Noel llamó a mi peque por su nombre. Mira cómo se hace:" },
  call: { ...es419.call, intro: "Esta opción llama desde tu navegador, sin gastar minutos del móvil." },
};

const en: Copy = {
  htmlLang: "en",
  siteTitle: "Santa calls your child",
  siteDescription: "Santa phones your child by name. You pick the day and time and keep the recording and a certificate. One payment, no app, no subscription.",
  character: () => "Santa",
  nav: { privacy: "Privacy", terms: "Terms and refunds", support: "Support" },
  lang: es419.lang,
  hero: {
    badge: "A call from Santa, in an AI voice",
    title: (c) => `${c} calls your child, by name`,
    sub: "You pick the day and time. It rings on your phone, you hand it to your child, and you keep the recording plus a Nice List certificate.",
    cta: (p) => `Book the call · ${p}`,
    trust: ["One-time payment", "No app", "No subscription", "7-day refund"],
  },
  sample: { title: "Hear how it sounds", note: "Audio sample coming very soon.", play: "Play sample" },
  steps: {
    title: "Three easy steps",
    items: [
      { t: "Tell us about your child", d: "Their first name, something Santa can mention, and the day and time that suit you. Under 2 minutes." },
      { t: "Santa calls your phone", d: "You answer, hear a short notice, press 1 and hand over the phone. The voice is artificial intelligence and the call lasts about 5 minutes." },
      { t: "Keep the memory", d: "You get a link with the MP3 of the call and a PDF certificate, ready to save and share." },
    ],
  },
  pricing: {
    title: "Price",
    oneTime: "One-time payment. No subscription.",
    single: { name: "One call", bullets: ["1 call from Santa (up to 5 minutes)", "MP3 recording", "PDF certificate"] },
    bundle: { name: "Christmas Eve bundle", bullets: ["2 calls from Santa", "MP3 recording of each", "PDF certificate"], soon: "Coming soon", badge: "Best value" },
    choose: "Choose",
    country: "Country",
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      { q: "Is it a subscription? Do I need an app?", a: "No. It is a one-time payment, with no app and no subscription. Nothing renews." },
      { q: "Who is speaking on the call?", a: "An artificial intelligence voice playing Santa. We tell you before you pay, in the email, and in the spoken notice the adult hears on answering, before recording starts. With your child, Santa speaks as Santa, without saying that he is artificial intelligence: the family decides whether to tell them." },
      { q: "How does it work with my phone?", a: "Santa calls the number you give, inside the two-hour slot you choose. A short notice asks you to press 1 to continue; then you press 1 again when your child has the phone. You can listen in." },
      { q: "What if nobody answers?", a: "We make up to two attempts inside your slot. If we cannot reach you, we refund everything automatically." },
      { q: "What do you keep about my child?", a: "Their first name, what you type, and their voice during the call. We use it only for this experience, never sell it or train AI with it, and delete it after 30 days." },
      { q: "What if I change my mind?", a: "Full automatic refund up to 7 days later, no questions asked. A link in your receipt does it instantly." },
    ],
  },
  form: {
    title: "Book the call",
    sub: "Seven details and you are done. You pay at the end, on a secure page.",
    stepNote: "Step 1 of 2 · You will get your confirmation after payment.",
    labels: {
      email: "Your email",
      phone: "Phone Santa will call",
      childName: "Child's first name",
      childAge: "Age",
      details: "Something Santa can mention",
      date: "Day of the call",
      window: "Time slot",
    },
    hints: {
      email: "Your receipt and the recording are sent here.",
      phone: "Just the number, without the country code.",
      childName: "First name only.",
      details: "An achievement, a good deed, a pet. No addresses, surnames or phone numbers.",
      window: "Santa calls within these two hours.",
    },
    optional: "optional",
    timezone: (tz) => `Time in ${tz}`,
    changeTimezone: "Change time zone",
    windowOption: (a, b) => `${a} to ${b}`,
    summary: (v, p) => `${v} · ${p}`,
    noticeTitle: "Please read before paying",
    consentTitle: "Your authorization",
    pay: (p) => `Go to payment · ${p}`,
    paying: "One moment...",
    wallets: "At payment you will see card, Apple Pay or Google Pay depending on your device.",
    secure: "One-time payment handled by a secure payment provider. We never store your card.",
    errors: {
      email: "Please check your email.",
      phone: "Please check the phone number: digits only, without the country code.",
      childName: "Enter the child's first name only (no surname).",
      childAge: "Age must be between 1 and 17.",
      details: "Remove personal details (phone numbers, addresses, surnames, links) and keep it short.",
      date: "Pick a valid day.",
      window: "That slot has passed or is too soon. Pick another.",
      timezone: "Invalid time zone.",
      consent: "Tick all the boxes to continue.",
      country: "This country is not available yet.",
      variant: "Choose an option.",
      generic: "We could not create your order. Please try again in a moment.",
      rate: "Too many attempts. Wait a minute.",
    },
  },
  confirm: {
    title: (c) => `All set for ${c}`,
    pendingTitle: "Confirming your payment...",
    pendingText: "This takes a few seconds. The page refreshes by itself.",
    callWindow: "Santa will call between",
    receiptSent: "We emailed you the receipt and a reminder.",
    steps: ["Keep your phone handy at the chosen time.", "Answer and listen to the notice; press 1 to continue.", "When your child has the phone, press 1 again."],
    queued: "If many calls happen at once, we will email you the real time.",
    refund: "Request a refund",
    optOut: "I do not want this call",
    refunded: "This order was refunded.",
    notFound: "We could not find this order.",
    testNote: "Test order: nothing was charged.",
  },
  delivery: {
    title: (c) => `Santa's call to ${c}`,
    pendingTitle: "Your keepsake is not ready yet",
    pendingText: "When the call ends, the recording and the certificate will appear here. We will also email them to you.",
    refundedTitle: "Order refunded",
    refundedText: "This order was refunded and its data will be deleted.",
    expiredTitle: "This link has expired",
    expiredText: "For privacy, the recording and data are deleted after 30 days.",
    listen: "Listen to the call",
    downloadMp3: "Download MP3",
    downloadPdf: "Download certificate (PDF)",
    expires: (d) => `Download it before ${d}: after that it is deleted automatically.`,
    share: "Share on WhatsApp",
    shareText: "Santa called my little one by name. See how it works:",
    surveyTitle: "How did it go?",
    survey: { loved: "They loved it", ok: "It was fine", bad: "It went badly" },
    surveyThanks: "Thanks for telling us!",
    refundLink: "Request a refund",
    notFound: "We could not find this link.",
  },
  refundPage: { title: "Refund", text: "We return the full payment, automatically. The call is cancelled if it has not happened yet.", button: "Request my refund", done: "Done. We started your refund; it can take a few days to appear.", outside: "More than 7 days have passed, so it is no longer automatic. Write to us and we will review it.", failed: "We could not process it. Write to us and we will sort it out.", back: "Back" },
  optoutPage: { title: "I do not want this call", text: "We will not call this number again, we cancel the call and refund everything.", button: "Cancel and refund", done: "Done. We will not call that number again." },
  call: {
    title: "Web call",
    intro: "This option calls from your browser, without using phone minutes.",
    notice: "An artificial intelligence voice speaks, not a person. The call is recorded and given to the family. If you are the responsible adult, allow the microphone to continue.",
    allow: "Allow microphone and continue",
    denied: "We could not use the microphone. Check your browser permissions.",
    granted: "Microphone ready.",
    stubNote: "The voice connection is not active in this version yet.",
    unsupported: "Your browser cannot use the microphone here. Open this page in Safari or Chrome.",
    notFound: "We could not find this call.",
  },
  footer: { operator: "A product of", rights: "All rights reserved." },
};

export const COPY: Record<"es" | "es-es" | "en", Copy> = { es: es419, "es-es": esES, en };

export type FormCopy = Omit<Copy["form"], "timezone" | "windowOption" | "summary" | "pay"> & { timezoneTpl: string; windowOptionTpl: string };

/** Builds the client-safe copy on the server (functions cannot cross to a client component). */
export function serializeFormCopy(c: Copy["form"]): FormCopy {
  const { timezone, windowOption, summary, pay, ...rest } = c;
  void summary; void pay;
  return { ...rest, timezoneTpl: timezone("{tz}"), windowOptionTpl: windowOption("{a}", "{b}") };
}
