/* Mossy page: orbiting plants, spinning ring, pinned story, reveals. */
initSmooth();
const orbit = document.getElementById('orbit');
const items = [...orbit.querySelectorAll('img')].map((im, i, all) => ({
  im, a: i / all.length * Math.PI * 2, r: .35 + (i % 2) * .05, sp: .1 + (i % 3) * .03
}));
function place(time) {
  items.forEach(o => {
    const a = o.a + time * o.sp, R = o.r * orbit.clientWidth * .98;
    o.im.style.transform = `translate(${Math.cos(a) * R}px,${Math.sin(a) * R * .62}px) rotate(${Math.sin(a * 2) * 10}deg)`;
    o.im.style.zIndex = Math.sin(a) > 0 ? 4 : 0;
  });
}
let clock = 0;
if (!RM) gsap.ticker.add((t, dt) => { clock += dt / 1000; place(clock); });
else place(0);

const ring = document.getElementById('ring');
if (!RM) {
  const spin = gsap.to(ring, { rotation: 360, duration: 36, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
  ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom top', onUpdate: s => spin.timeScale(1 + Math.abs(s.getVelocity()) / 400) });
  const mo = document.getElementById('mo');
  addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    gsap.to(mo, { x: x * 40, y: y * 26, rotate: x * 8, duration: 1.1, ease: 'power3' });
  });
  gsap.from(mo, { scale: .2, rotate: -30, opacity: 0, duration: 1.6, ease: 'elastic.out(1,.55)', delay: .2 });
  gsap.from('#h1', { yPercent: 60, opacity: 0, duration: 1.4, ease: 'expo.out', delay: .4 });
  gsap.from('.hero .sub,.hero .cta,.nav', { y: -20, opacity: 0, duration: 1, ease: 'expo.out', delay: .6, stagger: .08 });
  gsap.from(items.map(o => o.im), { scale: 0, duration: 1.2, ease: 'back.out(2)', stagger: .08, delay: .7 });
}

const lines = [...document.querySelectorAll('.line')], mos = [...document.querySelectorAll('#moBig img')],
      dots = [...document.querySelectorAll('#count i')], blob = document.getElementById('blob');
// blob colours come from the current theme (--b1..--b5 in page-mossy.css)
const blobCol = i => getComputedStyle(document.documentElement).getPropertyValue('--b' + (i + 1)).trim();
let cur = -1;
// each Mo pose is a still first; its animated clip (about 1 MB) loads when that step or the one before it is shown
const hi = document.querySelector('#moBig .hi');
let near = false;
const wake = i => {
  clip(i); clip(i + 1);
  gsap.killTweensOf(hi);
  if (i === 0) gsap.fromTo(hi, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .55, ease: 'back.out(3)', delay: 1.6 });
  else gsap.to(hi, { scale: 0, opacity: 0, duration: .25 });
};
const clip = k => { const m = mos[k]; if (!m || !m.dataset.clip) return; const im = new Image(); im.onload = () => { m.src = im.src; }; im.src = m.dataset.clip; delete m.dataset.clip; };
function show(i) {
  if (i === cur) return;
  cur = i;
  lines.forEach((l, k) => gsap.to(l, { opacity: k === i ? 1 : 0, y: k === i ? 0 : (k < i ? -40 : 40), duration: .7, ease: 'expo.out' }));
  mos.forEach((m, k) => gsap.to(m, { opacity: k === i ? 1 : 0, scale: k === i ? 1 : .85, rotate: k === i ? 0 : (k < i ? -8 : 8), duration: .7, ease: 'expo.out' }));
  dots.forEach((d, k) => d.classList.toggle('on', k <= i));
  if (near) wake(i);
  gsap.to(blob, { backgroundColor: blobCol(i), duration: .8 });
}
if (RM) {
  // layout handled in CSS (prefers-reduced-motion block)
} else {
  ScrollTrigger.create({ trigger: '#story', start: 'top top', end: 'bottom bottom', onUpdate: s => show(Math.min(4, Math.floor(s.progress * 5))) });
  gsap.set(lines, { opacity: 0 });
  show(0);
  // clips and the "Hi!" bubble start only when the story is about to be on screen
  ScrollTrigger.create({ trigger: '#story', start: 'top 35%', once: true, onEnter: () => { near = true; wake(cur); } });
  gsap.to('#blob', { rotation: 90, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '#story', start: 'top top', end: 'bottom bottom', scrub: true } });
}

