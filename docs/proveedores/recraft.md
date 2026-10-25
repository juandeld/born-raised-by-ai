# Recraft: API de generación y edición de imágenes (modelos propios)

Veredicto D27: **PERMITIDO con condiciones** para Pintoria, solo con los modelos propios de Recraft y después de tres confirmaciones escritas (abajo). Jinglo: no aplica, no envía fotos a Recraft.
Lectura: 25-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Cambio reciente: los Developer Terms y la Privacy Policy se actualizaron el 20-oct-2026, cinco días antes de esta lectura (la política entra en vigor el 3-nov-2026 para cuentas existentes). Releer a los 30 días.
Motivo del veredicto: es el único proveedor revisado en esta ronda que, en el texto del contrato, promete no entrenar con el contenido de la API, no guardar más de lo necesario para entregar, no exigir "Powered by" y ofrece un acuerdo de procesamiento de datos con cláusulas tipo. Quedan tres puntos que el contrato no responde y que sí importan para fotos de menores.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Developer Terms (API) | https://www.recraft.ai/legal/developer-terms | 20-oct-2026 |
| Terms of Service (producto web) | https://www.recraft.ai/legal/terms | sin fecha visible [no verificado] |
| Privacy Policy | https://www.recraft.ai/legal/privacy | en vigor 20-oct-2026 (cuentas nuevas) y 3-nov-2026 (existentes) |
| Data Processing Addendum | https://www.recraft.ai/legal/dpa | sin fecha visible [no verificado] |
| Lista de subencargados | https://www.recraft.ai/subprocessors | 5-oct-2026 |

## Citas textuales

**Edad y titular**
- Developer Terms §2.1: el titular debe ser mayor de 18. Pintoria lo opera una persona adulta o una empresa; los niños no usan la API.

**Consentimiento de personas reales**
- Developer Terms §6.1: el cliente garantiza tener el consentimiento de toda persona identificable en el contenido que sube. La casilla parental del checkout lo cubre. El contrato no menciona a los menores de forma especial: [no verificado] si Recraft acepta fotos de niños subidas por un padre.

**Propiedad y entrenamiento**
- Developer Terms §6.2: el cliente es dueño de los Assets generados y estos no pueden usarse para entrenar IA.
- Developer Terms §6.3: Recraft no entrena con los Assets de la API. Es lo que Pintoria exige.

**Retención**
- Developer Terms §4.2: por defecto, Recraft no almacena nada más allá de lo necesario para entregar. No hay cifra de horas ni días en el texto: la retención cero exacta [no verificado]; hay que confirmarla por escrito (condición 3).

**Servicios de IA de terceros dentro de Recraft (riesgo)**
- Developer Terms §4.4: servicios de IA de terceros pueden entrenar con los datos. Aplica si se eligen modelos que Recraft aloja de otros fabricantes. Por eso la condición 1 limita el uso a modelos propios de Recraft.
- Privacy Policy: el contenido de la API no se usa para entrenamiento; los proveedores externos operan con retención cero o equivalente. Subencargados (5-oct-2026) incluyen AWS, OpenAI, Anthropic, Google, Microsoft y Nebius (EE. UU. y UE). Cuál de ellos toca una foto en un modelo propio de Recraft: [no verificado].

**Metadatos y marcas**
- Developer Terms §6.4: no se deben quitar metadatos ni marcas de agua "except as may be expressly permitted by applicable law". Si al incrustar las imágenes en el PDF se pierden metadatos, [no verificado] si eso cuenta (condición 3). No hay atribución visible "Powered by Recraft" en lo leído.

**Acuerdo de datos**
- DPA con cláusulas contractuales tipo y estatus de proveedor de servicios bajo la ley de privacidad de California (CCPA).

**Pagos**
- Las unidades prepagadas de la API no son reembolsables. País del titular: Guatemala [no verificado] (medio de pago).

## Veredicto por punto (Pintoria)

