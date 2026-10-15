import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as DM from '../durum/models.js';
import * as P from '../premium/models.js';

// Yalnızca tools/foto.html kullanır: Ocak 42'nin ürün fotoğrafları (fiş kâğıdı zemininde).

const wrapOf = (o = {}) => K.wrap({ paper: 'ocak', filling: 'adana', ...o });
const friesOcak = () => DM.fries({ label: { bg: '#c4161c', ink: '#fbfaf6', title: 'OCAK 42', sub: 'PATATES', font: 'Big Shoulders Display Variable', weight: 800, subFont: 'Instrument Sans Variable' }, bottom: '#9a0f14' });

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

// Yatırılmış dürüm ve yanında köz ya da soğan
function lyingWrap(filling, seed = 1, sides = []) {
  const g = new THREE.Group();
  const w = wrapOf({ filling, seed, radius: 0.42 });
  w.rotation.order = 'YXZ';
  w.rotation.set(0, 0.3, Math.PI / 2);
  w.position.set(-0.2, 0.43, 0);
  g.add(w);
  const add = {
    charred: (i) => {
      const p = K.pepper({ len: 0.9, r: 0.062, charred: true, curve: 0.22 });
      p.rotation.set(0, 0.5 + i * 0.4 + Math.PI / 2, -Math.PI / 2);
      p.position.set(0.95 + i * 0.1, 0.06 + i * 0.03, 0.55 - i * 0.35);
      return p;
    },
    tomato: () => {
      const t = K.tomato({ r: 0.2, charred: true });
      t.position.set(1.05, 0.17, -0.45);
      return t;
    },
    onion: () => {
      const o = K.onionRing({ r: 0.16 });
      o.rotation.set(Math.PI / 2, 0, 0);
      o.position.set(0.95, 0.05, 0.6);
      return o;
    },
    lemon: () => {
      const l = P.lemonWedge({ r: 0.2, t: 0.05 });
      l.position.set(1.0, 0.03, 0.55);
      l.rotation.set(0, -0.5, 0);
      return l;
    },
    pepper: () => {
      const p = K.pepper({ len: 0.85, r: 0.06, curve: 0.2 });
      p.rotation.set(0, -0.4, -Math.PI / 2);
      p.position.set(0.95, 0.06, 0.5);
      return p;
    },
  };
  sides.forEach((s, i) => g.add(add[s](i)));
  return g;
}

const wrapView = { el: 0.42, az: 0.12, zoom: 1.12 };

const items = [
  // Hero: tezgâhın üstünde, şeffaf zemin
  {
    id: 'hero',
    w: 1100,
    h: 700,
    alpha: true,
    build: () => {
      const g = lyingWrap('adana', 1, []);
      const sk = DM.skewer({ len: 1.9, seed: 3 });
      sk.position.set(0.05, 0.12, 0.72);
      sk.rotation.y = -0.08;
      g.add(sk);
      [
        [1.2, 0.3, 0.12],
        [1.3, 0.05, -0.18],
      ].forEach(([x, z, ry], i) => {
        const p = K.pepper({ len: 0.95, r: 0.065, charred: true, curve: 0.2 });
        p.rotation.set(0, ry, -Math.PI / 2);
        p.position.set(x, 0.07 + i * 0.03, z);
        g.add(p);
      });
      const t = K.tomato({ r: 0.22, charred: true });
      t.position.set(1.15, 0.19, -0.5);
      g.add(t);
      return g;
    },
    view: { el: 0.3, az: 0.08, zoom: 1.32, shadowScale: 0.8, shadowOpacity: 0.32 },
  },
  { id: 'o-adana', build: () => lyingWrap('adana', 1, ['charred', 'charred']), view: wrapView },
  { id: 'o-urfa', build: () => lyingWrap('urfa', 2, ['tomato', 'pepper']), view: wrapView },
  { id: 'o-tavuk', build: () => lyingWrap('tavuk', 3, ['lemon']), view: wrapView },
  { id: 'o-ciger', build: () => lyingWrap('ciger', 4, ['onion']), view: wrapView },
  { id: 'o-kuzu', build: () => lyingWrap('kuzu', 5, ['charred', 'tomato']), view: wrapView },
  {
    id: 'm-usta',
    build: () =>
      compose([
        [lyingWrap('adana', 1), [-0.35, 0, 0.1]],
        [friesOcak(), [1.05, 0, -0.45], [0, 0.3, 0], 1.05],
        [K.ayranBowl(), [1.25, 0, 0.55], [0, 0, 0], 0.8],
      ]),
    view: { el: 0.4, az: 0.12, zoom: 1.08 },
  },
  {
    id: 'm-ikili',
    build: () =>
      compose([
        [lyingWrap('adana', 1), [-0.45, 0, -0.35]],
        [lyingWrap('urfa', 2), [-0.3, 0, 0.6]],
        [friesOcak(), [1.2, 0, -0.55], [0, 0.3, 0], 1.1],
        [K.ayranBowl(), [1.25, 0, 0.45], [0, 0, 0], 0.75],
        [K.ayranBowl(), [1.95, 0, 0.05], [0, 0, 0], 0.75],
      ]),
    view: { el: 0.45, az: 0.1, zoom: 1.08 },
  },
  { id: 'y-patates', build: () => friesOcak(), view: { el: 0.35, az: 0.5, zoom: 1.05 } },
  { id: 'y-koz', build: () => DM.charredPlate(), view: { el: 0.6, az: 0.3, zoom: 1.2 } },
  { id: 'y-sogan', build: () => DM.onionSalad(), view: { el: 0.62, az: 0.3, zoom: 1.2 } },
  { id: 'i-ayran', build: () => K.ayranBowl(), view: { el: 0.42, az: 0.3, zoom: 1.12 } },
  {
    id: 'i-salgam',
    build: () =>
      compose([
        [K.tumbler({ h: 0.95, r: 0.27, liquid: '#5b0e2d' }), [-0.25, 0, 0]],
        [K.tumbler({ h: 0.95, r: 0.27, liquid: '#5b0e2d' }), [0.4, 0, -0.3]],
      ]),
    view: { el: 0.3, az: 0.3, zoom: 1.05 },
  },
  { id: 't-kunefe', build: () => DM.kunefe(), view: { el: 0.55, az: 0.3, zoom: 1.2 } },
];

export default {
  id: 'durum-butik',
  fonts: ['800 40px "Big Shoulders Display Variable"', '600 20px "Instrument Sans Variable"'],
  opts: {
    env: { warmth: 0.4 },
    lights: { key: '#fff4e6', keyI: 2.5, rim: '#ffffff', rimI: 0.8 },
    envIntensity: 0.85,
    shadowOpacity: 0.3,
    fov: 26,
  },
  studio: { inner: '#fbfaf6', outer: '#fbfaf6', shadow: 0.28, zoom: 1, ao: 0.85 },
  items: items.map((it) => (it.alpha ? it : { w: 720, h: 540, ...it })),
};
