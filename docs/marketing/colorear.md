# Tu familia para colorear: plan de go-to-market

`marketing-growth` · v1 · 18-oct-2026 · Capítulo: `docs/productos/colorear.md` · Hitos: `docs/planes/colorear-hitos.md` · Investigación: `docs/investigacion/b2c.md` (ficha 3 y sección 4) · Marca paraguas: Lumen Labs
Reglas que mandan: `docs/reglas-de-decision.md` (D1, D3). **[EST]** = cálculo propio con los benchmarks; **[no verificado]** = no pude confirmarlo.

## 1. Resumen de decisiones (D3)

| Decisión | Resultado |
|---|---|
| Mercados de arranque, en orden | 1. México (ads con preview gratis) · 2. España (ads, condicionado) · 3. EE. UU. y UK por Pinterest y Etsy sin ads · 4. Ads en EE. UU. solo con pack ≥ $20 y CTR ≥ 3 % |
| Presupuesto antes de la primera venta | $500 (D1; reemplaza los $300 del capítulo): MX $270 · ES $130 · reserva $100 liberable por resultados |
| Gancho | Preview gratis de la página 1 en 20 s |
| Evento de optimización | Compra (`Purchase`); `PreviewGenerated` como indicador adelantado |
| Aprobación de Juan | Ninguna; todo está en países ya analizados |

## 2. Promesa, posicionamiento y ángulos

**Promesa en una frase**
- ES: "Sube 5 fotos y en 60 segundos tu familia es la protagonista de un libro para colorear, listo para imprimir en casa; la primera página es gratis."
- EN: "Upload 5 photos and in 60 seconds your family stars in a coloring book you can print at home; the first page is free."

**Posicionamiento:** no vendemos una conversión de foto a dibujo (cualquier chatbot hace una página gratis). Vendemos un libro terminado: historia con el nombre del niño, personaje consistente en 24 o 48 páginas, formato Letter/A4 y revisión automática de calidad, en 60 segundos y sin envío. Frente a los libros de Etsy ($8–29.50 + envío, 1–3 días) ganamos en velocidad; frente a lo gratis, en el resultado final. Nunca competimos por precio.

| # | Ángulo | Qué promete | Hipótesis (semana 1) |
|---|---|---|---|
| A | Morph | "Tu foto se vuelve un dibujo para colorear. Prueba gratis la primera página" (transformación en 3 s) | CTR de enlace ≥ 2.5 % y costo por preview ≤ $0.75 en MX |
| B | Fiesta | "12 niños, 12 libros con [nombre] en la portada. Los imprimes tú" (Pack Fiesta $16.99) | Mayor AOV ($16.99) y CAC similar al A; evergreen después de Navidad |
| C | Regalo | "El regalo que sí van a usar: un libro con sus nietos o con tu familia, hoy mismo" (Navidad y Reyes) | Mejor conversión de preview a compra en 1–24 dic; sin envío es la ventaja de último minuto |

Compra y subida de fotos: la persona que sube fotos de menores debe ser familiar (casilla C1-F del archivo legal, R20). Los abuelos sí pueden comprar y subir.

## 3. Mercados: datos, CAC y por qué

**CPM usados** (b2c sección 4, Instagram con +30 % de Q4 sobre el rango bajo): MX $5 (rango $3–5), ES $10 (rango $7–10). El CPM de Reels es 20–40 % más barato que feed vertical. Fórmula: CAC = CPM / (1000 × CTR × CVR). Se suma ≈ $0.3 por compra de previews gratis (≈ $0.034 por imagen, ≈ 10 previews por compra [EST]).

| País | AOV [EST] | Conservador (CTR 1.5 %, CVR 3 %) | Base (CTR 2 %, CVR 5 % con preview) | Bueno (CTR 3 %, CVR 6 %) | CAC objetivo (60 %) | Contribución base (% del ticket) |
|---|---|---|---|---|---|---|
| México | $13.5 (70 % a MX$229 ≈ $12.1; 30 % pack a $16.99) | $11.1 | **$5.0** | $2.8 | $8.1 | $5.5 (41 %) |
| España | $14.8 (70 % a 11,99 € ≈ $13.8; 30 % pack) | $22.2 | **$10.0** | $5.6 | $8.9 | $1.7 (12 %) |
| EE. UU. (Meta) | $17 (pack $16.99–19.99) | — | $16–25 según la ficha 3 | — | $10.2 | negativa; sin ads |
| EE. UU. y UK (Pinterest y Etsy) | $12.99 / $19.99 | No aplica (sin pauta) | CAC en dinero = $0 | — | — | solo costos variables |

