# Jinglo · Biblia · Música y sonido (piloto)

Autor: `video-musica-sonido` · 11-nov-2026 · Alcance: "La Lista de Niños Buenos" (~60 s) y el video gratis (15 s).
Estado: borrador para la ronda 1. Los tiempos están sobre una estructura provisional; se ajustan al guion final de `video-guionista` (`docs/video/jinglo/guiones/`), que aún no existe al escribir esto.
Este documento es interno: nombra proveedores y herramientas. Nada de esto se muestra al cliente (D23).

## 0. Resumen ejecutivo

- La música del piloto la compone una persona, por encargo y con cesión total de derechos. Es la opción recomendada (sección 6).
- Las bibliotecas con licencia estándar (Artlist, Epidemic Sound, PremiumBeat) **no cubren** poner la pista dentro de un producto personalizado que se vende al cliente final. Solo servirían con un acuerdo escrito aparte (sección 5b).
- Eleven Music y Lyria quedan fuera, como dice el brief y `legal-proveedores.md`.
- El tema de Jinglo es el activo de marca: por eso conviene que sea nuestro y exclusivo, no alquilado.
- Costo estimado del piloto: US$300–800 (tope sugerido US$1,000), un solo pago. **No está dentro del presupuesto aprobado de ~$100–110.** Necesita aprobación de Juan.

## 1. El tema de Jinglo

### Concepto

Una melodía de 4 compases que suena a "caja de música que se abre". La idea: el niño oye el tema antes de que Santa hable y, sin saber por qué, ya sabe que algo bueno va a pasar.

Dos ideas sostienen todo:

1. **La chispa.** Un salto ascendente pequeño y luminoso al inicio (una cuarta), como una luz que se enciende. Es la parte que el niño tararea.
2. **El suspenso que se resuelve.** La frase termina en el aire (sin nota final de reposo). Se resuelve solo cuando Santa dice el nombre del niño y en el cierre del video 1. En el video gratis nunca se resuelve: eso es el "tengo algo más que decirte".

### Por qué emociona

- **Niño de 3 a 9 años.** Los saltos ascendentes pequeños y los descensos por grados conjuntos son fáciles de seguir y de cantar. El timbre de celesta y campanillas se asocia a juguete y a regalo. El compás de 3/4 lento se siente como mecer. La melodía no tiene disonancias ni sorpresas fuertes. Un niño de 3 años lo oye como "cosa bonita"; uno de 9 lo oye como "magia de verdad" porque el tema crece (sección 1.4).
- **Adulto.** Las cuerdas cálidas y el coro sin palabras evocan nostalgia de Navidad de infancia, sin imitar nada conocido. El adulto que compra oye "producción de cine" en vez de "tarjeta animada", que es la diferencia que busca `video-psicologia-padres`.
- **Los dos a la vez.** El mismo tema funciona sencillo (celesta sola) y grande (cuerdas + coro), así que acompaña a Santa sin pelear con su voz.

### Parámetros musicales

| Parámetro | Decisión | Razón |
|---|---|---|
| Compás | 3/4 (balanceo de cuna) | Calma y ternura; evita marcha militar |
| Tempo base | 66 bpm (expectativa y ternura) · 72 bpm (alegría) | Lento permite que el nombre respire; el leve aumento da alegría sin prisa |
| Tonalidad | Fa mayor para el tema | Registro cómodo para celesta y cuerdas; cálida, no brillante en exceso |
| Cambio de tono | Subir un tono entero (a Sol mayor) en la última frase del video 1 | Efecto clásico de "sube el corazón", pero con melodía propia |
| Rango de la melodía | Do4 a Do5 (aprox.) | Cabe en el rango que un niño puede tararear |
| Tema completo | 4 compases (~11 s a 66 bpm) | Corto y recordable |
| Logo sonoro | 3 notas ascendentes de celesta + campanilla, ~1.2 s | Firma al final del video 1; el video gratis no lo lleva (termina abierto) |

### Contorno de la melodía (guía para el compositor)

No entrego la melodía final: la escribe el compositor y debe ser original. Lo que fijo es el contorno y las reglas.

- Frase 1 (compases 1-2): sube una cuarta ("la chispa"), se asienta con dos notas largas, baja por grados.
- Frase 2 (compases 3-4): repite la chispa una nota más arriba, sube una sexta y se detiene en una nota que no es la tónica (suspenso).
- Ritmo ancla: tres notas cortas y una larga ("din-din-din-DÍIN"), un guiño al nombre Jinglo y a las campanillas.
- Ejemplo ilustrativo del espíritu, **no es la pieza final y no se usa tal cual**: Do4 – Fa4 – La4 | Sol4 (larga) – Mi4 – Fa4 | Sol4 – La4 – Do5 | Re5 (larga, abierta).

