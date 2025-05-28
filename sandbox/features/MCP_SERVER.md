# Objective
Extend the existing MCP HTTP server in `sandbox/source/server.js` to include robust request validation for incoming JSON payloads on all routes, leveraging Zod schemas to enforce shape and types and return clear, consistent HTTP 400 errors on invalid input.

# Validation Schemas

1. **InvocationSchema** (for POST /invoke)
   - `command`: string, one of "digest", "version", "help"
   - `args`: optional array of strings

# Implementation Details

- **Define Zod Schemas** in the server module:
  ```js
  import { z } from 'zod';

  const InvocationSchema = z.object({
    command: z.enum(['digest','version','help']),
    args: z.array(z.string()).optional(),
  });
  ```
- **Validation Middleware**:
  - Create a reusable middleware function that takes a Zod schema and applies it to `req.body`.
  - If parsing fails, respond with `HTTP 400` and JSON `{ error: <detailed Zod message> }` and call `logError`.
  - On success, forward `req.body` to the route handler.

- **Apply Middleware** to:
  - `POST /invoke`: validate with `InvocationSchema`.
  - Future JSON routes (e.g., `POST /issues`) can use their own schemas.

# Endpoints (with validation in place)

1. **POST /invoke**
   - Body validated against `InvocationSchema`.
   - On valid input, proceed with existing logic (digest, version, help) and increment `globalThis.callCount`.

2. **GET /health**, **GET /mission**, **GET /features**, **GET /stats**, **GET /openapi.json**, **GET /docs** remain unchanged except for validation where applicable (no body validation needed).

# Testing

- **Unit Tests** (`sandbox/tests/server.unit.test.js`):
  - Mock `InvocationSchema` to reject invalid bodies: send `{ command: "foo" }`, expect `400`, JSON `{ error }` and `logError` called.
  - Send a valid `POST /invoke` request: expect `200` and handler result.

- **Integration Tests** (`sandbox/tests/server.integration.test.js`):
  - Use Supertest to send invalid and valid `POST /invoke` bodies.
  - Assert correct status codes, error messages, and no unintended side effects when validation fails.

# Documentation & README

- **API Reference** (`sandbox/docs/API.md`):
  - Under **POST /invoke**, add a **Request Validation** section with schema example and sample invalid request / error response.

- **README** (`sandbox/README.md`):
  - In the **MCP HTTP API** section, note that request bodies are validated and invalid payloads yield HTTP 400 with error details.

# Dependencies & Constraints

- Use `zod` (already in dependencies).
- Implementation limited to `sandbox/source/server.js`, existing tests path, and documentation.
- Maintain Node 20 ESM compatibility.
