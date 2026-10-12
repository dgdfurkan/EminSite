import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as T from './textures.js';

// ============================================================================
// Gürültü ve yardımcılar
// ============================================================================
function hash3(x, y, z) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1440662683);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const fade = (t) => t * t * (3 - 2 * t);

export function vnoise(x, y, z) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = fade(x - xi);
  const yf = fade(y - yi);
  const zf = fade(z - zi);
  const l = (a, b, t) => a + (b - a) * t;
  const c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf),
    l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf
  );
}

export const fbm = (x, y, z) =>
  vnoise(x, y, z) * 0.6 + vnoise(x * 2.03, y * 2.03, z * 2.03) * 0.28 + vnoise(x * 4.1, y * 4.1, z * 4.1) * 0.12;

export const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const std = (o) => new THREE.MeshStandardMaterial(o);
export const phys = (o) => new THREE.MeshPhysicalMaterial(o);

export function place(obj, { p, r, s } = {}) {
  if (p) obj.position.set(p[0], p[1], p[2]);
  if (r) obj.rotation.set(r[0], r[1], r[2]);
  if (s !== undefined) Array.isArray(s) ? obj.scale.set(s[0], s[1], s[2]) : obj.scale.setScalar(s);
  return obj;
}

export function group(...children) {
  const g = new THREE.Group();
  children.filter(Boolean).forEach((c) => g.add(c));
  return g;
}

export function lathe(points, segments = 64) {
  return new THREE.LatheGeometry(
    points.map(([r, y]) => new THREE.Vector2(Math.max(0.0001, r), y)),
    segments
  );
}

export function roundedBox(w, h, d, r = 0.04, seg = 4) {
  return new RoundedBoxGeometry(w, h, d, seg, Math.min(r, Math.min(w, h, d) / 2 - 0.001));
}

// Merkezde duran dışbükey geometriyi gürültüyle hafifçe bozar (organik görünüm).
// Yön konumdan hesaplanır; böylece dikiş noktalarındaki kopya köşeler ayrışmaz.
export function displace(geo, amount, freq = 3, seed = 0) {
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    n.copy(v).normalize();
    const d = (fbm(v.x * freq + seed, v.y * freq, v.z * freq) - 0.5) * 2 * amount;
    v.addScaledVector(n, d);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// ============================================================================
// Ortak malzemeler
// ============================================================================
const glassVert = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const glassFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower);
    gl_FragColor = vec4(uColor, clamp(f * uIntensity, 0.0, 1.0));
  }
