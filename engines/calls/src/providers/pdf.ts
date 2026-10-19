/**
 * PDF rendering. The certificate is authored as HTML (for the real renderer) and as plain lines (for the built-in
 * renderer, which needs no dependency). PDF_RENDER_URL switches to an external HTML-to-PDF service.
 */
export interface PdfInput {
  html: string;
  title: string;
  lines: string[];
}
export interface PdfRenderer {
  readonly name: string;
  render(input: PdfInput): Promise<Uint8Array>;
}

const latin1 = (s: string) => s.replace(/[^\x20-\x7e\xa0-\xff]/g, "?");
const pdfEscape = (s: string) => latin1(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

/** Minimal valid one-page PDF (A4, Helvetica, WinAnsi) from lines of text. */
export class BuiltinPdfRenderer implements PdfRenderer {
  readonly name = "builtin";
  async render({ title, lines }: PdfInput): Promise<Uint8Array> {
    const content: string[] = ["BT"];
    let y = 780;
    const emit = (text: string, size: number, gap: number) => {
      content.push(`/F1 ${size} Tf`, `1 0 0 1 56 ${y} Tm`, `(${pdfEscape(text)}) Tj`);
      y -= gap;
    };
    emit(title, 22, 40);
    for (const line of lines) {
      // Naive wrap at ~85 characters.
      const words = line.split(" ");
      let cur = "";
      for (const w of words) {
        if ((cur + " " + w).trim().length > 85) {
          emit(cur, 12, 18);
          cur = w;
        } else cur = (cur + " " + w).trim();
      }
      emit(cur, 12, 24);
    }
    content.push("ET");
    const stream = content.join("\n");
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
      `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`,
    ];
    let out = "%PDF-1.4\n";
    const offsets: number[] = [];
    objects.forEach((o, i) => {
      offsets.push(Buffer.byteLength(out, "latin1"));
      out += `${i + 1} 0 obj\n${o}\nendobj\n`;
    });
    const xref = Buffer.byteLength(out, "latin1");
    out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const off of offsets) out += `${String(off).padStart(10, "0")} 00000 n \n`;
    out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return new Uint8Array(Buffer.from(out, "latin1"));
  }
}

/** External HTML-to-PDF service (e.g. a Browserless or self-hosted Chromium endpoint). Contract: POST {html} -> application/pdf. */
export class RemotePdfRenderer implements PdfRenderer {
  readonly name = "remote";
  constructor(private readonly url: string, private readonly token?: string, private readonly fetchFn: typeof fetch = fetch) {}
  async render({ html }: PdfInput): Promise<Uint8Array> {
    const res = await this.fetchFn(this.url, {
      method: "POST",
      headers: { "content-type": "application/json", ...(this.token ? { authorization: `Bearer ${this.token}` } : {}) },
      body: JSON.stringify({ html }),
    });
    if (!res.ok) throw new Error(`PDF service ${res.status}`);
    return new Uint8Array(await res.arrayBuffer());
  }
}
