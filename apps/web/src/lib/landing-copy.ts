import { SEASON, type CountryCode } from "@lumen/config";
import type { Slug } from "./slugs";

/**
 * Jinglo landing v2 (docs/diseno/jinglo/v2, docs/marketing/jinglo-concepto-v2.md). Visible text of the Santa landing in
 * es-MX (/es), es-ES (/es-es), en-GB and en-US (/en, country decides). Legal text of the checkout does NOT live here.
 * Approved by legal-compliance on 19-oct-2026: docs/legal/aprobacion-jinglo.md section "Landing v2".
 * Placeholders: {n} child's name, {price} single price, {price2} bundle price.
 */
export interface LandingCopy {
  htmlLang: string;
  doc: string;
  description: string;
  santaAlt: string;
  heroAlt: string;
  phoneAlt: string;
  tallerAlt: string;
  famAlt: string;
  answer: string;
  callFrom: string;
  callSubN: string;
  callSub0: string;
  h1_0: string;
  h1_n: string;
  lead_0: string;
  lead_n: string;
  fieldL: string;
  fieldPh: string;
  fieldH: string;
  cta_0: string;
  cta_n: string;
  ctaS: string;
  fine: string;
  listenT: string;
  listenP: string;
  listenN: string;
  hang: string;
  hangOff: string;
  howT: string;
  steps: Array<[string, string]>;
  tallerCap: string;
  giftT: string;
  giftQ: string;
  gift: Array<[string, string]>;
  cBy: string;
  cThat: string;
  cName0: string;
  cList: string;
  cYear: string;
  cSig: string;
  whoT: string;
  who: Array<[string, string]>;
  guarT: string;
  stamp: string;
  guar: Array<[string, string]>;
  urgT: string;
  urgTimer: string;
  d: string;
  h: string;
  m: string;
  s: string;
  urgDone: string;
  urgLast: string;
  urgWhy: string;
  priceT: string;
  p1n: string;
  p1d: string;
  p2n: string;
  p2d: string;
  soon: string;
  priceN: string;
  faqT: string;
  faq: Array<[string, string]>;
  by: string;
  legal: string;
  lang: string;
  countryLabel: string;
  skip: string;
}

const YEAR = String(SEASON.year);

