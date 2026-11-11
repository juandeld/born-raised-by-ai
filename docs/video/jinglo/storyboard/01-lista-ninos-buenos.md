# Storyboard 01 · La Lista de Niños Buenos (60 s) + video gratis (15 s)

Versión `storyboard-v1` · 11-nov-2026 · `video-director-creativo` · Biblia: `docs/video/jinglo/biblia.md` (manda sobre las secciones) · Guion base: `guiones/01-lista-ninos-buenos.md` y `guiones/00-video-gratis.md` (los textos de aquí son el `guion-v1.1` que `video-guionista` debe asentar) · Luz y criterios: `biblia/fotografia.md` · Aspecto y utilería: `biblia/arte.md` · Sonido: `biblia/sonido.md` · Voz: `biblia/voz.md`.
Documento interno: nombra modelos y proveedores (D23 aplica solo a lo que ve el cliente).

## 0. Cómo leer

- **Tipos:** `FIJO` (igual en todos los pedidos, voz incluida) · `PERS-LABIOS` (Santa dice algo personalizado mirando a cámara; pasa por sincronización de labios) · `PERS-OFF` (voz personalizada sin boca visible) · `COMP` (inserto preparado para componer texto encima con FFmpeg).
- **Clips:** cada plano sale de un clip de Flow de 8 s y se recorta. El audio que trae el clip se descarta siempre.
- **Modelo:** Veo 3.1 Quality si se ve la cara de Santa (100 créditos por clip); Veo 3.1 Fast si no (10 créditos en Ultra). Fast que falle en textura pasa a Quality con la reserva.
- **Tomas:** 9:16 (master): 6 tomas por plano Quality y 4 por plano Fast, gana la mejor aprobada. 16:9 (nativo, desde la misma fija extendida y la misma instrucción ya probada): 3 tomas Quality y 4 Fast; si ninguna pasa, se usan tomas de la reserva. Es una excepción del director a la regla de 6 tomas, solo para la segunda versión de formato, porque instrucción y fija ya llegan aprobadas.
- **Nada se genera sin su fija de arranque aprobada** por `video-fotografia-iluminacion` y `video-direccion-arte` (sección 7).
- **Instrucción:** cada plano empieza con la descripción maestra enmendada (biblia sección 3) y el vocabulario de luz de fotografía; la línea "Acción EN" de cada plano es solo la parte específica. La instrucción completa la escribe `video-ia-generativa` en `produccion/piloto-flow.md`.
- **Textos:** registro 5 a 6 años con el ejemplo ficticio "Sofía, 5 años, aprendió a andar en bicicleta, le encanta bailar". Las variantes por edad las recalcula el guionista con los límites de la sección 6.
- **Aprobado:** además del criterio propio de cada plano, toda toma cumple fotografía 10.1 (descarte inmediato), los 12 puntos de la biblia, Flow sin marca visible y con SynthID intacto (`legal-proveedores.md`).

## 1. Resumen

| Id | Tiempo | Dur. | Tipo | Qué es | Modelo | En el gratis |
|---|---|---|---|---|---|---|
| V1-01 | 0:00–0:07 | 7 s | FIJO | Plano general: Santa abre el Gran Libro | Quality | G1 |
| V1-02 | 0:07–0:13 | 6 s | FIJO | Sobre el hombro: pasa páginas | Fast | — |
| V1-03 | 0:13–0:20 | 7 s | PERS-OFF + COMP | Cenital: el dedo encuentra la línea; nombre en dorado | Quality | G2 |
| V1-04 | 0:20–0:27 | 7 s | PERS-LABIOS | Levanta la vista: "¡Hola, {nombre}!" + 2 s de calma | Quality | — |
| V1-05 | 0:27–0:35 | 8 s | PERS-OFF + COMP | Carta de la familia con el logro escrito | Fast | — |
| V1-06 | 0:35–0:42,5 | 7,5 s | PERS-OFF | Ojos sonrientes sobre el libro cerrado | Quality | G3 |
| V1-07 | 0:42,5–0:50 | 7,5 s | PERS-LABIOS | A cámara: "ya estás en mi Lista" | Quality | — |
| V1-08 | 0:50–0:52,5 | 2,5 s | FIJO | Guiño | Quality | — |
| V1-09 | 0:52,5–1:00 | 7,5 s | PERS-OFF + COMP | Manos sobre el libro; "¡Feliz Navidad, {nombre}!" y marca | Fast | — |

