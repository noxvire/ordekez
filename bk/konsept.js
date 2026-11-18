// Ördekez karakter konsept denemeleri: ordek, jelibon, blok, slime
(function () {
  const hx = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (c, d, k) => { const a = hx(c), b = hx(d); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const dk = (c, k) => mix(c, '#1a0a2a', k), lt = (c, k) => mix(c, '#ffffff', k);
  const rr = (g, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  function P(g, c, path, o = {}) { g.beginPath(); path(g); const gr = g.createLinearGradient(0, o.y0 ?? -60, 0, o.y1 ?? 0); gr.addColorStop(0, lt(c, .18)); gr.addColorStop(1, dk(c, .12)); g.fillStyle = o.flat ? c : gr; g.fill(); if (o.lw !== 0) { g.strokeStyle = o.sc || dk(c, .6); g.lineWidth = o.lw || 2.6; g.lineJoin = 'round'; g.stroke(); } }
  const shadow = (g, w) => { g.fillStyle = 'rgba(40,20,60,.2)'; g.beginPath(); g.ellipse(0, 0, w, w * .25, 0, 0, 7); g.fill(); };
  const eye = (g, x, y, rx, ry, blink) => { if (blink) { g.strokeStyle = '#1a1020'; g.lineWidth = 2.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - rx, y); g.lineTo(x + rx, y); g.stroke(); return; } g.fillStyle = '#1a1020'; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x - rx * .35, y - ry * .4, rx * .45, 0, 7); g.fill(); g.beginPath(); g.arc(x + rx * .3, y + ry * .35, rx * .2, 0, 7); g.fill(); };

  // ortak aksesuarlar (kafa üstü merkezli: x, y = kafanın tepesi)
  function hat(g, k, x, y, s = 1, c) {
    g.save(); g.translate(x, y); g.scale(s, s);
    if (k === 'kep') { P(g, c, g2 => { g2.moveTo(-18, 2); g2.quadraticCurveTo(-18, -18, 0, -18); g2.quadraticCurveTo(18, -18, 18, 2); g2.closePath(); }, { y0: -18, y1: 2 }); P(g, dk(c, .1), g2 => g2.ellipse(10, 2, 16, 4.5, 0, 0, 7), { y0: -2, y1: 6 }); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, -10, 4, 0, 7); g.fill(); }
    if (k === 'tac') { P(g, '#ffd23f', g2 => { g2.moveTo(-15, 2); g2.lineTo(-17, -16); g2.lineTo(-8, -7); g2.lineTo(0, -20); g2.lineTo(8, -7); g2.lineTo(17, -16); g2.lineTo(15, 2); g2.closePath(); }, { y0: -20, y1: 2 }); for (const [a, b, cc] of [[-9, -4, '#ff4f8a'], [0, -5, '#4ab0ff'], [9, -4, '#3ad09a']]) { g.fillStyle = cc; g.beginPath(); g.arc(a, b, 2.6, 0, 7); g.fill(); } }
    if (k === 'bere') { P(g, c, g2 => { g2.moveTo(-18, 2); g2.quadraticCurveTo(-20, -20, 0, -20); g2.quadraticCurveTo(20, -20, 18, 2); g2.closePath(); }, { y0: -20, y1: 2 }); P(g, lt(c, .5), g2 => g2.arc(0, -21, 6, 0, 7)); g.strokeStyle = dk(c, .25); g.lineWidth = 2; for (let i = -12; i <= 12; i += 6) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i * .8, -14); g.stroke(); } }
    if (k === 'cicek') { for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; P(g, c, g2 => g2.ellipse(Math.cos(a) * 6, -6 + Math.sin(a) * 6, 5, 5, 0, 0, 7), { lw: 1.6 }); } P(g, '#ffd23f', g2 => g2.arc(0, -6, 4, 0, 7), { lw: 1.6 }); }
    if (k === 'balikci') { P(g, c, g2 => { g2.moveTo(-26, 2); g2.quadraticCurveTo(0, -4, 26, 2); g2.quadraticCurveTo(0, 8, -26, 2); }, { y0: -4, y1: 8 }); P(g, c, g2 => { g2.moveTo(-15, 0); g2.quadraticCurveTo(-14, -16, 0, -16); g2.quadraticCurveTo(14, -16, 15, 0); g2.closePath(); }, { y0: -16, y1: 0 }); g.fillStyle = dk(c, .3); g.fillRect(-15, -5, 30, 3); P(g, '#ff8a3a', g2 => { g2.moveTo(8, -9); g2.lineTo(15, -12); g2.lineTo(15, -6); g2.closePath(); g2.ellipse(5, -9, 4, 2.5, 0, 0, 7); }, { lw: 1.2 }); }
    g.restore();
  }
  const glasses = (g, x, y, s = 1) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#141018'; for (const d of [-1, 1]) { g.beginPath(); rr(g, d * 9 - 7.5, -5, 15, 10, 4); g.fill(); } g.fillRect(-2, -3, 4, 2); g.fillStyle = 'rgba(255,255,255,.6)'; for (const d of [-1, 1]) { g.beginPath(); g.moveTo(d * 9 - 4, -3); g.lineTo(d * 9 - 1, -3); g.lineTo(d * 9 - 4, 2); g.closePath(); g.fill(); } g.restore(); };

  // 1) ÖRDEK
  function ordek(g, C, t) {
    const bob = Math.abs(Math.sin(t * 2.6)) * 2, fl = Math.sin(t * 6) * .15, bl = (t % 3.7) < .12;
    shadow(g, 22);
    for (const s of [-1, 1]) P(g, '#ff9a2a', g2 => { g2.moveTo(s * 9 - 8, -1); g2.quadraticCurveTo(s * 9, -6, s * 9 + 8, -1); g2.quadraticCurveTo(s * 9, 2, s * 9 - 8, -1); }, { y0: -6, y1: 2, lw: 2 });
    g.translate(0, -bob);
    if (C.kuyruk) P(g, C.renk, g2 => { g2.moveTo(-12, -22); g2.lineTo(-30, -36); g2.lineTo(-18, -14); g2.closePath(); });
    P(g, C.renk, g2 => g2.ellipse(0, -22, 25, 21, 0, 0, 7), { y0: -44, y1: 0 });
    P(g, lt(C.renk, .5), g2 => g2.ellipse(0, -17, 15, 13, 0, 0, 7), { y0: -30, y1: -4, lw: 0 });
    for (const s of [-1, 1]) { g.save(); g.translate(s * 22, -26); g.rotate(s * (.35 + fl)); P(g, C.kanat || dk(C.renk, .08), g2 => g2.ellipse(0, 6, 7, 12, 0, 0, 7), { y0: -6, y1: 18 }); g.restore(); }
    if (C.atki) { P(g, C.atki, g2 => rr(g2, -17, -42, 34, 8, 4), { y0: -42, y1: -34 }); P(g, C.atki, g2 => rr(g2, 6, -38, 8, 16, 3), { y0: -38, y1: -22 }); }
    P(g, C.kafa || C.renk, g2 => g2.arc(0, -58, 21, 0, 7), { y0: -79, y1: -37 });
    if (C.halka) { g.fillStyle = '#fff'; g.fillRect(-18, -40, 36, 3.5); }
    g.fillStyle = 'rgba(255,120,150,.4)'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * 13, -50, 4.5, 2.6, 0, 0, 7); g.fill(); }
    if (C.gozluk) glasses(g, 0, -60, .9); else for (const s of [-1, 1]) eye(g, s * 8, -61, 3.6, 4.6, bl);
    P(g, '#ff9a2a', g2 => g2.ellipse(0, -48, 10, 4, 0, 0, 7), { y0: -52, y1: -44, lw: 2 }); g.strokeStyle = dk('#ff9a2a', .5); g.lineWidth = 1.4; g.beginPath(); g.moveTo(-8, -48); g.quadraticCurveTo(0, -46, 8, -48); g.stroke();
    if (C.sapka) hat(g, C.sapka, 0, -74, .95, C.sapkaR);
    if (C.tuy) P(g, C.kafa || C.renk, g2 => { g2.moveTo(-2, -78); g2.quadraticCurveTo(-6, -88, 2, -90); g2.quadraticCurveTo(0, -84, 4, -78); g2.closePath(); }, { lw: 2 });
  }

  // 2) JELİBON
  function jelibon(g, C, t) {
    const sw = Math.sin(t * 5), bob = Math.abs(sw) * 2.5, bl = (t % 3.3) < .12;
    shadow(g, 20);
    for (const s of [-1, 1]) P(g, dk(C.renk, .1), g2 => rr(g2, s * 9 - 6, -12 + (s * sw > 0 ? -2 : 0), 12, 12, 6), { y0: -12, y1: 0 });
    g.translate(0, -bob);
    for (const s of [-1, 1]) { g.save(); g.translate(s * 21, -38); g.rotate(s * (.5 + sw * .2)); P(g, C.renk, g2 => rr(g2, -5, -2, 10, 17, 5), { y0: -2, y1: 15 }); g.restore(); }
    const body = g2 => rr(g2, -22, -80, 44, 72, 22);
    P(g, C.renk, body, { y0: -80, y1: -8 });
    g.save(); g.beginPath(); body(g); g.clip();
    if (C.desen === 'cizgi') { g.fillStyle = C.desenR; for (let y = -30; y < -8; y += 10) g.fillRect(-30, y, 60, 5); }
    if (C.desen === 'yildiz') { g.fillStyle = C.desenR; g.font = '12px system-ui'; g.textAlign = 'center'; for (const [x, y] of [[-10, -22], [9, -16], [0, -30], [-14, -38]]) g.fillText('★', x, y); }
    if (C.desen === 'yarim') { g.fillStyle = C.desenR; g.fillRect(-30, -36, 60, 40); }
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(-12, -64, 5, 10, -.3, 0, 7); g.fill(); g.restore();
    g.beginPath(); body(g); g.strokeStyle = dk(C.renk, .6); g.lineWidth = 2.6; g.stroke();
    P(g, '#fffaf4', g2 => rr(g2, -15, -66, 30, 20, 10), { y0: -66, y1: -46, sc: dk(C.renk, .5), lw: 2 });
    for (const s of [-1, 1]) eye(g, s * 6.5, -57, 3.4, 4.6, bl);
    g.strokeStyle = '#1a1020'; g.lineWidth = 1.8; g.lineCap = 'round'; g.beginPath(); g.arc(0, -52, 2.6, .3, Math.PI - .3); g.stroke();
    if (C.gozluk) glasses(g, 0, -57, .75);
    if (C.sapka) hat(g, C.sapka, 0, -78, 1, C.sapkaR);
  }

  // 3) BLOK (izometrik voxel)
  const IS = .866;
  function cube(g, x, y, z, w, h, d, c, faceFn) {
    const p = (X, Y, Z) => [(X - Z) * IS, (X + Z) * .5 - Y];
    const poly = (pts, col) => { g.beginPath(); pts.forEach((q, i) => { const [a, b] = p(...q); i ? g.lineTo(a, b) : g.moveTo(a, b); }); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = dk(c, .55); g.lineWidth = 1.4; g.lineJoin = 'round'; g.stroke(); };
    poly([[x, y + h, z], [x + w, y + h, z], [x + w, y + h, z + d], [x, y + h, z + d]], lt(c, .25));
    poly([[x, y, z + d], [x + w, y, z + d], [x + w, y + h, z + d], [x, y + h, z + d]], c);
    poly([[x + w, y, z], [x + w, y, z + d], [x + w, y + h, z + d], [x + w, y + h, z]], dk(c, .2));
    if (faceFn) { g.save(); const [ox, oy] = p(x, y, z + d); g.transform(IS, .5, 0, 1, ox, oy); faceFn(g); g.restore(); }
  }
  function blok(g, C, t) {
    const sw = Math.sin(t * 5) * 2.5, bob = Math.abs(Math.sin(t * 5)) * 2, bl = (t % 3.5) < .12;
    shadow(g, 26);
    g.translate(0, -bob);
    cube(g, -10, 0, -6, 8, 14 + sw * .3, 10, C.alt); cube(g, 2, 0, -6, 8, 14 - sw * .3, 10, C.alt);
    cube(g, -13, 14, -7, 26, 20, 12, C.ust);
    cube(g, -18, 20 + sw * .4, -4, 5, 14, 7, C.ust); cube(g, -18, 18 + sw * .4, -4, 5, 3, 7, C.ten);
    if (C.sac === 'uzun') cube(g, -16, 22, -13, 33, 34, 6, C.sacR);
    cube(g, -15, 34, -11, 30, 28, 22, C.ten, f => {
      const y0 = -28; for (const x of [7, 19]) { if (bl) { f.fillStyle = '#1a1020'; f.fillRect(x, y0 + 12, 6, 2); } else { f.fillStyle = '#1a1020'; f.fillRect(x, y0 + 8, 5, 7); f.fillStyle = '#fff'; f.fillRect(x, y0 + 8, 2, 2); } }
      f.fillStyle = 'rgba(255,110,150,.45)'; f.fillRect(3, y0 + 17, 5, 3); f.fillRect(22, y0 + 17, 5, 3);
      f.fillStyle = '#7a2a3a'; f.fillRect(12, y0 + 20, 6, 2); if (C.gozluk) { f.fillStyle = '#141018'; f.fillRect(4, y0 + 7, 10, 8); f.fillRect(16, y0 + 7, 10, 8); f.fillRect(13, y0 + 9, 4, 2); }
    });
    if (C.sac === 'kisa') { cube(g, -16, 56, -12, 32, 8, 24, C.sacR); cube(g, -16, 48, -12, 32, 8, 6, C.sacR); }
    if (C.sac === 'uzun') { cube(g, -16, 56, -12, 32, 8, 24, C.sacR); cube(g, 15, 24, -12, 3, 32, 20, C.sacR); cube(g, -12, 50, 11, 18, 6, 2, C.sacR); }
    if (C.sac === 'kirpi') { cube(g, -16, 56, -12, 32, 6, 24, C.sacR); for (const [a, b] of [[-14, -8], [-4, -2], [6, 4], [-10, 6]]) cube(g, a, 62, b, 8, 7, 8, C.sacR); }
    if (C.sapka === 'kep') { cube(g, -16, 60, -12, 32, 7, 24, C.sapkaR); cube(g, -16, 60, 12, 32, 2, 10, dk(C.sapkaR, .1)); }
    cube(g, 13, 20 - sw * .4, -4, 5, 14, 7, C.ust); cube(g, 13, 18 - sw * .4, -4, 5, 3, 7, C.ten);
  }

  // 4) SLIME
  function slime(g, C, t) {
    const sq = Math.sin(t * 4), bl = (t % 3.1) < .12, w = 30 + sq * 2.5, h = 44 - sq * 3;
    shadow(g, w * .9);
    const blob = g2 => { g2.moveTo(-w, -2); g2.bezierCurveTo(-w - 4, -h * .55, -w * .55, -h, 0, -h); g2.bezierCurveTo(w * .55, -h, w + 4, -h * .55, w, -2); g2.quadraticCurveTo(w * .6, 2, 0, 1); g2.quadraticCurveTo(-w * .6, 2, -w, -2); };
    g.save(); g.globalAlpha = .9;
    g.beginPath(); blob(g); const gr = g.createRadialGradient(-8, -h * .7, 3, 0, -h * .45, h); gr.addColorStop(0, lt(C.renk, .55)); gr.addColorStop(.55, C.renk); gr.addColorStop(1, dk(C.renk, .25)); g.fillStyle = gr; g.fill(); g.restore();
    if (C.icinde === 'balik') { g.save(); g.globalAlpha = .55; g.translate(10, -12); g.rotate(Math.sin(t) * .2); g.fillStyle = '#ff8a3a'; g.beginPath(); g.ellipse(0, 0, 7, 4, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(-6, 0); g.lineTo(-11, -4); g.lineTo(-11, 4); g.fill(); g.restore(); }
    if (C.icinde === 'yildiz') { g.globalAlpha = .6; g.fillStyle = '#fff6a0'; g.font = '14px system-ui'; g.fillText('★', 6, -8); g.globalAlpha = 1; }
    g.beginPath(); blob(g); g.strokeStyle = dk(C.renk, .5); g.lineWidth = 2.6; g.stroke();
    g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.ellipse(-w * .5, -h * .7, 5, 8, -.5, 0, 7); g.fill(); g.beginPath(); g.arc(-w * .3, -h * .86, 2.4, 0, 7); g.fill();
    for (const s of [-1, 1]) eye(g, s * 9, -h * .5, 4, 5.5, bl);
    g.fillStyle = 'rgba(255,110,150,.45)'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * 17, -h * .38, 5, 3, 0, 0, 7); g.fill(); }
    g.strokeStyle = '#1a1020'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(-4, -h * .36); g.quadraticCurveTo(-2, -h * .3, 0, -h * .36); g.quadraticCurveTo(2, -h * .3, 4, -h * .36); g.stroke();
    if (C.gozluk) glasses(g, 0, -h * .5, .85);
    if (C.sapka) hat(g, C.sapka, 0, -h + 2, .95, C.sapkaR);
  }

  const K = { ordek, jelibon, blok, slime };
  window.Konsept = { draw(g, k, C, x, y, sc = 1, t = 0) { g.save(); g.translate(x, y); g.scale(sc, sc); K[k](g, C, t); g.restore(); } };
})();
