# Ideogram: API de generación y edición de imágenes

Veredicto D27: **PROHIBIDO** para Pintoria. Jinglo: no aplica, no envía fotos a Ideogram.
Lectura: 25-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Motivo central: el contrato de la API obliga a identificar la salida como hecha por Ideogram y a mostrar sus marcas. Eso contradice D23 (nunca nombrar proveedores al cliente). Además, para datos de menores el mismo contrato da a Ideogram derecho amplio sobre los datos del usuario.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Developer API Agreement | https://ideogram.ai/legal/api-tos | revisado 14-ago-2024 |
| Terms of Service | https://ideogram.ai/legal/tos | 14-ago-2024 |
| Privacy Policy | https://ideogram.ai/legal/privacy | sin fecha en lo leído [no verificado] |
| Usage Policy | https://ideogram.ai/legal/usage-policy | 15-may-2024 |

Nota: la fecha más reciente de estos documentos es de agosto de 2024; son más antiguos que los de los demás proveedores. Que sigan vigentes hoy: [no verificado].

## Citas textuales

**Atribución obligatoria (decide)**
- API Agreement §2.3.1: el cliente debe identificar la salida como hecha por Ideogram ("Powered by Ideogram") y mostrar las marcas de Ideogram. Es incompatible con D23. Un libro para colorear con "Powered by Ideogram" nombraría al proveedor ante el cliente.

**Datos de menores y datos del usuario**
- API Agreement §4.3: no se debe dar a Ideogram información de niños sin consentimiento, y Ideogram "has the right to use in any manner all User data received". Con fotos de menores, ese derecho amplio es inaceptable.

**Entrenamiento**
- API Agreement §2.2: no entrena con los datos de la API, salvo contenido marcado por sus sistemas. La excepción es vaga: [no verificado] qué se marca y cuánto se retiene.

**Propiedad y uso comercial**
- Terms of Service §2.1: el usuario es dueño de la salida y puede usarla comercialmente. Este punto sería PERMITIDO.

**Personas reales**
- Usage Policy (15-may-2024): no se permiten imágenes de personas sin su consentimiento. La casilla parental cubriría esto.

## Veredicto por punto (Pintoria)

| Punto | Veredicto | Razón |
|---|---|---|
| Fotos de menores subidas por su padre o madre | **RIESGO ALTO** | §4.3 con derecho amplio sobre los datos recibidos |
| Imágenes de personas reales | **PERMITIDO con condiciones** | Exige consentimiento |
| Contenido de IA vendido; propiedad o licencia | **PERMITIDO** | El usuario es dueño y puede usarlo comercialmente |
| Retención y entrenamiento | **RIESGO ALTO** | Excepción de contenido marcado; derecho amplio en §4.3 |
| País del titular: Guatemala | [no verificado] | No hay lista de países en lo leído |
| Atribución o marca de agua obligatoria | **PROHIBIDO** | §2.3.1 exige identificar y mostrar marcas; choca con D23 |

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PROHIBIDO** | Atribución obligatoria contraria a D23 |
| Jinglo | No aplica | No hay llamada a Ideogram |

## Condiciones

No hay condiciones que lo habiliten sin un contrato distinto. Se podría pedir a Ideogram un acuerdo empresarial sin la cláusula de atribución; no se recomienda abrir esa vía existiendo alternativas. No abrir cuenta ni pedir claves a Juan.

## Plan B

OpenAI `gpt-image-2.5` (ver `openai.md`) y Recraft con sus modelos propios (ver `recraft.md`).

## No verificado

- Si los documentos de 2024 siguen vigentes.
- Si existe un contrato empresarial sin atribución.
- Qué contenido "marcado" se usa para entrenar y cuánto tiempo se guarda.
- Países admitidos.
