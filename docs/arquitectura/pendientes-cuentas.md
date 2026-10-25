# Pendientes que requieren cuentas reales

Todo lo de abajo se probó solo con mocks. Marcado `[no verificado]` cuando un nombre de campo o comportamiento sale de la documentación y no de una llamada real.

## Por servicio

| Servicio | Qué falta probar |
|---|---|
| ElevenLabs Agents | Campos de la API al crear agente (prompt, `first_message`, variables dinámicas `{{child_first_name}}`, herramientas `end_call`/`mark_optout`/`flag_incident` con `x-agent-secret`, moderación de salida, retención mínima); voces por idioma; ajustes `speed`/`stability`/`style`; nombre exacto de la variable de duración; disponibilidad de Haiku 5.5; agente "Father Christmas" para en-GB (hoy se usa Santa en-US). Concurrencia 20 del plan Pro |
| Twilio | Llamada saliente real; voces Polly del preludio; detección de buzón (AMD); firma de webhooks con la URL pública; `TimeLimit` de 450 s; números por país (MX, ES, GB, US) y regulación de identificador de llamada; unión al agente de ElevenLabs |
| Polar | Productos por país y variante (`POLAR_PRODUCT_MAP`); nombres de campos del reembolso (`amount`, `tax_amount`) `[no verificado]`; webhook real con el secreto; Apple Pay y Google Pay en el checkout |
| Recurrente | Checkout GTQ, firma Svix y reembolso |
| Resend | Dominio verificado, SPF y DKIM, entrega a bandeja de entrada |
| Supabase | Aplicar migración de `packages/db`, buckets, políticas, cron de retención contra la base real |
| Vercel | Proyecto, variables por entorno, `VERCEL_ENV=production` (cierra el mock), región, LCP < 2,5 s medido |
| PostHog | Proyecto y clave; verificar el embudo |
| Inngest | Cuenta, claves y sincronización de `/api/inngest` |

## Decisiones y huecos de producto

- Bundle de dos llamadas: la segunda no es programable (una fecha y ventana por pedido). Desactivado salvo `BUNDLE_ENABLED=1`.
- Consentimiento C6 sigue con id "draft" hasta aprobación de `legal-compliance`.
- Titular, dirección y fecha de vigencia de las páginas legales (`LEGAL_HOLDER`, `LEGAL_ADDRESS`, `LEGAL_EFFECTIVE_DATE`); `legal-compliance` debe firmar la versión publicada.
- `qa-redteam` debe ejecutar `docs/qa/santa-escenarios.md` (33 escenarios) contra el agente real.
- Prueba de carga a 200 llamadas/hora y proveedor de respaldo de voz, LLM e imagen.
- Muestra de audio de la landing es un marcador de posición.

## DNS de `lumen-labs.co` en GoDaddy para Vercel

Primero añadir el dominio en Vercel (Project, Settings, Domains); Vercel muestra los valores exactos de su proyecto y esos mandan. Los habituales `[verificar contra Vercel]`:

| Tipo | Nombre | Valor | TTL |
|---|---|---|---|
| A | @ | 76.76.21.21 | 600 s |
| CNAME | www | cname.vercel-dns.com | 1 hora |

Borrar antes el registro A de "parking" de GoDaddy y el CNAME `www` existente. Para correo con Resend añadir los registros que muestre su panel (Domains): un TXT SPF (`v=spf1 include:amazonses.com ~all` o el que indique Resend, en el subdominio `send`), un TXT/CNAME DKIM (`resend._domainkey`) y, opcional, un TXT DMARC (`_dmarc`). Si ya existe MX o SPF del buzón de la empresa, no duplicar el SPF: combinarlo en uno solo.


## Estado 18-oct-2026 (noche)
- Supabase: proyecto creado, migración 0001 aplicada, llaves en Vercel.
- Vercel: desplegado en https://born-raised-by-ai-4ta9.vercel.app (root apps/web), PAYMENT_PROVIDER=mock.
- ElevenLabs: agente es-419 creado (agent_2601m58wfve0fdc9j1dbfm0v5fy8) con voz LykVXmiL9G4zV1CJHN2o. Faltan: ELEVENLABS_API_KEY en Vercel, agentes es-ES / en-US / en-GB, confirmación escrita del caso de uso.
- Pendientes de Juan: Twilio (SID, token, número), Resend (API key), lumen-labs.co DNS → Vercel, Polar y Recurrente (KYC), cuenta USD.

