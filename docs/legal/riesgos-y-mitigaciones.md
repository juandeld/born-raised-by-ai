# Riesgos y mitigaciones legales (sin abogado, por diseño conservador)

Estado: 18-oct-2026 · Autor: `legal-compliance` · Reemplaza a `brief-abogado.md` por la decisión D6 de Juan (no se contrata abogado; los textos finales los produce `legal-compliance`). Los textos están en `docs/legal/textos/`.

Convención: `[no verificado]` marca una afirmación legal que no se pudo confirmar con una fuente primaria en esta revisión. Las fuentes con enlace están en `docs/investigacion/santa.md` sección 5. Ningún texto de este paquete fue revisado por un abogado humano.

## 1. Qué significa decidir sin abogado (para que Juan lo vea una vez, completo)

- La mitigación por diseño reduce la probabilidad y el tamaño de un problema; no lo elimina. Lo que más pesa y menos se puede cubrir con texto es la TCPA en EE. UU. (daños de $500 a $1,500 por llamada, con posibilidad de demandas colectivas) y la voz de menores bajo COPPA con la regla vigente desde abr-2026.
- Por eso el diseño elige ser más estricto de lo necesario: llamadas de EE. UU. cerradas por defecto hasta que Juan las abra (sección 3), un adulto confirma con una tecla antes de grabar, nada se graba ni se guarda antes de esa tecla, borrado a 30 días, reembolso automático a 7 días.
- Cuando ocurra uno de los disparadores de la sección 4, el agente deja de decidir solo, congela la venta del producto afectado en el mercado afectado y avisa a Juan el mismo día. El gasto en abogado entonces sale del presupuesto del producto; el límite anterior de ~$400 se conserva como referencia de una primera consulta.
- Responsabilidad personal: con D5 (persona individual) los reclamos recaen sobre el patrimonio personal de Juan. La mitigación es no vender donde el riesgo no se entiende y migrar a S.A. cuando se cumpla el disparador de D5 (`docs/decisiones.md`). Un seguro de responsabilidad o de ciberriesgos es una opción que no se evaluó `[no verificado]`.

## 2. Tabla de riesgos

Leyenda de severidad: A alta, M media, B baja (estimación de `legal-compliance`, no un dato).

