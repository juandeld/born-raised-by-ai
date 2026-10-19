# 03. Preludio hablado al adulto que contesta

Versión `legal-v1.3` · 19-oct-2026 (revisión D20: preludio corto y cálido; solo queda lo que la llamada misma debe decir: de dónde llama y para quién, que es una llamada automatizada con voz artificial de Jinglo, aviso de grabación, tecla 1 y tecla 2; el resto ya consta en el checkout y el correo; ver sección I. Antes `legal-v1.2`, 18-oct-2026, revisión D13: el preludio al adulto nombra a Lumen Labs y es la revelación completa de IA, el paso al niño avisa al adulto de que el personaje no dirá que es IA, y la primera frase al niño ya no menciona la computadora; antes, revisión D11 `legal-v1.1`: reloj de la llamada, espera de la segunda tecla, bloque en-GB propio, aprobación es-ES y en-GB) · Productos: santa (Santa / Papá Noel), Reyes Magos (add-on de santa), rex (Rex y Ratoncito Pérez), memorias (permiso explícito de una persona mayor). Las líneas de voz de dot y ciudadania, donde la persona llama, usan el aviso corto de la sección F.

Fuentes: `docs/investigacion/santa.md` 5.2 (preludio al adulto cierra el riesgo de grabación y confirma que hay un adulto), 5.3 (identificar al emisor, revelar IA, baja fácil), 5.4 (art. 50 del AI Act). Desde D13 el preludio es uno de los tres puntos donde se revela la IA al adulto responsable (checkout C3, correo de confirmación y recordatorio, preludio); al niño no se le revela (archivo 07, C-06).

## A. Flujo común (obligatorio, lo implementa `arquitecto`)

1. La llamada sale. Si el detector de buzón de voz responde: colgar sin hablar ni dejar mensaje. Cuenta como intento.
2. Sin grabación ni transcripción hasta el paso 5. Solo se registra el intento (hora, resultado, id del pedido).
3. El agente reproduce el preludio (sección B o C). Es un texto fijo, no generado por el modelo. Duración de Santa (D20): unos 15 segundos con el nombre del niño (el tramo que no admite tecla dura unos 11); Memorias y las demás secciones conservan 35 segundos.
4. Espera 8 segundos una tecla. Si no hay tecla, repite solo las instrucciones de teclas una vez (en Santa, desde D20: "Para recibirla, marque 1; para no recibir más llamadas, marque 2."). Si tras otros 8 segundos no hay tecla, dice la frase de cierre sin respuesta y cuelga. Cuenta como intento.
5. Tecla 1: comienzan la grabación y la transcripción; el agente dice la frase de paso al niño. Tecla 2: el agente dice la frase de baja, cuelga, se escribe en la lista de supresión y se cancela el pedido con reembolso (archivo 05).
6. Solo el DTMF (tecla) vale para el paso 5. Si la persona dice "sí" sin pulsar, el agente responde "Para recibir la llamada, marque 1 en el teléfono." (Santa, es-419) No se acepta voz sola, porque un niño podría decir "sí".
7. Segunda tecla 1: "listo". Solo entonces habla el personaje. La frase de presentación al niño (sección B) es del personaje y NO menciona computadora, inteligencia artificial ni grabación (D13): esa información ya se dio al adulto en el preludio y el paso al niño.
   - **Reloj de la conversación**: el `max_call_seconds` (300 s en santa, Reyes Magos y rex) y la despedida a 240 s se cuentan desde esta segunda tecla. El preludio, las esperas de tecla y el paso al niño no cuentan. El servidor registra la hora de la segunda tecla como inicio del reloj (archivo 07, A-07).
   - **Espera máxima de la segunda tecla: 60 segundos** desde que termina la frase de paso al niño. A los 30 segundos el agente repite una vez: es-419 "Cuando {{NOMBRE_NIÑO}} tenga el teléfono, pulse 1 otra vez."; es-ES "Cuando {{NOMBRE_NIÑO}} tenga el móvil, pulse 1 otra vez."; en-US "When {{NOMBRE_NIÑO}} has the phone, press 1 again."; en-GB "When {{NOMBRE_NIÑO}} has the mobile, press 1 again." Si a los 60 segundos no hay tecla: frase de "sin respuesta" de su idioma, cuelga, cuenta como intento y se borra de inmediato la grabación de la espera. El personaje no llega a hablar.
