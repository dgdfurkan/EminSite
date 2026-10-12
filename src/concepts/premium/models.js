import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as T from '../../three/textures.js';
import { kofte } from '../cigkofte/models.js';
import * as KM from '../kafe/models.js';
import * as DM from '../durum/models.js';

export { kofte };

// --- Zeminler ve kaplar -----------------------------------------------------------
export function slatePlate({ r = 1.4 } = {}) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r * 1.015, 0.07, 80),
    K.std({ map: T.bakedTexture('slate'), roughness: 0.82, metalness: 0.05 })
  );
  m.position.y = 0.035;
  m.receiveShadow = true;
  g.add(m);
  g.userData.top = 0.07;
  return g;
}

export function slateBoard({ w = 3, d = 1.5 } = {}) {
  const m = new THREE.Mesh(K.roundedBox(w, 0.08, d, 0.03, 3), K.std({ map: T.bakedTexture('slate'), roughness: 0.82 }));
  m.position.y = 0.04;
  m.receiveShadow = true;
  const g = new THREE.Group();
  g.add(m);
  g.userData.top = 0.08;
  return g;
}

export function stoneBowl({ r = 0.55, h = 0.3, dark = false } = {}) {
  const mat = dark
    ? K.std({ color: '#2b2726', roughness: 0.7 })
    : K.std({ map: T.bakedTexture('stone'), roughness: 0.85 });
  return K.bowl({ r, h, material: mat });
}

export function lemonWedge({ r = 0.26, t = 0.11 } = {}) {
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(r, r, t, 40, 1, false, 0, Math.PI);
  const cap = K.phys({ map: T.sliceTexture('lemon'), roughness: 0.3, clearcoat: 0.7 });
  const side = K.phys({ color: '#efc11e', roughness: 0.45, clearcoat: 0.4 });
  g.add(new THREE.Mesh(geo, [side, cap, cap]));
  const cut = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, t), K.std({ color: '#f8e7a0', roughness: 0.6, side: THREE.DoubleSide }));
  cut.rotation.y = Math.PI / 2;
  g.add(cut);
  return g;
}

export function sauceBowl({ color = '#3b0a10', r = 0.2 } = {}) {
  const g = new THREE.Group();
  g.add(K.bowl({ r, h: r * 0.7, material: K.copper() }));
  const liq = new THREE.Mesh(new THREE.CircleGeometry(r * 0.88, 32), K.phys({ color, roughness: 0.04, clearcoat: 1 }));
  liq.rotation.x = -Math.PI / 2;
  liq.position.y = r * 0.55;
  g.add(liq);
  return g;
}

// --- Avuç -----------------------------------------------------------------------
export function avucPlate({ pieces = 3, seed = 2 } = {}) {
  const g = new THREE.Group();
  const plate = slatePlate({ r: 1.45 });
  g.add(plate);
  const y = plate.userData.top;
  [
    [-0.15, -0.1, 0.6],
    [0.25, 0.15, -0.5],
  ].forEach(([x, z, rz], i) => {
    const l = K.leaf({ w: 1.1, h: 1.6, tone: 'gobek', cup: 0.25, ruffle: 0.05, curl: 0.1, seed: i * 4 + 1 });
    l.rotation.set(-Math.PI / 2 + 0.08, 0, rz);
    l.position.set(x, y + 0.04 + i * 0.015, z);
    g.add(l);
  });
  const slots = [
    [-0.42, 0.05, -0.1, 0.55],
    [0.02, 0.1, 0.12, 0.5],
    [0.46, 0.05, 0.3, 0.45],
    [-0.1, 0.12, -0.55, 0.5],
    [0.5, 0.06, -0.35, 0.52],
  ];
  for (let i = 0; i < pieces; i++) {
    const [x, yy, z, ry] = slots[i];
    const k = kofte({ len: 0.86, rad: 0.21, seed: i + seed });
    k.position.set(x, y + 0.17 + yy, z);
    k.rotation.set(0, ry, 0.04);
    g.add(k);
  }
  const lw = lemonWedge({ r: 0.26, t: 0.055 });
  lw.position.set(0.88, y + 0.03, 0.5);
  lw.rotation.set(0, -0.9, 0);
  g.add(lw);
  const sb = sauceBowl();
  sb.position.set(-0.95, y, 0.55);
  g.add(sb);
  const sd = K.seeds({ count: 11, radius: 0.16, size: 0.045, flat: true, seed: 5 });
  sd.position.set(0.85, y + 0.06, -0.55);
  g.add(sd);
  const mint = K.sprig({ tone: 'mint', leaves: 5, size: 0.2, seed: 4 });
  mint.position.set(-0.75, y + 0.08, -0.6);
  mint.rotation.set(1.3, 0.4, 0.2);
  g.add(mint);
  return g;
}

