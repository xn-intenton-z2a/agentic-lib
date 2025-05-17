import { describe, test, expect, vi } from 'vitest';
import http from 'http';

let server;
let base;

// Helper to perform HTTP GET requests with optional headers
function request(path, headers = {}) {
  return new Promise((resolve, reject) => {
    http.get(base + path, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

describe('Server Endpoints', () => {
  test('GET /openapi.json returns spec with required keys and correct CORS header', async () => {
    vi.resetModules();
    // Configure environment without auth
    process.env.RATE_LIMIT_REQUESTS = '1';
    delete process.env.METRICS_USER;
    delete process.env.METRICS_PASS;
    delete process.env.DOCS_USER;
    delete process.env.DOCS_PASS;

    const { startServer } = await import('../source/server.js');
    server = startServer({ port: 0 });
    const addr = server.address();
    const port = typeof addr === 'object' && addr !== null ? addr.port : 3000;
    base = `http://127.0.0.1:${port}`;

    const { statusCode, body, headers } = await request('/openapi.json');
    expect(statusCode).toBe(200);
    // CORS header
    expect(headers['access-control-allow-origin']).toBe(process.env.CORS_ALLOWED_ORIGINS || '*');

    const spec = JSON.parse(body);
    expect(spec).toHaveProperty('openapi');
    expect(spec).toHaveProperty('info');
    expect(spec).toHaveProperty('paths');

    server.close();
  });

  test('GET /docs returns HTML when docs auth not configured and includes CORS header', async () => {
    vi.resetModules();
    process.env.RATE_LIMIT_REQUESTS = '1';
    delete process.env.METRICS_USER;
    delete process.env.METRICS_PASS;
    delete process.env.DOCS_USER;
    delete process.env.DOCS_PASS;

    const { startServer } = await import('../source/server.js');
    server = startServer({ port: 0 });
    const addr = server.address();
    const port = typeof addr === 'object' && addr !== null ? addr.port : 3000;
    base = `http://127.0.0.1:${port}`;

    const { statusCode, body, headers } = await request('/docs');
    expect(statusCode).toBe(200);
    expect(headers['content-type']).toMatch(/text\/html/);
    expect(headers['access-control-allow-origin']).toBe(process.env.CORS_ALLOWED_ORIGINS || '*');
    // Should render JSON code block for OpenAPI spec
    expect(body).toContain('<pre>');
    expect(body).toContain('http_requests_total');

    server.close();
  });

  test('GET /docs returns 401 when docs auth is configured but no credentials', async () => {
    vi.resetModules();
    process.env.RATE_LIMIT_REQUESTS = '1';
    process.env.DOCS_USER = 'docu';
    process.env.DOCS_PASS = 'docp';
    delete process.env.METRICS_USER;
    delete process.env.METRICS_PASS;

    const { startServer } = await import('../source/server.js');
    server = startServer({ port: 0 });
    const addr = server.address();
    const port = typeof addr === 'object' && addr !== null ? addr.port : 3000;
    base = `http://127.0.0.1:${port}`;

    const { statusCode, body, headers } = await request('/docs');
    expect(statusCode).toBe(401);
    expect(headers['www-authenticate']).toBe('Basic realm="Docs"');
    expect(body).toBe('Unauthorized');

    server.close();
  });

  test('GET /docs with valid credentials returns HTML and CORS header', async () => {
    vi.resetModules();
    process.env.RATE_LIMIT_REQUESTS = '1';
    process.env.DOCS_USER = 'docu';
    process.env.DOCS_PASS = 'docp';
    delete process.env.METRICS_USER;
    delete process.env.METRICS_PASS;

    const { startServer } = await import('../source/server.js');
    server = startServer({ port: 0 });
    const addr = server.address();
    const port = typeof addr === 'object' && addr !== null ? addr.port : 3000;
    base = `http://127.0.0.1:${port}`;

    const auth = 'Basic ' + Buffer.from(`${process.env.DOCS_USER}:${process.env.DOCS_PASS}`).toString('base64');
    const { statusCode, body, headers } = await request('/docs', { Authorization: auth });
    expect(statusCode).toBe(200);
    expect(headers['content-type']).toMatch(/text\/html/);
    expect(headers['access-control-allow-origin']).toBe(process.env.CORS_ALLOWED_ORIGINS || '*');
    expect(body).toContain('<pre>');

    server.close();
  });

  test('GET /metrics returns 401 when metrics auth is configured but no credentials', async () => {
    vi.resetModules();
    process.env.RATE_LIMIT_REQUESTS = '1';
    process.env.METRICS_USER = 'metu';
    process.env.METRICS_PASS = 'metp';
    delete process.env.DOCS_USER;
    delete process.env.DOCS_PASS;

    const { startServer } = await import('../source/server.js');
    server = startServer({ port: 0 });
    const addr = server.address();
    const port = typeof addr === 'object' && addr !== null ? addr.port : 3000;
    base = `http://127.0.0.1:${port}`;

    const { statusCode, body, headers } = await request('/metrics');
    expect(statusCode).toBe(401);
    expect(headers['www-authenticate']).toBe('Basic realm="Metrics"');
    expect(body).toBe('Unauthorized');

    server.close();
  });

  test('GET /metrics with valid credentials returns plaintext metrics and CORS header', async () => {
    vi.resetModules();
    process.env.RATE_LIMIT_REQUESTS = '1';
    process.env.METRICS_USER = 'metu';
    process.env.METRICS_PASS = 'metp';
    delete process.env.DOCS_USER;
    delete process.env.DOCS_PASS;

    const { startServer } = await import('../source/server.js');
    server = startServer({ port: 0 });
    const addr = server.address();
    const port = typeof addr === 'object' && addr !== null ? addr.port : 3000;
    base = `http://127.0.0.1:${port}`;

    const auth = 'Basic ' + Buffer.from(`${process.env.METRICS_USER}:${process.env.METRICS_PASS}`).toString('base64');
    const { statusCode, body, headers } = await request('/metrics', { Authorization: auth });
    expect(statusCode).toBe(200);
    expect(headers['content-type']).toMatch(/text\/plain/);
    expect(headers['access-control-allow-origin']).toBe(process.env.CORS_ALLOWED_ORIGINS || '*');
    expect(body).toContain('http_requests_total');
    expect(body).toContain('http_request_failures_total');

    server.close();
  });

  test('GET /unknown returns 404 Not Found and CORS header', async () => {
    vi.resetModules();
    process.env.RATE_LIMIT_REQUESTS = '1';
    delete process.env.METRICS_USER;
    delete process.env.METRICS_PASS;
    delete process.env.DOCS_USER;
    delete process.env.DOCS_PASS;

    const { startServer } = await import('../source/server.js');
    server = startServer({ port: 0 });
    const addr = server.address();
    const port = typeof addr === 'object' && addr !== null ? addr.port : 3000;
    base = `http://127.0.0.1:${port}`;

    const { statusCode, body, headers } = await request('/unknown');
    expect(statusCode).toBe(404);
    expect(body).toBe('Not Found');
    expect(headers['access-control-allow-origin']).toBe(process.env.CORS_ALLOWED_ORIGINS || '*');

    server.close();
  });

  test('Rate limiting: second /health returns 429 Too Many Requests', async () => {
    vi.resetModules();
    process.env.RATE_LIMIT_REQUESTS = '1';
    delete process.env.METRICS_USER;
    delete process.env.METRICS_PASS;
    delete process.env.DOCS_USER;
    delete process.env.DOCS_PASS;

    const { startServer } = await import('../source/server.js');
    server = startServer({ port: 0 });
    const addr = server.address();
    const port = typeof addr === 'object' && addr !== null ? addr.port : 3000;
    base = `http://127.0.0.1:${port}`;

    // First request allowed
    const first = await request('/health');
    expect(first.statusCode).toBe(200);
    // Second exceeds rate limit
    const second = await request('/health');
    expect(second.statusCode).toBe(429);
    expect(second.body).toBe('Too Many Requests');
    expect(second.headers['access-control-allow-origin']).toBe(process.env.CORS_ALLOWED_ORIGINS || '*');

    server.close();
  });
});
