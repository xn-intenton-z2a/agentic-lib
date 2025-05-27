# Objective
Implement rate limiting for the MCP HTTP API server to protect against excessive or abusive requests, ensuring stability and fair use for all clients.

# Middleware Configuration

- Introduce express-rate-limit as a new dependency.
- Default limits:
  • Window duration: 15 minutes (900000 ms)
  • Maximum requests per IP per window: 100
- Allow customization via environment variables:
  • RATE_LIMIT_WINDOW_MS: override window duration in milliseconds
  • RATE_LIMIT_MAX: override max number of requests per window

# Implementation

1. Update package.json to add dependency:
   • "express-rate-limit": "^6.8.0" (or latest compatible release)
2. In sandbox/source/server.js:
   • Import rateLimit from 'express-rate-limit'.
   • Define a limiter using configured window and max values.
   • Apply limiter middleware globally before route handlers: `app.use(limiter)`.

# Success Criteria & Requirements

- Rate limiter should reject requests exceeding the configured limit with HTTP 429 and JSON:
  { "error": "Too many requests, please try again later." }
- Logging: logInfo each rate-limited event with the client IP and timestamp.
- Default behavior applies to all endpoints (/health, /mission, /features, /invoke, /stats, /openapi.json).
- All existing routes must continue to function under the limit.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock express request objects to simulate multiple requests from same IP.
- Verify that the limiter calls next() until the limit, then returns 429 response.
- Spy on logInfo to assert logging of rate limit events.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start the server with Supertest.
- Send more than `RATE_LIMIT_MAX + 1` requests to an endpoint (e.g., /health) within a short timeframe.
- Expect the final request(s) to return HTTP 429 with correct error JSON.

# Documentation

- sandbox/docs/API.md:
  • Add a note under “General Behavior”: “Clients are subject to rate limiting. Exceeding 100 requests per 15 minutes yields HTTP 429.”
- sandbox/README.md:
  • In the “MCP HTTP API” section, document rate limit defaults and environment variable overrides.
  • Provide a quick example showing a 429 response:
    ```bash
    # when rate limit is exceeded
    curl http://localhost:3000/health
    HTTP/1.1 429 Too Many Requests
    { "error": "Too many requests, please try again later." }
    ```