import { supabase } from "./config.js";

async function loadPlans() {
  const { data: sPlans } = await supabase.from('seller_plans').select('*');
  const { data: cPlans } = await supabase.from('customer_plans').select('*');
  const container = document.getElementById('plans');
  container.innerHTML = `
    <h2>Seller Plans</h2>
    ${sPlans.map(p => `<div>
      <h3>${p.plan_name} — K${p.price}</h3>
      <button onclick="buyPlan('seller','${p.plan_name}',${p.price})">Buy</button>
    </div>`).join('')}
    <h2>Customer Plans</h2>
    ${cPlans.map(p => `<div>
      <h3>${p.plan_name} — K${p.price}</h3>
      <button onclick="buyPlan('customer','${p.plan_name}',${p.price})">Buy</button>
    </div>`).join('')}
  `;
}
window.buyPlan = async function(plan_type, plan_name, price) {
  const user = (await supabase.auth.getUser()).data.user;
  const res = await fetch('https://swift-payments-backend.onrender.com/subscribe', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ user_id: user.id, plan_type, plan_name, price, email: user.email })
  });
  const data = await res.json();
  if (data.authorization_url) window.location.href = data.authorization_url;
};
loadPlans();