8. El agente no pide, no repite y no guarda ningún dato personal durante el preludio.

Limitación conocida: ni el sistema ni nadie puede comprobar que quien pulsa 1 es un adulto. La barrera real es el consentimiento del comprador en el checkout (archivos 01 y 02) más la programación de la hora por el propio padre. `[no verificado: si un niño que pulsa 1 invalida el consentimiento; mitigado por la instrucción hablada y por el cobro con tarjeta]`.

---

## B. Santa, Reyes Magos y Rex (llamada a un niño)

### B1. Preludio, Santa (D20, `legal-v1.3`)

Estructura: (1) parte bloqueada, sin barge-in (D14): de dónde llama y para quién, llamada automatizada con voz artificial de Jinglo, grabación; (2) instrucciones de teclas, interrumpibles. La repetición es exactamente la parte (2). Redacción pensada para un niño que oiga el altavoz: palabras de adulto ("automatizada", "voz artificial"), sin "IA", "robot" ni "computadora". No nombra al personaje: la llamada viene "del Polo Norte" para Santa, Papá Noel y Father Christmas por igual. Los textos son los de `packages/legal/src/prelude.ts`; los clips pregrabados de `apps/web/public/audio/prelude/<idioma>/` (`main-a`, `main-b`, `open`, `handoff-a`, `handoff-b`) dicen lo mismo con el nombre del niño dicho por la voz del teléfono entre dos clips; los demás avisos (recordatorio, baja, sin respuesta, tecla equivocada) siguen con voz sintética.

**es-419** (`03-SANTA-es-419-legal-v1.3`)

> ¡Hola! Le llamamos desde el Polo Norte con una sorpresa para {{NOMBRE_NIÑO}}. Es una llamada automatizada de Jinglo, con voz artificial, y se grabará para su familia. Para recibirla, marque 1; para no recibir más llamadas, marque 2.

Repetición: "Para recibirla, marque 1; para no recibir más llamadas, marque 2."

Tecla 1, paso al niño: "¡Perfecto! Pásele el teléfono a {{NOMBRE_NIÑO}} y marque 1 otra vez."

Recordatorio a los 30 s: "Cuando {{NOMBRE_NIÑO}} tenga el teléfono, marque 1 otra vez."

Tecla 2: "Entendido. No volveremos a llamar a este número. Que tenga un buen día."

Sin respuesta: "No recibimos respuesta, así que terminamos aquí. Hasta pronto."

Tecla equivocada: "Para recibir la llamada, marque 1 en el teléfono."

Primera frase de Santa al niño, después de la segunda tecla (D13): "¡Jo, jo, jo! Hola, {{NOMBRE_NIÑO}}. Soy Santa, ¡y te llamo desde el Polo Norte! ¿Cómo estás?"

Cierre fijo si el modelo agota el tiempo: "Ha sido muy bonito hablar contigo, {{NOMBRE_NIÑO}}. ¡Hasta pronto!"

**es-ES** (`03-SANTA-es-ES-legal-v1.3`)

> ¡Hola! Le llamamos desde el Polo Norte con una sorpresa para {{NOMBRE_NIÑO}}. Es una llamada automática de Jinglo, con voz artificial, y se grabará para su familia. Para recibirla, pulse 1; para no recibir más llamadas, pulse 2.

Repetición: "Para recibirla, pulse 1; para no recibir más llamadas, pulse 2."

Paso al niño: "¡Perfecto! Pásele el móvil a {{NOMBRE_NIÑO}} y pulse 1 otra vez."

Recordatorio: "Cuando {{NOMBRE_NIÑO}} tenga el móvil, pulse 1 otra vez."

Baja: "Entendido. No volveremos a llamar a este número. Que tenga un buen día."

Sin respuesta: "No hemos recibido respuesta, así que terminamos aquí. Hasta pronto."

