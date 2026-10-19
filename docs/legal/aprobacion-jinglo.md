# Aprobacion legal: textos publicados con el nombre Jinglo

## Aprobacion del 19-oct-2026 (tarde): landing Jinglo v2 y emisor unificado

`legal-compliance` (rol ejecutado por el Director de portafolio, sin subagente separado) · 19-oct-2026 · versiones `legal-v1.3` · D13, D19, D20. No es asesoria de abogado; lo no confirmado va como [no verificado].

**Veredicto: APROBADO PARA PUBLICAR la landing v2 en /es, /es-es y /en como prelanzamiento.** Sigue **NO aprobado para cobrar** hasta cerrar las condiciones de la ultima seccion de este bloque (marca, Polar/Resend, voces locales). Los textos se revisaron en `apps/web/src/lib/landing-copy.ts` (fuente unica de la landing) y se corrigieron donde no pasaban.

### Textos nuevos de la landing

| Texto | Resultado | Cambio hecho |
|---|---|---|
| Hero (titular, llamada entrante, "Es Santa, y pregunta por tu peque") | Aprobado. Es una escena de fantasia dirigida al adulto; la revelacion de IA llega antes de pagar (D13). | Se agrego a la linea fina bajo el boton: "La voz de Santa es generada con inteligencia artificial." La revelacion ya no depende de bajar la pagina. |
| Garantia | Corregido. "Si no sale como lo prometemos, no pagas" prometia mas que el reembolso real (no contestan, o 7 dias). | Ahora: "te devolvemos tu dinero". Los tres puntos (nadie contesta, 7 dias, tecla 2) coinciden con terminos 05 y el preludio D20. |
| Cuenta regresiva y fecha limite | Aprobado. Es real (instante calculado con la zona del pais; no se reinicia) y la fecha es la del plan: ultimo pedido 22-dic, llamadas hasta el 24-dic. No hay cifras de escasez inventadas. | "Cupo limitado" se mantiene: el sistema limita llamadas simultaneas (`CALLS_MAX_CONCURRENCY`). Prohibido agregar "quedan N cupos" sin endpoint real. |
| FAQ "¿Quien habla? ¿Es una persona?" | Aprobado. "No es una persona: es una voz generada con inteligencia artificial" y dice cuando se informa (antes de pagar, correo, aviso hablado). Coincide con D13. | Ninguno. |
| FAQ "timido o no contesta" | Corregido. Decia "unos 30 segundos de silencio"; D16 fija 5/10/15 s. | "Si el silencio sigue unos segundos, Santa se despide con carino." |
| FAQ seguridad y privacidad | Aprobado: ventana 8:00-21:00, adulto pulsa 1, ~5 min, 30 dias, no se vende ni entrena IA. Coincide con config (`SANTA`) y politica 04. | Ninguno. |
| Nota de IA bajo el audio | Aprobado y reforzado. | "Muestra en espanol con voz de Santa generada con inteligencia artificial (no es una persona)." |
| Nota antes de pagar | Aprobado: "Antes de pagar veras, con todas sus letras, que la voz de Santa la genera una inteligencia artificial" es cierto (casilla C3 y aviso del checkout). | Ninguno. |
| Pie | Aprobado con emisor unificado. | "Jinglo, un producto de Lumen Labs." + "Las voces de las llamadas estan generadas con inteligencia artificial." + enlaces a privacidad y terminos. |
| Resenas | Bloque oculto (`hidden`), sin cifras ni testimonios. Debe seguir asi hasta tener resenas reales y autorizadas. | Ninguno. |
| Imagenes | Ilustraciones de papel; el nino ilustrado no es un menor real; sin marcas ni Santa reconocible de un tercero. | Ninguno. |

Notas de uso del nombre: el nombre que escribe el adulto en la landing solo viaja en la URL de compra (`?n=`) para rellenar el formulario; no se envia a analitica (`name_personalized` no lleva el nombre) y el formulario sigue pidiendo C1 antes de usarlo. Es el nombre de pila que el adulto ya declara en el checkout.

### Emisor unificado: "Jinglo, un producto de Lumen Labs"

| Punto | Estado |
|---|---|
| Casilla C3 (es-419, es-ES, en): "inteligencia artificial de Jinglo, un producto de Lumen Labs" | Hecho. Id `02-C3-*-legal-v1.3`. |
| Casilla C4: "{{MARCA}}, un producto de Lumen Labs, llame..." | Hecho. Id `02-C4-*-legal-v1.3`. |
| Aviso COPPA del checkout (C1-C6, `01`): "Jinglo, un producto de Lumen Labs, la opera {{TITULAR}}" | Hecho (es-419, es-ES, en). |
| Correo de recibo y de recordatorio (`emails.ts`, es y en) | Hecho. El asunto y la firma usan la marca "Jinglo" (`BRAND_NAME` por defecto ahora "Jinglo"; no estaba fijada en el entorno de produccion). |
| Certificado (`certificate.ts`) | Hecho en las tres lenguas. |
| D-03b y D-10 (agente de voz) | Hecho en prompts v4 y `phrases.ts`. La v3 en vivo no se toco (el agente vivo sigue con "Lumen Labs" hasta sincronizar v4). |
| Terminos 05 y privacidad 04, seccion 1 | Hecho; el sitio los regenera con `npm run legal:docs`. |
| Pie del sitio y encabezado de todas las paginas Santa | "Jinglo, un producto de Lumen Labs." |
| Preludio telefonico (D20, audios pregrabados) | **Excepcion documentada.** Dice solo "Jinglo": cambiarlo exige regrabar los clips con creditos de ElevenLabs, fuera de la regla de gasto de hoy. La forma completa consta por escrito en C3, C4, aviso y correos, y la dicen D-03b y D-10 cuando un adulto pregunta. Riesgo bajo; regrabar cuando haya presupuesto. |

