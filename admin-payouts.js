import { supabase } from "./config.js";

async function loadPayouts() {
  const { data } = await supabase.from("payouts").select("*");

  document.getElementById("payout-table").innerHTML = data.map(p => `
    <tr>
      <td>${p.seller_id}</td>
      <td>${p.amount}</td>
      <td>${p.status}</td>
      <td><button onclick="approvePayout(${p.id}, ${p.amount}, '${p.seller_id}')">Approve</button></td>
    </tr>
  `).join("");
}

window.approvePayout = async function (id, amount, seller_id) {
  await supabase.from("payouts")
    .update({ status: "approved" })
    .eq("id", id);

  await supabase.from("transactions").insert({
    seller_id,
    amount,
    type: "payout"
  });

  loadPayouts();
};

loadPayouts();
