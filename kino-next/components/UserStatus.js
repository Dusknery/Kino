import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function UserStatus() {
  const [username, setUsername] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
  }, []);

  function handleLogout() {
    localStorage.removeItem('username');
    setUsername('');
    setShowMenu(false);
    router.push('/log-in');
  }

  if (!username) {
    return (
      <a href="/log-in" className="btn btn-outline-light rounded-pill">
        <i className="bi bi-person me-2"></i> Logga in
      </a>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="btn btn-outline-light rounded-pill"
        onClick={() => setShowMenu(v => !v)}
      >
        <i className="bi bi-person me-2"></i> {username}
      </button>
      {showMenu && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '110%',
            minWidth: 150,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          <button
            className="dropdown-item"
            style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', padding: '10px 16px' }}
            onClick={handleLogout}
          >
            Logga ut
          </button>
        </div>
      )}
    </div>
  );
}