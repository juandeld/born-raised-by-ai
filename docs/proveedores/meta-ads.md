# Meta Ads (Facebook e Instagram): anuncios de Pintoria y Jinglo

Veredicto D27: **PERMITIDO con condiciones** para Pintoria y Jinglo (anuncios dirigidos a padres). Hay una condición técnica que hoy no se cumple: el Pixel del navegador puede enviar el nombre del niño en la URL (ver Condición 1).
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Ad Standards, índice | https://transparency.meta.com/policies/ad-standards/ | sin fecha visible |
| Privacy Violations and Personal Attributes | https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/ | última entrada del historial visible: 26-jun-2024 |
| Child Sexual Exploitation, Abuse, and Nudity | https://transparency.meta.com/policies/ad-standards/objectionable-content/child-sexual-exploitation-abuse-nudity | sin fecha visible |
| Prohibited Commercial Practices (Community Standard al que remiten los anuncios) | https://transparency.meta.com/policies/community-standards/prohibited-commercial-practices/ | sin fecha visible |
| Cómo se etiquetan las imágenes de IA en anuncios | https://www.meta.com/en-gb/help/artificial-intelligence/355108217670024/ | sin fecha; "gradually introduced" |
| Expanding GenAI Transparency for Meta’s Ads Products | https://about.fb.com/news/2025/02/gen-ai-transparency-metas-ads-products/ | actualizada el 1-jun-2026 |
| Meta Business Tools Terms (Pixel y API de Conversiones) | https://www.facebook.com/legal/technology_terms | fecha y número de sección [no verificado] |

## Citas textuales

**IA en imagen**
- Etiquetado: "Meta is providing transparency by labelling ad images created or materially edited using our generative AI creative features with AI info."
- 1-jun-2026: "We will also begin automatically detecting ads created or edited using third-party AI tools through industry-standard signals. When detected, we’ll apply an “AI info” label".
- Humanos generados: si hay un humano fotorrealista generado con IA, la etiqueta va "next to the “Sponsored” label". No hay prohibición de anunciar con imágenes de IA.

**Menores en creativos**
- "Ads must not contain content that sexually exploits or endangers children."
- No encontré en las páginas leídas una regla específica sobre fotos de menores reales en creativos distinta de explotación o desnudez [no verificado].

**Atributos personales (edad, nombre)**
- "ads must not contain content that asserts or implies personal attributes. This includes direct or indirect assertions or implications about a person’s race, ethnicity, religion, beliefs, age, [...] or name."
- Los anuncios no pueden: "Share or ask for personal attributes of a user or user’s family" ni "Imply that the advertiser is aware of someone’s personally identifiable information, such as their name".
- Sí pueden: "Contain passing reference to a personal attribute. This includes gender, age groups or age ranges." y "Include names of celebrities or fictional characters."

**Entrega y reembolsos (prácticas comerciales)**
- "Non-delivery: failure to deliver purchased products or services after payment has been made."
- "Violation of return or refund policies: failure to honor stated refund or return policies."

**Datos de niños en el Pixel**
- Business Tools Terms: "you will not share Business Tool Data with us that (i) you know or reasonably should know is from or about children under the age of 13".

**Deepfakes, llamadas automatizadas, vendedor en Guatemala**
- Sin cláusula específica en las páginas leídas. El país del anunciante no se restringe en las normas leídas; la verificación de la cuenta de anuncios y del medio de pago [no verificado].

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria (anuncios a padres) | **PERMITIDO con condiciones** | Producto lícito, anuncios con arte propio. Condiciones 1 a 5. |
| Jinglo (anuncios a padres) | **PERMITIDO con condiciones** | Igual. Además la promesa de entrega (llamada en la fecha pedida) debe cumplirse o reembolsarse. |

## Condiciones

1. **Pixel y nombre del niño.** `apps/web/src/components/MetaPixel.tsx` dispara `fbq("track", ...)` sin quitar la query de la URL, y el checkout recibe el nombre como `&n=<nombre>`. El Pixel de navegador envía por defecto la URL de la página (comportamiento estándar del Pixel; no lo verifiqué en la documentación de Meta durante esta lectura). Si es así, el nombre de un niño llega a Meta, lo que choca con la cláusula de datos de menores de 13 años. La API de Conversiones sí recorta la URL a origen y ruta. Acción: `arquitecto` verifica en la pestaña de red del navegador y, si se confirma, elimina `n` de la URL con `history.replaceState` antes de iniciar el Pixel o no carga el Pixel mientras exista `n`. Esto es un dato recogido: se informa a Juan.
2. **Texto del anuncio sin atributos.** Prohibido "Tu hijo de 6 años", "¿Tu hija se llama...?", "Santa sabe cómo se llama tu peque". Permitido: rangos ("para niños de 4 a 8 años"), "para tus peques", personajes ficticios con nombre. No personalizar el anuncio con el nombre del niño.
3. **Rostros.** Solo ilustraciones propias o personas adultas con autorización escrita. Ningún menor real, ni de clientes ni de bancos de fotos sin cesión, sin visto bueno de `legal-compliance` por creativo. Los ejemplos de Pintoria deben ser familias ilustradas, no fotos reales de clientes.
4. **Etiqueta de IA.** Las ilustraciones hechas con IA recibirán etiqueta "AI info"; no se borran metadatos ni marcas de agua. No decir "hecho por humanos". Si el anuncio muestra un humano fotorrealista generado con IA, la etiqueta aparecerá junto a "Sponsored": evitarlo.
5. **Promesas.** Entrega y reembolso exactamente como en el checkout (7 días, automático). Sin "garantizado" que supere el reembolso real (corregido ya en la landing, ver `docs/legal/aprobacion-jinglo.md`).

## Qué hacer

- `marketing-growth` no publica un anuncio sin aprobación escrita de `legal-compliance` por creativo (regla vigente).
- Sin cuenta de anuncios nueva hasta que Juan lo apruebe; confirmar antes que un anunciante individual de Guatemala puede verificar identidad y pagar [no verificado].
- Revisar la política cada 30 días: el etiquetado de IA cambió el 1-jun-2026.

## No verificado

- Regla específica sobre menores reales en creativos.
- Requisitos de verificación del anunciante y del medio de pago desde Guatemala.
- Fecha y sección de las Business Tools Terms.
