import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as P from '../premium/models.js';
import * as KM from '../kafe/models.js';
import { premiumShowcase } from '../../three/showcase.js';

// ---------------------------------------------------------------------------
// Seçenekler
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

const sut = {
  id: 'sut',
  title: 'Süt',
  type: 'single',
  default: 'normal',
  choices: [
    { id: 'normal', label: 'Tam yağlı süt', hideInSummary: true },
    { id: 'laktozsuz', label: 'Laktozsuz', price: 10 },
    { id: 'yulaf', label: 'Yulaf sütü', price: 25 },
  ],
};

const cekirdek = {
  id: 'cekirdek',
  title: 'Çekirdek',
  type: 'single',
  default: 'etiyopya',
  choices: [
    { id: 'etiyopya', label: 'Etiyopya · çiçeksi, narenciye' },
    { id: 'kolombiya', label: 'Kolombiya · karamel, fındık' },
  ],
};

// ---------------------------------------------------------------------------
// Menü
// ---------------------------------------------------------------------------
const categories = [
  {
    id: 'turk',
    name: 'Türk Kahvesi',
    note: 'Su ve lokum ikramımızdır.',
    products: [
      {
        id: 'k-turk',
        name: 'Bakır Cezvede Türk Kahvesi',
        desc: 'Ağır ateşte, köpüğü sabırla kabaran.',
        long: 'Taze çekilmiş kahve, kalaylı bakır cezvede ağır ateşte pişer. Pirinç tepside, bir bardak su ve lokumla gelir.',
        price: 95,
        tags: [{ text: 'İmza' }],
        dealTag: 'İmza',
        options: [seker, { id: 'ekstra', title: 'Ekstra', type: 'multi', choices: [{ id: 'sakiz', label: 'Damla sakızlı', price: 10 }, { id: 'duble', label: 'Duble', price: 45 }] }],
        thumb: { kind: 'turk' },
      },
      {
        id: 'k-dibek',
        name: 'Dibek Kahvesi',
        desc: 'Taşta dövülmüş, yumuşak ve kremamsı.',
        price: 105,
        options: [seker],
        thumb: { kind: 'turkSage' },
      },
      {
        id: 'k-menengic',
        name: 'Menengiç',
        desc: 'Sütle pişen, kendine has aromalı.',
        price: 105,
        options: [seker],
        thumb: { kind: 'turkSage' },
      },
    ],
  },
  {
    id: 'demleme',
    name: 'El Demleme',
    note: 'Tek kökenli çekirdeklerle, siparişle demlenir.',
    products: [
      { id: 'f-v60', name: 'V60', desc: 'Berrak ve dengeli bir fincan.', price: 140, options: [cekirdek], dealTag: 'Haftanın çekirdeği', thumb: { kind: 'filter' } },
      { id: 'f-chemex', name: 'Chemex · 2 kişilik', desc: 'Paylaşmak için temiz ve hafif.', price: 240, options: [cekirdek], thumb: { kind: 'filter' } },
      { id: 'f-coldbrew', name: 'Cold Brew', desc: '18 saat soğuk demlenmiş.', price: 150, thumb: { kind: 'coldBrew' } },
    ],
  },
  {
    id: 'espresso',
    name: 'Espresso',
    products: [
      { id: 'e-espresso', name: 'Espresso', desc: 'Kısa, yoğun, dolgun.', price: 85, thumb: { kind: 'espresso' } },
      { id: 'e-cortado', name: 'Cortado', desc: 'Espresso ve az miktar ılık süt.', price: 110, options: [sut], thumb: { kind: 'cup', top: 'tulip', size: 0.8 } },
      { id: 'e-flatwhite', name: 'Flat White', desc: 'Double ristretto, kadifemsi süt.', price: 130, options: [sut], thumb: { kind: 'cup', top: 'rosetta', size: 0.9 } },
      { id: 'e-latte', name: 'Latte', desc: 'Espresso, süt ve ince köpük.', price: 135, options: [sut], thumb: { kind: 'cup', top: 'heart' } },
    ],
  },
  {
    id: 'cay',
    name: 'Çay',
    products: [
      { id: 'c-ince', name: 'İnce Belli Çay', desc: 'Taze demlenmiş, tavşan kanı.', price: 25, thumb: { kind: 'tea' } },
      { id: 'c-demlik', name: 'Demlik Çay', desc: 'Dört bardaklık demlik.', price: 95, thumb: { kind: 'demlik' } },
      { id: 'c-ihlamur', name: 'Ihlamur', desc: 'Bir dilim limonla.', price: 90, thumb: { kind: 'herbal' } },
    ],
  },
  {
    id: 'tatli',
    name: 'Tatlılar',
    note: 'Günlük, kendi mutfağımızda.',
    products: [
      {
        id: 't-sansebastian',
        name: 'San Sebastian',
        desc: 'Yanık üstü, kremamsı içi.',
        price: 190,
        dealTag: 'Günün tatlısı',
        thumb: { kind: 'cheesecake' },
      },
      { id: 't-baklava', name: 'Fıstıklı Baklava · 3 dilim', desc: 'Antep fıstığı, ince yufka, hafif şerbet.', price: 210, thumb: { kind: 'baklava' } },
      { id: 't-lokum', name: 'Lokum Seçkisi', desc: 'Güllü, fıstıklı, sade.', price: 95, thumb: { kind: 'lokum' } },
    ],
  },
  {
    id: 'kahvalti',
    name: 'Kahvaltı',
    note: '08.00–12.00 arasında.',
    products: [
      {
        id: 'k-kahvalti',
        name: 'Sükûn Kahvaltısı',
        desc: 'Beyaz peynir, zeytin, bal, yumurta, domates, salatalık ve simit.',
        long: 'Yavaş bir sabah için: beyaz peynir, siyah zeytin, süzme bal, sahanda yumurta, domates, salatalık ve taze simit. Yanında demli çay.',
        price: 340,
        options: [{ id: 'yumurta', title: 'Yumurta', type: 'single', default: 'sahanda', choices: [{ id: 'sahanda', label: 'Sahanda' }, { id: 'haslanmis', label: 'Haşlanmış' }] }],
        thumb: { kind: 'breakfast' },
      },
      { id: 'k-simit', name: 'Simit ve Peynir', desc: 'Taze simit, beyaz peynir ve bir bardak çay.', price: 95, thumb: { kind: 'simit' } },
    ],
  },
];

