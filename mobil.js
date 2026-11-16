// Telefonda dik tutulunca "yan çevir" uyarısı.
// Kullanım: <script src="mobil.js" data-yan="always"></script>
//       ya da data-yan="#fwPlay,#brPlay" → sadece bu öğeler görünürken.
(() => {
  const me = document.currentScript, sel = (me && me.dataset.yan) || 'always';
  const touch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  if (!touch) return;
  const css = document.createElement('style');
  css.textContent = `#yanCevir{position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;
    background:radial-gradient(circle at 50% 40%,#3a1f55,#12081d);color:#fff;font-family:system-ui,sans-serif;text-align:center;padding:24px}
  #yanCevir.on{display:flex}
  #yanCevir .tel{width:70px;height:120px;border:6px solid #fff;border-radius:14px;position:relative;animation:yanD 1.8s ease-in-out infinite}
  #yanCevir .tel:after{content:"";position:absolute;bottom:6px;left:50%;width:16px;height:4px;margin-left:-8px;border-radius:4px;background:#fff}
  @keyframes yanD{0%,20%{transform:rotate(0)}55%,80%{transform:rotate(-90deg)}100%{transform:rotate(0)}}
  #yanCevir b{font-size:22px}#yanCevir small{opacity:.75;font-size:14px;max-width:280px}
  #yanCevir button{margin-top:6px;font:700 16px system-ui;padding:12px 20px;border-radius:99px;border:0;background:#ffd84a;color:#4a2400;box-shadow:0 4px 0 #b07800}`;
  document.head.appendChild(css);
  const el = document.createElement('div'); el.id = 'yanCevir';
  el.innerHTML = '<div class="tel"></div><b>Telefonunu yan çevir 📱</b><small>Bu oyun yatay ekranda oynanıyor.</small><button type="button">⛶ Tam ekran + yatay</button>';
  const add = () => document.body.appendChild(el);
  document.body ? add() : addEventListener('DOMContentLoaded', add);
  el.querySelector('button').onclick = async () => {
    try { await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch (e) {}
    try { await screen.orientation.lock('landscape'); } catch (e) {}
    upd();
  };
  const active = () => sel === 'always' || sel.split(',').some(s => { const n = document.querySelector(s.trim()); return n && n.offsetParent !== null && !n.classList.contains('hidden'); });
  function upd() { const portrait = innerHeight > innerWidth * 1.05; el.classList.toggle('on', portrait && active()); }
  addEventListener('resize', upd); addEventListener('orientationchange', () => setTimeout(upd, 200));
  setInterval(upd, 700); setTimeout(upd, 50);
})();
