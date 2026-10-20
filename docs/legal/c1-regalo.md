# C1-regalo: compra de abuelos, tios y padrinos con permiso de los padres (propuesta)

legal-compliance · 19-oct-2026 · SOLO PROPUESTA: no esta implementada ni aprobada. Cambia el aviso COPPA (`docs/legal/textos/01`) y el preludio (`03`), por lo que necesita revision de abogado antes de la campana de diciembre. Las afirmaciones legales sin fuente primaria llevan [no verificado].

## 1. El problema

La casilla C1 actual dice, en sustancia, "soy madre, padre o tutor y autorizo". El consentimiento parental verificable de hoy es el cobro de tarjeta del propio padre (texto 01, regla 3). En diciembre muchos compradores son abuelos, tios o padrinos: C1 les obliga a marcar algo falso o a no comprar. Si lo marcan sin ser tutores, el consentimiento del cobro no es del padre y la grabacion de la voz del nino queda sin base valida (COPPA en EE. UU.; en Espana y UK, el consentimiento de los titulares de la patria potestad [no verificado: edades exactas 14 en Espana y 13 en UK]; en Mexico, consentimiento de padres o tutores para datos de menores [no verificado: articulo aplicable]).

Principio: el que paga no tiene por que ser el que autoriza, pero alguien con autoridad sobre el nino debe autorizar antes de grabar su voz. No se baja el nivel de proteccion: se mueve el momento de la confirmacion.

## 2. Propuesta en tres capas

### Capa A. Casilla alternativa en el checkout (C1-regalo)

El comprador elige UNA de dos casillas (ambas empiezan sin marcar; el boton sigue deshabilitado hasta marcar una):

- C1: "Soy madre, padre o tutor de este nino/a y autorizo la llamada." (como hoy)
- C1-regalo: "Compro esta llamada como regalo. No soy su madre, padre ni tutor. Entiendo que la persona adulta que conteste la llamada tendra que confirmar que es su madre, padre o tutor; si no lo confirma, la llamada no se hara y se me reembolsara todo."

Textos (ids propuestos `01-C1R-<locale>-legal-v1.4`):

**es-419**: "Compro esta llamada como regalo y no soy la madre, el padre ni el tutor de {{NOMBRE_NINO}}. Entiendo que quien conteste el telefono debera confirmar que es su madre, padre o tutor antes de que se grabe nada; si no lo confirma, no habra llamada y me reembolsan el total."

**es-ES**: "Compro esta llamada como regalo y no soy la madre, el padre ni el tutor legal de {{NOMBRE_NINO}}. Entiendo que quien conteste el telefono tendra que confirmar que es su madre, padre o tutor antes de que se grabe nada; si no lo hace, no habra llamada y se me reembolsara el importe integro."

**en**: "I am buying this call as a gift and I am not {{CHILD_NAME}}'s parent or legal guardian. I understand that whoever answers the phone must confirm they are the child's parent or guardian before anything is recorded; if they do not, the call will not happen and I will be fully refunded."

Mas, en el mismo bloque, un campo obligatorio: "Telefono de la persona que contestara (madre, padre o tutor)". Es el numero que ya se pide; solo se rotula distinto. Nada nuevo se recoge.

Reglas de colocacion: iguales a las del texto 01 (visible sin clic, antes del boton, sin marcar). El aviso directo completo se muestra igual en ambos casos.

### Capa B. Confirmacion del adulto que contesta, en el preludio

Solo cuando el pedido es C1-regalo, el preludio (D20) anade una frase y cambia el sentido de la tecla 1. Mecanismo: DTMF, no voz (igual que hoy: un nino podria decir "si").

Flujo (cambios sobre texto 03, seccion A):

1. Sin grabacion ni transcripcion hasta el paso 5 (igual).
2. Preludio con la frase nueva (despues de "se grabara para su familia"):
   - es-419: "Un familiar la pidio como regalo. Para continuar, marque 1 solo si es la madre, el padre o el tutor de {{NOMBRE_NINO}} y esta de acuerdo con que se grabe la llamada. Para no recibir mas llamadas, marque 2."
   - es-ES: "Un familiar la ha pedido como regalo. Para continuar, marque 1 solo si es la madre, el padre o el tutor legal de {{NOMBRE_NINO}} y esta de acuerdo con que se grabe la llamada. Para no recibir mas llamadas, marque 2."
   - en: "A relative ordered this as a gift. To continue, press 1 only if you are {{CHILD_NAME}}'s parent or legal guardian and you agree to the call being recorded. To stop all calls, press 2."
3. Tecla 1: se registra la confirmacion (hora, id del pedido, `guardian_confirmed=true`) y empieza la grabacion. Tecla 2: baja (como hoy): sin llamada, lista de supresion, reembolso total al comprador.
4. Sin tecla tras dos esperas de 8 s: cuelga, sin grabacion; cuenta como intento. NO se asume consentimiento por silencio.
5. La segunda tecla 1 (cuando el nino toma el telefono) queda igual.
6. Tras 3 intentos sin confirmacion (limite actual de reintentos), el pedido se cancela y se reembolsa todo, con correo al comprador: "No pudimos confirmar con la familia. Te devolvimos todo." Sin decir quien contesto ni por que.

