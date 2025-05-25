import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { main, createServer } from '../source/main.js';

describe('Main Output', () => {
  test('should terminate without error', () => {
    process.argv = ['node', 'sandbox/source/main.js'];
    // Call with empty array since CLI args are parsed from args parameter
    main([]);
  });
});

describe('HTTP Server', () => {
  let app;

  beforeEach(() => {
    // Reset global call count before each test
    globalThis.callCount = 0;
    app = createServer();
  });

  test('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET /metrics returns uptime and callCount', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.callCount).toBe('number');
  });

  test('POST /digest with valid payload returns 200', async () => {
    const payload = {
      key: 'events/1.json',
      value: '12345',
      lastModified: new Date().toISOString(),
    };
    const res = await request(app).post('/digest').send(payload);
    expect(res.status).toBe(200);
  });

  test('POST /digest with invalid payload returns 400', async () => {
    const res = await request(app).post('/digest').send({ invalid: 'data' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});
