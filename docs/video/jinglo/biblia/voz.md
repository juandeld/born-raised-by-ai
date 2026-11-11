# Biblia de Jinglo videos · Voz de Santa

11-nov-2026 · `video-voz-santa` · borrador para el director creativo (se integra en `docs/video/jinglo/biblia.md`).
Estado: especificación. Nada de esto se probó todavía con audio. Lo marcado `[no verificado: calibrar]` son valores iniciales o capacidades del proveedor que hay que comprobar en la cuenta antes de fijarlos.

## 0. Reglas que mandan sobre todo lo demás

1. Español latino neutro con acento de México. Nunca de España: nada de "vale", "vosotros", "ordenador", ni la zeta ni la ese castellanas.
2. Santa nunca suena a locutor, a anuncio ni a doblaje de película. Suena a un abuelo que le habla a un solo niño, de cerca.
3. El nombre del niño se dice despacio, completo, con cariño, con el acento en la sílaba correcta. Nunca recortado.
4. Santa nunca dice que es IA, robot, computadora ni "soy humano" (D13). Tampoco habla de "mi voz".
5. Hasta la aprobación escrita de ElevenLabs: pruebas internas solo con nombres ficticios (sección 7). Ningún video con el nombre de un niño real sale del equipo.
6. Cada frase con el nombre se genera completa (nombre dentro), nunca el nombre suelto (sección 2.4).

## 1. La voz

### 1.1 Decisión: misma voz que las llamadas (D12)

Se usa "Santa Lumen Labs (es-419)", voz diseñada (no clonada), `voice_id` `LykVXmiL9G4zV1CJHN2o`. Razones: el niño que reciba el video y la llamada oye al mismo Santa, y Juan ya la eligió entre 3 previews.

Razón fuerte para cambiarla, y solo esta: que en banda completa (44,1 kHz) la voz no pase la prueba de la sección 1.4. La voz se eligió por cómo se entiende por teléfono (8 kHz). En video, con auriculares o televisor, puede sonar más delgada, más joven o con rasgos digitales que el teléfono escondía. Primera tarea de calibración: generar las 12 frases de prueba (sección 7.2) y escucharlas en teléfono y en televisor antes de seguir. Si falla, se pide a `video-director-creativo` diseñar una segunda voz "hermana"; no se cambia sola.

### 1.2 Ficha de timbre

| Rasgo | Objetivo |
|---|---|
| Edad percibida | 65 a 75 años. Hombre mayor, nunca viejo frágil ni "villano". |
| Registro | Grave-medio, redondeado, aterciopelado. Nada cavernoso ni ronco: la voz muy grave asusta a los 3 y 4 años. |
| Rasgo característico | Sonrisa audible en las vocales. Leve aspereza de abuelo en el fondo de la voz, sin ronquera. |
| Respiración | Suave, audible y rara (una cada 2 o 3 frases largas). No más: a los 3 años se nota como "ruido". |
| Cercanía | Como al oído, a un metro: sin proyección de teatro, sin "voz de micrófono". |
| Acento | México neutro. Seseo, "ll" y "y" iguales, sin vosotros. |
| Ritmo | 100 a 125 palabras por minuto en narración; 85 a 100 al decir el nombre y el motivo. |
| Volumen | Constante; solo baja en el susurro. Nunca sube de golpe (nada asusta). |
| Prohibido | Voz de anuncio, entonación de "oferta", sílabas marcadas una a una, risa de villano, tono de bebé, imitar a un actor conocido (A-09). |

### 1.3 Parámetros de generación sugeridos

En las llamadas la voz corre en el agente con `eleven_v3_conversational`. Para video pregrabado no hay conversación ni latencia que cuidar: se usa texto a voz no conversacional con el modelo multilingüe de mayor calidad (Eleven v3, `eleven_v3` `[no verificado: confirmar id exacto y soporte de es-419 en la cuenta]`).

Dato que hay que resolver antes de calibrar: las fuentes no coinciden sobre lo que ya se usa en las llamadas.

| Fuente | stability | similarity | speed |
|---|---|---|---|
| D12 (`docs/decisiones.md`) | 0,5 | no dice | 0,95 |
| Código (`engines/calls/src/providers/voice-elevenlabs.ts`, `ELEVENLABS_TTS_*`) | 0,6 | 0,9 | 0,95 |
| Guía de conversación (rango de prueba) | 0,40 a 0,55 | no dice | 0,90 a 1,00 (style 0,15 a 0,30) |

Para video se propone partir de la columna de D12 y la guía, porque la narración pregrabada se beneficia de más expresión que una llamada:

| Parámetro | Narración base (frases fijas) | Frase con el nombre | Susurro cómplice | Asombro suave |
|---|---|---|---|---|
| `stability` | 0,50 | 0,50 | 0,55 | 0,40 |
| `similarity_boost` | 0,80 | 0,80 | 0,80 | 0,80 |
| `style` | 0,20 | 0,25 | 0,15 | 0,35 |
| `speed` | 0,92 | 0,90 | 0,88 | 0,93 |
| `use_speaker_boost` | activado | activado | activado | activado |

Razonamiento:
- `speed` 0,92 y no 0,95: en el teléfono la compresión pide claridad; en video el niño mira y escucha con calma, y un Santa mayor habla un poco más lento. Más bajo de 0,88 empieza a sonar "arrastrado" y cansa a los adultos.
- Entre frases vecinas, `speed` no debe diferir más de 0,03 ni `stability` más de 0,10 (si no, cambia el carácter de la voz en el empalme).
- `similarity_boost` 0,80 y no 0,90: con 0,90 se pierde la variación natural y suena más plano. Con una voz diseñada (sin muestra real) no hay riesgo de "alejarse" de una persona.
- `style` alto (> 0,40) suele exagerar y suena a locutor: tope 0,35.
- Eleven v3 usa estabilidad por niveles (Creative, Natural, Robust) y puede ignorar `style`, `speaker_boost` o `speed` `[no verificado: calibrar]`. Si el modelo ignora un parámetro, se fija con la etiqueta de actuación (sección 3) y con la puntuación del texto.
- Semilla (`seed`) fija por frase fija; se guarda en el registro de la frase para poder regenerarla igual.
- Salida: la más alta disponible en banda completa (PCM 44,1 kHz `[no verificado: formato según plan]`), remuestreada a 48 kHz, mono, sin compresión, sin normalizar ni procesar. La mezcla es de `video-musica-sonido`. Se entrega con 150 ms de silencio al inicio y 250 ms al final.

