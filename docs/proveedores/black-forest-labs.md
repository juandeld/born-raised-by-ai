# Black Forest Labs: FLUX (API de generación y edición de imágenes)

Veredicto D27: **PROHIBIDO** para Pintoria. Jinglo: no aplica, no envía fotos a BFL.
Lectura: 25-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Motivo central: los términos de desarrollador prohíben subir imágenes o datos de personas menores de 18, y los términos del servicio FLUX API permiten a BFL entrenar sus modelos con las entradas y salidas del cliente. Cualquiera de las dos bloquea Pintoria; juntas no dejan margen. No hay camino por condiciones.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Developer Terms of Service | https://bfl.ai/legal/developer-terms-of-service | revisado 4-ago-2026 |
| FLUX API Service Terms | https://bfl.ai/legal/flux-api-service-terms | 4-ago-2026 |
| Usage Policy | https://bfl.ai/legal/usage-policy | 4-ago-2026 |

(La versión de los términos para clientes de la UE, que BFL publica por separado, no se leyó.)

## Citas textuales

**Menores de 18 (decide)**
- Developer Terms §6(k): se prohíbe subir imágenes, videos o datos personales "relating to individuals under the age of 18". No distingue si los sube un padre con consentimiento. Pintoria sube fotos de niños de 3 a 8 años por diseño.

**Entrenamiento con los datos del cliente (decide)**
- FLUX API Service Terms §2(b): BFL "may use Inputs and Outputs to train and improve its artificial intelligence models". Es lo contrario de "cero entrenamiento", que exige Pintoria, y no hay una vía de exclusión en los textos leídos.

**Consentimiento de personas reales**
- FLUX API Service Terms §9: el cliente debe contar con el "informed, documented consent of such person (or their lawful representative)" para usar su imagen o semejanza. La casilla parental del checkout cubriría esto, pero no levanta la prohibición de menores del punto anterior.

**Marca de procedencia**
- FLUX API Service Terms §6(i): prohíbe quitar las credenciales de contenido (C2PA) de las salidas. Si el PDF re-codifica las imágenes, hay que confirmar si eso cuenta como quitarlas: [no verificado].

**Propiedad de la salida**
- Los términos reconocen al cliente la propiedad de la salida (Output). La venta comercial no está prohibida. Este punto por sí solo sería PERMITIDO.

**Política de uso**
- Usage Policy (4-ago-2026): prohíbe inferir información sensible de personas y el tratamiento biométrico. Una edición de foto a ilustración no es identificación biométrica, pero con fotos de menores y el entrenamiento permitido en §2(b) el riesgo es alto.

## Veredicto por punto (Pintoria)

| Punto | Veredicto | Razón |
|---|---|---|
| Fotos de menores subidas por su padre o madre | **PROHIBIDO** | Developer Terms §6(k) |
| Imágenes de personas reales | **PERMITIDO con condiciones** | Exige consentimiento documentado (§9) |
| Contenido de IA vendido; propiedad o licencia | **PERMITIDO** | El cliente es dueño de la salida |
| Retención y entrenamiento | **PROHIBIDO** | §2(b): BFL puede entrenar con entradas y salidas |
| País del titular: Guatemala | [no verificado] | No hay lista de países en lo leído; los términos solo traen cláusula de sanciones |
| Atribución o marca de agua obligatoria | **RIESGO ALTO** | Sin "Powered by", pero C2PA no debe quitarse (§6(i)) |

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PROHIBIDO** | Menores de 18 prohibidos y entrenamiento con los datos del cliente |
| Jinglo | No aplica | No hay llamada a BFL |

## Condiciones

No hay condiciones que lo habiliten. No abrir cuenta, no pedir claves a Juan y no usar los modelos FLUX por ninguna vía directa.

Efecto sobre los agregadores: los modelos FLUX alojados en Replicate o fal.ai siguen sujetos a los términos de BFL (Replicate lo dice expresamente en su contrato; fal debe leerse igual). Si Pintoria usara FLUX a través de ellos, el veredicto sería el mismo. Ver `replicate.md` y `fal-ai.md`.

## Plan B

OpenAI `gpt-image-2.5` (ver `openai.md`) y Recraft con sus modelos propios (ver `recraft.md`).

## Revisión

Releer solo si BFL publica un contrato empresarial con exclusión del entrenamiento y sin la cláusula §6(k). No se espera.

## No verificado

- Texto de la versión UE de los términos.
- Si el contrato empresarial de BFL (que no es público) cambia §2(b) o §6(k).
- Si re-codificar las imágenes dentro del PDF cuenta como quitar C2PA.
- Si Guatemala puede abrir cuenta (sin lista de países; solo cláusula de sanciones).
