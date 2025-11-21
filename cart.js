export let cart = JSON.parse(localStorage.getItem("cart") || "[]");

export function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

export function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
}
