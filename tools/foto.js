// Butik serinin ürün fotoğraflarını 3D modellerden üretip public/foto altına kaydeder.
// Yalnızca geliştirme sunucusunda çalışır (vite.config.js içindeki /__foto ucu).
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/manrope/index.css';
import '@fontsource-variable/anybody/standard.css';
import '@fontsource-variable/atkinson-hyperlegible-next/wght.css';
import '@fontsource-variable/big-shoulders-display';
import '@fontsource-variable/instrument-sans/standard.css';
import '@fontsource/young-serif/400.css';
import '@fontsource-variable/hanken-grotesk/wght.css';
import { ThumbRenderer } from '../src/three/stage.js';

const sets = {
  'cigkofte-butik': () => import('../src/concepts/cigkofte-butik/photos.js'),
  'durum-butik': () => import('../src/concepts/durum-butik/photos.js'),
  'kafe-butik': () => import('../src/concepts/kafe-butik/photos.js'),
};

const q = new URLSearchParams(location.search);
const keys = (q.get('k') || '').split(',').filter((k) => sets[k]);
const only = q.get('id');
const log = document.getElementById('log');
const grid = document.getElementById('grid');
const done = [];
window.__foto = { done, finished: false, errors: [] };

// Ton eşleme zemini bir tık koyulaştırır. Fotoğrafın zemini sayfa rengiyle birebir
// aynı olsun diye köşedeki zemin rengini hedef renge çeken kanal kazancı uygulanır.
async function matchBackground(glCanvas, hex) {
  const w = glCanvas.width;
  const h = glCanvas.height;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(glCanvas, 0, 0);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const at = (x, y) => {
    const i = (y * w + x) * 4;
    return [d[i], d[i + 1], d[i + 2]];
  };
  const corners = [at(3, 3), at(w - 4, 3), at(3, h - 4), at(w - 4, h - 4)];
  const bg = [0, 1, 2].map((k) => corners.map((p) => p[k]).sort((a, b) => a - b)[1]);
  const t = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const chroma = Math.max(...t) - Math.min(...t);
  if (chroma < 40) {
    // Açık, nötre yakın zemin: kanal kazancı her yere uygulanabilir
    const gain = t.map((v, k) => v / Math.max(1, bg[k]));
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, d[i] * gain[0]);
      d[i + 1] = Math.min(255, d[i + 1] * gain[1]);
      d[i + 2] = Math.min(255, d[i + 2] * gain[2]);
    }
  } else {
    // Renkli zemin: yalnızca zemin rengiyle aynı tondaki pikseller (zemin, gölgesi,
    // camdan görünen zemin) hedef renge taşınır; nesnelerin rengi korunur.
    const BB = bg[0] * bg[0] + bg[1] * bg[1] + bg[2] * bg[2];
    const smooth = (a, b, x) => {
      const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return u * u * (3 - 2 * u);
    };
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const k = (r * bg[0] + g * bg[1] + b * bg[2]) / BB;
      const res = Math.hypot(r - k * bg[0], g - k * bg[1], b - k * bg[2]);
      const w = 1 - smooth(8, 30, res);
      if (w <= 0) continue;
      d[i] = Math.min(255, r + (k * t[0] - r) * w);
      d[i + 1] = Math.min(255, g + (k * t[1] - g) * w);
      d[i + 2] = Math.min(255, b + (k * t[2] - b) * w);
    }
  }
  ctx.putImageData(img, 0, 0);
  return new Promise((res) => c.toBlob(res, 'image/webp', 0.86));
}

async function run() {
  if (!keys.length) {
    log.textContent = 'Konsept seçin: ?k=' + Object.keys(sets).join(',');
    return;
  }
  for (const k of keys) {
    const set = (await sets[k]()).default;
    await Promise.all((set.fonts || []).map((f) => document.fonts.load(f)));
    const renderers = new Map();
    const items = set.items.filter((it) => !only || it.id === only);
    for (const it of items) {
      const w = it.w || 640;
      const h = it.h || w;
      const key = `${w}x${h}:${it.alpha ? 'a' : 's'}:${it.bg || ''}`;
      if (!renderers.has(key)) {
        const studio = it.alpha ? null : { ...set.studio, ...(it.bg ? { inner: it.bg, outer: it.bg } : {}) };
        renderers.set(key, new ThumbRenderer(w, h, { ...set.opts, studio, format: 'image/webp', quality: 0.86 }));
      }
      log.textContent = `${k}: ${it.id} çiziliyor…`;
      try {
        const tr = renderers.get(key);
        let blob = await tr.renderBlob(it.build, it.view);
        const target = it.alpha ? null : it.bg || set.studio.inner;
        if (target) blob = await matchBackground(tr.renderer.domElement, target);
        const res = await fetch(`/__foto?path=${encodeURIComponent(`${k}/${it.id}.webp`)}`, { method: 'POST', body: blob });
        if (!res.ok) throw new Error(await res.text());
        const url = URL.createObjectURL(blob);
        grid.insertAdjacentHTML('beforeend', `<figure><img src="${url}" alt=""><figcaption>${k}/${it.id} · ${Math.round(blob.size / 1024)} KB</figcaption></figure>`);
        done.push(`${k}/${it.id}:${Math.round(blob.size / 1024)}`);
      } catch (e) {
        console.error(it.id, e);
        window.__foto.errors.push(`${k}/${it.id}: ${e.message}`);
      }
    }
    renderers.forEach((r) => r.dispose());
  }
  log.textContent = `Bitti: ${done.length} fotoğraf, ${window.__foto.errors.length} hata.`;
  window.__foto.finished = true;
}

run();
