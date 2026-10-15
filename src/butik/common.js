import { esc, money, fmtTime } from '../core/util.js';
import { miniSwitch } from '../ui/sections.js';

// Butik serinin ortak parçaları. Görünüm her markanın kendi CSS dosyasında;
// burada yalnızca sipariş akışının ve ortak davranışların beklediği işaretleme var.

export const photoUrl = (conceptId, id) => `foto/${conceptId}/${id}.webp`;

export function photo(c, id, alt, { w = 640, h = 640, cls = '', eager = false } = {}) {
  return `<img class="${cls}" src="${photoUrl(c.id, id)}" width="${w}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

export function hoursText(h) {
  return `${fmtTime(h.open)}–${fmtTime(h.close)}`;
}

export function deliveryText(d) {
  return `En az sepet ${money(d.min)}. ${money(d.freeOver)} ve üzerinde teslimat ücretsiz, altında ${money(d.fee)}.`;
}

export function mapsUrl(c) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.contact.mapsQuery)}`;
}

// SSS: davranışı ortak initFaq verir
export function faqList(items, cls = '') {
  return `
  <div class="faq__list ${cls}">
    ${items
      .map(
        (it, i) => `
      <div class="faq-item">
        <button class="faq-item__q" type="button" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
          <span>${esc(it.q)}</span><span class="faq-item__icon" aria-hidden="true"></span>
        </button>
        <div class="faq-item__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><p>${esc(it.a)}</p></div>
      </div>`
      )
      .join('')}
  </div>`;
}

// Mobil menü: ortak initAnchors açıp kapatır
export function mobileNav(c, cls, cta) {
  const links = c.nav.map((n) => `<a href="${n.href}" data-scroll>${esc(n.label)}</a>`).join('');
  return `
  <div class="mnav ${cls}" id="mnav" aria-hidden="true">
    <nav class="mnav__links" aria-label="Mobil menü">${links}</nav>
    <div class="mnav__foot">
      <span class="b-status" data-open-status><span class="b-status__dot"></span><span data-open-label>…</span></span>
      <a class="btn btn--block" href="#menu" data-scroll>${esc(cta)}</a>
    </div>
  </div>`;
}

export function navLinks(c) {
  return c.nav.map((n) => `<a href="${n.href}" data-scroll>${esc(n.label)}</a>`).join('');
}

export function footerBottom(c) {
  const year = new Date().getFullYear();
  return `
    <div class="b-footer__legal">
      <span>© ${year} ${esc(c.brand.full)}, Konya Ereğli</span>
      <span>Bu site bir prototiptir. Fiyatlar, adres ve iletişim bilgileri temsilîdir.</span>
    </div>
    ${miniSwitch(c.id)}`;
}

// Kâğıt/keçe dokusu için küçük, tekrar eden gürültü görseli (bir kez üretilir)
export function grain({ size = 160, alpha = 0.07, seed = 7 } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = rnd() > 0.5 ? 255 : 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = Math.round(rnd() * 255 * alpha);
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

// Butonun ekrandaki merkezini döndürür (ekleme animasyonları için)
export function centerOf(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
