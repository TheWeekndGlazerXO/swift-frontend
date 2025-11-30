import { supabase } from "./config.js";
import { isAdmin } from "./auth.js";

async function loadAdmin() {
  const user = (await supabase.auth.getUser()).data.user;

  if (!isAdmin(user)) return (window.location = "index.html");

  const { data } = await supabase
    .from("admin_metrics")
    .select("*")
    .single();

  document.getElementById("admin-grid").innerHTML = `
    <div class="admin-card">
      <h3>Total Orders</h3>
      <p>${data.total_orders}</p>
    </div>
    <div class="admin-card">
      <h3>Total Revenue</h3>
      <p>K${data.total_revenue}</p>
    </div>
    <div class="admin-card">
      <h3>Swift Earnings</h3>
      <p>K${data.swift_revenue}</p>
    </div>
  `;
}

loadAdmin();
