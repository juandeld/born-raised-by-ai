# Jinglo · Biblia · Fotografía e iluminación (piloto)

Autor: `video-fotografia-iluminacion` · 11-nov-2026 · versión `foto-v1.1` (ronda 2 aplicada; decorado, vestuario y hoja de color alineados con `arte.md` v1.1, sección 1.7 y lista negativa 2.6) · Alcance: "La Lista de Niños Buenos" (~60 s) y video gratis (15 s), ambos en el estudio de Santa. Formato principal 9:16 (1080x1920), versión 16:9 (1920x1080), 24 fps.
Consumen este documento: `video-direccion-arte` (utilería y aspecto de Santa), `video-ia-generativa` (instrucciones de generación), `video-edicion-post` (color y composición), `video-director-creativo` (storyboard y corte).
Los bloques en inglés son vocabulario para pegar o adaptar en las instrucciones de generación. En el cliente no se nombra ningún proveedor ni modelo (D23).

---

## 1. Dirección visual general

**Una frase:** película navideña filmada en película de 35 mm, de noche, dentro de un estudio de madera cálido, con nieve azul afuera. Se siente tocable, no brillante.

Referencias descritas con palabras (sin películas ni marcas):
- La luz de los interiores de las películas navideñas familiares de los años 80 y 90: tungsteno cálido, humo de chimenea muy leve, halos suaves en las velas, sombras que se aclaran en vez de volverse negras.
- El claroscuro amable de la pintura de interiores holandesa del siglo XVII: una ventana a un lado, una sola fuente cálida dominante, fondo que se hunde con suavidad.
- La textura de una fotografía de familia en negativo de color: grano fino, negros ligeramente levantados, rojos profundos, dorados mantecosos.

**Lo que NO es:** luz plana de estudio de televisión, piel pulida de filtro de belleza, neón rojo-verde saturado, oscuridad tipo terror, ni "render" brillante de videojuego.

**Sensación para el niño (regla de `desarrollo-infantil`):** seguro, tibio, grande pero amable. Nada de sombras largas que suban por la cara, nada de luz desde abajo, nada de primeros planos invasivos.

**Reglas de cámara de toda la película**
- Cámara a la altura de los ojos de un niño: 1.00 a 1.15 m del piso. Santa sentado queda ligeramente arriba del lente (mirada amable hacia abajo, nunca picada amenazante). Inclinación del eje: máximo 5° hacia arriba.
- Look de lente de cine: bordes suaves, desenfoque cremoso, sin sobre-nitidez.
- Movimiento solo motivado y lento (empujes de dolly de 2 a 5 %). Prohibidos: cámara en mano temblorosa, whip pans, zooms digitales rápidos, drones, giros de 360°.
- Obturador de 180° (desenfoque de movimiento natural). 24 fps.

---

## 2. Geometría de luz del estudio (no cambia dentro de una escena)

La escena del piloto es una sola: el estudio, de noche. Se fija este mapa y todos los planos lo respetan. "Camera-left / camera-right" se define desde la cámara frontal que mira a Santa sentado tras su escritorio.

```
                  VENTANA (azul nieve, 6500-7500 K)
                  atrás, camera-right, alta
        _________________________________________
       |                                   [///] |
       |  CHIMENEA                         [///] |
       |  (naranja, 1800-2200 K)                 |
       |  camera-left, lateral                   |
       |                SANTA (sentado)          |
       |                  [escritorio + libro]   |
       |      lámpara de aceite / velas          |
       |      sobre el escritorio, camera-right  |
       |_________________________________________|
                         CÁMARA (frente, 1.05 m)
```

Fuentes motivadas (toda luz visible en cuadro debe tener una fuente creíble):

| Fuente | Dónde | Color | Función |
|---|---|---|---|
| Chimenea | Camera-left, lateral, a 35-60° del eje | 1800-2200 K en la llama; la luz que llega a la piel se corrige a 2700-3000 K | Luz principal (key). Cálida, suave, parpadeo lento |
| Lámpara de aceite y velas del escritorio | Camera-right, frente a Santa, baja | 1900-2400 K | Relleno cálido (fill) y brillo en el libro |
| Ventana con nieve | Atrás, camera-right, alta | 6500-7500 K, azul tenue | Contraluz (rim) frío en pelo, barba y hombro; separa a Santa del fondo |
| Velas lejanas, brasas y latón del estudio | Fondo | 2200-2700 K | Puntos de bokeh cálido. Sin luces LED de colores, sin luces de fiesta |

