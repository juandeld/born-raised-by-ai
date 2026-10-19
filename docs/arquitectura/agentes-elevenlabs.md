# Agentes de ElevenLabs: qué controla el repositorio y qué no

`syncAgent` (engines/calls/src/providers/voice-elevenlabs.ts) escribe solo: prompt, primer mensaje, idioma, LLM, `max_tokens`, temperatura, herramientas (`mark_optout`, `flag_incident` como herramientas del workspace y `end_call` integrada), LLM de respaldo, `silence_end_call_timeout` y duración máxima. La voz y el TTS se envían una sola vez, al crear. Nunca toca privacidad ni guardrails.

## Lo que NO controla el repositorio (se ajusta a mano o por MCP)
| Ajuste | Estado del agente en vivo (19-oct) | Propuesta |
|---|---|---|
| Privacidad (`record_voice`, retención) | `record_voice` true | Mantener: la grabación es parte del producto. Fijar retención con `legal-compliance` |
| Guardrails de contenido | todos desactivados | Activar tras la batería de QA y medir falsos positivos en una llamada de prueba |
| Webhook post-llamada | no se usa (el estado lo da Twilio) | Sin cambio |
| Voz | LykVXmiL9G4zV1CJHN2o (D12) | No reenviar nunca |

## Hallazgo del 19-oct sobre el modelo (importante)
En las dos llamadas reales de la noche del 18-oct, `claude-haiku-5-5` consumió 120 tokens por turno (el tope de `max_tokens`) y ninguna respuesta suya llegó al niño: contestó el respaldo por defecto (`gemini-2.5-flash`, y en un turno `gpt-4o`). Con ese mismo tope de 120 tokens Gemini corta frases a la mitad ("Dime, ¿cu", "Ha sido"). En el simulador de ElevenLabs ningún modelo Claude (haiku-5-5, sonnet-5-5, haiku-4-5) genera respuesta con este agente ("all LLM attempts were exhausted"), mientras Gemini responde bien. Causa de fondo no determinada. Detalle y propuesta en `docs/reportes/2026-10-19-director.md`.
