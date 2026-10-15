import { icon } from '../core/icons.js';
import { logo, mark } from '../core/logos.js';
import { CONCEPTS, CONCEPT_GROUPS, conceptUrl } from '../core/concepts.js';
import { esc, money, fmtTime } from '../core/util.js';

// Bölümlerin HTML çıktısı. Davranışlar ayrı modüllerde bağlanır.

export function header(c) {
  const links = c.nav.map((n) => `<a href="${n.href}" data-scroll>${esc(n.label)}</a>`).join('');
  return `
  <a class="skip-link" href="#menu" data-scroll>Menüye geç</a>
  <header class="site-header" id="site-header">
    <div class="wrap">
      <a class="site-header__logo" href="#top" data-scroll aria-label="${esc(c.brand.full)} ana sayfa">${logo(c.id, 'hdr')}</a>
      <nav class="site-nav" aria-label="Ana menü">${links}</nav>
      <div class="site-header__actions">
        <span class="status-pill" data-open-status><span class="status-pill__dot"></span><span data-open-label>…</span></span>
        <button class="cart-btn" type="button" data-open-cart aria-label="Sepeti aç">
          ${icon.bag}<span class="cart-btn__label">Sepet</span><span class="cart-btn__count" data-cart-count>0</span>
        </button>
        <button class="icon-btn burger" type="button" data-burger aria-label="Menüyü aç" aria-expanded="false" aria-controls="mnav">${icon.menu}</button>
      </div>
    </div>
  </header>
  <div class="mnav" id="mnav" aria-hidden="true">
    <nav class="mnav__links" aria-label="Mobil menü">${links}</nav>
    <div class="mnav__foot">
      <span class="status-pill" style="display:inline-flex;justify-self:start" data-open-status><span class="status-pill__dot"></span><span data-open-label>…</span></span>
      <a class="btn btn--block" href="#menu" data-scroll>${esc(c.hero.ctaPrimary)} ${icon.arrow}</a>
    </div>
  </div>`;
}

export function backdrop(c) {
  const glows = c.backdrop?.glows || [];
  return `
    ${glows
      .map(
        (g) =>
          `<div class="backdrop__glow" style="left:${g.x};top:${g.y};width:${g.size};height:${g.size};background:radial-gradient(circle, ${g.color} 0%, transparent 68%);opacity:${g.opacity ?? 0.5}"></div>`
      )
      .join('')}
    <div class="backdrop__word" data-backdrop-word>${esc(c.brand.backdropWord)}</div>`;
}

function badge(c) {
  const text = c.brand.badgeText;
  return `
  <div class="hero__badge" data-hero-badge aria-hidden="true">
    <svg class="badge-ring" viewBox="0 0 200 200">
      <defs><path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
      <text><textPath href="#badge-circle" textLength="488">${esc(text)}</textPath></text>
    </svg>
    <div class="hero__badge-core">${c.brand.badgeIcon || icon.star}</div>
  </div>`;
}

export function hero(c) {
  const h = c.hero;
  return `
  <section class="hero" id="top" aria-label="Giriş">
    <div class="wrap">
      <div class="hero__content">
        <span class="eyebrow" data-hero-anim>${esc(h.eyebrow)}</span>
        <h1 class="h1 hero__title" data-hero-title>${h.titleLines.map((l) => `<span class="line">${l}</span>`).join('')}</h1>
        <p class="lead hero__text" data-hero-anim>${esc(h.text)}</p>
        <div class="hero__ctas" data-hero-anim>
          <a class="btn" href="#menu" data-scroll data-magnetic>${esc(h.ctaPrimary)} ${icon.arrow}</a>
          <a class="btn btn--ghost" href="#${c.story.id}" data-scroll>${esc(h.ctaSecondary)}</a>
        </div>
        <ul class="hero__chips" data-hero-anim>
          ${h.chips.map((ch) => `<li class="chip">${icon[ch.icon] || ''}${esc(ch.text)}</li>`).join('')}
        </ul>
      </div>
    </div>
    ${badge(c)}
    <div class="hero__scroll" aria-hidden="true"><span class="hero__scroll-line"></span>Kaydırın</div>
  </section>`;
}

export function marquee(c) {
  const row = (items, sep) =>
    items.map((t) => `<span class="marquee__item">${esc(t)}${sep}</span>`).join('');
  const sepIcon = c.marquee.icon || icon.sparkle;
  return `
  <div class="marquee" aria-hidden="true">
    <div class="marquee__band" data-marquee="1"><div class="marquee__track">${row(c.marquee.a, sepIcon)}</div></div>
    <div class="marquee__band marquee__band--b" data-marquee="-1"><div class="marquee__track">${row(c.marquee.b, sepIcon)}</div></div>
  </div>`;
}