Reglas:
1. La chimenea nunca cambia de lado. Si un plano se toma desde atrás de Santa, la chimenea aparece camera-right porque sigue en el mismo lugar físico (no se cruza el eje).
2. La luz principal sale de camera-left en todos los planos de frente. Si el storyboard obliga a cambiarla, es otra escena y se avisa al director.
3. **Luz motivada pero elevada:** la chimenea está baja en el cuarto, pero el key sobre la cara se diseña 10-20° por encima de la línea de los ojos, grande y suave. Nunca luz desde abajo (efecto fogata de terror).
4. Parpadeo: en el cuarto, lento y de amplitud moderada. Sobre la cara y el libro, casi imperceptible (menos de 5-10 % de variación). Cero estrobo (también por seguridad de niños).
5. La ventana aporta frío en los bordes. Nunca ilumina la cara de frente.

---

## 3. Temperatura de color y contraste

- **Balance general:** cálido dominante. Piel alrededor de 3000 K percibidos; ventana azul como único contrapunto frío. Proporción aproximada: 80 % cálido, 20 % frío.
- **Relación de luces en la cara (planos a cámara):** key a fill entre 2:1 y 2.8:1 (1 a 1.5 pasos). Suave, sin sombras duras.
- **Fondo:** 2 a 3 pasos por debajo de la cara, salvo las fuentes visibles (llama, velas), que pueden quemar un poco pero con halo, no con recorte duro.
- **Negros:** levantados un poco (no aplastados). Se debe ver madera y textura en las sombras.
- **Altas luces:** caída suave (roll-off tipo película), sin blancos quemados en piel ni en el ribete blanco del traje.
- **Halación y bloom:** muy leves alrededor de llamas y velas. Grano fino de 35 mm, apenas perceptible en teléfono.
- **Viñeta:** sutil y natural del lente, no pintada.

### Piel creíble (criterio central)
- Textura visible: poros, líneas de expresión, venitas leves en nariz y mejillas, arrugas alrededor de los ojos.
- Dispersión subsuperficial: orejas y nariz con calidez translúcida bajo el key de chimenea.
- Brillos especulares pequeños e irregulares en frente, nariz y pómulos. Nunca un brillo parejo y aceitoso.
- Ojos con reflejo (catchlight): uno cálido grande (chimenea/lámpara) y uno azul pequeño (ventana). Ojos sin reflejo = ojos muertos = repetir.
- Cejas, bigote y barba con pelos sueltos y volumen irregular, no peinado de peluca.
- Prueba de cera: ampliar al 200 % en la mejilla. Si parece cera, plástico o piel de muñeco, se repite sin discusión.

**Vocabulario EN (look general, para toda toma):**
```
cinematic Christmas film look, shot on 35mm tungsten film stock, warm practical lighting,
soft contrast, lifted blacks, gentle highlight roll-off, fine film grain, subtle halation
around candle flames, natural skin texture with visible pores and fine wrinkles,
subsurface scattering on ears and nose, no beauty filter, no skin smoothing,
180-degree shutter motion blur, 24fps, photorealistic, not CGI, not an animation
```

---

## 4. Planos del piloto

Equivalencias de lente en fotograma completo (full-frame). Alturas medidas desde el piso. Todos los planos con cara de Santa respetan la geometría de la sección 2.

Resumen:

| # | Plano | Lente | Altura cám. | Movimiento | Boca visible / labios | Modelo sugerido |
|---|---|---|---|---|---|---|
| P1 | General del estudio | 24-28 mm | 1.10 m | Dolly-in 3-5 % o fijo | No (Santa pequeño, lejos) | Quality |
| P2 | Medio de Santa en el escritorio | 50 mm | 1.05 m | Dolly-in muy lento 2-3 % | Sí pero sin hablar al lente (mira el libro) | Quality |
| P3 | Primer plano a cámara (dice el nombre) | 85 mm (o 100 mm) | 1.05 m | Fijo (lock-off) | Sí, con labios sincronizados | Quality + sincronización de labios |
| P4 | Inserto del libro (nombre dorado) | 50-65 mm | Cenital sobre el escritorio | Fijo | No | Quality (libro limpio) + FFmpeg |
| P4b | Inserto del libro pasando páginas | 50-65 mm | 30-45° | Fijo o 1-2 % | No | Quality o Fast |
| P5 | Inserto de manos | 85-100 mm macro | 30-45° | Fijo o 2 % | No | Fast, y Quality si Fast falla |
| P6 | Reacción / guiño | 85 mm | 1.05 m | Fijo | Boca cerrada, sonrisa | Quality |
| S1-S3 | Planos "sin boca" (sección 5) | varios | varios | lentos | No, diseñados | Quality o Fast |

