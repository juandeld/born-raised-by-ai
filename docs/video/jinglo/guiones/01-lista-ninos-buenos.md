# Guion 01 · La Lista de Niños Buenos (~60 s; 53 s para 3 a 4 años)

Versión `guion-v1.2` · 11-nov-2026 · `video-guionista` · Para: `video-director-creativo` (storyboard), `video-voz-santa`, `video-ia-generativa`, `video-psicologia-padres` y `legal-compliance` (revisión), `video-control-calidad` (lista de palabras prohibidas).
Brief: `docs/briefs/jinglo-video-piloto.md`. Voz y reglas de Santa alineadas con `docs/legal/textos/07-guardrails-agente-voz.md` (C-03, C-04, C-06, C-07, E-01 a E-03), la decisión D13 de `docs/decisiones.md`, `docs/video/jinglo/biblia.md` y `docs/video/jinglo/revision-piloto.md` (`desarrollo-infantil`, cambios C1 a C6 y sugerencias S1 a S3).

## Changelog v1.3 (12-nov-2026, aprobado por Juan)
- T1 sin "tamales": "¡Joo, joo, jo, joo! Qué noche tan bonita en el Polo Norte. Hoy abro mi Gran Libro." (Juan: la frase de tamales suena mal).
- Risa única "¡Joo, joo, jo, joo!", generada una vez y reutilizada en T1 y T8.
- Texto completo del video 1 aprobado por Juan.

## Changelog

**v1.2 · 11-nov-2026.** Asienta en disco los textos `guion-v1.1` que solo estaban en el storyboard y aplica la revisión de desarrollo infantil (`revision-piloto.md`).

Textos v1.1 incorporados desde el storyboard:
- Los 8 tramos T1 a T8 quedan atados a los planos V1-01 a V1-09 (el guiño V1-08 no lleva voz). Ventanas y máximos de caracteres de storyboard sección 6.
- T1 sin "ponche". T3 "{nombre}… ¡aquí estás! ¡Tu nombre brilla!" con "A ver, a ver…" fijo antes. T4 "¡Hola, {nombre}! Ya tienes {edad} años." más 2 s de calma. T5 "Tu familia me escribió una carta." + "Dice que {logro}. ¡Qué orgullo!". T7 abre con "¿Sabes una cosa, {nombre}?". T8 nueva: "¡Feliz Navidad, {nombre}! Se nota cuánto te quieren en tu casa. ¡Joo, joo, jo, joo!".
- `{nombre}` hasta 16 caracteres (biblia 8.1; antes 14). La edad ya no se dice en T3 sino en T4.

Cambios obligatorios de `revision-piloto.md`:
- **C1.** T6 (Niño Dios): "Sé que en tu casa quieren mucho al Niño Dios. ¡Qué bonito!", sin "mucho" para 3 a 4 años. Desaparecen "a tu casa también llega" y "le mando un saludo". Etiqueta de la casilla propuesta: "En casa queremos mucho al Niño Dios".
- **C6.** Fuera "ponche", "le mando un saludo", "Mis duendes trabajan en algo especial" y el taller de duendes. T6 "Ninguno" dice "estudio", no "taller". T8 no menciona regalo en ningún tramo.
- **S1.** "Gracias por ser tú." reemplaza a "Sigue con ese gran corazón." en todas las edades (3 a 4 conserva "¡Un abrazo grande!").
- **S2.** Variante 3 a 4 sin T2 (V1-02): el nombre se dice a los 0:10,7 y el video baja a 53 s.
- **S3 y guiño.** Variante 3 a 4: "¡Qué bien!" en T5 y V1-08 sin el guiño (solo la sonrisa, 1,5 s).
- Lista de palabras y frases prohibidas ampliada (sección 0 y 7). Nunca secretos ni susurros.

Pendiente de otros (no se aplicó aquí): C4 y V1-06b (director creativo), C3 y C5 (director, voz, sonido), visto bueno de `legal-compliance` a C1.

## 0. Reglas de este guion (checklist para QA)

