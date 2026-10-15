const moneyFormat = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export const money = (n) => moneyFormat.format(Math.round(n));

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;

export const isTouch = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
export const isMobile = () => window.innerWidth < 768;
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function trUpper(s) {
  return String(s).toLocaleUpperCase('tr-TR');
}

// "10:00" -> "10.00" (TDK saat yazımı). Gece yarısı kapanış "24.00" olarak yazılır.
export const fmtTime = (t) => (t === '00:00' ? '24.00' : t.replace(':', '.'));

function toMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Kapanış gece yarısını geçebilir (ör. 11:00 - 01:00).
export function openStatus(hours, now = new Date()) {
  const o = toMinutes(hours.open);
  const c = toMinutes(hours.close);
  const n = now.getHours() * 60 + now.getMinutes();
  const isOpen = c > o ? n >= o && n < c : n >= o || n < c;
  return {
    isOpen,
    short: isOpen ? 'Şu an açık' : 'Şu an kapalı',
    detail: isOpen ? `Kapanış ${fmtTime(hours.close)}` : `Açılış ${fmtTime(hours.open)}`,
  };
}

export function debounce(fn, ms = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// Türkçe telefon: 05XX XXX XX XX
export function formatPhone(raw) {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('90')) d = d.slice(2);
  if (d && d[0] !== '0') d = '0' + d;
  d = d.slice(0, 11);
  const parts = [d.slice(0, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)].filter(Boolean);
  return parts.join(' ');
}

export function isValidPhone(raw) {
  const d = raw.replace(/\D/g, '');
  return /^05\d{9}$/.test(d);
}

export function orderCode(prefix) {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${n}`;
}
