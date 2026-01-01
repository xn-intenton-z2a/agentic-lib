# Objective
Provide robust request payload validation for the MCP HTTP server endpoints to enforce input shapes, prevent runtime errors, and improve API reliability.

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

1. In sandbox/source/server.js, import Zod and define InvocationSchema and IssueCreateSchema:
   ```js
   import { z } from 'zod';
   const InvocationSchema = z.object({
     command: z.enum(['digest','version','help']),
     args: z.array(z.string()).optional(),
   });
   const IssueCreateSchema = z.object({
     title: z.string().min(1),
     body: z.string().optional(),
   });
   ```
2. Create a generic validation middleware:
   ```js
   function validate(schema) {
     return (req, res, next) => {
       const result = schema.safeParse(req.body);
       if (!result.success) {
         const message = result.error.flatten().formErrors.join(', ');
         logError(message);
         return res.status(400).json({ error: message });
       }
       next();
     };
   }
   ```
3. Apply middleware in sandbox/source/server.js before route handlers:
   - POST /invoke: validate(InvocationSchema)
   - POST /issues: validate(IssueCreateSchema)

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Simulate invalid POST /invoke payload and assert HTTP 400 with error JSON and a logError call.
- Simulate valid payload and assert handler logic proceeds unchanged.
- Repeat for POST /issues with missing title to assert HTTP 400 error.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Send invalid and valid requests to /invoke and /issues via Supertest and assert status codes and response shapes.

# Documentation

1. sandbox/docs/API.md under POST /invoke and POST /issues:
   - Add **Request Validation** section with schema definitions and sample error response.
2. sandbox/README.md under MCP HTTP API:
   - Note that request bodies are validated and invalid payloads return HTTP 400 with error details.
