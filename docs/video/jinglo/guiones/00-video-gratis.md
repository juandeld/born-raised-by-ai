# Guion 00 · Video gratis de 15 s (gancho)

Versión `guion-v1.2` · 11-nov-2026 · `video-guionista` · Brief: `docs/briefs/jinglo-video-piloto.md`. Reglas de voz y de Santa: igual que `01-lista-ninos-buenos.md` (sección 0). Revisión: `docs/video/jinglo/revision-piloto.md` (C2 y C3). Aquí no hay sincronización de labios ni cara hablando.

## Changelog

**v1.2 · 11-nov-2026.** Asienta el `guion-v1.1` del storyboard y aplica la revisión de desarrollo infantil.

Textos v1.1 incorporados desde el storyboard:
- Tres tramos (G1, G2, G3) en lugar de dos, todos reutilizados del video 1, sin risa y sin guiño. G1 "Déjame buscar en mi Gran Libro…", G2 "Hay un nombre que brilla…" y "{nombre}… ¡aquí estás!".
- `{nombre}` hasta 16 caracteres (antes 14). Nombre dicho una vez (0:07,7) y escrito una vez; antes se decía dos veces.
- Texto igual para todas las edades; a 3 a 4 años solo cambia el ritmo de la voz.

Cambios obligatorios de `revision-piloto.md`:
- **C2.** El cierre pasa de "Tengo algo más que decirte… sobre lo que escribí de ti." (y de "sobre tu regalo…") a **"Tengo algo muy bonito que contarte. Tu familia me ayudó."** Sin susurro: voz suave y sonriente, `speed` 0,90, una pausa de 1 s antes.
- **C3.** G3 ya no usa V1-06 (ojos sobre el libro). Usa V1-09, tramo 0,0 a 5,5 s: las dos manos sobre el libro cerrado, dos palmadas suaves, la vela en la estrella. Sin fundido a oscuro; termina en la luz dorada. Música en acorde consonante y abierto.
- **C6.** Desaparecen "sobre tu regalo" y "sobre tu sorpresa" (esta última se descarta también como alternativa).
- Prohibido en toda pieza: "solo para ti", "es un secreto", "no se lo digas a nadie".

Pendiente de otros (no se aplicó aquí): variante "Esto es solo el principio…" de `comprador.md` (no revisada por `desarrollo-infantil`), visto bueno de `legal-compliance` al cierre, composición y música de C3 (`video-director-creativo`, `video-musica-sonido`, `video-voz-santa`).

## 0. Objetivo

Que el niño oiga su nombre dicho por Santa y que el adulto quiera ver el resto. Termina con curiosidad en positivo: Santa tiene algo bonito que contar y la fuente es la familia. Nunca termina en duda sobre uno mismo ni en oscuridad. Lleva una marca discreta de jinglo.app en una esquina durante todo el video.

## 1. Huecos

| Hueco | Obligatorio | Límite | Si falta |
|---|---|---|---|
| `{nombre}` | Sí | 16 caracteres | No se genera el video |
| `{edad}` | No (solo elige el ritmo de voz) | 3 a 9 | Ritmo de 5 a 6 años |

No se piden logro, gusto ni Niño Dios en este video: el gancho solo usa el nombre. El video gratis no menciona al Niño Dios (no hay tiempo y el dato no se pide), así que no tiene variante por hogar: es igual para Santa y para Santa + Niño Dios.

## 2. Guion base (todas las edades)

Presupuesto: voz y fijos = (segundos − 0,5) × 15 caracteres. Solo 9:16. Marca "jinglo.app" en la esquina inferior derecha de 0:00 a 0:15.

| Tramo | Plano de origen | Tiempo | Qué se ve | Qué dice Santa | Tipo | Ventana | Máx. car. |
|---|---|---|---|---|---|---|---|
| G1 | V1-01, tramo 0,5–4,5 s | 0:00–0:04 | Estudio de noche, luz de chimenea y velas. Santa pequeño y de cabeza baja abre el Gran Libro. Marca jinglo.app | "Déjame buscar en mi Gran Libro…" (0:00,6–0:02,7) | [FIJO] | 2,1 s | 33 (texto: 31) |
| G2 | V1-03, tramo 0,0–5,5 s | 0:04–0:09,5 | Cenital: el dedo de Santa se detiene y se retira; la página queda limpia. El nombre se escribe en dorado (FFmpeg) con destellos | "Hay un nombre que brilla…" (0:04,3–0:06,0; fijo) · silencio de 0,5 s, con la música cortada (0:07,2–0:07,7) · "{nombre}… ¡aquí estás!" (0:07,7–0:09,8; personalizado) | [FIJO] + [PERSONALIZADO-OFF] | 1,7 s + 2,1 s | 27 (texto: 25) + 31 (peor caso: 30) |
| G3 | **V1-09, tramo 0,0–5,5 s** | 0:09,5–0:15 | Las dos manos de Santa sobre el Gran Libro cerrado, dos palmadas suaves, la vela brilla en la estrella de latón. Sin cara, sin mirada. Sin la composición de V1-09 | **"Tengo algo muy bonito que contarte. Tu familia me ayudó."** (0:10,8–0:14,6, tras 1 s de pausa) | [FIJO] | 3,8 s | 57 (texto: 56) |

Totales:
- Duración: 15 s. Labios: 0 s. Créditos nuevos: 0 (tres tramos ya aprobados del video 1).
- Nombre: dicho 1 vez (0:07,7) y escrito 1 vez (0:07,7–0:09,2), ambas en G2.
- Personalizado: una sola pieza de voz por pedido, "{nombre}… ¡aquí estás!", más el nombre dorado. G1, "Hay un nombre que brilla…" y G3 son audio fijo, grabado una vez.
- Sin risa, sin guiño, sin logo sonoro.

