import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as T from '../../three/textures.js';

const cream = () => K.ceramic('#f6efe4');
const terracotta = () => K.ceramic('#b95d3b');

// Lathe profilinden iç yüzeyi içe bakan kap üretir (dış ve iç ayrı malzeme)
function vessel(outer, inner, outerMat, innerMat, segs = 64) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(K.lathe(outer, segs), outerMat));
  g.add(new THREE.Mesh(K.lathe(inner, segs), innerMat));
  const top = outer[outer.length - 1];
  const rimR = (top[0] + inner[0][0]) / 2;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(rimR, Math.abs(top[0] - inner[0][0]) / 2 + 0.002, 8, segs), outerMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = top[1];
  g.add(rim);
  return g;
}

function handle({ r = 0.1, tube = 0.024, arc = Math.PI * 1.25, mat }) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 10, 28, arc), mat);
  m.rotation.z = -arc / 2;
  return m;
}

export function saucer({ r = 0.42, rim = '#b95d3b' } = {}) {
  return K.plate({ r, color: '#f8f1e6', rimColor: rim });
}

// İnce belli çay bardağı
export function teaGlass({ fill = 0.86, tea = '#7a1d04' } = {}) {
  const g = new THREE.Group();
  const prof = [
    [0, 0],
    [0.2, 0],
    [0.21, 0.02],
    [0.205, 0.08],
    [0.18, 0.2],
    [0.14, 0.36],
    [0.132, 0.45],
    [0.15, 0.56],
    [0.2, 0.72],
    [0.235, 0.88],
    [0.25, 0.98],
    [0.252, 1.0],
    [0.24, 1.0],
    [0.238, 0.98],
    [0.223, 0.88],
    [0.188, 0.72],
    [0.138, 0.56],
    [0.12, 0.45],
    [0.128, 0.36],
    [0.168, 0.2],
    [0.188, 0.1],
    [0, 0.1],
  ];
  const liquid = [
    [0, 0.102],
    [0.184, 0.102],
    [0.164, 0.2],
    [0.124, 0.36],
    [0.116, 0.45],
    [0.134, 0.56],
    [0.184, 0.72],
    [0.214, 0.86],
  ]
    .filter((p) => p[1] <= fill)
    .concat([[0.21 * (fill / 0.86), fill], [0, fill]]);
  g.add(
    new THREE.Mesh(
      K.lathe(liquid, 48),
      K.phys({ color: tea, roughness: 0.04, clearcoat: 1, emissive: '#5a1200', emissiveIntensity: 0.35 })
    )
  );
  g.add(K.glassMesh(K.lathe(prof, 64), { opacity: 0.05, rim: 0.6, env: 1.2 }));
  return g;
}

export function sugarCube() {
  return new THREE.Mesh(K.roundedBox(0.12, 0.12, 0.12, 0.02, 2), K.std({ map: T.bakedTexture('lokum'), roughness: 0.95 }));
}

export function spoon() {
  const g = new THREE.Group();
  const m = K.metal('#d9dce0', 0.2);
  const stick = new THREE.Mesh(K.roundedBox(0.5, 0.012, 0.03, 0.005, 2), m);
  stick.position.x = -0.18;
  const bowlM = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 10), m);
  bowlM.scale.set(1.2, 0.25, 0.8);
  bowlM.position.x = 0.12;
  g.add(stick, bowlM);
  return g;
}

export function teaSet() {
  const g = new THREE.Group();
  const s = saucer({ r: 0.42 });
  g.add(s);
  const glass = teaGlass();
  glass.position.y = 0.045;
  g.add(glass);
  const sp = spoon();
  sp.position.set(0.12, 0.06, 0.3);
  sp.rotation.y = -0.5;
  g.add(sp);
  const c1 = sugarCube();
  c1.position.set(-0.28, 0.11, 0.18);
  c1.rotation.y = 0.4;
  g.add(c1);
  return g;
}

