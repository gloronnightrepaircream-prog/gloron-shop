const price=1599;
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
// Create a Supabase project, run supabase_reviews.sql, then paste your project URL/key here.
const SUPABASE_URL='YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY';
const supabaseReady=SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY.length>20;
const supabaseClient=supabaseReady?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const rf=document.getElementById('reviewForm'), rl=document.getElementById('reviewList'), statusEl=document.getElementById('reviewStatus');
function esc(s){return String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))}
function reviewCard(r){const rating=Number(r.rating)||0;return `<div class="review"><div class="stars">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div><b>${esc(r.name)}</b><p>${esc(r.review_text)}</p></div>`}
async function loadReviews(){
  if(!supabaseReady){rl.innerHTML='<div class="card"><b>Reviews are being connected.</b><p>The review form will work for every customer once the GLORON Supabase project is connected.</p></div>';return}
  const {data,error}=await supabaseClient.from('reviews').select('id,name,rating,review_text,created_at').eq('status','approved').order('created_at',{ascending:false}).limit(50);
  if(error){console.error(error);rl.innerHTML='<div class="card"><b>Reviews are temporarily unavailable.</b><p>Please try again later.</p></div>';return}
  rl.innerHTML=data.length?data.map(reviewCard).join(''):'<div class="card"><b>No reviews published yet.</b><p>Be one of the first genuine GLORON customers to share an experience.</p></div>';
}
rf.onsubmit=async e=>{
  e.preventDefault();
  if(document.getElementById('website').value) return; // spam honeypot
  const name=document.getElementById('rName').value.trim();
  const rating=Number(document.getElementById('rRating').value);
  const text=document.getElementById('rText').value.trim();
  if(!name||!text||rating<1||rating>5)return;
  if(!supabaseReady){statusEl.textContent='Review system is not connected yet. Add the Supabase project URL and anon key in js/main.js.';return}
  const btn=document.getElementById('reviewSubmit');btn.disabled=true;btn.textContent='SUBMITTING…';statusEl.textContent='Submitting your review…';
  const {error}=await supabaseClient.from('reviews').insert({name,rating,review_text:text,status:'pending'});
  btn.disabled=false;btn.textContent='SUBMIT REVIEW';
  if(error){console.error(error);statusEl.textContent='We could not submit your review. Please try again.';return}
  rf.reset();statusEl.textContent='Thank you! Your review has been received and will appear after approval.';
};

render();loadReviews();
