// Static generator for snoochie-soft.github.io. No dependencies (Node 20+).
//
//   node tools/build.mjs
//
// Reads content/catalogue.json (facts, paths, links) and content/<lang>.json (all copy) and
// writes, for every language in LANGS_BUILT (tools/build-langs.mjs): the home page and every
// app page (English at the site root, other languages under /<dir>/, e.g. /pl/, /pt-br/),
// plus 404.html and sitemap.xml.
//
// Options (for dry runs; the defaults build the real site in place):
//   --content <dir>   read catalogue.json and <lang>.json from <dir> instead of content/
//   --out <dir>       write the output into <dir> instead of the repository root
//   --langs en,xx     override LANGS_BUILT
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homePage, appPage, notFoundPage, pageDir } from "./templates.mjs";
import { LANGS_BUILT as DEFAULT_LANGS } from "./build-langs.mjs";

const BUILD_DATE = process.env.BUILD_DATE || "2026-11-05";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const arg = (name) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : null; };
const CONTENT = resolve(ROOT, arg("--content") || "content");
const OUT = resolve(ROOT, arg("--out") || ".");
const LANGS_BUILT = arg("--langs") ? arg("--langs").split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_LANGS;

const readJson = (p) => JSON.parse(readFileSync(resolve(CONTENT, p), "utf8"));
const cat = readJson("catalogue.json");

if (LANGS_BUILT[0] !== "en") throw new Error("English must be the first built language (it is x-default).");
for (const l of LANGS_BUILT) {
  if (/^ru(-|$)/i.test(l)) throw new Error("Russian is never built.");
  if (!cat.languages[l]) throw new Error(`Unknown language "${l}" (add it to catalogue.json "languages")`);
  if (!existsSync(resolve(CONTENT, `${l}.json`))) throw new Error(`Missing ${l}.json in ${CONTENT}`);
}
const langs = Object.fromEntries(LANGS_BUILT.map((l) => [l, readJson(`${l}.json`)]));

// Every app needs its copy in every built language before anything is written.
for (const l of LANGS_BUILT) for (const a of cat.apps) {
  if (!langs[l].apps || !langs[l].apps[a.id]) throw new Error(`${l}.json is missing apps.${a.id}`);
}

const written = [];
function write(rel, html) {
  const out = resolve(OUT, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  written.push(rel);
}
const rootFor = (dir) => "../".repeat(dir.split("/").filter(Boolean).length);

const pageUrls = [];
for (const lang of LANGS_BUILT) {
  // OG cards are rendered per language by tools/og.mjs; until they exist, use the English card.
  const ogLang = existsSync(resolve(ROOT, `img/og/home-${lang}.jpg`)) ? lang : "en";
  const base = { lang, ogLang, t: langs[lang], langs, cat, built: LANGS_BUILT };
  const homeDir = pageDir(cat, lang, "home");
  write(homeDir + "index.html", homePage({ ...base, key: "home", dir: homeDir, root: rootFor(homeDir) }));
  pageUrls.push(homeDir);
  for (const app of cat.apps) {
    const dir = pageDir(cat, lang, app.id);
    write(dir + "index.html", appPage({ ...base, key: app.id, dir, root: rootFor(dir) }, app));
    pageUrls.push(dir);
  }
}

// 404 is served from any depth, so it uses root-absolute paths. English only.
write("404.html", notFoundPage({ lang: "en", ogLang: "en", t: langs.en, langs, cat, built: LANGS_BUILT, key: "404", dir: "", root: "/" }));

// Sitemap: generated pages (all built languages) plus hand-made legal pages that exist.
const extra = cat.sitemapExtra.filter((p) => existsSync(resolve(ROOT, p, "index.html")));
const urls = [...new Set([...pageUrls, ...extra])];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${cat.site.origin}/${u}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;
write("sitemap.xml", sitemap);

console.log(`Built ${LANGS_BUILT.join(", ")} into ${OUT}:\n  ${written.join("\n  ")}`);
