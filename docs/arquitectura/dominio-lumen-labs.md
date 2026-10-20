# Dominio lumen-labs.co: DNS en Vercel y correo verificado en Resend

arquitecto · 19-oct-2026 · Estado: **Resend VERIFICADO**; `RESEND_FROM` actualizado en Vercel. Gasto: 0.

## Resultado

- Dominio en Resend (`c0e34e4d-9a54-44ee-ba95-3b42d9ff0ca1`): `verified` (DKIM, SPF en MX y TXT de `send`, CNAME `rsend`: los cuatro en verde).
- Variable de produccion y preview `RESEND_FROM` del proyecto `born-raised-by-ai-4ta9` = `Jinglo <hola@lumen-labs.co>`. Una variable nueva solo aplica a despliegues posteriores: el proximo push a main la toma.
- No se envio ningun correo de prueba (accion hacia afuera sin pedirla). Probar tras el despliegue con una compra de sandbox.

## Causa del bloqueo y arreglo

Los servidores de nombres de `lumen-labs.co` ya apuntaban a Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`), pero el dominio estaba en Vercel como externo y **sin zona DNS**: crear registros devolvia error. Un dominio externo con NS de Vercel no recibe zona automatica.

Arreglo (API REST de Vercel, el MCP daba 403 por alcance de equipo):

```
PATCH /v3/domains/lumen-labs.co?teamId=<equipo>
{"op":"update","zone":true}
```

Despues se crearon los 5 registros que pide Resend (valores de `GET /domains/<id>` de Resend):

| Nombre | Tipo | Valor | Nota |
|---|---|---|---|
| `resend._domainkey` | TXT | clave DKIM publica `p=MIGf...` | la lee Resend; no es secreto |
| `send` | MX (prioridad 10) | `feedback-smtp.us-east-1.amazonses.com` | rebotes |
| `send` | TXT | `v=spf1 include:amazonses.com ~all` | SPF |
| `rsend` | CNAME | `send.forge.rmta.net` | seguimiento de Resend |
| `_dmarc` | TXT | `v=DMARC1; p=none;` | solo monitoreo |

Tras la propagacion, `POST /domains/<id>/verify` en Resend dio `verified` en menos de un minuto de reintentos. Nota operativa: Cloudflare (delante de Resend) bloquea el cliente HTTP por defecto de Python (error 1010); usar `curl` con un User-Agent.

## Pendientes

1. DMARC en `p=none`: sin proteccion contra suplantacion. Subir a `p=quarantine` tras 2 semanas sin fallos y anadir `rua=mailto:` a un buzon de reportes (necesita buzon de Juan). Decision de legal-compliance y arquitecto, no urgente.
2. El dominio raiz y `www` no apuntan a ningun proyecto de Vercel (no se crearon registros A/CNAME para el sitio: la web de Jinglo tendra su propio dominio, D19). `hola@lumen-labs.co` solo ENVIA; para RECIBIR respuestas hace falta un MX en la raiz o `Reply-To` a un correo existente. Hoy los correos no deben prometer que ese buzon se lee: usar `Reply-To` a un buzon real de Juan (accion de Juan) o `soporte` automatico.
3. Textos al cliente: el remitente dice "Jinglo", pero D20 y legal piden que se nombre "Jinglo, un producto de Lumen Labs" en el pie del correo; el dominio `lumen-labs.co` ya respalda esa frase. Pendiente de legal (bloqueo 2 en `aprobacion-jinglo.md`).

## Plan B (no hizo falta; se deja por si la zona se pierde)

Si Vercel dejara de aceptar la zona: (1) en GoDaddy volver a poner los NS originales del dominio; (2) en GoDaddy > DNS, agregar a mano los 5 registros de la tabla (el DKIM completo se copia del panel de Resend: Domains > lumen-labs.co); (3) en Resend pulsar "Verify DNS Records"; (4) la verificacion tarda de minutos a 72 h segun el proveedor. Los registros de Vercel no se tocan.
