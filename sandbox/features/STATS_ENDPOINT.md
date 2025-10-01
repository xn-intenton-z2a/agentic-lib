# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose key runtime metrics—total successful command invocations, uptime, and memory usage—enabling clients and operators to monitor service health and performance.

# Endpoint: GET /stats
- Description: Retrieve current server metrics in JSON format.
- Behavior:
  • Read `globalThis.callCount` (initialized in `src/lib/main.js` and incremented after each successful `/invoke`).
  • Compute `uptime` via `process.uptime()`.
  • Gather memory usage with `process.memoryUsage()`.
  • Log the metrics object using `logInfo` before responding.
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

# Testing
## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).
- Stub `process.uptime()` to return a known number (e.g., 123.45).
- Stub `process.memoryUsage()` to return a predictable object.
- Send GET `/stats` via Supertest:
  • Assert HTTP 200.
  • Assert response body matches mocked metrics and all fields are numbers.
  • Spy on `logInfo` to verify a log entry with the serialized metrics.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start server via `createServer(app)` in Vitest hooks.
- Perform several POST `/invoke` calls to increment `callCount`.
- Send GET `/stats`:
  • Assert HTTP 200.
  • Assert `callCount` ≥ number of invoke calls.
  • Assert `uptime` is a positive number.
  • Assert each `memoryUsage` field is a non-negative number.

# Documentation
## `sandbox/docs/API.md`
Add under Endpoints:
### GET /stats
- Description: Retrieve runtime metrics for monitoring.
- Response example:
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

## `sandbox/README.md`
Under **MCP HTTP API**, add a **Statistics** subsection:
Retrieve server metrics:
```bash
curl http://localhost:3000/stats
```
```js
const res = await fetch('http://localhost:3000/stats');
console.log(await res.json());
```