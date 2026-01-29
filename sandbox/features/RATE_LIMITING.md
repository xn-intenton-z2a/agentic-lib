# Objective
Introduce rate limiting middleware to the MCP HTTP server in sandbox/source/server.js to protect endpoints from excessive or abusive requests. This ensures stability and fair use by limiting the number of requests a single client can make in a defined time window.

# Middleware Configuration

## express-rate-limit Settings
- Add a dependency on express-rate-limit.
- Default window: 15 minutes (900000 ms).
- Default max requests per IP per window: 100.
- Allow overrides via environment variables:
  • RATE_LIMIT_WINDOW_MS: custom window duration in milliseconds.
  • RATE_LIMIT_MAX: custom max requests per window.

# Implementation

1. Update package.json to add "express-rate-limit" under dependencies.
2. In sandbox/source/server.js:
   - Import rateLimit from 'express-rate-limit'.
   - Configure limiter:
     ```js
     const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000;
     const max = parseInt(process.env.RATE_LIMIT_MAX) || 100;
     const limiter = rateLimit({ windowMs, max,
       handler: (req, res) => {
         logInfo(`Rate limit exceeded for IP ${req.ip}`);
         res.status(429).json({ error: "Too many requests, please try again later." });
       }
     });
     ```
   - Apply `app.use(limiter)` before all routes.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock Express request/response objects with varying IP and call count.
- Simulate repeated calls by invoking the limiter middleware directly.
- Verify first `max` calls invoke next(), then the next call returns 429 and correct JSON.
- Spy on `logInfo` to confirm logging of rate-limited events.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Send `RATE_LIMIT_MAX + 1` requests to GET /health in rapid succession.
- Assert the final request(s) return HTTP 429 with JSON `{ error: "Too many requests, please try again later." }`.

# Documentation

## sandbox/docs/API.md
Add under "General Behavior":
### Rate Limiting
Clients are limited to RATE_LIMIT_MAX requests per RATE_LIMIT_WINDOW_MS window (default 100 per 15 minutes). Exceeding this limit returns HTTP 429 with JSON error.

## sandbox/README.md
Under "MCP HTTP API" configuration:
```bash
# Rate limit settings
RATE_LIMIT_MAX=200 RATE_LIMIT_WINDOW_MS=600000 npm start
```
Default response on limit:
```bash
HTTP/1.1 429 Too Many Requests
{ "error": "Too many requests, please try again later." }
```