# Producción del piloto en Google Flow · "La Lista de Niños Buenos" + video gratis

Versión `flow-v1` · 11-nov-2026 · `video-ia-generativa` · Documento interno: nombra modelos y proveedores (D23 aplica solo a lo que ve el cliente).
Manda: `docs/video/jinglo/biblia.md` → `storyboard/01-lista-ninos-buenos.md` → este plan. Si este plan choca con la biblia o el storyboard, gana la biblia y se corrige aquí.
Fuentes: brief `docs/briefs/jinglo-video-piloto.md` · arte `biblia/arte.md` · fotografía `biblia/fotografia.md` · voz `biblia/voz.md` · sonido `biblia/sonido.md` · guiones `guiones/00-…` y `guiones/01-…` · legal `legal-proveedores.md`, `docs/proveedores/google.md`, `docs/proveedores/sync-so.md`.

---

## 0. Hechos de partida (confirmados en Flow el 11-nov-2026)

| Hecho | Consecuencia para el plan |
|---|---|
| Plan Ultra con 10,050 créditos; el saldo se reinicia el 11-dic | Tope del piloto: **7,000 créditos** con la reserva dentro. Los créditos que sobren antes del 11-dic los asigna `lider-proyecto` (no se gastan por inercia) |
| Imágenes Nano Banana Pro = **0 créditos** en Ultra | Todas las fijas (M y F), sus versiones 16:9, sus fotogramas finales y las de contingencia sin lentes se hacen ahí, sin límite de intentos. Se resuelve el `[no verificado]` de la sección 5 del storyboard: las fijas no salen de la reserva |
| Modelo de video por defecto: **Omni 1.2 Flash** (hasta 15 s, admite referencias de personaje y de voz) | Es candidato a todo el piloto (rama A). Su costo en créditos por clip **no está confirmado**: se anota en la calibración (`c`) y decide el presupuesto de la rama A |
| Veo 3.1 Quality = 100 créditos por clip de 8 s; Veo 3.1 Fast = 10 créditos | Rama B (la del storyboard) |
| Veo 3.1 Fast, Veo 3.1 Quality y Omni 1.1 **se retiran el 5-dic-2026** | Toda toma de Veo se aprueba y se descarga antes del **3-dic**. El selector de modelo se revisa en cada tanda: que diga Omni **1.2**, nunca 1.1. El pipeline por pedido no usa Flow ni Veo (sección 9) |
| Panel de chat de agente con "confirmar antes de generar" | Siempre activado. El agente no reescribe instrucciones (sección 2) |
| Marca de agua visible apagada; SynthID permanece | Se revisa en cada descarga; SynthID nunca se toca |
| Flow no tiene API | La base se produce a mano en el navegador, una sola vez. Por pedido solo cambian voz, labios y composición FFmpeg |
| Masters de Santa: set A y set B; recomendación **B1** (pendiente que Juan elija) | **M1 := B1** (o la que elija Juan). Nada con cara se genera antes de esa elección y de la auditoría de M1 (sección 4.1) |

---

## 1. Decisión de modelo

### 1.1 Calibración en curso (Omni 1.2 Flash frente a Veo 3.1 Quality, retrato B1)

Se suma una toma de Veo 3.1 Fast con el mismo B1 (10 créditos) para cerrar la comparativa a ciegas de 3 modelos de video que pide la misión. Las tres usan la instrucción de V1-07, variante A (sección 5.7), fotograma inicial B1, 9:16.

`video-control-calidad` evalúa a ciegas (archivos renombrados `X1`, `X2`, `X3`, sin modelo ni costo), en teléfono y al 200 %:

| # | Criterio | Cómo se mide |
|---|---|---|
| 1 | Identidad frente a B1 | Los 12 puntos de la biblia (lunar, nariz, ceja, lentes, bigote sobre el labio, rojo ladrillo, ribete crema) en el primer, el cuarto y el último segundo |
| 2 | Piel | Prueba de cera al 200 % en la mejilla (fotografía 3) |
| 3 | Lentes | Sin deformación ni reflejo sobre los ojos en ningún fotograma |
| 4 | Boca para labios | Los dos labios visibles; boca estable en los tramos de boca cerrada; cabeza dentro de ±10° |
| 5 | Movimiento | Parpadeo y respiración naturales, sin "deslizamiento" de la mirada ni morphing |
| 6 | Estabilidad temporal | Sin parpadeo de luz > 5 % en la cara ni texturas que hiervan |
| 7 | **Resultado tras labios** | Cada toma pasa por Sync lipsync-2-pro con la pieza de prueba "¿Sabes una cosa, Ana? Ya estás en mi Lista de Niños Buenos." (nombre ficticio, voz de prueba interna). Sin máscara alrededor de la boca |

**Omni "iguala" si:** ningún criterio de descarte inmediato (fotografía 10.1), empata o gana en 1, 4 y 7, y en la preferencia a ciegas obtiene al menos el 40 % de los votos frente a Veo Quality. Decide `video-ia-generativa` con el veredicto escrito de `video-control-calidad`.

**Condición legal para la rama A:** `docs/proveedores/google.md` cubre Flow como servicio, pero no nombra Omni 1.2 Flash. Antes de aprobar tomas finales con Omni, `legal-compliance` añade una línea con (a) si Flow lo marca como "preview" o "experimental" y si eso cambia el uso comercial, y (b) si las referencias de personaje o de voz tienen términos propios (D27). La calibración no lo necesita: no lleva personas reales ni datos de clientes. **La referencia de voz de Omni no se usa**: la voz de Santa no se sube a Flow (aprobación de ElevenLabs pendiente y no hace falta: el audio de los clips se descarta).

Créditos de la calibración: **C = real** (anotar en el registro). Estimado para los presupuestos: **300** (2 Veo Quality + 1 Veo Fast + 2 o 3 Omni). Cuenta dentro del tope de 7,000.

### 1.2 Rama A · Omni iguala → Omni para todo

- **Modelo:** Omni 1.2 Flash en los 9 planos y en los dos formatos. Clips de 8 s (no de 15 s) salvo que `c` no dependa de la duración `[verificar en la calibración]`.
- **Entrada:** fotograma inicial F0x y, si la interfaz lo permite a la vez, M1 + M2 + M3 como referencia del personaje "Santa Lumen" (en los planos sin cara, M4 como referencia de manos) `[verificar si Omni acepta fotograma inicial y referencias en la misma tanda; si no, solo fotograma inicial]`.
- **Puerta de insertos:** antes de comprometer los insertos, 2 tomas de V1-03 en Omni. Si la página no queda quieta ≥ 5 s o la mano se deforma, los insertos (V1-02, V1-03, V1-05, V1-09) pasan a la rama B para esos planos (Veo, antes del 3-dic).
- **Ventaja que justifica la rama:** cualquier toma que haya que rehacer después del 5-dic sale del mismo modelo que el resto. En la rama B, una repetición después del 5-dic obliga a mezclar modelos.

Presupuesto según el costo real por clip `c` de Omni:

| Si `c` (créditos por clip) es… | Plan | Clips | Créditos planeados | + C (300) | Reserva hasta el tope | Total máximo |
|---|---|---|---|---|---|---|
| ≤ 60 | **A-total**: Omni en los 9 planos; 6 tomas 9:16 y 4 tomas 16:9 en todos | 54 + 36 = 90 | 90 × `c` | | | ≤ 7,000 |
| ejemplo `c` = 10 | A-total | 90 | 900 | 1,200 | se autoriza 1,000 (resto sin gastar) | 2,200 |
| ejemplo `c` = 20 | A-total | 90 | 1,800 | 2,100 | 1,000 | 3,100 |
| ejemplo `c` = 40 | A-total | 90 | 3,600 | 3,900 | 1,000 | 4,900 |
| ejemplo `c` = 60 | A-total | 90 | 5,400 | 5,700 | 1,000 | 6,700 |
| 61 a 100 | **A-híbrida**: Omni en los 6 planos con cara o "wow" (V1-01, 03, 04, 06, 07, 08) con las tomas del storyboard (6 + 3); Veo 3.1 Fast en V1-02, V1-05, V1-09 (4 + 4) | 54 Omni + 24 Fast | 54 × `c` + 240 | | | |
| ejemplo `c` = 80 | A-híbrida | 78 | 4,560 | 4,860 | 1,000 | 5,860 |
| ejemplo `c` = 100 | A-híbrida | 78 | 5,640 | 5,940 | 1,060 | 7,000 |
| > 100 | Rama A descartada por costo aunque iguale: rama B | | | | | |

Regla de la rama A: la reserva autorizada es 1,000 créditos (o lo que quede hasta 7,000 si es menos). Lo que sobre no se gasta sin decisión de `lider-proyecto`.

### 1.3 Rama B · Omni no iguala → Veo 3.1 Quality en planos héroe, Fast en insertos

Es el plan del storyboard, sin cambios de tomas:

| Plano | Modelo | Tomas 9:16 | Créditos 9:16 | Tomas 16:9 | Créditos 16:9 |
|---|---|---|---|---|---|
| V1-01 | Quality | 6 | 600 | 3 | 300 |
| V1-02 | Fast | 4 | 40 | 4 | 40 |
| V1-03 | Quality | 6 | 600 | 3 | 300 |
| V1-04 | Quality | 6 | 600 | 3 | 300 |
| V1-05 | Fast | 4 | 40 | 4 | 40 |
| V1-06 | Quality | 6 | 600 | 3 | 300 |
| V1-07 | Quality | 6 | 600 | 3 | 300 |
| V1-08 | Quality | 6 | 600 | 3 | 300 |
| V1-09 | Fast | 4 | 40 | 4 | 40 |
| **Total** | 6 Quality + 3 Fast | **48** | **3,720** | **30** | **1,920** |

| Concepto | Créditos |
|---|---|
| Calibración C (estimada) | 300 |
| Planeado (78 clips) | 5,640 |
| **Subtotal** | **5,940** |
| Reserva, en este orden: (1) +2 tomas 9:16 de V1-04 y de V1-07 hasta el límite de 8 intentos (400); (2) pasar un plano Fast a Quality con 3 tomas (300); (3) +3 tomas 16:9 de un plano Quality (300); libre (60) | **1,060** |
| **Tope** | **7,000** |

