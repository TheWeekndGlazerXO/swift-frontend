supabase.rpc("increment_shop_view", { seller_id });

import { supabase } from "../config.js";

// 1. Read seller_id from URL
const url = new URL(window.location.href);
const seller_id = url.searchParams.get("id");

// 2. Increment shop view (IMPORTANT)
await supabase.rpc("increment_shop_view", { seller_id });

// 3. Load seller profile
async function loadSeller() {
  const { data: seller } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", seller_id)
    .single();

  document.getElementById("seller-info").innerHTML = `
    <h1>${seller.full_name}</h1>
    <p>${seller.email}</p>
    <p>Shop Views: ${seller.shop_views}</p>
  `;
}

// 4. Load this seller’s products
async function loadProducts() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", seller_id);

  document.getElementById("products").innerHTML = data
    .map(
      p => `
      <div class="product-card">
        <h3>${p.name}</h3>
        <p>K${p.price}</p>
        <a href="../product.html?id=${p.id}">View</a>
      </div>
    `
    )
    .join("");
}

loadSeller();
loadProducts();
