import { icon } from '../core/icons.js';
import { logo } from '../core/logos.js';
import { esc, money, fmtTime } from '../core/util.js';
import { thumbImg, overlays, miniSwitch } from './sections.js';

// Premium seri: sade, editoryal düzen. Davranışlar ortak modüllerden gelir
// (sipariş akışı, menü çubuğu, SSS, karusel), görünüm premium.css'te.

const plus = icon.plus;

function header(c) {
  const links = c.nav.map((n) => `<a href="${n.href}" data-scroll>${esc(n.label)}</a>`).join('');
  return `
  <a class="skip-link" href="#menu" data-scroll>Menüye geç</a>
  <header class="site-header p-header" id="site-header">
    <div class="wrap p-header__in">
      <a class="p-header__logo" href="#top" data-scroll aria-label="${esc(c.brand.full)} ana sayfa">${logo(c.id, 'hdr')}</a>
      <nav class="p-nav" aria-label="Ana menü">${links}</nav>
      <div class="p-header__actions">
        <span class="p-status" data-open-status><span class="status-pill__dot"></span><span data-open-label>…</span></span>
        <button class="cart-btn p-cart" type="button" data-open-cart aria-label="Sepeti aç">
          <span>Sepet</span><span class="p-cart__count" data-cart-count>0</span>
        </button>
        <button class="p-burger burger" type="button" data-burger aria-label="Menüyü aç" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="mnav p-mnav" id="mnav" aria-hidden="true">
    <nav class="mnav__links" aria-label="Mobil menü">${links}</nav>
    <div class="mnav__foot">
      <span class="p-status" data-open-status><span class="status-pill__dot"></span><span data-open-label>…</span></span>
      <a class="p-btn p-btn--block" href="#menu" data-scroll>${esc(c.hero.ctaPrimary)}</a>
    </div>
  </div>`;
}

function hero(c) {
  const h = c.hero;
  return `
  <section class="p-hero" id="top" aria-label="Giriş" data-scene-zone>
    <div class="wrap p-hero__wrap">
      <div class="p-hero__content hero__content">
        <span class="p-kicker" data-hero-anim>${esc(h.eyebrow)}</span>
        <h1 class="p-display p-hero__title" data-hero-title>${h.titleLines.map((l) => `<span class="line">${l}</span>`).join('')}</h1>
        <p class="p-lead p-hero__text" data-hero-anim>${esc(h.text)}</p>
        <div class="p-hero__ctas" data-hero-anim>
          <a class="p-btn" href="#menu" data-scroll>${esc(h.ctaPrimary)}</a>
          <a class="p-link" href="#${c.chapters.id}" data-scroll>${esc(h.ctaSecondary)} ${icon.arrow}</a>
        </div>
      </div>
    </div>
    <div class="wrap p-hero__meta" data-hero-anim>
      <span><em>Saatler</em>${fmtTime(c.hours.open)}–${fmtTime(c.hours.close)}</span>
      <span><em>Teslimat</em>${esc(c.delivery.eta)}</span>
      <span><em>Adres</em>${esc(c.contact.address)}</span>
    </div>
  </section>`;
}

function manifesto(c) {
  const m = c.manifesto;
  return `
  <section class="p-manifesto" aria-label="${esc(m.kicker)}">
    <div class="wrap p-narrow">
      <span class="p-kicker" data-reveal>${esc(m.kicker)}</span>
      <p class="p-manifesto__text" data-manifesto>${esc(m.text)}</p>
      <p class="p-manifesto__sign" data-reveal>${esc(m.sign)}</p>
    </div>
  </section>`;
}

function chapters(c) {
  const ch = c.chapters;
  return `
  <section class="p-chapters" id="${ch.id}" aria-label="${esc(ch.kicker)}" data-scene-zone>
    <div class="wrap">
      <header class="p-chapters__head">
        <span class="p-kicker" data-reveal>${esc(ch.kicker)}</span>
        <h2 class="p-h2" data-split>${ch.title}</h2>
      </header>
      ${ch.items
        .map(
          (it, i) => `
        <article class="p-chapter" data-chapter="${i}">
          <div class="p-chapter__card" data-reveal>
            <span class="p-chapter__no">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="p-h3">${esc(it.title)}</h3>
            <p>${esc(it.text)}</p>
            ${it.note ? `<p class="p-chapter__note">${esc(it.note)}</p>` : ''}
          </div>
        </article>`
        )
        .join('')}
    </div>
  </section>`;
}

