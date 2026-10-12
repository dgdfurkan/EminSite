import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as T from '../../three/textures.js';
import * as M from './models.js';
import { createRig, layoutAnchor, pointerTilt, introPop, heroExit, storyEnter, ease, clamp01 } from '../../three/compose.js';

export function build({ stage, gsap, storyTl }) {
  // ======================================================================
  // HERO: marul yatağında çiğ köfteler, uçuşan limon, nar ve biber
  // ======================================================================
  const hero = createRig(stage.root);
  layoutAnchor(stage, hero.anchor, {
    size: [5.2, 4.4],
    landscape: { x: 0.24, y: -0.02, w: 0.5, h: 0.92 },
    portrait: { x: 0, y: -0.3, w: 0.98, h: 0.38 },
  });
  pointerTilt(stage, hero.tilt, { y: 0.3, x: 0.14 });

  const bed = new THREE.Group();
  const bigLeaf = K.leaf({ w: 2.3, h: 3.1, cup: 0.22, ruffle: 0.07, curl: 0.1, seed: 2 });
  bigLeaf.rotation.set(-Math.PI / 2, 0, 0.5);
  bed.add(bigLeaf);
  const leaf2 = K.leaf({ w: 1.6, h: 2.2, cup: 0.3, ruffle: 0.08, seed: 9 });
  leaf2.rotation.set(-Math.PI / 2 + 0.15, 0, -0.9);
  leaf2.position.set(0.5, 0.06, 0.2);
  bed.add(leaf2);
  [
    [-0.45, -0.2, 0.3],
    [0.25, 0.15, -0.5],
    [0.05, -0.55, 0.9],
  ].forEach(([x, z, ry], i) => {
    const k = M.kofte({ seed: i + 1 });
    k.position.set(x, 0.2 + i * 0.03, z);
    k.rotation.y = ry;
    bed.add(k);
  });
  const bedLemon = K.citrusSlice({ r: 0.32, t: 0.07 });
  bedLemon.position.set(0.75, 0.14, 0.55);
  bedLemon.rotation.set(0.3, 0, 0.35);
  bed.add(bedLemon);

  hero.add(bed, { p: [0.2, -0.35, 0], r: [0.72, 0.2, 0], s: 1.05, float: { amp: 0.06, speed: 0.6, rot: 0.05 }, exit: { dx: 0, dy: 12, dz: 2, rx: 0.9, ry: 0.6, rz: 0 } });
  hero.add(M.yogrumWrap({ seed: 2 }), { p: [1.75, 0.95, -0.9], r: [0.25, 0.6, -0.62], s: 0.82, float: { amp: 0.1, speed: 0.7, phase: 1 } });
  hero.add(K.citrusSlice({ r: 0.36, t: 0.075 }), { p: [-1.75, 1.35, 0.4], r: [1.15, 0.2, 0.5], s: 1, float: { amp: 0.12, speed: 0.9, phase: 2 } });
  hero.add(K.citrusSlice({ r: 0.3, t: 0.07 }), { p: [2.3, -1.25, 0.7], r: [0.6, -0.4, -0.3], s: 1, float: { amp: 0.1, speed: 1.1, phase: 3 } });
  hero.add(K.pepper({ len: 1.2, r: 0.08 }), { p: [-2.05, -0.75, 0.25], r: [0.3, 0.4, 0.95], s: 1.05, float: { amp: 0.09, speed: 0.8, phase: 4 } });
  hero.add(K.seeds({ count: 9, radius: 0.18, size: 0.06, seed: 3 }), { p: [-1.15, -1.6, 1.1], float: { amp: 0.14, speed: 1.2, phase: 5 } });
  hero.add(K.seeds({ count: 7, radius: 0.14, size: 0.06, seed: 6 }), { p: [1.05, 1.95, 0.5], float: { amp: 0.12, speed: 1, phase: 6 } });
  hero.add(K.seeds({ count: 5, radius: 0.12, size: 0.065, seed: 9 }), { p: [-2.2, 0.35, -0.6], float: { amp: 0.1, speed: 1.3, phase: 7 } });
  hero.add(M.kofte({ seed: 7 }), { p: [-0.95, 1.65, -0.5], r: [0.4, 0.8, 0.5], s: 0.9, float: { amp: 0.12, speed: 0.75, phase: 8 } });
  hero.add(K.sprig({ tone: 'mint', leaves: 5, size: 0.28, seed: 2 }), { p: [0.95, -1.75, 1.0], r: [0.6, 0, -0.5], float: { amp: 0.1, speed: 0.9, phase: 9 } });

  heroExit(gsap, hero.items);

  // ======================================================================
  // HİKÂYE: buğday > isot > yoğurma > sıkma
  // ======================================================================
  const story = createRig(stage.root);
  layoutAnchor(stage, story.anchor, {
    size: [3.4, 3.6],
    landscape: { x: 0.21, y: -0.03, w: 0.5, h: 0.84 },
    portrait: { x: 0, y: 0.17, w: 0.95, h: 0.5 },
  });
  pointerTilt(stage, story.tilt, { y: 0.22, x: 0.08, baseX: 0.42 });
  const lift = new THREE.Group();
  story.tilt.add(lift);
  storyEnter(gsap, lift);

  const st = { bowl: 0, grain: 0, color: 0, flakes: 0, dough: 0, knead: 0, plate: 0, wheat: 1 };

  // Leğen
  const bowl = M.kneadBowl();
  bowl.position.y = -1.15;
  bowl.scale.setScalar(0.0001);
  lift.add(bowl);
  const bowlShadow = K.contactShadow(3.2, 0.28);
  bowlShadow.position.y = -1.16;
  lift.add(bowlShadow);

  // Başaklar
  const wheat = new THREE.Group();
  [-0.38, 0, 0.38].forEach((rz, i) => {
    const w = M.wheatEar({ len: 1.9 - Math.abs(rz) * 0.6, seed: i + 1 });
    w.rotation.z = rz;
    w.position.x = rz * 0.4;
    wheat.add(w);
  });
  wheat.position.y = -0.95;
  lift.add(wheat);

  // Bulgur taneleri
  const grains = M.grainCloud({ count: 260 });
  lift.add(grains);
  const gR = T.rng(42);
  const gData = Array.from({ length: grains.count }, () => {
    const a = gR() * Math.PI * 2;
    const rad = 1.1 + gR() * 0.7;
    const pa = gR() * Math.PI * 2;
    const pr = Math.sqrt(gR()) * 0.85;
    return {
      a,
      rad,
      h: -0.4 + gR() * 1.9,
      spin: 0.25 + gR() * 0.35,
      delay: gR() * 0.45,
      end: new THREE.Vector3(Math.cos(pa) * pr, -0.98 + (1 - pr / 0.85) * 0.22 + gR() * 0.05, Math.sin(pa) * pr),
      rot: new THREE.Euler(gR() * 3, gR() * 3, gR() * 3),
      s: 0.028 + gR() * 0.018,
    };
  });

  // İsot pulları
  const fl = M.flakes({ count: 120 });
  lift.add(fl);
  const fR = T.rng(7);
  const fData = Array.from({ length: fl.count }, () => {
    const pa = fR() * Math.PI * 2;
    const pr = Math.sqrt(fR()) * 0.8;
    return {
      start: new THREE.Vector3((fR() - 0.5) * 1.6, 2.4 + fR() * 1.6, (fR() - 0.5) * 1.2),
      end: new THREE.Vector3(Math.cos(pa) * pr, -0.82 + (1 - pr / 0.8) * 0.18, Math.sin(pa) * pr),
      delay: fR() * 0.5,
      rot: new THREE.Euler(fR() * 3, fR() * 3, fR() * 3),
      s: 0.02 + fR() * 0.025,
    };
  });

  // Kuru kırmızı biberler
  const reds = new THREE.Group();
  [
    [-1.25, 0.4, 0.2, 0.6],
    [1.25, 0.1, -0.1, -0.9],
  ].forEach(([x, y, z, rz]) => {
    const p = K.pepper({ len: 1, r: 0.075, color: '#a51d12', curve: 0.3 });
    p.position.set(x, y, z);
    p.rotation.z = rz;
    reds.add(p);
  });
  reds.scale.setScalar(0.0001);
  lift.add(reds);

  // Hamur
  const mass = M.dough({ r: 0.72 });
  mass.position.y = -0.92;
  mass.scale.setScalar(0.0001);
  lift.add(mass);

  // Sunum tabağı
  const plate = new THREE.Group();
  const plateBase = K.plate({ r: 1.35, color: '#fffaf2', rimColor: '#d7262f' });
  plate.add(plateBase);
  for (let i = 0; i < 3; i++) {
    const l = K.leaf({ w: 1.05, h: 1.55, cup: 0.2, ruffle: 0.08, curl: 0.12, seed: i * 5 });
    const a = (i - 1) * 1.0;
    l.rotation.set(-Math.PI / 2 + 0.1, 0, a + Math.PI);
    l.position.set(Math.sin(a) * 0.3, 0.09 + i * 0.012, Math.cos(a) * 0.3);
    plate.add(l);
  }
  const pieces = [];
  [
    [-0.45, 0.0, 0.3],
    [0.05, -0.28, -0.2],
    [0.48, -0.02, -0.45],
    [-0.15, 0.36, 0.55],
    [0.32, 0.35, -0.1],
  ].forEach(([x, z, ry], i) => {
    const k = M.kofte({ len: 0.74, rad: 0.18, seed: i + 3 });
    const holder = new THREE.Group();
    holder.add(k);
    holder.position.set(x, 0.24, z);
    holder.rotation.y = ry;
    holder.scale.setScalar(0.0001);
    plate.add(holder);
    pieces.push(holder);
  });
  const pLemon = K.citrusSlice({ r: 0.26, t: 0.06 });
  pLemon.position.set(0.85, 0.16, 0.45);
  pLemon.rotation.set(0.45, 0, 0.35);
  plate.add(pLemon);
  const pSeeds = K.seeds({ count: 14, radius: 0.22, size: 0.05, flat: true, seed: 4 });
  pSeeds.position.set(-0.78, 0.14, 0.5);
  plate.add(pSeeds);
  plate.position.y = -1.0;
  plate.scale.setScalar(0.0001);
  lift.add(plate);

  // Her karede örnek konumlarını hesapla
  const mtx = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const vA = new THREE.Vector3();
  const vS = new THREE.Vector3();
  const cFrom = new THREE.Color('#dcbc80');
  const cTo = new THREE.Color('#a8401f');
  stage.onUpdate((t) => {
    if (!story.anchor.visible) return;
    const shrink = 1 - ease.out(clamp01(st.dough * 1.4));
    for (let i = 0; i < gData.length; i++) {
      const d = gData[i];
      const p = ease.inOut(clamp01((st.grain - d.delay) / 0.55));
      const a = d.a + t * d.spin * (1 - p);
      vA.set(Math.cos(a) * d.rad, d.h + Math.sin(t * 0.8 + d.a) * 0.08, Math.sin(a) * d.rad);
      vA.lerp(d.end, p);
      quat.setFromEuler(d.rot);
      const s = d.s * shrink * (st.grain > 0.001 || st.wheat > 0 ? 1 : 0);
      vS.set(s, s * 0.7, s * 0.8);
      mtx.compose(vA, quat, vS);
      grains.setMatrixAt(i, mtx);
    }
    grains.instanceMatrix.needsUpdate = true;
    grains.material.color.copy(cFrom).lerp(cTo, st.color);

    for (let i = 0; i < fData.length; i++) {
      const d = fData[i];
      const p = ease.inOut(clamp01((st.flakes - d.delay) / 0.5));
      vA.copy(d.start).lerp(d.end, p);
      quat.setFromEuler(d.rot);
      const vis = st.flakes > 0.001 ? 1 : 0;
      const s = d.s * shrink * vis;
      vS.set(s, s * 0.35, s);
      mtx.compose(vA, quat, vS);
      fl.setMatrixAt(i, mtx);
    }
    fl.instanceMatrix.needsUpdate = true;

    // yoğurma: kaydırdıkça hamur ezilip döner
    const k = st.knead;
    const squash = Math.pow(Math.sin(k * Math.PI * 7), 2);
    const ds = Math.max(0.0001, ease.out(st.dough));
    mass.scale.set(ds * (1 + squash * 0.12), ds * (1 - squash * 0.22), ds * (1 + squash * 0.1));
    mass.rotation.y = k * Math.PI * 3;
    reds.rotation.y = t * 0.4;
    bowl.scale.setScalar(Math.max(0.0001, st.bowl));
  });

  // Zaman çizelgesi (0-4 arası, her adım 1 birim)
  const tl = storyTl;
  tl.to(st, { bowl: 1, duration: 0.35, ease: 'back.out(1.6)' }, 0.05)
    .to(st, { grain: 1, duration: 0.8 }, 0.15)
    .to(wheat.rotation, { y: Math.PI * 0.6, duration: 1 }, 0)
    .to(wheat.position, { y: 2.4, duration: 0.35, ease: 'power2.in' }, 0.75)
    .to(wheat.scale, { x: 0.0001, y: 0.0001, z: 0.0001, duration: 0.35, ease: 'power2.in' }, 0.75)
    .to(reds.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'back.out(1.5)' }, 1.0)
    .to(st, { flakes: 1, duration: 0.75 }, 1.08)
    .to(st, { color: 1, duration: 0.7 }, 1.25)
    .to(reds.scale, { x: 0.0001, y: 0.0001, z: 0.0001, duration: 0.25 }, 1.75)
    .to(st, { dough: 1, duration: 0.4 }, 2.0)
    .to(st, { knead: 1, duration: 0.85 }, 2.1)
    .to(lift.rotation, { y: 0.5, duration: 1 }, 2.0)
    .to(bowl.position, { y: -6, duration: 0.35, ease: 'power2.in' }, 3.0)
    .to(mass.position, { y: -5.8, duration: 0.35, ease: 'power2.in' }, 3.0)
    .to(st, { bowl: 0, duration: 0.3, ease: 'power2.in' }, 3.05)
    .to(bowlShadow.material, { opacity: 0, duration: 0.2 }, 3.0)
    .to(plate.scale, { x: 1.18, y: 1.18, z: 1.18, duration: 0.35, ease: 'back.out(1.4)' }, 3.12)
    .to(lift.rotation, { y: -0.35, duration: 1 }, 3.0);
  pieces.forEach((p, i) => {
    tl.to(p.scale, { x: 1, y: 1, z: 1, duration: 0.18, ease: 'back.out(2.2)' }, 3.3 + i * 0.09);
  });

  return {
    intro() {
      const tl2 = introPop(gsap, hero.items, { delay: 0, stagger: 0.05 });
      return tl2;
    },
  };
}
