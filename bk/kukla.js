// Ördekez — KUKLA karakter sistemi (resimli manken + kombin katmanları + kodla aksesuar)
// await Kukla.load('bk/');  Kukla.draw(g, cfg, x, y, scale, {dir, anim, t}) -> {hx,hy}
(function () {
  let RIG = null, BASE = 'bk/'; const IMG = {}, META = {}, TINT = {};
  let KOMBIN = [];
  const hx = h => { h = (h || '#888888').replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (c, d, k) => { const a = hx(c), b = hx(d); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const dk = (c, k) => mix(c, '#1e1030', k), lt = (c, k) => mix(c, '#ffffff', k);
  const rr = (g, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  const poly = (g, p) => { p.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); };
  const img = src => { if (IMG[src]) return IMG[src]; const im = new Image(); im.src = src; IMG[src] = im; return im; };
  async function load(base = 'bk/') {
    if (RIG) return; BASE = base;
    RIG = await (await fetch(base + 'manken/rig.json')).json();
    const jobs = [];
    for (const g in RIG) for (const v in RIG[g]) for (const p in RIG[g][v].parts) jobs.push(img(`${base}manken/${g}_${v}_${p}.webp`).decode().catch(() => {}));
    try { KOMBIN = await (await fetch(base + 'kombin/liste.json')).json(); } catch (e) { KOMBIN = []; }
    for (const k of KOMBIN) { META[k] = await (await fetch(`${base}kombin/${k}.json`)).json();
      for (const cat of ['sac', 'ust', 'alt', 'ayak']) { const P = META[k][cat]; if (!P) continue; for (const g in P.parts) for (const v in P.parts[g]) for (const pn in P.parts[g][v]) { jobs.push(img(`${base}kombin/${k}_${g}_${v}_${cat}_${pn}.webp`).decode().catch(() => {})); jobs.push(img(`${base}kombin/${k}_${g}_${v}_${cat}_${pn}_m.webp`).decode().catch(() => {})); } } }
    await Promise.all(jobs);
  }
  // boyanmış katman (orijinal + ana renk gölge haritası × renk)
  function tinted(src, color) {
    const im = IMG[src]; if (!color) return im; const key = src + color; if (TINT[key]) return TINT[key];
    const sh = IMG[src.replace('.webp', '_m.webp')]; if (!im || !im.complete || !im.naturalWidth || !sh || !sh.complete) return im;
    const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
    const m = document.createElement('canvas'); m.width = w; m.height = h; const y = m.getContext('2d');
    y.drawImage(sh, 0, 0, w, h); y.globalCompositeOperation = 'multiply'; y.fillStyle = color; y.fillRect(0, 0, w, h); y.globalCompositeOperation = 'destination-in'; y.drawImage(sh, 0, 0, w, h);
    // açık renklerde parlaklık kaybını telafi
    const L = hx(color).reduce((a, b) => a + b, 0) / 765; if (L > .55) { y.globalCompositeOperation = 'screen'; y.globalAlpha = (L - .55) * .9; y.fillStyle = color; y.fillRect(0, 0, w, h); y.globalAlpha = 1; y.globalCompositeOperation = 'destination-in'; y.drawImage(sh, 0, 0, w, h); }
    x.drawImage(im, 0, 0); x.drawImage(m, 0, 0); TINT[key] = c; return c;
  }

  // ---------- SEÇENEKLER ----------
  const CINS = { e: 'Erkek', k: 'Kız' };
  const EYE = { parlak: 'Parlak', keskin: 'Keskin', yumusak: 'Yumuşak', kedi: 'Kedi', yildiz: 'Yıldızlı', sakin: 'Sakin', mutlu: 'Mutlu ^^' };
  const MOUTH = { gulus: 'Gülüş', sirit: 'Sivri Diş', acik: 'Neşeli', duz: 'Cool', kedi: 'Kedi :3', yan: 'Yan Gülüş' };
  const KAFA = { yok: 'Yok', kedi: 'Kedi Kulağı', tilki: 'Tilki Kulağı', tavsan: 'Tavşan Kulağı', boynuz: 'Boynuz', hale: 'Hale', tac: 'Taç', toka: 'Yıldız Toka', cicek: 'Çiçek', bere: 'Bere' };
  const KULAK = { yok: 'Yok', halka: 'Halka Küpe', damla: 'Taşlı Küpe', tuy: 'Tüy Küpe', capraz: 'Haç Küpe', kulaklik: 'Kulaklık' };
  const YUZ = { yok: 'Yok', gozluk: 'Gözlük', yuvarlak: 'Yuvarlak Gözlük', gunes: 'Güneş Gözlüğü', bant: 'Göz Bandı', maske: 'Maske', yara: 'Yara Bandı', cil: 'Çiller' };
  const BOYUN = { yok: 'Yok', atki: 'Atkı', kolye: 'Kolye', choker: 'Choker', kravat: 'Kravat', papyon: 'Papyon' };
  const SIRT = { yok: 'Yok', kanat: 'Melek Kanadı', yarasa: 'Yarasa Kanadı', kelebek: 'Peri Kanadı', kilic: 'Kılıç', canta: 'Sırt Çantası', pelerin: 'Pelerin' };
  const KUYRUK = { yok: 'Yok', kedi: 'Kedi', tilki: 'Tilki', seytan: 'Şeytan', ejderha: 'Ejderha', tavsan: 'Tavşan' };
  const ELEMENT = { yok: 'Yok', ates: '🔥 Ateş', su: '💧 Su', elektro: '⚡ Elektro', ruzgar: '🌪️ Rüzgar', buz: '❄️ Buz', yaprak: '🍃 Doğa' };
  const ELC = { ates: '#ff6a3a', su: '#3aa8ff', elektro: '#b47aff', ruzgar: '#4ae0c0', buz: '#9ae6ff', yaprak: '#8ad040' };
  const COLORS = {
    sac: [null, '#2a2238', '#5a3a2a', '#a86a3a', '#f4d27a', '#f4f0ff', '#c8ccd8', '#ff9ac8', '#c8a0ff', '#7ab8ff', '#5ad0b0', '#ff6a5a', '#3a4a8a'],
    giysi: [null, '#2a2a4a', '#1e3a5a', '#f4f0e6', '#3a6a5a', '#7a2a3a', '#c83a4a', '#3a4a9a', '#6a4aa0', '#e8a0c0', '#8a6a4a', '#5a7ab0', '#d8c098'],
    goz: ['#3a7aff', '#ff4a6a', '#ffb02a', '#ffe14a', '#4ad07a', '#2ac0d0', '#9a5aff', '#ff6ac8', '#c8d0e0', '#8a5a3a'],
    aks: ['#e8c06a', '#c8ccd8', '#ffffff', '#2a2a3a', '#ff4a6a', '#ff8ac8', '#3a7aff', '#4ad0d0', '#9a5aff', '#5ad08a', '#ff9a3a', '#7a4a2a', '#3a2a4a', '#f4a03a'],
  };
  const DEF = { cins: 'e', sac: 'k1', sacR: null, ust: 'k1', ustR: null, alt: 'k1', altR: null, ayak: 'k1', ayakR: null, goz: '#3a7aff', gozT: 'parlak', agiz: 'gulus',
    kafa: 'yok', kafaR: '#e8c06a', kulak: 'yok', kulakR: '#e8c06a', yuz: 'yok', yuzR: '#2a2a3a', boyun: 'yok', boyunR: '#ff4a6a', sirt: 'yok', sirtR: '#ffffff', kuyruk: 'yok', kuyrukR: '#f4a03a', element: 'yok' };

  // ---------- çizim yardımcıları ----------
  let G, T = 0, C = null;
  function cel(c, path, o = {}) {
    G.beginPath(); path(G); G.fillStyle = c; G.fill();
    if (o.sh !== 0) { G.save(); G.clip(); G.translate(o.sx ?? 3, o.sy ?? 2.5); G.beginPath(); path(G); G.rect(-500, -500, 1000, 1000); G.fillStyle = dk(c, .22); G.globalAlpha = o.sh ?? .6; G.fill('evenodd'); G.restore(); }
    if (o.lw !== 0) { G.beginPath(); path(G); G.strokeStyle = o.lc || dk(c, .62); G.lineWidth = o.lw || 1.1; G.lineJoin = 'round'; G.stroke(); }
  }
  const line = (pts, c, w = 1.2) => { G.strokeStyle = c; G.lineWidth = w; G.lineCap = 'round'; G.lineJoin = 'round'; G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); };
  const glow = (c, b, fn) => { G.save(); G.shadowColor = c; G.shadowBlur = b; fn(); G.restore(); };

  // ---------- YÜZ ----------
  function eye(x, y, s, side, male) {
    const t = C.gozT, goz = C.goz, w = (side ? 4.4 : 5.4) * (male ? .95 : 1), h = male ? 6.6 : 7.6, blink = (T % 4.1) < .1, g = G;
    if (t === 'mutlu' || blink) { line([[x - w, y + 1], [x, y - 3], [x + w, y + 1]], '#2a1828', 1.9); return; }
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, w, h, 0, 0, 7); g.fill();
    const ir = g.createLinearGradient(0, y - h, 0, y + h); ir.addColorStop(0, dk(goz, .55)); ir.addColorStop(.55, goz); ir.addColorStop(1, lt(goz, .55));
    g.save(); g.beginPath(); g.ellipse(x, y, w, h, 0, 0, 7); g.clip();
    g.fillStyle = ir; g.beginPath(); g.ellipse(x + (side ? 1 : s * .4), y + .6, w * .84, h * .93, 0, 0, 7); g.fill();
    g.fillStyle = dk(goz, .75); if (t === 'kedi') { g.beginPath(); g.ellipse(x + s * .4, y + .4, 1, h * .7, 0, 0, 7); g.fill(); } else { g.beginPath(); g.ellipse(x + s * .4, y, w * .38, h * .45, 0, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(30,10,40,.32)'; g.fillRect(x - w, y - h, w * 2, h * .45);
    const tilt = t === 'keskin' ? 2.2 : t === 'yumusak' ? -1.6 : 0, TEN = '#fff0e6';
    if (tilt) { g.fillStyle = TEN; g.beginPath(); g.moveTo(x - w - 1, y - h - 1); g.lineTo(x + w + 1, y - h - 1); g.lineTo(x + w + 1, y - h + 2 + (s * tilt > 0 ? tilt * 1.4 : 0)); g.lineTo(x - w - 1, y - h + 2 + (s * tilt < 0 ? -tilt * 1.4 : 0)); g.fill(); }
    if (t === 'sakin') { g.fillStyle = TEN; g.fillRect(x - w - 1, y - h - 1, w * 2 + 2, h * .75); }
    g.restore();
    if (t === 'yildiz') { g.fillStyle = '#fff'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 1.1 : 2.8; g.lineTo(x - 1 + Math.cos(a) * r, y - 2 + Math.sin(a) * r); } g.fill(); }
    else { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x - s * 1.5 - .4, y - 2.4 + (t === 'sakin' ? 2 : 0), 1.7, 2.1, 0, 0, 7); g.fill(); g.globalAlpha = .9; g.beginPath(); g.arc(x + s * 1.6, y + 2.6, .9, 0, 7); g.fill(); g.globalAlpha = 1; }
    g.strokeStyle = '#2a1828'; g.lineCap = 'round'; g.lineWidth = male ? 1.7 : 2.2; g.beginPath();
    const ly = y - h + .8 + (t === 'keskin' ? 1 : 0) + (t === 'sakin' ? h * .6 : 0); g.moveTo(x - w - .6, ly + (t === 'keskin' ? s * 1.6 : 1.4)); g.quadraticCurveTo(x, ly - 2.4 + (t === 'yumusak' || t === 'sakin' ? 1.4 : 0), x + w + .6, ly + (t === 'keskin' ? -s * 1.6 : 1.4)); g.stroke();
    if (!male) { g.lineWidth = 1.3; g.beginPath(); g.moveTo(x + s * (w + .3), ly + 1); g.lineTo(x + s * (w + 2.6), ly - 1); g.stroke(); g.strokeStyle = 'rgba(42,24,40,.45)'; g.lineWidth = .8; g.beginPath(); g.moveTo(x - w + 1, y + h - .4); g.quadraticCurveTo(x, y + h + .8, x + w - 1, y + h - .4); g.stroke(); }
  }
  function mouth(m, x, y) {
    const g = G; g.strokeStyle = '#7a2a3a'; g.lineWidth = 1.1; g.lineCap = 'round';
    if (m === 'acik') { g.fillStyle = '#9a2a3a'; g.beginPath(); g.moveTo(x - 3, y - .6); g.quadraticCurveTo(x, y + 4.6, x + 3, y - .6); g.closePath(); g.fill(); g.fillStyle = '#ff8a9a'; g.beginPath(); g.ellipse(x, y + 2, 1.5, .9, 0, 0, 7); g.fill(); }
    else if (m === 'sirit') { g.beginPath(); g.moveTo(x - 3.3, y); g.quadraticCurveTo(x, y + 2.2, x + 3.3, y - .6); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x + 1, y + 1); g.lineTo(x + 2.3, y + .6); g.lineTo(x + 1.7, y + 2.4); g.fill(); }
    else if (m === 'duz') { g.beginPath(); g.moveTo(x - 2, y + .5); g.lineTo(x + 2, y + .2); g.stroke(); }
    else if (m === 'kedi') { g.beginPath(); g.arc(x - 1.5, y, 1.5, .2, Math.PI - .2); g.arc(x + 1.5, y, 1.5, .2, Math.PI - .2); g.stroke(); }
    else if (m === 'yan') { g.beginPath(); g.moveTo(x - 2.3, y + .6); g.quadraticCurveTo(x + 1, y + 1.3, x + 2.8, y - 1.1); g.stroke(); }
    else { g.beginPath(); g.moveTo(x - 2.4, y); g.quadraticCurveTo(x, y + 2, x + 2.4, y); g.stroke(); }
  }
  // kafa koordinatı: anime birimleri (göz y=-117, kafa ~ -146..-103)
  function headFrame(H, view) { const hw = H.hx1 - H.hx0, hh = H.chin - H.top, k = hw * .88 / 34, cx = (H.hx0 + H.hx1) / 2; G.translate(cx, H.top + hh * .66); G.scale(k, k); G.translate(0, 117); }
  function face(male, view) {
    if (view === 'arka') return;
    if (view === 'on') {
      for (const s of [-1, 1]) eye(s * 7.4, -117, s, false, male);
      for (const s of [-1, 1]) { G.strokeStyle = 'rgba(80,50,60,.75)'; G.lineWidth = male ? 1.6 : 1; G.lineCap = 'round'; G.beginPath(); if (male) { G.moveTo(s * 3, -127.5); G.quadraticCurveTo(s * 8, -128.8, s * 12, -127.6); } else { G.moveTo(s * 4, -128); G.quadraticCurveTo(s * 8.6, -129.2, s * 11.6, -127.8); } G.stroke(); }
      G.fillStyle = male ? 'rgba(255,110,140,.18)' : 'rgba(255,110,140,.36)'; for (const s of [-1, 1]) { G.beginPath(); G.ellipse(s * 10.5, -109.8, 3.4, 1.7, 0, 0, 7); G.fill(); }
      G.fillStyle = 'rgba(160,80,80,.35)'; G.beginPath(); G.arc(.5, -111, .6, 0, 7); G.fill(); mouth(C.agiz, 0, -106.6);
    } else {
      const fx = 6.8; eye(fx, -117, 1, true, male);
      G.strokeStyle = 'rgba(80,50,60,.75)'; G.lineWidth = male ? 1.6 : 1; G.beginPath(); G.moveTo(fx - 3, -127.6); G.quadraticCurveTo(fx + 1, -128.8, fx + 4.6, -127.6); G.stroke();
      G.fillStyle = male ? 'rgba(255,110,140,.18)' : 'rgba(255,110,140,.36)'; G.beginPath(); G.ellipse(fx - 1, -109.8, 3, 1.6, 0, 0, 7); G.fill(); mouth(C.agiz, fx + 4.2, -106.6);
    }
  }
  // ---------- AKSESUARLAR (anime birimleri) ----------
  function kafaDraw(f) {
    const a = C.kafa, R = C.kafaR, sideK = f === 1;
    if (a === 'kedi' || a === 'tilki' || a === 'tavsan') for (const s of sideK ? [-1] : [-1, 1]) { const x = sideK ? -5 : s * 11.5; G.save(); G.translate(x, -141); if (a === 'tavsan') { G.rotate(s * .18); cel(R, g => g.ellipse(0, -14, 4.6, 14, 0, 0, 7), { sh: .3 }); G.fillStyle = '#ffb0c8'; G.beginPath(); G.ellipse(0, -13, 2.2, 10, 0, 0, 7); G.fill(); } else { const big = a === 'tilki' ? 1.35 : 1; G.scale(big, big); cel(R, g => { g.moveTo(-6, 0); g.lineTo(s * 2, -18); g.lineTo(7, -2); g.closePath(); }, { sh: .3 }); G.fillStyle = a === 'tilki' ? '#fff' : '#ffb0c8'; G.beginPath(); G.moveTo(-2.5, -3); G.lineTo(s * 1.6, -13); G.lineTo(3.5, -4); G.fill(); } G.restore(); }
    if (a === 'boynuz') for (const s of sideK ? [-1] : [-1, 1]) { const x = sideK ? -4 : s * 11; cel(R, g => { g.moveTo(x - 3, -143); g.quadraticCurveTo(x + s * 8, -151, x + s * 6, -163); g.quadraticCurveTo(x + s * 14, -149, x + 4, -141); g.closePath(); }, { sh: .3 }); }
    if (a === 'hale') glow(R, 12, () => { G.strokeStyle = R; G.lineWidth = 2.4; G.beginPath(); G.ellipse(0, -162 + Math.sin(T * 2) * 1.5, 13, 3.6, 0, 0, 7); G.stroke(); });
    if (a === 'tac') cel(R, g => { const x = sideK ? -2 : 4; g.moveTo(x - 7, -143); g.lineTo(x - 8, -153); g.lineTo(x - 3.5, -148); g.lineTo(x, -155); g.lineTo(x + 3.5, -148); g.lineTo(x + 8, -153); g.lineTo(x + 7, -143); g.closePath(); }, { sh: .3 });
    if (a === 'toka' && f !== 2) { const x = sideK ? 3 : -12; cel(R, g => { for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 2 : 4.6; g.lineTo(x + Math.cos(an) * r, -135 + Math.sin(an) * r); } g.closePath(); }, { sh: 0, lw: .9 }); }
    if (a === 'cicek') { const x = sideK ? -6 : f === 2 ? 10 : 12, y = -139; for (let i = 0; i < 5; i++) { const an = i / 5 * Math.PI * 2; cel(R, g => g.ellipse(x + Math.cos(an) * 3.6, y + Math.sin(an) * 3.6, 3, 3, 0, 0, 7), { sh: .2, lw: .7 }); } cel('#ffe14a', g => g.arc(x, y, 2.2, 0, 7), { sh: 0, lw: .6 }); }
    if (a === 'bere') { cel(R, g => { g.moveTo(-19, -136); g.bezierCurveTo(-21, -163, 21, -163, 19, -136); g.closePath(); }, { sh: .4 }); cel(dk(R, .15), g => rr(g, -19.5, -140, 39, 6, 3), { sh: 0, lw: .8 }); cel(lt(R, .5), g => g.arc(0, -160, 5, 0, 7), { sh: .3 }); }
  }
  function kulakDraw(f) {
    const a = C.kulak, R = C.kulakR, xs = f === 1 ? [-3.5] : [-16.6, 16.6], yb = -112;
    if (a === 'yok') return;
    if (a === 'kulaklik') { if (f === 1) { cel('#2a2a3a', g => rr(g, -8, -124, 9, 13, 4)); cel(R, g => g.arc(-3.5, -117.5, 2.6, 0, 7), { sh: 0, lw: 0 }); line([[-3.5, -124], [-4, -148], [6, -152]], '#2a2a3a', 2.4); } else { G.strokeStyle = '#2a2a3a'; G.lineWidth = 2.6; G.beginPath(); G.ellipse(0, -122, 19.5, 30, 0, Math.PI, 0); G.stroke(); for (const s of [-1, 1]) { cel('#2a2a3a', g => rr(g, s * 19.5 - 4.5, -125, 9, 14, 4)); cel(R, g => rr(g, s * 19.5 - (s < 0 ? 4.5 : 1.5), -122, 6, 8, 2), { sh: 0, lw: 0 }); } } return; }
    for (const x of xs) { G.save(); G.translate(x, yb); G.scale(.62, .62); G.translate(-x, -yb);
      if (a === 'halka') { G.strokeStyle = R; G.lineWidth = 1.3; G.beginPath(); G.arc(x, yb + 3, 2.6, 0, 7); G.stroke(); }
      if (a === 'damla') { line([[x, yb], [x, yb + 2.5]], '#e8c06a', .8); glow(R, 6, () => cel(R, g => { g.moveTo(x, yb + 2); g.quadraticCurveTo(x + 2.6, yb + 5.5, x, yb + 7.5); g.quadraticCurveTo(x - 2.6, yb + 5.5, x, yb + 2); }, { sh: 0, lw: .6 })); }
      if (a === 'tuy') { line([[x, yb], [x, yb + 2]], '#e8c06a', .8); G.save(); G.translate(x, yb + 2); G.rotate(Math.sin(T * 2) * .15); cel(R, g => g.ellipse(0, 6, 2, 6, 0, 0, 7), { sh: .3, lw: .6 }); line([[0, 1], [0, 11]], dk(R, .4), .5); G.restore(); }
      if (a === 'capraz') { line([[x, yb], [x, yb + 2]], R, .8); line([[x, yb + 2], [x, yb + 9]], R, 1.4); line([[x - 2.2, yb + 4.4], [x + 2.2, yb + 4.4]], R, 1.4); }
      G.restore(); }
  }
  function yuzDraw(f) {
    const a = C.yuz, R = C.yuzR, sideK = f === 1; if (a === 'yok') return;
    if (f === 2) { if (['gozluk', 'yuvarlak', 'gunes', 'bant', 'maske'].includes(a)) line([[-16.5, a === 'maske' ? -110 : -119], [16.5, a === 'maske' ? -110 : -119]], a === 'bant' ? '#1a1a2a' : R, 1); return; }
    const ex = sideK ? [6.8] : [-7.4, 7.4];
    if (a === 'gozluk' || a === 'yuvarlak' || a === 'gunes') { for (const x of ex) { G.beginPath(); if (a === 'yuvarlak') G.ellipse(x, -117, 6.4, 6.4, 0, 0, 7); else rr(G, x - (sideK ? 5 : 6.8), -122, sideK ? 10 : 13.6, 9.6, 3); if (a === 'gunes') { G.fillStyle = 'rgba(20,16,30,.88)'; G.fill(); } G.strokeStyle = R; G.lineWidth = 1.3; G.stroke(); if (a === 'gunes') { G.fillStyle = 'rgba(255,255,255,.35)'; G.fillRect(x - 3, -120, 2, 4); } } if (!sideK) line([[-1, -118], [1, -118]], R, 1.1); else line([[1.8, -118], [-6, -120]], R, 1.1); }
    if (a === 'bant') { const x = sideK ? 6.8 : 7.4; cel('#1a1a2a', g => g.ellipse(x, -117, 6.4, 7.2, 0, 0, 7), { sh: 0, lw: .8 }); line(sideK ? [[1, -121], [-14, -128]] : [[-16.5, -128], [2, -121], [14, -114], [16.5, -112]], '#1a1a2a', 1.2); }
    if (a === 'maske') cel(R, g => { if (sideK) { g.moveTo(-3, -113); g.lineTo(13, -113); g.quadraticCurveTo(12, -103, 0, -102); g.lineTo(-3, -106); g.closePath(); } else { g.moveTo(-15, -113); g.quadraticCurveTo(0, -116, 15, -113); g.quadraticCurveTo(12, -101, 0, -100); g.quadraticCurveTo(-12, -101, -15, -113); g.closePath(); } }, { sh: .3 });
    if (a === 'yara') { G.save(); G.translate(sideK ? 5 : 10, -110); G.rotate(-.4); cel('#f6dcbc', g => rr(g, -4.5, -2, 9, 4, 2), { sh: 0, lw: .8, lc: '#c8a080' }); G.restore(); }
    if (a === 'cil') { G.fillStyle = 'rgba(150,80,50,.55)'; for (const x0 of sideK ? [6] : [-9, 9]) for (const [dx, dy] of [[-2, 0], [0, 1.4], [2, -.4], [1, 2.6], [-1.4, 2.4]]) { G.beginPath(); G.arc(x0 + dx, -110 + dy, .55, 0, 7); G.fill(); } }
  }
  // gövde koordinatı: anime birimleri (omuz y=-98, kalça y=-60)
  function bodyFrame(R, view, up) { const PV = R.pivot, kol = view === 'yan' ? PV.kol : PV.kolL, bac = view === 'yan' ? PV.bacak : PV.bacakL, kb = (bac[1] - kol[1]) / 38; G.translate(R.foot[0], kol[1] + up); G.scale(kb, kb); G.translate(0, 98); }
  function boyunDraw(f, front) {
    const a = C.boyun, R = C.boyunR, w = Math.sin(T * 3) * 2;
    if (a === 'atki') { if (front) { cel(R, g => rr(g, f === 1 ? -7 : -11, -106, f === 1 ? 15 : 22, 8, 4)); if (f === 0) cel(R, g => poly(g, [[3, -101], [10, -101], [12 + w * .3, -80], [5 + w * .3, -82]])); } else cel(R, g => poly(g, [[-4, -101], [4, -101], [-14 + w, -76], [-22 + w, -80]])); return; }
    if (!front) return;
    if (f === 2) { if (a === 'choker' || a === 'kolye') line([[-4.5, -104], [4.5, -104]], a === 'choker' ? '#1a1a2a' : R, 1); return; }
    if (f === 1) { if (a === 'choker') cel('#1a1a2a', g => rr(g, -3, -106, 7, 2.6, 1), { sh: 0, lw: 0 }); if (a === 'kolye') line([[-2, -105], [4, -98]], R, .9); if (a === 'kravat') cel(R, g => poly(g, [[3, -101], [5, -101], [6, -82], [4, -80]]), { sh: .2, lw: .7 }); return; }
    if (a === 'kolye') { G.strokeStyle = R; G.lineWidth = .9; G.beginPath(); G.arc(0, -106, 7, .5, Math.PI - .5); G.stroke(); glow(R, 6, () => cel(R, g => { g.moveTo(0, -100.5); g.lineTo(2.2, -98); g.lineTo(0, -95); g.lineTo(-2.2, -98); g.closePath(); }, { sh: 0, lw: .6 })); }
    if (a === 'choker') { cel('#1a1a2a', g => rr(g, -4, -106, 8, 2.8, 1), { sh: 0, lw: 0 }); cel(R, g => g.arc(0, -102.6, 1.6, 0, 7), { sh: 0, lw: .5 }); }
    if (a === 'kravat') cel(R, g => poly(g, [[-2.2, -101], [2.2, -101], [3, -82], [0, -78], [-3, -82]]), { sh: .3, lw: .8 });
    if (a === 'papyon') cel(R, g => { g.moveTo(0, -101); g.lineTo(-6, -104.5); g.lineTo(-6, -97.5); g.closePath(); g.moveTo(0, -101); g.lineTo(6, -104.5); g.lineTo(6, -97.5); g.closePath(); }, { sh: .2, lw: .8 });
  }
  function cape(f, col) { const w = Math.sin(T * 2.5) * 2, sideK = f === 1; cel(col, g => { g.moveTo(sideK ? -6 : -15, -101); g.lineTo(sideK ? 4 : 15, -101); g.quadraticCurveTo(sideK ? 2 : 22, -60, sideK ? -2 + w : 24 + w, -24); g.lineTo(sideK ? -22 + w : -24 + w, -22); g.quadraticCurveTo(sideK ? -16 : -22, -60, sideK ? -6 : -15, -101); g.closePath(); }); line(sideK ? [[-20 + w, -25], [-2 + w, -27]] : [[-23 + w, -25], [23 + w, -27]], lt(col, .4), 1.4); }
  function wing(s, kind) {
    const R = C.sirtR, flap = Math.sin(T * 3) * .1; G.save(); G.translate(s * 8, kind === 'kanat' ? -86 : -96); G.rotate(s * flap - s * (kind === 'kanat' ? .3 : kind === 'kelebek' ? .2 : .1)); G.scale(s * (kind === 'kanat' ? 1.5 : 1.3), kind === 'kanat' ? 1.5 : 1.3);
    if (kind === 'yarasa') { cel(R, g => { g.moveTo(0, 0); g.lineTo(16, -26); g.lineTo(44, -34); g.quadraticCurveTo(40, -20, 46, -10); g.quadraticCurveTo(36, -12, 34, 0); g.quadraticCurveTo(26, -6, 22, 8); g.quadraticCurveTo(14, 0, 4, 10); g.closePath(); }, { sh: .4 }); line([[0, 0], [16, -26], [44, -34]], dk(R, .5), 1.4); line([[16, -26], [34, 0]], dk(R, .4), .8); line([[16, -26], [22, 8]], dk(R, .4), .8); }
    else if (kind === 'kelebek') { G.globalAlpha = .82; cel(R, g => g.ellipse(20, -20, 20, 13, -.5, 0, 7), { sh: .2, lc: lt(R, .5) }); cel(lt(R, .3), g => g.ellipse(16, 8, 12, 8, .5, 0, 7), { sh: .2, lc: lt(R, .5) }); G.globalAlpha = 1; G.fillStyle = 'rgba(255,255,255,.5)'; G.beginPath(); G.arc(24, -24, 3, 0, 7); G.arc(18, 8, 2, 0, 7); G.fill(); }
    else { for (let i = 3; i >= 0; i--) cel(i % 2 ? lt(R, .02) : R, g => g.ellipse(14 + i * 7, -14 + i * 4, 14 - i, 6.5, -.6 + i * .25, 0, 7), { sh: .35 }); cel(R, g => g.ellipse(10, -16, 10, 7, -.5, 0, 7), { sh: .3 }); }
    G.restore();
  }
  function sword(sideK) { G.save(); G.translate(sideK ? -8 : 21, -100); G.rotate(Math.PI + (sideK ? .3 : .5)); cel('#e8ecf4', g => poly(g, [[-2, 0], [2, 0], [2, -78], [0, -84], [-2, -78]]), { sh: .3, lc: '#8a90a8' }); cel('#e8c06a', g => rr(g, -6, -2, 12, 3, 1), { sh: 0, lw: .7 }); cel(C.sirtR === '#ffffff' ? '#3a2a4a' : C.sirtR, g => rr(g, -2.2, 1, 4.4, 16, 1.5), { sh: .3 }); G.restore(); }
  function sirtDraw(f, layer) {
    const a = C.sirt, R = C.sirtR, sideK = f === 1, back = f === 2; if (a === 'yok') return;
    const wings = a === 'kanat' || a === 'yarasa' || a === 'kelebek';
    if (layer === 'arka') { // gövdenin arkasında
      if (wings && !back) { if (sideK) wing(-1, a); else { wing(-1, a); wing(1, a); } }
      if (a === 'pelerin' && !back) cape(f, R);
      if (a === 'kilic' && !back) sword(sideK);
      if (a === 'canta' && !back) cel(R, g => rr(g, sideK ? -24 : -17, -100, sideK ? 12 : 34, 34, 7), { sh: .3 });
    } else {
      if (a === 'canta' && f === 0) for (const s of [-1, 1]) line([[s * 10, -101], [s * 12, -72]], R, 2.6);
      if (a === 'canta' && back) { cel(R, g => rr(g, -14, -98, 28, 32, 7), { sh: .4 }); cel(dk(R, .12), g => rr(g, -10, -80, 20, 10, 3), { sh: 0, lw: .8 }); }
      if (a === 'canta' && sideK) line([[-8, -100], [-4, -72]], dk(R, .2), 2.4);
      if (back && wings) { wing(-1, a); wing(1, a); }
      if (back && a === 'kilic') sword(false);
      if (back && a === 'pelerin') cape(2, R);
    }
  }
  function kuyrukDraw(f) {
    const a = C.kuyruk, R = C.kuyrukR, sideK = f === 1, sw = Math.sin(T * 2.2) * .25; if (a === 'yok') return;
    G.save(); G.translate(sideK ? -9 : 0, -62); G.rotate(sw); const dir = sideK ? -1 : 1;
    if (a === 'tavsan') { cel('#fffaf4', g => g.arc(sideK ? -2 : 0, 2, 5, 0, 7), { sh: .3 }); G.restore(); return; }
    if (a === 'tilki') { cel(R, g => { g.moveTo(0, -2); g.quadraticCurveTo(dir * 26, 6, dir * 30, -18); g.quadraticCurveTo(dir * 34, -34, dir * 22, -40); g.quadraticCurveTo(dir * 26, -22, dir * 12, -14); g.quadraticCurveTo(dir * 6, -6, 0, 4); g.closePath(); }, { sh: .4 }); cel('#fffaf4', g => { g.moveTo(dir * 30, -24); g.quadraticCurveTo(dir * 34, -34, dir * 22, -40); g.quadraticCurveTo(dir * 26, -30, dir * 24, -26); g.closePath(); }, { sh: 0, lw: .8 }); G.restore(); return; }
    if (a === 'ejderha') { cel(R, g => { g.moveTo(-3, 0); g.quadraticCurveTo(dir * 20, 12, dir * 34, 2); g.lineTo(dir * 40, -2); g.lineTo(dir * 33, 6); g.quadraticCurveTo(dir * 18, 18, 3, 4); g.closePath(); }, { sh: .4 }); for (let i = 0; i < 4; i++) { const x = dir * (8 + i * 7), y = 6 - i * 1.2; cel(lt(R, .2), g => { g.moveTo(x - 2, y); g.lineTo(x, y - 5); g.lineTo(x + 2, y); g.closePath(); }, { sh: 0, lw: .6 }); } G.restore(); return; }
    // kedi / şeytan: ince kıvrık
    G.strokeStyle = dk(R, .6); G.lineWidth = 6.4; G.lineCap = 'round'; G.beginPath(); G.moveTo(0, 0); G.quadraticCurveTo(dir * 24, 8, dir * 26, -24); G.stroke(); G.strokeStyle = R; G.lineWidth = 4.2; G.stroke();
    if (a === 'seytan') cel(R, g => { const x = dir * 26, y = -24; g.moveTo(x, y - 7); g.lineTo(x + 5, y + 1); g.lineTo(x, y - 1); g.lineTo(x - 5, y + 1); g.closePath(); }, { sh: 0, lw: .8 });
    G.restore();
  }
  function element(front) {
    if (C.element === 'yok') return; const c = ELC[C.element], e = C.element, t = T;
    if (!front) { const gr = G.createRadialGradient(0, -6, 2, 0, -6, 34); gr.addColorStop(0, c + '66'); gr.addColorStop(1, c + '00'); G.fillStyle = gr; G.beginPath(); G.ellipse(0, -4, 34, 10, 0, 0, 7); G.fill(); glow(c, 10, () => { G.strokeStyle = c; G.globalAlpha = .7; G.lineWidth = 1.4; G.beginPath(); G.ellipse(0, -2, 26, 6.5, 0, 0, 7); G.stroke(); }); return; }
    for (let i = 0; i < 10; i++) { const k = (t * .35 + i / 10) % 1, x = Math.sin(i * 2.7 + t * (e === 'ruzgar' ? 2 : .3)) * (26 + (i % 3) * 7), y = -8 - k * 175; G.save(); G.globalAlpha = Math.sin(k * Math.PI) * .9; G.translate(x, y); G.scale(1.3, 1.3);
      if (e === 'ates') glow(c, 10, () => { G.fillStyle = i % 2 ? '#ffd23f' : c; G.beginPath(); G.moveTo(0, -5); G.quadraticCurveTo(3, 0, 0, 3); G.quadraticCurveTo(-3, 0, 0, -5); G.fill(); });
      else if (e === 'su') { G.strokeStyle = c; G.lineWidth = 1.2; G.fillStyle = c + '44'; G.beginPath(); G.arc(0, 0, 2 + i % 3, 0, 7); G.fill(); G.stroke(); }
      else if (e === 'elektro') glow(c, 10, () => { G.strokeStyle = '#f0e0ff'; G.lineWidth = 1.2; G.beginPath(); G.moveTo(-3, -5); G.lineTo(1, -1); G.lineTo(-1, 1); G.lineTo(3, 5); G.stroke(); });
      else if (e === 'ruzgar') { G.strokeStyle = c; G.lineWidth = 1.4; G.beginPath(); G.arc(0, 0, 4, 0, Math.PI * 1.4); G.stroke(); }
      else if (e === 'buz') glow(c, 8, () => { G.strokeStyle = '#eafaff'; G.lineWidth = 1; G.beginPath(); for (let j = 0; j < 3; j++) { G.moveTo(Math.cos(j * 1.05) * 3.5, Math.sin(j * 1.05) * 3.5); G.lineTo(-Math.cos(j * 1.05) * 3.5, -Math.sin(j * 1.05) * 3.5); } G.stroke(); });
      else { G.rotate(t + i); G.fillStyle = c; G.beginPath(); G.ellipse(0, 0, 3.6, 1.6, 0, 0, 7); G.fill(); }
      G.restore(); }
  }

  // ---------- ANA ÇİZİM ----------
  function layer(kom, cat, gk, view, pn) { // {im, pos} veya null
    if (!kom || kom === 'yok' || !META[kom] || !META[kom][cat]) return null;
    const P = META[kom][cat].parts[gk]; if (!P || !P[view] || !P[view][pn]) return null;
    const src = `${BASE}kombin/${kom}_${gk}_${view}_${cat}_${pn}.webp`; return { im: tinted(src, C[cat + 'R']), pos: P[view][pn] };
  }
  function put(L, piv, rot = 0, dx = 0, dy = 0, sy = 1) { if (!L || !L.im) return; const im = L.im, w = im.naturalWidth || im.width, h = im.naturalHeight || im.height; if (!w) return; G.save(); G.translate(piv[0] + dx, piv[1] + dy); G.rotate(rot); G.scale(1, sy); G.translate(-piv[0], -piv[1]); G.drawImage(im, L.pos[0], L.pos[1], w, h); G.restore(); }
  function draw(g, cfg = {}, x = 0, y = 0, sc = 1, o = {}) {
    if (!RIG) return null; G = g;
    C = Object.assign({}, DEF, cfg); const gk = C.cins === 'k' ? 'k' : 'e', male = gk === 'e';
    const dir = o.dir || 's', anim = o.anim || 'idle', t = T = o.t != null ? o.t : performance.now() / 1000;
    const view = dir === 's' ? 'on' : dir === 'n' ? 'arka' : 'yan', R = RIG[gk][view], P = R.parts, PV = R.pivot, F = R.foot, H = R.head;
    const walk = anim === 'walk', sit = anim === 'sit', ph = t * 8.5, sw = walk ? Math.sin(ph) : 0;
    const bob = walk ? Math.abs(Math.sin(ph)) * 7 : anim === 'cheer' ? Math.abs(Math.sin(t * 7)) * 22 : Math.sin(t * 2.2) * 2;
    const MK = n => ({ im: IMG[`${BASE}manken/${gk}_${view}_${n}.webp`], pos: P[n] });
    let hand = null;
    g.save(); g.translate(x, y); g.scale(sc, sc);
    g.fillStyle = 'rgba(40,20,60,.22)'; g.beginPath(); g.ellipse(0, 0, 95, 20, 0, 0, 7); g.fill();
    if (dir === 'w') g.scale(-1, 1);
    g.translate(-F[0], -F[1]);
    const up = -bob + (sit ? 120 : 0), hb = Math.sin(t * 2.2 + .6) * 1.2, htilt = walk ? Math.sin(ph) * .025 : anim === 'cheer' ? Math.sin(t * 7) * .05 : Math.sin(t * 1.3) * .015;
    const inBody = (fn) => { g.save(); bodyFrame(R, view, up); fn(); g.restore(); };
    const headT = (fn) => { g.save(); g.translate(0, up + hb); g.translate(PV.bas[0], PV.bas[1]); g.rotate(htilt); g.translate(-PV.bas[0], -PV.bas[1]); fn(); g.restore(); };
    const inHead = (fn) => { g.save(); headFrame(H, view); fn(); g.restore(); };
    g.save(); bodyFrame(R, view, 0); element(false); g.restore();
    if (view === 'yan') {
      const f = 1;
      let aF = walk ? -sw * .45 : 0, aB = walk ? sw * .45 : 0; if (anim === 'fish') aF = -1.25; if (anim === 'wave') aF = -2.7 + Math.sin(t * 9) * .3; if (anim === 'cheer') aF = aB = -2.9; if (sit) aF = aB = -.5;
      const lF = sit ? -1.5 : sw * .42, lB = sit ? -1.35 : -sw * .42;
      inBody(() => { sirtDraw(f, 'arka'); kuyrukDraw(f); if (C.boyun === 'atki') boyunDraw(f, false); });
      g.save(); g.filter = 'brightness(.82)'; put(MK('kol'), PV.kol, aB, 0, up); put(MK('bacak'), PV.bacak, lB, 0, sit ? 120 : 0); g.restore();
      put(MK('bacak'), PV.bacak, lF, 0, sit ? 120 : 0);
      put(MK('govde'), PV.bas, 0, 0, up);
      inBody(() => { sirtDraw(f, 'on'); boyunDraw(f, true); });
      headT(() => { put(MK('bas'), PV.bas); inHead(() => { face(male, 'yan'); yuzDraw(f); kulakDraw(f); kafaDraw(f); }); });
      put(MK('kol'), PV.kol, aF, 0, up);
      const m = g.getTransform(); const hp = new DOMPoint(PV.kol[0] + Math.sin(-aF) * 150, PV.kol[1] + up + Math.cos(aF) * 150).matrixTransform(m); hand = { hx: hp.x, hy: hp.y };
    } else {
      const back = view === 'arka', f = back ? 2 : 0;
      let aR = walk ? sw * .1 : 0, aL = walk ? sw * .1 : 0;
      if (anim === 'wave') aR = -1.75 + Math.sin(t * 9) * .3; if (anim === 'cheer') { aR = -2.3; aL = 2.3; } if (anim === 'fish') aR = -1.05; if (sit) { aR = -.25; aL = .25; }
      if (back) [aR, aL] = [-aL, -aR];
      const hasUst = !!layer(C.ust, 'ust', gk, view, 'govde'), hasAlt = !!layer(C.alt, 'alt', gk, view, 'kalca'), hasAyak = !!layer(C.ayak, 'ayak', gk, view, 'L');
      if (!back) inBody(() => { sirtDraw(f, 'arka'); kuyrukDraw(f); });
      for (const s of ['L', 'R']) { const lift = walk ? Math.max(0, Math.sin(ph) * (s === 'L' ? 1 : -1)) * 16 : 0, dy = -lift + (sit ? 120 : 0), sy = sit ? .62 : 1, pv = PV['bacak' + s];
        if (!hasAlt || !hasAyak) put(MK('bacak' + s), pv, 0, 0, dy, sy);
        put(layer(C.alt, 'alt', gk, view, 'bacak' + s), pv, 0, 0, dy, sy); put(layer(C.ayak, 'ayak', gk, view, s), pv, 0, 0, dy, sy); }
      for (const [s, a] of [['L', aL], ['R', aR]]) { if (!hasUst) put(MK('kol' + s), PV['kol' + s], a, 0, up); put(layer(C.ust, 'ust', gk, view, 'kol' + s), PV['kol' + s], a, 0, up); }
      if (!(hasUst && hasAlt)) put(MK('govde'), PV.bas, 0, 0, up);
      put(layer(C.alt, 'alt', gk, view, 'kalca'), PV.bas, 0, 0, up); put(layer(C.ust, 'ust', gk, view, 'govde'), PV.bas, 0, 0, up);
      if (back) inBody(() => { sirtDraw(f, 'on'); kuyrukDraw(f); });
      inBody(() => { if (back && C.boyun === 'atki') boyunDraw(f, false); boyunDraw(f, true); if (!back) sirtDraw(f, 'on'); });
      headT(() => { put(MK('bas'), PV.bas); inHead(() => { face(male, view); if (!back) yuzDraw(f); }); put(layer(C.sac, 'sac', gk, view, 'bas'), PV.bas); inHead(() => { if (back) yuzDraw(f); kulakDraw(f); kafaDraw(f); }); });
      const pv = back ? PV.kolL : PV.kolR, aa = back ? aL : aR, dir2 = back ? -1 : 1, L = 165, a0 = Math.atan2(1, .42 * dir2);
      const m = g.getTransform(); const hp = new DOMPoint(pv[0] + Math.cos(a0 + aa) * L, pv[1] + up + Math.sin(a0 + aa) * L).matrixTransform(m); hand = { hx: hp.x, hy: hp.y };
    }
    g.save(); bodyFrame(R, view, up); element(true); g.restore();
    g.restore();
    return hand;
  }
  const kombinler = () => KOMBIN.map(k => [k, (META[k] && META[k].ad) || k]);
  window.Kukla = { load, draw, kombinler, META: () => META, CINS, EYE, MOUTH, KAFA, KULAK, YUZ, BOYUN, SIRT, KUYRUK, ELEMENT, ELC, COLORS, DEF };
})();
