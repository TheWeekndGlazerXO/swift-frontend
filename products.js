import { supabase } from "./config.js";

/* LOAD PRODUCTS FROM DATABASE */
async function loadProducts() {
  const container = document.getElementById("product-list");

  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    container.innerHTML = "Error loading products.";
    return;
  }

  container.innerHTML = products
    .map(
      (p) => `
      <div style="border:1px solid #ccc; padding:15px; margin:15px; width:300px;">
        <h3>${p.name}</h3>
        <img src="${p.image_url}" width="150" />
        <p>${p.description}</p>
        <strong>Price: $${p.price}</strong>
      </div>
    `
    )
    .join("");
}

loadProducts();
