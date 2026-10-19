import type { Dispatcher } from "./deps";

/**
 * Inline dispatcher for mock mode and tests: "call/ended" is handled in-process. "order/scheduled" and "call/retry" do
 * nothing here: tests and the dev route call `engine.attemptCall` themselves, because the real flow waits for wall-clock time.
 */
export class InlineDispatcher implements Dispatcher {
  readonly log: Array<{ name: string; data: Record<string, unknown> }> = [];
  handlers: Partial<Record<"order/scheduled" | "call/ended" | "call/retry", (data: Record<string, unknown>) => Promise<unknown>>> = {};
  async send(name: "order/scheduled" | "call/ended" | "call/retry", data: Record<string, unknown>): Promise<void> {
    this.log.push({ name, data });
    await this.handlers[name]?.(data);
  }
}
