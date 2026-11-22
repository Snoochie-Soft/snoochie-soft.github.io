/* Motion helpers for the app pages: GSAP + ScrollTrigger + Lenis are loaded from /vendor/. */
/* Strings written by page scripts: translated pages carry <script id="i18n-js"> (tools/i18n-pages.mjs). */
window.T = (function () { var m = {}; try { m = JSON.parse(document.getElementById("i18n-js").textContent); } catch (e) {} return function (s) { return m[s] || s; }; })();
window.RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
window.initSmooth = function (opts) {
  gsap.registerPlugin(ScrollTrigger);
  if (RM) return null;
  const l = new Lenis(Object.assign({ lerp: 0.09, smoothWheel: true }, opts || {}));
  l.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => l.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return l;
};
