# Brief: santa H1, eventos, tablero y umbrales

De: `lider-proyecto` (santa) · Para: `metricas` · Hito: H1 (`docs/planes/santa-hitos.md`) · Fecha límite dura del producto: vendiendo antes del 20-nov

## Objetivo
Definir antes del código qué se mide, con qué evento y dónde se lee, para que el director aplique las reglas de escalar, pausar y apagar con datos suficientes desde la primera venta.

## Contexto
Reglas que el tablero debe poder evaluar (`docs/reglas-de-decision.md`): CAC ≤ 60 % del ticket y reembolsos < 5 % tras $150 para escalar; CAC > 80 % o reembolsos > 8 % para pausar; reseñas < 4.0 y contribución < 20 % para apagar; corte 10-dic; gate "vende" del portafolio (primera venta real entregada). Mercados: ES, UK, MX; US condicionado a bundle y CTR ≥ 3 %.

## Entradas
`docs/productos/santa.md`, `docs/investigacion/santa.md` (secciones 4 y 6), `CLAUDE.md` (`analytics/events.ts`, `npm run costs`).

## Entregable esperado
1. `analytics/events.ts` propuesto: embudo (anuncio, visita, checkout iniciado, pago, consentimiento aceptado, llamada programada, llamada completada, buzón o fallo, entrega de MP3, reembolso, reseña), con propiedades país, creativo, precio, bundle.
2. Definiciones exactas de CAC, margen, contribución, reembolso y "venta real entregada" (excluye compras del equipo y modo prueba).
3. Tablero semanal por producto x país con los campos del reporte del lunes (caja y gasto vs plan; CAC, margen, reembolsos, reseñas).
4. Alertas que avisan al director cuando un país cruza un umbral.
5. Cómo se lee el costo real por pedido (`npm run costs`) y se compara con el costo variable esperado.

## Criterio de calidad
- Cada umbral de las reglas es calculable directamente del tablero, sin interpretación.
- Los eventos son compatibles con el flujo del brief de arquitectura y la política de retención del brief legal (sin datos personales innecesarios en PostHog).
- Quien lee el tablero tarda menos de 10 minutos.

## Bloqueos
Cuenta de PostHog y Meta Ads conectada (H0, Juan) para CAC real. El diseño avanza sin ellas.
