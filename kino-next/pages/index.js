import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        const res = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/movies');
        const data = await res.json();
        setMovies(data.data || []);
      } catch {
        setMovies([]);
      }
      setLoading(false);
    }
    fetchMovies();
  }, []);

  if (loading) return <p>Laddar filmer...</p>;
  if (!movies.length) return <p>Inga filmer hittades.</p>;

  return (
    <div className="container py-4">
      <h1>Kino – Filmer</h1>
      <div className="row">
        {movies.map(movie => (
          <div key={movie.id} className="col-6 col-md-3 mb-4">
            <Link href={`/movies/${movie.id}`}>
              <a>
                <img
                  src={movie.attributes.image?.url}
                  alt={movie.attributes.title}
                  className="img-fluid mb-2"
                  style={{ borderRadius: 8, height: 300, objectFit: 'cover', width: '100%' }}
                />
                <h5>{movie.attributes.title}</h5>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}