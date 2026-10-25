# QA y red team: código de prueba, 3 fotos por persona y remitente Pintoria (colorear)

`qa-redteam` · 25-oct-2026 · commits `cc3688c` (código de prueba), `0fa29f9` (hasta 3 fotos por persona), `d4d9895` (remitente y reply_to). Aprobación legal previa: `docs/legal/aprobaciones/colorear-codigo-prueba-3-fotos.md` (`9c3d150`).

**Método y límites (leer primero).** Todo se probó en local, sin pedidos en producción y sin gasto en la API real. Servidores `next dev` sobre un snapshot limpio de `git archive HEAD` (puertos 3211 a 3214, datos aislados con `MOCK_DB_FILE`, `MOCK_STORAGE_DIR` y `MOCK_UPLOADS_DIR`), motor de imagen mock, correo mock y pago mock. Para medir cuántas llamadas "reales" de imagen saldrían, usé un doble local de la API en `127.0.0.1` con clave falsa que solo cuenta peticiones y no reenvía nada. Navegador: Chromium headless a 390 x 844 con Playwright. Pruebas de motor con `tsx` sobre base en memoria.
**Qué NO se probó:** el build de producción (`next build`), Supabase con concurrencia real, Resend real, OpenAI real (costo y moderación), un iPhone o un Android reales, ni los valores de las variables de entorno de Vercel (no tengo acceso). Todo lo que depende de eso va como `[no verificado]` en la sección 6.
**Versión probada.** Hice la pasada completa sobre el código de los tres commits (HEAD `c2a462d`; `9c3d150` solo añadió la aprobación legal, sin código). Mientras trabajaba entraron más commits y repetí lo que tocan: `e1db995` (preparación de fotos en el navegador: formulario de fotos repetido entero) y `37fa0fa` (legal v5, variante de consentimiento del código, sin ofertas en pedidos de prueba, correo de soporte de Pintoria: repetí consentimientos, recordatorio, formulario con código, suite y `tsc`). Después entraron `f989f3d` (buzón de privacidad de Pintoria, con su prueba de buzones) y `ca9ff01` (revisión de legal de v5): de esos dos solo corrí la suite y `tsc` completos; no repetí pruebas manuales. HEAD al cierre: `ca9ff01`, con el árbol de trabajo limpio.

## 1. Dictamen

| Alcance | Veredicto |
|---|---|
| **Global** | **APROBADO CON CONDICIONES**, solo para el piloto cerrado con código. No aprueba ningún uso público ni cobrar. |
| `cc3688c` código de prueba | Aprobado con condiciones. El mecanismo es sólido (comparación en tiempo constante, topes en base de datos que fallan cerrados, el código no sale al navegador, logs, analytics ni correo). Las condiciones son de configuración y de lo que lo rodea (F1, F2, F6). F3 (correo comercial a pedidos de prueba) ya quedó corregido en `37fa0fa` y verificado. |
| `0fa29f9` 3 fotos por persona | Aprobado con condiciones. Cumple tamaño, borrado en todos los caminos y cabe en 4,5 MB. Dos defectos del servidor a corregir (F4 fotos huérfanas, F5 imagen "bomba"). |
| `d4d9895` remitente | **Aprobado.** Ningún correo de colorear dice Jinglo ni nombra proveedores. Una nota: su `reply_to` apuntaba a `soporte@lumen-labs.co`, un dominio sin registros MX según el mensaje de `37fa0fa` (las respuestas rebotaban); `37fa0fa` lo cambia a `soporte@pintoria.app`. La entrega real de ese buzón `[no verificado]`. |
| Pago simulado público | **Recomiendo apagarlo ahora** (sección 3). Es el hallazgo más grave y ya existía antes de los tres commits. |

No encontré ningún fallo de seguridad infantil de contenido. El camino de moderación (foto rechazada por el proveedor) no reintenta, borra todo, dibuja desde la descripción y avisa de forma neutra.

## 2. Condiciones antes de entregar el primer código

Bloqueantes (sin ellas no se da ningún código):