### P1 · Plano general del estudio
- **Encuadre:** Santa sentado tras el escritorio en el tercio central, pequeño; en primer plano el borde del escritorio y el libro; chimenea y ventana legibles al fondo; nieve cayendo tras el vidrio.
- **Lente / altura:** 24-28 mm, 1.10 m. Profundidad de campo media (f/4 look) para que el estudio se lea, con fondo apenas suave.
- **Movimiento permitido:** dolly-in recto de 3-5 % en 8 s, o fijo. Sin paneos.
- **Luz:** chimenea camera-left (key de ambiente), ventana azul atrás camera-right, velas y lámpara del escritorio como acentos cálidos. Santa lejos: su cara no se lee en detalle, así que aquí no hay prueba de labios.
- **9:16:** composición vertical: vigas de pino arriba, Santa y escritorio al centro-bajo. La chimenea queda en el borde izquierdo (se ve más su resplandor que el objeto).
- **EN:** `wide establishing shot of a cozy wooden Santa's study at night, 24mm lens, camera at child's eye height, slow dolly-in, warm tungsten glow from stone fireplace camera-left, cool blue snow-light through window back camera-right, candles and oil lamp on the desk, falling snow outside, soft haze, deep depth of field, cinematic`

### P2 · Plano medio de Santa en el escritorio
- **Encuadre:** de la cintura hacia arriba, Santa de tres cuartos a cámara, mirando el libro abierto; escritorio y libro en el tercio inferior. Deja aire encima de la cabeza.
- **Lente / altura:** 50 mm, 1.05 m, desenfoque medio (f/2.8 look).
- **Movimiento:** dolly-in de 2-3 %. Cabeza con movimientos pequeños y naturales (hojear, sonreír).
- **Luz:** key suave de chimenea camera-left a ~45°; fill cálido de la lámpara camera-right a menos 1 paso; rim azul tenue de la ventana en el borde derecho del pelo y la barba.
- **EN:** `medium shot of Santa seated at a wooden desk reading a large open book, 50mm lens, shallow depth of field, camera slightly below eye line, soft warm tungsten key light from fireplace camera-left at 45 degrees, warm oil-lamp fill camera-right, subtle cool blue rim light from window behind him camera-right, gentle dolly-in`

### P3 · Primer plano a cámara (dice el nombre, con sincronización de labios)
Es el plano más importante del producto y el más difícil de aprobar.
- **Encuadre:** pecho hacia arriba con aire sobre la cabeza ("medium close-up", no primerísimo primer plano). Ojos en el 38-40 % superior del cuadro en 9:16; boca cerca del 46-48 %. Mirada directa al lente. Cara casi frontal (giro máximo de 10° a cada lado).
- **Lente / altura:** 85 mm (100 mm si se ve apretado), 1.05 m, f/1.8-2.8 look: fondo muy desenfocado con bokeh cálido de velas, latón y el resplandor de la chimenea.
- **Movimiento:** cámara fija. Si el director pide vida, empuje lineal de máximo 2 % en 8 s. Nunca paneos ni inclinaciones.
- **Luz:**
  - Key: fuente grande y suave desde camera-left, 35-45° del eje y 10-20° sobre los ojos (motivada por la chimenea). Luz tipo "loop": sombra de la nariz pequeña, que no llega al labio superior.
  - Fill: camera-right, calidez de lámpara/velas, 1 a 1.5 pasos por debajo del key. Lo suficiente para abrir la zona de la boca y el cuello.
  - Rim: azul de ventana atrás camera-right, bajo, solo contorno de pelo y hombro.
  - La zona de la boca queda dentro de 1/3 de paso respecto a las mejillas: sin sombra bajo el bigote, sin sombra de la nariz sobre los labios, sin sombra dura bajo el labio inferior.
- **EN:** `medium close-up of Santa looking directly into the lens, 85mm portrait lens, f/1.8 shallow depth of field, creamy warm bokeh of candle flames and brass, camera at child's eye height, locked-off static camera, large soft warm tungsten key light from fireplace camera-left slightly above eye level, warm bounce fill camera-right, faint cool blue rim light from snow window behind him, evenly lit mouth and lips, no hard shadows on face, catchlights in both eyes, calm friendly expression, natural skin texture`