- Español latino neutro (es-419, México neutro), nunca de España: "ustedes", "bonito", "platicar". Prohibido "vale", "vosotros", "ordenador", "chamaco", "guay", "mola", "chaval", "Papá Noel", "patojo", "cipote".
- Frases de 12 palabras o menos; una idea por frase.
- El nombre se dice 4 veces (T3, T4, T7, T8), siempre dentro de una frase y junto a palabras cortas y comunes ("¡Hola, {nombre}!", "¡Feliz Navidad, {nombre}!"), nunca pegado a otra palabra difícil.
- Santa nunca dice IA, robot, computadora, grabación, "soy humano" ni "soy una persona", ni habla de "mi voz" (D13). Es Santa y habla desde el Polo Norte (E-01 y E-03). El video no responde preguntas, así que no usa E-01 a E-03, pero no las contradice.
- **Nunca promete ni insinúa un regalo.** No hay ninguna mención. Prohibidos: "regalo", "sorpresa", "algo especial", "este año", "lo que pediste", "te traeré", y todo taller de duendes. "Un nombre muy especial" (T2) es el único "especial" permitido: habla de un nombre, no de un regalo.
- Sin regaños ni "niños malos". Solo refuerzo positivo (C-04). Santa no dice "te veo" ni "te vigilo": sabe porque "tu familia me escribió una carta". Nada que haga depender algo de seguir portándose bien: nada de "sigue con…", "si sigues…", "no dejes de…".
- **Sin secretos ni susurros** (C2). Prohibido "solo para ti", "es un secreto", "no se lo digas a nadie". Toda la voz es cálida y normal.
- **Niño Dios (C1).** Solo la frase exacta de T6, solo con casilla marcada y solo en voz en off. Prohibido aplicado al Niño Dios: "llega", "viene", "trae", "también", "con Santa", "le mando un saludo", y cualquier frase que lo ponga en el mismo plano que Santa o diga quién trae qué. "En cada casa la Navidad llega a su manera" es la frase exacta y habla de la Navidad, no del Niño Dios.
- Sin marcas ni personajes ajenos: no Rudolph, no renos con nombre propio. No hay duendes ni taller en el piloto.
- Sin adjetivos con género sobre el niño (nada de "bueno/buena", "contento/a"). "Lista de Niños Buenos" es nombre propio con plural genérico. Los adjetivos de Santa sobre sí mismo ("orgulloso") sí valen.
- Guiño local: solo "tamales" en T1, dicho como tradición general ("llega el olor a…"), sin afirmar que la familia lo celebre (A-05b). Nada de bebidas: "ponche" es alcohol en Panamá. La taza de la escena puede verse; nunca se nombra.
- Las cifras se dicen con letras ("cinco", no "5") para el motor de voz.

## 1. Huecos

| Hueco | Qué es | Obligatorio | Límite | Si falta |
|---|---|---|---|---|
| `{nombre}` | Primer nombre del niño. Compuestos cortos permitidos (María José) | Sí | 16 caracteres | El pedido no avanza |
| `{edad}` | 3 a 9, en letras en el texto (solo se dice en T4) | Sí | 3 a 9 | Se usa el registro 5 a 6 y T4 queda "¡Hola, {nombre}!" |
| `{logro}` | Cláusula en 2.ª persona, pasado: "aprendiste a andar en bicicleta" | No (el adulto puede elegir "No sé, que Santa elija") | 50 caracteres y 9 palabras (6 en 3 a 4 años), para que "Dice que {logro}." no pase de 12 palabras | T5 usa la frase alternativa (sección 3) |
| `{gusto}` | Cláusula en 2.ª persona, presente: "te encanta bailar", "te encantan los dinosaurios" | No | 28 caracteres | T6 omite la frase del gusto (sección 3) |
| `{nino_dios}` | Casilla, desmarcada por defecto. Etiqueta propuesta (C1): "En casa queremos mucho al Niño Dios", con la frase exacta que oirá el niño visible debajo. La etiqueta la fija `video-psicologia-padres` | No | booleano | Se asume "no" |

El adulto escribe palabras sueltas; el modelo de texto las convierte en la cláusula ya conjugada y sin género (reglas en la sección 7). Nunca llega al modelo ni al guion otro dato del formulario (apellido, ciudad, país). La ayuda opcional "¿Cómo se pronuncia?" (biblia, decisión g) solo va al motor de voz.

## 2. Guion base (5 a 6 años) con marcas de tiempo

Cada plano sale de un clip de 8 s y se recorta. Voz a unos 15 caracteres por segundo, sin contar las pausas marcadas. Los máximos son las ventanas de voz del storyboard sección 6.

