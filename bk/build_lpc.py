"""Ördekez Balıkçılık — LPC karakter parçalarını seçip oyun için atlasa dönüştürür.
Çıktı: <repo>/bk/ch/<id>_<body>[_<head>]_L<n>.webp  (+ bk/ch/catalog.json, bk/LPC_CREDITS.txt)
Atlas düzeni: satırlar (her biri n,w,s,e yön) idle(0-3) walk(4-7) thrust(8-11) sit(12-15) emote(16-19); kare 64px, genişlik 576.
"""
import json, glob, os, re, sys, subprocess, collections
from PIL import Image

REPO = '/home/claude/lpc/repo'
OUT = '/home/claude/ordekez-repo/bk/ch'
os.makedirs(OUT, exist_ok=True)
os.chdir(REPO)

ANIMS = ['idle', 'walk', 'thrust', 'sit', 'emote']
BODIES = ['male', 'female']

# Türkçe kategori: (type_name listesi)
CATS = {
  'govde':   ['body'],
  'bas':     ['head'],
  'kulak':   ['ears', 'furry_ears'],
  'burun':   ['nose'],
  'ifade':   ['expression'],
  'kas':     ['eyebrows'],
  'sakal':   ['beard'],
  'biyik':   ['mustache'],
  'kirisik': ['wrinkles'],
  'sac':     ['hair'],
  'sacek':   ['hairextl', 'hairextr', 'ponytail', 'updo'],
  'ust':     ['clothes', 'dress', 'vest', 'overalls', 'armour', 'chainmail'],
  'kol':     ['sleeves'],
  'alt':     ['legs'],
  'corap':   ['socks'],
  'ayakkabi':['shoes'],
  'sapka':   ['hat', 'headcover', 'bandana'],
  'gozluk':  ['facial_eyes'],
  'boyun':   ['neck', 'necklace'],
  'pelerin': ['cape'],
  'kanat':   ['wings'],
  'kuyruk':  ['tail'],
  'boynuz':  ['horns'],
  'kupe':    ['earring_left', 'earring_right'],
  'eldiven': ['gloves', 'wrists', 'bracers'],
}
TYPE2CAT = {t: c for c, ts in CATS.items() for t in ts}
SKIP_NAMES = {'Skeleton', 'Zombie', 'Human Child', 'Wartotaur', 'Formal Pants', 'Angry Alt', 'Happy Alt', 'Sad Alt', 'Large Hat'}

PAL = {}
for f in glob.glob('palette_definitions/*/*.json'):
    b = os.path.basename(f)
    if b.startswith('meta'): continue
    mat, ver = b[:-5].split('_', 1)
    PAL[(mat, ver)] = json.load(open(f))
META = {m: json.load(open(f'palette_definitions/{m}/meta_{m}.json')) for m in ['body', 'cloth', 'eye', 'hair', 'metal', 'wood', 'all']}

def base_of(slot):
    """slot recolor tanımından kaynak paletin renklerini bul."""
    mat = slot['material']; base = slot.get('base') or META[mat]['base']
    ver = META[mat].get('default', 'ulpc')
    if '.' in base:
        ver, base = base.split('.', 1)
    pal = PAL.get((mat, ver), {}).get(base) or PAL.get(('all', 'lpcr'), {}).get(base)
    return mat, pal

def variant_material(v):
    v = v.replace(' ', '_')
    for mat in ['cloth', 'hair', 'metal', 'body', 'eye', 'wood']:
        for ver in ['ulpc', 'lpcr']:
            if v in PAL.get((mat, ver), {}): return mat, PAL[(mat, ver)][v]
    v2 = v.replace(' ', '_')
    for mat in ['hair', 'body']:
        if v2 in PAL.get((mat, 'ulpc'), {}): return mat, PAL[(mat, 'ulpc')][v2]
    return None, None

