# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose key runtime metrics—total successful invocations, uptime, and memory usage—enabling clients and operators to monitor service health and performance.

# Endpoint

## GET /stats
- Description: Retrieve current server metrics in JSON format.
- Request: No parameters.
- Response: HTTP 200 with JSON object:
  {
    "callCount": number,        // total number of successful POST /invoke calls since server start
    "uptime": number,           // seconds since server start (process.uptime())
    "memoryUsage": {            // values from process.memoryUsage()
      "rss": number,            // Resident Set Size in bytes
      "heapTotal": number,      // Total V8 heap size in bytes
      "heapUsed": number,       // Used V8 heap size in bytes
      "external": number        // External memory usage in bytes
    }
  }
- Behavior:
  • Read globalThis.callCount (initialized in core library and incremented by each successful invocation)
  • Compute uptime via process.uptime()
  • Collect memory statistics via process.memoryUsage()
  • Log the metrics object with logInfo before responding

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock globalThis.callCount to a fixed value (e.g., 5)
- Stub process.uptime() to return a known number (e.g., 123.45)
- Stub process.memoryUsage() to return a predictable object
- Perform GET /stats via Supertest:
  • Assert HTTP 200
  • Assert response body fields match mocked values and are numbers
  • Spy on logInfo to verify it was called with the serialized metrics

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks
- Perform several POST /invoke calls to increment callCount
- Send GET /stats:
  • Assert HTTP 200
  • Assert callCount ≥ number of invoke calls
  • Assert uptime is a positive number
  • Assert each memoryUsage field is a non-negative number

# Documentation & README

- **sandbox/docs/API.md**: Add under Endpoints:
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring
  - Response example:
    {
      "callCount": 10,
      "uptime": 34.56,
      "memoryUsage": { "rss": 12345678, "heapTotal": 5000000, "heapUsed": 3000000, "external": 200000 }
    }

- **sandbox/README.md**: In the "MCP HTTP API" section add a "Statistics" subsection:
  Retrieve server metrics:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats')
  console.log(await res.json())
  ```