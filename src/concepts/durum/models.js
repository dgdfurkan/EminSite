import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as T from '../../three/textures.js';

export function korWrap(opts = {}) {
  return K.wrap({ paper: 'kor', filling: 'adana', ...opts });
}

// Parmak izli Adana kebabı (şişsiz)
export function kebabMeat({ len = 2.0, seed = 1, tint = '#ffffff', r = 0.115 } = {}) {
  const geo = new THREE.CapsuleGeometry(r, len, 10, 28);
  geo.rotateZ(Math.PI / 2);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ridge = Math.pow(Math.abs(Math.cos(((v.x + len) / 0.2) * Math.PI)), 6);
    const k = 1 - 0.13 * ridge;
    const n = 1 + (K.fbm(v.x * 6 + seed, v.y * 6, v.z * 6) - 0.5) * 0.1;
    pos.setXYZ(i, v.x, v.y * k * n * 0.92, v.z * k * n);
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, K.std({ map: T.bakedTexture('meat'), bumpMap: T.bakedTexture('meat'), bumpScale: 1.5, roughness: 0.55, color: tint }));
}

// Şiş ve üzerinde parmak izli Adana kıyması (ya da tavuk/kuzu parçaları)
export function skewer({ len = 2.0, kind = 'adana', seed = 1 } = {}) {
  const g = new THREE.Group();
  const steel = K.metal('#c8ccd2', 0.25);
  const blade = new THREE.Mesh(K.roundedBox(len + 0.9, 0.014, 0.075, 0.006, 2), steel);
  blade.position.x = 0.25;
  g.add(blade);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.014, 8, 24), steel);
  ring.position.x = len / 2 + 0.78;
  ring.rotation.y = Math.PI / 2;
  g.add(ring);
  if (kind === 'adana' || kind === 'urfa') {
    g.add(kebabMeat({ len, seed, tint: kind === 'urfa' ? '#fff0e0' : '#ffffff' }));
  } else {
    const tex = T.bakedTexture(kind === 'tavuk' ? 'chicken' : 'meat');
    const n = 6;
    for (let i = 0; i < n; i++) {
      const c = new THREE.Mesh(
        K.displace(K.roundedBox(0.24, 0.2, 0.22, 0.06, 3), 0.02, 4, i + seed),
        K.std({ map: tex, roughness: 0.55 })
      );
      c.position.x = -len / 2 + 0.15 + (i / (n - 1)) * (len - 0.3);
      c.rotation.set(i * 0.7, i * 1.3, i * 0.4);
      g.add(c);
    }
  }
  return g;
}

