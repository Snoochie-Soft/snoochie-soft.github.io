/* Pug Bubble Dig page: headlamp, depth counter, shaft line, step reveals, trailer. */
initSmooth();
const dk = document.getElementById('dark');
if (!RM) {
  const qx = gsap.quickTo(dk, '--x', { duration: .6, ease: 'power3', unit: 'px' }),
        qy = gsap.quickTo(dk, '--y', { duration: .6, ease: 'power3', unit: 'px' });
  addEventListener('pointermove', e => { qx(e.clientX); qy(e.clientY); });
  if (matchMedia('(pointer:coarse)').matches) {
    const o = { a: 0 };
    gsap.to(o, { a: 6.28, duration: 7, repeat: -1, ease: 'none', onUpdate: () => {
      dk.style.setProperty('--x', (innerWidth * (.5 + .28 * Math.cos(o.a))) + 'px');
      dk.style.setProperty('--y', (innerHeight * (.42 + .22 * Math.sin(o.a * 1.3))) + 'px');
    } });
  }
}
if (!RM) {
  gsap.from('#h1 span', { yPercent: 60, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .14, delay: .1 });
  gsap.from('.hero p,.hero .cta,.hero .tag', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, delay: .5 });
  gsap.from('#bigi img', { y: 120, scale: .8, opacity: 0, duration: 1.6, ease: 'elastic.out(1,.6)', delay: .2 });
  gsap.from('.stk', { scale: 0, rotate: -30, duration: .7, ease: 'back.out(2.4)', stagger: .16, delay: 1 });
  gsap.to('#bigi img', { y: -14, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });
  gsap.to('#bigi', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}
const depth = document.getElementById('m'), bar = document.getElementById('bar'), ln = document.getElementById('ln');
ScrollTrigger.create({ trigger: document.body, start: 'top top', end: 'bottom bottom', onUpdate: s => {
  depth.textContent = Math.round(s.progress * 5000);
  bar.style.setProperty('--p', s.progress);
} });
if (!RM) {
  gsap.to(ln, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#shaft', start: 'top 60%', end: 'bottom 60%', scrub: .4 } });
  document.querySelectorAll('.step').forEach(s => {
    const even = s.matches(':nth-child(even)');
    gsap.from(s.querySelector('.txt'), { x: even ? 60 : -60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 70%' } });
    gsap.from(s.querySelector('.ph'), { y: 90, rotate: even ? 5 : -5, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 70%' } });
    gsap.from(s.querySelector('.node'), { scale: 0, duration: .6, ease: 'back.out(3)', scrollTrigger: { trigger: s, start: 'top 55%' } });
  });
  gsap.from('.mus h2,.mus p,.chips', { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.mus', start: 'top 65%' } });
  gsap.from('.mus .ph', { x: 80, rotate: 6, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.mus', start: 'top 65%' } });
  gsap.from('.fin h2', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.fin', start: 'top 70%' } });
  gsap.from('.fin img.bg', { yPercent: 60, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.fin', start: 'top 60%' } });
}
const pv = document.getElementById('pv'), vp = document.getElementById('vplay');
vp.addEventListener('click', () => {
  if (pv.paused) { pv.play(); vp.textContent = 'Pause trailer'; vp.setAttribute('aria-pressed', 'true'); }
  else { pv.pause(); vp.textContent = 'Play trailer'; vp.setAttribute('aria-pressed', 'false'); }
});