| Tramo | Plano | Tiempo | Qué se ve | Qué dice Santa (5 a 6 años) | Tipo | Ventana | Máx. car. |
|---|---|---|---|---|---|---|---|
| T1 | V1-01 | 0:00–0:07 | Estudio de noche, luz de chimenea y velas, nieve tras la ventana. Santa pequeño, de frente, cabeza baja, abre el Gran Libro con las dos manos | "¡Joo, joo, jo, joo! Qué noche tan bonita en el Polo Norte. Hoy abro mi Gran Libro." (0:00,8–0:06,3) | [FIJO] | 5,5 s | 82 (texto: 80) |
| T2 | V1-02 | 0:07–0:13 | Sobre el hombro: pasa páginas con nombres dorados borrosos, sin letras legibles | "Aquí están los niños buenos de todo el mundo. Busco un nombre muy especial." (0:07,3–0:12,6) | [FIJO] | 5,3 s | 80 (texto: 75) |
| T3 | V1-03 | 0:13–0:20 | Cenital del libro. El dedo de Santa se detiene en la línea 11 y se retira; la página queda limpia y el nombre se escribe en dorado (FFmpeg) | "A ver, a ver…" (fijo, 0:13,8–0:15,0) · silencio de 0,5 s con música cortada · "{nombre}… ¡aquí estás! ¡Tu nombre brilla!" (0:16,7–0:19,9) | [FIJO] + [PERSONALIZADO-OFF] | 3,2 s tras el silencio | 50 (peor caso: 49) |
| T4 | V1-04 | 0:20–0:27 | Santa levanta la vista al lente, sonríe con boca cerrada, habla y queda 2 s de calma sonriendo | "¡Hola, {nombre}! Ya tienes {edad} años." (0:21,7–0:24,8) y calma de 2 s sin voz | [PERSONALIZADO-LABIOS] | 3,1 s | 48 (peor caso: 46) |
| T5 | V1-05 | 0:27–0:35 | Cenital: la mano deja la carta de la familia sobre el escritorio; el logro se escribe a mano sobre los renglones | "Tu familia me escribió una carta." (fijo, 0:27,3–0:29,5) · "Dice que {logro}. ¡Qué orgullo!" (0:29,9–0:34,9) | [FIJO] + [PERSONALIZADO-OFF] | 2,2 s + 5,0 s | 33 + 75 (peor caso: 33 + 74) |
| T6 | V1-06 | 0:35–0:42,5 | Santa asoma los ojos sonrientes sobre el libro cerrado (plano sujeto a C4, sección 8) | Según el pedido, 4 combinaciones (sección 3) | [PERSONALIZADO-OFF] | 7,0 s | 105 (peor caso: 104) |
| T7 | V1-07 | 0:42,5–0:50 | Santa a cámara, plano medio, sonrisa cálida | "¿Sabes una cosa, {nombre}? Ya estás en mi Lista de Niños Buenos. Gracias por ser tú." (0:42,9–0:49,6; el nombre cae hacia 0:44,2) | [PERSONALIZADO-LABIOS] | 6,7 s | 100 (peor caso: 92) |
| (T7b) | V1-08 | 0:50–0:52,5 | Mismo encuadre: sonrisa con boca cerrada y un guiño lento | Nada | [FIJO] | — | — |
| T8 | V1-09 | 0:52,5–1:00 | Manos sobre el libro cerrado, dos palmadas suaves, la vela brilla en la estrella. A 0:56,8 la imagen baja a cálido oscuro, título dorado "¡Feliz Navidad, {nombre}!" y "jinglo.app" | "¡Feliz Navidad, {nombre}! Se nota cuánto te quieren en tu casa. ¡Joo, joo, jo, joo!" (0:52,8–0:58,5; risa suave, de pecho, máximo 1,2 s) | [PERSONALIZADO-OFF] | 4,7 s + risa | 71 + risa (peor caso: 70 + risa) |

Totales (versión 5 a 9 años):
- Duración: 60 s, 9 planos.
- Labios: T4 + T7 = unos 11 s procesados. Límite del brief: 20 s.
- Fijo: T1, T2, "A ver, a ver…", "Tu familia me escribió una carta." y V1-08, grabados una sola vez.
- Peor caso de caracteres con nombre de 16, logro de 50 y gusto de 28: cabe en todos los tramos. Si un hueco rebasa el límite, el modelo lo acorta (sección 7); si aún no cabe, se usa la frase alternativa. Si una pieza no cabe en su ventana: primero la variante de edad más corta, después `speed` +0,02 (máximo 0,94); nunca se recorta la calma de T4 ni el silencio antes del nombre.

## 3. Variantes por edad (solo donde cambia el texto)

T1, T3 y T8 son iguales para todas las edades (voz más lenta a 3 a 4 años, sin cambiar palabras). T2 existe solo de 5 años en adelante.

