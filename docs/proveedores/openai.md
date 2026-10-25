# OpenAI: edición de fotos de la familia a ilustraciones (gpt-image, API de imágenes)

Veredicto D27: **RIESGO ALTO para fotos de menores de 13 años** (relectura del 25-oct-2026, tarde: cláusula de las Business Terms y guía de API para menores, ver la última sección con fecha); **PERMITIDO con condiciones** para todo lo demás de Pintoria (condiciones obligatorias abajo). Jinglo: no aplica, no envía voz ni fotos a OpenAI.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.
Cambio reciente: las Service Terms se actualizaron el 16-oct-2026, tres días antes de esta lectura. Revisar cada 30 días.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Usage policies | https://openai.com/policies/usage-policies/ | "Effective: October 29, 2025" |
| Service terms (sección 6, Image and Video Capabilities) | https://openai.com/policies/service-terms/ | "Updated: October 16, 2026" |
| Services Agreement (business terms) | https://openai.com/policies/business-terms/ | "Effective: January 1, 2026" |
| Data controls (abuse monitoring, ZDR) | https://developers.openai.com/api/docs/guides/your-data | sin fecha visible |
| Guía de generación de imágenes (verificación de organización, safety identifiers) | https://platform.openai.com/docs/guides/image-generation | sin fecha visible |
| Países soportados por la API | https://help.openai.com/en/articles/5347006-openai-api-supported-countries-and-territories | sin fecha visible |

## Citas textuales

**Fotos de personas reales y semejanza**
- Service terms, sección 6: "You may not use Visual Capabilities to reproduce the likeness of any person without express consent and all necessary rights."
- Misma sección: "You may not use Visual Capabilities to assist in identifying a person nor to solicit or infer private or sensitive information about a person."
- Usage policies: no se puede usar "use of someone’s likeness, including their photorealistic image or voice, without their consent in ways that could confuse authenticity".

**Menores**
- Usage policies: los servicios "must never be used to exploit, endanger, or sexualize anyone under 18 years old". Prohíben "child sexual abuse material (CSAM), whether or not any portion is AI generated" y "shaming or otherwise stigmatizing the body type or appearance of minors".
- "We report apparent child sexual abuse material and child endangerment to the National Center for Missing and Exploited Children."
- Services Agreement 3.3 (c): el cliente no permitirá "allow minors to use OpenAI Services without consent from their parent or guardian". Aquí los niños no usan el servicio: lo usa el adulto.

**Deepfakes**
- Usage policies: "deceit, fraud, scams, spam, or impersonation". No hay cláusula de face-swap con ese nombre; la restricción relevante es la de semejanza sin consentimiento.

**Voz y llamadas automatizadas**
- No aplica a Pintoria. Service terms: la voz sintética exige consentimiento de la persona imitada y divulgación de que es IA ("must clearly disclose that generated speech is AI-generated").

**Uso de los datos y retención**
- Services Agreement 4.2: "OpenAI will not use Customer Content to develop or improve the Services, unless Customer explicitly agrees to such use."
- Data controls: "abuse monitoring logs are generated for all API feature usage and retained for up to 30 days, unless longer retention is required by law". La retención cero y el monitoreo modificado están "subject to prior approval by OpenAI and acceptance of additional requirements".
- Imágenes: la guía advierte "you may need to complete the API Organization Verification from your developer console before using GPT Image models."
- Identificador de seguridad: "include a stable, privacy-preserving safety_identifier in each image generation or image edit request" y "Safety identifiers are recommended but not required."

**País del vendedor**
- Guatemala figura en la lista de países soportados por la API.

**Alto riesgo futuro (otros productos)**
- La política lista como automatización de decisiones de alto riesgo: migración, seguros, legal, educación. Afecta a `ciudadania` y `seguros-tx`, no a esta revisión.

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PERMITIDO con condiciones** | La política no prohíbe fotos de menores ni ilustraciones de personas reales; exige consentimiento expreso y derechos sobre cada persona. El entregable es arte de línea, no fotorrealista. Riesgo residual real: que una foto familiar inocente (baño, piscina) active los filtros de seguridad o el monitoreo de menores y suspendan la organización. |
| Jinglo | No aplica | No hay llamada a OpenAI. El modelo de lenguaje del agente corre dentro de ElevenLabs (ver `elevenlabs.md`). |

