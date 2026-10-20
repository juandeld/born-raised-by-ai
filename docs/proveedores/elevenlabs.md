# ElevenLabs (Agents Platform): voz y agente de las llamadas de Jinglo

Veredicto D27: **PROHIBIDO para Jinglo hasta tener aprobación escrita de ElevenLabs** (su política veta productos dirigidos a menores de 18 sin esa aprobación). Pintoria: no aplica, no usa ElevenLabs.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

Hallazgo que cambia el plan: `docs/legal/solicitud-elevenlabs.md` (estado "listo para enviar", no enviada) se redactó antes de poder leer la política completa. Ahora está leída: la cláusula de menores es una **prohibición con excepción por aprobación escrita**, no solo un tema de transparencia. Jinglo no debe cobrar ni llamar a ningún niño real hasta que esa aprobación exista. La solicitud debe actualizarse (sección "Qué hacer").

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Prohibited Use Policy | https://elevenlabs.io/use-policy | "Last Updated: 09 October 2026" (hace 10 días) |
| Terms of Service (no EEE) | https://elevenlabs.io/terms-of-use | "Last Updated: 09 October 2026" |
| Generative AI Prohibited Use Policy (Google, aplica al modelo Gemini del agente) | https://policies.google.com/terms/generative-ai/use-policy | "Last Modified: December 17, 2024" |
| Gemini API Additional Terms (Google) | https://ai.google.dev/gemini-api/terms | pie de página "Last updated 2026-04-28 UTC" |

Contratamos como cliente fuera del EEE, Suiza y Reino Unido (Guatemala): aplican los Terms no EEE.

## Citas textuales

**Menores (bloqueo)**
- Policy, sección 1: "Apps, products, or experiences directed at individuals under 18 are prohibited unless we have assessed and approved them in writing."
- Misma sección: "Where approved, you must obtain any parental consent required by applicable law and maintain records of that consent." Coincide con el registro de consentimiento del checkout (texto, hora, IP).
- Representación de menores: no se pueden enviar "voice recordings of anyone under 18 to create or train a voice model" ni crear una voz o avatar con "the likeness of, or [...] designed to be recognized as, a specific real minor". Jinglo no clona ni la voz del niño ni la del adulto (D12: voz diseñada).
- Terms 1(a): menores de 18 no pueden usar los servicios. La cuenta es de Juan; el niño no es usuario de la cuenta, pero sí oye la voz.

**Llamadas automatizadas**
- Policy, sección 2: se prohíbe "Generating content for spam, or for automated calling or messaging that is unlawful or made without the consent required by applicable law". El consentimiento de la llamada es el del checkout más las teclas del preludio.

**Transparencia de IA (tensión con D13)**
- Policy, sección 10: "You must clearly disclose when people are interacting with AI where required by law or where failing to do so would materially mislead them."
- D13 dice que el personaje no revela ser IA al niño y que la revelación va completa al adulto. ¿Basta eso ante la frase "would materially mislead them" (el niño es quien habla)? **Ambiguo = riesgo alto (D27)**. Solo se resuelve con la respuesta escrita de ElevenLabs a la pregunta 1 de la solicitud.
- También: no se pueden quitar ni alterar marcas de agua o metadatos de procedencia "for the purpose of disguising AI-generated content".

**Suplantación**
- Policy, sección 3: no se puede clonar ni imitar "the voice, identity, or likeness of any living individual without their explicit and informed consent". Santa, los Reyes Magos, el Ratoncito Pérez y el Tooth Fairy son folclore (regla de marcas); Rex es personaje original. Sin persona real imitada.

**Uso comercial**
- Policy, sección 12 y Terms 1(c): prohibido "Using our Services for commercial purposes on a free plan". Según `docs/legal/subencargados.md` la cuenta es Pro; confirmar en el panel [no verificado en esta lectura].
- Policy, sección 12: no se pueden dar los servicios o el Output a usuarios finales "on terms more permissive than those that apply to you". La grabación que recibe el padre es Output: los términos de Jinglo deben darle solo uso personal y no comercial.

