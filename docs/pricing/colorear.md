# Pintoria (colorear): escalera de precios, unit economics y CAC

`pricing` · v1 · 19-oct-2026 · Producto: `colorear` (marca Pintoria) · Insumos: `docs/marketing/colorear.md`, `docs/productos/colorear.md`, `docs/reglas-de-decision.md`, `docs/investigacion/b2c.md`, `packages/config/src/colorear.ts`
**[EST]** = estimación mía con los supuestos de la sección 7. **[no verificado]** = no pude confirmarlo. Modelo reproducible en la sección 8.

## 0. Respuesta corta

1. **Lanzar una escalera de 3 escalones** en lugar de 4 SKUs sueltos: **1 aventura / Trío (default destacado) / Cinco**. El 48 págs desaparece (el Trío da 72 págs y 3 historias por poco más); el Pack Fiesta sale del selector (queda como landing de campaña, ver 1.4).
2. **Trío = "3 por menos que el precio de 2"**: US $24.99 · UK £18.99 · ES €22.99 · MX MX$429. Cinco = "5 por el precio de 3 o menos": $34.99 · £26.99 · €32.99 · MX$599.
3. **Upsell post-compra "otra aventura con las mismas fotos"** (página de entrega + 2 correos, precio privado, caduca en 48 h): $9.49 · £7.49 · €8.49 · MX$169.
4. **Lo que el plan de marketing no tenía**: con IA a $0.53, IVA, Polar y el mix de bundle, la contribución por pedido antes de publicidad sube de **$7.7 a $11.7 en MX (+51 %)** y de **$8.5 a $13.1 en ES (+54 %)**. Eso es lo que cierra el CAC.
5. **Necesita a Juan** (sección 6): los dos bundles son nuevos y los ahorros (36–48 %) superan el 30 %. Todo lo demás está dentro de lo que decido solo.

## 1. Escalera de oferta

### 1.1 Precios por país (cobro en moneda local, psicológicos terminados en .99 / 9)

| Opción | EE. UU. | Reino Unido | España | México | Libros | Páginas | Costo IA [EST] |
|---|---|---|---|---|---|---|---|
| **Una aventura** (ancla de precio unitario) | $12.99 | £9.99 | €11.99 | MX$229 | 1 | 24 | $0.53 (medido) |
| **Trío** (default destacado) | **$24.99** | **£18.99** | **€22.99** | **MX$429** | 3 | 72 | $1.43 [EST] |
| **Cinco** (escalón alto; ancla de valor) | $34.99 | £26.99 | €32.99 | MX$599 | 5 | 120 | $2.33 [EST] |
| Upsell "1 aventura más" (post-compra, 48 h) | $9.49 | £7.49 | €8.49 | MX$169 | +1 | +24 | $0.45 [EST] |
| Upsell "completa tu Trío" (desde Una: +2) | $11.99 | £8.99 | €10.99 | MX$199 | +2 | +48 | $0.90 [EST] |
| Upsell "completa tu Cinco" (desde Trío: +2) | $9.99 | £7.99 | €9.99 | MX$169 | +2 | +48 | $0.90 [EST] |

Costo del bundle [EST]: N × $0.53 − (N−1) × $0.08, porque los 1–5 personajes se generan una sola vez (≈ $0.08 por libro adicional, marcado [EST]; se confirma con `npm run costs` en el primer Trío real).

### 1.2 Ahorro visible y por qué esos números

| País | Una × 3 | Trío | Ahorro Trío | Precio por libro | "3 por menos que 2" | Cinco | Ahorro Cinco | Por libro |
|---|---|---|---|---|---|---|---|---|
| EE. UU. | $38.97 | $24.99 | $13.98 (36 %) | $8.33 | 2 × $12.99 = $25.98 > $24.99 | $34.99 vs $64.95 | $29.96 (46 %) | $7.00 |
| Reino Unido | £29.97 | £18.99 | £10.98 (37 %) | £6.33 | 2 × £9.99 = £19.98 > £18.99 | £26.99 vs £49.95 | £22.96 (46 %) | £5.40 |
| España | €35.97 | €22.99 | €12.98 (36 %) | €7.66 | 2 × €11.99 = €23.98 > €22.99 | €32.99 vs €59.95 | €26.96 (45 %) | €6.60 |
| México | MX$687 | MX$429 | MX$258 (38 %) | MX$143 | 2 × MX$229 = MX$458 > MX$429 | MX$599 vs MX$1,145 | MX$546 (48 %) | MX$120 |

