import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as P from '../premium/models.js';
import * as CM from '../cigkofte/models.js';
import * as KM from '../kafe/models.js';
import { premiumShowcase } from '../../three/showcase.js';

// ---------------------------------------------------------------------------
// Seçenekler
// ---------------------------------------------------------------------------
const aci = {
  id: 'aci',
  title: 'Acı derecesi',
  type: 'single',
  default: 'orta',
  choices: [
    { id: 'hafif', label: 'Hafif' },
    { id: 'orta', label: 'Orta' },
    { id: 'acili', label: 'Acılı' },
    { id: 'ates', label: 'Ateş' },
  ],
};

const cikar = {
  id: 'cikar',
  title: 'Çıkarılsın',
  type: 'multi',
  choices: [
    { id: 'marul', label: 'Marulsuz' },
    { id: 'nane', label: 'Nanesiz' },
    { id: 'nar', label: 'Nar ekşisiz' },
  ],
};

const durumEkstra = {
  id: 'ekstra',
  title: 'Ekstralar',
  type: 'multi',
  choices: [
    { id: 'ceviz', label: 'İri çekilmiş ceviz', price: 25 },
    { id: 'kofte', label: 'Ekstra çiğ köfte (50 g)', price: 35 },
  ],
};

// ---------------------------------------------------------------------------
// Menü
// ---------------------------------------------------------------------------
const categories = [
  {
    id: 'tabaklar',
    name: 'Tabaklar',
    note: 'Tabaklar el açması lavaşla servis edilir.',
    products: [
      {
        id: 't-avuc',
        name: 'Avuç Tabağı',
        desc: 'Beş avuç çiğ köfte; göbek marul, nane, limon ve nar ekşisiyle.',
        long: 'Atölyenin imza tabağı. Günün yoğurmasından beş avuç çiğ köfte; göbek marul, taze nane, limon ve katkısız nar ekşisiyle, arduvaz tabakta.',
        price: 260,
        tags: [{ text: 'İmza' }],
        options: [aci, cikar],
        thumb: { kind: 'plate', pieces: 5 },
      },
      {
        id: 't-tadim',
        name: 'Tadım Tabağı',
        desc: 'Klasik, cevizli ve acı isotlu; üç çeşit, dokuz avuç.',
        long: 'Atölyenin üç yorumu tek tabakta: klasik, iri cevizli ve acı isotlu. Her birinden üçer avuç, yanında mevsim yeşillikleri.',
        price: 320,
        dealTag: 'Tadım',
        options: [cikar],
        thumb: { kind: 'plate', pieces: 5, seed: 9, tasting: true },
      },
      {
        id: 't-bahce',
        name: 'Bahçe Tabağı',
        desc: 'Roka, tere, taze soğan ve maydanozla bol yeşillikli.',
        long: 'Yeşilliği bol sevenler için: dört avuç çiğ köfte; roka, tere, taze soğan, maydanoz ve limonla.',
        price: 280,
        options: [aci],
        thumb: { kind: 'plate', pieces: 4, greens: true },
      },
    ],
  },
  {
    id: 'durumler',
    name: 'Dürümler',
    note: 'İnce el açması lavaşta.',
    products: [
      {
        id: 'd-avuc',
        name: 'Avuç Dürüm',
        desc: '120 g çiğ köfte, göbek marul, nane ve nar ekşisi.',
        long: '120 g çiğ köfte, göbek marul, taze nane ve nar ekşisi; ince el açması lavaşa sıkıca sarılır.',
        price: 140,
        options: [aci, cikar, durumEkstra],
        thumb: { kind: 'wrap', side: 'lemon' },
      },
      {
        id: 'd-cevizli',
        name: 'Cevizli Dürüm',
        desc: 'İri çekilmiş ceviz ve nar taneleriyle.',
        long: 'Çiğ köftenin içinde iri çekilmiş ceviz, üzerinde taze nar taneleri. Dokusu zengin, tadı derin.',
        price: 170,
        tags: [{ text: 'Yeni' }],
        dealTag: 'Yeni',
        options: [aci, cikar],
        thumb: { kind: 'wrapSeeds' },
      },
      {
        id: 'd-bahce',
        name: 'Bahçe Dürüm',
        desc: 'Roka, tere ve taze soğanla.',
        long: 'Çiğ köfte, roka, tere, taze soğan ve maydanoz; ferah, yeşil bir dürüm.',
        price: 155,
        options: [aci, cikar],
        thumb: { kind: 'wrap', seed: 3, side: 'greens', az: 0.35 },
      },
    ],
  },
  {
    id: 'paylasim',
    name: 'Paylaşmalık',
    note: 'Özel kutusunda; garnitür, lavaş ve nar ekşisiyle.',
    products: [
      {
        id: 'p-sofra-500',
        name: 'Sofra Kutusu · 500 g',
        desc: '3-4 kişilik; garnitür, 6 lavaş ve nar ekşisi.',
        price: 340,
        options: [aci],
        thumb: { kind: 'box' },
      },
      {
        id: 'p-sofra-1kg',
        name: 'Sofra Kutusu · 1 kg',
        desc: '6-8 kişilik; garnitür, 12 lavaş ve nar ekşisi.',
        long: 'Davetler, özel günler ve kalabalık sofralar için: 1 kg çiğ köfte, mevsim yeşillikleri, 12 el açması lavaş ve nar ekşisi.',
        price: 640,
        tags: [{ text: 'Davetler için' }],
        dealTag: 'Davetler için',
        options: [aci],
        thumb: { kind: 'boxBig' },
      },
    ],
  },
  {
    id: 'yaninda',
    name: 'Yanında',
    products: [
      { id: 'y-yesillik', name: 'Mevsim Yeşillikleri', desc: 'Göbek marul, roka, tere, nane ve limon.', price: 70, thumb: { kind: 'greens' } },
      { id: 'y-tursu', name: 'Ev Turşusu', desc: 'Acur, biber ve havuç; ev usulü.', price: 60, thumb: { kind: 'pickle' } },
      { id: 'y-lavas', name: 'El Açması Lavaş', desc: 'Üç adet.', price: 30, thumb: { kind: 'lavas' } },
    ],
  },
  {
    id: 'icecekler',
    name: 'İçecekler',
    products: [
      { id: 'i-ayran', name: 'Yayık Ayranı', desc: 'Köpüklü, bakır tasta.', price: 55, thumb: { kind: 'ayran' } },
      {
        id: 'i-salgam',
        name: 'Şalgam',
        desc: 'Acılı ya da acısız.',
        price: 55,
        options: [{ id: 'tur', title: 'Tercih', type: 'single', default: 'acili', choices: [{ id: 'acili', label: 'Acılı' }, { id: 'acisiz', label: 'Acısız' }] }],
        thumb: { kind: 'salgam' },
      },
      { id: 'i-limonata', name: 'Naneli Limonata', desc: 'Taze sıkılmış limon ve nane.', price: 80, thumb: { kind: 'lemonade' } },
    ],
  },
];

