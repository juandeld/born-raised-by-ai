# Aprobación legal: código de prueba sin pago, hasta 3 fotos por persona y remitente de correo (colorear / Pintoria)

`legal-compliance` · 25-oct-2026 · commits `cc3688c` (código de prueba), `0fa29f9` (hasta 3 fotos), `d4d9895` (remitente) · texto legal revisado: `colorear-legal-v4` → se propone `colorear-legal-v5`. No es asesoría de abogado; lo no confirmado va como [no verificado]. Lo leído: los diffs de los tres commits, `packages/legal/src/colorear.ts`, `engines/generate/src/engine.ts`, `emails.ts`, `prompt.ts` y `docs/arquitectura/pendientes-cuentas.md`. No ejecuté las pruebas ni la aplicación.

## Veredicto

| # | Pregunta | Veredicto |
|---|---|---|
| 1 | ¿El cambio del aviso exige `colorear-legal-v5`? | **Sí.** El texto nuevo del aviso queda aprobado. Se sube la versión (ids y una frase), sin pedir consentimiento de nuevo a nadie y sin tocar `engines/`. K1 no cambia. |
| 2 | Pedidos con código de prueba | **APROBADO CON CONDICIONES, solo para un piloto cerrado** con adultos que Juan conoce. K1 y K2 valen como registro, pero sin cargo real no hay consentimiento parental verificable. No vale para público. |
| 3 | 3 fotos por persona frente a las 8 condiciones de `openai.md` | **Encaja.** Cumplen 1, 2, 3 y 5; la 7 se cierra con v5; la 4 y la 6 siguen pendientes (ya lo estaban); la 8 queda: `gpt-image-1-mini` sirve hasta el 1-dic-2026 y los modelos 2.5 siguen provisionales. |
| 4 | `safety_identifier` | **No bloquea el piloto cerrado** (riesgo comercial que acepta Juan). **Bloquea el primer cobro real.** Es un dato nuevo hacia el proveedor: lo autoriza Juan. |
| 5 | Remitente y reply_to (`d4d9895`) | **Aprobado, sin condiciones nuevas.** Un punto de verificación del alias de soporte. |

Esta aprobación no autoriza cobrar a clientes reales, anuncios ni ningún uso público. Eso sigue pendiente (sección 7).

## 1. Aviso "Qué recogemos" y versión

**Decisión: sí, subir a `colorear-legal-v5`.**

- El aviso pasó de "(de 1 a 5)" fotos a "una o varias de cada persona o mascota, de hasta 5 personas". Con los valores por defecto son hasta 15 fotos de personas, incluidos menores, por pedido (hasta tres veces más que antes). Es un cambio material de lo que se recoge y el aviso tiene que ser exacto cuando se recoge (aviso directo de COPPA; RGPD y UK GDPR art. 13). El texto nuevo es correcto y queda **aprobado tal como está en el repo** (es-419, es-ES y en).
- La prueba está en el registro: `consents` (id y hash) y el evento `consent_given` (ids) guardan K1 y K2, no el texto del aviso. El id con la versión es el único vínculo entre un registro y el aviso que se mostraba. Con `v4` reutilizado, un registro anterior al cambio y uno posterior serían iguales con avisos distintos.
- Precedente: D22 (v2), D23 (v3) y D26 (v4) subieron la versión en cada cambio de texto legal.
- **K1 no cambia.** No dice cuántas fotos son y sigue siendo exacto. No hace falta un texto de consentimiento nuevo.
- **Sin registro de consentimiento retroactivo.** Producción corre con pago simulado y Polar rechazó la cuenta, así que no hay compradores reales con `v4` [no verificado: Juan confirma que nunca hubo un pedido real de pago]. Los pedidos de prueba existentes conservan su registro `v4`. El aviso nuevo se muestra antes del botón a todo pedido nuevo.

### Qué cambiar exactamente (lo hace `arquitecto`; yo no toqué código)

