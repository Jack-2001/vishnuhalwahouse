import React from 'react';

export default function Header() {
  return (
    <header style={{ background: '#2b1f12', padding: 12, color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 1000, margin: '0 auto' }}>
        <img src="/logo.svg" alt="Vishnu Halwa House" style={{ height: 64 }} />
        <div>
          <h1 style={{ margin: 0, fontFamily: 'Georgia, serif' }}>Vishnu Halwa House</h1>
          <div style={{ fontSize: 14, color: '#f6e6b4' }}>Sweets & Namkeen — 65 years</div>
        </div>
      </div>
    </header>
  );
}
