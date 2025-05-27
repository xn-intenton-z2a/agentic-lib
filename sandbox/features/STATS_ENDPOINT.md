# Objective
Enhance the MCP HTTP server by implementing a real-time statistics endpoint that exposes key runtime metrics—total successful invocations, uptime, and memory usage—enabling clients to monitor service health and performance.

# GET /stats Endpoint
- Description: Return current server metrics in JSON format.
- Request: No parameters.
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
  • Read `globalThis.callCount` initialized in src/lib/main.js and incremented after each successful POST /invoke.
  • Compute uptime via `process.uptime()`.
  • Gather memory usage with `process.memoryUsage()`.
  • Log request and metrics with `logInfo`.

# Implementation
1. Initialize `globalThis.callCount = 0` in `src/lib/main.js` if undefined.
2. In `sandbox/source/server.js`, in the POST /invoke handler, after sending a successful response, increment `globalThis.callCount`.
3. Add a new route handler for GET /stats:
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
- Mock `globalThis.callCount` (e.g., set to 5), stub `process.uptime()` to a fixed value, and stub `process.memoryUsage()` to a predictable object.
- Use Supertest to GET /stats and assert:
  • Status is 200.
  • Response body fields match mocked values and types (numbers).
- Spy on `logInfo` to verify a single log entry with the expected JSON string.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via `createServer(app)` in Vitest hooks.
- Perform several POST /invoke calls to increment the counter.
- GET /stats and assert:
  • Status 200.
  • `callCount` ≥ number of invoke calls.
  • `uptime` is a positive number.
  • Each `memoryUsage` field is a non-negative number.

# Documentation
## sandbox/docs/API.md
Add under Endpoints:
### GET /stats
- Description: Retrieve real-time runtime metrics for monitoring.
- Response example:
```json
{
  "callCount": 10,
  "uptime": 123.45,
  "memoryUsage": {
    "rss": 15000000,
    "heapTotal": 5000000,
    "heapUsed": 3000000,
    "external": 200000
  }
}
```

## sandbox/README.md
In the "MCP HTTP API" section, add a "Statistics" subsection:
```bash
# Retrieve server metrics
curl http://localhost:3000/stats
```
```js
const res = await fetch('http://localhost:3000/stats');
console.log(await res.json());
```