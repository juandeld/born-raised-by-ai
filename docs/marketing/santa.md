# Santa te llama: plan de go-to-market

`marketing-growth` · v1 · 18-oct-2026 · Capítulo: `docs/productos/santa.md` · Hitos: `docs/planes/santa-hitos.md` · Investigación: `docs/investigacion/santa.md` (secciones 2, 3, 6) · Marca paraguas: Lumen Labs
Reglas que mandan: `docs/reglas-de-decision.md` (D1, D2, D3, D7). Cifras marcadas **[EST]** son cálculo propio con los benchmarks de la investigación; **[no verificado]** es lo que no pude confirmar.

## 1. Resumen de decisiones (D3: mercados elegidos por marketing)

| Decisión | Resultado |
|---|---|
| Mercados de arranque, en orden | 1. México (soft launch) · 2. España · 3. Reino Unido · 4. EE. UU. y US hispano (con puerta, diciembre) |
| Presupuesto antes de la primera venta | $500: MX $150 · ES $200 · UK $90 · US $60 (el US se libera solo si pasa la puerta) |
| Evento de optimización | Compra (`Purchase`), con Pixel + API de Conversiones |
| Fechas duras | Vendiendo antes del 20-nov · PR 17-18 nov · corte 10-dic · Reyes 26-dic a 5-ene |
| Países que requieren aprobación de Juan | Ninguno por ahora. Candidatos futuros (Colombia, Chile, BR) en la sección 12 |

Todo cae dentro de los países ya analizados (US, UK, ES, MX, BR, US hispano), así que no pido aprobación de país a Juan.

## 2. Promesa, posicionamiento y ángulos

**Promesa en una frase**
- ES: "Santa llama por teléfono a tu hijo, por su nombre, y tú te quedas con la grabación y el certificado: pago único, sin app y sin suscripción."
- EN: "Santa calls your child by name, on your own phone, and you keep the recording and the certificate: one payment, no app, no subscription."

**Posicionamiento (no competimos por precio):** llamada saliente que suena en el teléfono de la casa, con grabación y certificado, controlada por el padre. Frente a lo gratis (ElevenLabs, Tavus, ChatGPT, Gemini, PNP de prueba) y a las apps con suscripción semanal, competimos por tres cosas: el "aha" (el niño oye su nombre), la confianza (84 % de los padres teme el mal uso de los datos de sus hijos, Common Sense Media, mar-2026) y la velocidad (tú eliges el día y la hora; puede ser esta noche). Nunca bajamos el precio para ganar; el bundle sube el valor, no baja el precio.

| # | Ángulo | Qué promete | Para qué se usa | Hipótesis (se mide en la semana 1) |
|---|---|---|---|---|
| A | Reacción | "Mira la cara de [nombre] cuando Santa la llama por su nombre" | Parar el scroll; es el formato nativo de Reels/TikTok y el mejor creativo de la categoría (Songfinch, videos de reacción) | CTR de enlace ≥ 3 % (vs. 2.19 % de media en Facebook) |
| B | Confianza y control | "Santa llama a tu casa. Sin app, sin suscripción. Tú eliges el día y das el permiso" | Convertir al padre desconfiado; diferenciarnos de PNP y de las apps de suscripción | CVR de landing ≥ 4 % y reembolsos < 5 % |
| C | Recuerdo y Nochebuena | "Guarda la voz de Santa hablando con tu hijo: grabación, certificado y una segunda llamada en Nochebuena" | Empujar el bundle ($24.99 / 19,99 € / £19.99 / MXN 349) | ≥ 35 % de las compras eligen el bundle |

Quién compra: madre, padre o tutor (el aviso legal exige esa casilla). No apuntamos a abuelos como compradores de Santa; para "regalo" está Colorear.

## 3. Mercados de arranque: datos, CAC estimado y por qué

**CPM usados** (investigación 6.2 y 6.3; CPM de Reels en Q4): MX $4.5 · ES $9 · UK $16 · US $30. Rango de la investigación: IG MX $3–5, ES $7–10, UK $13–17, US $20–28 (Q4 +30–60 %; semana BFCM 2–3×).
**Fórmula:** CAC = CPM / (1000 × CTR de enlace × CVR de landing a compra).

