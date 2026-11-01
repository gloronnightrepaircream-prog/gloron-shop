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
// Reviews are saved as "pending" in Supabase and appear after you set status = approved.
const SUPABASE_URL='https://leqwgyjliyifxebickzs.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_DbW1WivxOhEfo7yValBJmg_4JjzCtOC';
const MIN_CHARS=10, MAX_CHARS=1000, MAX_PHOTOS=4, MAX_FILE_MB=15;

const rf=document.getElementById('reviewForm'), rl=document.getElementById('reviewList'), rsum=document.getElementById('reviewSummary');
const statusEl=document.getElementById('reviewStatus'), rr=document.getElementById('rRating'), sp=document.getElementById('starPick');
const rText=document.getElementById('rText'), rCount=document.getElementById('rCount');
const rPhotos=document.getElementById('rPhotos'), prev=document.getElementById('photoPreview');
const sb=window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;

const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const when=d=>{try{return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}catch(e){return''}};
const photoOk=u=>typeof u==='string'&&u.startsWith(SUPABASE_URL+'/storage/');

// Star picker
function paint(n){rr.value=n;[...sp.children].forEach((b,i)=>{b.textContent=i<n?'★':'☆';b.setAttribute('aria-checked',String(i+1===n))})}
for(let i=1;i<=5;i++){const b=document.createElement('button');b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-label',i+(i>1?' stars':' star'));b.onclick=()=>paint(i);sp.appendChild(b)}
paint(5);

// Character counter
function count(){const n=rText.value.trim().length;rCount.textContent=n+' / '+MAX_CHARS+' characters'+(n<MIN_CHARS?' (minimum '+MIN_CHARS+')':'');}
rText.addEventListener('input',count);count();

// Photo picking (max 4) with previews
let picked=[];
function drawPreview(){
  prev.innerHTML='';
  picked.forEach((f,i)=>{
    const box=document.createElement('div'),img=document.createElement('img'),x=document.createElement('button');
    img.src=URL.createObjectURL(f);img.alt='Selected photo '+(i+1);img.onload=()=>URL.revokeObjectURL(img.src);
    x.type='button';x.textContent='×';x.setAttribute('aria-label','Remove photo '+(i+1));
    x.onclick=()=>{picked.splice(i,1);drawPreview();statusEl.textContent=''};
    box.appendChild(img);box.appendChild(x);prev.appendChild(box);
  });
}
rPhotos.addEventListener('change',()=>{
  let msg='';
  for(const f of rPhotos.files){
    if(picked.length>=MAX_PHOTOS){msg='You can add up to '+MAX_PHOTOS+' photos.';break}
    if(!/^image\/(jpeg|png|webp)$/.test(f.type)){msg='Only JPG, PNG or WebP photos can be added.';continue}
    if(f.size>MAX_FILE_MB*1024*1024){msg='Each photo must be under '+MAX_FILE_MB+' MB.';continue}
    picked.push(f);
  }
  rPhotos.value='';drawPreview();
  if(msg)statusEl.textContent=msg;
});

// Review list
function reviewCard(r){
  const n=Number(r.rating)||0;
  const pics=(Array.isArray(r.photo_urls)?r.photo_urls:[]).filter(photoOk).slice(0,MAX_PHOTOS);
  return `<article class="review"><div class="rtop"><span class="stars" aria-label="${n} out of 5">${stars(n)}</span>${r.verified?'<span class="vb">✓ Verified buyer</span>':''}</div><p>${esc(r.review_text)}</p>${pics.length?`<div class="rphotos">${pics.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener"><img class="rphoto" loading="lazy" src="${esc(u)}" alt="Photo shared by ${esc(r.name)}"></a>`).join('')}</div>`:''}${r.owner_reply?`<div class="rreply"><b>Reply from GLORON</b><p>${esc(r.owner_reply)}</p></div>`:''}<div class="rby"><b>${esc(r.name)}</b><small>${when(r.created_at)}</small></div></article>`;
}
function summary(d){
  if(!d.length){rsum.innerHTML='';return}
  const c=[0,0,0,0,0,0];let t=0;
  d.forEach(r=>{const n=Math.min(5,Math.max(1,Number(r.rating)||1));c[n]++;t+=n});
  rsum.innerHTML=`<div class="avg"><strong>${(t/d.length).toFixed(1)}</strong><span class="stars">${stars(Math.round(t/d.length))}</span><small>${d.length} review${d.length>1?'s':''}</small></div><div class="bars">${[5,4,3,2,1].map(n=>`<div><span>${n}★</span><i><u style="width:${Math.round(c[n]/d.length*100)}%"></u></i><span>${c[n]}</span></div>`).join('')}</div>`;
}
async function loadReviews(){
  if(!sb){rl.innerHTML='<div class="card"><b>Reviews are temporarily unavailable.</b><p>Please try again later.</p></div>';return}
  let {data,error}=await sb.from('reviews').select('id,name,rating,review_text,created_at,verified,photo_urls,owner_reply').eq('status','approved').order('created_at',{ascending:false}).limit(100);
  // If the database upgrade has not been run yet, fall back to the basic columns.
  if(error){({data,error}=await sb.from('reviews').select('id,name,rating,review_text,created_at').eq('status','approved').order('created_at',{ascending:false}).limit(100))}
  if(error){console.error(error);rl.innerHTML='<div class="card"><b>Reviews are temporarily unavailable.</b><p>Please try again later.</p></div>';return}
  summary(data);
  rl.innerHTML=data.length?data.map(reviewCard).join(''):'<div class="card"><b>No reviews published yet.</b><p>Be one of the first genuine GLORON customers to share an experience.</p></div>';
}

// Shrink a photo in the browser before upload (max 1200 px, JPEG)
function shrink(f,max=1200){return new Promise((ok,no)=>{const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?ok(b):no(new Error('shrink')),'image/jpeg',.82)};i.onerror=()=>no(new Error('load'));i.src=u})}

