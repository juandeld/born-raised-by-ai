# Textos legales finales: índice, variables y reglas de uso

Versión del paquete: `legal-v1` (archivos 02-C3, 03 y 07 en `legal-v1.2` por la decisión D13: Santa permanece en personaje con el niño y la revelación de IA se hace al adulto) · Fecha: 18-oct-2026 · Autor: `legal-compliance` · Decisión de origen: D6 (sin abogado; textos finales por `legal-compliance`, riesgo controlado por diseño conservador).

Estado: FINAL para pegar en producto, sujeto a (1) llenar las variables de la sección 2, (2) la aprobación de Juan de los tres cambios de retención de la sección 5, y (3) aprobación escrita de `legal-compliance` en el PR de cada producto. Ningún texto fue revisado por un abogado humano. Lo marcado `[no verificado]` es una afirmación legal que no se pudo confirmar con fuente primaria en esta revisión; el texto al cliente no depende de ella, pero la decisión de vender en ese mercado sí (ver `docs/legal/riesgos-y-mitigaciones.md`).

## 1. Archivos

| Archivo | Contenido | Dónde se pega |
|---|---|---|
| `01-aviso-coppa-y-consentimiento-padre.md` | Aviso directo previo al pago, casillas C1 y C2, recibo | Checkout de productos de llamada a niños (santa, rex) y de productos con datos de niños (colorear, cancion) |
| `02-consentimiento-tcpa-grabacion.md` | Casillas C3 a C5, texto de opt-out, registro de evidencia | Checkout de todo producto de llamada |
| `03-preludio-llamada-adulto.md` | Preludio hablado: Santa, Reyes Magos, Rex, Memorias | Primer mensaje del agente en ElevenLabs |
| `04-politica-privacidad.md` | Política base + módulo por producto + proveedores + borrado | Página `/privacidad` de cada producto |
| `05-terminos-y-reembolso.md` | Términos y reembolso automático a 7 días | Página `/terminos` y enlace en checkout |
| `06-descargo-pases-examen.md` | Descargo para seguros-tx, ciudadania, dot | Landing, checkout, primera pantalla del producto, términos |
| `07-guardrails-agente-voz.md` | Lista operativa para `arquitecto` | Prompt, herramientas y pruebas del agente de voz |

## 2. Variables que hay que llenar antes de publicar

| Variable | Qué es | Quién la da |
|---|---|---|
| `{{MARCA}}` | Nombre comercial del producto (no puede incluir marcas prohibidas) | Juan / `marketing-growth` |
| `{{TITULAR}}` | Nombre completo de la persona individual titular del cobro y responsable de los datos (D5) | Juan |
| `{{DOMICILIO}}` | Domicilio postal del titular (obligatorio para aviso de privacidad en varias jurisdicciones) `[no verificado]` | Juan |
| `{{EMAIL_PRIVACIDAD}}` | Buzón de privacidad y borrado (alias que reenvía a Juan y lo lee el agente de soporte) | `arquitecto` |
| `{{EMAIL_SOPORTE}}` | Buzón de soporte y reembolsos | `arquitecto` |
| `{{DOMINIO}}` | Dominio del producto | `arquitecto` |
| `{{PRECIO}}` | Precio mostrado, con moneda | `arquitecto` |
| `{{NOMBRE_NIÑO}}`, `{{NOMBRE_ADULTO}}`, `{{NOMBRE_PERSONA_LLAMADA}}` | Se rellenan por pedido | Motor de llamadas |
| `{{DOMINIO_HABLADO}}` | El dominio dicho en voz alta en las llamadas | `arquitecto` |
| `{{FECHA_VIGENCIA}}` | Fecha de publicación de cada versión | `arquitecto` al desplegar |

Regla: ningún texto se publica con una variable sin llenar. Una prueba automática en CI debe fallar si encuentra `{{` en una página pública.

## 3. Idiomas y variantes

