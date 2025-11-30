import { supabase } from "./config.js";
async function recordSearch(term) {
    await supabase.rpc("increment_keyword", { term });
  }
  recordSearch(searchTerm);
  
async function loadFilters() {
  const brandSel = document.getElementById("brandFilter");
  const catSel = document.getElementById("categoryFilter");

  // Load brands
  let { data: brands } = await supabase.from("brands").select("*");
  brandSel.innerHTML = `<option value="">All Brands</option>` +
    brands.map(b => `<option value="${b.id}">${b.name}</option>`).join("");

  // Load categories
  let { data: categories } = await supabase.from("categories").select("*");
  catSel.innerHTML = `<option value="">All Categories</option>` +
    categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
}

async function searchProducts() {
  const term = document.getElementById("searchInput").value;
  const brand = document.getElementById("brandFilter").value;
  const category = document.getElementById("categoryFilter").value;

  let query = supabase.from("products").select("*");

  if (term) {
    query = query.ilike("name", `%${term}%`);

    // Record search term
    await supabase.rpc("increment_keyword", { term });
  }

  if (brand) query = query.eq("brand_id", brand);
  if (category) query = query.eq("category_id", category);

  const { data } = await query;
  renderProducts(data);
}

function renderProducts(products) {
  const container = document.getElementById("productList");
  container.innerHTML = products
    .map(
      p => `
      <div class="product-card">
        <img src="${p.image_url || 'placeholder.png'}" class="product-img">
        <h3>${p.name}</h3>
        <p>K${p.price}</p>
        <button onclick="window.location='product.html?id=${p.id}'">View</button>
      </div>
    `
    )
    .join("");
}

loadFilters();
document.getElementById("searchInput").addEventListener("keyup", searchProducts);
document.getElementById("brandFilter").addEventListener("change", searchProducts);
document.getElementById("categoryFilter").addEventListener("change", searchProducts);
