import type { ReactNode } from "react";

/** Minimal Markdown for our own legal documents: headings, paragraphs, bullet lists, tables, **bold**. No raw HTML ever. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part));
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (!line.trim()) { i++; continue; }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1]!.length;
      const cls = level === 1 ? "mt-2 font-display text-3xl font-bold" : level === 2 ? "mt-8 font-display text-2xl font-bold" : "mt-6 text-lg font-bold";
      out.push(level === 1 ? <h1 key={key++} className={cls}>{inline(h[2]!)}</h1> : level === 2 ? <h2 key={key++} className={cls}>{inline(h[2]!)}</h2> : <h3 key={key++} className={cls}>{inline(h[2]!)}</h3>);
      i++; continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i]!.startsWith("|")) {
        const cells = lines[i]!.split("|").slice(1, -1).map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      out.push(
        <div key={key++} className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <thead><tr>{head!.map((c, j) => (<th key={j} className="border-b-2 border-night-700/30 py-2 pr-3 font-bold">{inline(c)}</th>))}</tr></thead>
            <tbody>{body.map((r, a) => (<tr key={a}>{r.map((c, b) => (<td key={b} className="border-b border-night-700/15 py-2 pr-3 align-top">{inline(c)}</td>))}</tr>))}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i]!)) { items.push(lines[i]!.replace(/^\s*[-*]\s+/, "")); i++; }
      out.push(<ul key={key++} className="mt-2 list-disc space-y-1 pl-6">{items.map((t, j) => (<li key={j}>{inline(t)}</li>))}</ul>);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i]!.trim() && !/^(#{1,3}\s|\||\s*[-*]\s)/.test(lines[i]!)) { para.push(lines[i]!); i++; }
    out.push(<p key={key++} className="mt-3">{inline(para.join(" "))}</p>);
  }
  return <>{out}</>;
}