1. `packages/legal/src/colorear.ts`:
   - `COLOREAR_LEGAL_VERSION = "colorear-legal-v5"` y una línea "v5 (25-oct-2026)" en el comentario de cabecera.
   - Ids: K1 (3), K2 (3) y AVISO (3): cambiar el sufijo `-colorear-v4` por `-colorear-v5`. Los textos de K1 y K2 quedan idénticos.
   - Dejar tal cual la frase de "Qué recogemos" del commit `0fa29f9`.
   - Cerrar la condición 7 de `openai.md` con esta frase, en la sección "Quién los recibe para prestar el servicio" (hoy dice "de forma temporal"):
     - es-419 y es-ES: "...y pueden conservar copias hasta 30 días, o más si la ley lo exige o para revisar un posible abuso grave, según sus propias condiciones".
     - en: "...and may keep copies for up to 30 days, or longer if the law requires it or to review a possible serious abuse, under their own terms".
     - Base: las guías de datos de OpenAI leídas el 25-oct (registros de abuso hasta 30 días; las imágenes de entrada marcadas por seguridad infantil se retienen para revisión manual incluso con retención cero). "Hasta" sigue siendo cierto si luego se aprueba la retención cero. Si las páginas de políticas de openai.com dicen otra cosa al releerlas, se ajusta [no verificado].
   - `COLOREAR_LEGAL_RULES.providerCopiesDays: 30`, para que el número salga de ahí.
2. `packages/legal/src/legal.test.ts`: línea 164, `/colorear-v4$/` pasa a `/colorear-v5$/`; línea 197, `colorear-legal-v5`; añadir la clave nueva al `toMatchObject` y una prueba de que la sección de destinatarios contiene `30 (días|days)`.
3. `apps/web/src/lib/colorear-legal-pages.ts`: el comentario de cabecera de los términos dice `colorear-legal-v4`.
4. La página de privacidad sale del mismo aviso (`renderColorearAviso`): se actualiza sola. Nada en `engines/`: `confirmPayment` toma los ids del paquete.
5. El líder de proyecto añade la fila en `docs/decisiones.md`.

**Mejora recomendada antes del primer cobro real (no bloquea el piloto):** `confirmPayment` resuelve los textos de K1 y K2 en el momento del pago, no cuando la persona los aceptó (`consent_draft` guarda solo los ids de las casillas, la hora y la IP). Si se despliega entre el clic y el webhook de pago, el registro podría llevar un texto distinto del que se vio. En el código de prueba el pago es inmediato y el riesgo es mínimo; con pago real conviene guardar en `consent_draft` el `text_version_id` y el hash al aceptar.

## 2. Pedidos con código de prueba (`cc3688c`)

**¿Algo cambia legalmente sin cargo real? Sí.**

- La regla del proyecto es que el checkout con tarjeta vale como consentimiento parental verificable solo si el aviso va antes del pago y hay cargo real. Un pedido con código **no cumple esa regla**: K1 es una declaración propia y nadie verifica que quien la hace sea adulto.
- El aviso mostrado dice dos cosas falsas en estos pedidos: que la autorización se verifica con el cobro de la tarjeta (sección "Por qué podemos tratarlos") y "Cómo verificamos que usted es una persona adulta responsable: con el cobro de su tarjeta". K2 dice "Al pagar, acepto..." y no se paga. El formulario también sigue mostrando la línea de reembolso de 7 días.
- No afirmo que haya incumplimiento de COPPA: regula datos recogidos de niños y aquí los sube un adulto [no verificado; va a la lista del abogado, sección 8]. Por eso el piloto se acota.
- Lo que sigue vigente y está bien: K1 y K2 obligatorios y registrados con texto, hora e IP (`consents`, `payment_id` = `testcode:<hash>:<pedido>`); aviso antes del botón; fotos borradas en 24 h como en un pedido pagado; sin entrenamiento; recibo "Pedido de prueba sin costo" sin precio ni promesa de reembolso (`emails.ts`); el endpoint de conversiones de Meta rechaza los pedidos `test_mode` (`meta.ts`) y el flujo de colorear no envía eventos a Meta; el código nunca se registra (solo un hash de 10 caracteres); topes de 50 usos en total y 10 por 24 h.

**¿Basta el consentimiento actual? Para un piloto cerrado, con estas condiciones, sí. Para cualquier otro uso, no.**

