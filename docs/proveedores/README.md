# Puerta de políticas de proveedores (D27): resumen

`legal-compliance` · lectura del 19-oct-2026 · aplica a Pintoria (colorear) y Jinglo (santa) · no es asesoría de abogado.
Cada proveedor tiene su archivo en esta carpeta con enlace, fecha de la política, citas, veredicto por producto y acciones. `[no verificado]` = no pude leerlo o confirmarlo.

Escala: **PERMITIDO** con condiciones (la política no lo prohíbe y las condiciones se cumplen o se pueden cumplir) · **RIESGO ALTO** (la política dice "revisión", "puede no aceptarse", es ambigua o el producto roza una categoría restringida) · **PROHIBIDO** (la política lo veta o el proveedor no puede servir al vendedor). El silencio de una política sobre IA o menores no es una aprobación: se trata como "permitido con condiciones" más confirmación escrita.

## 1. Qué bloquea el primer cobro y los anuncios

| # | Bloqueo | Veredicto | Producto afectado | Quién actúa | Detalle |
|---|---|---|---|---|---|
| 1 | La cuenta de Vercel de Juan es Hobby y la política veta todo uso comercial (cobrar, anunciar) | **PROHIBIDO** | Ambos | Juan ($20/mes) y `arquitecto` | `vercel.md` |
| 2 | ElevenLabs prohíbe productos dirigidos a menores de 18 años sin aprobación escrita | **PROHIBIDO** (Jinglo) | Jinglo | Juan envía la solicitud actualizada por `legal-compliance` | `elevenlabs.md` |
| 3 | Pasarela: Polar rechazó y su lista de prohibidos incluye menores y telecomunicaciones | **PROHIBIDO** | Ambos | Ninguna (descartada) | `polar.md` |
| 4 | Pasarela: Lemon Squeezy y Dodo Payments dejan la decisión a revisión, con cláusulas sobre servicios, IA, llamadas y reembolsos | **RIESGO ALTO** | Pintoria (Jinglo probable prohibido) | `pagos-finanzas` solo con respuesta escrita | `lemon-squeezy.md`, `dodo-payments.md` |
| 5 | Twilio: desde el 17-oct-2026 las llamadas comerciales salientes en España exigen un número +34400, que pide identidad española | **RIESGO ALTO** (Jinglo en España) | Jinglo | `arquitecto` bloquea España; consulta a Twilio | `twilio.md` |
| 6 | TikTok Ads: productos atractivos para menores de 13 solo con público 18+ y sin creatividad "particularmente infantil" | **RIESGO ALTO** | Anuncios de ambos | `marketing-growth` no abre TikTok por ahora | `tiktok-ads.md` |
| 7 | Etsy no está disponible para vendedores en Guatemala | **PROHIBIDO** | Canal de venta | `lider-proyecto` y `marketing-growth` quitan Etsy | `etsy.md` |
| 8 | Pixel de Meta: el nombre de pila del niño viaja en la URL (`?n=`) y el Pixel de navegador puede enviarlo | **RIESGO ALTO** (a verificar) | Anuncios de Jinglo | `arquitecto` verifica y corrige antes de activar `META_PIXEL_ID` | `meta-ads.md` |
| 9 | ElevenLabs puede usar el contenido de las llamadas (voz del niño) para mejorar sus modelos salvo opt-out | **RIESGO ALTO** | Jinglo | Juan activa el opt-out antes de la primera llamada real | `elevenlabs.md` |

Con lo que está permitido hoy, el camino de cobro es: **Recurrente** para ambos productos (condicionado a respuesta escrita y a la aprobación de ElevenLabs para Jinglo) y **PayPal** solo para Pintoria. Ningún comerciante de registro (MoR) queda aprobado: sin MoR, el IVA de Reino Unido, España y México es de Juan (consulta al contador pendiente en `docs/pagos/plan-b-proveedores.md`).

## 2. Tabla resumen

