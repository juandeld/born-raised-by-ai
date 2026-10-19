# Brief: colorear, motor generate y flujo web (versión nombre + temas)

De: `lider-proyecto` (colorear) · Para: `arquitecto` · Fecha: 18-oct-2026 · Reemplaza el alcance de fotos de `colorear-H1-arquitecto.md` (D15 y decisión de producto del 18-oct)

## Objetivo
`engines/generate` con proveedor de imágenes intercambiable (`openai | nanobanana | mock`), ensamblado de PDF de 48 páginas, entrega por correo y página `/colorear/entrega/<token>`, más el flujo web (landing, formulario, checkout mock, confirmación).

## Contexto
Juan decidió (18-oct, 21:39) usar `gpt-image-1` de OpenAI como proveedor actual; Nano Banana queda como alternativo. Todavía no hay `OPENAI_API_KEY`: todo corre con `mock` y, cuando la clave exista, el cambio es solo `IMAGE_PROVIDER=openai`. Sin Inngest (igual que Santa): ejecución en línea más reintento por cron y por sondeo de la página de estado. No tocar `engines/calls` ni `products/santa`.

## Entradas
`CLAUDE.md`, `docs/productos/colorear.md`, `docs/marketing/colorear.md`, `docs/dominio/colorear/paginas.md`, `docs/legal/textos/08-colorear.md`.

## Entregable esperado
Código en `engines/generate`, `packages/config/src/colorear.ts`, rutas en `apps/web`, `docs/arquitectura/colorear-generate.md`, pruebas que pasan junto con toda la suite de Santa.

## Criterio de calidad
Cambio de proveedor solo por variable de entorno; el nombre del niño nunca sale hacia el proveedor de imágenes; todo fallo se reintenta o se reembolsa solo; costo por pedido con tope; nada de Santa se rompe.

## Fecha
Prototipo funcional en producción antes de las 08:00 del 19-oct.
