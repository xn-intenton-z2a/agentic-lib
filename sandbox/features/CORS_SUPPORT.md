# Objective
Enable Cross-Origin Resource Sharing (CORS) on the MCP HTTP server to allow browser-based clients from other origins to safely interact with the API endpoints without being blocked by the same-origin policy.

# Implementation

1. **Dependency**: Add `cors` to the sandbox dependencies in `package.json`.
2. **Import and Configure**: In `sandbox/source/server.js`, import `cors` and configure the middleware:
   • Use an environment variable `CORS_ORIGIN` for allowed origins, defaulting to '*'.
   • Apply `app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))` before other middlewares.
3. **Order**: Ensure CORS middleware is registered after `express.json()` and before request logging to set headers on all responses.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Use Supertest to send a sample request to any endpoint (e.g., `/health`) with an `Origin` header set to a test origin.
- Assert that the response includes the `Access-Control-Allow-Origin` header matching the configured origin.
- Mock `process.env.CORS_ORIGIN` to different values and verify the header changes accordingly.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start the server and send actual HTTP requests with Supertest:
  • Without setting `CORS_ORIGIN`, expect `Access-Control-Allow-Origin: *` on endpoints `/health`, `/mission`, `/invoke`.
  • With `CORS_ORIGIN=http://example.com`, restart server and send request with `Origin: http://example.com`, expect header equals that origin.

# Documentation

1. **sandbox/docs/API.md**:
   - Under a new section **CORS**:
     ```markdown
     ## CORS
     - All endpoints include the `Access-Control-Allow-Origin` header.
     - Configure allowed origins via the `CORS_ORIGIN` environment variable (defaults to `*`).
     ```
2. **sandbox/README.md**:
   - In **Configuration**:
     ```markdown
     ### CORS Configuration
     Set the allowed origin for CORS using the environment variable:
     ```bash
     CORS_ORIGIN=http://example.com npm start
     ```
     Responses will include:
     ```http
     Access-Control-Allow-Origin: http://example.com
     ```
     ```