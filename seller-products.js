import { supabase } from "./config.js";

async function loadSellerProducts() {
  const user = (await supabase.auth.getUser()).data.user;
  const container = document.getElementById("seller-products");

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id);

  container.innerHTML = data
    .map(p => `
        <div>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <strong>K${p.price}</strong>
        </div>
      `)
    .join("");
}

loadSellerProducts();
import { supabase } from "../config.js";

const user = (await supabase.auth.getUser()).data.user;

async function loadProducts() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id);

  document.getElementById("product-list").innerHTML =
    data.map(p => `
      <div class="product-card">
        <img src="${p.image_url || '/img/default.png'}" />
        <div class="p-info">
          <h3>${p.name}</h3>
          <p>K${p.price}</p>
          <button onclick="editProduct('${p.id}')">Edit</button>
        </div>
      </div>
    `)
    .join("");
}

loadProducts();
