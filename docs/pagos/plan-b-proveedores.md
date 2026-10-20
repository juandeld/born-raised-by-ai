# Plan B de cobro: proveedores para Jinglo y Pintoria (19-oct-2026)

`pagos-finanzas` · investigación de solo lectura (sin gasto, sin cuentas creadas, sin contactar a nadie). Complementa `docs/investigacion/pagos-tras-polar.md` (políticas de IA y tarifas) y `docs/investigacion/pagos-guatemala.md`.
**[no verificado]** = no pude confirmarlo en la fuente. **[mía]** = juicio mío sin dato público.

## 1. Hallazgo nuevo: la AUP de Polar es más dura de lo asumido

Fuente: https://polar.sh/docs/merchant-of-record/acceptable-use (leída hoy). Prohibido: "Services used by, intended for, or advertised towards minors" y "Telecommunication and eSIM Services". Restringido ("closer review"): AI content generation (voice), audio/chatbot generators, eBooks. La política no describe proceso de excepción: solo "Polar reserves the right to refuse Services ... in its sole discretion" y que pedirá información adicional. Conclusión: Pintoria (los niños colorean) y Jinglo (Santa habla con niños) chocan con una **prohibición**, no solo con una categoría de revisión. Probabilidad de aprobación por excepción **baja** [mía: 10-20 % Jinglo, 10-15 % Pintoria]. No depender de Polar ni retener fondos allí.

## 2. Tabla de proveedores

| Proveedor | ¿GT soportado? | Política sobre menores / IA / telecom | Comisión | ¿MoR? | Riesgo |
|---|---|---|---|---|---|
| **Recurrente** | Sí, nativo. Persona individual o empresa; DPI + RTU; cuenta comercial | Lista de giros prohibidos (16) **no menciona menores, IA ni llamadas**; sí "telemarketing" (modelo de venta) y telecom solo como equipos de interferencia. Términos: solo negocio lícito, "productos revelados en la solicitud" | Comerciales 4.5 % + Q2; personales 5.25 % + Q2. Sin tarifa internacional separada. Cuotas 8-14 % + Q2 | No: Juan es vendedor (IVA UK/ES/MX, FEL, contracargos) | Bajo-medio. Términos: retiene fondos por sospecha (4.4.3, 5.6), fraude <0.9 %/mes obligatorio (4.4.4), reembolsos a discreción (5.7) |
| **Lemon Squeezy** | Sí, payout bancario GT, mín. $50, retiro 1 % | Lista de prohibidos sin IA ni menores [la mención de menores no se pudo abrir hoy: no verificado]; prohíbe servicios y "telemarketing, cellular/communication" | 5 % + $0.50 (+1.5 % no-US) | Sí | Medio: Stripe la absorbe, soporte lento; Jinglo en zona gris |
| **Dodo Payments** | Sí, SWIFT $25 fijos [no verificado el cargo], mín. $100 | IA/voz y e-books en "revisión"; telecom/PSTN prohibido; menores [no verificado] | 4 % + $0.40 (+1.5 % no-US) | Sí | Medio: joven; consultar antes |
| **Paddle** | Wire USD, mín. $100 | Restringe rostros humanos generados y "phone services/telemarketing"; menores [no verificado] | 5 % + $0.50 | Sí | Descartar |
| **Gumroad** | Sí | Prohíbe "AI services ... fulfilled outside of Gumroad" y telemarketing | 10 % + $0.50 + procesador | Sí | Descartar (cara y política) |
| **FastSpring / 2Checkout** | [no verificado] | AUP no accesible | Cotización | Sí | Solo si todo falla |
| **PayPal Business + BAM** | Sí | AUP 2022 sin IA ni menores | 5.40 % + $0.30 + 3 % BAM (tope $10,000/mes) | No | Medio-alto: congela fondos en cuentas nuevas con picos |
| **dLocal Go / EBANX** | Venden hacia GT; vendedor GT pequeño no publicado [inferencia] | n/a | n/a | n/a | No es fase 1 |
| **Mercado Pago (MX)** | No opera en GT; requeriría entidad mexicana (RFC) [tercera fuente] | n/a | n/a | No | Descartado |

Pintoria en Recurrente: ~$0.85 sobre $12.99 (6.5 %), con Q2 ≈ $0.26 [mía, a ~7.7 GTQ/USD].

## 3. Recomendación

| Producto | Principal | Respaldo | Riesgo del principal |
|---|---|---|---|
| **Jinglo (MX primero)** | **Recurrente** (cobra en USD; tarjetas MX aceptadas, Visa/MC de cualquier país) | **PayPal + BAM** (3.er método). Lemon Squeezy/Dodo solo tras respuesta escrita sobre "telecom/llamadas" | Recurrente no es MoR: **IVA mexicano pasa a ser de Juan** (consulta al contador; lanzar con USD y declarar exposición). Polar solo como mejora si aprueba |
| **Pintoria** | **Lemon Squeezy** (acepta eBooks/PDF, MoR, payout GT) | **Dodo** y siempre **Recurrente activo** como segunda plataforma | LS: verificar por escrito menores/IA antes de aplicar; Recurrente deja el IVA al vendedor |

Regla: dos plataformas activas por producto; ninguna retención de fondos sin plan. Preguntar por escrito a Recurrente (support / WhatsApp) antes de abrir cuenta: "¿Aceptan un producto digital de pago único comprado por adultos, con contenido para uso de niños, y una llamada con voz sintetizada?" y declarar ambos al abrir la cuenta. Es lo que cubre el riesgo de cierre con fondos retenidos (términos 4.4.3 y 5.6).

