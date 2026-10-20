# Cobrar tras el rechazo de Polar: políticas de IA, alternativas para Guatemala y recomendación por producto (19-oct-2026)

`pagos-finanzas` · investigación de solo lectura (no se crearon cuentas ni se contactó a nadie) · complementa `docs/investigacion/pagos-guatemala.md` (18-oct) y toca D5, D9 y el principio 4 de `CLAUDE.md`.
**[no verificado]** = no pude confirmarlo en la fuente. **[estimación mía]** = juicio mío sin dato público detrás. **[fuente terciaria]** = blog o comparador, no la política oficial. Todas las páginas oficiales se leyeron el 19-oct-2026 salvo indicación.

## 0. Respuesta corta

1. **La política escrita de Polar no prohíbe la IA; la pone en "revisión cercana".** El rechazo automático ("not supported under our policies") es más duro que el texto: `AI Content Generation tools (text, image, video, voice)`, `eBooks` y `Audio / music / chatbot generators` figuran como categorías que "may not be accepted", no como prohibidas. Eso justifica una apelación humana, pero **no hay que depender de ella**.
2. **Afecta a Jinglo también, aunque el rechazo citó solo imágenes**: la voz IA cae en dos categorías restringidas (`AI Content Generation tools (... voice)` y `Audio / music / chatbot generators`). La llamada saliente no cae en la prohibición de telemarketing de Polar, que se refiere a cómo se *vende* un producto, no a qué entrega.
3. **Pintoria**: principal **Lemon Squeezy** (única MoR con payout bancario explícito a Guatemala cuya política publicada acepta "eBooks" y "PDFs" y no tiene cláusula de IA), respaldo MoR **Dodo Payments**, y **Recurrente siempre activo** como segunda plataforma (no es MoR). Apelar a Polar en paralelo, costo cero.
4. **Jinglo**: principal **Recurrente** (sin cláusula de IA ni de llamadas; ya es el plan B del repo). Intentar Polar de nuevo con una organización solo de Jinglo como mejora (MoR), respaldo **PayPal + BAM**. Paddle, Gumroad y Creem quedan descartadas para Jinglo por sus cláusulas de telemarketing/telecom/IA.
5. **Código**: hoy un solo `PAYMENT_PROVIDER` global; cada motor (`engines/generate` = Pintoria, `engines/calls` = Jinglo) ya construye su propio proveedor, así que separar por producto es un cambio pequeño. **Hay que escribir 1 adaptador nuevo para Lemon Squeezy** (firma HMAC propia, no Standard Webhooks) y otro para Dodo (probablemente reutiliza `standard-webhooks.ts`, **[no verificado]**). Hay un **hallazgo de bug latente**: el reembolso usa el proveedor activo y no el de la orden (sección 5).
6. **Pierde Juan** (sección 5): decisión de cambiar el principio 4, altas y KYC, y una consulta al contador porque **fuera de una MoR el IVA/VAT de UK, ES y MX pasa a ser de Juan**.

---

## 1. Qué dice Polar (cita textual)

Fuente: https://polar.sh/docs/merchant-of-record/acceptable-use (`Effective Date — October 1, 2026`). Revisión de cuentas: https://polar.sh/docs/merchant-of-record/account-reviews.

| Dónde en la política | Texto literal | Efecto |
|---|---|---|
| Lista general | "Polar reserves the right to refuse Services to sell any Product in its sole discretion." | La decisión es discrecional; la política no describe un proceso de apelación |
| Prohibido | "Adult content and services including, but not limited to OnlyFans-related and similar services, adult AI-generated content and AI relationship services;" | La IA prohibida es la adulta; no aplica a Pintoria ni a Jinglo |
| Prohibido | "is marketed through the use of outbound telemarketing;" | Se refiere al canal de venta del producto. Jinglo no se vende por llamadas en frío: la llamada es el producto que el padre reserva. No lo excluye por texto |
| Encabezado de "Restricted businesses" | "The following categories require a closer review and may not be accepted. Approval may depend on factors including the nature of the product, business maturity, ownership and funding, safeguards, and risk profile. We may require additional information, safeguards, or contractual terms before approval:" | Revisión caso a caso. Madurez del negocio y salvaguardas pesan |
| Restringido | "eBooks;" | **Pintoria queda marcada dos veces** (libro y IA de imagen) |
| Restringido | "AI Content Generation tools (text, image, video, voice);" | Imagen (Pintoria) y voz (Jinglo) |
| Restringido | "Audio / music / chatbot generators (no voice cloning, NSFW, IP infringements or fake claims)." | Jinglo. La voz de Santa es diseñada, no clonada (D12), lo que cumple la condición |

