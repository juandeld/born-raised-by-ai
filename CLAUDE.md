# Born & Raised by AI · Lumen Labs (lumen-labs.co) — Manual del repositorio

Portafolio de productos digitales de **pago único**, construidos y operados por agentes de IA.
El dueño (Juan) aprueba presupuesto, países y productos; todo lo demás lo deciden los agentes
según `docs/reglas-de-decision.md`.

## Principios no negociables
1. Pago único (o pase de tiempo limitado sin renovación). Nunca suscripción en fase 1.
2. Cero humanos en el loop del cliente: compra, creación, entrega, soporte y reembolso son automáticos.
3. Costo variable: cada venta paga su IA, telefonía y cobro. Costo fijo del portafolio ≤ $250/mes fuera de temporada.
4. El dinero entra a Guatemala: Recurrente (pasarela guatemalteca, cobro en USD, no es merchant of record) principal desde D29; Polar descartado (rechazó la organización y prohíbe productos para menores); PayPal+BAM plan B. Stripe no está disponible. Cada motor elige su proveedor con `PAYMENT_PROVIDER_GENERATE` / `PAYMENT_PROVIDER_CALLS`.
5. Dos motores, muchos productos: `engines/calls` (llamadas de personajes) y `engines/generate` (generación + PDF/MP3/MP4).

## Productos (fase 1)
santa · colorear · rex · cancion · memorias · seguros-tx · ciudadania · dot
Cada uno vive en `products/<slug>/` y tiene su capítulo en `docs/productos/<slug>.md`.

## Stack
Next.js (Vercel) · Supabase · Inngest · Claude Haiku 5.5 / Sonnet 5.5 · ElevenLabs Agents · Twilio · Nano Banana 2 Lite · Lyria 2 · Resend · PostHog · Polar / Recurrente.

## Cómo se trabaja
- Cada tarea nace de un brief de una página del líder de proyecto (`docs/briefs/`).
- `legal-compliance` y `qa-redteam` son bloqueantes: nada llega al cliente sin su aprobación escrita en el PR.
- `arquitecto` es el único que aprueba cambios en `engines/` y en el flujo de pago.
- Las métricas se definen antes del código: cada PR que crea un flujo incluye sus eventos en `analytics/events.ts`.
- Nunca se nombran proveedores ni modelos de IA (OpenAI, Anthropic/Claude, Google, etc.) en nada que vea el cliente: web, correos, PDF, anuncios, soporte. La revelación de IA se hace de forma genérica (D23).
- **Verificación de políticas antes de cualquier proveedor (D27).** Antes de proponer, abrir cuenta, configurar o pedirle a Juan un alta en cualquier proveedor (pagos, tiendas, anuncios, IA, correo, hosting, telefonía), `legal-compliance` lee su política de uso aceptable / productos prohibidos / términos vigentes y confirma por escrito, con cita textual y enlace en `docs/proveedores/<proveedor>.md`, que el producto concreto está permitido: contenido generado con IA (imagen, voz, texto), fotos de menores, llamadas automatizadas, productos digitales personalizados, país del vendedor (Guatemala). Si la política dice "revisión", "puede no aceptarse" o es ambigua, se trata como **riesgo alto**: se avisa a Juan antes de dar un paso y se prepara un plan B. Sin ese documento, no se abre la cuenta.
- Los agentes escriben en español; el código, los nombres de variables y los commits en inglés.

## Comandos
- `npm run dev` · `npm run test` · `npm run deploy:<producto>`
- `npm run costs` → costo real de IA por pedido de la última semana (lo lee `metricas`).