| País | Ticket medio (AOV) [EST] | Escenario conservador (CTR 1.5 %, CVR 3 %) | Escenario base (CTR 2 %, CVR 4 %) | Escenario bueno (CTR 3 %, CVR 6 %) | CAC objetivo (60 % del AOV) |
|---|---|---|---|---|---|
| México | MXN 244 ≈ $12.9 (70 % llamada MXN 199, 30 % bundle MXN 349) | $10.0 | **$5.6** | $2.5 | $7.7 |
| España | ≈ $17.8 ≈ 15,44 € (65 % a 12,99 €, 35 % a 19,99 €) | $20.0 | **$11.2** | $5.0 | $10.7 |
| Reino Unido | ≈ $19.7 ≈ £15.19 (60 % a £11.99, 40 % a £19.99) | $35.6 | **$20.0** | $8.9 | $11.8 |
| EE. UU. y US hispano | $19.99 (50 % a $14.99, 50 % a $24.99); con la landing de bundle primero | $66.7 | **$37.5** | $16.7 | $12.0 |

Tipos de cambio supuestos [EST, confirmar con `metricas`]: MXN 1 = $0.0528 (el de la investigación), € 1 = $1.15, £ 1 = $1.30. Las proporciones de bundle son supuestos, no datos.

**Contribución por venta en el escenario base** [EST]: ticket − Polar (5 % + $0.50 + 1.5 % fuera de EE. UU., de `pagos-guatemala.md`) − costo de llamada ($0.80; $1.45 en España a móvil) − CAC.

| País | Contribución base | % del ticket | Contribución con creativo bueno | Lectura |
|---|---|---|---|---|
| México | $5.1 | 40 % | $8.2 (64 %) | Cierra incluso en base. Es el laboratorio |
| España | $3.4 | 19 % | $9.7 (54 %) | Cierra solo si el creativo rinde; la entrega por enlace web (sin costo de llamada) mejora el margen |
| Reino Unido | −$2.8 | −14 % | $8.3 (42 %) | No cierra en base: entra solo con creativos ya probados |
| EE. UU. | −$19.8 | −99 % | $1.0 (5 %) | No cierra pagado en Q4 salvo bundle y CAC ≤ $15 (60 % de $24.99) |

| Orden | País | Por qué (datos) | Riesgo | Cuándo |
|---|---|---|---|---|
| 1 | México | CPM más bajo ($3–5), CAC base $5.6 contra $7.7 objetivo; PR gratuita anual (Chilango, guías de "videollamada" cada diciembre); valida embudo, copy y llamada con riesgo mínimo | Ticket bajo (MXN 199): cada punto de CAC pesa; la tarifa fija de Polar ($0.50) es 5 % del ticket; Buen Fin (mediados de nov, fecha exacta [no verificado]) puede subir el CPM | Soft launch mar 3-nov |
| 2 | España | Mejor ratio ticket/CAC de los mercados de ticket alto (CPM $7–10, WTP 12,99–19,99 €); Reyes Magos por IA no existe a escala; PR en Xataka Móvil y Applesfera cubre el tema cada año | CAC base ($11.2) apenas supera el objetivo ($10.7): depende de ganar el ángulo en MX; AI Act art. 50 (aviso de IA ya resuelto con el preludio); costo de llamada a móvil | Lanzamiento jue 12-nov |
| 3 | Reino Unido | Mismo idioma que US (valida el creativo en inglés); CPM $13–17, mitad de US | CAC base $20 contra $11.8: no cierra sin CTR ≥ 2.5 % y CVR ≥ 5 % | mar 17-nov, con PR; pausa en semana BFCM |
| 4 | EE. UU. y US hispano | Mayor volumen y WTP ($14.99–24.99); D7 permite llamadas con consentimiento escrito | CPM Q4 $30, CAC base $37.5; solo con bundle ≥ $20 y creativos con CTR ≥ 3 % | Ventana 1–8 dic (el CPM "afloja" en diciembre); US hispano usa creativos ES con CTR probado |