### T2 · se omite en 3 a 4 años (montaje)

| Edad | Qué pasa |
|---|---|
| 3 a 4 | No entra V1-02 (S2). El nombre se oye a los 0:10,7 en vez de a los 0:16,7. "Lista de Niños Buenos" se entiende por T7 ("¿Sabes una cosa, {nombre}? Ya estás en mi Lista…") y por el libro de T1 |
| 5 a 6 y 7 a 9 | Como el guion base |

Tiempos de la versión 3 a 4 años, 53 s: V1-01 0:00–0:07 · V1-03 0:07–0:14 · V1-04 0:14–0:21 · V1-05 0:21–0:29 · V1-06 0:29–0:36,5 · V1-07 0:36,5–0:44 · V1-08 0:44–0:45,5 · V1-09 0:45,5–0:53. El nombre se dice a 0:10,7 · 0:15,7 · 0:38,2 · 0:45,8. `video-musica-sonido` y `video-edicion-post` recolocan música y personalización con estos tiempos.

### T4 · saludo (LABIOS) · la calma de 2 s no se recorta

| Edad | Texto | Car. peor caso |
|---|---|---|
| 3 a 4 | "¡Hola, {nombre}! ¡Tienes {edad} años!" | 45 (edad "cuatro") |
| 5 a 6 | "¡Hola, {nombre}! Ya tienes {edad} años." | 46 |
| 7 a 9 | "¡Hola, {nombre}! Ya tienes {edad} años." | 46 |
| Sin edad | "¡Hola, {nombre}!" (registro 5 a 6) | 24 |

### T5 · carta y logro. Primera frase fija en todas las edades: "Tu familia me escribió una carta."

| Edad | Con `{logro}` | Sin `{logro}` (frase alternativa) |
|---|---|---|
| 3 a 4 (S3) | "Dice que {logro}. ¡Qué bien!" (logro de 6 palabras o menos) | "Leo la carta de tu familia. ¡Habla de cuánto te quieren!" |
| 5 a 6 | "Dice que {logro}. ¡Qué orgullo!" | "Leo la carta de tu familia. Cada línea habla del cariño que te tienen." |
| 7 a 9 | "Dice que {logro}. ¡Felicidades!" (el aplauso de v1 ya no cabe con un logro de 50) | Igual que 5 a 6 |

La frase alternativa no inventa ningún hecho: solo dice lo que es cierto de una carta de la familia. En la carta se escribe solo lo que el adulto puso en el campo 3, ya limpio por los filtros de la sección 6; si el filtro lo descartó, no se escribe nada.

### T6 · gusto y Niño Dios (OFF). Cuatro combinaciones por edad

| Combinación | 3 a 4 | 5 a 6 | 7 a 9 |
|---|---|---|---|
| `{gusto}` y casilla (C1) | "Me contaron que {gusto}. Sé que en tu casa quieren al Niño Dios. ¡Qué bonito!" (98) | "Me contaron que {gusto}. Sé que en tu casa quieren mucho al Niño Dios. ¡Qué bonito!" (104) | Igual que 5 a 6 |
| Solo casilla (C1) | "Sé que en tu casa quieren al Niño Dios. ¡Qué bonito!" (52) | "Sé que en tu casa quieren mucho al Niño Dios. ¡Qué bonito! En cada casa la Navidad llega a su manera." (101) | Igual que 5 a 6 |
| Solo `{gusto}` | "Me contaron que {gusto}. ¡Qué divertido!" (61) | "Me contaron que {gusto}. ¡Qué divertido! Eso me hace sonreír." (82) | "Me contaron que {gusto}. Eso dice mucho de ti." (67) |
| Ninguno | "En mi estudio todo huele a canela." (34) | "En mi estudio todo huele a canela y a galletas." (47) | Igual que 5 a 6 |

Cómo se menciona al Niño Dios: solo con la frase exacta de la tabla, que refleja el cariño de la familia y no describe ni ubica al Niño Dios. Sin "mucho" a 3 a 4 años. Nada de nacimiento, Belén, misa, rezos, "llega", "trae", "también" ni quién trae qué. Santa no confirma ni niega nada sobre los regalos (E-03). Va en voz en off sobre el plano de V1-06, así que el tiempo de labios no cambia. Si `legal-compliance` o `desarrollo-infantil` retiran la casilla, T6 usa solo las filas "Solo `{gusto}`" y "Ninguno"; no se regenera ningún plano.

