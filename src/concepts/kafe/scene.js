import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as T from '../../three/textures.js';
import * as M from './models.js';
import { createRig, layoutAnchor, pointerTilt, introPop, heroExit, storyEnter, ease, clamp01 } from '../../three/compose.js';

export function build({ stage, gsap, storyTl }) {
  // ======================================================================
  // HERO: ince belli çay, Türk kahvesi, simit ve lokum
  // ======================================================================
  const hero = createRig(stage.root);
  layoutAnchor(stage, hero.anchor, {
    size: [5.2, 4.6],
    landscape: { x: 0.24, y: -0.03, w: 0.5, h: 0.92 },
    portrait: { x: 0, y: -0.29, w: 1, h: 0.4 },
  });
  pointerTilt(stage, hero.tilt, { y: 0.3, x: 0.12 });

  const tea = M.teaSet();
  const teaSteam = K.steam({ count: 22, w: 0.22, h: 1.3, size: 230, opacity: 0.5 });
  teaSteam.position.y = 1.05;
  tea.add(teaSteam);
  const coffee = M.turkishCoffeeSet();
  const coffeeSteam = K.steam({ count: 22, w: 0.25, h: 1.2, size: 230, opacity: 0.5 });
  coffeeSteam.position.y = 0.55;
  coffee.add(coffeeSteam);

  hero.add(tea, { p: [-0.95, -0.8, 0], r: [0.32, 0.4, 0], s: 1.55, float: { amp: 0.06, speed: 0.6, rot: 0.04 } });
  hero.add(coffee, { p: [1.0, -1.15, 0.6], r: [0.38, -0.5, 0], s: 1.6, float: { amp: 0.07, speed: 0.7, phase: 1, rot: 0.04 } });
  hero.add(M.simit(), { p: [-1.75, 1.35, -0.4], r: [1.05, 0.2, 0.35], s: 1.25, float: { amp: 0.12, speed: 0.8, phase: 2 } });
  hero.add(M.lokum({ color: '#f2a7b8' }), { p: [1.9, 0.8, 0.2], r: [0.4, 0.6, 0.2], s: 1.2, float: { amp: 0.12, speed: 1, phase: 3 } });
  hero.add(M.lokum({ color: '#fbf4ea' }), { p: [0.25, 1.7, -0.3], r: [0.2, 0.3, 0.5], s: 1.1, float: { amp: 0.1, speed: 1.1, phase: 4 } });
  hero.add(M.lokum({ color: '#c6d79a' }), { p: [-2.05, -1.55, 0.7], r: [0.5, 0.2, 0.1], s: 1.1, float: { amp: 0.1, speed: 0.9, phase: 5 } });
  [
    [1.35, 1.75, 0.5],
    [-0.65, 1.95, 0.8],
    [2.25, -0.35, -0.5],
    [-2.3, 0.25, 0.3],
    [0.25, -2.05, 1.1],
    [1.95, -1.85, 0.2],
    [-1.15, 0.6, 1.2],
  ].forEach((p, i) => {
    hero.add(M.bean(), { p, r: [i, i * 1.3, i * 0.7], s: 0.22, float: { amp: 0.12, speed: 0.9 + i * 0.1, phase: 6 + i, rot: 0.3 } });
  });

  heroExit(gsap, hero.items);

  // ======================================================================
  // HİKÂYE: çekirdek > kavrum > cezve > sunum
  // ======================================================================
  const story = createRig(stage.root);
  layoutAnchor(stage, story.anchor, {
    size: [3.4, 3.4],
    landscape: { x: 0.21, y: -0.03, w: 0.5, h: 0.84 },
    portrait: { x: 0, y: 0.17, w: 0.95, h: 0.5 },
  });
  pointerTilt(stage, story.tilt, { y: 0.22, x: 0.08, baseX: 0.28 });
  const lift = new THREE.Group();
  story.tilt.add(lift);
  storyEnter(gsap, lift);

  const st = { swirl: 0, roast: 0, gather: 0, cezve: 0, pour: 0, stream: 0, set: 0, center: 0, steam: 0, exit: 0 };

  // Çekirdekler
  const beanGeo = M.bean().geometry;
  const beanMat = K.phys({ color: '#9aa36b', roughness: 0.35, clearcoat: 0.5, emissive: '#ff6a1a', emissiveIntensity: 0 });
  const N = 90;
  const beans = new THREE.InstancedMesh(beanGeo, beanMat, N);
  beans.frustumCulled = false;
  lift.add(beans);
  const R = T.rng(21);
  const bData = Array.from({ length: N }, () => ({
    a: R() * Math.PI * 2,
    rad: 0.7 + R() * 0.95,
    h: -0.9 + R() * 2.0,
    sp: 0.25 + R() * 0.4,
    rot: new THREE.Euler(R() * 6, R() * 6, R() * 6),
    s: 0.13 + R() * 0.05,
    d: R() * 0.4,
  }));
  const cGreen = new THREE.Color('#9aa36b');
  const cBrown = new THREE.Color('#4a2a17');

  // Cezve
  const cz = M.cezve();
  const czHolder = new THREE.Group();
  czHolder.add(cz);
  czHolder.position.set(0, -0.95, 0);
  czHolder.scale.setScalar(0.0001);
  const czSteam = K.steam({ count: 18, w: 0.2, h: 1.1, size: 220, opacity: 0 });
  czSteam.position.y = 0.55;
  cz.add(czSteam);
  lift.add(czHolder);

  // Akış
  const streamMat = K.phys({ color: '#4a2a17', roughness: 0.1, clearcoat: 1 });
  const streamGeo = new THREE.CylinderGeometry(0.03, 0.04, 1, 12);
  streamGeo.translate(0, -0.5, 0);
  const stream = new THREE.Mesh(streamGeo, streamMat);
  stream.scale.set(1, 0.0001, 1);
  lift.add(stream);

  // Sunum seti
  const set = M.turkishCoffeeFull();
  const setSteam = K.steam({ count: 22, w: 0.25, h: 1.2, size: 240, opacity: 0 });
  setSteam.position.set(-0.03, 0.55, 0);
  set.add(setSteam);
  const setHolder = new THREE.Group();
  setHolder.add(set);
  setHolder.position.set(0.75, -1.05, 0.2);
  setHolder.scale.setScalar(0.0001);
  lift.add(setHolder);
  const lokumL = M.lokum({ color: '#c6d79a' });
  lokumL.position.set(0.55, 0.1, 0.45);
  lokumL.scale.setScalar(0.6);
  set.add(lokumL);

  const mtx = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const v = new THREE.Vector3();
  const sv = new THREE.Vector3();
  const mouth = new THREE.Vector3(0, -0.4, 0);

  stage.onUpdate((t) => {
    for (let i = 0; i < N; i++) {
      const d = bData[i];
      const spin = d.a + t * d.sp * (1 + st.roast * 1.6) + st.swirl * 2.2;
      const tighten = 1 - st.roast * 0.35;
      v.set(Math.cos(spin) * d.rad * tighten, d.h * (1 - st.roast * 0.25) + Math.sin(t + d.a) * 0.06, Math.sin(spin) * d.rad * tighten);
      const g = ease.inOut(clamp01((st.gather - d.d) / 0.6));
      v.lerp(mouth, g);
      q.setFromEuler(d.rot);
      const s = Math.max(0.0001, d.s * (1 - g * 0.85));
      sv.set(s, s, s);
      mtx.compose(v, q, sv);
      beans.setMatrixAt(i, mtx);
      d.rot.x += 0.01;
      d.rot.y += 0.013;
    }
    beans.instanceMatrix.needsUpdate = true;
    beans.visible = st.gather < 0.999;
    beanMat.color.copy(cGreen).lerp(cBrown, ease.inOut(st.roast));
    beanMat.emissiveIntensity = Math.sin(Math.PI * st.roast) * 0.35 * (0.8 + 0.2 * Math.sin(t * 8));

    czHolder.scale.setScalar(Math.max(0.0001, ease.out(st.cezve)));
    // dökme konumu: cezvenin ağzı fincanın tam üstüne gelir
    czHolder.position.set(0.045 * st.pour - st.exit * 2.5, -0.95 + 1.03 * st.pour + st.exit * 2.5, 0);
    czHolder.rotation.z = -1.05 * st.pour;
    czSteam.material.uniforms.uOpacity.value = 0.5 * clamp01(st.gather * 1.5) * (1 - st.pour);

    stream.scale.y = Math.max(0.0001, st.stream * 0.5);
    stream.position.set(0.71, 0.165, 0.02);
    stream.visible = st.stream > 0.01 && st.stream < 0.99;

    setHolder.scale.setScalar(Math.max(0.0001, ease.out(st.set) * 1.25));
    setHolder.position.x = 0.75 * (1 - st.center);
    setSteam.material.uniforms.uOpacity.value = 0.5 * st.steam;
  });

  const tl = storyTl;
  tl.to(st, { swirl: 1, duration: 1 }, 0)
    .to(st, { roast: 1, duration: 0.9 }, 1.0)
    .to(st, { cezve: 1, duration: 0.3 }, 2.0)
    .to(st, { gather: 1, duration: 0.65 }, 2.1)
    .to(st, { set: 1, duration: 0.3 }, 3.0)
    .to(st, { pour: 1, duration: 0.3, ease: 'power2.inOut' }, 3.0)
    .to(st, { stream: 1, duration: 0.4 }, 3.22)
    .to(st, { exit: 1, duration: 0.3, ease: 'power2.in' }, 3.62)
    .to(st, { center: 1, duration: 0.3, ease: 'power2.inOut' }, 3.62)
    .to(st, { steam: 1, duration: 0.25 }, 3.6)
    .to(lift.rotation, { y: 0.6, duration: 1 }, 1.0)
    .to(lift.rotation, { y: -0.2, duration: 1.2 }, 2.4);

  return {
    intro() {
      return introPop(gsap, hero.items, { stagger: 0.045 });
    },
  };
}
