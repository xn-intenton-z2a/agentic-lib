# Objective
Implement API key-based authentication for all MCP server endpoints to secure access and ensure only authorized clients can invoke actions remotely.

# Authentication Middleware

1. API Key Validation
   - Require clients to include an `x-api-key` header on all HTTP requests except public endpoints (`/health`, `/openapi.json`, `/docs`).
   - Load valid API keys from an environment variable `API_KEYS` as a comma-separated list.
   - Reject requests without `x-api-key` or with an invalid key with HTTP 401 `{ error: "Unauthorized" }`.

2. Exemptions
   - Public endpoints `/health`, `/openapi.json`, and `/docs` remain accessible without authentication.

# Implementation Details

- Add a new middleware function in `sandbox/source/server.js`:
  ```js
  function apiKeyAuth(req, res, next) {
    const publicPaths = ['/health', '/openapi.json', '/docs'];
    if (publicPaths.includes(req.path)) return next();
    const key = req.header('x-api-key');
    const validKeys = process.env.API_KEYS?.split(',') || [];
    if (!key || !validKeys.includes(key)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  }
  ```
- Apply `apiKeyAuth` globally after JSON parsing and before route handlers.
- Document `API_KEYS` usage in `sandbox/README.md` under "Configuration".

# Testing

## Unit Tests (`sandbox/tests/auth.unit.test.js`)
- Mock `process.env.API_KEYS` to include a test key `test-key`.
- Test requests:
  - Without `x-api-key` to a protected endpoint (e.g., `/invoke`): expect 401 and `{ error: 'Unauthorized' }`.
  - With invalid `x-api-key`: expect 401.
  - With valid `x-api-key`: proceed to next handler (mock handler returns 200).
- Ensure public endpoints `/health`, `/openapi.json`, `/docs` are accessible without `x-api-key`.

## Integration Tests (`sandbox/tests/auth.integration.test.js`)
- Start server via `createServer(app)`.
- Configure `process.env.API_KEYS = 'validKey'` before startup.
- Test calling `/features` without key: expect 401.
- Test calling `/features` with `x-api-key: validKey`: expect 200 and JSON array.
- Test `/health`, `/docs`, `/openapi.json` without key: expect 200.

# Documentation

- Update `sandbox/docs/API.md` under "Authentication":
  ```markdown
  ## Authentication
  - All protected endpoints require an `x-api-key` header.
  - Configure valid keys using the environment variable `API_KEYS`, e.g., `API_KEYS=key1,key2`.
  - Unauthorized requests receive HTTP 401 Unauthorized.
  ```
- Update `sandbox/README.md` to include instructions under a new "Configuration" section:
  ```markdown
  ## Configuration
  Set `API_KEYS` environment variable:
  ```bash
  API_KEYS=your_api_key1,your_api_key2 npm start
  ```
  ```

# Dependencies & Constraints

- No new dependencies; use built-in Express middleware.
- Ensure Node 20 ESM compatibility.
- Only modify `sandbox/source/server.js`, add new test files in `sandbox/tests/`, and update docs in `sandbox/docs/` and `sandbox/README.md`.
