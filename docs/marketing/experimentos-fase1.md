# Jinglo en México: 3 experimentos de la Fase 1 (y la Fase 0)

`marketing-growth` · 19-oct-2026 · Decisión D24 (`docs/decisiones.md`) · Creativos, copys, guiones y revisión legal: `docs/creativos/jinglo/experimentos-anuncios.md` · Cifras [EST] son cálculo propio; [no verificado] lo que no pude confirmar.

## 1. Lo que cambia respecto al plan de la propuesta (léelo primero)

1. **E2 como estaba escrito no se puede lanzar.** La casilla C1 del checkout exige ser "padre, madre o tutor legal"; un abuelo, tío o padrino no puede marcarla sin mentir, y el motor registra el texto de C1 en el consentimiento (`engines/calls`, solo `arquitecto`). Reemplazo: **comprador = el padre o la madre que está lejos** (trabaja fuera, familia en dos casas, migrante). Cumple C1, mantiene "estar presente aunque estés lejos" y la grabación le llega a él (el correo siempre va al comprador). Abuelos, tíos y padrinos quedan para después, con una casilla C1-regalo que redacta `legal-compliance` y aprueba `arquitecto` (borrador al final).
2. **El paquete de E3 hoy no se puede vender**: la segunda llamada no es programable (`BUNDLE_ENABLED` apagado, `docs/arquitectura/pendientes-cuentas.md`). E3 sale el 3-nov con **una llamada** (prueba el motivo "recuerdo"); si `arquitecto` habilita el paquete antes del 2-nov, la landing lo pone como oferta principal sola (MX$349 vs MX$398) y se activa el 3.er estático. El anclaje de precio, si no, pasa a la Fase 2.
3. **A $0.45 de CPC el CAC no cierra** (60 % de MX$199 = $6.3 de CAC). Con $250 la Fase 1 compra una señal y un orden entre hipótesis, no rentabilidad: espero 9 a 15 compras en total y un ROAS de 0.4 a 0.6 [EST]. Se declara aquí para que nadie lea ese ROAS como fracaso.
4. **No se puede tocar a la diáspora desde una campaña en México.** Meta segmenta por dónde vive la persona. Llegar a mexicanos en EE. UU. exige una campaña con ubicación US: CPM $23 vs $4.50 (5.1×) y CPC $2.69 vs $0.45 (6×); $75 compran ~28 clics en vez de 167. Con $250 no es medible: queda para Fase 2 como campaña aparte, solo si E2 gana (condiciones en la sección 6).

## 2. Los tres experimentos (hipótesis de negocio, no estilos)

| | **E1 La cara de tu peque** | **E2 Presente a distancia** | **E3 Recuerdo guardado** |
|---|---|---|---|
| Quién compra | Mamá/papá 25 a 40 que vive con el niño (3 a 9 años) | Mamá/papá que está lejos de casa (28 a 55) | Mamá "guardiana de recuerdos" 26 a 42 |
| Por qué | Vivir la ilusión en vivo: ver su cara | Estar en la Navidad de su peque sin estar en la sala | Conservar su voz y la de Santa |
| Oferta | 1 llamada MX$199 (la grabación es extra) | 1 llamada MX$199; **la grabación te llega a ti** es el titular | Lanzamiento: 1 llamada MX$199 enmarcada como recuerdo. Con paquete: 2 llamadas MX$349 (vs MX$398) |
| Hipótesis falsable | Si el anuncio muestra la reacción, ≥ 1.0 % de CTR de enlace y ≥ 3 % de compra por clic; si no, la "ilusión en vivo" no basta como motivo | Un padre ausente, al ver "la grabación es tuya", compra a ≥ 2 % por clic y la comunica mejor que E1; si E2 no iguala a E1, "a distancia" no es un segmento | El motivo "guardar" convierte con ticket igual o mayor; gana si su costo por compra es ≤ 1.5× el de E1 **y** el ingreso por compra (con paquete) ≥ 1.3× |
| Audiencia Meta (MX, Advantage+ audience con sugerencias; ubicaciones Advantage+ sin Audience Network) | 25 a 40, ambos sexos; sugerencias: padres de preescolares y escolares [no verificado: Meta retiró parte de estos comportamientos], Navidad, crianza | 28 a 55; sugerencias: envío de dinero/remesas, "amigos de expatriados" [no verificado], trabajo por turnos (transporte, plataformas, minería). Sin menciones a migración en el texto (política de atributos personales de Meta) | Mujeres 26 a 42; sugerencias: fotografía infantil, álbumes y scrapbooking, Pinterest, decoración |
| 3 ganchos | "Su cara cuando Santa pregunte por su nombre." · "Suena el teléfono. Es del Polo Norte. Tú solo tienes que estar ahí." · "Hay una cara que vas a querer ver esta Navidad." | "Lejos de casa, pero en su Navidad." · "La llamada es de Santa. La grabación, tuya." · "¿Lejos de casa en diciembre? Que a tu peque le suene el teléfono." | "Guarda su voz de hoy." · "Dentro de diez años vas a querer volver a escucharla." · "Dos llamadas. Dos recuerdos." (solo con paquete) |
| Landing | `/es?exp=e1&cr=<anuncio>`: titular de la cara | `/es?exp=e2`: titular "Lejos de casa", pasos "dinos a qué número llamar", la grabación te llega a ti, FAQ "¿quién contesta?" | `/es?exp=e3`: "Guarda la voz...", paso "la descargas y es tuya"; el paquete como botón principal si está a la venta |

