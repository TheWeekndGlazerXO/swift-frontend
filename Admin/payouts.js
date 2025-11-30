import { supabase } from "../config.js";
import { isAdmin } from "../auth.js";

// SECURE PAGE — ONLY YOU CAN SEE IT
const user = (await supabase.auth.getUser()).data.user;
if (!isAdmin(user)) {
  window.location.href = "/index.html";
}

// LOAD PAYOUT REQUESTS
async function loadPayouts() {
  const { data, error } = await supabase
    .from("payouts")
    .select("id, amount, status, seller_id, sellers:profiles(email)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  document.getElementById("payout-list").innerHTML = data
    .map(
      p => `
      <div class="payout-item">
        <p><strong>Seller:</strong> ${p.sellers?.email || p.seller_id}</p>
        <p><strong>Amount:</strong> K${p.amount}</p>
        <p><strong>Status:</strong> ${p.status}</p>
        ${
          p.status === "pending"
            ? `<button onclick="approvePayout('${p.id}')">Approve</button>`
            : `<span class="approved-label">✔ Approved</span>`
        }
      </div>
      `
    )
    .join("");
}

loadPayouts();

// APPROVE PAYOUT
window.approvePayout = async function (payout_id) {
  const response = await fetch(
    "https://swift-payments-backend.onrender.com/admin/approve-payout",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ payout_id })
    }
  );

  const result = await response.json();

  if (result.success) {
    alert("Payout approved!");
    loadPayouts(); // refresh list
  } else {
    alert("Error approving payout");
  }
};