| # | Riesgo | Sev. | Mitigación por diseño | Evidencia que se guarda | Qué dispararía la necesidad de un abogado |
|---|---|---|---|---|---|
| R1 | COPPA: consentimiento parental verificable insuficiente. La investigación dice que el cobro con tarjeta cuenta si hay aviso previo, cargo real y recibo (FTC FAQ I.4 a I.6); no se confirmó que valga con un comerciante de registro (Polar) ni para voz. `[no verificado]` | A | Aviso directo visible antes del pago; casillas C1 y C2; botón deshabilitado hasta marcar; recibo propio por Resend; sin cargo no hay llamada; reembolso antes de la llamada invalida el consentimiento (textos 01) | `consent_records`: texto, hash, hora UTC, IP, id del cobro; recibo enviado (estado de Resend) | Carta de la FTC o de un fiscal estatal; queja de un padre citando COPPA; Polar o Recurrente pidiendo otro mecanismo de verificación |
| R2 | COPPA: la voz como dato biométrico y la retención. La excepción de borrado inmediato no aplica porque grabamos y entregamos (sección 5.1) | A | Sin huellas de voz; sin entrenamiento; retención 30 días escrita en política y avisos; borrado automático incluso en proveedores; sin cuentas de niños | Política versionada; registro de borrados (job, hora, resultado); prueba T-20 | Brecha que toque voces de menores; un proveedor que no pueda borrar o que entrene con los datos; cambio de la regla COPPA |
| R3 | TCPA: llamada con voz de IA a un número que indicó un tercero (el comprador). El consentimiento previo expreso lo da la persona llamada, no el comprador `[no verificado: si el consentimiento del comprador y la tecla 1 bastan]` | A | C4 y C5; la llamada la pide, paga y programa el comprador; preludio con tecla 1 y tecla 2; ventana de 8:00 a 21:00; máximo 2 intentos; no se deja mensaje en buzón; baja inmediata y lista de supresión; ningún marketing posterior; EE. UU. cerrado por defecto (sección 3) | `consent_records` C3 a C5; registro de intentos y resultados (13 meses); lista de supresión | Carta de demanda TCPA, aunque sea una sola; primer pedido a EE. UU. a escala (disparador en la sección 3); un operador que bloquee o marque las llamadas |
| R4 | Grabación sin consentimiento de todas las partes (12 estados: CA, CT, DE, FL, IL, MD, MA, MT, NV, NH, PA, WA) | A | Nada se graba hasta la tecla 1 tras el aviso hablado; la voz del adulto que contesta nunca se graba si no acepta; en Memorias doble permiso | Versión del preludio (03-...-legal-v1) y resultado por llamada; marca de la confirmación hablada | Una persona que alegue que se la grabó sin permiso y exija acción; cambio de la ley de un estado |
| R5 | AI Act art. 50 (España/UE): informar de la interacción con IA, y que el niño no sea engañado | M | Desde D13 (18-oct-2026) la revelación de IA es íntegra para el adulto responsable en tres puntos (casilla C3 del checkout, correo de confirmación y recordatorio, preludio telefónico con "Lumen Labs"); el personaje no la repite al niño y ante un adulto que pregunta nunca lo niega (archivo 07, C-06, D-03b). Ver R24 para el detalle y el riesgo residual. `[no verificado: si basta informar al adulto o si hay que informar al niño, y la redacción exacta]` | Textos 02, 03, 07 con versión; pruebas T-06 y SN-34 | Requerimiento de una autoridad de consumo o de datos; reclamo de un padre porque "engañaron" al niño o porque no se le avisó a él |
| R6 | RGPD, UK GDPR y la ley mexicana de datos: base jurídica, derechos, transferencias, edad de consentimiento. `[no verificado: todo el bloque, incluido el consentimiento digital de 14 años en España y 13 en UK, y el aviso de privacidad en México]` | M | Compra siempre por un adulto; derechos (acceso, rectificación, borrado) servidos por correo y enlace en 7 días; transferencias declaradas; sin analítica con cookies; minimización de datos | Política versionada; solicitudes de derechos y su resolución (hora, tipo, resultado, sin contenido) | Queja ante la AEPD, el ICO o la autoridad mexicana; solicitud de un padre que no podamos resolver con borrado; vender a un país que no está en la lista (BR, resto de UE) |
| R7 | Leyes estatales de datos biométricos (por ejemplo Illinois, Texas, Washington) si la voz se considera identificador biométrico `[no verificado]` | M | No se hacen huellas de voz ni identificación de hablante; la voz se usa solo para conversar; borrado 30 días | Configuración de proveedores (captura de pantalla fechada); política | Una demanda o carta bajo una de esas leyes |
| R8 | ElevenLabs: Prohibited Use Policy (menores, engaño, transparencia). No se pudo leer el texto completo (página con JS) | A | Solicitud escrita de confirmación del caso de uso (`solicitud-elevenlabs.md`); personaje folclórico, no se imita a personas reales; consentimiento parental; sin voz clonada; ElevenLabs publicó un Santa propio en 2024, lo que sugiere que el uso es aceptable (investigación 5.5) | El correo de solicitud y su respuesta (guardados en el repo, sin datos personales); versión de la política consultada con fecha | Suspensión de la cuenta; respuesta que pida aprobación previa o cambie las condiciones; falta de respuesta con tiempo para vender antes del 20-nov: Juan decide si lanzar sin la confirmación |
| R9 | Anthropic, Google, Twilio y sus políticas para productos que atienden a menores `[no verificado para Twilio y Google; Anthropic exige salvaguardas apropiadas a la edad]` | M | Salvaguardas del archivo 07; el modelo recibe solo nombre y datos opcionales saneados; sin envío de datos de contacto | Capturas fechadas de las políticas leídas; configuración del proveedor | Aviso de violación o suspensión de cualquiera de ellos |
| R10 | Meta Ads: rostros de menores, claims, categoría de anuncios sobre niños. No se pudo leer el texto oficial | M | Público de adultos (padres); creativos sin rostros de menores reales y sin fotos de niños sin autorización escrita; revisión de cada creativo por `legal-compliance` en 24 h; sin promesas de resultado en pases | Creativo aprobado con el texto del anuncio en el PR; lista de claims prohibidos (archivo 06) | Anuncio rechazado de forma repetida o cuenta restringida; reclamo de un tercero por una imagen |
| R11 | Marcas e IP: Elf on the Shelf, Portable North Pole/PNP, Rudolph, Grinch, Polar Express, Frosty (prohibidas). Riesgos adicionales: "Rex" puede confundirse con el Rex de Toy Story; "Roadcheck" es un evento de CVSA; la marca propia sin registrar `[no verificado: estado de registro de varias de estas marcas]` | M | Lista prohibida en `00-leeme.md`; el agente no dice nombres ajenos aunque el niño los diga; Rex con diseño y frases propias, no un dinosaurio verde de juguete; plan "Roadcheck" renombrado; búsqueda de marca propia antes de comprar dominio | Búsqueda de marca fechada (capturas); revisión de cada creativo | Carta de cese y desista de cualquier titular; objeción de una tienda de apps o de un anunciante por una marca |
| R12 | El agente de voz dice algo inapropiado a un niño, o recibe una revelación de maltrato o autolesión | A | Guardrails de código y de prompt; filtro de moderación; corte por tiempo; cierre forzado; correo neutro al padre; 20 pruebas obligatorias (archivo 07) | Registro de incidentes sin contenido; resultados de las pruebas por versión del prompt | Un incidente real de maltrato, autolesión o contenido inapropiado; una queja formal de un padre; una petición de una autoridad de ver una grabación |
| R13 | Quien contesta no es un adulto, o es un niño que pulsa 1 | M | Instrucción hablada, solo tecla (no voz), programación por el padre, correo recordatorio al comprador con la hora; el comprador puede escuchar. Riesgo residual aceptado: no se puede verificar la edad `[no verificado: efecto legal]` | Resultado de cada intento | Un caso concreto de un niño solo en la llamada con un reclamo |
| R14 | Pases de examen: afirmaciones engañosas de aprobación (publicidad engañosa), y servicios migratorios sin autorización (ciudadanía) `[no verificado: reglas estatales]`; educación previa a la licencia de seguros en Texas `[no verificado]` | A | Descargo en cada punto de contacto (archivo 06); lista de palabras prohibidas; la "garantía de repetir" solo con condiciones aprobadas; cero asesoría, cero formularios, cero "notario" | Descargo mostrado (versión y hash con C6); anuncios aprobados | Carta de una agencia (TDI, FTC, un fiscal estatal, USCIS) o de un organismo de licencias; una queja por un caso de cliente que dice haber sido mal asesorado |
| R15 | Reembolsos y contracargos: pérdida de cuenta con Polar o Recurrente, y el 7 días puede ser explotado | M | Reembolso automático sin preguntas; botón en el recibo; mensaje previo a disputar; respuesta estándar de la sección 6; reglas de `reglas-de-decision.md`: pausar un país si los reembolsos pasan de 8 % | Registro de cada reembolso (motivo, monto, canal); evidencia de entrega (registro de 13 meses) | Más de 3 contracargos en 30 días o una tasa mayor a 0.9 % de las ventas `[no verificado: umbrales de las redes de tarjeta]`; aviso de Polar o Recurrente de revisión o suspensión; un contracargo por "cargo no autorizado" con uso de datos de un niño |
| R16 | Impuestos y titularidad (D5): persona individual en Guatemala, Pequeño Contribuyente 5 %; IVA/ventas del comprador | M | Polar como comerciante de registro maneja el IVA del comprador `[fuente: pagos-guatemala.md]`; con Recurrente (plan B) Juan asume el rol y debe validarlo el contador | Contrato de Polar; constancias de SAT | Pasar a Recurrente como cobro principal; superar el umbral de ingresos del régimen (disparador de S.A. en D5); requerimiento de una autoridad fiscal o de ventas de otro país |
| R17 | La política dice una cosa y el código hace otra (por ejemplo, no borra) | A | PR bloqueante; prueba T-20; tabla de retención y de proveedores revisada en cada cambio; PostHog sin datos personales | Resultados de la prueba de borrado por versión | Cualquier hallazgo de que no se borró algo prometido; una queja de un padre |
| R18 | Brecha de datos | A | Mínimo de datos; cifrado; acceso limitado; retención corta (casi todo desaparece a los 30 días); sin datos de tarjeta propios | Registro de accesos, de eliminaciones y de incidentes | Cualquier brecha que afecte a menores o voces; notificación obligatoria a una autoridad (plazos de la UE y de EE. UU. `[no verificado]`) |
| R19 | Memorias: persona mayor, capacidad de consentir, terceros mencionados, información sensible `[no verificado]` | M | Doble permiso (tecla y "sí" hablado); parar cuando quiera; temas cerrados; filtro de fragmentos sensibles; cierre ante confusión; reembolso automático | Marca del permiso en la transcripción; incidentes `confusion` | Una queja de un familiar de la persona llamada; una persona que niegue haber aceptado |
| R20 | Colorear: fotos de menores subidas por alguien que no es su familiar | M | Casilla C1-F; retención de 7 días; sin reconocimiento facial; Google solo para generar | Casilla y texto con hash; registro de borrado | Una queja de un padre por la foto de su hijo; una solicitud de borrado de un tercero |
| R21 | Creativos y landings con menores reales, testimonios o cifras de aprobación | M | Revisión por `legal-compliance` en 24 h; sin fotos de menores reales sin autorización escrita; testimonios solo reales | Aprobación escrita por PR | Un tercero que reclame una imagen o un testimonio |
| R22 | Prompt injection por los campos opcionales o por la voz | M | Saneamiento (A-06), herramientas mínimas (A-04), pruebas T-08 y T-14 | Pruebas y su resultado | Una explotación real que filtre datos o cambie el comportamiento |
| R23 | Cambio de política de un proveedor (ElevenLabs, Twilio, Anthropic, Polar) que haga inviable el producto | M | Segunda opción para el cobro (Recurrente); el motor de voz se puede mover de proveedor (decisión de `arquitecto`) | Fechas de las políticas leídas | Aviso de cambio que afecte a menores o voces |
| R24 | Ilusión de Santa / no revelación de IA al niño (D13, 18-oct-2026): el personaje se presenta como Santa y nunca dice al niño que es una IA ni que hay grabación; la decisión es de Juan y no se propone revertirla | M | (1) Revelación completa al adulto responsable en tres puntos, antes del pago y antes de grabar: casilla C3 ("inteligencia artificial de Lumen Labs, no una persona", "se grabará" y que el personaje hablará con su hijo sin decirle que es IA), correo de confirmación y recordatorio, y preludio telefónico con tecla 1 ("llamada automatizada con voz de inteligencia artificial de Lumen Labs", "Esta voz no es una persona", aviso de que no se lo dirá al niño). (2) Consentimiento previo y registrado (texto, hash, hora, IP) de quien paga; el adulto elige comprar la ilusión y decide si se la cuenta a su hijo. (3) El niño no tiene capacidad legal para consentir ni contratar; la relación contractual y los avisos son con el adulto. (4) Práctica equivalente a las llamadas y visitas tradicionales de Santa y a la ficción navideña que las familias ya organizan. (5) Salvaguardas que no dependen de la ilusión: el adulto que pregunta recibe D-03b y nunca un desmentido; el niño no recibe datos, ventas ni promesas; cierre forzado ante señales de riesgo (archivo 07); la grabación se entrega al adulto, que puede escucharla. (6) Pregunta del niño sin dañar: E-01 a E-03 no afirman "soy una persona" ni "soy humano" y no confirman ni niegan quién trae los regalos. **Riesgo residual (honesto):** el art. 50 del AI Act exige informar de que se interactúa con una IA a "las personas físicas afectadas"; el niño es la persona que habla con el sistema y no está informado. El argumento de defensa es que la persona que encarga, consiente y puede escuchar la llamada es el adulto responsable y que el contexto (personaje navideño pedido por los padres) lo hace evidente para él, pero la excepción de "obvio para una persona razonablemente informada" se mide frente a quien interactúa y no hay criterio de autoridad que la aplique a niños `[no verificado: interpretación del art. 50.1 en España y UE; aplicación desde 2-ago-2026 según investigación 5.4]`. En EE. UU., la FTC puede ver un engaño si a un niño se le dice "soy Santa" en un servicio que se vende como llamada de IA; el contrapeso es que el comprador no es engañado, pero no hay precedente aplicable a menores en este formato `[no verificado: guías de la FTC sobre IA y publicidad engañosa, COPPA]`. Las leyes de bots (California, SB 1001 y similares) y la TCPA se centran en quien recibe la llamada y la revelación va al adulto que contesta `[no verificado]`. ElevenLabs puede considerar la no revelación al niño bajo su política de uso prohibido de suplantación o engaño `[no verificado: texto completo no leído]`; por eso `solicitud-elevenlabs.md` lo describe tal cual. | Textos 02-C3, 03 y 07 con versión `legal-v1.2`; correo de confirmación y recordatorio enviados (estado de Resend); registro de consentimiento; pruebas T-06 y SN-34 | Requerimiento o queja de una autoridad de consumo, datos o de la FTC sobre IA con menores; respuesta de ElevenLabs que prohíba o condicione el caso; queja formal de un padre que diga que no entendió el aviso; cambio de criterio del AI Act o de las guías de la FTC |