Tecla equivocada: "Para recibir la llamada, pulse 1 en el teléfono."

Primera frase al niño (D13): "¡Jo, jo, jo! Hola, {{NOMBRE_NIÑO}}. Soy Papá Noel, ¡y te llamo desde el Polo Norte! ¿Cómo estás?"

**en-US** (`03-SANTA-en-US-legal-v1.3`)

> Hello! We're calling from the North Pole with a surprise for {{NOMBRE_NIÑO}}. This is an automated call from Jinglo with an artificial voice, and it will be recorded for your family. To take it, press 1. To stop future calls, press 2.

Repeat: "To take it, press 1. To stop future calls, press 2."

Hand-off: "Perfect! Hand the phone to {{NOMBRE_NIÑO}} and press 1 again."

Reminder: "When {{NOMBRE_NIÑO}} has the phone, press 1 again."

Opt-out: "Understood. We will not call this number again. Have a good day."

No response: "We did not get a response, so we will end here. Goodbye."

Wrong key: "To take the call, press 1 on the phone."

First line to the child (D13): "Ho, ho, ho! Hello, {{NOMBRE_NIÑO}}. I'm Santa, and I'm calling you from the North Pole! How are you?"

**en-GB** (`03-SANTA-en-GB-legal-v1.3`)

> Hello! We're calling from the North Pole with a surprise for {{NOMBRE_NIÑO}}. This is an automated call from Jinglo with an artificial voice, and it will be recorded for your family. To take it, press 1. To stop any future calls, press 2.

Repeat: "To take it, press 1. To stop any future calls, press 2."

Hand-off: "Perfect! Pass the mobile to {{NOMBRE_NIÑO}} and press 1 again."

Reminder: "When {{NOMBRE_NIÑO}} has the mobile, press 1 again."

Opt-out: "Understood. We will not call this number again. Have a good day."

No response: "We did not get a response, so we will end here. Goodbye."

Wrong key: "To take the call, press 1 on the phone."

First line to the child (D13): "Ho, ho, ho! Hello, {{NOMBRE_NIÑO}}. I'm Father Christmas, and I'm calling you from the North Pole! How are you?"

Regla de emisor (D20): el preludio nombra al emisor con la marca de producto "Jinglo" (D19), la que la familia vio al comprar; "Lumen Labs" (D9) sigue siendo el operador que nombran la casilla C3, el correo y la política de privacidad, que deben decir "Jinglo, un producto de Lumen Labs" (19-oct-2026, unificado). Excepción documentada: los clips pregrabados del preludio dicen solo "Jinglo"; cambiarlos exige regrabar con créditos de ElevenLabs. Mientras tanto, la forma completa "Jinglo, un producto de Lumen Labs" la dicen D-03b y D-10 en cuanto un adulto pregunta, y consta por escrito en C3, C4, aviso, correos, certificado, términos y privacidad. `[no verificado: que una marca comercial baste como identificación del emisor bajo 47 CFR 64.1200(b)(1); la llamada no es publicitaria]`

Regla de nombre del personaje: el preludio no nombra al personaje; el nombre debe ser el mismo en el checkout, la primera frase y E-01.

Regla del nombre del niño: se dice el nombre de pila (dato ya declarado en C1 y C2) a quien contesta; un número equivocado lo oye. Es el mismo dato que decía la versión `legal-v1.2`; se acepta por la calidez de la sorpresa.

### B2. Preludio, Reyes Magos

Igual que B1 con estos cambios (incluida la revelación de IA al adulto con "Lumen Labs" y la frase del paso al niño con el nombre del personaje). Por D13 (confirmado para todos los personajes, D13b), la primera frase al niño ya no menciona la computadora.

