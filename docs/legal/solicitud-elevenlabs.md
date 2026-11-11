# Solicitud a ElevenLabs: confirmación escrita del caso de uso

Estado: **v2, listo para enviar (11-nov-2026)**. Cambios frente a la v1 del 18-oct, pedidos en `docs/proveedores/elevenlabs.md`: cita literal de la sección 1 de la Prohibited Use Policy y petición expresa de aprobación escrita (no solo "confirmación"); corrección de la frase sobre entrenamiento (solo es cierta con el opt-out de "Data use"); pregunta por el modelo de lenguaje del agente; transparencia de IA (sección 10) frente a D13; y un segundo producto, los videos personalizados de Santa. Con una sola respuesta se desbloquean llamadas y videos. · v1: 18-oct-2026 · Autor: `legal-compliance` · Origen: `docs/investigacion/santa.md` 5.5 (la Prohibited Use Policy tiene secciones de protección de menores, engaño e impersonación y transparencia de IA; no se pudo leer completa) y brief H0.

## Instrucciones para Juan (no son parte del correo)

1. Envíelo desde el correo con el que creó la cuenta de ElevenLabs, para que lo asocien a su cuenta. Si tiene un gestor de cuenta o un plan Enterprise, envíelo a esa persona con copia a soporte. La dirección de soporte o de confianza y seguridad debe confirmarse en elevenlabs.io (contacto) antes de enviar `[no verificado: dirección vigente]`.
2. Complete los campos entre corchetes: correo de su cuenta y fecha de respuesta (se sugiere 5 días hábiles; la temporada ya empezó).
2b. **Antes de enviarlo**, active el opt-out de entrenamiento en ElevenLabs (Terms and Privacy › Data use) y guarde una captura con fecha en `docs/legal/evidencia/`. El correo afirma que ya está activo.
3. No adjunte datos personales de clientes (no los hay todavía). Puede adjuntar los archivos `docs/legal/textos/03-preludio-llamada-adulto.md` y `docs/legal/textos/07-guardrails-agente-voz.md` exportados a PDF si ElevenLabs los pide.
4. Cuando responda: guarde la respuesta completa (con fecha y remitente) en `docs/legal/evidencia/elevenlabs-respuesta.md` y avise a `legal-compliance`. Una respuesta del tipo "parece aceptable" sin firma de una persona de ElevenLabs o sin referencia a la política sigue contando como evidencia, pero no como aprobación; pida la ampliación.
5. Si no responden en el plazo, reenvíe una vez. Si tampoco hay respuesta, Juan decide si lanzar sin la confirmación (riesgo R8 en `riesgos-y-mitigaciones.md`). El agente no lanza solo.
6. Un "sí" de ElevenLabs no reemplaza ningún otro consentimiento (COPPA, TCPA, grabación): solo cubre su política de uso.

---

## Correo (inglés)

**To:** [ElevenLabs support / Trust & Safety / account manager]
**From:** [your ElevenLabs account email]
**Subject:** Request for written approval under your Protection of Minors policy: parent-ordered Santa calls and personalized videos

Hello,

My name is Juan Lima. I am preparing to launch Jinglo, a product of Lumen Labs (Guatemala): one-time-purchase digital experiences in which a folklore character, Santa Claus, speaks to a child. The parent or legal guardian orders and pays; the child never has an account or uses our service directly.

Section 1 of your Prohibited Use Policy states: "Apps, products, or experiences directed at individuals under 18 are prohibited unless we have assessed and approved them in writing." Our products are experiences for children, so before we sell anything we are asking for **your written approval** under that section, or for the conditions you would require. We have not sold or delivered anything to any customer yet.

We would use ElevenLabs for two products:

**Product 1: parent-ordered phone calls (Agents Platform)**
Parents or legal guardians buy a short phone call (about 2 to 3 minutes) from a fictional folklore character, such as Santa Claus, one of the Three Kings, the Tooth Fairy or an original dinosaur character, for their child. The call is scheduled by the parent for a date and time they choose. It is a one-time purchase: no subscription, no account for the child, no app.

**How consent and disclosure work**
1. Before paying, the parent sees a direct notice and ticks explicit boxes: they are the parent or guardian; they authorize the use of the child's first name and the details they enter solely for this call; they understand the voice is artificial intelligence and that the call is recorded; and they expressly authorize an automated call with an AI-generated voice. The card charge serves as verifiable parental consent, and we store the exact text, time and IP address of the consent.
2. The call opens with a fixed, non-generated notice to whoever answers: this is an AI voice, not a person; the call is requested by the child's parent or guardian; if the adult continues, the call will be recorded. The adult presses 1 to continue or 2 to cancel permanently. Nothing is recorded or transcribed before that key press. Voicemail gets no message.
3. Only after a second key press ("the child is ready") does the character speak. With the child, the character stays in character: Santa introduces himself as Santa calling from the North Pole, and if the child asks whether he is real or a robot he answers in character with fixed phrases (for example "Of course I am! I'm Santa, calling you all the way from the North Pole"). The character does not tell the child that it is an AI and does not say it is a human or a person; it neither confirms nor denies who brings the gifts. The disclosure that the voice is AI is made in full to the responsible adult, in three places: the checkout checkbox (which also states that the character will not tell the child), the confirmation and reminder emails, and the spoken notice before the first key press. The parent decides whether to tell the child. If an adult on the line asks whether it is an AI, the agent always says so and never denies it.

