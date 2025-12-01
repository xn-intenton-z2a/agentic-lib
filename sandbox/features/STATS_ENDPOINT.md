# Objective
Enhance the existing MCP HTTP server by fully implementing the /stats endpoint to provide real-time runtime metrics, including total invocation count, uptime, and memory usage. Clients can retrieve these metrics over HTTP for monitoring and observability.

# Endpoint

## GET /stats
- Description: Retrieve current server metrics in JSON format.
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
  • Read `globalThis.callCount`, initialized in core library and incremented on each successful POST /invoke.
  • Compute uptime via `process.uptime()`.
  • Gather memory usage via `process.memoryUsage()`.
  • Log the metrics object with `logInfo` before responding.

# Implementation
1. Ensure `globalThis.callCount` is defined (default 0) in `src/lib/main.js`.
2. In `sandbox/source/server.js`, after sending a successful response in POST /invoke, increment `globalThis.callCount`.
3. Add route handler:
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
4. Make endpoint available when `process.env.NODE_ENV !== 'test'`.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).
- Stub `process.uptime()` and `process.memoryUsage()` to return known values.
- Send GET /stats using Supertest:
  • Assert status 200.
  • Assert response body matches mocked metrics and fields are numbers.
  • Spy on `logInfo` to verify a single log entry with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via `createServer(app)` in Vitest hooks.
- Perform several POST /invoke calls to increment `callCount`.
- Send GET /stats:
  • Assert status 200.
  • Assert `callCount` is a number ≥ number of invoke calls.
  • Assert `uptime` is a positive number.
  • Assert each field in `memoryUsage` is a non-negative number.

# Documentation
1. **sandbox/docs/API.md**:
   ### GET /stats
   - Description: Retrieve runtime metrics for monitoring.
   - Example response:
     ```json
     {
       "callCount": 10,
       "uptime": 34.56,
       "memoryUsage": {
         "rss": 15000000,
         "heapTotal": 5000000,
         "heapUsed": 3000000,
         "external": 200000
       }
     }
     ```
2. **sandbox/README.md**:
   Under "MCP HTTP API", add a "Statistics" subsection:
   ```bash
   curl http://localhost:3000/stats
   ```
   ```js
   const res = await fetch('http://localhost:3000/stats');
   console.log(await res.json());
   ```