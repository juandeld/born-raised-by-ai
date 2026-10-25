# Google: Gemini API y Vertex AI (generación y edición de imágenes con Nano Banana / Imagen)

Veredicto D27: **RIESGO ALTO** para Pintoria, tanto en Gemini API como en Vertex AI (la conclusión no cambia entre las dos). Jinglo: no aplica, no envía fotos a Google.
Lectura: 25-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Motivo central: los dos conjuntos de términos prohíben usar el servicio dentro de un sitio o aplicación "dirigido o probablemente accesible" a menores de 18. Pintoria lo opera un adulto, pero el producto es un libro para niños con la cara del niño. La política no dice si eso cuenta. Por D27, ambiguo = riesgo alto: no se abre cuenta ni clave hasta tener respuesta escrita de Google.
Nota de nombre: en las páginas de Google Cloud, "Vertex AI" aparece ahora como "Gemini Enterprise Agent Platform (formerly Vertex AI)".

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Gemini API Additional Terms of Service | https://ai.google.dev/gemini-api/terms | "Effective March 23, 2026" (página actualizada 2026-04-28) |
| Google APIs Terms of Service (§6 atribución) | https://developers.google.com/terms | "Last modified: November 9, 2021" |
| Generative AI Prohibited Use Policy | https://policies.google.com/terms/generative-ai/use-policy | "Last Modified: December 17, 2024" |
| Gemini API: abuse monitoring | https://ai.google.dev/gemini-api/docs/usage-policies | sin fecha visible |
| Gemini API: países disponibles | https://ai.google.dev/gemini-api/docs/available-regions | sin fecha visible |
| Gemini API: guía de generación de imágenes | https://ai.google.dev/gemini-api/docs/image-generation | "Last updated 2026-10-09 UTC" |
| Google Cloud Platform Terms of Service (§4.3 abuso de IA generativa) | https://cloud.google.com/terms | "Last modified October 12, 2026" |
| Google Cloud Service Specific Terms (§18 entrenamiento, §20 IA generativa) | https://cloud.google.com/terms/service-terms | sin fecha propia visible [no verificado] |
| Google Cloud Acceptable Use Policy | https://cloud.google.com/terms/aup | la página lista versiones anteriores con "Last modified October 12, 2026" |
| Vertex / Agent Platform: gobierno de datos y retención cero | https://cloud.google.com/vertex-ai/generative-ai/docs/data-governance | "Last updated 2026-10-22 UTC" |
| Vertex / Agent Platform: abuse monitoring | https://cloud.google.com/vertex-ai/generative-ai/docs/learn/abuse-monitoring | "Last updated 2026-10-22 UTC" |
| Vertex / Agent Platform: Gemini image y IA responsable | https://cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/gemini-image-responsible-ai | "Last updated 2026-10-22 UTC" |
| Cloud Billing: monedas y países | https://docs.cloud.google.com/billing/docs/resources/currency | "Last updated 2026-10-22 UTC" |

## Citas textuales

**Menores de 18 (la cláusula que decide)**
- Gemini API Additional Terms, "Age Requirements": no se usará el servicio en un sitio o aplicación "directed towards or is likely to be accessed by individuals under the age of 18".
- Google Cloud Service Specific Terms, §20(d) "Age Restrictions": el cliente no usará un servicio de IA generativa en un sitio o aplicación con esa misma formulación ("directed towards or is likely to be accessed by individuals under the age of 18").
- Los menores no entran en Pintoria (compra el adulto), pero el entregable es para ellos. Que la cláusula alcance a un producto cuyo comprador es adulto y cuyo beneficiario es un niño no se puede deducir del texto.

**Uso empresarial**
- Gemini API Additional Terms: el servicio es para desarrolladores "for professional or business purposes, not for consumer use". Pintoria encaja como negocio; el consumidor no usa la API.

**Personas reales y consentimiento**
- Prohibited Use Policy: se prohíbe violar derechos de otros, por ejemplo "using personal data or biometrics without legally-required consent".
- Guía de imágenes de Gemini API: "Make sure you have the necessary rights to any images you upload."
- Misma política: se prohíbe "Misrepresenting the provenance of generated content by claiming it was created solely by a human, in order to deceive." Nuestra revelación genérica de IA (D23) es compatible.

