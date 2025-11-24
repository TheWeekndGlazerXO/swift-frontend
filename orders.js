import { supabase } from "./config.js";

async function loadOrders() {
  const container = document.getElementById("orders");

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    container.innerHTML = "You must be logged in.";
    return;
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, status, products(name, price)")
    .eq("user_id", user.id);

  if (error) {
    container.innerHTML = "Error loading orders.";
    return;
  }

  container.innerHTML = orders
    .map(
      (o) => `
      <div>
        <h3>Order #${o.id}</h3>
        <p>Product: ${o.products.name}</p>
        <p>Status: ${o.status}</p>
      </div>
    `
    )
    .join("");
}

loadOrders();
