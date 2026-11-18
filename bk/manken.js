// Ördekez — resimli manken (kukla) karakter sistemi
// await Manken.load('bk/manken/');  Manken.draw(g, cfg, x, y, scale, {dir, anim, t}) -> {hx,hy}
// cfg: {cins:'e'|'k', goz:'#3a7aff', gozT:'parlak', agiz:'gulus'}
(function () {
  let RIG = null; const IMG = {};
  const hx = h => { h = (h || '#888888').replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (c, d, k) => { const a = hx(c), b = hx(d); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const dk = (c, k) => mix(c, '#1e1030', k), lt = (c, k) => mix(c, '#ffffff', k);
  async function load(base = 'bk/manken/') {
    if (RIG) return; RIG = await (await fetch(base + 'rig.json')).json();
    const jobs = [];
    for (const g in RIG) for (const v in RIG[g]) for (const p in RIG[g][v].parts) { const k = `${g}_${v}_${p}`, im = new Image(); im.src = base + k + '.webp'; IMG[k] = im; jobs.push(im.decode().catch(() => {})); }
    await Promise.all(jobs);
  }
  // ---- yüz (anime) : birim kafa genişliği ~34 ----
  const EYE = { parlak: 'Parlak', keskin: 'Keskin', yumusak: 'Yumuşak', kedi: 'Kedi', yildiz: 'Yıldızlı', sakin: 'Sakin', mutlu: 'Mutlu ^^' };
  const MOUTH = { gulus: 'Gülüş', sirit: 'Sivri Diş', acik: 'Neşeli', duz: 'Cool', kedi: 'Kedi :3', yan: 'Yan Gülüş' };
  function eye(g, C, x, y, s, side, male, T) {
    const t = C.gozT || 'parlak', goz = C.goz || '#3a7aff', w = (side ? 4.4 : 5.4) * (male ? .95 : 1), h = male ? 6.6 : 7.6, blink = (T % 4.1) < .1;
    const ln = (pts, c, lw) => { g.strokeStyle = c; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); };
    if (t === 'mutlu' || blink) { ln([[x - w, y + 1], [x, y - 3], [x + w, y + 1]], '#2a1828', 1.9); return; }
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, w, h, 0, 0, 7); g.fill();
    const ir = g.createLinearGradient(0, y - h, 0, y + h); ir.addColorStop(0, dk(goz, .55)); ir.addColorStop(.55, goz); ir.addColorStop(1, lt(goz, .55));
    g.save(); g.beginPath(); g.ellipse(x, y, w, h, 0, 0, 7); g.clip();
    g.fillStyle = ir; g.beginPath(); g.ellipse(x + (side ? 1 : s * .4), y + .6, w * .84, h * .93, 0, 0, 7); g.fill();
    g.fillStyle = dk(goz, .75); if (t === 'kedi') { g.beginPath(); g.ellipse(x + s * .4, y + .4, 1, h * .7, 0, 0, 7); g.fill(); } else { g.beginPath(); g.ellipse(x + s * .4, y, w * .38, h * .45, 0, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(30,10,40,.32)'; g.fillRect(x - w, y - h, w * 2, h * .45);
    const tilt = t === 'keskin' ? 2.2 : t === 'yumusak' ? -1.6 : 0;
    if (tilt) { g.fillStyle = C._ten; g.beginPath(); g.moveTo(x - w - 1, y - h - 1); g.lineTo(x + w + 1, y - h - 1); g.lineTo(x + w + 1, y - h + 2 + (s * tilt > 0 ? tilt * 1.4 : 0)); g.lineTo(x - w - 1, y - h + 2 + (s * tilt < 0 ? -tilt * 1.4 : 0)); g.fill(); }
    if (t === 'sakin') { g.fillStyle = C._ten; g.fillRect(x - w - 1, y - h - 1, w * 2 + 2, h * .75); }
    g.restore();
    if (t === 'yildiz') { g.fillStyle = '#fff'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 1.1 : 2.8; g.lineTo(x - 1 + Math.cos(a) * r, y - 2 + Math.sin(a) * r); } g.fill(); }
    else { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x - s * 1.5 - .4, y - 2.4 + (t === 'sakin' ? 2 : 0), 1.7, 2.1, 0, 0, 7); g.fill(); g.globalAlpha = .9; g.beginPath(); g.arc(x + s * 1.6, y + 2.6, .9, 0, 7); g.fill(); g.globalAlpha = 1; }
    g.strokeStyle = '#2a1828'; g.lineCap = 'round'; g.lineWidth = male ? 1.7 : 2.2; g.beginPath();
    const ly = y - h + .8 + (t === 'keskin' ? 1 : 0) + (t === 'sakin' ? h * .6 : 0); g.moveTo(x - w - .6, ly + (t === 'keskin' ? s * 1.6 : 1.4)); g.quadraticCurveTo(x, ly - 2.4 + (t === 'yumusak' || t === 'sakin' ? 1.4 : 0), x + w + .6, ly + (t === 'keskin' ? -s * 1.6 : 1.4)); g.stroke();
    if (!male) { g.lineWidth = 1.3; g.beginPath(); g.moveTo(x + s * (w + .3), ly + 1); g.lineTo(x + s * (w + 2.6), ly - 1); g.stroke(); g.strokeStyle = 'rgba(42,24,40,.45)'; g.lineWidth = .8; g.beginPath(); g.moveTo(x - w + 1, y + h - .4); g.quadraticCurveTo(x, y + h + .8, x + w - 1, y + h - .4); g.stroke(); }
  }
  function mouth(g, m, x, y) {
    g.strokeStyle = '#7a2a3a'; g.lineWidth = 1.1; g.lineCap = 'round';
    if (m === 'acik') { g.fillStyle = '#9a2a3a'; g.beginPath(); g.moveTo(x - 3, y - .6); g.quadraticCurveTo(x, y + 4.6, x + 3, y - .6); g.closePath(); g.fill(); g.fillStyle = '#ff8a9a'; g.beginPath(); g.ellipse(x, y + 2, 1.5, .9, 0, 0, 7); g.fill(); }
    else if (m === 'sirit') { g.beginPath(); g.moveTo(x - 3.3, y); g.quadraticCurveTo(x, y + 2.2, x + 3.3, y - .6); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x + 1, y + 1); g.lineTo(x + 2.3, y + .6); g.lineTo(x + 1.7, y + 2.4); g.fill(); }
    else if (m === 'duz') { g.beginPath(); g.moveTo(x - 2, y + .5); g.lineTo(x + 2, y + .2); g.stroke(); }
    else if (m === 'kedi') { g.beginPath(); g.arc(x - 1.5, y, 1.5, .2, Math.PI - .2); g.arc(x + 1.5, y, 1.5, .2, Math.PI - .2); g.stroke(); }
    else if (m === 'yan') { g.beginPath(); g.moveTo(x - 2.3, y + .6); g.quadraticCurveTo(x + 1, y + 1.3, x + 2.8, y - 1.1); g.stroke(); }
    else { g.beginPath(); g.moveTo(x - 2.4, y); g.quadraticCurveTo(x, y + 2, x + 2.4, y); g.stroke(); }
  }
  function face(g, C, H, view, male, T) {
    const hw = (H.hx1 - H.hx0), hh = H.chin - H.top;
    if (view === 'arka') return;
    if (view === 'on') {
      const cx = (H.hx0 + H.hx1) / 2, k = hw * .88 / 34; g.save(); g.translate(cx, H.top + hh * .66); g.scale(k, k);
      for (const s of [-1, 1]) eye(g, C, s * 7.4, 0, s, false, male, T);
      for (const s of [-1, 1]) { g.strokeStyle = 'rgba(80,50,60,.75)'; g.lineWidth = male ? 1.6 : 1; g.lineCap = 'round'; g.beginPath(); if (male) { g.moveTo(s * 3, -10.5); g.quadraticCurveTo(s * 8, -11.8, s * 12, -10.6); } else { g.moveTo(s * 4, -11); g.quadraticCurveTo(s * 8.6, -12.2, s * 11.6, -10.8); } g.stroke(); }
      g.fillStyle = male ? 'rgba(255,110,140,.18)' : 'rgba(255,110,140,.36)'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * 10.5, 7.2, 3.4, 1.7, 0, 0, 7); g.fill(); }
      g.fillStyle = 'rgba(160,80,80,.35)'; g.beginPath(); g.arc(.5, 6, .6, 0, 7); g.fill();
      mouth(g, C.agiz, 0, 10.4); g.restore();
    } else { // yan: sağa bakıyor
      const k = hw * .88 / 34, fx = H.hx1 - hw * .2; g.save(); g.translate(fx, H.top + hh * .66); g.scale(k, k);
      eye(g, C, 0, 0, 1, true, male, T);
      g.strokeStyle = 'rgba(80,50,60,.75)'; g.lineWidth = male ? 1.6 : 1; g.beginPath(); g.moveTo(-3, -10.6); g.quadraticCurveTo(1, -11.8, 4.6, -10.6); g.stroke();
      g.fillStyle = male ? 'rgba(255,110,140,.18)' : 'rgba(255,110,140,.36)'; g.beginPath(); g.ellipse(-1, 7.2, 3, 1.6, 0, 0, 7); g.fill();
      mouth(g, C.agiz, 4.2, 10.4); g.restore();
    }
  }
  // ---- çizim ----
  function part(g, key, P, piv, rot = 0, dx = 0, dy = 0, alpha = 1, sy = 1) {
    const im = IMG[key]; if (!im || !im.complete) return;
    g.save(); g.globalAlpha *= alpha; g.translate(piv[0] + dx, piv[1] + dy); g.rotate(rot); g.scale(1, sy); g.translate(-piv[0], -piv[1]); g.drawImage(im, P[0], P[1], im.naturalWidth, im.naturalHeight); g.restore();
  }
  function draw(g, cfg = {}, x = 0, y = 0, sc = 1, o = {}) {
    if (!RIG) return null;
    const C = Object.assign({ cins: 'e', goz: '#3a7aff', gozT: 'parlak', agiz: 'gulus' }, cfg), gk = C.cins === 'k' ? 'k' : 'e', male = gk === 'e';
    C._ten = '#fff0e6';
    const dir = o.dir || 's', anim = o.anim || 'idle', t = o.t != null ? o.t : performance.now() / 1000;
    const view = dir === 's' ? 'on' : dir === 'n' ? 'arka' : 'yan', R = RIG[gk][view], P = R.parts, PV = R.pivot, F = R.foot, H = R.head;
    const walk = anim === 'walk', sit = anim === 'sit', ph = t * 8.5, sw = walk ? Math.sin(ph) : 0;
    const bob = walk ? Math.abs(Math.sin(ph)) * 7 : anim === 'cheer' ? Math.abs(Math.sin(t * 7)) * 22 : Math.sin(t * 2.2) * 2;
    let hand = null; const K = (n) => `${gk}_${view}_${n}`;
    g.save(); g.translate(x, y); g.scale(sc, sc);
    g.fillStyle = 'rgba(40,20,60,.22)'; g.beginPath(); g.ellipse(0, 0, 95, 20, 0, 0, 7); g.fill();
    if (dir === 'w') g.scale(-1, 1);
    g.translate(-F[0], -F[1]);
    const up = -bob + (sit ? 120 : 0), hb = Math.sin(t * 2.2 + .6) * 1.2, htilt = walk ? Math.sin(ph) * .025 : anim === 'cheer' ? Math.sin(t * 7) * .05 : Math.sin(t * 1.3) * .015;
    if (view === 'yan') {
      let aF = walk ? -sw * .45 : 0, aB = walk ? sw * .45 : 0; if (anim === 'fish') aF = -1.25; if (anim === 'wave') aF = -2.7 + Math.sin(t * 9) * .3; if (anim === 'cheer') aF = aB = -2.9; if (sit) aF = aB = -.5;
      const lF = sit ? -1.5 : sw * .42, lB = sit ? -1.35 : -sw * .42;
      g.save(); g.filter = 'brightness(.82)'; part(g, K('kol'), P.kol, PV.kol, aB, 0, up); part(g, K('bacak'), P.bacak, PV.bacak, lB, 0, sit ? 120 : 0); g.restore();
      part(g, K('bacak'), P.bacak, PV.bacak, lF, 0, sit ? 120 : 0);
      part(g, K('govde'), P.govde, PV.bas, 0, 0, up);
      g.save(); g.translate(0, up + hb); g.translate(PV.bas[0], PV.bas[1]); g.rotate(htilt); g.translate(-PV.bas[0], -PV.bas[1]); part(g, K('bas'), P.bas, PV.bas); face(g, C, H, 'yan', male, t); g.restore();
      part(g, K('kol'), P.kol, PV.kol, aF, 0, up);
      const m = g.getTransform(); const hp = new DOMPoint(PV.kol[0] + Math.sin(-aF) * 150, PV.kol[1] + up + Math.cos(aF) * 150).matrixTransform(m); hand = { hx: hp.x, hy: hp.y };
    } else {
      const back = view === 'arka';
      // ekranın sağındaki kol = R
      let aR = walk ? sw * .1 : 0, aL = walk ? sw * .1 : 0;
      if (anim === 'wave') aR = -1.75 + Math.sin(t * 9) * .3; if (anim === 'cheer') { aR = -2.3; aL = 2.3; } if (anim === 'fish') aR = -1.05; if (sit) { aR = -.25; aL = .25; }
      if (back) { [aR, aL] = [-aL, -aR]; }
      for (const s of ['L', 'R']) { const lift = walk ? Math.max(0, Math.sin(ph) * (s === 'L' ? 1 : -1)) * 16 : 0; part(g, K('bacak' + s), P['bacak' + s], PV['bacak' + s], 0, 0, -lift + (sit ? 120 : 0), 1, sit ? .62 : 1); }
      part(g, K('kolL'), P.kolL, PV.kolL, aL, 0, up); part(g, K('kolR'), P.kolR, PV.kolR, aR, 0, up);
      part(g, K('govde'), P.govde, PV.bas, 0, 0, up);
      g.save(); g.translate(0, up + hb); g.translate(PV.bas[0], PV.bas[1]); g.rotate(htilt); g.translate(-PV.bas[0], -PV.bas[1]); part(g, K('bas'), P.bas, PV.bas); face(g, C, H, view, male, t); g.restore();
      const pv = back ? PV.kolL : PV.kolR, aa = back ? aL : aR, dir2 = back ? -1 : 1, L = 165, a0 = Math.atan2(1, .42 * dir2);
      const m = g.getTransform(); const hp = new DOMPoint(pv[0] + Math.cos(a0 + aa) * L, pv[1] + up + Math.sin(a0 + aa) * L).matrixTransform(m); hand = { hx: hp.x, hy: hp.y };
    }
    g.restore();
    return hand;
  }
  window.Manken = { load, draw, EYE, MOUTH };
})();
