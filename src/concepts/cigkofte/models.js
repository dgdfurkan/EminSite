import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as T from '../../three/textures.js';

// Avuçta sıkılmış çiğ köfte: dört parmak izi, hafif konik uçlar, taneli yüzey
export function kofte({ len = 0.5, rad = 0.25, seed = 1 } = {}) {
  const geo = new THREE.CapsuleGeometry(rad, len, 16, 40);
  geo.rotateZ(Math.PI / 2);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const L = len / 2 + rad;
  const grooves = [-0.5, -0.17, 0.17, 0.5].map((c) => c * L);
  const r = T.rng(seed * 13);
  const bend = 0.05 + r() * 0.06;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const t = v.x / L;
    const taper = 1 - 0.12 * t * t;
    let y = v.y * taper * 0.94;
    let z = v.z * taper;
    // parmak izleri: üst-ön yüzde dört oluk
    const ang = Math.atan2(y, z);
    const w = K.smooth(-0.45, 0.9, Math.cos(ang - 0.7));
    let g = 0;
    for (const c of grooves) g += Math.exp(-(((v.x - c) / (L * 0.085)) ** 2));
    const k = 1 - 0.3 * w * Math.min(1, g);
    y *= k;
    z *= k;
    // avuç tarafı hafif düz
    if (z < 0) z *= 0.82;
    // organik pürüz
    const n = 1 + (K.fbm(v.x * 5 + seed, v.y * 5, v.z * 5) - 0.5) * 0.09;
    y = y * n + bend * (1 - t * t) * rad * 2;
    z *= n;
    pos.setXYZ(i, v.x, y, z);
  }
  geo.computeVertexNormals();
  const tex = T.kofteTexture();
  const mat = K.std({ map: tex.map, bumpMap: tex.bump, bumpScale: 2.5, roughness: 0.78, metalness: 0 });
  return new THREE.Mesh(geo, mat);
}

export function wheatEar({ len = 1.7, seed = 1 } = {}) {
  const g = new THREE.Group();
  const gold = K.std({ color: '#ddb35a', roughness: 0.5 });
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.02, len * 0.35, 0),
    new THREE.Vector3(0.06, len * 0.6, 0),
    new THREE.Vector3(0.12, len, 0),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.014, 6), gold));
  const grainGeo = new THREE.SphereGeometry(1, 12, 8);
  const n = 13;
  const grains = new THREE.InstancedMesh(grainGeo, K.std({ color: '#e6bd62', roughness: 0.45 }), n * 2);
  const awnGeo = new THREE.CylinderGeometry(0.0025, 0.004, 0.32, 4);
  awnGeo.translate(0, 0.16, 0);
  const awns = new THREE.InstancedMesh(awnGeo, K.std({ color: '#d9ad55', roughness: 0.6 }), n * 2);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  let k = 0;
  for (let i = 0; i < n; i++) {
    const t = 0.55 + (i / n) * 0.42;
    const base = curve.getPoint(t);
    for (const side of [-1, 1]) {
      const size = 1 - (i / n) * 0.35;
      p.set(base.x + side * 0.036 * size, base.y + (side > 0 ? 0.02 : 0), base.z + (i % 2 ? 0.012 : -0.012));
      e.set(0, 0, -side * 0.42);
      q.setFromEuler(e);
      m.compose(p, q, new THREE.Vector3(0.042 * size, 0.08 * size, 0.036 * size));
      grains.setMatrixAt(k, m);
      e.set(0, 0, -side * 0.25);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(p.x, p.y + 0.05, p.z), q, new THREE.Vector3(1, 1 + (i / n) * 0.4, 1));
      awns.setMatrixAt(k, m);
      k++;
    }
  }
  g.add(grains, awns);
  g.rotation.z = (T.rng(seed)() - 0.5) * 0.2;
  return g;
}

// Bulgur / isot taneleri: tek malzeme, rengi kaydırmayla değişir
export function grainCloud({ count = 240, size = 0.035, color = '#d9b77a' } = {}) {
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const mat = K.std({ color, roughness: 0.6 });
  const im = new THREE.InstancedMesh(geo, mat, count);
  im.userData.size = size;
  im.frustumCulled = false;
  return im;
}

export function flakes({ count = 110 } = {}) {
  const geo = new THREE.TetrahedronGeometry(1, 0);
  const mat = K.std({ color: '#8e1a0c', roughness: 0.5 });
  const im = new THREE.InstancedMesh(geo, mat, count);
  im.frustumCulled = false;
  return im;
}

