# Objective
Provide an interactive Swagger UI for the MCP HTTP API to enable developers to explore and test endpoints in a browser-based interface.

# Implementation
1. Add swagger-ui-express as a new dependency in package.json.
2. In sandbox/source/server.js import swaggerUi from "swagger-ui-express" and dynamically import or require the existing OpenAPI spec from the GET /openapi.json handler.
3. Mount Swagger UI middleware before other routes:
   • app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
4. Ensure that visiting /docs returns the interactive HTML UI without altering existing endpoints or file structure.

# Testing
- Unit Tests (sandbox/tests/server.unit.test.js):
  • Mock swaggerUi.serve and swaggerUi.setup.
  • Verify GET /docs returns HTTP 200 and Content-Type text/html.
- Integration Tests (sandbox/tests/server.integration.test.js):
  • Start the server via createServer(app).
  • Request GET /docs and assert status 200 and response text includes "SwaggerUIBundle".

# Documentation
- Update sandbox/docs/API.md:
  • Add a section for /docs describing its purpose and provide a browser URL example.
- Update sandbox/README.md:
  • Under "MCP HTTP API" add a bullet pointing to the interactive docs at http://localhost:3000/docs with startup instructions.