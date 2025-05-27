# Objective

Fully consolidate the Model Contact Protocol (MCP) HTTP server in sandbox/source/server.js to support all core functionality over a single Express API. This unified server will provide health checks, mission retrieval, command invocation, runtime statistics, and a machine-readable OpenAPI specification.

# Endpoints

## GET /health
- Verify the server is running
- Response 200 JSON:
  {
    "status": "ok",
    "timestamp": "<ISO 8601 timestamp>"
  }

## GET /mission
- Return sandbox/MISSION.md content
- On success: 200 JSON { "mission": <file content> }
- On failure: 404 JSON { "error": "Mission file not found" }

## GET /features
- List available commands: ["digest", "version", "help"]
- Response 200 JSON array

## POST /invoke
- Invoke a library command remotely via JSON { command: string, args?: string[] }
- Supported commands: digest, version, help
- Validation: unsupported -> 400 JSON { "error": "Unsupported command" }
- digest:
  • Parse args[0] as JSON or use empty object
  • Create SQS event via createSQSEventFromDigest
  • Await digestLambdaHandler(event), respond 200 JSON { "result": <handler output> }
  • Increment globalThis.callCount
- version:
  • Import version from package.json via ESM assert
  • Respond 200 JSON { "version": <version>, "timestamp": <ISO timestamp> }
  • Increment globalThis.callCount
- help:
  • Call generateUsage(), respond 200 plain text or JSON
  • Increment globalThis.callCount

## GET /stats
- Retrieve runtime metrics
- Response 200 JSON:
  {
    "callCount": <number>,
    "uptime": <seconds since start>,
    "memoryUsage": { rss, heapTotal, heapUsed, external }
  }
- Behavior:
  • globalThis.callCount (successful invokes)
  • process.uptime()
  • process.memoryUsage()
  • Log metrics via logInfo

## GET /openapi.json
- Provide OpenAPI 3.0 spec for all endpoints
- Response 200 JSON with keys:
  {
    "openapi": "3.0.0",
    "info": { title, version from package.json, description },
    "paths": { "/health", "/mission", "/features", "/invoke", "/stats", "/openapi.json" }
  }

# Logging & Startup

- Middleware logInfo for all requests
- logError for handler errors
- Initialize globalThis.callCount = 0 in src/lib/main.js
- Export default Express app
- Listen on process.env.PORT or 3000 when NODE_ENV !== test

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock fs/promises.readFile for /mission
- Stub globalThis.callCount, process.uptime(), process.memoryUsage()
- Test GET /health, /mission (success/failure), /features, POST /invoke (digest/version/help/invalid), GET /stats, GET /openapi.json
- Verify responses, status codes, JSON shape, and logInfo calls

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks
- E2E verify all endpoints: /health, /mission, /features, /invoke, /stats, /openapi.json
- Assert correct HTTP status and response structure

# Documentation

## sandbox/docs/API.md
- Document each endpoint with cURL and fetch examples
- Include response schemas

## sandbox/README.md
- "MCP HTTP API" section summarizing endpoints
- Startup instructions (npm start, PORT env)
- Link to API.md, MISSION.md, CONTRIBUTING.md, LICENSE, repo
- Statistics and OpenAPI bullets
