# Agentes por locale, propuesta de voz y checklist de Polar

`arquitecto` · 19-oct-2026 (rol ejecutado por el Director de portafolio). Nada de esto se ha ejecutado contra servicios de pago. Lo no confirmado va como [no verificado].

## 1. Agentes por locale (ya en codigo)

- Locales: `es-419` (vivo: `agent_2601m58wfve0fdc9j1dbfm0v5fy8`), `es-ES`, `en-US`, `en-GB`.
- `syncAgents()` crea o actualiza uno por locale con `santa-<locale>-legal-v1.2`. Prompts: `products/santa/prompts/<locale>.v4.txt`, generados por `node scripts/santa-prompts.mjs`.
- Ids por entorno: `ELEVENLABS_AGENT_ID_ES_ES`, `_EN_US`, `_EN_GB`; voces `ELEVENLABS_VOICE_ID_EN_US` / `_EN_GB`. Sin id, el fallback es el agente es-419 (el nino oiria otro acento y el prompt de otro idioma: no activar el pais sin su agente).
- `syncAgent` envia la voz solo al crear y nunca toca privacidad ni guardrails del proveedor.
- Correr `syncAgents` contra produccion sobrescribiria el agente vivo: **no se ha corrido**. Requiere orden de Juan y gasto de creditos.

## 2. Propuesta de voz (sin ejecutar, sin clonar)

Disenar con `creative_design_voice` (sin clonar voces de personas reales). Una voz por locale, misma calidez de Santa:

| Locale | Descripcion para el diseno |
|---|---|
| es-ES | Hombre mayor, 65 anos, voz grave y calida, acento castellano peninsular neutro (no andaluz), ritmo pausado, risa suave, trato de abuelo carinoso hablando a un nino. Personaje: Papa Noel |
| en-US | Hombre mayor, voz profunda y calida, acento estadounidense general, ritmo lento, risa "ho ho ho" natural, tono de abuelo amable. Personaje: Santa |
| en-GB | Hombre mayor, voz profunda y calida, acento britanico suave (RP ligero), ritmo pausado, tono de abuelo. Personaje: Father Christmas |

Criterio de eleccion: 3 previews por locale, pasar la frase de la muestra (`jinglo-santa-es.mp3`) y elegir la que mejor se entienda por telefono (8 kHz). Costo estimado: previews de diseno de voz consumen creditos [no verificado el monto]; pedir autorizacion a Juan antes. Mientras tanto la voz LykVXmiL9G4zV1CJHN2o de es-419 sirve de respaldo.

## 3. Checklist tecnica de Polar

1. Cuenta de organizacion en Polar, KYC y payout a Guatemala [no verificado que Polar soporte payout directo a GT; confirmar en el onboarding]. Dependencia: gasto 0, pero es un tramite de Juan.
2. Modo sandbox primero: crear productos de prueba y correr una compra completa.
3. Productos de pago unico (no recurrentes) por pais y variante: MX, ES, GB, US x `single` / `bundle` = 8 productos. Precios (`packages/config/src/pricing.ts`), single / bundle: MX MXN 199 / 349; ES 12,99 EUR / 19,99 EUR; GB GBP 11.99 / 19.99; US USD 14.99 / 24.99. Monedas MXN, EUR, GBP: [no verificado que Polar las admita como moneda de presentacion].
4. Rellenar `POLAR_PRODUCT_MAP` con claves `santa:<PAIS>:<variante>` -> id de producto.
5. Webhook `POST /api/webhooks/polar` con secreto `POLAR_WEBHOOK_SECRET` (firma Standard Webhooks). Eventos: `order.paid` y `order.refunded`.
6. Pasar `order_id` interno como metadata del checkout; el webhook lo usa para activar la entrega y para marcar el reembolso.
7. Reembolso: automatico via API de Polar desde el flujo de reembolso y desde el fallback "sin llamada en la ventana".
8. Texto del checkout: aviso de IA al adulto (D13) y enlace a terminos y privacidad, con `LEGAL_*` rellenas (si no, `legalReady()` cierra el checkout).
9. Compra de prueba en sandbox, reembolso de prueba, y luego una compra real minima propia en produccion.
10. Plan B si Polar rechaza: Recurrente (Guatemala), luego PayPal+BAM. Sin Stripe.

## 4. Propuestas de cambio al agente en vivo (no aplicadas)

1. D17 corregida: el silencio del usuario se cierra con `turn_timeout` (re-engage, hoy 5 s) y `silence_end_call_timeout = -1`; el prompt cuenta los silencios (5/10/15 s) y `end_call` espera el audio. `soft_timeout_config` mide la espera del LLM, no el silencio del nino.
2. Reemplazar el prompt por `es-419.v4.txt` (F-09 nueva, llanto con cariño, despedida en dos turnos).
3. Bajar `max_duration` de 600 s a 300 s (el codigo y el producto prometen 5 minutos).
4. Guardrails del proveedor siguen desactivados hasta repetir la bateria con `agents_run_tests` (gasta creditos; autorizar).
