import { supabase } from "/config.js";
import { isAdmin } from "/auth.js";

const user = (await supabase.auth.getUser()).data.user;
if (!isAdmin(user)) location.href = "/index.html";

async function loadAppeals() {
  const { data } = await supabase
    .from("product_appeals")
    .select(`
      id,
      appeal_text,
      status,
      created_at,
      products ( name, id ),
      profiles ( full_name )
    `)
    .eq("status", "pending");

  const box = document.getElementById("appeals");

  box.innerHTML = data.map(a => `
    <div class="appeal-card">
      <h3>${a.products.name}</h3>
      <p>Seller: ${a.profiles.full_name}</p>
      <p>${a.appeal_text}</p>
      <button onclick="approveAppeal('${a.id}','${a.products.id}')">Approve Appeal</button>
      <button onclick="rejectAppeal('${a.id}')">Reject Appeal</button>
    </div>
  `).join("");
}

window.approveAppeal = async (appeal_id, product_id) => {
  await supabase.from("product_appeals").update({ status: "approved" }).eq("id", appeal_id);
  await supabase.from("products").update({ status: "approved" }).eq("id", product_id);

  alert("Appeal approved. Product restored.");
  loadAppeals();
};

window.rejectAppeal = async (appeal_id) => {
  await supabase.from("product_appeals").update({ status: "denied" }).eq("id", appeal_id);
  alert("Appeal rejected.");
  loadAppeals();
};

loadAppeals();
