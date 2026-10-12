import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as T from '../../three/textures.js';
import * as M from './models.js';
import { createRig, layoutAnchor, pointerTilt, introPop, heroExit, storyEnter, clamp01 } from '../../three/compose.js';

export function build({ stage, gsap, storyTl }) {
  // ======================================================================
  // Ortam: ekran boyunca yükselen kıvılcımlar
  // ======================================================================
  const sparks = K.embers({
    count: stage.isMobile ? 130 : 260,
    w: 14,
    h: 9,
    d: 4,
    size: stage.isMobile ? 26 : 34,
  });
  stage.root.add(sparks);
  stage.onResize((view) => {
    sparks.position.set(0, -view.height / 2 - 0.5, -2);
    sparks.scale.set(Math.max(1, view.width / 12), Math.max(1, view.height / 7), 1);
  });

  // ======================================================================
  // HERO: korun üstünde süzülen dürüm
  // ======================================================================
  const hero = createRig(stage.root);
  layoutAnchor(stage, hero.anchor, {
    size: [5.4, 5],
    landscape: { x: 0.24, y: -0.02, w: 0.5, h: 0.95 },
    portrait: { x: 0, y: -0.29, w: 1.02, h: 0.42 },
  });
  pointerTilt(stage, hero.tilt, { y: 0.32, x: 0.14 });

  hero.add(M.mangal({ w: 3.4, d: 1.3 }), { p: [0.15, -2.1, -0.9], r: [0.42, 0, 0], s: 1.2, float: { amp: 0, rot: 0 }, exit: { dx: 0, dy: -6, dz: 0, rx: 0.3, ry: 0, rz: 0, shrink: 0.8 } });
  hero.add(M.korWrap({ radius: 0.47, length: 2.15, seed: 1 }), { p: [0.25, 0.25, 0.2], r: [0.12, 0.65, -0.4], s: 1.12, float: { amp: 0.09, speed: 0.6, rot: 0.06 }, exit: { dx: 0.5, dy: 12, dz: 2, rx: 1, ry: 2, rz: 0.5 } });
  hero.add(M.skewer({ len: 2.1, seed: 2 }), { p: [-0.6, -0.35, -1.5], r: [0.25, 0.35, 0.5], s: 1.05, float: { amp: 0.07, speed: 0.7, phase: 1 } });
  hero.add(K.tomato({ r: 0.32, charred: true }), { p: [-1.95, 1.15, 0.4], r: [0.3, 0, 0.2], float: { amp: 0.12, speed: 0.9, phase: 2 } });
  hero.add(K.tomato({ r: 0.27 }), { p: [2.05, -1.2, 0.7], r: [-0.2, 0.4, 0], float: { amp: 0.1, speed: 1, phase: 3 } });
  hero.add(K.pepper({ len: 1.15, r: 0.075, charred: true }), { p: [-2.05, -0.95, 0.3], r: [0.3, 0.4, 1.05], float: { amp: 0.1, speed: 0.8, phase: 4 } });
  hero.add(K.pepper({ len: 1.0, r: 0.07 }), { p: [1.95, 1.55, -0.3], r: [0.2, -0.4, -0.55], float: { amp: 0.1, speed: 0.95, phase: 5 } });
  hero.add(K.onionRing({ r: 0.2 }), { p: [1.25, -1.75, 1.1], r: [1.1, 0.3, 0.2], float: { amp: 0.12, speed: 1.1, phase: 6 } });
  hero.add(K.onionRing({ r: 0.16 }), { p: [-1.15, 1.95, 0.3], r: [0.6, 0, 0.8], float: { amp: 0.1, speed: 1.2, phase: 7 } });
  hero.add(K.sprig({ tone: 'parsley', leaves: 6, size: 0.28, seed: 3 }), { p: [2.3, 0.25, 0.7], r: [0.5, 0, -0.4], float: { amp: 0.1, speed: 0.9, phase: 8 } });
  hero.add(K.ayranBowl(), { p: [-1.55, -1.75, 0.9], r: [0.45, 0, 0.1], s: 0.85, float: { amp: 0.08, speed: 0.7, phase: 9 } });

  heroExit(gsap, hero.items);

  // ======================================================================
  // HİKÂYE: zırh > köz > lavaş > sarma
  // ======================================================================
  const story = createRig(stage.root);
  layoutAnchor(stage, story.anchor, {
    size: [3.6, 3.4],
    landscape: { x: 0.21, y: -0.04, w: 0.5, h: 0.84 },
    portrait: { x: 0, y: 0.17, w: 0.95, h: 0.5 },
  });
  pointerTilt(stage, story.tilt, { y: 0.2, x: 0.08, baseX: 0.5 });
  const lift = new THREE.Group();
  story.tilt.add(lift);
  storyEnter(gsap, lift);

  const st = { chop: 0, spin: 0, drop: 0, roll: 0, paper: 0, upright: 0, sheet: 0, swap: 0 };

  // 1) Tahta, kıyma, zırh
  const prep = new THREE.Group();
  const brd = M.board({ w: 2.6, d: 1.7 });
  brd.position.y = -1.0;
  const pile = M.mincePile();
  pile.position.set(0.1, -0.94, 0.05);
  const knife = M.zirh();
  const knifePivot = new THREE.Group();
  knife.position.y = 0.66;
  knifePivot.add(knife);
  knifePivot.position.set(0.1, -0.74, 0.05);
  const flakes = K.seeds({ count: 30, radius: 0.5, size: 0.025, color: '#b3261a', seed: 11, flat: true });
  flakes.position.set(-0.6, -0.92, 0.35);
  prep.add(brd, pile, knifePivot, flakes);
  const prepShadow = K.contactShadow(3.6, 0.5);
  prepShadow.position.y = -1.07;
  prep.add(prepShadow);
  lift.add(prep);

  // 2) Mangal ve şişler
  const grill = new THREE.Group();
  const mg = M.mangal({ w: 3, d: 1.25, count: 40, seed: 7 });
  mg.position.y = -1.1;
  grill.add(mg);
  const skewers = [];
  [-0.35, 0, 0.35].forEach((z, i) => {
    const sk = M.skewer({ len: 2.0, seed: i + 4 });
    sk.position.set(-0.1, -0.62, z);
    grill.add(sk);
    skewers.push(sk);
  });
  const charT = K.tomato({ r: 0.2, charred: true });
  charT.position.set(1.15, -0.78, 0.3);
  const charP = K.pepper({ len: 0.8, r: 0.06, charred: true });
  charP.rotation.set(0, 0.3, -Math.PI / 2);
  charP.position.set(0.9, -0.8, -0.35);
  grill.add(charT, charP);
  grill.position.y = -6;
  grill.visible = false;
  lift.add(grill);

  // 3-4) Lavaş, malzemeler, sarma
  const rollG = new THREE.Group();
  const sheet = M.rollingLavas({ W: 2.4, H: 1.9 });
  rollG.add(sheet);
  const W = sheet.userData.W;
  const rMax = sheet.userData.rMax;
  const tops = [];
  const addTop = (obj, s, z, y = 0.05) => {
    const holder = new THREE.Group();
    holder.add(obj);
    holder.position.set(s - W, -rMax + y, z);
    holder.userData.s = s;
    holder.userData.y0 = holder.position.y;
    holder.scale.setScalar(0.0001);
    rollG.add(holder);
    tops.push(holder);
  };
  const meat = M.kebabMeat({ len: 1.5, seed: 9, r: 0.1 });
  meat.rotation.y = Math.PI / 2;
  addTop(meat, 0.42, 0, 0.09);
  [-0.55, -0.18, 0.2, 0.58].forEach((z, i) => {
    const t = K.citrusSlice({ r: 0.11, t: 0.03, kind: 'tomato' });
    t.rotation.set(0.15, 0, 0.2);
    addTop(t, 0.7, z, 0.04 + (i % 2) * 0.01);
  });
  [-0.4, 0.35].forEach((z) => {
    const o = K.onionRing({ r: 0.12, tube: 0.02 });
    o.rotation.x = Math.PI / 2;
    addTop(o, 0.6, z, 0.04);
  });
  [-0.65, 0, 0.62].forEach((z, i) => {
    const sp = K.sprig({ tone: 'parsley', leaves: 5, size: 0.16, seed: i + 2 });
    sp.rotation.set(Math.PI / 2 - 0.3, 0, 0);
    addTop(sp, 0.25, z, 0.04);
  });
  // sarıldıktan sonra uçta görünen harç
  const cap = new THREE.Mesh(new THREE.CircleGeometry(rMax * 0.82, 32), K.std({ map: T.fillingTexture('adana'), roughness: 0.7 }));
  cap.position.z = 0.95;
  cap.scale.setScalar(0.0001);
  rollG.add(cap);
  // kâğıt
  const pGeo = new THREE.CylinderGeometry(rMax * 1.1, rMax * 1.1, 1.9 * 0.55, 48, 1, true);
  pGeo.translate(0, (1.9 * 0.55) / 2, 0);
  pGeo.rotateX(Math.PI / 2);
  const paper = new THREE.Mesh(pGeo, K.std({ map: T.paperTexture('kor'), roughness: 0.8, side: THREE.DoubleSide }));
  paper.position.z = -0.96;
  paper.scale.set(1, 1, 0.0001);
  rollG.add(paper);
  const rollPivot = new THREE.Group();
  rollPivot.add(rollG);
  // Sarma bitince yerini gerçek, kâğıtlı ve harcı görünen dürüm alır
  const finalWrap = M.korWrap({ radius: 0.34, length: 1.9, seed: 4 });
  finalWrap.scale.setScalar(0.0001);
  rollPivot.add(finalWrap);
  rollPivot.position.set(W / 2, -0.5, 0);
  rollPivot.scale.setScalar(0.0001);
  lift.add(rollPivot);

  stage.onUpdate((t) => {
    sheet.userData.update(st.roll);
    const L = st.roll * W;
    tops.forEach((h, i) => {
      const drop = clamp01((st.drop - i * 0.06) / 0.4);
      const inside = clamp01((h.userData.s + 0.28 - L) / 0.2);
      const sc = Math.max(0.0001, drop * inside);
      h.scale.setScalar(sc);
      h.position.y = h.userData.y0 + (1 - drop) * 1.6;
    });
    cap.scale.setScalar(Math.max(0.0001, clamp01((st.roll - 0.9) / 0.1)));
    paper.scale.z = Math.max(0.0001, st.paper);
    knifePivot.rotation.z = Math.sin(st.chop * Math.PI * 7) * 0.32;
    knifePivot.position.x = 0.1 + Math.sin(st.chop * Math.PI * 3.5) * 0.25;
    skewers.forEach((s, i) => (s.rotation.x = st.spin * Math.PI * (3 + i * 0.4)));
    rollPivot.scale.setScalar(Math.max(0.0001, st.sheet * (1 + st.upright * 0.25)));
    rollG.scale.setScalar(Math.max(0.0001, 1 - st.swap));
    finalWrap.scale.setScalar(Math.max(0.0001, st.swap));
    rollG.rotation.x = -Math.PI / 2 * st.upright;
    rollPivot.position.x = W / 2 * (1 - st.upright);
    rollPivot.position.y = -0.5 + st.upright * 0.5;
    rollPivot.rotation.z = -0.22 * st.upright;
    rollPivot.rotation.y = st.upright * t * 0.35;
  });

  const tl = storyTl;
  tl.to(st, { chop: 1, duration: 0.95 }, 0)
    .to(prep.position, { x: -5, duration: 0.35, ease: 'power2.in' }, 0.95)
    .to(prep.rotation, { z: 0.4, duration: 0.35, ease: 'power2.in' }, 0.95)
    .set(grill, { visible: true }, 1.0)
    .fromTo(grill.position, { y: -6 }, { y: 0, duration: 0.35, ease: 'power3.out', immediateRender: false }, 1.0)
    .to(st, { spin: 1, duration: 1 }, 1.0)
    .to(grill.position, { y: -6, duration: 0.35, ease: 'power2.in' }, 1.95)
    .set(grill, { visible: false }, 2.31)
    .to(st, { sheet: 1, duration: 0.3, ease: 'back.out(1.4)' }, 2.05)
    .to(st, { drop: 1, duration: 0.6 }, 2.25)
    .to(lift.rotation, { y: -0.3, duration: 1 }, 2.0)
    .to(st, { roll: 1, duration: 0.55, ease: 'power1.inOut' }, 3.0)
    .to(st, { paper: 1, duration: 0.2 }, 3.55)
    .to(st, { upright: 1, duration: 0.35, ease: 'power2.inOut' }, 3.6)
    .to(st, { swap: 1, duration: 0.12, ease: 'power1.inOut' }, 3.82)
    .to(lift.rotation, { y: 0, duration: 0.4 }, 3.55);

  return {
    intro() {
      return introPop(gsap, hero.items, { stagger: 0.05 });
    },
  };
}
