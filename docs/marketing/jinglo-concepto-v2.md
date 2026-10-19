# Jinglo v2: concepto creativo de la landing

`marketing-growth` · 19-oct-2026 · Base visual: direccion-b ("Taller de papel"). Prototipo: `docs/diseno/jinglo/v2/landing.html` (autocontenido; fuente en `v2/src/`, `python3 v2/build.py`). Sin aplicar a producción: pendiente de Juan.

## La gran idea
No vendemos una llamada: vendemos **la cara de tu hijo cuando contesta el Polo Norte**. El comprador es el adulto, y su recompensa emocional es mirar. Todo gira alrededor de un teléfono que suena en una casa de noche con nieve. El visitante escribe el nombre del peque y la página "recibe la llamada": el titular, la llamada entrante, el botón y el certificado se personalizan. Ese gesto de dos segundos lo vuelve suyo antes de pagar.

## Diez titulares candidatos (es-MX)
1. Este año, el Polo Norte llama a casa.
2. Hay una llamada del Polo Norte para {nombre}.
3. Suena el teléfono. Es del Polo Norte.
4. La Navidad que tu hijo va a contar toda la vida.
5. Cuando el Polo Norte pregunte por {nombre}, tú vas a estar mirando.
6. Una llamada del Polo Norte. Una cara que no vas a olvidar.
7. Que el Polo Norte te marque a ti.
8. Tu hijo no sabe que hoy lo llaman.
9. Prepárate: el Polo Norte tiene tu número.
10. Regálale a {nombre} una llamada que recordará de grande.

## Los 3 elegidos
- **"Este año, el Polo Norte llama a casa."** (hero por defecto, anuncios en frío). Se entiende en un segundo, no explica la tecnología, promete evento ("este año") y posiciona al Polo Norte como protagonista, no a una app. Sin nombre, sin fricción.
- **"Hay una llamada del Polo Norte para {nombre}."** (hero tras escribir el nombre; retargeting y UTM con nombre). Es el gancho de Juan convertido en escena: suena el teléfono y es para él o ella. Escribe el nombre en script y el titular cambia en vivo.
- **"Una llamada del Polo Norte. Una cara que no vas a olvidar."** (anuncios de video y email). Nombra la verdadera recompensa, la del adulto. Es la mejor para el ángulo "Reacción" de `jinglo-lanzamiento.md`.
Descartados: 4 y 10 (prometen recuerdo pero no hay escena), 8 (ambiguo, suena a amenaza), 9 y 7 (juego de palabras que distrae), 3 (buena pero débil sin imagen), 5 (largo).

## Tono
Cálido, pausado, de libro ilustrado. Frases cortas, verbos concretos, nada de "revolucionario", "mágico" ni "experiencia". Hablamos al adulto de tú, como un amigo que ya lo hizo. Sin signos de exclamación, sin emojis. Las promesas son verificables (cinco minutos, dos intentos, 7 días).

## Por qué convierte (y qué cambia respecto a B)
- **Emoción primero, producto después.** El hero es una escena, no una lista de beneficios; el CTA ya lleva el nombre ("Reservar la llamada de Sofía").
- **Prueba por los oídos.** "Descolgar" reproduce la muestra real, con forma de onda calculada del audio real. Es lo más cercano a probar sin comprar.
- **Objeciones resueltas donde nacen.** Seguridad, privacidad, "¿lo hace una persona?", timidez, suscripción y reembolso están en FAQ y garantía, con el texto legal vigente.
- **Urgencia honesta.** Cuenta regresiva real a la noche del 24-dic; "último día: 22-dic" (fecha del plan de lanzamiento: confirmar con arquitecto); el cupo por franja se explica sin cifras inventadas porque el sistema sí limita llamadas simultáneas (CALLS_MAX_CONCURRENCY=20). Si queremos un contador "quedan N cupos" hace falta endpoint real.
- **Recuerdo como valor.** La grabación y el certificado (con el nombre del peque) convierten un gasto de 5 minutos en algo que se guarda.
- **Sin look de IA.** Papel recortado propio, serif Fraunces + script Pinyon, grano de papel, bordes cortados a mano, sin gradientes, iconos, emojis ni tarjetas idénticas. Una sola animación de entrada y un timbre ocasional del teléfono.

## Cumplimiento (docs/legal)
La revelación de IA no es el primer mensaje del hero, pero está en: nota bajo el audio, FAQ (primera pregunta), nota de precio antes del botón de pago, pie de página y, por obligación, en checkout, correo y preludio (fuera de esta página). No hay reseñas ni cifras: el bloque "Lo que dicen las familias" existe con `hidden`. Ninguna imagen muestra marcas ni un Santa reconocible; el niño ilustrado no es un menor real. Pendiente: legal-compliance debe revisar la nueva redacción de hero y garantía antes de publicar.