## 3. Semáforo de mercados (insumo para `marketing-growth` en D3; el ajuste lo decide Juan solo si va fuera de la lista)

| Mercado | Estado legal | Condición para vender llamadas |
|---|---|---|
| España | Amarillo | Textos `es-ES` publicados; C3 a C5; preludio; política con RGPD; AI Act art. 50 cubierto por aviso (R5). Proveedores fuera de la UE declarados (R6) |
| Reino Unido | Amarillo | Textos `en-GB`; mismo diseño. `[no verificado]` en UK GDPR y derechos del consumidor |
| México | Amarillo | Textos `es-419`; aviso de privacidad con ARCO. `[no verificado]` en la ley mexicana y la ley de protección al consumidor |
| EE. UU. (llamadas) | Rojo condicionado | Cerrado por defecto. Se abre solo si Juan aprueba por escrito después de leer R1 a R4 y de ver la respuesta de ElevenLabs. Al abrir, se empieza con el bundle y un tope de 20 llamadas la primera semana para medir quejas |
| EE. UU. hispano (pases: dot, ciudadania, seguros-tx) | Amarillo | Sin llamadas salientes: la persona llama o usa la web. Descargo (archivo 06); aviso corto (archivo 03 F); sin asesoría |
| Brasil y resto de la UE | Sin revisar | No se vende hasta que `legal-compliance` revise la ley local (LGPD y el equivalente a COPPA en Brasil, otros idiomas) y Juan apruebe |

