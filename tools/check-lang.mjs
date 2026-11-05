// Compare a translation against content/en.json.
//
//   node tools/check-lang.mjs pl            (checks content/pl.json)
//   node tools/check-lang.mjs path/to/xx.json
//
// Reports missing keys, extra keys, empty strings, array length mismatches and strings
// longer than the length caps below. Exit code 1 when anything is wrong.
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Character caps (counted in Unicode code points). They come from the space the layout gives
// each string at the narrowest sleeve and the 390 px phone width; see content/TRANSLATING.md.
// "*" matches one key or array index.
export const CAPS = [
  ["meta.short", 5],
  ["site.nav.*", 14],
  ["site.brandSub", 30],
  ["home.h1", 32],
  ["home.onDesk", 14],
  ["home.crateTitle", 24],
  ["home.nextSlotTitle", 16],
  ["home.nextSlotText", 18],
  ["home.title", 70],
  ["home.description", 200],
  ["apps.*.short", 18],
  ["apps.*.spine", 9],
  ["apps.*.sticker", 26],
  ["apps.*.stamps.*", 22],
  ["apps.*.kind", 40],
  ["apps.*.screens.*.caption", 20],
  ["apps.*.title", 72],
  ["apps.*.description", 180],
];
// Keys whose value must stay exactly as in English (names and the store brand).
export const FROZEN = ["apps.*.name", "apps.*.storeName", "meta"];

const flat = (o, p = "", out = new Map()) => {
  if (Array.isArray(o)) { out.set(p + "#len", o.length); o.forEach((v, i) => flat(v, p ? `${p}.${i}` : String(i), out)); }
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) flat(v, p ? `${p}.${k}` : k, out);
  else out.set(p, o);
  return out;
};
const match = (pattern, key) => {
  const a = pattern.split("."), b = key.split(".");
  return a.length === b.length && a.every((x, i) => x === "*" || x === b[i]);
};
const len = (s) => [...String(s)].length;

export function checkLang(en, tr, code = "xx") {
  const E = flat(en), T = flat(tr), problems = [];
  for (const k of E.keys()) if (!T.has(k)) problems.push(`missing    ${k}`);
  for (const k of T.keys()) if (!E.has(k)) problems.push(`extra      ${k}`);
  for (const [k, v] of T) {
    if (k.endsWith("#len")) { if (E.has(k) && E.get(k) !== v) problems.push(`length     ${k.slice(0, -4)}: ${v} items, English has ${E.get(k)}`); continue; }
    if (typeof v === "string" && v.trim() === "") problems.push(`empty      ${k}`);
    const cap = CAPS.find(([p]) => match(p, k));
    if (cap && typeof v === "string" && len(v) > cap[1]) problems.push(`too long   ${k}: ${len(v)} > ${cap[1]} "${v}"`);
    if (FROZEN.some((p) => match(p, k)) && E.has(k) && E.get(k) !== v && !k.startsWith("meta.")) problems.push(`changed    ${k}: must stay "${E.get(k)}"`);
  }
  if (/^ru(-|$)/i.test(String(tr?.meta?.lang || code))) problems.unshift("forbidden  Russian is never published.");
  return problems;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv[2];
  if (!a) { console.error("Usage: node tools/check-lang.mjs <lang | path/to/file.json>"); process.exit(2); }
  const file = existsSync(a) ? resolve(a) : resolve(ROOT, "content", `${a}.json`);
  const en = JSON.parse(readFileSync(resolve(ROOT, "content/en.json"), "utf8"));
  const tr = JSON.parse(readFileSync(file, "utf8"));
  const problems = checkLang(en, tr, a);
  if (problems.length) { console.log(`${file}: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`); process.exit(1); }
  console.log(`${file}: OK (all keys present, no empty strings, within caps)`);
}
