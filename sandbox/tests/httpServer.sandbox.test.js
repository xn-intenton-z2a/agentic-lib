import request from 'supertest';
import { afterEach } from 'vitest';
import { startHttpServer } from '../../src/lib/main.js';

let server;
let port;

afterEach((done) => {
  if (server && server.close) {
    server.close(() => done());
  } else {
    done();
  }
});

test('GET /health responds with status ok and uptime', async () => {
  port = Math.floor(Math.random() * (65535 - 1024)) + 1024;
  server = startHttpServer({ port });
  const res = await request(`http://localhost:${port}`).get('/health');
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('status', 'ok');
  expect(typeof res.body.uptime).toBe('number');
  expect(res.body.uptime).toBeGreaterThan(0);
});

test('POST /digest responds with batchItemFailures empty array', async () => {
  port = Math.floor(Math.random() * (65535 - 1024)) + 1024;
  server = startHttpServer({ port });
  const body = { key: 'x', value: 'y', lastModified: new Date().toISOString() };
  const res = await request(`http://localhost:${port}`).post('/digest').send(body);
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('batchItemFailures');
  expect(Array.isArray(res.body.batchItemFailures)).toBe(true);
  expect(res.body.batchItemFailures.length).toBe(0);
});