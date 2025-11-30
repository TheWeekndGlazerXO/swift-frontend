import { supabase } from "/config.js";

// AUTH CHECK
const { data } = await supabase.auth.getUser();
const user = data.user;

if (!user) {
  window.location.href = "/login.html";
}

async function loadProducts() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  const container = document.getElementById("product-list");

  if (error) {
    container.innerHTML = "<p>Error loading products</p>";
    return;
  }

  if (!products.length) {
    container.innerHTML = "<p>You have no products yet.</p>";
    return;
  }

  container.innerHTML = products
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.image_url}" class="product-thumb"/>
        <div>
          <h3>${p.name}</h3>
          <p>K${p.price}</p>
          <p>Status: <strong>${p.status}</strong></p>

          <button onclick="editProduct('${p.id}')">Edit</button>
          <button onclick="deleteProduct('${p.id}')" style="background:red;color:white;">Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

window.editProduct = (id) => {
  window.location.href = `/seller/edit-product.html?id=${id}`;
};

window.deleteProduct = async (id) => {
  const ok = confirm("Delete this product?");
  if (!ok) return;

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (!error) {
    alert("Deleted.");
    loadProducts();
  }
};

loadProducts();
