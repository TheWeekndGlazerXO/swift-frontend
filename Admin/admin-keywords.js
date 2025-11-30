import { supabase } from "../config.js";
import { requireAdmin } from "./auth.js";

await requireAdmin();

const { data } = await supabase
  .from("keywords")
  .select("*")
  .order("search_count", { ascending: false });

document.getElementById("kw-table").innerHTML = data
  .map(k => `
    <tr>
      <td>${k.term}</td>
      <td>${k.search_count}</td>
    </tr>
  `)
  .join("");
