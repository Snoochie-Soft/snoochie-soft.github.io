// Translations of the hand-made pages (home, app pages ported by hand, privacy, terms, /legal/).
// No dependencies (Node 20+).
//
//   node tools/i18n-pages.mjs extract          English text of every page -> content/pages/en/<id>.json
//   node tools/i18n-pages.mjs check <lang>     compare content/pages/<lang>/*.json with English
//   node tools/i18n-pages.mjs build            write /<lang-dir>/<page> for every language in LANGS_BUILT,
//                                              refresh hreflang + language list in the English pages,
//                                              point links in generated /<lang>/ pages at translated legal pages
//
// A page is cut into segments: the inner HTML of every block of text (inline tags become <tagN>…</tagN>
// placeholders, so translators never see attributes), translatable attributes (alt, title, aria-label,
// meta descriptions), the <title>, JSON-LD "description" and strings used by the page's JavaScript.
// Keys are a hash of the English text, so editing one sentence only invalidates that sentence.
// Translated pages get <base href="/<original folder>/">, so every asset and script path keeps working.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { LANGS_BUILT as DEFAULT_LANGS } from "./build-langs.mjs";
const LANGS_BUILT = process.env.I18N_LANGS ? process.env.I18N_LANGS.split(",") : DEFAULT_LANGS;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cat = JSON.parse(readFileSync(resolve(ROOT, "content/catalogue.json"), "utf8"));
const ORIGIN = cat.site.origin.replace(/\/$/, "");

// Pages translated by this tool. js: strings the page's scripts write into the page (looked up by window.T()).
export const PAGES = [
  { id: "home", src: "index.html" },
  { id: "ssnd", src: "szybciej-sie-nie-da/index.html", js: [
    "Day {n}", "See the word.", "A flashcard shows the English word.", "Flip it.", "The back of the card gives you the meaning.",
    "Check yourself.", "A quiz: pick the right Polish translation.", "Watch it add up.", "Level, XP, streak and words learned, day after day."] },
  { id: "pug", src: "pug-bubble-dig/index.html", js: [
    "Tap to<br>start!", "Click to<br>start!", "Click<br>to start!", "Tap to start: ride the bucket down to Level 01",
    "Click to start: ride the bucket down to Level 01", "Pause trailer", "Play trailer"] },
  { id: "mossy", src: "mossy/index.html", js: ["Pause", "Play with sound", "Watch again"] },
  { id: "legal", src: "legal/index.html" },
  { id: "mossy-privacy", src: "mossy/privacy/index.html", legal: true },
  { id: "mossy-terms", src: "mossy/terms/index.html", legal: true },
  { id: "fakechat-privacy", src: "fakechat/privacy/index.html", legal: true },
  { id: "fakechat-terms", src: "fakechat/terms/index.html", legal: true },
  { id: "loopclass-privacy", src: "loopclass/privacy/index.html", legal: true },
  { id: "loopclass-terms", src: "loopclass/terms/index.html", legal: true },
  { id: "ssnd-terms", src: "szybciej-sie-nie-da/terms/index.html", legal: true },
  { id: "pug-privacy", src: "pug-bubble-dig/privacy/index.html", legal: true },
  { id: "pug-terms", src: "pug-bubble-dig/terms/index.html", legal: true },
  { id: "transcriber-privacy", src: "audio-transcriber/privacy/index.html", legal: true },
  { id: "transcriber-terms", src: "audio-transcriber/terms/index.html", legal: true },
  { id: "transcriber-support", src: "audio-transcriber/support/index.html" },
  { id: "transcriber-licenses", src: "audio-transcriber/licenses/index.html" },
];

// Text that is never translated (names and addresses). A segment equal to one of these is skipped.
const FROZEN = new Set(["Snoochie Soft", "Snoochie", "Soft", "SnoochieSoft@proton.me", "Google Play", "Android",
  "Pug Bubble Dig", "Szybciej Się Nie Da", "Mossy", "Fake Chat Maker & Text Message", "Loopclass",
  "Offline Audio Transcriber", "Christian Pray Everyday", "Bigi", "Mo"]);

