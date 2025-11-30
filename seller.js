import { supabase } from "./config.js";

window.uploadProduct = async function () {
  const file = document.getElementById('pimg').files[0];
  const name = document.getElementById('pname').value;
  const price = parseFloat(document.getElementById('pprice').value);
  const desc = document.getElementById('pdesc').value;

  if (!file) return alert('pick an image');

  // upload
  const filePath = `products/${Date.now()}_${file.name}`;
  const { data: uploadData, error: upErr } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (upErr) return alert(upErr.message);
  const imageUrl = `${supabase.storageUrl}/object/public/product-images/${filePath}`;

  // get seller id
  const user = (await supabase.auth.getUser()).data.user;
  const { data: sellers } = await supabase.from('sellers').select('id').eq('profile_id', user.id).limit(1);
  const seller_id = sellers?.[0]?.id;
  if (!seller_id) return alert('You are not a seller yet');

  const { error } = await supabase.from('products').insert({
    seller_id, name, description: desc, price, image_url: imageUrl, stock: 10
  });

  if (error) return alert(error.message);
  alert('Product uploaded');
};
await supabase.from("profiles").upsert({
    id: user.id,
    full_name: "",
    role: "seller"
  });
  

  const role = document.getElementById("role").value;

  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: "",
    role: role
  });

  if (role === "seller") {
    await supabase.from("seller_profiles").insert({
      id: user.id,
      business_name: "",
      contact_number: "",
      verified: false
    });
  }
  