import * as THREE from 'three';
import { floater } from './kit.js';

// Hero ve hikâye kompozisyonları için ortak düzenek.
// Katmanlar: anchor (ekrana göre yerleşim) > tilt (imleç) > holder (kaydırma) > pop (açılış) > floater (boşta süzülme) > model

export function createRig(parent) {
  const anchor = new THREE.Group();
  const tilt = new THREE.Group();
  anchor.add(tilt);
  parent.add(anchor);
  const items = [];
  return {
    anchor,
    tilt,
    items,
    add(model, { p = [0, 0, 0], r = [0, 0, 0], s = 1, float = {}, exit = null, into = tilt } = {}) {
      const holder = new THREE.Group();
      const pop = new THREE.Group();
      pop.add(floater(model, float));
      holder.add(pop);
      holder.position.set(p[0], p[1], p[2]);
      holder.rotation.set(r[0], r[1], r[2]);
      holder.scale.setScalar(s);
      into.add(holder);
      const it = { holder, pop, model, p, r, s, exit };
      items.push(it);
      return it;
    },
  };
}

// size: kompozisyonun dünya birimindeki genişlik/yükseklik
// landscape/portrait: { x, y } ekranın oranı olarak merkez, { w, h } kullanılabilir alan oranı
export function layoutAnchor(stage, anchor, cfg) {
  stage.onResize((view) => {
    const portrait = view.aspect < 0.9;
    const c = portrait ? cfg.portrait : cfg.landscape;
    const scale = Math.min((view.width * c.w) / cfg.size[0], (view.height * c.h) / cfg.size[1]) * (c.k ?? 1);
    anchor.position.set(view.width * c.x, view.height * c.y, c.z ?? 0);
    anchor.scale.setScalar(scale);
  });
}

export function pointerTilt(stage, group, amt = { y: 0.28, x: 0.14 }) {
  stage.onUpdate(() => {
    group.rotation.y = stage.pointer.sx * amt.y + (amt.baseY || 0);
    group.rotation.x = -stage.pointer.sy * amt.x + (amt.baseX || 0);
  });
}

export function introPop(gsap, items, { delay = 0, stagger = 0.06 } = {}) {
  const tl = gsap.timeline();
  items.forEach((it, i) => {
    it.pop.scale.setScalar(0.0001);
    tl.to(it.pop.scale, { x: 1, y: 1, z: 1, duration: 1.4, ease: 'elastic.out(1, 0.7)' }, delay + i * stagger);
    tl.from(it.pop.rotation, { z: (i % 2 ? 1 : -1) * 1.1, y: (i % 2 ? -1 : 1) * 0.8, duration: 1.4, ease: 'expo.out' }, delay + i * stagger);
  });
  return tl;
}

// Hero'dan aşağı kaydırınca nesneler dışarı savrulur, yukarı çıkınca geri gelir
export function heroExit(gsap, items, trigger = '.hero') {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger, start: 'top top', end: 'bottom top', scrub: 0.4 },
  });
  items.forEach((it, i) => {
    const e = it.exit || {};
    const [x, y, z] = it.p;
    const len = Math.hypot(x, y) || 1;
    const dx = e.dx ?? (x / len) * 3.5;
    const dy = e.dy ?? 11 + y * 0.6;
    tl.to(it.holder.position, { x: x + dx, y: y + dy, z: z + (e.dz ?? 1.5), ease: 'power1.in' }, 0);
    tl.to(
      it.holder.rotation,
      { x: it.r[0] + (e.rx ?? 1.1), y: it.r[1] + (e.ry ?? 1.4), z: it.r[2] + (e.rz ?? (i % 2 ? 0.9 : -0.9)) },
      0
    );
    const k = it.s * (e.shrink ?? 0.55);
    tl.to(it.holder.scale, { x: k, y: k, z: k }, 0);
  });
  return tl;
}

// Hikâye grubunun bölüme girerken aşağıdan yükselmesi
export function storyEnter(gsap, group, trigger = '.story', from = -10) {
  group.visible = false;
  return gsap.fromTo(
    group.position,
    { y: from },
    {
      y: 0,
      ease: 'power2.out',
      scrollTrigger: { trigger, start: 'top bottom', end: 'top top', scrub: 0.4 },
      onUpdate: () => (group.visible = group.position.y > from + 0.05),
    }
  );
}

export const ease = {
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
};

export const clamp01 = (v) => Math.max(0, Math.min(1, v));