`;

// Gerçek cam modu: opak fonlu sahnelerde (premium, stüdyo görselleri) kırılmalı fiziksel cam.
// Şeffaf tuvalde (standart seri) kırılma örneklenemediği için yansımalı sahte cam kullanılır.
let glassReal = false;
export const setGlassReal = (v) => (glassReal = !!v);
export const isGlassReal = () => glassReal;

// Cam: arka yüz + ön yüz (yansıma) + fresnel kenar parlaması
export function glassMesh(geo, { tint = '#ffffff', opacity = 0.14, rim = 0.85, rimColor = '#ffffff', env = 2.4 } = {}) {
  if (glassReal) {
    const m = new THREE.Mesh(
      geo,
      phys({
        color: tint,
        metalness: 0,
        roughness: 0.015,
        transmission: 1,
        thickness: 0.08,
        ior: 1.5,
        specularIntensity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 1.6,
        attenuationColor: new THREE.Color(tint).lerp(new THREE.Color('#e6f2ee'), 0.5),
        attenuationDistance: 1.5,
      })
    );
    m.renderOrder = 3;
    return group(m);
  }
  const front = phys({
    color: tint,
    roughness: 0.03,
    metalness: 0,
    transparent: true,
    opacity,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: env,
    depthWrite: false,
  });
  const back = front.clone();
  back.side = THREE.BackSide;
  back.opacity = opacity * 0.7;
  const rimMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(rimColor) },
      uPower: { value: 2.4 },
      uIntensity: { value: rim },
    },
    vertexShader: glassVert,
    fragmentShader: glassFrag,
    transparent: true,
    depthWrite: false,
  });
  const g = new THREE.Group();
  const mb = new THREE.Mesh(geo, back);
  const mf = new THREE.Mesh(geo, front);
  const mr = new THREE.Mesh(geo, rimMat);
  mb.renderOrder = 2;
  mf.renderOrder = 3;
  mr.renderOrder = 4;
  g.add(mb, mf, mr);
  return g;
}

export const ceramic = (color = '#fbf8f2', o = {}) =>
  phys({ color, roughness: 0.16, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, specularIntensity: 0.8, ...o });

export const metal = (color = '#c9ccd1', roughness = 0.28) => std({ color, metalness: 1, roughness });

// Dövme bakır: çekiç izleri yüzeyde ışığı kırar
export const copper = () =>
  std({
    color: '#dc8558',
    metalness: 1,
    roughness: 0.24,
    bumpMap: T.bakedTexture('hammered'),
    bumpScale: 1.6,
    roughnessMap: T.bakedTexture('hammered'),
  });

export const brass = (o = {}) =>
  std({ color: '#c6a15e', metalness: 1, roughness: 0.3, bumpMap: T.bakedTexture('hammered'), bumpScale: 0.6, ...o });

// ============================================================================
// Ortak modeller
// ============================================================================
export function contactShadow(size = 1, opacity = 0.32, color = '#000000') {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      map: T.radialTexture('rgba(0,0,0,0.75)', 'rgba(0,0,0,0)'),
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      toneMapped: false,
    })
  );
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = 1;
  m.userData.isShadow = true;
  return m;
}

export function plate({ r = 1, color = '#fbf8f2', rimColor = null } = {}) {
  const geo = lathe(
    [
      [0, 0],
      [r * 0.6, 0],
      [r * 0.64, 0.012],
      [r * 0.7, 0.03],
      [r * 0.88, 0.075],
      [r * 0.97, 0.105],
      [r, 0.118],
      [r * 0.985, 0.13],
      [r * 0.94, 0.118],
      [r * 0.72, 0.062],
      [r * 0.64, 0.048],
      [r * 0.3, 0.044],
      [0, 0.044],
    ],
    72
  );
  const g = group(new THREE.Mesh(geo, ceramic(color)));
  if (rimColor) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r * 0.985, 0.012, 8, 96), ceramic(rimColor));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.124;
    g.add(rim);
  }
  g.userData.top = 0.046;
  return g;
}

export function bowl({ r = 0.5, h = 0.32, material, inner }) {
  const outer = lathe(
    [
      [0, 0],
      [r * 0.5, 0],
      [r * 0.58, 0.01],
      [r * 0.85, h * 0.35],
      [r * 0.98, h * 0.8],
      [r, h],
    ],
    64
  );
  const inn = lathe(
    [
      [r * 0.96, h],
      [r * 0.94, h * 0.82],
      [r * 0.8, h * 0.4],
      [r * 0.5, h * 0.12],
      [0, h * 0.1],
    ],
    64
  );
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r * 0.98, r * 0.022, 10, 80), material);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = h;
  return group(new THREE.Mesh(outer, material), new THREE.Mesh(inn, inner || material), rim);
}

export function leaf({ w = 1, h = 1.5, tone = 'lettuce', cup = 0.28, ruffle = 0.06, curl = 0.18, seed = 0 } = {}) {
  const g = new THREE.PlaneGeometry(w, h, 30, 44);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = x / (w / 2);
    const ny = (y + h * 0.04) / (h / 2);
    const e = nx * nx + ny * ny;
    let z = cup * nx * nx * w * 0.5;
    z += curl * ny * ny * h * 0.4;
    z += ruffle * smooth(0.4, 1, e) * Math.sin(Math.atan2(ny, nx) * 22 + seed) * w * 0.6;
    z += (vnoise(nx * 3 + seed, ny * 3, 0) - 0.5) * 0.04 * w;
    pos.setZ(i, z);
  }
  g.computeVertexNormals();
  const tex = T.leafTexture(tone);
  const mat = phys({
    map: tex,
    bumpMap: tex,
    bumpScale: 2.2,
    alphaTest: 0.5,
    side: THREE.DoubleSide,
    roughness: 0.42,
    metalness: 0,
    sheen: 0.5,
    sheenRoughness: 0.5,
    sheenColor: '#e6f7b0',
    clearcoat: 0.25,
    clearcoatRoughness: 0.3,
  });
  return new THREE.Mesh(g, mat);
}

export function citrusSlice({ r = 0.34, t = 0.07, kind = 'lemon' } = {}) {
  const rind = { lemon: '#f2c21b', orange: '#f08a1c', tomato: '#cf2a1e', cucumber: '#2f6b23' }[kind];
  const geo = new THREE.CylinderGeometry(r, r, t, 56, 1);
  const cap = phys({ map: T.sliceTexture(kind), roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.25 });
  const side = phys({ color: rind, roughness: 0.45, clearcoat: 0.4 });
  return new THREE.Mesh(geo, [side, cap, cap]);
}

export function seeds({ count = 18, radius = 0.4, size = 0.055, color = '#b4122a', seed = 1, flat = false } = {}) {
  const geo = new THREE.IcosahedronGeometry(1, 2);
  const mat = glassReal
    ? phys({
        color,
        roughness: 0.06,
        transmission: 0.55,
        thickness: 0.4,
        ior: 1.36,
        attenuationColor: '#7a0010',
        attenuationDistance: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        emissive: '#3a0008',
        emissiveIntensity: 0.25,
      })
    : phys({
        color,
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        emissive: '#3a0008',
        emissiveIntensity: 0.6,
        sheen: 0.4,
        sheenColor: '#ff6070',
      });
  const im = new THREE.InstancedMesh(geo, mat, count);
  const r = T.rng(seed);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (let i = 0; i < count; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * radius;
    const p = new THREE.Vector3(Math.cos(a) * d, flat ? r() * 0.03 : (r() - 0.5) * radius, Math.sin(a) * d);
    e.set(r() * 3, r() * 3, r() * 3);
    q.setFromEuler(e);
    const s = size * (0.8 + r() * 0.4);
    m.compose(p, q, new THREE.Vector3(s * 0.85, s * 1.2, s * 0.8));
    im.setMatrixAt(i, m);
  }
  im.instanceMatrix.needsUpdate = true;
  return im;
}

export function pepper({ len = 1.1, r = 0.075, color = '#3f8f2a', curve = 0.22, charred = false } = {}) {
  const pts = [[0, 0]];
  const n = 26;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let rad;
    if (t < 0.07) rad = r * (0.72 + (t / 0.07) * 0.28);
    else rad = r * (1 - Math.pow((t - 0.07) / 0.93, 2.6) * 0.95);
    pts.push([rad, t * len]);
  }
  pts.push([0, len + 0.01]);
  const geo = lathe(pts, 22);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = y / len;
    pos.setX(i, pos.getX(i) + curve * len * t * t);
    pos.setZ(i, pos.getZ(i) * 0.88);
  }
  geo.computeVertexNormals();
  const mat = phys({
    color,
    roughness: 0.28,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    map: charred ? T.bakedTexture('char') : null,
  });
  const body = new THREE.Mesh(geo, mat);
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.01, 0),
    new THREE.Vector3(-0.02, -0.06, 0),
    new THREE.Vector3(-0.07, -0.12, 0),
  ]);
  const stem = new THREE.Mesh(
    new THREE.TubeGeometry(stemCurve, 8, r * 0.22, 8),
    std({ color: '#5d7a2a', roughness: 0.6 })
  );
  const calyx = new THREE.Mesh(new THREE.SphereGeometry(r * 0.78, 16, 10), std({ color: '#4d7a24', roughness: 0.5 }));
  calyx.scale.set(1, 0.45, 1);
  calyx.position.y = 0.02;
  return group(body, stem, calyx);
}

export function tomato({ r = 0.3, charred = false } = {}) {
  const geo = new THREE.SphereGeometry(r, 44, 30);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const phi = Math.atan2(v.z, v.x);
    const k = 1 + 0.035 * Math.cos(phi * 5) * Math.sqrt(Math.max(0, 1 - (v.y / r) ** 2));
    v.x *= k;
    v.z *= k;
    v.y *= 0.82;
    const dTop = Math.sqrt(v.x * v.x + v.z * v.z) / r;
    if (v.y > 0) v.y -= 0.09 * r * Math.exp(-dTop * dTop * 14);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const body = new THREE.Mesh(
    geo,
    phys({
      color: charred ? '#b8281a' : '#d5291c',
      roughness: charred ? 0.5 : 0.22,
      clearcoat: charred ? 0.3 : 1,
      clearcoatRoughness: 0.15,
      map: charred ? T.bakedTexture('char') : null,
    })
  );
  const star = new THREE.Shape();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const rr = i % 2 ? r * 0.12 : r * 0.42;
    const x = Math.cos(a) * rr;
    const y = Math.sin(a) * rr;
    if (i === 0) star.moveTo(x, y);
    else star.lineTo(x, y);
  }
  const calyx = new THREE.Mesh(
    new THREE.ExtrudeGeometry(star, { depth: 0.012, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2 }),
    std({ color: '#3f6e22', roughness: 0.6 })
  );
  calyx.rotation.x = -Math.PI / 2;
  calyx.position.y = r * 0.74;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.09, 8), std({ color: '#4a7426', roughness: 0.6 }));
  stem.position.y = r * 0.8;
  return group(body, calyx, stem);
}

export function onionRing({ r = 0.2, tube = 0.028 } = {}) {
  const m = new THREE.Mesh(
    new THREE.TorusGeometry(r, tube, 12, 48),
    phys({ color: '#efd3ea', roughness: 0.35, clearcoat: 0.6, sheen: 0.6, sheenColor: '#b36ea0' })
  );
  const outer = new THREE.Mesh(
    new THREE.TorusGeometry(r + tube * 0.9, tube * 0.35, 8, 48),
    phys({ color: '#9b3d7d', roughness: 0.35, clearcoat: 0.6 })
  );
  return group(m, outer);
}

export function sprig({ tone = 'parsley', leaves = 5, size = 0.22, seed = 1 } = {}) {
  const g = new THREE.Group();
  const r = T.rng(seed);
  const stemMat = std({ color: '#5c8f2e', roughness: 0.6 });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, size * 1.6, 6), stemMat);
  stem.position.y = size * 0.8;
  g.add(stem);
  for (let i = 0; i < leaves; i++) {
    const l = leaf({ w: size * 0.7, h: size * 0.9, tone, cup: 0.4, ruffle: 0.12, curl: 0.1, seed: i * 3 });
    const a = (i / leaves) * Math.PI * 2 + r();
    l.position.set(Math.cos(a) * size * 0.25, size * (1.2 + r() * 0.4), Math.sin(a) * size * 0.25);
    l.rotation.set(-0.5 + r() * 0.3, a, 0.4);
    g.add(l);
  }
  return g;
}

// Dürüm: lavaş tüp, iç katman, harç, kâğıt ambalaj
export function wrap({
  length = 1.9,
  radius = 0.42,
  paper = 'yogrum',
  filling = 'cigkofte',
  paperRatio = 0.56,
  greens = true,
  seed = 1,
} = {}) {
  const g = new THREE.Group();
  const r = T.rng(seed);
  const half = length / 2;
  const lavTex = T.lavasTexture(seed % 3, 1.5);
  const lavMat = phys({ map: lavTex, bumpMap: lavTex, bumpScale: 1.4, roughness: 0.82, sheen: 0.4, sheenRoughness: 0.7, sheenColor: '#fff2d6', side: THREE.DoubleSide });

  const lavGeo = new THREE.CylinderGeometry(radius, radius * 0.97, length, 64, 30, true);
  const pos = lavGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const a = Math.atan2(z, x);
    // hafif basık kesit, lavaş kırışıklıkları
    let k = 1 + (vnoise(Math.cos(a) * 2 + seed, y * 3, Math.sin(a) * 2) - 0.5) * 0.06;
    k += Math.sin(a * 9 + y * 2) * 0.008;
    let yy = y;
    const top = smooth(half - 0.18, half, y);
    if (top > 0) {
      // ağız: düzensiz kenar, hafif dışa açılma ve kıvrım
      yy += top * (vnoise(Math.cos(a) * 3, seed, Math.sin(a) * 3) - 0.35) * 0.16;
      k *= 1 + top * (0.04 + Math.sin(a * 5 + seed) * 0.025);
    }
    pos.setXYZ(i, x * k, yy, z * k * 0.92);
  }
  lavGeo.computeVertexNormals();
  g.add(new THREE.Mesh(lavGeo, lavMat));

  // sarım kenarı (spiral katman izlenimi)
  const flap = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.018, radius * 0.99, length * 0.98, 32, 1, true, 0, 1.3),
    lavMat
  );
  flap.rotation.y = 2.2;
  flap.scale.z = 0.92;
  g.add(flap);

  const inner = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.82, radius * 0.82, 0.3, 48, 1, true),
    lavMat
  );
  inner.position.y = half - 0.14;
  inner.scale.z = 0.92;
  g.add(inner);

  // harç
  const top = new THREE.Mesh(
    new THREE.CircleGeometry(radius * 0.8, 40),
    std({ map: T.fillingTexture(filling), roughness: 0.7 })
  );
  top.rotation.x = -Math.PI / 2;
  top.position.y = half - 0.03;
  top.scale.y = 0.92;
  g.add(top);

  const chunkPal = {
    cigkofte: ['#9a361a', '#7a2410', '#b44a24'],
    adana: ['#5c2a10', '#7a3a18', '#3e1a09'],
    urfa: ['#64341a', '#7f4420', '#432010'],
    tavuk: ['#d39a52', '#b97a36', '#e8b874'],
    ciger: ['#4a1f14', '#5e2a1c', '#38160c'],
    kuzu: ['#5c2c14', '#70391c', '#43200e'],
    doner: ['#cf9450', '#b77a38', '#e3ae6c'],
    etdoner: ['#6e3a1a', '#82461f', '#542a12'],
  }[filling] || ['#9a361a'];
  const chunkGeo = displace(roundedBox(0.12, 0.08, 0.1, 0.03, 2), 0.012, 9, seed);
  const chunkMats = chunkPal.map((c) => std({ color: c, roughness: 0.6 }));
  for (let i = 0; i < 15; i++) {
    const c = new THREE.Mesh(chunkGeo, chunkMats[i % chunkMats.length]);
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * radius * 0.62;
    c.position.set(Math.cos(a) * d, half - 0.01 + r() * 0.1 * (1 - d / radius), Math.sin(a) * d * 0.92);
    c.rotation.set(r() * 2, r() * 2, r() * 2);
    c.scale.setScalar(0.8 + r() * 0.7);
    g.add(c);
  }
  if (filling !== 'cigkofte') {
    for (let i = 0; i < 3; i++) {
      const t = citrusSlice({ r: 0.1, t: 0.03, kind: 'tomato' });
      const a = r() * Math.PI * 2;
      t.position.set(Math.cos(a) * radius * 0.45, half + 0.03, Math.sin(a) * radius * 0.45);
      t.rotation.set(1.2 + r() * 0.5, r() * 3, 0.3);
      g.add(t);
    }
  }
  if (greens) {
    const tone = filling === 'cigkofte' ? 'lettuce' : 'parsley';
    const n = filling === 'cigkofte' ? 4 : 5;
    for (let i = 0; i < n; i++) {
      const l = leaf({ w: 0.28, h: 0.42, tone, cup: 0.35, ruffle: 0.1, curl: 0.25, seed: i + seed });
      const a = (i / n) * Math.PI * 2 + r() * 0.6;
      l.position.set(Math.cos(a) * radius * 0.42, half + 0.1, Math.sin(a) * radius * 0.42);
      l.rotation.set(-0.25 + r() * 0.2, -a + Math.PI / 2, (r() - 0.5) * 0.4);
      g.add(l);
    }
  }

  // kâğıt
  if (paper) {
    const y0 = -half - 0.012;
    const base = -half + length * paperRatio;
    const pr = radius * 1.04;
    const segs = 72;
    const rows = 10;
    const positions = [];
    const uvs = [];
    const idx = [];
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      const a = u * Math.PI * 2;
      const topY = base + 0.24 * (u - 0.5);
      for (let j = 0; j <= rows; j++) {
        const t = j / rows;
        const y = y0 + (topY - y0) * t;
        // kâğıt kırışıklığı: ince dalga + rastgele katlanma izleri
        const crinkle = 1 + (vnoise(u * 20, y * 6, seed) - 0.5) * 0.03 + Math.sin(u * 120 + y * 8) * 0.0025;
        positions.push(Math.sin(a) * pr * crinkle, y, Math.cos(a) * pr * crinkle * 0.92);
        uvs.push(u, (y - y0) / (Math.PI * pr));
      }
    }
    for (let i = 0; i < segs; i++) {
      for (let j = 0; j < rows; j++) {
        const a = i * (rows + 1) + j;
        const b = a + rows + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pg.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    pg.setIndex(idx);
    pg.computeVertexNormals();
    const pmat = phys({ map: T.paperTexture(paper), roughness: 0.85, side: THREE.DoubleSide });
    g.add(new THREE.Mesh(pg, pmat));
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(pr, 48), pmat);
    bottom.rotation.x = Math.PI / 2;
    bottom.scale.y = 0.92;
    bottom.position.y = y0;
    g.add(bottom);
  } else {
    const cap = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.97, 48), lavMat);
    cap.rotation.x = Math.PI / 2;
    cap.scale.y = 0.92;
    cap.position.y = -half;
    g.add(cap);
  }
  g.userData.half = half;
  return g;
}

// Ayran (plastik bardak, folyo kapak)
export function ayranCup({ bg = '#ffffff', ink = '#d7262f', title = 'AYRAN', sub = '' } = {}) {
  const cup = lathe(
    [
      [0, 0],
      [0.23, 0],
      [0.24, 0.02],
      [0.3, 0.6],
      [0.315, 0.62],
      [0.315, 0.635],
    ],
    56
  );
  const body = new THREE.Mesh(cup, phys({ color: '#f7f7f4', roughness: 0.3, clearcoat: 0.5 }));
  const lidTex = T.labelTexture({ bg, ink, title, sub, w: 512, h: 512 });
  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.325, 0.325, 0.014, 56),
    [std({ color: bg, roughness: 0.4, metalness: 0.3 }), std({ map: lidTex, roughness: 0.35, metalness: 0.25 }), std({ color: '#ddd' })]
  );
  lid.position.y = 0.642;
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(0.288, 0.268, 0.2, 56, 1, true),
    std({ color: ink, roughness: 0.4 })
  );
  band.position.y = 0.36;
  return group(body, band, lid);
}

// Bakır tasta köpüklü ayran: kubbeli, kabarcıklı köpük
export function ayranBowl() {
  const mat = copper();
  const b = bowl({ r: 0.42, h: 0.38, material: mat });
  const foamTex = T.latteTexture('ayran');
  const foamGeo = new THREE.SphereGeometry(0.4, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const p = foamGeo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const y = p.getY(i);
    const n = (vnoise(x * 9, z * 9, 3) - 0.5) * 0.018;
    p.setY(i, y * 0.13 + n);
  }
  foamGeo.computeVertexNormals();
  const foam = new THREE.Mesh(
    foamGeo,
    phys({ map: foamTex, bumpMap: foamTex, bumpScale: 2.5, roughness: 0.55, sheen: 0.6, sheenColor: '#ffffff', sheenRoughness: 0.4 })
  );
  foam.position.y = 0.315;
  return group(b, foam);
}

export function tumbler({ h = 0.9, r = 0.26, liquid = '#5b0e2d', fill = 0.82, emissive = '#2a0010', clear = false } = {}) {
  const glass = lathe(
    [
      [0, 0],
      [r * 0.86, 0],
      [r * 0.9, 0.04],
      [r, h],
      [r * 0.96, h],
      [r * 0.86, 0.07],
      [0, 0.07],
    ],
    56
  );
  const liq = lathe(
    [
      [0, 0.075],
      [r * 0.85, 0.075],
      [r * 0.85 + (r * 0.95 - r * 0.85) * fill, h * fill],
      [0, h * fill],
    ],
    48
  );
  const liqMesh = new THREE.Mesh(
    liq,
    clear
      ? phys({ color: liquid, roughness: 0.02, clearcoat: 1, transparent: true, opacity: 0.28, depthWrite: false })
      : phys({ color: liquid, roughness: 0.08, clearcoat: 1, emissive, emissiveIntensity: 0.5 })
  );
  if (clear) liqMesh.renderOrder = 1;
  return group(liqMesh, glassMesh(glass));
}

export function sodaCan({ color = '#d7262f', ink = '#ffffff', title = 'GAZOZ', sub = '330 ml' } = {}) {
  const tex = T.labelTexture({ bg: color, ink, title, sub, accent: 'rgba(255,255,255,0.18)', w: 1024, h: 512 });
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.62, 56, 1, true),
    phys({ map: tex, metalness: 0.55, roughness: 0.32, clearcoat: 1 })
  );
  body.position.y = 0.38;
  const al = metal('#d5d8dc', 0.25);
  const topG = lathe(
    [
      [0.22, 0],
      [0.2, 0.05],
      [0.19, 0.06],
      [0.195, 0.07],
      [0.17, 0.065],
      [0, 0.06],
    ],
    56
  );
  const top = new THREE.Mesh(topG, al);
  top.position.y = 0.69;
  const botG = lathe(
    [
      [0, 0.02],
      [0.15, 0],
      [0.19, 0.02],
      [0.22, 0.07],
    ],
    56
  );
  const bot = new THREE.Mesh(botG, al);
  const tab = new THREE.Mesh(roundedBox(0.09, 0.012, 0.05, 0.006), al);
  tab.position.set(0.05, 0.76, 0);
  return group(body, top, bot, tab);
}

// ============================================================================
// Parçacıklar: kor ve buhar (GPU'da canlanır)
// ============================================================================
export function embers({ count = 220, w = 6, h = 5, d = 2, color = '#ff7a2a', size = 34 } = {}) {
  const geo = new THREE.BufferGeometry();
  const p = new Float32Array(count * 3);
  const s = new Float32Array(count * 4);
  const r = T.rng(77);
  for (let i = 0; i < count; i++) {
    p[i * 3] = (r() - 0.5) * w;
    p[i * 3 + 1] = 0;
    p[i * 3 + 2] = (r() - 0.5) * d;
    s[i * 4] = r();
    s[i * 4 + 1] = r();
    s[i * 4 + 2] = 0.06 + r() * 0.14;
    s[i * 4 + 3] = r();
  }
  geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(s, 4));
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uHeight: { value: h },
      uSize: { value: size },
      uPR: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute vec4 aSeed;
      uniform float uTime, uHeight, uSize, uPR;
      varying float vA;
      void main() {
        float t = fract(aSeed.w + uTime * aSeed.z);
        vec3 p = position;
        p.y += t * uHeight;
        p.x += sin(t * 9.0 + aSeed.x * 20.0) * 0.35 * t;
        p.z += cos(t * 7.0 + aSeed.y * 20.0) * 0.25 * t;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPR * (0.35 + aSeed.x * 0.65) * (1.0 - t * 0.5) / -mv.z;
        vA = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.55, 1.0, t)) * (0.5 + 0.5 * sin(uTime * 8.0 + aSeed.y * 40.0));
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        vec3 c = mix(uColor, vec3(1.0, 0.92, 0.6), smoothstep(0.22, 0.0, d));
        gl_FragColor = vec4(c, a * vA * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  pts.userData.tick = (t) => (mat.uniforms.uTime.value = t);
  return pts;
}

export function steam({ count = 26, w = 0.3, h = 1.4, color = '#ffffff', size = 260, opacity = 0.32, speed = 0.12 } = {}) {
  const geo = new THREE.BufferGeometry();
  const p = new Float32Array(count * 3);
  const s = new Float32Array(count * 4);
  const r = T.rng(5);
  for (let i = 0; i < count; i++) {
    p[i * 3] = (r() - 0.5) * w;
    p[i * 3 + 2] = (r() - 0.5) * w;
    s[i * 4] = r();
    s[i * 4 + 1] = r();
    s[i * 4 + 2] = speed * (0.7 + r() * 0.6);
    s[i * 4 + 3] = i / count;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(s, 4));
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uHeight: { value: h },
      uSize: { value: size },
      uPR: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
    vertexShader: /* glsl */ `
      attribute vec4 aSeed;
      uniform float uTime, uHeight, uSize, uPR;
      varying float vA;
      varying float vR;
      void main() {
        float t = fract(aSeed.w + uTime * aSeed.z);
        vec3 p = position;
        p.y += t * uHeight;
        p.x += sin(t * 5.0 + aSeed.x * 6.28) * 0.12 * t;
        p.z += cos(t * 4.0 + aSeed.y * 6.28) * 0.08 * t;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPR * (0.55 + t * 1.4) / -mv.z;
        vA = smoothstep(0.0, 0.25, t) * (1.0 - smoothstep(0.4, 1.0, t));
        vR = aSeed.x;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vA;
      varying float vR;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor, a * a * a * vA * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  pts.renderOrder = 10;
  pts.userData.tick = (t) => (mat.uniforms.uTime.value = t);
  return pts;
}