// ---------------------------------------------------------------------------
// Ürün fotoğrafları (stüdyo)
// ---------------------------------------------------------------------------
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

function thumb(p) {
  const t = p.thumb || {};
  switch (t.kind) {
    case 'plate':
      return {
        build: () => {
          const g = P.avucPlate({ pieces: t.pieces || 5, seed: t.seed || 2 });
          if (t.greens) {
            [
              [0.15, 0.8, 0.2, 'parsley'],
              [-0.45, 0.72, -0.4, 'mint'],
              [0.6, 0.66, 0.6, 'parsley'],
            ].forEach(([x, z, rz, tone], i) => {
              const sp = K.sprig({ tone, leaves: 7, size: 0.26, seed: 3 + i });
              sp.position.set(x, 0.12, z);
              sp.rotation.set(1.3, 0, rz);
              g.add(sp);
            });
          }
          if (t.tasting) {
            const w = P.walnutBowl();
            w.position.set(1.15, 0.07, -0.55);
            g.add(w);
            const iso = P.isotBowl();
            iso.scale.setScalar(0.42);
            iso.position.set(-1.2, 0.07, -0.5);
            g.add(iso);
          }
          return g;
        },
        view: { el: 0.5, az: 0.25, zoom: 1.32 },
      };
    case 'wrap':
      return {
        build: () => {
          const entries = [[P.avucWrap({ seed: t.seed || 1 }), [-0.15, 0.95, 0], [0, 0, -0.18]]];
          if (t.side === 'lemon') entries.push([P.lemonWedge({ r: 0.2, t: 0.05 }), [0.72, 0.03, 0.4], [0, -0.5, 0]]);
          if (t.side === 'greens') entries.push([K.sprig({ tone: 'parsley', leaves: 7, size: 0.24, seed: 4 }), [0.7, 0.08, 0.35], [1.25, 0, 0.3]]);
          return compose(entries);
        },
        view: { el: 0.24, az: t.az ?? 0.5, zoom: 1.05 },
      };
    case 'wrapSeeds':
      return {
        build: () =>
          compose([
            [P.avucWrap({ seed: 2 }), [-0.15, 0.95, 0], [0, 0, -0.18]],
            [K.seeds({ count: 16, radius: 0.22, size: 0.05, flat: true, seed: 3 }), [0.72, 0.03, 0.35]],
          ]),
        view: { el: 0.26, az: 0.6, zoom: 1.05 },
      };
    case 'box':
      return { build: () => P.avucBox(), view: { el: 0.42, az: 0.55, zoom: 1.2 } };
    case 'boxBig':
      return {
        build: () =>
          compose([
            [P.avucBox({ big: true }), [0, 0, 0]],
            [CM.lavasStack(), [1.15, 0, -0.55], [0, 0.4, 0], 0.55],
          ]),
        view: { el: 0.42, az: 0.5, zoom: 1.2 },
      };
    case 'greens':
      return {
        build: () => {
          const g = P.slatePlate({ r: 0.95 });
          [0, 1, 2].forEach((i) => {
            const l = K.leaf({ w: 0.9, h: 1.3, tone: i === 1 ? 'lettuce' : 'gobek', cup: 0.3, seed: i * 3 });
            l.rotation.set(-Math.PI / 2 + 0.2, 0, i * 1.4);
            l.position.set(Math.sin(i * 2) * 0.2, 0.1 + i * 0.03, Math.cos(i * 2) * 0.2);
            g.add(l);
          });
          const lw = P.lemonWedge({ r: 0.2, t: 0.05 });
          lw.position.set(0.55, 0.1, 0.4);
          lw.rotation.set(0, -0.5, 0);
          g.add(lw);
          const m = K.sprig({ tone: 'mint', leaves: 6, size: 0.22, seed: 2 });
          m.position.set(-0.45, 0.14, 0.35);
          m.rotation.set(1.2, 0, 0);
          g.add(m);
          return g;
        },
        view: { el: 0.55, az: 0.3, zoom: 1.3 },
      };
    case 'pickle':
      return { build: () => CM.pickleBowl(), view: { el: 0.5, az: 0.3, zoom: 1.25 } };
    case 'lavas':
      return { build: () => CM.lavasStack(), view: { el: 0.55, az: 0.3, zoom: 1.25 } };
    case 'ayran':
      return { build: () => K.ayranBowl(), view: { el: 0.38, az: 0.3, zoom: 1.2 } };
    case 'salgam':
      return { build: () => K.tumbler({ h: 0.95, r: 0.27, liquid: '#5b0e2d' }), view: { el: 0.24, az: 0.4 } };
    case 'lemonade':
      return {
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
        view: { el: 0.24, az: 0.4 },
      };
    default:
      return { build: () => P.avucPlate(), view: { el: 0.6, az: 0.3 } };
  }
}

