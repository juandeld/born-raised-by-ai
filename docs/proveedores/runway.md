# Runway: API y plataforma (generación y edición de imágenes y video)

Veredicto D27: **PROHIBIDO** para Pintoria por la vía de autoservicio. La vía Enterprise es **RIESGO ALTO** y no se evaluó. Jinglo: no aplica, no envía fotos a Runway.
Lectura: 25-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Cambio reciente: los Terms of Use se actualizaron el 23-oct-2026, dos días antes de esta lectura. Releer a los 30 días.
Motivo central: los términos de autoservicio obligan a mostrar "Powered by Runway" (contrario a D23) y dan a Runway una licencia perpetua para entrenar con las entradas y salidas.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Terms of Use | https://runway.com/terms-of-use | "Last updated 23 Oct 2026" |
| Usage Policy | https://runway.com/safety/usage-policy | 6-mar-2026 |
| Enterprise Terms | https://runway.com/enterprise-terms | 1-jun-2026 |

## Citas textuales

**Atribución obligatoria (decide)**
- Terms of Use §1: quien use la API o los resultados en un producto debe "prominently display 'Powered by Runway'". Es incompatible con D23.

**Entrenamiento con los datos del cliente (decide)**
- Terms of Use §4.4: las entradas y salidas "may be used by the Company to train and improve its AI models", bajo una licencia perpetua e irrevocable. Es lo contrario de "cero entrenamiento".

**Menores**
- Terms of Use §7.5(b)(vi) (App Studio): prohíbe aplicaciones dirigidas a niños menores de 18. Aplica a esa función, no a la API general; refleja la postura de la empresa.
- Usage Policy (6-mar-2026): exige permiso para usar la imagen de otra persona y fija un estándar más estricto cuando se representa a un menor. El producto Characters veta personajes basados en el rostro de una persona menor de 18.

**Vía Enterprise**
- Enterprise Terms (1-jun-2026): Runway "may not use Customer Content as training data". Es el punto que falla en autoservicio. El resto (atribución, menores, precio, país) no se evaluó: RIESGO ALTO por D27 hasta leer el contrato empresarial completo y negociarlo.

## Veredicto por punto (Pintoria, autoservicio)

| Punto | Veredicto | Razón |
|---|---|---|
| Fotos de menores subidas por su padre o madre | **RIESGO ALTO** | Estándar más estricto para menores; Characters lo veta |
| Imágenes de personas reales | **PERMITIDO con condiciones** | Exige permiso |
| Contenido de IA vendido; propiedad o licencia | **PERMITIDO con condiciones** | Sujeto a "Powered by Runway" |
| Retención y entrenamiento | **PROHIBIDO** | §4.4: licencia perpetua para entrenar |
| País del titular: Guatemala | [no verificado] | No hay lista de países en lo leído |
| Atribución o marca de agua obligatoria | **PROHIBIDO** | §1 "Powered by Runway"; choca con D23 |

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PROHIBIDO** (autoservicio) | Atribución obligatoria y entrenamiento |
| Jinglo | No aplica | No hay llamada a Runway |

## Condiciones

No hay condiciones que lo habiliten por autoservicio. No abrir cuenta ni pedir claves a Juan. Si en el futuro se quisiera Runway, solo por contrato Enterprise leído completo y aprobado por abogado humano.

## Plan B

OpenAI `gpt-image-2.5` (ver `openai.md`) y Recraft con sus modelos propios (ver `recraft.md`).

## No verificado

- Contrato Enterprise completo (atribución, menores, precio mínimo, países).
- Países admitidos y medios de pago.
- Alcance exacto del bloqueo de Characters sobre fotos subidas por un padre.
