# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose key runtime metrics—total successful invocations, uptime, and memory usage—enabling clients and operators to monitor service health and performance.

# Endpoint

## GET /stats
- Description: Retrieve current server runtime metrics in JSON format.
- Behavior:
  • Read globalThis.callCount for total successful POST /invoke calls since server start.
  • Compute uptime via process.uptime() (seconds since start).
  • Gather memory usage via process.memoryUsage().
  • Log metrics using logInfo.
  • Respond HTTP 200 with JSON:
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
1. Initialize globalThis.callCount to 0 in src/lib/main.js if undefined.
2. In sandbox/source/server.js, after each successful POST /invoke, increment globalThis.callCount by 1.
3. Add a route handler for GET /stats following existing Express conventions.
4. Logging: call logInfo with a JSON string of the metrics object.
5. Endpoint available when process.env.NODE_ENV !== 'test'.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock globalThis.callCount to a fixed value and stub process.uptime() and process.memoryUsage().
- Use Supertest to send GET /stats and assert:
  • HTTP 200
  • Response body matches mocked metrics and numeric types.
- Spy on logInfo to verify a single log entry with expected JSON string.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start the server via createServer(app) in Vitest hooks.
- Perform several POST /invoke calls to increment callCount.
- Send GET /stats and assert:
  • HTTP 200
  • callCount ≥ number of invoke calls
  • uptime is a positive number
  • memoryUsage fields are non-negative numbers