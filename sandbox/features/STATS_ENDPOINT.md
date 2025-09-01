# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose actionable runtime metrics—total successful command invocations, uptime, and memory usage—for monitoring and observability.

# Endpoint: GET /stats
- Description: Retrieve current server metrics in JSON format.
- Behavior:
  • Read `globalThis.callCount` (initialized in core library and incremented after each successful POST /invoke).
  • Compute uptime via `process.uptime()`.
  • Collect memory usage with `process.memoryUsage()`.
  • Log metrics with `logInfo` before responding.
- Response: HTTP 200 with JSON:
  {
    "callCount": number,
    "uptime": number,
    "memoryUsage": {
      "rss": number,
      "heapTotal": number,
      "heapUsed": number,
      "external": number
    }
  }

# Implementation Details
1. Initialize `globalThis.callCount = 0` in `src/lib/main.js` if undefined.
2. In `sandbox/source/server.js`, after each successful invocation in POST /invoke (commands: digest, version, help), increment `globalThis.callCount`.
3. Add route handler in `sandbox/source/server.js`:
   ```js
   app.get('/stats', (req, res) => {
     const metrics = {
       callCount: globalThis.callCount,
       uptime: process.uptime(),
       memoryUsage: process.memoryUsage()
     };
     logInfo(`Stats requested: ${JSON.stringify(metrics)}`);
     res.status(200).json(metrics);
   });
   ```
4. Ensure endpoint is active when `process.env.NODE_ENV !== 'test'` and does not disrupt existing routes.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `globalThis.callCount` to fixed value (e.g., 5).
- Stub `process.uptime()` and `process.memoryUsage()` to known values.
- Send GET `/stats` via Supertest: assert HTTP 200, JSON body matches mocks, and numeric types.
- Spy on `logInfo` to verify it was called with serialized metrics.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start server via `createServer(app)`.
- Perform several POST `/invoke` calls to increment counter.
- GET `/stats`: assert HTTP 200, `callCount` ≥ invoke count, positive `uptime`, and non-negative memoryUsage fields.

# Documentation

1. **API Reference** (`sandbox/docs/API.md`):
   ### GET /stats
   - Description: Retrieve runtime metrics for monitoring.
   - Response example with JSON schema.

2. **README** (`sandbox/README.md`): Under "MCP HTTP API", add:
   ## Statistics
   Retrieve server metrics:
   ```bash
   curl http://localhost:3000/stats
   ```
   ```js
   const res = await fetch('http://localhost:3000/stats');
   console.log(await res.json());
   ```