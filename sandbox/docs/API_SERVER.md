# HTTP API Server

The sandbox application exposes an HTTP API with the following endpoints:

## POST /digest

Accepts a JSON payload:

```json
{
  "key": "events/1.json",
  "value": "12345",
  "lastModified": "2025-01-01T00:00:00Z"
}
```

It invokes the `digestLambdaHandler` with an SQS event and returns:

- `200 OK` with `{ "success": true }` on success.
- `500 Internal Server Error` with `{ "error": "<message>" }` on failure.

## GET /health

Returns application health:

```json
{
  "status": "ok",
  "uptime": 123.45
}
```

## GET /version

Returns server version and timestamp:

```json
{
  "version": "6.8.2-0",
  "timestamp": "2025-05-25T12:34:56.789Z"
}
```

## Starting the Server

Use the CLI flag:

```bash
node sandbox/source/main.js --serve --port 3000
```

Or set environment variable:

```bash
HTTP_PORT=4000 node sandbox/source/main.js --serve
```
