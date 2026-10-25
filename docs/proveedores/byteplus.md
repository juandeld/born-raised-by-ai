# BytePlus ModelArk: Seedream (ByteDance, generación y edición de imágenes)

Veredicto D27: **PROHIBIDO** para Pintoria en el mercado de EE. UU.; **RIESGO ALTO** si se vendiera solo en Reino Unido, España y México. Jinglo: no aplica, no envía fotos a BytePlus.
Lectura: 25-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Motivo central: los términos específicos del servicio de modelos dicen que no está disponible en Estados Unidos, e incluyen a los usuarios finales. Pintoria vende en EE. UU. y sus clientes son usuarios finales. Un pedido de EE. UU. con fotos enviadas a este servicio incumpliría el contrato.
Nota de método: las páginas de BytePlus son aplicaciones de una sola página sin texto en el HTML; se extrajo el texto desde el JSON de la propia página (`MDContent`).

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Specific Terms for Model Services (§2 disponibilidad) | https://docs.byteplus.com/en/docs/legal/docs-service-specific-terms | sin fecha propia visible |
| Disponibilidad de ModelArk por país | https://docs.byteplus.com/en/docs/ModelArk/availability | "Last Updated 21 Apr 2026" |
| AI Terms (§2.1 propiedad de la salida, §3.3 entrenamiento) | https://docs.byteplus.com/en/docs/legal/AI-Services-terms | sin fecha propia visible |
| Acceptable Use Policy (reemplaza a la GenAI AUP anterior) | https://docs.byteplus.com/en/docs/legal/docs-acceptable-use-policy | "Effective: Sep 30, 2026" |
| Data Processing Addendum | https://docs.byteplus.com/en/docs/legal/docs-data-processing-addendum | aplica a contratos vigentes desde el 1-jun-2026 |
| Lista de subencargados | https://docs.byteplus.com/en/docs/legal/sub-processors-list | 24-sep-2026 |
| Documentación de la API de imágenes de Seedream (parámetro `watermark`) | https://docs.byteplus.com/en/docs/ModelArk/1541523 | sin fecha visible |

## Citas textuales

**Disponibilidad en Estados Unidos (decide)**
- Specific Terms for Model Services §2(1): "The BytePlus Model Services are not available in the United States." Los términos extienden la restricción a los usuarios finales del cliente.
- La página de disponibilidad (21-abr-2026) lista Guatemala, México, España y Reino Unido, y no lista a Estados Unidos.
- Contratante: BytePlus Pte. Ltd., Singapur.

**Dónde se procesan los datos**
- El endpoint es `ark.ap-southeast.bytepluses.com`. La documentación indica que los registros del filtro de contenido se guardan en servidores en Malaysia o Singapur. ModelArk no figura en la lista de subencargados del 24-sep-2026, así que la ubicación del procesamiento de las fotos [no verificado].

**Entrenamiento**
- AI Terms §3.3: BytePlus no entrena con los datos del cliente. Este punto sería PERMITIDO.

**Propiedad de la salida**
- AI Terms §2.1: el cliente es dueño de la salida. La venta comercial no está prohibida.

**Marca de agua y etiquetas**
- Acceptable Use Policy (30-sep-2026): prohíbe "delete, tamper with, or conceal the deep synthesis service identifiers or labels".
- Seedream agrega por defecto una marca "AI-generated" en la esquina inferior derecha (parámetro `watermark`, valor por defecto verdadero). Se puede desactivar con el parámetro, pero la AUP veta ocultar etiquetas de síntesis. Un libro para colorear con una marca de IA impresa en cada página sería un cambio visible para el cliente y choca con la presentación del producto; ocultarla pondría en riesgo la cuenta.

**Menores**
- La AUP exige garantía de edad o controles de acceso frente a menores. Pintoria no da acceso a menores, pero sube sus fotos; la política no regula ese caso de forma explícita [no verificado].

## Veredicto por punto (Pintoria)

| Punto | Veredicto | Razón |
|---|---|---|
| Fotos de menores subidas por su padre o madre | **RIESGO ALTO** | La AUP trata el acceso de menores; no dice nada sobre sus fotos |
| Imágenes de personas reales | **RIESGO ALTO** | No leí una cláusula de consentimiento equivalente; sin ella, ambiguo |
| Contenido de IA vendido; propiedad o licencia | **PERMITIDO** | El cliente es dueño de la salida (AI Terms §2.1) |
| Retención y entrenamiento | **PERMITIDO con condiciones** | No entrena (§3.3); ubicación y retención de las fotos [no verificado] |
| País del titular: Guatemala | **PERMITIDO** | Guatemala figura en la lista |
| Mercado de EE. UU. | **PROHIBIDO** | "Not available in the United States" (§2(1)), usuarios finales incluidos |
| Atribución o marca de agua obligatoria | **RIESGO ALTO** | Marca de IA por defecto; la AUP veta ocultar etiquetas |

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PROHIBIDO** (EE. UU.); **RIESGO ALTO** (Reino Unido, España, México) | Sin EE. UU. se pierde el mercado principal; en los demás, marca de agua y falta de cláusula sobre fotos de menores |
| Jinglo | No aplica | No hay llamada a BytePlus |

## Condiciones

No hay condiciones que habiliten el mercado de EE. UU. No abrir cuenta ni pedir claves a Juan.

Para un uso fuera de EE. UU. (no recomendado, solo informativo): bloqueo geográfico de los pedidos desde EE. UU., consulta escrita a BytePlus sobre fotos de menores, retención y marca de agua, y revisión por abogado de los asuntos de transferencia de datos hacia un proveedor del grupo ByteDance.

## Para el abogado humano

- Regla del Departamento de Justicia de EE. UU. sobre transferencias de datos sensibles a países de preocupación (28 CFR Parte 202, Data Security Program): si es relevante para datos de menores enviados a una empresa del grupo ByteDance, y para Alibaba. [no verificado]; es una duda de abogado, no una conclusión.

## Plan B

OpenAI `gpt-image-2.5` (ver `openai.md`) y Recraft con sus modelos propios (ver `recraft.md`).

## Revisión

Releer si BytePlus levanta la restricción de EE. UU. en los Specific Terms.

## No verificado

- Dónde se procesan y se guardan las fotos de entrada.
- Si el filtro de contenido de ModelArk bloquea fotos de niños.
- Si el DPA ofrece cláusulas contractuales tipo para clientes del Reino Unido y la UE.
- Aplicabilidad de la regla del DOJ (arriba).
- Si Guatemala puede abrir cuenta y pagar (solo se confirmó la lista de países de disponibilidad).
