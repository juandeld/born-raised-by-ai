# Cobrar productos digitales desde Guatemala sin LLC en EE. UU. — Informe de pagos, distribución y costos (octubre 2026)

**Fecha de corte:** domingo 18 de octubre de 2026.
**Contexto:** Juan (Guatemala) quiere vender productos 100 % digitales (compras únicas de US$10–30, suscripciones de US$5–30/mes y posiblemente apps móviles) a clientes de EE. UU., España, México, Reino Unido, etc. Restricción dura: el dinero termina en una cuenta bancaria en Guatemala, sin LLC en EE. UU., con alta 100 % online, operando como persona individual o empresa guatemalteca. Presupuesto de la fase: US$2,000–10,000.

**Método y límites:** se leyeron directamente las páginas oficiales (listas de países, fees, help centers) de cada plataforma el 18-oct-2026; cuando una página no pudo leerse o no existe una lista pública, se indica **[no verificado]**. Cuando el dato sale de un tercero (blog, comparador), se indica **[fuente terciaria]**. Las cifras de ejemplo marcadas **[cálculo propio]** se derivan de las tarifas oficiales citadas. El presupuesto de búsquedas web de la sesión se agotó antes de poder confirmar algunos puntos secundarios (TikTok Ads, Google Ads, Sellfy, Podia, Teachable/Thinkific, Whop, Kiwify, Neonet, Qpago, Akisi, Zigi, FRI, BI e-commerce); están marcados así en la tabla.

---

## Respuesta corta (lo esencial)

1. **Stripe NO acepta negocios registrados en Guatemala.** La lista oficial de países soportados (46 países + "preview" solo para India e Indonesia + red extendida Paystack en 5 países africanos) no incluye a Guatemala, y **Stripe Managed Payments** (su merchant of record, GA desde abril 2026) solo admite negocios en EE. UU., Canadá, Europa, Australia, Hong Kong, Japón y Singapur. No hay programa "invite" para Guatemala. Lo único en lo que Guatemala sí aparece es como **país receptor** de Global Payouts / Connect Express (GTQ por wire, se pide NIT), que es justamente el riel que usan Polar, Lemon Squeezy y Gumroad para pagarle a un vendedor guatemalteco.
2. **Sí hay merchants of record que aceptan vendedores de Guatemala y pagan a banco guatemalteco:** Lemon Squeezy (lista explícita, pago a banco en moneda local, 1 % de fee de payout), Gumroad (lista explícita, pago en GTQ), Polar (lista explícita vía Stripe Connect Express) y Paddle (acepta cualquier país no sancionado; paga por wire USD o Payoneer, mínimo US$100 mensual). FastSpring y 2Checkout pagan por wire/PayPal (2Checkout también Payoneer) pero no publican lista de países de vendedor. Hotmart paga a bancos internacionales en moneda local o vía Payoneer, pero no pude confirmar Guatemala en una lista oficial.
3. **PayPal Business Guatemala** puede recibir pagos con tarjeta de clientes internacionales (5.40 % + US$0.30). La novedad relevante: **desde el 7–14 de octubre de 2026 BAM (Banco Agromercantil) es el primer banco guatemalteco aliado de PayPal**: retiro a cuenta en dólares de BAM, comisión 3 %, límites US$2,000/día y US$10,000/mes, solo personas individuales mayores de 18 años, acreditación inmediata. El retiro PayPal → Payoneer no está documentado para Guatemala **[no verificado]**.
4. **Recurrente** (pasarela guatemalteca) acepta Visa y Mastercard **emitidas en cualquier país**, cobra **4.5 % + Q2 (o US$0.25)** en cuenta comercial (5.25 % + Q2 personal), permite cobrar en USD o GTQ, suscripciones, links de pago y API; alta online con DPI + RTU; liquidación gratis en 24 h hábiles a banco guatemalteco. No es MoR (Juan es el vendedor legal y emite FEL).
5. **Google Play SÍ permite cuenta de comerciante en Guatemala** (tabla oficial: ✔ registro de desarrollador, ✔ registro de comerciante, moneda USD); los pagos llegan por **transferencia wire en USD**, mínimo US$100, alrededor del día 15 del mes siguiente. **Apple** permite inscribirse desde Guatemala (App Store disponible en GT; solo excluye regiones sancionadas), paga por depósito/EFT dentro de 45 días del cierre del mes fiscal.
6. **Meta Ads:** el quetzal (GTQ) es moneda admitida para cuentas publicitarias según la documentación oficial de Meta (Marketing API). No encontré ninguna restricción oficial para anunciar a EE. UU./España/México desde Guatemala; la página de impuestos de Meta y las de TikTok Ads/Google Ads no pudieron leerse **[no verificado]**.

---

## A. Tabla comparativa de plataformas

Leyenda: **MoR** = merchant of record (la plataforma es el vendedor legal y liquida IVA/sales tax). "GT" = Guatemala. Fees al 18-oct-2026 salvo indicación.