### 1.4 Prueba de aceptación de la voz (antes de producir)

Se acepta la voz para video si, con 5 adultos que no conocen el proyecto (sección 7.2) y las 12 frases:
- Calidez 4 o más sobre 5 y "suena mayor" 4 o más sobre 5.
- Ninguno dice "de España" y al menos 4 de 5 dicen "México o latino".
- Naturalidad 4 o más sobre 5, y 4 de 5 contestan "persona real" a "¿es una persona o una máquina?" (solo se pregunta en la prueba interna con adultos, nunca a niños).
- Ninguno la describe como "locutor", "anuncio" o "robot".

### 1.5 Risa

- Texto: "Jo, jo, jo." con minúscula y comas. Nunca "JO JO JO", "¡JO! ¡JO! ¡JO!" ni "ja, ja".
- Etiqueta de actuación antes (si el modelo la soporta): `[chuckles]` o `[warmly]`. No usar `[laughs]` fuerte `[no verificado: calibrar]`.
- Duración: de 0,8 a 1,2 s en total, de pecho, suave, con la sonrisa ya puesta en la voz. Sin eco ni vibrato.
- Frecuencia: máximo 2 por video de 60 s; 0 en el de 15 s (el espacio es del suspenso). Nunca justo antes de decir el nombre (distrae) ni al cerrar con tono serio.
- Mejor dentro de una frase que sola: "Y ahí estabas tú... jo, jo, jo... en la primera página." Una risa suelta suena a efecto de sonido.
- Se descarta la toma si la risa es staccato (golpes secos), grave y larga (asusta), aguda (suena a elfo) o repetida con idéntico timbre (suena a muestra).

### 1.6 Pausas

| Pausa | Duración | Dónde |
|---|---|---|
| Respiro entre frases | 0,35 a 0,5 s | Fin de cada frase; se escribe con punto. |
| Antes del nombre | 0,6 a 0,8 s | "Y el nombre que encontré es... [Nombre]." (puntos suspensivos en el texto). |
| Después del nombre | 0,8 a 1,2 s | Deja que el niño lo oiga; la música o el libro llenan el silencio. |
| Antes del motivo | 0,4 s | "...y sé por qué: [motivo]." |
| Suspenso del video gratis | 1,0 a 1,5 s | Antes de "Tengo algo más que decirte..." |

Las pausas largas no se piden con `speed`: se escriben en el texto (puntos suspensivos, comas, guion largo) y se recortan o alargan en edición. Una pausa de más de 1,5 s dentro de una generación suele sonar a error; si hace falta más silencio, se genera por separado y se deja el silencio en el montaje.

## 2. Cómo se genera y se empalma

### 2.1 Frases fijas y frases personalizadas

- Frases fijas (sin nombre ni datos): se generan una sola vez, offline, 3 a 5 tomas cada una; elige `video-voz-santa` con `video-direccion-arte` en la sala de edición. Se guardan con su semilla y sus parámetros.
- Frases personalizadas (con nombre, edad, logro, gusto): se generan por pedido, cada una completa.
- Los parámetros de ambas son los de la tabla 1.3 y no cambian por pedido.

### 2.2 Qué se genera como una sola pieza

Una pieza = un grupo de aliento: una a tres frases seguidas que Santa diría sin tomar aire largo. Se corta SOLO en pausas entre frases. Nunca se corta dentro de una palabra ni entre el nombre y la palabra que lo rodea.

### 2.3 Cómo se pegan sin que cambie el tono

1. Cortar siempre en el medio de una pausa (silencio real, no a media respiración).
2. Fundido cruzado de 40 a 80 ms. Nunca corte seco: se oye un chasquido.
3. Dejar la misma sala: ruido de fondo (room tone) de 0,5 s de la voz base bajo todo, a -60 dBFS aprox., para que el silencio de una pieza no sea "más negro" que el de la otra. Lo aplica `video-musica-sonido`.
4. Control automático de empalme, por pieza personalizada contra la fija vecina:
   - Tono medio (F0 mediano) dentro de ±8 %.
   - Volumen de la voz (LUFS de la pieza) dentro de ±1,5 LU.
   - Ritmo (sílabas por segundo) dentro de ±12 %.
   - Si falla algo, se regenera (cuenta como un reintento de la sección 4).
5. La frase que contiene el nombre nunca es la primera ni la última del video (arranque y cierre son fijos y lo marcan).

### 2.4 Por qué la frase completa con el nombre dentro y no el nombre suelto

El nombre suelto, pegado en un hueco, suena a anuncio de aeropuerto: sin la entonación de la frase, sin la coarticulación con la palabra anterior y con un final que cae distinto. La prosodia de una frase depende de todas sus palabras. Por eso:
- Se escribe la frase entera, con el nombre en su sitio natural.
- Se evita poner el nombre al final absoluto de la frase si el nombre es corto (3 a 4 letras): se suele recortar la última sílaba. Reordenar: "Mateo, ahí estás." en vez de "Ahí estás, Mateo."
- Si el guion pide una frase con el nombre dos veces, se genera una sola pieza con las dos (el segundo "Mateo" sale con una entonación distinta, natural).
- Costo: cada frase personalizada se paga completa. Es el costo correcto: es lo que hace creíble el video. El presupuesto de caracteres lo calcula `video-ia-generativa`.