Si C real pasa de 300, se descuenta del punto "libre" y después del (3). Si un plano no se logra en 8 intentos, no se gasta más: se rediseña con `video-director-creativo` (fotografía 10).

Riesgo propio de la rama B: después del 5-dic no hay Veo. Toda corrección posterior se haría con Omni 1.2 y exige prueba de continuidad con la toma vecina (piel ±5 %, posición de cabeza ±3 %).

### 1.4 Puntos de control de créditos (las dos ramas)

| Después de | Gasto máximo acumulado (rama B) | Si se pasa |
|---|---|---|
| Calibración | 300 | Se descuenta de la reserva |
| V1-04 9:16 + prueba de labios | 900 (+200 si se usaron 2 tomas de reserva) | Alto y revisión con el director |
| V1-07 y V1-08 9:16 | 2,100 | Alto y revisión |
| Todo 9:16 | 4,020 | No se empieza 16:9 sin revisar el saldo |
| Todo 16:9 | 5,940 | Solo reserva |

En la rama A los mismos hitos se recalculan con `c` el día de la decisión y se anotan aquí.

---

## 2. Cómo se opera Flow (reglas para quien genere)

1. **Antes de la primera generación del día de producción:** captura con fecha de la FAQ de Flow y de los términos de Google en `docs/legal/evidencia/` (condición 3 de `google.md`). Comprobar que la marca de agua visible sigue apagada.
2. **Chat de agente:** "confirmar antes de generar" siempre activado. Se le pega la instrucción exacta de este plan; no se le pide "mejorarla". Antes de confirmar se comprueba en la tarjeta de confirmación: modelo y versión, formato (9:16 o 16:9), modo (fotograma inicial / inicial + final / referencias), fijas cargadas, número de salidas y créditos. Si el agente cambió una palabra, se cancela y se vuelve a pegar.
3. **Tandas:** Flow da varias salidas por instrucción; cada salida cobra. 6 tomas = 3 + 3 (en los planos con labios, una tanda por variante de boca A y B); 4 tomas = 4; 3 tomas = 3.
4. **Instrucciones:** se pegan tal cual. Solo se cambian las frases marcadas como intercambiables (formato y variante de boca). Cualquier otro cambio crea una versión nueva (`P-V1-04-v2`) que se anota con su motivo.
5. **Restricciones:** Flow no muestra campo de instrucción negativa en video `[verificar]`. Las prohibiciones críticas ya van dentro de cada instrucción. La lista "Restricciones" de cada plano sirve (a) para el campo negativo si aparece y (b) como lista de revisión. Si aparece el campo, se pega ahí sin cambiar la instrucción.
6. **Audio:** todas las instrucciones piden solo fuego y tono de sala, sin voz ni música. El audio del clip se descarta siempre (sonido 4); pedir "sin voz" es para que el modelo no mueva la boca.
7. **Semillas:** Flow no muestra la semilla `[verificar]`. Si la muestra, se anota. Sin semilla, la consistencia descansa en fija + referencias + instrucción versionada + registro.
8. **Descarga:** la mayor resolución nativa que ofrezca Flow para el modelo (1080p mínimo; anotar si es nativa o escalada) `[verificar opciones de descarga por modelo]`. Para labios se entrega a Sync el archivo descargado, sin recortar ni reescalar (fotografía 6).
9. **Nombres de archivo:** `V1-04_916_A_t03.mp4` (plano, formato, variante, toma). El modelo va en el registro, no en el nombre. Los MP4 finales al cliente salen sin metadatos (`-map_metadata -1`); SynthID sigue en la imagen.

### 2.1 Registro de cada toma

Archivo: `docs/video/jinglo/produccion/registro-tomas.csv` (lo crea quien haga la primera generación). Una fila por salida:

```
toma_id,plano,formato,rama,modelo,version_en_ui,fecha_hora,modo,fija_inicial,fija_final,referencias,instruccion_id,variante_boca,salidas_en_tanda,creditos,saldo_antes,saldo_despues,url_flow,archivo,semilla,veredicto,motivo,cambiar,revisor
V1-04_916_A_t03,V1-04,9:16,B,Veo 3.1 Quality,"Veo 3.1 - Quality",2026-11-14T10:22-06:00,inicial+final,F04,F04-fin,,P-V1-04-v1,A,3,100,9450,9150,https://...,V1-04_916_A_t03.mp4,,REPETIR,"lente refleja sobre ojo izquierdo (fot. 6.5)","bajar brillo de la vela camera-right",video-fotografia-iluminacion
```

`veredicto` usa solo `APROBADA` o `REPETIR` (fotografía 10.4). El costo real del video base sale de sumar `creditos` (sección 10).

---

## 3. Bloques fijos (se copian tal cual)

Las instrucciones de las secciones 4 y 5 ya los llevan expandidos. Se listan aquí para auditar que no cambien.

**[MASTER-A]** · descripción maestra de arte 1.9 con las dos frases enmendadas de la biblia 3:
```
Santa Lumen: a tall, broad-shouldered man of about 70 with a firm round belly, weathered fair skin with natural ruddy cheeks, deep forehead lines and crow's feet. Wide square face, broad nose with a slightly crooked bridge to the right, dark hazel-brown eyes, thick white eyebrows with the left one slightly higher, a small light-brown mole on the left cheekbone. Warm silver-white beard (#E4DFD3), thick, wavy, reaching mid-chest, splitting into two or three tufts, with a full moustache neatly trimmed just above the upper lip so both lips stay clearly visible, its ends drooping softly past the corners of the mouth. Silver-white hair swept back, covering the tops of the ears, one loose lock over the right of the forehead. Thin oval brass reading glasses with aged patina and clear non-reflective lenses, resting low on the nose. No hat indoors. Large square working hands with a faint sepia ink stain on right thumb and index finger and a plain worn brass ring on the right ring finger. Knee-length coat of thick boiled wool in deep brick red (#8E1B24), cream natural sheepskin-wool trim (#E9E1CF) on cuffs, front edge and hem, five turned walnut wood buttons, wide dark brown vegetable-tanned leather belt with a plain rectangular aged brass buckle. Linen shirt and dark forest-green wool waistcoat underneath. Calm, warm, kind expression. Photoreal, filmic skin texture, no plastic, no CGI look.
```

**[MASTER-MANOS]** · solo para planos sin cara. Decisión técnica de este plan: en un inserto de manos, la descripción completa del rostro invita al modelo a mostrar la cara y la boca. Se usa el subconjunto de manos y vestuario de arte 1.6 y 1.7, sin parafrasear los rasgos:
```
Santa's hands: large square weathered working hands of a man of about 70, thick fingers, visible knuckles, veins and age spots, short clean nails, exactly five fingers on each hand, no gloves, a faint sepia ink stain on the right thumb and index finger and a plain worn brass ring on the right ring finger. Sleeves of a knee-length coat of thick boiled wool in deep brick red (#8E1B24) with cream natural sheepskin-wool trim (#E9E1CF) on the cuffs, a linen shirt cuff just visible.
```

**[LIBRO]** · arte 3.1 y 3.2:
```
a very large antique book, 38 by 52 cm and 9 cm thick, with a dark forest-green grained leather cover (#25382E), scuffed edges, aged brass corners and clasp, a blind-embossed eight-pointed star inside a compass in the center of the cover with no letters, a faded red silk ribbon (#7A2A2E), worn gilt page edges, and thick cream cotton-rag paper (#EFE4CC) with visible fibers and very faint pencil guide lines
```

**[LOOK]** · fotografía 3:
```
cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting, soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, subtle halation around candle flames, natural skin texture with visible pores and fine wrinkles, subsurface scattering on ears and nose, no beauty filter, no skin smoothing, 180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation
```

**[LUZ-CARA]** · fotografía P3 y sección 6, sin guirnaldas ni sombrero:
```
Lighting: a large soft warm tungsten key light from the fireplace camera-left, 35 to 45 degrees off axis and slightly above eye level; warm bounce fill from the oil lamp and candle camera-right, about one stop darker; a faint cool blue rim light from the snow window behind him camera-right, only on the edges of his hair, beard and shoulder; mouth and lips evenly lit, no shadow under the moustache, no hard shadows on the face; catchlights in both eyes, one large and warm, one small and blue; the firelight flicker on his face is almost imperceptible. Background: the study softly out of focus, creamy bokeh of candle flames and brass, a warm fireplace glow at the left edge of frame and a faint blue window glow at the right edge.
```

**[AUDIO]**:
```
Audio: only the soft crackle of a low fire and quiet room tone. No music, no dialogue, no voice.
```

**Frases intercambiables de formato** (la única parte que cambia entre 9:16 y 16:9; la instrucción trae la de 9:16):

| Tipo de plano | 9:16 (viene en la instrucción) | 16:9 (reemplaza la frase anterior) |
|---|---|---|
| Cara (V1-04, 06, 07, 08) | `Vertical 9:16 frame, Santa centered.` | `Horizontal 16:9 frame; Santa stays in the central third of the frame, the warm fireplace glow fills the left side and the blue snowy window the right side, both softly out of focus.` |
| General (V1-01) | `Vertical 9:16 frame: the beams at the top, Santa and the desk in the lower center, the fireplace glow on the left edge and blue window light on the right edge.` | `Horizontal 16:9 frame: Santa and the desk in the central third, the whole stone fireplace on the left side and the whole snowy window on the right side.` |
| Insertos (V1-02, 03, 05, 09) | `Vertical 9:16 frame.` | `Horizontal 16:9 frame; the subject stays centered in the middle third and the dark oak desk fills both sides.` (V1-03: la página al 45 % del ancho, centrada) |

---

## 4. Imágenes fijas (Nano Banana Pro, 0 créditos)

