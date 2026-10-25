# Motor de imagen de Pintoria a partir de noviembre de 2026 (25-oct-2026)

Investigación de solo lectura: no se generaron imágenes, no se abrieron cuentas, no se tocó código. Complementa la medición real `gpt-image-1-mini` vs `gpt-image-2.5-flare` que hace otro agente. Toca D15 (proveedor intercambiable) y D27 (verificación de políticas antes de cualquier proveedor).
> **Nota de revisión (25-oct-2026, sesión principal):**
> - `legal-compliance` encontró la misma cláusula de menores de 18 en Vertex AI (Cloud Service Specific Terms §20(d)). Google queda en **riesgo alto por las dos vías** (`docs/proveedores/google.md`), así que el "respaldo de emergencia" de la sección 5 no sirve sin abogado.
> - Meta Muse Image aún no tiene documento D27.
> - Precios de `gpt-image-2.5-flare` ($5 / $8 / $30 por M), estado "Default" y snapshot `2026-09-08` confirmados en la ficha oficial.

**[no verificado]** = el dato no sale de una fuente oficial, o no pude confirmarlo en ella. **[estimación mía]** = cálculo o juicio mío sin dato público. **[opinión]** = valoración de un tercero. Todas las páginas se consultaron el 25-oct-2026; entre paréntesis va la fecha que muestra cada página cuando la tiene.

---

## 0. Respuesta corta

1. **Principal: quedarse en OpenAI y pasar a la familia `gpt-image-2.5`.** Personajes (paso 1) con `gpt-image-2.5-sunburst` y páginas (paso 2) con `gpt-image-2.5-flare`, las dos en calidad `medium`. Cobran la misma tarifa por token. Hay una regla de costo nueva: **máximo 2 imágenes de referencia por página**; si en la escena salen 3 o más personajes, se envían juntos en una sola hoja compuesta. Con esa regla, el libro cuesta **≤ $0.82 con 3 personas y ≤ $0.90 con 5**, más ~4 % de reintentos. Sin la regla, el peor caso es $1.02 con 3 personas y $1.49 con 5, por encima del tope.
2. **Por qué OpenAI:** es el número 1 y 2 del ranking de preservación de identidad de Artificial Analysis, con Sunburst y Flare en calidad `max`. Es el mismo proveedor y el mismo endpoint `/v1/images/edits`, así que el cambio en `providers/openai.ts` es mínimo. Es compatible con retención cero (requiere aprobación). Y la evidencia, débil pero consistente, pone a OpenAI arriba en line-art limpio. En OpenAI el costo lo dominan las **imágenes de referencia de entrada** (~$0.008 cada una), no la salida (~$0.010 por página `medium` 1024x1536).
3. **Plan B (otro proveedor): Meta Muse Image a $0.01 por imagen, referencias incluidas.** Cuesta **~$0.27 por libro con 3 personas y ~$0.29 con 5**. Es el 6.º en identidad, por encima de Nano Banana 2 y de Seedream 5.0 Pro, y acepta 1–10 referencias. Está condicionado: es una API de 2 meses, `legal-compliance` tiene que revisarla según D27, y falta una prueba de line-art. Variante recomendada: **personajes en OpenAI y páginas en Muse ($0.48–0.64)**. Así el segundo proveedor nunca ve las fotos reales de los niños, solo los dibujos.
4. **Respaldo de emergencia: Google Nano Banana 2.1 en Vertex AI.** Es GA desde el 6-oct-2026 y es el 3.º en identidad. Su entrada es barata, pero la salida cuesta $0.0336 por imagen 1K y el *thinking* es obligatorio, así que el libro sale en **~$1.09–1.27 con 3 personas**: no cabe en el tope. Además documenta consistencia de **máximo 4 personajes**.
5. **Descartados o no prioritarios:**
   - **Black Forest Labs (FLUX) por su API:** sus términos **prohíben subir imágenes de menores de 18** y le dan una licencia para entrenar con nuestros inputs.
   - **Nano Banana 2 Lite:** Google dice que no está optimizado para varias referencias y no ofrece consistencia de personaje.
   - **Seedream 5.0 Pro y Qwen-Image-3.0-Pro:** pasan de $1.
   - **Ideogram, Recraft y Runway gen4:** caros o débiles en identidad a partir de fotos.
6. **Riesgo estructural:** OpenAI apagó o programó el apagado de tres tandas de modelos de imagen entre mayo y diciembre de 2026: DALL·E el 12-may, `gpt-image-1` el 23-oct, y `-1-mini` y `-1.5` el 1-dic. Avisó con ~6 meses cada vez, y `gpt-image-1.5` vivió menos de 12 meses. `gpt-image-2` (abril 2026) ya figura como "legacy" en terceros. Cuenta con que **flare durará 12–18 meses**: fijar el snapshot `gpt-image-2.5-flare-2026-09-08` y tener el plan B ya implementado detrás de `IMAGE_PROVIDER`.

---

## 1. Supuestos del cálculo

