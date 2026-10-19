# Jinglo: anuncios estaticos y guiones (19-oct-2026)

`productor-creativo` · estetica de papel recortado de la landing v2 (mismas ilustraciones, logo C, Fraunces + Pinyon). Costo: $0 (composicion con Chromium; sin generacion de imagen). Sin resenas, sin cifras inventadas, sin marcas de terceros, sin URL (aun no hay dominio de Jinglo: el enlace va en el boton del anuncio). Toda pieza lleva "Voz de Santa generada con inteligencia artificial" (legal, `docs/legal/aprobacion-jinglo.md`). Fuente: `/tmp` generador no versionado; las piezas finales estan en `img/`.

| # | Archivo (`img/`) | Formato | Idioma | Angulo | Titular |
|---|---|---|---|---|---|
| 1 | `es-reaccion-4x5.webp` | 1080x1350 | es-MX | Reaccion | Una llamada del Polo Norte. Una cara que no vas a olvidar. |
| 2 | `es-nombre-9x16.webp` | 1080x1920 | es-MX | Personalizacion | Hay una llamada del Polo Norte para Sofia. (nombre de ejemplo, ilustrativo) |
| 3 | `es-telefono-4x5.webp` | 1080x1350 | es-MX | Escena | Suena el telefono. Es del Polo Norte. |
| 4 | `es-nochebuena-9x16.webp` | 1080x1920 | es-MX | Urgencia real | Nochebuena no espera a nadie. Ultimo dia para reservar: 22 de diciembre. |
| 5 | `en-hero-4x5.webp` | 1080x1350 | en-US | Promesa | This year, the North Pole is calling home. $14.99 |
| 6 | `en-keepsake-9x16.webp` | 1080x1920 | en-US | Recuerdo | A keepsake that outlasts Christmas. |

Precios: MX$199 y $14.99 salen de `packages/config`. US esta cerrado por defecto (`ENABLED_COUNTRIES`): no pautar 5 y 6 hasta abrirlo (decision de Juan). Ningun anuncio debe salir antes de las busquedas oficiales de marca (D19).

Textos para Meta/TikTok (es-MX): "Santa llama a tu peque por su nombre. Tu eliges el dia y la hora y te quedas con la grabacion y el certificado. Pago unico, sin suscripcion. Voz de Santa generada con IA." Parametro de seguimiento: `?cr=ig-reaccion-1` (ids `cr`: `ig-reaccion-1`, `ig-nombre-1`, `ig-telefono-1`, `tt-nochebuena-1`, `en-hero-1`, `en-keepsake-1`).

## Guiones de video de 15 s (vertical 9:16, es-MX)

Reglas: gancho en el segundo 1; la voz de Santa en pantalla es la muestra real (`apps/web/public/audio/jinglo-santa-es.mp3`) con rotulo "Voz generada con IA"; nunca un menor real; la cara del peque no se muestra (mano, espalda, silueta, o la ilustracion).

### V1 "Reaccion" (angulo principal)
- 0-1 s: primer plano de un telefono rojo antiguo vibrando sobre una mesita, nieve en la ventana. Texto grande: "Suena el Polo Norte." Sonido: timbre.
- 1-5 s: una mano adulta alcanza el telefono y lo ofrece fuera de cuadro hacia abajo. Texto: "Tu solo tienes que estar ahi."
- 5-11 s: audio real de la muestra (Santa dice "Hola"), subtitulos en papel recortado. Corte a la ilustracion del nino contestando.
- 11-15 s: logo Jinglo + "Reserva la llamada · MX$199". Rotulo fino: "Pago unico, sin suscripcion. Voz de Santa generada con IA."

### V2 "Escribe su nombre"
- 0-1 s: pantalla del movil, un campo vacio y el texto "Escribe el nombre de tu peque." (gancho: el cursor parpadea).
- 1-6 s: grabacion de pantalla real de la landing: se teclea un nombre de ejemplo, el titular cambia a "Hay una llamada del Polo Norte para ..." y el certificado se llena.
- 6-12 s: la tarjeta "Polo Norte llamando..." suena y Santa aparece sobre ella (animacion simple de la ilustracion).
- 12-15 s: "Reserva la llamada · MX$199" + aviso de IA.

### V3 "Nochebuena no espera" (urgencia real, solo del 11 al 22 de dic)
- 0-1 s: trineo cruzando la luna, texto "Quedan pocos dias." (solo si la fecha real lo respalda: usar el contador de la landing).
- 1-7 s: pueblo nevado, ventanas que se encienden una a una; locucion humana o texto: "Nochebuena no espera a nadie."
- 7-12 s: rotulo "Ultimo dia para reservar: 22 de diciembre. Llamadas hasta el 24."
- 12-15 s: CTA "Reserva la llamada · MX$199" + aviso de IA. Prohibido decir "quedan N cupos".
