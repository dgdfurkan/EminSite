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

export function mark(conceptId, colors, uid) {
  if (conceptId === 'durum') return korMark(colors, uid);
  if (conceptId === 'kafe') return demMark(colors);
  return yogrumMark(colors);
}

// Başlık / alt bilgi logosu (işaret + yazı)
export function logo(conceptId, uid = 'logo') {
  if (conceptId === 'durum') {
    return `<span class="logo logo--kor"><span class="logo__word">K</span>${korMark({}, uid)}<span class="logo__word">R</span><span class="logo__sub">Ocakbaşı<br>Dürüm</span></span>`;
  }
  if (conceptId === 'kafe') {
    return `<span class="logo logo--dem">${demMark()}<span class="logo__word">Dem <em>Telve</em></span></span>`;
  }
  return `<span class="logo logo--yogrum">${yogrumMark()}<span class="logo__word">yoğrum</span></span>`;
}

export function faviconHref(conceptId) {
  let svg;
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
