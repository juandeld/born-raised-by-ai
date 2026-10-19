# 02. Consentimiento TCPA, llamada con voz de IA y grabación

Versión `legal-v1` · 18-oct-2026 · Aplica a todo producto de llamada: santa, rex, memorias, y las líneas de voz de dot y ciudadania cuando el sistema sea quien llama (si la persona llama a la línea, aplican solo C3 y el aviso inicial del archivo 03 adaptado).

## Base (fuentes de `docs/investigacion/santa.md`)

- La FCC aclaró en feb-2024 que la voz generada por IA es "voz artificial o pregrabada" bajo la TCPA; daños de $500 a $1,500 por llamada; se recomienda consentimiento previo expreso por escrito, identificar al emisor, revelar la IA al inicio y dar baja fácil (sección 5.3).
- 12 estados exigen consentimiento de todas las partes para grabar: CA, CT, DE, FL, IL, MD, MA, MT, NV, NH, PA, WA (sección 5.2).
- Art. 50 del AI Act: informar al inicio de que se habla con una IA (sección 5.4).
- Limitación honesta: el consentimiento TCPA lo da, en rigor, la persona llamada (o el abonado del número). Aquí quien marca la casilla es el comprador. El diseño lo cubre con tres capas: (1) el comprador declara que el número es suyo o que el abonado está de acuerdo (C5), (2) el comprador programa la fecha y hora, (3) quien contesta confirma con la tecla 1 en el preludio y puede darse de baja con la tecla 2. La capa 3 no es consentimiento previo, es una salida inmediata; por eso EE. UU. queda condicionado (ver `riesgos-y-mitigaciones.md`). `[no verificado: si la capa 1 más la capa 3 bastan para llamadas a un tercero]`.

## A. Casillas del checkout

Texto exacto, una línea por casilla, sin marcar por defecto, botón de pago deshabilitado hasta marcarlas.

### C3. IA y grabación

- es-419 (`02-C3-es-419-legal-v1`): [ ] Entiendo que la voz que hablará en la llamada es una inteligencia artificial, no una persona, y que la llamada se grabará para entregármela y para atender reclamos.
- es-ES (`02-C3-es-ES-legal-v1`): [ ] Entiendo que la voz que hablará en la llamada es una inteligencia artificial, no una persona, y que la llamada se grabará para entregármela y para atender reclamaciones.
- en (`02-C3-en-US-legal-v1`): [ ] I understand that the voice on the call is artificial intelligence, not a person, and that the call will be recorded to deliver it to me and to handle complaints.

### C4. Autorización expresa de la llamada automatizada

- es-419 (`02-C4-es-419-legal-v1`): [ ] Autorizo expresamente que {{MARCA}} llame al número que indiqué, en la fecha y hora que elegí, con una voz generada por inteligencia artificial. Entiendo que esta autorización no es condición para comprar nada más, que no recibiré llamadas de venta, y que puedo cancelarla en cualquier momento escribiendo a {{EMAIL_SOPORTE}}.
- es-ES (`02-C4-es-ES-legal-v1`): [ ] Autorizo expresamente que {{MARCA}} llame al número de teléfono que he indicado, en la fecha y hora que he elegido, con una voz generada por inteligencia artificial. Entiendo que esta autorización no es condición para comprar ninguna otra cosa, que no recibiré llamadas comerciales, y que puedo revocarla en cualquier momento escribiendo a {{EMAIL_SOPORTE}}.
- en (`02-C4-en-US-legal-v1`): [ ] I expressly authorize {{MARCA}} to call the phone number I provided, on the date and at the time I chose, using an artificially generated voice. I understand this authorization is not a condition of buying anything else, that I will not receive sales calls, and that I can cancel it at any time by writing to {{EMAIL_SOPORTE}}.

### C5. El número y el aviso a quien conteste

- es-419 (`02-C5-es-419-legal-v1`): [ ] El número que indiqué es mío, o es de una persona que sabe de esta llamada y está de acuerdo en recibirla. Me comprometo a avisarle que la voz es de inteligencia artificial y que la llamada se grabará.
- es-ES (`02-C5-es-ES-legal-v1`): [ ] El número que he indicado es mío, o es de una persona que conoce esta llamada y está de acuerdo en recibirla. Me comprometo a avisarle de que la voz es de inteligencia artificial y de que la llamada se grabará.
- en (`02-C5-en-US-legal-v1`): [ ] The number I provided is mine, or belongs to a person who knows about this call and agrees to receive it. I commit to telling them that the voice is artificial intelligence and that the call will be recorded.

### Línea fija bajo las casillas (texto informativo, no casilla)

