import { supabase } from "../config.js";
import { requireAdmin } from "./auth.js";

await requireAdmin();

const url = new URL(window.location.href);
const seller_id = url.searchParams.get("id");

async function loadSeller() {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", seller_id)
    .single();

  document.getElementById("seller-info").innerHTML = `
    <p><b>Name:</b> ${data.full_name}</p>
    <p><b>Email:</b> ${data.email}</p>
    <p><b>Subscription Tier:</b> ${data.subscription_tier}</p>
    <p><b>Joined:</b> ${new Date(data.created_at).toLocaleDateString()}</p>
  `;
}

async function loadProducts() {
  const { data } = await supabase
    .from("products")
    .select("name, price, brands(name)")
    .eq("seller_id", seller_id);

  document.getElementById("product-table").innerHTML = data
    .map(p => `
      <tr>
        <td>${p.name}</td>
        <td>K${p.price}</td>
        <td>${p.brands?.name || "None"}</td>
      </tr>
    `)
    .join("");
}

loadSeller();
loadProducts();