| # | Condición | Quién | Verificación |
|---|---|---|---|
| B1 | Código **aleatorio de 12 caracteres o más** en lugar de `PROMO2026` (también lo exige legal, P1). Ejemplo de forma, no un valor: `openssl rand -hex 8`. Definir `PHONE_HASH_SALT` y `COLOREAR_LINK_SECRET` en Production (si faltan, el código usa constantes públicas del repositorio, ver F2). | Juan | Panel de Vercel: las tres variables existen y el código no es `PROMO2026` (QA no hace pedidos en producción) |
| B2 | **Cerrar el pago simulado público** (sección 3). Si el mismo día no se puede, mínimo: `COLOREAR_MOCK_REAL_DAILY_CAP=0` y borrar `COLOREAR_TEST_EMAILS`, y entonces el piloto **no** cuenta como cerrado. | Juan (variable) y arquitecto (rechazo temprano) | Local: con `VERCEL_ENV=production` sin `ALLOW_MOCK_PAYMENTS`, cinco rutas dan 404 (verificado) |
| B3 | Topes bajos, por costo (F6). Los topes son **por código**, no globales, y un Trío son 3 libros por 1 uso: usar un solo código con `COLOREAR_TEST_CODE_MAX_USES=10` y `COLOREAR_TEST_CODE_DAILY_CAP=3`, o pocos códigos con topes que sumen 10. Legal ya no exige el máximo de 10 en total (la variante P4 está implementada y su revisión, `ca9ff01`, la declara conforme), así que es una recomendación de costo, no un bloqueo legal. | Juan | Leer los eventos `test_code_redeemed` (campos `uses_total`, `max_uses`) |
| B4 | Confirmar en Vercel Production y Preview: `TELEPHONY_PROVIDER` en `mock` (o Santa sin tráfico), `OPENAI_API_KEY` **no** cargada en Preview, `OPENAI_IMAGE_MODEL` vacío o `gpt-image-1-mini`, `PUBLIC_BASE_URL` y `COLOREAR_PUBLIC_URL` correctos, y que `soporte@pintoria.app` y `privacidad@pintoria.app` reciban (los buzones que ahora usan `reply_to` y el aviso; legal condiciona su visto bueno al segundo con `f989f3d` desplegado). | Juan | Panel de Vercel y un correo de prueba a cada buzón |

Ya cumplido y verificado por QA en `37fa0fa` (antes eran condiciones con fecha): `colorear-legal-v5`, variante `v5-code` del consentimiento (F3 y P4 de legal) y `commercialAllowed` falso para pedidos con código. Detalle en 5.1.

Con fecha o disparador:

| Antes de | Condición |
|---|---|
| Abrir a más gente o cobrar | F4, F5, F6, y las pruebas que dejo en la sección 7. Además, la revisión de legal de la variante implementada. |

## 3. Recomendación sobre el pago simulado público

**Sí: apagarlo ahora que existe el código.** Con `ALLOW_MOCK_PAYMENTS=1` en Production cualquiera, sin código y sin tarjeta, puede crear pedidos que se "pagan" solos. Lo medí así (servidor local con `VERCEL_ENV=production`, `ALLOW_MOCK_PAYMENTS=1`, `IMAGE_PROVIDER=openai` apuntando al doble que cuenta):

| Qué hace un desconocido | Resultado medido |
|---|---|
| `POST /api/colorear/checkout` sin código, luego `GET` (303 a `/pago-prueba`) y `POST /api/mock-pay` con `outcome=success` | Libro entregado. Los pedidos 1 a 3 del día UTC usan el motor real (24 llamadas de imagen cada uno, 72 en total); del 4.º en adelante, dibujos de muestra (0 llamadas). Costo: unos $1,59 al día, unos $48 al mes si alguien lo repite a diario. |
| Mismo flujo (sin código, con el pago simulado) usando un correo que está en `COLOREAR_TEST_EMAILS`, con `COLOREAR_MOCK_REAL_DAILY_CAP=0` | **Sin tope**: 4 de 4 pedidos con 24 llamadas reales cada uno (los desconocidos con otros correos: 0). Quien sepa o adivine ese correo gasta sin límite. |
| Escribe el correo de otra persona y un nombre ofensivo | La víctima recibe, desde "Pintoria", "Gracias por su compra. Este correo confirma el cobro de MX$229..." y "Su libro para colorear de Tonto ya está listo". Recibo falso de un cobro que no existe, con la marca y el dominio de envío del proyecto. |
| Sube fotos de niños | Se aceptan y se procesan sin ninguna verificación. Rompe la premisa del piloto cerrado de legal (sección 2 de su aprobación: solo adultos que Juan conoce). |
| `POST /api/webhooks/mock` con `{type:"payment_succeeded", orderId}` | 200. No exige `checkout`; equivale al mismo pago gratis. |

**Qué cambiar (no lo toqué):**