Precio: MX$199 en las tres, dentro de ±10 % de D1 (rango MX$179 a 219) y sin probar precio, para que la diferencia sea solo hipótesis; solo E3 cambia la oferta (paquete). Estilo: E1 papel recortado de la landing; E2 foto instantánea con nota a mano; E3 premium minimalista sobre crema.

## 3. Reparto de $250 y estructura

Una campaña "F1-MX-señal", objetivo Ventas, **presupuesto por conjunto (no CBO, para que Meta no deje sin gasto a una celda)**, 3 conjuntos (uno por experimento), 2 anuncios por conjunto (el 3.º, el video, entra cuando se produzca), 3 a 16 nov (14 días), horario de México.

| Celda | Base | Por día | Clics esperados a $0.45 | Reserva |
|---|---|---|---|---|
| E1 | $75 | $5.36 | ~167 | Los $25 de reserva se liberan el 10-nov a la celda con menor costo por inicio de checkout, solo para acumular datos; la decisión sigue siendo la misma |
| E2 | $75 | $5.36 | ~167 | |
| E3 | $75 | $5.36 | ~167 | |
| Total | $225 + $25 reserva = **$250** | | ~555 | |

Por qué iguales: las tres hipótesis están sin probar y E1 ya tiene la landing más pulida; un reparto desigual sesgaría el resultado. Por qué no 5 celdas: con 555 clics, cada celda extra baja la lectura por debajo de lo útil. Evento de optimización: Inicio de checkout (`checkout_started`), porque con ~20 compras en total Meta no sale de aprendizaje optimizando por compra; si Pixel/CAPI no está listo el 2-nov, objetivo Tráfico a vistas de la landing y la medición va por `cr` en nuestra analítica.

Embudo esperado por celda [EST]: 167 clics, ~42 `cta_click`, 10 a 13 `checkout_started` (6 a 8 %), **3 a 5 compras (2 a 3 %)**.

## 4. Métricas y regla de decisión

Primaria: **costo por compra** (de nuestra analítica por `cr`, no la de Meta). Secundarias: costo por `checkout_started` y CTR de enlace. E3 se compara además por ROAS (su ticket puede ser mayor). Guarda: reembolsos ≤ 5 %.

- **Apagar un anuncio**: CTR de enlace < 0.7 % tras 1,500 impresiones.
- **Apagar una celda** (lectura el 9-nov o al llegar a $40): 0 `checkout_started` con ≥ 70 clics (si la tasa real fuera 5 %, tener 0 en 70 pasa 3 veces de 100), o costo por `checkout_started` > $12 con ≥ 4 inicios. Antes de apagar por 0 inicios: mirar la landing, puede ser fallo de página y no de hipótesis.
- **Ganador** (16-nov, o al agotarse el gasto): ≥ 5 compras y costo por compra al menos 1.5× menor que la segunda celda. Si hay empate dentro de 1.5×, decide el menor costo por `checkout_started`, luego el mayor ingreso por compra, luego los menores reembolsos.
- **Qué hace el ganador (Fase 2, regla D1)**: costo por compra ≤ $8.75 (ROAS ≥ 1.2): escalar con la regla de reinversión. Entre $8.75 y $15: Fase 2 con el tope restante de D1, solo para bajar el costo con nuevos creativos del ángulo ganador y con alto al llegar a $100 si sigue > $11. > $15 o < 5 compras en todas: **no hay ganador**, no se escala, se revisa landing y oferta (la fricción del checkout, 6 casillas, es la sospecha principal) antes de gastar más.
- Con ~5 compras por celda esto es señal, no prueba: los umbrales exigen diferencias grandes a propósito.

