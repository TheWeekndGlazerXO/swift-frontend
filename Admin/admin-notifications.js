import { supabase } from "../config.js";
import { requireAdmin } from "./auth.js";

await requireAdmin();

const { data } = await supabase
  .from("notifications")
  .select("*")
  .order("created_at", { ascending: false });

document.getElementById("notif-list").innerHTML = data
  .map(n => `<li>${n.created_at} — ${n.message}</li>`)
  .join("");