- El Trío se fija **un escalón por debajo del precio de dos libros sueltos** en cada moneda; así el mensaje "3 por menos que el precio de 2" es literalmente cierto y fácil de entender sin calculadora.
- El Cinco se fija **por debajo del precio de tres libros sueltos** ("5 por menos que el precio de 3"); su función principal es ancla: hace que el Trío se vea como el punto razonable y sube el AOV cuando lo elige 10 %.
- **Paridad por país**: en MX el precio por libro del Trío (MX$143 ≈ $7.5) queda en ~58 % del precio unitario de EE. UU. y el del Cinco en ~49 %, dentro del espíritu de la regla 60–70 %; el sencillo MX$229 (≈ $12.1, ~93 % del de EE. UU.) lo fijó Juan el 18-oct y no lo toco. ES y UK en el sencillo están en 106 % / 100 % del de EE. UU. en USD (precio local con IVA incluido; la regla pide 85–95 %, queda por encima y lo marco para revisar con los datos de la prueba de ES), y por libro del Trío en 68 % / 63 %.
- **Ahorros 36–48 %**: exceden el 30 % que decido solo → escalado a Juan (sección 6), con plan B ≤ 30 %.

### 1.3 Presentación y opción por defecto

| Elemento | Decisión |
|---|---|
| Orden en pantalla | Una · **Trío** · Cinco (3 tarjetas; en móvil el Trío arriba, ancho completo, ya marcado) |
| Default | **Trío preseleccionado** con la etiqueta "Mejor valor" (no "El más elegido" hasta que sea verdad con datos) |
| Texto del Trío | "3 aventuras con tus mismas fotos. 3 por menos que el precio de 2." (nada de nombres de proveedores de IA; revelación genérica, D23) |
| Ancla | El precio tachado "3 × $12.99 = $38.97" en el Trío y "5 × $12.99 = $64.95" en el Cinco; ninguna cifra inventada |
| Fotos | El Trío reutiliza las mismas fotos: el comprador sube una vez y elige las aventuras después (ver sección 5) |
| Sin cupones públicos | `allow_discount_codes: false` se mantiene; el descuento del upsell va como precio propio del producto, no como código |

### 1.4 Qué pasa con el 48 págs y el Pack Fiesta (decisión)

| Oferta actual | Decisión | Razón |
|---|---|---|
| **48 págs $19.99** | **Eliminar** de la escalera | Un libro de 48 págs de una sola aventura cuesta ≈ $1.06 de IA [EST: el doble de $0.53] y rinde menos que el Trío ($24.99, 3 historias, 72 págs). Con el Trío, EE. UU. cumple "pack ≥ $20" para ads con holgura ($24.99 > $20), por lo que ya no hace falta la prueba de $21.99 que proponía marketing |
| **Pack Fiesta $16.99** | **Sacar del selector general**; conservarlo solo como landing del ángulo B, sin lanzarlo en la prueba MX/ES | Es otro trabajo (12 portadas con nombres para invitados): no tiene precios locales definidos, su costo de IA y el flujo de entrega no están medidos **[no verificado]**. Para la prueba del 17-nov el ángulo B de los anuncios vende el Trío ("3 aventuras para 3 hermanos o primos"). Se retoma en 2027 (cumpleaños) con costo medido |
| Una aventura | Mantener | Es el escalón de entrada y el ancla; el 50 % [EST] seguirá comprándola |
| Colección completa (12 aventuras) | **No lanzar** | Costo de IA ≈ 12 × $0.53 − 11 × $0.08 = $5.48 [EST] y ~20 min de generación (12 × 104 s), sin evidencia de que alguien quiera 12 libros; el Cinco ya cubre hermanos, primos y fiestas. Revisar tras la Navidad si > 10 % elige el Cinco |

