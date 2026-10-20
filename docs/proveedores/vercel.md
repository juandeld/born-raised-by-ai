# Vercel: hosting de la web y las rutas de la API (Next.js)

Veredicto D27: **PROHIBIDO mientras la cuenta sea Hobby** (Pintoria y Jinglo). Con plan Pro de pago y el entrenamiento de modelos desactivado: **PERMITIDO con condiciones**.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

Hecho verificado en esta sesión (API de Vercel, consulta de la cuenta de Juan): el plan de facturación de la cuenta es **hobby**, sin equipos ni suscripción de pago. El proyecto de Lumen Labs está hoy en un plan que Vercel prohíbe para uso comercial.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Terms of Service | https://vercel.com/legal/terms | "Last Updated October 19, 2026" |
| Fair Use Guidelines | https://vercel.com/docs/limits/fair-use-guidelines | "Last updated September 14, 2026" |
| Hobby Plan | https://vercel.com/docs/plans/hobby | "Last updated September 14, 2026" |
| Acceptable Use Policy | https://vercel.com/legal/acceptable-use-policy | "Last Updated April 21, 2026" |
| Pricing | https://vercel.com/pricing | sin fecha visible |

## Citas textuales

**Uso comercial (bloqueo)**
- Fair Use: "Hobby teams are restricted to non-commercial personal use only. All commercial usage of the platform requires either a Pro or Enterprise plan."
- Definición: es comercial cualquier despliegue usado "for the purpose of financial gain of anyone involved in any part of the production of the project". Ejemplos de la lista: "Any method of requesting or processing payment from visitors of the site" y "Advertising the sale of a product or service".
- Terms, sección 4: "You shall only use the Services under a Hobby plan for your personal or non-commercial use." Y Vercel puede cerrar proyectos Hobby "without notice for any reason or no reason".
- Una tienda con checkout y anuncios cae en ambos ejemplos. No hay zona gris.

**Entrenamiento de modelos con tu contenido (agravante para fotos de menores)**
- Terms, sección 3: "if you are on a Hobby plan or trial Pro plan, you agree that we may use Your Content to train our artificial intelligence (“AI”) and machine learning models, and we may share Your Content with third parties".
- En Pro de pago: "Model Training is not enabled by default and you may opt in to Model Training." Se puede desactivar "by adjusting your Team account settings".
- "Your Content" incluye "data, information [...] input, content, and other materials that you upload, post, deliver, provide or otherwise transmit or store" en relación con el servicio. Según `docs/legal/subencargados.md`, las fotos comprimidas (límite de 4,5 MB) y los datos del pedido viajan en el cuerpo de las solicitudes a las funciones de Vercel, es decir, tocan la plataforma. Mientras la cuenta es Hobby, la aceptación de ese entrenamiento es contractual.

**IA, menores y reglas de Vercel para sus propios servicios de IA**
- AUP, sección 3 (solo "AI Services" de Vercel: AI Gateway, v0, etc.): no se puede procesar "Personal information of children under age 13 or the applicable age of digital consent" ni "Online services directed at children".
- Pintoria y Jinglo llaman a OpenAI y ElevenLabs directo, no por AI Gateway; esa sección no aplica hoy. Si alguien enruta imágenes de menores por AI Gateway, sí aplicaría: prohibido.
- AUP, sección 2: se prohíbe "Share or threaten to share nonconsensual intimate imagery, including the use of synthetic media or deepfakes" y contenido con "child sexual exploitation or abuse". No hay prohibición de contenido generado con IA en general.

**Llamadas automatizadas y telemarketing**
- Sin cláusula. Las llamadas las ejecuta Twilio, no Vercel.

**País del vendedor**
- Terms, sección 1: edad mínima 16 años. Sin restricción por país de residencia en el texto leído; sanciones y exportación fuera del alcance de esta revisión.

**Costo**
- Pro: "$20/mo." por usuario con $20 de crédito incluido; los asientos de lectura son gratuitos. Cabe en el tope de costo fijo del portafolio (CLAUDE.md, principio 3), pero hay que anotarlo en el presupuesto de costos fijos de `pagos-finanzas`.

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PROHIBIDO** con plan Hobby; PERMITIDO con condiciones en Pro | Cobrar y anunciar desde Hobby viola Fair Use y Terms 4; además, en Hobby el contenido (fotos de menores) queda sujeto a la cláusula de entrenamiento. |
| Jinglo | **PROHIBIDO** con plan Hobby; PERMITIDO con condiciones en Pro | Mismo motivo. Los datos del niño (nombre de pila, teléfono del padre) también pasan por la plataforma. |

## Condiciones (para pasar a PERMITIDO)

1. Pasar la cuenta a **Pro** antes de publicar un checkout, una landing con anuncios o cualquier ruta que procese un pago. Esto requiere que Juan acepte los $20/mes y cargue una tarjeta: no lo hace ningún agente.
2. Pasar al plan Pro **de pago**, no la prueba: la cláusula de entrenamiento también cubre el "trial Pro plan". Verificar en los ajustes del equipo que "Model Training" quede desactivado y guardar captura en `docs/proveedores/evidencia/`.
3. Reducir lo que toca la plataforma: evaluar con `arquitecto` la subida directa del navegador a Supabase Storage con URL firmada, en vez de pasar la foto por una función. Es una mejora de minimización, no un requisito de la política.
4. No usar AI Gateway ni v0 para nada que lleve imágenes o datos de menores (AUP sección 3).
5. Mover a Pro antes de la prueba del primer cobro real, no después. Si se publica antes de pasar a Pro, Vercel puede apagar el sitio sin aviso con el pedido de un cliente en curso.

## Qué hacer

- `arquitecto` y `lider-proyecto`: avisar a Juan hoy. Es un bloqueo previo a cualquier cobro, independiente de la pasarela que se elija.
- `pagos-finanzas`: sumar $20/mes al costo fijo.
- Revisar Terms y Fair Use cada 30 días (los Terms cambiaron hoy mismo, 19-oct-2026).

## Dato adicional

- `docs/legal/subencargados.md` anota que el DPA estándar de Vercel aplica a Pro y Enterprise y no confirma que cubra Hobby. Sin DPA aplicable, no se cumple el compromiso de transferencias con cláusulas tipo que promete la política de privacidad. Otro motivo para Pro.

## No verificado

- Si el entrenamiento de modelos de Pro de pago puede quedar desactivado por defecto en una cuenta individual sin equipo (la opción se describe a nivel de "Team account settings").
- Texto completo de las cláusulas de procesamiento de datos (DPA) de Vercel.