### Instrumentación

| Capa | Instrumento | Papel |
|---|---|---|
| Melodía | Celesta | Voz principal del tema; siempre suave, sin ataque duro |
| Calidez | Cuerdas (sección corta, con sordina en lo suave) | Cama armónica; sube en alegría |
| Brillo | Campanillas y vibráfono suave | Destellos entre frases; el "dorado" del nombre |
| Humanidad | Coro suave "ah" (sin palabras) | Solo en alegría y cierre; sin letra evita idioma y derechos de texto |
| Movimiento | Pizzicato de cuerdas, arpa | Búsqueda en el libro |
| Ritmo | Shaker suave y cascabeles | Solo en alegría. Sin percusión grave |

Lo que no entra: tambores, metales, bajos profundos, guitarra eléctrica, cualquier instrumento con ataque fuerte. Sin graves ni golpes (regla de `desarrollo-infantil`). Esto también ayuda al teléfono, cuya bocina no reproduce graves (sección 4).

### Reglas anti-parecido

- Ninguna frase puede recordar a bandas sonoras conocidas (Polar Express, Home Alone, Grinch, Rudolph, Coca-Cola, etc.).
- El compositor entrega una declaración escrita de que la obra es original, sin muestras ajenas y sin herramientas de generación automática de música.
- Prueba de parecido antes de aprobar: tres personas del equipo y de `video-control-calidad` escuchan sin contexto y anotan a qué les suena. Si dos nombran la misma obra, se rehace.
- Pedir a `legal-compliance` si conviene una revisión formal de similitud antes del lanzamiento comercial (no solo para el piloto).

### Música elástica (necesidad técnica)

El nombre del niño dura entre 0.4 s ("Ana") y 1.5 s ("María Fernanda"). La música no puede depender de ese tiempo. El compositor entrega:

- Un **puente sostenido** (acorde largo que se puede alargar o acortar sin cortes audibles) justo antes y después del nombre.
- Los destellos dorados como **eventos separados** que `video-edicion-post` coloca después del final del nombre, no a tiempo fijo.
- Versiones de la cama musical con 2 y 4 compases de sostenido.

## 2. Mapa emocional

Convenciones: `V` = voz de Santa. `Ducking` = bajar la música cuando habla Santa (detalle en la sección 4). Niveles de música relativos a la voz, que es la referencia 0 dB. Los tiempos son orientativos hasta tener el guion.

### 2.1 Video 1, "La Lista de Niños Buenos" (~60 s)

| Tiempo | Emoción | Qué se oye | Música | Notas de mezcla |
|---|---|---|---|---|
| 0:00 – 0:05 | Expectativa | Fuego bajo en el estudio, viento con nieve afuera (muy lejos), un destello de campanilla | Entran 3 notas sueltas de celesta; sin ritmo; la tonalidad se insinúa | Entrada desde silencio en 1 s. Música a -18 dB respecto a la voz futura |
| 0:05 – 0:12 | Expectativa → asombro | Santa llega al libro; la tapa se abre; pequeño brillo | Sube una cama suave de cuerdas con sordina; asoma el tema por primera vez (celesta sola, 1 frase) | Entra V en off: ducking -10 dB |
| 0:12 – 0:22 | Asombro (suspenso juguetón) | Páginas pasando, pluma que se mueve, Santa murmura buscando | Pizzicato y arpa; el tema fragmentado, sin cerrar | Las páginas son el "ritmo" de la escena. V sobre todo: ducking constante -10 dB |
| 0:22 – 0:27 | Anticipación | Santa se detiene: "¡aquí estás!" o similar | Crescendo corto de cuerdas, el tema sube hasta la nota abierta | Subida 3 dB solo en las pausas de V |
| **0:27.0 – 0:27.5** | **Silencio** | Solo el fuego apenas audible (piso de sala) | **Música y efectos cortados en ~150 ms** | Silencio de ~0.5 s. No es silencio digital: queda sala a -40 dB para que no parezca falla |
| 0:27.5 – 0:29 | **Nombre** | **V dice el nombre del niño, a cámara** | **Nada** | Voz sola. Ningún instrumento durante el nombre (regla del nombre, sección 4.3) |
| 0:29 – 0:33 | Asombro (el "wow") | El nombre se escribe en dorado en el libro: pluma + destello | Entran el destello de celesta alta y campanillas, 0.2 s después de que termina el nombre; la nota abierta se resuelve en acorde mayor | Destello en el registro agudo (arriba de 2 kHz). No tapa la voz porque V ya terminó |
| 0:33 – 0:45 | Ternura | Santa dice por qué está en la lista (logro, gusto) | El tema completo, lento, en celesta con cuerdas muy suaves | V manda. Ducking -12 dB. Respiro de 1 s antes de la frase más emotiva |
| 0:45 – 0:55 | Alegría | Santa sonríe, cierra el libro; cascabeles del trineo a lo lejos; ventanita iluminada del taller a lo lejos | Último estribillo con cuerdas, coro "ah" y shaker; **sube un tono** en la última frase | Es el único punto donde la música puede estar cerca de la voz (-6 dB). Sigue sin tapar el habla |
| 0:55 – 1:00 | Cierre cálido | "Jo, jo, jo" suave o despedida; cascabeles que se alejan | Resolución plena en acorde mayor; logo sonoro de 3 notas; cola con eco suave de ~2 s | Fundido de salida de 2 s. Sin corte seco |

