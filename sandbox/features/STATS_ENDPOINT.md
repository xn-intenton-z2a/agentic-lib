# Objective
Enhance the existing MCP HTTP server by implementing the real-time statistics endpoint in sandbox/source/server.js, providing operational metrics such as the total number of successful invocations, uptime, and memory usage. This feature enables monitoring and observability of the MCP server.

# Endpoint: GET /stats
- Description: Retrieve current server runtime metrics in JSON format.
- Behavior:
  • Read `globalThis.callCount` for the total count of successful POST /invoke calls since server start.
  • Compute current uptime using `process.uptime()`.
  • Gather memory usage details via `process.memoryUsage()`.
  • Log the metrics object using `logInfo`.
  • Respond with HTTP 200 and JSON:
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
1. Initialize `globalThis.callCount` to 0 in `src/lib/main.js` if undefined.
2. In the POST /invoke handler in `sandbox/source/server.js`, after responding with a successful result (commands: digest, version, help), increment `globalThis.callCount` by 1.
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
4. Ensure the endpoint is available when `process.env.NODE_ENV !== 'test'`.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).
- Stub `process.uptime()` to return a known value (e.g., 123.45).
- Stub `process.memoryUsage()` to return a predictable object (with numeric fields).
- Send GET `/stats` using Supertest:
  • Assert status 200.
  • Assert response body matches the mocked metrics object and numeric types.
  • Spy on `logInfo` to verify it was called once with the correct JSON string of metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server with `createServer(app)` in Vitest hooks.
- Perform several POST `/invoke` calls to increment the counter.
- Send GET `/stats`:
  • Assert status 200.
  • Assert `callCount` is a number ≥ number of invoke calls.
  • Assert `uptime` is a positive number.
  • Assert each field in `memoryUsage` is a non-negative number.

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
    "rss": 12345678,
    "heapTotal": 4567890,
    "heapUsed": 2345678,
    "external": 123456
  }
}
```

## sandbox/README.md
Under “MCP HTTP API”, add a subsection “Statistics”:

Retrieve server metrics:

```bash
curl http://localhost:3000/stats
```

```js
const res = await fetch('http://localhost:3000/stats');
console.log(await res.json());
```

# Verification & Acceptance
- Run `npm test` to confirm all existing and new tests pass.
- Ensure coverage report for `sandbox/source/server.js` shows ≥ 90% coverage.
- Manual smoke tests:
  1. Invoke POST `/invoke` two times.
  2. Call GET `/stats` and confirm `callCount` increased by two and metrics are valid.
