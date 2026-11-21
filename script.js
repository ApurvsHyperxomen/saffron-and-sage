// Menu Data
const menuItems = [
  {
    id: 1,
    name: "Royal Heritage Thali",
    category: "mains",
    price: 449,
    tag: "Bestseller",
    desc: "Paneer masala, dal tadka, seasonal sabzi, dry fruit dhokla, warm phulkas, jeera rice, papad, and rabdi.",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Smoky Charcoal Paneer Tikka",
    category: "starters",
    price: 329,
    tag: "Chef's Pick",
    desc: "Cottage cheese cubes marinated in hung curd, saffron, and roasted spices, charred in a clay oven.",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Artisanal Crispy Chaat Platter",
    category: "starters",
    price: 219,
    tag: "Street Classic",
    desc: "Crisp puris, spiced potatoes, pomegranate pearls, sweet tamarind glaze, and chilled mint water.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Ghee Podi Button Idlis",
    category: "south",
    price: 189,
    tag: "Popular",
    desc: "Pillow-soft steamed mini idlis tossed in cultured A2 desi ghee and roasted lentil gunpowder.",
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    name: "Subz Dum Handi Biryani",
    category: "mains",
    price: 359,
    tag: "Slow Cooked",
    desc: "Long-grain basmati rice layered with spiced seasonal vegetables, caramelized onions, and saffron milk.",
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    name: "Velvet Paneer Lababdar & Naan",
    category: "mains",
    price: 379,
    tag: "Rich Gravy",
    desc: "Simmered tomato-cashew gravy finished with kasuri methi, paired with garlic butter clay-oven naan.",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 7,
    name: "Kesar Pistachio Rabdi",
    category: "desserts",
    price: 179,
    tag: "Sweet Finish",
    desc: "Slow-reduced cardamom milk crowned with Kashmiri saffron strands and roasted pistachio slivers.",
    image:
      "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 8,
    name: "Fresh Sugarcane Ginger Cooler",
    category: "desserts",
    price: 129,
    tag: "Refreshing",
    desc: "Cold-pressed sugarcane juice balanced with crushed ginger, black salt, and fresh lime zest.",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=80",
  },
];

// App State
let cart = [];
let activeCategory = "all";
let searchQuery = "";

// DOM References
const navbar = document.getElementById("navbar");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const menuGrid = document.getElementById("menuGrid");
const menuFilters = document.getElementById("menuFilters");
const menuSearch = document.getElementById("menuSearch");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartTaxEl = document.getElementById("cartTax");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const reservationForm = document.getElementById("reservationForm");
const toastContainer = document.getElementById("toastContainer");

// Fallback placeholder if image fails to load offline
function getFallbackImage(title) {
  const safeTitle = encodeURIComponent(title);
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect fill="%23efe8dc" width="400" height="260"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia" font-size="18" fill="%234a554e">${safeTitle}</text></svg>`;
}

// Render Menu Cards
function renderMenu() {
  const filtered = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery) ||
      item.desc.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    menuGrid.innerHTML = `
      <div class="empty-state">
        <h3>No matching dishes found</h3>
        <p>Try clearing your search or selecting a different category.</p>
      </div>
    `;
    return;
  }

  menuGrid.innerHTML = filtered
    .map(
      (item) => `
      <article class="dish-card">
        <div class="dish-img-wrap">
          <img
            src="${item.image}"
            alt="${item.name}"
            loading="lazy"
            onerror="this.src='${getFallbackImage(item.name)}'"
          />
          <span class="dish-tag">${item.tag}</span>
          <span class="veg-mark" title="Pure Vegetarian"></span>
        </div>
        <div class="dish-body">
          <div class="dish-title-row">
            <h3>${item.name}</h3>
            <span class="dish-price">₹${item.price}</span>
          </div>
          <p class="dish-desc">${item.desc}</p>
          <button class="add-btn" onclick="addToCart(${item.id})">
            + Add to Order
          </button>
        </div>
      </article>
    `
    )
    .join("");
}

// Cart Functions
function addToCart(id) {
  const dish = menuItems.find((item) => item.id === id);
  if (!dish) return;

  const existing = cart.find((entry) => entry.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...dish, qty: 1 });
  }

  updateCartUI();
  showToast(`Added "${dish.name}" to your order`);
}

function updateQty(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  }
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <p>Your plate is currently empty.</p>
        <p style="font-size: 0.85rem; margin-top: 6px;">Explore our menu to add fresh dishes.</p>
      </div>
    `;
  } else {
    cartItemsEl.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span>₹${item.price * item.qty}</span>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  cartSubtotalEl.textContent = `₹${subtotal}`;
  cartTaxEl.textContent = `₹${tax}`;
  cartTotalEl.textContent = `₹${total}`;
}

function toggleCart(open) {
  cartDrawer.classList.toggle("open", open);
  cartOverlay.classList.toggle("open", open);
}

// Toast Helper
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "0.25s ease";
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

// Event Listeners
menuFilters.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  activeCategory = btn.dataset.category;
  renderMenu();
});

menuSearch.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderMenu();
});

cartBtn.addEventListener("click", () => toggleCart(true));
closeCartBtn.addEventListener("click", () => toggleCart(false));
cartOverlay.addEventListener("click", () => toggleCart(false));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggleCart(false);
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Add at least one dish before placing an order.");
    return;
  }
  const totalText = cartTotalEl.textContent;
  cart = [];
  updateCartUI();
  toggleCart(false);
  showToast(`Order confirmed (${totalText})! Preparing fresh in our kitchen.`);
});

// Mobile Nav Toggle
mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("active");
  }
});

// Navbar Scroll Effect
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

// Reservation Form Handler
const dateInput = document.getElementById("resDate");
if (dateInput) {
  dateInput.min = new Date().toISOString().split("T")[0];
  dateInput.value = dateInput.min;
}

reservationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("resName").value.trim();
  const guests = document.getElementById("resGuests").value;
  const time = document.getElementById("resTime").value;

  showToast(`Table for ${guests} reserved at ${time} for ${name}!`);
  reservationForm.reset();
  if (dateInput) dateInput.value = dateInput.min;
});

// Scroll Reveal Observer
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Initialize Page
renderMenu();
updateCartUI();