# Replicate: plataforma de inferencia (agregador de modelos de imagen)

Veredicto D27: **RIESGO ALTO** para Pintoria. Jinglo: no aplica, no envía fotos a Replicate.
Lectura: 25-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Motivo central: como fal, es un intermediario. Su contrato dice que la propiedad de la salida depende de los términos de terceros de cada modelo, y que recopila "Resultant Data" anonimizados y agregados. Los modelos FLUX quedan bajo el contrato de BFL, que es PROHIBIDO.
Nota de propiedad: Cloudflare anunció la adquisición de Replicate el 17-nov-2025; los términos leídos siguen a nombre de Replicate, LLC. Que el contrato cambie por la integración: [no verificado].

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Terms of Service | https://replicate.com/terms | "Last Update 1 Apr 2026" |
| Acceptable Use Policy | https://replicate.com/acceptable-use-policy | fecha no visible [no verificado] |
| Privacy Policy | https://replicate.com/privacy | "Last Updated: April 1, 2026" |
| Documentación de retención de predicciones | https://replicate.com/docs/topics/predictions/data-retention | sin fecha visible |

## Citas textuales

**Propiedad de la salida**
- Terms of Service §5.1: el cliente es dueño de la salida "subject to any Third Party Terms". Cada modelo puede tener términos propios que limiten o cambien eso.

**Datos recopilados por Replicate**
- Terms of Service: Replicate recopila "Resultant Data", anonimizados y agregados. Qué tan anonimizados quedan los rasgos de una foto de menor: [no verificado].

**Política de uso aceptable**
- La AUP veta engañar a la gente sobre si la salida es generada por IA. Nuestra revelación genérica (D23) es compatible.
- Edad mínima de 18 años para el titular.

**Modelos FLUX**
- El uso de la API de FLUX se rige por el contrato de BFL. Como los términos de BFL prohíben fotos de menores y permiten entrenar con las entradas, Pintoria no puede usarlo por esta vía (ver `black-forest-labs.md`).

**Retención**
- Las predicciones de la API se eliminan automáticamente después de 1 hora, por defecto. Es corto, pero eso es lo de Replicate; no dice nada de lo que haga el modelo de tercero.

**Privacy Policy (1-abr-2026)**
- Replicate no recopila datos de menores de 16 años como titulares de cuenta. No cubre fotos de menores subidas por un adulto.

**País del titular**
- Solo hay una cláusula de exportación y sanciones. Guatemala no está restringida.

## Veredicto por punto (Pintoria)

| Punto | Veredicto | Razón |
|---|---|---|
| Fotos de menores subidas por su padre o madre | **RIESGO ALTO** | Sin cláusula propia; depende del modelo de tercero |
| Imágenes de personas reales | **PERMITIDO con condiciones** | Consentimiento; el modelo puede imponer más |
| Contenido de IA vendido; propiedad o licencia | **RIESGO ALTO** | "Subject to any Third Party Terms" |
| Retención y entrenamiento | **RIESGO ALTO** | Eliminación a 1 hora por defecto, pero "Resultant Data" y modelos de terceros |
| País del titular: Guatemala | **PERMITIDO** | Solo exportación |
| Atribución o marca de agua obligatoria | **PERMITIDO** a nivel de Replicate; depende del modelo | Sin "Powered by" en lo leído |

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **RIESGO ALTO** | Intermediario; términos apilados; los modelos disponibles tienen veredictos negativos |
| Jinglo | No aplica | No hay llamada a Replicate |

## Condiciones si Juan decide usar Replicate

1. Solo modelos que ya tengan documento D27 con veredicto permitido (hoy ninguno alojado ahí; ver `fal-ai.md` por la misma razón).
2. Leer los términos del modelo concreto antes de cada alta y anotar la cita aquí.
3. Confirmar por escrito el tratamiento de los "Resultant Data" y que no incluyen rasgos de fotos.
4. Casilla de consentimiento y demás condiciones iguales a las de `openai.md` (1 a 5).

## Plan B

Contratar directamente con OpenAI (ver `openai.md`) o Recraft (ver `recraft.md`), sin intermediario.

## No verificado

- Efecto de la adquisición por Cloudflare sobre los términos.
- Qué incluyen exactamente los "Resultant Data".
- Términos de modelos concretos de terceros.
- Medios de pago desde Guatemala.
