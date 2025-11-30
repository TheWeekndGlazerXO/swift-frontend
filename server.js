import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// ---- SUPABASE ----
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ---- COMMISSION FUNCTION ----
function getCommissionRate(price) {
  if (price < 100) return 0.05;
  if (price < 300) return 0.07;
  if (price < 600) return 0.08;
  if (price < 1200) return 0.09;
  return 0.10;
}

// ---- CREATE ORDER ----
app.post("/create-order", async (req, res) => {
  try {
    const { buyer_id, product_id, quantity, address, email } = req.body;

    // Fetch product
    const { data: product, error: prodErr } = await supabase
      .from("products")
      .select("price, seller_id, name")
      .eq("id", product_id)
      .single();

    if (prodErr || !product)
      return res.status(400).json({ error: "Product not found" });

    const base_price = Number(product.price);
    const commission_rate = getCommissionRate(base_price);
    const swift_tax = base_price * commission_rate;
    const final_price = base_price + swift_tax;

    // Save order temporarily before payment
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        buyer_id,
        seller_id: product.seller_id,
        product_id,
        quantity,
        base_price,
        swift_tax,
        final_price,
        commission_rate,
        address,
        status: "pending_payment"
      })
      .select()
      .single();

    if (orderErr)
      return res.status(400).json({ error: "Error creating order" });

    // ---- PAYSTACK INITIALIZATION ----
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        amount: Math.round(final_price * 100), // kobo
        metadata: { order_id: order.id }
      })
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status)
      return res.status(400).json({ error: "Paystack initialization failed" });

    res.json({
      authorization_url: paystackData.data.authorization_url,
      order_id: order.id
    });

  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ---- PAYSTACK WEBHOOK ----
app.post("/paystack-webhook", async (req, res) => {
  const event = req.body;

  if (event.event === "charge.success") {
    const order_id = event.data.metadata.order_id;

    await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", order_id);

    return res.sendStatus(200);
  }

  res.sendStatus(400);
});

// ---- START SERVER ----
app.listen(3000, () => console.log("Server running on port 3000"));
