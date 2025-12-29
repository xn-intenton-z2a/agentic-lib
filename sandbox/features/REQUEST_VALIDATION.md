# Objective
Provide robust request payload validation for MCP HTTP server endpoints using Zod schemas to enforce input shape, preventing runtime errors and improving API reliability.

# Validation Schemas

## InvocationSchema
- Validate POST /invoke payload:
  • command: one of "digest","version","help"
  • args: optional array of strings

## IssueCreateSchema
- Validate POST /issues payload:
  • title: non-empty string
  • body: optional string

# Implementation
1.  In sandbox/source/server.js, import Zod and define `InvocationSchema` and `IssueCreateSchema`.
2.  Create a generic validation middleware:
    ```js
    function validate(schema) {
      return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
          const message = result.error.flatten().formErrors.join(", ");
          logError(message);
          return res.status(400).json({ error: message });
        }
        next();
      };
    }
    ```
3.  Apply middleware:
    - POST /invoke: `validate(InvocationSchema)` before handler logic.
    - POST /issues: `validate(IssueCreateSchema)` before handler logic.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Simulate invalid bodies for POST /invoke and POST /issues and assert HTTP 400 with descriptive error JSON and a `logError` call.
- Simulate valid bodies and assert handlers proceed correctly (mock downstream behavior).

## Integration Tests (sandbox/tests/server.integration.test.js)
- Send invalid and valid requests to `/invoke` and `/issues` and verify status codes and response shapes.

# Documentation

## sandbox/docs/API.md
- Under POST /invoke and POST /issues, add **Request Validation** section with schema definitions and sample invalid request/response.

## sandbox/README.md
- In **MCP HTTP API**, note that request bodies are validated and invalid payloads yield HTTP 400 with error details.
