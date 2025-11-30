import { supabase } from "./config.js";

async function loadBuyerOrders() {
  const user = (await supabase.auth.getUser()).data.user;

  const { data } = await supabase
    .from("orders")
    .select("*, products(*)")
    .eq("user_id", user.id);

  document.getElementById("orders").innerHTML = data
    .map(
      o => `
      <div>
        <p>${o.products.name}</p>
        <p>Status: ${o.status}</p>
      </div>`
    )
    .join("");
}

loadBuyerOrders();