### 1.5 Upsell post-compra: "otra aventura con las mismas fotos"

| Elemento | Diseño |
|---|---|
| Dónde | (1) Página de entrega, justo bajo el botón de descarga; (2) correo con el PDF; (3) segundo correo a las 30 h |
| Oferta a quien compró **Una** | "Otra aventura": $9.49 / £7.49 / €8.49 / MX$169 (descuento 25–29 %, dentro del 30 %); o "completa tu Trío" (+2): $11.99 / £8.99 / €10.99 / MX$199 (el total, Una + 2, iguala el precio del Trío) |
| Oferta a quien compró **Trío** | "Completa tu Cinco" (+2): $9.99 / £7.99 / €9.99 / MX$169 (el total iguala el precio del Cinco) |
| Oferta a quien compró **Cinco** | Ninguna en la entrega; recompra a los 60 días (cumpleaños, Reyes) |
| Caducidad | **48 h** desde la entrega; el segundo correo sale a las 30 h ("quedan 18 horas"). Tras caducar el enlace, vuelve el precio de lista de una aventura. Enlace privado y firmado: no es un cupón público |
| Por qué mueve la aguja | Reutiliza los personajes (≈ $0.08 menos de IA por libro) y no paga publicidad: la contribución del upsell es alta (ver 2.1) y la tasa de adhesión [EST] es 8 / 15 / 22 % (conservador / base / bueno) |
| Condición legal | Las fotos se borran en ≤ 24 h (`photoMaxHours`); para ofrecer "mismas fotos" hace falta conservar los **personajes en línea** (no las fotos) 48 h para el upsell y 30 días para créditos de bundle. Requiere el visto bueno de `legal-compliance` (cambia el dato retenido, regla D8) |

## 2. Unit economics por país y por opción

### 2.1 Contribución por pedido antes de publicidad (USD)

Supuestos de costo: Polar plan Starter **5 % + $0.50** por transacción, **+1.5 %** tarjetas no EE. UU. (Fuente: documentación oficial de Polar, `polar.sh/docs/merchant-of-record/fees`, consultada hoy). Conversión de pago a USD y retiro: 1 % [EST, documentación de Polar remite a Stripe: 0.25 % UE a 1 % otros países]. IVA incluido en el precio ES 21 %, UK 20 % y MX 16 % (ver nota). ISR Pequeño Contribuyente 5 % de lo recibido (neto de impuestos, Polar y conversión). Reembolsos 3 % del ingreso neto [EST]. Correo y almacenamiento $0.02. Tipos de cambio de `marketing/santa.md` [EST]: MXN 1 = $0.0528, € 1 = $1.15, £ 1 = $1.30.