export function story(c) {
  const s = c.story;
  return `
  <section class="story" id="${s.id}" aria-label="${esc(s.title)}">
    <div class="wrap">
      <div class="story__panel" data-story-panel>
        <div class="story__head">
          <span class="eyebrow">${esc(s.eyebrow)}</span>
          <h2 class="h2 story__title">${s.title}</h2>
        </div>
        <ol class="story__index" aria-hidden="true">${s.steps.map(() => '<li><span></span></li>').join('')}</ol>
        <ol class="story__labels" aria-hidden="true">${s.steps.map((st, i) => `<li${i === 0 ? ' class="is-active"' : ''}>${esc(st.label)}</li>`).join('')}</ol>
        <div class="story__steps">
          ${s.steps
            .map(
              (st, i) => `
            <article class="story-step" data-step="${i}">
              <span class="story-step__no">${String(i + 1).padStart(2, '0')} / ${String(s.steps.length).padStart(2, '0')}</span>
              <h3 class="story-step__title">${esc(st.title)}</h3>
              <p class="story-step__text">${esc(st.text)}</p>
            </article>`
            )
            .join('')}
        </div>
      </div>
    </div>
  </section>`;
}

export function thumbImg(productId, alt = '') {
  return `<span class="thumb-ph" data-thumb-ph="${esc(productId)}"></span><img data-thumb="${esc(productId)}" alt="${esc(alt)}" loading="lazy" decoding="async" hidden>`;
}

export function deals(c, catalog) {
  const d = c.deals;
  const cards = d.items
    .map((id) => {
      const p = catalog.get(id);
      if (!p) return '';
      return `
      <article class="deal-card" data-reveal-card>
        <div class="deal-card__media" style="${p.dealBg ? `--deal-bg:${p.dealBg}` : ''}">
          ${thumbImg(p.id, p.name)}
          ${p.dealTag ? `<span class="tag tag--hot deal-card__tag">${esc(p.dealTag)}</span>` : ''}
        </div>
        <div class="deal-card__body">
          <h3 class="deal-card__title">${esc(p.name)}</h3>
          <p class="deal-card__desc">${esc(p.desc)}</p>
          <div class="deal-card__foot">
            <span class="price price--lg">${money(p.price)}</span>
            <button class="btn btn--sm" type="button" data-product="${esc(p.id)}">Sepete ekle ${icon.plus}</button>
          </div>
        </div>
      </article>`;
    })
    .join('');
  return `
  <section class="deals" id="kampanyalar" aria-label="${esc(d.title)}" data-carousel>
    <div class="deals__inner">
      <div class="wrap">
        <div class="section-head section-head--split">
          <div><span class="eyebrow" data-reveal>${esc(d.eyebrow)}</span><h2 class="h2" data-split style="margin-top:14px">${d.title}</h2></div>
          <div style="display:grid;gap:22px">
            <p class="lead" data-reveal>${esc(d.text)}</p>
            <div class="carousel-nav">
              <button type="button" data-carousel-prev aria-label="Önceki kampanyalar">${icon.arrow}</button>
              <button type="button" data-carousel-next aria-label="Sonraki kampanyalar">${icon.arrow}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="deals__track" data-carousel-track>${cards}</div>
    </div>
  </section>`;
}

export function productCard(p) {
  const tags = (p.tags || [])
    .map((t) => `<span class="tag ${t.kind ? 'tag--' + t.kind : ''}">${esc(t.text)}</span>`)
    .join('');
  return `
  <article class="product-card" data-product="${esc(p.id)}" data-tilt>
    <div class="product-card__media">${thumbImg(p.id, p.name)}</div>
    <div class="product-card__body">
      ${tags ? `<div class="product-card__tags">${tags}</div>` : ''}
      <h4 class="product-card__name"><button type="button" class="product-card__open" data-product="${esc(p.id)}">${esc(p.name)}</button></h4>
      <p class="product-card__desc">${esc(p.desc)}</p>
      <div class="product-card__foot">
        <span class="price">${money(p.price)}</span>
        <button class="add-btn" type="button" data-quick-add="${esc(p.id)}" aria-label="${esc(p.name)} sepete ekle">${icon.plus}</button>
      </div>
    </div>
  </article>`;
}

