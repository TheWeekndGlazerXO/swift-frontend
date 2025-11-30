import { supabase } from "../config.js";
import { isAdmin } from "../auth.js";

// AUTH CHECK — only you (your email) can access this page
const user = (await supabase.auth.getUser()).data.user;
if (!isAdmin(user)) {
  alert("Unauthorized");
  window.location.href = "../index.html";
}

async function loadPending() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      description,
      image_url,
      seller_id,
      created_at,
      profiles ( full_name, email )
    `)
    .eq("status", "pending_review");

  if (error) {
    console.error(error);
    return;
  }

  document.getElementById("pending-count").innerHTML =
    `Pending Products: ${data.length}`;

  const container = document.getElementById("pending-products");

  if (data.length === 0) {
    container.innerHTML = "<p>No products awaiting review.</p>";
    return;
  }

  container.innerHTML = data
    .map(p => `
      <div class="product-card">
        <img src="${p.image_url}" class="product-image" />

        <h2>${p.name}</h2>
        <p><strong>Seller:</strong> ${p.profiles?.full_name || "Unknown"}</p>
        <p><strong>Email:</strong> ${p.profiles?.email || "Unknown"}</p>
        <p><strong>Price:</strong> K${p.price}</p>
        <p>${p.description || ""}</p>

        <div class="button-row">
          <button class="approve-btn" onclick="approve('${p.id}', '${p.seller_id}', '${p.name}')">
            Approve
          </button>

          <button class="reject-btn" onclick="rejectProduct('${p.id}', '${p.seller_id}', '${p.name}')">
            Reject
          </button>
        </div>
      </div>
    `)
    .join("");
}

window.approve = async (product_id, seller_id, name) => {
  // 1. Update product
  await supabase
    .from("products")
    .update({ status: "approved", rejection_reason: null })
    .eq("id", product_id);

  // 2. Notify seller
  await supabase.from("notifications").insert({
    user_id: seller_id,
    title: "Product Approved",
    message: `${name} is now live on Swift!`
  });

  alert("Product approved.");
  loadPending();
};

window.rejectProduct = async (product_id, seller_id, name) => {
  const reason = prompt("Enter rejection reason:");
  if (!reason) return;

  // 1. Update product
  await supabase
    .from("products")
    .update({ 
      status: "rejected",
      rejection_reason: reason 
    })
    .eq("id", product_id);

  // 2. Send notification
  await supabase.from("notifications").insert({
    user_id: seller_id,
    title: "Product Rejected",
    message: `Reason: ${reason}`
  });

  alert("Product rejected.");
  loadPending();
};

loadPending();
