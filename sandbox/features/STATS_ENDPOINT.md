# Objective
Enhance the MCP HTTP server with a real-time statistics endpoint that reports key runtime metrics. Clients can monitor service usage and health by retrieving total successful invocations, uptime, and memory usage.

# Endpoint

## GET /stats
- Description: Return current server metrics in JSON format.
- Behavior:
  • Read globalThis.callCount (initialized in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute uptime via process.uptime().
  • Gather memory usage via process.memoryUsage().
  • Log the metrics using logInfo.
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
1. In src/lib/main.js ensure `globalThis.callCount` is initialized to 0 if undefined.
2. In sandbox/source/server.js, increment `globalThis.callCount` after each successful command in POST /invoke handler.
3. Add route handler:
   app.get('/stats', (req, res) => {
     const metrics = {
       callCount: globalThis.callCount,
       uptime: process.uptime(),
       memoryUsage: process.memoryUsage()
     };
     logInfo(`Stats requested: ${JSON.stringify(metrics)}`);
     res.status(200).json(metrics);
   });

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount`, stub `process.uptime()` and `process.memoryUsage()`.
- GET /stats returns HTTP 200 with the mocked metrics and logs via logInfo.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app).
- Perform several POST /invoke calls to increment callCount.
- GET /stats asserts status 200, callCount ≥ invoke calls, uptime > 0, memory usage fields ≥ 0.

# Documentation

- Update sandbox/docs/API.md under Endpoints:

  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.
  - Response example:
    {
      "callCount": 5,
      "uptime": 120.5,
      "memoryUsage": { "rss": 15000000, "heapTotal": 5000000, "heapUsed": 3000000, "external": 200000 }
    }

- Update sandbox/README.md under "MCP HTTP API":

  ## Statistics
  Retrieve server metrics:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```