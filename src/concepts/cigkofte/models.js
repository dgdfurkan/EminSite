import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as T from '../../three/textures.js';

// Avuçta sıkılmış çiğ köfte ("sıkım"):
// - uzunlamasına dört parmak oyuğu ve aralarında belirgin boğumlar
// - avuç tarafı düz, parmak tarafı oyuklu; serçe parmak ucu daha ince
// - hafif kavis, organik pürüz ve parmak izi dokusu (bump)
export function kofte({ len = 1.0, rad = 0.26, seed = 1, fingers = 4 } = {}) {
  const NT = 150;
  const NP = 72;
  const r = T.rng(seed * 13 + 7);
  const half = len / 2;
  const span = 0.62; // oyukların dağıldığı t aralığı
  const centers = Array.from({ length: fingers }, (_, i) => -span + (i * 2 * span) / (fingers - 1));
  const base = (span / (fingers - 1)) * 0.98;
  const widths = centers.map(() => base * (0.88 + r() * 0.24));
  const jitter = centers.map(() => (r() - 0.5) * 0.06);
  const slant = centers.map(() => 0.05 + r() * 0.06);
  const depthJ = centers.map(() => 0.85 + r() * 0.3);
  const phi0 = 1.05; // parmakların bastığı yön (üst-ön)
  const tri = 0.6 + r() * 0.5; // kesitin üçgenimsi yönü
  const bendAmt = 0.1 + r() * 0.06;
  const pos = [];
  const uv = [];
  const col = [];
  for (let i = 0; i <= NT; i++) {
    const t = -1 + (2 * i) / NT;
    // uç profili: serçe parmak ucu (t<0) incelir; başparmak ucu (t>0) kütleşir
    const tip = t < 0 ? 0.62 : 0.28;
    const asym = t < 0 ? 0.86 : 1.0;
    const prof = Math.pow(Math.max(0, 1 - Math.abs(t) ** 2.4), tip) * asym;
    for (let j = 0; j <= NP; j++) {
      const phi = (j / NP) * Math.PI * 2;
      // yumruk içinde sıkılmış kesit: üçgenimsi, avuç tarafı geniş ve yassı
      const triK = 1 + 0.1 * Math.cos(3 * (phi - tri));
      let cy = Math.sin(phi) * 0.84 * triK;
      let cz = Math.cos(phi) * triK;
      const palm = K.smooth(-0.2, 0.9, -Math.sin(phi - 0.35));
      cy *= 1 - 0.32 * palm * (cy < 0 ? 1 : 0.4);
      // parmak oyukları üst-ön yüzde; aralarında belirgin boğumlar
      const facing = Math.cos(phi - phi0);
      const wgt = K.smooth(-0.25, 0.55, facing);
      let g = 0;
      let gi = 0;
      for (let k = 0; k < centers.length; k++) {
        const skew = slant[k] * Math.cos(phi - phi0 - 0.6);
        const u = (t - centers[k] - jitter[k] - skew) / widths[k];
        if (Math.abs(u) < 1) {
          // yumuşak kenarlı oyuk: parmak etinin bıraktığı yuvarlak iz
          const v = Math.pow(1 - u * u, 0.8);
          if (v > g) {
            g = v;
            gi = k;
          }
        }
      }
      const fingerDepth = (0.8 + 0.2 * (gi / Math.max(1, centers.length - 1))) * depthJ[gi];
      let k = 1 - 0.3 * Math.pow(g, 1.3) * wgt * fingerDepth;
      k += 0.04 * (1 - g) * wgt * (Math.abs(t) < span + base ? 1 : 0);
      // başparmak ucunda hafif çukur
      const thumb = K.smooth(0.72, 0.98, t) * K.smooth(-0.2, 0.8, facing);
      k -= 0.12 * thumb;
      // elle yoğrulmuş düzensizlik: büyük ve orta ölçekli pürüz
      const n =
        1 +
        (K.fbm(t * 1.6 + seed, cy * 1.4, cz * 1.4) - 0.5) * 0.2 +
        (K.vnoise(t * 7 + seed, cy * 6, cz * 6) - 0.5) * 0.05;
      const R = rad * prof * k * n;
      const x = t * half * (1 - 0.05 * K.smooth(0.75, 1, t));
      const bend = bendAmt * rad * (t * t - 0.35);
      pos.push(x, cy * R + bend, cz * R);
      uv.push(i / NT, j / NP);
      // oyukların dibi ve avuç tarafı daha koyu (ortam gölgesi), boğum sırtları hafif açık
      const cavity = Math.pow(g, 1.5) * wgt * fingerDepth;
      const shade = Math.min(1.1, 1 - 0.42 * cavity + 0.1 * (1 - g) * wgt - 0.12 * palm * (cy < 0 ? 1 : 0) - 0.18 * thumb);
      const tint = 0.95 + r() * 0.07;
      col.push(shade * tint, shade * tint * 0.97, shade * tint * 0.95);
    }
  }
  const idx = [];
  const row = NP + 1;
  for (let i = 0; i < NT; i++) {
    for (let j = 0; j < NP; j++) {
      const a = i * row + j;
      const b = a + row;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  // dikiş ve uç noktalarında normalleri birleştir (çizgi görünmesin)
  const nor = geo.attributes.normal;
  const tmp = new THREE.Vector3();
  for (let i = 0; i <= NT; i++) {
    const a = i * row;
    const b = a + NP;
    tmp.set(nor.getX(a) + nor.getX(b), nor.getY(a) + nor.getY(b), nor.getZ(a) + nor.getZ(b)).normalize();
    nor.setXYZ(a, tmp.x, tmp.y, tmp.z);
    nor.setXYZ(b, tmp.x, tmp.y, tmp.z);
  }
  for (const i of [0, NT]) {
    for (let j = 0; j <= NP; j++) nor.setXYZ(i * row + j, i === 0 ? -1 : 1, 0, 0);
  }
  nor.needsUpdate = true;
  const tex = T.kofteTexture();
  const mat = K.phys({
    map: tex.map,
    bumpMap: tex.bump,
    bumpScale: 3,
    roughness: 0.72,
    metalness: 0,
    vertexColors: true,
    sheen: 0.45,
    sheenRoughness: 0.55,
    sheenColor: '#b8442c',
    clearcoat: 0.1,
    clearcoatRoughness: 0.55,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
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
    const k = kofte({ len: 0.74, rad: 0.18, seed: i + seed });
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

// Ev turşusu: kornişon, turşu biberi, havuç ve salamura
export function pickleBowl() {
  const g = new THREE.Group();
  const b = K.bowl({ r: 0.55, h: 0.36, material: K.ceramic('#fffaf2'), inner: K.ceramic('#f6efe4') });
  g.add(b);
  const brine = new THREE.Mesh(
    new THREE.CircleGeometry(0.47, 40),
    K.phys({ color: '#b39a4e', roughness: 0.02, clearcoat: 1, transparent: true, opacity: 0.32, depthWrite: false, envMapIntensity: 1.6 })
  );
  brine.rotation.x = -Math.PI / 2;
  brine.position.y = 0.24;
  g.add(brine);
  const r = T.rng(8);
  const gherkinMat = K.phys({ color: '#5a6a22', roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.25 });
  for (let i = 0; i < 6; i++) {
    const geo = K.displace(new THREE.CapsuleGeometry(0.06 + r() * 0.015, 0.22 + r() * 0.08, 10, 18), 0.012, 18, i + 2);
    const m = new THREE.Mesh(geo, gherkinMat);
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 0.28;
    m.position.set(Math.cos(a) * d, 0.3 + r() * 0.08, Math.sin(a) * d);
    m.rotation.set(Math.PI / 2 + (r() - 0.5) * 0.6, r() * 3, (r() - 0.5) * 0.5);
    g.add(m);
  }
  for (let i = 0; i < 2; i++) {
    const p = K.pepper({ len: 0.55, r: 0.05, color: '#9ea43c', curve: 0.25 });
    p.rotation.set(0, i * 2.2 + 0.4, -Math.PI / 2 + 0.25);
    p.position.set(-0.15 + i * 0.25, 0.35, (i - 0.5) * 0.25);
    g.add(p);
  }
  const carrot = K.phys({ color: '#e07b28', roughness: 0.35, clearcoat: 0.6 });
  for (let i = 0; i < 5; i++) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.025, 20), carrot);
    c.position.set((r() - 0.5) * 0.45, 0.36 + r() * 0.06, (r() - 0.5) * 0.45);
    c.rotation.set(r() * 1.5, r() * 3, r() * 1.5);
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
