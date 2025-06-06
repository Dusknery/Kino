const request = require('supertest');
const app = require('../kino/server');
const mongoose = require('mongoose');
const User = require('../kino/models/user');

jest.setTimeout(20000);

const testUser = 'testuser_' + Date.now();

beforeAll(async () => {
  await User.deleteMany({ username: testUser });
  // Registrera användaren innan inloggningstesterna
  await request(app)
    .post('/api/register')
    .send({ username: testUser, password: 'testpass' });
});

afterAll(async () => {
  await User.deleteMany({ username: testUser });
  await mongoose.connection.close();
});

describe('Auth API', () => {
  test('Register new user', async () => {
    // Testet ovan registrerar redan användaren, men vi testar ändå en ny
    const res = await request(app)
      .post('/api/register')
      .send({ username: testUser + '_2', password: 'testpass' });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Användare skapad');
  });

  test('Login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: testUser, password: 'testpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Inloggning lyckades');
  });

  test('Login with wrong password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: testUser, password: 'felpass' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Fel användarnamn eller lösenord');
  });
});