import { useEffect, useState } from 'react';

export default function MovieReviews({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [reload, setReload] = useState(false);

  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : '';

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?movieId=${movieId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch {
        setReviews([]);
      }
    }
    if (movieId) fetchReviews();
  }, [movieId, reload]);

  function containsCode(str) {
    return /[<>\/\\{}[\];:"'=|`~]/.test(str);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    if (!comment.trim() || rating < 1 || rating > 5) {
      setMessage('Du måste ge betyg (1-5) och skriva en kommentar.');
      return;
    }
    if (containsCode(comment)) {
      setMessage('Otillåtna tecken i kommentar.');
      return;
    }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, author: username, rating, comment })
      });
      if (res.ok) {
        setMessage('Tack för din recension!');
        setComment('');
        setRating(0);
        setReload(r => !r);
      } else {
        setMessage('Kunde inte spara recension.');
      }
    } catch {
      setMessage('Kunde inte spara recension.');
    }
  }

  return (
    <div>
      <ul className="list-group mb-3">
        {reviews.length === 0 && <li className="list-group-item text-muted">Inga recensioner än.</li>}
        {reviews.map((r, i) => (
          <li key={i} className="list-group-item">
            <strong>{r.author}</strong> – {Array(r.rating).fill('⭐').join('')}
            <br />
            {r.comment}
          </li>
        ))}
      </ul>

      {username ? (
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="mb-2">
            <label className="form-label">Betyg</label>
            <div>
              {[1,2,3,4,5].map(num => (
                <span
                  key={num}
                  style={{ cursor: 'pointer', color: rating >= num ? '#ffc107' : '#ccc', fontSize: 24 }}
                  onClick={() => setRating(num)}
                >★</span>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <label className="form-label">Kommentar</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={2}
              required
            />
          </div>
          <button type="submit" className="btn btn-danger">Skicka</button>
          {message && <div className="mt-2">{message}</div>}
        </form>
      ) : (
        <div className="alert alert-warning">Du måste vara inloggad för att lämna en recension.</div>
      )}
    </div>
  );
}