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
          {p.images && p.images[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />}
          <h3 style={{ marginTop: 0 }}>{p.name}</h3>
          <div>{p.description}</div>
          <div style={{ fontWeight: 'bold', marginTop: 8 }}>₹{p.price}</div>
          <div style={{ color: '#666', fontSize: 12 }}>Stock: {p.stock}</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => {
              const cart = JSON.parse(localStorage.getItem('vhh_cart') || '[]');
              const existing = cart.find(it => it.product === p._id);
              if (existing) existing.quantity += 1; else cart.push({ product: p._id, name: p.name, price: p.price, image: p.images && p.images[0] || null, quantity: 1 });
              localStorage.setItem('vhh_cart', JSON.stringify(cart));
              window.dispatchEvent(new Event('cart-updated'));
              alert('Added to cart');
            }}>Add to cart</button>
            <a href="#/cart" style={{ marginLeft: 8 }}>View cart</a>
          </div>
        </div>
      ))}
    </div>
  );
}
