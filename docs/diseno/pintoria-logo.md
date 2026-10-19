# Pintoria: opciones de logotipo

`branding` · 19-oct-2026 · Nombre elegido por Juan: **Pintoria** (libro para colorear de tu familia). Sustituye al placeholder Colorfam. Juan pidió recuperar la idea de los cuatro colores del logo anterior (cuadrado 2x2 rojo/amarillo/azul/verde) sin su ejecución tosca.

Hoja de comparación: `docs/diseno/pintoria-logos.html` (captura en `pintoria-logos.png`). Archivos: `apps/web/public/pintoria/`.

## Los cuatro colores
Cuatro colores "de lápiz" armonizados con la paleta `lapiz-*`: saturación media, nada de primarios puros, y la caléndula es la misma del trazo de las secciones.

| Color | Hex | Nota |
|---|---|---|
| coral | #E0574B | rojo cálido, hermano del `error` #B3261E pero amable |
| caléndula | #F0B43C | el `gold` de la dirección visual, sin cambios |
| azul | #3E7CC4 | azul de lápiz, medio tono; no compite con el teal #1B6B67 del botón |
| salvia | #6BA57C | verde suave; se distingue del teal por ser más claro y amarillo |

La tinta #23303B y el papel #FBFAF7 siguen siendo los de la dirección visual. En los SVG la tinta es `currentColor`: el mismo archivo funciona sobre papel (color: #23303B) y sobre tinta (color: #FBFAF7). El wordmark es Bricolage Grotesque Bold convertido a trazos (no depende de la fuente instalada).

## Opción A: cuatro lápices (`logo-a.svg`)
Cuatro lápices de color, de alturas distintas, asomando de un vaso de línea. Es la familia: cada quien con su lápiz y su tamaño; el vaso de grafito es la casa. En monocolor se vuelve un icono de línea limpio.

## Opción B: la página (`logo-b.svg`)
Una hoja con la esquina doblada y cuatro trazos cortos en cuadrícula 2x2. Es el guiño más directo al logo anterior (los cuatro cuadros), pasado por la dirección "lápiz": línea fina, trazos a mano en lugar de bloques.

## Opción C: cuatro trazos (`logo-c.svg`)
Cuatro trazos apilados de largos distintos, la prueba de color que uno hace en el margen del cuaderno antes de pintar. El más minimalista y el que mejor escala; en monocolor y a 16 px puede confundirse con un icono de menú.

## Recomendación
**Opción A.** Es la única que cuenta la historia completa del producto (familia + colorear) sin texto, se lee a 32 px en el header y a 24 px como favicon, y mantiene la contención de la dirección visual (1,5 px de línea, sin sombras). B es la alternativa segura si Juan quiere el vínculo literal con el logo anterior; C queda como recurso secundario (separador, sello en el PDF, loader), no como marca principal.

Pasos siguientes si se aprueba A: favicon desde `mark-a.svg` (32 y 180 px), sustituir el icono y el nombre en `apps/web/src/components/colorear/Chrome.tsx`, y pasar el nombre por `legal-compliance` (marca y dominio pintoria.co / .com).

## Archivos
- `logo-{a,b,c}.svg`: horizontal, isotipo + wordmark, fondo transparente, 40 px de alto nominal.
- `logo-{a,b,c}-mono.svg`: versión monocolor (todo `currentColor`).
- `mark-{a,b,c}.svg` y `mark-{a,b,c}-mono.svg`: solo el isotipo, cuadrado de 40, para favicon y avatar.
