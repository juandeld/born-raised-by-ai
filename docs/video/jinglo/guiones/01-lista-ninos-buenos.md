# Guion 01 · La Lista de Niños Buenos (~60 s)

Versión `guion-v1` · 11-nov-2026 · `video-guionista` · Para: `video-director-creativo` (storyboard), `video-voz-santa`, `video-ia-generativa`, `desarrollo-infantil` y `video-psicologia-padres` (revisión).
Brief: `docs/briefs/jinglo-video-piloto.md`. Voz y reglas de Santa alineadas con `docs/legal/textos/07-guardrails-agente-voz.md` (C-03, C-04, C-06, C-07, E-01 a E-03) y la decisión D13 de `docs/decisiones.md`.

## 0. Reglas de este guion (checklist para QA)

- Español latino neutro (México neutro): "ustedes", "regalo", "contento". Prohibido "vale", "vosotros", "ordenador", "chamaco".
- Frases de 12 palabras o menos; una idea por frase.
- El nombre se dice 4 veces (T3, T4, T7, T8), siempre junto a palabras cortas y comunes ("¡Hola, {nombre}!", "Feliz Navidad, {nombre}!"), nunca pegado a otra palabra difícil.
- Santa nunca dice IA, robot, computadora, "soy humano" ni "soy una persona" (D13). Es Santa y habla desde el Polo Norte (coherente con E-01 y E-03). El video no responde preguntas, así que no usa E-01 a E-03, pero no las contradice.
- Nunca promete regalo: la única mención es "mis duendes trabajan en algo especial", sin "para ti" ni "lo que pediste".
- Sin regaños ni "niños malos". Solo refuerzo positivo (C-04). Santa no dice "te veo" ni "te vigilo": sabe porque "tu familia me escribió una carta" (guía de conversación 4.5).
- Sin marcas ni personajes ajenos: no Rudolph, no renos con nombre propio. Duendes y Gran Libro son genéricos.
- Sin adjetivos con género sobre el niño (nada de "bueno/buena", "contento/a"). Los adjetivos de Santa sobre sí mismo ("orgulloso") sí valen.
- Guiño local: "ponche y tamales" en T1, dicho como tradición general ("llega el olor a..."), sin afirmar que la familia lo celebre (criterio A-05b).
- Las cifras se dicen con letras ("cinco", no "5") para el motor de voz.

## 1. Huecos

| Hueco | Qué es | Obligatorio | Límite | Si falta |
|---|---|---|---|---|
| `{nombre}` | Primer nombre del niño. Compuestos cortos permitidos (María José) | Sí | 14 caracteres | El pedido no avanza |
| `{edad}` | 3 a 9, en letras en el texto | Sí | 3 a 9 | Se usa el registro 5 a 6 y se omite la frase de edad en T3 |
| `{logro}` | Cláusula en 2.ª persona, pasado: "aprendiste a andar en bicicleta" | No | 50 caracteres | T5 usa la frase alternativa (sección 3) |
| `{gusto}` | Cláusula en 2.ª persona, presente: "te encanta bailar", "te encantan los dinosaurios" | No | 28 caracteres | T6 omite la frase del gusto (sección 3) |
| `{nino_dios}` | Casilla "En casa también llega el Niño Dios" (sí/no) | No | booleano | Se asume "no" |

El adulto escribe palabras sueltas; el modelo de texto las convierte en la cláusula ya conjugada y sin género (reglas en la sección 7). Nunca llega al modelo ni al guion otro dato del formulario (apellido, ciudad, país).

## 2. Guion base (5 a 6 años) con marcas de tiempo

Cada escena se genera en clips de 8 s y se recorta a la duración indicada. Fórmula del presupuesto: voz en off y fijos = (segundos − 0,5) × 15 caracteres; labios = (segundos − 1,2) × 15 (Santa necesita aire para entrar y salir).