## 4. Disparadores consolidados: cuándo se congela y se llama a un abogado

Cualquiera de estos hace que `legal-compliance` pause el producto en el mercado afectado, avise a Juan el mismo día y proponga si consultar a un abogado (primera consulta ~$400, referencia):

1. Un requerimiento escrito de ElevenLabs, Twilio, Anthropic, Google, Meta, Polar o Recurrente sobre menores, voz, consentimiento o contenido.
2. Un contracargo masivo: más de 3 en 30 días, o una tasa mayor a 0.9 % de las ventas, o un aviso de Polar o Recurrente.
3. Una queja de un padre que sea formal: escrita con cita de una ley, con amenaza legal, dirigida a una autoridad, o sobre un daño a su hijo.
4. Cualquier carta de una agencia o autoridad: FTC, fiscal estatal, FCC, AEPD, ICO, autoridad mexicana, USCIS, TDI, FMCSA/CVSA.
5. Una carta de demanda o una demanda, sea de TCPA o de cualquier otra ley.
6. Un incidente `maltrato` o `autolesion` en el que una autoridad pida la grabación o en el que el padre reclame.
7. Una brecha de datos que afecte a menores o a voces.
8. Una carta de cese y desista por una marca.
9. Abrir EE. UU. para llamadas a escala (más de 20 % de los pedidos o más de 50 llamadas por semana).
10. Querer vender en un mercado de la lista "Sin revisar", o agregar un dato de niños que no está en la lista aprobada.
11. Otros disparadores que no son de abogado: ingresos cerca de Q500,000 al año o querer separar patrimonio, lo que dispara la constitución de S.A. (D5) y la revisión del contador, no de un abogado.

