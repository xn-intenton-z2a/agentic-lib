# Objective
Provide a dedicated real-time statistics endpoint on the MCP HTTP server to expose key runtime metrics—total successful command invocations, server uptime, and detailed memory usage—for monitoring and observability.

# GET /stats
- Description: Retrieve current server metrics in JSON format.
- Behavior:
  • Read globalThis.callCount (initialized to 0 in src/lib/main.js and incremented after each successful POST /invoke).
  • Compute uptime using process.uptime().
  • Gather memory statistics via process.memoryUsage().
  • Log the metrics object with logInfo before responding.
- Response: HTTP 200 with JSON
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
1. **Route Handler**: Add `app.get('/stats')` in sandbox/source/server.js that returns the metrics JSON and HTTP 200.
2. **Counter Increment**: Ensure `globalThis.callCount` is incremented for each successful invocation in POST /invoke.
3. **Logging**: Use existing `logInfo` to record a log entry containing the metrics.
4. **Compatibility**: Endpoint must be available when `NODE_ENV` is not "test" and not disrupt other handlers.

# Testing
- **Unit Tests** (sandbox/tests/server.unit.test.js):
  • Mock `globalThis.callCount`, `process.uptime()`, and `process.memoryUsage()` to fixed values.
  • Send GET /stats via Supertest, assert status 200 and exact JSON body matching mocks.
  • Spy on `logInfo` to verify a single log entry with the serialized metrics.
- **Integration Tests** (sandbox/tests/server.integration.test.js):
  • Start server via createServer(app), perform multiple POST /invoke to increase callCount.
  • GET /stats, assert status 200, `callCount` ≥ invoke count, `uptime` > 0, and memoryUsage fields ≥ 0.

# Documentation
- Update sandbox/docs/API.md: add a section under Endpoints:
  ### GET /stats
  - Description: Retrieve runtime metrics.
  - Response example with JSON structure.
- Update sandbox/README.md: under "MCP HTTP API", add a "Statistics" subsection with cURL and fetch examples for /stats.