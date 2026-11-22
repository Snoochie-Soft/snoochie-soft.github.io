/* Pug Bubble Dig page: dark cave, headlamp, Bigi jumps into the bucket and rides the rope down past the eras. */
const lenis = initSmooth();
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a, b) => a + Math.random() * (b - a);
const dk = $('#dark'), beam = $('#beam'), fig = $('#fig'), cv = $('#bc'), bigi = $('#bigi');
const bk = $('#bucket'), sw = bk.querySelector('.sw'), pc = $('#pc'), pctx = pc.getContext('2d');
const BJ = { w: 508, h: 970, rope: .5148 };   // bucket sprite size and where the rope hangs (img/bucket.json); Bigi rides in canvas #pc between the back and front layers
const small = () => innerWidth <= 860;

/* below-the-fold pictures (trailer poster, level screenshots, museum, rock overhang, finale) are fetched about 600px before they scroll into view, so none of them is part of the page load; their width/height attributes reserve the space meanwhile */
{
  const lazyEls = $$('[data-src],[data-poster]');
  const reveal = el => { if (el.dataset.src) el.src = el.dataset.src; if (el.dataset.poster) el.poster = el.dataset.poster; };
  if ('IntersectionObserver' in window) {
    const lio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(e.target); lio.unobserve(e.target); } }), { rootMargin: '600px 0px' });
    lazyEls.forEach(el => lio.observe(el));
  } else lazyEls.forEach(reveal);
}

/* ---------- era walls: glints on the shiny spots + per-era particles ---------- */
const GL = [];   // every glint: { el, band }
const bands = $$('.era');
const ERA = {
  beyond:      { c: ['#7ff3ff', '#ff7bf0'], p: [{ n: 14, an: 'rise', z: [3, 7], d: [5, 9], h: [80, 170], dx: [-20, 20], o: .9, pc: ['#5ff3ff', '#ff6bf2'] }] },
  industrial:  { c: ['#ffd36a'], p: [{ n: 6, an: 'steam', cls: 'st', z: [14, 26], d: [4, 7], h: [110, 210], dx: [-18, 22], o: .32 }, { n: 8, an: 'rise', z: [3, 4], d: [1.6, 3], h: [60, 130], dx: [-26, 26], o: 1 }] },
  baroque:     { c: ['#ffe08a'], p: [{ n: 14, an: 'drift', z: [3, 6], d: [3, 6], h: [-34, -8], dx: [-16, 16], o: .95 }] },
  renaissance: { c: ['#ffe3a0'], p: [{ n: 12, an: 'drift', z: [4, 9], d: [7, 12], h: [-50, 30], dx: [-44, 44], o: .55 }] },
  medieval:    { c: ['#ffb45a'], p: [{ n: 14, an: 'rise', z: [3, 5], d: [3, 6], h: [100, 220], dx: [-34, 34], o: 1 }] },
  greece:      { c: ['#fff0b8'], p: [{ n: 12, an: 'drift', z: [3, 6], d: [6, 10], h: [-40, 10], dx: [-30, 30], o: .8 }] },
  egypt:       { c: ['#ffd24a'], p: [{ n: 16, an: 'fall', z: [2, 4], d: [3, 6], h: [90, 230], dx: [-10, 10], o: .85 }] },
};
const buildEras = gl => bands.forEach(b => {
  const k = b.dataset.e, cfg = ERA[k], cvEl = b.querySelector('.cv');
  (gl[k] || []).forEach(([x, y, s], i) => {
    const e = document.createElement('i');
    e.className = 'gl';
    e.style.cssText = `left:${x * 100}%;top:${y * 100}%;--s:${s};--c:${cfg.c[i % cfg.c.length]};--dl:${(-rnd(0, 3)).toFixed(2)}s;--dd:${rnd(2.4, 4.2).toFixed(2)}s`;
    cvEl.appendChild(e); GL.push({ el: e, band: b, k: -1 });
  });
  const f = small() ? .5 : 1;
  cfg.p.forEach(pc => {
    for (let i = 0; i < Math.round(pc.n * f); i++) {
      const e = document.createElement('i'), side = i % 2 ? 1 : 0;
      e.className = 'p' + (pc.cls ? ' ' + pc.cls : '');
      const x = side ? rnd(79, 97) : rnd(3, 21);
      e.style.cssText = `left:${x.toFixed(1)}%;top:${rnd(8, 92).toFixed(1)}%;--an:${pc.an};--z:${rnd(...pc.z).toFixed(1)}px;--d:${rnd(...pc.d).toFixed(2)}s;--dl:${(-rnd(0, pc.d[1])).toFixed(2)}s;--h:${rnd(...pc.h).toFixed(0)}px;--dx:${rnd(...pc.dx).toFixed(0)}px;--o:${pc.o}` + (pc.pc ? `;--pc:${pc.pc[i % pc.pc.length]}` : '');
      b.appendChild(e);
    }
  });
});
$$('.hero .gl').forEach(e => { e.style.setProperty('--dl', (-rnd(0, 3)).toFixed(2) + 's'); e.style.setProperty('--dd', rnd(2.6, 4.6).toFixed(2) + 's'); GL.push({ el: e, band: $('.hero'), k: -1 }); });
fetch('img/eras/glints.json').then(r => r.json()).then(buildEras).catch(() => {});
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('on', e.isIntersecting)), { rootMargin: '80px 0px' });
  bands.forEach(b => io.observe(b)); io.observe($('.hero'));
} else { bands.forEach(b => b.classList.add('on')); $('.hero').classList.add('on'); }

