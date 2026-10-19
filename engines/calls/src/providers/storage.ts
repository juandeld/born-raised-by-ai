import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

/** Private object storage for MP3 and PDF. Files are never public: the web app streams them after checking the access token. */
export interface Storage {
  readonly name: string;
  put(path: string, bytes: Uint8Array, contentType: string): Promise<void>;
  get(path: string): Promise<{ bytes: Uint8Array; contentType: string } | null>;
  delete(path: string): Promise<void>;
}

export class MemoryStorage implements Storage {
  readonly name = "memory";
  readonly files = new Map<string, { bytes: Uint8Array; contentType: string }>();
  async put(path: string, bytes: Uint8Array, contentType: string) {
    this.files.set(path, { bytes, contentType });
  }
  async get(path: string) {
    return this.files.get(path) ?? null;
  }
  async delete(path: string) {
    this.files.delete(path);
  }
}

/** Dev storage on disk (shared between the web server and CLI scripts). */
export class FsStorage implements Storage {
  readonly name = "fs";
  constructor(private readonly root: string) {}
  private file(path: string) {
    const full = resolve(join(this.root, path));
    if (!full.startsWith(resolve(this.root))) throw new Error("path escapes storage root");
    return full;
  }
  async put(path: string, bytes: Uint8Array, contentType: string) {
    const f = this.file(path);
    await mkdir(dirname(f), { recursive: true });
    await writeFile(f, bytes);
    await writeFile(`${f}.type`, contentType);
  }
  async get(path: string) {
    try {
      const f = this.file(path);
      const bytes = new Uint8Array(await readFile(f));
      const contentType = await readFile(`${f}.type`, "utf8").catch(() => "application/octet-stream");
      return { bytes, contentType };
    } catch {
      return null;
    }
  }
  async delete(path: string) {
    const f = this.file(path);
    await rm(f, { force: true });
    await rm(`${f}.type`, { force: true });
  }
}

/** Supabase Storage through its REST API (private bucket, service role key). [no verificado] without an account. */
export class SupabaseStorage implements Storage {
  readonly name = "supabase";
  constructor(
    private readonly url: string,
    private readonly serviceKey: string,
    private readonly bucket = "deliveries",
    private readonly fetchFn: typeof fetch = fetch,
  ) {}
  private h(extra: Record<string, string> = {}) {
    return { apikey: this.serviceKey, authorization: `Bearer ${this.serviceKey}`, ...extra };
  }
  async put(path: string, bytes: Uint8Array, contentType: string) {
    const res = await this.fetchFn(`${this.url}/storage/v1/object/${this.bucket}/${path}`, {
      method: "POST",
      headers: this.h({ "content-type": contentType, "x-upsert": "true" }),
      body: bytes as unknown as BodyInit,
    });
    if (!res.ok) throw new Error(`Supabase storage put ${res.status}: ${await res.text()}`);
  }
  async get(path: string) {
    const res = await this.fetchFn(`${this.url}/storage/v1/object/${this.bucket}/${path}`, { headers: this.h() });
    if (!res.ok) return null;
    return { bytes: new Uint8Array(await res.arrayBuffer()), contentType: res.headers.get("content-type") ?? "application/octet-stream" };
  }
  async delete(path: string) {
    const res = await this.fetchFn(`${this.url}/storage/v1/object/${this.bucket}/${path}`, { method: "DELETE", headers: this.h() });
    if (!res.ok && res.status !== 404 && res.status !== 400) throw new Error(`Supabase storage delete ${res.status}`);
  }
}
