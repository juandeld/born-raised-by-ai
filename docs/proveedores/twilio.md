# Twilio: telefonía de las llamadas de Jinglo (Programmable Voice)

Veredicto D27: Jinglo **PERMITIDO con condiciones** en EE. UU., Reino Unido y México; **RIESGO ALTO en España** (regla de numeración desde el 17-oct-2026 y requisitos de identidad españoles que un vendedor individual en Guatemala no puede cumplir). Pintoria: no aplica, no usa Twilio.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

Aviso: la aprobación de Twilio no sustituye la de ElevenLabs. Mientras `elevenlabs.md` diga PROHIBIDO, Jinglo no llama a ningún niño real aunque Twilio lo permita.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Terms of Service | https://www.twilio.com/en-us/legal/tos | "Last Updated: July 16, 2026" |
| Acceptable Use Policy | https://www.twilio.com/en-us/legal/aup | "Last Updated: May 12, 2025" |
| Twilio Voice Services Policy | https://www.twilio.com/en-us/legal/service-country-specific-terms/voice-sip | "Last Updated: February 27, 2024" |
| Service and Country Specific Requirements | https://www.twilio.com/en-us/legal/service-country-specific-terms | "Last Updated: April 9, 2026" |
| Illegal Robocalling Obligations (EE. UU.) | https://www.twilio.com/en-us/legal/service-country-specific-terms/namer-robocalling | "Last Updated: September 28, 2021" |
| Guías regulatorias de números: España, Reino Unido, México | https://www.twilio.com/en-us/guidelines/es/regulatory (y `/gb/`, `/mx/`) | sin fecha visible; la de España trae la regla del 17-oct-2026 |

No pude leer el texto de las secciones plegables "Voice Calls to North America Phone Numbers" ni "Spain Geographic Phone Number-Based Interpersonal Communications Services", ni la guía regulatoria de EE. UU. (devuelve 404), ni los AI/ML Terms (404). Van como [no verificado].

## Citas textuales

**Consentimiento, grabación y llamadas**
- AUP: se prohíbe violar leyes que exijan "consent be obtained prior to transmitting, recording, collecting, or monitoring data or communications" o el cumplimiento de "opt-out requests". Cubre TCPA, las leyes de grabación de los estados y la LGT/PECR equivalentes.
- Terms 5.3: el cliente garantiza haber obtenido "the necessary permissions and consents required to enable Twilio to process all Customer Data". La grabación con la voz del niño es Customer Data.
- Voice Policy: para llamadas de telemarketing o publicidad exige consentimiento previo, identificar a quien llama al inicio, mecanismo de baja y no llamar a números en listas de exclusión. Jinglo no es telemarketing (el padre compra y programa la llamada), pero conviene cumplirlo igual: el preludio al adulto identifica quién llama y ofrece la tecla 2 de baja permanente.

**Identidad del llamante**
- AUP: se prohíbe "Creating a false identity or any attempt to mislead others as to the identity of the sender or the origin of any data or communications".
- Voice Policy: se prohíbe "transmit misleading or inaccurate caller ID information". No se falsifica el número de salida; el personaje (Santa) es folclore y el preludio identifica el origen al adulto.

**Volumen y duración (riesgo operativo en diciembre)**
- Voice Policy: "You must not have, in a given month, (a) a high volume of unanswered outbound voice call attempts from a single originating phone number or (b) a low average outbound voice call duration." Los operadores "may independently block" el número. Jinglo: dos intentos, sin mensaje a buzón, y cierre inmediato si el adulto pulsa 2. Con un solo número de salida en el pico del 20 al 24 de diciembre, es un riesgo real de bloqueo.
- También prohíbe llamadas "that generate an unacceptable number of complaints".

**IA, menores, deepfakes**
- Sin cláusula sobre menores ni sobre voces sintéticas en los textos leídos (ninguno menciona niños ni COPPA). La responsabilidad recae en el cliente y en ElevenLabs. Twilio solo transporta el audio; no se usan funciones de IA de Twilio.