| País | Opción | Precio local | Precio USD | IVA | Polar | Conv. | IA | Reemb. | ISR 5 % | **Contribución** | % del precio |
|---|---|---|---|---|---|---|---|---|---|---|---|
| EE. UU. | Una | $12.99 | 12.99 | 0 | 1.15 | 0 | 0.53 | 0.39 | 0.59 | **10.31** | 79 % |
| EE. UU. | Trío | $24.99 | 24.99 | 0 | 1.75 | 0 | 1.43 | 0.75 | 1.16 | **19.88** | 80 % |
| EE. UU. | Cinco | $34.99 | 34.99 | 0 | 2.25 | 0 | 2.33 | 1.05 | 1.64 | **27.70** | 79 % |
| EE. UU. | +1 (upsell) | $9.49 | 9.49 | 0 | 0.97 | 0 | 0.45 | 0.28 | 0.43 | **7.34** | 77 % |
| Reino Unido | Una | £9.99 | 12.99 | 2.16 | 1.34 | 0.09 | 0.53 | 0.32 | 0.47 | **8.04** | 62 % |
| Reino Unido | Trío | £18.99 | 24.69 | 4.11 | 2.10 | 0.18 | 1.43 | 0.62 | 0.91 | **15.30** | 62 % |
| Reino Unido | Cinco | £26.99 | 35.09 | 5.85 | 2.78 | 0.26 | 2.33 | 0.88 | 1.31 | **21.66** | 62 % |
| Reino Unido | +1 (upsell) | £7.49 | 9.74 | 1.62 | 1.13 | 0.07 | 0.45 | 0.24 | 0.35 | **5.85** | 60 % |
| España | Una | €11.99 | 13.79 | 2.39 | 1.40 | 0.10 | 0.53 | 0.34 | 0.49 | **8.51** | 62 % |
| España | Trío | €22.99 | 26.44 | 4.59 | 2.22 | 0.20 | 1.43 | 0.66 | 0.97 | **16.36** | 62 % |
| España | Cinco | €32.99 | 37.94 | 6.58 | 2.97 | 0.28 | 2.33 | 0.94 | 1.41 | **23.41** | 62 % |
| España | +1 (upsell) | €8.49 | 9.76 | 1.69 | 1.13 | 0.07 | 0.45 | 0.24 | 0.34 | **5.81** | 60 % |
| México | Una | MX$229 | 12.09 | 1.67 | 1.29 | 0.09 | 0.53 | 0.31 | 0.45 | **7.73** | 64 % |
| México | Trío | MX$429 | 22.65 | 3.12 | 1.97 | 0.18 | 1.43 | 0.59 | 0.87 | **14.47** | 64 % |
| México | Cinco | MX$599 | 31.63 | 4.36 | 2.56 | 0.25 | 2.33 | 0.82 | 1.22 | **20.07** | 63 % |
| México | +1 (upsell) | MX$169 | 8.92 | 1.23 | 1.08 | 0.07 | 0.45 | 0.23 | 0.33 | **5.52** | 62 % |

**Efecto del bundle sobre el cargo fijo de Polar ($0.50):** el costo total de Polar baja de **8.9 %** del precio (Una, EE. UU.) a **7.0 %** (Trío) y **6.4 %** (Cinco); en MX de 10.7 % a 8.7 % y 8.1 %. Además, cada cliente que compra un Trío paga una sola vez $0.50 en lugar de tres.

**Notas de cobro e impuestos:**
- Polar, según su documentación, usa por defecto la convención del país del cliente: **precio con impuesto incluido en la mayoría de los países y sin impuesto (se suma) en EE. UU., Canadá e India**. Por eso modelo ES y UK con IVA incluido (se resta del precio) y EE. UU. sin IVA. Si el producto se configura distinto, el precio mostrado al cliente cambia: **hay que fijar "impuesto incluido" explícitamente en los precios de ES, UK y MX** al crear los productos.
- La documentación de comisiones usa un ejemplo con IVA en el que la comisión se calcula sobre el total con IVA. Lo adopto como conservador: **la comisión se cobra sobre el precio completo, no sobre el neto**. No lo confirma como política **[no verificado]**.
- **IVA de México (16 %)**: no pude confirmar que Polar lo cobre y remita en MX **[no verificado]**. Lo resto en el caso base (conservador). Si no lo cobra, la contribución de MX sube ≈ $1.5 (Una) a $3.2 (Cinco) y el mix base pasa de $11.66 a **$13.96** por pedido. Debe confirmarlo `pagos-finanzas` antes del 17-nov.
- Los retiros de Polar vía Stripe cuestan $2 al mes con retiros activos y 0.25 % + $0.25 por retiro; se tratan como costo fijo del portafolio (≤ $250/mes), no por pedido.
- Si la organización de Polar califica como "Early Member" (creada antes del 27-may-2026): comisión 4 % + $0.40; el capítulo del producto asumía eso. Ahorraría ≈ $0.30 por pedido de $25 **[no verificado]**; uso el Starter 5 % + $0.50 que me dio Juan.

### 2.2 Mix de pedidos y AOV [EST]

| Escenario | Una | Trío | Cinco | % en bundle (meta ≥ 40 %) | Adhesión al upsell (7 días) | Recompra a 90 días (Una a precio lleno) |
|---|---|---|---|---|---|---|
| Conservador | 70 % | 27 % | 3 % | 30 % | 8 % | 5 % |
| **Base** | 50 % | 40 % | 10 % | **50 %** | 15 % | 10 % |
| Bueno | 35 % | 50 % | 15 % | 65 % | 22 % | 15 % |

