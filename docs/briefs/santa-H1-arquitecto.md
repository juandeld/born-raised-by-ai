# Brief: santa H1, arquitectura del flujo de llamada y pago

De: `lider-proyecto` (santa) · Para: `arquitecto` · Hito: H1 (`docs/planes/santa-hitos.md`) · Fecha límite dura del producto: vendiendo antes del 20-nov

## Objetivo
Diseñar la arquitectura de punta a punta de "Santa te llama" sobre `engines/calls`: compra, consentimiento, programación, llamada, grabación, entrega, borrado y reembolso, sin humanos en el loop.

## Contexto
- Producto: llamada de Santa $14.99 / bundle $24.99; Reyes Magos 26-dic a 5-ene como segunda ventana; clon posterior para Rex.
- Stack: Next.js (Vercel), Supabase, Inngest, ElevenLabs Agents, Twilio, Resend, PostHog, Polar (plan B Recurrente).
- Costo variable por llamada de 5 min: $0.50-0.80 (EE. UU./MX/UK); hasta $1.45 a móvil en España. Ver `docs/investigacion/santa.md` sección 4.
- El motor se reutiliza en rex, dot, ciudadania y memorias: el diseño debe ser genérico.

## Entradas
`docs/productos/santa.md`, `docs/investigacion/santa.md` (secciones 4, 5, 8), `docs/investigacion/pagos-guatemala.md` (E), `CLAUDE.md`, `docs/reglas-de-decision.md`.

## Entregable esperado
`docs/arquitectura/santa-calls.md` (una a tres páginas) con: diagrama de secuencia del flujo; modelo de datos (pedido, consentimiento con sello de tiempo, IP y texto; llamada; grabación; borrado); programador por zona horaria y regla "nunca remarcar fuera de la ventana elegida"; manejo de buzón, niño callado y cierre a 5-6 min; reembolso automático; qué es parametrizable por personaje (para rex); presupuesto de costo por llamada por país; límite de concurrencia necesario para el pico del 20-24 dic y qué plan de ElevenLabs implica (si > $100/mes, lo escala el director a Juan); lista de eventos que `metricas` debe instrumentar.

## Criterio de calidad
- Cada paso del flujo es automático o tiene su fallback automático.
- Cumple las restricciones del brief legal (`santa-H1-legal.md`) sin excepciones; discrepancias se escalan al líder, no se resuelven en silencio.
- Cambios a `engines/` y al flujo de pago los aprueba solo `arquitecto`: este documento es esa aprobación inicial.
- Sin cifras inventadas: lo no verificado se marca como estimación.

## Bloqueos
Cuentas de ElevenLabs, Twilio y Polar (H0, Juan). El diseño puede avanzar en papel sin ellas.