**Países descartados por ahora:** Brasil (CPM IG $2.4–5.6) no entra porque no hay agente pt-BR, textos legales ni precio local; Colombia/Chile/Argentina requieren aprobación de Juan (sección 12). Nada de TikTok pagado en la fase de $500: la investigación no valida su CAC para este producto (mediana de 40 anunciantes, baja confianza).

## 4. Reparto de los $500 iniciales

Regla D1: hasta $500 antes de la primera venta real. Se libera en tramos: si el primer tramo no genera ventas, el resto no se gasta.

| País | Total | Ángulo A Reacción | Ángulo B Confianza | Ángulo C Recuerdo | Fase y fechas |
|---|---|---|---|---|---|
| México | $150 | $35 prueba + $20 ganador | $35 prueba + $15 ganador | $35 prueba + $10 ganador | Prueba 3–9 nov ($105, 7 días, $5/día por conjunto); ganadores 10–16 nov ($45) |
| España | $200 | $30 + $30 + $15 | $30 + $15 + $10 | $30 + $25 + $15 | Prueba 12–16 nov ($90); ventana de PR 17–23 nov ($70); semana BFCM 24–30 nov en mantenimiento ($40, ≤ $5.7/día) |
| Reino Unido | $90 | $25 + $20 | — | $25 + $20 | 17–23 nov ($50) con los dos ángulos ganadores de MX/ES; BFCM $0; 1–10 dic ($40) |
| EE. UU. y US hispano | $60 | — | — | $60 (bundle primero) | 1–8 dic, solo si pasa la puerta (sección 7); si no, se mueve al país con mejor CAC el 9-dic |
| **Total** | **$500** | | | | |

El reparto por ángulo en las columnas "ganador" es provisional: se reasigna el lunes según CTR, costo por checkout iniciado y compras.
Los países MX y ES alcanzan los $150 de la regla de escalado; UK y US no, así que su veredicto de país llega con la reinversión posterior.

**Compras esperadas con $500 [EST]:** conservador ≈ 28 ventas (ROAS 0.87, congelar y revisar); base ≈ 50 ventas (ROAS 1.55, reinvertir lo mismo); bueno ≈ 113 ventas (ROAS 3.5, reinvertir hasta 2×). ROAS base por país: MX 2.3, ES 1.6, UK 1.0, US 0.5. Para cumplir CAC ≤ 60 % hace falta ROAS ≥ 1.67 en el país.

**Reinversión (después de la primera venta):** cada lunes 07:00 se calcula el ROAS de la semana (ingresos atribuidos / gasto). ROAS ≥ 2.0: hasta 2× lo gastado; 1.2 a 2.0: lo mismo; < 1.2: congelar y revisar; nunca más de 2× por semana. Dejo el dinero de la semana siguiente asignado al país con mejor CAC, no a los cuatro por igual.

## 5. Estructura de campañas Meta

Cuenta publicitaria única (Lumen Labs), un Pixel por dominio de producto, y API de Conversiones desde el webhook de Polar con `event_id` para evitar duplicados. Convención de nombres: `SANTA_<PAIS>_<FASE>_<AAAA-MM>` / conjunto `A-REACCION` / anuncio `A1`.

| Elemento | Definición |
|---|---|
| Campaña | Una por país: `SANTA_MX_T1_2026-11`, `SANTA_ES_T1_2026-11`, `SANTA_UK_T1_2026-11`, `SANTA_US_T1_2026-12` |
| Objetivo Meta | Ventas / Compras. Presupuesto por conjunto (ABO) durante la prueba para lecturas limpias; al elegir ganador, se pasa a un solo conjunto con presupuesto de campaña |
| Conjuntos | Uno por ángulo (A-REACCION, B-CONFIANZA, C-RECUERDO). En UK solo A y C; en US solo C |
| Creativos | 3 por conjunto (un máster + 2 variantes de gancho de los primeros 3 s) = 9 por país en prueba. Se suma un cuarto y quinto creativo solo al ganador (máx. 5) |
| Audiencia | Adultos 25–44 (MX), 28–45 (ES), 28–44 (UK/US); amplia, sin intereses de niños (los anuncios van a los padres, nunca a menores); idioma del país |
| Exclusiones | Compradores del Pixel (180 días); empleados; menores de edad. Sin subir listas de correos a Meta (el aviso de privacidad no lo cubre; `legal-compliance` lo decide si algún día se quiere) |
| Ubicaciones | Reels, Stories y Feed vertical 9:16 (formato principal 15–25 s). Sin Audience Network |
| Atribución | 7 días clic, 1 día visualización para optimizar; el CAC oficial se reporta con 7 días clic |
| Idioma y moneda del anuncio | MX: "Santa", MXN; ES: "Papá Noel", EUR; UK: "Santa" / "Father Christmas" (probar), GBP; US: "Santa", USD; US hispano: "Santa" en español, USD. Si Polar no cobra en MXN/EUR/GBP **[no verificado]**, se muestra USD y se reporta el CAC contra USD |
| Revisión | Cada creativo con su texto pasa por `legal-compliance` (24 h) antes de publicarse; sin menores reales sin autorización escrita; sin marcas de terceros (PNP, Elf on the Shelf, Rudolph, Grinch) |