### P4 · Inserto del libro (aquí se compone el nombre) · ver sección 6
### P4b · Inserto del libro pasando páginas ("busca al niño")
- Cámara a 30-45° sobre el escritorio, 50-65 mm, fija o con deriva de 1-2 %. Las manos pasan páginas con calma (sin gestos rápidos).
- Luz: lámpara de aceite arriba camera-right y chimenea camera-left lateral; papel mate, sin brillos duros; polvo y partículas mínimos.
- **EN:** `close-up of an old leather-bound ledger on a wooden desk, bare aged hands slowly turning cream pages, 50mm lens at 40 degrees, shallow depth of field, warm oil-lamp light from above camera-right, fireplace glow from camera-left, matte aged paper, calm slow motion of pages`

### P5 · Inserto de manos
- **Encuadre:** manos de Santa y el borde del libro; un dedo recorre la lista o toca un renglón. Una sola acción por toma.
- **Lente / altura:** 85-100 mm macro, 30-45° sobre el escritorio. Fondo desenfocado.
- **Movimiento:** fijo o deriva de 2 %.
- **Luz:** misma dirección que P2/P3 (chimenea camera-left como key lateral, lámpara camera-right como fill). La piel de las manos con la misma temperatura que la cara.
- **Riesgo de IA:** dedos de más, dedos fundidos, movimientos rápidos. Regla: cinco dedos siempre visibles y definidos, un gesto simple, lento. Si hay un dedo de más en cualquier fotograma, repetir.
- **EN:** `macro close-up of Santa's weathered hands, five fingers clearly defined, one index finger slowly sliding down a handwritten list in an old book, 100mm macro lens, shallow depth of field, warm tungsten key from fireplace camera-left, soft oil-lamp fill camera-right, natural skin texture, slow deliberate movement`

### P6 · Reacción / guiño
- **Encuadre y lente:** igual que P3 para que corte sin saltos (85 mm, 1.05 m, fijo).
- **Acción:** Santa levanta la vista, sonríe con la boca cerrada o apenas abierta y hace un guiño lento. Duración ≤ 4 s.
- **Luz:** idéntica a P3 (mismo key, fill y rim). Es la toma gemela de P3 en luz.
- **Regla:** sin voz y sin boca hablando. Una risa ("jo, jo, jo") con la boca abierta necesitaría sincronización de labios: va como toma de P3, no como P6.
- **EN:** `medium close-up of Santa, 85mm portrait lens, shallow depth of field, he looks up from the book into the lens, a warm closed-mouth smile and one slow gentle wink, locked-off camera, same warm tungsten key from fireplace camera-left, soft fill camera-right, faint blue rim light behind`

---

## 5. Planos donde Santa dice el nombre sin mostrar la boca (diseñados a propósito)

Son parte del diseño del video gratis (15 s) y de lo personalizado en el video 1 que va en voz en off. No son un parche: tienen composición y luz propias.

| Plano | Qué se ve | Lente / altura | Luz |
|---|---|---|---|
| S1 · Sobre el hombro (over-the-shoulder) | Espalda y hombro de Santa en primer plano desenfocado; el libro iluminado al centro; chimenea al fondo (aparece camera-right) | 50 mm, 1.10 m, fijo o dolly-in 2 % | Chimenea contraluz lateral sobre el hombro y el libro; lámpara ilumina la página |
| S2 · Libro con manos | Inserto cenital o a 35° del libro; el dedo baja por la lista | 50-85 mm | Lámpara arriba, luz pareja |
| S3 · Ojos sobre el libro | Santa levanta el libro y solo se ven la frente, el pelo blanco y los ojos con brillo; la boca queda tapada por el libro y la barba | 85 mm, 1.05 m, fijo | Mismo key camera-left sobre los ojos; el libro hace sombra suave en la parte baja de la cara (aquí sí es intencional) |
| S4 · Perfil leyendo (opcional) | Perfil de Santa leyendo, cara girada más de 45°, labios no legibles | 85 mm | Key de chimenea de perfil; rim azul |

Regla: nunca un plano donde se vea la boca moviéndose sin sincronizar. Si Santa mira al libro y la voz dice el nombre, los labios no se ven (S1-S4) o Santa permanece con la boca cerrada.

**EN S1:** `over-the-shoulder shot from behind Santa's left shoulder, out-of-focus shoulder of a thick felted wool coat in deep classic Christmas red and white hair in foreground, glowing open book on the desk in sharp focus, fireplace glow in the background frame-right, 50mm lens, warm key from fireplace, oil-lamp light on the pages, shallow depth of field, locked-off`
**EN S3:** `close-up of Santa peeking over the top edge of a large open book, only forehead, white hair and twinkling eyes visible, lower face covered by the book, 85mm lens, shallow depth of field, warm tungsten key camera-left, catchlights in the eyes, warm friendly look`