// ---------------------------------------------------------------- HTML parsing
const VOID = new Set("area base br col embed hr img input link meta source track wbr".split(" "));
const RAW = new Set(["script", "style", "textarea", "title"]);
const INLINE = new Set("a abbr b bdi bdo br cite code data dfn em i img kbd mark q s samp small span strong sub sup time u var wbr".split(" "));
const TEXT_BLOCK = new Set("p h1 h2 h3 h4 h5 h6 li dt dd td th figcaption caption label button summary blockquote legend option".split(" "));
const SKIP = new Set(["script", "style", "svg", "noscript", "template", "code", "pre"]);
const ATTR_RE = /([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function parse(html) {
  const root = { tag: "#root", children: [], attrs: [] };
  const stack = [root];
  const tagRe = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/gi;
  let pos = 0, m;
  const text = (a, b) => { if (b > a) stack.at(-1).children.push({ text: true, start: a, end: b }); };
  while ((m = tagRe.exec(html))) {
    text(pos, m.index);
    pos = tagRe.lastIndex;
    if (m[0].startsWith("<!")) continue;
    if (m[1]) {
      const tag = m[1].toLowerCase();
      const top = stack.at(-1);
      if (top.tag !== tag) throw new Error(`</${tag}> at ${lineOf(html, m.index)} closes <${top.tag}> (opened at ${lineOf(html, top.start)})`);
      top.closeStart = m.index; top.closeEnd = pos; stack.pop();
      continue;
    }
    const tag = m[2].toLowerCase();
    const el = { tag, start: m.index, openEnd: pos, attrs: attrsOf(m[3], m.index + 1 + m[2].length), children: [] };
    stack.at(-1).children.push(el);
    if (VOID.has(tag) || m[4] === "/") { el.void = true; continue; }
    if (RAW.has(tag)) {
      const close = html.toLowerCase().indexOf(`</${tag}`, pos);
      if (close < 0) throw new Error(`<${tag}> at ${lineOf(html, m.index)} is never closed`);
      el.children.push({ text: true, start: pos, end: close, raw: true });
      el.closeStart = close; el.closeEnd = html.indexOf(">", close) + 1;
      pos = el.closeEnd; tagRe.lastIndex = pos;
      continue;
    }
    stack.push(el);
  }
  text(pos, html.length);
  if (stack.length > 1) throw new Error(`<${stack.at(-1).tag}> opened at ${lineOf(html, stack.at(-1).start)} is never closed`);
  return root;
}
function attrsOf(s, offset) {
  const out = [];
  ATTR_RE.lastIndex = 0;
  let m;
  while ((m = ATTR_RE.exec(s))) {
    const q = m[2] !== undefined ? 2 : m[3] !== undefined ? 3 : m[4] !== undefined ? 4 : 0;
    const val = q ? m[q] : null;
    let vs = -1, ve = -1;
    if (q) { vs = offset + m.index + m[0].length - val.length - (q === 4 ? 0 : 1); ve = vs + val.length; }
    out.push({ name: m[1].toLowerCase(), value: val, vs, ve });
  }
  return out;
}
const lineOf = (s, i) => "line " + (s.slice(0, i).split("\n").length);
const attr = (el, n) => el.attrs.find((a) => a.name === n);

// ---------------------------------------------------------------- entities
const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", larr: "←", rarr: "→", uarr: "↑", darr: "↓", middot: "·", copy: "©", hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", times: "×", eacute: "é" };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, e) =>
  e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : +e.slice(1)) : NAMED[e.toLowerCase()] ?? all);
const escText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\u00a0/g, "&nbsp;");
const escAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const hasWords = (s) => /\p{L}{2,}/u.test(s) && !FROZEN.has(s.trim()) && !/^[A-Z]{2}(-[A-Z]{2,3})?$/.test(s.trim());
// what this tool injected into a page earlier (language list, its stylesheet) is not part of the source text
// A page's own language menu (<details class="lang">, Audio Transcriber legal pages) is replaced by ours in place.
const load = (src) => readFileSync(resolve(ROOT, src), "utf8")
  .replace(/<!--i18n-langs-->[\s\S]*?<!--\/i18n-langs-->\n?/g, "").replace(/<link rel="stylesheet" href="\/css\/i18n\.css">\n?/g, "")
  .replace(/<!--i18n-dd--><details class="lang i18n-dd"[\s\S]*?<!--\/i18n-dd-->/g, "<!--i18n-dd-slot-->")
  .replace(/<!--i18n-dd-->[\s\S]*?<!--\/i18n-dd-->\n?/g, "")
  .replace(/<details class="lang">[\s\S]*?<\/details>/g, "<!--i18n-dd-slot-->");
