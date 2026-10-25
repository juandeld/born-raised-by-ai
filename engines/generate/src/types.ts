import type { AgeBand, ImageProviderName } from "@lumen/config";

export type ImageQuality = "low" | "medium" | "high";

export interface RefImage {
  bytes: Uint8Array;
  mime: "image/png" | "image/jpeg" | "image/webp";
}

/** What the mock provider needs to draw something sensible; real providers ignore it. */
export interface MockHints {
  /** Short English roles of the people in the references, e.g. "girl, 6", "dog". */
  roles: string[];
  setting: string;
  seed: number;
}

export interface ImageRequest {
  prompt: string;
  /** Portrait 2:3 (1024x1536) for pages, square (1024x1024) for characters. */
  width: number;
  height: number;
  quality: ImageQuality;
  /** Reference images (photo for a character, characters for a scene). Empty = text-to-image. */
  refs: RefImage[];
  /** Model for THIS request when it differs from the provider's own (COLOREAR_CHARACTER_MODEL for the character step). Providers that cannot switch ignore it. */
  model?: string;
  kind: "character" | "scene" | "cover";
  ageBand: AgeBand;
  hints: MockHints;
}

export interface GeneratedImage {
  format: "png" | "svg";
  bytes: Uint8Array;
  /** Cost in USD cents (fractions allowed): from the API `usage` when reported, else a list-price estimate. */
  costUsdCents: number;
  costSource: "usage" | "estimate" | "free";
}

export type ProviderErrorKind = "rate_limit" | "moderation" | "auth" | "server" | "bad_output" | "config";

export class ImageProviderError extends Error {
  constructor(message: string, readonly kind: ProviderErrorKind, readonly retryAfterMs?: number) {
    super(message);
  }
}

/** Interchangeable image backend (D15). Switch with IMAGE_PROVIDER=openai|nanobanana|mock. One method: refs decide edit vs generate. */
export interface ImageProvider {
  readonly name: ImageProviderName;
  readonly model: string;
  render(req: ImageRequest): Promise<GeneratedImage>;
}

export interface PersonInput {
  /** Name as the buyer typed it. Never leaves our infrastructure except inside the finished PDF and our emails. */
  name: string;
  /**
   * English descriptor of who it is, sent to the image and story prompts, never the name. For orders made with closed roles it is
   * derived from `roleId` at checkout ("the child's grandfather, an older man"); for older orders it is the buyer's free text ("niña, 6 años").
   */
  role: string;
  /** Closed role chosen with the buttons (absent in orders saved before closed roles). */
  roleId?: string;
  /** Sanitized short description of "other" (<= 30 characters), when given. */
  roleText?: string;
}

/** What the checkout receives per person: either a closed `roleId` (+ optional `roleText` for "other") or, for old clients, free text in `role`. */
export interface PersonSubmission {
  name: string;
  roleId?: string;
  roleText?: string;
  role?: string;
}

export interface StoryScene {
  n: number;
  /** Text under the drawing. Uses {1}..{5} tokens for the people; names are substituted locally. */
  text: string;
  /** People (1-based) who appear in the scene. */
  present: number[];
  /** English description of the drawing; uses {k} tokens for the people. */
  visual: string;
}

export interface Story {
  title: string;
  scenes: StoryScene[];
  /** Who wrote it: "anthropic" or "template". */
  writer: string;
  /** Scenes that could not pass the content filter and were replaced by a generic safe scene of the same theme (internal diagnostics, never shown). */
  repaired?: Array<{ n: number; reason: string }>;
}
