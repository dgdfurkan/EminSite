import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as M from './models.js';
import { build } from './scene.js';
import { icon } from '../../core/icons.js';

// ---------------------------------------------------------------------------
// Ortak seçenek grupları
// ---------------------------------------------------------------------------
const aci = {
  id: 'aci',
  title: 'Acı seviyesi',
  type: 'single',
  default: 'orta',
  choices: [
    { id: 'acisiz', label: 'Acısız' },
    { id: 'orta', label: 'Orta acı' },
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
    { id: 'maydanoz', label: 'Maydanozsuz' },
    { id: 'nar', label: 'Nar ekşisiz' },
    { id: 'limon', label: 'Limonsuz' },
  ],
};

const durumEkstra = {
  id: 'ekstra',
  title: 'Ekstralar',
  type: 'multi',
  choices: [
    { id: 'kofte', label: 'Ekstra çiğ köfte (50 g)', price: 25 },
    { id: 'cips', label: 'Mısır cipsi', price: 10 },
    { id: 'tursu', label: 'Acılı turşu', price: 10 },
    { id: 'nar', label: 'Ekstra nar ekşisi', price: 0 },
  ],
};

const lavas = {
  id: 'lavas',
  title: 'Lavaş',
  type: 'single',
  default: 'normal',
  choices: [
    { id: 'normal', label: 'Klasik lavaş', hideInSummary: true },
    { id: 'tam', label: 'Tam buğday lavaş', price: 10 },
  ],
};

const icecekSec = {
  id: 'icecek',
  title: 'İçecek',
  type: 'single',
  default: 'ayran',
  choices: [
    { id: 'ayran', label: 'Ayran' },
    { id: 'salgam', label: 'Şalgam' },
    { id: 'kutu', label: 'Kutu içecek', price: 15 },
  ],
};

