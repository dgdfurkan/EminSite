import{C as e,D as t,f as n,g as r,j as i,k as a,v as o}from"./sections-CqLG0D6n.js";import{a as s,c,d as l,i as u,l as d,n as f,o as p,r as m,s as h,u as g}from"./common-CjqroD8V.js";var _=i({init:()=>k,page:()=>O});function v(e,t){let n=t*9301+49297,r=()=>(n=(n*9301+49297)%233280)/233280;return[...e].map(e=>e===` `?`<span class="o-sp"></span>`:`<span class="o-l" style="--r:${((r()-.5)*5).toFixed(1)}deg;--y:${((r()-.5)*2.4).toFixed(1)}px">${o(e)}</span>`).join(``)}function y(e){return`
  <a class="skip-link" href="#menu" data-scroll>Menüye geç</a>
  <header class="site-header o-header" id="site-header">
    <div class="wrap o-header__in">
      <a class="o-header__logo" href="#top" data-scroll aria-label="${o(e.brand.full)}, sayfanın başı">${a(e.id)}</a>
      <nav class="o-nav" aria-label="Ana menü">${d(e)}</nav>
      <div class="o-header__actions">
        <span class="b-status o-status" data-open-status><span class="b-status__dot"></span><span data-open-label>…</span></span>
        <button class="cart-btn o-cart" type="button" data-open-cart aria-label="Sepeti aç">
          <span>Sepet</span><span class="o-cart__count" data-cart-count>0</span>
        </button>
        <button class="burger o-burger" type="button" data-burger aria-label="Menüyü aç" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
      </div>
    </div>
  </header>
  ${c(e,`o-mnav`,e.hero.cta)}`}function b(n,r){let i=n.hero.board,a=i.items.map(e=>r.get(e)).filter(Boolean);return`
  <div class="o-board" aria-label="Bugün ocakta">
    <div class="o-board__felt">
      <p class="o-board__row o-board__row--head" aria-hidden="true"><span class="o-board__name">${v(i.head,1)}</span></p>
      ${a.map((n,r)=>`
        <button class="o-board__row" type="button" data-product="${o(n.id)}" aria-label="${o(n.name)}, ${e(n.price)}">
          <span class="o-board__name" aria-hidden="true">${v(n.board||t(n.name),r+2)}</span>
          <span class="o-board__price" aria-hidden="true">${v(String(n.price),r+20)}</span>
        </button>`).join(``)}
    </div>
  </div>`}function x(e,t){let n=e.hero;return`
  <section class="o-hero" id="top" aria-labelledby="o-hero-title">
    <div class="wrap o-hero__grid">
      <div class="o-hero__copy">
        <h1 class="o-hero__title" id="o-hero-title">${o(n.title)}</h1>
        <p class="o-hero__text">${o(n.text)}</p>
        <div class="o-hero__ctas">
          <a class="o-btn" href="#menu" data-scroll>${o(n.cta)}</a>
          <a class="o-btn o-btn--line" href="#saatler" data-scroll>Saatler ve adres</a>
        </div>
      </div>
      ${b(e,t)}
    </div>
    <div class="o-counter" aria-hidden="true">
      <div class="wrap o-counter__in">
        ${g(e,`hero`,``,{w:1100,h:700,eager:!0,cls:`o-counter__food`})}
      </div>
    </div>
  </section>`}function S(t,n){let r=n.tags?.[0]?.text;return`
  <li class="o-item">
    <button class="o-item__main" type="button" data-product="${o(n.id)}">
      <span class="o-item__img">${g(t,n.id,``,{w:720,h:540})}</span>
      <span class="o-item__text">
        <span class="o-item__name">${o(n.name)}</span>
        ${r?`<span class="o-item__tag">${o(r)}</span>`:``}
        <span class="o-item__desc">${o(n.desc)}</span>
      </span>
    </button>
    <div class="o-item__foot">
      <span class="o-item__price">${e(n.price)}</span>
      <button class="o-item__add" type="button" data-quick-add="${o(n.id)}" aria-label="${o(n.name)} sepete ekle">Ekle</button>
    </div>
  </li>`}function C(e){let t=e.menu;return`
  <section class="o-menu" id="menu" aria-labelledby="o-menu-title">
    <div class="wrap">
      <h2 class="o-h2" id="o-menu-title">${o(t.title)}</h2>
    </div>
    <div class="o-menu-nav" data-menu-nav>
      <div class="wrap">
        <div class="o-menu-nav__list" data-menu-nav-list>
          ${t.categories.map((e,t)=>`<button class="o-tab${t===0?` is-active`:``}" type="button" data-cat-link="${e.id}">${o(e.name)}</button>`).join(``)}
        </div>
      </div>
    </div>
    <div class="wrap">
      ${t.categories.map(t=>`
        <section class="o-cat" id="kat-${t.id}" data-cat="${t.id}" aria-labelledby="kat-${t.id}-t">
          <header class="o-cat__head">
            <h3 class="o-h3" id="kat-${t.id}-t">${o(t.name)}</h3>
            ${t.note?`<p>${o(t.note)}</p>`:``}
          </header>
          <ul class="o-grid">${t.products.map(t=>S(e,t)).join(``)}</ul>
        </section>`).join(``)}
    </div>
  </section>`}function w(e){let t=e.steps;return`
  <section class="o-steps" id="${t.id}" aria-labelledby="o-steps-title">
    <div class="wrap">
      <h2 class="o-h2" id="o-steps-title">${o(t.title)}</h2>
      <ol class="o-steps__list">
        ${t.items.map(e=>`<li class="o-tile"><h3>${o(e.title)}</h3><p>${o(e.text)}</p></li>`).join(``)}
      </ol>
    </div>
  </section>`}function T(e){let t=e.delivery,n=e.contact;return`
  <section class="o-info" id="saatler" aria-labelledby="o-info-title">
    <div class="wrap o-info__grid">
      <h2 class="o-h2" id="o-info-title">Saatler ve teslimat</h2>
      <dl class="o-facts">
        <div><dt>Ocak açık</dt><dd><strong>${p(e.hours)}</strong>${o(e.hours.label)}. ${o(e.hours.extra)}. <span class="open-badge" data-open-badge>…</span></dd></div>
        <div><dt>Paket servis</dt><dd><strong>${o(t.eta)}</strong>${o(f(t))}</dd></div>
        <div><dt>Gel-al</dt><dd><strong>${o(t.pickupEta)}</strong>Siparişiniz hazır olunca tezgâhta sizi bekler.</dd></div>
        <div><dt>Adres</dt><dd><strong>${o(n.phoneDisplay)}</strong>${o(n.address)}. ${o(n.addressNote)} <a href="${h(e)}" target="_blank" rel="noopener">Haritada aç</a></dd></div>
      </dl>
    </div>
  </section>`}function E(e){return`
  <section class="o-faq" id="sss" aria-labelledby="o-faq-title">
    <div class="wrap o-faq__grid">
      <h2 class="o-h2" id="o-faq-title">Sık sorulanlar</h2>
      ${m(e.faq)}
    </div>
  </section>`}function D(e){return`
  <footer class="site-footer o-footer">
    <div class="wrap">
      <div class="o-footer__top">
        <div class="o-footer__brand">${a(e.id)}<p>${o(e.footer.about)}</p></div>
        <nav class="o-footer__nav" aria-label="Alt menü">${d(e)}</nav>
      </div>
      ${u(e)}
    </div>
  </footer>`}function O(e,t){return[y(e),`<main id="main">`,x(e,t),C(e),w(e),T(e),E(e),`</main>`,D(e),n(e)].join(``)}function k({gsap:e,concept:t,reduced:n}){return document.documentElement.style.setProperty(`--felt-grain`,`url(${s({alpha:.16,seed:3})})`),document.addEventListener(`cart:added`,()=>{if(n)return;let t=r(`.o-cart__count`);t&&e.fromTo(t,{rotateX:-90,y:-6},{rotateX:0,y:0,duration:.6,ease:`back.out(2.4)`,transformPerspective:200})}),{intro(){let t=e.timeline({defaults:{ease:`power3.out`}});return n||(t.from(`.o-hero__title`,{y:24,autoAlpha:0,duration:.8},0),t.from([`.o-hero__text`,`.o-hero__ctas`],{y:16,autoAlpha:0,duration:.7,stagger:.08},.15),t.from(`.o-board`,{y:20,autoAlpha:0,duration:.7},.05),t.from(`.o-board .o-l`,{y:-16,rotate:()=>(Math.random()-.5)*40,autoAlpha:0,duration:.45,ease:`back.out(2)`,stagger:{each:.011}},.35),t.from(`.o-counter__food`,{xPercent:14,autoAlpha:0,duration:1,ease:`power3.out`},.5)),t}}}var A=e=>({id:`aci`,title:`Acı`,type:`single`,default:e,choices:[{id:`acisiz`,label:`Acısız`},{id:`az`,label:`Az acılı`},{id:`acili`,label:`Acılı`}]}),j={id:`lavas`,title:`Lavaş`,type:`single`,default:`tek`,choices:[{id:`tek`,label:`Tek lavaş`,hideInSummary:!0},{id:`cift`,label:`Çift lavaş`,price:15}]},M={id:`cikar`,title:`Çıkarılsın`,type:`multi`,choices:[{id:`sogan`,label:`Soğansız`},{id:`domates`,label:`Domatessiz`},{id:`maydanoz`,label:`Maydanozsuz`},{id:`sumak`,label:`Sumaksız`}]},N={id:`ekstra`,title:`Ekstralar`,type:`multi`,choices:[{id:`kasar`,label:`Kaşar`,price:25},{id:`et`,label:`Ekstra et (50 g)`,price:60},{id:`biber`,label:`Közlenmiş biber`,price:15}]},P={id:`icecek`,title:`İçecek`,type:`single`,default:`ayran`,choices:[{id:`ayran`,label:`Yayık ayran`},{id:`salgam`,label:`Şalgam`}]},F={id:`durum`,title:`Dürüm`,type:`single`,default:`adana`,ask:!0,choices:[{id:`adana`,label:`Adana`},{id:`urfa`,label:`Urfa`},{id:`tavuk`,label:`Tavuk şiş`},{id:`ciger`,label:`Ciğer`,price:0}]},I={id:`durum-butik`,tier:`butik`,meta:{title:`Ocak 42 Dürüm · Konya Ereğli`,description:`Meşe közünde Adana, Urfa, tavuk şiş ve ciğer dürüm. Gece ikiye kadar açık; Ereğli içi paket servis.`},brand:{name:`Ocak 42`,full:`Ocak 42 Dürüm`,orderPrefix:`O42`},nav:[{href:`#menu`,label:`Menü`},{href:`#usta`,label:`Usta`},{href:`#saatler`,label:`Saatler`},{href:`#sss`,label:`Sorular`}],hours:{open:`12:00`,close:`02:00`,label:`Her gün`,extra:`Son sipariş 01.30`},delivery:{min:200,fee:25,freeOver:450,eta:`30–40 dk`,pickupEta:`15 dk`,pickupDiscount:0},contact:{phoneDisplay:`0 (332) 000 00 00`,phoneNote:`Kalabalık siparişler için önceden arayın.`,whatsapp:``,address:`Ereğli Merkez, Konya`,addressNote:`Dükkân adresi çok yakında burada.`,mapsQuery:`Ereğli, Konya`},emptyCart:`Panodan ya da menüden bir dürüm seçerek başlayın.`,hero:{title:`Közde pişer, elde sarılır.`,text:`Ereğli’de gece ikiye kadar açık ocakbaşı. Paket servisle ortalama 35 dakikada kapınızda.`,cta:`Menüyü aç`,board:{head:`BUGÜN OCAKTA`,items:[`o-adana`,`o-urfa`,`o-tavuk`,`o-ciger`,`o-kuzu`,`i-ayran`]}},menu:{title:`Menü`,categories:[{id:`ocak`,name:`Közden dürümler`,note:`Şiş, siparişiniz gelince közün üstüne konur.`,products:[{id:`o-adana`,name:`Adana Dürüm`,board:`ADANA DÜRÜM`,desc:`Zırhla kıyılmış kuzu, acılı.`,long:`Kuzu eti ve kuyruk yağı zırhla kıyılır, pul biberle yoğrulur, meşe közünde pişer. Lavaşa soğan, maydanoz ve sumakla sarılır.`,price:230,tags:[{text:`En çok satan`}],options:[A(`acili`),j,M,N]},{id:`o-urfa`,name:`Urfa Dürüm`,board:`URFA DÜRÜM`,desc:`Aynı kıyma, acısız.`,long:`Adana’nın acısız kardeşi. Zırh kıyması, isot yerine tatlı kırmızı biberle yoğrulur.`,price:230,options:[j,M,N]},{id:`o-tavuk`,name:`Tavuk Şiş Dürüm`,board:`TAVUK ŞİŞ`,desc:`Yoğurtlu, kekikli tavuk göğsü.`,long:`Bir gece yoğurt, kekik ve biber salçasında bekleyen tavuk göğsü, közde kızarana kadar çevrilir.`,price:190,options:[A(`az`),j,M,N]},{id:`o-ciger`,name:`Ciğer Dürüm`,board:`CİĞER`,desc:`Kuzu ciğeri, bol soğan ve sumak.`,price:220,options:[A(`az`),j,M]},{id:`o-kuzu`,name:`Kuzu Şiş Dürüm`,board:`KUZU ŞİŞ`,desc:`Kuşbaşı kuzu, közlenmiş biberle.`,price:260,options:[A(`acisiz`),j,M,N]}]},{id:`menuler`,name:`Menüler`,note:`Dürüm, patates ve içecek bir arada.`,products:[{id:`m-usta`,name:`Usta Menü`,desc:`Seçtiğiniz dürüm, patates ve ayran.`,long:`Ocaktan bir dürüm, çıtır patates ve yayık ayranı ya da şalgam.`,price:310,options:[F,P,j]},{id:`m-ikili`,name:`İkili Menü`,desc:`İki dürüm, bir büyük patates ve iki içecek.`,price:560,tags:[{text:`İki kişilik`}],options:[{...F,id:`durum1`,title:`Birinci dürüm`},{...F,id:`durum2`,title:`İkinci dürüm`},P]}]},{id:`yaninda`,name:`Yanında`,products:[{id:`y-patates`,name:`Patates`,desc:`Çıtır, tuzu kararında.`,price:80},{id:`y-koz`,name:`Köz Tabağı`,desc:`Közlenmiş domates ve sivri biber.`,price:60},{id:`y-sogan`,name:`Sumaklı Soğan`,desc:`Kırmızı soğan, maydanoz ve sumak.`,price:40}]},{id:`icecekler`,name:`İçecekler`,products:[{id:`i-ayran`,name:`Yayık Ayranı`,board:`AYRAN`,desc:`Bakır tasta, köpüklü.`,price:40},{id:`i-salgam`,name:`Şalgam`,desc:`Acılı ya da acısız.`,price:40,options:[{id:`tur`,title:`Tercih`,type:`single`,default:`acili`,choices:[{id:`acili`,label:`Acılı`},{id:`acisiz`,label:`Acısız`}]}]}]},{id:`tatli`,name:`Tatlı`,products:[{id:`t-kunefe`,name:`Künefe`,desc:`Közde, tel kadayıf ve Hatay peyniriyle.`,price:150}]}]},steps:{id:`usta`,title:`Ustanın sırası`,items:[{title:`Zırh`,text:`Kuzu eti ve kuyruk yağı zırhla elde kıyılır. Makineden geçmediği için suyunu kaybetmez.`},{title:`Şiş`,text:`Kıyma geniş şişe sıvanır, parmaklarla bastırılır. Közde dağılmaz.`},{title:`Köz`,text:`Meşe kömüründe sık sık çevrilerek pişer. Yağı közün üstüne damlar, dumanı ete geçer.`},{title:`Lavaş`,text:`Lavaş şişin üstünde ısıtılır, eti sıyırır. Soğan, maydanoz ve sumakla sarılıp kâğıda alınır.`}]},faq:[{q:`Etleriniz nereden geliyor?`,a:`Kuzu ve dana etini her sabah Ereğli’deki kasabımızdan alıyoruz. Kıyma, gün içinde zırhla elde çekilir.`},{q:`Gece kaça kadar sipariş alıyorsunuz?`,a:`Paket servis siparişini gece 01.30’a kadar alıyoruz. Ocak 02.00’de kapanır.`},{q:`Acısız seçenek var mı?`,a:`Urfa dürüm acısızdır. Adana ve diğer dürümlerde acıyı sipariş verirken siz seçersiniz.`},{q:`Çift lavaş ne demek?`,a:`Dürüm iki kat lavaşla sarılır. Yolda dağılmaz, daha doyurucu olur.`},{q:`Paket servis nerelere var?`,a:`Ereğli merkez ve yakın mahallelere. En az sepet 200 TL; 450 TL ve üzerindeki siparişlerde teslimat ücretsiz.`}],footer:{about:`Ocak 42, Konya Ereğli’de meşe közünde pişen dürümleri gece ikiye kadar sıcak tutan bir ocakbaşıdır.`},ui:_,photo:e=>l(`durum-butik`,e)};export{I as default};