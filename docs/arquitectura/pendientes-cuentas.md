# Pendientes que requieren cuentas reales

Todo lo de abajo se probó solo con mocks. Marcado `[no verificado]` cuando un nombre de campo o comportamiento sale de la documentación y no de una llamada real.

## Por servicio

| Servicio | Qué falta probar |
|---|---|
| ElevenLabs Agents | Campos de la API al crear agente (prompt, `first_message`, variables dinámicas `{{child_first_name}}`, herramientas `end_call`/`mark_optout`/`flag_incident` con `x-agent-secret`, moderación de salida, retención mínima); voces por idioma; ajustes `speed`/`stability`/`style`; nombre exacto de la variable de duración; disponibilidad de Haiku 5.5; agente "Father Christmas" para en-GB (hoy se usa Santa en-US). Concurrencia 20 del plan Pro |
| Twilio | Llamada saliente real; voces Polly del preludio; detección de buzón (AMD); firma de webhooks con la URL pública; `TimeLimit` de 450 s; números por país (MX, ES, GB, US) y regulación de identificador de llamada; unión al agente de ElevenLabs |
| Polar | Productos por país y variante (`POLAR_PRODUCT_MAP`); nombres de campos del reembolso (`amount`, `tax_amount`) `[no verificado]`; webhook real con el secreto; Apple Pay y Google Pay en el checkout |
| Recurrente | Checkout GTQ, firma Svix y reembolso |
| Resend | Dominio verificado, SPF y DKIM, entrega a bandeja de entrada |
| Supabase | Aplicar migración de `packages/db`, buckets, políticas, cron de retención contra la base real |
| Vercel | Proyecto, variables por entorno, `VERCEL_ENV=production` (cierra el mock), región, LCP < 2,5 s medido |
| PostHog | Proyecto y clave; verificar el embudo |
| Inngest | Cuenta, claves y sincronización de `/api/inngest` |

## Decisiones y huecos de producto

- Bundle de dos llamadas: la segunda no es programable (una fecha y ventana por pedido). Desactivado salvo `BUNDLE_ENABLED=1`.
- Consentimiento C6 sigue con id "draft" hasta aprobación de `legal-compliance`.
- Titular, dirección y fecha de vigencia de las páginas legales (`LEGAL_HOLDER`, `LEGAL_ADDRESS`, `LEGAL_EFFECTIVE_DATE`); `legal-compliance` debe firmar la versión publicada.
- `qa-redteam` debe ejecutar `docs/qa/santa-escenarios.md` (33 escenarios) contra el agente real.
- Prueba de carga a 200 llamadas/hora y proveedor de respaldo de voz, LLM e imagen.
- Muestra de audio de la landing es un marcador de posición.

## DNS de `lumen-labs.co` en GoDaddy para Vercel

Primero añadir el dominio en Vercel (Project, Settings, Domains); Vercel muestra los valores exactos de su proyecto y esos mandan. Los habituales `[verificar contra Vercel]`:

| Tipo | Nombre | Valor | TTL |
|---|---|---|---|
| A | @ | 76.76.21.21 | 600 s |
| CNAME | www | cname.vercel-dns.com | 1 hora |

Borrar antes el registro A de "parking" de GoDaddy y el CNAME `www` existente. Para correo con Resend añadir los registros que muestre su panel (Domains): un TXT SPF (`v=spf1 include:amazonses.com ~all` o el que indique Resend, en el subdominio `send`), un TXT/CNAME DKIM (`resend._domainkey`) y, opcional, un TXT DMARC (`_dmarc`). Si ya existe MX o SPF del buzón de la empresa, no duplicar el SPF: combinarlo en uno solo.


## Estado 18-oct-2026 (noche)
- Supabase: proyecto creado, migración 0001 aplicada, llaves en Vercel.
- Vercel: desplegado en https://born-raised-by-ai-4ta9.vercel.app (root apps/web), PAYMENT_PROVIDER=mock.
- ElevenLabs: agente es-419 creado (agent_2601m58wfve0fdc9j1dbfm0v5fy8) con voz LykVXmiL9G4zV1CJHN2o. Faltan: ELEVENLABS_API_KEY en Vercel, agentes es-ES / en-US / en-GB, confirmación escrita del caso de uso.
- Pendientes de Juan: Twilio (SID, token, número), Resend (API key), lumen-labs.co DNS → Vercel, Polar y Recurrente (KYC), cuenta USD.

