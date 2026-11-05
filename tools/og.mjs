// Open Graph cards (1200x630 JPG) for the home page and every app page, per built language.
// Renders small HTML cards with the site's own CSS and covers in headless Chrome.
// Usage: node tools/og.mjs   (run after node tools/build.mjs)
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { cover, esc } from "./templates.mjs";
import { LANGS_BUILT } from "./build-langs.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require("E:/tools/cdp/node_modules/playwright-core");
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cat = JSON.parse(readFileSync(resolve(ROOT, "content/catalogue.json"), "utf8"));
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2" };
const pages = new Map();
const server = createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (pages.has(p)) { res.writeHead(200, { "content-type": MIME[".html"] }); return res.end(pages.get(p)); }
  try { const b = await readFile(join(ROOT, p)); res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

const shell = (lang, body) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><link rel="stylesheet" href="/css/label.css">
<style>html,body{margin:0;width:1200px;height:630px;overflow:hidden;color-scheme:light}
:root{--ground:#d4f03c;--ink:#161a12;--ink-2:#2f3a1c;--pop:#d4f03c}
.og{position:relative;width:1200px;height:630px;background:#d4f03c;color:#161a12;padding:56px 64px;box-sizing:border-box}
.og .mark{display:flex;align-items:center;gap:14px;font:700 26px/1 var(--display)}
.og .mark img{width:56px;height:56px;border-radius:12px}
.og h1{font:900 76px/1 var(--display);letter-spacing:-.04em;margin:40px 0 0;max-width:700px}
.og .row{position:absolute;left:0;right:0;bottom:0;height:200px;background:#23271d;display:flex;gap:22px;padding:0 64px;align-items:flex-start}
.og .row .s{width:160px;height:160px;flex:none;margin-top:-80px;border-radius:4px;overflow:hidden;box-shadow:0 18px 30px -14px rgba(0,0,0,.6)}
.og .row .s .cover .ttl{--tsize:10cqi}
.og .big{position:absolute;right:64px;top:64px;width:500px;height:500px;border-radius:6px;overflow:hidden;box-shadow:0 30px 60px -24px rgba(14,16,10,.7)}
.og .big .cover .ttl{--tsize:7cqi}
.og.app h1{font-size:52px;line-height:1.04;max-width:500px;margin-top:22px}
.og.app>p{font:400 26px/1.35 var(--text);max-width:540px;margin:22px 0 0}
.og .cn{display:inline-block;font:600 18px/1 var(--mono);padding:9px 12px;border-radius:8px;background:#161a12;color:#d4f03c;margin-top:28px}
</style></head><body>${body}</body></html>`;

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await mkdir(resolve(ROOT, "img/og"), { recursive: true });
  for (const lang of LANGS_BUILT) {
    const t = JSON.parse(readFileSync(resolve(ROOT, `content/${lang}.json`), "utf8"));
    const ctx = { lang, t, cat, root: "/" };
    const jobs = [["home", `<div class="og"><div class="mark"><img src="/${cat.site.studioMark}" alt="">${esc(t.site.studio)}</div><h1>${esc(t.home.h1)}</h1>
      <div class="row">${cat.apps.map((a) => `<div class="s">${cover(ctx, a, { lazy: false })}</div>`).join("")}</div></div>`]];
    for (const a of cat.apps) {
      const at = t.apps[a.id];
      jobs.push([a.id, `<div class="og app"><div class="mark"><img src="/${cat.site.studioMark}" alt="">${esc(t.site.studio)}</div>
        <span class="cn">${a.no}</span><h1>${esc(at.name)}</h1><p>${esc(at.kind)}</p>
        <div class="big">${cover(ctx, a, { full: true, sticker: true, lazy: false })}</div></div>`]);
    }
    for (const [key, body] of jobs) {
      const path = `/__og/${key}-${lang}.html`;
      pages.set(path, shell(t.meta.lang, body));
      await page.goto(base + path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const out = resolve(ROOT, `img/og/${key}-${lang}.jpg`);
      await writeFile(out, await page.screenshot({ type: "jpeg", quality: 86 }));
      console.log(`img/og/${key}-${lang}.jpg`);
    }
  }
} finally {
  await browser.close();
  server.close();
}
