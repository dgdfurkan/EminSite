import * as THREE from 'three';
import * as sections from './ui/sections.js';
import * as fx from './ui/fx.js';
import { initOrdering } from './ui/order.js';
import { createCart } from './core/cart.js';
import { faviconHref, mark } from './core/logos.js';
import { $, $$, esc } from './core/util.js';
import { Stage, ThumbRenderer, Viewer, supportsWebGL } from './three/stage.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

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
    tr = new ThumbRenderer(512, concept.thumbOpts);
  } catch (e) {
    console.error(e);
    catalog.forEach((p) => store.fail(p.id, p.name));
    return;
  }
  const ids = [...new Set([...concept.deals.items, ...catalog.keys()])];
  for (const id of ids) {
    const p = catalog.get(id);
    if (!p) continue;
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

export async function boot(concept) {
  const { gsap, ScrollTrigger } = fx;
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
      duration: 0.45,
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

  $('#app').innerHTML = [
    sections.header(concept),
    '<main id="main">',
    '<div id="scene-zone">',
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
    sections.switcher(concept),
    '</main>',
    sections.footer(concept),
    sections.overlays(concept),
  ].join('');
  $('#stage-backdrop').innerHTML = sections.backdrop(concept);
  setProgress(25);

  await Promise.race([document.fonts.ready, wait(2500)]);
  setProgress(45);

  // --- Kaydırma ve temel davranışlar
  const lenis = fx.initLenis();
  lenis?.stop();
  fx.initAnchors(lenis);
  fx.initHeader(lenis);
  fx.initOpenStatus(concept.hours);

  const cart = createCart(concept.id, catalog);
  const thumbs = createThumbStore();
  const webgl = supportsWebGL();
  initOrdering({
    concept,
    catalog,
    cart,
    thumbs,
    lenis,
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
  const storyTl = fx.storyTimeline();
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
  fx.heroScroll(lenis);
  fx.initMarquee(lenis);
  fx.initReveals();
  fx.initDeals();
  fx.initMenuNav(lenis);
  fx.initTilt();
  fx.initMagnetic();
  fx.initFaq();
  fx.initSpinners();
  fx.initSwitcher(concept.id, lenis);

  if (stage) {
    ScrollTrigger.create({
      trigger: '#scene-zone',
      start: 'top top',
      end: 'bottom top',
      onToggle: (self) => {
        stage.setActive(self.isActive);
        $('#stage-backdrop').style.visibility = self.isActive ? 'visible' : 'hidden';
      },
    });
  }
  ScrollTrigger.refresh();
  setProgress(100);
  await wait(500);

  // --- Açılış
  const intro = gsap.timeline({
    onComplete: () => {
      ScrollTrigger.refresh();
      setTimeout(() => (webgl ? generateThumbs(concept, catalog, thumbs) : catalog.forEach((p) => thumbs.fail(p.id, p.name))), 150);
    },
  });
  intro.to(pre, { clipPath: 'inset(0 0 100% 0)', duration: 0.95, ease: 'expo.inOut' });
  intro.call(
    () => {
      pre.remove();
      lenis?.start();
    },
    null,
    1.0
  );
  if (sceneApi?.intro) intro.add(sceneApi.intro(), 0.3);
  intro.add(fx.heroIntro(), 0.4);

  // Yeniden boyutlanınca ölçüleri güncelle
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
}
