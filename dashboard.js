import { supabase } from "./config.js";
import { isAdmin } from "./auth.js";

async function protectPage() {
  const user = (await supabase.auth.getUser()).data.user;

  // Not signed in?
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Not the admin?
  if (!isAdmin(user)) {
    window.location.href = "index.html";
    return;
  }
}

protectPage();

import { supabase } from "./config.js";

async function loadSellerProducts() {
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id);

  const container = document.getElementById("seller-products");

  container.innerHTML = data
    .map(
      p => `
        <div>
          <h3>${p.name}</h3>
          <p>K${p.price}</p>
          <button onclick="editProduct('${p.id}')">Edit</button>
        </div>
      `
    )
    .join("");
}

loadSellerProducts();

import { supabase } from "../config.js";

async function loadDashboard() {

  const userStats = await supabase.from("admin_user_stats").select("*").single();
  const salesStats = await supabase.from("admin_sales_stats").select("*").single();
  const best = await supabase.from("admin_best_sellers").select("*").single();
  const search = await supabase.from("search_keywords").select("*");
  const visits = await supabase.from("shop_visits").select("*");

  document.getElementById("user-stats").innerHTML = `
    <h2>Users</h2>
    <p>Total users: ${userStats.data.total_users}</p>
    <p>Buyers: ${userStats.data.total_buyers}</p>
    <p>Sellers: ${userStats.data.total_sellers}</p>
  `;

  document.getElementById("sales-stats").innerHTML = `
    <h2>Sales</h2>
    <p>Total Orders: ${salesStats.data.total_orders}</p>
    <p>Total Revenue: K${salesStats.data.total_revenue}</p>
    <p>Swift Revenue: K${salesStats.data.swift_revenue}</p>
  `;

  document.getElementById("best-sellers").innerHTML = `
    <h2>Top Sellers & Products</h2>
    <pre>${JSON.stringify(best.data, null, 2)}</pre>
  `;
}

loadDashboard();
async function recordSearch(term) {
    await supabase.rpc("increment_keyword", { term });
  }
  