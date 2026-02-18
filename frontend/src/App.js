import React from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';

export default function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: 20 }}>
        <h2>Products</h2>
        <ProductList />
      </main>
    </div>
  );
}
