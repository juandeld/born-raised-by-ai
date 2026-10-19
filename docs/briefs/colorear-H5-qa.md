# Brief: colorear, rúbrica de outputs y red team

De: `lider-proyecto` (colorear) · Para: `qa-redteam` · Fecha: 18-oct-2026

## Objetivo
Rúbrica con la que se aprueba o rechaza cada página y cada libro, y escenarios de ataque del flujo.

## Contexto
La rúbrica corre dos veces: en código (revisión automática de cada imagen antes de entrar al PDF) y en revisión humana/QA con muestras reales cuando exista `OPENAI_API_KEY`. Hoy solo se puede probar con el mock.

## Entradas
`docs/dominio/colorear/paginas.md`, `docs/legal/textos/08-colorear.md`, `docs/qa/santa-escenarios.md` (formato).

## Entregable esperado
`docs/qa/colorear-rubrica.md`: criterios de página y de libro, escenarios de abuso (marcas, inyección en nombre, coste, pago mock, enlace compartido), resultado de lo ejecutado y lo que falta.

## Criterio de calidad
Cada escenario dice cómo se ejecuta y qué resultado es aprobado; lo no ejecutado se declara así.

## Fecha
18-oct-2026 (noche); aprobación escrita antes de cobros reales.