**Numeración por país (el punto que bloquea España)**
- España: "Starting October 17, 2026, it will be prohibited to use any other type of number for commercial or telecommunications outbound calls in Spain." El único tipo permitido es el prefijo +34400 ("Commercial and Telemarketing Calls"), clasificado como número nacional. Los números nacionales exigen identidad española (DNI/NIF/NIE o CIF) y una dirección que "Must be within Spain". Un vendedor individual en Guatemala no puede obtenerlos.
- Reino Unido: números móviles y gratuitos admiten dirección "anywhere in the world" con pasaporte; los locales y nacionales exigen dirección británica.
- México: los números locales exigen dirección local y documento con dirección en México; los móviles "may only be used for two-way person-to-person (P2P) communication" y se bloquean si son automáticos; los gratuitos (+52800) admiten dirección en cualquier país del mundo con pasaporte y comprobante.
- EE. UU.: Voice Policy y Robocalling Obligations sin requisito especial para nuestro caso (Lumen Labs no parece ser proveedor de servicio de voz ante la FCC; confirmar). Reglas de la FCC sobre voces generadas con IA y consentimiento escrito: ver `docs/legal/` (no es política de Twilio).

**País del vendedor y cuenta**
- Los Terms no restringen por país de residencia en lo leído; la verificación de cuenta y de medio de pago desde Guatemala [no verificado]. `docs/legal/subencargados.md` ya anota que Twilio es subencargado con DPF y cláusulas tipo.

## Veredicto por producto y país

| Producto y país | Veredicto | Razón |
|---|---|---|
| Jinglo, EE. UU. | **PERMITIDO con condiciones** | Consentimiento por escrito en el checkout y preludio; sin requisito de identidad local para números de salida (la guía regulatoria devolvió 404 [no verificado]). |
| Jinglo, Reino Unido | **PERMITIDO con condiciones** | Número móvil o gratuito con pasaporte y dirección de Guatemala. |
| Jinglo, México | **PERMITIDO con condiciones** | Número gratuito (+52800) desde Guatemala; no usar móviles ni locales. Un +52800 como identificador de salida puede bajar la tasa de respuesta [no verificado]. |
| Jinglo, España | **RIESGO ALTO** | Si Twilio considera "comercial" la llamada, exige +34400 con identidad española. La llamada la pide y paga el padre, lo que sugiere que no es comunicación comercial no solicitada, pero no hay texto de Twilio ni de la CNMC que lo diga. |
| Pintoria | No aplica | Sin telefonía. |

## Condiciones

1. Mantener cerrado Jinglo en España (checkout y anuncios) hasta tener respuesta escrita de Twilio. Pregunta para soporte: "¿Una llamada saliente solicitada y pagada por el destinatario o su tutor, de contenido no promocional, se considera comercial a efectos del prefijo +34400? ¿Qué número de salida se permite para un titular individual en Guatemala?" Guardar la respuesta en `docs/proveedores/evidencia/`.
2. Reino Unido y México: configurar `TWILIO_FROM_GB` con un número móvil o gratuito y `TWILIO_FROM_MX` con un +52800; no comprar locales (exigen domicilio local) ni móviles en México. `TWILIO_FROM_ES` queda vacío, pero el código cae entonces en `TWILIO_FROM_NUMBER` (o en un número de relleno), así que la venta a España debe bloquearse en el selector de país y no basta con dejar la variable vacía.
3. Más de un número de salida por país en la temporada, con rotación, y vigilancia diaria de la tasa de llamadas no contestadas y de la duración media (`metricas`). Umbral de alerta sugerido: pausar y avisar a `arquitecto` si más del 40 % de los intentos de un número queda sin contestar [umbral propuesto, sin respaldo en la política de Twilio].
4. Sin falsificar el número: el identificador de salida es un número real de la cuenta.
5. Grabación: solo tras la tecla 1 del adulto (D14); el audio previo no se graba. Las leyes de grabación de 12 estados de EE. UU. exigen el consentimiento de todas las partes: el preludio y el checkout lo cubren; `qa-redteam` lo prueba.
6. Borrado de grabaciones a los 30 días también en Twilio (regla A-10 de `subencargados.md`, [no verificado en cuenta real]).
7. Dar de alta el perfil de Trust Hub / SHAKEN/STIR si Twilio lo ofrece para titulares individuales, para mejorar la atribución de llamadas a EE. UU. [no verificado].

## Qué hacer

- `arquitecto`: bloquear España en el selector de países de Jinglo y registrar el motivo; revisar `TWILIO_FROM_*`.
- Juan: no comprar números hasta que `legal-compliance` indique el tipo por país.
- Releer la guía regulatoria de España en 30 días: la regla es de hace dos días.

## No verificado

- Texto de "Voice Calls to North America Phone Numbers", de la sección de España y de la guía regulatoria de EE. UU.
- Interpretación de "comercial" por Twilio y la CNMC.
- Verificación de cuenta y de medio de pago de Twilio para titular individual en Guatemala.
- AI/ML Terms de Twilio (no se usan esas funciones).
