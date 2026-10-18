# Santa te llama: plan por hitos

`lider-proyecto` (santa) · v0 · 18-oct-2026 · Capítulo: `docs/productos/santa.md` · Investigación: `docs/investigacion/santa.md`
Producto: motor calls · $14.99 / bundle $24.99 · ES, UK, MX primero; US solo con bundle y CTR ≥ 3 %.
Presupuesto: hasta $500 antes de la primera venta real; después reinversión por ROAS (regla del 18-oct). Los $3,800 son referencia, no tope. Kill-switch: 10-dic.

**Fechas límite duras:** vendiendo antes del **20-nov** · corte **10-dic** · Reyes **26-dic a 5-ene**.
Las fechas de las ventanas son referencia; un hito arranca cuando el anterior cumple su criterio.

| Hito | Entregables | "Cumplido" cuando | Agentes | Lo bloquea | Desbloquea |
|---|---|---|---|---|---|
| **H0 Cuentas listas** | Banco USD, SAT, Polar, ElevenLabs (plan + confirmación escrita), Twilio, Meta, dominio (checklist en `docs/reportes/2026-10-18-arranque.md`) | Cobro de prueba en Polar (modo prueba, no compra propia) y confirmación escrita de ElevenLabs archivada | Juan; `pagos-finanzas` verifica | Solo Juan | H1 (partes que usan proveedores); H1 puede empezar en papel |
| **H1 Fundación: arquitectura, legal, métricas** | Tres briefs ejecutados: diseño de arquitectura del flujo de llamada y pago; paquete legal base (COPPA/VPC, TCPA, grabación, AI Act, retención); `analytics/events.ts` y tablero | Los tres documentos aprobados por `arquitecto`, `legal-compliance` y `metricas` entre sí; sin contradicciones | `arquitecto`, `legal-compliance`, `metricas` | Briefs `docs/briefs/santa-H1-*.md` | H2, H3 |
| **H2 Agente de voz de Santa** | Agente ES/EN en ElevenLabs: persona, guardrails infantiles, cierre de llamada a 5-6 min, detección de buzón, preludio al adulto, voz definitiva, variables (nombre, edad, hermanos, mascota, regalo, buena acción) | Llamada de prueba completa en ES y EN que respeta guardrails y el preludio; `desarrollo-infantil` y `productor-creativo` dan visto bueno | `productor-creativo`, `desarrollo-infantil`, `experto-dominio` | H1 (legal del preludio), H0 (ElevenLabs) | H4 |
| **H3 Checkout, programación y entrega** | Checkout Polar con consentimiento (casilla de padre/tutor, TCPA, grabación; guardar sello de tiempo, IP, texto); programador de llamadas por zona horaria; grabación a MP3 a email/WhatsApp; certificado PDF; reembolso y soporte automáticos; entrega por enlace web como opción en España | Una compra de prueba recorre todo el flujo sin intervención humana y deja los eventos en `metricas` | `arquitecto`, `ux-ui`, `movil-web`, `pagos-finanzas`, `soporte-postventa` | H1, H0 (Polar, Twilio) | H4 |
| **H4 Aprobación legal y QA** | Revisión de `legal-compliance` y red team de `qa-redteam`; prueba con niños (familia/equipo, con autorización): latencia, interrupciones, niños callados, hermanos a la vez, español MX vs. castellano, acento inglés; grabar reacciones con autorización para creativos | Aprobación escrita de ambos en el PR; hallazgos críticos cerrados | `legal-compliance`, `qa-redteam` | H2, H3 | H5 |
| **H5 Soft launch MX** | 3-5 creativos de reacción; landing con precio local; pitch a prensa (Xataka, Applesfera, Chilango, etc.); CTR y CVR medidos | Primera venta real entregada. Con ella el gate de dot y colorear queda satisfecho | `marketing-growth`, `pricing`, `metricas` | H4 | H6; **gate del portafolio P2** |
| **H6 Lanzamiento ES y UK** | Lanzamiento a $14.99 / $24.99, notas de prensa **17-18 nov**, sin subir presupuesto en semana BFCM (24-30 nov); US solo con bundle y CTR ≥ 3 % | **Vendiendo antes del 20-nov** (fecha dura) con CAC y reembolsos visibles por país | `marketing-growth`, `pricing` | H5 | H7 |
| **H7 Escalado y corte (10-dic)** | Reporte del lunes con CAC, margen, reembolsos, reseñas por país; escalar donde CAC ≤ 60 % del ticket y reembolsos < 5 % tras $150; pausar CAC > 80 % o reembolsos > 8 %; empujar bundle de Nochebuena; evaluar capacidad para 20-24 dic (un plan superior de ElevenLabs > $100/mes lo aprueba Juan) | Veredicto por país aplicado; decisión del 10-dic registrada | `director-portafolio`, `metricas` | H6 | H8 |
| **H8 Reyes Magos** | Voces de los 3 reyes; email/WhatsApp a compradores con 30 % de descuento; ads ES/MX | Todo el presupuesto restante de Santa pasa a Reyes el **26-dic**; ventas de Reyes registradas hasta el 5-ene | `productor-creativo`, `marketing-growth` | H7 | H9 |
| **H9 Cierre y post-mortem** | Informe final de contribución; decisión de mantener, apagar o convertir en evergreen (Ratoncito Pérez / Rex) | Veredicto aprobado por Juan; aprendizajes pasados a `rex` | `director-portafolio`, `lider-proyecto` | H8 | Rex |

## Riesgos activos
| Riesgo | Mitigación | Dueño |
|---|---|---|
| ElevenLabs o terceros relanzan Santa gratis | Posicionamiento: llamada saliente a casa, grabación y certificado, sin app ni suscripción | `marketing-growth` |
| COPPA 2026, TCPA ($500-1,500 por llamada), AI Act art. 50 | Checkout como consentimiento verificable, preludio al adulto, borrado ≤ 30 días, sin entrenamiento; validar con abogado español/UE antes de vender en España | `legal-compliance` |
| CAC en EE. UU. en Q4 | US solo con bundle y CTR ≥ 3 %; ES/UK/MX primero | `marketing-growth` |
| Ingresos concentrados en pocas semanas | Reyes Magos como segundo pico | `director-portafolio` |
