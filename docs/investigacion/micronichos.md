# Investigación de micronichos digitales 100% automatizables — Informe para Juan

**Fecha:** domingo 18 de octubre de 2026
**Método de trabajo:** 48 búsquedas web (WebSearch estándar y extendido) + ~45 lecturas completas de páginas (WebFetch) sobre App Store/Google Play, Trustpilot, Capterra, FMCSA/DOT, prensa sectorial (Overdrive, CCJ, Trucking Info, FreightWaves), Indie Hackers, Product Hunt, Hotmart, blogs de comparativas 2026, foros de desarrolladores (Intervals.icu, Slowtwitch) y medios en español (adn40, Por Esto, La Nación, Vistazo, Genbeta, Forbes España).
**Límite alcanzado:** la cuota de búsquedas del turno se agotó en la búsqueda 49. Las búsquedas que quedaron sin ejecutar (precios de "asesorías de visa" en México/Colombia, cifras de visas B1/B2 emitidas, listados en Acquire.com de exam-prep con MRR, newsletters de precios de acero) están marcadas en el informe como **no verificado**. Si quieres, puedes pedir un segundo turno de búsqueda para cerrarlas.

**Regla de evidencia:** cada cifra lleva URL y fecha de la fuente. Todo lo que no tiene URL está marcado como **[estimación]** o **[no verificado]**. Los escenarios de ingresos son supuestos explícitos, no pronósticos.

---

## 1. Resumen ejecutivo

Busqué, con disciplina de inversionista value, nichos donde (a) ya hay gente pagando hoy a competidores débiles, caros o anticuados, (b) la IA de 2026 (voz conversacional, reconocimiento de habla, LLMs baratos) permite un salto de calidad/costo que los incumbentes no han aplicado, y (c) todo —producto, entrega, soporte, marketing— es automatizable por una persona con Claude Code en 2–6 semanas y <$10k.

Evalué 20 candidatos. El **TOP 5** y el porqué en una línea:

| # | Micronicho | Por qué gana | Precio | Puntuación media |
|---|---|---|---|---|
| 1 | **"Inspección en inglés" — simulador de voz IA de inspección DOT/roadside para camioneros hispanos en EE. UU.** | Dolor nuevo y regulatorio con cifras duras: >60,000 infracciones ELP y ~19,000 órdenes fuera de servicio entre jun-2025 y mar-2026; FMCSA propuso en ago-2026 codificar ELP como fuera de servicio. Competidores: apps con 7 valoraciones o 50 descargas, cursos en video de $349–499, Berlitz a precio oculto. Ninguno usa roleplay de voz IA bien ejecutado en español. Reutiliza el stack ElevenLabs/Twilio que Juan ya domina. | $14.99/mes o $79/año | **7.7** |
| 2 | **Tutor de lectura en español (4–7 años) que ESCUCHA al niño leer** — fonética/silábico con reconocimiento de voz y voz IA | Padres hispanos pagan $14.99/mes a Lingokids (solo inglés) y Smartick cobra suscripción por lectura adaptativa; la oferta específica de lectura en español es anticuada (Leo con Grin: $9.99 pago único, 3.8★ con 4 valoraciones). Khan Kids sigue sin español tras años de peticiones. Nadie "escucha" al niño leer en español. Juan ya construyó esto para Manuela: ventaja real. | $9.99/mes o $59/año (familia) | **7.1** |
| 3 | **Preparación en español para el examen de licencia de seguros (Texas primero: Life, LAH, P&C)** | Dato demoledor: la tasa de aprobación de quienes toman el examen en español en Texas es ~28.6% vs ~48% en inglés (datos 2025). Solo en Texas hay >63,000 intentos de primera vez al año y ~4 de cada 10 asientos son repetidores. El examen SÍ se ofrece en español, pero la preparación (Kaplan, ExamFX, Aceable) es en inglés. Contenido 100% generable con LLM + revisión; margen >90%. Encaja con la formación financiera de Juan. | $49 pago único (90 días) o $29/mes | **7.7** |
| 4 | **Entrenador IA para trail/ultra que lee tus archivos de actividad (vert, tiempo en pies, caminata) y ajusta la semana en español/inglés** | Mercado probado: Vert.run $9.90–19.90/mes (85,000+ corredores), Runna $19.99/mes (Trustpilot 3.5★/1,114 reseñas), Athletica $19.90, Humango ~$30. Hueco documentado: en 2026 "ningún app maneja terreno/desnivel/tiempo en pies". Pero **riesgo alto**: Garmin congeló nuevas apps de desarrollador desde mayo-2026 y Strava exige suscripción y prohíbe intermediarios (jun-2026); Intervals Pro cerró el 12-oct-2026 por eso. Viable solo con subida de FIT + integración directa. | $9.99/mes o $79/año | **6.3** |
| 5 | **Simulador de voz IA, en español, de la entrevista de ciudadanía (N-400 + examen cívico 2025) y de la entrevista consular de visa B1/B2** | 878,500 naturalizaciones en FY2023 (México #1); nuevo examen desde 20-oct-2025 (128 preguntas, 12/20 para aprobar) eleva la dificultad. Incumbente fuerte en iOS (Citizenry, 13K valoraciones, $9.99–39.99) pero sin Android y con simulación básica; en visa B1/B2 el único indie detectado (Permito) factura $500/mes. Comparte motor de voz con el #1: tres nichos, un solo motor. | $9.99/mes o $24.99 pase 30 días | **6.9** |

**Qué aprovecha el conocimiento propio de Juan:** #3 (finanzas/seguros), #4 (ultra running), #2 (enseñar a leer a sus hijos). #1 y #5 aprovechan su stack técnico (ElevenLabs/Twilio/Supabase) más que su dominio. No forcé el ángulo: el candidato más "suyo" por dominio (newsletter de precios de acero) quedó fuera por falta de evidencia de demanda recogida en esta sesión (ver tabla).

**Recomendación de secuencia:** construir primero el **motor de roleplay de voz** (ElevenLabs Conversational AI + Supabase + Stripe + Next.js) y lanzar #1 (camioneros) en 3–4 semanas; clonarlo a #5 (ciudadanía) en 1–2 semanas más. En paralelo, #3 (seguros Texas) es el de margen más alto y build más corto (2–3 semanas, sin voz). #2 es el de mayor techo pero el build más largo (5–6 semanas) y con reglas de apps infantiles. #4 solo si se acepta el riesgo de plataforma.

---

## 2. Método (qué hice exactamente)

**a) Minería de dolor y disposición a pagar**
- **Tiendas de apps:** leí fichas completas (precios in-app, # valoraciones, reseñas críticas, fecha de versión 1.0) de CDL Help, CDL Prep 2026, Lingo Truck, Practice Stop, Citizenry, Leo con Grin, Runna, Vert.
- **Reseñas negativas:** Trustpilot de Vert.run (2.9★, 67), Runna (3.5★, 1,114), ELDT365 (4.2★, 16); Capterra de Birdeye (quejas de precio y contratos a 3 años) y MyReply (0 reseñas).
- **Regulación como señal de demanda:** memo FMCSA 20-may-2025 (evaluación ELP en dos pasos), criterios CVSA fuera de servicio 25-jun-2025, regla interina CDL no domiciliados 26-sep-2025, propuesta FMCSA 10-ago-2026.
- **Ingresos reales de micro-SaaS:** Indie Hackers (Permito: $500/mes), Product Hunt (epa608pass.ai), Acquire.com (listado de "AI listing copy" detectado pero la página no cargó).
- **Marketplaces digitales:** Hotmart (Método INSPIRA, Super PACK Lectoescritura — sin precio público), Gumroad/Etsy (solo listas genéricas; no útil).
- **Comparativas 2026 independientes:** runnerspicks (jul/sep-2026), aitoolsbakery (2026), redopositor (jun-2026), learnenglish.life (sep-2026).
- **Datos oficiales:** FMCSA (CLP/CDL por edad), MPI (naturalizaciones), TDI vía Aceable (tasas de aprobación por idioma), UNAM (lugares 2026), INEP/MEC (ENEM 4.8M).

**b) Lo que NO pude hacer:** Reddit bloquea la lectura directa y las búsquedas "site:reddit.com" devolvieron poco; Google Trends y herramientas de keywords no son accesibles sin sesión (volúmenes/CPC quedan como **[no verificado]**); la cuota de búsqueda se agotó antes de cerrar visas B1/B2 y Acquire.com.

**c) Evaluación:** 20 candidatos, 7 dimensiones (1–10), top 5 con ficha completa.

---

## 3. Tabla de candidatos (20) con puntuaciones y veredicto

Escala 1–10. Competencia: 10 = poca. Riesgo: 10 = bajo. "Media" = promedio simple de las 7 dimensiones.

