 as mentioned in reply 
## Maintain Feature at 2025-05-25T00:47:31.095Z

Maintained feature .

Feature spec:



Git diff:

```diff

```

LLM API Usage:

```json

```
---

## Feature to Issue at 2025-05-25T00:48:34.240Z

Generated issue 1597 for feature "http-event-server" with URL https://github.com/xn-intenton-z2a/agentic-lib/issues/1597

title:

Implement HTTP event server with /events endpoint and --server CLI flag

And description:

We need to provide a lightweight HTTP server that wraps the existing `digestLambdaHandler` so users can run and test event-processing workflows locally without AWS infrastructure. This issue will add support for a `--server [port]` CLI flag, set up an Express app with a POST `/events` endpoint, and include unit tests and documentation.

Changes to Apply:

1. **src/lib/main.js**
   - Import `express`.
   - Create and export a `startEventServer(port: number)` function that:
     - Initializes an Express app.
     - Applies `express.json()` middleware.
     - Defines `POST /events`:
       - Parses the JSON body. If invalid or missing, log an error via `logError` and return HTTP 400.
       - Calls `createSQSEventFromDigest(payload)` and then `digestLambdaHandler(sqsEvent)`.
       - On success, return HTTP 200 with `{ batchItemFailures: [...] }`.
       - On handler rejection, log the error via `logError` and return HTTP 500.
   - In `main(args)`, before other flags, detect `--server [port]`:
     - Determine port from the next CLI argument or `EVENT_SERVER_PORT` env var (default 3000).
     - Invoke `startEventServer(port)` and return immediately.
   - Export the Express `app` instance for testing. 

2. **sandbox/tests/http-server.test.js**
   - Add a new test file using `supertest` and `vitest` covering:
     - **Success Path:** Mock `digestLambdaHandler` to resolve `{ batchItemFailures: [] }` and assert HTTP 200 and response body.
     - **Invalid JSON:** Send raw invalid JSON and assert HTTP 400.
     - **Handler Error:** Mock `digestLambdaHandler` to reject, then assert HTTP 500.

3. **sandbox/README.md**
   - Document the new `--server [port]` flag under Usage.
   - Describe the `POST /events` endpoint behavior (request payload, response format, error codes).
   - Provide example `curl` commands for sending events:
     ```bash
     curl -X POST http://localhost:3000/events \
       -H "Content-Type: application/json" \
       -d '{"key":"value"}'
     ```

Verification Steps:

- Run `npm test` to ensure all unit tests (including `http-server.test.js`) pass.
- Start the server locally: `npm start -- --server 3500` (or set `EVENT_SERVER_PORT=3500 npm start`).
- Send valid and invalid POST requests to `/events` and verify correct HTTP status codes and JSON responses.


LLM API Usage:

```json
{"prompt_tokens":7075,"completion_tokens":2250,"total_tokens":9325,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1600,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