## Condiciones obligatorias para Pintoria

1. Casilla de consentimiento del checkout: el adulto declara que tiene el consentimiento de **cada persona identificable** en las fotos (propio, o como padre o tutor de cada menor) y que acepta que una IA genere las ilustraciones. `legal-compliance` revisa el texto en el PR.
2. El resultado debe ser siempre arte de línea. Prohibido pedir fotorrealismo o "mantener el rostro idéntico".
3. El prompt no pide al modelo identificar a nadie ni inferir salud, raza, edad real u otros datos sensibles; la edad y el rol los declara el adulto.
4. `arquitecto`: enviar `safety_identifier` (hash del cliente, no el correo) en cada edición. Hoy `engines/generate/src/providers/openai.ts` no lo envía.
5. Proceso para bloqueos de moderación: no reintentar la misma foto, borrarla, avisar al cliente con un mensaje neutro y ofrecer reembolso. Si una foto parece material de abuso infantil, no analizar ni conservar: borrar y escalar a Juan el mismo día.
6. Completar la verificación de organización en la consola de OpenAI antes del lanzamiento.
7. La política de privacidad debe decir que el proveedor de imágenes puede conservar copias hasta 30 días (ya anotado en `docs/legal/subencargados.md`), no solo los 7 días nuestros. Pedir retención cero o monitoreo modificado a ventas de OpenAI; no prometer retención cero hasta que lo aprueben.
8. `arquitecto`: la guía de imágenes vigente no nombra `gpt-image-1-mini` [no verificado si sigue disponible]; confirmar modelo y su política antes del lanzamiento. **Resuelto el 25-oct-2026**: la página de deprecaciones confirma que `gpt-image-1-mini` se apaga el 1-dic-2026; ver la sección "Actualización 25-oct-2026" más abajo.

## Pendiente para `legal-compliance` (25-oct-2026, arquitecto)

**Resuelto el 25-oct-2026 por `legal-compliance`**: ver `docs/legal/aprobaciones/colorear-codigo-prueba-3-fotos.md` (aviso aprobado, sube a `colorear-legal-v5`; 3 fotos encajan con las 8 condiciones; el cambio de modelo sigue provisional como indica la sección "Actualización 25-oct-2026").

Dos cambios técnicos de Pintoria que necesitan su revisión escrita antes de dar el visto bueno al lanzamiento. Ninguno cambió el modelo de producción: el valor por defecto del código sigue siendo `gpt-image-1-mini` y el arquitecto no tocó ninguna variable en Vercel (el valor que `OPENAI_IMAGE_MODEL` tenga allí no fue verificado desde el repositorio).

1. **Cambio de modelo de imagen.** La página de deprecaciones de OpenAI anuncia el apagado de `gpt-image-1-mini` el 2026-12-01 (reemplazos `gpt-image-2.5-flare` y `gpt-image-2.5-sunburst`; `gpt-image-1` ya se apagó el 2026-10-23). El proveedor del repositorio ya lo soporta detrás de `OPENAI_IMAGE_MODEL` (no envía `input_fidelity` ni `response_format`, que los modelos nuevos rechazan o piden omitir). Antes de que Juan elija el modelo: leer la política y los términos vigentes de los modelos 2.5 (uso aceptable, fotos de menores, retención y entrenamiento) y dejar la cita en este archivo, como pide D27. Las condiciones 1 a 8 de arriba se asumen iguales hasta que se confirme.
2. **Hasta 3 fotos por persona (hasta 15 por pedido).** Antes era una foto por persona (máximo 5). Cada persona o mascota puede tener su foto obligatoria más dos opcionales (otros ángulos de la misma persona), y las tres viajan juntas al proveedor de imágenes en una sola llamada para dibujar el personaje. Lo que no cambia: las fotos se borran en cuanto los personajes están listos y siempre antes de 24 h (todas, incluidas las extra; hay prueba automática), el resultado sigue siendo arte de línea y el prompt pide un personaje de dibujos animados, nunca una copia fotorrealista ni idéntica (condición 2). Lo que sí cambia y hay que revisar:
   - El texto del aviso, apartado "Qué recogemos" (`packages/legal/src/colorear.ts`, es-419, es-ES y en): decía "las fotos que suba (de 1 a 5)" y ahora dice "una o varias de cada persona o mascota, de hasta 5 personas". La casilla K1 no menciona cantidad y no se tocó; la versión sigue siendo `colorear-legal-v4`. Decidir si el cambio del aviso exige subir la versión a v5.
   - Los textos de la web ya no dicen "una foto por persona": ahora "cada foto, de una sola persona o mascota". Ayuda de la landing y preguntas frecuentes actualizadas.
   - La condición 7 (el proveedor puede conservar copias hasta 30 días): con varias fotos por persona se envían más fotos al proveedor; la política de privacidad ya cubre "las fotos", sin límite de cantidad, pero conviene confirmarlo.
   - Mayor volumen de datos de personas, y de menores, por pedido. No se recogen datos nuevos de otro tipo.