Supuestos: contribución = AOV − Polar (5 % + $0.50 + 1.5 % no-EE. UU.) − IA ($1.05 por 24 págs; $2.00 por 48; promedio $1.3) − previews − CAC. Tipos de cambio como en `marketing/santa.md`.

| Orden | País | Por qué | Riesgo |
|---|---|---|---|
| 1 | México | CPM más bajo; CAC base $5 contra $8.1 objetivo; el morph es muy clicable; los previews gratis suben el CVR (ficha 3: 5 %) | Ticket bajo; costo de previews si hay abuso |
| 2 | España | WTP similar al US a mitad del CPM; el CAC base ($10) queda sobre el objetivo ($8.9) y la contribución base (12 %) está bajo el 20 % que pide la regla para mantener un producto | Solo escala si el creativo de MX supera CTR ≥ 2.5 %; por eso va con menos presupuesto |
| 3 | EE. UU. y UK por Pinterest y Etsy, sin ads | Intención de compra de regalo en Navidad; Etsy valida la categoría (vendedor top con 186.8k ventas lista un libro con fotos a $29.50 impreso); costo en dinero ≈ $0 | Etsy puede no permitir un servicio con subida de fotos ni pagar en Guatemala **[no verificado]**; ver sección 9 |
| 4 | Ads en EE. UU. | Mayor ticket | Bloqueado por regla: pack ≥ $20 y CTR ≥ 3 %. El pack de 48 páginas cuesta $19.99, un centavo bajo el umbral; propongo a `pricing` probar $21.99 (+10 %, dentro del margen que decide solo) |

Brasil y Colombia: CPM atractivos (FB BR $1.8–4.2, CO $1.6–3.8) pero sin portugués ni aprobación de país; los dejo como candidatos para 2027 (Colombia requiere aprobación de Juan).

## 4. Reparto de los $500

| País | Total | A Morph | B Fiesta | C Regalo | Fases |
|---|---|---|---|---|---|
| México | $270 | $35 + $25 + $45 = $105 | $35 + $15 + $30 = $80 | $35 + $15 + $35 = $85 | Prueba 17–23 nov ($105); semana BFCM en mantenimiento 24–30 nov ($55, ≤ $7.9/día); 1–22 dic ($110) |
| España | $130 | $25 + $20 = $45 | $25 + $15 = $40 | $25 + $20 = $45 | Prueba 19–25 nov ($75); 1–15 dic ($55) solo si el CTR de MX ≥ 2.5 % |
| Reserva | $100 | | | | 1–22 dic al mejor país; 26-dic–4-ene para Reyes (regalo del 6-ene); o prueba de EE. UU. si pasa la puerta (sección 6) |
| **Total** | **$500** | | | | |

Compras esperadas con $500 [EST]: conservador ≈ 30 sin usar la reserva (la reserva no se libera si el ROAS es bajo), base ≈ 83 (reserva en MX), bueno ≈ 141. Pinterest y Etsy suman ventas sin gasto en pauta. La reinversión semanal sigue la regla de ROAS de `reglas-de-decision.md`.
Aviso de conflicto: el hito H8 de `colorear-hitos.md` y `portafolio-hitos.md` dicen que no se gasta más de la prueba antes de 30 ventas; la regla D1 de reinversión por ROAS es posterior. Aplico D1 y le pido al director-portafolio que lo confirme.

## 5. Estructura de campañas Meta

| Elemento | Definición |
|---|---|
| Campaña | `COLOREAR_MX_T1_2026-11` y `COLOREAR_ES_T1_2026-11` |
| Objetivo | Ventas / Compras; ABO en la prueba |
| Conjuntos | A-MORPH, B-FIESTA, C-REGALO |
| Creativos | 3 por conjunto (máster + 2 ganchos) = 9 por país en prueba; hasta 5 en el ganador |
| Audiencia | MX: adultos 25–50, amplia; C-REGALO también 45–65 (abuelos). ES: 28–55. Sin segmentación por menores |
| Exclusiones | Compradores (Pixel, 180 días); empleados; menores. Los compradores de Santa **no** se excluyen: son el mejor público de venta cruzada |
| Destino | Landing con el generador de preview (sin registro previo; correo solo para recibir el PDF) |
| Eventos | `ViewContent`, `PreviewStarted`, `PreviewGenerated`, `InitiateCheckout`, `Purchase` (valor y moneda). Nombres finales por `metricas`. A Meta no se envían fotos, nombres ni datos de los niños |
| Revisión | `legal-compliance` en 24 h por creativo; sin menores reales sin autorización escrita; sin marcas de terceros (Crayola, Disney, personajes con licencia) |

