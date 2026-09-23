// app.js — shared UI logic: theme, cart, toasts, navbar (used on every page)

/* ---------- Toasts ---------- */
export function toast(msg, type = "info") {
  let box = document.querySelector(".toast-container");
  if (!box) {
    box = document.createElement("div");
    box.className = "toast-container";
    document.body.appendChild(box);
  }
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ---------- Theme ---------- */
function initTheme() {
  const saved = localStorage.getItem("shopeasy-theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);

  const btn = document.querySelector("#themeToggle");
  if (btn) {
    btn.textContent = saved === "dark" ? "☀️" : "🌙";
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("shopeasy-theme", next);
      btn.textContent = next === "dark" ? "☀️" : "🌙";
    });
  }
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const hamburger = document.querySelector("#hamburger");
  const links = document.querySelector("#navLinks");
  if (hamburger && links) {
    hamburger.addEventListener("click", () => links.classList.toggle("open"));
  }

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 10);
    });
  }
}

/* ---------- Cart (localStorage-backed) ---------- */
const CART_KEY = "shopeasy-cart";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartBadge();
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  toast(`${product.name} added to cart`, "success");
}

function updateQty(id, delta) {
  let cart = getCart();
  cart = cart
    .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
    .filter((i) => i.qty > 0);
  saveCart(cart);
  renderCartDrawer();
}

function removeFromCart(id) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  renderCartDrawer();
  toast("Item removed", "info");
}

function renderCartBadge() {
  const badge = document.querySelector("#cartBadge");
  if (!badge) return;
  const count = getCart().reduce((sum, i) => sum + i.qty, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

function renderCartDrawer() {
  const list = document.querySelector("#cartItems");
  const totalEl = document.querySelector("#cartTotal");
  if (!list || !totalEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:30px 0;">Your cart is empty.</p>`;
    totalEl.textContent = "₹0";
    return;
  }

  list.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji || "🛒"}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>₹${item.price} × ${item.qty}</span>
      </div>
      <div class="qty-controls">
        <button data-action="dec" data-id="${item.id}">−</button>
        <span>${item.qty}</span>
        <button data-action="inc" data-id="${item.id}">+</button>
      </div>
      <button class="remove-btn" data-action="remove" data-id="${item.id}">✕</button>
    </div>
  `
    )
    .join("");

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  totalEl.textContent = `₹${total}`;

  list.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === "inc") updateQty(id, 1);
      if (action === "dec") updateQty(id, -1);
      if (action === "remove") removeFromCart(id);
    });
  });
}

function initCartDrawer() {
  const drawer = document.querySelector("#cartDrawer");
  const overlay = document.querySelector("#cartOverlay");
  const openBtn = document.querySelector("#cartToggle");
  const closeBtn = document.querySelector("#closeCart");

  const open = () => {
    renderCartDrawer();
    drawer?.classList.add("open");
    overlay?.classList.add("open");
  };
  const close = () => {
    drawer?.classList.remove("open");
    overlay?.classList.remove("open");
  };

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", close);

  const checkoutBtn = document.querySelector("#checkoutBtn");
  checkoutBtn?.addEventListener("click", () => {
    if (getCart().length === 0) {
      toast("Your cart is empty", "error");
      return;
    }
    toast("Checkout is a demo — no payment integrated yet.", "info");
  });

  renderCartBadge();
}

/* ---------- Init on every page ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initCartDrawer();
});