## Actualización 25-oct-2026: modelos `gpt-image-2.5` (reemplazo de `gpt-image-1-mini`)

Veredicto D27 sobre el cambio de modelo: **PERMITIDO con condiciones, PROVISIONAL**. Las condiciones 1 a 8 de arriba siguen en pie. La parte técnica (deprecaciones y datos) está leída y fechada; las páginas de políticas de openai.com **no se pudieron releer** en esta ronda (ver "Lo que no pude verificar").
Lectura: 25-oct-2026, `legal-compliance`. Motivo de la lectura: Juan compara todos los proveedores de imagen antes del apagado de `gpt-image-1-mini` (ver `README.md`, sección "Revisión de proveedores de imagen del 25-oct-2026").

### Documentos leídos en esta ronda

| Documento | Enlace | Versión |
|---|---|---|
| Deprecaciones de la API | https://developers.openai.com/api/docs/deprecations.md | sin fecha visible; consultada el 25-oct-2026 |
| Guía de generación de imágenes | https://developers.openai.com/api/docs/guides/image-generation | sin fecha visible; consultada el 25-oct-2026 |
| Data controls (abuse monitoring, ZDR) | https://developers.openai.com/api/docs/guides/your-data | sin fecha visible; consultada el 25-oct-2026 |

### Lo que cambia

- Apagados anunciados: `gpt-image-1` el 23-oct-2026 (ya ocurrió), y `gpt-image-1-mini`, `gpt-image-1.5` y `chatgpt-image-latest` el 1-dic-2026. Los reemplazos que indica la página son `gpt-image-2.5-sunburst` y `gpt-image-2.5-flare`.
- La guía de imágenes sigue diciendo que la verificación de la organización "may" ser necesaria, y que `safety_identifier` es "recommended but not required". El parámetro `moderation` admite `auto` (por defecto) o `low`. Sin cambios de fondo respecto a lo ya citado arriba.
- Data controls: el monitoreo de abuso retiene hasta 30 días. La retención cero (ZDR) y el monitoreo de abuso modificado requieren aprobación de OpenAI. La guía lista la generación de imágenes como compatible con ZDR con los modelos `gpt-image-2.5` (y con `gpt-image-2`, `gpt-image-1.5` y `gpt-image-1-mini`). Las imágenes de entrada se analizan en busca de CSAM y se retienen para revisión manual incluso bajo ZDR; eso hay que reflejarlo en la política de privacidad.

### Lo que no cambia (condiciones para el nuevo modelo)

1. Usar `moderation: auto`; nunca `low`.
2. Fijar una versión concreta del modelo (no un alias) y que una prueba falle si cambia. Documentar cuál es en `docs/legal/subencargados.md`.
3. Pedir ZDR a ventas de OpenAI nombrando `gpt-image-2.5`; no prometer retención cero hasta la aprobación escrita. Mientras tanto, la política de privacidad dice que el proveedor puede conservar copias hasta 30 días, y que las imágenes de entrada pueden retenerse para revisión de seguridad infantil.
4. Enviar `safety_identifier` (hash del cliente, no el correo) en cada edición. Sigue pendiente en `engines/generate/src/providers/openai.ts` (condición 4).
5. Completar la verificación de la organización antes de cambiar de modelo.
6. Releer `gpt-image-2.5` en Service Terms sección 6 y en las Usage Policies en un navegador antes del cambio (ver abajo).

