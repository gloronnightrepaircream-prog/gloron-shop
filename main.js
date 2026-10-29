const price=1399;
let qty=0;
const drawer=document.getElementById('drawer');
function render(){document.getElementById('count').textContent=qty;document.getElementById('total').textContent=(qty*price).toLocaleString('en-IN');document.getElementById('cartItems').innerHTML=qty?`<p>GLORON Night Repair Cream · 30 g × ${qty}</p>`:'<p>Your cart is empty.</p>'}
function openCart(){drawer.classList.add('open')}
document.getElementById('add').onclick=()=>{qty++;render();openCart()};
document.getElementById('buy').onclick=()=>{qty=1;render();openCart()};
document.getElementById('cartBtn').onclick=openCart;
document.getElementById('close').onclick=()=>drawer.classList.remove('open');
document.getElementById('checkout').onclick=()=>alert('Checkout is ready for Razorpay integration. Add your live Razorpay credentials after verification.');
document.querySelector('.menu').onclick=()=>{const n=document.querySelector('nav');n.style.display=n.style.display==='flex'?'none':'flex';n.style.flexDirection='column'};

// ---------------- REVIEW SYSTEM ----------------
// Builds the new review section in place, so index.html and style.css stay untouched.
(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='/css/reviews.css';document.head.appendChild(l);document.getElementById('reviews').innerHTML=`<span>REAL EXPERIENCES</span><h2>Customer <em>reviews.</em></h2><div id="reviewSummary" class="rsum"></div><div class="reviewGrid"><form id="reviewForm" class="card"><h3>Write a review</h3><label>Name<input id="rName" required maxlength="80" autocomplete="name"></label><div class="lbl">Rating</div><div id="starPick" class="starPick" role="radiogroup" aria-label="Rating"></div><input type="hidden" id="rRating" value="5"><label>Your honest review<textarea id="rText" required minlength="10" maxlength="800"></textarea></label><label>Order number (optional)<input id="rOrder" maxlength="30" placeholder="e.g. #1001"><small>Helps us mark you as a verified buyer. It is never shown publicly.</small></label><label>Photo (optional)<input id="rPhoto" type="file" accept="image/jpeg,image/png,image/webp"><small>One photo, JPG, PNG or WebP.</small></label><input id="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn dark" id="reviewSubmit">Submit review</button><small id="reviewStatus" aria-live="polite">Reviews are checked before they appear. Please share only genuine experiences.</small></form><div id="reviewList"></div></div>`})();
const SUPABASE_URL='https://leqwgyjliyifxebickzs.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_DbW1WivxOhEfo7yValBJmg_4JjzCtOC';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const rf=document.getElementById('reviewForm'),rl=document.getElementById('reviewList'),rsum=document.getElementById('reviewSummary'),statusEl=document.getElementById('reviewStatus'),rr=document.getElementById('rRating'),sp=document.getElementById('starPick');
const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const when=d=>{try{return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}catch(e){return''}};
function paint(n){rr.value=n;[...sp.children].forEach((b,i)=>{b.textContent=i<n?'★':'☆';b.setAttribute('aria-checked',String(i+1===n))})}
for(let i=1;i<=5;i++){const b=document.createElement('button');b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-label',i+(i>1?' stars':' star'));b.onclick=()=>paint(i);sp.appendChild(b)}paint(5);
function reviewCard(r){const n=Number(r.rating)||0,ok=r.photo_url&&String(r.photo_url).startsWith(SUPABASE_URL+'/storage/');
return `<article class="review"><div class="rtop"><span class="stars" aria-label="${n} out of 5">${stars(n)}</span>${r.verified?'<span class="vb">✓ Verified buyer</span>':''}</div><p>${esc(r.review_text)}</p>${ok?`<a href="${esc(r.photo_url)}" target="_blank" rel="noopener"><img class="rphoto" loading="lazy" src="${esc(r.photo_url)}" alt="Photo shared by ${esc(r.name)}"></a>`:''}<div class="rby"><b>${esc(r.name)}</b><small>${when(r.created_at)}</small></div></article>`}
function summary(d){if(!d.length){rsum.innerHTML='';return}const c=[0,0,0,0,0,0];let t=0;d.forEach(r=>{const n=Math.min(5,Math.max(1,Number(r.rating)||1));c[n]++;t+=n});
rsum.innerHTML=`<div class="avg"><strong>${(t/d.length).toFixed(1)}</strong><span class="stars">${stars(Math.round(t/d.length))}</span><small>${d.length} review${d.length>1?'s':''}</small></div><div class="bars">${[5,4,3,2,1].map(n=>`<div><span>${n}★</span><i><u style="width:${Math.round(c[n]/d.length*100)}%"></u></i><span>${c[n]}</span></div>`).join('')}</div>`}
async function loadReviews(){
  let {data,error}=await sb.from('reviews').select('id,name,rating,review_text,created_at,verified,photo_url').eq('status','approved').order('created_at',{ascending:false}).limit(100);
  if(error){({data,error}=await sb.from('reviews').select('id,name,rating,review_text,created_at').eq('status','approved').order('created_at',{ascending:false}).limit(100))}
  if(error){console.error(error);rl.innerHTML='<div class="card"><b>Reviews are temporarily unavailable.</b><p>Please try again later.</p></div>';return}
  summary(data);
  rl.innerHTML=data.length?data.map(reviewCard).join(''):'<div class="card"><b>No reviews published yet.</b><p>Be one of the first genuine GLORON customers to share an experience.</p></div>';
}
function shrink(f,max=1200){return new Promise((ok,no)=>{const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?ok(b):no(),'image/jpeg',.82)};i.onerror=no;i.src=u})}
rf.onsubmit=async e=>{
  e.preventDefault();
  if(document.getElementById('website').value)return; // spam honeypot
  const name=document.getElementById('rName').value.trim(),rating=Number(rr.value),text=document.getElementById('rText').value.trim(),order=document.getElementById('rOrder').value.trim(),file=document.getElementById('rPhoto').files[0];
  if(!name||text.length<10||rating<1||rating>5)return;
  const btn=document.getElementById('reviewSubmit');btn.disabled=true;btn.textContent='Submitting…';statusEl.textContent='Submitting your review…';
  const row={name,rating,review_text:text,status:'pending'};if(order)row.order_ref=order;
  try{
    if(file){const blob=await shrink(file);if(blob.size>2000000)throw new Error('big');const path=Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.jpg';
      const up=await sb.storage.from('review-photos').upload(path,blob,{contentType:'image/jpeg'});if(up.error)throw up.error;
      row.photo_url=sb.storage.from('review-photos').getPublicUrl(path).data.publicUrl}
  }catch(err){console.error(err);btn.disabled=false;btn.textContent='Submit review';statusEl.textContent='We could not upload that photo. Try a smaller JPG or PNG, or submit without a photo.';return}
  const {error}=await sb.from('reviews').insert(row);
  btn.disabled=false;btn.textContent='Submit review';
  if(error){console.error(error);statusEl.textContent='We could not submit your review. Please try again.';return}
  rf.reset();paint(5);statusEl.textContent='Thank you! Your review has been received and will appear after we check it.';
};
render();loadReviews();
