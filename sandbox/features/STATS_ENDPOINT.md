# Objective

Add a dedicated statistics endpoint to the MCP server in sandbox/source/server.js, exposing real-time metrics such as total `/invoke` calls, server uptime, and memory usage to support observability.

# Endpoint

## GET /stats
- Description: Retrieve current runtime metrics in JSON format.
- Behavior:
  • Ensure globalThis.callCount is initialized (in src/lib/main.js) and incremented after each successful POST /invoke.
  • Compute uptime with process.uptime().
  • Gather memory usage via process.memoryUsage().
  • Log the metrics object with logInfo.
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

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock globalThis.callCount to a fixed value (e.g., 5).
- Stub process.uptime() to return a known number (e.g., 123.45).
- Stub process.memoryUsage() to return a predictable object.
- Use Supertest to GET /stats:
  • Assert status 200.
  • Assert body matches mocked metrics and all fields are numbers.
  • Spy on logInfo to verify one log entry with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Perform several POST /invoke calls to increment callCount.
- GET /stats:
  • Assert status 200.
  • Assert callCount ≥ number of invoke calls.
  • Assert uptime is a positive number.
  • Assert each memoryUsage field is non-negative.

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
      "heapTotal": 5000000,
      "heapUsed": 3000000,
      "external": 200000
    }
  }
  ```

## sandbox/README.md
In the "MCP HTTP API" section, add a "Statistics" subsection:

Retrieve server metrics:
```bash
curl http://localhost:3000/stats
```
```js
const res = await fetch('http://localhost:3000/stats');
console.log(await res.json());
```