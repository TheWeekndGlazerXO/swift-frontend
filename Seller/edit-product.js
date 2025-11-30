import { supabase } from "/config.js";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Load existing data
async function loadProduct() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    alert("Product not found.");
    return;
  }

  document.getElementById("name").value = data.name;
  document.getElementById("price").value = data.price;
  document.getElementById("description").value = data.description;
}

document.getElementById("edit-form").onsubmit = async (e) => {
  e.preventDefault();

  const { error } = await supabase
    .from("products")
    .update({
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      status: "pending_review"
    })
    .eq("id", productId);

  if (!error) {
    alert("Updated!");
    window.location.href = "/seller/products.html";
  }
};

loadProduct();
