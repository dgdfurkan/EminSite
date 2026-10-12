import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { $, $$, isTouch, prefersReducedMotion, openStatus } from '../core/util.js';
import { CONCEPTS, conceptUrl } from '../core/concepts.js';
import { mark } from '../core/logos.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const reduced = prefersReducedMotion();

// --------------------------------------------------------------------------
// Yumuşak kaydırma
// --------------------------------------------------------------------------
export function initLenis() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (reduced) return null;
  const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1, anchors: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToTarget(lenis, target, offset = 0) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el && target !== 0) return;
  if (lenis) lenis.scrollTo(el || 0, { offset, duration: 1.4 });
  else if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced ? 'auto' : 'smooth' });
  else window.scrollTo({ top: 0 });
}

export function initAnchors(lenis) {
  const mnav = $('#mnav');
  const burger = $('[data-burger]');
  const setNav = (open) => {
    mnav.classList.toggle('is-open', open);
    mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    if (open) lenis?.stop();
    else lenis?.start();
  };
  burger.addEventListener('click', () => setNav(!mnav.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && mnav.classList.contains('is-open') && setNav(false));

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-scroll]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const wasOpen = mnav.classList.contains('is-open');
    if (wasOpen) setNav(false);
    const go = () => {
      if (href === '#top') return scrollToTarget(lenis, 0);
      const offset = href === '#menu' ? 0 : -$('#site-header').offsetHeight;
      scrollToTarget(lenis, href, offset);
    };
    wasOpen ? setTimeout(go, 350) : go();
  });
}

// --------------------------------------------------------------------------
// Başlık durumu, açık/kapalı göstergesi
// --------------------------------------------------------------------------
export function initHeader(lenis) {
  const header = $('#site-header');
  const update = (y) => header.classList.toggle('is-scrolled', y > 40);
  if (lenis) lenis.on('scroll', ({ scroll }) => update(scroll));
  else window.addEventListener('scroll', () => update(window.scrollY), { passive: true });
  update(window.scrollY);
}

export function initOpenStatus(hours) {
  const run = () => {
    const st = openStatus(hours);
    $$('[data-open-status]').forEach((el) => {
      el.classList.toggle('is-open', st.isOpen);
      el.classList.toggle('is-closed', !st.isOpen);
      el.querySelector('[data-open-label]').textContent = `${st.short} · ${st.detail}`;
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
export function initReveals() {
  if (reduced) return;
  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 36,
      autoAlpha: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
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
          yPercent: 110,
          duration: 1.15,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        });
      },
    });
  });

  const batch = (selector, from, to) => {
    const els = $$(selector);
    if (!els.length) return;
    gsap.set(els, from);
    ScrollTrigger.batch(els, {
      start: 'top 92%',
      onEnter: (b) => gsap.to(b, { ...to, stagger: 0.08, duration: 0.95, ease: 'expo.out', overwrite: true }),
      onLeaveBack: (b) => gsap.to(b, { ...from, stagger: 0.04, duration: 0.5, ease: 'power2.in', overwrite: true }),
    });
  };
  batch('[data-reveal-card]', { autoAlpha: 0, y: 70, rotateX: -12 }, { autoAlpha: 1, y: 0, rotateX: 0 });
  batch('.product-card', { autoAlpha: 0, y: 50, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1 });
}

// --------------------------------------------------------------------------
// Kayan yazı bandı: kaydırma hızına ve yönüne tepki verir
// --------------------------------------------------------------------------
export function initMarquee(lenis) {
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
    let sdir = 1;
    window.addEventListener('resize', () => (w = track.scrollWidth));
    gsap.ticker.add((_, dtMs) => {
      const v = lenis ? lenis.velocity : 0;
      if (lenis && Math.abs(v) > 0.2) sdir = Math.sign(v);
      const speed = (0.9 + Math.min(Math.abs(v) * 0.35, 14)) * (dtMs / 16.67);
      x -= speed * dir * sdir;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      tracks.forEach((t) => (t.style.transform = `translate3d(${x}px,0,0)`));
    });
  });
}

// --------------------------------------------------------------------------
// Hero: giriş animasyonu ve kaydırınca çıkış
// --------------------------------------------------------------------------
export function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const title = $('[data-hero-title]');
  const split = SplitText.create(title, { type: 'chars,lines', mask: 'lines', linesClass: 'split-line' });
  tl.from(split.chars, { yPercent: 120, rotate: 6, duration: 1.2, stagger: 0.018 }, 0.1)
    .from('[data-hero-anim]', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.09 }, 0.35)
    .from('[data-hero-badge]', { scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.6)' }, 0.6)
    .from('#site-header', { yPercent: -100, autoAlpha: 0, duration: 1, clearProps: 'transform,opacity,visibility' }, 0.2);
  return tl;
}