Con presupuestos de $5/día por conjunto Meta no sale de la fase de aprendizaje (necesita ~50 eventos por semana por conjunto). Por eso en la prueba **decido por indicadores adelantados** (CTR de enlace, costo por checkout iniciado, hold rate) y uso las compras como desempate; el CAC por país solo se lee a nivel de campaña tras $150.

**Evento de optimización:** `Purchase` con valor y moneda. Eventos de apoyo para decidir: `ViewContent` (landing), `InitiateCheckout`, `AddPaymentInfo` si Polar lo permite. Los nombres finales los fija `metricas` en `analytics/events.ts`. A Meta solo se envían eventos de embudo y el valor: nunca el nombre ni la edad del niño, ni su voz.

## 6. Umbral de pausa escrito por campaña

CAC objetivo = 60 % del AOV. Pausa de país = CAC > 80 % del AOV tras $150 o reembolsos > 8 %. Todo valor en USD (conversión de `metricas`).

| Campaña | Presupuesto | AOV | CAC objetivo | CAC de pausa (80 %) | Pausa por gasto sin compra | Pausa de creativo | Lectura del país |
|---|---|---|---|---|---|---|---|
| SANTA_MX | $150 | $12.9 | ≤ $7.7 | > $10.3 | $45 sin una sola compra | ≥ 1,500 impresiones y CTR < 1.0 % | A los $150 |
| SANTA_ES | $200 | $17.8 | ≤ $10.7 | > $14.2 | $75 sin una sola compra | ≥ 1,500 impresiones y CTR < 1.0 % | A los $150 |
| SANTA_UK | $90 | $19.7 | ≤ $11.8 | > $15.8 | $60 sin una sola compra | ≥ 1,500 impresiones y CTR < 1.0 % | Con la reinversión (no llega a $150 solo) |
| SANTA_US | $60 | $20.0 | ≤ $12.0 | > $16.0 | No aplica (a $37 de CAC base, $60 sin compra es normal); se pausa por CTR < 2 % o por 0 checkouts iniciados con ≥ 150 clics | ≥ 1,500 impresiones y CTR < 2.0 % | Con la reinversión |

Los umbrales de "gasto sin compra" salen de una cuenta de Poisson: con el CAC base, la probabilidad de cero ventas es de 1 % o menos en MX y ES, y 5 % en UK, así que un cero a ese gasto indica un problema del embudo o del seguimiento, no mala suerte.

Reglas comunes a todas las campañas:
1. Creativo: se pausa con CTR de enlace < 1.0 % tras 1,500 impresiones; se mantiene con CTR ≥ 2 %; se duplica (nueva variante de gancho) con CTR ≥ 3 %. Frecuencia > 3 en 7 días: se rota.
2. Embudo roto: ≥ 150 clics y 0 checkouts iniciados, o checkouts sin compras con ≥ 10 `InitiateCheckout`, pausa total y aviso a `arquitecto` y `metricas` (puede ser un fallo de cobro o de seguimiento).
3. Reembolsos > 5 %: no se escala ese país; > 8 % con ≥ 10 pedidos: pausa del país.
4. Contracargos > 3 en 30 días o > 0.9 % de las ventas, o una queja de un padre por una llamada: pausa total y aviso a `legal-compliance` y al director (disparador de la sección 4 de `docs/legal/riesgos-y-mitigaciones.md`).
5. Semana BFCM (24–30 nov): el presupuesto diario no sube sobre el promedio de la semana anterior; UK y US quedan en cero esa semana porque el CPM es de 2 a 3×.
6. Una campaña que cumple el umbral y tiene CAC ≤ 60 % recibe la reinversión; el KPI "% del presupuesto en campañas que cumplen umbral" se reporta cada lunes.

