import { supabase, SUPABASE_URL } from "./config.js";

async function loadProducts() {
  const container = document.getElementById("products");

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
        <div>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <strong>K${p.price}</strong>
        </div>
      `
    )
    .join("");
}

loadProducts();
