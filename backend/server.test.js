const request = require('supertest');
const { app } = require('./server');

describe('UNO backend API', () => {
  test('GET /api/health returns status ok', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('POST /api/rooms creates a room', async () => {
    const response = await request(app).post('/api/rooms').send({ playerName: 'Test' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('roomId');
    expect(typeof response.body.roomId).toBe('string');
    expect(response.body.roomId).toHaveLength(4);
  });
});
