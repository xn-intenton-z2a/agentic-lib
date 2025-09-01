# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose actionable runtime metrics—total successful command invocations, uptime, and memory usage—for monitoring and observability.

# Endpoint: GET /stats
- Description: Retrieve current server metrics in JSON format.
- Behavior:
  • Read globalThis.callCount (initialized in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute uptime via process.uptime().
  • Gather memory statistics via process.memoryUsage().
  • Log the metrics object using logInfo before responding.
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
1. Ensure `globalThis.callCount` is initialized to 0 in src/lib/main.js if undefined.
2. In the POST /invoke handler in sandbox/source/server.js, after successfully handling digest, version, or help commands, increment `globalThis.callCount` by 1.
3. Add a new route handler in sandbox/source/server.js:
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
4. Ensure this endpoint is available when `process.env.NODE_ENV !== 'test'` and does not disrupt existing routes.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).
- Stub `process.uptime()` to return a known number (e.g., 123.45).
- Stub `process.memoryUsage()` to return a predictable object.
- Send GET /stats using Supertest:
  • Assert HTTP 200.
  • Assert response body matches mocked metrics and numeric types.
  • Spy on `logInfo` to verify it was called with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest async hooks.
- Perform several POST /invoke calls to increment the counter.
- Send GET /stats:
  • Assert HTTP 200.
  • Assert `callCount` is a number ≥ number of invoke calls.
  • Assert `uptime` is positive.
  • Assert each `memoryUsage` field (`rss`,`heapTotal`,`heapUsed`,`external`) is a non-negative number.

# Documentation

## sandbox/docs/API.md
Add under Endpoints:

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

## sandbox/README.md
Under "MCP HTTP API", add a "Statistics" subsection:

Retrieve server metrics:
```bash
curl http://localhost:3000/stats
```
```js
const res = await fetch('http://localhost:3000/stats');
console.log(await res.json());
```