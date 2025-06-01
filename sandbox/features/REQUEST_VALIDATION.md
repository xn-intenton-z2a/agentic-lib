# Objective
Leverage Zod schemas to validate incoming JSON payloads on core MCP server routes, ensuring robust request validation, clear error responses, and improved API reliability.

# Validation Schemas

- Define a Zod schema `InvocationSchema` for POST /invoke:
  • `command`: enum of digest, version, help
  • `args`: optional array of strings
- Define a Zod schema `IssueCreateSchema` for POST /issues:
  • `title`: non-empty string
  • `body`: optional string

# Implementation

1. **Add Middleware**
   - Create a reusable validation middleware in `sandbox/source/server.js` that accepts a Zod schema and:
     - Parses and validates `req.body`, calling `next()` on success.
     - On failure, uses `logError` and responds with HTTP 400 JSON `{ error: <detailed Zod message> }`.
2. **Apply Middleware**
   - Attach validation middleware before handlers for:
     - `POST /invoke` with `InvocationSchema`.
     - `POST /issues` with `IssueCreateSchema`.
3. **Error Handling**
   - Ensure invalid requests never reach business logic.
   - Maintain existing logging and status conventions.

# Testing

- **Unit Tests** (`sandbox/tests/server.unit.test.js`):
  • Mock invalid bodies for `/invoke` and `/issues`, assert HTTP 400 and descriptive error JSON.
  • Test valid bodies proceed to original handlers (mock downstream functions).  
- **Integration Tests** (`sandbox/tests/server.integration.test.js`):
  • Send invalid and valid requests via Supertest to `/invoke` and `/issues`, verifying status codes and payload behavior.

# Documentation

- **API Reference** (`sandbox/docs/API.md`):
  • Add a **Request Validation** section under `POST /invoke` and `POST /issues`, showing schema definitions and sample invalid requests with error responses.
- **README** (`sandbox/README.md`):
  • Note that request bodies are validated using Zod and invalid payloads yield HTTP 400 with detailed messages.
