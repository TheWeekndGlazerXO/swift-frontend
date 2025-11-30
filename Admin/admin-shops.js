import { supabase } from "../config.js";
import { requireAdmin } from "./auth.js";

await requireAdmin();

const { data } = await supabase
  .from("profiles")
  .select("*")
  .order("shop_views", { ascending: false });

document.getElementById("shops-table").innerHTML = data
  .map(s => `
    <tr>
      <td>${s.full_name}</td>
      <td>${s.email}</td>
      <td>${s.shop_views}</td>
    </tr>
  `)
  .join("");
