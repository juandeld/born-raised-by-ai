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
| **H4 Checkout, entrega y soporte** | Checkout Recurrente (D29; antes Polar) con preview gratis; entrega de PDF por enlace y email; reembolso y soporte automáticos; eventos en `analytics/events.ts` | Compra de prueba recorre el flujo sin intervención humana | `movil-web`, `pagos-finanzas`, `soporte-postventa` | H2, H3 | H5 |
| **H5 Aprobación QA** | Red team: contenido inapropiado, fotos de terceros, abuso del preview gratis, picos de costo | Aprobación escrita de `qa-redteam` en el PR | `qa-redteam` | H4 | H6 |
| **H6 Lanzamiento de prueba MX/ES ($300)** | 3 creativos (morph foto a dibujo, fiesta, abuelos); landing; listados Pinterest/Etsy para Navidad US/UK | **Primera venta real entregada** (cumple el gate P3 del portafolio) | `marketing-growth`, `pricing` | H5 | H7; gate de dot |
| **H7 Evaluación tras $150** | Reporte: CAC, margen, reembolsos, reseñas por país | Veredicto por país con las reglas: escalar (CAC ≤ 60 % y reembolsos < 5 %), pausar (CAC > 80 % o reembolsos > 8 %) | `director-portafolio`, `metricas` | H6 | H8 |
| **H8 Escalando** | Presupuesto reasignado por creativo y país; versión de 48 páginas a $19.99; cross-sell con compradores de Santa | 30 ventas reales alcanzadas y veredicto de mantener o escalar; no se gasta más de la prueba antes de eso | `marketing-growth`, `director-portafolio` | H7 | Cierre de temporada |


## Estado real (19-oct-2026)

| Hito | Estado | Evidencia |
|---|---|---|
| H0 Cuentas | Parcial: Supabase, Vercel, Resend (solo prueba) y OpenAI listos. Polar (19-oct): organización "Lumen Labs" (persona individual, slug `lumen-labs-co`), producto Pintoria 24 pág. con 4 monedas (USD 12.99, GBP 9.99, EUR 11.99, MXN 229; id 3ccd6b75-f151-4c78-8910-9745523f410e) y webhook a `/api/webhooks/polar` creados. Faltan: verificación de identidad y cuenta de pago de Juan, token de API y secreto del webhook en Vercel (los pega Juan), correo de soporte con dominio, Resend con dominio verificado | Pasos en el reporte del líder |
| H1 Arquitectura | Hecho en código (motor `engines/generate`, proveedor OpenAI, estado por pasos reanudable); falta aprobación formal de `arquitecto` | PR 2958e3e y siguientes |
| H2 Prototipo de calidad | Hecho: libro de 24 páginas con fotos de stock (portada con personajes reales, 3 personas), 104 s y $0.53 en producción. Pendiente validación de `qa-redteam`, `ux-ui` y `desarrollo-infantil` | Muestra en `/tmp/claude-0/colorear-muestra/real2/` (fuera del repo) |
| H3 Legal de fotos de menores | Consentimiento en un solo clic (D22, `colorear-legal-v2`): una casilla K1 con "Ver detalle" y K2 (términos y privacidad) al pagar; aviso y correo sin marcas, proveedores nombrados solo en la política de privacidad. `legal-compliance` aprueba por escrito en D22 con tres condiciones (retención del proveedor de imágenes por confirmar con OpenAI antes de cobrar en real) | `packages/legal/src/colorear.ts`, `/colorear/<es|en>/privacidad` y `/terminos` |
| H4 Checkout, entrega y soporte | Flujo completo en producción con pago simulado: landing es/en, subida de 1-5 fotos, consentimiento, estado en vivo, PDF con enlace firmado (10 min), correo, reembolso y encuesta. 28-oct: adaptador de Recurrente listo y probado en unitario; para cobrar en real faltan las llaves de Juan en Vercel y el webhook registrado (pasos en `docs/pagos/recurrente-activacion.md`) | `/colorear` en producción |
| H5-H8 | No iniciados; H5 bloqueado por H3 y por D28 (fotos de menores de 13 al proveedor de imágenes) | |

