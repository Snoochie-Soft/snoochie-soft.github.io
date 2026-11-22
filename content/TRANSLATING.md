# Translating the Snoochie Soft site

The copy lives in two places:

1. `content/en.json`: the generated pages (Fake Chat, Loopclass, Audio Transcriber, Christian Pray
   app pages and the shared header and footer). A translation is a copy saved as `content/<lang>.json`.
2. `content/pages/en/*.json`: the hand-made pages (home, Szybciej Się Nie Da, Pug Bubble Dig, /legal/)
   and every privacy policy and terms page, cut into strings by `tools/i18n-pages.mjs extract`.
   A translation is a copy saved as `content/pages/<lang>/<same name>.json` (see "Hand-made pages" below).

Facts, links and colours live in `content/catalogue.json` and are never translated.

## Languages

English is the master. Target languages (the biggest Google Play markets, Russian excluded):

| Code | File | Output folder | `meta.ogLocale` | `meta.short` |
|---|---|---|---|---|
| `en` | `en.json` | site root `/` | `en_US` | `EN` |
| `pl` | `pl.json` | `/pl/` | `pl_PL` | `PL` |
| `de` | `de.json` | `/de/` | `de_DE` | `DE` |
| `fr` | `fr.json` | `/fr/` | `fr_FR` | `FR` |
| `es` | `es.json` | `/es/` | `es_ES` | `ES` |
| `es-MX` | `es-MX.json` | `/es-mx/` | `es_MX` | `ES-MX` |
| `pt-BR` | `pt-BR.json` | `/pt-br/` | `pt_BR` | `PT` |
| `it` | `it.json` | `/it/` | `it_IT` | `IT` |
| `cs` | `cs.json` | `/cs/` | `cs_CZ` | `CS` |
| `tr` | `tr.json` | `/tr/` | `tr_TR` | `TR` |
| `ja` | `ja.json` | `/ja/` | `ja_JP` | `JA` |
| `ko` | `ko.json` | `/ko/` | `ko_KR` | `KO` |
| `id` | `id.json` | `/id/` | `id_ID` | `ID` |

`es` is Spanish for Spain (tú, vosotros, "móvil", "aplicación"). `es-MX` is Mexican / Latin American
Spanish (tú, ustedes never vosotros, "celular", "app"). `pt-BR` is Brazilian Portuguese (você, "celular").

**Never Russian.** No `ru.json`, no Russian strings anywhere. The build refuses it.

## What stays in English

- App names: Szybciej Się Nie Da, Mossy, Fake Chat Maker & Text Message, Loopclass,
  Offline Audio Transcriber, Christian Pray Everyday (`apps.*.name`, `apps.*.storeName`).
- Catalogue numbers: SNS-001, SNS-002 … (they are data, not copy).
- "Google Play", "Android", "Google Drive", "AdMob", file formats (MP3, SRT …).
- `{no}`, `{name}` placeholders: keep them exactly, move them where the grammar needs them.

Translate `meta.*` by hand: `lang` (the code above), `ogLocale` (for example `pl_PL`),
`nameNative` (the language name in that language, for example "Polski") and `short` (for example "PL").

## Tone

Plain, dry, honest. No hype, no exclamation marks, no "amazing", no invented promises.
Say what the app does and what it costs, the way a record sleeve lists tracks.
If a sentence is a claim (offline, no account, prices), keep it exactly as strong as the
English: never stronger.

## Length caps

Counted in characters (code points). `node tools/check-lang.mjs <lang>` checks them. They come
from the room each string gets at the narrowest app cover (about 112 px) and at 390 px phone width.
They are not enforced in CSS, so a longer string will wrap or be cut off on screen.