### 2.5 Video gratis de 15 s

Santa dice el nombre mirando el libro, sin labios que sincronizar. La voz se siente "de cerca y para sí mismo", con 0,92 de `speed` y la misma tabla. Termina en suspenso, en susurro cómplice (sección 3). Mismo control automático del nombre (sección 4).

## 3. Indicaciones de actuación por tipo de frase

Las etiquetas entre corchetes son para Eleven v3 y se escriben en inglés `[no verificado: probar cuáles reconoce en español]`. Si el modelo no las respeta, se logra lo mismo con la puntuación y con `style`/`stability`. Una etiqueta por frase, nunca más de dos por pieza: apilar etiquetas produce teatro.

| Tipo de frase | Intención | Etiqueta (opcional) | Texto y puntuación | Parámetros |
|---|---|---|---|---|
| Saludo de apertura | Entra a una conversación ya empezada, cálido, sin "¡Hola, amiguitos!" | `[warmly]` | "Ah... qué bueno que llegaste." Frases cortas. | Narración base |
| Busca en el libro | Curioso, murmura para sí, casi sin mirar a cámara | `[curious]` o ninguna | "A ver, a ver... aquí... no... ahí, quizá." | Narración base, speed 0,90 |
| Encuentra el nombre | Asombro suave, de abuelo que halla algo que esperaba | `[softly amazed]`, o ninguna | "¡Oh! Aquí está." Una sola exclamación. | Asombro suave |
| Dice el nombre | Despacio, con cariño, sonrisa audible. El momento central | `[warmly]` | "Y el nombre que encontré es... Mateo." Pausas de la tabla 1.6. | Frase con el nombre |
| Motivo (logro del niño) | Orgullo tranquilo, nunca halago exagerado ni "has sido muy bueno" genérico | `[proudly]` o ninguna | Frases de 8 a 14 palabras, un solo logro por frase. | Narración base |
| Gusto del niño | Complicidad de quien lo sabe porque lo vio | `[smiling]` | "Y me contaron que te encantan los dinosaurios." | Narración base |
| Susurro cómplice | Para decir algo "solo para él" | `[whispers]` | Frase corta, nunca de más de 12 palabras. No susurrar nombres. | Susurro cómplice |
| Niño Dios (casilla opcional) | Alegre y respetuoso, sin competir con Santa ni explicar quién trae qué (D13) | ninguna | Una sola frase de enlace. | Narración base |
| Suspenso del video gratis | Cómplice, deja una promesa abierta, sin ansiedad | `[whispers]` y luego pausa | "Tengo algo más que decirte... sobre tu regalo." No prometer un regalo concreto. | Susurro cómplice |
| Despedida | Suave, un punto más lento, más cálido que al inicio | `[warmly]` | Cierra con el nombre una vez como mucho, y ahí no con risa. | Narración base, speed 0,89 |
| Risa | Ver sección 1.5 | `[chuckles]` | "jo, jo, jo" dentro de la frase | Narración base |

Siempre:
- Nunca regañar ni insinuar que "casi no estás en la lista".
- Nunca prometer un regalo concreto.
- Nunca decir "soy IA" ni "soy humano" (D13).
- Nada que asuste: ni gritos, ni susurro largo, ni preguntas que suenen a vigilancia ("te veo", "sé dónde estás"). "Sé" solo con cosas que contó el adulto, dichas con calidez.
- La edad del niño se usa para el ritmo: a los 3 y 4 años, `speed` 0,90 en todo y frases de menos de 10 palabras; a los 8 y 9, `speed` 0,93 y frases algo más largas.

## 4. Control automático del nombre por pedido

Va antes de la sincronización de labios (Sync Labs se paga solo si el audio pasa) y antes de cualquier composición.

### 4.1 Flujo

1. Se construye el texto TTS del nombre (sección 5.1) y la frase completa.
2. Se genera el audio de cada pieza personalizada.
3. Se transcribe la pieza con marcas de tiempo por palabra.
4. Se localiza el nombre en la transcripción y se compara con la forma esperada (4.2).
5. Se aplican además los controles de 4.3 a toda la pieza.
6. Si todo pasa: la pieza sigue a empalme y labios. Si algo falla: se reintenta (4.4).

La transcripción no debe enviarse a un proveedor sin documento D27 de `legal-compliance`. Opción preferida: un modelo de transcripción de código abierto, ejecutado por nosotros, sin enviar el nombre del niño a terceros `[no verificado: decide arquitecto]`. Si se usara la transcripción de ElevenLabs, queda cubierta solo si la aprobación escrita la incluye.

### 4.2 Comparación del nombre

Se compara la forma fonética, no la ortografía (el transcriptor escribe "Yeimy" por "Yeimi" y está bien):

1. Pasar a minúsculas y quitar tildes y signos.
2. Normalizar a una clave fonética española neutra: `h` muda; `v` a `b`; `ll` e `y` a `y`; `qu`, `c` ante a/o/u y `k` a `k`; `z` y `c` ante e/i a `s`; `g` ante e/i y `j` a `j`; `gu` ante e/i a `g`; `x` inicial a `s` y `x` entre vocales a `ks`, salvo que la forma esperada diga `j` (Ximena); `w` a `u` o `gu` según el diccionario; `ph` a `f`; `y` final a `i`; letras dobles a una.
3. Para nombres compuestos, comparar cada palabra y exigir que estén las dos, en orden y consecutivas.
4. Puntaje = 1 - (distancia de Levenshtein de las claves / longitud de la clave más larga).

