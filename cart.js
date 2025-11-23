import { supabase } from "./config.js";

export let cart = [];

export function addToCart(product) {
  cart.push(product);
  alert("Added to cart!");
}

export function clearCart() {
  cart = [];
}

window.checkout = async function () {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return alert("Log in first!");

  for (const item of cart) {
    await supabase.from("orders").insert({
      user_id: user.id,
      product_id: item.id,
      status: "pending",
    });
  }

  clearCart();
  alert("Order placed!");
};