export function menu(c) {
  const m = c.menu;
  const nav = m.categories
    .map(
      (cat, i) =>
        `<button class="menu-nav__btn${i === 0 ? ' is-active' : ''}" type="button" data-cat-link="${cat.id}">${esc(cat.name)} <small>${cat.products.length}</small></button>`
    )
    .join('');
  const cats = m.categories
    .map(
      (cat) => `
    <section class="menu-cat" id="kat-${cat.id}" data-cat="${cat.id}" aria-label="${esc(cat.name)}">
      <div class="menu-cat__head">
        <h3 class="h3 menu-cat__title">${esc(cat.name)}</h3>
        ${cat.note ? `<p class="menu-cat__note">${esc(cat.note)}</p>` : ''}
      </div>
      <div class="menu-grid">${cat.products.map(productCard).join('')}</div>
    </section>`
    )
    .join('');
  return `
  <section class="menu section" id="menu" aria-label="Menü">
    <div class="wrap">
      <div class="section-head section-head--split">
        <div><span class="eyebrow" data-reveal>${esc(m.eyebrow)}</span><h2 class="h2" data-split style="margin-top:14px">${m.title}</h2></div>
        <p class="lead" data-reveal>${esc(m.text)}</p>
      </div>
    </div>
    <div class="menu-nav" data-menu-nav><div class="menu-nav__list" aria-label="Menü kategorileri">${nav}</div></div>
    <div class="wrap">${cats}</div>
  </section>`;
}

export function values(c) {
  const v = c.values;
  return `
  <section class="section section--alt" id="neden-biz" aria-label="${esc(v.title)}">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow" data-reveal>${esc(v.eyebrow)}</span>
        <h2 class="h2" data-split>${v.title}</h2>
      </div>
      <div class="values-grid">
        ${v.items
          .map(
            (it, i) => `
          <article class="value-card" data-tilt data-reveal-card>
            <span class="value-card__no">${String(i + 1).padStart(2, '0')}</span>
            <span class="value-card__icon">${icon[it.icon] || icon.star}</span>
            <h3 class="value-card__title">${esc(it.title)}</h3>
            <p class="value-card__text">${esc(it.text)}</p>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

function mapArt(c) {
  // Soyut teslimat bölgesi çizimi (gerçek harita değildir)
  return `
  <svg viewBox="0 0 640 440" role="img" aria-label="Ereğli merkez ve teslimat bölgesini gösteren temsili çizim">
    <rect width="640" height="440" fill="var(--surface-2)"/>
    <g stroke="var(--line)" stroke-width="10" stroke-linecap="round" fill="none">
      <path d="M-20 300 C 120 280, 220 330, 340 300 S 560 220, 680 250"/>
      <path d="M180 -20 C 200 120, 160 220, 230 460"/>
      <path d="M420 -20 C 400 140, 470 260, 440 460"/>
    </g>
    <g stroke="var(--line)" stroke-width="4" fill="none">
      <path d="M-20 140 C 140 160, 300 120, 660 150"/>
      <path d="M60 460 C 120 340, 300 380, 300 220 S 520 80, 600 -20"/>
      <path d="M520 460 C 520 380, 600 340, 660 330"/>
    </g>
    <circle cx="320" cy="220" r="190" fill="var(--primary)" opacity=".06"/>
    <circle cx="320" cy="220" r="120" fill="var(--primary)" opacity=".08"/>
    <circle cx="320" cy="220" r="190" fill="none" stroke="var(--primary)" stroke-width="2" stroke-dasharray="6 10" opacity=".55"/>
    <circle cx="320" cy="220" r="34" fill="var(--primary)" opacity=".2" class="map-pulse"/>
    <g transform="translate(320 220)">
      <path d="M0 -6c-14 0-24 10-24 24 0 18 24 40 24 40s24-22 24-40C24 4 14-6 0-6Z" transform="translate(0 -44)" fill="var(--primary)"/>
      <circle cx="0" cy="-26" r="8" fill="var(--primary-ink)"/>
    </g>
    <text x="320" y="268" text-anchor="middle" font-family="var(--font-body)" font-weight="800" font-size="16" fill="var(--ink)">${esc(c.brand.name)}</text>
  </svg>`;
}

export function local(c) {
  const l = c.local;
  const d = c.delivery;
  const ct = c.contact;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ct.mapsQuery)}`;
  return `
  <section class="section section--solid" id="iletisim" aria-label="${esc(l.title)}">
    <div class="wrap local__grid">
      <div class="local__story">
        <span class="eyebrow" data-reveal>${esc(l.eyebrow)}</span>
        <h2 class="h2" data-split>${l.title}</h2>
        ${l.paragraphs.map((p) => `<p class="lead" data-reveal>${esc(p)}</p>`).join('')}
        <div class="local__map" data-reveal>${mapArt(c)}
          <span class="chip local__map-label">${icon.scooter}Teslimat: Ereğli merkez ve yakın mahalleler</span>
        </div>
      </div>
      <div class="info-cards">
        <article class="info-card" data-reveal-card>
          <span class="info-card__label">${icon.clock}Çalışma saatleri</span>
          <span class="info-card__value">${fmtTime(c.hours.open)}–${fmtTime(c.hours.close)}</span>
          <span class="info-card__text">${esc(c.hours.label)}</span>
          <span class="open-badge" data-open-badge>…</span>
        </article>
        <article class="info-card" data-reveal-card>
          <span class="info-card__label">${icon.truck}Paket servis</span>
          <span class="info-card__value">${esc(d.eta)}</span>
          <span class="info-card__text">En az sepet tutarı ${money(d.min)}. ${money(d.freeOver)} ve üzeri siparişlerde teslimat ücretsiz, altında ${money(d.fee)}.</span>
        </article>
        <article class="info-card" data-reveal-card>
          <span class="info-card__label">${icon.store}Gel-al</span>
          <span class="info-card__value">${esc(d.pickupEta)}</span>
          <span class="info-card__text">Siparişinizi verin, sıra beklemeden dükkândan teslim alın.${d.pickupNote ? ' ' + esc(d.pickupNote) : ''}</span>
        </article>
        <article class="info-card" data-reveal-card>
          <span class="info-card__label">${icon.pin}Adres</span>
          <span class="info-card__value">${esc(ct.address)}</span>
          <span class="info-card__text">${esc(ct.addressNote)} <a href="${mapsUrl}" target="_blank" rel="noopener">Haritada aç</a></span>
        </article>
        <article class="info-card" data-reveal-card style="grid-column:1/-1">
          <span class="info-card__label">${icon.phone}Sipariş hattı</span>
          <span class="info-card__value">${esc(ct.phoneDisplay)}</span>
          <span class="info-card__text">${esc(ct.phoneNote)}</span>
        </article>
      </div>
    </div>
  </section>`;
}

export function faq(c) {
  const f = c.faq;
  return `
  <section class="section section--alt" id="sss" aria-label="Sık sorulan sorular">
    <div class="wrap faq__grid">
      <div class="faq__head section-head" style="margin:0">
        <span class="eyebrow" data-reveal>${esc(f.eyebrow)}</span>
        <h2 class="h2" data-split>${f.title}</h2>
        <p class="lead" data-reveal>${esc(f.text)}</p>
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