- es-419: "pidió una llamada de los Reyes Magos"; primera frase al niño: "¡Hola, {{NOMBRE_NIÑO}}! Soy Melchor, uno de los Reyes Magos, ¡y te llamo desde muy lejos! ¿Cómo estás?" Paso al niño: "Los Reyes Magos no le pedirán datos ni le venderán nada".
- es-ES: "ha pedido una llamada de los Reyes Magos"; "¡Hola, {{NOMBRE_NIÑO}}! Soy Melchor, uno de los Reyes Magos, ¡y te llamo desde muy lejos! ¿Cómo estás?" Paso al niño: "Los Reyes Magos no le pedirán datos ni le venderán nada".
- en: "requested a call from the Three Kings"; "Hello, {{NOMBRE_NIÑO}}! I'm Melchior, one of the Three Kings, and I'm calling you from far, far away! How are you?" Hand-off: "The Three Kings will not ask for any information or sell anything".

Ids: `03-REYES-<idioma>-legal-v1.2`.

### B3. Preludio, Rex y Ratoncito Pérez

Igual que B1 con estos cambios.

- Rex es-419: "pidió una llamada de Rex, un dinosaurio de fantasía"; primera frase al niño: "¡Rawr! Hola, {{NOMBRE_NIÑO}}. Soy Rex, un dinosaurio de mentira, ¡y te llamo desde la tierra de los dinosaurios! ¿Cómo estás?" Paso al niño: "Rex no le pedirá datos ni le venderá nada".
- Rex es-ES: igual, con "ha pedido".
- Rex en: "requested a call from Rex, a pretend dinosaur"; "Rawr! Hello, {{NOMBRE_NIÑO}}. I'm Rex, a pretend dinosaur, and I'm calling you from Dinosaur Land! How are you?"
- Ratoncito Pérez es-419: "pidió una llamada del Ratoncito Pérez"; "¡Hola, {{NOMBRE_NIÑO}}! Soy el Ratoncito Pérez, ¡y te llamo desde mi casita de los dientes! ¿Cómo estás?" Paso al niño: "El Ratoncito Pérez no le pedirá datos ni le venderá nada".
- Ratoncito Pérez es-ES: igual, con "ha pedido".
- Tooth Fairy en: "requested a call from the Tooth Fairy"; "Hello, {{NOMBRE_NIÑO}}! I'm the Tooth Fairy, and I'm calling you from Fairyland! How are you?"

Por D13 (confirmado para todos los personajes, D13b): ninguna primera frase menciona la computadora. Rex conserva "un dinosaurio de mentira" porque declara que es un personaje de fantasía, no una persona.

Ids: `03-REX-<idioma>-legal-v1.2`, `03-PEREZ-<idioma>-legal-v1.2`, `03-TOOTH-en-legal-v1.2`.

Regla de marca: el personaje Rex no puede parecerse al Rex de Toy Story (ni diseño verde de tiranosaurio de juguete ni frases características). Ver `riesgos-y-mitigaciones.md`.

### B4. Cierre de la llamada al niño (todas)

El agente cierra la llamada diciendo un adiós propio del personaje (la despedida amable empieza a los 240 s del reloj de la conversación) y, solo si el modelo agotó el tiempo (290 s), la frase fija: "Ha sido muy bonito hablar contigo, {{NOMBRE_NIÑO}}. ¡Hasta pronto!" (es-ES igual; en: "It was lovely talking with you, {{NOMBRE_NIÑO}}. Goodbye!").

---

## C. Memorias (llamada a una persona mayor de edad que será entrevistada)

Requiere permiso explícito, doble: tecla y respuesta hablada. Hablar despacio.

**es-419** (`03-MEMORIAS-es-419-legal-v1`)

> Hola. Le habla una voz de inteligencia artificial de {{MARCA}}. {{NOMBRE_ADULTO}} nos pidió llamar a {{NOMBRE_PERSONA_LLAMADA}} para conversar y guardar sus recuerdos como un regalo. Esta voz no es una persona. Para hacerlo necesitamos su permiso. Si continúa, la conversación se grabará, se convertirá en texto y se entregará a {{NOMBRE_ADULTO}}. Puede parar cuando quiera. Si usted es {{NOMBRE_PERSONA_LLAMADA}} y está de acuerdo en conversar y en que se grabe, pulse 1. Si prefiere no hacerlo, o si usted no es {{NOMBRE_PERSONA_LLAMADA}}, pulse 2 y no volveremos a llamar a este número.