export function dough({ r = 0.75 } = {}) {
  const geo = new THREE.SphereGeometry(r, 64, 44);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = 1 + (K.fbm(v.x * 2.2, v.y * 2.2, v.z * 2.2) - 0.5) * 0.22;
    v.multiplyScalar(n);
    if (v.y < 0) v.y *= 0.4;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const tex = T.kofteTexture();
  return new THREE.Mesh(geo, K.std({ map: tex.map, bumpMap: tex.bump, bumpScale: 2.2, roughness: 0.8 }));
}

export function kneadBowl() {
  return K.bowl({
    r: 1.25,
    h: 0.42,
    material: K.copper(),
    inner: K.std({ color: '#b8653a', metalness: 1, roughness: 0.38 }),
  });
}

// Marul yatağında çiğ köfteler, limon ve nar taneleri
export function servingPlate({ pieces = 5, plateR = 1.3, withPlate = true, seed = 3 } = {}) {
  const g = new THREE.Group();
  const r = T.rng(seed);
  let y = 0;
  if (withPlate) {
    const p = K.plate({ r: plateR, color: '#fffaf2', rimColor: '#d7262f' });
    g.add(p);
    y = p.userData.top;
  }
  for (let i = 0; i < 3; i++) {
    const l = K.leaf({ w: 1.05, h: 1.55, cup: 0.2, ruffle: 0.08, curl: 0.12, seed: i * 5 });
    l.rotation.set(-Math.PI / 2 + 0.12, 0, (i - 1) * 0.95 + Math.PI);
    l.position.set(Math.sin((i - 1) * 0.95) * 0.32, y + 0.04 + i * 0.012, Math.cos((i - 1) * 0.95) * 0.32);
    g.add(l);
  }
  const slots = [
    [-0.42, 0.06, -0.08, 0.25],
    [0.0, 0.08, -0.22, -0.15],
    [0.42, 0.06, -0.05, -0.4],
    [-0.2, 0.06, 0.32, 0.5],
    [0.25, 0.06, 0.3, -0.2],
    [0.0, 0.22, 0.05, 0.1],
  ];
  for (let i = 0; i < Math.min(pieces, slots.length); i++) {
    const [x, yy, z, ry] = slots[i];
    const k = kofte({ len: 0.36, rad: 0.175, seed: i + seed });
    k.position.set(x, y + 0.15 + yy, z);
    k.rotation.set(0, ry + (r() - 0.5) * 0.3, (r() - 0.5) * 0.1);
    g.add(k);
  }
  const lemon = K.citrusSlice({ r: 0.24, t: 0.05 });
  lemon.position.set(0.78, y + 0.12, 0.42);
  lemon.rotation.set(0.5, 0, 0.4);
  g.add(lemon);
  const seedsM = K.seeds({ count: 14, radius: 0.2, size: 0.045, flat: true, seed });
  seedsM.position.set(-0.7, y + 0.12, 0.45);
  g.add(seedsM);
  const mint = K.sprig({ tone: 'mint', leaves: 4, size: 0.2, seed });
  mint.position.set(0.15, y + 0.2, 0.62);
  mint.rotation.set(1.2, 0, 0.3);
  g.add(mint);
  return g;
}

// Paket servis kabı (300 g / 500 g / 1 kg)
export function tub({ scale = 1 } = {}) {
  const g = new THREE.Group();
  const w = 1.5 * scale;
  const d = 1.05 * scale;
  const h = 0.5 * scale;
  const shell = new THREE.Mesh(
    K.roundedBox(w, h, d, 0.12 * scale, 5),
    K.phys({ color: '#ffffff', roughness: 0.25, clearcoat: 0.6 })
  );
  shell.position.y = h / 2;
  const band = new THREE.Mesh(
    K.roundedBox(w + 0.01, h * 0.34, d + 0.01, 0.06 * scale, 4),
    K.std({ map: T.labelTexture({ bg: '#d7262f', ink: '#fff4e8', title: 'yoğrum', sub: 'ÇİĞ KÖFTE', w: 1024, h: 256 }), roughness: 0.45 })
  );
  band.position.y = h * 0.45;
  const tex = T.kofteTexture();
  const mass = new THREE.Mesh(
    K.roundedBox(w * 0.9, 0.12, d * 0.88, 0.05, 4),
    K.std({ map: tex.map, bumpMap: tex.bump, bumpScale: 2, roughness: 0.82 })
  );
  mass.position.y = h - 0.03;
  g.add(shell, band, mass);
  const leafM = K.leaf({ w: 0.7 * scale, h: 1.0 * scale, cup: 0.3, seed: 4 });
  leafM.rotation.set(-1.2, 0, 0.7);
  leafM.position.set(-w * 0.25, h + 0.08, -d * 0.1);
  g.add(leafM);
  const lemon = K.citrusSlice({ r: 0.18 * scale, t: 0.045 });
  lemon.position.set(w * 0.28, h + 0.06, d * 0.15);
  lemon.rotation.set(0.25, 0, 0.12);
  g.add(lemon);
  return g;
}

