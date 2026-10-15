import * as THREE from 'three';

// Tüm dokular canvas ile prosedürel üretilir; harici görsel yok.
// Aynı parametrelerle tekrar istenen doku önbellekten döner.

const cache = new Map();

export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function toTexture(canvas, { srgb = true, repeat = false } = {}) {
  const t = new THREE.CanvasTexture(canvas);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

function cached(key, fn) {
  if (!cache.has(key)) cache.set(key, fn());
  return cache.get(key);
}

function blot(ctx, x, y, r, color, alpha = 1) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// --- Taneli yüzey (çiğ köfte, et, hamur) ------------------------------------
export function grainTexture(opts) {
  const key = 'grain:' + JSON.stringify(opts);
  return cached(key, () => {
    const { size = 512, base, blotches = [], specks = [], seed = 7 } = opts;
    const r = rng(seed);
    const c = makeCanvas(size, size);
    const b = makeCanvas(size, size);
    const ctx = c.getContext('2d');
    const bx = b.getContext('2d');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);
    bx.fillStyle = '#808080';
    bx.fillRect(0, 0, size, size);

    for (const bl of blotches) {
      for (let i = 0; i < bl.count; i++) {
        const x = r() * size;
        const y = r() * size;
        const rad = bl.size[0] + r() * (bl.size[1] - bl.size[0]);
        // Kenarlarda dikiş izi olmasın diye sarmalı çiz
        for (const [dx, dy] of [
          [0, 0],
          [size, 0],
          [-size, 0],
          [0, size],
          [0, -size],
        ]) {
          blot(ctx, x + dx, y + dy, rad, bl.color, bl.alpha ?? 0.5);
        }
      }
    }

    for (const sp of specks) {
      ctx.fillStyle = sp.color;
      for (let i = 0; i < sp.count; i++) {
        const x = r() * size;
        const y = r() * size;
        const s = sp.size[0] + r() * (sp.size[1] - sp.size[0]);
        const rot = r() * Math.PI;
        ctx.globalAlpha = sp.alpha ?? 1;
        ctx.beginPath();
        ctx.ellipse(x, y, s, s * (sp.aspect ?? 0.62), rot, 0, Math.PI * 2);
        ctx.fill();
        if (sp.bump !== 0) {
          const v = sp.bump ?? 1;
          bx.globalAlpha = 0.9;
          bx.fillStyle = v > 0 ? '#d8d8d8' : '#3a3a3a';
          bx.beginPath();
          bx.ellipse(x, y, s, s * (sp.aspect ?? 0.62), rot, 0, Math.PI * 2);
          bx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
    return { map: toTexture(c, { repeat: true }), bump: toTexture(b, { srgb: false, repeat: true }) };
  });
}

// Çiğ köfte yüzeyi: bulgur taneleri, isot ve maydanoz benekleri, avuç/parmak izi çizgileri
export function kofteTexture() {
  return cached('kofte2', () => {
    const S = 1024;
    const r = rng(11);
    const c = makeCanvas(S, S);
    const b = makeCanvas(S, S);
    const ctx = c.getContext('2d');
    const bx = b.getContext('2d');
    ctx.fillStyle = '#7d2715';
    ctx.fillRect(0, 0, S, S);
    bx.fillStyle = '#808080';
    bx.fillRect(0, 0, S, S);
    const wrapBlot = (x, y, rad, col, a) => {
      for (const [dx, dy] of [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]]) blot(ctx, x + dx, y + dy, rad, col, a);
    };
    for (let i = 0; i < 90; i++) wrapBlot(r() * S, r() * S, 30 + r() * 90, '#5a1608', 0.35);
    for (let i = 0; i < 60; i++) wrapBlot(r() * S, r() * S, 24 + r() * 70, '#b2482a', 0.28);
    // parmak izi: ince, kavisli ve paralel sırtlar (yalnız kabartma haritasında)
    bx.lineWidth = 1.6;
    for (let p = 0; p < 26; p++) {
      const cx = r() * S;
      const cy = r() * S;
      const rot = r() * Math.PI;
      const rings = 7 + Math.floor(r() * 8);
      for (let k = 0; k < rings; k++) {
        bx.strokeStyle = k % 2 ? 'rgba(170,170,170,0.55)' : 'rgba(90,90,90,0.55)';
        bx.beginPath();
        bx.ellipse(cx, cy, 12 + k * 7, 7 + k * 4.5, rot, Math.PI * 0.1, Math.PI * 1.25);
        bx.stroke();
      }
    }
    const specks = [
      { color: '#a0442a', count: 6400, size: [1.5, 3.4], bump: 1 },
      { color: '#b06244', count: 1100, size: [1.1, 2.2], bump: 1 },
      { color: '#3f0c04', count: 2400, size: [1.2, 2.8], bump: -1 },
      { color: '#4f7d2a', count: 380, size: [1.4, 3.6], aspect: 0.38, bump: 0 },
      { color: '#e8c79c', count: 90, size: [1, 2.2], bump: 1 },
    ];
    for (const sp of specks) {
      for (let i = 0; i < sp.count; i++) {
        const x = r() * S;
        const y = r() * S;
        const sz = sp.size[0] + r() * (sp.size[1] - sp.size[0]);
        const rot = r() * Math.PI;
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.ellipse(x, y, sz, sz * (sp.aspect ?? 0.62), rot, 0, Math.PI * 2);
        ctx.fill();
        if (sp.bump) {
          bx.fillStyle = sp.bump > 0 ? '#dcdcdc' : '#2e2e2e';
          bx.beginPath();
          bx.ellipse(x, y, sz, sz * (sp.aspect ?? 0.62), rot, 0, Math.PI * 2);
          bx.fill();
        }
      }
    }
    const map = toTexture(c, { repeat: true });
    const bump = toTexture(b, { srgb: false, repeat: true });
    map.repeat.set(1, 1.5);
    bump.repeat.set(1, 1.5);
    return { map, bump };
  });
}

// --- Lavaş -----------------------------------------------------------------
export function lavasTexture(seed = 3, repeatX = 1) {
  return cached('lavas:' + seed + ':' + repeatX, () => {
    const W = 1024;
    const H = 512;
    const r = rng(seed);
    const c = makeCanvas(W, H);
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#f0d9aa');
    g.addColorStop(0.5, '#ead09b');
    g.addColorStop(1, '#efd6a6');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 120; i++) blot(ctx, r() * W, r() * H, 20 + r() * 60, '#dcb77a', 0.35);
    // sac izleri (kızarmış benekler)
    for (let i = 0; i < 90; i++) {
      const x = r() * W;
      const y = r() * H;
      const rad = 5 + r() * 22;
      blot(ctx, x, y, rad, '#8a5426', 0.55 + r() * 0.3);
      if (r() > 0.5) blot(ctx, x + rad * 0.2, y, rad * 0.4, '#4e2a10', 0.6);
    }
    ctx.fillStyle = 'rgba(70,38,14,0.55)';
    for (let i = 0; i < 500; i++) {
      ctx.beginPath();
      ctx.arc(r() * W, r() * H, 0.6 + r() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    // un tozu
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 1200; i++) ctx.fillRect(r() * W, r() * H, 1.2, 1.2);
    const t = toTexture(c, { repeat: true });
    t.repeat.set(repeatX, 1);
    return t;
  });
}

// --- Dürüm iç harcı (üstten görünen) ----------------------------------------
export function fillingTexture(kind = 'cigkofte') {
  return cached('filling:' + kind, () => {
    const S = 512;
    const r = rng(kind.length * 13);
    const c = makeCanvas(S, S);
    const ctx = c.getContext('2d');
    const palettes = {
      cigkofte: { base: '#9a361a', bits: ['#7a2410', '#c25a2c', '#5fa634', '#79c043', '#e7d27a'] },
      adana: { base: '#6b3415', bits: ['#3a1a0b', '#8a4a1f', '#c7372f', '#5f9a35', '#efe0c8'] },
      urfa: { base: '#74401c', bits: ['#3d1d0c', '#94552a', '#d0402f', '#5f9a35', '#efe0c8'] },
      tavuk: { base: '#d39a52', bits: ['#a8662a', '#e8b874', '#6a3a14', '#5f9a35', '#c7372f'] },
      ciger: { base: '#4a1f14', bits: ['#2a0f08', '#6e3020', '#efe0c8', '#5f9a35', '#b85a8f'] },
      kuzu: { base: '#5c2c14', bits: ['#30150a', '#87461e', '#c7372f', '#5f9a35', '#efe0c8'] },
      doner: { base: '#cf9450', bits: ['#9c5e24', '#e8bc7c', '#5f9a35', '#c7372f', '#f2e6c8'] },
      etdoner: { base: '#6e3a1a', bits: ['#3f1d0a', '#94552a', '#5f9a35', '#c7372f', '#f2e6c8'] },
    };
    const p = palettes[kind] || palettes.cigkofte;
    ctx.fillStyle = p.base;
    ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = p.bits[Math.floor(r() * p.bits.length)];
      const x = r() * S;
      const y = r() * S;
      const w = 6 + r() * 26;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(r() * Math.PI);
      ctx.beginPath();
      ctx.roundRect(-w / 2, -w * 0.3, w, w * 0.6, w * 0.25);
      ctx.fill();
      ctx.restore();
    }
    return toTexture(c);
  });
}

// --- Ambalaj kâğıdı ----------------------------------------------------------
export function paperTexture(style = 'yogrum') {
  return cached('paper:' + style, () => {
    const W = 1024;
    const H = 512;
    const r = rng(5);
    const c = makeCanvas(W, H);
    const ctx = c.getContext('2d');
    if (style === 'zirh') {
      ctx.fillStyle = '#171615';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 1800; i++) {
        ctx.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.12)';
        ctx.fillRect(r() * W, r() * H, 1 + r() * 14, 1);
      }
      ctx.fillStyle = '#c3a16c';
      ctx.fillRect(0, H * 0.24, W, 2);
      ctx.fillRect(0, H * 0.7, W, 2);
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      for (let i = 0; i < 3; i++) {
        const x = (i + 0.5) * (W / 3);
        ctx.font = `500 54px 'Bodoni Moda Variable', serif`;
        ctx.fillText('Z I R H', x, H * 0.44);
        ctx.font = `600 15px 'Inter Tight Variable', sans-serif`;
        ctx.fillText('O C A K B A Ş I   ·   E R E Ğ L İ', x, H * 0.58);
      }
      return toTexture(c, { repeat: true });
    }
    if (style === 'avuc') {
      ctx.fillStyle = '#efe7da';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 2200; i++) {
        ctx.fillStyle = r() > 0.5 ? 'rgba(120,90,60,0.06)' : 'rgba(255,255,255,0.18)';
        ctx.fillRect(r() * W, r() * H, 1 + r() * 12, 1);
      }
      ctx.fillStyle = '#7a1f1f';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      for (let i = 0; i < 3; i++) {
        const x = (i + 0.5) * (W / 3);
        ctx.font = `400 64px 'Instrument Serif', serif`;
        ctx.fillText('Avuç', x, H * 0.42);
        ctx.font = `600 14px 'Inter Tight Variable', sans-serif`;
        ctx.fillText('Ç İ Ğ   K Ö F T E   A T Ö L Y E S İ', x, H * 0.56);
      }
      ctx.fillRect(0, H * 0.74, W, 1.5);
      return toTexture(c, { repeat: true });
    }
    if (style === 'isot') {
      // ince sülfit kâğıt, isot kırmızısı geniş yazı
      ctx.fillStyle = '#f5f1e8';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 2000; i++) {
        ctx.fillStyle = r() > 0.5 ? 'rgba(140,110,80,0.06)' : 'rgba(255,255,255,0.2)';
        ctx.fillRect(r() * W, r() * H, 1 + r() * 12, 1);
      }
      ctx.fillStyle = '#b8222b';
      ctx.fillRect(0, H * 0.16, W, 10);
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      for (let i = 0; i < 3; i++) {
        const x = (i + 0.5) * (W / 3);
        ctx.font = `900 extra-expanded 84px 'Anybody Variable', sans-serif`;
        ctx.fillText('isot', x, H * 0.4);
        ctx.font = `700 19px 'Atkinson Hyperlegible Next Variable', sans-serif`;
        ctx.fillText('Ç İ Ğ   K Ö F T E   ·   E R E Ğ L İ', x, H * 0.58);
      }
      ctx.fillStyle = '#4f7a2e';
      ctx.fillRect(0, H * 0.72, W, 6);
      return toTexture(c, { repeat: true });
    }
    if (style === 'ocak') {
      // beyaz yağlı kâğıt, kırmızı tabela yazısı
      ctx.fillStyle = '#f7f5ef';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 1600; i++) {
        ctx.fillStyle = r() > 0.5 ? 'rgba(120,110,90,0.05)' : 'rgba(255,255,255,0.3)';
        ctx.fillRect(r() * W, r() * H, 1 + r() * 16, 1);
      }
      ctx.fillStyle = '#c4161c';
      ctx.fillRect(0, H * 0.2, W, H * 0.3);
      ctx.fillStyle = '#f7f5ef';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      for (let i = 0; i < 3; i++) {
        const x = (i + 0.5) * (W / 3);
        ctx.font = `800 104px 'Big Shoulders Display Variable', Impact, sans-serif`;
        ctx.fillText('OCAK 42', x, H * 0.355);
      }
      ctx.fillStyle = '#c4161c';
      for (let i = 0; i < 3; i++) {
        const x = (i + 0.5) * (W / 3);
        ctx.font = `700 26px 'Big Shoulders Display Variable', Impact, sans-serif`;
        ctx.fillText('OCAKBAŞI DÜRÜM  ·  EREĞLİ', x, H * 0.6);
      }
      ctx.fillRect(0, H * 0.7, W, 3);
      return toTexture(c, { repeat: true });
    }
    if (style === 'kor') {
      ctx.fillStyle = '#c49a68';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 2400; i++) {
        ctx.fillStyle = r() > 0.5 ? 'rgba(120,80,40,0.18)' : 'rgba(240,210,170,0.16)';
        ctx.fillRect(r() * W, r() * H, 1 + r() * 18, 1);
      }
      // turuncu bant
      ctx.fillStyle = '#ff5a1f';
      ctx.fillRect(0, H * 0.7, W, 26);
      ctx.fillStyle = '#1a1210';
      ctx.font = `400 92px Anton, Impact, sans-serif`;
      ctx.textBaseline = 'middle';
      for (let i = 0; i < 4; i++) {
        const x = i * (W / 4) + 30;
        ctx.fillText('KOR', x, H * 0.42);
      }
      ctx.font = `700 22px 'Archivo Variable', sans-serif`;
      for (let i = 0; i < 4; i++) {
        ctx.fillText('OCAKBAŞI · EREĞLİ', i * (W / 4) + 18, H * 0.58);
      }
    } else {
      ctx.fillStyle = '#fffdf8';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#d7262f';
      ctx.lineWidth = 10;
      for (let i = -H; i < W + H; i += 56) {
        ctx.beginPath();
        ctx.moveTo(i, H);
        ctx.lineTo(i + H * 0.55, H * 0.66);
        ctx.stroke();
      }
      ctx.fillStyle = '#fffdf8';
      ctx.fillRect(0, H * 0.18, W, H * 0.44);
      ctx.fillStyle = '#d7262f';
      ctx.font = `800 96px 'Bricolage Grotesque Variable', sans-serif`;
      ctx.textBaseline = 'middle';
      for (let i = 0; i < 3; i++) ctx.fillText('yoğrum', i * (W / 3) + 22, H * 0.38);
      ctx.fillStyle = '#5fa634';
      ctx.font = `700 22px 'Bricolage Grotesque Variable', sans-serif`;
      for (let i = 0; i < 3; i++) ctx.fillText('ÇİĞ KÖFTE · EREĞLİ', i * (W / 3) + 30, H * 0.54);
    }
    return toTexture(c, { repeat: true });
  });
}

