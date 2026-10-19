# Jinglo: creativos de los experimentos E1, E2 y E3 (19-oct-2026)

`productor-creativo` + `marketing-growth` · Estrategia, audiencias y reglas de decisión: `docs/marketing/experimentos-fase1.md` · Costo: 2 ilustraciones (`gpt-image-1-mini`, ≈ $0.03); el resto con Chromium sobre las ilustraciones de `apps/web/public/jinglo/`. Toda pieza lleva "Voz de Santa generada con inteligencia artificial" en letra pequeña; ningún gancho la menciona. Ningún anuncio sale antes de las búsquedas oficiales de marca (D19).

## Piezas (1080 px de ancho; las fuentes de las ilustraciones nuevas: `apps/web/public/jinglo/exp/lejos.webp`, `e2/ilustracion-abuela.webp`)

| Experimento | Archivo | Formato | Gancho (titular) | Parámetro `cr` |
|---|---|---|---|---|
| E1 | `e1/e1-cara-4x5.webp` | 4:5 | Su cara cuando Santa pregunte por su nombre. | `cara-a` |
| E1 | `e1/e1-telefono-9x16.webp` | 9:16 | Suena el teléfono. Es del Polo Norte. Tú solo tienes que estar ahí. | `telefono-b` |
| E2 | `e2/e2-lejos-4x5.webp` | 4:5 | Lejos de casa, pero en su Navidad. | `lejos-a` |
| E2 | `e2/e2-abuela-9x16.webp` | 9:16 | La llamada es de Santa. La grabación, tuya. | `abuela-b` |
| E3 | `e3/e3-voz-4x5.webp` | 4:5 | Guarda su voz de hoy. | `voz-a` |
| E3 | `e3/e3-diez-anos-9x16.webp` | 9:16 | Dentro de diez años vas a querer volver a escucharla. | `diezanos-b` |
| E3 (solo con paquete a la venta) | `e3/e3-paquete-4x5.webp` | 4:5 | Dos llamadas. Dos recuerdos. | `paquete-c` |

Enlaces de destino (producción; dominio de ejemplo hasta que apunte el de la marca): `/es?exp=e1&cr=cara-a`, `/es?exp=e1&cr=telefono-b`, `/es?exp=e2&cr=lejos-a`, `/es?exp=e2&cr=abuela-b`, `/es?exp=e3&cr=voz-a`, `/es?exp=e3&cr=diezanos-b`, `/es?exp=e3&cr=paquete-c`. En los eventos el id queda `e1.cara-a`, etc. (`experimentOf()` en `packages/analytics`).

## Textos de Meta (es-MX)

| Exp. | Texto principal (primera línea = gancho) | Título | Descripción |
|---|---|---|---|
| E1 | "Su cara cuando Santa pregunte por su nombre. Santa llama a tu peque por su nombre, el día y la hora que tú elijas; tú solo tienes que estar ahí. Pago único, sin suscripción. Voz de Santa generada con IA." | Una llamada del Polo Norte · MX$199 | Reserva la llamada |
| E2 | "Lejos de casa, pero en su Navidad. Santa llama a tu casa por el nombre de tu peque y la grabación te llega a ti. Reservas desde donde estés. Pago único. Voz de Santa generada con IA." | La grabación te llega a ti · MX$199 | Reserva la llamada |
| E3 | "Guarda su voz de hoy. Una llamada de Santa con su grabación y su certificado, para volver a escucharla dentro de diez años. Descárgala en los 30 días siguientes. Voz de Santa generada con IA." | Guarda el recuerdo · MX$199 | Guardar el recuerdo |

Variantes de gancho (primera línea) para rotar si un anuncio se apaga: ver tabla de ganchos en `docs/marketing/experimentos-fase1.md`, sección 2.

## Guiones de video de 15 s (9:16, es-MX). Aún no producidos; ningún menor real, sin voz de niño

### V-E1 "Su cara" (solo audio de la muestra real de Santa y escena ilustrada)
- 0-1 s: teléfono rojo vibrando en la mesita, nieve en la ventana. Texto: "Suena el Polo Norte."
- 1-5 s: mano adulta (de espaldas, sin cara de menor) levanta el teléfono y lo baja hacia fuera de cuadro. Texto: "Tú solo tienes que estar ahí."
- 5-11 s: la muestra real (`apps/web/public/audio/jinglo-santa-es.mp3`, "Hola…") con subtítulos en papel recortado; corte a la ilustración del niño contestando (`familia.webp`).
- 11-15 s: logo Jinglo + "Su cara cuando Santa pregunte por su nombre · MX$199". Rótulo: "Voz de Santa generada con IA. Pago único."

