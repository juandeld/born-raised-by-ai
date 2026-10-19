# Expediente legal de Santa (borrador)

Estado: SUPERADO el 18-oct-2026 por los textos finales en `docs/legal/textos/` y por `docs/legal/riesgos-y-mitigaciones.md` (D6 actualizada: sin abogado). Se conserva como historial; no pegar de aquí. Nada de esto está validado por un abogado humano; todo texto y toda cifra marcados [no verificado] requieren confirmación. Fuentes: `docs/investigacion/santa.md` sección 5 y `docs/briefs/santa-H1-legal.md`. Todo cambio legal o de datos recogidos lo aprueba Juan.

## 1. Textos de consentimiento del checkout (adulto que paga)
Se muestran antes del pago, en el idioma del comprador. Casillas sin marcar por defecto.

**ES**
- [ ] Soy madre, padre o tutor legal del niño o niña que recibirá la llamada y autorizo que se use su primer nombre y los datos que escriba aquí solo para crear y realizar esta llamada.
- [ ] Entiendo que la voz que hablará es una inteligencia artificial, no una persona, y que la llamada se grabará para entregarla y atender reclamos.
- [ ] Autorizo expresamente que se llame al número que indiqué, en la fecha y hora elegidas, con una voz generada por IA.

**EN**
- [ ] I am the parent or legal guardian of the child who will receive the call, and I authorize the use of their first name and the details I enter here solely to create and place this call.
- [ ] I understand the voice on the call is artificial intelligence, not a person, and that the call is recorded for delivery and support.
- [ ] I expressly authorize a call to the number I provided, at the date and time I chose, using an AI-generated voice.

Aviso directo previo al pago (COPPA): "Recogemos el nombre del niño y su voz durante la llamada. Los usamos solo para esta llamada, no los vendemos ni entrenamos modelos con ellos y los borramos en 30 días o antes si lo pides." [el plazo de 30 días viene del brief H1; el encaje exacto con COPPA lo confirma el abogado]

Evidencia que se guarda: marca de tiempo, texto exacto mostrado, idioma, IP, identificador del cobro (el cobro con tarjeta es el mecanismo de consentimiento parental verificable propuesto en la investigación).

## 2. Política de privacidad base (esqueleto)
1. Quién somos y cómo contactarnos (completar con el titular de cobro, D5).
2. Datos que recogemos: del adulto (correo, país, número a llamar, método de pago vía Polar) y del niño (primer nombre y datos opcionales que el adulto escribe; la voz durante la llamada). Lista mínima, sin más campos sin aprobación de Juan.
3. Para qué: crear, realizar y entregar la llamada; soporte; reembolsos.
4. Lo que no hacemos: vender datos, publicidad dirigida al niño, entrenar modelos con su voz o nombre.
5. Proveedores que tocan datos: Polar, ElevenLabs, Twilio, Supabase, Resend, PostHog [lista a confirmar por `arquitecto`].
6. Retención y borrado: grabación y datos del niño se borran en ≤ 30 días; borrado anticipado a pedido por correo.
7. Derechos del adulto y del niño; contacto de privacidad.
8. Transferencia internacional de datos (UE/UK a servidores fuera) [pregunta para el abogado, sección 6].
9. Cambios a la política.

## 3. Preludio al adulto al inicio de la llamada
Se reproduce solo si contesta un adulto, antes de pasar al niño.
- ES: "Hola, esta es una llamada de [marca], pedida por el padre, madre o tutor de [nombre]. La voz que escuchará es una inteligencia artificial, no una persona, y la llamada se está grabando. Si es el adulto responsable, diga 'sí' o pulse 1 para continuar; si no, cuelgue y no se hará cargo alguno."
- EN: "Hello, this is a call from [brand], requested by the parent or guardian of [name]. The voice you will hear is artificial intelligence, not a person, and this call is being recorded. If you are the responsible adult, say 'yes' or press 1 to continue; otherwise hang up."
Cumple el aviso de IA del art. 50 del AI Act (aplicable a España desde 2-ago-2026, según la investigación). La llamada también debe identificarse como IA ante el niño de forma apropiada a su edad [redacción a validar].

## 4. Descargo de pases de examen
Texto para checkout y términos (aplica a productos tipo pase o examen; el único candidato hoy es dot/ciudadania, se incluye aquí por encargo):
- ES: "Este producto es un entrenamiento de práctica. No es una evaluación oficial, no está afiliado a ninguna autoridad y no garantiza aprobar ningún examen ni inspección."
- EN: "This product is practice training. It is not an official assessment, is not affiliated with any authority, and does not guarantee passing any exam or inspection."
[Confirmar con `legal-compliance` si debe vivir en este expediente o en el de cada producto.]

## 5. Marcas y nombres prohibidos
Elf on the Shelf, Portable North Pole, Rudolph y cualquier marca de terceros; la marca propia y el dominio no los incluyen.

## 6. Preguntas para el abogado (historial; ahora cubiertas en `riesgos-y-mitigaciones.md`)
1. COPPA: ¿basta el cobro con tarjeta como consentimiento parental verificable para una llamada con voz del niño como dato biométrico? ¿Qué debe decir la política de retención?
2. TCPA: ¿cómo aplica a una llamada que el comprador pide para un tercero (el niño o un familiar)? ¿Qué consentimiento escrito basta? ¿Qué hacer con los estados de consentimiento de todas las partes para la grabación?
3. España/UE: ¿qué exige el art. 50 del AI Act exactamente (momento, forma, idioma)? ¿Interacción con RGPD y datos de menores (edad de consentimiento digital en España)?
4. UK y México: ¿requisitos adicionales de datos de menores o llamadas automatizadas? [no cubiertos por la investigación]
5. ¿Puede el comprador adulto consentir por el niño en una llamada saliente a un número de otro adulto?
6. Términos y reembolsos: ¿obligaciones de desistimiento para producto digital entregado en fecha fija en la UE y UK?
7. Contrato con ElevenLabs: ¿alcanza la confirmación escrita del caso de uso (personaje de ficción, niños, consentimiento parental)? (la solicita Juan, H0)
8. Titular de cobro persona individual: ¿implicaciones de responsabilidad personal frente a reclamos de privacidad?

## 7. Pendientes
- Revisión y aprobación escrita de `legal-compliance`.
- Aprobación de Juan para cualquier cambio de texto legal o de datos recogidos.
- Cotización del abogado: ya no aplica (D6 actualizada).