| # | Condición | Cuándo |
|---|---|---|
| P1 | **Cambiar `PROMO2026`** (el valor sugerido en `pendientes-cuentas.md`) por un código aleatorio de 12 caracteres o más, uno por persona o por grupo pequeño. Es adivinable y suena a promoción pública: cualquiera que lo acierte (o lo vea compartido) sube fotos de niños sin tarjeta. El freno por IP y los topes limitan el daño, no lo eliminan. No publicarlo en la web, redes, anuncios ni grupos abiertos. Revocar al terminar (borrar `COLOREAR_TEST_CODES` en Vercel y redesplegar) y **siempre antes de cualquier anuncio o lanzamiento**. | Antes de dar el primer código |
| P2 | Solo adultos que Juan conoce personalmente. Fotos solo de sus hijos o de familiares de quienes son responsables o tienen permiso. Nada de fotos de niños ajenos "para probar". Juan lleva una lista fuera del repositorio (nombre, país, fecha, si subirán fotos de menores). | Siempre |
| P3 | Juan envía a cada persona el mensaje de invitación de abajo con el código y guarda su respuesta "Acepto". Sustituye, de forma acotada, la verificación que daría el cobro: Juan conoce al adulto y este acepta por escrito. | Antes de cada código |
| P4 | **Variante de texto para pedidos con código** (K2 y dos frases del aviso, abajo) con ids `...-colorear-v5-code`, que `confirmPayment` registra en lugar de K2/aviso de pago cuando el pedido es de código, y que el formulario muestra cuando hay un código escrito (ocultando la línea de reembolso). Mientras no esté: máximo 10 pedidos con código en total y solo con P3. | Antes del pedido 11, o antes de dar un código a alguien que Juan no conozca personalmente |
| P5 | `commercialAllowed` debe devolver falso para pedidos con código (y sus aventuras del Trío). Hoy el recordatorio del día 25 llevaría el bloque comercial ("ofertas") a quienes no compraron nada: no hay venta previa que lo ampare (PECR reg. 22, LSSI art. 21.2) y cuenta contra el límite de tres correos. | Antes del 15-nov-2026 (el primer recordatorio de un pedido de hoy sale hacia el 20-nov) |
| P6 | Fotos cotidianas con ropa de calle (ni baño ni desnudos). Si el proveedor bloquea una foto, el motor ya no la reintenta, la borra y dibuja desde la descripción con un aviso neutro: no cambiar eso. Juan revisa los eventos `content_blocked` al final de cada día del piloto. Si el bloqueo es por posible abuso infantil: no abrir ni analizar la foto, cancelar el pedido y avisarme el mismo día. | Durante el piloto |
| P7 | Probadores en la UE o el Reino Unido: se aplica RGPD / UK GDPR igual que a un cliente; con P3 y P4 se cubre. Probadores en Guatemala: ley local [no verificado]. | Siempre |

**Textos de la variante (P4), aprobados tal como están escritos aquí:**

- K2 de código, ids `08-K2-es-419-colorear-v5-code`, `08-K2-es-ES-colorear-v5-code`, `08-K2-en-colorear-v5-code`:
  - es-419 y es-ES: "Al usar el código, acepto los términos de servicio y la política de privacidad."
  - en: "By using the code, I accept the terms of service and the privacy policy."
- Aviso, sección "Por qué podemos tratarlos": la cláusula "que verificamos con el cobro de su tarjeta" pasa a:
  - es: "a quien conocemos personalmente porque le entregamos el código de prueba".
  - en: "whom we know personally because we gave you the test code".
- Aviso, sección "Cómo verificamos que usted es una persona adulta responsable":
  - es: "en un pedido de prueba no hay cobro: le entregamos el código personalmente, porque conocemos a quien lo usa. Le enviaremos un recibo con estos mismos datos."
  - en: "a test order has no charge: we handed you the code personally, because we know who is using it. We will email you a receipt with this same information."
- Implementación (`arquitecto`): `renderColorearAviso(..., { test: true })` y `resolveColorearCheckbox` con variante; el formulario usa la variante cuando `usingCode`; `confirmPayment` la usa para pedidos `payment_provider = test_code`; el evento `consent_given` lleva los ids de la variante. Los pedidos de prueba son una excepción acotada: el texto dice la verdad solo mientras P2 se cumpla.

**Mensaje de invitación (P3), para enviar por mensaje o correo:**

- Español: "Hola [nombre]. Te paso un código personal para probar Pintoria, el libro para colorear con tu familia, sin ningún cobro: [CÓDIGO]. Es una prueba y no se paga nada; como te conozco personalmente, no hay un cobro que verifique que eres adulto. Antes de empezar: (1) sube solo fotos de tus hijos o de familiares de quienes eres responsable o tienes permiso, con ropa de calle (nada de baño ni desnudos); (2) las fotos se procesan con servicios de inteligencia artificial de terceros, que pueden conservar copias hasta 30 días para prevenir abusos; nosotros borramos las nuestras en menos de 24 horas y no se usan para entrenar modelos; (3) el libro lo crea una IA y puede tener imperfecciones; (4) puedes cancelar y borrar todo desde el enlace del correo o respondiéndome; (5) no compartas el código. Si estás de acuerdo, responde 'Acepto'."
- English: "Hi [name]. Here is a personal code to try Pintoria, the coloring book with your family in it, at no charge: [CODE]. This is a test and nothing is charged; since I know you personally, there is no charge to verify that you are an adult. Before you start: (1) upload only photos of your own children or of relatives you are responsible for or have permission for, in everyday clothes (no swimwear or nudity); (2) the photos are processed by third-party artificial-intelligence services that may keep copies for up to 30 days to prevent abuse; we delete ours in under 24 hours and they are not used to train models; (3) the book is created by an AI and may have imperfections; (4) you can cancel and delete everything from the link in the email or by replying to me; (5) please do not share the code. If you agree, reply 'I agree'."