export function walnutBowl() {
  const g = new THREE.Group();
  g.add(stoneBowl({ r: 0.32, h: 0.18 }));
  const mat = K.std({ color: '#a8743f', roughness: 0.7 });
  const geo = K.displace(new THREE.IcosahedronGeometry(0.06, 1), 0.02, 14, 3);
  const r = T.rng(13);
  for (let i = 0; i < 16; i++) {
    const m = new THREE.Mesh(geo, mat);
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.22;
    m.position.set(Math.cos(a) * d, 0.16 + r() * 0.05, Math.sin(a) * d);
    m.rotation.set(r() * 3, r() * 3, r() * 3);
    m.scale.set(1, 0.7, 1.2);
    g.add(m);
  }
  return g;
}

export function bulgurBowl() {
  const g = new THREE.Group();
  g.add(stoneBowl({ r: 0.62, h: 0.32 }));
  const n = 520;
  const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), K.std({ color: '#d6b679', roughness: 0.6 }), n);
  const r = T.rng(6);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.54;
    const h = 0.24 + (1 - (d / 0.54) ** 2) * 0.14 + r() * 0.02;
    e.set(r() * 3, r() * 3, r() * 3);
    q.setFromEuler(e);
    const s = 0.016 + r() * 0.01;
    m.compose(new THREE.Vector3(Math.cos(a) * d, h, Math.sin(a) * d), q, new THREE.Vector3(s, s * 0.7, s * 0.8));
    im.setMatrixAt(i, m);
  }
  im.castShadow = true;
  g.add(im);
  return g;
}

export function isotBowl() {
  const g = new THREE.Group();
  g.add(stoneBowl({ r: 0.58, h: 0.3, dark: true }));
  const n = 340;
  const im = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(1, 0), K.std({ color: '#6a140a', roughness: 0.55 }), n);
  const r = T.rng(9);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const col = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.5;
    const h = 0.22 + (1 - (d / 0.5) ** 2) * 0.13;
    e.set(r() * 3, r() * 3, r() * 3);
    q.setFromEuler(e);
    const s = 0.022 + r() * 0.02;
    m.compose(new THREE.Vector3(Math.cos(a) * d, h, Math.sin(a) * d), q, new THREE.Vector3(s, s * 0.3, s));
    im.setMatrixAt(i, m);
    im.setColorAt(i, col.set(r() > 0.5 ? '#5a0f08' : '#8a2410'));
  }
  im.castShadow = true;
  g.add(im);
  [
    [0.8, 0.1, 0.25, 0.4],
    [0.65, 0.08, -0.45, -0.7],
  ].forEach(([x, y, z, ry]) => {
    const p = K.pepper({ len: 0.9, r: 0.07, color: '#7d140c', curve: 0.3 });
    p.rotation.set(0, ry, -Math.PI / 2 + 0.05);
    p.position.set(x, y, z);
    g.add(p);
  });
  return g;
}

export function avucWrap(opts = {}) {
  return K.wrap({ paper: 'avuc', filling: 'cigkofte', ...opts });
}

export function avucBox({ big = false } = {}) {
  const g = new THREE.Group();
  const w = big ? 1.6 : 1.3;
  const d = big ? 1.1 : 0.95;
  const box = new THREE.Mesh(
    K.roundedBox(w, 0.42, d, 0.03, 3),
    K.std({ map: T.labelTexture({ bg: '#efe7da', ink: '#7a1f1f', title: 'Avuç', sub: 'ÇİĞ KÖFTE ATÖLYESİ', font: 'Instrument Serif', weight: 400, w: 1024, h: 512 }), roughness: 0.8 })
  );
  box.position.y = 0.21;
  g.add(box);
  const band = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.43, d + 0.012), K.std({ color: '#7a1f1f', roughness: 0.6 }));
  band.position.set(w * 0.28, 0.21, 0);
  g.add(band);
  const lw = lemonWedge({ r: 0.2, t: 0.05 });
  lw.position.set(w * 0.42, 0.025, d * 0.62);
  lw.rotation.set(0, -0.4, 0);
  g.add(lw);
  const k = kofte({ len: 0.7, rad: 0.17, seed: 3 });
  k.position.set(-w * 0.3, 0.12, d * 0.75);
  k.rotation.y = 0.3;
  g.add(k);
  return g;
}

