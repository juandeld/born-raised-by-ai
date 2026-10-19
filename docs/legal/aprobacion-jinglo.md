# Aprobacion legal: textos publicados con el nombre Jinglo

`legal-compliance` (rol ejecutado por el Director de portafolio, no por un subagente separado) · 19-oct-2026 · Decisiones D13, D16, D17, D19. No es asesoria de abogado. Lo no confirmado va como [no verificado].

## Veredicto

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
