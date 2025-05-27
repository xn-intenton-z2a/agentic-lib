# Objective
Provide a real-time statistics endpoint on the MCP HTTP server to expose key runtime metrics for monitoring and observability. Clients can retrieve invocation counts, uptime, and memory usage to assess server health and performance.

# Endpoint

## GET /stats

- Description: Return current server metrics in JSON format.
- Response: HTTP 200 with JSON object:
  {
    "callCount": number,        // total number of POST /invoke calls since server start
    "uptime": number,           // seconds since server start (process.uptime())
    "memoryUsage": {            // values from process.memoryUsage()
      "rss": number,
      "heapTotal": number,
      "heapUsed": number,
      "external": number
    }
  }
- Behavior:
  • Increment a global callCount on each successful invocation of POST /invoke.
  • Compute uptime using process.uptime().
  • Gather memory usage via process.memoryUsage().
  • Log request and response with logInfo.

# Implementation

- Add route handler in `sandbox/source/server.js`:
  app.get('/stats', (req, res) => {
    // retrieve metrics, log, and send JSON response
  });
- Ensure `globalThis.callCount` is initialized in `src/lib/main.js` and incremented in POST /invoke handler.
- No external dependencies required beyond existing Express and Node APIs.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `globalThis.callCount`, `process.uptime()`, and `process.memoryUsage()` to return fixed values.
- Test GET /stats returns HTTP 200 and JSON body with expected keys and types.
- Validate numeric values match mocked return values.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start the server and call /stats without mocks.
- Assert HTTP 200 and that callCount is a number ≥ 0, uptime is positive, and memoryUsage fields are numbers.

# Documentation

- Update `sandbox/docs/API.md` under Endpoints to include GET /stats example:
  ```bash
  curl http://localhost:3000/stats
  ```
  with sample JSON response.
- Extend `sandbox/README.md` in the "MCP HTTP API" section to reference the new "Statistics" endpoint.
- Provide JavaScript `fetch` example demonstrating how to retrieve and parse metrics.
