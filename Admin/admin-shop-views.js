import { supabase } from "../config.js";
import { isAdmin } from "../auth.js";

const u = (await supabase.auth.getUser()).data.user;
if (!isAdmin(u)) window.location.href = "../index.html";

async function loadShopViews() {
  const { data } = await supabase.from("shop_ranking").select("*");

  document.getElementById("shop-views").innerHTML = `
    <tr><th>Shop</th><th>Views</th></tr>
    ${data.map(v => `<tr><td>${v.full_name}</td><td>${v.views}</td></tr>`).join("")}
  `;
}

loadShopViews();
