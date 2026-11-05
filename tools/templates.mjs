// HTML templates for the Snoochie Soft label site. No copy lives here: every visible
// string comes from content/<lang>.json (ctx.t) and every fact from content/catalogue.json.

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const fmt = (s, vars) => String(s).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));

/* ---------- icons (authored SVG, one stroke family) ---------- */
const svg = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${d}</svg>`;
export const ICON = {
  globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 3.8 5.8 3.8 9s-1.2 6.2-3.8 9c-2.6-2.8-3.8-5.8-3.8-9S9.4 5.8 12 3z"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  back: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  prev: svg('<path d="M15 5l-7 7 7 7"/>'),
  next: svg('<path d="M9 5l7 7-7 7"/>'),
  flip: svg('<path d="M4 12a8 8 0 0 1 14-5.3M20 4v5h-5M20 12a8 8 0 0 1-14 5.3M4 20v-5h5"/>'),
  play: svg('<path d="M6 4.5v15l13-7.5z"/>'),
  doc: svg('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>'),
  copy: svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  caret: svg('<path d="M6 9l6 6 6-6"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', ' data-icon="light"'),
  moon: svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>', ' data-icon="dark"'),
  auto: svg('<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>', ' data-icon="auto"'),
};

/* ---------- cover art: authored SVG motifs, one per release ---------- */
export function motif(app) {
  const { c1, c2, c3 } = app.colors;
  const W = 400, H = 400;
  let s = "";
  if (app.motif === "days") {
    for (let i = 0; i < 50; i++) {
      const x = 40 + (i % 10) * 33, y = 96 + Math.floor(i / 10) * 33;
      s += `<rect x="${x}" y="${y}" width="22" height="22" rx="4" fill="${i < 10 ? c3 : "none"}" stroke="${c3}" stroke-width="2" opacity="${i < 10 ? 1 : 0.55}"/>`;
    }
    s += `<text x="34" y="300" font-family="Unbounded" font-weight="900" font-size="118" fill="${c2}" letter-spacing="-8">500</text>`;
  } else if (app.motif === "tabs") {
    let n = 0;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) {
      if (n++ >= 47) break;
      const x = 36 + c * 42, y = 80 + r * 30, hl = r === 2 && c === 5;
      s += `<path d="M${x} ${y + 22}v-14q0-6 6-6h22q6 0 6 6v14z" fill="${hl ? "#ff7fb0" : c3}" opacity="${hl ? 1 : (0.35 + ((r * 8 + c) % 5) * 0.13).toFixed(2)}"/>`;
    }
    s += `<circle cx="320" cy="330" r="70" fill="${c3}" opacity=".9"/><circle cx="296" cy="318" r="9" fill="#2a1236"/><circle cx="338" cy="318" r="9" fill="#2a1236"/><path d="M300 344q18 14 36 0" stroke="#2a1236" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  } else if (app.motif === "bubbles") {
    s += `<rect x="40" y="88" width="230" height="96" rx="26" fill="${c3}"/><path d="M70 184l-6 34 40-34z" fill="${c3}"/>`;
    s += `<rect x="64" y="118" width="150" height="12" rx="6" fill="#2b1f6b" opacity=".6"/><rect x="64" y="142" width="100" height="12" rx="6" fill="#2b1f6b" opacity=".6"/>`;
    s += `<rect x="150" y="206" width="214" height="80" rx="24" fill="${c2}"/><path d="M330 286l10 30-40-30z" fill="${c2}"/>`;
    s += `<rect x="174" y="234" width="120" height="12" rx="6" fill="${c1}"/><rect x="174" y="256" width="70" height="10" rx="5" fill="${c1}" opacity=".5"/>`;
  } else if (app.motif === "week") {
    const cols = ["#e2513a", "#2f6fe0", "#3a9a4a", "#9a4ad0", "#1d1a2b"];
    for (let c = 0; c < 7; c++) {
      s += `<text x="${44 + c * 46}" y="90" font-family="Martian Mono" font-size="12" fill="${c2}" opacity=".7">${"MTWTFSS"[c]}</text>`;
      for (let r = 0; r < 5; r++) {
        const on = (c * 3 + r * 2) % 4 !== 0 && c < 5;
        s += `<rect x="${38 + c * 46}" y="${102 + r * 34}" width="38" height="26" rx="6" fill="${on ? cols[(c + r) % 5] : "none"}" stroke="${c2}" stroke-opacity=".25" opacity="${on ? 0.9 : 1}"/>`;
      }
    }
  } else if (app.motif === "wave") {
    for (let i = 0; i < 22; i++) {
      const h = 12 + Math.abs(Math.sin(i * 1.7) * 70) + ((i * 37) % 23);
      s += `<rect x="${36 + i * 7.5}" y="${(200 - h / 2).toFixed(1)}" width="4" height="${h.toFixed(1)}" rx="2" fill="${c2}" opacity=".9"/>`;
    }
    s += `<path d="M206 200h18m-8-8l8 8-8 8" stroke="${c3}" stroke-width="3" fill="none"/>`;
    s += `<rect x="240" y="150" width="124" height="14" rx="7" fill="${c2}"/><rect x="232" y="186" width="140" height="30" rx="6" fill="${c3}" transform="rotate(-4 302 201)"/><rect x="244" y="194" width="92" height="12" rx="6" fill="${c1}" transform="rotate(-4 302 201)"/><rect x="240" y="236" width="100" height="14" rx="7" fill="${c2}"/>`;
  } else if (app.motif === "dawn") {
    s += `<circle cx="200" cy="190" r="118" fill="${c3}" opacity=".95"/><circle cx="200" cy="190" r="88" fill="#fff6b8" opacity=".7"/>`;
    s += `<rect x="0" y="184" width="${W}" height="${H - 184}" fill="${c1}"/>`;
    for (let i = 0; i < 4; i++) s += `<rect x="0" y="${188 + i * 18}" width="${W}" height="10" fill="#58b847" opacity="${(0.65 + i * 0.09).toFixed(2)}"/>`;
    s += `<rect x="0" y="182" width="${W}" height="8" fill="#3f9a3a"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${s}</svg>`;
}

/* ---------- context helpers ---------- */
// ctx: { lang, t, cat, key, dir, root, built: [langs], date }
export const href = (ctx, path) => (ctx.root + path) || "./";
export const abs = (ctx, path) => `${ctx.cat.site.origin}/${path}`;
export const langDir = (cat, lang) => { const d = cat.languages[lang].dir; return d ? d + "/" : ""; };
export const pageDir = (cat, lang, key) => {
  const base = langDir(cat, lang);
  const app = cat.apps.find((a) => a.id === key);
  return app ? base + app.slug + "/" : base;
};
const appT = (ctx, app) => ctx.t.apps[app.id];

/* ---------- shared fragments ---------- */
function alternates(ctx) {
  const out = [];
  const seen = new Set();
  for (const l of ctx.built) {
    out.push(`<link rel="alternate" hreflang="${ctx.cat.languages[l].hreflang}" href="${abs(ctx, pageDir(ctx.cat, l, ctx.key))}">`);
    seen.add(l);
  }
  const app = ctx.cat.apps.find((a) => a.id === ctx.key);
  if (app && app.legacyAlternates) {
    for (const [l, p] of Object.entries(app.legacyAlternates)) {
      if (!seen.has(l)) out.push(`<link rel="alternate" hreflang="${ctx.cat.languages[l].hreflang}" href="${abs(ctx, p)}">`);
    }
  }
  out.push(`<link rel="alternate" hreflang="x-default" href="${abs(ctx, pageDir(ctx.cat, "en", ctx.key))}">`);
  return out.join("\n");
}

export function head(ctx, { title, description, ogImage, ogAlt, jsonld, noindex }) {
  const t = ctx.t;
  const canonical = abs(ctx, ctx.dir);
  const fontPre = ["unbounded-latin-wght-normal.woff2", "schibsted-grotesk-latin-wght-normal.woff2"]
    .map((f) => `<link rel="preload" href="${href(ctx, "fonts/" + f)}" as="font" type="font/woff2" crossorigin>`).join("\n");
  return `<!doctype html>
