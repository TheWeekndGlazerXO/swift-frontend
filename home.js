import { supabase } from "./config.js";

async function loadFeatured() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  const container = document.getElementById("featured");

  container.innerHTML = data
    .map(
      (p) => `
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

loadFeatured();
