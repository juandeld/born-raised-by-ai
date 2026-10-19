# Planificador sin Inngest

Estado: implementado y probado con mocks (`tests/lifecycle.test.ts`, "tick"). Sin probar contra Vercel real.

## Qué hace
`GET|POST /api/cron/tick` ejecuta `engine.tick()`: (1) cierra llamadas colgadas, (2) termina la entrega de llamadas completadas cuya grabación aún no estaba lista, (3) marca los pedidos `scheduled` cuya ventana ya abrió (máximo 10 llamadas por pasada). Con `?retention=1` también corre la retención. Es idempotente: `attemptCall` rechaza un pedido con llamada en curso y la migración 0003 impide dos llamadas activas por pedido.
Si hay claves de Inngest responde 409 `inngest_active` y no hace nada (Inngest manda).

## Por qué dos disparadores
Vercel Hobby solo permite un cron diario. `apps/web/vercel.json` lo usa para la retención (`/api/cron/tick?retention=1`, 09:00 UTC). La llamada puntual necesita precisión de minutos, así que se añade un ping externo cada minuto.

## Pasos de Juan o del director (una vez)
1. Variable `CRON_SECRET` en Vercel (valor entregado por el director en el reporte). Redeploy.
2. Aplicar `packages/db/migrations/0003_one_active_call_per_order.sql` en Supabase (SQL Editor).
3. Ping cada minuto, opción A (recomendada, sin cuenta nueva) desde Supabase SQL Editor:
```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.schedule('santa-tick', '* * * * *', $$
  select net.http_get(
    url := 'https://born-raised-by-ai-4ta9.vercel.app/api/cron/tick',
    headers := jsonb_build_object('x-cron-secret', '<CRON_SECRET>')
  );
$$);
```
Opción B: cron-job.org, GET cada minuto a la misma URL con el encabezado `x-cron-secret`.
4. Comprobar: `curl -H "x-cron-secret: <CRON_SECRET>" <URL>/api/cron/tick` devuelve `{swept, recovered, attempts, errors}`. Sin el encabezado devuelve 401.

## Límites conocidos
- Los reintentos ("call/retry") no se programan a una hora exacta: el siguiente ping minuto a minuto los recoge porque el pedido sigue `scheduled` y dentro de su ventana.
- La espera de la grabación (hasta 40 s) sigue ocurriendo dentro del webhook de fin de llamada; si falla, el `recover` del tick la termina.
