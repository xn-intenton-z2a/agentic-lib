# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose actionable runtime metrics—total successful POST /invoke calls, server uptime, and memory usage—for monitoring and observability.

# Endpoint
## GET /stats
- Description: Retrieve current server metrics in JSON format.
- Behavior:
  • Read globalThis.callCount (initialized in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute uptime via process.uptime().
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

# Success Criteria & Requirements
1. Initialize globalThis.callCount = 0 in src/lib/main.js if undefined.
2. In sandbox/source/server.js, increment callCount in the POST /invoke handler after each successful command (digest, version, help).
3. Add GET /stats route in sandbox/source/server.js that constructs and returns the metrics JSON.
4. Ensure the endpoint is available when NODE_ENV !== 'test' and does not disrupt existing routes.

# Testing
## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock globalThis.callCount to a fixed value (e.g., 5).
- Stub process.uptime() and process.memoryUsage() to return predictable values.
- Send GET /stats via Supertest:
  • Assert status 200.
  • Assert response body matches mocked metrics and types.
  • Spy on logInfo to verify a single log entry with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Perform several POST /invoke calls to increment counter.
- GET /stats:
  • Assert status 200.
  • Assert callCount ≥ number of invoke calls.
  • Assert uptime is positive.
  • Assert memoryUsage fields non-negative.

# Documentation
- **sandbox/docs/API.md** under Endpoints:
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.
  - Example response JSON.
- **sandbox/README.md** under "MCP HTTP API" add **Statistics**:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```