/* ---------- depth meter + current era ---------- */
const depth = $('#m'), bar = $('#bar'), eraLbl = $('#era');
let curEra = '';
const setEra = t => { if (t === curEra) return; curEra = t; eraLbl.textContent = t; if (!RM) gsap.fromTo(eraLbl, { scale: 1.4, opacity: .3 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(3)' }); };
const walls = $('#walls');
ScrollTrigger.create({ trigger: document.body, start: 'top top', end: 'bottom bottom', onUpdate: s => {
  depth.textContent = Math.round(s.progress * 5000);
  bar.style.setProperty('--p', s.progress);
  const wr = walls.getBoundingClientRect(), mid = innerHeight / 2;
  if (wr.top > mid) return setEra('Cave');
  if (wr.bottom < mid) return setEra('Treasure');
  const b = bands.find(b => { const r = b.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
  if (b) setEra(b.dataset.n);
} });

/* while the trailer plays, Bigi watches it: the light aims at the video frame instead of the cursor */
let watch = null;
const ptr = { x: innerWidth * .5, y: innerHeight * .4 };
addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; });

if (!RM) {
  /* aim = where the light points: the cursor, or a slow drift on touch screens */
  const aim = { x: innerWidth * .5, y: innerHeight * .4 };
  const qx = gsap.quickTo(aim, 'x', { duration: .5, ease: 'power3' }),
        qy = gsap.quickTo(aim, 'y', { duration: .5, ease: 'power3' });
  addEventListener('pointermove', e => { if (!watch) { qx(e.clientX); qy(e.clientY); } });
  if (matchMedia('(pointer:coarse)').matches) {
    const o = { a: 0 };
    gsap.to(o, { a: 6.28, duration: 7, repeat: -1, ease: 'none', onUpdate: () => {
      if (watch) return;
      qx(innerWidth * (.5 + .34 * Math.cos(o.a)));
      qy(innerHeight * (.42 + .24 * Math.sin(o.a * 1.3)));
    } });
  }

  /* ---------- Bigi on the hero: real head-turn frames (generated clips), expressions on idle / click ---------- */
  const ctx = cv.getContext('2d');
  const paint = im => { ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(im, 0, 0); pctx.clearRect(0, 0, pc.width, pc.height); pctx.drawImage(im, 0, 0, pc.width, pc.height); };
  // dissolve from frame a to frame b (k 0..1): b underneath at full strength, a fading out on top, so Bigi never turns see-through
  const mix = (a, b, k) => {
    for (const [c, w, h] of [[ctx, cv.width, cv.height], [pctx, pc.width, pc.height]]) {
      c.clearRect(0, 0, w, h); c.drawImage(b, 0, 0, w, h); c.globalAlpha = 1 - k; c.drawImage(a, 0, 0, w, h); c.globalAlpha = 1;
    }
  };
  const S = { bl: null, blinkAt: -1, wNext: 0, reg: 'h', dg: null, px: 0, py: 0, c: 0, ready: false, mode: 'follow', ex: null, et: 0, next: 0, turn: null, up: null, down: null, exp: {}, names: [], bag: [], last: '' };
  const base = 'img/bigi/';
  const load = (dir, n) => Promise.all(Array.from({ length: n }, (_, i) => new Promise(res => {
    const im = new Image(); im.decoding = 'async';
    im.onload = () => res(im); im.onerror = () => res(null);
    im.src = base + dir + '/' + String(i).padStart(2, '0') + '.webp';
  })));
  const ok = a => a.every(Boolean);
  // Bigi's frames are about 5 MB: they start only once the page has fired 'load' (and the browser is idle), so on a slow connection they never hold the load event back or compete with the cave, the bucket and the first screenshots. Until the turn frames are in, the static Bigi in the hero stays (S.ready is false).
  const afterLoad = fn => { const go = () => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 300)); document.readyState === 'complete' ? go() : addEventListener('load', go, { once: true }); };
  afterLoad(() => fetch(base + 'manifest.json').then(r => r.json()).then(async m => {
    const [tl, tr] = await Promise.all([load('turnL', m.turnL.n), load('turnR', m.turnR.n)]);
    if (!ok(tr) || !ok(tl)) return;
    S.turn = { f: [...tl.slice().reverse(), ...tr.slice(1)], l: [...m.turnL.lamp.slice().reverse(), ...m.turnR.lamp.slice(1)] };
    S.c = tl.length - 1; S.px = S.c;
    fig.classList.add('live'); S.ready = true;
    S.next = performance.now() + 3500;
    // clips that end close to the calm pose just dissolve back; the others hold their last frame a moment first
    // every clip plays only its moving part ([first, last] frame; the near-still frames at the ends read as a freeze), measured frame by frame.
    // Open-mouthed endings then close: REV runs the clip backwards from a frame that matches the end pose (after the action, so it never replays) down to REV[1].
    // The last few frames crossfade into the calm pose while they still move, so there is no stop before he is back.
    const CUT = { yawn: [4, 22], wink2: [5, 22], curious: [0, 30], lick: [0, 29], blink: [0, 30] };
    const REV = { yawn: [22, 4], bark: [11, 0], joy: [19, 0], pant: [15, 0], lick: [29, 21] };
    const ld = async k => { const a = await load(k, m[k].n); if (!ok(a)) return null; const c = CUT[k] || [0, a.length - 1]; return { f: a, l: m[k].lamp, fps: m[k].fps || 18, a: c[0], z: c[1], rev: REV[k] }; };
    // blink frames for the pose he holds while watching the trailer (turn frame 9 to either side, eyes painted in Klein)
    const one = src => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = base + src; });
    Promise.all(['LH', 'LC', 'RH', 'RC'].map(n => one('watch/' + n + '.webp'))).then(([lh, lc, rh, rc]) => { if (lh && lc && rh && rc) S.bl = { L: { H: lh, C: lc }, R: { H: rh, C: rc } }; });
    S.up = await ld('lookUp'); S.down = await ld('lookDown');
    if (navigator.connection && navigator.connection.saveData) return;
    // diagonal looks only follow a mouse; touch screens skip them (about 2 MB less to download on a phone)
    S.dg = {}; if (!matchMedia('(pointer:coarse)').matches) for (const k of ['upL', 'upR', 'dnL', 'dnR']) if (m[k]) S.dg[k] = await ld(k);
    const slow = small() || (navigator.connection && /2g|3g/.test(navigator.connection.effectiveType || ''));
    for (const k of m.expr.slice(0, slow ? 3 : 99)) { const e = await ld(k); if (e) { S.exp[k] = e; S.names.push(k); } }
  }).catch(() => {}));
  const startExpr = () => {
    if (!S.ready || S.mode !== 'follow' || !S.names.length || watch) return;
    // never the same face twice in a row, and walk through all of them before repeating one
    if (!S.bag.length) { S.bag = S.names.filter(n => n !== S.last).sort(() => Math.random() - .5); }
    S.last = S.bag.pop(); S.ex = S.exp[S.last]; S.mode = 'center';
  };
  fig.addEventListener('pointerdown', () => startExpr());
  fig.style.cursor = 'pointer';
  let lamp = [.49, .13], lastKey = '', lastMove = performance.now();
  addEventListener('pointermove', () => { lastMove = performance.now(); });
  gsap.set(fig, { transformPerspective: 900 });
  const tx = gsap.quickTo(fig, 'rotationY', { duration: .7, ease: 'power3' }),
        ty = gsap.quickTo(fig, 'rotationX', { duration: .7, ease: 'power3' });
  /* returns the lamp position on the hero Bigi as a fraction of his box */
  const figTick = (r, dt, now) => {
    const cx = r.left + r.width / 2, cy = r.top + r.height * .4;
    const nx = clamp((aim.x - cx) / (innerWidth * .4), -1, 1), ny = clamp((aim.y - cy) / (innerHeight * .4), -1, 1);
    tx(nx * (S.ready ? 4 : 14)); ty(-ny * (S.ready ? 5 : 8));
    if (!S.ready) return [.493, .127];
    const k = 1 - Math.exp(-dt * 9);
    // pose = one crisp frame from ONE clip: horizontal turn, vertical look or a diagonal clip; hysteresis keeps it from flickering between clips
    let tp = S.c + nx * S.c, tv = ny;
    if (S.mode !== 'follow') { tp = S.c; tv = 0; }
    else if (watch) { tp = S.c + (nx < 0 ? -9 : 9); tv = 0; }       // watching the trailer: hold turn frame 9 towards it (the blink frames match it)
    S.px = lerp(S.px, tp, k); S.py = lerp(S.py, tv, k);
    let frames = null, key, mixed = false;
    if (S.mode === 'expr') {
      S.et += dt * S.ex.fps;
      const X = S.ex, f = X.f, L = X.l, R = X.rev, E = X.z + 1, OV = 4, N = S.turn.f[S.c], NL = S.turn.l[S.c];
      // draw frame i (lamp li) blended q of the way into the calm pose
      const show = (i, q) => {
        q = clamp(q, 0, 1);
        if (q < .001) { frames = f[i]; lamp = L[i]; return; }
        mix(f[i], N, q); mixed = true; lastKey = ''; lamp = [lerp(L[i][0], NL[0], q), lerp(L[i][1], NL[1], q)];
      };
      const done = () => { S.mode = 'follow'; S.next = now + 4000 + Math.random() * 4000; S.wNext = now + rnd(2500, 5000); };
      if (S.et < E) show(Math.min(Math.floor(S.et), X.z), R ? 0 : (S.et - (E - OV)) / OV);
      else if (!R) done();
      else {
        const BL = R[0] < X.z ? .1 : 0, u = (S.et - E) / X.fps;
        if (u < BL) { mix(f[X.z], f[R[0]], u / BL); mixed = true; lastKey = ''; lamp = L[R[0]]; }
        else {
          const pos = R[0] - (u - BL) * X.fps * 1.15;
          if (pos <= R[1]) done();
          else if (pos < R[1] + OV) show(Math.round(pos), (R[1] + OV - pos) / OV);
          else { const fl = Math.floor(pos), A = Math.min(fl + 1, R[0]), w = 1 - (pos - fl); mix(f[A], f[fl], w); mixed = true; lastKey = ''; lamp = L[fl]; }
        }
      }
    }
    if (!frames && !mixed) {
      const p = clamp(S.px, 0, S.turn.f.length - 1), sx = (S.px - S.c) / S.c, sy = S.py, ax = Math.abs(sx), ay = Math.abs(sy), rt = ay / (ax + 1e-4);
      if (S.reg === 'd') { if (rt < .38) S.reg = 'h'; else if (rt > 2.6) S.reg = 'v'; }
      else if (S.reg === 'h') { if (rt > 2.6) S.reg = 'v'; else if (rt > .6) S.reg = 'd'; }
      else { if (rt < .38) S.reg = 'h'; else if (rt < 1.7) S.reg = 'd'; }
      let clip = null, ci = 0;
      if (ay > .03 || ax > .03) {
        if (S.reg === 'd') { clip = S.dg && S.dg[(sy < 0 ? 'up' : 'dn') + (sx < 0 ? 'L' : 'R')]; if (clip) ci = Math.round(clamp(Math.hypot(ax, ay) / 1.2, 0, 1) * (clip.f.length - 1)); }
        if (!clip && S.reg !== 'h' && ay > .03) { clip = sy < 0 ? S.up : S.down; if (clip) ci = Math.round(clamp(ay, 0, 1) * (clip.f.length - 1)); }
      }
      const i = Math.round(p);
      let img = clip ? clip.f[ci] : S.turn.f[i];
      if (!watch) S.wOn = null;
      if (watch && S.mode === 'follow' && S.ready) {
        // while he watches: blink every few seconds, now and then turn to the visitor and wink
        if (S.wOn !== watch) { S.wOn = watch; S.wNext = now + 1800; }   // first blink a moment after play
        if (now > S.wNext) {
          if (S.exp.wink2 && Math.random() < .3) { S.ex = S.exp.wink2; S.last = 'wink2'; S.mode = 'center'; S.wNext = now + rnd(7000, 11000); }
          else { S.blinkAt = now; S.wNext = now + rnd(2200, 5200); }
        }
        const bi = Math.floor((now - S.blinkAt) / 36), side = i === S.c - 9 ? 'L' : i === S.c + 9 ? 'R' : '';
        if (S.bl && side && !clip && bi >= 0 && bi < 4) img = S.bl[side][bi === 0 || bi === 3 ? 'H' : 'C'];
      }
      key = img.src;
      if (key !== lastKey) paint(img);
      lamp = clip ? clip.l[ci] : S.turn.l[i];
      if (S.mode === 'center' && Math.abs(S.px - S.c) < .6 && Math.abs(S.py) < .06) { S.mode = 'expr'; S.et = S.ex.a; }
      else if (S.mode === 'follow' && now > S.next && now - lastMove > 1500) startExpr();
      else if (S.mode === 'follow' && now > S.next) S.next = now + 1500;
    }
    if (frames) { paint(frames); lastKey = ''; }
    else lastKey = key;
    return lamp;
  };

  /* ---------- rope + bucket: sizes, the jump scene ---------- */
  // The bucket hangs in the hero scene on the crane rope (scene art: rope at 50% of the image width, knot at 41%, shaft mouth at 76% of its height).
  // Bigi rides in canvas #pc, drawn between the back layer and the front layer of the bucket sprite.
  const PS = { l: .1181, t: .2289, w: .7559, h: .6334 };   // passenger canvas inside the sprite (fractions)
  const KNOT = 135 / 970;                                    // sprite: y of the rope knot
  let Hb = 300, Wb = 150, restTop = 300, xOff = 0, ropeTopRel = 0, pinLen = 800;
  const hero = $('.hero'), scv = $('.hero .cv');
  const layout = () => {
    const V = innerHeight, hr = hero.getBoundingClientRect(), r = scv.getBoundingClientRect();
    const cvTop = r.top - hr.top, cvH = r.height, ropeX = r.left + r.width * .5;
    Hb = clamp(cvH * .4066, 150, V * .52);
    Wb = Hb * BJ.w / BJ.h;
    const knotY = cvTop + cvH * .41;
    restTop = knotY - KNOT * Hb;
    ropeTopRel = cvTop + cvH * .299;                        // rope comes out from under the beam (scene art: beam bottom at 29.9%)
    xOff = ropeX - BJ.rope * Wb - innerWidth / 2 + Wb / 2;
    document.documentElement.style.setProperty('--bw', Wb.toFixed(1) + 'px');
    bk.style.setProperty('--bw', Wb.toFixed(1) + 'px');
    gsap.set(bk, { x: xOff, y: restTop, visibility: 'visible', transformOrigin: (BJ.rope * 100) + '% ' + (-V * 1.2) + 'px' });
    gsap.set(sw, { transformOrigin: (BJ.rope * 100) + '% 0%' });
  };
  const burst = () => {
    const br = pc.getBoundingClientRect(), x = br.left + br.width * .5, y = br.top + br.height * .42;
    for (let i = 0; i < 16; i++) {
      const e = document.createElement('i'); e.className = 'burst'; e.style.left = x + 'px'; e.style.top = y + 'px';
      document.body.appendChild(e);
      const a = rnd(0, 6.28), d = rnd(60, 150);
      gsap.to(e, { x: Math.cos(a) * d, y: Math.sin(a) * d - 30, scale: rnd(.4, 1.6), opacity: 0, duration: rnd(.6, 1.1), ease: 'power2.out', onComplete: () => e.remove() });
    }
  };
  let jump = null;
  const build = () => {
    if (jump) { jump.scrollTrigger && jump.scrollTrigger.kill(true); jump.kill(); jump = null; }
    gsap.set(bigi, { clearProps: 'all' }); gsap.set(pc, { clearProps: 'all' }); gsap.set(sw, { clearProps: 'scale' });
    $$('.hero .wrap>div:first-child,.stk,#bucket .dig:not(.more)').forEach(e => gsap.set(e, { clearProps: 'all' }));
    layout();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // no pinned jump: Bigi just sits by the shaft
    const V = innerHeight, hr = hero.getBoundingClientRect(), br = bigi.getBoundingClientRect();
    const cx = br.left + br.width / 2, cy = br.top - hr.top + br.height / 2;
    const drop = Hb * .3;                                              // Bigi hops to a point above the opening, then falls in
    const px = innerWidth / 2 + xOff - Wb / 2 + (PS.l + PS.w / 2) * Wb;
    const py = restTop + (PS.t + PS.h / 2) * Hb - drop;
    const dx = px - cx, dy = py - cy, sEnd = PS.h * Hb / br.height, peak = Math.min(0, dy) - Hb * .5;
    pinLen = Math.round(V * 1.05);
    jump = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=' + pinLen, pin: true, scrub: .5, anticipatePin: 1, invalidateOnRefresh: true },
    });
    jump.to('.hero .wrap>div:first-child', { autoAlpha: 0, x: -90, duration: 1.4 }, 0)
        .to('#bucket .dig:not(.more)', { autoAlpha: 0, duration: .5 }, 0)
        .to('.cave', { '--g': .3, duration: 2.4 }, 0)
        .to('.stk', { scale: 0, duration: .8 }, .2)
        .to(bigi, { x: dx, duration: 3 }, 1)
        .to(bigi, { y: peak, duration: 1.4, ease: 'power2.out' }, 1)
        .to(bigi, { y: dy, duration: 1.6, ease: 'power2.in' }, 2.4)
        .to(bigi, { scale: sEnd, rotation: -8, duration: 3, ease: 'power1.inOut' }, 1)
        .to(bigi, { autoAlpha: 0, duration: .01 }, 4)
        .fromTo(pc, { autoAlpha: 0, y: -drop, rotation: -8 }, { autoAlpha: 1, y: -drop, rotation: -8, duration: .01, immediateRender: true }, 4)
        .to(pc, { y: 0, rotation: 0, duration: .55, ease: 'power2.in' }, 4.01)
        .fromTo(sw, { scale: 1 }, { scale: 1.08, duration: .16, ease: 'power2.out' }, 4.56)
        .to(sw, { scale: 1, duration: .8, ease: 'elastic.out(1,.45)' }, 4.72)
        .call(() => { if (jump.scrollTrigger.direction > 0) burst(); }, null, 4.56)
        .to({}, { duration: 1.2 }, 5.4);
  };
  build();
  // touch screens: the address bar sliding in or out only changes the height a little (resize fires on every toggle); rebuilding the pinned hero then threw the page back up the scroll, so only a real size or rotation change rebuilds
  let rt, rw = innerWidth, rh = innerHeight; const coarse = matchMedia('(pointer:coarse)').matches;
  addEventListener('resize', () => {
    if (coarse && innerWidth === rw && Math.abs(innerHeight - rh) < rh * .2) return;
    clearTimeout(rt); rt = setTimeout(() => { rw = innerWidth; rh = innerHeight; build(); ScrollTrigger.refresh(); }, 250);
  });

  /* click the bucket (or its "scroll to dig" hint) at the top: ride down slowly, Bigi jumps in on the way, stop at Level 01 */
  const goDig = () => {
    const s = $('.step'), r = s.getBoundingClientRect();
    const to = Math.round(scrollY + r.top + r.height / 2 - innerHeight / 2);
    if (lenis) lenis.scrollTo(to, { duration: clamp((to - scrollY) / 420, 4.5, 8), easing: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, onComplete: arrived });
    else { scrollTo({ top: to, behavior: 'smooth' }); setTimeout(arrived, 1200); }
  };
  // after the ride: "scroll down to dig deeper" above Bigi's head, hidden as soon as the visitor scrolls on
  // the hint in the bucket handle: "Tap to / start!" on touch screens, "Click to / start!" in a narrow window (the first line has to fit the arc of the handle), "Click / to start!" on a wide one
  const hintBtn = $('#bucket .dig:not(.more)');
  const setHint = () => {
    const touch = matchMedia('(hover: none)').matches, mode = touch ? 'tap' : small() ? 'click-narrow' : 'click';
    if (hintBtn.dataset.mode === mode) return; hintBtn.dataset.mode = mode;
    hintBtn.innerHTML = T(mode === 'tap' ? 'Tap to<br>start!' : mode === 'click-narrow' ? 'Click to<br>start!' : 'Click<br>to start!') + '<i aria-hidden="true"></i>';
    hintBtn.setAttribute('aria-label', T(touch ? 'Tap to start: ride the bucket down to Level 01' : 'Click to start: ride the bucket down to Level 01'));
  };
  setHint(); addEventListener('resize', setHint);
  const more = $('#bucket .dig.more');
  let moreAt = -1;
  const arrived = () => { moreAt = scrollY; more.classList.add('on'); };
  sw.addEventListener('click', () => { if (bk.classList.contains('tap')) goDig(); });
  $('#bucket .dig').addEventListener('click', e => { e.stopPropagation(); goDig(); });

  /* bucket sways idly and swings with the scroll speed (a pendulum hanging from far above) */
  gsap.fromTo(sw, { rotation: -1.1 }, { rotation: 1.1, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  const rotQ = gsap.quickTo(bk, 'rotation', { duration: .9, ease: 'power3' });
  // the bucket rides down behind the rocky overhang on top of the last section and fades while the rocks cover it
  const rockEdge = () => { const c = $('.cavewrap .cavetop').getBoundingClientRect(), f = $('.fin').getBoundingClientRect(); return c.top + c.height * .294 - f.top; };
  gsap.to(bk, { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.fin', invalidateOnRefresh: true,
    start: () => 'top ' + Math.round(restTop + Hb * .97 - rockEdge()) + 'px', end: () => 'top ' + Math.round(restTop + Hb * .2 - rockEdge()) + 'px', scrub: true } });
  gsap.to('.hud', { autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.fin', start: 'top 70%', end: 'top 35%', scrub: true } });

  /* ---------- per-frame: aim, lamp carrier (hero Bigi or the bucket), darkness mask, beam, glints ---------- */
  let last = performance.now(), lastSY = scrollY, wasCh = 0;
  gsap.ticker.add(() => {
    dk.style.setProperty('--x', aim.x + 'px');
    dk.style.setProperty('--y', aim.y + 'px');
    const now = performance.now(), dt = Math.min(.05, (now - last) / 1000); last = now;
    const sy = scrollY, sv = (sy - lastSY) / Math.max(dt, .001); lastSY = sy;
    const ht = hero.getBoundingClientRect().top;
    bk.style.setProperty('--rh', Math.max(0, restTop + 3 - Math.max(0, ht + ropeTopRel)).toFixed(0) + 'px');
    rotQ(clamp(-sv / 1600, -3, 3));
    bk.classList.toggle('tap', sy < 40);
    if (watch) {                                   // look at the playing trailer, light the whole frame
      const f = watch.getBoundingClientRect();
      qx(f.left + f.width / 2); qy(f.top + f.height / 2);
      const ch = Math.round(Math.max(340, f.height * 1.15));
      if (ch !== wasCh) { wasCh = ch; beam.style.setProperty('--ch', ch + 'px'); }
    } else if (wasCh) { wasCh = 0; beam.style.removeProperty('--ch'); qx(ptr.x); qy(ptr.y); }
    if (moreAt >= 0 && Math.abs(sy - moreAt) > 60) { moreAt = -1; more.classList.remove('on'); }
    dk.style.opacity = (.35 + .65 * clamp(sy / (pinLen * .9), 0, 1)).toFixed(2);   // the hero is lit enough to read, the shaft gets darker as you go down
    const r = fig.getBoundingClientRect();
    const figOp = +gsap.getProperty(bigi, 'opacity');
    const figVis = r.bottom > 0 && r.top < innerHeight && r.width > 0 && figOp > .05;
    const pcOp = getComputedStyle(pc).visibility === 'hidden' ? 0 : +gsap.getProperty(pc, 'opacity') * +gsap.getProperty(bk, 'opacity');
    const useBk = pcOp > .05 && pcOp >= (figVis ? figOp : 0);
    beam.classList.toggle('on', figVis || useBk);
    let lx = -9999, ly = -9999, yOff = 0;
    if (useBk) {
      const b = pc.getBoundingClientRect(), l = figTick(b, dt, now);
      lx = b.left + b.width * l[0]; ly = b.top + b.height * l[1]; yOff = b.height * .17;
    } else if (figVis) {
      const l = figTick(r, dt, now);
      lx = r.left + r.width * l[0]; ly = r.top + r.height * l[1]; yOff = r.height * .17;
    }
    if (lx < -9000) { dk.style.setProperty('--ly', '-2000px'); }
    else {
      dk.style.setProperty('--lx', lx.toFixed(1) + 'px');
      dk.style.setProperty('--ly', (ly + yOff).toFixed(1) + 'px');
      const dx = aim.x - lx, dy = aim.y - ly;
      beam.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';
      beam.style.setProperty('--a', Math.atan2(dy, dx) + 'rad');
      beam.style.setProperty('--len', Math.min(Math.hypot(dx, dy) + 160, 1100) + 'px');
    }
    // glints wake up near the cursor light, the lamp and the beam between them
    const Ra = small() ? 170 : 240, Rl = 200, Rb = 90;
    const ax = aim.x, ay = aim.y, sx = ax - lx, sy2 = ay - ly, sl = sx * sx + sy2 * sy2;
    for (const g of GL) {
      if (!g.band.classList.contains('on')) continue;
      const q = g.el.getBoundingClientRect();
      if (q.bottom < -60 || q.top > innerHeight + 60) continue;
      const px = q.left + q.width / 2, py = q.top + q.height / 2;
      let k = 1 - Math.hypot(px - ax, py - ay) / Ra;
      if (lx > -9000) {
        k = Math.max(k, 1 - Math.hypot(px - lx, py - ly) / Rl);
        const t = sl ? clamp(((px - lx) * sx + (py - ly) * sy2) / sl, 0, 1) : 0;
        k = Math.max(k, (1 - Math.hypot(px - (lx + sx * t), py - (ly + sy2 * t)) / Rb) * .95);
      }
      k = clamp(k, 0, 1);
      if (Math.abs(k - g.k) > .03) { g.k = k; g.el.style.setProperty('--k', k.toFixed(2)); }
    }
  });

  gsap.from('#h1 span', { yPercent: 60, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .14, delay: .1 });
  gsap.from('.hero p,.hero .cta,.hero .tag', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, delay: .5 });
  gsap.from('#fig', { y: 120, scale: .8, opacity: 0, duration: 1.6, ease: 'elastic.out(1,.6)', delay: .2 });
  gsap.from('.stk', { scale: 0, rotate: -30, duration: .7, ease: 'back.out(2.4)', stagger: .16, delay: 1 });
  gsap.to('#fig', { y: -14, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });

  document.querySelectorAll('.step').forEach(s => {
    const even = s.matches(':nth-child(even)');
    gsap.from(s.querySelector('.txt'), { x: even ? 60 : -60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 70%' } });
    gsap.from(s.querySelector('.ph'), { y: 90, rotate: even ? 5 : -5, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 70%' } });
  });
  gsap.from('.mus h2,.mus p,.chips', { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.mus', start: 'top 65%' } });
  gsap.from('.mus .ph', { x: 80, rotate: 6, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.mus', start: 'top 65%' } });
  gsap.from('.fin h2', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.fin', start: 'top 70%' } });
  gsap.from('.fin .box', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.fin', start: 'top 60%' } });
}
/* the last section fills the screen above the footer: at the very bottom only Bigi and his treasure glow are visible */
const finH = () => document.documentElement.style.setProperty('--finh', Math.max(560, innerHeight - $('footer').offsetHeight) + 'px');
finH(); addEventListener('resize', finH);
const pv = $('#pv'), vp = $('#vplay'), vframe = $('.vid .frame');
const vstate = on => { vp.textContent = T(on ? 'Pause trailer' : 'Play trailer'); vp.setAttribute('aria-pressed', on ? 'true' : 'false'); watch = on ? vframe : null; vframe.classList.toggle('lit', on); };
vp.addEventListener('click', () => { if (pv.paused) { pv.muted = false; pv.play(); } else pv.pause(); });
vframe.addEventListener('click', e => { if (!e.target.closest('.vend,.vhot')) vp.click(); });   // tapping the phone picture itself plays / pauses, not only the button
pv.addEventListener('play', () => vstate(true));
pv.addEventListener('pause', () => vstate(false));
const vend = $('.vend');
pv.addEventListener('ended', () => { vstate(false); pv.load(); vhot.hidden = true; vend.hidden = false; vframe.classList.add('cta'); });   // back to the poster after the trailer, with the call to action over it
pv.addEventListener('play', () => { vend.hidden = true; vframe.classList.remove('cta'); });
const vhot = $('.vhot');
pv.addEventListener('timeupdate', () => { vhot.hidden = !(pv.currentTime > 27.4 && !pv.ended); });   // the badge pops in the trailer's outro at 27.4 s
vhot.addEventListener('click', () => pv.pause());   // the frame's own click ignores the overlay and the hotspot (the Play-link analytics still sees the click)
$('.vagain').addEventListener('click', () => { vend.hidden = true; pv.muted = false; pv.play(); });
$('.vdown').addEventListener('click', () => { const to = $('.fin').getBoundingClientRect().top + scrollY + $('.fin').offsetHeight - innerHeight; if (lenis) lenis.scrollTo(to, { duration: 2.4 }); else scrollTo({ top: to, behavior: 'smooth' }); });
// scrolled away from the trailer: pause it, so Bigi does not stare at an empty spot and the sound stops
new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting && !pv.paused) pv.pause(); }), { threshold: .2 }).observe(vframe);
