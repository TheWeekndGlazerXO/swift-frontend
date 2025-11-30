import { supabase } from "../config.js";
import { isAdmin } from "../auth.js";

const user = (await supabase.auth.getUser()).data.user;
if (!isAdmin(user)) window.location.href = "../index.html";

async function loadTopSellers() {
  const { data } = await supabase.from("top_sellers").select("*");

  document.getElementById("top-sellers").innerHTML = `
    <tr>
      <th>Seller</th>
      <th>Total Orders</th>
      <th>Total Sales (K)</th>
    </tr>
    ${data
      .map(
        s => `
      <tr>
        <td>${s.full_name}</td>
        <td>${s.total_orders}</td>
        <td>${s.total_sales}</td>
      </tr>`
      )
      .join("")}
  `;
}

loadTopSellers();