| Tramo | Tiempo | Qué se ve | Qué dice Santa (5 a 6 años) | Tipo | Máx. car. |
|---|---|---|---|---|---|
| T1 | 0:00–0:08 | Estudio de Santa, luz cálida de velas y chimenea del taller. Ventana con auroras suaves. Santa de perfil se acerca a un atril con el Gran Libro cerrado y lo abre con cuidado | "¡Jo, jo, jo! Hasta el Polo Norte llega el olor a ponche y tamales. Hoy abro mi Gran Libro." | [FIJO] | 112 (texto: 90) |
| T2 | 0:08–0:14 | Plano sobre el hombro: Santa pasa páginas llenas de nombres dorados borrosos (no legibles). Destellos suaves | "Aquí están los niños buenos de todo el mundo. Busco un nombre muy especial." | [FIJO] | 82 (texto: 75) |
| T3 | 0:14–0:21 | Plano cenital del libro. Un dedo de Santa se detiene en una línea. El nombre del niño se escribe en dorado (FFmpeg) y brilla. Boca de Santa fuera de cuadro | "¡Aquí estás, {nombre}! Ya tienes {edad} años. ¡Tu nombre brilla en mi libro!" | [PERSONALIZADO-OFF] | 97 (peor caso: 81) |
| T4 | 0:21–0:29 | Santa levanta la vista y sonríe a cámara, plano medio (nunca primer plano). Ojos amables, sonrisa visible, sin movimientos bruscos | "¡Hola, {nombre}! Soy Santa. Tu familia me escribió una carta con cosas bonitas de ti." | [PERSONALIZADO-LABIOS] | 102 (peor caso: 91) |
| T5 | 0:29–0:37 | Cámara sobre el libro: aparece una carta escrita a mano, con un dibujo de estrella (sin texto legible). Destellos dorados al pasar los renglones. Santa de espaldas o manos solamente | "Leo en la carta que {logro}. ¡Qué orgullo!" | [PERSONALIZADO-OFF] | 112 (peor caso: 85) |
| T6 | 0:37–0:45 | Santa sentado junto a la ventana de auroras, visto de espaldas, o plano de sus manos cerrando la carta. Nada de cara hablando | "Me contaron que {gusto}. Sé que en tu casa quieren mucho al Niño Dios. ¡Le mando un saludo!" (ver las tres combinaciones en la sección 4) | [PERSONALIZADO-OFF] | 112 (peor caso: 112) |
| T7 | 0:45–0:53 | Santa a cámara, plano medio, junto al libro abierto donde brilla el nombre. Sonrisa cálida, un guiño lento al final | "{nombre}, ya estás en mi Lista de Niños Buenos. Sigue con ese gran corazón." | [PERSONALIZADO-LABIOS] | 102 (peor caso: 86) |
| T8 | 0:53–1:00 | Taller de duendes, plano abierto fijo, sin caras en primer plano, mesas con luz dorada. Sube cámara a una estrella. Texto dorado "Feliz Navidad, {nombre}" (FFmpeg) | "Mis duendes trabajan en algo especial. ¡Feliz Navidad, {nombre}! ¡Jo, jo, jo!" | [PERSONALIZADO-OFF] | 97 (peor caso: 83) |

Totales:
- Duración: 60 s (8 clips, T2 y T8 recortados).
- Labios: T4 + T7 = 16 s de clip (habla real, 11 s a 13 s). Límite del brief: 20 s. Margen: 4 s para una toma repetida.
- Personalizado: T3 a T8 = 46 s de 60 s (voz en off + labios). Fijo: T1 y T2 = 14 s, grabados una sola vez.
- Peor caso de caracteres con nombre de 14, edad "nueve", logro de 50 y gusto de 28: cabe en todos los tramos. Si un hueco rebasa el límite, el modelo lo acorta (sección 7); si aún no cabe, se usa la frase alternativa.

## 3. Variantes por edad (solo donde cambia el texto)

T1 y T2 son iguales para todas las edades (se graban una vez). T8 es igual salvo 3 a 4.

### T3 · encuentra el nombre (OFF)

| Edad | Texto | Car. peor caso |
|---|---|---|
| 3 a 4 | "¡Aquí estás, {nombre}! ¡Tienes {edad} años! ¡Tu nombre brilla!" | 67 |
| 5 a 6 | "¡Aquí estás, {nombre}! Ya tienes {edad} años. ¡Tu nombre brilla en mi libro!" | 81 |
| 7 a 9 | "¡Aquí estás, {nombre}! {Edad} años, y tu nombre brilla en mi Gran Libro." | 76 |
| Sin edad | "¡Aquí estás, {nombre}! ¡Tu nombre brilla en mi libro!" (registro 5 a 6) | 63 |

### T4 · saludo (LABIOS)

| Edad | Texto | Car. peor caso |
|---|---|---|
| 3 a 4 | "¡Hola, {nombre}! Soy Santa. Tu familia me escribió una carta." | 67 |
| 5 a 6 | "¡Hola, {nombre}! Soy Santa. Tu familia me escribió una carta con cosas bonitas de ti." | 91 |
| 7 a 9 | "¡Hola, {nombre}! Soy Santa. Tu familia me escribió una carta con cosas muy bonitas sobre ti." | 98 |

### T5 · logro (OFF)