// Türk kahvesi fincanı (desenli) ve köpük
export function fincan({ pattern = 'telve', foam = true, scale = 1, handleColor = null } = {}) {
  const g = new THREE.Group();
  const outer = [
    [0, 0],
    [0.15, 0],
    [0.16, 0.02],
    [0.15, 0.04],
    [0.19, 0.12],
    [0.24, 0.3],
    [0.265, 0.46],
    [0.272, 0.52],
  ];
  const inner = [
    [0.256, 0.52],
    [0.25, 0.46],
    [0.226, 0.3],
    [0.176, 0.12],
    [0.12, 0.07],
    [0, 0.065],
  ];
  const tex = T.cupPatternTexture(pattern);
  const outerMat = K.phys({ map: tex, roughness: 0.2, clearcoat: 0.9, clearcoatRoughness: 0.1 });
  g.add(vessel(outer, inner, outerMat, cream()));
  const hc = handleColor || (pattern === 'sage' ? '#7d8c66' : pattern === 'porcelain' ? '#f6f3ee' : '#b95d3b');
  const h = handle({ r: 0.09, tube: 0.022, mat: K.ceramic(hc) });
  h.position.set(0.27, 0.3, 0);
  g.add(h);
  if (foam) {
    const f = new THREE.Mesh(new THREE.CircleGeometry(0.245, 48), K.std({ map: T.turkishFoamTexture(), roughness: 0.75 }));
    f.rotation.x = -Math.PI / 2;
    f.position.y = 0.455;
    g.add(f);
  }
  g.scale.setScalar(scale);
  return g;
}

export function lokum({ color = '#f2a7b8' } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(K.roundedBox(0.2, 0.2, 0.2, 0.035, 3), K.phys({ color, roughness: 0.5, sheen: 1, sheenColor: '#ffffff', sheenRoughness: 0.8 }));
  const dust = new THREE.Mesh(K.roundedBox(0.205, 0.205, 0.205, 0.036, 3), K.std({ map: T.bakedTexture('lokum'), transparent: true, opacity: 0.55, roughness: 1, depthWrite: false }));
  g.add(body, dust);
  return g;
}

export function waterGlass() {
  const g = new THREE.Group();
  const prof = [
    [0, 0],
    [0.15, 0],
    [0.155, 0.03],
    [0.17, 0.62],
    [0.16, 0.62],
    [0.145, 0.05],
    [0, 0.05],
  ];
  const water = new THREE.Mesh(
    K.lathe([
      [0, 0.052],
      [0.143, 0.052],
      [0.158, 0.48],
      [0, 0.48],
    ]),
    K.phys({ color: '#dceef4', roughness: 0.02, transparent: true, opacity: 0.35, clearcoat: 1, depthWrite: false })
  );
  water.renderOrder = 1;
  g.add(water, K.glassMesh(K.lathe(prof), { opacity: 0.1, rim: 0.65 }));
  return g;
}

export function turkishCoffeeSet() {
  const g = new THREE.Group();
  g.add(saucer({ r: 0.46 }));
  const f = fincan();
  f.position.set(-0.03, 0.045, 0);
  f.rotation.y = -0.6;
  g.add(f);
  const l = lokum({ color: '#f2a7b8' });
  l.position.set(0.3, 0.15, 0.22);
  l.rotation.y = 0.5;
  l.scale.setScalar(0.65);
  g.add(l);
  return g;
}

export function turkishCoffeeFull() {
  const g = turkishCoffeeSet();
  const w = waterGlass();
  w.position.set(-0.62, 0, -0.2);
  g.add(w);
  return g;
}

// Latte/cappuccino fincanı
export function latteCup({ top = 'heart', glaze = '#efe6d8', inner = '#f8f2e8', size = 1, saucerOn = true } = {}) {
  const g = new THREE.Group();
  const outer = [
    [0, 0],
    [0.17, 0],
    [0.18, 0.02],
    [0.17, 0.04],
    [0.24, 0.14],
    [0.32, 0.32],
    [0.355, 0.46],
    [0.36, 0.5],
  ];
  const innerP = [
    [0.342, 0.5],
    [0.337, 0.46],
    [0.302, 0.32],
    [0.222, 0.14],
    [0.13, 0.07],
    [0, 0.065],
  ];
  const cup = vessel(outer, innerP, K.ceramic(glaze), K.ceramic(inner));
  const h = handle({ r: 0.1, tube: 0.026, mat: K.ceramic(glaze) });
  h.position.set(0.355, 0.3, 0);
  cup.add(h);
  const surf = new THREE.Mesh(new THREE.CircleGeometry(0.33, 48), K.std({ map: T.latteTexture(top), roughness: 0.6 }));
  surf.rotation.x = -Math.PI / 2;
  surf.position.y = 0.455;
  cup.add(surf);
  if (top === 'foam' || top === 'cinnamon') {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.33, 40, 10, 0, Math.PI * 2, 0, 0.5), K.std({ map: T.latteTexture(top), roughness: 0.75 }));
    dome.scale.y = 0.35;
    dome.position.y = 0.42;
    cup.add(dome);
  }
  if (saucerOn) {
    g.add(saucer({ r: 0.55, rim: glaze === '#efe6d8' ? '#b95d3b' : '#efe6d8' }));
    cup.position.y = 0.045;
  }
  g.add(cup);
  g.scale.setScalar(size);
  return g;
}

