import type { Db, Filter, Table } from "./db";

type Rec = Record<string, any>;

/** Minimal Supabase PostgREST client (fetch only, no SDK). Server-side with the service role key. */
export class PostgrestClient {
  constructor(
    private readonly url: string,
    private readonly serviceKey: string,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  headers(extra: Record<string, string> = {}): Record<string, string> {
    return { apikey: this.serviceKey, authorization: `Bearer ${this.serviceKey}`, "content-type": "application/json", ...extra };
  }

  async request(path: string, init: RequestInit & { prefer?: string } = {}): Promise<any> {
    const { prefer, ...rest } = init;
    const res = await this.fetchFn(`${this.url}/rest/v1/${path}`, {
      ...rest,
      headers: this.headers({ ...(prefer ? { prefer } : {}), ...((rest.headers as Record<string, string>) ?? {}) }),
    });
    if (!res.ok) throw new Error(`Supabase ${res.status} on ${path}: ${await res.text()}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }
}

export function encodeFilter(filter: Rec): string[] {
  const parts: string[] = [];
  for (const [key, cond] of Object.entries(filter)) {
    if (cond === undefined) continue;
    if (cond === null) parts.push(`${key}=is.null`);
    else if (typeof cond === "object" && !Array.isArray(cond)) {
      const c = cond as Rec;
      for (const op of ["lt", "lte", "gt", "gte"]) if (op in c) parts.push(`${key}=${op}.${encodeURIComponent(String(c[op]))}`);
      if ("in" in c) parts.push(`${key}=in.(${(c.in as unknown[]).map((v) => encodeURIComponent(String(v))).join(",")})`);
      if (c.isNull) parts.push(`${key}=is.null`);
      if (c.notNull) parts.push(`${key}=not.is.null`);
    } else parts.push(`${key}=eq.${encodeURIComponent(String(cond))}`);
  }
  return parts;
}

class PostgrestTable<T extends Rec> implements Table<T> {
  constructor(private readonly c: PostgrestClient, private readonly table: string, private readonly pk: string) {}

  async insert(row: Partial<T>): Promise<T> {
    const out = await this.c.request(this.table, { method: "POST", body: JSON.stringify(row), prefer: "return=representation" });
    return out[0] as T;
  }
  async get(id: string): Promise<T | null> {
    const out = await this.c.request(`${this.table}?${this.pk}=eq.${encodeURIComponent(id)}&limit=1`);
    return (out[0] as T) ?? null;
  }
  async find(filter: Filter<T> = {}, opts: { orderBy?: string; desc?: boolean; limit?: number } = {}): Promise<T[]> {
    const q = encodeFilter(filter as Rec);
    if (opts.orderBy) q.push(`order=${opts.orderBy}.${opts.desc ? "desc" : "asc"}`);
    if (opts.limit) q.push(`limit=${opts.limit}`);
    return (await this.c.request(`${this.table}${q.length ? `?${q.join("&")}` : ""}`)) as T[];
  }
  async update(id: string, patch: Partial<T>): Promise<T> {
    const out = await this.c.request(`${this.table}?${this.pk}=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
      prefer: "return=representation",
    });
    if (!out[0]) throw new Error(`row not found ${this.table}/${id}`);
    return out[0] as T;
  }
  async delete(id: string): Promise<void> {
    await this.c.request(`${this.table}?${this.pk}=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  }
}

export function createSupabaseDb(url: string, serviceKey: string, fetchFn: typeof fetch = fetch): Db {
  const c = new PostgrestClient(url.replace(/\/$/, ""), serviceKey, fetchFn);
  return {
    kind: "supabase",
    orders: new PostgrestTable(c, "orders", "id"),
    consents: new PostgrestTable(c, "consents", "id"),
    suppression: new PostgrestTable(c, "suppression_list", "phone_e164_hash"),
    calls: new PostgrestTable(c, "calls", "id"),
    deliveries: new PostgrestTable(c, "deliveries", "id"),
    events: new PostgrestTable(c, "events", "id"),
    async reserveCallSlot(callId, max) {
      return Boolean(await c.request("rpc/reserve_call_slot", { method: "POST", body: JSON.stringify({ p_call_id: callId, p_max: max }) }));
    },
    async countActiveCalls() {
      const rows = (await c.request("calls?status=in.(prelude,in_progress)&select=id")) as unknown[];
      return rows.length;
    },
  };
}