| Plataforma | ¿Acepta vendedor en GT? | Alta online | Payout (método / frecuencia / mínimo) | Comisión | MoR | Suscripciones | Alta / KYC | Notas y estado |
|---|---|---|---|---|---|---|---|---|
| **Stripe (directo)** | **NO** (no está en la lista oficial de 46 países; preview solo IN/ID) | — | — | — | — | — | — | Tampoco elegible para Stripe Managed Payments (MoR). Verificado en stripe.com/global y docs.stripe.com. |
| **Lemon Squeezy** (Stripe) | **SÍ** — Guatemala en la lista oficial de "bank payouts" | Sí | Banco (vía Stripe, convertido a moneda local al tipo mid-market) o PayPal (USD). Payouts creados el 1 y 15, pagados el 14 y 28; retención 13 días; **mínimo US$50**. Fee de payout: banco no-US **1 %**; PayPal no-US 3 % (máx. US$30) | **5 % + US$0.50** +1.5 % tarjeta internacional +1.5 % PayPal +0.5 % suscripción | **Sí** | Sí | Cuestionario + verificación de identidad; aprobación típica **2–3 días hábiles**; reverificaciones periódicas pausan payouts | **Riesgo estratégico:** adquirida por Stripe (jul-2024); post oficial "2026 Update" (28-ene-2026) reconoce soporte más lento, menos updates y meta de migrar usuarios a Stripe Managed Payments; para países no soportados sugiere "Atlas" (LLC). Sigue aceptando altas según terceros (oct-2026) [fuente terciaria]. Razón social actual: "Sold through Link, LLC f/k/a Lemon Squeezy LLC". |
| **Gumroad** | **SÍ** — Guatemala en lista oficial, payout en **GTQ** | Sí | Solo depósito bancario local en moneda local (GTQ) vía Stripe; **no Payoneer/Wise**; PayPal solo donde no hay banco. Semanal/mensual/trimestral; **mínimo US$100**; retención 7 días; día de pago martes; 2–7 días hábiles en llegar | **10 % + US$0.50 + procesamiento 2.9 % + US$0.30** (≈13 % + US$0.80); 30 % en ventas por Discover; baja a 5 % + US$0.50 sobre US$20k/mes | **Sí** ("Gumroad now acts as the Merchant of Record for all sales") | Sí (memberships) [función conocida; artículo no leído en esta sesión] | ID oficial + comprobante de residencia en GT; revisión de cuenta **1–3 semanas**; KYC de Stripe posterior | La más simple y robusta; la más cara. Cambiar país de payout pierde saldos pendientes (ToS 11.4). |
| **Polar.sh** | **SÍ** — Guatemala en lista oficial (Stripe Connect Express, 150 países) | Sí | Stripe Connect Express → Global Payouts: GT en GTQ por wire (se pide NIT). Retiros **manuales**, procesados en lotes 24 h después; **mínimo US$10**. Fees de Stripe: **US$2/mes** con payout activo + **0.25 % + US$0.25** por payout + hasta 1 % cross-border | Starter **5 % + US$0.50**; Pro 3.8 % + 0.40 (US$20/mes); Growth 3.6 % + 0.35 (US$100/mes); Scale 3.4 % + 0.30 (US$400/mes); **+1.5 % tarjetas no-US** | **Sí** | Sí (sin recargo en planes actuales) | Onboarding Stripe Express (KYC) [tiempo no publicado] | Orientado a desarrolladores/SaaS; API buena. Empresa joven (riesgo de continuidad menor que LS pero existe). |
| **Paddle** | **SÍ** — "software businesses anywhere in the world" salvo lista de sancionados (incluye Nicaragua, Cuba, Venezuela, Haití; **no** Guatemala) | Sí | **Wire bancario o Payoneer**; monedas de payout: USD, EUR, GBP, CAD, AUD, CHF, CZK, DKK, HUF, PLN, SEK, ZAR, CNY (no GTQ → wire en USD a cuenta en dólares); **mensual** (saldo > umbral el día 1, enviado antes del 15); **mínimo US$100**; posible fee SWIFT US$15 en algunos países | **5 % + US$0.50**; productos < US$10 requieren precio a medida | **Sí** (revendedor autorizado) | **Sí** (fuerte en SaaS: dunning, trials) | Revisión de dominio + verificación de negocio (omitida para individuos/sole traders) + identidad; tiempo no publicado | **AUP:** construido para software (B2B SaaS, software de consumo, juegos); prohíbe servicios humanos, bienes físicos y cursos ajenos. E-books/plantillas no se mencionan → riesgo de rechazo si el producto no es "software". |
| **FastSpring** | Probable (wire SWIFT "globally"); **lista de países de vendedor no publicada [no verificado]** | Sí (precio por cotización) | Portal de payouts (tipo Hyperwallet): PayPal, cuenta bancaria/ACH, **wire SWIFT global**, cheque, MoneyGram; **sin Payoneer**. Quincenal (15 y fin de mes) / mensual / semanal; **mínimo US$100**; retención inicial **45 días**; settlement 14 días; monedas USD/EUR/GBP/AUD/CAD; 2.5 % conversión | No pública ("revenue share" por volumen); terceros citan 5.9 % + US$0.95 base [fuente terciaria, competidor] | **Sí** | Sí | Cotización con ventas; "no minimum transaction volume" | Más pensado para software B2B; primer pago lento. |
| **2Checkout / Verifone** | "Sell instantly in 200 countries"; **lista de países de vendedor no leída (bloqueada) [no verificado]** | Sí | **Wire, ACH, PayPal, Payoneer**; **semanal**; USD/GBP/EUR | 2Sell **3.5 % + US$0.35**; 2Subscribe **4.5 % + US$0.45**; 2Monetize a medida; +2 % cross-border en ciertos países | Solo 2Monetize es MoR; 2Sell/2Subscribe = pasarela | Sí (2Subscribe) | [no verificado] | Buena opción si Paddle rechaza el producto; verificar país de vendedor. |
| **Hotmart** | Probable (vende en 188 países; HotPay Internacional paga a bancos fuera de Brasil); **Guatemala no confirmada en lista oficial [no verificado]** | Sí | Transferencia a **banco internacional en moneda local** (SWIFT/BIC) o **Payoneer en USD**; **PayPal no** sirve para retirar. Transferencia automática mensual sin comisión; retiros extra con fee (€1.99; fuentes antiguas: €3–7.50 escalonado); mínimo USD/EUR 20 | **9.9 % + €1.00 ó €0.50** (página oficial muestra ambos) / 9.9 % + US$0.50 en USD [fuente terciaria mar-2026]; micro (<US$15) 9.9 % + US$0.10; player US$1.49/venta si usas su hosting de video | **No pleno**: actúa como "agente" del productor; el productor es responsable de determinar y pagar impuestos en varios países (modelo Colombia extendido en 2024) | Sí | Revisión manual de cuenta [tiempo no publicado] | Fuerte en cursos para LatAm/Brasil; doble conversión de divisa reportada por usuarios. |
| **Kiwify** | **[no verificado]** (empresa Kiwify US, Inc., Miami) | Sí | Primer payout 15 días tras solicitud; métodos no publicados [no verificado] | **9.99 % + US$0.80** | [no verificado] | Sí | [no verificado] | Enfocada en Brasil/LatAm. |
| **Whop** | **[no verificado]** (acepta compradores en 195 países; payouts "worldwide" vía wallet) | Sí | [no verificado] | iOS Checkout SDK 2.7 % + US$0.30; fee general [no verificado] | [no verificado] | Sí | [no verificado] | Documentación de payouts no accesible en esta sesión. |
| **Ko-fi** | Depende de **tu propio PayPal o Stripe** → en GT solo PayPal | Sí | Directo a tu PayPal (al instante) | Ko-fi 0–5 % + fees de PayPal | **No** | Sí (memberships) | Inmediato | Sin Stripe en GT, pierdes tarjetas directas; depende de PayPal GT + BAM. |
| **Payhip** | Igual: cobra con **tu PayPal/Stripe** → en GT solo PayPal | Sí | Directo a PayPal | Free 5 %, Plus US$29/mes 2 %, Pro US$99/mes 0 % + fees PayPal | Parcial: recauda y remite IVA UE/UK y sales tax US/CA | Sí | Inmediato | Útil como front-end barato sobre PayPal. |
| **Sellfy / Podia / Teachable / Thinkific** | **[no verificado en esta sesión]** | Sí | Normalmente conectan tu Stripe/PayPal; Teachable Payments usa Stripe Express (países Stripe) [conocimiento general, no verificado hoy] | Varía | No | Sí | — | Sin Stripe en GT quedan limitadas a PayPal. |
| **Shopify Payments** | **NO** (41 países; Guatemala no está) | — | — | — | — | — | — | En GT hay que usar pasarela externa; CartDNA lista para GT: BAC Credomatic, Pagadito, Akipuedo (efectivo) [fuente terciaria]. Shopify cobra fee extra por pasarela externa [conocido, no verificado hoy]. |
| **Mercado Pago** | **NO** opera en GT (8 países: AR, BR, MX, CL, CO, PE, UY, EC) [fuente terciaria] | — | — | — | — | — | — | Descartado. |
| **dLocal / EBANX** | Son procesadores para **comercios globales que venden hacia** Guatemala (tarjetas, PayCash, SoyFRI); elegibilidad de comerciante guatemalteco pequeño no publicada; típicamente enterprise [inferencia] | Comercial | — | — | No | Sí | — | No es la herramienta para esta fase. |
| **Payoneer Checkout** | **NO** por ahora: "only available in certain markets", aplicaciones tempranas para entidades de Hong Kong | — | — | 0 % conversión USD/EUR; 1.5 % otras | No | [no indicado] | Risk review | Descartado para GT. |
| **PayPal Business GT** | **SÍ** (GT en nivel "Send, receive, and withdraw") | Sí | Retiro a banco: en la tabla oficial GT cae en "todos los demás mercados (si está disponible): sin comisión si no hay conversión"; conversión 3.5 %. **Nuevo (oct-2026): retiro a cuenta USD de BAM, 3 %, US$2,000/día y US$10,000/mes, solo personas individuales.** Estándar 1 día hábil (hasta 3–5) | **5.40 % + US$0.30** (doméstico e internacional); micropagos 6.50 % + US$0.05 (previa aprobación); contracargo US$10; conversión 3.5 %/4.5 % | **No** | Sí (suscripciones PayPal) | Inmediato; verificación de cuenta; "recibir fondos con PayPal requiere asociar tu cuenta a un partner local con licencia" | El saldo se mantiene en USD (GTQ no es moneda PayPal). Retiro PayPal→Payoneer no documentado para GT [no verificado]. |
| **Payoneer (puente)** | **SÍ** opera en GT (190+ países; comparadores GT 2026) [página oficial GT no cargó; parcialmente verificado] | Sí | Retiro a banco local en moneda local **1.2 %–4 %** (página ES: "hasta 2 %"); mismo-moneda US$1.50 solo en países listados (GT no aparece en la lista leída); 3–7 días a bancos GT [fuente terciaria] | Recibir de marketplaces: varía; cuenta receptora en moneda no local 1 % (mín. US$1); cuota anual US$29.95 si recibes < US$6,000/12 meses | — | — | DPI + comprobante de domicilio; verificación 2–5 días [fuente terciaria] | Sirve para **Paddle, 2Checkout y Hotmart** (pagan a Payoneer oficialmente); **no** para Gumroad/FastSpring; Lemon Squeezy no lo menciona. |
| **Recurrente (GT)** | **SÍ** (empresa guatemalteca) | **Sí, 100 % en app** (DPI + RTU PDF de SAT; S.A.: DPI rep. legal, RTU, 2 patentes, nombramiento); corrección por WhatsApp | A banco guatemalteco: **estándar gratis en 24 h hábiles**; inmediato **1.75 %** (mín. Q2.50/US$0.50; máx. Q20,000 o US$2,500 por retiro; Q50,000/día). Recomiendan retirar a cuenta en la misma moneda del saldo (USD→cuenta USD) | **Comercial: 4.5 % + Q2 (o US$0.25)**; personal: 5.25 % + Q2; cuotas 8–14 %; ACH y transferencias desde EE. UU. gratis; SPEI/SEPA 0.5 % FX; USDT/USDC 1 %. Sin mensualidad | **No** (Juan factura con FEL) | **Sí** | Verificación "inmediata" o mismo día hábil; Q500 de límite hasta verificar; cuenta personal tope Q25,000/US$3,000 al mes; comercial sin tope mensual, hasta Q50,000/US$15,000 por link (ampliable en 1–3 días) | **Acepta Visa/Mastercard de cualquier país; no Amex.** Cobro configurable en USD o GTQ. API REST + webhooks + links + tienda. Conversión la hace el banco emisor si cobras en GTQ. |
| **Pagadito** (SV; opera en GT) | **SÍ** (GT en selector; "más de 13 países") | Sí | Retiro a banco GT: **US$0.29 o US$0.99** por retiro (según método); tiempos no publicados | **5 % + US$0.25 + impuesto local**; afiliación US$1.00; reembolso US$0.32 | No | **Sí** ("membresías, suscripciones y planes de pago") | Documentos no publicados [no verificado] | Vende "a cualquier parte del mundo"; redes de tarjeta aceptadas no detalladas. |
| **BAC Credomatic GT** (Compra-Click, PYME Store, e-commerce) | Sí (banco local) | Formulario "Afíliate aquí" online | A tu cuenta BAC | **No publicada** | No | No indicado | Requiere inscripción fiscal, Registro Mercantil, "aviso de operación" y cuenta BAC (texto parece plantilla regional) [parcialmente verificado] | Tarifas y aceptación de tarjetas extranjeras: consultar con el banco. |
| **Neonet (ex-VisaNet GT)**, **Cybersource**, **Banco Industrial e-commerce**, **Qpago**, **Akisi**, **Zigi**, **FRI** | Locales | — | — | **[no verificado]** | No | — | — | Zigi = neobanco respaldado por Banco Industrial (QR, microcréditos, débito Mastercard); FRI y Cuik = billeteras QR/P2P (feb-2026) [fuente terciaria]. Ninguno está orientado a cobrar tarjetas internacionales a un micro-negocio sin trámite bancario; Neonet/Cybersource implican afiliación bancaria tradicional [inferencia]. |

