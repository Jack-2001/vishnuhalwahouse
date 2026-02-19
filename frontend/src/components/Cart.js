import React, { useEffect, useState } from 'react';

function readCart() {
  try { return JSON.parse(localStorage.getItem('vhh_cart') || '[]'); } catch { return []; }
}

function writeCart(c) { localStorage.setItem('vhh_cart', JSON.stringify(c)); window.dispatchEvent(new Event('cart-updated')); }

export default function Cart() {
  const [items, setItems] = useState(readCart());
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const onUpdate = () => setItems(readCart());
    window.addEventListener('cart-updated', onUpdate);
    return () => window.removeEventListener('cart-updated', onUpdate);
  }, []);

  function changeQty(id, delta) {
    const c = readCart().map(it => it.product === id ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it);
    writeCart(c); setItems(c);
  }

  function removeItem(id) {
    const c = readCart().filter(it => it.product !== id);
    writeCart(c); setItems(c);
  }

  function clearCart() { writeCart([]); setItems([]); }

  async function checkout() {
    if (!items.length) { alert('Cart is empty'); return; }
    if (!customer.name) { alert('Enter your name'); return; }
    setLoading(true); setMessage(null);
    try {
      const payload = { items: items.map(i => ({ product: i.product, quantity: i.quantity })), customer };
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      setMessage('Order placed — id: ' + data._id);
      clearCart();
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally { setLoading(false); }
  }

  const total = items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h3>Your cart</h3>
      {items.length === 0 ? <div>Cart is empty.</div> : (
        <div>
          {items.map(it => (
            <div key={it.product} style={{ display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid #eee', padding: 8 }}>
              {it.image && <img src={it.image} alt="thumb" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{it.name}</div>
                <div style={{ color: '#666' }}>₹{it.price} each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => changeQty(it.product, -1)}>-</button>
                <div>{it.quantity}</div>
                <button onClick={() => changeQty(it.product, 1)}>+</button>
              </div>
              <div style={{ width: 120, textAlign: 'right' }}>₹{(it.price||0)*it.quantity}</div>
              <div>
                <button onClick={() => removeItem(it.product)}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <div>
              <div>Total: <strong>₹{total}</strong></div>
              <div style={{ marginTop: 8 }}>
                <input placeholder="Name" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
                <input placeholder="Phone" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} style={{ marginLeft: 8 }} />
              </div>
              <div style={{ marginTop: 8 }}>
                <input placeholder="Address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button onClick={checkout} disabled={loading}>{loading ? 'Placing...' : 'Place order'}</button>
              <div style={{ marginTop: 8 }}>
                <button onClick={clearCart}>Clear cart</button>
              </div>
            </div>
          </div>
          {message && <div style={{ marginTop: 12 }}>{message}</div>}
        </div>
      )}
    </div>
  );
}
