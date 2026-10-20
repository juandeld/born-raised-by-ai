# Resend: correos transaccionales (recibo, entrega, recordatorio)

Veredicto D27: **PERMITIDO con condiciones** para Pintoria y Jinglo, siempre que solo se envíe correo transaccional al comprador adulto.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Acceptable Use Policy | https://resend.com/legal/acceptable-use | "Last update: October 13th, 2026" |
| Terms of Service | https://resend.com/legal/terms-of-service | "Last update: August 27th, 2026" |
| Pricing | https://resend.com/pricing | sin fecha visible; incluye "a free-forever plan" |
| DPA y subencargados (referencia de `docs/legal/subencargados.md`) | https://resend.com/legal/dpa | no releída hoy |

## Citas textuales

**IA, fotos de menores, deepfakes**
- Sin cláusula. Resend no hospeda las fotos: solo transmite el mensaje.

**Menores como usuarios del servicio**
- Terms 12: "Service is intended only for access and use by individuals at least eighteen (18) years old." La cuenta es de Juan (adulto). Los destinatarios son los padres compradores, nunca los niños.

**Contenido, consentimiento y datos**
- Terms 9: el cliente garantiza que "You have obtained all necessary consents and permissions from recipients to send them messages in accordance with applicable laws and regulations, including but not limited to CAN-SPAM, GDPR".
- Terms 9: "This license does not include the right for us to disclose your Message Content or Your Data to third parties without your approval, except as necessary to provide the Service or as required by law."
- Resend puede "review, block, or refuse to deliver messages that violate these Terms".

**Uso aceptable**
- AUP: "Your complaint rate must be lower than 0.08%." y "Your bounce rate must be lower than 4%." Si se superan, la cuenta "may be shut down without warning".
- AUP: "All mail must be sent to recipients who have explicitly opted in to receive communications from you."
- AUP: se prohíbe usar Resend con actividades "exploitative, deceptive, unethical, or otherwise high risk to Resend or the broader internet community" a criterio de Resend.
- AUP: para envíos masivos hace falta "a frictionless way to opt-out (unsubscribe) and honor their wish within 7 days".

**Llamadas automatizadas y telemarketing**
- No aplica (solo correo).

**País del vendedor**
- Sin restricción por país en lo leído. Entidad contratante: Plus Five Five, Inc.

**Costo**
- Plan gratuito permanente; planes de pago desde la página de precios. Dominio adicional "$20 / mo" según la tabla [cantidad de dominios incluidos en Free: no verificado].

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PERMITIDO con condiciones** | Recibo y enlace de descarga a quien compró: base de consentimiento clara. |
| Jinglo | **PERMITIDO con condiciones** | Recibo, confirmación de la llamada y recordatorio al padre. Puede incluir el nombre de pila del niño en el cuerpo (dato mínimo, ver condición 3). |

## Condiciones

1. Solo correo transaccional al comprador. Cualquier correo promocional (por ejemplo, venta cruzada para Navidad) exige casilla de aceptación aparte, no marcada de antemano, y enlace de baja visible, antes de enviar el primero.
2. Vigilar tasas: queja menor al 0,08 % y rebote menor al 4 %. `metricas` revisa ambas cada semana; si una pasa de la mitad del límite, se pausa el envío y se corrige la lista. Una suspensión sin aviso detendría las entregas automáticas.
3. Nada de fotos de los niños adjuntas ni incrustadas; solo enlace firmado y con caducidad. El nombre de pila del niño puede aparecer en el cuerpo del correo de Jinglo si el padre lo escribió; no se incluyen edad, fecha ni datos de salud. Ningún correo nombra proveedores de IA (D23).
4. Los correos de reembolso, cancelación y respuesta a contracargos usan la misma cuenta y deben cumplir la política de reembolso a 7 días.
5. Si el dominio de envío cambia (por ejemplo, un dominio por producto), verificar SPF, DKIM y DMARC antes del primer envío real y probar con el buzón de pruebas, no con clientes.
6. Antes de lanzar: confirmar el DPA vigente y la lista de subencargados, y anotar la región de envío en `docs/legal/subencargados.md` (hoy [no verificado]).

## Qué hacer

- `arquitecto`: confirmar que los correos de ambos productos pasan por una sola función y que ninguna plantilla incluye campos de más.
- Releer la AUP en 30 días (cambió el 13-oct-2026, seis días antes de esta lectura).

## No verificado

- Cuántos dominios incluye el plan gratuito y si el volumen de la temporada alta cabe sin pasar a Pro.
- Región de envío y almacenamiento de registros.
