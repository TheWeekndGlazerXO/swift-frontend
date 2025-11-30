import { supabase } from "../config.js";

async function loadAnalytics() {
  const user = (await supabase.auth.getUser()).data.user;

  const { data } = await supabase
    .from("seller_sales")
    .select("*")
    .eq("seller_id", user.id);

  const container = document.getElementById("sales");
  if (!data[0]) {
    container.innerHTML = "No sales yet.";
    return;
  }

  container.innerHTML = `
      <p>Total Sales: K${data[0].total_sales}</p>
      <p>Total Orders: ${data[0].total_orders}</p>
  `;
}

loadAnalytics();
