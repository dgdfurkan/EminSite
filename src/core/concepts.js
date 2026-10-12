// Üç konseptin hafif kimlik bilgileri. Ağır içerik (menü, 3D sahne) her konseptin kendi modülünde.
export const CONCEPTS = {
  cigkofte: {
    id: 'cigkofte',
    label: 'Çiğ Köfte',
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
    brand: 'Dem Telve',
    full: 'Dem Telve Kahve Evi',
    tagline: 'Bir fincan kahvenin kırk yıl hatırı vardır.',
    bg: '#F5EEE3',
    ink: '#2B1B13',
    primary: '#B95D3B',
    accent: '#8C9A76',
  },
};

export const CONCEPT_ORDER = ['cigkofte', 'durum', 'kafe'];
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
