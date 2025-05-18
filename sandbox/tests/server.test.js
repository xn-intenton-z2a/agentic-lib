import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import { startServer } from '../source/server.js';

let server;
let base;

beforeAll(() => {
  server = startServer({ port: 0 });
  const addr = server.address();
  const port = typeof addr === 'object' && addr !== null ? addr.port : 3000;
  base = `http://127.0.0.1:${port}`;
});

afterAll(() => {
  server.close();
});

function request(path) {
  return new Promise((resolve, reject) => {
    http
      .get(base + path, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      })
      .on('error', reject);
  });
}

describe('Server', () => {
  test('/health returns status ok', async () => {
    const { statusCode, body } = await request('/health');
    expect(statusCode).toBe(200);
    const json = JSON.parse(body);
    expect(json.status).toBe('ok');
    expect(typeof json.uptime).toBe('number');
    expect(typeof json.timestamp).toBe('string');
  });

  test('/metrics returns metrics without auth when not configured', async () => {
    const { statusCode, body } = await request('/metrics');
    expect(statusCode).toBe(200);
    expect(body).toContain('http_requests_total');
  });

  test('/ready returns status ready', async () => {
    const { statusCode, body } = await request('/ready');
    expect(statusCode).toBe(200);
    const json = JSON.parse(body);
    expect(json.status).toBe('ready');
    expect(typeof json.timestamp).toBe('string');
    expect(new Date(json.timestamp).toString()).not.toBe('Invalid Date');
  });

  test('metrics includes http_request_duration_seconds after calls', async () => {
    await request('/health');
    await request('/ready');
    const { statusCode, body } = await request('/metrics');
    expect(statusCode).toBe(200);
    const lines = body.split('\n');
    const durationLines = lines.filter((line) =>
      line.startsWith('http_request_duration_seconds'),
    );
    expect(durationLines.length).toBeGreaterThanOrEqual(2);
    durationLines.forEach((line) => {
      expect(line).toMatch(
        /^http_request_duration_seconds\{method="GET",route="\/(health|ready)",status="200"\} \d+\.?\d*$/,
      );
    });
  });
});