Otros hechos de las revisiones de Polar (account-reviews): la primera revisión puede tardar "up to 14 days"; "We process every review as quickly as we can and resolve every single one"; contacto: https://polar.sh/docs/support. Umbral de contracargos interno 0.4 %. **No encontré página de apelación** (la ruta `/account-reviews/appeal` no existe); la apelación manual de la que habla el mensaje de rechazo **[no verificado en documentación]**.

Dato útil: la lista de negocios prohibidos de Stripe (https://stripe.com/legal/restricted-businesses, actualizada 2026-09-22) solo menciona IA en contenido adulto ("Any artificial-intelligence generated content that meets the above criteria"). **La restricción es de Polar, no de Stripe**, por eso Lemon Squeezy y Gumroad, que también pagan vía Stripe, no heredan la cláusula.

### 1.1 Probabilidad realista de apelación [estimación mía; no hay estadísticas públicas]

| Escenario | Probabilidad | Por qué |
|---|---|---|
| Apelar la organización "Lumen Labs" tal cual (Pintoria + Jinglo) | **15-25 %** | El rechazo ya fue automático sobre el producto de imagen; "eBooks" + "AI image" + niños + cuenta nueva sin historial ("business maturity") es la combinación que la política dice mirar con más lupa |
| Apelar solo Pintoria, con salvaguardas documentadas | **25-35 %** | Un revisor humano puede ver que no es una herramienta abierta de generación sino un producto fijo; la política deja la puerta abierta ("may not be accepted") |
| Organización nueva solo con Jinglo | **35-50 %** | Voz diseñada (no clonada), personaje folclórico, sin prompts libres, consentimiento parental. Sigue siendo categoría restringida y sin historial |

Un rechazo no cuesta nada salvo tiempo (hasta 14 días por revisión). El riesgo es de calendario: la prueba de Pintoria arranca el 17-nov, así que **las altas alternativas van en paralelo, no después**.

### 1.2 Argumento honesto para la apelación (sin tergiversar)

Decir, con evidencia del repo:

1. **Es un producto digital fijo de pago único, no una herramienta de generación.** El cliente no escribe prompts: elige una aventura de un catálogo cerrado y sube fotos de su propia familia (`docs/productos/colorear.md`: historia con plantilla). No hay vector de NSFW, de celebridades, de IP ni de deepfake abierto.
2. **Salvaguardas ya construidas**: moderación de salida (evento `content_blocked`, `engines/generate/src/engine.ts` ~líneas 588-631), borrado de fotos en 24 h (`photoMaxHours: 24`, `packages/config/src/colorear.ts`), sin reconocimiento facial, casilla de confirmación de que el adulto sube fotos de su familia (R20), revelación de IA al comprador adulto (D23), reembolso automático, soporte en español.
3. **Admitir lo que es**: ilustraciones generadas con IA a partir de fotos. No ocultarlo, no decir "dibujado a mano" ni "sin IA". Polar pregunta por el producto; la franqueza es la mejor defensa.
4. **Separar productos**: pedir revisión de Pintoria y de Jinglo por separado, para que un "no" a uno no arrastre al otro. Para Jinglo: voz diseñada, no clonada (D12); el niño nunca llama, el padre reserva y consiente por escrito (D7); sin marketing por llamada.
5. **Datos que faltan antes de enviar**: riesgo/contracargo esperado, política de reembolso pública, URL viva con términos y privacidad. Polar dice "Build first, submit second": enviar con sitio y checkout funcionando en sandbox.

Qué **no** decir: que no usa IA, que Jinglo "no es una llamada automatizada", ni minimizar que son fotos de menores.

---

## 2. Alternativas que aceptan vendedores de Guatemala

### 2.1 Políticas sobre IA y llamadas (cláusulas con enlace)

| Plataforma | Imágenes IA a partir de fotos del cliente (Pintoria) | Voz IA / llamadas (Jinglo) | Veredicto |
|---|---|---|---|
| **Lemon Squeezy** | La lista de productos prohibidos ([prohibited-products](https://docs.lemonsqueezy.com/help/getting-started/prohibited-products)) **no menciona IA**. Productos aceptables explícitos: "Software & SaaS, eBooks, PDFs, Design assets, Photos, Audio, Video". Prohíbe "Products or content for which you do not hold a proper license or intellectual property rights" y "Any products restricted by our payment processing partners". Un comparador competidor dice que las palabras de IA mandan la solicitud a revisión manual (+2-5 días) [fuente terciaria: [Freemius](https://freemius.com/blog/payment-platform-restrictions-ai-apps/)] | Prohíbe "Services of any kind" y "Regulated services such as: ... telemarketing, cellular/communication ...". Una llamada reservada puede leerse como servicio o comunicación | **Pintoria: encaja. Jinglo: zona gris, riesgo medio-alto** |
| **Dodo Payments** | [Merchant Acceptance Policy](https://docs.dodopayments.com/miscellaneous/merchant-acceptance): "SaaS & AI products" y "Digital goods" son "Businesses We Love". "AI Content Generation tools (text, image, video, voice) – No impersonation, scraping, or deepfakes" y "E-books and written digital publications" están en "Categories That Often Require Review". "Productised services – A fixed, pre-defined digital product that is delivered the same way for every buyer" también. **Riesgos**: #3 "Digital products with limited or unclear value – For example, AI-generated PDFs with little value" y #22 "... facial recognition tech, face-swap features ..." | #24 "Telecommunication services – ... call SPI, telecom routing, global calling to PSTN, SIM cards, e-SIMs, VoIP services, call/SMS termination". Jinglo usa PSTN pero no vende telecom. "Audio / music / chatbot generators" en revisión | **Pintoria: encaja con reservas (valor del PDF, caras). Jinglo: consultar antes** (compliance@dodopayments.com) |
| **Creem** | [Account reviews](https://docs.creem.io/merchant-of-record/account-reviews/account-reviews): "Restricted: Generative AI products, including, but not limited to text-to-image and text-to-video generation tools ... An established and proven track record is required for consideration." Prohibido: "Face-swap, deepfake, and face-manipulation tools of any kind". [AI Wrapper Compliance](https://docs.creem.io/merchant-of-record/account-reviews/ai-wrapper-compliance) exige Moderation API en productos que generan imagen desde prompts | Prohibido: "Telecommunications and connectivity products such as eSIMs, SIM cards, mobile data plans, calling plans, VoIP services ..." y "Regulated services such as gambling, lending, telemarketing ..." | **Descartar para ambos**: no tenemos "track record", y [un rechazo es final por tienda](https://docs.creem.io/merchant-of-record/account-reviews/rejected-accounts): "We don't re-review a rejected account for the same business" |
| **Paddle** | [AUP](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle) (actualizado 13-abr-2026): "Content generation ... Human-like faces in realistic, stylized, or animated forms (Restricted Category)", "Any content generation using a person's likeness without that person's explicit consent" | "Telemarketing", "Phone services" | **Descartar para ambos** |
| **Gumroad** | [Prohibited](https://gumroad.com/prohibited) (revisado 16-sep-2026): "AI services which includes selling access to AI tools, chatbots, image or content generation services, or subscriptions to AI services that are fulfilled outside of Gumroad". Pintoria se genera en nuestro servidor, o sea fuera de Gumroad | Misma cláusula (chatbots) más "telemarketing" y "cell phones/pagers" | **Descartar para ambos**; además es la más cara |
| **Recurrente** | [Giros prohibidos](https://ayuda.recurrente.com/es/p/giros-de-negocios-prohibidos) (6-oct-2026): **ninguna cláusula de IA ni de imágenes generadas**. Exige que los productos estén "revelados en la solicitud de cuenta": declarar ambos productos y la IA al abrir la cuenta | Prohíbe "Marketing de respuesta negativa y telemarketing" (modelo de venta, no aplica). Sin cláusula de llamadas o IA de voz | **Encaja con ambos** |
| **PayPal Business** | [AUP](https://www.paypal.com/us/legalhub/paypal/acceptableuse-full) (última actualización 29-oct-2022): sin cláusula de IA; prohíbe actividades ilegales y exige aprobación para listas específicas (juegos de azar, cripto, etc.) | Sin cláusula | **Encaja**, pero PayPal congela fondos a su criterio (riesgo operativo, no de política) |
| **Payhip** | No pude leer su AUP (Cloudflare bloqueó el acceso). Sus [términos](https://payhip.com/terms) (leídos vía WebFetch) no mencionan IA; prohíben contenido sexual, odio, ilegal, juegos de azar, etc. Existe una página de marketing "Vender arte AI" (`payhip.com/es/vender-ai-art`, **no abierta**: solo vi el título en una búsqueda) | Sin cláusula visible | **Encaja por texto** [no verificado], pero cobra directo a tu PayPal o Stripe: en Guatemala solo PayPal |
| **FastSpring / 2Checkout (Verifone)** | Su AUP no se pudo leer (Cloudflare; la página de Verifone es de restricciones por país, no de productos) [no verificado] | [no verificado] | Sin lista pública de países de vendedor ni de productos; el contrato es por cotización. Solo si todo lo demás falla |
| **Stripe Managed Payments / Atlas** | Guatemala no es elegible (ver `pagos-guatemala.md`). Camino estructural: LLC en EE. UU. con Atlas, **fuera de esta ronda** y cambia D5 | n/a | Decisión de Juan; no investigado |

### 2.2 MoR, payout a Guatemala, comisión, alta y riesgo

Comisión total = comisión de plataforma + costo de retiro porcentual cuando es documentado. **Retiros con cargo fijo** se indican aparte. Las dos columnas de precio son tarjeta de EE. UU. / tarjeta fuera de EE. UU. Cálculo propio con tarifas oficiales.

| Plataforma | ¿MoR (cobra y remite IVA/sales tax)? | Pago a Guatemala | Comisión sobre **$12.99** (EE. UU. / no-US) | Comisión sobre **$24.99** (EE. UU. / no-US) | Alta | Riesgo de cierre posterior |
|---|---|---|---|---|---|---|
| **Polar** (referencia, rechazada) | Sí | Stripe Connect Express, GTQ por wire, mínimo $10 | $1.30 (10.0 %) / $1.49 (11.5 %) | $2.04 (8.2 %) / $2.41 (9.6 %) | Hasta 14 días | Alto para IA: revisión continua sobre "consistent with what was approved" |
| **Lemon Squeezy** | **Sí** ([MoR](https://docs.lemonsqueezy.com/help/payments/merchant-of-record)) | **Sí**, Guatemala en [lista de payouts bancarios](https://docs.lemonsqueezy.com/help/getting-started/supported-countries), a banco local, pagos 14 y 28, mínimo $50; cargo de retiro 1 % ([fees](https://docs.lemonsqueezy.com/help/getting-started/fees)) | $1.27 (9.8 %) / $1.46 (11.2 %) | $1.98 (7.9 %) / $2.35 (9.4 %) | 2-3 días hábiles (docs); +2-5 días si marca IA [terciaria] | **Medio**: Stripe la adquirió y su carta de enero 2026 admite "slower support responses and less frequent product updates" y migración a Managed Payments, al que Guatemala no accede. Reverificaciones pausan retiros |
| **Dodo Payments** | **Sí** | **Sí**, Guatemala en [países aceptados](https://docs.dodopayments.com/miscellaneous/accepted-countries-and-territories); retiros en USD por SWIFT **$25 fijos** por retiro, y "Fee of $5 if payout <$1000" (no está claro si se suman) [no verificado]; mínimo $100 (bajable a $50); ciclo quincenal ([payouts](https://docs.dodopayments.com/features/payouts)) | $0.92 (7.1 %) / $1.11 (8.6 %) + retiro fijo | $1.40 (5.6 %) / $1.77 (7.1 %) + retiro fijo | 1-3 días hábiles, persona individual aceptada ([verificación](https://docs.dodopayments.com/miscellaneous/verification-process)) | **Medio**: plataforma joven; su política prevé multas de hasta $425,000 por clasificar mal el negocio, así que describir bien el producto es obligatorio. Tarifa: [pricing](https://dodopayments.com/pricing) 4 % + $0.40, +1.5 % tarjetas fuera de EE. UU. |
| **Creem** | Sí | Sí, Guatemala en [lista](https://docs.creem.io/merchant-of-record/supported-countries); transferencia local, cargo "7 EUR/USD or 1% of the payout amount, whichever is higher"; pagos los días 1 y 15 | $1.03 (7.9 %) | $1.61 (6.4 %) | 1-2 días (hasta 3) | Alto (rechazo final y sin historial) |
| **Paddle** | Sí | Wire USD o Payoneer, mínimo $100, mensual | $1.15 (8.8 %) | $1.75 (7.0 %) | Variable | No aplica: la política lo excluye |
| **Gumroad** | Sí | GTQ a banco, mínimo $100 | $2.48 (19.1 %) | $4.02 (16.1 %) | 1-3 semanas | No aplica |
| **Recurrente** | **No**: Juan es el vendedor legal (FEL, contracargos, impuestos indirectos) | **Sí**: banco guatemalteco, liquidación estándar gratis en 24 h hábiles; cobra solo en USD o GTQ | $0.83 (6.4 %) | $1.37 (5.5 %) | Mismo día hábil; Q500 de límite hasta verificar. Persona individual: DPI + RTU (régimen General o Pequeño Contribuyente) ([verificación](https://ayuda.recurrente.com/es/p/como-verifico-mi-cuenta-comercial)) | **Bajo-medio** por política; Juan asume contracargos y "revisiones" ocasionales de retiros |
| **PayPal GT + BAM** | No | Retiro a cuenta USD de BAM al 3 %, tope $2,000/día y $10,000/mes, solo personas individuales | $1.36 (10.5 %) | $2.35 (9.4 %) | Inmediata | **Medio-alto**: congelamientos de fondos en cuentas nuevas con picos de ventas (Navidad) |
| **Payhip** (Free) | Parcial (IVA UE/UK según `pagos-guatemala.md`) | Directo a tu PayPal; luego BAM al 3 % | ≈ comisión Payhip 5 % + PayPal 5.40 % + $0.30 + BAM 3 % ≈ 14 % | ≈ 13 % | Inmediata | Medio |
| **FastSpring** | Sí | Wire SWIFT, mínimo $100, retención inicial 45 días | ≈ $1.72 (13.2 %) [terciaria] | ≈ $2.42 (9.7 %) [terciaria] | Cotización | [no verificado] |

Supuestos de la tabla: Polar y Lemon Squeezy 5 % + $0.50 (+1.5 % fuera de EE. UU.); retiro Polar ≈ 1.25 % [estimación mía a partir de 0.25 % + hasta 1 % cross-border]; Creem 3.9 % + $0.40 con retiro al 1 %; Gumroad 10 % + $0.50 + 2.9 % + $0.30 (no verifiqué un recargo internacional); Recurrente 4.5 % + US$0.25.

**Lectura del costo**: ninguna alternativa MoR empeora el modelo de `docs/pricing/colorear.md` (Polar Starter al 8.9 % del precio del libro sencillo en EE. UU.). Lemon Squeezy queda igual; Dodo es 1-2 puntos más barato antes del cargo fijo de retiro. Recurrente es la más barata en comisión pero **trae IVA propio** (sección 4).

---

## 3. Recomendación

### 3.1 Pintoria (PDF para colorear con IA; $12.99 / $24.99; EE. UU., UK, ES, MX)

| Orden | Plataforma | Papel | Condición |
|---|---|---|---|
| Paralelo, costo cero | **Apelación a Polar** (solo Pintoria, con salvaguardas) | Si pasa, se queda el código actual y la economía del pricing doc | 25-35 % de éxito; no bloquear nada esperándola |
| 1 | **Lemon Squeezy** | Principal MoR: acepta "eBooks" y "PDFs", sin cláusula de IA, payout a Guatemala en la lista | Describir el producto honestamente al darse de alta; esperar revisión manual |
| 2 | **Dodo Payments** | Respaldo MoR; vigilar #3 y #22 | Escribir antes a compliance@dodopayments.com con la descripción del producto |
| Siempre activa | **Recurrente** (cuenta comercial) | Segunda plataforma obligatoria y colchón si ambas MoR dicen no | Resolver el IVA antes del primer cobro (sección 4) |

No usar para Pintoria: Paddle, Gumroad, Creem, FastSpring.

### 3.2 Jinglo (llamada de Santa con voz IA reservada por un padre)

| Orden | Plataforma | Papel | Condición |
|---|---|---|---|
| 1 | **Recurrente** | Principal: sin cláusula relevante, ya es el plan B en el repo, retiros en 24 h, y Jinglo es estacional (necesita liquidez rápida) | Declarar el producto en la solicitud; checkout cobra en USD (la conversión local ya existe en `convertForProvider`) |
| Mejora opcional | **Polar con organización solo de Jinglo** | MoR para el IVA | 35-50 % de éxito [estimación mía]; si aprueba, sube a principal |
| 2 | **PayPal + BAM** | Tercer método, ya definido en el principio 4 | Tope $10,000/mes; solo persona individual |

No usar para Jinglo: Creem, Paddle, Gumroad. Lemon Squeezy y Dodo solo tras consulta escrita al soporte sobre "telemarketing / cellular / telecom": la redacción puede tocar un servicio de llamadas aunque no sea telecom.

---

## 4. Impuestos: lo que cambia si el cobro no pasa por una MoR

- `docs/pricing/colorear.md` modela ES (21 %), UK (20 %) y MX (16 %) con "impuesto incluido" que la MoR cobra y remite. **Con Recurrente o PayPal esa remisión pasa a ser de Juan.** No es un detalle: sin MoR, la contribución del pricing doc sube en el papel (Juan se queda con el IVA) pero crea una obligación que hoy no está cubierta.
- Reglas generales **[inferencia mía; validar con contador]**: un vendedor extranjero de servicios digitales a consumidores debe registrarse y declarar IVA en UK y la UE desde la primera venta (sin umbral para no residentes) y, en México, existe el régimen de IVA para servicios digitales de extranjeros. En EE. UU. rige el umbral económico por estado, bajo para un lanzamiento chico.
- Por eso las MoR valen su 5 %: Lemon Squeezy o Dodo resuelven eso. Con Recurrente, la salida práctica de lanzamiento es **limitar Pintoria/Jinglo vía Recurrente a mercados donde el contador confirme la exposición** (probablemente EE. UU. primero) hasta que una MoR apruebe. **Cambios de régimen fiscal los decide Juan.**
- FEL: con MoR se emite al payout de la plataforma; con Recurrente/PayPal, por venta al cliente final (exportación de servicios exenta de IVA guatemalteco, ver `pagos-guatemala.md` sección D).

---

## 5. Código y trabajo de Juan

### 5.1 Qué existe

`packages/payments/src`: interfaz `PaymentProvider` (`name: "polar" | "recurrente" | "mock"`), adaptadores `polar.ts`, `recurrente.ts`, `mock.ts`, verificador Standard Webhooks (`standard-webhooks.ts`) y `convertForProvider`. La ruta `apps/web/src/server/api/webhooks-provider.ts` ya es genérica (`/api/webhooks/[provider]`).

### 5.2 Cambios propuestos (requieren aprobación de `arquitecto`: flujo de pago)

| # | Cambio | Dónde | Tamaño |
|---|---|---|---|
| 1 | **Proveedor por motor**: `createPaymentProvider(env, scope)` que lea `PAYMENT_PROVIDER_GENERATE` / `PAYMENT_PROVIDER_CALLS` y caiga a `PAYMENT_PROVIDER`. Hoy ambas fábricas llaman `createPaymentProvider(env)` sin distinguir (`engines/generate/src/factory.ts:40`, `engines/calls/src/factory.ts:94`) | `packages/payments/src/index.ts` + las 2 fábricas | Pequeño |
| 2 | **Bug latente de reembolsos**: `engines/generate/src/engine.ts:1066` y `:1103` reembolsan con el proveedor *activo* usando `order.payment_id`. Si una orden se pagó con otra plataforma (migración o respaldo), el reembolso irá a la API equivocada. La orden ya guarda `payment_provider` (línea 299). Resolver el proveedor con `paymentProviderByName(order.payment_provider)`. Mismo patrón en `engines/calls/src/refunds.ts:29` | `engines/*/src` | Pequeño, con prueba |
| 3 | **Adaptador Lemon Squeezy** (`lemonsqueezy.ts`): checkout con `store` + `variant` y `custom` = `order_id`; webhook firmado con HMAC-SHA256 hexadecimal del cuerpo crudo en el encabezado `X-Signature` (**no es Standard Webhooks**, hay que escribir un verificador nuevo); eventos de orden creada/reembolsada; reembolso por API. **[no verificado]**: nombres exactos de endpoints y campos; confirmar en modo de prueba. Precios fijos por moneda local no son seguros: LS convierte moneda automáticamente salvo configuración, lo que podría romper la escalera MX$429 / €22.99 / £18.99 del pricing doc **[no verificado]** | `packages/payments/src/lemonsqueezy.ts` + pruebas | Del tamaño de `polar.ts` (~120 líneas) |
| 4 | **Adaptador Dodo** (`dodo.ts`): checkout sessions y reembolsos por API; webhooks probablemente Standard Webhooks (reutiliza `standard-webhooks.ts`) **[no verificado]**. Moneda: "Adaptive Currency" convierte; confirmar si admite precio fijo por país **[no verificado]** | idem | Similar |
| 5 | Ampliar el tipo `name`, `paymentProviderByName`, `walletMethods` (Recurrente declara `[]`: Apple Pay / Google Pay en Recurrente **[no verificado]**) y `payments.test.ts` | `types.ts`, `index.ts` | Pequeño |
| 6 | Actualizar `docs/arquitectura/pendientes-cuentas.md` (sección Polar) con las claves del nuevo `PRODUCT_MAP`, y `CLAUDE.md` principio 4 una vez decidido | docs | Después de la decisión de Juan |

Si Recurrente es el principal de Jinglo, **no hay adaptador nuevo para Jinglo**: solo el cambio 1 y `PAYMENT_PROVIDER_CALLS=recurrente`. Su checkout cobra solo en USD; el consentimiento escrito del padre (D7) debe capturarse en nuestra página *antes* de redirigir al checkout alojado por Recurrente, porque ya no hay página de Polar que lo haga.

### 5.3 Lo que tiene que hacer Juan

| Tarea | Detalle |
|---|---|
| Decidir | (a) apelar a Polar y con qué alcance; (b) aprobar el cambio de principio 4 de `CLAUDE.md` y registrarlo como decisión nueva en `docs/decisiones.md`; (c) si se acepta operar sin MoR en algún mercado mientras tanto |
| Altas con KYC | **Lemon Squeezy** (cuestionario, verificación de identidad, formularios fiscales W-8 [no verificado el formulario exacto]); **Dodo** (persona individual, ID oficial, verificación bancaria); **Recurrente comercial** (DPI frente y reverso + RTU descargado del portal SAT; debe estar activa la afiliación al IVA); cuenta bancaria en USD |
| Antes de enviar cualquier solicitud | Sitio vivo con términos, privacidad, política de reembolso, precios visibles y correo de soporte con el dominio del producto; descripción honesta de IA (D23); checkout en modo de prueba. **Nunca comprar el producto con tarjeta real**; usar el modo de prueba o un código de 100 % |
| Consulta al contador | IVA UK/ES/MX sin MoR; emisión de FEL por ruta; validar D5 antes del primer cobro real |
| Mensaje a Dodo | Escribir a compliance@dodopayments.com antes de aplicar, para Pintoria y Jinglo |

Yo (`pagos-finanzas`) no creé cuentas ni escribí a nadie, por la restricción de esta tarea.

---

## 6. Qué sigue sin saberse

- Existencia, forma y plazo de la apelación de Polar **[no verificado]**; las probabilidades de la sección 1.1 son mías.
- Si Lemon Squeezy sigue abriendo cuentas nuevas a vendedores sin invitación al 19-oct (la carta de enero 2026 habla de transición; la guía anterior lo daba por abierto vía terceros) **[no verificado]**.
- Cargo de retiro de Dodo ($25 SWIFT vs $5) y si admite precio fijo por moneda **[no verificado]**.
- AUP de Payhip, FastSpring y 2Checkout: bloqueadas o ausentes **[no verificado]**.
- Apple Pay / Google Pay en Recurrente, Lemon Squeezy y Dodo **[no verificado]**.
- Reembolsos parciales del Trío (D26) en cada plataforma nueva: probar en sandbox.

## 7. Fuentes

**Polar**: https://polar.sh/docs/merchant-of-record/acceptable-use · https://polar.sh/docs/merchant-of-record/account-reviews · https://polar.sh/docs/support
**Stripe**: https://stripe.com/legal/restricted-businesses
**Lemon Squeezy**: https://docs.lemonsqueezy.com/help/getting-started/prohibited-products · https://docs.lemonsqueezy.com/help/getting-started/fees · https://docs.lemonsqueezy.com/help/getting-started/supported-countries · https://www.lemonsqueezy.com/blog/2026-update · https://www.lemonsqueezy.com/terms (Apéndice A)
**Dodo Payments**: https://docs.dodopayments.com/miscellaneous/merchant-acceptance · https://docs.dodopayments.com/miscellaneous/accepted-countries-and-territories · https://docs.dodopayments.com/features/payouts · https://docs.dodopayments.com/miscellaneous/verification-process · https://dodopayments.com/pricing
**Creem**: https://docs.creem.io/merchant-of-record/account-reviews/account-reviews · https://docs.creem.io/merchant-of-record/account-reviews/ai-wrapper-compliance · https://docs.creem.io/merchant-of-record/account-reviews/rejected-accounts · https://docs.creem.io/merchant-of-record/supported-countries · https://www.creem.io/pricing
**Paddle**: https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle
**Gumroad**: https://gumroad.com/prohibited
**Recurrente**: https://ayuda.recurrente.com/es/p/giros-de-negocios-prohibidos · https://ayuda.recurrente.com/es/p/como-verifico-mi-cuenta-comercial · https://ayuda.recurrente.com/es/p/como-funciona-cobrar-a-clientes-fuera-de-guatemala · https://recurrente.com/precios · https://recurrente.com/terminos
**PayPal**: https://www.paypal.com/us/legalhub/paypal/acceptableuse-full
**Payhip**: https://payhip.com/terms
**Terciarias**: https://freemius.com/blog/payment-platform-restrictions-ai-apps/ (competidor de Paddle/LS; usado solo para el dato de revisión manual por IA) · comparadores de MoR de Turbostarter y Fungies (usados solo para identificar plataformas)
**Repo**: `docs/investigacion/pagos-guatemala.md`, `docs/pricing/colorear.md`, `docs/decisiones.md` (D5, D7, D9, D12, D23), `docs/legal/riesgos-y-mitigaciones.md` (R20, R23), `docs/arquitectura/pendientes-cuentas.md`, `packages/payments/src/*`, `engines/generate/src/engine.ts`, `engines/*/src/factory.ts`
