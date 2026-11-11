# Jinglo · Control de calidad del piloto (riesgos, rúbrica y prueba ciega)

Versión `calidad-v1` · 11-nov-2026 · `video-control-calidad` (veto) · Revisado: `biblia.md` (biblia-v1), `biblia/arte.md`, `biblia/fotografia.md`, `biblia/voz.md`, `biblia/sonido.md`, `storyboard/01-lista-ninos-buenos.md` (storyboard-v1), `guiones/01-lista-ninos-buenos.md` y `guiones/00-video-gratis.md` (ambos todavía `guion-v1`), `legal-proveedores.md`, `comprador.md` (sección 7).
Documento interno: nombra modelos y proveedores (D23 aplica solo a lo que ve el cliente). Complementa a `qa-redteam` (seguridad, abuso, flujo de compra); no lo reemplaza.

---

## 0. Veredicto antes de gastar créditos

**NO APROBADO para generar clips de video.** Las imágenes fijas tampoco se empiezan hasta cumplir P1 y P2, porque M1 es la referencia de todo y un error en M1 se copia en cada plano.

| # | Condición para levantar el veto | Dueño | Cómo lo compruebo |
|---|---|---|---|
| P1 | Correcciones de la ronda 2 (biblia sección 9) aplicadas en `arte.md`, `fotografia.md`, `sonido.md`, `voz.md` y guiones a `guion-v1.1` | cada sección | Búsqueda de términos prohibidos en los bloques EN y textos (lista de la sección 2, T-01): cero resultados fuera de listas negativas |
| P2 | Existe `docs/video/jinglo/produccion/piloto-flow.md` con la instrucción **completa, literal**, de cada fija y cada plano (hoy no existe) | `video-ia-generativa` | Leo las instrucciones reales, no los resúmenes: es lo que va a la máquina |
| P3 | Estrategia de la base de labios decidida con una prueba barata antes de las 6 tomas de V1-04 (T-03) | `video-ia-generativa` + yo | 2 tomas A y 2 tomas B, rúbrica sección 5 |
| P4 | Emblema del libro redefinido sin "compass/brújula" (T-05) | `video-direccion-arte` | Texto de la instrucción |
| P5 | Conflicto del texto de la carta resuelto (T-09) | `video-director-creativo` | Biblia y storyboard dicen lo mismo |
| P6 | Duraciones con margen dentro del límite del clip (sección 4) | `video-director-creativo` | Tabla de la sección 4 |
| P7 | Plan para el retiro de Veo 3.1 del Flow el 5-dic-2026: todas las tomas con cara aprobadas juntas antes del 1-dic (T-07) | `lider-proyecto` | Calendario escrito |

Cuando P1 a P7 estén cumplidos, apruebo por escrito el arranque de M1. Después, cada fija y cada toma pasan por la rúbrica de la sección 5. No apruebo por fecha ni por cansancio: si un plano no pasa en 8 intentos, se rediseña con el director.

---

## 1. Cómo reviso y cómo califico la severidad

**Severidad**
- **Crítica:** delata el video ante un adulto atento o un niño de 8 años, asusta, o pone un dato incorrecto o ajeno. Bloquea el gasto o la entrega.
- **Alta:** se nota a velocidad normal en teléfono para alguien que mira con atención. Se corrige antes de aprobar el plano.
- **Media:** se nota solo cuadro a cuadro o en el contexto del corte. Se corrige si cuesta poco; si no, queda anotado y se mide en la prueba ciega.
- **Baja:** detalle de documento o de proceso sin efecto visible.

**Protocolo de revisión de cada toma (siempre en este orden)**
1. En teléfono, a velocidad real, con sonido, dos veces. Primera impresión: ¿le creería un niño?
2. En teléfono, sin sonido: solo boca, ojos y manos.
3. En monitor, cuadro a cuadro, al 100 % y al 200 % sobre cara, boca, bigote, lentes, manos y la zona del nombre.
4. En contexto: la toma anterior, esta y la siguiente, cortadas como en el montaje final.
5. Registro escrito con segundo exacto de cada falla (plantilla en 5.5).

Una segunda persona (`video-fotografia-iluminacion`) revisa por separado las tomas con cara; si discrepamos, gana la nota más baja. Solo `video-director-creativo` puede pedir una segunda revisión; nunca saltarla.

---

## 2. Riesgos transversales

