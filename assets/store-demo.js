const PRODUCTS = [
  {id:'sunrise', name:'Sunrise Blend', origin:'Ethiopia · Yirgacheffe', notes:'Bright, floral, citrus', roast:'Light', price:18, c:'#d98a4a'},
  {id:'ridgeline', name:'Ridgeline Dark', origin:'Sumatra · Mandheling', notes:'Bold, cocoa, earthy', roast:'Dark', price:19, c:'#3a2c22'},
  {id:'trailhead', name:'Trailhead Espresso', origin:'Brazil + Colombia', notes:'Caramel, balanced, smooth', roast:'Med-Dark', price:20, c:'#6b4327'},
  {id:'morningfog', name:'Morning Fog Decaf', origin:'Colombia · Water Process', notes:'Sweet, nutty, mellow', roast:'Medium', price:18, c:'#9e7b5a'},
  {id:'highland', name:'Highland Reserve', origin:'Guatemala · Huehuetenango', notes:'Red apple, brown sugar', roast:'Light-Med', price:21, c:'#b5743f'},
  {id:'coldbrew', name:'Cold Brew Coarse', origin:'Peru · Cajamarca', notes:'Chocolate, low-acid', roast:'Medium', price:19, c:'#7a5234'},
];
const FREE_SHIP = 35;
let cart = {};

const $ = id => document.getElementById(id);
const fmt = n => '$' + n.toFixed(2);

// render products
function bagSVG(c){
  return `<svg width="120" height="150" viewBox="0 0 120 150"><path d="M22 28 L98 28 L96 142 Q96 146 92 146 L28 146 Q24 146 24 142 Z" fill="${c}"/><rect x="22" y="18" width="76" height="11" rx="2" fill="rgba(0,0,0,.3)"/><rect x="38" y="52" width="44" height="66" rx="5" fill="#f7f1e6"/><circle cx="60" cy="78" r="11" fill="none" stroke="${c}" stroke-width="2"/><path d="M55 78 q5 -8 10 0 q-5 8 -10 0z" fill="${c}"/><rect x="46" y="100" width="28" height="3" rx="1.5" fill="${c}" opacity=".5"/></svg>`;
}
function renderProducts(){
  $('grid').innerHTML = PRODUCTS.map(p => `
    <article class="prod reveal">
      <div class="art" style="background:linear-gradient(150deg, ${p.c}22, ${p.c}0d);">
        <span class="roast">${p.roast} Roast</span>
        ${bagSVG(p.c)}
      </div>
      <div class="meta">
        <h3>${p.name}</h3>
        <div class="origin">${p.origin}</div>
        <div class="notes">${p.notes}</div>
        <div class="row">
          <span class="price">${fmt(p.price)}</span>
          <button class="add" data-id="${p.id}">Add to cart</button>
        </div>
      </div>
    </article>`).join('');
  document.querySelectorAll('.add').forEach(b => b.addEventListener('click', () => addToCart(b.dataset.id, b)));
  observe();
}

function addToCart(id, btn){
  cart[id] = (cart[id]||0) + 1;
  if(btn){ btn.textContent='Added ✓'; btn.classList.add('added'); setTimeout(()=>{btn.textContent='Add to cart';btn.classList.remove('added');},1100); }
  const p = PRODUCTS.find(x=>x.id===id);
  showToast(`${p.name} added to cart`);
  updateCart();
}
function setQty(id, delta){
  cart[id] = (cart[id]||0) + delta;
  if(cart[id] <= 0) delete cart[id];
  updateCart();
}
function removeItem(id){ delete cart[id]; updateCart(); }

function updateCart(){
  const ids = Object.keys(cart);
  const totalItems = ids.reduce((s,id)=>s+cart[id],0);
  const subtotal = ids.reduce((s,id)=>s + cart[id]*PRODUCTS.find(p=>p.id===id).price, 0);
  $('count').textContent = totalItems;
  $('subtotal').textContent = fmt(subtotal);
  $('checkout').disabled = totalItems === 0;
  // shipping note
  if(subtotal === 0) $('shipNote').textContent = 'Your cart is empty.';
  else if(subtotal >= FREE_SHIP) $('shipNote').textContent = '🎉 You\u2019ve unlocked free shipping!';
  else $('shipNote').textContent = `Add ${fmt(FREE_SHIP - subtotal)} more for free shipping.`;
  // items
  if(totalItems === 0){
    $('items').innerHTML = '<div class="empty">Your cart is empty.<br>Add a roast to get started.</div>';
    return;
  }
  $('items').innerHTML = ids.map(id => {
    const p = PRODUCTS.find(x=>x.id===id);
    return `<div class="ci">
      <div class="thumb" style="background:${p.c}1f;">${bagSVG(p.c).replace('width="120" height="150"','width="34" height="42"')}</div>
      <div class="ci-info">
        <div class="n">${p.name}</div>
        <div class="p">${fmt(p.price)} · ${p.roast}</div>
        <div class="qty"><button data-dec="${id}">−</button><span>${cart[id]}</span><button data-inc="${id}">+</button></div>
      </div>
      <button class="rm" data-rm="${id}">Remove</button>
    </div>`;
  }).join('');
  $('items').querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>setQty(b.dataset.inc,1));
  $('items').querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>setQty(b.dataset.dec,-1));
  $('items').querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>removeItem(b.dataset.rm));
}

// drawer
function openCart(){ $('drawer').classList.add('open'); $('overlay').classList.add('open'); }
function closeCart(){ $('drawer').classList.remove('open'); $('overlay').classList.remove('open'); }
$('cartBtn').onclick = openCart;
$('closeCart').onclick = closeCart;
$('overlay').onclick = closeCart;
$('checkout').onclick = () => {
  showToast('This is a concept demo — a live store would open secure Stripe checkout here.', 3200);
};

// toast
let toastT;
function showToast(msg, dur=1800){
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(()=>t.classList.remove('show'), dur);
}

// reveal
let io;
function observe(){
  io = io || new IntersectionObserver(es=>es.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('in'),i*50);io.unobserve(e.target);}}),{threshold:.1});
  document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));
}

renderProducts();
updateCart();