Video 1: 9 planos, 60 s. Labios: 2 planos, unos 11 s procesados (límite del brief: 20 s). Nombre dicho 4 veces (V1-03, V1-04, V1-07, V1-09). Dos risas, ambas en off (V1-01, V1-09).
Gratis: 3 planos, 15 s, todos reutilizados del video 1. Labios: 0. Nombre dicho 1 vez y escrito 1 vez. Cero créditos nuevos.

---

## 2. Video 1 · plano por plano

### V1-01 · Plano general: Santa abre el libro
- **Tiempo / duración:** 0:00–0:07 · 7 s (clip 0,5–7,5 s).
- **Tipo:** FIJO.
- **Qué se ve:** el estudio de noche. Santa sentado tras el escritorio de roble, de frente a cámara pero pequeño en el cuadro, cabeza baja hacia el Gran Libro cerrado; abre la tapa con las dos manos, despacio. Fuego bajo a la izquierda, nieve cayendo tras la ventana detrás a la derecha, vapor de la taza de barro, tamal en su plato, vela encendida.
- **Encuadre y lente:** general, 24-28 mm, cámara a 1,10 m. 9:16: Santa y escritorio en el centro-bajo, vigas arriba, resplandor de chimenea en el borde izquierdo y azul en el derecho. 16:9: chimenea y ventana completas en las alas.
- **Luz:** fotografía P1. Chimenea a camera-left, ventana azul detrás a camera-right, vela y lámpara como acentos.
- **Movimiento:** dolly-in recto de 3 % en todo el plano.
- **Santa dice (off, fijo):** "Jo, jo, jo… Hasta el Polo Norte llega el olor a tamales. Hoy abro mi Gran Libro." (0:00,8–0:06,3). La boca no se lee: Santa lejos, cabeza baja, barba.
- **Audio:** entrada desde silencio en 1 s; fuego -26 dB, viento lejano -30 dB; tres notas sueltas de celesta; tapa de cuero que cede (-12 dB) al abrir. Música (pista temporal o ninguna, biblia decisión h) a -18 dB.
- **Composición:** ninguna (grano y halación comunes al final).
- **Fija de arranque:** F01 (de M5b / M5, con el libro cerrado).
- **Modelo y tomas:** Quality · 6 (9:16) + 3 (16:9).
- **Acción EN:** `wide establishing shot, Santa seated behind an oak desk facing camera, small in frame, head lowered, slowly opens the heavy closed green leather book with both hands; low fire camera-left, snow falling outside the window behind him camera-right, steam rising from a clay mug; slow straight dolly-in, 24mm, child eye height`
- **Aprobado si:** cumple fotografía 10.2 P1; abrigo, barba, lentes y "sin gorro" legibles a esa escala; la tapa abre sin deformarse y sin letras; la boca no se distingue; pasa la prueba de columna central en 16:9.

### V1-02 · Sobre el hombro: busca en el libro
- **Tiempo / duración:** 0:07–0:13 · 6 s.
- **Tipo:** FIJO.
- **Qué se ve:** desde detrás del hombro izquierdo de Santa: hombro de lana roja y pelo plateado desenfocados en primer plano; el libro abierto nítido; la mano izquierda pasa dos o tres páginas con calma. Las páginas muestran trazos horizontales borrosos, ninguna letra. Resplandor de la chimenea al fondo, a la derecha del cuadro.
- **Encuadre y lente:** sobre el hombro, 50 mm, 1,10 m.
- **Luz:** fotografía S1: chimenea lateral en contraluz sobre el hombro, lámpara sobre la página.
- **Movimiento:** fijo o empuje de 2 %.
- **Santa dice (off, fijo):** "Aquí están los niños buenos de todo el mundo. Busco un nombre muy especial." (0:07,3–0:12,6).
- **Audio:** páginas de papel grueso (-14 dB) como percusión; arpa y pizzicato con el tema en fragmentos; ducking -10 dB.
- **Composición:** ninguna.
- **Fija de arranque:** F02 (= M9).
- **Modelo y tomas:** Fast · 4 + 4. Si el pelo o la lana se ven de plástico, pasa a Quality con la reserva.
- **Acción EN:** `over-the-shoulder shot from behind Santa's left shoulder, out-of-focus brick-red boiled-wool shoulder and silver-white hair in the foreground, his bare left hand slowly turns two thick cream pages of a large antique book in sharp focus, pages show only blurred abstract strokes, fireplace glow in the background frame-right, 50mm, locked-off`
- **Aprobado si:** cero letras o pseudo-letras; las páginas se doblan como papel grueso; mano de cinco dedos, sin guante; no se ve el perfil de la cara ni la boca.