### Ejemplo de neto por venta de US$20 a un cliente de EE. UU. con tarjeta [cálculo propio con las tarifas oficiales]

| Ruta | Comisiones | Neto aprox. antes de FX/banco | % total |
|---|---|---|---|
| Recurrente comercial (cobro en USD) | 4.5 % + US$0.25 = US$1.15 | US$18.85 (retiro estándar gratis a cuenta USD en GT) | 5.8 % |
| Paddle | 5 % + US$0.50 = US$1.50 | US$18.50 (menos posible SWIFT US$15/mes) | 7.5 % |
| Lemon Squeezy | 5 % + 0.50 + 1.5 % intl = US$1.80; payout banco 1 % | ≈US$18.02 | ≈9.9 % |
| Polar Starter | 5 % + 0.50 + 1.5 % no-US = US$1.80; payout 0.25 % + US$0.25 + US$2/mes | ≈US$17.5–18.0 según agrupación de retiros | ≈10–12 % |
| PayPal GT + BAM | 5.40 % + 0.30 = US$1.38; retiro BAM 3 % | ≈US$18.06 | ≈9.7 % |
| Gumroad | 10 % + 0.50 + 2.9 % + 0.30 = US$3.38 | US$16.62 | 16.9 % |

Las rutas MoR (Paddle, Lemon Squeezy, Polar, Gumroad) incluyen cobro y remisión de IVA/sales tax del país del comprador; Recurrente y PayPal no.

