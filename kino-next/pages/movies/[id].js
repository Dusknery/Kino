import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MovieScreenings from '../../components/MovieScreenings';
import MovieReviews from '../../components/MovieReviews';

export default function MoviePage() {
  const router = useRouter();
  const { id } = router.query;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchMovie() {
      setLoading(true);
      try {
        const res = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${id}`);
        const data = await res.json();
        setMovie(data.data);
      } catch {
        setMovie(null);
      }
      setLoading(false);
    }
    fetchMovie();
  }, [id]);

  if (!id || loading) return <p>Laddar...</p>;
  if (!movie) return <p>Kunde inte ladda filmen.</p>;

  return (
    <div className="container py-4">
      <h1>{movie.attributes.title}</h1>
      <p>{movie.attributes.description}</p>
      <img
        src={movie.attributes.image?.url}
        alt={movie.attributes.title}
        style={{ maxWidth: 300, marginBottom: 20 }}
      />

      <h2 className="mt-4">Visningar</h2>
      <MovieScreenings movieId={id} />

      <h2 className="mt-4">Recensioner</h2>
      <MovieReviews movieId={id} />
    </div>
  );
}