Repetición: "Pulse 1 para continuar o 2 para cancelar."

Tecla 1, confirmación hablada: "Gracias. La grabación empieza ahora. Para que quede claro, ¿me confirma con un sí que es usted {{NOMBRE_PERSONA_LLAMADA}}, que sabe que habla con una inteligencia artificial y que está de acuerdo en que grabemos esta conversación?"

Si responde sí: "Muchas gracias. Puede pedir que se borre la grabación visitando {{DOMINIO_HABLADO}}, o pidiéndoselo a {{NOMBRE_ADULTO}}. Empezamos cuando usted quiera." Si responde no, duda o no se entiende: "Entendido. Terminamos aquí. Muchas gracias por su tiempo." Cuelga, se borra la grabación de esa llamada de inmediato y se reembolsa.

Tecla 2: "Entendido. No volveremos a llamar a este número. Que tenga un buen día."

Sin respuesta: "No recibimos respuesta, así que terminamos aquí. Hasta pronto."

**es-ES** (`03-MEMORIAS-es-ES-legal-v1`): igual con "ha pedido", "Puede parar cuando quiera" y "ordenador" donde aplique; la confirmación hablada sin cambios. Memorias no cambia con D13: la persona que habla es adulta y se le revela la IA a ella misma.

**en-US / en-GB** (`03-MEMORIAS-en-US-legal-v1`)

> Hello. This is an artificial intelligence voice calling from {{MARCA}}. {{NOMBRE_ADULTO}} asked us to call {{NOMBRE_PERSONA_LLAMADA}} to chat and save their memories as a gift. This voice is not a person. We need your permission to do this. If you continue, the conversation will be recorded, turned into text, and given to {{NOMBRE_ADULTO}}. You can stop whenever you like. If you are {{NOMBRE_PERSONA_LLAMADA}} and you agree to talk and to be recorded, press 1. If you prefer not to, or if you are not {{NOMBRE_PERSONA_LLAMADA}}, press 2 and we will not call this number again.

Spoken confirmation: "Thank you. Recording starts now. To be clear, can you confirm with a yes that you are {{NOMBRE_PERSONA_LLAMADA}}, that you know you are talking with artificial intelligence, and that you agree to this conversation being recorded?"

If yes: "Thank you very much. You can ask for the recording to be deleted at {{DOMINIO_HABLADO}}, or by asking {{NOMBRE_ADULTO}}. We can start whenever you are ready." If no, hesitant or unclear: "Understood. We will end here. Thank you for your time." Hang up, delete that call's recording immediately and refund.

Reglas de contenido de Memorias (resumen; el detalle está en el archivo 07 sección G): no se pregunta por salud, dinero, claves, documentos ni datos de terceros menores; no se clona la voz de la persona sin una autorización separada que este producto no ofrece.

---

## D. Registro de que el preludio se cumplió

Por llamada se guarda: hora de inicio, resultado del paso 4 (tecla 1, tecla 2, sin respuesta, buzón), hora de la segunda tecla (inicio del reloj de la conversación), versión del texto (`03-...-legal-v1` o `03-...-legal-v1.2`) y, en Memorias, la marca de la confirmación hablada (parte de la transcripción). Retención: igual que el pedido (30 días), salvo el resultado y la versión, que quedan en el registro de consentimiento (4 años, pendiente de aprobación de Juan).

## E. Variables nuevas de este archivo

`{{DOMINIO_HABLADO}}`: el dominio dicho en voz alta, corto y fácil de deletrear (ejemplo: "nombre punto com"). Lo define `arquitecto` con el dominio final.

## F. Aviso corto para líneas donde la persona llama (dot, ciudadania)

Se reproduce al conectar, antes de cualquier práctica.

- es-419: "Hola. Soy una voz de inteligencia artificial de {{MARCA}}, no una persona. Esta práctica se graba para entregarle un resumen. Este servicio es preparación y no es un examen ni una asesoría oficial. Si no desea que se grabe, diga 'sin grabación' o pulse 2 y la práctica continúa sin grabar."
- en: "Hello. I'm an artificial intelligence voice from {{MARCA}}, not a person. This practice session is recorded to give you a summary. This service is preparation only and is not an official exam or advice. If you do not want it recorded, say 'no recording' or press 2 and the practice continues without recording."