---

## B. Rutas recomendadas por caso (con plan B)

### B.1 Compra única web (US$10–30: e-books, plantillas, software, cursos pregrabados)

**Ruta principal: Merchant of Record con payout a banco guatemalteco.**

- **Opción 1 — Polar.sh (Starter 5 % + US$0.50, +1.5 % no-US).** Guatemala está en su lista oficial de 150 países de payout (Stripe Connect Express → wire en GTQ, se pide NIT). Mínimo de retiro US$10, retiro manual cuando quieras, MoR real (IVA UE/UK, sales tax EE. UU.), checkout y API modernos. Riesgo: empresa joven; fees de payout de Stripe (US$2/mes + 0.25 % + US$0.25 + hasta 1 % cross-border) pesan en montos chicos → retirar 1–2 veces al mes.
- **Opción 2 — Lemon Squeezy (5 % + US$0.50 +1.5 % intl).** Guatemala en lista oficial de bank payouts, conversión a moneda local al tipo mid-market, 1 % de fee de payout, mínimo US$50, pagos el 14 y 28. Aprobación 2–3 días hábiles. **Advertencia:** la propia empresa dice (28-ene-2026) que está en modo de transición hacia Stripe Managed Payments, con soporte más lento, y Guatemala **no** es elegible para Managed Payments; si en 2027 cierran altas o fuerzan migración, Juan no tendría destino dentro de Stripe. Úsala como opción táctica, no como columna vertebral.
- **Opción 3 — Gumroad (≈13 % + US$0.80).** Guatemala en lista oficial con payout en GTQ. La más cara pero la más estable y simple (MoR declarado para todas las ventas, 15 años operando). Buena para empezar a vender e-books/plantillas en 1 día mientras se aprueba otra plataforma. Ojo: revisión inicial de 1–3 semanas antes del primer pago; exige comprobante de residencia en Guatemala.

**Plan B (no-MoR, dinero directo a Guatemala en 24 h):** **Recurrente cuenta comercial** (4.5 % + US$0.25, cobro en USD, Visa/MC de cualquier país, links de pago, API). Es la ruta más barata y la única 100 % guatemalteca sin trámite presencial, pero Juan asume el rol de vendedor legal: emitir FEL, responder contracargos, y los impuestos indirectos del país del comprador (en la práctica, un vendedor pequeño extranjero sin establecimiento rara vez tiene obligación de registrarse para sales tax en EE. UU. por debajo de umbrales económicos estatales; en la UE/UK sí existe obligación teórica de IVA OSS/UK VAT desde la primera venta B2C digital — por eso el MoR vale su 5 %). **[inferencia fiscal general; validar con contador]**.

**Plan C:** PayPal Business GT (5.40 % + US$0.30) con retiro vía BAM (3 %, tope US$10k/mes) — útil como método adicional de pago y respaldo, no como ruta única por los topes y el historial de congelamientos de PayPal.

### B.2 Suscripción web (US$5–30/mes)

- **Si el producto es software/SaaS/app:** **Paddle** (5 % + US$0.50; dunning, trials, impuestos; payout mensual por wire USD a cuenta en dólares en Guatemala o Payoneer; mínimo US$100). Es el MoR más maduro para suscripciones y acepta vendedores de cualquier país no sancionado. Contras: productos < US$10 requieren negociación; pago una vez al mes; el AUP favorece software (si el producto es "contenido"/curso, puede rechazarlo).
- **Si el producto es contenido/membresía/curso:** **Polar** o **Lemon Squeezy** (+0.5 % en suscripciones) como MoR; **Gumroad memberships** como fallback simple.
- **Plan B local:** **Recurrente suscripciones** (cobro recurrente automático en USD o GTQ, 4.5 % + US$0.25, liquidación en 24 h). Sin MoR.
- **Plan C:** suscripciones PayPal (5.40 % + US$0.30) con retiro BAM.

### B.3 App móvil (iOS/Android)

- **Apple:** Apple Developer Program US$99/año; **persona individual** solo necesita Apple Account con 2FA y mayoría de edad (no D-U-N-S); una **S.A. guatemalteca** necesita ser entidad legal, D-U-N-S (gratis), correo con dominio propio y sitio web. App Store está disponible en Guatemala (lista oficial de Apple Media Services). Pagos: firmar Paid Apps Agreement + formularios fiscales + datos bancarios ("selecciona el país de tu banco"); Apple paga por **depósito directo/EFT dentro de los 45 días** posteriores al cierre del mes fiscal, consolidando todas las monedas en un solo pago en la moneda de tu cuenta; Guatemala reporta en la región "Latin America and the Caribbean" (USD). Umbral mínimo: 40 USD para países/monedas no listados en la tabla de umbrales (Guatemala no aparece en el extracto leído → aplicaría 40 USD) **[inferencia]**. Comisión: 15 % con Small Business Program (≤ US$1M de ingresos), 30 % estándar. Recomendación: abrir cuenta en **USD** en banco guatemalteco para evitar conversión. **No pude confirmar en una lista pública que Apple liste bancos de Guatemala en el desplegable** ("If you can't identify your bank in App Store Connect, it may be that Apple can't send payments to that bank") → verificar en el primer intento **[no verificado al 100 %]**.
- **Google Play:** Guatemala ✔ registro de desarrollador y ✔ **registro de comerciante** (moneda USD) en la tabla oficial. Alta US$25 única + verificación de identidad (DPI y tarjeta a tu nombre; cuentas personales deben verificar dispositivo Android y cumplir requisitos de testing). Guatemala está en la lista de ubicaciones que reciben **payouts por wire en USD**: mínimo **US$100**, alrededor del **15 del mes siguiente**, fee bancario US$0–50+ a cargo del desarrollador; Google recomienda cuenta en USD. Service fee: 15 % hasta US$1M/año (programa 15 %) y 30 % después; suscripciones automáticas 15 %; en EE. UU./EEE/UK (desde 30-jun-2026) y AU/JP (30-sep-2026) rige una estructura nueva (p. ej. 20 % + 5 % de billing en instalaciones nuevas, 10 % + 5 % en suscripciones, 20 % para enlaces web externos).
- **Reducir comisión de tiendas:** para contenido digital, vender la suscripción en la web vía MoR y dejar la app como "lector" (modelo Netflix/Spotify "reader app") y, donde las reglas 2026 lo permiten (EEE, EE. UU., UK, Japón, Brasil), enlaces externos a checkout web. **[inferencia; revisar guías de App Store y Play vigentes antes de implementarlo]**.
- **Plan B:** publicar la app gratuita y monetizar 100 % por web (Polar/Paddle/Lemon Squeezy) evitando el payout de las tiendas.