// Submit
rf.onsubmit=async e=>{
  e.preventDefault();
  if(document.getElementById('website').value)return; // spam honeypot
  if(!sb){statusEl.textContent='Reviews are temporarily unavailable. Please try again later.';return}
  const name=document.getElementById('rName').value.trim(),rating=Number(rr.value),text=rText.value.trim();
  if(!name){statusEl.textContent='Please enter your name.';return}
  if(rating<1||rating>5){statusEl.textContent='Please choose a star rating.';return}
  if(text.length<MIN_CHARS){statusEl.textContent='Please write at least '+MIN_CHARS+' characters.';return}
  if(text.length>MAX_CHARS){statusEl.textContent='Please keep your review under '+MAX_CHARS+' characters.';return}
  const btn=document.getElementById('reviewSubmit');btn.disabled=true;btn.textContent='SUBMITTING…';statusEl.textContent='Submitting your review…';
  const row={name,rating,review_text:text,status:'pending'};
  try{
    if(picked.length){
      const urls=[];
      for(const f of picked){
        const blob=await shrink(f);if(blob.size>2000000)throw new Error('big');
        const path=Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.jpg';
        const up=await sb.storage.from('review-photos').upload(path,blob,{contentType:'image/jpeg'});if(up.error)throw up.error;
        urls.push(sb.storage.from('review-photos').getPublicUrl(path).data.publicUrl);
      }
      row.photo_urls=urls;
    }
  }catch(err){console.error(err);btn.disabled=false;btn.textContent='SUBMIT REVIEW';statusEl.textContent='We could not upload your photos. Try smaller photos, or submit without photos.';return}
  const {error}=await sb.from('reviews').insert(row);
  btn.disabled=false;btn.textContent='SUBMIT REVIEW';
  if(error){console.error(error);statusEl.textContent='We could not submit your review. Please try again.';return}
  rf.reset();picked=[];drawPreview();paint(5);count();
  statusEl.textContent='Thank you! Your review has been received and will appear after we check it.';
};
render();loadReviews();