Formato 9:16 de 2160 px de alto o más; 16:9 de 3840 px de ancho o más `[verificar la resolución máxima de Nano Banana Pro en Flow]`. Cada fija la aprueban por escrito `video-fotografia-iluminacion` y `video-direccion-arte` (12 puntos, sin texto, sin plástico, luz de la biblia 4, cinco dedos); `video-control-calidad` tiene veto sobre M1. Sin límite de intentos: se itera hasta aprobar. Nunca se sube una foto de una persona real ni de un niño.

**Regla de consistencia:** las fijas que deben empatar entre sí se hacen **editando** la anterior, no generando de cero: F04 sale de M1; F03 sale de M6; F05 sale de M10; F09-fin sale de F09. Así la placa limpia y el fotograma de arranque comparten página, luz y encuadre.

### 4.1 Mapa de fijas

| Fija | Qué es | Se hace a partir de | Sirve para |
|---|---|---|---|
| M1 | Santa frente (maestra) | **B1** (elección de Juan) + auditoría | Referencia de todo; F07, F08, F04-fin |
| M1-SL | M1 sin lentes (contingencia, decisión c) | edición de M1 | Solo si salta el corte de lentes |
| M2 | Tres cuartos | M1 como referencia | Referencia de personaje (Omni) |
| M3 | Perfil | M1 como referencia | Referencia de personaje (Omni) |
| M4 | Manos | M1 como referencia de vestuario | Referencia de manos |
| M5 / M5b | Estudio general 16:9 / 9:16 | M1 como referencia | F01 |
| M6 | Libro cenital, placa limpia | de cero | F03-fin; placa para componer el nombre |
| M6b = F03 | Libro con mano | edición de M6 | V1-03 inicial |
| M9 = F02 | Sobre el hombro | M1 y M4 como referencia | V1-02 inicial |
| M10 = F05-fin | Carta abierta sobre el escritorio | de cero | V1-05 final |
| F05 | Mano con la carta doblada | edición de M10 | V1-05 inicial |
| M11 = F06 | Ojos sobre el libro cerrado | M1 como referencia | V1-06 inicial |
| M12 = F09 | Manos sobre el libro cerrado, 40° | M4 como referencia | V1-09 inicial |
| F09-fin | El mismo libro sin manos | edición de F09 | V1-09 final |
| F01 | Estudio con libro cerrado y cabeza baja | edición de M5b | V1-01 inicial |
| F04 | M1 con la cabeza baja hacia el libro | edición de M1 | V1-04 inicial |
| F04-fin = F07 = F08 | M1 con sonrisa de boca cerrada | M1 (o edición mínima) | V1-04 final; V1-07 y V1-08 inicial y final |
| Fxx-169 | Cada fija extendida a 16:9 | edición de su 9:16 | Versiones 16:9 |
| Fxx-SL | F04, F06, F07 sin lentes | edición | Contingencia de lentes |

### 4.2 Instrucciones de las fijas

**M1 · auditoría de B1.** Se aprueba B1 tal cual si cumple los 12 puntos y además: los dos labios visibles bajo el bigote, lentes sin reflejo sobre los ojos, ojos al 38-40 % del alto, boca al 46-48 %, cara frontal, sonrisa de boca cerrada. Si falla bigote o lentes, se edita:
```
Edit this image. Change only two things: trim the moustache so it sits neatly just above the upper lip and both lips are clearly visible, its ends drooping softly past the corners of the mouth; make the glasses thin oval brass reading glasses with clear non-reflective lenses resting low on the nose, with no reflection over the eyes. Keep everything else exactly identical: the face, the mole on his left cheekbone, the eyes, eyebrows, beard, hair, coat, lighting, background and framing. No text anywhere.
```

**M1-SL / Fxx-SL · sin lentes (contingencia):**
```
Edit this image. Remove the glasses from his face completely, leaving natural skin and the same eyes underneath, with no marks on the nose. If the desk is visible, place the thin oval brass reading glasses folded on the desk next to the book. Keep everything else exactly identical. No text anywhere.
```

**M2 · tres cuartos** (arte 5.2, con M1 como referencia de identidad):
```
Use the reference image as the exact identity of this man: same face, mole, beard, moustache, glasses, coat and lighting. [MASTER-A] Three-quarter view from Santa's left side (the camera sees his left cheek with the small mole), shoulders turned 35 degrees, eyes looking slightly down at an open book out of frame, gentle closed-mouth smile. Seated in his study at night: warm firelight from camera-left, faint blue window light from behind him camera-right. Medium close-up, 85mm, shallow depth of field, cinematic film still. The beard falls in a soft V, the glasses sit low on the nose. No text, no logos, no letters anywhere.
```

**M3 · perfil** (arte 5.3):
```
Use the reference image as the exact identity of this man. [MASTER-A] Pure side profile facing right, chest up, slightly lowered gaze. Show the crooked nose bridge, the trimmed moustache above the upper lip, the beard line to mid-chest, warm fire rim light on the beard edges, deep brown softly out-of-focus study background. 85mm film still, natural skin texture. No hat. No text anywhere.
```

**M4 · manos** (arte 5.4, sin cambios de contenido):
```
Close-up of two large weathered male hands of a 70-year-old man resting on an aged oak desk: faint sepia ink stain on the right thumb and index finger, a plain worn brass ring on the right ring finger, short clean nails, visible veins and age spots, cuffs of a deep brick red boiled-wool coat (#8E1B24) with cream natural wool trim (#E9E1CF), a fine linen shirt cuff visible. The right index finger rests lightly on the edge of an old paper page. Soft warm candle and fire light, shallow depth of field, 100mm macro, cinematic film still. Exactly five fingers on each hand, natural proportions, no gloves. No text anywhere.
```

**M5b · estudio general 9:16** (arte 5.5 corregido por la biblia: sin nacimiento, la taza no se nombra como bebida, chimenea a camera-left, ventana detrás a camera-right, escritorio de frente, sin gorro a la vista):
```
Use the reference image as the exact identity of Santa. Wide establishing shot of a hand-built Santa's study at night, vertical 9:16. Smoked pine beams overhead. A river-stone fireplace with a low steady fire on the left wall, at the left edge of the frame (camera-left), with its warm glow; a worn brown leather armchair with a grey wool blanket near it. Behind Santa, on the back wall to the right (camera-right), a large old multi-pane window with soft blue-grey snow falling outside, and a low bookshelf with books with blank spines. In the lower center, an aged oak desk facing the camera with scratches and ink marks; Santa Lumen sits behind it facing the camera, small in the frame. On the desk: a very large closed dark forest-green leather book with brass corners in the center, a brass candlestick with a lit beeswax candle, a brass oil lamp, a green glass inkwell with a quill, a stack of letters tied with linen thread, a terracotta-and-green glazed clay mug with gentle steam and a cinnamon stick on the left corner, and a banana-leaf-wrapped tamal tied with string on a white enamel plate with a blue rim on the right corner. Color palette: smoke brown, honey oak, warm stone grey, tobacco leather, forest green, aged brass, cream paper, ember orange, cold blue-grey snow. Warm firelight and candlelight, soft blue window light, 24mm, camera at a child's eye height, medium depth of field, cinematic film still, natural textures. No text, no logos, no letters anywhere, no electric lights, no garlands, no Christmas tree, no flags, no hat in view.
```
**M5 (16:9):** la misma instrucción cambiando `vertical 9:16` por `horizontal 16:9, the whole fireplace on the left third and the whole window on the right third, Santa and the desk in the central third`.

**F01 · libro cerrado, cabeza baja** (edición de M5b):
```
Edit this image. Santa lowers his head toward the large closed book in front of him, both hands resting flat on its cover; his face is turned down so his mouth is hidden by the beard and the angle. Keep the room, the light, the objects on the desk, the window, the fireplace and the framing exactly identical. No text anywhere.
```

**M6 · libro cenital, placa limpia** (arte 5.6, tal cual):
```
Top-down view, camera at 85 degrees directly above the right-hand page of a very large antique book lying open on an aged oak desk. The right page is cream cotton-rag paper (#EFE4CC) with visible fibers, uneven slightly darker edges (#D9C9A6), very faint pencil guide lines spaced evenly, a 2.5 cm margin, and a small gold dot in the left margin at about 41 percent of the page height. The page is almost flat, lit with soft even warm light with no hard shadows. The left page next to it shows only abstract blurred horizontal ink strokes, no readable letters. A faded red silk ribbon (#7A2A2E) lies in the gutter. Dark forest-green leather cover (#25382E) with aged brass corners visible at the page edges. Right page fills 84 percent of the frame width, perfectly upright (top of the page is top of the frame). Candlestick and inkwell softly out of focus at the top edge. Shallow depth of field only on the periphery, the page itself sharp. Photoreal film still, 50mm. The area at 37 to 46 percent of the page height, 14 to 86 percent of the page width, is completely empty, blank paper.
```

**F03 = M6b · con mano** (edición de M6):
```
Edit this image. Add Santa's right hand entering from the left edge of the frame: a large weathered hand with a faint sepia ink stain on the index finger and thumb, a plain worn brass ring on the ring finger, a deep brick red boiled-wool cuff with cream wool trim; the index finger rests on the left margin just above the gold dot, pointing down the margin. Exactly five fingers. The hand, the finger and their shadows stay completely outside the empty central area of the page (37 to 46 percent of the page height, 14 to 86 percent of the width) plus a small safety margin. Keep the page, the book, the light and the framing exactly identical. No text anywhere.
```
Nota: el dedo arranca **arriba** del punto y baja hasta debajo-izquierda de la línea 11 durante el clip; el fotograma final es M6 (sin mano).

**M9 = F02 · sobre el hombro** (fotografía S1 corregida: lana, no terciopelo):
```
Use the reference images for Santa's coat, hair and hands. Over-the-shoulder shot from behind Santa's left shoulder, vertical 9:16. In the foreground, out of focus: the shoulder of a deep brick red (#8E1B24) thick boiled-wool coat and a little of his warm silver-white hair. In sharp focus beyond it: a very large antique book open on an oak desk, thick cream cotton-rag pages (#EFE4CC); the written pages show only soft blurred abstract horizontal strokes, never letters. His bare left hand rests on the edge of the right page, ready to turn it: large, weathered, visible knuckles and veins, exactly five fingers, cream wool cuff. His face and mouth are not visible at all. A warm fireplace glow in the background at the right of the frame, soft out of focus; oil lamp light on the pages from above. 50mm, shallow depth of field, cinematic film still, matte paper with no glare. No text, no letters anywhere.
```