## 7. Puerta de EE. UU. y US hispano (D7: hay llamadas con consentimiento escrito)

Se liberan los $60 solo si se cumplen las cuatro:
1. Un creativo con CTR de enlace ≥ 3 % medido en ≥ 3,000 impresiones en MX, ES o UK.
2. Landing de EE. UU. con el bundle $24.99 primero (el ticket debe ser ≥ $20) y cobro en USD.
3. Checkout con el consentimiento escrito de D7 funcionando y aprobado por `legal-compliance` y `qa-redteam`.
4. Reembolsos < 5 % en los países ya abiertos.

El objetivo de EE. UU. es CAC ≤ $15 sobre el bundle. Con CPM $30 hace falta CTR 3 % y CVR ≥ 6.7 %; con el CPM de diciembre (alrededor de $25 [EST]) basta CVR 5.6 %. Por eso la ventana es 1–8 dic y no noviembre.
US hispano: mismo gate, mismos creativos en español con CTR probado; el CPM es el de EE. UU., así que no es más barato [no verificado: no hay dato propio de CPM por idioma].

## 8. Calendario

Semanas de ejecución: martes a domingo; reporte del director los lunes 07:00. Un hito arranca cuando el anterior cumple su criterio; las fechas son objetivo.

| Fecha | Hito | Qué ocurre | Dependencia |
|---|---|---|---|
| 19–30 oct | Preparación | Dominio y landing por país, cuenta y Pixel de Meta, guiones, autorizaciones de niños, lista de medios, páginas SEO | H0 (Juan: Meta, dominio, Polar), brief de `docs/creativos/santa/brief-semana-1.md` |
| 26 oct–1 nov | Grabación | Reacciones reales de niños en las pruebas de H4, con autorización | H4 en curso; lista para Juan en el brief |
| 2 nov | Revisión legal de los 9 creativos | `legal-compliance` en 24 h | H4 aprobado |
| **mar 3 nov** | **Soft launch MX** | $105 de prueba, 3 ángulos × 3 creativos | H4 cumplido |
| lun 9 nov | Lectura MX | Ganadores por CTR, costo por checkout iniciado y compras; se decide qué ángulo pasa a ES; se evalúa la puerta de EE. UU. | |
| 10–12 nov | Pitch a prensa bajo embargo | Kit de prensa y pedidos de cortesía a periodistas (sección 10) | |
| **jue 12 nov** | **Lanzamiento ES** | $90 de prueba en castellano ("Papá Noel") | MX con compras |
| **mar 17 nov** | **Notas de prensa + Lanzamiento UK** | Notas 07:00 hora local en MX, ES y UK; ES sube a $70 de ventana de PR | |
| mié 18 nov | PR, segundo día | Seguimiento y segundo ángulo de nota | |
| **vie 20 nov** | **Fecha dura: vendiendo** | Si no hay una venta real entregada, ver contingencia abajo | |
| 24–30 nov | Semana BFCM | Presupuesto sin subir; UK y US en cero; ES y MX en mantenimiento | |
| 1–8 dic | Ventana EE. UU. y UK | $60 US (si pasa la puerta) y $40 UK | |
| **jue 10 dic** | **Corte** | Veredicto por país con las reglas (sección 9) | |
| 11–22 dic | Concentración | Presupuesto en los países que cumplen; bundle de Nochebuena como oferta principal; último pedido para la llamada del 24-dic: mar 22-dic | Capacidad de ElevenLabs (> $100/mes lo aprueba Juan) |
| 15–22 dic | Segunda ola de PR | Guías de Reyes Magos | |
| jue 24 dic | Nochebuena | Segunda llamada del bundle | |
| **sáb 26 dic** | **Reyes Magos** | Todo el presupuesto restante de Santa pasa a Reyes (ES, MX, US hispano con el gate); correo y WhatsApp a compradores con 30 % de descuento | H8 |
| 26 dic–4 ene | Ventas de Reyes | Último pedido para la llamada de la noche del 5-ene: lun 4-ene; el CPM de enero es el más bajo del año | |
| 5 ene | Cierre | Post-mortem (H9) | |

