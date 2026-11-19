/* Pug Bubble Dig page: headlamp, depth counter, shaft line, step reveals, trailer. */
initSmooth();
const dk = document.getElementById('dark');
if (!RM) {
  // aim = where the light points: the cursor, or a slow drift on touch screens
  const aim = { x: innerWidth * .5, y: innerHeight * .4 };
  const qx = gsap.quickTo(aim, 'x', { duration: .5, ease: 'power3' }),
        qy = gsap.quickTo(aim, 'y', { duration: .5, ease: 'power3' });
  addEventListener('pointermove', e => { qx(e.clientX); qy(e.clientY); });
  if (matchMedia('(pointer:coarse)').matches) {
    const o = { a: 0 };
    gsap.to(o, { a: 6.28, duration: 7, repeat: -1, ease: 'none', onUpdate: () => {
      qx(innerWidth * (.5 + .28 * Math.cos(o.a)));
      qy(innerHeight * (.42 + .22 * Math.sin(o.a * 1.3)));
    } });
  }
  // lamp sits at ~49% / 12.7% of bigi.webp; head tilts a little towards the aim point
  const bg = document.querySelector('#bigi img'), beam = document.getElementById('beam');
  const tx = gsap.quickTo(bg, 'rotationY', { duration: .7, ease: 'power3' }),
        ty = gsap.quickTo(bg, 'rotationX', { duration: .7, ease: 'power3' });
  gsap.set(bg, { transformPerspective: 900 });
  gsap.ticker.add(() => {
    dk.style.setProperty('--x', aim.x + 'px');
    dk.style.setProperty('--y', aim.y + 'px');
    const r = bg.getBoundingClientRect();
    const visible = r.bottom > 0 && r.top < innerHeight;
    beam.classList.toggle('on', visible);
    if (!visible) return;
    const lx = r.left + r.width * .493, ly = r.top + r.height * .127;
    const dx = aim.x - lx, dy = aim.y - ly;
    beam.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';
    beam.style.setProperty('--a', Math.atan2(dy, dx) + 'rad');
    beam.style.setProperty('--len', Math.min(Math.hypot(dx, dy) + 160, 1100) + 'px');
    const cx = r.left + r.width / 2, cy = r.top + r.height * .4;
    tx(Math.max(-1, Math.min(1, (aim.x - cx) / (innerWidth * .5))) * 14);
    ty(-Math.max(-1, Math.min(1, (aim.y - cy) / (innerHeight * .5))) * 8);
  });
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
