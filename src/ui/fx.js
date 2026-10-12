import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { $, $$, isTouch, prefersReducedMotion, openStatus } from '../core/util.js';
import { CONCEPTS, conceptUrl } from '../core/concepts.js';
import { mark } from '../core/logos.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const reduced = prefersReducedMotion();

// --------------------------------------------------------------------------
// Kaydırma: tarayıcının kendi (native) kaydırması. Yumuşatma katmanı yok;
// telefondaki gibi anında ve kesintisiz tepki verir.
// --------------------------------------------------------------------------
export function createScroller() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  const subs = new Set();
  const root = document.documentElement;
  let lastY = window.scrollY;
  let locks = 0;
  const api = {
    velocity: 0,
    direction: 1,
    on(evt, fn) {
      if (evt === 'scroll') subs.add(fn);
    },
    stop() {
      locks += 1;
      root.classList.add('is-locked');
    },
    start() {
      locks = Math.max(0, locks - 1);
      if (!locks) root.classList.remove('is-locked');
    },
    scrollTo(target, { offset = 0, immediate = false } = {}) {
      let top = 0;
      if (typeof target === 'number') top = target;
      else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (!el) return;
        top = el.getBoundingClientRect().top + window.scrollY + offset;
      }
      window.scrollTo({ top, behavior: immediate || reduced ? 'auto' : 'smooth' });
    },
  };
  window.addEventListener('scroll', () => subs.forEach((fn) => fn({ scroll: window.scrollY })), { passive: true });
  gsap.ticker.add(() => {
    const y = window.scrollY;
    const d = y - lastY;
    lastY = y;
    api.velocity += (d - api.velocity) * 0.2;
    if (Math.abs(d) > 0.5) api.direction = Math.sign(d);
  });
  return api;
}

export function initAnchors(scroller) {
  const mnav = $('#mnav');
  const burger = $('[data-burger]');
  const setNav = (open) => {
    if (!mnav || !burger) return;
    const was = mnav.classList.contains('is-open');
    if (was === open) return;
    mnav.classList.toggle('is-open', open);
    mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    if (open) scroller.stop();
    else scroller.start();
  };
  burger?.addEventListener('click', () => setNav(!mnav.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && mnav?.classList.contains('is-open') && setNav(false));

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-scroll]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const wasOpen = mnav?.classList.contains('is-open');
    if (wasOpen) setNav(false);
    const go = () => {
      if (href === '#top') return scroller.scrollTo(0);
      const offset = href === '#menu' ? 0 : -($('#site-header')?.offsetHeight || 0);
      scroller.scrollTo(href, { offset });
    };
    wasOpen ? setTimeout(go, 300) : go();
  });
}

// --------------------------------------------------------------------------
// Başlık durumu, açık/kapalı göstergesi
// --------------------------------------------------------------------------
export function initHeader(scroller) {
  const header = $('#site-header');
  if (!header) return;
  let on = null;
  const update = (y) => {
    const v = y > 40;
    if (v !== on) header.classList.toggle('is-scrolled', (on = v));
  };
  scroller.on('scroll', ({ scroll }) => update(scroll));
  update(window.scrollY);
}

export function initOpenStatus(hours) {
  const run = () => {
    const st = openStatus(hours);
    $$('[data-open-status]').forEach((el) => {
      el.classList.toggle('is-open', st.isOpen);
      el.classList.toggle('is-closed', !st.isOpen);
      const label = el.querySelector('[data-open-label]');
      if (label) label.textContent = `${st.short} · ${st.detail}`;
    });
    $$('[data-open-badge]').forEach((el) => {
      el.classList.toggle('is-open', st.isOpen);
      el.textContent = `${st.short} · ${st.detail}`;
    });
  };
  run();
  setInterval(run, 60000);
}

// --------------------------------------------------------------------------
// Görünür olunca beliren öğeler (yukarı kaydırınca geri gider)
// --------------------------------------------------------------------------
export function initReveals({ soft = false } = {}) {
  if (reduced) return;
  const dist = soft ? 22 : 36;
  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: dist,
      autoAlpha: 0,
      duration: soft ? 0.9 : 0.8,
      ease: soft ? 'power3.out' : 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
    });
  });

  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 150,
          duration: soft ? 1 : 0.9,
          ease: soft ? 'power3.out' : 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
        });
      },
    });
  });

  const batch = (selector, from, to) => {
    const els = $$(selector);
    if (!els.length) return;
    gsap.set(els, from);
    ScrollTrigger.batch(els, {
      start: 'top 94%',
      onEnter: (b) => gsap.to(b, { ...to, stagger: 0.06, duration: 0.7, ease: soft ? 'power3.out' : 'expo.out', overwrite: true }),
      onLeaveBack: (b) => gsap.to(b, { ...from, stagger: 0.03, duration: 0.35, ease: 'power2.in', overwrite: true }),
    });
  };
  if (soft) {
    batch('[data-reveal-card]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 });
    batch('.pm-item', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0 });
  } else {
    batch('[data-reveal-card]', { autoAlpha: 0, y: 60, rotateX: -10 }, { autoAlpha: 1, y: 0, rotateX: 0 });
    batch('.product-card', { autoAlpha: 0, y: 40, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1 });
  }
}

