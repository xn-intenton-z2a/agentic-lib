# Objective
Extend and consolidate the Model Contact Protocol (MCP) HTTP server in `sandbox/source/server.js` to expose core agentic-lib functionality via a unified Express API. This feature will provide health checks, mission retrieval, command invocation, real-time statistics, and issue management.

# Endpoints

## GET /health
- Verify the server is running.
- Response: HTTP 200 with JSON:
  ```json
  { "status": "ok", "timestamp": "<ISO 8601>" }
  ```

## GET /mission
- Return the content of `sandbox/MISSION.md`.
- Success: HTTP 200 and JSON `{ "mission": "<file content>" }`.
- Failure: HTTP 404 and JSON `{ "error": "Mission file not found" }`.

## GET /features
- List available commands for remote invocation.
- Response: HTTP 200 and JSON array: `["digest","version","help"]`.

## POST /invoke
- Invoke a library command via JSON `{ command: string, args?: string[] }`.
- Validation: unsupported commands return HTTP 400 `{ "error": "Unsupported command" }`.
- Behavior:
  - **digest**: parse `args[0]` as JSON or default to `{}`, create SQS event via `createSQSEventFromDigest()`, call `digestLambdaHandler()`, respond HTTP 200 `{ "result": <handler output> }`, increment invocation counter.
  - **version**: read version from `package.json`, respond HTTP 200 `{ "version": <string>, "timestamp": <ISO> }`, increment counter.
  - **help**: call `generateUsage()`, respond HTTP 200 plain text or JSON usage, increment counter.

## GET /stats
- Retrieve runtime metrics for monitoring and observability.
- Response: HTTP 200 with JSON:
  ```json
  {
    "callCount": <number>,
    "uptime": <seconds since start>,
    "memoryUsage": {
      "rss": <bytes>,
      "heapTotal": <bytes>,
      "heapUsed": <bytes>,
      "external": <bytes>
    }
  }
  ```
- Behavior: read global invocation counter, use `process.uptime()`, `process.memoryUsage()`, and log metrics via `logInfo`.

## GET /issues
- List open GitHub issues via `listIssues()` from core library.
- Response: HTTP 200 and JSON array of issue objects.

## POST /issues
- Create a new GitHub issue via JSON `{ title: string, body?: string }`.
- Validation: `title` required; invalid payload returns HTTP 400.
- Behavior: call `createIssue()`, respond HTTP 201 with created issue object.

# Logging & Startup
- Use `logInfo` middleware to record each request method and path.
- Use `logError` to capture handler errors.
- Initialize `globalThis.callCount = 0` before server start.
- Export default Express `app`; listen on configured port when `NODE_ENV !== 'test'`.

# Testing
- **Unit Tests**: mock file reads, invocation counter, uptime, memory usage; verify each endpoint status, response shape, and logging.
- **Integration Tests**: start server via Supertest; end-to-end verify all endpoints including `/stats`, `/issues`.

# Documentation
- Update `sandbox/docs/API.md` and `sandbox/README.md` to document all endpoints with examples and usage instructions.