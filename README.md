# snoochie-soft.github.io

Statyczna strona studia **Snoochie Soft** i stron produktowych jego aplikacji. Bez frameworka
i bez kroku budowania: GitHub Pages serwuje pliki tak, jak leżą (`.nojekyll` wyłącza Jekylla).

## Struktura

| Adres | Plik | Co to jest |
|---|---|---|
| `/` | `index.html`, `css/studio.css`, `js/studio.js` | Strona studia (PL + krótkie EN): dwie karty aplikacji, o studiu, kontakt |
| `/szybciej-sie-nie-da/` | `szybciej-sie-nie-da/` | Strona „Szybciej Się Nie Da” (przeniesiona z `/` bez zmian w treści i wyglądzie) |
| `/mossy/` | `mossy/index.html`, `mossy/css/mossy.css`, `mossy/js/site.js` | Strona Mossy (EN) |
| `/mossy/privacy/` | `mossy/privacy/index.html` | Polityka prywatności Mossy (URL podany w Google Play i w `app_config.json` aplikacji) |
| dowolny brak | `404.html` | Strona 404 studia, ścieżki absolutne, linki do obu aplikacji |

Pozostałe pliki w katalogu głównym:

- `app-ads.txt` — **nie usuwać ani nie zmieniać**: jedna linia dla AdMob (Szybciej Się Nie Da). Musi leżeć w katalogu głównym domeny.
- `fonts/` — Manrope (latin + latin-ext), wspólna dla strony studia, 404 i Szybciej; licencja `fonts/OFL.txt`.
- `img/og.jpg` — grafika udostępniania strony studia (1200×630).
- `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png` — znak studia („S.”). Każda aplikacja ma własne ikony w swoim folderze.
- `robots.txt`, `sitemap.xml` — sitemap zawiera wszystkie cztery strony.

Mossy trzyma wszystko u siebie: `mossy/fonts/` (Bricolage Grotesque + Atkinson Hyperlegible Next,
WOFF2 z plików aplikacji, licencje OFL obok), `mossy/img/` (Mo, rośliny gier, tła lasu,
zrzuty ekranu z goldenów i `01_hub.png`, `og.jpg` 1200×630, ikony). Strona studia pożycza z niego
czcionkę Bricolage i grafiki do karty Mossy.

Wszystko jest hostowane lokalnie: żadnych CDN-ów, Google Fonts ani zewnętrznych skryptów.

## Przełączniki premiery: `APP_LIVE`

Każda aplikacja ma własny przełącznik na górze swojego `js/site.js`.

| Aplikacja | Plik | Link po włączeniu |
|---|---|---|
| Szybciej Się Nie Da | `szybciej-sie-nie-da/js/site.js` | `https://play.google.com/store/apps/details?id=pl.szybciejsienieda.app` |
| Mossy | `mossy/js/site.js` | `https://play.google.com/store/apps/details?id=com.mossyapp.mossy` |

```js
const APP_LIVE = false;
```

- `false` (teraz): przyciski „Wkrótce w Google Play” / „Coming soon on Google Play” są nieaktywne
  (`aria-disabled`), pod nimi krótka notka o zbliżającej się premierze.
- `true`: wszystkie bloki `[data-cta]` na danej stronie (hero i zamknięcie) zamieniają się w link
  „Pobierz z Google Play” / „Get it on Google Play”.

Po publikacji w sklepie: zmień na `true`, commit, push. HTML bez JS pokazuje stan „wkrótce”, więc
jeśli link ma działać także bez JavaScriptu, podmień też dwa bloki `[data-cta]` w `index.html` danej aplikacji.

## Polityka prywatności Mossy

`mossy/privacy/index.html` to dosłowny tekst z `docs/privacy-policy.md` w repo aplikacji Mossy
(nagłówki, listy, pogrubienia przepisane 1:1 na HTML). Przy zmianie polityki zaktualizuj treść
w `<article class="doc">` i datę „Last updated”.

## Podgląd lokalny

Z katalogu repozytorium:

```
py -m http.server 8000
```

i otwórz http://localhost:8000/ (studio), http://localhost:8000/szybciej-sie-nie-da/,
http://localhost:8000/mossy/ i http://localhost:8000/mossy/privacy/. Lokalny serwer nie podaje
`404.html` sam z siebie; podejrzyj ją pod http://localhost:8000/404.html.
Motyw jasny i ciemny przełącza się ustawieniem systemu (`prefers-color-scheme`).

## Uwaga o źródle Szybciej

Wcześniej źródło strony Szybciej leżało w repo aplikacji w `docs/site/` i kopiowało się je do
katalogu głównego tego repo. Teraz strona żyje w `szybciej-sie-nie-da/` i ma ścieżki względne
(`css/site.css`, `img/…`, `../fonts/…`). Kopiując zmiany z `docs/site/`, wrzucaj je do tego folderu,
nie do katalogu głównego, i nie nadpisuj ścieżek ani adresów `canonical`/`og:`.
