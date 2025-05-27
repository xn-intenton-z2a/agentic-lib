# Objective
Enhance the MCP HTTP server with a real-time statistics endpoint to expose key runtime metrics for monitoring, observability, and usage tracking. Clients and operators can retrieve total invocation count, uptime, and detailed memory usage to assess service health and performance.

# Endpoint

## GET /stats

- Description: Retrieve current server metrics in JSON format.
- Request: No parameters.
- Response: HTTP 200 with JSON object:

  {
    "callCount": number,      // total POST /invoke calls since server start
    "uptime": number,         // seconds since server start (process.uptime())
    "memoryUsage": {          // values from process.memoryUsage()
      "rss": number,
      "heapTotal": number,
      "heapUsed": number,
      "external": number
    }
  }

- Behavior:
  • Increment globalThis.callCount each time a POST /invoke request succeeds (status 200).
  • Compute uptime via process.uptime().
  • Gather memory usage using process.memoryUsage().
  • Log request and returned metrics using logInfo.

# Success Criteria & Requirements

1. Global counter initialization:
   - Ensure `globalThis.callCount` is defined (in `src/lib/main.js`) before server start.
2. POST /invoke adjustment:
   - After a successful invocation of any supported command, increment `globalThis.callCount`.
3. New route in `sandbox/source/server.js`:
   - Add `app.get('/stats', handler)` following existing Express conventions.
   - Respond with the metrics structure and HTTP 200.
4. Logging:
   - Use existing `logInfo` utility to log the metrics object each time `/stats` is called.
5. Compatibility:
   - Endpoint available when `process.env.NODE_ENV !== 'test'` and does not break existing handlers.

# Implementation Details

- Modify `sandbox/source/server.js`:
  1. At module load time, ensure `globalThis.callCount` is set (if undefined) to 0.
  2. In the POST /invoke handler, after sending a successful response, increment `globalThis.callCount`.
  3. Insert a new route:
     ```js
     app.get('/stats', (req, res) => {
       const metrics = {
         callCount: globalThis.callCount,
         uptime: process.uptime(),
         memoryUsage: process.memoryUsage()
       };
       logInfo(`Stats requested: ${JSON.stringify(metrics)}`);
       res.status(200).json(metrics);
     });
     ```

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `globalThis.callCount`, `process.uptime()`, and `process.memoryUsage()` to fixed values.
- Test GET /stats:
  • Returns HTTP 200.
  • Body matches the mocked metrics and types (number fields).
- Verify that `logInfo` is called once with the correct JSON string.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start the server via `createServer(app)`.
- Perform GET /stats without mocks:
  • Assert status 200.
  • Assert `callCount` is a number ≥ 0.
  • Assert `uptime` is a positive number.
  • Assert each `memoryUsage` field (`rss`, `heapTotal`, `heapUsed`, `external`) is a non-negative number.

# Documentation & Examples

- **API Reference** (`sandbox/docs/API.md`):
  ```markdown
  ### GET /stats
  - Description: Retrieve runtime metrics for monitoring.
  - Response:
    ```json
    {
      "callCount": 42,
      "uptime": 123.45,
      "memoryUsage": {
        "rss": 15000000,
        "heapTotal": 5000000,
        "heapUsed": 3000000,
        "external": 200000
      }
    }
    ```

- **README** (`sandbox/README.md`) additions:
  ## Statistics Endpoint
  Retrieve real-time server metrics:

  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  const stats = await res.json();
  console.log(stats);
  ```

# Verification & Acceptance

- Run `npm test`; all existing and new tests pass.
- Coverage report for `sandbox/source/server.js` ≥ 90%.
- Manual smoke tests:
  1. Perform several POST /invoke calls.
  2. Call GET /stats and verify `callCount` increments accordingly.
  3. Confirm JSON structure and log entries.
