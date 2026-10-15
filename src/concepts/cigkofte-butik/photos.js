import * as THREE from 'three';
import * as K from '../../three/kit.js';
import { rng } from '../../three/textures.js';
import * as CM from '../cigkofte/models.js';
import * as KM from '../kafe/models.js';

// Yalnızca tools/foto.html kullanır: İsot'un ürün fotoğraflarını kâğıt zeminde üretir.
// Site bu dosyayı yüklemez; çıktılar public/foto/cigkofte-butik altında.

const RED = '#b8222b';
const wrapOf = (o = {}) => K.wrap({ paper: 'isot', filling: 'cigkofte', ...o });
const ayran = () => K.ayranCup({ bg: '#f4f6ee', ink: RED, title: 'AYRAN', sub: 'isot' });
const tubLabel = { bg: RED, ink: '#f4f6ee', title: 'isot', sub: 'ÇİĞ KÖFTE', font: 'Anybody Variable', weight: 900, stretch: 'extra-expanded', subFont: 'Atkinson Hyperlegible Next Variable' };

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

const wrapView = { el: 0.42, az: 0.55, zoom: 1.12 };

// Çiğ köfte tabağının klasik dizilişi: marul yatağında, merkeze bakan sıkımlar
function radialPlate({ pieces = 8, seed = 3 } = {}) {
  const g = new THREE.Group();
  const r = rng(seed);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.25;
    const l = K.leaf({ w: 1.0, h: 1.55, cup: 0.16, ruffle: 0.09, curl: 0.1, seed: i * 3 + 1, tone: i % 2 ? 'lettuce' : 'gobek' });
    l.rotation.set(-Math.PI / 2 + 0.1, 0, a + Math.PI);
    l.position.set(Math.sin(a) * 0.62, 0.02 + i * 0.012, Math.cos(a) * 0.62);
    g.add(l);
  }
  for (let i = 0; i < pieces; i++) {
    const b = (i / pieces) * Math.PI * 2;
    const k = CM.kofte({ len: 0.7, rad: 0.165, seed: seed + i });
    k.position.set(Math.sin(b) * 0.7, 0.2, Math.cos(b) * 0.7);
    k.rotation.set(0, b - Math.PI / 2 + (r() - 0.5) * 0.25, (r() - 0.5) * 0.12);
    g.add(k);
  }
  const lemon = K.citrusSlice({ r: 0.26, t: 0.05 });
  lemon.position.set(0.05, 0.16, 0.02);
  lemon.rotation.set(0.12, 0, 0.08);
  g.add(lemon);
  const s1 = K.seeds({ count: 18, radius: 0.24, size: 0.045, flat: true, seed });
  s1.position.set(-0.12, 0.2, -0.18);
  g.add(s1);
  const mint = K.sprig({ tone: 'mint', leaves: 5, size: 0.22, seed: seed + 2 });
  mint.position.set(0.18, 0.24, -0.1);
  mint.rotation.set(1.3, 0, 0.6);
  g.add(mint);
  return g;
}

