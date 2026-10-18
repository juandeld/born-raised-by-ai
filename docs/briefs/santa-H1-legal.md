# Brief: santa H1, paquete legal base

De: `lider-proyecto` (santa) · Para: `legal-compliance` · Hito: H1 (`docs/planes/santa-hitos.md`) · Fecha límite dura del producto: vendiendo antes del 20-nov

## Objetivo
Definir los requisitos legales y los textos base para vender una llamada de IA que habla con menores, comprada y consentida por un adulto, en ES, UK y MX (US condicionado).

## Contexto
`docs/investigacion/santa.md` sección 5 identifica cuatro frentes:
1. **COPPA** (cumplimiento obligatorio desde 22-abr-2026): voz como dato biométrico; consentimiento parental verificable vía cobro con tarjeta; política de retención escrita; borrado.
2. **TCPA** y grabación: voz de IA cuenta como artificial; consentimiento previo expreso por escrito; 12 estados exigen consentimiento de todas las partes.
3. **EU AI Act art. 50** (desde 2-ago-2026): avisar que se habla con IA; aplica en España.
4. **Políticas de proveedores y marca**: ElevenLabs (menores, engaño, transparencia), OpenAI/Anthropic si se usan; evitar marcas de terceros (Elf on the Shelf, Portable North Pole, Rudolph, etc.).

## Entradas
`docs/investigacion/santa.md` (secciones 5.1 a 5.7), `docs/productos/santa.md`, `docs/reglas-de-decision.md` (todo cambio legal o de datos recogidos lo aprueba Juan).

## Entregable esperado
`docs/legal/santa-base.md` con: (a) matriz requisito, fuente, control de producto, evidencia que se guarda; (b) textos propuestos: aviso directo COPPA previo al pago, casilla de consentimiento de padre/tutor y TCPA/grabación, preludio al adulto al inicio de la llamada, política de privacidad y de retención (borrado ≤ 30 días, sin entrenamiento de modelos), términos y política de reembolso; (c) lista de datos mínimos que se pueden pedir al cliente; (d) preguntas que requieren abogado humano (España/UE) y consentimiento escrito de ElevenLabs; (e) lista de nombres y marcas prohibidos.

## Criterio de calidad
- Cada requisito enlaza a su fuente; lo no verificado se marca.
- Los textos se pueden pegar tal cual en checkout y llamada, en ES y EN.
- Ninguna cifra legal sin fuente de la investigación.
- Cambios de datos recogidos o texto legal se envían al director para pedir aprobación de Juan.

## Bloqueos
Confirmación escrita de ElevenLabs sobre el caso de uso (H0, Juan). Validación con abogado para España/UE queda como decisión de Juan si `legal-compliance` la considera indispensable.