## 3. Tres fotos por persona frente a las 8 condiciones de `openai.md`

| # | Condición | Estado con 3 fotos | Evidencia o acción |
|---|---|---|---|
| 1 | Consentimiento de cada persona identificable | **Cumple** | K1 y la sección "Quién confirma" del aviso no dependen del número de fotos |
| 2 | Arte de línea, nunca fotorrealista ni copia idéntica | **Cumple** | El prompt con varias fotos dice, en inglés, que se dibuja un solo personaje, "never a photorealistic or identical copy", más el estilo "not photorealistic" y "kind, flattering caricature"; `input_fidelity` no se envía. Pendiente `qa-redteam` o `arquitecto`: ninguna prueba falla hoy si esa frase desaparece (las pruebas solo comprueban "SAME person"); añadir una. Sin palabras como "idéntico", "exacto", "fiel" o "retrato" en prompts ni copy; "más parecido" está bien |
| 3 | No pedir identificar ni inferir datos sensibles | **Cumple** | El prompt solo dice que las fotos son de la misma persona (lo declara el adulto) y que se usen sus rasgos reconocibles para dibujar; edad y rol los declara el adulto |
| 4 | `safety_identifier` | **Pendiente** | Sección 4 |
| 5 | Bloqueos de moderación: no reintentar la misma foto, borrarla, aviso neutro, reembolso | **Cumple en el código** | Una negativa lanza `ModerationError` sin reintento, dibuja desde la descripción, borra todas las fotos al terminar los personajes y avisa "No pudimos usar alguna foto...". Falta el camino humano para posible abuso infantil (alerta a Juan el mismo día): pendiente antes de cobrar |
| 6 | Verificación de la organización en OpenAI | **Pendiente (Juan)** | Es requisito de acceso a los modelos nuevos |
| 7 | La política de privacidad dice que el proveedor puede conservar copias hasta 30 días | **Se cierra con v5** | Sección 1; pedir retención cero nombrando `gpt-image-2.5` sigue pendiente |
| 8 | Modelo vigente y su política | **Parcial** | `gpt-image-1-mini` (el valor por defecto) está cubierto por la lectura del 19-oct y sirve hasta el 1-dic-2026. Los modelos `gpt-image-2.5` siguen **provisionales** hasta releer las páginas de políticas de openai.com (403 el 25-oct). **Para el piloto: usar `gpt-image-1-mini`, o un 2.5 solo después de esa relectura.** Nunca `gpt-image-1` (apagado el 23-oct) |

Minimización de datos: las fotos extra son opcionales, la primera sigue siendo la obligatoria, la retención no cambia y Juan decidió el cambio (`pendientes-cuentas.md`). Si quiere bajar el volumen, `COLOREAR_MAX_PHOTOS_OTHER=2`. No hace falta nada más.

## 4. `safety_identifier` (condición 4)

- La guía de imágenes de OpenAI leída el 25-oct lo llama "recommended but not required". Las páginas de Usage Policies no se pudieron releer [no verificado].
- **Piloto cerrado: no lo bloquea.** Es una medida de seguridad que permite a OpenAI actuar sobre un usuario final en lugar de sobre toda la cuenta. Sin ella, una foto familiar inocente marcada por error podría poner en riesgo la cuenta que se usará para vender. Es un riesgo comercial para Juan, no un daño a los probadores, y con P2 y P6 es bajo. Si Juan no quiere asumirlo, lo implementa antes.
- **Primer cobro real: lo bloquea.** Es la condición 4 desde la lectura del 19-oct.
- **Es un dato nuevo que sale hacia el proveedor** (un identificador seudónimo derivado de quien compra), así que por regla lo autoriza Juan: mi recomendación es aprobarlo. Forma: un HMAC con `PHONE_HASH_SALT` del correo, nunca el correo, el código de prueba ni el token del pedido; estable por comprador. Al implementarlo se anota en `docs/legal/subencargados.md` (fila de OpenAI) y no cambia el aviso ("reciben solo lo necesario").

