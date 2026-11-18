// Ördekez karakter stil denemeleri: A = Sticker Kawaii, B = Ada (yumuşak), C = Çizgi Film Havalı
(function () {
  const hx = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (c, d, k) => { const a = hx(c), b = hx(d); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const dk = (c, k) => mix(c, '#1a0a2a', k), lt = (c, k) => mix(c, '#ffffff', k);
  const rr = (g, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };

  // ---- ortak saç şekilleri (kafa merkezi 0,0  yarıçap ~36) ----
  const HAIR = {
    kirpi: {
      back: g => { const n = 13; for (let i = 0; i <= n; i++) { const a = Math.PI * .92 + i / n * Math.PI * 1.16, r = i % 2 ? 38 : 50; const x = Math.cos(a) * r, y = -4 + Math.sin(a) * r * .95; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.lineTo(40, 14); g.lineTo(-40, 14); g.closePath(); },
      front: g => { g.moveTo(-38, 2); g.quadraticCurveTo(-40, -40, 0, -40); g.quadraticCurveTo(40, -40, 38, 2); g.lineTo(31, -8); g.lineTo(26, 4); g.lineTo(18, -14); g.lineTo(10, -2); g.lineTo(2, -18); g.lineTo(-7, -3); g.lineTo(-15, -16); g.lineTo(-22, 0); g.lineTo(-29, -10); g.closePath(); },
    },
    uzun: {
      back: g => { g.moveTo(-38, -8); g.quadraticCurveTo(-38, -44, 0, -44); g.quadraticCurveTo(38, -44, 38, -8); g.quadraticCurveTo(48, 30, 40, 62); g.quadraticCurveTo(30, 72, 18, 64); g.lineTo(-18, 64); g.quadraticCurveTo(-30, 72, -40, 62); g.quadraticCurveTo(-48, 30, -38, -8); },
      front: g => { g.moveTo(-38, 10); g.quadraticCurveTo(-42, -40, 0, -40); g.quadraticCurveTo(40, -40, 38, 10); g.quadraticCurveTo(30, -6, 26, -18); g.quadraticCurveTo(10, -6, -6, -10); g.quadraticCurveTo(-12, -14, -14, -22); g.quadraticCurveTo(-24, -6, -30, -6); g.quadraticCurveTo(-34, 0, -38, 10); },
    },
    topuz: {
      back: g => { g.arc(0, -46, 17, 0, 7); g.moveTo(37, -4); g.arc(0, -4, 37, 0, Math.PI, true); g.closePath(); },
      front: g => { g.moveTo(-38, 4); g.quadraticCurveTo(-40, -40, 0, -40); g.quadraticCurveTo(40, -40, 38, 4); g.quadraticCurveTo(30, -18, 4, -20); g.lineTo(0, -12); g.lineTo(-4, -20); g.quadraticCurveTo(-30, -18, -38, 4); },
    },
    kisa: {
      back: g => { g.moveTo(37, 0); g.arc(0, -2, 37, 0, Math.PI, true); g.closePath(); },
      front: g => { g.moveTo(-36, -2); g.quadraticCurveTo(-36, -38, 0, -38); g.quadraticCurveTo(36, -38, 36, -2); g.quadraticCurveTo(20, -16, 0, -14); g.quadraticCurveTo(-20, -16, -36, -2); },
    },
  };
  const HOOD = { back: g => g.arc(0, -2, 47, 0, 7), rim: g => { g.arc(0, 2, 47, 0, 7); g.arc(0, 4, 36, 0, 7, true); } };

  // ---- stillerin boyama yöntemi ----
  const S = {};
  // A: sticker kawaii — renkli ince kontur, düz renk + yumuşak gölge, dışında beyaz sticker kenarı
  S.A = {
    head: 1.05, P(g, c, path, o = {}) { g.beginPath(); path(g); const gr = g.createLinearGradient(0, o.y0 ?? -40, 0, o.y1 ?? 40); gr.addColorStop(0, lt(c, .12)); gr.addColorStop(1, dk(c, .1)); g.fillStyle = gr; g.fill(o.rule || 'nonzero'); g.strokeStyle = dk(c, .55); g.lineWidth = 2.2; g.lineJoin = 'round'; g.stroke(); },
    shine(g, c, path) { g.save(); g.beginPath(); path(g); g.clip(); g.strokeStyle = lt(c, .55); g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.arc(0, 4, 32, Math.PI * 1.2, Math.PI * 1.45); g.stroke(); g.beginPath(); g.arc(0, 4, 32, Math.PI * 1.55, Math.PI * 1.62); g.stroke(); g.restore(); },
    eyes(g, C) {
      for (const s of [-1, 1]) { const x = s * 14, y = 6;
        g.fillStyle = '#2a1430'; g.beginPath(); g.ellipse(x, y, 8.5, 11.5, 0, 0, 7); g.fill();
        const gr = g.createLinearGradient(0, y - 8, 0, y + 11); gr.addColorStop(0, dk(C.goz, .3)); gr.addColorStop(1, lt(C.goz, .35)); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y + 1.5, 7, 9.5, 0, 0, 7); g.fill();
        g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x - 2.5 * s, y - 4, 3.4, 4.2, 0, 0, 7); g.fill(); g.beginPath(); g.arc(x + 3 * s, y + 5, 1.8, 0, 7); g.fill();
        g.strokeStyle = '#2a1430'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 9, y - 9); g.quadraticCurveTo(x, y - 14, x + 9, y - 9); g.stroke(); g.lineWidth = 2.2; g.beginPath(); g.moveTo(x + s * 8, y - 9); g.lineTo(x + s * 12, y - 12); g.stroke(); }
    },
    mouth(g) { g.strokeStyle = '#5a1a2a'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.arc(-3, 21, 3, .2, Math.PI - .2); g.arc(3, 21, 3, .2, Math.PI - .2); g.stroke(); },
    cheeks(g) { for (const s of [-1, 1]) { g.fillStyle = 'rgba(255,110,150,.45)'; g.beginPath(); g.ellipse(s * 24, 18, 7, 4, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.2; g.beginPath(); for (let i = 0; i < 3; i++) { g.moveTo(s * 21 + i * 3 - 3, 20); g.lineTo(s * 22 + i * 3 - 3, 16); } g.stroke(); } },
    body(g, C, t) {
      const sw = Math.sin(t * 3) * .08;
      for (const s of [-1, 1]) { this.P(g, C.alt, g2 => rr(g2, s * 8 - 6, -22, 12, 15, 5), { y0: -22, y1: -6 }); this.P(g, C.ayak, g2 => g2.ellipse(s * 9, -5, 9, 5.5, 0, 0, 7), { y0: -10, y1: 0 }); }
      for (const s of [-1, 1]) { g.save(); g.translate(s * 15, -42); g.rotate(s * (.25 + sw)); this.P(g, C.ust, g2 => rr(g2, -5.5, -2, 11, 16, 5.5), { y0: -2, y1: 14 }); this.P(g, C.ten, g2 => g2.arc(0, 15, 5, 0, 7), { y0: 10, y1: 20 }); g.restore(); }
      this.P(g, C.ust, g2 => { g2.moveTo(-13, -46); g2.lineTo(13, -46); g2.quadraticCurveTo(18, -30, 17, -20); g2.quadraticCurveTo(0, -16, -17, -20); g2.quadraticCurveTo(-18, -30, -13, -46); }, { y0: -46, y1: -18 });
      g.fillStyle = lt(C.ust, .55); g.beginPath(); g.arc(0, -32, 4.5, 0, 7); g.fill(); g.fillStyle = '#ff6f9f'; g.beginPath(); g.moveTo(0, -30); g.bezierCurveTo(-5, -34, -2, -37, 0, -34.5); g.bezierCurveTo(2, -37, 5, -34, 0, -30); g.fill();
    },
    after(g, cv) { // beyaz sticker kenarı
      const w = cv.width, h = cv.height, o = new OffscreenCanvas(w, h), x = o.getContext('2d'); x.drawImage(cv, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#fff'; x.fillRect(0, 0, w, h);
      g.save(); g.shadowColor = 'rgba(60,20,90,.35)'; g.shadowBlur = 10; g.shadowOffsetY = 5; for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; g.drawImage(o, Math.cos(a) * 6, Math.sin(a) * 6); } g.restore(); g.drawImage(cv, 0, 0);
    },
  };
  // B: ada — konturu yok, yumuşak hacim, nokta gözler
  S.B = {
    head: 1.12, P(g, c, path, o = {}) { g.beginPath(); path(g); const gr = g.createRadialGradient(-10, (o.y0 ?? -40) + 10, 4, 0, ((o.y0 ?? -40) + (o.y1 ?? 40)) / 2, Math.max(30, ((o.y1 ?? 40) - (o.y0 ?? -40)) * .8)); gr.addColorStop(0, lt(c, .22)); gr.addColorStop(.6, c); gr.addColorStop(1, dk(c, .16)); g.fillStyle = gr; g.fill(o.rule || 'nonzero'); },
    shine(g, c, path) { g.save(); g.beginPath(); path(g); g.clip(); g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.ellipse(-12, -26, 16, 6, -.4, 0, 7); g.fill(); g.restore(); },
    eyes(g, C) { for (const s of [-1, 1]) { const x = s * 13, y = 6; g.fillStyle = '#1e1428'; g.beginPath(); g.ellipse(x, y, 4.6, 6.6, 0, 0, 7); g.fill(); g.fillStyle = C.goz; g.globalAlpha = .6; g.beginPath(); g.ellipse(x, y + 3, 3.2, 2.6, 0, 0, 7); g.fill(); g.globalAlpha = 1; g.fillStyle = '#fff'; g.beginPath(); g.arc(x - 1.5, y - 2.5, 1.8, 0, 7); g.fill(); g.strokeStyle = 'rgba(40,20,40,.55)'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 4, y - 11); g.lineTo(x + 4, y - 11.5); g.stroke(); } },
    mouth(g) { g.fillStyle = '#7a2a3a'; g.beginPath(); g.moveTo(-5, 17); g.quadraticCurveTo(0, 25, 5, 17); g.closePath(); g.fill(); g.fillStyle = '#ff8a9a'; g.beginPath(); g.ellipse(0, 20.5, 2.5, 1.4, 0, 0, 7); g.fill(); },
    cheeks(g) { for (const s of [-1, 1]) { const gr = g.createRadialGradient(s * 23, 15, 0, s * 23, 15, 8); gr.addColorStop(0, 'rgba(255,120,140,.55)'); gr.addColorStop(1, 'rgba(255,120,140,0)'); g.fillStyle = gr; g.beginPath(); g.arc(s * 23, 15, 8, 0, 7); g.fill(); } g.fillStyle = 'rgba(160,80,60,.25)'; g.beginPath(); g.ellipse(0, 12, 2.5, 1.6, 0, 0, 7); g.fill(); },
    body(g, C, t) {
      const sw = Math.sin(t * 3) * .08;
      for (const s of [-1, 1]) { this.P(g, C.alt, g2 => rr(g2, s * 7 - 6.5, -20, 13, 13, 6), { y0: -20, y1: -6 }); this.P(g, C.ayak, g2 => g2.ellipse(s * 8, -5, 8, 5, 0, 0, 7), { y0: -10, y1: 0 }); }
      this.P(g, C.ust, g2 => { g2.moveTo(-12, -46); g2.quadraticCurveTo(0, -50, 12, -46); g2.quadraticCurveTo(22, -24, 18, -16); g2.quadraticCurveTo(0, -12, -18, -16); g2.quadraticCurveTo(-22, -24, -12, -46); }, { y0: -48, y1: -14 });
      for (const s of [-1, 1]) { g.save(); g.translate(s * 13, -42); g.rotate(s * (.35 + sw)); this.P(g, C.ust, g2 => rr(g2, -5, -2, 10, 15, 5), { y0: -2, y1: 13 }); this.P(g, C.ten, g2 => g2.arc(0, 14, 4.6, 0, 7), { y0: 9, y1: 19 }); g.restore(); }
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-6, -44); g.quadraticCurveTo(0, -38, 6, -44); g.stroke();
    },
  };
  // C: çizgi film havalı — kalın siyah kontur, sert gölge, yarı kapalı gözler
  S.C = {
    head: 1, P(g, c, path, o = {}) { g.beginPath(); path(g); g.fillStyle = c; g.fill(o.rule || 'nonzero'); g.save(); g.clip(); g.translate(7, 6); g.beginPath(); path(g); g.rect(-400, -400, 800, 800); g.fillStyle = dk(c, .22); g.fill('evenodd'); g.restore(); g.beginPath(); path(g); g.strokeStyle = '#141018'; g.lineWidth = 3.4; g.lineJoin = 'round'; g.stroke(); },
    shine(g, c, path) { g.save(); g.beginPath(); path(g); g.clip(); g.fillStyle = lt(c, .45); g.beginPath(); g.moveTo(-26, -22); g.lineTo(-8, -32); g.lineTo(-4, -28); g.lineTo(-22, -16); g.closePath(); g.fill(); g.restore(); },
    eyes(g, C) {
      for (const s of [-1, 1]) { const x = s * 14, y = 6;
        g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, 9, 10, 0, 0, 7); g.fill(); g.strokeStyle = '#141018'; g.lineWidth = 2.6; g.stroke();
        g.fillStyle = C.goz; g.beginPath(); g.arc(x + 2, y + 2, 5.5, 0, 7); g.fill(); g.fillStyle = '#141018'; g.beginPath(); g.arc(x + 2, y + 2, 2.8, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x + .5, y, 1.4, 0, 7); g.fill();
        g.save(); g.beginPath(); g.ellipse(x, y, 9, 10, 0, 0, 7); g.clip(); g.fillStyle = C.ten; g.fillRect(x - 10, y - 11, 20, s < 0 ? 8 : 10); g.restore();
        g.strokeStyle = '#141018'; g.lineWidth = 3.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 10, y + (s < 0 ? -3 : -1)); g.lineTo(x + 10, y + (s < 0 ? -3 : -1)); g.stroke();
        g.lineWidth = 4; g.beginPath(); g.moveTo(x - 9, y - (s < 0 ? 12 : 16)); g.lineTo(x + 9, y - (s < 0 ? 10 : 13)); g.stroke(); }
    },
    mouth(g) { g.strokeStyle = '#141018'; g.lineWidth = 2.8; g.lineCap = 'round'; g.beginPath(); g.moveTo(-7, 21); g.quadraticCurveTo(2, 24, 9, 17); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(3, 21.5); g.lineTo(7, 19.5); g.lineTo(6, 22.5); g.closePath(); g.fill(); },
    cheeks(g) { g.strokeStyle = 'rgba(20,16,24,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-1, 10); g.lineTo(-3, 14); g.lineTo(0, 14); g.stroke(); },
    body(g, C, t) {
      const sw = Math.sin(t * 3) * .06;
      for (const s of [-1, 1]) { this.P(g, C.alt, g2 => rr(g2, s * 8 - 6.5, -26, 13, 20, 3)); this.P(g, C.ayak, g2 => { g2.moveTo(s * 8 - 9, -2); g2.lineTo(s * 8 - 9, -8); g2.quadraticCurveTo(s * 8, -12, s * 8 + 10, -6); g2.lineTo(s * 8 + 11, -2); g2.closePath(); }); g.fillStyle = '#fff'; g.fillRect(s * 8 - 8, -4.5, 18, 2.4); }
      for (const s of [-1, 1]) { g.save(); g.translate(s * 16, -48); g.rotate(s * (.18 + sw)); this.P(g, C.ust, g2 => rr(g2, -5.5, -2, 11, 20, 4)); this.P(g, C.ten, g2 => g2.arc(0, 20, 5.2, 0, 7)); g.restore(); }
      this.P(g, C.ust, g2 => rr(g2, -16, -52, 32, 30, 6));
      g.fillStyle = '#141018'; g.font = 'bold 13px system-ui'; g.textAlign = 'center'; g.fillText('Ö', 0, -32);
    },
  };

  function backPart(g, st, C) { const P = st.P.bind(st); if (C.sapka === 'ordek') P(g, '#ffd23f', HOOD.back, { y0: -50, y1: 40 }); else P(g, C.sacR, (HAIR[C.sac] || HAIR.kisa).back, { y0: -50, y1: 60 }); }
  function headPart(g, st, C) {
    const P = st.P.bind(st), hood = C.sapka === 'ordek', H = HAIR[C.sac] || HAIR.kisa;
    if (!hood) for (const s of [-1, 1]) P(g, C.ten, g2 => g2.ellipse(s * 35, 6, 6, 8, 0, 0, 7), { y0: -4, y1: 14 });
    P(g, C.ten, g2 => g2.ellipse(0, 2, 37, 34, 0, 0, 7), { y0: -34, y1: 36 });
    st.cheeks(g); st.eyes(g, C); st.mouth(g);
    if (hood) {
      P(g, C.sacR, HAIR.kisa.front, { y0: -40, y1: 0 });
      P(g, '#ffd23f', HOOD.rim, { y0: -50, y1: 50, rule: 'evenodd' });
      P(g, '#ff8a1c', g2 => { g2.ellipse(0, -40, 15, 6.5, 0, 0, 7); }, { y0: -46, y1: -34 });
      for (const s of [-1, 1]) { g.fillStyle = '#141018'; g.beginPath(); g.ellipse(s * 13, -50, 3.2, 4.2, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(s * 13 - 1, -51.5, 1.2, 0, 7); g.fill(); }
    } else { P(g, C.sacR, H.front, { y0: -40, y1: 10 }); st.shine(g, C.sacR, H.front); }
    if (C.aks === 'kulaklik') { P(g, '#2a2a3a', g2 => { g2.arc(0, 0, 44, Math.PI * 1.08, Math.PI * 1.92); g2.arc(0, 0, 39, Math.PI * 1.92, Math.PI * 1.08, true); g2.closePath(); }); for (const s of [-1, 1]) P(g, C.ust, g2 => rr(g2, s * 41 - 8, -8, 16, 26, 7)); }
  }

  function draw(g, style, C, x, y, sc = 1, t = 0) {
    const st = S[style], bob = Math.sin(t * 2.6) * 1.5;
    const one = (gg) => { gg.save(); gg.translate(x, y); gg.scale(sc, sc);
      if (style !== 'A') { gg.fillStyle = 'rgba(40,20,60,.2)'; gg.beginPath(); gg.ellipse(0, 0, 24, 6, 0, 0, 7); gg.fill(); }
      gg.translate(0, -bob);
      const HY = -97, toHead = () => { gg.save(); gg.translate(0, HY); gg.scale(st.head, st.head); };
      toHead(); backPart(gg, st, C); gg.restore();
      st.P(gg, C.ten, g2 => rr(g2, -5.5, -60, 11, 17, 4), { y0: -60, y1: -44 }); gg.fillStyle = 'rgba(80,30,40,.18)'; gg.fillRect(-5, -57, 10, 5);
      st.body(gg, C, t); toHead(); headPart(gg, st, C); gg.restore(); gg.restore(); };
    if (st.after) { const cv = new OffscreenCanvas(g.canvas.width, g.canvas.height), x2 = cv.getContext('2d'); x2.setTransform(g.getTransform()); one(x2); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); st.after(g, cv); g.restore(); }
    else one(g);
  }
  window.Stil = { draw, HAIR };
})();
