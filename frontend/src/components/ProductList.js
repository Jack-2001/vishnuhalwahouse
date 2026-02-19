import React, { useEffect, useState } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  function readCart() { try { return JSON.parse(localStorage.getItem('vhh_cart') || '[]'); } catch { return []; } }
  function writeCart(c) { localStorage.setItem('vhh_cart', JSON.stringify(c)); window.dispatchEvent(new Event('cart-updated')); }
  const [cart, setCart] = useState(readCart());

  async function fetchProducts() {
    try {
      const r = await fetch('/api/products');
      const data = await r.json();
      setProducts(data);
    } catch (err) {
      setProducts([]);
    }
  }

  useEffect(() => {
    const onUpdate = () => setCart(readCart());
    const onProducts = () => { fetchProducts(); };
    window.addEventListener('cart-updated', onUpdate);
    window.addEventListener('products-updated', onProducts);
    // initial load
    fetchProducts();
    return () => {
      window.removeEventListener('cart-updated', onUpdate);
      window.removeEventListener('products-updated', onProducts);
    };
  }, []);

  if (!products || products.length === 0) return <div>No products yet.</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
      {products.map(p => {
        const existing = cart.find(it => it.product === p._id);
        return (
          <div key={p._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
            {p.images && p.images[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6, marginBottom: 8, transition: 'transform 140ms ease' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'} />}
            <h3 style={{ marginTop: 0 }}>{p.name}</h3>
            <div>{p.description}</div>
            <div style={{ fontWeight: 'bold', marginTop: 8 }}>₹{p.price}</div>
            <div style={{ color: '#666', fontSize: 12 }}>Stock: {p.stock}</div>
            <div style={{ marginTop: 8 }}>
              {existing ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <button style={{ transition: 'transform 120ms' }} onClick={() => { const c = readCart(); const item = c.find(it => it.product === p._id); if (item) { item.quantity = Math.max(1, item.quantity - 1); writeCart(c); setCart(c); } }}>-</button>
                  <div style={{ minWidth: 24, textAlign: 'center' }}>{existing.quantity}</div>
                  <button style={{ transition: 'transform 120ms' }} disabled={existing.quantity >= p.stock} onClick={() => { if (existing.quantity >= p.stock) return; const c = readCart(); const item = c.find(it => it.product === p._id); if (item) { item.quantity += 1; writeCart(c); setCart(c); } }}>{'+'}</button>
                </div>
              ) : (
                <button style={{ transition: 'transform 120ms' }} onClick={() => {
                  const c = readCart();
                  const ex = c.find(it => it.product === p._id);
                  if (ex) ex.quantity += 1; else c.push({ product: p._id, name: p.name, price: p.price, image: p.images && p.images[0] || null, quantity: 1 });
                  writeCart(c);
                  setCart(c);
                  alert('Added to cart');
                }}>Add to cart</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
