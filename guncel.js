// Sitede daha yeni bir sürüm var mı? (tarayıcı eski sayfayı hafızadan açtıysa)
// Sayfa yeni açıldıysa kendiliğinden yeniler; oyun sırasında üstte "yenile" yazısı gösterir.
(() => {
  const here = Date.parse(document.lastModified) || 0, K = 'ordekez_upd_' + location.pathname;
  let shown = false;
  function show() {
    if (shown) return; shown = true;
    const b = document.createElement('button'); b.type = 'button';
    b.textContent = '🔄 Yeni güncelleme var — dokun, yenile';
    b.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:99998;font:700 14px system-ui,sans-serif;padding:9px 16px;border-radius:99px;border:2px solid #fff;background:#2fbf6a;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.35);cursor:pointer';
    b.onclick = () => location.reload();
    document.body.appendChild(b);
  }
  async function check(first) {
    try {
      const r = await fetch(location.pathname + '?_v=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
      const lm = Date.parse(r.headers.get('last-modified') || '');
      if (!lm || !here || lm <= here + 2000) return;
      if (first && sessionStorage.getItem(K) !== String(lm)) { sessionStorage.setItem(K, String(lm)); location.reload(); return; }
      show();
    } catch (e) {}
  }
  setTimeout(() => check(true), 600);
  setInterval(() => { if (!document.hidden) check(false); }, 3 * 60 * 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(false); });
})();
