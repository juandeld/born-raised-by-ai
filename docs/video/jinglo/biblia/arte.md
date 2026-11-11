# Jinglo · Biblia · Sección de arte

11-nov-2026 · `video-direccion-arte` · versión `arte-v1.1` (ronda 2 aplicada) · alcance: lo que necesita el piloto ("La Lista de Niños Buenos" ~60 s y video gratis de 15 s). Escenarios del resto del mundo (taller de duendes, establo y trineo, sala de mapas) quedan para después del piloto.

**Estado del Santa maestro:** el elegido es el clásico de traje rojo con ribete blanco de piel natural, cinturón café, lentes redondos dorados, barba larga y blanca, en un estudio con chimenea de piedra, velas y ventana con nieve (candidato "4"). **Juan confirmará entre "2" y "4"**: hasta entonces la ficha y la descripción maestra (1.9) son provisionales. Si gana el "2", se reescribe 1.9 y se pega de nuevo en `produccion/piloto-flow.md` (sección 3 y cada instrucción) antes de generar M1.

Principio: un mundo original, hecho a mano y usado durante siglos. Madera, lana, cuero, latón y papel envejecido. Nada de brillo plástico, nada de estética de videojuego, nada que recuerde a un Santa de marca o de película. El traje es el clásico que cualquier niño reconoce; lo que lo hace nuestro es la lana gruesa, el rojo profundo, el ribete de borrego natural, los lentes redondos de alambre dorado, el lunar, la nariz, la mancha de tinta y el estudio.

Los bloques en inglés (secciones 1.9 y 5) están pensados para pegarse tal cual en el generador de imagen y de video. El resto del documento está en español.

---

## 1. Ficha de Santa (Santa Lumen)

Cualquier descripción de Santa en una instrucción de generación debe partir del bloque "Descripción maestra" (1.9). No se parafrasea ni se abrevia.

### 1.1 Edad y complexión
- Edad aparente: 68 a 72 años. Vigoroso, no frágil.
- Complexión: alto (se nota junto al escritorio y al sillón), hombros anchos, panza redonda pero firme, no globo. Más "leñador jubilado" que "abuelito de caricatura". Se mueve despacio y con seguridad.
- Postura: espalda recta, cabeza ligeramente inclinada hacia quien escucha.

