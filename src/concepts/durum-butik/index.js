import '@fontsource-variable/big-shoulders-display';
import '@fontsource-variable/instrument-sans/standard.css';
import '../../styles/butik.css';
import '../../styles/butik-ocak.css';
import * as ui from '../../butik/ocak.js';
import { photoUrl } from '../../butik/common.js';

// Ocak 42: mahallenin ocakbaşı dürümcüsü. Beyaz fayans, harfli keçe pano, krom tezgâh.

const aci = (def) => ({
  id: 'aci',
  title: 'Acı',
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

const ekstra = {
  id: 'ekstra',
  title: 'Ekstralar',
  type: 'multi',
  choices: [
    { id: 'kasar', label: 'Kaşar', price: 25 },
    { id: 'et', label: 'Ekstra et (50 g)', price: 60 },
    { id: 'biber', label: 'Közlenmiş biber', price: 15 },
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
  ],
};

const durumSec = {
  id: 'durum',
  title: 'Dürüm',
  type: 'single',
  default: 'adana',
  ask: true,
  choices: [
    { id: 'adana', label: 'Adana' },
    { id: 'urfa', label: 'Urfa' },
    { id: 'tavuk', label: 'Tavuk şiş' },
    { id: 'ciger', label: 'Ciğer', price: 0 },
  ],
};

const categories = [
  {
    id: 'ocak',
    name: 'Közden dürümler',
    note: 'Şiş, siparişiniz gelince közün üstüne konur.',
    products: [
      {
        id: 'o-adana',
        name: 'Adana Dürüm',
        board: 'ADANA DÜRÜM',
        desc: 'Zırhla kıyılmış kuzu, acılı.',
        long: 'Kuzu eti ve kuyruk yağı zırhla kıyılır, pul biberle yoğrulur, meşe közünde pişer. Lavaşa soğan, maydanoz ve sumakla sarılır.',
        price: 230,
        tags: [{ text: 'En çok satan' }],
        options: [aci('acili'), lavas, cikar, ekstra],
      },
      {
        id: 'o-urfa',
        name: 'Urfa Dürüm',
        board: 'URFA DÜRÜM',
        desc: 'Aynı kıyma, acısız.',
        long: 'Adana’nın acısız kardeşi. Zırh kıyması, isot yerine tatlı kırmızı biberle yoğrulur.',
        price: 230,
        options: [lavas, cikar, ekstra],
      },
      {
        id: 'o-tavuk',
        name: 'Tavuk Şiş Dürüm',
        board: 'TAVUK ŞİŞ',
        desc: 'Yoğurtlu, kekikli tavuk göğsü.',
        long: 'Bir gece yoğurt, kekik ve biber salçasında bekleyen tavuk göğsü, közde kızarana kadar çevrilir.',
        price: 190,
        options: [aci('az'), lavas, cikar, ekstra],
      },
      {
        id: 'o-ciger',
        name: 'Ciğer Dürüm',
        board: 'CİĞER',
        desc: 'Kuzu ciğeri, bol soğan ve sumak.',
        price: 220,
        options: [aci('az'), lavas, cikar],
      },
      {
        id: 'o-kuzu',
        name: 'Kuzu Şiş Dürüm',
        board: 'KUZU ŞİŞ',
        desc: 'Kuşbaşı kuzu, közlenmiş biberle.',
        price: 260,
        options: [aci('acisiz'), lavas, cikar, ekstra],
      },
    ],
  },
  {
    id: 'menuler',
    name: 'Menüler',
    note: 'Dürüm, patates ve içecek bir arada.',
    products: [
      {
        id: 'm-usta',
        name: 'Usta Menü',
        desc: 'Seçtiğiniz dürüm, patates ve ayran.',
        long: 'Ocaktan bir dürüm, çıtır patates ve yayık ayranı ya da şalgam.',
        price: 310,
        options: [durumSec, icecek, lavas],
      },
      {
        id: 'm-ikili',
        name: 'İkili Menü',
        desc: 'İki dürüm, bir büyük patates ve iki içecek.',
        price: 560,
        tags: [{ text: 'İki kişilik' }],
        options: [{ ...durumSec, id: 'durum1', title: 'Birinci dürüm' }, { ...durumSec, id: 'durum2', title: 'İkinci dürüm' }, icecek],
      },
    ],
  },
  {
    id: 'yaninda',
    name: 'Yanında',
    products: [
      { id: 'y-patates', name: 'Patates', desc: 'Çıtır, tuzu kararında.', price: 80 },
      { id: 'y-koz', name: 'Köz Tabağı', desc: 'Közlenmiş domates ve sivri biber.', price: 60 },
      { id: 'y-sogan', name: 'Sumaklı Soğan', desc: 'Kırmızı soğan, maydanoz ve sumak.', price: 40 },
    ],
  },
  {
    id: 'icecekler',
    name: 'İçecekler',
    products: [
      { id: 'i-ayran', name: 'Yayık Ayranı', board: 'AYRAN', desc: 'Bakır tasta, köpüklü.', price: 40 },
      {
        id: 'i-salgam',
        name: 'Şalgam',
        desc: 'Acılı ya da acısız.',
        price: 40,
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
      },
    ],
  },
  {
    id: 'tatli',
    name: 'Tatlı',
    products: [{ id: 't-kunefe', name: 'Künefe', desc: 'Közde, tel kadayıf ve Hatay peyniriyle.', price: 150 }],
  },
];

export default {
  id: 'durum-butik',
  tier: 'butik',
  meta: {
    title: 'Ocak 42 Dürüm · Konya Ereğli',
    description: 'Meşe közünde Adana, Urfa, tavuk şiş ve ciğer dürüm. Gece ikiye kadar açık; Ereğli içi paket servis.',
  },
  brand: { name: 'Ocak 42', full: 'Ocak 42 Dürüm', orderPrefix: 'O42' },
  nav: [
    { href: '#menu', label: 'Menü' },
    { href: '#usta', label: 'Usta' },
    { href: '#saatler', label: 'Saatler' },
    { href: '#sss', label: 'Sorular' },
  ],
  hours: { open: '12:00', close: '02:00', label: 'Her gün', extra: 'Son sipariş 01.30' },
  delivery: { min: 200, fee: 25, freeOver: 450, eta: '30–40 dk', pickupEta: '15 dk', pickupDiscount: 0 },
  contact: {
    phoneDisplay: '0 (332) 000 00 00',
    phoneNote: 'Kalabalık siparişler için önceden arayın.',
    whatsapp: '',
    address: 'Ereğli Merkez, Konya',
    addressNote: 'Dükkân adresi çok yakında burada.',
    mapsQuery: 'Ereğli, Konya',
  },
  emptyCart: 'Panodan ya da menüden bir dürüm seçerek başlayın.',
  hero: {
    title: 'Közde pişer, elde sarılır.',
    text: 'Ereğli’de gece ikiye kadar açık ocakbaşı. Paket servisle ortalama 35 dakikada kapınızda.',
    cta: 'Menüyü aç',
    board: { head: 'BUGÜN OCAKTA', items: ['o-adana', 'o-urfa', 'o-tavuk', 'o-ciger', 'o-kuzu', 'i-ayran'] },
  },
  menu: { title: 'Menü', categories },
  steps: {
    id: 'usta',
    title: 'Ustanın sırası',
    items: [
      { title: 'Zırh', text: 'Kuzu eti ve kuyruk yağı zırhla elde kıyılır. Makineden geçmediği için suyunu kaybetmez.' },
      { title: 'Şiş', text: 'Kıyma geniş şişe sıvanır, parmaklarla bastırılır. Közde dağılmaz.' },
      { title: 'Köz', text: 'Meşe kömüründe sık sık çevrilerek pişer. Yağı közün üstüne damlar, dumanı ete geçer.' },
      { title: 'Lavaş', text: 'Lavaş şişin üstünde ısıtılır, eti sıyırır. Soğan, maydanoz ve sumakla sarılıp kâğıda alınır.' },
    ],
  },
  faq: [
    { q: 'Etleriniz nereden geliyor?', a: 'Kuzu ve dana etini her sabah Ereğli’deki kasabımızdan alıyoruz. Kıyma, gün içinde zırhla elde çekilir.' },
    { q: 'Gece kaça kadar sipariş alıyorsunuz?', a: 'Paket servis siparişini gece 01.30’a kadar alıyoruz. Ocak 02.00’de kapanır.' },
    { q: 'Acısız seçenek var mı?', a: 'Urfa dürüm acısızdır. Adana ve diğer dürümlerde acıyı sipariş verirken siz seçersiniz.' },
    { q: 'Çift lavaş ne demek?', a: 'Dürüm iki kat lavaşla sarılır. Yolda dağılmaz, daha doyurucu olur.' },
    { q: 'Paket servis nerelere var?', a: 'Ereğli merkez ve yakın mahallelere. En az sepet 200 TL; 450 TL ve üzerindeki siparişlerde teslimat ücretsiz.' },
  ],
  footer: {
    about: 'Ocak 42, Konya Ereğli’de meşe közünde pişen dürümleri gece ikiye kadar sıcak tutan bir ocakbaşıdır.',
  },
  ui,
  photo: (id) => photoUrl('durum-butik', id),
};
