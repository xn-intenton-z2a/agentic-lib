# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose key runtime metrics—total successful POST /invoke calls, server uptime, and memory usage—for monitoring and observability.

# Endpoint: GET /stats
- Description: Retrieve current server metrics in JSON format.
- Request: None
- Behavior:
  • Read globalThis.callCount (initialized in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute uptime via process.uptime().
  • Gather memory usage using process.memoryUsage().
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

# Testing
## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock globalThis.callCount to a fixed value (e.g., 5).
- Stub process.uptime() and process.memoryUsage() to return predictable values.
- Send GET /stats via Supertest:
  • Assert status 200.
  • Assert response body matches mocked metrics and all fields are numbers.
  • Spy on logInfo to verify a single log entry with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Perform several POST /invoke calls to increment callCount.
- Send GET /stats:
  • Assert status 200.
  • Assert callCount ≥ number of invoke calls.
  • Assert uptime is a positive number.
  • Assert each memoryUsage field is a non-negative number.

# Documentation
- Update sandbox/docs/API.md under Endpoints:
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.
  - Example Response:
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
- Update sandbox/README.md under "MCP HTTP API" with a "Statistics" subsection:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```