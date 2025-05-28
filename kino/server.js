const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fetch = require('node-fetch'); 

const app = express();
const PORT = 5080;

app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/api/screenings/upcoming', async (req, res) => {
  try {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie');
    const data = await response.json();
    const screenings = data.data;

    // Filtrera på kommande 5 dagar
    const now = new Date();
    const fiveDaysAhead = new Date(now);
    fiveDaysAhead.setDate(now.getDate() + 5);

    const filtered = screenings
      .filter(s => {
        const screeningDate = new Date(s.attributes.time);
        return screeningDate >= now && screeningDate <= fiveDaysAhead;
      })
      .sort((a, b) => new Date(a.attributes.time) - new Date(b.attributes.time))
      .slice(0, 10); // Max 10 visningar

    res.json(filtered); // Alltid en array, även om den är tom
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta visningar' });
  }
});

app.get('/api/popular-movies', async (req, res) => {
  try {
    // Hämta alla reviews
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/reviews?populate=movie');
    const data = await response.json();
    const reviews = data.data;

    // Filtrera reviews till senaste 30 dagar
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const recentReviews = reviews.filter(r => {
      const created = new Date(r.attributes.createdAt);
      return created >= thirtyDaysAgo && created <= now;
    });

    // Gruppera reviews per film
    const movieRatings = {};
    recentReviews.forEach(r => {
      const movieId = r.attributes.movie.data.id;
      const title = r.attributes.movie.data.attributes.title;
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
    res.status(500).json({ error: 'Kunde inte hämta populära filmer' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});

module.exports = server;

// Test för att säkerställa att vi får rätt antal kommande visningar
app.get('/test/screenings/upcoming', async (req, res) => {
  try {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie');
    const data = await response.json();
    const screenings = data.data;

    // Filtrera på kommande 5 dagar
    const now = new Date();
    const fiveDaysAhead = new Date(now);
    fiveDaysAhead.setDate(now.getDate() + 5);

    const filtered = screenings
      .filter(s => {
        const screeningDate = new Date(s.attributes.time);
        return screeningDate >= now && screeningDate <= fiveDaysAhead;
      })
      .sort((a, b) => new Date(a.attributes.time) - new Date(b.attributes.time))
      .slice(0, 10); // Max 10 visningar

    res.json(filtered); // Alltid en array, även om den är tom
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta visningar' });
  }
});

// För att köra tester
if (require.main === module) {
  const test = async () => {
    try {
      const response = await fetch('http://localhost:5080/test/screenings/upcoming');
      const data = await response.json();
      console.log('Antal kommande visningar:', data.length);
      console.log('Första visningens tid:', data[0] ? new Date(data[0].attributes.time) : 'Inga visningar hittades');
    } catch (error) {
      console.error('Fel vid testhämtning:', error);
    }
  };

  // Vänta lite på att servern ska starta
  setTimeout(test, 5000);
}