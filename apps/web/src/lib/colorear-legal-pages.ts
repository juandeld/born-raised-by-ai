import type { ColorearLang } from "@lumen/config";

/** Terms of service of the coloring book. Drafted by lider-proyecto from the capitulo and docs/legal; pending written approval by legal-compliance before real charges. */
export const COLOREAR_TERMS: Record<ColorearLang, { title: string; sections: Array<{ h: string; p: string }> }> = {
  es: {
    title: "Términos del servicio",
    sections: [
      { h: "Qué es", p: "{MARCA} crea un libro para colorear en PDF de 24 páginas a partir de las fotos y los nombres que usted sube. Los dibujos y la historia se crean con nuestro proceso propio de ilustración asistido por inteligencia artificial: pueden tener imperfecciones y no son un retrato exacto." },
      { h: "Precio y pago", p: "Pago único por libro, sin suscripción ni renovación. El precio se muestra antes de pagar, con impuestos incluidos cuando aplican." },
      { h: "Entrega", p: "Normalmente en menos de 15 minutos. Recibe el enlace en pantalla y por correo. El libro está disponible 30 días y después se borra automáticamente." },
      { h: "Reembolso", p: "Reembolso completo y automático hasta 7 días después de la entrega, desde el enlace de su recibo o de la página de su pedido, sin preguntas. Si no podemos terminar el libro, devolvemos el pago automáticamente." },
      { h: "Sus fotos", p: "Usted declara ser mayor de edad y madre, padre o tutor de los menores que aparecen, o tener el permiso de ellos y de las personas adultas que aparecen. Las fotos se usan solo para crear su libro y se borran en cuanto los personajes están listos, siempre antes de 24 horas." },
      { h: "Contenido no permitido", p: "No aceptamos fotos de personas sin su permiso, contenido sexual, violento o que dañe a otros, ni temas con marcas o personajes protegidos. Podemos rechazar un pedido y reembolsarlo." },
      { h: "Uso del libro", p: "El libro es para uso personal y familiar: puede imprimirlo cuantas veces quiera. No puede revenderlo." },
      { h: "Contacto", p: "{EMAIL_SOPORTE}. Operado por {TITULAR}, {DOMICILIO}. Vigente desde {FECHA_VIGENCIA}." },
    ],
  },
  en: {
    title: "Terms of service",
    sections: [
      { h: "What it is", p: "{MARCA} creates a 24-page PDF coloring book from the photos and names you upload. The drawings and the story are created with our own illustration process assisted by artificial intelligence: they may have imperfections and are not an exact portrait." },
      { h: "Price and payment", p: "One-time payment per book, no subscription or renewal. The price is shown before you pay, with taxes included where they apply." },
      { h: "Delivery", p: "Usually in under 15 minutes. You get the link on screen and by email. The book is available for 30 days and then deleted automatically." },
      { h: "Refunds", p: "Full automatic refund up to 7 days after delivery, from the link in your receipt or your order page, no questions asked. If we cannot finish the book, we refund the payment automatically." },
      { h: "Your photos", p: "You state that you are an adult and the parent or legal guardian of the minors shown, or that you have permission from them and from the adults shown. Photos are used only to create your book and are deleted as soon as the characters are ready, always within 24 hours." },
      { h: "Content not allowed", p: "We do not accept photos of people without their permission, sexual or violent content, content that harms others, or themes using protected brands or characters. We may refuse an order and refund it." },
      { h: "Use of the book", p: "The book is for personal and family use: you can print it as often as you like. You may not resell it." },
      { h: "Contact", p: "{EMAIL_SOPORTE}. Operated by {TITULAR}, {DOMICILIO}. Effective {FECHA_VIGENCIA}." },
    ],
  },
};
