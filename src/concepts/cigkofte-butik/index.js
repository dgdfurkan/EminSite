import '@fontsource-variable/anybody/standard.css';
import '@fontsource-variable/atkinson-hyperlegible-next/wght.css';
import '../../styles/butik.css';
import '../../styles/butik-isot.css';
import * as ui from '../../butik/isot.js';
import { photoUrl } from '../../butik/common.js';

// İsot: acı derecesini sizin seçtiğiniz çiğ köfteci. Sayfanın tek iddiası bu seçim.

export const HEAT = [
  { id: 'hafif', label: 'Hafif', note: 'Acısı belli belirsiz. Nane ve limon öne çıkar.' },
  { id: 'orta', label: 'Orta', note: 'Ustanın ölçüsü. En çok bu seçiliyor.' },
  { id: 'acili', label: 'Acılı', note: 'İsot kendini hissettirir. Yanına bir ayran iyi gider.' },
  { id: 'ates', label: 'Ateş', note: 'Çift isot, gözünüz sulanabilir. Biz söylemiş olalım.' },
];

// Varsayılanı sayfadaki seçici belirler (ui/isot.js)
const aci = {
  id: 'aci',
  title: 'Acı derecesi',
  type: 'single',
  default: 'orta',
  choices: HEAT.map((h) => ({ id: h.id, label: h.label })),
};

const cikar = {
  id: 'cikar',
  title: 'Çıkarılsın',
  type: 'multi',
  choices: [
    { id: 'marul', label: 'Marulsuz' },
    { id: 'nane', label: 'Nanesiz' },
    { id: 'nar', label: 'Nar ekşisiz' },
    { id: 'limon', label: 'Limonsuz' },
  ],
};

const ekstra = {
  id: 'ekstra',
  title: 'Ekstralar',
  type: 'multi',
  choices: [
    { id: 'ceviz', label: 'İri çekilmiş ceviz', price: 20 },
    { id: 'kofte', label: 'Ekstra çiğ köfte (50 g)', price: 30 },
    { id: 'cips', label: 'Çıtır patates cipsi', price: 15 },
  ],
};

const categories = [
  {
    id: 'durumler',
    name: 'Dürümler',
    note: 'İnce lavaşta, göbek marul ve taze naneyle.',
    products: [
      {
        id: 'd-klasik',
        name: 'Çiğ Köfte Dürüm',
        desc: 'Göbek marul, nane ve nar ekşisiyle.',
        long: 'İnce lavaşa 120 g çiğ köfte, göbek marul, taze nane ve nar ekşisi. Sıkıca sarılır, yarısından kesilir.',
        price: 95,
        tags: [{ text: 'En çok satan' }],
        options: [aci, cikar, ekstra],
      },
      {
        id: 'd-cevizli',
        name: 'Cevizli Dürüm',
        desc: 'İri çekilmiş ceviz ve nar taneleriyle.',
        long: 'Harcın içinde iri çekilmiş ceviz, üstünde taze nar taneleri. Dokusu zengin, tadı derin.',
        price: 125,
        options: [aci, cikar],
      },
      {
        id: 'd-citir',
        name: 'Çıtır Dürüm',
        desc: 'İçinde çıtır patates cipsi.',
        long: 'Klasik dürümün içine bir avuç çıtır patates cipsi. İlk ısırıkta çıtırdar.',
        price: 110,
        options: [aci, cikar],
      },
      {
        id: 'd-duble',
        name: 'Duble Dürüm',
        desc: 'İki kat çiğ köfte, iki kat yeşillik.',
        long: 'İki lavaş, 240 g çiğ köfte ve bol yeşillik. Tek başına bir öğün.',
        price: 160,
        options: [aci, cikar, ekstra],
      },
    ],
  },
  {
    id: 'tabak',
    name: 'Tabak ve paket',
    note: 'Paketlerde garnitür ve lavaş hazır gelir.',
    products: [
      {
        id: 't-porsiyon',
        name: 'Porsiyon Tabak',
        desc: 'Altı sıkım çiğ köfte, marul ve limon.',
        long: 'Altı sıkım çiğ köfte; göbek marul, limon, nar taneleri ve nane ile. Yanında üç lavaş.',
        price: 175,
        options: [aci, cikar],
      },
      {
        id: 'p-yarim',
        name: 'Yarım Kilo Paket',
        desc: '3–4 kişilik; garnitür ve altı lavaş.',
        price: 280,
        options: [aci],
      },
      {
        id: 'p-kilo',
        name: 'Bir Kilo Aile Paketi',
        desc: '6–8 kişilik; garnitür ve on iki lavaş.',
        long: 'Kalabalık sofralar için bir kilo çiğ köfte, marul, maydanoz, limon, nar ekşisi ve on iki lavaş.',
        price: 520,
        tags: [{ text: 'Kalabalık sofralara' }],
        options: [aci],
      },
    ],
  },
  {
    id: 'menuler',
    name: 'Menüler',
    products: [
      {
        id: 'm-ogrenci',
        name: 'Öğrenci Menüsü',
        desc: 'Çiğ köfte dürüm ve ayran.',
        long: 'Bir çiğ köfte dürüm ve bir ayran. Öğrenci kimliğinizi kuryemize göstermeniz yeterli.',
        price: 115,
        options: [aci, cikar],
      },
      {
        id: 'm-ikili',
        name: 'İkili Menü',
        desc: 'İki dürüm, iki ayran ve acılı turşu.',
        price: 260,
        options: [aci, cikar],
      },
    ],
  },
  {
    id: 'yaninda',
    name: 'Yanında',
    products: [
      { id: 'y-tursu', name: 'Acılı Turşu', desc: 'Kornişon, turşu biberi ve havuç.', price: 40 },
      { id: 'y-garnitur', name: 'Garnitür Seti', desc: 'Marul, maydanoz, limon ve nar ekşisi.', price: 45 },
      { id: 'y-lavas', name: 'Ekstra Lavaş', desc: 'Üç adet ince lavaş.', price: 20 },
    ],
  },
  {
    id: 'icecekler',
    name: 'İçecekler',
    products: [
      { id: 'i-ayran', name: 'Ayran', desc: 'Soğuk, bol köpüklü.', price: 30 },
      {
        id: 'i-salgam',
        name: 'Şalgam',
        desc: 'Acılı ya da acısız.',
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
      },
      { id: 'i-limonata', name: 'Naneli Limonata', desc: 'Taze sıkılmış limon ve nane.', price: 55 },
    ],
  },
];

