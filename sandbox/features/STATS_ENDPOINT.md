# Objective
Enhance the MCP HTTP server with a dedicated statistics endpoint that provides real-time runtime metrics for monitoring and observability. Clients can retrieve total successful invocations of POST /invoke, server uptime, and detailed memory usage.

# Endpoint

## GET /stats
- Description: Return current server metrics in JSON format.
- Behavior:
  • Read globalThis.callCount (initialized to 0 in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute uptime using process.uptime().
  • Gather memory usage via process.memoryUsage().
  • Log the metrics object using logInfo before responding.
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
- Stub process.uptime() and process.memoryUsage() to return known values.
- Use Supertest to GET /stats:
  • Assert HTTP 200.
  • Assert response body matches mocked metrics and field types are numbers.
  • Spy on logInfo to verify it logs the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Perform several POST /invoke calls to increment the counter.
- GET /stats:
  • Assert HTTP 200.
  • Assert callCount ≥ number of invoke calls.
  • Assert uptime is a positive number.
  • Assert each memoryUsage field is non-negative.

# Documentation & README

- **sandbox/docs/API.md**: Add under Endpoints:
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.
  - Response example with JSON schema.

- **sandbox/README.md**: Under "MCP HTTP API", add a "Statistics" subsection:

  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```