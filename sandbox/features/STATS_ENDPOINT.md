# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose key runtime metrics—total successful command invocations, uptime, and memory usage—enabling clients and operators to monitor service health and performance.

# Endpoint

## GET /stats

- Description: Retrieve current server metrics in JSON format.
- Response: HTTP 200 with JSON object:
  {
    "callCount": number,        // total number of successful POST /invoke calls since server start
    "uptime": number,           // seconds since server start (process.uptime())
    "memoryUsage": {            // values from process.memoryUsage()
      "rss": number,            // Resident Set Size in bytes
      "heapTotal": number,      // Total V8 heap size in bytes
      "heapUsed": number,       // Used V8 heap size in bytes
      "external": number        // External memory usage in bytes
    }
  }
- Behavior:
  • Read globalThis.callCount (initialized in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute uptime via process.uptime().
  • Gather memory statistics via process.memoryUsage().
  • Log the metrics object using logInfo before responding.

# Implementation

1. Ensure `globalThis.callCount` is initialized to 0 in `src/lib/main.js` if undefined.
2. In the POST /invoke handler (`sandbox/source/server.js`), after a successful command (digest, version, help), increment `globalThis.callCount`.
3. Add a new route in `sandbox/source/server.js`:
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
4. Ensure the endpoint is active when `process.env.NODE_ENV !== 'test'`.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).
- Stub `process.uptime()` to return a known value (e.g., 123.45).
- Stub `process.memoryUsage()` to return a predictable object.
- Send GET /stats via Supertest:
  • Assert status 200.
  • Assert response body fields match mocked values and types.
  • Spy on logInfo to verify it was called with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start the server via createServer(app) in Vitest hooks.
- Perform several POST /invoke calls to increment `callCount`.
- Send GET /stats:
  • Assert status 200.
  • Assert `callCount` is a number ≥ number of invoke calls.
  • Assert `uptime` is a positive number.
  • Assert each field in `memoryUsage` is a non-negative number.

# Documentation & README

1. **sandbox/docs/API.md**
   ### GET /stats
   - Description: Retrieve runtime metrics for monitoring.
   - Response example:
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
2. **sandbox/README.md**
   ## Statistics
   Retrieve server metrics:
   ```bash
   curl http://localhost:3000/stats
   ```
   ```js
   const res = await fetch('http://localhost:3000/stats');
   const stats = await res.json();
   console.log(stats);
   ```