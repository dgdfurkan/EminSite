# Ereğli Lezzet Prototipleri

Konya Ereğli'de açılması düşünülen bir işletme için hazırlanmış, tek kod tabanında altı farklı markayı barındıran etkileşimli web sitesi prototipi: üç **standart** (genç, renkli, eğlenceli) ve üç **premium** (sade, şık, yetişkin) konsept.

| Seri | Konsept | Marka | Adres |
| --- | --- | --- | --- |
| Standart | Çiğ köfte (varsayılan) | **Yoğrum Çiğ Köfte** | `/` |
| Standart | Dürüm | **KOR Ocakbaşı Dürüm** | `/?konsept=durum` |
| Standart | Kafe | **Dem Telve Kahve Evi** | `/?konsept=kafe` |
| Premium | Çiğ köfte | **Avuç Çiğ Köfte Atölyesi** | `/?konsept=cigkofte-premium` |
| Premium | Dürüm | **Zırh Ocakbaşı** | `/?konsept=durum-premium` |
| Premium | Kafe | **Sükûn Kahve Evi** | `/?konsept=kafe-premium` |

Konsept, sayfanın en altındaki küçük **Prototip** butonlarından değiştirilir. Seçim yapılınca sayfa o markanın renkleri, yazı tipleri, menüsü ve 3D sahnesiyle yeniden yüklenir.

## Neler var?

- **Kesintisiz kaydırma:** Tarayıcının kendi (native) kaydırması kullanılır; yumuşatma katmanı yoktur. Telefonda ve bilgisayarda kaydırma anında tepki verir. 3D çizim yalnızca sahne ekrandayken yapılır, yavaş cihazlarda çözünürlük kendiliğinden düşer.
- **Standart seri:** Kaydırdıkça ilerleyen dört adımlı 3D hikâyeler.
  - Yoğrum: buğday → isot → yoğurma → avuçta sıkma (parmak oyukları ve boğumlarıyla)
  - KOR: zırhla kıyma → meşe korunda şişler → lavaşa diziliş → lavaşın sarılıp kâğıda girmesi
  - Dem Telve: yeşil çekirdek → kavrum → bakır cezve → fincana döküş
- **Premium seri:** Tek ve sakin bir ana kompozisyon (arduvaz tabakta çiğ köfte, siyah ambalajlı dürüm, pirinç tepside porselen fincan), kelime kelime aydınlanan manifesto, kaydırdıkça sahneye gelen "ustalık" nesneleri, editoryal menü listesi ve gerçek gölgeli, stüdyo fotoğrafı tadında ürün görselleri.
- **3D ürün görselleri:** Her ürünün görseli tarayıcıda 3D modelden üretilir; ürün penceresinde model sürüklenerek döndürülebilir. Harici fotoğraf kullanılmaz.
- **Sipariş akışı:** Seçenekli ürünler (acı derecesi, lavaş, şeker, süt, çekirdek, ekstralar), sepet, adrese teslim / gel-al, kapıda nakit / kart, form doğrulama, KVKK onayı ve sipariş özeti.
- **Duyarlı tasarım:** Telefon, tablet ve masaüstü için ayrı düzenler.
- **Erişilebilirlik:** Klavyeyle gezinme, odak yönetimi, `prefers-reduced-motion` desteği, WebGL olmayan cihazlarda 3D'siz yedek görünüm.

## Siparişler nereye düşüyor?

Şu an prototip modundadır: sipariş onaylanınca müşteriye sipariş kodu gösterilir ve sipariş özetini WhatsApp'tan iletebileceği bir buton çıkar. İşletme açıldığında yapılacak tek şey, ilgili konseptin dosyasında WhatsApp numarasını girmektir:

```js
// src/concepts/cigkofte/index.js (diğer beş konseptte de aynı alan var)
contact: {
  phoneDisplay: '0 (332) 000 00 00',
  whatsapp: '905XXXXXXXXX', // ülke koduyla, boşluksuz
  ...
}
```

Numara girildiğinde "Siparişi onayla" butonu "WhatsApp ile siparişi gönder" olur ve sipariş metni (ürünler, seçenekler, adres, ödeme şekli, toplam) hazır olarak işletmenin WhatsApp'ına gider.

## Fiyat, ürün ve metin değişiklikleri

Her konseptin tüm içeriği tek bir dosyada:

- `src/concepts/cigkofte/index.js`, `src/concepts/durum/index.js`, `src/concepts/kafe/index.js` (standart)
- `src/concepts/cigkofte-premium/index.js`, `src/concepts/durum-premium/index.js`, `src/concepts/kafe-premium/index.js` (premium)

Bu dosyalarda menü (`categories`), fiyatlar (`price`), seçenekler (`options`), çalışma saatleri (`hours`), teslimat kuralları (`delivery`: en az sepet tutarı, teslimat ücreti, ücretsiz teslimat sınırı), iletişim bilgileri (`contact`) ve sayfadaki bütün yazılar bulunur.

Fiyatlar 2026 piyasa araştırmasına göre Ereğli için tahmini olarak belirlenmiştir; açılış öncesinde güncellenmelidir.

## Geliştirme

Gereksinim: Node.js 20 veya üzeri.

```bash
npm install
npm run dev
```

Üretim derlemesi:

```bash
npm run build
npm run preview
```

## Yayınlama (GitHub Pages)

Depo GitHub'a gönderildikten sonra:

1. GitHub'da depo **Settings → Pages** bölümüne gidin.
2. **Source** olarak **GitHub Actions** seçin.
3. `main` dalına yapılan her gönderimde `.github/workflows/deploy.yml` siteyi otomatik derleyip yayınlar.

Site göreli yollarla derlendiği için `kullanici.github.io/depo-adi/` altında sorunsuz çalışır.

## Teknik altyapı

- [Vite](https://vite.dev) ile derleme
- [Three.js](https://threejs.org) ile 3D sahneler; modeller ve dokular tamamen kodla üretilir (`src/three`, `src/concepts/*/models.js`)
- [GSAP](https://gsap.com) ScrollTrigger ve SplitText ile kaydırmaya bağlı animasyonlar
- Yazı tipleri yerel olarak paketlenir (Fontsource): Bricolage Grotesque, Anton, Archivo, Fraunces, Manrope (standart); Instrument Serif, Bodoni Moda, Cormorant Garamond, Inter Tight (premium)

```
src/
  app.js              Sayfayı kurar, 3D sahneyi ve sipariş akışını başlatır
  core/               Sepet, konsept kayıtları, logolar, ikonlar, yardımcılar
  ui/                 Bölümler (standart: sections.js, premium: premium.js), sipariş akışı, kaydırma efektleri
  three/              3D sahne, ürün görseli üreticisi, premium sergi düzeneği, ortak modeller ve dokular
  concepts/<konsept>/ Menü ve metinler (index.js), 3D modeller, 3D sahne
  concepts/premium/   Premium serinin ortak 3D modelleri
  styles/             Temel stiller, standart temalar, bileşenler, premium tasarım sistemi
```

> Bu site bir prototiptir. Adres ve telefon bilgileri temsilîdir; gerçek bilgilerle değiştirilmelidir.
