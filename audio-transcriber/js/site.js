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
const APP_LIVE = false;
const PLAY_URL = "https://play.google.com/store/apps/details?id=pl.snoochiesoft.audiotranscriber";

(function () {
  "use strict";

  if (APP_LIVE) {
    var icon =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M7 4.2v15.6c0 .8.9 1.3 1.6.8l12.3-7.8c.6-.4.6-1.3 0-1.7L8.6 3.4C7.9 2.9 7 3.4 7 4.2z"/></svg>';
    document.querySelectorAll("[data-cta]").forEach(function (box) {
      var a = document.createElement("a");
      a.className = "btn btn-live";
      a.href = PLAY_URL;
      a.rel = "noopener";
      a.innerHTML = icon + "<span></span>";
      a.lastChild.textContent = box.getAttribute("data-live") || "Google Play";
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
