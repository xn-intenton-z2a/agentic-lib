import http from "http";
import { URL } from "url";
import { z } from "zod";
import dotenv from "dotenv";
import MarkdownIt from "markdown-it";
import markdownItGithub from "markdown-it-github";

dotenv.config();

// Validate environment variables
const envSchema = z.object({
  PORT: z
    .preprocess((val) => (val === undefined ? undefined : String(val)), z.string().regex(/^\d+$/).default("3000").transform((s) => parseInt(s, 10))),
  CORS_ALLOWED_ORIGINS: z.string().default("*"),
  RATE_LIMIT_REQUESTS: z
    .preprocess((val) => (val === undefined ? undefined : String(val)), z.string().regex(/^\d+$/).default("60").transform((s) => parseInt(s, 10))),
  METRICS_USER: z.string().optional(),
  METRICS_PASS: z.string().optional(),
  DOCS_USER: z.string().optional(),
  DOCS_PASS: z.string().optional(),
});
let env;
try {
  env = envSchema.parse(process.env);
} catch (err) {
  console.error("Invalid or missing environment variables for server:", err.errors);
  process.exit(1);
}

// Configuration
const PORT = env.PORT;
const CORS_ALLOWED_ORIGINS = env.CORS_ALLOWED_ORIGINS;
const RATE_LIMIT_REQUESTS = env.RATE_LIMIT_REQUESTS;
// Note: for /openai-usage auth, we read process.env dynamically
const METRICS_USER = env.METRICS_USER;
const METRICS_PASS = env.METRICS_PASS;
const DOCS_USER = env.DOCS_USER;
const DOCS_PASS = env.DOCS_PASS;

// Metrics storage
const metrics = {
  http_requests_total: {},
  http_request_failures_total: {},
  http_request_duration_seconds: [],
  openai_requests_total: {},
  openai_request_failures_total: {},
  openai_tokens_consumed_total: {},
};

// Rate limiter per IP
const rateLimiters = new Map();

// Minimal OpenAPI spec for available endpoints
const openApiSpec = {
  openapi: "3.0.0",
  info: { title: "Agentic-lib Server API", version: "1.0.0" },
  paths: {
    "/health": { get: { responses: { "200": { description: "OK" } } } },
    "/ready": { get: { responses: { "200": { description: "Ready" } } } },
    "/metrics": {
      get: { responses: { "200": { description: "Prometheus metrics including http_request_duration_seconds histogram" } } },
    },
    "/openapi.json": { get: { responses: { "200": { description: "OpenAPI JSON" } } } },
    "/docs": { get: { responses: { "200": { description: "Interactive Docs" } } } },
    "/openai-usage": { get: { responses: { "200": { description: "Prometheus metrics for OpenAI usage" } } } },
  },
};

// Utility functions
function recordRequest(method, route, status) {
  const key = `${method}_${route}_${status}`;
  metrics.http_requests_total[key] = (metrics.http_requests_total[key] || 0) + 1;
}

function recordFailure(route) {
  metrics.http_request_failures_total[route] =
    (metrics.http_request_failures_total[route] || 0) + 1;
}

function recordDuration(method, route, status, duration) {
  metrics.http_request_duration_seconds.push({ method, route, status, duration });
}

// OpenAI metrics helpers
function recordOpenAiRequest(endpoint, status) {
  const key = `${endpoint}_${status}`;
  metrics.openai_requests_total[key] = (metrics.openai_requests_total[key] || 0) + 1;
}

function recordOpenAiFailure(endpoint) {
  metrics.openai_request_failures_total[endpoint] =
    (metrics.openai_request_failures_total[endpoint] || 0) + 1;
}

function recordOpenAiTokens(model, endpoint, tokens) {
  const key = `${model}_${endpoint}`;
  metrics.openai_tokens_consumed_total[key] =
    (metrics.openai_tokens_consumed_total[key] || 0) + tokens;
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
  if (!auth || !auth.startsWith("Basic ")) return false;
  const creds = Buffer.from(auth.slice(6), "base64").toString("utf8");
  const [u, p] = creds.split(":");
  return u === user && p === pass;
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": CORS_ALLOWED_ORIGINS,
  });
  res.end(body);
}

function sendText(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": CORS_ALLOWED_ORIGINS,
  });
  res.end(data);
}