<html lang="${esc(t.meta.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">\n${alternates(ctx)}`}
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#d4f03c" media="(prefers-color-scheme: light)" data-light="#d4f03c" data-dark="#1b1e16">
<meta name="theme-color" content="#1b1e16" media="(prefers-color-scheme: dark)" data-light="#d4f03c" data-dark="#1b1e16">
<script>(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",m.getAttribute("data-"+t))})}}catch(e){}})();</script>
<link rel="icon" href="${href(ctx, "favicon.ico")}" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="${href(ctx, "favicon-32.png")}">
<link rel="apple-touch-icon" href="${href(ctx, "apple-touch-icon.png")}">
${fontPre}
<link rel="stylesheet" href="${href(ctx, "css/label.css")}">
${ogImage ? `<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(t.site.studio)}">
<meta property="og:locale" content="${esc(t.meta.ogLocale)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs(ctx, ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${abs(ctx, ogImage)}">` : ""}
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
<script src="${href(ctx, "js/label.js")}" defer></script>
</head>`;
}

function langSwitcher(ctx, id) {
  const t = ctx.t;
  if (ctx.built.length < 2) return "";
  const items = ctx.built.map((l) => {
    const m = ctx.langs[l].meta;
    const cur = l === ctx.lang;
    return `<li><a href="${href(ctx, pageDir(ctx.cat, l, ctx.key))}" hreflang="${ctx.cat.languages[l].hreflang}" lang="${esc(m.lang)}"${cur ? ' aria-current="page"' : ""}><span>${esc(m.nameNative)}</span><span class="code">${esc(m.short)}</span></a></li>`;
  }).join("");
  return `<div class="lang" data-lang>
      <button type="button" aria-expanded="false" aria-controls="${id}">${ICON.globe}<span><span class="vh">${esc(t.site.langButton)}: </span>${esc(t.meta.short)}</span>${ICON.caret}</button>
      <ul id="${id}" aria-label="${esc(t.site.langMenu)}" hidden>${items}</ul>
    </div>`;
}