export default {
  id: 'cigkofte-butik',
  tier: 'butik',
  meta: {
    title: 'İsot Çiğ Köfte · Konya Ereğli',
    description: 'Acı derecesini sizin seçtiğiniz çiğ köfte. Hafiften ateşe dört kademe; dürüm, tabak ve aile paketleri. Ereğli içi paket servis.',
  },
  brand: { name: 'İsot', full: 'İsot Çiğ Köfte', orderPrefix: 'IST' },
  heat: { levels: HEAT, option: aci, storageKey: 'isot:aci', start: 'orta' },
  nav: [
    { href: '#menu', label: 'Menü' },
    { href: '#yapilis', label: 'Yapılışı' },
    { href: '#teslimat', label: 'Teslimat' },
    { href: '#sss', label: 'Sorular' },
  ],
  hours: { open: '11:00', close: '00:00', label: 'Her gün' },
  delivery: { min: 150, fee: 25, freeOver: 400, eta: '25–35 dk', pickupEta: '10 dk', pickupDiscount: 0.1 },
  contact: {
    phoneDisplay: '0 (332) 000 00 00',
    phoneNote: 'Kalabalık siparişler için bir gün önceden arayın.',
    whatsapp: '',
    address: 'Ereğli Merkez, Konya',
    addressNote: 'Şube adresi çok yakında burada.',
    mapsQuery: 'Ereğli, Konya',
  },
  emptyCart: 'Menüden bir dürüm seçerek başlayın.',
  hero: {
    title: ['Acılı mı', 'olsun?'],
    cta: 'Menüyü aç',
  },
  menu: {
    title: 'Menü',
    categories,
  },
  steps: {
    id: 'yapilis',
    title: 'Bir sıkımın yolu',
    items: [
      { title: 'Yoğurma', text: 'İnce bulgur, isot, salça ve soğan kırk beş dakika elde yoğrulur. Makine kullanmıyoruz.' },
      { title: 'Dinlendirme', text: 'Maydanoz, taze soğan ve nar ekşisi eklenir. Harç yarım saat dinlenir, bulgur suyunu çeker.' },
      { title: 'Sıkım', text: 'Her parça avuçta sıkılır. Parmakların bıraktığı oluklar nar ekşisini ve limonu tutar.' },
    ],
  },
  faq: [
    { q: 'Çiğ köftenizde et var mı?', a: 'Hayır. Çiğ köftemiz etsizdir: ince bulgur, isot, salça, soğan, yeşillik ve baharatla yoğrulur.' },
    {
      q: 'Acı derecesini ürün ürün değiştirebilir miyim?',
      a: 'Evet. Sayfanın başındaki seçim bütün siparişe uygulanır; ürün penceresinde o ürün için ayrıca değiştirebilirsiniz.',
    },
    { q: 'Paket servis nerelere var?', a: 'Ereğli merkez ve yakın mahallelere. En az sepet 150 TL; 400 TL ve üzerindeki siparişlerde teslimat ücretsiz.' },
    { q: 'Gel-al siparişte indirim var mı?', a: 'Var. Gel-al siparişlerde sepetinize %10 indirim uygulanır, siparişiniz 10 dakikada hazır olur.' },
    { q: 'Glutensiz seçeneğiniz var mı?', a: 'Bulgur buğdaydan yapıldığı için çiğ köftemiz gluten içerir. Çölyak hastalarına önermiyoruz.' },
  ],
  footer: {
    about: 'İsot, Konya Ereğli’de acısını müşterisinin seçtiği, her gün elde yoğrulan çiğ köftecidir.',
  },
  ui,
  photo: (id) => photoUrl('cigkofte-butik', id),
};