**Contingencia si H4 se retrasa:** si H4 no está aprobado el vie 6-nov, se salta el soft launch aislado de MX y se lanzan MX y ES juntos el jue 12-nov con $60 por país de prueba. Si el 17-nov no hay venta, se reasigna la ventana de PR a la prueba de MX y ES con el mejor ángulo, porque el producto debe vender antes del 20-nov. El gate de venta exige una llamada entregada de punta a punta, así que el selector de fecha de la landing propone por defecto "esta noche" o "mañana por la noche" mientras dure la ventana de prueba (sugerencia a `lider-proyecto` y `ux-ui`).

## 9. Corte del 10-dic y escalado

| Condición del país (tras ≥ $150 o con la reinversión) | Acción |
|---|---|
| CAC ≤ 60 % del AOV y reembolsos < 5 % | Escalar con la regla de ROAS |
| CAC entre 60 % y 80 % | Mantener sin escalar; rotar creativos; probar el ángulo ganador de otro país |
| CAC > 80 % o reembolsos > 8 % | Pausar el país |
| Todos los países > 60 % al 10-dic | Concentrar en el mejor país y avisar al director; el criterio del capítulo es "CAC > 60 % del ticket promedio" |

## 10. Plan de PR (17–18 nov)

La prensa publica cada año guías de "cómo recibir una llamada de Papá Noel o de los Reyes" (Xataka Móvil 24-dic-2024, Applesfera 4-ene-2026, Chilango y Yucatán) y notas de "Santa con IA llama a tu hijo" (WGN, WOKV y AOL, nov-2024). PNP lanzó "Talk to Santa" el 17-nov-2025, así que nuestro ángulo es otro: llamada saliente a casa, control del padre, sin suscripción, aviso claro de que es una IA.

| País | Medios (✓ = cubrió el tema según la investigación; "candidato" = propuesto, sin verificar) | Ángulo | Fecha |
|---|---|---|---|
| ES | Xataka Móvil ✓, Applesfera ✓; candidatos: Genbeta, Hipertextual, Madresfera | "Reyes Magos y Papá Noel por llamada con IA, con control de los padres" | Pitch 10–12 nov bajo embargo; envío mar 17-nov 07:00 CET; seguimiento mié 18-nov |
| MX | Chilango ✓, Yucatán ✓; candidatos: Xataka México, medios de maternidad | "Santa llama a tu hijo: sin app, MXN 199" | Igual que ES (07:00 CST) |
| UK | Candidatos [no verificado, el agente confirma contacto y cobertura previa]: Metro, TechRadar, Mumsnet (sección de campañas), prensa local | "AI Santa call that parents control, no subscription" | mar 17-nov 07:00 GMT |
| US | WGN ✓, WOKV ✓, AOL ✓, FOX 10 ✓ (cubrieron SantaPhoneCalls y PNP); candidatos: Parents, Today Parents | "Llamada de Santa con consentimiento y borrado a los 30 días" | Ola separada 1–3 dic, junto con la ventana de EE. UU. y si pasa la puerta |

- Kit de prensa (lo prepara `productor-creativo` con `soporte-postventa`): nota de 1 página en ES y EN, demo de audio (adulto, nunca un niño sin autorización), certificado de muestra, FAQ de privacidad, capturas y contacto `prensa@lumen-labs.co`.
- Pedidos de cortesía para periodistas: máximo 20 (≈ $16–29 de costo variable). No son descuentos al público; los registra `metricas` como cortesía. Lo notifico al director-portafolio.
- Vocero: por D9 no se expone el nombre ni la foto de Juan; la marca firma como Lumen Labs. Una historia de "empresa operada por agentes de IA" interesaría a la prensa tecnológica, pero la aprueba Juan antes de usarla.
- Sin comunicados pagados (PR Newswire y similares cuestan más que el presupuesto de ads): un gasto así es presupuesto nuevo y lo decide Juan.
- Segunda ola Reyes: pitch 15–22 dic a los mismos medios de ES y MX; seguimiento 28-dic–2-ene (las guías de 2025 salieron el 3–4 de enero).