export function mug({ top = 'dark', color = '#7d8c66' } = {}) {
  const g = new THREE.Group();
  const outer = [
    [0, 0],
    [0.24, 0],
    [0.25, 0.02],
    [0.26, 0.6],
    [0.262, 0.64],
  ];
  const inner = [
    [0.24, 0.64],
    [0.236, 0.6],
    [0.228, 0.06],
    [0, 0.055],
  ];
  g.add(vessel(outer, inner, K.ceramic(color), K.ceramic('#f8f2e8')));
  const h = handle({ r: 0.13, tube: 0.035, arc: Math.PI * 1.3, mat: K.ceramic(color) });
  h.position.set(0.26, 0.33, 0);
  g.add(h);
  const surf = new THREE.Mesh(new THREE.CircleGeometry(0.235, 48), K.std({ map: T.latteTexture(top), roughness: 0.55 }));
  surf.rotation.x = -Math.PI / 2;
  surf.position.y = 0.58;
  g.add(surf);
  return g;
}

export function tallGlass({ layers = [{ c: '#6b3d1f', h: 1 }], ice = 4, h = 1.25, r = 0.3, extras } = {}) {
  const g = new THREE.Group();
  const prof = [
    [0, 0],
    [r * 0.82, 0],
    [r * 0.85, 0.04],
    [r, h],
    [r * 0.95, h],
    [r * 0.8, 0.08],
    [0, 0.08],
  ];
  const fillTop = h * 0.82;
  let y0 = 0.085;
  const span = fillTop - y0;
  layers.forEach((L) => {
    const y1 = y0 + span * L.h;
    const ra = r * 0.79 + (r * 0.93 - r * 0.79) * (y0 / h);
    const rb = r * 0.79 + (r * 0.93 - r * 0.79) * (y1 / h);
    g.add(
      new THREE.Mesh(
        K.lathe([
          [0, y0],
          [ra, y0],
          [rb, y1],
          [0, y1],
        ]),
        K.phys({ color: L.c, roughness: 0.08, clearcoat: 1, emissive: L.e || '#000000', emissiveIntensity: 0.25 })
      )
    );
    y0 = y1;
  });
  const rnd = T.rng(3);
  for (let i = 0; i < ice; i++) {
    const c = new THREE.Mesh(
      K.roundedBox(0.17, 0.17, 0.17, 0.03, 2),
      K.phys({ color: '#ffffff', roughness: 0.05, transparent: true, opacity: 0.45, clearcoat: 1, depthWrite: false })
    );
    c.position.set((rnd() - 0.5) * r * 0.8, fillTop - 0.05 - rnd() * 0.12, (rnd() - 0.5) * r * 0.8);
    c.rotation.set(rnd() * 2, rnd() * 2, rnd() * 2);
    c.renderOrder = 1;
    g.add(c);
  }
  g.add(K.glassMesh(K.lathe(prof), { opacity: 0.1, rim: 0.7 }));
  if (extras) extras(g, { h, r, fillTop });
  return g;
}

export function straw(h = 0.9, color = '#b95d3b') {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, h, 12), K.std({ color, roughness: 0.4 }));
  return m;
}

export function whippedCream(r = 0.27) {
  const g = new THREE.Group();
  const mat = K.std({ color: '#fbf6ee', roughness: 0.65 });
  for (let i = 0; i < 4; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(r * (1 - i * 0.24), 0.075 * (1 - i * 0.15), 12, 32), mat);
    t.rotation.x = Math.PI / 2;
    t.position.y = i * 0.075;
    g.add(t);
  }
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.12, 16), mat);
  tip.position.y = 0.32;
  g.add(tip);
  return g;
}

