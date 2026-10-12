import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as T from '../../three/textures.js';
import * as P from '../premium/models.js';
import * as DM from '../durum/models.js';
import { premiumShowcase } from '../../three/showcase.js';

// ---------------------------------------------------------------------------
// Seçenekler
// ---------------------------------------------------------------------------
const aci = (def = 'acili') => ({
  id: 'aci',
  title: 'Acı derecesi',
  type: 'single',
  default: def,
  choices: [
    { id: 'acisiz', label: 'Acısız' },
    { id: 'az', label: 'Az acılı' },
    { id: 'acili', label: 'Acılı' },
  ],
});

const lavas = {
  id: 'lavas',
  title: 'Lavaş',
  type: 'single',
  default: 'tek',
  choices: [
    { id: 'tek', label: 'Tek lavaş', hideInSummary: true },
    { id: 'cift', label: 'Çift lavaş', price: 20 },
  ],
};

const cikar = {
  id: 'cikar',
  title: 'Çıkarılsın',
  type: 'multi',
  choices: [
    { id: 'sogan', label: 'Soğansız' },
    { id: 'domates', label: 'Domatessiz' },
    { id: 'maydanoz', label: 'Maydanozsuz' },
  ],
};

const ekstra = {
  id: 'ekstra',
  title: 'Ekstralar',
  type: 'multi',
  choices: [
    { id: 'et', label: 'Ekstra et (50 g)', price: 80 },
    { id: 'biber', label: 'Közlenmiş biber', price: 20 },
    { id: 'patlican', label: 'Közlenmiş patlıcan', price: 30 },
  ],
};

const durum = (o) => ({ options: [aci(o.aci), lavas, cikar, ekstra], ...o });