El producto debe poder funcionar sin grabación (el resumen se arma de la transcripción en memoria y se borra al final). `[no verificado: si el resumen sin grabación es viable técnicamente; lo confirma arquitecto]`.

---

## G. Constancia de aprobación de variantes es-ES y en-GB (D11)

`legal-compliance` revisó el 18-oct-2026 los textos fijos del preludio y del cierre en es-ES y en-GB y los aprueba como definitivos, sin la marca "derivada". Cambios hechos en la revisión: (1) en-GB deja de compartir bloque con en-US y tiene el suyo (arriba), con "Father Christmas" y "mobile"; (2) D-06 es-ES pasa a "Alguien ha pedido..." para coincidir con el preludio es-ES; (3) se fija la espera de la segunda tecla (60 s). Sin cambios de fondo: la revelación de IA, la grabación, el aviso de baja y el "pulse 1" son equivalentes en todos los idiomas.

| Texto | Id | Estado | Fecha | Aprobó |
|---|---|---|---|---|
| Preludio, repetición, paso al niño, baja, sin respuesta, primera frase: es-ES (Papá Noel) | `03-SANTA-es-ES-legal-v1` | Aprobado tal como está en B1 | 18-oct-2026 | `legal-compliance` |
| Ídem Reyes Magos y Rex/Ratoncito Pérez en es-ES | `03-REYES-es-ES-legal-v1`, `03-REX-es-ES-legal-v1`, `03-PEREZ-es-ES-legal-v1` | Aprobado tal como está en B2 y B3 | 18-oct-2026 | `legal-compliance` |
| Ídem en-GB (Father Christmas) | `03-SANTA-en-GB-legal-v1` | Aprobado (bloque nuevo en B1) | 18-oct-2026 | `legal-compliance` |
| Ídem Reyes Magos, Rex y Tooth Fairy en en-GB | `03-REYES-en-GB-legal-v1`, `03-REX-en-GB-legal-v1`, `03-TOOTH-en-GB-legal-v1` | Aprobado: igual que en con "mobile" en el paso al niño | 18-oct-2026 | `legal-compliance` |
| Cierre D-02 y frases fijas D-01 a D-09, E-01, E-02, C-05 y silencio: es-ES y en-GB | ver archivo 07, sección E | Aprobado | 18-oct-2026 | `legal-compliance` |

Nota sobre "Hasta pronto" (D-02): es una fórmula de despedida, no una promesa de volver a llamar. El modelo no puede añadir "hablamos pronto", "te llamo" ni "nos vemos" (ver 07, F-14b y D-08).
Pendiente para producción (no bloquea esta aprobación): un hablante nativo de España y uno del Reino Unido escuchan la voz final con estos textos; cualquier cambio de redacción vuelve a `legal-compliance`.

---

## H. Constancia de revisión D13 (`legal-v1.2`)

`legal-compliance` revisó el 18-oct-2026 los textos de este archivo tras la decisión D13 de Juan (Santa permanece en personaje con el niño). La revelación de IA al adulto queda en tres puntos: casilla C3 del checkout (archivo 02, `02-C3-<idioma>-legal-v1.2`), correo de confirmación y recordatorio (guía de conversación, sección 8) y este preludio, que nombra a Lumen Labs y dice "llamada automatizada con voz de inteligencia artificial" y "Esta voz no es una persona" antes de la primera tecla 1 y antes de cualquier grabación. El paso al niño añade el aviso de que el personaje no dirá al niño que es una IA.

