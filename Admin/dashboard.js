import { supabase } from "../config.js";
import { isAdmin } from "../auth.js";

const user = (await supabase.auth.getUser()).data.user;

if (!isAdmin(user)) {
    window.location.href = "/index.html";
}

document.getElementById("admin-email-display").innerText =
    `Logged in as: ${user.email} (Admin)`;

/* TAB SWITCHING */
const tabButtons = document.querySelectorAll(".tab-btn");
const content = document.getElementById("tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const tab = btn.dataset.tab;
        loadTab(tab);
    });
});

loadTab("overview"); // default

async function loadTab(tab) {
    if (tab === "overview") return loadOverview();
    if (tab === "sellers") return loadSellers();
    if (tab === "payouts") return loadPayouts();
    if (tab === "revenue") return loadRevenue();
}

/* ======================================================
   1) OVERVIEW TAB
======================================================= */
async function loadOverview() {
    content.innerHTML = `<h2>Platform Overview</h2>Loading...`;

    const { data: sellers } = await supabase.from("profiles").select("*");
    const { data: orders } = await supabase.from("orders").select("*");
    const { data: revenue } = await supabase.from("transactions").select("*");

    content.innerHTML = `
        <h2>Overview</h2>
        <p>Total Sellers: ${sellers.length}</p>
        <p>Total Orders: ${orders.length}</p>
        <p>Total Revenue (Swift fees): 
            K${revenue.filter(x => x.type === "swift_fee")
            .reduce((a, b) => a + b.amount, 0)}
        </p>
    `;
}

/* ======================================================
   2) SELLERS TAB
======================================================= */
async function loadSellers() {
    content.innerHTML = `<h2>Sellers</h2>Loading...`;

    const { data } = await supabase.from("profiles").select("*");

    content.innerHTML = `
        <h2>All Sellers</h2>
        <ul>
            ${data.map(s => `<li>${s.email} — Tier: ${s.subscription_tier}</li>`).join("")}
        </ul>
    `;
}

/* ======================================================
   3) PAYOUT REQUESTS TAB
======================================================= */
async function loadPayouts() {
    content.innerHTML = `<h2>Payout Requests</h2>Loading...`;

    const { data } = await supabase
        .from("payouts")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false });

    content.innerHTML = `
        <h2>Payout Requests</h2>
        <ul>
            ${data
                .map(
                    p => `
                <li>
                    ${p.profiles.email} — Amount: K${p.amount} — Status: ${p.status}
                </li>`
                )
                .join("")}
        </ul>
    `;
}

/* ======================================================
   4) REVENUE TAB
======================================================= */
async function loadRevenue() {
    content.innerHTML = `<h2>Revenue</h2>Loading...`;

    const { data } = await supabase.from("transactions").select("*");

    const swiftFees = data.filter(x => x.type === "swift_fee");

    content.innerHTML = `
        <h2>Total Swift Revenue</h2>
        <p>K${swiftFees.reduce((a, b) => a + b.amount, 0)}</p>

        <h3>Breakdown</h3>
        <ul>
            ${swiftFees.map(f => `<li>K${f.amount} — Seller: ${f.seller_id}</li>`).join("")}
        </ul>
    `;
}
