import { icon } from '../core/icons.js';
import { logo } from '../core/logos.js';
import { $, $$, esc, money } from '../core/util.js';
import { overlays } from '../ui/sections.js';
import { photo, hoursText, deliveryText, mapsUrl, faqList, mobileNav, navLinks, footerBottom } from './common.js';

// HATIR: kobalt ve porselen. Sayfanın tek cesur öğesi fal köşesi: fincan açılır,
// telvedeki şekil yaldızla çizilir.

// Fal şekilleri (tek çizgi, 100x100)
const SYMBOLS = {
  kus: 'M14 56c12-14 26-16 36-4 6-16 20-24 38-22-9 6-13 13-15 22 9 3 13 8 15 14-13-3-26-1-37 6-12-9-24-14-37-16',
  yol: 'M30 92c6-22 18-32 16-48s6-26 14-36M70 92c-4-22-12-32-10-48s0-26 4-36',
  kalp: 'M50 84C20 62 12 44 22 30c10-12 24-6 28 6 4-12 18-18 28-6 10 14 2 32-28 54Z',
  balik: 'M12 50c16-20 46-20 62 0-16 20-46 20-62 0Zm62 0 16-14v28Z',
  anahtar: 'M24 50a13 13 0 1 0 26 0 13 13 0 1 0-26 0Zm26 0h38m-10 0v12m10-12v9',
  yildiz: 'M50 12l10 26 28 2-22 18 8 28-24-16-24 16 8-28-22-18 28-2Z',
  agac: 'M50 90V52m0 12c-12-4-20-12-20-24 0-14 10-22 20-22s20 8 20 22c0 12-8 20-20 24m0 10L36 62m14 8 14-12',
  ay: 'M62 14a38 38 0 1 0 0 72 30 30 0 1 1 0-72Z',
};