Umbral (decide este rol, ajustable con datos):
- Nombres de 4 letras o menos: clave idéntica (puntaje 1,00).
- Nombres de 5 o más: puntaje >= 0,85, y la vocal acentuada de la forma esperada debe aparecer igual en la transcripción.
- Con "¿Cómo se pronuncia?" (sección 6) se compara con la forma pronunciada, no con la escrita.

### 4.3 Controles adicionales sobre la pieza

- El resto de la frase coincide con el guion con tasa de error de palabras <= 10 %. Detecta palabras inventadas y cortes.
- El nombre dura al menos 0,35 s por sílaba (si no, está atropellado o recortado) `[no verificado: calibrar]`.
- Sin silencio no previsto de más de 1,2 s ni solapamiento de voces.
- Duración de la pieza dentro de ±15 % de la esperada para el texto y la velocidad.
- Empalme (2.3, punto 4).

Límite conocido: la transcripción comprueba sonidos, no la sílaba acentuada. El acento se asegura así: nombres del diccionario con acento ya validado una vez por oído (cada fila del diccionario se escucha una vez antes de entrar), nombres fuera del diccionario con la regla de tildes de 5.2, y revisión interna de una muestra del 2 % de pedidos por semana con el audio del nombre (después de entregado; no está en el camino del cliente).

### 4.4 Reintentos

| Intento | Qué cambia |
|---|---|
| 1 | Forma TTS del diccionario o de las reglas; semilla nueva. |
| 2 | Forma "Reintento" del diccionario; si hay "¿Cómo se pronuncia?" y no se usó, se usa aquí. Semilla nueva. |
| 3 | Forma silábica con guiones (por ejemplo "Ho-sué"), nombre en medio de la frase, un `speed` 0,02 más bajo. Semilla nueva. |

Hasta 3 reintentos tras la primera generación, como pide el rol: la tabla de arriba da el cambio de cada intento y un cuarto y último intento repite el 3 con otra semilla. En el peor caso son 4 generaciones por pieza; `video-ia-generativa` calcula el costo con ese tope. Cada intento se registra (sin el nombre del niño en claro en el registro: solo id de pedido, intento, puntaje, causa).

### 4.5 Si falla después de 3 intentos

1. El pedido pasa a la cola de revisión; el audio no se entrega ni va a labios.
2. Aviso automático a `soporte-postventa` con id de pedido, nombre, intentos y puntajes.
3. Al adulto le llega un correo: "Tu video tarda un poco más: estamos afinando cómo suena el nombre." con plazo máximo de 24 h. No se dice cuál es el proveedor (D23) ni que falló una máquina.
4. `soporte-postventa` (o esta voz) propone una forma TTS, se genera y se valida con el mismo control. Si pasa, se continúa y la forma entra al diccionario.
5. Si pasadas 24 h no se logra: soporte escribe al adulto pidiendo cómo se dice (sección 6) o ofrece el apodo; si no hay solución, reembolso automático (principio de cero humanos en el cliente aplica a compra, creación y entrega; esto es la excepción de revisión).
6. Ningún video sale con un nombre que no pasó el control.

### 4.6 Medición

- KPI: >= 97 % de nombres correctos a la primera; cero quejas de pronunciación.
- Eventos para `analytics/events.ts` (los define `metricas`): `voice_name_check` con `attempt`, `score`, `passed`, `in_dictionary`, `used_pron_field`, `cause`. Sin el nombre.
- Cuando un nombre pase solo al intento 2 o 3 tres veces, entra al diccionario con la forma que funcionó.

## 5. Diccionario de pronunciación

### 5.1 Cómo se usa

- Columnas: Nombre (como lo escribe el adulto) · Se dice (sílaba acentuada en MAYÚSCULAS) · Forma TTS (lo que se envía a la voz) · Reintento (forma para el intento 2) · Amb. (Sí = el nombre admite varias pronunciaciones comunes en la región: se muestra la pista de la sección 6).
- Se busca el nombre ignorando mayúsculas, tildes y espacios sobrantes. Si el nombre está, se usa la forma TTS. Si el adulto llenó "¿Cómo se pronuncia?", esa forma manda (sección 6).
- Lo que ve el cliente (nombre dorado en el libro, correo, carta) usa SIEMPRE la ortografía original. La forma TTS es solo para la voz y nunca se muestra.
- La forma TTS lleva la tilde donde cae el acento y reemplaza grafías que el modelo leería mal ("Jhon" a "Yon", "Wendy" a "Güéndi"). No usar signos, números ni etiquetas dentro del nombre.
- Los nombres compuestos se escriben juntos, sin coma ni guion, para que el modelo no intercale pausa. Se dicen como una sola unidad.
- Las formas están escritas para el español de México neutro. Las que dependen de la familia (marcadas "Sí") son la pronunciación más frecuente que conozco en la región `[no verificado: validar por oído con hablantes de GT, SV, HN, CR y PA antes de dar por buena cada fila]`.
- Cada fila se escucha una vez antes de marcar "validada". Hasta entonces el diccionario es una hipótesis.

### 5.2 Reglas para nombres que no están en el diccionario

1. Si es una palabra española regular (llana terminada en vocal, n o s; aguda terminada en consonante distinta de n o s), se envía tal cual.
2. Si lleva tilde, se mantiene.
3. Si es extranjero o se escribe con k, w, y inicial, th, ph, sh, ch inglesa, z ante a/o/u, se aplica la tabla de equivalencias: `w` a `gü` ante e/i y `u` en el resto; `sh` a `sh` (el modelo lo lee bien); `th` a `t`; `ph` a `f`; `k` queda; `y` inicial se queda como `y`; `z` queda.
4. Si termina en consonante y el diccionario no lo tiene, se pone la tilde en la penúltima sílaba (llana) para nombres de origen inglés (Brándon) y no se pone para nombres españoles (Daniel).
5. Si no se puede decidir, se genera con la forma sin tocar y se valida por el control. Si sale mal, intento 2 con tilde en la penúltima, intento 3 silábica.