| Id | Riesgo | Qué delataría | Sev. | Mitigación | Verificación |
|---|---|---|---|---|---|
| T-01 | **Documentos fuente desincronizados con la biblia.** `arte.md` 1.9 dice que su descripción maestra se "copia en todas las instrucciones" y aún dice `full moustache that covers the upper lip` (1.3 en español igual); 1.5 pide "reflejo muy suave de la chimenea" en los lentes; 1.4 deja ver el gorro en el plano general; el bloque 5.5 trae `nativity`, `fruit punch`, `red wool cap ... hanging on a hook`, `Santa ... in profile` y la distribución vieja del estudio; 5.6b pone el dedo bajo la línea 12 (storyboard: 11). `fotografia.md` trae `red velvet` (S1), `deep velvet red`, `garlands` (P3), `hat brim` (S3), `gloved/aged hands` (P4b), "sombrero" en P2, P3, S3 y 10.3, y rojo #A3141C. Los guiones siguen en v1: "ponche", "auroras", nombre de 14 caracteres, T3 con la edad en off, T4 "Soy Santa", guiño de T7 dentro del clip con labios, y el gratis con Santa que levanta la vista y guiña | Bigote sobre el labio (labios imposibles), terciopelo y guirnaldas que no existen en la fija maestra, gorro visible, objetos que cambian entre planos. Basta con que una instrucción se arme desde la sección equivocada | **Crítica** | Ronda 2 completa antes de M1. `piloto-flow.md` arma cada instrucción solo desde la biblia y el storyboard, con la descripción maestra enmendada | Búsqueda en `piloto-flow.md` y en las secciones: `covers the upper lip`, `velvet`, `terciopelo`, `garland`, `guirnalda`, `hat`, `sombrero`, `gorro` (fuera de "no hat"), `glove`, `nativity`, `nacimiento`, `punch`, `ponche`, `aurora`, `profile` en V1-01. Cero resultados fuera de las listas negativas |
| T-02 | **Bigote que tapa el labio superior.** Aunque la instrucción lo pida recortado, los modelos tienden al Santa de bigote caído | Boca borrosa, labios que no coinciden con la voz, "máscara" de la sincronización sobre el bigote | **Crítica** | M1 no se aprueba sin labio superior visible. En las tomas con labios, el bigote no se mueve como bloque ni se "derrite" | En M1 (2160 px): borde rojo del labio superior visible en al menos el 60 % del ancho de la boca. En V1-04 y V1-07: labio superior visible en al menos el 90 % de los cuadros de habla |
| T-03 | **Base de labios en conflicto con la sincronización.** La acción EN de V1-04 pide `speaks ... with natural jaw motion` y la de V1-07 `speaks warmly`: Veo inventa un habla con su propio ritmo de mandíbula y barba. Sync Labs redibuja solo la boca. La barba y la mandíbula siguen el habla inventada y los labios siguen la voz real | Barba que se mueve en sílabas que no existen ("barba que hierve"), mandíbula desfasada de los labios, borde visible entre la zona redibujada y el resto | **Crítica** | Prueba P3 antes de las 6 tomas: **A**, base que habla (Veo dice una frase en español de largo y sílabas parecidas: "¡Hola, Sofía! Ya tienes cinco años."); **B**, base callada con sonrisa tranquila y respiración, para que la sincronización abra la boca. Gana la que pase la rúbrica C3 y C5 con "Ana", "Xiomara" y "María Fernanda" | Cuadro a cuadro sobre barba y bigote durante el habla, con y sin sonido. Diferencia de nitidez y grano boca/mejilla imperceptible al 100 % |
| T-04 | **Boca que se mueve fuera de la ventana de sincronización.** V1-04 sincroniza solo en 1,4–5,1 s del clip; en 0–1,4 s (sube la cabeza) y en 4,8–7,0 s (la calma) queda la boca original de Veo. Si Veo siguió "hablando", Santa mueve la boca sin voz. Lo mismo en V1-07 fuera de 0,2–7,3 s | Boca que habla en silencio durante la calma de 2 s: justo cuando el adulto graba la reacción | **Crítica** | Se elige la toma por la boca **cerrada** en 0–1,4 s y en 5,1–7,0 s. Si no la hay, se sincroniza el clip entero con silencio en los extremos (la herramienta cierra la boca). La sincronización empieza al menos 0,3 s después de que la cabeza queda quieta | Sin sonido: ningún movimiento de labios fuera del habla. La cabeza está quieta (±10°) al empezar la ventana |
| T-05 | **Texto generado.** El emblema es "estrella de ocho puntas en una brújula": las rosas de los vientos traen N, S, E, O casi siempre. Las páginas "con trazos abstractos" (V1-02 y página izquierda) tienden a pseudoletras. También el reloj de bolsillo de arte 2.3, las etiquetas de cajas y los lomos de los libros | Una letra deforme en el libro mágico: el niño que ya lee la busca | **Alta** | Emblema: `an eight-pointed star inside a plain double ring, blind-embossed, no letters, no compass markings`. Fuera del escritorio el reloj de bolsillo; estanterías siempre desenfocadas. En páginas: `faint pale horizontal lines like distant pencil strokes, no characters` | Cuadro a cuadro al 200 % en emblema, páginas, cajas y lomos. Una sola pseudoletra legible = repetir |
| T-06 | **Lentes con reflejo o deformados.** La biblia pide "sin reflejo"; arte 1.5, "reflejo muy suave"; fotografía pide reflejo en los ojos. Al subir la cabeza (V1-04) el armazón puede doblarse o cruzar el iris | Brillo de fuego sobre los ojos (mirada vacía), armazón que cambia de forma o de altura entre V1-04, V1-06, V1-07 y V1-08 | **Alta** | Regla única: reflejo **en la córnea** sí (cálido grande y azul pequeño); brillo **en el vidrio** sobre el iris no. Mismo punto de apoyo en la nariz en todas las fijas con cara (medido desde M1). Corte de seguridad de la biblia (decisión c): 3 de las 6 primeras tomas de V1-04 fallan, se quitan en todo el piloto, antes de generar cualquier otro plano | En cada toma con cara: armazón con la misma forma en todos los cuadros; altura del puente ±3 % del alto de la cara respecto de M1 |
| T-07 | **Mezcla de modelos y retiro de Veo.** Planos con manos en Fast (V1-02, V1-05, V1-09) junto a V1-03 en Quality: piel, anillo y mancha de tinta se dibujan distinto. Veo 3.1 sale del Flow el 5-dic-2026: cualquier repetición posterior saldría de otro modelo. "Omni 1.2 Flash" (clips de 15 s) no aparece en ningún documento ni tiene ficha D27 en `docs/proveedores/` | Manos que cambian de un plano a otro; un Santa de otro modelo junto a los de Veo | **Alta** | Las manos se aprueban **juntas** (V1-02, V1-03, V1-05, V1-09) con la misma hoja: anillo en el anular **derecho**, tinta en índice y pulgar **derechos**, misma piel. Si Fast no empata con Quality, ese plano pasa a Quality con la reserva. Cero planos con cara de otro modelo: si algún día se usa otro, se rehacen **todos** los planos con cara en ese modelo. Otro modelo solo con ficha D27 de `legal-compliance` | Revisión de manos en paralelo, lado a lado. Revisión de espejo (anillo en la mano equivocada = repetir) |
| T-08 | **Nombre corto al final de una frase.** `voz.md` 2.4 y la biblia prohíben el nombre corto al final absoluto de una frase (se recorta la última sílaba), pero el storyboard usa "¡Hola, {nombre}!", "¿Sabes una cosa, {nombre}?" y "¡Feliz Navidad, {nombre}!" | "Ana" que suena "An", "Teo" que suena "Te": el peor fallo del producto | **Alta** | `video-voz-santa` prueba esas tres frases con Ana, Mía, Teo, Fer, Pau, Luis antes de fijar textos. El control automático (voz 4.3, 0,35 s por sílaba) es eliminatorio en esas frases. Si fallan, se reordena para que el nombre quede a mitad de frase: "¡Hola, {nombre}, ya te encontré!", "{nombre}, ¿sabes una cosa?", "¡Feliz Navidad, {nombre}, de todo corazón!" (recalcular caracteres del storyboard 6) | Prueba de escucha en bocina de teléfono: 100 % de los nombres escritos correctamente por quien escucha |
| T-09 | **Texto de la carta contradictorio.** Biblia 8.1: en la carta va el logro "tal como lo convierte el modelo" (segunda persona: "aprendiste…"). Storyboard V1-05: va "lo que escribió el adulto, ya limpio" | Una carta de la familia a Santa que dice "aprendiste" no la escribió la familia: el adulto lo nota | **Alta** | Recomiendo el texto del adulto en tercera persona, con ortografía corregida al mínimo y pasado por los mismos filtros del guion (sección 6 del guion; nada de salud, cuerpo, duelo, marcas, regaños). Lo decide el director | El texto escrito nunca contiene algo que el filtro descartó para la voz |
| T-10 | **Saltos entre tomas del mismo encuadre.** V1-07 (7,5 s) y V1-08 (2,5 s) suman 10 s: no caben en un clip de 8 s, así que salen de dos generaciones con el mismo encuadre. El corte a 0:50 es un salto (jump cut): cabeza, barba y luz se mueven unos píxeles | El típico "brinco" de los videos hechos con IA | **Alta** | Una de dos: (a) empate ≤ 1 % de posición de cabeza y de luz (más estricto que el ±3 % del storyboard), o (b) cambio deliberado de tamaño de plano en V1-08 (100 mm o 20 % más cerrado) para que se lea como corte de cine, no como falla. Prefiero (b) | Corte en contexto, a velocidad real, en teléfono |
| T-11 | **Boca procesada frente a boca original.** V1-07 tiene la boca redibujada (suele quedar más suave) y V1-08, al lado, la tiene original | Cambio de nitidez de la boca en el corte | **Media** | Mismo grano y misma nitidez de boca en V1-04, V1-07 y V1-08 en post (fotografía 9) | Comparar cuadros vecinos al 200 % |
| T-12 | **Voz por pedido que cambia con el tiempo.** Las frases fijas se generan una vez; las personalizadas, cada día de la temporada. Si el proveedor actualiza el modelo, el empalme fijo/personalizado cambia de timbre | Dos Santas en un mismo video | **Media** | Fijar versión de modelo y semilla. Control diario con 3 frases de referencia (tono medio, LUFS, ritmo; voz 2.3) | Si falla el control diario, se pausa la generación de pedidos |
| T-13 | **Formatos por pedido.** El storyboard produce 9:16 y 16:9 de cada plano, pero no dice si cada pedido recibe los dos. Si sí, la sincronización de labios y la composición se hacen dos veces por pedido | El doble de oportunidades de falla por pedido y el doble de costo de labios | **Media** | Decidir si el 16:9 se entrega por pedido. Si sí, el control automático corre sobre los dos archivos | Control por pedido (anexo A) |