| Edad | Con `{logro}` | Sin `{logro}` (frase alternativa) |
|---|---|---|
| 3 a 4 | "Leo en la carta que {logro}. ¡Muy bien!" (logro ≤ 6 palabras) | "Leo la carta de tu familia. ¡Habla de cuánto te quieren!" |
| 5 a 6 | "Leo en la carta que {logro}. ¡Qué orgullo!" | "Leo la carta de tu familia. Cada línea habla del mucho cariño que te tienen." |
| 7 a 9 | "En la carta leo que {logro}. ¡Eso merece un gran aplauso!" | Igual que 5 a 6 |

La frase alternativa no inventa ningún hecho: solo dice lo que es cierto de una carta de la familia.

### T6 · gusto y Niño Dios (OFF). Cuatro combinaciones por edad

| Combinación | 3 a 4 | 5 a 6 | 7 a 9 |
|---|---|---|---|
| `{gusto}` y Niño Dios | "Me contaron que {gusto}. En tu casa quieren al Niño Dios. ¡Le mando un saludo!" | "Me contaron que {gusto}. Sé que en tu casa quieren mucho al Niño Dios. ¡Le mando un saludo!" | Igual que 5 a 6 |
| Solo `{gusto}` | "Me contaron que {gusto}. ¡Qué divertido!" | "Me contaron que {gusto}. ¡Qué divertido! Eso me hace sonreír." | "Me contaron que {gusto}. Eso dice mucho de ti." |
| Solo Niño Dios | "En tu casa quieren al Niño Dios. ¡Le mando un saludo!" | "Sé que en tu casa quieren mucho al Niño Dios. ¡Le mando un saludo! Cada casa tiene su propia magia." | Igual que 5 a 6 |
| Ninguno | "En mi taller todo huele a canela." | "En mi taller todo huele a canela y a galletas." | Igual que 5 a 6 |

Cómo se menciona al Niño Dios: solo el nombre, con respeto y cariño ("quieren mucho", "le mando un saludo"). Nada de nacimiento, Belén, misa, rezos, ni quién trae qué. Santa no confirma ni niega nada sobre los regalos (E-03). Se dice en voz en off, así que el tiempo de labios no cambia.

### T7 · cierre a cámara (LABIOS)

| Edad | Texto | Car. peor caso |
|---|---|---|
| 3 a 4 | "{nombre}, estás en mi lista de niños buenos. ¡Un abrazo grande!" | 69 |
| 5 a 6 | "{nombre}, ya estás en mi Lista de Niños Buenos. Sigue con ese gran corazón." | 86 |
| 7 a 9 | "{nombre}, ya estás en mi Lista de Niños Buenos. Sigue con ese gran corazón. Gracias por ser tú." | 101 |

### T8 · despedida (OFF)

| Edad | Texto |
|---|---|
| 3 a 4 | "Mis duendes trabajan en algo especial. ¡Feliz Navidad, {nombre}!" |
| 5 a 9 | "Mis duendes trabajan en algo especial. ¡Feliz Navidad, {nombre}! ¡Jo, jo, jo!" |

Ritmo por edad (para `video-voz-santa`): 3 a 4, lento (~100 a 115 palabras por minuto), "Jo, jo, jo" corta y suave; 5 a 6, cálido (~115 a 130); 7 a 9, natural (~125 a 140), sin tono de bebé.

## 4. Texto completo con casilla Niño Dios (5 a 6 años, con `{gusto}`)

T1, T2, T3, T4, T5, T7 y T8 no cambian. Solo T6, que queda: "Me contaron que {gusto}. Sé que en tu casa quieren mucho al Niño Dios. ¡Le mando un saludo!" (peor caso 112 caracteres, justo dentro del tramo). Si el `{gusto}` pasa de 28 caracteres, se omite la frase del gusto y queda la fila "Solo Niño Dios".

## 5. Ejemplos completos

### Ejemplo A · Sofía, 5 años, logro "aprendió a andar en bicicleta", gusto "bailar", Niño Dios sí (registro 5 a 6)

