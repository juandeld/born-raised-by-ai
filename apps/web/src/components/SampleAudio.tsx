import type { Copy } from "@/lib/copy";

/** Placeholder until the final voice exists (H2): same footprint as the real player so layout does not shift later. */
export function SampleAudio({ copy }: { copy: Copy }) {
  return (
    <section aria-labelledby="sample" className="container-narrow pt-10">
      <div className="rounded-3xl border border-night-700/15 bg-white p-5">
        <h2 id="sample" className="font-display text-2xl font-bold">{copy.sample.title}</h2>
        <div className="mt-3 flex items-center gap-4">
          <button type="button" disabled aria-label={copy.sample.play} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-night-900 text-gold-400 disabled:opacity-60">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          </button>
          <div className="flex-1">
            <div className="flex h-8 items-end gap-[3px]" aria-hidden>
              {Array.from({ length: 32 }, (_, i) => (
                <span key={i} className="w-full rounded-full bg-night-700/25" style={{ height: `${25 + ((i * 37) % 70)}%` }} />
              ))}
            </div>
            <p className="mt-2 text-sm text-night-900/70">{copy.sample.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
