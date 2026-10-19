# 03. Preludio hablado al adulto que contesta

Versión `legal-v1.2` · 18-oct-2026 (revisión D13: el preludio al adulto nombra a Lumen Labs y es la revelación completa de IA, el paso al niño avisa al adulto de que el personaje no dirá que es IA, y la primera frase al niño ya no menciona la computadora; antes, revisión D11 `legal-v1.1`: reloj de la llamada, espera de la segunda tecla, bloque en-GB propio, aprobación es-ES y en-GB) · Productos: santa (Santa / Papá Noel), Reyes Magos (add-on de santa), rex (Rex y Ratoncito Pérez), memorias (permiso explícito de una persona mayor). Las líneas de voz de dot y ciudadania, donde la persona llama, usan el aviso corto de la sección F.

Fuentes: `docs/investigacion/santa.md` 5.2 (preludio al adulto cierra el riesgo de grabación y confirma que hay un adulto), 5.3 (identificar al emisor, revelar IA, baja fácil), 5.4 (art. 50 del AI Act). Desde D13 el preludio es uno de los tres puntos donde se revela la IA al adulto responsable (checkout C3, correo de confirmación y recordatorio, preludio); al niño no se le revela (archivo 07, C-06).

## A. Flujo común (obligatorio, lo implementa `arquitecto`)

1. La llamada sale. Si el detector de buzón de voz responde: colgar sin hablar ni dejar mensaje. Cuenta como intento.
2. Sin grabación ni transcripción hasta el paso 5. Solo se registra el intento (hora, resultado, id del pedido).
3. El agente reproduce el preludio (sección B o C). Es un texto fijo, no generado por el modelo. Duración máxima 35 segundos.
4. Espera 8 segundos una tecla. Si no hay tecla, repite solo la última frase una vez ("Pulse 1 para continuar o 2 para cancelar."). Si tras otros 8 segundos no hay tecla, dice la frase de cierre sin respuesta y cuelga. Cuenta como intento.
5. Tecla 1: comienzan la grabación y la transcripción; el agente dice la frase de paso al niño. Tecla 2: el agente dice la frase de baja, cuelga, se escribe en la lista de supresión y se cancela el pedido con reembolso (archivo 05).
6. Solo el DTMF (tecla) vale para el paso 5. Si la persona dice "sí" sin pulsar, el agente responde "Para continuar, pulse 1 en el teléfono." No se acepta voz sola, porque un niño podría decir "sí".
7. Segunda tecla 1: "listo". Solo entonces habla el personaje. La frase de presentación al niño (sección B) es del personaje y NO menciona computadora, inteligencia artificial ni grabación (D13): esa información ya se dio al adulto en el preludio y el paso al niño.
   - **Reloj de la conversación**: el `max_call_seconds` (300 s en santa, Reyes Magos y rex) y la despedida a 240 s se cuentan desde esta segunda tecla. El preludio, las esperas de tecla y el paso al niño no cuentan. El servidor registra la hora de la segunda tecla como inicio del reloj (archivo 07, A-07).
   - **Espera máxima de la segunda tecla: 60 segundos** desde que termina la frase de paso al niño. A los 30 segundos el agente repite una vez: es-419 "Cuando {{NOMBRE_NIÑO}} tenga el teléfono, pulse 1 otra vez."; es-ES "Cuando {{NOMBRE_NIÑO}} tenga el móvil, pulse 1 otra vez."; en-US "When {{NOMBRE_NIÑO}} has the phone, press 1 again."; en-GB "When {{NOMBRE_NIÑO}} has the mobile, press 1 again." Si a los 60 segundos no hay tecla: frase de "sin respuesta" de su idioma, cuelga, cuenta como intento y se borra de inmediato la grabación de la espera. El personaje no llega a hablar.
8. El agente no pide, no repite y no guarda ningún dato personal durante el preludio.

Limitación conocida: ni el sistema ni nadie puede comprobar que quien pulsa 1 es un adulto. La barrera real es el consentimiento del comprador en el checkout (archivos 01 y 02) más la programación de la hora por el propio padre. `[no verificado: si un niño que pulsa 1 invalida el consentimiento; mitigado por la instrucción hablada y por el cobro con tarjeta]`.

---

## B. Santa, Reyes Magos y Rex (llamada a un niño)

### B1. Preludio, Santa

**es-419** (`03-SANTA-es-419-legal-v1.2`)

> Hola. Esta es una llamada automatizada con voz de inteligencia artificial de Lumen Labs. Llamamos porque la madre, el padre o el tutor de {{NOMBRE_NIÑO}} pidió una llamada de Santa. Esta voz no es una persona. Si continúa, la llamada se grabará para entregársela a la familia. Si usted es la persona adulta responsable, pulse 1 para continuar. Si prefiere no recibir esta llamada, pulse 2 y no volveremos a llamar a este número.

Repetición: "Pulse 1 para continuar o 2 para cancelar."