// --------------------------------------------------------------------------
// Kayan yazı bandı: kaydırma hızına ve yönüne tepki verir
// --------------------------------------------------------------------------
export function initMarquee(scroller) {
  $$('[data-marquee]').forEach((band) => {
    const track = band.querySelector('.marquee__track');
    const base = track.innerHTML;
    let guard = 0;
    while (track.scrollWidth < window.innerWidth * 1.2 && guard++ < 8) track.insertAdjacentHTML('beforeend', base);
    const clone = track.cloneNode(true);
    band.appendChild(clone);
    const tracks = [track, clone];
    const dir = Number(band.dataset.marquee) || 1;
    let x = 0;
    let w = track.scrollWidth;
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(band);
    window.addEventListener('resize', () => (w = track.scrollWidth));
    gsap.ticker.add((_, dtMs) => {
      if (!visible) return;
      const v = Math.abs(scroller.velocity);
      const speed = (0.8 + Math.min(v * 0.3, 10)) * (dtMs / 16.67);
      x -= speed * dir * scroller.direction;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      tracks[0].style.transform = tracks[1].style.transform = `translate3d(${x}px,0,0)`;
    });
  });
}

// --------------------------------------------------------------------------
// Hero: giriş animasyonu ve kaydırınca çıkış
// --------------------------------------------------------------------------
export function heroIntro({ soft = false } = {}) {
  const tl = gsap.timeline({ defaults: { ease: soft ? 'power3.out' : 'expo.out' } });
  const title = $('[data-hero-title]');
  if (title) {
    const split = SplitText.create(title, { type: soft ? 'lines' : 'chars,lines', mask: 'lines', linesClass: 'split-line' });
    if (soft) tl.from(split.lines, { yPercent: 150, duration: 1.3, stagger: 0.12 }, 0.15);
    else tl.from(split.chars, { yPercent: 150, rotate: 6, duration: 1.2, stagger: 0.018 }, 0.1);
  }
  tl.from('[data-hero-anim]', { y: soft ? 16 : 30, autoAlpha: 0, duration: soft ? 1.2 : 1, stagger: 0.09 }, soft ? 0.55 : 0.35);
  if ($('[data-hero-badge]')) tl.from('[data-hero-badge]', { scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.6)' }, 0.6);
  tl.from('#site-header', { yPercent: -100, autoAlpha: 0, duration: 1, clearProps: 'transform,opacity,visibility' }, 0.2);
  return tl;
}

export function heroScroll(scroller) {
  if (reduced) return;
  gsap.to('.hero__content', {
    yPercent: -14,
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true },
  });
  if ($('.hero__scroll')) {
    gsap.to('.hero__scroll', {
      autoAlpha: 0,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '12% top', scrub: true },
    });
  }
  const ring = $('[data-hero-badge] .badge-ring');
  if (ring) {
    let rot = 0;
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(ring);
    gsap.ticker.add((_, dt) => {
      if (!visible) return;
      rot += (0.012 + Math.abs(scroller.velocity) * 0.012) * dt;
      ring.style.transform = `rotate(${rot}deg)`;
    });
    gsap.to('[data-hero-badge]', {
      y: -100,
      autoAlpha: 0,
      scrollTrigger: { trigger: '.hero', start: '20% top', end: '75% top', scrub: true },
    });
  }
  const word = $('[data-backdrop-word]');
  if (word) {
    gsap.fromTo(
      word,
      { xPercent: 8 },
      { xPercent: -22, ease: 'none', scrollTrigger: { trigger: '#scene-zone', start: 'top top', end: 'bottom bottom', scrub: true } }
    );
  }
}

// --------------------------------------------------------------------------
// Hikâye: kısa tutulmuş sabitleme ve adım adım zaman çizelgesi
// --------------------------------------------------------------------------
export function storyTimeline() {
  const section = $('.story');
  const steps = $$('.story-step', section);
  const bars = $$('.story__index li span', section);
  const labels = $$('.story__labels li', section);
  const n = steps.length;
  let lastIdx = 0;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * n * 0.62),
      pin: true,
      scrub: 0.35,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const idx = Math.min(n - 1, Math.floor(self.progress * n * 0.9999));
        if (idx !== lastIdx) {
          labels.forEach((l, i) => l.classList.toggle('is-active', i === idx));
          lastIdx = idx;
        }
      },
    },
  });
  for (let i = 0; i < n; i++) {
    tl.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: 1 }, i);
    if (i > 0) tl.fromTo(steps[i], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.2 }, i + 0.02);
    if (i < n - 1) tl.to(steps[i], { autoAlpha: 0, y: -24, duration: 0.18 }, i + 0.82);
  }
  tl.set({}, {}, n);
  return tl;
}