const ES: LandingCopy = {
  htmlLang: "es-MX",
  doc: "Jinglo — Una llamada del Polo Norte para tu peque",
  description: "Santa llama a tu peque por su nombre. Tú eliges el día y la hora y te quedas con la grabación y el certificado. Pago único, sin app y sin suscripción. La voz de Santa es de inteligencia artificial.",
  santaAlt: "Santa, con gesto amable, hablando por un teléfono antiguo.",
  heroAlt: "Una casita en una colina nevada, de noche, con una ventana encendida.",
  phoneAlt: "Un teléfono rojo sonando en la mesita del pasillo, con nieve afuera de la ventana.",
  tallerAlt: "El taller del Polo Norte de noche, con paquetes en los estantes y un teléfono de candelero sobre la mesa.",
  famAlt: "Un niño en pijama rojo contesta un teléfono antiguo frente al árbol de Navidad mientras su mamá lo mira.",
  answer: "Contestar",
  callFrom: "Polo Norte",
  callSubN: "llamando a {n}…",
  callSub0: "llamada entrante…",
  h1_0: "Este año, el Polo Norte llama a casa.",
  h1_n: "Hay una llamada del Polo Norte para {n}.",
  lead_0: "Un día de diciembre, a la hora que tú elijas, suena tu teléfono. Es Santa, y pregunta por tu peque. Tú solo tienes que estar ahí para ver su cara.",
  lead_n: "Un día de diciembre, a la hora que tú elijas, suena tu teléfono. Es Santa, y pregunta por {n}. Tú solo tienes que estar ahí para ver su cara.",
  fieldL: "¿Cómo se llama tu peque?",
  fieldPh: "Escribe su nombre",
  fieldH: "Solo para que veas cómo quedaría.",
  cta_0: "Reservar la llamada · {price}",
  cta_n: "Reservar la llamada de {n} · {price}",
  ctaS: "Reservar la llamada · {price}",
  fine: "Pago único. Sin app. Sin suscripción. Reembolso en 7 días. La voz de Santa es generada con inteligencia artificial.",
  listenT: "Contesta. Esto es lo que va a oír.",
  listenP: "Un fragmento de 21 segundos de una llamada de muestra. En la tuya, Santa dice el nombre de tu peque y lo que tú le cuentes.",
  listenN: "Muestra en español con voz de Santa generada con inteligencia artificial (no es una persona). En las preguntas frecuentes te explicamos cómo funciona.",
  hang: "Descolgar",
  hangOff: "Colgar",
  howT: "Tú lo preparas en dos minutos. Santa se encarga del resto.",
  steps: [
    ["Cuéntanos de tu peque", "Su nombre, algo que Santa pueda mencionar (un dibujo, un diente, una travesura) y el día y la hora que mejor te vengan. Dos minutos, sin crear cuenta."],
    ["Suena tu teléfono", "Contestas, escuchas un aviso corto, pulsas 1 y le pasas el teléfono. La llamada dura unos cinco minutos."],
    ["Se queda para siempre", "Apenas termina te llega un enlace con la grabación y el certificado. Descárgalos y guárdalos."],
  ],
  tallerCap: "Del otro lado de la línea.",
  giftT: "Un recuerdo que se queda cuando se acaba la Navidad.",
  giftQ: "Dentro de diez años vas a querer volver a escuchar esa vocecita contestándole al Polo Norte.",
  gift: [
    ["La grabación completa", "de la llamada, en MP3, para guardarla y mandársela a los abuelos."],
    ["El certificado de la Lista de los Buenos", "con su nombre, en PDF, listo para imprimir y enmarcar."],
    ["Y son tuyos", "porque te llegan en un enlace por correo. Descárgalos dentro de los 30 días siguientes."],
  ],
  cBy: "Por orden del Polo Norte",
  cThat: "Se certifica que",
  cName0: "tu peque",
  cList: "figura en la Lista de los Buenos",
  cYear: `Navidad ${YEAR}`,
  cSig: "Santa",
  whoT: "Para los que quieren estar en la sala cuando suena.",
  who: [
    ["Papás y mamás", "Tú le pasas el teléfono y te quedas con la mejor vista de la casa: su cara. Y después, con la grabación, también su voz."],
    ["Abuelos y abuelas", "¿Vives lejos? Reservas desde donde estés, nos dices a qué teléfono llamar y a qué hora, y el recuerdo te llega a ti también."],
    ["Padrinos y tíos", "Un regalo que no ocupa lugar en la maleta y que se va a contar en cada Navidad."],
  ],
  guarT: "Si no sale como lo prometemos, te devolvemos tu dinero.",
  stamp: "días",
  guar: [
    ["Si nadie contesta", "Intentamos dos veces dentro de la ventana que elegiste. Si no logramos hablar contigo, te devolvemos todo, sin que tengas que pedirlo."],
    ["Si cambias de idea", "Tienes 7 días para pedir el reembolso completo desde el enlace de tu recibo. Sin preguntas."],
    ["Si quieres frenar", "Antes de empezar, un aviso corto te pide pulsar 1. Si pulsas 2, la llamada no empieza."],
  ],
  urgT: "Nochebuena no espera a nadie.",
  urgTimer: "Tiempo restante para reservar",
  d: "días",
  h: "horas",
  m: "min",
  s: "seg",
  urgDone: "El plazo para reservar ya terminó. Vuelve el año que viene.",
  urgLast: "Último día para reservar: {date}. Las llamadas se hacen hasta el 24 de diciembre.",
  urgWhy: "Las llamadas se hacen en vivo y cada franja de dos horas tiene un cupo limitado. Si dejas la reserva para el final, la hora que quieres puede estar llena.",
  priceT: "Reserva la llamada.",
  p1n: "Una llamada",
  p1d: "Santa llama el día y la hora que elijas. Incluye la grabación y el certificado.",
  p2n: "Paquete de Nochebuena",
  p2d: "Dos llamadas: una cuando tú quieras y otra la noche del 24.",
  soon: "Disponible muy pronto.",
  priceN: "Antes de pagar verás, con todas sus letras, que la voz de Santa la genera una inteligencia artificial.",
  faqT: "Lo que se pregunta antes de reservar",
  faq: [
    ["¿Quién habla en la llamada? ¿Es una persona?", "No es una persona: es una voz generada con inteligencia artificial que interpreta a Santa. Te lo decimos antes de pagar, en tu correo de confirmación y en un aviso hablado que escuchas tú al contestar, antes de que empiece la llamada. Con tu peque, Santa habla como Santa. Tú decides si algún día le cuentas cómo funciona."],
    ["¿Es seguro para mi hijo o hija?", "Tú eliges el número, el día y la hora, y la llamada solo se hace dentro de esa ventana, entre las 8:00 y las 21:00 de tu hora local. Primero contesta un adulto y pulsa 1; después le pasa el teléfono. Santa no pide datos personales ni propone hablar fuera de la llamada, dura unos cinco minutos y tú puedes colgar cuando quieras."],
    ["¿Qué pasa con la privacidad de mi peque?", "Guardamos su primer nombre, lo que nos cuentes y su voz durante la llamada, solo para esta experiencia. No se venden ni se usan para entrenar inteligencia artificial, y los borramos a los 30 días."],
    ["¿Y si mi peque es tímido o no contesta?", "Pasa mucho. Santa habla despacio, hace preguntas sencillas y repite con paciencia. Puedes sentarte a su lado y ayudarle a contestar. Si el silencio sigue unos segundos, Santa se despide con cariño."],
    ["¿Es una suscripción? ¿Tengo que bajar una app?", "No. Es un pago único, sin app y sin suscripción. No se renueva nada."],
    ["¿Y si nadie contesta cuando llama?", "Intentamos dos veces dentro de la ventana que elegiste. Si no logramos hablar contigo, te devolvemos todo automáticamente."],
    ["¿Y si me arrepiento?", "Tienes 7 días para pedir el reembolso completo, automático y sin preguntas, desde el enlace de tu recibo."],
  ],
  by: "Jinglo, un producto de Lumen Labs.",
  legal: "Las voces de las llamadas están generadas con inteligencia artificial.",
  lang: "Idioma",
  countryLabel: "País",
  skip: "Ir al contenido",
};

