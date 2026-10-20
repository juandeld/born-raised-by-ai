# Lemon Squeezy (Stripe): cobro como merchant of record

Veredicto D27: **RIESGO ALTO** (Pintoria) y **RIESGO ALTO, probable PROHIBIDO** (Jinglo). No abrir cuenta ni pedirle a Juan un alta hasta tener respuesta escrita de soporte (texto al final) y su decisión.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Las citas son fragmentos textuales mínimos; el texto completo está en el enlace.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Prohibited Products | https://docs.lemonsqueezy.com/help/getting-started/prohibited-products | sin fecha en la página |
| Terms (SaaS Service Agreement, Apéndice A, End User Terms) | https://www.lemonsqueezy.com/terms | sin fecha visible |
| Prohibited and Restricted Businesses (Stripe, socio de pagos) | https://stripe.com/legal/restricted-businesses | Last updated 2026-09-22 |
| 2026 Update: Lemon Squeezy + Stripe Managed Payments | https://www.lemonsqueezy.com/blog/2026-update | 28-ene-2026 (JR Farr, CEO) |
| Supported Countries | https://docs.lemonsqueezy.com/help/getting-started/supported-countries | sin fecha |
| Fees, Getting Paid, Payment Methods, Currencies, Refunds and Chargebacks | https://docs.lemonsqueezy.com/help/ (secciones getting-started, checkout, payments) | sin fecha |

## Citas textuales

**Producto digital**
- "As a general rule, we allow selling of digital goods that can be fulfilled through Lemon Squeezy’s website." Ejemplos aceptables en la misma página: "eBooks", "PDFs".
- Prohibido: "Services of any kind (including marketing, design, web development, consulting or other related services)".
- Prohibido: "Any products restricted by our payment processing partners".
- Aviso: "you risk getting your store placed in review or suspended without notice."
- Invitación a consultar: "please contact Lemon Squeezy support with a description or example of the content before you start selling."

**IA en imagen, voz o texto**
- No hay cláusula de IA en Prohibited Products ni en los Terms. La única mención en la lista de Stripe es de contenido adulto: "Any artificial-intelligence generated content that meets the above criteria".

**Menores y fotos de personas reales**
- No hay cláusula sobre menores ni sobre fotos de personas reales en las páginas leídas. Los End User Terms exigen que lo que subas "will not violate any person’s right of privacy".
- Terms, Apéndice A: "Products or content for which you do not hold proper license or intellectual property rights."

**Deepfakes y face-swap**
- Sin cláusula en las páginas leídas.

**Llamadas automatizadas y telemarketing**
- "Regulated services such as: [...] telemarketing, cellular/communication [...]". Stripe, por su lado, prohíbe "Telemarketing".

**País del vendedor (Guatemala)**
- "Bank payouts supported in the following countries" y la lista incluye Guatemala. Regla general: "If you don’t see your country listed by PayPal or in the list below, sorry, you won’t be able to use Lemon Squeezy".
- Pagos: mínimo de payout de $50; ventas retenidas 13 días; payout bancario en USD o convertido a moneda local a tipo mid-market.

**Transición a Stripe Managed Payments (28-ene-2026)**
- "some tradeoffs for the Lemon Squeezy community: slower support responses and less frequent product updates."
- "Today Managed Payments support merchants in 35+ countries" y "If you do not operate in a country that Stripe supports, check out Atlas".
- "Very soon we will announce public access for Stripe Managed Payments allowing users to sign up without needing an invite."

**Apple Pay, Google Pay y moneda local**
- Métodos soportados: "Apple Pay (Safari only)" y "Google Pay (Chrome only)".
- Moneda: "Lemon Squeezy processes all transactions in US dollars (USD)"; "Although we display your products in one of the many currencies we offer, ultimately we charge your customers the equivalent cost in USD." La lista incluye EUR, GBP, MXN y GTQ. Precio fijo por país: no consta en la documentación leída [no verificado].

**Reembolsos y contracargos**
- "Lemon Squeezy reserves the right to issue refunds within 60 days of purchase, at its own discretion, in order to prevent chargebacks."
- Contracargo: se descuenta el importe "plus a $15 dispute fee"; "If your store has too many chargebacks, our team may intervene and suspend your account."
- Tarifa: 5 % + 50 centavos, más 1.5 % si la transacción es fuera de EE. UU. y 1.5 % si es PayPal.

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria (PDF personalizado con IA a partir de fotos de la familia) | **RIESGO ALTO** | No hay prohibición de IA ni de fotos de menores en el texto, y los PDF figuran como aceptables. Pero (1) la regla general habla de bienes "fulfilled through Lemon Squeezy’s website" y nuestro PDF se genera y entrega desde nuestro sitio; (2) "Services of any kind" puede alcanzar a un libro personalizado por encargo; (3) la página de revisión de tienda no se pudo abrir (404) [no verificado]; (4) la plataforma está en transición a Stripe Managed Payments y no consta si un vendedor individual de Guatemala podrá seguir o entrar después de la migración [no verificado]. |
| Jinglo (llamada de Santa con voz de IA a un niño) | **RIESGO ALTO, probable PROHIBIDO** | Es un servicio entregado por teléfono, no un bien digital descargable. Encaja en "Services of any kind" y roza "telemarketing, cellular/communication". No presentar Jinglo a Lemon Squeezy. |

## Qué hacer

1. No abrir cuenta. `pagos-finanzas` conserva Recurrente como cobro principal (ver `recurrente.md`).
2. Si Juan quiere intentar Lemon Squeezy solo para Pintoria, enviar antes la consulta de abajo desde el correo del negocio y guardar la respuesta completa en `docs/proveedores/evidencia/lemon-squeezy-respuesta.md`. Solo con un "sí" escrito que mencione IA, fotos de familia (incluidos menores) y vendedor individual en Guatemala pasa a PERMITIDO.
3. Preguntar también si la cuenta nueva de un vendedor de Guatemala queda dentro de Stripe Managed Payments o se queda en el sistema actual, y qué país de pago cubre cada uno.
4. Si dicen que sí, abrir con Pintoria solamente y declarar el modelo (IA, subida de fotos) en el alta. Mantener Recurrente activo como segunda plataforma.
5. Revisar de nuevo cuando Lemon Squeezy anuncie el acceso público a Managed Payments.

## Consulta propuesta (no enviada)

> Subject: Product review before applying: personalized AI-illustrated PDF coloring book
>
> Hello, before I open a store I would like written confirmation that this product is accepted. Adults upload photos of their own family (often including their children, with the parent's consent) and receive a personalized 24-page PDF of line-art illustrations generated with AI, delivered automatically by our own site through a webhook after payment. One-time purchase, no subscription, 7-day refund. I am an individual seller based in Guatemala (bank payout). Is this product, the AI generation, and a Guatemalan individual seller eligible, both on the current platform and on Stripe Managed Payments? Thank you.

## No verificado

- Página de store review y de preguntas frecuentes de Lemon Squeezy: 404 el 19-oct-2026.
- Precio fijo por país o moneda.
- Si la moderación de tiendas rechaza productos generados con IA por política interna no publicada.
- Fecha de la última edición de Prohibited Products y de los Terms.
