# Brief: colorear, textos legales (nombre + edad + temas)

De: `lider-proyecto` (colorear) · Para: `legal-compliance` · Fecha: 18-oct-2026

## Objetivo
Textos de checkout, privacidad y términos para un producto que ya no recoge fotos, y verificación de que COPPA no aplica y de que no hay riesgo de derechos de autor por personajes de marca.

## Contexto
Se recoge del comprador adulto: correo, país, idioma, primer nombre (o nombres) de portada, edad (3-8) y 3 temas de un catálogo. El nombre no se envía al proveedor de imágenes; solo temas y franja de edad. Proveedor de imágenes: OpenAI (antes Google en el expediente). D13 no aplica (no hay personaje que hable).

## Entradas
`docs/legal/textos/01, 04, 05`, `docs/legal/riesgos-y-mitigaciones.md`, `docs/decisiones.md` (D8, D15).

## Entregable esperado
`docs/legal/textos/08-colorear.md`: aviso, casillas, módulo de privacidad, módulo de términos, correos; conclusión de COPPA; regla de marcas. Marcar `[no verificado]` lo que no tenga fuente.

## Criterio de calidad
Coherente con 01, 04 y 05 (7 días de reembolso, 30 días de retención); aprobación escrita pendiente antes de cobrar en producción.

## Fecha
18-oct-2026 (noche).
