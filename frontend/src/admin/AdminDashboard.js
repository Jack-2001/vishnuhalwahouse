import React, { useEffect, useState } from 'react';

function ProductForm({ initial = {}, onCancel, onSave }) {
  const [name, setName] = useState(initial.name || '');
  const [description, setDescription] = useState(initial.description || '');
  const [price, setPrice] = useState(initial.price || 0);
  const [stock, setStock] = useState(initial.stock || 0);
  const [imageData, setImageData] = useState((initial.images && initial.images[0]) || null);

  function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) { setImageData(null); return; }
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result);
    reader.readAsDataURL(f);
  }

  function submit(e) {
    e.preventDefault();
    onSave({
      ...initial,
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images: imageData ? [imageData] : initial.images || []
    });
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12 }}>Name</label>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12 }}>Description</label>
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: 12 }}>Price (₹)</label>
          <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: 12 }}>Stock</label>
          <input placeholder="Stock" type="number" value={stock} onChange={e => setStock(e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <label style={{ display: 'block', fontSize: 12 }}>Product image</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {imageData && (
          <div style={{ marginTop: 8 }}>
            <img src={imageData} alt="preview" style={{ maxWidth: 160, borderRadius: 6, border: '1px solid #eee' }} />
          </div>
        )}
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
    // Check for existing product with same name (case-insensitive)
    const existing = products.find(x => (x.name || '').trim().toLowerCase() === (p.name || '').trim().toLowerCase());
    if (existing) {
      const overwrite = window.confirm('A product with this name already exists. Press OK to overwrite it, or Cancel to create a new product.');
      if (overwrite) {
        // merge and update existing
        const merged = { ...existing, ...p };
        const resu = await fetch('/api/products/' + existing._id, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify(merged)
        });
        if (!resu.ok) { alert('Error overwriting product'); return; }
        setCreating(false);
        fetchProducts();
        return;
      }
      // else fallthrough to create a new product (allow duplicate name)
    }

    // backend expects JSON with an `images` array (we send data URLs here)
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
                  {p.images && p.images[0] && (
                    <div style={{ marginBottom: 8 }}>
                      <img src={p.images[0]} alt={p.name} style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 6 }} />
                    </div>
                  )}
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