### Lo que no pude verificar

Las páginas de políticas de openai.com (Service Terms, Usage Policies y Business Terms) respondieron 403 a la herramienta de lectura. No se intentó saltar la protección. Una copia archivada de las páginas tampoco estuvo accesible desde este entorno y la extensión del navegador no estaba conectada. La última versión leída (19-oct-2026) decía "Updated: October 16, 2026" para las Service Terms; si se actualizaron después o si el texto de la sección 6 cambia para los modelos 2.5: [no verificado].
Acción: Juan o `arquitecto` abren las tres páginas en un navegador, comparan con las citas de este archivo y avisan a `legal-compliance` si hay diferencias. Hasta entonces el veredicto es provisional.

**Actualización del mismo día (tarde):** las tres páginas ya abrieron con la herramienta de lectura. Ver la sección «Relectura 25-oct-2026 (tarde)» más abajo; el veredicto provisional queda sustituido por el de esa sección.

### Cambio 2 del bloque "Pendiente" (hasta 3 fotos por persona)

Revisado el mismo día en `docs/legal/aprobaciones/colorear-codigo-prueba-3-fotos.md`: la política de OpenAI no limita las fotos por persona ni por pedido; el aviso nuevo se aprueba y la versión sube a `colorear-legal-v5` (el cambio lo hace `arquitecto`).

## Relectura 25-oct-2026 (tarde): políticas de OpenAI y veredicto sobre `gpt-image-2.5-sunburst` y `gpt-image-2.5-flare`

Lectura: 25-oct-2026, `legal-compliance`, a petición del coordinador. Veredicto D27 para Pintoria: **RIESGO ALTO para fotos de menores de 13 años; PERMITIDO con condiciones para fotos de personas de 13 o más, mascotas y dibujos**. Sustituye al veredicto provisional de la sección anterior. No es asesoría de abogado.

Límite de la lectura: la herramienta resume la página con un modelo pequeño y limita las citas, así que no obtuve el texto íntegro. Los fragmentos de abajo son los que devolvió, repetidos de forma consistente en dos lecturas. Antes de cualquier cobro, Juan o `arquitecto` abren las Business Terms (§2) en un navegador y confirman las palabras exactas [no verificado: texto íntegro].

### Documentos releídos

| Documento | Enlace | Lectura del 19-oct | Hoy |
|---|---|---|---|
| Usage Policies | https://openai.com/policies/usage-policies/ | "Effective: October 29, 2025" | "Effective: November 20, 2026"; changelog con entrada del 2026-10-21 |
| Service Terms | https://openai.com/policies/service-terms/ | "Updated: October 16, 2026" | "Updated: October 16, 2026" (sin cambio) |
| Business Terms | https://openai.com/policies/business-terms/ | titulada "Services Agreement", "Effective: January 1, 2026", §3.3(c) y §4.2 | titulada "OpenAI Business Terms", sin fecha, §2(c), §3.2 y §8.3 |
| Guía de API para menores de 18 | https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance | no leída | sin fecha visible |

### Comparación con la lectura del 19-oct

