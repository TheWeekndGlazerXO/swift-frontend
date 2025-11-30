import { supabase } from "../config.js";
import { isAdmin } from "../auth.js";

// 🔒 Only admin allowed
const user = (await supabase.auth.getUser()).data.user;
if (!isAdmin(user)) window.location.href = "../index.html";

const filterSelect = document.getElementById("filter");
filterSelect.addEventListener("change", loadOrders);

async function loadOrders() {
  const statusFilter = filterSelect.value;

  let query = supabase
    .from("orders")
    .select("*, products(*), profiles(*)");

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: orders, error } = await query;

  if (error) {
    document.getElementById("orders").innerHTML = "Error loading orders";
    return;
  }

  let html = "";

  for (const o of orders) {
    html += `
      <div class="card">
        <h3>Order #${o.id}</h3>

        <p><strong>Product:</strong> ${o.products.name}</p>
        <p><strong>Seller:</strong> ${o.products.seller_id}</p>
        <p><strong>Buyer:</strong> ${o.profiles.full_name}</p>
        <p><strong>Amount:</strong> K${o.amount}</p>
        <p><strong>Status:</strong> ${o.status}</p>

        <button onclick="markDelivered('${o.id}')">Mark Delivered</button>
      </div>
    `;
  }

  document.getElementById("orders").innerHTML = html;
}

loadOrders();

// 🔵 Change order status
window.markDelivered = async function (order_id) {
  await supabase.from("orders").update({ status: "delivered" }).eq("id", order_id);
  alert("Order marked as delivered!");
  loadOrders();
};
