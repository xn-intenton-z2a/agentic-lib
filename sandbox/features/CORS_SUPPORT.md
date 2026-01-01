# Objective
Enable Cross-Origin Resource Sharing (CORS) on the MCP HTTP server to allow browser-based clients from other origins to safely interact with the API endpoints without being blocked by the same-origin policy.

# Implementation

1. Add `cors` as a dependency in `package.json`.
2. In `sandbox/source/server.js`, import `cors`:
   ```js
   import cors from 'cors';
   ```
3. Configure the middleware using an environment variable `CORS_ORIGIN` (defaults to `*`):
   ```js
   const allowedOrigin = process.env.CORS_ORIGIN || '*';
   app.use(cors({ origin: allowedOrigin }));
   ```
4. Apply `app.use(cors(...))` after `app.use(express.json())` and before request logging middleware to ensure all requests include the proper headers.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `process.env.CORS_ORIGIN` to a test value (e.g., `http://example.com`).
- Use Supertest to send a request to `/health` with an `Origin` header.
- Assert the response includes `Access-Control-Allow-Origin` matching the configured origin.
- Repeat with default origin (`*`).

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start the server via `createServer(app)` in Vitest hooks.
- Without setting `CORS_ORIGIN`, send a GET request to `/mission` with `Origin: http://test.com`, expect header `Access-Control-Allow-Origin: *`.
- With `CORS_ORIGIN=http://myapp.com`, restart server and send a request, expect header `Access-Control-Allow-Origin: http://myapp.com`.

# Documentation

## sandbox/docs/API.md
Add a **CORS** section:
```
## CORS
The server sends `Access-Control-Allow-Origin` in responses to allow cross-origin requests.
Configure allowed origin via the `CORS_ORIGIN` environment variable (default `*`).
```

## sandbox/README.md
In **Configuration**:
```
### CORS Configuration
Set `CORS_ORIGIN` to restrict allowed origins:

```bash
CORS_ORIGIN=http://example.com npm start
```

Response headers will include:
```http
Access-Control-Allow-Origin: http://example.com
```