const items = [
  // Hero: tabaksız, marul yatağında köfteler. Renkli zemine oturması için şeffaf.
  {
    id: 'hero',
    w: 960,
    h: 960,
    alpha: true,
    build: () => radialPlate({ pieces: 8, seed: 4 }),
    view: { el: 1.16, az: 0.2, zoom: 1.32, shadowScale: 0.9, shadowOpacity: 0.2 },
  },
  {
    id: 'sikim',
    w: 900,
    h: 900,
    build: () => {
      const g = new THREE.Group();
      const l = K.leaf({ w: 1.5, h: 2.2, cup: 0.16, ruffle: 0.04, curl: 0.06, seed: 6 });
      l.rotation.set(-Math.PI / 2 + 0.08, 0, 2.6);
      g.add(l);
      const k = CM.kofte({ len: 1.3, rad: 0.32, seed: 5 });
      k.position.set(0, 0.36, 0);
      k.rotation.set(0, 0.5, 0);
      g.add(k);
      return g;
    },
    view: { el: 0.5, az: 0.65, zoom: 1.3 },
  },
  { id: 'd-klasik', build: () => compose([[wrapOf({ seed: 1 }), [0, 0, 0], [0, 0, -0.42]]]), view: wrapView },
  {
    id: 'd-cevizli',
    build: () =>
      compose([
        [wrapOf({ seed: 2 }), [-0.2, 0.95, 0], [0, 0, -0.32]],
        [K.seeds({ count: 16, radius: 0.22, size: 0.05, flat: true, seed: 3 }), [0.7, 0.03, 0.5]],
      ]),
    view: wrapView,
  },
  {
    id: 'd-citir',
    build: () =>
      compose([
        [wrapOf({ seed: 3 }), [0, 0, 0], [0, 0, -0.42]],
        [CM.chips(9), [0.42, 0.92, 0], [0, 0, -0.42]],
      ]),
    view: wrapView,
  },
  {
    id: 'd-duble',
    build: () =>
      compose([
        [wrapOf({ seed: 1 }), [-0.42, 0, 0], [0, 0, -0.3]],
        [wrapOf({ seed: 3 }), [0.48, -0.1, 0.25], [0, 0.6, 0.18]],
      ]),
    view: { el: 0.4, az: 0.4 },
  },
  { id: 't-porsiyon', build: () => CM.servingPlate({ pieces: 6, rim: RED, seed: 2 }), view: { el: 0.78, az: 0.3, zoom: 1.08 } },
  {
    id: 'p-yarim',
    build: () =>
      compose([
        [CM.tub({ scale: 1, label: tubLabel }), [-0.25, 0, 0]],
        [CM.lavasStack(), [0.95, 0, 0.55], [0, 0.3, 0], 0.55],
        [K.citrusSlice({ r: 0.2, t: 0.05 }), [0.95, 0.06, -0.25], [0.1, 0, 0]],
      ]),
    view: { el: 0.55, az: 0.4 },
  },
  {
    id: 'p-kilo',
    build: () =>
      compose([
        [CM.tub({ scale: 1, label: tubLabel }), [-0.45, 0, -0.35]],
        [CM.tub({ scale: 1, label: tubLabel }), [0.35, 0, 0.45], [0, 0.5, 0]],
        [CM.lavasStack(), [1.35, 0, -0.4], [0, 0.3, 0], 0.6],
      ]),
    view: { el: 0.55, az: 0.4 },
  },
  {
    id: 'm-ogrenci',
    build: () =>
      compose([
        [wrapOf({ seed: 1 }), [-0.35, 0.95, 0], [0, 0, -0.32]],
        [ayran(), [0.55, 0, 0.2], [0, -0.4, 0], 1.35],
      ]),
    view: { el: 0.36, az: 0.35 },
  },
  {
    id: 'm-ikili',
    build: () =>
      compose([
        [wrapOf({ seed: 1, radius: 0.46 }), [-0.75, 0.95, 0], [0, 0, -0.3]],
        [wrapOf({ seed: 2, radius: 0.46 }), [0.0, 0.95, -0.45], [0, 0.4, -0.1]],
        [ayran(), [0.75, 0, 0.3], [0, -0.4, 0], 1.3],
        [ayran(), [-0.2, 0, 0.75], [0, 0.6, 0], 1.3],
        [CM.pickleBowl(), [1.25, 0, -0.55], [0, 0, 0], 0.5],
      ]),
    view: { el: 0.4, az: 0.35 },
  },
  { id: 'y-tursu', build: () => CM.pickleBowl(), view: { el: 0.78, az: 0.3, zoom: 1.1 } },
  { id: 'y-garnitur', build: () => CM.garnishSet(), view: { el: 0.78, az: 0.3, zoom: 1.05 } },
  { id: 'y-lavas', build: () => CM.lavasStack(), view: { el: 0.8, az: 0.3, zoom: 1.1 } },
  { id: 'i-ayran', build: () => ayran(), view: { el: 0.42, az: 0.4, zoom: 0.92 } },
  {
    id: 'i-salgam',
    build: () =>
      compose([
        [K.tumbler({ h: 0.95, r: 0.27, liquid: '#5b0e2d' })],
        [K.citrusSlice({ r: 0.12, t: 0.04, kind: 'lemon' }), [0.22, 0.95, 0], [0, 0, 1.3]],
      ]),
    view: { el: 0.34, az: 0.4, zoom: 0.92 },
  },
  {
    id: 'i-limonata',
    build: () =>
      KM.tallGlass({
        layers: [{ c: '#f2d46a', h: 1, e: '#5a4500' }],
        ice: 4,
        extras: (g, { h, r }) => {
          const sl = K.citrusSlice({ r: 0.2, t: 0.04 });
          sl.position.set(r * 0.95, h - 0.05, 0);
          sl.rotation.set(0, 0, Math.PI / 2 - 0.3);
          g.add(sl);
          const mint = K.sprig({ tone: 'mint', leaves: 5, size: 0.2, seed: 3 });
          mint.position.set(-0.05, h - 0.15, 0);
          g.add(mint);
        },
      }),
    view: { el: 0.32, az: 0.4, zoom: 0.92 },
  },
];

export default {
  id: 'cigkofte-butik',
  fonts: ['900 40px "Anybody Variable"', '700 20px "Atkinson Hyperlegible Next Variable"', '800 40px "Bricolage Grotesque Variable"', '700 20px "Manrope Variable"'],
  opts: {
    env: { warmth: 0.45 },
    lights: { key: '#fff6ea', keyI: 2.4, rim: '#ffffff', rimI: 0.8 },
    envIntensity: 0.85,
    shadowOpacity: 0.32,
    fov: 26,
  },
  studio: { inner: '#f4f6ee', outer: '#f4f6ee', shadow: 0.26, zoom: 1, ao: 0.8 },
  items,
};
