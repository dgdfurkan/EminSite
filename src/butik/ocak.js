import { logo } from '../core/logos.js';
import { $, esc, money, trUpper } from '../core/util.js';
import { overlays } from '../ui/sections.js';
import { photo, hoursText, deliveryText, mapsUrl, faqList, mobileNav, navLinks, footerBottom, grain } from './common.js';

// OCAK 42: kebapçı duvarındaki harfli keçe pano sayfanın tek cesur öğesi.
// Pano gerçek menüden beslenir; bir satıra dokunmak o ürünü açar.

// Plastik harfler panoya elle dizilmiş gibi: her harf hafif eğik ve kaymış
function letters(text, seed) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return [...text]
    .map((ch) => {
      if (ch === ' ') return '<span class="o-sp"></span>';
      const r = ((rnd() - 0.5) * 5).toFixed(1);
      const y = ((rnd() - 0.5) * 2.4).toFixed(1);
      return `<span class="o-l" style="--r:${r}deg;--y:${y}px">${esc(ch)}</span>`;
    })
    .join('');
}

function header(c) {
  return `
  <a class="skip-link" href="#menu" data-scroll>Menüye geç</a>
  <header class="site-header o-header" id="site-header">
    <div class="wrap o-header__in">
      <a class="o-header__logo" href="#top" data-scroll aria-label="${esc(c.brand.full)}, sayfanın başı">${logo(c.id)}</a>
      <nav class="o-nav" aria-label="Ana menü">${navLinks(c)}</nav>
      <div class="o-header__actions">
        <span class="b-status o-status" data-open-status><span class="b-status__dot"></span><span data-open-label>…</span></span>
        <button class="cart-btn o-cart" type="button" data-open-cart aria-label="Sepeti aç">
          <span>Sepet</span><span class="o-cart__count" data-cart-count>0</span>
        </button>
        <button class="burger o-burger" type="button" data-burger aria-label="Menüyü aç" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
      </div>
    </div>
  </header>
  ${mobileNav(c, 'o-mnav', c.hero.cta)}`;
}

function board(c, catalog) {
  const b = c.hero.board;
  const rows = b.items.map((id) => catalog.get(id)).filter(Boolean);
  return `
  <div class="o-board" aria-label="Bugün ocakta">
    <div class="o-board__felt">
      <p class="o-board__row o-board__row--head" aria-hidden="true"><span class="o-board__name">${letters(b.head, 1)}</span></p>
      ${rows
        .map(
          (p, i) => `
        <button class="o-board__row" type="button" data-product="${esc(p.id)}" aria-label="${esc(p.name)}, ${money(p.price)}">
          <span class="o-board__name" aria-hidden="true">${letters(p.board || trUpper(p.name), i + 2)}</span>
          <span class="o-board__price" aria-hidden="true">${letters(String(p.price), i + 20)}</span>
        </button>`
        )
        .join('')}
    </div>
  </div>`;
}

function hero(c, catalog) {
  const h = c.hero;
  return `
  <section class="o-hero" id="top" aria-labelledby="o-hero-title">
    <div class="wrap o-hero__grid">
      <div class="o-hero__copy">
        <h1 class="o-hero__title" id="o-hero-title">${esc(h.title)}</h1>
        <p class="o-hero__text">${esc(h.text)}</p>
        <div class="o-hero__ctas">
          <a class="o-btn" href="#menu" data-scroll>${esc(h.cta)}</a>
          <a class="o-btn o-btn--line" href="#saatler" data-scroll>Saatler ve adres</a>
        </div>
      </div>
      ${board(c, catalog)}
    </div>
    <div class="o-counter" aria-hidden="true">
      <div class="wrap o-counter__in">
        ${photo(c, 'hero', '', { w: 1100, h: 700, eager: true, cls: 'o-counter__food' })}
      </div>
    </div>
  </section>`;
}

function item(c, p) {
  const tag = p.tags?.[0]?.text;
  return `
  <li class="o-item">
    <button class="o-item__main" type="button" data-product="${esc(p.id)}">
      <span class="o-item__img">${photo(c, p.id, '', { w: 720, h: 540 })}</span>
      <span class="o-item__text">
        <span class="o-item__name">${esc(p.name)}</span>
        ${tag ? `<span class="o-item__tag">${esc(tag)}</span>` : ''}
        <span class="o-item__desc">${esc(p.desc)}</span>
      </span>
    </button>
    <div class="o-item__foot">
      <span class="o-item__price">${money(p.price)}</span>
      <button class="o-item__add" type="button" data-quick-add="${esc(p.id)}" aria-label="${esc(p.name)} sepete ekle">Ekle</button>
    </div>
  </li>`;
}