**Contenido de IA vendido y propiedad**
- Gemini API Additional Terms, "Use of Generated Content": "Google won't claim ownership over that content." Google puede generar contenido igual o parecido para otros.
- Service Specific Terms §20(a): el contenido generado es Customer Data y Google "does not assert any ownership rights". No hay prohibición de venderlo.

**Retención y entrenamiento**
- Gemini API, servicios de pago (con Cloud Billing activo): Google no usa los prompts ni las respuestas para mejorar sus productos y los trata como encargado. En el nivel gratuito sí los usa y revisores humanos pueden leerlos; los términos piden no enviar información personal ni sensible a ese nivel.
- Gemini API, abuse monitoring: Google retiene prompts y salidas "fifty-five (55) days" para detectar violaciones de la política de uso. No hay retención cero declarada.
- Vertex, Service Specific Terms §18: Google "will not use Customer Data to train or fine-tune any AI/ML models" sin permiso del cliente.
- Vertex, abuse monitoring: si un clasificador marca la actividad, Google puede registrar prompts "stored securely for up to 90 days" en la región del proyecto, con revisión humana para clientes bajo los términos en línea. Los clientes con Cloud Master Agreement quedan exentos por defecto.
- Gemini API, términos de pago: los datos pueden guardarse o estar en caché de forma transitoria "in any country in which Google or its agents maintain facilities". En Vertex se elige región (el endpoint `global` puede servir desde cualquier región).

**Filtros técnicos sobre niños (Vertex)**
- Página "Gemini image and responsible AI": hay una categoría de bloqueo "Child" que detecta "child content that isn't allowed due to the API request settings or allowlisting". Sugiere que el contenido infantil puede estar restringido salvo lista de permitidos. Puede bloquear fotos de menores aunque la política las admita.
- Gemini API Additional Terms: "Applications with less restrictive safety settings may be subject to Google's review and approval." No bajar los umbrales de seguridad.

**Marca de agua y atribución**
- Guía de imágenes: "All generated images include a SynthID watermark." Es invisible. No encontré atribución visible obligatoria para generación de imágenes. API Terms §6(b) exige mostrar las atribuciones "required by Google as described in the documentation"; la documentación de imágenes no pide ninguna. Las atribuciones de la Gemini API que sí existen son de Búsqueda y Mapas (no se usan).

**País del titular**
- Gemini API, países disponibles: Guatemala figura. También figuran Estados Unidos, Reino Unido, España y México.
- Gemini API Additional Terms: en el EEE, Suiza y Reino Unido solo se pueden usar servicios de pago ("only Paid Services"). Aplica a clientes de España y Reino Unido.
- Facturación (Cloud Billing): Guatemala no está en la lista de países con moneda local; la página dice que los países no listados "might incur charges in USD". Si una cuenta de facturación de Cloud se puede abrir a nombre de una persona o empresa de Guatemala: [no verificado].

## ¿Cambia la conclusión entre Gemini API y Vertex?

| Tema | Gemini API (de pago) | Vertex / Agent Platform | ¿Cambia el veredicto? |
|---|---|---|---|
| Cláusula de menores de 18 | Additional Terms, "Age Requirements" | Service Specific Terms §20(d) | No: misma frase |
| Entrenamiento con nuestros datos | No (de pago) | No (§18) | No |
| Registro por abuso | 55 días | Hasta 90 días en la región elegida; revisión humana | Vertex retiene más, pero en la región elegida |
| Dónde se procesa | Cualquier país con instalaciones de Google | Región elegida (US o UE); `global` puede cruzar regiones | Vertex es mejor para residencia |
| Cláusula "no consumo" | Sí | No la encontré | Solo afecta a Gemini API, ambigua |
| EEE, Suiza, Reino Unido | Solo servicios de pago | Cuenta de pago | Sin cambio práctico |
| Filtro "Child" | No documentado en lo leído | Documentado, con "allowlisting" | Riesgo técnico mayor en Vertex |
| Facturación desde Guatemala | Cloud Billing activo | Cloud Billing | Igual; [no verificado] |

