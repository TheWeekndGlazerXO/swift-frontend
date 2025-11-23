export let cart = JSON.parse(localStorage.getItem("swift_cart") || "[]");

export function saveCart() {
  localStorage.setItem("swift_cart", JSON.stringify(cart));
}

export function addToCart(product) {
  // store only minimal data
  const p = { id: product.id, name: product.name, price: product.price, image_url: product.image_url };
  cart.push(p);
  saveCart();
  alert(`${product.name} added to cart`);
}

export function clearCart() {
  cart = [];
  saveCart();
}