// Mangal: koyu metal tava, kor kömürler, yükselen ışık
export function mangal({ w = 3.2, d = 1.2, count = 46, seed = 4 } = {}) {
  const g = new THREE.Group();
  const iron = K.std({ color: '#26211e', metalness: 0.7, roughness: 0.55 });
  const t = 0.05;
  const h = 0.32;
  const parts = [
    [w, t, d, 0, 0, 0],
    [w, h, t, 0, h / 2, d / 2],
    [w, h, t, 0, h / 2, -d / 2],
    [t, h, d, w / 2, h / 2, 0],
    [t, h, d, -w / 2, h / 2, 0],
  ];
  for (const [x, y, z, px, py, pz] of parts) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(x, y, z), iron);
    m.position.set(px, py, pz);
    g.add(m);
  }
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), iron);
      leg.position.set(sx * (w / 2 - 0.1), -0.25, sz * (d / 2 - 0.1));
      g.add(leg);
    }
  }
  const r = T.rng(seed);
  const emberTex = T.bakedTexture('ember');
  // Kömür: koyu, köşeli parçalar; kor yalnızca çatlaklardan sızar
  const levels = [0.25, 0.7, 1.5];
  const ash = T.bakedTexture('ash');
  const mats = levels.map((i) =>
    K.std({
      map: ash,
      roughness: 0.95,
      emissive: '#ff4410',
      emissiveMap: emberTex,
      emissiveIntensity: i,
      bumpMap: emberTex,
      bumpScale: -1.2,
    })
  );
  const coalGeos = [0, 1, 2].map((k) => {
    const geo = K.displace(new THREE.IcosahedronGeometry(0.13, 2), 0.05, 3.5, seed + k);
    geo.scale(1.15, 0.75, 0.95);
    return geo;
  });
  for (let i = 0; i < count; i++) {
    const c = new THREE.Mesh(coalGeos[i % 3], mats[Math.floor(r() * 3)]);
    c.position.set((r() - 0.5) * (w - 0.25), 0.1 + r() * 0.12, (r() - 0.5) * (d - 0.2));
    c.rotation.set(r() * 3, r() * 3, r() * 3);
    c.scale.setScalar(0.7 + r() * 0.7);
    g.add(c);
  }
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 1.5, d * 3),
    new THREE.MeshBasicMaterial({
      map: T.radialTexture('rgba(255,120,40,0.85)', 'rgba(255,70,20,0)'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.3;
  g.add(glow);
  g.userData.tick = (time) => {
    mats.forEach((m, i) => (m.emissiveIntensity = levels[i] * (0.8 + 0.25 * Math.sin(time * (2 + i) + i * 2))));
    glow.material.opacity = 0.35 + 0.1 * Math.sin(time * 3.1);
  };
  return g;
}

// Zırh: iki saplı hilal bıçak
export function zirh() {
  const g = new THREE.Group();
  const s = new THREE.Shape();
  const R1 = 0.95;
  const R2 = 0.78;
  s.absarc(0, 0.25, R1, Math.PI * 1.15, Math.PI * 1.85, false);
  s.absarc(0, 0.36, R2, Math.PI * 1.85, Math.PI * 1.15, true);
  const blade = new THREE.Mesh(
    new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 40 }),
    K.metal('#d5d9de', 0.18)
  );
  g.add(blade);
  const wood = K.std({ map: T.bakedTexture('wood'), bumpMap: T.bakedTexture('wood'), bumpScale: 0.8, roughness: 0.6 });
  for (const sx of [-1, 1]) {
    const a = Math.PI * (sx < 0 ? 1.15 : 1.85);
    const x = Math.cos(a) * ((R1 + R2) / 2);
    const y = 0.3 + Math.sin(a) * ((R1 + R2) / 2);
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.42, 16), wood);
    h.position.set(x, y + 0.22, 0.006);
    g.add(h);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 10), wood);
    cap.position.set(x, y + 0.44, 0.006);
    g.add(cap);
  }
  return g;
}

export function board({ w = 2.6, d = 1.7 } = {}) {
  const m = new THREE.Mesh(K.roundedBox(w, 0.12, d, 0.05, 4), K.std({ map: T.bakedTexture('wood'), bumpMap: T.bakedTexture('wood'), bumpScale: 0.8, roughness: 0.65 }));
  return m;
}

export function mincePile() {
  const geo = new THREE.SphereGeometry(0.62, 48, 32);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = 1 + (K.fbm(v.x * 4, v.y * 4, v.z * 4) - 0.5) * 0.3;
    v.multiplyScalar(n);
    v.y *= v.y > 0 ? 0.42 : 0.12;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, K.std({ map: T.bakedTexture('mince'), bumpMap: T.bakedTexture('mince'), bumpScale: 1.5, roughness: 0.45 }));
}

// Lavaş: düz yaprak hâlinden dürüme sarılır (p: 0 düz, 1 tamamen sarılı)
export function rollingLavas({ W = 2.4, H = 1.9, rMin = 0.06, rMax = 0.3 } = {}) {
  const segX = 90;
  const segZ = 14;
  const geo = new THREE.PlaneGeometry(W, H, segX, segZ);
  geo.rotateX(-Math.PI / 2);
  const base = geo.attributes.position.array.slice();
  const mat = K.std({ map: T.lavasTexture(2, 1), roughness: 0.8, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  const k = (rMax - rMin) / W;
  const R = (s) => rMin + k * s;
  const pos = geo.attributes.position;
  let last = -1;
  mesh.userData.W = W;
  mesh.userData.rMax = rMax;
  mesh.userData.update = (p) => {
    if (Math.abs(p - last) < 1e-4) return;
    last = p;
    const L = p * W;
    const RL = R(L);
    for (let i = 0; i < pos.count; i++) {
      const s = base[i * 3] + W / 2; // 0..W
      const z = base[i * 3 + 2];
      let x;
      let y;
      if (s >= L) {
        x = s;
        y = 0;
      } else {
        const th = Math.log(RL / R(s)) / k;
        const rs = R(s);
        x = L - rs * Math.sin(th);
        y = RL - rs * Math.cos(th);
      }
      // nihai sarılı eksen başlangıç noktasında olsun
      pos.setXYZ(i, x - W, y - rMax, z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  };
  mesh.userData.update(0);
  return mesh;
}

export function fries() {
  const g = new THREE.Group();
  const cone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.3, 0.75, 4, 1, true),
    K.std({
      map: T.labelTexture({ bg: '#ff5a1f', ink: '#110e0c', title: 'KOR', sub: 'PATATES', font: 'Anton', weight: 400, w: 1024, h: 512 }),
      roughness: 0.6,
      side: THREE.DoubleSide,
    })
  );
  cone.rotation.y = Math.PI / 4;
  cone.position.y = 0.375;
  g.add(cone);
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.01, 0.42), K.std({ color: '#d84a16' }));
  g.add(bottom);
  const r = T.rng(9);
  const mat = K.std({ map: T.bakedTexture('fries'), roughness: 0.55 });
  const geo = K.roundedBox(0.07, 0.75, 0.07, 0.02, 2);
  for (let i = 0; i < 26; i++) {
    const f = new THREE.Mesh(geo, mat);
    f.position.set((r() - 0.5) * 0.42, 0.55 + r() * 0.25, (r() - 0.5) * 0.42);
    f.rotation.set((r() - 0.5) * 0.5, r() * 3, (r() - 0.5) * 0.5);
    f.scale.y = 0.7 + r() * 0.5;
    g.add(f);
  }
  return g;
}

