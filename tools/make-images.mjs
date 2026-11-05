// One-off raster pipeline: resizes store screenshots and icons into per-app img/ folders.
// Uses headless Chrome canvas (no npm dependencies in this repo).
// Usage: node tools/make-images.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("E:/tools/cdp/node_modules/playwright-core");
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const FC = "E:/Apps/fake-chat-maker/fastlane/metadata/android/en-US/images";
const LC = "E:/Apps/loopclass/fastlane/metadata/android/en-US/images";
const CP = "E:/MOJE PROJEKTY/ChristianPrayiOS/ChristianPrayEveryday/fastlane/metadata/android/en-US/images";

// [source, target (relative to repo), width, mime]
const JOBS = [
  [`${FC}/phoneScreenshots/01_editor.png`, "fakechat/img/screen-editor.webp", 600, "image/webp"],
  [`${FC}/phoneScreenshots/02_style.png`, "fakechat/img/screen-style.webp", 600, "image/webp"],
  [`${FC}/phoneScreenshots/04_home.png`, "fakechat/img/screen-home.webp", 600, "image/webp"],
  [`${FC}/icon.png`, "fakechat/img/icon-192.png", 192, "image/png"],
  [`${LC}/phoneScreenshots/01_light_03_week.png`, "loopclass/img/screen-week.webp", 600, "image/webp"],
  [`${LC}/phoneScreenshots/02_dark_02_today_scrolled.png`, "loopclass/img/screen-today-dark.webp", 600, "image/webp"],
  [`${LC}/phoneScreenshots/03_light_04_tasks.png`, "loopclass/img/screen-tasks.webp", 600, "image/webp"],
  [`${LC}/icon.png`, "loopclass/img/icon-192.png", 192, "image/png"],
  [`${CP}/phoneScreenshots/1_today.png`, "christian-pray/img/screen-today.webp", 600, "image/webp"],
  [`${CP}/phoneScreenshots/2_quotes.png`, "christian-pray/img/screen-verses.webp", 600, "image/webp"],
  [`${CP}/phoneScreenshots/3_pray.png`, "christian-pray/img/screen-prayers.webp", 600, "image/webp"],
  [`${CP}/icon.png`, "christian-pray/img/icon-192.png", 192, "image/png"],
  ["audio-transcriber/img/icon-512.png", "audio-transcriber/img/icon-192.png", 192, "image/png"],
];

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  const page = await browser.newPage();
  await page.setContent("<!doctype html><title>x</title>");
  for (const [src, out, width, mime] of JOBS) {
    const abs = /^[A-Z]:/.test(src) ? src : resolve(ROOT, src);
    const dataUrl = "data:image/png;base64," + readFileSync(abs).toString("base64");
    const res = await page.evaluate(async ({ dataUrl, width, mime }) => {
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const w = Math.min(width, img.naturalWidth);
      const h = Math.round(img.naturalHeight * (w / img.naturalWidth));
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      return { url: c.toDataURL(mime, 0.84), w, h };
    }, { dataUrl, width, mime });
    const target = resolve(ROOT, out);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, Buffer.from(res.url.split(",")[1], "base64"));
    console.log(`${out}  ${res.w}x${res.h}`);
  }
} finally {
  await browser.close();
}
