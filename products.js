import { supabase } from "./config.js";

async function loadProduct() {
  const params = new URLSearchParams(window.location.search); 
  const id = params.get("id");

  const { data: product } = await supabase
    .from("products")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();

  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-description").textContent = product.description;
  document.getElementById("product-price").textContent = "K" + product.price;
  document.getElementById("product-brand").textContent = product.brand_id;
  document.getElementById("product-category").textContent = product.category_id;

  document.getElementById("buy-btn").onclick = () => payNow(product);
}

async function payNow(product) {
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    alert("Please sign in first.");
    return;
  }

  // SEND TO BACKEND
  const response = await fetch("https://YOUR-RENDER-URL/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      seller_id: product.seller_id,
      amount: product.price,
      product_price: product.price // REQUIRED for tax calculation
    })
  });

  const data = await response.json();

  // Redirect to Paystack checkout
  window.location.href = data.data.authorization_url;
}

loadProduct();