items = []
for f in sorted(glob.glob('sheet_definitions/**/*.json', recursive=True)):
    if os.path.basename(f).startswith('meta_'): continue
    d = json.load(open(f)); t = d['type_name']
    if t not in TYPE2CAT or d['name'] in SKIP_NAMES: continue
    anims = set(d.get('animations', []))
    if not {'walk', 'idle'} <= anims: continue
    L1 = d['layer_1']
    if not all(b in L1 for b in BODIES) and not ('male' in L1 or 'female' in L1): continue
    rec = d.get('recolors'); slots = []; variant = None
    if rec:
        if 'material' in rec: slots = [rec]
        else: slots = [rec[k] for k in sorted(rec) if k.startswith('color_')]
        sl = []
        for s in slots:
            mat, pal = base_of(s)
            if not pal: break
            sl.append({'m': mat, 'b': pal, 'k': s.get('type_name') or ('eyes' if mat == 'eye' else None), 'lab': s.get('label')})
        else:
            slots = sl
        if len(sl) != len(slots) or not slots: continue
    else:
        vs = d.get('variants') or []
        pick = None
        cnt = collections.Counter(variant_material(v)[0] for v in vs if variant_material(v)[0])
        if cnt:
            best = cnt.most_common(1)[0][0]
            cand = [v for v in vs if variant_material(v)[0] == best]
            for pref in ['white', 'gray', 'tan', 'brown', 'blonde', 'steel', 'black']:
                if pref in cand: pick = pref; break
            pick = pick or cand[0]
        if pick:
            mat, pal = variant_material(pick); variant = pick
            slots = [{'m': mat, 'b': pal, 'k': None, 'lab': None}]
        elif len(vs) >= 1:
            variant = vs[0]; slots = []
        else:
            continue
    layers = []
    for n in range(1, 10):
        L = d.get(f'layer_{n}')
        if not L: break
        if L.get('custom_animation'): continue
        layers.append({'z': L['zPos'], 'p': {b: L.get(b) for b in BODIES}})
    if not layers: continue
    items.append({'f': f, 'name': d['name'], 't': t, 'cat': TYPE2CAT[t], 'slots': slots, 'variant': variant,
                  'layers': layers, 'anims': [a for a in ANIMS if a in anims or (a == 'thrust' and 'watering' in anims)],
                  'rip': d.get('replace_in_path'), 'req': d.get('required_tags'), 'tags': d.get('tags'),
                  'mbc': d.get('match_body_color', False), 'credits': d.get('credits', [])})

# ${head} yollarını çöz
HEADVAL = None
def expand_paths(it):
    """[(headgroup or None, body, layerIdx, basepath)]"""
    out = []
    for li, L in enumerate(it['layers']):
        for b in BODIES:
            p = L['p'].get(b)
            if not p:
                p = L['p'].get('male' if b == 'female' else 'female')
            if not p: continue
            if '${' in p:
                rip = (it['rip'] or {}).get('head', {})
                for g in sorted(set(rip.values())):
                    out.append((g, b, li, p.replace('${head}', g)))
            else:
                out.append((None, b, li, p))
    return out

def fpath(it, base, anim):
    v = it['variant']
    return f"spritesheets/{base}{anim}" + (f"/{v.replace(' ', '_')}" if v else '') + '.png'

need = set()
for it in items:
    for g, b, li, base in expand_paths(it):
        for a in it['anims']: need.add(fpath(it, base, a))
need = sorted(need)
print('items', len(items), 'files', len(need))
if '--fetch' in sys.argv:
    have = set(subprocess.run(['git', 'ls-tree', '-r', '--name-only', 'HEAD', 'spritesheets'], capture_output=True, text=True).stdout.split('\n'))
    need = [p for p in need if p in have]
    print('existing', len(need))
    open('/tmp/lpc_need.txt', 'w').write('\n'.join('/' + p for p in need) + '\n')
    subprocess.run(['git', 'sparse-checkout', 'set', '--no-cone', '--stdin'], input=open('/tmp/lpc_need.txt').read() + '/sheet_definitions/\n/palette_definitions/\n/sources/\n/spritesheets/tools/fishing_rod/\n', text=True, check=True)
    sys.exit()

