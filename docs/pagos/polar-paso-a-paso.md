# Polar: paso a paso para encender el cobro (Juan)

Responsable: pagos-finanzas + arquitecto · 19-oct-2026 · Costo de este tramite: $0 (Polar cobra comision por venta, no cuota fija; confirmar tarifa vigente en polar.sh/pricing antes de fijar margenes).

El codigo ya esta listo (adaptador, webhooks firmados, reembolsos, conciliacion). Falta solo la cuenta y 5 variables en Vercel. Orden: 0, 1, 2, 3, 4, 5. Tiempo estimado: 45 min tuyos mas la espera de la revision de Polar.

## 0. Antes de empezar: riesgo de politica (leer 2 minutos)

Las reglas de uso aceptable de Polar prohiben servicios dirigidos a menores [verificado en la politica publicada; la lectura de si Jinglo cae ahi es nuestra, no de Polar]. Jinglo se compra por adultos, pero la llamada es para un nino. Para no perder semanas de KYC por un rechazo:

1. Antes del KYC, escribe a support@polar.sh (o el chat del dashboard) con: "Vendemos una llamada de felicitacion navidena que compra un adulto como regalo para un nino. El comprador siempre es adulto y el nino no paga ni se registra. Es aceptable?". Guarda la respuesta por escrito.
2. Si dicen que no o no responden en 3 dias habiles: plan B es Recurrente (principio 4 del repo). El adaptador `recurrente` ya existe; cambia `PAYMENT_PROVIDER=recurrente`.

## 1. Crear la organizacion

1. Entra a https://polar.sh/signup y crea cuenta con juandeld@gmail.com.
2. Crea la organizacion: nombre "Lumen Labs", slug `lumen-labs`. Tipo: persona individual (no empresa), pais Guatemala.
3. Sandbox para probar antes: https://sandbox.polar.sh/start (cuenta aparte; no mezcla dinero real).

## 2. KYC y cuenta de pago

1. En el dashboard: Finance > Account (https://polar.sh/dashboard/lumen-labs/finance/account).
2. Verificacion de identidad: la hace Stripe Connect Express por dentro (Polar lo usa para los pagos). Ten a la mano DPI o pasaporte vigente, comprobante de domicilio y tu cuenta bancaria.
3. Cuenta bancaria: Guatemala aparece en los paises con pago soportado [verificado en la documentacion de Polar sobre payouts]. Lo que NO esta confirmado: en que moneda deposita a Guatemala (USD o GTQ) y si acepta cuenta en dolares de BAM. Que hacer: en el formulario, elige primero USD con tu cuenta en dolares de BAM; si el formulario solo ofrece GTQ, usa tu cuenta en quetzales y anota el tipo de cambio que aplica Stripe. Dime cual aceptaron para ajustar los margenes (la perdida cambiaria cuenta como costo).
4. Espera la aprobacion. Plazo no documentado [no verificado]. Mientras tanto Polar suele dejar crear productos pero retiene pagos.

## 3. Crear los productos (precios exactos)

Polar > Products > New product (https://polar.sh/dashboard/lumen-labs/products). Uno por fila, pago unico (one-time), no suscripcion. El catalogo sale de `packages/config` y `npm run polar:check` lo imprime.

| Clave | Producto | Precio |
|---|---|---|
| `santa:MX:single` | Jinglo, llamada de Santa | MXN 199.00 |
| `colorear:MX:single` | Colorear (Pintoria) | MXN 229.00 |
| `santa:MX:bundle` | Paquete | NO crear (apagado, `BUNDLE_ENABLED` sin definir) |

Notas: si Polar no deja fijar MXN como moneda de presentacion en tu cuenta, crea el precio en USD y activa multi-moneda en el producto; avisame, porque cambia `currency` en `packages/config`. Copia el UUID de cada producto (aparece en la URL y en el menu del producto).

## 4. Tokens y webhook

1. Token: Settings > Developers > New Token (https://polar.sh/dashboard/lumen-labs/settings). Nombre `lumen-prod`. Permisos: checkouts (escribir), orders (leer), refunds (escribir), products (leer). Los nombres exactos de los permisos pueden variar [no verificado]; si dudas, marca los que contengan esas palabras. Copia el token una sola vez.
2. Webhook: Settings > Webhooks > Add endpoint.
   - URL: `https://<dominio-de-produccion>/api/webhooks/polar`
   - Formato: Raw
   - Eventos: `order.paid` y `order.refunded`
   - Copia el "secret" que Polar muestra. Sirve tanto en formato `whsec_...` como en texto plano: el codigo acepta los dos.
3. NO pegues tokens en el repo ni en el chat. Van solo en Vercel.

## 5. Variables en Vercel (proyecto web > Settings > Environment Variables > Production)

| Variable | Valor |
|---|---|
| `PAYMENT_PROVIDER` | `polar` |
| `POLAR_SERVER` | `sandbox` mientras pruebas; `production` al abrir |
| `POLAR_ACCESS_TOKEN` | el token del paso 4 (del entorno que corresponda) |
| `POLAR_WEBHOOK_SECRET` | el secret del paso 4 |
| `POLAR_PRODUCT_MAP` | JSON en una linea: `{"santa:MX:single":"<uuid>","colorear:MX:single":"<uuid>"}` |
| `ENABLED_COUNTRIES` | `MX` (ES y GB estan activados por defecto pero no tienen producto en Polar: sin esta variable el checkout fallaria ahi) |
| `BUNDLE_ENABLED` | no definir |

Despues: redeploy (las variables no aplican a despliegues ya hechos).

## 6. Prueba en sandbox (15 min)

1. En una terminal con las variables del sandbox: `npm run polar:check`. Debe decir "Mapa de productos completo".
2. Compra de prueba en la web con la tarjeta de prueba de Polar (4242 4242 4242 4242, cualquier fecha futura) [dato estandar de Stripe; confirmar en la documentacion del sandbox].
3. Verifica: llega el correo de recibo, el pedido pasa a pagado, se programa la llamada.
4. Reembolso de prueba desde el dashboard de Polar: el pedido debe quedar reembolsado y el sistema no debe llamar.
5. Cuando todo pase, cambia a `POLAR_SERVER=production` con el token y el webhook de produccion, y haz UNA compra real de MXN 199 a ti mismo; reembolsala.

## 7. Operacion semanal

`npm run polar:check -- --reconcile 14` compara los pedidos de Polar contra la base de datos de los ultimos 14 dias y termina con codigo 2 si hay diferencias (pago sin pedido, pedido sin pago, monto distinto). `pagos-finanzas` lo corre cada lunes antes del reporte.

Reembolsos: se hacen por el neto (sin el impuesto, que Polar devuelve solo) y son idempotentes: repetir uno ya hecho no falla ni duplica.

## Verificado y no verificado

- Verificado en documentacion: formato de firma Standard Webhooks, reembolso sobre el neto con impuesto automatico, Guatemala en la lista de paises con pago, payouts via Stripe Connect Express.
- No verificado: moneda de deposito a Guatemala, permisos exactos del token, plazo del KYC, tarifa vigente, y la lectura de la politica de menores (paso 0).
