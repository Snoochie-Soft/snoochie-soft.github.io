/*
 * LAUNCH SWITCH
 * -------------
 * APP_LIVE = false  ->  every [data-cta] box shows "Coming soon on Google Play" (not a link,
 *                       aria-disabled). The HTML without JS looks the same.
 * APP_LIVE = true   ->  every [data-cta] box becomes a link to PLAY_URL, labelled with the
 *                       box's data-live text ("Get it on Google Play" in the page language),
 *                       and the pre-launch "tell me when it is out" mail links disappear.
 * When the app is live in the store, change the one line below to `true` and push.
 */
const APP_LIVE = true;
const PLAY_URL = "https://play.google.com/store/apps/details?id=pl.snoochiesoft.audiotranscriber";

(function () {
  "use strict";

  if (APP_LIVE) {
    var lang = (document.documentElement.lang || "en").toLowerCase();
    var badge = { pl: "pl", de: "de", es: "es-419", fr: "fr", "pt-br": "pt-br" }[lang] || "en";
    document.querySelectorAll("[data-cta]").forEach(function (box) {
      var a = document.createElement("a");
      a.className = "play-badge";
      a.href = PLAY_URL;
      a.rel = "noopener";
      var img = document.createElement("img");
      img.src = "/img/badges/play-" + badge + ".png";
      img.width = 188; img.height = 56;
      img.style.cssText = "height:56px;width:auto;display:block";
      img.alt = box.getAttribute("data-live") || "Google Play";
      a.appendChild(img);
      box.replaceChildren(a);
    });
    // The "tell me when it is out" mail links only make sense before launch.
    document.querySelectorAll("[data-soon-only]").forEach(function (el) { el.remove(); });
  }

  // Close the language menu on Escape or when clicking outside it.
  document.querySelectorAll("details.lang").forEach(function (d) {
    document.addEventListener("click", function (e) {
      if (d.open && !d.contains(e.target)) d.open = false;
    });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && d.open) {
        d.open = false;
        d.querySelector("summary").focus();
      }
    });
  });
})();