const cupIcon = `<svg class="h-cupicon" viewBox="0 0 28 24" aria-hidden="true">
  <defs><clipPath id="h-cup-clip"><path d="M4 7h16l-1.6 9.2A5 5 0 0 1 13.5 20h-3a5 5 0 0 1-4.9-3.8Z"/></clipPath></defs>
  <g clip-path="url(#h-cup-clip)"><rect class="h-cupicon__fill" x="3" y="7" width="18" height="14"/></g>
  <path d="M4 7h16l-1.6 9.2A5 5 0 0 1 13.5 20h-3a5 5 0 0 1-4.9-3.8Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M20 9.5h1.3a2.6 2.6 0 0 1 0 5.2H19.4" fill="none" stroke="currentColor" stroke-width="1.6"/>
  <path class="h-cupicon__steam" d="M10 4.5c-.8-1 .8-1.6 0-2.8M14 4.5c-.8-1 .8-1.6 0-2.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;

function header(c) {
  return `
  <a class="skip-link" href="#menu" data-scroll>Menüye geç</a>
  <header class="site-header h-header" id="site-header">
    <div class="wrap h-header__in">
      <a class="h-header__logo" href="#top" data-scroll aria-label="${esc(c.brand.full)}, sayfanın başı">${logo(c.id)}</a>
      <nav class="h-nav" aria-label="Ana menü">${navLinks(c)}</nav>
      <div class="h-header__actions">
        <button class="cart-btn h-cart" type="button" data-open-cart aria-label="Sepeti aç">
          ${cupIcon}<span class="h-cart__label">Sepet</span><span class="h-cart__count" data-cart-count>0</span>
        </button>
        <button class="burger h-burger" type="button" data-burger aria-label="Menüyü aç" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
      </div>
    </div>
  </header>
  ${mobileNav(c, 'h-mnav', c.hero.cta)}`;
}

function hero(c) {
  const h = c.hero;
  return `
  <section class="h-hero" id="top" aria-labelledby="h-hero-title">
    <div class="wrap h-hero__grid">
      <div class="h-hero__copy">
        <h1 class="h-hero__title" id="h-hero-title">${h.title.map((l) => `<span class="h-line"><span>${esc(l)}</span></span>`).join('')}</h1>
        <p class="h-hero__text">${esc(h.text)}</p>
        <div class="h-hero__ctas">
          <a class="h-btn" href="#menu" data-scroll>${esc(h.cta)}</a>
          <a class="h-btn h-btn--line" href="#fal" data-scroll>${esc(h.cta2)}</a>
        </div>
      </div>
      <figure class="h-hero__cup">
        <svg class="h-steam" viewBox="0 0 120 120" aria-hidden="true">
          <path d="M44 112c-10-14 10-22 0-38s8-24 2-40" pathLength="1"/>
          <path d="M62 112c-10-16 12-24 0-42s8-22 4-40" pathLength="1"/>
          <path d="M80 112c-8-12 8-20 0-34s6-20 2-34" pathLength="1"/>
        </svg>
        ${photo(c, 'hero', 'Kobalt desenli fincanda köpüklü Türk kahvesi, tabağında lokum', { w: 1000, h: 1000, eager: true, cls: 'h-hero__img' })}
      </figure>
    </div>
    <div class="h-band" aria-hidden="true"></div>
  </section>`;
}

function item(c, p) {
  const tag = p.tags?.[0]?.text;
  return `
  <li class="h-item">
    <button class="h-item__main" type="button" data-product="${esc(p.id)}">
      <span class="h-item__img">${photo(c, p.id, '', { w: 640, h: 640 })}</span>
      <span class="h-item__text">
        <span class="h-item__name">${esc(p.name)}${tag ? ` <span class="h-item__tag">${esc(tag)}</span>` : ''}</span>
        <span class="h-item__desc">${esc(p.desc)}</span>
      </span>
      <span class="h-item__price">${money(p.price)}</span>
    </button>
    <button class="h-item__add" type="button" data-quick-add="${esc(p.id)}" aria-label="${esc(p.name)} sepete ekle">${icon.plus}</button>
  </li>`;
}

function menu(c) {
  const m = c.menu;
  return `
  <section class="h-menu" id="menu" aria-labelledby="h-menu-title">
    <div class="wrap">
      <h2 class="h-h2" id="h-menu-title">${esc(m.title)}</h2>
    </div>
    <div class="h-menu-nav" data-menu-nav>
      <div class="wrap">
        <div class="h-menu-nav__list" data-menu-nav-list>
          ${m.categories.map((cat, i) => `<button class="h-tab${i === 0 ? ' is-active' : ''}" type="button" data-cat-link="${cat.id}">${esc(cat.name)}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="wrap h-menu__cols">
      ${m.categories
        .map(
          (cat) => `
        <section class="h-cat" id="kat-${cat.id}" data-cat="${cat.id}" aria-labelledby="kat-${cat.id}-t">
          <header class="h-cat__head">
            <h3 class="h-h3" id="kat-${cat.id}-t">${esc(cat.name)}</h3>
            ${cat.note ? `<p>${esc(cat.note)}</p>` : ''}
          </header>
          <ul class="h-list">${cat.products.map((p) => item(c, p)).join('')}</ul>
        </section>`
        )
        .join('')}
    </div>
  </section>`;
}

function fal(c) {
  const f = c.fal;
  return `
  <section class="h-fal" id="fal" aria-labelledby="h-fal-title">
    <div class="wrap h-fal__grid">
      <div class="h-fal__copy">
        <h2 class="h-h2" id="h-fal-title">${esc(f.title)}</h2>
        <p class="h-fal__text">${esc(f.text)}</p>
        <button class="h-btn" type="button" data-fal-btn>${esc(f.open)}</button>
        <div class="h-fal__reading" data-fal-reading aria-live="polite"></div>
        <p class="h-fal__note">${esc(f.note)}</p>
      </div>
      <div class="h-fal__stage" data-fal-stage>
        ${photo(c, 'fal-kapali', 'Tabağına kapatılmış kobalt desenli fincan', { w: 900, h: 900, cls: 'h-fal__closed' })}
        <div class="h-fal__open" data-fal-open hidden>
          <canvas class="h-fal__telve" width="720" height="720" data-fal-canvas></canvas>
          <svg class="h-fal__sym" viewBox="0 0 100 100" aria-hidden="true"><path d="" pathLength="1" data-fal-path/></svg>
        </div>
      </div>
    </div>
  </section>`;
}

function visit(c) {
  const d = c.delivery;
  const ct = c.contact;
  return `
  <section class="h-visit" id="ziyaret" aria-labelledby="h-visit-title">
    <div class="wrap h-visit__grid">
      <h2 class="h-h2" id="h-visit-title">Ziyaret</h2>
      <dl class="h-facts">
        <div><dt>Saatler</dt><dd><strong>${hoursText(c.hours)}</strong>${esc(c.hours.label)}. ${esc(c.hours.extra)}. <span class="open-badge" data-open-badge>…</span></dd></div>
        <div><dt>Adres</dt><dd><strong>${esc(ct.address)}</strong>${esc(ct.addressNote)} <a href="${mapsUrl(c)}" target="_blank" rel="noopener">Haritada aç</a></dd></div>
        <div><dt>Paket servis</dt><dd><strong>${esc(d.eta)}</strong>${esc(deliveryText(d))}</dd></div>
        <div><dt>Telefon</dt><dd><strong>${esc(ct.phoneDisplay)}</strong>${esc(ct.phoneNote)}</dd></div>
      </dl>
    </div>
  </section>`;
}

function faq(c) {
  return `
  <section class="h-faq" id="sss" aria-labelledby="h-faq-title">
    <div class="wrap h-faq__grid">
      <h2 class="h-h2" id="h-faq-title">Sık sorulanlar</h2>
      ${faqList(c.faq)}
    </div>
  </section>`;
}

function footer(c) {
  return `
  <footer class="site-footer h-footer">
    <div class="h-band h-band--top" aria-hidden="true"></div>
    <div class="wrap">
      <div class="h-footer__top">
        <div class="h-footer__brand">${logo(c.id)}<p>${esc(c.footer.about)}</p></div>
        <nav class="h-footer__nav" aria-label="Alt menü">${navLinks(c)}</nav>
      </div>
      ${footerBottom(c)}
    </div>
  </footer>`;
}

export function page(c) {
  return [header(c), '<main id="main">', hero(c), menu(c), fal(c), visit(c), faq(c), '</main>', footer(c), overlays(c)].join('');
}

// ---------------------------------------------------------------------------
// Telve: fincan tabağa kapatılınca telve kenarlara doğru akar
// ---------------------------------------------------------------------------
function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

function drawTelve(canvas, seed) {
  const ctx = canvas.getContext('2d');
  const S = canvas.width;
  const c = S / 2;
  const R = S / 2 - 1;
  const r = rng(seed + 3);
  ctx.clearRect(0, 0, S, S);

  // porselen iç yüzey: kenara doğru gölgelenir
  let g = ctx.createRadialGradient(c, c * 0.9, R * 0.05, c, c, R);
  g.addColorStop(0, '#fbfaf6');
  g.addColorStop(0.72, '#efebe2');
  g.addColorStop(1, '#d6d0c3');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, R * 0.95, 0, Math.PI * 2);
  ctx.clip();
  const brown = (a) => `rgba(${42 + r() * 22},${25 + r() * 12},${15 + r() * 8},${a})`;
  const blob = (x, y, rad, a) => {
    const bg = ctx.createRadialGradient(x, y, 0, x, y, rad);
    bg.addColorStop(0, brown(a));
    bg.addColorStop(0.6, brown(a * 0.7));
    bg.addColorStop(1, 'rgba(40,24,15,0)');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  };

  ctx.filter = 'blur(1.5px)';
  // dipte yoğun telve kütlesi, yer yer orta halkaya taşar
  for (let i = 0; i < 64; i++) {
    const a = r() * Math.PI * 2;
    const d = R * Math.pow(r(), 1.4) * 0.55;
    blob(c + Math.cos(a) * d, c + Math.sin(a) * d, R * (0.07 + r() * 0.15), 0.45 + r() * 0.4);
  }

  // kenara akan geniş, dalgalı izler
  const drips = 10 + Math.floor(r() * 5);
  for (let i = 0; i < drips; i++) {
    const a0 = r() * Math.PI * 2;
    const len = R * (0.4 + r() * 0.45);
    let w = R * (0.06 + r() * 0.06);
    let x = c + Math.cos(a0) * R * 0.25;
    let y = c + Math.sin(a0) * R * 0.25;
    let a = a0;
    let turn = (r() - 0.5) * 0.04;
    const steps = 42;
    for (let k = 0; k < steps; k++) {
      turn += (r() - 0.5) * 0.02;
      a += turn;
      x += (Math.cos(a) * len) / steps;
      y += (Math.sin(a) * len) / steps;
      blob(x, y, w, 0.16 + r() * 0.14);
      w *= 0.972;
    }
  }
  ctx.filter = 'none';

  // açıklıklar: şekillerin seçildiği boşluklar
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2;
    const d = R * (0.25 + r() * 0.5);
    const rad = R * (0.06 + r() * 0.1);
    const cg = ctx.createRadialGradient(c + Math.cos(a) * d, c + Math.sin(a) * d, 0, c + Math.cos(a) * d, c + Math.sin(a) * d, rad);
    cg.addColorStop(0, 'rgba(0,0,0,0.55)');
    cg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(c + Math.cos(a) * d, c + Math.sin(a) * d, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  // açılan yerlere porselen geri gelsin
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // ince zerreler
  for (let i = 0; i < 900; i++) {
    const a = r() * Math.PI * 2;
    const d = R * Math.sqrt(r()) * 0.94;
    ctx.fillStyle = `rgba(40,24,15,${0.15 + r() * 0.45})`;
    const sz = 1 + r() * 2.2;
    ctx.fillRect(c + Math.cos(a) * d, c + Math.sin(a) * d, sz, sz);
  }

  // iç kenar gölgesi
  g = ctx.createRadialGradient(c, c, R * 0.78, c, c, R * 0.95);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(60,45,30,0.22)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  ctx.restore();

  // yaldızlı ağız
  ctx.strokeStyle = '#c5a24a';
  ctx.lineWidth = S * 0.014;
  ctx.beginPath();
  ctx.arc(c, c, R * 0.965, 0, Math.PI * 2);
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Davranış
// ---------------------------------------------------------------------------
export function init({ gsap, concept: c, cart, reduced }) {
  // Başlıktaki fincan sepetle dolar
  const fill = $('.h-cupicon__fill');
  const syncCup = () => {
    const k = Math.min(cart.count, 4) / 4;
    fill.style.transform = `translateY(${(1 - k) * 100}%)`;
  };
  cart.subscribe(syncCup);
  syncCup();
  document.addEventListener('cart:added', () => {
    if (reduced) return;
    gsap.fromTo('.h-cupicon__steam', { y: 3, autoAlpha: 0 }, { y: -2, autoAlpha: 1, duration: 0.5, ease: 'power2.out', yoyo: true, repeat: 1, repeatDelay: 0.3 });
  });

  // Buhar yalnızca hero ekrandayken kıvrılır
  const hero = $('.h-hero');
  new IntersectionObserver(([e]) => hero.classList.toggle('is-away', !e.isIntersecting)).observe(hero);

  // --- Fal
  const f = c.fal;
  const btn = $('[data-fal-btn]');
  const closed = $('.h-fal__closed');
  const open = $('[data-fal-open]');
  const canvas = $('[data-fal-canvas]');
  const path = $('[data-fal-path]');
  const out = $('[data-fal-reading]');
  let order = f.readings.map((_, i) => i).sort(() => Math.random() - 0.5);
  let n = 0;
  let busy = false;

  function reading() {
    if (n >= order.length) {
      order = order.sort(() => Math.random() - 0.5);
      n = 0;
    }
    return f.readings[order[n++]];
  }

  function show(rd, first) {
    drawTelve(canvas, n * 7 + Math.round(Math.random() * 50));
    path.setAttribute('d', SYMBOLS[rd.sym]);
    out.innerHTML = `<h3>Fincanda bir ${esc(rd.title.toLocaleLowerCase('tr-TR'))} görünüyor.</h3><p>${esc(rd.text)}</p>`;
    btn.textContent = f.again;
    if (reduced) {
      closed.hidden = true;
      open.hidden = false;
      path.style.strokeDashoffset = '0';
      return;
    }
    const tl = gsap.timeline({ onComplete: () => (busy = false) });
    if (first) {
      tl.to(closed, { y: -26, rotate: -10, duration: 0.45, ease: 'power2.out' })
        .to(closed, { scaleX: 0, duration: 0.25, ease: 'power2.in' })
        .add(() => {
          closed.hidden = true;
          open.hidden = false;
        })
        .fromTo(open, { scaleX: 0, rotate: 8 }, { scaleX: 1, rotate: 0, duration: 0.45, ease: 'back.out(1.6)' });
    } else {
      tl.fromTo(open, { rotate: 0 }, { rotate: 360, duration: 0.9, ease: 'power3.inOut' });
    }
    tl.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, '-=0.15');
    tl.fromTo(out.children, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, '-=0.9');
  }

  btn.addEventListener('click', () => {
    if (busy) return;
    busy = !reduced;
    show(reading(), !closed.hidden);
  });

  return {
    intro() {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (reduced) return tl;
      tl.from('#site-header', { yPercent: -100, autoAlpha: 0, duration: 0.8, clearProps: 'transform,opacity,visibility' }, 0);
      tl.from('.h-line > span', { yPercent: 110, duration: 1, stagger: 0.12 }, 0.1);
      tl.from(['.h-hero__text', '.h-hero__ctas'], { y: 14, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 0.45);
      // Fincan masaya bırakılır, sonra buhar başlar
      tl.from('.h-hero__img', { y: 60, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0.25);
      tl.from('.h-steam', { autoAlpha: 0, duration: 1.2 }, 1.1);
      return tl;
    },
  };
}
