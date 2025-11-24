import { supabase } from "./config.js";
import { cart, clearCart } from "./cart.js";

window.checkout = async function () {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return alert('Login first');

  const total = cart.reduce((s,i)=> s + Number(i.price)*i.qty || 1, 0);

  const { data: order, error: ordErr } = await supabase.from('orders').insert({
    user_id: user.id,
    total,
    shipping_address: { /* collect from form */ }
  }).select().single();

  if (ordErr) return alert(ordErr.message);

  const items = cart.map(i => ({ order_id: order.id, product_id: i.id, quantity: i.qty || 1, price: i.price }));
  const { error: itErr } = await supabase.from('order_items').insert(items);
  if (itErr) return alert(itErr.message);

  // notify seller(s) - simple SMS via Edge Function or Africa's Talking
  clearCart();
  alert('Order placed');
  window.location.href = 'orders.html';
};