---

## 3. Riesgos por toma

### V1-01 · Plano general: abre el libro (0:00–0:07, Quality)
| Riesgo | Sev. | Mitigación | Verificación |
|---|---|---|---|
| Veo 3.1 genera su propio audio y tiende a mover la boca si "huele" diálogo; aquí Santa ríe y habla en off con la cara de frente | Alta | Instrucción: `silent, mouth closed, no speaking, no dialogue`; elegir la toma donde la cabeza baja tapa la boca durante 0,8–6,3 s | Sin sonido: cero movimiento de labios |
| La fija vieja de arte (5.5) pone a Santa de perfil, el gorro colgado, el nacimiento y el ponche | Crítica | F01 solo desde la distribución de la biblia sección 3 | Lista de los 12 puntos + "sin gorro visible", "sin nacimiento" |
| Tapa del libro que se dobla como cartón o se funde con las manos; manos pequeñas a esa escala con dedos borrosos | Alta | Apertura lenta, una sola acción | Cuadro a cuadro en la apertura |
| Nieve que cae en loop o "hacia arriba"; vapor de la taza que se congela | Media | — | Revisión de 8 s completos |
| En 16:9 Santa queda aún más pequeño y el estudio se "inventa" en las alas: aparecen objetos prohibidos (árbol, guirnaldas, cuadros con letras) | Alta | Las alas se revisan con la misma lista que el centro | Prueba de columna central y de alas |

### V1-02 · Sobre el hombro (0:07–0:13, Fast)
| Riesgo | Sev. | Mitigación | Verificación |
|---|---|---|---|
| Pseudoletras en las páginas que pasan | Alta | T-05 | Cuadro a cuadro |
| **Fondo equivocado:** desde detrás del hombro izquierdo la cámara mira al sur; ahí están la puerta y el gancho del gorro, que la biblia dice que nunca se ven | Media | Instrucción: `dark wooden wall far behind, deep bokeh, no door, no hooks, no hat`; la lámpara queda a cuadro-izquierda (es camera-right en el plano frontal) y la chimenea a cuadro-derecha | Comprobar gorro ausente y posición de las fuentes contra el mapa |
| Mano izquierda con anillo (el anillo va en la derecha) o con mancha de tinta | Media | T-07 | Revisión de espejo |
| Pelo y lana "de plástico" en Fast | Media | Pasar a Quality con la reserva (ya previsto) | Prueba de cera al 200 % en el pelo |

### V1-03 · Cenital: nombre en dorado (0:13–0:20, Quality) — momento "wow"
| Riesgo | Sev. | Mitigación | Verificación |
|---|---|---|---|
| **Dirección de la mano:** con la página derecha "arriba = arriba del cuadro", Santa queda al borde inferior. La instrucción dice que el dedo "sale por la izquierda" sin decir de dónde viene el brazo; la máquina puede traer el brazo desde arriba (alguien al otro lado del escritorio) o una mano sin brazo | Media | `his right hand and forearm enter from the bottom edge of frame, brick-red cuff with cream wool trim visible at frame bottom, then withdraw downward` (y ajustar fija F03) | Cuadro a cuadro de 0 a 3,0 s |
| Mano o su sombra dentro de la caja o del margen de 3 % después de 1,7 s | Crítica | Ya en el storyboard | Máscara de la caja sobre cada cuadro |
| Página que respira, se ondula o deriva más de 1 % en 3,0–7,0 s (el nombre se despega) | Alta | Elegir toma por estabilidad; si deriva poco, seguimiento plano en post | Diferencia de cuadros en la zona de la caja |
| **Nombre "pegado":** página con parpadeo de luz y dorado inmóvil; grano distinto; mayúsculas de Pinyon Script ilegibles en teléfono; acentos de mayúscula ("Á", "Ñ") que se salen de la caja; nombre escrito en MAYÚSCULAS o minúsculas por el adulto | Alta | El dorado hereda el parpadeo y el grano de la página. Prueba de glifos de la biblia (decisión i). Regla de escritura: si el adulto escribe todo en mayúsculas o todo en minúsculas, se pasa a mayúscula inicial; nunca se agregan ni quitan tildes; la pantalla de confirmación muestra el nombre tal como saldrá | Prueba "escrito, no pegado" con 3 personas; un niño de 7 a 9 años lee su nombre en el teléfono |
| Arranque del clip en 0,0 s: el primer cuadro es la fija y Veo a veces la "congela" unos cuadros antes de moverse | Media | Si se ve el arranque congelado, usar 0,3–7,3 s y mover el nombre +0,3 s | Primeros 12 cuadros |
| La voz "{nombre}… ¡aquí estás! ¡Tu nombre brilla!" con "María Fernanda" (1,5 s) no cabe en 3,2 s y cruza a V1-04 mientras Santa sube la cabeza | Media | Permitido que la voz en off cruce el corte; nunca que se recorte la frase | Prueba con el nombre más largo |

