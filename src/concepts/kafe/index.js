import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as M from './models.js';
import { build } from './scene.js';
import { icon } from '../../core/icons.js';

// ---------------------------------------------------------------------------
// Seçenek grupları
// ---------------------------------------------------------------------------
const seker = {
  id: 'seker',
  title: 'Şeker',
  type: 'single',
  ask: true,
  default: 'orta',
  choices: [
    { id: 'sade', label: 'Sade' },
    { id: 'az', label: 'Az şekerli' },
    { id: 'orta', label: 'Orta' },
    { id: 'sekerli', label: 'Şekerli' },
  ],
};

const turkEkstra = {
  id: 'ekstra',
  title: 'Ekstralar',
  type: 'multi',
  choices: [
    { id: 'duble', label: 'Duble', price: 35 },
    { id: 'sakiz', label: 'Damla sakızlı', price: 10 },
  ],
};

const boy = {
  id: 'boy',
  title: 'Boy',
  type: 'single',
  default: 'kucuk',
  choices: [
    { id: 'kucuk', label: 'Küçük', hideInSummary: true },
    { id: 'orta', label: 'Orta', price: 15 },
    { id: 'buyuk', label: 'Büyük', price: 25 },
  ],
};

const sut = {
  id: 'sut',
  title: 'Süt',
  type: 'single',
  default: 'normal',
  choices: [
    { id: 'normal', label: 'Normal süt', hideInSummary: true },
    { id: 'laktozsuz', label: 'Laktozsuz', price: 10 },
    { id: 'yulaf', label: 'Yulaf sütü', price: 20 },
  ],
};

const surup = {
  id: 'surup',
  title: 'Şurup',
  type: 'multi',
  max: 2,
  choices: [
    { id: 'karamel', label: 'Karamel', price: 15 },
    { id: 'vanilya', label: 'Vanilya', price: 15 },
    { id: 'findik', label: 'Fındık', price: 15 },
  ],
};

const shot = {
  id: 'shot',
  title: 'Ekstra',
  type: 'multi',
  choices: [{ id: 'shot', label: 'Ekstra shot', price: 20 }],
};

const milkDrink = [boy, sut, surup, shot];

