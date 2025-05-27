# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose key runtime metrics for monitoring and observability. Clients can retrieve the total number of successful command invocations, server uptime, and detailed memory usage to assess health and performance.

# Endpoint: GET /stats
- Description: Retrieve current server runtime metrics in JSON format.
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

# Implementation
1. Initialize `globalThis.callCount` in `src/lib/main.js` (if undefined) to 0 to support test mocks.
2. In the POST /invoke handler (`sandbox/source/server.js`), after a successful command invocation (digest, version, or help), increment `globalThis.callCount`.
3. Add a new route handler in `sandbox/source/server.js`:
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
4. Ensure this endpoint is available when `process.env.NODE_ENV !== 'test'` and does not affect existing routes.

# Testing
## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `globalThis.callCount` to a fixed value (e.g., 5) and stub `process.uptime()` and `process.memoryUsage()` to return known values.
- Use Supertest to send GET `/stats`:
  • Assert HTTP 200.
  • Assert response fields match mocked metrics and are of type number.
- Spy on `logInfo` to verify it logs the metrics object exactly once.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start the server via `createServer(app)` in Vitest hooks.
- Perform multiple POST `/invoke` calls to increment `callCount`.
- Send GET `/stats`:
  • Assert HTTP 200.
  • Assert `callCount` is a number at least equal to the number of invoke calls.
  • Assert `uptime` is a positive number.
  • Assert each memoryUsage field (`rss`, `heapTotal`, `heapUsed`, `external`) is a non-negative number.

# Documentation
## `sandbox/docs/API.md`
Add under Endpoints:

### GET /stats
- Description: Retrieve real-time server metrics for monitoring.
- Response Example:
  ```json
  {
    "callCount": 10,
    "uptime": 34.56,
    "memoryUsage": {
      "rss": 12345678,
      "heapTotal": 4567890,
      "heapUsed": 2345678,
      "external": 123456
    }
  }
  ```

## `sandbox/README.md`
Under **MCP HTTP API**, add a **Statistics** subsection:

Retrieve server metrics:
```bash
curl http://localhost:3000/stats
```

```js
const res = await fetch('http://localhost:3000/stats');
const stats = await res.json();
console.log(stats);
```