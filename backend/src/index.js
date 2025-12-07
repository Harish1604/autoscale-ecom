const express = require("express");
const os = require("os");

const app = express();
app.use(express.json());

// Check server status
app.get("/status", (req, res) => {
  res.json({
    status: "ok",
    host: os.hostname(), 
    time: Date.now()
  });
});

// Dummy product
app.get("/products", (req, res) => {
  res.json([
    { id: 1, name: "T-Shirt", price: 299 },
    { id: 2, name: "Cap", price: 199 },
    { id: 3, name: "Shoes", price: 999 }
  ]);
});

// Buy API
let orders = [];
app.post("/buy", (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || !qty) {
    return res.status(400).json({ error: "Missing productId/qty" });
  }

  orders.push({
    id: orders.length + 1,
    productId,
    qty,
    ts: Date.now()
  });

  res.json({ ok: true, orderId: orders.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