Qué siente el niño en esa secuencia: espera segura (no miedo), asombro al ver su nombre, calor al oír por qué, risa al final. Qué siente el adulto: un nudo en la garganta en 0:33–0:45 y sonrisa en 0:45–0:55.

### 2.2 Video gratis (15 s)

Es un gancho: el sonido debe ser casi tan rico como el del video 1, pero termina sin resolver.

| Tiempo | Emoción | Qué se oye | Música | Notas |
|---|---|---|---|---|
| 0:00 – 0:03 | Expectativa | Fuego, viento con nieve lejano, campanilla | 3 notas de celesta, sin ritmo | Entrada desde silencio en 0.5 s (ya no hay tiempo para más) |
| 0:03 – 0:08 | Asombro (búsqueda) | Páginas, pluma; Santa busca ("veamos…") | Arpa y pizzicato; el tema fragmentado | Ducking -10 dB mientras habla |
| **0:08.0 – 0:08.5** | **Silencio** | Solo piso de sala | **Corte** | ~0.5 s |
| 0:08.5 – 0:10 | **Nombre** | **V dice el nombre con la vista en el libro** | **Nada** | Voz sola |
| 0:10 – 0:12 | Asombro | El nombre se escribe en dorado | Destello de celesta alta y campanillas; **el acorde se queda abierto** | Aquí no se resuelve |
| 0:12 – 0:15 | Suspenso tierno | "Tengo algo más que decirte sobre tu regalo…" | Cama sostenida de cuerdas muy suave; una nota de celesta que flota | Ducking -10 dB. Termina en suspenso: el último sonido es la nota flotando, que se desvanece en 1 s. Sin logo sonoro. Marca visual jinglo.app discreta, sin sonido |

El suspenso musical es la mitad del gancho: si la música resolviera, el niño sentiría que ya terminó.

## 3. Efectos y ambientes

Niveles en dB respecto a la voz de Santa (referencia 0). Pensados para bocina de teléfono: nada que dependa de graves.

| Elemento | Dónde | Nivel relativo | Carácter | Notas |
|---|---|---|---|---|
| Fuego de chimenea | Toda la escena del estudio (cama continua) | -26 dB | Crepitar suave, sin chasquidos fuertes | Es el "piso de sala" del silencio. Filtro pasa-altos a 150 Hz |
| Viento con nieve | Inicio y cierre; casi siempre afuera | -30 dB | Soplo lejano y tenue | Nunca silbido agudo ni aullido. Debe parecer acogedor |
| Páginas del libro | Búsqueda | -14 dB | Papel grueso, antiguo, suave | Es la "percusión" de la búsqueda. Evitar crujidos secos |
| Tapa del libro al abrir | 0:05–0:12 | -12 dB | Cuero pesado que cede, sin golpe | Sin bajo. Apertura lenta |
| Pluma sobre papel | Nombre dorado | -16 dB | Trazo largo, tenue | Sincronizar con la escritura que pone FFmpeg |
| Destello dorado (celesta alta + campanillas) | Nombre en el libro | -10 dB | Cascada ascendente corta (~1 s) | Siempre después de terminar el nombre |
| Campanillas | Destellos y logo | -16 dB | Agudas pero redondas, sin metal duro | Sin ataques fuertes |
| Cascabeles del trineo | Alegría y cierre | -20 dB | Lejos, moviéndose | Se alejan al final (paneo y bajada de nivel) |
| Taller a lo lejos | Alegría | -32 dB | Murmullo de martillitos y risas muy distantes | Apenas perceptible; ver que no suene a ruido |
| Pasos / madera del estudio | Si el plano lo pide | -24 dB | Tablones suaves | Opcional |
| Respiración y ropa de Santa | Voz | no se mezcla aparte | — | Pertenece a la pista de voz |

