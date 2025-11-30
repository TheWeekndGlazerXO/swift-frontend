import { supabase } from "../config.js";
import { requireAdmin } from "./auth.js";

await requireAdmin();

// Load all sellers
async function loadSellers() {
  const { data: sellers } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name");

  let html = "";

  for (let s of sellers) {
    const stats = await loadSellerStats(s.id);

    html += `
      <tr>
        <td>${s.full_name || "No name"}</td>
        <td>${s.email}</td>
        <td>K${stats.total_sales}</td>
        <td>K${stats.total_payouts}</td>
        <td>K${stats.balance}</td>
        <td>
          <a href="seller-details.html?id=${s.id}">
            View
          </a>
        </td>
      </tr>
    `;
  }

  document.getElementById("sellers-table").innerHTML = html;
}

// Fetch seller stats from backend
async function loadSellerStats(sellerId) {
  const res = await fetch(`/admin/seller-stats/${sellerId}`);
  return await res.json();
}

loadSellers();
