import { icon } from '../core/icons.js';
import { logo } from '../core/logos.js';
import { $, $$, esc, money } from '../core/util.js';
import { overlays } from '../ui/sections.js';
import { photo, hoursText, deliveryText, mapsUrl, faqList, mobileNav, navLinks, footerBottom, grain, centerOf } from './common.js';

// İSOT: sayfanın tek cesur öğesi acı seçici. Seçim sitenin rengini, başlığın
// kalınlığını ve sepete eklenen her ürünün acı derecesini birlikte değiştirir.

const pepper = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.3 4.4c2 .5 2.8 2.4 2.2 4.5-.8 2.8-3.4 5.2-7.9 5.8-.7.1-.9-.5-.3-.8 2.9-1.8 4-4 4.1-6.7 0-1.8.5-3.2 1.9-2.8Z"/><path d="M9.6 4.6c0-1.1.6-2 1.5-2.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';

function header(c) {
  return `
  <a class="skip-link" href="#menu" data-scroll>Menüye geç</a>
  <header class="site-header i-header" id="site-header">
    <div class="wrap i-header__in">
      <a class="i-header__logo" href="#top" data-scroll aria-label="${esc(c.brand.full)}, sayfanın başı">${logo(c.id)}</a>
      <nav class="i-nav" aria-label="Ana menü">${navLinks(c)}</nav>
      <div class="i-header__actions">
        <button class="cart-btn i-cart" type="button" data-open-cart aria-label="Sepeti aç">
          <span class="i-cart__label">Sepet</span><span class="i-cart__count" data-cart-count>0</span>
        </button>
        <button class="burger i-burger" type="button" data-burger aria-label="Menüyü aç" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
      </div>
    </div>
  </header>
  ${mobileNav(c, 'i-mnav', c.hero.cta)}`;
}

function dial(c, name) {
  return `
  <fieldset class="i-dial" data-heat-dial>
    <legend class="sr-only">Acı derecesi</legend>
    <span class="i-dial__thumb" aria-hidden="true"></span>
    ${c.heat.levels
      .map(
        (l, i) => `
      <label class="i-dial__opt">
        <input type="radio" name="${name}" value="${l.id}" data-heat-input>
        <span class="i-dial__name">${esc(l.label)}</span>
        <span class="i-dial__peppers" aria-hidden="true">${pepper.repeat(i + 1)}</span>
      </label>`
      )
      .join('')}
  </fieldset>`;
}

function hero(c) {
  return `
  <section class="i-hero" id="top" aria-labelledby="i-hero-title">
    <div class="wrap i-hero__grid">
      <h1 class="i-hero__title" id="i-hero-title">${c.hero.title.map((l) => `<span class="i-line"><span>${esc(l)}</span></span>`).join('')}</h1>
      <figure class="i-hero__plate">
        ${photo(c, 'hero', 'Marul yaprakları üzerinde avuçta sıkılmış çiğ köfteler, limon ve nar taneleri', { w: 960, h: 960, eager: true, cls: 'i-hero__img' })}
        <div class="i-flakes" data-flakes aria-hidden="true"></div>
      </figure>
      <div class="i-hero__control">
        ${dial(c, 'heat')}
        <p class="i-hero__note" data-heat-note aria-live="polite"></p>
        <div class="i-hero__row">
          <a class="i-btn" href="#menu" data-scroll>${esc(c.hero.cta)}</a>
          <span class="i-hero__hours">${esc(c.hours.label)} ${hoursText(c.hours)}</span>
        </div>
      </div>
    </div>
  </section>`;
}

function item(c, p, featured) {
  const tag = p.tags?.[0]?.text;
  return `
  <li class="i-item${featured ? ' i-item--feature' : ''}">
    <button class="i-item__main" type="button" data-product="${esc(p.id)}">
      <span class="i-item__img">${photo(c, p.id, '', featured ? { w: 640, h: 640 } : {})}</span>
      <span class="i-item__text">
        <span class="i-item__name">${esc(p.name)}${tag ? ` <span class="i-item__tag">${esc(tag)}</span>` : ''}</span>
        <span class="i-item__desc">${esc(p.desc)}</span>
        <span class="i-item__price">${money(p.price)}</span>
      </span>
    </button>
    <button class="i-item__add" type="button" data-quick-add="${esc(p.id)}" aria-label="${esc(p.name)} sepete ekle">${icon.plus}</button>
  </li>`;
}

