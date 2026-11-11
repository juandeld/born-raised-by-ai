# Fish Audio (Hanabi AI Inc.): voz de Santa, plan B frente a ElevenLabs

Veredicto D27: **PERMITIDO con condiciones** para la voz por pedido de los videos de Jinglo. Para las llamadas, lo mismo en lo legal; la viabilidad técnica (agente en tiempo real con Twilio) la decide `arquitecto`. Pintoria: no aplica.
Lectura: 11-nov-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Motivo: a diferencia de ElevenLabs, los términos leídos **no prohíben productos dirigidos a menores** ni piden aprobación previa. Las condiciones vienen del uso de datos para entrenar (resuelto solo con retención cero) y de unos términos antiguos con contradicciones.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Terms of Use | https://fish.audio/terms | "Effective date: August 18, 2024" |
| Enterprise Terms | https://fish.audio/enterprise-terms/ | rige desde que el cliente acepta, crea o renueva una cuenta de pago, o firma una orden |
| Privacy Policy | https://fish.audio/privacy/ | "Effective date: August 28, 2024" (no leída a fondo) |

Los Terms of Use incorporan unas "Additional Terms" sin enlace: no se pudieron leer [no verificado]. No hay política de uso aceptable separada.

## Citas textuales

**Edad y menores**
- Terms: "You must be at least 13 years old to use the Services"; menores de 18 solo con permiso de sus padres. El usuario es Juan.
- Terms: no recogen a sabiendas datos de "children under 16 years of age". Le enviamos solo el nombre de pila y detalles que da el adulto; el niño no usa el servicio.
- Ni los Terms ni los Enterprise Terms dicen nada sobre productos dirigidos a niños.

**Entrenamiento y retención (decide las condiciones)**
- Terms: "Usage Data and Content may be used to develop, train, or enhance artificial intelligence or machine learning models".
- Enterprise §4.4(b)(ii): con retención cero (ZDR) activada, Fish Audio "will not use Customer Materials to train, fine-tune, develop, test, or otherwise improve any Model". §4.4(b)(i): no retiene entradas ni salidas más de lo estrictamente necesario. §4.4(a): el cliente puede activarla "at any time".

**Uso comercial y atribución**
- Terms: los usuarios de pago están "licensed to use the Services for commercial uses". El plan gratuito es solo personal y no comercial.
- Sin marca de agua ni atribución obligatoria; solo animan a revelar el uso de IA (lo hacemos con el adulto, D13 y D23).
- Enterprise §2.3: entradas y salidas son "Customer Material"; Fish Audio no garantiza que el cliente sea dueño de la salida.

**Empresa y ley**: Hanabi AI Inc., Delaware; ley de California.

## Veredicto por punto (Jinglo)

| Punto | Veredicto | Razón |
|---|---|---|
| Producto dirigido a niños | **PERMITIDO** | No hay restricción en lo leído |
| Datos del niño (nombre y detalles en el texto) | **PERMITIDO con condiciones** | Solo con ZDR activada; sin ella entrenan con el contenido |
| Contenido vendido | **PERMITIDO** | Uso comercial en planes de pago |
| Atribución | **PERMITIDO** | No se exige |
| Voz de Santa | **PERMITIDO con condiciones** | Voz diseñada o de catálogo con licencia; nunca clonar a una persona real |

## Condiciones

1. Plan de pago. Confirmar por escrito si la cuenta de pago queda bajo los Enterprise Terms y si la ZDR está disponible en ese plan [no verificado].
2. ZDR activada antes del primer pedido real; captura con fecha en `docs/legal/evidencia/`.
3. Voz de Santa propia (diseñada) o de catálogo con licencia comercial confirmada; no clonar voces de personas reales.
4. Añadir a `docs/legal/subencargados.md` y a la política de privacidad.
5. Releer los términos al usarlo: la versión pública tiene más de 2 años y la página de precios ha contradicho a los términos sobre el plan gratuito.

## Uso como plan B

- Si ElevenLabs no aprueba o tarda, Fish Audio es la alternativa con menos fricción legal para la voz de los videos. Requiere una prueba de calidad del español latino de Santa por `video-voz-santa` antes de decidir.
- Las llamadas usan el agente de ElevenLabs con Twilio; cambiar a Fish implicaría rehacer esa integración (`arquitecto`).

## No verificado

- "Additional Terms" y la política de privacidad completa.
- Si la ZDR y los Enterprise Terms aplican al plan de autoservicio.
- Calidad de la voz en español latino.
