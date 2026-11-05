# Raster provenance

One line per raster shipped by the label redesign (home, six app pages, 404).
New files were resized with `tools/make-images.mjs` (headless Chrome canvas); OG cards come from `tools/og.mjs`.

## Studio
- `apple-touch-icon.png` (studio mark, 180x180): existing site file, unchanged; same bytes as `_proto/assets/studio-mark.png`.
- `img/badges/play-en.png`: existing Google Play badge, unchanged.
- `img/og/home-en.jpg`: rendered by `tools/og.mjs` from the site CSS and the authored SVG covers (no photo or AI imagery).
- `img/og/{ssnd,mossy,fakechat,loopclass,transcriber,christianpray}-en.jpg`: rendered by `tools/og.mjs` (cover art is authored SVG, icons as below).

## SNS-001 Szybciej Się Nie Da
- `szybciej-sie-nie-da/img/icon-192.png`, `fiszka-przod.webp`, `quiz.webp`, `statystyki.webp`: existing site files (in-app screenshots already on the old page), unchanged.

## SNS-002 Mossy
- `mossy/img/icon-192.png`, `mossy/img/shots/hub.webp`, `time-blind-holding.webp`, `new-brain-paper.webp`: existing site files (app goldens and hub screenshot), unchanged.

## SNS-003 Fake Chat Maker
- `fakechat/img/screen-editor.webp`: store screenshot `E:/Apps/fake-chat-maker/fastlane/metadata/android/en-US/images/phoneScreenshots/01_editor.png`, resized to 600 px.
- `fakechat/img/screen-style.webp`: store screenshot `.../phoneScreenshots/02_style.png`, resized to 600 px.
- `fakechat/img/screen-home.webp`: store screenshot `.../phoneScreenshots/04_home.png`, resized to 600 px.
- `fakechat/img/icon-192.png`: store icon `E:/Apps/fake-chat-maker/fastlane/metadata/android/en-US/images/icon.png`, resized.

## SNS-004 Loopclass
- `loopclass/img/screen-week.webp`: store screenshot `E:/Apps/loopclass/fastlane/metadata/android/en-US/images/phoneScreenshots/01_light_03_week.png`, 600 px.
- `loopclass/img/screen-today-dark.webp`: store screenshot `.../phoneScreenshots/02_dark_02_today_scrolled.png`, 600 px.
- `loopclass/img/screen-tasks.webp`: store screenshot `.../phoneScreenshots/03_light_04_tasks.png`, 600 px.
- `loopclass/img/icon-192.png`: store icon `E:/Apps/loopclass/fastlane/metadata/android/en-US/images/icon.png`, resized.

## SNS-005 Offline Audio Transcriber
- `audio-transcriber/img/screens/en/01.webp`, `02.webp`, `03.webp`: existing site files (EN app screenshots), unchanged.
- `audio-transcriber/img/icon-192.png`: resized from the existing `audio-transcriber/img/icon-512.png`.

## SNS-006 Christian Pray Everyday
- `christian-pray/img/screen-today.webp`: store screenshot `E:/MOJE PROJEKTY/ChristianPrayiOS/ChristianPrayEveryday/fastlane/metadata/android/en-US/images/phoneScreenshots/1_today.png`, 600 px.
- `christian-pray/img/screen-verses.webp`: store screenshot `.../phoneScreenshots/2_quotes.png`, 600 px.
- `christian-pray/img/screen-prayers.webp`: store screenshot `.../phoneScreenshots/3_pray.png`, 600 px.
- `christian-pray/img/icon-192.png`: store icon `.../images/icon.png`, resized.

## Fonts (not raster, listed for completeness)
- `fonts/unbounded-*.woff2`, `fonts/schibsted-grotesk-*.woff2`, `fonts/martian-mono-*.woff2`: @fontsource-variable packages from jsDelivr; licences `fonts/OFL-*.txt`.
