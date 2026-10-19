import type { ExperimentId } from "@lumen/analytics";
import type { LandingCopy } from "./landing-copy";

/**
 * Landing variants for the phase-1 marketing experiments (D24, docs/marketing/experimentos-fase1.md).
 * Applied on top of the default es-MX copy when the URL has ?exp=e1|e2|e3 (only /es with country MX; everywhere else
 * `?exp` is ignored for copy and still tags analytics). The default page is untouched when there is no ?exp.
 * Rules: no promise of gifts, no invented reviews, no real children, the AI disclosure stays in `fine` and the FAQ.
 * Legal text of the checkout is NOT overridden here. Price stays MX$199 (single) in every variant.
 */
export interface ExpContext {
  /** The two-call package is on sale (BUNDLE_ENABLED=1). */
  bundle: boolean;
  price: string;
  price2: string;
  /** Two single calls bought separately, e.g. "MX$398". */
  twoSingles: string;
  /** Formatted saving of the package vs two single calls, e.g. "MX$49". */
  save: string;
}

export interface ExpVariant {
  copy: Partial<LandingCopy>;
  /** Hero illustration override (served from /public). */
  hero?: { src: string; alt: string; position?: string };
  /** The primary button buys the package (only when it is on sale). */
  heroBundle?: boolean;
}

export function expVariant(exp: ExperimentId | null, ctx: ExpContext, base: LandingCopy): ExpVariant | null {
  switch (exp) {
    case "e1":
      return {
        copy: {
          h1_0: "Su cara cuando Santa pregunte por su nombre.",
          h1_n: "Su cara cuando Santa pregunte por {n}.",
          lead_0: "Un día de diciembre, a la hora que tú elijas, suena tu teléfono y es Santa preguntando por tu peque. Tú solo tienes que estar ahí. Esa cara no se repite.",
          lead_n: "Un día de diciembre, a la hora que tú elijas, suena tu teléfono y es Santa preguntando por {n}. Tú solo tienes que estar ahí. Esa cara no se repite.",
        },
      };
    case "e2":
      return {
        copy: {
          h1_0: "Lejos de casa, pero en su Navidad.",
          h1_n: "Lejos de casa, pero en la Navidad de {n}.",
          lead_0: "Santa llama a tu casa por el nombre de tu peque, el día y la hora que tú elijas, y quien esté con él o ella le pasa el teléfono. Tú te quedas con la grabación para escucharla cuando quieras.",
          lead_n: "Santa llama a tu casa por el nombre de {n}, el día y la hora que tú elijas, y quien esté con él o ella le pasa el teléfono. Tú te quedas con la grabación para escucharla cuando quieras.",
          howT: "Lo reservas desde donde estés. Santa llama a casa.",
          steps: [
            ["Dinos a qué número llamar", "El de tu casa o el de quien cuide a tu peque (esa persona debe saber de la llamada y estar de acuerdo), su nombre y el día y la hora. Dos minutos, sin crear cuenta."],
            ["Suena el teléfono en casa", "Quien conteste escucha un aviso corto y pulsa 1; después le pasa el teléfono a tu peque. Si quieres, pídele que te ponga en videollamada mientras contesta."],
            ["La grabación te llega a ti", "Apenas termina, el enlace con la grabación y el certificado llega a tu correo. Escúchala cuando quieras y compártela con la familia."],
          ],
          giftT: "Lo que te llevas aunque no estuvieras en la sala.",
          giftQ: "Aunque no estés ahí, vas a poder escuchar su voz contestándole al Polo Norte.",
          gift: [
            ["La grabación completa", "llega a tu correo, en MP3, para escucharla cuando quieras y mandársela a quien tú quieras."],
            ["El certificado de la Lista de los Buenos", "con su nombre, en PDF, para imprimir o mandar por WhatsApp."],
            ["Y son tuyos", "porque te llegan en un enlace por correo. Descárgalos dentro de los 30 días siguientes."],
          ],
          whoT: "Para los que quisieran estar en la sala y no pueden.",
          who: [
            ["Mamás y papás que trabajan lejos", "Reservas desde donde estés y la llamada suena en la casa de tu peque. La grabación te llega a ti."],
            ["Familias en dos casas", "Una llamada que puede ser tuya aunque la noche del 24 no te toque con tu peque."],
            ["Quien se queda en casa", "Es quien contesta y le pasa el teléfono. Solo necesita saber que va a sonar y pulsar 1."],
          ],
          faq: [
            ["Yo no estoy en casa: ¿quién contesta?", "Quien tú nos indiques: el número de tu casa o el de la persona que cuida a tu peque, que debe saber de la llamada y estar de acuerdo. Esa persona escucha el aviso, pulsa 1 y le pasa el teléfono. Tú recibes la grabación por correo."],
            ...base.faq,
          ],
        },
        hero: { src: "/jinglo/exp/lejos.webp", alt: "Un adulto en su cocina, de noche en una ciudad lejos, mira su teléfono con una sonrisa; una línea de lucecitas cruza la ventana rumbo a una casa lejana.", position: "40% 40%" },
      };
    case "e3": {
      const b = ctx.bundle;
      return {
        copy: {
          h1_0: "Guarda la voz de Santa y la de tu peque.",
          h1_n: "Guarda la voz de {n} hablando con Santa.",
          lead_0: b
            ? "Dos llamadas del Polo Norte, una cuando tú quieras y otra en Nochebuena, con su grabación y su certificado. Para volver a escucharlas dentro de diez años."
            : "Una llamada del Polo Norte con su grabación y su certificado, para volver a escucharla dentro de diez años. Tú eliges el día y la hora.",
          lead_n: b
            ? "Dos llamadas del Polo Norte para {n}, una cuando tú quieras y otra en Nochebuena, con su grabación y su certificado. Para volver a escucharlas dentro de diez años."
            : "Una llamada del Polo Norte para {n} con su grabación y su certificado, para volver a escucharla dentro de diez años. Tú eliges el día y la hora.",
          cta_0: "Guardar el recuerdo · {price}",
          cta_n: "Guardar el recuerdo de {n} · {price}",
          ctaS: "Guardar el recuerdo · {price}",
          steps: [
            base.steps[0]!,
            base.steps[1]!,
            ["La descargas y es tuya", "Apenas termina te llega un enlace con la grabación y el certificado. Descárgalos dentro de los 30 días siguientes y guárdalos donde quieras."],
          ],
          giftT: "Lo que te queda cuando se acaba la Navidad.",
          whoT: "Para las que guardan todo.",
          who: [
            ["Mamás que guardan recuerdos", "El primer dibujo, el primer diente, la primera carta a Santa. Esta es su voz de este año."],
            ["Familias con álbum, caja de recuerdos o grupo de WhatsApp", "La grabación se guarda y se manda; el certificado se imprime y se enmarca."],
            ["Para dentro de diez años", "Los peques cambian rápido. La voz de hoy no vuelve."],
          ],
          ...(b ? { p1n: "Una llamada", p2n: "Paquete de Nochebuena", p2d: `Dos llamadas: una cuando tú quieras y otra la noche del 24. Por separado serían ${ctx.twoSingles}: ahorras ${ctx.save}.` } : {}),
        },
        heroBundle: b,
      };
    }
    default:
      return null;
  }
}
