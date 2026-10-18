# Born & Raised by AI

Portafolio de 8 productos digitales de pago único operados por 16 agentes de IA. Dinero a Guatemala sin LLC.

## Instalar
1. Clona esta carpeta como raíz del repo (o copia `.claude/agents/` y `CLAUDE.md` a tu repo existente).
2. Abre Claude Code en la raíz. Los agentes aparecen con `/agents`; `CLAUDE.md` se carga solo.
3. Primer comando sugerido:
   `Actúa como director-portafolio: lee docs/reglas-de-decision.md y docs/productos/, y prepara el plan de la semana del 19 de octubre con los briefs de arranque para santa y colorear.`

## Cómo invocar a un agente
- Por nombre en el prompt: "Usa el agente `legal-compliance` para revisar el checkout de santa".
- Los agentes por producto reciben el slug: "Como `lider-proyecto` de `dot`, escribe el plan por semanas".
- Bloqueantes: `legal-compliance` y `qa-redteam` deben aprobar en el PR antes de desplegar.

## Estructura
```
CLAUDE.md                  reglas del repo (se carga en cada sesión)
.claude/agents/*.md        16 agentes (frontmatter name/description/model + prompt)
docs/reglas-de-decision.md umbrales de probar / escalar / apagar y qué aprueba Juan
docs/productos/<slug>.md   ficha corta + enlace al capítulo del Manual
docs/investigacion/*.md    4 informes con ~300 fuentes (santa, b2c, micronichos, pagos)
docs/briefs/ docs/reportes/ docs/planes/ docs/legal/  los crean los agentes
docs/decisiones.md         registro de decisiones de Juan
```

## Orden de arranque (fase 1)
El plan es por hitos, no por semanas: ver [docs/planes/portafolio-hitos.md](docs/planes/portafolio-hitos.md).
Orden: santa → colorear → dot → seguros-tx → cancion (prueba de humo) → rex → ciudadania → memorias. Un producto nuevo entra a build solo cuando el anterior ya vende (una venta real, entregada sin humano). Presupuesto: hasta $500 por producto antes de su primera venta; luego reinversión por ROAS (ver reglas).

## Estado actual
Último reporte: [docs/reportes/2026-10-18-arranque.md](docs/reportes/2026-10-18-arranque.md). Planes: [santa](docs/planes/santa-hitos.md) · [colorear](docs/planes/colorear-hitos.md).

Manual Operativo completo: https://claude.ai/code/artifact/4f9fdb03-5f05-4e05-854b-da646dcbdf2a
