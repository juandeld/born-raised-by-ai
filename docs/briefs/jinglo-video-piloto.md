# Brief · Jinglo video piloto: "La Lista de Niños Buenos" + video gratis de 15 s

11-nov-2026 · aprobado por Juan (piloto de ~$100–110: un mes de Google AI Ultra + pruebas de voz y labios) · equipo `video-*` (`docs/video/jinglo/equipo.md`).

## Qué es
Video personalizado de Santa para niños de 3 a 9 años. Lo compra el adulto (mamá, papá, abuelos) y lo ve el niño en el teléfono o el televisor. El niño debe creer, sin dudar, que Santa le habló a él. Estándar: cine navideño hiperrealista, no "video hecho con IA". Mercado inicial: Centroamérica (Guatemala, Costa Rica, El Salvador, Honduras, Panamá) en español latino neutro (acento mexicano/neutro, nunca de España).

## Entregables del piloto
1. **Video 1, "La Lista de Niños Buenos" (~60 s).** Santa en su estudio abre el Gran Libro, busca al niño, lo encuentra, dice su nombre y por qué está en la lista. Momento "wow": el nombre del niño aparece escrito en dorado en el libro (composición por FFmpeg, no generado).
2. **Video gratis (15 s), gancho de mercadeo.** Santa busca en el libro y dice el nombre **con la vista en el libro** (sin labios que sincronizar, costo ~$0.03). Termina en suspenso: "Tengo algo más que decirte sobre tu regalo…". Lleva una marca discreta de jinglo.app.

## Personalización
- Datos del adulto (máx. 5 campos; los define `video-psicologia-padres`): nombre del niño, edad, un logro o algo bueno que hizo este año, algo que le gusta; casilla "En casa también llega el Niño Dios".
- ~50 % del video es personalizado. Solo los planos donde Santa dice el nombre **mirando a cámara** pasan por sincronización de labios (~20 s de 60). El resto de lo personalizado va en voz en off o con Santa sin boca visible.
- Nunca fotos del niño. Nunca prometer un regalo concreto. Sin regaños.

## Producción (restricciones técnicas)
- Escenas: **Google Flow** con Veo 3.1 Quality (clips de 8 s, 100 créditos por clip; 10,000 créditos en el mes = ~100 clips Quality) y Veo 3.1 Fast (10 créditos en Ultra) para planos sin cara. Presupuesto del piloto: ≤ 7,000 créditos. Regla: 6 tomas por plano final y quedarse con la mejor. Flujo: imagen fija aprobada → video. Veo 3.1 Quality/Fast se retiran del Flow el 5-dic-2026: producir antes.
- Formato principal 9:16 vertical (teléfono), versión 16:9 para TV; 1080p.
- Voz: la voz diseñada de Santa de Jinglo en ElevenLabs (D12, "Santa Lumen Labs (es-419)", voice_id LykVXmiL9G4zV1CJHN2o) — solo pruebas internas con **nombres ficticios** hasta tener la aprobación escrita de ElevenLabs (solicitud enviada el 11-nov; plan B Fish Audio).
- Labios: Sync Labs (lipsync-2-pro). Composición del nombre, carta y mapa: FFmpeg propio.
- Música: **no** usar Eleven Music ni Lyria. Composición humana o biblioteca con licencia comercial, fija en el video base.

## Reglas que no se negocian
- Santa nunca dice que es IA, robot o computadora, ni "soy humano" (D13). La revelación va al adulto.
- Nada que copie películas, marcas ni personajes ajenos (Rudolph, Grinch, Elf on the Shelf, Santa de Coca-Cola, Polar Express, Portable North Pole).
- Nada que asuste: sin primeros planos invasivos, oscuridad total ni ruidos fuertes.
- Nunca nombrar proveedores ni modelos de IA ante el cliente (D23).
- Legal y proveedores: `docs/video/jinglo/legal-proveedores.md`.

## Dónde escribe cada quien (solo escribir archivos; NO hacer commit ni push)
| Agente | Archivo |
|---|---|
| `video-guionista` | `docs/video/jinglo/guiones/01-lista-ninos-buenos.md`, `docs/video/jinglo/guiones/00-video-gratis.md` |
| `video-direccion-arte` | `docs/video/jinglo/biblia/arte.md` |
| `video-fotografia-iluminacion` | `docs/video/jinglo/biblia/fotografia.md` |
| `video-musica-sonido` | `docs/video/jinglo/biblia/sonido.md` |
| `video-voz-santa` | `docs/video/jinglo/biblia/voz.md` |
| `video-psicologia-padres` | `docs/video/jinglo/comprador.md` |
| `video-director-creativo` (ronda 2) | `docs/video/jinglo/biblia.md`, `docs/video/jinglo/storyboard/01-lista-ninos-buenos.md` |
| `video-ia-generativa` (ronda 2) | `docs/video/jinglo/produccion/piloto-flow.md` |
| `desarrollo-infantil`, `video-control-calidad` (ronda 3) | `docs/video/jinglo/revision-piloto.md`, `docs/video/jinglo/calidad.md` |

## Fecha
Preproducción completa hoy. Generación en Flow en cuanto Juan active Google AI Ultra.