## Polar: productos de colorear (Pintoria)

Tres productos privados, cada uno con precios en 4 monedas (el checkout envía `currency` en minúsculas según el pedido, de `COLOREAR_PRICES`). Escalera aprobada por Juan el 19-oct (D25): 1 aventura, Trío y "otra aventura"; el Cinco no se lanza.

| Variante | Producto Polar | USD | GBP | EUR | MXN |
|---|---|---|---|---|---|
| `single` (1 aventura) | 3ccd6b75-f151-4c78-8910-9745523f410e | 12.99 | 9.99 | 11.99 | 229 |
| `bundle3` (Trío) | 75dae2e6-3d80-44e9-a956-f3683c876968 | 24.99 | 18.99 | 22.99 | 429 |
| `add1` (otra aventura, 48 h) | 3ec7f55e-eedd-4f37-b279-f33a72383216 | 9.49 | 7.49 | 8.49 | 169 |

```
POLAR_PRODUCT_MAP={"colorear:US:single":"3ccd6b75-f151-4c78-8910-9745523f410e","colorear:GB:single":"3ccd6b75-f151-4c78-8910-9745523f410e","colorear:ES:single":"3ccd6b75-f151-4c78-8910-9745523f410e","colorear:MX:single":"3ccd6b75-f151-4c78-8910-9745523f410e","colorear:US:bundle3":"75dae2e6-3d80-44e9-a956-f3683c876968","colorear:GB:bundle3":"75dae2e6-3d80-44e9-a956-f3683c876968","colorear:ES:bundle3":"75dae2e6-3d80-44e9-a956-f3683c876968","colorear:MX:bundle3":"75dae2e6-3d80-44e9-a956-f3683c876968","colorear:US:add1":"3ec7f55e-eedd-4f37-b279-f33a72383216","colorear:GB:add1":"3ec7f55e-eedd-4f37-b279-f33a72383216","colorear:ES:add1":"3ec7f55e-eedd-4f37-b279-f33a72383216","colorear:MX:add1":"3ec7f55e-eedd-4f37-b279-f33a72383216"}
```

