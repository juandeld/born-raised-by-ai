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
