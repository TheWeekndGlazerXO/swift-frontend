import { supabase } from "./config.js";

window.createSeller = async function () {
  const store_name = document.getElementById('store_name').value;
  const profile = await supabase.auth.getUser();
  const uid = profile.data.user.id;
  const { error } = await supabase.from('sellers').insert({ profile_id: uid, store_name });
  if (error) return alert(error.message);
  alert('Seller created — await verification');
  window.location.href = 'seller.html';
}