## 5. Remitente "Pintoria <hola@lumen-labs.co>" y reply_to (`d4d9895`)

**Aprobado.** Antes, los recibos de Pintoria salían a nombre de "Jinglo", otro producto: eso inducía a error sobre quién enviaba. El remitente ahora coincide con la marca que ve el comprador, y los correos con contenido comercial siguen llevando el titular y el domicilio en el pie. Una verificación: los recibos prometen "responda a este correo y lo cancelamos de inmediato", y ahora esa respuesta llega a `soporte@lumen-labs.co`. Hay que comprobar con un correo real que ese alias existe y llega a una bandeja que alguien lee [no verificado; ver `docs/proveedores/improvmx.md`] antes del primer probador. Cuando se verifique `pintoria.app` en Resend, el cambio a `hola@pintoria.app` no necesita nueva revisión.

## 6. Acciones por responsable

| Quién | Acción | Cuándo |
|---|---|---|
| Juan | Código aleatorio en lugar de `PROMO2026` (P1); lista de probadores fuera del repo y mensaje de invitación (P2, P3); comprobar el alias `soporte@lumen-labs.co`; confirmar que nunca hubo un pedido real con `v4` | Antes del primer código |
| Juan | Abrir las políticas de openai.com en un navegador y avisarme de diferencias; completar la verificación de la organización; pedir retención cero nombrando `gpt-image-2.5`; autorizar `safety_identifier` | Antes de usar un 2.5 y antes del primer cobro |
| `arquitecto` | v5 (sección 1, sin `engines/`); variante de código (P4, con `engines/`); `commercialAllowed` falso en pedidos con código (P5); prueba del prompt "identical copy"; `safety_identifier`; guardar versión y hash al aceptar; alerta humana de moderación | v5 y P4 en horas; el resto antes del cobro (P5 antes del 15-nov) |
| `qa-redteam` | Probar que un pedido con código registra K1 y K2 con ids `v5` (y `v5-code` tras P4); que las 3 fotos de cada persona se borran; que no sale ningún correo comercial a pedidos de prueba; el recorrido de bloqueo de moderación | Antes de abrir códigos |
| `legal-compliance` | Revisar la variante ya implementada; releer openai.com cuando haya acceso; actualizar el cambio en `docs/legal/subencargados.md` (hecho: fotos por persona) | Al implementarse |

## 7. Lo que sigue pendiente antes de cobrar a clientes reales (no cubierto aquí)

Aprobación escrita del paquete completo de `colorear-legal-v5` (K1, K2, aviso, términos y privacidad, que `colorear.ts` marca "pending written approval before real charges"); `LEGAL_HOLDER`, `LEGAL_ADDRESS` y `LEGAL_EFFECTIVE_DATE` reales; DPA y lista de subencargados vigentes; retención cero de OpenAI solicitada; condiciones 4 y 6 de `openai.md`; relectura de las políticas de openai.com; revisión de abogado humano (sección 8). Y una pasarela de cobro aprobada: sin cargo real no hay consentimiento parental verificable.

## 8. Para el abogado humano (presupuesto $400) y no verificado

- COPPA: ¿aplica cuando es un adulto quien sube las fotos de sus hijos? Si aplica, ¿basta el cargo de tarjeta como método verificable? Alcance de los pedidos de prueba sin cargo.
- Varias fotos del mismo rostro desde distintos ángulos tratadas por un modelo de terceros: leyes biométricas de EE. UU. (Illinois BIPA, Texas, Washington). El aviso dice que no creamos plantillas ni bases de rostros; si el proveedor lo hace internamente, [no verificado].
- Pendiente de comprobar: valor de `OPENAI_IMAGE_MODEL` en Vercel (si no está definido, se usa el mini), texto vigente de las políticas de openai.com, existencia del alias de soporte.

## 9. Revisión de implementación (25-oct)

`legal-compliance` · commits `37fa0fa` (v5, variante de código, sin ofertas en pedidos de prueba, remitente de soporte, prueba del prompt) y `e1db995` (fotos de cualquier tamaño, HEIC en el navegador). Leí los diffs, `packages/legal/src/colorear.ts`, `engines/generate/src/engine.ts`, `ColorearForm.tsx`, la página de inicio, `photo-prep.ts` y `node_modules/heic-to`. Volví a ejecutar `legal.test.ts`, `colorear-test-code.test.ts`, `colorear-brand.test.ts` y `colorear-mailboxes.test.ts`: pasan (60 pruebas con el árbol de trabajo; 34 de las tres últimas suites sobre `main` en `f989f3d`). Con solo `37fa0fa`, `colorear-brand.test.ts` fallaba porque dependía del cambio del buzón de privacidad; `arquitecto` lo confirmó después en `f989f3d` y `main` queda en verde. No ejecuté la aplicación en un navegador.