| Tramo | Tipo | Texto | Car. |
|---|---|---|---|
| T1 | [FIJO] | "¡Jo, jo, jo! Hasta el Polo Norte llega el olor a ponche y tamales. Hoy abro mi Gran Libro." | 90 |
| T2 | [FIJO] | "Aquí están los niños buenos de todo el mundo. Busco un nombre muy especial." | 75 |
| T3 | [PERSONALIZADO-OFF] | "¡Aquí estás, Sofía! Ya tienes cinco años. ¡Tu nombre brilla en mi libro!" | 72 |
| T4 | [PERSONALIZADO-LABIOS] | "¡Hola, Sofía! Soy Santa. Tu familia me escribió una carta con cosas bonitas de ti." | 82 |
| T5 | [PERSONALIZADO-OFF] | "Leo en la carta que aprendiste a andar en bicicleta. ¡Qué orgullo!" | 66 |
| T6 | [PERSONALIZADO-OFF] | "Me contaron que te encanta bailar. Sé que en tu casa quieren mucho al Niño Dios. ¡Le mando un saludo!" | 101 |
| T7 | [PERSONALIZADO-LABIOS] | "Sofía, ya estás en mi Lista de Niños Buenos. Sigue con ese gran corazón." | 72 |
| T8 | [PERSONALIZADO-OFF] | "Mis duendes trabajan en algo especial. ¡Feliz Navidad, Sofía! ¡Jo, jo, jo!" | 74 |

Nombre: 4 veces. Labios: 16 s de clip.

### Ejemplo B · Mateo, 8 años, logro "terminó su primer libro de capítulos", gusto "el fútbol", sin Niño Dios (registro 7 a 9)

| Tramo | Tipo | Texto | Car. |
|---|---|---|---|
| T1 | [FIJO] | (igual) | 90 |
| T2 | [FIJO] | (igual) | 75 |
| T3 | [PERSONALIZADO-OFF] | "¡Aquí estás, Mateo! Ocho años, y tu nombre brilla en mi Gran Libro." | 67 |
| T4 | [PERSONALIZADO-LABIOS] | "¡Hola, Mateo! Soy Santa. Tu familia me escribió una carta con cosas muy bonitas sobre ti." | 89 |
| T5 | [PERSONALIZADO-OFF] | "En la carta leo que terminaste tu primer libro de capítulos. ¡Eso merece un gran aplauso!" | 89 |
| T6 | [PERSONALIZADO-OFF] | "Me contaron que te encanta el fútbol. Eso dice mucho de ti." | 59 |
| T7 | [PERSONALIZADO-LABIOS] | "Mateo, ya estás en mi Lista de Niños Buenos. Sigue con ese gran corazón. Gracias por ser tú." | 92 |
| T8 | [PERSONALIZADO-OFF] | "Mis duendes trabajan en algo especial. ¡Feliz Navidad, Mateo! ¡Jo, jo, jo!" | 74 |

Si Mateo no trajera `{logro}` ni `{gusto}`: T5 = "Leo la carta de tu familia. Cada línea habla del mucho cariño que te tienen." y T6 = "En mi taller todo huele a canela y a galletas." El video sigue completo y no queda ningún hueco vacío.

### Ejemplos malos (y por qué)

| Mal | Por qué | Bien |
|---|---|---|
| "Te estoy viendo, Sofía, y sé que te portaste bien." | Vigilancia (C-04) | "Tu familia me escribió una carta con cosas bonitas de ti." |
| "Este año te traeré la bicicleta que pediste." | Promete regalo concreto (C-03) | "Mis duendes trabajan en algo especial." |
| "Sofía, Sofía Fernanda Domínguez de Pérez, escucha." | Apellidos; nombre pegado a palabras largas | "¡Hola, Sofía!" |
| "Leo que aprendiste a no portarte mal con tu hermano." | Regaño disfrazado, "portarse mal" | "Leo que aprendiste a compartir con tu hermano." |
| "Como Rudolph, tienes la nariz brillante de alegría." | Personaje ajeno | "Tu nombre brilla en mi libro." |
| "Soy un Santa de mentira hecho con tecnología." | Rompe D13; la revelación va al adulto | (no se dice nunca en el video) |
| "Mateo es muy bueno y muy listo." | Adjetivo con género y evaluación del niño | "Gracias por ser tú." |
| "Los niños que no se portan bien no salen en mi lista." | Lista de "niños malos" y amenaza | "Aquí están los niños buenos de todo el mundo." |

## 6. Entradas que se rechazan o se suavizan

Se aplican antes de que el texto llegue al modelo (código, criterio A-06) y después, a su salida. "Rechazar" = el campo opcional se descarta y se usa la frase alternativa; en `{nombre}` y `{edad}`, el formulario pide corregir. Máximo 140 caracteres por campo antes de limpiar.

