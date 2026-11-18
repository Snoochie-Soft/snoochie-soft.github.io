/* Motion helpers for the app pages: GSAP + ScrollTrigger + Lenis are loaded from /vendor/. */
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