### B.4 Estructura legal recomendada para la fase (presupuesto US$2k–10k)

Operar como **persona individual guatemalteca** inscrita en SAT (ver sección D) y con cuenta bancaria en **USD** (Banrural, G&T, BI, BAM abren cuentas en dólares a solicitud [fuente terciaria]). Esto habilita: Recurrente comercial (DPI + RTU), Gumroad/Lemon Squeezy/Polar (KYC individual), Paddle (verificación de negocio omitida para individuos), Apple individual (US$99), Google Play (US$25), PayPal Business + BAM (solo individuales). Constituir una S.A. guatemalteca solo tiene sentido para el Apple Developer Program como organización (nombre de empresa como vendedor) o para separar patrimonio; no es requisito de ninguna plataforma evaluada. Costo de infraestructura de pagos de la fase: < US$300 (Apple 99 + Google 25 + D-U-N-S 0 + Payoneer 0–29.95 + MoR sin mensualidad).

---

## C. Advertencias y riesgos

1. **Lemon Squeezy en transición:** mensaje oficial de enero 2026 habla de "slower support responses and less frequent product updates" y de migrar usuarios a Stripe Managed Payments; Guatemala no es elegible ahí. Reverificaciones de identidad pausan payouts hasta completarse. No concentrar >50 % de ingresos ahí.
2. **Stripe decide:** Gumroad, Lemon Squeezy y Polar liquidan a través de Stripe (Connect/Global Payouts). Gumroad advierte que "in rare cases, Stripe makes a final decision to reject an account". Si eso pasa, pagan el saldo remanente y cierran. Tener siempre una segunda plataforma activa.
3. **Retenciones y revisiones iniciales:** Gumroad revisa cuentas 1–3 semanas antes del primer pago (típicamente tras 3–4 ventas y > US$100); FastSpring retiene 45 días la primera vez; Lemon Squeezy retiene 13 días; Paddle paga solo una vez al mes con mínimo US$100 (si el saldo no llega, se acumula).
4. **Comprar tu propio producto para "probar" = fraude** para los procesadores (Gumroad lo dice explícitamente); usa los modos de prueba.
5. **PayPal:** límites de la ruta BAM (US$2,000/día, US$10,000/mes, solo personas individuales), saldo en USD con conversión 3.5 % si se pasa a quetzales, contracargos US$10, y historial de congelamiento de fondos en cuentas nuevas con picos de ventas (riesgo conocido, no cuantificado aquí). Todas las transferencias "están sujetas a revisión".
6. **Payoneer:** cuota anual US$29.95 si recibes < US$6,000 en 12 meses; retiro a banco local 1.2–4 % (hasta 2 % según la página en español); tiempos 3–7 días a bancos guatemaltecos [fuente terciaria].
7. **Paddle AUP:** si el producto no es claramente software/SaaS/juego, puede rechazarse; prohíbe servicios humanos y cursos de terceros. Preparar sitio web con términos, política de reembolso y descripción clara antes de aplicar (revisión de dominio).
8. **Recurrente:** cuenta personal tope mensual Q25,000/US$3,000 (no ampliable) → abrir **cuenta comercial** desde el inicio (no se puede convertir después); límite Q500 hasta verificar; hasta US$15,000 por link; retiros sujetos a "revisión" ocasional; Juan asume contracargos e impuestos.
9. **Google Play wire:** fee bancario de recepción US$0–50 por wire → acumular hasta montos grandes; Apple paga en una sola transferencia mensual por moneda (también puede cobrar el banco intermediario).
10. **Tipo de cambio:** Gumroad convierte al tipo del momento de la venta (no del payout); Lemon Squeezy al mid-market del payout; Paddle/Google pagan USD (ideal cuenta en dólares); Recurrente convierte USD→GTQ si retiras a cuenta en quetzales (mejor retirar a cuenta USD).
11. **Mercado Pago, Shopify Payments, Stripe, Payoneer Checkout:** no disponibles para comerciante guatemalteco; no gastar tiempo ahí.

---

## D. Impuestos en Guatemala (alto nivel; validar con contador)