export function pickleBowl() {
  const g = new THREE.Group();
  const b = K.bowl({ r: 0.55, h: 0.36, material: K.ceramic('#fffaf2'), inner: K.ceramic('#f6efe4') });
  g.add(b);
  const r = T.rng(8);
  const greenMat = K.phys({ color: '#7f9a2c', roughness: 0.3, clearcoat: 0.8 });
  const redMat = K.phys({ color: '#c0281c', roughness: 0.3, clearcoat: 0.8 });
  for (let i = 0; i < 9; i++) {
    const isRed = i % 3 === 0;
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(isRed ? 0.06 : 0.075, isRed ? 0.34 : 0.26, 6, 12), isRed ? redMat : greenMat);
    const a = r() * Math.PI * 2;
    const dd = Math.sqrt(r()) * 0.28;
    m.position.set(Math.cos(a) * dd, 0.34 + r() * 0.1, Math.sin(a) * dd);
    m.rotation.set(r() * 3, r() * 3, Math.PI / 2 + (r() - 0.5));
    g.add(m);
  }
  for (let i = 0; i < 3; i++) {
    const c = K.citrusSlice({ r: 0.1, t: 0.035, kind: 'cucumber' });
    c.position.set((r() - 0.5) * 0.4, 0.44, (r() - 0.5) * 0.4);
    c.rotation.set(r() * 2, 0, r() * 2);
    g.add(c);
  }
  return g;
}

export function garnishSet() {
  const g = new THREE.Group();
  const p = K.plate({ r: 0.95, color: '#fffaf2' });
  g.add(p);
  for (let i = 0; i < 2; i++) {
    const l = K.leaf({ w: 0.8, h: 1.2, cup: 0.25, seed: i * 7 });
    l.rotation.set(-Math.PI / 2 + 0.15, 0, i ? 0.6 : -0.5);
    l.position.set(i ? 0.25 : -0.25, 0.08 + i * 0.02, -0.15);
    g.add(l);
  }
  const lemon = K.citrusSlice({ r: 0.2, t: 0.05 });
  lemon.position.set(0.42, 0.1, 0.3);
  lemon.rotation.x = 0.15;
  g.add(lemon);
  const sauce = K.bowl({ r: 0.22, h: 0.16, material: K.ceramic('#d7262f'), inner: K.ceramic('#fffaf2') });
  sauce.position.set(-0.38, 0.05, 0.32);
  const syrup = new THREE.Mesh(
    new THREE.CircleGeometry(0.19, 32),
    K.phys({ color: '#4a0a12', roughness: 0.05, clearcoat: 1 })
  );
  syrup.rotation.x = -Math.PI / 2;
  syrup.position.set(-0.38, 0.18, 0.32);
  g.add(sauce, syrup);
  return g;
}

export function lavasStack() {
  const g = new THREE.Group();
  const mat = K.std({ map: T.lavasTexture(1), roughness: 0.8, side: THREE.DoubleSide });
  for (let i = 0; i < 3; i++) {
    const geo = new THREE.CircleGeometry(0.8, 48);
    const pos = geo.attributes.position;
    for (let k = 0; k < pos.count; k++) {
      const x = pos.getX(k);
      const y = pos.getY(k);
      pos.setZ(k, Math.sin(x * 3 + i) * 0.03 + Math.cos(y * 4) * 0.02 + (x * x) * 0.12);
    }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat);
    m.rotation.set(-Math.PI / 2, 0, i * 0.7);
    m.position.y = i * 0.035;
    g.add(m);
  }
  return g;
}

export function chips(count = 7, seed = 2) {
  const g = new THREE.Group();
  const r = T.rng(seed);
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.14);
  shape.lineTo(-0.11, -0.08);
  shape.lineTo(0.11, -0.08);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.01, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.006, bevelSegments: 2 });
  const mat = K.std({ color: '#f2a12e', roughness: 0.55 });
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set((r() - 0.5) * 0.4, r() * 0.12, (r() - 0.5) * 0.4);
    m.rotation.set(r() * 1.2 - 0.6, r() * 3, r() * 1.2 - 0.6);
    g.add(m);
  }
  return g;
}

export function yogrumWrap(opts = {}) {
  return K.wrap({ paper: 'yogrum', filling: 'cigkofte', ...opts });
}

export function yogrumAyran(big = false) {
  const c = K.ayranCup({ bg: '#ffffff', ink: '#d7262f', title: 'AYRAN', sub: 'yoğrum' });
  if (big) c.scale.set(1.25, 1.5, 1.25);
  return c;
}
