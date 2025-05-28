# Objective
Provide an interactive Swagger UI interface for the MCP HTTP API so that developers can explore and test endpoints in a browser-based graphical interface.

# Implementation
1. Add `swagger-ui-express` as a dependency in `package.json`.
2. In `sandbox/source/server.js`:
   • Import `swaggerUi` and `setupOptions` from `swagger-ui-express`.
   • Dynamically import or build the existing OpenAPI spec (via GET `/openapi.json`) as `openapiSpec`.
   • Mount the middleware before other routes:
     ```js
     app.use(
       '/docs',
       swaggerUi.serve,
       swaggerUi.setup(openapiSpec)
     );
     ```
   • Ensure the `/docs` route returns an HTML UI without interfering with existing endpoints.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock the OpenAPI spec builder to return a known object.
- Mock `swaggerUi.serve` and `swaggerUi.setup` functions.
- Verify GET `/docs` responds with HTTP 200 and `Content-Type: text/html`.
- Spy on `logInfo` to confirm that a request to `/docs` is logged.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start the server with `createServer(app)` in Vitest async hooks.
- Perform a GET request to `/docs`:
  • Assert status 200.
  • Assert response text contains the element `SwaggerUIBundle`.
- Verify existing endpoints remain functional when `/docs` is mounted.

# Documentation

## `sandbox/docs/API.md`
Add a section for `/docs`:
```markdown
### GET /docs
- Description: Serve an interactive Swagger UI for the MCP HTTP API.
- Browser URL: http://localhost:3000/docs
- Example:
  ```bash
  curl http://localhost:3000/docs
  ```
```  

## `sandbox/README.md`
Under **MCP HTTP API**, add:
- `/docs` – launches the interactive Swagger UI in your browser.  
  ```bash
  npm start
  open http://localhost:3000/docs
  ```