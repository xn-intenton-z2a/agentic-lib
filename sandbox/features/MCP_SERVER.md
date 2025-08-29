# Objective
Consolidate and fully document the Model Contact Protocol (MCP) HTTP server in sandbox/source/server.js, exposing all agentic-lib core functionality via a unified Express API. This feature will incorporate service health checks, mission retrieval, command discovery, secure invocation of digest/version/help commands with authentication and request validation, real-time statistics, machine-readable OpenAPI specification, interactive Swagger UI, and GitHub issue management into a single cohesive implementation.

# Endpoints

## GET /health
- Description: Verify the server is running.
- Response: HTTP 200 with JSON:
  {
    "status": "ok",
    "timestamp": "<ISO 8601 timestamp>"
  }

## GET /mission
- Description: Return the contents of sandbox/MISSION.md.
- Success: HTTP 200 and JSON { "mission": "<file content>" }.
- Failure: HTTP 404 and JSON { "error": "Mission file not found" }.

## GET /features
- Description: List available commands for remote invocation.
- Response: HTTP 200 and JSON array ["digest","version","help"].

## POST /invoke
- Description: Securely invoke library commands via JSON body:
    {
      "command": string,    // Required, one of "digest","version","help"
      "args": [string]      // Optional arguments
    }
- Validation: Request payload is validated; invalid or unsupported commands return HTTP 400 with JSON { "error": "<message>" }.
- Behavior:
  • digest: parse args[0] as JSON or default to {}. Create SQS event via createSQSEventFromDigest(), await digestLambdaHandler(), respond HTTP 200 with { "result": <handler output> }.
  • version: import version from package.json via ESM assert, respond HTTP 200 with { "version": <version>, "timestamp": <ISO> }.
  • help: call generateUsage(), respond HTTP 200 with plain text or JSON usage.
  • After any successful invocation, increment globalThis.callCount.

## GET /stats
- Description: Retrieve real-time runtime metrics for monitoring.
- Response: HTTP 200 with JSON:
  {
    "callCount": <number>,    // Total successful POST /invoke calls since server start
    "uptime": <number>,       // Seconds since server start
    "memoryUsage": {          // process.memoryUsage() output
      "rss": <number>,
      "heapTotal": <number>,
      "heapUsed": <number>,
      "external": <number>
    }
  }
- Behavior: Read globalThis.callCount, process.uptime(), process.memoryUsage(), and log metrics via logInfo.

## GET /issues
- Description: List open GitHub issues via listIssues() from src/lib/main.js.
- Response: HTTP 200 with JSON array of issue objects (number, title, body, state, url).

## POST /issues
- Description: Create a new GitHub issue via JSON body { title: string, body?: string }.
- Validation: title is required; invalid payload returns HTTP 400 with JSON { "error": "Title is required" }.
- Behavior: Call createIssue() from src/lib/main.js. On success, HTTP 201 with created issue; on error, HTTP 500 with JSON { "error": <message> }.

## GET /openapi.json
- Description: Provide a machine-readable OpenAPI 3.0 specification for the MCP HTTP API.
- Response: HTTP 200 with JSON OpenAPI document (openapi, info.version, paths for all endpoints).
- Behavior: Dynamically import version, construct spec inline, log via logInfo.

## GET /docs
- Description: Serve interactive Swagger UI at /docs using swagger-ui-express.
- Response: HTTP 200 with HTML UI.
- Behavior: Mount swaggerUi.serve and swaggerUi.setup(openapiSpec) without disrupting existing routes.

# Security & Validation
- **Authentication**: Apply API key middleware requiring `x-api-key` for all protected endpoints; valid keys are loaded from `API_KEYS` environment variable.
- **Request Validation**: Use Zod schemas to validate JSON payloads for POST /invoke and POST /issues, rejecting invalid requests with HTTP 400 and detailed error messages.

# Logging & Startup
- Use `logInfo` middleware to log every request method and path.
- Use `logError` to capture handler errors, including stack traces when verbose.
- Initialize `globalThis.callCount = 0` in src/lib/main.js.
- Export default Express app; when `NODE_ENV !== 'test'`, listen on `process.env.PORT || 3000`.

# Testing
- **Unit Tests**: `sandbox/tests/server.unit.test.js` should mock dependencies (fs, process methods, handlers, listIssues, createIssue, swaggerUi) and verify each endpoint, validation, and logging behavior.
- **Integration Tests**: `sandbox/tests/server.integration.test.js` should start the server, perform end-to-end requests for all endpoints, and assert HTTP statuses, response shapes, and HTML content for `/docs`.

# Documentation
- Update `sandbox/docs/API.md` and `sandbox/README.md` to document all endpoints, authentication, validation schemas, request/response examples (cURL and fetch), and configuration instructions.