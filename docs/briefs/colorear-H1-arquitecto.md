# Brief: colorear H1, arquitectura del motor generate

De: `lider-proyecto` (colorear) · Para: `arquitecto` · Hito: H1 (`docs/planes/colorear-hitos.md`) · Referencia de build: 2-15 nov (excepción de noviembre, en paralelo a Santa)

## Objetivo
Diseñar el pipeline que convierte fotos del cliente (niño, mascota, ciudad, nombre) en un libro para colorear en PDF de 24 o 48 páginas, listo para imprimir, en menos de un minuto percibido por el cliente, con costo por pedido bajo control.

## Contexto
- Producto: $12.99 (24 pág.) / $19.99 (48 pág.); preview gratis de la página 1 antes de pagar.
- Costo de referencia: ~$1.05 por pedido (`docs/investigacion/b2c.md`, ficha 3). El preview gratis es un riesgo de costo y abuso.
- Stack: Next.js (Vercel), Supabase, Inngest, Nano Banana 2 Lite para imágenes, Claude Haiku 5.5 / Sonnet 5.5, Resend, PostHog, Polar.
- `engines/generate` es compartido con cancion y seguros-tx: diseño genérico.
- Las fotos son de menores: aplica el brief legal de colorear (H3).

## Entradas
`docs/productos/colorear.md`, `docs/investigacion/b2c.md` (ficha 3, secciones 4 y 5), `CLAUDE.md`, `docs/reglas-de-decision.md`.

## Entregable esperado
`docs/arquitectura/colorear-generate.md` (una a tres páginas): flujo de datos desde subida de fotos hasta enlace de descarga; cómo se mantiene la consistencia del personaje entre páginas; plantilla de maquetación y tamaño de papel; cola y reintentos en Inngest; límites del preview gratis (por correo, IP, dispositivo) y su costo máximo; presupuesto de costo por pedido para 24 y 48 páginas contra el precio; criterios de rechazo automático de fotos; retención y borrado de fotos; eventos requeridos por `metricas`.

## Criterio de calidad
- El costo por pedido proyectado deja margen consistente con la regla de apagar (contribución ≥ 20 %).
- Todo fallo (foto inservible, generación fallida) tiene reintento o reembolso automático.
- Reutilizable para otros productos del motor generate.
- Cifras no verificadas marcadas como estimación.

## Bloqueos
Cuentas de Polar, dominio y proveedor de imágenes (H0, Juan). El diseño avanza sin ellas.
