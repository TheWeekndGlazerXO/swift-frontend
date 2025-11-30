import { supabase } from "../config.js";

window.createProduct = async function () {
  const user = (await supabase.auth.getUser()).data.user;

  // get seller tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = profile.subscription_tier;

  const limits = {
    starter: 5,
    pro: 10,
    business: 30,
    enterprise: 999999
  };

  // count seller products
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", user.id);

  if (count >= limits[tier]) {
    alert(`Your tier '${tier}' only allows ${limits[tier]} products.`);
    return;
  }

  // Allow adding
  await supabase.from("products").insert({
    name: document.getElementById("name").value,
    price: Number(document.getElementById("price").value),
    description: document.getElementById("description").value,
    seller_id: user.id,
    category_id: document.getElementById("category").value,
    brand_id: document.getElementById("brand").value
  });

  alert("Product added!");
  window.location.href = "seller-dashboard.html";
};