**M10 = F05-fin · carta abierta:**
```
Top-down view, camera directly above an aged oak desk beside the edge of a very large dark forest-green leather book with brass corners. In the center, a single sheet of cream paper lies open and flat, with a soft fold line across the middle, faint empty ruled lines and no writing at all, and a small wobbly yellow crayon star drawn by a child in the top corner. The letter fills about 70 percent of the frame width, centered and upright. Soft even warm light from an oil lamp above camera-right, a gentle fireplace glow from the side, no hard shadows on the letter, no glare. 50mm, the paper sharp, the wood softly falling off at the edges, photoreal film still. No text, no letters, no numbers, no logos anywhere.
```

**F05 · mano con la carta doblada** (edición de M10):
```
Edit this image. Replace the open letter with the same cream letter folded in half, held by Santa's bare weathered right hand about 10 cm above the center of the desk, about to set it down: faint sepia ink stain on the index finger and thumb, a plain worn brass ring on the ring finger, deep brick red boiled-wool cuff with cream wool trim, exactly five fingers. The yellow crayon star is visible on the outside corner. Keep the desk, the book edge, the light and the framing exactly identical. No text anywhere.
```

**M11 = F06 · ojos sobre el libro cerrado** (fotografía S3 corregida: sin sombrero, libro cerrado):
```
Use the reference image as the exact identity of this man. [MASTER-A] Medium close-up from the chest up, vertical 9:16, 85mm, camera at a child's eye height. He holds a very large closed book upright in front of him with both hands, the dark forest-green grained leather cover (#25382E) with aged brass corners and a blind-embossed eight-pointed star inside a compass facing the camera, with no letters. The top edge of the book covers his mouth and beard up to the tip of his nose. Above it, his dark hazel-brown eyes smile warmly into the lens over his low brass reading glasses, deep crow's feet, playful and kind. Large soft warm key light from the fireplace camera-left on his eyes with catchlights in both eyes; the book casts a soft gentle shadow on the lower face; faint blue rim from the window behind him camera-right; creamy candle bokeh behind. Cinematic film still, natural skin texture. No hat. No text anywhere.
```

**M12 = F09 · manos sobre el libro cerrado:**
```
Close shot from 40 degrees above an aged oak desk, vertical 9:16, 85mm, shallow depth of field. A very large closed antique book with a dark forest-green grained leather cover (#25382E), aged brass corners and clasp, and a blind-embossed eight-pointed star inside a compass in the center with no letters, centered in the frame. Santa's two bare weathered hands rest flat on the cover, one on each side of the emblem: large square working hands, visible knuckles, veins and age spots, exactly five fingers on each hand, a faint sepia ink stain on the right thumb and index finger, a plain worn brass ring on the right ring finger, deep brick red boiled-wool cuffs with cream wool trim. A lit beeswax candle softly out of focus at the top right glints on the brass corners. Warm fireplace light from camera-left, oil lamp fill from camera-right; the skin of the hands has the same warm tone as his face. The bottom 15 percent of the frame is calm dark wood. Cinematic film still. No text anywhere.
```

**F09-fin · sin manos** (edición de F09):
```
Edit this image. Remove both hands and sleeves completely; the closed book rests alone on the desk, with the leather cover continuing naturally where the hands were. Keep the book, the emblem, the candle, the light and the framing exactly identical. No text anywhere.
```

**F04 · cabeza baja** (edición de M1):
```
Edit this image. Same man, same seat, same light, same background and framing. Change only his pose: his head is tilted down about 20 degrees and his eyes look down at an open book just below the bottom of the frame, mouth gently closed, calm expression. The glasses stay low on the nose with no reflection. Nothing in front of his face. No text anywhere.
```

**F04-fin = F07 = F08:** M1 aprobada, con sonrisa de boca cerrada y mejillas arriba. Si M1 sonríe con los labios abiertos, se edita:
```
Edit this image. Change only the mouth: a warm, relaxed closed-mouth smile with both lips visible and the cheeks lifted. Keep everything else exactly identical. No text anywhere.
```

**Fxx-169 · extensión a 16:9** (cada fija aprobada):
```
Extend this image to a horizontal 16:9 frame. Keep the existing image exactly as it is in the center. On the left, continue the study toward the river-stone fireplace with its low warm fire; on the right, continue toward the old multi-pane window with blue-grey snow outside. Match the light direction, lens, depth of field, color and grain exactly. Add no people, no objects in front of the subject, no garlands, no text.
```
Control: se superpone la columna central (31,6 % del ancho) sobre la 9:16 aprobada. Si Nano Banana redibujó la cara o la página (diferencia visible al 100 %), se vuelve a pegar el centro original con un borde difuminado de 40 px antes de usarla como fotograma inicial. En los insertos, los lados son madera del escritorio, no chimenea ni ventana.

---

## 5. Tomas plano por plano

Común a todas las tomas: clip de 8 s, se recorta en edición; audio descartado; aprobadas con fotografía 10.1 (descarte inmediato), los 12 puntos de la biblia, Flow sin marca visible y con SynthID intacto. "Modo" se refiere a Flow: **inicial** = fotograma de arranque; **inicial + final** = fotograma de arranque y de llegada `[verificar que Veo 3.1 Quality, Fast y Omni 1.2 admitan fotograma final en 9:16; si un modelo no lo admite, solo inicial y se refuerza la descripción del final]`.

**Controles automáticos locales** (sin proveedor; script de `video-control-calidad`, corren sobre cada toma antes de la revisión humana):
- Texto: OCR sobre 1 fotograma por segundo en libro, carta y emblema → 0 caracteres con confianza > 60 %.
- Cara (V1-04, 06, 07, 08): giro de cabeza ≤ 10° y deriva de posición ≤ 3 % con malla facial; parpadeo de luminancia en la cara < 5 %.
- Página y carta (V1-03, V1-05): SSIM ≥ 0,98 entre fotogramas en la caja reservada durante el tramo quieto; deriva ≤ 1 %; parpadeo < 3 %.

### 5.1 V1-01 · Plano general: Santa abre el libro

| Campo | Valor |
|---|---|
| Duración final | 7 s (clip 0,5–7,5 s). G1 usa el tramo 0,5–4,5 s |
| Tipo | FIJO |
| Modelo | A: Omni 1.2 Flash · B: Veo 3.1 Quality |
| Créditos | A: 10 clips × `c` (A-total) o 9 × `c` (A-híbrida) · B: 600 + 300 |
| Modo | Inicial: **F01** (16:9: F01-169). Omni: referencias M1, M2, M3 |
| Tomas | B: 6 (9:16) + 3 (16:9) · A-total: 6 + 4 |

Instrucción `P-V1-01-v1`:
```
An 8-second wide establishing shot of Santa Lumen's study at night. Santa Lumen: a tall, broad-shouldered man of about 70 with a firm round belly, weathered fair skin with natural ruddy cheeks, deep forehead lines and crow's feet. Wide square face, broad nose with a slightly crooked bridge to the right, dark hazel-brown eyes, thick white eyebrows with the left one slightly higher, a small light-brown mole on the left cheekbone. Warm silver-white beard (#E4DFD3), thick, wavy, reaching mid-chest, splitting into two or three tufts, with a full moustache neatly trimmed just above the upper lip so both lips stay clearly visible, its ends drooping softly past the corners of the mouth. Silver-white hair swept back, covering the tops of the ears, one loose lock over the right of the forehead. Thin oval brass reading glasses with aged patina and clear non-reflective lenses, resting low on the nose. No hat indoors. Large square working hands with a faint sepia ink stain on right thumb and index finger and a plain worn brass ring on the right ring finger. Knee-length coat of thick boiled wool in deep brick red (#8E1B24), cream natural sheepskin-wool trim (#E9E1CF) on cuffs, front edge and hem, five turned walnut wood buttons, wide dark brown vegetable-tanned leather belt with a plain rectangular aged brass buckle. Linen shirt and dark forest-green wool waistcoat underneath. Calm, warm, kind expression. Photoreal, filmic skin texture, no plastic, no CGI look.
He sits behind an aged oak desk facing the camera, small in the frame, head lowered toward a very large closed book with a dark forest-green leather cover and aged brass corners. Timing: from 0 to 0.5 seconds both his hands rest on the closed cover; from 0.5 to 4 seconds he slowly opens the heavy cover with both hands and lays it open; from 4 to 8 seconds he looks down at the open pages, calm and still. His face stays lowered and small in the frame the whole time; he does not speak. The pages show only blurred abstract strokes, no letters.
The room: smoked pine beams overhead; a river-stone fireplace with a low steady fire at the left edge of the frame (camera-left); an old multi-pane window behind him at the right (camera-right) with blue-grey snow softly falling outside; on the desk a brass candlestick with a lit beeswax candle, a brass oil lamp, a green glass inkwell with a quill, a terracotta-and-green glazed clay mug with gentle rising steam and a cinnamon stick, and a banana-leaf-wrapped tamal tied with string on a white enamel plate with a blue rim. Only wood, stone, leather, wool, brass and rag paper; no electric lights, no garlands, no Christmas tree, no readable text or letters anywhere.
Camera: a very slow straight dolly-in of about 3 percent over the whole shot, 24mm lens, camera at a child's eye height, medium depth of field so the room reads.
Lighting: warm firelight from camera-left as the main light, cool blue snow light through the window behind him camera-right, the candle and oil lamp as small warm accents on the desk; never light from below.
Style: cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting, soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, subtle halation around candle flames, natural skin texture with visible pores and fine wrinkles, subsurface scattering on ears and nose, no beauty filter, no skin smoothing, 180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation.
Vertical 9:16 frame: the beams at the top, Santa and the desk in the lower center, the fireplace glow on the left edge and blue window light on the right edge.
Audio: only the soft crackle of a low fire and quiet room tone. No music, no dialogue, no voice.
```
Restricciones: `speech, open mouth, laughing face, hat, letters on the cover or pages, warped book cover, extra fingers, garlands, Christmas tree, electric lights, nativity scene, bright saturated red, white fluffy fur, plastic, CGI, cartoon, handheld shake, fast zoom, pan`.
Aprobada si: cumple fotografía 10.2 P1 (chimenea, ventana y velas donde dice el mapa); abrigo, barba, lentes y "sin gorro" legibles a esa escala; la tapa abre sin deformarse y sin letras; la boca no se distingue en ningún fotograma; la columna central del 16:9 contiene a Santa y al escritorio; el tramo 0,5–4,5 s sirve solo para G1.

