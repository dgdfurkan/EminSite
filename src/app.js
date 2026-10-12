import * as THREE from 'three';
import * as sections from './ui/sections.js';
import * as premiumUI from './ui/premium.js';
import * as fx from './ui/fx.js';
import { initOrdering } from './ui/order.js';
import { createCart } from './core/cart.js';
import { faviconHref, mark } from './core/logos.js';
import { $, $$, esc } from './core/util.js';
import { Stage, ThumbRenderer, Viewer, supportsWebGL } from './three/stage.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// rAF arka plandaki sekmede durur; açılış takılmasın diye zaman aşımı yedeği var
const frame = () =>
  new Promise((r) => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        r();
      }
    };
    requestAnimationFrame(() => setTimeout(go, 0));
    setTimeout(go, 80);
  });
const idle = () =>
  new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(() => r(), { timeout: 200 }) : setTimeout(r, 16)));

// Ürün görselleri: üretildikçe sayfadaki tüm ilgili <img> etiketlerini doldurur
function createThumbStore() {
  const urls = new Map();
  const subs = new Set();
  const fill = (id, fn) => $$(`img[data-thumb="${CSS.escape(id)}"]`).forEach(fn);
  return {
    get: (id) => urls.get(id),
    set(id, url) {
      urls.set(id, url);
      fill(id, (img) => {
        img.src = url;
        img.hidden = false;
        img.parentElement.querySelector('[data-thumb-ph]')?.remove();
      });
      subs.forEach((fn) => fn(id));
    },
    fail(id, name) {
      fill(id, (img) => {
        const ph = img.parentElement.querySelector('[data-thumb-ph]');
        if (ph) ph.outerHTML = `<span class="thumb-fallback" aria-hidden="true">${esc((name || '?').charAt(0))}</span>`;
      });
    },
    onReady(fn) {
      subs.add(fn);
    },
  };
}

async function generateThumbs(concept, catalog, store) {
  let tr;
  try {
    const t = concept.thumbOpts || {};
    tr = new ThumbRenderer(t.width || 512, t.height || t.width || 512, t);
  } catch (e) {
    console.error(e);
    catalog.forEach((p) => store.fail(p.id, p.name));
    return;
  }
  const ids = [...new Set([...concept.deals.items, ...catalog.keys()])];
  for (const id of ids) {
    const p = catalog.get(id);
    if (!p) continue;
    await idle();
    try {
      const spec = concept.thumb(p);
      const url = await tr.render(spec.build, spec.view);
      if (url) store.set(id, url);
      else store.fail(id, p.name);
    } catch (e) {
      console.error('Görsel üretilemedi:', id, e);
      store.fail(id, p.name);
    }
    await frame();
  }
  tr.dispose();
}

function casualPage(concept, catalog) {
  return [
    sections.header(concept),
    '<main id="main">',
    '<div id="scene-zone" data-scene-zone>',
    sections.hero(concept),
    sections.marquee(concept),
    sections.story(concept),
    '</div>',
    sections.deals(concept, catalog),
    sections.menu(concept),
    sections.values(concept),
    sections.local(concept),
    sections.faq(concept),
    sections.ctaBand(concept),
    '</main>',
    sections.footer(concept),
    sections.overlays(concept),
  ].join('');
}

