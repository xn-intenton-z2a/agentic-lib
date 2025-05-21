# agentic-lib HTTP Interface

This library now includes a built-in HTTP interface powered by Express. You can run it alongside the existing CLI mode to enable RESTful access to core functionalities.

## Getting Started

Install dependencies:

```bash
npm install
```

### Starting the HTTP Server

Run the server in HTTP mode:

```bash
npm run start:http
```

By default, the server listens on port 3000 (or the port defined in the `PORT` environment variable).

## API Endpoints

### GET /health

Returns service health and uptime.

**Request**

```bash
curl http://localhost:3000/health
```

**Response**

```json
{
  "status": "ok",
  "uptime": 1.234
}
```

### POST /digest

Accepts a JSON payload matching the digest schema and invokes the digest handler.

**Request**

```bash
curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d '{"key":"events/1.json","value":"12345","lastModified":"2025-05-21T00:00:00Z"}'
```

**Response**

```json
{
  "batchItemFailures": [],
  "handler": "sandbox/source/main.digestLambdaHandler"
}
```

### POST /webhook

Receives any JSON payload, logs it internally, and acknowledges receipt.

**Request**

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"foo":"bar"}'
```

**Response**

```json
{ "status": "received" }
```

## Additional Resources

- [MISSION.md](../MISSION.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)
