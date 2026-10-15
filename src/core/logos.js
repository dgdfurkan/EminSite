// Marka işaretleri. Aynı SVG hem başlıkta, hem favicon'da, hem de konsept seçicide kullanılır.

const yogrumMark = (c = {}) => `
<svg class="mark mark--yogrum" viewBox="0 0 64 48" aria-hidden="true" focusable="false">
  <path d="M15 10.5C15 4.5 21 1.5 26.5 2.5C25.5 8 21 11 15 10.5Z" fill="${c.leaf || '#6CB43F'}"/>
  <path d="M10 18C10 11 16 9 20 13C23 8 29 8 32 13C35 8 41 8 44 13C49 8 57 11 57 20C59 28 55 37 46 39C36 42 22 42 14 39C6 36 5 25 10 18Z" fill="${c.body || '#D7262F'}"/>
  <path d="M15 21C16 17 19 15.5 22 16" stroke="${c.shine || '#FFF4E8'}" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".75"/>
  <circle cx="27" cy="29" r="1.6" fill="${c.dot || '#9E1520'}"/>
  <circle cx="38" cy="25" r="1.3" fill="${c.dot || '#9E1520'}"/>
  <circle cx="45" cy="31" r="1.5" fill="${c.dot || '#9E1520'}"/>
</svg>`;

const korMark = (c = {}, id = 'kor') => `
<svg class="mark mark--kor" viewBox="0 0 48 56" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${id}-g" cx="50%" cy="68%" r="62%">
      <stop offset="0" stop-color="#FFF1B8"/>
      <stop offset=".35" stop-color="#FFC24A"/>
      <stop offset=".75" stop-color="${c.flame || '#FF5A1F'}"/>
      <stop offset="1" stop-color="#C2350A"/>
    </radialGradient>
  </defs>
  <path d="M24 3C31 13 41 19 41 33A17 17 0 0 1 7 33C7 24 13 20 16 12C18.5 18 21 20 24 20.5C23.5 15 22.5 9 24 3Z" fill="url(#${id}-g)"/>
  <path d="M24 26C27.5 30 31 33 31 38A7 7 0 0 1 17 38C17 34 20 31.5 21 28C22 30.5 23 31 24 31Z" fill="#FFF6D6" opacity=".9"/>
</svg>`;

const demMark = (c = {}) => `
<svg class="mark mark--dem" viewBox="0 0 48 56" aria-hidden="true" focusable="false">
  <path d="M3 54V25A21 21 0 0 1 45 25V54Z" fill="${c.arch || '#B95D3B'}"/>
  <path d="M16.5 20C16.5 27 20.5 30 20.5 34.5C20.5 39 16 41.5 16 46.5H32C32 41.5 27.5 39 27.5 34.5C27.5 30 31.5 27 31.5 20Z" fill="${c.glass || '#FFF8EE'}"/>
  <path d="M17.6 26C18.6 29 20.5 31 20.5 34.5C20.5 39 16.3 41.5 16.1 45.5H31.9C31.7 41.5 27.5 39 27.5 34.5C27.5 31 29.4 29 30.4 26Z" fill="${c.tea || '#7A2410'}"/>
  <rect x="11" y="47.5" width="26" height="2.6" rx="1.3" fill="${c.glass || '#FFF8EE'}"/>
  <path d="M21 16C19.5 13.5 22.5 12 21 9.5M27 16C25.5 13.5 28.5 12 27 9.5" stroke="${c.glass || '#FFF8EE'}" stroke-width="1.8" stroke-linecap="round" fill="none"/>
</svg>`;

