# Objective
Provide robust request payload validation for all MCP HTTP server endpoints using Zod schemas. This ensures that incoming JSON bodies for commands and issue operations conform to expected shapes, preventing runtime errors and improving API reliability.

# Validation Schemas
1. InvocationSchema
   - command: string (one of "digest", "version", "help")
   - args: optional array of strings
2. IssueListSchema
   - No body for GET /issues
3. IssueCreateSchema
   - title: non-empty string
   - body: optional string

# Implementation
- In `sandbox/source/server.js` import Zod and define schemas: `InvocationSchema`, `IssueCreateSchema`.
- Add a validation middleware for routes:
  • For POST /invoke: validate `req.body` against `InvocationSchema`; on failure, respond HTTP 400 `{ error: <detailed Zod message> }`.
  • For POST /issues: validate `req.body` against `IssueCreateSchema`; on failure, respond HTTP 400.
- Fail-fast: middleware rejects invalid payloads before handler logic.

# Testing
- Unit Tests (`sandbox/tests/server.unit.test.js`):
  • Simulate invalid bodies for POST /invoke and POST /issues and assert HTTP 400 and descriptive error JSON.
  • Simulate valid bodies and assert handlers proceed (mock downstream behavior).
- Integration Tests (`sandbox/tests/server.integration.test.js`):
  • Send invalid and valid requests to `/invoke` and `/issues` and verify correct status codes and response shapes.

# Documentation
- Update `sandbox/docs/API.md`:
  • Under Endpoints, note request body schemas:
    - POST /invoke expects `{ command: string, args?: string[] }`
    - POST /issues expects `{ title: string, body?: string }`
  • Provide example invalid request and error response.
- Update `sandbox/README.md`:
  • In MCP HTTP API section, mention that request validation is applied and invalid payloads yield HTTP 400 with error details.