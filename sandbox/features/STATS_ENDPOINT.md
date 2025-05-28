# Objective
Provide a dedicated statistics endpoint on the MCP HTTP server to expose key runtime metrics for monitoring and observability. Clients can retrieve the total number of successful command invocations, server uptime, and detailed memory usage.

# Endpoint: GET /stats
- Description: Return current server runtime metrics in JSON format.
- Response: HTTP 200 with JSON object:
  {
    "callCount": number,       // total successful POST /invoke calls since server start
    "uptime": number,          // seconds since server start (process.uptime())
    "memoryUsage": {           // values from process.memoryUsage()
      "rss": number,
      "heapTotal": number,
      "heapUsed": number,
      "external": number
    }
  }
- Behavior:
  • Read `globalThis.callCount` (initialized in src/lib/main.js) and increment it on each successful POST /invoke.
  • Compute `uptime` via `process.uptime()`.
  • Gather memory statistics via `process.memoryUsage()`.
  • Log the metrics object using `logInfo` before responding.

# Testing
## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).
- Stub `process.uptime()` to return a known number.
- Stub `process.memoryUsage()` to return a predictable object with numeric fields.
- Send GET `/stats` using Supertest:
  • Assert status 200.
  • Assert response body exactly matches the mocked metrics and fields are of type number.
  • Spy on `logInfo` to verify it was called with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start the server via `createServer(app)` in Vitest async hooks.
- Perform several POST `/invoke` requests to bump `callCount`.
- Send GET `/stats`:
  • Assert status 200.
  • Assert `callCount` is a number at least equal to the number of invokes.
  • Assert `uptime` is a positive number.
  • Assert each `memoryUsage` property is a non-negative number.

# Documentation & README
- Update `sandbox/docs/API.md`:
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.
  - Example response:
    ```json
    {
      "callCount": 3,
      "uptime": 42.7,
      "memoryUsage": {"rss": 12345678, "heapTotal": 5000000, "heapUsed": 3000000, "external": 200000}
    }
    ```
- Update `sandbox/README.md` under "MCP HTTP API":
  ## Statistics
  Retrieve server metrics:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```