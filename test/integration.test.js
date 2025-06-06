const request = require('supertest');
const app = require('../kino/server');
const fetch = require('node-fetch');

describe('Filmsidor', () => {
  let movies = [];

  beforeAll(async () => {
    // Hämta alla filmer från API:t
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/movies');
    const data = await response.json();
    movies = data.data;
  });

  it('ska visa rätt titel för varje film', async () => {
    for (const movie of movies) {
      const res = await request(app).get(`/movies/${movie.id}`);
      expect(res.status).toBe(200);
      expect(res.text).toMatch(new RegExp(movie.attributes.title, 'i'));
    }
  });

  });