### 5.2 V1-02 · Sobre el hombro: pasa páginas

| Campo | Valor |
|---|---|
| Duración final | 6 s |
| Tipo | FIJO |
| Modelo | A: Omni 1.2 Flash (A-total) o Veo 3.1 Fast (A-híbrida) · B: Veo 3.1 Fast |
| Créditos | B: 40 + 40 · A-total: 10 × `c` · A-híbrida: 80 |
| Modo | Inicial: **F02** (= M9). Omni: referencias M4 y M1 (pelo y abrigo) |
| Tomas | B y A-híbrida: 4 + 4 · A-total: 6 + 4 |

Instrucción `P-V1-02-v1`:
```
An 8-second over-the-shoulder shot from behind Santa's left shoulder, looking down at a very large antique book open on an aged oak desk at night. In the foreground, out of focus: the shoulder of a knee-length coat of thick boiled wool in deep brick red (#8E1B24) and a little of his warm silver-white hair. In sharp focus beyond it: the open book with thick cream cotton-rag pages (#EFE4CC) with visible fibers and very faint pencil guide lines; the written pages show only soft blurred abstract horizontal strokes, never letters. Santa's hands: large square weathered working hands of a man of about 70, thick fingers, visible knuckles, veins and age spots, short clean nails, exactly five fingers on each hand, no gloves, a faint sepia ink stain on the right thumb and index finger and a plain worn brass ring on the right ring finger. Sleeves of a knee-length coat of thick boiled wool in deep brick red (#8E1B24) with cream natural sheepskin-wool trim (#E9E1CF) on the cuffs, a linen shirt cuff just visible.
Action: his bare left hand slowly turns two thick pages, one at a time, with calm unhurried movements, about two seconds per page; each page bends and settles like heavy paper. His face and mouth are never visible.
Background: a warm fireplace glow at the right of the frame, softly out of focus.
Camera: locked-off static camera, 50mm lens, shallow depth of field, camera at a child's eye height.
Lighting: the fireplace as a warm side backlight over his shoulder; the oil lamp lights the pages softly from above; matte paper with no glare.
Style: cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting, soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, subtle halation around candle flames, natural skin texture with visible pores and fine wrinkles, no beauty filter, no skin smoothing, 180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation.
Vertical 9:16 frame.
Audio: only the soft crackle of a low fire and quiet room tone. No music, no dialogue, no voice.
```
Restricciones: `letters, words, numbers, pseudo-text on pages, face, profile, mouth, gloves, extra fingers, fused fingers, paper that stretches or melts, fast page flipping, velvet, glossy fabric, plastic hair`.
Aprobada si: cero letras o pseudoletras; las páginas se doblan como papel grueso; mano de cinco dedos y sin guante en todos los fotogramas; no se ve el perfil ni la boca. Si el pelo o la lana se ven de plástico en las 4 tomas Fast, pasa a Quality con la reserva (rama B, punto 2).

### 5.3 V1-03 · Cenital: el dedo encuentra la línea (momento "wow")

| Campo | Valor |
|---|---|
| Duración final | 7 s (clip 0,0–7,0 s). G2 usa el tramo 0,0–5,5 s |
| Tipo | PERS-OFF + COMP |
| Modelo | A: Omni 1.2 Flash (tras la puerta de insertos, sección 1.2) · B: Veo 3.1 Quality |
| Créditos | B: 600 + 300 · A: 10 × `c` (A-total) o 9 × `c` (A-híbrida) |
| Modo | Inicial + final: **F03** → **M6** (placa limpia). 16:9: F03-169 → M6-169 |
| Tomas | B: 6 + 3 · A-total: 6 + 4 |

Instrucción `P-V1-03-v1`:
```
An 8-second top-down overhead shot, the camera directly above the right-hand page of a very large antique book lying open and flat on an aged oak desk at night. The page is thick cream cotton-rag paper (#EFE4CC) with visible fibers, uneven slightly darker edges (#D9C9A6), very faint evenly spaced pencil guide lines, a 2.5 cm margin, and a small gold dot in the left margin at the eleventh guide line, about 41 percent down the page. The page is upright in the frame, top of the page at the top of the frame, and fills about 84 percent of the frame width. The left page edge shows only blurred abstract ink strokes. A faded red silk ribbon lies in the gutter.
Santa's hand: a large square weathered working hand of a man of about 70, visible knuckles and veins, exactly five fingers, no glove, a faint sepia ink stain on the index finger and thumb, a plain worn brass ring on the ring finger, the cuff of a deep brick red (#8E1B24) boiled-wool coat with cream natural wool trim (#E9E1CF).
Timing: from 0 to 2.3 seconds his right index finger slides slowly down the left margin and stops just below and to the left of the eleventh guide line, never crossing into the middle of the page. From 2.3 to 3 seconds the hand withdraws and leaves the frame to the left. From 3 to 8 seconds the page stays perfectly still and empty; nothing moves. The middle of the page, from 37 to 46 percent of its height and from 14 to 86 percent of its width, stays blank paper with no hand, no finger and no shadow at every moment.
Camera: locked-off, 50mm lens, no camera movement at all.
Lighting: soft even warm lamplight from above, no cast shadows, no glare, no flicker on the paper.
Style: cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting, soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, natural skin texture with visible pores and fine wrinkles, 180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation.
Vertical 9:16 frame.
Audio: only quiet room tone and the faint sound of a fingertip on paper. No music, no dialogue, no voice.
```
Restricciones: `any text, letters, writing, handwriting, numbers, symbols, ink appearing on the page, gloves, extra fingers, hand or shadow over the center of the page, page curl, page movement after the hand leaves, camera drift, zoom, flicker, glare, tilted page`.
Aprobada si: cumple fotografía P4 (≥ 5 s de página quieta, deriva ≤ 1 % medida con el control automático); desde 1,7 s ninguna parte de la mano ni de su sombra entra en la caja ni en su margen del 3 %; cinco dedos; ninguna letra generada; el último fotograma empata con M6 (si difiere, se compone el nombre sobre M6 reencuadrado al último fotograma); el dorado compuesto pasa la prueba "parece escrito, no pegado" con 3 personas.

### 5.4 V1-04 · Santa levanta la vista: "¡Hola, {nombre}!" (primer plano que se produce)

| Campo | Valor |
|---|---|
| Duración final | 7 s |
| Tipo | PERS-LABIOS (Sync en el tramo 1,4–5,1 s del clip) |
| Modelo | A: Omni 1.2 Flash · B: Veo 3.1 Quality |
| Créditos | B: 600 + 300 (+200 de reserva) · A: 10 × `c` |
| Modo | Inicial + final: **F04** → **F04-fin** (M1 con sonrisa cerrada). 16:9: F04-169 → F04-fin-169. Omni: referencias M1, M2, M3 |
| Tomas | 9:16: 3 con boca A + 3 con boca B. 16:9 (B: 3, A-total: 4): solo la variante que gane la prueba de labios |

Instrucción `P-V1-04-v1` (trae la boca A; para la B se reemplazan las dos frases marcadas abajo):
```
An 8-second medium close-up, chest up, of Santa Lumen seated behind his oak desk in his study at night. Santa Lumen: a tall, broad-shouldered man of about 70 with a firm round belly, weathered fair skin with natural ruddy cheeks, deep forehead lines and crow's feet. Wide square face, broad nose with a slightly crooked bridge to the right, dark hazel-brown eyes, thick white eyebrows with the left one slightly higher, a small light-brown mole on the left cheekbone. Warm silver-white beard (#E4DFD3), thick, wavy, reaching mid-chest, splitting into two or three tufts, with a full moustache neatly trimmed just above the upper lip so both lips stay clearly visible, its ends drooping softly past the corners of the mouth. Silver-white hair swept back, covering the tops of the ears, one loose lock over the right of the forehead. Thin oval brass reading glasses with aged patina and clear non-reflective lenses, resting low on the nose. No hat indoors. Large square working hands with a faint sepia ink stain on right thumb and index finger and a plain worn brass ring on the right ring finger. Knee-length coat of thick boiled wool in deep brick red (#8E1B24), cream natural sheepskin-wool trim (#E9E1CF) on cuffs, front edge and hem, five turned walnut wood buttons, wide dark brown vegetable-tanned leather belt with a plain rectangular aged brass buckle. Linen shirt and dark forest-green wool waistcoat underneath. Calm, warm, kind expression. Photoreal, filmic skin texture, no plastic, no CGI look.
Timing: from 0 to 1.3 seconds he is looking down at an open book below the frame, then slowly raises his head and eyes until he looks straight into the lens. From 1.3 to 1.7 seconds, a warm closed-mouth smile of recognition, cheeks lifting. From 1.7 to 4.8 seconds, his lips stay gently closed in a relaxed smile and he breathes softly through his nose. From 4.8 to 8 seconds, a calm warm closed-mouth smile with the cheeks up and one natural blink, his gaze resting on the lens. After he looks up, his head stays level, frontal and still. His hands stay below the frame and nothing passes in front of his face. He does not speak.
Camera: locked-off static camera on a tripod, 85mm portrait lens, f/2 shallow depth of field, camera at a child's eye height just below his eye line, his eyes at about 40 percent from the top of the frame.
Lighting: a large soft warm tungsten key light from the fireplace camera-left, 35 to 45 degrees off axis and slightly above eye level; warm bounce fill from the oil lamp and candle camera-right, about one stop darker; a faint cool blue rim light from the snow window behind him camera-right, only on the edges of his hair, beard and shoulder; mouth and lips evenly lit, no shadow under the moustache, no hard shadows on the face; catchlights in both eyes, one large and warm, one small and blue; the firelight flicker on his face is almost imperceptible. Background: the study softly out of focus, creamy bokeh of candle flames and brass, a warm fireplace glow at the left edge of frame and a faint blue window glow at the right edge.
Style: cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting, soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, subtle halation around candle flames, natural skin texture with visible pores and fine wrinkles, subsurface scattering on ears and nose, no beauty filter, no skin smoothing, 180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation.
Vertical 9:16 frame, Santa centered.
Audio: only the soft crackle of a low fire and quiet room tone. No music, no dialogue, no voice.
```
Variante de boca B (reemplaza dos frases):
- `From 1.7 to 4.8 seconds, his lips stay gently closed in a relaxed smile and he breathes softly through his nose.` → `From 1.7 to 4.8 seconds, his lips part slightly and move softly and neutrally, as if quietly humming to himself, with small natural jaw motion and no clear words.`
- `He does not speak.` → `He makes no audible sound.`

