import { supabase } from "./config.js";

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "products.html";
  }
};
