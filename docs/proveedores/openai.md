# OpenAI: edición de fotos de la familia a ilustraciones (gpt-image, API de imágenes)

Veredicto D27: **PERMITIDO con condiciones** para Pintoria (condiciones obligatorias abajo). Jinglo: no aplica, no envía voz ni fotos a OpenAI.
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
8. `arquitecto`: la guía de imágenes vigente no nombra `gpt-image-1-mini` [no verificado si sigue disponible]; confirmar modelo y su política antes del lanzamiento.

## No verificado

- Si OpenAI trata una ilustración de línea como "reproducir la semejanza" de la persona (se asume que sí, por eso se exige consentimiento).
- Obligación de reportar a NCMEC para un operador radicado en Guatemala que sirve a EE. UU.
- Fecha de la guía de datos y de la guía de imágenes.