Restricciones: `speech, words, laughing, open-mouth grin, teeth-baring smile, head turn, nodding, tilting the head down after looking up, hand near the face, steam or flame in front of the face, reflections on the glasses, distorted glasses, moustache covering the upper lip, hat, light from below, strobing flicker, waxy skin, plastic skin, beauty filter, CGI look, rack focus, zoom, handheld shake`.
Aprobada si: cumple fotografía sección 6 (1 a 13) y la prueba de cera; la mirada llega al lente hacia 1,3 s y se queda; lentes sin reflejo sobre los ojos ni deformación; labio superior visible; la calma de 4,8–7,0 s tiene boca cerrada, mínimo 2,0 s; la sincronización con "Ana", "Xiomara" y "María Fernanda" no deja máscara alrededor de la boca (sección 7).
**Corte de lentes (decisión c):** si 3 de estas 6 primeras tomas deforman los lentes o reflejan sobre los ojos, se pasa a las fijas `-SL` en **todo** el piloto antes de seguir; la toma con lentes no se mezcla con planos sin lentes.

### 5.5 V1-05 · La carta de la familia

| Campo | Valor |
|---|---|
| Duración final | 8 s (se usa casi todo el clip; la carta debe estar quieta de 2 a 8 s) |
| Tipo | PERS-OFF + COMP (logro escrito en la carta desde 0:29,2) |
| Modelo | A: Omni 1.2 Flash (A-total) o Veo 3.1 Fast (A-híbrida) · B: Veo 3.1 Fast |
| Créditos | B: 40 + 40 · A-total: 10 × `c` · A-híbrida: 80 |
| Modo | Inicial + final: **F05** → **M10**. Omni: referencia M4 |
| Tomas | B y A-híbrida: 4 + 4 · A-total: 6 + 4 |

Instrucción `P-V1-05-v1`:
```
An 8-second top-down overhead shot of an aged oak desk at night, beside the edge of a very large dark forest-green leather book with aged brass corners. Santa's hands: large square weathered working hands of a man of about 70, thick fingers, visible knuckles, veins and age spots, short clean nails, exactly five fingers on each hand, no gloves, a faint sepia ink stain on the right thumb and index finger and a plain worn brass ring on the right ring finger. Sleeves of a knee-length coat of thick boiled wool in deep brick red (#8E1B24) with cream natural sheepskin-wool trim (#E9E1CF) on the cuffs, a linen shirt cuff just visible.
Timing: from 0 to 2 seconds his bare right hand gently sets down a folded cream letter in the center of the desk; the letter opens flat by its own weight and the hand slowly leaves the frame. From 2 to 8 seconds the letter lies perfectly still and nothing moves.
The letter: one sheet of cream paper with a soft fold line across the middle, faint empty ruled lines and no writing at all, and a small wobbly yellow crayon star drawn by a child in the top corner. It fills about 70 percent of the frame width, centered and upright.
Camera: locked-off, 50mm lens, no camera movement.
Lighting: soft even warm light from an oil lamp above camera-right and a gentle fireplace glow from the side; no hard shadows on the letter, no glare, no flicker.
Style: cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting, soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, natural skin texture with visible pores and fine wrinkles, 180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation.
Vertical 9:16 frame.
Audio: only quiet room tone and the soft sound of paper settling. No music, no dialogue, no voice.
```
Restricciones: `any text, letters, handwriting, signatures, numbers on the letter, logo-like star, printed star, gloves, extra fingers, letter sliding or curling after it settles, wind, camera drift, glare, shadows across the letter`.
Aprobada si: cero letras generadas en la carta; carta plana y quieta ≥ 5 s (control automático); mano correcta en todos los fotogramas; la estrella parece dibujo de niño, no logotipo; los renglones quedan donde `video-edicion-post` pueda escribir 2 líneas de ≤ 70 caracteres.

### 5.6 V1-06 · Ojos sobre el libro (complicidad)

| Campo | Valor |
|---|---|
| Duración final | 7,5 s (clip 0,0–7,5 s). G3 usa el tramo 0,5–6,0 s |
| Tipo | PERS-OFF |
| Modelo | A: Omni 1.2 Flash · B: Veo 3.1 Quality |
| Créditos | B: 600 + 300 · A: 10 × `c` |
| Modo | Inicial: **F06** (= M11). Omni: referencias M1, M2 |
| Tomas | B: 6 + 3 · A-total: 6 + 4 |

Instrucción `P-V1-06-v1`:
```
An 8-second medium close-up, chest up, of Santa Lumen in his study at night. Santa Lumen: a tall, broad-shouldered man of about 70 with a firm round belly, weathered fair skin with natural ruddy cheeks, deep forehead lines and crow's feet. Wide square face, broad nose with a slightly crooked bridge to the right, dark hazel-brown eyes, thick white eyebrows with the left one slightly higher, a small light-brown mole on the left cheekbone. Warm silver-white beard (#E4DFD3), thick, wavy, reaching mid-chest, splitting into two or three tufts, with a full moustache neatly trimmed just above the upper lip so both lips stay clearly visible, its ends drooping softly past the corners of the mouth. Silver-white hair swept back, covering the tops of the ears, one loose lock over the right of the forehead. Thin oval brass reading glasses with aged patina and clear non-reflective lenses, resting low on the nose. No hat indoors. Large square working hands with a faint sepia ink stain on right thumb and index finger and a plain worn brass ring on the right ring finger. Knee-length coat of thick boiled wool in deep brick red (#8E1B24), cream natural sheepskin-wool trim (#E9E1CF) on cuffs, front edge and hem, five turned walnut wood buttons, wide dark brown vegetable-tanned leather belt with a plain rectangular aged brass buckle. Linen shirt and dark forest-green wool waistcoat underneath. Calm, warm, kind expression. Photoreal, filmic skin texture, no plastic, no CGI look.
He holds a very large closed book upright in front of him with both hands: a dark forest-green grained leather cover (#25382E) with aged brass corners and a blind-embossed eight-pointed star inside a compass in the center with no letters, facing the camera. The top edge of the book covers his mouth and beard up to the tip of his nose for the entire shot. Above the book his dark hazel-brown eyes smile warmly into the lens over his low brass reading glasses, with deep crow's feet. At about 3 seconds his eyebrows lift once, gently and playfully, then relax; he blinks naturally. The book stays still and rigid and his head stays still. Nothing sudden.
Camera: locked-off static camera, 85mm portrait lens, f/2 shallow depth of field, camera at a child's eye height.
Lighting: a large soft warm tungsten key light from the fireplace camera-left on his eyes, slightly above eye level, with catchlights in both eyes, one large and warm, one small and blue; the book casts a soft gentle shadow on the lower part of his face; warm glints on the brass corners; a faint cool blue rim light from the snow window behind him camera-right on his hair. Background: creamy bokeh of candle flames, a warm fireplace glow at the left edge and a faint blue window glow at the right edge.
Style: cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting, soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, subtle halation around candle flames, natural skin texture with visible pores and fine wrinkles, no beauty filter, no skin smoothing, 180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation.
Vertical 9:16 frame, Santa centered.
Audio: only the soft crackle of a low fire and quiet room tone. No music, no dialogue, no voice.
```
Restricciones: `mouth or beard visible above the book edge, lowering the book, letters or title on the cover, warped or bending book, staring without blinking, narrowed eyes, frown, deep shadows over the eyes, extreme close-up on the eyes, hat, reflections on the glasses, light from below, waxy skin, CGI look, zoom`.
Aprobada si: la boca y la barba no se ven en ningún fotograma; el libro no se deforma y el emblema no tiene letras; la mirada se lee como juego (3 adultos responden "jugando" o "escondiéndose", nunca "espiando"); visto bueno de `desarrollo-infantil`; el tramo 0,5–6,0 s sirve para G3 sin cambios.

### 5.7 V1-07 · A cámara: "ya estás en mi Lista"

| Campo | Valor |
|---|---|
| Duración final | 7,5 s |
| Tipo | PERS-LABIOS (Sync en 0,2–7,3 s del clip) |
| Modelo | A: Omni 1.2 Flash · B: Veo 3.1 Quality |
| Créditos | B: 600 + 300 (+200 de reserva) · A: 10 × `c` |
| Modo | Inicial + final: **F07** → **F07** (misma pose neutra; asegura el corte con V1-04 y V1-08). Omni: referencias M1, M2, M3 |
| Tomas | 9:16: 3 A + 3 B · 16:9: solo la variante ganadora (B: 3, A-total: 4). Misma sesión que V1-04 |