const key = (s) => createHash("sha1").update(s).digest("hex").slice(0, 10);

// ---------------------------------------------------------------- segmentation
const TRANS_ATTRS = ["alt", "title", "aria-label", "placeholder", "data-y"];
const META_KEYS = new Set(["description", "og:title", "og:description", "og:image:alt", "twitter:title", "twitter:description", "twitter:image:alt"]);
const inlineOnly = (el) => el.children.every((c) => c.text || (INLINE.has(c.tag) && inlineOnly(c)));
const directText = (html, el) => el.children.some((c) => c.text && hasWords(decode(html.slice(c.start, c.end))));
const textOf = (html, el) => el.children.map((c) => c.text ? decode(html.slice(c.start, c.end)) : textOf(html, c)).join("");

// Returns [{kind, start, end, text, tags?}] in document order. tags: raw open tags of placeholders.
function segments(html) {
  const root = parse(html), out = [];
  const addAttr = (el) => {
    for (const a of el.attrs) {
      if (a.value == null || a.vs < 0) continue;
      const v = decode(a.value);
      const isMeta = el.tag === "meta" && a.name === "content" && META_KEYS.has((attr(el, "name") || attr(el, "property") || {}).value);
      if ((TRANS_ATTRS.includes(a.name) || isMeta) && hasWords(v)) out.push({ kind: "attr", start: a.vs, end: a.ve, text: v });
    }
  };
  const segOf = (el) => {
    let cs = el.children.filter((c) => !(c.text && !html.slice(c.start, c.end).trim()));
    // strip leading / trailing void elements (icons) and whitespace
    while (cs.length && !cs[0].text && cs[0].void) { addAttr(cs[0]); cs = cs.slice(1); }
    while (cs.length && !cs.at(-1).text && cs.at(-1).void) { addAttr(cs.at(-1)); cs = cs.slice(0, -1); }
    if (!cs.length) return;
    let start = cs[0].start, end = cs.at(-1).text ? cs.at(-1).end : cs.at(-1).closeEnd ?? cs.at(-1).openEnd;
    while (/\s/.test(html[start])) start++;
    while (/\s/.test(html[end - 1])) end--;
    const tags = [];
    const ser = (nodes) => nodes.map((c) => {
      if (c.text) {
        const a = Math.max(c.start, start), b = Math.min(c.end, end);
        return a < b ? decode(html.slice(a, b)) : "";
      }
      const n = tags.push(c) ;
      addAttr(c);
      if (c.void) return `<${c.tag}${n}/>`;
      return `<${c.tag}${n}>${ser(c.children)}</${c.tag}${n}>`;
    }).join("");
    const text = ser(el.children.filter((c) => !(c.text ? c.end <= start || c.start >= end : c.start < start || c.start >= end)));
    out.push({ kind: "text", start, end, text, tags });
  };
  const visit = (el) => {
    if ((attr(el, "translate") || {}).value === "no") return;
    if (SKIP.has(el.tag)) {
      if (el.tag === "script" && (attr(el, "type") || {}).value === "application/ld+json") ldjson(el);
      return;
    }
    addAttr(el);
    if (el.tag === "title") { const c = el.children[0]; if (c) out.push({ kind: "title", start: c.start, end: c.end, text: decode(html.slice(c.start, c.end)) }); return; }
    if (el.tag !== "#root" && inlineOnly(el) && (TEXT_BLOCK.has(el.tag) || directText(html, el)) && hasWords(textOf(html, el))) { segOf(el); return; }
    for (const c of el.children) {
      if (c.text) {
        const raw = html.slice(c.start, c.end);
        if (!hasWords(decode(raw))) continue;
        const s = c.start + raw.search(/\S/), e = c.start + raw.trimEnd().length;
        out.push({ kind: "text", start: s, end: e, text: decode(html.slice(s, e)), tags: [] });
      } else visit(c);
    }
  };
  // JSON-LD: translate "description" values in place, and the questions and answers of a FAQPage
  const ldjson = (el) => {
    const c = el.children[0], src = html.slice(c.start, c.end);
    for (const re of [/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/g, /"@type"\s*:\s*"(?:Question|Answer)"\s*,\s*"(?:name|text)"\s*:\s*"((?:[^"\\]|\\.)*)"/g]) {
      let m;
      while ((m = re.exec(src))) {
        const vs = c.start + m.index + m[0].length - m[1].length - 1;
        out.push({ kind: "ld", start: vs, end: vs + m[1].length, text: JSON.parse(`"${m[1]}"`) });
      }
    }
  };
  visit(root);
  // attribute segments of placeholders live inside text segments; keep them separate in the list
  return out.sort((a, b) => a.start - b.start || b.end - a.end);
}