function signature(c, catalog) {
  const s = c.signature;
  const items = c.deals.items.map((id) => catalog.get(id)).filter(Boolean);
  return `
  <section class="p-signature" id="secki" aria-label="${esc(s.kicker)}" data-carousel>
    <div class="wrap">
      <div class="p-section-head">
        <div>
          <span class="p-kicker" data-reveal>${esc(s.kicker)}</span>
          <h2 class="p-h2" data-split>${s.title}</h2>
        </div>
        <div class="p-section-head__side">
          <p class="p-lead" data-reveal>${esc(s.text)}</p>
          <div class="p-arrows">
            <button type="button" data-carousel-prev aria-label="Önceki">${icon.arrow}</button>
            <button type="button" data-carousel-next aria-label="Sonraki">${icon.arrow}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="p-signature__track" data-carousel-track>
      ${items
        .map(
          (p) => `
        <article class="p-feature" data-reveal-card>
          <button class="p-feature__media" type="button" data-product="${esc(p.id)}" aria-label="${esc(p.name)} seçenekleri">
            ${thumbImg(p.id, p.name)}
            ${p.dealTag ? `<span class="p-feature__tag">${esc(p.dealTag)}</span>` : ''}
          </button>
          <div class="p-feature__body">
            <div class="p-feature__row"><h3 class="p-h4">${esc(p.name)}</h3><span class="p-price">${money(p.price)}</span></div>
            <p>${esc(p.desc)}</p>
            <button class="p-textbtn" type="button" data-product="${esc(p.id)}">Seçenekler ve sipariş ${icon.arrow}</button>
          </div>
        </article>`
        )
        .join('')}
    </div>
  </section>`;
}

function menuItem(p) {
  const tags = (p.tags || []).map((t) => `<span>${esc(t.text)}</span>`).join('');
  return `
  <li class="pm-item">
    <button class="pm-item__main" type="button" data-product="${esc(p.id)}">
      <span class="pm-item__thumb">${thumbImg(p.id, p.name)}</span>
      <span class="pm-item__text">
        <span class="pm-item__top">
          <span class="pm-item__name">${esc(p.name)}</span>
          <span class="pm-item__dots" aria-hidden="true"></span>
          <span class="pm-item__price">${money(p.price)}</span>
        </span>
        <span class="pm-item__desc">${esc(p.desc)}</span>
        ${tags ? `<span class="pm-item__tags">${tags}</span>` : ''}
      </span>
    </button>
    <button class="pm-item__add" type="button" data-quick-add="${esc(p.id)}" aria-label="${esc(p.name)} sepete ekle">${plus}</button>
  </li>`;
}

function menu(c) {
  const m = c.menu;
  return `
  <section class="p-menu" id="menu" aria-label="Menü">
    <div class="wrap">
      <div class="p-section-head">
        <div>
          <span class="p-kicker" data-reveal>${esc(m.eyebrow)}</span>
          <h2 class="p-h2" data-split>${m.title}</h2>
        </div>
        <p class="p-lead" data-reveal>${esc(m.text)}</p>
      </div>
    </div>
    <div class="p-menu-nav" data-menu-nav>
      <div class="wrap">
        <div class="p-menu-nav__list" data-menu-nav-list>
          ${m.categories.map((cat, i) => `<button class="p-tab${i === 0 ? ' is-active' : ''}" type="button" data-cat-link="${cat.id}">${esc(cat.name)}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="wrap p-menu__body">
      ${m.categories
        .map(
          (cat) => `
        <section class="p-cat" id="kat-${cat.id}" data-cat="${cat.id}" aria-label="${esc(cat.name)}">
          <header class="p-cat__head">
            <h3 class="p-h3">${esc(cat.name)}</h3>
            ${cat.note ? `<p>${esc(cat.note)}</p>` : ''}
          </header>
          <ul class="p-list">${cat.products.map(menuItem).join('')}</ul>
        </section>`
        )
        .join('')}
    </div>
  </section>`;
}

function visit(c) {
  const v = c.visit;
  const d = c.delivery;
  const ct = c.contact;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ct.mapsQuery)}`;
  return `
  <section class="p-visit" id="iletisim" aria-label="${esc(v.kicker)}">
    <div class="wrap p-visit__grid">
      <div class="p-visit__intro">
        <span class="p-kicker" data-reveal>${esc(v.kicker)}</span>
        <h2 class="p-h2" data-split>${v.title}</h2>
        ${v.paragraphs.map((p) => `<p class="p-lead" data-reveal>${esc(p)}</p>`).join('')}
      </div>
      <dl class="p-facts">
        <div data-reveal><dt>Saatler</dt><dd>${fmtTime(c.hours.open)}–${fmtTime(c.hours.close)}<small>${esc(c.hours.label)}${c.hours.extra ? ' · ' + esc(c.hours.extra) : ''}</small><span class="open-badge" data-open-badge>…</span></dd></div>
        <div data-reveal><dt>Adres</dt><dd>${esc(ct.address)}<small>${esc(ct.addressNote)} <a href="${mapsUrl}" target="_blank" rel="noopener">Haritada aç</a></small></dd></div>
        <div data-reveal><dt>Paket servis</dt><dd>${esc(d.eta)}<small>En az sepet ${money(d.min)} · ${money(d.freeOver)} ve üzeri teslimat ücretsiz, altında ${money(d.fee)}</small></dd></div>
        <div data-reveal><dt>Gel-al</dt><dd>${esc(d.pickupEta)}<small>Siparişiniz hazır olduğunda sizi bekliyor olacak.</small></dd></div>
        <div data-reveal><dt>Telefon</dt><dd>${esc(ct.phoneDisplay)}<small>${esc(ct.phoneNote)}</small></dd></div>
      </dl>
    </div>
  </section>`;
}