### V1-03 · Cenital: el nombre se escribe en dorado (momento "wow")
- **Tiempo / duración:** 0:13–0:20 · 7 s (clip 0,0–7,0 s).
- **Tipo:** PERS-OFF + COMP.
- **Qué se ve:** la página derecha desde arriba, plana, con el punto dorado en el margen de la línea 11. El índice derecho de Santa (mancha de tinta) baja por el margen izquierdo y se detiene a la izquierda, debajo de la línea 11, a los 2,3 s; se retira y sale por el borde izquierdo a los 3,0 s. De 3,0 a 8,0 s la página queda quieta y limpia. En la caja reservada se escribe el nombre.
- **Encuadre y lente:** cenital 85-90°, 50-65 mm. Página derecha al 84 % del ancho en 9:16 (al 45 %, centrada, en 16:9). Arriba de la página = arriba del cuadro.
- **Luz:** fotografía 7: pareja sobre la página (≤ 1,5:1), sin sombras ni brillos en la caja, parpadeo < 3 %.
- **Movimiento:** fijo; deriva máxima 1 %.
- **Santa dice (off):** "A ver, a ver…" (fijo, 0:13,8–0:15,0) · silencio · "{nombre}… ¡aquí estás! ¡Tu nombre brilla!" (personalizado, 0:16,7–0:19,9; la voz termina antes del corte).
- **Audio:** pizzicato bajo el dedo; a 0:16,2 música y efectos se cortan en 150 ms y queda el piso de sala (-40 dB); el nombre suena con la voz sola; pluma sobre papel (-16 dB) con la escritura; 0,2 s después de terminar el nombre, destello de celesta alta y campanillas (-10 dB); la nota abierta se resuelve en acorde mayor.
- **Composición:** nombre en dorado con Pinyon Script (biblia decisión i) en la caja de la línea 11 (arte 4.2); la escritura empieza con la primera sílaba (clip 3,7 s = 0:16,7) y avanza de izquierda a derecha en 1,5 s, con destello cálido al final; colores #C9A24A / #F3D88A / #8F6E26; sombra mínima pegada al papel; grano común encima. Placa limpia: M6.
- **Fija de arranque:** F03 (= M6b).
- **Modelo y tomas:** Quality · 6 + 3. Es el momento "wow", va en los dos videos y en cada pedido: se paga una vez.
- **Acción EN:** `top-down overhead shot of the right-hand page of a very large antique book lying flat on an oak desk, Santa's bare right index finger with a faint sepia ink stain slides slowly down the left margin, stops just below-left of the eleventh guide line, then withdraws out of frame left; the page then stays perfectly still and empty, soft even warm lamplight, no shadows, locked-off 50mm`
- **Aprobado si:** cumple fotografía P4 (≥ 5 s de página quieta, deriva ≤ 1 %); desde 1,7 s ninguna parte de la mano ni de su sombra entra en la caja ni en su margen del 3 %; cinco dedos; ninguna letra generada; el dorado compuesto pasa la prueba "parece escrito, no pegado" con 3 personas.

