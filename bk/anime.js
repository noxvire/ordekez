// Ördekez — ANİME GACHA karakter sistemi
// Anime.draw(g, cfg, x, y, scale, {dir:'s'|'n'|'e'|'w', anim:'idle'|'walk'|'wave'|'cheer'|'fish'|'sit', t}) -> {hx,hy}
(function () {
  const hx = h => { h = (h || '#888888').replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (c, d, k) => { const a = hx(c), b = hx(d); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const dk = (c, k) => mix(c, '#1e1030', k), lt = (c, k) => mix(c, '#ffffff', k), wm = (c, k) => mix(c, '#ff9a6a', k);
  const rr = (g, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  const poly = (g, p) => { p.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); };
  let G, T = 0;
  // cel boyama: düz renk + sağ-alt gölge bandı + ince kontur
  function cel(c, path, o = {}) {
    G.beginPath(); path(G); if (o.grad) { const gr = G.createLinearGradient(0, o.grad[0], 0, o.grad[1]); gr.addColorStop(0, lt(c, .1)); gr.addColorStop(1, o.tip || c); G.fillStyle = gr; } else G.fillStyle = c; G.fill();
    if (o.sh !== 0) { G.save(); G.clip(); G.translate(o.sx ?? 4, o.sy ?? 3); G.beginPath(); path(G); G.rect(-400, -400, 800, 800); G.fillStyle = wm(dk(c, .2), .12); G.globalAlpha = o.sh ?? .7; G.fill('evenodd'); G.restore(); }
    if (o.lw !== 0) { G.beginPath(); path(G); G.strokeStyle = o.lc || dk(c, .62); G.lineWidth = o.lw || 1.2; G.lineJoin = 'round'; G.stroke(); }
  }
  const line = (pts, c, w = 1.2) => { G.strokeStyle = c; G.lineWidth = w; G.lineCap = 'round'; G.lineJoin = 'round'; G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); };
  const glow = (c, b, fn) => { G.save(); G.shadowColor = c; G.shadowBlur = b; fn(); G.restore(); };
  // saç tutamı: kökten uca sivri
  const lock = (g, x0, y0, x1, y1, w, b = 0) => { const mx = (x0 + x1) / 2 + b, my = (y0 + y1) / 2; g.moveTo(x0 - w / 2, y0); g.quadraticCurveTo(mx - w * .35, my, x1, y1); g.quadraticCurveTo(mx + w * .35, my, x0 + w / 2, y0); g.closePath(); };

  // ---------- SEÇENEKLER ----------
  const HAIR = { kisa: 'Kirpi Kahraman', daginik: 'Dağınık', uzun: 'Uzun Düz', kuyruk: 'At Kuyruğu', ikiz: 'İkiz Kuyruk', bob: 'Küt Bob', topuz: 'Topuz', orgu: 'Yan Örgü' };
  const EYE = { parlak: 'Parlak', keskin: 'Keskin', yumusak: 'Yumuşak', kedi: 'Kedi', yildiz: 'Yıldızlı', mutlu: 'Mutlu ^^' };
  const MOUTH = { gulus: 'Gülüş', sirit: 'Sivri Diş', acik: 'Neşeli', duz: 'Cool', kedi: 'Kedi :3' };
  const UST = { ceket: 'Gezgin Ceketi', haori: 'Kimono', pelerin: 'Şövalye', okul: 'Denizci', hoodie: 'Kapüşonlu', elbise: 'Elbise' };
  const ALT = { pantolon: 'Pantolon', sort: 'Şort', etek: 'Pileli Etek', kargo: 'Kargo' };
  const AYAK = { bot: 'Bot', cizme: 'Uzun Çizme', sneaker: 'Sneaker' };
  const AKS = { yok: 'Yok', kedi: 'Kedi Kulağı', boynuz: 'Boynuz', hale: 'Hale', tac: 'Minik Taç', toka: 'Yıldız Toka', kulaklik: 'Kulaklık', gozluk: 'Gözlük', atki: 'Atkı', yara: 'Yara Bandı' };
  const ELEMENT = { yok: 'Yok', ates: '🔥 Ateş', su: '💧 Su', elektro: '⚡ Elektro', ruzgar: '🌪️ Rüzgar', buz: '❄️ Buz', yaprak: '🍃 Doğa' };
  const ELC = { ates: '#ff6a3a', su: '#3aa8ff', elektro: '#b47aff', ruzgar: '#4ae0c0', buz: '#9ae6ff', yaprak: '#8ad040' };
  const COLORS = {
    ten: ['#fff1e6', '#ffe3d0', '#f8cfb0', '#eab894', '#d49a72', '#a8704c', '#7a4e34'],
    sac: ['#2a2238', '#4a3a5a', '#6a4430', '#c88a4a', '#f4d27a', '#f4f0ff', '#c8ccd8', '#ff9ac8', '#c8a0ff', '#7ab8ff', '#5ad0b0', '#ff6a5a', '#3a4a8a', '#1a2a3a'],
    goz: ['#ff4a6a', '#ffb02a', '#ffe14a', '#4ad07a', '#2ac0d0', '#3a7aff', '#9a5aff', '#ff6ac8', '#c8d0e0', '#8a5a3a'],
    giysi: ['#2a2a4a', '#1e3a5a', '#f4f0e6', '#ffffff', '#3a6a5a', '#7a2a3a', '#c83a4a', '#3a4a9a', '#6a4aa0', '#e8a0c0', '#2a2a2a', '#8a6a4a', '#5a7ab0', '#d8c098'],
    trim: ['#e8c06a', '#c8ccd8', '#ff6a8a', '#4ac0ff', '#9a6aff', '#2a2a3a', '#ffffff', '#ff9a3a', '#5ad08a'],
  };
  const DEF = { ten: '#ffe3d0', sac: 'kisa', sacR: '#f4f0ff', sacU: '#7ab8ff', goz: '#3a7aff', gozT: 'parlak', agiz: 'gulus', ust: 'ceket', ustR: '#2a2a4a', trim: '#e8c06a', alt: 'pantolon', altR: '#1e1e30', ayak: 'bot', aks: 'yok', element: 'yok' };

  // ---------- SAÇ VERİSİ ----------
  // bangs: ön perçem tutamları [x0,y0,x1,y1,w,bend]
  const BANGS = {
    kisa: [[-14, -136, -19, -112, 9, -3], [-8, -140, -10, -114, 10, -2], [-1, -141, -3, -116, 10, 1], [6, -140, 7, -114, 10, 3], [12, -137, 16, -114, 9, 3], [16, -132, 19, -108, 7, 2], [-17, -132, -19, -106, 7, -2]],
    daginik: [[-14, -136, -21, -112, 10, -5], [-7, -140, -11, -113, 10, -4], [0, -141, 1, -115, 11, 4], [7, -140, 11, -116, 10, 5], [13, -136, 20, -112, 10, 5], [-17, -130, -20, -104, 8, -3], [17, -130, 20, -104, 8, 3]],
    uzun: [[-12, -138, -16, -114, 10, -2], [-5, -141, -7, -116, 10, -1], [2, -141, 1, -117, 10, 1], [9, -139, 12, -114, 10, 2], [-17, -132, -19, -96, 8, -2], [17, -132, 19, -96, 8, 2]],
    kuyruk: [[-12, -138, -15, -116, 10, -2], [-4, -141, -6, -118, 9, -1], [4, -141, 6, -117, 9, 1], [11, -138, 15, -115, 9, 2], [-17, -132, -18, -104, 6, -2], [17, -132, 18, -104, 6, 2]],
    ikiz: [[-11, -138, -13, -117, 10, -1], [-3, -141, -3, -119, 9, 0], [5, -140, 7, -118, 9, 1], [12, -137, 14, -116, 9, 2], [-17, -132, -18, -106, 6, -2], [17, -132, 18, -106, 6, 2]],
    bob: [[-13, -137, -14, -117, 9, 0], [-5, -140, -5, -118, 9, 0], [3, -140, 3, -118, 9, 0], [11, -137, 12, -117, 9, 0], [-17, -132, -19, -106, 9, -1], [17, -132, 19, -106, 9, 1]],
    topuz: [[-13, -137, -17, -117, 9, -3], [-5, -141, -8, -120, 9, -2], [6, -140, 10, -118, 9, 3], [-17, -131, -18, -108, 6, -2], [17, -131, 18, -108, 6, 2]],
    orgu: [[-12, -138, -16, -115, 10, -2], [-4, -141, -6, -118, 10, -1], [4, -141, 5, -117, 9, 1], [11, -138, 14, -115, 9, 2], [-17, -132, -19, -104, 7, -2]],
  };
  for (const k in BANGS) BANGS[k] = BANGS[k].map(b => Math.abs(b[2]) < 16 ? [b[0], b[1], b[2], Math.min(b[3], -121.5), b[4], b[5]] : b);
  const BACKL = { // arka tutamlar (ön görünümde kafanın arkasında)
    kisa: [[-16, -126, -20, -104, 12, -2], [16, -126, 20, -104, 12, 2]],
    daginik: [[-16, -128, -24, -100, 13, -4], [16, -128, 24, -100, 13, 4], [-10, -128, -12, -98, 12, -1], [10, -128, 12, -98, 12, 1]],
    uzun: [[-16, -130, -22, -70, 15, -3], [16, -130, 22, -70, 15, 3], [-8, -130, -12, -66, 14, -1], [8, -130, 12, -66, 14, 1]],
    kuyruk: [[-16, -126, -18, -106, 11, -1], [16, -126, 18, -106, 11, 1]],
    ikiz: [[-16, -126, -18, -108, 10, -1], [16, -126, 18, -108, 10, 1]],
    bob: [[-17, -128, -20, -102, 14, -1], [17, -128, 20, -102, 14, 1], [-9, -128, -10, -101, 13, 0], [9, -128, 10, -101, 13, 0]],
    topuz: [[-16, -126, -18, -108, 10, -1], [16, -126, 18, -108, 10, 1]],
    orgu: [[-16, -128, -19, -104, 12, -1], [16, -128, 19, -104, 12, 1]],
  };
  const CAP = g => { g.moveTo(-18.5, -120); g.bezierCurveTo(-21, -150, 21, -150, 18.5, -120); g.quadraticCurveTo(0, -128, -18.5, -120); g.closePath(); };
  function hairFill(C, pathFn, grad = [-150, -100], sh = .55) { cel(C.sacR, pathFn, { grad, tip: C.sacU || C.sacR, sh, lc: dk(C.sacR, .6) }); }
  function hairExtras(C, f, sw, layer) { // kuyruk, topuz, ikiz, örgü
    const s = C.sac;
    if (s === 'kuyruk' && layer === 'back') { G.save(); G.translate(f === 2 ? 0 : 6, -146); G.rotate((f === 2 ? 0 : .35) + sw); hairFill(C, g => lock(g, 0, 0, 6, 62, 18, 10), [0, 62]); line([[2, 8], [6, 50]], dk(C.sacR, .4), .8); G.restore(); cel(C.trim, g => g.ellipse(f === 2 ? 0 : 6, -145, 5, 3, 0, 0, 7), { sh: 0 }); }
    if (s === 'ikiz' && layer === 'back') for (const d of [-1, 1]) { G.save(); G.translate(d * 15, -140); G.rotate(-d * (.22 + sw * .5)); hairFill(C, g => lock(g, 0, 0, d * 6, 60, 16, d * 8), [0, 60]); G.restore(); cel(C.trim, g => { g.moveTo(d * 15, -140); g.lineTo(d * 22, -146); g.lineTo(d * 22, -134); g.closePath(); g.moveTo(d * 15, -140); g.lineTo(d * 8, -146); g.lineTo(d * 8, -134); g.closePath(); }, { sh: 0, lw: 1 }); }
    if (s === 'topuz' && layer === 'back') { hairFill(C, g => g.arc(0, -150, 10, 0, 7), [-160, -140]); line([[-6, -154], [4, -146]], dk(C.sacR, .4), 1); cel(C.trim, g => { g.moveTo(-14, -158); g.lineTo(14, -146); g.lineTo(13, -144); g.lineTo(-15, -156); g.closePath(); }, { sh: 0, lw: .8 }); }
    if (s === 'orgu' && layer === 'front' && f !== 2) { const bx = f === 0 ? 15 : f === 1 ? -6 : 0; for (let i = 0; i < 6; i++) hairFill(C, g => g.ellipse(bx + Math.sin(i * 1.4) * 1.2 + i * .6, -110 + i * 7.5, 5 - i * .3, 5, (i % 2 ? .4 : -.4), 0, 7), [-112 + i * 7.5, -104 + i * 7.5], .4); cel(C.trim, g => g.ellipse(bx + 3.6, -66, 4, 2.5, 0, 0, 7), { sh: 0 }); }
  }
  function hairFront(C) {
    hairFill(C, CAP); for (const b of BANGS[C.sac]) hairFill(C, g => lock(g, ...b), [-142, -108], .35);
    // hale ışık halkası (angel ring)
    G.save(); G.beginPath(); CAP(G); G.clip(); G.strokeStyle = lt(C.sacR, .7); G.globalAlpha = .75; G.lineWidth = 2.2; G.beginPath(); G.ellipse(0, -134, 15, 5, 0, Math.PI * 1.08, Math.PI * 1.45); G.stroke(); G.beginPath(); G.ellipse(0, -134, 15, 5, 0, Math.PI * 1.55, Math.PI * 1.8); G.stroke(); G.restore();
    line([[-6, -140], [-8, -124]], dk(C.sacR, .35), .7); line([[5, -140], [6, -124]], dk(C.sacR, .35), .7);
    if (C.sac === 'daginik' || C.sac === 'kisa') hairFill(C, g => lock(g, 1, -146, 7, -157, 3.4, 5), [-158, -144], .2);
  }
  function hairBackLayer(C, f, sw) { for (const b of BACKL[C.sac]) hairFill(C, g => lock(g, ...b), [-130, -66], .5); hairExtras(C, f, sw, 'back'); }

  // ---------- YÜZ ----------
  const FACE = g => { g.moveTo(-16, -124); g.bezierCurveTo(-17, -146, 17, -146, 16, -124); g.bezierCurveTo(15.5, -112, 8, -105, 0, -102.5); g.bezierCurveTo(-8, -105, -15.5, -112, -16, -124); g.closePath(); };
  function eye(C, x, y, s, side) {
    const t = C.gozT, w = side ? 4.6 : 5.6, h = 7.4, blink = (T % 4.1) < .1;
    if (t === 'mutlu' || blink) { line([[x - w, y + 1], [x, y - 3], [x + w, y + 1]], '#2a1828', 2); return; }
    G.fillStyle = '#fff'; G.beginPath(); G.ellipse(x, y, w, h, 0, 0, 7); G.fill();
    const tilt = t === 'keskin' ? 2.2 : t === 'yumusak' ? -1.6 : 0;
    const ir = G.createLinearGradient(0, y - h, 0, y + h); ir.addColorStop(0, dk(C.goz, .55)); ir.addColorStop(.55, C.goz); ir.addColorStop(1, lt(C.goz, .55));
    G.save(); G.beginPath(); G.ellipse(x, y, w, h, 0, 0, 7); G.clip();
    G.fillStyle = ir; G.beginPath(); G.ellipse(x + (side ? 1 : s * .4), y + .6, w * .82, h * .92, 0, 0, 7); G.fill();
    G.fillStyle = dk(C.goz, .75); if (t === 'kedi') { G.beginPath(); G.ellipse(x + s * .4, y + .4, 1, h * .7, 0, 0, 7); G.fill(); } else { G.beginPath(); G.ellipse(x + s * .4, y, w * .38, h * .45, 0, 0, 7); G.fill(); }
    G.fillStyle = 'rgba(30,10,40,.35)'; G.fillRect(x - w, y - h, w * 2, h * .45);
    // üst kapak (keskin / yumuşak)
    if (tilt) { G.fillStyle = C.ten; G.beginPath(); G.moveTo(x - w - 1, y - h - 1); G.lineTo(x + w + 1, y - h - 1); G.lineTo(x + w + 1, y - h + 2 + (s * tilt > 0 ? tilt * 1.4 : 0)); G.lineTo(x - w - 1, y - h + 2 + (s * tilt < 0 ? -tilt * 1.4 : 0)); G.fill(); }
    G.restore();
    if (t === 'yildiz') { G.fillStyle = '#fff'; G.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 1.1 : 2.8; G.lineTo(x - 1 + Math.cos(a) * r, y - 2 + Math.sin(a) * r); } G.fill(); }
    else { G.fillStyle = '#fff'; G.beginPath(); G.ellipse(x - s * 1.5 - .4, y - 2.8, 1.8, 2.3, 0, 0, 7); G.fill(); G.globalAlpha = .9; G.beginPath(); G.arc(x + s * 1.6, y + 3, .9, 0, 7); G.fill(); G.globalAlpha = 1; }
    // kirpik
    G.strokeStyle = '#2a1828'; G.lineCap = 'round'; G.lineWidth = 2.3; G.beginPath();
    const ly = y - h + .8 + (t === 'keskin' ? 1 : 0); G.moveTo(x - w - .6, ly + (t === 'keskin' ? s * 1.6 : 1.4)); G.quadraticCurveTo(x, ly - 2.4 + (t === 'yumusak' ? 1 : 0), x + w + .6, ly + (t === 'keskin' ? -s * 1.6 : 1.4)); G.stroke();
    G.lineWidth = 1.4; G.beginPath(); G.moveTo(x + s * (w + .3), ly + 1); G.lineTo(x + s * (w + 2.6), ly - 1); G.stroke();
    G.strokeStyle = 'rgba(42,24,40,.5)'; G.lineWidth = .8; G.beginPath(); G.moveTo(x - w + 1, y + h - .4); G.quadraticCurveTo(x, y + h + .8, x + w - 1, y + h - .4); G.stroke();
  }
  function mouth(C, x, y) {
    const m = C.agiz; G.strokeStyle = '#7a2a3a'; G.lineWidth = 1.2; G.lineCap = 'round';
    if (m === 'acik') { G.fillStyle = '#9a2a3a'; G.beginPath(); G.moveTo(x - 3.2, y - .6); G.quadraticCurveTo(x, y + 5, x + 3.2, y - .6); G.closePath(); G.fill(); G.fillStyle = '#ff8a9a'; G.beginPath(); G.ellipse(x, y + 2.2, 1.6, 1, 0, 0, 7); G.fill(); }
    else if (m === 'sirit') { G.beginPath(); G.moveTo(x - 3.5, y); G.quadraticCurveTo(x, y + 2.4, x + 3.5, y - .6); G.stroke(); G.fillStyle = '#fff'; G.beginPath(); G.moveTo(x + 1, y + 1); G.lineTo(x + 2.4, y + .6); G.lineTo(x + 1.8, y + 2.6); G.fill(); }
    else if (m === 'duz') { G.beginPath(); G.moveTo(x - 2.2, y + .5); G.lineTo(x + 2.2, y + .2); G.stroke(); }
    else if (m === 'kedi') { G.beginPath(); G.arc(x - 1.6, y, 1.6, .2, Math.PI - .2); G.arc(x + 1.6, y, 1.6, .2, Math.PI - .2); G.stroke(); }
    else { G.beginPath(); G.moveTo(x - 2.6, y); G.quadraticCurveTo(x, y + 2.2, x + 2.6, y); G.stroke(); }
  }
  function faceFront(C) {
    cel(C.ten, FACE, { sx: 3, sy: 0, sh: .35, lc: wm(dk(C.ten, .45), .3) });
    G.fillStyle = 'rgba(120,60,80,.18)'; G.beginPath(); G.ellipse(0, -128, 15, 6, 0, 0, 7); G.fill();
    for (const s of [-1, 1]) eye(C, s * 7.6, -117, s, false);
    for (const s of [-1, 1]) line([[s * 4, -127.5], [s * 9, -128.6], [s * 12, -127.2]], dk(C.sacR, .45), 1.1);
    G.fillStyle = 'rgba(255,110,140,.35)'; for (const s of [-1, 1]) { G.beginPath(); G.ellipse(s * 10.5, -109.5, 3.4, 1.7, 0, 0, 7); G.fill(); }
    G.fillStyle = 'rgba(160,80,80,.4)'; G.beginPath(); G.arc(.6, -111, .7, 0, 7); G.fill();
    mouth(C, 0, -107);
  }
  // ---------- KIYAFET (ön/arka) ----------
  const TOR = [[-15, -101], [15, -101], [17, -88], [13, -72], [15, -58], [-15, -58], [-13, -72], [-17, -88]];
  function gem(C, x, y) { if (C.element === 'yok') return; const c = ELC[C.element]; cel('#e8c06a', g => { g.moveTo(x, y - 5.5); g.lineTo(x + 4.5, y); g.lineTo(x, y + 5.5); g.lineTo(x - 4.5, y); g.closePath(); }, { sh: 0, lw: .8 }); glow(c, 10, () => { G.fillStyle = c; G.beginPath(); G.moveTo(x, y - 3.6); G.lineTo(x + 2.8, y); G.lineTo(x, y + 3.6); G.lineTo(x - 2.8, y); G.fill(); }); G.fillStyle = '#fff'; G.fillRect(x - 1, y - 2, 1, 1.6); }
  function torso(C, back) {
    const R = C.ustR, Tm = C.trim, u = C.ust;
    if (u === 'elbise') { cel(R, g => { g.moveTo(-14, -101); g.lineTo(14, -101); g.lineTo(13, -74); g.quadraticCurveTo(24, -54, 27, -38); g.quadraticCurveTo(0, -32, -27, -38); g.quadraticCurveTo(-24, -54, -13, -74); g.closePath(); });
      cel(Tm, g => { g.moveTo(-27, -38); for (let x = -27; x <= 27; x += 6) g.quadraticCurveTo(x + 3, -32, x + 6, -38); g.lineTo(27, -41); g.quadraticCurveTo(0, -35, -27, -41); g.closePath(); }, { sh: 0, lw: .8 });
      cel(Tm, g => rr(g, -13, -77, 26, 5, 2), { sh: 0, lw: .8 }); if (!back) { cel('#fff', g => { g.moveTo(-9, -101); g.lineTo(0, -92); g.lineTo(9, -101); g.closePath(); }, { sh: 0, lw: .8 }); cel(Tm, g => { g.moveTo(0, -94); g.lineTo(-6, -98); g.lineTo(-6, -90); g.closePath(); g.moveTo(0, -94); g.lineTo(6, -98); g.lineTo(6, -90); g.closePath(); }, { sh: 0, lw: .8 }); gem(C, 9, -74); } return; }
    if (u === 'haori') { cel(R, g => poly(g, [[-16, -101], [16, -101], [18, -60], [-18, -60]]));
      if (!back) { cel(lt(R, .55), g => { g.moveTo(-6, -101); g.lineTo(8, -78); g.lineTo(2, -78); g.lineTo(-11, -101); g.closePath(); }, { sh: 0, lw: .8 }); line([[6, -101], [-4, -84]], dk(R, .5), 1); }
      cel(Tm, g => rr(g, -17, -80, 34, 9, 2), { sh: .4 }); line([[-17, -75.5], [17, -75.5]], dk(Tm, .4), .8); if (!back) gem(C, -9, -75.5);
      G.fillStyle = lt(R, .25); for (const [x, y] of [[-10, -92], [10, -66], [-6, -66], [12, -92]]) { G.beginPath(); G.arc(x, y, 1.6, 0, 7); G.fill(); } return; }
    if (u === 'okul') { cel(lt(R, .85), g => poly(g, TOR)); cel(R, g => back ? poly(g, [[-15, -101], [15, -101], [16, -84], [-16, -84]]) : poly(g, [[-15, -101], [-6, -101], [0, -88], [6, -101], [15, -101], [17, -95], [4, -82], [-4, -82], [-17, -95]]), { sh: .3 }); line(back ? [[-15, -86], [15, -86]] : [[-15, -97], [-3, -84]], lt(R, .8), 1); if (!back) { cel(Tm, g => { g.moveTo(0, -84); g.lineTo(-7, -88); g.lineTo(-5, -76); g.closePath(); g.moveTo(0, -84); g.lineTo(7, -88); g.lineTo(5, -76); g.closePath(); }, { sh: 0, lw: .8 }); gem(C, 10, -64); } cel(R, g => rr(g, -15, -63, 30, 5, 2), { sh: 0, lw: .8 }); return; }
    if (u === 'hoodie') { cel(R, g => poly(g, [[-16, -101], [16, -101], [18, -86], [16, -58], [-16, -58], [-18, -86]])); cel(Tm, g => rr(g, -16, -62, 32, 4, 2), { sh: 0, lw: .8 }); if (!back) { cel(dk(R, .1), g => rr(g, -9, -76, 18, 10, 3), { sh: 0, lw: .8 }); line([[-3, -100], [-4, -88]], Tm, 1.3); line([[3, -100], [4, -88]], Tm, 1.3); G.fillStyle = Tm; G.beginPath(); G.arc(-4, -87.5, 1.2, 0, 7); G.arc(4, -87.5, 1.2, 0, 7); G.fill(); } else cel(dk(R, .08), g => g.ellipse(0, -98, 13, 6, 0, 0, Math.PI), { sh: 0 }); return; }
    if (u === 'pelerin') { cel(lt(R, .1), g => poly(g, TOR)); cel(lt('#c8ccd8', .1), g => { g.moveTo(-13, -99); g.lineTo(13, -99); g.lineTo(11, -80); g.quadraticCurveTo(0, -74, -11, -80); g.closePath(); }, { lc: dk(Tm, .4) }); line([[-12, -97], [12, -97]], Tm, 1.6); line([[0, -98], [0, -76]], Tm, 1.2); cel(Tm, g => rr(g, -15, -66, 30, 5, 2), { sh: .3 }); if (!back) gem(C, 0, -88);
      for (const s of [-1, 1]) cel(R, g => { g.moveTo(s * 9, -103); g.quadraticCurveTo(s * 22, -106, s * 23, -94); g.lineTo(s * 14, -95); g.closePath(); }, { lc: dk(Tm, .3) }); return; }
    // ceket
    if (!back) cel('#f6f2ea', g => poly(g, [[-8, -101], [8, -101], [9, -60], [-9, -60]]), { sh: .3 });
    for (const s of [-1, 1]) cel(R, g => back ? poly(g, s < 0 ? TOR.slice(0, 1).concat([[0, -101], [0, -58]], TOR.slice(5)) : [[0, -101], [15, -101], [17, -88], [13, -72], [15, -58], [0, -58]]) : poly(g, s < 0 ? [[-15, -101], [-6, -101], [-3, -84], [-5, -58], [-15, -58], [-13, -72], [-17, -88]] : [[15, -101], [6, -101], [3, -84], [5, -58], [15, -58], [13, -72], [17, -88]]));
    if (!back) { for (const s of [-1, 1]) line([[s * 6, -101], [s * 3, -84], [s * 5, -58]], Tm, 1.6); cel(Tm, g => { g.moveTo(-6, -101); g.lineTo(-11, -104); g.lineTo(-13, -98); g.closePath(); g.moveTo(6, -101); g.lineTo(11, -104); g.lineTo(13, -98); g.closePath(); }, { sh: 0, lw: .8 }); }
    cel(dk(R, .3), g => rr(g, -15, -71, 30, 4.5, 2), { sh: 0, lw: .8 }); cel(Tm, g => rr(g, -2.5, -71.5, 5, 5.5, 1), { sh: 0, lw: .7 }); if (!back) gem(C, -10, -69);
    if (back) { line([[-14, -96], [14, -96]], Tm, 1.2); cel(Tm, g => { g.moveTo(0, -92); g.lineTo(5, -86); g.lineTo(0, -80); g.lineTo(-5, -86); g.closePath(); }, { sh: 0, lw: .8 }); }
  }
  function cape(C, f) { if (C.ust !== 'pelerin') return; const w = Math.sin(T * 2.5) * 2; const sideK = (f === 1 || f === -1); cel(dk(C.ustR, .1), g => { g.moveTo(sideK ? -6 : -15, -101); g.lineTo(sideK ? 4 : 15, -101); g.quadraticCurveTo(sideK ? 2 : 22, -60, sideK ? -2 + w : 24 + w, -28); g.lineTo(sideK ? -22 + w : -24 + w, -26); g.quadraticCurveTo(sideK ? -16 : -22, -60, sideK ? -6 : -15, -101); g.closePath(); }); line(sideK ? [[-20 + w, -29], [-2 + w, -31]] : [[-23 + w, -29], [23 + w, -31]], C.trim, 1.6); }
  function arm(C, s, a, back) {
    const u = C.ust, R = u === 'okul' ? lt(C.ustR, .85) : u === 'pelerin' ? lt(C.ustR, .1) : C.ustR, wide = u === 'haori';
    G.save(); G.translate(s * 14, -98); G.rotate(a);
    if (u === 'elbise' || u === 'okul') { cel(C.ten, g => rr(g, -3.4, 4, 6.8, 30, 3.4), { sx: 2, sy: 0, sh: .35, lc: wm(dk(C.ten, .45), .3) }); cel(R, g => rr(g, -5, -2, 10, 11, 4)); if (u === 'okul') line([[-4.5, 8], [4.5, 8]], C.ustR, 1.4); else line([[-4.5, 8.5], [4.5, 8.5]], C.trim, 1.4); }
    else if (wide) { cel(C.ten, g => rr(g, -3.4, 18, 6.8, 16, 3.4), { sh: .3 }); cel(R, g => { g.moveTo(-5, -2); g.lineTo(5, -2); g.lineTo(9, 28); g.lineTo(-7, 30); g.closePath(); }); line([[-7, 29], [9, 27]], C.trim, 1.6); }
    else { cel(R, g => rr(g, -4.8, -2, 9.6, 33, 4.5)); line([[-4.5, 27], [4.5, 27]], C.trim, 1.6); }
    cel(C.ten, g => g.ellipse(0, 35.5, 4, 4.6, 0, 0, 7), { sx: 1.5, sy: 1, sh: .3, lc: wm(dk(C.ten, .45), .3) });
    const m = G.getTransform().transformPoint(new DOMPoint(0, 36)); G.restore(); return m;
  }
  function legs(C, ph, walk, sit) {
    const R = C.altR, a = C.alt, skirt = a === 'etek' || C.ust === 'elbise';
    for (const s of [-1, 1]) {
      const lift = walk ? Math.max(0, Math.sin(ph) * s) * 4 : 0; G.save(); G.translate(0, -lift);
      if (sit) { cel(skirt || a === 'sort' ? C.ten : R, g => rr(g, s < 0 ? -12 : 2, -24, 10, 16, 4)); boot(C, s, true); G.restore(); continue; }
      if (skirt || a === 'sort') cel(C.ten, g => poly(g, [[s * 2.5, -60], [s * 11.5, -60], [s * 10, -12], [s * 4, -12]]), { sx: 2, sy: 0, sh: .3, lc: wm(dk(C.ten, .45), .3) });
      if (a === 'pantolon' && !skirt) cel(R, g => poly(g, [[s * 1, -61], [s * 13, -61], [s * 11, -12], [s * 4, -12]]));
      if (a === 'kargo' && !skirt) { cel(R, g => poly(g, [[s * .5, -61], [s * 14, -61], [s * 13, -12], [s * 2.5, -12]])); cel(dk(R, .1), g => rr(g, s < 0 ? -13 : 6, -42, 7, 9, 1.5), { sh: 0, lw: .8 }); }
      if (a === 'sort' && !skirt) cel(R, g => poly(g, [[s * .5, -61], [s * 14, -61], [s * 13.5, -46], [s * 2, -46]]));
      if (skirt) cel(a === 'etek' && C.ust !== 'elbise' ? '#1e1e2a' : '#f6f2ea', g => poly(g, [[s * 3, -42], [s * 11.2, -42], [s * 10, -12], [s * 4, -12]]), { sh: .3 });
      boot(C, s); G.restore();
    }
    if (a === 'etek' && C.ust !== 'elbise') { cel(R, g => { g.moveTo(-14, -61); g.lineTo(14, -61); g.lineTo(21, -42); g.lineTo(-21, -42); g.closePath(); }); for (let x = -16; x <= 16; x += 5.3) line([[x * .7, -60], [x, -43]], dk(R, .4), .8); line([[-21, -43.5], [21, -43.5]], C.trim, 1.4); }
  }
  function boot(C, s, sit) {
    const x = s < 0 ? -14 : 1.5, y = sit ? -10 : -12, a = C.ayak;
    if (a === 'sneaker') { cel('#f6f4f0', g => rr(g, x - .5, y, 13.5, 11, 5), { sh: .3 }); cel(C.trim, g => rr(g, x + 1, y + 3, 9, 3, 1.5), { sh: 0, lw: 0 }); line([[x, y + 9], [x + 13, y + 9]], dk(C.trim, .4), 1.2); return; }
    const top = a === 'cizme' ? -40 : -22; cel(dk(C.ustR === '#ffffff' ? '#5a4a3a' : C.altR, .25), g => { g.moveTo(x + 1, sit ? y - 6 : top); g.lineTo(x + 12, sit ? y - 6 : top); g.lineTo(x + 12.5, y + 11); g.lineTo(x - .5, y + 11); g.closePath(); });
    line([[x + 1, (sit ? y - 6 : top) + 3], [x + 12, (sit ? y - 6 : top) + 3]], C.trim, 1.6); line([[x - .5, y + 10.5], [x + 12.5, y + 10.5]], dk(C.trim, .3), 1.4);
  }
  // ---------- AKSESUAR / ELEMENT ----------
  function aksHead(C, f) {
    const a = C.aks, sideK = f === 1 || f === -1;
    if (a === 'kedi' || a === 'boynuz') for (const s of sideK ? [-1] : [-1, 1]) { const x = sideK ? -4 : s * 11; if (a === 'kedi') { cel(C.sacR, g => { g.moveTo(x - 6, -140); g.lineTo(x + s * 2, -158); g.lineTo(x + 7, -142); g.closePath(); }, { grad: [-158, -140], tip: C.sacU }); G.fillStyle = '#ffb0c8'; G.beginPath(); G.moveTo(x - 2.5, -143); G.lineTo(x + s * 1.6, -153); G.lineTo(x + 3.5, -144); G.fill(); } else cel('#3a2a3a', g => { g.moveTo(x - 3, -142); g.quadraticCurveTo(x + s * 8, -150, x + s * 6, -162); g.quadraticCurveTo(x + s * 14, -148, x + 4, -140); g.closePath(); }, { lc: '#1a1018' }); }
    if (a === 'hale') glow('#ffe48a', 12, () => { G.strokeStyle = '#ffe48a'; G.lineWidth = 2.4; G.beginPath(); G.ellipse(0, -160 + Math.sin(T * 2) * 1.5, 13, 3.6, 0, 0, 7); G.stroke(); });
    if (a === 'tac') cel('#ffd23f', g => { const x = sideK ? -2 : 6; g.moveTo(x - 7, -142); g.lineTo(x - 8, -152); g.lineTo(x - 3.5, -147); g.lineTo(x, -154); g.lineTo(x + 3.5, -147); g.lineTo(x + 8, -152); g.lineTo(x + 7, -142); g.closePath(); }, { lc: '#a8701a', sh: .3 });
    if (a === 'toka' && f !== 2) { const x = sideK ? 4 : -12; cel('#ffe14a', g => { for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 2 : 4.6; g.lineTo(x + Math.cos(an) * r, -132 + Math.sin(an) * r); } g.closePath(); }, { lc: '#c88a1a', sh: 0, lw: .9 }); }
    if (a === 'kulaklik') { if (sideK) { cel('#2a2a3a', g => rr(g, -6, -126, 9, 13, 4)); cel(C.trim, g => g.arc(-1.5, -119.5, 2.5, 0, 7), { sh: 0, lw: 0 }); line([[-2, -126], [-4, -146], [6, -150]], '#2a2a3a', 2.4); } else { line([[-19, -122], [-18, -142], [0, -151], [18, -142], [19, -122]], '#2a2a3a', 2.6); for (const s of [-1, 1]) { cel('#2a2a3a', g => rr(g, s * 19 - 4.5, -127, 9, 14, 4)); cel(C.trim, g => rr(g, s * 19 - (s < 0 ? 4.5 : 1.5), -124, 6, 8, 2), { sh: 0, lw: 0 }); } } }
    if (a === 'gozluk' && f !== 2) { G.strokeStyle = '#3a2a3a'; G.lineWidth = 1.2; if (sideK) { G.beginPath(); G.ellipse(9, -117, 5, 4.4, 0, 0, 7); G.stroke(); line([[4, -118], [-6, -121]], '#3a2a3a', 1); } else { for (const s of [-1, 1]) { G.beginPath(); G.ellipse(s * 7.6, -117, 6.4, 5.2, 0, 0, 7); G.stroke(); } line([[-1.4, -118], [1.4, -118]], '#3a2a3a', 1); } }
    if (a === 'yara' && f !== 2) { G.save(); G.translate(sideK ? 6 : 10, -110); G.rotate(-.4); cel('#f6dcbc', g => rr(g, -4.5, -2, 9, 4, 2), { sh: 0, lw: .8, lc: '#c8a080' }); G.restore(); }
  }
  function atki(C, f, front) { if (C.aks !== 'atki') return; const c = C.trim, w = Math.sin(T * 3) * 2; if (front) { cel(c, g => rr(g, -12, -105, 24, 8, 4)); if (f !== 2) cel(c, g => poly(g, [[3, -100], [10, -100], [12 + w * .3, -80], [5 + w * .3, -82]])); } else cel(c, g => poly(g, [[-4, -101], [4, -101], [-14 + w, -76], [-22 + w, -80]])); }
  function element(C, t, front) {
    if (C.element === 'yok') return; const c = ELC[C.element], e = C.element;
    if (!front) { const gr = G.createRadialGradient(0, -6, 2, 0, -6, 34); gr.addColorStop(0, c + '66'); gr.addColorStop(1, c + '00'); G.fillStyle = gr; G.beginPath(); G.ellipse(0, -4, 34, 10, 0, 0, 7); G.fill(); glow(c, 10, () => { G.strokeStyle = c; G.globalAlpha = .7; G.lineWidth = 1.4; G.beginPath(); G.ellipse(0, -2, 26, 6.5, 0, 0, 7); G.stroke(); }); return; }
    for (let i = 0; i < 9; i++) { const k = (t * .35 + i / 9) % 1, x = Math.sin(i * 2.7 + t * (e === 'ruzgar' ? 2 : .3)) * (24 + (i % 3) * 6), y = -8 - k * 150; G.save(); G.globalAlpha = Math.sin(k * Math.PI) * .9; G.translate(x, y);
      if (e === 'ates') glow(c, 10, () => { G.fillStyle = i % 2 ? '#ffd23f' : c; G.beginPath(); G.moveTo(0, -5); G.quadraticCurveTo(3, 0, 0, 3); G.quadraticCurveTo(-3, 0, 0, -5); G.fill(); });
      else if (e === 'su') { G.strokeStyle = c; G.lineWidth = 1.2; G.fillStyle = c + '44'; G.beginPath(); G.arc(0, 0, 2 + i % 3, 0, 7); G.fill(); G.stroke(); }
      else if (e === 'elektro') glow(c, 10, () => { G.strokeStyle = '#f0e0ff'; G.lineWidth = 1.2; G.beginPath(); G.moveTo(-3, -5); G.lineTo(1, -1); G.lineTo(-1, 1); G.lineTo(3, 5); G.stroke(); });
      else if (e === 'ruzgar') { G.strokeStyle = c; G.lineWidth = 1.4; G.beginPath(); G.arc(0, 0, 4, 0, Math.PI * 1.4); G.stroke(); }
      else if (e === 'buz') glow(c, 8, () => { G.strokeStyle = '#eafaff'; G.lineWidth = 1; G.beginPath(); for (let j = 0; j < 3; j++) { G.moveTo(Math.cos(j * 1.05) * 3.5, Math.sin(j * 1.05) * 3.5); G.lineTo(-Math.cos(j * 1.05) * 3.5, -Math.sin(j * 1.05) * 3.5); } G.stroke(); });
      else { G.rotate(t + i); G.fillStyle = c; G.beginPath(); G.ellipse(0, 0, 3.6, 1.6, 0, 0, 7); G.fill(); }
      G.restore(); }
  }

  // ---------- YAN GÖRÜNÜM (sağa bakan) ----------
  const FACES = g => { g.moveTo(-15, -124); g.bezierCurveTo(-16, -146, 15, -146, 15.5, -126); g.lineTo(16.5, -116); g.quadraticCurveTo(16, -111, 14.5, -110); g.bezierCurveTo(13, -104, 6, -102.5, 1, -103); g.bezierCurveTo(-8, -105, -14.5, -112, -15, -124); g.closePath(); };
  function headSide(C, sw) {
    // arka saç
    const L = { uzun: -70, bob: -102, kisa: -106, daginik: -100, kuyruk: -108, ikiz: -110, topuz: -110, orgu: -106 }[C.sac];
    hairFill(C, g => { g.moveTo(-2, -146); g.quadraticCurveTo(-21, -144, -20, -122); g.lineTo(C.sac === 'uzun' ? -22 : -17, L); g.lineTo(-8, L + 4); g.lineTo(-4, -118); g.closePath(); }, [-146, L]);
    if (C.sac === 'uzun') hairFill(C, g => lock(g, -12, -110, -16, -64, 12, -3), [-110, -64]);
    if (C.sac === 'daginik') hairFill(C, g => { lock(g, -16, -120, -26, -104, 8, -2); lock(g, -14, -112, -22, -96, 8, -2); }, [-120, -96]);
    if (C.sac === 'kuyruk') { G.save(); G.translate(-10, -146); G.rotate(.55 + sw); hairFill(C, g => lock(g, 0, 0, 4, 60, 18, 8), [0, 60]); G.restore(); cel(C.trim, g => g.ellipse(-10, -145, 3, 5, 0, 0, 7), { sh: 0 }); }
    if (C.sac === 'ikiz') { G.save(); G.translate(-12, -140); G.rotate(.4 + sw); hairFill(C, g => lock(g, 0, 0, -2, 58, 16, 6), [0, 58]); G.restore(); }
    if (C.sac === 'topuz') hairFill(C, g => g.arc(-8, -150, 10, 0, 7));
    cel(C.ten, FACES, { sx: -3, sy: 0, sh: .35, lc: wm(dk(C.ten, .45), .3) });
    cel(C.ten, g => g.ellipse(-3, -117, 3, 4.2, 0, 0, 7), { sh: .4, lc: wm(dk(C.ten, .45), .3) });
    eye(C, 9.5, -117, 1, true); line([[6, -127.5], [12, -128.4], [14, -127]], dk(C.sacR, .45), 1.1);
    G.fillStyle = 'rgba(255,110,140,.35)'; G.beginPath(); G.ellipse(10, -109.5, 3, 1.6, 0, 0, 7); G.fill(); mouth(C, 11, -107);
    // ön saç (yan)
    hairFill(C, g => { g.moveTo(-17, -124); g.bezierCurveTo(-20, -150, 18, -152, 17, -126); g.quadraticCurveTo(4, -134, -6, -124); g.closePath(); });
    for (const b of BANGS[C.sac]) if (b[0] > -8) hairFill(C, g => lock(g, b[0] * .7 + 3, b[1], b[2] * .7 + 4, b[3], b[4] * .85, b[5]), [-142, -108], .35);
    hairFill(C, g => lock(g, -6, -128, -8, -106, 8, -1), [-128, -104], .35);
    G.save(); G.beginPath(); G.ellipse(0, -134, 15, 5, 0, Math.PI * 1.1, Math.PI * 1.6); G.strokeStyle = lt(C.sacR, .7); G.globalAlpha = .75; G.lineWidth = 2.2; G.stroke(); G.restore();
    if (C.sac === 'kisa' || C.sac === 'daginik') hairFill(C, g => lock(g, 0, -146, 6, -157, 3.4, 5), [-158, -144], .2);
  }
  function bodySide(C, ph, walk, sit, aF, aB) {
    const sw = walk ? Math.sin(ph) : 0, R = C.altR, skirt = C.alt === 'etek' || C.ust === 'elbise';
    const leg = (s, back) => { G.save(); G.translate(0, -60); G.rotate(sit ? -1.45 : sw * .45 * s); const sk = skirt || C.alt === 'sort';
      if (sk) cel(back ? dk(C.ten, .2) : C.ten, g => rr(g, -4, 0, 8, 48, 4), { sh: .25, lc: wm(dk(C.ten, .45), .3) }); else cel(back ? dk(R, .2) : R, g => rr(g, -5.5, -1, 11, 50, 4));
      if (C.alt === 'sort' && !skirt) cel(back ? dk(R, .2) : R, g => rr(g, -6, -1, 12, 16, 4));
      G.translate(0, 48); if (C.ayak === 'sneaker') cel('#f6f4f0', g => rr(g, -5, -2, 14, 10, 4), { sh: .3 }); else { const top = C.ayak === 'cizme' ? -28 : -10; cel(dk(C.altR, .25), g => { g.moveTo(-5, top); g.lineTo(5, top); g.lineTo(5, -2); g.lineTo(10, 1); g.lineTo(10, 8); g.lineTo(-5, 8); g.closePath(); }); line([[-5, top + 3], [5, top + 3]], C.trim, 1.4); }
      G.restore(); };
    leg(-1, true); leg(1, false);
    if (C.alt === 'etek' && C.ust !== 'elbise') { cel(R, g => poly(g, [[-9, -61], [9, -61], [14, -42], [-14, -42]])); line([[-14, -43.5], [14, -43.5]], C.trim, 1.4); }
  }
  function torsoSide(C) {
    const R = C.ust === 'okul' ? lt(C.ustR, .85) : C.ustR;
    if (C.ust === 'elbise') { cel(C.ustR, g => { g.moveTo(-8, -101); g.lineTo(8, -101); g.lineTo(9, -74); g.quadraticCurveTo(16, -54, 18, -38); g.lineTo(-18, -38); g.quadraticCurveTo(-16, -54, -9, -74); g.closePath(); }); line([[-18, -39.5], [18, -39.5]], C.trim, 2); return; }
    cel(R, g => poly(g, [[-9, -101], [9, -101], [11, -86], [9, -72], [10, -58], [-10, -58], [-9, -72], [-10, -86]]));
    if (C.ust === 'haori') { cel(C.trim, g => rr(g, -10, -80, 20, 9, 2), { sh: .3 }); line([[8, -101], [2, -84]], lt(C.ustR, .55), 2); }
    else if (C.ust === 'okul') cel(C.ustR, g => poly(g, [[-9, -101], [6, -101], [9, -92], [-10, -86]]), { sh: .3 });
    else if (C.ust === 'ceket') { line([[9, -100], [7, -84], [9, -58]], C.trim, 1.5); cel(dk(C.ustR, .3), g => rr(g, -10, -71, 20, 4.5, 2), { sh: 0 }); gem(C, 4, -69); }
    else if (C.ust === 'pelerin') { cel(lt('#c8ccd8', .1), g => { g.moveTo(-6, -99); g.lineTo(10, -99); g.lineTo(9, -80); g.lineTo(-4, -78); g.closePath(); }); gem(C, 6, -88); }
    else cel(C.trim, g => rr(g, -10, -62, 20, 4, 2), { sh: 0 });
  }
  function armSide(C, a, back) {
    const R = C.ust === 'okul' ? lt(C.ustR, .85) : C.ustR; G.save(); G.translate(0, -97); G.rotate(a);
    const bare = C.ust === 'elbise' || C.ust === 'okul';
    if (bare) { cel(back ? dk(C.ten, .2) : C.ten, g => rr(g, -3.4, 4, 6.8, 30, 3.4), { sh: .25, lc: wm(dk(C.ten, .45), .3) }); cel(back ? dk(R, .2) : R, g => rr(g, -5, -2, 10, 11, 4)); }
    else if (C.ust === 'haori') cel(back ? dk(R, .2) : R, g => { g.moveTo(-5, -2); g.lineTo(5, -2); g.lineTo(8, 28); g.lineTo(-8, 30); g.closePath(); });
    else { cel(back ? dk(R, .2) : R, g => rr(g, -4.8, -2, 9.6, 33, 4.5)); line([[-4.5, 27], [4.5, 27]], C.trim, 1.6); }
    cel(back ? dk(C.ten, .2) : C.ten, g => g.ellipse(0, 35.5, 4, 4.6, 0, 0, 7), { sh: .3, lc: wm(dk(C.ten, .45), .3) });
    const m = G.getTransform().transformPoint(new DOMPoint(0, 36)); G.restore(); return m;
  }
  // ---------- ARKA KAFA ----------
  function headBack(C, sw) {
    cel(C.ten, FACE, { sh: 0, lc: wm(dk(C.ten, .45), .3) });
    hairExtras(C, 2, sw, 'back');
    const L = { uzun: -70, bob: -102, kisa: -108, daginik: -102, kuyruk: -112, ikiz: -112, topuz: -112, orgu: -106 }[C.sac];
    hairFill(C, g => { g.moveTo(-19, -124); g.bezierCurveTo(-22, -152, 22, -152, 19, -124); g.lineTo(C.sac === 'uzun' ? 22 : 18, L); g.lineTo(0, L + 6); g.lineTo(C.sac === 'uzun' ? -22 : -18, L); g.closePath(); }, [-150, L]);
    for (let i = -2; i <= 2; i++) hairFill(C, g => lock(g, i * 7, L + 8 - 14, i * 8.5, L + 6, 9, 0), [L - 8, L + 6], .3);
    line([[-6, -146], [-8, L + 2]], dk(C.sacR, .3), .8); line([[6, -146], [8, L + 2]], dk(C.sacR, .3), .8);
    if (C.sac === 'kuyruk' || C.sac === 'topuz') hairExtras(C, 2, sw, 'back');
    if (C.sac === 'orgu') { for (let i = 0; i < 6; i++) hairFill(C, g => g.ellipse(14 + i * .6, -110 + i * 7.5, 5 - i * .3, 5, (i % 2 ? .4 : -.4), 0, 7), [-112 + i * 7.5, -104 + i * 7.5], .4); }
  }

  // ---------- ANA ÇİZİM ----------
  function draw(g, cfg, x, y, sc = 1, o = {}) {
    const C = Object.assign({}, DEF, cfg); G = g; const t = T = o.t != null ? o.t : performance.now() / 1000;
    const dir = o.dir || 's', anim = o.anim || 'idle', f = { s: 0, n: 2, e: 1, w: -1 }[dir], walk = anim === 'walk', sit = anim === 'sit', ph = t * 9;
    const bob = walk ? Math.abs(Math.sin(ph)) * 2.2 : anim === 'cheer' ? Math.abs(Math.sin(t * 7)) * 7 : Math.sin(t * 2.2) * .9, sw = walk ? Math.sin(ph) : 0;
    let hand = null;
    g.save(); g.translate(x, y); g.scale(sc, sc);
    g.fillStyle = 'rgba(40,20,60,.25)'; g.beginPath(); g.ellipse(0, 0, 22, 5.5, 0, 0, 7); g.fill();
    element(C, t, false);
    g.translate(0, -bob + (sit ? 14 : 0));
    if (f === 1 || f === -1) {
      g.save(); g.scale(f, 1);
      let aF = walk ? -sw * .5 : -.05, aB = walk ? sw * .5 : .05;
      if (anim === 'fish') aF = -1.35; if (anim === 'wave') aF = -2.7 + Math.sin(t * 9) * .3; if (anim === 'cheer') aF = aB = -2.9; if (sit) aF = aB = -.6;
      cape(C, 1); atki(C, 1, false); armSide(C, aB, true); bodySide(C, ph, walk, sit); torsoSide(C);
      cel(C.ten, gg => rr(gg, -4, -108, 8, 9, 3), { sh: .3, lc: wm(dk(C.ten, .45), .3) }); if (C.aks === 'atki') cel(C.trim, gg => rr(gg, -9, -105, 18, 8, 4));
      headSide(C, sw * .2); aksHead(C, 1); hand = armSide(C, aF, false); hairExtras(C, 1, 0, 'front');
      g.restore();
    } else {
      const back = f === 2; let aR = -.14, aL = .14;
      if (walk) { aR = -.14 + sw * .16; aL = .14 + sw * .16; }
      if (anim === 'wave') aR = -2.6 + Math.sin(t * 9) * .35; if (anim === 'cheer') { aR = -2.7; aL = 2.7; } if (anim === 'fish') aR = -1.25; if (sit) { aR = -.3; aL = .3; }
      if (back) [aR, aL] = [-aL, -aR];
      if (!back) { cape(C, 0); hairBackLayer(C, f, sw * .2); if (C.aks === 'kulaklik' || C.aks === 'boynuz' || C.aks === 'kedi') { } }
      legs(C, ph, walk, sit);
      const hR = arm(C, 1, aR, back), hL = arm(C, -1, aL, back); hand = back ? hL : hR;
      cel(C.ten, gg => rr(gg, -4.2, -108, 8.4, 10, 3), { sx: 2, sy: 0, sh: .4, lc: wm(dk(C.ten, .45), .3) });
      torso(C, back);
      if (back) { atki(C, 2, true); cape(C, 2); headBack(C, sw * .3); aksHead(C, 2); }
      else { atki(C, 0, true); faceFront(C); hairFront(C); hairExtras(C, 0, 0, 'front'); aksHead(C, 0); }
    }
    element(C, t, true);
    g.restore();
    return hand ? { hx: hand.x, hy: hand.y } : null;
  }
  window.Anime = { draw, HAIR, EYE, MOUTH, UST, ALT, AYAK, AKS, ELEMENT, ELC, COLORS, DEF };
})();