// ---------------------------------------------------------------- language helpers
const langMeta = (l) => {
  const p = resolve(ROOT, `content/${l}.json`);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")).meta : { lang: l };
};
const langDir = (l) => (cat.languages[l].dir ? cat.languages[l].dir + "/" : "");
const outPath = (l, src) => langDir(l) + src;
const urlOf = (rel) => ORIGIN + "/" + rel.replace(/index\.html$/, "");
const readPageJson = (l, id) => {
  const p = resolve(ROOT, `content/pages/${l}/${id}.json`);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
};
const common = (l) => readPageJson(l, "_common") || readPageJson("en", "_common");
// Google Play badge per language (img/badges/play-<code>.png), English if the file is missing.
const BADGE = { "pt-BR": "pt-br", "es-MX": "es-419" };
const badgeFor = (l) => { const c = BADGE[l] || l.toLowerCase(); return existsSync(resolve(ROOT, `img/badges/play-${c}.png`)) ? c : "en"; };

// pages (site-root relative folders, "" = home) that exist in language l after the build
function translatedDirs(l) {
  const s = new Set();
  for (const p of PAGES) if (l === "en" || readPageJson(l, p.id)) s.add(p.src.replace(/index\.html$/, ""));
  // pages generated by tools/build.mjs from content/<lang>.json
  if (existsSync(resolve(ROOT, `content/${l}.json`))) for (const a of cat.apps) if (!["mossy"].includes(a.id) || PAGES.some((p) => p.src === a.slug + "/index.html")) s.add(a.slug + "/");
  return s;
}

