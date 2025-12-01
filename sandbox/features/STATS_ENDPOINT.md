# Objective
Implement the GET /stats endpoint on the MCP HTTP server in sandbox/source/server.js to expose real-time server metrics for monitoring and observability.

# Endpoint

## GET /stats
- Description: Retrieve current server metrics in JSON format.
- Behavior:
  • Read globalThis.callCount (initialized to 0 in src/lib/main.js and incremented after each successful POST /invoke).  
  • Compute uptime using process.uptime().  
  • Gather memory usage via process.memoryUsage().  
  • Log the metrics object with logInfo before responding.
- Response: HTTP 200 with JSON:
  {
    "callCount": number,       // total successful POST /invoke calls
    "uptime": number,          // seconds since server start
    "memoryUsage": {           // values from process.memoryUsage()
      "rss": number,
      "heapTotal": number,
      "heapUsed": number,
      "external": number
    }
  }

# Implementation
1. Ensure `globalThis.callCount` is initialized to 0 in `src/lib/main.js` if undefined.
2. In the POST /invoke handler in sandbox/source/server.js, after responding successfully, increment `globalThis.callCount` by 1.
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
4. Ensure the endpoint is active when `process.env.NODE_ENV !== 'test'` and does not interfere with other routes.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).
- Stub `process.uptime()` to return a known number (e.g., 123.45).
- Stub `process.memoryUsage()` to return a predictable object.
- Send GET /stats using Supertest:
  • Assert status 200.
  • Assert response body matches mocked metrics and fields are numbers.
  • Spy on `logInfo` to verify a single log entry with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via `createServer(app)` in Vitest hooks.
- Perform several POST /invoke calls to increment the counter.
- Send GET /stats:
  • Assert status 200.
  • Assert `callCount` >= number of invoke calls.
  • Assert `uptime` is positive.
  • Assert each `memoryUsage` field is non-negative.

# Documentation

1. **sandbox/docs/API.md** under Endpoints:
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
2. **sandbox/README.md** in "MCP HTTP API" section:
   ## Statistics
   Retrieve server metrics:
   ```bash
   curl http://localhost:3000/stats
   ```
   ```js
   const res = await fetch('http://localhost:3000/stats');
   console.log(await res.json());
   ```