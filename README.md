# Ereğli Lezzet Prototipleri

Konya Ereğli'de açılması düşünülen bir işletme için hazırlanmış, tek kod tabanında dokuz farklı markayı barındıran etkileşimli web sitesi prototipi: üç **standart** (genç, renkli, eğlenceli), üç **premium** (sade, şık, yetişkin) ve üç **butik** (her biri kendi dünyasından tek bir fikre dayanan, 3D yüklemeyen hafif) konsept.

| Seri | Konsept | Marka | Adres |
| --- | --- | --- | --- |
| Standart | Çiğ köfte (varsayılan) | **Yoğrum Çiğ Köfte** | `/` |
| Standart | Dürüm | **KOR Ocakbaşı Dürüm** | `/?konsept=durum` |
| Standart | Kafe | **Dem Telve Kahve Evi** | `/?konsept=kafe` |
| Premium | Çiğ köfte | **Avuç Çiğ Köfte Atölyesi** | `/?konsept=cigkofte-premium` |
| Premium | Dürüm | **Zırh Ocakbaşı** | `/?konsept=durum-premium` |
| Premium | Kafe | **Sükûn Kahve Evi** | `/?konsept=kafe-premium` |
| Butik | Çiğ köfte | **İsot Çiğ Köfte** | `/?konsept=cigkofte-butik` |
| Butik | Dürüm | **Ocak 42 Dürüm** | `/?konsept=durum-butik` |
| Butik | Kafe | **Hatır Kahve** | `/?konsept=kafe-butik` |

Konsept, sayfanın en altındaki küçük **Prototip** butonlarından değiştirilir. Seçim yapılınca sayfa o markanın renkleri, yazı tipleri, menüsü ve sahnesiyle yeniden yüklenir.

## Neler var?

- **Kesintisiz kaydırma:** Tarayıcının kendi (native) kaydırması kullanılır; yumuşatma katmanı yoktur. Telefonda ve bilgisayarda kaydırma anında tepki verir. 3D çizim yalnızca sahne ekrandayken yapılır, yavaş cihazlarda çözünürlük kendiliğinden düşer.
- **Standart seri:** Kaydırdıkça ilerleyen dört adımlı 3D hikâyeler.
  - Yoğrum: buğday → isot → yoğurma → avuçta sıkma (parmak oyukları ve boğumlarıyla)
  - KOR: zırhla kıyma → meşe korunda şişler → lavaşa diziliş → lavaşın sarılıp kâğıda girmesi
  - Dem Telve: yeşil çekirdek → kavrum → bakır cezve → fincana döküş
- **Premium seri:** Tek ve sakin bir ana kompozisyon (arduvaz tabakta çiğ köfte, siyah ambalajlı dürüm, pirinç tepside porselen fincan), kelime kelime aydınlanan manifesto, kaydırdıkça sahneye gelen "ustalık" nesneleri, editoryal menü listesi ve gerçek gölgeli, stüdyo fotoğrafı tadında ürün görselleri.
- **Butik seri:** Her markanın tek bir cesur fikri var, sayfanın geri kalanı sade:
  - İsot: girişte "Acılı mı olsun?" sorusu. Dört kademeli acı seçici sitenin rengini ve başlığın kalınlığını değiştirir, tabağa pul biber serper; seçim sepete eklenen her ürüne işlenir ve hatırlanır.
  - Ocak 42: beyaz fayanslı duvarda harfli keçe menü panosu. Harfler açılışta tek tek takılır, panodaki satıra dokununca ürün açılır; dürüm krom tezgâhta durur, sepet bir sipariş fişidir.
  - Hatır: kobalt desenli Kütahya fincanları. "Fincanı aç" denince telve çizilir, içindeki şekil yaldızla belirir ve kısa bir fal okunur.
  - Butik sayfalar Three.js yüklemez; ürün fotoğrafları önceden üretilmiş küçük WebP dosyalarıdır (`public/foto`).
