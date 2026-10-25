"""
Runs apps/web/src/lib/photo-prep.ts in a real Chromium (Playwright for Python). Used by tests/colorear-photo-prep.test.ts.
usage: photo-prep-browser.py <bundle.js> <spec.json>   ->   prints a JSON list with one result per file of the spec.
spec: {"files": [{"path": "...", "opts": {...}, "shrinkTo": 200000}], "orient": [2, 3, 4, 5, 6, 7, 8], "width": 390}
"""
import json
import sys
from playwright.sync_api import sync_playwright

PAGE_JS = """
async ([opts, shrinkTo]) => {
  const f = document.getElementById('f').files[0];
  const t = performance.now();
  const look = async (blob) => {
    const bmp = await createImageBitmap(blob);
    const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height;
    const ctx = c.getContext('2d'); ctx.drawImage(bmp, 0, 0);
    const px = (x, y) => Array.from(ctx.getImageData(Math.min(bmp.width - 1, Math.floor(x * bmp.width)), Math.min(bmp.height - 1, Math.floor(y * bmp.height)), 1, 1).data).slice(0, 3);
    return { size: blob.size, type: blob.type, width: bmp.width, height: bmp.height, corners: { tl: px(.1, .1), tr: px(.9, .1), bl: px(.1, .9), br: px(.9, .9) } };
  };
  try {
    const blob = await PhotoPrep.preparePhoto(f, opts);
    const out = { ok: true, ms: Math.round(performance.now() - t), ...(await look(blob)) };
    if (shrinkTo) out.shrunk = await look(await PhotoPrep.shrinkPhoto(blob, shrinkTo));
    return out;
  } catch (e) {
    return { ok: false, code: e.code || null, message: String(e.message), ms: Math.round(performance.now() - t) };
  }
}
"""

ORIENT_JS = """
(o) => {
  const c = document.createElement('canvas'); c.width = 800; c.height = 400;
  const ctx = c.getContext('2d'); ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, 800, 400); ctx.fillStyle = '#e61e1e'; ctx.fillRect(0, 0, 400, 200);
  const r = PhotoPrep.orientCanvas(c, o);
  const x = r.getContext('2d');
  const px = (a, b) => Array.from(x.getImageData(Math.min(r.width - 1, Math.floor(a * r.width)), Math.min(r.height - 1, Math.floor(b * r.height)), 1, 1).data).slice(0, 3);
  return { ok: true, width: r.width, height: r.height, corners: { tl: px(.1, .1), tr: px(.9, .1), bl: px(.1, .9), br: px(.9, .9) } };
}
"""


def main():
    bundle, spec_path = sys.argv[1], sys.argv[2]
    spec = json.load(open(spec_path))
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": spec.get("width", 390), "height": 844})
        page.set_content("<input type=file id=f>")
        page.add_script_tag(path=bundle)
        for o in spec.get("orient", []):
            r = page.evaluate(ORIENT_JS, o)
            r["file"] = f"orient{o}"
            results.append(r)
        for item in spec["files"]:
            page.set_input_files("#f", item["path"])
            r = page.evaluate(PAGE_JS, [item.get("opts") or {}, item.get("shrinkTo")])
            r["file"] = item["path"].split("/")[-1]
            results.append(r)
        browser.close()
    print(json.dumps(results))

main()
