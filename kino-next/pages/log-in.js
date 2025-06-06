import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        localStorage.setItem('username', username);
        router.push('/');
      } else {
        setError('Fel användarnamn eller lösenord.');
      }
    } catch {
      setError('Något gick fel vid inloggning.');
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 400 }}>
      <h2>Logga in</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <label className="form-label">Användarnamn</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Lösenord</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger w-100">Logga in</button>
      </form>
    </div>
  );
}