export function bean({ roasted = true } = {}) {
  const geo = new THREE.SphereGeometry(0.5, 24, 16);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    v.x *= 0.72;
    v.z *= 0.55;
    if (v.z > 0) {
      v.z *= 0.55;
      v.z -= 0.09 * Math.exp(-((v.x / 0.07) ** 2)) * (1 - Math.abs(v.y) * 1.2);
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, K.phys({ color: roasted ? '#4a2a17' : '#9aa36b', roughness: 0.35, clearcoat: 0.5 }));
}

export function cezve() {
  const g = new THREE.Group();
  const mat = K.copper();
  const outer = [
    [0, 0],
    [0.24, 0],
    [0.26, 0.04],
    [0.27, 0.2],
    [0.24, 0.42],
    [0.215, 0.5],
    [0.24, 0.58],
    [0.26, 0.62],
  ];
  const inner = [
    [0.245, 0.62],
    [0.225, 0.58],
    [0.2, 0.5],
    [0.225, 0.42],
    [0.25, 0.2],
    [0, 0.05],
  ];
  g.add(vessel(outer, inner, mat, K.std({ color: '#d7a36e', metalness: 1, roughness: 0.3 })));
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.205, 40), K.std({ map: T.turkishFoamTexture(), roughness: 0.7 }));
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.47;
  g.add(coffee);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.9, 12), K.metal('#c9a35a', 0.25));
  arm.rotation.z = Math.PI / 2 - 0.25;
  arm.position.set(-0.68, 0.62, 0);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.4, 16), K.std({ map: T.bakedTexture('wood'), roughness: 0.6 }));
  grip.rotation.z = Math.PI / 2 - 0.25;
  grip.position.set(-1.05, 0.72, 0);
  g.add(arm, grip);
  return g;
}

export function cheesecake() {
  const g = new THREE.Group();
  g.add(K.plate({ r: 0.75, color: '#f8f1e6', rimColor: '#b95d3b' }));
  const R = 0.85;
  const a0 = -0.42;
  const a1 = 0.42;
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(Math.cos(a0) * R, Math.sin(a0) * R);
  s.absarc(0, 0, R, a0, a1, false);
  s.lineTo(0, 0);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 24 });
  geo.rotateX(-Math.PI / 2);
  const sideTex = T.bakedTexture('cheeseSide');
  sideTex.repeat.set(1, 1.8);
  const top = K.std({ map: T.bakedTexture('burnt'), roughness: 0.6 });
  const side = K.std({ map: sideTex, roughness: 0.55 });
  const m = new THREE.Mesh(geo, [top, side]);
  m.position.set(-0.4, 0.08, 0);
  g.add(m);
  return g;
}

export function brownie({ iceCream = true } = {}) {
  const g = new THREE.Group();
  g.add(K.plate({ r: 0.75, color: '#f8f1e6', rimColor: '#7d8c66' }));
  const top = K.std({ map: T.bakedTexture('brownie'), roughness: 0.55 });
  const side = K.std({ color: '#2e170c', roughness: 0.7 });
  const b = new THREE.Mesh(K.roundedBox(0.75, 0.3, 0.6, 0.04, 3), [side, side, top, side, side, side]);
  b.position.set(-0.08, 0.2, 0);
  b.rotation.y = 0.3;
  g.add(b);
  if (iceCream) {
    const sc = new THREE.Mesh(
      K.displace(new THREE.SphereGeometry(0.2, 32, 20), 0.03, 6, 3),
      K.std({ color: '#f6ead2', roughness: 0.7 })
    );
    sc.position.set(-0.05, 0.47, 0.02);
    sc.scale.y = 0.85;
    g.add(sc);
  }
  return g;
}

export function croissant() {
  const g = new THREE.Group();
  const mat = K.phys({ map: T.bakedTexture('croissant'), roughness: 0.45, clearcoat: 0.35 });
  const n = 7;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const a = -1.15 + t * 2.3;
    const s = 0.12 + 0.2 * Math.sin(Math.PI * t);
    const seg = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), mat);
    seg.scale.set(s * 0.9, s * 0.8, s * 1.2);
    seg.position.set(Math.sin(a) * 0.62, s * 0.7, Math.cos(a) * 0.62 - 0.62);
    seg.rotation.y = a + Math.PI / 2;
    seg.rotation.z = (i % 2 ? 1 : -1) * 0.15;
    g.add(seg);
  }
  return g;
}