### 1.2 Rostro
- Forma: cara ancha y cuadrada con mandíbula suave, oculta casi toda por la barba.
- Piel: tono claro cálido curtido por el viento, con rubor natural en pómulos y nariz (no maquillaje rosa). Textura real: poros, pecas de edad en las sienes.
- Nariz: ancha, con puente ligeramente desviado a la derecha de Santa (rotura vieja), punta redondeada y un poco más roja que el resto.
- Mejillas: altas y plenas, se levantan visiblemente al sonreír; sonrisa mostrada solo con dientes superiores parejos, color marfil, no blanco publicitario.
- Ojos: color avellana oscuro (hazel-brown, aprox. #6B4A2B), con anillo más claro alrededor de la pupila. Ligeramente hundidos, con párpado superior pesado. Brillo húmedo cálido, nunca ojos azules ni cristalinos. Reflejo en la córnea: uno cálido grande y uno azul pequeño (el reflejo va en el ojo, nunca en el vidrio del lente).
- Cejas: gruesas, blancas con hebras plateadas, rebeldes, la izquierda de Santa un poco más alta que la derecha (le da expresión de curiosidad).
- Arrugas: patas de gallo profundas, dos líneas de expresión horizontales en la frente, surcos nasolabiales marcados. Todas visibles incluso en reposo.
- Rasgo identificador fijo: un lunar pequeño, marrón claro, de unos 4 mm, en el pómulo izquierdo de Santa (lado derecho de la imagen cuando mira de frente a cámara), a la altura del borde inferior del lente. Aparece en toda toma donde se vea la cara.

### 1.3 Barba y bigote
- Color exacto: blanco cálido, base #E4DFD3, sombras #B9B2A3. Hebras blancas más puras (#F4F1EA) en las puntas. Sin amarillo nicotina, sin azul frío.
- Largo: barba larga y blanca; llega al centro del pecho (unos 25 cm bajo la barbilla). No tapa el cinturón ni los botones de abajo.
- Textura: gruesa, ondulada, con mechones que se separan en dos o tres puntas; no es peluche liso ni pelo de muñeco. Se ven hebras sueltas a contraluz.
- Caída: se abre en una "V" suave; el mechón izquierdo de Santa (derecho en cámara) cae más largo y se curva hacia dentro.
- **Bigote (corrige la versión anterior, decisión c de la biblia):** espeso y blanco, **recortado justo sobre el labio superior**, de modo que **los dos labios se ven siempre**, en todos los planos. Las dos puntas caen con suavidad pasando las comisuras de la boca, sin rizar ni encerar. Debajo del labio inferior la barba se parte para dejar ver el borde del labio.
- Boca: se ven el labio superior, el inferior y los dientes superiores al hablar; es lo que debe leer la sincronización de labios. Ningún pelo cruza los labios.

### 1.4 Cabello
- Blanco, igual tono que la barba, largo hasta cubrir parcialmente las orejas y rozar el cuello del traje.
- Entradas altas, frente despejada, cabello peinado hacia atrás con un mechón rebelde sobre la frente a la derecha de Santa.
- Cabeza descubierta en todos los planos del piloto. Nada cuelga en la pared del estudio: no hay prenda de cabeza en el decorado ni visible en ningún plano.

### 1.5 Lentes
- Sí, siempre dentro del estudio (decisión c). Armazón fino de alambre dorado envejecido (#C9A24B con patina oscura en las uniones), **redondos**, puente fino, patillas finas. Lente transparente **sin reflejo en el vidrio**: el fuego se refleja en la córnea, no sobre el cristal; sin cristal oscuro, sin brillo que tape los ojos.
- Posición: **bajos en la nariz**, en el mismo punto de apoyo en todas las fijas (medido desde M1, ±3 % del alto de la cara). Cuando mira a cámara, los ojos se ven a través del lente sin distorsión; cuando mira el libro, el armazón no cruza el iris.
- **Corte de seguridad (decisión c):** si 3 de las 6 primeras tomas de V1-04 deforman los lentes o reflejan sobre los ojos, se quitan en **todo** el piloto (quedan sobre el escritorio, doblados junto al libro). Las fijas `-SL` de `produccion/piloto-flow.md` están listas para eso. Nunca se mezclan planos con y sin lentes.

### 1.6 Manos
- Grandes, cuadradas, de trabajador; dedos gruesos, nudillos marcados, venas visibles en el dorso, piel curtida con manchas de edad. Uñas cortas y limpias.
- Marca fija: dedos índice y pulgar de la mano derecha con una mancha tenue de tinta sepia (de escribir en el libro).
- Un anillo liso de latón gastado en el anular derecho. Nada más de joyería.
- Manos desnudas, siempre. Sin guantes en el estudio.
- Cuando sostiene la pluma o recorre una línea del libro, el dedo se apoya sin tapar la zona reservada del nombre (ver sección 4).

### 1.7 Traje (vestuario base: el Santa clásico, en lana y cuero)
- Abrigo largo hasta la rodilla, lana gruesa tejida tipo fieltro tupido ("boiled wool"), con peso visible: los pliegues caen rígidos y no brillan. Siempre mate, nunca satinada.
- Color principal: **rojo navideño clásico y profundo, #9C1F27**. Sombras de pliegue #5C1017, luces suaves #B8343A. Nunca rojo saturado y brillante (#E4002B y similares quedan prohibidos); no más claro ni más anaranjado que la luz #B8343A.
- Cuello: cuello alto bajo, doblado, sin solapas anchas.
- **Ribete blanco de piel natural** (borrego), color #EFE7D6 (blanco cálido, nunca blanco puro), en puños (7 cm de ancho), borde frontal (8 cm) y bajo del abrigo (10 cm). Textura de borrego con rizo irregular y bordes algo desiguales; no es peluche de algodón perfecto ni bolas de algodón de cotillón.
- Botones: cinco botones de madera de nogal torneada, #4A3326, 3 cm de diámetro, con dos orificios cosidos con hilo de lino crudo. No dorados ni brillantes.
- **Cinturón café:** cuero curtido vegetal marrón, #4A2E1B, ancho de 5 cm, con costura visible en los bordes y desgaste en las zonas de uso. Hebilla pequeña, rectangular de esquinas redondeadas (4 x 3 cm), latón con patina (#B08D3C), sin grabados ni letras. La punta del cinturón pasa por una trabilla de cuero. Nunca negro, nunca hebilla grande y brillante.
- Debajo: camisa de lino crudo, visible apenas en el cuello y los puños. Pantalón de lana roja del mismo tono que el abrigo y botas de cuero marrón oscuro (las botas solo se ven en planos generales fuera del piloto).
- Detalle de oficio: un parche cosido a mano en el codo izquierdo, lana crema. Visible en tomas de perfil o de espalda.

### 1.8 Prenda de cabeza
Ninguna en el piloto. No se diseña ni se muestra, ni puesta ni colgada, y el decorado no tiene gancho para ella (biblia, decisión de conflictos 8.1). Si algún día hay planos exteriores, se diseña entonces.

### 1.9 Qué nunca cambia
Estos 12 puntos se verifican en cada toma y en cada imagen fija (misma numeración que la biblia, sección 3):

1. Rojo navideño profundo del abrigo (#9C1F27), nunca más claro ni más saturado.
2. Ribete de borrego natural blanco cálido (#EFE7D6), nunca blanco puro ni de algodón.
3. Barba larga y blanca que llega al centro del pecho, ondulada.
4. Bigote recortado justo sobre el labio superior: los dos labios se ven siempre.
5. Lentes redondos finos de alambre dorado, sin reflejo en el vidrio, bajos en la nariz (con el corte de seguridad de 1.5).
6. Lunar en el pómulo izquierdo de Santa.
7. Nariz ancha con puente desviado a la derecha de Santa.
8. Ojos avellana oscuro; ceja izquierda ligeramente más alta que la derecha.
9. Mancha de tinta en índice y pulgar derechos y anillo de latón en el anular derecho; sin guantes.
10. Cinco botones de nogal, cinturón café de cuero con hebilla pequeña de latón sin grabados.
11. Cabeza descubierta: ninguna prenda de cabeza en el estudio.
12. Expresión: cálida y tranquila, sonrisa con dientes superiores; nunca risa a carcajadas, nunca ceño fruncido.

**Descripción maestra (EN), copiar en todas las instrucciones:**

```
Santa Lumen: a tall, broad-shouldered man of about 70 with a firm round belly, weathered fair skin with natural ruddy cheeks, deep forehead lines and crow's feet. Wide square face, broad nose with a slightly crooked bridge to the right, dark hazel-brown eyes, thick white eyebrows with the left one slightly higher, a small light-brown mole on the left cheekbone. Long, full, warm white beard (#E4DFD3), thick and wavy, reaching the middle of the chest, splitting into two or three tufts, with a full white moustache neatly trimmed just above the upper lip so both lips stay clearly visible, its ends drooping softly past the corners of the mouth. White hair swept back, covering the tops of the ears, one loose lock over the right of the forehead; he is bareheaded. Thin round gold wire-rimmed glasses with aged patina and clear non-reflective lenses, resting low on the nose. Large square bare working hands with a faint sepia ink stain on right thumb and index finger and a plain worn brass ring on the right ring finger. Classic Santa suit: a knee-length coat of thick felted wool in a deep classic Christmas red (#9C1F27, never a bright saturated red), natural white sheepskin trim with an irregular curl (#EFE7D6, not fluffy cotton) on cuffs, front edge and hem, five turned dark walnut wood buttons, a wide dark brown leather belt (#4A2E1B) with visible stitching and a small plain aged brass buckle, matching red wool trousers, a linen shirt collar and cuffs just visible. Calm, warm, kind expression. Photoreal, filmic skin texture, no plastic, no CGI look.
```

Cambios frente a `arte-v1`: bigote recortado sobre el labio; lentes redondos dorados sin reflejo y bajos; barba "larga y blanca"; traje clásico rojo #9C1F27 con ribete de borrego #EFE7D6; cinturón café con hebilla pequeña; cabeza descubierta (sin la frase de prenda de cabeza); sin chaleco verde.

### 1.10 Por qué es original
El traje es el clásico, pero de fieltro de lana en un rojo profundo (no el rojo vivo de anuncio de bebida); el ribete es borrego natural con rizo irregular, no piel blanca esponjosa; el cinturón es café, de cuero cosido, con hebilla pequeña de latón y no negro con hebilla grande y dorada; hay lentes redondos de alambre, lunar, nariz desviada y manchas de tinta; complexión de leñador, no de figura rechoncha de caricatura. No se usa prenda de cabeza con pompón ni luz roja tipo publicidad de bebida. **Al ser un traje reconocible, `legal-compliance` revisa el rojo, el ribete y la silueta del candidato elegido antes de generar M1** (escala de arte: parecidos con propiedad intelectual ajena). Si alguien del equipo siente que "se parece a" una figura concreta, se escala a `legal-compliance`.

---

## 2. El estudio de Santa (escenario principal del piloto)

Sala de madera de pino oscurecido por siglos de humo, de unos 6 m (este-oeste) x 5 m (norte-sur), techo de vigas a 3 m. Es un cuarto de trabajo, no un salón de museo: hay papeles, tazas, plumas, notas. Todo luce usado y ordenado a la vez. De noche, con velas, fuego de chimenea de piedra y nieve azul gris tras una ventana antigua.

### 2.1 Plano de planta (manda la distribución de la biblia, sección 3, porque la luz de fotografía la exige)

Vista desde arriba. Oeste = camera-left. La cámara principal (CAM A) está al sur, a 1,05 m de altura, mirando al norte. Santa se sienta detrás del escritorio mirando al sur, es decir, a la cámara.

```
                  NORTE (pared de la ventana)
 +-----------------------------------------------------------------+
 |      [estantería baja]            [VENTANA con nieve, 6 cuadros]|
 |       x 1,2 a 2,2 m                x 4,2 a 5,4 m                |
 |                                                                 |
 | O    [CHIMENEA              ]      SANTA (sentado, mira al sur) | E
 | E    de piedra, pared oeste,       [ESCRITORIO de roble,        | S
 | S    camera-left                    de frente a cámara]         | T
 | T                                  libro · vela · lámpara ·     | E
 |      [sillón de cuero]             tintero · taza · tamal       |
 |         [alfombra]                                              |
 +-----------------------------------------------------------------+
        SUR: puerta (detrás de cámara; no se ve)   CAM A frontal
```

Coordenadas: x desde la pared oeste, y desde la pared norte; la sala mide 6,0 x 5,0 m.

| Elemento | Posición | Medida aprox. |
|---|---|---|
| Chimenea de piedra | Pared oeste, centrada en y = 2,5 m; a camera-left en todo plano frontal | 1,8 m ancho, 1,4 m alto, saliente de 0,5 m, fuego bajo y estable |
| Repisa | Sobre la chimenea | 20 cm de fondo, madera maciza oscura |
| Sillón de cuero | Al sur de la chimenea, x = 1,2 m, y = 3,8 m, girado 30° hacia el fuego | 80 cm ancho, cuero marrón #5A3A22, manta de lana gris |
| Alfombra | Frente a la chimenea, centro x = 1,8 m, y = 2,5 m | 2,0 x 1,5 m, lana tejida a mano, motivos geométricos sin letras |
| Escritorio | Centro x = 3,6 m, y = 2,0 m; lado largo hacia la cámara | 1,6 x 0,8 m, roble, tapa con rayones y marcas de tinta |
| Silla de Santa | Al norte del escritorio, y = 1,3 m, mirando al sur | madera con asiento de cuero, cojín de lana verde |
| Ventana con nieve | Pared norte, centro x = 4,8 m: queda **detrás de Santa, a camera-right** | 1,2 x 1,5 m, base a 0,9 m del piso, marco de madera con 6 cuadros y cristal antiguo con ligera ondulación |
| Estantería baja | Pared norte, x = 1,2 a 2,2 m (a camera-left de la ventana) | 1,0 m ancho, 2,0 m alto, lomos lisos y siempre desenfocados |
| Puerta | Pared sur, x = 4,8 m, detrás de cámara | Nunca se ve; en esa pared no hay gancho ni nada colgado |

Regla de continuidad: los muebles no se mueven entre planos y la chimenea nunca cambia de lado. Un plano sobre el hombro de Santa (mirando al sur desde detrás de su hombro izquierdo) ve la pared sur oscura y desenfocada; la chimenea aparece a camera-right porque sigue en el mismo lugar físico, y ahí se usa solo su resplandor. Los planos frontales (CAM A) ven la chimenea desenfocada a camera-left, la ventana azul detrás a camera-right y el escritorio en primer plano.

### 2.2 Materiales
- Madera de pino y roble envejecida (vigas, repisa, estantería, escritorio).
- Piedra de río rústica en la chimenea, con hollín en las juntas.
- Cuero marrón gastado (sillón, cinturón, silla del escritorio).
- Lana tejida a mano (alfombra, manta, abrigo).
- Latón con patina (candelero, lámpara, hebilla, lentes, tapas del libro).
- Papel envejecido, lacre, hilo de lino.
- Vidrio antiguo de la ventana con burbujas finas.

### 2.3 Objetos de escritorio y de repisa (siempre en el mismo lugar)
Desde la cámara (camera-left / camera-right):
- Escritorio, centro: el Gran Libro (sección 3), cerrado o abierto según el plano.
- Camera-right del libro: candelero de latón con **una** vela de cera de abeja encendida; detrás, una lámpara de aceite de latón con llama baja.
- Camera-left del libro, adelante: tintero de vidrio verde oscuro con una pluma. Detrás, una pila baja de notas dobladas atadas con hilo de lino, sin escritura visible.
- Esquina delantera camera-left: taza de barro vidriado terracota y verde (2.5).
- Esquina delantera camera-right: tamal en plato de peltre (2.5).
- Repisa: dos velas de cera de abeja encendidas, un reloj de arena de madera y vidrio, un pequeño trineo tallado de 12 cm (recuerdo, sin letras).
- Estantería baja: libros de lomos lisos, un globo terráqueo de madera sin nombres legibles, frascos de vidrio con cuerda y sal. Siempre desenfocada.
- Número de velas encendidas en el estudio: tres (una en el escritorio y dos en la repisa) más la lámpara de aceite. No cambia entre planos.
- Sin reloj de bolsillo, lupa ni cuenco: se quitaron para reducir lo que puede cambiar entre planos.

### 2.4 Paleta de color
Dominan los marrones y rojos terrosos con un acento frío de nieve en la ventana. El rojo vivo solo está en el abrigo de Santa y en detalles mínimos (la cinta del libro, el listón de una vela).

| Rol | Color | Hex |
|---|---|---|
| Madera oscura | marrón humo | #3A2618 |
| Madera media | roble miel | #8A5E3B |
| Piedra | gris cálido | #6F675E |
| Cuero | marrón tabaco | #5A3A22 |
| Lana verde (cojín, libro) | verde bosque | #2F4A3A |
| Latón | oro viejo | #B08D3C |
| Papel | crema antigua | #EFE4CC |
| Fuego | naranja ámbar | #E8872F |
| Nieve en ventana | azul gris frío | #9BB0C2 |
| Rojo de Santa | rojo navideño profundo | #9C1F27 |
| Ribete de Santa | borrego blanco cálido | #EFE7D6 |
| Cinturón de Santa | cuero café | #4A2E1B |

Contraste: interior cálido de luz de fuego y vela contra azul gris suave en la ventana. Sin neones, sin luces de colores intensos.

### 2.5 Dos detalles de Centroamérica (discretos)
Ninguno es protagonista ni se explica en pantalla; el niño centroamericano los reconoce, el resto del mundo los lee como "cosas de la casa de Santa". El tercer guiño es la palabra "tamales" en la primera frase del guion.

1. **Taza de barro con vapor.** Taza de barro vidriado de color terracota y verde, en la esquina delantera camera-left del escritorio, con vapor suave y un palo de canela asomando. No lleva etiqueta ni texto, y en ningún texto o voz se nombra la bebida (comprador, sección de bebidas).
2. **Tamal envuelto.** Un tamal en hoja de plátano atado con pita, sobre un plato de peltre blanco con borde azul (sin letras) en la esquina delantera camera-right del escritorio. Verde oscuro con pliegues reales de hoja.

Reglas: ninguna bandera, ninguna prenda folclórica, ningún estereotipo. Los dos objetos aparecen siempre en el mismo lugar.

### 2.6 Lista negativa del estudio (para revisar cada fija y cada toma)
Nunca aparece en el piloto, aunque el modelo lo "invente" en las alas del 16:9 o en el fondo: árbol de Navidad, guirnaldas, luces de colores, auroras, figuras de nacimiento o pesebre en la repisa, ninguna prenda de cabeza colgada o puesta ni gancho, cuadros con letras, relojes con números legibles, cajas con etiquetas legibles, lomos con letras, banderas, cables, focos, pantallas.

---

## 3. Utilería estrella

### 3.1 El Gran Libro: datos físicos
- Cerrado: 38 cm de ancho x 52 cm de alto x 9 cm de grosor. Pesado, tapas rígidas.
- Cubierta: cuero verde bosque muy oscuro (#25382E), granulado, con rozaduras en los bordes y marcas de uso en el lomo. Esquineros y cierre de latón con patina. Sin título ni texto.
- **Emblema (corrige la versión anterior, P4):** en el centro de la tapa, en **relieve ciego** (sin color ni dorado): una estrella de ocho puntas dentro de un doble anillo liso, sin letras, sin marcas de rosa de los vientos y sin las letras N, S, E, O ni ninguna otra. Un solo emblema, simétrico, sin marca registrada. Las esquinas de latón pueden brillar con la vela; el emblema no es de latón.
- Cinta marcapáginas: seda roja desteñida (#7A2A2E), de 1,5 cm de ancho, asomando por abajo.
- Canto del libro: dorado gastado, con zonas donde se ha ido el oro.
- Lomo: cinco nervaduras de cuero cosido a mano.

### 3.2 Papel
- Papel de trapo de algodón color crema antigua (#EFE4CC), grueso, con fibras visibles, bordes irregulares y ligeramente oscurecidos (#D9C9A6). Sin manchas que parezcan texto.
- Cada página tiene líneas guía muy tenues de lápiz de plomo, espaciadas 1,2 cm, y un margen de 2,5 cm.
- Sin letras legibles en ninguna página que se vea en pantalla. Las páginas ya "escritas" muestran solo trazos horizontales pálidos y borrosos, como lejanos trazos de lápiz, sin caracteres; nunca texto falso deformado.

### 3.3 Tipografía de los nombres (para la composición, no para generar)
- Los nombres no los genera la IA: los compone `video-edicion-post` con FFmpeg sobre la página en blanco.
- Estilo: caligrafía a pluma, inclinada, de trazo grueso-fino, parecida a una letra de maestro de escuela antigua.
- Fuente (biblia, decisión i): **Pinyon Script** (principal) y **Great Vibes** (respaldo), con licencia SIL Open Font License `[verificar el OFL.txt del paquete descargado]`. Prueba de glifos (Ñ ñ Á É Í Ó Ú á é í ó ú Ü ü) y de legibilidad de las mayúsculas en teléfono antes de fijarla. La fuente vive en el repositorio.
- Color del nombre: dorado cálido con brillo, #C9A24A en el trazo, #F3D88A en el brillo, borde interior más oscuro #8F6E26 para sentirse como tinta metálica sobre papel y no como etiqueta pegada.
- Altura de las minúsculas: aprox. 0,9 cm sobre la página real (ver proporciones en 4.2). Nombre más largo de prueba: "María Fernanda", 13 letras y 14 caracteres con el espacio; la caja admite hasta 16 caracteres (biblia, sección 7).
- Animación sugerida: el nombre se "escribe" con una máscara que avanza de izquierda a derecha en 1,5 s, con un destello cálido al final.

### 3.4 Cómo se abre y en qué página aparece el nombre
- El libro descansa sobre el escritorio, abierto en el centro de la lista. La página izquierda ya está escrita por "otros niños" (solo trazos pálidos sin caracteres); la **página derecha** es donde aparece el nombre del niño.
- Santa pasa páginas con la mano izquierda y se detiene; la cinta roja marca el lugar.
- El nombre va en la **página derecha, en la línea 11 contando desde arriba**, a unos 41 % de la altura de la página. Debajo de esa línea la página queda en blanco: el logro del niño no va en el libro, va en la carta (3.5).
- Antes de que el nombre aparezca, la línea está vacía, con una pequeña marca dorada en forma de punto en el margen izquierdo (decorativa, no es letra).
- Santa recorre con el dedo índice derecho (el de la mancha de tinta) el margen izquierdo de la página. Cuando se detiene, el dedo queda por debajo de la línea 11, a la izquierda, sin cubrir el rectángulo reservado.

### 3.5 La carta de la familia
- Una hoja de papel crema (#EFE4CC) doblada en dos, que Santa deja sobre el escritorio y que se abre plana por su propio peso. Mide 22 x 30 cm (proporción 0,73, igual a la página del libro). Renglones tenues vacíos, línea de doblez al centro, y en la esquina superior una estrella dibujada con crayón amarillo por un niño (trazo tembloroso, sin simetría perfecta: tiene que verse dibujo y no logotipo).
- La IA genera la carta **sin una sola letra**. Todo el texto se compone después.
- **Texto de la carta (manda la biblia, sección 8.1, fila "Logro escrito"):** el logro del niño **tal como lo convierte el modelo** a partir del campo 3 del formulario (≤ 50 caracteres ya convertido), compuesto en tinta azul oscura (#2A3A5A) con una fuente manuscrita OFL distinta de la del nombre (candidata: Caveat), una o dos líneas, empezando a 0:29,2 con una revelación suave de 1 s. Si el campo 3 es "No sé, que Santa elija", el texto lo define el guion (frase alternativa); la zona queda reservada igual.
- Pendiente fuera de arte: el storyboard (V1-05) aún dice "lo que escribió el adulto, ya limpio, ≤ 70 caracteres"; el director debe alinearlo con la biblia (calidad, P5).

---

## 4. Zonas reservadas en el encuadre (para `video-edicion-post`)

### 4.1 Reglas del plano del libro
- Cámara casi cenital sobre la página derecha: elevación 80° a 90° sobre el escritorio, inclinación lateral máxima 5°. Poca distorsión de perspectiva; página casi plana, sin curvatura fuerte hacia el lomo (se sujeta con un peso de latón fuera de la zona).
- Luz pareja sobre la página: sin sombras duras de la mano, de la vela ni de Santa sobre el rectángulo reservado. Contraste de luz en la zona menor a 1 stop entre un lado y otro. La luz cálida de vela o chimenea llega lateral y suave; el fotógrafo asegura el relleno (ver `fotografia.md`).
- Cámara fija durante el momento del nombre: sin movimiento de cámara. La superficie debe tener textura suficiente para el seguimiento plano (fibras y bordes visibles).
- La mano de Santa no pasa sobre la zona del nombre durante los 2 s antes y 3 s después de que aparezca.

### 4.2 Proporciones de la zona del nombre (independiente de la resolución)
Medidas respecto a la página derecha (ancho = 100 %, alto = 100 %), que es de proporción 38:52 (0,73):

| Parámetro | Valor |
|---|---|
| Ancho de la caja del nombre | 72 % del ancho de la página, centrada horizontalmente (margen 14 % a cada lado) |
| Alto de la caja | 9 % del alto de la página |
| Posición vertical | borde superior de la caja al 37 % del alto, centro al 41,5 % |
| Alineación del texto | centrado en la caja, línea base sobre la línea guía número 11 |
| Orientación | texto horizontal respecto a la página; la página está derecha respecto a la cámara (arriba de la página = arriba del encuadre) |
| Margen de seguridad | 3 % extra alrededor de la caja libre de mano, dedo, pluma y sombras |

Ejemplo en 9:16 (1080 x 1920): si la página derecha ocupa el 84 % del ancho, mide unos 907 px de ancho por 1.242 px de alto. Entonces la caja del nombre queda de unos 653 x 112 px, con su borde superior a unos 460 px del borde superior de la página. Usar solo como ejemplo; el cálculo final lo hace post sobre la toma aprobada.

En 16:9 (1920 x 1080): la página derecha ocupa aproximadamente x 970 a 1600 y y 110 a 960. La misma proporción aplica.

### 4.3 Zona del texto de la carta (V1-05)
Medidas respecto a la hoja abierta (ancho = 100 %, alto = 100 %), proporción 22:30:

| Parámetro | Valor |
|---|---|
| Tamaño de la hoja en el cuadro | 70 % del ancho del cuadro, centrada y derecha (arriba de la hoja = arriba del encuadre) |
| Caja del texto | 76 % del ancho de la hoja (margen 12 % a cada lado), 22 % del alto, borde superior al 36 % del alto |
| Renglones | 2, sobre las líneas guía tenues; ≤ 50 caracteres ya convertido en total, uno o dos renglones |
| Zona prohibida | La estrella de crayón queda arriba a la derecha (esquina superior, fuera de la caja); el doblez cruza al 50 % del alto: el texto no pisa el doblez (por eso la caja termina al 58 %) |
| Margen de seguridad | 3 % alrededor de la caja libre de mano, sombra y borde de página |

Ejemplo en 9:16 (1080 x 1920): hoja de 756 px de ancho por 1.036 px de alto; caja del texto de unos 575 x 228 px, con su borde superior a unos 373 px del borde superior de la hoja. Solo como ejemplo; post calcula sobre la toma aprobada. La carta debe estar quieta y plana al menos de 2 a 8 s.

### 4.4 Otras zonas reservadas (compuestas por post, no generadas)
- Marca discreta jinglo.app del video gratis: esquina inferior derecha, fuera del libro, dentro del 5 % de margen seguro.
- Título final "¡Feliz Navidad, {nombre}!" sobre el fondo desenfocado de V1-09: nada importante en el 15 % inferior.
- Mapa con el pin de la ciudad y etiqueta del regalo: fuera del piloto. Si algún guion los pide, se reservan después con el mismo método.

---

## 5. Imágenes fijas de referencia a generar primero

Orden de generación. Cada imagen se aprueba por `video-direccion-arte` y `video-fotografia-iluminacion` antes de generar video; la primera (Santa frente, M1) es la imagen maestra: todas las siguientes se generan con ella como referencia. Formato de las fijas: 9:16, 2160 px de alto o más, salvo indicación.

Criterio de aprobación (todas): los 12 puntos de 1.9, sin texto ni letras legibles, sin brillo plástico, luz de fuego plausible, manos con cinco dedos, ninguno de los elementos de la lista negativa 2.6.

Todos los bloques usan, al principio, la Descripción maestra de 1.9 (indicada como `[MASTER]`). La instrucción literal que se pega en el generador está en `produccion/piloto-flow.md`; si este documento y aquel difieren, se corrige aquel contra este.

### 5.1 Santa frente (imagen maestra, M1)
```
[MASTER] Front view, eye-level portrait, chest up, looking straight into the camera with a soft warm closed-mouth smile and relaxed eyebrows, both lips clearly visible under the trimmed moustache. Seated in a dark wooden study, warm firelight from the left, soft blue window light from behind him on the right, shallow depth of field, background in soft focus (river-stone fireplace, candle flames, window with falling snow). 85mm lens, cinematic film still, natural skin pores, visible wool and leather textures. No text, no logos, no letters anywhere.
Negative: plastic skin, CGI, cartoon, bright saturated red coat, fluffy cotton-ball fur, black belt, large gold buckle, pom-pom cap, sunglasses, reflections on the glasses, blue eyes, moustache covering the lips, text, logo, extra fingers.
```

### 5.2 Santa tres cuartos
```
[MASTER] Three-quarter view from Santa's left side (camera sees his left cheek with the small mole), shoulders turned 35 degrees, eyes looking slightly down at an open book out of frame, gentle closed-mouth smile. Same room, same lighting as the front portrait. Medium close-up, 85mm, cinematic film still. Beard falls in a soft V, the round gold glasses sit low on the nose. No text anywhere.
Negative: plastic skin, CGI, cartoon, text, logo, bright saturated red coat, fluffy cotton-ball fur, reflections on the glasses.
```

### 5.3 Santa perfil
```
[MASTER] Pure side profile facing right, chest up, slightly lowered gaze. Show the crooked nose bridge, the trimmed moustache above the upper lip, the beard line to mid-chest, warm fire rim light on the beard edges, deep brown softly out-of-focus background. 85mm film still, natural texture. No text anywhere.
Negative: plastic skin, CGI, cartoon, text, logo, bright saturated red coat, fluffy cotton-ball fur.
```

### 5.4 Manos
```
Close-up of two large weathered male hands of a 70-year-old man resting on an aged oak desk: faint sepia ink stain on the right thumb and index finger, a plain worn brass ring on the right ring finger, short clean nails, visible veins and age spots, cuffs of a thick wool coat in deep classic Christmas red (#9C1F27) with natural white sheepskin trim (#EFE7D6), a fine linen shirt cuff visible. The right index finger rests lightly on the edge of an old paper page. Soft warm candle and fire light, shallow depth of field, 100mm macro, cinematic film still. Exactly five fingers on each hand, natural proportions, bare hands. No text anywhere.
Negative: gloves, extra fingers, plastic skin, CGI, cartoon, text, logo, rings other than the brass ring.
```

### 5.5 Estudio, plano general (16:9 y 9:16)
```
Wide establishing shot of a hand-built Santa's study at night. Smoked pine beams overhead. On the left wall (camera-left), a river-stone fireplace with a low steady fire and a solid wood mantel holding two lit beeswax candles, a wooden hourglass and a small carved wooden sleigh; near it a worn brown leather armchair with a grey wool blanket angled toward the fire, and a hand-woven geometric wool rug. On the back wall at the right (camera-right), behind Santa, a large old six-pane window with soft snow falling outside in blue-grey dusk light, and to the left of it a low bookshelf with books with blank spines and a wooden globe with no readable names. In the lower center, an oak desk facing the camera with Santa Lumen seated behind it facing the camera, small in the frame; on the desk, in the center, the very large antique book (dark forest-green leather, aged brass corners), to its right a brass candlestick with one lit beeswax candle and a brass oil lamp, to its left a green glass inkwell with a quill and a stack of folded notes tied with linen thread, on the front left corner a terracotta and green glazed clay mug with gentle steam and a cinnamon stick, on the front right corner a banana-leaf-wrapped tamal tied with string on a white enamel plate with a blue rim. Color palette: smoke brown, honey oak, warm stone grey, tobacco leather, forest green, aged brass, cream paper, ember orange, cold blue-grey snow, and the deep red of Santa's coat as the only strong red. Warm firelight and candlelight, soft blue window light, cinematic film still, 35mm, deep focus, natural textures. No text, no logos, no letters anywhere, no electric lights, no garlands, no Christmas tree, nothing hanging on the walls.
Negative: plastic, toy, video game look, CGI, bright saturated red, neon lights, cartoon, readable text, logo, brand name, flags, sombreros, nativity figures, hats.
```
Formato 9:16: la chimenea se ve sobre todo como resplandor en el borde izquierdo y la ventana como luz azul en el borde derecho. Formato 16:9: la chimenea entera en el tercio izquierdo, la ventana entera en el tercio derecho, Santa y el escritorio en el tercio central.

### 5.6 Libro abierto, primer plano (plano de la zona del nombre)
```
Top-down view, camera at 85 degrees directly above the right-hand page of a very large antique book lying open on an aged oak desk. The right page is cream cotton-rag paper (#EFE4CC) with visible fibers, uneven slightly darker edges (#D9C9A6), very faint pencil guide lines spaced evenly, a 2.5 cm margin, and a small gold dot in the left margin at about 41 percent of the page height. The page is almost flat, lit with soft even warm light with no hard shadows. The left page next to it shows only faint pale horizontal lines like distant pencil strokes, no characters. A faded red silk ribbon (#7A2A2E) lies in the gutter. Dark forest-green leather cover (#25382E) with aged brass corners visible at the page edges. Right page fills 84 percent of the frame width, perfectly upright (top of the page is top of the frame). Candlestick and inkwell softly out of focus at the top edge. Shallow depth of field only on the periphery, the page itself sharp. Photoreal film still, 50mm. The area at 37 to 46 percent of the page height, 14 to 86 percent of the page width, is completely empty, blank paper.
Negative: any text, letters, writing, handwriting, numbers, hands, fingers, shadows on the page, curved or tilted page, plastic, CGI, cartoon.
```

Variante 5.6b (con mano, para el plano donde Santa recorre el margen): igual que 5.6 pero con la mano derecha de Santa (ver 5.4) entrando por el borde izquierdo y apoyando el índice en el margen izquierdo, por debajo de la línea 11 al final del recorrido; la caja del nombre sigue vacía y sin sombra. (Calidad sugiere que el antebrazo entre por el borde inferior; se decide con `produccion/piloto-flow.md`, instrucción F03.)

### 5.7 Lista de entrega
| # | Imagen | Para qué plano sirve |
|---|---|---|
| 1 | M1 · Santa frente (maestra) | plano a cámara, sincronización de labios |
| 2 | M2 · Santa tres cuartos | Santa lee y habla a cámara |
| 3 | M3 · Santa perfil | referencia de nariz, bigote y barba |
| 4 | M4 · Manos | inserts, recorrer el libro |
| 5 | M5 · Estudio general 16:9 | plano de apertura y TV |
| 5b | M5b · Estudio general 9:16 | plano de apertura vertical |
| 6 | M6 · Libro abierto cenital (placa limpia) | nombre dorado (FFmpeg) |
| 6b | M6b · Libro con mano | recorrido del dedo |
| 9 | M9 · Sobre el hombro | V1-02 |
| 10 | M10 · Carta abierta sobre el escritorio (3.5) | V1-05 y zona del texto (4.3) |
| 11 | M11 · Santa asomado sobre el libro cerrado | V1-06 y G3 |
| 12 | M12 · Manos sobre el libro cerrado, 40° | V1-09 |

Las instrucciones literales de M9 a M12 están en `produccion/piloto-flow.md` (sección 4.2) y las aprueba arte con el mismo criterio de esta sección. Costo: imágenes fijas, no clips de video.

---

## 6. Prohibiciones de arte

1. **Texto**: ningún texto legible o pseudo-legible en pantalla. Ni en lomos, ni cartas (la carta se genera sin letras y se escribe después), ni mapas, ni etiquetas, ni relojes con números, ni carteles, ni letras N, S, E, O en el emblema. Si la IA genera letras deformes, la toma se descarta. Todo texto visible lo compone post.
2. **Plástico y brillo artificial**: sin materiales con aspecto de plástico, vinilo, goma o peluche sintético; sin piel de muñeco; sin barba lisa.
3. **Look videojuego o render 3D**: sin bordes perfectos, sin iluminación de volumen exagerada, sin partículas decorativas, sin lens flare dramático.
4. **Marcas y personajes ajenos**: ningún logotipo, ni tipografía de marca, ni rojo de gaseosa, ni duendes, renos, trineos, gorros o escenas reconocibles de otras franquicias (Rudolph, Grinch, Elf on the Shelf, Polar Express, Portable North Pole).
5. **Santa de otros**: no usar rojo saturado y brillante, ribete de algodón o piel blanca esponjosa, barba lisa al pecho, cinturón negro con hebilla grande y dorada, ni ojos azules chispeantes. El nuestro: rojo profundo de lana #9C1F27, borrego natural de rizo irregular, cinturón café con hebilla pequeña, lentes redondos de alambre, ojos avellana.
6. **Susto**: nada de sombras profundas sobre el rostro, oscuridad total, primeros planos invasivos a menos de 40 cm, ni objetos que se muevan solos.
7. **Textiles y banderas**: ninguna bandera ni emblema nacional; los detalles centroamericanos son objetos de casa, no decoración temática.
8. **Electricidad moderna**: sin focos, cables ni pantallas.
9. **Nombres de proveedores o modelos de IA** nunca visibles ni en metadatos de la imagen entregada al cliente (D23).
10. **Fotos de niños reales**: ni en referencias ni en pruebas.
11. **Lista negativa del estudio (2.6)**: árbol, guirnaldas, auroras, nacimiento, prenda de cabeza, cuadros o etiquetas con letras.

---

## 7. Dudas abiertas
1. **Santa maestro:** Juan confirma entre los candidatos "2" y "4". Mientras tanto, M1 sale del "4" y 1.9 es provisional.
2. **Revisión legal del traje clásico** (rojo #9C1F27, ribete de borrego, silueta): `legal-compliance`, antes de generar M1 (1.10).
3. Fuente del nombre: prueba de glifos y confirmación de licencia con `video-edicion-post` y `legal-compliance` (3.3).
4. Confirmar con `video-fotografia-iluminacion` el relleno de luz pareja sobre la página (4.1) y la posición definitiva de la marca jinglo.app.
5. Texto de la carta: el storyboard V1-05 debe alinearse con la biblia (3.5).
6. Quién aprueba las imágenes maestras de Santa: ya resuelto en la biblia 8.1 (fotografía y arte aprueban cada fija; el director elige la maestra; control de calidad tiene veto; Juan ve el corte final).
7. La biblia, sección 3, sigue describiendo el traje anterior (ladrillo #8E1B24, ribete crema, lentes ovalados) y el emblema "en una brújula": `video-director-creativo` debe actualizarla con 1.9 y 3.1 de este documento.
