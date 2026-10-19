# Limite de 12 funciones en Vercel Hobby

Regla: un deployment en el plan Hobby admite como maximo **12 Serverless Functions**. Superarlo falla el deploy
(`exceeded_serverless_functions_per_deployment`) aunque el build termine bien. Pasar a Pro es gasto fijo y no esta aprobado.

## Causa del incidente (desde 82d2bf0)
Cada `app/api/**/route.ts` es una funcion, y las paginas dinamicas se agrupan solo si comparten configuracion. Con 22 rutas API
y distintos `maxDuration` (30/60/300) el build produjo 34 funciones.

## Diseno actual (3 funciones)
- **Todas** las APIs viven detras de un unico `src/app/api/[...path]/route.ts` (runtime nodejs, dynamic force-dynamic, maxDuration 300).
  Despacha por tabla en `src/server/dispatch.ts` a los handlers de `src/server/api/<nombre>.ts`. Las URLs publicas no cambian
  (Twilio, ElevenLabs tools, webhooks de pago, Inngest, cron).
- Las paginas no declaran `runtime`/`maxDuration`/`preferredRegion`, asi que Vercel las agrupa en una sola funcion.

## Como anadir una ruta sin crear funciones nuevas
1. Crear `src/server/api/<nombre>.ts` exportando `GET`/`POST`/... con firma `(req: Request, ctx)`. No exportar `runtime`, `dynamic` ni `maxDuration`.
2. Registrar una fila en `API_ROUTES` de `src/server/dispatch.ts` (`:param` para segmentos dinamicos).
3. Nunca crear otro `route.ts` bajo `app/api`, ni exportar `maxDuration`/`runtime`/`preferredRegion`/`regions` en paginas: cada combinacion nueva crea otra funcion.
4. Si una ruta necesita mas de 300 s o otra region, hay que decidirlo con el arquitecto: cuesta una funcion del presupuesto.
5. Crons: `vercel.json` (Hobby: max 2 crons, una vez al dia).

## Verificacion
- `npm test` (tests/vercel-functions.test.ts): solo existe el catch-all, cada handler esta registrado, sin config de funcion suelta.
- `npx vercel build && npm run check:functions`: cuenta los directorios `*.func` reales (los symlinks no cuentan) y falla si > 12.