El mix es un supuesto mío; no hay datos propios. El primer dato real lo da la prueba MX/ES; el KPI "% de pedidos en bundle" se lee desde el día 1.

### 2.3 AOV y contribución mezclada antes de publicidad (USD)

| País | AOV base | Contribución base | % del AOV | Una sola oferta (estructura anterior), contribución | Cambio |
|---|---|---|---|---|---|
| México | $18.27 | **$11.66** | 64 % | $7.73 | +51 % |
| España | $21.26 | **$13.14** | 62 % | $8.51 | +54 % |
| Reino Unido | $19.88 | **$12.31** | 62 % | $8.04 | +53 % |
| EE. UU. | $19.99 | **$15.88** | 79 % | $10.31 | +54 % |

Rango por escenario (conservador / bueno): MX $9.92 / $12.95 · ES $11.08 / $14.67 · UK $10.41 / $13.71 · US $13.41 / $17.70.

## 3. CAC por país, recalculado con la nueva estructura

Fórmula (la de `marketing-growth`): **CAC por compra = CPM ÷ 1000 ÷ CTR ÷ CVR + $0.30** (previews gratis, ≈ 10 por compra [EST]; el plan de marketing lo mencionaba pero no lo sumaba en su tabla). CPM de Instagram en Q4: MX $5, ES $10 (los de marketing); **UK $12 y EE. UU. $15 [EST]** a partir del rango de `b2c.md` sección 4 (UK $9.8–17, US $11–28 con Q4 +30 %). CTR/CVR: conservador 1.5 % / 3 %, base 2 % / 5 %, bueno 3 % / 6 %. **Supuesto crítico: ofrecer el Trío no cambia el CVR de la compra [EST]; si lo baja, el CAC sube en proporción.**

| País | Canal | Conservador | **Base** | Bueno |
|---|---|---|---|---|
| México | Ads (preview gratis) | $11.41 | **$5.30** | $3.08 |
| España | Ads | $22.52 | **$10.30** | $5.86 |
| Reino Unido | Ads (hipotético: hoy solo orgánico) | $26.97 | **$12.30** | $6.97 |
| EE. UU. | Ads (hipotético: hoy solo orgánico) | $33.63 | **$15.30** | $8.63 |

### 3.1 Contribución después de CAC y CAC máximo tolerable (mix base)

| País | Contribución antes de ads | CAC base | **Contribución después de CAC** | Con estructura anterior (solo Una) | CAC de equilibrio (1.er pedido) | **CAC máx. para margen ≥ 20 %** | CAC = 60 % del AOV (regla de escala) | Lectura |
|---|---|---|---|---|---|---|---|---|
| México | $11.66 | $5.30 | **+$6.36** | +$2.43 | $11.66 | **$8.01** | $10.96 | Pasa con holgura (base $5.30 < $8.01) |
| España | $13.14 | $10.30 | **+$2.84** | −$1.79 | $13.14 | **$8.89** | $12.76 | Positivo pero bajo el 20 % de margen: condicionado a CTR y CVR del bueno o a un mix más alto |
| Reino Unido | $12.31 | $12.30 | **$0.01** | −$4.26 | $12.31 | **$8.33** | $11.93 | Sin ads; solo orgánico |
| EE. UU. | $15.88 | $15.30 | **+$0.58** | −$4.99 | $15.88 | **$11.88** | $11.99 | Sin ads salvo CTR ≥ 3 % y CVR ≥ 6 % (bueno: $8.63) |

**Hallazgo para `director-portafolio`:** en mercados con IVA (MX, ES, UK), la regla "escalar con CAC ≤ 60 % del ticket" **no protege el margen**: 60 % del AOV ≈ el CAC de equilibrio del primer pedido ($10.96 vs $11.66 en MX). Propongo medir el tope como **CAC ≤ contribución − 20 % del AOV**, que equivale a ≈ **42–44 % del AOV en MX/ES/UK** y ≈ 59 % en EE. UU. (sin IVA). Es un cambio de regla: lo escalo, no lo aplico solo.