---

## 6. Reglas para sincronización de labios (planos P3 y toda toma con labios)

La sincronización de labios (Sync Labs, ~20 s de los 60 s) solo funciona bien sobre una boca limpia y estable. Cada una de estas reglas es criterio de repetir.

**Boca e iluminación**
1. Boca siempre bien iluminada: sin sombra bajo el bigote ni bajo el labio inferior. Key suave de frente-lateral a 35-45° y fill que abra la zona.
2. **Labios visibles.** El bigote no puede tapar el labio superior: bigote recortado justo sobre el labio superior (arte 1.3, decisión c de la biblia), con la comisura de los labios legible y la barba partida bajo el labio inferior. Si el borde rojo del labio superior no se ve en al menos el 60 % del ancho de la boca en la fija, o en el 90 % de los cuadros de habla, el plano no aprueba.
3. Brillo estable sobre labios y dientes: sin dientes demasiado perfectos ni "de porcelana"; sin brillos que parpadeen con la llama.
4. Sin humo, vapor, ramas, velas ni llamas entre el lente y la boca. Nada pasa delante de la cara.
5. Lentes redondos dorados con vidrio sin reflejo, bajos en la nariz: el reflejo del fuego va en la córnea, nunca en el vidrio sobre los ojos.

**Cabeza y cámara**
6. Cabeza estable: giro frontal con máximo ±10° (el modelo de labios pierde precisión pasados ~15-20°). Sin giros bruscos, sin asentir fuerte, sin inclinar la cabeza hacia abajo.
7. Manos, libro y objetos fuera de la zona de la cara. Nada toca la barba o la boca.
8. Cámara fija o empuje lineal de máximo 2 %. Sin cambios de enfoque (rack focus) durante el habla.
9. Duración ≤ 8 s por toma (límite de cada clip). Una frase corta por toma; el nombre cae a mitad, no en el primer ni en el último segundo.
10. Inicio y fin de cada toma con Santa en posición neutra y boca cerrada (0.3-0.5 s) para que corte limpio y la sincronización no deforme el primer fotograma.
11. Expresión: sonrisa tranquila de abuelo, cejas relajadas. Nada de expresiones exageradas (la boca generada y la boca sincronizada deben coincidir en forma).
12. Parpadeo de la llama sobre la cara: casi imperceptible (menos de 5 %), para que no choque con los cuadros re-generados por la sincronización.
13. Luz idéntica en todas las tomas P3 de un mismo video: mismas posiciones y valores. Así los cortes entre tomas de labios no saltan.

**Entrada y salida a la sincronización (para `video-ia-generativa`)**
- Pasar a la herramienta de labios el clip original sin recorte ni reescalado, con la voz limpia de ruidos y sin música.
- Si la sincronización cambia el tono de piel o la nitidez de la zona de la boca, se corrige en postproducción; si se ve una "máscara" alrededor de la boca, repetir.

**EN (restricciones de generación):** `Santa faces the camera directly, head perfectly still and level, no head turns, no nodding, mouth and lips fully visible and evenly lit, trimmed moustache that does not cover the upper lip, neutral closed-mouth start and end, calm friendly expression, nothing passes in front of his face, locked-off camera`

---

## 7. Inserto del libro donde se compone el nombre (P4)

El nombre dorado lo compone FFmpeg, no la IA generativa. La toma debe ser una "pantalla" limpia y estable.

**Cámara**
- **Opción A (preferida):** cenital a 90° (top-down), 50-65 mm, cámara fija. Sin perspectiva que corregir; composición exacta.
- **Opción B:** 30-45° sobre el escritorio, cámara fija y sin deriva (máximo 1 % en 8 s), para seguir el plano de la página con tracking plano en edición. Más bonita, más trabajo.
- Nunca movimiento de cámara rápido, nunca zoom, nunca giro.

**Página**
- Página plana, sin ondulación, sin arrugas ni curvatura marcada en la zona del nombre. Libro sostenido con cinta o pisapapeles de bronce fuera de la zona.
- Papel crema mate y envejecido (no brillante). Sin letras ni dibujos en la "zona del nombre": rectángulo central de ~70 % del ancho y ~20 % del alto de la página, ligeramente por encima del centro.
- Renglones muy tenues permitidos solo si arte los diseña como guía; no deben cruzar la zona de forma que choquen con el dorado.