### 5.3 Nombres femeninos

| Nombre | Se dice | Forma TTS | Reintento | Amb. |
|---|---|---|---|---|
| María José | ma-RÍ-a ho-SÉ | María José | María José | No |
| Ana Lucía | A-na lu-SÍ-a | Ana Lucía | Ana Lusía | No |
| Ana Sofía | A-na so-FÍ-a | Ana Sofía | Ana Sofía | No |
| María Fernanda | ma-RÍ-a fer-NAN-da | María Fernanda | María Fernanda | No |
| Dulce María | DUL-se ma-RÍ-a | Dulce María | Dulse María | No |
| Sofía | so-FÍ-a | Sofía | Sofía | No |
| Valentina | va-len-TÍ-na | Valentina | Balentina | No |
| Camila | ca-MÍ-la | Camila | Camíla | No |
| Isabella | i-sa-BE-la | Isabela | Isabéla | No |
| Mariana | ma-RIA-na | Mariana | Mariana | No |
| Daniela | da-NIE-la | Daniela | Daniela | No |
| Gabriela | ga-BRIE-la | Gabriela | Gabriela | No |
| Alejandra | a-le-JAN-dra | Alejandra | Alejandra | No |
| Andrea | an-DRE-a | Andrea | Andréa | No |
| Regina | re-JÍ-na | Regina | Rejina | No |
| Renata | re-NA-ta | Renata | Renata | No |
| Luciana | lu-SIA-na | Luciana | Lusiana | No |
| Mariela | ma-RIE-la | Mariela | Mariela | No |
| Karla | KAR-la | Karla | Carla | No |
| Brenda | BREN-da | Brenda | Brenda | No |
| Fátima | FÁ-ti-ma | Fátima | Fátima | No |
| Guadalupe | gua-da-LU-pe | Guadalupe | Guadalúpe | No |
| Yuliana | yu-LIA-na | Yuliana | Yuliana | No |
| Dayana | da-YA-na | Dayana | Dayana | No |
| Ariana | a-RIA-na | Ariana | Ariana | No |
| Abigail | a-bi-ga-ÍL | Abigaíl | Abigail | No |
| Mía | MÍ-a | Mía | Mía | No |
| Ximena | hi-ME-na | Jimena | Ximena | Sí |
| Xiomara | sio-MA-ra | Siomara | Xiomara | Sí |
| Génesis | JÉ-ne-sis | Génesis | Jénesis | No |
| Nayeli | na-ye-LÍ | Nayelí | Nayeli | Sí |
| Kimberly | KÍM-ber-li | Kímberli | Kimberli | No |
| Yeimi (Yeimy, Yaimi) | YÉI-mi | Yéimi | Yeimi | Sí |
| Ashley | ASH-li | Áshli | Ásheli | Sí |
| Allison | A-li-son | Álison | Alisón | Sí |
| Samantha | sa-MAN-ta | Samanta | Samantha | No |
| Stephanie | es-TÉ-fa-ni | Estéfani | Estefanía | Sí |
| Jennifer | YÉ-ni-fer | Yénifer | Jénifer | Sí |
| Jessica | YÉ-si-ca | Yésica | Jésica | Sí |
| Nicole | ni-CÓL | Nikól | Nicole | Sí |
| Michelle | mi-SHÉL | Mishél | Michél | Sí |
| Scarlett | es-car-LET | Escarlet | Escarlét | No |
| Zoe | ZO-e | Zoe | Zoé | Sí |
| Danna | DA-na | Dana | Danna | No |
| Keyla | KÉI-la | Kéila | Keila | Sí |
| Nathaly | na-ta-LÍ | Natalí | Nátali | Sí |
| Itzel | it-SEL | Itsel | Itzél | Sí |
| Lesly | LES-li | Lésli | Lesli | Sí |
| Heidy | JÉI-di | Jéidi | Éidi | Sí |
| Wendy | GÜÉN-di | Güéndi | Wéndi | Sí |

### 5.4 Nombres masculinos