// Rewrite one href written in a page that lives at srcDir (original folder) for language l.
function mapHref(href, srcDir, l, dirs) {
  if (!href || /^(mailto:|tel:|javascript:|data:)/i.test(href)) return href;
  if (/^https?:\/\//i.test(href) && !href.startsWith(ORIGIN + "/")) return href;
  const u = new URL(href, ORIGIN + "/" + srcDir);
  if (u.origin !== ORIGIN) return href;
  let p = u.pathname.slice(1);
  if (/\.[a-z0-9]+$/i.test(p) && !p.endsWith("index.html")) return u.pathname + u.search + u.hash; // a file
  p = p.replace(/index\.html$/, "");
  // strip a language prefix if the link already points at a translation
  for (const x of Object.keys(cat.languages)) { const d = langDir(x); if (d && p.startsWith(d)) { p = p.slice(d.length); break; } }
  const target = dirs.has(p) ? langDir(l) + p : p;
  return "/" + target + u.search + u.hash;
}

// ---------------------------------------------------------------- rendering
function hreflangBlock(src, langsWithPage) {
  return langsWithPage.map((x) => `<link rel="alternate" hreflang="${cat.languages[x].hreflang}" href="${urlOf(outPath(x, src))}">`).join("\n")
    + `\n<link rel="alternate" hreflang="x-default" href="${urlOf(src)}">`;
}
function langNav(src, l, langsWithPage) {
  const c = common(l);
  const items = langsWithPage.map((x) => {
    const m = langMeta(x);
    return `<a href="/${outPath(x, src).replace(/index\.html$/, "")}" hreflang="${cat.languages[x].hreflang}" lang="${m.lang || x}" title="${escAttr(cat.languages[x].native)}"${x === l ? ' aria-current="page"' : ""}>${escText(m.short || x.toUpperCase())}</a>`;
  }).join("");
  return `<!--i18n-langs--><div class="i18n-langs" role="navigation" aria-label="${escAttr(c.language)}"><span class="i18n-l">${escText(c.language)}</span>${items}</div><!--/i18n-langs-->`;
}
// Drop-down language menu for the page header (no dependencies; closes on outside click and Escape).
const GLOBE = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-8.5 9h17M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/></svg>';
const CARET = '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2.4" d="m6 9 6 6 6-6"/></svg>';
function langMenu(src, l, langsWithPage, cls) {
  const c = common(l), cur = langMeta(l);
  const items = langsWithPage.map((x) => {
    const m = langMeta(x);
    return `<li><a href="/${outPath(x, src).replace(/index\.html$/, "")}" hreflang="${cat.languages[x].hreflang}" lang="${m.lang || x}"${x === l ? ' aria-current="page"' : ""}><span>${escText(cat.languages[x].native)}</span><span class="code">${escText(m.short || x.toUpperCase())}</span></a></li>`;
  }).join("");
  return `<!--i18n-dd--><details class="${cls}" translate="no"><summary aria-label="${escAttr(c.language)}: ${escAttr(cat.languages[l].native)}">${GLOBE}<span>${escText(cur.short || l.toUpperCase())}</span>${CARET}</summary><ul>${items}</ul></details>`
    + `<script>(function(){if(window.__i18ndd)return;window.__i18ndd=1;var q=function(){return document.querySelectorAll("details.i18n-dd[open]")};document.addEventListener("click",function(e){q().forEach(function(d){if(!d.contains(e.target))d.open=false})});document.addEventListener("keydown",function(e){if(e.key==="Escape")q().forEach(function(d){d.open=false})})})();</script><!--/i18n-dd-->`;
}
function placeMenu(out, src, l, langsWithPage) {
  if (out.includes("<!--i18n-dd-slot-->")) return out.replace("<!--i18n-dd-slot-->", langMenu(src, l, langsWithPage, "lang i18n-dd"));
  const menu = langMenu(src, l, langsWithPage, "i18n-dd");
  // header: right before its last link (the Play button), so [brand ...] [menu][Play] stay apart
  const lastLink = /(<a\b[^>]*>(?:(?!<a\b)[\s\S])*?<\/a>\s*)(<\/header>)/;
  if (/<header\b[\s\S]*?<\/a>\s*<\/header>/.test(out)) return out.replace(lastLink, `${menu}$1$2`);
  if (/<header\b/.test(out)) return out.replace(/(<header\b[\s\S]*?)(<\/header>)/, `$1${menu}$2`);
  // no header: inside the first <nav> of the body (home, /legal/)
  if (/<body[\s\S]*?<nav\b/.test(out)) return out.replace(/(<body[\s\S]*?<nav\b[^>]*>[\s\S]*?)(<\/nav>)/, `$1${menu}$2`);
  return out.replace(/(<body[^>]*>)/, `$1\n${langMenu(src, l, langsWithPage, "i18n-dd i18n-dd--float")}`);
}

function render(html, page, l, tr, langsWithPage) {
  const srcDir = page.src.replace(/index\.html$/, "");
  const segs = segments(html);
  const reps = []; // {start, end, str}
  const missing = [];
  const T = (s) => { if (l === "en") return s; const v = tr[key(s)]; if (v == null) missing.push(s); return v ?? s; };
  const dirs = translatedDirs(l);
  // open-tag rewriting: href mapping, badges, translated attributes inside the tag
  const segAttrs = segs.filter((s) => s.kind === "attr");
  const openTag = (el) => {
    let s = html.slice(el.start, el.openEnd);
    const edits = [];
    for (const a of el.attrs) {
      if (a.vs < 0) continue;
      let v = a.value;
      // language-switch links (hreflang) already name their target language: keep them as written
      if (l !== "en" && a.name === "href" && el.tag === "a" && el.attrs.some((x) => x.name === "hreflang")) continue;
      if (l !== "en" && a.name === "href" && el.tag === "a") v = mapHref(decode(v), srcDir, l, dirs);
      else if (a.name === "src" && /img\/badges\/play-en\.png$/.test(v)) v = v.replace("play-en.png", `play-${badgeFor(l)}.png`);
      else if (segAttrs.some((x) => x.start === a.vs)) v = escAttr(T(decode(v)));
      else continue;
      edits.push([a.vs - el.start, a.ve - el.start, v]);
    }
    for (const [a, b, v] of edits.sort((x, y) => y[0] - x[0])) s = s.slice(0, a) + v + s.slice(b);
    return s;
  };
  const root = parse(html);
  const inText = []; // ranges covered by text segments
  for (const sg of segs) {
    if (sg.kind === "text") {
      const t = T(sg.text);
      const str = t.replace(/<(\/?)([a-z0-9-]+?)(\d+)(\/?)>|([^<]+)/gi, (all, close, tag, n, slash, txt) => {
        if (txt !== undefined) return escText(txt);
        const el = sg.tags[+n - 1];
        if (!el) throw new Error(`${page.id} [${l}]: unknown placeholder ${all} in "${t}"`);
        return close ? `</${el.tag}>` : openTag(el);
      });
      reps.push({ start: sg.start, end: sg.end, str });
      inText.push([sg.start, sg.end]);
    }
  }
  const covered = (i) => inText.some(([a, b]) => i >= a && i < b);
  for (const sg of segs) {
    if (sg.kind === "title") reps.push({ start: sg.start, end: sg.end, str: escText(T(sg.text)) });
    if (sg.kind === "ld") reps.push({ start: sg.start, end: sg.end, str: JSON.stringify(T(sg.text)).slice(1, -1) });
  }
  // every element outside text segments: rewrite its open tag (attributes, hrefs, badges)
  const walk = (el) => {
    if (el.tag !== "#root" && !covered(el.start)) {
      const s = openTag(el);
      if (s !== html.slice(el.start, el.openEnd)) reps.push({ start: el.start, end: el.openEnd, str: s });
    }
    for (const c of el.children || []) if (!c.text) walk(c);
  };
  walk(root);
  reps.sort((a, b) => b.start - a.start);
  let out = html;
  let last = Infinity;
  for (const r of reps) {
    if (r.end > last) throw new Error(`${page.id}: overlapping replacements at ${lineOf(html, r.start)}`);
    out = out.slice(0, r.start) + r.str + out.slice(r.end);
    last = r.start;
  }
  // head: lang, canonical, og, hreflang, base, language list, legal note, JS strings
  const meta = langMeta(l), c = common(l);
  const self = urlOf(outPath(l, page.src));
  out = out.replace(/<html lang="[^"]*"/, `<html lang="${meta.lang || l}"`);
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${self}$2`);
  out = out.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${self}$2`);
  if (meta.ogLocale) out = out.replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${meta.ogLocale}$2`);
  out = out.replace(/\n?<link rel="alternate" hreflang="[^"]*" href="[^"]*">/g, "");
  const block = hreflangBlock(page.src, langsWithPage);
  if (/<link rel="canonical"[^>]*>/.test(out)) out = out.replace(/(<link rel="canonical"[^>]*>)/, `$1\n${block}`);
  else out = out.replace(/(<\/title>)/, `$1\n${block}`);
  out = out.replace(/<!--i18n-langs-->[\s\S]*?<!--\/i18n-langs-->\n?/g, "").replace(/\n?<link rel="stylesheet" href="\/css\/i18n\.css">/g, "");
  out = out.replace(/(<\/head>)/, `<link rel="stylesheet" href="/css/i18n.css">\n$1`);
  const nav = langNav(page.src, l, langsWithPage);
  if (/<\/footer>/.test(out)) out = out.replace(/(<\/footer>)(?![\s\S]*<\/footer>)/, `${nav}\n$1`);
  else out = out.replace(/(<\/body>)/, `${nav}\n$1`);
  out = placeMenu(out, page.src, l, langsWithPage);
  if (l !== "en") {
    out = out.replace(/(<meta charset="utf-8">)/i, `$1\n<base href="/${srcDir}">`);
    if (page.js) {
      const map = Object.fromEntries(page.js.map((s) => [s, T(s)]));
      out = out.replace(/(<body[^>]*>)/, `$1\n<script type="application/json" id="i18n-js">${JSON.stringify(map).replace(/</g, "\\u003c")}</script>`);
    }
    if (page.legal) out = out.replace(/(<\/h1>)/, `$1\n<p class="i18n-note">${escText(c.legalNote)}</p>`);
  }
  return { out, missing };
}

// ---------------------------------------------------------------- commands
function extract() {
  const dir = resolve(ROOT, "content/pages/en");
  mkdirSync(dir, { recursive: true });
  for (const p of PAGES) {
    const html = load(p.src);
    const obj = {};
    for (const s of segments(html)) obj[key(s.text)] = s.text;
    for (const s of p.js || []) obj[key(s)] = s;
    writeFileSync(resolve(dir, p.id + ".json"), JSON.stringify(obj, null, 2) + "\n");
    console.log(`${p.id}: ${Object.keys(obj).length} strings`);
  }
}

const tagsIn = (s) => (s.match(/<\/?[a-z0-9-]+\d+\/?>|<br>/gi) || []).sort().join(" ");
function check(l) {
  let bad = 0;
  for (const p of [...PAGES, { id: "_common" }]) {
    const en = readPageJson("en", p.id), tr = readPageJson(l, p.id);
    if (!tr) { console.log(`missing    ${p.id}.json`); bad++; continue; }
    for (const [k, v] of Object.entries(en)) {
      const t = tr[k];
      if (t == null) { console.log(`missing    ${p.id} ${k} "${v.slice(0, 60)}"`); bad++; continue; }
      if (typeof t !== "string" || !t.trim()) { console.log(`empty      ${p.id} ${k}`); bad++; continue; }
      if (tagsIn(t) !== tagsIn(v)) { console.log(`tags       ${p.id} ${k}: "${t}" (English: "${v}")`); bad++; }
      if (/\{[a-z]+\}/i.test(v) && (v.match(/\{[a-z]+\}/gi) || []).sort().join() !== (t.match(/\{[a-z]+\}/gi) || []).sort().join()) { console.log(`placeholder ${p.id} ${k}`); bad++; }
    }
    for (const k of Object.keys(tr)) if (!(k in en)) { console.log(`extra      ${p.id} ${k}`); bad++; }
  }
  console.log(bad ? `${l}: ${bad} problem(s)` : `${l}: OK`);
  return bad;
}

function build() {
  const langs = LANGS_BUILT;
  let missingTotal = 0;
  for (const p of PAGES) {
    const html = load(p.src), orig = readFileSync(resolve(ROOT, p.src), "utf8");
    const langsWithPage = langs.filter((l) => l === "en" || readPageJson(l, p.id));
    for (const l of langsWithPage) {
      const tr = l === "en" ? {} : readPageJson(l, p.id);
      const { out, missing } = render(html, p, l, tr, langsWithPage);
      if (missing.length) { missingTotal += missing.length; console.log(`${p.id} [${l}]: ${missing.length} untranslated, e.g. "${missing[0].slice(0, 60)}"`); }
      const dest = resolve(ROOT, outPath(l, p.src));
      mkdirSync(dirname(dest), { recursive: true });
      if (l === "en") { if (out !== orig) writeFileSync(dest, out); }
      else writeFileSync(dest, out);
    }
    console.log(`${p.id}: ${langsWithPage.join(", ")}`);
  }
  // generated pages (tools/build.mjs): links to English legal pages -> the translated ones;
  // links to a /<lang>/ page that does not exist (a hand-made page not translated yet) -> the English page
  for (const l of langs) {
    if (l === "en") continue;
    const dirs = translatedDirs(l), ld = langDir(l);
    for (const a of cat.apps) {
      const f = resolve(ROOT, ld + a.slug + "/index.html");
      if (!existsSync(f) || PAGES.some((p) => p.src === a.slug + "/index.html")) continue;
      const html = readFileSync(f, "utf8");
      const out = html.replace(/(<a\b[^>]*\bhref=")([^"]+)(")/g, (all, pre, href, post) => {
        const u = new URL(decode(href), `${ORIGIN}/${ld}${a.slug}/`);
        if (u.origin !== ORIGIN || /\.[a-z0-9]+$/i.test(u.pathname.replace(/index\.html$/, ""))) return all;
        const p = u.pathname.slice(1).replace(/index\.html$/, "");
        if (p.startsWith(ld)) return existsSync(resolve(ROOT, p + "index.html")) ? all : pre + "/" + p.slice(ld.length) + u.hash + post;
        if (!PAGES.some((x) => x.legal && x.src.replace(/index\.html$/, "") === p) || !dirs.has(p)) return all;
        return pre + "/" + ld + p + u.hash + post;
      });
      if (out !== html) writeFileSync(f, out);
    }
  }
  // sitemap.xml (written by tools/build.mjs): add every translated page that is not listed yet
  const smf = resolve(ROOT, "sitemap.xml");
  if (existsSync(smf)) {
    let sm = readFileSync(smf, "utf8");
    const have = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
    const date = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
    const add = [];
    for (const p of PAGES) for (const l of langs) {
      if (l !== "en" && !readPageJson(l, p.id)) continue;
      const u = urlOf(outPath(l, p.src));
      if (!have.has(u)) { have.add(u); add.push(`  <url>\n    <loc>${u}</loc>\n    <lastmod>${date}</lastmod>\n  </url>`); }
    }
    if (add.length) { sm = sm.replace("</urlset>", add.join("\n") + "\n</urlset>"); writeFileSync(smf, sm); console.log(`sitemap.xml: +${add.length} URLs`); }
  }
  if (missingTotal) console.log(`${missingTotal} untranslated string(s) left in English (run check <lang>)`);
}

// The page's source text was replaced by a translation with the same structure (e.g. a Polish original
// turned into English): move every language's strings from the old keys to the new ones by position.
// With --src <lang>, the old source text itself becomes content/pages/<lang>/<id>.json.
// With --first, the old page may be longer: only its first segments (as many as the new page has) are used.
function rekey(id, oldFile, srcLang, first) {
  const page = PAGES.find((p) => p.id === id);
  const oldHtml = readFileSync(resolve(oldFile), "utf8"), newHtml = load(page.src);
  const strip = (h) => h.replace(/<!--i18n-langs-->[\s\S]*?<!--\/i18n-langs-->\n?/g, "").replace(/<!--i18n-dd-->[\s\S]*?<!--\/i18n-dd-->\n?/g, "");
  const b = segments(newHtml), a = segments(strip(oldHtml)).slice(0, first ? b.length : undefined);
  if (a.length !== b.length) throw new Error(`${id}: ${a.length} old vs ${b.length} new segments, structure differs`);
  a.forEach((s, i) => { if (s.kind !== b[i].kind) throw new Error(`${id}: segment ${i} is ${s.kind} vs ${b[i].kind}`); });
  const map = new Map(a.map((s, i) => [key(s.text), key(b[i].text)]));
  for (const l of Object.keys(cat.languages)) {
    if (l === "en") continue;
    const f = resolve(ROOT, `content/pages/${l}/${id}.json`);
    let obj = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null;
    if (l === srcLang) obj = Object.fromEntries(a.map((s, i) => [key(b[i].text), s.text]));
    else if (obj) obj = Object.fromEntries(Object.entries(obj).filter(([k]) => map.has(k)).map(([k, v]) => [map.get(k), v]));
    if (obj) { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(obj, null, 2) + "\n"); console.log(`${l}/${id}.json: ${Object.keys(obj).length} strings`); }
  }
}
// Drop keys that no longer exist in English from every translation; fill a missing key from another page
// of the same language that has the same English string (same key).
function prune() {
  for (const l of Object.keys(cat.languages)) {
    if (l === "en") continue;
    const all = {};
    for (const p of PAGES) Object.assign(all, readPageJson(l, p.id) || {});
    for (const p of [...PAGES, { id: "_common" }]) {
      const en = readPageJson("en", p.id), f = resolve(ROOT, `content/pages/${l}/${p.id}.json`);
      if (!en || !existsSync(f)) continue;
      const tr = JSON.parse(readFileSync(f, "utf8"));
      const out = Object.fromEntries(Object.keys(en).filter((k) => k in tr || k in all).map((k) => [k, tr[k] ?? all[k]]));
      const before = JSON.stringify(tr), after = JSON.stringify(out);
      if (before !== after) { writeFileSync(f, JSON.stringify(out, null, 2) + "\n"); console.log(`${l}/${p.id}.json: ${Object.keys(tr).length} -> ${Object.keys(out).length} strings`); }
    }
  }
}

const [cmd, arg1] = process.argv.slice(2);
if (cmd === "rekey") { const i = process.argv.indexOf("--src"); rekey(arg1, process.argv[4], i > -1 ? process.argv[i + 1] : null, process.argv.includes("--first")); }
else if (cmd === "prune") prune();
else
if (cmd === "extract") extract();
else if (cmd === "check") process.exit(check(arg1) ? 1 : 0);
else if (cmd === "build") build();
else if (cmd === "segments") for (const s of segments(readFileSync(resolve(ROOT, arg1), "utf8"))) console.log(s.kind.padEnd(5), JSON.stringify(s.text));
else console.log("usage: node tools/i18n-pages.mjs extract | check <lang> | build | segments <file>");
