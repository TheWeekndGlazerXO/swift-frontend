import { supabase } from "./config.js";

async function loadProducts() {
  const container = document.getElementById('products');
  if (!container) return;

  const { data, error } = await supabase
    .from('products')
    .select(`id,name,description,price,image_url,promotions(discount,start_at,end_at)`)
    .order('created_at', { ascending: false });

  if (error) return container.innerHTML = '<p>Error loading</p>';
  container.innerHTML = data.map(p => {
    const promo = p.promotions?.[0];
    const now = new Date();
    const livePromo = promo && (!promo.start_at || new Date(promo.start_at) <= now) && (!promo.end_at || new Date(promo.end_at) >= now);
    const displayPrice = livePromo ? (p.price - (p.price * (promo.discount/100))).toFixed(2) : p.price;
    return `
      <div class="product-card">
        <img src="${p.image_url || 'https://source.unsplash.com/300x300/?product'}" />
        <h3>${p.name}</h3>
        ${ livePromo ? `<p class="promo">-${promo.discount}%</p>` : '' }
        <p>K${displayPrice}</p>
      </div>
    `;
  }).join('');
}

loadProducts();