## 11. Canales orgánicos automatizables

| Canal | Qué hacemos | Cuándo rinde |
|---|---|---|
| UGC con marca de agua | Cada llamada genera un video-recuerdo con audio, con marca de agua y enlace, que el padre comparte (la investigación lo señala como motor orgánico principal). El padre decide compartir; nosotros no republicamos sin permiso escrito | Desde la primera semana |
| SEO programático | Ver lista abajo. Plantillas con contenido real, no páginas vacías por nombre de niño | Reyes y Navidad 2027; muy poco efecto en nov-2026 |
| Reseñas | Correo post-llamada pide reseña real (4.0 es el umbral para apagar el producto) | Todo el tiempo |
| Cross-sell | Compradores de Santa a Colorear (hasta 20-dic) y Santa a Reyes con 30 % (26-dic) | Dic |

**Lista de páginas SEO (ES / EN):**

| Página | Consulta objetivo | Idioma y país |
|---|---|---|
| `/llamada-de-santa-claus` | llamada de Santa Claus a mi hijo | ES, MX y US hispano |
| `/llamada-de-papa-noel` | videollamada Papá Noel | ES, España |
| `/llamada-reyes-magos` | videollamada Reyes Magos | ES y MX, pico 26-dic a 5-ene |
| `/call-from-santa` | call from Santa for kids | EN, US |
| `/santa-phone-call-uk` | Santa phone call for children | EN, UK |
| `/es-segura-la-llamada-de-santa-con-ia` y `/is-the-ai-santa-call-safe` | privacidad y IA en llamadas a niños | ES y EN; es la página de confianza del ángulo B |
| `/como-hablar-con-santa-por-telefono` | guía para padres | ES |
| `/certificado-lista-de-los-buenos` | certificado de Santa | ES y EN |
| `/carta-de-santa-personalizada` | carta de Santa PDF | ES y EN |
| `/llamada-santa/<nombre>` (fase 2) | solo para nombres con volumen en Search Console | ES y EN |

## 12. Supuestos, dudas y cosas que escalo

| Tema | Detalle | Quién |
|---|---|---|
| Interpretación de los $500 | Entiendo $500 como el sobre que puedo gastar antes de la primera venta y, tras ella, el saldo no gastado más la reinversión por ROAS. Si el director quiere que la reinversión reemplace al saldo, ajusto el reparto | `director-portafolio` |
| Países futuros | Colombia (CPM Facebook $1.6–3.8) y Chile pedirían aprobación de Juan por estar fuera de la lista; propongo pedirlo solo si MX cierra CAC ≤ 60 % tras $150. Brasil necesita agente pt-BR | Juan, con recomendación |
| Moneda de cobro | Precios locales dependen de que Polar cobre en MXN, EUR y GBP **[no verificado]** | `pagos-finanzas` |
| Hold rate, tipos de cambio y proporciones de bundle | Son hipótesis; los reemplaza `metricas` con datos reales desde la semana 1 | `metricas` |
| Anuncios sobre niños en Meta | No pude leer la política oficial (ver R10 de `riesgos-y-mitigaciones.md`) | `legal-compliance` |
| Afirmaciones en anuncios | Prohibido "cumple COPPA/RGPD", "100 % seguro" o "nada se guarda". Permitido solo lo que dice el aviso: pago único, sin suscripción, borrado de la grabación a los 30 días, el padre elige día y hora | `legal-compliance` |
| Aviso de IA | Todos los anuncios llevan el rótulo "Voz de Santa generada con IA" | `productor-creativo` |

KPI que reporto cada lunes: CAC por país contra 60 % del AOV, CTR de enlace por creativo (meta ≥ 2 %), ROAS semanal, % del presupuesto en campañas que cumplen umbral, reembolsos por país.