const EN: LandingCopy = {
  htmlLang: "en",
  doc: "Jinglo — A call from the North Pole for your little one",
  description: "Santa calls your little one by name. You pick the day and time and keep the recording and the certificate. One payment, no app, no subscription. Santa's voice is artificial intelligence.",
  santaAlt: "A kindly Santa talking on an old telephone.",
  heroAlt: "A small house on a snowy hill at night, one window glowing.",
  phoneAlt: "A red telephone ringing on the hallway table, snow falling outside the window.",
  tallerAlt: "The North Pole workshop at night, parcels on the shelves and a candlestick telephone on the bench.",
  famAlt: "A child in red pyjamas answers an old telephone in front of the Christmas tree while a parent looks on.",
  answer: "Answer",
  callFrom: "North Pole",
  callSubN: "calling for {n}…",
  callSub0: "incoming call…",
  h1_0: "This year, the North Pole is calling home.",
  h1_n: "There’s a call from the North Pole for {n}.",
  lead_0: "One evening in December, at the time you choose, your phone rings. It’s Santa, and he’s asking for your little one. All you have to do is be there to see their face.",
  lead_n: "One evening in December, at the time you choose, your phone rings. It’s Santa, and he’s asking for {n}. All you have to do is be there to see their face.",
  fieldL: "What’s your little one called?",
  fieldPh: "Type their name",
  fieldH: "Just so you can see how it would look.",
  cta_0: "Book the call · {price}",
  cta_n: "Book {n}’s call · {price}",
  ctaS: "Book the call · {price}",
  fine: "One payment. No app. No subscription. 7-day refund. Santa’s voice is generated with artificial intelligence.",
  listenT: "Pick up. This is what they’ll hear.",
  listenP: "Twenty-one seconds from a sample call. On yours, Santa says your little one’s name and whatever you’ve told him.",
  listenN: "Spanish-language sample; Santa’s voice is generated with artificial intelligence (not a person). An English voice is on its way. The FAQ explains how it works.",
  hang: "Pick up",
  hangOff: "Hang up",
  howT: "You set it up in two minutes. Santa takes it from there.",
  steps: [
    ["Tell us about your little one", "Their name, something Santa can mention (a drawing, a wobbly tooth, a bit of mischief) and the day and time that suit you. Two minutes, no account needed."],
    ["Your phone rings", "You answer, hear a short notice, press 1 and hand over the phone. The call lasts about five minutes."],
    ["Keep it for good", "As soon as it ends you get a link to the recording and the certificate. Download them and keep them."],
  ],
  tallerCap: "The other end of the line.",
  giftT: "A keepsake that outlasts Christmas.",
  giftQ: "In ten years you’ll want to hear that tiny voice answering the North Pole all over again.",
  gift: [
    ["The full recording", "of the call, as an MP3, to keep and send to the grandparents."],
    ["A Nice List certificate", "with their name, as a PDF, ready to print and frame."],
    ["And they’re yours", "because both arrive in one emailed link. Download them within 30 days."],
  ],
  cBy: "By order of the North Pole",
  cThat: "This certifies that",
  cName0: "your little one",
  cList: "is on the Nice List",
  cYear: `Christmas ${YEAR}`,
  cSig: "Santa",
  whoT: "For anyone who wants to be in the room when it rings.",
  who: [
    ["Mums and dads", "You hand over the phone and get the best seat in the house: their face. Afterwards, the recording gives you their voice too."],
    ["Grandparents", "Living far away? Book from wherever you are, tell us which number to ring and when, and the keepsake reaches you as well."],
    ["Godparents, aunties and uncles", "A gift that takes no room in the suitcase and gets retold every Christmas."],
  ],
  guarT: "If it doesn’t go as promised, you get your money back.",
  stamp: "days",
  guar: [
    ["If nobody answers", "We try twice inside the window you chose. If we can’t reach you, you get everything back automatically, no request needed."],
    ["If you change your mind", "You have 7 days to ask for a full refund from the link on your receipt. No questions."],
    ["If you want to stop", "Before it starts, a short notice asks you to press 1. Press 2 and the call doesn’t begin."],
  ],
  urgT: "Christmas Eve won’t wait.",
  urgTimer: "Time left to book",
  d: "days",
  h: "hours",
  m: "min",
  s: "sec",
  urgDone: "Booking has closed for this year. See you next Christmas.",
  urgLast: "Last day to book: {date}. Calls run until 24 December.",
  urgWhy: "Calls happen live and each two-hour slot has limited room. Leave it to the last minute and the time you want may be full.",
  priceT: "Book the call.",
  p1n: "One call",
  p1d: "Santa rings on the day and at the time you choose. Includes the recording and the certificate.",
  p2n: "Christmas Eve bundle",
  p2d: "Two calls: one whenever you like, and one on the night of the 24th.",
  soon: "Coming very soon.",
  priceN: "Before you pay you’ll be told, in plain words, that Santa’s voice is generated by artificial intelligence.",
  faqT: "What people ask before booking",
  faq: [
    ["Who is speaking on the call? Is it a real person?", "Not a person: it’s a voice generated with artificial intelligence, playing Santa. We tell you before you pay, in your confirmation email, and in a spoken notice you hear when you answer, before the call begins. With your little one, Santa speaks as Santa. Whether to explain it someday is up to you."],
    ["Is it safe for my child?", "You choose the number, day and time, and the call only happens inside that window, between 8:00 and 21:00 local time. An adult answers first and presses 1, then hands over the phone. Santa never asks for personal details or suggests talking outside the call, it lasts about five minutes, and you can hang up whenever you like."],
    ["What happens to my child’s data?", "We keep their first name, what you tell us and their voice during the call, only for this experience. It is never sold or used to train AI, and it’s deleted after 30 days."],
    ["What if my little one is shy, or says nothing?", "It happens a lot. Santa speaks slowly, asks simple questions and repeats them patiently. You can sit beside them and help them answer. If the silence goes on for a few seconds, Santa says a warm goodbye."],
    ["Is it a subscription? Do I need an app?", "No. One payment, no app, no subscription. Nothing renews."],
    ["What if nobody picks up?", "We try twice inside the window you chose. If we can’t reach you, you’re refunded automatically."],
    ["What if I change my mind?", "You have 7 days to ask for a full, automatic refund with no questions, from the link on your receipt."],
  ],
  by: "Jinglo, a Lumen Labs product.",
  legal: "The voices on the calls are generated with artificial intelligence.",
  lang: "Language",
  countryLabel: "Country",
  skip: "Skip to content",
};