### V1-04 · Santa levanta la vista: "¡Hola, {nombre}!"
- **Tiempo / duración:** 0:20–0:27 · 7 s.
- **Tipo:** PERS-LABIOS.
- **Qué se ve:** Santa de pecho arriba, mirando hacia abajo al libro (fuera de cuadro). 0,0–1,3 s levanta la cabeza y la mirada hasta el lente, despacio. 1,3–1,7 s sonrisa con boca cerrada: el reconocimiento. 1,7–4,8 s habla (ventana de labios; se ajusta a la duración real del audio). 4,8–7,0 s boca cerrada, sonrisa tibia, mejillas arriba, parpadeo natural: la calma para que el adulto grabe la reacción (mínimo 2,0 s, nunca menos).
- **Encuadre y lente:** plano medio corto, 85 mm, 1,05 m. Ojos al 38-40 % del alto, boca al 46-48 %. Tras el levantamiento, cara frontal ±10°.
- **Luz:** fotografía P3 (key suave camera-left 35-45° y 10-20° sobre los ojos; fill cálido camera-right; contraluz azul tenue). Boca pareja con las mejillas.
- **Movimiento:** fijo.
- **Santa dice (labios, personalizado):** "¡Hola, {nombre}! Ya tienes {edad} años." (edad en letras; hasta 3,1 s, 0:21,7–0:24,8). La pieza nunca termina en el nombre.
- **Audio:** durante el levantamiento queda solo el acorde del destello, muy bajo (-18 dB); ningún instrumento nuevo durante el habla; en la calma, fuego y el acorde que se desvanece. Nada sube.
- **Composición:** sincronización de labios (Sync Labs lipsync-2-pro) solo en el tramo 1,4–5,1 s del clip, con la voz limpia sin música; igualar color, grano y nitidez de la boca con el resto de la cara.
- **Fija de arranque:** F04 (de M1, con la cabeza baja hacia el libro; M2 como referencia).
- **Modelo y tomas:** Quality · 6 + 3. **Es el primer plano que se produce:** decide lentes (biblia decisión c) y valida labios antes de gastar en lo demás.
- **Acción EN:** `medium close-up, Santa first looks down at an out-of-frame book, then slowly raises his head and eyes to look straight into the lens, a warm closed-mouth smile of recognition, then speaks a short warm greeting with natural jaw motion, then returns to a calm closed-mouth smile and holds; head level and still after looking up; nothing in front of the face; locked-off 85mm`
- **Aprobado si:** cumple fotografía sección 6 (1 a 13) y la prueba de cera; la mirada llega al lente y se queda; lentes sin reflejo sobre los ojos ni deformación; labio superior visible; la sincronización con tres nombres ficticios ("Ana", "Xiomara", "María Fernanda") no deja máscara alrededor de la boca.

### V1-05 · La carta de la familia
- **Tiempo / duración:** 0:27–0:35 · 8 s.
- **Tipo:** PERS-OFF + COMP.
- **Qué se ve:** desde arriba, junto al borde del libro, la mano derecha de Santa deja sobre la madera una carta doblada en dos que se abre sola por su peso (0–2 s) y sale de cuadro. Papel crema con renglones vacíos y una estrella dibujada con crayón amarillo en la esquina superior. De 2 a 8 s la carta queda quieta.
- **Encuadre y lente:** cenital 85-90°, 50 mm; la carta ocupa unos 70 % del ancho en 9:16, centrada.
- **Luz:** pareja, como fotografía 7; lámpara arriba a camera-right, chimenea lateral suave.
- **Movimiento:** fijo.
- **Santa dice (off):** "Tu familia me escribió una carta." (fijo, 0:27,3–0:29,5) · "Dice que {logro}. ¡Qué orgullo!" (personalizado, 0:29,9–0:34,9). Sin logro: "Leo la carta de tu familia. Cada línea habla del cariño que te tienen."
- **Audio:** el tema completo, lento, en celesta con cuerdas muy suaves (ternura); papel que se apoya (-14 dB); ducking -12 dB.
- **Composición:** a 0:29,2 los renglones se "revelan" con un brillo suave de 1 s y aparece, en tinta azul oscura y fuente manuscrita OFL (candidata: Caveat), lo que escribió el adulto en el campo 3, ya limpio (filtros de la sección 6 del guion, ortografía, ≤ 70 caracteres, máximo 2 renglones). Si el filtro reescribió o descartó el campo, se escribe la versión reescrita o nada. Carta quieta: no hace falta seguimiento.
- **Fija de arranque:** F05 (= M10, con M4 para la mano).
- **Modelo y tomas:** Fast · 4 + 4.
- **Acción EN:** `top-down shot of an oak desk beside the edge of a large antique book, Santa's bare weathered right hand gently sets down a folded cream letter that opens flat by its own weight, then the hand leaves frame; the letter has empty faint ruled lines and a child's yellow crayon star drawing in the top corner, no writing; the letter then stays perfectly still; soft even warm light, locked-off 50mm`
- **Aprobado si:** cero letras generadas en la carta; carta plana y quieta ≥ 5 s; mano correcta; la estrella parece dibujo de niño, no logotipo.