**Datos y entrenamiento (nuevo, afecta a COPPA)**
- Terms 4(d): el cliente concede a ElevenLabs una licencia "perpetual and irrevocable" para usar el Contenido, incluida la voz, para "provide the Services [...] improve the Services, and to develop new services and products", sublicenciable.
- Terms 4: "you may opt out of our use of your Content for training at any time by navigating to the 'Data use' menu in the 'Terms and Privacy' section of your ElevenLabs account". El opt-out no afecta usos anteriores.
- La voz de un niño en una llamada es dato de un menor de 13 años. Si no se activa el opt-out, un tercero lo usa para sus propios fines. Es el punto más delicado para la regla COPPA de 2025.
- Retención cero: solo Enterprise (según `subencargados.md`); no disponible en el plan actual.

**Alto impacto, asesoría personalizada**
- Policy, sección 11: no aplica a Jinglo (cuentos y felicitaciones). Sí limita a futuro `ciudadania` y `seguros-tx`.

**Modelo de lenguaje del agente (Google Gemini por defecto)**
- Código: `engines/calls/src/providers/voice-elevenlabs.ts` usa `llm: env.ELEVENLABS_LLM ?? "gemini-2.5-flash"`.
- Gemini API Additional Terms: el cliente no usará el servicio en una app "directed towards or is likely to be accessed by individuals under the age of 18". Quien contrata con Google es ElevenLabs; si esa cláusula se traslada a sus clientes es [no verificado]. Es otro motivo para que la aprobación escrita nombre el modelo.
- Política de Google para IA generativa: se prohíbe "Impersonating an individual (living or dead) without explicit disclosure, in order to deceive" y "Misrepresenting the provenance of generated content by claiming it was created solely by a human, in order to deceive". Santa no es una persona real y nunca dice ser humano (D13): sin conflicto aparente.

**País del vendedor**
- Sin restricción por país en lo leído. Sanciones y controles de exportación recaen en el cliente (sección 9).

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Jinglo | **PROHIBIDO** hasta aprobación escrita; **RIESGO ALTO** después, por la transparencia de IA ante el niño y el uso de datos para entrenamiento | Producto dirigido a menores de 18: la excepción exige que ElevenLabs lo haya evaluado y aprobado por escrito. La aprobación debe cubrir el flujo D13 y el modelo de lenguaje. |
| Pintoria | No aplica | No usa ElevenLabs. |

El resto de personajes de llamada (Reyes Magos, Ratoncito Pérez, Tooth Fairy, Rex, dot, memorias) quedan bajo el mismo bloqueo: son productos dirigidos a menores.

## Qué hacer

1. **Juan no envía todavía la solicitud existente: primero la actualiza `legal-compliance`** (ya hay un borrador). Cambios necesarios:
   - Citar la sección 1 de forma literal y pedir expresamente su aprobación escrita bajo la sección de protección de menores (por ejemplo: "your written approval under the Protection of Minors section"; texto propuesto por nosotros, no cita de la política), no solo una confirmación de que el uso parece aceptable.
   - Corregir la frase de la sección "Data": hoy afirma que no se entrena con los datos. Eso es cierto solo con el opt-out de "Data use" activado; indicarlo, o preguntar si el opt-out cubre las conversaciones del Agents Platform [no verificado].
   - Añadir una pregunta sobre qué modelos de lenguaje están aprobados para productos con menores y si el modelo por defecto (Gemini) lo está.
   - Mencionar la transparencia de IA del punto 10 y pedir criterio escrito sobre D13.
2. **Antes de cualquier llamada real a un niño**: activar el opt-out de entrenamiento en "Data use" y guardar captura con fecha en `docs/legal/evidencia/`.
3. Mientras no haya aprobación: no abrir la venta de Jinglo, no lanzar anuncios, no llamar a un niño real (las llamadas de prueba a números de adultos de Juan, sin menores, siguen siendo posibles).
4. `arquitecto`: no cambiar el modelo del agente sin pasar por esta puerta; dejar el modelo configurable (ya lo es) por si la respuesta pide cambiarlo.
5. `legal-compliance`: llevar a la lista del abogado humano ($400) la pregunta de si la regla de transparencia del art. 50 de la ley europea de IA exige informar a la persona que habla con el sistema (el niño) o basta informar al adulto responsable.
6. Plan B si la respuesta es no: evaluar otro proveedor de voz con política para productos con menores, o retirar Jinglo y mantener Pintoria como único producto de la temporada. Decide Juan.

## No verificado

- Si el opt-out de entrenamiento cubre las conversaciones del Agents Platform.
- Plan de la cuenta (se asume Pro).
- Si las restricciones de Google sobre menores se trasladan a los clientes de ElevenLabs.
- Dirección vigente de soporte o de confianza y seguridad para la solicitud.
