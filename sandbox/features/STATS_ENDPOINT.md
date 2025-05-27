# Objective
Provide a statistics endpoint on the MCP server to expose runtime metrics such as invocation count and uptime, helping clients monitor server performance and usage.

# Endpoint

## GET /stats
- Description: Retrieve current server metrics.
- Response: HTTP 200 with JSON object containing:
  {
    "callCount": number,        // number of commands invoked since start
    "uptime": string,           // ISO 8601 duration or seconds since start
    "memoryUsage": {
      "rss": number,            // Resident Set Size in bytes
      "heapTotal": number,      // Total V8 heap size in bytes
      "heapUsed": number,       // Used V8 heap size in bytes
      "external": number        // External memory usage in bytes
    }
  }

# Success Criteria & Requirements

- Add a new route handler in sandbox/source/server.js for GET /stats.
- Read globalThis.callCount and process.uptime() to compute metrics.
- Use process.memoryUsage() for memory statistics.
- Respond with a valid JSON object and HTTP 200 status.
- Log each /stats request via logInfo.

# Testing

- Unit Tests (server.unit.test.js):
  • Mock globalThis.callCount and process.uptime, stub process.memoryUsage return value.
  • Verify GET /stats returns 200 and correct JSON fields and types.

- Integration Tests (server.integration.test.js):
  • Start server and call /stats endpoint without mocks.
  • Assert HTTP 200 and that response contains numeric fields and non-negative values.

# Documentation

- Update sandbox/docs/API.md to include GET /stats under Endpoints.
- Provide cURL and JavaScript fetch examples for /stats.
- Update sandbox/README.md to reference the new "Statistics" section under MCP HTTP API.