| # | Pregunta | Veredicto |
|---|---|---|
| 1 | Textos P4 y ids | **Conforme.** Las tres frases de la variante (aceptación "Al usar el código...", "a quien conocemos personalmente..." y "en un pedido de prueba no hay cobro...") son las aprobadas, en es-419, es-ES y en. K2 se guarda como `08-K2-<idioma>-colorear-v5-code` (texto y hash de la variante) en `consents`, y el evento `consent_given` lleva ese id. La línea de reembolso se oculta con código y vuelve al borrarlo. |
| 2 | Pedido normal | **Conforme, sin cambios.** Registra K1 y K2 con ids `...-colorear-v5` ("Al pagar...") y conserva la línea de reembolso. Lo cubre `tests/colorear-test-code.test.ts`. |
| 3 | LGPL-3.0 de `heic-to` | **Hace falta un aviso y un ajuste de entrega. No bloquea el piloto cerrado; sí es obligatorio antes de abrir al público o cobrar.** Detalle abajo. |
| 4 | Lo que aún bloquea el piloto | **Corregido por la tarde: ver el último párrafo de 9.3 (fotos de menores de 13 con OpenAI).** Al escribir esta fila: nada de mi tabla, salvo una condición nueva (abajo): el buzón `privacidad@pintoria.app`, contacto del aviso, tiene que recibir correo (alias de Juan) y `f989f3d` tiene que estar desplegado. Además de los puntos de Juan. |

### 9.1 Observaciones sobre lo implementado

- **El servidor decide la variante**, no el navegador: K1/K2 y el hash salen de `isTestCodeOrder` (código válido). El aviso que ve el probador se elige en el formulario según el código escrito. Los dos coinciden: con un código inválido el servidor devuelve el error `code: "invalid"` y no crea el pedido (`engine.ts`, validación previa).
- **Un hueco ya conocido, que no bloquea:** el id del aviso (`...-code`) no se guarda en ningún registro; el único rastro de que se mostró la variante es el id `v5-code` de K2. Por eso la variante del aviso y K2 deben cambiar siempre juntas. Cuando `arquitecto` guarde versión y hash al aceptar (condición del cobro), conviene guardar también el id del aviso.
- **P5 (sin ofertas a pedidos de prueba):** `commercialAllowed` es falso para el pedido con código y para las aventuras gratuitas de su Trío; el correo de entrega y el recordatorio salen solo con la parte transaccional. Está probado. Cumple LSSI art. 21.2 y PECR reg. 22.
- **El reembolso de un pedido de prueba** cancela y borra sin llamar al proveedor de pago, y el correo dice que no se cobró nada. Probado.
- **Recibo del pedido de prueba:** sale con el asunto "Pedido de prueba sin costo" y sin cargo (`tests/colorear-test-code.test.ts`, es y en). Que su cuerpo repita los datos del aviso, como promete la variante, no lo comprobé línea por línea [no verificado; lo cubre `qa-redteam`]. Sigue valiendo lo dicho en la sección 2: sin cargo real no es consentimiento parental verificable; solo piloto cerrado.

### 9.2 LGPL-3.0 de `heic-to` (pregunta 3)

**Qué se entrega.** `photo-prep.ts` hace `import("heic-to/csp")` solo cuando el navegador no abre un HEIC. El navegador del probador descarga entonces `heic-to` 1.6.6 (Hopper Gee, licencia LGPL-3.0 en su `package.json`), que según su README contiene libheif 1.23.6 y libde265 1.0.16 compilados con emscripten (receta del README: `USE_WASM=0`, es decir JavaScript, unos 3 MB; sin cabecera de licencia en `dist/csp/heic-to.js`). Las páginas oficiales de libheif y libde265 (leídas el 25-oct) dicen que ambas bibliotecas se distribuyen bajo la GNU Lesser General Public License. Una búsqueda de cadenas no encontró `x265` ni `libaom` en el archivo (el GPL de x265 sería un problema mayor) [comprobación parcial: no desensamblé el binario].

