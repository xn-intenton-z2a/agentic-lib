# Objective
Provide a machine-readable OpenAPI 3.0 specification endpoint for the MCP HTTP API server, enabling automated clients to discover and integrate available routes programmatically.

# Endpoint

## GET /openapi.json
- Description: Retrieve the complete OpenAPI 3.0 document describing all MCP routes and schemas.
- Response: HTTP 200 with JSON body:
  {
    "openapi": "3.0.0",
    "info": {
      "title": "Agentic-lib MCP API",
      "version": "<package.json version>",
      "description": "OpenAPI specification for the MCP HTTP API"
    },
    "paths": {
      "/health": { /* health check schema */ },
      "/mission": { /* mission retrieval schema */ },
      "/features": { /* features list schema */ },
      "/invoke": { /* invoke schema */ },
      "/stats": { /* stats schema */ },
      "/issues": { /* issues schema */ }
    }
  }
- Behavior:
  • Dynamically read version from package.json via ESM JSON import.
  • Construct document inline in server code without external file reads.
  • Use logInfo to record each request to this endpoint.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock a GET request to /openapi.json and assert HTTP 200.
- Validate response JSON has 'openapi' equal to "3.0.0" and 'info.version' matches mocked package.json version.
- Assert 'paths' includes keys: /health, /mission, /features, /invoke, /stats, /issues.
- Spy on logInfo to confirm a log entry is generated.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Perform GET /openapi.json:
  • Expect status 200.
  • Response JSON.openapi === "3.0.0".
  • Response JSON.paths includes required route keys.

# Documentation

- **sandbox/docs/API.md**:
  ### GET /openapi.json
  - Description: Download the OpenAPI 3.0 specification for the MCP HTTP API.
  - Example:
    ```bash
    curl http://localhost:3000/openapi.json
    ```
  - Sample Response:
    ```json
    { "openapi": "3.0.0", "info": { "version": "6.10.3-0" }, "paths": { "/health": {}, ... } }
    ```

- **sandbox/README.md**:
  - Add bullet under "MCP HTTP API":
    - `/openapi.json` – returns the machine-readable OpenAPI spec for automated integration.
