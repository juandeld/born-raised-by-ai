import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Cond, Db, Filter, Table } from "./db";

type Rec = Record<string, any>;

function matches(row: Rec, filter: Rec): boolean {
  for (const [key, cond] of Object.entries(filter)) {
    if (cond === undefined) continue;
    const v = row[key];
    if (cond === null) {
      if (v !== null && v !== undefined) return false;
    } else if (typeof cond === "object" && !Array.isArray(cond)) {
      const c = cond as Rec;
      if ("lt" in c && !(v !== null && v !== undefined && v < c.lt)) return false;
      if ("lte" in c && !(v !== null && v !== undefined && v <= c.lte)) return false;
      if ("gt" in c && !(v !== null && v !== undefined && v > c.gt)) return false;
      if ("gte" in c && !(v !== null && v !== undefined && v >= c.gte)) return false;
      if ("in" in c && !(c.in as unknown[]).includes(v)) return false;
      if (c.isNull && !(v === null || v === undefined)) return false;
      if (c.notNull && (v === null || v === undefined)) return false;
    } else if (v !== cond) {
      return false;
    }
  }
  return true;
}

class MemoryTable<T extends Rec> implements Table<T> {
  rows = new Map<string, T>();
  constructor(
    private readonly pk: string,
    private readonly defaults: () => Rec,
    private readonly persist: () => void,
    private readonly autoId = true,
  ) {}

  private seq = 0;

  async insert(row: Partial<T>): Promise<T> {
    const full: Rec = { ...this.defaults(), ...row };
    if (full[this.pk] === undefined) full[this.pk] = this.autoId ? randomUUID() : ++this.seq;
    const key = String(full[this.pk]);
    if (this.rows.has(key)) throw new Error(`duplicate key ${this.pk}=${key}`);
    this.rows.set(key, full as T);
    this.persist();
    return structuredClone(full) as T;
  }
  async get(id: string): Promise<T | null> {
    const r = this.rows.get(id);
    return r ? (structuredClone(r) as T) : null;
  }
  async find(filter: Filter<T> = {}, opts: { orderBy?: string; desc?: boolean; limit?: number } = {}): Promise<T[]> {
    let out = [...this.rows.values()].filter((r) => matches(r, filter as Rec));
    if (opts.orderBy) {
      const k = opts.orderBy;
      out.sort((a, b) => (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0));
      if (opts.desc) out.reverse();
    }
    if (opts.limit) out = out.slice(0, opts.limit);
    return out.map((r) => structuredClone(r) as T);
  }
  async update(id: string, patch: Partial<T>): Promise<T> {
    const r = this.rows.get(id);
    if (!r) throw new Error(`row not found ${id}`);
    Object.assign(r, patch);
    this.persist();
    return structuredClone(r) as T;
  }
  async delete(id: string): Promise<void> {
    this.rows.delete(id);
    this.persist();
  }
}

export interface MemoryDbOptions {
  /** Persist to a JSON file so separate processes (web dev server, `npm run costs`) share data. */
  file?: string;
}

const nowIso = () => new Date().toISOString();

export function createMemoryDb(opts: MemoryDbOptions = {}): Db {
  const tables: Record<string, MemoryTable<any>> = {};
  const persist = () => {
    if (!opts.file) return;
    mkdirSync(dirname(opts.file), { recursive: true });
    const dump: Rec = {};
    for (const [name, t] of Object.entries(tables)) dump[name] = [...t.rows.values()];
    writeFileSync(opts.file, JSON.stringify(dump));
  };
  tables.orders = new MemoryTable("id", () => ({ calls_included: 1, status: "created", test_mode: false, creative: "none", device: "unknown", created_at: nowIso() }), persist);
  tables.consents = new MemoryTable("id", () => ({}), persist);
  tables.suppression = new MemoryTable("phone_e164_hash", () => ({ created_at: nowIso() }), persist, false);
  tables.calls = new MemoryTable("id", () => ({ status: "dialing", state: {}, incidents: [], started_at: nowIso(), telephony_seconds: 0, agent_seconds: 0 }), persist);
  tables.deliveries = new MemoryTable("id", () => ({ sent_at: nowIso() }), persist);
  tables.events = new MemoryTable("id", () => ({ ts: nowIso(), test_mode: false, properties: {} }), persist, false);

  if (opts.file && existsSync(opts.file)) {
    try {
      const dump = JSON.parse(readFileSync(opts.file, "utf8")) as Rec;
      for (const [name, rows] of Object.entries(dump)) {
        const t = tables[name];
        if (!t) continue;
        for (const r of rows as Rec[]) t.rows.set(String(r[name === "suppression" ? "phone_e164_hash" : "id"]), r);
      }
      const maxEvent = Math.max(0, ...[...tables.events.rows.values()].map((r) => Number(r.id)));
      (tables.events as any).seq = maxEvent;
    } catch {
      // Corrupt mock file: start empty.
    }
  }

  const db: Db = {
    kind: "memory",
    orders: tables.orders,
    consents: tables.consents,
    suppression: tables.suppression,
    calls: tables.calls,
    deliveries: tables.deliveries,
    events: tables.events,
    async reserveCallSlot(callId, max) {
      // Single-threaded JS: the check and the update below are atomic.
      const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const active = [...tables.calls.rows.values()].filter(
        (c) => (c.status === "prelude" || c.status === "in_progress") && c.id !== callId && c.started_at > cutoff,
      ).length;
      if (active >= max) return false;
      const call = tables.calls.rows.get(callId);
      if (call && call.status === "dialing") {
        call.status = "prelude";
        persist();
      }
      return true;
    },
    async countActiveCalls() {
      return [...tables.calls.rows.values()].filter((c) => c.status === "prelude" || c.status === "in_progress").length;
    },
  };
  return db;
}

export type { Cond };
