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
  // Bigi: real head-turn frames (generated clips), expressions on idle / click. Falls back to the still image.
  const fig = document.getElementById('fig'), cv = document.getElementById('bc'), beam = document.getElementById('beam');
  const ctx = cv.getContext('2d');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const S = { px: 0, py: 0, c: 0, ready: false, mode: 'follow', ex: null, et: 0, next: 0, turn: null, up: null, down: null, exp: {}, names: [] };
  const base = 'img/bigi/';
  const load = (dir, n) => Promise.all(Array.from({ length: n }, (_, i) => new Promise(res => {
    const im = new Image(); im.decoding = 'async';
    im.onload = () => res(im); im.onerror = () => res(null);
    im.src = base + dir + '/' + String(i).padStart(2, '0') + '.webp';
  })));
  const ok = a => a.every(Boolean);
  const lampAt = (arr, p) => { const i = Math.floor(p), j = Math.min(arr.length - 1, i + 1), f = p - i; return [lerp(arr[i][0], arr[j][0], f), lerp(arr[i][1], arr[j][1], f)]; };
  fetch(base + 'manifest.json').then(r => r.json()).then(async m => {
    const [tl, tr] = await Promise.all([load('turnL', m.turnL.n), load('turnR', m.turnR.n)]);
    if (!ok(tr) || !ok(tl)) return;
    S.turn = { f: [...tl.slice().reverse(), ...tr.slice(1)], l: [...m.turnL.lamp.slice().reverse(), ...m.turnR.lamp.slice(1)] };
    S.c = tl.length - 1; S.px = S.c;
    fig.classList.add('live'); S.ready = true;
    S.next = performance.now() + 3500;
    const ld = async k => { const a = await load(k, m[k].n); return ok(a) ? { f: a, l: m[k].lamp } : null; };
    S.up = await ld('lookUp'); S.down = await ld('lookDown');
    if (navigator.connection && navigator.connection.saveData) return;
    for (const k of m.expr) { const e = await ld(k); if (e) { S.exp[k] = e; S.names.push(k); } }
  }).catch(() => {});
  const startExpr = (name) => {
    if (!S.ready || S.mode !== 'follow' || !S.names.length) return;
    S.ex = S.exp[name || S.names[Math.floor(Math.random() * S.names.length)]]; S.mode = 'center';
  };
  fig.addEventListener('pointerdown', () => startExpr());
  fig.style.cursor = 'pointer';
  let last = performance.now(), lastMove = last, lamp = [.49, .13], lastKey = '';
  addEventListener('pointermove', () => { lastMove = performance.now(); });
  gsap.set(fig, { transformPerspective: 900 });
  const tx = gsap.quickTo(fig, 'rotationY', { duration: .7, ease: 'power3' }),
        ty = gsap.quickTo(fig, 'rotationX', { duration: .7, ease: 'power3' });
  gsap.ticker.add(() => {
    dk.style.setProperty('--x', aim.x + 'px');
    dk.style.setProperty('--y', aim.y + 'px');
    const now = performance.now(), dt = Math.min(.05, (now - last) / 1000); last = now;
    const r = fig.getBoundingClientRect();
    const visible = r.bottom > 0 && r.top < innerHeight;
    beam.classList.toggle('on', visible);
    if (!visible) { dk.style.setProperty('--ly', '-2000px'); return; }
    const cx = r.left + r.width / 2, cy = r.top + r.height * .4;
    const nx = clamp((aim.x - cx) / (innerWidth * .4), -1, 1), ny = clamp((aim.y - cy) / (innerHeight * .4), -1, 1);
    tx(nx * (S.ready ? 4 : 14)); ty(-ny * (S.ready ? 5 : 8));
    if (S.ready) {
      const k = 1 - Math.exp(-dt * 9);
      // one axis at a time: looking mostly up/down centres the horizontal turn (and vice versa), so two poses never stack
      const vdom = Math.abs(ny) > Math.abs(nx) * .9 + .05;
      let tp = S.c + (vdom ? 0 : nx) * S.c, tv = vdom ? ny : 0;
      if (S.mode !== 'follow') { tp = S.c; tv = 0; }
      S.px = lerp(S.px, tp, k); S.py = lerp(S.py, tv, k);
      let frames = null, key;
      if (S.mode === 'expr') {
        S.et += dt * 18;
        const n = S.ex.f.length, t = Math.floor(S.et), idx = t < n ? t : 2 * n - 2 - t;
        if (idx < 0) { S.mode = 'follow'; S.next = now + 4000 + Math.random() * 4000; }
        else { frames = S.ex.f[idx]; lamp = S.ex.l[idx]; key = 'e' + idx + S.ex.f.length; }
      }
      if (!frames) {
        const p = clamp(S.px, 0, S.turn.f.length - 1), i = Math.round(p), f = 0; // always one crisp frame, never a cross-fade of two poses
        const vert = Math.abs(S.py) > .03 && (S.py < 0 ? S.up : S.down), w = vert && Math.abs(S.py) > Math.abs((S.px - S.c) / S.c) ? 1 : 0;
        const vi = vert ? Math.abs(S.py) * (vert.f.length - 1) : 0, vf = Math.round(vi);
        key = [i, f.toFixed(2), vert ? vf + ':' + (vi - vf).toFixed(2) + ':' + w.toFixed(2) : 0, S.py < 0].join('|');
        if (key !== lastKey) {
          ctx.clearRect(0, 0, cv.width, cv.height);
          if (w < .98) {
            ctx.drawImage(S.turn.f[i], 0, 0);
            if (f > .02 && S.turn.f[i + 1]) { ctx.globalAlpha = f; ctx.drawImage(S.turn.f[i + 1], 0, 0); ctx.globalAlpha = 1; }
          }
          if (w > .02) {
            ctx.globalAlpha = w; ctx.drawImage(vert.f[vf], 0, 0);
            const vg = vi - vf; if (vg > .02 && vert.f[vf + 1]) { ctx.globalAlpha = w * vg; ctx.drawImage(vert.f[vf + 1], 0, 0); }
            ctx.globalAlpha = 1;
          }
        }
        const lt = lampAt(S.turn.l, p);
        lamp = w > .02 ? [lerp(lt[0], vert.l[Math.min(vert.l.length - 1, Math.round(vi))][0], w), lerp(lt[1], vert.l[Math.min(vert.l.length - 1, Math.round(vi))][1], w)] : lt;
        if (S.mode === 'center' && Math.abs(S.px - S.c) < .6 && Math.abs(S.py) < .06) { S.mode = 'expr'; S.et = 0; }
        else if (S.mode === 'follow' && now > S.next && now - lastMove > 1500) startExpr();
        else if (S.mode === 'follow' && now > S.next) S.next = now + 1500;
      }
      if (frames) {
        ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(frames, 0, 0); lastKey = '';
      } else lastKey = key;
    } else lamp = [.493, .127];
    const lx = r.left + r.width * lamp[0], ly = r.top + r.height * lamp[1];
    dk.style.setProperty('--lx', lx.toFixed(1) + 'px');
    dk.style.setProperty('--ly', (ly + r.height * .17).toFixed(1) + 'px');
    const dx = aim.x - lx, dy = aim.y - ly;
    beam.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';
    beam.style.setProperty('--a', Math.atan2(dy, dx) + 'rad');
    beam.style.setProperty('--len', Math.min(Math.hypot(dx, dy) + 160, 1100) + 'px');
  });
}
if (!RM) {
  gsap.from('#h1 span', { yPercent: 60, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .14, delay: .1 });
  gsap.from('.hero p,.hero .cta,.hero .tag', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, delay: .5 });
  gsap.from('#fig', { y: 120, scale: .8, opacity: 0, duration: 1.6, ease: 'elastic.out(1,.6)', delay: .2 });
  gsap.from('.stk', { scale: 0, rotate: -30, duration: .7, ease: 'back.out(2.4)', stagger: .16, delay: 1 });
  gsap.to('#fig', { y: -14, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });
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