**Luz**
- Pareja sobre toda la página: relación máxima de 1.5:1 entre un extremo y otro. Fuente grande y suave de lámpara de aceite arriba (camera-right) más relleno de chimenea camera-left.
- Sin sombras de manos, mangas ni cabeza sobre la zona. Las manos salen de cuadro antes de que aparezca el nombre.
- Sin parpadeo visible sobre la página (menos de 3 %). Sin brillos especulares en el papel.
- Dorados del marco o del lomo fuera de la zona del nombre, para que no compitan.

**Tiempos**
- Toma de 8 s: 2 s de entrada (manos o página asentándose), mínimo 5 s de página quieta y limpia. El nombre se anima encima durante 2-3 s y se sostiene.
- Se pide siempre una variante con la página vacía como placa limpia (clean plate).

**Efecto del nombre (guía para `video-edicion-post`)**
- Dorado cálido con textura de tinta metálica, con un resplandor tenue y breve. Mismo dorado que el libro (hoja de color, sección 9). Sin brillos tipo neón, sin letras que flotan sobre la página: deben sentirse escritas, con sombra mínima pegada al papel.

**EN:** `top-down overhead shot of an open antique ledger lying flat on a wooden desk, perfectly flat cream matte paper pages with empty centered writing area, 50mm lens, locked-off camera, soft even warm lamplight from above, no cast shadows, no glare, no page curl, nothing moving in frame, shallow depth of field on the wood edges only`

---

## 8. Encuadre 9:16 sin perder el 16:9 (zona segura)

**Decisión:** el 9:16 es el master (la mayoría ve en teléfono). Se genera nativo en 9:16. La versión 16:9 se genera nativa en 16:9 a partir de la misma imagen fija aprobada (extendida a los lados). No se recorta un 16:9 a 9:16: un recorte vertical de un 1080p entrega solo 608x1080 y obliga a ampliar la imagen 1.78x (pierde calidad de piel).

**Cómo componer para que ambos formatos funcionen**
- **Zona de acción 9:16:** la columna central, 31.6 % del ancho del 16:9 (≈ 608 px de 1920). Todo lo importante (cara, libro, manos, nombre) va dentro de esa columna, centrado.
- **Alas del 16:9:** los lados llevan atmósfera: chimenea a la izquierda, ventana a la derecha, estantes y vigas. Son ambientación, nunca información que la historia necesite.
- **Márgenes verticales (ambos formatos):** nada importante en el 8 % superior ni en el 15 % inferior (controles del reproductor y marca "jinglo.app" del video gratis en la esquina inferior derecha).
- **Cara:** en 9:16 la cara ocupa 45-55 % del ancho del cuadro en P3; en 16:9 ocupa ≈ 25-30 % del ancho, con el mismo tamaño relativo respecto de la altura. Misma altura de ojos (38-40 % desde arriba) en ambos formatos para que el corte entre formatos sea predecible.
- **Libro (P4):** en 9:16 el libro ocupa ~85-90 % del ancho; en 16:9, ~45 %. La zona del nombre queda siempre centrada.
- **Prueba rápida:** sobre la imagen fija 16:9, trazar la columna central 9:16. Si se pierde algo esencial fuera de ella, se recompone antes de generar.
- **Luz:** misma geometría en ambos formatos. En 9:16 se ven menos las fuentes (chimenea, ventana); su luz se percibe en la cara y en el bokeh de los bordes, por lo que cada borde del 9:16 debe tener un acento (resplandor cálido a la izquierda, tono azul tenue a la derecha).

---

## 9. Hoja de color de referencia

Valores orientativos (sRGB) para imágenes fijas, selección de tomas y corrección de color. No son un filtro único: son metas a verificar con cuentagotas o con el vectorscopio. Se afinan cuando exista la primera imagen fija aprobada, que pasa a ser la referencia maestra.

