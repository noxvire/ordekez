// Ördekez karakter sistemi (LPC katmanları + palet ile yeniden renklendirme)
// Kullanım: await CharLib.load(); const sheet = await CharLib.compose(cfg); CharLib.draw(ctx, sheet, 'walk', 2, fr, x, y, 2)
(function () {
  const BASE = (document.currentScript && document.currentScript.src.replace(/char\.js.*$/, '')) || 'bk/';
  const ANIM = { idle: { r: 0, n: 2 }, walk: { r: 4, n: 9 }, thrust: { r: 8, n: 8 }, sit: { r: 12, n: 3 }, emote: { r: 16, n: 3 } };
  const DIRS = { n: 0, w: 1, s: 2, e: 3 };
  let CAT = null, BYID = {}, PAL = {};
  const imgCache = {}, dataCache = {}, layerCache = {}, sheetCache = {};

  const CATS = [
    ['govde', 'Vücut', '🧍'], ['bas', 'Kafa', '🙂'], ['ifade', 'Yüz İfadesi', '😊'], ['kas', 'Kaş', '〰️'], ['burun', 'Burun', '👃'],
    ['kulak', 'Kulak', '👂'], ['kirisik', 'Kırışık', '👴'], ['sac', 'Saç', '💇'], ['sacek', 'Saç Eki', '🎀'], ['sakal', 'Sakal', '🧔'], ['biyik', 'Bıyık', '🥸'],
    ['ust', 'Üst', '👕'], ['kol', 'Kol', '🦾'], ['alt', 'Alt', '👖'], ['corap', 'Çorap', '🧦'], ['ayakkabi', 'Ayakkabı', '👟'],
    ['sapka', 'Şapka', '🎩'], ['gozluk', 'Gözlük', '👓'], ['kupe', 'Küpe', '💎'], ['boyun', 'Boyun', '🧣'], ['eldiven', 'Eldiven', '🧤'],
    ['pelerin', 'Pelerin', '🦸'], ['kanat', 'Kanat', '🪽'], ['kuyruk', 'Kuyruk', '🐈'], ['boynuz', 'Boynuz', '🦌'],
  ];
  const REQUIRED = { govde: 1, bas: 1 };              // boş bırakılamaz
  const HAIRLIKE = { sac: 1, sacek: 1, sakal: 1, biyik: 1, kas: 1 };
  const SKINLIKE = { govde: 1, bas: 1, kulak: 1, burun: 1, ifade: 1, kirisik: 1 };

  const TR = {
    // en sık görünen isimlerin Türkçesi (gerisi İngilizce kalır)
    'Body Color': 'Vücut', 'Human Male': 'İnsan (erkek)', 'Human Female': 'İnsan (kadın)', 'Human Male Small': 'İnsan küçük (erkek)', 'Human Female Small': 'İnsan küçük (kadın)',
    'Human Male Plump': 'İnsan tombul', 'Human Male Gaunt': 'İnsan zayıf', 'Human Male Elderly': 'Yaşlı (erkek)', 'Human Female Elderly': 'Yaşlı (kadın)', 'Human Elderly Small': 'Yaşlı küçük',
    'Mouse': 'Fare', 'Rabbit': 'Tavşan', 'Pig': 'Domuz', 'Sheep': 'Koyun', 'Rat': 'Sıçan', 'Wolf male': 'Kurt', 'Wolf female': 'Dişi kurt', 'Boarman': 'Yaban domuzu', 'Minotaur': 'Minotor',
    'Minotaur female': 'Dişi minotor', 'Goblin': 'Goblin', 'Orc male': 'Ork', 'Orc female': 'Dişi ork', 'Troll': 'Trol', 'Alien': 'Uzaylı', 'Lizard male': 'Kertenkele', 'Lizard female': 'Dişi kertenkele',
    'Frankenstein': 'Frankenstein', 'Jack O Lantern': 'Bal kabağı', 'Vampire': 'Vampir',
    'Neutral': 'Normal', 'Happy': 'Mutlu', 'Angry': 'Kızgın', 'Sad': 'Üzgün', 'Shock': 'Şaşkın', 'Blush': 'Utangaç', 'Closed Eyes': 'Gözler kapalı', 'Closing Eyes': 'Göz kırpan',
    'Rolling Eyes': 'Göz deviren', 'Looking Left': 'Sola bakan', 'Looking Right': 'Sağa bakan', 'Shame': 'Mahcup',
    'Thick Eyebrows': 'Kalın kaş', 'Thin Eyebrows': 'İnce kaş', 'Big nose': 'Büyük burun', 'Button nose': 'Düğme burun', 'Elderly nose': 'Yaşlı burnu', 'Large nose': 'İri burun', 'Straight nose': 'Düz burun',
    'Big ears': 'Büyük kulak', 'Elven ears': 'Elf kulağı', 'Long ears': 'Uzun kulak', 'Cat Ears': 'Kedi kulağı', 'Wolf Ears': 'Kurt kulağı', 'Wrinkles': 'Kırışıklık',
    "5 O'clock Shadow": 'Hafif sakal', 'Basic Beard': 'Sakal', 'Medium Beard': 'Orta sakal', 'Trimmed Beard': 'Kısa sakal', 'Winter Beard': 'Gür sakal',
    'Mustache': 'Bıyık', 'Big Mustache': 'Kocaman bıyık', 'Walrus Mustache': 'Mors bıyığı', 'Handlebar Mustache': 'Burma bıyık', 'French Mustache': 'Fransız bıyığı',
    'Longsleeve': 'Uzun kollu', 'Shortsleeve': 'Kısa kollu', 'TShirt': 'Tişört', 'Cardigan': 'Hırka', 'Scoop': 'Askılı', 'Sleeveless': 'Kolsuz', 'Overalls': 'Tulum', 'Suspenders': 'Askı',
    'Pants': 'Pantolon', 'Long Pants': 'Uzun pantolon', 'Shorts': 'Şort', 'Short Shorts': 'Kısa şort', 'Leggings': 'Tayt', 'Cuffed Pants': 'Paçalı pantolon', 'Plain skirt': 'Etek', 'Belle skirt': 'Prenses eteği',
    'Basic Shoes': 'Ayakkabı', 'Basic Boots': 'Bot', 'Sandals': 'Sandalet', 'Slippers': 'Terlik', 'Hood': 'Kapüşon', 'Crown': 'Taç', 'Tiara': 'Tiara', 'Christmas Hat': 'Noel şapkası',
    'Formal Bowler Hat': 'Melon şapka', 'Formal Tophat': 'Silindir şapka', 'Tricorne': 'Korsan şapkası', 'Glasses': 'Gözlük', 'Sunglasses': 'Güneş gözlüğü', 'Shades': 'Karanlık gözlük',
    'Round Glasses': 'Yuvarlak gözlük', 'Nerd Glasses': 'İnek gözlüğü', 'Scarf': 'Atkı', 'Necktie': 'Kravat', 'Bowtie': 'Papyon', 'Solid': 'Pelerin', 'Tattered': 'Yırtık pelerin',
    'Lizard Wings': 'Ejderha kanadı', 'Batlike Lizard Wings': 'Yarasa kanadı', 'Gloves': 'Eldiven', 'Bandana': 'Bandana', 'Pirate Bandana': 'Korsan bandanası', 'Kerchief': 'Başörtüsü',
  };
  const tr = s => TR[s] || s;

  function img(src) {
    if (!imgCache[src]) imgCache[src] = new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
    return imgCache[src];
  }
  async function pixels(hash) {
    if (!dataCache[hash]) dataCache[hash] = img(BASE + 'ch/' + hash + '.webp').then(im => {
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
      const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0);
      return { w: c.width, h: c.height, d: g.getImageData(0, 0, c.width, c.height) };
    });
    return dataCache[hash];
  }
  const hx = h => { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  const toHex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  function rgb2hsl(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
    if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; } return [h, s, l]; }
  function hsl2rgb(h, s, l) { if (!s) return [l * 255, l * 255, l * 255]; const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }; return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255]; }
  // özel renk → kaynak paletin aydınlık dağılımına göre rampa
  function ramp(base, hex) {
    const [h, s, l] = rgb2hsl(...hx(hex)), Ls = base.map(c => rgb2hsl(...hx(c))[2]), mid = Ls[Math.min(Ls.length - 1, Math.floor(Ls.length * .6))];
    return base.map((c, i) => { const li = Math.max(.03, Math.min(.97, Ls[i] + (l - mid))); return toHex(...hsl2rgb((h + (i - Ls.length / 2) * .006 + 1) % 1, Math.min(1, s * (0.75 + .25 * (i / Ls.length))), li)); });
  }
  function palette(ref, base) {
    if (!ref) return null;
    if (ref[0] === '#') return ramp(base, ref);
    const p = ref.split('.'); return (PAL[p[0] + '.' + p[1]] || {})[p[2]] || null;
  }

  async function load() {
    if (CAT) return CAT;
    const j = await (await fetch(BASE + 'ch/catalog.json')).json();
    CAT = j; PAL = j.pal; j.items.forEach(it => { BYID[it.id] = it; it.tr = tr(it.ad); });
    return CAT;
  }
  const byCat = c => CAT.items.filter(i => i.c === c);
  // bir yuvanın rengini hangi anahtardan alacağı
  function colorKey(it, si) {
    const s = it.s[si];
    if (s.m === 'body' && (it.mbc || SKINLIKE[it.c])) return 'ten';
    if (s.m === 'eye') return 'goz';
    if (s.m === 'hair' && HAIRLIKE[it.c] && si === 0) return it.c === 'sac' || it.c === 'sacek' ? 'sac' : it.c;
    return it.c + si;
  }
  function slotColor(cfg, it, si) {
    const k = colorKey(it, si), c = cfg.c || {};
    if (c[k]) return c[k];
    if ((k === 'sakal' || k === 'biyik' || k === 'kas') && c.sac) return c.sac;
    return null;
  }
  function headGroup(cfg, it) {
    if (!it.rip) return '';
    const h = BYID[cfg.it.bas]; if (!h) return null;
    return it.rip[h.ad.replace(/ /g, '_')] || null;
  }
  function usable(cfg, it) {
    if (!it.b.includes(cfg.b) && !it.b.length) return false;
    if (it.req) { const h = BYID[cfg.it.bas]; if (!h || !it.req.every(t => (h.tags || []).includes(t))) return false; }
    if (it.rip && headGroup(cfg, it) == null) return false;
    return true;
  }
  async function layerCanvas(cfg, it, li) {
    const g = headGroup(cfg, it); if (g == null) return null;
    const files = it.f[g] || it.f[''] || Object.values(it.f)[0];
    const hash = files[cfg.b + li] || files[(cfg.b === 'male' ? 'female' : 'male') + li]; if (!hash) return null;
    const maps = (it.s || []).map((s, si) => { const t = palette(slotColor(cfg, it, si), s.b); return t ? [s.b, t] : null; });
    const key = hash + '|' + JSON.stringify(maps);
    if (layerCache[key]) return layerCache[key];
    const P = await pixels(hash), c = document.createElement('canvas'); c.width = P.w; c.height = P.h;
    const g2 = c.getContext('2d');
    if (!maps.some(Boolean)) { g2.putImageData(P.d, 0, 0); return (layerCache[key] = c); }
    const lut = new Map();
    for (const m of maps) if (m) m[0].forEach((src, i) => { const a = hx(src), b = hx(m[1][i] || m[1][m[1].length - 1]); lut.set((a[0] << 16) | (a[1] << 8) | a[2], b); });
    const srcs = [...lut.keys()].map(k => [k >> 16, (k >> 8) & 255, k & 255, lut.get(k)]);
    const out = new ImageData(new Uint8ClampedArray(P.d.data), P.w, P.h), d = out.data, memo = new Map();
    for (let i = 0; i < d.length; i += 4) {
      if (!d[i + 3]) continue;
      const k = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2]; let t = memo.get(k);
      if (t === undefined) { t = lut.get(k) || null; if (!t) for (const s of srcs) if (Math.abs(s[0] - d[i]) <= 3 && Math.abs(s[1] - d[i + 1]) <= 3 && Math.abs(s[2] - d[i + 2]) <= 3) { t = s[3]; break; } memo.set(k, t); }
      if (t) { d[i] = t[0]; d[i + 1] = t[1]; d[i + 2] = t[2]; }
    }
    g2.putImageData(out, 0, 0); return (layerCache[key] = c);
  }
  // tüm katmanları z sırasına göre tek sayfada birleştir
  async function compose(cfg) {
    await load();
    const key = JSON.stringify(cfg);
    if (sheetCache[key]) return sheetCache[key];
    const p = (async () => {
      const L = [];
      for (const cat in cfg.it) { const it = BYID[cfg.it[cat]]; if (!it || !usable(cfg, it)) continue; it.z.forEach((z, li) => L.push([z, it, li])); }
      L.sort((a, b) => a[0] - b[0]);
      const cs = await Promise.all(L.map(([, it, li]) => layerCanvas(cfg, it, li).catch(() => null)));
      const c = document.createElement('canvas'); c.width = 576; c.height = 1280; const g = c.getContext('2d');
      cs.forEach(x => x && g.drawImage(x, 0, 0)); return c;
    })();
    sheetCache[key] = p; const ks = Object.keys(sheetCache); if (ks.length > 60) delete sheetCache[ks[0]];
    return p;
  }
  function draw(ctx, sheet, anim, dir, fr, x, y, sc = 1) {
    const A = ANIM[anim] || ANIM.idle, d = typeof dir === 'number' ? dir : DIRS[dir];
    const f = Math.floor(fr) % A.n;
    ctx.drawImage(sheet, f * 64, (A.r + d) * 64, 64, 64, Math.round(x - 32 * sc), Math.round(y - 60 * sc), 64 * sc, 64 * sc);
  }
  // olta: 13 karelik özel animasyon, gövde thrust kareleriyle eşleşir
  const ROD_SEQ = [0, 1, 2, 3, 4, 5, 4, 4, 4, 5, 4, 2, 3];
  const ROD_TIP = { n: [101, 44], w: [3, 66], s: [58, 84], e: [124, 66] };
  const rodCache = {};
  async function rodSheets(colors) {
    const key = JSON.stringify(colors || []); if (rodCache[key]) return rodCache[key];
    return (rodCache[key] = (async () => {
      const out = {};
      for (const part of ['bg', 'fg']) {
        const im = await img(BASE + 'rod_' + part + '.webp'), c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
        const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0);
        if (colors && colors.some(Boolean)) {
          const D = g.getImageData(0, 0, c.width, c.height), d = D.data, lut = [];
          CAT.rod.forEach((s, si) => { const t = palette(colors[si], s.b); if (t) s.b.forEach((src, i) => lut.push([...hx(src), hx(t[i])])); });
          for (let i = 0; i < d.length; i += 4) if (d[i + 3]) for (const s of lut) if (Math.abs(s[0] - d[i]) <= 3 && Math.abs(s[1] - d[i + 1]) <= 3 && Math.abs(s[2] - d[i + 2]) <= 3) { d[i] = s[3][0]; d[i + 1] = s[3][1]; d[i + 2] = s[3][2]; break; }
          g.putImageData(D, 0, 0);
        }
        out[part] = c;
      }
      return out;
    })());
  }
  // balık tutma pozu: col 0-12 (13 kare)
  function drawFishing(ctx, sheet, rod, dir, col, x, y, sc = 1) {
    const d = typeof dir === 'number' ? dir : DIRS[dir], f = ROD_SEQ[col];
    const X = Math.round(x - 64 * sc), Y = Math.round(y - 92 * sc);
    if (rod) ctx.drawImage(rod.bg, col * 128, d * 128, 128, 128, X, Y, 128 * sc, 128 * sc);
    ctx.drawImage(sheet, f * 64, (ANIM.thrust.r + d) * 64, 64, 64, X + 32 * sc, Y + 32 * sc, 64 * sc, 64 * sc);
    if (rod) ctx.drawImage(rod.fg, col * 128, d * 128, 128, 128, X, Y, 128 * sc, 128 * sc);
    const t = ROD_TIP['nwse'[d]]; return [X + t[0] * sc, Y + t[1] * sc];
  }

  function defaults(b) {
    b = b || 'male';
    return { b, it: { govde: 'body_body_color', bas: b === 'female' ? 'head_human_female' : 'head_human_male', ifade: 'expression_neutral', kas: 'eyebrows_thin_eyebrows',
      sac: b === 'female' ? 'hair_long' : 'hair_plain', ust: 'clothes_tshirt', alt: 'legs_pants', ayakkabi: 'shoes_basic_shoes' },
      c: { ten: 'body.ulpc.light', goz: 'eye.ulpc.brown', sac: 'hair.ulpc.dark_brown', ust0: 'cloth.ulpc.blue', alt0: 'cloth.ulpc.charcoal', ayakkabi0: 'cloth.ulpc.brown' } };
  }
  function fix(cfg) {
    // var olmayan parçaları at, eksik zorunluları doldur
    const d = defaults(cfg && cfg.b);
    cfg = Object.assign({ b: d.b, it: {}, c: {} }, cfg || {});
    for (const k in cfg.it) if (!BYID[cfg.it[k]]) delete cfg.it[k];
    for (const k in REQUIRED) if (!cfg.it[k] || !BYID[cfg.it[k]]) cfg.it[k] = d.it[k];
    return cfg;
  }
  function randomize(b) {
    const pick = a => a[Math.floor(Math.random() * a.length)], cfg = { b: b || pick(['male', 'female']), it: {}, c: {} };
    const pp = m => Object.keys(PAL).filter(k => k.startsWith(m + '.')).flatMap(k => Object.keys(PAL[k]).map(n => k + '.' + n));
    const humanHeads = byCat('bas').filter(i => (i.tags || []).includes('human'));
    cfg.it.govde = 'body_body_color';
    cfg.it.bas = Math.random() < .8 ? pick(humanHeads.filter(h => cfg.b === 'female' ? /female/i.test(h.ad) || /Small|Elderly Small/.test(h.ad) : !/female/i.test(h.ad))).id : pick(byCat('bas')).id;
    const chance = { ifade: 1, kas: .8, burun: .3, kulak: .15, sac: .92, sacek: .12, sakal: cfg.b === 'male' ? .35 : 0, biyik: cfg.b === 'male' ? .25 : 0, ust: 1, kol: .1, alt: 1, corap: .2, ayakkabi: .95, sapka: .35, gozluk: .2, kupe: .15, boyun: .2, eldiven: .05, pelerin: .06, kanat: .03, kuyruk: .03, boynuz: .02 };
    for (const c in chance) { if (Math.random() > chance[c]) continue; const opts = byCat(c).filter(i => usable(cfg, i) && i.b.includes(cfg.b)); if (opts.length) cfg.it[c] = pick(opts).id; }
    const skin = pp('body').filter(k => !/fur|zombie|green|blue|lavender/.test(k));
    cfg.c.ten = pick(skin); cfg.c.goz = pick(pp('eye')); cfg.c.sac = pick(pp('hair'));
    for (const c in cfg.it) { const it = BYID[cfg.it[c]]; (it.s || []).forEach((s, si) => { const k = colorKey(it, si); if (!cfg.c[k]) cfg.c[k] = pick(pp(s.m === 'body' ? 'cloth' : s.m)); }); }
    return cfg;
  }

  window.CharLib = { load, compose, draw, drawFishing, rodSheets, defaults, fix, randomize, byCat, usable, colorKey, slotColor, palette, layerCanvas,
    CATS, REQUIRED, ANIM, DIRS, get CAT() { return CAT; }, get BYID() { return BYID; }, get PAL() { return PAL; }, BASE };
})();