- **Libro.** Hay P personajes (paso 1, 1024x1024, 3 fotos por persona) y 24 páginas (paso 2, portada + 23 escenas, 1024x1536). El código actual (`engine.ts`, en cambio por otro agente) ya admite varias fotos por persona (`photoCounts`).
- **Referencias por página.** El "peor caso" supone que todos los personajes salen en todas las páginas. El caso "típico" supone que en la portada salen todos y en cada escena salen 2 (con 3 personas) o 3 (con 5).
- **Texto.** El prompt pesa ~500 tokens por llamada [estimación mía: `prompt.ts` arma ~1,500–2,000 caracteres].
- **Fotos.** Se suponen redimensionadas a ≤ 1024 px por lado. Hoy `engine.ts:137` las deja en ≤ 1536 px, lo que en OpenAI sube ~50 % el costo de cada foto de entrada [no verificado: conteo de tokens medido por un tercero].
- **No se incluyen:**
  - Reintentos: la medición real del 19-oct dio 1 reintento en 27 imágenes, ~+4 %.
  - La historia escrita por el modelo de texto.
- **Línea base:** `gpt-image-1-mini` en `medium` cuesta $0.53 por libro (medido) y 104–110 s. En el ranking de **edición con preservación de identidad** de Artificial Analysis está en el **puesto 68 de 76 (Elo 915)**. Casi cualquier modelo actual es un salto grande en parecido.

### Cómo cobra cada familia (fuente oficial salvo marca)

| Familia | Cómo cobra | Dato clave para Pintoria |
|---|---|---|
| OpenAI `gpt-image-2.5` (flare y sunburst) | Por token. Texto de entrada $5/M, imagen de entrada $8/M, imagen de salida $30/M; en Batch la salida baja a $15/M. | Tokens de salida según la fórmula de la calculadora oficial: 1024x1536 → low 158, **medium 343**, high 1,372; 1024x1024 → low 196, **medium 439**, high 1,756. **Medium 1024x1536 ≈ $0.0103 por imagen.** Cada referencia ≤ 1024² ≈ 1,024 tokens ≈ **$0.0082** [no verificado: medición de APIYI]. El caché de imágenes ($2/M) **no aplica a `/v1/images/edits`** (guía oficial). |
| Google Nano Banana 2.1 (`gemini-nano-banana-2.1`) | Entrada $1.50/M, texto y *thinking* $7.50/M, imagen de salida $30/M. | 1,120 tokens por imagen de entrada (≈ $0.0017). Salida 1K = 1,120 tokens = **$0.0336**; 2K = $0.0504. En 2:3, el 1K mide **848x1264** y el 2K 1696x2528. El *thinking* no se puede apagar (niveles minimal, medium por defecto, o high). |
| Meta Muse Image | **$0.01 por imagen** (página oficial de Meta). | El edit acepta 1–10 referencias [no verificado: documentación de agregadores]. No hay control de píxeles: se elige proporción y el modelo decide la resolución [no verificado]. |
| Microsoft MAI-Image-2.6-Flash | Texto $1.75/M, imagen de entrada $2.50/M, imagen de salida $19/M [no verificado: cifra citada por prensa]. | Máximo 5 referencias. **Public preview.** |
| ByteDance Seedream 5.0 Pro | Desde **$0.045 por imagen**; la primera referencia es gratis y cada adicional cuesta desde $0.003 (página oficial de BytePlus). | Latencia de 110–130 s por imagen [no verificado: medición de APIYI]. |
| Alibaba Qwen-Image-3.0 / 3.0-Pro (Singapur) | $0.03 / $0.04 por imagen 1K, más $0.003 por imagen de entrada. | — |
| BFL FLUX 3 Image / FLUX 3 Image Klein | $0.048 / **$0.009** por imagen 1K, con referencias incluidas. | **Términos incompatibles** con fotos de menores (sección 6). |

---

## 2. Tabla comparativa

La identidad se mide con el Elo de la categoría "Identity Preserving Edit" de Artificial Analysis (AA), con el puesto sobre 76 modelos. Es un ranking por votos ciegos de evaluadores. **Ojo:** mide ediciones que preservan a una persona, no la conversión de foto a caricatura de línea; sirve de señal, no de prueba. OpenAI fue evaluado en calidad `max` ($0.21 por imagen); en `medium` no hay dato público.