export function toast({ mixed = false } = {}) {
  const g = new THREE.Group();
  g.add(K.plate({ r: 0.8, color: '#f8f1e6', rimColor: '#b95d3b' }));
  const tri = new THREE.Shape();
  tri.moveTo(-0.45, -0.45);
  tri.lineTo(0.45, -0.45);
  tri.lineTo(-0.45, 0.45);
  tri.closePath();
  const ext = { depth: 0.09, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 };
  const bread = new THREE.ExtrudeGeometry(tri, ext);
  bread.rotateX(-Math.PI / 2);
  const topM = K.std({ map: T.bakedTexture('toast'), roughness: 0.65 });
  const sideM = K.std({ color: '#b97a36', roughness: 0.7 });
  const cheeseM = K.phys({ color: '#f2c84b', roughness: 0.3, clearcoat: 0.4 });
  const make = (x, z, ry) => {
    const half = new THREE.Group();
    const b1 = new THREE.Mesh(bread, [topM, sideM]);
    const ch = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 0.025, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.01 }), cheeseM);
    ch.geometry.rotateX(-Math.PI / 2);
    ch.position.y = 0.13;
    const b2 = new THREE.Mesh(bread, [topM, sideM]);
    b2.position.y = 0.17;
    half.add(b1, ch, b2);
    if (mixed) {
      for (let i = 0; i < 3; i++) {
        const su = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 20), K.std({ color: '#8a2a1a', roughness: 0.5 }));
        su.position.set(-0.2 + i * 0.12, 0.155, 0.15 - i * 0.12);
        half.add(su);
      }
    }
    half.position.set(x, 0.07, z);
    half.rotation.y = ry;
    g.add(half);
  };
  make(-0.08, 0.05, 0.2);
  make(0.18, -0.1, Math.PI + 0.35);
  return g;
}

export function simit({ r = 0.34 } = {}) {
  const geo = new THREE.TorusGeometry(r, r * 0.26, 18, 64);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const a = Math.atan2(v.y, v.x);
    const k = 1 + Math.sin(a * 14) * 0.02;
    pos.setXYZ(i, v.x * k, v.y * k, v.z * (1 + Math.sin(a * 14 + 1) * 0.08));
  }
  geo.computeVertexNormals();
  const tex = T.bakedTexture('simit');
  const m = new THREE.Mesh(geo, K.std({ map: tex, roughness: 0.55 }));
  m.rotation.x = Math.PI / 2;
  return m;
}

export function breakfastPlate() {
  const g = new THREE.Group();
  g.add(K.plate({ r: 1.1, color: '#f8f1e6', rimColor: '#7d8c66' }));
  // sahanda yumurta
  const white = new THREE.Mesh(K.displace(new THREE.SphereGeometry(0.3, 40, 20), 0.04, 4, 2), K.std({ color: '#fbf8f0', roughness: 0.35 }));
  white.scale.set(1, 0.08, 0.85);
  white.position.set(-0.32, 0.06, -0.25);
  const yolk = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), K.phys({ color: '#f4a21a', roughness: 0.15, clearcoat: 1 }));
  yolk.scale.y = 0.65;
  yolk.position.set(-0.3, 0.075, -0.22);
  g.add(white, yolk);
  // beyaz peynir
  const cheese = new THREE.Mesh(K.roundedBox(0.34, 0.12, 0.24, 0.02, 2), K.std({ color: '#fbf9f2', roughness: 0.75 }));
  cheese.position.set(0.32, 0.11, -0.35);
  cheese.rotation.y = 0.4;
  g.add(cheese);
  // zeytinler
  const olive = K.phys({ color: '#1e1a16', roughness: 0.2, clearcoat: 1 });
  for (let i = 0; i < 5; i++) {
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), olive);
    o.scale.set(1, 0.8, 1.3);
    o.position.set(0.48 + (i % 2) * 0.09, 0.08, 0.05 + i * 0.07);
    g.add(o);
  }
  // domates ve salatalık
  for (let i = 0; i < 3; i++) {
    const t = K.citrusSlice({ r: 0.14, t: 0.035, kind: 'tomato' });
    t.position.set(-0.05 + i * 0.13, 0.08 + i * 0.01, 0.38);
    t.rotation.set(0.1, 0, 0.15);
    g.add(t);
    const c = K.citrusSlice({ r: 0.1, t: 0.03, kind: 'cucumber' });
    c.position.set(-0.55 + i * 0.1, 0.07 + i * 0.008, 0.22);
    g.add(c);
  }
  const si = simit({ r: 0.26 });
  si.position.set(0.05, 0.08, -0.05);
  si.rotation.z = 0.15;
  g.add(si);
  // bal kasesi
  const b = K.bowl({ r: 0.15, h: 0.1, material: K.ceramic('#b95d3b'), inner: K.ceramic('#f6efe4') });
  b.position.set(-0.72, 0.04, -0.05);
  const honey = new THREE.Mesh(new THREE.CircleGeometry(0.13, 24), K.phys({ color: '#e69a1c', roughness: 0.05, clearcoat: 1 }));
  honey.rotation.x = -Math.PI / 2;
  honey.position.set(-0.72, 0.13, -0.05);
  g.add(b, honey);
  return g;
}

