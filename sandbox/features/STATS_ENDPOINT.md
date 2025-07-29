# Objective
Provide a dedicated statistics endpoint on the MCP HTTP server to expose key runtime metrics—total successful invocations, uptime, and memory usage—enabling clients and operators to monitor service health and performance.

# Endpoint: GET /stats
- Description: Retrieve current server metrics in JSON format.
- Response: HTTP 200 with JSON:
  {
    "callCount": number,        // total successful POST /invoke calls since server start
    "uptime": number,           // seconds since server start (process.uptime())
    "memoryUsage": {            // values from process.memoryUsage()
      "rss": number,            // Resident Set Size in bytes
      "heapTotal": number,      // total V8 heap size in bytes
      "heapUsed": number,       // used V8 heap size in bytes
      "external": number        // external memory usage in bytes
    }
  }

# Implementation
1. Ensure `globalThis.callCount` is initialized to 0 in `src/lib/main.js`.
2. In `sandbox/source/server.js`, after each successful POST /invoke command, increment `globalThis.callCount` by 1.
3. Add a new route handler:
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
4. Ensure the endpoint is available when `process.env.NODE_ENV !== 'test'` and does not break existing routes.

# Testing
## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).
- Stub `process.uptime()` and `process.memoryUsage()` to return known values.
- Use Supertest to GET `/stats`:
  • Assert status 200 and response body matches mocked metrics and field types are numbers.
  • Spy on `logInfo` to verify a single log entry with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via `createServer(app)` in Vitest hooks.
- Perform several POST `/invoke` calls to increment the counter.
- GET `/stats`:
  • Assert status 200.
  • Assert `callCount` ≥ number of invoke calls.
  • Assert `uptime` is positive.
  • Assert each `memoryUsage` field is a non-negative number.

# Documentation
- **sandbox/docs/API.md**:
  Add under Endpoints:
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.
  - Response example:
    ```json
    {
      "callCount": 10,
      "uptime": 34.56,
      "memoryUsage": {
        "rss": 12345678,
        "heapTotal": 5000000,
        "heapUsed": 3000000,
        "external": 200000
      }
    }
    ```
- **sandbox/README.md**:
  In the "MCP HTTP API" section, add a "Statistics" subsection:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```