Según las preguntas frecuentes de la SAT (página actualizada 25-feb-2026), el **Régimen de Pequeño Contribuyente** del IVA admite ingresos anuales de hasta **125 salarios mínimos mensuales no agrícolas** conforme al Decreto 31-2024, "para 2026 Q500,285.00" (antes era Q150,000); la tarifa es **5 % sobre ingresos brutos** declarada mensualmente en el formulario SAT-2046 (los regímenes "electrónicos" de pequeño contribuyente con tarifa 4 % quedaron derogados el 31-jul-2025), y **todos los pequeños contribuyentes deben emitir DTE en el régimen FEL** (Resolución SAT-DSI-1350-2022); la SAT también tramita devoluciones de ISR retenido indebidamente al pequeño contribuyente, consistente con que ese 5 % sustituye al ISR [práctica conocida]. En el **Régimen General** se paga IVA 12 % y, en ISR, o bien 25 % sobre utilidades o el régimen opcional simplificado sobre ingresos: "5 % sobre el monto hasta de Q30,000.00 y 7 % sobre el monto que exceda" (SAT; PwC Tax Summaries, revisado 9-jun-2026). PwC lista las **exportaciones de bienes y servicios como exentas de IVA** (12 %), y la SAT indica que en facturas de exportación el receptor se identifica con pasaporte o código tributario de su país (Art. 30 num. 9 del Reglamento del IVA, reformado por Acuerdo Gubernativo 12-2023), es decir, **sí se emite FEL a clientes extranjeros**. En la práctica, los creadores/freelancers que cobran por Paddle/Hotmart/Lemon Squeezy/PayPal suelen: (a) inscribirse como pequeño contribuyente (si proyectan < Q500k/año) y pagar el 5 % mensual sobre lo recibido, emitiendo una FEL por el payout a la plataforma (que legalmente es quien les compra, con "reverse invoice" como respaldo) o por venta al cliente final cuando usan Recurrente/PayPal directo; (b) mantener cuenta en USD para evitar conversión; y (c) si superan el umbral o venden a empresas locales, migrar al Régimen General con el opcional simplificado del 5–7 % **[inferencia basada en las reglas anteriores; no encontré fuente SAT/contador que describa explícitamente el caso Paddle/PayPal]**. Nota: la retención de IVA que aplican pasarelas locales (Recurrente muestra "retención de IVA Q0 para pequeño contribuyente" en su calculadora) no aplica a pequeños contribuyentes.

---

## E. Costos de IA y telefonía para unit economics (octubre 2026)

**ElevenLabs Agents (elevenlabs.io/pricing/agents, leído 18-oct-2026):** Free US$0 / 15 min / 4 llamadas concurrentes; Starter US$6 (US$1 el primer mes) / 75 min / 6; Creator US$22 (US$11 primer mes) / 275 min / 10; Pro US$99 / 1,238 min / 20; Scale US$299 / 3,738 min / 30; Business US$990 / 12,375 min / 40 (= **US$0.080/min**). Minuto adicional **US$0.080**; "burst" US$0.160/min; mensajes de texto US$0.003. El LLM se cobra "based on usage and varies by model" y el proveedor de telefonía externo "at cost" (la página de telefonía nativa no cargó; ElevenLabs Hosting aparece incluido) **[telefonía nativa no verificada]**. Enterprise a medida.

**Twilio Programmable Voice (precios "current as of August 2026"):** EE. UU. saliente **US$0.0140/min**, entrante local US$0.0085/min, número local US$1.15/mes; **México** fijo US$0.0160/min, móvil **US$0.0473/min**; **España** fijo US$0.0178/min, móvil **US$0.1800/min** (US$0.0486 si se origina en el EEE); Guatemala saliente fijo US$0.3293 y móvil US$0.2682/min (caro).

**Alternativas:** **Vapi** hosting US$0.05/min (prepago, US$5 de crédito gratis) + telefonía al costo (Twilio saliente US$0.014; Vapi SIP/WebRTC gratis) + modelos al costo (Deepgram ~US$0.0095/min, ElevenLabs voz US$0.0146–0.0238/min) ≈ **US$0.082–0.129/min** todo incluido (1,000 min/mes). **Retell AI** voz US$0.055/min + telefonía US$0.015/min + LLM (p. ej. GPT 5.4 mini US$0.024/min, Claude 4.5 Haiku US$0.025/min) + número US$2/mes ≈ US$0.09–0.10/min.

**APIs de LLM (por millón de tokens, entrada/salida):** Claude (claude.com/pricing y platform.claude.com, 18-oct-2026): **Sonnet 5.5 US$2 / US$10**, **Haiku 5.5 US$0.10 / US$0.50** (prompts ≤100K; US$0.50/US$2.50 si >100K), Opus 5.5 US$4 / US$20, Fable 5.1 US$10 / US$50; legados Sonnet 4.5/4.6 US$3 / US$15, Haiku 4.5 US$1 / US$5; Batch API −50 %. OpenAI (developers.openai.com/api/docs/pricing, tabla estándar tal como aparece): gpt-6.1-sol US$2 / US$10, gpt-6-luna US$0.10 / US$0.50, gpt-6-astra US$10 / US$50; realtime audio gpt-realtime-2.1 US$32 / US$64 (texto US$4 / US$24), gpt-realtime-2.1-mini audio US$10 / US$20; GPT-Live 1 US$0.05/min.

**Ejemplo [cálculo propio]:** una llamada de 5 min con ElevenLabs Agents (Business) + Twilio a móvil de México ≈ 5 × (0.080 + 0.0473) ≈ US$0.64 + LLM (~US$0.01–0.05 con Haiku/Sonnet) ≈ **US$0.65–0.70 por llamada**; a EE. UU. ≈ US$0.48; a móvil España ≈ US$1.30.

---

## F. Fuentes (leídas el 18-oct-2026 salvo indicación)

**Stripe**
- Países soportados: https://stripe.com/global
- Managed Payments (MoR) — elegibilidad por país de negocio: https://docs.stripe.com/payments/managed-payments/eligibility y https://docs.stripe.com/payments/managed-payments
- Cross-border payouts (Connect): https://docs.stripe.com/connect/cross-border-payouts
- Global Payouts — requisitos por país receptor (Guatemala GTQ, wire, NIT): https://docs.stripe.com/global-payouts/recipient-requirements
- Changelog Global Payouts 15 países (28-ene-2026): https://docs.stripe.com/changelog/clover/2026-01-28/cross-border-payouts-new-countries
- Stripe Projects (no es cobro; GT solo para pagar servicios): https://docs.stripe.com/projects y https://docs.stripe.com/projects/paid-tier-countries
- Sessions 2026 (Managed Payments GA): https://stripe.com/blog/everything-we-announced-at-sessions-2026

**Lemon Squeezy**
- Países soportados (Guatemala en bank payouts): https://docs.lemonsqueezy.com/help/getting-started/supported-countries
- Getting paid (calendario, mínimo US$50): https://docs.lemonsqueezy.com/help/getting-started/getting-paid
- Fees (5 % + 0.50; recargos; payout 1 %/3 %): https://docs.lemonsqueezy.com/help/getting-started/fees
- Activación (2–3 días hábiles, tipos de tienda): https://docs.lemonsqueezy.com/help/getting-started/activate-your-store
- Verificación de identidad / reverificación: https://docs.lemonsqueezy.com/help/getting-started/verify-your-identity
- Productos prohibidos: https://docs.lemonsqueezy.com/help/getting-started/prohibited-products
- MoR: https://docs.lemonsqueezy.com/help/payments/merchant-of-record
- "2026 Update: Lemon Squeezy + Stripe Managed Payments" (28-ene-2026): https://www.lemonsqueezy.com/blog/2026-update
- Terceros: https://eden.so/blog/lemon-squeezy-alternatives/ ; https://dodopayments.com/blogs/lemonsqueezy-review ; https://fungies.io/lemon-squeezy-stripe-acquisition-saas-founders-2026/