- **Usage Policies.** Las cláusulas que cité entonces siguen con las mismas palabras: semejanza sin consentimiento ("use of someone's likeness, including their photorealistic image or voice, without their consent"), CSAM, "facial recognition databases without data subject consent" y suplantación. No exigen revelar el uso de IA. No dicen nada específico sobre fotos de menores subidas por un adulto.
- **Cambio del 21-oct, efectivo el 20-nov-2026** (changelog de la propia página). Cuatro asuntos: (a) restricciones a usar modelos y salidas para entrenar otros modelos; (b) protección de niños y adolescentes más clara (abuso, CSAM, grooming, sextorsión, sexualización; para adolescentes, contenido inapropiado, dietas, burlas del cuerpo, retos peligrosos, juegos de rol sexuales o violentos); (c) usos de alto riesgo sin revisión humana (incluye seguros, legal, educación y migración); (d) principios de seguridad nacional y aprobación previa para seguridad nacional, fuerzas del orden e **intermediarios de acceso a modelos**. Efecto en Pintoria: ninguno bloquea. No entrenamos modelos (a); el entregable es arte de línea para colorear, sin sexualización ni burla del cuerpo (b); (c) afecta a `ciudadania` y `seguros-tx`, no a Pintoria; (d) refuerza no pasar OpenAI por un agregador (fal.ai, Replicate): se llama a OpenAI directamente. Sin copia del texto anterior no pude hacer una comparación completa: comparé contra mis citas del 19-oct.
- **Service Terms.** Misma fecha. La sección 6 no cambia: no identificar a una persona y no reproducir su semejanza "without express consent and all necessary rights". No nombra modelos concretos ni menores. Es decir, no hay diferencia entre `gpt-image-1-mini` y `gpt-image-2.5` en este documento.
- **Business Terms: hallazgo nuevo para el veredicto.** La Sección 2 «Restrictions», apartado (c), prohíbe al cliente: "send us any personal information of children under 13 or the applicable age of digital consent", y en el mismo apartado "allow minors to use our Services without consent from their parent or guardian". El 19-oct cité solo la segunda mitad (como §3.3(c) del "Services Agreement"). No puedo decir si el texto cambió desde entonces (el documento se llama distinto y tiene otra numeración) o si lo pasé por alto; en cualquier caso mi veredicto anterior no lo tuvo en cuenta. Fue un error mío. Las demás cláusulas citadas se mantienen en sustancia: §3.2 no usar el contenido del cliente para mejorar los servicios y §8.3 borrado a los 30 días de terminar el contrato.
- **Guía de API para menores de 18** (la había citado `docs/investigacion/santa.md`): "Organizations serving minors must comply with all applicable child protection, safety, and privacy laws, including" COPPA, y "You should not use OpenAI services to process any personal data of children under 13 or the" edad de consentimiento digital aplicable "without first implementing zero data retention in our API". Pide además filtros, monitoreo, garantía de edad donde corresponda y avisa de posibles auditorías, advertencias, suspensión o terminación del acceso. No distingue entre un desarrollador que procesa datos de menores y menores que usan el producto.

### Qué significa para Pintoria

Las fotos que Pintoria envía a OpenAI son datos personales de niños (los libros son para 3 a 12 años; la regla COPPA cuenta la foto de un niño como dato personal [no verificado contra el texto de la regla en esta lectura]). Sin retención cero (hoy solo hay el monitoreo de abuso de hasta 30 días), la lectura conservadora de la cláusula 2(c) y de la guía es que **no se pueden enviar fotos de menores de 13 años a OpenAI** hasta tener ZDR aprobada. El riesgo es contractual con OpenAI (advertencia, suspensión o cierre de la organización, y con ella la capacidad de vender), no un daño a las familias: el aviso ya les dice que el proveedor conserva copias hasta 30 días. Aplica igual al modelo de hoy (`gpt-image-1-mini`) que a los 2.5. La retención cero se pide por escrito a ventas de OpenAI y no la concede esta puerta.

### Veredicto por uso

| Uso | Veredicto | Razón |
|---|---|---|
| `gpt-image-2.5-sunburst` en el paso de personaje, con fotos de menores de 13 | **RIESGO ALTO** | Ninguna política prohíbe el modelo ni dibujar a un niño con el consentimiento del padre; lo que choca es enviar la foto sin ZDR (Business Terms §2(c) y guía para menores). Se trata como no permitido en la práctica hasta tener la aprobación de OpenAI o la decisión escrita de Juan. |
| `gpt-image-2.5-sunburst` con fotos de personas de 13 años o más y mascotas | Permitido con condiciones | Condiciones 1 a 8, las de la actualización del 25-oct y las de abajo. |
| `gpt-image-2.5-flare` en las páginas (dibujos de los personajes, sin nombres) | Permitido con condiciones | Recibe dibujos, no fotos. Que OpenAI cuente un dibujo muy parecido de un menor como dato personal es [no verificado]; por prudencia la solicitud de ZDR nombra ambos modelos. |
| Piloto cerrado con `gpt-image-1-mini` y fotos de niños | **RIESGO ALTO**, igual que arriba | El modelo anterior no cambia la cláusula. |

### Qué decide Juan (riesgo alto, plan B)

