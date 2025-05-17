import http from 'http';
import crypto from 'crypto';
import { URL } from 'url';
import { z } from 'zod';
import dotenv from 'dotenv';
import MarkdownIt from 'markdown-it';
import markdownItGithub from 'markdown-it-github';

dotenv.config();

// Configuration
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS || '*';
const RATE_LIMIT_REQUESTS = process.env.RATE_LIMIT_REQUESTS ? parseInt(process.env.RATE_LIMIT_REQUESTS, 10) : 60;
const METRICS_USER = process.env.METRICS_USER;
const METRICS_PASS = process.env.METRICS_PASS;
const DOCS_USER = process.env.DOCS_USER;
const DOCS_PASS = process.env.DOCS_PASS;

// Metrics storage
const metrics = {
  http_requests_total: {},
  http_request_failures_total: {},
};

// Rate limiter per IP
const rateLimiters = new Map();

// Minimal OpenAPI spec for available endpoints
const openApiSpec = {
  openapi: '3.0.0',
  info: { title: 'Agentic-lib Server API', version: '1.0.0' },
  paths: {
    '/health': { get: { responses: { '200': { description: 'OK' } } } },
    '/metrics': { get: { responses: { '200': { description: 'Prometheus metrics' } } } },
    '/openapi.json': { get: { responses: { '200': { description: 'OpenAPI JSON' } } } },
    '/docs': { get: { responses: { '200': { description: 'Interactive Docs' } } } }
  }
};

// Utility functions
def function recordRequest(method, route, status) {
  const key = `${method}_${route}_${status}`;
  metrics.http_requests_total[key] = (metrics.http_requests_total[key] || 0) + 1;
}

def function recordFailure(route) {
  metrics.http_request_failures_total[route] = (metrics.http_request_failures_total[route] || 0) + 1;
}

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60000;
  const limit = RATE_LIMIT_REQUESTS;
  let entry = rateLimiters.get(ip);
  if (!entry) {
    entry = { tokens: limit - 1, last: now };
    rateLimiters.set(ip, entry);
    return true;
  }
  const elapsed = now - entry.last;
  const refill = Math.floor(elapsed / windowMs) * limit;
  if (refill > 0) {
    entry.tokens = Math.min(entry.tokens + refill, limit);
    entry.last = now;
  }
  if (entry.tokens > 0) {
    entry.tokens -= 1;
    return true;
  }
  return false;
}

function basicAuth(req, user, pass) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) return false;
  const creds = Buffer.from(auth.slice(6), 'base64').toString('utf8');
  const [u, p] = creds.split(':');
  return u === user && p === pass;
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': CORS_ALLOWED_ORIGINS,
  });
  res.end(body);
}

function sendText(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': CORS_ALLOWED_ORIGINS,
  });
  res.end(data);
}

async function handler(req, res) {
  const ip = req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    recordFailure('rate_limit');
    res.writeHead(429);
    return res.end('Too Many Requests');
  }
  const method = req.method;
  const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
  const route = parsedUrl.pathname;
  try {
    if (method === 'GET' && route === '/health') {
      const data = { status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() };
      sendJson(res, 200, data);
      recordRequest(method, 'health', 200);
    } else if (method === 'GET' && route === '/metrics') {
      if (METRICS_USER && METRICS_PASS && !basicAuth(req, METRICS_USER, METRICS_PASS)) {
        recordFailure('metrics_auth');
        res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Metrics"' });
        return res.end('Unauthorized');
      }
      let out = '';
      for (const key in metrics.http_requests_total) {
        const [m, r, s] = key.split('_');
        out += `http_requests_total{method=\"${m}\",route=\"${r}\",status=\"${s}\"} ${metrics.http_requests_total[key]}\n`;
      }
      for (const r in metrics.http_request_failures_total) {
        out += `http_request_failures_total{route=\"${r}\"} ${metrics.http_request_failures_total[r]}\n`;
      }
      sendText(res, 200, out);
      recordRequest(method, 'metrics', 200);
    } else if (method === 'GET' && route === '/openapi.json') {
      sendJson(res, 200, openApiSpec);
      recordRequest(method, 'openapi', 200);
    } else if (method === 'GET' && route === '/docs') {
      if (DOCS_USER && DOCS_PASS && !basicAuth(req, DOCS_USER, DOCS_PASS)) {
        recordFailure('docs_auth');
        res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Docs"' });
        return res.end('Unauthorized');
      }
      const md = new MarkdownIt().use(markdownItGithub);
      const mdContent = '```json\n' + JSON.stringify(openApiSpec, null, 2) + '\n```';
      const html = md.render(mdContent);
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': CORS_ALLOWED_ORIGINS,
      });
      res.end(html);
      recordRequest(method, 'docs', 200);
    } else {
      recordFailure(route);
      res.writeHead(404);
      res.end('Not Found');
    }
  } catch (err) {
    recordFailure(route);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
}

export function startServer(options = {}) {
  const port = options.port || PORT;
  const server = http.createServer(handler);
  server.listen(port);
  console.log(`Server started on port ${port}`);
  return server;
}