Mismo criterio que en Santa: con estos presupuestos se decide por CTR de enlace, costo por preview y costo por checkout iniciado; el CAC por país se lee a nivel de campaña.

## 6. Umbral de pausa escrito por campaña

| Campaña | Presupuesto | AOV | CAC objetivo | CAC de pausa (80 %) | Pausa por gasto sin compra | Creativo | Previews |
|---|---|---|---|---|---|---|---|
| COLOREAR_MX | $270 | $13.5 | ≤ $8.1 | > $10.8 | $50 sin una compra | CTR de enlace < 1.0 % tras 1,500 impresiones | Costo por preview > $1.5, o más de 25 previews por compra |
| COLOREAR_ES | $130 | $14.8 | ≤ $8.9 | > $11.8 | $70 sin una compra | Igual | Costo por preview > $2.5 |

Reglas comunes:
1. Lectura de país a los $150 gastados (MX los alcanza el 30-nov; ES solo con reinversión): escalar con CAC ≤ 60 % y reembolsos < 5 %; pausar con CAC > 80 % o reembolsos > 8 %.
2. Costo por preview objetivo ≤ $0.75 (MX) y ≤ $1.5 (ES) si 15 % de los previews se convierte [EST]; son hipótesis que `metricas` recalibra con la semana 1.
3. Abuso del preview gratis: un preview por dispositivo y correo por día, sin cuenta; si el gasto en previews supera 15 % del gasto en pauta, `arquitecto` limita la tasa antes de seguir.
4. Semana BFCM (24–30 nov): el presupuesto no sube sobre el promedio de la semana anterior.
5. Reembolsos > 5 % o una queja de un padre por una foto: no se escala; con > 8 % o una queja por fotos de menores, pausa total y aviso a `legal-compliance`.
6. Ads en EE. UU.: solo si CTR ≥ 3 % en ≥ 3,000 impresiones en MX o ES, pack ≥ $20, y checkout y retención de fotos (7 días) aprobados.

## 7. Pinterest y Etsy (EE. UU. y UK, sin ads)

| Canal | Plan | Medida de éxito | Riesgo |
|---|---|---|---|
| Pinterest | Cuenta de empresa con el dominio verificado; 3 pins por día en inglés (también ES) con video 9:16 del morph, antes/después y páginas de muestra; palabras clave: "custom coloring book from photos", "personalized coloring pages family", "coloring page of my dog", "christmas gift for grandparents"; el pin lleva al preview gratis con UTM | Previews por cada 1,000 impresiones del pin; ventas por pin | Sin historial de la cuenta: tarda semanas en rendir |
| Etsy | Tres fichas de descarga digital (24 págs $12.99, 48 págs $19.99, Pack Fiesta $16.99); primera foto: collage morph; título y etiquetas en EN y ES | Visitas, favoritos y ventas por ficha | Política de Etsy sobre contenido generado con IA y sobre servicios con subida de fotos; disponibilidad de pagos de Etsy en Guatemala, comisiones y retiros **[no verificado]**: `pagos-finanzas` y `legal-compliance` lo confirman antes de crear la ficha (H3) |

Fechas: cuentas y pines de preparación en H0; primeros pins el 9-nov con el prototipo (H2); fichas de Etsy y publicación continua desde el 17-nov si el riesgo de Etsy se aclara. Si Etsy no es viable, Pinterest + sitio siguen.

## 8. Calendario

| Fecha | Hito | Qué ocurre | Dependencia |
|---|---|---|---|
| 19 oct–1 nov | Preparación | Cuentas (H0), nombre y dominio, guiones, lista de autorizaciones | Juan: cuentas y dominio |
| 2–15 nov | Build (H1–H5) | Pipeline, legal de fotos, checkout, QA | Excepción de noviembre |
| 9–13 nov | Grabación | Sesión de manos coloreando, familias con autorización, página impresa (ver brief) | Prototipo de H2 |
| mar 17 nov | **Lanzamiento MX** | $105 de prueba, 3 ángulos × 3 creativos; Pinterest y fichas de Etsy | H5 aprobado |
| jue 19 nov | Lanzamiento ES | $75 de prueba | CTR de MX |
| 24–30 nov | Semana BFCM | Mantenimiento; sin descuentos mayores a 30 % (requieren a Juan) | |
| lun 30 nov | Lectura MX | Veredicto de país a los $150 | |
| 1–22 dic | Navidad | Presupuesto al ganador; 15–23 dic: "regalo de último minuto, imprímelo hoy" | |
| hasta 20 dic | Venta cruzada | Correo a compradores de Santa con Colorear | |
| 26 dic–4 ene | Reyes | Reserva a ES y MX con el ángulo C (Reyes Magos del 6-ene); venta cruzada a compradores de Reyes de Santa | |
| ene–may 2027 | Evergreen | Cumpleaños (ángulo B), Día del Niño MX (30-abr), Día de la Madre (MX 10-may; ES primer domingo de mayo), vacaciones de verano | |

