# ImprovMX: reenvío de correo entrante (soporte, privacidad, borrado)

Veredicto D27: **PERMITIDO con condiciones** para Pintoria y Jinglo. Es solo reenvío de buzones; no toca fotos ni voz, pero por él pasan solicitudes de padres (datos de niños) al correo de privacidad.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Terms of Service | https://improvmx.com/terms-of-service/ | "Last Updated: February 16th, 2025" (más de 20 meses) |
| Privacy Policy | https://improvmx.com/privacy-policy/ | sin fecha visible en el texto extraído [no verificado] |
| Pricing | https://improvmx.com/pricing/ | sin fecha visible |

Las rutas `/terms/` y `/aup/` devuelven la página principal; la política de uso aceptable está dentro de la sección 1 de los Terms.

## Citas textuales

**Uso aceptable (aplica a nuestro caso)**
- Terms 1: se prohíbe "Sending spam, unsolicited or unauthorized communications" y usar ImprovMX "as a list of diffusion or email group list".
- Terms 1: se prohíbe "Use ImprovMX as a destination to handle email campaign bounce reports" (los rebotes de Resend no deben apuntar a un alias de ImprovMX).
- Terms 1: "ImprovMX also reserves the right to refuse service or access to the Website to any person or business entity at any time and without notice."

**IA, fotos de menores, deepfakes, llamadas automatizadas**
- Sin cláusula.

**Menores**
- Terms 2: el servicio es para mayores de 18. Privacy: "We do not knowingly collect any information from anyone under 13 years of age, and our Services are marketed to and are only accessible by individuals 18 years of age or older." El titular de la cuenta es adulto. Lo que preocupa es el contenido que los padres envían.

**Datos, retención y transferencias**
- Privacy: conserva datos de comunicaciones "for so long as you maintain a user account" y por más tiempo si la ley lo exige. El texto leído no dice si guarda el contenido de los correos reenviados; el plan gratuito incluye "7-day Email log retention".
- Privacy: dice adherir a los principios del Marco UE-EE. UU. pero admite que "is not certified under the DPF". Un DPA con cláusulas contractuales tipo: [no verificado].

**País del vendedor**
- Entidad: ImprovMX Incorporated (Delaware). Sin restricción por país en lo leído.

**Plan y límites**
- Gratis: "1 domain", "25 aliases", "500 emails forwarded per day", "7-day Email log retention". Premium ($9/mes) añade 12.000 envíos SMTP por mes.

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PERMITIDO con condiciones** | Reenvío de correos de clientes. Sin contenido prohibido. |
| Jinglo | **PERMITIDO con condiciones** | Igual. Por el alias de privacidad pueden llegar solicitudes de borrado con el nombre de un niño. |

## Condiciones

1. Solo reenvío entrante. Las respuestas de soporte salen por Resend con la dirección de `soporte@`, no por ImprovMX (SMTP no incluido en el plan gratuito).
2. Un destino por alias. `docs/legal/textos/00-leeme.md` dice que el alias de privacidad reenvía a Juan y lo lee el agente de soporte; si eso son dos destinos, mantener dos como máximo y no encadenar alias, para no parecer "email group list".
3. Los rebotes y quejas de Resend no se envían a un alias de ImprovMX.
4. La política de privacidad y la lista de subencargados deben incluir a ImprovMX como destino de los correos de soporte y privacidad (hoy no figura en `docs/legal/subencargados.md`). `legal-compliance` lo agrega antes de publicar.
5. Pedir a los clientes, en el pie de los correos y en la página de ayuda, que no envíen fotos ni datos del niño por correo: se atienden solo con el número de pedido y el enlace del panel.
6. Si Juan quiere un DPA firmado con cláusulas tipo, pedirlo a ImprovMX antes de la temporada; sin él, las solicitudes de europeos con datos de menores pasan por un subencargado sin contrato verificado.
7. Alternativa si el riesgo preocupa: buzón propio con proveedor que ofrezca DPA (plan B), pero implica costo fijo.

## Qué hacer

- `arquitecto` y `soporte-postventa`: confirmar cuántos destinos tiene cada alias y que no hay reglas de reenvío a listas.
- `legal-compliance`: añadir ImprovMX a `docs/legal/subencargados.md`.

## No verificado

- Si ImprovMX guarda el cuerpo de los correos reenviados y por cuánto tiempo.
- DPA y cláusulas contractuales tipo.
- Fecha de la política de privacidad.
