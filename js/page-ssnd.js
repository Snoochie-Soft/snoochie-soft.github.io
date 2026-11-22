/* Szybciej Się Nie Da page: hero counter, tick patterns, 50-day dial, reveals. */
initSmooth();
const SVGNS = 'http://www.w3.org/2000/svg';

/* hero tick pattern */
const tbg = document.getElementById('tbg');
let heroTicks = '';
for (let i = 0; i < 50; i++) {
  const a = i / 50 * Math.PI * 2;
  heroTicks += `<line x1="${50 + Math.cos(a) * 44}" y1="${50 + Math.sin(a) * 44}" x2="${50 + Math.cos(a) * 49}" y2="${50 + Math.sin(a) * 49}" stroke="#c9f23a" stroke-opacity=".25" stroke-width=".5" stroke-linecap="round"/>`;
}
tbg.innerHTML = heroTicks;

/* hero counter 0 -> 500 (the HTML already says 500 for crawlers and reduced motion) */
const big = document.getElementById('big');
if (!RM) {
  const o = { v: 0 };
  big.textContent = '0';
  gsap.to(o, { v: 500, duration: 2.2, ease: 'power3.out', delay: .2, onUpdate: () => { big.textContent = Math.round(o.v); } });
  gsap.from('.hero .k,.hero h1,.hero p,.hero .cta,.nav', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, delay: .5 });
  gsap.to('#tbg', { rotation: 60, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* dial */
const svg = document.getElementById('svg');
let dialTicks = '';
for (let i = 0; i < 50; i++) {
  const a = (i / 50) * Math.PI * 2 - Math.PI / 2, r1 = i % 5 === 0 ? 255 : 268, r2 = 292;
  dialTicks += `<line x1="${300 + Math.cos(a) * r1}" y1="${300 + Math.sin(a) * r1}" x2="${300 + Math.cos(a) * r2}" y2="${300 + Math.sin(a) * r2}"/>`;
}
svg.innerHTML = dialTicks;
const ticks = [...svg.querySelectorAll('line')], imgs = [...document.querySelectorAll('#phone img')],
      dots = [...document.querySelectorAll('#steps i')], wordsEl = document.getElementById('words'),
      dayEl = document.getElementById('day'), capT = document.getElementById('capT'), capS = document.getElementById('capS');
const CAP = [
  ['See the word.', 'A flashcard shows the English word.'],
  ['Flip it.', 'The back of the card gives you the meaning.'],
  ['Check yourself.', 'A quiz: pick the right Polish translation.'],
  ['Watch it add up.', 'Level, XP, streak and words learned, day after day.']
];
let lastI = -1, lastDay = 0;
function update(p) {
  const day = Math.max(1, Math.min(50, Math.ceil(p * 50)));
  if (day !== lastDay) {
    lastDay = day;
    dayEl.textContent = T('Day {n}').replace('{n}', day);
    wordsEl.textContent = day * 10;
    ticks.forEach((tk, i) => tk.classList.toggle('on', i < day));
  }
  const i = Math.min(3, Math.floor(p * 4));
  if (i !== lastI) {
    lastI = i;
    imgs.forEach((im, k) => gsap.to(im, { opacity: k === i ? 1 : 0, scale: k === i ? 1 : 1.06, duration: .5, ease: 'power2.out' }));
    dots.forEach((d, k) => d.classList.toggle('on', k <= i));
    gsap.fromTo('.cap', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5 });
    capT.textContent = T(CAP[i][0]);
    capS.textContent = T(CAP[i][1]);
  }
}
if (RM) {
  update(.99);
} else {
  update(0);
  ScrollTrigger.create({ trigger: '#dial', start: 'top top', end: 'bottom bottom', onUpdate: s => update(s.progress) });
  gsap.to('.ring', { rotation: 36, ease: 'none', scrollTrigger: { trigger: '#dial', start: 'top top', end: 'bottom bottom', scrub: true } });
}

/* reveals */
if (!RM) {
  gsap.from('.paper h2,.paper .lead', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.paper', start: 'top 70%' } });
  gsap.from('.rules div', { y: 80, opacity: 0, rotate: 2, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.rules', start: 'top 88%' } });
  gsap.from('.shots h2,.shots p', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.shots', start: 'top 75%' } });
  gsap.from('.row figure', { y: 110, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '.row', start: 'top 85%' } });
  gsap.from('.know h2,.know .cols > div', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.know', start: 'top 75%' } });
  gsap.from('.fin .num', { yPercent: 30, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.fin', start: 'top 80%' } });
  gsap.from('.fin h2,.fin .cta', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.fin', start: 'top 75%' } });
}
