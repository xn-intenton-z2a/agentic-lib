# Objective
Enhance the existing MCP HTTP server by fully implementing and stabilizing the /stats endpoint to provide real-time runtime metrics, including invocation counts, uptime, and memory usage, supporting observability and operational monitoring.

# Endpoint

## GET /stats
- Description: Retrieve current server metrics in JSON format.
- Request: No query parameters.
- Response: HTTP 200 with JSON object:
  {
    "callCount": number,       // total number of successful POST /invoke calls since server start
    "uptime": number,          // seconds since server start (process.uptime())
    "memoryUsage": {
      "rss": number,           // Resident Set Size in bytes
      "heapTotal": number,     // total V8 heap size in bytes
      "heapUsed": number,      // used V8 heap size in bytes
      "external": number       // external memory usage in bytes
    }
  }

# Success Criteria & Requirements

1. **Global Counter**: Ensure `globalThis.callCount` is initialized to 0 in `src/lib/main.js` and increment after each successful POST /invoke in `sandbox/source/server.js`.
2. **Route Handler**: Add `app.get('/stats', handler)` in `sandbox/source/server.js` that:
   - Reads `globalThis.callCount`.
   - Calls `process.uptime()`.
   - Calls `process.memoryUsage()`.
   - Uses `logInfo` to log the metrics.
   - Returns HTTP 200 with the metrics JSON.
3. **Error-Free**: Handler should not throw; any unexpected condition returns HTTP 500.
4. **Non-Test Mode**: Endpoint must be available when `process.env.NODE_ENV !== 'test'`.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `globalThis.callCount` (e.g., set to 5).
- Stub `process.uptime()` to return a known value (e.g., 123.45).
- Stub `process.memoryUsage()` to return a predictable object.
- Call GET `/stats`:
  - Assert status 200.
  - Assert body fields match mocked values and are numbers.
  - Spy on `logInfo` to verify a single log entry with correct JSON string of metrics.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start server via `createServer(app)` in Vitest hooks.
- Perform several POST `/invoke` calls to increment `callCount`.
- Call GET `/stats` without mocks:
  - Assert status 200.
  - Assert `callCount` is a number ≥ number of invoke calls.
  - Assert `uptime` is positive.
  - Assert memoryUsage fields are non-negative numbers.

# Documentation & README

1. **API Reference** (`sandbox/docs/API.md`):
   - Add under Endpoints:
     ### GET /stats
     - Description: Retrieve runtime metrics.
     - Response example:
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
2. **README** (`sandbox/README.md`):
   - Under "MCP HTTP API", add a "Statistics" section with:
     ```bash
     curl http://localhost:3000/stats
     ```
     ```js
     const res = await fetch('http://localhost:3000/stats');
     const stats = await res.json();
     console.log(stats);
     ```