import type { CallRow, ConsentRow, DeliveryRow, EventRowDb, OrderRow, SuppressionRow } from "./types";

export type Cond<V> = V | null | { lt?: V; lte?: V; gt?: V; gte?: V; in?: V[]; isNull?: boolean; notNull?: boolean };
export type Filter<T> = { [K in keyof T]?: Cond<T[K]> };

export interface Table<T> {
  insert(row: Partial<T>): Promise<T>;
  get(id: string): Promise<T | null>;
  find(filter?: Filter<T>, opts?: { orderBy?: keyof T & string; desc?: boolean; limit?: number }): Promise<T[]>;
  update(id: string, patch: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface Db {
  readonly kind: "memory" | "supabase";
  orders: Table<OrderRow>;
  consents: Table<ConsentRow>;
  suppression: Table<SuppressionRow>;
  calls: Table<CallRow>;
  deliveries: Table<DeliveryRow>;
  events: Table<EventRowDb>;
  /** Atomic concurrency gate: true if the call got a slot (moves it from dialing to prelude). */
  reserveCallSlot(callId: string, max: number): Promise<boolean>;
  /** Calls currently using a slot (for estimating queue wait). */
  countActiveCalls(): Promise<number>;
}