**Gumroad**
- Getting paid (lista de países, GTQ, mínimos, calendario): https://gumroad.com/help/article/13-getting-paid
- Fees: https://gumroad.com/help/article/66-gumroads-fees
- Sales tax / MoR: https://gumroad.com/help/article/121-sales-tax-on-gumroad

**Polar**
- Países soportados: https://polar.sh/docs/merchant-of-record/supported-countries
- Fees: https://polar.sh/docs/merchant-of-record/fees
- Payouts: https://polar.sh/docs/features/finance/payouts

**Paddle**
- Países soportados / no soportados: https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle
- Cuándo y cómo pagan (wire/Payoneer, US$100, mensual): https://www.paddle.com/help/manage/get-paid/when-and-how-do-i-get-paid
- Monedas de payout: https://www.paddle.com/help/manage/get-paid/can-i-be-paid-in-my-local-currency
- Pricing: https://www.paddle.com/pricing
- Verificación de cuenta: https://www.paddle.com/help/start/account-verification/what-is-account-verification
- Qué no se puede vender (AUP): https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle
- Relación legal (revendedor): https://www.paddle.com/help/start/intro-to-paddle/the-legal-relationship-between-paddle-and-you
- Essentials para abrir cuenta: https://www.paddle.com/help/start/intro-to-paddle/essentials-to-sign-upcreate-a-paddle-account

**FastSpring / 2Checkout / Hotmart / Kiwify / Whop / Ko-fi / Payhip**
- FastSpring payouts: https://developer.fastspring.com/docs/receive-payouts ; métodos: https://developer.fastspring.com/docs/set-up-your-payout-account ; pricing: https://fastspring.com/pricing/ ; tercero: https://fungies.io/fastspring-review-2026
- 2Checkout pricing/payouts: https://www.2checkout.com/pricing/
- Hotmart precios: https://hotmart.com/es/precios ; ventas internacionales e impuestos: https://hotmart.com/es/blog/como-funcionan-las-ventas-internacionales-en-hotmart ; retiros (terceros): https://ganarenlared.com/como-retirar-dinero-de-hotmart/ (2020–21), https://bigbangconversion.com/blog/opinion-hotmart/ , https://www.pandavideo.com/blog/hotmart-fees (31-mar-2026)
- Kiwify: https://kiwify.com/
- Whop (fees iOS SDK): https://docs.whop.com/developer/guides/accept-payments ; https://docs.whop.com/
- Ko-fi: https://help.ko-fi.com/hc/en-us/articles/360002506494
- Payhip: https://payhip.com/pricing ; https://payhip.com/faq

**Shopify / Mercado Pago / dLocal / Payoneer Checkout**
- Shopify Payments países: https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries
- Pasarelas Shopify en Guatemala (tercero): https://cartdna.com/es-mx/shopify-payment-guide/central-america/guatemala ; hilo comunidad: https://community.shopify.com/t/aceptar-pagos-en-guatemala/334983
- Mercado Pago países (tercero): https://www.jonatanalmeira.com/que-paises-pueden-usar-mercado-pago-y-como-acceder-a-sus-servicios/
- dLocal Guatemala: https://docs.dlocal.com/docs/guatemala
- Payoneer Checkout: https://www.payoneer.com/solutions/checkout/

**PayPal Guatemala**
- Comisiones para comercios GT (5.40 % + fijo, micropagos, contracargo): https://www.paypal.com/gt/webapps/mpp/merchant-fees
- Comisiones consumidor / retiros / conversión: https://www.paypal.com/gt/webapps/mpp/paypal-fees
- Retiro a banco (ayuda GT): https://www.paypal.com/gt/cshelp/article/how-do-i-withdraw-money-to-my-bank-account-help394
- PayPal para negocios GT: https://www.paypal.com/gt/business
- Alianza BAM–PayPal (oficial, requisitos, 3 %, límites): https://www.bam.com.gt/paypal-bam/
- Noticias de la alianza (7 y 14 oct 2026): https://newsinamerica.com/pdcc/noticias/gerenciales/2026/bam-anuncia-su-nueva-alianza-con-paypal-en-la-innovacion-de-pagos-digitales-y-retiros-a-cuentas-locales/ ; https://www.guatemala.com/noticias/tecnologia/bam-anuncio-alianza-paypal-retirar-fondos-forma-inmediata-guatemala.html ; https://www.prensalibre.com/c-studio/bam-anuncia-su-nueva-alianza-con-paypal-en-la-innovacion-de-pagos-digitales-y-retiros-a-cuentas-locales/
- Retiros a bancos locales en 10 países LatAm, ene-2024 (GT excluida): https://www.revistaeyn.com/finanzas/paypal-habilita-retiro-de-dinero-en-bancos-de-costa-rica-panama-y-el-salvador-EB17074257
- Guías terceras GT (2026): https://livinginguatemala.com/es/guias/apps-de-pago-de-eeuu-en-guatemala/ ; https://livinginguatemala.com/guides/us-payment-apps-guatemala/ ; https://comparalatam.com/gt/transferencia/paypal.html ; https://remotestack.in/blog/remote-jobs-for-guatemalans-2026

**Payoneer**
- Fees (actualizado 1-ene-2026): https://www.payoneer.com/about/fees/ ; versión ES ("hasta 2 %"): https://www.payoneer.com/es/about/fees/
- Homepage (190+ países): https://www.payoneer.com/
- Guatemala (tercero, ago-2026): https://comparalatam.com/gt/transferencia/payoneer.html

