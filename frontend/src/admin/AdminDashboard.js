import React, { useEffect, useState } from 'react';

function ProductForm({ initial = {}, onCancel, onSave }) {
  const [name, setName] = useState(initial.name || '');
  const [description, setDescription] = useState(initial.description || '');
  const [price, setPrice] = useState(initial.price || 0);
  const [stock, setStock] = useState(initial.stock || 0);

  function submit(e) {
    e.preventDefault();
    onSave({ ...initial, name, description, price: Number(price), stock: Number(stock) });
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <div>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <input placeholder="Stock" type="number" value={stock} onChange={e => setStock(e.target.value)} />
      </div>
      <div style={{ marginTop: 6 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
      </div>
    </form>
  );
}

export default function AdminDashboard({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.value || data || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  async function createProduct(p) {
    const res = await fetch('/api/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(p)
    });
    if (!res.ok) { alert('Error creating product'); return; }
    setCreating(false);
    fetchProducts();
  }

  async function updateProduct(p) {
    const res = await fetch('/api/products/' + p._id, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(p)
    });
    if (!res.ok) { alert('Error updating product'); return; }
    setEditing(null);
    fetchProducts();
  }

  async function deleteProduct(id) {
    if (!confirm('Delete product?')) return;
    const res = await fetch('/api/products/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
    if (!res.ok) { alert('Error deleting'); return; }
    fetchProducts();
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setCreating(true)}>Create product</button>
      </div>
      {creating && <ProductForm onCancel={() => setCreating(false)} onSave={createProduct} />}
      {loading ? <div>Loading...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
          {products.map(p => (
            <div key={p._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
              {editing === p._id ? (
                <ProductForm initial={p} onCancel={() => setEditing(null)} onSave={updateProduct} />
              ) : (
                <>
                  <h4 style={{ marginTop: 0 }}>{p.name}</h4>
                  <div>{p.description}</div>
                  <div style={{ fontWeight: 'bold', marginTop: 8 }}>₹{p.price}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>Stock: {p.stock}</div>
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => setEditing(p._id)}>Edit</button>
                    <button onClick={() => deleteProduct(p._id)} style={{ marginLeft: 8 }}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
