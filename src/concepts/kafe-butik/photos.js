import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as KM from '../kafe/models.js';
import * as P from '../premium/models.js';

// Yalnızca tools/foto.html kullanır: Hatır'ın fotoğrafları. Fincanlar kobalt desenli.

const KOBALT = '#213f9a';

// Ortak modellerdeki kiremit ve adaçayı tabak kenarlarını Hatır'ın kobaltına çevirir
const SWAP = ['#b95d3b', '#7d8c66'].map((h) => new THREE.Color(h));
function kobaltla(obj) {
  const to = new THREE.Color(KOBALT);
  const fix = (m) => {
    if (!m?.color || m.map) return m;
    if (!SWAP.some((c) => Math.abs(c.r - m.color.r) + Math.abs(c.g - m.color.g) + Math.abs(c.b - m.color.b) < 0.03)) return m;
    const n = m.clone();
    n.color.copy(to);
    return n;
  };
  obj.traverse((o) => {
    if (o.isMesh) o.material = Array.isArray(o.material) ? o.material.map(fix) : fix(o.material);
  });
  return obj;
}

function compose(entries) {
  const g = new THREE.Group();
  entries.forEach(([obj, p = [0, 0, 0], r = [0, 0, 0], s = 1]) => {
    obj.position.set(p[0], p[1], p[2]);
    obj.rotation.set(r[0], r[1], r[2]);
    obj.scale.multiplyScalar(s);
    g.add(obj);
  });
  return g;
}

// Tabakta kobalt fincan; isteğe bağlı lokum
function coffee({ lokum = '#f2a7b8', rot = -0.6, foam = true } = {}) {
  const g = new THREE.Group();
  g.add(KM.saucer({ r: 0.46, rim: KOBALT }));
  const f = KM.fincan({ pattern: 'kobalt', foam });
  f.position.set(-0.03, 0.045, 0);
  f.rotation.y = rot;
  g.add(f);
  if (lokum) {
    const l = KM.lokum({ color: lokum });
    l.position.set(0.3, 0.14, 0.13);
    l.rotation.y = 0.5;
    l.scale.setScalar(0.58);
    g.add(l);
  }
  return g;
}

const cupView = { el: 0.4, az: 0.4, zoom: 1.12 };

const items = [
  {
    id: 'hero',
    w: 1000,
    h: 1000,
    bg: KOBALT,
    build: () => {
      const g = coffee({ rot: -0.5 });
      const l2 = KM.lokum({ color: '#f4efe2' });
      l2.position.set(0.16, 0.14, 0.31);
      l2.rotation.y = -0.3;
      l2.scale.setScalar(0.55);
      g.add(l2);
      const w = KM.waterGlass();
      w.position.set(-0.66, 0, -0.32);
      g.add(w);
      return g;
    },
    view: { el: 0.34, az: 0.35, zoom: 1.3 },
  },
  {
    id: 'fal-kapali',
    w: 900,
    h: 900,
    bg: KOBALT,
    build: () => {
      const g = new THREE.Group();
      g.add(KM.saucer({ r: 0.46, rim: KOBALT }));
      const f = KM.fincan({ pattern: 'kobalt', foam: false });
      f.rotation.set(Math.PI, 0.8, 0);
      f.position.y = 0.045 + 0.52;
      g.add(f);
      return g;
    },
    view: { el: 0.42, az: 0.4, zoom: 1.2 },
  },
  { id: 'k-turk', build: () => coffee(), view: cupView },
  {
    id: 'k-dibek',
    build: () =>
      compose([
        [coffee({ lokum: null, rot: -0.9 }), [0.2, 0, 0.2]],
        [KM.cezve(), [-0.45, 0, -0.35], [0, -2.2, 0], 0.75],
      ]),
    view: { el: 0.38, az: 0.35, zoom: 1.1 },
  },
  { id: 'k-menengic', build: () => coffee({ lokum: '#b9d38a', rot: -0.3 }), view: cupView },
  { id: 'k-sakizli', build: () => coffee({ lokum: '#f4efe2', rot: -0.8 }), view: cupView },
  { id: 'c-cay', build: () => KM.teaSet(), view: { el: 0.3, az: 0.4, zoom: 1.05 } },
  { id: 'c-demlik', build: () => compose([[KM.caydanlik(), [-0.35, 0, -0.1]], [KM.teaSet(), [0.6, 0, 0.35], [0, 0, 0], 0.8]]), view: { el: 0.32, az: 0.35, zoom: 1.05 } },
  { id: 'c-ihlamur', build: () => KM.herbalTea(), view: { el: 0.38, az: 0.4, zoom: 1.12 } },
  {
    id: 'e-espresso',
    build: () => {
      const g = new THREE.Group();
      g.add(KM.saucer({ r: 0.36, rim: KOBALT }));
      const f = KM.fincan({ pattern: 'kobalt', foam: false, scale: 0.85 });
      f.position.y = 0.045;
      f.rotation.y = -0.7;
      const crema = new THREE.Mesh(new THREE.CircleGeometry(0.21, 40), K.std({ color: '#8a5a32', roughness: 0.55 }));
      crema.rotation.x = -Math.PI / 2;
      crema.position.y = 0.42 * 0.85 + 0.045;
      g.add(f, crema);
      return g;
    },
    view: cupView,
  },
  { id: 'e-latte', build: () => KM.latteCup({ top: 'heart', glaze: KOBALT, inner: '#f8f6f2' }), view: { el: 0.5, az: 0.4, zoom: 1.12 } },
  { id: 'e-flatwhite', build: () => KM.latteCup({ top: 'tulip', glaze: KOBALT, inner: '#f8f6f2', size: 0.85 }), view: { el: 0.5, az: 0.4, zoom: 1.12 } },
  { id: 't-lokum', build: () => KM.lokumPlate(), view: { el: 0.55, az: 0.3, zoom: 1.3 } },
  { id: 't-baklava', build: () => P.baklava(), view: { el: 0.55, az: 0.3, zoom: 1.3 } },
  { id: 't-sansebastian', build: () => KM.cheesecake(), view: { el: 0.45, az: 0.6, zoom: 1.3 } },
  {
    id: 's-simit',
    build: () =>
      compose([
        [KM.simit(), [-0.35, 0.12, 0.15]],
        [KM.teaSet(), [0.55, 0, -0.25], [0, 0, 0], 0.85],
        [new THREE.Mesh(K.roundedBox(0.36, 0.13, 0.26, 0.02, 2), K.std({ color: '#fbf9f2', roughness: 0.75 })), [-0.25, 0.07, -0.5]],
      ]),
    view: { el: 0.42, az: 0.35, zoom: 1.15 },
  },
  { id: 's-tost', build: () => KM.toast(), view: { el: 0.5, az: 0.4, zoom: 1.25 } },
];

export default {
  id: 'kafe-butik',
  fonts: [],
  opts: {
    env: { warmth: 0.35 },
    lights: { key: '#fff6ec', keyI: 2.4, rim: '#ffffff', rimI: 0.8 },
    envIntensity: 0.85,
    shadowOpacity: 0.3,
    fov: 26,
  },
  studio: { inner: '#f7f6f2', outer: '#f7f6f2', shadow: 0.26, zoom: 1, ao: 0.8 },
  items: items.map((it) => ({ w: 640, h: 640, ...it, build: () => kobaltla(it.build()) })),
};