### 3.2 LTV a 90 días con recompra [EST]

LTV90 = contribución del primer pedido + upsell a 7 días (adhesión × contribución del upsell por mix de compra) + recompra a 90 días (tasa × contribución de una aventura sola, sin CAC porque llega por correo).

| País | Conservador | **Base** | Bueno | LTV90 base − CAC base |
|---|---|---|---|---|
| México | $10.74 | **$13.17** | $15.12 | **+$7.87** |
| España | $12.00 | **$14.87** | $17.16 | **+$4.57** |
| Reino Unido | $11.29 | **$13.93** | $16.04 | +$1.63 |
| EE. UU. | $14.54 | **$17.95** | $20.67 | +$2.65 |

El aporte de upsell + recompra es ≈ $1.5 por cliente en base (≈ 12 % del LTV). Es real pero pequeño: **el que decide es el mix de bundle del primer pedido**, no la recompra. Navidad y Reyes (compradores que llegan en nov–dic) pueden subir la recompra; no la modelo por encima del 10 % sin dato.

## 4. Respuesta directa a Juan

> **"¿Ya calculó cuánto me costará ganar un cliente?"** Sí. Ganar un cliente cuesta esto en publicidad (incluye los previews gratis), y esto te queda por cliente con el bundle:

| País | Cuesta ganar un cliente (conservador – bueno; **base**) | Cada cliente te deja antes de publicidad (base, mezcla con bundle) | **Te queda por cliente después de publicidad (base)** | Sin bundle (solo 1 libro) te quedaba |
|---|---|---|---|---|
| **México** | $3.1 – $11.4 (**$5.3**) | $11.66 | **+$6.36** | +$2.43 |
| **España** | $5.9 – $22.5 (**$10.3**) | $13.14 | **+$2.84** | −$1.79 |
| **Reino Unido** | $7.0 – $27.0 (**$12.3**) hipotético, hoy solo orgánico | $12.31 | **≈ $0** | −$4.26 |
| **EE. UU.** | $8.6 – $33.6 (**$15.3**) hipotético, hoy solo orgánico | $15.88 | **+$0.58** | −$4.99 |

- **Con los $500 de la prueba (MX $270 + ES $130 + reserva)**: con CAC base, MX compra ≈ 51 clientes y ES ≈ 12; contribución neta de ≈ $325 en MX y ≈ $35 en ES [EST]. En el escenario conservador la prueba pierde dinero (CAC > ingreso): por eso las pausas por umbral siguen vigentes.
- **Qué lo cambia todo**: el bundle. En MX el cliente promedio pasa de dejar $7.7 a $11.7 antes de publicidad. Sin bundle, España y las ads de EE. UU./UK **no cierran**. Con bundle, MX cierra con holgura y ES queda en el borde.
- **Lo que no sabemos**: el mix real (50 % en bundle es un supuesto), si el Trío baja el CVR, y el IVA de MX en Polar. Todo se mide en la primera semana.

## 5. Recomendación de lanzamiento y pruebas A/B

### 5.1 Qué lanzar el 17-nov (MX) y el 19-nov (ES)

| País | Una | **Trío (default)** | Cinco | Upsell |
|---|---|---|---|---|
| México | MX$229 | **MX$429** | MX$599 | MX$169 / MX$199 / MX$169 |
| España | €11.99 | **€22.99** | €32.99 | €8.49 / €10.99 / €9.99 |
| EE. UU. y UK (orgánico, Pinterest y Etsy) | $12.99 / £9.99 | **$24.99 / £18.99** | $34.99 / £26.99 | $9.49 / £7.49 |

Etsy: dos fichas (Una, Trío) en lugar de tres (48 págs y Pack Fiesta salen); Cinco como variante del Trío. El listado respeta `[no verificado]` de viabilidad de Etsy.

### 5.2 Pruebas (≥ 100 visitas por rama, lectura por **contribución por visitante**, no por conversión)

