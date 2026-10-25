import type { ColorearLang } from "@lumen/config";

/** All visible text of the colorear pages. Spanish is neutral Latin American (the ES variant differs only in the legal boxes). */
export interface ColorearCopy {
  htmlLang: string;
  siteTitle: string;
  siteDescription: string;
  nav: { privacy: string; terms: string; support: string; other: string };
  hero: { kicker: string; title: string; text: string; cta: string; price: (p: string) => string; badges: string[] };
  steps: { title: string; items: Array<{ t: string; d: string }> };
  samples: { title: string; text: string; caption: string; alts: string[] };
  privacy: { title: string; items: string[] };
  faq: { title: string; items: Array<{ q: string; a: string }> };
  form: {
    title: string; intro: string;
    /** `hint` takes the word for a phone ("celular", "móvil", "phone"). Nothing here talks about megabytes: the original photo can be of any size. */
    photos: { label: string; hint: (phone: string) => string; more: (n: number) => string; maxPer: (n: number) => string; preparing: string; preparingN: (at: number, of: number) => string; tooLarge: string; notImage: string; unreadable: string; heic: string };
    people: {
      name: string; role: string; protagonist: string; protagonistHint: string; companion: string; otherLabel: string; otherPh: string; remove: string;
      protagonistCard: string; card: (n: number) => string; photoAdd: string; photoAddMore: string; photoRequired: string; photoOptional: string; photoAlt: (who: string, n: number) => string;
      photosOf: (who: string) => string; photoRemove: (n: number, who: string) => string; photoRemoved: (n: number) => string;
      addCard: (next: number) => string; max: string; removed: (n: number) => string;
      missing: { photo: string; name: string; role: string; protagonistRole: string; join: (parts: string[]) => string };
    };
    bundle: { title: string; hint: string; one: { name: string; text: string }; trio: { name: string; badge: string; tagline: string; text: string }; anchor: (total: string) => string; firstTheme: string };
    /** The five detail levels (same order as AGE_LEVELS in config): the title is what the card shows, the text says what to expect. */
    age: { label: string; hint: string; levels: Array<{ title: string; text: string }>; sample: string; patternSample: string };
    theme: { label: string; hint: string; ph: string; own: string; picked: string };
    email: { label: string; hint: string };
    country: { label: string };
    aviso: string;
    consent: string;
    pay: (p: string) => string;
    paying: string;
    /** Optional test code (only shown when the server has codes configured). */
    code: { summary: string; label: string; hint: string; button: string; busy: string; closed: string };
    errors: Record<string, string>;
  };
  status: {
    pendingPay: { title: string; text: string };
    working: { title: (n: string) => string; text: string; stages: Record<string, string>; keep: string };
    ready: { title: (n: string) => string; text: string; download: string; expires: (d: string) => string; email: string; print: string; survey: string; loved: string; ok: string; bad: string; thanks: string; refund: string; refundDone: string; refundFail: string; again: string };
    more: {
      left: (n: number) => string; text: (date: string) => string; pick: string; create: string; creating: string; own: string; ph: string; error: string;
      showAll: string; expired: string; books: string; open: string; working: string; ready: string; all: string; failedCredit: { title: string; text: string }; adventure: (n: number) => string;
    };
    offer: { title: string; text: (price: string) => string; left: (h: number) => string; until: (d: string) => string; pay: (price: string) => string; paying: string; error: string; deleteDone: string };
    failed: { title: string; text: string };
    refunded: { title: string; text: string };
    gone: { title: string; text: string };
    notFound: string;
    test: string;
  };
  refundPage: { title: string; text: string; button: string; done: string; fail: string };
  /** Wording for an order that was never charged (test code or test payment): there is no payment to give back, so nothing says "refund". */
  noCharge: {
    refundPage: { title: string; text: string; button: string; done: string; fail: string };
    ready: { cancel: string; cancelDone: string; cancelFail: string };
    refunded: { title: string; text: string };
    failed: { title: string; text: string };
  };
  legalNote: string;
}