1. **Variable.** En Vercel, proyecto de producción: **borrar `ALLOW_MOCK_PAYMENTS`** (o dejarla vacía) y redesplegar. Es la que decide `mockPaymentsAllowed()` en `apps/web/src/lib/engine.ts`. Verificado en local con `VERCEL_ENV=production` y sin esa variable: `GET` y `POST /api/mock-pay`, `POST /api/webhooks/mock`, `GET /pago-prueba` y `POST /api/dev/run-call` dan 404; **el código de prueba sigue funcionando** (200 y libro `ready`).
2. **Orden seguro.** (a) Cargar el código aleatorio en `COLOREAR_TEST_CODES` y redesplegar. (b) Que Juan haga **él** un pedido con el código en producción (yo no hago pedidos en producción). (c) Recién entonces borrar `ALLOW_MOCK_PAYMENTS` y redesplegar. Si se invierte el orden, el sitio queda cerrado, que es seguro, solo que nadie puede probar.
3. **Cambio de código pequeño (arquitecto, flujo de pago).** Hoy, con el pago cerrado, un checkout sin código **responde 200** con una URL de `/api/mock-pay` que da 404, y deja guardado un pedido `created` con sus fotos hasta el barrido de las 2 horas (verificado: a 1 h 54 siguen, a 2 h 06 se cancelan y se borran). No hay fuga, pero la persona que entra sin código sube fotos y ve un 404. Propuesta exacta: en `apps/web/src/server/api/colorear-checkout.ts`, después de leer `form` y **antes** del bucle de fotos:

   ```ts
   if (!String(form.get("code") ?? "").trim() && getColorear().d.payments.name === "mock" && !mockPaymentsAllowed()) {
     return json({ ok: false, errors: { code: "required" } }, 403);
   }
   ```

   más los textos `code_required` en `colorear-copy.ts` (es: "Pintoria está en prueba privada: necesitas un código."; en: "Pintoria is in private testing: you need a code.") y que la página pase al formulario un indicador `paymentClosed` para abrir de entrada el campo del código y ocultar el botón "Pagar". Importa `mockPaymentsAllowed` de `@/lib/engine`.
4. **Efectos colaterales.** `mockPaymentsAllowed()` también gobierna a Santa (Jinglo): con el pago simulado cerrado en producción, Juan no podrá probar Santa de punta a punta en producción (sí en Preview, donde `VERCEL_ENV` no es `production` y el pago simulado siempre está abierto). Mientras Santa no se lance es aceptable. Ver además B4: si `TELEPHONY_PROVIDER` fuera real en producción, el pago simulado abierto permitiría pedir llamadas gratis a cualquier número (el modo prueba acepta cualquier teléfono E.164).
5. **Alternativa mínima (no recomendada como final).** `COLOREAR_MOCK_REAL_DAILY_CAP=0` y borrar `COLOREAR_TEST_EMAILS`: corta el gasto de los desconocidos, pero deja abiertos los recibos falsos, los libros de muestra ilimitados y la subida de fotos de niños sin verificación.

## 4. Hallazgos por gravedad

Frecuencia: "siempre" = reproducible el 100 % de las veces en local.

| Id | Gravedad | Hallazgo | Frecuencia | Quién arregla |
|---|---|---|---|---|
| F1 | **Alta** | Pago simulado público en producción (sección 3) | Siempre | Juan + arquitecto |
| F2 | **Alta** (si se usa `PROMO2026` o falta la sal) | Código adivinable y sal pública de respaldo | Siempre | Juan |
| F3 | Media (**corregido** en `37fa0fa`, verificado) | Recordatorio del día 25 con bloque comercial para pedidos con código (legal P5) | Siempre, en `9c3d150` | Hecho |
| F4 | Media | Fotos huérfanas si una subida falla con otras en vuelo | Determinista en la prueba; en producción depende de un fallo de almacenamiento | Arquitecto |
| F5 | Media | Imagen "bomba de píxeles" en el checkout público | Siempre | Arquitecto |
| F6 | Media | Topes por código y por pedido, no por libro ni globales | Siempre | Arquitecto |
| F7 | Baja | `/api/health` público nombra proveedores y modelo | Siempre | Arquitecto |
| F8 | Baja | Un probador sin código cae en una página "Jinglo" | Siempre (código) | Arquitecto |
| F9 | Baja | Pedido de prueba: la página de reembolso promete "devolvemos todo el pago" | Siempre | Arquitecto |
| F10 | Baja | `instanceof ColorearValidationError` frágil: código erróneo da 500 en dev | Solo `next dev` | Arquitecto |
| F11 | Baja | Freno por IP en memoria, por instancia | Por diseño | Sin acción si B1 se cumple |
| F12 | Baja | `state.json` queda en el almacenamiento tras la purga | Siempre | Arquitecto, con legal |
| F13 | Baja | Botón "Quitar" de 41 x 44 px a 390 px | Siempre | Diseño |
| F14 | Baja | La portada de colorear es indexable durante el piloto | Siempre | Arquitecto |
| F15 | Info (**resuelto** en `37fa0fa`) | Prueba nueva sin commit de otro agente fallaba | Siempre, en el árbol sin commit | Hecho |

### F1. Pago simulado público
Ver sección 3 (pasos y arreglo).