| Punto | Veredicto | Razón |
|---|---|---|
| Fotos de menores subidas por su padre o madre | **PERMITIDO con condiciones** | El contrato no las prohíbe ni las nombra; se pide confirmación escrita |
| Imágenes de personas reales | **PERMITIDO con condiciones** | Consentimiento del cliente (§6.1) |
| Contenido de IA vendido; propiedad o licencia | **PERMITIDO** | El cliente es dueño de los Assets (§6.2) |
| Retención y entrenamiento | **PERMITIDO con condiciones** | No entrena (§6.3); sin almacenamiento por defecto (§4.2); confirmar retención cero por escrito |
| País del titular: Guatemala | **RIESGO ALTO** hasta confirmar el medio de pago | No hay lista de países; falta la prueba de pago |
| Atribución o marca de agua obligatoria | **PERMITIDO con condiciones** | Sin "Powered by"; no quitar metadatos si la ley no lo permite (§6.4) |

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PERMITIDO con condiciones** | Ver condiciones |
| Jinglo | No aplica | No hay llamada a Recraft |

## Condiciones obligatorias para Pintoria

1. Usar solo los modelos propios de Recraft. Nunca los modelos de terceros alojados en su plataforma (§4.4). `arquitecto` fija el nombre del modelo en la configuración y una prueba falla si cambia.
2. Antes de enviar una foto real, obtener respuesta escrita de Recraft sobre: (a) retención cero de las imágenes de entrada de la API; (b) que las fotos de menores subidas por un padre con consentimiento son aceptables; (c) que re-codificar las imágenes dentro de un PDF no incumple §6.4. Texto propuesto abajo; lo envía Juan.
3. Firmar el DPA antes de enviar datos personales. Anotar a Recraft y sus subencargados relevantes en `docs/legal/subencargados.md`.
4. Casilla de consentimiento del checkout: el adulto declara que tiene el consentimiento de cada persona identificable (propio, o como padre o tutor de cada menor) y que acepta que una IA genere las ilustraciones. `legal-compliance` revisa el texto en el PR.
5. El resultado debe ser siempre arte de línea. Prohibido pedir fotorrealismo o "mantener el rostro idéntico".
6. Proceso de bloqueo igual al de `openai.md` (no reintentar la misma foto, borrarla, mensaje neutro, reembolso; si parece material de abuso infantil, borrar sin analizar y escalar a Juan el mismo día).
7. La política de privacidad dice que el proveedor de imágenes puede conservar copias durante el tiempo que Recraft confirme por escrito, no solo nuestras 24 horas.
8. Pagos: comprar unidades prepagadas mínimas (no reembolsables) hasta confirmar volumen. Confirmar que una cuenta de Guatemala puede pagar con tarjeta o PayPal antes de recargar.
9. Releer en 30 días (el contrato cambió el 20-oct-2026).

## Plan B

OpenAI `gpt-image-2.5` (ver `openai.md`), que queda como proveedor principal provisional mientras no llegue la respuesta de Recraft. Google solo con respuesta escrita (ver `google.md`).

## Consulta propuesta a Recraft (inglés; la envía Juan, no se envía sin su orden)

> We operate a paid web service where an adult parent uploads up to 3 photos of each of up to 5 family members, including children aged 3 to 8, with explicit parental consent. We would send the photos to the Recraft API using Recraft's own models only, to produce line-art coloring-book characters, delivered as a PDF to the parent. (1) Do you retain the input images or outputs of API calls beyond delivery? Can you confirm zero retention in writing? (2) Are photos of minors uploaded by a parent with consent acceptable under the Developer Terms? (3) Section 6.4 prohibits removing metadata and watermarks except as permitted by law; does embedding generated images in a PDF (re-encoded) breach it? (4) Which sub-processors handle input images when using Recraft's own models? (5) Our company is established in Guatemala: which payment methods do you accept?

## No verificado

- Retención exacta de las fotos de entrada (§4.2 no da cifra).
- Si Recraft acepta fotos de menores.
- Si re-codificar en PDF incumple §6.4.
- Qué subencargados tocan una foto en un modelo propio.
- Medio de pago desde Guatemala.
- Fecha del Terms of Service y del DPA.
