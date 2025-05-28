# Objective
Secure the MCP HTTP API by enforcing API key authentication and protective rate limiting, ensuring only authorized clients can access endpoints and preventing abuse.

# Middleware Configuration

## Rate Limiting
- Use `express-rate-limit` middleware before all routes.
- Default window: 15 minutes (900000 ms), max requests per IP: 100.
- Override via environment variables:
  • `RATE_LIMIT_WINDOW_MS`
  • `RATE_LIMIT_MAX`
- On limit exceeded, respond HTTP 429 with JSON `{ "error": "Too many requests, please try again later." }` and log event.

## API Key Authentication
- Read `MCP_API_KEY` from environment at startup.
- For every incoming request, check `Authorization` header for `Bearer <MCP_API_KEY>`.
- If missing or invalid, respond HTTP 401 with JSON `{ "error": "Unauthorized" }` and log failure.

# Implementation

- Install and import `express-rate-limit` in `sandbox/source/server.js`.
- Globally apply rate limiter: `app.use(limiter)`.
- Add a custom middleware after rate limiter that:
  1. Reads `MCP_API_KEY`.
  2. Validates `Authorization` header.
  3. Returns 401 on failure or calls `next()` on success.
- Maintain existing logging middleware (`logInfo`, `logError`) and ensure order: rate limiter, auth, logging, routes.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Simulate missing `MCP_API_KEY` env and send GET `/health`: expect 401 Unauthorized and no further routes called.
- Simulate incorrect token: expect 401 and `logError` spy.
- Simulate valid token and GET `/health`: expect 200 OK.
- Stub rate limiter for unit: simulate over-limit scenario to GET `/health`, expect 429 and `logInfo` called with rate-limit event.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server with valid `MCP_API_KEY` env and default rate limits.
- Issue GET `/health` without `Authorization` header: expect 401.
- Issue GET `/health` with correct header: expect 200.
- Send `RATE_LIMIT_MAX + 1` requests with valid header to `/health`: expect final request(s) return 429.

# Documentation

- Update `sandbox/docs/API.md`:
  • Under “General Behavior”, describe authentication and rate limiting.
  • Provide example headers and responses for 401 and 429.

- Update `sandbox/README.md`:
  • Document setting `MCP_API_KEY` and override variables.
  • Show cURL examples:
    ```bash
    # Unauthorized
    curl http://localhost:3000/health
    # Authorized
    curl -H "Authorization: Bearer $MCP_API_KEY" http://localhost:3000/health
    # Rate limit exceeded
    curl -H "Authorization: Bearer $MCP_API_KEY" http://localhost:3000/health
    ```