Decisión de duración (Vercel Hobby): la generación corre en `/api/colorear/run` con `maxDuration = 300` y se ejecuta después de responder 202 (`after`). El motor se detiene solo a los 235 s, guarda el estado en Storage y pide otra invocación; la página de estado (cada 3 s) y el cron barrido la reanudan si se cae. Medido: 104 s en una sola invocación, así que normalmente no hace falta dividir.

Velocidad: medido en producción 104 s y 110 s (meta <90 s, no alcanzada). El tiempo lo dominan la portada (reintentos de QA, ahora relajados) y la cola de 23 páginas con 12 imágenes en paralelo (`COLOREAR_CONCURRENCY`). Una tercera corrida tuvo una petición a OpenAI colgada (~150 s); se bajó el timeout a 100 s. Para llegar a <90 s de forma fiable: calidad `low` o verificar el límite de imágenes por minuto del tier de OpenAI.


## Actualización 19-oct-2026 (noche): escalera, dominio y retención

Decisiones de Juan (D25): escalera de **1 aventura** y **Trío** más la oferta **"otra aventura con las mismas fotos"** (48 h); el Cinco y el libro de 48 págs no se lanzan; dominio **pintoria.app**. Retención y reembolso del Trío: D26 (`legal-compliance`).

| Pieza | Estado | Evidencia |
|---|---|---|
| Dominio | Hecho y verificado en producción: `pintoria.app`/`www.pintoria.app` sirven Pintoria (`/` es, `/en` en), las rutas de Santa dan 404 en esos hosts; `COLOREAR_PUBLIC_URL` en enlaces y canonical | `apps/web/src/middleware.ts`, `lib/colorear-host.ts`, commit 09a30fe |
| Marca | Aviso, privacidad y términos de colorear usan "Pintoria"; prueba que falla con "Jinglo" | `tests/colorear-brand.test.ts`, commit 7509139 |
| Selector 1 aventura / Trío | Hecho: dos tarjetas, Trío destacado y preseleccionado ("3 por menos que el precio de 2", tachado 3 × precio sencillo), líneas legales del Trío y del correo | `ColorearForm.tsx`, capturas `docs/diseno/capturas/colorear-trio-selector-*-movil.png` |
| Trío con créditos | Hecho con pago simulado: la 1.ª aventura al comprar; "Te quedan 2 aventuras" en la página de entrega; cada libro con 1 clic reutilizando los dibujos (sin fotos); créditos caducan a los 30 días; un libro fallido devuelve su crédito | `engine.useCredit`, `tests/colorear-ladder.test.ts`, captura `colorear-trio-entrega-creditos-movil.png` |
| Otra aventura | Hecho con pago simulado: oferta de 48 h con enlace firmado y cuenta atrás real, checkout propio con K2 visible, reembolso propio de 7 días | `engine.createUpsellCheckout` |
| Retención | Hecho: fotos ≤ 24 h (sin cambio); dibujos 48 h (una aventura) o hasta la última aventura y máx. 30 días (Trío); botón "Borrar mis personajes"; borrado por cron | `sweep`, pruebas de borrado |
| Recordatorio día 25 | Hecho: correo transaccional (texto de `legal-compliance`) 5 días antes del borrado; bloque comercial solo sin aventuras sin usar, sin baja y con menos de 3 correos comerciales; baja de un clic | `engine.sweep`, `/api/colorear/baja` |
| Eventos | `bundle_selected`, `credit_used`, `upsell_viewed`, `upsell_purchased`, `characters_deleted`, `expiry_reminder_sent` | `packages/analytics/src/events.ts` |
| Pendiente | Migración 0004 en Supabase; probar el reembolso parcial en Recurrente (depende del procesador de la cuenta; si falla, plan B "todo o nada" de D26); usar aventuras del Trío subiendo las fotos otra vez cuando se borraron los dibujos (hoy no existe ese camino: el botón de borrado solo se ofrece a quien compró una aventura); segundo correo comercial a las 30 h de la entrega | |
