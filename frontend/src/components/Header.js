import React, { useEffect, useState } from 'react';

export default function Header() {
  const [count, setCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vhh_cart') || '[]').reduce((s, i) => s + i.quantity, 0); } catch { return 0; }
  });

  useEffect(() => {
    const onUpdate = () => setCount(JSON.parse(localStorage.getItem('vhh_cart') || '[]').reduce((s, i) => s + i.quantity, 0));
    window.addEventListener('cart-updated', onUpdate);
    return () => window.removeEventListener('cart-updated', onUpdate);
  }, []);

  return (
    <header style={{ background: '#2b1f12', padding: 12, color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 1000, margin: '0 auto', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.svg" alt="Vishnu Halwa House" style={{ height: 64 }} />
          <div>
            <h1 style={{ margin: 0, fontFamily: 'Georgia, serif' }}>Vishnu Halwa House</h1>
            <div style={{ fontSize: 14, color: '#f6e6b4' }}>Sweets & Namkeen — 65 years</div>
          </div>
        </div>
        <div>
          <a href="#/cart" style={{ color: '#fff', textDecoration: 'none' }}>Cart ({count})</a>
          <a href="#/admin" style={{ color: '#fff', marginLeft: 12 }}>Admin</a>
        </div>
      </div>
    </header>
  );
}
