# Agentic Handler

This document describes the new AI-driven issue analysis feature, including CLI usage and HTTP API.

## CLI Usage

Use the `--agentic` flag followed by a GitHub issue URL or ID to generate structured suggestions using OpenAI.

Example:
```bash
npx agentic-lib --agentic https://github.com/owner/repo/issues/123
```
Response:
```json
{
  "suggestions": [
    { "description": "Add more tests" },
    { "description": "Document edge cases" }
  ]
}
```

## HTTP API

A built-in HTTP server can be started with the `--serve` flag. It listens on port `3000` (or `$PORT`).

### Start server
```bash
npx agentic-lib --serve
```

### Endpoint: POST /agentic

Request:
```http
POST /agentic HTTP/1.1
Content-Type: application/json

{ "issueUrl": "https://github.com/owner/repo/issues/123" }
```

Successful response (HTTP 200):
```json
{
  "suggestions": [ ... ]
}
```

Error responses:
- HTTP 400: invalid input or GitHub fetch error
- HTTP 500: OpenAI service error or internal error
```json
{ "error": { "message": "Detailed error message" } }
```