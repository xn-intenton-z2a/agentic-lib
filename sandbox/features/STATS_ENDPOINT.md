# Objective
Provide a dedicated statistics endpoint on the MCP HTTP server to expose real-time runtime metrics—total successful invocation count, uptime, and memory usage—for monitoring and observability.

# Endpoint

## GET /stats
- Description: Retrieve current server metrics in JSON format.
- Behavior:
  • Read globalThis.callCount (initialized in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute uptime via process.uptime().
  • Gather memory usage from process.memoryUsage().
  • Use logInfo to log the metrics object before responding.
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

# Success Criteria & Requirements
1. Initialize globalThis.callCount = 0 in src/lib/main.js if undefined.
2. In sandbox/source/server.js, increment callCount in POST /invoke handler after successful commands.
3. Add a GET /stats route in sandbox/source/server.js that constructs and returns the metrics JSON.
4. Ensure the endpoint is available when NODE_ENV !== "test" and does not disrupt existing routes.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock globalThis.callCount, stub process.uptime() and process.memoryUsage() to return fixed values.
- Send a GET request to /stats using Supertest:
  • Assert HTTP 200.
  • Assert response body matches mocked metrics and field types are number.
  • Spy on logInfo to verify a single log entry with serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start the server via createServer(app) in Vitest hooks.
- Perform several POST /invoke calls to increment callCount.
- GET /stats:
  • Assert HTTP 200.
  • Assert callCount ≥ number of invokes.
  • Assert uptime is a positive number.
  • Assert each memoryUsage field is non-negative.

# Documentation

## sandbox/docs/API.md
Add under Endpoints:

### GET /stats
- Description: Retrieve runtime metrics for monitoring and observability.
- Response example:
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

## sandbox/README.md
Under "MCP HTTP API" add a "Statistics" subsection:
Retrieve server metrics:
```bash
curl http://localhost:3000/stats
```
```js
const res = await fetch('http://localhost:3000/stats');
console.log(await res.json());
```