## 5. Fase 0 (26-oct a 2-nov, sin anuncios)

Objetivo: primeras ventas reales entregadas de punta a punta (gate D4), reseñas reales y autorizadas, y cazar fallos antes de gastar. Metas: ≥ 8 pedidos, ≥ 4 reseñas con permiso de publicar nombre de pila y ciudad, 0 incidentes críticos. **Sin descuento**: no existe mecanismo de código en el checkout, el precio completo da señal real y una reseña de quien pagó pesa más; tampoco se paga ni se reembolsa por reseñar (no condicionar incentivos a reseñas). Condiciones previas: Polar con KYC y Resend con dominio verificado (D18); sin ellas no se puede cobrar el 26-oct.

Enlace por grupo: `https://born-raised-by-ai-4ta9.vercel.app/es?exp=f0&cr=familia` (cambiar `familia` por `amigos`, `trabajo`, `colegio`, `otros`; cambiar el dominio cuando lumen-labs.co o el de la marca apunte a Vercel). Aparece como `f0.<grupo>` en los eventos.

Mensaje (Juan, WhatsApp, personalizar la primera línea): "Hola [nombre]. Llevo meses con un proyecto y quiero que seas de los primeros en probarlo. Se llama Jinglo: Santa llama por teléfono a tu peque, por su nombre, el día y la hora que tú elijas; tú le pasas el teléfono y después te llega la grabación y un certificado para guardar. Cuesta MX$199, pago único, sin suscripción. Es un lanzamiento y la voz de Santa la genera una inteligencia artificial, no una persona. Si algo falla, el sistema te devuelve todo solo. Si lo pruebas, ¿me escribes dos líneas sinceras después, lo bueno y lo que mejorarías? Prefiero una crítica honesta a un elogio. Aquí: [enlace]. Y si no es para ti, no pasa nada: ¿se lo mandas a alguien con peques?" Seguimiento (día después de la llamada): "¿Cómo les fue? ¿Me das tu opinión en una o dos líneas y me dices si puedo citarte con tu nombre de pila y tu ciudad? Si algo no salió bien, dímelo y lo arreglo."

## 6. Pendientes y dueños

| # | Qué | Dueño | Fecha |
|---|---|---|---|
| G1 | Búsquedas oficiales de marca JINGLO (D19): sin ellas, ningún anuncio | Juan | antes del 2-nov |
| G2 | Segunda llamada programable y `BUNDLE_ENABLED=1` (para E3 con paquete) | `arquitecto` | 30-oct (opcional) |
| G3 | Pixel + API de Conversiones con `checkout_started` y `Purchase` (o aceptar el plan B de medición) | `arquitecto` | 31-oct |
| G4 | Casilla C1-regalo y C2-regalo para abuelos, tíos y padrinos (borrador: "Tengo la autorización del padre, la madre o el tutor legal del niño o la niña, quien sabe de esta llamada y está de acuerdo en recibirla, y soy mayor de edad") | `legal-compliance` redacta, `arquitecto` implementa | después de la Fase 1 |
| G5 | Campaña US para la diáspora: solo si E2 gana, ≥ $150, campaña aparte, precio mostrado en MXN con equivalente en USD | `marketing-growth` | diciembre |
| G6 | La landing por defecto invita a "abuelos y padrinos" a reservar, lo que choca con C1: corregir ese texto | `legal-compliance` | antes de escalar |

Costo de esta entrega: 2 ilustraciones nuevas con `gpt-image-1-mini` (≈ $0.03) y $0 en Meta (nada se ha gastado).
