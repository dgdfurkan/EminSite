import{C as e,f as t,g as n,j as r,k as i,v as a}from"./sections-CqLG0D6n.js";import{t as o}from"./icons-SGqHi8fu.js";import{c as s,d as c,i as l,l as u,n as d,o as f,r as p,s as m,u as h}from"./common-CjqroD8V.js";var g=r({init:()=>A,page:()=>D}),_={kus:`M14 56c12-14 26-16 36-4 6-16 20-24 38-22-9 6-13 13-15 22 9 3 13 8 15 14-13-3-26-1-37 6-12-9-24-14-37-16`,yol:`M30 92c6-22 18-32 16-48s6-26 14-36M70 92c-4-22-12-32-10-48s0-26 4-36`,kalp:`M50 84C20 62 12 44 22 30c10-12 24-6 28 6 4-12 18-18 28-6 10 14 2 32-28 54Z`,balik:`M12 50c16-20 46-20 62 0-16 20-46 20-62 0Zm62 0 16-14v28Z`,anahtar:`M24 50a13 13 0 1 0 26 0 13 13 0 1 0-26 0Zm26 0h38m-10 0v12m10-12v9`,yildiz:`M50 12l10 26 28 2-22 18 8 28-24-16-24 16 8-28-22-18 28-2Z`,agac:`M50 90V52m0 12c-12-4-20-12-20-24 0-14 10-22 20-22s20 8 20 22c0 12-8 20-20 24m0 10L36 62m14 8 14-12`,ay:`M62 14a38 38 0 1 0 0 72 30 30 0 1 1 0-72Z`},v=`<svg class="h-cupicon" viewBox="0 0 28 24" aria-hidden="true">
  <defs><clipPath id="h-cup-clip"><path d="M4 7h16l-1.6 9.2A5 5 0 0 1 13.5 20h-3a5 5 0 0 1-4.9-3.8Z"/></clipPath></defs>
  <g clip-path="url(#h-cup-clip)"><rect class="h-cupicon__fill" x="3" y="7" width="18" height="14"/></g>
  <path d="M4 7h16l-1.6 9.2A5 5 0 0 1 13.5 20h-3a5 5 0 0 1-4.9-3.8Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M20 9.5h1.3a2.6 2.6 0 0 1 0 5.2H19.4" fill="none" stroke="currentColor" stroke-width="1.6"/>
  <path class="h-cupicon__steam" d="M10 4.5c-.8-1 .8-1.6 0-2.8M14 4.5c-.8-1 .8-1.6 0-2.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;function y(e){return`
  <a class="skip-link" href="#menu" data-scroll>Menüye geç</a>
  <header class="site-header h-header" id="site-header">
    <div class="wrap h-header__in">
      <a class="h-header__logo" href="#top" data-scroll aria-label="${a(e.brand.full)}, sayfanın başı">${i(e.id)}</a>
      <nav class="h-nav" aria-label="Ana menü">${u(e)}</nav>
      <div class="h-header__actions">
        <button class="cart-btn h-cart" type="button" data-open-cart aria-label="Sepeti aç">
          ${v}<span class="h-cart__label">Sepet</span><span class="h-cart__count" data-cart-count>0</span>
        </button>
        <button class="burger h-burger" type="button" data-burger aria-label="Menüyü aç" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
      </div>
    </div>
  </header>
  ${s(e,`h-mnav`,e.hero.cta)}`}function b(e){let t=e.hero;return`
  <section class="h-hero" id="top" aria-labelledby="h-hero-title">
    <div class="wrap h-hero__grid">
      <div class="h-hero__copy">
        <h1 class="h-hero__title" id="h-hero-title">${t.title.map(e=>`<span class="h-line"><span>${a(e)}</span></span>`).join(``)}</h1>
        <p class="h-hero__text">${a(t.text)}</p>
        <div class="h-hero__ctas">
          <a class="h-btn" href="#menu" data-scroll>${a(t.cta)}</a>
          <a class="h-btn h-btn--line" href="#fal" data-scroll>${a(t.cta2)}</a>
        </div>
      </div>
      <figure class="h-hero__cup">
        <svg class="h-steam" viewBox="0 0 120 120" aria-hidden="true">
          <path d="M44 112c-10-14 10-22 0-38s8-24 2-40" pathLength="1"/>
          <path d="M62 112c-10-16 12-24 0-42s8-22 4-40" pathLength="1"/>
          <path d="M80 112c-8-12 8-20 0-34s6-20 2-34" pathLength="1"/>
        </svg>
        ${h(e,`hero`,`Kobalt desenli fincanda köpüklü Türk kahvesi, tabağında lokum`,{w:1e3,h:1e3,eager:!0,cls:`h-hero__img`})}
      </figure>
    </div>
    <div class="h-band" aria-hidden="true"></div>
  </section>`}function x(t,n){let r=n.tags?.[0]?.text;return`
  <li class="h-item">
    <button class="h-item__main" type="button" data-product="${a(n.id)}">
      <span class="h-item__img">${h(t,n.id,``,{w:640,h:640})}</span>
      <span class="h-item__text">
        <span class="h-item__name">${a(n.name)}${r?` <span class="h-item__tag">${a(r)}</span>`:``}</span>
        <span class="h-item__desc">${a(n.desc)}</span>
      </span>
      <span class="h-item__price">${e(n.price)}</span>
    </button>
    <button class="h-item__add" type="button" data-quick-add="${a(n.id)}" aria-label="${a(n.name)} sepete ekle">${o.plus}</button>
  </li>`}function S(e){let t=e.menu;return`
  <section class="h-menu" id="menu" aria-labelledby="h-menu-title">
    <div class="wrap">
      <h2 class="h-h2" id="h-menu-title">${a(t.title)}</h2>
    </div>
    <div class="h-menu-nav" data-menu-nav>
      <div class="wrap">
        <div class="h-menu-nav__list" data-menu-nav-list>
          ${t.categories.map((e,t)=>`<button class="h-tab${t===0?` is-active`:``}" type="button" data-cat-link="${e.id}">${a(e.name)}</button>`).join(``)}
        </div>
      </div>
    </div>
    <div class="wrap h-menu__cols">
      ${t.categories.map(t=>`
        <section class="h-cat" id="kat-${t.id}" data-cat="${t.id}" aria-labelledby="kat-${t.id}-t">
          <header class="h-cat__head">
            <h3 class="h-h3" id="kat-${t.id}-t">${a(t.name)}</h3>
            ${t.note?`<p>${a(t.note)}</p>`:``}
          </header>
          <ul class="h-list">${t.products.map(t=>x(e,t)).join(``)}</ul>
        </section>`).join(``)}
    </div>
  </section>`}function C(e){let t=e.fal;return`
  <section class="h-fal" id="fal" aria-labelledby="h-fal-title">
    <div class="wrap h-fal__grid">
      <div class="h-fal__copy">
        <h2 class="h-h2" id="h-fal-title">${a(t.title)}</h2>
        <p class="h-fal__text">${a(t.text)}</p>
        <button class="h-btn" type="button" data-fal-btn>${a(t.open)}</button>
        <div class="h-fal__reading" data-fal-reading aria-live="polite"></div>
        <p class="h-fal__note">${a(t.note)}</p>
      </div>
      <div class="h-fal__stage" data-fal-stage>
        ${h(e,`fal-kapali`,`Tabağına kapatılmış kobalt desenli fincan`,{w:900,h:900,cls:`h-fal__closed`})}
        <div class="h-fal__open" data-fal-open hidden>
          <canvas class="h-fal__telve" width="720" height="720" data-fal-canvas></canvas>
          <svg class="h-fal__sym" viewBox="0 0 100 100" aria-hidden="true"><path d="" pathLength="1" data-fal-path/></svg>
        </div>
      </div>
    </div>
  </section>`}function w(e){let t=e.delivery,n=e.contact;return`
  <section class="h-visit" id="ziyaret" aria-labelledby="h-visit-title">
    <div class="wrap h-visit__grid">
      <h2 class="h-h2" id="h-visit-title">Ziyaret</h2>
      <dl class="h-facts">
        <div><dt>Saatler</dt><dd><strong>${f(e.hours)}</strong>${a(e.hours.label)}. ${a(e.hours.extra)}. <span class="open-badge" data-open-badge>…</span></dd></div>
        <div><dt>Adres</dt><dd><strong>${a(n.address)}</strong>${a(n.addressNote)} <a href="${m(e)}" target="_blank" rel="noopener">Haritada aç</a></dd></div>
        <div><dt>Paket servis</dt><dd><strong>${a(t.eta)}</strong>${a(d(t))}</dd></div>
        <div><dt>Telefon</dt><dd><strong>${a(n.phoneDisplay)}</strong>${a(n.phoneNote)}</dd></div>
      </dl>
    </div>
  </section>`}function T(e){return`
  <section class="h-faq" id="sss" aria-labelledby="h-faq-title">
    <div class="wrap h-faq__grid">
      <h2 class="h-h2" id="h-faq-title">Sık sorulanlar</h2>
      ${p(e.faq)}
    </div>
  </section>`}function E(e){return`
  <footer class="site-footer h-footer">
    <div class="h-band h-band--top" aria-hidden="true"></div>
    <div class="wrap">
      <div class="h-footer__top">
        <div class="h-footer__brand">${i(e.id)}<p>${a(e.footer.about)}</p></div>
        <nav class="h-footer__nav" aria-label="Alt menü">${u(e)}</nav>
      </div>
      ${l(e)}
    </div>
  </footer>`}function D(e){return[y(e),`<main id="main">`,b(e),S(e),C(e),w(e),T(e),`</main>`,E(e),t(e)].join(``)}function O(e){let t=e*9301+49297;return()=>(t=(t*9301+49297)%233280)/233280}function k(e,t){let n=e.getContext(`2d`),r=e.width,i=r/2,a=r/2-1,o=O(t+3);n.clearRect(0,0,r,r);let s=n.createRadialGradient(i,i*.9,a*.05,i,i,a);s.addColorStop(0,`#fbfaf6`),s.addColorStop(.72,`#efebe2`),s.addColorStop(1,`#d6d0c3`),n.fillStyle=s,n.beginPath(),n.arc(i,i,a,0,Math.PI*2),n.fill(),n.save(),n.beginPath(),n.arc(i,i,a*.95,0,Math.PI*2),n.clip();let c=e=>`rgba(${42+o()*22},${25+o()*12},${15+o()*8},${e})`,l=(e,t,r,i)=>{let a=n.createRadialGradient(e,t,0,e,t,r);a.addColorStop(0,c(i)),a.addColorStop(.6,c(i*.7)),a.addColorStop(1,`rgba(40,24,15,0)`),n.fillStyle=a,n.beginPath(),n.arc(e,t,r,0,Math.PI*2),n.fill()};n.filter=`blur(1.5px)`;for(let e=0;e<64;e++){let e=o()*Math.PI*2,t=a*o()**1.4*.55;l(i+Math.cos(e)*t,i+Math.sin(e)*t,a*(.07+o()*.15),.45+o()*.4)}let u=10+Math.floor(o()*5);for(let e=0;e<u;e++){let e=o()*Math.PI*2,t=a*(.4+o()*.45),n=a*(.06+o()*.06),r=i+Math.cos(e)*a*.25,s=i+Math.sin(e)*a*.25,c=e,u=(o()-.5)*.04;for(let e=0;e<42;e++)u+=(o()-.5)*.02,c+=u,r+=Math.cos(c)*t/42,s+=Math.sin(c)*t/42,l(r,s,n,.16+o()*.14),n*=.972}n.filter=`none`,n.globalCompositeOperation=`destination-out`;for(let e=0;e<9;e++){let e=o()*Math.PI*2,t=a*(.25+o()*.5),r=a*(.06+o()*.1),s=n.createRadialGradient(i+Math.cos(e)*t,i+Math.sin(e)*t,0,i+Math.cos(e)*t,i+Math.sin(e)*t,r);s.addColorStop(0,`rgba(0,0,0,0.55)`),s.addColorStop(1,`rgba(0,0,0,0)`),n.fillStyle=s,n.beginPath(),n.arc(i+Math.cos(e)*t,i+Math.sin(e)*t,r,0,Math.PI*2),n.fill()}n.globalCompositeOperation=`source-over`,n.globalCompositeOperation=`destination-over`,n.fillStyle=s,n.beginPath(),n.arc(i,i,a,0,Math.PI*2),n.fill(),n.globalCompositeOperation=`source-over`;for(let e=0;e<900;e++){let e=o()*Math.PI*2,t=a*Math.sqrt(o())*.94;n.fillStyle=`rgba(40,24,15,${.15+o()*.45})`;let r=1+o()*2.2;n.fillRect(i+Math.cos(e)*t,i+Math.sin(e)*t,r,r)}s=n.createRadialGradient(i,i,a*.78,i,i,a*.95),s.addColorStop(0,`rgba(0,0,0,0)`),s.addColorStop(1,`rgba(60,45,30,0.22)`),n.fillStyle=s,n.fillRect(0,0,r,r),n.restore(),n.strokeStyle=`#c5a24a`,n.lineWidth=r*.014,n.beginPath(),n.arc(i,i,a*.965,0,Math.PI*2),n.stroke()}function A({gsap:e,concept:t,cart:r,reduced:i}){let o=n(`.h-cupicon__fill`),s=()=>{let e=Math.min(r.count,4)/4;o.style.transform=`translateY(${(1-e)*100}%)`};r.subscribe(s),s(),document.addEventListener(`cart:added`,()=>{i||e.fromTo(`.h-cupicon__steam`,{y:3,autoAlpha:0},{y:-2,autoAlpha:1,duration:.5,ease:`power2.out`,yoyo:!0,repeat:1,repeatDelay:.3})});let c=n(`.h-hero`);new IntersectionObserver(([e])=>c.classList.toggle(`is-away`,!e.isIntersecting)).observe(c);let l=t.fal,u=n(`[data-fal-btn]`),d=n(`.h-fal__closed`),f=n(`[data-fal-open]`),p=n(`[data-fal-canvas]`),m=n(`[data-fal-path]`),h=n(`[data-fal-reading]`),g=l.readings.map((e,t)=>t).sort(()=>Math.random()-.5),v=0,y=!1;function b(){return v>=g.length&&(g=g.sort(()=>Math.random()-.5),v=0),l.readings[g[v++]]}function x(t,n){if(k(p,v*7+Math.round(Math.random()*50)),m.setAttribute(`d`,_[t.sym]),h.innerHTML=`<h3>Fincanda bir ${a(t.title.toLocaleLowerCase(`tr-TR`))} görünüyor.</h3><p>${a(t.text)}</p>`,u.textContent=l.again,i){d.hidden=!0,f.hidden=!1,m.style.strokeDashoffset=`0`;return}let r=e.timeline({onComplete:()=>y=!1});n?r.to(d,{y:-26,rotate:-10,duration:.45,ease:`power2.out`}).to(d,{scaleX:0,duration:.25,ease:`power2.in`}).add(()=>{d.hidden=!0,f.hidden=!1}).fromTo(f,{scaleX:0,rotate:8},{scaleX:1,rotate:0,duration:.45,ease:`back.out(1.6)`}):r.fromTo(f,{rotate:0},{rotate:360,duration:.9,ease:`power3.inOut`}),r.fromTo(m,{strokeDashoffset:1},{strokeDashoffset:0,duration:1.3,ease:`power2.inOut`},`-=0.15`),r.fromTo(h.children,{y:12,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,stagger:.12,ease:`power3.out`},`-=0.9`)}return u.addEventListener(`click`,()=>{y||(y=!i,x(b(),!d.hidden))}),{intro(){let t=e.timeline({defaults:{ease:`power3.out`}});return i||(t.from(`#site-header`,{yPercent:-100,autoAlpha:0,duration:.8,clearProps:`transform,opacity,visibility`},0),t.from(`.h-line > span`,{yPercent:110,duration:1,stagger:.12},.1),t.from([`.h-hero__text`,`.h-hero__ctas`],{y:14,autoAlpha:0,duration:.8,stagger:.1},.45),t.from(`.h-hero__img`,{y:60,autoAlpha:0,duration:1.1,ease:`power3.out`},.25),t.from(`.h-steam`,{autoAlpha:0,duration:1.2},1.1)),t}}}var j={id:`seker`,title:`Şeker`,type:`single`,default:`orta`,choices:[{id:`sade`,label:`Sade`},{id:`az`,label:`Az şekerli`},{id:`orta`,label:`Orta`},{id:`sekerli`,label:`Şekerli`}]},M={id:`sut`,title:`Süt`,type:`single`,default:`inek`,choices:[{id:`inek`,label:`İnek sütü`,hideInSummary:!0},{id:`yulaf`,label:`Yulaf sütü`,price:15},{id:`laktozsuz`,label:`Laktozsuz`,price:10}]},N={id:`kafe-butik`,tier:`butik`,meta:{title:`Hatır Kahve · Konya Ereğli`,description:`Bakır cezvede Türk kahvesi, dibek, menengiç ve tatlılar. Kobalt fincanlarda servis, sonunda fal. Ereğli içi paket servis.`},brand:{name:`Hatır`,full:`Hatır Kahve`,orderPrefix:`HTR`},nav:[{href:`#menu`,label:`Menü`},{href:`#fal`,label:`Fal`},{href:`#ziyaret`,label:`Ziyaret`},{href:`#sss`,label:`Sorular`}],hours:{open:`08:00`,close:`00:00`,label:`Her gün`,extra:`Sabah menüsü 12.00’ye kadar`},delivery:{min:150,fee:20,freeOver:350,eta:`25–35 dk`,pickupEta:`10 dk`,pickupDiscount:0},contact:{phoneDisplay:`0 (332) 000 00 00`,phoneNote:`Toplantı ve davetler için önceden arayın.`,whatsapp:``,address:`Ereğli Merkez, Konya`,addressNote:`Kahvehanemizin adresi çok yakında burada.`,mapsQuery:`Ereğli, Konya`},emptyCart:`Bir Türk kahvesiyle başlayın; lokumu bizden.`,hero:{title:[`Kahveniz bizden,`,`hatırı sizden.`],text:`Bakır cezvede, közde pişen Türk kahvesi. Kobalt desenli fincanda gelir; yanında lokum, dibinde fal.`,cta:`Kahve seçin`,cta2:`Falıma bakın`},menu:{title:`Menü`,categories:[{id:`turk`,name:`Türk kahvesi`,note:`Bakır cezvede, közde pişer. Yanında su ve lokum gelir.`,products:[{id:`k-turk`,name:`Türk Kahvesi`,desc:`Közde, bakır cezvede, bol köpüklü.`,long:`Taze çekilmiş çekirdek, bakır cezvede ağır ağır pişer; köpüğü fincana kaşıkla paylaştırılır. Yanında bir bardak su ve lokum.`,price:80,tags:[{text:`En çok içilen`}],options:[j]},{id:`k-dibek`,name:`Dibek Kahvesi`,desc:`Taş dibekte dövülür, daha yumuşak içimli.`,price:90,options:[j]},{id:`k-menengic`,name:`Menengiç`,desc:`Kafeinsiz, sütlü ve fıstıksı.`,price:95,options:[j]},{id:`k-sakizli`,name:`Damla Sakızlı`,desc:`Sakızın serinliğiyle.`,price:90,options:[j]}]},{id:`cay`,name:`Çay`,products:[{id:`c-cay`,name:`Çay`,desc:`İnce belli bardakta, tavşan kanı.`,price:25},{id:`c-demlik`,name:`Demlik Çay`,desc:`Dört bardaklık demlik.`,price:90},{id:`c-ihlamur`,name:`Ihlamur`,desc:`Bir dilim limonla.`,price:70}]},{id:`espresso`,name:`Espresso ve süt`,products:[{id:`e-espresso`,name:`Espresso`,desc:`Kısa, yoğun, kremalı.`,price:75},{id:`e-latte`,name:`Latte`,desc:`Espresso ve ince köpüklü süt.`,price:115,options:[M]},{id:`e-flatwhite`,name:`Flat White`,desc:`Çift espresso, kadife süt.`,price:120,options:[M]}]},{id:`tatli`,name:`Tatlılar`,products:[{id:`t-lokum`,name:`Lokum Tabağı`,desc:`Güllü, fıstıklı ve sade.`,price:60},{id:`t-baklava`,name:`Fıstıklı Baklava`,desc:`Üç dilim; ince yufka, Antep fıstığı.`,price:190},{id:`t-sansebastian`,name:`San Sebastian`,desc:`Yanık yüzlü, içi akışkan cheesecake.`,price:165}]},{id:`sabah`,name:`Sabah`,note:`Saat 12.00’ye kadar.`,products:[{id:`s-simit`,name:`Simit ve Peynir`,desc:`Taze simit, beyaz peynir ve bir çay.`,price:95},{id:`s-tost`,name:`Kaşarlı Tost`,desc:`Köy ekmeğinde, bol kaşarlı.`,price:120}]}]},fal:{title:`Fincanı kapatın.`,text:`Kahvenizi bitirdiyseniz fincanı tabağa kapatın, biraz soğusun. Hazır olunca açın, telveye birlikte bakalım.`,open:`Fincanı aç`,again:`Bir daha bak`,note:`Fala inanma, falsız kalma.`,readings:[{sym:`kus`,title:`Kuş`,text:`Yakında bir haber var. Telefon çaldığında gülümseyerek açın.`},{sym:`yol`,title:`Yol`,text:`Önünüzde kısa bir yol görünüyor. Dönüşü güzel bir sofraya çıkıyor.`},{sym:`kalp`,title:`Kalp`,text:`Gönlünüz ferah. Birine kahve ısmarlamanın tam zamanı.`},{sym:`balik`,title:`Balık`,text:`Kısmet kapıda. Belki de bir dilim baklavadır.`},{sym:`anahtar`,title:`Anahtar`,text:`Bir kapı aralanıyor. Ne olduğunu kahve soğumadan anlarsınız.`},{sym:`yildiz`,title:`Yıldız`,text:`Dileğiniz yolda. Biraz sabır, biraz şeker.`},{sym:`agac`,title:`Ağaç`,text:`Kökleriniz sağlam. Sevdiklerinizle bir kahve molası iyi gelir.`},{sym:`ay`,title:`Hilal`,text:`Gece sakin geçecek. Akşam kahvesini kafeinsiz menengiçten seçin.`}]},faq:[{q:`Türk kahvesi paket serviste soğumaz mı?`,a:`Kahveyi ısı tutan kapaklı bardakta, köpüğünü bozmadan gönderiyoruz. Yine de en güzeli, dükkânda közden yeni inmişini içmek.`},{q:`Menengiç kafein içerir mi?`,a:`Hayır. Menengiç, yabani fıstık ağacının meyvesinden yapılır; kafein içermez.`},{q:`Falı kim bakıyor?`,a:`Sitedeki fal eğlence içindir. Dükkânda da isteyen misafirimize, kahve bitince fincanını birlikte okuruz.`},{q:`Bitki sütü var mı?`,a:`Latte ve flat white’ı yulaf sütüyle ya da laktozsuz sütle hazırlayabiliyoruz.`},{q:`Paket servis nerelere var?`,a:`Ereğli merkez ve yakın mahallelere. En az sepet 150 TL; 350 TL ve üzerindeki siparişlerde teslimat ücretsiz.`}],footer:{about:`Hatır, Konya Ereğli’de Türk kahvesini bakır cezvede, közde pişiren ve kobalt fincanlarda sunan bir kahve evidir.`},ui:g,photo:e=>c(`kafe-butik`,e)};export{N as default};