export function header(ctx) {
  const t = ctx.t;
  const home = ctx.key === "home" ? "" : href(ctx, langDir(ctx.cat, ctx.lang));
  return `<a class="skip" href="#main">${esc(t.site.skip)}</a>
<header class="top">
  <a class="brand" href="${home || "./"}" aria-label="${esc(t.site.homeLabel)}">
    <img src="${href(ctx, ctx.cat.site.studioMark)}" alt="" width="40" height="40">
    <span><b>${esc(t.site.studio)}</b><small>${esc(t.site.brandSub)}</small></span>
  </a>
  <nav class="mainnav" aria-label="${esc(t.site.navLabel)}">
    <a href="${home}#catalogue">${esc(t.site.nav.catalogue)}</a>
    <a href="${home}#rules">${esc(t.site.nav.rules)}</a>
    <a href="${home}#contact">${esc(t.site.nav.contact)}</a>
  </nav>
  <button class="theme" type="button" data-theme-toggle data-auto="${esc(t.site.theme.auto)}" data-light="${esc(t.site.theme.light)}" data-dark="${esc(t.site.theme.dark)}" data-auto-short="${esc(t.site.theme.autoShort)}" data-light-short="${esc(t.site.theme.lightShort)}" data-dark-short="${esc(t.site.theme.darkShort)}" aria-label="${esc(t.site.theme.auto)}" title="${esc(t.site.theme.auto)}" hidden>${ICON.auto}${ICON.sun}${ICON.moon}<span class="theme-label" aria-hidden="true">${esc(t.site.theme.autoShort)}</span></button>
  ${langSwitcher(ctx, "langlist")}
</header>`;
}

function legalLinks(ctx, app, cls = "") {
  const t = ctx.t;
  return app.legal.map((l) => {
    const external = /^https?:/.test(l.href);
    const url = external ? l.href : href(ctx, l.href);
    const pl = l.hreflang === "pl" ? ` <span class="note">(${esc(t.site.inPolish)})</span>` : "";
    return `<a${cls ? ` class="${cls}"` : ""} href="${url}"${l.hreflang ? ` hreflang="${l.hreflang}"` : ""}${external ? ' rel="noopener"' : ""}>${esc(t.site.legal[l.key])}</a>${pl}`;
  });
}

