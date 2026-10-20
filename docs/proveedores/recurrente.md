# Recurrente: cobro con tarjeta en Guatemala (no es merchant of record)

Veredicto D27: **PERMITIDO con condiciones** para Pintoria y Jinglo. El texto no menciona IA, menores ni llamadas; el silencio no es una aprobación, por eso se exige confirmación escrita antes de abrir la cuenta y declarar ambos productos en el alta.
Lectura: 19-oct-2026, `legal-compliance`. No es asesoría de abogado. Citas: fragmentos textuales mínimos.

## Documentos leídos

| Documento | Enlace | Versión |
|---|---|---|
| Giros de negocios prohibidos | https://ayuda.recurrente.com/es/p/giros-de-negocios-prohibidos | sin fecha en la página |
| Términos y Condiciones | https://www.recurrente.com/terminos | "Actualizado el 25 de septiembre de 2026" |
| Política de privacidad | https://www.recurrente.com/privacidad | sin fecha leída |
| Precios | https://recurrente.com/precios | sin fecha |
| Cobrar a clientes fuera de Guatemala | https://ayuda.recurrente.com/es/p/como-funciona-cobrar-a-clientes-fuera-de-guatemala | sin fecha |
| Cómo verifico mi cuenta comercial | https://ayuda.recurrente.com/es/p/como-verifico-mi-cuenta-comercial | sin fecha |

## Citas textuales

**IA, menores, deepfakes**
- Ninguna cláusula de las páginas leídas menciona inteligencia artificial, menores de edad, fotos de personas ni deepfakes.
- Cierre general de la lista de giros: "Cualquier otro negocio que Recurrente considere desleal, engañoso o predatorio hacia los consumidores."
- Propiedad intelectual y privacidad: "Cualquier otro producto o servicio que infrinja o facilite la infracción de la marca registrada, patente, derecho de autor, secretos comerciales, propiedad o derechos de privacidad de terceros."

**Producto digital**
- Prohibido: "Servicios sin valor agregado, incluyendo la venta o reventa de un servicio sin añadir un beneficio o valor al comprador".
- Declaración obligatoria: es mal uso "para productos/servicios que no se hayan revelado en la solicitud de cuenta de Recurrente del comerciante."

**Llamadas y telemarketing**
- Prohibido: "Marketing de respuesta negativa y telemarketing." Se refiere a cómo se vende, no a qué se entrega; Jinglo se vende en línea al padre que lo compra.

**País y vendedor**
- Empresa guatemalteca; cobra a clientes fuera de Guatemala con tarjetas internacionales Visa o Mastercard; el cobro se configura en quetzales (GTQ) o dólares (USD). No hay otras monedas.
- Tarifa: 4.5 % + Q2 (cuenta comercial) y 5.25 % + Q2 (cuenta personal), por transacción exitosa.

**Condiciones del contrato que importan**
- Términos 4.4.4: índice de fraude mensual "menor al 0.9%" o que no exceda Q50,000 en monto de fraude; si no, pueden terminar el servicio sin previo aviso y hay penalizaciones por reincidencia.
- Términos 4.4.3: pueden retener montos de transacciones "de la cual se sospeche su falta de licitud".
- Términos 5.7: "EL PROVEEDOR no estará obligado a reintegrar suma y cantidades a favor de sus CLIENTES, salvo en aquellos casos específica y expresamente regulados". Los reembolsos los hace el comercio.
- No es merchant of record: el IVA de Reino Unido, España y México y la factura al cliente final son de Juan.
- Apple Pay y Google Pay: no hay evidencia en la documentación leída [no verificado].

## Veredicto por producto

| Producto | Veredicto | Razón |
|---|---|---|
| Pintoria | **PERMITIDO con condiciones** | Producto digital con valor agregado, sin cláusula contraria. Condiciones: declararlo con exactitud (IA y fotos de familia) al abrir la cuenta; confirmación escrita; IVA propio. |
| Jinglo | **PERMITIDO con condiciones** | La llamada es el producto que el padre compra; no es telemarketing ni servicio de telecomunicaciones. Mismas condiciones. Sin la aprobación escrita de ElevenLabs (ver `elevenlabs.md`) no se cobra Jinglo con ningún proveedor. |

## Qué hacer

1. Antes de abrir: escribir a soporte (correo o WhatsApp, ver página de ayuda) con la pregunta de `docs/pagos/plan-b-proveedores.md` sección 3 y guardar la respuesta en `docs/proveedores/evidencia/recurrente-respuesta.md`.
2. Abrir cuenta comercial (4.5 %), no personal (5.25 %), y declarar los dos productos con descripción honesta: contenido personalizado generado con IA a partir de fotos de la familia, y llamada con voz sintética a un niño pedida por su padre.
3. Mantener el índice de fraude y contracargos por debajo de 0.5 % (alerta interna); el tope contractual es 0.9 %. Con reembolso automático a 7 días, `metricas` debe separar reembolsos voluntarios de contracargos.
4. Cobrar en USD (la moneda de los precios publicados) y dejar que el banco emisor convierta para clientes de Reino Unido, España y México. No hay precios fijos por país.
5. `arquitecto`: Apple Pay y Google Pay deben quedar como `[no verificado]` en el adaptador hasta confirmarlos.

## No verificado

- Apple Pay y Google Pay.
- Si un producto con subida de fotos de menores merece una revisión adicional del procesador.
- Quién emite factura por la comisión de Recurrente.
- Fecha de la lista de giros prohibidos y de la política de privacidad.