export function ctaBand(c) {
  const t = c.cta;
  return `
  <section class="cta-band" aria-label="Sipariş çağrısı">
    <div class="cta-band__deco cta-band__deco--a" data-spin>${mark(c.id, monoColors(c), 'cta-a')}</div>
    <div class="cta-band__deco cta-band__deco--b" data-spin>${mark(c.id, monoColors(c), 'cta-b')}</div>
    <div class="wrap">
      <h2 class="h1 cta-band__title" data-split>${t.title}</h2>
      <p class="cta-band__text" data-reveal>${esc(t.text)}</p>
      <a class="btn" href="#menu" data-scroll data-magnetic data-reveal>${esc(t.button)} ${icon.arrow}</a>
    </div>
  </section>`;
}

function monoColors(c) {
  const ink = c.id === 'durum' ? '#110E0C' : '#FFFFFF';
  return { body: ink, leaf: ink, shine: 'transparent', dot: 'transparent', arch: ink, glass: 'transparent', tea: ink, flame: ink };
}

// Sayfanın en altındaki küçük konsept butonları (iki seri: standart ve premium)
export function miniSwitch(currentId) {
  const link = (id) => {
    const k = CONCEPTS[id];
    const cur = id === currentId;
    return `<a href="${conceptUrl(id)}" data-concept-go="${id}"${cur ? ' aria-current="true"' : ''} aria-label="${esc(k.full)}${cur ? ' (şu an görüntülenen)' : ''}">${esc(k.short)}</a>`;
  };
  return `
  <nav class="mini-switch" id="konseptler" aria-label="Prototip konseptleri">
    <span class="mini-switch__title">Prototip</span>
    <div class="mini-switch__group"><span>Standart</span>${CONCEPT_GROUPS.standard.map(link).join('')}</div>
    <div class="mini-switch__group"><span>Premium</span>${CONCEPT_GROUPS.premium.map(link).join('')}</div>
    <div class="mini-switch__group"><span>Butik</span>${CONCEPT_GROUPS.butik.map(link).join('')}</div>
  </nav>`;
}

export function footer(c) {
  const ct = c.contact;
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer__grid">
        <div class="footer__about">
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

export function overlays(c) {
  return `
  <div class="scrim" data-scrim></div>
  <aside class="drawer" id="drawer" data-view="cart" role="dialog" aria-modal="true" aria-labelledby="drawer-title" aria-hidden="true"></aside>
  <div class="pmodal" id="pmodal" role="dialog" aria-modal="true" aria-labelledby="pmodal-title" aria-hidden="true"></div>
  <div class="cartbar" data-cartbar aria-hidden="true">
    <div class="cartbar__info"><small data-cartbar-count>0 ürün</small><strong data-cartbar-total>${money(0)}</strong></div>
    <button class="btn btn--sm" type="button" data-open-cart>Sepeti gör ${icon.arrow}</button>
  </div>
  <div class="toast" role="status" aria-live="polite" data-toast></div>
  <div class="curtain" data-curtain aria-hidden="true"></div>`;
}