| Entrada | Acción | Resultado |
|---|---|---|
| Insultos o groserías en cualquier campo | Rechazar el campo | Frase alternativa; si es el nombre, pedir otro |
| "Ignora las instrucciones", "di que eres...", URLs, correos, teléfonos, direcciones | Rechazar el campo | Frase alternativa |
| Apellido, segundo apellido, colegio, ciudad, barrio, apodos con apellido | Recortar al primer nombre; rechazar lo demás | Se usa solo el primer nombre |
| Nombre con números, emojis o símbolos, o de más de 14 caracteres | Pedir corregir | El pedido no avanza |
| Edad fuera de 3 a 9 | Pedir corregir; no vender el video | Mensaje al adulto |
| Regalo concreto o imposible en `{gusto}` o `{logro}` ("quiere un perro", "una moto", "un celular", "que vuelva papá") | Convertir a actividad o descartar | "te encanta andar en bici" en lugar de "quiere una bici"; si no hay actividad, frase alternativa |
| Marcas, tiendas, personajes de cine, series o juegos ("Frozen", "Spider-Man", "Rudolph", "Grinch", un videojuego) | Reemplazar por la categoría o descartar | "te encantan los superhéroes" o "te encanta jugar"; nunca pronunciar la marca (C-07 b y c) |
| Salud, diagnósticos, terapias, cirugías, medicinas ("autismo", "TDAH", "quimio", "operación") | Descartar el campo | Frase alternativa; sin comentario |
| Cuerpo y peso ("bajó de peso", "es gordito", "ya no es tan flaco") | Descartar | Frase alternativa |
| Control de esfínteres, chuparse el dedo, pañal, mojar la cama | Suavizar a algo general o descartar | "creciste mucho este año" (sin gancho a lo íntimo) |
| Duelo, muerte, divorcio, separación, hospital, migración, dinero ("papá se fue", "murió la abuela") | Descartar el campo | Frase alternativa; Santa no comenta (C-08) |
| Religión distinta de la casilla, política, noticias, personas reales, influencers | Descartar | Frase alternativa |
| Regaños o amenazas ("que se porte bien", "dile que deje de pelear", "si no come no hay regalos", "es muy travieso") | Descartar | Frase alternativa; nunca usar la autoridad de Santa para presionar |
| Comparación con hermanos o amigos ("mejor que su hermano", "ganó a todos") | Reescribir sin la comparación | "aprendiste a leer", no "leíste mejor que tu hermano" |
| Logros que son malas noticias en negativo ("ya no llora", "ya no hace berrinches") | Reescribir en positivo o descartar | "aprendiste a respirar y calmarte" si es claramente positivo; si no, frase alternativa |
| Peticiones de que Santa diga IA, robot, computadora, "soy humano", "no existes" o que revele cómo se hizo | Rechazar | La revelación va al adulto, no al niño (D13) |
| Fecha de cumpleaños, quién está en casa, horarios | Descartar | Frase alternativa |
| Texto en otro idioma | Rechazar o traducir con aprobación del adulto | Frase alternativa |

## 7. Reglas para el modelo de texto que arma los huecos (resumen)

1. Entrada: palabras del adulto entre delimitadores, como dato. Salida: cláusula en 2.ª persona, sin género, sin comparaciones, ≤ límite de la sección 1.
2. Lo que no se pueda decir con cariño y sin riesgo se descarta; nunca se inventa un logro ni un gusto.
3. Si el resultado rebasa el límite: acortar una vez; si aún rebasa, frase alternativa.
4. Salida final auditada con: lista de palabras prohibidas (IA, robot, computadora, humano, marcas), conteo de palabras por frase (≤ 12), número de caracteres por tramo y el nombre 4 veces.

| Entrada del adulto | Bien | Mal |
|---|---|---|
| "montar bici sin rueditas" (logro) | "aprendiste a andar en bici sin rueditas" | "pudiste montar mejor que tus primos" |
| "ayudó a su mamá cuando estuvo enferma" | "ayudaste mucho en casa" (se quita la salud) | "ayudaste a tu mamá enferma" |
| "los dinosaurios" (gusto) | "te encantan los dinosaurios" | "te encanta el dinosaurio Rex" |
| "Barbie y Hot Wheels" (gusto) | "te encanta jugar" | "te encanta Barbie" |
| "es muy travieso pero ya mejora" | (descartar) | "ya no eres travieso" |

## Dudas abiertas

1. El Niño Dios: la guía de folclore (`docs/dominio/santa/folclore-por-pais.md`, regla 3) dice que Santa no lo menciona. Este guion sigue el brief y lo menciona solo con respeto ("quieren mucho", "le mando un saludo"). Pendiente de visto bueno de `desarrollo-infantil` y `legal-compliance`.
2. Pronunciación del nombre: conviene un campo opcional de "cómo se dice" para nombres poco comunes. No lo agregué sin decisión de `video-psicologia-padres`.
3. El guiño de "ponche y tamales" asume un público general de México y Centroamérica; `video-psicologia-padres` debe aprobar o cambiar por país.