| Texto | Id | Estado | Fecha | Aprobó |
|---|---|---|---|---|
| Preludio, paso al niño y primera frase: Santa en es-419, es-ES, en-US y en-GB | `03-SANTA-<idioma>-legal-v1.2` | Aprobado tal como está en B1 | 18-oct-2026 | `legal-compliance` |
| Reyes Magos, Rex, Ratoncito Pérez y Tooth Fairy (extensión por analogía) | `03-REYES-`, `03-REX-`, `03-PEREZ-`, `03-TOOTH-<idioma>-legal-v1.2` | Aprobado (D13 confirmado para todos los personajes, D13b) | 18-oct-2026 | `legal-compliance` |
| Memorias y avisos de dot y ciudadania | `03-MEMORIAS-`, sección F | Sin cambios (`legal-v1`) | 18-oct-2026 | n/a |

Pendiente para `arquitecto`: cargar estos textos en el agente de llamadas, en `packages/legal` y en `engines/calls`, y confirmar que el `first_message` del agente de ElevenLabs coincide palabra por palabra con la primera frase de B1 (el agente es-419 ya fue actualizado por Juan).

---

## I. Constancia de revisión D20 (`legal-v1.3`): preludio corto y amable

`legal-compliance` revisó el 19-oct-2026 el preludio por decisión de Juan: demasiado largo (~25 s) y frío; lo legal ya se aceptó al pedir la llamada (checkout C1 a C6 y correo de confirmación). Segundo requisito de Juan: nombrar el Polo Norte y revelar la IA con palabras que un niño de 3 a 8 años que oiga el altavoz no entienda ("automatizada", "voz artificial"; nunca "IA", "robot", "computadora"). Criterio: en la llamada solo queda lo que no puede dar por cumplido el checkout, porque quien contesta puede no ser el comprador.

| Elemento que queda en la llamada | Por qué no lo cubre el checkout | Fuente |
|---|---|---|
| Aviso de grabación antes de grabar (y antes de la tecla 1) | El consentimiento de grabación de la persona que contesta no lo da el comprador; 12 estados de EE. UU. (CA, CT, DE, FL, IL, MD, MA, MT, NV, NH, PA, WA) exigen a todas las partes; UE/UK exigen informar al interesado | `docs/investigacion/santa.md` 5.2; GDPR art. 13 `[no verificado el detalle por estado]` |
| "Llamada automatizada ... con voz artificial" | La FCC (declaratoria de feb-2024) trata la voz de IA como "voz artificial" bajo la TCPA, y esa es la palabra de la norma; AI Act art. 50(1) exige informar de que se interactúa con una IA salvo que sea obvio por el contexto; quien contesta puede ser otro adulto | `santa.md` 5.3 y 5.4; 47 CFR 64.1200 `[no verificado el texto vigente; el AI Act aplica desde ago-2026 salvo aplazamiento]` |
| "De Jinglo" (identificación de quien llama) | 47 CFR 64.1200(b)(1) exige identificar al responsable de la llamada al inicio de un mensaje pregrabado o con voz artificial | 47 CFR 64.1200(b)(1) `[no verificado]` |
| Baja con la tecla 2 | El abonado puede no ser el comprador; la revocación debe poder hacerse por medios razonables y la baja inmediata es la salida del tercero | 47 CFR 64.1200(a)(10) y (b)(3) `[no verificado: (b)(3) aplica a llamadas publicitarias; esta no lo es]` |
| Tecla 1 como confirmación | Evita que hable el personaje con quien no quiere la llamada; no se acepta voz sola | sección A, paso 6 |

Se quitó de la llamada, y por qué es seguro:

- "Llamamos porque la madre, el padre o el tutor pidió una llamada de Santa", "esta voz no es una persona", "si continúa": redundante con "automatizada ... voz artificial" y con C1 a C5; queda "una sorpresa para X" como contexto.
- "Santa hablará como el personaje, sin decirle que es una IA; usted decide si se lo cuenta": consta en C3 (casilla marcada por el comprador) y en el correo. Riesgo residual: un adulto que no es el comprador no oye el aviso de que el personaje no dirá que es una IA; sigue en `riesgos-y-mitigaciones.md` R5 y R24.
- "No le pedirá datos ni le venderá nada" y "puede escuchar la llamada": C4 ya dice que no habrá llamadas de venta y los guardrails (archivo 07) lo imponen; no hay obligación de decirlo en la llamada.
- "La grabación empieza ahora" en el paso al niño: el aviso de grabación se da antes de la tecla 1, que es cuando empieza a grabarse; D14 deja de exigir un tramo bloqueado en el paso al niño (no lleva ningún aviso).

