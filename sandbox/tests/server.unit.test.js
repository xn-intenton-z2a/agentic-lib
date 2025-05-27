import { describe, test, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import fs from 'fs/promises';
import app from '../source/server.js';
import pkg from '../../package.json' assert { type: 'json' };

vi.mock('fs/promises', () => ({
  __esModule: true,
  default: { readFile: vi.fn() },
  readFile: vi.fn()
}));

describe('Server Unit Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('GET /health returns status ok and timestamp', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });

  test('GET /mission returns file content', async () => {
    fs.readFile.mockResolvedValue('Test Mission');
    const res = await request(app).get('/mission');
    expect(res.status).toBe(200);
    expect(res.body.mission).toBe('Test Mission');
  });

  test('GET /mission returns 404 on error', async () => {
    fs.readFile.mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/mission');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Mission file not found');
  });

  test('GET /features returns commands array', async () => {
    const res = await request(app).get('/features');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(['digest', 'version', 'help']);
  });

  test('POST /invoke unsupported command', async () => {
    const res = await request(app).post('/invoke').send({ command: 'foo' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Unsupported command');
  });

  test('POST /invoke digest returns result with batchItemFailures array', async () => {
    const res = await request(app).post('/invoke').send({ command: 'digest' });
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveProperty('batchItemFailures');
    expect(Array.isArray(res.body.result.batchItemFailures)).toBe(true);
  });

  test('POST /invoke version returns correct version and timestamp', async () => {
    const res = await request(app).post('/invoke').send({ command: 'version' });
    expect(res.status).toBe(200);
    expect(res.body.version).toBe(pkg.version);
    expect(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(res.body.timestamp)).toBe(true);
  });

  test('POST /invoke help returns usage text', async () => {
    const res = await request(app).post('/invoke').send({ command: 'help' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('Usage:');
  });
});