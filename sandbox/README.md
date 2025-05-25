# Sandbox HTTP Server Documentation

This sandbox provides an HTTP server implementation with health, metrics, and digest endpoints for testing and development purposes.

## Starting the Server

You can start the HTTP server using one of the following commands:

```bash
# Using the npm script defined in package.json
dnpm run serve

# Or directly with node
dnode sandbox/source/main.js --serve [--port <number>] [--stats]
```

Options:
- `--serve`: Launch the HTTP server.
- `--port <number>`: Specify the port to listen on (default: `3000`).
- `--stats`: Enable the `/metrics` endpoint alongside basic health checks.

## Endpoints

### GET /health

Checks if the server is running and healthy.

Request:
```bash
curl http://localhost:3000/health
```

Response:
- Status: `200 OK`
- Body:  JSON object with a single field:
  ```json
  { "status": "ok" }
  ```

### GET /metrics

Returns runtime metrics including uptime and total request count.

Request:
```bash
curl http://localhost:3000/metrics
```

Response:
- Status: `200 OK`
- Body: JSON object with the following fields:
  ```json
  {
    "uptime": 123.45,      // Uptime in seconds
    "callCount": 10       // Total number of handled requests
  }
  ```

### POST /digest

Accepts a JSON payload, validates it against a Zod schema, and forwards it to the existing digest handler.

Payload schema:
- `key`: string (resource identifier)
- `value`: string (payload content)
- `lastModified`: ISO timestamp string

Request example:
```bash
curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d '{
    "key": "events/1.json",
    "value": "12345",
    "lastModified": "2025-05-25T19:31:20.034Z"
  }'
```

Responses:
- `200 OK`: Payload passed validation and processed by the digest handler.
- `400 Bad Request`: Validation failed; response body includes error details.

```json
{
  "errors": [
    { "path": ["key"], "message": "Expected string, received number" }
  ]
}
```

## Usage in Tests

The sandbox tests (`sandbox/tests/main.test.js`) include automated checks for these endpoints using `supertest`. Run the full test suite with:

```bash
npm test
```
