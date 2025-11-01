# Objective
Provide a dedicated statistics endpoint on the MCP HTTP server to expose real-time runtime metrics—total successful POST /invoke calls, server uptime, and memory usage—to support monitoring and observability.

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

# Testing
## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock globalThis.callCount to a fixed value (e.g., 5).  
- Stub process.uptime() and process.memoryUsage() to return predictable values.  
- Send GET /stats via Supertest and assert:
  • Status 200.  
  • Response body matches mocked metrics and all fields are numbers.  
  • Spy on logInfo to verify one log entry with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.  
- Perform several POST /invoke calls to increment callCount.  
- Send GET /stats and assert:
  • Status 200.  
  • callCount ≥ number of invoke calls.  
  • uptime is a positive number.  
  • Each memoryUsage field is a non-negative number.

# Documentation
- **sandbox/docs/API.md**: Add under Endpoints:
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.  
  - Response example:
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
- **sandbox/README.md**: Under "MCP HTTP API", add a "Statistics" subsection with usage examples:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```