| Proveedor | Uso | Pintoria | Jinglo | Veredicto | Acción |
|---|---|---|---|---|---|
| Polar | Cobro (MoR), ya rechazó | **PROHIBIDO** | **PROHIBIDO** | **PROHIBIDO** [bloquea cobro] | Descartar; Juan cierra la cuenta. Corregir `pagos-tras-polar.md` |
| Lemon Squeezy | Cobro (MoR), candidato de Pintoria | **RIESGO ALTO** | **RIESGO ALTO**, probable PROHIBIDO | **RIESGO ALTO** [bloquea cobro] | No abrir cuenta; consulta escrita solo para Pintoria |
| Dodo Payments | Cobro (MoR), respaldo | **RIESGO ALTO** | **RIESGO ALTO**, tiende a PROHIBIDO | **RIESGO ALTO** [bloquea cobro] | No abrir; resolver el tope de reembolsos del 0,5 % por escrito |
| Recurrente | Cobro (no MoR), plan B | Permitido con condiciones | Permitido con condiciones | Permitido con condiciones | Pregunta escrita, cuenta comercial, declarar ambos productos |
| PayPal | Cobro (no MoR), tercer método | Permitido con condiciones | **RIESGO ALTO** | Permitido con condiciones (solo Pintoria) | Cuenta Business a nombre de Juan; no usar para Jinglo sin respuesta |
| OpenAI | Edición de fotos a ilustraciones | Permitido con condiciones | No aplica | Permitido con condiciones | 8 condiciones; `safety_identifier` y verificación de organización |
| Meta Ads | Anuncios en Facebook e Instagram | Permitido con condiciones | Permitido con condiciones | Permitido con condiciones [bloquea anuncios hasta corregir el Pixel] | Sin nombre ni edad en el texto; sin menores reales; corregir `?n=` |
| Pinterest | Anuncios y orgánico | Permitido con condiciones | Permitido con condiciones | Permitido con condiciones | Releer el 12-nov-2026; ejemplos reales, sin mockups |
| Etsy | Venta de PDF en EE. UU. y Reino Unido | **PROHIBIDO** | **PROHIBIDO** | **PROHIBIDO** | Quitar de `docs/productos/colorear.md` |
| TikTok Ads | Anuncios | **RIESGO ALTO** | **RIESGO ALTO** | **RIESGO ALTO** [bloquea anuncios] | No abrir por ahora |
| Vercel | Hosting de la web y la API | **PROHIBIDO** (Hobby) | **PROHIBIDO** (Hobby) | **PROHIBIDO** con Hobby [bloquea cobro]; permitido con condiciones en Pro | Pasar a Pro de pago y desactivar entrenamiento de modelos |
| Supabase | Base de datos y archivos | Permitido con condiciones | Permitido con condiciones | Permitido con condiciones | Proyecto Pro, región anotada, backups en la política de privacidad |
| Resend | Correo transaccional | Permitido con condiciones | Permitido con condiciones | Permitido con condiciones | Solo transaccional; vigilar quejas (<0,08 %) y rebotes (<4 %) |
| ImprovMX | Reenvío de correo entrante | Permitido con condiciones | Permitido con condiciones | Permitido con condiciones | Añadir a subencargados; un destino por alias |
| Anthropic | Historia de Pintoria (solo roles) | Permitido con condiciones | No aplica (RIESGO ALTO si el agente usara Claude) | Permitido con condiciones | Releer el 12-nov-2026; no cambiar el modelo del agente |
| ElevenLabs | Voz y agente de Jinglo | No aplica | **PROHIBIDO** hasta aprobación escrita | **PROHIBIDO** (Jinglo) [bloquea Jinglo] | Actualizar y enviar la solicitud; opt-out de entrenamiento |
| Twilio | Telefonía de Jinglo | No aplica | Permitido con condiciones (EE. UU., Reino Unido, México); **RIESGO ALTO** en España | **RIESGO ALTO** en España | Bloquear España; números gratuitos o móviles según país |

## 3. Funciones pedidas para el cobro

| Proveedor | Apple Pay y Google Pay | Precio en moneda local |
|---|---|---|
| Lemon Squeezy | Sí ("Apple Pay (Safari only)", "Google Pay (Chrome only)") | Muestra monedas locales pero cobra en USD; precio fijo por país no consta |
| Dodo Payments | Sí (lista ambos) | Sí: Localized Pricing con precios fijos por país o moneda |
| Recurrente | [no verificado] | No: USD o GTQ |
| PayPal | No evaluado como método de tarjeta | Conversión de PayPal [no verificado] |

Ninguna de estas funciones compensa el veredicto de la tabla anterior: Dodo es la mejor en precio local pero tiene RIESGO ALTO.

## 4. Hallazgos que contradicen documentos existentes

