import { useEffect, useState } from 'react';

export default function MovieScreenings({ movieId }) {
  const [screenings, setScreenings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchScreenings() {
      try {
        const res = await fetch(
          `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?filters[movie]=${movieId}&populate=movie`
        );
        const data = await res.json();
        const valid = (data.data || []).filter(s => {
          const t = s.attributes.time;
          return t && !isNaN(new Date(t));
        });
        setScreenings(valid);
      } catch {
        setError('Kunde inte ladda visningar.');
      }
    }
    fetchScreenings();
  }, [movieId]);

  if (error) return <p className="text-muted">{error}</p>;
  if (!screenings.length) return <p className="text-muted">Inga visningar för denna film.</p>;

  return (
    <ul className="list-group">
      {screenings.map(s => {
        const d = new Date(s.attributes.time);
        const formatted = d.toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
        return <li key={s.id} className="list-group-item">{formatted}</li>;
      })}
    </ul>
  );
}