// ---------------------------------------------------------------------------
// Menü
// ---------------------------------------------------------------------------
const categories = [
  {
    id: 'geleneksel',
    name: 'Türk Kahvesi & Çay',
    note: 'Türk kahvesi su ve lokumla servis edilir.',
    products: [
      {
        id: 'k-turk',
        name: 'Türk Kahvesi',
        desc: 'Bakır cezvede, ağır ateşte pişer. Yanında su ve lokum.',
        long: 'Taze çekilmiş çekirdek, bakır cezvede ağır ateşte, köpüğü bozulmadan pişer. Bir bardak su ve lokumla gelir.',
        price: 75,
        tags: [{ text: 'Çok satan', kind: 'hot' }],
        options: [seker, turkEkstra],
        thumb: { kind: 'turk' },
      },
      {
        id: 'k-dibek',
        name: 'Dibek Kahvesi',
        desc: 'Taşta dövülmüş, daha yumuşak ve kremamsı içim.',
        long: 'Dibek taşında dövülerek hazırlanan kahvemiz, sütün yumuşaklığıyla birleşir. Daha hafif, daha kremamsı bir fincan.',
        price: 85,
        options: [seker],
        thumb: { kind: 'turk', pattern: 'sage' },
      },
      {
        id: 'c-cay',
        name: 'Çay',
        desc: 'İnce belli bardakta, taze demlenmiş.',
        long: 'Rize çayı, demliğinde dinlenir ve ince belli bardakta, tavşan kanı renginde servis edilir.',
        price: 20,
        options: [
          {
            id: 'dem',
            title: 'Dem',
            type: 'single',
            default: 'demli',
            choices: [
              { id: 'acik', label: 'Açık' },
              { id: 'demli', label: 'Demli' },
              { id: 'koyu', label: 'Koyu' },
            ],
          },
        ],
        thumb: { kind: 'tea' },
      },
      {
        id: 'c-demlik',
        name: 'Demlik Çay',
        desc: 'Dört bardaklık demlik. Sohbet uzun sürecekse.',
        long: 'Çaydanlığıyla masanıza gelen dört bardaklık taze çay. Uzun sohbetlerin en iyi eşlikçisi.',
        price: 75,
        thumb: { kind: 'demlik' },
      },
      {
        id: 'c-bitki',
        name: 'Bitki Çayı',
        desc: 'Ihlamur, adaçayı, kuşburnu ya da yeşil çay.',
        long: 'Kış akşamlarının vazgeçilmezi: ıhlamur, adaçayı, kuşburnu ya da yeşil çay. Bir dilim limonla.',
        price: 60,
        options: [
          {
            id: 'tur',
            title: 'Çeşit',
            type: 'single',
            ask: true,
            default: 'ihlamur',
            choices: [
              { id: 'ihlamur', label: 'Ihlamur' },
              { id: 'adacayi', label: 'Adaçayı' },
              { id: 'kusburnu', label: 'Kuşburnu' },
              { id: 'yesil', label: 'Yeşil çay' },
            ],
          },
        ],
        thumb: { kind: 'herbal' },
      },
    ],
  },
  {
    id: 'espresso',
    name: 'Espresso Bar',
    note: 'Laktozsuz ve yulaf sütü seçeneğimiz var.',
    products: [
      {
        id: 'e-espresso',
        name: 'Espresso',
        desc: 'Yoğun, kısa ve dolgun bir shot.',
        price: 70,
        options: [{ id: 'tip', title: 'Tercih', type: 'single', default: 'tek', choices: [{ id: 'tek', label: 'Tek shot', hideInSummary: true }, { id: 'double', label: 'Double shot', price: 20 }] }],
        thumb: { kind: 'espresso' },
      },
      {
        id: 'e-americano',
        name: 'Americano',
        desc: 'Espresso ve sıcak su; sade ve dengeli.',
        price: 90,
        options: [boy, shot],
        thumb: { kind: 'latte', top: 'dark', glaze: '#7d8c66' },
      },
      {
        id: 'e-latte',
        name: 'Caffè Latte',
        desc: 'Espresso, buharla ısıtılmış süt ve ince süt köpüğü.',
        price: 110,
        tags: [{ text: 'Favori', kind: 'hot' }],
        options: milkDrink,
        thumb: { kind: 'latte', top: 'heart' },
      },
      {
        id: 'e-cappuccino',
        name: 'Cappuccino',
        desc: 'Bol süt köpüğü, üzerinde kakao.',
        price: 110,
        options: milkDrink,
        thumb: { kind: 'latte', top: 'foam', glaze: '#b95d3b', inner: '#f6efe4' },
      },
      {
        id: 'e-flatwhite',
        name: 'Flat White',
        desc: 'Double ristretto ve kadifemsi süt.',
        price: 115,
        options: [sut],
        thumb: { kind: 'latte', top: 'tulip', size: 0.85 },
      },
      {
        id: 'e-mocha',
        name: 'Mocha',
        desc: 'Espresso, Belçika çikolatası ve süt.',
        price: 125,
        options: milkDrink,
        thumb: { kind: 'mug', top: 'choco', color: '#b95d3b' },
      },
      {
        id: 'e-filtre',
        name: 'Filtre Kahve',
        desc: 'Günün çekirdeğiyle, sade.',
        price: 95,
        options: [boy],
        thumb: { kind: 'mug', top: 'dark', color: '#7d8c66' },
      },
    ],
  },
  {
    id: 'soguk',
    name: 'Soğuk İçecekler',
    products: [
      {
        id: 's-icelatte',
        name: 'Ice Latte',
        desc: 'Buz, süt ve espresso; katman katman.',
        price: 125,
        options: [sut, surup],
        thumb: { kind: 'iceLatte' },
      },
      {
        id: 's-coldbrew',
        name: 'Cold Brew',
        desc: '18 saat soğuk demlenmiş, yumuşak içimli.',
        price: 120,
        thumb: { kind: 'coldBrew' },
      },
      {
        id: 's-limonata',
        name: 'Ev Yapımı Limonata',
        desc: 'Taze sıkılmış limon ve nane.',
        price: 85,
        tags: [{ text: 'Ev yapımı', kind: 'green' }],
        thumb: { kind: 'lemonade' },
      },
      {
        id: 's-milkshake',
        name: 'Milkshake',
        desc: 'Çilekli, çikolatalı ya da vanilyalı.',
        price: 130,
        options: [
          {
            id: 'tat',
            title: 'Tat',
            type: 'single',
            ask: true,
            default: 'cilek',
            choices: [
              { id: 'cilek', label: 'Çilekli' },
              { id: 'cikolata', label: 'Çikolatalı' },
              { id: 'vanilya', label: 'Vanilyalı' },
            ],
          },
        ],
        thumb: { kind: 'shake' },
      },
    ],
  },
  {
    id: 'sicak',
    name: 'Sıcak Klasikler',
    products: [
      {
        id: 'h-sahlep',
        name: 'Sahlep',
        desc: 'Bol tarçınlı, kış akşamlarının sıcacık dostu.',
        price: 100,
        thumb: { kind: 'mug', top: 'cinnamon', color: '#b95d3b' },
      },
      {
        id: 'h-cikolata',
        name: 'Sıcak Çikolata',
        desc: 'Yoğun Belçika çikolatası ve süt.',
        price: 110,
        thumb: { kind: 'mug', top: 'choco', color: '#7d8c66' },
      },
    ],
  },
  {
    id: 'tatlilar',
    name: 'Tatlılar',
    note: 'Tüm tatlılarımız her gün kendi mutfağımızda hazırlanır.',
    products: [
      {
        id: 't-sansebastian',
        name: 'San Sebastian Cheesecake',
        desc: 'Yanık üstü, yumuşacık içi. Günün en çok sorulanı.',
        long: 'Yüksek ısıda pişirilen, üstü karamelize, içi kremamsı San Sebastian. İsterseniz Belçika çikolatası sosuyla.',
        price: 165,
        tags: [{ text: 'Çok satan', kind: 'hot' }],
        dealTag: 'Günün tatlısı',
        options: [{ id: 'sos', title: 'Sos', type: 'multi', choices: [{ id: 'cikolata', label: 'Çikolata sosu', price: 20 }] }],
        thumb: { kind: 'cheesecake' },
      },
      {
        id: 't-brownie',
        name: 'Sıcak Brownie',
        desc: 'Islak brownie, yanında bir top dondurma.',
        price: 140,
        options: [{ id: 'dondurma', title: 'Yanında', type: 'single', default: 'var', choices: [{ id: 'var', label: 'Dondurmalı', hideInSummary: true }, { id: 'yok', label: 'Dondurmasız' }] }],
        thumb: { kind: 'brownie' },
      },
      {
        id: 't-kruvasan',
        name: 'Tereyağlı Kruvasan',
        desc: 'Kat kat, çıtır; sade ya da çikolatalı.',
        price: 95,
        options: [{ id: 'tur', title: 'Çeşit', type: 'single', default: 'sade', choices: [{ id: 'sade', label: 'Sade' }, { id: 'cikolatali', label: 'Çikolatalı', price: 15 }] }],
        thumb: { kind: 'croissant' },
      },
      {
        id: 't-lokum',
        name: 'Lokum Tabağı',
        desc: 'Güllü, fıstıklı ve sade lokumlar.',
        price: 60,
        thumb: { kind: 'lokum' },
      },
    ],
  },
  {
    id: 'atistirmalik',
    name: 'Kahvaltı & Atıştırmalık',
    note: 'Kahvaltı tabağı 08.00–12.00 arasında servis edilir.',
    products: [
      {
        id: 'a-kahvalti',
        name: 'Kahvaltı Tabağı',
        desc: 'Beyaz peynir, zeytin, domates, salatalık, bal, yumurta ve simit.',
        long: 'Güne güzel bir başlangıç: beyaz peynir, siyah zeytin, domates, salatalık, bal, sahanda ya da haşlanmış yumurta ve taze simit. Yanında bir bardak çay.',
        price: 240,
        dealTag: 'Sabahın yıldızı',
        options: [
          {
            id: 'yumurta',
            title: 'Yumurta',
            type: 'single',
            default: 'sahanda',
            choices: [
              { id: 'sahanda', label: 'Sahanda' },
              { id: 'haslanmis', label: 'Haşlanmış' },
            ],
          },
        ],
        thumb: { kind: 'breakfast' },
      },
      {
        id: 'a-tost',
        name: 'Kaşarlı Tost',
        desc: 'Tam buğday ekmeğinde bol kaşar.',
        price: 110,
        thumb: { kind: 'toast' },
      },
      {
        id: 'a-karisik',
        name: 'Karışık Tost',
        desc: 'Sucuk ve kaşar, çıtır çıtır.',
        price: 140,
        thumb: { kind: 'toast', mixed: true },
      },
      {
        id: 'a-simit',
        name: 'Simit',
        desc: 'Bol susamlı, günlük taze.',
        price: 25,
        thumb: { kind: 'simit' },
      },
    ],
  },
  {
    id: 'menuler',
    name: 'Menüler',
    products: [
      {
        id: 'm-sabah',
        name: 'Sabah Keyfi',
        desc: 'Simit, beyaz peynir ve bir bardak çay.',
        long: 'Ereğli sabahlarının klasiği: taze simit, bir dilim beyaz peynir ve ince belli bardakta demli çay.',
        price: 75,
        dealTag: 'Sabahlara özel',
        thumb: { kind: 'sabah' },
      },
      {
        id: 'm-ikili',
        name: 'İki Fincan Hatır',
        desc: 'İki Türk kahvesi ve lokum tabağı.',
        long: 'Bir fincan kahvenin kırk yıl hatırı vardır; iki fincanın hatırını siz düşünün. İki Türk kahvesi ve lokum tabağı.',
        price: 165,
        dealTag: 'İkiye özel',
        options: [{ ...seker, title: 'Şeker (iki fincan için)' }],
        thumb: { kind: 'ikili' },
      },
      {
        id: 'm-ders',
        name: 'Ders Molası',
        desc: 'Filtre kahve ve sıcak brownie.',
        long: 'Sınav haftasında, ödev arasında, uzun bir okuma gününde: filtre kahve ve sıcak brownie.',
        price: 205,
        dealTag: 'Öğrenciye özel',
        thumb: { kind: 'ders' },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Ürün görselleri
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
  const cupView = { el: 0.42, az: 0.4 };
  switch (t.kind) {
    case 'turk':
      return {
        build: () => {
          const g = M.turkishCoffeeFull();
          if (t.pattern) {
            g.clear();
            g.add(M.saucer({ r: 0.46, rim: '#7d8c66' }));
            const f = M.fincan({ pattern: t.pattern });
            f.position.y = 0.045;
            f.rotation.y = -0.6;
            g.add(f);
          }
          return g;
        },
        view: cupView,
      };
    case 'tea':
      return { build: () => M.teaSet(), view: { el: 0.32, az: 0.4 } };
    case 'demlik':
      return {
        build: () =>
          compose([
            [M.caydanlik(), [-0.35, 0, -0.1]],
            [M.teaSet(), [0.6, 0, 0.35], [0, 0, 0], 0.8],
          ]),
        view: { el: 0.32, az: 0.35 },
      };
    case 'herbal':
      return { build: () => M.herbalTea(), view: { el: 0.4, az: 0.4 } };
    case 'espresso':
      return {
        build: () => {
          const g = new THREE.Group();
          g.add(M.saucer({ r: 0.38 }));
          const f = M.fincan({ pattern: 'cream', foam: false, scale: 0.9 });
          f.position.y = 0.045;
          f.rotation.y = -0.6;
          const crema = new THREE.Mesh(new THREE.CircleGeometry(0.22, 40), K.std({ color: '#8a5a32', roughness: 0.6 }));
          crema.rotation.x = -Math.PI / 2;
          crema.position.y = 0.42 * 0.9 + 0.045;
          g.add(f, crema);
          return g;
        },
        view: cupView,
      };
    case 'latte':
      return { build: () => M.latteCup({ top: t.top, glaze: t.glaze || '#efe6d8', inner: t.inner || '#f8f2e8', size: t.size || 1 }), view: cupView };
    case 'mug':
      return { build: () => M.mug({ top: t.top, color: t.color }), view: { el: 0.42, az: 0.5 } };
    case 'iceLatte':
      return {
        build: () =>
          M.tallGlass({
            layers: [
              { c: '#efe3d0', h: 0.55 },
              { c: '#8a5530', h: 0.45 },
            ],
            extras: (g, { h }) => {
              const s = M.straw(1.0);
              s.position.set(0.08, h * 0.75, 0);
              s.rotation.z = -0.15;
              g.add(s);
            },
          }),
        view: { el: 0.28, az: 0.4 },
      };
    case 'coldBrew':
      return { build: () => M.tallGlass({ layers: [{ c: '#3a1f0e', h: 1, e: '#1a0800' }], ice: 5 }), view: { el: 0.28, az: 0.4 } };
    case 'lemonade':
      return {
        build: () =>
          M.tallGlass({
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
        view: { el: 0.28, az: 0.4 },
      };
    case 'shake':
      return {
        build: () =>
          M.tallGlass({
            layers: [{ c: '#f2a0b0', h: 1 }],
            ice: 0,
            extras: (g, { h }) => {
              const w = M.whippedCream(0.25);
              w.position.y = h * 0.86;
              g.add(w);
              const s = M.straw(1.1, '#f2a0b0');
              s.position.set(0.1, h * 0.95, 0);
              s.rotation.z = -0.2;
              g.add(s);
            },
          }),
        view: { el: 0.28, az: 0.4 },
      };
    case 'cheesecake':
      return { build: () => M.cheesecake(), view: { el: 0.5, az: 0.6 } };
    case 'brownie':
      return { build: () => M.brownie(), view: { el: 0.5, az: 0.4 } };
    case 'croissant':
      return {
        build: () => compose([[K.plate({ r: 0.75, color: '#f8f1e6', rimColor: '#b95d3b' })], [M.croissant(), [0, 0.05, 0.25]]]),
        view: { el: 0.55, az: 0.3 },
      };
    case 'lokum':
      return { build: () => M.lokumPlate(), view: { el: 0.6, az: 0.3 } };
    case 'breakfast':
      return { build: () => M.breakfastPlate(), view: { el: 0.75, az: 0.25 } };
    case 'toast':
      return { build: () => M.toast({ mixed: !!t.mixed }), view: { el: 0.6, az: 0.3 } };
    case 'simit':
      return { build: () => compose([[M.simit()]]), view: { el: 0.7, az: 0.3 } };
    case 'sabah':
      return {
        build: () =>
          compose([
            [M.teaSet(), [0.55, 0, -0.15], [0, 0, 0], 0.9],
            [M.simit(), [-0.45, 0.12, 0.2], [0, 0, 0.12], 1.05],
            [new THREE.Mesh(K.roundedBox(0.36, 0.13, 0.26, 0.02, 2), K.std({ color: '#fbf9f2', roughness: 0.75 })), [-0.35, 0.08, -0.45]],
          ]),
        view: { el: 0.42, az: 0.35 },
      };
    case 'ikili':
      return {
        build: () =>
          compose([
            [M.turkishCoffeeSet(), [-0.5, 0, 0]],
            [M.turkishCoffeeSet(), [0.5, 0, -0.35], [0, 1.2, 0]],
            [M.lokum({ color: '#c6d79a' }), [0.1, 0.1, 0.6], [0, 0.4, 0], 0.7],
          ]),
        view: { el: 0.4, az: 0.3 },
      };
    case 'ders':
      return {
        build: () =>
          compose([
            [M.mug({ top: 'dark', color: '#7d8c66' }), [0.55, 0, -0.2]],
            [M.brownie(), [-0.35, 0, 0.15], [0, 0, 0], 0.8],
          ]),
        view: { el: 0.42, az: 0.35 },
      };
    default:
      return { build: () => M.turkishCoffeeSet(), view: cupView };
  }
}

// ---------------------------------------------------------------------------
// Konsept
// ---------------------------------------------------------------------------
export default {
  id: 'kafe',
  meta: {
    title: 'Dem Telve Kahve Evi · Konya Ereğli | Online Sipariş',
    description:
      'Ereğli’de demli çay, bakır cezvede Türk kahvesi, espresso bazlı kahveler, kahvaltı ve ev yapımı tatlılar. Online sipariş verin ya da gelin oturun.',
  },
  brand: {
    name: 'Dem Telve',
    full: 'Dem Telve Kahve Evi',
    orderPrefix: 'DMT',
    backdropWord: 'telve',
    badgeText: 'KIRK YIL HATIR • DEM TELVE • EREĞLİ • ',
    badgeIcon: icon.cup,
  },
  stageOpts: { lights: { key: '#fff0dc', keyI: 2.1, rim: '#ffffff', rimI: 1.1 }, envIntensity: 0.95 },
  thumbOpts: { lights: { key: '#fff3e2', keyI: 2.1, rim: '#ffffff', rimI: 1 }, envIntensity: 1, shadowOpacity: 0.28 },
  backdrop: {
    glows: [
      { x: '52%', y: '10%', size: '44vw', color: '#f0cfa4', opacity: 0.65 },
      { x: '72%', y: '50%', size: '34vw', color: '#e2b7a0', opacity: 0.4 },
      { x: '-8%', y: '60%', size: '30vw', color: '#cdd6bf', opacity: 0.55 },
    ],
  },
  nav: [
    { href: '#menu', label: 'Menü' },
    { href: '#fincan', label: 'Hikâyemiz' },
    { href: '#kampanyalar', label: 'Kampanyalar' },
    { href: '#iletisim', label: 'Bize ulaşın' },
  ],
  hours: { open: '08:00', close: '23:30', label: 'Haftanın her günü', extra: 'Kahvaltı 08.00–12.00' },
  delivery: { min: 150, fee: 20, freeOver: 350, eta: '20–30 dk', pickupEta: '5–10 dk', pickupDiscount: 0 },
  contact: {
    phoneDisplay: '0 (332) 000 00 00',
    phoneNote: 'Telefonla da sipariş alıyoruz. 8 kişiyi aşan gruplar için bir gün önceden yer ayırtabilirsiniz.',
    whatsapp: '',
    address: 'Ereğli Merkez, Konya',
    addressNote: 'Kapımızı açacağımız adres çok yakında burada.',
    mapsQuery: 'Ereğli, Konya',
  },
  emptyCart: 'Fincanınız henüz boş. Bir Türk kahvesiyle başlamaya ne dersiniz?',
  hero: {
    eyebrow: 'Konya Ereğli · Kahve & Çay Evi',
    titleLines: ['Kırk yıllık', '<em>hatırın</em>', 'ilk yudumu.'],
    text: 'Bir fincan kahvenin kırk yıl hatırı vardır. Dem Telve’de çay demini, kahve telvesini bulur; sohbet de kendiliğinden demlenir.',
    ctaPrimary: 'Sipariş ver',
    ctaSecondary: 'Fincanın hikâyesi',
    chips: [
      { icon: 'bean', text: 'Taze kavrulmuş çekirdek' },
      { icon: 'heart', text: 'Ev yapımı tatlılar' },
      { icon: 'wifi', text: 'Ücretsiz Wi-Fi' },
    ],
  },
  marquee: {
    icon: icon.bean,
    a: ['Demli çay', 'Bakır cezvede Türk kahvesi', 'Taze kavrum', 'Ev yapımı tatlılar'],
    b: ['Çay', 'Türk kahvesi', 'Latte', 'Sahlep', 'Simit', 'Lokum'],
  },
  story: {
    id: 'fincan',
    eyebrow: 'Fincanın hikâyesi',
    title: 'Çekirdekten <em>telveye</em>',
    steps: [
      { label: 'Çekirdek', title: 'Özenle seçilir', text: 'Çekirdeklerimizi güvendiğimiz üreticilerden, henüz yeşilken seçiyoruz. Her çuvalı tadına bakarak alırız.' },
      { label: 'Kavrum', title: 'Rengini ateşte bulur', text: 'Küçük partiler hâlinde kavrulan çekirdek, yeşilden kahverengiye dönerken aromasını da ortaya çıkarır.' },
      { label: 'Cezve', title: 'Ağır ateşte pişer', text: 'Taze çekilen kahve, bakır cezvede ağır ateşte pişer. Köpüğü, acele etmeyenlere görünür.' },
      { label: 'Sunum', title: 'Yanında su ve lokum', text: 'Fincan, bir bardak su ve lokumla gelir. Sohbeti de siz getirin.' },
    ],
  },
  deals: {
    eyebrow: 'Kampanyalar',
    title: 'Günün her saatine <em>bir mola</em>',
    text: 'Sabah simidinden akşam sohbetine, ders arasından tatlı molasına kadar sizin için hazırladığımız menüler.',
    items: ['m-sabah', 'm-ikili', 'm-ders', 'a-kahvalti', 't-sansebastian'],
  },
  menu: {
    eyebrow: 'Menü',
    title: 'Ne <em>içersiniz?</em>',
    text: 'Kahvenizin şekerini, sütünü ve boyunu seçin; gerisini baristalarımıza bırakın.',
    categories,
  },
  values: {
    eyebrow: 'Neden Dem Telve?',
    title: 'Küçük ayrıntılar, <em>büyük hatır</em>',
    items: [
      { icon: 'bean', title: 'Taze kavrum', text: 'Çekirdeklerimizi küçük partiler hâlinde kavurur, taze taze demleriz.' },
      { icon: 'heart', title: 'Ev yapımı tatlılar', text: 'Cheesecake’ten brownie’ye tüm tatlılarımızı her gün kendi mutfağımızda hazırlarız.' },
      { icon: 'book', title: 'Sessiz çalışma köşesi', text: 'Ücretsiz Wi-Fi, priz ve sakin bir köşe. Ders çalışmak isteyenlere kapımız açık.' },
      { icon: 'family', title: 'Aile dostu', text: 'Mama sandalyesi, geniş masalar ve sıcak bir ortam. Her yaştan misafirimize uygun.' },
    ],
  },
  local: {
    eyebrow: 'Ereğli’nin sohbet köşesi',
    title: 'İvriz’den Akgöl’e, <em>sohbet</em> burada demlenir',
    paragraphs: [
      'Toros eteklerindeki bu güzel şehirde, sabah kahvaltısından akşam sohbetine kadar kapımız herkese açık.',
      'Aileler, öğrenciler, eski dostlar... Herkesin bir köşesi, herkesin bir fincanı var. Ve tabii, bir fincan kahvenin hatırı.',
    ],
  },
  faq: {
    eyebrow: 'Merak edilenler',
    title: 'Sık sorulan <em>sorular</em>',
    text: 'Aklınıza takılan başka bir şey olursa sipariş hattımızdan bize ulaşabilirsiniz.',
    items: [
      { q: 'Kahvaltı servisiniz var mı?', a: 'Her gün 08.00 ile 12.00 arasında kahvaltı tabağı servis ediyoruz. Paket servisle de sipariş verebilirsiniz.' },
      { q: 'Bitki bazlı süt seçeneğiniz var mı?', a: 'Laktozsuz süt ve yulaf sütü seçeneklerimiz var. Sipariş verirken süt tercihinizi işaretlemeniz yeterli.' },
      { q: 'Ders çalışmak için uygun mu?', a: 'Ücretsiz Wi-Fi, priz ve sessiz bir çalışma köşemiz var. Sınav dönemlerinde akşamları da sakin bir ortam sunuyoruz.' },
      { q: 'Doğum günü ya da toplantı için yer ayırtabilir miyim?', a: 'Elbette. 8 kişiyi aşan gruplar için sipariş hattımızdan bir gün önceden yer ayırtabilirsiniz.' },
      { q: 'Paket servis hangi bölgelere yapılıyor?', a: 'Ereğli merkez ve yakın mahallelere paket servis yapıyoruz. En az sepet tutarı 150 TL; 350 TL ve üzeri siparişlerde teslimat ücretsizdir.' },
      { q: 'Türk kahvesini paket serviste nasıl gönderiyorsunuz?', a: 'Köpüğünü koruyan kapaklı bardakta, suyu ve lokumuyla birlikte gönderiyoruz.' },
    ],
  },
  cta: {
    title: 'Demlik hazır, <em>fincan sıcak.</em>',
    text: 'İster gelin oturun, ister biz getirelim. Siparişiniz ortalama 25 dakikada kapınızda.',
    button: 'Hemen sipariş ver',
  },
  footer: {
    about: 'Dem Telve, Konya Ereğli’de demli çay, bakır cezvede Türk kahvesi, espresso bazlı kahveler ve ev yapımı tatlılar sunan bir kahve evidir.',
  },
  scene: { build },
  thumb,
};