// ---------------------------------------------------------------------------
// Ürün fotoğrafları
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

function filterCup() {
  const g = new THREE.Group();
  g.add(KM.saucer({ r: 0.5, rim: '#c9a96a' }));
  const c = KM.latteCup({ top: 'dark', glaze: '#f4f1ec', inner: '#f8f6f2', saucerOn: false });
  c.position.y = 0.045;
  g.add(c);
  return g;
}

function thumb(p) {
  const t = p.thumb || {};
  const cupView = { el: 0.36, az: 0.4, zoom: 1.15 };
  switch (t.kind) {
    case 'turk':
      return { build: () => P.porcelainSet(), view: cupView };
    case 'turkSage':
      return {
        build: () => {
          const g = new THREE.Group();
          g.add(KM.saucer({ r: 0.46, rim: '#7f8a74' }));
          const f = KM.fincan({ pattern: 'sage' });
          f.position.y = 0.045;
          f.rotation.y = -0.7;
          g.add(f);
          return g;
        },
        view: cupView,
      };
    case 'filter':
      return { build: () => filterCup(), view: cupView };
    case 'coldBrew':
      return { build: () => KM.tallGlass({ layers: [{ c: '#3a1f0e', h: 1, e: '#1a0800' }], ice: 5 }), view: { el: 0.24, az: 0.4 } };
    case 'espresso':
      return {
        build: () => {
          const g = new THREE.Group();
          g.add(KM.saucer({ r: 0.36, rim: '#c9a96a' }));
          const f = KM.fincan({ pattern: 'porcelain', foam: false, scale: 0.85, handleColor: '#f6f3ee' });
          f.position.y = 0.045;
          f.rotation.y = -0.7;
          const crema = new THREE.Mesh(new THREE.CircleGeometry(0.21, 40), K.std({ color: '#8a5a32', roughness: 0.55 }));
          crema.rotation.x = -Math.PI / 2;
          crema.position.y = 0.42 * 0.85 + 0.045;
          g.add(f, crema);
          return g;
        },
        view: cupView,
      };
    case 'cup':
      return { build: () => KM.latteCup({ top: t.top, glaze: '#f4f1ec', inner: '#f8f6f2', size: t.size || 1 }), view: cupView };
    case 'tea':
      return { build: () => KM.teaSet(), view: { el: 0.26, az: 0.4 } };
    case 'demlik':
      return { build: () => compose([[KM.caydanlik(), [-0.35, 0, -0.1]], [KM.teaSet(), [0.6, 0, 0.35], [0, 0, 0], 0.8]]), view: { el: 0.3, az: 0.35 } };
    case 'herbal':
      return { build: () => KM.herbalTea(), view: { el: 0.36, az: 0.4, zoom: 1.1 } };
    case 'cheesecake':
      return { build: () => KM.cheesecake(), view: { el: 0.45, az: 0.6, zoom: 1.3 } };
    case 'baklava':
      return { build: () => P.baklava(), view: { el: 0.5, az: 0.3, zoom: 1.3 } };
    case 'lokum':
      return { build: () => KM.lokumPlate(), view: { el: 0.5, az: 0.3, zoom: 1.3 } };
    case 'breakfast':
      return { build: () => KM.breakfastPlate(), view: { el: 0.6, az: 0.25, zoom: 1.3 } };
    case 'simit':
      return {
        build: () =>
          compose([
            [KM.simit(), [-0.35, 0.12, 0.15]],
            [KM.teaSet(), [0.55, 0, -0.25], [0, 0, 0], 0.85],
            [new THREE.Mesh(K.roundedBox(0.36, 0.13, 0.26, 0.02, 2), K.std({ color: '#fbf9f2', roughness: 0.75 })), [-0.25, 0.07, -0.5]],
          ]),
        view: { el: 0.4, az: 0.35, zoom: 1.15 },
      };
    default:
      return { build: () => P.porcelainSet(), view: cupView };
  }
}