### V1-04 · "¡Hola, {nombre}!" (0:20–0:27, Quality + labios) — primer plano que se produce
| Riesgo | Sev. | Mitigación | Verificación |
|---|---|---|---|
| Bigote sobre el labio (T-02), barba que hierve (T-03), boca que habla fuera de la ventana (T-04) | Crítica | P3 y criterios de T-02 a T-04 | Rúbrica C3, C5 |
| Al subir la cabeza (0–1,3 s) los lentes se doblan o reflejan el fuego (T-06) | Alta | Corte de seguridad de la decisión c | C4 |
| Mirada que no llega al lente o "se desliza"; ojos sin reflejo en la córnea | Crítica | Fotografía 10.1, puntos 6 y 7 | Cuadro a cuadro desde 1,3 s |
| Dientes que cambian de forma o de número durante el habla; dientes "de porcelana" | Alta | Igualar con M1; sonrisa solo con dientes superiores | 200 % en la ventana de labios |
| Parpadeo ausente durante 7 s (mirada fija) o parpadeo doble mecánico | Media | Elegir toma con 1 o 2 parpadeos naturales en la calma | Contar parpadeos |
| La calma de 2 s se recorta para que quepa el texto | Crítica | Regla del storyboard: nunca | Medir 4,8–7,0 s |
| Con edad "nueve" y nombre largo, "¡Hola, María Fernanda! Ya tienes nueve años." pasa de 3,1 s | Media | Variante de edad más corta (storyboard 6) | Duración real de la pieza |

### V1-05 · La carta de la familia (0:27–0:35, Fast)
| Riesgo | Sev. | Mitigación | Verificación |
|---|---|---|---|
| Texto generado en la carta; la estrella de crayón se ve como logotipo | Alta | Ya en el storyboard | 200 % |
| Contradicción del texto escrito (T-09); el texto escrito se salta los filtros | Alta | T-09 | Control por pedido (anexo A) |
| La carta "se abre sola" con física imposible (se despliega como tela, se mueve después de caer) | Media | Si cuesta, la carta ya llega abierta y la mano solo la alisa | Cuadro a cuadro 0–2,5 s |
| **Usa los 8,0 s completos del clip**: sin margen para cortar el arranque ni los últimos cuadros (los que más se degradan) | Alta | Sección 4: bajar a 7,4 s útiles; la voz en off puede cruzar a V1-06 | Tabla de la sección 4 |
| Mano que deja la carta desde un lado imposible (ver V1-03) | Media | Brazo desde el borde inferior | Cuadro a cuadro |

### V1-06 · Ojos sobre el libro cerrado (0:35–0:42,5, Quality)
| Riesgo | Sev. | Mitigación | Verificación |
|---|---|---|---|
| **Se lee como "te estoy espiando"**: contradice la regla "Santa nunca vigila" | Crítica (niños) | Visto bueno de `desarrollo-infantil` (ya pendiente); pregunta específica en la prueba ciega (sección 6) | Ningún adulto dice "espiando" o "vigilando" |
| Dedos que sostienen el libro por los lados, en un plano de cara: dedos de más o fundidos con la tapa | Alta | Manos abajo, fuera de cuadro, o libro apoyado en el escritorio | C2 en todos los cuadros |
| Boca o barba asomando y moviéndose mientras habla la voz en off | Crítica | Libro a la altura de la nariz todo el plano | Sin sonido, máscara bajo la nariz |
| Lentes "bajos en la nariz" con los ojos por encima del armazón aquí, y a través del lente en V1-04 y V1-07 | Media | Misma posición de lentes en todas las fijas (T-06) | Comparar con M1 |
| Libro que se deforma o emblema con letras (T-05) | Alta | T-05 | 200 % |

### V1-07 · "Ya estás en mi Lista" (0:42,5–0:50, Quality + labios)
| Riesgo | Sev. | Mitigación | Verificación |
|---|---|---|---|
| Todos los de V1-04 en labios (T-02 a T-04) | Crítica | Igual | C3, C5 |
| **El libro desaparece:** en V1-06 Santa sostiene el libro a la altura de la nariz; en el siguiente cuadro (V1-07, mismo tamaño de plano) ya no está | Media | Que V1-07 empiece con el libro bajando y saliendo por el borde inferior antes del habla (recalcular la ventana de voz), o que el director acepte el corte por escrito y se mida en la prueba ciega ("¿algo raro entre escenas?") | Corte en contexto |
| Corte con V1-08 (T-10) y nitidez de la boca (T-11) | Alta | T-10, T-11 | Corte en contexto |
| "¿Sabes una cosa, {nombre}?" con nombre corto al final de pregunta (T-08) | Alta | T-08 | Escucha en teléfono |
| 7,5 s de clip con labios hasta 7,3 s: casi sin margen al final (sección 4) | Media | 7,4 s útiles | Tabla de la sección 4 |

### V1-08 · El guiño (0:50–0:52,5, Quality)
| Riesgo | Sev. | Mitigación | Verificación |
|---|---|---|---|
| Guiño que cierra los dos ojos (parpadeo), cara que se tuerce, o guiño exagerado | Alta | Elegir el mejor tramo de 2,5 s de 8 s | Cuadro a cuadro |
| El lente se dobla con la mejilla que sube | Media | T-06 | C4 |
| Salto con V1-07 (T-10) | Alta | T-10 | Corte en contexto |

