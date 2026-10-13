/*
 * LAUNCH SWITCH
 * -------------
 * APP_LIVE = false  ->  buttons read "Coming soon on Google Play" (inactive, aria-disabled)
 *                       with a short note underneath. The HTML without JS looks the same.
 * APP_LIVE = true   ->  every [data-cta] box turns into a "Get it on Google Play" link
 *                       to PLAY_URL.
 * When Mossy is live in the store, change the one line below to `true` and push.
 */
const APP_LIVE = false;
const PLAY_URL = "https://play.google.com/store/apps/details?id=com.mossyapp.mossy";

(function () {
  "use strict";

  if (APP_LIVE) {
    document.querySelectorAll("[data-cta]").forEach(function (box) {
      box.innerHTML =
        '<a class="btn btn-live" href="' + PLAY_URL + '" rel="noopener">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 3.6v16.8c0 .8.9 1.3 1.6.9l14-8.4c.6-.4.6-1.3 0-1.7l-14-8.4C6.9 2.3 6 2.8 6 3.6z"/></svg>' +
        "Get it on Google Play</a>";
    });
  }
})();