// ---------------------------------------------------------------------------
// 3D sahne
// ---------------------------------------------------------------------------
function build({ stage, gsap, ScrollTrigger }) {
  const tray = P.sukunTray();
  const steamA = K.steam({ count: 16, w: 0.2, h: 1.1, size: 200, opacity: 0.4, color: '#ffffff' });
  steamA.position.set(0.12, 0.6, 0.05);
  tray.add(steamA);

  const cez = P.cezveOnTray();
  const steamB = K.steam({ count: 14, w: 0.18, h: 1.0, size: 190, opacity: 0.38 });
  steamB.position.set(0, 0.65, 0);
  cez.add(steamB);

  const serve = P.porcelainSet();
  const steamC = K.steam({ count: 14, w: 0.18, h: 1.0, size: 180, opacity: 0.38 });
  steamC.position.set(-0.03, 0.55, 0);
  serve.add(steamC);

  return premiumShowcase({
    stage,
    gsap,
    ScrollTrigger,
    hero: tray,
    chapters: [P.beanDish(), cez, serve],
    heroSize: 3.3,
    chapterSize: 2.3,
    heroTilt: 0.44,
    shadow: 0.22,
  });
}

// ---------------------------------------------------------------------------
// Konsept
// ---------------------------------------------------------------------------
export default {
  id: 'kafe-premium',
  tier: 'premium',
  meta: {
    title: 'Sükûn Kahve Evi · Konya Ereğli',
    description: 'Bakır cezvede Türk kahvesi, el demlemeleri, demli çay ve günlük tatlılar. Ereğli’de sakin bir kahve evi; online sipariş ve gel-al.',
  },
  brand: { name: 'Sükûn', full: 'Sükûn Kahve Evi', orderPrefix: 'SKN' },
  stageOpts: { background: '#ece8e1', env: { warmth: 0.45 }, shadows: true, lights: { key: '#fff4e6', keyI: 2.4, rim: '#ffffff', rimI: 0.8 }, envIntensity: 0.85, fov: 28 },
  thumbOpts: {
    env: { warmth: 0.45 },
    width: 640,
    height: 800,
    studio: { inner: '#eeeae3', outer: '#d1c9bd', shadow: 0.28, zoom: 1 },
    lights: { key: '#fff4e6', keyI: 2.4, rim: '#ffffff', rimI: 0.9 },
    envIntensity: 0.9,
    shadowOpacity: 0.35,
  },
  nav: [
    { href: '#menu', label: 'Menü' },
    { href: '#ustalik', label: 'Ustalık' },
    { href: '#secki', label: 'Seçki' },
    { href: '#iletisim', label: 'Ziyaret' },
  ],
  hours: { open: '08:00', close: '23:00', label: 'Haftanın her günü', extra: 'Kahvaltı 08.00–12.00' },
  delivery: { min: 200, fee: 25, freeOver: 450, eta: '25–35 dk', pickupEta: '10 dk', pickupDiscount: 0 },
  contact: {
    phoneDisplay: '0 (332) 000 00 00',
    phoneNote: 'Kalabalık buluşmalar için bir gün önceden yer ayırtabilirsiniz.',
    whatsapp: '',
    address: 'Ereğli Merkez, Konya',
    addressNote: 'Kapımızı açacağımız adres çok yakında burada.',
    mapsQuery: 'Ereğli, Konya',
  },
  emptyCart: 'Sepetiniz boş. Bir Türk kahvesiyle başlayabilirsiniz.',
  hero: {
    eyebrow: 'Konya Ereğli · Kahve Evi',
    titleLines: ['Acele', '<em>etmeyenlere.</em>'],
    text: 'Bakır cezvede Türk kahvesi, el demlemeleri ve demli çay. Sessiz bir köşe, iyi bir fincan ve kendinize ayırdığınız birkaç dakika.',
    ctaPrimary: 'Sipariş ver',
    ctaSecondary: 'Ustalık',
  },
  manifesto: {
    kicker: 'Sükûn',
    text: 'Bir fincan kahvenin acele kaldırmadığını bilenler için açıldık. Çekirdeği özenle seçer, ağır ateşte pişirir, sessizce sunarız. Gerisi sizin ve sohbetinizin.',
    sign: 'Sükûn Kahve Evi, Konya Ereğli',
  },
  chapters: {
    id: 'ustalik',
    kicker: 'Ustalık',
    title: 'Bir fincanın <em>üç durağı</em>',
    items: [
      { title: 'Seçilmiş çekirdek', text: 'Çekirdeklerimizi küçük kavurma evlerinden, kavrum tarihini görerek alırız. Her hafta taze.', note: 'Haftalık taze kavrum' },
      { title: 'Bakır cezve', text: 'Türk kahvesi, bakır cezvede ve ağır ateşte pişer. Köpüğü sabırla kabarır, telvesi fincanda dinlenir.', note: 'Kalaylı bakır cezve' },
      { title: 'Pirinç tepside sunum', text: 'Fincan, bir bardak su ve lokumla gelir. Bu küçük ritüelin kendisi bir moladır.', note: 'Su ve lokum ikramımızdır' },
    ],
  },
  signature: {
    kicker: 'Seçki',
    title: 'Barın <em>seçkisi</em>',
    text: 'Baristamızın bu hafta önerdikleri.',
  },
  deals: { items: ['k-turk', 'f-v60', 't-sansebastian', 'k-kahvalti'] },
  menu: {
    eyebrow: 'Menü',
    title: 'Kahve, çay <em>ve dahası</em>',
    text: 'Şekerini, sütünü ve çekirdeğini siz seçin.',
    categories,
  },
  visit: {
    kicker: 'Ziyaret',
    title: 'Bir <em>köşeniz</em> hazır',
    paragraphs: [
      'Kitabınızı, bilgisayarınızı ya da sohbetinizi getirin. Sessiz masalarımız, priz ve ücretsiz Wi-Fi sizi bekliyor.',
      'Ereğli merkez ve yakın mahallelere paket servisimiz de var.',
    ],
  },
  faq: {
    eyebrow: 'Sorular',
    title: 'Merak <em>edilenler</em>',
    items: [
      { q: 'Kahvaltı servisiniz var mı?', a: 'Her gün 08.00 ile 12.00 arasında Sükûn Kahvaltısı servis ediyoruz; paket servisle de sipariş verebilirsiniz.' },
      { q: 'Bitki bazlı süt seçeneğiniz var mı?', a: 'Laktozsuz süt ve yulaf sütü seçeneklerimiz var. Sipariş verirken tercihinizi işaretlemeniz yeterli.' },
      { q: 'Çalışmak için uygun mu?', a: 'Sessiz bir bölümümüz, priz ve ücretsiz Wi-Fi var. Yoğun saatlerde bile sakin bir köşe bulabilirsiniz.' },
      { q: 'Türk kahvesini paket serviste nasıl gönderiyorsunuz?', a: 'Köpüğünü koruyan kapaklı bardakta, suyu ve lokumuyla birlikte gönderiyoruz.' },
      { q: 'Paket servis hangi bölgelere yapılıyor?', a: 'Ereğli merkez ve yakın mahallelere. En az sepet tutarı 200 TL; 450 TL ve üzeri siparişlerde teslimat ücretsizdir.' },
    ],
  },
  cta: {
    title: 'Bir fincanlık <em>mola.</em>',
    text: 'İster gelin oturun, ister kapınıza getirelim.',
    button: 'Menüyü incele',
  },
  footer: {
    about: 'Sükûn, Konya Ereğli’de bakır cezvede Türk kahvesi, el demlemeleri ve günlük tatlılar sunan sakin bir kahve evidir.',
  },
  scene: { build },
  thumb,
};
