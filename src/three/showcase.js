import * as THREE from 'three';
import { createRig, layoutAnchor, pointerTilt } from './compose.js';

// Premium sahne yönetmeni: tek bir hero kompozisyonu ve "ustalık" bölümlerinde
// sırayla sahneye gelen sergi nesneleri. Hareketler sakin, sabitleme yok.

function prepShadows(obj) {
  obj.traverse((o) => {
    if (o.isMesh && !o.userData.isShadow && !(o.material && o.material.transparent && o.material.opacity < 0.5)) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
}

function groundFor(obj, opacity) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(Math.max(size.x, size.z) * 3, Math.max(size.x, size.z) * 3),
    new THREE.ShadowMaterial({ opacity })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = box.min.y + 0.001;
  plane.receiveShadow = true;
  plane.userData.isShadow = true;
  return plane;
}

// Nesneyi merkezler ve verilen boyuta ölçekler (ölçü kutusu: genişlik/derinlik)
function normalize(obj, size) {
  const box = new THREE.Box3().setFromObject(obj);
  const s = box.getSize(new THREE.Vector3());
  const c = box.getCenter(new THREE.Vector3());
  const k = size / Math.max(s.x, s.z, s.y * 0.8);
  const g = new THREE.Group();
  obj.position.sub(new THREE.Vector3(c.x, box.min.y, c.z));
  g.add(obj);
  g.scale.setScalar(k);
  return g;
}

export function premiumShowcase({
  stage,
  gsap,
  ScrollTrigger,
  hero,
  chapters = [],
  heroSize = 3.2,
  chapterSize = 2.6,
  heroTilt = 0.42,
  chapterTilt = 0.32,
  shadow = 0.28,
  heroLayout = {
    size: [3.6, 3.2],
    landscape: { x: 0.23, y: -0.08, w: 0.46, h: 0.8 },
    portrait: { x: 0, y: -0.23, w: 0.88, h: 0.42 },
  },
  chapterLayout = {
    size: [3.0, 3.0],
    landscape: { x: 0.2, y: -0.02, w: 0.48, h: 0.74 },
    portrait: { x: 0, y: 0.17, w: 0.86, h: 0.4 },
  },
}) {
  // ---------------------------------------------------------------- hero
  const h = createRig(stage.root);
  layoutAnchor(stage, h.anchor, heroLayout);
  pointerTilt(stage, h.tilt, { y: 0.16, x: 0.05, baseX: heroTilt });
  const heroMove = new THREE.Group();
  const heroSpin = new THREE.Group();
  const heroObj = normalize(hero, heroSize);
  prepShadows(heroObj);
  heroSpin.add(heroObj);
  heroSpin.add(groundFor(heroObj, shadow));
  heroMove.add(heroSpin);
  h.tilt.add(heroMove);
  heroMove.position.y = -heroSize * 0.25;

  // ---------------------------------------------------------------- bölümler
  const c = createRig(stage.root);
  layoutAnchor(stage, c.anchor, chapterLayout);
  pointerTilt(stage, c.tilt, { y: 0.14, x: 0.04, baseX: chapterTilt });
  c.anchor.visible = false;
  const holders = chapters.map((obj) => {
    const n = normalize(obj, chapterSize);
    prepShadows(n);
    const spin = new THREE.Group();
    spin.add(n);
    spin.add(groundFor(n, shadow));
    const holder = new THREE.Group();
    holder.add(spin);
    holder.position.y = -chapterSize * 0.28;
    holder.scale.setScalar(0.0001);
    holder.visible = false;
    holder.userData.spin = spin;
    c.tilt.add(holder);
    return holder;
  });

  // Gölge kamerası her iki düzeneği de kapsasın
  const key = stage.lights.key;
  stage.onResize((view) => {
    const x = h.anchor.position.x;
    key.target.position.set(x, 0, 0);
    key.position.set(x + 3.5, 8, 7);
    const cam = key.shadow.camera;
    const r = Math.max(view.width, view.height) * 0.6;
    cam.left = -r;
    cam.right = r;
    cam.top = r;
    cam.bottom = -r;
    cam.near = 0.5;
    cam.far = 30;
    cam.updateProjectionMatrix();
  });

  let heroScroll = 0;
  stage.onUpdate((t) => {
    heroSpin.rotation.y = Math.sin(t * 0.22) * 0.18 + heroScroll * 0.9;
    // sergi nesneleri tam dönmez; yan profili koruyarak hafifçe salınır
    holders.forEach((hd, i) => {
      if (hd.visible) hd.userData.spin.rotation.y = Math.sin(t * 0.3 + i) * 0.45;
    });
  });

  // Hero kaydırılınca yavaşça döner ve yukarı süzülür
  ScrollTrigger.create({
    trigger: '.p-hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      heroScroll = self.progress;
      heroMove.position.y = -heroSize * 0.25 + self.progress * heroSize * 0.55;
    },
  });
  ScrollTrigger.create({
    trigger: '.p-hero',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (h.anchor.visible = self.isActive),
  });

  // Bölüm geçişleri
  let active = -1;
  const show = (i) => {
    if (i === active) return;
    const prev = active;
    active = i;
    if (prev >= 0) {
      const p = holders[prev];
      gsap.to(p.scale, {
        x: 0.0001,
        y: 0.0001,
        z: 0.0001,
        duration: 0.5,
        ease: 'power2.in',
        overwrite: true,
        onComplete: () => {
          if (active !== prev) p.visible = false;
        },
      });
      gsap.to(p.position, { y: -chapterSize * 0.28 - 0.4, duration: 0.5, ease: 'power2.in', overwrite: true });
    }
    if (i >= 0 && holders[i]) {
      const n = holders[i];
      n.visible = true;
      const delay = prev >= 0 ? 0.3 : 0;
      gsap.fromTo(n.scale, { x: 0.0001, y: 0.0001, z: 0.0001 }, { x: 1, y: 1, z: 1, duration: 1.1, delay, ease: 'power3.out', overwrite: true });
      gsap.fromTo(n.position, { y: -chapterSize * 0.28 - 0.5 }, { y: -chapterSize * 0.28, duration: 1.1, delay, ease: 'power3.out', overwrite: true });
    }
  };
  document.querySelectorAll('[data-chapter]').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 62%',
      end: 'bottom 38%',
      onToggle: (self) => self.isActive && show(i),
    });
  });
  ScrollTrigger.create({
    trigger: '.p-chapters',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      c.anchor.visible = self.isActive;
      if (!self.isActive) {
        holders.forEach((hd) => {
          gsap.killTweensOf(hd.scale);
          gsap.killTweensOf(hd.position);
          hd.scale.setScalar(0.0001);
          hd.visible = false;
        });
        active = -1;
      }
    },
  });

  return {
    intro() {
      const tl = gsap.timeline();
      heroObj.scale.multiplyScalar(0.94);
      tl.fromTo(heroMove.position, { y: -heroSize * 0.25 - 0.8 }, { y: -heroSize * 0.25, duration: 1.8, ease: 'power3.out' }, 0);
      tl.to(heroObj.scale, { x: heroObj.scale.x / 0.94, y: heroObj.scale.y / 0.94, z: heroObj.scale.z / 0.94, duration: 1.8, ease: 'power3.out' }, 0);
      tl.from(heroSpin.rotation, { x: 0.25, duration: 1.8, ease: 'power3.out' }, 0);
      return tl;
    },
  };
}