### F2. Código adivinable y sal pública de respaldo
- `docs/arquitectura/pendientes-cuentas.md` sugiere `PROMO2026`. En una lista de 6 candidatos (`PRUEBA`, `AMIGOS`, `PINTORIA`, `PROMO2025`, `PROMO2026`, `FAMILIA`) acierta al quinto intento.
- El freno por IP corta en el intento 9 desde una misma IP (8 por minuto del checkout, luego 429 también con el código correcto). Pero rotando la cabecera `X-Forwarded-For`, 30 de 30 intentos no activaron ningún freno. Eso solo es posible fuera de Vercel (la plataforma reescribe la cabecera, `[no verificado]`); en Vercel el freno aplica por IP, aunque por instancia (F11).
- `testCodeHash`, `COLOREAR_LINK_SECRET` y el hash de correo usan `PHONE_HASH_SALT ?? "dev-only-salt-change-me"` y `COLOREAR_LINK_SECRET || PHONE_HASH_SALT || "dev-only-colorear-secret"`. Si en Production no están definidas, esas constantes están en el repositorio: el hash de 10 caracteres que queda en `checkout_id` y en `test_code_redeemed` se recupera por diccionario para un código débil (probado con la sal por defecto), y los enlaces firmados de descarga y de ejecución se pueden forjar si se conoce un token.
- **Arreglo:** B1. Con un código aleatorio de 12 caracteres o más y la sal definida, no hay ataque práctico: ni el freno ni el hash importan. Mejora de código opcional: que `colorearTestCodes` ignore (o avise de) códigos de menos de 12 caracteres cuando `VERCEL_ENV=production`.

### F3. Correo comercial a pedidos con código (corregido en `37fa0fa`)
- En `9c3d150`: crear un pedido con código, avanzar el reloj al día 25 y llamar a `sweep()` daba un recordatorio con "Si quiere otra aventura, puede crearla con fotos nuevas aquí..." y "Este correo puede incluir ofertas (como máximo tres por pedido). Para no recibir más ofertas: .../api/colorear/baja?...". Eso es comercial sin venta previa (legal P5).
- `37fa0fa` añade en `commercialAllowed` la línea `if (await this.isTestCodeFamily(o)) return false;`. **Verificado**: repetí el mismo recorrido y el recordatorio ya solo trae la fecha de borrado, el enlace de descarga y el pie, sin ofertas ni enlace de baja. Cubre también las aventuras gratis del Trío por la comprobación de familia (lo declara su commit y la suite está en verde; el caso de un hijo del Trío no lo repetí a mano).
- Quedó una nota menor: el correo de entrega de un libro gratis del Trío no lleva precio ni reembolso, así que no hace falta que `testOrder` sea verdadero para esos libros.

### F4. Fotos huérfanas
- Pasos (prueba de motor): una persona con 3 fotos; el almacenamiento de fotos falla a los 5 ms en la subida de la foto 2 y la foto 3 tarda 80 ms. `createCheckout` lanza `storage 503`, no queda ningún pedido y queda `orders/<id>/photo-1-3.jpg` en el almacenamiento.
- Causa: `engine.ts`, `createCheckout`, `await Promise.all(...uploads.put...)`. Al primer fallo, `Promise.all` rechaza y el `catch` llama a `deletePhotos` mientras otras subidas siguen en curso; esas terminan **después** del borrado. Sin fila de pedido, ningún barrido las encuentra nunca.
- Importa porque el recibo promete "las fotos se borran... siempre antes de 24 horas" y son fotos de niños. Con 15 subidas en paralelo la ventana es mayor que con 5.
- Arreglo exacto: sustituir `Promise.all` por `Promise.allSettled`; si alguna fue rechazada, **esperar a que terminen todas**, llamar a `deletePhotos(id, photoCounts)` y relanzar el primer error. Defensa adicional: un barrido que liste el bucket `uploads` y borre objetos con más de 24 h sin pedido.
- Mitigación mientras no esté: durante el piloto, Juan revisa una vez por semana que el bucket de fotos esté vacío fuera de pedidos en curso.

### F5. Imagen "bomba de píxeles"
- Pasos: un PNG de 16000 x 16000 px (256 MP) pesa 30 KB en 1 bit o 729 KB en RGB: pasa el límite de 900 KB por foto y la comprobación de cabecera de `sniff`. Ejecuté la misma cadena de `sharp` que `prepareUpload` (`rotate`, `resize` a 1536, JPEG) sobre 15 copias en paralelo, que es lo que hace `createCheckout` con 5 personas x 3 fotos: 4,5 s (1 bit) y 5,1 s (RGB) de CPU y pico de memoria de 380 y 751 MB en una máquina de 2 núcleos; las 15 se aceptan. `sharp` admite por defecto hasta unos 268 MP, así que no las rechaza. (Lo corrí como guion aparte, no contra el endpoint de producción; el endpoint llama a esa misma función antes de cualquier pago.)
- Riesgo: sin código ni pago, unas pocas peticiones simultáneas pueden agotar la memoria de la función y tumbar a otros usuarios. El freno es de 8 por minuto por IP y por instancia.
- Arreglo exacto en `prepareUpload`: `sharp(Buffer.from(bytes), { limitInputPixels: 40_000_000, failOn: "error" })` (la foto que envía el navegador mide como máximo 2048 px de lado, es decir unos 4 MP) y procesar cada persona o foto con un tope de 3 en paralelo en lugar de las 15 a la vez. Con el límite, la bomba devuelve "Unreadable photo" (422).

