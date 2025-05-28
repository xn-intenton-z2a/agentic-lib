# Objective
Provide robust security controls for the MCP HTTP API by enforcing API key authentication and protecting against abusive clients with rate limiting.

# API Key Authentication

• Read `MCP_API_KEY` from environment at server startup.  
• Reject any request lacking header `Authorization: Bearer <MCP_API_KEY>` with HTTP 401 and JSON `{ "error": "Unauthorized" }`.
• Log all authentication failures with `logError` including client IP and timestamp.

# Rate Limiting

• Introduce `express-rate-limit` middleware applied globally before routes.  
• Default window: 15 minutes; default max: 100 requests per IP.  
• Allow overrides via env vars `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX`.  
• On limit exceeded, respond HTTP 429 and JSON `{ "error": "Too many requests, please try again later." }` and log event with `logInfo`.

# Implementation

1. Install and import `express-rate-limit` and apply it in `sandbox/source/server.js` before other middleware.  
2. In the same file, add a middleware function that:
   - Reads `MCP_API_KEY`, validates `Authorization` header, and short-circuits with 401 on failure.  
   - Calls `next()` on successful authentication.
3. Ensure ordering: rate limiter runs first, then auth, then logging, then existing route handlers.
4. Update `package.json` if new dependency is required.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock environment without `MCP_API_KEY` and send a request, expect 401 Unauthorized.  
- Mock incorrect token, expect 401 and logError called.  
- Mock correct token and verify flow continues for a simple endpoint (e.g., GET `/health`).  
- Stub rate limiter: simulate more than `RATE_LIMIT_MAX` calls in a loop to GET `/health`, expect final calls return 429 and logInfo is invoked.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start server with `MCP_API_KEY` and default rate-limit env.  
- Issue a request without `Authorization` header, expect 401.  
- Issue a request with valid `Authorization`, expect 200 on `/health`.  
- Send more than 100 requests with valid header to `/health` and assert 429 on the excess.  

# Documentation

• Update `sandbox/docs/API.md`: add sections under “General Behavior” describing authentication and rate limiting, example headers, example 401 and 429 responses.  
• Update `sandbox/README.md`: how to set `MCP_API_KEY`, override rate-limit variables, and sample cURL showing a protected call and a rate limit exceeded response.