1. `docs/investigacion/pagos-tras-polar.md` propone reintentar Polar con una organización solo de Jinglo. La política prohíbe "Services used by, intended for, or advertised towards minors" y "Telecommunication and eSIM Services": no reintentar (`polar.md`).
2. `docs/pagos/plan-b-proveedores.md` recomienda Lemon Squeezy como principal de Pintoria y Recurrente como principal de Jinglo. Lemon Squeezy queda en RIESGO ALTO por "Services of any kind" y por la transición a Stripe Managed Payments; Recurrente sigue como principal, pero Jinglo no cobra con nadie sin la aprobación de ElevenLabs.
3. `docs/legal/solicitud-elevenlabs.md` (listo para enviar) se redactó sin poder leer la política completa. Hay que citar la cláusula de menores, corregir la frase "no entrenamos modelos con los datos", preguntar por el modelo de lenguaje aprobado (hoy Gemini) y por el criterio sobre D13. No enviarlo hasta actualizarlo.
4. `docs/productos/colorear.md` menciona Etsy como canal; Guatemala no es elegible.
5. `docs/legal/subencargados.md`: falta ImprovMX; Vercel Hobby sin DPA claro; región de Supabase y de Resend sin anotar.
6. `CLAUDE.md` principio 4 (Polar principal): lo reescribe Juan al elegir pasarela (D27).
7. Productos futuros: `ciudadania` y `seguros-tx` chocan con las listas de alto riesgo de Anthropic, OpenAI y ElevenLabs y con Polar ("Government Services", "Standardized test prep"). Se revisan antes de activarlos.

## 5. Orden recomendado

1. **Hoy (Juan)**: pasar Vercel a Pro de pago, con el entrenamiento de modelos desactivado. Sin esto, ningún cobro ni anuncio es lícito según su política.
2. **Hoy (`legal-compliance`)**: actualizar la solicitud a ElevenLabs. **Luego Juan** la envía y activa el opt-out de "Data use". Jinglo no se vende ni se anuncia hasta la respuesta.
3. **Esta semana (`pagos-finanzas` y Juan)**: enviar la pregunta escrita a Recurrente (texto en `plan-b-proveedores.md`), abrir cuenta comercial declarando ambos productos, y consultar al contador por el IVA. En paralelo, y solo para Pintoria, enviar las consultas escritas de `lemon-squeezy.md` y `dodo-payments.md`: si alguno responde "sí" por escrito, es una opción con comerciante de registro.
4. **`arquitecto`**: `safety_identifier` en cada edición de imagen; verificar la organización en OpenAI; bloquear España en Jinglo; corregir el `?n=` del Pixel; no activar `META_PIXEL_ID` antes.
5. **Antes de lanzar**: Supabase en plan Pro con región anotada; la política de privacidad menciona copias del proveedor de imágenes hasta 30 días y copias de seguridad; añadir ImprovMX a la lista de subencargados.
6. **Anuncios**: Meta y Pinterest, con aprobación de `legal-compliance` por creativo. TikTok y Etsy, fuera.

## 6. Para el abogado humano (presupuesto $400)

- Art. 50 de la ley europea de IA: ¿basta informar al adulto, o hay que informar al niño que habla con el personaje?
- Regla 2025 de COPPA: uso de la voz del niño por un proveedor (ElevenLabs) para mejorar modelos si no se activa el opt-out; alcance del consentimiento del cobro con tarjeta.
- España: ¿una llamada pedida y pagada por el padre es "comercial" a efectos del prefijo +34400?
- IVA de Reino Unido, España y México al cobrar sin comerciante de registro (con el contador).

## 7. Cambios de política próximos

| Fecha | Qué cambia | Dónde |
|---|---|---|
| 12-nov-2026 | Nueva política de uso y política de regiones de Anthropic; nuevas normas de anuncios y de la comunidad de Pinterest | `anthropic.md`, `pinterest.md` |
| 17-oct-2026 (ya en vigor) | Regla de numeración comercial en España | `twilio.md` |
| Últimos 30 días | Cambios en OpenAI Service Terms (16-oct), Vercel Terms (19-oct), ElevenLabs (9-oct), Resend AUP (13-oct), Polar (1-oct), Recurrente (25-sep) | cada archivo |

Revisión: releer todo cada 30 días o ante cualquier aviso de cambio. Un archivo con política de más de 12 meses (ImprovMX, PayPal) vuelve a leerse antes de usarlo.

## 8. Método y límites

- Fuentes: páginas oficiales de cada proveedor leídas el 19-oct-2026 (texto directo o navegador para páginas con JavaScript). Las citas son fragmentos literales mínimos con enlace; para el texto completo, abrir el enlace.
- No se abrió ninguna cuenta ni se envió ninguna consulta. Los textos de consulta quedan propuestos en cada archivo.
- Lo que una política no dice (IA, menores, llamadas) se marca como silencio y no como aprobación. Tampoco sustituye lo que firme el abogado humano.
