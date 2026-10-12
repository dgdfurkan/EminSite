# Ereğli Lezzet Prototipleri

Konya Ereğli'de açılması düşünülen bir işletme için hazırlanmış, tek kod tabanında üç farklı markayı barındıran etkileşimli web sitesi prototipi.

| Konsept | Marka | Adres |
| --- | --- | --- |
| Çiğ köfte (varsayılan) | **Yoğrum Çiğ Köfte** | `/` |
| Dürüm | **KOR Ocakbaşı Dürüm** | `/?konsept=durum` |
| Kafe | **Dem Telve Kahve Evi** | `/?konsept=kafe` |

Sayfanın en altındaki **Prototip seçici** bölümünden konsept değiştirilir. Seçim yapılınca sayfa o markanın renkleri, yazı tipleri, menüsü, 3D sahnesi ve hikâyesiyle yeniden yüklenir.

## Neler var?

- **Gerçek zamanlı 3D sahneler (Three.js):** Her konseptin girişinde süzülen ürünler ve kaydırdıkça ilerleyen dört adımlı bir hikâye var. Yukarı kaydırınca her şey geri sarılır.
  - Yoğrum: buğday → isot → yoğurma → avuçta sıkma
  - KOR: zırhla kıyma → meşe korunda şişler → lavaşa diziliş → lavaşın sarılıp kâğıda girmesi
  - Dem Telve: yeşil çekirdek → kavrum → bakır cezve → fincana döküş, su ve lokum
- **3D ürün görselleri:** Menüdeki her ürünün görseli tarayıcıda 3D modelden üretilir; ürün penceresinde model parmakla/fareyle döndürülebilir. Harici fotoğraf kullanılmaz.
- **Sipariş akışı:** Seçenekli ürünler (acı seviyesi, lavaş, şeker, süt, boy, ekstralar), sepet, adrese teslim / gel-al, kapıda nakit / kart, form doğrulama, KVKK onayı ve sipariş özeti.
- **Duyarlı tasarım:** Telefon, tablet ve masaüstü için ayrı düzenler. Mobilde alt sepet çubuğu, masaüstünde yatay kaydırmalı kampanyalar.
- **Canlı ayrıntılar:** Açık/kapalı göstergesi, ücretsiz teslimata kalan tutar, kaydırma hızına tepki veren yazı bantları, imleci izleyen kartlar.
- **Erişilebilirlik:** Klavyeyle gezinme, odak yönetimi, `prefers-reduced-motion` desteği, WebGL olmayan cihazlarda 3D'siz yedek görünüm.

## Siparişler nereye düşüyor?

Şu an prototip modundadır: sipariş onaylanınca müşteriye sipariş kodu gösterilir ve sipariş özetini WhatsApp'tan iletebileceği bir buton çıkar. İşletme açıldığında yapılacak tek şey, ilgili konseptin dosyasında WhatsApp numarasını girmektir:

```js
// src/concepts/cigkofte/index.js (diğerleri: durum/index.js, kafe/index.js)
contact: {
  phoneDisplay: '0 (332) 000 00 00',
  whatsapp: '905XXXXXXXXX', // ülke koduyla, boşluksuz
  ...
}
```

Numara girildiğinde "Siparişi onayla" butonu "WhatsApp ile siparişi gönder" olur ve sipariş metni (ürünler, seçenekler, adres, ödeme şekli, toplam) hazır olarak işletmenin WhatsApp'ına gider.

## Fiyat, ürün ve metin değişiklikleri

Her konseptin tüm içeriği tek bir dosyada:

- `src/concepts/cigkofte/index.js`
- `src/concepts/durum/index.js`
- `src/concepts/kafe/index.js`

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
- [Lenis](https://lenis.darkroom.engineering) ile yumuşak kaydırma
- Yazı tipleri yerel olarak paketlenir (Fontsource): Bricolage Grotesque, Anton, Archivo, Fraunces, Manrope

```
src/
  app.js              Sayfayı kurar, 3D sahneyi ve sipariş akışını başlatır
  core/               Sepet, konsept kayıtları, logolar, ikonlar, yardımcılar
  ui/                 Bölümler (HTML), sipariş akışı, kaydırma efektleri
  three/              3D sahne, ürün görseli üreticisi, ortak modeller ve dokular
  concepts/<konsept>/ Menü ve metinler (index.js), 3D modeller, 3D hikâye sahnesi
  styles/             Temel stiller, konsept temaları, bileşenler
```

> Bu site bir prototiptir. Adres ve telefon bilgileri temsilîdir; gerçek bilgilerle değiştirilmelidir.