// --- Zırh ----------------------------------------------------------------------
export function zirhWrap(opts = {}) {
  return K.wrap({ paper: 'zirh', filling: 'adana', ...opts });
}

export function zirhBoard() {
  const g = new THREE.Group();
  const b = slateBoard({ w: 3.1, d: 1.55 });
  g.add(b);
  const y = b.userData.top;
  const w = zirhWrap({ seed: 1, radius: 0.4 });
  w.rotation.order = 'YXZ';
  w.rotation.set(0, 0.45, Math.PI / 2);
  w.position.set(-0.35, y + 0.42, 0.1);
  g.add(w);
  const sk = DM.skewer({ len: 1.9, seed: 3 });
  sk.position.set(0.25, y + 0.13, -0.5);
  sk.rotation.y = 0.12;
  g.add(sk);
  [
    [0.85, 0.42, -0.3],
    [1.05, 0.25, 0.1],
  ].forEach(([x, z, ry], i) => {
    const p = K.pepper({ len: 0.95, r: 0.065, charred: true, curve: 0.2 });
    p.rotation.set(0, ry, -Math.PI / 2);
    p.position.set(x, y + 0.07 + i * 0.03, z);
    g.add(p);
  });
  const t = K.tomato({ r: 0.2, charred: true });
  t.position.set(1.15, y + 0.17, -0.35);
  g.add(t);
  return g;
}

export function minceBoard() {
  const g = new THREE.Group();
  const b = slateBoard({ w: 2.4, d: 1.5 });
  g.add(b);
  const pile = DM.mincePile();
  pile.position.set(0, b.userData.top + 0.05, 0);
  g.add(pile);
  const knife = DM.zirh();
  knife.position.set(0.05, b.userData.top + 0.75, 0.05);
  knife.rotation.z = 0.12;
  g.add(knife);
  const fl = K.seeds({ count: 26, radius: 0.4, size: 0.022, color: '#a3241a', flat: true, seed: 11 });
  fl.position.set(-0.75, b.userData.top + 0.01, 0.4);
  g.add(fl);
  return g;
}

export function grillScene() {
  const g = new THREE.Group();
  const mg = DM.mangal({ w: 2.6, d: 1.15, count: 34, seed: 5 });
  g.add(mg);
  [-0.25, 0.25].forEach((z, i) => {
    const sk = DM.skewer({ len: 1.8, seed: i + 6 });
    sk.position.set(-0.05, 0.48, z);
    g.add(sk);
  });
  return g;
}

export function katmer() {
  const g = new THREE.Group();
  g.add(K.plate({ r: 0.85, color: '#f1ece4' }));
  const top = K.std({ map: T.bakedTexture('katmer'), roughness: 0.55 });
  const side = K.std({ color: '#d7ac63', roughness: 0.6 });
  const m = new THREE.Mesh(K.roundedBox(0.95, 0.08, 0.95, 0.03, 3), [side, side, top, side, side, side]);
  m.position.y = 0.09;
  m.rotation.y = 0.5;
  g.add(m);
  const cream = new THREE.Mesh(K.displace(new THREE.SphereGeometry(0.16, 28, 16), 0.02, 6, 2), K.std({ color: '#fbf6ea', roughness: 0.7 }));
  cream.scale.y = 0.6;
  cream.position.set(0.12, 0.2, 0.1);
  g.add(cream);
  return g;
}