### V1-09 · Manos sobre el libro y cierre (0:52,5–1:00, Fast)
| Riesgo | Sev. | Mitigación | Verificación |
|---|---|---|---|
| Dos manos de cerca a 85 mm, con palmadas: el caso más difícil para dedos (dedos que atraviesan la tapa, manos que se funden) | Alta | Si Fast falla, pasa a Quality con la reserva | C2 en todos los cuadros |
| Anillo y mancha de tinta ausentes o en la mano equivocada (T-07) | Media | T-07 | Revisión de espejo |
| Título "¡Feliz Navidad, {nombre}!" ilegible en teléfono con un nombre de 16 caracteres; marca dentro del 15 % inferior | Media | Prueba con "María Fernanda" en teléfono | Lectura a 40 cm |
| "¡Feliz Navidad, {nombre}!" con nombre corto seguido de la risa (T-08) | Alta | T-08 | Escucha |

### Video gratis (G1, G2, G3)
| Riesgo | Sev. | Mitigación | Verificación |
|---|---|---|---|
| G1 hereda los riesgos de V1-01 en su tramo 0,5–4,5 s (boca visible sin voz) | Alta | Igual que V1-01 | Igual |
| G2: la voz "{nombre}… ¡aquí estás!" termina a 0:09,8 y el plano corta a 0:09,5: cruza a G3 | Baja | Permitido (las dos son en off) | Escucha |
| G3: los ojos sobre el libro son el último recuerdo antes de pagar: si se lee como acecho, se pierde la venta y la confianza | Crítica (niños) | Igual que V1-06 | Prueba ciega |
| El gratis se genera por visita: se usa la voz con nombres reales antes de la aprobación escrita de ElevenLabs | Crítica (legal) | Nada del gratis al público hasta la aprobación (`legal-proveedores.md`). Escalo a `legal-compliance` | — |
| Caché del gratis por nombre: "Sofia" y "Sofía" no son el mismo pedido | Alta | Clave de caché = ortografía exacta + campo "¿Cómo se pronuncia?" | Anexo A |

---

## 4. Duración de los clips frente al límite

Regla de calidad: de un clip de Veo de 8 s se usan como máximo **7,4 s, entre 0,3 y 7,7 s**. Los primeros cuadros pueden ser la fija congelada y los últimos son los que más se degradan. Para un modelo de 15 s (Omni 1.2 Flash, si algún día tiene ficha D27), la regla equivalente es 0,3 s a cada lado.

| Plano | Duración en el corte | Tramo del clip | Margen inicio / fin | Veredicto |
|---|---|---|---|---|
| V1-01 | 7,0 s | 0,5–7,5 | 0,5 / 0,5 | OK |
| V1-02 | 6,0 s | no definido | — | Definir 1,0–7,0 |
| V1-03 | 7,0 s | 0,0–7,0 | 0,0 / 1,0 | Condicional: OK si no hay arranque congelado; si lo hay, 0,3–7,3 y nombre +0,3 s |
| V1-04 | 7,0 s | no definido (labios 1,4–5,1) | — | Definir 0,5–7,5; la calma termina antes de 7,7 |
| V1-05 | 8,0 s | 0,0–8,0 | 0,0 / 0,0 | **No pasa.** Bajar a 7,4 s; la voz en off cruza a V1-06 |
| V1-06 | 7,5 s | 0,0–7,5 | 0,0 / 0,5 | Condicional: como V1-03 |
| V1-07 | 7,5 s | no definido (labios 0,2–7,3) | ≤ 0,25 | **Ajustar a 7,4 s**; el tiempo sobrante pasa a V1-08 (2,6 s) |
| V1-08 | 2,5 s | mejor tramo | amplio | OK |
| V1-09 | 7,5 s | no definido | — | OK si desde 0:56,8 (imagen desenfocada y oscurecida) se alarga con un cuadro congelado bajo el desenfoque; así el clip solo necesita ~5 s de movimiento real |
| G1 / G2 / G3 | 4 / 5,5 / 5,5 s | tramos de V1-01, V1-03, V1-06 | amplio | OK |

El total sigue en 60 s: lo que se quita a V1-05 y V1-07 se devuelve en la tarjeta final de V1-09 (cuadro congelado bajo el desenfoque). Labios por pedido: ~11 s, dentro del límite de 20 s del brief.

---

## 5. Rúbrica de aceptación por toma

### 5.1 Escala (igual para todos los criterios)
| Nota | Significado |
|---|---|
| 5 | Invisible: no se ve ni cuadro a cuadro al 200 % |
| 4 | Solo se ve cuadro a cuadro al 200 %; invisible a velocidad real en teléfono y en televisor |
| 3 | Se ve a velocidad real si alguien entrenado lo busca |
| 2 | Lo ve un adulto atento sin buscarlo |
| 1 | Evidente; lo ve un niño |

### 5.2 Criterios
| Cód. | Criterio | Qué se mira | Eliminatorio |
|---|---|---|---|
| C1 | Rostro y piel | Prueba de cera al 200 %, poros y arrugas, lunar en el pómulo izquierdo de Santa, nariz desviada, ceja izquierda más alta, ojos avellana con reflejo en la córnea, parpadeo natural, dientes estables | No (mínimo 4) |
| C2 | Manos y dedos | Cinco dedos en **todos** los cuadros, sin fundirse con objetos, anillo y tinta en la mano derecha, sin guantes | **Sí: debe ser 5** |
| C3 | Barba, bigote y pelo | Barba que no "hierve" ni se derrite, hebras estables, bigote recortado con el labio superior visible, mismo largo y caída que M1 | No (mínimo 4; en labios, mínimo 5) |
| C4 | Lentes | Sin brillo en el vidrio sobre el iris, armazón de forma constante, misma altura en la nariz que M1 | No (mínimo 4) |
| C5 | Boca y labios | Planos con labios: coincide con la voz, sin máscara, sin boca borrosa, sin movimiento fuera de la voz. Planos sin labios: boca quieta o tapada todo el tiempo | **Sí: debe ser 5** en cualquier movimiento de boca sin voz o voz con boca visible quieta en plano frontal cercano; mínimo 4 en la calidad de la sincronización |
| C6 | Texto y símbolos | Cero letras, números o pseudoletras generadas; cero marcas de agua; emblema sin letras | **Sí: debe ser 5** |
| C7 | Luz y color | Chimenea siempre a camera-left en planos frontales, ventana azul detrás a camera-right, nada desde abajo, parpadeo < 5 % en cara (< 3 % en página), traje #8E1B24, dorados mantecosos | No (mínimo 4) |
| C8 | Continuidad con los planos vecinos | Mismo Santa, traje, lentes, barba, utilería, número de velas, estado del fuego, posición de cabeza; piel ±5 % | No (mínimo 4, revisado en el corte) |
| C9 | Movimiento y física | Papel que se dobla como papel, tela con peso, nada que aparece o desaparece, sin deformaciones (morphing), cámara según el storyboard | No (mínimo 4) |
| C10 | Seguridad emocional | Nada asusta: sin luz desde abajo, sin oscuridad, sin primer plano invasivo, sin cara deformada, sin mirada de vigilancia | **Sí: debe ser 5** |
| C11 | Encuadre y zonas | Lo importante en la columna central 9:16; nada en el 8 % superior ni en el 15 % inferior; zona del nombre libre de manos y sombras | No (mínimo 4; en planos COMP la zona del nombre es eliminatoria) |
| C12 | Composición y personalización | Nombre y textos con la ortografía del pedido, legibles en teléfono, que parecen escritos y no pegados, sin datos de otro pedido | **Sí: debe ser 5** en dato correcto; mínimo 4 en integración visual |

