import { createServer } from 'http';
import { describe, test, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import app from '../source/server.js';
import pkg from '../../package.json' assert { type: 'json' };

describe('Server Integration Tests', () => {
  let server;

  beforeAll(() => new Promise((resolve) => {
    server = createServer(app);
    server.listen(resolve);
  }));

  afterAll(() => new Promise((resolve) => {
    server.close(resolve);
  }));

  test('GET /health', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /features', async () => {
    const res = await request(server).get('/features');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(['digest', 'version', 'help']);
  });

  test('POST /invoke version', async () => {
    const res = await request(server).post('/invoke').send({ command: 'version' });
    expect(res.status).toBe(200);
    expect(res.body.version).toBe(pkg.version);
    expect(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(res.body.timestamp)).toBe(true);
  });

  test('POST /invoke help returns usage', async () => {
    const res = await request(server).post('/invoke').send({ command: 'help' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('Usage:');
  });

  test('GET /mission returns mission file content', async () => {
    const res = await request(server).get('/mission');
    expect(res.status).toBe(200);
    expect(typeof res.body.mission).toBe('string');
    expect(res.body.mission.length).toBeGreaterThan(0);
  });

  test('POST /invoke digest returns result with batchItemFailures array', async () => {
    const res = await request(server).post('/invoke').send({ command: 'digest' });
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveProperty('batchItemFailures');
    expect(Array.isArray(res.body.result.batchItemFailures)).toBe(true);
  });
});
