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

  // 1. Create Supabase user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  // 2. Extract user ID
  const user = data.user;

  // 3. Create the profile row linked to the user
  await supabase.from("profiles").upsert({
    id: user.id,       // must match profiles.id
    full_name: "",
    role: "buyer",
  });

  alert("Account created! Check your email.");
};

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
  
  window.checkout = async function () {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Log in first.");
  
    // Calculate total amount
    let total_price = cart.reduce((sum, item) => sum + item.price, 0);
  
    // 1️⃣ CREATE PAYMENT SESSION THROUGH YOUR BACKEND
    const res = await fetch("https://swift-payments-backend.onrender.com/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        amount: total_price,
      }),
    });
  
    const data = await res.json();
  
    if (!data || !data.data || !data.data.authorization_url) {
      console.error(data);
      alert("Failed to start payment. Check console.");
      return;
    }
  
    // 2️⃣ REDIRECT USER TO PAYSTACK CHECKOUT
    window.location.href = data.data.authorization_url;
  };
  // 1. Create an order BEFORE redirecting to payment
const { data: orderData, error: orderErr } = await supabase
.from("orders")
.insert({
  user_id: user.id,
  amount: total_price,
  status: "pending"
})
.select()
.single();

if (orderErr) {
alert("Could not create order");
return;
}

const order_id = orderData.id;
// 2. Call your Render backend to create payment
const res = await fetch("https://swift-payments-backend.onrender.com/create-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    order_id: order_id,
    amount: total_price,
    email: user.email
  })
});

const data = await res.json();
// 3. If payment link is returned → redirect
if (data.data.authorization_url) {
  window.location.href = data.data.authorization_url;
} else {
  alert("Payment error.");
}

  
  