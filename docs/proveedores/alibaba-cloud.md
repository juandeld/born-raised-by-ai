# Alibaba Cloud Model Studio: Qwen-Image (generación y edición de imágenes)

Veredicto D27: **RIESGO ALTO** para Pintoria. Jinglo: no aplica, no envía fotos a Alibaba.
Lectura: 25-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Motivo central: los términos del producto permiten el procesamiento en cualquier instalación de Alibaba, la política de uso aceptable no se pudo leer (la página exige JavaScript) y no hay cláusula específica sobre fotos de menores. Por D27, lo que no se puede leer ni confirmar es riesgo alto: no se abre cuenta.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| International Product Terms (§4.48 Model Studio, Qwen) | https://www.alibabacloud.com/help/en/legal/latest/alibaba-cloud-international-website-product-terms-of-service-v-3-8-0 | v3.8.0, "Last Updated 23 Sep 2026" |
| Membership Agreement (§3.2(e)) | https://www.alibabacloud.com/help/en/legal/latest/alibaba-cloud-international-website-membership-agreement | sin fecha visible [no verificado] |
| Documentación de edición de imágenes Qwen-Image (regiones, retención, `watermark`) | https://www.alibabacloud.com/help/en/model-studio/qwen-image-edit-api.md y https://www.alibabacloud.com/help/en/model-studio/regions.md | sin fecha visible |
| Acceptable Use Policy | https://www.alibabacloud.com/help/en/legal/latest/alibaba-cloud-international-website-acceptable-use-policy | **no se pudo leer** (página solo con JavaScript) |

## Citas textuales

**Contenido del miembro, entrenamiento y salida**
- Product Terms §4.48.1(e): Alibaba no usa el Contenido del Miembro para desarrollar o mejorar los modelos sin consentimiento, y no reclama la salida. Este punto sería PERMITIDO. (Paráfrasis: leer la cláusula completa en el enlace.)
- Product Terms §4.48.1(b): el cliente garantiza que tiene el consentimiento para los datos que sube. La casilla parental del checkout lo cubre.

**Dónde se procesa (decide junto con la AUP)**
- Product Terms §4.48.1(viii): el contenido puede procesarse en cualquier lugar donde Alibaba tenga instalaciones. No hay promesa de región fija en los términos.
- Regiones del servicio: Singapur, EE. UU. (Virginia), Fráncfort, Tokio, Pekín y Hong Kong. La documentación de edición de imágenes de Qwen-Image lista solo endpoints de Singapur y Pekín. Los resultados se retienen 24 horas; las URL de ejemplo apuntan a almacenamiento en Shenzhen y Hangzhou. Dónde se guardan las fotos de entrada: [no verificado].

**Menores**
- Membership Agreement §3.2(e)(ii): prohíbe contenido "otherwise harmful to minors" (dañino para menores). No dice nada de que un padre suba fotos de sus hijos. Ambiguo.

**Etiquetado**
- Product Terms §4.48.1: el etiquetado del contenido de IA depende de lo que exija la ley aplicable. El parámetro `watermark` de la API tiene valor por defecto falso. No hay atribución obligatoria "Powered by" en lo leído.

**País del titular**
- Eligibilidad de un titular de Guatemala: [no verificado]. La lista de países de facturación de la cuenta internacional no se pudo consultar.

## Veredicto por punto (Pintoria)

| Punto | Veredicto | Razón |
|---|---|---|
| Fotos de menores subidas por su padre o madre | **RIESGO ALTO** | AUP ilegible; cláusula de contenido "dañino para menores" sin aclarar este caso |
| Imágenes de personas reales | **PERMITIDO con condiciones** | Exige consentimiento (§4.48.1(b)) |
| Contenido de IA vendido; propiedad o licencia | **PERMITIDO** | Alibaba no reclama la salida (§4.48.1(e)) |
| Retención y entrenamiento | **RIESGO ALTO** | No entrena sin consentimiento; pero procesamiento en cualquier instalación y almacenamiento en China sin confirmar |
| País del titular: Guatemala | **RIESGO ALTO** | No verificado |
| Atribución o marca de agua obligatoria | **PERMITIDO** | Sin atribución visible; marca opcional |

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **RIESGO ALTO** | AUP sin leer, ubicación de las fotos sin confirmar, fotos de menores sin aclarar |
| Jinglo | No aplica | No hay llamada a Alibaba |

## Condiciones si Juan decide seguir (no recomendado frente a OpenAI y Recraft)

1. Leer la AUP en un navegador (pedir a Juan o a `arquitecto`) y dejar la cita aquí antes de cualquier alta.
2. Región de Singapur o de EE. UU. (Virginia) fijada por contrato, con confirmación escrita de que las fotos de entrada no salen de ella.
3. Respuesta escrita de Alibaba sobre fotos de menores subidas por un padre, retención cero y entrenamiento.
4. Confirmar que una cuenta de Guatemala puede abrirse y pagar.
5. Abogado humano: tratar el envío de fotos de menores a un proveedor del grupo Alibaba, incluida la regla del DOJ (28 CFR Parte 202) [no verificado].

## Plan B

OpenAI `gpt-image-2.5` (ver `openai.md`) y Recraft con sus modelos propios (ver `recraft.md`).

## No verificado

- Texto de la AUP.
- Ubicación del almacenamiento de las fotos de entrada.
- Eligibilidad de un titular de Guatemala y medios de pago.
- Fecha del Membership Agreement.
- Aplicabilidad de la regla del DOJ de transferencias de datos.
