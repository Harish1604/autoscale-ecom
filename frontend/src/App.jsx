import { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState(null);

  // fetch backend status
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch(() => setStatus({ error: "backend not reachable" }));
  }, []);

  // fetch products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>AutoScale E-Commerce</h1>

      <h3>Status:</h3>
      <pre>{JSON.stringify(status, null, 2)}</pre>

      <h3>Products:</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — ₹{p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
