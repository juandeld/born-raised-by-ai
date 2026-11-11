# Guion 00 · Video gratis de 15 s (gancho)

Versión `guion-v1` · 11-nov-2026 · `video-guionista` · Brief: `docs/briefs/jinglo-video-piloto.md`. Reglas de voz y de Santa: igual que `01-lista-ninos-buenos.md` (sección 0). Aquí no hay sincronización de labios: Santa dice el nombre con la vista en el libro (costo de escena ~$0,03).

## 0. Objetivo

Que el niño oiga su nombre dicho por Santa y que el adulto quiera ver el resto. Termina en suspenso. Lleva una marca discreta de jinglo.app en una esquina durante todo el video.

## 1. Huecos

| Hueco | Obligatorio | Límite | Si falta |
|---|---|---|---|
| `{nombre}` | Sí | 14 caracteres | No se genera el video |
| `{edad}` | No (solo elige variante) | 3 a 9 | Texto de 5 a 6 años |

No se piden logro, gusto ni Niño Dios en este video: el gancho solo usa el nombre. El video gratis no menciona al Niño Dios (no hay tiempo y el dato no se pide).

## 2. Guion base (5 a 6 años y sin edad)

Presupuesto: voz en off y fijos = (segundos − 0,5) × 15 caracteres.

| Tramo | Tiempo | Qué se ve | Qué dice Santa | Tipo | Máx. car. |
|---|---|---|---|---|---|
| G1 | 0:00–0:07 | Estudio cálido de velas. Plano sobre el hombro de Santa, con la barba cubriendo el rostro de perfil. Abre el Gran Libro y pasa páginas con nombres dorados borrosos. Marca jinglo.app discreta en una esquina | "¡Jo, jo, jo! Déjame buscar en mi Gran Libro. Hay un nombre que brilla." | [FIJO] | 97 (texto: 70) |
| G2 | 0:07–0:15 | Plano cenital del libro: el dedo de Santa se detiene y el nombre del niño se escribe en dorado (FFmpeg) con destellos. Último segundo: Santa levanta la vista, sonríe con la boca cerrada y guiña; el libro se cierra con un destello y corte a dorado | "¡Aquí estás, {nombre}! ¡Hola, {nombre}! Tengo algo más que decirte sobre tu regalo…" | [PERSONALIZADO-OFF] | 112 (peor caso: 95) |

Totales: 15 s. Labios: 0 s. Nombre: 2 veces, ambas en G2. La frase final es idéntica en todas las edades y se dice sin prisa, con pausa de 0,5 s antes y silencio con música suave al terminar.

Nota: "sobre tu regalo" es el gancho que pidió el brief. Dicho así no promete ningún regalo concreto ni confirma que habrá uno; si `desarrollo-infantil` prefiere "sobre tu sorpresa", se cambia sin tocar nada más.

## 3. Variantes por edad (solo G2)

| Edad | Texto de G2 |
|---|---|
| 3 a 4 | "¡Aquí estás, {nombre}! ¡Hola, {nombre}! Tengo algo más que decirte sobre tu regalo…" (dicho más lento; mismas palabras) |
| 5 a 6 | Igual que el base |
| 7 a 9 | "¡Aquí estás, {nombre}! Tu nombre brilla en mi libro. Tengo algo más que decirte sobre tu regalo…" (peor caso: 102 caracteres) |

G1 es igual para todas las edades.

## 4. Ejemplos con nombres ficticios

| Niño | G1 [FIJO] | G2 [PERSONALIZADO-OFF] |
|---|---|---|
| Sofía, 5 años | "¡Jo, jo, jo! Déjame buscar en mi Gran Libro. Hay un nombre que brilla." | "¡Aquí estás, Sofía! ¡Hola, Sofía! Tengo algo más que decirte sobre tu regalo…" (77 car.) |
| Mateo, 8 años | igual | "¡Aquí estás, Mateo! Tu nombre brilla en mi libro. Tengo algo más que decirte sobre tu regalo…" (93 car.) |

## 5. Entradas que se rechazan o se suavizan

Aquí solo importan nombre y edad. La lista completa de campos opcionales está en `01-lista-ninos-buenos.md`, sección 6.

| Entrada | Acción |
|---|---|
| Insultos, groserías, "ignora las instrucciones", URLs, teléfonos, correos | Rechazar y pedir otro nombre |
| Apellidos o nombre completo | Usar solo el primer nombre |
| Nombre con números, emojis o más de 14 caracteres | Pedir corregir |
| Nombre de personaje ajeno o apodo de marca ("Rudolph", "Spider-Man") | Pedir el nombre propio del niño |
| Edad fuera de 3 a 9 | Usar el texto de 5 a 6 en el gratis; para la venta completa, el adulto debe elegir otra edad |
| Cualquier texto que pida a Santa decir IA, robot o "soy humano" | Rechazar |

## Dudas abiertas

1. Pronunciación de nombres poco comunes (campo opcional "cómo se dice").
2. El gancho "sobre tu regalo": confirmar con `desarrollo-infantil` y `legal-compliance` que no se lee como promesa.