# atlası kur
ROWS = {a: i * 4 for i, a in enumerate(ANIMS)}
cat = []
credits = {}
for it in items:
    iid = re.sub(r'[^a-z0-9]+', '_', (it['t'] + '_' + it['name']).lower()).strip('_')
    files = collections.defaultdict(dict)
    okb = set()
    for g, b, li, base in expand_paths(it):
        key = f"{iid}_{b}" + (f"_{g}" if g else '') + f"_L{li}"
        atlas = Image.new('RGBA', (576, 64 * 20), (0, 0, 0, 0)); got = 0
        for a in it['anims']:
            p = fpath(it, base, a)
            if not os.path.exists(p): continue
            im = Image.open(p).convert('RGBA')
            w = min(576, im.width); h = min(256, im.height)
            atlas.paste(im.crop((0, 0, w, h)), (0, ROWS[a] * 64)); got += 1
        if not got: continue
        # aynı içerik tekrarını önlemek için içerik hash'i
        import hashlib
        hsh = hashlib.md5(atlas.tobytes()).hexdigest()[:10]
        fn = f"{hsh}.webp"
        if not os.path.exists(f'{OUT}/{fn}'):
            atlas.save(f'{OUT}/{fn}', lossless=True, quality=100, method=6)
        files[(g or '')][f"{b}{li}"] = hsh
        okb.add(b)
    if not files: continue
    # tek renk yuvalı parçalarda kaynak paleti piksellere bakarak doğrula
    if len(it['slots']) == 1:
        h0 = list(list(files.values())[0].values())[0]
        im = Image.open(f'{OUT}/{h0}.webp').convert('RGBA')
        cols = [(n, c[:3]) for n, c in im.getcolors(1 << 20) if c[3] > 0]
        hx = lambda h: tuple(int(h.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
        def cover(pal):
            P = [hx(x) for x in pal]
            return sum(n for n, c in cols if any(max(abs(c[0]-p[0]), abs(c[1]-p[1]), abs(c[2]-p[2])) <= 1 for p in P))
        sl = it['slots'][0]; best = (cover(sl['b']), sl['m'], sl['b'])
        for (m, v), pp in PAL.items():
            if m not in (sl['m'], 'all'): continue
            for nm, pal in pp.items():
                cv = cover(pal)
                if cv > best[0] * 1.15: best = (cv, sl['m'], pal)
        sl['b'] = best[2]
    for c in it['credits']:
        credits[c['file']] = c
    ent = {'id': iid, 'ad': it['name'], 'c': it['cat'], 't': it['t'], 'z': [L['z'] for L in it['layers']],
           'a': [a for a in it['anims']], 'f': files, 'b': sorted(okb)}
    if it['slots']: ent['s'] = it['slots']
    if it['mbc']: ent['mbc'] = 1
    if it['req']: ent['req'] = it['req']
    if it['tags']: ent['tags'] = it['tags']
    if it['rip']: ent['rip'] = it['rip'].get('head')
    cat.append(ent)

# olta
rod = {}
for part in ['bg', 'fg']:
    im = Image.open(f'spritesheets/tools/fishing_rod/{part}.png').convert('RGBA')
    im.save(f'/home/claude/ordekez-repo/bk/rod_{part}.webp', lossless=True, method=6)
rodd = json.load(open('sheet_definitions/tools/tool_rod.json'))
rs = []
for k in sorted(rodd['recolors']):
    s = rodd['recolors'][k]; mat, pal = base_of(s); rs.append({'m': mat, 'b': pal, 'k': s.get('type_name')})
for c in rodd['credits']: credits[c['file']] = c

pals = {f'{m}.{v}': p for (m, v), p in PAL.items()}
json.dump({'items': cat, 'pal': pals, 'rod': rs}, open(f'{OUT}/catalog.json', 'w'), ensure_ascii=False, separators=(',', ':'))
with open('/home/claude/ordekez-repo/bk/LPC_CREDITS.txt', 'w') as fo:
    fo.write('Ördekez Balıkçılık karakter görselleri: Liberated Pixel Cup (LPC) ve Universal LPC Spritesheet Character Generator katkıcıları.\n')
    fo.write('https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator\n')
    fo.write('Lisanslar: CC-BY-SA 3.0 / CC-BY 3.0+ / OGA-BY 3.0 / GPL 3.0 (her parça için aşağıda).\n\n')
    for k in sorted(credits):
        c = credits[k]
        fo.write(f"{k}: {', '.join(c.get('authors', []))} — {', '.join(c.get('licenses', []))}\n")
        for u in c.get('urls', []): fo.write(f"   {u}\n")
print('catalog items', len(cat), 'files', len(os.listdir(OUT)))
print(collections.Counter(e['c'] for e in cat))
