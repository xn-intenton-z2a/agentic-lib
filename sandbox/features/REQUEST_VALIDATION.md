# Objective
Provide robust request payload validation for MCP HTTP server endpoints, ensuring incoming JSON bodies for commands and issue operations conform to expected shapes and improve API reliability.

# Validation Schemas

1. InvocationSchema
   - command: one of "digest","version","help"
   - args: optional array of strings

2. IssueCreateSchema
   - title: non-empty string
   - body: optional string

# Implementation

- Import Zod in sandbox/source/server.js and define InvocationSchema and IssueCreateSchema.
- Create a generic validation middleware:
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
- Apply middleware:
  - POST /invoke: validate against InvocationSchema
  - POST /issues: validate against IssueCreateSchema

# Success Criteria

- Invalid payloads yield HTTP 400 with descriptive error JSON and a logError entry.
- Valid requests proceed to existing handlers without change.
- No effect on GET endpoints or non-JSON routes.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Simulate invalid bodies for POST /invoke and POST /issues and assert HTTP 400 and error JSON.
- Simulate valid payloads and assert handlers run (mock downstream logic).

## Integration Tests (sandbox/tests/server.integration.test.js)
- Send invalid and valid requests to `/invoke` and `/issues` with Supertest.
- Verify status codes, response shapes, and that valid requests trigger handler behavior.

# Documentation

- Update sandbox/docs/API.md:
  - Under POST /invoke and POST /issues, add **Request Validation** section with schema and error example.
- Update sandbox/README.md:
  - In **MCP HTTP API**, note validation and HTTP 400 error behavior for invalid payloads.
