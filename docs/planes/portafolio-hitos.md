# Plan del portafolio por hitos

Autor: `director-portafolio` · Versión 0 · 18-oct-2026
Reglas que mandan: `docs/reglas-de-decision.md` y `CLAUDE.md`. Este plan no las modifica, las ordena en el tiempo.

## Principio: hitos, no semanas
Un hito se cumple cuando su criterio verificable se cumple, no cuando llega una fecha. Si Juan avanza más rápido, el siguiente hito arranca antes. Las fechas aparecen solo como **fecha límite dura** (existen de verdad) o como **ventana de referencia** (tomada de `docs/productos/*.md`, no vinculante).

| Fecha límite dura | Qué |
|---|---|
| 20-nov-2026 | Santa ya vendiendo (PR 17-18 nov) |
| 10-dic-2026 | Corte de Santa: continuar o concentrar |
| 26-dic-2026 a 5-ene-2027 | Reyes Magos (todo el presupuesto de Santa va a Reyes desde el 26-dic) |
| 12-14 may-2027 | Roadcheck (dot) |
| 10-may-2027 | Día de la Madre MX/ES (memorias) |

Si el gate de un producto no se cumple a tiempo para su fecha límite dura, el producto pierde esa temporada. No se salta el gate.

## Gate de entrada a build
**Un producto nuevo entra a build solo cuando el anterior ya vende.** Definición operativa propuesta de "ya vende" (pendiente de confirmar por Juan, ver reporte #0): checkout real abierto y al menos una venta real de un cliente (no del equipo) entregada de punta a punta sin intervención humana. Excepción única ya escrita en las reglas: noviembre, Santa + Colorear en paralelo.

Orden de arranque: **santa → colorear → dot → seguros-tx + prueba de humo de cancion → rex → ciudadania → memorias.**

## Hitos del portafolio

| ID | Hito | Criterio de "cumplido" (verificable) | Responsable | Bloquea / lo bloquea | Desbloquea |
|---|---|---|---|---|---|
| P0 | Cuentas y cobro listos | Checklist de cuentas del reporte #0 completo; Polar aprobado en modo prueba con un cobro de prueba que no es compra propia; confirmación escrita de ElevenLabs recibida | Juan (cuentas) + `pagos-finanzas` (verifica) | Lo bloquea solo Juan | Todo el build de Santa |
| P1 | Santa listo para vender | Santa H1 a H4 cumplidos (`docs/planes/santa-hitos.md`): llamada de punta a punta, aprobación escrita de `legal-compliance` y `qa-redteam` en el PR | `lider-proyecto` santa, `arquitecto` | P0, briefs H1 | P2 |
| P2 | Santa vende | Primera venta real entregada; eventos llegando a `metricas`. **Antes del 20-nov** | `lider-proyecto` santa, `marketing-growth` | P1 | Gate de Colorear (nov, excepción), dot, tablero real |
| P3 | Colorear vende | Igual que P2 para colorear (`docs/planes/colorear-hitos.md`) | `lider-proyecto` colorear | P0; build en paralelo a P1 por la excepción de noviembre | Gate de dot |
| P4 | Corte de Santa (10-dic) | Reporte con CAC, margen, reembolsos y reseñas por país; veredicto escalar / mantener / pausar / apagar aplicado por reglas | `director-portafolio`, `metricas` | P2 | Presupuesto liberable a Reyes (26-dic) |
| P5 | Dot entra a build | P2 y P3 cumplidos. Brief H1 de arquitectura firmado | `lider-proyecto` dot | Gate | P6 |
| P6 | Dot vende | Primera venta real entregada (voz web + línea Twilio). Roadcheck 12-14 may como fecha límite dura de campaña | `lider-proyecto` dot | P5, legal de voz | Gate de seguros-tx y cancion |
| P7 | Seguros-tx vende + prueba de humo de cancion | Seguros-tx: primera venta real entregada. Cancion: prueba de humo de $300 ejecutada (referencia 1-15 dic); **se construye solo si conversión > 3 % y CAC < $10** | `lider-proyecto` seguros-tx / cancion | P6 | Gate de rex |
| P8 | Rex vende | Primera venta real entregada (clon del motor de Santa). Prueba MX/ES $400 | `lider-proyecto` rex | P7; build referencia 6-20 ene | Gate de ciudadania |
| P9 | Ciudadania vende | Primera venta real entregada (pase 30 días). Play + SEO + $300 de ads | `lider-proyecto` ciudadania | P8; build referencia 1-14 feb | Gate de memorias |
| P10 | Memorias vende | Primera venta real entregada; venta 16 abr - **10 may** (fecha dura) | `lider-proyecto` memorias | P9; build referencia 15 mar-15 abr | Cierre de fase 1 |

Los 3 próximos hitos: **P0 → P1 → P2.** Colorear (P3) arranca en paralelo solo dentro de la excepción de noviembre.

## Reglas de escalar y apagar (tomadas tal cual de las reglas de decisión)

| Situación | Regla | Quién decide |
|---|---|---|
| Prueba por producto | $300-500; nada más antes de 30 ventas reales (Santa: tope $3,800) | Director dentro del tope |
| Escalar país | Tras $150 gastados: CAC ≤ 60 % del ticket y reembolsos < 5 % | Director reasigna; subir tope lo aprueba Juan |
| Pausar país | CAC > 80 % del ticket tras $150, o reembolsos > 8 % | Director solo |
| Apagar producto | 2 semanas sin cumplir CAC, o reseñas < 4.0, o contribución < 20 % | Director recomienda; apagar lo aprueba Juan |
| Subir presupuesto | Nunca más de 2x por semana; máximo 40 % del portafolio en un producto | Director dentro de reglas |
| Santa | Corte 10-dic; 26-dic todo a Reyes Magos | Director |
| Capital | Plan $8,000; tope $10,000 | Juan |

Nota de aplicación: el tope de Santa ($3,800) supera el 40 % de $8,000 ($3,200). Se aplica el menor hasta que Juan libere el resto (decisión D2 del reporte #0).

## Cadencia
Lunes 07:00 reporte del director; Juan responde en el día; ejecución martes a domingo. Los hitos se marcan en `docs/planes/*.md` cuando el responsable adjunta la evidencia del criterio.
