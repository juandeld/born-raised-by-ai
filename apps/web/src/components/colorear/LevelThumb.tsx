/**
 * Thumbnail of each detail level in the form. The first three levels reuse the real sample drawings of the landing (the current
 * style of the book); the two finer levels have no real sample yet, so they show a plain line swatch of the KIND of pattern
 * (waves, bricks and clouds / mandala) with the caption saying it is not a page of the book. Replace with real pages once
 * `scripts/colorear-levels.ts` has run in production.
 */
const SAMPLES = ["/colorear/sample-1.webp", "/colorear/sample-2.webp", "/colorear/sample-3.webp"];

export function LevelThumb({ index, sample, patternSample }: { index: number; sample: string; patternSample: string }) {
  const box = "h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-lapiz-line bg-white";
  if (index < SAMPLES.length) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={SAMPLES[index]} alt={sample} width={72} height={72} loading="lazy" className={`${box} object-cover`} />;
  }
  const petals = Array.from({ length: 12 }, (_, k) => k * 30);
  return (
    <svg role="img" aria-label={patternSample} viewBox="0 0 72 72" className={box} fill="none" stroke="#1b1b1b" strokeWidth={index === 4 ? 0.9 : 1.4} strokeLinecap="round">
      {index === 3 ? (
        <g>
          <path d="M4 20c6-8 14-8 20 0s14 8 20 0 14-8 24 0" />
          <path d="M4 32c6-8 14-8 20 0s14 8 20 0 14-8 24 0" />
          <path d="M8 46h56M8 56h56M8 66h56M20 46v10M44 46v10M32 56v10M56 56v10" />
          <path d="M10 10c0-4 6-4 6 0 0-4 7-4 7 0" />
        </g>
      ) : (
        <g transform="translate(36 36)">
          {petals.map((a) => <ellipse key={a} cx="0" cy="-19" rx="4.200" ry="9" transform={`rotate(${a})`} />)}
          {petals.map((a) => <path key={`l${a}`} d="M0 -9 0 -26" transform={`rotate(${a + 15})`} />)}
          <circle r="9" /><circle r="5" /><circle r="2" />
          <circle r="32" strokeDasharray="1 3" />
        </g>
      )}
    </svg>
  );
}