| Elemento | Luz alta | Tono medio | Sombra | Notas |
|---|---|---|---|---|
| Piel de Santa (con key de chimenea) | #E9B890 | #C98B66 | #8A5240 | Sobre la línea de piel del vectorscopio. Sin verdes ni magentas. Orejas y nariz un poco más rojizas |
| Rojo del traje | #B8343A | #9C1F27 | #5C1017 | Rojo navideño clásico y profundo, de lana tupida y mate (valores de arte 1.7). No rojo puro, saturado ni anaranjado; sin brillo satinado |
| Ribete de borrego natural | #F6F0E2 | #EFE7D6 | #A8997F | Blanco cálido de rizo irregular (valores de arte 1.7). Nunca blanco puro ni quemado |
| Dorados (libro, ornamentos, nombre) | #F2D27A | #C9A24B | #6E5420 | Dorado mantecoso, no amarillo limón ni cobre |
| Madera del estudio | #8A5A34 | #5A3A22 | #25160D | Nogal oscuro cálido |
| Llama de la chimenea | #FFC76A | #FF9A3C | #B5461A | Brillo permitido hasta halo, sin recorte plano |
| Azul de la ventana (rim y nieve) | #A9C4E6 | #5F86B8 | #243A5C | Solo en bordes y fuera del cuarto. Nunca en la cara |
| Papel del libro | #EBDDBB | #D5C195 | #A58F63 | Crema envejecido, mate |

**Límites generales (para `video-edicion-post`)**
- Luces de piel: aprox. 60-70 IRE; punto negro levantado aprox. 5-8 %; tope de altas luces ≈ 95 % con caída suave.
- Balance: tonos medios cálidos; la única dominante fría es el azul de ventana/nieve. Si toda la imagen se vuelve azul-verde o naranja uniforme, se corrige.
- Saturación: rojos y dorados ricos pero contenidos. Sin recorte de canal rojo en el traje.
- Aplicar el mismo LUT/look a todas las tomas de la escena; solo ajustes finos por toma (exposición, balance de piel).
- Igualar la piel de Santa entre tomas P2, P3, P6 y manos (P5) a la imagen fija maestra con tolerancia ±5 % en tono y ±0.3 pasos en luminosidad.
- Revisar que la zona de la boca sincronizada coincida en color, grano y nitidez con el resto de la cara.
- Grano y halación se aplican al final y unificados a toda la secuencia (también sobre la composición de FFmpeg) para que el nombre dorado y el libro no se vean pegados.

---

## 10. Revisión: aprobado / repetir

Se revisa primero la **imagen fija** (obligatoria antes de generar video) y luego cada **toma**. Resultado siempre escrito: `APROBADA` o `REPETIR`, con el motivo en una línea y qué cambiar en las instrucciones. Con 6 tomas por plano, se elige la mejor aprobada. Si un plano no se logra tras 8 intentos, se rediseña con `video-director-creativo`.

### 10.1 Criterios que descartan de inmediato (REPETIR)
1. Piel de cera, plástico o sobre-suavizada (prueba al 200 %).
2. Luz plana o sin dirección clara; o luz principal que no viene de camera-left.
3. Cualquier luz que viene de abajo de la cara.
4. Parpadeo fuerte o estrobo.
5. Sombras duras sobre la boca (bigote, nariz).
6. (P3) Cabeza girando más de 10°, asintiendo o con movimiento brusco; boca tapada por bigote, mano, libro, humo o llama.
7. (P3) Ojos sin reflejo, mirada que no va al lente, bizqueo o mirada que "se desliza".
8. Manos con dedos de más, fundidos o deformes.
9. Texto, letras o símbolos generados en el libro (el nombre lo pone FFmpeg), marcas de agua, logotipos.
10. Elementos de marcas o películas ajenas; traje o utilería que no coincide con la biblia de arte.
11. Cualquier cosa que asuste: primer plano invasivo, rostro deformado, oscuridad casi total, brillo o ruido fuerte en el cuadro.
12. Rojo del traje fuera de la hoja de color (rosa, naranja, saturado quemado) o dorados amarillos/verdosos.
13. Cambio de objetos entre tomas de la misma escena (el libro cambia, la lámpara aparece o desaparece).

### 10.2 Lista de verificación por tipo de toma

| Toma | Debe cumplir | Aprobada si |
|---|---|---|
| P1 General | Estudio legible, geometría de luz correcta, Santa en el centro 9:16, nieve creíble | Sin elementos deformes; los 3 puntos de luz (chimenea, ventana, velas) coinciden con el mapa |
| P2 Medio | Santa natural, 3/4, mira el libro; key camera-left, rim azul suave | Piel viva, sin cera; manos y libro limpios |
| P3 A cámara | Todas las reglas de la sección 6 | Cumple 100 % de los puntos 1-13 de la sección 6 y la prueba de cera |
| P4 Libro | Página plana, luz pareja, zona del nombre vacía, cámara fija | ≥ 5 s de página quieta y limpia; sin sombras ni brillos; deriva ≤ 1 % |
| P4b Páginas | Páginas que pasan con calma, sin papel deformado | Sin letras generadas legibles; manos correctas |
| P5 Manos | Cinco dedos, gesto simple, misma luz y color de piel que la cara | Ningún fotograma con dedos erróneos |
| P6 Reacción | Gemela de luz de P3; guiño suave, boca cerrada | Guiño natural (no caricaturesco); mismo look que P3 |
| S1-S4 | Boca no visible o tapada a propósito; composición intencional | No se ve ningún movimiento de labios sin sincronizar |

