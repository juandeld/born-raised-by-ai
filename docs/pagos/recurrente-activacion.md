# Activar Recurrente para Pintoria (28-oct-2026)

Decisión D29: Recurrente es la pasarela principal de Pintoria. El adaptador vive en `packages/payments/src/recurrente.ts` y el webhook en `/api/webhooks/recurrente` (ruta genérica `apps/web/src/server/api/webhooks-provider.ts`). Nada de esto cambia el flujo del cliente: el pedido se crea igual, solo que el botón de pago lleva al checkout de Recurrente y el pedido se marca pagado con el webhook `intent.succeeded`.

## Para Juan (una vez)

1. Cuenta en https://app.recurrente.com/signup (cuenta personal: DPI, RTU, cuenta bancaria a su nombre). Terminar la **verificación**: una cuenta sin verificar está limitada a USD 50 acumulados (`422 amount_exceeds_unverified_limit`).
2. Configuración → Llaves API: crear la llave LIVE (`pk_live_…` / `sk_live_…`) y, en el Sandbox, la llave TEST (`pk_test_…` / `sk_test_…`).
3. Pegar las llaves en el chat. Nunca en el repo.

## Para el agente (con las llaves)

1. Registrar el webhook con la llave correspondiente (crea el endpoint y devuelve el `signingSecret`, que **solo se muestra una vez**):

   ```bash
   curl -X POST https://app.recurrente.com/api/webhook_endpoints \
     -H "X-SECRET-KEY: sk_live_..." -H "Content-Type: application/json" \
     -d '{"url":"https://www.pintoria.app/api/webhooks/recurrente","description":"Pintoria production"}'
   ```

   Con `sk_test_…` el endpoint queda en el Sandbox y recibe solo eventos de prueba (`live_mode: false`).
2. Variables en Vercel (proyecto `born-raised-by-ai-4ta9`):
   - `RECURRENTE_PUBLIC_KEY`, `RECURRENTE_SECRET_KEY`, `RECURRENTE_WEBHOOK_SECRET` (`whsec_…` del paso 1).
   - `PAYMENT_PROVIDER_GENERATE=recurrente` (Pintoria cobra en real). `PAYMENT_PROVIDER` se queda en `mock` para que Jinglo no cambie.
   - Verificar que `COLOREAR_PUBLIC_URL` y `PUBLIC_BASE_URL` apuntan al dominio real (el webhook y la reanudación de la generación usan `PUBLIC_BASE_URL`).
3. Prueba en Sandbox primero (llaves TEST en Preview): comprar con la tarjeta `4242 4242 4242 4242`; comprobar que el pedido pasa a `paid`, se genera el libro y llega el correo. Las órdenes con llaves TEST se marcan `test_mode` y respetan el tope diario de imágenes reales.
4. Pasar las llaves LIVE a Production y hacer una compra real de USD 12.99 con tarjeta propia; reembolsarla desde `/colorear/reembolso/<token>` para probar el reembolso.

## Qué queda apagado o pendiente

- Polar: sin `POLAR_*` en Vercel el webhook `/api/webhooks/polar` responde 503 y nada lo usa.
- Reembolso parcial del Trío: Recurrente lo soporta solo según el procesador de la cuenta; si la API lo rechaza, el flujo cae al plan B "todo o nada" (D26) y avisa al cliente.
- Idioma del checkout alojado: no está documentado si se muestra en inglés para compradores de EE. UU./Reino Unido [no verificado]; medir conversión y, si hace falta, pasar al checkout embebido (`recurrente-checkout`).
- Apple Pay / Google Pay: [no verificado].
- D28 sigue abierto: cobrar a clientes con fotos de menores de 13 requiere la decisión explícita de Juan sobre el proveedor de imágenes.