export function kunefe() {
  const g = new THREE.Group();
  const tray = K.bowl({ r: 0.75, h: 0.16, material: K.copper() });
  g.add(tray);
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.7, 0.14, 56),
    [K.std({ color: '#c96a1a', roughness: 0.6 }), K.std({ map: T.bakedTexture('kunefe'), bumpMap: T.bakedTexture('kunefe'), bumpScale: 1.5, roughness: 0.55 }), K.std({ color: '#b8601a' })]
  );
  top.position.y = 0.12;
  g.add(top);
  const syrup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.69, 0.69, 0.005, 56),
    K.phys({ color: '#e08a2a', roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.35 })
  );
  syrup.position.y = 0.195;
  g.add(syrup);
  return g;
}

export function charredPlate() {
  const g = new THREE.Group();
  g.add(K.plate({ r: 1, color: '#f3ece0' }));
  const t1 = K.tomato({ r: 0.26, charred: true });
  t1.position.set(-0.3, 0.25, 0.1);
  const t2 = K.tomato({ r: 0.22, charred: true });
  t2.position.set(0.15, 0.22, 0.35);
  const p1 = K.pepper({ len: 1.1, r: 0.07, charred: true, curve: 0.18 });
  p1.rotation.set(0, 0.4, -Math.PI / 2);
  p1.position.set(-0.5, 0.12, -0.3);
  const p2 = K.pepper({ len: 1.0, r: 0.065, charred: true, curve: 0.25 });
  p2.rotation.set(0, -0.3, -Math.PI / 2);
  p2.position.set(-0.4, 0.14, 0.55);
  g.add(t1, t2, p1, p2);
  return g;
}

export function onionSalad() {
  const g = new THREE.Group();
  g.add(K.bowl({ r: 0.6, h: 0.32, material: K.ceramic('#f3ece0') }));
  const r = T.rng(3);
  for (let i = 0; i < 9; i++) {
    const o = K.onionRing({ r: 0.12 + r() * 0.08, tube: 0.022 });
    o.position.set((r() - 0.5) * 0.5, 0.3 + r() * 0.08, (r() - 0.5) * 0.5);
    o.rotation.set(Math.PI / 2 + (r() - 0.5) * 0.8, r() * 3, (r() - 0.5) * 0.6);
    g.add(o);
  }
  for (let i = 0; i < 3; i++) {
    const s = K.sprig({ tone: 'parsley', leaves: 5, size: 0.16, seed: i });
    s.position.set((r() - 0.5) * 0.5, 0.32, (r() - 0.5) * 0.5);
    s.rotation.set(1.2, r() * 3, 0);
    g.add(s);
  }
  const sumac = K.seeds({ count: 40, radius: 0.35, size: 0.015, color: '#7a1530', seed: 5, flat: true });
  sumac.position.y = 0.38;
  g.add(sumac);
  return g;
}

export function korCan() {
  return K.sodaCan({ color: '#1a1512', ink: '#ff5a1f', title: 'SOĞUK', sub: '330 ml' });
}
