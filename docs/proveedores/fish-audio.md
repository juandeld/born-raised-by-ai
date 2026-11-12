# Fish Audio (Hanabi AI Inc.): voz de Santa, plan B frente a ElevenLabs

Veredicto D27 (actualizado 12-nov-2026): **dos niveles**.
- **Autoservicio (plan de pago, API por uso) sin ZDR: RIESGO ALTO para datos de niños. No se usa con datos reales de pedidos.** Los Terms permiten entrenar con el contenido y no hay opción documentada para excluirlo.
- **Contrato enterprise con ZDR activada: PERMITIDO con condiciones**, para la voz por pedido de los videos de Jinglo. Para las llamadas, lo mismo en lo legal; la viabilidad técnica la decide `arquitecto`. Pintoria: no aplica.
Lectura: 11 y 12-nov-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos; para el texto completo, abrir el enlace.
Motivo: los términos no prohíben productos dirigidos a menores ni piden aprobación previa (a diferencia de ElevenLabs). El problema es el entrenamiento con el contenido, que solo se apaga con retención cero, y esta solo se ofrece en enterprise.
## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Terms of Use | https://fish.audio/terms | "Effective date: August 18, 2024" |
| Enterprise Terms | https://fish.audio/enterprise-terms/ | rige desde que el cliente acepta, crea o renueva una cuenta de pago, o firma una orden |
| Privacy Policy | https://fish.audio/privacy/ | "Effective date: August 28, 2024" (leída 12-nov) |
| Página Enterprise | https://fish.audio/enterprise/ | sin fecha; leída 12-nov-2026 |
| Planes (Plus $11, Pro $75) | https://fish.audio/ | no mencionan ZDR (hallazgo de Juan, 12-nov) |

Los Terms of Use incorporan unas "Additional Terms" sin enlace: no se pudieron leer [no verificado]. No hay política de uso aceptable separada.

## Hallazgo 12-nov-2026: la ZDR es solo enterprise