const ES: ColorearCopy = {
  htmlLang: "es",
  siteTitle: "Pintoria: tu familia para colorear",
  siteDescription: "Sube fotos de tu familia y recibe un libro para colorear de 24 páginas donde ellos son los protagonistas. De 3 a 12 años. Pago único.",
  nav: { privacy: "Privacidad", terms: "Términos", support: "Soporte", other: "English" },
  hero: {
    kicker: "Un libro para colorear con tu familia adentro",
    title: "Tu familia, en un libro para colorear",
    text: "Sube fotos de 1 a 5 personas o mascotas, cuéntanos cómo se llaman y creamos una aventura de 24 páginas en la que ellos son los protagonistas. Lista en minutos, para imprimir en casa.",
    cta: "Crear mi libro",
    price: (p) => `${p} una sola vez. Sin suscripción.`,
    badges: ["24 páginas", "De 3 a 12 años", "Fotos borradas en menos de 24 h"],
  },
  steps: {
    title: "Así funciona",
    items: [
      { t: "Sube las fotos", d: "De 1 a 5 personas o mascotas, con su nombre. Con varias fotos de cada una, el parecido mejora." },
      { t: "Elige la aventura", d: "Dinosaurios, espacio, castillos... Elige entre 24 temas o escribe el tuyo." },
      { t: "Recibe tu libro", d: "Dibujamos a tu familia en una historia de 22 escenas, con control de calidad en cada página. Te llega el PDF en pantalla y por correo, para imprimir cuantas veces quieras." },
    ],
  },
  samples: {
    title: "Así se ve un libro",
    text: "Ejemplos de estilo con personajes inventados. En tu libro, los protagonistas son tu familia.",
    caption: "Ilustraciones de ejemplo, no son personas reales. Ilustraciones e historia creadas con nuestro proceso propio de ilustración asistido por inteligencia artificial; pueden tener imperfecciones.",
    alts: ["Dibujo de ejemplo: una niña y su perro en el jardín", "Dibujo de ejemplo: una familia en un globo", "Dibujo de ejemplo: un niño y un dinosaurio"],
  },
  privacy: {
    title: "Las fotos de tu familia son tuyas",
    items: [
      "Las fotos se borran en cuanto los personajes están listos, y siempre antes de 24 horas.",
      "Nunca las usamos para entrenar modelos ni para reconocer a nadie.",
      "Los nombres se quedan en nuestros servidores. Los dibujos de los personajes se guardan 48 h (30 días en el Trío) solo para pedir otra aventura sin subir fotos; puedes borrarlos antes.",
      "El libro terminado se borra a los 30 días. Reembolso automático por 7 días.",
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      { q: "¿Cómo lo hacen?", a: "Detrás de cada libro hay un proceso con varias etapas: convertimos cada foto en un personaje de dibujo que se mantiene reconocible en las 24 páginas, escribimos una historia con principio, aventura y final pensada para la edad del niño, y cada página pasa por revisión automática de calidad (trazo limpio, sin color ni sombreados, apto para colorear) y se vuelve a dibujar si no la supera. Al final maquetamos todo en un PDF listo para imprimir en Carta o A4. Todo con privacidad por diseño: las fotos se borran en cuanto los personajes están listos, siempre antes de 24 horas. Las ilustraciones y la historia se crean con nuestro proceso propio asistido por inteligencia artificial y pueden tener imperfecciones." },
      { q: "¿Para qué edades es?", a: "Para niños de 3 a 12 años. Al crear el libro eliges el nivel de detalle según la edad de quien va a colorear: de contornos muy gruesos y figuras grandes (3 a 4 años) a escenas con líneas más finas y muchos detalles (9 a 12 años)." },
      { q: "¿Cuánto tarda?", a: "Normalmente entre 5 y 15 minutos. Verás cómo van apareciendo los personajes y las páginas, y te lo enviamos por correo." },
      { q: "¿Qué fotos funcionan mejor?", a: "Fotos claras, con buena luz y la cara visible, de una sola persona o mascota en cada foto. Si subes varias de la misma persona (de frente, de perfil, sonriendo), el parecido mejora. Puedes subir fotos o capturas de tu teléfono, de cualquier tamaño: las reducimos en tu dispositivo antes de enviarlas." },
      { q: "¿Qué pasa con las fotos?", a: "Se usan solo para generar los dibujos de tu libro y se borran en cuanto están listos, siempre antes de 24 horas. Nunca se usan para entrenar modelos. Los dibujos de los personajes (no las fotos) se guardan solo para que puedas pedir otra aventura sin subir fotos: 48 horas después de la entrega, o hasta 30 días si compras el Trío; puedes borrarlos antes. El libro terminado se guarda 30 días para que puedas volver a descargarlo, y luego se borra." },
      { q: "¿Qué es el Trío?", a: "Tres aventuras con un solo pago, por menos que el precio de dos libros sueltos. Eliges la primera al comprar; las otras dos las pides después desde la página de entrega, con un clic y sin subir fotos, hasta 30 días después de recibir la primera." },
      { q: "¿Y si no me gusta el resultado?", a: "Reembolso completo y automático hasta 7 días después de recibirlo, desde el enlace de tu recibo. Sin preguntas." },
      { q: "¿Es una suscripción?", a: "No. Es un pago único por libro." },
      { q: "¿Los dibujos son de personajes de películas?", a: "No. Los personajes son tu familia y la aventura es original. No usamos marcas ni personajes con derechos de autor." },
    ],
  },
  form: {
    title: "Crea tu libro",
    intro: "Tarda unos 2 minutos. Pagas al final y el libro empieza a hacerse al instante.",
    photos: {
      label: "Fotos y nombres (de 1 a 5 personas)",
      hint: (phone) => `Empieza con quien protagoniza el libro. Después puedes agregar hasta 4 personas o mascotas más. Cada foto, de una sola persona o mascota, con la cara visible. Puedes subir fotos o capturas de tu ${phone}, de cualquier tamaño.`,
      more: (n) => `Añade hasta ${n} fotos: más ángulos = más parecido.`,
      maxPer: (n) => `Máximo ${n} fotos por persona.`,
      preparing: "Preparando las fotos...",
      preparingN: (at, of) => `Preparando las fotos (${at} de ${of})...`,
      tooLarge: "Ese archivo es demasiado grande para abrirlo aquí. Haz una captura de pantalla de la foto y sube la captura.",
      notImage: "Eso no parece una foto. Elige una foto o una captura de tu teléfono.",
      unreadable: "No pudimos abrir esa foto. Prueba con otra, o haz una captura de pantalla de la foto y sube la captura.",
      heic: "Esa foto está en un formato que este navegador no puede abrir (HEIC) y no pudimos convertirla. Haz una captura de pantalla de la foto y sube la captura, o envíatela por mensaje para convertirla a JPG.",
    },
    people: {
      name: "Nombre",
      role: "Quién es",
      protagonist: "Protagonista del libro",
      protagonistHint: "Usamos el nivel de detalle que elijas más abajo.",
      companion: "Quién es para el protagonista",
      otherLabel: "Cuéntanos quién es (opcional)",
      otherPh: "vecina, maestro...",
      remove: "Quitar",
      protagonistCard: "Protagonista",
      card: (n) => `Persona ${n}`,
      photoAdd: "Subir foto",
      photoAddMore: "Otra foto",
      photoRequired: "Obligatoria",
      photoOptional: "Opcional",
      photoAlt: (who, n) => `Foto ${n} de ${who}`,
      photosOf: (who) => `Fotos de ${who}`,
      photoRemove: (n, who) => `Quitar la foto ${n} de ${who}`,
      photoRemoved: (n) => `Foto ${n} quitada.`,
      addCard: (next) => `+ Agregar otra persona o mascota (${next} de 5)`,
      max: "Máximo 5",
      removed: (n) => `Persona ${n} quitada.`,
      missing: {
        photo: "la foto", name: "el nombre", role: "quién es", protagonistRole: "Niña o Niño",
        join: (parts) => `Falta ${parts.length > 1 ? parts.slice(0, -1).join(", ") + " y " + parts[parts.length - 1] : parts[0]}.`,
      },
    },
    age: {
      label: "Nivel de detalle: ¿qué edad tiene quien va a colorear?",
      hint: "Elige la opción que más se parezca a quien va a colorear. Cambia lo fino de las líneas y cuántos detalles tiene cada dibujo.",
      levels: [
        { title: "3 a 4 años", text: "Contornos muy gruesos, figuras grandes, casi sin fondo." },
        { title: "5 a 6 años", text: "Contornos gruesos, figuras sencillas y unos pocos elementos de fondo." },
        { title: "7 a 8 años", text: "Más detalle: fondos con nubes, plantas y ladrillos, patrones sencillos en la ropa y zonas medianas para lápices de color." },
        { title: "9 a 12 años", text: "Escenas ricas, con líneas más finas, texturas y patrones, y muchas zonas medianas y pequeñas." },
        { title: "Adultos: relajante, estilo mandala", text: "Muy detallado. Los personajes se reconocen y el fondo y la ropa se llenan de patrones tipo mandala, con líneas finas y limpias." },
      ],
      sample: "Dibujo de ejemplo del estilo del libro",
      patternSample: "Muestra del tipo de patrón de este nivel, no es una página del libro",
    },
    theme: { label: "Elige la aventura", hint: "Toda la historia gira en torno a este tema. Si no eliges ninguno, te sorprendemos.", ph: "dinosaurios, mi ciudad, el cumpleaños de Sofía...", own: "O escribe la tuya", picked: "Elegida" },
    bundle: {
      title: "Elige cuántas aventuras",
      hint: "Pago único. El libro de cada aventura tiene 24 páginas.",
      one: { name: "1 aventura", text: "Un libro de 24 páginas con la aventura que elijas." },
      trio: { name: "Trío", badge: "Mejor valor", tagline: "3 por menos que el precio de 2", text: "3 aventuras con los mismos personajes. Eliges la primera ahora y las otras 2 después, con un clic y sin subir fotos." },
      anchor: (t) => `3 aventuras sueltas: ${t}`,
      firstTheme: "Elige la primera aventura",
    },
    email: { label: "¿A dónde te enviamos el libro?", hint: "Tu correo. Ahí llegan el libro y el recibo." },
    country: { label: "País" },
    aviso: "Aviso para madres, padres y tutores",
    consent: "Confirmo cada punto",
    pay: (p) => `Pagar ${p} y crear el libro`,
    paying: "Preparando el pago...",
    code: {
      summary: "¿Tienes un código?",
      label: "Código",
      hint: "Si te dieron un código de prueba, escríbelo aquí. Con un código válido no se cobra nada.",
      button: "Usar mi código y crear el libro",
      busy: "Creando tu pedido...",
      closed: "Por ahora Pintoria solo está abierta con código de invitación. Escribe tu código para continuar.",
    },
    errors: {
      persons: "Completa las tarjetas marcadas: cada una necesita foto, nombre y quién es. Si no quieres agregar a alguien, usa Quitar.",
      photos: "Sube la foto del protagonista.",
      theme: "Ese tema no se puede usar. Prueba con otro.",
      email: "Revisa tu correo.",
      age: "Elige un nivel de detalle.",
      consent: "Necesitamos que confirmes todos los puntos.",
      country: "Elige un país.",
      rate: "Demasiados intentos. Espera un minuto.",
      legal_not_ready: "Estamos terminando los textos legales. Vuelve pronto.",
      server: "Algo falló de nuestro lado. No se cobró nada. Intenta de nuevo.",
      generic: "No pudimos continuar. Intenta de nuevo.",
      unreadable: "No pudimos leer una de las fotos. Prueba con otra.",
      code_invalid: "Ese código no es válido. Revísalo e inténtalo de nuevo.",
      code_exhausted: "Ese código ya se agotó. Pide uno nuevo.",
      code_required: "Por ahora Pintoria solo está abierta con código de invitación. Escribe tu código para continuar.",
      code_left_1: "A ese código solo le queda 1 libro y el Trío son 3. Elige 1 aventura o pide un código nuevo.",
      code_left_2: "A ese código solo le quedan 2 libros y el Trío son 3. Elige 1 aventura o pide un código nuevo.",
      code_rate: "Demasiados intentos con códigos. Espera unos minutos.",
    },
  },
  status: {
    pendingPay: { title: "Esperando la confirmación del pago", text: "Esto toma unos segundos." },
    working: {
      title: (n) => `Estamos creando el libro de ${n}`,
      text: "Puedes dejar esta página abierta: te avisamos por correo cuando esté listo.",
      stages: { queued: "En fila", characters: "Dibujando a los personajes", story: "Escribiendo la historia", pages: "Dibujando las páginas", assemble: "Armando el PDF", done: "Listo" },
      keep: "Las fotos ya se borran solas en cuanto los personajes están listos.",
    },
    ready: {
      title: (n) => `El libro de ${n} está listo`,
      text: "24 páginas para imprimir y colorear. Imprime en tamaño carta o A4 al 100 %.",
      download: "Descargar el PDF",
      expires: (d) => `Puedes descargarlo hasta el ${d}. Después lo borramos.`,
      email: "También te lo enviamos por correo.",
      print: "Consejo: imprime en papel un poco grueso y usa crayones o colores de madera.",
      survey: "¿Qué tal salió?",
      loved: "Me encantó",
      ok: "Más o menos",
      bad: "No me gustó",
      thanks: "¡Gracias!",
      refund: "Pedir reembolso",
      refundDone: "Reembolso hecho. Te llegará un correo.",
      refundFail: "No pudimos reembolsar desde aquí. Escríbenos y lo resolvemos.",
      again: "Hacer otro libro",
    },
    more: {
      left: (n) => (n === 1 ? "Te queda 1 aventura" : `Te quedan ${n} aventuras`),
      text: (d) => `Elige la siguiente: usamos los mismos personajes y no tienes que subir fotos. No cuesta nada más. Caducan el ${d}.`,
      pick: "Elige la aventura", create: "Crear esta aventura", creating: "Preparando...", own: "O escribe la tuya", ph: "dinosaurios, mi ciudad...", error: "No pudimos crear la aventura. Prueba con otro tema.",
      showAll: "Ver todos los temas", expired: "Las aventuras sin usar de tu Trío ya caducaron.", books: "Tus aventuras", open: "Abrir", working: "Creándose", ready: "Lista", all: "Ver todas mis aventuras",
      failedCredit: { title: "No pudimos terminar esta aventura", text: "No se descontó de tu Trío: sigue disponible para que elijas otra." },
      adventure: (n) => `Aventura ${n}`,
    },
    offer: {
      title: "Otra aventura con los mismos personajes",
      text: (p) => `Por ${p}, sin subir fotos otra vez. Es una compra aparte.`,
      left: (h) => (h <= 1 ? "Queda menos de 1 hora" : `Quedan ${h} horas`),
      until: (d) => `Oferta válida hasta el ${d}`,
      pay: (p) => `Pagar ${p} y crear la aventura`, paying: "Preparando el pago...", error: "No pudimos continuar. La oferta pudo haber terminado.", deleteDone: "Listo.",
    },
    failed: { title: "No pudimos terminar el libro", text: "Te devolvemos el dinero automáticamente. Te avisamos por correo." },
    refunded: { title: "Pedido reembolsado", text: "Ya devolvimos el pago y borramos tus fotos, los dibujos de los personajes y el libro." },
    gone: { title: "Este libro ya no está disponible", text: "Borramos los libros a los 30 días para cuidar tu privacidad." },
    notFound: "No encontramos este pedido.",
    test: "Modo de prueba: no se cobró nada.",
  },
  noCharge: {
    refundPage: { title: "Cancelar pedido", text: "Este pedido no tuvo cobro. Si lo cancelas, borramos el libro y las fotos.", button: "Cancelar y borrar mi pedido", done: "Listo, cancelamos tu pedido y borramos el libro y las fotos.", fail: "No fue posible cancelar desde aquí (pasaron más de 7 días o ya se canceló)." },
    ready: { cancel: "Cancelar y borrar mi pedido", cancelDone: "Listo, cancelamos tu pedido. Te llegará un correo.", cancelFail: "No pudimos cancelar desde aquí. Escríbenos y lo resolvemos." },
    refunded: { title: "Pedido cancelado", text: "Borramos tus fotos, los dibujos de los personajes y el libro. No se cobró nada." },
    failed: { title: "No pudimos terminar el libro", text: "No se cobró nada. Te avisamos por correo." },
  },
  refundPage: { title: "Reembolso", text: "Devolvemos todo el pago, sin preguntas, y borramos el libro y las fotos.", button: "Reembolsar mi pedido", done: "Listo, te devolvimos el pago.", fail: "No fue posible reembolsar desde aquí (pasaron más de 7 días o ya se reembolsó)." },
  legalNote: "Pendiente de revisión legal final antes de cobrar de verdad.",
};

