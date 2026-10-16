(function(){var ID='G-EGC6P6F5VN',MODE='EU';/* MODE: 'EU' = banner only for EU/UK/Switzerland (timezone-based, approximate); 'ALL' = banner for everyone */
var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
var need=MODE==='ALL'||/^Europe\//.test(tz)||/^Atlantic\/(Canary|Madeira|Azores|Faroe|Reykjavik)$/.test(tz),st=null;
try{st=localStorage.getItem('gloron_consent')}catch(e){}
window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};
function load(){if(window.__ga)return;window.__ga=1;var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.appendChild(s);gtag('js',new Date());gtag('config',ID)}
function save(v){try{localStorage.setItem('gloron_consent',v)}catch(e){}}
if(!need||st==='granted')load();
else if(!st){var b=document.createElement('div');b.setAttribute('role','dialog');b.setAttribute('aria-label','Cookie consent');b.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:99;background:#211a14;color:#fff;padding:14px 5%;display:flex;gap:12px;flex-wrap:wrap;align-items:center;font:14px DM Sans,sans-serif';
b.innerHTML='<span style="flex:1;min-width:220px">We use Google Analytics cookies to understand how the site is used. <a href="/privacy/" style="color:#e9ca80">Privacy Policy</a></span><button id="gA" style="background:#d9b568;border:0;border-radius:99px;padding:9px 18px;font-weight:700;cursor:pointer">Accept</button><button id="gD" style="background:none;color:#fff;border:1px solid #fff;border-radius:99px;padding:9px 18px;cursor:pointer">Decline</button>';
document.body.appendChild(b);document.getElementById('gA').onclick=function(){save('granted');load();b.remove()};document.getElementById('gD').onclick=function(){save('denied');b.remove()}}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-pack]');if(a)gtag('event','begin_checkout',{currency:'INR',value:+a.dataset.value,items:[{item_name:a.dataset.pack}]})});
})();
