import { createInngestFunctions, inngest } from "@lumen/calls";
import { serve } from "inngest/next";
import { getEngine } from "@/lib/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Handlers = ReturnType<typeof serve>;
let handlers: Handlers | undefined;
/** Built on first request so `next build` never touches the database. */
const h = (): Handlers => (handlers ??= serve({ client: inngest, functions: createInngestFunctions(getEngine()) }));

export const GET: Handlers["GET"] = (...a) => h().GET(...a);
export const POST: Handlers["POST"] = (...a) => h().POST(...a);
export const PUT: Handlers["PUT"] = (...a) => h().PUT(...a);