### T7 · cierre a cámara (LABIOS)

| Edad | Texto | Car. peor caso |
|---|---|---|
| 3 a 4 | "¿Sabes una cosa, {nombre}? Ya estás en mi Lista de Niños Buenos. ¡Un abrazo grande!" | 91 |
| 5 a 6 (S1) | "¿Sabes una cosa, {nombre}? Ya estás en mi Lista de Niños Buenos. Gracias por ser tú." | 92 |
| 7 a 9 (S1) | Igual que 5 a 6 | 92 |

### T7b · guiño (V1-08, sin voz)

| Edad | Qué se usa |
|---|---|
| 3 a 4 | Solo el tramo de sonrisa con boca cerrada, 1,5 s, sin llegar al guiño (a esa edad un guiño se lee como "algo en el ojo" o como secreto). La edición no cuesta créditos |
| 5 a 6 y 7 a 9 | Plano completo de 2,5 s con el guiño lento |

### T8 · despedida (OFF) · igual en todas las edades

"¡Feliz Navidad, {nombre}! Se nota cuánto te quieren en tu casa. ¡Joo, joo, jo, joo!" Para 3 a 4 años, voz lenta y risa corta y suave. La risa nunca pasa de 1,2 s, sin caída a nota grave ni eco, y nunca con boca abierta a cámara.

### Ritmo por edad (para `video-voz-santa`)

3 a 4, lento (unas 100 a 115 palabras por minuto), se acortan los silencios y no las palabras (salvo la pausa antes del nombre y la calma de T4, que no se tocan); 5 a 6, cálido (unas 115 a 130); 7 a 9, natural (unas 125 a 140), sin tono de bebé. Nombre a 85-100 palabras por minuto.

## 4. Variantes por hogar

Dos hogares: **Santa** (casilla desmarcada) y **Santa + Niño Dios** (casilla marcada). Solo cambia T6, en voz en off, sobre el mismo plano. Todo lo demás es idéntico, incluido el decorado (el nacimiento no está en el piloto).

Texto completo con casilla, 5 a 6 años, con `{gusto}`: T1, T2, T3, T4, T5, T7 y T8 no cambian. T6 queda "Me contaron que {gusto}. Sé que en tu casa quieren mucho al Niño Dios. ¡Qué bonito!" (peor caso 104 caracteres, dentro de los 105). Si el `{gusto}` pasa de 28 caracteres, se omite la frase del gusto y queda la fila "Solo casilla". Con casilla marcada y 3 a 4 años, se quita "mucho" (tabla de T6).

## 5. Ejemplos completos

### Ejemplo A · Sofía, 5 años, logro "aprendió a andar en bicicleta", gusto "bailar", casilla marcada (registro 5 a 6)

| Tramo | Tipo | Texto | Car. |
|---|---|---|---|
| T1 | [FIJO] | "¡Joo, joo, jo, joo! Qué noche tan bonita en el Polo Norte. Hoy abro mi Gran Libro." | 80 |
| T2 | [FIJO] | "Aquí están los niños buenos de todo el mundo. Busco un nombre muy especial." | 75 |
| T3 | [FIJO] y [PERS-OFF] | "A ver, a ver…" · "Sofía… ¡aquí estás! ¡Tu nombre brilla!" | 13 y 38 |
| T4 | [PERS-LABIOS] | "¡Hola, Sofía! Ya tienes cinco años." | 35 |
| T5 | [FIJO] y [PERS-OFF] | "Tu familia me escribió una carta." · "Dice que aprendiste a andar en bicicleta. ¡Qué orgullo!" | 33 y 55 |
| T6 | [PERS-OFF] | "Me contaron que te encanta bailar. Sé que en tu casa quieren mucho al Niño Dios. ¡Qué bonito!" | 93 |
| T7 | [PERS-LABIOS] | "¿Sabes una cosa, Sofía? Ya estás en mi Lista de Niños Buenos. Gracias por ser tú." | 81 |
| T8 | [PERS-OFF] | "¡Feliz Navidad, Sofía! Se nota cuánto te quieren en tu casa. ¡Joo, joo, jo, joo!" | 59 + risa |

Nombre: 4 veces. Labios: unos 11 s. Duración: 60 s.

### Ejemplo B · Mateo, 8 años, logro "terminó su primer libro de capítulos", gusto "el fútbol", sin casilla (registro 7 a 9)