export function footer(ctx) {
  const t = ctx.t, cat = ctx.cat;
  const home = ctx.key === "home" ? "./" : href(ctx, langDir(cat, ctx.lang));
  const rows = cat.apps.map((a) => {
    const at = t.apps[a.id];
    const legal = legalLinks(ctx, { ...a, legal: a.legal.filter((l) => l.key === "privacy" || l.key === "terms") });
    return `<li><span class="no">${a.no}</span><a class="nm" href="${href(ctx, pageDir(cat, ctx.lang, a.id))}">${esc(at.name)}</a><span class="lg">${legal.join(" ")}</span></li>`;
  }).join("");
  const langs = ctx.built.map((l) => {
    const m = ctx.langs[l].meta;
    return `<a href="${href(ctx, pageDir(cat, l, ctx.key))}" hreflang="${cat.languages[l].hreflang}" lang="${esc(m.lang)}" title="${esc(m.nameNative)}"${l === ctx.lang ? ' aria-current="page"' : ""}>${esc(m.short)}</a>`;
  }).join("");
  return `<footer class="foot">
  <div class="foot-grid">
    <div class="foot-brand">
      <a class="brand" href="${home}" aria-label="${esc(t.site.homeLabel)}">
        <img src="${href(ctx, cat.site.studioMark)}" alt="" width="40" height="40" loading="lazy">
        <span><b>${esc(t.site.studio)}</b><small>${esc(t.site.tagline)}</small></span>
      </a>
      <p>${esc(cat.site.email)}<br>${esc(t.site.footer.place)}</p>
    </div>
    <nav class="foot-rel" aria-label="${esc(t.site.footer.releasesLabel)}"><h2>${esc(t.site.footer.releases)}</h2><ul>${rows}</ul></nav>
    ${ctx.built.length > 1 ? `<nav class="foot-lang" aria-label="${esc(t.site.footer.language)}"><h2>${esc(t.site.footer.language)}</h2><div class="langs">${langs}</div></nav>` : ""}
  </div>
  <div class="foot-bar">
    <a href="mailto:${cat.site.email}">${esc(t.site.footer.contact)}</a>
    <span>${esc(t.site.footer.line)}</span>
    <span class="mono">${esc(t.site.footer.copyright)}</span>
  </div>
</footer>`;
}

export function cover(ctx, app, { full = false, sticker = false, lazy = true } = {}) {
  const at = appT(ctx, app);
  return `<div class="cover" style="--c1:${app.colors.c1};--c2:${app.colors.c2}">
    <div class="art">${motif(app)}</div>
    <span class="cno">${app.no}</span>
    <img class="ico" src="${href(ctx, app.icon)}" alt="" width="64" height="64"${lazy ? ' loading="lazy"' : ""}>
    ${sticker ? `<span class="sticker"><span>${esc(at.sticker)}</span></span>` : ""}
    <p class="ttl">${esc(full ? at.name : at.short)}${full ? `<small>${esc(at.kind)}</small>` : ""}</p>
  </div>`;
}

const playBadge = (ctx, app, cls = "play", eager = false) => {
  const at = appT(ctx, app);
  const badge = ctx.cat.playBadge[ctx.lang] || ctx.cat.playBadge.en;
  return `<a class="${cls}" href="${app.play}" rel="noopener"><img src="${href(ctx, badge)}" alt="${esc(fmt(ctx.t.site.playAlt, { name: at.name }))}" width="188" height="56"${eager ? "" : ' loading="lazy"'}></a>`;
};

function phones(ctx, app, { lazy = true } = {}) {
  const at = appT(ctx, app);
  return app.screens.map((s, i) => `<figure><img src="${href(ctx, s.src)}" width="${s.w}" height="${s.h}" alt="${esc(at.screens[i].alt)}"${lazy ? ' loading="lazy"' : ""} decoding="async"><figcaption>${esc(at.screens[i].caption)}</figcaption></figure>`).join("");
}

/* ---------- HOME ---------- */
function nowBlock(ctx, app, eager, extra = "") {
  const t = ctx.t, at = appT(ctx, app);
  return `<h2 class="now-title">${esc(at.name)}</h2>
        <p class="meta"><span class="catno">${app.no}</span><span>${esc(at.kind)}</span></p>
        <p class="line">${esc(at.line)}</p>
        <div class="actions">
          ${playBadge(ctx, app, "play", eager)}
          <a class="pagelink" href="${href(ctx, pageDir(ctx.cat, ctx.lang, app.id))}" aria-label="${esc(fmt(t.site.appPageLabel, { name: at.name }))}">${esc(t.site.appPage)}${ICON.arrow}</a>${extra}
        </div>`;
}

