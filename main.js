import { supabase } from "./config.js";

/* LOGIN */
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "index.html";
  }
};

/* SIGNUP */
window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Account created! Check your email.");
  }
};

import { addToCart } from "./cart.js";

/* LOAD PRODUCTS */
async function loadProducts() {
  const list = document.getElementById("products");
  if (!list) return;

  const { data: products } = await supabase.from("products").select("*");

  list.innerHTML = products
    .map(
      (p) => `
    <div>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <strong>$${p.price}</strong>
      <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
    </div>
  `
    )
    .join("");
}

loadProducts();



/* LOAD ORDERS */
async function loadOrders() {
    const container = document.getElementById("orders");
    if (!container) return;
  
    const {
      data: orders,
      error,
    } = await supabase.from("orders").select("*, products(*)");
  
    if (error) {
      container.innerHTML = "Error loading orders";
      return;
    }
  
    container.innerHTML = orders
      .map(
        (o) => `
          <div>
            <p>Order: ${o.id}</p>
            <p>Product: ${o.products.name}</p>
            <p>Status: ${o.status}</p>
          </div>
        `
      )
      .join("");
  }
  
  loadOrders();
  

  import { cart, clearCart } from "./cart.js";

  /* LOAD CART */
  async function loadCart() {
    const list = document.getElementById("cart-items");
    if (!list) return;
  
    list.innerHTML = cart
      .map(
        (c) => `
        <div>
          <h3>${c.name}</h3>
          <strong>$${c.price}</strong>
        </div>
      `
      )
      .join("");
  }
  
  /* CHECKOUT */
  window.checkout = async function () {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Log in first.");
  
    for (const item of cart) {
      await supabase.from("orders").insert({
        user_id: user.id,
        product_id: item.id,
        status: "pending",
      });
    }
  
    clearCart();
    alert("Order placed!");
    window.location.href = "orders.html";
  };
  
  loadCart();
  