| Key | Cap | Where it shows |
|---|---|---|
| `apps.*.spine` (or `short` if no spine) | 9 | label on the narrow edge of an app cover, after the SNS number |
| `apps.*.short` | 18 | title printed on the small app cover |
| `apps.*.sticker` | 26 | round sticker on the big cover |
| `apps.*.stamps.*` | 22 | pill stamps under the Play button, desk side B |
| `apps.*.kind` | 40 | one-line description under the name |
| `apps.*.screens.*.caption` | 20 | caption under a phone screen |
| `apps.*.title` | 72 | browser tab and search result title |
| `apps.*.description` | 180 | meta description |
| `home.h1` | 32 | headline |
| `home.title` | 70 | browser tab of the home page |
| `home.description` | 200 | meta description |
| `home.onDesk` | 14 | tag under the selected app |
| `home.crateTitle` | 24 | heading of the app row |
| `home.nextSlotTitle` / `nextSlotText` | 16 / 18 | empty SNS-007 slot |
| `site.nav.*` | 14 | header navigation |
| `site.brandSub` | 30 | line under the studio name |
| `meta.short` | 5 | language code on the switcher |

Arrays (features, stamps, screens, notes) must keep the same number of items as English.
`screens.*.alt` describes what the screenshot shows; translate the description, keep the
in-app words that appear on the screen as they are on the screen.

## Glossary

The page looks like a record label's catalogue, but the words visitors read are plain.
Translate these plain terms; do not introduce record-shop jargon (crate, desk, sleeve, dig)
into instructions, headings or screen-reader labels.

| English (as shown) | Where | Guidance |
|---|---|---|
| All apps | heading of the row of app covers on the home page | plain "all apps" |
| Selected | tag under the app you picked | short adjective, max 14 characters |
| Pick an app to see its screens | hint above the row | an instruction in everyday words |
| app page | link to one app's own page | |
| catalogue | the numbered list of all apps (SNS-001 …) | the everyday word for a product catalogue |
| Side A / Side B | what the app does / how it behaves | keep "A" and "B"; "side" as on a record is fine here because the heading explains it |
| house rules | the studio's three promises | rules of the house, not legal terms |
| liner notes | the longer text about one app | use a plain word ("notes") if the record term is not common |
| More apps from the studio | list of the other apps on an app page | |

Internal names in the code (crate, desk, sleeve) are not visitor copy and are not translated.

## Hand-made pages (content/pages/)

Each file in `content/pages/en/` is one page: `{ "<key>": "<English string>" }` in page order.
Keys are a hash of the English text: never change them. Translate only the values.

- Inline markup is shown as numbered placeholders: `<em1>made properly.</em1>`, `<a1>Privacy & terms</a1>`,
  `<br1/>`, `<i2></i2>`. Keep every placeholder exactly once, with the same number; you may move
  them where the grammar needs them. Do not add HTML of your own.
- Strings used by page scripts may contain a real `<br>` (keep it) or `{n}` (a number, keep it).
- Write plain characters, not HTML entities (`&`, not `&amp;`).
- `_common.json`: `language` is the label of the language list in the footer; `legalNote` appears under
  the heading of every translated privacy policy and terms page.
- Privacy policies and terms: translate precisely and completely, no shortening, no softening, no
  added promises. Keep section numbers, dates, company names, e-mail addresses, product names,
  law names (GDPR, COPPA ...) and quoted UI labels as they are (a UI label may get a translation
  in brackets after it).
- A string that is already in another language than English on the English page (for example the
  Polish paragraph on the Pug Bubble Dig page, or Polish app names) stays exactly as it is.
- Szybciej Się Nie Da teaches English to Polish speakers. Its page says so; keep that meaning
  (do not turn it into "for speakers of <your language>").

`node tools/i18n-pages.mjs check <lang>` reports missing keys, placeholder mismatches and empty strings.
After the English pages change, `node tools/i18n-pages.mjs extract` updates `content/pages/en/`;
strings whose English changed get new keys and show up as missing in every language.

## Adding a language

1. Copy `content/en.json` to `content/<lang>.json` and translate it.
2. `node tools/check-lang.mjs <lang>` until it says OK.
3. Copy `content/pages/en/` to `content/pages/<lang>/`, translate it, `node tools/i18n-pages.mjs check <lang>` until OK.
4. Add the code to `LANGS_BUILT` in `tools/build-langs.mjs`.
5. `node tools/build.mjs`, then `node tools/i18n-pages.mjs build`. (`node tools/og.mjs` regenerates OG cards, but it also overwrites the hand-made `img/og/home-en.jpg`; restore that file from git after running it.)

The pages appear under `/<lang>/`, every page gets hreflang links, sitemap entries are added,
and the language switcher appears in the header and footer as soon as two languages are built.