// --------------------------------------------------------------------------
// Kampanyalar: sabitlenmeyen, parmakla/okla kaydırılan karusel
// --------------------------------------------------------------------------
export function initCarousel(root = document) {
  $$('[data-carousel]', root).forEach((wrap) => {
    const track = $('[data-carousel-track]', wrap);
    const prev = $('[data-carousel-prev]', wrap);
    const next = $('[data-carousel-next]', wrap);
    if (!track) return;
    const step = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Fareyle sürükleyerek kaydırma (dokunmatikte tarayıcı zaten yapıyor)
    if (!isTouch()) {
      let down = false;
      let sx = 0;
      let sl = 0;
      let moved = false;
      track.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        down = true;
        moved = false;
        sx = e.clientX;
        sl = track.scrollLeft;
      });
      window.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - sx;
        if (Math.abs(dx) > 4) {
          moved = true;
          track.classList.add('is-dragging');
        }
        track.scrollLeft = sl - dx;
      });
      window.addEventListener('pointerup', () => {
        down = false;
        track.classList.remove('is-dragging');
      });
      track.addEventListener(
        'click',
        (e) => {
          if (moved) {
            e.preventDefault();
            e.stopPropagation();
            moved = false;
          }
        },
        true
      );
    }
  });
}

// --------------------------------------------------------------------------
// Menü kategori çubuğu
// --------------------------------------------------------------------------
export function initMenuNav(scroller) {
  const nav = $('[data-menu-nav]');
  if (!nav) return;
  const list = $('[data-menu-nav-list]', nav) || nav.firstElementChild;
  const btns = $$('[data-cat-link]', nav);
  const setActive = (id) => {
    btns.forEach((b) => {
      const on = b.dataset.catLink === id;
      b.classList.toggle('is-active', on);
      if (on) {
        b.setAttribute('aria-current', 'true');
        const left = b.offsetLeft - list.clientWidth / 2 + b.clientWidth / 2;
        list.scrollTo({ left, behavior: 'smooth' });
      } else b.removeAttribute('aria-current');
    });
  };
  btns.forEach((b) =>
    b.addEventListener('click', () => {
      const target = $(`#kat-${b.dataset.catLink}`);
      const offset = -(($('#site-header')?.offsetHeight || 0) + nav.offsetHeight + 12);
      scroller.scrollTo(target, { offset });
    })
  );
  $$('[data-cat]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => self.isActive && setActive(sec.dataset.cat),
    });
  });
}

// --------------------------------------------------------------------------
// Etkileşim: eğilen kartlar, mıknatıs butonlar, SSS
// --------------------------------------------------------------------------
export function initTilt() {
  if (isTouch() || reduced) return;
  $$('[data-tilt]').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3.out' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      rx(-((e.clientY - r.top) / r.height - 0.5) * 9);
      ry(((e.clientX - r.left) / r.width - 0.5) * 11);
    });
    el.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  });
}

export function initMagnetic() {
  if (isTouch() || reduced) return;
  $$('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.25);
      y((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => {
      x(0);
      y(0);
    });
  });
}

export function initFaq() {
  let refreshT;
  $$('.faq-item').forEach((item) => {
    const btn = $('.faq-item__q', item);
    const panel = $('.faq-item__a', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      gsap.to(panel, {
        height: open ? 'auto' : 0,
        duration: reduced ? 0 : 0.45,
        ease: 'power3.out',
        onComplete: () => {
          clearTimeout(refreshT);
          refreshT = setTimeout(() => ScrollTrigger.refresh(), 100);
        },
      });
    });
  });
}

export function initSpinners() {
  if (reduced) return;
  $$('[data-spin]').forEach((el, i) => {
    gsap.fromTo(
      el,
      { rotate: i % 2 ? 40 : -40, y: 60 },
      {
        rotate: i % 2 ? -40 : 40,
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
}

// --------------------------------------------------------------------------
// Premium: kelime kelime aydınlanan manifesto metni
// --------------------------------------------------------------------------
export function initManifesto() {
  $$('[data-manifesto]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words' });
    if (reduced) return;
    gsap.fromTo(
      split.words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: true },
      }
    );
  });
}

// --------------------------------------------------------------------------
// Konsept seçici: perde animasyonu ve sayfayı yeniden yükleme
// --------------------------------------------------------------------------
export function initSwitcher(currentId, scroller) {
  const curtain = $('[data-curtain]');
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-concept-go]');
    if (!btn) return;
    e.preventDefault();
    const id = btn.dataset.conceptGo;
    if (id === currentId) {
      scroller.scrollTo(0);
      return;
    }
    const k = CONCEPTS[id];
    curtain.style.background = k.bg;
    curtain.style.color = k.ink;
    curtain.innerHTML = `<div class="curtain__inner">${mark(id, {}, 'curtain')}<span class="curtain__label">${k.label} yükleniyor</span></div>`;
    scroller.stop();
    const go = () => window.location.assign(conceptUrl(id));
    if (reduced) return go();
    gsap
      .timeline({ onComplete: go })
      .to(curtain, { clipPath: 'inset(0% 0 0 0)', duration: 0.6, ease: 'power3.inOut' })
      .from(curtain.firstElementChild, { y: 20, autoAlpha: 0, duration: 0.4, ease: 'power3.out' }, 0.35);
  });
}