### F6. Topes que no son de costo
- Los usos se cuentan por **pedido con código** (`testCodeOrders` filtra `payment_provider = 'test_code'`) y por **código** (el hash va en `checkout_id`). Un pedido Trío es 1 uso y produce **3 libros reales**: las dos aventuras gratis no cuentan (medido: "code uses counted: 1" tras crear las dos). Con los valores por defecto (50 usos, 10 por 24 h) el máximo realista por código es 50 x 3 x $0,53 = $79,50 y $15,90 por día, no los $26,50 y $5,30 que parece. Con k códigos todo se multiplica por k: **no hay tope global**. El tope de seguridad real de un libro es `COLOREAR_MAX_COST_USD` (por defecto $4), no $0,53.
- El costo de $0,53 se midió con 1 foto por persona; el commit `0fa29f9` dice que con 3 fotos por personaje **no hay medición real** (el paso de personaje envía hasta 3 imágenes de referencia). Tratarlo como `[no verificado]` y vigilar con `npm run costs`.
- Choque con legal: P1 pide "uno por persona o por grupo pequeño" y P4 pide "máximo 10 pedidos con código en total". Con topes por código, varios códigos suman más de 10.
- Arreglo exacto: variable `COLOREAR_TEST_TOTAL_MAX` (y opcional `..._TOTAL_DAILY`) que se compare contra **todos** los pedidos `test_code`, y contar el Trío como 3 usos. Interim sin código: B3.
- Lo que sí está bien: los topes se cuentan en base de datos, fallan cerrados (en las carreras nunca se superó el tope, ver sección 5) y un pedido reembolsado o purgado no devuelve el uso.

### F7. `/api/health` público
- `GET /api/health` responde sin autenticación `{"providers":{"payments":"mock",...},"colorear":{"image":"openai","model":"gpt-image-1-mini","story":...}}`. D23: nada que vea el cliente nombra proveedores o modelos; además avisa a un atacante de que el pago simulado está activo (F1).
- Arreglo: `apps/web/src/server/api/health.ts` devuelve `{ok:true}` salvo con cabecera secreta (la lista de verificación de despliegue envía la cabecera).

### F8. Página "Jinglo" para un comprador de Pintoria
- `/pago-prueba` vive en el grupo `(misc)` cuyo `layout.tsx` fija `title: "Jinglo"` y el icono `/jinglo/logo.svg`, y `GET /api/mock-pay` redirige a `PUBLIC_BASE_URL` (la base de Santa), no a `COLOREAR_PUBLIC_URL`. Un probador sin código ve "Jinglo" en la pestaña. Desaparece con F1; si el pago simulado se queda para Preview, usar `colorearPublicUrl()` para pedidos de colorear.

### F9. Texto de reembolso en pedidos de prueba
- La página `/colorear/reembolso/<token>` de un pedido con código dice "Devolvemos todo el pago, sin preguntas, y borramos el libro y las fotos" y la confirmación ofrece "Pedir reembolso". El motor hace lo correcto (cancela, borra, no llama al proveedor y el correo dice que no se cobró nada), pero el texto promete un pago que no existe. El estado ya expone `testMode`: mostrar "Cancelar y borrar mi pedido".

### F10. Fragilidad de `instanceof`
- Pasos (solo `next dev`): arrancar sin visitar ninguna página y enviar primero un checkout con código erróneo: 500 `{"errors":{"generic":"server"}}` y "checkout failed Invalid colorear checkout: code" en el log. Tras abrir las páginas, el mismo envío da 422 `{"errors":{"code":"invalid"}}`. La causa es que el módulo se carga dos veces en dev y `err instanceof ColorearValidationError` falla. En producción el bundle de la ruta es uno solo (`[no verificado]`: no corrí `next build`).
- Arreglo barato: en `colorear-checkout.ts` reconocer también por forma (`err && typeof err === "object" && "errors" in err`).

### F11, F12, F13, F14
- **F11.** `rateLimited` guarda en memoria de cada instancia; en Vercel con varias instancias el tope efectivo es mayor. Con B1 no importa para el código; sigue siendo un freno débil para F5.
- **F12.** Tras la purga a los 31 días el pedido queda `purged`, `details` nulo y fotos en cero, pero queda `colorear/<id>/state.json`. Contiene la historia con marcadores `{1}` y `{all}` y descripciones en inglés, sin nombres ni fotos, pero la historia nace del tema, que puede ser texto libre del comprador. Pedir a legal si debe borrarse con el pedido.
- **F13.** A 390 px el botón "Quitar" mide 41 x 44 px (el resto de los controles, 44 o más; las casillas de consentimiento, 24 x 24).
- **F14.** Ni la portada `/colorear/es` ni `/colorear/en` llevan `noindex` (sí lo llevan entrega, reembolso, comprar y baja). Mientras dure el piloto: `robots: { index: false, follow: false }` en `metadata` de `apps/web/src/app/(colorear)/layout.tsx`, y quitarlo al lanzar.

