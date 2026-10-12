// Sepet durumu. Konsept başına ayrı tutulur, tarayıcıda (localStorage) saklanır.
export function createCart(conceptId, catalog) {
  const KEY = `eregli-prototip:${conceptId}:sepet:v1`;
  const subs = new Set();
  let items = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      // Katalogda artık olmayan ürünleri at, fiyatları güncel katalogdan yeniden hesapla.
      return arr
        .map((it) => {
          const product = catalog.get(it.productId);
          if (!product || !Number.isFinite(it.qty) || it.qty < 1) return null;
          const priced = priceFor(product, it.selections || {});
          return { ...it, name: product.name, unitPrice: priced.unit, summary: priced.summary };
        })
        .filter(Boolean);
    } catch {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* gizli sekme vb. durumlarda sepet yalnızca bu oturumda kalır */
    }
  }

  function emit(evt) {
    save();
    subs.forEach((fn) => fn(api, evt));
  }

  const api = {
    get items() {
      return items;
    },
    get count() {
      return items.reduce((s, it) => s + it.qty, 0);
    },
    get subtotal() {
      return items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
    },
    add(product, selections = {}, qty = 1, note = '') {
      const priced = priceFor(product, selections);
      const key = `${product.id}|${JSON.stringify(selections)}|${note.trim()}`;
      const found = items.find((it) => it.key === key);
      if (found) found.qty = Math.min(99, found.qty + qty);
      else
        items.push({
          key,
          productId: product.id,
          name: product.name,
          unitPrice: priced.unit,
          summary: priced.summary,
          selections,
          note: note.trim(),
          qty,
        });
      emit({ type: 'add', productId: product.id });
    },
    setQty(key, qty) {
      const it = items.find((i) => i.key === key);
      if (!it) return;
      if (qty < 1) items = items.filter((i) => i.key !== key);
      else it.qty = Math.min(99, qty);
      emit({ type: 'qty' });
    },
    remove(key) {
      items = items.filter((i) => i.key !== key);
      emit({ type: 'remove' });
    },
    clear() {
      items = [];
      emit({ type: 'clear' });
    },
    subscribe(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
  return api;
}

// Seçeneklere göre birim fiyat ve okunur özet üretir.
export function priceFor(product, selections) {
  let unit = product.price;
  const summary = [];
  for (const group of product.options || []) {
    const sel = selections[group.id];
    if (group.type === 'single') {
      const choice = group.choices.find((c) => c.id === sel) || group.choices.find((c) => c.id === group.default);
      if (choice) {
        unit += choice.price || 0;
        if (!choice.hideInSummary) summary.push(choice.label);
      }
    } else if (group.type === 'multi' && Array.isArray(sel)) {
      for (const id of sel) {
        const choice = group.choices.find((c) => c.id === id);
        if (choice) {
          unit += choice.price || 0;
          summary.push(group.summaryPrefix ? `${group.summaryPrefix} ${choice.label}` : choice.label);
        }
      }
    }
  }
  return { unit, summary: summary.join(' · ') };
}

export function defaultSelections(product) {
  const s = {};
  for (const g of product.options || []) {
    if (g.type === 'single') s[g.id] = g.default ?? g.choices[0].id;
    else s[g.id] = [...(g.default || [])];
  }
  return s;
}
