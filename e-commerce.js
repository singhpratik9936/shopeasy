import { db } from "./firebase-config.js";
import { addToCart } from "./app.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Demo fallback products (shown if Firestore "products" collection is empty
// or firebase-config.js still has placeholder keys)
const DEMO_PRODUCTS = [
  { id: "demo-1", name: "Casual T-Shirt", price: 499, category: "Fashion", emoji: "👕" },
  { id: "demo-2", name: "Wireless Headphones", price: 999, category: "Electronics", emoji: "🎧" },
  { id: "demo-3", name: "Running Shoes", price: 1499, category: "Fashion", emoji: "👟" },
  { id: "demo-4", name: "Smart Watch", price: 2199, category: "Electronics", emoji: "⌚" },
  { id: "demo-5", name: "Backpack", price: 899, category: "Accessories", emoji: "🎒" },
  { id: "demo-6", name: "Sunglasses", price: 599, category: "Accessories", emoji: "🕶️" }
];

let allProducts = [];

async function fetchProducts() {
  try {
    const snap = await getDocs(collection(db, "products"));
    if (snap.empty) return DEMO_PRODUCTS;

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name || "Unnamed Product",
        price: data.price || 0,
        category: data.category || "General",
        emoji: data.emoji || "🛍️"
      };
    });
  } catch (error) {
    console.warn("Falling back to demo products:", error.message);
    return DEMO_PRODUCTS;
  }
}

function populateCategoryFilter(products) {
  const select = document.querySelector("#categoryFilter");
  if (!select) return;
  const categories = [...new Set(products.map((p) => p.category))];
  select.innerHTML =
    `<option value="all">All Categories</option>` +
    categories.map((c) => `<option value="${c}">${c}</option>`).join("");
}

function renderProducts(products) {
  const grid = document.querySelector("#productGrid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<div class="empty-state">No products match your search.</div>`;
    return;
  }

  grid.innerHTML = products
    .map(
      (p) => `
    <div class="product-card">
      <div class="product-image">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p class="product-price">₹${p.price}</p>
      <button data-id="${p.id}">Add to Cart</button>
    </div>
  `
    )
    .join("");

  grid.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = products.find((p) => p.id === btn.dataset.id);
      if (product) addToCart(product);
    });
  });
}

function applyFilters() {
  const searchTerm = (document.querySelector("#searchBox")?.value || "").toLowerCase();
  const category = document.querySelector("#categoryFilter")?.value || "all";

  const filtered = allProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

async function init() {
  const grid = document.querySelector("#productGrid");
  if (!grid) return; // not on a page with products

  grid.innerHTML = `<div class="empty-state">Loading products…</div>`;

  allProducts = await fetchProducts();
  populateCategoryFilter(allProducts);
  renderProducts(allProducts);

  document.querySelector("#searchBox")?.addEventListener("input", applyFilters);
  document.querySelector("#categoryFilter")?.addEventListener("change", applyFilters);
}

document.addEventListener("DOMContentLoaded", init);
