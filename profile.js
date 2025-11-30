import { supabase } from "./config.js";

async function loadProfile() {
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    document.getElementById("email").innerText = "Not logged in";
    return;
  }

  document.getElementById("email").innerText = user.email;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  document.getElementById("role").innerText = 
    "Account type: " + (profile?.role ?? "buyer");
}

document.addEventListener("DOMContentLoaded", loadProfile);

document.getElementById("logout-btn").onclick = async () => {
  await supabase.auth.signOut();
  window.location.href = "login.html";
};
