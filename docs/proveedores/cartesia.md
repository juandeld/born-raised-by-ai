# Cartesia (TTS): plan C para la voz de Santa

Veredicto D27 (12-nov-2026): **RIESGO ALTO / revisión incompleta. No se da de alta con datos reales.** La ZDR solo existe en enterprise (verificado), así que en autoservicio queda en la misma situación que Fish sin enterprise. Los demás puntos no se pudieron verificar en esta sesión: las lecturas de los términos y de los precios requirieron aprobación que no se dio. Esos puntos quedan en "no verificado" y no pueden contar como permitidos (D27).
Lectura: 12-nov-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos, obtenidos por lectura automatizada de la página; verificar el literal al abrir el enlace.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Zero Data Retention | https://docs.cartesia.ai/enterprise/zero-data-retention | sin fecha; leída 12-nov-2026 |
| Terms of Service | https://cartesia.ai/legal/terms | NO LEÍDO |
| Política de uso aceptable | no localizada | NO LEÍDA |
| Privacy Policy | no localizada | NO LEÍDA |
| Precios | https://cartesia.ai/pricing | NO LEÍDO |

## Citas textuales (solo lo verificado)

**ZDR**
- Disponibilidad: "You must be on an enterprise plan to enable ZDR." La premisa de que se activa desde la configuración de la organización es cierta, pero solo con plan enterprise.
- Activación: la activa el administrador de la organización en el Playground de Cartesia; después aplica a las solicitudes elegibles sin configuración por solicitud.
- Alcance: "ZDR applies to TTS and STT inference only." No se guardan textos ni audios de entrada y salida; sí se conservan metadatos operativos (ids de solicitud, totales de uso).
- Exclusión: "ZDR is not available for voice cloning, PVC, voice creation". Si Santa se crea o clona en Cartesia, ese paso queda fuera de la ZDR. Usar solo voces de catálogo o crear la voz con datos no personales.

## Veredicto por punto (Jinglo)

| Punto | Veredicto | Razón |
|---|---|---|
| ZDR en autoservicio | **NO DISPONIBLE** | Solo enterprise |
| ZDR con enterprise | **PERMITIDO con condiciones** (en TTS; no cubre creación de voces) | Cubre inferencia TTS |
| Uso de contenido para entrenamiento sin ZDR | **NO VERIFICADO, tratar como RIESGO ALTO** | Términos no leídos |
| Productos dirigidos a menores / edad mínima / COPPA | **NO VERIFICADO, RIESGO ALTO** | Términos y AUP no leídos |
| Uso comercial de la salida | **NO VERIFICADO** | Términos y precios no leídos |
| Voces de catálogo con licencia comercial / voces diseñadas | **NO VERIFICADO** | Pendiente |
| Español latino (es-MX) | **NO VERIFICADO** | Requiere prueba auditiva por `video-voz-santa` |
| País del vendedor (Guatemala) | **NO VERIFICADO** | Términos y facturación no leídos |
| Precio por carácter | **NO VERIFICADO** | Precios no leídos; no inventar cifra |

## Pendientes para cerrar la revisión (en este orden)
1. Leer https://cartesia.ai/legal/terms (menores, edad mínima, entrenamiento, uso comercial, ley aplicable) y localizar AUP y privacidad.
2. Leer https://cartesia.ai/pricing y la documentación de voces (catálogo, licencia, voces es-MX).
3. Solicitud escrita a Cartesia (ventas): producto dirigido a menores de 13 donde el padre compra y solo llega al TTS el nombre de pila; ZDR enterprise a pago por uso; DPA; vendedor en Guatemala.
4. Mientras tanto, pruebas con nombres ficticios: permitidas con datos no personales, sin clonar voces de personas reales.
5. Si algún punto sale ambiguo o prohibido, escalar a Juan con plan B antes de cualquier alta (D27).
