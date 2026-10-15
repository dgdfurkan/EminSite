import{C as e,_ as t,f as n,g as r,j as i,k as a,v as o}from"./sections-CqLG0D6n.js";import{t as s}from"./icons-SGqHi8fu.js";import{a as c,c as l,d as u,i as d,l as f,n as p,o as m,r as h,s as g,t as _,u as v}from"./common-CjqroD8V.js";var y=i({init:()=>j,page:()=>A}),b=`<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.3 4.4c2 .5 2.8 2.4 2.2 4.5-.8 2.8-3.4 5.2-7.9 5.8-.7.1-.9-.5-.3-.8 2.9-1.8 4-4 4.1-6.7 0-1.8.5-3.2 1.9-2.8Z"/><path d="M9.6 4.6c0-1.1.6-2 1.5-2.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;function x(e){return`
  <a class="skip-link" href="#menu" data-scroll>Menüye geç</a>
  <header class="site-header i-header" id="site-header">
    <div class="wrap i-header__in">
      <a class="i-header__logo" href="#top" data-scroll aria-label="${o(e.brand.full)}, sayfanın başı">${a(e.id)}</a>
      <nav class="i-nav" aria-label="Ana menü">${f(e)}</nav>
      <div class="i-header__actions">
        <button class="cart-btn i-cart" type="button" data-open-cart aria-label="Sepeti aç">
          <span class="i-cart__label">Sepet</span><span class="i-cart__count" data-cart-count>0</span>
        </button>
        <button class="burger i-burger" type="button" data-burger aria-label="Menüyü aç" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
      </div>
    </div>
  </header>
  ${l(e,`i-mnav`,e.hero.cta)}`}function S(e,t){return`
  <fieldset class="i-dial" data-heat-dial>
    <legend class="sr-only">Acı derecesi</legend>
    <span class="i-dial__thumb" aria-hidden="true"></span>
    ${e.heat.levels.map((e,n)=>`
      <label class="i-dial__opt">
        <input type="radio" name="${t}" value="${e.id}" data-heat-input>
        <span class="i-dial__name">${o(e.label)}</span>
        <span class="i-dial__peppers" aria-hidden="true">${b.repeat(n+1)}</span>
      </label>`).join(``)}
  </fieldset>`}function C(e){return`
  <section class="i-hero" id="top" aria-labelledby="i-hero-title">
    <div class="wrap i-hero__grid">
      <h1 class="i-hero__title" id="i-hero-title">${e.hero.title.map(e=>`<span class="i-line"><span>${o(e)}</span></span>`).join(``)}</h1>
      <figure class="i-hero__plate">
        ${v(e,`hero`,`Marul yaprakları üzerinde avuçta sıkılmış çiğ köfteler, limon ve nar taneleri`,{w:960,h:960,eager:!0,cls:`i-hero__img`})}
        <div class="i-flakes" data-flakes aria-hidden="true"></div>
      </figure>
      <div class="i-hero__control">
        ${S(e,`heat`)}
        <p class="i-hero__note" data-heat-note aria-live="polite"></p>
        <div class="i-hero__row">
          <a class="i-btn" href="#menu" data-scroll>${o(e.hero.cta)}</a>
          <span class="i-hero__hours">${o(e.hours.label)} ${m(e.hours)}</span>
        </div>
      </div>
    </div>
  </section>`}function w(t,n,r){let i=n.tags?.[0]?.text;return`
  <li class="i-item${r?` i-item--feature`:``}">
    <button class="i-item__main" type="button" data-product="${o(n.id)}">
      <span class="i-item__img">${v(t,n.id,``,r?{w:640,h:640}:{})}</span>
      <span class="i-item__text">
        <span class="i-item__name">${o(n.name)}${i?` <span class="i-item__tag">${o(i)}</span>`:``}</span>
        <span class="i-item__desc">${o(n.desc)}</span>
        <span class="i-item__price">${e(n.price)}</span>
      </span>
    </button>
    <button class="i-item__add" type="button" data-quick-add="${o(n.id)}" aria-label="${o(n.name)} sepete ekle">${s.plus}</button>
  </li>`}function T(e){let t=e.menu;return`
  <section class="i-menu" id="menu" aria-labelledby="i-menu-title">
    <div class="wrap i-menu__head">
      <h2 class="i-h2" id="i-menu-title">${o(t.title)}</h2>
      <p class="i-menu__heat">Acı dereceniz: <strong data-heat-label></strong>. Sepete eklediğiniz her ürüne işlenir. <button type="button" class="i-textbtn" data-heat-jump>Değiştir</button></p>
    </div>
    <div class="i-menu-nav" data-menu-nav>
      <div class="wrap">
        <div class="i-menu-nav__list" data-menu-nav-list>
          ${t.categories.map((e,t)=>`<button class="i-tab${t===0?` is-active`:``}" type="button" data-cat-link="${e.id}">${o(e.name)}</button>`).join(``)}
        </div>
      </div>
    </div>
    <div class="wrap">
      ${t.categories.map((t,n)=>`
        <section class="i-cat" id="kat-${t.id}" data-cat="${t.id}" aria-labelledby="kat-${t.id}-t">
          <header class="i-cat__head">
            <h3 class="i-h3" id="kat-${t.id}-t">${o(t.name)}</h3>
            ${t.note?`<p>${o(t.note)}</p>`:``}
          </header>
          <ul class="i-list">${t.products.map((t,r)=>w(e,t,n===0&&r===0)).join(``)}</ul>
        </section>`).join(``)}
    </div>
  </section>`}function E(e){let t=e.steps;return`
  <section class="i-steps" id="${t.id}" aria-labelledby="i-steps-title">
    <div class="wrap i-steps__grid">
      <figure class="i-steps__img">${v(e,`sikim`,`Avuçta sıkılmış tek parça çiğ köfte; yüzeyinde parmak olukları`,{w:900,h:900})}</figure>
      <div>
        <h2 class="i-h2" id="i-steps-title">${o(t.title)}</h2>
        <ol class="i-steps__list">
          ${t.items.map(e=>`<li><h3>${o(e.title)}</h3><p>${o(e.text)}</p></li>`).join(``)}
        </ol>
      </div>
    </div>
  </section>`}function D(e){let t=e.delivery,n=e.contact;return`
  <section class="i-info" id="teslimat" aria-labelledby="i-info-title">
    <div class="wrap">
      <h2 class="i-h2" id="i-info-title">Teslimat ve saatler</h2>
      <dl class="i-facts">
        <div><dt>Paket servis</dt><dd><strong>${o(t.eta)}</strong><span>${o(p(t))}</span></dd></div>
        <div><dt>Gel-al</dt><dd><strong>${o(t.pickupEta)}</strong><span>Dükkândan alırsanız sepetinize %${Math.round(t.pickupDiscount*100)} indirim uygulanır.</span></dd></div>
        <div><dt>Saatler</dt><dd><strong>${m(e.hours)}</strong><span>${o(e.hours.label)}. <span class="open-badge" data-open-badge>…</span></span></dd></div>
        <div><dt>Adres ve telefon</dt><dd><strong>${o(n.phoneDisplay)}</strong><span>${o(n.address)}. ${o(n.addressNote)} <a href="${g(e)}" target="_blank" rel="noopener">Haritada aç</a></span></dd></div>
      </dl>
    </div>
  </section>`}function O(e){return`
  <section class="i-faq" id="sss" aria-labelledby="i-faq-title">
    <div class="wrap i-faq__grid">
      <h2 class="i-h2" id="i-faq-title">Sık sorulanlar</h2>
      ${h(e.faq)}
    </div>
  </section>`}function k(e){return`
  <footer class="site-footer i-footer">
    <div class="wrap">
      <div class="i-footer__top">
        <div class="i-footer__brand">${a(e.id)}<p>${o(e.footer.about)}</p></div>
        <nav class="i-footer__nav" aria-label="Alt menü">${f(e)}</nav>
      </div>
      ${d(e)}
    </div>
  </footer>`}function A(e){return[x(e),`<main id="main">`,C(e),T(e),E(e),D(e),O(e),`</main>`,k(e),n(e)].join(``)}function j({gsap:e,scroller:n,concept:i,reduced:a}){let o=document.documentElement;o.style.setProperty(`--grain`,`url(${c({alpha:.06})})`);let s=i.heat,l=s.levels.map(e=>e.id),u=null;try{u=localStorage.getItem(s.storageKey)}catch{}let d=l.includes(u)?u:s.start,f=r(`[data-heat-note]`),p=r(`[data-flakes]`);function m(e,{fall:n=!0,store:r=!0}={}){o.dataset.heat=e,s.option.default=e,t(`[data-heat-input]`).forEach(t=>t.checked=t.value===e);let i=s.levels.find(t=>t.id===e);if(f.textContent=i.note,t(`[data-heat-label]`).forEach(e=>e.textContent=i.label),r){d=e;try{localStorage.setItem(s.storageKey,e)}catch{}}n&&!a&&g(e)}let h=[`#5a0f14`,`#8e1a1a`,`#3a0a0c`,`#a3261c`];function g(t){let n={hafif:4,orta:9,acili:16,ates:26}[t],r=t===`hafif`,i=p.clientWidth,a=p.clientHeight;for(let t=0;t<n;t++){let n=document.createElement(`span`);n.className=r?`i-mint`:`i-flake`,r||(n.style.background=h[t%h.length]),p.appendChild(n);let o=Math.random()*Math.PI*2,s=Math.sqrt(Math.random())*.3,c=i*(.5+Math.cos(o)*s),l=a*(.5+Math.sin(o)*s*.75),u=Math.random()*360;e.timeline({onComplete:()=>n.remove()}).fromTo(n,{x:c+(Math.random()-.5)*60,y:-a*.35-Math.random()*a*.3,rotate:u,autoAlpha:1,scale:.7+Math.random()*.6},{x:c,y:l,rotate:u+(Math.random()-.5)*220,duration:r?1.4:.75+Math.random()*.35,ease:r?`sine.inOut`:`power2.in`,delay:Math.random()*.35}).to(n,{autoAlpha:0,duration:.6,delay:r?.8:.5})}}return t(`[data-heat-input]`).forEach(e=>e.addEventListener(`change`,()=>e.checked&&m(e.value))),r(`[data-heat-jump]`)?.addEventListener(`click`,()=>{n.scrollTo(0),setTimeout(()=>r(`[data-heat-input]:checked`)?.focus({preventScroll:!0}),a?0:600)}),document.addEventListener(`cart:added`,t=>{let n=t.detail.from;if(a||!n?.isConnected)return;let{x:r,y:i}=_(n);for(let t=0;t<8;t++){let n=document.createElement(`span`);n.className=`i-flake i-flake--burst`,n.style.background=h[t%h.length],document.body.appendChild(n);let a=t/8*Math.PI*2+Math.random()*.5,o=26+Math.random()*22;e.timeline({onComplete:()=>n.remove()}).set(n,{x:r,y:i,rotate:Math.random()*180}).to(n,{x:r+Math.cos(a)*o,y:i+Math.sin(a)*o-10,rotate:`+=140`,duration:.45,ease:`power3.out`}).to(n,{y:`+=26`,autoAlpha:0,duration:.45,ease:`power1.in`})}}),m(`hafif`,{fall:!1,store:!1}),a&&m(d,{fall:!1,store:!1}),{intro(){let t=e.timeline({defaults:{ease:`power3.out`}});if(a)return t;t.from(`#site-header`,{yPercent:-100,autoAlpha:0,duration:.8,clearProps:`transform,opacity,visibility`},0),t.from(`.i-line > span`,{yPercent:105,duration:.9,stagger:.1},.05),t.from(`.i-hero__img`,{scale:.9,autoAlpha:0,rotate:-8,duration:1.1},.1),t.from(`.i-hero__control`,{y:18,autoAlpha:0,duration:.8,clearProps:`transform`},.35);let n=l.indexOf(d);for(let e=1;e<=n;e++)t.call(()=>m(l[e],{fall:e===n,store:!1}),null,.75+(e-1)*.42);return n===0&&t.call(()=>m(`hafif`,{store:!1}),null,.75),t}}}var M=[{id:`hafif`,label:`Hafif`,note:`Acısı belli belirsiz. Nane ve limon öne çıkar.`},{id:`orta`,label:`Orta`,note:`Ustanın ölçüsü. En çok bu seçiliyor.`},{id:`acili`,label:`Acılı`,note:`İsot kendini hissettirir. Yanına bir ayran iyi gider.`},{id:`ates`,label:`Ateş`,note:`Çift isot, gözünüz sulanabilir. Biz söylemiş olalım.`}],N={id:`aci`,title:`Acı derecesi`,type:`single`,default:`orta`,choices:M.map(e=>({id:e.id,label:e.label}))},P={id:`cikar`,title:`Çıkarılsın`,type:`multi`,choices:[{id:`marul`,label:`Marulsuz`},{id:`nane`,label:`Nanesiz`},{id:`nar`,label:`Nar ekşisiz`},{id:`limon`,label:`Limonsuz`}]},F={id:`ekstra`,title:`Ekstralar`,type:`multi`,choices:[{id:`ceviz`,label:`İri çekilmiş ceviz`,price:20},{id:`kofte`,label:`Ekstra çiğ köfte (50 g)`,price:30},{id:`cips`,label:`Çıtır patates cipsi`,price:15}]},I={id:`cigkofte-butik`,tier:`butik`,meta:{title:`İsot Çiğ Köfte · Konya Ereğli`,description:`Acı derecesini sizin seçtiğiniz çiğ köfte. Hafiften ateşe dört kademe; dürüm, tabak ve aile paketleri. Ereğli içi paket servis.`},brand:{name:`İsot`,full:`İsot Çiğ Köfte`,orderPrefix:`IST`},heat:{levels:M,option:N,storageKey:`isot:aci`,start:`orta`},nav:[{href:`#menu`,label:`Menü`},{href:`#yapilis`,label:`Yapılışı`},{href:`#teslimat`,label:`Teslimat`},{href:`#sss`,label:`Sorular`}],hours:{open:`11:00`,close:`00:00`,label:`Her gün`},delivery:{min:150,fee:25,freeOver:400,eta:`25–35 dk`,pickupEta:`10 dk`,pickupDiscount:.1},contact:{phoneDisplay:`0 (332) 000 00 00`,phoneNote:`Kalabalık siparişler için bir gün önceden arayın.`,whatsapp:``,address:`Ereğli Merkez, Konya`,addressNote:`Şube adresi çok yakında burada.`,mapsQuery:`Ereğli, Konya`},emptyCart:`Menüden bir dürüm seçerek başlayın.`,hero:{title:[`Acılı mı`,`olsun?`],cta:`Menüyü aç`},menu:{title:`Menü`,categories:[{id:`durumler`,name:`Dürümler`,note:`İnce lavaşta, göbek marul ve taze naneyle.`,products:[{id:`d-klasik`,name:`Çiğ Köfte Dürüm`,desc:`Göbek marul, nane ve nar ekşisiyle.`,long:`İnce lavaşa 120 g çiğ köfte, göbek marul, taze nane ve nar ekşisi. Sıkıca sarılır, yarısından kesilir.`,price:95,tags:[{text:`En çok satan`}],options:[N,P,F]},{id:`d-cevizli`,name:`Cevizli Dürüm`,desc:`İri çekilmiş ceviz ve nar taneleriyle.`,long:`Harcın içinde iri çekilmiş ceviz, üstünde taze nar taneleri. Dokusu zengin, tadı derin.`,price:125,options:[N,P]},{id:`d-citir`,name:`Çıtır Dürüm`,desc:`İçinde çıtır patates cipsi.`,long:`Klasik dürümün içine bir avuç çıtır patates cipsi. İlk ısırıkta çıtırdar.`,price:110,options:[N,P]},{id:`d-duble`,name:`Duble Dürüm`,desc:`İki kat çiğ köfte, iki kat yeşillik.`,long:`İki lavaş, 240 g çiğ köfte ve bol yeşillik. Tek başına bir öğün.`,price:160,options:[N,P,F]}]},{id:`tabak`,name:`Tabak ve paket`,note:`Paketlerde garnitür ve lavaş hazır gelir.`,products:[{id:`t-porsiyon`,name:`Porsiyon Tabak`,desc:`Altı sıkım çiğ köfte, marul ve limon.`,long:`Altı sıkım çiğ köfte; göbek marul, limon, nar taneleri ve nane ile. Yanında üç lavaş.`,price:175,options:[N,P]},{id:`p-yarim`,name:`Yarım Kilo Paket`,desc:`3–4 kişilik; garnitür ve altı lavaş.`,price:280,options:[N]},{id:`p-kilo`,name:`Bir Kilo Aile Paketi`,desc:`6–8 kişilik; garnitür ve on iki lavaş.`,long:`Kalabalık sofralar için bir kilo çiğ köfte, marul, maydanoz, limon, nar ekşisi ve on iki lavaş.`,price:520,tags:[{text:`Kalabalık sofralara`}],options:[N]}]},{id:`menuler`,name:`Menüler`,products:[{id:`m-ogrenci`,name:`Öğrenci Menüsü`,desc:`Çiğ köfte dürüm ve ayran.`,long:`Bir çiğ köfte dürüm ve bir ayran. Öğrenci kimliğinizi kuryemize göstermeniz yeterli.`,price:115,options:[N,P]},{id:`m-ikili`,name:`İkili Menü`,desc:`İki dürüm, iki ayran ve acılı turşu.`,price:260,options:[N,P]}]},{id:`yaninda`,name:`Yanında`,products:[{id:`y-tursu`,name:`Acılı Turşu`,desc:`Kornişon, turşu biberi ve havuç.`,price:40},{id:`y-garnitur`,name:`Garnitür Seti`,desc:`Marul, maydanoz, limon ve nar ekşisi.`,price:45},{id:`y-lavas`,name:`Ekstra Lavaş`,desc:`Üç adet ince lavaş.`,price:20}]},{id:`icecekler`,name:`İçecekler`,products:[{id:`i-ayran`,name:`Ayran`,desc:`Soğuk, bol köpüklü.`,price:30},{id:`i-salgam`,name:`Şalgam`,desc:`Acılı ya da acısız.`,price:35,options:[{id:`tur`,title:`Tercih`,type:`single`,default:`acili`,choices:[{id:`acili`,label:`Acılı`},{id:`acisiz`,label:`Acısız`}]}]},{id:`i-limonata`,name:`Naneli Limonata`,desc:`Taze sıkılmış limon ve nane.`,price:55}]}]},steps:{id:`yapilis`,title:`Bir sıkımın yolu`,items:[{title:`Yoğurma`,text:`İnce bulgur, isot, salça ve soğan kırk beş dakika elde yoğrulur. Makine kullanmıyoruz.`},{title:`Dinlendirme`,text:`Maydanoz, taze soğan ve nar ekşisi eklenir. Harç yarım saat dinlenir, bulgur suyunu çeker.`},{title:`Sıkım`,text:`Her parça avuçta sıkılır. Parmakların bıraktığı oluklar nar ekşisini ve limonu tutar.`}]},faq:[{q:`Çiğ köftenizde et var mı?`,a:`Hayır. Çiğ köftemiz etsizdir: ince bulgur, isot, salça, soğan, yeşillik ve baharatla yoğrulur.`},{q:`Acı derecesini ürün ürün değiştirebilir miyim?`,a:`Evet. Sayfanın başındaki seçim bütün siparişe uygulanır; ürün penceresinde o ürün için ayrıca değiştirebilirsiniz.`},{q:`Paket servis nerelere var?`,a:`Ereğli merkez ve yakın mahallelere. En az sepet 150 TL; 400 TL ve üzerindeki siparişlerde teslimat ücretsiz.`},{q:`Gel-al siparişte indirim var mı?`,a:`Var. Gel-al siparişlerde sepetinize %10 indirim uygulanır, siparişiniz 10 dakikada hazır olur.`},{q:`Glutensiz seçeneğiniz var mı?`,a:`Bulgur buğdaydan yapıldığı için çiğ köftemiz gluten içerir. Çölyak hastalarına önermiyoruz.`}],footer:{about:`İsot, Konya Ereğli’de acısını müşterisinin seçtiği, her gün elde yoğrulan çiğ köftecidir.`},ui:y,photo:e=>u(`cigkofte-butik`,e)};export{M as HEAT,I as default};