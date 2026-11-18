// Ördekez insan konseptleri 2: anime, kagit, roman, murekkep, defter
(function () {
  const hx = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (c, d, k) => { const a = hx(c), b = hx(d); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const dk = (c, k) => mix(c, '#140a1e', k), lt = (c, k) => mix(c, '#ffffff', k);
  const E = (cx, cy, rx, ry, a0, a1, n) => { const r = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; r.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return r; };
  const M = pts => pts.map(([x, y]) => [-x, y]);
  function path(g, pts, smooth) {
    if (!smooth) { pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); return; }
    const n = pts.length, m = i => { const a = pts[(i + n) % n], b = pts[(i + 1 + n) % n]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
    g.moveTo(...m(-1)); for (let i = 0; i < n; i++) { const q = m(i); g.quadraticCurveTo(pts[i][0], pts[i][1], q[0], q[1]); } g.closePath();
  }
  // ---- ortak figür geometrisi ----
  const HEAD = [...E(0, -128, 15, 20, Math.PI, Math.PI * 2, 10), [15, -120], [10, -108], [0, -103], [-10, -108], [-15, -120]];
  const HAIRF = {
    kisa: [...E(0, -127, 17.5, 23, Math.PI, Math.PI * 2, 12), [17, -122], [11, -131], [4, -126], [-2, -134], [-8, -128], [-14, -133], [-17.5, -120]],
    kirpi: [...(() => { const r = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI, R = i % 2 ? 19 : 29; r.push([Math.cos(a) * R * 1.05, -127 + Math.sin(a) * R]); } return r; })(), [18, -118], [13, -130], [7, -122], [1, -134], [-5, -124], [-11, -134], [-18, -118]],
    uzun: [...E(0, -127, 18, 23, Math.PI, Math.PI * 2, 12), [18, -110], [14, -126], [5, -131], [-5, -127], [-13, -136], [-18, -108]],
    kuyruk: [...E(0, -127, 17.5, 23, Math.PI, Math.PI * 2, 12), [17, -120], [12, -128], [0, -132], [-8, -126], [-12, -134], [-17.5, -118]],
  };
  const HAIRB = {
    uzun: [...E(0, -127, 20, 25, Math.PI, Math.PI * 2, 12), [21, -110], [24, -86], [17, -76], [6, -80], [-6, -80], [-17, -76], [-24, -86], [-21, -110]],
    kuyruk: [[-12, -146], [-30, -140], [-38, -116], [-36, -88], [-28, -78], [-30, -100], [-24, -124], [-14, -134]],
    kirpi: [], kisa: [],
  };
  const LEG = [[-16, -60], [-2, -60], [-3, -10], [-13, -10]], SHOE = [...E(-9, -5, 10, 6, 0, Math.PI * 2, 12)];
  const TORSO = [[-19, -101], [19, -101], [22, -80], [18, -57], [-18, -57], [-22, -80]];
  const ARM = [[-18, -100], [-26, -96], [-30, -62], [-22, -61], [-19, -84]], HAND = E(-26, -56, 5.5, 6, 0, Math.PI * 2, 10), NECK = [[-5, -110], [5, -110], [5.5, -99], [-5.5, -99]];
  function parts(C) {
    const L = [];
    if (HAIRB[C.sacT] && HAIRB[C.sacT].length) L.push({ k: 'sac', pts: HAIRB[C.sacT], c: C.sac, s: 1 });
    L.push({ k: 'alt', pts: LEG, c: C.alt }, { k: 'alt', pts: M(LEG), c: C.alt }, { k: 'ayak', pts: SHOE, c: C.ayak, s: 1 }, { k: 'ayak', pts: M(SHOE), c: C.ayak, s: 1 });
    L.push({ k: 'ten', pts: HAND, c: C.ten, s: 1 }, { k: 'ust', pts: ARM, c: C.ust }, { k: 'ten', pts: M(HAND), c: C.ten, s: 1 }, { k: 'ust', pts: M(ARM), c: C.ust });
    L.push({ k: 'ten', pts: NECK, c: C.ten }, { k: 'ust', pts: TORSO, c: C.ust });
    if (C.ic) L.push({ k: 'ic', pts: [[-7, -101], [7, -101], [5, -58], [-5, -58]], c: C.ic });
    if (C.atki) L.push({ k: 'atki', pts: [[-14, -104], [14, -104], [15, -96], [-15, -96]], c: C.atki, s: 1 }, { k: 'atki', pts: [[6, -98], [13, -98], [14, -78], [7, -80]], c: C.atki });
    L.push({ k: 'ten', pts: HEAD, c: C.ten, s: 1, face: 1 }, { k: 'sac', pts: HAIRF[C.sacT] || HAIRF.kisa, c: C.sac, s: C.sacT === 'kirpi' ? 0 : 1 });
    if (C.bant) L.push({ k: 'bant', pts: [[-17, -132], [17, -132], [17.5, -127], [-17.5, -127]], c: C.bant }, { k: 'bant', pts: [[-17, -131], [-30, -124 + 0], [-36, -114], [-28, -120], [-17, -127]], c: C.bant, s: 1, flap: 1 });
    return L;
  }

  // ---------- 1) ANİME GACHA ----------
  const anime = {
    part(g, p) { g.beginPath(); path(g, p.pts, p.s); const gr = g.createLinearGradient(0, -150, 0, 0); gr.addColorStop(0, lt(p.c, .12)); gr.addColorStop(1, dk(p.c, .08)); g.fillStyle = gr; g.fill();
      g.save(); g.clip(); g.translate(5, 4); g.beginPath(); path(g, p.pts, p.s); g.rect(-300, -300, 600, 600); g.fillStyle = dk(p.c, .22); g.globalAlpha = .55; g.fill('evenodd'); g.restore();
      if (p.k === 'sac') { g.save(); g.beginPath(); path(g, p.pts, p.s); g.clip(); g.strokeStyle = lt(p.c, .6); g.globalAlpha = .7; g.lineWidth = 2.5; g.beginPath(); g.arc(0, -124, 16, Math.PI * 1.15, Math.PI * 1.35); g.stroke(); g.beginPath(); g.arc(0, -124, 16, Math.PI * 1.5, Math.PI * 1.62); g.stroke(); g.restore(); }
      g.beginPath(); path(g, p.pts, p.s); g.strokeStyle = dk(p.c, .6); g.lineWidth = 1.4; g.lineJoin = 'round'; g.stroke(); },
    face(g, C, t) { const bl = (t % 3.6) < .1;
      for (const s of [-1, 1]) { const x = s * 7, y = -119;
        if (bl) { g.strokeStyle = '#2a1424'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x - 5, y); g.quadraticCurveTo(x, y + 2, x + 5, y); g.stroke(); continue; }
        g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, 5, 6.5, 0, 0, 7); g.fill();
        const gr = g.createLinearGradient(0, y - 6, 0, y + 6); gr.addColorStop(0, dk(C.goz, .45)); gr.addColorStop(.6, C.goz); gr.addColorStop(1, lt(C.goz, .55)); g.fillStyle = gr; g.beginPath(); g.ellipse(x + s * .4, y + .5, 4, 6, 0, 0, 7); g.fill();
        g.fillStyle = dk(C.goz, .7); g.beginPath(); g.ellipse(x + s * .4, y, 1.8, 3, 0, 0, 7); g.fill();
        g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x - 1.4, y - 2.6, 1.6, 2, 0, 0, 7); g.fill(); g.beginPath(); g.arc(x + 1.5, y + 3, .8, 0, 7); g.fill();
        g.strokeStyle = '#2a1424'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 5.5 * s * -1 * -1 - (s < 0 ? 0 : 0), y - 5.5); g.moveTo(x - 5.5, y - 5); g.quadraticCurveTo(x, y - 8.5, x + 5.5, y - 5); g.lineTo(x + s * 7, y - 7); g.stroke();
        g.lineWidth = 1.3; g.strokeStyle = dk(C.sac, .3); g.beginPath(); g.moveTo(x - 4, y - 11); g.quadraticCurveTo(x, y - 12.5, x + 4.5, y - 11); g.stroke(); }
      g.fillStyle = 'rgba(255,120,150,.35)'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * 10, -111, 3.5, 1.8, 0, 0, 7); g.fill(); }
      g.strokeStyle = '#8a3a44'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-2.5, -108.5); g.quadraticCurveTo(0, -107, 2.5, -108.5); g.stroke(); },
    detail(g, C) { g.strokeStyle = dk(C.ust, .5); g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -100); g.lineTo(0, -58); g.stroke(); g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(0, -88, 2.2, 0, 7); g.fill(); },
  };

  // ---------- 2) KAĞIT (Paper Mario) ----------
  const kagit = {
    pre(g, C, t) { const k = Math.cos(Math.max(0, (t % 5) - 4.4) * Math.PI / .6 * 2); g.scale(Math.abs(k) < .08 ? .08 * Math.sign(k || 1) : k, 1); },
    shadow(g, L) { g.save(); g.translate(4, 4); g.fillStyle = 'rgba(60,40,20,.25)'; for (const p of L) { g.beginPath(); path(g, p.pts, p.s); g.fill(); g.lineWidth = 8; g.strokeStyle = 'rgba(60,40,20,.25)'; g.stroke(); } g.restore();
      g.fillStyle = '#fffdf6'; g.strokeStyle = '#fffdf6'; g.lineWidth = 9; g.lineJoin = 'round'; for (const p of L) { g.beginPath(); path(g, p.pts, p.s); g.fill(); g.stroke(); } },
    part(g, p) { g.beginPath(); path(g, p.pts, p.s); g.fillStyle = p.c; g.fill(); g.strokeStyle = dk(p.c, .35); g.lineWidth = 1; g.stroke();
      g.save(); g.clip(); g.globalAlpha = .07; g.strokeStyle = '#000'; g.lineWidth = 1; for (let i = -60; i < 60; i += 4) { g.beginPath(); g.moveTo(-40, -160 + i * 3); g.lineTo(40, -150 + i * 3); g.stroke(); } g.restore(); },
    face(g, C, t) { const bl = (t % 3.4) < .12; for (const s of [-1, 1]) { g.fillStyle = '#1a1018'; g.beginPath(); bl ? g.rect(s * 6 - 3, -118, 6, 1.6) : g.ellipse(s * 6, -118, 2.6, 4.6, 0, 0, 7); g.fill(); }
      g.strokeStyle = '#1a1018'; g.lineWidth = 1.8; g.lineCap = 'round'; g.beginPath(); g.arc(0, -111, 4.5, .3, Math.PI - .3); g.stroke(); g.fillStyle = 'rgba(255,100,120,.4)'; for (const s of [-1, 1]) { g.beginPath(); g.arc(s * 11, -110, 3, 0, 7); g.fill(); } },
    detail(g, C) { g.fillStyle = '#fff'; g.beginPath(); g.arc(0, -84, 7, 0, 7); g.fill(); g.fillStyle = C.alt; g.font = 'bold 9px system-ui'; g.textAlign = 'center'; g.fillText(C.harf || 'Ö', 0, -81); },
  };

  // ---------- 3) ÇİZGİ ROMAN ----------
  const roman = {
    part(g, p) { g.beginPath(); path(g, p.pts, p.s); g.fillStyle = p.c; g.fill();
      g.save(); g.clip(); g.fillStyle = dk(p.c, .45); for (let y = -170; y < 10; y += 4) for (let x = -40; x < 45; x += 4) { const r = Math.max(0, (x + (y % 8 ? 2 : 0)) / 22) * 1.6; if (r > .2) { g.beginPath(); g.arc(x + (y % 8 ? 2 : 0), y, Math.min(r, 2.1), 0, 7); g.fill(); } } g.restore();
      g.beginPath(); path(g, p.pts, p.s); g.strokeStyle = '#0a0a0a'; g.lineWidth = 3; g.lineJoin = 'round'; g.stroke(); },
    face(g, C) { g.strokeStyle = '#0a0a0a'; g.lineCap = 'round';
      for (const s of [-1, 1]) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(s * 2.5, -119); g.lineTo(s * 11, -121); g.lineTo(s * 10, -116.5); g.lineTo(s * 3, -116.5); g.closePath(); g.fill(); g.lineWidth = 1.4; g.stroke(); g.fillStyle = C.goz; g.beginPath(); g.arc(s * 6.5, -118.5, 2, 0, 7); g.fill(); g.lineWidth = 3; g.beginPath(); g.moveTo(s * 2, -124); g.lineTo(s * 12, -127); g.stroke(); }
      g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, -116); g.lineTo(-2, -111); g.lineTo(1, -111); g.stroke(); g.lineWidth = 2.2; g.beginPath(); g.moveTo(-5, -107); g.lineTo(5, -107.5); g.stroke(); g.lineWidth = 1.2; g.beginPath(); g.moveTo(9, -112); g.lineTo(11, -106); g.stroke(); },
    detail(g, C) { g.fillStyle = C.amblem || '#ffd23f'; g.strokeStyle = '#0a0a0a'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(0, -94); g.lineTo(10, -88); g.lineTo(0, -72); g.lineTo(-10, -88); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#0a0a0a'; g.font = 'bold 9px Impact,system-ui'; g.textAlign = 'center'; g.fillText('Ö', 0, -83); },
  };

  // ---------- 4) MÜREKKEP (sumi-e) ----------
  const murekkep = {
    part(g, p) { const ink = p.k === 'ten' ? '#efe2c8' : p.k === 'bant' || p.k === 'atki' ? '#c8241e' : p.k === 'sac' ? '#0e0c0a' : 'rgba(20,16,14,.88)';
      g.save(); for (let i = 0; i < 3; i++) { g.save(); g.translate(Math.sin(i * 3.1) * .8, Math.cos(i * 2.3) * .8); g.globalAlpha = i ? .35 : 1; g.beginPath(); path(g, p.pts, p.s); g.fillStyle = ink; g.fill(); g.restore(); }
      if (p.k === 'ust' || p.k === 'alt') { g.beginPath(); path(g, p.pts, p.s); g.clip(); g.strokeStyle = 'rgba(239,226,200,.18)'; g.lineWidth = 1.2; for (let i = -40; i < 40; i += 5) { g.beginPath(); g.moveTo(i, -110); g.quadraticCurveTo(i + 6, -60, i - 2, 0); g.stroke(); } }
      g.restore(); if (p.k === 'ten') { g.beginPath(); path(g, p.pts, p.s); g.strokeStyle = '#141010'; g.lineWidth = 1.6; g.stroke(); } },
    face(g, C) { g.strokeStyle = '#141010'; g.lineCap = 'round'; for (const s of [-1, 1]) { g.lineWidth = 2.6; g.beginPath(); g.moveTo(s * 2.5, -118); g.quadraticCurveTo(s * 7, -120.5, s * 11.5, -118.5); g.stroke(); g.lineWidth = 3.4; g.beginPath(); g.moveTo(s * 2, -124); g.lineTo(s * 12, -127.5); g.stroke(); }
      g.lineWidth = 1.5; g.beginPath(); g.moveTo(-3, -109); g.lineTo(3, -109.5); g.stroke(); if (C.yara) { g.strokeStyle = '#c8241e'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(5, -126); g.lineTo(11, -110); g.stroke(); } },
    detail(g, C) { g.strokeStyle = '#c8241e'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-18, -80); g.lineTo(18, -76); g.stroke(); g.strokeStyle = '#3a2a1a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-20, -40); g.lineTo(30, -150); g.stroke(); },
  };

  // ---------- 5) DEFTER KARALAMASI ----------
  const jit = (pts, a, seed) => pts.map(([x, y], i) => [x + Math.sin(i * 12.9 + seed) * a, y + Math.cos(i * 7.7 + seed * 1.3) * a]);
  const defter = {
    part(g, p, t) { const seed = Math.floor(t * 6);
      g.save(); g.beginPath(); path(g, p.pts, p.s); g.clip(); g.strokeStyle = p.c; g.globalAlpha = .75; g.lineWidth = 1.6; for (let i = -200; i < 100; i += 3.2) { g.beginPath(); g.moveTo(-45, i); g.lineTo(45, i - 26 + Math.sin(i + seed) * 1.5); g.stroke(); } g.restore();
      g.strokeStyle = '#2a2a3a'; g.lineWidth = 1.4; g.lineJoin = 'round'; for (let k = 0; k < 2; k++) { g.beginPath(); path(g, jit(p.pts, .9, seed + k * 5), p.s); g.globalAlpha = k ? .45 : .9; g.stroke(); } g.globalAlpha = 1; },
    face(g, C, t) { const seed = Math.floor(t * 6); g.strokeStyle = '#2a2a3a'; g.lineWidth = 1.5;
      for (const s of [-1, 1]) { g.beginPath(); for (let i = 0; i <= 14; i++) { const a = i / 12 * Math.PI * 2, r = 3.6 + Math.sin(i + seed) * .4; g.lineTo(s * 6.5 + Math.cos(a) * r, -118 + Math.sin(a) * r * 1.2); } g.stroke(); g.fillStyle = '#2a2a3a'; g.beginPath(); g.arc(s * 6.5 + 1, -117.5, 1.6, 0, 7); g.fill(); }
      g.beginPath(); g.moveTo(-5, -110); g.quadraticCurveTo(0, -105 + Math.sin(seed) * .5, 5, -110); g.stroke(); g.fillStyle = 'rgba(255,90,120,.4)'; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { g.fillRect(s * 11 - 3 + i * 2, -112, 1, 3); } },
    detail(g, C, t) { g.strokeStyle = '#2a2a3a'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(0, -100); for (let y = -98; y < -58; y += 4) g.lineTo(y % 8 ? 1 : -1, y); g.stroke(); g.fillStyle = '#e83a4a'; g.font = '10px system-ui'; g.fillText('★', 6, -82); },
  };

  const ST = { anime, kagit, roman, murekkep, defter };
  function draw(g, k, C, x, y, sc = 1, t = 0) {
    const st = ST[k], L = parts(C), bob = Math.sin(t * 2.4) * 1.2;
    g.save(); g.translate(x, y); g.scale(sc, sc);
    g.fillStyle = k === 'murekkep' ? 'rgba(20,10,0,.25)' : 'rgba(30,20,40,.2)'; g.beginPath(); g.ellipse(0, 0, 26, 5.5, 0, 0, 7); g.fill();
    g.translate(0, -bob); if (st.pre) st.pre(g, C, t);
    if (st.shadow) st.shadow(g, L);
    for (const p of L) { if (p.flap) { g.save(); g.translate(-17, -129); g.rotate(Math.sin(t * 5) * .15); g.translate(17, 129); st.part(g, p, t); g.restore(); continue; } if (p.face) st.detail(g, C, t); st.part(g, p, t); if (p.face) st.face(g, C, t); }
    g.restore();
  }
  window.Insan2 = { draw };
})();
