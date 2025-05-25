# HTTP Server

This document describes the HTTP server available in the sandbox CLI, providing health, metrics, and digest endpoints.

## Starting the Server

You can start the HTTP server using npm scripts or directly via Node.js:

```bash
npm run serve
# or
node sandbox/source/main.js --serve [--port <number>] [--stats]
```

- `--port <number>`: Port to listen on (default `3000` or `process.env.PORT`).
- `--stats`: (Reserved) Include detailed stats logging on startup.

## Endpoints

### GET /health

Check the health of the server.

- **Response**: `200 OK`
- **Body**: `{ "status": "ok" }`

**Example**:
```bash
curl -X GET http://localhost:3000/health
```

### GET /metrics

Retrieve uptime and total request count since server start.

- **Response**: `200 OK`
- **Body**: 
```json
{
  "uptime": 12.345,       // seconds
  "callCount": 5         // total requests handled
}
```

**Example**:
```bash
curl -X GET http://localhost:3000/metrics
```

### POST /digest

Accept a JSON payload describing a digest message, validate its shape, and process via the existing Lambda handler.

- **Request Body**:
```json
{
  "key": "events/1.json",
  "value": "12345",
  "lastModified": "2025-01-01T00:00:00.000Z"
}
```

- **Responses**:
  - `200 OK`: Payload valid and successfully processed.
  - `400 Bad Request`: Payload validation failed. Response includes validation errors.
  - `500 Internal Server Error`: Processing error.

**Example**:
```bash
curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d '{"key":"events/1.json","value":"12345","lastModified":"2025-01-01T00:00:00.000Z"}'
```