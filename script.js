import { supabase } from "./config.js";



const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAuth() {
    const { data, error } = await client.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123"
    });

    console.log("DATA:", data);
    console.log("ERROR:", error);
}

testAuth();