| # | Prueba | Rama A | Rama B | ¿Dentro de ±10 %? | Lectura |
|---|---|---|---|---|---|
| T1 | Precio del Trío, MX | MX$429 | MX$469 (+9.3 %) | Sí, decido yo | Contribución por visita; se queda B si la contribución sube aunque baje el % bundle |
| T2 | Precio del Trío, ES | €22.99 | €24.99 (+8.7 %) | Sí | Igual |
| T3 | Estructura: 3 tarjetas vs 2 (con y sin Cinco) | Una · Trío · Cinco | Una · Trío | Es estructura, no precio; el Cinco ya viene aprobado por Juan si aprueba la sección 6 | Mix, AOV y contribución por visita |
| T4 | Orden/etiqueta | Trío preseleccionado | Ninguno preseleccionado | Sí | % de pedidos en bundle |
| T5 | Caducidad del upsell | 48 h | 7 días | Sí | Adhesión y contribución por cliente |
| T6 | Sencillo MX | MX$229 | MX$249 (+8.7 %) | Sí | Contribución por visita |

**Escalar a Juan (fuera de mi margen):** MX$229 está en ~93 % del precio de EE. UU. frente al 60–70 % que fija la paridad; bajar el sencillo a MX$159–179 sería salirse de ±10 %, y con el costo fijo de Polar ($0.50) y el CAC base ($5.3) deja la contribución en ≈ $4–5; no lo recomiendo, pero la decisión es de Juan.

## 6. Pendiente de aprobación de Juan (resumen para el director)

| # | Qué | Por qué requiere a Juan | Recomendación |
|---|---|---|---|
| 1 | **Trío** y **Cinco** (bundles nuevos) | Regla: bundles nuevos | Aprobar |
| 2 | Ahorro del Trío 36–38 % y del Cinco 45–48 % | Regla: descuentos > 30 % | Aprobar. **Plan B ≤ 30 %** (se pierde el mensaje "3 por menos que 2"): Trío $27.99 · £21.99 · €25.99 · MX$489; Cinco $39.99 · £29.99 · €36.99 · MX$689. La contribución por Trío sube ≈ $2.7 en US y ≈ $2.5 en MX por pedido, pero la conversión del bundle baja [EST] |
| 3 | Eliminar el 48 págs ($19.99) y sacar el Pack Fiesta del selector | Cambia la oferta del producto aprobada | Aprobar |
| 4 | Regla de CAC: pasar de "60 % del ticket" a "contribución − 20 % del AOV" en países con IVA | Regla del portafolio | Aprobar (`director-portafolio`) |
| 5 | Retención de personajes en línea 48 h / 30 días para el upsell y los créditos | Cambia el dato retenido (D8) | `legal-compliance` |

## 7. Supuestos clave (todos revisables)

| Supuesto | Valor | Estado |
|---|---|---|
| Costo de IA por libro de 24 págs | $0.53 | Medido 19-oct-2026 |
| Ahorro de personajes reutilizados | $0.08 por libro adicional | [EST] |
| Polar | 5 % + $0.50, +1.5 % tarjetas no EE. UU. | Documentación oficial de Polar; comisión sobre precio con IVA [no verificado] |
| Impuesto en el precio | ES 21 %, UK 20 % incluidos; MX 16 % restado por prudencia; EE. UU. 0 | MX [no verificado] |
| Conversión de moneda y retiro | 1 % | [EST] |
| ISR | 5 % de lo recibido | Dato de Juan; contador valida (D5) |
| Reembolsos | 3 % | [EST] |
| Tipos de cambio | MXN 0.0528 · EUR 1.15 · GBP 1.30 | [EST] de `marketing/santa.md` |
| Mix, adhesión al upsell, recompra | ver 2.2 | [EST] |
| CPM Q4 | MX $5 · ES $10 · UK $12 · US $15 | MX/ES de marketing; UK/US [EST] |
| CTR/CVR | 1.5/3 · 2/5 · 3/6 % | Los de marketing; sin cambio por el Trío [EST] |

## 8. Cómo reproducir el modelo

