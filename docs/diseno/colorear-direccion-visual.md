# Colorear: dirección visual "lápiz"

`ux-ui` · 19-oct-2026 · Sustituye al look "crayón" (bordes negros de 3 px, sombras duras, chips con emoji), que Juan rechazó por verse generado por plantilla. El nombre Colorfam es placeholder.

## Idea
Un cuaderno de trabajo bien hecho: línea fina de grafito, papel claro, un verde azulado serio que da confianza y un trazo de lápiz amarillo como único gesto "a mano". Amistoso por la forma (esquinas suaves, tipografía redonda), profesional por la contención (bordes de 1 px, sin sombras duras, sin emoji, mucho aire).

## Paleta (tokens `lapiz-*` en `apps/web/tailwind.config.ts`)
| Token | Hex | Uso | Contraste sobre papel |
|---|---|---|---|
| ink | #23303B | texto, iconos de línea | 12:1 |
| muted | #55626E | ayudas, pies | 5,9:1 |
| paper | #FBFAF7 | fondo | n/a |
| line | #D6DADC | bordes de tarjeta | decorativo |
| teal | #1B6B67 | botón principal, selección, números | 6:1 (texto blanco sobre él) |
| teal-dark | #145551 | hover | 8,6:1 |
| tint | #E4F0EE | ficha seleccionada, paso 2, privacidad | n/a |
| gold | #F0B43C | trazo de lápiz, foco | solo decorativo y anillo de foco |
| gold-tint | #FCF1D6 | aviso legal, notas | n/a |
| error | #B3261E | errores | 6,2:1 |

## Tipografía (Google Fonts)
- Títulos: Bricolage Grotesque 600 a 800 (clase `c-h`): grotesca con carácter, redondeada, seria.
- Texto: Figtree 400 a 700: legible y cálida en móvil.
- Escala: h1 40/60 px, h2 30 px, h3 20 px, cuerpo 16 a 18 px; líneas de menos de 70 caracteres.

## Reglas de forma
- Bordes de 1 px (`line`); selección con borde teal y relleno `tint`, nunca con grosor.
- Radios: 12 px en controles, 16 px en tarjetas. Sin sombras duras; una sola sombra suave en la muestra del hero.
- Iconos de línea propios (SVG inline, cuadrícula de 24 px, trazo de 1,5 px redondeado). Cero emoji en la interfaz.
- Gesto de lápiz: un trazo amarillo ondulado bajo los títulos de sección (`c-rule`). Es la única "decoración".
- Movimiento: solo respuestas a la acción (marca de selección, `+` del FAQ). Se respeta `prefers-reduced-motion`.

## El flujo en tres pasos (landing y formulario dicen lo mismo)
1. Sube las fotos. 2. Elige la aventura (paso protagonista: tarjeta resaltada en la landing con cuatro iconos, y ficha propia en el formulario). 3. Recibe tu libro (correo y pago).
La edad queda como tarjeta sin número entre el paso 1 y el 2. El tema sigue siendo opcional (si no se elige, sorpresa), pero ya no se presenta como un extra.

## Selector de aventura
- 24 fichas, grid de 3 columnas en móvil y 4 desde 768 px. Cada ficha mide al menos 96 px de alto (objetivo táctil mayor que 48 px).
- Semántica: radios nativos (teclado con flechas, lector de pantalla), clic en la ficha elegida la quita. Anillo de foco amarillo de 3 px.
- Campo "O escribe la tuya" discreto debajo; escribir limpia la ficha y elegir una ficha rellena el campo (misma lógica y mismos ids que antes: `themeId` y `theme` en el POST).

## Ingredientes recuperados (v2, 19-oct-2026)
Juan pidió recuperar tres elementos del look "crayón" dentro de la línea "lápiz". Regla: el marcador es un acento "hecho a mano", no el sistema; el resto sigue en línea fina.

| Ingrediente | Token / clase | Especificación | Dónde |
|---|---|---|---|
| Marcador | `.c-marker` | borde 3 px tinta `#23303B`, radio 22 px, sombra sólida 6 px 6 px 0 tinta, rotación 1,5 grados | portada del libro (hero) |
| Marcador chico | `.c-marker-sm` | borde 2,5 px, radio 16 px, sombra 4 px 4 px, rotación alterna de -1, 1 y -0,5 grados | tres muestras; paso 2 de "Así funciona" (sombra teal) |
| Ficha seleccionada | `.c-theme:has(input:checked)` | borde tinta 2,5 px, relleno `tint`, sombra teal 3 px 3 px 0 | selector de aventura |
| Coral (acción) | `lapiz-coral` `#C8452F`, hover `lapiz-coral-dark` `#A53622` | texto blanco 4,8:1 | todo CTA primario: `.c-btn` (hero y pago), descarga, reembolso |
| Botón principal | `.c-btn` | pastilla redonda, borde tinta 2,5 px, sombra 0 4 px 0 tinta, baja 2 px al pulsar, foco con anillo caléndula | un solo CTA por pantalla |
| Píldora amarilla | `.c-stamp` | fondo `gold`, borde tinta 2,5 px, texto tinta (9:1), giro leve | eyebrow del hero (`hero.kicker`), sello "La parte divertida" en el paso 2, sello "Pago único, sin suscripción" en muestras |

Reparto de color: coral = actuar; verde azulado = elegido, progreso y confianza (números de paso, checks, privacidad, selección); caléndula = voz y sello. Nunca dos CTA coral en la misma vista. Sin emoji; tipografía e iconos de línea sin cambios.

Capturas: `docs/diseno/capturas/colorear-v2-*.png`.

## Checklist
Contraste AA verificado con los hex de arriba · objetivos táctiles de 44 a 60 px · un solo CTA primario por pantalla · formulario sin cambios de campos · textos legales y consentimiento intactos.
