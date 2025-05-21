# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
## Maintain Feature at 2025-05-21T23:53:05.788Z

Maintained feature HTTP_INTERFACE.

Feature spec:

# Objective & Scope

Provide a built-in HTTP interface that allows external systems (for example, CI pipelines or webhook providers) to invoke core agentic-lib functionality via REST endpoints. This feature leverages the existing Express dependency without introducing new files beyond source, test, README, and package.json, and it remains fully compatible with GitHub Actions workflows.

# Value Proposition

- Enables easy integration with third-party tools by issuing HTTP requests instead of CLI calls
- Simplifies local testing and debugging through a listen-and-serve model
- Supports health checks and secure webhook ingestion for automated pipelines

# API Endpoints

## GET /health

Returns a JSON object indicating service health and uptime. Useful for readiness and liveness probes in containerized environments.

## POST /digest

Accepts a JSON payload matching the existing digest schema. Internally calls createSQSEventFromDigest and digestLambdaHandler, returning batchItemFailures and handler info.

## POST /webhook

Receives arbitrary JSON (e.g., GitHub webhook payload), logs the payload, and responds with a 200 status. Provides an extensibility point for future event handling or routing logic.

# Success Criteria & Requirements

- Service starts when invoked with a new CLI flag --serve or --http
- Endpoints respond with appropriate HTTP status codes and JSON payloads
- Integration tests using supertest validate each endpoint under normal and error conditions
- No changes outside main source, test suite, README, or package.json

# Verification & Acceptance

- Unit tests cover handler logic via supertest against the live Express app
- README updated with usage instructions for HTTP mode, including example curl commands
- package.json scripts updated (for example, "start:http": "node src/lib/main.js --serve")


Git diff:

```diff
\n\n// New [sandbox/features/HTTP_INTERFACE.md]:\n# Objective & Scope

Provide a built-in HTTP interface that allows external systems (for example, CI pipelines or webhook providers) to invoke core agentic-lib functionality via REST endpoints. This feature leverages the existing Express dependency without introducing new files beyond source, test, README, and package.json, and it remains fully compatible with GitHub Actions workflows.

# Value Proposition

- Enables easy integration with third-party tools by issuing HTTP requests instead of CLI calls
- Simplifies local testing and debugging through a listen-and-serve model
- Supports health checks and secure webhook ingestion for automated pipelines

# API Endpoints

## GET /health

Returns a JSON object indicating service health and uptime. Useful for readiness and liveness probes in containerized environments.

## POST /digest

Accepts a JSON payload matching the existing digest schema. Internally calls createSQSEventFromDigest and digestLambdaHandler, returning batchItemFailures and handler info.

## POST /webhook

Receives arbitrary JSON (e.g., GitHub webhook payload), logs the payload, and responds with a 200 status. Provides an extensibility point for future event handling or routing logic.

# Success Criteria & Requirements

- Service starts when invoked with a new CLI flag --serve or --http
- Endpoints respond with appropriate HTTP status codes and JSON payloads
- Integration tests using supertest validate each endpoint under normal and error conditions
- No changes outside main source, test suite, README, or package.json

# Verification & Acceptance

- Unit tests cover handler logic via supertest against the live Express app
- README updated with usage instructions for HTTP mode, including example curl commands
- package.json scripts updated (for example, "start:http": "node src/lib/main.js --serve")
```

LLM API Usage:

```json
{"prompt_tokens":6158,"completion_tokens":1194,"total_tokens":7352,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":768,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-21T23:54:14.512Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1560 with title:

Implement HTTP interface with Express for health, digest, and webhook endpoints

And description:

**Objective**

Extend the existing CLI (`src/lib/main.js`) to provide a built-in HTTP interface when invoked with `--serve` or `--http`, exposing three REST endpoints:

1. **GET /health**
   - Returns `{ status: 'ok', uptime: <seconds> }` with HTTP 200.

2. **POST /digest**
   - Accepts a JSON payload matching the current digest schema.
   - Internally calls `createSQSEventFromDigest(payload)` and `digestLambdaHandler(event)`.
   - Returns the JSON response from `digestLambdaHandler` (including `batchItemFailures` and handler info) with HTTP 200.

3. **POST /webhook**
   - Accepts any JSON payload.
   - Logs the payload using `logInfo` and responds with `{ status: 'received' }`, HTTP 200.

**Scope of Changes**
- **src/lib/main.js**
  - Import and initialize an Express app.
  - Add a `serveHttp()` function that:
    - Detects `--serve` or `--http` in `process.argv`.
    - Registers the three routes above.
    - Listens on `process.env.PORT || 3000`.
    - Exits the process only on fatal Express errors.
  - Call `serveHttp()` early in `main()` and bypass CLI-only logic when serving.

- **package.json**
  - Add a new npm script:
    ```json
    "start:http": "node src/lib/main.js --serve"
    ```

- **tests/unit/http-interface.test.js**
  - Add integration tests using `supertest` against the live Express app:
    - **GET /health**: status 200 and JSON shape `{ status: 'ok', uptime: number }`.
    - **POST /digest**:
      - Valid payload: returns 200 and JSON with `batchItemFailures: []` and correct `handler` field.
      - Invalid payload (malformed JSON): returns 400 with error message.
    - **POST /webhook**: returns 200 and `{ status: 'received' }`.

- **sandbox/README.md**
  - Document HTTP mode:
    - How to start the server (`npm run start:http`).
    - Example `curl` commands for each endpoint.

**Verification**
1. Run `npm run start:http`; verify the Express server starts without errors.
2. Execute `npm test`; all new and existing tests should pass, including the new `http-interface` tests.
3. Manually exercise endpoints (or via curl) to confirm:
   ```bash
   curl http://localhost:3000/health
   curl -X POST http://localhost:3000/digest \\
     -H "Content-Type: application/json" \\
     -d '{"key":"events/1.json","value":"12345","lastModified":"2025-05-21T...Z"}'
   curl -X POST http://localhost:3000/webhook -H "Content-Type: application/json" -d '{"foo":"bar"}'
   ```

No changes should be made outside `src/lib/main.js`, `tests/unit/http-interface.test.js`, `sandbox/README.md`, and `package.json`. Ensure all existing functionality remains unaffected.

LLM API Usage:

```json
{"prompt_tokens":7614,"completion_tokens":2002,"total_tokens":9616,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1216,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