Presupuesto de tiempo: la frase anade unos 8 s al preludio (hoy unos 15 s). El reloj de 300 s corre desde la segunda tecla, asi que no afecta la duracion de la conversacion. Hay que regrabar los clips del preludio (coste de creditos, a aprobar por Juan; con voz de catalogo, del orden del que ya se estimo para D20) y probarlos con oido nativo.

### Capa C. Respaldo para EE. UU. (recomendada, aun mas fuerte)

La tecla 1 no es un metodo de verificacion de consentimiento parental reconocido en la lista de la FTC [no verificado: confirmar con abogado de EE. UU.]. Mitigacion que no cuesta: la barrera real sigue siendo la combinacion de (i) declaracion escrita del comprador, (ii) afirmacion expresa del adulto que contesta, registrada con hora, y (iii) minimizacion: no se pide ningun dato al nino, se borra a los 30 dias, sin publicidad ni entrenamiento. Para EE. UU. conviene ademas, si el abogado lo exige, un correo de confirmacion con enlace al padre (metodo "email plus") [no verificado]; eso exige pedir al comprador el correo del padre, un campo nuevo, y retrasa la entrega. Decision: no incluirlo en diciembre salvo que el abogado de EE. UU. lo pida; en EE. UU. activar C1-regalo solo si el abogado lo aprueba (ver riesgo R-A).

## 3. Registro y pruebas (arquitecto implementaria, no yo)

- Campo `consent_basis` en el pedido: `parent_purchase` | `gift_guardian_keypress`.
- Para C1-regalo, no iniciar grabacion ni transcripcion si falta `guardian_confirmed=true` (prueba automatica obligatoria: llamada simulada sin tecla 1 => cero bytes de audio guardados).
- Eventos en `analytics/events.ts` antes del codigo: `gift_checkout_selected`, `guardian_confirmed`, `guardian_declined`, `guardian_unconfirmed_cancelled`. Sin nombre del nino ni telefono.
- El recibo y el correo de confirmacion repiten el aviso y, en regalo, dicen que se pedira la confirmacion al contestar.
- Politica de privacidad y terminos: una linea nueva que describa la base legal (consentimiento del titular de la patria potestad dado al contestar) y el reembolso total si no se confirma.

## 4. Riesgos

| Id | Riesgo | Nivel | Mitigacion |
|---|---|---|---|
| R-A | En EE. UU. la tecla 1 no cuenta como consentimiento parental verificable; la llamada con regalo podria infringir COPPA | Alto | No activar C1-regalo en EE. UU. sin visto bueno de abogado; mientras tanto C1 solo para tutores. Capa C |
| R-B | Un nino pulsa 1 | Medio | La frase lo dice a un adulto, la segunda tecla confirma que el nino tiene el telefono, el aviso de teclas no es lo que un nino de 3 a 8 entiende; limitacion ya reconocida en el texto 03 |
| R-C | El comprador no es del circulo del nino y pone un numero ajeno (acoso o regalo no deseado) | Medio | Doble opt-out (tecla 2, lista de supresion), llamada solo en ventana horaria y limite de intentos; el comprador no recibe datos de quien contesto |
| R-D | El comprador marca C1 aunque es abuelo (para saltarse el paso) | Medio | Texto de C1 explicito; el cobro sigue siendo del comprador; si el contestador dice "no soy el padre" y pulsa 2, hay reembolso total. No se puede verificar mas sin pedir mas datos |
| R-E | Aumenta la fraccion de llamadas que no se hacen (el adulto no entiende o cuelga) | Medio (negocio) | Reembolso automatico y mensaje claro; medir `guardian_unconfirmed_cancelled`; correo al comprador avisando que la familia puede recibir una llamada que pide confirmacion |
| R-F | Espana y UK: mayor exigencia de base legal para menores y de informacion previa al titular | Medio | Mantener ES y GB apagados hasta tener voz y revision propias (estado actual); no hay oferta de regalo ahi en diciembre salvo aprobacion |
| R-G | Cambia el preludio aprobado en D20 | Bajo | Se versiona (`legal-v1.4`); la frase solo se anade en pedidos C1-regalo |

## 5. Lo que necesita aprobacion

1. Juan: ok para regrabar los clips del preludio (coste de creditos de voz de catalogo, por estimar) y para que arquitecto implemente despues de la aprobacion legal.
2. Abogado (pendiente de contratar, ver reporte del 19-oct): validar capa B para MX y capa C para EE. UU.
3. qa-redteam: escenarios nuevos (abuelo compra, contesta el nino, contesta un vecino, tecla 2, sin tecla).

Recomendacion: implementar capa A y B para MX en diciembre (el mercado activo); EE. UU., ES y GB no hasta la revision.