/** Deep map of every string in the object (arrays and nested arrays included). */
function mapStrings<T>(o: T, f: (s: string) => string): T {
  if (typeof o === "string") return f(o) as unknown as T;
  if (Array.isArray(o)) return o.map((x) => mapStrings(x, f)) as unknown as T;
  if (o && typeof o === "object") {
    const r: Record<string, unknown> = {};
    for (const k of Object.keys(o)) r[k] = mapStrings((o as Record<string, unknown>)[k], f);
    return r as T;
  }
  return o;
}

function esEs(): LandingCopy {
  const c = mapStrings(ES, (s) => s.replace(/Santa/g, "Papá Noel").replace(/teléfono/g, "móvil"));
  return {
    ...c,
    htmlLang: "es-ES",
    description: "Papá Noel llama a tu peque por su nombre. Tú eliges el día y la hora y te quedas con la grabación y el certificado. Pago único, sin app y sin suscripción. La voz de Papá Noel es de inteligencia artificial.",
    h1_0: "Esta Navidad, el Polo Norte llama a casa.",
    lead_0: "Una tarde de diciembre, a la hora que tú elijas, suena tu móvil. Es Papá Noel, y pregunta por tu peque. Tú solo tienes que estar ahí para ver su cara.",
    lead_n: "Una tarde de diciembre, a la hora que tú elijas, suena tu móvil. Es Papá Noel, y pregunta por {n}. Tú solo tienes que estar ahí para ver su cara.",
    listenN: "Muestra en español de Latinoamérica con voz de Papá Noel generada con inteligencia artificial (no es una persona); la de España llegará con su propia voz. En las preguntas frecuentes te explicamos cómo funciona.",
    steps: [
      c.steps[0]!.map((x, i) => (i === 1 ? "Su nombre, algo que Papá Noel pueda mencionar (un dibujo, un diente que se mueve, una trastada) y el día y la hora que mejor te vengan. Dos minutos, sin crear cuenta." : x)) as [string, string],
      c.steps[1]!,
      c.steps[2]!,
    ],
    gift: [
      ["La grabación completa", "de la llamada, en MP3, para guardarla y enviársela a los abuelos."],
      c.gift[1]!,
      c.gift[2]!,
    ],
    who: [
      ["Papás y mamás", "Le pasas el móvil y te quedas con la mejor vista de la casa: su cara. Y después, con la grabación, también su voz."],
      ["Abuelos y abuelas", "¿Vivís lejos? Reservas desde donde estés, nos dices a qué número llamar y a qué hora, y el recuerdo te llega a ti también."],
      ["Padrinos y tíos", "Un regalo que no ocupa sitio en la maleta y que se contará cada Navidad."],
    ],
    guarT: "Si no sale como prometemos, te devolvemos tu dinero.",
    urgWhy: "Las llamadas se hacen en directo y cada franja de dos horas tiene un cupo limitado. Si dejas la reserva para el final, la hora que quieres puede estar completa.",
  };
}

function enFor(father: boolean, us: boolean): LandingCopy {
  let c: LandingCopy = EN;
  c = mapStrings(c, (s) => {
    let t = s;
    if (father) t = t.replace(/Santa’s/g, "Father Christmas’s").replace(/Santa/g, "Father Christmas");
    if (us) {
      t = t.replace(/Mums and dads/g, "Moms and dads").replace(/pyjamas/g, "pajamas").replace(/aunties and uncles/g, "aunts and uncles")
        .replace(/parcels/g, "packages").replace(/ring on the day/g, "call on the day").replace(/which number to ring/g, "which number to call")
        .replace(/your phone rings/g, "your phone rings").replace(/24 December/g, "December 24").replace(/Hallway/g, "Hallway");
    }
    return t;
  });
  return { ...c, htmlLang: us ? "en-US" : "en-GB" };
}

export function getLandingCopy(slug: Slug, country: CountryCode): LandingCopy {
  if (slug === "es") return ES;
  if (slug === "es-es") return esEs();
  return country === "US" ? enFor(false, true) : enFor(true, false);
}

/** "22 de diciembre" / "22 December" / "December 22" from an ISO date, formatted in UTC so the day never shifts. */
export function longDate(iso: string, intlLocale: string): string {
  return new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}