- Página enterprise (https://fish.audio/enterprise/), FAQ: "enterprise contracts can switch on Zero Data Retention". Con ella, el texto y el audio de las solicitudes no se guardan en disco.
- La página de planes de autoservicio no menciona ZDR.
- Efecto: en autoservicio, sin ZDR, aplica la cláusula de los Terms ("Usage Data and Content may be used to develop, train, or enhance artificial intelligence or machine learning models"). El nombre de pila y los detalles del niño que da el padre irían a un proveedor que puede entrenar con ellos. Con la regla COPPA 2025 (datos de menores, sin consentimiento para entrenamiento) esto es **riesgo alto** y se escala a Juan.
- Contradicción interna: los Enterprise Terms §4.4(a) dicen que el cliente puede activarla "at any time", pero la página pública la liga a contrato enterprise. Hay que pedir confirmación escrita a Fish de qué plan da acceso real a la ZDR y a qué precio mínimo.

### Forma documentada de excluir el contenido del entrenamiento sin enterprise

**No encontrada.**
- Política de privacidad (https://fish.audio/privacy/, 28-ago-2024): no menciona exclusión de entrenamiento. Lista el contenido del usuario entre los fines de "Improving the Services, including testing, research, internal analytics and product development". Solo ofrece borrado a residentes de California y Virginia, por correo a support@fish.audio, y la baja de cookies.
- Terms: sin opción de exclusión leída.
- **No verificado**: docs.fish.audio (la lectura requirió aprobación que no se dio) y las "Additional Terms". Pendiente que `arquitecto` o Juan abra https://docs.fish.audio y busque "privacy", "retention" y "training" en la configuración de cuenta y del API. Hasta entonces, se asume que no existe.
- Un borrado por correo posterior no equivale a ZDR: el contenido ya pudo entrar al entrenamiento.

### Camino mínimo si se quiere Fish en producción
1. Solicitud escrita a Fish (ventas enterprise): ZDR para API de TTS, pago por uso, sin mínimo alto; DPA; confirmación de que no entrenan; ley y subencargados.
2. Si no hay enterprise asequible: no enviar nombre ni detalles reales al TTS (ej. generar la voz con nombre fonético genérico y superponer el nombre por otra vía). Eso lo evalúa `arquitecto`; legal solo acepta si ningún dato personal llega a Fish.
3. Pruebas internas con nombres ficticios: permitidas en autoservicio.

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
| Datos del niño (nombre y detalles en el texto) | **RIESGO ALTO en autoservicio; PERMITIDO solo con enterprise + ZDR** | Sin ZDR entrenan con el contenido; ZDR es solo enterprise |
| Contenido vendido | **PERMITIDO** | Uso comercial en planes de pago |
| Atribución | **PERMITIDO** | No se exige |
| Voz de Santa | **PERMITIDO con condiciones** | Voz diseñada o de catálogo con licencia; nunca clonar a una persona real |

## Condiciones

1. Contrato enterprise firmado con ZDR; autoservicio no sirve para datos reales (ver hallazgo 12-nov).
2. ZDR activada antes del primer pedido real; captura con fecha en `docs/legal/evidencia/`.
3. Voz de Santa propia (diseñada) o de catálogo con licencia comercial confirmada; no clonar voces de personas reales.
4. Añadir a `docs/legal/subencargados.md` y a la política de privacidad.
5. Releer los términos al usarlo: la versión pública tiene más de 2 años y la página de precios ha contradicho a los términos sobre el plan gratuito.

## Uso como plan B

- ElevenLabs respondió el 11-nov: menores de 13 solo con contrato Enterprise, bloqueado para Jinglo. Fish Audio (con enterprise + ZDR) es la alternativa con menos fricción legal para la voz de los videos. Requiere una prueba de calidad del español latino de Santa por `video-voz-santa` antes de decidir.
- Las llamadas usan el agente de ElevenLabs con Twilio; cambiar a Fish implicaría rehacer esa integración (`arquitecto`).

## No verificado

- "Additional Terms" y la política de privacidad completa.
- docs.fish.audio (privacidad, retención, exclusión de entrenamiento).
- Precio y mínimos del contrato enterprise.
- Calidad de la voz en español latino.

## Decisión del dueño — 12-nov-2026

Juan acepta el riesgo de usar Fish Audio en autoservicio (plan Plus, sin ZDR) para la temporada piloto (~300 videos). Fundamento: el comprador es adulto, los términos de Fish no prohíben productos dirigidos a menores, el volumen es bajo y el riesgo es reversible.
Mitigaciones obligatorias:
- al TTS solo llega el nombre de pila (sin apellido, edad, ciudad ni datos de salud);
- el logro se elige de una lista cerrada, no se escribe libre;
- voz diseñada con Voice Design: nunca clonar ni usar voces de la comunidad (pueden ser clones de personas reales sin licencia);
- se reevalúa (enterprise + ZDR) si el volumen pasa de 1,000 pedidos o se abren EE. UU. o la UE.
ElevenLabs queda fuera para productos de niños: el riesgo es comercial (cierre de cuenta en plena temporada), no solo legal.

## Decisión del dueño — 12-nov-2026 (tarde): clonar la voz diseñada de ElevenLabs

El diseño de voz de Fish no convenció a Juan ("muy mala"). Juan decide clonar en Fish la voz que diseñamos en ElevenLabs ("Santa Lumen Labs (es-419)", voz sintética: no es de ninguna persona real).
Riesgos explicados a Juan antes de decidir: los términos de ElevenLabs prohíben usar su servicio o su salida para desarrollar productos o modelos que compitan con ellos (beta.elevenlabs.io/terms), y la salida sigue sujeta a su Prohibited Use Policy, incluida la cláusula de productos dirigidos a menores. Riesgo práctico bajo a ~300 videos; el peor caso es que pidan dejar de usar la voz.
Hecho: muestra de referencia de 67 s sin datos de niños (`santa-referencia.mp3`), subida a Fish (clon instantáneo), voz "Santa Jinglo", privada. La casilla de permiso para crear el modelo y los términos de Fish la marca Juan.
Plan B si hay reclamo: locutor latino con consentimiento firmado para clonar (~$80–200).