function menu(c) {
  const m = c.menu;
  return `
  <section class="i-menu" id="menu" aria-labelledby="i-menu-title">
    <div class="wrap i-menu__head">
      <h2 class="i-h2" id="i-menu-title">${esc(m.title)}</h2>
      <p class="i-menu__heat">Acı dereceniz: <strong data-heat-label></strong>. Sepete eklediğiniz her ürüne işlenir. <button type="button" class="i-textbtn" data-heat-jump>Değiştir</button></p>
    </div>
    <div class="i-menu-nav" data-menu-nav>
      <div class="wrap">
        <div class="i-menu-nav__list" data-menu-nav-list>
          ${m.categories.map((cat, i) => `<button class="i-tab${i === 0 ? ' is-active' : ''}" type="button" data-cat-link="${cat.id}">${esc(cat.name)}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="wrap">
      ${m.categories
        .map(
          (cat, ci) => `
        <section class="i-cat" id="kat-${cat.id}" data-cat="${cat.id}" aria-labelledby="kat-${cat.id}-t">
          <header class="i-cat__head">
            <h3 class="i-h3" id="kat-${cat.id}-t">${esc(cat.name)}</h3>
            ${cat.note ? `<p>${esc(cat.note)}</p>` : ''}
          </header>
          <ul class="i-list">${cat.products.map((p, pi) => item(c, p, ci === 0 && pi === 0)).join('')}</ul>
        </section>`
        )
        .join('')}
    </div>
  </section>`;
}

function steps(c) {
  const s = c.steps;
  return `
  <section class="i-steps" id="${s.id}" aria-labelledby="i-steps-title">
    <div class="wrap i-steps__grid">
      <figure class="i-steps__img">${photo(c, 'sikim', 'Avuçta sıkılmış tek parça çiğ köfte; yüzeyinde parmak olukları', { w: 900, h: 900 })}</figure>
      <div>
        <h2 class="i-h2" id="i-steps-title">${esc(s.title)}</h2>
        <ol class="i-steps__list">
          ${s.items.map((it) => `<li><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></li>`).join('')}
        </ol>
      </div>
    </div>
  </section>`;
}

function info(c) {
  const d = c.delivery;
  const ct = c.contact;
  return `
  <section class="i-info" id="teslimat" aria-labelledby="i-info-title">
    <div class="wrap">
      <h2 class="i-h2" id="i-info-title">Teslimat ve saatler</h2>
      <dl class="i-facts">
        <div><dt>Paket servis</dt><dd><strong>${esc(d.eta)}</strong><span>${esc(deliveryText(d))}</span></dd></div>
        <div><dt>Gel-al</dt><dd><strong>${esc(d.pickupEta)}</strong><span>Dükkândan alırsanız sepetinize %${Math.round(d.pickupDiscount * 100)} indirim uygulanır.</span></dd></div>
        <div><dt>Saatler</dt><dd><strong>${hoursText(c.hours)}</strong><span>${esc(c.hours.label)}. <span class="open-badge" data-open-badge>…</span></span></dd></div>
        <div><dt>Adres ve telefon</dt><dd><strong>${esc(ct.phoneDisplay)}</strong><span>${esc(ct.address)}. ${esc(ct.addressNote)} <a href="${mapsUrl(c)}" target="_blank" rel="noopener">Haritada aç</a></span></dd></div>
      </dl>
    </div>
  </section>`;
}

function faq(c) {
  return `
  <section class="i-faq" id="sss" aria-labelledby="i-faq-title">
    <div class="wrap i-faq__grid">
      <h2 class="i-h2" id="i-faq-title">Sık sorulanlar</h2>
      ${faqList(c.faq)}
    </div>
  </section>`;
}

function footer(c) {
  return `
  <footer class="site-footer i-footer">
    <div class="wrap">
      <div class="i-footer__top">
        <div class="i-footer__brand">${logo(c.id)}<p>${esc(c.footer.about)}</p></div>
        <nav class="i-footer__nav" aria-label="Alt menü">${navLinks(c)}</nav>
      </div>
      ${footerBottom(c)}
    </div>
  </footer>`;
}

export function page(c) {
  return [header(c), '<main id="main">', hero(c), menu(c), steps(c), info(c), faq(c), '</main>', footer(c), overlays(c)].join('');
}

// ---------------------------------------------------------------------------
// Davranış
// ---------------------------------------------------------------------------
export function init({ gsap, scroller, concept: c, reduced }) {
  const root = document.documentElement;
  root.style.setProperty('--grain', `url(${grain({ alpha: 0.06 })})`);
  const H = c.heat;
  const ids = H.levels.map((l) => l.id);
  let saved = null;
  try {
    saved = localStorage.getItem(H.storageKey);
  } catch {
    /* gizli sekme */
  }
  let level = ids.includes(saved) ? saved : H.start;

  const note = $('[data-heat-note]');
  const flakeBox = $('[data-flakes]');

  function apply(id, { fall = true, store = true } = {}) {
    root.dataset.heat = id;
    H.option.default = id;
    $$('[data-heat-input]').forEach((r) => (r.checked = r.value === id));
    const lv = H.levels.find((l) => l.id === id);
    note.textContent = lv.note;
    $$('[data-heat-label]').forEach((el) => (el.textContent = lv.label));
    if (store) {
      level = id;
      try {
        localStorage.setItem(H.storageKey, id);
      } catch {
        /* gizli sekme */
      }
    }
    if (fall && !reduced) drop(id);
  }

  // Acı arttıkça tabağa daha çok pul biber düşer; hafifte birkaç nane yaprağı
  const flakeColors = ['#5a0f14', '#8e1a1a', '#3a0a0c', '#a3261c'];
  function drop(id) {
    const n = { hafif: 4, orta: 9, acili: 16, ates: 26 }[id];
    const mint = id === 'hafif';
    const w = flakeBox.clientWidth;
    const h = flakeBox.clientHeight;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      el.className = mint ? 'i-mint' : 'i-flake';
      if (!mint) el.style.background = flakeColors[i % flakeColors.length];
      flakeBox.appendChild(el);
      // tabağın ortasındaki elipse düşsün
      const a = Math.random() * Math.PI * 2;
      const rr = Math.sqrt(Math.random()) * 0.3;
      const x = w * (0.5 + Math.cos(a) * rr);
      const y = h * (0.5 + Math.sin(a) * rr * 0.75);
      const rot = Math.random() * 360;
      gsap
        .timeline({ onComplete: () => el.remove() })
        .fromTo(
          el,
          { x: x + (Math.random() - 0.5) * 60, y: -h * 0.35 - Math.random() * h * 0.3, rotate: rot, autoAlpha: 1, scale: 0.7 + Math.random() * 0.6 },
          { x, y, rotate: rot + (Math.random() - 0.5) * 220, duration: mint ? 1.4 : 0.75 + Math.random() * 0.35, ease: mint ? 'sine.inOut' : 'power2.in', delay: Math.random() * 0.35 }
        )
        .to(el, { autoAlpha: 0, duration: 0.6, delay: mint ? 0.8 : 0.5 });
    }
  }

  $$('[data-heat-input]').forEach((r) => r.addEventListener('change', () => r.checked && apply(r.value)));
  $('[data-heat-jump]')?.addEventListener('click', () => {
    scroller.scrollTo(0);
    setTimeout(() => $('[data-heat-input]:checked')?.focus({ preventScroll: true }), reduced ? 0 : 600);
  });

  // Sepete eklenince düğmeden küçük bir pul biber serpintisi
  document.addEventListener('cart:added', (e) => {
    const from = e.detail.from;
    if (reduced || !from?.isConnected) return;
    const { x, y } = centerOf(from);
    for (let i = 0; i < 8; i++) {
      const el = document.createElement('span');
      el.className = 'i-flake i-flake--burst';
      el.style.background = flakeColors[i % flakeColors.length];
      document.body.appendChild(el);
      const a = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
      const d = 26 + Math.random() * 22;
      gsap
        .timeline({ onComplete: () => el.remove() })
        .set(el, { x, y, rotate: Math.random() * 180 })
        .to(el, { x: x + Math.cos(a) * d, y: y + Math.sin(a) * d - 10, rotate: '+=140', duration: 0.45, ease: 'power3.out' })
        .to(el, { y: '+=26', autoAlpha: 0, duration: 0.45, ease: 'power1.in' });
    }
  });

  // Açılış: seçici hafiften kayıtlı dereceye kadar ısınır
  apply('hafif', { fall: false, store: false });
  if (reduced) apply(level, { fall: false, store: false });

  return {
    intro() {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (reduced) return tl;
      tl.from('#site-header', { yPercent: -100, autoAlpha: 0, duration: 0.8, clearProps: 'transform,opacity,visibility' }, 0);
      tl.from('.i-line > span', { yPercent: 105, duration: 0.9, stagger: 0.1 }, 0.05);
      tl.from('.i-hero__img', { scale: 0.9, autoAlpha: 0, rotate: -8, duration: 1.1 }, 0.1);
      tl.from('.i-hero__control', { y: 18, autoAlpha: 0, duration: 0.8, clearProps: 'transform' }, 0.35);
      const target = ids.indexOf(level);
      for (let i = 1; i <= target; i++) {
        tl.call(() => apply(ids[i], { fall: i === target, store: false }), null, 0.75 + (i - 1) * 0.42);
      }
      if (target === 0) tl.call(() => apply('hafif', { store: false }), null, 0.75);
      return tl;
    },
  };
}