Qué hace el agente mientras tanto: congela la venta del mercado afectado, conserva la evidencia (no la borra aunque pasen los 30 días, solo la que esté relacionada con el caso, con aprobación de Juan), no responde por su cuenta a la autoridad ni al reclamante más allá de un acuse de recibo, y prepara un resumen de una página con hechos y documentos.

## 5. Cambios de datos pendientes de aprobación de Juan

Regla de `CLAUDE.md`: todo cambio de datos recogidos lo aprueba Juan. Estos tres no agregan campos al formulario, pero fijan retenciones nuevas:

1. Registro de consentimiento (sin nombre del niño ni audio): 4 años `[no verificado]`.
2. Lista de supresión (huella irreversible del número): sin vencimiento.
3. Registro de entrega sin contenido: 13 meses `[no verificado]`.

También se declara en la política la IP y el hash con sal del número dentro del registro de consentimiento. Sin esta aprobación, los textos 01, 02 y 04 deben ajustarse y el consentimiento y el rechazo de contracargos solo se podrían demostrar durante 30 días.

## 6. Respuesta estándar a contracargos

Solo se contesta con metadatos; no se envía la grabación de un niño al banco ni a terceros salvo que lo pida la autoridad.

Regla económica: si el reembolso estaba disponible y el cobro es menor a $50, se acepta el contracargo y se reembolsa (cuesta menos que disputar) salvo que haya un patrón (3 o más del mismo correo, IP o tarjeta). Si la plataforma es Polar como comerciante de registro, ellos gestionan la disputa y `legal-compliance` les entrega la evidencia por su canal `[no verificado: el proceso exacto de disputas de Polar]`.