// ---------------------------------------------------------------------------
// Menü
// ---------------------------------------------------------------------------
const categories = [
  {
    id: 'ocak',
    name: 'Ocaktan Dürümler',
    note: 'Dürümler közlenmiş domates, biber ve sumaklı soğanla gelir.',
    products: [
      durum({
        id: 'o-adana',
        name: 'Zırh Adana',
        desc: 'Zırh kıyması kuzu eti, kuyruk yağı ve pul biber.',
        long: 'Her sabah zırhla çektiğimiz kuzu eti, kuyruk yağı ve pul biberle yoğrulur; meşe korunda pişip sac lavaşına sarılır.',
        price: 340,
        tags: [{ text: 'İmza' }],
        dealTag: 'İmza',
        thumb: { kind: 'wrap', filling: 'adana', side: 'pepper', az: 0.5 },
      }),
      durum({
        id: 'o-urfa',
        name: 'Urfa',
        desc: 'Acısız; isotla dengelenmiş kuzu kıyması.',
        price: 340,
        aci: 'acisiz',
        thumb: { kind: 'wrap', filling: 'urfa', seed: 2, side: 'tomato', az: 0.35 },
      }),
      durum({
        id: 'o-kuzu',
        name: 'Kuzu Şiş',
        desc: 'Kekikle dinlenmiş kuşbaşı kuzu.',
        long: 'Kekik ve karabiberle bir gece dinlenen kuşbaşı kuzu eti; közlenmiş biber ve domatesle sarılır.',
        price: 390,
        aci: 'az',
        dealTag: 'Ustanın önerisi',
        thumb: { kind: 'wrap', filling: 'kuzu', seed: 3, side: 'charred', az: 0.6 },
      }),
      durum({
        id: 'o-tavuk',
        name: 'Tavuk Şiş',
        desc: 'Yoğurt ve salçayla marine edilmiş tavuk but.',
        price: 280,
        aci: 'az',
        thumb: { kind: 'wrap', filling: 'tavuk', side: 'lemon', az: 0.45 },
      }),
      durum({
        id: 'o-ciger',
        name: 'Ciğer',
        desc: 'Kuzu ciğeri, kuyruk yağı ve soğan.',
        price: 320,
        aci: 'az',
        thumb: { kind: 'wrap', filling: 'ciger', side: 'onion', az: 0.4 },
      }),
      durum({
        id: 'o-patlican',
        name: 'Patlıcanlı Kebap',
        desc: 'Közde patlıcan ve kıyma, şişte yan yana.',
        long: 'Kuzu kıyması ve patlıcan aynı şişte, meşe korunda birlikte pişer; patlıcanın isli tatlılığı kebaba karışır.',
        price: 380,
        thumb: { kind: 'wrap', filling: 'kuzu', seed: 5, side: 'tomato', az: 0.7 },
      }),
    ],
  },
  {
    id: 'tabak',
    name: 'Tabaklar',
    note: 'Lavaş, közlenmiş sebze ve bulgur pilavıyla.',
    products: [
      {
        id: 't-adana',
        name: 'Adana Porsiyon',
        desc: 'İki şiş Adana, lavaş, köz ve bulgur pilavı.',
        price: 480,
        options: [aci('acili')],
        thumb: { kind: 'board' },
      },
      {
        id: 't-karisik',
        name: 'Karışık Ocak · 2 kişilik',
        desc: 'Adana, kuzu şiş, tavuk şiş ve ciğer.',
        long: 'Ocağın dört ustalığı tek tahtada: Adana, kuzu şiş, tavuk şiş ve ciğer; lavaş, köz sebzeler ve bulgur pilavıyla iki kişilik.',
        price: 980,
        tags: [{ text: 'Paylaşmalık' }],
        thumb: { kind: 'board' },
      },
    ],
  },
  {
    id: 'meze',
    name: 'Mezeler',
    products: [
      { id: 'm-ezme', name: 'Acılı Ezme', desc: 'Zırhla kıyılmış domates, biber ve nar ekşisi.', price: 80, thumb: { kind: 'ezme' } },
      { id: 'm-koz', name: 'Köz Tabağı', desc: 'Közlenmiş domates ve sivri biber.', price: 90, thumb: { kind: 'koz' } },
      { id: 'm-sogan', name: 'Sumaklı Soğan', desc: 'Kırmızı soğan, maydanoz ve sumak.', price: 50, thumb: { kind: 'sogan' } },
    ],
  },
  {
    id: 'icecek',
    name: 'İçecekler',
    products: [
      { id: 'i-ayran', name: 'Yayık Ayranı', desc: 'Bakır tasta, köpüklü.', price: 60, thumb: { kind: 'ayran' } },
      {
        id: 'i-salgam',
        name: 'Şalgam',
        desc: 'Acılı ya da acısız.',
        price: 60,
        options: [{ id: 'tur', title: 'Tercih', type: 'single', default: 'acili', choices: [{ id: 'acili', label: 'Acılı' }, { id: 'acisiz', label: 'Acısız' }] }],
        thumb: { kind: 'salgam' },
      },
      { id: 'i-soda', name: 'Maden Suyu', desc: 'Sade ya da limonlu.', price: 40, thumb: { kind: 'soda' } },
    ],
  },
  {
    id: 'tatli',
    name: 'Tatlılar',
    products: [
      { id: 't-kunefe', name: 'Künefe', desc: 'Bakır tavada, közde; Antep fıstığıyla.', price: 210, thumb: { kind: 'kunefe' } },
      {
        id: 't-katmer',
        name: 'Antep Katmeri',
        desc: 'İncecik açılmış hamur, kaymak ve Antep fıstığı.',
        long: 'Kâğıt inceliğinde açılan hamur, kaymak ve bol Antep fıstığıyla sacda pişer. Sıcak servis edilir.',
        price: 240,
        dealTag: 'Sıcak tatlı',
        thumb: { kind: 'katmer' },
      },
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

function ezme() {
  const g = new THREE.Group();
  g.add(P.stoneBowl({ r: 0.55, h: 0.28, dark: true }));
  const n = 220;
  const im = new THREE.InstancedMesh(K.roundedBox(1, 1, 1, 0.2, 1), K.phys({ color: '#b3261a', roughness: 0.25, clearcoat: 0.8 }), n);
  const rng = T.rng(7);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const col = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const a = rng() * Math.PI * 2;
    const d = Math.sqrt(rng()) * 0.47;
    const h = 0.2 + (1 - (d / 0.47) ** 2) * 0.12;
    e.set(rng() * 3, rng() * 3, rng() * 3);
    q.setFromEuler(e);
    const s = 0.035 + rng() * 0.02;
    m.compose(new THREE.Vector3(Math.cos(a) * d, h, Math.sin(a) * d), q, new THREE.Vector3(s, s, s));
    im.setMatrixAt(i, m);
    im.setColorAt(i, col.set(rng() > 0.8 ? '#4f7d2a' : rng() > 0.5 ? '#c7372f' : '#9e1f14'));
  }
  g.add(im);
  return g;
}

// Her dürüm yanındaki küçük eşlikçiyle ayrışır
function wrapWith(t) {
  const sides = {
    pepper: () => [K.pepper({ len: 0.9, r: 0.065, curve: 0.2 }), [0.75, 0.06, 0.35], [0, -0.4, -Math.PI / 2]],
    tomato: () => [K.tomato({ r: 0.24, charred: true }), [0.72, 0.2, 0.3]],
    charred: () => [K.pepper({ len: 0.95, r: 0.065, charred: true, curve: 0.25 }), [0.72, 0.06, 0.4], [0, 0.5, -Math.PI / 2]],
    onion: () => [K.onionRing({ r: 0.17 }), [0.7, 0.05, 0.4], [Math.PI / 2, 0, 0]],
    lemon: () => [P.lemonWedge({ r: 0.2, t: 0.05 }), [0.72, 0.03, 0.4], [0, -0.5, 0]],
  };
  const entries = [[P.zirhWrap({ filling: t.filling || 'adana', seed: t.seed || 1 }), [-0.15, 0.95, 0], [0, 0, -0.18]]];
  if (t.side && sides[t.side]) entries.push(sides[t.side]());
  return compose(entries);
}

function thumb(p) {
  const t = p.thumb || {};
  switch (t.kind) {
    case 'wrap':
      return { build: () => wrapWith(t), view: { el: 0.24, az: t.az ?? 0.5, zoom: 1.05 } };
    case 'board':
      return { build: () => P.zirhBoard(), view: { el: 0.55, az: 0.15, zoom: 1.08 } };
    case 'ezme':
      return { build: () => ezme(), view: { el: 0.55, az: 0.3, zoom: 1.25 } };
    case 'koz':
      return { build: () => DM.charredPlate(), view: { el: 0.5, az: 0.3, zoom: 1.3 } };
    case 'sogan':
      return { build: () => DM.onionSalad(), view: { el: 0.5, az: 0.3, zoom: 1.25 } };
    case 'ayran':
      return { build: () => K.ayranBowl(), view: { el: 0.38, az: 0.3, zoom: 1.2 } };
    case 'salgam':
      return { build: () => K.tumbler({ h: 0.95, r: 0.27, liquid: '#5b0e2d' }), view: { el: 0.24, az: 0.4 } };
    case 'soda':
      return {
        build: () =>
          compose([
            [K.tumbler({ h: 0.95, r: 0.27, liquid: '#cfe6ec', fill: 0.78, clear: true })],
            [K.citrusSlice({ r: 0.12, t: 0.035 }), [0.22, 0.95, 0], [0, 0, 1.3]],
          ]),
        view: { el: 0.24, az: 0.4 },
      };
    case 'kunefe':
      return { build: () => DM.kunefe(), view: { el: 0.5, az: 0.3, zoom: 1.25 } };
    case 'katmer':
      return { build: () => P.katmer(), view: { el: 0.5, az: 0.3, zoom: 1.25 } };
    default:
      return { build: () => P.zirhWrap(), view: { el: 0.22, az: 0.5 } };
  }
}

// ---------------------------------------------------------------------------
// 3D sahne
// ---------------------------------------------------------------------------
function build({ stage, gsap, ScrollTrigger }) {
  const upright = new THREE.Group();
  const base = P.slatePlate({ r: 0.75 });
  upright.add(base);
  const w = P.zirhWrap({ seed: 2, radius: 0.42 });
  w.position.y = base.userData.top + 0.95;
  w.rotation.z = -0.08;
  upright.add(w);

  const api = premiumShowcase({
    stage,
    gsap,
    ScrollTrigger,
    hero: P.zirhBoard(),
    chapters: [P.minceBoard(), P.grillScene(), upright],
    heroSize: 3.5,
    chapterSize: 2.5,
    heroTilt: 0.46,
    shadow: 0.5,
  });

  // Hero'nun arkasında seyrek ve yavaş kıvılcımlar
  const sparks = K.embers({ count: stage.isMobile ? 40 : 70, w: 10, h: 7, d: 3, size: 26 });
  sparks.material.uniforms.uOpacity.value = 0.55;
  stage.root.add(sparks);
  stage.onResize((view) => sparks.position.set(view.aspect < 0.9 ? 0 : view.width * 0.2, -view.height / 2 - 0.4, -3));
  ScrollTrigger.create({
    trigger: '.p-hero',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (sparks.visible = self.isActive),
  });
  return api;
}

// ---------------------------------------------------------------------------
// Konsept
// ---------------------------------------------------------------------------
export default {
  id: 'durum-premium',
  tier: 'premium',
  meta: {
    title: 'Zırh Ocakbaşı · Konya Ereğli',
    description: 'Zırh kıyması kuzu eti, meşe kömürü ateşi ve sac lavaşı. Ereğli’de ocakbaşının en yalın hâli; online sipariş ve gel-al.',
  },
  brand: { name: 'Zırh', full: 'Zırh Ocakbaşı', orderPrefix: 'ZRH' },
  stageOpts: {
    background: '#0f0e0d',
    env: { dark: true, warmth: 0.8 },
    shadows: true,
    lights: { key: '#ffe6cc', keyI: 2.3, rim: '#ffb38a', rimI: 1.4, fill: '#ff7a3a', fillI: 7 },
    envIntensity: 0.45,
    fov: 28,
  },
  thumbOpts: {
    env: { dark: true, warmth: 0.8 },
    width: 640,
    height: 800,
    studio: { inner: '#2d2a27', outer: '#0e0d0c', shadow: 0.6, zoom: 1 },
    lights: { key: '#ffe6cc', keyI: 2.6, rim: '#ffb38a', rimI: 1.4 },
    envIntensity: 0.6,
    shadowOpacity: 0.6,
  },
  nav: [
    { href: '#menu', label: 'Menü' },
    { href: '#ustalik', label: 'Ustalık' },
    { href: '#secki', label: 'Seçki' },
    { href: '#iletisim', label: 'Ziyaret' },
  ],
  hours: { open: '12:00', close: '00:00', label: 'Haftanın her günü', extra: 'Mutfak 23.30’da kapanır' },
  delivery: { min: 300, fee: 35, freeOver: 600, eta: '35–45 dk', pickupEta: '20 dk', pickupDiscount: 0 },
  contact: {
    phoneDisplay: '0 (332) 000 00 00',
    phoneNote: 'Ocakbaşı masaları için telefonla rezervasyon yapabilirsiniz.',
    whatsapp: '',
    address: 'Ereğli Merkez, Konya',
    addressNote: 'Ocağı yaktığımız adres çok yakında burada.',
    mapsQuery: 'Ereğli, Konya',
  },
  emptyCart: 'Sepetiniz boş. Ustanın seçkisinden başlayabilirsiniz.',
  hero: {
    eyebrow: 'Konya Ereğli · Ocakbaşı',
    titleLines: ['Meşe korunda,', '<em>ustalıkla.</em>'],
    text: 'Zırhla çekilmiş kuzu eti, meşe kömürünün sakin ateşi ve sacdan yeni inmiş lavaş. Ocakbaşının en yalın hâli.',
    ctaPrimary: 'Sipariş ver',
    ctaSecondary: 'Ustalık',
  },
  manifesto: {
    kicker: 'Ocak',
    text: 'Ocak başında acele edilmez. Et zırhla çekilir, kor beklenir, şiş sabırla çevrilir. Biz bu sabrı sofranıza, sıcaklığını kaybetmeden getiriyoruz.',
    sign: 'Zırh Ocakbaşı, Konya Ereğli',
  },
  chapters: {
    id: 'ustalik',
    kicker: 'Ustalık',
    title: 'Ateşin <em>üç kuralı</em>',
    items: [
      { title: 'Zırh', text: 'Kuzu etini her sabah zırhla çekeriz. Makine eti ezer; zırh ise lifini koruyarak keser.', note: 'Kuzu eti ve kuyruk yağı' },
      { title: 'Meşe kömürü', text: 'Gaz yok, elektrik yok. Yalnızca meşe kömürünün koru ve onun verdiği hafif is.', note: 'Ocak her gün öğlen yakılır' },
      { title: 'Sac lavaşı', text: 'Lavaşlarımız sacda, gün boyu taze taze açılır. Dürüm, ilk ısırıkta dağılmayacak kadar sıkı sarılır.', note: 'Tek ya da çift lavaş' },
    ],
  },
  signature: {
    kicker: 'Seçki',
    title: 'Ocağın <em>seçkisi</em>',
    text: 'Ustanın önerdikleri; her biri sipariş anında közde pişer.',
  },
  deals: { items: ['o-adana', 'o-kuzu', 't-karisik', 't-katmer'] },
  menu: {
    eyebrow: 'Menü',
    title: 'Ocaktan <em>sofraya</em>',
    text: 'Acı derecesini ve lavaşı siz seçin; gerisini ustaya bırakın.',
    categories,
  },
  visit: {
    kicker: 'Ziyaret',
    title: 'Ocağın <em>başına</em> buyurun',
    paragraphs: [
      'Ocakbaşı masalarımızda ustanın şişleri çevirişini izleyerek yemek ayrı bir keyif.',
      'Paket servisimiz Ereğli merkez ve yakın mahallelere gece yarısına kadar sürer.',
    ],
  },
  faq: {
    eyebrow: 'Sorular',
    title: 'Merak <em>edilenler</em>',
    items: [
      { q: 'Hangi eti kullanıyorsunuz?', a: 'Adana ve Urfa için kuzu eti ve kuyruk yağı, kuzu şiş için kuşbaşı kuzu, tavuk şiş için marine edilmiş tavuk but kullanıyoruz.' },
      { q: 'Rezervasyon alıyor musunuz?', a: 'Evet. Ocakbaşı masaları için telefonla rezervasyon yapabilirsiniz; hafta sonları önceden aramanızı öneririz.' },
      { q: 'Paket servis hangi bölgelere yapılıyor?', a: 'Ereğli merkez ve yakın mahallelere. En az sepet tutarı 300 TL; 600 TL ve üzeri siparişlerde teslimat ücretsizdir.' },
      { q: 'Acısız seçenek var mı?', a: 'Urfa acısızdır. Diğer kebaplarda acı derecesini sipariş verirken siz seçersiniz.' },
      { q: 'Ödemeyi nasıl yapabilirim?', a: 'Kapıda nakit ya da kartla ödeyebilirsiniz. Gel-al siparişlerinde ödemeyi kasada yaparsınız.' },
    ],
  },
  cta: {
    title: 'Kor <em>hazır.</em>',
    text: 'Siparişiniz közden çıkar çıkmaz yola çıkar.',
    button: 'Menüyü incele',
  },
  footer: {
    about: 'Zırh, Konya Ereğli’de zırh kıyması kuzu eti, meşe kömürü ateşi ve sac lavaşıyla ocakbaşının en yalın hâlini sunar.',
  },
  scene: { build },
  thumb,
};