## Veredicto por punto (Pintoria)

| Punto | Veredicto | Razón |
|---|---|---|
| Fotos de menores subidas por su padre o madre | **RIESGO ALTO** | Cláusula de menores de 18 ambigua para este caso; en Vertex, filtro "Child" con lista de permitidos |
| Imágenes de personas reales | **PERMITIDO con condiciones** | Exige consentimiento y derechos sobre lo subido; el casillero parental del checkout lo cubre |
| Contenido de IA vendido; propiedad o licencia | **PERMITIDO** | Google no reclama propiedad; no prohíbe la venta |
| Retención y entrenamiento | **PERMITIDO con condiciones** | Sin entrenamiento en servicios de pago; retención de 55 días (Gemini API) o hasta 90 (Vertex); sin retención cero sin acuerdo |
| País del titular: Guatemala | **PERMITIDO** para el uso; facturación [no verificado] | Guatemala está en la lista de la API; falta confirmar la cuenta de facturación |
| Atribución o marca de agua obligatoria | **PERMITIDO** | SynthID invisible; sin atribución visible exigida para imágenes; no quitar la marca |

## Condiciones si Juan decide seguir con Google (después de la respuesta escrita)

1. No abrir cuenta ni crear claves hasta recibir de Google una respuesta escrita que diga que Pintoria no cae en la cláusula de menores de 18 (texto propuesto abajo).
2. Solo servicios de pago con Cloud Billing activo. Nunca AI Studio personal ni cuota gratuita con fotos.
3. Si se usa Vertex: región de EE. UU. fijada en el proyecto (no `global`), anotada en `docs/legal/subencargados.md`.
4. Casilla de consentimiento del checkout: el adulto declara tener el consentimiento de cada persona identificable (propio o como padre o tutor). `legal-compliance` revisa el texto en el PR.
5. Safety settings por defecto, sin bajar umbrales. Proceso de bloqueo igual al de `openai.md` (no reintentar la misma foto, borrarla, mensaje neutro, reembolso).
6. No quitar ni alterar SynthID; ningún texto afirma que el libro lo hizo una persona.
7. La política de privacidad dice que el proveedor de imágenes puede conservar copias hasta 55 o 90 días según la vía, no solo nuestras 24 horas.
8. Firmar el Cloud Data Processing Addendum (Vertex) o confirmar el Data Processing Addendum de Gemini API de pago antes de enviar una foto real.

## Plan B

OpenAI `gpt-image-2.5` (ver `openai.md`) y Recraft (ver `recraft.md`). Google queda como tercera opción solo con respuesta escrita favorable.

## Consulta propuesta a Google (inglés; la envía Juan, no se envía sin su orden)

> We operate a paid web service where an adult parent uploads up to 3 photos of each of up to 5 family members, including children aged 3 to 8, with a signed consent. We send the photos through the Gemini API (paid tier) to produce line-art coloring-book characters, which we deliver as a PDF to the parent. Children never access the site or the API. Does this use fall under the restriction on services "directed towards or is likely to be accessed by individuals under the age of 18" in the Gemini API Additional Terms or Section 20(d) of the Service Specific Terms? Is uploading photos of minors, with the parent's consent, permitted? Can we obtain zero data retention for these requests? Our company is established in Guatemala; can it open a Cloud Billing account?

## No verificado

- Si una cuenta de Cloud Billing se abre desde Guatemala y con qué medio de pago.
- Fecha del Service Specific Terms y del texto vigente de la Acceptable Use Policy.
- Si el filtro "Child" de Vertex bloquea una foto de un niño que sube su padre, y si la lista de permitidos se concede a una cuenta pequeña.
- Cómo trata la Gemini API la foto de un menor en el nivel de pago (la guía de imágenes no lo dice).
- Si los modelos "Nano Banana" de la Gemini API tienen términos de modelo adicionales.
