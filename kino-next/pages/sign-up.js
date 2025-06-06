import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setSuccess('Ditt konto har skapats! Du skickas nu till inloggningen...');
        setTimeout(() => router.push('/log-in'), 2000);
      } else {
        const data = await res.json();
        setError(data.error || 'Något gick fel vid registrering.');
      }
    } catch {
      setError('Något gick fel vid registrering.');
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 400 }}>
      <h2>Bli medlem</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
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
        <button type="submit" className="btn btn-danger w-100">Skapa konto</button>
      </form>
    </div>
  );
}