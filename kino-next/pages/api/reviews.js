let reviews = []; // OBS: Försvinner vid server-restart! Byt till databas för produktion.

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Hämta alla recensioner för en film
    const { movieId } = req.query;
    const movieReviews = reviews.filter(r => r.movieId === movieId);
    res.status(200).json({ reviews: movieReviews });
  } else if (req.method === 'POST') {
    // Spara en ny recension
    const { movieId, author, rating, comment } = req.body;
    if (!movieId || !author || !rating || !comment) {
      return res.status(400).json({ error: 'Alla fält krävs.' });
    }
    reviews.push({ movieId, author, rating, comment });
    res.status(201).json({ message: 'Recension sparad.' });
  } else {
    res.status(405).end();
  }
}