### V-E2 "Lejos, pero ahí" (reacción, estilo casero, actor adulto)
- Rótulo fijo toda la pieza: "Escena actuada". Es una dramatización, no una clienta real.
- 0-2 s: plano selfie, actor adulto en un cuarto de hotel o cabina de camión, mirando el celular; texto: "Diciembre. Lejos de casa."
- 2-6 s: toma del celular: pantalla de WhatsApp con "En casa ya contestaron" y un audio (solo la muestra de Santa, sin voz de niño). Texto: "Santa llama a casa. Tú reservas desde donde estés."
- 6-12 s: el actor escucha, se lleva la mano a la boca y sonríe (sin diálogo). Texto: "La grabación te llega a ti."
- 12-15 s: logo + "Reserva la llamada · MX$199". Rótulo: "Escena actuada. Voz de Santa generada con IA."

### V-E3 "Diez años" (premium minimalista, sin personas)
- 0-2 s: fondo crema, el titular aparece letra a letra: "Dentro de diez años…"
- 2-8 s: se completa "…vas a querer volver a escucharla." mientras las barras de sonido (picos de la muestra real) se dibujan en rojo arándano; suena la muestra a bajo volumen.
- 8-12 s: el certificado de papel recortado entra desde abajo con un nombre de ejemplo ("Sofía", rótulo "Nombre de ejemplo").
- 12-15 s: "Guardar el recuerdo · MX$199". Rótulo: "Descarga la grabación en 30 días. Voz de Santa generada con IA."

## Revisión de `legal-compliance` (rol) de cada pieza y de las landings `?exp`

| Criterio | E1 | E2 | E3 | Resultado |
|---|---|---|---|---|
| No promete regalos ni condiciona la conducta | Sin mención de regalos ni de "portarse bien" | Igual | Igual | Aprobado |
| Sin niños reales | Ilustración de papel | Ilustraciones de adultos; el video usa actor adulto y rótulo "Escena actuada", sin voz de niño | Sin personas; el nombre "Sofía" va rotulado como ejemplo | Aprobado |
| Sin reseñas inventadas | Ninguna | La nota a mano y el WhatsApp del guion son escena, no testimonio; rotulados | Ninguna | Aprobado. La sección de reseñas de la landing sigue oculta hasta tener reseñas reales y autorizadas (Fase 0) |
| No esconde la IA | Línea fina en cada pieza y en el hero de la landing; FAQ intacto | Igual | Igual | Aprobado: la revelación no es el gancho pero siempre está visible |
| Promesa verificable | "La grabación te llega a ti" es cierto (el enlace va al correo del comprador) | Igual; "en su Navidad" es figurado, la grabación llega después y no se promete escucha en vivo | "Guarda" es cierto; se evita "para siempre" porque los archivos se borran a los 30 días y la pieza lo dice | Corregido: en E3 se cambió "guardadas para siempre" por "Guarda…" y se añadió la ventana de 30 días en cada pieza |
| Comprador = padre, madre o tutor (C1) | Cumple | Cumple: se dirige a madres y padres que están lejos; no invita a abuelos, tíos ni padrinos a comprar | Cumple | Aprobado. Bloqueante abierto: el texto por defecto de la landing "Abuelos y abuelas / Padrinos y tíos" choca con C1 (G6 de la estrategia) |
| Atributos personales (política de Meta) | n/a | Sin "migrante" ni "inmigrante"; "lejos de casa" describe una situación, no un grupo protegido | n/a | Aprobado |
| Escasez y urgencia | Sin "cupos"; la cuenta atrás de la landing es real | Igual | Igual | Aprobado |
| Paquete | n/a | n/a | "MX$349 en vez de MX$398" es aritmética real; solo con el paquete a la venta | Aprobado condicionado a `BUNDLE_ENABLED=1` |

Veredicto: aprobado para la Fase 1 una vez cumplidas G1 (marca) y los cobros reales; no es asesoría de abogado.
