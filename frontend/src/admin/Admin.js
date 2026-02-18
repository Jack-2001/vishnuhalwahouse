import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 400 }}>
      <h3>Admin Login</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} className="input" />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit">Login</button>
      </div>
    </form>
  );
}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('vhh_token'));

  function handleLogin(t) {
    localStorage.setItem('vhh_token', t);
    setToken(t);
  }

  function logout() {
    localStorage.removeItem('vhh_token');
    setToken(null);
    window.location.hash = '/';
  }

  return (
    <div>
      {!token ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Admin Dashboard</h3>
            <div>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
          <AdminDashboard token={token} />
        </div>
      )}
    </div>
  );
}