## Polar: productos de colorear (Pintoria)

Tres productos privados, cada uno con precios en 4 monedas (el checkout envía `currency` en minúsculas según el pedido, de `COLOREAR_PRICES`). Escalera aprobada por Juan el 19-oct (D25): 1 aventura, Trío y "otra aventura"; el Cinco no se lanza.

| Variante | Producto Polar | USD | GBP | EUR | MXN |
|---|---|---|---|---|---|
| `single` (1 aventura) | 3ccd6b75-f151-4c78-8910-9745523f410e | 12.99 | 9.99 | 11.99 | 229 |
| `bundle3` (Trío) | 75dae2e6-3d80-44e9-a956-f3683c876968 | 24.99 | 18.99 | 22.99 | 429 |
| `add1` (otra aventura, 48 h) | 3ec7f55e-eedd-4f37-b279-f33a72383216 | 9.49 | 7.49 | 8.49 | 169 |

```
POLAR_PRODUCT_MAP={"colorear:US:single":"3ccd6b75-f151-4c78-8910-9745523f410e","colorear:GB:single":"3ccd6b75-f151-4c78-8910-9745523f410e","colorear:ES:single":"3ccd6b75-f151-4c78-8910-9745523f410e","colorear:MX:single":"3ccd6b75-f151-4c78-8910-9745523f410e","colorear:US:bundle3":"75dae2e6-3d80-44e9-a956-f3683c876968","colorear:GB:bundle3":"75dae2e6-3d80-44e9-a956-f3683c876968","colorear:ES:bundle3":"75dae2e6-3d80-44e9-a956-f3683c876968","colorear:MX:bundle3":"75dae2e6-3d80-44e9-a956-f3683c876968","colorear:US:add1":"3ec7f55e-eedd-4f37-b279-f33a72383216","colorear:GB:add1":"3ec7f55e-eedd-4f37-b279-f33a72383216","colorear:ES:add1":"3ec7f55e-eedd-4f37-b279-f33a72383216","colorear:MX:add1":"3ec7f55e-eedd-4f37-b279-f33a72383216"}
```

