// Ördekez — 3D chibi ördek karakteri
// import { makeDuck } from './ordek3d.js';  const d = makeDuck(THREE, {renk, sapka, aks}); scene.add(d.root); d.update(dt, {hiz:0..1, kosu, zipla, selam});
export const RENKLER = { sari: '#ffd23f', beyaz: '#f6f4ee', pembe: '#ffa8c8', mavi: '#8ac8ff', yesil: '#9ad87a', mor: '#c8a0ff', turuncu: '#ffa84a', gri: '#a8acb8', siyah: '#3a3a44' };
export const SAPKALAR = { yok: 'Yok', kep: 'Kep', bere: 'Bere', tac: 'Taç', silindir: 'Silindir', yaprak: 'Yaprak', kovboy: 'Kovboy' };
export const AKSESUAR = { yok: 'Yok', papyon: 'Papyon', kravat: 'Kravat', atki: 'Atkı', gozluk: 'Gözlük', kulaklik: 'Kulaklık' };
export function makeDuck(THREE, opt = {}) {
  const body = opt.renk || '#ffd23f', acc = opt.aksR || '#2c3c8c';
  const toon = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .55, metalness: 0 }, o));
  const M = { body: toon(body), belly: toon(new THREE.Color(body).lerp(new THREE.Color('#ffffff'), .45)), beak: toon('#ff9a2a', { roughness: .4 }), eye: toon('#1a1420', { roughness: .15 }), white: toon('#ffffff', { roughness: .2 }), cheek: toon('#ff8aa8', { transparent: true, opacity: .55 }), acc: toon(acc), gold: toon('#e8c06a', { metalness: .7, roughness: .3 }) };
  const S = (r, w = 24, h = 18) => new THREE.SphereGeometry(r, w, h);
  const root = new THREE.Group(), hip = new THREE.Group(); root.add(hip);
  // gövde
  const torso = new THREE.Mesh(S(.42), M.body); torso.scale.set(1, .92, .95); torso.position.y = .48; hip.add(torso);
  const belly = new THREE.Mesh(S(.34), M.belly); belly.scale.set(.92, .82, .55); belly.position.set(0, .43, -.24); hip.add(belly);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(.12, .26, 12), M.body); tail.rotation.x = -2.3; tail.position.set(0, .62, .4); hip.add(tail);
  // kafa
  const head = new THREE.Group(); head.position.y = 1.02; hip.add(head);
  const skull = new THREE.Mesh(S(.4, 28, 22), M.body); head.add(skull);
  const tuft = new THREE.Group(); tuft.position.set(0, .38, .02); head.add(tuft); for (const [a, s] of [[-.4, .8], [0, 1], [.45, .75]]) { const t = new THREE.Mesh(new THREE.ConeGeometry(.05 * s, .2 * s, 8), M.body); t.position.set(Math.sin(a) * .04, .07 * s, 0); t.rotation.z = -a; tuft.add(t); }
  // gaga
  const beak = new THREE.Group(); beak.position.set(0, -.08, -.36); head.add(beak);
  const up = new THREE.Mesh(S(.16, 20, 12), M.beak); up.scale.set(1.25, .42, 1); beak.add(up);
  const lo = new THREE.Mesh(S(.14, 20, 12), M.beak); lo.scale.set(1.1, .32, .85); lo.position.set(0, -.06, .02); beak.add(lo);
  // gözler
  const eyes = [];
  for (const s of [-1, 1]) { const e = new THREE.Group(); e.position.set(s * .17, .05, -.33); e.rotation.y = s * -.3; head.add(e);
    const b = new THREE.Mesh(S(.085, 16, 12), M.eye); b.scale.set(.9, 1.15, .5); e.add(b);
    const h1 = new THREE.Mesh(S(.03, 10, 8), M.white); h1.position.set(-.025, .04, -.035); e.add(h1); const h2 = new THREE.Mesh(S(.014, 8, 6), M.white); h2.position.set(.03, -.03, -.035); e.add(h2);
    eyes.push(e);
    const ck = new THREE.Mesh(S(.07, 12, 8), M.cheek); ck.scale.set(1.2, .6, .4); ck.position.set(s * .27, -.1, -.26); ck.rotation.y = s * -.6; head.add(ck); }
  // kanatlar
  const wings = [];
  for (const s of [-1, 1]) { const w = new THREE.Group(); w.position.set(s * .38, .62, 0); hip.add(w); const m = new THREE.Mesh(S(.2, 16, 12), M.body); m.scale.set(.38, .95, .7); m.position.set(s * .02, -.15, 0); m.rotation.z = s * .25; w.add(m); wings.push(w); }
  // ayaklar
  const feet = [];
  for (const s of [-1, 1]) { const f = new THREE.Group(); f.position.set(s * .17, .12, 0); root.add(f);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .14, 8), M.beak); leg.position.y = -.03; f.add(leg);
    const foot = new THREE.Mesh(S(.12, 16, 10), M.beak); foot.scale.set(.9, .3, 1.3); foot.position.set(0, -.1, -.05); f.add(foot); feet.push(f); }
  // şapka
  const hat = new THREE.Group(); hat.position.y = .3; head.add(hat);
  function setHat(k) { while (hat.children.length) hat.remove(hat.children[0]); tuft.visible = k === 'yok' || k === 'tac' || k === 'yaprak'; const A = M.acc;
    if (k === 'kep') { const c = new THREE.Mesh(new THREE.SphereGeometry(.34, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), A); c.position.y = -.04; hat.add(c); const v = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .03, 24, 1, false, 0, Math.PI), A); v.rotation.y = Math.PI / 2; v.position.set(0, -.03, -.22); v.scale.set(1, 1, 1.3); hat.add(v); const b = new THREE.Mesh(S(.04), M.white); b.position.y = .3; hat.add(b); }
    if (k === 'bere') { const c = new THREE.Mesh(new THREE.SphereGeometry(.36, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), A); c.position.y = -.06; hat.add(c); const r = new THREE.Mesh(new THREE.TorusGeometry(.33, .05, 10, 32), toon(new THREE.Color(acc).lerp(new THREE.Color('#fff'), .3))); r.rotation.x = Math.PI / 2; r.position.y = -.04; hat.add(r); const p = new THREE.Mesh(S(.1), M.white); p.position.y = .32; hat.add(p); }
    if (k === 'tac') { const c = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .12, 5, 1, true), M.gold); c.position.y = .03; hat.add(c); for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.ConeGeometry(.045, .12, 6), M.gold); const a = i / 5 * Math.PI * 2; sp.position.set(Math.cos(a) * .16, .14, Math.sin(a) * .16); hat.add(sp); const g = new THREE.Mesh(S(.025), toon(['#ff4a6a', '#4ab0ff', '#3ad09a'][i % 3])); g.position.set(Math.cos(a) * .17, .03, Math.sin(a) * .17); hat.add(g); } hat.rotation.z = .15; hat.position.x = .06; }
    if (k === 'silindir') { const c = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, .32, 24), A); c.position.y = .16; hat.add(c); const b = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .025, 24), A); hat.add(b); const band = new THREE.Mesh(new THREE.CylinderGeometry(.185, .185, .05, 24), M.gold); band.position.y = .04; hat.add(band); }
    if (k === 'yaprak') { const l = new THREE.Mesh(S(.1, 12, 8), toon('#5ac85a')); l.scale.set(.5, .15, 1.2); l.position.set(.08, .12, 0); l.rotation.set(.3, .5, .5); hat.add(l); }
    if (k === 'kovboy') { const c = new THREE.Mesh(new THREE.CylinderGeometry(.2, .24, .22, 20), toon('#8a5a3a')); c.position.y = .1; hat.add(c); const b = new THREE.Mesh(new THREE.TorusGeometry(.32, .06, 8, 28), toon('#8a5a3a')); b.rotation.x = Math.PI / 2; b.scale.set(1, 1.2, .4); hat.add(b); }
  }
  const accG = new THREE.Group(); hip.add(accG);
  function setAcc(k) { while (accG.children.length) accG.remove(accG.children[0]); const A = M.acc;
    if (k === 'papyon') for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.ConeGeometry(.08, .14, 4), A); w.rotation.z = s * Math.PI / 2; w.position.set(s * .07, .8, -.3); accG.add(w); }
    if (k === 'papyon') { const k2 = new THREE.Mesh(S(.035), A); k2.position.set(0, .8, -.31); accG.add(k2); }
    if (k === 'kravat') { const t = new THREE.Mesh(new THREE.ConeGeometry(.06, .3, 4), A); t.rotation.x = Math.PI; t.position.set(0, .64, -.37); t.rotation.z = Math.PI / 4; accG.add(t); const n = new THREE.Mesh(S(.045), A); n.position.set(0, .8, -.32); accG.add(n); }
    if (k === 'atki') { const r = new THREE.Mesh(new THREE.TorusGeometry(.28, .07, 10, 30), A); r.rotation.x = Math.PI / 2; r.position.y = .82; accG.add(r); const e = new THREE.Mesh(new THREE.BoxGeometry(.1, .28, .06), A); e.position.set(.14, .66, -.26); e.rotation.z = .2; accG.add(e); }
    if (k === 'gozluk') { const fr = toon('#1a1420'); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.09, .015, 8, 20), fr); r.position.set(s * .17, 1.07, -.41); r.rotation.y = s * -.3; accG.add(r); } const br = new THREE.Mesh(new THREE.BoxGeometry(.12, .015, .015), fr); br.position.set(0, 1.08, -.43); accG.add(br); }
    if (k === 'kulaklik') { const band = new THREE.Mesh(new THREE.TorusGeometry(.42, .03, 8, 30, Math.PI), toon('#2a2a3a')); band.position.y = 1.02; accG.add(band); for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .08, 18), A); c.rotation.z = Math.PI / 2; c.position.set(s * .41, 1.02, 0); accG.add(c); } }
  }
  setHat(opt.sapka || 'yok'); setAcc(opt.aks || 'yok');
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
  let t = Math.random() * 10, blink = 2, wave = 0;
  function update(dt, st = {}) {
    t += dt; const sp = st.hiz || 0, run = st.kosu ? 1 : 0, f = (8 + run * 5) * sp;
    const ph = t * (9 + run * 4);
    // yalpalama yürüyüş
    hip.position.y = sp > .05 ? Math.abs(Math.sin(ph)) * (.06 + run * .04) : Math.sin(t * 2.2) * .015;
    hip.rotation.z = sp > .05 ? Math.sin(ph) * (.14 + run * .04) : 0;
    hip.rotation.x = -run * .18 * sp;
    feet.forEach((ft, i) => { const s = i ? 1 : -1; ft.position.z = sp > .05 ? Math.sin(ph + (i ? Math.PI : 0)) * .16 * sp : 0; ft.position.y = .12 + (sp > .05 ? Math.max(0, Math.cos(ph + (i ? Math.PI : 0))) * .08 * sp : 0); });
    wings.forEach((w, i) => { const s = i ? 1 : -1; let r = s * (sp > .05 ? .25 + Math.abs(Math.sin(ph)) * .35 * (1 + run) : .08 + Math.sin(t * 2.2) * .04); if (st.zipla) r = s * 1.2 + s * Math.sin(t * 30) * .3; if (st.sevin) r = s * (2.2 + Math.sin(t * 18) * .4); w.rotation.z = r; });
    if (st.selam) { wave += dt; wings[1].rotation.z = 2.4 + Math.sin(wave * 14) * .45; } else wave = 0;
    head.rotation.z = sp > .05 ? -Math.sin(ph) * .08 : Math.sin(t * 1.3) * .05; head.rotation.x = Math.sin(t * 1.7) * .03;
    blink -= dt; const b = blink < .12 ? .1 : 1; if (blink < 0) blink = 2 + Math.random() * 3; eyes.forEach(e => e.scale.y = b);
    tail.rotation.z = Math.sin(t * (sp > .05 ? 14 : 4)) * .3;
    if (st.konus) lo.position.y = -.06 - Math.abs(Math.sin(t * 20)) * .04; else lo.position.y = -.06;
  }
  return { root, update, setHat, setAcc, head };
}
