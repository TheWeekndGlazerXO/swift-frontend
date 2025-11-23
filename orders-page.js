import { supabase } from "./config.js";

async function loadOrders() {
  const userResp = await supabase.auth.getUser();
  const user = userResp.data?.user;
  const container = document.getElementById("orders-list");
  if (!user) return container.innerHTML = "<p>Please login.</p>";
  const { data: orders, error } = await supabase.from("orders").select("id, status, quantity, product_id, created_at, products(name, image_url)").eq('user_id', user.id);
  if (error) {
    container.innerHTML = "<p>Error loading orders</p>";
    console.error(error);
    return;
  }
  container.innerHTML = orders.map(o => `
    <div style="border:1px solid #ddd;padding:12px;margin:10px;">
      <p>Order: ${o.id}</p>
      <p>Product: ${o.products?.name || 'N/A'}</p>
      <p>Status: ${o.status}</p>
      <p>Placed: ${new Date(o.created_at).toLocaleString()}</p>
    </div>
  `).join("");
}

loadOrders();
