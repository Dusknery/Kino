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

const server = app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});

module.exports = server;