| Nombre | Se dice | Forma TTS | Reintento | Amb. |
|---|---|---|---|---|
| Santiago | san-TIA-go | Santiago | Santiago | No |
| Mateo | ma-TE-o | Mateo | Matéo | No |
| Sebastián | se-bas-TIÁN | Sebastián | Sebastian | No |
| Matías | ma-TÍ-as | Matías | Matías | No |
| Emiliano | e-mi-LIA-no | Emiliano | Emiliano | No |
| Diego | DIE-go | Diego | Diego | No |
| Daniel | da-NIEL | Daniel | Daniél | No |
| David | da-BÍD | David | Dabíd | No |
| Gabriel | ga-BRIEL | Gabriel | Gabriél | No |
| Samuel | sa-MUEL | Samuel | Samuél | No |
| Josué | ho-SUÉ | Josué | Ho-sué | No |
| Joshua | YÓ-shua | Yóshua | Yoshúa | Sí |
| Dylan | DÍ-lan | Dílan | Dáilan | Sí |
| Jhon | YON | Yon | Yohn | Sí |
| Brayan / Bryan | BRÁ-yan | Bráyan | Brián | Sí |
| Kevin | KÉ-vin | Kévin | Kebin | No |
| Brandon | BRÁN-don | Brándon | Brandón | No |
| Jefferson | YÉ-fer-son | Yéferson | Jéferson | Sí |
| Jordan | YÓR-dan | Yórdan | Jordán | Sí |
| Anthony | ÁN-to-ni | Ántoni | Antoni | Sí |
| Christopher | CRÍS-to-fer | Crístofer | Cristófer | Sí |
| Cristian | CRIS-tian | Cristian | Cristian | No |
| Elías | e-LÍ-as | Elías | Elías | No |
| Ian | YAN | Yan | Ian | Sí |
| Ethan | Í-tan | Ítan | Étan | Sí |
| Liam | LIAM | Liam | Lyam | Sí |
| Noah | no-Á | Noá | Noa | Sí |
| Thiago | TIA-go | Tiago | Tiago | No |
| Adrián | a-DRIÁN | Adrián | Adrian | No |
| Alexander | a-lek-SÁN-der | Alexánder | Aleksánder | Sí |
| Joaquín | hoa-KÍN | Joaquín | Joakín | No |
| Rodrigo | ro-DRÍ-go | Rodrigo | Rodrigo | No |
| Andrés | an-DRÉS | Andrés | Andrés | No |
| Carlos | CAR-los | Carlos | Carlos | No |
| Luis | LUIS | Luis | Lu-is | No |
| Jorge | JOR-je | Jorge | Jorje | No |
| Juan Pablo | JUAN PA-blo | Juan Pablo | Juan Pablo | No |
| Juan Diego | JUAN DIE-go | Juan Diego | Juan Diego | No |
| Juan José | JUAN ho-SÉ | Juan José | Juan José | No |
| Juan Carlos | JUAN CAR-los | Juan Carlos | Juan Carlos | No |
| José Pablo | ho-SÉ PA-blo | José Pablo | José Pablo | No |
| José Carlos | ho-SÉ CAR-los | José Carlos | José Carlos | No |
| Luis Fernando | LUIS fer-NAN-do | Luis Fernando | Luis Fernando | No |
| Carlos Andrés | CAR-los an-DRÉS | Carlos Andrés | Carlos Andrés | No |
| Axel | AK-sel | Áksel | Axel | No |
| Máximo | MÁ-xi-mo | Máximo | Máksimo | No |
| Nicolás | ni-co-LÁS | Nicolás | Nikolás | No |
| Ángel | AN-jel | Ángel | Ángel | No |
| Óscar | OS-car | Óscar | Óscar | No |
| Kenneth | KÉ-net | Kénet | Kénez | Sí |
| Randy | RÁN-di | Rándi | Randi | No |
| Wilmer | GÜIL-mer | Güílmer | Wílmer | Sí |
| Edwin | ÉD-güin | Édgüin | Édwin | Sí |
| Emmanuel | e-ma-nu-EL | Emanuel | Emanuél | No |
| Yahir | ya-ÍR | Yaír | Yahír | No |
| Cristóbal | cris-TÓ-bal | Cristóbal | Cristóbal | No |
| Gerson | JER-son | Jérson | Yérson | Sí |
| Marlon | MAR-lon | Marlon | Marlón | No |
| Isaac | i-sa-AC | Isaac | Isaác | No |
| Josías | ho-SÍ-as | Josías | Josías | No |

(Total: 50 femeninos y 60 masculinos, 110 entradas.)

### 5.5 Apodos y diminutivos

El adulto escribe en "nombre del niño" lo que dicen en casa y Santa dice eso. No se "corrige" un apodo a su nombre formal. Se aplican las mismas búsquedas del diccionario.

| Apodo | Se dice | Forma TTS | Nota |
|---|---|---|---|
| Chepe | CHÉ-pe | Chépe | Guatemala y El Salvador, de José. |
| Pepe | PÉ-pe | Pepe | |
| Chema | CHÉ-ma | Chéma | |
| Memo | MÉ-mo | Memo | |
| Nando | NAN-do | Nando | |
| Beto | BÉ-to | Beto | |
| Nico | NÍ-co | Nico | |
| Santi | SAN-ti | Santi | |
| Juancho | JUAN-cho | Juancho | |
| Juanito / Juanita | jua-NÍ-to | Juanito | |
| Pancho | PAN-cho | Pancho | |
| Lalo | LA-lo | Lalo | |
| Gaby | GA-bi | Gaby | Escribir "Gábi" si el modelo lee "gabi" en inglés. |
| Dani | DA-ni | Dani | |
| Cami | CA-mi | Cami | |
| Sofi | SO-fi | Sofi | |
| Vale | VA-le | Vale | Con el contexto no se confunde con "vale" de España, que Santa nunca dice. |
| Mari | MA-ri | Mari | |
| Lupita | lu-PÍ-ta | Lupita | |
| Fer | FER | Fer | Corto: ver regla de nombres cortos. |
| Pau | PAU | Pau | Corto. Se pronuncia "pau" (una sílaba). |
| Teo | TE-o | Teo | Corto. |

Regla de nombres cortos (4 letras o menos, apodos de una sílaba): nunca al final de la frase (se recortan) y siempre con una palabra de arranque que el modelo pueda pronunciar con calma ("Mira, Fer: ahí estás."). El control de 4.2 exige clave idéntica.

### 5.6 Cómo crece el diccionario

- Quien lo mantiene: `video-voz-santa`. Entra un nombre cuando falla en el intento 1 tres veces en el mes, o cuando el adulto llena "¿Cómo se pronuncia?" con una forma que pasa el control (con el nombre ya anonimizado: solo la forma, no un pedido).
- Cada alta lleva la fecha, quién la validó por oído y el puntaje.
- Se pide a `soporte-postventa` la lista mensual de quejas de pronunciación.

## 6. Campo opcional "¿Cómo se pronuncia?"

### 6.1 Qué es y cuándo se muestra

Un campo de texto opcional justo debajo de "Nombre del niño". Siempre visible, pero con aviso destacado cuando el nombre escrito está en el diccionario con Amb. = Sí ("Este nombre se dice de varias formas. ¿Cómo lo dicen en tu casa?") o cuando contiene k, w, x, y inicial, h inicial, th, ph, sh o más de 2 palabras.

- Etiqueta: "¿Cómo se pronuncia? (opcional)".
- Ayuda: "Escríbelo como suena, como se lo dirías a un abuelo. Ejemplo: Yon (para Jhon)."
- Máximo 30 caracteres. Solo letras (con tildes y ñ), espacios, guion y apóstrofo.

