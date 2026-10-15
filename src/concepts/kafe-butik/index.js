import '@fontsource/young-serif/400.css';
import '@fontsource-variable/hanken-grotesk/wght.css';
import '../../styles/butik.css';
import '../../styles/butik-hatir.css';
import * as ui from '../../butik/hatir.js';
import { photoUrl } from '../../butik/common.js';

// Hatır: kobalt desenli Kütahya fincanında Türk kahvesi. Sonunda fal.

const seker = {
  id: 'seker',
  title: 'Şeker',
  type: 'single',
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
  default: 'inek',
  choices: [
    { id: 'inek', label: 'İnek sütü', hideInSummary: true },
    { id: 'yulaf', label: 'Yulaf sütü', price: 15 },
    { id: 'laktozsuz', label: 'Laktozsuz', price: 10 },
  ],
};

const categories = [
  {
    id: 'turk',
    name: 'Türk kahvesi',
    note: 'Bakır cezvede, közde pişer. Yanında su ve lokum gelir.',
    products: [
      {
        id: 'k-turk',
        name: 'Türk Kahvesi',
        desc: 'Közde, bakır cezvede, bol köpüklü.',
        long: 'Taze çekilmiş çekirdek, bakır cezvede ağır ağır pişer; köpüğü fincana kaşıkla paylaştırılır. Yanında bir bardak su ve lokum.',
        price: 80,
        tags: [{ text: 'En çok içilen' }],
        options: [seker],
      },
      { id: 'k-dibek', name: 'Dibek Kahvesi', desc: 'Taş dibekte dövülür, daha yumuşak içimli.', price: 90, options: [seker] },
      { id: 'k-menengic', name: 'Menengiç', desc: 'Kafeinsiz, sütlü ve fıstıksı.', price: 95, options: [seker] },
      { id: 'k-sakizli', name: 'Damla Sakızlı', desc: 'Sakızın serinliğiyle.', price: 90, options: [seker] },
    ],
  },
  {
    id: 'cay',
    name: 'Çay',
    products: [
      { id: 'c-cay', name: 'Çay', desc: 'İnce belli bardakta, tavşan kanı.', price: 25 },
      { id: 'c-demlik', name: 'Demlik Çay', desc: 'Dört bardaklık demlik.', price: 90 },
      { id: 'c-ihlamur', name: 'Ihlamur', desc: 'Bir dilim limonla.', price: 70 },
    ],
  },
  {
    id: 'espresso',
    name: 'Espresso ve süt',
    products: [
      { id: 'e-espresso', name: 'Espresso', desc: 'Kısa, yoğun, kremalı.', price: 75 },
      { id: 'e-latte', name: 'Latte', desc: 'Espresso ve ince köpüklü süt.', price: 115, options: [sut] },
      { id: 'e-flatwhite', name: 'Flat White', desc: 'Çift espresso, kadife süt.', price: 120, options: [sut] },
    ],
  },
  {
    id: 'tatli',
    name: 'Tatlılar',
    products: [
      { id: 't-lokum', name: 'Lokum Tabağı', desc: 'Güllü, fıstıklı ve sade.', price: 60 },
      { id: 't-baklava', name: 'Fıstıklı Baklava', desc: 'Üç dilim; ince yufka, Antep fıstığı.', price: 190 },
      { id: 't-sansebastian', name: 'San Sebastian', desc: 'Yanık yüzlü, içi akışkan cheesecake.', price: 165 },
    ],
  },
  {
    id: 'sabah',
    name: 'Sabah',
    note: 'Saat 12.00’ye kadar.',
    products: [
      { id: 's-simit', name: 'Simit ve Peynir', desc: 'Taze simit, beyaz peynir ve bir çay.', price: 95 },
      { id: 's-tost', name: 'Kaşarlı Tost', desc: 'Köy ekmeğinde, bol kaşarlı.', price: 120 },
    ],
  },
];

