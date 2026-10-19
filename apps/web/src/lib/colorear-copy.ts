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
    photos: { label: string; hint: string; add: string; remove: string; tooLarge: string; tooMany: string; badType: string; heic: string; count: (n: number) => string };
    people: { label: string; hint: string; name: string; role: string; rolePh: string; add: string; remove: string; roleSuggestions: string[] };
    age: { label: string; hint: string };
    theme: { label: string; hint: string; ph: string; own: string; picked: string };
    email: { label: string; hint: string };
    country: { label: string };
    aviso: string;
    consent: string;
    pay: (p: string) => string;
    paying: string;
    errors: Record<string, string>;
  };
  status: {
    pendingPay: { title: string; text: string };
    working: { title: (n: string) => string; text: string; stages: Record<string, string>; keep: string };
    ready: { title: (n: string) => string; text: string; download: string; expires: (d: string) => string; email: string; print: string; survey: string; loved: string; ok: string; bad: string; thanks: string; refund: string; refundDone: string; refundFail: string; again: string };
    failed: { title: string; text: string };
    refunded: { title: string; text: string };
    gone: { title: string; text: string };
    notFound: string;
    test: string;
  };
  refundPage: { title: string; text: string; button: string; done: string; fail: string };
  legalNote: string;
}

const ES: ColorearCopy = {
  htmlLang: "es",
  siteTitle: "Colorfam: tu familia para colorear",
  siteDescription: "Sube fotos de tu familia y recibe un libro para colorear de 24 páginas donde ellos son los protagonistas. Pago único.",
  nav: { privacy: "Privacidad", terms: "Términos", support: "Soporte", other: "English" },
  hero: {
    kicker: "Un libro para colorear con tu familia adentro",
    title: "Tu familia, en un libro para colorear",
    text: "Sube de 1 a 5 fotos, cuéntanos cómo se llaman y creamos una aventura de 24 páginas en la que ellos son los protagonistas. Lista en minutos, para imprimir en casa.",
    cta: "Crear mi libro",
    price: (p) => `${p} una sola vez. Sin suscripción.`,
    badges: ["24 páginas", "Para niños de 3 a 8 años", "Las fotos se borran al terminar"],
  },
  steps: {
    title: "Así funciona",
    items: [
      { t: "Sube las fotos", d: "De 1 a 5 personas o mascotas, con el nombre de cada una." },
      { t: "Elige la aventura", d: "Dinosaurios, espacio, castillos... Elige entre 24 temas o escribe el tuyo." },
      { t: "Recibe tu libro", d: "Dibujamos a tu familia en una historia de 22 escenas. Te llega el PDF en pantalla y por correo, para imprimir cuantas veces quieras." },
    ],
  },
  samples: {
    title: "Así se ve un libro",
    text: "Ejemplos de estilo con personajes inventados. En tu libro, los protagonistas son tu familia.",
    caption: "Ilustraciones de ejemplo, no son personas reales.",
    alts: ["Dibujo de ejemplo: una niña y su perro en el jardín", "Dibujo de ejemplo: una familia en un globo", "Dibujo de ejemplo: un niño y un dinosaurio"],
  },
  privacy: {
    title: "Las fotos de tu familia son tuyas",
    items: [
      "Las fotos se borran en cuanto los personajes están listos, y siempre antes de 24 horas.",
      "Nunca las usamos para entrenar modelos ni para reconocer a nadie.",
      "Los nombres no se envían a la IA: los ponemos nosotros en el libro.",
      "El libro terminado se borra a los 30 días. Reembolso automático por 7 días.",
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      { q: "¿Cuánto tarda?", a: "Normalmente entre 5 y 15 minutos. Verás cómo van apareciendo los personajes y las páginas, y te lo enviamos por correo." },
      { q: "¿Qué fotos funcionan mejor?", a: "Fotos claras, con buena luz y la cara visible, de una sola persona o mascota por foto. Se aceptan JPG y PNG de hasta 10 MB." },
      { q: "¿Qué pasa con las fotos?", a: "Se envían al proveedor de imágenes solo para dibujar a los personajes, no se usan para entrenar modelos y se borran en cuanto terminan, siempre antes de 24 horas." },
      { q: "¿Y si no me gusta el resultado?", a: "Reembolso completo y automático hasta 7 días después de recibirlo, desde el enlace de tu recibo. Sin preguntas." },
      { q: "¿Es una suscripción?", a: "No. Es un pago único por libro." },
      { q: "¿Los dibujos son de personajes de películas?", a: "No. Los personajes son tu familia y la aventura es original. No usamos marcas ni personajes con derechos de autor." },
    ],
  },
  form: {
    title: "Crea tu libro",
    intro: "Tarda unos 2 minutos. Pagas al final y el libro empieza a hacerse al instante.",
    photos: {
      label: "Sube las fotos (de 1 a 5)",
      hint: "Una persona o mascota por foto, con la cara visible. JPG o PNG, hasta 10 MB cada una.",
      add: "Agregar fotos",
      remove: "Quitar",
      tooLarge: "Esa foto pesa más de 10 MB.",
      tooMany: "Máximo 5 fotos.",
      badType: "Solo JPG o PNG.",
      heic: "Las fotos HEIC no se pueden leer aquí. En el iPhone elige \"Más compatible\" o envíate la foto por mensaje para convertirla a JPG.",
      count: (n) => `${n} de 5 fotos`,
    },
    people: {
      label: "¿Quiénes salen?",
      hint: "Un nombre y quién es, para cada foto. Los nombres se quedan en nuestro servidor.",
      name: "Nombre",
      role: "Quién es",
      rolePh: "niña de 6 años, papá, perro...",
      add: "Agregar persona",
      remove: "Quitar",
      roleSuggestions: ["niña", "niño", "mamá", "papá", "abuela", "abuelo", "perro", "gato", "bebé"],
    },
    age: { label: "Edad de quien va a colorear", hint: "Ajusta la dificultad de los dibujos." },
    theme: { label: "Elige la aventura", hint: "Toda la historia gira en torno a este tema. Si no eliges ninguno, te sorprendemos.", ph: "dinosaurios, mi ciudad, el cumpleaños de Sofía...", own: "O escribe la tuya", picked: "Elegida" },
    email: { label: "¿A dónde te enviamos el libro?", hint: "Tu correo. Ahí llegan el libro y el recibo." },
    country: { label: "País" },
    aviso: "Aviso para madres, padres y tutores",
    consent: "Confirmo cada punto",
    pay: (p) => `Pagar ${p} y crear el libro`,
    paying: "Preparando el pago...",
    errors: {
      photos: "Agrega de 1 a 5 fotos.",
      persons: "Escribe un nombre y quién es para cada foto (solo letras).",
      theme: "Ese tema no se puede usar. Prueba con otro.",
      email: "Revisa tu correo.",
      age: "Elige una edad de 3 a 8 años.",
      consent: "Necesitamos que confirmes todos los puntos.",
      country: "Elige un país.",
      rate: "Demasiados intentos. Espera un minuto.",
      legal_not_ready: "Estamos terminando los textos legales. Vuelve pronto.",
      server: "Algo falló de nuestro lado. No se cobró nada. Intenta de nuevo.",
      generic: "No pudimos continuar. Intenta de nuevo.",
      unreadable: "No pudimos leer una de las fotos. Prueba con otra.",
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
    failed: { title: "No pudimos terminar el libro", text: "Te devolvemos el dinero automáticamente. Te avisamos por correo." },
    refunded: { title: "Pedido reembolsado", text: "Ya devolvimos el pago y borramos tus fotos y el libro." },
    gone: { title: "Este libro ya no está disponible", text: "Borramos los libros a los 30 días para cuidar tu privacidad." },
    notFound: "No encontramos este pedido.",
    test: "Modo de prueba: no se cobró nada.",
  },
  refundPage: { title: "Reembolso", text: "Devolvemos todo el pago, sin preguntas, y borramos el libro y las fotos.", button: "Reembolsar mi pedido", done: "Listo, te devolvimos el pago.", fail: "No fue posible reembolsar desde aquí (pasaron más de 7 días o ya se reembolsó)." },
  legalNote: "Pendiente de revisión legal final antes de cobrar de verdad.",
};

const EN: ColorearCopy = {
  htmlLang: "en",
  siteTitle: "Colorfam: your family to color",
  siteDescription: "Upload photos of your family and get a 24-page coloring book where they are the heroes. One-time payment.",
  nav: { privacy: "Privacy", terms: "Terms", support: "Support", other: "Español" },
  hero: {
    kicker: "A coloring book with your family inside",
    title: "Your family, in a coloring book",
    text: "Upload 1 to 5 photos, tell us their names, and we create a 24-page adventure starring them. Ready in minutes, to print at home.",
    cta: "Create my book",
    price: (p) => `${p} one time. No subscription.`,
    badges: ["24 pages", "For kids aged 3 to 8", "Photos deleted when done"],
  },
  steps: {
    title: "How it works",
    items: [
      { t: "Upload the photos", d: "1 to 5 people or pets, with a name for each one." },
      { t: "Choose the adventure", d: "Dinosaurs, space, castles... Pick one of 24 themes or write your own." },
      { t: "Get your book", d: "We draw your family into a 22-scene story. The PDF arrives on screen and by email, ready to print as often as you like." },
    ],
  },
  samples: {
    title: "What a book looks like",
    text: "Style examples with made-up characters. In your book, the heroes are your family.",
    caption: "Example illustrations, not real people.",
    alts: ["Example drawing: a girl and her dog in the garden", "Example drawing: a family in a balloon", "Example drawing: a boy and a dinosaur"],
  },
  privacy: {
    title: "Your family photos are yours",
    items: [
      "Photos are deleted as soon as the characters are ready, and always within 24 hours.",
      "We never use them to train models or to recognize anyone.",
      "Names are not sent to the AI: we add them to the book ourselves.",
      "The finished book is deleted after 30 days. Automatic refund for 7 days.",
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      { q: "How long does it take?", a: "Usually 5 to 15 minutes. You will see the characters and pages appear, and we also email it to you." },
      { q: "Which photos work best?", a: "Clear photos with good light and the face visible, one person or pet per photo. JPG and PNG up to 10 MB." },
      { q: "What happens to the photos?", a: "They go to the image provider only to draw the characters, are not used to train models, and are deleted as soon as they are done, always within 24 hours." },
      { q: "What if I do not like it?", a: "Full automatic refund up to 7 days after you receive it, from the link in your receipt. No questions asked." },
      { q: "Is it a subscription?", a: "No. It is a one-time payment per book." },
      { q: "Are the drawings of movie characters?", a: "No. The characters are your family and the adventure is original. We do not use brands or copyrighted characters." },
    ],
  },
  form: {
    title: "Create your book",
    intro: "It takes about 2 minutes. You pay at the end and the book starts right away.",
    photos: {
      label: "Upload the photos (1 to 5)",
      hint: "One person or pet per photo, face visible. JPG or PNG, up to 10 MB each.",
      add: "Add photos",
      remove: "Remove",
      tooLarge: "That photo is larger than 10 MB.",
      tooMany: "Up to 5 photos.",
      badType: "JPG or PNG only.",
      heic: "HEIC photos cannot be read here. On iPhone choose \"Most Compatible\", or message the photo to yourself to convert it to JPG.",
      count: (n) => `${n} of 5 photos`,
    },
    people: {
      label: "Who is in the book?",
      hint: "A name and who they are, for each photo. Names stay on our server.",
      name: "Name",
      role: "Who they are",
      rolePh: "girl, 6, dad, dog...",
      add: "Add person",
      remove: "Remove",
      roleSuggestions: ["girl", "boy", "mom", "dad", "grandma", "grandpa", "dog", "cat", "baby"],
    },
    age: { label: "Age of the child who will color", hint: "Adjusts how detailed the drawings are." },
    theme: { label: "Choose the adventure", hint: "The whole story is built around this theme. If you pick none, we surprise you.", ph: "dinosaurs, my city, Sofia's birthday...", own: "Or write your own", picked: "Selected" },
    email: { label: "Where should we send the book?", hint: "Your email. The book and the receipt arrive there." },
    country: { label: "Country" },
    aviso: "Notice to parents and guardians",
    consent: "I confirm each point",
    pay: (p) => `Pay ${p} and create the book`,
    paying: "Preparing payment...",
    errors: {
      photos: "Add 1 to 5 photos.",
      persons: "Type a name and who they are for each photo (letters only).",
      theme: "That theme cannot be used. Try another one.",
      email: "Check your email address.",
      age: "Choose an age from 3 to 8.",
      consent: "We need you to confirm every point.",
      country: "Choose a country.",
      rate: "Too many attempts. Wait a minute.",
      legal_not_ready: "We are finishing the legal texts. Come back soon.",
      server: "Something failed on our side. You were not charged. Try again.",
      generic: "We could not continue. Try again.",
      unreadable: "We could not read one of the photos. Try another one.",
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
    failed: { title: "We could not finish the book", text: "We refund you automatically. We will email you." },
    refunded: { title: "Order refunded", text: "We returned the payment and deleted your photos and the book." },
    gone: { title: "This book is no longer available", text: "We delete books after 30 days to protect your privacy." },
    notFound: "We could not find this order.",
    test: "Test mode: nothing was charged.",
  },
  refundPage: { title: "Refund", text: "We return the whole payment, no questions asked, and delete the book and photos.", button: "Refund my order", done: "Done, we returned your payment.", fail: "A refund is not possible from here (more than 7 days passed or it was already refunded)." },
  legalNote: "Pending final legal review before real charges.",
};

export const COLOREAR_COPY: Record<ColorearLang, ColorearCopy> = { es: ES, en: EN };
