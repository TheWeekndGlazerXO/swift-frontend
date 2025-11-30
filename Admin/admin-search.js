import { supabase } from "../config.js";
import { isAdmin } from "../auth.js";

// 🔒 Admin only
const user = (await supabase.auth.getUser()).data.user;
if (!isAdmin(user)) window.location.href = "../index.html";

async function loadKeywords() {
  const { data, error } = await supabase
    .from("search_keywords")
    .select("*")
    .order("count", { ascending: false });

  if (error) {
    document.getElementById("keywords").innerHTML = "Error loading keywords";
    return;
  }

  document.getElementById("keywords").innerHTML = data
    .map(
      (k) => `
      <tr>
        <td>${k.term}</td>
        <td>${k.count}</td>
      </tr>
    `
    )
    .join("");
}

loadKeywords();

// Reset button
document.getElementById("reset-btn").onclick = async () => {
  await supabase.from("search_keywords").delete().neq("term", "");
  alert("Search analytics reset!");
  loadKeywords();
};
