// Konseptlerin hafif kimlik bilgileri. Ağır içerik (menü, 3D sahne) her konseptin kendi modülünde.
export const CONCEPTS = {
  cigkofte: {
    id: 'cigkofte',
    label: 'Çiğ Köfte',
    short: 'Çiğ Köfte',
    tier: 'casual',
    brand: 'Yoğrum',
    full: 'Yoğrum Çiğ Köfte',
    tagline: 'Elde yoğrulur, gönülden sunulur.',
    bg: '#FFF4E8',
    ink: '#2A0A0C',
    primary: '#D7262F',
    accent: '#6CB43F',
  },
  durum: {
    id: 'durum',
    label: 'Dürüm',
    short: 'Dürüm',
    tier: 'casual',
    brand: 'KOR',
    full: 'KOR Ocakbaşı Dürüm',
    tagline: 'Közün hakkını veren dürüm.',
    bg: '#110E0C',
    ink: '#F4E6CF',
    primary: '#FF5A1F',
    accent: '#FFB23E',
  },
  kafe: {
    id: 'kafe',
    label: 'Kafe',
    short: 'Kafe',
    tier: 'casual',
    brand: 'Dem Telve',
    full: 'Dem Telve Kahve Evi',
    tagline: 'Bir fincan kahvenin kırk yıl hatırı vardır.',
    bg: '#F5EEE3',
    ink: '#2B1B13',
    primary: '#B95D3B',
    accent: '#8C9A76',
  },
  'cigkofte-premium': {
    id: 'cigkofte-premium',
    label: 'Premium Çiğ Köfte',
    short: 'Çiğ Köfte',
    tier: 'premium',
    brand: 'Avuç',
    full: 'Avuç Çiğ Köfte Atölyesi',
    tagline: 'Avucun izi, ustanın imzası.',
    bg: '#F3EEE6',
    ink: '#1C1715',
    primary: '#7A1F1F',
    accent: '#5D6345',
  },
  'durum-premium': {
    id: 'durum-premium',
    label: 'Premium Dürüm',
    short: 'Dürüm',
    tier: 'premium',
    brand: 'Zırh',
    full: 'Zırh Ocakbaşı',
    tagline: 'Meşe korunda, ustalıkla.',
    bg: '#0F0E0D',
    ink: '#ECE5DA',
    primary: '#C3A16C',
    accent: '#B4462C',
  },
  'kafe-premium': {
    id: 'kafe-premium',
    label: 'Premium Kafe',
    short: 'Kafe',
    tier: 'premium',
    brand: 'Sükûn',
    full: 'Sükûn Kahve Evi',
    tagline: 'Acele etmeyenlere.',
    bg: '#ECE8E1',
    ink: '#22201C',
    primary: '#3E2C22',
    accent: '#7F8A74',
  },
  'cigkofte-butik': {
    id: 'cigkofte-butik',
    label: 'Butik Çiğ Köfte',
    short: 'Çiğ Köfte',
    tier: 'butik',
    brand: 'İsot',
    full: 'İsot Çiğ Köfte',
    tagline: 'Acısını siz seçin.',
    bg: '#CFE4A4',
    ink: '#1E3511',
    primary: '#B8222B',
    accent: '#4F7A2E',
  },
  'durum-butik': {
    id: 'durum-butik',
    label: 'Butik Dürüm',
    short: 'Dürüm',
    tier: 'butik',
    brand: 'Ocak 42',
    full: 'Ocak 42 Dürüm',
    tagline: 'Közde pişer, elde sarılır.',
    bg: '#F2F1EC',
    ink: '#1D1D1B',
    primary: '#C4161C',
    accent: '#4F7A2E',
  },
  'kafe-butik': {
    id: 'kafe-butik',
    label: 'Butik Kafe',
    short: 'Kafe',
    tier: 'butik',
    brand: 'Hatır',
    full: 'Hatır Kahve',
    tagline: 'Kahveniz bizden, hatırı sizden.',
    bg: '#213F9A',
    ink: '#F7F6F2',
    primary: '#213F9A',
    accent: '#C5A24A',
  },
};

export const CONCEPT_GROUPS = {
  standard: ['cigkofte', 'durum', 'kafe'],
  premium: ['cigkofte-premium', 'durum-premium', 'kafe-premium'],
  butik: ['cigkofte-butik', 'durum-butik', 'kafe-butik'],
};

export const DEFAULT_CONCEPT = 'cigkofte';

export function getConceptId() {
  const p = new URLSearchParams(window.location.search).get('konsept');
  return CONCEPTS[p] ? p : DEFAULT_CONCEPT;
}

export function conceptUrl(id) {
  const url = new URL(window.location.href);
  if (id === DEFAULT_CONCEPT) url.searchParams.delete('konsept');
  else url.searchParams.set('konsept', id);
  url.hash = '';
  return url.toString();
}