### V1-06 · Ojos sobre el libro (complicidad)
- **Tiempo / duración:** 0:35–0:42,5 · 7,5 s (clip 0,0–7,5 s).
- **Tipo:** PERS-OFF.
- **Qué se ve:** Santa sostiene el Gran Libro cerrado y de pie, con la tapa y su emblema hacia cámara; el borde superior le llega a la nariz y tapa boca y barba. Por encima, sus ojos sonríen al lente sobre el borde de los lentes, con patas de gallo marcadas; a los 3 s las cejas suben una vez, con picardía de "lo sé". Nada brusco.
- **Encuadre y lente:** 85 mm, 1,05 m, de pecho arriba (el libro llena los tercios medio e inferior). No es primer plano de ojos.
- **Luz:** key de P3 sobre los ojos con reflejo en ambos; el libro hace sombra suave en la parte baja de la cara (intencional); brillo del latón del emblema.
- **Movimiento:** fijo.
- **Santa dice (off, personalizado):** según el pedido:
  - Gusto y casilla: "Me contaron que {gusto}. Sé que a tu casa también llega el Niño Dios. ¡Qué bonito!"
  - Solo gusto: "Me contaron que {gusto}. ¡Qué divertido! Eso me hace sonreír."
  - Solo casilla: "Sé que a tu casa también llega el Niño Dios. ¡Qué bonito! En cada casa la Navidad llega a su manera."
  - Ninguno: "En mi taller todo huele a canela y a galletas."
  - La frase del Niño Dios está pendiente de `desarrollo-infantil` y `legal-compliance` (biblia decisión f); si no se aprueba, se usan las otras filas sobre el mismo plano.
- **Audio:** el tema sigue en ternura; ducking -12 dB.
- **Composición:** ninguna.
- **Fija de arranque:** F06 (= M11).
- **Modelo y tomas:** Quality · 6 + 3.
- **Acción EN:** `Santa holds the large closed green leather book upright in front of him, its blind-embossed star emblem facing camera, the top edge covering his mouth and beard up to the nose; above it his dark hazel eyes smile into the lens over low brass glasses, deep crow's feet, eyebrows lift once playfully; medium close-up from chest up, 85mm, locked-off`
- **Aprobado si:** la boca y la barba no se ven en ningún fotograma; el libro no se deforma y el emblema no tiene letras; la mirada se lee como juego (3 adultos responden "jugando" o "escondiéndose", nunca "espiando"); visto bueno de `desarrollo-infantil`.

### V1-07 · A cámara: "ya estás en mi Lista"
- **Tiempo / duración:** 0:42,5–0:50 · 7,5 s.
- **Tipo:** PERS-LABIOS.
- **Qué se ve:** Santa de pecho arriba, ya mirando al lente; 0–0,4 s boca cerrada; habla; 0,4 s finales boca cerrada. Sonrisa cálida, cabeza quieta.
- **Encuadre y lente:** idéntico a V1-04 después del levantamiento.
- **Luz:** idéntica a V1-04 (mismas posiciones y valores).
- **Movimiento:** fijo.
- **Santa dice (labios, personalizado):** "¿Sabes una cosa, {nombre}? Ya estás en mi Lista de Niños Buenos. Sigue con ese gran corazón." (hasta 6,7 s, 0:42,9–0:49,6; el nombre cae hacia el segundo 1,3 del clip).
- **Audio:** la música crece hacia la alegría pero queda 10-12 dB bajo la voz; nada sobre el nombre.
- **Composición:** sincronización de labios en 0,2–7,3 s del clip.
- **Fija de arranque:** F07 (= M1).
- **Modelo y tomas:** Quality · 6 + 3.
- **Acción EN:** `medium close-up, Santa looks straight into the lens and speaks warmly and calmly, head level and perfectly still, mouth and lips fully visible and evenly lit, neutral closed-mouth start and end, nothing in front of the face, locked-off 85mm`
- **Aprobado si:** igual que V1-04, y continuidad con V1-04 (posición de la cabeza y piel ±5 %).