### 5.3 Regla de aprobación
Una toma es **APROBADA** si cumple las cuatro cosas:
1. Todos los eliminatorios que le aplican en 5.
2. Ningún otro criterio por debajo de 4 (C3 en 5 en los planos con labios).
3. Promedio de los criterios que aplican ≥ 4,3.
4. Cumple el "Aprobado si" propio del plano en el storyboard.

Con varias tomas aprobadas, gana la que mejor empata con la anterior y la siguiente (C8), no la más bonita sola. Una fija se aprueba con la misma regla, sin C5 ni C9.

### 5.4 Criterios que aplican a cada toma
| Toma | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | C11 | C12 | Además (eliminatorio) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1-01 | x | x | x | x | x (sin labios) | x | x | x | x | x | x | — | Sin gorro, sin nacimiento a la vista |
| V1-02 | — | x | x | — | — | x | x | x | x | x | x | — | Gorro ausente del fondo |
| V1-03 | — | x | — | — | — | x | x | x | x | x | x (zona del nombre) | x | ≥ 5 s de página quieta, deriva ≤ 1 % |
| V1-04 | x | — | x (5) | x | x (labios) | x | x | x | x | x | x | x (nombre y edad dichos) | Calma ≥ 2,0 s con boca cerrada |
| V1-05 | — | x | — | — | — | x | x | x | x | x | x | x | Carta quieta ≥ 5 s |
| V1-06 | x | x | x | x | x (tapada) | x | x | x | x | x (5, sin "acecho") | x | — | Boca y barba ocultas en todos los cuadros |
| V1-07 | x | — | x (5) | x | x (labios) | x | x | x | x | x | x | x | Empate con V1-04 |
| V1-08 | x | — | x | x | x (cerrada) | x | x | x | x | x | x | — | Corte con V1-07 según T-10 |
| V1-09 | — | x | — | — | — | x | x | x | x | x | x | x | Título legible; nada en el 15 % inferior salvo la marca |

### 5.5 Plantilla de registro (una por toma)
```
Plano: V1-04 · Toma: 03 · Formato: 9:16 · Modelo: Veo 3.1 Quality · Fija: F04 v2
Notas: C1 5 · C3 4 · C4 5 · C5 3 · C6 5 · C7 5 · C8 4 · C9 5 · C10 5 · C11 5 · C12 5 · Promedio 4,6
Resultado: REPETIR
Fallas (segundo exacto del clip):
  - 05,40–06,10 · C5 · la boca se abre sin voz durante la calma
  - 02,15 · C3 · el bigote se funde con el labio superior en 4 cuadros
Cambiar: base callada (estrategia B de T-03); `mouth closed after the greeting` en la instrucción
Revisó: video-control-calidad · 2.ª revisión: video-fotografia-iluminacion · Fecha
```
El veredicto final de cada video (aprobado / repetir) cita el **segundo del corte final** de cada falla, no solo el del clip.

---

## 6. Prueba ciega: 10 adultos y 5 niños

La biblia (sección 11) y `comprador.md` (sección 7) hablan de 5 papás. Esta prueba la amplía a 10 adultos y 5 niños; `video-director-creativo` actualiza la biblia. Con estos tamaños no hay estadística: son señales que pueden **frenar** un plano, no probar que el producto funciona.

### 6.1 Dos fases
- **Fase A · 10 adultos, a ciegas.** Se hace en cuanto el corte completo (con música temporal o sin música) pase esta rúbrica. Nombres ficticios.
- **Fase B · 5 niños, con 5 de esos adultos ya informados.** Solo empieza cuando se cumplen **todas** estas condiciones:
  1. Aprobación escrita de ElevenLabs (o voz de Fish Audio con sus condiciones D27 cumplidas) y exclusión de entrenamiento y borrado pedidos a Sync Labs: el niño oye su nombre real, que pasa por esos proveedores.
  2. Consentimiento escrito de madre, padre o tutor, redactado por `legal-compliance`. Dice qué verá el niño, que el video se produjo con herramientas digitales, que nosotros no se lo diremos al niño (lo decide la familia), qué datos se usan y cuándo se borran, que la grabación de la reacción es aparte y opcional, y que se puede parar en cualquier momento.
  3. Protocolo revisado y aprobado por `desarrollo-infantil`.
  4. El video completo aprobado por esta rúbrica y sin ningún plano frenado en la fase A.
  5. El niño puede decir que no o pedir parar, y se respeta sin preguntar por qué.

  Por qué las dos fases: la fase A mide credibilidad sin aviso. Para la fase B el adulto ya tiene que saber cómo se hizo, porque decide por su hijo. Por eso los niños salen de adultos que ya pasaron por la explicación final de la fase A.

### 6.2 Quiénes
**Adultos (10):** madres, padres o abuelos de niños de 3 a 9 años; al menos 3 de los 5 países (GT, SV, HN, CR, PA); al menos 4 mamás y 4 papás, 1 o 2 abuelos o tíos; al menos 3 con hijos de 7 a 9 años (los más desconfiados); al menos 2 que digan en la selección que ya vieron videos hechos con IA (los más exigentes). Nadie del equipo, de su familia ni del círculo cercano del dueño, y nadie que conozca el proyecto.

**Niños (5):** hijos de 5 adultos de la fase A que acepten después de la explicación final. Edades: 1 de 3 a 4, 2 de 5 a 6, 2 de 7 a 9 (al menos 1 que ya lea). Niñas y niños (mide el guion sin género y "Lista de Niños Buenos"). Al menos 2 países.

### 6.3 Cómo se hace

