# Brief urgente: hallazgos D27 que afectan a Jinglo (Santa)

De: director (chat de Colorear) · Para: `lider-proyecto` (santa), `legal-compliance`, `arquitecto` · Fecha: 19-oct-2026

La auditoría de políticas de proveedores (D27, `docs/proveedores/`, commit fd9957f) encontró bloqueos para Jinglo. Leer `docs/proveedores/README.md` y los archivos citados antes de seguir.

1. **ElevenLabs: PROHIBIDO hasta aprobación escrita.** Su política (9-oct-2026) prohíbe productos dirigidos a menores de 18 sin aprobación escrita de ElevenLabs. `docs/legal/solicitud-elevenlabs.md` no cita esa cláusula y afirma que no se entrena con los datos, lo cual solo es cierto con el opt-out de "Data use". Actualizar la solicitud antes de enviarla y activar el opt-out. Revisar también el LLM del agente (Gemini): sus términos de API excluyen apps dirigidas a menores [no verificado si aplica vía ElevenLabs]. Ver `docs/proveedores/elevenlabs.md`.
2. **Polar: PROHIBIDO** también para Jinglo ("Services ... intended for, or advertised towards minors", "Telecommunication"). No crear una organización aparte. Ver `docs/proveedores/polar.md`.
3. **Cobro permitido hoy:** Recurrente (con respuesta escrita del proveedor declarando producto y IA). PayPal queda en RIESGO ALTO para Jinglo. Lemon Squeezy y Dodo: riesgo alto / probable prohibido para llamadas. Ver `docs/proveedores/recurrente.md`, `paypal.md`.
4. **Twilio España: RIESGO ALTO.** Desde el 17-oct-2026 las llamadas comerciales salientes a España exigen número +34400 con identidad y dirección españolas. Bloquear ES en el selector; ojo: `TWILIO_FROM_ES` vacío cae en `TWILIO_FROM_NUMBER`. Ver `docs/proveedores/twilio.md`.
5. **Pixel de Meta:** el nombre del niño viaja como `?n=` en la landing y el checkout; el Pixel del navegador podría enviarlo completo (Business Tools Terms, menores de 13). No activar `META_PIXEL_ID` hasta verificar en red. Ver `docs/proveedores/meta-ads.md`.
6. **Vercel Hobby: PROHIBIDO** para uso comercial (afecta a ambos productos). Decisión de Juan: Pro $20/mes.

Regla D27 (CLAUDE.md): ningún proveedor se configura sin su `docs/proveedores/<proveedor>.md` aprobado.