// ---------------------------------------------------------------------------
// 3D sahne
// ---------------------------------------------------------------------------
function build({ stage, gsap, ScrollTrigger }) {
  const macro = new THREE.Group();
  const stone = P.slatePlate({ r: 0.72 });
  macro.add(stone);
  const k = P.kofte({ len: 1.25, rad: 0.32, seed: 5 });
  k.position.set(0, stone.userData.top + 0.3, 0);
  k.rotation.set(0, 0.35, 0);
  macro.add(k);
  return premiumShowcase({
    stage,
    gsap,
    ScrollTrigger,
    hero: P.avucPlate({ pieces: 5 }),
    chapters: [P.bulgurBowl(), P.isotBowl(), macro],
    heroSize: 3.3,
    chapterSize: 2.4,
    heroTilt: 0.5,
    shadow: 0.24,
  });
}

// ---------------------------------------------------------------------------
// Konsept
// ---------------------------------------------------------------------------
export default {
  id: 'cigkofte-premium',
  tier: 'premium',
  meta: {
    title: 'Avuç Çiğ Köfte Atölyesi · Konya Ereğli',
    description:
      'Taş değirmen bulguru, güneşte kurumuş isot ve katkısız nar ekşisiyle, her parçası avuçta şekillenen çiğ köfte. Ereğli’de online sipariş.',
  },
  brand: { name: 'Avuç', full: 'Avuç Çiğ Köfte Atölyesi', orderPrefix: 'AVC' },
  stageOpts: { shadows: true, lights: { key: '#fff3e4', keyI: 2.5, rim: '#ffffff', rimI: 0.7 }, envIntensity: 0.7, fov: 28 },
  thumbOpts: {
    width: 640,
    height: 800,
    studio: { inner: '#efe8dd', outer: '#d6ccbd', shadow: 0.3, zoom: 1 },
    lights: { key: '#fff3e4', keyI: 2.6, rim: '#ffffff', rimI: 0.8 },
    envIntensity: 0.75,
    shadowOpacity: 0.4,
  },
  nav: [
    { href: '#menu', label: 'Menü' },
    { href: '#ustalik', label: 'Ustalık' },
    { href: '#secki', label: 'Seçki' },
    { href: '#iletisim', label: 'Ziyaret' },
  ],
  hours: { open: '11:00', close: '23:00', label: 'Haftanın her günü' },
  delivery: { min: 250, fee: 30, freeOver: 500, eta: '30–40 dk', pickupEta: '15 dk', pickupDiscount: 0 },
  contact: {
    phoneDisplay: '0 (332) 000 00 00',
    phoneNote: 'Özel gün ve toplu siparişler için bir gün önceden arayın.',
    whatsapp: '',
    address: 'Ereğli Merkez, Konya',
    addressNote: 'Atölyemizin adresi çok yakında burada.',
    mapsQuery: 'Ereğli, Konya',
  },
  emptyCart: 'Sepetiniz boş. Atölyenin seçkisinden başlayabilirsiniz.',
  hero: {
    eyebrow: 'Konya Ereğli · Çiğ Köfte Atölyesi',
    titleLines: ['Avucun izi,', '<em>ustanın imzası.</em>'],
    text: 'Taş değirmende çekilmiş ince bulgur, güneşte kurumuş isot ve katkısız nar ekşisi. Her parça tek tek, elde ve avuçta şekillenir.',
    ctaPrimary: 'Sipariş ver',
    ctaSecondary: 'Ustalık',
  },
  manifesto: {
    kicker: 'Atölye',
    text: 'Çiğ köfteyi hiçbir zaman hızlı yemek sanmadık. Bir avuç bulgurun sabrını, isotun ateşini, ustanın elindeki ölçüyü bilenler için yoğuruyoruz. Az ama doğru; sade ama eksiksiz.',
    sign: 'Avuç Atölyesi, Konya Ereğli',
  },
  chapters: {
    id: 'ustalik',
    kicker: 'Ustalık',
    title: 'Üç malzeme, <em>bir avuç sabır</em>',
    items: [
      {
        title: 'Taş değirmen bulguru',
        text: 'Bulgurumuzu taş değirmende, en ince hâliyle çektiriyoruz. İnce bulgur isotla daha sabırlı, daha derin bir uyum kurar.',
        note: 'Konya ovası buğdayı',
      },
      {
        title: 'Güneşte kurumuş isot',
        text: 'İsot, Siverek’in güneşinde kurur ve terler. Acısı yakmaz, ısıtır; rengi koyu, kokusu derindir.',
        note: 'Şanlıurfa · Siverek',
      },
      {
        title: 'Avucun izi',
        text: 'Her parça ustanın avucunda sıkılır. Parmakların bıraktığı boğumlar, köftenin nar ekşisini ve yeşilliği tutmasını sağlar.',
        note: 'Her gün taze yoğrulur',
      },
    ],
  },
  signature: {
    kicker: 'Seçki',
    title: 'Ustanın <em>seçkisi</em>',
    text: 'Atölyenin en çok tercih edilen tabakları. Hepsi günün yoğurmasından, sipariş anında hazırlanır.',
  },
  deals: { items: ['t-avuc', 't-tadim', 'd-cevizli', 'p-sofra-1kg'] },
  menu: {
    eyebrow: 'Menü',
    title: 'Atölyenin <em>menüsü</em>',
    text: 'Acı derecesini ve garnitürleri siz belirleyin. Tüm tabaklar sipariş anında hazırlanır.',
    categories,
  },
  visit: {
    kicker: 'Ziyaret',
    title: 'Atölyeye <em>uğrayın</em>',
    paragraphs: [
      'Açık mutfağımızda çiğ köftenin nasıl yoğrulduğunu izleyebilir, taze yoğrulanından tadabilirsiniz.',
      'Ereğli merkez ve yakın mahallelere paket servisimiz var.',
    ],
  },
  faq: {
    eyebrow: 'Sorular',
    title: 'Merak <em>edilenler</em>',
    items: [
      { q: 'Çiğ köftenizde et var mı?', a: 'Hayır. Çiğ köftemiz etsizdir; ince bulgur, isot, salça, soğan, yeşillik ve baharatla hazırlanır.' },
      { q: 'Acı derecesini seçebilir miyim?', a: 'Evet. Sipariş verirken hafif, orta, acılı ve ateş seçeneklerinden birini işaretlemeniz yeterli.' },
      { q: 'Özel gün ve toplu sipariş alıyor musunuz?', a: 'Mevlit, nişan, toplantı ve davetler için kilogramlık siparişlerinizi bir gün önceden alıyoruz.' },
      { q: 'Paket servis hangi bölgelere yapılıyor?', a: 'Ereğli merkez ve yakın mahallelere. En az sepet tutarı 250 TL; 500 TL ve üzeri siparişlerde teslimat ücretsizdir.' },
      { q: 'Glutensiz seçeneğiniz var mı?', a: 'Bulgur buğdaydan yapıldığı için çiğ köftemiz gluten içerir; çölyak hastalarına önermiyoruz.' },
    ],
  },
  cta: {
    title: 'Bugün bir <em>avuç</em> sabır?',
    text: 'Siparişiniz günün yoğurmasından, sipariş anında hazırlanır.',
    button: 'Menüyü incele',
  },
  footer: {
    about: 'Avuç, Konya Ereğli’de taş değirmen bulguru ve güneşte kurumuş isotla her parçayı avuçta şekillendiren bir çiğ köfte atölyesidir.',
  },
  scene: { build },
  thumb,
};
