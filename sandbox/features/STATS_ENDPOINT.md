# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose key runtime metrics for monitoring and observability. Clients can retrieve total invocation count, uptime, and detailed memory usage to assess service health and performance in production or sandbox.

# Endpoint

## GET /stats
- Description: Return current server metrics in JSON format.
- Response: HTTP 200 with JSON:
  {
    "callCount": number,        // total number of POST /invoke calls since server start
    "uptime": number,           // seconds since server start (process.uptime())
    "memoryUsage": {            // values from process.memoryUsage()
      "rss": number,
      "heapTotal": number,
      "heapUsed": number,
      "external": number
    }
  }
- Behavior:
  • Increment a globalThis.callCount on each successful POST /invoke
  • Compute uptime via process.uptime()
  • Gather memory usage via process.memoryUsage()
  • Log each /stats request and the returned metrics with logInfo

# Implementation

1. **Global Counter**: Ensure `globalThis.callCount` is initialized in `src/lib/main.js` and incremented at the end of each successful POST /invoke handler in `sandbox/source/server.js`.
2. **Route Handler**: In `sandbox/source/server.js`, add handler:

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
3. **Startup**: No changes to listening logic; `/stats` is available when server is running and not in test mode.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `globalThis.callCount` to a fixed value and `process.uptime()` to return a known number.
- Stub `process.memoryUsage()` to return a predictable object.
- Test GET `/stats` returns HTTP 200 and JSON body with matching mocked values and correct numeric types.
- Verify `logInfo` is called with the expected metrics string.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start the server via `createServer(app)` in Vitest hooks.
- Perform GET `/stats` without mocks:
  • Assert status 200
  • Assert `callCount` is a number ≥ 0
  • Assert `uptime` is a positive number
  • Assert `memoryUsage` fields (`rss`, `heapTotal`, `heapUsed`, `external`) are numbers ≥ 0

# Documentation

1. **API Reference**: Update `sandbox/docs/API.md` under Endpoints:
   ```markdown
   ### GET /stats
   - Description: Retrieve runtime metrics
   - Response:
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
2. **README**: In `sandbox/README.md`, add a "Statistics" section under "MCP HTTP API":
   - Brief description of `/stats`
   - cURL example:
     ```bash
     curl http://localhost:3000/stats
     ```
   - JavaScript `fetch` example:
     ```js
     const res = await fetch('http://localhost:3000/stats');
     const stats = await res.json();
     console.log(stats);
     ```