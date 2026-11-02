/*
 * LAUNCH SWITCH
 * -------------
 * APP_LIVE = false  ->  buttons read "Coming soon on Google Play" (inactive, aria-disabled)
 *                       with a short note underneath. The HTML without JS looks the same.
 * APP_LIVE = true   ->  every [data-cta] box turns into a "Get it on Google Play" link
 *                       to PLAY_URL.
 * When Mossy is live in the store, change the one line below to `true` and push.
 */
const APP_LIVE = true;
const PLAY_URL = "https://play.google.com/store/apps/details?id=com.mossyapp.mossy";

(function () {
  "use strict";

  if (APP_LIVE) {
    document.querySelectorAll("[data-cta]").forEach(function (box) {
      box.innerHTML =
        '<a class="play-badge" href="' + PLAY_URL + '" rel="noopener">' +
        '<img src="/img/badges/play-en.png" width="188" height="56" style="height:56px;width:auto;display:block" alt="Get it on Google Play"></a>';
    });
  }
})();