function menu(c) {
  const m = c.menu;
  return `
  <section class="o-menu" id="menu" aria-labelledby="o-menu-title">
    <div class="wrap">
      <h2 class="o-h2" id="o-menu-title">${esc(m.title)}</h2>
    </div>
    <div class="o-menu-nav" data-menu-nav>
      <div class="wrap">
        <div class="o-menu-nav__list" data-menu-nav-list>
          ${m.categories.map((cat, i) => `<button class="o-tab${i === 0 ? ' is-active' : ''}" type="button" data-cat-link="${cat.id}">${esc(cat.name)}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="wrap">
      ${m.categories
        .map(
          (cat) => `
        <section class="o-cat" id="kat-${cat.id}" data-cat="${cat.id}" aria-labelledby="kat-${cat.id}-t">
          <header class="o-cat__head">
            <h3 class="o-h3" id="kat-${cat.id}-t">${esc(cat.name)}</h3>
            ${cat.note ? `<p>${esc(cat.note)}</p>` : ''}
          </header>
          <ul class="o-grid">${cat.products.map((p) => item(c, p)).join('')}</ul>
        </section>`
        )
        .join('')}
    </div>
  </section>`;
}

function steps(c) {
  const s = c.steps;
  return `
  <section class="o-steps" id="${s.id}" aria-labelledby="o-steps-title">
    <div class="wrap">
      <h2 class="o-h2" id="o-steps-title">${esc(s.title)}</h2>
      <ol class="o-steps__list">
        ${s.items.map((it) => `<li class="o-tile"><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></li>`).join('')}
      </ol>
    </div>
  </section>`;
}

function info(c) {
  const d = c.delivery;
  const ct = c.contact;
  return `
  <section class="o-info" id="saatler" aria-labelledby="o-info-title">
    <div class="wrap o-info__grid">
      <h2 class="o-h2" id="o-info-title">Saatler ve teslimat</h2>
      <dl class="o-facts">
        <div><dt>Ocak açık</dt><dd><strong>${hoursText(c.hours)}</strong>${esc(c.hours.label)}. ${esc(c.hours.extra)}. <span class="open-badge" data-open-badge>…</span></dd></div>
        <div><dt>Paket servis</dt><dd><strong>${esc(d.eta)}</strong>${esc(deliveryText(d))}</dd></div>
        <div><dt>Gel-al</dt><dd><strong>${esc(d.pickupEta)}</strong>Siparişiniz hazır olunca tezgâhta sizi bekler.</dd></div>
        <div><dt>Adres</dt><dd><strong>${esc(ct.phoneDisplay)}</strong>${esc(ct.address)}. ${esc(ct.addressNote)} <a href="${mapsUrl(c)}" target="_blank" rel="noopener">Haritada aç</a></dd></div>
      </dl>
    </div>
  </section>`;
}

function faq(c) {
  return `
  <section class="o-faq" id="sss" aria-labelledby="o-faq-title">
    <div class="wrap o-faq__grid">
      <h2 class="o-h2" id="o-faq-title">Sık sorulanlar</h2>
      ${faqList(c.faq)}
    </div>
  </section>`;
}

function footer(c) {
  return `
  <footer class="site-footer o-footer">
    <div class="wrap">
      <div class="o-footer__top">
        <div class="o-footer__brand">${logo(c.id)}<p>${esc(c.footer.about)}</p></div>
        <nav class="o-footer__nav" aria-label="Alt menü">${navLinks(c)}</nav>
      </div>
      ${footerBottom(c)}
    </div>
  </footer>`;
}

export function page(c, catalog) {
  return [header(c), '<main id="main">', hero(c, catalog), menu(c), steps(c), info(c), faq(c), '</main>', footer(c), overlays(c)].join('');
}

// ---------------------------------------------------------------------------
// Davranış
// ---------------------------------------------------------------------------
export function init({ gsap, concept: c, reduced }) {
  document.documentElement.style.setProperty('--felt-grain', `url(${grain({ alpha: 0.16, seed: 3 })})`);

  // Sepete eklenince sayaç, pano harfi gibi takılır
  document.addEventListener('cart:added', () => {
    if (reduced) return;
    const n = $('.o-cart__count');
    if (n) gsap.fromTo(n, { rotateX: -90, y: -6 }, { rotateX: 0, y: 0, duration: 0.6, ease: 'back.out(2.4)', transformPerspective: 200 });
  });

  return {
    intro() {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (reduced) return tl;
      tl.from('.o-hero__title', { y: 24, autoAlpha: 0, duration: 0.8 }, 0);
      tl.from(['.o-hero__text', '.o-hero__ctas'], { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.15);
      tl.from('.o-board', { y: 20, autoAlpha: 0, duration: 0.7 }, 0.05);
      // Harfler satır satır panoya takılır
      tl.from(
        '.o-board .o-l',
        { y: -16, rotate: () => (Math.random() - 0.5) * 40, autoAlpha: 0, duration: 0.45, ease: 'back.out(2)', stagger: { each: 0.011 } },
        0.35
      );
      tl.from('.o-counter__food', { xPercent: 14, autoAlpha: 0, duration: 1, ease: 'power3.out' }, 0.5);
      return tl;
    },
  };
}