**Por qué no basta con "es un módulo separado sin modificar".** Es cierto que no hay que abrir el código de la web por usar una biblioteca LGPL sin modificarla. Pero entregar la biblioteca al navegador es distribuirla, y la LGPL-3.0 §4 pide, a quien la distribuye dentro de una obra combinada: (a) un aviso destacado de que se usa y está bajo esa licencia; (b) una copia de la LGPL-3.0 y de la GPL-3.0; (d) o bien dar lo necesario para volver a enlazar con una versión modificada de la biblioteca, o bien usar un mecanismo de biblioteca compartida (un archivo aparte que se pueda sustituir). Además, el código fuente de la biblioteca tiene que estar disponible (GPL-3.0 §6(d)). Hoy el empaquetador de Next mezcla `heic-to` en un fragmento minificado de la web y borra los comentarios de licencia, así que no se cumple ni (a) ni (b) ni (d).

**Qué añadir y dónde** (lo hace `arquitecto`, salvo los textos que redacto aquí):

1. **Entregar `heic-to` como archivo aparte y sin modificar.** Copiar `node_modules/heic-to/dist/csp/heic-to.js` en el build a `apps/web/public/vendor/heic-to/1.6.6/heic-to.js` (con el número de versión en la ruta) y cargarlo con `import(/* webpackIgnore: true */ "<esa ruta>")` en lugar del import empaquetado. Sin minificar de nuevo ni recortar. Junto al archivo, `NOTICE.txt` con el nombre, la versión, la licencia y el enlace a la página de licencias. Esto es lo más cercano al mecanismo de biblioteca compartida de §4(d)(1) para una página web [no verificado: si basta para "usa en ejecución una copia ya presente en el equipo del usuario", es pregunta para el abogado].
2. **Página `licencias`** en `apps/web/src/app/(colorear)/colorear/[lang]/licencias/page.tsx` (es y en), con enlace en el pie de `Chrome.tsx` al lado de privacidad y términos. Texto (es):
   > "Licencias de código abierto. Cuando una foto en formato HEIC no se puede abrir de otra manera, esta página descarga en su navegador un componente de código abierto para convertirla en su dispositivo: heic-to 1.6.6, que incluye libheif 1.23.6 y libde265 1.0.16. Los tres se distribuyen bajo la GNU Lesser General Public License, versión 3 (LGPL-3.0). Los usamos sin modificarlos, en un archivo aparte que usted puede sustituir por otra versión compatible: {URL del archivo}. Texto de las licencias: LGPL-3.0 {URL} y GPL-3.0 {URL}. Código fuente de estas versiones: {URL de la copia propia}; también en https://github.com/hoppergee/heic-to, https://github.com/strukturag/libheif y https://github.com/strukturag/libde265. Estas licencias no restringen su derecho a modificar el componente ni a analizarlo para depurar esas modificaciones. Para pedirnos el código fuente: {EMAIL_SOPORTE}."
   
   En (en): "Open-source licences. When a photo in HEIC format cannot be opened any other way, this page downloads an open-source component into your browser to convert it on your device: heic-to 1.6.6, which includes libheif 1.23.6 and libde265 1.0.16. All three are distributed under the GNU Lesser General Public License, version 3 (LGPL-3.0). We use them unmodified, as a separate file you can replace with a compatible version: {file URL}. Licence texts: LGPL-3.0 {URL} and GPL-3.0 {URL}. Source code of these versions: {own copy URL}; also at the three GitHub addresses above. These licences do not restrict your right to modify the component or to reverse engineer it to debug those modifications. To ask us for the source code: {EMAIL_SOPORTE}."
3. **Textos de licencia y fuente alojados por nosotros:** `apps/web/public/licenses/LGPL-3.0.txt` y `GPL-3.0.txt` (los textos oficiales de gnu.org, no el `LICENSE` del paquete, que lleva un preámbulo propio) y `apps/web/public/licenses/source/` con el paquete npm `heic-to-1.6.6.tgz` y los archivos de código de libheif v1.23.6 y libde265 v1.0.16. Alojarlos nosotros evita depender de GitHub durante todo el tiempo que se use el componente (GPL-3.0 §6(d)).
4. **Avisos de copyright:** copiarlos tal cual de los archivos `LICENSE`/`COPYING` de cada proyecto; yo no abrí los de libheif y libde265 y no pongo nombres de titulares a ciegas [no verificado].
5. **Los términos no deben añadir nunca una cláusula contra la ingeniería inversa o la modificación del software** (la LGPL §4 la prohíbe para las partes de la biblioteca). Hoy no la hay: "Uso del libro" solo habla del libro.
6. **Lista de licencias de terceros** (la que pidió `pendientes-cuentas.md`; aún no existe un archivo propio, así que queda esta entrada y creo `docs/legal/licencias-terceros.md` en otro commit si se quiere): `heic-to` 1.6.6, LGPL-3.0, se entrega al navegador solo para HEIC no legible, sin modificar, archivo aparte; libheif 1.23.6 y libde265 1.0.16, LGPL, dentro de `heic-to`. `sharp` y su libvips (LGPL) corren en el servidor y no se entregan al usuario, así que no generan estas obligaciones [no verificado: no revisé el árbol completo de dependencias; hacerlo antes del lanzamiento público].