| # | Candidato | Demanda | Compet. | Automat. | Margen | Vel. 1er $ | Adq. autom. | Riesgo | Media | Veredicto |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Simulador de voz IA de inspección DOT en inglés para camioneros hispanos | 8 | 8 | 9 | 7 | 8 | 8 | 6 | **7.7** | **TOP 5 (#1)** |
| 2 | Tutor de lectura en español 4–7 con reconocimiento de voz | 8 | 7 | 8 | 8 | 6 | 7 | 6 | **7.1** | **TOP 5 (#2)** |
| 3 | Prep. en español del examen de licencia de seguros (TX → FL/CA) | 7 | 8 | 9 | 9 | 7 | 7 | 7 | **7.7** | **TOP 5 (#3)** |
| 4 | Coach IA trail/ultra con lectura de FIT/Strava (vert, tiempo en pies) | 8 | 4 | 8 | 8 | 6 | 6 | 4 | **6.3** | **TOP 5 (#4), condicionado al riesgo de API** |
| 5 | Simulador de voz de entrevista de ciudadanía + visa B1/B2 en español | 8 | 5 | 9 | 7 | 7 | 7 | 6 | **6.9** | **TOP 5 (#5)** |
| 6 | Banco de preguntas CDL en español (permiso CLP) | 8 | 3 | 9 | 9 | 6 | 6 | 5 | 6.6 | Descartado: CDL Help (4.9★, 5.2K valoraciones, 10 idiomas, $24.99–29.99/mes) ya lo hace; además los estados están eliminando el examen en español (FL pasó a solo inglés; CA bajó de 25 a 7 idiomas). Se fusiona como módulo del #1. |
| 7 | Tests para oposiciones en España con IA | 9 | 3 | 8 | 8 | 5 | 6 | 6 | 6.4 | Descartado: OpositaTest tiene 1.6M registrados y 303,000 preguntas a €7.99–15.99/mes; el hueco "IA" existe pero exige exactitud legal (BOE) y la competencia es densa. Observar: práctica oral/supuestos prácticos con IA. |
| 8 | Simulador examen UNAM/IPN (México) | 9 | 3 | 9 | 9 | 4 | 6 | 6 | 6.6 | Descartado: UNAM lanzó simulador oficial gratis "Pruébate UNAM" y examen 100% en línea (2026); solo 20,923 lugares por examen; demanda estacional. |
| 9 | Simulado ENEM con IA (Brasil) | 10 | 2 | 9 | 9 | 4 | 6 | 6 | 6.6 | Descartado: el MEC lanzó app gratis con simulados y corrección de redacción por IA (oct-2025) para 4.8M inscritos; cursinhos gigantes. |
| 10 | EPA 608 (HVAC) en español | 4 | 6 | 9 | 9 | 6 | 6 | 7 | 6.7 | Descartado: volumen pequeño y ya existe epa608pass.ai (EN/ES, $29–39 único). Posible módulo futuro. |
| 11 | NCLEX para enfermeras latinoamericanas | 7 | 3 | 7 | 7 | 4 | 5 | 4 | 5.3 | Descartado: incumbentes enormes (UWorld), contenido clínico con responsabilidad, programas universitarios ya cubren el pathway (SWAU, Alamo Colleges). |
| 12 | Práctica de speaking IELTS/TOEFL con IA | 9 | 2 | 9 | 7 | 5 | 4 | 6 | 6.0 | Descartado: saturado (TalkFace, Prepex, Engnovate, Say AI, etc.). |
| 13 | Respuestas automáticas a reseñas de Google para pymes hispanas | 6 | 3 | 9 | 8 | 6 | 5 | 6 | 6.1 | Descartado: decenas de herramientas (MyReply $60–249/mes con 0 reseñas; Birdeye/Podium caros). Sin hueco defendible. |
| 14 | Bot de WhatsApp para pymes LatAm | 8 | 3 | 5 | 6 | 5 | 5 | 5 | 5.3 | Descartado: no es "configurar y olvidar", tarifas de Meta por conversación, onboarding humano, fricción de pago en LatAm. |
| 15 | Descripciones para Mercado Libre / listings inmobiliarios | 6 | 2 | 9 | 8 | 6 | 5 | 6 | 6.0 | Descartado: ChatGPT gratis lo resuelve; mercado inundado (estatepass lista decenas). |
| 16 | Alertas de licitaciones LatAm (Guatecompras, SECOP, Compranet) | 6 | 5 | 6 | 7 | 5 | 5 | 4 | 5.4 | Descartado: depende de scraping frágil de portales estatales; MINFIN Guatemala ya ofrece alertas; LicitaYa existe. |
| 17 | Generador de contratos de alquiler / manuales de empleado por país | 7 | 5 | 8 | 9 | 6 | 6 | 3 | 6.3 | Descartado por responsabilidad legal (condición 7). |
| 18 | Newsletter automática de precios de acero/commodities para compradores industriales LatAm (dominio de Juan) | 6 | 6 | 7 | 8 | 5 | 4 | 5 | 5.9 | **No verificado**: sin evidencia recogida en esta sesión (cuota agotada). Incumbentes caros (Fastmarkets/Platts) sugieren disposición a pagar, pero el canal de adquisición es B2B lento y el licenciamiento de datos es un riesgo. Candidato a segunda ronda. |
| 19 | Matemáticas tempranas en español (4–7) | 8 | 3 | 8 | 8 | 5 | 6 | 6 | 6.3 | Descartado como producto independiente: Smartick (IA adaptativa, 4–14 años) y Khan Kids (gratis) dominan. Se incorpora como módulo del #2. |
| 20 | Curso teórico ELDT en español como proveedor registrado FMCSA | 8 | 5 | 8 | 9 | 6 | 7 | 4 | 6.7 | Descartado por condición 7 (registro en Training Provider Registry, auditorías, obligación de reportar a FMCSA). ELDT365 lo vende a $20/curso EN/ES. Posible upsell futuro del #1 vía afiliación. |

---

## 4. Fichas completas del TOP 5

### #1 — "Inspección en inglés": simulador de voz IA de inspección DOT para camioneros hispanos

**Hook:** "Practica la inspección en inglés con un oficial de IA hasta que no te tiemble la voz. 10 minutos al día, desde el camión."

**Evidencia de demanda (con fuentes)**
- Desde el 25-jun-2025 la falta de inglés es causa de **fuera de servicio** (CVSA); entre el 25-jun-2025 y el 19-mar-2026 se emitieron **más de 60,000 infracciones ELP** y **~19,000 órdenes fuera de servicio**; en Roadcheck 2026 (12–14 mayo) hubo 360+ OOS por ELP = 9.1% de las OOS de conductor. FMCSA **propuso el 10-ago-2026 codificar** ELP como violación OOS (comentarios hasta 9-oct-2026). Fuente: Trucking Info, 2026 — https://www.truckinginfo.com/articles/when-language-stops-the-truck-the-return-of-elp-out-of-service-orders
- DOT: **~9,500 conductores** puestos fuera de servicio en 2025 por ELP (15-dic-2025) — https://foxbaltimore.com/news/nation-world/nearly-9500-truck-drivers-sidelined-as-dot-ramps-up-english-language-enforcement
- Proceso de evaluación en dos pasos (entrevista en inglés sin intérprete ni app; luego señales): memo FMCSA 20-may-2025 — https://prodriver.com/?p=9742
- Tamaño del grupo: 3.5M conductores de camión (BLS), **23.7% hispanos/latinos** (BLS/ATRI) → **[estimación derivada] ~830,000 conductores hispanos**. Fuente: https://es.open-exam-prep.com/blog/guia-completa-examen-cdl-licencia-comercial-espanol
- Regla de CDL no domiciliados (26-sep-2025): ~200,000 CDL + 20,000 CLP no domiciliados; FMCSA espera que ~194,000 salgan en 2 años (≈5% de la población CDL) — https://www.overdriveonline.com/regulations/article/15767991/fmcsa-to-force-nearly-200k-nondomiciled-cdl-holders-out-of-trucking . Implicación: los que se quedan (residentes/ciudadanos hispanos) tienen aún más presión de demostrar inglés.
- Antes de la aplicación de ELP, 21 estados ofrecían el examen escrito CDL en español; CA pasó de 25 a 7 idiomas (truckload.org, 2026) — https://www.truckload.org/wp-content/uploads/2026/07/English-Language-Proficiency-4.pdf . FL ya cambió a solo inglés (open-exam-prep). Tendencia: el mercado de "examen en español" se encoge; el de "inglés funcional para el camión" crece.
- Encuesta Overdrive (jun-2025, ~4,000 respuestas): 82% de camioneros apoya el OOS por falta de inglés — https://www.ccjdigital.com/regulations/article/15747119/truckers-lacking-english-should-be-outofservice-survey
- Escuelas añadiendo ESL y la Laredo Motor Carriers Association (200 empresas) dando clases gratis los fines de semana (AP/Fortune, 24-jun-2025) — https://fortune.com/2025/06/24/truckers-rush-learn-english-trump-order-considered-unfit-for-service
- Disposición a pagar probada en el segmento: CDL Help cobra $24.99–29.99/mes, $129.99–149.99/año y tiene 5.2K valoraciones (4.9★) — https://apps.apple.com/us/app/cdl-help/id6444388755 ; driving-tests.org cobra **$99/30 días** por CDL Premium+ELDT — https://driving-tests.org/cdl-premium/index-alt2.html

**Top 3 competidores (y debilidades)**
1. **English4Truckers** — $349 (grabado) / $499 (con 2 meses de clases en vivo); enfocado a hindi/punjabi; sin IA de voz; Kajabi — https://www.english4truckers.net/
2. **Lingo Truck: CDL English** — $5.99/sem, $19.99/mes, $29.99 lifetime; v1.0 del 19-dic-2025; 7 valoraciones; explicaciones en turco/ruso/hindi (español añadido después); diálogos, no roleplay de voz IA — https://apps.apple.com/us/app/lingo-truck-cdl-english/id6756713641
3. **Practice Stop: Inglés trailero** — "habla con un oficial IA"; 50+ descargas; sin reseñas; pago por sesiones (ago-2026) — https://play.google.com/store/apps/details?id=com.myfortuna.practice_stop&hl=en_US
   - Otros: **Paso (Panaceast)** en lanzamiento, sin precio, foco Laredo — https://www.panaceast.com/english-practice-truck-drivers ; **Berlitz** precio oculto, 1:1 de 3 h/día — https://www.berlitz.com/es-us/ingles_para_camioneros ; **PassYourCDL** simulador gratis de texto que empuja un libro de Amazon — https://www.passyourcdl.com/elp-practice.html

**Salto posible con IA 2026:** roleplay de voz en tiempo real (ElevenLabs Conversational AI o modelo speech-to-speech), con un "oficial" que varía acento, velocidad y preguntas (Nivel I/II/III, documentos, HOS, carga, señales dinámicas), feedback inmediato en español sobre comprensión y respuesta, y progresión por escenarios (báscula, parada por luz rota, Roadcheck). Los incumbentes venden videos grabados o diálogos de texto.

**Qué NO se puede automatizar (honesto):** garantizar que un inspector humano quede satisfecho; variabilidad de criterios por estado; captar flotas (ventas B2B) — se evita vendiendo solo a conductores individuales. Soporte: 95% con FAQ + agente IA; disputas de cobro vía Stripe.

**Build:** 3–4 semanas. Next.js + Supabase + Stripe + ElevenLabs Agents (web + opcional línea telefónica Twilio para practicar "desde el camión sin app"). Contenido: 150–300 escenarios generados y revisados con Claude, basados en el memo FMCSA y el MUTCD.

**Precio y modelo:** $14.99/mes con 45 min de voz incluidos; $79/año; paquete "Roadcheck en 14 días" $29 único. Mercado inicial: TX, CA, IL, NJ, FL (mayor población hispana de camioneros).

**Costo de IA por usuario/mes [estimación]:** voz conversacional ~$0.08–0.12/min todo incluido según tarifas públicas 2025-26 de ElevenLabs/OpenAI Realtime → 45 min ≈ $3.6–5.4; +$0.30 LLM/feedback. Margen bruto ≈ 60–68% tras Stripe. Si se usa STT+LLM+TTS por turnos en lugar de speech-to-speech, baja a ~$1.5–2.5 (margen ~80%).

**Canal de adquisición automatizable y CAC plausible:** TikTok/Reels/YouTube Shorts en español con diálogos de inspección generados por IA (texto→voz→video), publicados por programación; SEO programático "inglés para inspección DOT en [estado]", "qué preguntan en una inspección DOT en inglés", "ELP fuera de servicio qué hacer"; grupos de Facebook de camioneros hispanos (contenido, no spam); Meta Ads en español segmentado a intereses de trucking. CAC **[estimación]**: $10–25 por suscriptor pagado.

**Camino a los primeros $1,000:** 70 suscriptores a $14.99. Plan: 2 semanas de contenido TikTok automatizado + $500 en Meta Ads + listado en App Store/Play como PWA envuelta → objetivo primer $1,000 en semana 6–8 desde el lanzamiento.

**Escenario 12 meses (supuestos explícitos):** 200 pruebas gratuitas/mes en meses 1–3, 400/mes en meses 4–12 (orgánico+ads $1,000/mes); conversión a pago 25%; churn mensual 15% (es un producto de "examen": la gente se va cuando se siente lista). Resultado: ~500 suscriptores activos en mes 12 → **MRR ≈ $7,500**; ingreso acumulado 12 meses ≈ $45–55k. Conservador (mitad de tráfico, churn 20%): ~180 suscriptores → MRR ≈ $2,700.

**Riesgos top 3:** (1) Cambio político/regulatorio que relaje ELP (la propuesta de ago-2026 va en sentido contrario, pero es riesgo real). (2) Un grande (Babbel/Duolingo/ELD providers) lanza un curso para camioneros. (3) Sensibilidad de precio y churn alto; mitigación con plan anual y pase único.

**Puntuación:** demanda 8 · competencia 8 · automatización 9 · margen 7 · velocidad 8 · adquisición 8 · riesgo 6.

---

### #2 — Tutor de lectura en español (4–7 años) que escucha al niño leer

**Hook:** "El primer tutor que escucha a tu hijo leer en español, sílaba a sílaba, y le corrige con cariño. 10 minutos al día."

**Evidencia de demanda**
- Padres hispanos ya pagan suscripciones infantiles: **Lingokids $14.99/mes, $99.99/año, $139.99/año Plus** — pero enseña **solo inglés** (sep-2026) — https://learnenglish.life/reviews/lingokids/
- **Smartick** cobra suscripción por un método adaptativo con IA (matemáticas 4–14, lectura añadida 2024-25); precios reportados de forma inconsistente ("desde $9.99/mes" vs "~€49/mes") → **[no verificado; estimación: €40–49/mes en España]** — https://subger.com/en/service/smartick ; descripción de Smartick Lectura (IA adaptativa, 15 min/día, prueba 7 días) — https://www.genbeta.com/actualidad/smartick-no-solo-matematicas-su-nuevo-programa-lectura-sirve-ninos-aprendan-a-leer-jugando
- La oferta específica de lectura en español es anticuada: **Leo con Grin FULL** $9.99 pago único, 3.8★ con 4 valoraciones, Educaplanet (iOS 12+) — https://apps.apple.com/app/id1165056712 ; Aprender a leer 1 con Grin — https://apps.apple.com/es/app/aprender-a-leer-1-con-grin/id932280561
- Khan Academy Kids: hilo de soporte con peticiones de versión en español, sin respuesta de producto — https://support.khanacademy.org/hc/fr/community/posts/360067991032/comments/360014438331
- En Hotmart existen productos de pago para padres (Método INSPIRA 4–7 años, 6 meses con sesión semanal en vivo; Super PACK de Lectoescritura, ebook) — prueba de que padres hispanohablantes compran "enséñale a leer", aunque sin precio público — https://hotmart.com/es/marketplace/productos/metodo-inspira-aprende-a-leer-y-escribir/A103310452J ; https://hotmart.com/es/marketplace/productos/super-kit-de-lectoescritura-3-bonos-irresistibles/T105900375K
- Duolingo ABC y Homer: solo inglés **[conocimiento general, no verificado en esta sesión]**.
- Tamaño **[estimación]**: ~60M hispanos en EE. UU.; México ~9M niños de 4–7; España ~1.8M; la suma de hogares con niños de 4–7 que hablan español en EE. UU.+México+España+Colombia+Argentina supera los 20M. Volúmenes de búsqueda y CPC: **[no verificado]** (sin acceso a herramientas de keywords).

**Top 3 competidores (y debilidades)**
1. **Lingokids** — $14.99/mes; solo inglés; sin práctica de habla con corrección; quejas de cobro/cancelación (sikayetvar) — https://learnenglish.life/reviews/lingokids/
2. **Smartick Lectura** — fuerte en adaptatividad y marca en España; precio alto por niño **[estimación]**; no "escucha" leer en voz alta; orientado a sesión diaria rígida — https://www.genbeta.com/actualidad/smartick-no-solo-matematicas-su-nuevo-programa-lectura-sirve-ninos-aprendan-a-leer-jugando
3. **Leo con Grin / Educaplanet** — $9.99 único; diseño 2014–2016; sin voz IA; 4 valoraciones — https://apps.apple.com/app/id1165056712

**Salto posible con IA 2026:** (1) reconocimiento de habla infantil para evaluar lectura en voz alta (fonema/sílaba/palabra) con tolerancia a acentos (México, Centroamérica, España, EE. UU. bilingüe); (2) voz IA cálida que modela la pronunciación y celebra; (3) generación infinita de textos decodificables al nivel exacto del niño (método silábico/fonético: m-a, p-a → "mamá", "papá"...) con imágenes generadas; (4) informe semanal al padre en lenguaje natural. Nada de esto existe en español hoy.

**Qué NO se puede automatizar:** la motivación del niño (requiere presencia del padre 10 min/día; el producto debe diseñarse como "co-lectura guiada", no como niñera digital); la precisión del STT con niños de 4 años es imperfecta → el producto debe ser tolerante y nunca "castigar". Cumplimiento COPPA/App Store Kids: configurable, pero el tiempo de revisión de Apple no es automatizable.

**Build:** 5–6 semanas (PWA web primero, luego wrapper nativo). Juan ya tiene la base "Manuela Lee" y la app de matemáticas: eso reduce el riesgo de producto, no el de distribución.

**Precio y modelo:** $9.99/mes o $59/año por familia (hasta 3 niños). Mercado inicial: familias hispanas en EE. UU. (pagan en USD, tarjeta sin fricción) y México; luego España.

**Costo de IA por usuario/mes [estimación]:** STT ~$0.006–0.024/min × 10 min/día × 20 días = $1.2–4.8 (usar modelos económicos o batch) + TTS cacheado (<$0.30) + LLM (<$0.20) → $1.5–3/mes. Margen bruto ≈ 70–80%.

**Canal de adquisición automatizable:** SEO programático en español ("cómo enseñar a leer a un niño de 5 años", "método silábico", "fichas de lectura m p l s", "mi hijo de 6 años no quiere leer") con descargables gratuitos generados por IA como lead magnet; YouTube/TikTok de "mini-lecciones" con voz IA; Meta Ads a madres hispanas (CAC **[estimación]** $15–35). Pinterest es muy fuerte para fichas de lectoescritura.

**Camino a los primeros $1,000:** 100 familias a $9.99 (o 17 anuales). Lead magnet de fichas imprimibles → secuencia de email automatizada → prueba 7 días. Objetivo: semana 8–10.

**Escenario 12 meses:** 300 registros/mes (meses 1–4) → 800/mes (meses 5–12) con $1,000/mes en ads + SEO; conversión 20%; churn 10% (los niños aprenden a leer en 6–12 meses: churn natural). Mes 12: ~900 familias activas → **MRR ≈ $9,000**; acumulado ≈ $55–65k. Conservador: 300 familias → MRR ≈ $3,000.

**Riesgos top 3:** (1) Precisión del STT infantil y expectativas de los padres. (2) Políticas de apps infantiles (COPPA, categoría Kids de Apple, sin tracking → ads menos eficientes). (3) Entrada de un grande (Duolingo ABC en español) — mitigación: velocidad y foco en método silábico hispano.

**Puntuación:** demanda 8 · competencia 7 · automatización 8 · margen 8 · velocidad 6 · adquisición 7 · riesgo 6.

---

### #3 — Preparación en español para el examen de licencia de seguros (Texas → Florida/California)

**Hook:** "El examen de licencia de seguros de Texas se puede tomar en español, pero solo 3 de cada 10 lo aprueban. Nosotros te preparamos en tu idioma con las reglas de Texas explicadas claro."

**Evidencia de demanda**
- Texas 2025, intentos de primera vez: **General Lines Life, Accident & Health >26,000**; **Life Agent ~21,000**; **General Lines P&C ~11,200**; **Personal Lines P&C ~5,100** (≈63,000 primeros intentos; ~4 de cada 10 asientos son repetidores → **[estimación derivada] ~100,000 intentos/año solo en Texas**). Tasas de aprobación de primer intento 47.3–65.9%; **candidatos en español: ~28.6% vs ~48% en inglés**. El examen permite alternar español/inglés y pedir tiempo extendido. Fuente (datos TDI compilados por Aceable, 2025) — https://insurance.aceable.com/resources/pre-license/texas-insurance-exam-pass-rates/
- Brecha de 19 puntos de aprobación = dolor cuantificado y recurrente (cada repetición cuesta la tarifa del examen; la tarifa exacta no estaba en la página → **[no verificado]**).
- Disposición a pagar: existe una industria de prep (Kaplan, ExamFX, Aceable) en inglés; precios **[estimación, no verificados en esta sesión]** $100–300 por curso.
- Comparable de nicho pequeño con pago único en español: epa608pass.ai $29–39 (EN/ES) — https://www.hunted.space/product/epa608pass-ai

**Top 3 competidores (y debilidades)**
1. **Aceable Insurance** — curso en inglés; su propia página admite la brecha de aprobación en español sin ofrecer producto en español — https://insurance.aceable.com/resources/pre-license/texas-insurance-exam-pass-rates/
2. **ExamFX** — líder en pre-licensing/prep en inglés; precios y oferta en español **[no verificado]**.
3. **Kaplan Financial** — prep en inglés; precios **[no verificado]**.
   - Nota: el "pre-licensing education" aprobado por el estado es un mercado regulado en algunos estados; este producto es **solo preparación para el examen** (banco de preguntas + explicaciones), que no requiere aprobación estatal. Verificar que en Texas no se promocione como "curso aprobado".

**Salto posible con IA 2026:** banco de 1,500–3,000 preguntas por línea generadas y verificadas contra el Texas Insurance Code y el "content outline" oficial de Pearson VUE, con **explicaciones bilingües** (el término técnico en inglés siempre visible, porque el examen alterna idiomas), glosario EN↔ES de seguros, simulacros cronometrados con la misma proporción por tema, tutor de dudas por chat, y plan de estudio adaptativo. Los incumbentes no explican en español ni manejan la terminología bilingüe.

**Qué NO se puede automatizar:** la verificación final de cambios legislativos (Texas actualiza reglas) requiere una revisión humana trimestral (~2 h/trimestre con Claude); la validación estadística de la "calidad" de preguntas al inicio.

**Build:** 2–3 semanas (Next.js + Supabase + Stripe; generación de contenido con Claude en pipeline con revisión).

**Precio y modelo:** $49 pago único (acceso 90 días) con garantía de aprobación (repites gratis) o $29/mes; upsell "pack 2 líneas" $79. Mercado inicial: Texas (Life + LAH, 47,000+ primeros intentos/año); expansión a FL/CA si confirman examen en español **[no verificado]**.

**Costo de IA por usuario/mes [estimación]:** <$0.50 (contenido cacheado; chat de dudas limitado). Margen bruto >90%.

**Canal de adquisición automatizable:** SEO programático en español: "examen de seguros Texas en español", "licencia de seguros de vida Texas requisitos", "preguntas examen General Lines en español", páginas por línea × por ciudad (Houston, Dallas, San Antonio, El Paso, RGV); YouTube con explicaciones generadas; Meta Ads a hispanos en Texas con intereses de "agente de seguros"; alianzas automatizadas de afiliados con agencias que reclutan agentes hispanos (link + comisión, sin venta humana). CAC **[estimación]** $8–20 por compra.

**Camino a los primeros $1,000:** 21 compras a $49. Con 30–40 páginas SEO + $300 en ads, objetivo en semana 6–10 (SEO tarda).

**Escenario 12 meses:** supuestos: 8–15% de los ~100,000 intentos anuales en TX son en español **[estimación sin dato oficial]** → 8,000–15,000 candidatos/año; captar 3–5% → 240–750 compras × $49 = **$12k–37k/año**; con upsells y FL/CA en el segundo semestre, base ≈ $25k. Conservador: 150 compras = $7.4k. Es el más pequeño en techo, pero el de mayor margen y menor riesgo.

**Riesgos top 3:** (1) Mercado acotado (Texas) y dependencia del SEO. (2) Cambios en el content outline del examen; mitigación: pipeline de actualización. (3) Que un incumbente añada versión en español (mitigación: ser primero y rankear).

**Puntuación:** demanda 7 · competencia 8 · automatización 9 · margen 9 · velocidad 7 · adquisición 7 · riesgo 7.

---

### #4 — Entrenador IA para trail/ultra que lee tus actividades (vert, tiempo en pies, caminata) — condicionado al riesgo de API

**Hook:** "Un coach de ultra que lee tu semana real —desnivel, tiempo en pies, cuánto caminaste— y te reescribe el plan cada lunes. Por lo que cuesta un gel al día."

**Evidencia de demanda**
- **Vert.run**: VertPro $9.90/mes anual ($120/año) o $19.90/mes; VertCoaching $45/mes; "más de 85,000 corredores de trail de 100+ países"; planes "diseñados por coaches" y "ajustados automáticamente", con revisión humana en 24 h; integra Garmin/Coros/Suunto/Strava — https://vert.run/frequently-asked-questions/ ; página de reseñas reclama "130,000+" — https://vert.run/reviews/ ; Trustpilot 2.9★ (67 reseñas) con quejas de cancelación/cobros y "coaching lacking" — https://at.trustpilot.com/review/vert.run
- **Runna**: $19.99/mes o $119.99/año (verificado 7-ago-2026) — https://www.runningwestwardho.co.uk/post/the-problem-with-runna ; Trustpilot 3.5★ con 1,114 reseñas; quejas de cobro tras cancelar, plan "too much too soon" — https://www.trustpilot.com/review/runna.com?page=2 ; adquirida por Strava en 2025 (según aitoolsbakery) — https://aitoolsbakery.com/blog/best-ai-running-coach-apps/
- Comparativa 2026: TrainAsONE £9.99/mes, Athletica $19.90/mes, Humango ~$30/mes, Garmin Connect+ $6.99/mes; y la conclusión: **"ningún app maneja desnivel, vert, tiempo en pies o caminata; el entrenamiento específico de terreno lo maneja mejor un coach humano"** — https://www.runnerspicks.com/blog/best-ai-running-coaches-2026/
- TrainingPeaks vende planes estáticos de 100 millas de McMillan (20 semanas, con módulos de vert) — https://www.trainingpeaks.com/training-plans/running/ultra/tp-390653/ultra-trail-vert-100mi-level-3-intermediate-12000-ft

**Top 3 competidores (y debilidades)**
1. **Vert.run** — trail-específico, barato, pero depende de coaches humanos para la adaptación; quejas de cancelación — https://vert.run/frequently-asked-questions/
2. **Runna** — pulido y masivo, pero orientado a ritmo en asfalto; "hasta 50K"; propiedad de Strava — https://www.runningwestwardho.co.uk/post/the-problem-with-runna
3. **TrainAsONE / Athletica / Humango** — adaptativos pero sin lógica de terreno; interfaces anticuadas (TrainAsONE) o caros (Humango) — https://aitoolsbakery.com/blog/best-ai-running-coach-apps/

**Salto posible con IA 2026:** un LLM que lee los archivos FIT/TCX (desnivel por km, ritmo ajustado por pendiente, % caminando, deriva cardíaca, tiempo en pies), compara con el perfil de la carrera objetivo (GPX de la carrera) y conversa cada semana en español/inglés, re-planificando con reglas de ultra (back-to-backs, bloques de vert, descenso, calor, nutrición) — exactamente lo que los coaches humanos de Vert.run hacen a mano.

**Qué NO se puede automatizar:** acceso a datos sin cooperación de Garmin/Strava (ver riesgos); juicio clínico en lesiones (el producto debe excluirlo explícitamente); emoción del "coach humano" (parcialmente sustituible).

**Riesgo de plataforma (documentado, es la razón de la nota 4):** Garmin cambió sus términos para que ningún servicio reciba datos sin aprobación escrita; **las solicitudes de desarrollador Garmin están congeladas desde mayo-2026**; **Intervals Pro (3,600 atletas) cerró el 12-oct-2026** por ello — https://the5krunner.com/2026/10/14/garmin-api-intervals-third-party-apps/ . Strava: desde jun-2026 exige **suscripción Strava al desarrollador**, prohíbe el enrutamiento por intermediarios y mantiene la prohibición (2024) de usar datos para entrenar IA; lanzó su propio servidor MCP de solo lectura — https://forum.intervals.icu/t/strava-api-update-new-terms-subs-required-for-api-access/130240 . Mitigación: subida manual de FIT (siempre funciona), integración directa Strava (permitida, hasta 10 atletas sin revisión; luego revisión), COROS/Suunto/Polar APIs, Apple Health en iOS.

**Build:** 4–6 semanas (parser FIT, motor de planes, chat semanal, integración Strava directa, pagos).

**Precio y modelo:** $9.99/mes o $79/año. Mercado inicial: corredores de trail hispanohablantes (España, México, Colombia, Chile, Argentina, Centroamérica) + EE. UU.; Juan tiene red y credibilidad en la comunidad.

**Costo de IA por usuario/mes [estimación]:** $0.30–0.80 (análisis semanal + chat limitado). Margen bruto ≈ 85%.

**Canal de adquisición automatizable:** SEO programático "plan de entrenamiento [carrera específica] 2027" para 300+ carreras de trail iberoamericanas (UTMB series, Transvulcania, UTMX, Patagonia Run, etc.) con perfil GPX y plan de muestra; contenido en Strava clubs/Reddit (orgánico); YouTube con análisis de carreras generados. CAC **[estimación]** $10–30.

**Camino a los primeros $1,000:** 100 suscriptores; la red personal de Juan y 50 páginas SEO de carreras → semana 8–12.

**Escenario 12 meses:** 150 registros/mes creciendo a 400/mes; conversión 20%; churn 8%. Mes 12: ~450 suscriptores → **MRR ≈ $4,500**; conservador ~180 → $1,800. Si Garmin cierra el acceso indirecto y Strava endurece más, el tráfico de conversión cae ~40% **[supuesto]**.

**Riesgos top 3:** (1) APIs Garmin/Strava (alto, documentado). (2) Runna+Strava lanzan trail adaptativo. (3) Responsabilidad percibida ante lesiones (descargos y diseño conservador).

**Puntuación:** demanda 8 · competencia 4 · automatización 8 · margen 8 · velocidad 6 · adquisición 6 · riesgo 4.

---

### #5 — Simulador de voz IA, en español, de la entrevista de ciudadanía (N-400 + cívico 2025) y de la entrevista consular B1/B2

**Hook:** "Practica tu entrevista de ciudadanía con un oficial de IA que te pregunta en inglés y te corrige en español. Las 128 preguntas del nuevo examen 2025, tu formulario N-400 y la conversación real."

**Evidencia de demanda**
- **878,500 naturalizaciones en FY2023** (969,400 en FY2022); ~823,700 peticiones recibidas en FY2023; **México es el país de origen #1**; los mexicanos son el 26% de los ~9M residentes elegibles (MPI, 2024) — https://www.migrationpolicy.org/article/naturalization-trends-united-states-2024
- **Nuevo examen cívico desde el 20-oct-2025:** banco de 128 preguntas (antes 100), 20 preguntas por entrevista, se aprueba con 12 (antes 6 de 10) → más difícil = más preparación; exención 65/20 permite idioma propio (Vistazo, 19-sep-2025) — https://www.vistazo.com/actualidad/internacional/2025-09-19-ee-uu-nuevo-examen-ciudadania-uscis-naturalizacion-LE10142449
- Disposición a pagar probada: **Citizenry** 4.9★ con **13K valoraciones**; Pro $9.99/sem, $9.99–14.99/mes, $29.99–39.99/año, $39.99 lifetime; entrevistas simuladas con reconocimiento de voz en inglés y español (agentes "Ramos", "Ruiz") — https://apps.apple.com/app/id6451455299 ; solo iOS (La Nación, 17-ago-2025) — https://www.lanacion.com.ar/estados-unidos/visas-y-tramites/entrevista-de-ciudadania-americana-del-uscis-tres-simuladores-que-ayudan-a-prepararla-con-nid17082025/
- Visa B1/B2: **Permito** (voz IA, F-1/H1B/B1-B2) reporta **$500/mes** con "a few paying users" (Indie Hackers, 12-feb-2026) — https://www.indiehackers.com/product/permito . Cifras de visas B1/B2 emitidas en México y precios de "asesorías de visa": **[no verificado — cuota de búsqueda agotada]**.

**Top 3 competidores (y debilidades)**
1. **Citizenry** — fuerte, barato, 13K valoraciones; debilidades: solo iOS; simulación por reconocimiento de voz tipo quiz (no conversación con seguimiento); reportes de "mock interviews not working" — https://apps.apple.com/app/id6451455299
2. **Immigratus AI (Android)** — quiz cívico con IA; sin voz clara; afiliación no gubernamental — https://www.lanacion.com.ar/estados-unidos/visas-y-tramites/entrevista-de-ciudadania-americana-del-uscis-tres-simuladores-que-ayudan-a-prepararla-con-nid17082025/
3. **Permito** — visa, en inglés, $500/mes, sin foco hispano — https://www.indiehackers.com/product/permito

**Salto posible con IA 2026:** conversación real de voz (no quiz) con un "oficial" que hace preguntas de seguimiento sobre TU N-400 (el usuario sube/transcribe sus respuestas; el agente pregunta "¿ha viajado fuera de EE. UU. más de 6 meses?" y evalúa comprensión), practica los comandos de la entrevista ("raise your right hand", "do you swear..."), lectura/escritura en inglés (parte del examen), y explica errores en español. Android + web (hueco de Citizenry). Para B1/B2: ensayo de coherencia y claridad, nunca "qué decir" (evitar asesoría migratoria).

**Qué NO se puede automatizar:** asesoría legal (se excluye explícitamente: no se dan consejos sobre elegibilidad ni documentos); garantía de resultado. Soporte 95% IA.

**Build:** 1–2 semanas si ya existe el motor de voz del #1 (misma arquitectura); 3–4 semanas desde cero.

**Precio y modelo:** $9.99/mes o pase de 30 días $24.99 (la mayoría estudia 4–8 semanas: compra única con alta rotación). Mercado inicial: hispanohablantes en EE. UU. con N-400 presentado (TX, CA, FL, NY, IL).

**Costo de IA por usuario/mes [estimación]:** 30 min de voz ≈ $2.4–3.6 + LLM $0.20 → margen ≈ 60–70% (80%+ con STT+LLM+TTS por turnos).

**Canal de adquisición automatizable:** SEO programático en español ("128 preguntas examen de ciudadanía 2026 en español", "entrevista N-400 qué preguntan", "preguntas por estado: gobernador de Texas"); TikTok/YouTube Shorts con simulaciones de entrevista; Google Play (sin competidor fuerte); Meta Ads a hispanos con interés en ciudadanía (CAC **[estimación]** $5–15: intención muy alta y volumen enorme).

**Camino a los primeros $1,000:** 40 pases de $24.99 o 100 suscripciones; Play Store + 30 páginas SEO + $300 ads → semana 4–6.

**Escenario 12 meses:** 500 registros/mes → 1,200/mes; conversión 15%; churn 25% (producto de examen, ciclo corto). Mes 12: ~500 pagos activos → **MRR ≈ $5,000** (+ pases únicos). Conservador: ~200 → $2,000.

**Riesgos top 3:** (1) Citizenry lanza Android y conversación real (está bien financiado por su base). (2) Cambios de política de USCIS (otro cambio de examen) obligan a re-generar contenido (barato con IA, pero riesgo de confusión). (3) Percepción de "asesoría migratoria" → marco legal; mitigación: solo práctica de idioma y cívica, descargos claros.

**Puntuación:** demanda 8 · competencia 5 · automatización 9 · margen 7 · velocidad 7 · adquisición 7 · riesgo 6.

---

## 5. Justificación del TOP 5 frente a los descartados

- **Por qué #1 (camioneros) sobre #6 (CDL en español):** el mismo público, pero el CDL en español ya está dominado por CDL Help (5.2K valoraciones, 10 idiomas) y el mercado de exámenes en español se encoge (FL a solo inglés; CA de 25 a 7 idiomas). El inglés de inspección es el dolor nuevo, con cifras oficiales crecientes y competencia embrionaria.
- **Por qué #2 (lectura) sobre #19 (matemáticas):** la fonética es específica del idioma (el hueco en español es estructural); las matemáticas tempranas son casi universales y Smartick/Khan Kids ya las cubren con IA.
- **Por qué #3 (seguros TX) sobre #7 (oposiciones), #8 (UNAM) y #9 (ENEM):** en seguros el incumbente no habla el idioma del cliente y hay un dato de dolor (28.6% vs 48%); en oposiciones el incumbente tiene 1.6M usuarios y precio bajo; en UNAM/ENEM el Estado regala simuladores con IA.
- **Por qué #4 (trail) a pesar del riesgo:** es el único donde Juan tiene dominio profundo + red; la disposición a pagar está probadísima ($10–30/mes, cientos de miles de usuarios); el hueco (terreno/vert) está documentado por terceros. El riesgo de API es real y por eso va cuarto y "condicionado".
- **Por qué #5 (entrevistas) sobre #12 (IELTS) y #13 (reseñas Google):** IELTS y reseñas están saturados por decenas de productos IA; en ciudadanía hay un incumbente fuerte pero un hueco claro (Android/web, conversación real, español-first) y el volumen es de ~850k/año. Además reutiliza el motor del #1.
- **#18 (newsletter de acero)**: es el más "de Juan" por dominio B2B industrial, pero no reuní evidencia de demanda en esta sesión y el canal de adquisición es B2B lento; queda como candidato de segunda ronda, no como recomendación.

---

## 6. Secuencia sugerida y portafolio

1. **Semanas 1–4:** motor de roleplay de voz (ElevenLabs Agents/Realtime + Supabase + Stripe + Next.js) → lanzar **#1 Inspección en inglés**.
2. **Semanas 3–5 (en paralelo):** **#3 Seguros Texas** (sin voz; pipeline de contenido con Claude; SEO programático).
3. **Semanas 5–7:** clonar el motor de voz a **#5 Entrevista de ciudadanía** (Android + web).
4. **Semanas 7–12:** **#2 Tutor de lectura** (PWA; reutiliza "Manuela Lee").
5. **Opcional, semanas 12–18:** **#4 Coach trail** si el panorama Garmin/Strava se aclara; empezar con subida de FIT y Strava directo.

**Presupuesto total [estimación]:** $3–6k en APIs/infra/dominios + $3–4k en ads de validación = <$10k.

---

## 7. JSON (TOP 5)

```json
[
  {
    "nombre": "Inspección en Inglés — simulador de voz IA de inspección DOT para camioneros hispanos",
    "categoria": "Micronicho",
    "hook": "Practica la inspección roadside en inglés con un oficial de IA hasta que no te tiemble la voz. 10 minutos al día, desde el camión.",
    "mercado_inicial": "Camioneros hispanohablantes con CDL en EE. UU. (TX, CA, IL, NJ, FL); ~830,000 conductores hispanos [estimación derivada de BLS 3.5M x 23.7%]",
    "precio_sugerido": "$14.99/mes (45 min de voz) · $79/año · pase 'Roadcheck en 14 días' $29",
    "modelo": "Suscripción mensual/anual + pase único; autoservicio con Stripe; soporte IA",
    "costo_ia_unidad": "$3.9–5.7/usuario/mes con voz speech-to-speech (45 min) [estimación]; $1.5–2.5 con STT+LLM+TTS por turnos",
    "margen_bruto_pct": 65,
    "cac_estimado": "$10–25 por suscriptor pagado [estimación] vía TikTok/Reels automatizados, SEO programático por estado y Meta Ads en español",
    "ventana": "Alta: ELP es causa de fuera de servicio desde 25-jun-2025; >60,000 infracciones y ~19,000 OOS hasta mar-2026; FMCSA propuso codificarlo el 10-ago-2026. Competencia embrionaria (apps con 7 valoraciones / 50 descargas).",
    "mvp_semanas": 4,
    "scores": {"demanda": 8, "competencia": 8, "automatizacion": 9, "margen": 7, "velocidad_primer_dolar": 8, "adquisicion_automatizable": 8, "riesgo": 6},
    "competidores_top3": [
      {"nombre": "English4Truckers", "precio": "$349 grabado / $499 con clases en vivo", "url": "https://www.english4truckers.net/"},
      {"nombre": "Lingo Truck: CDL English", "precio": "$5.99/sem · $19.99/mes · $29.99 lifetime", "url": "https://apps.apple.com/us/app/lingo-truck-cdl-english/id6756713641"},
      {"nombre": "Practice Stop: Inglés trailero", "precio": "Pago por sesiones (sin precio público); 50+ descargas", "url": "https://play.google.com/store/apps/details?id=com.myfortuna.practice_stop&hl=en_US"}
    ],
    "riesgos_top3": [
      "Cambio político/regulatorio que relaje la aplicación de ELP",
      "Entrada de Babbel/Duolingo o proveedores de ELD con curso para camioneros",
      "Churn alto por naturaleza de 'examen' y sensibilidad al precio"
    ],
    "fuentes": [
      "https://www.truckinginfo.com/articles/when-language-stops-the-truck-the-return-of-elp-out-of-service-orders",
      "https://foxbaltimore.com/news/nation-world/nearly-9500-truck-drivers-sidelined-as-dot-ramps-up-english-language-enforcement",
      "https://prodriver.com/?p=9742",
      "https://www.overdriveonline.com/regulations/article/15767991/fmcsa-to-force-nearly-200k-nondomiciled-cdl-holders-out-of-trucking",
      "https://www.truckload.org/wp-content/uploads/2026/07/English-Language-Proficiency-4.pdf",
      "https://www.ccjdigital.com/regulations/article/15747119/truckers-lacking-english-should-be-outofservice-survey",
      "https://fortune.com/2025/06/24/truckers-rush-learn-english-trump-order-considered-unfit-for-service",
      "https://es.open-exam-prep.com/blog/guia-completa-examen-cdl-licencia-comercial-espanol",
      "https://apps.apple.com/us/app/cdl-help/id6444388755",
      "https://driving-tests.org/cdl-premium/index-alt2.html",
      "https://www.panaceast.com/english-practice-truck-drivers",
      "https://www.berlitz.com/es-us/ingles_para_camioneros",
      "https://www.passyourcdl.com/elp-practice.html"
    ]
  },
  {
    "nombre": "LeeConmigo — tutor de lectura en español (4–7) que escucha al niño leer",
    "categoria": "Micronicho",
    "hook": "El primer tutor que escucha a tu hijo leer en español, sílaba a sílaba, y le corrige con cariño. 10 minutos al día, contigo.",
    "mercado_inicial": "Familias hispanas en EE. UU. y México con niños de 4–7 años; luego España y resto de LatAm",
    "precio_sugerido": "$9.99/mes · $59/año por familia (hasta 3 niños)",
    "modelo": "Suscripción familiar; prueba 7 días; PWA + wrappers nativos; soporte IA",
    "costo_ia_unidad": "$1.5–3/usuario/mes (STT infantil 10 min/día + TTS cacheado + LLM) [estimación]",
    "margen_bruto_pct": 75,
    "cac_estimado": "$15–35 [estimación] vía fichas imprimibles como lead magnet (SEO/Pinterest), YouTube/TikTok de mini-lecciones y Meta Ads a madres hispanas",
    "ventana": "Media-alta: Lingokids ($14.99/mes) y Duolingo ABC solo enseñan inglés; Khan Kids sin español tras años de peticiones; la oferta en español es anticuada (Leo con Grin $9.99 único, 3.8★/4 valoraciones). El STT infantil y la voz IA de 2026 hacen posible 'escuchar leer'.",
    "mvp_semanas": 6,
    "scores": {"demanda": 8, "competencia": 7, "automatizacion": 8, "margen": 8, "velocidad_primer_dolar": 6, "adquisicion_automatizable": 7, "riesgo": 6},
    "competidores_top3": [
      {"nombre": "Lingokids", "precio": "$14.99/mes · $99.99/año · $139.99/año Plus (solo inglés)", "url": "https://learnenglish.life/reviews/lingokids/"},
      {"nombre": "Smartick Lectura", "precio": "Suscripción; precio inconsistente en fuentes ($9.99/mes vs ~€49/mes) [no verificado]", "url": "https://subger.com/en/service/smartick"},
      {"nombre": "Leo con Grin FULL (Educaplanet)", "precio": "$9.99 pago único; 3.8★ con 4 valoraciones", "url": "https://apps.apple.com/app/id1165056712"}
    ],
    "riesgos_top3": [
      "Precisión del reconocimiento de habla infantil y expectativas de los padres",
      "Reglas COPPA/App Store Kids limitan tracking y encarecen ads",
      "Entrada de Duolingo ABC o Lingokids con lectura en español"
    ],
    "fuentes": [
      "https://learnenglish.life/reviews/lingokids/",
      "https://subger.com/en/service/smartick",
      "https://www.genbeta.com/actualidad/smartick-no-solo-matematicas-su-nuevo-programa-lectura-sirve-ninos-aprendan-a-leer-jugando",
      "https://apps.apple.com/app/id1165056712",
      "https://apps.apple.com/es/app/aprender-a-leer-1-con-grin/id932280561",
      "https://support.khanacademy.org/hc/fr/community/posts/360067991032/comments/360014438331",
      "https://hotmart.com/es/marketplace/productos/metodo-inspira-aprende-a-leer-y-escribir/A103310452J",
      "https://hotmart.com/es/marketplace/productos/super-kit-de-lectoescritura-3-bonos-irresistibles/T105900375K"
    ]
  },
  {
    "nombre": "Licencia de Seguros en Español — preparación para el examen de Texas (Life, LAH, P&C)",
    "categoria": "Micronicho",
    "hook": "El examen de seguros de Texas se puede tomar en español, pero solo 3 de cada 10 lo aprueban. Te preparamos en tu idioma con la ley de Texas explicada claro.",
    "mercado_inicial": "Candidatos hispanohablantes a licencia de seguros en Texas (>63,000 primeros intentos/año; ~100,000 intentos con repetidores [estimación]); expansión a FL/CA",
    "precio_sugerido": "$49 pago único (90 días, garantía de aprobación) · $29/mes · pack 2 líneas $79",
    "modelo": "Compra única con alta rotación + suscripción opcional; autoservicio con Stripe",
    "costo_ia_unidad": "<$0.50/usuario/mes (contenido cacheado + chat de dudas limitado) [estimación]",
    "margen_bruto_pct": 92,
    "cac_estimado": "$8–20 por compra [estimación] vía SEO programático en español por línea x ciudad, YouTube y Meta Ads en Texas",
    "ventana": "Media-alta: brecha documentada 28.6% (español) vs 48% (inglés) en 2025; Aceable/Kaplan/ExamFX preparan solo en inglés.",
    "mvp_semanas": 3,
    "scores": {"demanda": 7, "competencia": 8, "automatizacion": 9, "margen": 9, "velocidad_primer_dolar": 7, "adquisicion_automatizable": 7, "riesgo": 7},
    "competidores_top3": [
      {"nombre": "Aceable Insurance", "precio": "Curso en inglés; precio no verificado", "url": "https://insurance.aceable.com/resources/pre-license/texas-insurance-exam-pass-rates/"},
      {"nombre": "ExamFX", "precio": "Prep en inglés; precio no verificado [estimación $100–300]", "url": "https://www.examfx.com/"},
      {"nombre": "Kaplan Financial Education", "precio": "Prep en inglés; precio no verificado [estimación $100–300]", "url": "https://www.kaplanfinancial.com/insurance"}
    ],
    "riesgos_top3": [
      "Techo de mercado acotado (Texas) y dependencia de SEO",
      "Cambios en el content outline / Texas Insurance Code requieren actualización (barata con IA)",
      "Un incumbente lanza versión en español"
    ],
    "fuentes": [
      "https://insurance.aceable.com/resources/pre-license/texas-insurance-exam-pass-rates/",
      "https://www.hunted.space/product/epa608pass-ai"
    ]
  },
  {
    "nombre": "UltraCoach IA — entrenador de trail/ultra que lee tus actividades (vert, tiempo en pies, caminata)",
    "categoria": "Micronicho",
    "hook": "Un coach de ultra que lee tu semana real —desnivel, tiempo en pies, cuánto caminaste— y te reescribe el plan cada lunes. Por lo que cuesta un gel al día.",
    "mercado_inicial": "Corredores de trail/ultra hispanohablantes (España, México, Colombia, Chile, Argentina, Centroamérica) y EE. UU.",
    "precio_sugerido": "$9.99/mes · $79/año",
    "modelo": "Suscripción; subida de FIT + integración directa Strava/COROS; soporte IA",
    "costo_ia_unidad": "$0.30–0.80/usuario/mes [estimación]",
    "margen_bruto_pct": 85,
    "cac_estimado": "$10–30 [estimación] vía SEO programático por carrera (300+ carreras con GPX y plan muestra), contenido en comunidades y YouTube",
    "ventana": "Media, con riesgo: hueco documentado ('ningún app maneja terreno/vert/tiempo en pies', 2026) y precios probados ($10–30/mes), pero Garmin congeló desarrolladores desde may-2026 y Strava exige suscripción y prohíbe intermediarios (jun-2026); Intervals Pro cerró el 12-oct-2026.",
    "mvp_semanas": 6,
    "scores": {"demanda": 8, "competencia": 4, "automatizacion": 8, "margen": 8, "velocidad_primer_dolar": 6, "adquisicion_automatizable": 6, "riesgo": 4},
    "competidores_top3": [
      {"nombre": "Vert.run (VertPro / VertCoaching)", "precio": "$9.90/mes anual ($120/año) o $19.90/mes; coaching $45/mes", "url": "https://vert.run/frequently-asked-questions/"},
      {"nombre": "Runna (Strava)", "precio": "$19.99/mes · $119.99/año", "url": "https://www.runningwestwardho.co.uk/post/the-problem-with-runna"},
      {"nombre": "TrainAsONE / Athletica / Humango", "precio": "£9.99/mes · $19.90/mes · ~$30/mes", "url": "https://aitoolsbakery.com/blog/best-ai-running-coach-apps/"}
    ],
    "riesgos_top3": [
      "Acceso a datos: cambios de términos de Garmin y Strava (documentados oct-2026)",
      "Runna/Strava lanzan trail adaptativo con distribución masiva",
      "Responsabilidad percibida ante lesiones; requiere diseño conservador y descargos"
    ],
    "fuentes": [
      "https://vert.run/frequently-asked-questions/",
      "https://vert.run/reviews/",
      "https://at.trustpilot.com/review/vert.run",
      "https://www.runningwestwardho.co.uk/post/the-problem-with-runna",
      "https://www.trustpilot.com/review/runna.com?page=2",
      "https://www.runnerspicks.com/blog/best-ai-running-coaches-2026/",
      "https://aitoolsbakery.com/blog/best-ai-running-coach-apps/",
      "https://www.trainingpeaks.com/training-plans/running/ultra/tp-390653/ultra-trail-vert-100mi-level-3-intermediate-12000-ft",
      "https://the5krunner.com/2026/10/14/garmin-api-intervals-third-party-apps/",
      "https://forum.intervals.icu/t/strava-api-update-new-terms-subs-required-for-api-access/130240",
      "https://irunfar.com/vert-run-making-trail-running-accessible-to-everyone"
    ]
  },
  {
    "nombre": "Mi Entrevista — simulador de voz IA en español de la entrevista de ciudadanía (N-400 + cívico 2025) y consular B1/B2",
    "categoria": "Micronicho",
    "hook": "Practica tu entrevista de ciudadanía con un oficial de IA que te pregunta en inglés y te corrige en español: las 128 preguntas del examen 2025, tu N-400 y la conversación real.",
    "mercado_inicial": "Hispanohablantes en EE. UU. con N-400 en proceso (~850,000 naturalizaciones/año; México #1); segundo paso: solicitantes de visa B1/B2 en México y Centroamérica",
    "precio_sugerido": "$9.99/mes · pase 30 días $24.99",
    "modelo": "Compra única de alta rotación + suscripción; Android + web (hueco del incumbente iOS); soporte IA",
    "costo_ia_unidad": "$2.6–3.8/usuario/mes con 30 min de voz [estimación]; menor con STT+LLM+TTS por turnos",
    "margen_bruto_pct": 65,
    "cac_estimado": "$5–15 [estimación]: intención muy alta; SEO programático en español (preguntas por estado), TikTok/Shorts de simulaciones, Google Play",
    "ventana": "Media-alta: examen nuevo desde 20-oct-2025 (128 preguntas, 12/20) eleva dificultad; incumbente Citizenry fuerte en iOS pero sin Android y con simulación tipo quiz; en visas el único indie detectado factura $500/mes.",
    "mvp_semanas": 2,
    "scores": {"demanda": 8, "competencia": 5, "automatizacion": 9, "margen": 7, "velocidad_primer_dolar": 7, "adquisicion_automatizable": 7, "riesgo": 6},
    "competidores_top3": [
      {"nombre": "Citizenry: US Citizenship", "precio": "Pro $9.99/sem · $9.99–14.99/mes · $29.99–39.99/año · $39.99 lifetime; 13K valoraciones 4.9★; solo iOS", "url": "https://apps.apple.com/app/id6451455299"},
      {"nombre": "Immigratus AI Civics Test (Android)", "precio": "No publicado", "url": "https://www.lanacion.com.ar/estados-unidos/visas-y-tramites/entrevista-de-ciudadania-americana-del-uscis-tres-simuladores-que-ayudan-a-prepararla-con-nid17082025/"},
      {"nombre": "Permito (visa interview AI)", "precio": "No publicado; $500/mes de ingresos (feb-2026)", "url": "https://www.indiehackers.com/product/permito"}
    ],
    "riesgos_top3": [
      "Citizenry lanza Android y conversación real",
      "Nuevos cambios de USCIS al examen o al proceso",
      "Percepción de asesoría migratoria; limitar a práctica de idioma/cívica con descargos"
    ],
    "fuentes": [
      "https://www.migrationpolicy.org/article/naturalization-trends-united-states-2024",
      "https://www.vistazo.com/actualidad/internacional/2025-09-19-ee-uu-nuevo-examen-ciudadania-uscis-naturalizacion-LE10142449",
      "https://apps.apple.com/app/id6451455299",
      "https://www.lanacion.com.ar/estados-unidos/visas-y-tramites/entrevista-de-ciudadania-americana-del-uscis-tres-simuladores-que-ayudan-a-prepararla-con-nid17082025/",
      "https://www.indiehackers.com/product/permito"
    ]
  }
]
```

---

## 8. Lista completa de fuentes consultadas (con URL)

**Camioneros / ELP / CDL**
- Trucking Info — "When language stops the truck: the return of ELP out-of-service orders" (2026): https://www.truckinginfo.com/articles/when-language-stops-the-truck-the-return-of-elp-out-of-service-orders
- Fox Baltimore/Sinclair — "Roughly 9,500 truck drivers sidelined..." (15-dic-2025): https://foxbaltimore.com/news/nation-world/nearly-9500-truck-drivers-sidelined-as-dot-ramps-up-english-language-enforcement
- ProDriver — FMCSA two-step ELP process (memo 20-may-2025): https://prodriver.com/?p=9742
- Overdrive — Non-domiciled CDL rule, 194,000 drivers (26-sep-2025): https://www.overdriveonline.com/regulations/article/15767991/fmcsa-to-force-nearly-200k-nondomiciled-cdl-holders-out-of-trucking
- Truckload Carriers Association — ELP PDF (jul-2026): https://www.truckload.org/wp-content/uploads/2026/07/English-Language-Proficiency-4.pdf
- CCJ — Encuesta 82% apoyo OOS (24-jun-2025): https://www.ccjdigital.com/regulations/article/15747119/truckers-lacking-english-should-be-outofservice-survey
- Fortune/AP — Truckers rush to learn English (24-jun-2025): https://fortune.com/2025/06/24/truckers-rush-learn-english-trump-order-considered-unfit-for-service
- Open Exam Prep (ES) — Guía CDL en español 2026 (BLS 3.5M, 23.7% hispanos): https://es.open-exam-prep.com/blog/guia-completa-examen-cdl-licencia-comercial-espanol
- cdlenespanol.org: https://cdlenespanol.org/
- FMCSA — CLP/CDL drivers per year by age group (PDF 2020): https://www.fmcsa.dot.gov/sites/fmcsa.dot.gov/files/2020-07/CLP-CDLdriversPerYearByAgeGroup.pdf
- driving-tests.org — CDL Premium pricing: https://driving-tests.org/cdl-premium/index-alt2.html ; NV CDL practice test (Spanish toggle): https://driving-tests.org/nevada/nv-cdl-passenger-vehicles-practice-test
- DMV Genie IAPs (apppricinglab): https://apppricinglab.com/iap/apple/513850893
- Union Test Prep CDL ($29/año): https://uniontestprep.com/cdl/products
- CDL Help (App Store US): https://apps.apple.com/us/app/cdl-help/id6444388755
- CDL Prep: Practice Test 2026 (App Store): https://apps.apple.com/us/app/cdl-prep-practice-test-2026/id6478266679
- ELDT365 Trustpilot: https://www.trustpilot.com/review/eldt365.com
- Lingo Truck (App Store): https://apps.apple.com/us/app/lingo-truck-cdl-english/id6756713641
- Practice Stop (Google Play): https://play.google.com/store/apps/details?id=com.myfortuna.practice_stop&hl=en_US
- Paso / Panaceast: https://www.panaceast.com/english-practice-truck-drivers
- English4Truckers: https://www.english4truckers.net/
- Berlitz — Inglés para camioneros: https://www.berlitz.com/es-us/ingles_para_camioneros
- PassYourCDL — ELP practice: https://www.passyourcdl.com/elp-practice.html
- Keynnect Logistics — Top 5 apps (may-2025): https://keynnectlogistics.com/tapps-english-for-truck-drivers-cvsa-rules/
- TruckerNavi press release (14-ago-2026): https://www.truckingdive.com/press-release/20260814-free-bilingual-driver-app-reaches-both-major-app-stores/

**Trail / ultra / AI coaching**
- Vert.run FAQ: https://vert.run/frequently-asked-questions/ ; Reviews: https://vert.run/reviews/ ; Trustpilot: https://at.trustpilot.com/review/vert.run
- iRunFar — Vert.run (26-may-2021): https://irunfar.com/vert-run-making-trail-running-accessible-to-everyone
- Running Westward Ho — The problem with Runna (ago-2026): https://www.runningwestwardho.co.uk/post/the-problem-with-runna
- Runna Trustpilot: https://www.trustpilot.com/review/runna.com?page=2
- RunnersPicks — Best AI Running Coaches 2026 (sep-2026): https://www.runnerspicks.com/blog/best-ai-running-coaches-2026/
- AI Tools Bakery — Best AI Running Coach Apps 2026: https://aitoolsbakery.com/blog/best-ai-running-coach-apps/
- TrainingPeaks — McMillan 100mi plan: https://www.trainingpeaks.com/training-plans/running/ultra/tp-390653/ultra-trail-vert-100mi-level-3-intermediate-12000-ft
- the5krunner — Garmin cuts off Intervals and third-party apps (14-oct-2026): https://the5krunner.com/2026/10/14/garmin-api-intervals-third-party-apps/
- Intervals.icu forum — Strava API update (2026): https://forum.intervals.icu/t/strava-api-update-new-terms-subs-required-for-api-access/130240

**Lectura infantil en español**
- learnenglish.life — Lingokids review (sep-2026): https://learnenglish.life/reviews/lingokids/
- Subger — Smartick overview: https://subger.com/en/service/smartick
- Genbeta — Smartick Lectura (21-ene-2021): https://www.genbeta.com/actualidad/smartick-no-solo-matematicas-su-nuevo-programa-lectura-sirve-ninos-aprendan-a-leer-jugando
- Leo con Grin FULL (App Store): https://apps.apple.com/app/id1165056712 ; Aprender a leer 1 con Grin: https://apps.apple.com/es/app/aprender-a-leer-1-con-grin/id932280561
- Khan Academy support — "Khan Academy Kids en Español": https://support.khanacademy.org/hc/fr/community/posts/360067991032/comments/360014438331
- Hotmart — Método INSPIRA: https://hotmart.com/es/marketplace/productos/metodo-inspira-aprende-a-leer-y-escribir/A103310452J ; Super PACK Lectoescritura: https://hotmart.com/es/marketplace/productos/super-kit-de-lectoescritura-3-bonos-irresistibles/T105900375K

**Seguros / EPA 608 / otros exámenes**
- Aceable — Texas insurance exam pass rates (datos 2025): https://insurance.aceable.com/resources/pre-license/texas-insurance-exam-pass-rates/
- epa608pass.ai (Product Hunt vía hunted.space): https://www.hunted.space/product/epa608pass-ai
- OpositaTest — precios 2026: https://blog.opositatest.com/cuanto-cuesta-opositatest-precio-test-oposiciones
- Red Opositor — comparativa plataformas 2026 (jun-2026): https://redopositor.com/blog/es-comparativa-plataformas-test-oposiciones-2026/
- Forbes España — oposiciones/OpositaTest (17-may-2021): https://forbes.es/forbes-w/96302/oposiciones-funcionarios-espana-perfil-mujer/
- adn40 — Examen UNAM 2026 en línea y simulador gratis (18-may-2026): https://www.adn40.mx/mexico/2026-05-18/examen-unam-2026-asi-sera-el-nuevo-examen-en-linea-y-el-simulador-oficial-gratis/
- Por Esto — Resultados UNAM 2026 (28-ago-2026): https://www.poresto.com/mexico/2026/8/29/resultados-unam-2026-cuantos-aspirantes-obtuvieron-un-lugar-por-examen-y-cuantos-alumnos-de-nuevo-ingreso-habra.amp.html
- Band — MEC lanza app ENEM con IA (11-oct-2025): https://www.band.com.br/noticias/jornal-da-band/ultimas/mec-lanca-novo-aplicativo-para-o-enem-com-simulados-e-correcao-de-redacao-por-ia-202510112130

**Ciudadanía / visas**
- MPI — Naturalization trends (2024): https://www.migrationpolicy.org/article/naturalization-trends-united-states-2024
- Vistazo — Nuevo examen de ciudadanía (19-sep-2025): https://www.vistazo.com/actualidad/internacional/2025-09-19-ee-uu-nuevo-examen-ciudadania-uscis-naturalizacion-LE10142449
- Citizenry (App Store): https://apps.apple.com/app/id6451455299
- La Nación — Tres simuladores con IA (17-ago-2025): https://www.lanacion.com.ar/estados-unidos/visas-y-tramites/entrevista-de-ciudadania-americana-del-uscis-tres-simuladores-que-ayudan-a-prepararla-con-nid17082025/
- Indie Hackers — Permito ($500/mes, feb-2026): https://www.indiehackers.com/product/permito

**Pymes / reseñas / WhatsApp / inmobiliario / licitaciones**
- Capterra — MyReply: https://www.capterra.com/p/10047977/MyReply/
- Capterra — Birdeye reviews: https://www.capterra.com/p/152997/BirdEye/reviews/?rating=2
- Aurora Inbox — Cuánto cuesta un chatbot de WhatsApp en México (2025/2026): https://www.aurorainbox.com/2025/05/17/cuanto-cuesta-chatbot-whatsapp-mexico/
- Acquire.com — AI listing copy platform (no cargó): https://app.acquire.com/startup/zqovrifona-ai-listing-copy-platform-for-mls-compliant-luxury-real-estate-descriptions
- AGN Guatemala — MINFIN sistema de alertas Guatecompras: https://agn.gt/minfin-presenta-sistema-de-alertas-para-mejorar-las-adquisiciones-en-guatecompras/

**Pendientes (no verificados por cuota agotada):** precios de Kaplan/ExamFX; visas B1/B2 emitidas en México y precios de "asesorías de visa"; listados Acquire.com de exam-prep con MRR; disponibilidad del examen de seguros en español en FL/CA; precios exactos de Smartick por país; volúmenes de búsqueda y CPC (Google Trends/keywords).