| Modelo (proveedor) | Estado | Precio oficial | Refs por llamada | Identidad (AA) | Line-art para colorear | Latencia típica | Datos y entrenamiento | Historial de apagados |
|---|---|---|---|---|---|---|---|---|
| **gpt-image-2.5-flare** (OpenAI) | GA. Snapshot `2026-09-08`. Sin deprecación anunciada. | $5 / $8 / $30 por M tokens. ~$0.010 por página medium más $0.008 por referencia. | Hasta 16 [no verificado: fal y APIYI]. | **1224 (#2)** en `max`. | La mejor evidencia disponible, aunque débil: en una prueba de terceros, `gpt-image-1.5` fue el primero en "crisp black-and-white line art" [opinión]. | ~10 s low/medium y ~21 s high en 1024² texto-a-imagen; ~25 s una edición high con 1 referencia [no verificado]. | No entrena con los datos del cliente; logs de abuso hasta 30 días; **compatible con retención cero (requiere aprobación)**; las imágenes marcadas como CSAM se retienen igual. Límites: Build 20 IPM, Launch 150 IPM, Grow 250 IPM. | Alto: `gpt-image-1` se apagó el 23-oct-2026, y `-1-mini`, `-1.5` y `chatgpt-image-latest` se apagan el 1-dic-2026. Avisos de ~6 meses. |
| **gpt-image-2.5-sunburst** (OpenAI) | GA. Snapshot `2026-09-08`. | Igual que flare por token y por calidad. | Igual que flare. | **1232 (#1)** en `max`. | Igual que flare. | Más lento: ~14 s low, 19 s medium, 42 s high [no verificado]. Sugieren *timeout* de 360 s [opinión]. | Igual que flare. | Igual que flare. |
| gpt-image-2 (OpenAI) | Vigente; "legacy" según terceros [no verificado]. | $0.041 por página medium 1024x1536, el triple de flare. | 16 | 1183 (#5) en high | — | ~63 s medium [no verificado] | Igual que flare | Ya superado por 2.5: no hay razón para usarlo. |
| **Nano Banana 2.1** (Google; Gemini API y Vertex AI) | **GA desde el 6-oct-2026.** | $0.0336 por imagen 1K y $0.0504 por 2K, más entrada y *thinking*. Batch al 50 %. | 14 imágenes; **consistencia de hasta 4 personajes**. | **1201 (#3)** | Para la versión anterior (NB2), un tercero reporta "variable line quality" [opinión]. Para 2.1 no hay dato. | No publicada; la ficha cita "occasional slowness or timeout" [no verificado]. | Gemini API de pago: no entrena, guarda logs de abuso por tiempo limitado. **Vertex AI: retención cero posible.** | Medio: `gemini-2.5-flash-image` se apagó el 2-oct-2026, a ~13 meses de su lanzamiento. Vertex promete ≥ 12 meses desde GA. |
| Nano Banana 2 (`gemini-3.1-flash-image`) | GA desde el 28-may-2026; retiro "May 28, 2027 or later". | $0.067 por imagen 1K. Vertex Flex: $30/M de salida (≈ $0.034). | 14 / 4 personajes | 1149 (#14) | Ver la fila anterior | ~20 s [no verificado] | Igual que 2.1 | Google ya recomienda pasar a 2.1. |
| Nano Banana 2 Lite (`gemini-3.1-flash-lite-image`) | GA desde el 23-jun-2026 | $0.0336 por imagen, solo 1K | 14 imágenes, pero **la consistencia de personaje figura como "N/A"**. Google: "Not optimized for multiple reference inputs". | 1098 (#26) | — | ~4 s [no verificado] | Igual | — |
| Nano Banana Pro (`gemini-3-pro-image`) | Vigente | $0.134 por imagen 1K/2K | 14 imágenes / **5 personajes** | 1161 (#11) | — | — | Igual | — |
| **Muse Image** (Meta; Meta Model API, y también fal, Runway y OpenRouter) | En producción desde el 28-ago-2026 [no verificado si es GA]. | **$0.01 por imagen**, referencias incluidas. | 1–10 [no verificado] | **1178 (#6)**; en estilo, 1164 (#4). | Sin datos. Es un modelo "agentic": planifica y puede buscar en la web antes de dibujar. | Sin datos. | "Standard Services": no entrena. "Contributor Services": sí entrena. Hay una política geográfica de uso. | Desconocido: tiene 2 meses. |
| MAI-Image-2.6-Flash (Microsoft Foundry) | **Public preview** desde el 4-sep-2026 | ~$0.0195 por imagen [no verificado] | 5 | 1154 (#13); la versión no-Flash, 1172 (#7) | Sin datos | "2.8x faster than GPT-Image-2-Medium" [dato del fabricante] | Azure [no verificado] | Riesgo propio del *preview*. |
| Seedream 5.0 Pro (BytePlus ModelArk) | Vigente (28-jun-2026) | $0.045 por imagen (≤ 2.36 MP) más $0.003 por referencia extra | 10 | 1169 (#8) | Sin datos | **110–130 s** [no verificado] | No entrena sin autorización. **Lo que dispara el filtro se guarda 180 días en Malasia.** | Sin deprecaciones anunciadas [no verificado]. |
| Seedream 5.0 Lite y Flash (BytePlus) | Vigentes (ene y sep 2026) | $0.035 y $0.018 [no verificado] | 10 | Lite 1071 (#34); Flash sin dato | Sin datos | Flash 14–20 s [no verificado] | Igual | — |
| Qwen-Image-3.0 / 3.0-Pro (Alibaba Model Studio, Singapur) | Vigentes; las versiones `qwen-image-edit` ya son "legacy". | $0.03 / $0.04 por imagen más $0.003 por entrada | [no verificado] | 1091 (#30) / 1104 (#24) | Sin datos | Sin datos | [no verificado] | — |
| FLUX 3 Image / **FLUX 3 Image Klein** (BFL) | Lanzados el 1-oct y el 15-oct-2026 | $0.048 / **$0.009** por imagen 1K | 10 | 1119 (#21) / 1073 (#33) | Sin datos | Klein es rápido (16 pasos) [no verificado] | **Licencia para entrenar con inputs y outputs. Prohíbe imágenes de menores.** | **Muy alto:** deprecación de FLUX Pro 1.0 con 28 días de aviso, y la API de *finetuning* cerró "sin migración". |
| Ideogram 4.5 | Vigente | ~$0.22 por imagen en High [no verificado: AA]; la página oficial de precios no cargó. | *Character reference* | 1099 (#25) | Una prueba de terceros dio 3.8/5 a Ideogram 3.0 [opinión] | — | — | — |
| Recraft V4.1 | Vigente | $0.035 (Flash $0.007); *image-to-image* $0.04; vectorizar $0.01 | Sin multi-referencia de identidad | No figura en el top de identidad | Fuerte en vector [opinión] | — | — | Útil solo para **vectorizar** páginas, no para personajes. |
| Runway API (gen4_image y reventa) | Vigente | gen4_image a $0.05 (720p) / $0.08 (1080p). También revende `muse_image` a $0.01, `nano_banana_2.1` a $0.04 por 1K y flare `medium` a $0.05 más $0.01 por referencia. | gen4: [no verificado] | Sin dato para gen4 | — | — | — | Le pone margen a OpenAI; solo tiene sentido como vía de acceso a Muse. |
| Agregadores: fal.ai y Replicate | — | fal cobra Muse a $0.01. | — | — | — | — | **fal guarda inputs y outputs por defecto** (se desactiva con la cabecera `X-Fal-Store-IO: 0`). **Replicate borra los datos de la API a la hora.** | Útiles para llegar a modelos abiertos o nuevos sin otra cuenta, pero cada uno exige su propio documento D27. |

Otros que AA pone fuertes en identidad, pero caros o con poco dato: Krea 3 Ultra (1184, $0.27 por imagen), Grok Imagine Image 2.0 (1158, $0.06), Luma UNI 1 Max (1128, $0.10) y HunyuanImage 3.5 Preview ($0.024). Ninguno justifica una evaluación ahora [estimación mía].

---

## 3. Costo de generación por libro

En dólares, sin reintentos (sumar ~4 %). "Peor" = todos los personajes en todas las páginas. Script del cálculo: `/tmp/claude-0/-home-claude/49e4c1a2-5827-511f-89d8-f0bc3b6da6f9/scratchpad/calc/cost.py` (scratchpad, no está en el repo).

| Estrategia | 3 personas (peor) | 3 personas (típico) | 5 personas (peor) | 5 personas (típico) | ≤ $1 |
|---|---|---|---|---|---|
| Hoy: `gpt-image-1-mini` medium (medido) | — | 0.53 | — | — | sí, pero se apaga el 1-dic |
| flare medium en ambos pasos, todas las referencias | 1.02 | 0.83 | 1.49 | 1.11 | **no** con 5 |
| Ídem, con fotos a 1536 px (como hoy) | 1.05 | 0.87 | 1.55 | 1.18 | no |
| Personajes en high y páginas en medium (flare) | 1.14 | 0.95 | 1.69 | 1.31 | no |
| Páginas flare en `low` | 0.88 | 0.70 | 1.36 | 0.98 | no con 5 (peor) |
| **Recomendada:** sunburst medium (personajes) + flare medium (páginas), **máximo 2 referencias por página** (hoja compuesta si hay ≥ 3 personajes) | **≤ 0.82** | 0.82 (0.62 si casi todas las escenas tienen 1 personaje) | **≤ 0.90** | 0.80 | **sí** |
| Ídem, siempre con una sola hoja compuesta | 0.72 | 0.72 | 0.80 | 0.80 | sí |
| Ídem, hoja compuesta y páginas en `low` | 0.59 | 0.59 | 0.67 | 0.67 | sí |
| Nano Banana 2.1 1K, *thinking* minimal (~300 tokens [estimación mía]) | 1.12 | 1.09 | 1.29 | 1.21 | **no** |
| Nano Banana 2.1 1K, *thinking* medium por defecto (~1,000 tokens [estimación mía]) | 1.27 | 1.23 | 1.44 | 1.36 | no |
| Nano Banana 2.1 2K (mejor para imprimir) | 1.58 | 1.54 | 1.78 | 1.70 | no |
| Nano Banana 2 Lite 1K | 0.95 | 0.94 | 1.03 | 1.02 | justo, pero no sirve para referencias |
| **Muse Image** en ambos pasos | **0.27** | 0.27 | **0.29** | 0.29 | sí |
| **Híbrido: OpenAI high para personajes + Muse para páginas** | **0.48** | 0.48 | **0.64** | 0.64 | sí |
| MAI-Image-2.6-Flash en ambos pasos (~1,000 tokens por referencia [estimación mía]) | 0.75 | 0.69 | 0.93 | 0.81 | sí (*preview*) |
| Híbrido: OpenAI para personajes + MAI-Flash para páginas | 0.79 | 0.73 | 0.99 | 0.88 | sí, justo |
| Seedream 5.0 Pro | 1.38 | 1.31 | 1.62 | 1.48 | no |
| Seedream 5.0 Flash (sin contar referencias [no verificado]) | 0.49 | 0.49 | 0.52 | 0.52 | sí |
| Qwen-Image-3.0 | 1.05 | 0.98 | 1.28 | 1.14 | no |
| FLUX 3 Image Klein 1.5k (vetado por términos) | 0.30 | 0.30 | 0.32 | 0.32 | — |

De dónde sale el **≤ $0.82 / ≤ $0.90** de la estrategia recomendada:
- **Por página:** como máximo 2 referencias de 1,024 tokens (2,048 tokens) o una hoja de 1536x1024 (~1,536 tokens [no verificado]). Más 500 tokens de texto y 343 de salida, son **≤ $0.0292**.
- **Por personaje:** 3 fotos de 1,024 tokens, más texto, más 439 de salida, son **~$0.040**.
- **Libro:** 24 × 0.0292 + P × 0.040 da $0.82 con P = 3 y $0.90 con P = 5.

Con la mitad de las páginas en Batch no se gana nada útil: el Batch de OpenAI es asíncrono, hasta 24 h, y el producto entrega en minutos.

---

## 4. Estrategias híbridas evaluadas

1. **Sunburst para personajes y flare para páginas: recomendada.** Mismo precio por token y mismos tokens por calidad [no verificado: medición de APIYI]. Sunburst es algo más fiel (1232 contra 1224) y más lento, pero el paso 1 son solo 3–5 llamadas en paralelo. No cuesta más y no añade proveedor.
2. **Límite de 2 referencias, con hoja compuesta: recomendada.** Es la única palanca grande en OpenAI, porque cada referencia cuesta casi lo mismo que la imagen que sale. Bajar la resolución de cada referencia por separado no ahorra nada: toda imagen ≤ 1024² cuenta 1,024 tokens [no verificado]. Combinar sí ahorra. El riesgo es perder detalle por personaje cuando hay 4–5 en una hoja; eso tiene que medirlo la prueba real.
3. **Páginas en `low`:** ahorran ~$0.13 por libro. El line-art no necesita gradientes y quizá aguante, pero no hay evidencia pública. Va a la prueba A/B.
4. **Personajes en OpenAI y páginas en Muse:** cuesta $0.48–0.64. Es la mejor reducción de costo **y de riesgo legal**, porque Muse solo recibe dibujos de línea, nunca fotos de menores. Depende de D27 y de la prueba de line-art.
5. **Personajes en Nano Banana 2.1 y páginas en OpenAI:** no ahorra ($1.02–1.50), porque en OpenAI el costo está en las páginas. Se descarta.
6. **API de Responses con caché de imágenes ($2/M):** en teoría, abarataría 4 veces las referencias repetidas en 24 páginas. Pero la guía dice que el caché solo aplica a la herramienta de imagen de Responses, que el `usage` **no permite verificar** los aciertos de caché, y que Responses añade los tokens del modelo principal. No se recomienda contar con eso.
7. **Vectorizar las páginas con Recraft ($0.01 por imagen):** solo sirve si la QA local (`normalizeLineArt` / `inspectLineArt`) no basta para imprimir nítido. Añadiría $0.24 por libro. No hace falta hoy.

---

## 5. Recomendación

### Principal: OpenAI `gpt-image-2.5` (sunburst para personajes, flare para páginas)

- **Configuración:**
  - Personajes: snapshot `gpt-image-2.5-sunburst-2026-09-08`, `quality: "medium"`, 1024x1024, con 1–3 fotos redimensionadas a ≤ 1024 px.
  - Páginas: `gpt-image-2.5-flare-2026-09-08`, `quality: "medium"`, 1024x1536.
  - Como máximo 2 imágenes de referencia por llamada: solo los personajes presentes, y una hoja compuesta si son 3 o más.
- **Costo:** ≤ $0.82 con 3 personas y ≤ $0.90 con 5 (más ~4 % de reintentos). Típico: ~$0.80–0.82. Baja a ~$0.62–0.70 si la mayoría de las escenas tiene un solo personaje. Es entre 1.2 y 1.7 veces lo de hoy, pero dentro del tope.
- **Por qué:**
  - Es el líder en identidad y viene del mismo proveedor ya auditado (`docs/proveedores/openai.md`, con veredicto D27 "permitido con condiciones").
  - Cambia poco el código.
  - Es compatible con retención cero.
  - Es el más fuerte en line-art según la evidencia disponible [opinión].
  - Debería ser más rápido que hoy: ~10 s por imagen medium frente al total actual de 104–110 s por libro [no verificado].
- **Condiciones:**
  - La prueba real del otro agente tiene que confirmar el parecido en `medium` (AA midió en `max`).
  - Hay que subir de tier en OpenAI antes de Navidad. Con 20 IPM en Build, 27 imágenes tardan ≥ 81 s y dos libros simultáneos hacen cola.

### Plan B: Meta Muse Image

Se usa para páginas, y para personajes si pasa la prueba con fotos.

- **Costo:** $0.27–0.29 por libro solo con Muse, o $0.48–0.64 en el híbrido con OpenAI para los personajes.
- **Por qué:** es el único proveedor que no es OpenAI y que junta identidad top-6, hasta 10 referencias (cubre a 5 personas) y un costo muy por debajo del tope. Además, en el híbrido saca las fotos de menores del segundo proveedor.
- **Antes de abrir cuenta (D27):**
  1. `legal-compliance` revisa los términos de Meta Model API: Standard frente a Contributor, la política geográfica (¿Guatemala?), menores y semejanza.
  2. Confirmar si se puede **desactivar la búsqueda web** del modo "agentic". No queremos que el modelo busque nada con datos de una familia.
  3. Probar line-art y resolución de salida.

### Respaldo de emergencia: Google Nano Banana 2.1 en Vertex AI

- **Cuándo:** si OpenAI bloquea la cuenta y Muse no pasó la revisión.
- **Por qué este:** GA, 3.º en identidad, retención cero alcanzable en Vertex, y Google se compromete a ≥ 12 meses antes de retirar un modelo. Además, ya existe el *stub* `providers/nanobanana.ts`.
- **Costo:** ~$1.09–1.27 por libro con 3 personas, por encima del tope. Aceptarlo mientras dure la emergencia o subir el precio.
- **Límites:**
  - Con 5 personas supera los 4 personajes documentados: hay que usar la hoja compuesta.
  - A 1K, 2:3 sale en 848x1264 (menos que nuestro 1024x1536). El 2K cuesta +50 %.
- **Usar Vertex y no la Gemini API:** la Gemini API prohíbe usarse en servicios "likely to be accessed by individuals under the age of 18" (sección 6).

---

## 6. Cláusulas vistas de paso sobre menores y fotos de personas reales

Esto no es la revisión legal: solo marca lo que vi al pasar. Le toca a `legal-compliance` (D27).

| Proveedor | Cláusula (cita) | Enlace |
|---|---|---|
| **Black Forest Labs** | Prohibido "Upload images, videos or personal data to the FLUX Services or FLUX AI Models relating to individuals under the age of 18". Exige además "informed, documented consent" de cada persona identificable. **Bloqueante.** | https://bfl.ai/legal/developer-terms-of-service |
| Black Forest Labs | "the Company may use Inputs and Outputs to train and improve its artificial intelligence models" | https://bfl.ai/legal/flux-api-service-terms |
| **Google Gemini API** | "You must be 18 years of age or older to use the APIs. You also will not use the Services as part of a website, application, or other service ... that is directed towards or is likely to be accessed by individuals under the age of 18." Términos vigentes desde el 23-mar-2026. | https://ai.google.dev/gemini-api/terms |
| Google Gemini API | Guía de imagen: "Make sure you have the necessary rights to any images you upload." | https://ai.google.dev/gemini-api/docs/image-generation |
| Google Gemini API | Capa gratuita: los datos se usan para mejorar productos. **No usar la capa gratuita.** | https://ai.google.dev/gemini-api/docs/pricing |
| OpenAI | "Image and file inputs are scanned for CSAM content upon submission. If the classifier detects potential CSAM content, the image will be retained for manual review, even if Zero Data Retention ... is enabled." Una foto familiar inocente (baño, piscina) puede quedar retenida. | https://developers.openai.com/api/docs/guides/your-data |
| OpenAI | Semejanza: ya citada en `docs/proveedores/openai.md` ("express consent and all necessary rights"). | https://openai.com/policies/service-terms/ |
| Meta Model API | Contributor Services: "You must not submit sensitive, confidential, or personal information". Además, el uso está limitado por la "Meta Model API Model Designation and Geographic Use Policy". Términos actualizados el 9-oct-2026. | https://llama.developer.meta.com/legal/terms-of-service |
| BytePlus ModelArk | "input and output triggered by the filter are retained for 180 days in Malaysia". Página actualizada el 10-sep-2026. | https://docs.byteplus.com/en/docs/ModelArk/BytePlus_ModelArk_Data_Processing |
| fal.ai | "By default, fal stores the inputs and outputs of your API requests". Se desactiva con `X-Fal-Store-IO: 0`. | https://fal.ai/docs/documentation/model-apis/inference/payloads.md |

---

## 7. Notas para `arquitecto` (no se cambió nada)

- En `providers/openai.ts`, la función `cost()` solo distingue `mini` del resto. Para cualquier otro modelo usa los precios de `gpt-image-1` ($40 de salida y $10 de imagen de entrada), así que con flare **sobreestimará el costo ~25–33 %**. Hay que añadir la tarifa $5/$8/$30 de la familia 2.5. Lo mismo pasa con `IMAGE_COST_USD_CENTS` en `packages/config/src/colorear.ts`.
- **No enviar `input_fidelity`** a la familia 2/2.5: la API no lo permite. Hoy no se envía.
- Seguir enviando `quality` explícito, porque el valor por defecto de 2.5 es `auto`, que puede subir a `max`.
- El *timeout* de 100 s alcanza para flare. Para sunburst conviene subirlo [opinión de terceros: 360 s].
- Reducir las fotos de referencia a ≤ 1024 px solo en la llamada a la API: ahorra ~$0.004 por foto [no verificado].
- Sigue pendiente el `safety_identifier` (`docs/proveedores/openai.md`, condición 4).
- La hoja compuesta de personajes se puede armar en local con `sharp`, igual que `composeCoverFromCharacters`.

## 8. Qué debe medir la prueba real (para el otro agente)

1. **Costo real** con `usage` de flare en `medium` y en `low`, separando: tokens de entrada por foto (a 1024 y 1536 px), tokens por referencia (separada frente a hoja compuesta) y salida en 1024x1536.
2. **Parecido:** en 5–10 familias, que Juan califique a ciegas personajes de mini, de sunburst `medium` y de sunburst `high`.
3. **Line-art:** tasa de aprobación de `inspectLineArt` y número de reintentos por libro.
4. **Latencia p50/p95 por libro** con concurrencia 12, y el tier de OpenAI con que se midió.
5. **Bloqueos de moderación** con fotos reales de niños, y si `moderation: "low"` cambia algo.
6. **Portada con 5 personajes:** si la hoja compuesta mantiene a cada uno reconocible.

---

## Fuentes (consultadas el 25-oct-2026)

**Oficiales**
- OpenAI, deprecaciones (entrada del 2-jun-2026: apagado del 1-dic-2026; `gpt-image-1` apagado el 23-oct-2026): https://developers.openai.com/api/docs/deprecations.md
- OpenAI, precios (tabla Standard y Batch; nota sobre caché solo en Responses): https://developers.openai.com/api/docs/pricing.md
- OpenAI, ficha de gpt-image-2.5-flare (precios y límites Build/Launch/Grow): https://developers.openai.com/api/docs/models/gpt-image-2.5-flare
- OpenAI, ficha de gpt-image-2.5-sunburst: https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst.md
- OpenAI, ficha de gpt-image-1-mini (tabla por imagen; "Deprecated"): https://developers.openai.com/api/docs/models/gpt-image-1-mini
- OpenAI, guía de generación de imágenes (calidades, tamaños, caché, limitaciones, `input_fidelity`): https://developers.openai.com/api/docs/guides/image-generation.md
- OpenAI, calculadora de tokens (fórmula de tokens de salida, extraída del código de la página): https://developers.openai.com/_astro/GptImageTokenCalculator.react.Dn_Him8q.js
- OpenAI, controles de datos (retención cero en `/v1/images` para la familia 2.5; excepción CSAM): https://developers.openai.com/api/docs/guides/your-data
- OpenAI, respuesta del soporte en el foro (caché no aplica a edits; 21 y 24-sep-2026): https://community.openai.com/t/gpt-image-2-and-2-5-zero-cached-image-inputs-despite-reusing-reference-images/1396063
- Google, precios de la Gemini API (actualizada el 22-oct-2026): https://ai.google.dev/gemini-api/docs/pricing
- Google, generación de imágenes con Gemini (selección de modelos, límites de referencias, *thinking*, resoluciones; actualizada el 9-oct-2026): https://ai.google.dev/gemini-api/docs/image-generation
- Google, ficha de Nano Banana 2.1 en la Gemini API (6-oct-2026): https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1
- Google, términos adicionales de la Gemini API (actualizados el 28-abr-2026): https://ai.google.dev/gemini-api/terms
- Google Cloud, ficha de Nano Banana 2 (GA el 28-may-2026; 1,120 tokens por imagen de entrada; actualizada el 22-oct-2026): https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-image
- Google Cloud, ficha de Nano Banana 2 Lite (GA el 23-jun-2026): https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-lite-image
- Google Cloud, ficha de Nano Banana 2.1 (GA el 6-oct-2026): https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/nano-banana-2-1
- Google Cloud, precios de Vertex AI (Standard, Priority, Flex/Batch; "Nano Banana 2.1 does not support Flex"): https://cloud.google.com/vertex-ai/generative-ai/pricing
- Google Cloud, retención cero en Vertex (actualizada el 22-oct-2026): https://docs.cloud.google.com/vertex-ai/generative-ai/docs/data-governance
- Google, límites de uso de la Gemini API (actualizada el 15-oct-2026): https://ai.google.dev/gemini-api/docs/rate-limits
- Black Forest Labs, precios: https://docs.bfl.ai/quick_start/pricing y https://bfl.ai/pricing
- Black Forest Labs, notas de versión (FLUX 3 Image el 1-oct-2026, Klein el 15-oct-2026, deprecaciones de oct-2025): https://docs.bfl.ml/release-notes.md
- Black Forest Labs, FLUX 3 Image Klein: https://docs.bfl.ml/flux_3/flux3_image_klein.md
- Black Forest Labs, términos para desarrolladores: https://bfl.ai/legal/developer-terms-of-service
- Black Forest Labs, términos del servicio de API: https://bfl.ai/legal/flux-api-service-terms
- BytePlus, Seedream 5.0 Pro ("starting at $0.045/image ... first reference image is free"): https://www.byteplus.com/en/product/seedream
- BytePlus, tratamiento de datos de ModelArk (10-sep-2026): https://docs.byteplus.com/en/docs/ModelArk/BytePlus_ModelArk_Data_Processing
- Alibaba Cloud, qwen-image-3.0-pro (11-oct-2026): https://www.alibabacloud.com/help/en/model-studio/qwen-image-3-0-pro
- Alibaba Cloud, qwen-image-3.0: https://www.alibabacloud.com/help/en/model-studio/qwen-image-3-0
- Alibaba Cloud, precios de Model Studio (22-oct-2026): https://www.alibabacloud.com/help/en/model-studio/model-pricing
- Meta, Muse Image ("$0.01/image"): https://developer.meta.com/ai/models/muse-image/
- Meta, términos de Meta Model API / Llama API (9-oct-2026): https://llama.developer.meta.com/legal/terms-of-service
- Microsoft AI, MAI-Image-2.6 (4-sep-2026; "Public Preview"): https://microsoft.ai/news/pushing-the-quality-cost-frontier-with-mai-image-2-6
- Recraft, precios de la API: https://www.recraft.ai/docs/api-reference/pricing
- Runway, precios de la API: https://docs.dev.runwayml.com/guides/pricing/
- Ideogram, precios de la API (los precios no cargaron): https://ideogram.ai/api-pricing/
- fal.ai, almacenamiento de payloads: https://fal.ai/docs/documentation/model-apis/inference/payloads.md
- Replicate, retención de datos: https://replicate.com/docs/topics/predictions/data-retention.md

**Terceros (marcadas [no verificado] u [opinión] en el texto)**
- Artificial Analysis, ranking de edición (general y por categoría, incluida "Identity Preserving Edit"): https://artificialanalysis.ai/image/leaderboard/editing
- APIYI, gpt-image-2 (tokens por referencia, latencias de 2.5 medidas el 9-sep-2026): https://docs.apiyi.com/en/api-capabilities/gpt-image-2/overview.md
- APIYI, lanzamiento de gpt-image-2.5: https://docs.apiyi.com/en/news/gpt-image-2-5-launch.md
- CometAPI, costo por imagen de 2.5 (16-sep-2026): https://www.cometapi.com/gpt-image-2-5-price-api-cost-per-image/
- Segmind, flare frente a sunburst (latencias y costos medidos; 9-sep-2026): https://blog.segmind.com/gpt-image-2-5-api-the-ultimate-guide-to-flare-and-sunburst/
- fal.ai, sunburst edit (hasta 16 referencias; costo por referencia): https://fal.ai/models/openai/gpt-image-2.5/sunburst/edit/playground
- Developers Digest, tabla de modelos de OpenAI (18-oct-2026): https://www.developersdigest.tech/models/image-generation/openai
- eesel, Nano Banana 2.1 y el costo del *thinking* (8-oct-2026): https://www.eesel.ai/blog/nano-banana-2-1
- eesel, precios de Nano Banana 2 Lite (3-jul-2026): https://www.eesel.ai/blog/nano-banana-2-lite-pricing
- Let's Data Science, lanzamiento de Nano Banana 2.1 (6-oct-2026): https://letsdatascience.com/news/google-rolls-out-nano-banana-21-image-model-c6ac3b89
- CometAPI, Nano Banana 2.1 frente a GPT Image 2.5 (8-oct-2026): https://www.cometapi.com/ja/nano-banana-2-1-vs-gpt-image-2-5/
- APIYI, Seedream (precios, referencias y latencias): https://docs.apiyi.com/en/api-capabilities/seedream-image/overview.md
- Atlas Cloud, precio de Seedream 5.0 Pro (6-ago-2026): https://www.atlascloud.ai/blog/ai-updates/seedream-5-0-pro-price
- LLM Reference, Seedream 5.0 Flash (17-oct-2026): https://www.llmreference.com/model/seedream-v5-flash/byteplus
- RuntimeWire, Muse Image en Meta Model API (28-ago-2026): https://runtimewire.com/article/meta-ships-muse-image-api-at-one-cent-per-image
- Unite.AI, Muse Image en fal (1-sep-2026): https://www.unite.ai/metas-agentic-muse-image-model-lands-on-fal-for-developers/
- AI/ML API, parámetros del edit de Muse (1–10 referencias): https://docs.aimlapi.com/api-references/image-models/meta/muse-image-edit.md
- WaveSpeed, Muse Image (5-sep-2026): https://wavespeed.ai/blog/ai-models/meta-muse-image-api/
- Windows Report, precios de MAI-Image-2.6-Flash (5-sep-2026): https://windowsreport.com/microsofts-new-mai-image-2-6-flash-is-more-than-twice-as-fast-and-far-cheaper/
- APIYI, MAI con varias referencias (máximo 5; 7-oct-2026): https://docs.apiyi.com/en/live/2026-10/mai-image-multi-reference.md
- FluxNote, generadores para páginas de colorear (6-may-2026): https://fluxnote.io/guides/best-ai-image-generator-for-coloring-pages
