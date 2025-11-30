import { supabase } from "../config.js";
import { isAdmin } from "../auth.js";

const u = (await supabase.auth.getUser()).data.user;
if (!isAdmin(u)) window.location.href = "../index.html";

async function loadKeywords() {
  const { data } = await supabase.from("keyword_rankings").select("*");

  document.getElementById("keywords").innerHTML = `
    <tr><th>Search Term</th><th>Count</th></tr>
    ${data.map(k => `<tr><td>${k.term}</td><td>${k.searches}</td></tr>`).join("")}
  `;
}

loadKeywords();