Instrucción `P-V1-07-v1` (boca A; también es la instrucción de la calibración):
```
An 8-second medium close-up, chest up, of Santa Lumen seated behind his oak desk in his study at night, already looking straight into the lens. Santa Lumen: a tall, broad-shouldered man of about 70 with a firm round belly, weathered fair skin with natural ruddy cheeks, deep forehead lines and crow's feet. Wide square face, broad nose with a slightly crooked bridge to the right, dark hazel-brown eyes, thick white eyebrows with the left one slightly higher, a small light-brown mole on the left cheekbone. Warm silver-white beard (#E4DFD3), thick, wavy, reaching mid-chest, splitting into two or three tufts, with a full moustache neatly trimmed just above the upper lip so both lips stay clearly visible, its ends drooping softly past the corners of the mouth. Silver-white hair swept back, covering the tops of the ears, one loose lock over the right of the forehead. Thin oval brass reading glasses with aged patina and clear non-reflective lenses, resting low on the nose. No hat indoors. Large square working hands with a faint sepia ink stain on right thumb and index finger and a plain worn brass ring on the right ring finger. Knee-length coat of thick boiled wool in deep brick red (#8E1B24), cream natural sheepskin-wool trim (#E9E1CF) on cuffs, front edge and hem, five turned walnut wood buttons, wide dark brown vegetable-tanned leather belt with a plain rectangular aged brass buckle. Linen shirt and dark forest-green wool waistcoat underneath. Calm, warm, kind expression. Photoreal, filmic skin texture, no plastic, no CGI look.
Timing: for the whole 8 seconds he looks warmly into the lens with a calm, kind smile. From 0 to 0.4 seconds his mouth is closed and neutral. From 0.4 to 7.3 seconds his lips stay gently closed in a relaxed smile, he breathes softly through his nose and blinks naturally two or three times. From 7.3 to 8 seconds his mouth is closed and neutral again. His head stays level, frontal and perfectly still the whole time, his hands stay below the frame, and nothing passes in front of his face. He does not speak.
Camera: locked-off static camera on a tripod, 85mm portrait lens, f/2 shallow depth of field, camera at a child's eye height just below his eye line, his eyes at about 40 percent from the top of the frame.
Lighting: a large soft warm tungsten key light from the fireplace camera-left, 35 to 45 degrees off axis and slightly above eye level; warm bounce fill from the oil lamp and candle camera-right, about one stop darker; a faint cool blue rim light from the snow window behind him camera-right, only on the edges of his hair, beard and shoulder; mouth and lips evenly lit, no shadow under the moustache, no hard shadows on the face; catchlights in both eyes, one large and warm, one small and blue; the firelight flicker on his face is almost imperceptible. Background: the study softly out of focus, creamy bokeh of candle flames and brass, a warm fireplace glow at the left edge of frame and a faint blue window glow at the right edge.
Style: cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting, soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, subtle halation around candle flames, natural skin texture with visible pores and fine wrinkles, subsurface scattering on ears and nose, no beauty filter, no skin smoothing, 180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation.
Vertical 9:16 frame, Santa centered.
Audio: only the soft crackle of a low fire and quiet room tone. No music, no dialogue, no voice.
```
Variante de boca B (reemplaza dos frases):
- `From 0.4 to 7.3 seconds his lips stay gently closed in a relaxed smile, he breathes softly through his nose and blinks naturally two or three times.` → `From 0.4 to 7.3 seconds his lips part slightly and move softly and neutrally, as if quietly humming to himself, with small natural jaw motion and no clear words, and he blinks naturally two or three times.`
- `He does not speak.` → `He makes no audible sound.`

Restricciones: las de V1-04.
Aprobada si: igual que V1-04; continuidad con el final de V1-04 (posición de cabeza ±3 %, piel ±5 %); la boca está cerrada y neutra en 0–0,4 s y 7,3–8 s.

### 5.8 V1-08 · El guiño

| Campo | Valor |
|---|---|
| Duración final | 2,5 s (el mejor tramo del clip) |
| Tipo | FIJO |
| Modelo | A: Omni 1.2 Flash · B: Veo 3.1 Quality |
| Créditos | B: 600 + 300 · A: 10 × `c` |
| Modo | Inicial + final: **F08** → **F08**. Omni: referencias M1, M2, M3 |
| Tomas | B: 6 + 3 · A-total: 6 + 4. Misma sesión que V1-04 y V1-07 |

Instrucción `P-V1-08-v1`:
```
An 8-second medium close-up, chest up, of Santa Lumen seated behind his oak desk in his study at night, looking warmly into the lens. Santa Lumen: a tall, broad-shouldered man of about 70 with a firm round belly, weathered fair skin with natural ruddy cheeks, deep forehead lines and crow's feet. Wide square face, broad nose with a slightly crooked bridge to the right, dark hazel-brown eyes, thick white eyebrows with the left one slightly higher, a small light-brown mole on the left cheekbone. Warm silver-white beard (#E4DFD3), thick, wavy, reaching mid-chest, splitting into two or three tufts, with a full moustache neatly trimmed just above the upper lip so both lips stay clearly visible, its ends drooping softly past the corners of the mouth. Silver-white hair swept back, covering the tops of the ears, one loose lock over the right of the forehead. Thin oval brass reading glasses with aged patina and clear non-reflective lenses, resting low on the nose. No hat indoors. Large square working hands with a faint sepia ink stain on right thumb and index finger and a plain worn brass ring on the right ring finger. Knee-length coat of thick boiled wool in deep brick red (#8E1B24), cream natural sheepskin-wool trim (#E9E1CF) on cuffs, front edge and hem, five turned walnut wood buttons, wide dark brown vegetable-tanned leather belt with a plain rectangular aged brass buckle. Linen shirt and dark forest-green wool waistcoat underneath. Calm, warm, kind expression. Photoreal, filmic skin texture, no plastic, no CGI look.
Timing: from 0 to 2.5 seconds he holds a warm closed-mouth smile. At about 3 seconds he gives one slow, gentle wink with one eye, his cheeks lifting, then the eye opens again. From 4.5 to 8 seconds he keeps the same warm closed-mouth smile. His mouth stays closed for the whole shot and his head stays level, frontal and still. He does not speak.
Camera: locked-off static camera on a tripod, 85mm portrait lens, f/2 shallow depth of field, camera at a child's eye height just below his eye line, his eyes at about 40 percent from the top of the frame.
Lighting: a large soft warm tungsten key light from the fireplace camera-left, 35 to 45 degrees off axis and slightly above eye level; warm bounce fill from the oil lamp and candle camera-right, about one stop darker; a faint cool blue rim light from the snow window behind him camera-right, only on the edges of his hair, beard and shoulder; mouth and lips evenly lit, no shadow under the moustache, no hard shadows on the face; catchlights in both eyes, one large and warm, one small and blue; the firelight flicker on his face is almost imperceptible. Background: the study softly out of focus, creamy bokeh of candle flames and brass, a warm fireplace glow at the left edge of frame and a faint blue window glow at the right edge.
Style: cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting, soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, subtle halation around candle flames, natural skin texture with visible pores and fine wrinkles, subsurface scattering on ears and nose, no beauty filter, no skin smoothing, 180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation.
Vertical 9:16 frame, Santa centered.
Audio: only the soft crackle of a low fire and quiet room tone. No music, no dialogue, no voice.
```
Restricciones: `open mouth, teeth, laughing, exaggerated cartoon wink, both eyes closing, head tilt, nod, eyebrow wiggle, hat, reflections on the glasses, waxy skin, CGI look`.
Aprobada si: guiño natural, no caricaturesco; boca cerrada todo el tramo usado; corta sin salto desde V1-07 (cabeza ±3 %).

### 5.9 V1-09 · Manos sobre el libro: "¡Feliz Navidad, {nombre}!"

| Campo | Valor |
|---|---|
| Duración final | 7,5 s |
| Tipo | PERS-OFF + COMP (desenfoque, título dorado y marca desde 0:56,8) |
| Modelo | A: Omni 1.2 Flash (A-total) o Veo 3.1 Fast (A-híbrida) · B: Veo 3.1 Fast |
| Créditos | B: 40 + 40 · A-total: 10 × `c` · A-híbrida: 80 |
| Modo | Inicial + final: **F09** → **F09-fin**. Se genera con cámara fija; el empuje de 2 % del storyboard se hace en post (escala lineal 1,00→1,02), porque un fotograma final fijo y un movimiento de cámara generado se contradicen |
| Tomas | B y A-híbrida: 4 + 4 · A-total: 6 + 4 |

Instrucción `P-V1-09-v1`:
```
An 8-second close shot from 40 degrees above an aged oak desk at night, looking at a very large closed antique book centered in the frame: a dark forest-green grained leather cover (#25382E), scuffed edges, aged brass corners and clasp, a blind-embossed eight-pointed star inside a compass in the center of the cover with no letters, worn gilt page edges and a faded red silk ribbon. Santa's hands: large square weathered working hands of a man of about 70, thick fingers, visible knuckles, veins and age spots, short clean nails, exactly five fingers on each hand, no gloves, a faint sepia ink stain on the right thumb and index finger and a plain worn brass ring on the right ring finger. Sleeves of a knee-length coat of thick boiled wool in deep brick red (#8E1B24) with cream natural sheepskin-wool trim (#E9E1CF) on the cuffs, a linen shirt cuff just visible.
Timing: from 0 to 0.8 seconds both hands rest flat on the cover, one on each side of the emblem. From 0.8 to 2.5 seconds they pat the cover gently twice. From 2.5 to 5 seconds they slowly slide back and leave the frame toward the bottom. From 5 to 8 seconds the book rests alone and still while the candle flame glints softly on the brass corners and on the embossed star.
Camera: locked-off, 85mm lens, shallow depth of field, no camera movement.
Lighting: warm fireplace light from camera-left, soft oil-lamp fill from camera-right, a lit beeswax candle softly out of focus at the top right; the skin of the hands has the same warm tone as his face would. The bottom 15 percent of the frame is calm dark wood.
Style: cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting, soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, subtle halation around candle flames, natural skin texture with visible pores and fine wrinkles, 180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation.
Vertical 9:16 frame.
Audio: only the soft crackle of a low fire, quiet room tone and two soft pats on leather. No music, no dialogue, no voice.
```
Restricciones: `letters, title, logo on the cover, gloves, extra fingers, fused fingers, fast slapping, book opening, book moving, camera movement, objects in the bottom of the frame, bright saturated red`.
Aprobada si: manos correctas en todos los fotogramas; emblema sin letras; el título compuesto se lee en teléfono sobre el fondo desenfocado; nada en el 15 % inferior salvo la marca.

