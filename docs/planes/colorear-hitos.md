# Tu familia para colorear: plan por hitos

`lider-proyecto` (colorear) · v0 · 18-oct-2026 · Capítulo: `docs/productos/colorear.md` · Investigación: `docs/investigacion/b2c.md` (ficha 3)
Producto: motor generate · $12.99 (24 pág.) / $19.99 (48 pág.) · prueba MX/ES $300 · Navidad US/UK vía Pinterest/Etsy.
Costo variable de referencia: ~$1.05 por pedido (investigación b2c).

**Fecha límite:** la temporada de regalos de Navidad. La ventana de build del capítulo (2-15 nov) es referencia; por la excepción de noviembre, colorear se construye en paralelo a Santa y arranca antes si H0 y H1 de Santa lo permiten.

| Hito | Entregables | "Cumplido" cuando | Agentes | Lo bloquea | Desbloquea |
|---|---|---|---|---|---|
| **H0 Cuentas listas** | Compartidas con Santa (Polar, dominio, Meta) más cuentas de Pinterest y Etsy para el canal de Navidad US/UK | Cobro de prueba en Polar y cuentas de canal creadas | Juan; `pagos-finanzas` | Solo Juan | H2 |
| **H1 Arquitectura del motor generate** | Diseño: foto a dibujo de línea, consistencia de personaje, maquetación a PDF de 24 y 48 páginas, preview gratis de la página 1; costo por pedido | Documento aprobado por `arquitecto`, con presupuesto de costo por pedido y eventos acordados con `metricas` | `arquitecto`, `metricas` | Brief `docs/briefs/colorear-H1-arquitecto.md` | H2, H3 |
| **H2 Prototipo de calidad** | Pipeline funcionando con fotos de prueba (niño, mascota, abuelos); páginas imprimibles | `qa-redteam` y `ux-ui` validan que las páginas son coloreables y el personaje es reconocible entre páginas; el "aha" de 60 segundos funciona | `productor-creativo`, `ux-ui`, `desarrollo-infantil` | H1 | H4 |
| **H3 Legal de fotos de menores** | Aviso y consentimiento parental, retención y borrado de fotos, política de contenido, términos de Etsy/Pinterest para digitales | Aprobación escrita de `legal-compliance` | `legal-compliance` | H1 | H4 |
| **H4 Checkout, entrega y soporte** | Checkout Polar con preview gratis; entrega de PDF por enlace y email; reembolso y soporte automáticos; eventos en `analytics/events.ts` | Compra de prueba recorre el flujo sin intervención humana | `movil-web`, `pagos-finanzas`, `soporte-postventa` | H2, H3 | H5 |
| **H5 Aprobación QA** | Red team: contenido inapropiado, fotos de terceros, abuso del preview gratis, picos de costo | Aprobación escrita de `qa-redteam` en el PR | `qa-redteam` | H4 | H6 |
| **H6 Lanzamiento de prueba MX/ES ($300)** | 3 creativos (morph foto a dibujo, fiesta, abuelos); landing; listados Pinterest/Etsy para Navidad US/UK | **Primera venta real entregada** (cumple el gate P3 del portafolio) | `marketing-growth`, `pricing` | H5 | H7; gate de dot |
| **H7 Evaluación tras $150** | Reporte: CAC, margen, reembolsos, reseñas por país | Veredicto por país con las reglas: escalar (CAC ≤ 60 % y reembolsos < 5 %), pausar (CAC > 80 % o reembolsos > 8 %) | `director-portafolio`, `metricas` | H6 | H8 |
| **H8 Escalando** | Presupuesto reasignado por creativo y país; versión de 48 páginas a $19.99; cross-sell con compradores de Santa | 30 ventas reales alcanzadas y veredicto de mantener o escalar; no se gasta más de la prueba antes de eso | `marketing-growth`, `director-portafolio` | H7 | Cierre de temporada |
