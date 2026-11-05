# Translating the Snoochie Soft site

All visible copy lives in `content/en.json`. A translation is a copy of that file saved as
`content/<lang>.json` with every string translated. Facts, links and colours live in
`content/catalogue.json` and are never translated.

## Languages

English is the master. Target languages: EN, PL, DE, ES, JA, PT-BR, FR, KO, ID.

| Code | File | Output folder |
|---|---|---|
| `en` | `en.json` | site root `/` |
| `pl` | `pl.json` | `/pl/` |
| `de` | `de.json` | `/de/` |
| `es` | `es.json` | `/es/` |
| `ja` | `ja.json` | `/ja/` |
| `pt-BR` | `pt-BR.json` | `/pt-br/` |
| `fr` | `fr.json` | `/fr/` |
| `ko` | `ko.json` | `/ko/` |
| `id` | `id.json` | `/id/` |

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

## Adding a language

1. Copy `content/en.json` to `content/<lang>.json` and translate it.
2. `node tools/check-lang.mjs <lang>` until it says OK.
3. Add the code to `LANGS_BUILT` in `tools/build-langs.mjs`.
4. `node tools/build.mjs` then `node tools/og.mjs`.

The pages appear under `/<lang>/`, every page gets hreflang links, sitemap entries are added,
and the language switcher appears in the header and footer as soon as two languages are built.