if (!RM) {
  gsap.from('.shelf h2,.shelf p', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.shelf', start: 'top 75%' } });
  gsap.from('.jar .pot', { y: 120, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .05, clearProps: 'all', scrollTrigger: { trigger: '#board', start: 'top 85%' } });
  gsap.from('.phones h2,.phones p', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.phones', start: 'top 75%' } });
  gsap.from('.ph', { y: 110, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '#row', start: 'top 85%' } });
  gsap.from('.know h2,.know .cols > div', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.know', start: 'top 75%' } });
  gsap.from('.fin h2,.fin .cta', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.fin', start: 'top 80%' } });
  gsap.from('.fin .wave', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.fin', start: 'top 60%' } });
}

// touch screens have no hover: a tap shows the jar's name, a tap elsewhere hides it
const jars = [...document.querySelectorAll('.jar')];
if (matchMedia('(hover: none)').matches) {
  document.addEventListener('click', e => {
    const j = e.target.closest && e.target.closest('.jar');
    jars.forEach(x => x.classList.toggle('on', x === j && !x.classList.contains('on')));
  });
}

// the shelf grows while it scrolls into view: sprout -> half -> full plant, like in the app
if (!RM) {
  document.querySelectorAll('.board').forEach(board => {
    const js = [...board.querySelectorAll('.jar')];
    const grow = p => js.forEach((j, k) => {
      const v = p * 1.3 - k * .04;
      const g = v < .34 ? 0 : v < .67 ? 1 : 2;
      if (j.dataset.g !== String(g)) j.dataset.g = g;
    });
    grow(0);
    ScrollTrigger.create({ trigger: board, start: 'top 85%', end: 'bottom 45%', onUpdate: s => grow(s.progress), onRefresh: s => grow(s.progress), onLeave: () => grow(1) });
  });
}

// trailer: sound starts only on a click; back to the poster when it ends; the Play badge in the end card is a real link
const mv = document.getElementById('mv');
if (mv) {
  const frame = mv.closest('.frame'), btn = document.getElementById('vplay'), hot = frame.querySelector('.vhot');
  const state = on => { frame.classList.toggle('playing', on); btn.textContent = on ? 'Pause' : 'Play with sound'; btn.setAttribute('aria-pressed', on); };
  const toggle = () => { if (mv.paused) { mv.muted = false; mv.play(); } else mv.pause(); };
  btn.addEventListener('click', toggle);
  frame.addEventListener('click', e => { if (!e.target.closest('.vhot')) toggle(); });
  mv.addEventListener('play', () => state(true));
  mv.addEventListener('pause', () => state(false));
  mv.addEventListener('ended', () => { state(false); hot.hidden = true; mv.load(); btn.textContent = 'Watch again'; });
  mv.addEventListener('timeupdate', () => { hot.hidden = !(mv.currentTime > 26.2 && !mv.ended); });   // the badge is on screen in the end card from ~26 s
  hot.addEventListener('click', () => mv.pause());
  new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting && !mv.paused) mv.pause(); }), { threshold: .2 }).observe(frame);
}

// the closing section fills the screen above the footer, so Mo stands as tall as the space allows
const finH = () => document.documentElement.style.setProperty('--finh', Math.max(560, innerHeight - document.querySelector('footer').offsetHeight) + 'px');
finH(); addEventListener('resize', finH);
