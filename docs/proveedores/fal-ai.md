# fal.ai: plataforma de inferencia (agregador de modelos de imagen)

Veredicto D27: **RIESGO ALTO** para Pintoria. Solo utilizable con modelos que ya pasaron D27 y con retención cero confirmada por escrito. Jinglo: no aplica, no envía fotos a fal.
Lectura: 25-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Motivo central: fal es un intermediario. Cada modelo que aloja trae sus propios términos encima de los de fal, y la retención cero no es la configuración por defecto. Las condiciones propias de fal (edad 18, uso de datos de uso para sus modelos de IA, entrenamiento en "modelos excluidos") dejan puntos ambiguos para fotos de menores.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Terms of Service | https://fal.ai/terms | "Last Updated 8 Sep 2026" |
| Acceptable Use Policy | https://fal.ai/legal/acceptable-use-policy | fecha no visible [no verificado] |
| API Services Terms | https://fal.ai/legal/api-services | sin fecha propia visible [no verificado] |
| Data Processing Addendum | https://fal.ai/legal/data-processing-addendum | 31-jul-2026 |
| Privacy Policy | https://fal.ai/privacy | 22-jul-2026 |
| Documentación de retención y cabeceras (`X-Fal-Store-IO`, ciclo de vida de objetos) | https://docs.fal.ai/documentation/assets/retention y https://docs.fal.ai/model-apis/faq | sin fecha visible |

## Citas textuales

**Edad**
- Terms of Service: el cliente debe tener 18 años o más y los usuarios finales también. Pintoria vende a adultos; el niño no usa el servicio. Pero el texto exige que el usuario final sea mayor de 18 y no aclara qué pasa con un menor que aparece en una foto: ambiguo.

**Uso de datos por fal**
- Terms of Service: los "Usage Data" derivados de la entrada del cliente pueden usarse para los "AI models" de la empresa. No queda claro si una foto cuenta como dato derivado: [no verificado].

**Contenido y entrenamiento en la API**
- API Services Terms: el contenido del cliente se envía a los proveedores de modelos de terceros que fal aloja. fal no entrena con él, salvo en los llamados "Excluded Models" (cuya marca es "Pending Enterprise Ready"), a los que tampoco se aplica el DPA. Si una foto de menor pasa por un modelo excluido sin querer, el DPA no cubre.

**Propiedad de la salida**
- Los términos cubren la propiedad de la entrada y el uso del contenido de salida, pero no declaran de forma expresa quién es dueño de la salida: [no verificado]. Depende además de los términos de cada modelo.

**Política de uso**
- Acceptable Use Policy §7: prohíbe datos personales, datos biométricos y semejanza en violación de los derechos de las personas. Una foto con consentimiento no la viola, pero el texto no aclara el caso de menores.

**Retención**
- La retención cero no es la configuración por defecto. Se logra con la cabecera `X-Fal-Store-IO: 0`, la preferencia de ciclo de vida de objetos (`X-Fal-Object-Lifecycle-Preference`), y confirmación del equipo de ventas. Los archivos en CDN duran por defecto al menos 7 días.

**País del titular**
- Solo hay una cláusula de sanciones. Guatemala no está restringida.

**Acuerdo de datos**
- DPA del 31-jul-2026 con cláusulas contractuales tipo.

## Veredicto por punto (Pintoria)

| Punto | Veredicto | Razón |
|---|---|---|
| Fotos de menores subidas por su padre o madre | **RIESGO ALTO** | Sin cláusula para el caso; depende del modelo y de la AUP |
| Imágenes de personas reales | **PERMITIDO con condiciones** | Consentimiento; el modelo puede imponer más |
| Contenido de IA vendido; propiedad o licencia | **RIESGO ALTO** | No hay declaración expresa; depende de cada modelo |
| Retención y entrenamiento | **RIESGO ALTO** | Retención cero no es por defecto; "Excluded Models" sí pueden entrenar; Usage Data para sus modelos |
| País del titular: Guatemala | **PERMITIDO** | Solo sanciones |
| Atribución o marca de agua obligatoria | **PERMITIDO** a nivel de fal; depende del modelo | Sin "Powered by" en lo leído |

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **RIESGO ALTO** | Intermediario; términos apilados; retención cero sin confirmar |
| Jinglo | No aplica | No hay llamada a fal |

## Condiciones si Juan decide usar fal

1. Solo modelos que ya tengan documento D27 con veredicto permitido. Hoy, ninguno alojado en fal: FLUX es PROHIBIDO (ver `black-forest-labs.md`), Seedream es PROHIBIDO en EE. UU. (ver `byteplus.md`), Ideogram y Runway son PROHIBIDO. Si fal aloja un modelo de Recraft u OpenAI, es más sencillo contratar directamente con ellos.
2. Nunca un "Excluded Model".
3. Retención cero confirmada por escrito con ventas, más las dos cabeceras en cada llamada.
4. Firmar el DPA antes de enviar una foto real.
5. Casilla de consentimiento y demás condiciones iguales a las de `openai.md` (1 a 5).

## Plan B

Contratar directamente con OpenAI (ver `openai.md`) o Recraft (ver `recraft.md`), sin intermediario.

## No verificado

- Fecha de la Acceptable Use Policy y de los API Services Terms.
- Si una foto cuenta como "Usage Data".
- Quién es dueño de la salida.
- Lista de "Excluded Models" vigente.
- Si fal acepta retención cero para una cuenta pequeña.
