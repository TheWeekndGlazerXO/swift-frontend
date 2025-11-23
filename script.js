import { supabase } from "./config.js";
// product display for homepage
export async function loadProductsHome() {
    const container = document.getElementById("products");
    if (!container) return;
    const { data: products, error } = await supabase.from("products").select("*").order('created_at', { ascending: false }).limit(50);
    if (error) {
      container.innerHTML = "<p style='color:red'>Error loading products</p>";
      console.error("loadProducts error:", error);
      return;
    }
    if (!products || products.length === 0) {
      container.innerHTML = "<p>No products yet.</p>";
      return;
    }
    container.innerHTML = products.map(p => `
      <div style="border:1px solid #ddd; padding:12px; width:220px;">
        <img src="${p.image_url || 'https://source.unsplash.com/300x300/?product'}" alt="${p.name}" style="width:100%;height:140px;object-fit:cover"/>
        <h3 style="margin:8px 0 4px;">${p.name}</h3>
        <p style="font-size:13px;height:36px;overflow:hidden">${p.description || ''}</p>
        <strong>Price: K${p.price}</strong>
        <div style="margin-top:8px;">
          <button onclick='addToCart(${JSON.stringify(p)})'>Add to cart</button>
        </div>
      </div>
    `).join("");
  }
  
/* LOGIN */
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return alert(error.message);

  alert("Logged in!");
  window.location.href = "index.html";
};

/* SIGNUP */
window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return alert(error.message);

  alert("Account created — check your email!");
};