- `es-419`: español neutro para México y EE. UU. hispano. Tuteo/usted: usa "usted" en avisos legales y en el preludio; "tú" en la voz de los personajes con niños.
- `es-ES`: variante castellana. Cambia: "móvil" por "celular", "pulse" por "presione" cuando aplique, "Papá Noel" por "Santa", "Ratoncito Pérez" por "Ratoncito Pérez o Ratón de los Dientes" (en `es-419` se usa "Ratoncito Pérez" con aclaración), "ordenador" por "computadora", referencias a RGPD, AEPD y Ley Orgánica 3/2018 `[no verificado]` en lugar de COPPA/ARCO.
- `en-US`: inglés de EE. UU.
- `en-GB`: usa `en-US` con estos cambios: "mobile" por "cell", "Father Christmas" opcional junto a "Santa", referencias a UK GDPR y al ICO `[no verificado]`.

El idioma del texto mostrado es el del navegador del comprador, con selector visible. El idioma y la variante mostrados se guardan con el consentimiento.

## 4. Casillas del checkout (orden fijo, todas sin marcar, botón de pago deshabilitado hasta marcar las que apliquen)

| Id | Aplica a | Archivo |
|---|---|---|
| C1 Soy padre, madre o tutor y autorizo los datos del niño | Productos con datos de menores | 01 |
| C2 Uso exclusivo y retención de 30 días | Productos con datos de menores | 01 |
| C3 Entiendo que es IA, que se graba y que el personaje hablará con mi hijo sin decirle que es IA | Todo producto de llamada | 02 |
| C4 Autorizo expresamente la llamada automatizada con voz de IA | Todo producto de llamada | 02 |
| C5 El número es mío o de alguien que está de acuerdo, y le avisaré | Todo producto de llamada | 02 |
| C6 Acepto términos y política de privacidad | Todo producto | 05 y 04 |

El aviso directo COPPA (archivo 01) va visible arriba de las casillas, no dentro de una ventana emergente ni detrás de un enlace.

## 5. Cambios de datos que requieren aprobación de Juan (regla de `CLAUDE.md`)

Estos textos asumen tres retenciones que el expediente anterior no fijaba. Están escritos en la política de privacidad; si Juan los rechaza hay que quitarlos de los archivos 01, 02 y 04 y el consentimiento deja de ser demostrable después de 30 días.

1. Registro de consentimiento (sin nombre del niño, sin audio, sin número en claro): 4 años `[no verificado: plazo prudencial por prescripción de acciones TCPA en EE. UU.; confirmar]`.
2. Lista de supresión (huella irreversible del número de quien pidió no recibir más llamadas): sin vencimiento, solo para respetar la baja.
3. Registro de entrega sin contenido (id del pedido, hora de cada intento, resultado, duración, estado del reembolso; sin audio, sin nombre del niño, sin número en claro): 13 meses, para responder contracargos `[no verificado: las ventanas de contracargo varían por red de tarjeta; confirmar con Polar y Recurrente]`.

Ninguna casilla nueva ni campo nuevo del formulario se agrega con estos textos.

## 6. Control de versiones y evidencia

Cada texto lleva un identificador: `<archivo>-<casilla o bloque>-<idioma>-legal-v1` (ejemplo: `02-C4-es-419-legal-v1`). El checkout guarda el identificador y el hash SHA-256 del texto exacto mostrado. Cualquier cambio de palabra crea `legal-v2`; los pedidos viejos conservan su versión. Excepción de numeración: los cambios de la decisión D13 (18-oct-2026) se identifican con el sufijo `-legal-v1.2` (por ejemplo `02-C3-es-419-legal-v1.2`, `03-SANTA-es-419-legal-v1.2`); el resto conserva `-legal-v1`.

## 7. Marcas

Prohibidos en cualquier texto, imagen, guion o anuncio: Elf on the Shelf, Rudolph, Grinch, Portable North Pole y PNP, Polar Express, Frosty. Permitidos como folclore: Santa Claus, Papá Noel, Reyes Magos (Melchor, Gaspar, Baltasar), Ratoncito Pérez, Tooth Fairy, Polo Norte, Lista de los Buenos. Renos: solo los del poema de 1823 (Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen). Verificación de marca propia: pendiente `[no verificado]`.