export default {
  id: 'kafe-butik',
  tier: 'butik',
  meta: {
    title: 'Hatır Kahve · Konya Ereğli',
    description: 'Bakır cezvede Türk kahvesi, dibek, menengiç ve tatlılar. Kobalt fincanlarda servis, sonunda fal. Ereğli içi paket servis.',
  },
  brand: { name: 'Hatır', full: 'Hatır Kahve', orderPrefix: 'HTR' },
  nav: [
    { href: '#menu', label: 'Menü' },
    { href: '#fal', label: 'Fal' },
    { href: '#ziyaret', label: 'Ziyaret' },
    { href: '#sss', label: 'Sorular' },
  ],
  hours: { open: '08:00', close: '00:00', label: 'Her gün', extra: 'Sabah menüsü 12.00’ye kadar' },
  delivery: { min: 150, fee: 20, freeOver: 350, eta: '25–35 dk', pickupEta: '10 dk', pickupDiscount: 0 },
  contact: {
    phoneDisplay: '0 (332) 000 00 00',
    phoneNote: 'Toplantı ve davetler için önceden arayın.',
    whatsapp: '',
    address: 'Ereğli Merkez, Konya',
    addressNote: 'Kahvehanemizin adresi çok yakında burada.',
    mapsQuery: 'Ereğli, Konya',
  },
  emptyCart: 'Bir Türk kahvesiyle başlayın; lokumu bizden.',
  hero: {
    title: ['Kahveniz bizden,', 'hatırı sizden.'],
    text: 'Bakır cezvede, közde pişen Türk kahvesi. Kobalt desenli fincanda gelir; yanında lokum, dibinde fal.',
    cta: 'Kahve seçin',
    cta2: 'Falıma bakın',
  },
  menu: { title: 'Menü', categories },
  fal: {
    title: 'Fincanı kapatın.',
    text: 'Kahvenizi bitirdiyseniz fincanı tabağa kapatın, biraz soğusun. Hazır olunca açın, telveye birlikte bakalım.',
    open: 'Fincanı aç',
    again: 'Bir daha bak',
    note: 'Fala inanma, falsız kalma.',
    readings: [
      { sym: 'kus', title: 'Kuş', text: 'Yakında bir haber var. Telefon çaldığında gülümseyerek açın.' },
      { sym: 'yol', title: 'Yol', text: 'Önünüzde kısa bir yol görünüyor. Dönüşü güzel bir sofraya çıkıyor.' },
      { sym: 'kalp', title: 'Kalp', text: 'Gönlünüz ferah. Birine kahve ısmarlamanın tam zamanı.' },
      { sym: 'balik', title: 'Balık', text: 'Kısmet kapıda. Belki de bir dilim baklavadır.' },
      { sym: 'anahtar', title: 'Anahtar', text: 'Bir kapı aralanıyor. Ne olduğunu kahve soğumadan anlarsınız.' },
      { sym: 'yildiz', title: 'Yıldız', text: 'Dileğiniz yolda. Biraz sabır, biraz şeker.' },
      { sym: 'agac', title: 'Ağaç', text: 'Kökleriniz sağlam. Sevdiklerinizle bir kahve molası iyi gelir.' },
      { sym: 'ay', title: 'Hilal', text: 'Gece sakin geçecek. Akşam kahvesini kafeinsiz menengiçten seçin.' },
    ],
  },
  faq: [
    { q: 'Türk kahvesi paket serviste soğumaz mı?', a: 'Kahveyi ısı tutan kapaklı bardakta, köpüğünü bozmadan gönderiyoruz. Yine de en güzeli, dükkânda közden yeni inmişini içmek.' },
    { q: 'Menengiç kafein içerir mi?', a: 'Hayır. Menengiç, yabani fıstık ağacının meyvesinden yapılır; kafein içermez.' },
    { q: 'Falı kim bakıyor?', a: 'Sitedeki fal eğlence içindir. Dükkânda da isteyen misafirimize, kahve bitince fincanını birlikte okuruz.' },
    { q: 'Bitki sütü var mı?', a: 'Latte ve flat white’ı yulaf sütüyle ya da laktozsuz sütle hazırlayabiliyoruz.' },
    { q: 'Paket servis nerelere var?', a: 'Ereğli merkez ve yakın mahallelere. En az sepet 150 TL; 350 TL ve üzerindeki siparişlerde teslimat ücretsiz.' },
  ],
  footer: {
    about: 'Hatır, Konya Ereğli’de Türk kahvesini bakır cezvede, közde pişiren ve kobalt fincanlarda sunan bir kahve evidir.',
  },
  ui,
  photo: (id) => photoUrl('kafe-butik', id),
};
