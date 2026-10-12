import * as THREE from 'three';
import * as K from '../../three/kit.js';
import * as M from './models.js';
import { build } from './scene.js';
import { icon } from '../../core/icons.js';

// ---------------------------------------------------------------------------
// Seçenek grupları
// ---------------------------------------------------------------------------
const aci = (def = 'acili') => ({
  id: 'aci',
  title: 'Acı seviyesi',
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
    { id: 'cift', label: 'Çift lavaş', price: 15 },
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
    { id: 'sumak', label: 'Sumaksız' },
  ],
};

const ocakEkstra = {
  id: 'ekstra',
  title: 'Ekstralar',
  type: 'multi',
  choices: [
    { id: 'kasar', label: 'Kaşar', price: 25 },
    { id: 'et', label: 'Ekstra et (50 g)', price: 60 },
    { id: 'biber', label: 'Közlenmiş biber', price: 15 },
    { id: 'domates', label: 'Közlenmiş domates', price: 15 },
  ],
};

const donerCikar = {
  id: 'cikar',
  title: 'Çıkarılsın',
  type: 'multi',
  choices: [
    { id: 'patates', label: 'Patatessiz' },
    { id: 'tursu', label: 'Turşusuz' },
    { id: 'sos', label: 'Sossuz' },
  ],
};

const donerEkstra = {
  id: 'ekstra',
  title: 'Ekstralar',
  type: 'multi',
  choices: [
    { id: 'kasar', label: 'Kaşar', price: 25 },
    { id: 'doner', label: 'Ekstra döner (50 g)', price: 45 },
    { id: 'acisos', label: 'Acı sos', price: 0 },
  ],
};

const icecek = {
  id: 'icecek',
  title: 'İçecek',
  type: 'single',
  default: 'ayran',
  choices: [
    { id: 'ayran', label: 'Yayık ayran' },
    { id: 'salgam', label: 'Şalgam' },
    { id: 'kutu', label: 'Kutu içecek', price: 10 },
  ],
};