function faq(c) {
  const f = c.faq;
  return `
  <section class="p-faq" id="sss" aria-label="Sık sorulan sorular">
    <div class="wrap p-faq__grid">
      <div>
        <span class="p-kicker" data-reveal>${esc(f.eyebrow)}</span>
        <h2 class="p-h2" data-split>${f.title}</h2>
      </div>
      <div class="faq__list">
        ${f.items
          .map(
            (it, i) => `
          <div class="faq-item" data-reveal>
            <button class="faq-item__q" type="button" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
              <span>${esc(it.q)}</span><span class="faq-item__icon" aria-hidden="true"></span>
            </button>
            <div class="faq-item__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><p>${esc(it.a)}</p></div>
          </div>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

function closing(c) {
  const t = c.cta;
  return `
  <section class="p-closing" aria-label="Sipariş çağrısı">
    <div class="wrap p-narrow">
      <h2 class="p-display p-closing__title" data-split>${t.title}</h2>
      <p class="p-lead" data-reveal>${esc(t.text)}</p>
      <div data-reveal><a class="p-btn" href="#menu" data-scroll>${esc(t.button)}</a></div>
    </div>
  </section>`;
}

function footer(c) {
  const ct = c.contact;
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer p-footer">
    <div class="wrap">
      <div class="p-footer__grid">
        <div class="p-footer__brand">
          ${logo(c.id, 'ftr')}
          <p>${esc(c.footer.about)}</p>
        </div>
        <div class="footer__col">
          <h3>Keşfet</h3>
          <ul>${c.nav.map((n) => `<li><a href="${n.href}" data-scroll>${esc(n.label)}</a></li>`).join('')}<li><a href="#sss" data-scroll>Sık sorulanlar</a></li></ul>
        </div>
        <div class="footer__col">
          <h3>Saatler</h3>
          <ul><li>${esc(c.hours.label)}</li><li>${fmtTime(c.hours.open)}–${fmtTime(c.hours.close)}</li>${c.hours.extra ? `<li>${esc(c.hours.extra)}</li>` : ''}</ul>
        </div>
        <div class="footer__col">
          <h3>İletişim</h3>
          <ul><li>${esc(ct.address)}</li><li>${esc(ct.phoneDisplay)}</li></ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${year} ${esc(c.brand.full)} · Konya Ereğli</span>
        <span>Bu site bir prototiptir; fiyatlar, adres ve iletişim bilgileri temsilîdir.</span>
      </div>
      ${miniSwitch(c.id)}
    </div>
  </footer>`;
}

export function page(c, catalog) {
  return [
    header(c),
    '<main id="main">',
    hero(c),
    manifesto(c),
    chapters(c),
    signature(c, catalog),
    menu(c),
    visit(c),
    faq(c),
    closing(c),
    '</main>',
    footer(c),
    overlays(c),
  ].join('');
}

export function initHeroScroll(gsap, reduced) {
  if (reduced) return;
  gsap.to('.p-hero__content', {
    yPercent: -10,
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.p-hero', start: 'top top', end: '65% top', scrub: true },
  });
  gsap.to('.p-hero__meta', {
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.p-hero', start: '5% top', end: '30% top', scrub: true },
  });
}
