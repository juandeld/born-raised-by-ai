# Supabase: base de datos, almacenamiento de fotos y PDF, autenticación

Veredicto D27: **PERMITIDO con condiciones** para Pintoria y Jinglo.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Acceptable Use Policy | https://supabase.com/aup | "Version 1 — June 1, 2026" |
| Terms of Service | https://supabase.com/terms | la fecha de versión no aparece en el texto extraído [no verificado] |
| Pricing | https://supabase.com/pricing | sin fecha visible |
| DPA (referencia de `docs/legal/subencargados.md`) | https://supabase.com/legal/customer-resources/data-processing-addendum | "Supabase DPA 260601" |

## Citas textuales

**IA y contenido sintético**
- AUP 2.1: se prohíbe "Generating or storing synthetic media intended to deceive or harass, including but not limited to non-consensual sexual imagery." Las ilustraciones de Pintoria no pretenden engañar ni acosar; el riesgo existe solo si alguien carga fotos sin consentimiento (ver condición 1).
- No hay prohibición de almacenar contenido generado con IA.

**Datos de terceros y menores**
- AUP 1.6: no se puede "publish, disclose, distribute, store, or facilitate the dissemination of another person's personal, confidential, or identifying information without an appropriate legal basis, authorization, or legitimate purpose."
- No hay cláusula específica sobre menores salvo CSAM (AUP 1.2) ni sobre fotos de personas reales.

**Uso de nuestros datos**
- Terms 8(b): el cliente conserva la propiedad de "Customer Data". Si Supabase usa IA en sus funciones, "will not use, nor allow any third-party to use, Customer Data, Customer's AI Input, or any AI Output to train, fine-tune, or otherwise improve any artificial intelligence or machine learning model, without Customer's prior written consent."
- Datos agregados: Supabase conserva licencia perpetua sobre datos "in an aggregate and anonymized manner". No incluye fotos ni identificadores.
- Terms 7: el cliente no puede "store any payment cardholder information using the Services without Supabase's prior written approval". No guardamos tarjetas (cobra el procesador).
- Terms 7 sobre protección de datos: el cliente es responsable de "maintain appropriate security, protection, and backup of Customer Data". El DPA queda incorporado a los Terms.

**Llamadas automatizadas y telemarketing**
- AUP 4.3: prohíbe "unsolicited mass messages". No hay cláusula sobre llamadas. Las llamadas las envía Twilio, no Supabase.

**País del vendedor**
- Sin restricción por país en lo leído. Términos regidos por California.

**Costo y plan**
- Plan Free: "Free projects are paused after 1 week of inactivity. Limit of 2 active projects." Sin copias de seguridad diarias.
- Plan Pro: "From $25 / month" con "Daily backups stored for 7 days".

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PERMITIDO con condiciones** | Almacena fotos de menores y libros: lícito con base legal (consentimiento parental). Sin entrenamiento con nuestros datos. |
| Jinglo | **PERMITIDO con condiciones** | Almacena consentimientos, número del padre, nombre de pila y grabaciones. Mismas condiciones. |

## Condiciones

1. La base legal de AUP 1.6 es el consentimiento registrado en el checkout (texto, hora e IP). Sin ese registro, no se sube la foto. `qa-redteam` prueba que el flujo no almacena una foto sin consentimiento previo.
2. Cuenta de producción en **Pro** ($25/mes), no Free: un proyecto Free se pausa tras una semana sin actividad, lo que dejaría una entrega o un reembolso automático sin base de datos en plena temporada baja. Sumar el costo a los fijos (`pagos-finanzas`).
3. Región del proyecto: fijarla por escrito y anotarla en `docs/legal/subencargados.md` (hoy figura [no verificado]). Elegir la que sirva mejor a clientes de UK y España; si es EE. UU., la política de privacidad debe decirlo.
4. Copias de seguridad: Pro conserva copias diarias 7 días. Confirmar si las copias de la base incluyen los objetos del almacenamiento (fotos) o solo metadatos [no verificado]. La política de privacidad debe decir que existen copias de seguridad hasta 7 días después del borrado y que se eliminan solas.
5. Bucket `uploads` privado con URL firmadas y borrado automático (cron de retención: fotos 7 días, pedidos 30 días; `scripts/retention.ts` pendiente de probar contra la base real, según `subencargados.md`).
6. Ningún dato de tarjeta en Supabase (Terms 7). Solo ids de pedido del procesador.
7. Si algún día se activa un asistente de IA de Supabase en el panel, no pegarle fotos ni datos de clientes.

## Qué hacer

- `arquitecto`: crear el proyecto de producción en Pro, anotar la región, confirmar el comportamiento de los backups con la documentación de Supabase.
- Revisar la AUP y los Terms cada 30 días (la AUP es de 1-jun-2026).

## No verificado

- Fecha de versión de los Terms.
- Región actual del proyecto de Lumen Labs.
- Si los backups incluyen objetos de Storage.
- Política de privacidad de Supabase sobre datos de menores.