// Premium seri: ince çizgili, tek renkli işaretler
const lineSvg = (cls, body, c = {}) =>
  `<svg class="mark mark--line ${cls}" viewBox="0 0 48 48" fill="none" stroke="${c.stroke || 'currentColor'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

const avucMark = (c) =>
  lineSvg(
    'mark--avuc',
    '<path d="M7.5 28c0-7.2 6.6-12.5 16.5-12.5S40.5 20.8 40.5 28 34 37 24 37 7.5 35.2 7.5 28Z"/><path d="M16.4 17.6c-1.5 3.2-1.5 6.4 0 9.6M23 15.7c-1.6 3.4-1.6 6.9 0 10.3M29.6 15.9c-1.6 3.3-1.6 6.7 0 10M35.6 18.4c-1.3 2.9-1.3 5.6 0 8.4"/>',
    c
  );

const zirhMark = (c) =>
  lineSvg(
    'mark--zirh',
    '<path d="M7 19.5c3.8 11.5 30.2 11.5 34 0"/><path d="M10.5 21.4c4.6 7.4 22.4 7.4 27 0"/><path d="M7 19.5V10M41 19.5V10"/><circle cx="7" cy="8" r="2"/><circle cx="41" cy="8" r="2"/>',
    c
  );

const sukunMark = (c) =>
  lineSvg(
    'mark--sukun',
    '<path d="M12 21h21v4.5c0 5.8-4.7 10.5-10.5 10.5S12 31.3 12 25.5V21Z"/><path d="M33 23.5h1.8a3.3 3.3 0 0 1 0 6.6H32"/><path d="M8 40h29"/><path d="M19.5 16c-1.6-2 1.6-3.2 0-5.4M25.5 16c-1.6-2 1.6-3.2 0-5.4"/>',
    c
  );

// Butik seri
const isotMark = (c = {}) => `
<svg class="mark mark--isot" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <path d="M30.6 13.4c5.6 1.4 8.1 7 6.3 13.3-2.3 8.2-10.1 15.3-23.3 16.9-2 .2-2.6-1.4-1-2.4 8.5-5.4 12-11.9 12.1-19.6 0-5.3 1.6-9.3 5.9-8.2Z" fill="${c.body || '#B8222B'}"/>
  <path d="M27.8 20.5c.2 6.4-2.6 12.4-8.3 17" stroke="${c.shine || '#FBF3EA'}" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".45"/>
  <path d="M27 15.3c1.4-2.1 4.4-2.9 6.7-1.5" stroke="${c.stem || '#4F7A2E'}" stroke-width="3.2" stroke-linecap="round" fill="none"/>
  <path d="M30.4 13.6c.1-3.1 1.6-5.8 4.4-7.1" stroke="${c.stem || '#4F7A2E'}" stroke-width="2.6" stroke-linecap="round" fill="none"/>
</svg>`;

const ocakMark = (c = {}) => `
<svg class="mark mark--ocak" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <rect x="2" y="7" width="44" height="34" rx="2.5" fill="${c.bg || '#C4161C'}"/>
  <text x="24" y="35.5" text-anchor="middle" font-family="'Big Shoulders Display Variable', 'Arial Narrow', Impact, sans-serif" font-weight="800" font-size="30" letter-spacing="1" fill="${c.ink || '#FBFAF6'}">42</text>
</svg>`;

const hatirMark = (c = {}) => `
<svg class="mark mark--hatir" viewBox="0 0 48 48" fill="none" stroke="${c.stroke || 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <path d="M11 19h24l-2.1 11.8a8 8 0 0 1-7.9 6.6h-4a8 8 0 0 1-7.9-6.6Z"/>
  <path d="M35 22h1.6a3.6 3.6 0 0 1 0 7.2H34"/>
  <path d="M7 41.5h32"/>
  <path d="M23 31c-2.6-1.1-3-3.9-1.6-5.7.9 1.1 1.3 1.8 1.6 2.7.3-.9.7-1.6 1.6-2.7 1.4 1.8 1 4.6-1.6 5.7Z" fill="${c.stroke || 'currentColor'}" stroke="none"/>
  <path d="M19 14.5c-1.3-1.6 1.3-2.8 0-4.6M26.5 14.5c-1.3-1.6 1.3-2.8 0-4.6"/>
