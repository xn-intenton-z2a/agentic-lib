import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { startHttpServer } from '../source/main.js';

describe('HTTP Server Integration (sandbox)', () => {
  let server;
  let port;

  afterEach((done) => {
    if (server && server.close) {
      server.close(() => done());
    } else {
      done();
    }
  });

  test('GET /health returns status ok and uptime', async () => {
    server = await startHttpServer({ port: 0 });
    port = server.address().port;
    const res = await request(`http://localhost:${port}`).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
  });

  test('GET /metrics returns callCount and uptime', async () => {
    server = await startHttpServer({ port: 0 });
    port = server.address().port;
    const res1 = await request(`http://localhost:${port}`).get('/metrics');
    expect(res1.status).toBe(200);
    expect(res1.body).toHaveProperty('callCount', 1);
    expect(res1.body).toHaveProperty('uptime');
    expect(typeof res1.body.uptime).toBe('number');
  });

  test('POST /digest returns empty failures for valid digest', async () => {
    server = await startHttpServer({ port: 0 });
    port = server.address().port;
    const digest = { key: 'x', value: 'y', lastModified: new Date().toISOString() };
    const res = await request(`http://localhost:${port}`)
      .post('/digest')
      .send(digest)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('batchItemFailures');
    expect(Array.isArray(res.body.batchItemFailures)).toBe(true);
    expect(res.body.batchItemFailures).toHaveLength(0);
  });
});
