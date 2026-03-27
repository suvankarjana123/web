/* =============================================
   SAVOUR — Food Ordering Website JavaScript
   Link: <script src="savour.js"></script>
   ============================================= */

/* ── MENU DATA ── */
const MENU = [
  {
    id: 1,
    name: "The Classic Smash Burger",
    category: "burger",
    desc: "Double smash patty, aged cheddar, caramelised onion, house sauce, brioche bun.",
    price: 349,
    time: "18 min",
    cal: "680 kcal",
    rating: 4.9,
    badge: "Best Seller",
    badgeClass: "",
    image: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=500"
  },
  {
    id: 2,
    name: "Truffle Mushroom Pasta",
    category: "pasta",
    desc: "Hand-rolled tagliatelle, wild mushrooms, truffle oil, parmesan, fresh thyme.",
    price: 429,
    time: "22 min",
    cal: "520 kcal",
    rating: 4.8,
    badge: "Chef's Pick",
    badgeClass: "new",
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=500"
  },
  {
    id: 3,
    name: "Grilled Chicken Caesar",
    category: "salad",
    desc: "Romaine, grilled chicken breast, house-made Caesar dressing, croutons, shaved parmesan.",
    price: 319,
    time: "15 min",
    cal: "410 kcal",
    rating: 4.7,
    badge: "Healthy",
    badgeClass: "veg",
    image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=500"
  },
  {
    id: 4,
    name: "Molten Lava Cake",
    category: "dessert",
    desc: "Warm dark chocolate cake with a gooey centre, vanilla bean ice cream, raspberry coulis.",
    price: 249,
    time: "12 min",
    cal: "390 kcal",
    rating: 5.0,
    badge: "Fan Fave",
    badgeClass: "",
    image: "https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=500"
  },
  {
    id: 5,
    name: "Spicy Arrabbiata Penne",
    category: "pasta",
    desc: "Penne rigate, San Marzano tomatoes, garlic, fresh chilli, basil, aged pecorino.",
    price: 369,
    time: "20 min",
    cal: "480 kcal",
    rating: 4.6,
    badge: "Spicy 🌶",
    badgeClass: "",
    image: "https://images.pexels.com/photos/1487511/pexels-photo-1487511.jpeg?auto=compress&cs=tinysrgb&w=500"
  },
  {
    id: 6,
    name: "Avocado Garden Salad",
    category: "salad",
    desc: "Heirloom tomatoes, cucumber, avocado, quinoa, lemon-herb vinaigrette, seeds.",
    price: 289,
    time: "10 min",
    cal: "320 kcal",
    rating: 4.7,
    badge: "Vegan",
    badgeClass: "veg",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500"
  },
  {
    id: 7,
    name: "BBQ Bacon Crunch Burger",
    category: "burger",
    desc: "Beef patty, crispy bacon, smoked BBQ sauce, coleslaw, pickled jalapeño, sesame bun.",
    price: 399,
    time: "20 min",
    cal: "780 kcal",
    rating: 4.8,
    badge: "New",
    badgeClass: "new",
    image: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=500"
  },
  {
    id: 8,
    name: "Mango Passion Smoothie",
    category: "drinks",
    desc: "Alphonso mango, passion fruit, coconut milk, chia seeds, squeeze of lime.",
    price: 179,
    time: "5 min",
    cal: "220 kcal",
    rating: 4.9,
    badge: "Cold & Fresh",
    badgeClass: "veg",
    image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=500"
  }
];

/* ── STATE ── */
let cart          = {};   // { [id]: { ...item, qty } }
let liked         = {};   // { [id]: boolean }
let currentFilter = 'all';

