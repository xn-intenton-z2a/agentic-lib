# Objective
Implement a GET /stats endpoint in sandbox/source/server.js to expose real-time server metrics, enabling clients to monitor MCP HTTP server performance and usage.

# Endpoint
## GET /stats
- Description: Retrieve current server runtime metrics in JSON format.
- Behavior:
  • Read total successful POST /invoke calls from globalThis.callCount.
  • Compute uptime using process.uptime().
  • Collect memory usage via process.memoryUsage().
  • Log metrics with logInfo.
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

# Implementation
1. Initialize globalThis.callCount = 0 in src/lib/main.js if undefined.
2. In POST /invoke handler (sandbox/source/server.js), after a successful command, increment globalThis.callCount.
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
4. Ensure endpoint is active when process.env.NODE_ENV !== 'test'.

# Testing
## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock globalThis.callCount, process.uptime, process.memoryUsage.
- Use Supertest to GET /stats; assert status 200, body matches mocked values, all fields are numbers.
- Spy on logInfo to confirm a single log entry with serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app).
- Perform several POST /invoke calls to increment callCount.
- GET /stats; assert status 200, callCount ≥ number of invokes, uptime > 0, memoryUsage fields ≥ 0.

# Documentation
1. sandbox/docs/API.md: add section under Endpoints for GET /stats with description and response example.
2. sandbox/README.md: under "MCP HTTP API" include "Statistics" subsection with cURL and fetch examples.