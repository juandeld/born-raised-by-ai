/**
 * Marketing experiments (D24, docs/marketing/experimentos-fase1.md).
 *
 * The experiment travels inside the existing `creative` property, so every funnel event (landing, cta_click,
 * checkout_started, paid, call_*, delivered) and the order itself carry it with no schema change:
 *
 *   creative = "<exp>.<ad>"   e.g. "e1.cara-a", "e2.lejos-b", "f0.familia"; "e3" alone when the link has no ad id.
 *
 * Read it back with `experimentOf(creative)` (group by it in PostHog / `metricas`).
 */
export const EXPERIMENTS = ["e1", "e2", "e3", "f0"] as const;
export type ExperimentId = (typeof EXPERIMENTS)[number];

const MAX_CREATIVE = 40;
const clean = (s: string) => s.replace(/[^\w.-]/g, "").slice(0, MAX_CREATIVE);

/** `?exp=` value to a known experiment id, or null. Case-insensitive; anything else is ignored. */
export function parseExperiment(raw: string | undefined | null): ExperimentId | null {
  const v = (raw ?? "").trim().toLowerCase();
  return (EXPERIMENTS as readonly string[]).includes(v) ? (v as ExperimentId) : null;
}

/** Folds the experiment into the creative id (<= 40 chars, charset \w.-). No experiment: the id is returned unchanged. */
export function tagCreative(exp: ExperimentId | null, creative: string | undefined | null): string {
  const cr = clean(creative ?? "");
  const has = cr !== "" && cr !== "none";
  if (!exp) return has ? cr : "none";
  if (!has) return exp;
  if (cr === exp || cr.startsWith(`${exp}.`)) return cr;
  return clean(`${exp}.${cr}`);
}

/** The experiment a (tagged) creative id belongs to, or null. */
export function experimentOf(creative: string | undefined | null): ExperimentId | null {
  const head = (creative ?? "").split(".")[0] ?? "";
  return parseExperiment(head);
}
