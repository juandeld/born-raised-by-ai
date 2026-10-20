# Dodo Payments: cobro como merchant of record (respaldo)

Veredicto D27: **RIESGO ALTO** para Pintoria y **RIESGO ALTO, tendiendo a PROHIBIDO** para Jinglo. No abrir cuenta sin respuesta escrita de su equipo de cumplimiento y sin resolver el tope de reembolsos (abajo).
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Merchant Acceptance Policy | https://docs.dodopayments.com/miscellaneous/merchant-acceptance | Last modified May 20, 2026 |
| Countries Eligible for Merchant Acceptance | https://docs.dodopayments.com/miscellaneous/accepted-countries-and-territories | Last modified August 27, 2026 |
| Terms of use / Master Services Agreement | https://dodopayments.com/legal/terms-of-use | Last updated 26 Feb, 2026 |
| Verification process | https://docs.dodopayments.com/miscellaneous/verification-process | Last modified September 25, 2026 |
| Payouts, Payment methods, Localized pricing, Adaptive currency | https://docs.dodopayments.com/features/ (payouts, payment-methods, localized-pricing, adaptive-currency) | oct-2026 / sep-2026 |
| Pricing | https://dodopayments.com/pricing | sin fecha |

## Citas textuales

**Producto digital**
- Aceptan: "SaaS & AI products", "Digital goods". Valor: "We assess “value” based on what a customer actually gets and experiences after they buy the product."
- No aceptan: "Digital products with limited or unclear value – For example, AI-generated PDFs with little value".
- E-books: en "Categories That Often Require Review" figura "E-books and written digital publications".
- Servicios: "Productised services – A fixed, pre-defined digital product that is delivered the same way for every buyer."

**IA en imagen, voz o texto**
- "AI Content Generation tools (text, image, video, voice) – No impersonation, scraping, or deepfakes" (categoría que requiere revisión).
- "Audio / music / chatbot generators – No voice cloning, NSFW, IP Infringements or fake claims".

**Menores y fotos de personas reales**
- No hay cláusula expresa sobre menores. Sí: "Privacy Violations & Surveillance Tech – We don’t allow products that violate user privacy or enable unauthorized surveillance – this includes [...] facial recognition tech, face-swap features or tools that scrape or collect personal data without a clear legal basis."

**Deepfakes y face-swap**
- Los dos fragmentos anteriores: "No impersonation, scraping, or deepfakes" y "face-swap features".

**Llamadas automatizadas y telemarketing**
- "Telecommunication services – This includes services that offer call SPI, telecom routing, global calling to PSTN, SIM cards, e-SIMs, VoIP services, call/SMS termination, or related telecom operations (licensed or unlicensed)."
- "Spam, mass outreach or scraping tools".

**País y tipo de vendedor**
- Guatemala figura en "Accepted Countries & Territories". La verificación acepta "Individual" ("You’re a creator or sole proprietor"). El documento de identidad debe ser de un país de la lista.

**Aplicación de la política y reembolsos**
- Pueden suspender si el negocio "generates excessive refunds or chargebacks".
- Multas: "up to USD 425,000" por incumplimiento.
- Términos 18.3 (iii): pueden terminar el contrato "where the Product has a chargeback/ cancellation/ refund rate of more than 0.5% of total orders monthly."
- Términos 9.6: "Dodo Payments will enable refunds 7 days from the date of purchase."
- Términos 9.7: ante un reembolso o contracargo cobran el importe más cargos "which shall at minimum be 30 (thirty) GBP/ USD/ EUR or INR 3000". Redacción ambigua: si aplicara a reembolsos voluntarios, cada reembolso de un libro de $12.99 costaría al menos $30.

**Apple Pay, Google Pay y moneda local**
- La página de métodos de pago lista Apple Pay y Google Pay. Precios: "Localized Pricing lets you override that base with fixed prices you set per currency or per country." Es el único proveedor leído con precio fijo por país documentado.
- Tarifa: 4 % + 40 centavos (más cargo por pagos internacionales).

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **RIESGO ALTO** | Es un PDF generado con IA: cae en "AI-generated PDFs with little value" (la defensa es que va personalizado con la familia, pero queda a juicio de ellos) y en la categoría de revisión de IA. La transformación de fotos de personas se parece a lo que listan en "face-swap features". Además, la política de reembolso automático a 7 días y la cláusula del 0.5 % mensual de reembolsos son incompatibles: basta un mes pequeño con pocas ventas para superar el tope. |
| Jinglo | **RIESGO ALTO, tendiendo a PROHIBIDO** | Llamada telefónica (PSTN) con voz de IA: choca con "global calling to PSTN" y con la categoría de revisión de voz de IA. No es un producto digital que se entrega igual a todos. |

## Qué hacer

1. No abrir cuenta. Dodo queda como respaldo solo para Pintoria y solo con respuesta escrita.
2. Escribir a compliance@dodopayments.com (dirección indicada en su política) con la descripción del producto y estas tres preguntas: (a) ¿se acepta un PDF de colorear personalizado con IA a partir de fotos que sube el comprador? (b) ¿el tope de 0.5 % de reembolsos aplica a reembolsos voluntarios dentro de 7 días y cómo se calcula con pocas ventas? (c) ¿el mínimo de 30 en la cláusula 9.7 aplica a reembolsos voluntarios? Guardar la respuesta en `docs/proveedores/evidencia/`.
3. No presentar Jinglo a Dodo.
4. `pagos-finanzas` debe decidir con Juan si acepta el riesgo del 0.5 %; si no hay respuesta que lo resuelva, no usar Dodo.

## No verificado

- Página de merchant terms de Dodo (404 el 19-oct-2026).
- Cargo exacto de transferencia internacional a Guatemala y mínimo de payout vigente.
- Si "Individual" tiene límites de volumen o de reserva en la práctica.