Mantiene D14: la parte bloqueada (de dónde llama, automatizada con voz artificial, grabación) no admite tecla; solo las instrucciones de teclas la admiten. Duración medida de los clips sin el nombre: es-419 15,0 s en total (parte bloqueada 9,9 s), es-ES 13,2 s, en 12,2 s; más ~0,8 s del nombre.

### Revelación de IA: ¿basta "llamada automatizada"? (consulta de Juan, 19-oct-2026)

Conclusión: la palabra sola ("automatizada") no basta como revelación de voz artificial/IA en la UE y es insuficiente en EE. UU.; por eso la versión implementada añade "con voz artificial" (3 palabras). Es la fórmula más discreta que cubre el requisito: es el término de la TCPA, un niño de 3 a 8 años no lo asocia a una máquina, y deja explícito que no habla una persona. "Automatizada" suena a mensaje grabado; la llamada luego conversa con el personaje, y decir solo "automatizada" puede inducir a error sobre lo que es (publicidad engañosa).

| Mercado | ¿"Automatizada" a secas basta? | Riesgo de omitir "voz artificial" | Fórmula implementada |
|---|---|---|---|
| EE. UU. | No | Medio: la FCC (feb-2024) trata la voz de IA como "artificial voice"; la TCPA exige identificar al llamante, no la palabra "IA" `[no verificado: propuesta de la FCC de exigir revelar la IA, no final]`; el que contesta puede no ser el abonado que consintió; leyes estatales de bots/IA `[no verificado]`; FTC por omisión engañosa | "an automated call from Jinglo with an artificial voice" |
| UE/España | No | Alto: AI Act art. 50(1) pide informar de que se interactúa con una IA salvo que sea obvio por el contexto; una voz natural por teléfono, aunque venga "del Polo Norte", no es obvia; "automática" no dice que no hay una persona | "llamada automática de Jinglo, con voz artificial" |
| Reino Unido | No (recomendado) | Medio: sin norma de IA, pero omisión engañosa (DMCC Act 2024 / CPRs 2008) y transparencia del UK GDPR `[no verificado]` | "automated call from Jinglo with an artificial voice" |
| México | Probablemente sí | Bajo a medio: no se conoce norma específica de IA en llamadas `[no verificado]`; aplican LFPDPPP y protección al consumidor; políticas de ElevenLabs, Twilio y Meta piden no engañar sobre la IA `[no verificado]` | "llamada automatizada de Jinglo, con voz artificial" |

Decisión: no se implementa ninguna omisión. El texto `es-419` se usa también para hispanos en EE. UU. y otros países, por lo que no puede omitirse por idioma; omitirlo solo en México exigiría decidir por país de la línea llamada, que el código hoy no hace, y tiene riesgo no nulo. Si Juan quiere la versión sin "con voz artificial", requiere su confirmación expresa (y, en México, un cambio de código por país); en UE no se recomienda en ningún caso.

Constancia de aprobación:

| Texto | Id | Estado | Fecha | Aprobó |
|---|---|---|---|---|
| Preludio, repetición, paso al niño, baja, sin respuesta: Santa en es-419, es-ES, en-US y en-GB | `03-SANTA-<idioma>-legal-v1.3` | Aprobado tal como está en B1 | 19-oct-2026 | `legal-compliance` |
| Reyes Magos, Rex, Ratoncito Pérez y Tooth Fairy | `03-REYES-`, `03-REX-`, `03-PEREZ-`, `03-TOOTH-` | Siguen en `legal-v1.2` hasta que existan esos productos; al implementarlos se les aplica la estructura de B1 (origen del personaje en lugar de "Polo Norte") | 19-oct-2026 | `legal-compliance` |

Pendiente: un hablante nativo escucha los clips (acento de la voz de catálogo en español y el empalme con el nombre dicho por la voz del teléfono) antes de la primera venta; cualquier cambio de redacción vuelve a `legal-compliance`.
