/* Shared Mossy garden: the whole garden lives in the link (#1.<data>.<nick>, see /mossy/g/format.json).
   Nothing is sent anywhere; this script only draws what the link says. Without a link it shows a sample garden. */
(async () => {
  const fmt = await (await fetch('format.json')).json();
  const scene = document.getElementById('scene');

  // ---- link codec (the app does the same in Dart) ----
  const b64 = { enc: u8 => btoa(String.fromCharCode(...u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
    dec: s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)) };
  const encode = st => {
    const u = new Uint8Array(32); u[0] = 1;
    st.plants.forEach((p, i) => { u[1 + i] = (Math.min(7, p.stage) << 4) | Math.min(15, p.blooms); });
    st.badges.forEach(id => { const i = fmt.badges.indexOf(id); if (i >= 0) u[17 + (i >> 3)] |= 1 << (i & 7); });
    u[29] = st.seed & 255; u[30] = st.seed >> 8 & 255; u[31] = Math.min(100, st.moss);
    return `1.${b64.enc(u)}.${encodeURIComponent(st.nick || '')}`;
  };
  const decode = h => {
    // nick is everything after the second dot (it may contain dots itself)
    const m = h.replace(/^#/, '').match(/^([^.]*)\.([^.]*)\.?(.*)$/) || [];
    const [, v, data, nick = ''] = m;
    if (v !== '1' || !data) return null;
    let u; try { u = b64.dec(data); } catch { return null; }
    if (u.length < 32 || u[0] !== 1) return null;
    let name = ''; try { name = decodeURIComponent(nick).trim().slice(0, fmt.nickMax); } catch {}
    return {
      nick: name,
      plants: fmt.games.map((g, i) => ({ stage: u[1 + i] >> 4 & 7, blooms: u[1 + i] & 15 })),
      badges: fmt.badges.filter((_, i) => u[17 + (i >> 3)] >> (i & 7) & 1),
      seed: u[29] | u[30] << 8, moss: Math.min(100, u[31]),
    };
  };
  window.MossyGarden = { encode, decode };

  // ---- nickname word filter (same list idea as the app; a match shows the neutral title) ----
  const bad = /(fuck|shit|cunt|bitch|whore|slut|nigg|fag|retard|rape|nazi|hitler|porn|dick|cock|pussy|penis|vagin|anal|sex|kurw|chuj|huj|pizd|jeba|jebi|pierd|cipa|cwel|pedal|dziwk|szmat|merda|puta|puto|cono|mierd|joder|scheis|fotze|hure|wichs|putain|salope|connard|encul|merde|cazz|stronz|figa|troia|vaffan|kut|lul|hoer|neuk|xxx|kill|suicid|isis)/;
  const clean = n => !bad.test(n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[0@4]/g, m => ({ 0: 'o', '@': 'a', 4: 'a' })[m]).replace(/[1!|]/g, 'i').replace(/3/g, 'e').replace(/[5$]/g, 's').replace(/7/g, 't').replace(/[^a-z]/g, ''));

  const sample = { nick: '', seed: 4242, moss: 62,
    plants: [7, 6, 5, 7, 3, 4, 6, 2, 5, 3, 1, 4, 6, 2, 0, 3].map((s, i) => ({ stage: s, blooms: s === 7 ? 2 + i % 3 : 0 })),
    badges: fmt.badges.filter((_, i) => i % 3 !== 1) };
  const st = decode(location.hash) || sample;
  const shared = st !== sample;

  const nameEl = document.getElementById('gname');
  if (shared && st.nick && clean(st.nick)) { nameEl.textContent = `${st.nick}’s garden`; document.title = `${st.nick}’s Mossy garden`; }
  else nameEl.textContent = shared ? 'A Mossy garden' : 'A Mossy garden, a few weeks in';
  if (!shared) document.getElementById('gsub').textContent = 'This is what a garden looks like after a few weeks of tiny rounds.';

  // ---- seeded layout: the same link always draws the same garden ----
  let s = st.seed || 1;
  const rnd = () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  scene.style.setProperty('--moss', 20 + st.moss * .8);

  const items = [];
  st.plants.forEach((p, i) => {
    if (!p.stage) return;
    const v = p.stage <= 2 ? '-s1' : p.stage <= 5 ? '-s2' : '';
    items.push({ src: `../img/plants/${fmt.plantSlugs[i]}${v}.webp`, w: 8.5, blooms: Math.min(5, p.blooms) });
  });
  st.badges.forEach(id => {
    const d = fmt.decor[id];
    if (d) items.push({ src: d === 'mo_sunglasses' ? '../img/mo/mo-sunglasses.webp' : `../img/decor/decor_${d}.webp`, w: d === 'mo_sunglasses' ? 9 : 6.5 });
  });
  const wins = st.badges.filter(id => !fmt.decor[id]).length;

  // place on the ground (y = fraction of scene height from the top), keeping some distance; Mo stands front and centre
  const placed = [{ x: .5, y: .97, r: .09 }];
  const spots = items.map(() => {
    let best = null, bestD = -1;
    for (let k = 0; k < 40; k++) {
      const c = { x: .06 + rnd() * .88, y: .5 + rnd() * .44 };
      const d = Math.min(...placed.map(p => Math.hypot((p.x - c.x) * 1.4, p.y - c.y)));
      if (d > bestD) { bestD = d; best = c; }
    }
    placed.push({ ...best, r: .06 });
    return best;
  });

  const add = (src, x, y, w, cls) => {
    const el = document.createElement('div');
    const depth = .62 + (y - .5) / .47 * .6;
    el.className = 'it' + (cls ? ' ' + cls : '');
    el.style.cssText = `left:${x * 100}%;top:${y * 100}%;width:calc(${w * depth}% * var(--k,1));z-index:${Math.round(y * 1000)}`;
    const im = new Image(); im.src = src; im.alt = ''; im.decoding = 'async'; el.appendChild(im);
    scene.appendChild(el); return el;
  };
  items.forEach((it, i) => {
    const el = add(it.src, spots[i].x, spots[i].y, it.w);
    for (let b = 0; b < (it.blooms || 0); b++) {
      const dot = document.createElement('i'); dot.className = 'bloom';
      dot.style.left = 25 + rnd() * 50 + '%'; dot.style.top = 8 + rnd() * 30 + '%'; el.appendChild(dot);
    }
  });
  add('../img/mo/mo-wave.webp', .5, .97, 15, 'mo');

  // every other small win is a firefly over the garden
  for (let i = 0; i < Math.min(40, wins); i++) {
    const f = document.createElement('i'); f.className = 'fly';
    f.style.cssText = `left:${4 + rnd() * 92}%;top:${6 + rnd() * 60}%;--dx:${(rnd() - .5) * 60}px;--dy:${-10 - rnd() * 40}px;--d:${5 + rnd() * 6}s;--dl:${-rnd() * 6}s;z-index:999`;
    scene.appendChild(f);
  }
  const k = () => scene.style.setProperty('--k', scene.clientWidth < 600 ? 1.9 : scene.clientWidth < 1000 ? 1.35 : 1);
  k(); addEventListener('resize', k);
  addEventListener('hashchange', () => location.reload());
})();