### F15. Prueba que fallaba en el árbol sin commit (resuelto)
Mientras trabajaba, `tests/colorear-photos.test.ts` tenía sin commit una prueba "the character prompt never asks for a photorealistic or identical copy" (la que pedía legal, condición 2) que fallaba porque `not.toMatch(/photo/i)` chocaba con "not photorealistic" del prompt de estilo. `37fa0fa` entró con la prueba corregida y la suite completa en verde.

## 5. Qué pasó y cómo se probó

### 5.1 Código de prueba (`cc3688c`)

| Prueba | Resultado |
|---|---|
| Fuerza bruta | Mismo IP: 8 respuestas 422 y luego 429 (también con el código correcto). Con la cabecera rotando (solo posible fuera de Vercel) sin bloqueo: F2. |
| Enumeración / oráculo | Código erróneo, función apagada y código absurdo dan el **mismo** cuerpo `422 {"errors":{"code":"invalid"}}` (tiempos 105 y 99 ms). Un formulario vacío con código **válido** no devuelve `code`, y con uno erróneo sí: es el oráculo normal, cubierto por el freno. |
| Mayúsculas y espacios | Aceptan `promo2026`, `PrOmO2026`, `  PROMO2026  `, `PRO MO 20 26`, tabulador, salto de línea, espacio de no separación y ancho completo. Rechazan espacio de ancho cero, guion, guion bajo, punto final, NUL, prefijo, sufijo, emoji, 65 caracteres y `' OR '1'='1`. |
| Vacío o función apagada | Con la variable apagada la portada **no** muestra el campo (es y en) ni contiene "PROMO". Código vacío o solo espacios = pedido normal. Parámetros raros (`*`, dos campos `code`, JSON, NUL) = 422. |
| Carreras en el tope | Motor, 10 escenarios con latencia aleatoria de base: nunca se superó el tope (ráfaga de 8 con tope 3 admitió 1 a 2; ráfaga de 10 sin latencia admitió 3). Falla cerrado: una persona puede recibir "agotado" y reintentar con éxito. HTTP: 6 peticiones simultáneas con tope 3 = 3 OK y 3 "exhausted"; pedido siguiente "exhausted"; base: 3 `test_code/paid` y 3 `test_code/cancelled`. Tope diario móvil: a +23 h 59 agotado, a +24 h 01 libre. `MAX_USES=0` y `DAILY_CAP=0` = agotado. Razonamiento: cada pedido se confirma antes de su propia relectura, por lo que dos pedidos no pueden ignorarse mutuamente; `[no verificado]` con Supabase real. |
| El código no se filtra | Portada es y en: sin valores. Paquete del cliente (`next dev`): sin los valores configurados; solo el nombre `COLOREAR_TEST_CODES` y, en un comentario de `normalizeTestCode`, el ejemplo `"promo 2026"` / `"PROMO2026"`, que el minificador de producción elimina (`[no verificado]`: sin `next build`). Conviene cambiar ese ejemplo por otro texto para que, aunque se filtrara, no coincida con el código sugerido. Registros del servidor, base, eventos, entregas, correos y claves de almacenamiento: sin el código ni normalizado. El hash de 10 caracteres solo está en `checkout_id`, `payment_id` y el evento `test_code_redeemed`; ningún correo lo lleva. |
| K1 y K2 | `[]`, `["K1"]`, `["K2"]`, `["K3"]` con código válido dan 422; `["K1","K2"]` da 200. En `37fa0fa` un pedido con código registra `08-K1-es-419-colorear-v5` y `08-K2-es-419-colorear-v5-code` en `consents` y en el evento `consent_given` (verificado por HTTP con 5 personas x 3 fotos; en `9c3d150` eran `-v4`). El formulario cambia al escribir un código: el botón dice "Usar mi código y crear el libro", la frase de K2 pasa a "Al usar el código, acepto los términos de servicio y la política de privacidad." (en: "By using the code, I accept the terms of service and the privacy policy.") y desaparece la línea de reembolso de 7 días del formulario (es y en). La portada y las preguntas frecuentes siguen diciendo "Reembolso automático por 7 días" (texto comercial general, fuera del formulario). |
| Trío con código | es sencillo y en Trío con 5 personas x 3 fotos (15 archivos) por HTTP: ambos llegan a `ready`, `testMode: true`; las dos aventuras gratis del Trío son reales, la tercera expirada falla como debe, cuenta 1 uso (F6). |
| No pasa como pago real | `test_mode: true`, `payment_provider: 'test_code'`, monto 0; excluido de conversiones (`meta.ts`) y separado en `npm run costs`. El reembolso cancela y borra sin llamar al proveedor y el correo dice que no se cobró nada (pruebas del repositorio y recorrido propio). Falla de texto: F9. |
| Recibos es y en | Las páginas de estado dicen "Modo de prueba: no se cobró nada" y "Test mode: nothing was charged". 128 correos compuestos (es y en, con y sin prueba, recibo, entrega, reembolso, recordatorio, con y sin extras): las variantes de prueba no muestran precio ni promesa de reembolso (la única coincidencia exige datos de oferta que el motor nunca pasa a un pedido de prueba). |

