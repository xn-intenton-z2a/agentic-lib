# Objective
Provide a dedicated statistics endpoint on the MCP HTTP server to expose real-time runtime metrics—total successful POST /invoke calls, server uptime, and memory usage—for monitoring and observability.

# Endpoint

## GET /stats
- Description: Retrieve current server metrics in JSON format.
- Behavior:
  • Read globalThis.callCount (initialized in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute uptime via process.uptime().
  • Gather memory usage via process.memoryUsage().
  • Use logInfo to log the metrics object before responding.
- Response: HTTP 200 with JSON object:
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
- Stub process.uptime() and process.memoryUsage() to return known values.
- Send GET /stats using Supertest:
  • Assert status 200.
  • Assert response body matches mocked metrics and field types are numbers.
  • Spy on logInfo to verify one log entry with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Perform several POST /invoke calls to increment callCount.
- GET /stats:
  • Assert status 200.
  • Assert callCount ≥ number of invoke calls.
  • Assert uptime is a positive number.
  • Assert each memoryUsage field is a non-negative number.

# Documentation & README

- **sandbox/docs/API.md**: Add under Endpoints:
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.
  - Response example with JSON schema.

- **sandbox/README.md**: Under "MCP HTTP API", add a "Statistics" subsection with:

  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```