**Cuándo.** No bloquea el piloto cerrado: no afecta a datos de ningún probador, el riesgo es de cumplimiento frente a los titulares de la licencia y se cura añadiendo lo anterior. Lo dejo condicionado: **obligatorio antes de abrir al público o cobrar**, y recomendado en el mismo despliegue que el piloto porque cuesta poco. Si se prefiere no mantener esto, la alternativa es quitar `heic-to` y pedir al probador que suba JPEG (en iOS el campo ya entrega JPEG): lo decide `arquitecto` con Juan; para mí vale cualquiera de las dos.

**Para el abogado humano:** si un archivo aparte cargado por una página web cumple el mecanismo de biblioteca compartida de la LGPL-3.0 §4(d)(1) o si hace falta ofrecer también el código para volver a enlazar; si "información de instalación" (GPL-3.0 §6) aplica a una aplicación web.

### 9.3 Lo que queda para abrir el piloto cerrado (pregunta 4)

| Quién | Acción | Estado |
|---|---|---|
| Juan | Código aleatorio (P1), lista de probadores fuera del repo (P2), mensaje de invitación con el "Acepto" (P3) | Suyo; no lo bloqueo |
| Juan | Comprobar que `soporte@pintoria.app` reenvía a su Gmail con un correo real | Suyo |
| Juan | **Nuevo:** crear en ImprovMX el alias `privacidad@pintoria.app` (o un catch-all) hacia su Gmail y probarlo | Condición del piloto: el aviso y la página de privacidad son el contacto para ejercer derechos, y `privacidad@lumen-labs.co` no recibe correo |
| `arquitecto` | Cambio de `COLOREAR_PRIVACY_EMAIL` en `f989f3d` (con `tests/colorear-mailboxes.test.ts`, verde en `main`); falta que esté desplegado | Hecho en código; despliegue es condición del piloto |
| Juan | Confirmar que `OPENAI_IMAGE_MODEL` no está definida en Vercel o es `gpt-image-1-mini` (lo que sirve hasta el 1-dic-2026); un modelo 2.5 solo tras releer las políticas | Suyo |
| `qa-redteam` | Su propia aprobación escrita (su informe en `docs/qa/` sigue sin confirmar): ids `v5`/`v5-code`, borrado de las 3 fotos por persona, sin correo comercial, bloqueo de moderación | No es mía; no sustituyo la suya |
| Todos | LGPL (9.2) | Antes del público; recomendado ya |
| `arquitecto` | `safety_identifier`, guardar versión y hash al aceptar, alerta humana de moderación, P5 antes del 15-nov | Antes del primer cobro, no del piloto |

**Visto bueno final para el piloto cerrado:** concedido sobre lo revisado (P4, v5 y P5), condicionado al alias `privacidad@pintoria.app` con `f989f3d` desplegado y a los puntos de Juan.

**Corrección posterior del mismo día (tarde): el visto bueno queda suspendido para fotos de menores de 13 años enviadas a OpenAI.** Al releer las políticas de OpenAI aparecieron la cláusula §2(c) de sus Business Terms y su guía de API para menores, que piden retención cero (ZDR) antes de procesar datos personales de menores de 13. La lectura del 19-oct no la tuvo en cuenta (mi error) y la sección 3 de este documento no la contempla. Vale igual para `gpt-image-1-mini` que para los modelos 2.5. Qué sigue en pie: los textos (v5, variante de código, P5) y las condiciones de buzones. Qué se suspende: abrir el piloto con fotos de niños. Juan decide entre pedir ZDR y esperar, hacer el piloto solo con fotos de adultos, personas de 13 o más y mascotas, asumir por escrito el riesgo contractual, o el plan B (detalle y texto para ventas de OpenAI en `docs/proveedores/openai.md`, sección «Relectura 25-oct-2026 (tarde)»). Sigue sin autorizar cobros, anuncios ni uso público (sección 7). No es asesoría de abogado.
