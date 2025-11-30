import { supabase } from "./config.js";
await supabase.from("shop_views").insert({
    seller_id
  });
  
/* Load seller profile */
async function loadSellerProfile() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    alert("Please log in");
    window.location.href = "login.html";
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (data) {
    document.getElementById("store_name").value = data.store_name ?? "";
    document.getElementById("store_description").value = data.store_description ?? "";
    document.getElementById("store_logo").value = data.store_logo ?? "";
  }
}

loadSellerProfile();

/* Save seller profile */
window.saveSellerProfile = async function () {
  const user = (await supabase.auth.getUser()).data.user;

  const updates = {
    id: user.id,
    store_name: document.getElementById("store_name").value,
    store_description: document.getElementById("store_description").value,
    store_logo: document.getElementById("store_logo").value,
  };

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);

  if (!error) {
    alert("Profile updated!");
  } else {
    alert(error.message);
  }
};