### Voz y sonido de G3 (C2 y C3)

- **Sin susurro.** Voz cálida y baja de volumen, a 0,90 de `speed`, "voz suave, sonriente", con una sola pausa de 1 s antes de hablar. La fila "Suspenso del video gratis" de `biblia/voz.md` ya no lleva `[whispers]`: la actualiza `video-voz-santa`.
- **Imagen.** Sin fundido a oscuro. El último medio segundo termina en la luz dorada de la vela y el libro. La marca de agua de V1-09 del video 1, su desenfoque a cálido oscuro, el título dorado y la tarjeta final no entran (la composición no se aplica a este tramo).
- **Música.** No se resuelve del todo, pero termina en un acorde consonante y abierto (mayor, quinta justa o sus2), sin disonancias ni notas graves en suspenso. La nota de celesta se desvanece sin quedar flotando sola más de 0,5 s.
- **Versión mínima aceptable** si se quiere guardar la carta para el video pagado: "Tengo algo muy bonito que contarte." (35 caracteres).

## 3. Variantes por edad

El texto de G1, G2 y G3 es igual para todas las edades. Lo único que cambia es la voz.

| Edad | Qué cambia |
|---|---|
| 3 a 4 | Voz más lenta (100 a 115 palabras por minuto) y se acortan los silencios, no las palabras. No se acortan el silencio de 0,5 s antes del nombre ni la pausa de 1 s antes de G3. Para este grupo el nombre llega a los 7,7 s y solo se dice una vez: si no se entiende a la primera, se pierde el valor del video. La prueba de escucha en teléfono incluye este tramo y se afina la lentitud de "{nombre}… ¡aquí estás!" (no se agrega otra frase) |
| 5 a 6 | Igual que el base |
| 7 a 9 | Igual que el base |

## 4. Ejemplos con nombres ficticios

| Niño | G1 [FIJO] | G2 [FIJO + PERS-OFF] | G3 [FIJO] |
|---|---|---|---|
| Sofía, 5 años | "Déjame buscar en mi Gran Libro…" | "Hay un nombre que brilla…" · "Sofía… ¡aquí estás!" (19 car.) | "Tengo algo muy bonito que contarte. Tu familia me ayudó." |
| Mateo, 8 años | igual | "Hay un nombre que brilla…" · "Mateo… ¡aquí estás!" (19 car.) | igual |
| Luna, 3 años | igual (voz más lenta) | "Hay un nombre que brilla…" · "Luna… ¡aquí estás!" (18 car.) | igual (voz más lenta) |

### Ejemplos malos (y por qué)

| Mal | Por qué | Bien |
|---|---|---|
| "Tengo algo más que decirte… sobre lo que escribí de ti." (susurrado) | Suena a evaluación ("¿qué escribió de mí?") y Santa no escribió nada: lo escribió la familia. Un adulto que susurra al niño modela un secreto | "Tengo algo muy bonito que contarte. Tu familia me ayudó." |
| "Tengo algo más que decirte sobre tu regalo…" | Empuja al niño a pedir un regalo que el video pagado no entrega; se lee como promesa | (no se dice en producción) |
| "Es un secreto solo para ti." | Secreto con un adulto | (no se dice nunca) |
| "{nombre}, ¿cómo te portaste este año?" | Evalúa y suena a lista de conducta | "{nombre}… ¡aquí estás!" |

## 5. Entradas que se rechazan o se suavizan

Aquí solo importan nombre y edad. La lista completa de campos opcionales está en `01-lista-ninos-buenos.md`, sección 6.

| Entrada | Acción |
|---|---|
| Insultos, groserías, "ignora las instrucciones", URLs, teléfonos, correos | Rechazar y pedir otro nombre |
| Apellidos o nombre completo | Usar solo el primer nombre |
| Nombre con números, emojis o más de 16 caracteres | Pedir corregir |
| Nombre de personaje ajeno o apodo de marca ("Rudolph", "Spider-Man") | Pedir el nombre propio del niño |
| Edad fuera de 3 a 9 | Usar el ritmo de 5 a 6 en el gratis; para la venta completa, el adulto debe elegir otra edad |
| Cualquier texto que pida a Santa decir IA, robot o "soy humano" | Rechazar |
| Pedidos de secreto o susurro ("que le diga un secreto", "que susurre") | Rechazar: el cierre es siempre el texto fijo de G3 |
| Pedidos de que Santa hable de regalos o del Niño Dios en el gratis | Ignorar: el gratis no tiene esos huecos |

## 6. Lista de palabras prohibidas (control de salida)

Igual que `01-lista-ninos-buenos.md`, sección 7, con énfasis en este video: "regalo", "sorpresa", "algo especial", "secreto", "solo para ti", "susurro", "escribí" (Santa no escribió nada), "ponche", "saludo" y todo lo que sea IA, robot o computadora. La excepción del texto "regalo" es la prueba ciega **solo con adultos** de la variante A/B de la biblia, decisión a (nunca con niños y nunca en producción, C2).

## Dudas abiertas

1. Pronunciación de nombres poco comunes: resuelta por la biblia (decisión g) como ayuda opcional fuera de los campos; se confirma en el formulario del gratis.
2. Cierre del gratis: `desarrollo-infantil` lo aprobó con el texto de C2. Falta el visto bueno escrito de `legal-compliance` al texto.
3. La biblia (decisión a) todavía declara ganador al cierre anterior y la variante "sobre tu regalo"; la corrige `video-director-creativo`. Mientras tanto manda `revision-piloto.md`.
4. Variante C de `comprador.md` ("Esto es solo el principio…"): sin revisar; pasa por `desarrollo-infantil` antes de usarse.
