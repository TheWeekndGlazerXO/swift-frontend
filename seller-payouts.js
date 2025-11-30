import { supabase } from "../config.js";

const user = (await supabase.auth.getUser()).data.user;

async function loadBalance() {
  const { data: balance } = await supabase.rpc("get_seller_balance", {
    seller_id: user.id
  });

  document.getElementById("balance-card").innerHTML = `
    <div class="card">
      <h3>K${balance || 0}</h3>
      <p>Total available balance</p>
    </div>
  `;
}

window.requestPayout = async function () {
  await fetch("https://swift-payments-backend.onrender.com/request-payout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seller_id: user.id })
  });

  alert("Payout requested!");
  loadBalance();
};

document.getElementById("withdraw-btn").onclick = requestPayout;

loadBalance();