### Texto exacto para support@polar.sh

> Subject: Acceptable-use clarification before applying: personalized call product bought by adults
>
> Hello Polar team,
>
> Before I submit an organization for review, I want to check whether our product could be approved by exception, because I read that services "used by, intended for, or advertised towards minors" are not allowed.
>
> Our product: an adult (parent, grandparent, or other adult) buys a one-time, personalized phone call from a Santa Claus character for their child. The adult is the only buyer and customer. The adult gives written consent, enters the child's first name and a few details, and schedules the call. The voice is a synthesized (not cloned) character voice, and the child speaks on the call. We do not market to, sell to, or collect payment from minors, and we do not collect data from children beyond a first name and age range needed for the call. It is a one-time purchase, no subscription. The call is not telemarketing and is not a telecommunications service for resale; the call is the product.
>
> We also sell a one-time downloadable PDF of coloring pages generated with AI from photos the adult uploads. Again the adult is the only buyer; children color the printed pages.
>
> Would products like these be accepted, or are they excluded under the minors and telecom rules (or restricted under AI voice content)? If an exception or pre-review is possible, what information would you need? We are based in Guatemala and will not submit an application unless you think approval is realistic.
>
> Thank you,
> Juan Lima, Lumen Labs

## 4. Recurrente: adaptador existente (`packages/payments/src/recurrente.ts`, 82 líneas)

Contrastado con docs.recurrente.com (hoy). Compatible: `POST /api/checkouts` con `items[{name, amount_in_cents, currency, quantity}]`, `success_url`, `cancel_url`, respuesta `checkout_url`; `POST /api/refunds`; mínimos 100 cents USD / 500 GTQ; reintentos de webhook (inmediato, 1, 5, 30 min, 2 h, 6 h); sandbox con llaves de prueba (`4242...` ok, `4000 0000 0000 0002` rechazada; 3DS no simulado).

**Checklist para encenderlo**
1. Cuenta **comercial** (4.5 %, no 5.25 %): DPI, RTU del portal SAT, cuenta bancaria; declarar ambos productos al abrir. Pendiente de Juan.
2. **Firma de webhook**: la guía pública de webhooks no la documenta; el adaptador asume Svix (`svix-id/-timestamp/-signature`, `whsec_`). Confirmar en el panel (Settings > Developers > Webhooks) con un evento real en sandbox [no verificado].
3. **Eventos**: documentados `payment_intent.succeeded/failed`, `bank_transfer_intent.*`, `subscription.*`. **No hay evento de reembolso documentado**: `PaymentEvent "refunded"` nunca se emite; conciliar reembolsos leyendo la respuesta de la API.
4. **Forma del payload** (`checkout.id`, `metadata.order_id`) y si el checkout acepta `metadata` [no verificado; la guía de checkout no lo menciona]. Si no, mapear por `checkout.id` guardado al crear.
5. **Cabeceras**: la documentación de reembolsos pide solo `X-SECRET-KEY` (el adaptador envía también `X-PUBLIC-KEY`; probablemente inofensivo). Añadir `Idempotency-Key` por reembolso (recomendado por docs).
6. **Reembolso**: el adaptador envía `payment_intent_id`; vigente como alias legado, preferir `intent_id` (`in_...`). Reembolso parcial (`amount_in_cents`) solo en CyberSource/efectivo; ignora `req.amountMinor` hoy. Manejar `status: pending/failed` y `provider_outcome_unknown` (422) en vez de asumir éxito. El Trío (reembolso parcial D26) probar en sandbox.
7. **Apple/Google Pay**: `walletMethods` vacío; no hay evidencia en docs [no verificado].
8. **Moneda**: solo USD/GTQ; MXN solo por SPEI (convierte a USD con 0.5 %). `convertForProvider` ya convierte.
9. **Bug latente** (de `pagos-tras-polar.md`): reembolsar con el proveedor de la orden (`order.payment_provider`), no el activo; fábrica por motor (`PAYMENT_PROVIDER_CALLS`). Pide aprobación de `arquitecto`.
10. **Operación**: conciliación semanal con payout (24 h hábiles, gratis); alerta si fraude/contracargos >0.5 % (tope contractual 0.9 %); FEL por venta al cliente final (exportación exenta); IVA MX/UK/ES según contador.

## 5. Fuentes

- Polar AUP: https://polar.sh/docs/merchant-of-record/acceptable-use
- Recurrente: https://www.recurrente.com/precios · https://www.recurrente.com/terminos · https://ayuda.recurrente.com/es/p/giros-de-negocios-prohibidos · https://ayuda.recurrente.com/es/p/como-funciona-cobrar-a-clientes-fuera-de-guatemala · https://docs.recurrente.com/guides-english/getting-started/introduction · https://docs.recurrente.com/referencia-api/api-reference/refunds/create-refund · https://apidocs.recurrente.com/guides-english/getting-started/webhooks
- Resto de proveedores (Lemon Squeezy, Dodo, Paddle, Gumroad, PayPal, Creem): enlaces y lectura en `docs/investigacion/pagos-tras-polar.md` sección 7. Hoy no pude reabrir Lemon Squeezy ni Dodo (permiso de lectura no concedido), por eso la columna de menores queda [no verificado].
- No pude leer la FEL de Recurrente (la página y los términos no la mencionan [no verificado]): confirmar quién emite factura por la comisión.
