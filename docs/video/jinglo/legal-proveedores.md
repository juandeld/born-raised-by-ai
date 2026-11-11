# Jinglo videos · Qué proveedores se pueden usar (11-nov-2026)

Resumen de `legal-compliance` para el equipo `video-*`. Detalle y citas en `docs/proveedores/`. No es asesoría de abogado.

## El bloqueo real: la voz por pedido

ElevenLabs prohíbe experiencias dirigidas a menores de 18 sin su aprobación escrita. La voz de Santa con el nombre del niño cae ahí, igual que las llamadas de Jinglo. La solicitud nunca se envió desde octubre; la v2 (`docs/legal/solicitud-elevenlabs.md`) cubre llamadas y videos en un solo correo. **Hasta tener la aprobación, no se vende ni se entrega ningún video a un niño real.**

## Por capa

| Capa | Proveedor | Veredicto | Condición clave |
|---|---|---|---|
| Videos base (una vez) | Google Flow, plan de pago | Permitido con condiciones | Sin fotos ni personas reales; marca visible apagada; SynthID intacto |
| Videos base (una vez) | Gemini API / Vertex | Riesgo alto | No usar sin respuesta escrita de Google |
| Videos base | Kling, Runway | Prohibido (consumo) / riesgo alto (API Kling) | No usar |
| Voz por pedido | ElevenLabs | Prohibido hasta aprobación | Enviar solicitud v2; opt-out de entrenamiento antes |
| Labios por pedido | Sync Labs | Permitido con condiciones | Solo tramos con el nombre; pedir exclusión de entrenamiento y borrado |
| Música (fija) | Eleven Music | Prohibido hasta aprobación | Alternativa: composición humana o biblioteca con licencia comercial |
| Composición (nombre, carta, mapa) | FFmpeg propio | Sin proveedor | — |

## Qué se puede hacer ya

- Piloto interno de "La Lista de Niños Buenos" y la toma del video gratis: escenas en Google Flow; voz de prueba con nombres ficticios. Sin venta y sin datos de clientes.
- La primera prueba ciega, solo con papás. Con niños, después de la aprobación de ElevenLabs.
- Si ElevenLabs dice que no, las escenas de Flow siguen sirviendo: solo cambia el proveedor de voz (nueva revisión D27).
