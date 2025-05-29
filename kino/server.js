const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fetch = require('node-fetch');

const app = express();
const PORT = 5080;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Start page (lista på filmer)
app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/movies');
    const data = await response.json();
    const movies = data.data;
    res.render('home', { layout: 'main', movies });
  } catch (error) {
    res.status(500).send('Fel vid hämtning av filmer');
  }
});

// Enskild film
app.get('/movies/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${movieId}`);
    const data = await response.json();
    const movie = data.data;
    if (!movie || !movie.attributes) {
      return res.status(404).send('Film ej hittad');
    }
    res.render('movie', {
      layout: 'main',
      title: movie.attributes.title,
      image: movie.attributes.image.url,
      description: movie.attributes.intro,
      genre: movie.attributes.genre || 'Okänd',
      releaseDate: movie.attributes.releaseDate || 'Okänd',
      director: movie.attributes.director || 'Okänd'
    });
  } catch (error) {
    res.status(500).send('Fel vid hämtning av filmdata');
  }
});

// Kommande visningar
app.get('/api/screenings/upcoming', async (req, res) => {
  try {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie');
    const data = await response.json();
    const screenings = data.data;

    const now = new Date();
    const fiveDaysAhead = new Date(now);
    fiveDaysAhead.setDate(now.getDate() + 5);

    const filtered = screenings
      .filter(s => {
        const screeningDate = new Date(s.attributes.time);
        return screeningDate >= now && screeningDate <= fiveDaysAhead;
      })
      .sort((a, b) => new Date(a.attributes.time) - new Date(b.attributes.time))
      .slice(0, 10);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta visningar' });
  }
});

// Populära filmer
app.get('/api/popular-movies', async (req, res) => {
  try {
    // Hämta alla reviews med filmdata
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/reviews?populate=movie');
    const data = await response.json();
    const reviews = data.data;

    // Filtrera reviews till senaste 30 dagar OCH med filmdata
    const now = new Date();
    const daysAgo30 = new Date(now);
    daysAgo30.setDate(now.getDate() - 30);

    const recentReviews = reviews.filter(r => {
      const created = new Date(r.attributes.createdAt);
      return r.attributes.movie && r.attributes.movie.data && created >= daysAgo30 && created <= now;
    });

    // Gruppera reviews per film
    const movieRatings = {};
    recentReviews.forEach(r => {
      const movie = r.attributes.movie.data;
      if (!movie) return;
      const movieId = movie.id;
      const title = movie.attributes.title;
      if (!movieRatings[movieId]) {
        movieRatings[movieId] = { title, ratings: [] };
      }
      movieRatings[movieId].ratings.push(r.attributes.rating);
    });

    // Räkna ut snittbetyg och sortera
    const popularMovies = Object.entries(movieRatings)
      .map(([id, { title, ratings }]) => ({
        id,
        title,
        avgRating: ratings.reduce((a, b) => a + b, 0) / ratings.length
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5);

    res.json(popularMovies);
  } catch (err) {
    console.error('Fel i /api/popular-movies:', err);
    res.status(500).json({ error: 'Kunde inte hämta populära filmer' });
  }
});

// Hämta recensioner
app.get('/api/reviews', async (req, res) => {
  const { movieId, page = 1 } = req.query;
  if (!movieId) return res.status(400).json({ error: 'movieId krävs' });

  try {
    const url = `https://plankton-app-xhkom.ondigitalocean.app/api/reviews?filters[movie]=${movieId}&pagination[page]=${page}&pagination[pageSize]=5`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta recensioner' });
  }
});

// Skicka in recension 
app.post('/api/reviews', async (req, res) => {
  const { movieId, author, rating, comment } = req.body;
  if (!movieId || !author || !rating || !comment) {
    return res.status(400).json({ error: 'Alla fält krävs' });
  }

  try {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          movie: movieId,
          author,
          rating,
          comment
        }
      })
    });
    const data = await response.json();
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte spara recension' });
  }
});

app.get('/api/screenings', async (req, res) => {
  const { movieId } = req.query;
  if (!movieId) return res.status(400).json({ error: 'movieId krävs' });



const server = app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
module.exports = server;
})