Tecla 1, paso al niño: "Gracias. La grabación empieza ahora. Cuando {{NOMBRE_NIÑO}} tenga el teléfono, pulse 1 otra vez. Santa hablará con {{NOMBRE_NIÑO}} como el personaje, sin decirle que es una voz de inteligencia artificial; usted decide si se lo cuenta. Santa no le pedirá datos ni le venderá nada, y usted puede escuchar la llamada. Para terminar en cualquier momento, cuelgue."

Tecla 2: "Entendido. No volveremos a llamar a este número. Que tenga un buen día."

Sin respuesta: "No recibimos respuesta, así que terminamos aquí. Hasta pronto."

Primera frase de Santa al niño, después de la segunda tecla (D13): "¡Jo, jo, jo! Hola, {{NOMBRE_NIÑO}}. Soy Santa, ¡y te llamo desde el Polo Norte! ¿Cómo estás?"

**es-ES** (`03-SANTA-es-ES-legal-v1.2`)

> Hola. Esta es una llamada automatizada con voz de inteligencia artificial de Lumen Labs. Llamamos porque la madre, el padre o el tutor de {{NOMBRE_NIÑO}} ha pedido una llamada de Papá Noel. Esta voz no es una persona. Si continúa, la llamada se grabará para entregársela a la familia. Si usted es la persona adulta responsable, pulse 1 para continuar. Si prefiere no recibir esta llamada, pulse 2 y no volveremos a llamar a este número.

Repetición: "Pulse 1 para continuar o 2 para cancelar."

Paso al niño: "Gracias. La grabación empieza ahora. Cuando {{NOMBRE_NIÑO}} tenga el móvil, pulse 1 otra vez. Papá Noel hablará con {{NOMBRE_NIÑO}} como el personaje, sin decirle que es una voz de inteligencia artificial; usted decide si se lo cuenta. Papá Noel no le pedirá datos ni le venderá nada, y usted puede escuchar la llamada. Para terminar en cualquier momento, cuelgue."

Baja: "Entendido. No volveremos a llamar a este número. Que tenga un buen día."

Sin respuesta: "No hemos recibido respuesta, así que terminamos aquí. Hasta pronto."

Primera frase al niño (D13): "¡Jo, jo, jo! Hola, {{NOMBRE_NIÑO}}. Soy Papá Noel, ¡y te llamo desde el Polo Norte! ¿Cómo estás?"

**en-US** (`03-SANTA-en-US-legal-v1.2`)

> Hello. This is an automated call with an artificial intelligence voice from Lumen Labs. We are calling because the parent or guardian of {{NOMBRE_NIÑO}} requested a call from Santa. This voice is not a person. If you continue, the call will be recorded and given to the family. If you are the responsible adult, press 1 to continue. If you prefer not to receive this call, press 2 and we will not call this number again.

Repeat: "Press 1 to continue or 2 to cancel."

Hand-off: "Thank you. Recording starts now. When {{NOMBRE_NIÑO}} has the phone, press 1 again. Santa will speak with {{NOMBRE_NIÑO}} as the character, without telling your child that this is an artificial intelligence voice; it is up to you whether to tell them. Santa will not ask for any information or sell anything, and you are welcome to listen in. To end the call at any time, just hang up."

Opt-out: "Understood. We will not call this number again. Have a good day."

No response: "We did not get a response, so we will end here. Goodbye."

First line to the child (D13): "Ho, ho, ho! Hello, {{NOMBRE_NIÑO}}. I'm Santa, and I'm calling you from the North Pole! How are you?"

**en-GB** (`03-SANTA-en-GB-legal-v1.2`, bloque aprobado en D11, revisado en D13)

> Hello. This is an automated call with an artificial intelligence voice from Lumen Labs. We are calling because the parent or guardian of {{NOMBRE_NIÑO}} requested a call from Father Christmas. This voice is not a person. If you continue, the call will be recorded and given to the family. If you are the responsible adult, press 1 to continue. If you prefer not to receive this call, press 2 and we will not call this number again.

Repeat: "Press 1 to continue or 2 to cancel."

Hand-off: "Thank you. Recording starts now. When {{NOMBRE_NIÑO}} has the mobile, press 1 again. Father Christmas will speak with {{NOMBRE_NIÑO}} as the character, without telling your child that this is an artificial intelligence voice; it is up to you whether to tell them. Father Christmas will not ask for any information or sell anything, and you are welcome to listen in. To end the call at any time, just hang up."

Opt-out: "Understood. We will not call this number again. Have a good day."

No response: "We did not get a response, so we will end here. Goodbye."

First line to the child (D13): "Ho, ho, ho! Hello, {{NOMBRE_NIÑO}}. I'm Father Christmas, and I'm calling you from the North Pole! How are you?"

Regla de emisor (D13): el preludio de los personajes para niños nombra siempre al emisor como "Lumen Labs" (D9), no con `{{MARCA}}`, para que la revelación de IA y la identificación del emisor sean idénticas en todos los productos. La frase de paso al niño avisa al adulto de que el personaje no le dirá al niño que es una IA (la decisión de contárselo es de la familia).

Regla de nombre: el nombre del personaje debe ser el mismo en el checkout, el preludio, la primera frase y E-01. En en-GB es "Father Christmas" por defecto; si el checkout dice "Santa", se usa el bloque en-US sin cambios.

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