### Condiciones pendientes antes de cobrar (no las cierra este documento)

1. Busquedas oficiales de JINGLO (USPTO, TMview, IMPI, WIPO): sin hacer (Juan). D19 las exige antes de gastar en anuncios.
2. `LEGAL_HOLDER`, `LEGAL_ADDRESS`, `LEGAL_EFFECTIVE_DATE` con valores reales revisados; Polar con KYC; Resend con dominio verificado.
3. GB: la landing /en dice "Father Christmas"; `COUNTRIES.GB.preludeLocale` sigue en `en-US` y no hay agente en-GB. No vender GB hasta pasar a `en-GB` con su agente (el nombre del personaje debe ser igual en landing, checkout, primera frase y E-01). Lo mismo para ES (voz es-ES) y US.
4. Los textos 03 y 07 siguen con silencio 8/16/36 s en el documento (el codigo ya usa D16/D17).
5. C6 sigue en borrador.

---

`legal-compliance` (rol ejecutado por el Director de portafolio, no por un subagente separado) · 19-oct-2026 · Decisiones D13, D16, D17, D19. No es asesoria de abogado. Lo no confirmado va como [no verificado].

## Revision anterior (mismo dia, antes de la landing v2)

### Veredicto

**NO APROBADO para publicar ni para cobrar.** Los textos son sustancialmente correctos, pero hay seis bloqueos concretos. Ninguno cuesta dinero salvo el 1 y el 3, que dependen de Juan.

## Bloqueos

| # | Bloqueo | Por que bloquea | Quien lo cierra |
|---|---|---|---|
| 1 | Busquedas oficiales de JINGLO sin hacer (USPTO, TMview, IMPI, WIPO). Solo hay Justia/Trademarkia (`marca-jinglo.md`). | D19: no se gasta en anuncios con la marca sin ese veredicto. Si aparece un titular en clase 41 hay que cambiar de nombre antes de imprimir creativos. | Juan, 30 min con navegador; luego legal |
| 2 | Emisor inconsistente: `{{MARCA}}`, el preludio al adulto, D-03b, D-10, el correo de recibo, el correo previo a la llamada y el certificado dicen "Lumen Labs"; la landing dice "Jinglo". | El adulto oye un nombre, ve otro y paga a un tercero (Polar). Debe leerse "Jinglo, un servicio de Lumen Labs" en todos, o decidir uno solo. | arquitecto (cadenas) + legal (aprobar texto) |
| 3 | Faltan `LEGAL_HOLDER`, `LEGAL_ADDRESS`, `LEGAL_EFFECTIVE_DATE`. | `legalReady()` cierra el checkout en produccion; ademas privacidad y terminos necesitan titular y domicilio reales. | Juan |
| 4 | Textos 03 y 07 siguen con silencio a 8/16/36 s; D16 fija 5/10/15 s y D17 exige que D-02 se diga completa antes de `end_call`. | El texto aprobado no describe el comportamiento real. | legal aprueba la redaccion; ver cambios abajo |
| 5 | D-10 ("Si, la llamada se graba...") es frase nueva sin aprobacion escrita. | Frase fija: no se improvisa. | legal |
| 6 | C6 sigue en borrador; Resend sin dominio verificado; Polar sin KYC. | El correo de recibo (que repite lo autorizado) no sale, y sin Polar no hay cobro. | Juan / en curso |

## Lo que si esta bien (revisado)

- Aviso al adulto antes de grabar, con IA y grabacion, y tecla 2 para cancelar.
- D13: Santa no revela ser IA al nino; la revelacion va al adulto en checkout, correo y preludio. Aceptable porque es un juego de fantasia dirigido por el padre y el padre esta informado de forma previa y expresa.
- Retencion de 30 dias y borrado en 7 desde la solicitud; no se vende ni se entrena con los datos.
- Reembolso a 7 dias y reembolso automatico si no se llama en la ventana elegida.
- Landing de las 3 direcciones: etiqueta visible "Voz de Santa generada con IA", sin menores reales, sin marcas de terceros, sombrero SVG generico.

## Cambios de texto exactos que faltan

1. `{{MARCA}}` = "Jinglo" y, en cada primera mencion legal, "Jinglo, un servicio de Lumen Labs". Aplicar en preludio (03), D-03b, D-10, `emails.ts` (recibo y aviso previo, es y en) y `certificate.ts` (linea `ai`). Nota: el preludio corto (D20) lo esta revisando otro agente; este bloqueo se cierra con su texto final, no con el actual.
2. 03 y 07: cambiar 8/16/36 s por 5/10/15 s y anadir que en el tercer silencio se dice D-02 completa y luego `end_call`.
3. Aprobar por escrito D-10 en es-419, es-ES, en-US y en-GB (ya existen en los prompts v4 generados).
4. Variables `LEGAL_*` rellenas; revisar terminos 05 y privacidad 04 con titular y domicilio reales.
5. Terminos 05: aclarar que el comerciante de registro es Polar y que el reembolso lo emite Polar.
6. Confirmar con abogado, cuando haya presupuesto, la base legal de grabar a un menor con consentimiento del adulto en cada pais (US: COPPA y consentimiento de grabacion por estado; UK/ES: RGPD y consentimiento parental) [no verificado].

## Condicion de reapertura

Cuando 1, 2, 3 y 4 esten cerrados, legal emite aprobacion por escrito en el PR. Hasta entonces el sitio puede mostrarse como prelanzamiento sin cobro.