// ---------------------------------------------------------------------------
// Menü
// ---------------------------------------------------------------------------
const categories = [
  {
    id: 'durumler',
    name: 'Dürümler',
    note: 'Her dürüm marul, maydanoz, limon ve nar ekşisiyle gelir.',
    products: [
      {
        id: 'd-klasik',
        name: 'Çiğ Köfte Dürüm',
        desc: '100 g çiğ köfte, marul, maydanoz ve nar ekşisi; ince lavaşa sarılı.',
        long: 'Yoğrum’un en sevilen lezzeti. 100 g taze yoğrulmuş çiğ köfte, çıtır marul, ince kıyılmış maydanoz ve ev yapımı nar ekşisi, ince lavaşta buluşur.',
        price: 90,
        tags: [{ text: 'Çok satan', kind: 'hot' }],
        options: [aci, lavas, cikar, durumEkstra],
        thumb: { kind: 'wrap' },
      },
      {
        id: 'd-mega',
        name: 'Mega Dürüm',
        desc: '150 g çiğ köfte ve bol yeşillik. Doyurucu bir öğün.',
        long: 'Klasik dürümden daha cömert: 150 g çiğ köfte, bol marul ve maydanoz, nar ekşisi. Öğle arası için tam kıvamında.',
        price: 115,
        options: [aci, lavas, cikar, durumEkstra],
        thumb: { kind: 'wrap', radius: 0.48 },
      },
      {
        id: 'd-citir',
        name: 'Çıtır Dürüm',
        desc: 'Klasik dürüme çıtır mısır cipsi eklenmiş hâli.',
        long: 'Yumuşak çiğ köftenin içinde çıtır mısır cipsi. Her ısırıkta iki farklı doku, gençlerin vazgeçilmezi.',
        price: 110,
        tags: [{ text: 'Yeni', kind: 'green' }],
        options: [aci, lavas, cikar, durumEkstra],
        thumb: { kind: 'wrapChips' },
      },
      {
        id: 'd-duble',
        name: 'Duble Dürüm',
        desc: 'Çift lavaş, 200 g çiğ köfte. Gerçekten acıkanlar için.',
        long: 'İki kat lavaşa sarılmış 200 g çiğ köfte, bol yeşillik ve nar ekşisi. Tek başına bir sofra.',
        price: 145,
        options: [aci, cikar, durumEkstra],
        thumb: { kind: 'wrapDouble' },
      },
    ],
  },
  {
    id: 'porsiyonlar',
    name: 'Porsiyonlar',
    note: 'Tabak servisler 2 lavaşla gelir.',
    products: [
      {
        id: 'p-porsiyon',
        name: 'Çiğ Köfte Porsiyon',
        desc: '200 g çiğ köfte; marul yatağında, limon ve nar ekşisiyle.',
        long: 'Avuçta sıkılmış 200 g çiğ köfte; marul yatağında, limon dilimleri, nar ekşisi ve 2 lavaşla tabakta servis edilir.',
        price: 160,
        options: [aci, cikar],
        thumb: { kind: 'plate' },
      },
      {
        id: 'p-yesil',
        name: 'Bol Yeşillikli Tabak',
        desc: '200 g çiğ köfte; göbek marul, nane, roka, turşu ve limonla.',
        long: 'Yeşilliği bol sevenler için: 200 g çiğ köfte, göbek marul, taze nane, roka, acılı turşu ve limon. Yanında 2 lavaş.',
        price: 185,
        tags: [{ text: 'Şefin önerisi' }],
        options: [aci],
        thumb: { kind: 'plateGreens' },
      },
    ],
  },
  {
    id: 'paketler',
    name: 'Paketler',
    note: 'Paketlere garnitür seti ve lavaş dahildir.',
    products: [
      {
        id: 'k-300',
        name: 'Küçük Paket · 300 g',
        desc: '2-3 kişilik. Garnitür seti ve 4 lavaş dahil.',
        long: 'İki ya da üç kişilik akşam sofraları için 300 g çiğ köfte. Marul, limon ve nar ekşisinden oluşan garnitür seti ile 4 lavaş dahildir.',
        price: 165,
        options: [aci],
        thumb: { kind: 'tub', scale: 0.85 },
      },
      {
        id: 'k-500',
        name: 'Orta Paket · 500 g',
        desc: '3-4 kişilik. Garnitür seti ve 6 lavaş dahil.',
        long: 'Kalabalık olmayan ev sofraları için ideal: 500 g çiğ köfte, garnitür seti ve 6 lavaş.',
        price: 260,
        options: [aci],
        thumb: { kind: 'tub', scale: 1 },
      },
      {
        id: 'k-1000',
        name: 'Aile Boyu · 1 kg',
        desc: '6-8 kişilik. Büyük garnitür seti ve 10 lavaş dahil.',
        long: 'Misafir sofralarının yıldızı. 1 kg çiğ köfte, büyük garnitür seti ve 10 lavaş. Kalabalık siparişler için bir gün önceden haber vermeniz yeterli.',
        price: 480,
        tags: [{ text: 'Aile boyu', kind: 'hot' }],
        dealTag: 'Misafir sofrası',
        options: [aci],
        thumb: { kind: 'tub', scale: 1.2 },
      },
    ],
  },
  {
    id: 'menuler',
    name: 'Menüler',
    note: 'Menülerde içeceği değiştirebilirsiniz.',
    products: [
      {
        id: 'm-ogrenci',
        name: 'Öğrenci Menüsü',
        desc: 'Çiğ köfte dürüm ve ayran. Öğrenci kartınızı göstermeniz yeterli.',
        long: 'Ders arasına, sınav haftasına, akşam yemeğine: çiğ köfte dürüm ve ayran, öğrenci dostu fiyatla. Teslimatta veya kasada öğrenci kartınızı göstermeniz yeterli.',
        price: 110,
        dealTag: 'Öğrenciye özel',
        options: [aci, icecekSec],
        thumb: { kind: 'menuSolo' },
      },
      {
        id: 'm-ikili',
        name: 'İkili Mega Menü',
        desc: '2 mega dürüm ve 2 ayran. Paylaşınca daha lezzetli.',
        long: 'İki mega dürüm ve iki ayran. Arkadaşınızla, eşinizle, iş arkadaşınızla paylaşmak için.',
        price: 270,
        dealTag: 'Paylaşmalık',
        options: [aci, icecekSec],
        thumb: { kind: 'menuDuo' },
      },
      {
        id: 'm-aile',
        name: 'Aile Menüsü',
        desc: '1 kg çiğ köfte, garnitür seti, 10 lavaş ve 1 litre ayran.',
        long: 'Bütün aileyi doyuran paket: 1 kg çiğ köfte, büyük garnitür seti, 10 lavaş ve 1 litre ayran. Hafta sonu sofraları için.',
        price: 550,
        dealTag: 'En avantajlı',
        options: [aci],
        thumb: { kind: 'menuFamily' },
      },
    ],
  },
  {
    id: 'yanlar',
    name: 'Yan Lezzetler',
    products: [
      {
        id: 'y-tursu',
        name: 'Acılı Turşu',
        desc: 'Ev usulü kurulmuş karışık turşu, küçük kase.',
        price: 35,
        thumb: { kind: 'pickle' },
      },
      {
        id: 'y-garnitur',
        name: 'Garnitür Seti',
        desc: 'Marul, nane, limon ve nar ekşisi.',
        price: 40,
        thumb: { kind: 'garnish' },
      },
      {
        id: 'y-lavas',
        name: 'Ekstra Lavaş',
        desc: '2 adet ince lavaş.',
        price: 15,
        thumb: { kind: 'lavas' },
      },
    ],
  },
  {
    id: 'icecekler',
    name: 'İçecekler',
    products: [
      {
        id: 'i-ayran',
        name: 'Ayran',
        desc: '300 ml, buz gibi.',
        price: 30,
        thumb: { kind: 'ayran' },
      },
      {
        id: 'i-ayran-l',
        name: 'Ayran · 1 L',
        desc: 'Aile sofraları için büyük boy.',
        price: 65,
        thumb: { kind: 'ayranBig' },
      },
      {
        id: 'i-salgam',
        name: 'Şalgam',
        desc: '300 ml; acılı ya da acısız.',
        price: 35,
        options: [
          {
            id: 'tur',
            title: 'Tercih',
            type: 'single',
            default: 'acili',
            choices: [
              { id: 'acili', label: 'Acılı' },
              { id: 'acisiz', label: 'Acısız' },
            ],
          },
        ],
        thumb: { kind: 'salgam' },
      },
      {
        id: 'i-kutu',
        name: 'Kutu İçecek',
        desc: '330 ml; kola, gazoz veya portakallı.',
        price: 45,
        options: [
          {
            id: 'tat',
            title: 'Tat',
            type: 'single',
            ask: true,
            default: 'kola',
            choices: [
              { id: 'kola', label: 'Kola' },
              { id: 'gazoz', label: 'Gazoz' },
              { id: 'portakal', label: 'Portakallı' },
            ],
          },
        ],
        thumb: { kind: 'can' },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Ürün görselleri (3D)
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
  const wrapView = { el: 0.32, az: 0.55 };
  switch (t.kind) {
    case 'wrap':
      return { build: () => compose([[M.yogrumWrap({ radius: t.radius || 0.42, seed: 1 }), [0, 0, 0], [0, 0, -0.42]]]), view: wrapView };
    case 'wrapChips':
      return {
        build: () =>
          compose([
            [M.yogrumWrap({ seed: 2 }), [0, 0, 0], [0, 0, -0.42]],
            [M.chips(9), [0.42, 0.92, 0], [0, 0, -0.42]],
          ]),
        view: wrapView,
      };
    case 'wrapDouble':
      return {
        build: () =>
          compose([
            [M.yogrumWrap({ seed: 1 }), [-0.42, 0, 0], [0, 0, -0.3]],
            [M.yogrumWrap({ seed: 3 }), [0.48, -0.1, 0.25], [0, 0.6, 0.18]],
          ]),
        view: { el: 0.3, az: 0.4 },
      };
    case 'plate':
      return { build: () => M.servingPlate({ pieces: 5 }), view: { el: 0.62, az: 0.3 } };
    case 'plateGreens':
      return {
        build: () =>
          compose([
            [M.servingPlate({ pieces: 4, seed: 7 })],
            [K.sprig({ tone: 'mint', leaves: 6, size: 0.26, seed: 5 }), [-0.35, 0.18, -0.45], [0.9, 0, 0.4]],
            [M.pickleBowl(), [0.95, 0, -0.75], [0, 0, 0], 0.55],
          ]),
        view: { el: 0.6, az: 0.3 },
      };
    case 'tub':
      // Otomatik kadrajlama boyut farkını siler; gramajı içerikle anlat
      if (t.scale < 1) return { build: () => compose([[M.tub({ scale: 1 })]]), view: { el: 0.55, az: 0.45 } };
      if (t.scale === 1)
        return {
          build: () =>
            compose([
              [M.tub({ scale: 1 }), [-0.25, 0, 0]],
              [M.lavasStack(), [0.95, 0, 0.55], [0, 0.3, 0], 0.55],
              [K.citrusSlice({ r: 0.2, t: 0.05 }), [0.95, 0.06, -0.25], [0.1, 0, 0]],
            ]),
          view: { el: 0.5, az: 0.4 },
        };
      return {
        build: () =>
          compose([
            [M.tub({ scale: 1 }), [-0.45, 0, -0.35]],
            [M.tub({ scale: 1 }), [0.35, 0, 0.45], [0, 0.5, 0]],
            [M.lavasStack(), [1.35, 0, -0.4], [0, 0.3, 0], 0.6],
          ]),
        view: { el: 0.5, az: 0.4 },
      };
    case 'menuSolo':
      return {
        build: () =>
          compose([
            [M.yogrumWrap({ seed: 1 }), [-0.35, 0.95, 0], [0, 0, -0.32]],
            [M.yogrumAyran(), [0.55, 0, 0.2], [0, -0.4, 0], 1.35],
          ]),
        view: { el: 0.28, az: 0.35 },
      };
    case 'menuDuo':
      return {
        build: () =>
          compose([
            [M.yogrumWrap({ seed: 1, radius: 0.48 }), [-0.75, 0.95, 0], [0, 0, -0.3]],
            [M.yogrumWrap({ seed: 2, radius: 0.48 }), [0.0, 0.95, -0.45], [0, 0.4, -0.1]],
            [M.yogrumAyran(), [0.75, 0, 0.3], [0, -0.4, 0], 1.3],
            [M.yogrumAyran(), [-0.2, 0, 0.75], [0, 0.6, 0], 1.3],
          ]),
        view: { el: 0.3, az: 0.35 },
      };
    case 'menuFamily':
      return {
        build: () =>
          compose([
            [M.tub({ scale: 1.15 }), [-0.3, 0, 0]],
            [M.yogrumAyran(true), [1.25, 0, -0.35], [0, -0.5, 0], 1.2],
            [M.lavasStack(), [0.4, 0, 1.0], [0, 0.4, 0], 0.7],
          ]),
        view: { el: 0.45, az: 0.4 },
      };
    case 'pickle':
      return { build: () => M.pickleBowl(), view: { el: 0.7, az: 0.3 } };
    case 'garnish':
      return { build: () => M.garnishSet(), view: { el: 0.7, az: 0.3 } };
    case 'lavas':
      return { build: () => M.lavasStack(), view: { el: 0.75, az: 0.3 } };
    case 'ayran':
      return { build: () => M.yogrumAyran(), view: { el: 0.38, az: 0.4 } };
    case 'ayranBig':
      return { build: () => M.yogrumAyran(true), view: { el: 0.38, az: 0.4 } };
    case 'salgam':
      return {
        build: () =>
          compose([
            [K.tumbler({ h: 0.95, r: 0.27, liquid: '#5b0e2d' })],
            [K.citrusSlice({ r: 0.12, t: 0.04, kind: 'lemon' }), [0.22, 0.95, 0], [0, 0, 1.3]],
          ]),
        view: { el: 0.3, az: 0.4 },
      };
    case 'can':
      return { build: () => K.sodaCan({ color: '#d7262f', title: 'BUZ GİBİ', sub: '330 ml' }), view: { el: 0.25, az: 0.2 } };
    default:
      return { build: () => M.yogrumWrap(), view: wrapView };
  }
}

// ---------------------------------------------------------------------------
// Konsept
// ---------------------------------------------------------------------------
export default {
  id: 'cigkofte',
  meta: {
    title: 'Yoğrum Çiğ Köfte · Konya Ereğli | Online Sipariş',
    description:
      'Ereğli’de her sabah taze yoğrulan etsiz çiğ köfte. Dürüm, porsiyon ve aile boyu paketleri online sipariş verin; kapınıza getirelim.',
  },
  brand: {
    name: 'Yoğrum',
    full: 'Yoğrum Çiğ Köfte',
    orderPrefix: 'YGR',
    backdropWord: 'çiğ köfte',
    badgeText: 'ELDE YOĞRULUR • GÖNÜLDEN SUNULUR • ',
    badgeIcon: icon.hand,
  },
  stageOpts: { lights: { key: '#fff1dc', keyI: 2.3, rim: '#ffe0c4', rimI: 1.2 }, envIntensity: 0.9 },
  thumbOpts: { lights: { key: '#fff3e2', keyI: 2.2, rim: '#ffffff', rimI: 1 }, envIntensity: 0.95, shadowOpacity: 0.3 },
  backdrop: {
    glows: [
      { x: '52%', y: '8%', size: '46vw', color: '#ffd2a8', opacity: 0.7 },
      { x: '70%', y: '45%', size: '36vw', color: '#ffb8a8', opacity: 0.45 },
      { x: '-8%', y: '62%', size: '30vw', color: '#d9efb9', opacity: 0.5 },
    ],
  },
  nav: [
    { href: '#menu', label: 'Menü' },
    { href: '#hikaye', label: 'Hikâyemiz' },
    { href: '#kampanyalar', label: 'Kampanyalar' },
    { href: '#iletisim', label: 'Şube' },
  ],
  hours: { open: '10:00', close: '23:00', label: 'Haftanın her günü' },
  delivery: { min: 150, fee: 20, freeOver: 300, eta: '25–35 dk', pickupEta: '10–15 dk', pickupDiscount: 0.1, pickupNote: 'Gel-al siparişlerinde %10 indirim.' },
  contact: {
    phoneDisplay: '0 (332) 000 00 00',
    phoneNote: 'Telefonla da sipariş alıyoruz. Toplu siparişler için bir gün önceden aramanız yeterli.',
    whatsapp: '',
    address: 'Ereğli Merkez, Konya',
    addressNote: 'Açılış adresimiz çok yakında burada.',
    mapsQuery: 'Ereğli, Konya',
  },
  emptyCart: 'Bir dürümle başlamaya ne dersiniz? Acı seviyesini siz seçin, gerisini bize bırakın.',
  hero: {
    eyebrow: 'Konya Ereğli · Etsiz çiğ köfte',
    titleLines: ['Elde yoğrulur,', '<em>gönülden</em>', 'sunulur.'],
    text: 'İnce bulgur, Urfa isotu ve ev yapımı nar ekşisi. Her sabah taze yoğrulan çiğ köftemizi dürümde, tabakta ya da aile boyu paketlerde kapınıza getiriyoruz.',
    ctaPrimary: 'Sipariş ver',
    ctaSecondary: 'Hikâyemizi keşfet',
    chips: [
      { icon: 'leaf', text: 'Etsiz, %100 bitkisel' },
      { icon: 'sparkle', text: 'Her sabah taze' },
      { icon: 'scooter', text: 'Ereğli içi paket servis' },
    ],
  },
  marquee: {
    a: ['Elde yoğrulur', 'Her sabah taze', 'Etsiz ve bitkisel', 'Ereğli’nin çiğ köftesi'],
    b: ['Acısız', 'Orta', 'Acılı', 'Ateş', 'Seçim sizin'],
  },
  story: {
    id: 'hikaye',
    eyebrow: 'Yoğrum’un sırrı',
    title: 'Bir avuç çiğ köftenin <em>yolculuğu</em>',
    steps: [
      {
        label: 'Buğday',
        title: 'Ovanın buğdayı',
        text: 'Her şey Konya ovasının buğdayıyla başlar. Bulgurumuzu en ince hâliyle seçer, ılık suyla dinlendiririz.',
      },
      {
        label: 'İsot',
        title: 'Ateşin rengi',
        text: 'Urfa isotu, acı biber salçası ve özenle seçilmiş baharatlar. Çiğ köfte rengini ve karakterini bu karışımdan alır.',
      },
      {
        label: 'Yoğurma',
        title: 'Sabrın lezzeti',
        text: 'Usta ellerde uzun uzun yoğrulur. Acele etmeyiz; çünkü doğru kıvam ancak sabırla gelir.',
      },
      {
        label: 'Sıkma',
        title: 'Avucun izi',
        text: 'Son dokunuş avuçta verilir. Her parçada ustanın parmak izi; yanında marul, limon ve nar ekşisi.',
      },
    ],
  },
  deals: {
    eyebrow: 'Kampanyalar',
    title: 'Cebinize de <em>dost</em> menüler',
    text: 'Öğrenciler, kalabalık sofralar ve paylaşmayı sevenler için hazırladığımız menüler. Fiyatlara içecek ve lavaş dahil.',
    items: ['m-ogrenci', 'm-ikili', 'k-1000', 'm-aile', 'd-citir'],
  },
  menu: {
    eyebrow: 'Menü',
    title: 'Bugün canınız <em>ne çekiyor?</em>',
    text: 'Ürüne dokunun, acı seviyesini ve ekstraları seçin, sepete ekleyin. Hepsi bu kadar.',
    categories,
  },
  values: {
    eyebrow: 'Neden Yoğrum?',
    title: 'Lezzetin arkasında <em>dört söz</em>',
    items: [
      { icon: 'sparkle', title: 'Her sabah taze', text: 'Çiğ köftemizi her sabah yeniden yoğururuz. Bir gün önceden kalan ürünü satmayız.' },
      { icon: 'leaf', title: 'Etsiz ve bitkisel', text: 'Bulgur, isot, salça, soğan, maydanoz ve baharat. Hepsi bu; içinde et yoktur.' },
      { icon: 'shield', title: 'Önce hijyen', text: 'Açık mutfak, eldivenli üretim ve her gün yenilenen tezgâh. İçiniz rahat olsun.' },
      { icon: 'flame', title: 'Acıyı siz seçin', text: 'Acısızdan ateşe dört seviye. Damak tadınıza göre hazırlıyoruz.' },
    ],
  },
  local: {
    eyebrow: 'Ereğli’den, Ereğli için',
    title: 'Bereket bu topraklarda <em>yoğrulur</em>',
    paragraphs: [
      'Yaklaşık 2.700 yıl önce kayaya işlenen İvriz Kabartması’nda bereket tanrısı Tarhunza, elinde buğday başakları ve üzüm salkımlarıyla durur.',
      'Biz de aynı bereketi, bu toprakların buğdayından yapılan bulgurla yoğuruyoruz. Ereğli’nin mahallelerine sıcak bir gülümsemeyle, taze taze.',
    ],
  },
  faq: {
    eyebrow: 'Merak edilenler',
    title: 'Sık sorulan <em>sorular</em>',
    text: 'Aklınıza takılan başka bir şey olursa sipariş hattımızdan bize ulaşabilirsiniz.',
    items: [
      { q: 'Çiğ köftenizde et var mı?', a: 'Hayır. Çiğ köftemiz tamamen etsizdir; ince bulgur, isot, salça, soğan, maydanoz ve baharatlarla hazırlanır.' },
      { q: 'Acı seviyesini seçebilir miyim?', a: 'Elbette. Ürünü sepete eklerken acısız, orta acı, acılı ve ateş seçeneklerinden birini işaretlemeniz yeterli.' },
      { q: 'Paket servis hangi bölgelere yapılıyor?', a: 'Ereğli merkez ve yakın mahallelere paket servis yapıyoruz. En az sepet tutarı 150 TL; 300 TL ve üzeri siparişlerde teslimat ücretsizdir.' },
      { q: 'Ödemeyi nasıl yapabilirim?', a: 'Kapıda nakit ya da kartla ödeyebilirsiniz. Gel-al siparişlerinde ödemeyi kasada yaparsınız ve %10 indirim kazanırsınız.' },
      { q: 'Mevlit, nişan, iş yeri gibi toplu siparişler alıyor musunuz?', a: 'Evet. Kilogramlık siparişleriniz için bir gün önceden haber vermeniz yeterli; garnitür ve lavaşı da biz hazırlarız.' },
      { q: 'Çölyak hastaları için uygun mu?', a: 'Bulgur buğdaydan yapıldığı için çiğ köftemiz gluten içerir. Çölyak hastalarına önermiyoruz.' },
    ],
  },
  cta: {
    title: 'Acıktınız mı? <em>Yoğrum</em> yolda.',
    text: 'Siparişinizi birkaç dokunuşla verin; çiğ köfteniz taze taze, ortalama 30 dakikada kapınızda.',
    button: 'Hemen sipariş ver',
  },
  footer: {
    about: 'Yoğrum, Konya Ereğli’de her sabah taze yoğrulan etsiz çiğ köfteyi dürümde, tabakta ve aile boyu paketlerde sunar.',
  },
  scene: { build },
  thumb,
};