</svg>`;

export function mark(conceptId, colors, uid) {
  if (conceptId === 'cigkofte-butik') return isotMark(colors);
  if (conceptId === 'durum-butik') return ocakMark(colors);
  if (conceptId === 'kafe-butik') return hatirMark(colors);
  if (conceptId === 'durum') return korMark(colors, uid);
  if (conceptId === 'kafe') return demMark(colors);
  if (conceptId === 'cigkofte-premium') return avucMark(colors);
  if (conceptId === 'durum-premium') return zirhMark(colors);
  if (conceptId === 'kafe-premium') return sukunMark(colors);
  return yogrumMark(colors);
}

// Başlık / alt bilgi logosu (işaret + yazı)
export function logo(conceptId, uid = 'logo') {
  if (conceptId === 'cigkofte-butik') {
    return `<span class="logo logo--isot">${isotMark()}<span class="logo__word">isot</span></span>`;
  }
  if (conceptId === 'durum-butik') {
    return `<span class="logo logo--ocak"><span class="logo__word">Ocak</span><span class="logo__num">42</span></span>`;
  }
  if (conceptId === 'kafe-butik') {
    return `<span class="logo logo--hatir">${hatirMark()}<span class="logo__word">Hatır</span></span>`;
  }
  if (conceptId === 'cigkofte-premium') {
    return `<span class="logo logo--p logo--avuc">${avucMark()}<span class="logo__text"><span class="logo__word">Avuç</span><span class="logo__sub">Çiğ Köfte Atölyesi</span></span></span>`;
  }
  if (conceptId === 'durum-premium') {
    return `<span class="logo logo--p logo--zirh">${zirhMark()}<span class="logo__text"><span class="logo__word">Zırh</span><span class="logo__sub">Ocakbaşı</span></span></span>`;
  }
  if (conceptId === 'kafe-premium') {
    return `<span class="logo logo--p logo--sukun">${sukunMark()}<span class="logo__text"><span class="logo__word">Sükûn</span><span class="logo__sub">Kahve Evi</span></span></span>`;
  }
  if (conceptId === 'durum') {
    return `<span class="logo logo--kor"><span class="logo__word">K</span>${korMark({}, uid)}<span class="logo__word">R</span><span class="logo__sub">Ocakbaşı<br>Dürüm</span></span>`;
  }
  if (conceptId === 'kafe') {
    return `<span class="logo logo--dem">${demMark()}<span class="logo__word">Dem <em>Telve</em></span></span>`;
  }
  return `<span class="logo logo--yogrum">${yogrumMark()}<span class="logo__word">yoğrum</span></span>`;
}

const premiumFav = { 'cigkofte-premium': ['#F3EEE6', '#7A1F1F'], 'durum-premium': ['#0F0E0D', '#C3A16C'], 'kafe-premium': ['#ECE8E1', '#3E2C22'] };

export function faviconHref(conceptId) {
  let svg;
  const inner = (m) => m.replace(/<svg[^>]*>/, '').replace('</svg>', '');
  if (conceptId === 'cigkofte-butik') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#CFE4A4"/>${inner(isotMark())}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
  if (conceptId === 'durum-butik') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#C4161C"/><text x="24" y="35" text-anchor="middle" font-family="Impact, 'Arial Narrow', sans-serif" font-weight="800" font-size="28" fill="#FBFAF6">42</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
  if (conceptId === 'kafe-butik') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#213F9A"/><g fill="none" stroke="#F7F6F2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${inner(hatirMark({ stroke: '#F7F6F2' }))}</g></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
  if (premiumFav[conceptId]) {
    const [bg, fg] = premiumFav[conceptId];
    const inner = mark(conceptId, { stroke: fg })
      .replace(/<svg[^>]*>/, '')
      .replace('</svg>', '');
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="${bg}"/><g fill="none" stroke="${fg}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
  if (conceptId === 'durum') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#110E0C"/><g transform="translate(8 4)">${korMark({}, 'fav')
      .replace(/<svg[^>]*>/, '')
      .replace('</svg>', '')}</g></svg>`;
  } else if (conceptId === 'kafe') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 56">${demMark()
      .replace(/<svg[^>]*>/, '')
      .replace('</svg>', '')}</svg>`;
  } else {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 48">${yogrumMark()
      .replace(/<svg[^>]*>/, '')
      .replace('</svg>', '')}</svg>`;
  }
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
