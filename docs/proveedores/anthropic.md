# Anthropic (Claude): historia de Pintoria (API directa, solo roles)

Veredicto D27: **PERMITIDO con condiciones** para Pintoria. Jinglo: no aplica hoy (el modelo del agente de voz corre dentro de ElevenLabs y es Gemini por defecto); pasaría a **RIESGO ALTO** si se elige un modelo Claude para el agente.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

Uso real (código): `story.ts` envía a la API solo roles, edad y tema ("niña, 6 años", "perro"), sin nombres, sin fotos y sin datos del padre.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Usage Policy (AUP), **vigente hoy** | https://www.anthropic.com/legal/archive/22742366-2ef0-4c7a-a833-6523f10d3944 | "Effective September 15, 2025" |
| Usage Policy (AUP), **nueva versión** | https://www.anthropic.com/legal/aup | "Effective November 12, 2026" (aún no en vigor) |
| Supported Regions Policy | https://www.anthropic.com/legal/supported-regions | "Effective November 12, 2026"; Guatemala figura en la lista |
| Commercial Terms | https://www.anthropic.com/legal/commercial-terms | fecha no visible en el texto [no verificado] |
| Guidelines for Organizations Serving Minors | https://support.claude.com/en/articles/9307344 | sin fecha visible |
| Child safety guidance for developers | https://support.claude.com/en/articles/15591275 | sin fecha visible |

Cambio próximo: la nueva AUP y la política de regiones entran en vigor el **12-nov-2026**. Releer ese día.

## Citas textuales

**IA, contenido sobre personas reales, privacidad**
- AUP vigente: se prohíbe "Violate privacy rights as defined by applicable privacy laws, such as sharing personal information without consent" y recolectar "biometric or neural data (including facial recognition)". Pintoria no envía fotos ni biometría a Anthropic.
- AUP vigente: se prohíbe "Impersonate a human by presenting results as human-generated". La historia de Pintoria no puede presentarse como escrita por una persona (coincide con la revelación genérica de IA de D23 y el art. 50 de la ley europea de IA).

**Menores**
- AUP: "We define a minor or child to be any individual under the age of 18 years old, regardless of jurisdiction." Prohibidos CSAM (también el generado con IA) y sexualizar a menores "including in fictional settings".
- "Products serving minors" aplica a quien deja que menores interactúen directamente con la API. En Pintoria el niño solo lee el PDF; no interactúa con el modelo. No aplica, pero sirve de estándar.
- Guía para organizaciones con menores: deben "disclose to their users that they are interacting with an AI system" y cumplir COPPA.

**Chatbots de cara al consumidor (relevante si Claude fuera el modelo de Jinglo)**
- AUP vigente: "All consumer-facing chatbots, including any external-facing or interactive AI agent, must disclose to users that they are interacting with AI rather than a human. This disclosure must be provided at a minimum at the beginning of each chat session."
- Nueva AUP: "The disclosure does not need to identify Anthropic, Claude, or the model used." Choca con D13 (Santa no dice a un niño que es IA) si el destinatario de la llamada se considera "usuario".

**Alto riesgo (productos futuros)**
- AUP vigente y nueva: asesoría legal individual, y decisiones de estatus migratorio o ciudadanía, requieren profesional calificado y aviso de IA. Afecta a `ciudadania` y `seguros-tx`; no a esta revisión.

**Datos**
- Commercial Terms: "Anthropic may not train models on Customer Content from Services." Retención de entradas y salidas hasta 30 días (según `docs/legal/subencargados.md`).

**Llamadas automatizadas / telemarketing**
- AUP: la restricción es sobre llamadas masivas a votantes que "conceal their artificial origin". No aplica.

**País del vendedor**
- Commercial Terms: se deben respetar las "Supported Regions". Guatemala figura en la lista publicada (versión del 12-nov-2026). Que figure en la versión vigente hasta entonces [no verificado].

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PERMITIDO con condiciones** | Texto de cuentos sin datos personales. Sin entrenamiento con el contenido. |
| Jinglo | No aplica; **RIESGO ALTO** si `ELEVENLABS_LLM` pasa a un modelo Claude | Se activaría la obligación de revelar IA a quien contesta, que choca con D13. Con Gemini aplican las reglas de Google (ver `elevenlabs.md`). |

## Condiciones

1. El prompt de la historia sigue sin nombres, apellidos, ciudad, colegio, fotos ni descripciones físicas identificables. `qa-redteam` prueba con un pedido que tenga nombre propio en el campo libre: no debe llegar al modelo.
2. Contenido de la historia: apto para niños, sin violencia gráfica ni temas de la política de menores; filtro de salida antes de maquetar.
3. Nada en los PDF, correos o web afirma que la historia la escribió una persona (D23 y art. 50).
4. No cambiar el modelo del agente de voz de Jinglo a Claude sin pasar de nuevo por esta puerta.
5. Releer las políticas el 12-nov-2026 y confirmar que la cuenta es de Guatemala dentro de las regiones soportadas vigentes.

## Qué hacer

- `arquitecto`: confirmar el contenido exacto que `story.ts` envía (campo libre incluido).
- Sin cambios para el cliente.

## No verificado

- Fecha de las Commercial Terms.
- Si Guatemala estaba en la lista de regiones vigente antes del 12-nov-2026.
- Cómo interpreta Anthropic "users" para una llamada en la que habla un niño.