// ---------------------------------------------------------------------------
// Menü
// ---------------------------------------------------------------------------
const categories = [
  {
    id: 'ocakbasi',
    name: 'Ocakbaşı Dürümler',
    note: 'Tüm dürümler sumaklı soğan, maydanoz ve közlenmiş domatesle gelir.',
    products: [
      {
        id: 'o-adana',
        name: 'Adana Dürüm',
        desc: 'Zırh kıyması kuzu eti, közde pişmiş; sumaklı soğan ve maydanozla.',
        long: 'Her sabah zırhla çektiğimiz kuzu kıyması, kuyruk yağı ve pul biberle yoğrulur, meşe kömürünün korunda pişer. Sumaklı soğan, maydanoz ve közlenmiş domatesle ince lavaşa sarılır.',
        price: 260,
        tags: [{ text: 'Çok satan', kind: 'hot' }],
        options: [aci('acili'), lavas, cikar, ocakEkstra],
        thumb: { kind: 'wrap', filling: 'adana' },
      },
      {
        id: 'o-urfa',
        name: 'Urfa Dürüm',
        desc: 'Adana’nın acısız kardeşi. Aynı özen, daha yumuşak bir lezzet.',
        long: 'Kuzu kıyması, kuyruk yağı ve isotla dengelenir; acı sevmeyenler için meşe kömüründe pişen yumuşak bir lezzet.',
        price: 260,
        tags: [{ text: 'Acısız', kind: 'green' }],
        options: [lavas, cikar, ocakEkstra],
        thumb: { kind: 'wrap', filling: 'urfa' },
      },
      {
        id: 'o-tavuk',
        name: 'Tavuk Şiş Dürüm',
        desc: 'Yoğurtlu, baharatlı marine tavuk but; közde, sulu sulu.',
        long: 'Bir gece yoğurt, salça ve baharatla dinlenen tavuk but, şişte közde pişer. Közlenmiş biber ve domatesle lavaşa sarılır.',
        price: 210,
        options: [aci('az'), lavas, cikar, ocakEkstra],
        thumb: { kind: 'wrap', filling: 'tavuk' },
      },
      {
        id: 'o-ciger',
        name: 'Ciğer Dürüm',
        desc: 'Kuzu ciğeri ve kuyruk yağı; soğan, maydanoz, pul biber.',
        long: 'Küçük doğranmış kuzu ciğeri, kuyruk yağıyla şişe dizilir ve harlı korda hızla pişer. Bol soğan, maydanoz ve pul biberle.',
        price: 240,
        options: [aci('az'), lavas, cikar],
        thumb: { kind: 'wrap', filling: 'ciger' },
      },
      {
        id: 'o-kuzu',
        name: 'Kuzu Şiş Dürüm',
        desc: 'Kuşbaşı kuzu eti, közlenmiş biber ve domatesle.',
        long: 'Kekik ve karabiberle dinlendirilmiş kuşbaşı kuzu eti meşe korunda pişer; közlenmiş biber ve domatesle lavaşa sarılır.',
        price: 290,
        options: [aci('az'), lavas, cikar, ocakEkstra],
        thumb: { kind: 'wrap', filling: 'kuzu' },
      },
      {
        id: 'o-kasarli',
        name: 'Kaşarlı Adana',
        desc: 'Adana dürümün içinde sıcak sıcak eriyen kaşar.',
        long: 'Közden yeni inen Adana kebabının üzerinde eriyen kaşar. Acıyı yumuşatan, uzayan bir lezzet.',
        price: 285,
        tags: [{ text: 'Yeni', kind: 'green' }],
        dealTag: 'Yeni lezzet',
        options: [aci('acili'), lavas, cikar],
        thumb: { kind: 'wrap', filling: 'adana', seed: 3 },
      },
    ],
  },
  {
    id: 'doner',
    name: 'Döner',
    note: 'Döner dürümlerde patates ve turşu içindedir.',
    products: [
      {
        id: 'd-tavuk',
        name: 'Tavuk Döner Dürüm',
        desc: 'Lavaşta tavuk döner, patates, turşu ve özel sos.',
        long: 'İnce kesilmiş tavuk döner, çıtır patates, turşu ve özel sosumuzla lavaşta. Gençlerin bir numaralı tercihi.',
        price: 150,
        tags: [{ text: 'Çok satan', kind: 'hot' }],
        options: [donerCikar, donerEkstra],
        thumb: { kind: 'wrap', filling: 'doner' },
      },
      {
        id: 'd-et',
        name: 'Et Döner Dürüm',
        desc: 'Yaprak et döner; domates, soğan ve maydanozla.',
        long: 'Kendi hazırladığımız yaprak et döner; domates, sumaklı soğan ve maydanozla lavaşta.',
        price: 230,
        options: [donerCikar, donerEkstra],
        thumb: { kind: 'wrap', filling: 'etdoner' },
      },
      {
        id: 'd-zurna',
        name: 'Zurna Tavuk Döner',
        desc: 'Bir buçuk kat lavaş, bol tavuk döner.',
        long: 'Uzun lavaşa sarılmış bol tavuk döner, patates ve turşu. Uzun bir günün en iyi kapanışı.',
        price: 200,
        options: [donerCikar, donerEkstra],
        thumb: { kind: 'zurna' },
      },
    ],
  },
  {
    id: 'menuler',
    name: 'Menüler',
    note: 'Menülerde içeceği değiştirebilirsiniz.',
    products: [
      {
        id: 'm-ocak',
        name: 'Ocak Menü',
        desc: 'Adana ya da Urfa dürüm, patates kızartması ve yayık ayran.',
        long: 'KOR’un imza menüsü: Adana ya da Urfa dürüm, çıtır patates kızartması ve bakır tasta köpüklü yayık ayran.',
        price: 330,
        dealTag: 'İmza menü',
        options: [
          {
            id: 'durum',
            title: 'Dürüm',
            type: 'single',
            ask: true,
            default: 'adana',
            choices: [
              { id: 'adana', label: 'Adana' },
              { id: 'urfa', label: 'Urfa' },
            ],
          },
          icecek,
        ],
        thumb: { kind: 'menuOcak' },
      },
      {
        id: 'm-ikili',
        name: 'İkili Döner Menü',
        desc: '2 tavuk döner dürüm ve 2 ayran.',
        long: 'İki tavuk döner dürüm ve iki yayık ayran. Arkadaşınızla, ev arkadaşınızla, iş çıkışında.',
        price: 320,
        dealTag: 'Paylaşmalık',
        options: [icecek],
        thumb: { kind: 'menuDuo' },
      },
      {
        id: 'm-ogrenci',
        name: 'Öğrenci Menüsü',
        desc: 'Tavuk döner dürüm ve ayran. Öğrenci kartınızı göstermeniz yeterli.',
        long: 'Tavuk döner dürüm ve yayık ayran, öğrenci dostu fiyatla. Teslimatta veya kasada öğrenci kartınızı göstermeniz yeterli.',
        price: 175,
        dealTag: 'Öğrenciye özel',
        options: [icecek],
        thumb: { kind: 'menuSolo' },
      },
    ],
  },
  {
    id: 'yaninda',
    name: 'Yanında',
    products: [
      { id: 'y-patates', name: 'Patates Kızartması', desc: 'Çıtır çıtır, tuzu kararında.', price: 90, thumb: { kind: 'fries' } },
      { id: 'y-koz', name: 'Köz Tabağı', desc: 'Közlenmiş domates ve sivri biber.', price: 70, thumb: { kind: 'koz' } },
      { id: 'y-sogan', name: 'Sumaklı Soğan Salatası', desc: 'Kırmızı soğan, maydanoz ve sumak.', price: 45, thumb: { kind: 'sogan' } },
    ],
  },
  {
    id: 'icecekler',
    name: 'İçecekler',
    products: [
      { id: 'i-ayran', name: 'Yayık Ayran', desc: 'Bakır tasta, bol köpüklü.', price: 45, thumb: { kind: 'ayran' } },
      {
        id: 'i-salgam',
        name: 'Şalgam',
        desc: '300 ml; acılı ya da acısız.',
        price: 45,
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
        price: 55,
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
  {
    id: 'tatli',
    name: 'Tatlı',
    products: [
      {
        id: 't-kunefe',
        name: 'Künefe',
        desc: 'Tel kadayıf arasında eriyen peynir, üzerinde Antep fıstığı.',
        long: 'Bakır tavada, közde pişen künefe: çıtır tel kadayıfın arasında uzayan peynir, sıcak şerbet ve bol Antep fıstığı.',
        price: 160,
        dealTag: 'Közde tatlı',
        thumb: { kind: 'kunefe' },
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
  const wrapView = { el: 0.32, az: 0.55 };
  switch (t.kind) {
    case 'wrap':
      return { build: () => compose([[M.korWrap({ filling: t.filling, seed: t.seed || 1 }), [0, 0, 0], [0, 0, -0.42]]]), view: wrapView };
    case 'zurna':
      return { build: () => compose([[M.korWrap({ filling: 'doner', length: 2.7, radius: 0.38, seed: 2 }), [0, 0, 0], [0, 0, -0.55]]]), view: wrapView };
    case 'menuOcak':
      return {
        build: () =>
          compose([
            [M.korWrap({ seed: 1 }), [-0.55, 0.95, 0], [0, 0, -0.3]],
            [M.fries(), [0.45, 0, -0.25], [0, 0.3, 0], 1.1],
            [K.ayranBowl(), [0.55, 0, 0.75], [0, 0, 0], 0.9],
          ]),
        view: { el: 0.32, az: 0.35 },
      };
    case 'menuDuo':
      return {
        build: () =>
          compose([
            [M.korWrap({ filling: 'doner', seed: 1 }), [-0.7, 0.95, 0], [0, 0, -0.3]],
            [M.korWrap({ filling: 'doner', seed: 2 }), [0.05, 0.95, -0.5], [0, 0.4, -0.1]],
            [K.ayranBowl(), [0.85, 0, 0.3], [0, 0, 0], 0.85],
            [K.ayranBowl(), [0.05, 0, 0.85], [0, 0, 0], 0.85],
          ]),
        view: { el: 0.32, az: 0.35 },
      };
    case 'menuSolo':
      return {
        build: () =>
          compose([
            [M.korWrap({ filling: 'doner', seed: 3 }), [-0.35, 0.95, 0], [0, 0, -0.3]],
            [K.ayranBowl(), [0.6, 0, 0.3], [0, 0, 0], 0.95],
          ]),
        view: { el: 0.3, az: 0.35 },
      };
    case 'fries':
      return { build: () => M.fries(), view: { el: 0.35, az: 0.5 } };
    case 'koz':
      return { build: () => M.charredPlate(), view: { el: 0.65, az: 0.3 } };
    case 'sogan':
      return { build: () => M.onionSalad(), view: { el: 0.7, az: 0.3 } };
    case 'ayran':
      return { build: () => K.ayranBowl(), view: { el: 0.5, az: 0.3 } };
    case 'salgam':
      return { build: () => K.tumbler({ h: 0.95, r: 0.27, liquid: '#5b0e2d' }), view: { el: 0.3, az: 0.4 } };
    case 'can':
      return { build: () => M.korCan(), view: { el: 0.25, az: 0.2 } };
    case 'kunefe':
      return { build: () => M.kunefe(), view: { el: 0.6, az: 0.3 } };
    default:
      return { build: () => M.korWrap(), view: wrapView };
  }
}

// ---------------------------------------------------------------------------
// Konsept
// ---------------------------------------------------------------------------
export default {
  id: 'durum',
  meta: {
    title: 'KOR Ocakbaşı Dürüm · Konya Ereğli | Online Sipariş',
    description:
      'Ereğli’de meşe kömürü ateşinde pişen Adana, Urfa, tavuk şiş ve döner dürümler. Gece yarısına kadar online sipariş verin, sıcak sıcak kapınıza gelsin.',
  },
  brand: {
    name: 'KOR',
    full: 'KOR Ocakbaşı Dürüm',
    orderPrefix: 'KOR',
    backdropWord: 'közde',
    badgeText: 'MEŞE KÖMÜRÜ • OCAKBAŞI • EREĞLİ • ',
    badgeIcon: icon.flame,
  },
  stageOpts: {
    lights: { key: '#ffd9b8', keyI: 1.7, rim: '#ff8a4a', rimI: 1.8, fill: '#ff6a2a', fillI: 14 },
    envIntensity: 0.5,
  },
  thumbOpts: {
    lights: { key: '#ffe2c8', keyI: 2.1, rim: '#ff9a5a', rimI: 1.4, fill: '#ff6a2a', fillI: 6 },
    envIntensity: 0.75,
    shadowOpacity: 0.55,
  },
  backdrop: {
    glows: [
      { x: '38%', y: '42%', size: '62vw', color: '#ff5a1f', opacity: 0.16 },
      { x: '-12%', y: '70%', size: '42vw', color: '#ffb23e', opacity: 0.07 },
    ],
  },
  nav: [
    { href: '#menu', label: 'Menü' },
    { href: '#ocak', label: 'Ocak' },
    { href: '#kampanyalar', label: 'Kampanyalar' },
    { href: '#iletisim', label: 'Şube' },
  ],
  hours: { open: '11:00', close: '00:00', label: 'Haftanın her günü', extra: 'Son sipariş 23.30' },
  delivery: { min: 200, fee: 25, freeOver: 400, eta: '30–40 dk', pickupEta: '15–20 dk', pickupDiscount: 0 },
  contact: {
    phoneDisplay: '0 (332) 000 00 00',
    phoneNote: 'Telefonla da sipariş alıyoruz. 10 dürüm ve üzeri siparişleri bir gün önceden bildirin.',
    whatsapp: '',
    address: 'Ereğli Merkez, Konya',
    addressNote: 'Ocağı yaktığımız adres çok yakında burada.',
    mapsQuery: 'Ereğli, Konya',
  },
  emptyCart: 'Ocak hazır, sepet boş. Bir Adana dürümle başlamaya ne dersiniz?',
  hero: {
    eyebrow: 'Konya Ereğli · Ocakbaşı Dürüm',
    titleLines: ['Közün', '<em>hakkını</em> veren', 'dürüm.'],
    text: 'Meşe kömürünün korunda pişen Adana, Urfa ve şiş çeşitleri; sacdan yeni inmiş ince lavaşa sarılıp sıcak sıcak kapınıza geliyor.',
    ctaPrimary: 'Sipariş ver',
    ctaSecondary: 'Ocağın hikâyesi',
    chips: [
      { icon: 'flame', text: 'Meşe kömürü ateşi' },
      { icon: 'knife', text: 'Zırhla çekilen kıyma' },
      { icon: 'moon', text: 'Gece yarısına kadar açık' },
    ],
  },
  marquee: {
    icon: icon.flame,
    a: ['Meşe kömürü', 'Zırh kıyması', 'Sacdan lavaş', 'Közlenmiş biber'],
    b: ['Adana', 'Urfa', 'Tavuk şiş', 'Ciğer', 'Kuzu şiş', 'Döner'],
  },
  story: {
    id: 'ocak',
    eyebrow: 'Ocağın başından',
    title: 'Bir dürüm, <em>dört durak</em>',
    steps: [
      { label: 'Zırh', title: 'Zırhla çekilir', text: 'Kuzu etini her sabah zırhla kendimiz çekiyor; kuyruk yağı ve pul biberle dengeliyoruz.' },
      { label: 'Köz', title: 'Meşe korunda pişer', text: 'Şişler meşe kömürünün korunda, sabırla çevrilerek pişer. Domates ve biber de aynı ateşte közlenir.' },
      { label: 'Lavaş', title: 'Sacdan yeni iner', text: 'İnce lavaşı sıcak sıcak serer; kebabı, közlenmiş domatesi, sumaklı soğanı ve maydanozu üzerine dizeriz.' },
      { label: 'Sarma', title: 'Elinize hazır', text: 'Sıkıca sarar, kâğıdına yerleştirir ve ilk ısırıktaki sıcaklığı koruyarak kapınıza getiririz.' },
    ],
  },
  deals: {
    eyebrow: 'Kampanyalar',
    title: 'Ocaktan <em>fırsatlar</em>',
    text: 'Doyuran menüler, öğrenciye özel fiyatlar ve paylaşmalık seçenekler. Hepsi közün tadında.',
    items: ['m-ocak', 'm-ikili', 'm-ogrenci', 'o-kasarli', 't-kunefe'],
  },
  menu: {
    eyebrow: 'Menü',
    title: 'Bugün közde <em>ne var?</em>',
    text: 'Dürümünüzü seçin, acısını ve lavaşını ayarlayın, gerisini ocağa bırakın.',
    categories,
  },
  values: {
    eyebrow: 'Neden KOR?',
    title: 'Ateşin <em>dört kuralı</em>',
    items: [
      { icon: 'flame', title: 'Yalnızca meşe kömürü', text: 'Gazlı ya da elektrikli ızgara kullanmayız. Lezzet, meşenin korundan gelir.' },
      { icon: 'knife', title: 'Günlük zırh kıyması', text: 'Kıymamızı hazır almayız; her sabah zırhla kendimiz çekeriz.' },
      { icon: 'wheat', title: 'Sacdan taze lavaş', text: 'Lavaşlarımız gün boyu sacda, taze taze pişer.' },
      { icon: 'moon', title: 'Gece yarısına kadar', text: 'Ocağımız her gün 11.00’den gece yarısına kadar yanar.' },
    ],
  },
  local: {
    eyebrow: 'Ereğli gecelerine',
    title: 'Ocak yanınca <em>mahalle toplanır</em>',
    paragraphs: [
      'İş çıkışı acıkanlar, ders arası soluklananlar, maçtan dönenler... Ereğli’nin akşamları uzun, sofraları kalabalıktır.',
      'KOR, bu kalabalığa közün sıcaklığını getirmek için yakıldı. Paket servisimiz Ereğli merkez ve yakın mahallelerde, gece yarısına kadar sürer.',
    ],
  },
  faq: {
    eyebrow: 'Merak edilenler',
    title: 'Sık sorulan <em>sorular</em>',
    text: 'Aklınıza takılan başka bir şey olursa sipariş hattımızdan bize ulaşabilirsiniz.',
    items: [
      { q: 'Kebaplarınızda hangi et kullanılıyor?', a: 'Adana ve Urfa kebabımızda kuzu eti ve kuyruk yağı kullanıyoruz. Tavuk şiş için marine edilmiş tavuk but, kuzu şiş için kuşbaşı kuzu eti tercih ediyoruz.' },
      { q: 'Acısız seçeneğiniz var mı?', a: 'Urfa dürümümüz acısızdır. Diğer dürümlerde de acı seviyesini sipariş verirken kendiniz seçebilirsiniz.' },
      { q: 'Gece kaça kadar sipariş alıyorsunuz?', a: 'Her gün 11.00 ile 00.00 arasında açığız. Paket servis için son sipariş saati 23.30.' },
      { q: 'Paket servis hangi bölgelere yapılıyor?', a: 'Ereğli merkez ve yakın mahallelere paket servis yapıyoruz. En az sepet tutarı 200 TL; 400 TL ve üzeri siparişlerde teslimat ücretsizdir.' },
      { q: 'Ödemeyi nasıl yapabilirim?', a: 'Kapıda nakit ya da kartla ödeyebilirsiniz. Gel-al siparişlerinde ödemeyi kasada yaparsınız.' },
      { q: 'İş yeri ve toplu siparişler alıyor musunuz?', a: 'Evet. 10 dürüm ve üzeri siparişlerinizi bir gün önceden bildirirseniz istediğiniz saatte hazır ederiz.' },
    ],
  },
  cta: {
    title: 'Ocak yandı. <em>Sıra sizde.</em>',
    text: 'Siparişinizi verin; dürümünüz közün sıcaklığıyla, ortalama 35 dakikada kapınızda.',
    button: 'Hemen sipariş ver',
  },
  footer: {
    about: 'KOR, Konya Ereğli’de meşe kömürü ateşinde pişen Adana, Urfa ve şiş dürümleri gece yarısına kadar sıcak sıcak sunar.',
  },
  scene: { build },
  thumb,
};
