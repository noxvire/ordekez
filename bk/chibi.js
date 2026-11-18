// Ördekez chibi karakter çizici (kodla, katmanlı, her renk serbest)
// Chibi.draw(ctx, cfg, x, y, scale, {dir:'s'|'n'|'e'|'w', anim:'idle'|'walk'|'fish'|'sit'|'wave', t})
(function () {
  const shade = (hex, k) => { let [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)); const f = k < 0 ? 0 : 255, a = Math.abs(k); r = Math.round(r + (f - r) * a); g = Math.round(g + (f - g) * a); b = Math.round(b + (f - b) * a); return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join(''); };
  const OL = '#3a2233';
  function blob(g, fill, path, lw = 2.2) { g.beginPath(); path(); g.fillStyle = fill; g.fill(); g.lineWidth = lw; g.strokeStyle = OL; g.lineJoin = 'round'; g.stroke(); }
  const rr = (g, x, y, w, h, r) => { g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };

  // ---------- SAÇLAR: back = başın arkası, front = perçem; f = yön (1 sağ, -1 sol, 0 ön, 2 arka)
  const HAIR = {
    kirpi: { ad: 'Kirpi', back(g, c, f) { blob(g, c, () => { g.moveTo(-31, 2); for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI, r = i % 2 ? 33 : 42; g.lineTo(Math.cos(a) * r, -30 + Math.sin(a) * r * .95); } g.lineTo(31, 2); g.closePath(); }); },
      front(g, c, f) { if (f === 2) return; blob(g, c, () => { g.moveTo(-32, -26); g.lineTo(-26, -22); g.lineTo(-20, -34); g.lineTo(-12, -24); g.lineTo(-4, -36); g.lineTo(4, -25); g.lineTo(12, -36); g.lineTo(20, -26); g.lineTo(26, -36); g.lineTo(32, -26); g.quadraticCurveTo(0, -62, -30, -30); }); } },
    dagnik: { ad: 'Dağınık', back(g, c) { blob(g, c, () => { g.ellipse(0, -28, 36, 35, 0, Math.PI * .9, Math.PI * 2.1); g.lineTo(30, 6); g.lineTo(-30, 6); g.closePath(); }); },
      front(g, c, f) { if (f === 2) return; blob(g, c, () => { g.moveTo(-33, -24); g.quadraticCurveTo(-30, -60, 0, -60); g.quadraticCurveTo(30, -60, 33, -24); g.quadraticCurveTo(24, -34, 20, -24); g.quadraticCurveTo(12, -36, 3, -26); g.quadraticCurveTo(-6, -38, -13, -24); g.quadraticCurveTo(-20, -36, -33, -24); }); } },
    uzun: { ad: 'Uzun Düz', back(g, c) { blob(g, c, () => { g.moveTo(-34, -30); g.quadraticCurveTo(-34, -64, 0, -64); g.quadraticCurveTo(34, -64, 34, -30); g.lineTo(36, 30); g.quadraticCurveTo(0, 38, -36, 30); g.closePath(); }); },
      front(g, c, f) { if (f === 2) { blob(g, c, () => { g.moveTo(-34, -30); g.quadraticCurveTo(0, -66, 34, -30); g.lineTo(34, 26); g.quadraticCurveTo(0, 34, -34, 26); g.closePath(); }); return; }
        blob(g, c, () => { g.moveTo(-34, -22); g.quadraticCurveTo(-32, -62, 0, -62); g.quadraticCurveTo(32, -62, 34, -22); g.lineTo(24, -24); g.quadraticCurveTo(16, -40, 6, -24); g.quadraticCurveTo(-4, -40, -14, -20); g.quadraticCurveTo(-22, -36, -34, -22); });
        if (f === 0) { blob(g, c, () => { g.moveTo(-34, -24); g.lineTo(-30, 18); g.lineTo(-24, 16); g.lineTo(-26, -18); g.closePath(); }); blob(g, c, () => { g.moveTo(34, -24); g.lineTo(30, 18); g.lineTo(24, 16); g.lineTo(26, -18); g.closePath(); }); } } },
    kakul: { ad: 'Kâkül Bob', back(g, c) { blob(g, c, () => { g.moveTo(-36, -28); g.quadraticCurveTo(-36, -64, 0, -64); g.quadraticCurveTo(36, -64, 36, -28); g.lineTo(36, 6); g.quadraticCurveTo(0, 12, -36, 6); g.closePath(); }); },
      front(g, c, f) { if (f === 2) return; blob(g, c, () => { g.moveTo(-35, -16); g.quadraticCurveTo(-34, -62, 0, -62); g.quadraticCurveTo(34, -62, 35, -16); g.lineTo(28, -18); g.lineTo(26, -24); g.lineTo(-26, -24); g.lineTo(-28, -18); g.closePath(); });
        if (f === 0) { blob(g, c, () => { g.moveTo(-35, -20); g.lineTo(-34, 6); g.lineTo(-25, 4); g.lineTo(-27, -20); g.closePath(); }); blob(g, c, () => { g.moveTo(35, -20); g.lineTo(34, 6); g.lineTo(25, 4); g.lineTo(27, -20); g.closePath(); }); } } },
    atkuyrugu: { ad: 'At Kuyruğu', back(g, c, f) { blob(g, c, () => { g.ellipse(0, -30, 34, 33, 0, Math.PI, 0); g.closePath(); });
        const sw = Math.sin(Date.now() / 260) * 3; blob(g, c, () => { const x = f === 1 ? -30 : f === -1 ? 30 : 0; g.moveTo(x - 7, -52); g.quadraticCurveTo(x + (f ? -f * 26 : 20) + sw, -40, x + (f ? -f * 16 : 14) + sw, 10); g.quadraticCurveTo(x + (f ? -f * 4 : 4), -20, x + 7, -52); g.closePath(); }); },
      front(g, c, f) { if (f === 2) return; blob(g, c, () => { g.moveTo(-33, -22); g.quadraticCurveTo(-32, -62, 0, -62); g.quadraticCurveTo(32, -62, 33, -22); g.quadraticCurveTo(10, -44, -12, -26); g.quadraticCurveTo(-20, -40, -33, -22); }); g.fillStyle = '#ff5f9e'; g.beginPath(); g.arc(f === 0 ? 20 : -f * 26, -54, 5, 0, 7); g.fill(); } },
    ikiz: { ad: 'İkiz Topuz', back(g, c) { for (const s of [-1, 1]) blob(g, c, () => g.arc(s * 30, -58, 13, 0, 7)); blob(g, c, () => { g.ellipse(0, -30, 34, 33, 0, Math.PI, 0); g.closePath(); }); },
      front(g, c, f) { if (f === 2) return; blob(g, c, () => { g.moveTo(-33, -20); g.quadraticCurveTo(-32, -62, 0, -62); g.quadraticCurveTo(32, -62, 33, -20); g.quadraticCurveTo(26, -34, 16, -26); g.quadraticCurveTo(6, -38, -4, -24); g.quadraticCurveTo(-14, -36, -24, -24); g.quadraticCurveTo(-30, -28, -33, -20); }); } },
    kivircik: { ad: 'Kıvırcık', back(g, c) { blob(g, c, () => { for (let i = 0; i < 12; i++) { const a = Math.PI * .85 + i / 11 * Math.PI * 1.3; g.moveTo(Math.cos(a) * 32 + 11, -30 + Math.sin(a) * 32); g.arc(Math.cos(a) * 32, -30 + Math.sin(a) * 32, 11, 0, 7); } }); blob(g, c, () => g.ellipse(0, -30, 34, 34, 0, Math.PI, 0)); },
      front(g, c, f) { if (f === 2) return; blob(g, c, () => { for (let i = 0; i < 5; i++) { const x = -24 + i * 12, y = -40 + Math.abs(i - 2) * 3; g.moveTo(x + 10, y); g.arc(x, y, 10, 0, 7); } }); } },
    kel: { ad: 'Kel ✨', back() {}, front(g, c, f) { if (f === 2) return; g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.ellipse(f === 0 ? -12 : -f * 10, -52, 9, 5, -.4, 0, 7); g.fill(); } },
  };
  // ---------- ŞAPKALAR
  const HAT = {
    yok: { ad: 'Yok' },
    bere: { ad: 'Bere', draw(g, c, f) { blob(g, c, () => { g.moveTo(-36, -36); g.quadraticCurveTo(-34, -78, 0, -78); g.quadraticCurveTo(34, -78, 36, -36); g.closePath(); }); blob(g, shade(c, -.15), () => rr(g, -38, -42, 76, 12, 6)); blob(g, '#fff', () => g.arc(0, -80, 7, 0, 7)); } },
    kep: { ad: 'Ters Kep', draw(g, c, f) { blob(g, c, () => { g.moveTo(-35, -38); g.quadraticCurveTo(-33, -74, 0, -74); g.quadraticCurveTo(33, -74, 35, -38); g.closePath(); });
        const bx = f === 0 ? 0 : f === 2 ? 0 : -f * 30; if (f !== 0) blob(g, shade(c, -.2), () => { g.ellipse(f === 2 ? 0 : bx, -38, f === 2 ? 30 : 22, 7, 0, 0, 7); }); blob(g, '#fff', () => rr(g, -10, -60, 20, 9, 3)); } },
    kova: { ad: 'Kova Şapka', draw(g, c) { blob(g, shade(c, -.1), () => g.ellipse(0, -40, 46, 11, 0, 0, 7)); blob(g, c, () => { g.moveTo(-30, -42); g.quadraticCurveTo(-28, -76, 0, -76); g.quadraticCurveTo(28, -76, 30, -42); g.closePath(); }); } },
    kedi: { ad: 'Kedi Kulaklı', draw(g, c, f) { for (const s of [-1, 1]) { blob(g, c, () => { g.moveTo(s * 12, -58); g.lineTo(s * 30, -82); g.lineTo(s * 34, -48); g.closePath(); }); g.fillStyle = '#ffb6d2'; g.beginPath(); g.moveTo(s * 18, -58); g.lineTo(s * 29, -74); g.lineTo(s * 30, -55); g.fill(); } } },
    tac: { ad: 'Taç', draw(g) { blob(g, '#ffd23f', () => { g.moveTo(-20, -56); g.lineTo(-22, -80); g.lineTo(-10, -66); g.lineTo(0, -84); g.lineTo(10, -66); g.lineTo(22, -80); g.lineTo(20, -56); g.closePath(); }); g.fillStyle = '#ff4f8a'; g.beginPath(); g.arc(0, -64, 4, 0, 7); g.fill(); } },
    kulaklik: { ad: 'Kulaklık', draw(g, c, f) { g.lineWidth = 6; g.strokeStyle = OL; g.beginPath(); g.arc(0, -30, 39, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); g.lineWidth = 3.5; g.strokeStyle = c; g.stroke();
        for (const s of f === 0 || f === 2 ? [-1, 1] : [-f]) blob(g, c, () => rr(g, s * 37 - 8, -36, 16, 24, 7)); } },
  };
  const EYES = {
    yuvarlak: { ad: 'Kocaman' }, mutlu: { ad: 'Mutlu ^^' }, havali: { ad: 'Havalı' }, kedi: { ad: 'Kedi' }, yildiz: { ad: 'Yıldızlı' },
  };
  const MOUTH = { gulus: 'Gülümseme', kedi: 'Kedi ağzı', ag: 'Açık', sirit: 'Sırıtış', dil: 'Dil' };
  const TOP = { tisort: 'Tişört', kapusonlu: 'Kapüşonlu', ceket: 'Ceket', elbise: 'Elbise', yelek: 'Balıkçı Yeleği' };
  const ACC = { yok: 'Yok', gozluk: 'Güneş Gözlüğü', yuvarlak: 'Yuvarlak Gözlük', atki: 'Atkı', yara: 'Yara Bandı' };

  function drawEyes(g, cfg, f, blink) {
    const iris = cfg.goz, xs = f === 0 ? [-13, 13] : [f * 12];
    for (const x of xs) {
      const y = -16;
      if (blink || cfg.gozT === 'mutlu') { g.strokeStyle = OL; g.lineWidth = 2.6; g.lineCap = 'round'; g.beginPath(); g.arc(x, y + 3, 6, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); continue; }
      if (cfg.gozT === 'havali') {
        g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y + 1, 7.5, 6, 0, 0, 7); g.fill();
        g.fillStyle = iris; g.beginPath(); g.ellipse(x + (f || 0) * 1.5, y + 2, 4.5, 5, 0, 0, 7); g.fill(); g.fillStyle = '#1a0f18'; g.beginPath(); g.arc(x + (f || 0) * 1.5, y + 2.5, 2.2, 0, 7); g.fill();
        g.fillStyle = '#fff'; g.fillRect(x - 1 + (f || 0) * 1.5, y - 1, 2, 2);
        g.fillStyle = OL; g.beginPath(); g.moveTo(x - 9, y - 3); g.quadraticCurveTo(x, y - 8, x + 9, y - 2); g.lineTo(x + 9, y - 5); g.quadraticCurveTo(x, y - 11, x - 9, y - 6); g.fill(); continue;
      }
      const w = 7.5, h = 9.5;
      g.fillStyle = OL; g.beginPath(); g.ellipse(x, y, w + 1.4, h + 1.4, 0, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, w, h, 0, 0, 7); g.fill();
      const gr = g.createLinearGradient(0, y - h, 0, y + h); gr.addColorStop(0, shade(iris, -.45)); gr.addColorStop(.55, iris); gr.addColorStop(1, shade(iris, .45));
      g.fillStyle = gr; g.beginPath(); g.ellipse(x + (f || 0) * 1.2, y + 1, w - 1.3, h - 1.2, 0, 0, 7); g.fill();
      if (cfg.gozT === 'kedi') { g.fillStyle = '#1a0f18'; g.beginPath(); g.ellipse(x + (f || 0) * 1.2, y + 1, 1.6, h - 3, 0, 0, 7); g.fill(); }
      else { g.fillStyle = '#1a0f18'; g.beginPath(); g.arc(x + (f || 0) * 1.2, y + 1.5, 3.4, 0, 7); g.fill(); }
      g.fillStyle = '#fff';
      if (cfg.gozT === 'yildiz') { const sx = x - 1.5, sy = y - 3; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 1.6 : 4; g.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } g.fill(); }
      else { g.beginPath(); g.ellipse(x - 2.6, y - 3.6, 2.8, 3.4, -.4, 0, 7); g.fill(); g.beginPath(); g.arc(x + 2.6, y + 4, 1.3, 0, 7); g.fill(); }
      g.strokeStyle = OL; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 9, y - 9); g.quadraticCurveTo(x, y - 13, x + 9, y - 8); g.stroke();
    }
  }
  function drawMouth(g, cfg, f) {
    const x = f === 0 ? 0 : f * 15, y = 0; g.strokeStyle = OL; g.lineWidth = 2; g.lineCap = 'round';
    switch (cfg.agiz) {
      case 'kedi': g.beginPath(); g.arc(x - 3, y - 1, 3, .1, Math.PI - .1); g.arc(x + 3, y - 1, 3, .1, Math.PI - .1); g.stroke(); break;
      case 'ag': g.fillStyle = '#8a2a3a'; g.beginPath(); g.moveTo(x - 5, y - 2); g.quadraticCurveTo(x, y + 9, x + 5, y - 2); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#ff7a8a'; g.beginPath(); g.arc(x, y + 3, 2.2, 0, Math.PI); g.fill(); break;
      case 'sirit': g.beginPath(); g.moveTo(x - 6, y - 1); g.quadraticCurveTo(x + 1, y + 5, x + 7, y - 4); g.stroke(); break;
      case 'dil': g.beginPath(); g.moveTo(x - 5, y - 1); g.quadraticCurveTo(x, y + 4, x + 5, y - 1); g.stroke(); g.fillStyle = '#ff6a8a'; g.beginPath(); g.ellipse(x + 2, y + 3, 2.6, 3, 0, 0, 7); g.fill(); g.lineWidth = 1.4; g.stroke(); break;
      default: g.beginPath(); g.arc(x, y - 3, 4.5, .35, Math.PI - .35); g.stroke();
    }
  }
  function torso(g, cfg, f, sw) {
    const c = cfg.ust, cd = shade(c, -.18), sk = cfg.ten;
    // kollar
    const arm = (s, back) => { const a = s * (sw * .5); g.save(); g.translate(s * 15, 22); g.rotate(a + (cfg._fish && s === 1 ? -1.1 : 0) + (cfg._wave && s === 1 ? -2.4 + Math.sin(Date.now() / 120) * .35 : 0));
      blob(g, back ? cd : c, () => rr(g, -5.5, -2, 11, 17, 5.5)); blob(g, sk, () => g.arc(0, 17, 5, 0, 7)); g.restore(); };
    if (f === 0 || f === 2) { arm(-1); arm(1); }
    else arm(-f, true);
    if (cfg.ustT === 'elbise') blob(g, c, () => { g.moveTo(-12, 16); g.lineTo(12, 16); g.lineTo(19, 44); g.quadraticCurveTo(0, 49, -19, 44); g.closePath(); });
    else blob(g, c, () => rr(g, -14, 16, 28, 26, 9));
    if (cfg.ustT === 'kapusonlu' && f !== 2) { g.fillStyle = cd; g.beginPath(); g.ellipse(0, 36, 8, 4, 0, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-4, 18); g.lineTo(-5, 28); g.moveTo(4, 18); g.lineTo(5, 28); g.stroke(); }
    if (cfg.ustT === 'ceket' && f !== 2) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(-6, 16); g.lineTo(0, 30); g.lineTo(6, 16); g.fill(); g.strokeStyle = OL; g.lineWidth = 1.6; g.beginPath(); g.moveTo(0, 30); g.lineTo(0, 42); g.stroke(); }
    if (cfg.ustT === 'yelek') { g.fillStyle = '#6a7a3a'; g.strokeStyle = OL; g.lineWidth = 1.6; for (const s of [-1, 1]) { g.beginPath(); rr(g, s * 4 - (s < 0 ? 10 : 0), 18, 10, 22, 3); g.fill(); g.stroke(); g.fillStyle = '#4a5a2a'; g.fillRect(s * 4 - (s < 0 ? 8 : -2), 28, 6, 5); g.fillStyle = '#6a7a3a'; } }
    if (cfg.ustT === 'tisort' && f !== 2) { g.fillStyle = '#fff'; g.font = '900 10px Nunito,sans-serif'; g.textAlign = 'center'; g.fillText(cfg.logo || '🦆', 0, 34); }
    if (f === 1 || f === -1) arm(f);
  }
  function legs(g, cfg, f, ph, sit) {
    const c = cfg.alt, sh = cfg.ayak;
    if (sit) { for (const s of [-1, 1]) { blob(g, c, () => rr(g, s * 7 - 6 + (f || 0) * 4, 38, 12, 9, 4)); blob(g, sh, () => g.ellipse(s * 7 + (f || 0) * 12, 46, 6.5, 5, 0, 0, 7)); } return; }
    for (const s of [-1, 1]) {
      const off = f === 0 || f === 2 ? 0 : Math.sin(ph) * 7 * s, lift = Math.max(0, Math.sin(ph) * s) * 3 * (f === 0 || f === 2 ? 1 : 0);
      blob(g, c, () => rr(g, s * 7 - 6 + off, 38 - lift, 12, 12, 4));
      blob(g, sh, () => g.ellipse(s * 7 + off + (f === 1 ? 2 : f === -1 ? -2 : 0), 51 - lift, 7.5, 5, 0, 0, 7));
    }
  }
  function head(g, cfg, f, blink) {
    const hr = HAIR[cfg.sac] || HAIR.kirpi;
    hr.back(g, cfg.sacR, f);
    if (cfg.sapka === 'kulaklik' && (f === 2)) HAT.kulaklik.draw(g, cfg.sapkaR, f);
    blob(g, cfg.ten, () => g.ellipse(0, -24, 33, 31, 0, 0, 7), 2.4);
    if (f !== 2) {
      g.fillStyle = 'rgba(255,120,150,.35)'; for (const x of f === 0 ? [-20, 20] : [f * 20]) { g.beginPath(); g.ellipse(x, -4, 6, 3.5, 0, 0, 7); g.fill(); }
      drawEyes(g, cfg, f, blink); drawMouth(g, cfg, f);
      if (cfg.aks === 'yara') { g.save(); g.translate(f === 0 ? 18 : f * 4, -6); g.rotate(-.4); blob(g, '#f6d5a8', () => rr(g, -7, -3, 14, 6, 3), 1.4); g.restore(); }
    }
    hr.front(g, cfg.sacR, f);
    const H = HAT[cfg.sapka]; if (H && H.draw && !(cfg.sapka === 'kulaklik' && f === 2)) H.draw(g, cfg.sapkaR, f);
    if (f !== 2 && (cfg.aks === 'gozluk' || cfg.aks === 'yuvarlak')) {
      const xs = f === 0 ? [-13, 13] : [f * 12];
      if (cfg.aks === 'gozluk') { for (const x of xs) blob(g, '#1a1424', () => rr(g, x - 10, -24, 20, 13, 5), 1.6); g.fillStyle = 'rgba(255,255,255,.55)'; for (const x of xs) g.fillRect(x - 6, -21, 5, 2); if (f === 0) { g.strokeStyle = '#1a1424'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-3, -20); g.lineTo(3, -20); g.stroke(); } }
      else { g.strokeStyle = '#3a2a2a'; g.lineWidth = 2; for (const x of xs) { g.beginPath(); g.arc(x, -16, 10, 0, 7); g.stroke(); } if (f === 0) { g.beginPath(); g.moveTo(-3, -17); g.lineTo(3, -17); g.stroke(); } }
    }
  }
  function draw(g, cfg, x, y, sc = 1, o = {}) {
    const t = o.t != null ? o.t : performance.now() / 1000, dir = o.dir || 's', anim = o.anim || 'idle';
    const f = { s: 0, n: 2, e: 1, w: -1 }[dir];
    const walk = anim === 'walk', ph = t * 11, bob = walk ? Math.abs(Math.sin(ph)) * 3 : Math.sin(t * 2.4) * 1.2, sw = walk ? Math.sin(ph) : 0;
    const blink = (t % 3.7) < .12;
    const C = Object.assign({}, cfg, { _fish: anim === 'fish', _wave: anim === 'wave' });
    g.save(); g.translate(x, y); g.scale(sc, sc);
    g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(0, 54, 22, 6, 0, 0, 7); g.fill();
    g.translate(0, (anim === 'sit' ? 8 : 0) - bob);
    if (cfg.aks === 'atki' && f === 2) blob(g, cfg.aksR || '#e0405a', () => rr(g, 6, 14, 9, 22, 4));
    if (f === 2) { head(g, C, f, blink); legs(g, C, f, ph, anim === 'sit'); torso(g, C, f, sw); }
    else { legs(g, C, f, ph, anim === 'sit'); torso(g, C, f, sw); }
    if (cfg.aks === 'atki') { blob(g, cfg.aksR || '#e0405a', () => rr(g, -16, 10, 32, 10, 5)); if (f !== 2) blob(g, cfg.aksR || '#e0405a', () => rr(g, f === 0 ? 4 : -f * 6, 14, 9, 20, 4)); }
    if (f !== 2) { g.save(); g.translate(0, 1); g.rotate(walk ? Math.sin(ph) * .03 : 0); head(g, C, f, blink); g.restore(); }
    g.restore();
  }
  const COLORS = {
    ten: ['#ffe3d0', '#ffd2b4', '#f2b98e', '#d9955f', '#a8693f', '#7a4a2a', '#c8f0d8', '#d8d0ff'],
    sac: ['#2a1a22', '#5a3220', '#8a4a2a', '#d8823a', '#f6cf5a', '#f4f0e8', '#ff8ac2', '#a06bff', '#4ab8ff', '#3ad08a', '#ff4a4a', '#30304a'],
    goz: ['#4a2a1a', '#2a7ad8', '#3ab06a', '#a050e0', '#e0304a', '#f0a020', '#30c8d8', '#ff6fae'],
    giysi: ['#ff6fae', '#ff5a4a', '#ffa03a', '#ffd84a', '#7ad86a', '#3ab0a0', '#4a90ff', '#7a5aff', '#2a2a3a', '#f4f4f4', '#8a5a3a', '#ff9ad8'],
  };
  window.Chibi = { draw, HAIR, HAT, EYES, MOUTH, TOP, ACC, COLORS, shade };
})();