/* ─────────────────────────────────────────────
   RENDER MENU
   Builds all food cards for the given category.
   Pass 'all' to show every item.
───────────────────────────────────────────── */
function renderMenu(filter = 'all') {
  const grid  = document.getElementById('menuGrid');
  const items = filter === 'all' ? MENU : MENU.filter(i => i.category === filter);

  grid.innerHTML = items.map((item, idx) => {
    const qty = cart[item.id] ? cart[item.id].qty : 0;

    // Determine the add/qty control to show
    const actionHTML = qty === 0
      ? `<button class="add-btn" onclick="addToCart(${item.id})">+ Add</button>`
      : `<div class="qty-control">
           <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
           <span class="qty-num" id="qty-${item.id}">${qty}</span>
           <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
         </div>`;

    return `
    <div class="food-card" style="animation-delay:${idx * 0.08}s" data-category="${item.category}">
      <div class="card-image-wrap">
        <img
          src="${item.image}"
          alt="${item.name}"
          loading="lazy"
          onerror="this.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500'"
        >
        <span class="card-badge ${item.badgeClass}">${item.badge}</span>
        <button class="card-fav ${liked[item.id] ? 'liked' : ''}" onclick="toggleLike(${item.id}, this)">
          ${liked[item.id] ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-category">${item.category}</span>
          <span class="card-rating">⭐ ${item.rating}</span>
        </div>
        <h3 class="card-name">${item.name}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer">
          <div>
            <div class="card-price"><sup>₹</sup>${item.price}</div>
            <div class="card-info">
              <span>⏱ ${item.time}</span>
              <span>🔥 ${item.cal}</span>
            </div>
          </div>
          ${actionHTML}
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   CATEGORY FILTER
   Called by the pill buttons in the nav bar.
───────────────────────────────────────────── */
function filterMenu(cat, el) {
  currentFilter = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderMenu(cat);
}

/* ─────────────────────────────────────────────
   CART — ADD
───────────────────────────────────────────── */
function addToCart(id) {
  const item = MENU.find(i => i.id === id);
  if (!cart[id]) cart[id] = { ...item, qty: 0 };
  cart[id].qty++;
  updateCartUI();
  showToast(`🛒 ${item.name} added to cart!`);
  renderMenu(currentFilter);
}

/* ─────────────────────────────────────────────
   CART — CHANGE QUANTITY (+/-)
   Removes the item when qty reaches 0.
───────────────────────────────────────────── */
function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
  renderMenu(currentFilter);
}

/* ─────────────────────────────────────────────
   FAVOURITES TOGGLE
───────────────────────────────────────────── */
function toggleLike(id, btn) {
  liked[id] = !liked[id];
  btn.textContent = liked[id] ? '❤️' : '🤍';
  btn.classList.toggle('liked', liked[id]);
}

/* ─────────────────────────────────────────────
   UPDATE CART SIDEBAR UI
   Rebuilds the cart item list + totals.
───────────────────────────────────────────── */
function updateCartUI() {
  const total  = Object.values(cart).reduce((sum, i) => sum + i.qty, 0);
  const body   = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');

  // Update nav badge
  document.getElementById('cartCount').textContent = total;

  // Empty state
  if (total === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <span>Add some delicious items to get started!</span>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  // Populated state
  footer.style.display = 'block';
  let subtotal = 0;

  body.innerHTML = Object.values(cart).map(item => {
    subtotal += item.price * item.qty;
    return `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.qty}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>`;
  }).join('');

  // Pricing breakdown
  const DELIVERY_FEE = 49;
  const TAX_RATE     = 0.05;
  const tax          = Math.round(subtotal * TAX_RATE);
  const grand        = subtotal + DELIVERY_FEE + tax;

  document.getElementById('cartSubtotal').textContent = '₹' + subtotal;
  document.getElementById('cartTax').textContent      = '₹' + tax;
  document.getElementById('cartGrand').textContent    = '₹' + grand;
}

/* ─────────────────────────────────────────────
   TOGGLE CART SIDEBAR
───────────────────────────────────────────── */
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

/* ─────────────────────────────────────────────
   TOAST NOTIFICATION
   Auto-dismisses after 2.8 seconds.
───────────────────────────────────────────── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ─────────────────────────────────────────────
   CHECKOUT
   Clears the cart and confirms with a toast.
───────────────────────────────────────────── */
function checkout() {
  const total = Object.values(cart).reduce((sum, i) => sum + i.qty, 0);
  if (total === 0) return;
  cart = {};
  updateCartUI();
  toggleCart();
  showToast('✅ Order placed! Estimated delivery: 25 min');
}

/* ── INIT ── */
renderMenu();
