import { Inngest } from "inngest";
import type { CallsEngine } from "./engine";
import type { Dispatcher } from "./deps";

/**
 * Inngest wiring (scheduler with queue). The decision logic lives in `CallsEngine` (tested without Inngest);
 * these functions only add durable waiting: sleep until the window, queue when the cap is full, wait for the call to end.
 *
 * Concurrency: the hard cap (CALLS_MAX_CONCURRENCY, default 20 = ElevenLabs Pro) is enforced by the database gate
 * `reserve_call_slot`, because a call lasts minutes and Inngest concurrency only counts steps that are running.
 * The function-level limit below only throttles how many orders try to dial at the same instant.
 */
export const inngest = new Inngest({ id: "lumen-labs" });

export class InngestDispatcher implements Dispatcher {
  async send(name: "order/scheduled" | "call/ended" | "call/retry", data: Record<string, unknown>): Promise<void> {
    await inngest.send({ name, data });
  }
}

const asDate = (v: unknown): Date => new Date(v as string);

export function createInngestFunctions(engine: CallsEngine) {
  const maxCall = engine.deps.product.maxCallSeconds;

  const orderScheduled = inngest.createFunction(
    { id: "order-scheduled", concurrency: { limit: engine.deps.maxConcurrency }, retries: 3 },
    { event: "order/scheduled" },
    async ({ event, step }) => {
      const orderId = event.data.orderId as string;
      await step.sleepUntil("wait-for-window", asDate(event.data.windowStart));
      for (let i = 0; i < 400; i++) {
        const out = await step.run(`attempt-${i}`, () => engine.attemptCall(orderId));
        if (out.kind === "sleep") {
          await step.sleepUntil(`sleep-${i}`, asDate(out.until));
        } else if (out.kind === "queued") {
          await step.sleepUntil(`queue-${i}`, asDate(out.retryAt));
        } else if (out.kind === "placed") {
          // Wait for the end of this attempt; the loop then decides retry (15 min gap), done or refund.
          await step.waitForEvent(`call-ended-${i}`, {
            event: "call/ended",
            timeout: `${maxCall + 300}s`,
            if: `async.data.callId == "${out.callId}"`,
          });
        } else {
          return out;
        }
      }
      return { kind: "gave_up" };
    },
  );

  const callEnded = inngest.createFunction({ id: "call-ended", retries: 5 }, { event: "call/ended" }, async ({ event, step }) => {
    const callId = event.data.callId as string;
    let out = await step.run("after-call", () => engine.afterCall(callId));
    for (let n = 0; out.kind === "recording_pending" && n < 10; n++) {
      await step.sleepUntil(`wait-recording-${n}`, asDate(out.retryAt));
      out = await step.run(`after-call-${n}`, () => engine.afterCall(callId));
    }
    return out;
  });

  const retention = inngest.createFunction({ id: "retention-cron" }, { cron: "0 3 * * *" }, async ({ step }) => step.run("purge", () => engine.retention.run()));

  const sweep = inngest.createFunction({ id: "sweep-stuck-calls" }, { cron: "*/5 * * * *" }, async ({ step }) => step.run("sweep", () => engine.sweepStuckCalls()));

  return [orderScheduled, callEnded, retention, sweep];
}