| Tramo | Tipo | Texto | Car. |
|---|---|---|---|
| T1 y T2 | [FIJO] | (igual) | 80 y 75 |
| T3 | [FIJO] y [PERS-OFF] | "A ver, a ver…" · "Mateo… ¡aquí estás! ¡Tu nombre brilla!" | 13 y 38 |
| T4 | [PERS-LABIOS] | "¡Hola, Mateo! Ya tienes ocho años." | 34 |
| T5 | [FIJO] y [PERS-OFF] | "Tu familia me escribió una carta." · "Dice que terminaste tu primer libro de capítulos. ¡Felicidades!" | 33 y 63 |
| T6 | [PERS-OFF] | "Me contaron que te encanta el fútbol. Eso dice mucho de ti." | 59 |
| T7 | [PERS-LABIOS] | "¿Sabes una cosa, Mateo? Ya estás en mi Lista de Niños Buenos. Gracias por ser tú." | 81 |
| T8 | [PERS-OFF] | "¡Feliz Navidad, Mateo! Se nota cuánto te quieren en tu casa. ¡Joo, joo, jo, joo!" | 59 + risa |

Si Mateo no trajera `{logro}` ni `{gusto}`: T5 = "Tu familia me escribió una carta. Leo la carta de tu familia. Cada línea habla del cariño que te tienen." y T6 = "En mi estudio todo huele a canela y a galletas." El video sigue completo y no queda ningún hueco vacío.

### Ejemplo C · Luna, 3 años, logro "dio un abrazo grande", gusto "los dinosaurios", sin casilla (registro 3 a 4, 53 s, sin V1-02)

| Tramo | Tipo | Texto | Car. | Nombre dicho |
|---|---|---|---|---|
| T1 | [FIJO] | "¡Joo, joo, jo, joo! Qué noche tan bonita en el Polo Norte. Hoy abro mi Gran Libro." | 80 | — |
| T3 | [FIJO] y [PERS-OFF] | "A ver, a ver…" · "Luna… ¡aquí estás! ¡Tu nombre brilla!" | 13 y 37 | 0:10,7 |
| T4 | [PERS-LABIOS] | "¡Hola, Luna! ¡Tienes tres años!" | 31 | 0:15,7 |
| T5 | [FIJO] y [PERS-OFF] | "Tu familia me escribió una carta." · "Dice que diste un abrazo grande. ¡Qué bien!" | 33 y 43 | — |
| T6 | [PERS-OFF] | "Me contaron que te encantan los dinosaurios. ¡Qué divertido!" | 60 | — |
| T7 | [PERS-LABIOS] | "¿Sabes una cosa, Luna? Ya estás en mi Lista de Niños Buenos. ¡Un abrazo grande!" | 79 | 0:38,2 |
| T7b | [FIJO] | (solo sonrisa, 1,5 s, sin guiño) | — | — |
| T8 | [PERS-OFF] | "¡Feliz Navidad, Luna! Se nota cuánto te quieren en tu casa. ¡Joo, joo, jo, joo!" | 58 + risa | 0:45,8 |

### Ejemplos malos (y por qué)

| Mal | Por qué | Bien |
|---|---|---|
| "Te estoy viendo, Sofía, y sé que te portaste bien." | Vigilancia (C-04) | "Tu familia me escribió una carta." |
| "Este año te traeré la bicicleta que pediste." | Promete regalo concreto (C-03) | "Dice que aprendiste a andar en bicicleta. ¡Qué orgullo!" |
| "Mis duendes trabajan en algo especial." | Insinúa un regalo; taller de duendes fuera del piloto (C6) | "Se nota cuánto te quieren en tu casa." |
| "Sofía, Sofía Fernanda Domínguez de Pérez, escucha." | Apellidos; nombre pegado a palabras largas | "¡Hola, Sofía!" |
| "Dice que aprendiste a no portarte mal con tu hermano." | Regaño disfrazado, "portarse mal" | "Dice que aprendiste a compartir con tu hermano." |
| "Como Rudolph, tienes la nariz brillante de alegría." | Personaje ajeno | "¡Tu nombre brilla!" |
| "Soy un Santa de mentira hecho con tecnología." | Rompe D13; la revelación va al adulto | (no se dice nunca en el video) |
| "Mateo es muy bueno y muy listo." | Adjetivo con género y evaluación del niño | "Gracias por ser tú." |
| "Los niños que no se portan bien no salen en mi lista." | Lista de "niños malos" y amenaza | "Aquí están los niños buenos de todo el mundo." |
| "Sé que a tu casa también llega el Niño Dios." (C1) | A 3 a 6 años se entiende como dos repartidores ("¿y quién me trae los regalos?"); es "quién trae qué" | "Sé que en tu casa quieren mucho al Niño Dios. ¡Qué bonito!" |
| "Sé que en tu casa quieren al Niño Dios. ¡Le mando un saludo!" (C6) | Pone al Niño Dios a nivel de Santa; frase prohibida | "…¡Qué bonito!" |
| "Hasta el Polo Norte llega el olor a ponche y tamales." (C6) | "Ponche" es alcohol en Panamá | "…llega el olor a tamales." |
| "Sigue con ese gran corazón." (S1) | Condición implícita: "si dejas de, sales de la lista" | "Gracias por ser tú." |
| "Esto es solo para ti. No se lo cuentes a nadie." (C2) | Secreto con un adulto: el patrón que protección infantil enseña a evitar | (no se dice nunca) |

