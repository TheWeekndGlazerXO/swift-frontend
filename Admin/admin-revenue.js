import { supabase } from "../config.js";
import { requireAdmin } from "./auth.js";

await requireAdmin();

const { data } = await supabase
  .from("transactions")
  .select("amount, created_at")
  .eq("type", "swift_fee")
  .order("created_at");

new Chart(document.getElementById("revGraph"), {
  type: "bar",
  data: {
    labels: data.map(d => new Date(d.created_at).toLocaleDateString()),
    datasets: [{
      label: "Daily Swift Revenue",
      data: data.map(d => d.amount)
    }]
  }
});