**What the agent does and does not do**
- Fixed topic list (greeting, the child's name and the optional details the parent entered, the holiday or birthday, good habits). It never asks for personal data, sells, mentions brands or prices, makes promises, scares the child or asks for secrets.
- Forced call closure on safety cues (distress, abuse or self-harm language, requests for contact), personal data offered by the child, content the agent should not discuss, silence, or an adult asking to stop. A neutral note is sent to the parent when a safety cue occurs.
- Hard time limit per call, a maximum of two attempts within the window the parent chose, and permanent opt-out on request.
- The characters are folklore or original. We do not imitate real people or actors and we do not clone any voice, including the child's or the adult's. We plan to use [a voice from your library / a designed voice] and would like to confirm it is licensed for this use.

**Product 2: personalized pre-rendered videos (Text to Speech)**
Parents buy a short video (45 to 75 seconds) in which an original, AI-generated Santa Claus says the child's first name and a few details the parent enters (for example a hobby or an achievement this year). The video scenes are produced once, without any real person. For each order we would generate only Santa's lines with the child's first name using your Text to Speech API and the same designed (not cloned) Santa voice, and then synchronize Santa's lips with another provider. No child's voice, photo or likeness is ever sent to you. The disclosure that the video is AI-generated is made to the parent before payment and in the delivery email; inside the video, Santa stays in character, as in the calls. We would also like to know whether Eleven Music may be used for the background music of these videos.

**Data**
For both products we send you only the child's first name and optional details that we sanitize beforehand; for calls, also the call audio. We do not sell the data or use it for advertising. We have turned on the opt-out of training in "Data use" in our account; please confirm whether it covers Agents conversations and Text to Speech requests. We delete call recordings and transcripts 30 days after delivery (parents can download the recording and ask for earlier deletion). Calls flow through ElevenLabs Agents and Twilio. The agent uses the language model selected in Agents (currently Gemini 2.5 Flash). Markets: Central America and Mexico first; Spain, the United Kingdom and the United States later (US calls only with the parent's prior express written consent captured at checkout).

**Our questions**
1. Do you approve in writing, under Section 1 (Protection of Minors) of your Prohibited Use Policy, Product 1 (calls) and Product 2 (videos) as described? If not, what conditions would you require?
1b. Section 10 asks us to disclose AI interaction "where failing to do so would materially mislead". Is it acceptable that the disclosure is made in full to the parent who orders, consents and can listen or watch first, while the folklore character stays in character with the child? If not, what would you require?
1c. Which language models available in Agents are approved for products for children, and is Gemini 2.5 Flash one of them?
2. Do you require prior approval, an enterprise agreement, or additional safeguards for it? If so, which ones?
3. Can you confirm in writing how data from these calls is handled: whether a zero-retention or minimal-retention mode is available for Agents, whether conversation data is excluded from model training, how we can delete conversations by API, and which data region applies?
4. Can you share your data processing agreement and subprocessor list, and tell us whether you support our obligations under COPPA and GDPR for a service that records children's voices with parental consent?
5. Are there restrictions on outbound calling through Agents and Twilio in Spain, the United Kingdom, Mexico or the United States that we should know about?
6. Which voices are cleared for commercial use as a children's character, and are there any restrictions on voices resembling a well-known holiday figure?
7. Do you foresee any concurrency or plan limits for a seasonal peak between December 20 and 24? We will send a forecast if useful.
8. For Product 2: may Text to Speech output with the child's first name be delivered to the parent as part of a paid video, and may Eleven Music be used for the video's background music under our plan?

If it is easier, I can book a short call. A written reply to this email that references the policy sections above would be ideal, since we will keep it as part of our compliance record. Could you reply by [DATE]? We hope to start selling in the second half of November, so a reply within a few business days would help us a lot.

Thank you for your help.

Best regards,
Juan Lima
Lumen Labs · [website, if live] · [phone, optional]

---

## Anexo para uso interno: respuestas posibles y qué hace `legal-compliance`

| Respuesta de ElevenLabs | Acción |
|---|---|
| Confirma por escrito que el uso es permitido | Guardar en `docs/legal/evidencia/`, marcar R8 como mitigado, avisar a `arquitecto` |
| Permitido con condiciones (aprobación previa, plan Enterprise, cambios en el flujo) | Evaluar costo y cambios; si implica un plan de más de $100/mes, lo escala el director a Juan; actualizar el archivo 07 |
| Pide más información | Responder con los textos 03 y 07 en inglés; `legal-compliance` prepara la traducción |
| No permitido | Disparador 1 de `riesgos-y-mitigaciones.md`: congelar llamadas, `arquitecto` evalúa otro proveedor de voz, Juan decide |
| Sin respuesta | Reenviar una vez; luego Juan decide si lanzar sin confirmación |