- Los ejemplos de claves de Santa (`santa:<PAÍS>:single|bundle`) se mantienen en el mismo mapa. Las aventuras gratis del Trío (`credit`) no pasan por Polar: no hay producto.
- **Migración `packages/db/migrations/0004_colorear_variants.sql` (pendiente de aplicar en Supabase ANTES de cobrar el Trío o la oferta)**: amplía el `check` de `variant` (`bundle3`, `add1`, `credit`), agrega `parent_order_id` y un índice único para que dos clics no tomen el mismo crédito.
- Impuesto "incluido" en ES, UK y MX y precio visible igual a `COLOREAR_PRICES` en cada producto: `[no verificado]` en el panel de Polar.
- **Reembolso parcial del Trío** (un tercio por aventura no usada, D26): `polar.ts` envía `amount` sin `tax_amount` en reembolsos parciales `[no verificado]`; probar en sandbox. Si Polar lo rechaza, el motor no cambia nada y responde "escríbenos" (plan B de legal: reembolso total o nulo).
- Webhook `order.refunded`: un reembolso parcial iniciado por el motor llega de vuelta como ese evento; el motor lo ignora porque ya marcó `refunded_at` (no lo lee como reembolso total).
- Dominio: `pintoria.app` y `www.pintoria.app` (apex redirige 308 a www en Vercel). `COLOREAR_PUBLIC_URL` (por defecto https://www.pintoria.app) es la base de enlaces de correos, `success_url`, entrega y reembolso, y del canonical. `COLOREAR_HOSTS` (opcional) cambia los hosts que sirven Pintoria en la raíz.
- `PAYMENT_PROVIDER` sigue en `mock` hasta decisión de Juan.

## Código de prueba de colorear (pruebas de punta a punta sin pasarela)

Polar rechazó la cuenta (D27) y producción corre con `PAYMENT_PROVIDER=mock` + `ALLOW_MOCK_PAYMENTS=1`. Para que Juan, su familia y amigos prueben el flujo completo sin pagar y con el libro REAL (no los dibujos de prueba), el formulario acepta un código. **Las tres variables siguientes las carga Juan en Vercel (Production y Preview) y requieren un despliegue nuevo; el arquitecto no las cargó.**

| Variable | Valor sugerido | Qué hace |
|---|---|---|
| `COLOREAR_TEST_CODES` | `PROMO2026` | Lista de códigos separados por comas, sin distinguir mayúsculas ni espacios. **Vacía o ausente = función apagada**: el formulario ni siquiera muestra el campo y cualquier código responde "no válido". |
| `COLOREAR_TEST_CODE_MAX_USES` | `50` | Pedidos en total por código (se cuentan en la base: `orders.payment_provider='test_code'` con el hash del código en `checkout_id`). Al llegar, el código responde "agotado". Por defecto 50; `0` cierra el código. |
| `COLOREAR_TEST_CODE_DAILY_CAP` | `10` | Pedidos por código en cualquier ventana móvil de 24 h (no por día de calendario, para no depender de la zona horaria). Por defecto 10. |

Cómo funciona (aprobado por el arquitecto, flujo de pago):

- En la página de colorear, bajo el aviso de consentimiento, aparece el enlace discreto "¿Tienes un código?" / "Have a code?". Con un código escrito, el botón pasa a "Usar mi código y crear el libro".
- La validación es solo del servidor (`engines/generate/src/engine.ts` `createCheckout`, comparación en tiempo constante). El código nunca viaja al navegador (solo el indicador de encendido/apagado) ni se registra. Un código mal escrito y la función apagada dan la misma respuesta. Hay un freno por IP: 10 intentos con código cada 10 minutos.
- Con código válido el pedido se crea con `test_mode=true`, `payment_provider='test_code'`, monto 0 en la moneda del país, **sin llamar a la pasarela**, y `apps/web/src/server/api/colorear-checkout.ts` lo marca pagado con un evento interno `payment_succeeded` por el mismo `handleColorearPayment` que usan los webhooks (registro de consentimiento K1 y K2, recibo, evento `paid`, arranque de la generación). El navegador va directo a `/colorear/confirmacion/<token>`.
- K1 y K2 siguen siendo obligatorios. El recibo dice "Pedido de prueba sin costo" / "Test order, no charge" y no muestra ningún cobro ni promesa de reembolso.
- La generación es siempre real para estos pedidos y para las aventuras gratis de su Trío (los pedidos normales con pago simulado siguen limitados por `COLOREAR_MOCK_REAL_DAILY_CAP`, por defecto 3 al día). Funciona con 1 aventura y con Trío; las aventuras del Trío se piden con 1 clic como siempre.
- La oferta de pago "otra aventura" **queda oculta** en pedidos de prueba (lo más simple: no hay nada con qué cobrarla) y, como no hay oferta, los dibujos de una sola aventura de prueba se borran al terminar en lugar de guardarse 48 h.
- "Reembolso" en un pedido de prueba solo cancela y borra (no llama a la pasarela); el correo dice que no hubo cobro.
- Analytics: evento `test_code_redeemed` con `code_hash` (HMAC corto de 10 caracteres, nunca el código), variante, usos totales y de las últimas 24 h. Los pedidos son `test_mode`, así que no entran en las tablas de `npm run costs`; su gasto de imagen se imprime aparte ("Test-code orders").
- Tope de costo en el peor caso: `COLOREAR_TEST_CODE_MAX_USES` pedidos, cada Trío puede generar 3 libros (el tope por libro sigue siendo `COLOREAR_MAX_COST_USD`, 4 USD por defecto).
- Requisito para probar el Trío: la migración `0004_colorear_variants.sql` debe estar aplicada en Supabase (ver sección de Polar). Sin ella, el pedido de un Trío falla al guardarse.
- Para revocar: borrar `COLOREAR_TEST_CODES` en Vercel y desplegar. No hace falta tocar la base.
