import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Admin from './admin/Admin';
import Cart from './components/Cart';

export default function App() {
  const [route, setRoute] = useState(window.location.hash.replace('#', '') || '/');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div>
      <Header />
      <main style={{ padding: 20 }}>
        {route === '/admin' ? (
          <Admin />
        ) : route === '/cart' ? (
          <Cart />
        ) : (
          <>
            <h2>Products</h2>
            <ProductList />
          </>
        )}
      </main>
    </div>
  );
}