## 6. Entradas que se rechazan o se suavizan

Se aplican antes de que el texto llegue al modelo (código, criterio A-06) y después, a su salida. "Rechazar" = el campo opcional se descarta y se usa la frase alternativa; en `{nombre}` y `{edad}`, el formulario pide corregir. Máximo 140 caracteres por campo antes de limpiar.

| Entrada | Acción | Resultado |
|---|---|---|
| Insultos o groserías en cualquier campo | Rechazar el campo | Frase alternativa; si es el nombre, pedir otro |
| "Ignora las instrucciones", "di que eres...", URLs, correos, teléfonos, direcciones | Rechazar el campo | Frase alternativa |
| Apellido, segundo apellido, colegio, ciudad, barrio, apodos con apellido | Recortar al primer nombre; rechazar lo demás | Se usa solo el primer nombre |
| Nombre con números, emojis o símbolos, o de más de 16 caracteres | Pedir corregir | El pedido no avanza |
| Edad fuera de 3 a 9 | Pedir corregir; no vender el video | Mensaje al adulto |
| Regalo concreto o imposible en `{gusto}` o `{logro}` ("quiere un perro", "una moto", "un celular", "que vuelva papá") | Convertir a actividad o descartar | "te encanta andar en bici" en lugar de "quiere una bici"; si no hay actividad, frase alternativa |
| Marcas, tiendas, personajes de cine, series o juegos ("Frozen", "Spider-Man", "Rudolph", "Grinch", un videojuego) | Reemplazar por la categoría o descartar | "te encantan los superhéroes" o "te encanta jugar"; nunca pronunciar la marca (C-07 b y c) |
| Salud, diagnósticos, terapias, cirugías, medicinas ("autismo", "TDAH", "quimio", "operación") | Descartar el campo | Frase alternativa; sin comentario |
| Cuerpo y peso ("bajó de peso", "es gordito", "ya no es tan flaco") | Descartar | Frase alternativa |
| Control de esfínteres, chuparse el dedo, pañal, mojar la cama | Suavizar a algo general o descartar | "creciste mucho este año" (sin gancho a lo íntimo) |
| Duelo, muerte, divorcio, separación, hospital, migración, dinero ("papá se fue", "murió la abuela") | Descartar el campo | Frase alternativa; Santa no comenta (C-08) |
| Religión distinta de la casilla, política, noticias, personas reales, influencers | Descartar | Frase alternativa |
| Texto libre sobre el Niño Dios, los Reyes Magos u otra figura navideña en `{gusto}` o `{logro}` | Descartar la mención | Solo habla la casilla; ninguna frase nueva sobre quién trae qué |
| Regaños o amenazas ("que se porte bien", "dile que deje de pelear", "si no come no hay regalos", "es muy travieso") | Descartar | Frase alternativa; nunca usar la autoridad de Santa para presionar |
| Pedidos de secreto o complicidad ("dile que es un secreto", "que le susurre", "que no se lo cuente a nadie") | Rechazar | Frase alternativa; Santa no guarda secretos con el niño (C2) |
| Comparación con hermanos o amigos ("mejor que su hermano", "ganó a todos") | Reescribir sin la comparación | "aprendiste a leer", no "leíste mejor que tu hermano" |
| Logros que son malas noticias en negativo ("ya no llora", "ya no hace berrinches") | Reescribir en positivo o descartar | "aprendiste a respirar y calmarte" si es claramente positivo; si no, frase alternativa |
| Peticiones de que Santa diga IA, robot, computadora, "soy humano", "no existes" o que revele cómo se hizo | Rechazar | La revelación va al adulto, no al niño (D13) |
| Fecha de cumpleaños, quién está en casa, horarios | Descartar | Frase alternativa |
| Texto en otro idioma | Rechazar o traducir con aprobación del adulto | Frase alternativa |