### 5.2 Tres fotos por persona (`0fa29f9`, formulario repetido en `e1db995`)

| Prueba | Resultado |
|---|---|
| 5 personas x 3 fotos (15 archivos), por interfaz y código | Las 15 miniaturas, cuerpo del envío de 2,57 a 3,09 MB (límite de Vercel 4,5 MB) con fotos de ruido de 4 MB cada una; 2,77 MB en inglés. Compresión en el navegador: 2,3 a 2,6 s la primera persona y 0,9 a 1,3 s cada siguiente (Chromium de escritorio, `[no verificado]` en un teléfono). Llegan a `ready`. |
| 3 archivos de una vez, quitar la del medio, volver a añadir, llenar el límite | 3 miniaturas; al quitar queda 2; con 2 libres y 3 archivos nuevos entran 2 más y sale "Máximo 3 fotos por persona."; quitar todas y volver a añadir funciona. |
| Archivos que no son fotos (`e1db995`) | PDF, texto con extensión `.jpg` y JPEG corrupto: rechazados con mensaje amable ("No pudimos abrir esa foto... haz una captura"), sin hablar de megabytes. 61 MB: "demasiado grande para abrirlo aquí". |
| HEIC (`e1db995`) | La muestra real del repositorio (`tests/fixtures/phone-sample.heic`) se convierte en 1,8 s en Chromium. Un archivo con extensión `.heic` falso da mensaje amable. En el commit `9c3d150` el formulario rechazaba HEIC con instrucciones; `e1db995` lo sustituye. **iPhone real: `[no verificado]`.** |
| Fotos grandes (`e1db995`) | JPEG de cámara 8000 x 6000 (14 MB) aceptado en 1,4 s; PNG de 8,6 y 12 MB aceptados; captura 1290 x 2796 aceptada; GIF animado acepta el primer cuadro. |
| Foto girada | Imagen de prueba 600 x 400 con la mitad izquierda roja y la derecha azul. Orientación EXIF 6: sale vertical (400 x 600) con el rojo arriba; 3: sale con el azul a la izquierda y el rojo a la derecha (giro de 180 grados); 8: vertical con el azul arriba y el rojo abajo. Las tres son correctas; la 6 también se comprobó en `9c3d150`. |
| Comodidad a 390 px | Sin desbordamiento horizontal; formulario de 5 personas de unos 10 300 px de alto, lineal. Lo único menor: F13. Una advertencia de consola de Canvas2D (`willReadFrequently`), inocua. |
| Servidor (HTTP directo) | 4 fotos de una persona = 422 "Too many photos for one person"; 3 + 3 = OK; foto extra sin foto principal = 422; foto de 1,2 MB = 422; texto como `.jpg`, GIF como `.jpg` = 422; cabecera JPEG con basura = 422 "Unreadable photo"; 6.ª persona se ignora; cuerpo JSON = 400; `GET` = 405. F5 es el hueco. |
| Borrado de todas las fotos | 15 guardadas; sin pagar: a 1 h 54 siguen (a propósito), a 2 h 06 borradas y pedido cancelado; pagado y sin generar + enlace de reembolso: 0 fotos, `refunded`; pagado y atascado 1 h: reembolso automático por barrido, 0 fotos; proveedor de imagen caído: el libro falla, se reembolsa, 0 fotos y evento `failed`; ejecución normal: fotos borradas al terminar los personajes (evento `photos_deleted` con `count: 15`); pagado a las 25 h: 0 fotos; 31 días después: pedido purgado, 0 fotos (queda `state.json`, F12). Un pedido antiguo sin `photoCounts` deja 10 de 15 por diseño: antes solo tenía 5. El hueco real es F4. |
| Moderación | Foto rechazada por el proveedor: una sola llamada con referencias por persona, nunca reintentada, 0 fotos al final, 2 eventos `content_blocked`, pedido entregado, aviso neutro que no menciona moderación ni seguridad. |

### 5.3 Correos (`d4d9895`)

- Remitente "Pintoria <hola@lumen-labs.co>" y `reply_to` de soporte: pruebas del repositorio (`colorear-email-sender`) en verde en `9c3d150` y en `37fa0fa`. Desde `37fa0fa` el `reply_to` y el pie de los correos son `soporte@pintoria.app` (`COLOREAR_SUPPORT_EMAIL`), no `soporte@lumen-labs.co`. Mi barrido de 128 correos y de las páginas se hizo en `9c3d150`; la suite de `37fa0fa` incluye `colorear-no-vendors` y las pruebas de remitente actualizadas.
- `tests/colorear-no-vendors.test.ts` en verde. Además, 128 correos compuestos por mí y 6 páginas (estado, entrega y reembolso, es y en) revisadas contra una lista de 15 nombres (Jinglo, OpenAI, Anthropic, Claude, gpt, ElevenLabs, Polar, Supabase, Vercel, Resend, Twilio, PostHog, mock y el código): ninguna coincidencia. Las únicas apariciones de "Jinglo" o de nombres de proveedores que un visitante de colorear puede ver están en F7 (`/api/health`) y F8 (`/pago-prueba`).
- Entrega fallida del correo (Resend en modo prueba solo envía a su dueño): el libro queda listo y descargable desde la página de estado (prueba del repositorio).

