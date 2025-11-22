import { supabase } from "./config.js";

/* TEST AUTH */
async function testAuth() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "test@example.com",
    password: "password123"
  });

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

testAuth();

