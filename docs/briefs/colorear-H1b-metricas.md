# Brief: colorear, eventos antes del código

De: `lider-proyecto` (colorear) · Para: `metricas` · Fecha: 18-oct-2026 (noche) · Entrega: antes del primer commit de código del flujo

## Objetivo
Definir qué se mide del flujo nuevo (nombre + edad + 3 temas, sin fotos) y dejarlo escrito en `packages/analytics/src/events.ts` (es el `analytics/events.ts` de CLAUDE.md) antes de escribir el motor.

## Contexto
Reglas: CAC <= 60 % del ticket, reembolsos < 5 %, contribución >= 20 %; "ya vende" = una venta real entregada de punta a punta sin humano (D4). Costo variable ahora dominado por imágenes (OpenAI gpt-image-1, D15). Ningún evento lleva nombre, correo, IP ni texto libre (`assertNoPii`).

## Entradas
`docs/briefs/santa-H1-metricas.md`, `packages/analytics/src/events.ts`, `docs/productos/colorear.md`, `docs/reglas-de-decision.md`.

## Entregable esperado
1. Reusar del embudo: `landing_view`, `form_started`, `consent_given`, `checkout_started`, `paid`, `delivered`, `refunded`, `survey_answered`.
2. Eventos nuevos: `generation_started`, `generation_page_retried`, `generation_completed` (con `image_cost_usd_cents`), `generation_failed`, `content_blocked`, `book_downloaded`.
3. Definiciones: "venta real entregada" = `paid` con `test_mode=false` y `delivered` del mismo `order_id`; costo de IA por pedido = `generation_completed.image_cost_usd_cents`; tiempo de entrega = `generation_completed.duration_seconds`.
4. `npm run costs` suma el costo de imágenes de los pedidos de colorear.

## Criterio de calidad
Cada umbral de reglas calculable sin interpretación; cero datos personales; los temas viajan como ids de catálogo (no texto libre).

## Fecha
Antes del código (hecho en el commit "Define colorear events").