**Fase A (por adulto, unos 45 minutos):**
1. En su propio teléfono, con bocina (no audífonos), en un lugar de su casa o tranquilo. 2 de los 10 lo ven además en televisor (16:9).
2. Elige un nombre inventado (no el de su hijo), una edad y un logro inventados. Ve el gratis de 15 s y después el video de 60 s. No se le dice cómo se hizo.
3. Preguntas de `comprador.md` 1 a 9 después del gratis (sin cambios; la 7 con la variante ganadora primero).
4. Después del de 60 s, las preguntas de calidad Q1 a Q10 (abajo) y luego `comprador.md` 10 a 22.
5. **Nombre a ciegas:** ve un gratis extra de 15 s con un nombre difícil que **no** eligió, sacado al azar del diccionario (Xiomara, Jhon, Yeimi, Joaquín, Güicho, María Fernanda…). Escribe qué nombre dijo Santa.
6. Explicación final (Q11). La conduce el moderador con un texto aprobado por `legal-compliance`.

El moderador lee las preguntas tal cual, sin sugerir respuestas ni corregir.

**Fase B (por niño, en su casa):**
1. El adulto le pone el video completo con el nombre, la edad y el logro reales del niño, como lo haría al recibirlo. Nadie del equipo está en la habitación, para no cambiar la reacción.
2. El adulto graba la reacción con su teléfono (es justo el uso del producto y mide si los 2 s de calma alcanzan). Solo nos la comparte si marcó la casilla de grabación en el consentimiento; se borra a los 30 días. Si no la comparte, llena la hoja de observación de 6.5 en los 10 minutos siguientes.
3. Al terminar, el adulto hace las preguntas al niño (6.5) con sus palabras, en tono de plática y sin insistir.
4. Entre 24 y 48 h después, llamada corta al adulto (6.5, preguntas D1 a D3).

Nunca se le pregunta a un niño si el video "es real", "es de computadora" o "es IA". Si el niño lo pregunta, responde el adulto como decida su familia.

### 6.4 Preguntas de calidad a los adultos (después del video de 60 s)
| # | Pregunta (literal) | Qué mide |
|---|---|---|
| Q1 | "¿Qué sentiste mientras lo veías?" | Reacción espontánea |
| Q2 | "Del 1 al 5, ¿qué tan real se vio? 1 = se nota que es hecho por computadora, 5 = parece una película." | Realismo |
| Q3 | "¿Hubo algún momento en que pensaste 'esto no es real'? ¿Cuál fue y qué viste u oíste?" | Delator espontáneo |
| Q4 | "Míralo otra vez. Cada vez que algo te parezca raro, aunque sea un poquito, di 'ahí'." (se anota el segundo) | Mapa de fallas por segundo |
| Q5 | "Del 1 al 5, ¿qué tan natural te pareció…?": a) los ojos y la mirada, b) la boca cuando habla, c) la barba y el bigote, d) los lentes, e) las manos, f) la voz, g) cómo dijo el nombre, h) la letra dorada del libro, i) el paso de una escena a otra, j) la luz | Criterios C1 a C12 vistos por un papá |
| Q6 | "¿Se escuchó claro el nombre? ¿Lo dijo como lo dirías tú?" | Pronunciación |
| Q7 | "Del 1 al 5, ¿qué tan seguro estás de que tu hijo o hija creería que Santa le habló a él o ella?" | Credibilidad |
| Q8 | "Piensa en el niño más desconfiado que conoces, de unos 8 años. ¿Notaría algo? ¿Qué?" | El niño de 8 años desconfiado |
| Q9 | "¿Algo te incomodó o te preocupó para un niño?" Después, uno por uno: "¿Algo podría asustarlo?", "Cuando Santa mira por encima del libro, ¿qué te pareció que hacía?", "¿Sentiste que el regalo depende de portarse bien?" | Seguridad (C10, V1-06, G3) |
| Q10 | "Del 0 al 10, ¿qué tan probable es que se lo mandes a alguien? ¿A quién?" | Ganas de compartir |
| Q11 | (Después de explicar que el video se produjo con herramientas digitales, incluida inteligencia artificial.) "¿Cambia lo que piensas del video? ¿Te sientes engañado? ¿Cómo te gustaría que te lo dijeran antes de comprar? ¿Dejarías que tu hijo lo viera, sabiendo esto?" | Reacción a la revelación (D23) y reclutamiento de la fase B |

### 6.5 Niños: qué se observa y qué se pregunta
**Hoja de observación** (en el video que comparte el adulto, o la llena el adulto). Se mira en los 5 s después de 0:16,7 (nombre en dorado) y de 0:21,7 (Santa lo dice a cámara):
- Ojos muy abiertos o cejas arriba · boca abierta · se acerca a la pantalla · exclamación ("¡mi nombre!", "¡me dijo!") · voltea a ver al adulto · sonrisa grande de golpe.
- **Asombro** = al menos 2 de estas señales en uno de los dos momentos.
- **Malestar** = llanto, se tapa la cara, voltea y no quiere mirar, pide parar, se esconde.

**Preguntas al niño** (las hace el adulto):
1. "¿Qué pasó en el video?"
2. "¿Con quién estaba hablando Santa?"
3. "¿Cómo crees que sabía tu nombre?"
4. (Solo si ya lee) "¿Qué decía en el libro dorado?"
5. "¿Lo quieres ver otra vez?" (cuenta también si lo pide solo)
6. "¿A quién se lo quieres enseñar?"
7. "¿Hubo algo que no te gustó o que te dio miedo?"

**Al adulto, 24 a 48 h después:**
- D1. "¿Lo volvió a mencionar o pidió verlo?"
- D2. "¿Hizo alguna pregunta que te incomodó? (por ejemplo, '¿Santa me ve?')"
- D3. "¿Notaste algo en su sueño o en su ánimo que relaciones con el video?"

### 6.6 Umbrales de éxito