---

## 6. Video gratis (15 s): cero créditos

Sale entero de tomas aprobadas del video 1 (storyboard 3 y 4). No se genera ningún clip propio. Solo 9:16.

| Id | Clip de origen | Tramo | Qué se exige a la toma de origen |
|---|---|---|---|
| G1 | V1-01 aprobada | 0,5–4,5 s | La tapa abre dentro del tramo |
| G2 | V1-03 aprobada | 0,0–5,5 s | Página limpia desde 3,0 s (el nombre empieza en el clip 3,7 s) |
| G3 | V1-06 aprobada | 0,5–6,0 s | Cejas que suben dentro del tramo; fundido final en post |

Al elegir la toma ganadora de V1-01, V1-03 y V1-06 se revisa también el tramo del gratis: si la mejor del video 1 no sirve para el gratis, gana la que sirva para los dos.

---

## 7. Prueba de labios (puerta, después de V1-04 9:16)

Objetivo: validar la toma de base y elegir boca A o B y modelo de labios antes de gastar en lo demás. Es la comparativa de 2 modelos de labios de la misión, dentro de un solo proveedor ya aprobado en D27 (`sync-so.md`), sin abrir proveedores nuevos.

| Elemento | Valor |
|---|---|
| Tomas de entrada | La mejor V1-04 con boca A y la mejor con boca B (archivo descargado, sin recorte ni reescalado) |
| Audio | Voz de prueba interna "Santa Lumen Labs (es-419)", parámetros de la biblia (decisión j), solo nombres ficticios: "¡Hola, Ana! Ya tienes cinco años.", "¡Hola, Xiomara! Ya tienes siete años.", "¡Hola, María Fernanda! Ya tienes cuatro años." Voz limpia, sin música. Solo escuchan adultos del equipo (biblia 5) |
| Colocación | Pista de audio del largo del clip: silencio + la frase empezando en 1,7 s. Se compara (a) el clip completo con esa pista y (b) el tramo 1,4–5,1 s recortado y vuelto a pegar en edición |
| Modelos | Sync lipsync-2-pro y Sync lipsync-2 |
| Corridas | 2 tomas × 3 frases × 2 modelos = 12 (~3,7 s cada una). Costo por segundo `[no verificado: tomar de sync.so/docs/models el día de la prueba y anotarlo en pipeline.md]` |
| Evalúa | `video-control-calidad`, a ciegas, en teléfono y al 200 %: máscara alrededor de la boca, dientes superiores marfil y estables, bigote y barba sin manchas, lentes intactos, sincronía en "Fernanda", color y grano de la boca iguales al resto de la cara |
| Gana | Boca A o B y modelo de labios con mejor resultado sin máscara en las 3 frases. La variante ganadora es la única que se genera en 16:9 para V1-04 y V1-07 |
| Si nada pasa | Se usan las 2 tomas de reserva de V1-04 con la corrección anotada; si en 8 intentos no pasa, se rediseña con el director antes de producir V1-07 |

---

## 8. Calendario (hasta el retiro de Veo del 5-dic)

| Fecha | Qué | Créditos |
|---|---|---|
| Mié 11-nov | Calibración en curso; evidencia legal (capturas); veredicto a ciegas y elección de rama | C (≈ 300) |
| Jue 12 – vie 13 | Juan elige M1 (B1 recomendada); auditoría de M1; M2–M12, F01–F09, fotogramas finales, 16:9 y contingencias sin lentes; aprobación de fotografía y arte | 0 |
| Sáb 14 – dom 15 | V1-04 9:16 (3 A + 3 B); puerta de lentes; prueba de labios | B: 600 |
| Lun 16 – mar 17 | V1-07 y V1-08 (misma sesión y mismas fijas que V1-04); V1-03 y prueba del nombre dorado (rama A: primero la puerta de insertos) | B: 1,800 |
| Mié 18 – jue 19 | V1-06 y V1-01 | B: 1,200 |
| Vie 20 | Insertos: V1-02, V1-05, V1-09 | B: 120 |
| Sáb 21 – mié 25 | Versiones 16:9 de los 9 planos | B: 1,920 |
| Jue 26 – sáb 28 | Reserva, solo para lo que quedó en REPETIR. **Meta: todas las tomas aprobadas el 28-nov** (storyboard 8) | B: ≤ 1,060 |
| Dom 29-nov – mié 2-dic | Colchón: solo emergencias con aprobación de `video-ia-generativa` | dentro del tope |
| **Jue 3-dic** | **Congelado:** descarga de todas las aprobadas, 2 respaldos por plano y todas las fijas; sumas de verificación; manifiesto (sección 9) | 0 |
| Sáb 5-dic | Veo 3.1 y Omni 1.1 dejan de estar en Flow | — |
| Vie 11-dic | Reinicio de créditos | — |

En la rama A el calendario es el mismo: Omni 1.2 no tiene fecha de retiro anunciada, pero los modelos de Flow cambian sin aviso largo; se congela igual el 3-dic.

---

## 9. Qué entrega Flow al pipeline por pedido

El flujo por pedido (`engines/generate`, diseño en `docs/video/jinglo/pipeline.md`, cambios con aprobación de `arquitecto`) **no llama a Flow, ni a Veo, ni a Omni**. Solo usa archivos congelados. Si mañana Flow retira un modelo, ningún pedido se entera.

Manifiesto `jinglo-base-v1` (lo arma `video-ia-generativa` el 3-dic; vive en almacenamiento privado que defina `arquitecto`):

| Activo | Formatos | Uso por pedido |
|---|---|---|
| V1-01 … V1-09 aprobadas, recortadas a su tramo, sin audio | 9:16 y 16:9 | Montaje fijo |
| V1-04 y V1-07 **sin recortar** (clip original descargado) | 9:16 y 16:9 | Entrada a Sync con la voz del pedido |
| M6 (placa limpia) y último fotograma de V1-03 | 9:16 y 16:9 | Composición del nombre dorado |
| M10 y último fotograma de V1-05 | 9:16 y 16:9 | Composición del logro en la carta |
| Fondo desenfocado de V1-09 (render de post) | 9:16 y 16:9 | Título "¡Feliz Navidad, {nombre}!" y jinglo.app |
| Tabla de tiempos por plano (entrada y salida de cada tramo, ventanas de voz y de labios, caja del nombre en píxeles) | JSON | Lo leen voz, labios y FFmpeg |
| Registro de tomas | CSV | Trazabilidad y costo |

Lo que cambia por pedido: piezas de voz, labios en V1-04 y V1-07 (~11 s), nombre dorado, logro en la carta, título final y mezcla. Nunca fotos de niños: no existe ningún campo de foto. Lo que ve el cliente está en español es-419 y no nombra proveedores ni modelos (D23).

---

## 10. Costo del video base (para `metricas` y `pricing`)

- **Créditos reales** = suma de la columna `creditos` del registro (calibración incluida). Las fijas cuestan 0.
- **Dólares** = créditos reales × (monto cobrado por el mes de Ultra ÷ 10,050). El monto lo confirma Juan con el cargo real `[no verificado]`. Ejemplos, solo para dimensionar: a US$125 el mes, 7,000 créditos ≈ US$87; a US$250, ≈ US$174.
- **Amortización por pedido** = costo del video base ÷ pedidos esperados de la temporada (lo fija `pricing`). El costo variable por pedido (voz, labios, cómputo de FFmpeg, almacenamiento y entrega) va aparte, en `pipeline.md`.
- Reporte: al congelar (3-dic), una línea por rama ejecutada con créditos, US$, tomas generadas, tomas aprobadas, tasa de aprobación por plano y por modelo. Va a `metricas` y `pricing`.

---

## 11. Pendientes y riesgos

| # | Qué | De quién | Bloquea |
|---|---|---|---|
| 1 | Elegir M1 (B1 recomendada) | Juan vía `lider-proyecto` | Todo lo que lleva cara |
| 2 | Costo `c` de Omni 1.2 Flash por clip y si depende de la duración | `video-ia-generativa` (calibración) | Presupuesto de la rama A |
| 3 | Omni 1.2 Flash en `docs/proveedores/google.md`: etiqueta de vista previa, términos de referencias | `legal-compliance` | Tomas finales de la rama A |
| 4 | Confirmar en Flow: fotograma final en 9:16 por modelo, campo negativo, semilla visible, resolución de descarga, fijas + referencias juntas en Omni | `video-ia-generativa` | Nada; hay alternativa anotada en cada caso |
| 5 | Emblema: arte dice "relieve ciego"; el storyboard dice "estrella de latón" en V1-06 y V1-09. Las instrucciones siguen a arte (relieve ciego, brillo en las esquinas de latón) | `video-direccion-arte` confirma | No |
| 6 | Uso de `[MASTER-MANOS]` en lugar de la descripción completa en los planos sin cara | `video-director-creativo` toma nota | No |
| 7 | Empuje de 2 % de V1-09 hecho en post y no generado | `video-fotografia-iluminacion` toma nota | No |
| 8 | Precio por segundo de lipsync-2-pro y lipsync-2 | `video-ia-generativa` en `pipeline.md` | No |
| 9 | Créditos sobrantes antes del 11-dic (fase 2 o se pierden) | `lider-proyecto` | No |

Riesgos principales: (a) rama B sin modelo para repeticiones después del 5-dic; mitigación: congelar el 3-dic con 2 respaldos por plano. (b) Texto fantasma en libro, carta o emblema; mitigación: OCR automático y fotogramas finales limpios. (c) Lentes que se deforman; mitigación: corte de la decisión c y fijas `-SL` listas desde el día 1. (d) Boca generada que pelea con los labios; mitigación: variantes A/B y prueba de labios antes de seguir.
