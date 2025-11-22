import { supabase } from "./config.js";

/* LOGIN */
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return alert(error.message);

  alert("Logged in!");
  window.location.href = "index.html";
};

/* SIGNUP */
window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return alert(error.message);

  alert("Account created — check your email!");
};