// Sahnedeki tüm "tick" fonksiyonlarını çalıştırır
export function tickAll(root, t) {
  root.traverse((o) => {
    if (o.userData.tick) o.userData.tick(t);
  });
}

// Grubu verilen boyuta sığacak şekilde merkezler ve ölçekler
export function fit(obj, size = 1) {
  const box = new THREE.Box3().setFromObject(obj);
  const s = new THREE.Vector3();
  const c = new THREE.Vector3();
  box.getSize(s);
  box.getCenter(c);
  const k = size / Math.max(s.x, s.y, s.z);
  const wrapG = new THREE.Group();
  obj.position.sub(c);
  wrapG.add(obj);
  wrapG.scale.setScalar(k);
  return wrapG;
}

// Boşta hafifçe süzülme
export function floater(obj, { amp = 0.08, speed = 0.8, phase = 0, rot = 0.12 } = {}) {
  const g = new THREE.Group();
  g.add(obj);
  g.userData.tick = (t) => {
    g.position.y = Math.sin(t * speed + phase) * amp;
    g.rotation.z = Math.sin(t * speed * 0.7 + phase) * rot * 0.5;
    g.rotation.x = Math.cos(t * speed * 0.6 + phase) * rot * 0.4;
  };
  return g;
}

// Model -> çıkış animasyon grubu -> süzülme grubu katmanlarını kurar
export function layered(model, float = {}) {
  const outer = new THREE.Group();
  outer.add(floater(model, float));
  return outer;
}
