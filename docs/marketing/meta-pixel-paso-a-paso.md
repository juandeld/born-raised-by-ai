# Meta Pixel y API de Conversiones: paso a paso (Juan)

Responsable: metricas + arquitecto · 19-oct-2026 · Costo: $0 (el Pixel es gratis; el gasto en anuncios sigue siendo decision aparte, D1).

El codigo esta en el repo y apagado: sin `META_PIXEL_ID` no se pide ningun script a Meta y no se guarda nada.

## 1. Crear el Pixel (10 min)

1. Entra a https://business.facebook.com con la cuenta de Lumen Labs (si no existe el portafolio comercial, crealo en el primer acceso).
2. Events Manager: https://business.facebook.com/events_manager2 > Connect data sources > Web > Meta Pixel. Nombre: `Jinglo`. Salta la configuracion automatica de sitio (nuestro codigo ya emite los eventos).
3. Copia el ID del Pixel (numero de 15 o 16 digitos). Eso es `META_PIXEL_ID`.

## 2. Token de la API de Conversiones

1. En Events Manager > tu Pixel > Settings > Conversions API > Generate access token.
2. Copialo una vez. Eso es `META_CAPI_TOKEN`. No lo pegues en el repo ni en el chat.
3. Para pruebas: Events Manager > Test events muestra un codigo tipo `TEST12345`. Eso es `META_TEST_EVENT_CODE` (solo mientras pruebas; quitalo despues, porque los eventos con ese codigo no cuentan para anuncios).

## 3. Variables en Vercel (Production)

| Variable | Valor | Obligatoria |
|---|---|---|
| `META_PIXEL_ID` | ID del paso 1 | si |
| `META_CAPI_TOKEN` | token del paso 2 | no, pero sin el no hay respaldo servidor (se pierden las compras de navegadores con bloqueadores) |
| `META_TEST_EVENT_CODE` | codigo de Test events | solo en pruebas |
| `META_API_VERSION` | solo si Meta retira `v23.0` | no |

La capa de pagina es estatica: hay que hacer redeploy despues de poner o cambiar `META_PIXEL_ID`.

## 4. Verificar (10 min)

1. Con `META_TEST_EVENT_CODE` puesto, abre el sitio en una ventana nueva, acepta el aviso de cookies.
2. En Events Manager > Test events deben aparecer, en este orden mientras navegas y compras: `PageView`, `ViewContent` (portada), `InitiateCheckout` (al pulsar pagar), `Purchase` (pagina de confirmacion, solo pedidos reales; los de prueba no se envian).
3. Cada evento debe verse dos veces de origen (Navegador y Servidor) pero contarse una: el `event_id` es el mismo y Meta lo deduplica. Si aparece duplicado, avisame.
4. Cada evento lleva `cr` (id completo del creativo del experimento) y `exp` (experimento). Se ven en el detalle del evento. Sirven para comparar creativos en el reporte del lunes.
5. Quita `META_TEST_EVENT_CODE` y redeploy.

## 5. Que se envia y que no

- Se envia: tipo de evento, URL, valor y moneda en InitiateCheckout y Purchase, `cr` y `exp`, IP y navegador (los pide la API de servidor), y el correo del comprador **solo en Purchase y solo como hash SHA-256**.
- Nunca se envia: nombre o edad del nino, texto libre, telefono, voz, contenido de la llamada.

## 6. Consentimiento (ya implementado)

- Mexico (`/es`): aviso con "No, gracias" visible; si no se rechaza, se carga (consentimiento tacito, LFPDPPP).
- Espana, Reino Unido y EE. UU. (`/es-es`, `/en`): el Pixel no se carga hasta pulsar "Aceptar".
- El enlace "Cookies" del pie permite cambiar la decision. Se guarda en el navegador (`jl_consent`).
- La politica de privacidad ya menciona el Pixel (seccion 11 es/en, punto 7 es-ES).

## 7. Pendientes que no puedo cerrar yo

- Legal: la politica nombra a Meta como plataforma de anuncios. D23 prohibe nombrar proveedores de IA, no de anuncios; legal-compliance debe confirmarlo por escrito. Para ES y UK falta la revision de corresponsabilidad (RGPD art. 26) antes de activar anuncios ahi: mientras tanto, solo MX.
- La version `v23.0` de la API no se pudo verificar (la pagina de Meta estaba bloqueada para mi herramienta). Si Events Manager muestra errores de version, define `META_API_VERSION` con la que indique Meta.
- Los anuncios para menores o dirigidos a ellos estan restringidos por Meta: segmentar siempre a adultos (padres, abuelos). Va en el brief de campana.