function rearBlock(ctx, app, eager) {
  const t = ctx.t, at = appT(ctx, app);
  const tracks = at.sideA.slice(0, 3).map((x, i) => `<li><span>A${i + 1}</span><span>${esc(x)}</span></li>`).join("");
  const stamps = at.stamps.map((x, i) => `<li><span>B${i + 1}</span><span>${esc(x)}</span></li>`).join("");
  return `<div class="notes">
        <div class="notes-head"><img src="${href(ctx, app.icon)}" alt="" width="44" height="44"${eager ? "" : ' loading="lazy"'}><div><p class="notes-name">${esc(at.name)}</p><span class="mono">${app.no}</span></div></div>
        <p class="side">${esc(t.home.sideA)}</p>
        <ol class="tracks">${tracks}</ol>
        <p class="side">${esc(t.home.sideB)}</p>
        <ol class="tracks">${stamps}</ol>
        <p class="credits">${esc(fmt(t.home.credits, { no: app.no }))}<br>${esc(t.home.madeBy)}</p>
      </div>
      <div class="phones">${phones(ctx, app, { lazy: !eager })}</div>`;
}

export function homePage(ctx) {
  const t = ctx.t, cat = ctx.cat, h = t.home;
  const apps = cat.apps;
  const first = apps[0];
  const sleeves = apps.map((a, i) => {
    const at = appT(ctx, a);
    return `<a class="slv" href="${href(ctx, pageDir(cat, ctx.lang, a.id))}" data-i="${i}" data-label="${esc(fmt(h.sleeveLabel, { no: a.no, name: at.name }))}" aria-label="${esc(fmt(t.site.appPageLabel, { name: `${a.no}, ${at.name}` }))}" style="--c1:${a.colors.c1};--c3:${a.colors.c3}">
        <img class="peek" src="${href(ctx, a.screens[0].src)}" alt="" width="${a.screens[0].w}" height="${a.screens[0].h}" loading="lazy" decoding="async">
        <span class="body"><span class="spine" aria-hidden="true">${a.no} · ${esc(at.spine || at.short)}</span>${cover(ctx, a)}</span>
        <span class="tag" aria-hidden="true">${esc(h.onDesk)}</span>
      </a>`;
  }).join("\n      ");
  const nextSlot = `<div class="slv empty" role="note" aria-label="${esc(fmt(h.nextSlotLabel, { no: cat.site.nextNo }))}"><span class="body"><span class="mono">${cat.site.nextNo}</span><b>${esc(h.nextSlotTitle)}</b><span>${esc(h.nextSlotText)}</span></span></div>`;
  const ribbon = apps.map((a, i) => `<li><a href="${href(ctx, pageDir(cat, ctx.lang, a.id))}" data-i="${i}" data-label="${esc(fmt(h.sleeveLabel, { no: a.no, name: appT(ctx, a).name }))}" aria-label="${esc(fmt(t.site.appPageLabel, { name: `${a.no}, ${appT(ctx, a).name}` }))}">${a.no}</a></li>`).join("")
    + `<li><span class="open" role="img" aria-label="${esc(fmt(h.nextSlotLabel, { no: cat.site.nextNo }))}">${cat.site.nextNo}</span></li>`;
  const templates = apps.map((a, i) => `<template id="desk-${i}" data-status="${esc(fmt(h.deskStatus, { no: a.no, name: appT(ctx, a).name }))}"><div data-slot="now">${nowBlock(ctx, a, false)}</div><div data-slot="front">${cover(ctx, a, { full: true, sticker: true })}</div><div data-slot="rear">${rearBlock(ctx, a, false)}</div></template>`).join("\n");
  const sheet = apps.map((a) => {
    const at = appT(ctx, a);
    const legal = legalLinks(ctx, { ...a, legal: a.legal.filter((l) => l.key === "privacy" || l.key === "terms") });
    return `<li>
        <span class="n">${a.no}</span>
        <img class="i" src="${href(ctx, a.icon)}" alt="" width="56" height="56" loading="lazy">
        <h3><a href="${href(ctx, pageDir(cat, ctx.lang, a.id))}">${esc(at.name)}</a></h3>
        <p class="k">${esc(at.kind)}</p>
        <p class="l"><a href="${a.play}" rel="noopener">${ICON.play}Google Play</a>${legal.length ? legal.join("") : ""}</p>
      </li>`;
  }).join("\n      ") + `\n      <li class="open"><span class="n">${cat.site.nextNo}</span><p>${esc(h.catOpen)}</p></li>`;
  const rules = h.rules.map((r) => `<li><h3>${esc(r.h)}</h3><p>${esc(r.p)}</p></li>`).join("");

  const jsonld = {
    "@context": "https://schema.org", "@type": "Organization", name: t.site.studio, url: abs(ctx, ""),
    email: cat.site.email, logo: abs(ctx, cat.site.studioMark),
    address: { "@type": "PostalAddress", addressLocality: "Bydgoszcz", addressCountry: "PL" },
  };
  return `${head(ctx, { title: h.title, description: h.description, ogImage: `img/og/home-${ctx.ogLang || ctx.lang}.jpg`, ogAlt: h.ogAlt, jsonld })}
<body class="home">
${header(ctx)}
<main id="main">
  <section class="front" aria-labelledby="h1">
    <div class="intro">
      <h1 id="h1">${esc(h.h1)}</h1>
      <p class="lede">${esc(h.lede)}</p>
      <p class="vh" id="deskStatus" role="status"></p>
      <div class="now" id="now">
        ${nowBlock(ctx, first, true, `<button class="flipbtn" type="button" id="flip" aria-controls="sleeve3d" hidden title="${esc(h.flipToCover)}">${ICON.flip}<span class="vh" id="flipLabel" data-cover="${esc(h.flipToCover)}" data-screens="${esc(h.flipToScreens)}">${esc(h.flipToCover)}</span></button>`)}
      </div>
    </div>

    <div class="crate" role="region" aria-labelledby="crateTitle">
      <div class="crate-head">
        <h2 id="crateTitle">${esc(h.crateTitle)}</h2>
        <p>${esc(h.crateHint)}</p>
      </div>
      <div class="crate-box" aria-hidden="true"></div>
      <div class="rack" id="rack" role="group" aria-label="${esc(h.rackLabel)}">
      ${sleeves}
      ${nextSlot}
      </div>
      <div class="lip">
        <span class="lip-t" aria-hidden="true">${esc(h.ribbonTitle)}</span>
        <nav class="scrub" aria-label="${esc(h.ribbonLabel)}">
          <ol id="scrubList">${ribbon}</ol>
          <div class="rail" aria-hidden="true"></div>
          <div class="win" id="win" aria-hidden="true"></div>
        </nav>
        <div class="arrows" id="arrows" hidden>
          <button type="button" id="prev" aria-label="${esc(h.prev)}">${ICON.prev}</button>
          <button type="button" id="next" aria-label="${esc(h.next)}">${ICON.next}</button>
        </div>
      </div>
    </div>

    <div class="stage" role="region" aria-label="${esc(h.deskLabel)}">
      <div class="sleeve3d back" id="sleeve3d">
        <div class="face front" id="faceFront" aria-hidden="true">${cover(ctx, first, { full: true, sticker: true, lazy: false })}</div>
        <div class="face rear" id="faceRear">${rearBlock(ctx, first, true)}</div>
      </div>
    </div>
  </section>
${templates}

  <section class="block sheet-wrap" id="catalogue" aria-labelledby="catTitle">
    <h2 id="catTitle">${esc(h.catTitle)}</h2>
    <p class="sub">${esc(h.catSub)}</p>
    <ol class="sheet">
      ${sheet}
    </ol>
  </section>

  <section class="rules" id="rules" aria-labelledby="rulesTitle">
    <h2 id="rulesTitle">${esc(h.rulesTitle)}</h2>
    <p class="sub">${esc(h.rulesSub)}</p>
    <ol>${rules}</ol>
  </section>

  <section class="contact" id="contact" aria-labelledby="contactTitle">
    <h2 id="contactTitle">${esc(h.contactTitle)}</h2>
    <p>${esc(h.contactText)}</p>
    <p class="mail"><span class="vh">${esc(h.contactAddressLabel)}: </span><span id="addr">${esc(cat.site.email)}</span></p>
    <p class="place">${esc(h.contactPlace)}</p>
    <div class="mail-actions">
      <a class="btn" href="mailto:${cat.site.email}">${ICON.mail}${esc(h.contactMailto)}</a>
      <button class="btn ghost" type="button" id="copyAddr" data-done="${esc(h.contactCopied)}" hidden>${ICON.copy}${esc(h.contactCopy)}</button>
      <span class="copy-status" id="copyStatus" role="status"></span>
    </div>
  </section>
</main>
${footer(ctx)}
</body>
</html>
`;
}