No cuenta como uno de los 5 campos de datos de contenido de `video-psicologia-padres`: es de ayuda de pronunciación. Si se debe contar, se avisa a `video-psicologia-padres` para decidir cuál se sacrifica.

### 6.2 Cómo se usa

1. Se limpia: quitar espacios sobrantes, `[ ]`, `< >`, `{ }`, `(`, `)`, `*`, `/`, saltos de línea, números y emojis. Esto evita que alguien inyecte una etiqueta de actuación o una instrucción al TTS ("[laughs] ..."). Si tras limpiar queda vacío, se ignora.
2. Si el texto limpio tiene más de 3 palabras o parece una frase, se ignora (no es un nombre).
3. Forma TTS = el texto limpio, con las tildes que el adulto haya puesto. Si no puso tilde y el texto es llano o agudo irregular, se aplican las reglas de 5.2 solo para la tilde.
4. Orden: la forma del adulto manda sobre el diccionario. En el intento 1 se usa la forma del adulto. Si falla el control, el intento 2 usa la del diccionario, y el 3 la silábica.
5. El control (4.2) compara contra la forma del adulto. Si pasa, el video sale con esa pronunciación aunque difiera del diccionario.
6. Nunca se muestra en el video, el libro, el correo ni la carta; solo se usa para la voz.
7. Se conserva con el pedido y se borra con él (misma retención). Es dato derivado del nombre de un menor: no se usa para nada más y se añade al aviso de privacidad `[por `legal-compliance`]`.
8. Si el adulto no la usa y el nombre es ambiguo, se genera con la forma por defecto y no se pregunta nada más (cero humanos en el cliente). La queja entra en soporte y se corrige con una regeneración.

### 6.3 Sin audio de vista previa

No se ofrece escuchar el nombre antes de pagar: costaría una generación por visita, y antes de la aprobación de ElevenLabs sería usar la voz con nombres de niños reales. Si `video-psicologia-padres` lo pide para subir la conversión, se evalúa con `legal-compliance` y `video-ia-generativa`.

## 7. Pruebas

### 7.1 Reglas hasta la aprobación de ElevenLabs

- Nombres ficticios: se usan nombres del diccionario (todos son comunes) sin apellido y sin ningún vínculo con un niño real ni con hijos de nadie del equipo, ni de Juan.
- Nada de voz o datos de clientes. Nada de niños oyendo el audio.
- Audio de prueba para adultos del equipo y para la primera prueba ciega con papás (sin sus hijos).

### 7.2 Las 12 frases de prueba

4 fijas (apertura, búsqueda en el libro, despedida, suspenso del video gratis); 4 con nombre (2 de nombre fácil, 2 de nombre difícil: Xiomara y Jhon); 2 con risa; 1 de susurro; 1 de asombro. Cada una en 3 tomas. Se evalúan con la escala de la sección 1.4 y con la tabla de la 1.2.

### 7.3 Prueba del control automático

50 nombres del diccionario (todas las filas con Amb. = Sí y 20 al azar), 3 generaciones cada uno, para medir: porcentaje correcto a la primera (objetivo >= 97 %), falsos positivos (el control dice "pasa" y el nombre suena mal; se oyen 100 % de los "pasa" de esta prueba), falsos negativos (el control rechaza algo que suena bien; ajustar el umbral).

## 8. Plan B: Fish Audio

Aplica si ElevenLabs no aprueba por escrito, o tarda de modo que bloquee la fecha. Estado legal: permitido con condiciones (`docs/proveedores/fish-audio.md`): plan de pago, retención cero activada y con captura antes del primer pedido real, voz diseñada o de catálogo con licencia comercial (no clonar a una persona real), anotarlo en `docs/legal/subencargados.md` y en la política de privacidad. Falta, para la voz, la prueba de calidad en español latino: es esta sección.

Importante: las escenas de Flow siguen sirviendo. Solo cambia la voz; el audio nuevo se hace con la misma partitura de texto y se cae en los mismos planos con la sincronización de labios.

### 8.1 Qué habría que replicar

| Qué | Cómo |
|---|---|
| El timbre | Las 12 frases de 7.2 y la ficha de 1.2 son la referencia. Elegir en Fish 3 candidatas (catálogo con licencia comercial confirmada, o diseñada si el servicio lo permite) y pasar la prueba de 1.4. |
| El origen de la voz | No usar como referencia de clonación el audio generado en ElevenLabs sin revisar sus términos de uso del Output `[no verificado]`: puede estar prohibido usarlo para entrenar o clonar en otro servicio. Tampoco clonar a un actor sin que `legal-compliance` diga que cumple la condición "no clonar voces de personas reales". Se pregunta a `legal-compliance` cuál de las rutas aplica antes de empezar. |
| Velocidad, estabilidad, expresividad | Fish usa sus propios controles (velocidad y temperatura o similares) `[no verificado: nombres y rangos]`. Se parte de los objetivos medibles de la sección 1.3: 100 a 125 palabras por minuto en narración, 85 a 100 con el nombre, respiros y pausas de la 1.6. Se calibra por oído, no por número. |
| Etiquetas de actuación | Puede que use otra sintaxis para susurro, risa y emoción y que algunas no funcionen en español `[no verificado]`. Se redefine la tabla de la sección 3 con las que funcionen, y se compensa con la puntuación. |
| Risa | Repetir la prueba de 1.5; si no sale natural, componer la frase sin risa o sin "jo, jo, jo" (la risa es el primer rasgo que se pierde) y avisar a `video-guionista`. |
| Diccionario | Pasar TODAS las filas por Fish: las formas TTS están pensadas para ElevenLabs. Se añade la columna "Forma Fish" donde cambie, y se repite el control 7.3 (>= 97 % a la primera). |
| Control automático | Es independiente del proveedor: no cambia. Cambia solo qué eventos se registran (`provider`). |
| Empalme | Repetir el control 2.3 punto 4 con las voces de Fish (la estabilidad entre generaciones puede ser distinta). |
| Formato | Mismo audio final: 48 kHz, mono, sin procesar. |
| Legal y datos | Retención cero antes de cualquier nombre real; captura con fecha en `docs/legal/evidencia/`. |
| Llamadas | No cambian: usan el agente de ElevenLabs. Cambiar las llamadas a Fish es decisión de `arquitecto`. Aviso: Santa del video y Santa de la llamada serían voces distintas, y el niño lo notaría. Si la causa del "no" de ElevenLabs también afecta a las llamadas, hay que decidirlo con Juan. |