### V1-08 · El guiño
- **Tiempo / duración:** 0:50–0:52,5 · 2,5 s (el mejor tramo del clip).
- **Tipo:** FIJO.
- **Qué se ve:** mismo encuadre que V1-07; sonrisa con boca cerrada, un guiño lento con un ojo, mejillas arriba.
- **Encuadre, lente, luz, movimiento:** gemelo de V1-07; fijo.
- **Santa dice:** nada.
- **Audio:** la música sube un tono (alegría), sola, a -6 dB de la voz de referencia; cascabeles lejanos (-20 dB).
- **Composición:** ninguna.
- **Fija de arranque:** F08 (= M1).
- **Modelo y tomas:** Quality · 6 + 3.
- **Acción EN:** `medium close-up, Santa looks into the lens with a warm closed-mouth smile and gives one slow gentle wink, cheeks lifting, head still, locked-off 85mm`
- **Aprobado si:** guiño natural, no caricaturesco; boca cerrada todo el tramo; corta sin salto desde V1-07 (cabeza ±3 % de posición).

### V1-09 · Manos sobre el libro: "¡Feliz Navidad, {nombre}!"
- **Tiempo / duración:** 0:52,5–1:00 · 7,5 s.
- **Tipo:** PERS-OFF + COMP.
- **Qué se ve:** el Gran Libro cerrado sobre el escritorio; las dos manos de Santa descansan sobre la tapa, dan dos palmadas suaves y se retiran despacio; la vela hace brillar la estrella de latón del emblema.
- **Encuadre y lente:** 85 mm a 40° sobre el escritorio; el libro centrado en la columna 9:16.
- **Luz:** fotografía P5: chimenea lateral camera-left, lámpara camera-right; piel de las manos igual que la cara.
- **Movimiento:** empuje de 2 %.
- **Santa dice (off, personalizado):** "¡Feliz Navidad, {nombre}! Se nota cuánto te quieren en tu casa. Jo, jo, jo…" (0:52,8–0:58,5). La risa, suave y de pecho, en off.
- **Audio:** resolución en acorde mayor; cascabeles que se alejan; logo sonoro a 0:58,5; cola de 1,5 s y fundido.
- **Composición:** a 0:56,8 la imagen se desenfoca y baja a un cálido oscuro (no negro); "¡Feliz Navidad, {nombre}!" se escribe en dorado (Pinyon Script) en el tercio medio en 1,5 s, con destello; de 0:58,8 a 1:00, "jinglo.app" pequeño, crema, centrado abajo dentro del margen seguro, sin animación.
- **Fija de arranque:** F09 (= M12, con M4).
- **Modelo y tomas:** Fast · 4 + 4.
- **Acción EN:** `close shot at 40 degrees of a large closed green leather book with brass corners on an oak desk, Santa's two weathered bare hands rest on the cover, pat it gently twice and slowly slide away; candlelight glints on the blind-embossed star emblem; slow 2 percent push-in, 85mm`
- **Aprobado si:** manos correctas en todos los fotogramas; emblema sin letras; el título se lee en teléfono; nada en el 15 % inferior salvo la marca.

---

## 3. Video gratis (15 s) · plano por plano

Solo 9:16 (es para teléfono y redes). Pide solo el nombre. Marca "jinglo.app" en la esquina inferior derecha de 0:00 a 0:15: crema al 60 % de opacidad, altura de unos 2,5 % del cuadro, dentro del margen seguro del 5 %. Sin risa, sin labios, sin logo sonoro; la música nunca se resuelve.

