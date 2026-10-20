# Polar (comerciante de registro): constancia del rechazo del 19-oct-2026

Veredicto D27: **PROHIBIDO** para Jinglo y para Pintoria. Pintoria ya fue rechazada. Jinglo no debe presentarse: su política lo prohíbe por menores y telecomunicaciones, no solo lo pone en revisión.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

Este archivo existe por D27: nadie leyó la política de Polar antes de abrir la cuenta. Es la constancia que la regla exige, con la cita que habría evitado el rechazo.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Acceptable Use Policy (Merchant of Record) | https://polar.sh/docs/merchant-of-record/acceptable-use | "Effective Date — October 1, 2026" |
| Revisión de cuentas | https://polar.sh/docs/merchant-of-record/account-reviews | leída por `pagos-finanzas` el 19-oct-2026 (`docs/investigacion/pagos-tras-polar.md`); no la releí [segunda mano] |
| Rechazo recibido | Correo de Polar del 19-oct-2026 | La cita sale de D27 (`docs/decisiones.md`); el correo original no está en el repo [no verificado] |

## Registro del rechazo

- Organización: "Lumen Labs". Fecha: 19-oct-2026.
- Motivo citado en D27: "AI-generated image or illustration content". Apelación automática denegada. Revisión humana pedida el mismo día. Según `pagos-tras-polar.md`, el mensaje decía que el contenido no estaba soportado por sus políticas, y no existe página pública de apelación [no verificado].
- D27 también decidió dejar de usar Polar como pasarela principal y pidió a Juan borrar todo lo de Polar, incluida la cuenta. Nota: borrar la cuenta cierra la revisión humana pendiente; la decisión es de Juan y ya la tomó.

## Citas textuales de la política

**Categorías restringidas ("may not be accepted"): el origen del rechazo**
- Encabezado: "The following categories require a closer review and may not be accepted."
- Lista: "AI Content Generation tools (text, image, video, voice);", "eBooks;" y "Audio / music / chatbot generators (no voice cloning, NSFW, IP infringements or fake claims)."
- Pintoria cae en "AI Content Generation tools (text, image, video, voice)" y en "eBooks". Jinglo cae en la categoría de voz y en "Audio / music / chatbot generators".
- La política no dice "prohibido": dice "revisión" y "puede no aceptarse". Por D27 esto es riesgo alto desde el primer día, y debió avisarse a Juan antes de abrir la cuenta.

**Categorías prohibidas que `pagos-tras-polar.md` no recogió y que cierran la puerta a Jinglo**
- "Services used by, intended for, or advertised towards minors;" Jinglo es una llamada a un niño; Pintoria entrega un libro para colorear a niños, lo que un revisor puede interpretar igual.
- "Telecommunication and eSIM Services;" una llamada telefónica entregada por teléfono puede entrar aquí.
- "Regulated services or products;", "Human services;" y "Advertising and unsolicited marketing services, including, but not limited to, lead generation, bulk SMS and automated outreach;" como zonas grises para Jinglo.
- "Content generation that infringes on trademarks or copyrights, enables face swaps or deep fakes, or produces adult content;" Pintoria convierte fotos de personas reales en ilustraciones; un revisor podría verlo cerca de "face swaps".

**Telemarketing**
- Producto prohibido si "is marketed through the use of outbound telemarketing;" Se refiere a cómo se vende. Jinglo no se vende por llamadas en frío, por lo que esa cláusula sola no lo excluye.

**Discrecionalidad**
- "Polar reserves the right to refuse Services to sell any Product in its sole discretion."

**Consecuencia para productos futuros del portafolio (informativo)**
- Prohibidos: "Government Services;" "Medical and Health advice;" y "Standardized test prep platforms reselling real or past exam questions". Restringido: "Resume, hiring, or exam tools;". Afectan a `ciudadania` y `seguros-tx`.

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PROHIBIDO** (ya rechazada) | Dos categorías de revisión (IA de imagen y eBooks) más la de menores. Rechazo confirmado. |
| Jinglo | **PROHIBIDO** | Menores y telecomunicaciones están en la lista de prohibidos, no solo en revisión. No tiene sentido apelar. |

## Qué hacer

1. No reintentar con Polar para ninguno de los dos productos, ni con una organización nueva solo de Jinglo (propuesta de `pagos-tras-polar.md`, punto 4 de la sección 0): su lista de prohibidos la excluye. Abrir otra organización del mismo titular para evitar el rechazo se leería como elusión, y la política cita "ownership and funding" entre los factores de revisión.
2. `pagos-finanzas`: corregir `docs/investigacion/pagos-tras-polar.md` (que afirma que la restricción para Jinglo es solo de revisión) y `CLAUDE.md` principio 4 cuando Juan elija la pasarela.
3. `arquitecto`: el adaptador de Polar puede quedar en el código como inactivo o retirarse, según D27 (borrar lo de Polar); no hace falta para ningún cobro.
4. Juan: cerrar la cuenta de Polar cuando decida (acción suya).
5. Documentar el criterio: para toda pasarela nueva, esta puerta exige buscar primero "AI Content Generation", "minors", "telecommunication" y "exam"/"test prep" antes de proponer el alta.

## No verificado

- Texto literal del correo de rechazo.
- Si Polar acepta apelación manual y en qué plazo.
- Versiones anteriores de la política (la de hoy es del 1-oct-2026).