## 9. Canales orgánicos automatizables

| Canal | Qué hacemos |
|---|---|
| UGC con marca de agua | El preview lleva marca de agua y enlace; el PDF pagado lleva un pie discreto. Fotos del libro coloreado que los clientes quieran compartir: solo con permiso escrito, nunca fotos de menores reutilizadas por nosotros sin permiso |
| SEO programático | Plantillas con generador de preview incrustado (contenido útil, no páginas vacías). Lista abajo |
| PR anual | Calendario abajo |

**Páginas SEO (ES / EN):**

| Página | Consulta objetivo |
|---|---|
| `/libro-para-colorear-personalizado` | libro para colorear personalizado con fotos |
| `/colorear-a-mi-perro` y `/colorear-a-mi-gato` | páginas para colorear de mi mascota |
| `/colorear-con-abuelos` | regalo para abuelos para colorear |
| `/souvenirs-cumpleanos-para-colorear` | libritos para colorear de cumpleaños |
| `/regalo-reyes-magos-colorear` | regalo de Reyes personalizado imprimible |
| `/custom-coloring-book-from-photos` | custom coloring book from photos |
| `/coloring-pages-of-my-dog` | coloring page of my dog |
| `/personalized-coloring-book-gift-for-grandparents` | christmas gift for grandparents coloring |
| `/birthday-party-favors-coloring-book` | party favor coloring books |
| `/como-imprimir-un-libro-para-colorear-en-casa` | guía de impresión Letter/A4 |

**Calendario anual de PR (medios que cubren cada tema; todos candidatos [no verificado] hasta que el agente confirme contacto y cobertura previa):**

| Tema y fecha | Medios y blogs | Ángulo |
|---|---|---|
| Navidad: nov–dic | Guías de regalos de blogs de maternidad y de imprimibles (ES: Madresfera, Etapa Infantil; MX: Chilango agenda; EN: blogs de Etsy y de imprimibles) | "El regalo de último minuto sin envío" |
| Reyes: 15–22 dic y 28-dic a 2-ene | Los mismos medios que cubren Reyes (Xataka Móvil y Applesfera para la herramienta) | Regalo del 6 de enero |
| Día del Niño MX: abr | Medios de agenda y familia de MX | Libro con tu hijo como protagonista |
| Día de la Madre: may | Mismos | "Un libro de tu familia para mamá" |
| Verano y vacaciones: jun–jul | Blogs de actividades infantiles | Actividad con impresora en casa |
| Vuelta a clases: ago–sep | Blogs de padres | Proyecto en casa |
| Halloween: oct | Blogs de manualidades | Versión temática |

## 10. Supuestos y escalaciones

| Tema | Detalle | Quién |
|---|---|---|
| $500 contra $300 del capítulo | Uso $500 (D1) | `director-portafolio` |
| Regla de las 30 ventas | Choca con la reinversión por ROAS; aplico D1 | `director-portafolio` |
| Pack de 48 págs a $19.99 | Un centavo bajo el umbral de $20 para ads en EE. UU.; probar $21.99 | `pricing` |
| Etsy | Política de IA, servicio con fotos y pagos en Guatemala **[no verificado]** | `pagos-finanzas`, `legal-compliance` |
| Moneda de cobro | MXN y EUR dependen de Polar **[no verificado]** | `pagos-finanzas` |
| Afirmaciones | No decir "tus fotos nunca se guardan": decir lo que dice el aviso (retención de 7 días, sin entrenamiento de modelos, sin reconocimiento facial) | `legal-compliance` |

KPI que reporto cada lunes: CAC por país contra 60 % del AOV, CTR de enlace (≥ 2 %), costo por preview, previews por compra, ROAS semanal, % del presupuesto en campañas que cumplen umbral.