1. **Pedir ZDR hoy** (texto abajo). Es lo que desbloquea fotos de menores de 13 con OpenAI, para cualquier modelo.
2. **Mientras llega la respuesta**, una de estas tres, a elección de Juan: (a) el piloto cerrado solo con fotos de adultos, de personas de 13 o más y de mascotas; (b) asumir por escrito el riesgo contractual con OpenAI en un piloto de pocos adultos conocidos. No me corresponde aprobarlo; lo desaconsejo si es la misma organización con la que se cobrará, porque una suspensión frena también las ventas; (c) plan B: Recraft, sin darlo de alta, a la espera de su confirmación escrita sobre retención cero y fotos de menores (`recraft.md`). Ni Google ni los agregadores sirven de plan B hoy (`README.md`, sección 2b).
3. Hasta que Juan elija, `legal-compliance` no da el visto bueno de proveedor a ninguna foto de un menor de 13 años enviada a OpenAI.

### Condiciones que se mantienen o se añaden

1. Las 8 condiciones de este archivo y las 6 de la actualización del 25-oct: `moderation: auto`, versión fija del modelo, `safety_identifier`, verificación de la organización antes de usar un 2.5 y ZDR solicitada nombrando los modelos.
2. **Parecido del personaje.** Se permite pedir un personaje de dibujos animados que se parezca mucho a la persona, con sus rasgos distintivos (pelo, color de piel, gafas, ropa, expresión). La política no prohíbe el parecido, prohíbe la semejanza sin consentimiento y la que pueda confundirse con la real, y para eso están K1 y el aviso. Sigue prohibido pedir fotorrealismo, «retrato», «copia exacta» o «idéntica»: el resultado es arte de línea (condición 2 de este archivo). Frase aprobada para el prompt: "a cartoon character clearly recognizable as this person by their distinctive features (hair, skin tone, glasses, clothing), always as simple line art, never a photorealistic or identical copy". La prueba de `tests/colorear-photos.test.ts` puede aceptar «recognizable» y «distinctive features»; sigue rechazando «identical», «exact», «faithful», «portrait» y «lifelike» fuera de la frase de negación. A más parecido, más pesa que K1 quede registrada para cada pedido y que no se envíen fotos de quien no tenga el permiso de un adulto responsable.
3. No cambia el aviso ni la casilla: ya dicen que el proveedor puede conservar copias hasta 30 días o más para revisar un posible abuso grave. Si llega ZDR, "hasta 30 días" sigue siendo cierto; la revisión de imágenes marcadas por seguridad infantil se mantiene incluso con ZDR.
4. Releer las tres políticas el 20-nov-2026, cuando entran en vigor las Usage Policies nuevas, y cada 30 días.

### Texto propuesto para ventas de OpenAI (lo envía Juan; yo no envío nada)

> We operate a paid web service in which an adult parent or guardian uploads photos (1 to 3 per person, up to 5 people, including children aged 3 to 12) with explicit consent, to create line-art coloring-book characters delivered as a PDF to the adult. Children never use the service or the API. We use the Images API (edits) with gpt-image-2.5-sunburst and gpt-image-2.5-flare, and currently gpt-image-1-mini. Section 2(c) of your Business Terms and your under-18 API guidance say personal data of children under 13 should be processed only after zero data retention is implemented. We request zero data retention (or equivalent written approval) for these requests, and written confirmation that this use is acceptable. Our own copies of the photos are deleted within 24 hours. Please also tell us how input images flagged for child safety are handled under zero data retention.

## No verificado

- Si OpenAI trata una ilustración de línea como "reproducir la semejanza" de la persona (se asume que sí, por eso se exige consentimiento).
- Texto íntegro de las tres políticas: la relectura de la tarde del 25-oct usó una herramienta que resume y limita las citas; confirmar en un navegador el §2(c) de las Business Terms y la guía de menores. Si el §2(c) ya estaba en el «Services Agreement» del 19-oct: [no verificado].
- Si la cuenta de Guatemala sigue en la lista de países soportados vigente.
- Obligación de reportar a NCMEC para un operador radicado en Guatemala que sirve a EE. UU.
- Fecha de la guía de datos y de la guía de imágenes.