- **3D ürün görselleri:** Standart ve premium seride her ürünün görseli tarayıcıda 3D modelden üretilir; ürün penceresinde model sürüklenerek döndürülebilir. Harici fotoğraf kullanılmaz.
- **Sipariş akışı:** Seçenekli ürünler (acı derecesi, lavaş, şeker, süt, çekirdek, ekstralar), sepet, adrese teslim / gel-al, kapıda nakit / kart, form doğrulama, KVKK onayı ve sipariş özeti.
- **Duyarlı tasarım:** Telefon, tablet ve masaüstü için ayrı düzenler.
- **Erişilebilirlik:** Klavyeyle gezinme, odak yönetimi, `prefers-reduced-motion` desteği, WebGL olmayan cihazlarda 3D'siz yedek görünüm.

## Siparişler nereye düşüyor?

Şu an prototip modundadır: sipariş onaylanınca müşteriye sipariş kodu gösterilir ve sipariş özetini WhatsApp'tan iletebileceği bir buton çıkar. İşletme açıldığında yapılacak tek şey, ilgili konseptin dosyasında WhatsApp numarasını girmektir:

```js
// src/concepts/cigkofte/index.js (diğer sekiz konseptte de aynı alan var)
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
- `src/concepts/cigkofte-butik/index.js`, `src/concepts/durum-butik/index.js`, `src/concepts/kafe-butik/index.js` (butik)

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

### Butik serinin ürün fotoğrafları

Butik seride bir ürün eklenir ya da görünümü değiştirilirse fotoğrafı yeniden üretilir. Fotoğrafın 3D kompozisyonu konseptin `photos.js` dosyasındadır. `npm run dev` açıkken tarayıcıda şu adres açılır; fotoğraflar çizilip `public/foto/<konsept>/` altına kaydedilir:

```
http://localhost:5173/tools/foto.html?k=cigkofte-butik
```

Birden fazla konsept virgülle (`?k=durum-butik,kafe-butik`), tek fotoğraf `&id=hero` ile üretilir. Bu araç yalnızca geliştirme sunucusunda çalışır, yayına girmez.

## Yayınlama (GitHub Pages)

Canlı adres: **https://dgdfurkan.github.io/EminSite/**

GitHub Pages, deponun `gh-pages` dalından yayın yapar. Kodda değişiklik yaptıktan sonra siteyi güncellemek için:

```bash
npm run deploy
```

Bu komut siteyi derler ve `gh-pages` dalına gönderir; birkaç dakika içinde canlı adres güncellenir. Site göreli yollarla derlendiği için `kullanici.github.io/depo-adi/` altında sorunsuz çalışır.

## Teknik altyapı

- [Vite](https://vite.dev) ile derleme
- [Three.js](https://threejs.org) ile 3D sahneler; modeller ve dokular tamamen kodla üretilir (`src/three`, `src/concepts/*/models.js`)
- [GSAP](https://gsap.com) ScrollTrigger ve SplitText ile kaydırmaya bağlı animasyonlar
- Yazı tipleri yerel olarak paketlenir (Fontsource): Bricolage Grotesque, Anton, Archivo, Fraunces, Manrope (standart); Instrument Serif, Bodoni Moda, Cormorant Garamond, Inter Tight (premium); Anybody, Atkinson Hyperlegible Next, Big Shoulders Display, Instrument Sans, Young Serif, Hanken Grotesk (butik)

```
src/
  app.js              Sayfayı kurar, 3D sahneyi ve sipariş akışını başlatır
  core/               Sepet, konsept kayıtları, logolar, ikonlar, yardımcılar
  ui/                 Bölümler (standart: sections.js, premium: premium.js), sipariş akışı, kaydırma efektleri
  butik/              Butik serinin sayfaları ve davranışları (isot.js, ocak.js, hatir.js)
  three/              3D sahne, ürün görseli üreticisi, premium sergi düzeneği, ortak modeller ve dokular
  concepts/<konsept>/ Menü ve metinler (index.js), 3D modeller, 3D sahne
  concepts/premium/   Premium serinin ortak 3D modelleri
  styles/             Temel stiller, standart temalar, bileşenler, premium ve butik tasarımları
tools/foto.html       Butik serinin ürün fotoğraflarını üreten geliştirme aracı
public/foto/          Butik serinin hazır ürün fotoğrafları
```

> Bu site bir prototiptir. Adres ve telefon bilgileri temsilîdir; gerçek bilgilerle değiştirilmelidir.
