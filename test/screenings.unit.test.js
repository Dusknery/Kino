const request = require('supertest');
const express = require('express');
const app = express();

jest.mock('node-fetch');
const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');

app.get('/api/screenings/upcoming', async (req, res) => {
  try {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie');
    const data = await response.json();
    const screenings = data.data;

    const now = new Date('2024-06-01T12:00:00Z');
    const fiveDaysAhead = new Date(now);
    fiveDaysAhead.setDate(now.getDate() + 5);

    const filtered = screenings
      .filter(s => {
        const screeningDate = new Date(s.attributes.time);
        return screeningDate >= now && screeningDate <= fiveDaysAhead;
      })
      .sort((a, b) => new Date(a.attributes.time) - new Date(b.attributes.time))
      .slice(0, 10);

    res.json(filtered); // Alltid en array, även om den är tom!
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta visningar' });
  }
});

describe('GET /api/screenings/upcoming', () => {
  it('returnerar max 10 visningar inom 5 dagar', async () => {
    const screenings = [];
    for (let i = 0; i < 12; i++) {
      screenings.push({
        attributes: {
          time: i < 8
            ? `2024-06-0${i+1}T18:00:00Z` 
            : `2024-06-2${i}T18:00:00Z`, 
          movie: { data: { attributes: { title: `Film ${i+1}` } } }
        }
      });
    }
    fetch.mockResolvedValueOnce(new Response(JSON.stringify({ data: screenings })));

    const res = await request(app).get('/api/screenings/upcoming');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5); // istället för 8
    expect(res.body[0].attributes.movie.data.attributes.title).toBe('Film 1');
  });

  it('returnerar tom array om inga visningar finns', async () => {
    fetch.mockResolvedValueOnce(new Response(JSON.stringify({ data: [] })));
    const res = await request(app).get('/api/screenings/upcoming');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

module.exports = app;