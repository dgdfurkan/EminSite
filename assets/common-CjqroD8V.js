import{C as e,d as t,v as n,y as r}from"./sections-CqLG0D6n.js";var i=(e,t)=>`foto/${e}/${t}.webp`;function a(e,t,r,{w:a=640,h:o=640,cls:s=``,eager:c=!1}={}){return`<img class="${s}" src="${i(e.id,t)}" width="${a}" height="${o}" alt="${n(r)}" ${c?`fetchpriority="high"`:`loading="lazy"`} decoding="async">`}function o(e){return`${r(e.open)}–${r(e.close)}`}function s(t){return`En az sepet ${e(t.min)}. ${e(t.freeOver)} ve üzerinde teslimat ücretsiz, altında ${e(t.fee)}.`}function c(e){return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.contact.mapsQuery)}`}function l(e,t=``){return`
  <div class="faq__list ${t}">
    ${e.map((e,t)=>`
      <div class="faq-item">
        <button class="faq-item__q" type="button" aria-expanded="false" aria-controls="faq-a-${t}" id="faq-q-${t}">
          <span>${n(e.q)}</span><span class="faq-item__icon" aria-hidden="true"></span>
        </button>
        <div class="faq-item__a" id="faq-a-${t}" role="region" aria-labelledby="faq-q-${t}"><p>${n(e.a)}</p></div>
      </div>`).join(``)}
  </div>`}function u(e,t,r){return`
  <div class="mnav ${t}" id="mnav" aria-hidden="true">
    <nav class="mnav__links" aria-label="Mobil menü">${e.nav.map(e=>`<a href="${e.href}" data-scroll>${n(e.label)}</a>`).join(``)}</nav>
    <div class="mnav__foot">
      <span class="b-status" data-open-status><span class="b-status__dot"></span><span data-open-label>…</span></span>
      <a class="btn btn--block" href="#menu" data-scroll>${n(r)}</a>
    </div>
  </div>`}function d(e){return e.nav.map(e=>`<a href="${e.href}" data-scroll>${n(e.label)}</a>`).join(``)}function f(e){return`
    <div class="b-footer__legal">
      <span>© ${new Date().getFullYear()} ${n(e.brand.full)}, Konya Ereğli</span>
      <span>Bu site bir prototiptir. Fiyatlar, adres ve iletişim bilgileri temsilîdir.</span>
    </div>
    ${t(e.id)}`}function p({size:e=160,alpha:t=.07,seed:n=7}={}){let r=document.createElement(`canvas`);r.width=r.height=e;let i=r.getContext(`2d`),a=i.createImageData(e,e),o=n,s=()=>(o=o*16807%2147483647)/2147483647;for(let e=0;e<a.data.length;e+=4){let n=s()>.5?255:0;a.data[e]=a.data[e+1]=a.data[e+2]=n,a.data[e+3]=Math.round(s()*255*t)}return i.putImageData(a,0,0),r.toDataURL(`image/png`)}function m(e){let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:t.top+t.height/2}}export{p as a,u as c,i as d,f as i,d as l,s as n,o,l as r,c as s,m as t,a as u};