import type { Story } from "./types";

/** Progress of one book. Lives in private storage at colorear/<orderId>/state.json; holds no names and no photos. */
export interface PageState {
  /** 0 = cover, 1..22 = scenes. */
  n: number;
  status: "pending" | "done" | "fallback";
  attempts: number;
  ext?: "png" | "svg";
}

export interface CharState {
  /** 1-based person number. */
  k: number;
  status: "pending" | "done" | "text_fallback";
  attempts: number;
  ext?: "png" | "svg";
}

export type Stage = "queued" | "characters" | "story" | "scenes" | "assemble" | "done" | "failed";

export interface GenState {
  v: 1;
  stage: Stage;
  provider: string;
  model: string;
  quality: string;
  startedAt: string;
  updatedAt: string;
  lease: { id: string; until: string } | null;
  costCents: number;
  calls: number;
  retries: number;
  characters: CharState[];
  story: Story | null;
  pages: PageState[];
  /** Customer-visible notes, e.g. a photo that could not be used. Keys are translated by the web app. */
  notes: string[];
  /** Internal diagnostics (never shown): why a page needed retries or fell back. No names, no photos. */
  issues?: string[];
  photosDeletedAt?: string;
  /** Which image provider actually drew this book (the mock can replace a real one under mock payments). */
  effectiveProvider?: string;
  failedReason?: string;
  pdfBytes?: number;
  doneAt?: string;
}

export const statePath = (orderId: string) => `colorear/${orderId}/state.json`;
export const charPath = (orderId: string, k: number, ext: string) => `colorear/${orderId}/char-${k}.${ext}`;
export const pagePath = (orderId: string, n: number, ext: string) => `colorear/${orderId}/page-${String(n).padStart(2, "0")}.${ext}`;
export const pdfPath = (orderId: string) => `colorear/${orderId}/book.pdf`;
export const photoPath = (orderId: string, k: number) => `orders/${orderId}/photo-${k}.jpg`;
