# Objective
Extend and consolidate the existing Model Contact Protocol (MCP) HTTP server in sandbox/source/server.js with a machine-readable OpenAPI 3.0 specification endpoint to enable automated discovery and integration. This will complement health checks, mission retrieval, command invocation, statistics, and issue management in a unified Express API.

# Endpoints

## GET /openapi.json
- Description: Retrieve a complete OpenAPI 3.0 document describing all MCP server routes and schemas.
- Response: HTTP 200 with JSON body containing:
  {
    "openapi": "3.0.0",
    "info": {
      "title": "Agentic-lib MCP API",
      "version": "<package.json version>",
      "description": "OpenAPI spec for MCP HTTP API"
    },
    "paths": {
      "/health": { /* health check schema */ },
      "/mission": { /* mission retrieval schema */ },
      "/features": { /* feature list schema */ },
      "/invoke": { /* invoke request/response schema */ },
      "/stats": { /* stats schema */ },
      "/issues": { /* issue list/create schema */ }
    }
  }
- Behavior:
  • Dynamically import version from package.json via ESM JSON assert.
  • Construct the OpenAPI document inline in server code without external file reads.
  • Use logInfo to record each request to this endpoint.

# Implementation Details

1. **Route Handler**: Add a new route in sandbox/source/server.js:
   ```js
   app.get('/openapi.json', (req, res) => {
     const spec = generateOpenApiSpec();
     logInfo('OpenAPI spec requested');
     res.status(200).json(spec);
   });
   ```
2. **Spec Generator**: Implement a helper function `generateOpenApiSpec()` in the same file or imported, building the document structure and reading package.json version.
3. **Logging**: Use existing logInfo utility to log when spec is served.
4. **Startup**: No changes to server startup logic; the endpoint is available when NODE_ENV !== 'test'.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock `generateOpenApiSpec()` to return a known object.
- Use Supertest to GET /openapi.json and assert:
  • HTTP status 200
  • Response body contains `openapi` property equal to "3.0.0".
  • `info.version` matches the mocked version.
  • `paths` includes keys for /health, /mission, /features, /invoke, /stats, /issues.
- Spy on `logInfo` to verify it is called once with 'OpenAPI spec requested'.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Perform GET /openapi.json and assert:
  • Status 200
  • JSON response has `openapi === '3.0.0'` and `paths` includes required route keys.

# Documentation

1. **sandbox/docs/API.md**:
   ```markdown
   ### GET /openapi.json
   - Description: Download the OpenAPI 3.0 specification for the MCP HTTP API.
   - Example request:
     ```bash
     curl http://localhost:3000/openapi.json
     ```
   - Sample response:
     ```json
     { "openapi": "3.0.0", "info": { "version": "6.10.3-0" }, "paths": { "/health": {...}, ... } }
     ```
   ```
2. **sandbox/README.md**:
   - In the "MCP HTTP API" section, add:
     - `/openapi.json` – returns the API specification in OpenAPI 3.0 format for programmatic clients.