### 10.3 Continuidad (cero saltos en el corte final)
- Misma dirección de luz en toda la escena; mismas posiciones y valores en todas las tomas P3.
- Temperatura de piel igual entre tomas vecinas (±5 % de tono).
- Utilería idéntica entre planos: libro, lámpara, velas encendidas en el mismo número, estado de la chimenea, nieve afuera.
- Posición de Santa y altura de ojos coherentes entre planos del mismo diálogo.
- Lentes, bigote y barba iguales en todas las tomas; cabeza siempre descubierta.
- Al elegir entre tomas aprobadas, gana la que mejor empata con la toma anterior y la siguiente, no la más bonita en solitario.

### 10.4 Plantilla de registro (por toma)
```
Plano: P3 · Toma: 04 · Formato: 9:16
Resultado: REPETIR
Motivo: bigote cubre labio superior y la llama parpadea sobre la mejilla (sec. 6, puntos 2 y 12)
Cambiar: pedir bigote recortado y levantado; bajar intensidad de la llama; key más suave camera-left
```

---

## 11. Vocabulario técnico en inglés (referencia rápida)

**Cámara y lente**
`85mm portrait lens`, `50mm lens`, `24mm wide-angle lens`, `100mm macro lens`, `shallow depth of field`, `creamy bokeh`, `locked-off camera / static tripod shot`, `slow dolly-in`, `top-down overhead shot`, `high-angle shot at 40 degrees`, `eye-level at a child's height`, `over-the-shoulder shot`, `medium close-up`, `rack focus` (evitar en labios)

**Luz**
`warm tungsten key light from fireplace camera-left`, `large soft key light`, `warm bounce fill from camera-right`, `cool blue rim light from snow window behind subject`, `practical lights: candles and oil lamp`, `motivated lighting`, `soft contrast`, `catchlights in the eyes`, `gentle flicker of firelight`, `evenly lit face`, `no hard shadows`, `even soft overhead lamplight`

**Color y textura**
`warm color palette`, `deep classic red wool`, `buttery gold`, `lifted blacks`, `gentle highlight roll-off`, `35mm film grain`, `subtle halation around candle flames`, `subsurface scattering on skin`, `natural skin texture with pores and fine lines`, `matte aged paper`

**Para evitar (si la herramienta acepta negative prompt; si no, expresarlo en positivo)**
`plastic skin, waxy skin, over-smoothed skin, beauty filter, flat lighting, harsh shadows on face, light from below, strobing flicker, extra fingers, deformed hands, text, letters, watermark, logo, cartoon, CGI look, oversharpened, neon colors, handheld shake, fast zoom`

**Plantilla de instrucción por plano**
```
[tipo de plano] of [sujeto y acción], [lente], [apertura/desenfoque], [altura y movimiento de cámara],
[key: color, lado, altura], [fill], [rim], [fondo y bokeh], [textura de piel/material],
[formato 9:16 o 16:9], cinematic Christmas film look, 35mm, 24fps
```

---

## 12. Decisiones mías y pendientes

**Decido yo (sin escalar):** luz, encuadre, color, lentes, alturas y criterios de aprobación de este documento.

**Pendiente con otros agentes**
- `video-direccion-arte`: resuelto en `arte.md` v1.1: bigote recortado sobre el labio superior (los dos labios visibles); lentes redondos dorados sin reflejo y bajos en la nariz, con el corte de seguridad de la decisión c; manos desnudas; papel y encuadernación del libro (mate, sin dorados dentro de la zona del nombre). Pendiente: confirmación de Juan entre los candidatos "2" y "4" del Santa maestro.
- `video-ia-generativa`: confirmar si Flow permite fijar 9:16 y 16:9 nativos desde la misma imagen fija y si acepta negative prompt; si no, convertir los "evitar" a positivos.
- `video-edicion-post`: confirmar tracking plano para la opción B del libro; recibir la hoja de color y fijar un LUT único.
- `video-director-creativo`: si el storyboard necesita cambiar de lado la luz principal, se declara como escena nueva; decidir si el guiño (P6) y la risa van o no en el piloto.