- Los ejemplos de claves de Santa (`santa:<PAÍS>:single|bundle`) se mantienen en el mismo mapa. Las aventuras gratis del Trío (`credit`) no pasan por Polar: no hay producto.
- **Migración `packages/db/migrations/0004_colorear_variants.sql` (pendiente de aplicar en Supabase ANTES de cobrar el Trío o la oferta)**: amplía el `check` de `variant` (`bundle3`, `add1`, `credit`), agrega `parent_order_id` y un índice único para que dos clics no tomen el mismo crédito.
- Impuesto "incluido" en ES, UK y MX y precio visible igual a `COLOREAR_PRICES` en cada producto: `[no verificado]` en el panel de Polar.
- **Reembolso parcial del Trío** (un tercio por aventura no usada, D26): `polar.ts` envía `amount` sin `tax_amount` en reembolsos parciales `[no verificado]`; probar en sandbox. Si Polar lo rechaza, el motor no cambia nada y responde "escríbenos" (plan B de legal: reembolso total o nulo).
- Webhook `order.refunded`: un reembolso parcial iniciado por el motor llega de vuelta como ese evento; el motor lo ignora porque ya marcó `refunded_at` (no lo lee como reembolso total).
- Dominio: `pintoria.app` y `www.pintoria.app` (apex redirige 308 a www en Vercel). `COLOREAR_PUBLIC_URL` (por defecto https://www.pintoria.app) es la base de enlaces de correos, `success_url`, entrega y reembolso, y del canonical. `COLOREAR_HOSTS` (opcional) cambia los hosts que sirven Pintoria en la raíz.
- `PAYMENT_PROVIDER` sigue en `mock` hasta decisión de Juan.

## Código de prueba de colorear (pruebas de punta a punta sin pasarela)

Polar rechazó la cuenta (D27) y producción corre con `PAYMENT_PROVIDER=mock` + `ALLOW_MOCK_PAYMENTS=1`. Para que Juan, su familia y amigos prueben el flujo completo sin pagar y con el libro REAL (no los dibujos de prueba), el formulario acepta un código. **Las tres variables siguientes las carga Juan en Vercel (Production y Preview) y requieren un despliegue nuevo; el arquitecto no las cargó.**

| Variable | Valor sugerido | Qué hace |
|---|---|---|
| `COLOREAR_TEST_CODES` | `PROMO2026` | Lista de códigos separados por comas, sin distinguir mayúsculas ni espacios. **Vacía o ausente = función apagada**: el formulario ni siquiera muestra el campo y cualquier código responde "no válido". |
| `COLOREAR_TEST_CODE_MAX_USES` | `50` | Pedidos en total por código (se cuentan en la base: `orders.payment_provider='test_code'` con el hash del código en `checkout_id`). Al llegar, el código responde "agotado". Por defecto 50; `0` cierra el código. |
| `COLOREAR_TEST_CODE_DAILY_CAP` | `10` | Pedidos por código en cualquier ventana móvil de 24 h (no por día de calendario, para no depender de la zona horaria). Por defecto 10. |

Cómo funciona (aprobado por el arquitecto, flujo de pago):

- En la página de colorear, bajo el aviso de consentimiento, aparece el enlace discreto "¿Tienes un código?" / "Have a code?". Con un código escrito, el botón pasa a "Usar mi código y crear el libro".
- La validación es solo del servidor (`engines/generate/src/engine.ts` `createCheckout`, comparación en tiempo constante). El código nunca viaja al navegador (solo el indicador de encendido/apagado) ni se registra. Un código mal escrito y la función apagada dan la misma respuesta. Hay un freno por IP: 10 intentos con código cada 10 minutos.
- Con código válido el pedido se crea con `test_mode=true`, `payment_provider='test_code'`, monto 0 en la moneda del país, **sin llamar a la pasarela**, y `apps/web/src/server/api/colorear-checkout.ts` lo marca pagado con un evento interno `payment_succeeded` por el mismo `handleColorearPayment` que usan los webhooks (registro de consentimiento K1 y K2, recibo, evento `paid`, arranque de la generación). El navegador va directo a `/colorear/confirmacion/<token>`.
- K1 y K2 siguen siendo obligatorios. El recibo dice "Pedido de prueba sin costo" / "Test order, no charge" y no muestra ningún cobro ni promesa de reembolso.
- La generación es siempre real para estos pedidos y para las aventuras gratis de su Trío (los pedidos normales con pago simulado siguen limitados por `COLOREAR_MOCK_REAL_DAILY_CAP`, por defecto 3 al día). Funciona con 1 aventura y con Trío; las aventuras del Trío se piden con 1 clic como siempre.
- La oferta de pago "otra aventura" **queda oculta** en pedidos de prueba (lo más simple: no hay nada con qué cobrarla) y, como no hay oferta, los dibujos de una sola aventura de prueba se borran al terminar en lugar de guardarse 48 h.
- "Reembolso" en un pedido de prueba solo cancela y borra (no llama a la pasarela); el correo dice que no hubo cobro.
- Analytics: evento `test_code_redeemed` con `code_hash` (HMAC corto de 10 caracteres, nunca el código), variante, usos totales y de las últimas 24 h. Los pedidos son `test_mode`, así que no entran en las tablas de `npm run costs`; su gasto de imagen se imprime aparte ("Test-code orders").
- Tope de costo en el peor caso: `COLOREAR_TEST_CODE_MAX_USES` pedidos, cada Trío puede generar 3 libros (el tope por libro sigue siendo `COLOREAR_MAX_COST_USD`, 4 USD por defecto).
- Requisito para probar el Trío: la migración `0004_colorear_variants.sql` debe estar aplicada en Supabase (ver sección de Polar). Sin ella, el pedido de un Trío falla al guardarse.
- Para revocar: borrar `COLOREAR_TEST_CODES` en Vercel y desplegar. No hace falta tocar la base.

## Hasta 3 fotos por persona (colorear)

Decisión de Juan del 25-oct: cada persona o mascota puede tener su foto obligatoria más dos opcionales (otros ángulos) para que el personaje se parezca más. **Queda activo con el próximo despliegue sin cargar ninguna variable** (los valores por defecto ya son 3 y 3).

| Variable | Por defecto | Qué hace |
|---|---|---|
| `COLOREAR_MAX_PHOTOS_MAIN` | `3` | Fotos máximas del protagonista (tarjeta 1). Entre 1 y 5. |
| `COLOREAR_MAX_PHOTOS_OTHER` | `3` | Fotos máximas de cada una de las otras personas o mascotas. Entre 1 y 5. Para limitar a 3 y 2, cargar `COLOREAR_MAX_PHOTOS_OTHER=2` y desplegar. |

Cómo funciona:

- **Formulario**: cada tarjeta muestra tres casillas de foto (la primera "Obligatoria", las otras "Opcional") con miniatura y una X para quitar; el botón de la siguiente casilla libre acepta varias fotos a la vez desde la galería. Texto "Añade hasta 3 fotos: más ángulos = más parecido" (el número sale de la variable). Captura a 390 px: `docs/diseno/capturas/colorear-3-fotos.png`.
- **Subida**: el navegador comprime cada foto a 640 KB como antes; si todas juntas pasarían de 4 MB (Vercel rechaza cuerpos de más de 4,5 MB), justo antes de enviar reduce las más pesadas a `4 MB / n` (mínimo 120 KB; con las 15 fotos del máximo son unos 266 KB cada una). En el caso normal (una o dos personas) no se recomprime nada. El servidor guarda y reprocesa las fotos en paralelo (`Promise.all`), sin aumentar el tiempo del cobro de forma apreciable.
- **Motor**: `photo<i>` es la foto obligatoria de la persona i y `photo<i>_2`, `photo<i>_3` las extra; se guardan en `orders/<id>/photo-<i>.jpg` y `photo-<i>-<j>.jpg`. Las tres van como imágenes de referencia en la misma llamada que dibuja el personaje (el endpoint de edición admite hasta 16). No hay collage. Las escenas y la portada siguen usando solo los dibujos de los personajes, nunca las fotos. Si el proveedor rechaza las fotos de una persona, se dibuja desde la descripción y no se reintentan las mismas fotos (condición 5 de `docs/proveedores/openai.md`).
- **Borrado**: sin cambios (24 h como máximo, 2 h si no se pagó). El pedido guarda cuántas fotos tiene cada persona (`details.photoCounts`) y el barrido, el reembolso y el borrado de personajes las eliminan todas; los pedidos anteriores (una foto por persona) siguen funcionando. Si falla el guardado del pedido, las fotos subidas se borran en el acto.
- **Analytics**: `checkout_started` lleva `photos_per_person` (arreglo de números, por ejemplo `[3,3]`); `photos_deleted.count` cuenta todas las fotos.
- **Texto legal**: el aviso dice "una o varias de cada persona o mascota, de hasta 5 personas"; está en la lista de `legal-compliance` (`docs/proveedores/openai.md`). La versión `colorear-legal-v4` no se cambió.

### Costo de las fotos extra y del modelo [no verificado: no hay clave de API en este entorno]

No se pudo medir con la API real (sin `OPENAI_API_KEY` ni fotos de personas con licencia). Lo que sí está hecho y probado contra un servidor falso que imita la API (cuenta las partes `image[]`, devuelve tokens de uso):

- `npm run colorear:photo-cost -- --photos <carpeta con una subcarpeta por persona> --out <carpeta fuera del repo> --dry-run` muestra el plan y el peor caso. Sin `--dry-run` y con `OPENAI_API_KEY` mide los 8 casos por defecto (modelo actual y `gpt-image-2.5-flare`, calidad baja y media, 1 y 3 fotos por persona), con tope duro de 10 USD (`--max-total`; el plan por defecto estima 8,5 USD en el peor caso con margen del doble y se salta cualquier caso que lo pase), y escribe en `--out` la tabla `results.md` (costo del libro y del paso de personajes, segundos, imágenes, reintentos, costo por foto extra), `book.pdf`, los personajes y dos páginas por caso. Hay que usar fotos con licencia o del equipo, nunca de clientes.
- Estimación analítica (supone ~1.050 tokens de imagen por foto de entrada, de la referencia oficial ~1.024 por foto de 1024 px; tarifas de entrada de imagen: mini 2,5 USD y 2.5 de 8 USD por millón): **una foto extra cuesta ≈ 0,0026 USD con mini y ≈ 0,0084 USD con flare** (peor caso, el triple de tokens: 0,008 y 0,025). Un pedido de 2 personas con 3 fotos cada una (4 extra) sube ≈ 0,01 USD con mini y ≈ 0,034 USD con flare; el máximo de 15 fotos (10 extra) sube ≈ 0,026 y ≈ 0,084 USD. Frente a 12,99 USD de precio, lo más alto es el 0,65 %.
- **Limitar a 3 el protagonista y 2 las otras** ahorra 1 foto por cada persona adicional que suba tres: en un pedido de 2 personas ≈ 0,003 USD con mini o 0,008 con flare; en el de 5, ≈ 0,010 y 0,034 USD (4 fotos). Es decir, menos del 0,3 % del precio incluso en el caso peor: el costo no justifica limitarlo. El costo que sí mueve el libro es el modelo (los dibujos de escenas llevan los personajes como referencia, y esa entrada cuesta 3,2 veces más con los modelos 2.5 que con mini) y eso lo decide la medición real.
- Referencia real anterior (sin referencias, `products/colorear/samples/calidad/costos.json`): mini cuesta 0,37 centavos por imagen en calidad baja y 1,31 en media, es decir ≈ 0,09 y 0,33 USD por libro de 25 imágenes antes de los tokens de las referencias.
- Modelo de producción: **no se cambió**. En el código ningún valor por defecto apunta a `gpt-image-1` y `.env.example` no define `OPENAI_IMAGE_MODEL` (el único valor por defecto es `gpt-image-1-mini`, que se apaga el 2026-12-01; el script de medición rechaza `gpt-image-1`). Solo tres briefs históricos del 18-oct (`docs/briefs/colorear-H1b-*.md`, `colorear-H3-pricing.md`) lo nombran como decisión de esa fecha. El valor de `OPENAI_IMAGE_MODEL` en Vercel no se pudo comprobar desde aquí: Juan debe mirarlo en el panel (si no está definido, se usa el mini).

## Remitente de los correos de Pintoria

`RESEND_FROM` es compartida con Santa y vale `Jinglo <hola@lumen-labs.co>` en producción (`docs/arquitectura/dominio-lumen-labs.md`). Los correos de colorear ya no la usan tal cual (`createColorearEngine`, `colorearResendFrom` en `packages/config/src/colorear.ts`):

- **Remitente (`From`)**: si existe `COLOREAR_RESEND_FROM` (y trae una dirección), esa. Si no, el nombre de marca (`COLOREAR_BRAND_NAME`, por defecto `Pintoria`) con la **misma dirección** que tenga `RESEND_FROM`: hoy `Pintoria <hola@lumen-labs.co>`. Funciona con el dominio ya verificado en Resend, sin tocar DNS ni cargar variables nuevas.
- **`reply_to`**: la dirección de soporte que usan los textos legales (`SUPPORT_EMAIL`, por defecto `soporte@lumen-labs.co`; es el `{{EMAIL_SOPORTE}}` del pie de los correos y de la página de contacto). Antes no se enviaba ningún `reply_to`; ahora sí en todos los correos de colorear (recibo, entrega, reembolso, recordatorios). **Santa no cambia**: mismo `RESEND_FROM` y sin `reply_to`.
- **Prueba automática** (`tests/colorear-email-sender.test.ts`): ciclo completo contra la API de correo simulada; ningún correo de colorear lleva "Jinglo" en `from`, `reply_to`, asunto, texto ni html, ni en ningún tipo, idioma o variante de mensaje.

Paso futuro, cuando Juan quiera que los correos salgan de `pintoria.app`:

1. En Resend, Domains, añadir `pintoria.app`; Resend muestra los registros exactos (mandan los suyos).
2. Crearlos en el DNS de `pintoria.app` (donde estén sus nameservers): un TXT SPF (normalmente `v=spf1 include:amazonses.com ~all`, en el subdominio `send`), el registro DKIM (`resend._domainkey`) y, opcional, un TXT DMARC (`_dmarc`). Si ya hay un SPF en el nombre, combinarlo en uno solo.
3. Esperar a que Resend marque el dominio como `verified`.
4. Cargar en Vercel (Production y Preview) `COLOREAR_RESEND_FROM="Pintoria <hola@pintoria.app>"` y desplegar. Conviene que `SUPPORT_EMAIL` (o `reply_to`) apunte a un buzón que exista en ese dominio, o seguir con `soporte@lumen-labs.co`.
5. Mandar un pedido de prueba (código de prueba) a un correo ajeno y revisar cabeceras: `From` de `pintoria.app` con SPF y DKIM en `pass`.

Hasta el paso 4 no se debe cargar `COLOREAR_RESEND_FROM`: un remitente de un dominio sin verificar hace que Resend rechace todos los correos (403) y la entrega solo queda en la pantalla de estado.

## Fotos de cualquier tamaño (colorear)

Incidente del 25-oct: desde un iPhone (Safari), capturas de pantalla y fotos de cámara respondían "Esa foto pesa más de 10 MB". El formulario rechazaba el **original** antes de reducirlo. Ahora el límite solo vale para lo que se **envía**; el original puede ser de cualquier tamaño razonable.

- **Qué se acepta**: cualquier imagen de hasta 60 MB (`COLOREAR.maxOriginalBytes`; una foto de 48 MP pesa 10 a 25 MB, una captura PNG de iPhone 10 a 20 MB). Por encima de eso, o si el archivo no se puede leer (RAW/DNG, dañado, no es imagen), el formulario dice qué hacer ("elige otra foto o hazle una captura de pantalla") sin hablar de megas.
- **Cómo se reduce** (`apps/web/src/lib/photo-prep.ts`, en el navegador, una foto a la vez para no agotar la memoria de iOS): se decodifica, se corrige la orientación EXIF, se baja por mitades hasta 2048 px del lado largo y se codifica JPEG desde 1280 px y calidad 0,82 hasta que pese 640 KB o menos. Después se mide lo que sale, nunca lo que entra. Si todas las fotos del pedido juntas pasarían de 4 MB (límite de cuerpo de Vercel: 4,5 MB), `fit()` reduce las más pesadas justo antes de enviar, como antes.
- **Servidor sin cambios**: `prepareUpload` sigue recodificando a 1536 px, calidad 85, y quita los metadatos. `COLOREAR.maxPhotoBytes` (900 KB) y la validación del motor (`engines/generate/src/engine.ts`) solo ven la foto ya reducida (640 KB como máximo), así que nunca rechazan por el tamaño del original.
- **Medido en Chromium a 390 px**: JPEG de cámara 8000x6000 de 22 a 28 MB pasa a 93 a 117 KB en 1 a 2 s; captura PNG 1290x2796 de 10,8 MB pasa a 199 KB en 0,13 s; 5 personas con 3 fotos grandes cada una (15 fotos) quedan listas en unos 17 s en serie, el pedido sale de 1,6 MB y el servidor responde 200. La página sigue respondiendo (sin tareas largas; el peor salto de fotograma fue de 0,8 a 1 s al abrir una foto de 48 MP). Prueba automática en `tests/colorear-photo-prep.test.ts` con archivos grandes generados en la prueba (se omite si no hay Playwright para Python).
- **HEIC/HEIF**: el campo usa `accept="image/*"`, con lo que iOS entrega JPEG (o HEIC que Safari sabe abrir). Si llega un HEIC y el navegador no lo abre (Chrome en Android o escritorio), se carga bajo demanda `heic-to` (libheif en el propio navegador, solo en ese caso, unos cientos de KB que no pesan en la carga normal) y se convierte en el dispositivo. Se descartó convertir en el servidor: el `sharp` precompilado de Vercel no trae decodificador HEVC y el HEIC original de 3 a 8 MB toparía con el límite de 4,5 MB de la petición.
- **Licencia a vigilar**: `heic-to` es LGPL-3.0 (libheif). Se carga como módulo separado y sin modificarlo, que es el uso que la licencia permite sin obligar a abrir el código de la web; `legal-compliance` debe anotarlo en la lista de licencias de terceros.
