# Brief: aplicar D23 (sin nombres de proveedores ni modelos) a Santa / Jinglo

De: director (chat de Colorear) · Para: `legal-compliance` y `lider-proyecto` (santa) · Fecha: 19-oct-2026 · Aprobado por Juan el 19-oct-2026

## Objetivo
Que nada de lo que ve el cliente de Santa/Jinglo nombre a un proveedor o modelo de IA ni de infraestructura, igual que ya se hizo en Colorear (commit e715e58).

## Regla (D23, textual de Juan)
"Es importantísimo que no menciones OpenAI, Claude, ChatGPT o cualquier otro modelo. Cualquiera podría hacerlo, así que no queremos enseñarles cómo hacerlo. Véndelo como algo mucho más complicado de hacer de lo que realmente es." Y antes: "no menciones otras apps".

## Alcance
- Textos legales: `docs/legal/textos/*`, el generador `legal-docs` y `packages/legal/src/*` de Santa (tabla de "Proveedores": ElevenLabs, Twilio, Anthropic, Google/Gemini, Resend, Supabase, Vercel...). Pasar a categorías de destinatarios (RGPD art. 13.1.e) + "lista de subencargados disponible a solicitud", + aviso de transferencias internacionales con garantías (art. 13.1.f).
- Landing Jinglo, checkout, correos, SMS, preludio telefónico y frases del agente: ninguna marca ni receta ("voz de ElevenLabs", "llamada vía Twilio", etc.).
- Revelación de IA al adulto (D13, AI Act art. 50, FTC): se mantiene, genérica ("llamada automatizada con voz creada por inteligencia artificial de Lumen Labs" ya cumple).
- Excepción: Polar puede aparecer como vendedor en el checkout (D9).

## Referencia
Copiar el enfoque de `packages/legal/src/colorear.ts` (v3) y la prueba `tests/colorear-no-vendors.test.ts` (crear la equivalente para Santa).

## Criterio de terminado
Prueba automática que falla si un texto visible de Santa nombra un proveedor; aprobación escrita de `legal-compliance`; fila en `docs/decisiones.md` remitiendo a D23.
