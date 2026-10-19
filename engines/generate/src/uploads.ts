import type { Storage } from "@lumen/calls";

/**
 * Private store for the buyers' photos. Prefers its own bucket (`uploads`, created in Supabase by Juan); if that bucket does not
 * exist yet, it falls back to the main private bucket under the `uploads/` prefix so the flow keeps working. Never public.
 */
export class UploadsStorage implements Storage {
  readonly name: string;
  private useFallback = false;
  constructor(private readonly primary: Storage, private readonly fallback: Storage | null) {
    this.name = `uploads(${primary.name})`;
  }
  private fb(path: string) {
    return `uploads/${path}`;
  }
  async put(path: string, bytes: Uint8Array, contentType: string): Promise<void> {
    if (!this.useFallback) {
      try {
        await this.primary.put(path, bytes, contentType);
        return;
      } catch (err) {
        if (!this.fallback) throw err;
        this.useFallback = true;
        console.warn("[generate] uploads bucket unavailable; using the main bucket under uploads/");
      }
    }
    await this.fallback!.put(this.fb(path), bytes, contentType);
  }
  async get(path: string) {
    if (!this.useFallback) {
      const r = await this.primary.get(path);
      if (r) return r;
    }
    return this.fallback ? this.fallback.get(this.fb(path)) : null;
  }
  async delete(path: string): Promise<void> {
    await this.primary.delete(path).catch(() => undefined);
    if (this.fallback) await this.fallback.delete(this.fb(path)).catch(() => undefined);
  }
}
