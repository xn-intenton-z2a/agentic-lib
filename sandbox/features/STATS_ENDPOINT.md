# Objective
Provide a real-time statistics endpoint on the MCP server to expose actionable runtime metrics—total successful invocations, uptime, and memory usage—for monitoring and observability.

# GET /stats
- Description: Retrieve current server metrics in JSON format.
- Behavior:
  • Read globalThis.callCount (initialized in core library and incremented after each successful POST /invoke).  
  • Compute uptime using process.uptime().  
  • Gather memory statistics via process.memoryUsage().  
  • Log the metrics object with logInfo before responding.
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

# Implementation
1. Initialize `globalThis.callCount = 0` in `src/lib/main.js` if undefined.  
2. In the POST /invoke handler (`sandbox/source/server.js`), after successful commands (`digest`, `version`, `help`), increment `globalThis.callCount`.  
3. Add `app.get('/stats', handler)` in `sandbox/source/server.js` that builds and returns metrics JSON.  
4. Ensure the endpoint is available when `process.env.NODE_ENV !== 'test'` and does not affect existing routes.

# Testing
## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `globalThis.callCount` to a fixed value (e.g., 5).  
- Stub `process.uptime()` and `process.memoryUsage()` to known values.  
- Use Supertest to GET `/stats`:  
  • Assert HTTP 200 and JSON body matches mocks.  
  • Spy on `logInfo` to verify one log call with the serialized metrics.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via `createServer(app)` in Vitest hooks.  
- Perform several POST `/invoke` calls to increment counter.  
- GET `/stats`:  
  • Assert HTTP 200.  
  • `callCount` ≥ number of invokes.  
  • `uptime` is positive.  
  • Each memory usage field is a non-negative number.

# Documentation
- **sandbox/docs/API.md**: Add under Endpoints:
  ### GET /stats
  - Description and response example with JSON schema.  
- **sandbox/README.md**: Under "MCP HTTP API", add a "Statistics" subsection with cURL and JavaScript `fetch` examples for `/stats`.