export function heroScroll(lenis) {
  if (reduced) return;
  gsap.to('.hero__content', {
    yPercent: -18,
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '75% top', scrub: 0.6 },
  });
  gsap.to('.hero__scroll', {
    autoAlpha: 0,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '15% top', scrub: true },
  });
  const ring = $('[data-hero-badge] .badge-ring');
  if (ring) {
    let rot = 0;
    gsap.ticker.add((_, dt) => {
      const v = lenis ? Math.abs(lenis.velocity) : 0;
      rot += (0.012 + v * 0.01) * dt;
      ring.style.transform = `rotate(${rot}deg)`;
    });
    gsap.to('[data-hero-badge]', {
      y: -120,
      autoAlpha: 0,
      scrollTrigger: { trigger: '.hero', start: '20% top', end: '80% top', scrub: true },
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
// Hikâye: sabitlenen bölüm ve adım adım zaman çizelgesi
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
      end: () => '+=' + Math.round(window.innerHeight * n * 0.95),
      pin: true,
      scrub: 0.8,
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
    if (i > 0) tl.fromTo(steps[i], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.22 }, i + 0.02);
    if (i < n - 1) tl.to(steps[i], { autoAlpha: 0, y: -28, duration: 0.2 }, i + 0.8);
  }
  tl.set({}, {}, n);
  return tl;
}

// --------------------------------------------------------------------------
// Kampanyalar: masaüstünde yatay kaydırma
// --------------------------------------------------------------------------
export function initDeals() {
  const section = $('.deals');
  const track = $('[data-deals-track]');
  if (!section || !track) return;
  const cards = $$('.deal-card', track);
  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (ctx) => {
    if (reduced) return;
    if (ctx.conditions.mobile) {
      gsap.set(cards, { autoAlpha: 0, x: 60 });
      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        onEnter: (b) => gsap.to(b, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out', overwrite: true }),
        onLeaveBack: (b) => gsap.to(b, { autoAlpha: 0, x: 60, duration: 0.4, overwrite: true }),
      });
      return;
    }
    section.classList.add('is-horizontal');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + dist(),
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    cards.forEach((card) => {
      gsap.from(card, {
        rotate: 5,
        y: 60,
        scale: 0.9,
        transformOrigin: '50% 100%',
        ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 65%', scrub: true },
      });
    });
    return () => section.classList.remove('is-horizontal');
  });
}

// --------------------------------------------------------------------------
// Menü kategori çubuğu
// --------------------------------------------------------------------------
export function initMenuNav(lenis) {
  const nav = $('[data-menu-nav]');
  if (!nav) return;
  const list = $('.menu-nav__list', nav);
  const btns = $$('[data-cat-link]', nav);
  const setActive = (id) => {
    btns.forEach((b) => {
      const on = b.dataset.catLink === id;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
      if (on) {
        const left = b.offsetLeft - list.clientWidth / 2 + b.clientWidth / 2;
        list.scrollTo({ left, behavior: 'smooth' });
      }
    });
  };
  btns.forEach((b) =>
    b.addEventListener('click', () => {
      const target = $(`#kat-${b.dataset.catLink}`);
      const offset = -($('#site-header').offsetHeight + nav.offsetHeight + 12);
      scrollToTarget(lenis, target, offset);
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
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * 9);
      ry(px * 11);
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
        duration: reduced ? 0 : 0.55,
        ease: 'expo.out',
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
// Konsept seçici: perde animasyonu ve sayfayı yeniden yükleme
// --------------------------------------------------------------------------
export function initSwitcher(currentId, lenis) {
  const curtain = $('[data-curtain]');
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-concept-go]');
    if (!btn) return;
    const id = btn.dataset.conceptGo;
    if (id === currentId) {
      scrollToTarget(lenis, 0);
      return;
    }
    const k = CONCEPTS[id];
    curtain.style.background = k.bg;
    curtain.style.color = k.ink;
    curtain.innerHTML = `<div class="curtain__inner">${mark(id, {}, 'curtain')}<span class="curtain__label">${k.label} konsepti yükleniyor</span></div>`;
    lenis?.stop();
    const go = () => window.location.assign(conceptUrl(id));
    if (reduced) return go();
    gsap
      .timeline({ onComplete: go })
      .to(curtain, { clipPath: 'inset(0% 0 0 0)', duration: 0.75, ease: 'expo.inOut' })
      .from(curtain.firstElementChild, { y: 30, autoAlpha: 0, duration: 0.5, ease: 'expo.out' }, 0.45);
  });
}
