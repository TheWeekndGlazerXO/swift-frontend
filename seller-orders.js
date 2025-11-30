import { supabase } from "../config.js";

const user = (await supabase.auth.getUser()).data.user;

async function loadSellerOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(*)")
    .eq("products.seller_id", user.id);

  if (error) {
    console.log(error);
    return;
  }

  document.getElementById("orders").innerHTML =
    data.map(order => `
      <div class="order-card">

        <img class="order-image" src="${order.products.image_url || "/img/default.png"}">

        <div class="order-info">
          <h3>${order.products.name}</h3>

          <p class="order-details">
            Price: K${order.products.price}<br>
            Order ID: ${order.id}<br>
            Buyer ID: ${order.user_id}
          </p>

          <span class="status-badge status-${order.status}">
            ${order.status.toUpperCase()}
          </span>

          <div class="order-actions">
            <button onclick="markReady('${order.id}')">Mark Ready</button>
            <button onclick="markDone('${order.id}')">Mark Completed</button>
          </div>
        </div>

      </div>
    `)
    .join("");
}

window.markReady = async function (id) {
  await supabase.from("orders").update({ status: "ready" }).eq("id", id);
  loadSellerOrders();
};

window.markDone = async function (id) {
  await supabase.from("orders").update({ status: "completed" }).eq("id", id);
  loadSellerOrders();
};

loadSellerOrders();
