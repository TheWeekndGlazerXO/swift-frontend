import { supabase } from "./config.js";
import { cart, clearCart } from "./cart.js";

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  if (!cart || cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  container.innerHTML = cart.map((c, i) => `
    <div style="border:1px solid #ddd;padding:10px;margin:8px;">
      <h3>${c.name}</h3>
      <p>Price: K${c.price}</p>
    </div>
  `).join("");
}

window.checkout = async function () {
  const userResp = await supabase.auth.getUser();
  const user = userResp.data?.user;
  if (!user) return alert("Please login before placing an order.");
  // create order rows in bulk
  const rows = cart.map(item => ({ user_id: user.id, product_id: item.id, status: "pending", quantity: 1 }));
  const { data, error } = await supabase.from("orders").insert(rows);
  if (error) {
    console.error("Order insert error:", error);
    return alert("Failed to place order: " + error.message);
  }
  clearCart();
  alert("Order placed!");
  window.location.href = "orders.html";
};

document.getElementById("checkout-btn").addEventListener("click", window.checkout);

renderCart();
