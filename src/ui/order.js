import { gsap } from 'gsap';
import { icon } from '../core/icons.js';
import { mark } from '../core/logos.js';
import { priceFor, defaultSelections } from '../core/cart.js';
import { $, $$, esc, money, formatPhone, isValidPhone, orderCode, openStatus, fmtTime } from '../core/util.js';

// Sipariş akışı: ürün penceresi, sepet çekmecesi, ödeme formu, onay ekranı.
export function initOrdering({ concept, catalog, cart, thumbs, scroller, viewerFactory }) {
  const drawer = $('#drawer');
  const pmodal = $('#pmodal');
  const scrim = $('[data-scrim]');
  const cartbar = $('[data-cartbar]');
  const toastEl = $('[data-toast]');
  const d = concept.delivery;
  let lastFocus = null;
  let openLayer = null; // 'drawer' | 'modal' | null
  let mode = 'delivery';
  let viewer = null;

  // ------------------------------------------------------------------ yardımcılar
  let locked = false;
  function lock(on) {
    if (on === locked) return;
    locked = on;
    if (on) scroller?.stop();
    else scroller?.start();
  }

  function showScrim(on) {
    scrim.classList.toggle('is-visible', on);
  }

  let toastTimer;
  function toast(msg) {
    toastEl.innerHTML = `${icon.check}<span>${esc(msg)}</span>`;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2200);
  }

  function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    const f = $$(
      'button:not([disabled]), [href], input:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])',
      container
    ).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function thumbFor(id) {
    const url = thumbs.get(id);
    return url ? `<img src="${url}" alt="">` : '';
  }

  // ------------------------------------------------------------------ uçan ürün
  function flyToCart(fromEl, productId) {
    if (document.documentElement.dataset.tier === 'premium') return bump();
    const url = thumbs.get(productId);
    const target = window.innerWidth < 900 && cartbar.classList.contains('is-visible') ? cartbar : $('[data-open-cart]');
    if (!url || !fromEl || !target) return bump();
    const a = fromEl.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const img = document.createElement('img');
    img.src = url;
    img.className = 'fly';
    img.alt = '';
    document.body.appendChild(img);
    const sx = a.left + a.width / 2 - 45;
    const sy = a.top + a.height / 2 - 45;
    const ex = b.left + b.width / 2 - 45;
    const ey = b.top + b.height / 2 - 45;
    gsap.set(img, { x: sx, y: sy, scale: 1.1 });
    const tl = gsap.timeline({ onComplete: () => (img.remove(), bump()) });
    tl.to(img, { x: ex, duration: 0.75, ease: 'power2.inOut' }, 0)
      .to(img, { y: Math.min(sy, ey) - 120, duration: 0.32, ease: 'power2.out' }, 0)
      .to(img, { y: ey, duration: 0.43, ease: 'power2.in' }, 0.32)
      .to(img, { scale: 0.25, rotate: 25, opacity: 0.4, duration: 0.75, ease: 'power1.in' }, 0);
  }

  function bump() {
    const btn = $('.cart-btn');
    if (!btn) return;
    btn.classList.remove('is-bump');
    void btn.offsetWidth;
    btn.classList.add('is-bump');
  }

  // ------------------------------------------------------------------ ürün penceresi
  let current = null;
  let sel = null;
  let qty = 1;

  function optionGroup(g) {
    const isSingle = g.type === 'single';
    const chosen = sel[g.id];
    return `
      <fieldset class="opt-group">
        <legend>${esc(g.title)} <small>${isSingle ? 'Zorunlu' : g.max ? `En fazla ${g.max}` : 'İsteğe bağlı'}</small></legend>
        <div class="opt-list">
          ${g.choices
            .map((ch) => {
              const checked = isSingle ? chosen === ch.id : chosen.includes(ch.id);
              return `<label class="opt"><input type="${isSingle ? 'radio' : 'checkbox'}" name="opt-${g.id}" value="${ch.id}" data-group="${g.id}" ${checked ? 'checked' : ''}><span>${esc(ch.label)}${ch.price ? ` <em>+${money(ch.price)}</em>` : ''}</span></label>`;
            })
            .join('')}
        </div>
      </fieldset>`;
  }

  function renderModal() {
    const p = current;
    const total = priceFor(p, sel).unit * qty;
    pmodal.innerHTML = `
      <div class="pmodal__dialog">
        <button class="icon-btn pmodal__close" type="button" data-close-modal aria-label="Kapat">${icon.close}</button>
        <div class="pmodal__body">
          <div class="pmodal__viewer" data-viewer>
            ${thumbFor(p.id)}
            <span class="pmodal__hint">${icon.rotate}Döndürmek için sürükleyin</span>
          </div>
          <div class="pmodal__right">
            <div class="pmodal__scroll">
              <div class="pmodal__content">
                <div>
                  ${(p.tags || []).map((t) => `<span class="tag ${t.kind ? 'tag--' + t.kind : ''}" style="margin-right:6px">${esc(t.text)}</span>`).join('')}
                  <h2 class="pmodal__title" id="pmodal-title" style="margin-top:${p.tags?.length ? 12 : 0}px">${esc(p.name)}</h2>
                  <p class="pmodal__desc">${esc(p.long || p.desc)}</p>
                  ${p.info ? `<p class="pmodal__desc" style="font-size:.85rem;margin-top:8px">${esc(p.info)}</p>` : ''}
                </div>
                ${(p.options || []).map(optionGroup).join('')}
                <div class="field">
                  <label for="pm-note">Ürün notu <small>(isteğe bağlı)</small></label>
                  <textarea id="pm-note" maxlength="140" placeholder="Örn. az soğanlı olsun" data-note></textarea>
                </div>
              </div>
            </div>
            <div class="pmodal__foot">
              <div class="qty qty--lg" aria-label="Adet">
                <button type="button" data-qty="-1" aria-label="Azalt">${icon.minus}</button>
                <output data-qty-out aria-live="polite">${qty}</output>
                <button type="button" data-qty="1" aria-label="Artır">${icon.plus}</button>
              </div>
              <button class="btn" type="button" data-add-confirm>Sepete ekle · <span data-modal-total>${money(total)}</span></button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function updateModalTotal() {
    const total = priceFor(current, sel).unit * qty;
    $('[data-modal-total]', pmodal).textContent = money(total);
    $('[data-qty-out]', pmodal).textContent = qty;
  }

  function openModal(productId, sourceEl) {
    const p = catalog.get(productId);
    if (!p) return;
    lastFocus = sourceEl || document.activeElement;
    current = p;
    sel = defaultSelections(p);
    qty = 1;
    renderModal();
    pmodal.classList.add('is-open');
    pmodal.setAttribute('aria-hidden', 'false');
    showScrim(true);
    lock(true);
    openLayer = 'modal';
    setTimeout(() => $('[data-close-modal]', pmodal)?.focus({ preventScroll: true }), 50);

    // Canlı 3D görüntüleyici
    const holder = $('[data-viewer]', pmodal);
    const spec = concept.thumb(p);
    if (viewerFactory && spec) {
      requestAnimationFrame(() => {
        viewer = viewer || viewerFactory();
        if (!viewer || current !== p) return;
        viewer.attach(holder);
        viewer.show(spec.build, spec.view);
        $('img', holder)?.remove();
      });
    }
  }

  function closeModal() {
    if (openLayer !== 'modal') return;
    pmodal.classList.remove('is-open');
    pmodal.setAttribute('aria-hidden', 'true');
    showScrim(false);
    lock(false);
    openLayer = null;
    syncBadges();
    setTimeout(() => {
      viewer?.stop();
      if (openLayer !== 'modal') pmodal.innerHTML = '';
    }, 450);
    lastFocus?.focus?.({ preventScroll: true });
  }

  pmodal.addEventListener('change', (e) => {
    const inp = e.target;
    if (!inp.dataset.group) return;
    const g = current.options.find((o) => o.id === inp.dataset.group);
    if (g.type === 'single') sel[g.id] = inp.value;
    else {
      const set = new Set(sel[g.id]);
      if (inp.checked) {
        if (g.max && set.size >= g.max) {
          inp.checked = false;
          toast(`Bu bölümden en fazla ${g.max} seçim yapabilirsiniz.`);
          return;
        }
        set.add(inp.value);
      } else set.delete(inp.value);
      // Sıralamayı menüdeki sırayla tut
      sel[g.id] = g.choices.map((c) => c.id).filter((id) => set.has(id));
    }
    updateModalTotal();
  });

  pmodal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-modal]') || e.target === pmodal) return closeModal();
    const q = e.target.closest('[data-qty]');
    if (q) {
      qty = Math.max(1, Math.min(20, qty + Number(q.dataset.qty)));
      updateModalTotal();
      return;
    }
    if (e.target.closest('[data-add-confirm]')) {
      const note = $('[data-note]', pmodal)?.value || '';
      const src = $('[data-viewer]', pmodal);
      cart.add(current, sel, qty, note);
      toast(`${current.name} sepete eklendi`);
      const pid = current.id;
      closeModal();
      setTimeout(() => flyToCart(src, pid), 80);
    }
  });

  // ------------------------------------------------------------------ sepet çekmecesi
  function deliveryFee(sub) {
    if (mode === 'pickup') return 0;
    return sub >= d.freeOver ? 0 : d.fee;
  }

  function pickupDiscount(sub) {
    return mode === 'pickup' && d.pickupDiscount ? Math.round(sub * d.pickupDiscount) : 0;
  }

  function totals() {
    const sub = cart.subtotal;
    const fee = deliveryFee(sub);
    const disc = pickupDiscount(sub);
    return { sub, fee, disc, grand: sub + fee - disc };
  }

  function totalsHtml() {
    const t = totals();
    return `
      <dl class="totals">
        <div><dt>Ara toplam</dt><dd>${money(t.sub)}</dd></div>
        <div><dt>${mode === 'pickup' ? 'Gel-al' : 'Teslimat ücreti'}</dt><dd>${mode === 'pickup' ? 'Ücretsiz' : t.fee ? money(t.fee) : 'Ücretsiz'}</dd></div>
        ${t.disc ? `<div><dt>Gel-al indirimi (%${Math.round(d.pickupDiscount * 100)})</dt><dd>−${money(t.disc)}</dd></div>` : ''}
        <div class="totals__grand"><dt>Toplam</dt><dd>${money(t.grand)}</dd></div>
      </dl>`;
  }

  function cartView() {
    if (!cart.items.length) {
      return `
        <div class="drawer__body">
          <div class="cart-empty">
            <div class="cart-empty__art">${mark(concept.id, {}, 'empty')}</div>
            <h3>Sepetiniz şimdilik boş</h3>
            <p>${esc(concept.emptyCart)}</p>
            <button class="btn btn--sm" type="button" data-go-menu>Menüye göz at ${icon.arrow}</button>
          </div>
        </div>`;
    }
    const sub = cart.subtotal;
    const left = Math.max(0, d.freeOver - sub);
    const pct = Math.min(100, (sub / d.freeOver) * 100);
    return `
      <div class="drawer__body">
        <div class="free-meter" style="margin-bottom:14px">
          <span>${left > 0 ? `Ücretsiz teslimata <strong>${money(left)}</strong> kaldı` : 'Teslimat bu siparişte ücretsiz'}</span>
          <div class="free-meter__bar"><span style="width:${pct}%"></span></div>
        </div>
        <ul class="cart-list">
          ${cart.items
            .map(
              (it) => `
            <li class="cart-line">
              <div class="cart-line__img">${thumbFor(it.productId)}</div>
              <div>
                <div class="cart-line__name">${esc(it.name)}</div>
                ${it.summary ? `<div class="cart-line__meta">${esc(it.summary)}</div>` : ''}
                ${it.note ? `<div class="cart-line__meta">Not: ${esc(it.note)}</div>` : ''}
                <div class="cart-line__price">${money(it.unitPrice * it.qty)}</div>
              </div>
              <div class="qty" aria-label="${esc(it.name)} adedi">
                <button type="button" data-line-qty="-1" data-key="${esc(it.key)}" aria-label="Azalt">${it.qty === 1 ? icon.trash : icon.minus}</button>
                <output>${it.qty}</output>
                <button type="button" data-line-qty="1" data-key="${esc(it.key)}" aria-label="Artır">${icon.plus}</button>
              </div>
            </li>`
            )
            .join('')}
        </ul>
      </div>
      <div class="drawer__foot">
        ${totalsHtml()}
        ${sub < d.min ? `<p class="form-hint form-hint--warn">Paket servis için en az sepet tutarı ${money(d.min)}. Gel-al siparişlerinde alt sınır yok.</p>` : ''}
        <button class="btn btn--block" type="button" data-checkout>Siparişi tamamla ${icon.arrow}</button>
      </div>`;
  }

  function checkoutView() {
    const st = openStatus(concept.hours);
    const minBlock = mode === 'delivery' && cart.subtotal < d.min;
    return `
      <div class="drawer__body">
        <form class="form" id="checkout-form" novalidate>
          <fieldset class="field">
            <legend>Teslimat şekli</legend>
            <div class="seg" role="radiogroup">
              <label><input type="radio" name="mode" value="delivery" ${mode === 'delivery' ? 'checked' : ''}><span>Adrese teslim<small>${esc(d.eta)}</small></span></label>
              <label><input type="radio" name="mode" value="pickup" ${mode === 'pickup' ? 'checked' : ''}><span>Gel-al<small>${esc(d.pickupEta)}${d.pickupDiscount ? ` · %${Math.round(d.pickupDiscount * 100)} indirim` : ''}</small></span></label>
            </div>
          </fieldset>
          <div class="field" data-field="name">
            <label for="f-name">Ad soyad</label>
            <input id="f-name" name="name" autocomplete="name" required placeholder="Adınız ve soyadınız">
            <span class="field__error">Lütfen adınızı ve soyadınızı yazın.</span>
          </div>
          <div class="field" data-field="phone">
            <label for="f-phone">Cep telefonu</label>
            <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="05XX XXX XX XX">
            <span class="field__error">Geçerli bir cep telefonu numarası girin (05XX XXX XX XX).</span>
          </div>
          ${
            mode === 'delivery'
              ? `
          <div class="field" data-field="hood">
            <label for="f-hood">Mahalle</label>
            <input id="f-hood" name="hood" autocomplete="address-level3" required placeholder="Örn. Ziya Gökalp Mahallesi">
            <span class="field__error">Mahallenizi yazın.</span>
          </div>
          <div class="field" data-field="address">
            <label for="f-address">Açık adres</label>
            <textarea id="f-address" name="address" autocomplete="street-address" required placeholder="Cadde, sokak, bina ve daire numarası"></textarea>
            <span class="field__error">Kuryemizin sizi bulabilmesi için açık adres gerekli.</span>
          </div>`
              : ''
          }
          <fieldset class="field">
            <legend>Ödeme</legend>
            <div class="seg">
              <label><input type="radio" name="pay" value="Kapıda nakit" checked><span>Nakit</span></label>
              <label><input type="radio" name="pay" value="Kapıda kart" ><span>Kart</span></label>
            </div>
            <small>${mode === 'delivery' ? 'Ödemeyi teslimatta kuryemize yaparsınız.' : 'Ödemeyi teslim alırken kasada yaparsınız.'}</small>
          </fieldset>
          <div class="field">
            <label for="f-note">Sipariş notu <small>(isteğe bağlı)</small></label>
            <textarea id="f-note" name="note" maxlength="200" placeholder="Örn. zili çalmayın, kapıda bekliyorum"></textarea>
          </div>
          <label class="check" data-field="kvkk">
            <input type="checkbox" name="kvkk" required>
            <span>Adım, telefonum ve adresimin yalnızca bu siparişin hazırlanması ve teslimi için kullanılmasını kabul ediyorum.</span>
          </label>
          <span class="field__error" data-kvkk-error style="margin-top:-8px">Devam etmek için onay kutusunu işaretleyin.</span>
          ${!st.isOpen ? `<p class="form-hint">${esc(st.short)}. Siparişiniz açılış saatinde (${fmtTime(concept.hours.open)}) hazırlanmaya başlar.</p>` : ''}
        </form>
      </div>
      <div class="drawer__foot">
        ${totalsHtml()}
        ${minBlock ? `<p class="form-hint form-hint--warn">Paket servis için sepetinize ${money(d.min - cart.subtotal)} değerinde daha ürün ekleyin ya da gel-al seçin.</p>` : ''}
        <button class="btn btn--block" type="submit" form="checkout-form" ${minBlock ? 'disabled' : ''} data-submit>${concept.contact.whatsapp ? `${icon.whatsapp} WhatsApp ile siparişi gönder` : `Siparişi onayla · ${money(totals().grand)}`}</button>
        <p class="form-hint">Fiyatlara KDV dahildir.</p>
      </div>`;
  }

  function successView(order) {
    return `
      <div class="drawer__body">
        <div class="success">
          <div class="success__check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
          <h3>${order.viaWhatsapp ? `Siparişiniz hazır, ${esc(order.firstName)}!` : `Siparişiniz alındı, ${esc(order.firstName)}!`}</h3>
          <p>${
            order.viaWhatsapp
              ? 'WhatsApp’ta açılan mesajı gönderdiğinizde siparişiniz bize ulaşır. Mesaj açılmadıysa aşağıdaki butonu kullanın.'
              : order.mode === 'delivery'
                ? `Tahmini teslimat süresi ${esc(d.eta)}. Kuryemiz yola çıkınca sizi arayacağız.`
                : `Siparişiniz ${esc(d.pickupEta)} içinde hazır olur. Dükkânda sipariş kodunuzu söylemeniz yeterli.`
          }</p>
          <span class="success__code">Sipariş kodu: ${esc(order.code)}</span>
          <ul class="success__summary">
            ${order.lines.map((l) => `<li><span>${l.qty} × ${esc(l.name)}</span><strong>${money(l.total)}</strong></li>`).join('')}
            <li style="border-top:1px dashed var(--line);margin-top:6px;padding-top:8px"><span>Toplam (${esc(order.pay)})</span><strong>${money(order.grand)}</strong></li>
          </ul>
          <a class="btn btn--block" href="${order.waUrl}" target="_blank" rel="noopener">${icon.whatsapp} ${order.viaWhatsapp ? 'WhatsApp’ı tekrar aç' : 'Siparişi WhatsApp’tan da ilet'}</a>
          <button class="btn btn--ghost btn--block" type="button" data-close-drawer>Siteye dön</button>
          ${order.viaWhatsapp ? '' : '<p class="success__note">Bu bir prototiptir: sipariş henüz gerçek bir işletmeye iletilmez. İşletmenin WhatsApp numarası eklendiğinde siparişler doğrudan oraya düşer.</p>'}
        </div>
      </div>`;
  }

  function renderDrawer(view = drawer.dataset.view, order) {
    drawer.dataset.view = view;
    const title = view === 'checkout' ? 'Sipariş bilgileri' : view === 'success' ? 'Teşekkürler' : 'Sepetim';
    drawer.innerHTML = `
      <span class="drawer__grab" aria-hidden="true"></span>
      <div class="drawer__head">
        <h2 class="drawer__title" id="drawer-title">
          <button class="icon-btn drawer__back" type="button" data-back aria-label="Sepete dön">${icon.back}</button>
          ${title}${view === 'cart' && cart.count ? ` <span class="tag tag--soft">${cart.count} ürün</span>` : ''}
        </h2>
        <button class="icon-btn" type="button" data-close-drawer aria-label="Kapat">${icon.close}</button>
      </div>
      <div class="drawer-view drawer-view--${view}">${view === 'cart' ? cartView() : view === 'checkout' ? checkoutView() : successView(order)}</div>`;
    if (view === 'checkout') bindCheckout();
  }

  function openDrawer(view = 'cart') {
    lastFocus = document.activeElement;
    if (openLayer === 'modal') closeModal();
    renderDrawer(view);
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    showScrim(true);
    lock(true);
    openLayer = 'drawer';
    cartbar.classList.remove('is-visible');
    setTimeout(() => $('[data-close-drawer]', drawer)?.focus({ preventScroll: true }), 60);
  }

  function closeDrawer() {
    if (openLayer !== 'drawer') return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    showScrim(false);
    lock(false);
    openLayer = null;
    if (drawer.dataset.view === 'success') drawer.dataset.view = 'cart';
    syncBadges();
    lastFocus?.focus?.({ preventScroll: true });
  }

  function bindCheckout() {
    const form = $('#checkout-form', drawer);
    const phone = $('#f-phone', form);
    phone.addEventListener('input', () => {
      const pos = phone.value.length;
      phone.value = formatPhone(phone.value);
      if (pos === phone.value.length) phone.setSelectionRange(pos, pos);
    });
    form.addEventListener('change', (e) => {
      if (e.target.name === 'mode') {
        // Girilen bilgileri koruyarak görünümü yenile
        const keep = Object.fromEntries(new FormData(form));
        mode = e.target.value;
        renderDrawer('checkout');
        const f2 = $('#checkout-form', drawer);
        for (const [k, v] of Object.entries(keep)) {
          const el = f2.elements[k];
          if (!el || k === 'mode') continue;
          if (el instanceof RadioNodeList) {
            for (const r of el) r.checked = r.value === v;
          } else if (el.type === 'checkbox') el.checked = v === 'on';
          else el.value = v;
        }
        $(`input[name="mode"][value="${mode}"]`, f2)?.focus({ preventScroll: true });
      }
    });
    form.addEventListener('input', (e) => {
      e.target.closest('.field')?.classList.remove('is-invalid');
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submit(form);
    });
  }

  function submit(form) {
    const data = Object.fromEntries(new FormData(form));
    const invalid = [];
    const check = (name, ok) => {
      const f = $(`[data-field="${name}"]`, form);
      f?.classList.toggle('is-invalid', !ok);
      if (!ok) invalid.push(f);
    };
    check('name', (data.name || '').trim().split(/\s+/).length >= 2 && data.name.trim().length >= 5);
    check('phone', isValidPhone(data.phone || ''));
    if (mode === 'delivery') {
      check('hood', (data.hood || '').trim().length >= 3);
      check('address', (data.address || '').trim().length >= 10);
    }
    const kvkkOk = !!data.kvkk;
    $('[data-kvkk-error]', drawer).style.display = kvkkOk ? 'none' : 'block';
    if (!kvkkOk) invalid.push($('[data-field="kvkk"]', form));
    if (invalid.length) {
      const first = invalid[0];
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('input, textarea', first)?.focus({ preventScroll: true });
      gsap.fromTo(first, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      return;
    }

    const t = totals();
    const order = {
      code: orderCode(concept.brand.orderPrefix),
      firstName: data.name.trim().split(/\s+/)[0],
      mode,
      pay: data.pay,
      grand: t.grand,
      lines: cart.items.map((it) => ({
        name: it.name + (it.summary ? ` (${it.summary})` : '') + (it.note ? ` [Not: ${it.note}]` : ''),
        qty: it.qty,
        total: it.unitPrice * it.qty,
      })),
    };
    const msg = [
      `Merhaba ${concept.brand.full}, yeni sipariş:`,
      `Sipariş kodu: ${order.code}`,
      '',
      ...order.lines.map((l) => `• ${l.qty} × ${l.name}: ${money(l.total)}`),
      '',
      `Ara toplam: ${money(t.sub)}`,
      mode === 'delivery' ? `Teslimat: ${t.fee ? money(t.fee) : 'Ücretsiz'}` : 'Teslimat: Gel-al',
      t.disc ? `İndirim: −${money(t.disc)}` : null,
      `Toplam: ${money(t.grand)} (${data.pay})`,
      '',
      `Ad soyad: ${data.name.trim()}`,
      `Telefon: ${data.phone}`,
      mode === 'delivery' ? `Adres: ${data.hood.trim()}, ${data.address.trim()}` : 'Teslim şekli: Gel-al',
      data.note?.trim() ? `Not: ${data.note.trim()}` : null,
    ]
      .filter((x) => x !== null)
      .join('\n');
    const num = (concept.contact.whatsapp || '').replace(/\D/g, '');
    order.waUrl = num
      ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;

    order.viaWhatsapp = !!num;
    if (num) window.open(order.waUrl, '_blank', 'noopener');
    cart.clear();
    renderDrawer('success', order);
    $('.drawer__body', drawer).scrollTop = 0;
  }

  drawer.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-drawer]')) return closeDrawer();
    if (e.target.closest('[data-back]')) return renderDrawer('cart');
    if (e.target.closest('[data-checkout]')) {
      renderDrawer('checkout');
      $('.drawer__body', drawer).scrollTop = 0;
      return;
    }
    if (e.target.closest('[data-go-menu]')) {
      closeDrawer();
      scroller ? scroller.scrollTo('#menu') : $('#menu').scrollIntoView();
      return;
    }
    const q = e.target.closest('[data-line-qty]');
    if (q) {
      const it = cart.items.find((i) => i.key === q.dataset.key);
      if (it) cart.setQty(it.key, it.qty + Number(q.dataset.lineQty));
    }
  });

  // ------------------------------------------------------------------ rozetler
  function syncBadges() {
    const n = cart.count;
    $$('[data-cart-count]').forEach((el) => (el.textContent = n));
    $('[data-cartbar-count]').textContent = `${n} ürün`;
    $('[data-cartbar-total]').textContent = money(cart.subtotal);
    const show = n > 0 && openLayer === null;
    cartbar.classList.toggle('is-visible', show);
    cartbar.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  cart.subscribe((_, evt) => {
    syncBadges();
    if (openLayer === 'drawer' && drawer.dataset.view === 'cart') renderDrawer('cart');
    if (evt.type === 'clear') syncBadges();
  });
  syncBadges();

  // ------------------------------------------------------------------ genel tıklamalar
  document.addEventListener('click', (e) => {
    const quick = e.target.closest('[data-quick-add]');
    if (quick) {
      e.stopPropagation();
      const p = catalog.get(quick.dataset.quickAdd);
      if (!p) return;
      const needsChoice = (p.options || []).some((o) => o.type === 'single' && o.ask);
      if (needsChoice) return openModal(p.id, quick);
      cart.add(p, defaultSelections(p), 1, '');
      toast(`${p.name} sepete eklendi`);
      flyToCart(quick.closest('.product-card')?.querySelector('.product-card__media') || quick, p.id);
      return;
    }
    const prod = e.target.closest('[data-product]');
    if (prod && !e.target.closest('.pmodal')) {
      e.preventDefault();
      return openModal(prod.dataset.product, prod);
    }
    if (e.target.closest('[data-open-cart]')) return openDrawer('cart');
    if (e.target === scrim) {
      if (openLayer === 'drawer') closeDrawer();
      else closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (openLayer === 'drawer') closeDrawer();
      else if (openLayer === 'modal') closeModal();
    }
    if (openLayer === 'drawer') trapFocus(drawer, e);
    if (openLayer === 'modal') trapFocus(pmodal, e);
  });

  // Görseller sonradan hazır olunca açık pencereleri güncelle
  thumbs.onReady((id) => {
    if (openLayer === 'drawer' && drawer.dataset.view === 'cart' && cart.items.some((i) => i.productId === id)) renderDrawer('cart');
  });

  return { openDrawer, openModal, toast };
}