export function caydanlik() {
  const g = new THREE.Group();
  const steel = K.metal('#d9dde2', 0.18);
  const bottom = K.lathe([
    [0, 0],
    [0.42, 0],
    [0.45, 0.04],
    [0.46, 0.4],
    [0.42, 0.52],
    [0.3, 0.6],
    [0.28, 0.64],
  ]);
  g.add(new THREE.Mesh(bottom, steel));
  const top = K.lathe([
    [0, 0.6],
    [0.26, 0.6],
    [0.3, 0.66],
    [0.32, 0.86],
    [0.26, 0.98],
    [0.12, 1.02],
    [0.1, 1.05],
  ]);
  g.add(new THREE.Mesh(top, K.ceramic('#f6efe4')));
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.322, 0.322, 0.05, 48, 1, true), K.ceramic('#b95d3b'));
  band.position.y = 0.8;
  g.add(band);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), K.ceramic('#b95d3b'));
  knob.position.y = 1.08;
  g.add(knob);
  const spoutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.28, 0.75, 0),
    new THREE.Vector3(0.42, 0.82, 0),
    new THREE.Vector3(0.5, 0.95, 0),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(spoutCurve, 12, 0.035, 10), K.ceramic('#f6efe4')));
  const hCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 0.45, 0),
    new THREE.Vector3(-0.62, 0.55, 0),
    new THREE.Vector3(-0.55, 0.3, 0),
    new THREE.Vector3(-0.43, 0.15, 0),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(hCurve, 20, 0.03, 10), K.std({ color: '#2b1b13', roughness: 0.5 })));
  return g;
}

export function lokumPlate() {
  const g = new THREE.Group();
  g.add(K.plate({ r: 0.7, color: '#f8f1e6', rimColor: '#b95d3b' }));
  const colors = ['#f2a7b8', '#fbf4ea', '#c6d79a', '#f2a7b8', '#fbf4ea', '#f6c27a'];
  colors.forEach((c, i) => {
    const l = lokum({ color: c });
    const a = (i / colors.length) * Math.PI * 2;
    l.position.set(Math.cos(a) * 0.32, 0.15, Math.sin(a) * 0.32);
    l.rotation.y = a;
    g.add(l);
  });
  const mid = lokum({ color: '#c6d79a' });
  mid.position.y = 0.17;
  g.add(mid);
  return g;
}

export function herbalTea() {
  const g = new THREE.Group();
  g.add(saucer({ r: 0.46, rim: '#7d8c66' }));
  const glass = tallGlassCup();
  glass.position.y = 0.045;
  g.add(glass);
  return g;
}

function tallGlassCup() {
  const g = new THREE.Group();
  const prof = [
    [0, 0],
    [0.22, 0],
    [0.23, 0.03],
    [0.26, 0.6],
    [0.25, 0.6],
    [0.215, 0.06],
    [0, 0.06],
  ];
  g.add(
    new THREE.Mesh(
      K.lathe([
        [0, 0.062],
        [0.213, 0.062],
        [0.24, 0.5],
        [0, 0.5],
      ]),
      K.phys({ color: '#c9a032', roughness: 0.05, clearcoat: 1, emissive: '#4a3000', emissiveIntensity: 0.4 })
    )
  );
  g.add(K.glassMesh(K.lathe(prof), { opacity: 0.12 }));
  const h = handle({ r: 0.1, tube: 0.02, mat: K.phys({ color: '#ffffff', transparent: true, opacity: 0.3, roughness: 0.05 }) });
  h.position.set(0.25, 0.32, 0);
  g.add(h);
  const sl = K.citrusSlice({ r: 0.11, t: 0.03 });
  sl.position.set(0.05, 0.51, 0.05);
  sl.rotation.x = 0.1;
  g.add(sl);
  return g;
}