| Id | Tiempo | Dur. | Tipo | De dónde sale | Santa dice | Audio | Composición |
|---|---|---|---|---|---|---|---|
| G1 | 0:00–0:04 | 4 s | FIJO | V1-01, tramo 0,5–4,5 s del clip (abre el libro) | "Déjame buscar en mi Gran Libro…" (0:00,6–0:02,7; fijo) | Entrada desde silencio en 0,5 s; fuego; tres notas de celesta; tapa que cede | Marca |
| G2 | 0:04–0:09,5 | 5,5 s | PERS-OFF + COMP | V1-03, tramo 0,0–5,5 s (dedo, página limpia) | "Hay un nombre que brilla…" (0:04,3–0:06,0; fijo) · silencio 0:07,2–0:07,7 · "{nombre}… ¡aquí estás!" (0:07,7–0:09,8; personalizado) | Arpa y pizzicato; corte de música a 0:07,2; voz sola en el nombre; pluma; destello 0,2 s después del nombre, con el acorde **abierto** | Nombre en dorado igual que en V1-03 (empieza a 0:07,7, clip 3,7 s); marca |
| G3 | 0:09,5–0:15 | 5,5 s | PERS-OFF | V1-06, tramo 0,5–6,0 s (ojos sobre el libro) | **"Tengo algo más que decirte… sobre lo que escribí de ti."** (0:10,8–0:14,6, tras 1 s de pausa; susurro cómplice, fijo) | Cama de cuerdas sostenida muy suave; una nota de celesta flota y se desvanece entre 0:14,2 y 0:15; fundido de 0,5 s a cálido oscuro | Marca |

- **Variante A/B (solo prueba ciega con adultos):** G3 con "Tengo algo más que decirte sobre tu regalo…" (y la C de `comprador.md`). Cambia solo la pieza de voz; cero créditos. Para vender gana la que salga mejor en H5b, siempre con visto bueno de `desarrollo-infantil`.
- **Qué no revela el gratis:** Santa diciendo el nombre a cámara, el logro, la carta, el guiño y el final.
- **Personalizado:** una sola pieza de voz por pedido ("{nombre}… ¡aquí estás!") y el nombre dorado. El resto (G1, inicio de G2, G3) es audio fijo, grabado una vez.

## 4. Reutilización entre el video 1 y el gratis

| Clip | Video 1 | Gratis | Ahorro |
|---|---|---|---|
| V1-01 | 0:00–0:07 | G1 | No se genera plano propio de apertura para el gratis |
| V1-03 | 0:13–0:20 | G2 | El mismo nombre dorado y la misma placa limpia sirven para los dos |
| V1-06 | 0:35–0:42,5 | G3 | El cierre de suspenso del gratis no necesita clip propio |

El gratis no consume créditos: sus 3 planos son tomas ya aprobadas del video 1. Sin esta reutilización costaría 1,800 créditos más (3 planos Quality x 6 tomas).

## 5. Créditos

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
| **Total** | 6 Quality + 3 Fast | **48 clips** | **3,720** | **30 clips** | **1,920** |

- **Planeado:** 78 clips, **5,640 créditos**.
- **Reserva: 1,360 créditos**, en este orden: hasta 2 tomas más de V1-04 y de V1-07 en 9:16, para llegar al límite de 8 intentos de fotografía (400); 3 tomas más en 16:9 para dos planos Quality (600); pasar un plano Fast a Quality con 3 tomas (300); libre (60).
- **Tope: 7,000 créditos** (brief). Si un plano no se logra en 8 intentos, no se sigue gastando: se rediseña con el director.
- Las imágenes fijas no entran en este cálculo `[no verificado: confirmar si Flow cobra créditos por imagen; si cobra, salen de la reserva]`.
- Fuera de los créditos de Flow: voz (piezas por pedido), sincronización de labios (unos 10 s por pedido) y composición FFmpeg (sin proveedor).

## 6. Límites de texto por tramo (para el `guion-v1.1`)

Voz a unos 15 caracteres por segundo, sin contar las pausas marcadas. `{nombre}` hasta 16 caracteres.

| Tramo | Ventana de voz | Máx. caracteres | Nota |
|---|---|---|---|
| V1-01 | 5,5 s | 82 | Fijo |
| V1-02 | 5,3 s | 80 | Fijo |
| V1-03 | 3,2 s tras el silencio | 50 | "A ver, a ver…" va aparte, fijo |
| V1-04 | 3,1 s | 48 | La calma de 2 s no se recorta; si no cabe, variante de edad más corta |
| V1-05 | 2,2 + 5,0 s | 33 + 75 | Recalcular las variantes 7 a 9 ("¡Eso merece un gran aplauso!" ya no cabe con un logro de 50) |
| V1-06 | 7,0 s | 105 | La fila "gusto y casilla" llega a unos 104 |
| V1-07 | 6,7 s | 100 | Variante 7 a 9: cambiar "Sigue con ese gran corazón." por "Gracias por ser tú." |
| V1-09 | 4,7 s + 1 s de risa | 71 + risa | El nombre no cierra la última frase |
| G1 + G2 + G3 | 2,1 + 1,7 + 2,1 + 3,8 s | 33 + 27 + 31 + 57 | Igual para todas las edades; a los 3 y 4 años, voz más lenta y se acortan los silencios, no las palabras |

