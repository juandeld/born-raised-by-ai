# Jinglo · Equipo de video (11-nov-2026)

Equipo de agentes que diseña y produce los videos personalizados de Santa. Estado del producto: propuesta en validación; Juan aún no aprueba catálogo, precios ni presupuesto. Contexto y números en el doc de proyecto `claude/jinglo-videos-santa.md`.

## Quién es quién

| Agente | Responde por |
|---|---|
| `video-director-creativo` | Visión, guion final, corte final. Resuelve desacuerdos. |
| `video-guionista` | Lo que dice Santa y los huecos de personalización. |
| `desarrollo-infantil` (ya existía) | Que el niño crea, disfrute y no se asuste. |
| `video-psicologia-padres` | Por qué el adulto compra y comparte. |
| `video-fotografia-iluminacion` | Luz, cámara, color, continuidad. |
| `video-direccion-arte` | Escenografía, utilería y el aspecto exacto de Santa. |
| `video-musica-sonido` | Música original, efectos y mezcla. |
| `video-voz-santa` | Voz de Santa y pronunciación de cada nombre. |
| `video-ia-generativa` | Modelos, instrucciones de generación y flujo por pedido. |
| `video-edicion-post` | Montaje, color y composición de lo personalizado. |
| `video-control-calidad` | Veto independiente y prueba ciega con papás y niños. |

Siguen aplicando los bloqueantes del portafolio: `legal-compliance`, `qa-redteam` y `arquitecto` (cambios en `engines/`).

## Flujo de un video

1. **Biblia** (`docs/video/jinglo/biblia.md`): cada especialista escribe su sección; cierra el director.
2. **Brief y guion** del video: director, guionista, `desarrollo-infantil`, `video-psicologia-padres`.
3. **Storyboard** plano por plano: fotografía y arte.
4. **Imagen fija aprobada** de cada plano, antes de generar video.
5. **Video**: `video-ia-generativa` genera varias tomas; fotografía y arte eligen.
6. **Voz y labios**: `video-voz-santa` + `video-ia-generativa`.
7. **Música, mezcla y montaje**: `video-musica-sonido` + `video-edicion-post`.
8. **Control de calidad** con veto.
9. **Prueba ciega** con 5 papás y sus hijos.
10. Aprobación de `legal-compliance` y `qa-redteam`; publicación.

## Primer encargo

Piloto: "La Lista de Niños Buenos" + la toma del video gratis de 15 s, a máxima calidad. Pendiente de aprobación de Juan (~$170).

## Pendiente de `legal-compliance` (D27)

Documentar en `docs/proveedores/` la política de cada proveedor del flujo antes de abrir cuentas: generación de video, sincronización de labios, voz y música. Punto conocido: los términos de la API de Gemini prohíben servicios dirigidos a menores de 18 y el uso de modelos en vista previa en producción.
