/* Shared helpers for the redesign mockups (GSAP 3.13 + ScrollTrigger + Lenis, all local) */
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
window.splitChars = function (el) {
  const t = el.textContent;
  el.setAttribute('aria-label', t);
  el.innerHTML = t.split(' ').map(w => '<span class="w" aria-hidden="true" style="display:inline-block;white-space:nowrap">' +
    [...w].map(c => '<span class="ch" style="display:inline-block">' + c + '</span>').join('') + '</span>').join(' ');
  return el.querySelectorAll('.ch');
};
window.splitWords = function (el) {
  const t = el.textContent.trim();
  el.setAttribute('aria-label', t);
  el.innerHTML = t.split(/\s+/).map(w => '<span class="wm" aria-hidden="true" style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em"><span class="wi" style="display:inline-block">' + w + '</span></span>').join(' ');
  return el.querySelectorAll('.wi');
};
window.el = function (html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
window.badge = function () { return '<img class="badge" src="' + PLAY_BADGE + '" alt="Get it on Google Play" height="52">'; };
/* simple count-up preloader helper: counts 0..100, calls done() */
window.counter = function (node, ms, done) {
  const o = { v: 0 };
  gsap.to(o, { v: 100, duration: ms, ease: 'power2.inOut', onUpdate: () => node.textContent = String(Math.round(o.v)).padStart(3, '0'), onComplete: done });
};
