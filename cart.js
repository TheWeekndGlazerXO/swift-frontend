import { supabase } from "./config.js";

window.loadCart = async function () {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return alert("Please log in first");

  const { data: cart } = await supabase
    .from("cart")
    .select("*, products(*)")
    .eq("user_id", user.id);

  const list = document.getElementById("cart-items");

  if (!cart || cart.length === 0) {
    list.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("total-price").innerText = "Total: ZMW 0";
    return;
  }

  let total = 0;

  list.innerHTML = cart
    .map(item => {
      total += item.products.price;

      return `
        <div style="
          background:white; 
          padding:15px; 
          border-radius:12px; 
          margin-bottom:15px;
          display:flex; 
          gap:15px;
        ">
          <img src="${item.products.image_url}" style="
            width:100px;
            height:100px;
            object-fit:cover;
            border-radius:10px;
          "/>

          <div style="flex:1;">
            <h3>${item.products.name}</h3>
            <p style="opacity:0.7;">ZMW ${item.products.price}</p>
          </div>
        </div>
      `;
    })
    .join("");

  document.getElementById("total-price").innerText =
    "Total: ZMW " + total;
};

window.checkout = function () {
  window.location.href = "checkout.html";
};

document.addEventListener("DOMContentLoaded", loadCart);
document.getElementById("checkout-btn").onclick = checkout;