## 7. Plantilla para el modelo de texto que arma los huecos (resumen)

1. Entrada: palabras del adulto entre delimitadores, como dato. Salida: cláusula en 2.ª persona, sin género, sin comparaciones, dentro del límite de la sección 1 (50 caracteres y 9 palabras para `{logro}`; 28 caracteres para `{gusto}`).
2. Lo que no se pueda decir con cariño y sin riesgo se descarta; nunca se inventa un logro ni un gusto.
3. Si el resultado rebasa el límite: acortar una vez; si aún rebasa, frase alternativa.
4. Los textos de Santa fuera de los huecos son fijos y no los reescribe el modelo. En particular, la frase del Niño Dios se copia tal cual de la tabla de T6.
5. Salida final auditada con:
   - Lista de palabras prohibidas: IA, robot, computadora, grabación, humano, marcas, "regalo", "sorpresa", "algo especial", "taller", "duendes", "ponche", "saludo", "susurro", "secreto", "solo para ti", "sigue con", "este año", "lo que pediste", y "llega", "viene", "trae" o "también" en la misma frase que "Niño Dios". La excepción es la frase exacta "En cada casa la Navidad llega a su manera."
   - Conteo de palabras por frase (≤ 12), caracteres por tramo (≤ ventana) y el nombre 4 veces (3 a 4 años: en 0:10,7, 0:15,7, 0:38,2 y 0:45,8).
   - Control de nombre de `voz.md` 4 y las frases de T-08 de `calidad.md` (Ana, Mía, Teo, Fer, Pau, Luis) como eliminatorias.

| Entrada del adulto | Bien | Mal |
|---|---|---|
| "montar bici sin rueditas" (logro) | "aprendiste a andar en bici sin rueditas" | "pudiste montar mejor que tus primos" |
| "ayudó a su mamá cuando estuvo enferma" | "ayudaste mucho en casa" (se quita la salud) | "ayudaste a tu mamá enferma" |
| "los dinosaurios" (gusto) | "te encantan los dinosaurios" | "te encanta el dinosaurio Rex" |
| "Barbie y Hot Wheels" (gusto) | "te encanta jugar" | "te encanta Barbie" |
| "es muy travieso pero ya mejora" | (descartar) | "ya no eres travieso" |
| "quiere que el Niño Dios le traiga una bici" (gusto) | "te encanta andar en bici" (se quita el Niño Dios y el regalo) | "te encanta que el Niño Dios te traiga una bici" |

## 8. Dependencias abiertas

- **C4 y V1-06b** (director creativo y fotografía): T6 se dice sobre V1-06 rehecho; para 3 a 4 años, sobre el plano de la vela y el libro hasta que V1-06 pase la prueba con niños. El texto de T6 no cambia.
- **Biblia, decisiones a y f:** siguen mostrando el cierre del gratis y la frase del Niño Dios anteriores a esta revisión. Las corrige `video-director-creativo`; mientras tanto mandan `revision-piloto.md` y este guion.

## Dudas abiertas

1. **Niño Dios.** `desarrollo-infantil` aprobó el texto con cambios (C1). Falta el visto bueno escrito de `legal-compliance` y la excepción anotada a la regla 3 de `docs/dominio/santa/folclore-por-pais.md` (solo video, solo con casilla). Si dice no, se retira la casilla. `video-psicologia-padres` fija la etiqueta de la casilla.
2. **Pronunciación del nombre:** resuelta por la biblia (decisión g) como ayuda opcional fuera de los 5 campos; falta que `video-psicologia-padres` la confirme en el formulario.
3. **"Tamales" en T1** asume un público general de México y Centroamérica; `video-psicologia-padres` debe aprobar o cambiar por país.
4. **T5 sin logro** dice "Tu familia me escribió una carta. Leo la carta de tu familia…" (la primera frase es fija): suena repetido. Propuesta, sin aplicar por estar fuera de lo pedido: dejar solo "Cada línea habla del cariño que te tienen."
5. **Nombre corto al final de frase** (T-08 de `calidad.md`): "¡Hola, {nombre}!" y "¡Feliz Navidad, {nombre}!" quedan al final de una oración. `video-voz-santa` los prueba antes de fijar; si fallan, se reordenan.