### 8.2 Prueba ciega comparativa

Objetivo: decidir con evidencia si la voz de Fish es lo bastante buena para sustituir a la de ElevenLabs (A). La prueba interna con ElevenLabs es posible porque usa solo nombres ficticios.

1. Material: las 12 frases (7.2) + 10 nombres difíciles del diccionario dichos dentro de una frase fija ("Y el nombre que encontré es... [Nombre]."), generados en A (ElevenLabs) y B (Fish). Para B se prueban 3 candidatas en una ronda previa de 3 personas del equipo; pasa a la ciega la mejor.
2. Igualar: mismo formato (WAV 48 kHz mono), misma sonoridad (LUFS), mismo silencio al inicio, sin música ni efectos. Nada de marcas ni nombres de archivo que delaten el origen.
3. Cegar: cada clip recibe un código al azar; el orden es aleatorio y distinto por persona; la clave la guarda `video-voz-santa` y no la conoce quien evalúa ni quien organiza la sesión.
4. Evaluadores: 5 adultos (papás de niños de 3 a 9 años de Guatemala, Costa Rica, El Salvador, Honduras o Panamá, que no conozcan el proyecto), la misma sesión de la primera prueba ciega con papás. Sin niños hasta que `legal-compliance` apruebe el proveedor elegido.
5. Preguntas por clip, escala de 1 a 5: calidez; "suena mayor"; naturalidad ("¿persona real o máquina?" como respuesta cerrada); acento ("México o latino" / "de España" / "otro"); "¿suena a locutor o a anuncio?" (sí/no); "¿se lo pondría a su hijo?" (sí/no).
6. Por cada nombre difícil: el evaluador escribe el nombre que oyó; después se le pregunta si "se dice como en tu casa". Mide si se entiende y si suena bien.
7. Elección forzada final: de cada par A/B con la misma frase, "¿cuál prefiere?".
8. Se acepta B si cumple todo esto:
   - Ninguna categoría del punto 5 queda más de 0,5 puntos por debajo de A.
   - Al menos 4 de 5 escuchan acento "México o latino" y ninguno "de España".
   - Al menos 95 % de los nombres escritos coincide con el esperado (clave de 4.2) y el control automático pasa >= 97 % a la primera en la prueba de 7.3.
   - En la elección forzada, B no pierde en más de 7 de 10 pares.
   - Ninguno califica a B como "locutor", "anuncio" o "robot" cuando A no recibió esa etiqueta.
9. Con 5 personas no hay significancia estadística: es un filtro, no una prueba concluyente. Cualquier "no" claro en calidez, acento o naturalidad pesa más que el promedio. Si B queda al límite, se amplía a 10 evaluadores o se prueba con otra candidata.
10. Resultado: una página en `docs/video/jinglo/biblia/` con las tablas, la decisión, la fecha y las candidatas descartadas (`video-control-calidad` tiene veto independiente).

## 9. Qué se entrega a los demás

| A quién | Qué |
|---|---|
| `video-guionista` | Longitud de frase (8 a 14 palabras), ubicación del nombre (nunca al final si es corto), máximo 2 risas, ningún nombre susurrado, 3 a 4 años: frases de menos de 10 palabras. |
| `video-ia-generativa` | Tabla 1.3, semillas, flujo de la sección 4, formato de entrega, recuento de caracteres por pedido con 4 generaciones por pieza como peor caso. |
| `video-musica-sonido` | Voz seca en WAV 48 kHz, room tone, fundido de 40 a 80 ms, silencios de 0,6 a 1,2 s alrededor del nombre sin música fuerte. |
| `video-edicion-post` | Voz en piezas por grupo de aliento, regla de cortes en pausas, momento exacto del nombre (marca de tiempo de la transcripción) para el nombre dorado del libro. |
| `soporte-postventa` | Cola de revisión (4.5), correo de espera, regla de reembolso. |
| `legal-compliance` | Campo de pronunciación como dato derivado del nombre de un menor; proveedor de transcripción; ruta de la voz en Fish. |
| `metricas` | Evento `voice_name_check` (4.6). |

## 10. Dudas abiertas

1. D12 dice stability 0,5; el código por defecto usa 0,6 y similarity 0,9. Confirmar qué corre hoy en el agente vivo antes de comparar video contra llamada.
2. Si la voz diseñada para el teléfono sirve en banda completa (1.1). Es la primera prueba de oído.
3. Qué parámetros acepta Eleven v3 realmente (stability por niveles, style, speed, etiquetas en español) y si admite pronunciación por diccionario o por fonemas. Se evitó depender de ello: todo el diccionario funciona por grafía.
4. Proveedor de transcripción: de código abierto propio (preferido) o uno con documento D27.
5. Si se cuenta o no el campo "¿Cómo se pronuncia?" dentro de los 5 campos de `video-psicologia-padres`.
6. Ruta de la voz en Fish (catálogo, diseñada, actor con licencia): decide `legal-compliance`.
7. Todas las filas del diccionario son hipótesis hasta oírlas con hablantes de cada país.