export async function boot(concept) {
  const { gsap, ScrollTrigger } = fx;
  const premium = concept.tier === 'premium';
  document.documentElement.dataset.tier = premium ? 'premium' : 'casual';
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  document.title = concept.meta.title;
  $('meta[name="description"]').setAttribute('content', concept.meta.description);
  $('#favicon').href = faviconHref(concept.id);

  // --- Ön yükleyici
  const pre = $('#preloader');
  $('#preloader-mark').innerHTML = mark(concept.id, {}, 'pre');
  const bar = $('#preloader-bar');
  const count = $('#preloader-count');
  const prog = { v: 0 };
  const setProgress = (v) =>
    gsap.to(prog, {
      v,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: () => {
        bar.style.transform = `scaleX(${prog.v / 100})`;
        count.textContent = String(Math.round(prog.v));
      },
    });

  // --- Katalog ve sayfa
  const catalog = new Map();
  concept.menu.categories.forEach((c) => c.products.forEach((p) => catalog.set(p.id, p)));

  $('#app').innerHTML = premium ? premiumUI.page(concept, catalog) : casualPage(concept, catalog);
  $('#stage-backdrop').innerHTML = premium ? '' : sections.backdrop(concept);
  setProgress(25);

  await Promise.race([document.fonts.ready, wait(2500)]);
  setProgress(45);

  // --- Kaydırma ve temel davranışlar
  const scroller = fx.createScroller();
  scroller.stop();
  fx.initAnchors(scroller);
  fx.initHeader(scroller);
  fx.initOpenStatus(concept.hours);

  const cart = createCart(concept.id, catalog);
  const thumbs = createThumbStore();
  const webgl = supportsWebGL();
  initOrdering({
    concept,
    catalog,
    cart,
    thumbs,
    scroller,
    viewerFactory: webgl
      ? () => {
          try {
            return new Viewer(concept.thumbOpts);
          } catch (e) {
            console.error(e);
            return null;
          }
        }
      : null,
  });

  // --- 3D sahne
  const storyTl = premium ? null : fx.storyTimeline();
  let stage = null;
  let sceneApi = null;
  if (webgl) {
    try {
      stage = new Stage($('#stage'), concept.stageOpts);
      sceneApi = concept.scene.build({ THREE, stage, gsap, ScrollTrigger, storyTl, reduced: fx.reduced });
      await frame();
      stage.warmup();
    } catch (e) {
      console.error('3D sahne başlatılamadı:', e);
      stage = null;
      sceneApi = null;
      $('#stage').innerHTML = '';
    }
  }
  setProgress(80);

  // --- Kaydırma efektleri
  if (premium) {
    fx.initReveals({ soft: true });
    fx.initManifesto();
    premiumUI.initHeroScroll(gsap, fx.reduced);
  } else {
    fx.heroScroll(scroller);
    fx.initMarquee(scroller);
    fx.initReveals();
    fx.initTilt();
    fx.initMagnetic();
    fx.initSpinners();
  }
  fx.initCarousel();
  fx.initMenuNav(scroller);
  fx.initFaq();
  fx.initSwitcher(concept.id, scroller);

  // 3D yalnızca sahne bölgeleri ekrandayken çizilir
  if (stage) {
    const zones = $$('[data-scene-zone]');
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      const on = visible.size > 0;
      stage.setActive(on);
      $('#stage-backdrop').style.visibility = on ? 'visible' : 'hidden';
    });
    zones.forEach((z) => io.observe(z));
  }
  ScrollTrigger.refresh();
  setProgress(100);
  if (import.meta.env.DEV) {
    // Test yardımcısı: görünmeyen sekmede zamanı elle ilerletip kareyi çizer
    window.__dev = {
      gsap,
      ScrollTrigger,
      stage,
      advance(sec = 1, steps = 30) {
        for (let i = 0; i < steps; i++) {
          gsap.globalTimeline.time(gsap.globalTimeline.time() + sec / steps);
          if (stage) {
            stage._last = performance.now() - (sec / steps) * 1000;
            stage.tick();
          }
        }
      },
    };
  }
  await wait(350);

  // --- Açılış
  const intro = gsap.timeline({ onComplete: () => ScrollTrigger.refresh() });
  // Ürün görselleri açılış animasyonundan bağımsız başlasın (arka plan sekmesinde de)
  setTimeout(() => (webgl ? generateThumbs(concept, catalog, thumbs) : catalog.forEach((p) => thumbs.fail(p.id, p.name))), 1800);
  intro.to(pre, { clipPath: 'inset(0 0 100% 0)', duration: premium ? 1.1 : 0.9, ease: premium ? 'power3.inOut' : 'expo.inOut' });
  intro.call(
    () => {
      pre.remove();
      scroller.start();
    },
    null,
    0.6
  );
  if (sceneApi?.intro) intro.add(sceneApi.intro(), 0.3);
  intro.add(fx.heroIntro({ soft: premium }), 0.4);

  // Yeniden boyutlanınca ölçüleri güncelle
  let rt;
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastW) return; // mobil adres çubuğu
    lastW = window.innerWidth;
    clearTimeout(rt);
    rt = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
}
