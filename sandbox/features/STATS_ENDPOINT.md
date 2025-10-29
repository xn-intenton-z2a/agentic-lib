# Objective
Implement the GET /stats endpoint on the MCP HTTP server to expose real-time server metrics for monitoring and observability. Clients can retrieve total successful invocations of POST /invoke, uptime since server start, and detailed memory usage.

# Endpoint
## GET /stats
- Description: Return current runtime metrics in JSON format.
- Behavior:
  • Read `globalThis.callCount` (initialized to 0 in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute uptime via `process.uptime()`.
  • Gather memory usage using `process.memoryUsage()`.
  • Log the metrics object using `logInfo`.
- Response: HTTP 200 with JSON object:
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

# Testing
## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).
- Stub `process.uptime()` to return a known value.
- Stub `process.memoryUsage()` to return a predictable object.
- Send GET /stats via Supertest:
  • Assert status 200.
  • Assert response body matches the mocked metrics and types.
  • Spy on `logInfo` to verify it was called with the serialized metrics.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start server via `createServer(app)` in Vitest hooks.
- Perform several POST /invoke calls to increment the counter.
- Send GET /stats:
  • Assert status 200.
  • Assert `callCount` ≥ number of invoke calls.
  • Assert `uptime` is positive.
  • Assert each field in `memoryUsage` is non-negative.

# Documentation
- Update `sandbox/docs/API.md` under Endpoints:
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.
  - Response example with JSON schema.
- Update `sandbox/README.md` under "MCP HTTP API" with a "Statistics" subsection showing cURL and JavaScript fetch examples:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```