Si una pieza personalizada no cabe en su ventana: primero la variante de edad más corta; después `speed` +0,02 (máx. 0,94); nunca se recorta la calma de V1-04 ni el silencio antes del nombre.

## 7. Fijas de arranque por plano

Se derivan de las maestras M1 a M12 (biblia sección 10), en este orden. Cada una se aprueba en 9:16 y luego se extiende a 16:9 con la columna central intacta y se vuelve a aprobar (salvo las del gratis, que no tienen 16:9 propio).

| Orden | Fija | Deriva de | Plano |
|---|---|---|---|
| 1 | F07 / F08 · Santa frente | M1 | V1-07, V1-08 |
| 2 | F04 · Santa frente con la cabeza baja hacia el libro | M1, M2 | V1-04 |
| 3 | F03 · Libro cenital con la mano entrando | M6b, M6 (placa limpia) | V1-03 |
| 4 | F06 · Ojos sobre el libro cerrado | M11 | V1-06 |
| 5 | F01 · Estudio general con el libro cerrado | M5b, M5 | V1-01 |
| 6 | F02 · Sobre el hombro | M9 | V1-02 |
| 7 | F05 · Carta sobre el escritorio | M10, M4 | V1-05 |
| 8 | F09 · Manos sobre el libro cerrado | M12, M4 | V1-09 |

## 8. Orden de producción

1. Maestras M1 a M12 (biblia sección 10) y fijas de arranque F01 a F09.
2. **V1-04 en 9:16 (6 tomas).** Puerta de los lentes (biblia decisión c) y prueba de labios con voz de prueba y nombres ficticios. Si falla la puerta, se rehacen M1 y las fijas con cara antes de seguir.
3. V1-07 y V1-08, en la misma sesión y con la misma luz que V1-04.
4. V1-03 (el "wow" compartido) y prueba de composición del nombre dorado.
5. V1-06, luego V1-01.
6. Planos Fast: V1-02, V1-05, V1-09.
7. Versiones 16:9 de los 9 planos.
8. Reserva, solo para lo que no pasó.

Meta: todas las tomas aprobadas antes del 28-nov-2026, con margen sobre el retiro de Veo 3.1 Quality y Fast del Flow el 5-dic-2026. Después: voz y labios, música y mezcla (sonido sección 4), control de calidad con veto y prueba ciega con 5 papás (sin niños hasta la aprobación escrita de la voz).

## 9. Hoja de personalización (para `video-edicion-post`)

| Qué | Dónde | Cuándo (video 1) | Cuándo (gratis) | Fuente del dato |
|---|---|---|---|---|
| Nombre dicho | Voz off | 0:16,7 (V1-03) | 0:07,7 (G2) | Campo 1 (forma de voz: diccionario o "¿Cómo se pronuncia?") |
| Nombre en dorado | Página, línea 11 | 0:16,7–0:18,2 | 0:07,7–0:09,2 | Campo 1, ortografía original |
| Nombre y edad dichos a cámara | Labios | 0:21,7 (V1-04) | — | Campos 1 y 2 |
| Logro escrito | Carta | 0:29,2 (V1-05) | — | Campo 3, texto del adulto limpio |
| Logro dicho | Voz off | 0:29,9 | — | Campo 3, cláusula convertida |
| Gusto y Niño Dios | Voz off | 0:35,3 (V1-06) | — | Campos 4 y 5 |
| Nombre a cámara | Labios | 0:44,2 (V1-07) | — | Campo 1 |
| "¡Feliz Navidad, {nombre}!" dicho y escrito | Voz off y título dorado | 0:52,8 y 0:56,8 (V1-09) | — | Campo 1 |
| Marca jinglo.app | Esquina o tarjeta final | 0:58,8–1:00 | 0:00–0:15 | Fija |

Las marcas de tiempo del nombre se ajustan con la transcripción de cada pieza (voz sección 4); el silencio de 0,5 s y el destello se colocan respecto al inicio y fin real del nombre, no a tiempo fijo.
