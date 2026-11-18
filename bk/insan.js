// Ördekez insan karakter konseptleri: neon, lowpoly, golge, eski (rubber hose), sokak
(function () {
  const hx = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (c, d, k) => { const a = hx(c), b = hx(d); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const dk = (c, k) => mix(c, '#100818', k), lt = (c, k) => mix(c, '#ffffff', k);
  const rr = (g, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  const poly = (g, pts) => { pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); };
  const mir = pts => pts.map(([x, y]) => [-x, y]);

  // ============ 1) NEON SİBER ============
  function neon(g, C, t) {
    const N = C.neon, bob = Math.sin(t * 2.2) * 1.2, D = '#14122a', D2 = '#1e1b3a';
    const glow = (fn, c = N, b = 14) => { g.save(); g.shadowColor = c; g.shadowBlur = b; fn(); g.restore(); };
    g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.ellipse(0, 0, 26, 6, 0, 0, 7); g.fill();
    glow(() => { g.strokeStyle = N; g.globalAlpha = .5; g.lineWidth = 2; g.beginPath(); g.ellipse(0, 0, 24, 5, 0, 0, 7); g.stroke(); });
    g.translate(0, bob);
    // bacaklar
    for (const s of [-1, 1]) { g.fillStyle = D; g.beginPath(); poly(g, [[s * 2, -60], [s * 13, -60], [s * 12, -9], [s * 3, -9]]); g.fill(); g.fillStyle = '#0c0b18'; g.beginPath(); rr(g, s < 0 ? -16 : 1, -12, 15, 12, 5); g.fill(); glow(() => { g.fillStyle = N; g.fillRect(s < 0 ? -15 : 2, -3, 13, 2.2); }); glow(() => { g.strokeStyle = C.neon2; g.lineWidth = 1.5; g.beginPath(); g.moveTo(s * 10, -56); g.lineTo(s * 9.5, -16); g.stroke(); }, C.neon2, 8); }
    // kapüşon arkası
    g.fillStyle = D2; g.beginPath(); g.ellipse(0, -112, 24, 22, 0, 0, 7); g.fill();
    // gövde (ceket)
    const torso = [[-22, -100], [22, -100], [25, -78], [19, -56], [-19, -56], [-25, -78]];
    const gr = g.createLinearGradient(0, -100, 0, -56); gr.addColorStop(0, '#2a2650'); gr.addColorStop(1, D); g.fillStyle = gr; g.beginPath(); poly(g, torso); g.fill();
    glow(() => { g.strokeStyle = N; g.globalAlpha = .45; g.lineWidth = 1.2; g.beginPath(); poly(g, torso); g.stroke(); }, N, 6);
    glow(() => { g.strokeStyle = N; g.lineWidth = 2; g.beginPath(); g.moveTo(-3, -98); g.lineTo(-3, -57); g.moveTo(3, -98); g.lineTo(3, -57); g.stroke(); });
    glow(() => { g.strokeStyle = C.neon2; g.lineWidth = 1.8; g.beginPath(); g.moveTo(-23, -82); g.lineTo(-10, -82); g.lineTo(-7, -76); g.stroke(); g.beginPath(); g.moveTo(10, -66); g.lineTo(19, -66); g.stroke(); }, C.neon2, 10);
    // kollar (cepte)
    for (const s of [-1, 1]) { g.fillStyle = D2; g.beginPath(); poly(g, [[s * 20, -100], [s * 29, -94], [s * 28, -66], [s * 19, -62], [s * 18, -88]]); g.fill(); glow(() => { g.strokeStyle = N; g.lineWidth = 1.6; g.beginPath(); g.moveTo(s * 28.5, -92); g.lineTo(s * 28, -68); g.stroke(); }, N, 10); }
    // boyun + kafa
    g.fillStyle = dk(C.ten, .55); g.fillRect(-5, -108, 10, 10);
    const hg = g.createLinearGradient(-16, 0, 16, 0); hg.addColorStop(0, dk(C.ten, .25)); hg.addColorStop(1, dk(C.ten, .6)); g.fillStyle = hg; g.beginPath(); g.moveTo(-15, -126); g.quadraticCurveTo(-15, -140, 0, -140); g.quadraticCurveTo(15, -140, 15, -126); g.quadraticCurveTo(15, -110, 6, -104); g.lineTo(-6, -104); g.quadraticCurveTo(-15, -110, -15, -126); g.fill();
    glow(() => { g.strokeStyle = N; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-15, -128); g.quadraticCurveTo(-15, -110, -6, -104); g.stroke(); }, N, 8);
    // vizör
    glow(() => { const vg = g.createLinearGradient(-17, 0, 17, 0); vg.addColorStop(0, N); vg.addColorStop(1, C.neon2); g.fillStyle = vg; g.beginPath(); poly(g, [[-17, -130], [17, -130], [15, -121], [-15, -121]]); g.fill(); }, N, 18);
    g.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 3; i++) g.fillRect(-15, -129 + i * 3, 30, .8);
    const sc = (t * 30) % 34 - 17; g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(sc, -130, 2, 9);
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-3, -111); g.lineTo(3, -111); g.stroke();
    // saç
    g.fillStyle = C.sac; g.beginPath(); poly(g, C.sacT === 'uzun' ? [[-17, -128], [-18, -142], [-8, -150], [8, -150], [18, -142], [17, -128], [21, -92], [12, -98], [12, -132], [-12, -132], [-12, -98], [-21, -92]] : [[-17, -129], [-20, -146], [-12, -142], [-8, -156], [-1, -146], [6, -158], [10, -146], [20, -152], [17, -132], [10, -138], [4, -132], [-2, -138], [-8, -132]]); g.fill();
    glow(() => { g.strokeStyle = N; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-8, -153); g.lineTo(-1, -146); g.moveTo(6, -156); g.lineTo(10, -146); g.stroke(); }, N, 8);
    // hologram partiküller
    for (let i = 0; i < 6; i++) { const k = (t * .4 + i / 6) % 1; g.globalAlpha = Math.sin(k * Math.PI) * .9; glow(() => { g.fillStyle = i % 2 ? N : C.neon2; g.fillRect(Math.sin(i * 2.3) * 34, -20 - k * 140, 2.5, 2.5); }, N, 6); }
    g.globalAlpha = 1;
  }

  // ============ 2) LOW-POLY ============
  function facet(g, pts, c) {
    const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], mx = (a[0] + b[0]) / 2 - cx, my = (a[1] + b[1]) / 2 - cy, l = Math.hypot(mx, my) || 1, d = (mx * -.55 + my * -.83) / l;
      const col = d > 0 ? lt(c, d * .32) : dk(c, -d * .3); g.fillStyle = col; g.strokeStyle = col; g.lineWidth = .8;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.closePath(); g.fill(); g.stroke();
    }
  }
  function lowpoly(g, C, t) {
    const bob = Math.sin(t * 2.4) * 1.2, sw = Math.sin(t * 2.4) * .05;
    g.fillStyle = 'rgba(60,40,90,.18)'; g.beginPath(); poly(g, [[-26, 0], [-12, -6], [14, -6], [28, 0], [12, 6], [-14, 6]]); g.fill();
    for (const s of [-1, 1]) { facet(g, s < 0 ? [[-13, -58], [-2, -58], [-3, -30], [-4, -9], [-12, -9], [-13, -32]] : mir([[-13, -58], [-2, -58], [-3, -30], [-4, -9], [-12, -9], [-13, -32]]), C.alt); facet(g, s < 0 ? [[-15, -10], [-2, -10], [0, -1], [-17, -1]] : mir([[-15, -10], [-2, -10], [0, -1], [-17, -1]]), C.ayak); }
    g.translate(0, bob);
    if (C.sacT === 'uzun') facet(g, [[-19, -132], [19, -132], [22, -98], [12, -88], [-12, -88], [-22, -98]], dk(C.sac, .1));
    for (const s of [-1, 1]) { g.save(); g.translate(s * 21, -98); g.rotate(s * (.12 + sw)); facet(g, s < 0 ? [[2, -2], [-7, 2], [-9, 34], [-1, 36], [3, 10]] : mir([[2, -2], [-7, 2], [-9, 34], [-1, 36], [3, 10]]), C.ust); facet(g, [[-9, 34], [-1, 36], [0, 43], [-5, 46], [-10, 42]].map(([x, y]) => [s * x, y]), C.ten); g.restore(); }
    facet(g, [[-21, -100], [21, -100], [23, -80], [17, -56], [-17, -56], [-23, -80]], C.ust);
    if (C.desen) facet(g, [[-8, -92], [8, -92], [6, -74], [0, -68], [-6, -74]], C.desen);
    facet(g, [[-5, -108], [5, -108], [6, -99], [-6, -99]], C.ten);
    const head = [[0, -144], [12, -139], [16, -125], [14, -111], [6, -102], [-6, -102], [-14, -111], [-16, -125], [-12, -139]];
    facet(g, head, C.ten);
    for (const s of [-1, 1]) { g.fillStyle = '#1a1424'; g.beginPath(); poly(g, [[s * 9, -122], [s * 3.5, -123], [s * 4, -117], [s * 8.5, -116.5]]); g.fill(); g.fillStyle = C.goz; g.beginPath(); poly(g, [[s * 8, -120], [s * 5, -120.5], [s * 5.2, -117.5], [s * 7.8, -117.3]]); g.fill(); g.fillStyle = dk(C.sac, .1); g.beginPath(); poly(g, [[s * 10, -127], [s * 3, -127.5], [s * 3, -126], [s * 10, -125]]); g.fill(); }
    g.fillStyle = '#8a3a44'; g.beginPath(); poly(g, [[-4, -109], [4, -109], [0, -106.5]]); g.fill();
    facet(g, C.sacT === 'uzun' ? [[-18, -122], [-17, -138], [-6, -148], [9, -147], [18, -136], [18, -112], [14, -120], [12, -132], [4, -128], [-4, -134], [-12, -128], [-14, -116]] : [[-17, -124], [-18, -140], [-8, -149], [8, -150], [18, -140], [17, -124], [12, -131], [6, -127], [0, -134], [-6, -128], [-12, -133]], C.sac);
    if (C.sapka) facet(g, [[-19, -136], [-16, -150], [0, -156], [16, -150], [19, -136], [30, -134], [24, -130], [-19, -132]], C.sapka);
  }

  // ============ 3) GÖLGE GEZGİN ============
  function golge(g, C, t) {
    const bob = Math.sin(t * 2) * 1.5, wind = t * 3;
    g.fillStyle = 'rgba(10,10,20,.3)'; g.beginPath(); g.ellipse(0, 0, 22, 5, 0, 0, 7); g.fill();
    // olta sırtta
    g.strokeStyle = '#6a4a2a'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(-14, -40 + bob); g.lineTo(22, -150 + bob); g.stroke(); g.strokeStyle = 'rgba(230,230,240,.6)'; g.lineWidth = .8; g.beginPath(); g.moveTo(22, -150 + bob); g.quadraticCurveTo(34, -120, 30 + Math.sin(t) * 2, -96 + bob); g.stroke(); g.fillStyle = '#ff5a5a'; g.beginPath(); g.arc(30 + Math.sin(t) * 2, -94 + bob, 2.4, 0, 7); g.fill();
    for (const s of [-1, 1]) { g.fillStyle = '#16141f'; g.beginPath(); rr(g, s * 7 - 3.5, -24, 7, 23, 3); g.fill(); }
    g.translate(0, bob);
    // atkı (rüzgarda uçuşan)
    g.fillStyle = C.atki; g.beginPath(); g.moveTo(6, -86); for (let i = 0; i <= 10; i++) { const x = 6 + i * 6.5, y = -88 + Math.sin(wind + i * .7) * (2 + i * .7) + i * 1.5; g.lineTo(-x, y - 4); } for (let i = 10; i >= 0; i--) { const x = 6 + i * 6.5, y = -88 + Math.sin(wind + i * .7) * (2 + i * .7) + i * 1.5; g.lineTo(-x, y + 4 + i * .3); } g.closePath(); g.fill();
    // pelerin
    const cl = g.createLinearGradient(0, -96, 0, -18); cl.addColorStop(0, '#2a2638'); cl.addColorStop(1, '#141220'); g.fillStyle = cl;
    g.beginPath(); g.moveTo(-14, -94); g.quadraticCurveTo(0, -100, 14, -94); g.quadraticCurveTo(26, -50, 28, -20); for (let i = 0; i <= 6; i++) g.lineTo(28 - i * 9.33, -20 + (i % 2 ? 6 : 0) + Math.sin(wind * .7 + i) * 1.5); g.quadraticCurveTo(-26, -50, -14, -94); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-6, -90); g.lineTo(-10, -26); g.moveTo(8, -90); g.lineTo(12, -26); g.stroke();
    g.fillStyle = C.atki; g.beginPath(); rr(g, -15, -97, 30, 10, 5); g.fill();
    // başlık + maske
    g.fillStyle = '#1e1b2c'; g.beginPath(); g.moveTo(-22, -100); g.quadraticCurveTo(-26, -148, 0, -150); g.quadraticCurveTo(26, -148, 22, -100); g.quadraticCurveTo(0, -94, -22, -100); g.fill();
    if (C.kulak) { g.beginPath(); g.moveTo(-14, -142); g.lineTo(-20, -168); g.lineTo(-4, -148); g.moveTo(14, -142); g.lineTo(20, -168); g.lineTo(4, -148); g.fill(); }
    const mg = g.createLinearGradient(0, -140, 0, -104); mg.addColorStop(0, '#ffffff'); mg.addColorStop(1, '#cfcad8'); g.fillStyle = mg; g.beginPath(); g.moveTo(-15, -126); g.quadraticCurveTo(-15, -142, 0, -142); g.quadraticCurveTo(15, -142, 15, -126); g.quadraticCurveTo(14, -108, 0, -104); g.quadraticCurveTo(-14, -108, -15, -126); g.fill();
    g.save(); g.shadowColor = C.goz; g.shadowBlur = 12; for (const s of [-1, 1]) { g.fillStyle = '#0c0a14'; g.beginPath(); g.ellipse(s * 6.5, -124, 4.2, 6, s * .25, 0, 7); g.fill(); g.fillStyle = C.goz; g.beginPath(); g.arc(s * 6.5, -123, 1.9, 0, 7); g.fill(); } g.restore();
    if (C.cizik) { g.strokeStyle = C.cizik; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-12, -136); g.lineTo(-6, -131); g.moveTo(10, -112); g.lineTo(13, -118); g.stroke(); }
    // uçuşan yapraklar
    for (let i = 0; i < 4; i++) { const k = (t * .25 + i / 4) % 1; g.save(); g.globalAlpha = Math.sin(k * Math.PI) * .8; g.translate(40 - k * 90, -150 + k * 120 + Math.sin(t * 2 + i) * 6); g.rotate(t * 2 + i); g.fillStyle = C.atki; g.beginPath(); g.ellipse(0, 0, 3.5, 1.6, 0, 0, 7); g.fill(); g.restore(); }
  }

  // ============ 4) ESKİ ÇİZGİ FİLM (1930) ============
  function eski(g, C, t) {
    const K = '#1a1410', bob = Math.abs(Math.sin(t * 4)) * 4, sw = Math.sin(t * 4);
    g.fillStyle = 'rgba(40,25,10,.25)'; g.beginPath(); g.ellipse(0, 0, 24 - bob, 5, 0, 0, 7); g.fill();
    g.lineCap = 'round'; g.lineJoin = 'round';
    // lastik bacaklar
    g.strokeStyle = K; g.lineWidth = 4.5; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 7, -46 - bob); g.bezierCurveTo(s * (10 + sw * 4 * s), -30, s * (4 - sw * 3 * s), -18, s * 10, -9); g.stroke(); }
    for (const s of [-1, 1]) { g.fillStyle = C.ayak; g.beginPath(); g.ellipse(s * 14, -6, 12, 7, 0, 0, 7); g.fill(); g.strokeStyle = K; g.lineWidth = 2.6; g.stroke(); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(s * 14 - 3, -9, 4, 2, -.3, 0, 7); g.fill(); }
    g.translate(0, -bob);
    // gövde + şort
    g.fillStyle = C.ust; g.beginPath(); g.ellipse(0, -62, 15, 20, 0, 0, 7); g.fill(); g.strokeStyle = K; g.lineWidth = 2.8; g.stroke();
    g.fillStyle = C.alt; g.beginPath(); g.moveTo(-15, -60); g.quadraticCurveTo(0, -52, 15, -60); g.quadraticCurveTo(16, -42, 8, -42); g.lineTo(0, -48); g.lineTo(-8, -42); g.quadraticCurveTo(-16, -42, -15, -60); g.fill(); g.stroke();
    for (const s of [-1, 1]) { g.fillStyle = '#fff'; g.beginPath(); g.arc(s * 6, -55, 2.6, 0, 7); g.fill(); g.lineWidth = 1.6; g.stroke(); }
    // lastik kollar + eldiven
    for (const s of [-1, 1]) { const hx2 = s * (30 + (s > 0 ? sw * 4 : 0)), hy = s > 0 ? -98 + sw * 6 : -54; g.strokeStyle = K; g.lineWidth = 4.5; g.beginPath(); g.moveTo(s * 12, -74); g.bezierCurveTo(s * 24, -80, hx2 - s * 6, hy + 12, hx2, hy); g.stroke();
      g.fillStyle = '#fff'; g.lineWidth = 2.4; g.beginPath(); g.ellipse(hx2, hy, 7, 6.5, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); rr(g, hx2 - 5, hy + (s > 0 ? 5 : 5), 10, 4, 2); g.fill(); g.stroke(); g.lineWidth = 1.2; g.beginPath(); g.moveTo(hx2 - 2, hy - 3); g.lineTo(hx2 - 2, hy + 1); g.moveTo(hx2 + 2, hy - 3); g.lineTo(hx2 + 2, hy + 1); g.stroke(); }
    // kafa
    g.fillStyle = C.ten; g.strokeStyle = K; g.lineWidth = 2.8; g.beginPath(); g.ellipse(0, -110, 26, 25, 0, 0, 7); g.fill(); g.stroke();
    for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * 26, -108, 6, 8, 0, 0, 7); g.fill(); g.stroke(); }
    // turta gözler
    for (const s of [-1, 1]) { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(s * 8, -116, 7, 10, 0, 0, 7); g.fill(); g.lineWidth = 2.2; g.stroke(); g.fillStyle = K; g.beginPath(); g.ellipse(s * 7, -113, 4, 6.5, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(s * 7, -113); g.arc(s * 7, -113, 4.5, -1.9, -1.2); g.closePath(); g.fill(); }
    g.fillStyle = K; g.beginPath(); g.ellipse(0, -103, 5, 3.5, 0, 0, 7); g.fill();
    g.fillStyle = '#5a1a1a'; g.beginPath(); g.moveTo(-15, -98); g.quadraticCurveTo(0, -80, 15, -98); g.quadraticCurveTo(0, -94, -15, -98); g.fill(); g.lineWidth = 2.4; g.stroke(); g.fillStyle = '#ff7a7a'; g.beginPath(); g.ellipse(0, -90, 5, 2.5, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,90,90,.35)'; for (const s of [-1, 1]) { g.beginPath(); g.arc(s * 17, -100, 5, 0, 7); g.fill(); }
    // şapka / perçem
    if (C.sapka === 'melon') { g.fillStyle = C.sapkaR; g.lineWidth = 2.8; g.beginPath(); g.ellipse(0, -131, 24, 5, -.08, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-15, -132); g.quadraticCurveTo(-16, -154, 0, -154); g.quadraticCurveTo(16, -154, 15, -132); g.fill(); g.stroke(); g.fillStyle = '#c8302a'; g.fillRect(-15, -138, 30, 4); }
    else { g.fillStyle = C.sac; g.lineWidth = 2.6; g.beginPath(); g.moveTo(-14, -128); g.quadraticCurveTo(-8, -150, 4, -146); g.quadraticCurveTo(-2, -140, 6, -138); g.quadraticCurveTo(14, -150, 22, -140); g.quadraticCurveTo(10, -132, 14, -126); g.quadraticCurveTo(0, -136, -14, -128); g.fill(); g.stroke(); }
    if (C.papyon) { g.fillStyle = C.papyon; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -84); g.lineTo(-10, -89); g.lineTo(-10, -78); g.closePath(); g.moveTo(0, -84); g.lineTo(10, -89); g.lineTo(10, -78); g.closePath(); g.fill(); g.stroke(); }
  }

  // ============ 5) SOKAK (graffiti) ============
  function sokak(g, C, t) {
    const K = '#111', bob = Math.sin(t * 2.6) * 1.3;
    const F = (c, path, sh = true) => { g.beginPath(); path(g); g.fillStyle = c; g.fill(); if (sh) { g.save(); g.clip(); g.translate(6, 3); g.beginPath(); path(g); g.rect(-300, -300, 600, 600); g.fillStyle = dk(c, .28); g.fill('evenodd'); g.restore(); } g.beginPath(); path(g); g.strokeStyle = K; g.lineWidth = 3; g.lineJoin = 'round'; g.stroke(); };
    g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(4, 0, 30, 6, 0, 0, 7); g.fill();
    g.transform(1, 0, -.06, 1, 0, 0);
    // bol pantolon + ayakkabı
    for (const s of [-1, 1]) { F(C.alt, g2 => poly(g2, [[s * 1, -66], [s * 17, -66], [s * 18 + (s > 0 ? 4 : 0), -12], [s * 4 + (s > 0 ? 4 : 0), -12]])); F(C.ayak, g2 => { const o = s > 0 ? 4 : 0; g2.moveTo(s * 2 + o - 2, -14); g2.lineTo(s * 19 + o, -14); g2.quadraticCurveTo(s * 24 + o + 6, -8, s * 22 + o + 6, 0); g2.lineTo(s * 2 + o - 4, 0); g2.closePath(); }, false); { const o = s > 0 ? 4 : 0, a = s * 2 + o - 3, b = s * 22 + o + 5; g.fillStyle = '#fff'; g.fillRect(Math.min(a, b), -4.5, Math.abs(b - a), 2.5); } }
    g.translate(0, bob);
    F(C.ic, g2 => poly(g2, [[-10, -102], [10, -102], [11, -64], [-11, -64]]), false);
    if (C.yazi) { g.fillStyle = K; g.font = 'bold 7px system-ui'; g.textAlign = 'center'; g.fillText(C.yazi, 0, -78); }
    for (const s of [-1, 1]) F(C.ust, g2 => poly(g2, [[s * 8, -104], [s * 24, -100], [s * 27, -62], [s * 10, -60], [s * 7, -82]]));
    // kollar
    F(C.ust, g2 => poly(g2, [[-22, -101], [-31, -94], [-36, -62], [-27, -60], [-24, -84]])); F(C.ten, g2 => g2.ellipse(-32, -56, 6, 7, 0, 0, 7), false);
    g.save(); g.translate(24, -100); g.rotate(-2.1 + Math.sin(t * 3) * .08); F(C.ust, g2 => poly(g2, [[-4, -3], [6, -3], [6, 30], [-4, 30]])); g.translate(1, 36); F(C.ten, g2 => { g2.ellipse(0, 0, 6, 7, 0, 0, 7); }, false); g.fillStyle = C.ten; g.strokeStyle = K; g.lineWidth = 2.4; for (const dx of [-3, 3]) { g.beginPath(); rr(g, dx - 2, 3, 4, 11, 2); g.fill(); g.stroke(); } g.restore();
    // kulaklık boyunda
    g.strokeStyle = K; g.lineWidth = 3; g.beginPath(); g.arc(0, -104, 14, .2, Math.PI - .2); g.stroke();
    F('#dfe3ea', g2 => g2.rect(-5, -114, 10, 12), false);
    for (const s of [-1, 1]) F(C.kulaklik, g2 => rr(g2, s * 14 - 6, -112, 12, 15, 5));
    // kafa
    F(C.ten, g2 => { g2.moveTo(-16, -132); g2.quadraticCurveTo(-16, -150, 0, -150); g2.quadraticCurveTo(16, -150, 16, -132); g2.lineTo(14, -118); g2.lineTo(4, -108); g2.lineTo(-4, -108); g2.lineTo(-14, -118); g2.closePath(); });
    for (const s of [-1, 1]) { g.fillStyle = '#fff'; g.beginPath(); poly(g, [[s * 3, -128], [s * 13, -130], [s * 12, -124], [s * 4, -124]]); g.fill(); g.fillStyle = C.goz; g.beginPath(); g.arc(s * 8 + 1, -126.5, 2.6, 0, 7); g.fill(); g.strokeStyle = K; g.lineWidth = 2.6; g.beginPath(); g.moveTo(s * 2.5, -128.5); g.lineTo(s * 14, -131); g.stroke(); g.lineWidth = 3.2; g.beginPath(); g.moveTo(s * 3, -134 - (s > 0 ? 2 : 0)); g.lineTo(s * 13, -136 - (s > 0 ? 3 : 0)); g.stroke(); }
    g.strokeStyle = K; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-5, -114); g.quadraticCurveTo(2, -113, 7, -117); g.stroke();
    if (C.bant) { F('#fff', g2 => { g2.save && 0; poly(g2, [[-14, -120], [-6, -122], [-5, -118], [-13, -116]]); }, false); }
    // saç
    F(C.sac, g2 => poly(g2, C.sacT === 'uzun' ? [[-18, -130], [-20, -150], [-8, -160], [10, -160], [21, -148], [19, -110], [26, -100], [12, -104], [14, -138], [4, -146], [-6, -138], [-10, -144], [-14, -134], [-14, -104], [-22, -108]] : [[-18, -130], [-22, -152], [-10, -158], [-4, -168], [6, -160], [16, -166], [14, -154], [24, -150], [19, -132], [12, -144], [4, -138], [-2, -146], [-8, -138]]));
    if (C.sapka) { F(C.sapka, g2 => { g2.moveTo(-18, -146); g2.quadraticCurveTo(-18, -164, 0, -164); g2.quadraticCurveTo(18, -164, 18, -146); g2.closePath(); }); F(C.sapka, g2 => poly(g2, [[-30, -146], [-16, -150], [0, -146], [-24, -142]])); }
  }

  const K = { neon, lowpoly, golge, eski, sokak };
  window.Insan = { draw(g, k, C, x, y, sc = 1, t = 0) { g.save(); g.translate(x, y); g.scale(sc, sc); K[k](g, C, t); g.restore(); } };
})();
