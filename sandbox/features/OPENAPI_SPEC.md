# Objective
Provide a machine-readable OpenAPI 3.0 specification for the MCP HTTP API server to enable automated discovery, validation, and integration of all available endpoints.

# Endpoint
## GET /openapi.json
- Description: Return a complete OpenAPI 3.0 document describing the MCP HTTP API.
- Response:
  • HTTP 200 with JSON body containing:
    {
      "openapi": "3.0.0",
      "info": {
        "title": "Agentic-lib MCP API",
        "version": "<package.json version>",
        "description": "OpenAPI spec for Model Contact Protocol HTTP API"
      },
      "paths": {
        "/health": { /* health check schema */ },
        "/mission": { /* mission retrieval schema */ },
        "/features": { /* feature list schema */ },
        "/invoke": { /* invoke request/response schema */ },
        "/stats": { /* stats schema */ }
      }
    }
- Behavior:
  • Dynamically import version field from package.json via ESM assert.
  • Construct document inline without external file reads.
  • Use logInfo to record each request to this endpoint.

# Success Criteria & Requirements
1. **Implementation**: Add a new route handler in sandbox/source/server.js for GET /openapi.json.
2. **Version**: Import version from package.json using ESM JSON assert to populate info.version.
3. **Structure**: Include paths for /health, /mission, /features, /invoke, and /stats with basic response schemas.
4. **Logging**: Log each /openapi.json request using existing logInfo utility.
5. **Compatibility**: Maintain Node 20 ESM compatibility, no external dependencies beyond express.

# Testing
## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock a GET request to /openapi.json and assert HTTP 200.
- Validate response body contains keys: openapi, info.version equal to mocked package.json version, and paths includes expected route keys.
- Spy on logInfo to ensure a log entry is generated.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Perform GET /openapi.json and assert:
  • Status 200
  • response.json().openapi === "3.0.0"
  • response.json().paths has keys for /health, /mission, /features, /invoke, /stats.

# Documentation
- **sandbox/docs/API.md**: Add a section under Endpoints:
  ### GET /openapi.json
  - Description: Download the OpenAPI specification for programmatic clients.
  - Example:
    ```bash
    curl http://localhost:3000/openapi.json
    ```
- **sandbox/README.md**: In the "MCP HTTP API" section, add a bullet:
  - `/openapi.json` – returns the API specification in OpenAPI 3.0 format for automated integration.