const EN: ColorearCopy = {
  htmlLang: "en",
  siteTitle: "Pintoria: your family to color",
  siteDescription: "Upload photos of your family and get a 24-page coloring book where they are the heroes. Ages 3 to 12. One-time payment.",
  nav: { privacy: "Privacy", terms: "Terms", support: "Support", other: "Español" },
  hero: {
    kicker: "A coloring book with your family inside",
    title: "Your family, in a coloring book",
    text: "Upload photos of 1 to 5 people or pets, tell us their names, and we create a 24-page adventure starring them. Ready in minutes, to print at home.",
    cta: "Create my book",
    price: (p) => `${p} one time. No subscription.`,
    badges: ["24 pages", "Ages 3 to 12", "Photos deleted within 24 h"],
  },
  steps: {
    title: "How it works",
    items: [
      { t: "Upload the photos", d: "1 to 5 people or pets, with a name for each. With several photos of each one, the likeness gets closer." },
      { t: "Choose the adventure", d: "Dinosaurs, space, castles... Pick one of 24 themes or write your own." },
      { t: "Get your book", d: "We draw your family into a 22-scene story, with quality control on every page. The PDF arrives on screen and by email, ready to print as often as you like." },
    ],
  },
  samples: {
    title: "What a book looks like",
    text: "Style examples with made-up characters. In your book, the heroes are your family.",
    caption: "Example illustrations, not real people. Illustrations and story created with our own illustration process assisted by artificial intelligence; they may have imperfections.",
    alts: ["Example drawing: a girl and her dog in the garden", "Example drawing: a family in a balloon", "Example drawing: a boy and a dinosaur"],
  },
  privacy: {
    title: "Your family photos are yours",
    items: [
      "Photos are deleted as soon as the characters are ready, and always within 24 hours.",
      "We never use them to train models or to recognize anyone.",
      "Names stay on our servers. The character drawings are kept 48 h (30 days with the Trio) only to order another adventure without uploading photos; you can delete them sooner.",
      "The finished book is deleted after 30 days. Automatic refund for 7 days.",
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      { q: "How does it work?", a: "Behind every book is a multi-stage process: we turn each photo into a cartoon character that stays recognizable across all 24 pages, write a story with a beginning, an adventure and an ending suited to the child's age, and every page goes through automatic quality review (clean linework, no color or shading, ready to color) and is redrawn if it does not pass. Finally we lay everything out as a print-ready PDF for Letter or A4. Privacy by design throughout: photos are deleted as soon as the characters are ready, always within 24 hours. The illustrations and the story are created with our own illustration process assisted by artificial intelligence and may have imperfections." },
      { q: "Which ages is it for?", a: "Ages 3 to 12. When you create the book you choose the level of detail by the age of whoever will color: from very thick outlines and big shapes (ages 3 to 4) to scenes with finer lines and lots of detail (ages 9 to 12)." },
      { q: "How long does it take?", a: "Usually 5 to 15 minutes. You will see the characters and pages appear, and we also email it to you." },
      { q: "Which photos work best?", a: "Clear photos with good light and the face visible, with only one person or pet in each photo. If you upload several of the same person (facing the camera, in profile, smiling), the likeness gets closer. You can upload phone photos or screenshots, any size: we shrink them on your device before sending." },
      { q: "What happens to the photos?", a: "They are used only to create the drawings for your book and are deleted as soon as they are ready, always within 24 hours. They are never used to train models. The drawings of the characters (not the photos) are kept only so you can order another adventure without uploading photos: 48 hours after delivery, or up to 30 days if you buy the Trio; you can delete them sooner. The finished book is kept 30 days so you can download it again, then deleted." },
      { q: "What is the Trio?", a: "Three adventures for one payment, for less than the price of two single books. You choose the first when you buy; you order the other two later from your delivery page, with one click and no new photos, up to 30 days after you receive the first." },
      { q: "What if I do not like it?", a: "Full automatic refund up to 7 days after you receive it, from the link in your receipt. No questions asked." },
      { q: "Is it a subscription?", a: "No. It is a one-time payment per book." },
      { q: "Are the drawings of movie characters?", a: "No. The characters are your family and the adventure is original. We do not use brands or copyrighted characters." },
    ],
  },
  form: {
    title: "Create your book",
    intro: "It takes about 2 minutes. You pay at the end and the book starts right away.",
    photos: {
      label: "Photos and names (1 to 5 people)",
      hint: (phone) => `Start with the main character of the book. Then you can add up to 4 more people or pets. Each photo shows only one person or pet, face visible. You can upload ${phone} photos or screenshots, any size.`,
      more: (n) => `Add up to ${n} photos: more angles = a closer likeness.`,
      maxPer: (n) => `Up to ${n} photos per person.`,
      preparing: "Preparing the photos...",
      preparingN: (at, of) => `Preparing the photos (${at} of ${of})...`,
      tooLarge: "That file is too big to open here. Take a screenshot of the photo and upload the screenshot.",
      notImage: "That does not look like a photo. Choose a photo or a screenshot from your phone.",
      unreadable: "We could not open that photo. Try another one, or take a screenshot of it and upload the screenshot.",
      heic: "That photo is in a format this browser cannot open (HEIC) and we could not convert it. Take a screenshot of the photo and upload that, or message the photo to yourself to convert it to JPG.",
    },
    people: {
      name: "Name",
      role: "Who they are",
      protagonist: "Main character of the book",
      protagonistHint: "We use the level of detail you choose below.",
      companion: "Who they are to the main character",
      otherLabel: "Tell us who they are (optional)",
      otherPh: "neighbor, teacher...",
      remove: "Remove",
      protagonistCard: "Main character",
      card: (n) => `Person ${n}`,
      photoAdd: "Add photo",
      photoAddMore: "Another photo",
      photoRequired: "Required",
      photoOptional: "Optional",
      photoAlt: (who, n) => `Photo ${n} of ${who}`,
      photosOf: (who) => `Photos of ${who}`,
      photoRemove: (n, who) => `Remove photo ${n} of ${who}`,
      photoRemoved: (n) => `Photo ${n} removed.`,
      addCard: (next) => `+ Add another person or pet (${next} of 5)`,
      max: "Maximum 5",
      removed: (n) => `Person ${n} removed.`,
      missing: {
        photo: "the photo", name: "the name", role: "who they are", protagonistRole: "Girl or Boy",
        join: (parts) => `Missing ${parts.length > 1 ? parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1] : parts[0]}.`,
      },
    },
    age: {
      label: "Level of detail: how old is the child who will color?",
      hint: "Choose the option closest to the person who will color. It changes how fine the lines are and how much detail each drawing has.",
      levels: [
        { title: "Ages 3 to 4", text: "Very thick outlines, big shapes, almost no background." },
        { title: "Ages 5 to 6", text: "Thick outlines, simple shapes and a few background elements." },
        { title: "Ages 7 to 8", text: "More detail: backgrounds with clouds, plants and bricks, simple patterns on clothes and medium areas for colored pencils." },
        { title: "Ages 9 to 12", text: "Rich scenes with finer lines, textures and patterns, and many medium and small areas." },
        { title: "Adults: relaxing, mandala style", text: "Very detailed. The characters stay recognizable and the background and clothes fill with mandala-style patterns, in fine, clean lines." },
      ],
      sample: "Example drawing in the style of the book",
      patternSample: "Sample of the kind of pattern of this level, not a page of the book",
    },
    theme: { label: "Choose the adventure", hint: "The whole story is built around this theme. If you pick none, we surprise you.", ph: "dinosaurs, my city, Sofia's birthday...", own: "Or write your own", picked: "Selected" },
    bundle: {
      title: "Choose how many adventures",
      hint: "One-time payment. Each adventure is a 24-page book.",
      one: { name: "1 adventure", text: "One 24-page book with the adventure you choose." },
      trio: { name: "Trio", badge: "Best value", tagline: "3 for less than the price of 2", text: "3 adventures with the same characters. Pick the first now and the other 2 later, with one click and no new photos." },
      anchor: (t) => `3 single adventures: ${t}`,
      firstTheme: "Choose the first adventure",
    },
    email: { label: "Where should we send the book?", hint: "Your email. The book and the receipt arrive there." },
    country: { label: "Country" },
    aviso: "Notice to parents and guardians",
    consent: "I confirm each point",
    pay: (p) => `Pay ${p} and create the book`,
    paying: "Preparing payment...",
    code: {
      summary: "Have a code?",
      label: "Code",
      hint: "If you were given a test code, enter it here. A valid code means no charge.",
      button: "Use my code and create the book",
      busy: "Creating your order...",
      closed: "For now Pintoria is open by invitation code only. Enter your code to continue.",
    },
    errors: {
      persons: "Complete the marked cards: each needs a photo, a name and who they are. If you do not want to add someone, use Remove.",
      photos: "Add the main character's photo.",
      theme: "That theme cannot be used. Try another one.",
      email: "Check your email address.",
      age: "Choose a level of detail.",
      consent: "We need you to confirm every point.",
      country: "Choose a country.",
      rate: "Too many attempts. Wait a minute.",
      legal_not_ready: "We are finishing the legal texts. Come back soon.",
      server: "Something failed on our side. You were not charged. Try again.",
      generic: "We could not continue. Try again.",
      unreadable: "We could not read one of the photos. Try another one.",
      code_invalid: "That code is not valid. Check it and try again.",
      code_exhausted: "That code has run out. Ask for a new one.",
      code_required: "For now Pintoria is open by invitation code only. Enter your code to continue.",
      code_left_1: "That code has only 1 book left and the Trio is 3. Choose 1 adventure or ask for a new code.",
      code_left_2: "That code has only 2 books left and the Trio is 3. Choose 1 adventure or ask for a new code.",
      code_rate: "Too many code attempts. Wait a few minutes.",
    },
  },
  status: {
    pendingPay: { title: "Waiting for the payment confirmation", text: "This takes a few seconds." },
    working: {
      title: (n) => `We are creating ${n}'s book`,
      text: "You can leave this page open: we will email you when it is ready.",
      stages: { queued: "In line", characters: "Drawing the characters", story: "Writing the story", pages: "Drawing the pages", assemble: "Building the PDF", done: "Done" },
      keep: "Photos already delete themselves as soon as the characters are ready.",
    },
    ready: {
      title: (n) => `${n}'s book is ready`,
      text: "24 pages to print and color. Print at Letter or A4 size at 100 %.",
      download: "Download the PDF",
      expires: (d) => `You can download it until ${d}. After that we delete it.`,
      email: "We also emailed it to you.",
      print: "Tip: print on slightly thick paper and use crayons or colored pencils.",
      survey: "How did it turn out?",
      loved: "Loved it",
      ok: "So-so",
      bad: "Did not like it",
      thanks: "Thank you!",
      refund: "Request a refund",
      refundDone: "Refund done. You will get an email.",
      refundFail: "We could not refund from here. Write to us and we will fix it.",
      again: "Make another book",
    },
    more: {
      left: (n) => (n === 1 ? "You have 1 adventure left" : `You have ${n} adventures left`),
      text: (d) => `Pick the next one: we use the same characters and you do not upload photos. It costs nothing more. They expire on ${d}.`,
      pick: "Choose the adventure", create: "Create this adventure", creating: "Preparing...", own: "Or write your own", ph: "dinosaurs, my city...", error: "We could not create the adventure. Try another theme.",
      showAll: "See all themes", expired: "The unused adventures of your Trio have expired.", books: "Your adventures", open: "Open", working: "Being created", ready: "Ready", all: "See all my adventures",
      failedCredit: { title: "We could not finish this adventure", text: "It was not deducted from your Trio: it is still available so you can pick another one." },
      adventure: (n) => `Adventure ${n}`,
    },
    offer: {
      title: "Another adventure with the same characters",
      text: (p) => `For ${p}, no need to upload photos again. It is a separate purchase.`,
      left: (h) => (h <= 1 ? "Less than 1 hour left" : `${h} hours left`),
      until: (d) => `Offer valid until ${d}`,
      pay: (p) => `Pay ${p} and create the adventure`, paying: "Preparing payment...", error: "We could not continue. The offer may have ended.", deleteDone: "Done.",
    },
    failed: { title: "We could not finish the book", text: "We refund you automatically. We will email you." },
    refunded: { title: "Order refunded", text: "We returned the payment and deleted your photos, the character drawings and the book." },
    gone: { title: "This book is no longer available", text: "We delete books after 30 days to protect your privacy." },
    notFound: "We could not find this order.",
    test: "Test mode: nothing was charged.",
  },
  noCharge: {
    refundPage: { title: "Cancel order", text: "This order was not charged. If you cancel it, we delete the book and the photos.", button: "Cancel and delete my order", done: "Done, we cancelled your order and deleted the book and the photos.", fail: "We cannot cancel from here (more than 7 days passed or it was already cancelled)." },
    ready: { cancel: "Cancel and delete my order", cancelDone: "Done, we cancelled your order. You will get an email.", cancelFail: "We could not cancel from here. Write to us and we will fix it." },
    refunded: { title: "Order cancelled", text: "We deleted your photos, the character drawings and the book. You were not charged." },
    failed: { title: "We could not finish the book", text: "You were not charged. We will email you." },
  },
  refundPage: { title: "Refund", text: "We return the whole payment, no questions asked, and delete the book and photos.", button: "Refund my order", done: "Done, we returned your payment.", fail: "A refund is not possible from here (more than 7 days passed or it was already refunded)." },
  legalNote: "Pending final legal review before real charges.",
};

export const COLOREAR_COPY: Record<ColorearLang, ColorearCopy> = { es: ES, en: EN };