Para cada país y opción: `neto = precio_USD − IVA`; `Polar = precio_USD × (5 % + 1.5 % si no EE. UU.) + 0.50`; `recibido = neto − Polar − 1 % (si no EE. UU.)`; `contribución = recibido − 5 % × recibido − IA − 3 % × neto − 0.02`. AOV y contribución mezclada = suma ponderada por el mix de 2.2. CAC según sección 3. LTV90 según 3.2. Las tablas de este archivo salen de ese cálculo; los números por opción de 2.1 son redondeos a dos decimales.

## 9. Nota para el código (no implementada)

**Estado actual:** `Variant = "single" | "bundle"` en `packages/config/src/pricing.ts`; `pickVariant` en `apps/web/src/lib/slugs.ts` solo conoce `bundle` (el de Santa, dos llamadas, apagado con `BUNDLE_ENABLED`). `COLOREAR_PRICES` solo tiene el precio sencillo por país. En `.env`, `POLAR_PRODUCT_MAP` usa hoy un solo producto de Polar con precios en 4 monedas para las cuatro claves `colorear:<PAÍS>:single`.

| Cambio | Detalle |
|---|---|
| Variantes | Agregar a `Variant` (o a un tipo propio de colorear): `single`, `bundle3`, `bundle5`, `add1`, `add2`, `add2to5`. No reutilizar `bundle` (es de Santa) |
| Precios | `COLOREAR_PRICES` pasa a `Record<CountryCode, Record<ColorearVariant, {amountMinor, currency}>>` con los valores de 1.1 |
| Claves de Polar | `colorear:<PAÍS>:<variante>`, p. ej. `colorear:MX:bundle3`. Opción simple: **un producto de Polar por variante, con precios en 4 monedas** (como hoy) y `currency` en la creación del checkout; 6 productos y 24 claves apuntando a 6 IDs. Los upsell son productos propios (no códigos de descuento: `allow_discount_codes` sigue en `false`) |
| Impuesto | En cada producto fijar precio "impuesto incluido" para ES, UK y MX, y comprobar que el precio visible coincide con `COLOREAR_PRICES` **[no verificado]** |
| Pedido | Agregar `credits_total` y `credits_used` (1, 3 o 5; los upsell suman créditos); `books[]` con la aventura de cada libro; los eventos `OrderPaid` y `BookDelivered` llevan `variant` y número de libro (en `analytics/events.ts`) |
| Webhook | `order.paid` abre créditos según `variant`; `order.refunded` anula créditos sin usar y marca el reembolso parcial por libro entregado |
| Upsell | Enlace firmado con caducidad de 48 h (HMAC con el id del pedido), no válido tras expirar; precios `add*` solo accesibles con ese enlace |

### Entrega de los 3 libros: recomendación de menor fricción

| Opción | Fricción | Veredicto |
|---|---|---|
| A. Elegir las 3 aventuras antes de pagar | Alta: obliga a decidir 3 cosas antes del pago y ensucia la conversión y el preview | No |
| **B. Crédito: se elige la 1.ª aventura como hoy (en el preview), se paga, y las otras 2 se eligen después desde la página de entrega con 1 clic** | **Baja**: el flujo de compra es idéntico al de "Una"; las otras aventuras se piden con los personajes ya creados (sin subir fotos) | **Recomendada** |
| C. Todas las aventuras se generan solas (sin elegir) | Cero fricción pero el cliente no controla la historia; mayor tasa de reembolso | No |

Detalles de B: (1) el libro 1 se genera al instante tras el pago; la página de entrega muestra "Te quedan 2 aventuras" con las 12 tarjetas; (2) cada elección dispara la generación con los personajes guardados; (3) correo recordatorio al día 7 y al 21 con los créditos sin usar; (4) los créditos caducan a los 30 días (alineado con `RETENTION_DAYS.order`); (5) si `legal-compliance` solo aprobara conservar personajes 7 días, la ventana se acorta a 7 días y se mantiene el mismo flujo; (6) un libro de crédito sin usar al caducar no se reembolsa automáticamente (términos de servicio: debe declararlo `legal-compliance`).
