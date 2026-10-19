import type { Language } from "./types";
import type { PdfRenderer } from "./providers/pdf";

export interface CertificateData {
  language: Language;
  brand: string;
  character: string;
  childFirstName: string;
  callDateLocal: string;
  durationMinutes: number;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const COPY: Record<Language, { title: string; body: (d: CertificateData) => string[]; ai: string }> = {
  "es-419": {
    title: "Certificado de llamada",
    body: (d) => [`${d.character} llamó a ${d.childFirstName}.`, `Fecha de la llamada: ${d.callDateLocal}.`, `Duración aproximada: ${d.durationMinutes} min.`],
    ai: "La voz de esta llamada fue generada con inteligencia artificial por Lumen Labs. Es un recuerdo de fantasía, no un documento oficial.",
  },
  "es-ES": {
    title: "Certificado de llamada",
    body: (d) => [`${d.character} llamó a ${d.childFirstName}.`, `Fecha de la llamada: ${d.callDateLocal}.`, `Duración aproximada: ${d.durationMinutes} min.`],
    ai: "La voz de esta llamada fue generada con inteligencia artificial por Lumen Labs. Es un recuerdo de fantasía, no un documento oficial.",
  },
  en: {
    title: "Call certificate",
    body: (d) => [`${d.character} called ${d.childFirstName}.`, `Call date: ${d.callDateLocal}.`, `Approximate length: ${d.durationMinutes} min.`],
    ai: "The voice on this call was generated with artificial intelligence by Lumen Labs. A keepsake of make-believe, not an official document.",
  },
};

export function renderCertificateHtml(d: CertificateData): string {
  const c = COPY[d.language];
  return `<!doctype html><html lang="${d.language}"><head><meta charset="utf-8"><title>${esc(c.title)}</title>
<style>body{font-family:Georgia,serif;margin:0;padding:64px;color:#1b2a41;background:#fffaf0}
.card{border:6px double #b3202a;padding:48px;text-align:center}h1{font-size:40px;color:#b3202a;margin:0 0 24px}
p{font-size:20px;margin:12px 0}.ai{font-size:14px;color:#555;margin-top:32px}.brand{margin-top:40px;font-size:14px;letter-spacing:.1em}</style></head>
<body><div class="card"><h1>${esc(c.title)}</h1>${c.body(d).map((l) => `<p>${esc(l)}</p>`).join("")}<p class="ai">${esc(c.ai)}</p><p class="brand">${esc(d.brand)}</p></div></body></html>`;
}

export class Certificate {
  constructor(private readonly renderer: PdfRenderer) {}

  async render(d: CertificateData): Promise<{ html: string; pdf: Uint8Array }> {
    const c = COPY[d.language];
    const html = renderCertificateHtml(d);
    const pdf = await this.renderer.render({ html, title: c.title, lines: [...c.body(d), "", c.ai, "", d.brand] });
    return { html, pdf };
  }
}