**Pasarelas guatemaltecas**
- Recurrente: https://recurrente.com/ ; precios: https://recurrente.com/precios ; centro de ayuda: https://ayuda.recurrente.com/ ; tipo de cuenta: https://ayuda.recurrente.com/es/p/que-tipo-de-cuenta-necesito-personal-o-comercial ; verificación comercial: https://ayuda.recurrente.com/es/p/como-verifico-mi-cuenta-comercial ; cobros fuera de GT: https://ayuda.recurrente.com/es/p/como-funciona-cobrar-a-clientes-fuera-de-guatemala ; tarjetas aceptadas: https://ayuda.recurrente.com/es/p/que-tarjetas-acepta-recurrente ; límites: https://ayuda.recurrente.com/es/p/cuales-son-los-limites-de-pago-y-como-solicitar-una-ampliacion ; máximo USD: https://ayuda.recurrente.com/es/p/cual-es-el-monto-maximo-a-procesar-en-usd ; retiros inmediatos: https://ayuda.recurrente.com/es/p/retiros-inmediatos-recibe-tus-fondos-en-minutos ; tiempos de transferencia: https://ayuda.recurrente.com/es/p/cuanto-tiempo-toma-una-transferencia-de-fondos ; costo transferencias: https://ayuda.recurrente.com/es/p/tienen-algun-costo-las-transferencias-de-fondos ; USD→GTQ: https://ayuda.recurrente.com/es/p/como-hago-retiros-de-usd-a-una-cuenta-en-gtq ; requisitos iniciales: https://ayuda.recurrente.com/es/p/que-necesito-para-empezar-a-usar-recurrente
- Pagadito: https://www.pagadito.com/ ; tarifas (Acuerdos y Condiciones, sección II): https://www.pagadito.com/contenido/ACUERDOS_Y_CONDICIONES_DE_USO#tarifas ; perfil: https://www.cbinsights.com/compare/pagadito-vs-recurrente
- BAC Credomatic GT (POS/Compra-Click/afiliación): https://www.baccredomatic.com/es-gt/empresas/landing/pos-bac
- Neonet (ex-VisaNet, nov-2023): https://www.revistaeyn.com/eyn-brandlab/pagos-electronicos-visanet-evoluciona-y-ahora-es-neonet-DD16407271
- Panorama de pagos GT 2025–26 (Zigi, FRI, Cuik, Tigo Money): https://paynopain.com/en/blog/payment-methods-in-guatemala-in-2025-trends-and-consumer-habits/

**App stores**
- Apple — soporte de inscripción (individuos/organizaciones, D-U-N-S, regiones): https://developer.apple.com/support/enrollment/ ; programa y precio: https://developer.apple.com/programs/enroll/ ; inscripción: https://developer.apple.com/help/account/membership/program-enrollment/
- Apple — recibir pagos (45 días, EFT): https://developer.apple.com/help/app-store-connect/getting-paid/overview-of-receiving-payments ; umbral mínimo: https://developer.apple.com/help/app-store-connect/reference/minimum-payment-threshold ; regiones y monedas (Guatemala en "Latin America and the Caribbean", USD): https://developer.apple.com/help/app-store-connect/reference/financial-report-regions-and-currencies ; datos bancarios: https://developer.apple.com/help/app-store-connect/manage-banking-information/enter-banking-information ; glosario bancario: https://developer.apple.com/help/app-store-connect/reference/banking-information ; pagos y proceeds: https://developer.apple.com/help/app-store-connect/getting-paid/view-payments-and-proceeds
- Apple — Small Business Program (15 %): https://developer.apple.com/app-store/small-business-program/
- Apple — disponibilidad de servicios por país (App Store en Guatemala): https://support.apple.com/en-us/118205
- Google Play — ubicaciones para registro de desarrollador y comerciante (Guatemala ✔): https://support.google.com/googleplay/android-developer/answer/9306917 (también https://support.google.com/googleplay/android-developer/answer/150324)
- Google Play — calendario y mínimos de payout: https://support.google.com/googleplay/android-developer/answer/137997
- Google Play — payouts por wire (lista incluye Guatemala, US$100, USD): https://support.google.com/googleplay/android-developer/answer/2700656
- Google Play — service fees 2026: https://support.google.com/googleplay/android-developer/answer/112622
- Google Play — registro US$25 y verificación: https://support.google.com/googleplay/android-developer/answer/6112435
- Google Payments — perfil de pagos (banco en el mismo país del perfil): https://support.google.com/paymentscenter/answer/7161426

**Publicidad**
- Meta Marketing API — monedas admitidas (incluye GTQ): https://developers.facebook.com/docs/marketing-api/currencies/
- Meta Business Help (monedas e impuestos) — bloqueado por robots [no verificado]: https://www.facebook.com/business/help/1114532025118604 ; https://www.facebook.com/business/help/133076073434794
- TikTok Ads Manager — artículos de países no cargaron [no verificado]: https://ads.tiktok.com/help/
- Google Ads — página de formas de pago por país no cargó [no verificado]: https://support.google.com/google-ads/answer/2375435

**Impuestos Guatemala**
- SAT — Preguntas frecuentes Cumplimiento Tributario (límite 125 salarios mínimos; FEL obligatoria para pequeños contribuyentes; facturas de exportación; derogación regímenes electrónicos 31-jul-2025; ISR 5 %/7 %): https://portal.sat.gob.gt/portal/preguntas-frecuentes/cumplimiento-tributario/
- SAT — FAQ Decreto 31-2024 ("Para 2026 Q. 500,285.00"; actualizado 25-feb-2026): https://portal.sat.gob.gt/portal/preguntas-frecuentes/decreto-31-2024-ley-para-la-integracion-del-sector-productivo-primario-y-agropecuario/
- SAT — Guía del Pequeño Contribuyente (PDF 2019): https://portal.sat.gob.gt/portal/descarga/5001/capacitacion-presentaciones/40948/guia-del-pequeno-contribuyente-version-2019-2.pdf
- SAT — Cambio de régimen general a pequeño contribuyente: https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-cambio-de-regimen-general-del-impuesto-al-valor-agregado-a-pequeno-contribuyente/
- PwC Tax Summaries Guatemala (revisado 9-jun-2026) — IVA y exportaciones exentas: https://taxsummaries.pwc.com/guatemala/corporate/other-taxes ; ISR regímenes: https://taxsummaries.pwc.com/guatemala/corporate/taxes-on-corporate-income

**Costos de IA y telefonía**
- ElevenLabs Agents pricing: https://elevenlabs.io/pricing/agents ; API pricing: https://elevenlabs.io/pricing/api ; planes creativos: https://elevenlabs.io/pricing
- Twilio Voice: EE. UU. https://www.twilio.com/en-us/voice/pricing/us ; México https://www.twilio.com/en-us/voice/pricing/mx ; España https://www.twilio.com/en-us/voice/pricing/es ; Guatemala https://www.twilio.com/en-us/voice/pricing/gt
- Vapi pricing: https://vapi.ai/pricing
- Retell AI pricing: https://www.retellai.com/pricing
- Claude API pricing: https://claude.com/pricing ; https://platform.claude.com/docs/en/about-claude/pricing
- OpenAI API pricing: https://developers.openai.com/api/docs/pricing
