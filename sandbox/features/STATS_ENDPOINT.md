# Objective
Add a dedicated statistics endpoint to the MCP HTTP server in sandbox/source/server.js to expose real-time operational metrics for monitoring and observability.

# Endpoint
## GET /stats
- Description: Retrieve current server metrics in JSON format.
- Behavior:
  • Read globalThis.callCount (initialized in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute server uptime using process.uptime().
  • Gather memory usage statistics via process.memoryUsage().
  • Log the metrics object using logInfo before responding.
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

# Implementation Details
1. Ensure `globalThis.callCount` is initialized to 0 in `src/lib/main.js` if undefined.
2. In `sandbox/source/server.js`, increment `globalThis.callCount` by 1 after each successful invocation within POST /invoke handler.
3. Add:
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
4. Make endpoint available when `process.env.NODE_ENV !== 'test'` without altering existing routing order.

# Testing
## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount`, stub `process.uptime()` and `process.memoryUsage()` to fixed values.
- Send GET `/stats` with Supertest: assert HTTP 200, response body matches mocks, and numeric types.
- Spy on `logInfo` to verify a single log entry with serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via `createServer(app)`.
- Perform multiple POST `/invoke` calls to increment counter.
- GET `/stats`: assert HTTP 200, `callCount` ≥ number of invokes, `uptime` > 0, and `memoryUsage` fields ≥ 0.

# Documentation
- **sandbox/docs/API.md**:
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.
  - Example Response:
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
  Under "MCP HTTP API" add **Statistics** section:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```