/* ---------- APP PAGE: the back of the sleeve ---------- */
export function appPage(ctx, app) {
  const t = ctx.t, cat = ctx.cat, a = t.app, at = appT(ctx, app);
  const home = href(ctx, langDir(cat, ctx.lang));
  const tracks = (arr, side) => arr.map((x, i) => `<li><span class="tn">${side}${i + 1}</span><span>${esc(x)}</span></li>`).join("");
  const others = cat.apps.filter((o) => o.id !== app.id).map((o) => {
    const ot = appT(ctx, o);
    return `<li><a class="mini" href="${href(ctx, pageDir(cat, ctx.lang, o.id))}" style="--c1:${o.colors.c1};--c3:${o.colors.c3}"><span class="body"><span class="spine" aria-hidden="true">${o.no}</span>${cover(ctx, o)}</span><span class="cap"><span class="mono">${o.no}</span>${esc(ot.name)}</span></a></li>`;
  }).join("") + `<li><div class="mini empty"><span class="body"><span class="mono">${cat.site.nextNo}</span><b>${esc(t.home.nextSlotTitle)}</b></span></div></li>`;
  const legal = legalLinks(ctx, app);
  const priv = app.legal.find((l) => l.key === "privacy");
  const privacyNear = priv ? `<p class="side-legal">${ICON.doc}<a href="${/^https?:/.test(priv.href) ? priv.href : href(ctx, priv.href)}"${priv.hreflang ? ` hreflang="${priv.hreflang}"` : ""}${/^https?:/.test(priv.href) ? ' rel="noopener"' : ""}>${esc(a.privacyNear)}</a>${priv.hreflang === "pl" ? ` <span class="note">(${esc(t.site.inPolish)})</span>` : ""}</p>` : "";
  const legalHtml = legal.length
    ? `<ul class="legal-list">${legal.map((l) => `<li>${ICON.doc}${l}</li>`).join("")}</ul>`
    : `<p class="legal-none">${esc(a.legalNone)}</p>`;
  const otherLangs = app.legacyAlternates
    ? `<p class="other-langs">${esc(a.otherLanguages)}: ${Object.entries(app.legacyAlternates).filter(([l]) => !ctx.built.includes(l)).map(([l, p]) => `<a href="${href(ctx, p)}" hreflang="${cat.languages[l].hreflang}" lang="${l}">${esc(cat.languages[l].native)}</a>`).join(", ")}</p>`
    : "";
  const credits = [
    [a.creditRows.no, app.no], [a.creditRows.platform, a.platform], [a.creditRows.package, app.package],
    [a.creditRows.languages, at.appLanguage], [a.creditRows.studio, `${t.site.studio}, ${t.site.footer.place}`],
  ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
  const notes = at.notes.map((n) => `<p>${esc(n)}</p>`).join("");
  const stamps = at.stamps.map((s) => `<li>${esc(s)}</li>`).join("");

  const jsonld = {
    "@context": "https://schema.org", "@type": "SoftwareApplication",
    name: at.name,
    ...(at.storeName && at.storeName !== at.name ? { alternateName: at.storeName } : {}),
    operatingSystem: "Android",
    ...(app.category ? { applicationCategory: app.category } : {}),
    description: at.description,
    url: abs(ctx, ctx.dir),
    image: abs(ctx, app.icon),
    screenshot: app.screens.map((s) => abs(ctx, s.src)),
    installUrl: app.play,
    ...(app.inLanguage ? { inLanguage: app.inLanguage } : {}),
    ...(app.contentRating ? { contentRating: app.contentRating } : {}),
    author: { "@type": "Organization", name: t.site.studio, url: abs(ctx, ""), email: cat.site.email },
  };

  return `${head(ctx, { title: at.title, description: at.description, ogImage: `img/og/${app.id}-${ctx.ogLang || ctx.lang}.jpg`, ogAlt: `${at.name}: ${at.line}`, jsonld })}
<body class="app" style="--c1:${app.colors.c1};--c2:${app.colors.c2};--c3:${app.colors.c3}">
${header(ctx)}
<main id="main">
  <section class="sleeve-hero" aria-labelledby="h1">
    <div class="hero-text">
      <h1 id="h1">${esc(at.name)}</h1>
      <p class="meta"><span class="catno">${app.no}</span><span>${esc(at.kind)}</span></p>
      <p class="line">${esc(at.line)}</p>
      ${at.languageNote ? `<p class="langnote">${esc(at.languageNote)}</p>` : ""}
      <div class="actions">
        ${playBadge(ctx, app, "play", true)}
        <a class="pagelink" href="${home}#catalogue">${ICON.back}${esc(a.backToCatalogue)}</a>
      </div>
      <ul class="stamps" aria-label="${esc(a.stampsLabel)}">${stamps}</ul>
    </div>
    <div class="hero-sleeve">
      <img class="slide" src="${href(ctx, app.screens[0].src)}" width="${app.screens[0].w}" height="${app.screens[0].h}" alt="" fetchpriority="high">
      <div class="big">${cover(ctx, app, { full: true, sticker: true, lazy: false })}</div>
    </div>
  </section>

  <section class="screens" aria-labelledby="screensTitle">
    <h2 id="screensTitle">${esc(a.screensTitle)}</h2>
    <div class="phones">${phones(ctx, app)}</div>
  </section>

  <section class="sides" aria-label="${esc(a.sideA)} / ${esc(a.sideB)}">
    <div class="side-col">
      <h2>${esc(a.sideAHeading)}</h2>
      <ol class="tracks big">${tracks(at.sideA, "A")}</ol>
    </div>
    <div class="side-col">
      <h2>${esc(a.sideBHeading)}</h2>
      <ol class="tracks big">${tracks(at.sideB, "B")}</ol>
      ${privacyNear}
    </div>
  </section>

  <section class="liner" aria-labelledby="linerTitle">
    <div class="liner-notes">
      <h2 id="linerTitle">${esc(a.notesTitle)}</h2>
      ${notes}
      <h3>${esc(a.smallPrint)}</h3>
      <p class="fine">${esc(at.fine)}</p>
    </div>
    <div class="liner-credits">
      <h2>${esc(a.creditsTitle)}</h2>
      <dl class="credits-dl">${credits}</dl>
      <h3 id="legalTitle">${esc(a.legalTitle)}</h3>
      ${legalHtml}
      ${otherLangs}
    </div>
  </section>

  <section class="related" aria-labelledby="relTitle">
    <h2 id="relTitle">${esc(a.relatedTitle)}</h2>
    <ul class="minis" aria-label="${esc(a.relatedLabel)}">${others}</ul>
  </section>
</main>
${footer(ctx)}
</body>
</html>
`;
}


/* ---------- 404 ---------- */
export function notFoundPage(ctx) {
  const t = ctx.t, cat = ctx.cat, n = t.notFound;
  const list = cat.apps.map((a) => `<li><a href="/${pageDir(cat, ctx.lang, a.id)}"><span class="mono">${a.no}</span>${esc(t.apps[a.id].name)}</a></li>`).join("");
  return `${head(ctx, { title: n.title, description: n.p, noindex: true })}
<body class="nf">
${header(ctx)}
<main id="main" class="nf-main">
  <div class="nf-slot" aria-hidden="true"><span class="mono">404</span></div>
  <div>
    <h1>${esc(n.h1)}</h1>
    <p>${esc(n.p)}</p>
    <p><a class="btn" href="/${langDir(cat, ctx.lang)}#catalogue">${esc(n.home)}${ICON.arrow}</a></p>
    <h2>${esc(n.listTitle)}</h2>
    <ul class="nf-list">${list}</ul>
  </div>
</main>
${footer(ctx)}
</body>
</html>
`;
}