- es-419: "Antes de la llamada le enviaremos un recordatorio con la hora. Quien conteste escuchará un aviso de que la voz es de IA y de que se graba, y podrá cancelar con la tecla 2."
- es-ES: "Antes de la llamada le enviaremos un recordatorio con la hora. Quien conteste oirá un aviso de que la voz es de IA y de que se graba, y podrá cancelar con la tecla 2."
- en: "Before the call we will email you a reminder with the time. Whoever answers will hear a notice that the voice is AI and that the call is recorded, and can cancel by pressing 2."

## B. Mensaje de baja (opt-out)

1. Durante la llamada: tecla 2 o decir "no quiero esta llamada" / "stop" / "no more calls" (el agente trata cualquiera de estas frases como baja, ver archivo 07).
2. Por correo: botón "No volver a llamar a este número" en el recordatorio y en el recibo.
3. Respuesta automática por correo (es-419): "Listo. No volveremos a llamar a ese número. Si había una llamada programada, la cancelamos y le reembolsamos el cobro completo. Esta baja no afecta ningún otro derecho suyo."
4. Respuesta automática por correo (es-ES): igual, con "Hecho." al inicio y "reembolsamos el importe íntegro".
5. Respuesta automática (en): "Done. We will not call that number again. If a call was scheduled, we cancelled it and are refunding the full charge. This opt-out does not affect any other right you have."
6. La baja se aplica en menos de 1 hora y antes de cualquier llamada programada. Se guarda en la lista de supresión (sección D).

## C. Ventana de llamada y reglas de reintento (diseño, para `arquitecto`)

- Solo se llama dentro de la ventana que eligió el comprador y entre las 8:00 y las 21:00 hora local del número llamado `[no verificado: esa franja proviene de reglas de telemercadeo de la TCPA; se usa como estándar conservador]`.
- Máximo 2 intentos por pedido, con al menos 15 minutos entre ellos, siempre dentro de la ventana. Nunca remarcar fuera de la ventana.
- Si el buzón de voz contesta: colgar sin dejar mensaje (una voz artificial grabada en un buzón es una llamada con voz artificial). Cuenta como intento.
- Si no hay entrega tras los 2 intentos: reembolso automático completo (ver archivo 05).
- Prohibido usar el número para marketing o cualquier otra llamada sin una autorización separada y posterior (que este producto no solicita en fase 1).
- Llamadas a un número de EE. UU. no salen hasta que Juan apruebe el mercado (condicionado; `riesgos-y-mitigaciones.md`). Para ES, UK y MX salen con las casillas C3 a C5 más el preludio.

## D. Qué se guarda (registro de consentimiento) y por cuánto tiempo

Tabla `consent_records` (un registro por casilla marcada, creado en el servidor en el momento de confirmar el pago; nunca desde el navegador):

| Campo | Contenido |
|---|---|
| `consent_id` | Identificador único |
| `order_id`, `payment_id` | Pedido y cobro de Polar o Recurrente |
| `checkbox_id` | C1 a C6 |
| `text_version_id` | Ejemplo `02-C4-es-419-legal-v1` |
| `text_sha256` | Hash del texto exacto mostrado (idioma y variante incluidos) |
| `locale` | `es-419`, `es-ES`, `en-US`, `en-GB` |
| `accepted_at_utc` | Hora del servidor al recibir la aceptación |
| `ip` | IP del comprador vista por el servidor |
| `phone_e164_hash` | Hash con sal del número a llamar (el número en claro vive en el pedido y se borra a los 30 días) |
| `window_start_utc`, `window_end_utc` | Ventana de llamada elegida |
| `product_slug` | `santa`, `rex`, etc. |

No se guarda: nombre del niño, audio, user-agent ni huella del dispositivo (no están aprobados como datos recogidos).

Retención: este registro se conserva 4 años `[no verificado; pendiente de aprobación de Juan, ver 00-leeme.md sección 5]` y está declarado en la política de privacidad. El resto del pedido (número, nombre del niño, datos opcionales, grabación) se borra a los 30 días.

Lista de supresión (`suppression_list`): `phone_e164_hash`, `created_at_utc`, `source` (tecla 2, correo, soporte). Sin vencimiento, solo sirve para no volver a llamar. Pendiente de aprobación de Juan.

## E. Versión española del argumento para la grabación en estados de consentimiento de todas las partes

No es un texto al cliente. Es la razón de diseño: el comprador consiente por escrito (C3), quien contesta es avisado en los primeros segundos (archivo 03) y la conversación sustantiva solo empieza después de que esa persona pulsa 1. La grabación y la transcripción empiezan después de esa tecla, no antes. Si no se pulsa 1, no se conserva audio ni transcripción de lo que dijo quien contestó; solo queda el registro del intento (hora, resultado, id del pedido).
