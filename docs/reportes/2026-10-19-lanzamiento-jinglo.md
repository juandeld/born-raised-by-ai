# Lanzamiento Jinglo: que esta listo, que falta, que aprobar

Director de portafolio · 19-oct-2026 · Decision de Juan 15:25: terminar todo antes de gastar. Gasto nuevo de este encargo: 0 (solo la muestra de audio, unos $0.09 de creditos ya pagados). No hubo subagentes: hice cada rol en serie.

## Listo (sin costo)

- 3 direcciones visuales de la landing en es / es-es / en: `docs/diseno/jinglo/direccion-{a,b,c}.html` (no aplicadas al sitio; no vistas en navegador).
- Muestra de audio de 21 s: `apps/web/public/audio/jinglo-santa-es.mp3`.
- Agentes es-ES, en-US, en-GB en codigo y prompts v4 por locale; D17 corregida; tests, tsc y build en verde. Agente vivo intacto.
- QA de 21 escenarios por analisis de texto (no corrida contra el modelo): `docs/qa/santa-redteam-v4.md`.
- Revision legal: `docs/legal/aprobacion-jinglo.md`. Plan de marketing: `docs/marketing/jinglo-lanzamiento.md`. Voces y Polar: `docs/arquitectura/agentes-locales-y-polar.md`.

## Falta

- Legal: **NO aprobado** (6 bloqueos: busquedas de marca, "Lumen Labs" vs "Jinglo" en preludio/correos/certificado, `LEGAL_*`, silencio 5/10/15, D-10, C6/Resend/Polar).
- Aplicar el texto final del preludio corto (D20, lo revisa otro agente) y unificar el emisor.
- Elegir la direccion visual (Juan) y aplicarla.
- Repetir la bateria de QA contra el agente real y aplicar al vivo: D17, prompt v4, duracion 300 s (hoy 600).
- Sin voz propia para es-ES / en-US / en-GB hasta disenarla; no activar esos paises antes.

## Gastos que Juan deberia aprobar, por prioridad

| # | Concepto | Monto | Por que |
|---|---|---|---|
| 1 | Dominios `jinglo.app`, `jinglo.co`, `getjinglo.com` | ~$40-60 en total [EST, no verificado] | Sin dominio no hay landing, Pixel ni correo; costo minimo, reversible (D19) |
| 2 | KYC y cuenta de Polar | $0 (tramite) | Sin cobro no hay ventas; plazo de aprobacion desconocido, empezar ya |
| 3 | Verificar dominio en Resend (`lumen-labs.co` o el nuevo) | $0 (DNS) | El recibo con el aviso de IA no sale sin el; en curso |
| 4 | Creditos de ElevenLabs: disenar 3 voces y repetir la bateria de QA | menos de $10 [EST, no verificado] | Activar ES, US y GB y cerrar el bloqueo de QA |
| 5 | Anuncios de lanzamiento (D1) | $500: MX 150, ES 200, UK 90, US 60 | Solo despues de que legal apruebe la marca y exista venta posible; por tramos |
| 6 | Marca IMPI, clase 41 | MXN 2,994.62 + IVA (~$165 [EST]) | Proteger Jinglo en Mexico, primer mercado |
| 7 | Abogado de EE. UU. + USPTO clase 41 | USD 350 de tasa + honorarios [no verificado]; excepcion a D6 | Solo si hay ventas o interes en EE. UU. |
| 8 | Numeros Twilio por pais | por confirmar [no verificado] | Llamadas con identificacion local en ES, GB y US |
| 9 | Plan de ElevenLabs > $100/mes (diciembre) | lo define el volumen | Capacidad de la concentracion del 11 al 22-dic; requiere su aprobacion (D-regla) |

## Lo que Juan hace sin gasto, hoy

Busquedas oficiales de JINGLO (30 min: USPTO, TMview, IMPI, WIPO), elegir direccion visual, dar `LEGAL_HOLDER`, domicilio y fecha de vigencia.