Reglas:

- Un solo evento fuerte a la vez. Ningún efecto pasa de -10 dB respecto a la voz.
- Cero golpes, portazos, truenos, graves sostenidos ni sonidos que empiecen de golpe. Toda entrada con ataque de al menos 20 ms y salida suave.
- El audio que los modelos de video generen por su cuenta se descarta. Todo el sonido se reconstruye aquí, para que lo que oye el niño sea 100 % controlado y con derechos claros.

### De dónde salen los efectos (con licencia)

| Fuente | Condición a confirmar | Uso recomendado |
|---|---|---|
| **Grabación propia (foley)** | Ninguna: es nuestro | Primera opción para páginas, pluma, tapa del libro, fuego pequeño, cascabeles. Grabable en una tarde con un teléfono y una sala silenciosa, o por el mismo compositor/ingeniero |
| **Freesound, solo sonidos CC0** | Revisar cada sonido: cada uno trae su propia licencia. CC0 permite uso comercial sin atribución. CC BY exige atribución (poco práctico dentro del video). CC BY-NC está prohibido para nosotros. Fuente: [guía de licencias de Freesound](https://licenseorg.com/guide/music-audio/freesound) (fuente secundaria; confirmar en freesound.org) | Fuego, viento, campanillas. Guardar enlace y captura de la licencia de cada sonido |
| **Sonniss GameAudioGDC (paquetes libres)** | Según una guía secundaria, se pueden usar comercialmente pero "la redistribución individual de sonidos está prohibida"; solo se permiten incrustados en un proyecto. Nuestro uso (sonidos incrustados dentro del video) encaja, pero hay que leer la licencia original del paquete y confirmar que vender el video no cuenta como redistribuir. Fuente: [licenseorg](https://licenseorg.com/guide/music-audio/sonniss) | Fuego, viento, ambientes de calidad profesional |
| **Biblioteca con licencia comercial** | Mismo problema que la música: las licencias estándar no cubren producto personalizado. No comprar efectos sueltos de ahí sin respuesta escrita | Último recurso |

Todo sonido usado se anota en una hoja de registro (`docs/video/jinglo/sonido-registro.md`, la crea `video-musica-sonido` al producir): nombre, fuente, licencia, enlace y fecha. `legal-compliance` la revisa antes de cualquier venta.

## 4. Especificación de mezcla (para `video-edicion-post`)

Los niveles son orientativos. Se confirman con prueba de escucha en teléfono (sección 4.5). No se publican cifras de plataformas como garantía: cada una cambia su normalización.

### 4.1 Niveles

| Medida | Objetivo |
|---|---|
| Sonoridad integrada del video terminado | -16 LUFS (tolerancia ±1) para redes y WhatsApp. Es cercano a lo habitual en teléfono; las plataformas suelen bajar lo que pasa de ~-14 LUFS y no suben lo muy bajo |
| Pico real (true peak) | -1.5 dBTP, con margen para la compresión a AAC que aplica WhatsApp |
| Voz de Santa, habla | alrededor de -18 LUFS de corto plazo (referencia 0 dB) |
| Música bajo voz | -10 a -12 dB respecto a la voz (ducking) |
| Música sola (apertura y cierre) | subir hasta -6 dB respecto a la voz, sin pasar de -18 LUFS de corto plazo |
| Piso de sala en el silencio | -40 dB respecto a la voz |
| Uniformidad entre videos | Diferencia máxima de 1 LU entre cualquier par de videos de Jinglo |
| Versión TV 16:9 | misma mezcla; se revisa en televisor. Si en algún canal se exige otra medida, se ajusta |

### 4.2 Voz siempre por encima

- La voz de Santa manda en todo momento. La música baja cuando habla.
- **Ducking:** música baja 10-12 dB. Ataque 100-150 ms. Liberación 500-700 ms (sube despacio, para que no se note el "bombeo").
- Pasa-altos de 120 Hz en música y efectos. El teléfono no reproduce ese rango y los graves solo ensucian.
- Ecualización dinámica en la música: bajar 3-4 dB entre 1.5 y 4 kHz solo mientras habla Santa, para dejar sitio a las consonantes y a la claridad de las palabras.
- Un limitador suave al final, sin aplastar la voz.

### 4.3 El nombre del niño

- Medio segundo de silencio de música y efectos justo antes (sección 2).
- Durante el nombre: voz sola más el piso de sala. Ningún instrumento suena a la vez.
- Los destellos y campanillas entran 0.2 s después de terminar el nombre, y son del registro agudo. Por eso se colocan después, no a la vez.
- Si el nombre tiene sibilantes fuertes (Sofía, Santiago, Josué), la voz y el nombre se revisan con `video-voz-santa` y se prueba en teléfono.
- Regla de aceptación (KPI): el nombre se entiende a la primera en el 100 % de la prueba de escucha en teléfono.

### 4.4 Pensado para bocina de teléfono

- El teléfono casi no reproduce por debajo de 300-400 Hz. La música se compone y se mezcla para que suene completa sin graves: celesta, cuerdas en registro medio-alto, campanillas.
- Evitar sonidos que dependan de estéreo ancho. Revisar siempre la mezcla en mono.
- Verificar en tres dispositivos: una bocina de teléfono de gama media, audífonos básicos y un televisor.
- El pico más fuerte debe sonar agradable a volumen alto en un teléfono sostenido cerca de un niño de 3 años (sin sobresaltos).

### 4.5 Prueba de escucha

1. 5 personas escuchan el video 1 y el gratis en teléfono, con tres nombres de prueba difíciles (uno corto, uno largo, uno con "s").
2. Anotan qué nombre entendieron en la primera escucha.
3. Resultado esperado: 100 % de aciertos. Un fallo se corrige antes de seguir.
4. Con los papás en la prueba ciega: nota de emoción ≥ 4.7 de 5.
5. Con niños solo después de la aprobación de voz de ElevenLabs (`legal-proveedores.md`).

### 4.6 Entrega de la mezcla

- Mezcla final: WAV 48 kHz / 24 bits, y el video con AAC 192 kbps.
- Stems separados: voz, música, efectos y ambientes. Así se puede cambiar el nombre sin remezclar todo.
- Cue sheet con tiempos exactos (para que el silencio y los destellos se coloquen por nombre).

## 5. Cómo conseguimos la música legalmente

Estado de proveedores: Eleven Music ya no es opción (sin aprobación escrita) y Lyria tampoco (bloqueo legal). Además, la música generada por IA tiene dudas de protección de derechos de autor sobre el resultado; con una pieza humana eso no se discute.

Lo que necesitamos: usar la pista **dentro de un video personalizado que se vende al cliente final**, de forma indefinida, en varios países, y que la melodía sea nuestro sello. Es un caso distinto de "poner música a un video propio en redes".

### 5a. Compositor humano por encargo con cesión de derechos

**Cómo**: contratar a un compositor independiente (Fiverr Pro, Upwork, Twine o contacto directo). El contrato dice que las obras son "por encargo" y que todos los derechos se ceden a Lumen Labs.

**Costo aproximado**: según una guía de precios, los compositores independientes cobran unos US$100–500 por minuto de música y los estudios boutique US$500–2,000 o más por minuto, y "el precio cambia según quieras compra total, exclusividad o uso limitado" ([Twine](https://www.twine.net/blog/music-composer-prices-and-commissions)). Esa guía no dice cuánto más cuesta ceder todos los derechos; hay que pedirlo explícito. Para nuestro paquete (tema en 3 versiones, cama de ~60 s, versión de 15 s abierta, logo sonoro y stems; unos 2-3 minutos de música útil) mi estimación es **US$300–800**, tope US$1,000. Es una estimación mía, no una cotización.

**Condiciones que hay que confirmar (en el contrato)**:

1. Cesión total, permanente y mundial de derechos (autor y editorial), para cualquier medio, con derecho a editar, acortar y remezclar.
2. Renuncia a regalías futuras y a registrar la obra en una sociedad de gestión colectiva que cobre por nuestro uso, o cesión de esa parte.
3. Declaración de originalidad: sin muestras ajenas, sin parecido con obras conocidas, **sin música generada por IA**.
4. Entrega de archivos de trabajo, stems y versiones (sección 7).
5. Garantía e indemnización si la obra infringe derechos de terceros.
6. Exclusividad: el compositor no reutiliza el tema.
7. Que la plataforma de contratación transfiera la titularidad al comprador y no la retenga. **No lo he verificado.** Algunas plataformas dan al comprador solo una licencia, no la propiedad, salvo que se compre un "uso comercial extendido" o se firme contrato aparte. Hay que leer los términos antes de contratar.
8. D27: `legal-compliance` revisa los términos de la plataforma (y si limita proyectos para menores) antes de abrir cuenta.

**Ventajas**: la melodía es 100 % nuestra, exclusiva y registrable como sello sonoro de la marca; sirve para todos los videos futuros sin pagar otra vez; permite pedir "elástica" y por capas; sin riesgo de que otra marca use la misma pista.
**Desventajas**: depende de una persona (plazo de 3 a 7 días, posibles rondas de ajustes); cuesta más que una pista suelta.

### 5b. Biblioteca con licencia comercial

Revisé cuatro. Resultado: **ninguna licencia estándar cubre claramente nuestro caso.** Todas exigen acuerdo escrito aparte (empresarial o a la medida) para productos.

| Biblioteca | Qué dice (cláusula) | ¿Cubre producto personalizado vendido al cliente? | Costo |
|---|---|---|---|
| **Artlist** | Ayuda oficial: "Artlist's standard Creator Pro and Social Creator licenses do not cover the use of Artlist music in a product" y sugiere un acuerdo Enterprise ([enlace](https://artlist.freshdesk.com/support/solutions/articles/43000669729-what-license-do-i-need-to-use-artlist-music-in-my-product-)). Licencia Pro: "this License does not allow you to use, make available or present any Assets as a separate file", "you can't allow anyone to use the Assets as separate files for listening, viewing, downloading... use as a template", y "Apps, software, games and their end-users" requieren soluciones dedicadas de ventas ([licencia Pro, PDF](https://artlist.io/media/w5mglb2w/pro-license-current-02092024.pdf)). Además, "only you can download the Assets" | No con la estándar. Posible con Enterprise (a cotizar) | Enterprise: sin precio público; pedir cotización |
| **Epidemic Sound** | Página oficial del plan Pro: cubre contenido para clientes y publicidad en línea; no menciona productos ni apps ([enlace](https://www.epidemicsound.com/commercial-subscription/)). El plan Business añade "publish soundtracked content across games and apps". Los términos de uso final (leídos en una copia de un tercero, [videobolt](https://videobolt.net/epidemic-sound-terms), a confirmar en la web oficial) prohíben: "make the Licensed Works available in any physical products", hacer la obra disponible "on a stand-alone basis", y producciones hechas "to be used, licensed, sold or in any other way exploited by any third party"; también incluir la obra "in a software application or video game" | No. Vender el video a un tercero cae en lo prohibido salvo acuerdo a la medida | Pro/Business: ver precios en su web; a la medida: cotizar |
| **Musicbed** | La página de licencias solo pregunta si se licencia como individuo o empresa y dice que los proyectos que generan ingresos "may typically fall under the business category"; el precio sale del formulario de licencia ([enlace](https://support.musicbed.com/picking-the-right-license)). No habla de productos al consumidor ni de apps | Sin dato público. Hay que preguntar por escrito a `support@musicbed.com` | Cotización a la medida (suele ser la más cara; sin cifra publicada) |
| **PremiumBeat** | Acuerdo de licencia, sección 4: prohíbe revender la grabación "by itself or as part of a package except solely as embodied within your Production", ponerla en "e-card templates or website templates", o hacerla descargable como archivo suelto. Sección 3: apps solo "not to exceed more than 1000 individual downloads". Uso por usuarios finales "for your own personal or single-seat organizational usage only" ([acuerdo](https://www.premiumbeat.com/music-agreement)). Permite producciones para clientes del creador, pero no habla de vender un video personalizado | Dudoso. Un video por pedido, casi igual a una tarjeta personalizada ("e-card"), se parece demasiado a lo prohibido | Suscripciones con precio público (ver su web); un caso así requiere carta |

Conclusiones:

- Una pista de biblioteca es **de varios clientes a la vez**: no podemos registrarla como sello de Jinglo, y otro puede usarla.
- El riesgo no es el costo de la pista: es que un producto cuyo valor es "video único con tu nombre" pueda leerse como "reventa de la música incrustada". Hay que tener la autorización por escrito de cada biblioteca, con la frase explícita "producto digital personalizado vendido al consumidor final".
- Costo no publicado. Mi estimación: cientos a miles de dólares al año por un acuerdo Enterprise (no verificado; pedir cotización).
- Mientras no haya carta escrita, no se usa ninguna pista de biblioteca en nada que se venda, ni siquiera "temporalmente". Para ensayos internos se pueden usar pistas de referencia que **no** salgan de la carpeta de trabajo.

**Preguntas exactas para enviar** a cada biblioteca (las envía `legal-compliance`): "Vendemos a consumidores finales un video de ~60 s con su nombre dicho por un personaje, producido por pedido. La misma pista de fondo va en todos los videos. ¿Su licencia (nombre del plan) cubre este uso, a perpetuidad, en estos países (Guatemala, Costa Rica, El Salvador, Honduras, Panamá)? ¿Qué cláusula? ¿Qué precio?"

### 5c. Villancico de dominio público reinterpretado

**Cuáles son de dominio público (composición)**: según una lista de la Biblioteca de la Universidad Estatal de Ohio ([enlace](https://library.osu.edu/site/copyright/2018/12/21/public-domain-christmas-songs/)): Away in a Manger, Deck the Halls, Jingle Bells, Silent Night, Up on the House Top, Toyland, The Twelve Days of Christmas, We Wish You a Merry Christmas y O Christmas Tree. Siguen protegidos, por ejemplo: Winter Wonderland (2030), Rudolph the Red-Nosed Reindeer (2035), Frosty the Snowman (2046), Jingle Bell Rock (2053). Fuera de la lista, villancicos tradicionales en español como "Campana sobre campana" y "Noche de paz" (melodía de Gruber, 1818) son de autor antiguo; hay que verificar caso por caso, porque las **letras en español y los arreglos modernos pueden tener autor vivo o reciente**.

**Condición clave**: el dominio público cubre la composición, **no la grabación**. Una grabación famosa sigue siendo de su productor. Se puede usar solo si (1) la grabación misma es de dominio público (en EE. UU. las publicadas antes de cierta fecha; la fecha avanza cada año, y hay que confirmar con `legal-compliance` para cada archivo), o (2) la grabamos nosotros (orquesta o músicos propios, con cesión de su interpretación). Bancos como Musopen, la Biblioteca del Congreso o Internet Archive tienen grabaciones antiguas, pero con calidad de época que no da el "cine navideño" que exige el brief.

**Costo aproximado**: US$150–500 (un arreglista humano que escribe y graba una versión nueva, con contrato de cesión igual al de 5a). Más barato, pero no mucho menos.

**Ventajas**: sin riesgo de derechos de la melodía; reconocible al instante.
**Desventajas (decisivas para Jinglo)**:

- No es nuestra: cualquiera puede hacer lo mismo, así que no es sello de marca.
- El brief pide no copiar películas ni marcas. Villancicos como Jingle Bells están ligados a anuncios y películas famosas, y un niño ya los oyó en mil lugares: baja el asombro de "esto es solo para mí".
- Seguimos necesitando a un compositor o arreglista y su contrato. Se ahorra poco.
- Un arreglo de un villancico tradicional con letra puede mezclarse con la letra protegida. Solo melodía, sin letra.

**Uso recomendado de 5c**: opcional, como un guiño mínimo (2 compases de "Noche de paz" o "Campana sobre campana" al cierre, instrumental), **solo con visto bueno por escrito de `legal-compliance`**. No para el tema principal.

### Comparación

| | (a) Compositor | (b) Biblioteca | (c) Dominio público |
|---|---|---|---|
| Cubre producto personalizado vendido | Sí, por contrato | No con licencia estándar; solo con acuerdo especial | Sí (composición); la grabación debe ser propia |
| Costo piloto | US$300–800 (estimado) | Sin dato público; cotizar | US$150–500 (estimado) |
| Exclusividad / sello de marca | Sí | No | No |
| Riesgo legal | Bajo si el contrato es bueno | Alto sin carta escrita | Medio (grabación, letra, arreglo) |
| Calidad "cine" | Alta (según compositor) | Alta | Media-alta si se regraba |
| Plazo | 3–7 días | Horas (pero la carta puede tardar semanas) | 3–5 días |
| Efecto en el brief | Cumple | Cumple solo con carta | Choca con "no recordar películas" |

## 6. Recomendación para el piloto

**Opción (a): compositor humano por encargo con cesión total de derechos, y un solo pedido que cubra todo el paquete del piloto.**

Razones:

1. Es la única que garantiza por contrato que el uso (producto vendido al cliente final) está cubierto.
2. La melodía de Jinglo es un activo de marca. Pagarla una vez y tenerla para todos los videos (Navidad, cumpleaños, otros) sale más barato que licenciar cada año.
3. Permite pedir la música elástica por capas que exige el nombre variable.
4. En paralelo y sin compromiso: `legal-compliance` envía las preguntas de la sección 5b a Musicbed y Artlist (Enterprise). Si llega un "sí" por escrito, tendremos plan B.

Costo: US$300–800 por una sola vez (tope US$1,000). Aprobación de Juan: **pendiente**, porque el presupuesto del piloto (~$100–110) no lo incluye.

Plazo: pedir las pistas ya, porque el flujo de video y labios sigue y la mezcla va después de las tomas. Las escenas de Flow deben producirse antes del 5-dic-2026 (brief); la música no depende de Flow, pero sí hay que tenerla antes del montaje final.

Pasos:

1. Juan aprueba el gasto.
2. `legal-compliance` revisa la plataforma o forma de contratación (D27) y redacta el contrato de cesión.
3. Se envía el brief del compositor (sección 7).
4. Se recibe una maqueta en 48 h; ajustes (máximo 2 rondas).
5. Prueba de parecido y de escucha (secciones 1 y 4.5).
6. Entrega de stems a `video-edicion-post`.

## 7. Brief para el compositor (instrucciones de entrega)

No se genera música con IA. Esta sección reemplaza las "instrucciones de generación" por el encargo humano.

**Qué se pide**

1. Tema de Jinglo (4 compases, sección 1) en versión celesta sola, versión cuerdas + coro, y versión alegre (con cambio de tono).
2. Cama del video 1 (~60 s) por secciones: expectativa, búsqueda, ternura, alegría, cierre. Cada una con 2 y 4 compases de sostenido para alargar.
3. Versión del video gratis (15 s) que termina **abierta** (sin resolver).
4. Logo sonoro (~1.2 s).
5. Destellos dorados sueltos (celesta alta + campanillas): 3 variantes.
6. Para cada versión: archivo único y stems (celesta, cuerdas, campanas, coro, ritmo).
7. Formato: WAV 48 kHz / 24 bits, sin limitador, con -6 dB de margen. Cue sheet con tempo y compases.
8. Sin graves ni ataques fuertes; sin letra en el coro; no hacer sonar nada parecido a obras conocidas (lista en 1).
9. Referencias de sensación (no de melodía): "caja de música que se abre", "nana navideña con cuerdas cálidas". No se enviarán canciones de referencia con derechos a nombrar como modelo.

**Para `video-ia-generativa` y `video-edicion-post` (sin generar audio)**

- Los clips de Flow salen **sin su audio** (descartarlo). El sonido se reconstruye aquí.
- Entregar un marcador de tiempo por clip: inicio de la búsqueda, inicio del nombre y fin del nombre. Con ellos se coloca el silencio de ~0.5 s y los destellos.
- Los tramos con labios sincronizados (ver brief) se mezclan con la voz limpia, sin música debajo, antes de pasar a Sync Labs.
- La pista de música se une al final, con el ducking de la sección 4.2.

## 8. Dudas abiertas

1. **Presupuesto**: US$300–800 no está en el piloto aprobado. Necesita decisión de Juan.
2. **Plataforma de contratación**: no he verificado cómo Fiverr o Upwork transfieren la titularidad. Hay que leerlo (D27) o usar contrato directo.
3. **Epidemic Sound**: leí sus términos en una copia de un tercero; hay que confirmar en la web oficial antes de citarlos como definitivos.
4. **Dominio público**: la fecha de entrada de grabaciones antiguas a dominio público cambia cada año; `legal-compliance` debe confirmar archivo por archivo si algún día se usa una.
5. **Guion**: los tiempos de la sección 2 se ajustan al guion de `video-guionista` cuando exista.
6. **Prueba con niños**: solo después de la aprobación de voz de ElevenLabs (o plan B Fish Audio).
7. **Revisión de `desarrollo-infantil`**: validar que la mezcla y los efectos de la sección 3 no inquietan a un niño de 3 años.
8. **Efectos**: hoja de registro de licencias por sonido, a revisar por `legal-compliance`.