### 5.4 Suite

- Código de los tres commits (HEAD `c2a462d`; `9c3d150` solo añade documentos): `npm run test` 27 archivos, 258 pruebas, en verde. `tsc --noEmit` de la raíz y del paquete web: 0 errores.
- `e1db995` en snapshot limpio: 28 archivos, 268 pruebas en verde, `tsc` sin errores (incluye las 10 pruebas de preparación de fotos en Chromium real).
- `37fa0fa` en snapshot limpio: 28 archivos, 282 pruebas en verde, `tsc` sin errores.
- **`ca9ff01` (HEAD al cierre, árbol limpio): `npm run test` 29 archivos, 287 pruebas en verde; `tsc --noEmit` de la raíz y del paquete web sin errores; `tests/colorear-no-vendors.test.ts` 3 de 3.**

## 6. No verificado

| Qué | Por qué | Quién lo cierra |
|---|---|---|
| Valores de Vercel (`ALLOW_MOCK_PAYMENTS`, `COLOREAR_TEST_EMAILS`, `PHONE_HASH_SALT`, `COLOREAR_LINK_SECRET`, `TELEPHONY_PROVIDER`, `OPENAI_IMAGE_MODEL`, `PUBLIC_BASE_URL`) | Sin acceso al panel | Juan (B1 y B4) |
| Preview: `mockPaymentsAllowed()` es siempre verdadero fuera de `production` | Si la protección de despliegues de Vercel estuviera apagada, Preview sería un pago gratis público con motor real si tuviera `OPENAI_API_KEY` | Juan (B4) |
| Costo real con 3 fotos por persona | No hay clave real; `colorear:photo-cost` nunca corrió con la API | Juan, con tope de gasto |
| Supabase con concurrencia real, Resend real, OpenAI real | Solo bases en memoria y dobles locales | Primera prueba real de Juan |
| iPhone (Safari) y Android (Chrome) reales; velocidad de compresión de 15 fotos en un teléfono | Solo Chromium de escritorio emulado | Juan o su esposa, anotando el tiempo |
| Build de producción (`next build`) | Solo `next dev`; afecta a F10 | Arquitecto |
| Licencia LGPL-3.0 de `heic-to`, que `e1db995` carga en el navegador | Legal (`ca9ff01`): no bloquea el piloto cerrado, es obligatorio antes de abrir al público o cobrar (aviso de licencias, textos y fuente alojados) | `legal-compliance` y arquitecto |
| Que `soporte@pintoria.app` reciba y alguien lo lea (`37fa0fa` asume que ImprovMX lo reenvía; el anterior `soporte@lumen-labs.co` no tiene MX según ese commit) | No puedo enviar ni consultar correo real | Juan |
| Revisión de legal de la variante `v5-code` ya implementada | Lo pide su propio documento | `legal-compliance` |

## 7. Escenarios añadidos a la batería (se repiten en cada release de colorear)

1. Cerrar el pago simulado: con `VERCEL_ENV=production` sin `ALLOW_MOCK_PAYMENTS`, cinco rutas dan 404, el código sigue creando libros y un checkout sin código se rechaza **antes** de guardar fotos.
2. Carrera en el tope con el último uso (ráfaga de 6 con tope 3, y reintento posterior).
3. Subida parcial: almacenamiento que falla en la subida k de n; no deben quedar fotos (F4).
4. Imagen de 16000 x 16000 px en el checkout: respuesta 422 en menos de 1 s (F5).
5. Pedido con código y reloj en el día 25: el recordatorio no lleva bloque comercial (F3).
6. Trío con código: contar libros reales frente a usos y comprobar el tope global (F6).
7. Pedido con código en es y en: ids de consentimiento `v5-code` y recibo "Pedido de prueba sin costo".
8. Las tres vías de borrado de 15 fotos (barrido sin pagar, reembolso, pedido fallido) más moderación.

Los guiones que usé quedaron en el directorio temporal de la sesión (no están en el repositorio). Si el arquitecto o el líder los quieren como pruebas automáticas, el siguiente paso es llevarlos a `tests/qa/` en un PR aparte.

## 8. Pendiente mío

- Rúbrica de producto `docs/qa/colorear.md` (el código de `qa.ts` cita `docs/qa/colorear-rubrica.md` y `docs/dominio/colorear/paginas.md`, que no existen).
- Reprobar F1 (rechazo temprano), F4, F5 y F6 cuando el arquitecto los corrija.
