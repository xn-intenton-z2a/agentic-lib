# Objective
Enhance the MCP HTTP server by securing all endpoints with API key authentication and rate limiting, ensuring that only authorized clients can access the API and protecting against abusive traffic.

# Middleware Configuration

## Rate Limiting
- Use express-rate-limit middleware globally before all other routes.
- Default window: 15 minutes (900000 ms).
- Default max requests per IP: 100.
- Allow overrides via environment variables RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX.
- On limit reached: respond HTTP 429 with JSON error and logInfo the event.

## API Key Authentication
- Require a valid API key on every request via the Authorization header: Bearer <MCP_API_KEY>.
- Read MCP_API_KEY from environment at startup; fail early if undefined.
- On missing or invalid key: respond HTTP 401 with JSON error and logError the event.

# Implementation
1. **Dependencies**: Add express-rate-limit to package.json.
2. **Server Code (`sandbox/source/server.js`)**:
   - Import rateLimit from 'express-rate-limit'.
   - Define a limiter using RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX from process.env.
   - Apply `app.use(limiter)` immediately after express.json().
   - Add auth middleware:
     ```js
     app.use((req, res, next) => {
       const apiKey = process.env.MCP_API_KEY;
       const auth = req.headers.authorization;
       if (!apiKey || auth !== `Bearer ${apiKey}`) {
         logError('Unauthorized access', null);
         return res.status(401).json({ error: 'Unauthorized' });
       }
       next();
     });
     ```
   - Maintain order: rate limiter, auth, logging, routes.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock express request/response to simulate rate-limit and auth behavior.
- Set process.env.MCP_API_KEY and test:
  1. No Authorization header → 401 Unauthorized and logError.
  2. Invalid token → 401 and logError.
  3. Valid token → passes to next middleware.
- Simulate exceeding RATE_LIMIT_MAX to GET /health via Supertest:
  - Assert early requests return 200; final requests return 429 with correct JSON error.
  - Spy on logInfo for rate-limit events.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start server with valid MCP_API_KEY and default rate limits.
- Test GET /health without Authorization → 401.
- Test GET /health with correct header → 200 and body contains status ok.
- Send RATE_LIMIT_MAX+1 authorized requests to /health → final returns 429.
- Ensure JSON error message and headers match expectations.

# Documentation

## sandbox/docs/API.md
- Under **General Behavior**, add:
  - **Authentication**: All endpoints require an Authorization header: Bearer <MCP_API_KEY>.
  - **Rate Limiting**: Default 100 requests per 15 minutes; override with RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX.
  - Example 401 and 429 responses.

## sandbox/README.md
- Document setting MCP_API_KEY and rate-limit variables.
- cURL examples:
  ```bash
  # Missing key
  curl http://localhost:3000/health
  # Authorized request
  curl -H 'Authorization: Bearer $MCP_API_KEY' http://localhost:3000/health
  # Exceeded limit
  curl -H 'Authorization: Bearer $MCP_API_KEY' http://localhost:3000/health
  ```

# Dependencies
- Add "express-rate-limit": "^6.8.0" under dependencies in package.json.

# Verification & Acceptance
- `npm test` must pass all new and existing tests.
- Manual smoke test:
  1. Start server with MCP_API_KEY set.
  2. Attempt unauthorized and authorized requests.
  3. Flood /health to trigger 429.
- Confirm correct HTTP statuses, JSON error messages, and log entries.