export function baklava() {
  const g = new THREE.Group();
  g.add(K.plate({ r: 0.8, color: '#f4f0e9', rimColor: '#c9a96a' }));
  const s = new THREE.Shape();
  s.moveTo(0, 0.24);
  s.lineTo(0.18, 0);
  s.lineTo(0, -0.24);
  s.lineTo(-0.18, 0);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 });
  geo.rotateX(-Math.PI / 2);
  const top = K.phys({ map: T.bakedTexture('baklava'), roughness: 0.35, clearcoat: 0.8 });
  const side = K.std({ color: '#e2b665', roughness: 0.5 });
  const pist = K.std({ color: '#7fa13a', roughness: 0.6 });
  [
    [-0.28, 0.05, 0.1],
    [0.05, -0.12, -0.2],
    [0.32, 0.08, 0.25],
  ].forEach(([x, z, ry], i) => {
    const m = new THREE.Mesh(geo, [top, side]);
    m.position.set(x, 0.07, z);
    m.rotation.y = ry + 0.6;
    g.add(m);
    const crumbs = K.seeds({ count: 14, radius: 0.07, size: 0.018, color: '#7fa13a', flat: true, seed: i + 2 });
    crumbs.material = pist;
    crumbs.position.set(x, 0.27, z);
    g.add(crumbs);
  });
  return g;
}

// --- Sükûn -----------------------------------------------------------------------
export function brassTray({ r = 1.25 } = {}) {
  const geo = K.lathe(
    [
      [0, 0],
      [r * 0.96, 0],
      [r, 0.04],
      [r * 1.02, 0.11],
      [r * 0.995, 0.12],
      [r * 0.965, 0.045],
      [0, 0.04],
    ],
    96
  );
  const m = new THREE.Mesh(geo, K.std({ color: '#c6a15e', metalness: 1, roughness: 0.32 }));
  m.receiveShadow = true;
  const g = new THREE.Group();
  g.add(m);
  g.userData.top = 0.04;
  return g;
}

export function porcelainSet({ withWater = true, withLokum = true } = {}) {
  const g = new THREE.Group();
  const s = KM.saucer({ r: 0.46, rim: '#c9a96a' });
  g.add(s);
  const f = KM.fincan({ pattern: 'porcelain', handleColor: '#f6f3ee' });
  f.position.y = 0.045;
  f.rotation.y = -0.7;
  g.add(f);
  if (withLokum) {
    const l = KM.lokum({ color: '#f4efe6' });
    l.scale.setScalar(0.62);
    l.position.set(0.3, 0.14, 0.24);
    l.rotation.y = 0.5;
    g.add(l);
  }
  if (withWater) {
    const w = KM.waterGlass();
    w.position.set(-0.62, 0, -0.18);
    g.add(w);
  }
  return g;
}

export function sukunTray() {
  const g = new THREE.Group();
  const tray = brassTray({ r: 1.3 });
  g.add(tray);
  const set = porcelainSet();
  set.position.set(0.15, tray.userData.top, 0.05);
  g.add(set);
  const lp = new THREE.Group();
  lp.add(K.plate({ r: 0.32, color: '#f4f0e9', rimColor: '#c9a96a' }));
  ['#f2a7b8', '#f4efe6', '#c6d79a'].forEach((c, i) => {
    const l = KM.lokum({ color: c });
    l.scale.setScalar(0.55);
    l.position.set(-0.1 + i * 0.12, 0.1, (i % 2) * 0.08 - 0.04);
    l.rotation.y = i * 0.5;
    lp.add(l);
  });
  lp.position.set(0.75, tray.userData.top, -0.6);
  g.add(lp);
  return g;
}

export function beanDish() {
  const g = new THREE.Group();
  g.add(K.bowl({ r: 0.62, h: 0.18, material: K.ceramic('#efebe4'), inner: K.ceramic('#f6f3ee') }));
  const bean = KM.bean();
  const n = 110;
  const im = new THREE.InstancedMesh(bean.geometry, bean.material, n);
  const r = T.rng(4);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.52;
    const h = 0.1 + (1 - (d / 0.52) ** 2) * 0.16 + r() * 0.03;
    e.set(r() * 3, r() * 3, r() * 3);
    q.setFromEuler(e);
    const s = 0.1 + r() * 0.02;
    m.compose(new THREE.Vector3(Math.cos(a) * d, h, Math.sin(a) * d), q, new THREE.Vector3(s, s, s));
    im.setMatrixAt(i, m);
  }
  im.castShadow = true;
  g.add(im);
  return g;
}

export function cezveOnTray() {
  const g = new THREE.Group();
  const tray = brassTray({ r: 0.9 });
  g.add(tray);
  const c = KM.cezve();
  c.position.y = tray.userData.top;
  c.rotation.y = 0.5;
  g.add(c);
  return g;
}
