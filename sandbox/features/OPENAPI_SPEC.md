# Objective
Provide a machine-readable OpenAPI specification for the MCP HTTP API, enabling clients to discover and integrate endpoints programmatically. The OpenAPI JSON will describe all available routes, request parameters, response schemas, and HTTP status codes.

# Endpoint

## GET /openapi.json
- Description: Retrieve the OpenAPI 3.0 document for the MCP server.
- Response: HTTP 200 with JSON body containing the OpenAPI document:
  {
    "openapi": "3.0.0",
    "info": {
      "title": "Agentic-lib MCP API",
      "version": "<package.json version>",
      "description": "OpenAPI spec for Model Contact Protocol HTTP API"
    },
    "paths": {
      "/health": { ... },
      "/mission": { ... },
      "/features": { ... },
      "/invoke": { ... },
      "/stats": { ... }
    }
  }
- Behavior:
  • Dynamically import version from package.json.
  • Construct OpenAPI paths and component schemas inline in code.
  • No external file reads: spec defined in server source.

# Testing

- Unit Tests (sandbox/tests/server.unit.test.js):
  • Mock a request to GET /openapi.json to return a JSON object.
  • Validate top-level fields `openapi`, `info.version`, and presence of `paths` keys.
  • Assert HTTP status is 200.

- Integration Tests (sandbox/tests/server.integration.test.js):
  • Start the server and perform GET /openapi.json.
  • Verify status 200 and response JSON has `openapi` equal to "3.0.0" and that `/health` path is documented.

# Documentation

- Update sandbox/docs/API.md:
  • Add a section under Endpoints:
    ### GET /openapi.json
    - Description: Download the OpenAPI spec for programmatic integration.
    - Example:
      ```bash
      curl http://localhost:3000/openapi.json
      ```
    - Sample Response:
      ```json
      { "openapi": "3.0.0", "info": { "version": "6.10.3-0" }, "paths": { ... } }
      ```

- Update sandbox/README.md:
  • In the "MCP HTTP API" section, add a bullet:
    - `/openapi.json` – returns the OpenAPI specification for automated clients.

# Dependencies & Constraints

- Use only built-in JavaScript objects and dynamic import of package.json.
- Maintain Node 20 ESM compatibility.
- Implementation within `sandbox/source/server.js` and updates to tests and documentation only.