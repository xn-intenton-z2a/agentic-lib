# Objective
Secure the MCP HTTP API by implementing API key authentication and rate limiting middleware. This ensures that only authorized clients can access endpoints and protects the server from abusive traffic.

# Middleware Configuration

## Rate Limiting
- Install and configure express-rate-limit with defaults:
  • Window: RATE_LIMIT_WINDOW_MS (default 900000 ms / 15 minutes)
  • Max requests per IP: RATE_LIMIT_MAX (default 100)
- Apply limiter globally after JSON body parsing and before auth.
- On exceeding limit, respond HTTP 429 with JSON `{ error: "Too many requests, please try again later." }` and log the event.

## API Key Authentication
- Read `MCP_API_KEY` from environment at startup; fail-fast if undefined.
- Apply auth middleware globally after rate limiter:
  • Inspect `Authorization` header for `Bearer <MCP_API_KEY>`.
  • On missing or invalid key, respond HTTP 401 with JSON `{ error: "Unauthorized" }` and log the event.

# Implementation
1. Add `express-rate-limit` dependency in `package.json`.
2. In `sandbox/source/server.js`:
   - Import `rateLimit` from 'express-rate-limit'.
   - Define limiter using `process.env.RATE_LIMIT_WINDOW_MS` and `process.env.RATE_LIMIT_MAX`.
   - Apply `app.use(express.json())`, then `app.use(limiter)`, then auth middleware, then logging middleware and routes.
   - In auth middleware, log errors with `logError` before responding.
3. Ensure middleware order does not break existing endpoints.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock environment variables and header values.
- Test unauthorized access:
  • No `Authorization` header → 401 and logError called.
  • Wrong key → 401 and logError called.
- Test authorized access allows next middleware:
  • Valid key → pass through to `/health`.
- Simulate rate-limit:
  • Mock limiter and send more than `RATE_LIMIT_MAX` requests to `/health`.
  • Verify HTTP 429 on excess and logInfo for rate-limit events.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start server with valid `MCP_API_KEY` in env.
- Test `/health` without and with valid `Authorization` header.
- Flood `/health` with authorized requests past limit:
  • Expect HTTP 429 with correct JSON error.

# Documentation

## `sandbox/docs/API.md`
- Under **General Behavior**, describe authentication and rate limiting:
  ```markdown
  **Authentication**: All endpoints require `Authorization: Bearer <MCP_API_KEY>` header.
  **Rate Limiting**: Default 100 requests per 15 minutes per IP. Exceeding yields HTTP 429.
  ```
- Provide examples of 401 and 429 responses.

## `sandbox/README.md`
- In **MCP HTTP API** section, add subsection **Security & Rate Limiting**:
  ```markdown
  All endpoints require an API key and are subject to rate limiting.

  # Set environment variables
  MCP_API_KEY=yourKey
  RATE_LIMIT_WINDOW_MS=900000
  RATE_LIMIT_MAX=100

  # Example requests
  curl -H 'Authorization: Bearer yourKey' http://localhost:3000/health
  # Unauthorized
  curl http://localhost:3000/health
  # Exceeded limit
  (make 101 requests) curl -H 'Authorization: Bearer yourKey' http://localhost:3000/health
  ```