Plantilla (inglés, para el banco; adaptar el motivo):

> We are the merchant for [product] sold to [cardholder email] on [date], order [id], payment [id], amount [amount].
> 1. Authorization: at checkout the cardholder ticked [list of boxes] after seeing the notice and refund policy (screenshots and hashes attached). Consent time [UTC], IP [IP].
> 2. Delivery: [call/file] was delivered on [date/time] ([n] attempts, result [result], duration [seconds]). A receipt email was sent on [date] and delivered (provider status attached).
> 3. Refund policy: full automatic refund available until 7 days after delivery, requested with one click; no request was received before this dispute [or: the cardholder was refunded on [date]].
> 4. The product is a one-time digital product with no subscription or renewal.
> We ask that the dispute be resolved in our favor.

Casos especiales: "cargo no autorizado" con prueba de que un niño o un tercero compró: se reembolsa de inmediato, se borran los datos del niño y se cancelan las llamadas pendientes. "No recibí": se adjunta el registro de intentos; si falló nuestro lado, se reembolsa.

## 7. Qué hace falta de afuera antes del primer cobro real

| Pendiente | Responsable | Bloquea |
|---|---|---|
| Confirmación escrita de ElevenLabs (`solicitud-elevenlabs.md`) | Juan envía | Llamadas con menores |
| Variables del `00-leeme.md` (titular, domicilio, correos, dominio, marca) | Juan y `arquitecto` | Publicar cualquier texto |
| Aprobación de los tres cambios de retención (sección 5) | Juan | Textos 01, 02, 04 |
| Contador valida persona individual y Pequeño Contribuyente (D5) | Juan | Primer cobro real |
| Confirmación de proveedores: región, DPA, modo sin retención y sin entrenamiento | `arquitecto` | Política de privacidad |
| Pruebas T-01 a T-20 | `qa-redteam` | Lanzamiento |
| Aprobación escrita de `legal-compliance` en el PR de cada producto | `legal-compliance` | Todo |

## 8. Lista de afirmaciones no verificadas (resumen)

1. COPPA: que el cobro con tarjeta sea suficiente con un comerciante de registro y para voz (R1).
2. TCPA: que el consentimiento del comprador más la tecla 1 cubran a un tercero llamado (R3); franja de 8:00 a 21:00.
3. AI Act art. 50 y FTC: que informar al adulto baste cuando el niño es quien habla con la IA y no se le revela (R5, R24; decisión D13).
4. RGPD, UK GDPR, ley mexicana: bases jurídicas, edades de consentimiento digital, avisos, vías de reclamación (R6).
5. Leyes estatales de biometría y sus efectos para voz (R7).
6. Políticas de ElevenLabs, Twilio, Google y Meta: no se leyó el texto completo (R8 a R10).
7. Modos de cero retención y no entrenamiento de cada proveedor, y sus APIs de borrado (R2, R9; archivo 07 A-10).
8. Estado de registro de las marcas de la sección R11.
9. Reglas de servicios migratorios, publicidad de exámenes y educación previa a la licencia en Texas (R14).
10. Umbrales de contracargo de las redes de tarjeta; proceso de disputas de Polar (R15).
11. Plazo de 4 años y de 13 meses de retención (sección 5).
12. Ley aplicable de Guatemala para los términos; derechos de desistimiento en UE y UK para servicios con fecha fija.
13. Nombre legal y condiciones de comprador de Polar.
