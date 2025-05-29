# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose key runtime metrics for monitoring and observability. Clients can retrieve the total number of successful command invocations, server uptime, and detailed memory usage to assess service health and performance.

# Endpoint

## GET /stats
- Description: Retrieve current server metrics in JSON format.
- Response: HTTP 200 with JSON object:
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

1. Initialize a global counter in src/lib/main.js: ensure `globalThis.callCount` is defined (default 0).
2. In the POST /invoke handler in sandbox/source/server.js, after each successful invocation (digest, version, help), increment `globalThis.callCount` by 1.
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
4. Ensure this endpoint is available when `process.env.NODE_ENV !== 'test'` and uses existing logging utilities.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).
- Stub `process.uptime()` to return a known number (e.g., 123.45).
- Stub `process.memoryUsage()` to return a predictable object.
- Send GET `/stats` using Supertest:
  • Assert HTTP 200.
  • Assert response body matches mocked metrics and all fields are numbers.
  • Spy on `logInfo` to verify a log entry with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start the server via `createServer(app)` in Vitest hooks.
- Perform several POST `/invoke` calls to increment the counter.
- Call GET `/stats`:
  • Assert HTTP 200.
  • Assert `callCount` ≥ number of invoke calls.
  • Assert `uptime` is a positive number.
  • Assert each `memoryUsage` field is a non-negative number.

# Documentation

- **API Reference** (`sandbox/docs/API.md`):
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
- **README** (`sandbox/README.md`):
  Under "MCP HTTP API", add a **Statistics** subsection with:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  const stats = await res.json();
  console.log(stats);
  ```