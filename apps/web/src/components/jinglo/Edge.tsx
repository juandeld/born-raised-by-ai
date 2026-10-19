/** Hand-cut paper edges (port of docs/diseno/jinglo/v2/build.py). Deterministic per seed so server and client render the same path. */
function rng(seed: number) {
  let a = seed * 2654435761 >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (v: number) => Math.round(v * 10) / 10;

function pathH(seed: number, n = 26): string {
  const r = rng(seed);
  const W = 1200;
  let x = 0;
  let d = `M0 34 L0 ${f(10 + r() * 10)} `;
  while (x < W) {
    const w = (W / n) * (0.6 + r() * 0.8);
    const y = 3 + r() * 20;
    d += `Q ${f(x + w / 2)} ${f(y - 8 - r() * 8)} ${f(x + w)} ${f(6 + r() * 16)} `;
    x += w;
  }
  return d + "L1200 34 Z";
}

function pathV(seed: number, n = 26): string {
  const r = rng(seed);
  const H = 1200;
  let y = 0;
  let d = "M0 0 ";
  while (y < H) {
    const h = (H / n) * (0.6 + r() * 0.8);
    const x = 3 + r() * 20;
    d += `Q ${f(x - 8 - r() * 8)} ${f(y + h / 2)} ${f(6 + r() * 16)} ${f(y + h)} `;
    y += h;
  }
  return d + `L0 ${H} Z`;
}

export function Edge({ seed, fill, cls }: { seed: number; fill: string; cls: "top" | "b" | "h" }) {
  return (
    <svg className={`edge ${cls}`} viewBox="0 0 1200 34" preserveAspectRatio="none" fill={fill} aria-hidden="true">
      <path d={pathH(seed)} />
    </svg>
  );
}

export function EdgeV({ seed, fill }: { seed: number; fill: string }) {
  return (
    <svg className="edge v" viewBox="0 0 34 1200" preserveAspectRatio="none" fill={fill} aria-hidden="true">
      <path d={pathV(seed)} />
    </svg>
  );
}
