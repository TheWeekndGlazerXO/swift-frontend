import { supabase } from "./config.js";

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

const id = getQueryParam("id");

async function loadProduct() {
  const { data } = await supabase
    .from("products")
    .select("*, brands(*), categories(*)")
    .eq("id", id)
    .single();

  document.getElementById("p-image").src = data.image_url;
  document.getElementById("p-name").innerText = data.name;
  document.getElementById("p-brand").innerText = data.brands?.name || "";
  document.getElementById("p-category").innerText = data.categories?.name || "";
  document.getElementById("p-description").innerText = data.description;
  document.getElementById("p-price").innerText = "K" + data.price;

  document.getElementById("buy-btn").onclick = () => buyNow(data);
}

async function buyNow(product) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return alert("Log in to buy");

  // create order row
  const { error } = await supabase.from("orders").insert({
    user_id: user.id,
    product_id: product.id,
    amount: product.price
  });

  if (error) return alert("Error creating order");

  // redirect to checkout page
  window.location.href = "checkout.html?id=" + product.id;
}

loadProduct();
