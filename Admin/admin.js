import { supabase } from "../config.js";

/* LOAD ALL ORDERS */
async function loadOrdersAdmin() {
  const list = document.getElementById("order-list");
  const { data: orders } = await supabase
    .from("orders")
    .select("*, products(name), profiles(email)");

  list.innerHTML = orders
    .map(
      (o) => `
      <div>
        <p>Order #${o.id}</p>
        <p>User: ${o.profiles.email}</p>
        <p>Product: ${o.products.name}</p>
        <p>Status: ${o.status}</p>
      </div>
    `
    )
    .join("");
}

loadOrdersAdmin();
