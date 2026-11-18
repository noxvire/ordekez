// Ördekez chibi v2 — kodla çizilen, gölgeli/ışıklı anime chibi karakterler
// Chibi2.draw(ctx, cfg, x, y, scale, {dir:'s'|'n'|'e'|'w', anim:'idle'|'walk'|'fish'|'wave'|'sit'|'cheer', t})
(function () {
  const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, k) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const dk = (c, k) => mix(c, '#1a0c1c', k), lt = (c, k) => mix(c, '#ffffff', k);
  const rr = (g, x, y, w, h, r) => { g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  // dolgu: üstten ışık, alttan gölge, renkli kontur
  function paint(g, c, path, o = {}) {
    g.beginPath(); path(g);
    const y0 = o.y0 != null ? o.y0 : -70, y1 = o.y1 != null ? o.y1 : 60, gr = g.createLinearGradient(o.gx || 0, y0, o.gx2 || 0, y1);
    gr.addColorStop(0, lt(c, o.hi != null ? o.hi : .22)); gr.addColorStop(.45, c); gr.addColorStop(1, dk(c, o.lo != null ? o.lo : .22));
    g.fillStyle = o.flat ? c : gr; g.fill();
    if (o.noLine) return; g.lineWidth = o.lw || 2.2; g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = o.line || dk(c, .62); g.stroke();
  }
  function clipDo(g, path, fn) { g.save(); g.beginPath(); path(g); g.clip(); fn(); g.restore(); }
  // saç parlaklığı (melek halkası) + perçem gölgesi
  function hairShine(g, c, path, cy = -44, r = 26) {
    clipDo(g, path, () => {
      g.strokeStyle = lt(c, .55); g.globalAlpha = .75; g.lineWidth = 4; g.beginPath(); g.ellipse(-2, cy, r, 7, 0, Math.PI * 1.05, Math.PI * 1.65); g.stroke();
      g.lineWidth = 2.5; g.beginPath(); g.ellipse(-2, cy, r, 7, 0, Math.PI * 1.75, Math.PI * 1.95); g.stroke(); g.globalAlpha = 1;
    });
  }
  function strands(g, c, pts) { g.strokeStyle = dk(c, .35); g.lineWidth = 1.3; g.lineCap = 'round'; for (const p of pts) { g.beginPath(); g.moveTo(p[0], p[1]); g.quadraticCurveTo(p[2], p[3], p[4], p[5]); g.stroke(); } }

  /* ============ SAÇLAR (f: 0 ön, 1 sağ, -1 sol, 2 arka) ============ */
  const HAIR = {
    anime: { ad: 'Anime Kirpi', back(g, c, f) { const P = g2 => { g2.moveTo(-36, 0); const n = 11; for (let i = 0; i <= n; i++) { const a = Math.PI * .95 + i / n * Math.PI * 1.1, r = i % 2 ? 36 : 47; g2.lineTo(Math.cos(a) * r, -30 + Math.sin(a) * r * .92); } g2.lineTo(36, 0); g2.closePath(); }; paint(g, c, P); if (f === 2) hairShine(g, c, P, -50, 28); },
      front(g, c, f) { if (f === 2) return; const s = f || 1, P = g2 => { g2.moveTo(-36, -22); g2.lineTo(-30, -18); g2.lineTo(-24, -34); g2.lineTo(-17, -20); g2.lineTo(-9, -38); g2.lineTo(-1, -22); g2.lineTo(8, -40); g2.lineTo(14, -24); g2.lineTo(24, -38); g2.lineTo(28, -22); g2.lineTo(37, -26); g2.quadraticCurveTo(36, -70, 0, -68); g2.quadraticCurveTo(-36, -68, -36, -22); };
        paint(g, c, P); hairShine(g, c, P); strands(g, c, [[-14, -58, -18, -42, -17, -24], [6, -60, 8, -44, 8, -30]]); } },
    wolf: { ad: 'Wolf Cut', back(g, c, f) { const P = g2 => { g2.moveTo(-38, -30); g2.quadraticCurveTo(-38, -70, 0, -70); g2.quadraticCurveTo(38, -70, 38, -30); g2.lineTo(40, 4); g2.lineTo(30, -4); g2.lineTo(26, 10); g2.lineTo(16, 0); g2.lineTo(0, 12); g2.lineTo(-16, 0); g2.lineTo(-26, 10); g2.lineTo(-30, -4); g2.lineTo(-40, 4); g2.closePath(); }; paint(g, c, P); if (f === 2) hairShine(g, c, P, -50, 28); },
      front(g, c, f) { if (f === 2) return; const P = g2 => { g2.moveTo(-37, -18); g2.quadraticCurveTo(-38, -68, 0, -68); g2.quadraticCurveTo(38, -68, 37, -18); g2.lineTo(30, -24); g2.lineTo(26, -14); g2.lineTo(18, -30); g2.lineTo(10, -18); g2.lineTo(2, -32); g2.lineTo(-7, -18); g2.lineTo(-14, -30); g2.lineTo(-22, -16); g2.lineTo(-28, -26); g2.closePath(); };
        paint(g, c, P); hairShine(g, c, P); strands(g, c, [[-20, -60, -24, -44, -22, -30], [12, -62, 16, -46, 16, -32]]); } },
    uzun: { ad: 'Uzun Dalgalı', back(g, c, f) { const P = g2 => { g2.moveTo(-36, -34); g2.quadraticCurveTo(-36, -70, 0, -70); g2.quadraticCurveTo(36, -70, 36, -34); g2.quadraticCurveTo(46, 0, 38, 20); g2.quadraticCurveTo(44, 36, 32, 44); g2.quadraticCurveTo(0, 50, -32, 44); g2.quadraticCurveTo(-44, 36, -38, 20); g2.quadraticCurveTo(-46, 0, -36, -34); }; paint(g, c, P, { y1: 50 }); if (f === 2) { hairShine(g, c, P, -52, 28); strands(g, c, [[-14, -30, -18, 10, -10, 40], [10, -30, 16, 10, 10, 40]]); } },
      front(g, c, f) { if (f === 2) return; const P = g2 => { g2.moveTo(-36, -18); g2.quadraticCurveTo(-36, -68, 0, -68); g2.quadraticCurveTo(36, -68, 36, -18); g2.quadraticCurveTo(24, -24, 20, -36); g2.quadraticCurveTo(14, -24, 2, -24); g2.quadraticCurveTo(-8, -30, -10, -40); g2.quadraticCurveTo(-18, -22, -36, -18); };
        paint(g, c, P); hairShine(g, c, P);
        if (f === 0) for (const s of [-1, 1]) paint(g, c, g2 => { g2.moveTo(s * 36, -22); g2.quadraticCurveTo(s * 42, 0, s * 34, 18); g2.quadraticCurveTo(s * 40, 28, s * 30, 34); g2.quadraticCurveTo(s * 30, 10, s * 27, -18); g2.closePath(); }); } },
    bob: { ad: 'Kâkül Bob', back(g, c) { paint(g, c, g2 => { g2.moveTo(-38, -30); g2.quadraticCurveTo(-38, -70, 0, -70); g2.quadraticCurveTo(38, -70, 38, -30); g2.lineTo(38, 6); g2.quadraticCurveTo(0, 14, -38, 6); g2.closePath(); }); },
      front(g, c, f) { if (f === 2) return; const P = g2 => { g2.moveTo(-37, -14); g2.quadraticCurveTo(-37, -68, 0, -68); g2.quadraticCurveTo(37, -68, 37, -14); g2.lineTo(29, -16); g2.quadraticCurveTo(28, -26, 24, -26); g2.lineTo(-24, -26); g2.quadraticCurveTo(-28, -26, -29, -16); g2.closePath(); };
        paint(g, c, P); hairShine(g, c, P); g.strokeStyle = dk(c, .3); g.lineWidth = 1.2; for (let x = -18; x <= 18; x += 9) { g.beginPath(); g.moveTo(x, -46); g.lineTo(x + 1, -27); g.stroke(); }
        if (f === 0) for (const s of [-1, 1]) paint(g, c, g2 => { g2.moveTo(s * 37, -18); g2.lineTo(s * 38, 6); g2.quadraticCurveTo(s * 32, 8, s * 28, 4); g2.lineTo(s * 29, -18); g2.closePath(); }); } },
    kuyruk: { ad: 'Yüksek At Kuyruğu', back(g, c, f) { const sw = Math.sin(performance.now() / 300) * 4, x = f === 1 ? -26 : f === -1 ? 26 : 0, d = f === 1 ? -1 : f === -1 ? 1 : 0;
        paint(g, c, g2 => { g2.moveTo(x - 9, -66); g2.quadraticCurveTo(x + d * 38 + sw + (d ? 0 : 26), -62, x + d * 26 + sw + (d ? 0 : 18), 6); g2.quadraticCurveTo(x + d * 10 + (d ? 0 : 6), -20, x + 9, -66); g2.closePath(); });
        paint(g, c, g2 => { g2.ellipse(0, -32, 36, 37, 0, Math.PI, 0); g2.closePath(); }); },
      front(g, c, f) { if (f === 2) { paint(g, '#ff4f8a', g2 => g2.ellipse(0, -66, 10, 6, 0, 0, 7)); return; } const P = g2 => { g2.moveTo(-36, -20); g2.quadraticCurveTo(-36, -68, 0, -68); g2.quadraticCurveTo(36, -68, 36, -20); g2.quadraticCurveTo(16, -48, -10, -30); g2.quadraticCurveTo(-22, -40, -36, -20); };
        paint(g, c, P); hairShine(g, c, P); paint(g, '#ff4f8a', g2 => g2.ellipse(f === 0 ? 0 : -f * 24, -68, 9, 6, 0, 0, 7)); } },
    topuz: { ad: 'İkiz Topuz', back(g, c) { for (const s of [-1, 1]) { const P = g2 => g2.arc(s * 32, -62, 15, 0, 7); paint(g, c, P); clipDo(g, P, () => { g.strokeStyle = lt(c, .5); g.lineWidth = 3; g.beginPath(); g.arc(s * 32, -62, 9, Math.PI * 1.1, Math.PI * 1.6); g.stroke(); }); }
        paint(g, c, g2 => { g2.ellipse(0, -32, 36, 37, 0, Math.PI, 0); g2.closePath(); }); },
      front(g, c, f) { if (f === 2) return; const P = g2 => { g2.moveTo(-36, -18); g2.quadraticCurveTo(-36, -68, 0, -68); g2.quadraticCurveTo(36, -68, 36, -18); g2.quadraticCurveTo(28, -32, 18, -26); g2.quadraticCurveTo(10, -40, 0, -26); g2.quadraticCurveTo(-10, -40, -18, -26); g2.quadraticCurveTo(-28, -32, -36, -18); };
        paint(g, c, P); hairShine(g, c, P); } },
    kivircik: { ad: 'Kıvırcık', back(g, c) { const P = g2 => { for (let i = 0; i < 14; i++) { const a = Math.PI * .8 + i / 13 * Math.PI * 1.4, x = Math.cos(a) * 34, y = -30 + Math.sin(a) * 36; g2.moveTo(x + 12, y); g2.arc(x, y, 12, 0, 7); } }; paint(g, c, P); paint(g, c, g2 => g2.ellipse(0, -32, 36, 36, 0, Math.PI, 0), { noLine: true }); },
      front(g, c, f) { if (f === 2) return; const P = g2 => { for (let i = 0; i < 6; i++) { const x = -27 + i * 11, y = -50 + Math.abs(i - 2.5) * 2.5; g2.moveTo(x + 9, y); g2.arc(x, y, 9, 0, 7); } }; paint(g, c, P); clipDo(g, P, () => { g.fillStyle = lt(c, .4); for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(-30 + i * 11, -54 + Math.abs(i - 2.5) * 2.5, 3, 0, 7); g.fill(); } }); } },
    kel: { ad: 'Kel ✨', back() {}, front(g, c, f) { g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.ellipse(f === 0 ? -14 : f === 2 ? 0 : -f * 10, -56, 11, 5, -.5, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(f === 0 ? 2 : -f * 2, -60, 2, 0, 7); g.fill(); } },
  };

  /* ============ ŞAPKA / KAFA AKSESUARI ============ */
  const HAT = {
    yok: { ad: 'Yok' },
    kulaklik: { ad: 'Kulaklık', back: true, draw(g, c, f) { g.lineCap = 'round'; g.strokeStyle = dk(c, .6); g.lineWidth = 8; g.beginPath(); g.arc(0, -32, 42, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); g.strokeStyle = c; g.lineWidth = 5; g.stroke();
        for (const s of f === 0 || f === 2 ? [-1, 1] : [-f]) { paint(g, c, g2 => rr(g2, s * 40 - 9, -42, 18, 28, 8)); g.fillStyle = lt(c, .6); g.beginPath(); g.arc(s * 40, -28, 4, 0, 7); g.fill(); } } },
    bere: { ad: 'Bere', draw(g, c) { paint(g, c, g2 => { g2.moveTo(-38, -40); g2.quadraticCurveTo(-36, -84, 0, -84); g2.quadraticCurveTo(36, -84, 38, -40); g2.closePath(); }); paint(g, dk(c, .12), g2 => rr(g2, -40, -46, 80, 13, 6)); g.strokeStyle = dk(c, .3); g.lineWidth = 1.2; for (let x = -32; x <= 32; x += 8) { g.beginPath(); g.moveTo(x, -44); g.lineTo(x, -35); g.stroke(); } paint(g, '#ffffff', g2 => g2.arc(0, -86, 8, 0, 7)); } },
    kep: { ad: 'Ters Kep', draw(g, c, f) { const P = g2 => { g2.moveTo(-37, -40); g2.quadraticCurveTo(-35, -80, 0, -80); g2.quadraticCurveTo(35, -80, 37, -40); g2.closePath(); }; paint(g, c, P);
        if (f !== 0) paint(g, dk(c, .15), g2 => g2.ellipse(f === 2 ? 0 : -f * 30, -40, f === 2 ? 30 : 22, 7, 0, 0, 7)); if (f !== 2) paint(g, '#ffffff', g2 => rr(g2, -11, -66, 22, 10, 4)); } },
    kova: { ad: 'Balıkçı Şapkası', draw(g, c) { paint(g, dk(c, .08), g2 => g2.ellipse(0, -44, 50, 12, 0, 0, 7)); paint(g, c, g2 => { g2.moveTo(-32, -46); g2.quadraticCurveTo(-30, -82, 0, -82); g2.quadraticCurveTo(30, -82, 32, -46); g2.closePath(); }); paint(g, '#ffd84a', g2 => { g2.moveTo(20, -58); g2.lineTo(28, -66); g2.lineTo(30, -54); g2.closePath(); }, { lw: 1.4 }); } },
    kedi: { ad: 'Kedi Kulakları', draw(g, c, f) { for (const s of [-1, 1]) { if (f === 1 && s === -1 || f === -1 && s === 1) continue; paint(g, c, g2 => { g2.moveTo(s * 12, -62); g2.lineTo(s * 33, -90); g2.lineTo(s * 37, -50); g2.closePath(); }); g.fillStyle = '#ffb6d2'; g.beginPath(); g.moveTo(s * 19, -62); g.lineTo(s * 31, -80); g.lineTo(s * 32, -58); g.fill(); } } },
    tac: { ad: 'Taç', draw(g) { paint(g, '#ffd23f', g2 => { g2.moveTo(-22, -60); g2.lineTo(-24, -88); g2.lineTo(-11, -72); g2.lineTo(0, -92); g2.lineTo(11, -72); g2.lineTo(24, -88); g2.lineTo(22, -60); g2.closePath(); }, { y0: -92, y1: -60 }); for (const [x, y, c] of [[0, -70, '#ff4f8a'], [-14, -66, '#4ab8ff'], [14, -66, '#4ab8ff']]) { g.fillStyle = c; g.beginPath(); g.arc(x, y, 3.2, 0, 7); g.fill(); } } },
    boynuz: { ad: 'Şeytan Boynuzu', draw(g, c, f) { for (const s of [-1, 1]) { if (f === 1 && s === -1 || f === -1 && s === 1) continue; paint(g, c, g2 => { g2.moveTo(s * 14, -60); g2.quadraticCurveTo(s * 30, -70, s * 26, -92); g2.quadraticCurveTo(s * 40, -70, s * 28, -54); g2.closePath(); }); } } },
    hale: { ad: 'Melek Halesi', draw(g, c) { const y = -88 + Math.sin(performance.now() / 400) * 2; g.strokeStyle = 'rgba(255,240,150,.5)'; g.lineWidth = 9; g.beginPath(); g.ellipse(0, y, 24, 7, 0, 0, 7); g.stroke(); g.strokeStyle = '#ffe36a'; g.lineWidth = 3.5; g.stroke(); } },
  };
  const EYE = { parlak: 'Parlak', havali: 'Havalı', mutlu: 'Mutlu ^^', kedi: 'Kedi', yildiz: 'Yıldızlı', kalp: 'Kalpli', uykulu: 'Uykulu' };
  const MOUTH = { gulus: 'Gülümseme', kedi: 'Kedi ω', ag: 'Açık', sirit: 'Sırıtış', dil: 'Dil :P', dis: 'Vampir dişi' };
  const TOP = { kapusonlu: 'Kapüşonlu', ceket: 'Deri Ceket', tisort: 'Ördek Tişört', elbise: 'Fırfırlı Elbise', yelek: 'Balıkçı Yeleği', kazak: 'Çizgili Kazak' };
  const ACC = { yok: 'Yok', gozluk: 'Güneş Gözlüğü', yuvarlak: 'Yuvarlak Gözlük', atki: 'Atkı', yara: 'Yara Bandı', maske: 'Yüz Maskesi', kolye: 'Zincir Kolye' };
  const AURA = { yok: 'Yok', parilti: '✨ Parıltı', kalp: '💗 Kalpler', ates: '🔥 Ateş', yildiz: '⭐ Yıldız' };

  function eyes(g, cfg, f, blink) {
    const xs = f === 0 ? [-14, 14] : [f * 13], iris = cfg.goz, t = performance.now() / 1000;
    for (const x0 of xs) {
      const y = -15, x = x0, side = f !== 0, w = side ? 6.5 : 8.2, h = 10;
      if (blink || cfg.gozT === 'mutlu') { g.strokeStyle = '#2a1424'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.arc(x, y + 4, 7, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); continue; }
      if (cfg.gozT === 'uykulu') { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y + 3, w, 5, 0, 0, Math.PI); g.fill(); g.fillStyle = iris; g.beginPath(); g.ellipse(x, y + 4, w - 2, 4, 0, 0, Math.PI); g.fill(); g.strokeStyle = '#2a1424'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - w - 1, y + 3); g.lineTo(x + w + 1, y + 3); g.stroke(); continue; }
      // göz akı + iris
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, w, h, 0, 0, 7); g.fill();
      const ix = x + (side ? f * 1.5 : 0), gr = g.createLinearGradient(0, y - h, 0, y + h);
      gr.addColorStop(0, dk(iris, .55)); gr.addColorStop(.45, iris); gr.addColorStop(.85, lt(iris, .45)); gr.addColorStop(1, lt(iris, .7));
      if (cfg.gozT === 'havali') { g.save(); g.beginPath(); g.ellipse(x, y, w, h, 0, 0, 7); g.clip(); g.fillStyle = '#2a1424'; g.fillRect(x - w - 2, y - h - 2, w * 2 + 4, h * .75); g.restore(); }
      g.fillStyle = gr; g.beginPath(); g.ellipse(ix, y + .5, w - 1.2, h - 1, 0, 0, 7); g.fill();
      g.fillStyle = '#1a0812';
      if (cfg.gozT === 'kedi') { g.beginPath(); g.ellipse(ix, y + 1, 1.7, h - 3.5, 0, 0, 7); g.fill(); }
      else if (cfg.gozT === 'kalp') { g.fillStyle = '#ff3a7a'; const s = 3.6; g.beginPath(); g.moveTo(ix, y + 4); g.bezierCurveTo(ix - s * 2, y, ix - s, y - s * 1.6, ix, y - s * .5); g.bezierCurveTo(ix + s, y - s * 1.6, ix + s * 2, y, ix, y + 4); g.fill(); }
      else { g.beginPath(); g.ellipse(ix, y + 1.5, 3.4, 4.4, 0, 0, 7); g.fill(); }
      // parıltılar
      g.fillStyle = '#fff';
      if (cfg.gozT === 'yildiz') { const sx = ix - 2, sy = y - 3, pul = 1 + Math.sin(t * 5) * .15; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? 1.7 : 4.6) * pul; g.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } g.fill(); }
      else if (cfg.gozT !== 'havali') { g.beginPath(); g.ellipse(ix - 3, y - 4, 3, 3.6, -.4, 0, 7); g.fill(); g.beginPath(); g.arc(ix + 3, y + 4.5, 1.5, 0, 7); g.fill(); }
      else { g.fillRect(ix - 3, y - 1, 2.5, 2.5); }
      g.globalAlpha = .45; g.beginPath(); g.ellipse(ix, y + h * .55, w - 3, 2, 0, 0, 7); g.fill(); g.globalAlpha = 1;
      // kirpik
      g.strokeStyle = '#2a1424'; g.lineCap = 'round';
      g.lineWidth = 3.4; g.beginPath(); g.ellipse(x, y, w + .6, h + .6, 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke();
      if (!side || f) { g.lineWidth = 2.4; const ox = side ? x + f * w : x + (x0 > 0 ? w : -w), dir = side ? f : x0 > 0 ? 1 : -1; g.beginPath(); g.moveTo(ox - dir * 1, y - h * .55); g.lineTo(ox + dir * 4, y - h * .95); g.stroke(); }
      g.lineWidth = 1.2; g.beginPath(); g.ellipse(x, y, w, h, 0, Math.PI * .25, Math.PI * .75); g.stroke();
      // kaş
      g.lineWidth = 2.6; g.beginPath(); const ang = cfg.gozT === 'havali' ? (x0 > 0 ? -3 : 3) : 0; g.moveTo(x - 7, y - 15 - (side ? 0 : ang)); g.quadraticCurveTo(x, y - 18, x + 7, y - 15 + (side ? 0 : ang)); g.stroke();
    }
  }
  function mouth(g, cfg, f) {
    const x = f === 0 ? 0 : f * 16, y = 2; g.strokeStyle = '#4a1a2a'; g.lineWidth = 2; g.lineCap = 'round'; g.lineJoin = 'round';
    switch (cfg.agiz) {
      case 'kedi': g.beginPath(); g.arc(x - 3.2, y - 1, 3.2, .15, Math.PI - .15); g.arc(x + 3.2, y - 1, 3.2, .15, Math.PI - .15); g.stroke(); break;
      case 'ag': g.fillStyle = '#9a2a44'; g.beginPath(); g.moveTo(x - 6, y - 2); g.quadraticCurveTo(x, y + 10, x + 6, y - 2); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#ff8a9a'; g.beginPath(); g.ellipse(x, y + 4, 3, 2, 0, 0, 7); g.fill(); break;
      case 'sirit': g.beginPath(); g.moveTo(x - 7, y - 2); g.quadraticCurveTo(x + 1, y + 5, x + 7, y - 5); g.stroke(); break;
      case 'dil': g.beginPath(); g.moveTo(x - 6, y - 1); g.quadraticCurveTo(x, y + 4, x + 6, y - 1); g.stroke(); g.fillStyle = '#ff6a8a'; g.beginPath(); g.ellipse(x + 2, y + 3.5, 3, 3.4, 0, 0, 7); g.fill(); g.lineWidth = 1.4; g.stroke(); break;
      case 'dis': g.beginPath(); g.moveTo(x - 6, y - 1); g.quadraticCurveTo(x, y + 3, x + 6, y - 1); g.stroke(); g.fillStyle = '#fff'; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * 3 - 1.5, y); g.lineTo(x + s * 3, y + 4); g.lineTo(x + s * 3 + 1.5, y); g.fill(); } break;
      default: g.beginPath(); g.arc(x, y - 3, 5, .35, Math.PI - .35); g.stroke();
    }
  }
  function head(g, C, f, blink) {
    const H = HAIR[C.sac] || HAIR.anime;
    if (HAT[C.sapka] && HAT[C.sapka].back && f === 2) HAT[C.sapka].draw(g, C.sapkaR, f);
    if (f !== 2) H.back(g, C.sacR, f);
    // kulak
    for (const s of f === 0 ? [-1, 1] : f === 2 ? [-1, 1] : [-f]) paint(g, C.ten, g2 => g2.ellipse(s * 34, -20, 6, 8, 0, 0, 7), { lo: .15 });
    // yüz
    const face = g2 => g2.ellipse(0, -26, 35, 33, 0, 0, 7);
    paint(g, C.ten, face, { hi: .25, lo: .12, y0: -60, y1: 10 });
    if (f !== 2) {
      clipDo(g, face, () => { g.fillStyle = dk(C.ten, .25); g.globalAlpha = .35; g.beginPath(); g.ellipse(0, -52, 34, 16, 0, 0, 7); g.fill(); g.globalAlpha = 1; });
      for (const x of f === 0 ? [-21, 21] : [f * 22]) { const gr = g.createRadialGradient(x, -3, 0, x, -3, 9); gr.addColorStop(0, 'rgba(255,110,150,.55)'); gr.addColorStop(1, 'rgba(255,110,150,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, -3, 9, 0, 7); g.fill(); }
      eyes(g, C, f, blink); mouth(g, C, f);
      g.fillStyle = dk(C.ten, .3); g.beginPath(); g.arc(f === 0 ? 0 : f * 22, -5, 1.2, 0, 7); g.fill();
      if (C.aks === 'yara') { g.save(); g.translate(f === 0 ? 20 : f * 6, -6); g.rotate(-.4); paint(g, '#f6d5a8', g2 => rr(g2, -8, -3.5, 16, 7, 3.5), { lw: 1.4 }); g.fillStyle = '#e8b888'; g.fillRect(-2, -2, 4, 4); g.restore(); }
      if (C.aks === 'maske') paint(g, '#2a2a3a', g2 => { g2.moveTo(-26, -6); g2.quadraticCurveTo(0, -10, 26, -6); g2.quadraticCurveTo(24, 10, 0, 12); g2.quadraticCurveTo(-24, 10, -26, -6); }, { lw: 1.6 });
    }
    if (f === 2) { H.back(g, C.sacR, f); if (C.sac !== 'kel' && !['kivircik'].includes(C.sac)) { const cap = g2 => g2.ellipse(0, -32, 36, 37, 0, Math.PI * .95, Math.PI * 2.05); paint(g, C.sacR, cap); hairShine(g, C.sacR, cap, -50, 28); } else if (C.sac === 'kivircik') paint(g, C.sacR, g2 => g2.ellipse(0, -30, 36, 34, 0, 0, 7)); }
    H.front(g, C.sacR, f);
    const HT = HAT[C.sapka]; if (HT && HT.draw && !(HT.back && f === 2)) HT.draw(g, C.sapkaR, f);
    if (f !== 2 && (C.aks === 'gozluk' || C.aks === 'yuvarlak')) {
      const xs = f === 0 ? [-14, 14] : [f * 13];
      if (C.aks === 'gozluk') { for (const x of xs) { paint(g, '#1a1424', g2 => { g2.moveTo(x - 12, -24); g2.lineTo(x + 12, -24); g2.quadraticCurveTo(x + 11, -8, x, -9); g2.quadraticCurveTo(x - 11, -8, x - 12, -24); }, { lw: 1.6, line: '#000' }); const gr = g.createLinearGradient(x - 10, -24, x + 10, -10); gr.addColorStop(0, 'rgba(120,200,255,.5)'); gr.addColorStop(.5, 'rgba(255,120,220,.15)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - 10, -23, 20, 6); }
        if (f === 0) { g.strokeStyle = '#000'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(-3, -22); g.lineTo(3, -22); g.stroke(); } }
      else { g.strokeStyle = '#6a3a2a'; g.lineWidth = 2.2; for (const x of xs) { g.beginPath(); g.arc(x, -15, 11, 0, 7); g.stroke(); g.fillStyle = 'rgba(255,255,255,.18)'; g.fill(); } if (f === 0) { g.beginPath(); g.moveTo(-3, -16); g.lineTo(3, -16); g.stroke(); } }
    }
  }
  function body(g, C, f, sw, anim) {
    const c = C.ust, sk = C.ten, T = C.ustT;
    const arm = (s, back) => {
      let a = s * sw * .55; if (anim === 'fish' && s === (f === -1 ? -1 : 1)) a = -1.25 * (f === -1 ? -1 : 1); if (anim === 'wave' && s === 1) a = -2.5 + Math.sin(performance.now() / 110) * .4; if (anim === 'cheer') a = s * -2.6 + Math.sin(performance.now() / 120) * .2 * s;
      g.save(); g.translate(s * 16, 20); g.rotate(a);
      paint(g, back ? dk(c, .15) : c, g2 => rr(g2, -6, -2, 12, 17, 6), { y0: -2, y1: 15 });
      if (T === 'kazak') { g.fillStyle = lt(c, .6); g.fillRect(-6, 6, 12, 3); }
      paint(g, sk, g2 => g2.arc(0, 17, 5.2, 0, 7), { y0: 12, y1: 22 }); g.restore();
    };
    if (f === 0 || f === 2) { arm(-1); arm(1); } else arm(-f, true);
    if (T === 'elbise') { paint(g, c, g2 => { g2.moveTo(-12, 14); g2.lineTo(12, 14); g2.lineTo(21, 44); g2.quadraticCurveTo(0, 50, -21, 44); g2.closePath(); }, { y0: 14, y1: 48 }); g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); for (let x = -20; x <= 20; x += 5) { g.moveTo(x, 44 + Math.abs(x) * .08); g.arc(x + 2.5, 44 + Math.abs(x) * .08, 2.5, Math.PI, 0, true); } g.stroke(); if (f !== 2) paint(g, '#ff4f8a', g2 => { g2.moveTo(0, 18); g2.lineTo(-8, 13); g2.lineTo(-8, 23); g2.closePath(); g2.moveTo(0, 18); g2.lineTo(8, 13); g2.lineTo(8, 23); g2.closePath(); }, { lw: 1.2 }); }
    else paint(g, c, g2 => rr(g2, -15, 14, 30, 27, 9), { y0: 14, y1: 42 });
    const front = f !== 2;
    if (T === 'kapusonlu') { if (front) { g.fillStyle = dk(c, .12); g.beginPath(); rr(g, -9, 30, 18, 8, 4); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-4, 16); g.lineTo(-5, 26); g.moveTo(4, 16); g.lineTo(5, 26); g.stroke(); } else paint(g, dk(c, .1), g2 => { g2.ellipse(0, 18, 16, 8, 0, 0, Math.PI); }, { lw: 1.6 }); }
    if (T === 'ceket' && front) { g.fillStyle = '#f4f4f4'; g.beginPath(); g.moveTo(-6, 14); g.lineTo(6, 14); g.lineTo(0, 34); g.fill(); g.strokeStyle = dk(c, .6); g.lineWidth = 1.6; g.beginPath(); g.moveTo(-7, 14); g.lineTo(0, 36); g.lineTo(7, 14); g.moveTo(0, 36); g.lineTo(0, 41); g.stroke(); g.fillStyle = '#c8c8d0'; g.fillRect(-12, 24, 3, 3); }
    if (T === 'yelek') { g.strokeStyle = dk('#7a8a4a', .6); g.lineWidth = 1.4; for (const s of front ? [-1, 1] : [0]) { g.fillStyle = '#7a8a4a'; g.beginPath(); rr(g, s === 0 ? -13 : s < 0 ? -14 : 3, 15, s === 0 ? 26 : 11, 25, 4); g.fill(); g.stroke(); if (s) { g.fillStyle = '#5a6a2a'; g.beginPath(); rr(g, s < 0 ? -12 : 5, 28, 7, 6, 2); g.fill(); g.stroke(); } } }
    if (T === 'tisort' && front) { g.save(); g.translate(0, 28); g.fillStyle = '#ffd84a'; g.strokeStyle = '#7a4a00'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(0, 3, 6, 4, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(4, -2, 3.5, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#ff8a1c'; g.fillRect(7, -2, 3, 1.6); g.fillStyle = '#000'; g.fillRect(4, -3, 1.2, 1.2); g.restore(); }
    if (T === 'kazak') { g.fillStyle = lt(c, .6); g.fillRect(-15, 22, 30, 4); g.fillRect(-15, 31, 30, 4); g.strokeStyle = dk(c, .62); g.lineWidth = 2.2; g.beginPath(); rr(g, -15, 14, 30, 27, 9); g.stroke(); }
    if (C.aks === 'kolye' && front) { g.strokeStyle = '#e8e8f0'; g.lineWidth = 1.6; g.beginPath(); g.arc(0, 12, 9, .3, Math.PI - .3); g.stroke(); paint(g, '#ffd23f', g2 => g2.arc(0, 21, 3, 0, 7), { lw: 1 }); }
    if (f === 1 || f === -1) arm(f);
  }
  function legs(g, C, f, ph, sit) {
    const c = C.alt, s0 = C.ayak;
    if (sit) { for (const s of [-1, 1]) { paint(g, c, g2 => rr(g2, s * 8 - 6 + (f === 0 || f === 2 ? 0 : f * 5), 38, 12, 10, 4)); paint(g, s0, g2 => g2.ellipse(s * 8 + (f === 0 || f === 2 ? 0 : f * 13), 48, 7, 5, 0, 0, 7)); } return; }
    for (const s of [-1, 1]) {
      const side = !(f === 0 || f === 2), off = side ? Math.sin(ph) * 7 * s : 0, lift = side ? 0 : Math.max(0, Math.sin(ph) * s) * 3.5;
      paint(g, c, g2 => rr(g2, s * 7 - 6 + off, 37 - lift, 12, 13, 4), { y0: 37, y1: 50 });
      paint(g, s0, g2 => g2.ellipse(s * 7 + off + (side ? f * 2 : 0), 51 - lift, 8, 5.5, 0, 0, 7), { y0: 46, y1: 56 });
      g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(s * 7 + off - 4 + (side ? f * 2 : 0), 49 - lift, 8, 1.6);
    }
  }
  const parts = [];
  function aura(g, C, t) {
    if (!C.aura || C.aura === 'yok') return;
    for (let i = 0; i < 7; i++) {
      const k = ((t * .45 + i / 7) % 1), a = i * 2.4 + t * .3, x = Math.cos(a) * (28 + i % 3 * 8), y = 40 - k * 120;
      g.globalAlpha = Math.sin(k * Math.PI) * .9;
      if (C.aura === 'parilti') { g.fillStyle = '#fff6b0'; g.beginPath(); for (let j = 0; j < 8; j++) { const b = j * Math.PI / 4, r = j % 2 ? 1.3 : 5; g.lineTo(x + Math.cos(b) * r, y + Math.sin(b) * r); } g.fill(); }
      else if (C.aura === 'kalp') { g.fillStyle = '#ff6fae'; const s = 3.5; g.beginPath(); g.moveTo(x, y + 4); g.bezierCurveTo(x - s * 2, y, x - s, y - s * 1.6, x, y - s * .5); g.bezierCurveTo(x + s, y - s * 1.6, x + s * 2, y, x, y + 4); g.fill(); }
      else if (C.aura === 'ates') { const gr = g.createRadialGradient(x, y, 0, x, y, 7); gr.addColorStop(0, '#fff2a0'); gr.addColorStop(.5, '#ff8a1c'); gr.addColorStop(1, 'rgba(255,40,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); }
      else { g.fillStyle = '#ffd84a'; g.font = '10px system-ui'; g.fillText('★', x, y); }
    }
    g.globalAlpha = 1;
  }
  function draw(g, cfg, x, y, sc = 1, o = {}) {
    const t = o.t != null ? o.t : performance.now() / 1000, dir = o.dir || 's', anim = o.anim || 'idle', f = { s: 0, n: 2, e: 1, w: -1 }[dir];
    const walk = anim === 'walk', ph = t * 11, bob = walk ? Math.abs(Math.sin(ph)) * 3.5 : anim === 'cheer' ? Math.abs(Math.sin(t * 7)) * 6 : Math.sin(t * 2.4) * 1.2, sw = walk ? Math.sin(ph) : 0;
    const blink = (t % 3.9) < .11, sq = walk ? 1 + Math.cos(ph * 2) * .02 : 1;
    g.save(); g.translate(x, y); g.scale(sc, sc);
    g.fillStyle = 'rgba(20,10,30,.22)'; g.beginPath(); g.ellipse(0, 55, 23 - bob * .8, 6, 0, 0, 7); g.fill();
    g.translate(0, (anim === 'sit' ? 8 : 0) - bob); g.scale(1 / sq, sq);
    aura(g, cfg, t);
    if (cfg.aks === 'atki' && f === 2) paint(g, cfg.aksR || '#e0405a', g2 => rr(g2, 5, 14, 10, 24, 4));
    if (f === 2) { head(g, cfg, f, blink); legs(g, cfg, f, ph, anim === 'sit'); body(g, cfg, f, sw, anim); }
    else { legs(g, cfg, f, ph, anim === 'sit'); body(g, cfg, f, sw, anim); }
    if (cfg.aks === 'atki') { paint(g, cfg.aksR || '#e0405a', g2 => rr(g2, -17, 9, 34, 10, 5)); if (f !== 2) paint(g, cfg.aksR || '#e0405a', g2 => rr(g2, f === 0 ? 4 : -f * 7, 13, 10, 22, 4)); }
    if (f !== 2) { g.save(); g.rotate(walk ? Math.sin(ph) * .035 : anim === 'cheer' ? Math.sin(t * 7) * .06 : 0); head(g, cfg, f, blink); g.restore(); }
    g.restore();
  }
  const COLORS = {
    ten: ['#fff0e4', '#ffe0cc', '#f8c9a4', '#e8a878', '#c98a5a', '#9a6040', '#6e4430', '#d8f4e0', '#e4dcff'],
    sac: ['#241622', '#4a2a22', '#7a4428', '#c8742e', '#f2c14e', '#fff1d8', '#e8e8f4', '#ff7ab8', '#b07aff', '#5ab0ff', '#3ad09a', '#ff4a5a', '#2c3e6a'],
    goz: ['#6a3a20', '#2a8aff', '#2ec27a', '#a65cff', '#ff3a5a', '#ffb020', '#22d0e0', '#ff6fae', '#c0c8d8'],
    giysi: ['#ff6fae', '#ff4a5a', '#ff9a3a', '#ffd84a', '#8ae06a', '#2ec2a0', '#4a90ff', '#7a5aff', '#2a2a3a', '#f4f4f4', '#8a5a3a', '#ffb6d8', '#1e2e5a', '#c8ced8'],
  };
  window.Chibi2 = { draw, HAIR, HAT, EYE, MOUTH, TOP, ACC, AURA, COLORS };
})();
