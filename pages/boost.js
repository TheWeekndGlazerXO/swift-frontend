import { supabase } from "../config.js";

async function loadProducts() {
  const user = (await supabase.auth.getUser()).data.user;

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id);

  document.getElementById("productSelect").innerHTML =
    products
      .map(
        p =>
          `<option value="${p.id}">
              ${p.name} — K${p.price}
           </option>`
      )
      .join("");
}

loadProducts();

// Update price display when selecting boost
document.getElementById("boostType").addEventListener("change", () => {
  const selected = document.getElementById("boostType");
  const price = selected.options[selected.selectedIndex].dataset.price;
  document.getElementById("boostPrice").textContent = "K" + price;
});

// Buy Boost
window.buyBoost = async function () {
  const user = (await supabase.auth.getUser()).data.user;

  const product_id = document.getElementById("productSelect").value;
  const boost_option = document.getElementById("boostType");
  const boost_type = boost_option.value;
  const price = Number(boost_option.options[boost_option.selectedIndex].dataset.price);

  const res = await fetch("https://swift-payments-backend.onrender.com/boost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id,
      seller_id: user.id,
      boost_type,
      price,
      email: user.email
    })
  });

  const data = await res.json();

  if (data.data?.authorization_url) {
    window.location.href = data.data.authorization_url;
  } else {
    alert("Error starting payment.");
  }
};