// --- Dilimler: limon, domates, salatalık ------------------------------------
export function sliceTexture(kind = 'lemon') {
  return cached('slice:' + kind, () => {
    const S = 512;
    const c = makeCanvas(S, S);
    const ctx = c.getContext('2d');
    const cx = S / 2;
    const r = rng(kind.length * 31);
    const P = {
      lemon: { rind: '#f2c21b', pith: '#fff4cc', flesh: '#f8d94c', flesh2: '#fbe680', seg: 10 },
      orange: { rind: '#f08a1c', pith: '#fff0d6', flesh: '#f7a43a', flesh2: '#ffc66e', seg: 10 },
      tomato: { rind: '#d22a1e', pith: '#e8452f', flesh: '#e0412d', flesh2: '#f07a54', seg: 4 },
      cucumber: { rind: '#2f6b23', pith: '#b9d98a', flesh: '#d8ecb0', flesh2: '#eef7d6', seg: 3 },
    }[kind];
    ctx.fillStyle = P.rind;
    ctx.beginPath();
    ctx.arc(cx, cx, S / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = P.pith;
    ctx.beginPath();
    ctx.arc(cx, cx, S / 2 - 20, 0, Math.PI * 2);
    ctx.fill();
    if (kind === 'lemon' || kind === 'orange') {
      const R = S / 2 - 34;
      for (let i = 0; i < P.seg; i++) {
        const a0 = (i / P.seg) * Math.PI * 2 + 0.035;
        const a1 = ((i + 1) / P.seg) * Math.PI * 2 - 0.035;
        const g = ctx.createRadialGradient(cx, cx, 10, cx, cx, R);
        g.addColorStop(0, P.flesh2);
        g.addColorStop(1, P.flesh);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos((a0 + a1) / 2) * 16, cx + Math.sin((a0 + a1) / 2) * 16);
        ctx.arc(cx, cx, R, a0, a1);
        ctx.closePath();
        ctx.fill();
        // öz damarları
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 1.2;
        for (let k = 0; k < 14; k++) {
          const a = a0 + (a1 - a0) * r();
          const d0 = 30 + r() * (R - 60);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * d0, cx + Math.sin(a) * d0);
          ctx.lineTo(cx + Math.cos(a) * (d0 + 18), cx + Math.sin(a) * (d0 + 18));
          ctx.stroke();
        }
      }
      ctx.fillStyle = P.pith;
      ctx.beginPath();
      ctx.arc(cx, cx, 16, 0, Math.PI * 2);
      ctx.fill();
    } else if (kind === 'tomato') {
      const R = S / 2 - 40;
      ctx.fillStyle = P.flesh;
      ctx.beginPath();
      ctx.arc(cx, cx, R + 18, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < P.seg; i++) {
        const a = (i / P.seg) * Math.PI * 2 + 0.4;
        const x = cx + Math.cos(a) * R * 0.55;
        const y = cx + Math.sin(a) * R * 0.55;
        ctx.fillStyle = '#f2a06e';
        ctx.beginPath();
        ctx.ellipse(x, y, R * 0.34, R * 0.24, a, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f5d68a';
        for (let k = 0; k < 7; k++) {
          ctx.beginPath();
          ctx.ellipse(
            x + (r() - 0.5) * R * 0.36,
            y + (r() - 0.5) * R * 0.24,
            6,
            4,
            r() * Math.PI,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      ctx.fillStyle = '#e4553a';
      ctx.beginPath();
      ctx.arc(cx, cx, R * 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const g = ctx.createRadialGradient(cx, cx, 10, cx, cx, S / 2 - 24);
      g.addColorStop(0, P.flesh2);
      g.addColorStop(1, P.flesh);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cx, S / 2 - 24, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < P.seg; i++) {
        const a = (i / P.seg) * Math.PI * 2;
        for (let k = 0; k < 5; k++) {
          const d = 40 + k * 16;
          ctx.fillStyle = '#f6f9e6';
          ctx.beginPath();
          ctx.ellipse(cx + Math.cos(a) * d * 0.9, cx + Math.sin(a) * d * 0.9, 8, 4.5, a, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    return toTexture(c);
  });
}

// --- Marul yaprağı (renk + alfa) ---------------------------------------------
export function leafTexture(tone = 'lettuce') {
  return cached('leaf:' + tone, () => {
    const W = 512;
    const H = 768;
    const c = makeCanvas(W, H);
    const ctx = c.getContext('2d');
    const r = rng(tone.length * 7);
    const cx = W / 2;
    const cy = H * 0.52;
    const a = W * 0.45;
    const b = H * 0.47;
    const tones = {
      lettuce: { inner: '#eef5b0', mid: '#9fd25a', edge: '#4f9a2c', vein: 'rgba(245,250,215,0.85)' },
      gobek: { inner: '#f6f7d2', mid: '#cfe48f', edge: '#8dbb4c', vein: 'rgba(250,252,232,0.9)' },
      mint: { inner: '#7fbf5a', mid: '#4b9a3a', edge: '#2f6e24', vein: 'rgba(200,235,170,0.6)' },
      parsley: { inner: '#5fae3e', mid: '#3e8a2a', edge: '#2a6a1c', vein: 'rgba(190,230,150,0.55)' },
    };
    const T = tones[tone];
    ctx.beginPath();
    const N = 260;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const ruffle = 1 + 0.035 * Math.sin(t * 26) + 0.022 * Math.sin(t * 47 + 1.3) + 0.012 * Math.sin(t * 83);
      const narrow = 1 - 0.28 * Math.max(0, Math.sin(t)) ** 3;
      const x = cx + Math.cos(t) * a * ruffle * narrow;
      const y = cy - Math.sin(t) * b * ruffle;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    const g = ctx.createRadialGradient(cx, H * 0.92, 20, cx, cy, b * 1.1);
    g.addColorStop(0, T.inner);
    g.addColorStop(0.45, T.mid);
    g.addColorStop(1, T.edge);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.save();
    ctx.clip();
    for (let i = 0; i < 60; i++) blot(ctx, r() * W, r() * H, 20 + r() * 50, T.edge, 0.18);
    ctx.strokeStyle = T.vein;
    ctx.lineCap = 'round';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(cx, H);
    ctx.quadraticCurveTo(cx + 6, cy, cx - 4, cy - b * 0.92);
    ctx.stroke();
    ctx.lineWidth = 3;
    for (let i = 0; i < 9; i++) {
      const y = H * 0.9 - i * (b * 1.7) / 9;
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.quadraticCurveTo(cx + s * a * 0.4, y - 40, cx + s * a * (0.8 + r() * 0.15), y - 90 - r() * 40);
        ctx.stroke();
      }
    }
    ctx.restore();
    return toTexture(c);
  });
}

// --- Kahve yüzeyleri ------------------------------------------------------------
export function latteTexture(kind = 'heart') {
  return cached('latte:' + kind, () => {
    const S = 512;
    const c = makeCanvas(S, S);
    const ctx = c.getContext('2d');
    const cx = S / 2;
    const g = ctx.createRadialGradient(cx, cx, 20, cx, cx, S / 2);
    g.addColorStop(0, '#c99764');
    g.addColorStop(0.7, '#a86d3c');
    g.addColorStop(1, '#6e4220');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = '#f6ecdc';
    ctx.shadowColor = 'rgba(246,236,220,0.9)';
    ctx.shadowBlur = 10;
    if (kind === 'heart') {
      ctx.beginPath();
      ctx.moveTo(cx, cx + 120);
      ctx.bezierCurveTo(cx - 170, cx + 20, cx - 140, cx - 140, cx - 40, cx - 110);
      ctx.bezierCurveTo(cx - 10, cx - 100, cx, cx - 70, cx, cx - 60);
      ctx.bezierCurveTo(cx, cx - 70, cx + 10, cx - 100, cx + 40, cx - 110);
      ctx.bezierCurveTo(cx + 140, cx - 140, cx + 170, cx + 20, cx, cx + 120);
      ctx.fill();
      ctx.fillStyle = '#b9814e';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cx - 20, 6, 120, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (kind === 'rosetta') {
      for (let i = 0; i < 7; i++) {
        const y = cx - 130 + i * 38;
        const w = 120 - i * 12;
        ctx.beginPath();
        ctx.ellipse(cx, y, w, 22, 0, 0, Math.PI);
        ctx.ellipse(cx, y + 10, w * 0.82, 12, 0, Math.PI, 0, true);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(cx, cx - 150, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b9814e';
      ctx.fillRect(cx - 3, cx - 150, 6, 300);
    } else if (kind === 'tulip') {
      for (let i = 0; i < 3; i++) {
        const y = cx + 70 - i * 72;
        const w = 120 - i * 26;
        ctx.beginPath();
        ctx.ellipse(cx, y, w, 50 - i * 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b9814e';
        ctx.beginPath();
        ctx.ellipse(cx, y + 26 - i * 4, w * 0.72, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f6ecdc';
      }
    } else if (kind === 'foam') {
      ctx.shadowBlur = 0;
      const fg = ctx.createRadialGradient(cx, cx, 20, cx, cx, S / 2 - 30);
      fg.addColorStop(0, '#fbf5ea');
      fg.addColorStop(1, '#ead9c0');
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.arc(cx, cx, S / 2 - 26, 0, Math.PI * 2);
      ctx.fill();
      const r = rng(9);
      ctx.fillStyle = 'rgba(110,62,30,0.65)';
      for (let i = 0; i < 900; i++) {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r()) * 130;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * d, cx + Math.sin(a) * d, 0.8 + r() * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (kind === 'cinnamon') {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#f4e7d2';
      ctx.fillRect(0, 0, S, S);
      const r = rng(4);
      for (let i = 0; i < 1600; i++) {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r()) * 150;
        ctx.fillStyle = r() > 0.5 ? 'rgba(130,70,30,0.8)' : 'rgba(170,100,50,0.7)';
        ctx.fillRect(cx + Math.cos(a) * d, cx + Math.sin(a) * d, 1.5 + r() * 2, 1.5 + r() * 2);
      }
    } else if (kind === 'dark') {
      ctx.shadowBlur = 0;
      const dg = ctx.createRadialGradient(cx, cx, 10, cx, cx, S / 2);
      dg.addColorStop(0, '#5a321a');
      dg.addColorStop(0.8, '#3a1e0e');
      dg.addColorStop(1, '#2a150a');
      ctx.fillStyle = dg;
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = 'rgba(200,140,90,0.35)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cx, S / 2 - 40, 0, Math.PI * 2);
      ctx.stroke();
    } else if (kind === 'ayran') {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fbfaf4';
      ctx.fillRect(0, 0, S, S);
      const r = rng(12);
      ctx.strokeStyle = 'rgba(190,188,170,0.55)';
      for (let i = 0; i < 900; i++) {
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(r() * S, r() * S, 1 + r() * 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (kind === 'choco') {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#4a2814';
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = 'rgba(160,100,60,0.5)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(cx, cx, 30 + i * 32, i, i + 4);
        ctx.stroke();
      }
    }
    ctx.shadowBlur = 0;
    return toTexture(c);
  });
}

export function turkishFoamTexture() {
  return cached('tkfoam', () => {
    const S = 512;
    const c = makeCanvas(S, S);
    const ctx = c.getContext('2d');
    const r = rng(21);
    const cx = S / 2;
    const g = ctx.createRadialGradient(cx, cx, 30, cx, cx, S / 2);
    g.addColorStop(0, '#8c5e36');
    g.addColorStop(0.75, '#74492a');
    g.addColorStop(1, '#4a2c18');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < 70; i++) blot(ctx, r() * S, r() * S, 20 + r() * 60, '#a8784a', 0.35);
    ctx.strokeStyle = 'rgba(205,160,115,0.55)';
    for (let i = 0; i < 700; i++) {
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(r() * S, r() * S, 0.8 + r() * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    return toTexture(c);
  });
}

// --- Fincan deseni (lathe UV: u çevre, v profil) -------------------------------
export function cupPatternTexture(style = 'telve') {
  return cached('cup:' + style, () => {
    const W = 1024;
    const H = 256;
    const c = makeCanvas(W, H);
    const ctx = c.getContext('2d');
    if (style === 'telve') {
      // lathe v ekseni alttan üste; desen bandı fincanın üst yarısına gelsin
      ctx.fillStyle = '#b95d3b';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff3e2';
      ctx.fillRect(0, H * 0.14, W, H * 0.3);
      ctx.fillStyle = '#b95d3b';
      const n = 16;
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) * (W / n);
        ctx.beginPath();
        ctx.moveTo(x - 22, H * 0.44);
        ctx.lineTo(x - 22, H * 0.28);
        ctx.arc(x, H * 0.28, 22, Math.PI, 0);
        ctx.lineTo(x + 22, H * 0.44);
        ctx.fill();
      }
      ctx.fillStyle = '#d9b26a';
      ctx.fillRect(0, H * 0.12, W, 5);
      ctx.fillRect(0, H * 0.46, W, 5);
    } else if (style === 'porcelain') {
      ctx.fillStyle = '#f6f3ee';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#c9a96a';
      ctx.fillRect(0, 0, W, 6);
      ctx.fillRect(0, H * 0.2, W, 2);
    } else if (style === 'sage') {
      ctx.fillStyle = '#7d8c66';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#f6efe2';
      for (let i = 0; i < 24; i++) {
        ctx.beginPath();
        ctx.arc((i + 0.5) * (W / 24), H * 0.3, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (style === 'kobalt') {
      // Kütahya fincanı: beyaz porselen, kobalt lale bandı, yaldızlı ağız
      ctx.fillStyle = '#f7f6f2';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#c5a24a';
      ctx.fillRect(0, 0, W, 7);
      ctx.fillStyle = '#213f9a';
      ctx.fillRect(0, H * 0.13, W, 4);
      ctx.fillRect(0, H * 0.47, W, 4);
      const n = 12;
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) * (W / n);
        const y = H * 0.3;
        // lale: üç yaprak ve sap
        ctx.beginPath();
        ctx.moveTo(x, y + 26);
        ctx.bezierCurveTo(x - 24, y + 10, x - 20, y - 18, x - 6, y - 24);
        ctx.bezierCurveTo(x - 4, y - 8, x - 2, y - 4, x, y - 2);
        ctx.bezierCurveTo(x + 2, y - 4, x + 4, y - 8, x + 6, y - 24);
        ctx.bezierCurveTo(x + 20, y - 18, x + 24, y + 10, x, y + 26);
        ctx.fill();
        // yapraklar arası nokta
        ctx.beginPath();
        ctx.arc(x + W / n / 2, y + 2, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#c5a24a';
      ctx.fillRect(0, H * 0.96, W, 4);
    } else if (style === 'cream') {
      ctx.fillStyle = '#f3e9da';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#b95d3b';
      ctx.fillRect(0, 0, W, H * 0.08);
    }
    return toTexture(c, { repeat: true });
  });
}

// --- Fırın / tatlı yüzeyleri ----------------------------------------------------
export function bakedTexture(kind) {
  return cached('baked:' + kind, () => {
    const S = 512;
    const c = makeCanvas(S, S);
    const ctx = c.getContext('2d');
    const r = rng(kind.length * 17);
    if (kind === 'toast') {
      ctx.fillStyle = '#dca660';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 80; i++) blot(ctx, r() * S, r() * S, 20 + r() * 50, '#c7873f', 0.4);
      ctx.strokeStyle = 'rgba(90,45,15,0.85)';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.filter = 'blur(3px)';
      for (let i = -S; i < S * 2; i += 78) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + S * 0.6, S);
        ctx.stroke();
      }
      ctx.filter = 'none';
    } else if (kind === 'kunefe') {
      ctx.fillStyle = '#d9731c';
      ctx.fillRect(0, 0, S, S);
      ctx.lineCap = 'round';
      for (let i = 0; i < 1600; i++) {
        ctx.strokeStyle = ['#f29a35', '#b85c12', '#ffbf5e', '#e8851f'][Math.floor(r() * 4)];
        ctx.lineWidth = 1.4 + r() * 1.6;
        const x = r() * S;
        const y = r() * S;
        const a = r() * Math.PI;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14 + 6, x + Math.cos(a) * 26, y + Math.sin(a) * 26);
        ctx.stroke();
      }
      ctx.fillStyle = '#86a83c';
      for (let i = 0; i < 260; i++) {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r()) * 110;
        ctx.beginPath();
        ctx.arc(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d, 2 + r() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (kind === 'burnt') {
      ctx.fillStyle = '#4a2a14';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 90; i++) blot(ctx, r() * S, r() * S, 20 + r() * 70, r() > 0.5 ? '#2a160a' : '#8a5428', 0.45);
    } else if (kind === 'cheeseSide') {
      const g = ctx.createLinearGradient(0, S, 0, 0);
      g.addColorStop(0, '#d9b47c');
      g.addColorStop(0.06, '#f2dcae');
      g.addColorStop(0.72, '#f0d29a');
      g.addColorStop(0.8, '#c98a48');
      g.addColorStop(0.86, '#5a3318');
      g.addColorStop(1, '#3b2010');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 300; i++) {
        ctx.fillStyle = 'rgba(255,250,235,0.35)';
        ctx.beginPath();
        ctx.arc(r() * S, S * 0.2 + r() * S * 0.5, 1 + r() * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (kind === 'brownie') {
      ctx.fillStyle = '#3d2012';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 60; i++) blot(ctx, r() * S, r() * S, 20 + r() * 40, '#5b3420', 0.5);
      ctx.strokeStyle = 'rgba(120,80,55,0.6)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        let x = r() * S;
        let y = r() * S;
        ctx.moveTo(x, y);
        for (let k = 0; k < 4; k++) {
          x += (r() - 0.5) * 60;
          y += (r() - 0.5) * 60;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    } else if (kind === 'croissant') {
      ctx.fillStyle = '#d8913c';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 60; i++) blot(ctx, r() * S, r() * S, 30 + r() * 60, r() > 0.5 ? '#a8601e' : '#f0b45e', 0.4);
      ctx.strokeStyle = 'rgba(120,60,15,0.35)';
      ctx.lineWidth = 3;
      for (let i = 0; i < S; i += 14) {
        ctx.beginPath();
        ctx.moveTo(0, i + r() * 4);
        ctx.lineTo(S, i + r() * 4);
        ctx.stroke();
      }
    } else if (kind === 'lokum') {
      ctx.fillStyle = '#f7f1ea';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 3000; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.4 + r() * 0.6})`;
        ctx.fillRect(r() * S, r() * S, 1.5, 1.5);
      }
    } else if (kind === 'meat') {
      ctx.fillStyle = '#6a3214';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 90; i++) blot(ctx, r() * S, r() * S, 16 + r() * 40, r() > 0.5 ? '#3e1a09' : '#8f4d22', 0.5);
      ctx.fillStyle = 'rgba(200,140,80,0.6)';
      for (let i = 0; i < 500; i++) ctx.fillRect(r() * S, r() * S, 1.6, 1.6);
      ctx.fillStyle = 'rgba(170,40,20,0.7)';
      for (let i = 0; i < 260; i++) ctx.fillRect(r() * S, r() * S, 2.2, 1.4);
      ctx.strokeStyle = 'rgba(25,10,4,0.75)';
      ctx.lineWidth = 14;
      ctx.filter = 'blur(4px)';
      for (let i = 0; i < S; i += 96) {
        ctx.beginPath();
        ctx.moveTo(0, i + 30);
        ctx.lineTo(S, i + 30);
        ctx.stroke();
      }
      ctx.filter = 'none';
    } else if (kind === 'chicken') {
      ctx.fillStyle = '#d99a4e';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 90; i++) blot(ctx, r() * S, r() * S, 16 + r() * 40, r() > 0.5 ? '#a8622a' : '#f0c27e', 0.5);
      ctx.strokeStyle = 'rgba(80,35,10,0.6)';
      ctx.lineWidth = 12;
      ctx.filter = 'blur(4px)';
      for (let i = 0; i < S; i += 96) {
        ctx.beginPath();
        ctx.moveTo(0, i + 30);
        ctx.lineTo(S, i + 30);
        ctx.stroke();
      }
      ctx.filter = 'none';
    } else if (kind === 'mince') {
      ctx.fillStyle = '#b4463a';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 80; i++) blot(ctx, r() * S, r() * S, 14 + r() * 40, r() > 0.5 ? '#8a2a22' : '#cf6a5a', 0.45);
      for (let i = 0; i < 1400; i++) {
        ctx.fillStyle = ['#f3d6cc', '#e9b8aa', '#7a1e18', '#c0281c'][Math.floor(r() * 4)];
        ctx.beginPath();
        ctx.ellipse(r() * S, r() * S, 1 + r() * 2.6, 0.8 + r() * 1.6, r() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (kind === 'wood') {
      ctx.fillStyle = '#9a6a3e';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 140; i++) {
        ctx.strokeStyle = r() > 0.5 ? 'rgba(90,55,25,0.35)' : 'rgba(200,150,95,0.3)';
        ctx.lineWidth = 1 + r() * 3;
        const y = r() * S;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(S * 0.3, y + (r() - 0.5) * 20, S * 0.6, y + (r() - 0.5) * 20, S, y + (r() - 0.5) * 10);
        ctx.stroke();
      }
    } else if (kind === 'fries') {
      ctx.fillStyle = '#f3c25a';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 60; i++) blot(ctx, r() * S, r() * S, 10 + r() * 30, '#d9952e', 0.4);
    } else if (kind === 'simit') {
      ctx.fillStyle = '#b8672a';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 60; i++) blot(ctx, r() * S, r() * S, 16 + r() * 40, r() > 0.5 ? '#8a4618' : '#d08a44', 0.45);
      for (let i = 0; i < 1500; i++) {
        ctx.fillStyle = r() > 0.3 ? '#f3dcae' : '#e2c28a';
        ctx.beginPath();
        ctx.ellipse(r() * S, r() * S, 3.2, 1.6, r() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (kind === 'hammered') {
      ctx.fillStyle = '#9a9a9a';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 420; i++) {
        const x = r() * S;
        const y = r() * S;
        const rad = 8 + r() * 22;
        for (const [dx, dy] of [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]]) {
          const g = ctx.createRadialGradient(x + dx - rad * 0.2, y + dy - rad * 0.2, 0, x + dx, y + dy, rad);
          g.addColorStop(0, 'rgba(60,60,60,0.55)');
          g.addColorStop(0.7, 'rgba(140,140,140,0.25)');
          g.addColorStop(1, 'rgba(190,190,190,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x + dx, y + dy, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (kind === 'slate') {
      ctx.fillStyle = '#2a2a2b';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 120; i++) blot(ctx, r() * S, r() * S, 20 + r() * 80, r() > 0.5 ? '#1d1d1f' : '#3a3a3c', 0.35);
      for (let i = 0; i < 2600; i++) {
        ctx.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.25)';
        ctx.fillRect(r() * S, r() * S, 1 + r() * 2, 1 + r() * 2);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        const y = r() * S;
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(S * 0.3, y + (r() - 0.5) * 30, S * 0.7, y + (r() - 0.5) * 30, S, y);
        ctx.stroke();
      }
    } else if (kind === 'stone') {
      ctx.fillStyle = '#b9b1a5';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 140; i++) blot(ctx, r() * S, r() * S, 16 + r() * 60, r() > 0.5 ? '#a39a8d' : '#cdc6bb', 0.4);
      for (let i = 0; i < 3000; i++) {
        ctx.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
        ctx.fillRect(r() * S, r() * S, 1.4, 1.4);
      }
    } else if (kind === 'katmer') {
      ctx.fillStyle = '#e7c27e';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 90; i++) blot(ctx, r() * S, r() * S, 20 + r() * 50, r() > 0.5 ? '#c48e45' : '#f3d79c', 0.45);
      ctx.fillStyle = '#7fa13a';
      for (let i = 0; i < 700; i++) {
        ctx.beginPath();
        ctx.arc(S / 2 + (r() - 0.5) * S * 0.7, S / 2 + (r() - 0.5) * S * 0.7, 1.5 + r() * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (kind === 'baklava') {
      ctx.fillStyle = '#d9a34e';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 70; i++) blot(ctx, r() * S, r() * S, 20 + r() * 40, r() > 0.5 ? '#b5782e' : '#f0c477', 0.45);
      ctx.strokeStyle = 'rgba(120,70,20,0.35)';
      ctx.lineWidth = 2;
      for (let i = 0; i < S; i += 9) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(S, i + (r() - 0.5) * 4);
        ctx.stroke();
      }
    } else if (kind === 'ash') {
      ctx.fillStyle = '#242120';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 60; i++) blot(ctx, r() * S, r() * S, 20 + r() * 60, r() > 0.6 ? '#8f8a85' : '#141211', 0.5);
      for (let i = 0; i < 1600; i++) {
        ctx.fillStyle = r() > 0.5 ? 'rgba(200,195,190,0.35)' : 'rgba(0,0,0,0.4)';
        ctx.fillRect(r() * S, r() * S, 1.5, 1.5);
      }
    } else if (kind === 'ember') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = '#ffffff';
      ctx.lineCap = 'round';
      for (let i = 0; i < 90; i++) {
        let x = r() * S;
        let y = r() * S;
        ctx.lineWidth = 0.8 + r() * 2.2;
        ctx.globalAlpha = 0.45 + r() * 0.55;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let k = 0; k < 5; k++) {
          x += (r() - 0.5) * 70;
          y += (r() - 0.5) * 70;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < 14; i++) blot(ctx, r() * S, r() * S, 14 + r() * 26, '#ffffff', 0.2);
    } else if (kind === 'char') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 26; i++) blot(ctx, r() * S, r() * S, 20 + r() * 50, '#2a1a10', 0.75);
    }
    return toTexture(c, { repeat: true });
  });
}

// --- Etiketli ambalaj (kutu, kapak) -------------------------------------------
export function labelTexture({ bg, ink, title, sub, accent, font = 'Bricolage Grotesque Variable', weight = 800, stretch = 'normal', subFont = 'Manrope Variable', w = 1024, h = 512, stripes }) {
  return cached('label:' + JSON.stringify(arguments[0]), () => {
    const c = makeCanvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    if (stripes) {
      ctx.fillStyle = stripes;
      ctx.fillRect(0, h * 0.78, w, h * 0.06);
      ctx.fillRect(0, h * 0.14, w, h * 0.04);
    }
    if (accent) {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 1.25, w * 0.75, h * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const reps = w > h * 1.5 ? 2 : 1;
    for (let i = 0; i < reps; i++) {
      const x = (i + 0.5) * (w / reps);
      ctx.font = `${weight} ${stretch} ${Math.round(h * 0.26)}px '${font}', sans-serif`;
      ctx.fillText(title, x, h * 0.45);
      if (sub) {
        ctx.font = `700 ${Math.round(h * 0.075)}px '${subFont}', sans-serif`;
        ctx.fillText(sub, x, h * 0.66);
      }
    }
    return toTexture(c);
  });
}

// --- Yumuşak gölge ve ışık lekeleri -------------------------------------------
export function radialTexture(inner = 'rgba(0,0,0,0.6)', outer = 'rgba(0,0,0,0)') {
  return cached('radial:' + inner + outer, () => {
    const S = 256;
    const c = makeCanvas(S, S);
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    return toTexture(c);
  });
}

export function hexA(hex, a) {
  return hexToRgba(hex, a);
}

// Pirinç tepsi için kalem işi oyma deseni (lathe UV'sine göre: u çevre, v profil)
// topStart: üst yüzeyin profildeki v başlangıcı (kenar), merkez v=1
export function engravedTrayTexture(topStart = 0.3125) {
  return cached('engraved:' + topStart, () => {
    const W = 2048;
    const H = 1024;
    const c = makeCanvas(W, H);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    const yOf = (f) => f * (1 - topStart) * H; // f: 0 merkez, 1 kenar
    ctx.strokeStyle = '#7a7a7a';
    ctx.lineCap = 'round';
    // halkalar
    for (const [f, w] of [[0.96, 5], [0.92, 3], [0.63, 3], [0.6, 5], [0.24, 3], [0.21, 2]]) {
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(0, yOf(f));
      ctx.lineTo(W, yOf(f));
      ctx.stroke();
    }
    // kemer ve lale motifli bant
    const n = 28;
    ctx.lineWidth = 3;
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * (W / n);
      const w = W / n;
      const y0 = yOf(0.9);
      const y1 = yOf(0.65);
      ctx.beginPath();
      ctx.moveTo(x - w * 0.38, y0);
      ctx.lineTo(x - w * 0.38, (y0 + y1) / 2);
      ctx.quadraticCurveTo(x - w * 0.38, y1, x, y1);
      ctx.quadraticCurveTo(x + w * 0.38, y1, x + w * 0.38, (y0 + y1) / 2);
      ctx.lineTo(x + w * 0.38, y0);
      ctx.stroke();
      // lale
      const ty = (y0 + y1) / 2 + 6;
      ctx.beginPath();
      ctx.moveTo(x, y0 - 4);
      ctx.lineTo(x, ty);
      ctx.moveTo(x, ty);
      ctx.quadraticCurveTo(x - w * 0.18, ty - 8, x - w * 0.12, ty - 26);
      ctx.moveTo(x, ty);
      ctx.quadraticCurveTo(x + w * 0.18, ty - 8, x + w * 0.12, ty - 26);
      ctx.moveTo(x, ty);
      ctx.lineTo(x, ty - 30);
      ctx.stroke();
    }
    // ortada ışınsal yıldız
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 32; i++) {
      const x = (i / 32) * W;
      ctx.beginPath();
      ctx.moveTo(x, yOf(0.03));
      ctx.lineTo(x, yOf(i % 2 ? 0.14 : 0.19));
      ctx.stroke();
    }
    // hafif fırça izleri
    const r = rng(17);
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = r() > 0.5 ? '#000' : '#fff';
      ctx.fillRect(r() * W, r() * H, 30 + r() * 80, 1);
    }
    ctx.globalAlpha = 1;
    return toTexture(c, { srgb: false });
  });
}

