import { supabase } from "./config.js";

async function loadCategories() {
  const { data } = await supabase.from("categories").select("*");
  document.getElementById("categories").innerHTML =
    data.map(c => `
      <div class="card">
        <h4>${c.name}</h4>
      </div>
    `).join("");
}

async function loadProducts() {
  const { data } = await supabase.from("products").select("*, brands(*), categories(*)");

  document.getElementById("products").innerHTML =
    data.map(p => `
      <div class="card" onclick="window.location='product.html?id=${p.id}'">
        <img src="${p.image_url || '/placeholder.jpg'}">
        <h4>${p.name}</h4>
        <p>${p.brands?.name || ''}</p>
        <strong>K${p.price}</strong>
      </div>
    `).join("");
}

loadCategories();
loadProducts();
