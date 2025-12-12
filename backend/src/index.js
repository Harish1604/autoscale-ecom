const express = require("express");
const os = require("os");

const app = express();
app.use(express.json());

const client = require("prom-client");
client.collectDefaultMetrics();

// at top
const client = require('prom-client');
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 500, 1000]
});
client.collectDefaultMetrics();

// wrap around handlers
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});


app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});



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
 