**Fase A (10 adultos)**
| Medida | Umbral | Si no se cumple |
|---|---|---|
| Realismo (Q2) | Promedio ≥ 4,3 y al menos 8 de 10 con 4 o más; nadie con 1 o 2 | Se repiten los planos más señalados en Q3 y Q4 |
| Mapa de fallas (Q4) | Ningún segundo (±1 s) señalado por 3 o más personas; en 0:16,7–0:24,8 (nombre y primer plano con labios), nadie más de 1 | 3 o más en un plano: **REPETIR** ese plano. 2: lo reviso cuadro a cuadro y decido |
| Naturalidad por aspecto (Q5) | Cada aspecto con promedio ≥ 4,0; boca (b) y nombre (g) ≥ 4,3 | Se repite el plano o la pieza de voz de ese aspecto |
| Nombre a ciegas (paso 5) | 10 de 10 lo escriben bien (clave fonética de voz 4.2) | La pieza de voz y la regla de ese nombre vuelven a `video-voz-santa`; el nombre no entra al diccionario como "validado" |
| Credibilidad (Q7) | ≥ 4 en al menos 8 de 10 | Revisión de los planos citados en Q8 |
| Seguridad (Q9) | 0 de 10 ven susto, vigilancia o regalo condicionado | **Freno**: escalo a `desarrollo-infantil`, `legal-compliance` y `qa-redteam`; no hay fase B hasta resolverlo |
| Compartir (Q10) | Al menos 6 de 10 con 8 o más | Señal para `marketing-growth` (la intención exagera lo que pasa de verdad; el KPI real es ≥ 30 % que comparte) |
| Nota general (`comprador.md` 22) | Promedio ≥ 4,7 | Se lee junto con Q3 y Q4 |
| Revelación (Q11) | Como máximo 2 de 10 se sienten engañados | Escalo a `legal-compliance` y `marketing-growth` la forma y el momento del aviso de IA |

**Fase B (5 niños)**
| Medida | Umbral | Si no se cumple |
|---|---|---|
| Asombro | Al menos 4 de 5 (≥ 80 %, KPI) | Se revisan el silencio antes del nombre, la letra dorada y el primer plano con labios |
| Credibilidad (preguntas 2 y 3) | Al menos 4 de 5 dicen que Santa les hablaba a ellos; como mucho 1 dice por su cuenta que "es de mentira" o "es un video" | Se cruza con el mapa de fallas de la fase A |
| Nombre leído (pregunta 4) | Todos los que ya leen lo leen bien | Se cambia la fuente o el tamaño |
| Quiere verlo otra vez (pregunta 5) | Al menos 4 de 5 | Señal de ritmo y final |
| Compartir (pregunta 6) | Al menos 3 de 5 nombran a alguien | Señal |
| Malestar (observación, pregunta 7, D2, D3) | **0 de 5** | Un solo caso detiene la prueba ese mismo día. Escalo a `desarrollo-infantil`, `legal-compliance` y `qa-redteam` con el segundo exacto |

**Decisión:** si se cumplen todos los umbrales de las dos fases, el video base queda apto (con los permisos legales al día). Si un plano se repite, se vuelve a probar con **5 adultos nuevos** (los anteriores ya vieron el video y ya saben cómo se hizo). Nunca se repite la prueba con los mismos niños.

### 6.7 Datos y cuidado
- Fase A: solo nombres inventados. Fase B: nombre, edad y logro reales del niño solo con los permisos de 6.1, y se borran con la misma regla de retención que un pedido.
- Grabaciones de reacciones: solo con la casilla aparte, guardadas internamente, borradas a los 30 días, nunca usadas en anuncios ni testimonios sin autorización escrita nueva (`comprador.md` 8).
- Si hay agradecimiento a los participantes (por ejemplo, el video gratis completo para su familia), lo aprueba `legal-compliance` y se anota, porque puede sesgar las respuestas.

---

## Anexo A · Control automático por pedido (con `video-ia-generativa`)

Ningún video sale si falla una sola de estas comprobaciones:
1. **Nombre en la voz:** control de `voz.md` 4 (clave fonética, 0,35 s por sílaba, tasa de error de palabras ≤ 10 %), con las frases de T-08 como eliminatorias.
2. **Nombre escrito:** se compara el texto que entra al compositor con el nombre del pedido, carácter por carácter, en la misma forma Unicode (NFC). Después se lee el texto en el cuadro ya renderizado (0:18,5, 0:58,0 y el gratis 0:09,0) y se compara con el pedido.
3. **Mismo pedido en todo:** un manifiesto por pedido (id, nombre, edad, logro, gusto, casilla, forma TTS) firmado con un hash. Cada pieza de voz, cada composición y el archivo final llevan ese id. La transcripción del audio final solo contiene palabras del guion y datos de **este** pedido; el nombre aparece 4 veces (1 en el gratis) en sus tiempos esperados ±0,3 s.
4. **Labios:** métrica automática de sincronía (tipo SyncNet) en V1-04 y V1-07 `[no verificado: calibrar el umbral con las tomas aprobadas]`. Nitidez de la boca frente a las mejillas dentro de ±10 % de la toma aprobada.
5. **Técnico:** duración exacta, sin cuadros negros ni congelados fuera de lo previsto, -16 LUFS y -1,5 dBTP, 0,5 s de silencio antes del nombre, primer y último cuadro sin defectos.
6. **Auditoría manual:** cada semana reviso a mano 50 pedidos al azar (con protocolo y rúbrica de este documento) y el 2 % de audios de nombre de `voz.md` 4.3. Una sola falla de nombre o de dato ajeno detiene la línea hasta encontrar la causa.

## Anexo B · Pendientes y a quién van

| Pendiente | Para quién |
|---|---|
| P1: aplicar la ronda 2 y pasar los guiones a `guion-v1.1` | Cada sección de la biblia sección 9 |
| P2: escribir `produccion/piloto-flow.md` con instrucciones literales | `video-ia-generativa` |
| P3: prueba de base callada o base que habla para labios | `video-ia-generativa` |
| P4: emblema sin brújula | `video-direccion-arte` |
| P5: texto de la carta | `video-director-creativo` |
| P6: tramos de clip y duraciones de la sección 4; tamaño de plano de V1-08 (T-10); libro que desaparece entre V1-06 y V1-07 | `video-director-creativo` |
| P7: calendario con todas las tomas con cara aprobadas antes del 1-dic | `lider-proyecto` |
| Nombre corto al final de frase (T-08) | `video-voz-santa`, `video-guionista` |
| Entregar o no el 16:9 por pedido (T-13) | `video-director-creativo`, `arquitecto` |
| Ficha D27 antes de cualquier otro modelo de video (por ejemplo, Omni 1.2 Flash) | `legal-compliance` |
| Consentimiento de la fase B, texto de la revelación (Q11), agradecimiento a participantes | `legal-compliance` |
| Protocolo de la fase B, V1-06 y G3 ("acecho") | `desarrollo-infantil` |
| Biblia: prueba ciega de 5 a 10 adultos + 5 niños | `video-director-creativo` |