async function handler(req, res) {
  const ip = req.socket.remoteAddress || "unknown";
  const method = req.method;
  const parsedUrl = new URL(req.url || "", `http://${req.headers.host}`);
  const route = parsedUrl.pathname;
  const start = process.hrtime();
  let status = 200;

  if (!checkRateLimit(ip)) {
    status = 429;
    recordFailure("rate_limit");
    res.writeHead(429);
    res.end("Too Many Requests");
  } else {
    try {
      if (method === "GET" && route === "/health") {
        const data = { status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() };
        sendJson(res, 200, data);
        status = 200;
        recordRequest(method, "health", status);
      } else if (method === "GET" && route === "/ready") {
        const data = { status: "ready", timestamp: new Date().toISOString() };
        sendJson(res, 200, data);
        status = 200;
        recordRequest(method, "ready", status);
      } else if (method === "GET" && route === "/metrics") {
        if (METRICS_USER && METRICS_PASS && !basicAuth(req, METRICS_USER, METRICS_PASS)) {
          status = 401;
          recordFailure("metrics_auth");
          res.writeHead(401, { "WWW-Authenticate": "Basic realm=\"Metrics\"" });
          return res.end("Unauthorized");
        }
        let out = "";
        for (const key in metrics.http_requests_total) {
          const [m, r, s] = key.split("_");
          out += `http_requests_total{method="${m}",route="${r}",status="${s}"} ${metrics.http_requests_total[key]}\n`;
        }
        for (const r in metrics.http_request_failures_total) {
          out += `http_request_failures_total{route="${r}"} ${metrics.http_request_failures_total[r]}\n`;
        }
        for (const entry of metrics.http_request_duration_seconds) {
          out += `http_request_duration_seconds{method="${entry.method}",route="${entry.route}",status="${entry.status}"} ${entry.duration}\n`;
        }
        sendText(res, 200, out);
        status = 200;
        recordRequest(method, "metrics", status);
      } else if (method === "GET" && route === "/openapi.json") {
        sendJson(res, 200, openApiSpec);
        status = 200;
        recordRequest(method, "openapi", status);
      } else if (method === "GET" && route === "/docs") {
        if (DOCS_USER && DOCS_PASS && !basicAuth(req, DOCS_USER, DOCS_PASS)) {
          status = 401;
          recordFailure("docs_auth");
          res.writeHead(401, { "WWW-Authenticate": "Basic realm=\"Docs\"" });
          return res.end("Unauthorized");
        }
        const md = new MarkdownIt().use(markdownItGithub);
        const mdContent = "```json\n" + JSON.stringify(openApiSpec, null, 2) + "\n```";
        const html = md.render(mdContent);
        res.writeHead(200, {
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": CORS_ALLOWED_ORIGINS,
        });
        res.end(html);
        status = 200;
        recordRequest(method, "docs", status);
      } else if (method === "GET" && route === "/openai-usage") {
        const metricsUser = process.env.METRICS_USER;
        const metricsPass = process.env.METRICS_PASS;
        if (metricsUser && metricsPass && !basicAuth(req, metricsUser, metricsPass)) {
          status = 401;
          recordFailure("openai_usage_auth");
          res.writeHead(401, { "WWW-Authenticate": "Basic realm=\"OpenAI Usage\"" });
          return res.end("Unauthorized");
        }
        let out = "";
        const openaiRequestsSum = Object.values(metrics.openai_requests_total).reduce((a, b) => a + b, 0);
        const openaiFailuresSum = Object.values(metrics.openai_request_failures_total).reduce((a, b) => a + b, 0);
        const openaiTokensSum = Object.values(metrics.openai_tokens_consumed_total).reduce((a, b) => a + b, 0);
        out += `openai_requests_total ${openaiRequestsSum}\n`;
        out += `openai_request_failures_total ${openaiFailuresSum}\n`;
        out += `openai_tokens_consumed_total ${openaiTokensSum}\n`;
        sendText(res, 200, out);
        status = 200;
        recordRequest(method, "openai_usage", status);
      } else {
        status = 404;
        recordFailure(route);
        res.writeHead(404);
        res.end("Not Found");
      }
    } catch (err) {
      status = 500;
      recordFailure(route);
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  }

  // Record duration for each request except /metrics to avoid recursive metrics recording
  const [sec, nanosec] = process.hrtime(start);
  const duration = sec + nanosec / 1e9;
  if (route !== "/metrics") {
    recordDuration(method, route, status, duration);
  }
}

export function startServer(options = {}) {
  const port = options.port || PORT;
  const server = http.createServer(handler);
  server.listen(port);
  console.log(`Server started on port ${port}`);
  return server;
}
