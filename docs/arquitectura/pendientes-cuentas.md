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
