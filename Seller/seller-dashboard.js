import { supabase } from "/config.js";

const user = (await supabase.auth.getUser()).data.user;

if (!user) window.location.href = "/login.html";

// LOAD ALL SELLER PRODUCTS
async function loadProducts() {
  // APPROVED
  const { data: approved } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id)
    .eq("status", "approved");

  document.getElementById("approved-products").innerHTML =
    approved.length ?
      approved.map(p => `
        <div class="product-card">
          <img src="${p.image_url}" class="product-thumb"/>
          <h3>${p.name}</h3>
          <p>K${p.price}</p>
          <button onclick="editProduct('${p.id}')">Edit</button>
        </div>
      `).join("") :
      "<p>No approved products yet.</p>";

  // REJECTED
  document.getElementById("rejected-products").innerHTML =
  rejected.length ?
    rejected.map(p => `
      <div class="product-card rejected">
        <img src="${p.image_url}" class="product-thumb"/>
        <h3>${p.name}</h3>
        <p><strong>Rejected:</strong> ${p.rejection_reason}</p>

        <button onclick="resubmit('${p.id}')">Fix & Resubmit</button>
        <button onclick="appeal('${p.id}')">Appeal Decision</button>
      </div>
    `).join("") :
    "<p>No rejected products.</p>";
    window.appeal = async (product_id) => {
      const text = prompt("Explain why the rejection was incorrect:");
      if (!text) return;
    
      await supabase.from("product_appeals").insert({
        product_id,
        seller_id: user.id,
        appeal_text: text
      });
    
      alert("Appeal submitted. Admin will review.");
    };
    

}

window.resubmit = async (id) => {
  // Simply sets product back to pending
  const { error } = await supabase
    .from("products")
    .update({ status: "pending_review" })
    .eq("id", id);

  if (error) return alert(error.message);

  alert("Product resubmitted for review.");
  loadProducts();
};

window.editProduct = (id) => {
  window.location.href = `/seller/edit-product.html?id=${id}`;
};

loadProducts();
