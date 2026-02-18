import React, { useEffect, useState } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  if (!products || products.length === 0) return <div>No products yet.</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
      {products.map(p => (
        <div key={p._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
          <h3 style={{ marginTop: 0 }}>{p.name}</h3>
          <div>{p.description}</div>
          <div style={{ fontWeight: 'bold', marginTop: 8 }}>₹{p.price}</div>
          <div style={{ color: '#666', fontSize: 12 }}>Stock: {p.stock}</div>
        </div>
      ))}
    </div>
  );
}
